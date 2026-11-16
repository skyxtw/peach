"""DMM 的 GraphQL 目录套进站点解析器契约：cid 推导与搜索匹配、发售日换算、payload 逐键钉住，以及失败分档。"""
import json
import re
import unittest
from unittest.mock import Mock, patch

from peach.http import HttpResponse
from peach.jav_cover_fetch import Unavailable
from peach.library_processing import LibraryMetadataProvider
from peach.scraping_access import SourcePaused
from peach.sources import DMM, DmmSource, FailureReason, Page, Session, SourceFailure
from peach.sources.dmm import (ACTRESS_WORKS_QUERY, DETAIL_ATTEMPTS, DETAIL_QUERY, MAKER_WORKS_QUERY, SEARCH_LIMIT,
                               SEARCH_QUERY, code_parts, code_from_cid, guessed_cid, matching_cids, release_date)
from peach.metadata import relayed

ENDPOINT = "https://api.video.dmm.co.jp/graphql"
PAGE_URL = "https://video.dmm.co.jp/av/content/?id=ssis00057"
COVER = "https://awsimgsrc.dmm.co.jp/pics_dig/digital/video/ssis00057/ssis00057pl.jpg"
SAMPLE = "https://awsimgsrc.dmm.co.jp/pics_dig/digital/video/ssis00057/ssis00057-1.jpg"
#: 2026-09-24 实测 `ppvContent(id: "ssis00057")` 的响应，简介截短。
ITEM = {"id": "ssis00057", "title": "パンティーストッキングマニア 三宮つばき", "description": "新人OLの‘つばき’は才色兼備で",
        "makerContentId": "SSIS-057", "makerReleasedAt": "2021-05-06T15:00:00Z", "duration": 9069,
        "maker": {"id": "3152", "name": "エスワン ナンバーワンスタイル"}, "label": {"id": "3474", "name": "S1 NO.1 STYLE"},
        "series": None, "actresses": [{"id": "1062909", "name": "三宮つばき"}], "directors": [{"id": "110733", "name": "肉尊"}],
        "genres": [{"id": "6017", "name": "ギリモザ"}, {"id": "4025", "name": "単体作品"}],
        "packageImage": {"largeUrl": COVER, "mediumUrl": COVER.replace("pl.jpg", "ps.jpg")},
        "sampleImages": [{"imageUrl": SAMPLE}]}
FKOS = {"id": "h_1721fkos00006", "title": "個人撮影6", "makerContentId": "FKOS-006", "makerReleasedAt": "2023-01-19T15:00:00Z",
        "duration": 3600, "maker": {"id": "1", "name": "FKOS"}, "actresses": [], "genres": [], "packageImage": None}
#: `LibraryMetadataProvider.query('SSIS-057', 'dmm')` 对这份夹具交出的 dict，逐键钉住。
EXPECTED = {
    "id": "SSIS-057", "content_id": "ssis00057", "source_url": PAGE_URL, "title": "パンティーストッキングマニア 三宮つばき",
    "maker": "エスワン ナンバーワンスタイル", "label": "S1 NO.1 STYLE", "series": "", "director": "肉尊",
    "release_date": "2021-05-07", "runtime": 151.15, "cover_urls": [COVER], "cover_url": COVER,
    "actresses": [{"japanese_name": "三宮つばき", "dmm_id": "1062909"}], "genres": ["ギリモザ", "単体作品"],
    "description": "新人OLの‘つばき’は才色兼備で", "sample_images": [SAMPLE], "raw": ITEM}


def graphql(contents=None, items=None):
    """假接口：按请求体里的查询与变量答复。`contents` 是搜索结果的 cid 列，`items` 是 cid → 商品或异常。"""
    calls = []
    items = items or {}

    def call(request, timeout, limit):
        payload = json.loads(request.body)
        variables = payload["variables"]
        calls.append((request.method, request.url, request.headers.get("Referer"), request.headers.get("Content-Type"),
                      limit, payload["query"], variables))
        if payload["query"] == SEARCH_QUERY:
            body = {"data": {"legacySearchPPV": {"result": {"contents": [{"id": cid} for cid in contents or []]}}}}
        else:
            item = items.get(variables["id"])
            if isinstance(item, Exception):
                raise item
            body = {"data": {"ppvContent": item}}
        return HttpResponse(200, {}, json.dumps(body, ensure_ascii=False).encode(), request.url)

    call.calls = calls
    return call


def asked(transport):
    """这趟发了哪几条查询：`('detail', cid)` 或 `('search', 关键词)`。"""
    return [("search", variables["queryWord"]) if query == SEARCH_QUERY else ("detail", variables["id"])
            for _, _, _, _, _, query, variables in transport.calls]


class CodeMappingTests(unittest.TestCase):
    def test_dmm_product_identity_keeps_the_release_suffix_and_uses_the_dmm_namespace(self):
        for product, expected in {"1dandy00899": "DANDY-899", "118abw00220": "ABW-220",
                                  "h_086iqqq00026": "IQQQ-026", "1dandy00851c": "DANDY-851C",
                                  "48midv00012ai": "MIDV-012AI"}.items():
            self.assertEqual(code_from_cid(product), expected)
        self.assertEqual(code_from_cid("opaque_cid"), "")

    def test_sod_bonus_edition_maps_to_the_regular_release(self):
        # 特典版（官方番号 SDJS-304-V）是通常版正片加特典映像，番号归到通常版。
        for product, expected in {"1sdjs00304v": "SDJS-304", "1start00644v": "START-644"}.items():
            self.assertEqual(code_from_cid(product), expected)

    def test_code_parts_keep_the_numeric_prefix_and_the_digits_as_written(self):
        self.assertEqual(code_parts("SSIS-057"), ("", "SSIS", "057"))
        self.assertEqual(code_parts("ssis057"), ("", "SSIS", "057"))
        self.assertEqual(code_parts("300MIUM-1239"), ("300", "MIUM", "1239"))
        self.assertEqual(code_parts("MIDV-012ai"), ("", "MIDV", "012AI"))
        for code in ("", None, "FC2-PPV-1812235", "092415_001", "n0780"):
            with self.subTest(code=code):
                self.assertIsNone(code_parts(code))

    def test_the_guess_is_lowercase_letters_and_five_digits(self):
        self.assertEqual(guessed_cid("SSIS-057"), "ssis00057")
        self.assertEqual(guessed_cid("START-640"), "start00640")
        self.assertEqual(guessed_cid("300MIUM-1239"), "300mium01239")
        self.assertEqual(guessed_cid("DANDY-851C"), "dandy00851c")
        self.assertEqual(guessed_cid("092415_001"), "")

    def test_matching_cids_compare_the_letters_and_the_number_not_the_substring(self):
        """搜 `SSIS 057` 前几条是 `ssis00570`；搜 `ERK 116` 会带出 `gerk116`。厂牌数字前缀与 `h_` 前缀都容得下。"""
        self.assertEqual(matching_cids("SSIS-057", ["ssis00570", "ssis00579", "ssis00057", "1ssis00057"]),
                         ["ssis00057", "1ssis00057"])
        self.assertEqual(matching_cids("ERK-116", ["h_1838erkr01116", "gerk116", "erk116"]), ["erk116"])
        self.assertEqual(matching_cids("FKOS-006", ["h_1721fkos00006"]), ["h_1721fkos00006"])
        self.assertEqual(matching_cids("FNS-061", ["1fns00061"]), ["1fns00061"])

    def test_suffixed_variants_sort_after_the_plain_cid(self):
        """`MIDV 012` 同时命中原版与 AI 重制版，原版先核。"""
        self.assertEqual(matching_cids("MIDV-012", ["48midv00012ai", "midv00127", "midv00012", "48midv00012"]),
                         ["midv00012", "48midv00012", "48midv00012ai"])
        self.assertEqual(matching_cids("DANDY-851C", ["1dandy00851", "1dandy00851c", "1dandy00851ai"]), ["1dandy00851c"])

    def test_a_numeric_prefix_in_the_code_must_lead_the_cid(self):
        self.assertEqual(matching_cids("300MIUM-1239", ["300mium01239", "mium01239", "259mium01239"]), ["300mium01239"])
        self.assertEqual(matching_cids("092415_001", ["anything"]), [])

    def test_release_date_is_the_japanese_calendar_day(self):
        """`makerReleasedAt` 以 UTC 写日本时间零点：SSIS-057 答 05-06T15:00Z，账本与 r18.dev 都是 05-07。"""
        self.assertEqual(release_date("2021-05-06T15:00:00Z"), "2021-05-07")
        self.assertEqual(release_date("2026-10-21T15:00:00+00:00"), "2026-10-22")
        self.assertEqual(release_date("2021-05-07"), "2021-05-07")
        self.assertEqual(release_date("2021-05-07T00:00:00"), "2021-05-07")
        self.assertEqual(release_date("not a date at all"), "not a date")
        self.assertEqual(release_date(None), "")


class DmmSourceTests(unittest.TestCase):
    def test_the_config_and_the_endpoint(self):
        site = DmmSource()
        self.assertIs(site.config, DMM)
        self.assertEqual((DMM.name, DMM.label, DMM.provider, DMM.stage, DMM.interval, DMM.cookie, DMM.page_limit),
                         ("dmm", "DMM / FANZA", "dmm-graphql", "official", 2.0, False, 1024 * 1024))
        self.assertEqual(site.endpoint(), ENDPOINT)
        self.assertEqual(site.content_url("ssis00057"), PAGE_URL)
        self.assertEqual(site.content_url("h_1721fkos00006"), PAGE_URL.replace("ssis00057", "h_1721fkos00006"))

    def test_parse_reads_the_content_json_without_any_transport(self):
        record = DmmSource().parse(Page(PAGE_URL, json.dumps(ITEM, ensure_ascii=False)), "SSIS-057")
        self.assertEqual((record.source, record.provenance, record.code, record.source_url),
                         ("dmm", "dmm-graphql", "SSIS-057", PAGE_URL))
        self.assertEqual((record.title, record.studio, record.label, record.series, record.director, record.release_date,
                          record.runtime, record.cover_urls),
                         (ITEM["title"], "エスワン ナンバーワンスタイル", "S1 NO.1 STYLE", "", "肉尊", "2021-05-07", 151.15,
                          (COVER,)))
        self.assertEqual(record.performers, ({"japanese_name": "三宮つばき", "dmm_id": "1062909"},))
        self.assertEqual(record.tags, ("ギリモザ", "単体作品"))
        self.assertEqual((record.extra["content_id"], record.extra["sample_images"], record.extra["raw"]),
                         ("ssis00057", [SAMPLE], ITEM))
        self.assertEqual(record.payload(), EXPECTED)

    def test_parse_tolerates_missing_fields_and_null_objects(self):
        """DMM 对 `series`、`packageImage` 给 null；站上没给的字段留空，不是 `None`。"""
        record = DmmSource().parse(Page(PAGE_URL, json.dumps({"id": "ssis00057", "title": "x", "series": None,
                                                              "packageImage": None, "duration": 0})), "SSIS-057")
        self.assertEqual((record.series, record.director, record.release_date, record.runtime, record.cover_urls,
                          record.tags, record.performers), ("", "", "", None, (), (), ()))
        self.assertEqual(record.payload()["cover_url"], "")

    def test_query_hits_the_guessed_cid_in_one_post(self):
        transport = graphql(items={"ssis00057": ITEM})
        record = DmmSource().query("SSIS-057", session=Session(transport))
        self.assertEqual(record.payload(), EXPECTED)
        self.assertEqual(asked(transport), [("detail", "ssis00057")])
        method, url, referer, content_type, limit, query, variables = transport.calls[0]
        self.assertEqual((method, url, referer, content_type, limit, query, variables),
                         ("POST", ENDPOINT, "https://api.video.dmm.co.jp/", "application/json", 1024 * 1024,
                          DETAIL_QUERY, {"id": "ssis00057"}))

    def test_query_falls_back_to_the_search_when_the_guess_is_not_on_dmm(self):
        """`FKOS-006` 的 cid 带厂牌数字前缀 `h_1721`，猜不出来，只有搜索答得出。"""
        transport = graphql(contents=["h_1721fkos00006"], items={"h_1721fkos00006": FKOS})
        record = DmmSource().query("FKOS-006", session=Session(transport))
        self.assertEqual((record.code, record.extra["content_id"], record.release_date, record.cover_urls),
                         ("FKOS-006", "h_1721fkos00006", "2023-01-20", ()))
        self.assertEqual(asked(transport), [("detail", "fkos00006"), ("search", "FKOS 006"), ("detail", "h_1721fkos00006")])
        self.assertEqual(transport.calls[1][6], {"limit": SEARCH_LIMIT, "sort": "RELEASE_DATE", "queryWord": "FKOS 006"})

    def test_a_detail_that_is_another_film_is_not_trusted(self):
        """接口对一个 cid 答回来的是别的商品（id 与 `makerContentId` 都对不上番号）：按没有处理，接着核下一条。"""
        other = dict(ITEM, id="ssis00570", makerContentId="SSIS-570")
        transport = graphql(contents=["1ssis00057", "2ssis00057"],
                            items={"1ssis00057": other, "2ssis00057": dict(ITEM, id="2ssis00057")})
        record = DmmSource().query("SSIS-057", session=Session(transport))
        self.assertEqual(record.extra["content_id"], "2ssis00057")
        self.assertEqual(asked(transport), [("detail", "ssis00057"), ("search", "SSIS 057"),
                                            ("detail", "1ssis00057"), ("detail", "2ssis00057")])

    def test_search_hits_are_capped_and_the_guess_is_not_asked_twice(self):
        contents = ["midv00012", "48midv00012", "48midv00012ai"]
        transport = graphql(contents=contents, items={})
        with self.assertRaises(SourceFailure) as caught:
            DmmSource().query("MIDV-012", session=Session(transport))
        self.assertEqual((caught.exception.reason, str(caught.exception)), (FailureReason.NOT_FOUND, "DMM 没有这个番号"))
        self.assertEqual(asked(transport), [("detail", "midv00012"), ("search", "MIDV 012"),
                                            ("detail", "48midv00012"), ("detail", "48midv00012ai")])
        self.assertEqual(len(asked(transport)) - 2, DETAIL_ATTEMPTS)

    def test_the_provider_payload_equals_the_snapshot_shape_field_for_field(self):
        """`LibraryMetadataProvider.query(code, 'dmm')` 走的就是这一站；现有用例按 `peach.jav_cover_fetch._fetch` 打桩，桩仍然生效。"""
        def pages(transport, url, **kwargs):
            payload = json.loads(kwargs["body"])
            self.assertEqual((kwargs["method"], payload["query"], payload["variables"]), ("POST", DETAIL_QUERY, {"id": "ssis00057"}))
            return json.dumps({"data": {"ppvContent": ITEM}}, ensure_ascii=False)

        provider = LibraryMetadataProvider.__new__(LibraryMetadataProvider)
        provider.transport = Mock()
        with patch("peach.jav_cover_fetch._fetch", side_effect=pages) as fetch:
            payload = provider.query("SSIS-057", "dmm")
        self.assertEqual(payload, EXPECTED)
        self.assertEqual(fetch.call_args.args[1], ENDPOINT)
        self.assertEqual(fetch.call_args.kwargs["extra_headers"], {"Content-Type": "application/json", "Accept": "application/json"})

    def test_failures_come_through_the_shared_reason_table(self):
        with self.assertRaises(SourceFailure) as caught:
            DmmSource().query("FC2-PPV-1812235", session=Session(graphql()))
        self.assertEqual((caught.exception.reason, str(caught.exception)), (FailureReason.NOT_FOUND, "认不出可以问 DMM 的番号"))
        with self.assertRaises(SourceFailure) as caught:
            DmmSource().parse(Page(PAGE_URL, json.dumps(dict(ITEM, makerContentId="SSIS-570", id="ssis00570"))), "SSIS-057")
        self.assertEqual((caught.exception.reason, caught.exception.kind, str(caught.exception)),
                         (FailureReason.PARSE_ERROR, "unavailable", "来源返回的番号不匹配"))
        for body in (b"<html>maintenance</html>", b"[1, 2]", b'{"title": "no id"}'):
            with self.subTest(body=body), self.assertRaises(SourceFailure) as caught:
                DmmSource().parse(Page(PAGE_URL, body), "SSIS-057")
            self.assertEqual((caught.exception.reason, str(caught.exception)),
                             (FailureReason.PARSE_ERROR, "DMM 返回的不是作品 JSON"))

    def test_a_refused_query_and_a_non_json_reply_are_parse_errors(self):
        """字段名过期时接口回 `errors` 且没有 `data`，措辞带上站方那句话。"""
        refused = lambda request, timeout, limit: HttpResponse(
            200, {}, b'{"errors": [{"message": "Cannot query field \\"largeUrl\\""}]}', request.url)
        with self.assertRaises(SourceFailure) as caught:
            DmmSource().query("SSIS-057", session=Session(refused))
        self.assertEqual((caught.exception.reason, str(caught.exception)),
                         (FailureReason.PARSE_ERROR, 'DMM 拒绝了这条查询：Cannot query field "largeUrl"'))
        cloudflare = lambda request, timeout, limit: HttpResponse(200, {}, b"<html>Just a moment</html>", request.url)
        with self.assertRaises(SourceFailure) as caught:
            DmmSource().query("SSIS-057", session=Session(cloudflare))
        self.assertEqual((caught.exception.reason, str(caught.exception)), (FailureReason.PARSE_ERROR, "DMM 返回的不是作品 JSON"))

    def test_transport_tiers_keep_their_semantics(self):
        with self.assertRaises(SourceFailure) as caught:
            DmmSource().query("SSIS-057", session=Session(graphql(items={"ssis00057": Unavailable(*relayed("HTTP 503"))})))
        self.assertEqual((caught.exception.reason, caught.exception.status_code), (FailureReason.SERVER_ERROR, 503))
        with self.assertRaises(SourceFailure) as caught:
            DmmSource().query("SSIS-057", session=Session(graphql(items={"ssis00057": Unavailable(*relayed("HTTP 422"))})))
        self.assertEqual((caught.exception.reason, caught.exception.status_code), (FailureReason.NETWORK, 422))
        with self.assertRaises(SourcePaused):
            DmmSource().query("SSIS-057", session=Session(graphql(items={"ssis00057": SourcePaused("errors.scrapingAccess.coolingDown")})))


def listed(cid, *, status=None, date="2026-10-30T00:00:00+09:00", cast=("森日向子",), maker="ムーディーズ",
           maker_id="1"):
    """片单里的一行，形状照 `legacySearchPPV` 的实测响应写（女优 2026-11-04、片商 2026-11-15）。"""
    return {"id": cid, "title": f"{cid} の作品", "deliveryStartAt": date, "releaseStatus": status,
            "actresses": [{"id": "1061586" if name == "森日向子" else "9", "name": name} for name in cast],
            "maker": {"id": maker_id, "name": maker}}


def catalogue(pages, maker_codes):
    """假接口：片单按 offset 答 `pages` 里的那一页，别名批量按 cid 答 `maker_codes`。"""
    calls = []

    def call(request, timeout, limit):
        payload = json.loads(request.body)
        if payload["query"] == ACTRESS_WORKS_QUERY:
            variables = payload["variables"]
            calls.append(("list", variables["offset"], variables["filter"]))
            rows, has_next, total = pages[variables["offset"]]
            body = {"data": {"legacySearchPPV": {"result": {
                "pageInfo": {"totalCount": total, "hasNext": has_next}, "contents": rows}}}}
        else:
            cids = re.findall(r'ppvContent\(id: "([^"]+)"\)', payload["query"])
            calls.append(("codes", cids))
            body = {"data": {f"a{index}": ({"id": cid, "makerContentId": maker_codes[cid]}
                                           if cid in maker_codes else None)
                             for index, cid in enumerate(cids)}}
        return HttpResponse(200, {}, json.dumps(body, ensure_ascii=False).encode(), request.url)

    call.calls = calls
    return call


def maker_catalogue(pages):
    """假接口：maker/label 片单按 offset 答 `pages` 里的那一页，并记下每条查询与变量。"""
    calls = []

    def call(request, timeout, limit):
        payload = json.loads(request.body)
        variables = payload["variables"]
        calls.append((payload["query"], variables))
        rows, has_next, total = pages[variables["offset"]]
        body = {"data": {"legacySearchPPV": {"result": {
            "pageInfo": {"totalCount": total, "hasNext": has_next}, "contents": rows}}}}
        return HttpResponse(200, {}, json.dumps(body, ensure_ascii=False).encode(), request.url)

    call.calls = calls
    return call


class ActressWorksTests(unittest.TestCase):
    """按女优编号列片单：分页、预购、官方番号与翻页止点（ADR-0135）。"""

    def test_pages_until_the_catalogue_says_there_is_no_more(self):
        first = [listed("mizd00570", status="PRE_ORDER", date="2026-11-27T00:00:00+09:00"),
                 *[listed(f"mide{index:05d}") for index in range(99)]]
        second = [listed("h_068mxdlp00343", date="2026-10-01T10:00:40+09:00")]
        codes = {"mizd00570": "MIZD-570", "h_068mxdlp00343": "MXDLP-0343"}
        transport = catalogue({0: (first, True, 101), 100: (second, False, 101)}, codes)
        works = DmmSource().actress_works("1061586", session=Session(transport))
        self.assertEqual([call[:2] for call in transport.calls if call[0] == "list"], [("list", 0), ("list", 100)])
        self.assertEqual(transport.calls[0][2], {"actressIds": {"ids": [{"id": "1061586"}]}})
        self.assertEqual((works.name, works.total, len(works.works)), ("森日向子", 101, 101))
        head, tail = works.works[0], works.works[-1]
        self.assertEqual((head.cid, head.maker_code, head.pre_order, head.release_date),
                         ("mizd00570", "MIZD-570", True, "2026-11-27"))
        self.assertEqual((tail.maker_code, tail.pre_order, tail.release_date, tail.studio),
                         ("MXDLP-0343", False, "2026-10-01", "ムーディーズ"))
        # 接口没答官方番号的那几部留空，不拿 cid 去推。
        self.assertEqual(works.works[1].maker_code, "")

    def test_a_page_with_a_seen_work_stops_paging_and_skips_its_codes(self):
        first = [listed("mizd00570", status="PRE_ORDER"), listed("mide00001")]
        transport = catalogue({0: (first, True, 500)}, {"mizd00570": "MIZD-570", "mide00001": "MIDE-001"})
        works = DmmSource().actress_works("1061586", session=Session(transport), known={"mide00001"})
        self.assertEqual(transport.calls, [("list", 0, {"actressIds": {"ids": [{"id": "1061586"}]}}),
                                           ("codes", ["mizd00570"])])
        self.assertEqual([work.maker_code for work in works.works], ["MIZD-570", ""])

    def test_the_first_poll_stops_at_the_limit(self):
        page = [listed(f"mide{index:05d}") for index in range(100)]
        transport = catalogue({0: (page, True, 2066), 100: (page, True, 2066)}, {})
        works = DmmSource().actress_works("1008785", session=Session(transport), limit=150)
        self.assertEqual(len(works.works), 150)
        self.assertEqual([call[1] for call in transport.calls if call[0] == "list"], [0, 100])

    def test_an_empty_catalogue_is_zero_works_not_a_failure(self):
        works = DmmSource().actress_works("1051912", session=Session(catalogue({0: ([], False, 0)}, {})))
        self.assertEqual((works.total, works.works), (0, ()))

    def test_failures_are_classified(self):
        silent = Mock()
        with self.assertRaises(SourceFailure) as caught:
            DmmSource().actress_works("森日向子", session=Session(silent))
        self.assertEqual(caught.exception.reason, FailureReason.NOT_FOUND)
        silent.assert_not_called()
        broken = lambda request, timeout, limit: HttpResponse(
            200, {}, json.dumps({"data": {"legacySearchPPV": None}}).encode(), request.url)
        with self.assertRaises(SourceFailure) as caught:
            DmmSource().actress_works("1061586", session=Session(broken))
        self.assertEqual(caught.exception.reason, FailureReason.PARSE_ERROR)

    def test_rate_limits_cool_the_whole_source(self):
        class Limited:
            def __init__(self):
                self.held = []

            def __call__(self, request, timeout, limit):
                return HttpResponse(429, {}, b"", request.url)

            def hold(self, source, action):
                self.held.append((source, action))

        transport, site = Limited(), DmmSource()
        session = Session(transport)
        with self.assertRaises(SourceFailure) as caught, site.holding(session):
            site.actress_works("1061586", session=session)
        self.assertEqual(caught.exception.reason, FailureReason.RATE_LIMITED)
        self.assertEqual(transport.held, [("dmm", "rate_limited")])


class MakerWorksTests(unittest.TestCase):
    """按片商或厂牌编号列片单：嵌套 ids、offset 翻页、预购排序与编号校验（阶段 3 ⑧ 的数据层）。"""

    def test_the_maker_filter_is_a_nested_ids_list_and_pages_by_offset(self):
        first = [listed("sone00570", status="PRE_ORDER", date="2026-11-27T00:00:00+09:00",
                        maker="エスワン ナンバーワンスタイル", maker_id="3152"),
                 *[listed(f"sone{index:05d}", maker="エスワン ナンバーワンスタイル", maker_id="3152")
                   for index in range(99)]]
        second = [listed("sone00001", maker="エスワン ナンバーワンスタイル", maker_id="3152")]
        transport = maker_catalogue({0: (first, True, 101), 100: (second, False, 101)})
        works = DmmSource().maker_works("3152", session=Session(transport))
        # 一页 100 条、按发售日倒序；第二轮 offset 100。两条查询都是列表查询，没有补官方番号的第二步。
        self.assertEqual([(query, variables["offset"], variables["filter"]) for query, variables in transport.calls],
                         [(MAKER_WORKS_QUERY, 0, {"makerIds": {"ids": [{"id": "3152"}]}}),
                          (MAKER_WORKS_QUERY, 100, {"makerIds": {"ids": [{"id": "3152"}]}})])
        self.assertEqual({variables["limit"] for _, variables in transport.calls}, {100})
        self.assertEqual({variables["sort"] for _, variables in transport.calls}, {"RELEASE_DATE"})
        self.assertEqual((works.kind, works.id, works.name, works.total, len(works.works)),
                         ("maker", "3152", "エスワン ナンバーワンスタイル", 101, 101))
        head, tail = works.works[0], works.works[-1]
        self.assertEqual((head.cid, head.title, head.maker_code, head.pre_order, head.release_date),
                         ("sone00570", "sone00570 の作品", "", True, "2026-11-27"))
        self.assertEqual((tail.cid, tail.release_date, tail.studio),
                         ("sone00001", "2026-10-30", "エスワン ナンバーワンスタイル"))

    def test_a_page_with_a_seen_work_stops_paging(self):
        page = [listed("sone00570", maker="S1", maker_id="3152"), listed("sone00001", maker="S1", maker_id="3152")]
        transport = maker_catalogue({0: (page, True, 500)})
        works = DmmSource().maker_works("3152", session=Session(transport), known={"sone00001"})
        self.assertEqual([variables["offset"] for _, variables in transport.calls], [0])
        self.assertEqual([work.cid for work in works.works], ["sone00570", "sone00001"])

    def test_label_filter_uses_label_ids_and_leaves_the_label_name_to_the_caller(self):
        # 列表型只有 maker、没有 label：厂牌名由调用方按本地实体给，不从这一页取。
        transport = maker_catalogue({0: ([listed("ssis00057", maker="エスワン ナンバーワンスタイル",
                                                 maker_id="3152", cast=("三宮つばき",))], False, 1)})
        works = DmmSource().label_works("3474", session=Session(transport))
        self.assertEqual(transport.calls[0][1]["filter"], {"labelIds": {"ids": [{"id": "3474"}]}})
        self.assertEqual((works.kind, works.id, works.name, works.total), ("label", "3474", "", 1))
        self.assertEqual((works.works[0].cid, works.works[0].pre_order), ("ssis00057", False))

    def test_malformed_maker_and_label_ids_are_rejected_before_any_request(self):
        site, silent = DmmSource(), Mock()
        for method, value, message in ((site.maker_works, "S1", "DMM 片商编号只认数字"),
                                       (site.label_works, "s1", "DMM 厂牌编号只认数字"),
                                       (site.maker_works, "", "DMM 片商编号只认数字"),
                                       (site.maker_works, None, "DMM 片商编号只认数字"),
                                       (site.label_works, "３４７４", "DMM 厂牌编号只认数字")):
            with self.subTest(value=value), self.assertRaises(SourceFailure) as caught:
                method(value, session=Session(silent))
            self.assertEqual((caught.exception.reason, str(caught.exception)), (FailureReason.NOT_FOUND, message))
        silent.assert_not_called()

    def test_an_empty_catalogue_is_zero_works_not_a_failure(self):
        for method, value in ((DmmSource().maker_works, "1509"), (DmmSource().label_works, "4325")):
            with self.subTest(value=value):
                works = method(value, session=Session(maker_catalogue({0: ([], False, 0)})))
                self.assertEqual((works.total, works.works, works.name), (0, (), ""))


if __name__ == "__main__":
    unittest.main()
