-- 库规模下 `WHERE medium='video'` 是列表、统计和后台修复任务最常用的过滤条件。
--
-- asset 上现有索引都从别的列起头（hash、size、location、name、disposal、region），没有能把
-- `medium` 当搜索键的索引；十几万行的库上这类 COUNT/GROUP BY 只能全表扫描（#718 实测
-- 742 ms）。补一个单列索引，让计划走 `SEARCH asset USING COVERING INDEX`
-- （同一份数据上 0.2 ms 量级）。
--
-- 只建索引，不动数据：孤儿行清理与 VACUUM 会改账本，须用户单独授权（#718 剩余项）。
CREATE INDEX IF NOT EXISTS idx_asset_medium ON asset(medium);
