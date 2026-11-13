(function() {
	try {
		var e = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, t = new e.Error().stack;
		t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "89484de7-0353-47da-b79d-2d2e016f4e6f", e._sentryDebugIdIdentifier = "sentry-dbid-89484de7-0353-47da-b79d-2d2e016f4e6f");
	} catch {}
})();
import { ApiError as e, Button as t, ButtonLink as n, Chip as r, DIAGNOSTICS_KEY as i, Disclosure as a, EmptyState as o, Fact as s, FactList as c, Fieldset as l, FieldsetTitle as u, Input as d, LOC as f, LinkButton as p, Note as m, Section as h, SettingsCard as g, SettingsSectionLabel as _, Stack as v, TaskProgress as y, __toESM as b, apiGet as ee, apiSend as x, busyProps as S, configurationSection as C, cx as w, diagnosticHeaders as T, diagnosticsSkeleton as E, errorMessage as D, fetchDiagnostics as O, fmtDur as k, fmtSize as A, queryClient as j, require_jsx_runtime as M, require_react as N, settingsPath as P, tl as F, useAction as I, useQuery as L } from "./peach-app.js";
import { ErrorExcerpt as R } from "./peach-app.error-excerpt-B8v2xEIP.js";
import { SiteMark as z } from "./peach-app.site-mark-D_VlIyJz.js";
import { DataTable as B } from "./peach-app.data-table-CPTRrw04.js";
// src/react/diagnostics/health-list.tsx
var V = /* @__PURE__ */ b(N(), 1), H = M(), U = (e) => e.title || e.name || e.code || `作品 #${e.id}`, W = (e) => [[
	"作品",
	"番号",
	"文件名",
	"媒体库",
	"路径",
	"时长（秒）",
	"大小（字节）"
], ...e.map((e) => [
	U(e),
	e.code ?? "",
	e.name,
	f[e.location] || e.location,
	e.path,
	e.duration ?? "",
	e.size ?? ""
])].map((e) => e.map((e) => String(e ?? "").replace(/[\t\r\n]+/g, " ")).join("	")).join("\n");
function G({ group: e, openItem: n, receipt: r }) {
	let i = I(), [s, c] = (0, V.useState)([]), l = (e) => void i.run("copy", () => navigator.clipboard.writeText(W(e)), () => r("已复制清单")), u = [
		{
			id: "title",
			label: "作品",
			value: U,
			render: (e) => /* @__PURE__ */ (0, H.jsxs)("span", {
				className: "flex min-w-0 flex-col gap-1",
				children: [/* @__PURE__ */ (0, H.jsx)(p, {
					variant: "primary",
					className: "justify-start whitespace-normal text-left",
					onClick: () => n(e.id),
					children: U(e)
				}), e.name && e.name !== U(e) ? /* @__PURE__ */ (0, H.jsx)("span", {
					"data-middle-truncate": !0,
					title: e.name,
					className: "block min-w-0 text-caption-1-regular text-text-secondary",
					children: e.name
				}) : null]
			})
		},
		{
			id: "code",
			label: "番号",
			width: 144,
			value: (e) => e.code || "",
			render: (e) => /* @__PURE__ */ (0, H.jsx)("span", {
				className: "whitespace-nowrap",
				children: e.code || "未识别"
			})
		},
		{
			id: "location",
			label: "媒体库",
			width: 128,
			value: (e) => f[e.location] || e.location,
			render: (e) => f[e.location] || e.location || "未取得"
		},
		{
			id: "path",
			label: "文件路径",
			width: 320,
			min: 180,
			value: (e) => e.path,
			render: (e) => /* @__PURE__ */ (0, H.jsx)("span", {
				"data-middle-truncate": !0,
				title: e.path,
				className: "block min-w-0 w-full text-body-2-regular text-text-secondary",
				children: e.path || "未取得"
			})
		},
		{
			id: "duration",
			label: "时长",
			width: 112,
			value: (e) => e.duration ?? 0,
			render: (e) => e.duration && e.duration > 0 ? k(e.duration) : "未取得"
		},
		{
			id: "size",
			label: "大小",
			width: 112,
			value: (e) => e.size ?? 0,
			render: (e) => e.size === null ? "未取得" : A(e.size)
		}
	];
	return /* @__PURE__ */ (0, H.jsx)(a, {
		summary: `${e.label} · ${e.count === null ? "未取得" : `${e.count.toLocaleString()} 项`}`,
		children: e.count === null ? /* @__PURE__ */ (0, H.jsx)(m, {
			tone: "neutral",
			children: "清单未取得，请重新检查。"
		}) : e.items.length ? /* @__PURE__ */ (0, H.jsxs)(v, { children: [
			/* @__PURE__ */ (0, H.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [e.truncated ? /* @__PURE__ */ (0, H.jsxs)("span", {
					className: "text-body-2-regular text-text-secondary",
					children: [
						"已载入 ",
						e.items.length.toLocaleString(),
						" / ",
						e.count.toLocaleString(),
						" 项"
					]
				}) : null, /* @__PURE__ */ (0, H.jsx)(t, {
					size: "small",
					variant: "secondary",
					...S(i.busy === "copy"),
					onClick: () => l(e.items),
					children: "复制当前清单"
				})]
			}),
			i.error ? /* @__PURE__ */ (0, H.jsx)(m, {
				tone: "error",
				children: i.error
			}) : null,
			/* @__PURE__ */ (0, H.jsx)(B, {
				label: e.label,
				title: "作品清单",
				unit: "部作品",
				panel: !1,
				items: e.items,
				columns: u,
				rowId: (e) => String(e.id),
				rowLabel: U,
				selected: s,
				onSelected: c,
				actions: (e) => /* @__PURE__ */ (0, H.jsx)(t, {
					size: "small",
					variant: "secondary",
					...S(i.busy === "copy"),
					onClick: () => l(e),
					children: "复制所选"
				})
			})
		] }) : /* @__PURE__ */ (0, H.jsx)(o, {
			icon: F,
			title: "清单为空",
			size: "compact",
			children: "没有需要处理的作品。"
		})
	});
}
// src/react/diagnostics/scraping-export.tsx
var K = "/api/diagnostics/exports", q = ["diagnostic-export"];
function J({ kind: r, codes: i = "", children: a }) {
	let o = I(), s = L({
		queryKey: q,
		queryFn: ({ signal: e }) => ee(K, e),
		refetchInterval: (e) => ["running", "cancelling"].includes(e.state.data?.status || "") ? 1e3 : !1
	}), c = s.data, l = c?.kind === r, u = c?.status === "running" || c?.status === "cancelling", d = r === "support" ? "下载诊断报告" : "导出刮削记录", f = (e) => {
		j.setQueryData(q, e);
	}, p = () => void o.run("start", async (t) => {
		let n = await fetch(K, {
			method: "POST",
			signal: t,
			credentials: "same-origin",
			headers: {
				...await T(),
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				kind: r,
				codes: i
			})
		}), a = await n.json().catch(() => null);
		if (!n.ok) throw new e(a?.detail || a?.error || "诊断导出未启动", n.status, a);
		if (!a || !a.job_id) throw Error("导出任务状态未取得");
		return a;
	}, f), h = () => void o.run("cancel", (e) => x(`${K}/${c.job_id}/cancel`, {}, "POST", e), f);
	return /* @__PURE__ */ (0, H.jsxs)("div", {
		className: "flex min-w-0 flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, H.jsxs)("div", {
				className: r === "support" ? "flex flex-wrap justify-end gap-2" : "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, H.jsx)(t, {
						type: "button",
						variant: "secondary",
						disabled: u,
						...S(o.busy === "start"),
						onClick: p,
						children: d
					}),
					l && u ? /* @__PURE__ */ (0, H.jsx)(t, {
						type: "button",
						variant: "secondary",
						disabled: c.status === "cancelling",
						...S(o.busy === "cancel"),
						onClick: h,
						children: "取消导出"
					}) : null,
					l && c.status === "complete" && c.download_url ? /* @__PURE__ */ (0, H.jsx)(n, {
						variant: "secondary",
						href: c.download_url,
						children: "下载已生成的文件"
					}) : null,
					a
				]
			}),
			l && u ? /* @__PURE__ */ (0, H.jsx)(y, {
				embedded: r === "scraping",
				value: c.done || 0,
				total: c.total,
				label: c.total ? `${c.stage} · ${c.done || 0} / ${c.total} 项` : `${c.stage || "准备导出"}${c.rows ? ` · ${c.rows} 条候选` : ""}${c.files ? ` · ${c.files} 个文件` : ""}`
			}) : null,
			l && c.status === "complete" ? /* @__PURE__ */ (0, H.jsxs)("p", {
				role: "status",
				className: "text-body-2-regular text-text-secondary",
				children: [
					"导出已完成 · ",
					((c.bytes || 0) / 1024 / 1024).toFixed(2),
					" MiB"
				]
			}) : null,
			l && c.status === "cancelled" ? /* @__PURE__ */ (0, H.jsx)(m, {
				tone: "neutral",
				children: "导出已取消"
			}) : null,
			s.isError ? /* @__PURE__ */ (0, H.jsx)(m, {
				tone: "error",
				action: /* @__PURE__ */ (0, H.jsx)(t, {
					type: "button",
					variant: "secondary",
					...S(s.isFetching),
					onClick: () => {
						s.refetch();
					},
					children: "重新读取"
				}),
				children: "导出进度未取得"
			}) : null,
			o.error || l && c.status === "failed" ? /* @__PURE__ */ (0, H.jsx)(m, {
				tone: "error",
				children: o.error || c?.error
			}) : null
		]
	});
}
function Y() {
	let [e, t] = (0, V.useState)("");
	return /* @__PURE__ */ (0, H.jsx)(l, {
		layout: "stack",
		labelledBy: "scraping-export-title",
		footer: /* @__PURE__ */ (0, H.jsx)(J, {
			kind: "scraping",
			codes: e
		}),
		children: /* @__PURE__ */ (0, H.jsxs)("div", {
			className: "flex min-w-0 flex-col gap-4",
			"aria-label": "导出刮削记录",
			children: [
				/* @__PURE__ */ (0, H.jsx)(u, {
					id: "scraping-export-title",
					children: "刮削记录"
				}),
				/* @__PURE__ */ (0, H.jsx)("p", {
					className: "text-body-2-regular text-text-secondary",
					children: "导出作品资料、来源取值及演员、厂牌和系列归属，供排查刮削错误。"
				}),
				/* @__PURE__ */ (0, H.jsx)(d, {
					label: "问题番号（可选）",
					name: "scraping-codes",
					value: e,
					onChange: t,
					autoComplete: "off",
					spellCheck: "false",
					maxLength: 1300,
					placeholder: "例如 ABF-087、SYKH-145…",
					hint: "多个番号用逗号分隔，最多 20 个；留空导出近期作品。"
				})
			]
		})
	});
}
// src/react/diagnostics/diagnostics-page.tsx
var X = {
	ok: "正常",
	warning: "需检查",
	failed: "需处理",
	unknown: "未取得",
	disabled: "未配置",
	stale: "待复查",
	unchecked: "尚无记录"
}, te = { "/tasks": "查看任务" }, ne = [
	["媒体库与挂载", ["media_mounts", "data_root"]],
	["数据库与迁移", ["database", "schema"]],
	["工具", ["ffmpeg"]],
	["配置与访问", [
		"configured",
		"security",
		"port",
		"version"
	]],
	["后台任务", ["tasks"]]
], Z = (e) => new Date(e).toLocaleString();
function Q({ status: e }) {
	return /* @__PURE__ */ (0, H.jsx)(r, {
		variant: "caption",
		"data-diagnostic-status": e,
		color: e === "failed" ? "rose" : e === "ok" ? "lime" : e === "warning" || e === "stale" ? "yellow" : "neutral",
		children: X[e] ?? "未取得"
	});
}
function re() {
	return /* @__PURE__ */ (0, H.jsx)(J, { kind: "support" });
}
function $({ name: e, check: t, compact: r = !1 }) {
	let i = t.target === "/settings/library" && (e === "security" || e === "port") ? P("网络与访问") : t.target, a = r ? "h4" : "h3";
	return /* @__PURE__ */ (0, H.jsxs)("div", {
		"data-diagnostic-check": e,
		className: w("flex flex-col gap-4 border-b border-separator-border pr-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between", r ? "py-3" : "py-5"),
		children: [/* @__PURE__ */ (0, H.jsxs)("div", {
			className: w("flex min-w-0 flex-1 flex-col", r ? "gap-1" : "gap-2"),
			children: [
				/* @__PURE__ */ (0, H.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [/* @__PURE__ */ (0, H.jsx)(a, {
						className: w("text-text-primary", r ? "text-body-2-medium" : "text-body-medium"),
						children: t.label
					}), /* @__PURE__ */ (0, H.jsx)(Q, { status: t.status })]
				}),
				/* @__PURE__ */ (0, H.jsx)("p", {
					"data-check-reason": !0,
					className: w("text-body-2-regular break-words", r ? "text-text-secondary" : "text-text-primary"),
					children: t.reason
				}),
				t.action ? /* @__PURE__ */ (0, H.jsxs)("p", {
					className: "text-body-2-regular text-text-secondary",
					children: ["处理建议：", t.action]
				}) : null
			]
		}), i ? /* @__PURE__ */ (0, H.jsx)("div", {
			className: "shrink-0 self-end sm:self-auto",
			children: /* @__PURE__ */ (0, H.jsx)(n, {
				size: "small",
				variant: "secondary",
				href: i,
				children: i.startsWith("/settings/") ? `打开${C(i)}` : te[i] ?? "打开相关页面"
			})
		}) : null]
	});
}
function ie(e) {
	let r = L({
		queryKey: i,
		queryFn: ({ signal: e }) => O(e),
		staleTime: 1e4
	}), o = I(), [l, u] = (0, V.useState)(""), d = () => void o.run("refresh", async () => {
		let e = await r.refetch();
		if (e.error) throw e.error;
		return e.data;
	}, () => u(""), (e) => u(D(e))), f = r.data;
	if (!f && r.isPending) return /* @__PURE__ */ (0, H.jsx)("div", {
		role: "status",
		"aria-label": "正在读取系统诊断",
		dangerouslySetInnerHTML: { __html: E() }
	});
	if (!f) return /* @__PURE__ */ (0, H.jsxs)("div", {
		className: "ui-configpage",
		children: [
			/* @__PURE__ */ (0, H.jsx)(re, {}),
			/* @__PURE__ */ (0, H.jsx)(m, {
				tone: "error",
				title: "诊断读取失败",
				action: /* @__PURE__ */ (0, H.jsx)(t, {
					variant: "secondary",
					onClick: d,
					...S(o.busy === "refresh"),
					children: "重新检查"
				}),
				children: r.error ? D(r.error) : "诊断报告未取得。"
			}),
			/* @__PURE__ */ (0, H.jsx)(Y, {})
		]
	});
	let p = Object.entries(f.checks).filter(([, e]) => [
		"warning",
		"failed",
		"unknown"
	].includes(e.status)), y = Object.entries(f.checks).filter(([, e]) => ![
		"warning",
		"failed",
		"unknown"
	].includes(e.status));
	return /* @__PURE__ */ (0, H.jsxs)("div", {
		className: "flex min-w-0 flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, H.jsx)("div", {
				"data-guide-target": "report",
				children: /* @__PURE__ */ (0, H.jsx)(J, {
					kind: "support",
					children: /* @__PURE__ */ (0, H.jsx)(t, {
						variant: "secondary",
						onClick: d,
						...S(o.busy === "refresh"),
						children: "重新检查"
					})
				})
			}),
			l ? /* @__PURE__ */ (0, H.jsx)(m, {
				tone: "error",
				children: l
			}) : null,
			p.length ? /* @__PURE__ */ (0, H.jsx)(h, {
				guide: "attention",
				title: `需要关注 · ${p.length} 项`,
				children: p.map(([e, t]) => /* @__PURE__ */ (0, H.jsx)($, {
					name: e,
					check: t
				}, e))
			}) : null,
			/* @__PURE__ */ (0, H.jsx)(h, {
				guide: "health",
				title: "库健康",
				children: /* @__PURE__ */ (0, H.jsxs)(v, { children: [f.library.issue_at ? /* @__PURE__ */ (0, H.jsxs)("p", {
					className: "text-body-2-regular text-text-secondary",
					children: ["处理记录 · ", Z(f.library.issue_at)]
				}) : null, Object.entries(f.library.groups).map(([t, n]) => /* @__PURE__ */ (0, H.jsx)(G, {
					group: n,
					...e
				}, t))] })
			}),
			y.length ? /* @__PURE__ */ (0, H.jsx)("section", {
				"aria-label": "系统检查",
				children: /* @__PURE__ */ (0, H.jsx)(a, {
					summary: `其他检查 · ${y.length} 项`,
					contentClassName: "gap-5",
					children: ne.map(([e, t]) => {
						let n = y.filter(([e]) => t.some((t) => t === e));
						return n.length ? /* @__PURE__ */ (0, H.jsxs)("section", {
							"aria-label": e,
							"data-diagnostic-group": "",
							className: "flex min-w-0 flex-col gap-2",
							children: [/* @__PURE__ */ (0, H.jsxs)("h3", {
								className: "flex items-center gap-2 px-3 text-body-medium text-text-primary",
								children: [e, /* @__PURE__ */ (0, H.jsxs)("span", {
									className: "text-caption-1-regular text-text-secondary",
									children: [n.length, " 项"]
								})]
							}), /* @__PURE__ */ (0, H.jsx)(g, { children: n.map(([e, t]) => /* @__PURE__ */ (0, H.jsx)($, {
								name: e,
								check: t,
								compact: !0
							}, e)) })]
						}, e) : null;
					})
				})
			}) : null,
			/* @__PURE__ */ (0, H.jsx)(Y, {}),
			/* @__PURE__ */ (0, H.jsxs)("section", {
				"data-guide-target": "sessions",
				"aria-label": "来源会话",
				className: "flex min-w-0 flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, H.jsx)(_, { children: "来源会话" }),
					f.sources.map((e) => /* @__PURE__ */ (0, H.jsx)("article", {
						"data-diagnostic-source": e.source,
						children: /* @__PURE__ */ (0, H.jsx)(g, { children: /* @__PURE__ */ (0, H.jsxs)(v, { children: [
							/* @__PURE__ */ (0, H.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, H.jsxs)("h3", {
									className: "flex min-w-0 items-center gap-2 text-body-medium text-text-primary",
									children: [/* @__PURE__ */ (0, H.jsx)(z, { source: e.source }), e.label]
								}), /* @__PURE__ */ (0, H.jsx)(Q, { status: e.status })]
							}),
							/* @__PURE__ */ (0, H.jsx)(R, {
								text: e.reason,
								className: "text-body-regular text-text-primary"
							}),
							/* @__PURE__ */ (0, H.jsxs)(c, { children: [
								/* @__PURE__ */ (0, H.jsx)(s, {
									term: "上次解析成功",
									children: e.last_success_at ? Z(e.last_success_at) : "尚无成功记录"
								}),
								e.last_check_at ? /* @__PURE__ */ (0, H.jsxs)(s, {
									term: "上次检查",
									children: [Z(e.last_check_at), e.elapsed_s !== void 0 && e.elapsed_s !== null ? ` · ${e.elapsed_s.toFixed(2)} 秒` : ""]
								}) : null,
								/* @__PURE__ */ (0, H.jsx)(s, {
									term: "暂停访问至",
									children: e.cooldown_until ? Z(e.cooldown_until) : "未暂停"
								})
							] })
						] }) })
					}, e.source)),
					/* @__PURE__ */ (0, H.jsx)("div", { children: /* @__PURE__ */ (0, H.jsx)(n, {
						size: "small",
						variant: "secondary",
						href: "/sources",
						children: "打开来源和凭证"
					}) })
				]
			})
		]
	});
}
export { ie as DiagnosticsPage };

//# debugId=89484de7-0353-47da-b79d-2d2e016f4e6f