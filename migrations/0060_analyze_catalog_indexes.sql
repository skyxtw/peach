-- 0059 的 asset(medium) 索引给筛选用，但库从未 ANALYZE：SQLite 没有真实分布，
-- 人物索引的分类子查询会把 medium 索引当成高选择性入口，反过来按每条实体扫全表
-- （390MB 预览库上 /api/index?kind=performers 从亚秒级掉到几十秒）。
-- 只更新查询计划统计（sqlite_stat1），不动账本数据；与 0059 一起让统计跟上索引。
ANALYZE;
