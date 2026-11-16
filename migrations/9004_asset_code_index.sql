-- 浏览器添加与状态查询按规范番号找资产时，`asset.code` 是已归一化的列。
-- 没有这个索引时，`status` 在 10 万级资产上只能扫全表，批量的共享进度轮询
-- 会把浏览器添加的 HTTP 请求拖到超时。表达式查询仍保留给升级前留下的非规范值。
CREATE INDEX IF NOT EXISTS idx_asset_code ON asset(code);
