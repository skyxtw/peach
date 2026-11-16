"""番号发现源：解析、两层去重、已读与忽略、空壳与真实资产的边界（ADR-0042）。"""
from __future__ import annotations

import sys
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from peach import feeds  # noqa: E402
from peach.migrations import upgrade  # noqa: E402
from peach.repository import LedgerDatabase  # noqa: E402
from peach.sources.dmm import ActressWorks, CatalogueWorks, ListedWork  # noqa: E402

MIGRATIONS = Path(__file__).resolve().parents[1] / "migrations"

JAVDB_ACTOR = """
<div class="movie-list h cols-4 vcols-8">
  <div class="item">
    <a href="/v/5nr8mp" class="box" title="ignored">
      <div class="cover"><img src="x.jpg" /></div>
      <div class="video-title"><strong>PBD-528</strong> 気高きお姉さん達</div>
      <div class="score"><span class="value">4.0分</span></div>
      <div class="meta">
        2026-10-20
      </div>
    </a>
  </div>
  <div class="item">
    <a href="/v/RkPb5z" class="box" title="ignored">
      <div class="cover"><img src="y.jpg" /></div>
      <div class="video-title"><strong>BBSS-106</strong> 別の作品</div>
      <div class="meta">
        2026-10-13
      </div>
    </a>
  </div>
  <div class="item">
    <a href="/v/Zx9Qa1" class="box" title="ignored">
      <div class="cover"><img src="z.jpg" /></div>
      <div class="video-title"><strong></strong> 合集 30 部打包</div>
      <div class="meta">
        2026-10-01
      </div>
    </a>
  </div>
</div>
"""

#: 旧艺名那一页：`/actors/MmbDR`（白石アイリ）2026-09-28 抓回来的标题栏与空列表。
JAVDB_EMPTY_ACTOR = """
<div class="columns is-desktop section-columns">
  <div class="column section-title">
    <h2 class="title is-4 has-text-justified">
      <span class="actor-section-name">白石アイリ</span>
      <br>
      <span class="section-meta">0 部影片</span>
    </h2>
  </div>
</div>
  <div class="empty-message">暂无内容</div>
"""

#: 本名那一页（`/actors/bkxd`）的标题栏：别名一行在前，作品数一行在后。
JAVDB_ACTOR_HEADER = """
    <h2 class="title is-4 has-text-justified">
      <span class="actor-section-name">森日向子</span>
        <br>
        <span class="section-meta">朝比奈えみり, ひー, ひなこちゃん, 雛子ちゃん, 日向結衣</span>
      <br>
      <span class="section-meta">1060 部影片</span>
    </h2>
"""


def _database(root: Path) -> LedgerDatabase:
    path = root / "ledger.db"
    upgrade(path, MIGRATIONS)
    return LedgerDatabase(path)


class FeedParsingTest(unittest.TestCase):
    def test_code_is_found_inside_a_title_full_of_prose(self):
        # 整段丢给 `release_code_from_text` 认不出来，词元扫描才认得出。
        title = "HMN-071 新人 帶來超稀有妹子 戶川步[有碼高清中文字幕]"
        self.assertEqual(feeds.scan_code(title), "HMN-071")
        self.assertEqual(feeds.scan_code("[H265 1080p] DSOD-114 花宮京子"), "DSOD-114")
        self.assertIsNone(feeds.scan_code("合集 30 部打包"))

    def test_javdb_actor_page_reads_code_and_release_date(self):
        parsed = feeds.parse_javdb_actor(JAVDB_ACTOR, "https://javdb.com/actors/pRMq")
        self.assertEqual([entry.item_key for entry in parsed.entries],
                         ["/v/5nr8mp", "/v/RkPb5z", "/v/Zx9Qa1"])
        self.assertEqual(parsed.entries[0].code, "PBD-528")
        self.assertEqual(parsed.entries[0].link, "https://javdb.com/v/5nr8mp")
        self.assertEqual(parsed.entries[0].published_at, "2026-10-20T00:00:00.000Z")
        self.assertIsNone(parsed.entries[2].code)

    def test_an_unknown_kind_is_a_parse_failure(self):
        # 账本里若留着别的类型，拉取把原因写在那一行上，不拿演员页的解析器硬读。
        self.assertIsNone(feeds.parse("rss", JAVDB_ACTOR.encode("utf-8"),
                                      "https://example.test/rss"))

    def test_a_page_without_any_work_is_a_failure_not_an_empty_poll(self):
        # 带查询串的演员页会回一份不含作品的页面。当成「这次没有新作」会让一个坏掉的
        # 订阅永远不报错。
        self.assertIsNone(feeds.parse_javdb_actor("<html>nothing</html>",
                                                  "https://javdb.com/actors/pRMq"))

    def test_a_page_that_says_it_has_no_work_is_a_quiet_source(self):
        # 旧艺名页常年是空的；页面自报 0 部，它就是一个没有作品的真实源。
        parsed = feeds.parse_javdb_actor(JAVDB_EMPTY_ACTOR, "https://javdb.com/actors/MmbDR")
        self.assertEqual((parsed.title, parsed.entries), ("白石アイリ", ()))

    def test_a_page_that_claims_works_but_lists_none_is_still_a_failure(self):
        self.assertIsNone(feeds.parse_javdb_actor(
            JAVDB_ACTOR_HEADER + '<div class="empty-message">暂无内容</div>',
            "https://javdb.com/actors/bkxd"))

    def test_the_page_name_is_read_from_the_title_bar(self):
        parsed = feeds.parse_javdb_actor(JAVDB_ACTOR_HEADER + JAVDB_ACTOR,
                                         "https://javdb.com/actors/bkxd")
        self.assertEqual(parsed.title, "森日向子")
        self.assertEqual(len(parsed.entries), 3)


class CompilationTest(unittest.TestCase):
    """标题与名单取自一份订阅实际抓回的壳。"""

    def test_marked_titles_and_long_cast_lists_are_group_compilations(self):
        cast = "、".join(f"女優{index}" for index in range(8))
        for title, performers in (
                ("ひくひくアナル丸見え！デカ尻バック激ピストンBEST", "奏音かのん、丘えりな"),
                ("乱交ベスト", ""),
                ("主観手コキ50連発", ""),
                ("絶対忠実秘書 BEST 8時間 Vol.01", "八掛うみ、野々浦暖"),
                ("季刊性年KMP 花火 ノーカット 1397分", ""),
                ("レス界隈奥さん他人棒で淫乱覚醒する巨乳人妻", cast)):
            with self.subTest(title=title):
                self.assertEqual(feeds.compilation_kind(title, performers), feeds.GROUP_COMPILATION)

    def test_one_listed_performer_with_a_marked_title_is_a_solo_compilation(self):
        for title in ("涼森れむ 8時間 BEST PRESTIGE PREMIUM RESTRICTED vol.12",
                      "涼森れむ 480分 総集編"):
            with self.subTest(title=title):
                self.assertEqual(feeds.compilation_kind(title, "涼森れむ"), feeds.SOLO_COMPILATION)

    def test_a_few_co_stars_and_ordinary_titles_are_not_compilations(self):
        for title, performers in (
                ("初めてのセックスが大優勝 ～神女優で童貞卒業～", "鈴村あいり、涼森れむ、八掛うみ"),
                ("月刊ハメ撮り 本能剥き出し3本番 涼森れむ", "涼森れむ"),
                ("BESTIE と過ごす2時間", ""),
                (None, None)):
            with self.subTest(title=title):
                self.assertIsNone(feeds.compilation_kind(title, performers))

    def test_the_highlight_studio_is_an_excerpt_whatever_the_title_says(self):
        self.assertEqual(feeds.compilation_kind("愛する妻が…", "篠田ゆう", "ハイライト"),
                         feeds.EXCERPT)
        self.assertEqual(feeds.compilation_kind("涼森れむ 480分 総集編", "涼森れむ", "ハイライト"),
                         feeds.EXCERPT)
        self.assertIsNone(feeds.compilation_kind("愛する妻が…", "篠田ゆう", "マドンナ"))


class FeedPhaseTest(unittest.TestCase):
    """下次拉取按源的相位排（ADR-0134）：同时加的源错开，跳与跳之间的延迟不累积。"""

    MOMENT = datetime(2026, 11, 3, 3, 28, 57, tzinfo=timezone.utc)
    PERIOD = timedelta(minutes=feeds.DEFAULT_INTERVAL_MINUTES)

    def test_sources_fetched_together_spread_over_the_window(self):
        upcoming = sorted(feeds.next_fetch(source_id, self.MOMENT, feeds.DEFAULT_INTERVAL_MINUTES)
                          for source_id in range(1, 12))
        for moment in upcoming:
            self.assertGreaterEqual(moment, self.MOMENT + self.PERIOD / 2)
            self.assertLessEqual(moment, self.MOMENT + self.PERIOD * 1.5)
        slots = {int((moment.timestamp() % self.PERIOD.total_seconds())
                     // timedelta(minutes=feeds.TICK_MINUTES).total_seconds()) for moment in upcoming}
        # 11 个源落进 12 个半小时档里的至少 9 个：一跳最多拉两三个，而不是 11 个一起。
        self.assertGreaterEqual(len(slots), 9)

    def test_tick_lag_does_not_drift_the_schedule(self):
        """到期之后要等到下一跳才拉，拉完排的下次仍回到同一个相位，周期保持一个间隔。"""
        moment = self.MOMENT
        due = feeds.next_fetch(7, moment, feeds.DEFAULT_INTERVAL_MINUTES)
        for lag in (timedelta(minutes=29), timedelta(minutes=3), timedelta(minutes=17)):
            fetched = due + lag
            following = feeds.next_fetch(7, fetched, feeds.DEFAULT_INTERVAL_MINUTES)
            self.assertAlmostEqual((following - due).total_seconds(),
                                   self.PERIOD.total_seconds(), places=2)
            due = following


class FeedStoreTest(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.root = Path(self._tmp.name)
        self.database = _database(self.root)
        self.addCleanup(self._tmp.cleanup)

    def _source(self, **kwargs) -> int:
        with self.database.write_transaction() as connection:
            return feeds.add_source(connection,
                                    url=kwargs.pop("url", "https://javdb.com/actors/pRMq"),
                                    **kwargs)

    def _poll(self, source_id: int) -> dict:
        parsed = feeds.parse_javdb_actor(JAVDB_ACTOR, "https://javdb.com/actors/pRMq")
        with self.database.write_transaction() as connection:
            source = connection.execute("SELECT * FROM feed_source WHERE id=?",
                                        (source_id,)).fetchone()
            return feeds.poll(connection, source, parsed)

    def test_https_only(self):
        with self.assertRaises(ValueError):
            feeds.normalize_url("http://example.test/rss")

    def test_same_url_twice_is_refused(self):
        self._source()
        with self.assertRaises(ValueError):
            self._source()

    def test_first_poll_records_every_entry_and_shells_the_coded_ones(self):
        source_id = self._source()
        outcome = self._poll(source_id)
        self.assertEqual(outcome["seen"], 3)
        self.assertEqual(outcome["fresh"], 3)
        # 解不出番号的条目照样记一行，只是不建壳。
        self.assertEqual(outcome["without_code"], 1)
        self.assertEqual(sorted(code for _id, code in outcome["created"]),
                         ["BBSS-106", "PBD-528"])
        with self.database.read_connection() as connection:
            self.assertEqual(connection.execute(
                "SELECT count(*) FROM feed_item").fetchone()[0], 3)

    def test_second_poll_of_the_same_document_creates_nothing(self):
        source_id = self._source()
        self._poll(source_id)
        outcome = self._poll(source_id)
        self.assertEqual(outcome["fresh"], 0)
        self.assertEqual(outcome["created"], [])

    def test_two_sources_reporting_one_code_share_a_single_shell(self):
        first = self._source(url="https://javdb.com/actors/pRMq")
        second = self._source(url="https://javdb.com/actors/d45k9")
        self._poll(first)
        outcome = self._poll(second)
        # 源内那一层是各自的，所以第二个源仍然把三条都记成新条目……
        self.assertEqual(outcome["fresh"], 3)
        # ……但全局那一层只认番号，壳一个都不再建。
        self.assertEqual(outcome["created"], [])
        with self.database.read_connection() as connection:
            self.assertEqual(connection.execute(
                "SELECT count(*) FROM feed_discovery").fetchone()[0], 2)
            self.assertEqual(connection.execute(
                "SELECT count(*) FROM feed_item").fetchone()[0], 6)

    def test_a_code_already_in_the_library_gets_no_shell(self):
        with self.database.write_transaction() as connection:
            connection.execute(
                "INSERT INTO asset(location,path,name,medium,code) "
                "VALUES('R','R:\\\\media\\\\pbd528.mp4','pbd528.mp4','video','pbd00528')")
        source_id = self._source()
        outcome = self._poll(source_id)
        # 归一化之后 `pbd00528` 与 `PBD-528` 是同一部片。
        self.assertEqual([code for _id, code in outcome["created"]], ["BBSS-106"])

    def test_read_and_ignore_are_independent_and_do_not_touch_dedupe(self):
        source_id = self._source()
        created = self._poll(source_id)["created"]
        discovery_id = created[0][0]
        with self.database.write_transaction() as connection:
            connection.execute("UPDATE feed_discovery SET read_at=? WHERE id=?",
                               (feeds.stamp(), discovery_id))
            connection.execute("UPDATE feed_discovery SET ignored_at=? WHERE id=?",
                               (feeds.stamp(), discovery_id))
            row = connection.execute(
                "SELECT read_at,ignored_at FROM feed_discovery WHERE id=?",
                (discovery_id,)).fetchone()
        self.assertIsNotNone(row["read_at"])
        self.assertIsNotNone(row["ignored_at"])
        # 忽略之后再拉一轮，这条既不重建也不变回未忽略。
        outcome = self._poll(source_id)
        self.assertEqual(outcome["created"], [])
        with self.database.read_connection() as connection:
            row = connection.execute(
                "SELECT ignored_at FROM feed_discovery WHERE id=?",
                (discovery_id,)).fetchone()
        self.assertIsNotNone(row["ignored_at"])

    def test_settle_writes_the_next_time_on_every_path(self):
        source_id = self._source()
        with self.database.write_transaction() as connection:
            feeds.settle(connection, source_id, error="来源回了 HTTP 503",
                         interval_minutes=60)
        with self.database.read_connection() as connection:
            row = connection.execute("SELECT * FROM feed_source WHERE id=?",
                                     (source_id,)).fetchone()
        self.assertEqual(row["last_error"], "来源回了 HTTP 503")
        self.assertIsNotNone(row["next_fetch_at"])
        self.assertGreater(row["next_fetch_at"], row["last_fetched_at"])

    def test_disabled_sources_are_never_due(self):
        source_id = self._source()
        with self.database.write_transaction() as connection:
            feeds.set_enabled(connection, source_id, False)
        with self.database.read_connection() as connection:
            self.assertEqual(feeds.due_sources(connection), [])

    def test_the_longest_waiting_source_is_due_first(self):
        first = self._source(url="https://javdb.com/actors/a1")
        second = self._source(url="https://javdb.com/actors/a2")
        fresh = self._source(url="https://javdb.com/actors/a3")
        with self.database.write_transaction() as connection:
            feeds.defer(connection, first, datetime(2026, 11, 3, 2, tzinfo=timezone.utc))
            feeds.defer(connection, second, datetime(2026, 11, 3, 1, tzinfo=timezone.utc))
        with self.database.read_connection() as connection:
            due = [int(row["id"]) for row in feeds.due_sources(connection, "2026-11-03T03:00:00Z")]
        self.assertEqual(due, [fresh, second, first])

    def test_settle_after_a_cooldown_retries_at_its_end(self):
        source_id = self._source()
        until = datetime(2026, 11, 3, 3, 15, tzinfo=timezone.utc)
        with self.database.write_transaction() as connection:
            feeds.settle(connection, source_id, error="来源拒绝访问", interval_minutes=360,
                         now=datetime(2026, 11, 3, 3, tzinfo=timezone.utc), retry_at=until)
            row = connection.execute("SELECT next_fetch_at FROM feed_source WHERE id=?",
                                     (source_id,)).fetchone()
        self.assertEqual(row[0], feeds.stamp(until))

    def test_performer_names_match_existing_entities_only(self):
        with self.database.write_transaction() as connection:
            connection.execute(
                "INSERT INTO entity(kind,canonical_name,normalized_name,created_at,updated_at)"
                " VALUES('performer','深田えいみ',peach_normalize('深田えいみ'),?,?)",
                (feeds.stamp(), feeds.stamp()))
        with self.database.read_connection() as connection:
            found = feeds.match_performers(connection, ["深田えいみ", "查无此人"])
        self.assertEqual(len(found), 1)


def dmm_works(*rows) -> ActressWorks:
    """DMM 片单：每行（cid, 官方番号, 发售日, 预购, 出演）。"""
    return ActressWorks(name="森日向子", total=len(rows), works=tuple(
        ListedWork(cid=cid, title="作品タイトル", maker_code=code, release_date=date,
                   pre_order=pre_order, performers=tuple(cast), studio="ムーディーズ")
        for cid, code, date, pre_order, cast in rows))


def dmm_catalogue_works(*rows) -> CatalogueWorks:
    """DMM 片商/厂牌片单：每行（cid, 标题, 发售日, 预购, 出演, 厂牌）。"""
    return CatalogueWorks(kind="maker", id="3152", name="エスワン ナンバーワンスタイル",
                          total=len(rows), works=tuple(
        ListedWork(cid=cid, title=title, maker_code="", release_date=date,
                   pre_order=pre_order, performers=tuple(cast), studio=studio)
        for cid, title, date, pre_order, cast, studio in rows))


#: 2026-11-04 实测片单里的几种：预购的单体作品、和 JavDB 同一部、分卷、几十人的合集。
DMM_WORKS = dmm_works(
    ("mikr00133", "MIKR-133", "2026-11-13", True, ["森日向子"]),
    ("pbd00528", "PBD-528", "2026-10-20", False, ["森日向子", "共演者"]),
    ("h_068mxdlp00343", "MXDLP-0343", "2026-10-01", False, ["森日向子"]),
    ("h_1454jksr74802", "JKSR-748-02", "2026-09-01", False, ["森日向子"]),
    ("mizd00570", "MIZD-570", "2026-11-27", True, [f"女優{index}" for index in range(37)]),
)


class DmmActressFeedTest(unittest.TestCase):
    """DMM 按女优编号的片单当第二个发现源：番号写法、跨源去重、合集与补订（ADR-0135）。"""

    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self._tmp.cleanup)
        self.database = _database(Path(self._tmp.name))
        with self.database.write_transaction() as connection:
            self.performer = self._performer(connection, "森日向子", [("r18dev", "1061586")])

    @staticmethod
    def _performer(connection, name, refs) -> int:
        entity_id = int(connection.execute(
            "INSERT INTO entity(kind,canonical_name,normalized_name,created_at,updated_at)"
            " VALUES('performer',?,peach_normalize(?),?,?)",
            (name, name, feeds.stamp(), feeds.stamp())).lastrowid)
        for provider, external_id in refs:
            connection.execute(
                "INSERT INTO entity_external_ref(entity_id,provider,external_kind,external_id)"
                " VALUES(?,?,'performer',?)", (entity_id, provider, external_id))
        return entity_id

    def _poll(self, source_id, parsed, hidden=feeds.DEFAULT_HIDDEN_COMPILATIONS) -> dict:
        with self.database.write_transaction() as connection:
            source = connection.execute("SELECT * FROM feed_source WHERE id=?", (source_id,)).fetchone()
            return feeds.poll(connection, source, parsed, hidden)

    def _add(self, url) -> int:
        with self.database.write_transaction() as connection:
            return feeds.add_source(connection, url=url, entity_id=self.performer)

    def test_entries_carry_the_official_code_in_the_same_spelling_as_javdb(self):
        parsed = feeds.parse_dmm_actress(DMM_WORKS)
        self.assertEqual(parsed.title, "森日向子")
        self.assertEqual([entry.code for entry in parsed.entries],
                         ["MIKR-133", "PBD-528", "MXDLP-343", None, "MIZD-570"])
        head = parsed.entries[0]
        self.assertEqual((head.item_key, head.link, head.published_at[:10], head.title),
                         ("mikr00133", "https://video.dmm.co.jp/av/content/?id=mikr00133",
                          "2026-11-13", "MIKR-133 作品タイトル"))
        # 官方番号没问到时不回头从标题里找。
        blank = feeds.parse_dmm_actress(dmm_works(("x1", "", "", False, [])))
        self.assertIsNone(blank.entries[0].code)

    def test_dmm_and_javdb_reporting_one_work_share_a_single_shell(self):
        javdb = self._add("https://javdb.com/actors/pRMq")
        self._poll(javdb, feeds.parse_javdb_actor(JAVDB_ACTOR, "https://javdb.com/actors/pRMq"))
        dmm = self._add(feeds.dmm_actress_url("1061586"))
        outcome = self._poll(dmm, feeds.parse_dmm_actress(DMM_WORKS))
        # 预购的 MIKR-133 与 MXDLP-343 建壳；PBD-528 已有 JavDB 的壳；分卷认不出番号；合集收起。
        self.assertEqual([code for _id, code in outcome["created"]], ["MIKR-133", "MXDLP-343"])
        self.assertEqual((outcome["fresh"], outcome["without_code"], outcome["compilations"]), (5, 1, 1))
        with self.database.read_connection() as connection:
            self.assertEqual(connection.execute(
                "SELECT count(*) FROM feed_discovery WHERE code='PBD-528'").fetchone()[0], 1)
            self.assertEqual(connection.execute(
                "SELECT count(*) FROM feed_item WHERE code='PBD-528'").fetchone()[0], 2)
            shell = connection.execute(
                "SELECT release_date,performers,studio FROM feed_discovery WHERE code='MIKR-133'").fetchone()
        self.assertEqual(tuple(shell), ("2026-11-13", "森日向子", "ムーディーズ"))
        # 合集开关打开时那一部照常建壳。
        other = self._add(feeds.dmm_actress_url("1047128"))
        shown = self._poll(other, feeds.parse_dmm_actress(DMM_WORKS), hidden=frozenset())
        self.assertEqual([code for _id, code in shown["created"]], ["MIZD-570"])

    def test_actress_ids_come_from_dmm_and_r18dev_evidence(self):
        with self.database.write_transaction() as connection:
            for provider, value in (("dmm", "1061586"), ("dmm", "1047128"), ("javdb", "bkxd"),
                                    ("avwikidb", "5555"), ("dmm", "not-a-number")):
                connection.execute(
                    "INSERT OR IGNORE INTO entity_external_ref(entity_id,provider,external_kind,external_id)"
                    " VALUES(?,?,'performer',?)", (self.performer, provider, value))
            ids = feeds.dmm_actress_ids(connection, self.performer)
        self.assertEqual(ids, ["1047128", "1061586"])
        self.assertEqual(feeds.dmm_actress_id(feeds.dmm_actress_url("1061586")), "1061586")
        self.assertEqual(feeds.dmm_actress_id("https://javdb.com/actors/pRMq"), "")
        self.assertEqual(feeds.kind_of(feeds.dmm_actress_url("1061586")), feeds.KIND_DMM_ACTRESS)
        with self.assertRaises(ValueError):
            feeds.dmm_actress_url("1061586&x=1")

    def test_sync_adds_dmm_sources_only_for_followed_people_with_an_id(self):
        with self.database.write_transaction() as connection:
            nameless = self._performer(connection, "編号なし", [("javdb", "Zz9")])
            # 有 DMM 编号但没订阅的人不补。
            self._performer(connection, "未订阅", [("r18dev", "1000001")])
            for entity_id, page in ((self.performer, "pRMq"), (nameless, "Zz9")):
                feeds.add_source(connection, url=f"https://javdb.com/actors/{page}", entity_id=entity_id)
            created = feeds.sync_dmm_sources(connection)
            rows = connection.execute(
                "SELECT kind,url,entity_id FROM feed_source WHERE id IN (%s)" % ",".join("?" * len(created)),
                created).fetchall()
        self.assertEqual([tuple(row) for row in rows],
                         [(feeds.KIND_DMM_ACTRESS, "https://video.dmm.co.jp/av/list/?actress=1061586",
                           self.performer)])
        # 用户单独停掉的 DMM 那一条不会被重新打开，也不另建一条。
        with self.database.write_transaction() as connection:
            feeds.set_enabled(connection, created[0], False)
            self.assertEqual(feeds.sync_dmm_sources(connection), [])
            self.assertTrue(feeds.entity_following(connection, self.performer))
            feeds.unfollow_entity(connection, self.performer)
            self.assertFalse(feeds.entity_following(connection, self.performer))
            self.assertEqual(connection.execute(
                "SELECT count(*) FROM feed_source WHERE enabled=1").fetchone()[0], 1)


class DmmCatalogueFeedTest(unittest.TestCase):
    """DMM 片商/厂牌片单接进 Feed：解析、编号映射、订阅与「先不建壳」的边界。"""

    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self._tmp.cleanup)
        self.database = _database(Path(self._tmp.name))
        with self.database.write_transaction() as connection:
            self.studio = self._studio(connection, "無名のスタジオ")

    @staticmethod
    def _studio(connection, name, *, label_of=None) -> int:
        entity_id = int(connection.execute(
            "INSERT INTO entity(kind,canonical_name,normalized_name,created_at,updated_at)"
            " VALUES('studio',?,peach_normalize(?),?,?)",
            (name, name, feeds.stamp(), feeds.stamp())).lastrowid)
        if label_of is not None:
            connection.execute(
                "INSERT INTO label_maker(label_id,maker_id,source,checked_at) VALUES(?,?,'test',?)",
                (entity_id, int(label_of), feeds.stamp()))
        return entity_id

    @staticmethod
    def _bind(connection, entity_id, external_kind, value):
        connection.execute(
            "INSERT INTO entity_external_ref(entity_id,provider,external_kind,external_id)"
            " VALUES(?,'dmm',?,?)", (int(entity_id), external_kind, value))

    def test_catalogue_entries_without_codes_keep_cid_and_stay_unshelled(self):
        works = dmm_catalogue_works(
            ("mikr00133", "MIKR-133 作品", "2026-11-13", True, ["森日向子"], "エスワン ナンバーワンスタイル"),
            ("pbd00528", "PBD-528 作品", "2026-10-20", False, ["森日向子", "共演者"], "エスワン ナンバーワンスタイル"))
        parsed = feeds.parse_dmm_catalogue(works)
        self.assertEqual(parsed.title, "エスワン ナンバーワンスタイル")
        head, tail = parsed.entries
        self.assertEqual((head.item_key, head.link, head.published_at[:10]),
                         ("mikr00133", "https://video.dmm.co.jp/av/content/?id=mikr00133", "2026-11-13"))
        # 列表型没有 makerContentId：批量番号一条都没问到，product_code 留空串，不回退从标题猜。
        self.assertEqual((head.product_code, head.code, head.title), ("", None, "MIKR-133 作品"))
        self.assertEqual((head.performers, head.studio), ("森日向子", "エスワン ナンバーワンスタイル"))
        self.assertTrue(works.works[0].pre_order)
        self.assertIsNone(tail.code)

    def test_catalogue_entries_take_the_batch_codes_and_normalise_them_like_javdb(self):
        works = dmm_catalogue_works(
            ("mikr00133", "MIKR 作品", "2026-11-13", True, ["森日向子"], "エスワン ナンバーワンスタイル"),
            ("mxdlp00343", "MXDLP 作品", "2026-10-20", False, ["森日向子"], "ムーディーズ"))
        parsed = feeds.parse_dmm_catalogue(works, codes={"mikr00133": "MIKR-133",
                                                         "mxdlp00343": "MXDLP-0343"})
        first, second = parsed.entries
        self.assertEqual((first.product_code, first.code, first.title),
                         ("MIKR-133", "MIKR-133", "MIKR-133 MIKR 作品"))
        # 和演员片单同一种归一化：MXDLP-0343 → MXDLP-343。
        self.assertEqual((second.product_code, second.code, second.title),
                         ("MXDLP-0343", "MXDLP-343", "MXDLP-343 MXDLP 作品"))

    def test_catalogue_entries_leave_only_the_cids_the_batch_missed_empty(self):
        works = dmm_catalogue_works(
            ("mikr00133", "MIKR 作品", "2026-11-13", True, ["森日向子"], "エスワン ナンバーワンスタイル"),
            ("pbd00528", "PBD 作品", "2026-10-20", False, ["森日向子"], "エスワン ナンバーワンスタイル"))
        parsed = feeds.parse_dmm_catalogue(works, codes={"mikr00133": "MIKR-133"})
        self.assertEqual([entry.code for entry in parsed.entries], ["MIKR-133", None])
        self.assertEqual((parsed.entries[1].product_code, parsed.entries[1].title), ("", "PBD 作品"))

    def test_maker_and_label_urls_round_trip_and_other_urls_stay_javdb(self):
        self.assertEqual((feeds.dmm_catalogue_of(feeds.dmm_maker_url("3152")), feeds.dmm_maker_id(
            feeds.dmm_maker_url("3152")), feeds.kind_of(feeds.dmm_maker_url("3152"))),
                         (("maker", "3152"), "3152", feeds.KIND_DMM_MAKER))
        self.assertEqual((feeds.dmm_catalogue_of(feeds.dmm_label_url("3474")), feeds.dmm_label_id(
            feeds.dmm_label_url("3474")), feeds.kind_of(feeds.dmm_label_url("3474"))),
                         (("label", "3474"), "3474", feeds.KIND_DMM_LABEL))
        self.assertEqual(feeds.kind_of("https://javdb.com/actors/pRMq"), feeds.KIND_JAVDB_ACTOR)
        self.assertEqual(feeds.kind_of("https://video.dmm.co.jp/av/list/?maker=S1"), feeds.KIND_JAVDB_ACTOR)
        for bad in ("3152&x=1", "", None, "３１５２"):
            with self.subTest(bad=bad), self.assertRaises(ValueError):
                feeds.dmm_maker_url(bad)

    def test_a_studio_subscribes_its_bound_maker_id_only_once(self):
        with self.database.write_transaction() as connection:
            self._bind(connection, self.studio, "maker", "3152")
            first = feeds.subscribe_studio(connection, self.studio)
            second = feeds.subscribe_studio(connection, self.studio)
            rows = connection.execute("SELECT kind,url,entity_id FROM feed_source ORDER BY id").fetchall()
        self.assertEqual(first, second)
        self.assertEqual([tuple(row) for row in rows],
                         [(feeds.KIND_DMM_MAKER, "https://video.dmm.co.jp/av/list/?maker=3152", self.studio)])

    def test_a_label_entity_uses_its_label_id_not_a_misplaced_maker_id(self):
        with self.database.write_transaction() as connection:
            label = self._studio(connection, "S1 NO.1 STYLE", label_of=self.studio)
            self._bind(connection, label, "maker", "3152")
            with self.assertRaises(ValueError) as caught:
                feeds.subscribe_studio(connection, label)
            self.assertEqual(caught.exception.code, "api.feeds.noStudioIds")
            self._bind(connection, label, "label", "3474")
            feeds.subscribe_studio(connection, label)
            row = connection.execute("SELECT kind,url FROM feed_source").fetchone()
        self.assertEqual(tuple(row), (feeds.KIND_DMM_LABEL, "https://video.dmm.co.jp/av/list/?label=3474"))

    def test_a_studio_without_a_bound_id_is_refused_and_writes_nothing(self):
        with self.database.write_transaction() as connection:
            with self.assertRaises(ValueError) as caught:
                feeds.subscribe_studio(connection, self.studio)
            self.assertEqual(caught.exception.code, "api.feeds.noStudioIds")
            self.assertEqual(connection.execute("SELECT count(*) FROM feed_source").fetchone()[0], 0)

    def test_sync_adds_a_catalogue_source_for_a_followed_studio(self):
        with self.database.write_transaction() as connection:
            feeds.add_source(connection, url="https://example.test/marker", entity_id=self.studio)
            self._bind(connection, self.studio, "maker", "3152")
            created = feeds.sync_dmm_sources(connection)
            rows = connection.execute(
                "SELECT kind,url FROM feed_source WHERE id IN (%s)" % ",".join("?" * len(created)),
                created).fetchall()
        self.assertEqual([tuple(row) for row in rows],
                         [(feeds.KIND_DMM_MAKER, "https://video.dmm.co.jp/av/list/?maker=3152")])
        with self.database.write_transaction() as connection:
            self.assertEqual(feeds.sync_dmm_sources(connection), [])

    def test_a_catalogue_poll_without_codes_records_items_but_builds_no_shells(self):
        works = dmm_catalogue_works(
            ("mikr00133", "MIKR-133 作品", "2026-11-13", True, ["森日向子"], "エスワン ナンバーワンスタイル"),
            ("pbd00528", "PBD-528 作品", "2026-10-20", False, ["森日向子"], "エスワン ナンバーワンスタイル"))
        with self.database.write_transaction() as connection:
            source_id = feeds.add_source(connection, url=feeds.dmm_maker_url("3152"), entity_id=self.studio)
            source = connection.execute("SELECT * FROM feed_source WHERE id=?", (source_id,)).fetchone()
            outcome = feeds.poll(connection, source, feeds.parse_dmm_catalogue(works))
            self.assertEqual((outcome["seen"], outcome["fresh"], outcome["without_code"], outcome["created"]),
                             (2, 2, 2, []))
            self.assertEqual(connection.execute("SELECT count(*) FROM feed_item").fetchone()[0], 2)
            self.assertEqual(connection.execute("SELECT count(*) FROM feed_discovery").fetchone()[0], 0)

    def test_a_catalogue_poll_with_codes_builds_the_same_kind_of_shells_as_javdb(self):
        works = dmm_catalogue_works(
            ("mikr00133", "MIKR 作品", "2026-11-13", True, ["森日向子"], "エスワン ナンバーワンスタイル"),
            ("mxdlp00343", "MXDLP 作品", "2026-10-20", False, ["森日向子"], "ムーディーズ"),
            ("pbd00528", "PBD 作品", "2026-10-20", False, ["森日向子"], "エスワン ナンバーワンスタイル"))
        with self.database.write_transaction() as connection:
            source_id = feeds.add_source(connection, url=feeds.dmm_maker_url("3152"), entity_id=self.studio)
            source = connection.execute("SELECT * FROM feed_source WHERE id=?", (source_id,)).fetchone()
            outcome = feeds.poll(connection, source, feeds.parse_dmm_catalogue(
                works, codes={"mikr00133": "MIKR-133", "mxdlp00343": "MXDLP-0343"}))
            self.assertEqual([code for _id, code in outcome["created"]], ["MIKR-133", "MXDLP-343"])
            self.assertEqual((outcome["fresh"], outcome["without_code"]), (3, 1))
            shells = connection.execute(
                "SELECT code,release_date,performers,studio FROM feed_discovery ORDER BY code").fetchall()
        self.assertEqual([tuple(row) for row in shells],
                         [("MIKR-133", "2026-11-13", "森日向子", "エスワン ナンバーワンスタイル"),
                          ("MXDLP-343", "2026-10-20", "森日向子", "ムーディーズ")])


class DmmStudioSeedTest(unittest.TestCase):
    """片商订阅的内置种子：名称唯一命中才兜底，订阅时才写绑定，退订不删。"""

    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self._tmp.cleanup)
        self.database = _database(Path(self._tmp.name))

    @staticmethod
    def _studio(connection, name, aliases=(), kind="studio") -> int:
        entity_id = int(connection.execute(
            "INSERT INTO entity(kind,canonical_name,normalized_name,created_at,updated_at)"
            " VALUES(?,?,peach_normalize(?),?,?)",
            (kind, name, name, feeds.stamp(), feeds.stamp())).lastrowid)
        for alias in aliases:
            connection.execute(
                "INSERT INTO entity_alias(entity_id,alias,normalized_alias,source)"
                " VALUES(?,?,peach_normalize(?),'test')", (entity_id, alias, alias))
        return entity_id

    def test_seed_matches_canonical_alias_and_full_width_spelling(self):
        with self.database.write_transaction() as connection:
            studio = self._studio(connection, "Ｓ１", aliases=("エスワン", "s1"))
            self.assertEqual(feeds.known_dmm_studio(connection, studio), "3152")
            self.assertEqual(feeds.dmm_catalogue_ids(connection, studio), [("maker", "3152")])

    def test_seed_matches_an_alias_on_a_differently_named_studio(self):
        with self.database.write_transaction() as connection:
            studio = self._studio(connection, "テスト株式会社", aliases=("MOODYZ",))
            self.assertEqual(feeds.known_dmm_studio(connection, studio), "1509")

    def test_reading_a_seed_match_does_not_write_a_binding(self):
        with self.database.write_transaction() as connection:
            studio = self._studio(connection, "S1")
            self.assertEqual(feeds.dmm_catalogue_ids(connection, studio), [("maker", "3152")])
            self.assertEqual(feeds.dmm_catalogue_ids(connection, studio, resolve_seed=False), [])
            self.assertEqual(connection.execute(
                "SELECT count(*) FROM entity_external_ref").fetchone()[0], 0)
            self.assertEqual(connection.execute("SELECT count(*) FROM feed_source").fetchone()[0], 0)

    def test_seed_does_not_guess_when_two_studios_match_the_same_seed(self):
        with self.database.write_transaction() as connection:
            first = self._studio(connection, "スタジオ甲", aliases=("S1",))
            second = self._studio(connection, "スタジオ乙", aliases=("S1",))
            self.assertEqual((feeds.known_dmm_studio(connection, first),
                              feeds.known_dmm_studio(connection, second)), ("", ""))
            self.assertEqual(feeds.dmm_catalogue_ids(connection, first), [])

    def test_seed_does_not_guess_when_one_entity_matches_two_seeds(self):
        with self.database.write_transaction() as connection:
            studio = self._studio(connection, "合体スタジオ", aliases=("S1", "MOODYZ"))
            self.assertEqual(feeds.known_dmm_studio(connection, studio), "")

    def test_no_seed_and_no_binding_is_refused_without_writing(self):
        with self.database.write_transaction() as connection:
            studio = self._studio(connection, "別の会社")
            with self.assertRaises(ValueError) as caught:
                feeds.subscribe_studio(connection, studio)
            self.assertEqual(caught.exception.code, "api.feeds.noStudioIds")
            self.assertEqual(connection.execute("SELECT count(*) FROM feed_source").fetchone()[0], 0)
            self.assertEqual(connection.execute(
                "SELECT count(*) FROM entity_external_ref").fetchone()[0], 0)

    def test_an_explicit_binding_beats_the_seed(self):
        with self.database.write_transaction() as connection:
            studio = self._studio(connection, "S1")
            feeds.bind_dmm_studio(connection, studio, "maker", "999")
            self.assertEqual(feeds.dmm_catalogue_ids(connection, studio), [("maker", "999")])

    def test_subscribing_a_seeded_studio_writes_the_binding_and_unfollow_keeps_it(self):
        with self.database.write_transaction() as connection:
            studio = self._studio(connection, "S1")
            first = feeds.subscribe_studio(connection, studio)
            second = feeds.subscribe_studio(connection, studio)
            rows = connection.execute(
                "SELECT kind,url,entity_id,enabled FROM feed_source ORDER BY id").fetchall()
            refs = connection.execute(
                "SELECT provider,external_kind,external_id FROM entity_external_ref").fetchall()
        self.assertEqual(first, second)
        self.assertEqual([tuple(row) for row in rows],
                         [(feeds.KIND_DMM_MAKER, feeds.dmm_maker_url("3152"), studio, 1)])
        self.assertEqual([tuple(row) for row in refs], [("dmm", "maker", "3152")])
        with self.database.write_transaction() as connection:
            feeds.unfollow_entity(connection, studio)
            self.assertEqual(connection.execute(
                "SELECT enabled FROM feed_source").fetchone()[0], 0)
            self.assertEqual(connection.execute(
                "SELECT count(*) FROM entity_external_ref").fetchone()[0], 1)

    def test_sync_does_not_create_a_source_from_a_seed(self):
        with self.database.write_transaction() as connection:
            studio = self._studio(connection, "S1")
            feeds.add_source(connection, url="https://example.test/marker", entity_id=studio)
            self.assertEqual(feeds.sync_dmm_sources(connection), [])
            feeds.bind_dmm_studio(connection, studio, "maker", "3152")
            created = feeds.sync_dmm_sources(connection)
            row = connection.execute("SELECT kind,url FROM feed_source WHERE id=?", (created[0],)).fetchone()
        self.assertEqual(tuple(row), (feeds.KIND_DMM_MAKER, feeds.dmm_maker_url("3152")))

    def test_bind_dmm_studio_is_idempotent_and_rejects_bad_input(self):
        with self.database.write_transaction() as connection:
            first = self._studio(connection, "スタジオ甲")
            second = self._studio(connection, "スタジオ乙")
            feeds.bind_dmm_studio(connection, first, "maker", "3152")
            feeds.bind_dmm_studio(connection, first, "maker", "3152")
            self.assertEqual(connection.execute(
                "SELECT count(*) FROM entity_external_ref").fetchone()[0], 1)
            with self.assertRaises(ValueError) as taken:
                feeds.bind_dmm_studio(connection, second, "maker", "3152")
            self.assertEqual(taken.exception.code, "api.feeds.dmmIdTaken")
            with self.assertRaises(ValueError):
                feeds.bind_dmm_studio(connection, first, "maker", "S1")
            performer = self._studio(connection, "女優", kind="performer")
            with self.assertRaises(ValueError) as refused:
                feeds.bind_dmm_studio(connection, performer, "maker", "3152")
            self.assertEqual(refused.exception.code, "api.feeds.studioOnly")


class ShellBoundaryTest(unittest.TestCase):
    """壳不进 asset，所以整理、抽帧与馆藏统计看不到它（ADR-0042 第二条）。"""

    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.database = _database(Path(self._tmp.name))
        self.addCleanup(self._tmp.cleanup)

    def _poll_once(self, connection) -> int:
        source_id = feeds.add_source(connection, url="https://javdb.com/actors/pRMq")
        feeds.poll(connection, connection.execute(
            "SELECT * FROM feed_source WHERE id=?", (source_id,)).fetchone(),
            feeds.parse_javdb_actor(JAVDB_ACTOR, "https://javdb.com/actors/pRMq"))
        return source_id

    def test_a_shell_adds_no_asset_row(self):
        with self.database.write_transaction() as connection:
            self._poll_once(connection)
        with self.database.read_connection() as connection:
            self.assertEqual(connection.execute(
                "SELECT count(*) FROM asset").fetchone()[0], 0)
            self.assertGreater(connection.execute(
                "SELECT count(*) FROM feed_discovery").fetchone()[0], 0)

    def test_the_shell_table_is_not_an_asset_reference(self):
        # 物理删除资产时要清的引用名单里没有它：壳不引用 asset，两者只按番号对上。
        from peach.web_batch import ASSET_REFERENCE_TABLES
        self.assertNotIn("feed_discovery", ASSET_REFERENCE_TABLES)
        self.assertNotIn("feed_item", ASSET_REFERENCE_TABLES)

    def test_deleting_a_source_takes_its_items_but_leaves_the_shell(self):
        # 壳是「这个番号还没入库」，它不该随着某个订阅被删而消失。连接和服务一样不开
        # 外键：子表靠 `remove_source` 自己处理，不靠建表时的 CASCADE 声明。
        with self.database.write_transaction() as connection:
            feeds.remove_source(connection, self._poll_once(connection))
        with self.database.read_connection() as connection:
            self.assertEqual(connection.execute(
                "SELECT count(*) FROM feed_item").fetchone()[0], 0)
            self.assertEqual(tuple(connection.execute(
                "SELECT count(*), count(source_id) FROM feed_discovery").fetchone()), (2, 0))
            self.assertEqual(connection.execute("PRAGMA foreign_key_check").fetchall(), [])


if __name__ == "__main__":  # pragma: no cover
    unittest.main()
