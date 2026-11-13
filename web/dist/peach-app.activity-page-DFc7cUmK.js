(function() {
	try {
		var e = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, t = new e.Error().stack;
		t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "f3d45222-5726-4167-aff5-1f520ca689ce", e._sentryDebugIdIdentifier = "sentry-dbid-f3d45222-5726-4167-aff5-1f520ca689ce");
	} catch {}
})();
import { Button as e, Bx as t, Chip as n, DataTableFooter as r, Disclosure as i, DownloadsPanel as a, EmptyState as o, Gg as s, HN as c, IssueRow as l, LinkButton as u, Lo as d, LoadingDots as f, Ma as p, NameLink as m, Note as h, OV as g, Pf as _, ProcessingMode as v, Progress as y, RB as b, Rk as x, Su as S, TASKS_KEY as C, TRIGGER_LABELS as w, Xl as T, __toESM as E, apiGet as D, apiSend as ee, busyProps as O, cardClass as k, confirmModal as A, controlTask as te, cx as ne, elapsedText as j, errorMessage as M, fetchTasks as re, fmtSize as ie, foldByKind as ae, foldRoutine as oe, followupDetail as se, followupTally as N, groupFollowups as ce, hasResultProblems as P, i2 as F, isActive as I, isRoutine as le, latestOfKind as ue, momentText as L, notifyManager as de, oe as fe, pollInterval as pe, problemDestination as me, progressText as R, readableErrorHeadline as z, replaceEqualDeep as he, require_jsx_runtime as ge, require_react as _e, setTaskSpeed as ve, statusLabel as ye, summaryItems as be, taskIssues as xe, taskSubject as B, um as Se, uo as Ce, useMutation as V, useQuery as H, useQueryClient as U, vl as we } from "./peach-app.js";
import { CodeBlock as W } from "./peach-app.code-block-5D8eSV-F.js";
import { Page as G } from "./peach-app.page-QAncjzM1.js";
import { ErrorDetails as K, ErrorExcerpt as Te } from "./peach-app.error-excerpt-B8v2xEIP.js";
// node_modules/@tanstack/react-query/build/modern/useMutationState.js
var q = /* @__PURE__ */ E(_e(), 1);
function Ee() {
	let e;
	return (t, n) => {
		let r = [], i;
		return () => {
			let a = t.findAll(n.filters), o = a.flatMap((e) => [e, e.state]);
			return (!i || o.length !== r.length || o.some((e, t) => !Object.is(e, r[t]))) && (r = o, i = he(e, a.map((e) => n.select ? n.select(e) : e.state)), e = i), i;
		};
	};
}
function De(e = {}, t) {
	let n = U(t).getMutationCache(), [r] = q.useState(() => Ee()), i = r(n, e);
	return q.useSyncExternalStore(q.useCallback((e) => n.subscribe(de.batchCalls(e)), [n]), i, i);
}
// src/react/activity/background-issues.tsx
var J = ge(), Oe = ["background-issues"];
function ke() {
	let e = (0, q.useId)(), t = H({
		queryKey: Oe,
		queryFn: ({ signal: e }) => D("/api/background-issues", e),
		refetchInterval: 3e4
	}).data?.issues || [];
	return t.length ? /* @__PURE__ */ (0, J.jsxs)("section", {
		"aria-labelledby": e,
		className: "flex min-w-0 flex-col gap-3",
		children: [/* @__PURE__ */ (0, J.jsx)("h3", {
			id: e,
			className: "text-title-2-medium text-text-primary",
			children: "需要处理"
		}), /* @__PURE__ */ (0, J.jsx)("ul", {
			className: "flex min-w-0 flex-col gap-3",
			children: t.map((e) => /* @__PURE__ */ (0, J.jsx)("li", { children: /* @__PURE__ */ (0, J.jsx)(Ae, { issue: e }) }, e.key))
		})]
	}) : null;
}
function Ae({ issue: t }) {
	let n = U(), r = V({
		mutationFn: () => ee(t.retry, {}),
		onSuccess: () => {
			n.invalidateQueries({ queryKey: Oe });
		}
	}), i = t.since ? `自 ${L(t.since)} 起` : `发现于 ${L(t.noticed_at)}`;
	return /* @__PURE__ */ (0, J.jsx)(h, {
		tone: "error",
		title: t.title,
		action: /* @__PURE__ */ (0, J.jsxs)("div", {
			className: "flex flex-wrap items-center gap-2",
			children: [/* @__PURE__ */ (0, J.jsx)(u, {
				href: t.href,
				size: "small",
				trailingIcon: F,
				children: t.link_label
			}), t.retry ? /* @__PURE__ */ (0, J.jsx)(e, {
				variant: "secondary",
				size: "small",
				disabled: !t.retry_available,
				...O(r.isPending),
				onClick: () => r.mutate(),
				children: "立即重试"
			}) : null]
		}),
		children: r.error ? `${i}\n没有重试：${M(r.error)}` : i
	});
}
// src/react/activity/task-controls.tsx
var Y = ["task-control"], je = {
	pause: g,
	resume: s,
	cancel: c
}, Me = {
	pause: "暂停",
	resume: "继续",
	cancel: "取消"
}, Ne = {
	pause: "暂停后续任务",
	resume: "继续后续任务",
	cancel: "取消后续任务"
};
function Pe() {
	let e = De({
		filters: { mutationKey: Y },
		select: (e) => ({
			id: e.mutationId,
			command: e.state.variables,
			status: e.state.status,
			error: e.state.error
		})
	}), t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = n.command;
		if (!e) continue;
		let r = t.get(e.id);
		(!r || r.id < n.id) && t.set(e.id, {
			...n,
			command: e
		});
	}
	let n = [...t.values()].filter((e) => e.status === "error");
	return n.length ? /* @__PURE__ */ (0, J.jsx)("div", {
		"data-task-control-feedback": "",
		className: "flex min-w-0 flex-col gap-2",
		children: n.map(({ command: e, error: t }) => /* @__PURE__ */ (0, J.jsx)(h, {
			tone: "error",
			title: `${e.label}：${(e.followups ? Ne : Me)[e.action]}未完成`,
			children: M(t)
		}, e.id))
	}) : null;
}
function Fe({ run: t, runs: n = [t] }) {
	let r = U(), i = (0, q.useRef)({
		change: !1,
		cancel: !1,
		confirmation: !1
	}), a = () => {
		r.invalidateQueries({ queryKey: C });
	}, o = async (e) => {
		let t = null;
		for (let r of n) try {
			await te(r.id, e.action);
		} catch (e) {
			t ??= e;
		}
		if (t !== null) throw t;
	}, s = n.length > 1 ? `这 ${n.length} 批` : "这轮", c = V({
		mutationKey: [
			...Y,
			t.id,
			"change"
		],
		mutationFn: o,
		onSettled: () => {
			i.current.change = !1, a();
		}
	}), l = V({
		mutationKey: [
			...Y,
			t.id,
			"cancel"
		],
		mutationFn: o,
		onSettled: () => {
			i.current.cancel = !1, a();
		}
	}), u = V({
		mutationFn: async (e) => {
			let t = (await Promise.allSettled(n.map((t) => ve(t.id, e)))).find((e) => e.status === "rejected");
			if (t?.status === "rejected") throw t.reason;
		},
		onSettled: a
	}), d = (t.control?.actions || []).filter((e) => e !== "set_speed"), f = !!(t.control?.actions.includes("set_speed") && t.control.speed_mode), p = !I(t), m = l.isPending || l.isSuccess;
	if (!d.length && !f) return null;
	let g = (e) => {
		let n = {
			id: t.id,
			label: t.task_label,
			action: e,
			followups: p
		};
		if (e === "cancel") {
			if (i.current.cancel || i.current.confirmation || l.isSuccess) return;
			i.current.confirmation = !0, A({
				title: p ? `取消「${t.task_label}」的全部后续任务` : `取消任务「${t.task_label}」`,
				body: p ? `将停止${s}已派出的全部后续任务，包括正在处理和排队的项目。已保存的资料和结果会保留。这些后续任务取消后不能继续，需要时重新发起。` : "将停止这轮剩余的处理及其后续任务。已保存的资料和结果会保留。这轮任务取消后不能继续，需要时重新发起。",
				confirmLabel: p ? "取消后续任务" : "取消任务",
				danger: !0,
				onConfirm: async () => (i.current.cancel = !0, await l.mutateAsync(n))
			}).finally(() => {
				i.current.confirmation = !1;
			});
		} else {
			if (i.current.change || i.current.cancel || m) return;
			i.current.change = !0, c.mutate(n);
		}
	};
	return /* @__PURE__ */ (0, J.jsxs)("div", {
		className: "ml-auto min-w-0",
		"data-task-controls": t.id,
		children: [/* @__PURE__ */ (0, J.jsxs)("div", {
			role: "group",
			"aria-label": `${t.task_label}${p ? "后续任务" : "任务"}控制`,
			className: "flex flex-wrap items-center justify-end gap-2",
			children: [f ? /* @__PURE__ */ (0, J.jsx)(v, {
				value: t.control.speed_mode,
				busy: u.isPending || m,
				animate: t.control?.state === "running",
				onChange: (e) => u.mutate(e)
			}) : null, d.map((t) => {
				let n = (p ? Ne : Me)[t], r = t === "cancel" ? l.isPending : c.isPending && c.variables?.action === t, i = t === "cancel" ? m : c.isPending || m;
				return /* @__PURE__ */ (0, J.jsx)(e, {
					type: "button",
					variant: "secondary",
					size: "small",
					iconOnly: !0,
					leadingIcon: je[t],
					"aria-label": n,
					title: n,
					...O(r),
					"aria-disabled": i || void 0,
					onClick: () => g(t),
					"data-tooltip-copy-key": `tasks.control.action.${p ? "followups." : ""}${t}`
				}, t);
			})]
		}), u.error ? /* @__PURE__ */ (0, J.jsx)(h, {
			tone: "error",
			children: M(u.error)
		}) : null]
	});
}
// src/react/activity/task-icon.tsx
var Ie = new Map([
	[t, [
		"follow-check",
		"follow-resolve",
		"follow-creator",
		"follow-evidence-reclaim",
		"feed-check",
		"feed-scrape",
		"feed-cover"
	]],
	[x, [
		"library-processing",
		"organize",
		"batch",
		"resource-scan",
		"resource-apply",
		"seed-import"
	]],
	[we, [
		"scrape-codes",
		"jav-discovery-metadata",
		"want-scrape",
		"upgrade-library"
	]],
	[p, [
		"scraping-cover",
		"jav-covers",
		"code-samples",
		"timeline-thumbnails",
		"entity-avatar"
	]],
	[_, [
		"performer-profile",
		"performer-alias",
		"creator-identity",
		"studio-mark"
	]],
	[T, ["media-repair", "mp4-header-repair"]],
	[Se, [
		"link-check",
		"link-prune",
		"source-check"
	]],
	[fe, ["download-postprocess"]],
	[d, ["taste-refresh"]],
	[b, [
		"upgrade-repairs",
		"diagnostic-export",
		"amane-bridge",
		"face-models",
		"ledger-backup",
		"ledger-restore"
	]]
].flatMap(([e, t]) => t.map((t) => [t, e])));
function Le({ taskKey: e, className: t }) {
	let n = Ie.get(e) ?? S;
	return /* @__PURE__ */ (0, J.jsx)(n, {
		className: t,
		"aria-hidden": !0
	});
}
// src/react/activity/resource-chip.tsx
var Re = {
	blue: "bg-status-blue-text text-background-primary-default",
	purple: "bg-status-purple-text text-background-primary-default",
	cyan: "bg-status-cyan-text text-background-primary-default"
};
function ze({ color: e, high: t, ...r }) {
	return t ? /* @__PURE__ */ (0, J.jsx)("span", {
		...r,
		className: ne("inline-flex items-center justify-center rounded-md px-1.5 py-1 whitespace-nowrap text-caption-1-medium", Re[e])
	}) : /* @__PURE__ */ (0, J.jsx)(n, {
		variant: "caption",
		color: e,
		...r
	});
}
// src/react/activity/task-resources.tsx
var Be = {
	cpu: {
		name: "CPU",
		color: "blue"
	},
	gpu: {
		name: "GPU",
		color: "purple"
	},
	network: {
		name: "网络",
		color: "cyan"
	}
};
function Ve(e) {
	return e.state === "sampling" ? "采样中" : e.via === "cloud" ? "网盘读取" : "未取得";
}
function He(e, t) {
	return t === 0 ? "未使用" : e === "network" ? `${ie(t)}/s` : `${t.toLocaleString(void 0, { maximumFractionDigits: 1 })}%`;
}
function Ue({ run: e, active: t = I(e) || !!e.control }) {
	if (!t || !e.resources) return null;
	let n = e.resources;
	return /* @__PURE__ */ (0, J.jsx)("div", {
		"data-task-resources": e.id,
		className: "flex min-w-0 flex-wrap items-center gap-2",
		children: [
			"cpu",
			"gpu",
			"network"
		].map((e) => {
			let t = n[e], r = Be[e], i = e === "network" ? n.network.bytes_per_second : n[e].percent, a = t.state === "ready" && i !== null, o = a && t.high, s = a ? He(e, i) : Ve(t), c = [t.reason, o ? "当前为高占用。" : ""].filter(Boolean).join("\n");
			return /* @__PURE__ */ (0, J.jsxs)(ze, {
				color: r.color,
				high: o,
				tabIndex: c ? 0 : void 0,
				title: c || void 0,
				"data-task-resource": e,
				"data-resource-state": t.state,
				"data-resource-via": t.via,
				"data-resource-high": o || void 0,
				"data-resource-idle": a && i === 0 || void 0,
				"data-copy-ignore": "",
				children: [
					r.name,
					" ",
					s
				]
			}, e);
		})
	});
}
// src/react/activity/activity-page.tsx
var We = /* @__PURE__ */ new Set(["upgrade-repairs"]), Ge = /* @__PURE__ */ new Set(["asset_id", "name"]), Ke = {
	succeeded: "lime",
	failed: "rose",
	cancelled: "rose",
	interrupted: "yellow",
	running: "blue",
	pending: "neutral"
}, qe = {
	running: "进行中",
	pausing: "正在暂停",
	paused: "已暂停",
	cancelling: "正在取消"
};
function X({ run: e }) {
	let t = e.control?.state;
	if (t && (t !== "running" || !I(e))) return /* @__PURE__ */ (0, J.jsx)(n, {
		color: t === "running" ? "blue" : "neutral",
		children: /* @__PURE__ */ (0, J.jsx)("span", {
			"data-copy-key": `tasks.control.state.${t}`,
			children: qe[t]
		})
	});
	let r = e.status === "failed" && e.task_key === "library-processing" && e.result_summary?.outcome === "partial", i = r || e.status === "succeeded" && P(e);
	return /* @__PURE__ */ (0, J.jsx)(n, {
		color: i ? "yellow" : Ke[e.status] ?? "neutral",
		children: r ? "部分项目需处理" : i ? "发现问题" : ye(e.status)
	});
}
function Je({ rows: e }) {
	let [t, n] = (0, q.useState)({
		pageIndex: 0,
		pageSize: 20
	}), { pageSize: a } = t, o = Math.min(t.pageIndex, Math.max(0, Math.ceil(e.length / a) - 1));
	return /* @__PURE__ */ (0, J.jsxs)(J.Fragment, { children: [/* @__PURE__ */ (0, J.jsx)("ul", {
		className: "-mr-5 flex min-w-0 flex-col",
		children: e.slice(o * a, (o + 1) * a).map((e) => {
			let t = se(e);
			return /* @__PURE__ */ (0, J.jsxs)("li", {
				"data-status": e.status,
				"data-followup-key": e.followup_key,
				className: "flex min-w-0 flex-col gap-1 border-t border-separator-border py-2.5 pr-10 pl-5",
				children: [
					/* @__PURE__ */ (0, J.jsxs)("div", {
						className: "flex min-w-0 flex-wrap items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, J.jsxs)("div", {
							className: "flex min-w-0 flex-1 basis-40 flex-wrap items-center gap-x-2 gap-y-1",
							children: [
								/* @__PURE__ */ (0, J.jsx)(Le, {
									taskKey: e.task_key,
									className: "size-4 shrink-0 text-text-secondary"
								}),
								/* @__PURE__ */ (0, J.jsx)("span", {
									className: "min-w-0 break-words text-caption-1-regular text-text-primary",
									children: e.task_label
								}),
								/* @__PURE__ */ (0, J.jsx)(X, { run: e }),
								t ? /* @__PURE__ */ (0, J.jsx)("span", {
									className: "min-w-0 break-words text-caption-1-regular text-text-secondary",
									children: t
								}) : null
							]
						}), /* @__PURE__ */ (0, J.jsx)(Fe, { run: e })]
					}),
					/* @__PURE__ */ (0, J.jsx)(Ue, { run: e }),
					Object.keys(e.result_summary || {}).length ? /* @__PURE__ */ (0, J.jsx)("div", {
						className: "w-full min-w-0",
						children: /* @__PURE__ */ (0, J.jsx)(i, {
							summary: "技术详情",
							contentClassName: "pb-2.5",
							children: /* @__PURE__ */ (0, J.jsx)(W, {
								code: JSON.stringify(e.result_summary, null, 2),
								language: "json",
								label: `${e.task_label}技术详情`
							})
						})
					}) : null
				]
			}, e.id);
		})
	}), /* @__PURE__ */ (0, J.jsx)(r, {
		label: "任务明细",
		total: e.length,
		pagination: {
			...t,
			pageIndex: o
		},
		onChange: n
	})] });
}
function Z({ run: e, meta: t, children: n, error: r, issues: a, followups: o, followupTotal: s = 0, badge: c, resourceActive: l, controlled: u }) {
	let [d, f] = (0, q.useState)(!!o?.some(I)), p = (u || [e]).map((e) => e.id), g = s > (o?.length || 0), _ = H({
		queryKey: [
			...C,
			"followups",
			p
		],
		enabled: d && g,
		queryFn: async ({ signal: e }) => (await Promise.all(p.map((t) => D(`/api/tasks/${t}`, e)))).flatMap((e) => e.followups),
		refetchInterval: l ? 2e3 : !1
	}), v = (e) => e.status === "running" ? 3 : e.status === "pending" ? 2 : +(e.status === "failed" || e.status === "interrupted"), y = [...(g ? _.data : void 0) || o || []].sort((e, t) => v(t) - v(e) || t.id - e.id), b = y.length, x = Math.max(o?.length || 0, s), S = B(e), w = String(r || "").trim(), T = z(w);
	return /* @__PURE__ */ (0, J.jsxs)("li", {
		id: `run-${e.id}`,
		"data-status": e.status,
		"data-task-key": e.task_key,
		"data-run-id": e.id,
		className: k({
			padding: "none",
			bordered: e.status === "failed" ? "error" : void 0,
			className: "flex flex-col"
		}),
		children: [
			/* @__PURE__ */ (0, J.jsxs)("div", {
				className: "flex flex-col gap-2 px-5 py-4",
				children: [
					/* @__PURE__ */ (0, J.jsxs)("div", {
						className: "flex min-w-0 flex-wrap items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, J.jsxs)("div", {
							className: "flex min-w-0 flex-1 basis-48 flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, J.jsx)(Le, {
									taskKey: e.task_key,
									className: "size-5 shrink-0 text-text-secondary"
								}),
								/* @__PURE__ */ (0, J.jsx)("strong", {
									className: "min-w-0 break-words text-title-3-medium text-text-primary",
									children: e.task_label
								}),
								c ?? /* @__PURE__ */ (0, J.jsx)(X, { run: e })
							]
						}), /* @__PURE__ */ (0, J.jsx)(Fe, {
							run: e,
							runs: u
						})]
					}),
					/* @__PURE__ */ (0, J.jsx)("p", {
						className: "text-caption-1-regular text-text-secondary",
						children: t
					}),
					/* @__PURE__ */ (0, J.jsx)(Ue, {
						run: e,
						active: l
					}),
					S ? /* @__PURE__ */ (0, J.jsx)(m, {
						href: S.href,
						"data-task-subject": e.id,
						title: S.label,
						className: "min-w-0 max-w-full self-start truncate text-text-primary",
						children: S.label
					}) : null,
					T ? /* @__PURE__ */ (0, J.jsx)("p", {
						"data-task-error": "",
						className: "text-caption-1-regular text-text-secondary wrap-anywhere",
						children: T
					}) : null,
					n
				]
			}),
			a ? /* @__PURE__ */ (0, J.jsx)("div", {
				className: "border-t border-separator-border",
				children: a
			}) : null,
			T && w !== T ? /* @__PURE__ */ (0, J.jsx)("div", {
				className: "border-t border-separator-border",
				children: /* @__PURE__ */ (0, J.jsx)(i, {
					row: !0,
					summary: "错误详情",
					contentClassName: "pb-5",
					children: /* @__PURE__ */ (0, J.jsx)(K, {
						label: `${e.task_label}错误详情`,
						children: w
					})
				})
			}) : null,
			x ? /* @__PURE__ */ (0, J.jsx)("div", {
				className: "border-t border-separator-border",
				children: /* @__PURE__ */ (0, J.jsxs)(i, {
					row: !0,
					summary: `任务明细 · ${x.toLocaleString()} 项`,
					contentClassName: "pb-5",
					isOpen: d,
					onOpenChange: f,
					children: [
						_.error ? /* @__PURE__ */ (0, J.jsx)(h, {
							tone: "error",
							children: M(_.error)
						}) : null,
						b < x ? /* @__PURE__ */ (0, J.jsxs)("p", {
							className: "text-caption-1-regular text-text-secondary",
							children: [
								"列出其中 ",
								b.toLocaleString(),
								" 项"
							]
						}) : null,
						/* @__PURE__ */ (0, J.jsx)(Je, { rows: y })
					]
				})
			}) : null,
			Object.keys(e.result_summary || {}).some((e) => !(S && Ge.has(e))) ? /* @__PURE__ */ (0, J.jsx)("div", {
				className: "border-t border-separator-border",
				children: /* @__PURE__ */ (0, J.jsx)(i, {
					row: !0,
					summary: "技术详情",
					contentClassName: "pb-5",
					children: /* @__PURE__ */ (0, J.jsx)(W, {
						code: JSON.stringify(e.result_summary, null, 2),
						language: "json",
						label: `${e.task_label}技术详情`
					})
				})
			}) : null
		]
	});
}
function Ye({ run: e, followups: t, followupTotal: n }) {
	let r = e.progress_total || 0, i = e.progress_current || 0, a = e.control?.state, o = a && a !== "running", s = o ? qe[a] : e.progress_label || "正在进行", c = j(e.elapsed_seconds), l = [w[e.trigger] || e.trigger, c && `已跑 ${c}`].filter(Boolean).join(" · ");
	return /* @__PURE__ */ (0, J.jsx)(Z, {
		run: e,
		meta: l,
		followups: t,
		followupTotal: n,
		children: r > 0 ? /* @__PURE__ */ (0, J.jsxs)("div", {
			className: "flex flex-col gap-1.5",
			children: [/* @__PURE__ */ (0, J.jsx)(y, {
				label: s,
				value: Math.min(i, r),
				max: r
			}), /* @__PURE__ */ (0, J.jsxs)("p", {
				className: "text-caption-1-regular text-text-secondary wrap-anywhere",
				children: [
					s,
					" · ",
					R(i, r),
					" 项"
				]
			})]
		}) : o ? /* @__PURE__ */ (0, J.jsx)("p", {
			"data-copy-key": `tasks.control.state.${a}`,
			className: "text-caption-1-regular text-text-secondary",
			children: s
		}) : /* @__PURE__ */ (0, J.jsx)(f, { label: s })
	});
}
function Xe({ run: e, followups: t, runs: r, latest: a, followupTotal: o, followupFailed: s = 0, followupCancelled: c = 0 }) {
	let d = !!(r && r.length > 1 && o), f = d ? [`共处理 ${o.toLocaleString()} 项`, s ? `其中 ${s.toLocaleString()} 项失败` : ""].filter(Boolean) : be(B(e) ? {
		...e.result_summary,
		name: ""
	} : e.result_summary).filter((t) => t !== e.error && t !== z(e.error)), p = xe(e), m = me(e, a), h = j(e.elapsed_seconds), g = r && r.length > 1 ? r[r.length - 1] : void 0, _ = (g ? [
		w[e.trigger] || e.trigger,
		`近 ${r.length} 轮`,
		`${L(g.finished_at)} – ${L(e.finished_at)}`
	] : [
		w[e.trigger] || e.trigger,
		L(e.finished_at),
		h && `用时 ${h}`
	]).filter(Boolean).join(" · ");
	return /* @__PURE__ */ (0, J.jsxs)(Z, {
		run: e,
		meta: _,
		error: e.error,
		followups: t,
		followupTotal: o,
		controlled: r,
		issues: p.length ? /* @__PURE__ */ (0, J.jsx)(i, {
			row: !0,
			summary: `问题详情 · ${p.length} 项`,
			contentClassName: "pb-5",
			children: /* @__PURE__ */ (0, J.jsx)(K, {
				label: "任务问题详情",
				children: /* @__PURE__ */ (0, J.jsx)("ul", {
					className: "flex min-w-0 flex-col whitespace-normal",
					"data-task-issues": "",
					children: p.map((e, t) => /* @__PURE__ */ (0, J.jsx)(l, {
						title: /* @__PURE__ */ (0, J.jsxs)(J.Fragment, { children: [e.label, e.provider || e.kind ? /* @__PURE__ */ (0, J.jsxs)("span", {
							className: "text-body-2-regular text-text-secondary",
							children: [" · ", [e.provider, e.kind].filter(Boolean).join(" · ")]
						}) : null] }),
						children: /* @__PURE__ */ (0, J.jsx)(Te, {
							text: e.error,
							className: "text-caption-1-regular text-text-secondary"
						})
					}, `${e.source}-${t}`))
				})
			})
		}) : void 0,
		badge: c && e.status === "succeeded" ? /* @__PURE__ */ (0, J.jsx)(n, {
			color: "rose",
			children: /* @__PURE__ */ (0, J.jsx)("span", {
				"data-copy-key": `tasks.followups.cancelled.${c === o ? "all" : "partial"}`,
				children: c === o ? "后续任务已取消" : "部分后续任务已取消"
			})
		}) : d && s ? /* @__PURE__ */ (0, J.jsx)(n, {
			color: "yellow",
			children: "发现问题"
		}) : void 0,
		children: [
			c ? /* @__PURE__ */ (0, J.jsxs)("p", {
				className: "text-caption-1-regular text-text-secondary",
				children: [
					"后续任务已取消 ",
					c.toLocaleString(),
					" 项"
				]
			}) : null,
			f.length === 1 ? /* @__PURE__ */ (0, J.jsx)("p", {
				className: "text-caption-1-regular text-text-secondary wrap-anywhere",
				children: f[0]
			}) : f.length ? /* @__PURE__ */ (0, J.jsx)("ul", {
				className: "flex list-disc flex-col gap-1 pl-5 text-caption-1-regular text-text-secondary wrap-anywhere",
				children: f.map((e, t) => /* @__PURE__ */ (0, J.jsx)("li", { children: e }, t))
			}) : null,
			!p.length && P(e) && ["follow-check", "feed-check"].includes(e.task_key) ? /* @__PURE__ */ (0, J.jsx)("p", {
				className: "text-body-2-regular text-text-secondary",
				children: "未取得本轮逐项详情，可到来源列表查看检查结果。"
			}) : null,
			m ? /* @__PURE__ */ (0, J.jsx)(u, {
				href: m.href,
				size: "small",
				trailingIcon: F,
				className: "self-start",
				children: m.label
			}) : null
		]
	});
}
function Ze({ runs: e, followups: t, counts: r }) {
	let i = e[0], a = e[e.length - 1], o = N(r, e), s = Math.max(o.total, t.length), c = o.total ? o.settled : t.filter((e) => !I(e)).length, l = o.total ? o.failed : t.filter((e) => e.status === "failed" || e.status === "interrupted").length, u = [
		w[i.trigger] || i.trigger,
		e.length > 1 ? `${e.length} 批` : "",
		`${L(a.started_at || a.finished_at)} 开始`
	].filter(Boolean).join(" · ");
	return /* @__PURE__ */ (0, J.jsx)(Z, {
		run: i,
		meta: u,
		followups: t,
		followupTotal: s,
		resourceActive: !0,
		controlled: e,
		badge: i.control ? /* @__PURE__ */ (0, J.jsx)(X, { run: i }) : /* @__PURE__ */ (0, J.jsx)(n, {
			color: "blue",
			children: "进行中"
		}),
		children: /* @__PURE__ */ (0, J.jsxs)("div", {
			className: "flex flex-col gap-1.5",
			children: [/* @__PURE__ */ (0, J.jsx)(y, {
				label: `${i.task_label}进度`,
				value: c,
				max: s
			}), /* @__PURE__ */ (0, J.jsxs)("p", {
				className: "text-caption-1-regular text-text-secondary",
				children: [
					"已处理 ",
					R(c, s),
					" 项",
					l ? ` · 其中 ${l.toLocaleString()} 项失败` : ""
				]
			})]
		})
	});
}
function Q({ title: e, children: t }) {
	let n = (0, q.useId)();
	return /* @__PURE__ */ (0, J.jsxs)("section", {
		"aria-labelledby": n,
		className: "flex min-w-0 flex-col gap-3",
		children: [/* @__PURE__ */ (0, J.jsx)("h3", {
			id: n,
			className: "text-title-2-medium text-text-primary",
			children: e
		}), t]
	});
}
function $({ live: e = !1, paginate: t = !0, children: n }) {
	let [i, a] = (0, q.useState)({
		pageIndex: 0,
		pageSize: 20
	}), o = q.Children.toArray(n), { pageSize: s } = i, c = Math.min(i.pageIndex, Math.max(0, Math.ceil(o.length / s) - 1));
	return /* @__PURE__ */ (0, J.jsxs)(J.Fragment, { children: [/* @__PURE__ */ (0, J.jsx)("ul", {
		"aria-live": e ? "polite" : void 0,
		className: "flex min-w-0 flex-col gap-3",
		children: t ? o.slice(c * s, (c + 1) * s) : o
	}), t ? /* @__PURE__ */ (0, J.jsx)(r, {
		label: "任务列表",
		total: o.length,
		pagination: {
			...i,
			pageIndex: c
		},
		onChange: a
	}) : null] });
}
function Qe() {
	let [e, t] = (0, q.useState)(1), [n, i] = (0, q.useState)(20), s = H({
		queryKey: e === 1 && n === 20 ? C : [
			...C,
			"page",
			e,
			n
		],
		queryFn: ({ signal: t }) => re(t, e, n),
		refetchInterval: (e) => pe(e.state.data),
		placeholderData: (e) => e
	}), [c, l] = (0, q.useState)(s.data);
	s.data && s.data !== c && l(s.data);
	let u = s.data || c, d = s.error ? M(s.error) : "";
	if (!u) return /* @__PURE__ */ (0, J.jsx)(G, { children: /* @__PURE__ */ (0, J.jsx)(h, {
		tone: "error",
		children: d || "读取任务中心失败"
	}) });
	let f = u.finished || [], p = u.working_parents || [], m = [
		...u.running || [],
		...u.skipped || [],
		...f,
		...p
	], g = ce(m), _ = new Set(m.map((e) => e.id)), v = (e) => e.filter((e) => !(e.followup_key && e.parent_run_id != null && _.has(e.parent_run_id))), y = v(f), b = u.followup_counts || {}, x = (e) => e.flatMap((e) => g.get(e.id) || []), S = [...y, ...v(p)].filter((e) => N(b, [e]).active > 0 || g.get(e.id)?.some(I)).sort((e, t) => t.id - e.id), w = v(u.running || []), T = v(u.skipped || []), E = y.filter((e) => !S.includes(e) && !T.some((t) => t.id === e.id)), D = (e) => (g.get(e.id) || []).every((e) => e.status === "succeeded" && !P(e)) && N(b, [e]).failed === 0, ee = oe(E, (e) => le(e) && (D(e) || We.has(e.task_key))), O = ae(S, (e) => e.control?.state || "").sort((e, t) => t.run.id - e.run.id), k = ue(m), A = !w.length && !S.length && !T.length && !E.length;
	return /* @__PURE__ */ (0, J.jsxs)(G, { children: [
		d ? /* @__PURE__ */ (0, J.jsx)(h, {
			tone: "error",
			children: d
		}) : null,
		/* @__PURE__ */ (0, J.jsx)(Pe, {}),
		u.available === !1 ? /* @__PURE__ */ (0, J.jsx)(h, {
			tone: "warning",
			children: u.message || "数据库尚未准备好任务记录表"
		}) : null,
		/* @__PURE__ */ (0, J.jsx)(ke, {}),
		A ? /* @__PURE__ */ (0, J.jsx)(o, {
			icon: Ce,
			title: "还没有任务记录",
			children: "扫描、追更检查、批量操作和命令行批处理跑起来之后，这里会显示它们的进度与结果。"
		}) : /* @__PURE__ */ (0, J.jsxs)(J.Fragment, { children: [
			/* @__PURE__ */ (0, J.jsx)(Q, {
				title: "正在进行",
				children: w.length || S.length ? /* @__PURE__ */ (0, J.jsxs)($, {
					live: !0,
					children: [w.map((e) => /* @__PURE__ */ (0, J.jsx)(Ye, {
						run: e,
						followups: g.get(e.id),
						followupTotal: N(b, [e]).total
					}, e.id)), O.map(({ run: e, runs: t }) => /* @__PURE__ */ (0, J.jsx)(Ze, {
						runs: t,
						followups: x(t),
						counts: b
					}, e.id))]
				}) : /* @__PURE__ */ (0, J.jsx)(h, {
					tone: "neutral",
					children: "没有任务在跑。"
				})
			}),
			T.length ? /* @__PURE__ */ (0, J.jsx)(Q, {
				title: "本次未执行",
				children: /* @__PURE__ */ (0, J.jsx)($, { children: T.map((e) => /* @__PURE__ */ (0, J.jsx)(Xe, {
					run: e,
					latest: k.has(e.id),
					followups: g.get(e.id)
				}, e.id)) })
			}) : null,
			E.length || u.finished_total ? /* @__PURE__ */ (0, J.jsxs)(Q, {
				title: "最近完成",
				children: [E.length ? /* @__PURE__ */ (0, J.jsx)($, {
					paginate: !1,
					children: ee.map(({ run: e, runs: t }) => {
						let n = N(b, t);
						return /* @__PURE__ */ (0, J.jsx)(Xe, {
							run: e,
							runs: t,
							latest: k.has(e.id),
							followups: x(t),
							followupTotal: n.total,
							followupFailed: n.failed,
							followupCancelled: n.cancelled
						}, e.id);
					})
				}) : null, /* @__PURE__ */ (0, J.jsx)(r, {
					label: "最近完成",
					total: u.finished_total ?? y.length,
					unit: "轮任务",
					pageUnit: "轮",
					pagination: {
						pageIndex: (u.finished_page || e) - 1,
						pageSize: n
					},
					onChange: (r) => {
						r.pageIndex + 1 === e && r.pageSize === n ? s.refetch() : (t(r.pageIndex + 1), i(r.pageSize));
					}
				})]
			}) : null
		] }),
		/* @__PURE__ */ (0, J.jsx)(a, {})
	] });
}
export { Qe as ActivityPage };

//# debugId=f3d45222-5726-4167-aff5-1f520ca689ce