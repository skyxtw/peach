-- 关注页在线播放心跳不推 follow_playback 的版本号。
--
-- 在线播放每十秒一次 `/api/follow/activity`，只改 play_seconds、max_reached 与
-- last_played。0038 的 rev_follow_playback_update 不分列，于是每次心跳都推高版本：
-- 统计页（STATS_TABLES 含 follow_playback）每一轮都要重算三十多条聚合，页面结果版本
-- 也跟着变。这几列是观看进度而不是编目内容，播放器自己画进度；统计页的在线读数按
-- tests/test_ledger_revision.py 里 ResultVersionTablesTests.EXEMPT 的口径，等下一次
-- 别的写入再更新。
--
-- SQLite 只有 `UPDATE OF <列>` 白名单。以后给 follow_playback 加列要同步改这份触发器，
-- tests/test_ledger_revision.py 按 `PRAGMA table_info` 核对覆盖。
--
-- play_count 留在名单里：它只由起播（`/api/follow/play`）写，一次播放一次；「已看过」
-- 状态、统计页的在线播放次数与排序都要随起播刷新。
DROP TRIGGER rev_follow_playback_update;
CREATE TRIGGER rev_follow_playback_update AFTER UPDATE OF
  follow_item_id, profile_id, play_count
ON follow_playback BEGIN
  UPDATE ledger_revision SET n=n+1 WHERE tbl='follow_playback';
END;
