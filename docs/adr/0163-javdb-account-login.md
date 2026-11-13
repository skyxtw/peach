# ADR-0163：JavDB 作品资料改走账号登录

- 状态：已采纳
- 日期：2026-11-13
- 关系：取代 [ADR-0144](0144-javdb-scraping-uses-the-anonymous-api.md) 的「匿名接口」前提；补充 [ADR-0148](0148-javdb-api-host-and-signature-fallback.md) 的主机顺序与签名回退；与 [ADR-0160](0160-javdb-scraping-falls-back-to-detail-pages.md) 的网页回退并存（有账号时先走接口令牌，没有账号或令牌被拒时回退网页）

## 背景

2026-11-10 之后，`jdforrepam.com` 等三家接口主机与 javdb.com 对匿名资料请求统一回 `HTTP 200` 加
`{"success":0,"action":"JWTVerificationError","message":"請登錄帳號"}`。现场核对：网页前端的签名算法与
常量没有变（前端 JS 里的 `oS`、`iS` 与 `APP_SIGNATURE` 相同），本机 `jav-public` 快照最后一次成功是
11-10 15:18；`POST /api/v1/sessions` 的表单登录仍可用，回执 `data.token`，之后的请求带
`authorization: <token>`。Peach 原来把这句 `success=0` 显示成「作品资料未取得，请稍后重试」，
而重试永远不会成功：详情页、评论、磁链、库外发现和批量补资料一起停摆。

## 决策

**一、账号由用户自己填。** 凭据走既有的「来源凭据」（`secrets/follow/javdb.json`，
`CREDENTIAL_GUIDE` 声明 `username`、`password`），不进 `config.toml`、不回显、不进日志；密码只用来
换登录令牌，令牌只留在内存，因此这一项不跨机同步。

**二、资料请求带令牌，被拒时换一次再报账号。** `PublicAPI._json` 先取令牌再发请求；接口回
`JWTVerificationError` 时换一份令牌重发一次，仍被拒就报「登录令牌被拒绝」，不再整源冷却 60 秒、
让界面说「稍后重试」。登录问题不是配额问题，不该占用来源冷却。

**三、没配账号时如实报登录。** 新增 `PublicSourceAuthRequired`，消息指向「配置 → 来源 → 来源凭据」；
登录被拒后 5 分钟内不再打登录接口，避免密码填错时每打开一个详情页就失败登录一次。

**四、风险由用户承担。** 账号用于程序化请求可能触发站点风控，这正是 ADR-0144 当年选匿名接口的
原因；这次是用户明确要求换回账号，上线说明要写清楚。

## 后果

- 详情页、评论、磁链、库外发现与批量补资料恢复；未配置账号时这些入口给出可操作的说明。
- 登录请求走 Peach 的代理设置与主机顺序（`API_HOSTS`），不计入作品资料请求预算，也不占主机间隔。
- 老用户升级后不配置账号仍能读馆藏与已有快照，只是库外资料继续报需要登录；不需要迁移或补修。
- 站点若再改协议（例如换成别的鉴权头），失败会落到「登录令牌被拒绝」而不是「稍后重试」。

## 验证

`tests/test_javdb_account.py` 覆盖凭据字段声明、登录表单与签名头、令牌复用、登录被拒的冷却与提示、
授权头与换令牌重试、无账号时的提示，以及其它业务失败保持原文案；`tests/test_follow_web.py` 的
来源凭据接口与骨架登记用例覆盖新 provider 的列出、保存与不回显。
