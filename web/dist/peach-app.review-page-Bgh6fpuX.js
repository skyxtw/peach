(function() {
	try {
		var e = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, t = new e.Error().stack;
		t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "204b38e5-d738-4951-916c-b91e3a524f79", e._sentryDebugIdIdentifier = "sentry-dbid-204b38e5-d738-4951-916c-b91e3a524f79");
	} catch {}
})();
import { $ea3928288112382f$export$439d29a4e110a164 as e, $fe21c36db05242bb$export$a98f0dcb43a68a25 as t, $fe21c36db05242bb$export$d7b12c4107be0d61 as n, Button as r, ButtonLink as i, Checkbox as a, CheckboxGlyph as o, Chip as s, CollapseChevron as c, CollapseRegion as l, DEFAULT_CATEGORY as u, DataTableFooter as d, ENTITY_REVIEW_KINDS as f, Ea as p, EmptyState as m, ExternalLink as h, FIELDSET_FOOT as ee, FilterGlassRows as g, Gg as _, InputBase as v, LinkButton as te, Note as y, REVIEW_CATEGORIES as b, REVIEW_DECISION_LABELS as ne, REVIEW_KEY as re, REVIEW_LABELS as x, REVIEW_QUEUES as ie, REVIEW_QUEUE_LABELS as S, Select as C, SelectItem as w, SelectionActions as T, SelectionDock as ae, SortableBoardTabs as E, TextField as D, Wt as O, __toESM as k, apiGet as A, apiSend as j, avatarInner as M, busyProps as N, canApprove as oe, cardClass as P, commonReviewSources as F, composingKey as se, confirmModal as I, currentReviewRow as ce, cx as L, decisionPayload as le, decisionReceipt as ue, defaultChoice as de, errorMessage as R, fetchReview as fe, filterReviewRows as pe, groupReviewRows as me, isReviewCategory as he, l7 as z, localTime as ge, m7 as _e, mirrorText as ve, pendingGenres as ye, queryClient as be, recordGenre as xe, reloadReview as Se, require_jsx_runtime as Ce, require_react as B, reviewGroupingOptions as we, reviewQueueData as Te, reviewQueueOf as Ee, reviewWindow as De, rowEvidence as Oe, rowFieldName as ke, rowSubject as Ae, rowTags as V, rowTitle as H, selectReviewRange as je, settleReviewRows as Me, spinnerHtml as U, submitDecision as Ne, useMutation as Pe, useNavigationOrder as Fe, useOverlayScrollbar as Ie, useQuery as Le, useViewGlide as Re } from "./peach-app.js";
import { Page as ze } from "./peach-app.page-QAncjzM1.js";
import { DataTable as W } from "./peach-app.data-table-CPTRrw04.js";
import { LEGACY_AVATAR_IMG as Be } from "./peach-app.legacy-avatar-NSITxLRS.js";
// src/react/review/auto-landings.ts
var G = /* @__PURE__ */ k(B(), 1), K = "/api/review/auto-landings", Ve = "/api/review/auto-landings/revert", He = ["review", "auto-landings"], Ue = (e) => A(K, e), We = (e) => A(`${K}?items=${encodeURIComponent(e.join("\n"))}`), Ge = (e, t) => j(Ve, {
	items: e,
	token: t
}), Ke = (e) => e.at === null ? "" : ge((/* @__PURE__ */ new Date(e.at * 1e3)).toISOString()), q = (e) => e.code || e.name || (e.asset_id ? `#${e.asset_id}` : "未知作品"), J = (e) => e ? `「${e}」` : "空", Y = (e) => e.tags.length ? e.tags.join("、") : e.value, qe = (e) => e.tags.length ? "原有标签保留" : `原为 ${e.previous.length ? e.previous.map(J).join("、") : "空"}`;
function Je(e) {
	return [
		...e.restores.map((e) => `${q(e)} ${e.field}：${J(e.current)} 改回 ${J(e.previous)}`),
		...e.tags.map((e) => `${q(e)} 删除标签「${e.tag}」`),
		...e.changed.map((e) => e.gone ? `${q(e)} ${e.field}：作品已不在账本中，跳过` : `${q(e)} ${e.field}：之后已被修改，保留现值`)
	];
}
function Ye(e) {
	let t = [e.restores.length ? `改回 ${e.restores.length} 条资料` : "", e.tags.length ? `删除 ${e.tags.length} 个自动补上的标签` : ""].filter(Boolean);
	return [
		`将撤回 ${e.decisions} 条自动写入：${t.join("，") || "没有要改的资料"}。`,
		e.changed.length ? `${e.changed.length} 条资料写入后被修改过或作品已删除，不改动。` : "",
		"撤回前会自动备份账本。下一轮资料处理仍按同一判据判断，可能再次写入。"
	].filter(Boolean).join("");
}
function Xe(e) {
	let t = [e.restored ? `改回 ${e.restored} 条资料` : "", e.removed_tags ? `删除 ${e.removed_tags} 个标签` : ""].filter(Boolean);
	return `已撤回 ${e.decisions} 条自动写入${t.length ? `：${t.join("，")}` : ""}`;
}
// src/react/review/auto-landings-card.tsx
var X = Ce(), Ze = "资料处理按确定判据自动写入的标题、发行日期与标签，一行一条。撤回会把覆盖的值改回写入前、删掉补上的标签；写入后又被修改过的作品保留现值。";
function Z({ item: t, openItem: n }) {
	let r = t.asset_id && !t.gone ? () => n(t.asset_id) : void 0;
	return /* @__PURE__ */ (0, X.jsxs)("span", {
		className: "flex min-w-0 items-center gap-3",
		children: [/* @__PURE__ */ (0, X.jsxs)("button", {
			type: "button",
			disabled: !r,
			onClick: r,
			className: "flex aspect-card-cover w-16 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-background-tertiary-default outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:cursor-default",
			children: [t.preview_url ? /* @__PURE__ */ (0, X.jsx)("img", {
				src: t.preview_url,
				alt: "",
				loading: "lazy",
				className: "size-full object-cover"
			}) : /* @__PURE__ */ (0, X.jsx)("span", {
				className: "text-caption-1-regular text-text-secondary",
				children: "无封面"
			}), /* @__PURE__ */ (0, X.jsx)(e, { children: `打开作品 ${q(t)}` })]
		}), /* @__PURE__ */ (0, X.jsxs)("span", {
			className: "flex min-w-0 flex-1 flex-col gap-0.5",
			children: [/* @__PURE__ */ (0, X.jsxs)("span", {
				className: "truncate text-body-medium text-text-primary",
				children: [q(t), t.assets > 1 ? /* @__PURE__ */ (0, X.jsx)("small", {
					className: "ml-1 text-caption-1-regular text-text-secondary",
					children: `${t.assets} 个文件`
				}) : null]
			}), /* @__PURE__ */ (0, X.jsx)("small", {
				title: t.name,
				className: "truncate text-caption-1-regular text-text-secondary",
				children: t.gone ? "作品已不在账本中" : t.name
			})]
		})]
	});
}
function Q({ item: e }) {
	return /* @__PURE__ */ (0, X.jsxs)("span", {
		className: "flex min-w-0 flex-col gap-0.5",
		children: [/* @__PURE__ */ (0, X.jsxs)("span", {
			title: Y(e),
			className: "truncate text-body-regular text-text-primary",
			children: [/* @__PURE__ */ (0, X.jsx)("span", {
				className: "text-text-secondary",
				children: `${e.field}：`
			}), Y(e)]
		}), /* @__PURE__ */ (0, X.jsx)("small", {
			title: qe(e),
			className: "truncate text-caption-1-regular text-text-secondary",
			children: qe(e)
		})]
	});
}
function Qe({ locked: e, openItem: t, toast: n }) {
	let [i, a] = (0, G.useState)([]), [o, s] = (0, G.useState)(null), c = Le({
		queryKey: He,
		queryFn: ({ signal: e }) => Ue(e)
	}), l = c.data?.items ?? [], u = Pe({
		mutationFn: async (e) => {
			let t = await We(e), { confirmed: n, result: r } = await I({
				title: "撤回自动写入",
				body: Ye(t),
				items: Je(t),
				confirmLabel: "撤回",
				onConfirm: () => Ge(t.items, t.token)
			});
			return n ? r : null;
		},
		onSuccess: (e) => {
			e && (s(e), a([]), n(Xe(e)), be.invalidateQueries({ queryKey: re }));
		},
		onError: (e) => n(R(e))
	});
	return !l.length && !o && !c.isError ? null : /* @__PURE__ */ (0, X.jsxs)("section", {
		"aria-labelledby": "auto-landings-title",
		className: "flex flex-col gap-4",
		children: [o ? /* @__PURE__ */ (0, X.jsxs)(y, {
			tone: "success",
			title: Xe(o),
			children: [/* @__PURE__ */ (0, X.jsx)("p", {
				className: "text-body-2-regular",
				children: `撤回前的账本已备份为 ${o.backup}。`
			}), o.changed.length ? /* @__PURE__ */ (0, X.jsxs)("p", {
				className: "flex flex-wrap items-center gap-x-2 gap-y-1 text-body-2-regular",
				children: [`${o.changed.length} 条资料写入后被修改过或作品已删除，未改动：`, o.changed.map((e) => e.gone ? /* @__PURE__ */ (0, X.jsx)("span", {
					className: "text-text-secondary",
					children: `#${e.asset_id}（已删除）`
				}, `${e.asset_id}:${e.field}`) : /* @__PURE__ */ (0, X.jsx)(te, {
					size: "small",
					onClick: () => t(e.asset_id),
					children: q(e)
				}, `${e.asset_id}:${e.field}`))]
			}) : null]
		}) : null, c.isError ? /* @__PURE__ */ (0, X.jsx)(y, {
			tone: "error",
			title: "读取自动写入的资料失败",
			children: R(c.error)
		}) : l.length ? /* @__PURE__ */ (0, X.jsx)(W, {
			label: "自动写入的资料",
			items: l,
			columns: [
				{
					id: "work",
					label: "作品",
					width: 300,
					min: 240,
					value: (e) => q(e),
					render: (e) => /* @__PURE__ */ (0, X.jsx)(Z, {
						item: e,
						openItem: t
					})
				},
				{
					id: "written",
					label: "写入",
					width: 320,
					min: 220,
					value: (e) => `${e.field}${Y(e)}`,
					render: (e) => /* @__PURE__ */ (0, X.jsx)(Q, { item: e })
				},
				{
					id: "rule",
					label: "规则与时间",
					width: 176,
					min: 144,
					value: (e) => e.at ?? 0,
					render: (e) => /* @__PURE__ */ (0, X.jsxs)("span", {
						title: e.batch,
						className: "flex min-w-0 flex-col gap-0.5 text-text-secondary",
						children: [/* @__PURE__ */ (0, X.jsx)("span", {
							className: "truncate text-body-2-regular",
							children: e.label
						}), /* @__PURE__ */ (0, X.jsx)("small", {
							className: "tabular-nums text-caption-1-regular",
							children: Ke(e) || "时间未知"
						})]
					})
				}
			],
			title: "自动写入的资料",
			titleId: "auto-landings-title",
			unit: "条",
			description: Ze,
			rowId: (e) => e.item_key,
			rowLabel: (e) => `${q(e)} ${e.field}`,
			selected: i,
			onSelected: a,
			actions: (t) => /* @__PURE__ */ (0, X.jsx)(r, {
				variant: "secondary",
				size: "small",
				disabled: e || !t.length,
				...N(u.isPending),
				onClick: () => u.mutate(t.map((e) => e.item_key)),
				children: `撤回所选（${t.length}）`
			})
		}) : null]
	});
}
// src/react/review/bulk-toolbar.tsx
function $e(e) {
	let { groupOptions: t, groupBy: n, onGroupBy: i, groups: a, filter: o, onFilter: s, pageKeys: c, selected: l, onSelected: u, selectedRows: d, metadata: f, approvable: p, busy: m, feedback: h, onUnifySource: ee, onRun: _, queueView: v = "pending", queueCounts: te, onQueueChange: y, locked: b, fields: ne, fieldFilter: re, onFieldFilter: x } = e, T = c.filter((e) => l.has(e)), E = T.length > 0 && T.length === c.length, D = F(d), O = f && d.some((e) => (e.candidates?.length || 0) > 1), k = D.length ? "统一选择来源" : "所选项目无共同来源", A = (0, G.useRef)(null), j = (0, G.useRef)(null), M = (0, G.useRef)(null), [N, oe] = (0, G.useState)(!1), P = Re(A, j, "[data-entity-state][aria-pressed=\"true\"]", v);
	return (0, G.useLayoutEffect)(() => {
		let e = j.current, t = M.current, n = e?.parentElement, r = e?.closest("[data-review-filter]");
		if (!e || !t || !n || !r) return;
		let i = () => oe(t.offsetHeight > 0 && Math.abs(n.getBoundingClientRect().top - t.getBoundingClientRect().top) < 1), a = new ResizeObserver(i);
		for (let n of [
			r,
			e,
			t
		]) a.observe(n);
		return i(), () => a.disconnect();
	}, []), /* @__PURE__ */ (0, X.jsxs)(X.Fragment, { children: [/* @__PURE__ */ (0, X.jsx)(g, {
		label: "复核筛选",
		topLabel: "处理状态",
		attrs: { "data-review-filter": "" },
		className: "mb-0 flex-row flex-wrap",
		topClassName: "max-w-full flex-none",
		bottomClassName: c.length ? "min-h-12 max-w-full flex-none flex-wrap" : "hidden",
		bottomRef: M,
		panes: /* @__PURE__ */ (0, X.jsx)("span", {
			ref: A,
			"data-view-glide": "",
			"aria-hidden": "true"
		}),
		top: /* @__PURE__ */ (0, X.jsxs)("div", {
			ref: j,
			role: "group",
			"aria-label": "复核状态",
			"data-entity-states": "",
			onPointerLeave: P.leave,
			children: [ie.map((e) => /* @__PURE__ */ (0, X.jsxs)("button", {
				type: "button",
				"data-entity-state": e,
				"data-entity-press": "",
				disabled: m,
				"aria-pressed": v === e,
				onPointerEnter: P.hover,
				onClick: () => {
					e !== v && y(e);
				},
				children: [
					/* @__PURE__ */ (0, X.jsx)("span", {
						"data-copy-key": `review.queue.${e}`,
						children: S[e]
					}),
					" ",
					/* @__PURE__ */ (0, X.jsx)("span", {
						className: "ms-1.5 tabular-nums text-caption-1-medium text-text-secondary",
						children: te ? te[e].toLocaleString() : "…"
					})
				]
			}, e)), /* @__PURE__ */ (0, X.jsx)("span", {
				"data-entity-sep": "",
				"aria-hidden": "true",
				className: N ? void 0 : "invisible"
			})]
		}),
		bottom: c.length ? /* @__PURE__ */ (0, X.jsxs)(X.Fragment, { children: [
			f && ne.length ? /* @__PURE__ */ (0, X.jsxs)(C, {
				"aria-label": "筛选资料字段",
				size: "sm",
				prefix: /* @__PURE__ */ (0, X.jsx)("span", {
					"data-copy-key": "review.filter.field",
					className: "pointer-events-auto",
					children: "字段"
				}),
				selectedKey: re || "*",
				isDisabled: m,
				onSelectionChange: (e) => {
					e !== null && x(String(e) === "*" ? "" : String(e));
				},
				children: [/* @__PURE__ */ (0, X.jsx)(w, {
					id: "*",
					children: "全部"
				}), ne.map((e) => /* @__PURE__ */ (0, X.jsx)(w, {
					id: e.key,
					children: `${e.title} · ${e.rows.length}`
				}, e.key))]
			}) : null,
			/* @__PURE__ */ (0, X.jsx)(C, {
				"aria-label": "筛选分组方式",
				size: "sm",
				selectedKey: n,
				onSelectionChange: (e) => {
					e !== null && i(String(e));
				},
				children: t.map(([e, t]) => /* @__PURE__ */ (0, X.jsx)(w, {
					id: e,
					children: t
				}, e))
			}),
			a.length > 1 ? /* @__PURE__ */ (0, X.jsxs)(C, {
				"aria-label": n === "field" ? "筛选字段分类" : "筛选当前分类",
				size: "sm",
				prefix: "分类",
				selectedKey: o || "*",
				onSelectionChange: (e) => {
					e !== null && s(String(e) === "*" ? "" : String(e));
				},
				children: [/* @__PURE__ */ (0, X.jsx)(w, {
					id: "*",
					children: "全部"
				}), a.map((e) => /* @__PURE__ */ (0, X.jsx)(w, {
					id: e.key,
					children: `${e.title} · ${e.rows.length}`
				}, e.key))]
			}) : null,
			b ? null : /* @__PURE__ */ (0, X.jsx)(r, {
				variant: "secondary",
				size: "small",
				leadingIcon: z,
				"aria-pressed": E,
				disabled: m,
				onClick: () => {
					let e = new Set(l);
					for (let t of c) E ? e.delete(t) : e.add(t);
					u(e);
				},
				children: E ? "清空当前选择" : o ? "全选当前分类" : "全选本页"
			})
		] }) : null
	}), /* @__PURE__ */ (0, X.jsxs)(ae, {
		label: "复核所选项目",
		visible: !b && l.size > 0,
		count: `已选 ${l.size} 项`,
		children: [
			O && v !== "ignored" ? /* @__PURE__ */ (0, X.jsxs)(C, {
				"aria-label": "统一选择来源",
				size: "sm",
				selectedKey: "",
				isDisabled: m || !D.length,
				onSelectionChange: (e) => {
					e !== null && e !== "" && ee(String(e));
				},
				children: [/* @__PURE__ */ (0, X.jsx)(w, {
					id: "",
					children: k
				}), D.map((e) => /* @__PURE__ */ (0, X.jsx)(w, {
					id: e,
					children: e
				}, e))]
			}) : null,
			v === "ignored" ? null : /* @__PURE__ */ (0, X.jsx)(r, {
				variant: "ghost",
				size: "small",
				disabled: m || !l.size,
				onClick: () => _("rejected"),
				children: "忽略所选"
			}),
			v === "pending" ? /* @__PURE__ */ (0, X.jsx)(r, {
				variant: "secondary",
				size: "small",
				disabled: m || !l.size,
				onClick: () => _("skipped"),
				children: "稍后处理所选"
			}) : /* @__PURE__ */ (0, X.jsx)(r, {
				variant: v === "ignored" ? "primary" : "secondary",
				size: "small",
				disabled: m || !l.size,
				onClick: () => _("restore"),
				children: "恢复所选"
			}),
			v === "ignored" ? null : /* @__PURE__ */ (0, X.jsx)(r, {
				variant: "primary",
				size: "small",
				disabled: m || !l.size || !p,
				onClick: () => _("approved"),
				children: "通过所选"
			}),
			/* @__PURE__ */ (0, X.jsx)(r, {
				variant: "ghost",
				size: "small",
				disabled: m,
				onClick: () => u(/* @__PURE__ */ new Set()),
				children: "取消选择"
			}),
			h ? /* @__PURE__ */ (0, X.jsx)("p", {
				role: "status",
				className: "w-full text-body-2-regular text-text-secondary",
				children: h
			}) : null
		]
	})] });
}
// src/react/boardui/components/base/radio/radio.tsx
var et = {
	sm: {
		dot: "size-3.5",
		inner: "size-[5px]",
		selected: "bg-gradient-to-b from-accent-500 to-accent-600 shadow-[inset_0px_0px_0px_0.875px_var(--color-accent-500),inset_0px_1.75px_0px_0px_rgba(255,255,255,0.25)]",
		border: "border-[0.875px]",
		gap: "gap-2",
		label: "text-body-2-medium"
	},
	md: {
		dot: "size-4",
		inner: "size-1.5",
		selected: "bg-gradient-to-b from-accent-500 to-accent-600 shadow-[inset_0px_0px_0px_1px_var(--color-accent-500),inset_0px_2px_0px_0px_rgba(255,255,255,0.25)]",
		border: "border",
		gap: "gap-2",
		label: "text-body-medium"
	}
};
function tt({ selected: e = !1, size: t = "sm", focusVisible: n = !1, className: r }) {
	let i = et[t];
	return /* @__PURE__ */ (0, X.jsxs)("span", {
		"aria-hidden": !0,
		className: L("relative flex shrink-0 items-center justify-center rounded-full", i.dot, n && "ring-2 ring-border-focus-ring ring-offset-2", r),
		children: [
			/* @__PURE__ */ (0, X.jsx)("span", { className: L("absolute inset-0 rounded-full border-border-checkbox-default bg-background-primary-default shadow-xs", "transition-opacity duration-200 ease", i.border, e && "opacity-0") }),
			/* @__PURE__ */ (0, X.jsx)("span", { className: L("absolute inset-0 rounded-full", "transition-opacity duration-200 ease", i.selected, !e && "opacity-0") }),
			/* @__PURE__ */ (0, X.jsx)("span", { className: L("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-control-indicator-background", "transition-[scale,opacity] duration-200 ease", i.inner, e ? "scale-100 opacity-100" : "scale-0 opacity-0") })
		]
	});
}
function nt({ className: e, children: n, ref: r, ...i }) {
	return /* @__PURE__ */ (0, X.jsx)(t, {
		ref: r,
		...i,
		className: (t) => L("flex flex-col gap-2", typeof e == "function" ? e(t) : e),
		children: n
	});
}
// src/react/boardui/components/base/radio/radio-card.tsx
function rt({ className: e, title: t, description: r, ref: i, ...a }) {
	return /* @__PURE__ */ (0, X.jsx)(n, {
		ref: i,
		...a,
		className: (t) => L("group flex w-full items-center justify-between gap-3 rounded-2lg border border-border-button-default py-3 pe-5 ps-4 select-none", "transition-colors duration-150 ease", t.isHovered && !t.isDisabled ? "bg-background-primary-hover" : "bg-background-primary-default", t.isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer", typeof e == "function" ? e(t) : e),
		children: (e) => /* @__PURE__ */ (0, X.jsxs)(X.Fragment, { children: [/* @__PURE__ */ (0, X.jsxs)("span", {
			className: "flex min-w-0 flex-col gap-0.5",
			children: [/* @__PURE__ */ (0, X.jsx)("span", {
				className: "truncate text-body-medium text-text-primary",
				children: t
			}), r != null && /* @__PURE__ */ (0, X.jsx)("span", {
				className: "truncate text-body-regular text-text-secondary",
				children: r
			})]
		}), /* @__PURE__ */ (0, X.jsx)("span", {
			className: "flex shrink-0 items-center py-1",
			children: /* @__PURE__ */ (0, X.jsx)(tt, {
				size: "md",
				selected: e.isSelected,
				focusVisible: e.isFocusVisible
			})
		})] })
	});
}
// node_modules/diff/libesm/diff/base.js
var $ = class {
	diff(e, t, n = {}) {
		let r;
		typeof n == "function" ? (r = n, n = {}) : "callback" in n && (r = n.callback);
		let i = this.castInput(e, n), a = this.castInput(t, n), o = this.removeEmpty(this.tokenize(i, n)), s = this.removeEmpty(this.tokenize(a, n));
		return this.diffWithOptionsObj(o, s, n, r);
	}
	diffWithOptionsObj(e, t, n, r) {
		let i = (e) => {
			if (e = this.postProcess(e, n), r) setTimeout(function() {
				r(e);
			}, 0);
			else return e;
		}, a = t.length, o = e.length, s = 1, c = a + o;
		n.maxEditLength != null && (c = Math.min(c, n.maxEditLength));
		let l = n.timeout ?? Infinity, u = Date.now() + l, d = [{
			oldPos: -1,
			lastComponent: void 0
		}], f = this.extractCommon(d[0], t, e, 0, n);
		if (d[0].oldPos + 1 >= o && f + 1 >= a) return i(this.buildValues(d[0].lastComponent, t, e));
		let p = -Infinity, m = Infinity, h = () => {
			for (let r = Math.max(p, -s); r <= Math.min(m, s); r += 2) {
				let s, c = d[r - 1], l = d[r + 1];
				c && (d[r - 1] = void 0);
				let u = !1;
				if (l) {
					let e = l.oldPos - r;
					u = l && 0 <= e && e < a;
				}
				let h = c && c.oldPos + 1 < o;
				if (!u && !h) d[r] = void 0;
				else {
					if (s = !h || u && c.oldPos < l.oldPos ? this.addToPath(l, !0, !1, 0, n) : this.addToPath(c, !1, !0, 1, n), f = this.extractCommon(s, t, e, r, n), s.oldPos + 1 >= o && f + 1 >= a) return i(this.buildValues(s.lastComponent, t, e)) || !0;
					d[r] = s, s.oldPos + 1 >= o && (m = Math.min(m, r - 1)), f + 1 >= a && (p = Math.max(p, r + 1));
				}
			}
			s++;
		};
		if (r) (function e() {
			setTimeout(function() {
				if (s > c || Date.now() > u) return r(void 0);
				h() || e();
			}, 0);
		})();
		else for (; s <= c && Date.now() <= u;) {
			let e = h();
			if (e) return e;
		}
	}
	addToPath(e, t, n, r, i) {
		let a = e.lastComponent;
		return a && !i.oneChangePerToken && a.added === t && a.removed === n ? {
			oldPos: e.oldPos + r,
			lastComponent: {
				count: a.count + 1,
				added: t,
				removed: n,
				previousComponent: a.previousComponent
			}
		} : {
			oldPos: e.oldPos + r,
			lastComponent: {
				count: 1,
				added: t,
				removed: n,
				previousComponent: a
			}
		};
	}
	extractCommon(e, t, n, r, i) {
		let a = t.length, o = n.length, s = e.oldPos, c = s - r, l = 0;
		for (; c + 1 < a && s + 1 < o && this.equals(n[s + 1], t[c + 1], i);) c++, s++, l++, i.oneChangePerToken && (e.lastComponent = {
			count: 1,
			previousComponent: e.lastComponent,
			added: !1,
			removed: !1
		});
		return l && !i.oneChangePerToken && (e.lastComponent = {
			count: l,
			previousComponent: e.lastComponent,
			added: !1,
			removed: !1
		}), e.oldPos = s, c;
	}
	equals(e, t, n) {
		return n.comparator ? n.comparator(e, t) : e === t || !!n.ignoreCase && e.toLowerCase() === t.toLowerCase();
	}
	removeEmpty(e) {
		let t = [];
		for (let n = 0; n < e.length; n++) e[n] && t.push(e[n]);
		return t;
	}
	castInput(e, t) {
		return e;
	}
	tokenize(e, t) {
		return Array.from(e);
	}
	join(e) {
		return e.join("");
	}
	postProcess(e, t) {
		return e;
	}
	get useLongestToken() {
		return !1;
	}
	buildValues(e, t, n) {
		let r = [], i;
		for (; e;) r.push(e), i = e.previousComponent, delete e.previousComponent, e = i;
		r.reverse();
		let a = r.length, o = 0, s = 0, c = 0;
		for (; o < a; o++) {
			let e = r[o];
			if (e.removed) e.value = this.join(n.slice(c, c + e.count)), c += e.count;
			else {
				if (!e.added && this.useLongestToken) {
					let r = t.slice(s, s + e.count);
					r = r.map(function(e, t) {
						let r = n[c + t];
						return r.length > e.length ? r : e;
					}), e.value = this.join(r);
				} else e.value = this.join(t.slice(s, s + e.count));
				s += e.count, e.added || (c += e.count);
			}
		}
		return r;
	}
}, it = new class extends $ {}();
function at(e, t, n) {
	return it.diff(e, t, n);
}
// node_modules/diff/libesm/util/string.js
function ot(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length; n++) if (e[n] != t[n]) return e.slice(0, n);
	return e.slice(0, n);
}
function st(e, t) {
	let n;
	if (!e || !t || e[e.length - 1] != t[t.length - 1]) return "";
	for (n = 0; n < e.length && n < t.length; n++) if (e[e.length - (n + 1)] != t[t.length - (n + 1)]) return e.slice(-n);
	return e.slice(-n);
}
function ct(e, t, n) {
	if (e.slice(0, t.length) != t) throw Error(`string ${JSON.stringify(e)} doesn't start with prefix ${JSON.stringify(t)}; this is a bug`);
	return n + e.slice(t.length);
}
function lt(e, t, n) {
	if (!t) return e + n;
	if (e.slice(-t.length) != t) throw Error(`string ${JSON.stringify(e)} doesn't end with suffix ${JSON.stringify(t)}; this is a bug`);
	return e.slice(0, -t.length) + n;
}
function ut(e, t) {
	return ct(e, t, "");
}
function dt(e, t) {
	return lt(e, t, "");
}
function ft(e, t) {
	return t.slice(0, pt(e, t));
}
function pt(e, t) {
	let n = 0;
	e.length > t.length && (n = e.length - t.length);
	let r = t.length;
	e.length < t.length && (r = e.length);
	let i = Array(r), a = 0;
	i[0] = 0;
	for (let e = 1; e < r; e++) {
		for (t[e] == t[a] ? i[e] = i[a] : i[e] = a; a > 0 && t[e] != t[a];) a = i[a];
		t[e] == t[a] && a++;
	}
	a = 0;
	for (let r = n; r < e.length; r++) {
		for (; a > 0 && e[r] != t[a];) a = i[a];
		e[r] == t[a] && a++;
	}
	return a;
}
function mt(e, t) {
	let n = [];
	for (let r of Array.from(t.segment(e))) {
		let e = r.segment;
		n.length && /\s/.test(n[n.length - 1]) && /\s/.test(e) ? n[n.length - 1] += e : n.push(e);
	}
	return n;
}
function ht(e, t) {
	if (t) return _t(e, t)[1];
	let n;
	for (n = e.length - 1; n >= 0 && e[n].match(/\s/); n--);
	return e.substring(n + 1);
}
function gt(e, t) {
	if (t) return _t(e, t)[0];
	let n = e.match(/^\s*/);
	return n ? n[0] : "";
}
function _t(e, t) {
	if (!t) return [gt(e), ht(e)];
	if (t.resolvedOptions().granularity != "word") throw Error("The segmenter passed must have a granularity of \"word\"");
	let n = mt(e, t), r = n[0], i = n[n.length - 1];
	return [/\s/.test(r) ? r : "", /\s/.test(i) ? i : ""];
}
// node_modules/diff/libesm/diff/word.js
var vt = "a-zA-Z0-9_\\u{AD}\\u{C0}-\\u{D6}\\u{D8}-\\u{F6}\\u{F8}-\\u{2C6}\\u{2C8}-\\u{2D7}\\u{2DE}-\\u{2FF}\\u{1E00}-\\u{1EFF}", yt = RegExp(`[${vt}]+|\\s+|[^${vt}]`, "ug");
new class extends $ {
	equals(e, t, n) {
		return n.ignoreCase && (e = e.toLowerCase(), t = t.toLowerCase()), e.trim() === t.trim();
	}
	tokenize(e, t = {}) {
		let n;
		if (t.intlSegmenter) {
			let r = t.intlSegmenter;
			if (r.resolvedOptions().granularity != "word") throw Error("The segmenter passed must have a granularity of \"word\"");
			n = mt(e, r);
		} else n = e.match(yt) || [];
		let r = [], i = null;
		return n.forEach((e) => {
			/\s/.test(e) ? i == null ? r.push(e) : r.push(r.pop() + e) : i != null && /\s/.test(i) ? r[r.length - 1] == i ? r.push(r.pop() + e) : r.push(i + e) : r.push(e), i = e;
		}), r;
	}
	join(e) {
		return e.map((e, t) => t == 0 ? e : e.replace(/^\s+/, "")).join("");
	}
	postProcess(e, t) {
		if (!e || t.oneChangePerToken) return e;
		let n = null, r = null, i = null;
		return e.forEach((e) => {
			e.added ? r = e : e.removed ? i = e : ((r || i) && bt(n, i, r, e, t.intlSegmenter), n = e, r = null, i = null);
		}), (r || i) && bt(n, i, r, null, t.intlSegmenter), e;
	}
}();
function bt(e, t, n, r, i) {
	if (t && n) {
		let [a, o] = _t(t.value, i), [s, c] = _t(n.value, i);
		if (e) {
			let r = ot(a, s);
			e.value = lt(e.value, s, r), t.value = ut(t.value, r), n.value = ut(n.value, r);
		}
		if (r) {
			let e = st(o, c);
			r.value = ct(r.value, c, e), t.value = dt(t.value, e), n.value = dt(n.value, e);
		}
	} else if (n) {
		if (e) {
			let e = gt(n.value, i);
			n.value = n.value.substring(e.length);
		}
		if (r) {
			let e = gt(r.value, i);
			r.value = r.value.substring(e.length);
		}
	} else if (e && r) {
		let n = gt(r.value, i), [a, o] = _t(t.value, i), s = ot(n, a);
		t.value = ut(t.value, s);
		let c = st(ut(n, s), o);
		t.value = dt(t.value, c), r.value = ct(r.value, n, c), e.value = lt(e.value, n, n.slice(0, n.length - c.length));
	} else if (r) {
		let e = gt(r.value, i), n = ft(ht(t.value, i), e);
		t.value = dt(t.value, n);
	} else if (e) {
		let n = ft(ht(e.value, i), gt(t.value, i));
		t.value = ut(t.value, n);
	}
}
new class extends $ {
	tokenize(e) {
		let t = RegExp(`(\\r?\\n)|[${vt}]+|[^\\S\\n\\r]+|[^${vt}]`, "ug");
		return e.match(t) || [];
	}
}(), new class extends $ {
	constructor() {
		super(...arguments), this.tokenize = xt;
	}
	equals(e, t, n) {
		return n.ignoreWhitespace ? (n.newlineIsToken && e.includes("\n") || (e = e.trim()), n.newlineIsToken && t.includes("\n") || (t = t.trim())) : n.ignoreNewlineAtEof && !n.newlineIsToken && (e.endsWith("\n") && (e = e.slice(0, -1)), t.endsWith("\n") && (t = t.slice(0, -1))), super.equals(e, t, n);
	}
}();
function xt(e, t) {
	t.stripTrailingCr && (e = e.replace(/\r\n/g, "\n"));
	let n = [], r = e.split(/(\n|\r\n)/);
	r[r.length - 1] || r.pop();
	for (let e = 0; e < r.length; e++) {
		let i = r[e];
		e % 2 && !t.newlineIsToken ? n[n.length - 1] += i : n.push(i);
	}
	return n;
}
// node_modules/diff/libesm/diff/sentence.js
function St(e) {
	return e == "." || e == "!" || e == "?";
}
new class extends $ {
	tokenize(e) {
		let t = [], n = 0;
		for (let r = 0; r < e.length; r++) {
			if (r == e.length - 1) {
				t.push(e.slice(n));
				break;
			}
			if (St(e[r]) && e[r + 1].match(/\s/)) {
				for (t.push(e.slice(n, r + 1)), r = n = r + 1; e[r + 1]?.match(/\s/);) r++;
				t.push(e.slice(n, r + 1)), n = r + 1;
			}
		}
		return t;
	}
}(), new class extends $ {
	tokenize(e) {
		return e.split(/([{}:;,]|\s+)/);
	}
}(), new class extends $ {
	constructor() {
		super(...arguments), this.tokenize = xt;
	}
	get useLongestToken() {
		return !0;
	}
	castInput(e, t) {
		let { undefinedReplacement: n, stringifyReplacer: r = (e, t) => t === void 0 ? n : t } = t;
		return typeof e == "string" ? e : JSON.stringify(Ct(e, null, null, r), null, "  ");
	}
	equals(e, t, n) {
		return super.equals(e.replace(/,([\r\n])/g, "$1"), t.replace(/,([\r\n])/g, "$1"), n);
	}
}();
function Ct(e, t, n, r, i) {
	t ||= [], n ||= [], r && (e = r(i === void 0 ? "" : i, e));
	let a = 0;
	for (; a < t.length; a += 1) if (t[a] === e) return n[a];
	let o;
	if (Object.prototype.toString.call(e) === "[object Array]") {
		for (t.push(e), o = Array(e.length), n.push(o), a = 0; a < e.length; a += 1) o[a] = Ct(e[a], t, n, r, String(a));
		return t.pop(), n.pop(), o;
	}
	if (e && e.toJSON && (e = e.toJSON()), typeof e == "object" && e) {
		t.push(e), o = {}, n.push(o);
		let i = [], s;
		for (s in e)
 /* istanbul ignore else */
		Object.prototype.hasOwnProperty.call(e, s) && i.push(s);
		for (i.sort(), a = 0; a < i.length; a += 1) s = i[a], o[s] = Ct(e[s], t, n, r, s);
		t.pop(), n.pop();
	} else o = e;
	return o;
}
new class extends $ {
	tokenize(e) {
		return e.slice();
	}
	join(e) {
		return e;
	}
	removeEmpty(e) {
		return e;
	}
}();
// src/react/review/comparison-text.tsx
function wt({ value: e, reference: t }) {
	let n = (0, G.useMemo)(() => t ? at(t, e).filter((e) => !e.removed) : [{
		value: e,
		added: !1
	}], [e, t]);
	return /* @__PURE__ */ (0, X.jsx)(X.Fragment, { children: n.map((e, t) => e.added ? /* @__PURE__ */ (0, X.jsx)("mark", {
		"data-review-difference": "",
		className: "rounded-sm bg-status-yellow-background text-status-yellow-text",
		children: e.value
	}, t) : /* @__PURE__ */ (0, X.jsx)("span", { children: e.value }, t)) });
}
// src/react/review/candidate-form.tsx
var Tt = {
	title: "标题",
	original_title: "原标题",
	runtime: "来源时长",
	director: "导演",
	label: "Label",
	poster_url: "海报",
	cover_url: "封面",
	screenshot_urls: "截图",
	trailer_url: "预告片"
}, Et = "reviewgenretags";
function Dt({ tags: e }) {
	return e.length ? /* @__PURE__ */ (0, X.jsx)("datalist", {
		id: Et,
		children: e.map((e) => /* @__PURE__ */ (0, X.jsx)("option", { value: e }, e))
	}) : null;
}
function Ot({ candidate: e, row: t }) {
	let [n, i] = (0, G.useState)(!1), a = (0, G.useId)(), o = Object.entries(e.catalog_evidence || {}).filter(([, e]) => e && e.display_value);
	return o.length ? /* @__PURE__ */ (0, X.jsxs)("div", {
		className: "min-w-0",
		children: [/* @__PURE__ */ (0, X.jsxs)(r, {
			variant: "secondary",
			size: "small",
			leadingIcon: c,
			"aria-expanded": n,
			"aria-controls": a,
			"aria-label": `${n ? "收起" : "展开"} ${e.source || "该来源"} 的来源依据`,
			onClick: () => i(!n),
			children: [/* @__PURE__ */ (0, X.jsx)("span", {
				"data-copy-key": "review.card.source_evidence",
				children: "来源依据"
			}), ` · ${o.length}`]
		}), /* @__PURE__ */ (0, X.jsx)(l, {
			id: a,
			open: n,
			children: /* @__PURE__ */ (0, X.jsx)("dl", {
				className: "flex min-w-0 flex-col gap-2 px-3 pt-2 pb-1",
				children: o.map(([n, r]) => /* @__PURE__ */ (0, X.jsxs)("div", {
					className: "flex min-w-0 flex-wrap gap-x-2",
					children: [
						/* @__PURE__ */ (0, X.jsx)("dt", {
							className: "text-caption-1-regular text-text-tertiary",
							children: Tt[n] || n
						}),
						/* @__PURE__ */ (0, X.jsx)("dd", {
							className: "min-w-0 text-body-2-regular break-words text-text-primary",
							children: /* @__PURE__ */ (0, X.jsx)(wt, {
								value: r.display_value || "",
								reference: n === t.field && t.current_value ? t.current_value : t.candidates?.find((t) => t.candidate_key !== e.candidate_key && t.catalog_evidence?.[n]?.display_value)?.catalog_evidence?.[n]?.display_value
							})
						}),
						(r.warnings || []).map((e) => /* @__PURE__ */ (0, X.jsx)("small", {
							className: "w-full text-caption-1-regular text-status-yellow-text",
							children: e
						}, e))
					]
				}, n))
			})
		})]
	}) : null;
}
function kt(e) {
	let t = e.content_id || e.provider_id;
	return `${e.source || "未标注来源"}${e.official ? " · 官方优先" : ""}${t ? ` · ID ${t}` : ""}`;
}
function At({ candidate: e, reference: t }) {
	return /* @__PURE__ */ (0, X.jsxs)("span", {
		className: "flex min-w-0 flex-col gap-2 whitespace-normal wrap-anywhere",
		children: [/* @__PURE__ */ (0, X.jsx)("span", {
			className: "text-body-regular text-text-primary",
			children: /* @__PURE__ */ (0, X.jsx)(wt, {
				value: e.display_value || "",
				reference: t
			})
		}), (e.warnings || []).map((e) => /* @__PURE__ */ (0, X.jsx)("span", {
			className: "text-body-2-regular text-status-yellow-text",
			children: e
		}, e))]
	});
}
function jt({ row: e, fieldName: t, value: n, onChange: r, locked: i }) {
	let a = e.candidates || [];
	return a.length ? a.length === 1 ? /* @__PURE__ */ (0, X.jsxs)("div", {
		className: "flex min-w-0 flex-col gap-2",
		children: [/* @__PURE__ */ (0, X.jsxs)("div", {
			className: "flex min-w-0 flex-col gap-2 rounded-2lg bg-background-primary-default px-4 py-3",
			children: [/* @__PURE__ */ (0, X.jsx)("p", {
				className: "text-body-medium text-text-primary",
				children: kt(a[0])
			}), /* @__PURE__ */ (0, X.jsx)(At, {
				candidate: a[0],
				reference: e.current_value || void 0
			})]
		}), /* @__PURE__ */ (0, X.jsx)(Ot, {
			candidate: a[0],
			row: e
		})]
	}) : /* @__PURE__ */ (0, X.jsx)(nt, {
		"aria-label": `${t || "资料"}的来源`,
		value: n,
		isDisabled: i,
		onChange: r,
		children: /* @__PURE__ */ (0, X.jsx)("div", {
			className: "flex min-w-0 flex-col gap-3",
			children: a.map((t) => /* @__PURE__ */ (0, X.jsxs)("div", {
				className: "flex min-w-0 flex-col gap-1",
				children: [/* @__PURE__ */ (0, X.jsx)(rt, {
					value: t.candidate_key,
					className: "relative items-start",
					title: /* @__PURE__ */ (0, X.jsx)("span", {
						title: kt(t),
						children: kt(t)
					}),
					description: /* @__PURE__ */ (0, X.jsx)(At, {
						candidate: t,
						reference: e.current_value || a.find((e) => e.candidate_key !== t.candidate_key)?.display_value
					})
				}), /* @__PURE__ */ (0, X.jsx)(Ot, {
					candidate: t,
					row: e
				})]
			}, t.candidate_key))
		})
	}) : null;
}
function Mt({ genre: e, tags: t, locked: n, toast: i }) {
	let [a, o] = (0, G.useState)(""), [s, c] = (0, G.useState)(""), l = Pe({
		mutationFn: (t) => xe(e, t),
		onSuccess: async (t, n) => {
			t.ok ? (i(n ? `已把「${e}」收录为标签「${n}」` : `已把「${e}」判为非内容标签`), await Se()) : c(t.error || "服务端拒绝了这次收录");
		},
		onError: (e) => c(R(e))
	}), u = () => {
		let e = a.trim();
		e ? (c(""), l.mutate(e)) : c("先给它一个中文标签");
	};
	return /* @__PURE__ */ (0, X.jsxs)("div", {
		className: "flex flex-wrap items-center gap-2",
		children: [
			/* @__PURE__ */ (0, X.jsx)("b", {
				lang: "ja",
				className: "text-body-medium text-text-primary",
				children: e
			}),
			/* @__PURE__ */ (0, X.jsx)(D, {
				"aria-label": `「${e}」收录成的中文标签`,
				value: a,
				onChange: o,
				maxLength: 40,
				isDisabled: n || l.isPending,
				className: "min-w-40 flex-1",
				children: /* @__PURE__ */ (0, X.jsx)(v, {
					size: "small",
					list: t.length ? Et : void 0,
					autoComplete: "off",
					placeholder: "中文标签",
					onKeyDown: (e) => {
						e.key !== "Enter" || se(e.nativeEvent) || (e.preventDefault(), u());
					}
				})
			}),
			/* @__PURE__ */ (0, X.jsx)(r, {
				variant: "secondary",
				size: "small",
				disabled: n || l.isPending,
				onClick: u,
				children: "收录"
			}),
			/* @__PURE__ */ (0, X.jsx)(r, {
				variant: "secondary",
				size: "small",
				disabled: n || l.isPending,
				onClick: () => {
					c(""), l.mutate("");
				},
				children: "不是内容"
			}),
			s ? /* @__PURE__ */ (0, X.jsx)("p", {
				role: "status",
				className: "w-full text-body-2-regular text-text-error-primary",
				children: s
			}) : null
		]
	});
}
function Nt({ row: e, tags: t, locked: n, toast: r }) {
	let i = ye(e);
	return i.length ? /* @__PURE__ */ (0, X.jsxs)("div", {
		role: "group",
		"aria-label": "未收录 genre",
		className: "flex flex-col gap-2 border-t border-separator-border pt-4",
		children: [/* @__PURE__ */ (0, X.jsx)("h5", {
			className: "text-body-2-medium text-text-secondary",
			children: `未收录 genre · ${i.length}`
		}), /* @__PURE__ */ (0, X.jsx)("div", {
			role: "list",
			className: "flex flex-col",
			children: i.map((e, i) => /* @__PURE__ */ (0, X.jsx)("div", {
				role: "listitem",
				className: `py-3 first:pt-0 last:pb-0 ${i ? "border-t border-separator-border" : ""}`,
				children: /* @__PURE__ */ (0, X.jsx)(Mt, {
					genre: e,
					tags: t,
					locked: n,
					toast: r
				})
			}, e))
		})]
	}) : null;
}
// src/react/review/review-evidence.tsx
var Pt = (e = "") => /^https?:\/\//i.test(e) ? e : "", Ft = (e = "") => Pt(e) || (e.startsWith("/") && !e.startsWith("//") ? e : "");
function It({ url: e }) {
	let t = Ft(e || "");
	return /* @__PURE__ */ (0, X.jsx)(Lt, { source: t }, t);
}
function Lt({ source: e }) {
	let [t, n] = (0, G.useState)("idle");
	return (0, G.useEffect)(() => {
		if (t !== "loading") return;
		let e = setTimeout(() => n("failed"), 3e4);
		return () => clearTimeout(e);
	}, [t]), /* @__PURE__ */ (0, X.jsxs)("div", {
		className: "relative flex h-review-image items-center justify-center overflow-hidden rounded-surface bg-background-secondary-default",
		children: [t === "loading" ? /* @__PURE__ */ (0, X.jsxs)("span", {
			role: "status",
			className: "absolute flex items-center gap-2 text-body-2-regular text-text-secondary",
			children: [/* @__PURE__ */ (0, X.jsx)("span", { dangerouslySetInnerHTML: { __html: U("正在加载图片") } }), "正在加载图片"]
		}) : null, e && (t === "loading" || t === "ready") ? /* @__PURE__ */ (0, X.jsx)("img", {
			src: e,
			alt: "来源提供的备选图片",
			referrerPolicy: "no-referrer",
			decoding: "async",
			className: `size-full object-contain ${t === "loading" ? "invisible" : ""}`,
			onLoad: () => n("ready"),
			onError: () => n("failed")
		}) : e ? /* @__PURE__ */ (0, X.jsxs)("div", {
			className: "flex flex-col items-center gap-2",
			children: [t === "failed" ? /* @__PURE__ */ (0, X.jsx)("span", {
				className: "text-body-2-regular text-text-secondary",
				children: "未取得来源图片"
			}) : null, /* @__PURE__ */ (0, X.jsx)(r, {
				variant: "secondary",
				size: "small",
				"aria-label": t === "failed" ? "立即重试加载来源图片" : void 0,
				onClick: () => n("loading"),
				children: t === "failed" ? "立即重试" : "查看来源图片"
			})]
		}) : /* @__PURE__ */ (0, X.jsx)("span", {
			className: "text-body-2-regular text-text-secondary",
			children: "未取得来源图片"
		})]
	});
}
function Rt({ asset: t, openItem: n }) {
	let i = t.name || "";
	return /* @__PURE__ */ (0, X.jsxs)("div", {
		className: "flex min-w-0 items-center gap-3",
		children: [/* @__PURE__ */ (0, X.jsxs)("button", {
			type: "button",
			onClick: () => n(t.id),
			className: "flex aspect-card-cover w-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2lg bg-background-tertiary-default outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
			children: [t.preview_url ? /* @__PURE__ */ (0, X.jsx)("img", {
				src: t.preview_url,
				alt: "",
				loading: "lazy",
				className: "size-full object-cover"
			}) : /* @__PURE__ */ (0, X.jsx)("span", {
				className: "text-caption-1-regular text-text-secondary",
				children: "无封面"
			}), /* @__PURE__ */ (0, X.jsx)(e, { children: `打开原视频 ${i}` })]
		}), /* @__PURE__ */ (0, X.jsxs)("div", {
			className: "flex min-w-0 flex-col items-start gap-1",
			children: [/* @__PURE__ */ (0, X.jsx)("b", {
				title: i,
				className: "w-full truncate text-body-medium text-text-primary",
				children: t.code || i || "原视频"
			}), /* @__PURE__ */ (0, X.jsx)(r, {
				variant: "secondary",
				size: "small",
				leadingIcon: _,
				onClick: () => n(t.id),
				children: "打开原视频"
			})]
		})]
	});
}
function zt({ kind: e, name: t, works: n, avatar: r, openEntity: i }) {
	return /* @__PURE__ */ (0, X.jsxs)("div", {
		className: "flex min-w-0 items-center gap-3",
		children: [/* @__PURE__ */ (0, X.jsx)("button", {
			type: "button",
			"aria-label": `打开创作者页：${t}`,
			onClick: () => i(e, t),
			className: `relative inline-grid size-11 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-full bg-background-secondary-default text-caption-1-medium text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring ${Be}`,
			dangerouslySetInnerHTML: { __html: r }
		}), /* @__PURE__ */ (0, X.jsxs)("div", {
			className: "flex min-w-0 flex-col items-start",
			children: [/* @__PURE__ */ (0, X.jsx)("button", {
				type: "button",
				onClick: () => i(e, t),
				className: "max-w-full cursor-pointer truncate text-body-medium text-text-primary underline-offset-2 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-border-focus-ring",
				children: t
			}), n ? /* @__PURE__ */ (0, X.jsx)("small", {
				className: "tabular-nums text-body-2-regular text-text-secondary",
				children: `${n.toLocaleString()} 部作品`
			}) : null]
		})]
	});
}
function Bt({ row: e, openItem: t, openEntity: n, onReveal: a, revealing: o, note: s }) {
	let c = Pt(e.profile_url || ""), l = (e.preview_assets || []).slice(0, 6), u = Math.max(0, Number(e.video_count || e.videos || 0));
	return /* @__PURE__ */ (0, X.jsxs)("section", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, X.jsx)("h5", {
				className: "text-body-medium text-text-primary",
				children: `待确认人物：${e.babepedia_name || "未标注"}`
			}),
			/* @__PURE__ */ (0, X.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [c ? /* @__PURE__ */ (0, X.jsx)(i, {
					variant: "secondary",
					size: "small",
					trailingIcon: O,
					href: c,
					target: "_blank",
					rel: "noopener noreferrer",
					children: "来源资料"
				}) : null, /* @__PURE__ */ (0, X.jsx)(r, {
					variant: "secondary",
					size: "small",
					onClick: () => n("creator", e.creator || ""),
					children: `查看全部 ${u.toLocaleString()} 部作品`
				})]
			}),
			/* @__PURE__ */ (0, X.jsx)(It, { url: e.preview_url }),
			l.length ? /* @__PURE__ */ (0, X.jsxs)(X.Fragment, { children: [/* @__PURE__ */ (0, X.jsx)("h5", {
				className: "text-body-medium text-text-primary",
				children: "本地作品样本"
			}), /* @__PURE__ */ (0, X.jsx)("ul", {
				className: "flex flex-col gap-1",
				children: l.map((e) => /* @__PURE__ */ (0, X.jsxs)("li", {
					className: "flex min-w-0 items-center gap-2",
					children: [/* @__PURE__ */ (0, X.jsx)(r, {
						variant: "ghost",
						size: "small",
						className: "min-w-0",
						onClick: () => t(e.id),
						children: /* @__PURE__ */ (0, X.jsx)("span", {
							title: e.name,
							className: "block max-w-full truncate",
							children: e.name
						})
					}), /* @__PURE__ */ (0, X.jsx)(r, {
						variant: "ghost",
						size: "small",
						"aria-label": `打开 ${e.name} 的文件位置`,
						...N(o === e.id),
						onClick: () => a(e.id),
						children: "文件位置"
					})]
				}, e.id))
			})] }) : /* @__PURE__ */ (0, X.jsx)("p", {
				className: "text-body-2-regular text-text-secondary",
				children: "暂无本地作品样本，打开全部作品核对。"
			}),
			s ? /* @__PURE__ */ (0, X.jsx)("p", {
				role: "status",
				className: "text-body-2-regular text-text-error-primary",
				children: s
			}) : null
		]
	});
}
function Vt({ assets: t, picked: n, onPicked: r, locked: i }) {
	let [a, s] = (0, G.useState)(null), c = new Set(n), l = (e, n) => {
		if (i) return;
		let o = new Set(c);
		if (n && a !== null) {
			let [n, r] = [Math.min(a, e), Math.max(a, e)];
			for (let e = n; e <= r; e++) o.add(t[e].id);
		} else {
			let n = t[e].id;
			o.has(n) ? o.delete(n) : o.add(n);
		}
		s(e), r(t.filter((e) => o.has(e.id)).map((e) => e.id));
	};
	return /* @__PURE__ */ (0, X.jsxs)("div", {
		className: "flex flex-col gap-2",
		children: [/* @__PURE__ */ (0, X.jsx)(T, {
			prefix: /* @__PURE__ */ (0, X.jsx)("span", {
				className: "tabular-nums text-body-2-regular text-text-secondary",
				children: `已选 ${c.size} / ${t.length}`
			}),
			actions: [{
				label: "全选",
				disabled: i,
				onPress: () => r(t.map((e) => e.id))
			}, {
				label: "清空",
				disabled: i,
				onPress: () => r([])
			}]
		}), /* @__PURE__ */ (0, X.jsx)("div", {
			className: "review-asset-grid gap-1.5",
			children: t.map((t, n) => {
				let r = c.has(t.id);
				return /* @__PURE__ */ (0, X.jsxs)("button", {
					type: "button",
					"aria-pressed": r,
					title: t.name,
					onClick: (e) => l(n, e.shiftKey),
					className: `relative aspect-card-cover cursor-pointer overflow-hidden rounded-surface bg-background-tertiary-default outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-border-focus-ring ${r ? "opacity-100 ring-2 ring-border-button-active ring-inset" : "opacity-50"}`,
					children: [
						/* @__PURE__ */ (0, X.jsx)("img", {
							src: `/poster?id=${t.id}&c=4`,
							alt: "",
							loading: "lazy",
							className: "size-full object-cover"
						}),
						/* @__PURE__ */ (0, X.jsx)("span", {
							className: "absolute top-1 right-1",
							children: /* @__PURE__ */ (0, X.jsx)(o, {
								size: "sm",
								state: {
									isSelected: r,
									isIndeterminate: !1,
									isFocusVisible: !1,
									isDisabled: i,
									isHovered: !1
								}
							})
						}),
						/* @__PURE__ */ (0, X.jsx)(e, { children: `${r ? "已选" : "未选"} ${t.name || t.id}` })
					]
				}, t.id);
			})
		})]
	});
}
// src/react/review/review-card.tsx
var Ht = P({
	variant: "filled",
	padding: "none",
	className: "flex flex-col overflow-hidden"
}), Ut = "flex min-h-6 min-w-0 items-center", Wt = 2, Gt = (e) => e === "western_identity" ? "h-review-card-tall" : "h-review-card";
function Kt(e) {
	let { category: t, row: n, choice: i, onChoice: o, selected: c, onSelect: l, locked: u, busy: d, problem: h, genreTags: g, onDecide: _, handlers: v, queueView: y = "pending" } = e, b = (0, G.useRef)(!1), re = Ie(), x = t === "metadata_fields", ie = f[t] || "", S = String(n.creator || "").trim(), C = !!ie && !!S, w = H(t, n), T = ke(t, n), ae = Ae(t, n), E = Oe(n), D = V(n), O = oe(t, n), k = n.comparison_assets || [], A = n.preview_assets || [], j = ne[n.decision || ""], P = k.length > 1 ? /* @__PURE__ */ (0, X.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [k.slice(0, Wt).map((e) => /* @__PURE__ */ (0, X.jsx)(Rt, {
			asset: e,
			openItem: v.openItem
		}, e.id)), k.length > Wt ? /* @__PURE__ */ (0, X.jsx)("p", {
			className: "text-body-2-regular text-text-secondary",
			children: `另有 ${(k.length - Wt).toLocaleString()} 部对照作品`
		}) : null]
	}) : C ? /* @__PURE__ */ (0, X.jsx)(zt, {
		kind: ie,
		name: S,
		works: Number(n.video_count || n.videos || 0),
		openEntity: v.openEntity,
		avatar: M(S, n.entity_id ? {
			id: n.entity_id,
			has_image: !!n.has_image,
			image_version: n.image_version,
			avatar_focus: n.avatar_focus
		} : null, null, ie)
	}) : n.asset_id ? /* @__PURE__ */ (0, X.jsx)(Rt, {
		openItem: v.openItem,
		asset: {
			id: n.asset_id,
			name: n.asset_name,
			code: n.code,
			preview_url: n.asset_preview_url
		}
	}) : null, F = x ? /* @__PURE__ */ (0, X.jsx)(jt, {
		row: n,
		fieldName: T,
		value: i.candidateKey,
		onChange: (e) => o({
			...i,
			candidateKey: e
		}),
		locked: u
	}) : t === "creator_tags" ? A.length ? /* @__PURE__ */ (0, X.jsx)(Vt, {
		assets: A,
		picked: i.assets,
		locked: u,
		onPicked: (e) => o({
			...i,
			assets: e
		})
	}) : /* @__PURE__ */ (0, X.jsx)(m, {
		size: "compact",
		icon: p,
		title: "这批作品尚未抽帧",
		children: `${n.video_count || ""} 条作品还没有可用预览；批准后仍会按所选资料写入标签。`
	}) : t === "fc2_similarity" ? null : t === "western_identity" ? /* @__PURE__ */ (0, X.jsx)(Bt, {
		row: n,
		openItem: v.openItem,
		openEntity: v.openEntity,
		onReveal: v.onReveal,
		revealing: v.revealing,
		note: v.revealNote
	}) : /* @__PURE__ */ (0, X.jsx)(It, { url: n.preview_url }), se = C ? P : T ? /* @__PURE__ */ (0, X.jsxs)("h4", {
		className: L(Ut, "flex-wrap gap-2"),
		children: [/* @__PURE__ */ (0, X.jsx)("span", {
			title: T,
			className: "flex max-w-full min-w-0 overflow-hidden rounded-md",
			children: /* @__PURE__ */ (0, X.jsx)(s, {
				variant: "caption",
				color: "neutral",
				children: T
			})
		}), /* @__PURE__ */ (0, X.jsx)("span", {
			title: ae,
			className: "min-w-0 truncate text-body-medium text-text-primary",
			children: ae
		})]
	}) : /* @__PURE__ */ (0, X.jsx)("h4", {
		className: Ut,
		children: /* @__PURE__ */ (0, X.jsx)("span", {
			title: w,
			className: "min-w-0 truncate text-body-medium text-text-primary",
			children: w
		})
	});
	return /* @__PURE__ */ (0, X.jsxs)("section", {
		"aria-label": w,
		"data-review-key": n.item_key,
		className: L(Ht, Gt(t)),
		children: [
			/* @__PURE__ */ (0, X.jsxs)("header", {
				className: "flex min-w-0 shrink-0 items-center gap-2 border-b border-separator-border px-5 py-4",
				children: [
					u ? null : /* @__PURE__ */ (0, X.jsx)("span", {
						className: L(Ut, "shrink-0"),
						onPointerDownCapture: (e) => {
							b.current = e.shiftKey;
						},
						onKeyDownCapture: (e) => {
							b.current = e.shiftKey;
						},
						children: /* @__PURE__ */ (0, X.jsx)(a, {
							isSelected: c,
							"aria-label": `选择 ${w}`,
							onChange: (e) => l(b.current, e)
						})
					}),
					/* @__PURE__ */ (0, X.jsx)("div", {
						className: "min-w-0 flex-1",
						children: se
					}),
					j ? /* @__PURE__ */ (0, X.jsx)(s, {
						variant: "caption",
						color: "neutral",
						children: j
					}) : null
				]
			}),
			/* @__PURE__ */ (0, X.jsx)("div", {
				className: "relative mx-5 flex min-w-0 min-h-0 flex-1 flex-col",
				children: /* @__PURE__ */ (0, X.jsxs)("div", {
					ref: re,
					className: "flex min-w-0 min-h-0 flex-1 flex-col gap-4 overflow-y-auto py-4",
					children: [
						n.source_name ? /* @__PURE__ */ (0, X.jsx)("p", {
							className: "text-body-2-regular text-text-secondary",
							children: `来源写法：${n.source_name}`
						}) : null,
						!C && (n.board || n.assets) ? /* @__PURE__ */ (0, X.jsx)("p", {
							className: "text-body-2-regular text-text-secondary",
							children: `对照文件：${Number(n.video_count || n.assets || 0).toLocaleString()}`
						}) : null,
						!C && P ? P : null,
						x && (E || n.current_value !== void 0) ? /* @__PURE__ */ (0, X.jsxs)("div", {
							role: "region",
							"aria-label": "当前信息",
							className: "flex min-w-0 flex-col gap-1 border-b border-separator-border pb-4",
							children: [
								/* @__PURE__ */ (0, X.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [/* @__PURE__ */ (0, X.jsx)("h5", {
										"data-copy-key": "review.card.current_value",
										className: "text-caption-1-medium text-text-secondary",
										children: "当前值"
									}), n.current_owner?.startsWith("user:") || n.current_owner?.startsWith("review:") ? /* @__PURE__ */ (0, X.jsx)(s, {
										variant: "caption",
										color: "neutral",
										children: "人工确认"
									}) : null]
								}),
								/* @__PURE__ */ (0, X.jsx)("p", {
									className: "text-body-2-regular text-text-primary wrap-anywhere",
									children: n.current_value === void 0 ? E : n.current_value ? /* @__PURE__ */ (0, X.jsx)(wt, {
										value: n.current_value,
										reference: (n.candidates?.find((e) => e.candidate_key === i.candidateKey) || n.candidates?.[0])?.display_value
									}) : "尚无资料"
								}),
								n.videos === void 0 ? null : /* @__PURE__ */ (0, X.jsx)("p", {
									className: "text-caption-1-regular text-text-secondary",
									children: `${Number(n.videos).toLocaleString()} 个${n.asset_path ? "匹配文件" : "同番号文件"}`
								})
							]
						}) : null,
						D.length || t === "creator_tags" ? /* @__PURE__ */ (0, X.jsx)("div", {
							className: "flex flex-wrap gap-1",
							children: D.length ? D.map((e) => /* @__PURE__ */ (0, X.jsx)(s, {
								variant: "caption",
								color: "soft",
								children: e
							}, e)) : /* @__PURE__ */ (0, X.jsx)("small", {
								className: "text-body-2-regular text-text-secondary",
								children: "暂无待确认标签"
							})
						}) : null,
						x ? /* @__PURE__ */ (0, X.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, X.jsxs)("h5", {
								className: "text-caption-1-medium text-text-secondary",
								children: [/* @__PURE__ */ (0, X.jsx)("span", {
									"data-copy-key": "review.card.candidate_sources",
									children: "候选来源"
								}), ` · ${n.candidates?.length || 0}`]
							}), n.current_value || (n.candidates?.length || 0) > 1 ? /* @__PURE__ */ (0, X.jsx)("span", {
								"data-copy-key": n.current_value ? "review.card.compare_current" : "review.card.compare_sources",
								className: "text-caption-1-regular text-text-tertiary",
								children: n.current_value ? "与当前值比较" : "来源间差异"
							}) : null]
						}) : null,
						F,
						/* @__PURE__ */ (0, X.jsx)(Nt, {
							row: n,
							tags: g,
							locked: u,
							toast: v.toast
						}),
						!x && E ? /* @__PURE__ */ (0, X.jsx)("p", {
							className: "text-body-2-regular text-text-secondary wrap-anywhere",
							children: E
						}) : null
					]
				})
			}),
			/* @__PURE__ */ (0, X.jsxs)("footer", {
				className: L(ee.stack, "shrink-0"),
				children: [
					y === "ignored" ? null : /* @__PURE__ */ (0, X.jsx)(te, {
						variant: "secondary",
						size: "small",
						className: "me-auto",
						disabled: u,
						...N(d),
						onClick: () => _("rejected"),
						children: "忽略"
					}),
					y === "pending" ? /* @__PURE__ */ (0, X.jsx)(r, {
						variant: "secondary",
						size: "small",
						disabled: u,
						...N(d),
						onClick: () => _("skipped"),
						children: "稍后处理"
					}) : /* @__PURE__ */ (0, X.jsx)(r, {
						variant: y === "ignored" ? "primary" : "secondary",
						size: "small",
						disabled: u,
						...N(d),
						onClick: () => _("restore"),
						children: "恢复待处理"
					}),
					y === "ignored" ? null : /* @__PURE__ */ (0, X.jsx)(r, {
						variant: "primary",
						size: "small",
						disabled: u || !O,
						...N(d),
						title: O ? void 0 : "没有可采用的资料，可先保留或忽略",
						onClick: () => _("approved"),
						children: O ? "通过" : "不可通过"
					}),
					h ? /* @__PURE__ */ (0, X.jsx)("p", {
						role: "status",
						className: "w-full text-body-2-regular text-text-error-primary",
						children: h
					}) : null
				]
			})
		]
	});
}
// src/react/review/review-page.tsx
var qt = "flex cursor-pointer items-center justify-between gap-2";
function Jt(e) {
	let t = Fe("review").keys.filter(he), [n, i] = (0, G.useState)(() => matchMedia("(max-width:900px)").matches);
	(0, G.useEffect)(() => {
		let e = matchMedia("(max-width:900px)"), t = () => i(e.matches);
		return e.addEventListener("change", t), () => e.removeEventListener("change", t);
	}, []);
	let { route: a, openItem: o, openEntity: s, revealSource: c, toast: l, readOnly: f, readOnlyMessage: p, writerUrl: ee } = e, [g, _] = (0, G.useState)(he(e.category) ? e.category : u), [v, te] = (0, G.useState)(() => Ee(e.queue)), [ne, C] = (0, G.useState)("candidates"), [w, T] = (0, G.useState)(""), [ae, D] = (0, G.useState)(""), [O, k] = (0, G.useState)(1), [A, j] = (0, G.useState)(20), [M, N] = (0, G.useState)(/* @__PURE__ */ new Set()), [P, F] = (0, G.useState)(/* @__PURE__ */ new Map()), [se, I] = (0, G.useState)(/* @__PURE__ */ new Map()), [L, z] = (0, G.useState)(""), ge = (0, G.useRef)(null), [ye, be] = (0, G.useState)(0), [xe, Se] = (0, G.useState)(""), Ce = (0, G.useRef)(!0);
	(0, G.useEffect)(() => () => {
		Ce.current = !1;
	}, []);
	let B = Le({
		queryKey: re,
		queryFn: ({ signal: e }) => fe(e)
	}), Oe = B.data || {
		sections: {},
		counts: {},
		queues: {
			later: {
				sections: {},
				counts: {}
			},
			ignored: {
				sections: {},
				counts: {}
			}
		}
	}, ke = Te(Oe, v), Ae = B.data ? Object.fromEntries(ie.map((e) => [e, b.reduce((t, n) => t + Number(Te(Oe, e).counts[n] || 0), 0)])) : void 0, V = ke.sections[g] || [], H = g === "metadata_fields", U = f;
	(0, G.useEffect)(() => {
		let e = new Set(V.map((e) => e.item_key));
		N((t) => {
			let n = [...t].filter((t) => e.has(t));
			return n.length === t.size ? t : new Set(n);
		}), F((t) => {
			let n = [...t].filter(([t]) => e.has(t));
			return n.length === t.size ? t : new Map(n);
		}), I((t) => {
			let n = [...t].filter(([t]) => e.has(t));
			return n.length === t.size ? t : new Map(n);
		});
	}, [V]);
	let Ie = (0, G.useMemo)(() => H ? me(V, "field") : [], [V, H]), Re = Ie.some((e) => e.key === ae) ? ae : "", W = (0, G.useMemo)(() => H ? pe(V, "field", Re) : V, [
		V,
		H,
		Re
	]), Be = (0, G.useMemo)(() => we(W, H), [W, H]), K = Be.some(([e]) => e === ne) ? ne : "candidates", Ve = (0, G.useMemo)(() => me(W, K), [W, K]), He = Ve.some((e) => e.key === w) ? w : "", Ue = (0, G.useMemo)(() => pe(W, K, He), [
		W,
		K,
		He
	]), We = (0, G.useMemo)(() => De(Ue, O, A), [
		Ue,
		O,
		A
	]), Ge = We.rows.map((e) => e.item_key), Ke = new Set(Ge), q = Ve.map((e) => ({
		...e,
		rows: e.rows.filter((e) => Ke.has(e.item_key))
	})).filter((e) => e.rows.length), J = (e) => P.get(e.item_key) || de(e), Y = (0, G.useMemo)(() => V.filter((e) => M.has(e.item_key)), [V, M]), qe = (e) => {
		let t = new Set(e);
		N((e) => new Set([...e].filter((e) => !t.has(e)))), F((e) => new Map([...e].filter(([e]) => !t.has(e)))), I((e) => new Map([...e].filter(([e]) => !t.has(e))));
	}, Je = (e, t) => I((n) => new Map(n).set(e, t)), Ye = () => {
		C("candidates"), T(""), D(""), k(1), N(/* @__PURE__ */ new Set()), F(/* @__PURE__ */ new Map()), I(/* @__PURE__ */ new Map()), z(""), ge.current = null;
	}, Xe = (e) => {
		_(e), Ye(), a({
			category: e === "metadata_fields" ? "" : e,
			queue: v === "pending" ? "" : v
		});
	}, Ze = (e) => {
		te(e), Ye(), a({
			category: g === "metadata_fields" ? "" : g,
			queue: e === "pending" ? "" : e
		});
	}, Z = Pe({
		mutationFn: ({ row: e, status: t, category: n }) => Ne(le(n, ce(n, e), t, J(e))),
		onSuccess: (e, { row: t, status: n, category: r }) => {
			e.ok ? (Me(r, [t.item_key], n), qe([t.item_key]), l(ue(n))) : Je(t.item_key, e.error || "服务端拒绝了这次判定");
		},
		onError: (e, { row: t }) => Je(t.item_key, R(e))
	}), Q = Pe({
		mutationFn: async ({ status: e, category: t, rows: n }) => {
			let r = [], i = [];
			for (let [a, o] of n.entries()) {
				if (!Ce.current) break;
				z(`正在处理 ${a} / ${n.length}`);
				try {
					let n = await Ne(le(t, ce(t, o), e, J(o)));
					if (!n.ok) throw Error(n.error || "服务端未采用该项");
					r.push(o.item_key);
				} catch (e) {
					i.push([o.item_key, R(e)]);
				}
			}
			return {
				status: e,
				category: t,
				done: r,
				failures: i
			};
		},
		onSuccess: ({ status: e, category: t, done: n, failures: r }) => {
			Me(t, n, e), qe(n), r.forEach(([e, t]) => Je(e, t)), z("");
			let i = {
				approved: "通过",
				rejected: "忽略",
				skipped: "移至稍后处理",
				restore: "恢复待处理"
			}[e];
			l(`已${i} ${n.length} 项` + (r.length ? `，${r.length} 项未完成` : ""));
		},
		onError: (e) => {
			z(R(e));
		}
	}), et = (e) => {
		!Q.isPending && Y.length && (e === "approved" && H && Y.some((e) => !J(e).candidateKey) ? z("请先为所选资料选择要采用的来源。") : (z(""), Q.mutate({
			status: e,
			category: g,
			rows: Y
		})));
	}, tt = (e) => {
		F((t) => {
			let n = new Map(t);
			for (let t of Y) {
				let r = t.candidates?.find((t) => t.source === e);
				r && n.set(t.item_key, {
					...J(t),
					candidateKey: r.candidate_key
				});
			}
			return n;
		}), z(`已选择 ${e}，点击通过所选采用。`);
	}, nt = async (e) => {
		if (ye) return;
		be(e), Se("");
		let t = await c(e);
		Ce.current && (be(0), Se(t));
	}, rt = ve(Oe.mirror, p), $ = Oe.genre_tags || [], it = {
		openItem: o,
		openEntity: s,
		onReveal: nt,
		revealing: ye,
		revealNote: xe,
		toast: l
	};
	return /* @__PURE__ */ (0, X.jsx)(ze, { children: /* @__PURE__ */ (0, X.jsxs)("div", {
		className: "flex flex-col gap-5 pb-10",
		children: [
			U ? /* @__PURE__ */ (0, X.jsx)(y, {
				tone: "warning",
				title: "本机只能浏览",
				extra: ee ? /* @__PURE__ */ (0, X.jsx)("p", {
					className: "text-body-2-regular",
					children: /* @__PURE__ */ (0, X.jsx)(h, {
						href: ee,
						children: "前往写入端复核"
					})
				}) : void 0,
				children: rt
			}) : null,
			/* @__PURE__ */ (0, X.jsx)(Dt, { tags: $ }),
			/* @__PURE__ */ (0, X.jsxs)("div", {
				className: "flex flex-col gap-5 review-split:flex-row review-split:items-start review-split:gap-6",
				children: [/* @__PURE__ */ (0, X.jsxs)("div", {
					"data-section-nav": !0,
					className: "w-full min-w-0 review-split:sticky review-split:top-topbar review-split:w-review-tabs review-split:shrink-0",
					children: [/* @__PURE__ */ (0, X.jsx)("h2", {
						id: "reviewcategories",
						children: "复核分类"
					}), /* @__PURE__ */ (0, X.jsx)(E, {
						group: "review",
						label: "复核分类",
						value: g,
						onChange: Xe,
						orientation: n ? "horizontal" : "vertical",
						panelPrefix: "review",
						sectionItems: !0,
						className: "",
						itemClassName: qt,
						disabled: Z.isPending || Q.isPending,
						tabs: b.map((e) => {
							let t = Number(ke.counts[e] || 0);
							return {
								value: e,
								label: x[e],
								badge: t ? /* @__PURE__ */ (0, X.jsx)("span", {
									className: "tabular-nums text-caption-1-medium text-text-secondary",
									children: t.toLocaleString()
								}) : null
							};
						})
					})]
				}), /* @__PURE__ */ (0, X.jsxs)("div", {
					role: "tabpanel",
					id: `review-panel-${g}`,
					"aria-labelledby": `review-tab-${g}`,
					className: "flex min-w-0 flex-1 flex-col gap-5",
					children: [
						/* @__PURE__ */ (0, X.jsx)($e, {
							queueView: v,
							queueCounts: Ae,
							onQueueChange: Ze,
							locked: U,
							fields: Ie,
							fieldFilter: Re,
							onFieldFilter: (e) => {
								D(e), T(""), k(1);
							},
							groupOptions: Be,
							groupBy: K,
							onGroupBy: (e) => {
								C(e), T(""), k(1);
							},
							groups: Ve,
							filter: He,
							onFilter: (e) => {
								T(e), k(1);
							},
							pageKeys: Ge,
							selected: M,
							onSelected: N,
							selectedRows: Y,
							metadata: H,
							approvable: Y.every((e) => oe(g, e)),
							busy: Q.isPending || Z.isPending,
							feedback: L,
							onUnifySource: tt,
							onRun: et
						}),
						We.rows.length ? q.map((e) => /* @__PURE__ */ (0, X.jsxs)("section", {
							className: "flex flex-col gap-3",
							children: [q.length > 1 || K !== "candidates" ? /* @__PURE__ */ (0, X.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, X.jsx)("h3", {
									className: "text-body-medium text-text-primary",
									children: `${e.title} · ${e.rows.length}`
								}), U ? null : /* @__PURE__ */ (0, X.jsx)(r, {
									variant: "ghost",
									size: "small",
									onClick: () => {
										let t = e.rows.map((e) => e.item_key), n = t.every((e) => M.has(e)), r = new Set(M);
										for (let e of t) n ? r.delete(e) : r.add(e);
										N(r);
									},
									children: e.rows.every((e) => M.has(e.item_key)) ? "清空本组" : "全选本组"
								})]
							}) : null, /* @__PURE__ */ (0, X.jsx)("div", {
								className: "review-grid gap-5",
								children: e.rows.map((e) => /* @__PURE__ */ (0, X.jsx)(Kt, {
									category: g,
									row: e,
									queueView: v,
									choice: J(e),
									onChoice: (t) => F((n) => new Map(n).set(e.item_key, t)),
									selected: M.has(e.item_key),
									onSelect: (t, n) => N((r) => {
										let i = new Set(r);
										return ge.current = je(i, Ge, ge.current, e.item_key, t, n), i;
									}),
									locked: U,
									busy: Q.isPending || Z.isPending && Z.variables?.row.item_key === e.item_key,
									problem: se.get(e.item_key) || "",
									genreTags: $,
									onDecide: (t) => {
										Z.isPending || Q.isPending || (I((t) => new Map([...t].filter(([t]) => t !== e.item_key))), Z.mutate({
											row: e,
											status: t,
											category: g
										}));
									},
									handlers: it
								}, e.item_key))
							})]
						}, e.key)) : B.isError && !B.data ? /* @__PURE__ */ (0, X.jsx)(y, {
							tone: "error",
							title: "复核队列读取失败",
							action: /* @__PURE__ */ (0, X.jsx)(r, {
								variant: "secondary",
								size: "small",
								disabled: B.isFetching,
								onClick: () => void B.refetch(),
								children: "立即重试"
							}),
							children: R(B.error)
						}) : /* @__PURE__ */ (0, X.jsx)(m, {
							icon: _e,
							title: `此分类没有${S[v]}项目`,
							actions: b.some((e) => e !== g && Number(ke.counts[e] || 0) > 0) ? /* @__PURE__ */ (0, X.jsx)(r, {
								size: "small",
								onClick: () => {
									let e = t.find((e) => e !== g && Number(ke.counts[e] || 0) > 0);
									e && Xe(e);
								},
								children: "查看其他分类"
							}) : void 0,
							children: v === "pending" ? "可切换分类查看其他待确认资料。" : `${S[v]}的资料会保留在这里，可恢复到待处理。`
						}),
						Ue.length ? /* @__PURE__ */ (0, X.jsx)(d, {
							label: "复核",
							total: Ue.length,
							pagination: {
								pageIndex: We.page - 1,
								pageSize: A
							},
							onChange: (e) => {
								k(e.pageIndex + 1), j(e.pageSize);
							}
						}) : null,
						H && v === "pending" ? /* @__PURE__ */ (0, X.jsx)(Qe, {
							locked: U,
							openItem: o,
							toast: l
						}) : null
					]
				})]
			})
		]
	}) });
}
export { Jt as ReviewPage };

//# debugId=204b38e5-d738-4951-916c-b91e3a524f79