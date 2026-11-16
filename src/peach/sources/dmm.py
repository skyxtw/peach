"""DMM／FANZA 自己的 GraphQL 目录：有码链上 r18.dev 之后的兜底，答 r18.dev 漏收的那部分。

r18.dev 是这份目录的镜像，但不是全份：2026-09-24 实测当月新片 START-640、START-639，以及
FKOS-006、FKOS-002、FNS-061、SUKE-073 在 r18.dev 都是 404，DMM 的接口都有。接口是
`https://api.video.dmm.co.jp/graphql`（新版商品页 video.dmm.co.jp 背后那一个，取法参照 OpenAver
的 `core/scrapers/dmm.py`），只收 POST，从中国电信直连与香港出口都回 200、一次 0.3～1 秒，
没有年龄门，不需要日本出口。它和 amane 那只走 `mono/dvd` 页面的 HTML 爬虫不是一条路：
ADR-0048 因后者答 BOD 版、一次 3～14 秒而不让它进链，本模块由 ADR-0059 另行接入。

一部片的商品 id（cid）由番号推：先猜 `{字母}{五位补零数字}`（`SSIS-057` → `ssis00057`），
猜不中再搜 `legacySearchPPV`，只收字母段与数字都对得上的 cid——搜 `SSIS 057` 排在前面的是
`ssis00570`、`ssis00579`，搜 `ERK 116` 会带出 `gerk116`，不比数字就会把别的片当成它。带厂牌
数字前缀的 cid（`h_1721fkos00006`、`1fns00061`）只有搜索答得出。取到的详情再用
`makerContentId` 核一次身份，AI 重制版（`48midv00012ai`）排在原版之后。

`makerReleasedAt` 是发售日，以 UTC 写日本时间的零点（SSIS-057 答 `2021-05-06T15:00:00Z`，账本与
r18.dev 都是 2021-05-07），换成日本时间再取日期。厂牌是日文名（`エスワン ナンバーワンスタイル`），
r18.dev 给的是品牌英文名；账本的厂牌实体靠 `entity_alias` 归一（ADR-0038），这里不翻。genre 与
r18.dev 的 `name_ja` 是同一套词。

只进有码链：Prestige 已从 FANZA 撤下（搜 `ABW 032` 零结果），MGS 素人号也不在这份目录上
（搜 `MIUM 1239`、`LUXU 1475` 零结果）。

同一个接口还给 JAV 订阅当第二个发现源（ADR-0135）：`legacySearchPPV` 带
`filter.actressIds` 按女优编号列她的全部商品，按发售日倒序，预购（`releaseStatus` 为 `PRE_ORDER`）
排在最前。列表那一型没有 `makerContentId`（2026-11-04 实测问它回 422 `GRAPHQL_VALIDATION_FAILED`），
官方番号要再用别名批量问一次 `ppvContent`。不用 cid 推：分卷 `h_1454mcsr64002` 推出来是
`MCSR-64002`，官方写 `MCSR-640-02`；`13dsvr01234` 的数字头会被当成发行目录吃掉，推成另一个厂牌的 `DSVR`。

同一个接口还给片商与厂牌订阅列片单（2026-11-15 实测）：`legacySearchPPV` 的 `filter.makerIds` 与
`filter.labelIds` 只认 `{"ids": [{"id": "3152"}]}` 这种嵌套形状，传数组或裸编号回 422；多编号是
AND 语义，两个 maker 一起传回零条，所以一次只问一个。列表型有 `maker{id,name}` 但没有 `label`
字段，也没有 `makerContentId`：这一层只交 cid、标题、发售日与预购标记，官方番号由 Feed 层按
cid 用 `maker_codes` 批量补。
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from urllib.parse import quote

from ..metadata import identifies_code
from ..catalog_rules import normalise_code_key
from .base import FailureReason, Page, Session, SiteConfig, SiteRecord, SiteSource, SourceFailure

#: 不带 Cookie，主机间隔用默认的 2 秒。一次响应实测几 KB，1 MiB 是余量。
DMM = SiteConfig(name="dmm", label="DMM / FANZA", provider="dmm-graphql",
                 base_url="https://api.video.dmm.co.jp", domains=("dmm.co.jp", "dmm.com"),
                 stage="official", page_limit=1024 * 1024)
GRAPHQL_PATH = "/graphql"
#: 用户看得到的商品页，写进 `source_url`。
CONTENT_PAGE = "https://video.dmm.co.jp/av/content/?id={cid}"
#: 商品那一份查询。字段名 2026-09-24 实测有效；`sampleImages` 只有 `imageUrl`，没有 `largeUrl`。
DETAIL_QUERY = (
    "query PeachContent($id: ID!) { ppvContent(id: $id) { id title description makerContentId makerReleasedAt"
    " duration maker { id name } label { id name } series { id name } actresses { id name }"
    " directors { id name } genres { id name } packageImage { largeUrl mediumUrl } sampleImages { imageUrl } } }"
)
SEARCH_QUERY = (
    "query PeachSearch($limit: Int!, $sort: ContentSearchPPVSort!, $queryWord: String)"
    " { legacySearchPPV(limit: $limit, sort: $sort, queryWord: $queryWord) { result { contents { id } } } }"
)
#: 搜索取多少条：按发售日倒序，`ssis00057` 排在 `SSIS 057` 结果的第 11 条，30 是余量。
SEARCH_LIMIT = 30
#: 搜索命中里最多核几条详情：`MIDV 012` 同时命中 `midv00012` 与 AI 重制版 `48midv00012ai`。
DETAIL_ATTEMPTS = 2
HEADERS = {"Content-Type": "application/json", "Accept": "application/json"}
JST = timezone(timedelta(hours=9))
#: 几种没给出结果的说法（code）。
UNRECOGNISED = "errors.dmm.unrecognizedCode"
MISSING = "errors.dmm.notFound"
NOT_JSON = "errors.dmm.notWorkJson"

#: 片单查询的正文：女优、片商、厂牌共用同一组列表字段与分页参数。
#: 列表型 `PPVContentSearchContent` 没有 `makerContentId` 与 `makerReleasedAt`，也没有 `label`
#: 字段（2026-11-15 实测）。
def _works_query(operation: str) -> str:
    return (
        f"query {operation}($limit: Int!, $offset: Int!, $sort: ContentSearchPPVSort!,"
        " $filter: ContentSearchPPVFilterInput) { legacySearchPPV(limit: $limit, offset: $offset,"
        " sort: $sort, filter: $filter) { result { pageInfo { totalCount hasNext } contents { id title"
        " deliveryStartAt releaseStatus actresses { id name } maker { id name } } } } }"
    )


#: 按女优编号列片单。
ACTRESS_WORKS_QUERY = _works_query("PeachActressWorks")
#: 按片商或厂牌编号列片单。
MAKER_WORKS_QUERY = _works_query("PeachMakerWorks")
#: 片单每页多少条：接口单页上限 100，官方番号的别名批量也按这个数一次问完。
WORKS_PAGE = 100
#: 女优、片商、厂牌的编号写法。只认 ASCII 数字，拼进查询变量之前就挡住别的东西。
DIGITS_ID = re.compile(r"^[0-9]{1,10}$")
PRE_ORDER = "PRE_ORDER"


@dataclass(frozen=True)
class ListedWork:
    """片单里的一部。`maker_code` 是官方番号原文（`MXDLP-0343`），没问到时为空。"""

    cid: str
    title: str
    maker_code: str
    release_date: str
    pre_order: bool
    performers: tuple[str, ...]
    studio: str


@dataclass(frozen=True)
class ActressWorks:
    """一位女优的片单。`name` 是她在 DMM 上这个编号挂的名字，`total` 是接口自报的总部数。"""

    name: str
    total: int
    works: tuple[ListedWork, ...]


@dataclass(frozen=True)
class CatalogueWorks:
    """一个片商（`maker`）或厂牌（`label`）的片单。

    `kind` 是过滤维度，`id` 是这次查询的 DMM 编号；`name` 是接口在一页里回过的 maker 名，label
    片单留空——列表型没有 `label` 字段（2026-11-15 实测），展示名由调用方按本地实体给。`total`
    是接口自报的总部数。行沿用 `ListedWork`：`maker_code` 一律为空，列表型没有 `makerContentId`，
    官方番号由 Feed 层按 cid 用 `maker_codes` 批量补。
    """

    kind: str
    id: str
    name: str
    total: int
    works: tuple[ListedWork, ...]

_CODE = re.compile(r"^(\d{3})?([A-Z]{2,8})-?(\d{1,5})([A-Z]{0,2})$")
_CID = re.compile(r"^(?:h_\d+|\d+)?([a-z]+)(\d+)([a-z]*)$")


def code_from_cid(value: str) -> str:
    """DMM 商品号的数字头属于发行目录，尾字母保留为作品身份；SOD 特典版的尾字母 `v` 除外。"""
    matched = _CID.fullmatch(str(value or "").lower())
    if not matched:
        return ""
    letters, digits, suffix = matched.groups()
    # SOD 特典版的商品号以 v 结尾（`1sdjs00304v`，官方番号 SDJS-304-V），内容是通常版正片加特典映像，
    # 资源与资料都按通常版番号收录，归到通常版（同 JavDB 对 FANZA 限定版取通常版的规则）。
    if suffix == "v":
        suffix = ""
    return normalise_code_key(f"{letters}-{digits}{suffix}")


def code_parts(code: str) -> tuple[str, str, str] | None:
    """番号拆成（数字前缀，字母段，序号及尾字母），例如 `DANDY-851C` → `('', 'DANDY', '851C')`。"""
    matched = _CODE.match(str(code or "").strip().upper())
    return (matched.group(1) or "", matched.group(2), matched.group(3) + matched.group(4)) if matched else None


def guessed_cid(code: str) -> str:
    """按 DMM 最常见的编法猜 cid：字母小写，数字补到五位。猜不出交空串。"""
    parts = code_parts(code)
    if not parts:
        return ""
    digits, letters, number = parts
    serial = re.fullmatch(r"(\d+)([A-Z]*)", number)
    return f"{digits}{letters.lower()}{int(serial.group(1)):05d}{serial.group(2).lower()}"


def matching_cids(code: str, cids) -> list[str]:
    """搜索结果里字母段与数字都对得上这个番号的 cid，不带后缀的排前面，顺序其余照搜索结果。"""
    parts = code_parts(code)
    if not parts:
        return []
    digits, letters, number = parts
    serial = re.fullmatch(r"(\d+)([A-Z]*)", number)
    found = []
    for cid in cids:
        text = str(cid or "").lower()
        matched = _CID.match(text)
        if not matched or matched.group(1) != letters.lower() or int(matched.group(2)) != int(serial.group(1)):
            continue
        if serial.group(2) and matched.group(3) != serial.group(2).lower():
            continue
        if digits and not text.startswith(digits):
            continue
        found.append((bool(matched.group(3)), str(cid)))
    return [cid for _, cid in sorted(found, key=lambda item: item[0])]


def release_date(value) -> str:
    """`makerReleasedAt` 换成日本时间的日期；解析不了就取前十个字符。"""
    text = str(value or "").strip()
    if not text:
        return ""
    try:
        moment = datetime.fromisoformat(text.replace("Z", "+00:00"))
    except ValueError:
        return text[:10]
    if moment.tzinfo is None:
        return moment.date().isoformat()
    return moment.astimezone(JST).date().isoformat()


def listed_page(data: dict) -> tuple[list[dict], int, bool]:
    """片单一页的（有 cid 的行，接口自报总部数，还有没有下一页）。形状对不上归 `parse_error`。"""
    result = (data.get("legacySearchPPV") or {}).get("result")
    contents = result.get("contents") if isinstance(result, dict) else None
    if not isinstance(contents, list):
        raise SourceFailure(FailureReason.PARSE_ERROR, "errors.dmm.notListJson")
    info = result.get("pageInfo") if isinstance(result.get("pageInfo"), dict) else {}
    total = info["totalCount"] if isinstance(info.get("totalCount"), int) else 0
    rows = [row for row in contents if isinstance(row, dict) and row.get("id")]
    return rows, total, bool(info.get("hasNext"))


def _cast(row: dict) -> list[dict]:
    return [item for item in row.get("actresses") or [] if isinstance(item, dict)]


def listed_work(row: dict, maker_code: str) -> ListedWork:
    """片单里的一行。发售日用 `deliveryStartAt`，预购的是预定配信日。"""
    return ListedWork(
        cid=str(row["id"]), title=str(row.get("title") or "").strip(), maker_code=maker_code,
        release_date=release_date(row.get("deliveryStartAt")),
        pre_order=row.get("releaseStatus") == PRE_ORDER,
        performers=tuple(str(item["name"]) for item in _cast(row) if item.get("name")),
        studio=str((row.get("maker") or {}).get("name") or ""))


def actress_name(rows, actress_id: str) -> str:
    """这个编号在出演表里挂的名字：订阅源列表靠它分清同一个人的几个编号。"""
    return next((str(item.get("name") or "") for row in rows for item in _cast(row)
                 if str(item.get("id") or "") == actress_id), "")


def maker_name(rows, maker_id: str) -> str:
    """这个片商编号在片单里挂的名字；label 片单不取（列表型没有 label 字段）。"""
    return next((str((row.get("maker") or {}).get("name") or "") for row in rows
                 if str((row.get("maker") or {}).get("id") or "") == maker_id), "")


class DmmSource(SiteSource):
    DEFAULT = DMM

    def endpoint(self) -> str:
        return self.config.base_url + GRAPHQL_PATH

    def content_url(self, cid: str) -> str:
        return CONTENT_PAGE.format(cid=quote(cid, safe=""))

    def graphql(self, query: str, variables: dict, *, session: Session) -> dict:
        """发一条查询，交回 `data`。回的不是 JSON、或接口拒绝这条查询（只有 `errors`）归 `parse_error`。"""
        body = json.dumps({"query": query, "variables": variables}).encode()
        page = session.post(self.endpoint(), config=self.config, body=body, headers=HEADERS)
        try:
            raw = json.loads(page.body)
        except ValueError:
            raise SourceFailure(FailureReason.PARSE_ERROR, NOT_JSON) from None
        if not isinstance(raw, dict):
            raise SourceFailure(FailureReason.PARSE_ERROR, NOT_JSON)
        data = raw.get("data")
        if not isinstance(data, dict):
            errors = raw.get("errors")
            first = errors[0] if isinstance(errors, list) and errors and isinstance(errors[0], dict) else {}
            message = str(first.get("message") or "")
            if message:
                raise SourceFailure(FailureReason.PARSE_ERROR, "errors.dmm.refusedWithMessage", {"message": message})
            raise SourceFailure(FailureReason.PARSE_ERROR, "errors.dmm.refused")
        return data

    def content(self, cid: str, *, session: Session) -> dict | None:
        """一个 cid 的商品资料；DMM 没有这个 cid 时 `ppvContent` 是 null，交 None。"""
        item = self.graphql(DETAIL_QUERY, {"id": cid}, session=session).get("ppvContent")
        return item if isinstance(item, dict) and item.get("id") else None

    def identified(self, code: str, cid: str, *, session: Session) -> dict | None:
        """取这个 cid 的资料，并核它就是这个番号；不是的按没有交 None，让调用方接着试下一个。"""
        item = self.content(cid, session=session)
        if item is None or not identifies_code(code, {"content_id": item.get("id"), "id": item.get("makerContentId")}):
            return None
        return item

    def search(self, code: str, *, session: Session) -> list[str]:
        """按「字母段 数字」搜，交回对得上的 cid。地区限制下接口回 200 加空列表，和「没收」长得一样。"""
        parts = code_parts(code)
        if not parts:
            return []
        _, letters, number = parts
        data = self.graphql(SEARCH_QUERY, {"limit": SEARCH_LIMIT, "sort": "RELEASE_DATE",
                                           "queryWord": f"{letters} {number}"}, session=session)
        result = (data.get("legacySearchPPV") or {}).get("result") or {}
        contents = result.get("contents") or []
        return matching_cids(code, (row.get("id") for row in contents if isinstance(row, dict)))

    def maker_codes(self, cids, *, session: Session) -> dict[str, str]:
        """一批 cid 的官方番号，一次请求问完（GraphQL 别名）。接口答 null 的 cid 不在结果里。"""
        cids = list(cids)
        if not cids:
            return {}
        query = "query PeachMakerCodes { " + " ".join(
            f"a{index}: ppvContent(id: {json.dumps(cid)}) {{ id makerContentId }}"
            for index, cid in enumerate(cids)) + " }"
        data = self.graphql(query, {}, session=session)
        found: dict[str, str] = {}
        for index, cid in enumerate(cids):
            item = data.get(f"a{index}")
            if isinstance(item, dict) and str(item.get("makerContentId") or "").strip():
                found[cid] = str(item["makerContentId"]).strip()
        return found

    def actress_works(self, actress_id: str, *, session: Session, known=frozenset(),
                      limit: int = 2 * WORKS_PAGE) -> ActressWorks:
        """按女优编号列片单，新的在前，预购最前。

        一页 100 条，见过的 cid（`known`）只列不问官方番号。翻页只在这一页全是没见过的时候继续：
        片单按发售日倒序，一页里出现见过的那部，再往后就都是上一轮列过的了；首轮最多翻到 `limit`。
        一个人的片单动辄上千条（篠田ゆう 2066 部），每六小时全翻一遍只是花配额。
        """
        if not DIGITS_ID.match(str(actress_id or "")):
            raise SourceFailure(FailureReason.NOT_FOUND, "errors.feeds.dmmActressIdDigits")
        name, total, works = "", 0, []
        offset = 0
        while offset < limit:
            data = self.graphql(ACTRESS_WORKS_QUERY, {
                "limit": WORKS_PAGE, "offset": offset, "sort": "RELEASE_DATE",
                "filter": {"actressIds": {"ids": [{"id": str(actress_id)}]}}}, session=session)
            rows, total, has_next = listed_page(data)
            rows = rows[:limit - offset]
            fresh = [str(row["id"]) for row in rows if str(row["id"]) not in known]
            codes = self.maker_codes(fresh, session=session)
            works.extend(listed_work(row, codes.get(str(row["id"]), "")) for row in rows)
            name = name or actress_name(rows, str(actress_id))
            offset += len(rows)
            if not has_next or not rows or len(fresh) < len(rows):
                break
        return ActressWorks(name=name, total=total, works=tuple(works))

    def maker_works(self, maker_id: str, *, session: Session, known=frozenset(),
                    limit: int = 2 * WORKS_PAGE) -> CatalogueWorks:
        """按片商编号列片单，新的在前，预购最前；翻页与 `actress_works` 同一套规则。

        一次只问一个编号：接口的 `makerIds` 是 AND 语义，两个 maker 一起传回零条。
        """
        return self._catalogue_works("maker", maker_id, "makerIds", "errors.feeds.dmmMakerIdDigits",
                                     session=session, known=known, limit=limit)

    def label_works(self, label_id: str, *, session: Session, known=frozenset(),
                    limit: int = 2 * WORKS_PAGE) -> CatalogueWorks:
        """按厂牌编号列片单；分页、排序与 `maker_works` 相同。"""
        return self._catalogue_works("label", label_id, "labelIds", "errors.feeds.dmmLabelIdDigits",
                                     session=session, known=known, limit=limit)

    def _catalogue_works(self, kind: str, value: str, field: str, invalid_code: str, *,
                         session: Session, known, limit: int) -> CatalogueWorks:
        """按一个纯数字的片商或厂牌编号翻片单；`kind` 只决定过滤字段与结果里的名字。"""
        value = str(value or "")
        if not DIGITS_ID.match(value):
            raise SourceFailure(FailureReason.NOT_FOUND, invalid_code)
        name, total, works = "", 0, []
        offset = 0
        while offset < limit:
            data = self.graphql(MAKER_WORKS_QUERY, {
                "limit": WORKS_PAGE, "offset": offset, "sort": "RELEASE_DATE",
                "filter": {field: {"ids": [{"id": value}]}}}, session=session)
            rows, total, has_next = listed_page(data)
            rows = rows[:limit - offset]
            fresh = [str(row["id"]) for row in rows if str(row["id"]) not in known]
            works.extend(listed_work(row, "") for row in rows)
            if kind == "maker":
                name = name or maker_name(rows, value)
            offset += len(rows)
            if not has_next or not rows or len(fresh) < len(rows):
                break
        return CatalogueWorks(kind=kind, id=value, name=name, total=total, works=tuple(works))

    def fetch(self, code: str, *, session: Session) -> Page:
        if not code_parts(code):
            raise SourceFailure(FailureReason.NOT_FOUND, UNRECOGNISED)
        guess = guessed_cid(code)
        item = self.identified(code, guess, session=session)
        if item is None:
            for cid in [cid for cid in self.search(code, session=session) if cid != guess][:DETAIL_ATTEMPTS]:
                item = self.identified(code, cid, session=session)
                if item is not None:
                    break
        if item is None:
            raise SourceFailure(FailureReason.NOT_FOUND, MISSING)
        return Page(self.content_url(str(item["id"])), json.dumps(item, ensure_ascii=False).encode())

    def parse(self, page: Page, code: str) -> SiteRecord:
        try:
            item = json.loads(page.body)
        except ValueError:
            raise SourceFailure(FailureReason.PARSE_ERROR, NOT_JSON) from None
        if not isinstance(item, dict) or not item.get("id"):
            raise SourceFailure(FailureReason.PARSE_ERROR, NOT_JSON)
        cid = str(item["id"])
        if not identifies_code(code, {"content_id": cid, "id": item.get("makerContentId")}):
            raise SourceFailure(FailureReason.PARSE_ERROR, "errors.base.codeMismatch")
        name = lambda key: str((item.get(key) or {}).get("name") or "")
        rows = lambda key: [row for row in item.get(key) or [] if isinstance(row, dict) and row.get("name")]
        directors = rows("directors")
        duration = item.get("duration")
        cover = str((item.get("packageImage") or {}).get("largeUrl") or "")
        samples = [str(row["imageUrl"]) for row in item.get("sampleImages") or []
                   if isinstance(row, dict) and row.get("imageUrl")]
        return SiteRecord(
            source=self.config.name, provenance=self.config.provider, code=code, source_url=page.url,
            title=str(item.get("title") or ""),
            performers=tuple({"japanese_name": str(row["name"]), "dmm_id": str(row.get("id") or "")}
                             for row in rows("actresses")),
            studio=name("maker"), label=name("label"), series=name("series"),
            director=str(directors[0]["name"]) if directors else "",
            release_date=release_date(item.get("makerReleasedAt")),
            runtime=round(duration / 60, 2) if isinstance(duration, (int, float)) and duration > 0 else None,
            tags=tuple(str(row["name"]) for row in rows("genres")),
            cover_urls=(cover,) if cover else (),
            extra={"content_id": cid, "description": str(item.get("description") or ""),
                   "sample_images": samples, "raw": item})
