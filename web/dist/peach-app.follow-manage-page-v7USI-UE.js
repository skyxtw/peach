(function() {
	try {
		var e = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, t = new e.Error().stack;
		t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "17daca0c-c894-491a-8453-cf5dcdebc391", e._sentryDebugIdIdentifier = "sentry-dbid-17daca0c-c894-491a-8453-cf5dcdebc391");
	} catch {}
})();
import { $2ec61d1d4f780267$export$a8a3e93435678ff9 as e, $542a13ca2fa5b484$export$5b6b19405a83ff9d as t, $76d00c5a4edb230a$export$76ccd210b9029917 as n, $76d00c5a4edb230a$export$816b5d811295e6bc as r, $76d00c5a4edb230a$export$b59bdbef9ce70de2 as i, $76d00c5a4edb230a$export$f6f0c3fe4ec306ea as a, $76d00c5a4edb230a$export$f850895b287ef28e as o, $ea3928288112382f$export$439d29a4e110a164 as s, $l as c, ActivityStatus as l, Button as u, ButtonLink as d, Bx as f, COLUMN_SORT as p, Checkbox as m, ChevronSortDown as h, Chip as g, CollapseChevron as _, CollapseRegion as v, ColumnFilterAvatar as y, DataTableFooter as ee, DataTableFrame as b, DataTableSort as x, EmptyFocusButton as S, EmptyState as C, ErrorText as w, ExternalLink as T, FEEDS_KEY as te, FOLLOW_CHECK_KEY as E, FOLLOW_CHECK_TASK as D, FOLLOW_CREDENTIALS_KEY as O, FOLLOW_MANAGE_KEY as k, FOLLOW_MANAGE_NAV as ne, FOLLOW_RESOLVE_KEY as A, FieldLabel as j, Help as M, Input as N, LAYOUTS as P, LEGACY_AVATAR_IMG as F, M6 as I, MENU_ITEM as L, MENU_ITEM_INTERACTIVE as re, MENU_POPOVER_SURFACE as ie, ModalFrame as R, Note as z, P7 as B, SORT_DEFAULT_DIR as V, SORT_OPTIONS as ae, STAT_STRIP_SIX as oe, Select as se, SelectItem as ce, SelectionDock as le, SelectionPopover as H, SiteIcon as U, SiteLabel as ue, SortDirectionIcon as de, SortableBoardTabs as fe, Switch as pe, Table as me, TableColumnControls as he, TableColumnResizer as ge, TableSelectionHeader as _e, TaskProgress as ve, Un as W, Wt as ye, Xf as be, __toESM as xe, activityKind as Se, addAlias as Ce, addSource as we, apiSend as Te, authorGroups as Ee, authorName as De, avatarInner as Oe, busyProps as G, cardClass as ke, checkEvidenceGap as Ae, checkFailures as je, checkFeeds as Me, checkReceipt as Ne, checkSummary as Pe, checkedText as Fe, clickedBlank as Ie, codedText as Le, columnVisibilityFeature as Re, composingKey as ze, confirmModal as Be, createColumnHelper as Ve, credentialDone as He, cx as Ue, dZ as We, dropSources as Ge, du as Ke, enterPageSelection as qe, errorHeadline as Je, errorMessage as K, exitPageSelection as Ye, feedIntervalText as Xe, fetchCheckJob as Ze, fetchCredentials as Qe, fetchFeeds as $e, fetchFollow as et, fetchResolveJob as tt, fetchSuggestions as nt, flexRender as rt, followFeedByName as it, followFeedEntity as at, followSuggestKey as ot, groupByAuthor as st, isBroken as ct, isLayout as lt, jobText as ut, joinList as dt, keepSelected as ft, l7 as pt, localTime as mt, lookupFeedActor as ht, mapLimit as gt, markAllPending as _t, pageSizeOf as vt, pageWindow as yt, patchSource as bt, pv as xt, queryClient as St, quoted as Ct, reloadFollowManage as q, removeAlias as wt, removeFeed as Tt, removeSource as Et, renameAliasGroup as Dt, require_jsx_runtime as Ot, require_react as kt, resolveFollowSort as At, rowPaginationFeature as jt, rowSelectionFeature as Mt, rowSortingFeature as Nt, runBulkAction as Pt, selectionState as Ft, serverLabel as It, setFeedEnabled as Lt, setSourceEnabled as Rt, skeletonHtml as zt, sortLabel as Bt, startCheck as Vt, startResolve as Ht, statusText as Ut, t as J, tableFeatures as Wt, tableRows as Gt, toggleGroup as Kt, unmarkItems as qt, useAction as Jt, useBackgroundJob as Yt, useMutation as Xt, usePageSelection as Zt, useQuery as Qt, useQueryClient as $t, useTable as en, useTableFilters as tn, useTablePreferences as nn } from "./peach-app.js";
import { Page as rn } from "./peach-app.page-QAncjzM1.js";
import { AuthorAvatar as an, ErrorLine as on, SourceIcon as sn, SourceLink as cn, StatusBadge as ln } from "./peach-app.source-view-CDbKpFus.js";
import { createPaginatedRowModel as un, createSortedRowModel as dn, useTableSelection as fn } from "./peach-app.use-table-selection-CnuGRvGn.js";
// src/react/follow-manage/add-source.tsx
var Y = /* @__PURE__ */ xe(kt(), 1), X = Ot(), pn = Ue(L, re, "text-body-2-medium"), mn = J("follow:addCreatorSource.placeholder"), hn = J("follow:addCreatorSource.title"), gn = J("follow:addCreatorSource.searchingByName"), _n = J("follow:addCreatorSource.recognizing"), vn = J("follow:addCreatorSource.noSourceFound"), yn = "/settings/subscriptions", bn = (e, t) => `${e}:${t.url}`;
function xn({ field: e, menu: n, options: r, active: i, busy: a, onPick: o, onClose: s }) {
	return (0, Y.useEffect)(() => {
		n.current?.querySelector("[aria-current=\"true\"]")?.scrollIntoView({ block: "nearest" });
	}, [n, i]), /* @__PURE__ */ (0, X.jsxs)(t, {
		ref: n,
		triggerRef: e,
		isOpen: !0,
		isNonModal: !0,
		shouldFlip: !1,
		onOpenChange: (e) => {
			e || s();
		},
		placement: "bottom start",
		offset: 4,
		"aria-label": J("follow:addCreatorSource.suggestions"),
		className: Ue(ie, "flex w-(--trigger-width) flex-col gap-1 overscroll-contain"),
		children: [a && !r.length ? /* @__PURE__ */ (0, X.jsx)("div", {
			className: "px-2 py-1.5",
			children: /* @__PURE__ */ (0, X.jsx)(l, {
				kind: "radar",
				label: J("follow:addCreatorSource.findingSuggestions")
			})
		}) : null, r.map((e, t) => /* @__PURE__ */ (0, X.jsxs)(Y.Fragment, { children: [e.group === r[t - 1]?.group ? null : /* @__PURE__ */ (0, X.jsx)("div", {
			className: "px-2 pt-1 text-caption-1-regular text-text-tertiary",
			children: e.group
		}), /* @__PURE__ */ (0, X.jsxs)("button", {
			type: "button",
			"aria-current": t === i ? "true" : void 0,
			className: t === i ? Ue(pn, "bg-background-secondary-default") : pn,
			onMouseDown: (e) => e.preventDefault(),
			onClick: () => o(e.value),
			children: [
				/* @__PURE__ */ (0, X.jsx)("span", {
					className: "min-w-0 grow truncate text-left",
					children: e.value
				}),
				e.matched ? /* @__PURE__ */ (0, X.jsx)("span", {
					className: "shrink-0 text-caption-1-regular text-text-tertiary",
					children: e.matched
				}) : null,
				e.n ? /* @__PURE__ */ (0, X.jsx)("span", {
					className: "shrink-0 text-caption-1-regular tabular-nums text-text-tertiary",
					children: e.n.toLocaleString()
				}) : null
			]
		})] }, `${e.group}-${e.value}`))]
	});
}
function Sn({ credentials: e, hidden: t, onHidden: n }) {
	let r = (e.providers || []).filter((e) => e.followable), i = r.filter((e) => !t.has(e.provider_label)).length, a = i === r.length ? J("follow:addCreatorSource.allSources") : J("follow:addCreatorSource.shownSources", {
		shown: i,
		count: r.length
	});
	return /* @__PURE__ */ (0, X.jsx)(H, {
		label: J("follow:addCreatorSource.sourceFilter"),
		triggerLabel: a,
		leadingIcon: c,
		empty: J("follow:addCreatorSource.noSources"),
		items: r.map((e) => ({
			id: e.provider_label,
			selected: !t.has(e.provider_label),
			label: /* @__PURE__ */ (0, X.jsxs)("span", {
				className: "flex min-w-0 items-center gap-1.5",
				children: [/* @__PURE__ */ (0, X.jsx)(sn, { provider: e.provider }), e.provider_label]
			})
		})),
		onChange: (e, r) => {
			let i = new Set(t);
			r ? i.delete(e) : i.add(e), n(i);
		},
		actions: [
			{
				label: J("follow:shared.selectAll"),
				disabled: !r.length,
				onPress: () => n(/* @__PURE__ */ new Set())
			},
			{
				label: J("follow:shared.selectNone"),
				disabled: !r.length,
				onPress: () => n(new Set(r.map((e) => e.provider_label)))
			},
			{
				label: J("follow:addCreatorSource.credentialSettings"),
				href: yn
			}
		]
	});
}
function Cn({ row: e, at: t, hidden: n, unpicked: r, onPick: i }) {
	if (e.kind === "error") return /* @__PURE__ */ (0, X.jsx)(z, {
		tone: "error",
		title: e.line,
		children: ut(e, "error") || J("follow:addCreatorSource.searchFailed")
	});
	let a = (e.candidates || []).filter((e) => !n.has(e.provider_label || "")), o = Object.entries(e.failures || {});
	return /* @__PURE__ */ (0, X.jsxs)("div", {
		className: ke({
			variant: "outlined",
			padding: "none",
			className: "flex flex-col gap-2 p-4"
		}),
		children: [
			/* @__PURE__ */ (0, X.jsx)("b", {
				className: "text-body-medium text-text-primary",
				children: e.line
			}),
			a.length ? a.map((e) => {
				let n = bn(t, e);
				return /* @__PURE__ */ (0, X.jsx)(m, {
					isSelected: !e.known && !r.has(n),
					isDisabled: e.known,
					onChange: (e) => i(n, e),
					children: /* @__PURE__ */ (0, X.jsxs)("span", {
						className: "flex min-w-0 flex-wrap items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, X.jsx)(sn, { provider: e.provider }),
							/* @__PURE__ */ (0, X.jsx)("b", {
								className: "text-body-medium",
								children: e.provider_label
							}),
							/* @__PURE__ */ (0, X.jsx)("span", {
								className: "min-w-0 break-words",
								children: Le(e, "label")
							}),
							/* @__PURE__ */ (0, X.jsx)("small", {
								className: "text-caption-1-regular text-text-secondary",
								children: e.known ? J("follow:addCreatorSource.alreadyFollowing") : Le(e, "evidence")
							})
						]
					})
				}, n);
			}) : /* @__PURE__ */ (0, X.jsx)(M, { children: vn }),
			(e.external_searches || []).map((e) => /* @__PURE__ */ (0, X.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, X.jsx)("small", {
					className: "text-caption-1-regular text-text-secondary",
					children: Le(e, "evidence")
				}), /* @__PURE__ */ (0, X.jsx)(T, {
					href: e.url,
					children: J("follow:shared.labeled", {
						label: Le(e, "label"),
						value: e.query
					})
				})]
			}, e.url)),
			o.length ? /* @__PURE__ */ (0, X.jsx)(M, { children: dt(o.map(([t, n]) => J("follow:shared.labeled", {
				label: t,
				value: It(e.failure_codes?.[t]?.code ?? "", n, e.failure_codes?.[t]?.params)
			}))) }) : null
		]
	});
}
function wn({ data: e, credentials: t, readOnly: n, toast: r }) {
	let [i, a] = (0, Y.useState)(""), [o, s] = (0, Y.useState)(!1), [c, l] = (0, Y.useState)(""), [d, f] = (0, Y.useState)(""), [p, m] = (0, Y.useState)(!1), [h, g] = (0, Y.useState)(null), [_, v] = (0, Y.useState)(-1), y = (0, Y.useRef)(null), ee = (0, Y.useRef)(null), [b, x] = (0, Y.useState)(/* @__PURE__ */ new Set()), [S, C] = (0, Y.useState)(/* @__PURE__ */ new Set()), [w, T] = (0, Y.useState)(""), [te, E] = (0, Y.useState)(0);
	(0, Y.useEffect)(() => {
		let e = i.trim();
		if (o || !e || e.includes("/")) {
			f("");
			return;
		}
		let t = setTimeout(() => f(e), 250);
		return () => clearTimeout(t);
	}, [i, o]);
	let D = Qt({
		queryKey: ot(d),
		queryFn: ({ signal: e }) => nt(d, e),
		enabled: d.length > 0 && p && !o && h !== i
	}), O = (0, Y.useMemo)(() => (D.data?.groups || []).flatMap((e) => e.items.map((t) => ({
		value: t.value,
		matched: It(t.matched_code ?? "", t.matched || ""),
		n: t.n || 0,
		group: It(e.label_code ?? "", e.label)
	}))), [D.data]), { job: k, running: ne, outcome: M, start: P, dismiss: F } = Yt({
		queryKey: A,
		queryFn: ({ signal: e }) => tt(e),
		start: (e) => Ht([e]),
		onStarted: () => C(/* @__PURE__ */ new Set()),
		onError: (e) => T(K(e)),
		onFinish: (e) => {
			e.status === "failed" && T(ut(e, "error") || J("follow:addCreatorSource.searchFailed"));
		}
	}), I = (e) => {
		let t = e.trim();
		!t || n || o || ne || P.isPending || (T(""), v(-1), l(t), a(t), f(""), g(t), P.mutate(t));
	}, L = D.isFetching, re = p && !o && h !== i && (O.length > 0 || L), ie = () => {
		v(-1), g(i);
	}, R = (e) => {
		if (!(o || ze(e.nativeEvent))) {
			if (e.key === "Escape" && re) ie();
			else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
				if (!O.length) return;
				if (e.preventDefault(), !re) {
					g(null);
					return;
				}
				let t = e.key === "ArrowDown" ? 1 : -1;
				v((e) => {
					let n = e + t;
					return n < 0 ? O.length - 1 : n >= O.length ? 0 : n;
				});
			} else e.key === "Enter" && (e.preventDefault(), I(O[_]?.value || i));
		}
	}, B = M?.results || [], V = B.flatMap((e, t) => (e.candidates || []).filter((e) => !e.known && !b.has(e.provider_label || "")).map((e) => ({
		candidate: e,
		key: bn(t, e)
	})).filter((e) => !S.has(e.key))), ae = Xt({
		mutationFn: async (e) => {
			let t = [], n = [];
			E(0);
			for (let r of e) {
				try {
					let e = await we(r.candidate);
					n.push(e.source);
				} catch (e) {
					t.push(J("follow:shared.labeled", {
						label: r.candidate.label,
						value: K(e)
					}));
				}
				E((e) => e + 1);
			}
			if (n.length) try {
				await Vt(n);
			} catch (e) {
				t.push(K(e));
			}
			return {
				failures: t,
				sources: n
			};
		},
		onSuccess: (e) => {
			q(), e.failures.length ? T(dt(e.failures)) : (T(""), F(), r(J("follow:addCreatorSource.sourcesAdded", { count: e.sources.length })));
		},
		onError: (e) => T(K(e))
	}), oe = e.suggestions || [], se = !c.includes("/");
	return /* @__PURE__ */ (0, X.jsxs)("section", {
		"aria-label": hn,
		className: ke({
			padding: "none",
			className: "flex flex-col gap-4 px-6 py-5 max-sm:px-4"
		}),
		children: [
			/* @__PURE__ */ (0, X.jsx)("h3", {
				className: "text-title-2-medium text-text-primary",
				children: hn
			}),
			/* @__PURE__ */ (0, X.jsxs)("div", {
				className: "flex flex-wrap items-end gap-2",
				children: [
					/* @__PURE__ */ (0, X.jsxs)("div", {
						ref: y,
						className: "min-w-64 grow",
						onFocus: () => m(!0),
						onBlur: (e) => {
							let t = e.relatedTarget;
							!e.currentTarget.contains(t) && !ee.current?.contains(t) && m(!1);
						},
						children: [/* @__PURE__ */ (0, X.jsx)(N, {
							"aria-label": J("follow:addCreatorSource.inputLabel"),
							placeholder: mn,
							value: i,
							leadingIcon: xt,
							enterKeyHint: "search",
							isDisabled: n,
							onChange: a,
							onCompositionStart: () => {
								s(!0), v(-1);
							},
							onCompositionEnd: (e) => {
								s(!1), a(e.currentTarget.value);
							},
							onKeyDown: R
						}), re ? /* @__PURE__ */ (0, X.jsx)(xn, {
							field: y,
							menu: ee,
							options: O,
							active: _,
							busy: L,
							onPick: I,
							onClose: ie
						}) : null]
					}),
					/* @__PURE__ */ (0, X.jsx)(Sn, {
						credentials: t,
						hidden: b,
						onHidden: x
					}),
					/* @__PURE__ */ (0, X.jsx)(u, {
						variant: "primary",
						disabled: n || !i.trim(),
						...G(ne || P.isPending),
						onClick: () => I(i),
						children: J("follow:shared.search")
					})
				]
			}),
			/* @__PURE__ */ (0, X.jsxs)("div", {
				"aria-live": "polite",
				className: "flex flex-col gap-3 empty:hidden",
				children: [ne || P.isPending ? /* @__PURE__ */ (0, X.jsx)(ve, {
					embedded: !0,
					kind: Se("follow-resolve"),
					label: ut(k) || (k?.total ? J("follow:addCreatorSource.searchProgress", {
						checked: k.checked || 0,
						count: k.total
					}) : se ? gn : _n),
					value: k?.checked,
					total: k?.total
				}) : null, w ? /* @__PURE__ */ (0, X.jsx)(z, {
					tone: "error",
					title: J("follow:addJavFeed.notCompleted"),
					children: w
				}) : null]
			}),
			B.length ? /* @__PURE__ */ (0, X.jsxs)("div", {
				className: "flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, X.jsx)(j, { children: J("follow:addCreatorSource.results") }),
					B.map((e, t) => /* @__PURE__ */ (0, X.jsx)(Cn, {
						row: e,
						at: t,
						hidden: b,
						unpicked: S,
						onPick: (e, t) => {
							let n = new Set(S);
							t ? n.delete(e) : n.add(e), C(n);
						}
					}, `${e.line}-${t}`)),
					/* @__PURE__ */ (0, X.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, X.jsx)(u, {
								variant: "secondary",
								size: "small",
								onClick: () => F(),
								children: J("follow:shared.close")
							}),
							/* @__PURE__ */ (0, X.jsx)(u, {
								variant: "primary",
								size: "small",
								disabled: n || !V.length,
								...G(ae.isPending),
								onClick: () => ae.mutate(V),
								children: J("follow:addCreatorSource.addSelected", { count: V.length })
							}),
							ae.isPending ? /* @__PURE__ */ (0, X.jsx)("span", {
								role: "status",
								className: "text-body-2-regular text-text-secondary",
								children: J("follow:addCreatorSource.addingProgress", {
									added: te,
									count: V.length
								})
							}) : null
						]
					})
				]
			}) : null,
			oe.length ? /* @__PURE__ */ (0, X.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, X.jsx)("span", {
					className: "text-body-2-regular text-text-secondary",
					children: J("follow:addCreatorSource.suggested")
				}), oe.map((e) => /* @__PURE__ */ (0, X.jsx)(u, {
					variant: "secondary",
					size: "small",
					disabled: n,
					title: e.origin ? J("follow:addCreatorSource.historyVisitsFrom", {
						count: e.visits,
						origin: e.origin
					}) : J("follow:addCreatorSource.historyVisits", { count: e.visits }),
					onClick: () => I(e.name),
					children: e.name
				}, e.name))]
			}) : null
		]
	});
}
// src/react/follow-manage/add-feed.tsx
var Tn = J("follow:addJavFeed.placeholder"), En = J("follow:addJavFeed.title");
function Dn(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e.candidates) t.has(r.id) && r.held_by && n.set(r.held_by.id, r.held_by.name);
	if (n.size > 1) return {
		text: J("follow:addJavFeed.cardsSplitAcrossPeople", { names: dt([...n.values()]) }),
		blocked: !0
	};
	let [r] = n.values();
	return r ? {
		text: J("follow:addJavFeed.willAddUnder", { name: r }),
		blocked: !1
	} : e.known ? {
		text: J("follow:addJavFeed.willAddUnderKnown", { name: e.known.name }),
		blocked: !1
	} : {
		text: J("follow:addJavFeed.willCreate", { name: e.q }),
		blocked: !1
	};
}
function On({ card: e, picked: t, onPick: n }) {
	return /* @__PURE__ */ (0, X.jsxs)("div", {
		className: "flex flex-wrap items-center gap-2",
		children: [/* @__PURE__ */ (0, X.jsx)(m, {
			isSelected: t,
			onChange: n,
			children: /* @__PURE__ */ (0, X.jsxs)("span", {
				className: "flex min-w-0 flex-wrap items-center gap-1.5",
				children: [
					/* @__PURE__ */ (0, X.jsx)("span", {
						className: "min-w-0 break-words",
						children: dt(e.names)
					}),
					e.record ? /* @__PURE__ */ (0, X.jsx)(g, {
						variant: "caption",
						color: "neutral",
						children: e.record
					}) : null,
					e.held_by ? /* @__PURE__ */ (0, X.jsx)("small", {
						className: "text-caption-1-regular text-text-secondary",
						children: J("follow:addJavFeed.alreadyUnder", { name: e.held_by.name })
					}) : null
				]
			})
		}), /* @__PURE__ */ (0, X.jsx)(T, {
			href: e.url,
			children: e.id
		})]
	});
}
function kn({ readOnly: e, toast: t, onAdded: n }) {
	let [r, i] = (0, Y.useState)(""), [a, o] = (0, Y.useState)(null), [s, c] = (0, Y.useState)(/* @__PURE__ */ new Set()), l = Jt(), d = () => {
		let t = r.trim();
		t && !e && l.run("lookup", (e) => ht(t, e), (e) => {
			o(e), c(new Set(e.suggested));
		});
	}, f = (e) => {
		e.key === "Enter" && !ze(e.nativeEvent) && (e.preventDefault(), d());
	}, p = () => {
		o(null), c(/* @__PURE__ */ new Set()), l.setError("");
	}, m = () => {
		a && l.run("follow", (e) => it(a.q, [...s], e), (e) => {
			t(e.created ? J("follow:addJavFeed.createdAndSubscribed", { name: e.entity_name }) : J("follow:addJavFeed.subscribed", { name: e.entity_name })), i(""), p(), n();
		});
	}, h = () => {
		let e = a?.known;
		e && l.run("known", (t) => at(e.id, t), () => {
			t(J("follow:addJavFeed.subscribed", { name: e.name })), i(""), p(), n();
		});
	}, g = a ? Dn(a, s) : null, _ = a && !a.candidates.length && a.known?.subscribable ? a.known : null;
	return /* @__PURE__ */ (0, X.jsxs)("section", {
		"aria-label": En,
		className: ke({
			padding: "none",
			className: "flex flex-col gap-4 px-6 py-5 max-sm:px-4"
		}),
		children: [
			/* @__PURE__ */ (0, X.jsx)("h3", {
				className: "text-title-2-medium text-text-primary",
				children: En
			}),
			/* @__PURE__ */ (0, X.jsxs)("div", {
				className: "flex flex-wrap items-end gap-2",
				children: [/* @__PURE__ */ (0, X.jsx)("div", {
					className: "min-w-64 grow",
					children: /* @__PURE__ */ (0, X.jsx)(N, {
						"aria-label": J("follow:addJavFeed.actressName"),
						placeholder: Tn,
						value: r,
						leadingIcon: xt,
						enterKeyHint: "search",
						isDisabled: e,
						onChange: i,
						onKeyDown: f
					})
				}), /* @__PURE__ */ (0, X.jsx)(u, {
					variant: "primary",
					disabled: e || !r.trim(),
					...G(l.busy === "lookup"),
					onClick: d,
					children: J("follow:shared.search")
				})]
			}),
			l.error ? /* @__PURE__ */ (0, X.jsx)(z, {
				tone: "error",
				title: J("follow:addJavFeed.notCompleted"),
				children: l.error
			}) : null,
			a ? /* @__PURE__ */ (0, X.jsxs)("div", {
				className: "flex flex-col gap-3",
				children: [
					a.unavailable ? /* @__PURE__ */ (0, X.jsx)(z, {
						tone: "warning",
						title: J("follow:addJavFeed.javdbSearchFailed"),
						children: It(a.unavailable_code ?? "", a.unavailable, a.unavailable_params)
					}) : null,
					/* @__PURE__ */ (0, X.jsx)(j, { children: J("follow:addJavFeed.javdbCards") }),
					a.candidates.length ? a.candidates.map((e) => /* @__PURE__ */ (0, X.jsx)(On, {
						card: e,
						picked: s.has(e.id),
						onPick: (t) => c((n) => {
							let r = new Set(n);
							return t ? r.add(e.id) : r.delete(e.id), r;
						})
					}, e.id)) : /* @__PURE__ */ (0, X.jsx)(M, { children: a.unavailable ? J("follow:addJavFeed.noCardsThisTime") : J("follow:addJavFeed.noJavdbMatch") }),
					a.candidates.length ? /* @__PURE__ */ (0, X.jsx)(M, {
						role: "status",
						children: s.size ? g.text : J("follow:addJavFeed.pickCardsHint")
					}) : null,
					_ ? /* @__PURE__ */ (0, X.jsx)(M, {
						role: "status",
						children: _.following ? J("follow:addJavFeed.alreadySubscribed", { name: _.name }) : J("follow:addJavFeed.canSubscribeDirectly", { name: _.name })
					}) : null,
					/* @__PURE__ */ (0, X.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, X.jsx)(u, {
								variant: "secondary",
								size: "small",
								onClick: p,
								children: J("follow:shared.close")
							}),
							a.candidates.length ? /* @__PURE__ */ (0, X.jsx)(u, {
								variant: "primary",
								size: "small",
								disabled: e || !s.size || g.blocked,
								...G(l.busy === "follow"),
								onClick: m,
								children: J("follow:addJavFeed.subscribePicked", { count: s.size })
							}) : null,
							_ && !_.following ? /* @__PURE__ */ (0, X.jsx)(u, {
								variant: "primary",
								size: "small",
								disabled: e,
								...G(l.busy === "known"),
								onClick: h,
								children: J("follow:addJavFeed.subscribeTo", { name: _.name })
							}) : null
						]
					})
				]
			}) : null
		]
	});
}
// src/react/follow-manage/alias-rename-dialog.tsx
function An({ group: e, close: t, receipt: n }) {
	return /* @__PURE__ */ (0, X.jsx)(R, {
		isOpen: !!e,
		onOpenChange: (e) => {
			e || t();
		},
		width: "form",
		label: J("follow:creatorAliases.rename"),
		children: e ? /* @__PURE__ */ (0, X.jsx)(jn, {
			group: e,
			close: t,
			receipt: n
		}, e.canonical_key) : null
	});
}
function jn({ group: t, close: n, receipt: r }) {
	let [i, a] = (0, Y.useState)(t.canonical_name), o = Jt();
	return /* @__PURE__ */ (0, X.jsxs)("form", {
		onSubmit: (e) => {
			e.preventDefault(), i.trim() && i.trim() !== t.canonical_name && o.run("rename", (e) => Dt(t.canonical_key, i.trim(), e), () => {
				q(), r(J("follow:creatorAliases.renamed", { name: i.trim() })), n();
			});
		},
		className: "flex min-h-0 flex-col gap-4 p-5",
		children: [
			/* @__PURE__ */ (0, X.jsx)(e, {
				slot: "title",
				className: "text-title-2-semibold text-text-primary",
				children: J("follow:creatorAliases.rename")
			}),
			/* @__PURE__ */ (0, X.jsxs)("p", {
				className: "text-body-2-regular wrap-anywhere text-text-secondary",
				children: [J("follow:creatorAliases.currentName"), t.canonical_name]
			}),
			/* @__PURE__ */ (0, X.jsx)(N, {
				"aria-label": J("follow:creatorAliases.displayName"),
				autoFocus: !0,
				value: i,
				onChange: a
			}),
			/* @__PURE__ */ (0, X.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, X.jsx)(j, { children: J("follow:creatorAliases.chooseExisting") }), /* @__PURE__ */ (0, X.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: t.aliases.map((e) => /* @__PURE__ */ (0, X.jsx)(u, {
						variant: "secondary",
						size: "small",
						onClick: () => a(e.name),
						children: e.name
					}, e.key))
				})]
			}),
			/* @__PURE__ */ (0, X.jsx)("p", {
				className: "text-body-2-regular text-text-secondary",
				children: J("follow:creatorAliases.renameHint")
			}),
			o.error ? /* @__PURE__ */ (0, X.jsx)(z, {
				tone: "error",
				children: o.error
			}) : null,
			/* @__PURE__ */ (0, X.jsxs)("div", {
				className: "flex flex-wrap justify-end gap-2",
				children: [/* @__PURE__ */ (0, X.jsx)(u, {
					variant: "secondary",
					onClick: n,
					children: J("follow:shared.cancel")
				}), /* @__PURE__ */ (0, X.jsx)(u, {
					type: "submit",
					variant: "primary",
					disabled: !i.trim() || i.trim() === t.canonical_name,
					...G(!!o.busy),
					children: J("follow:creatorAliases.rename")
				})]
			})
		]
	});
}
// src/react/follow-manage/alias-manager.tsx
var Mn = (e) => J("follow:creatorAliases.removeBody", { alias: e }), Nn = Wt({
	rowSelectionFeature: Mt,
	rowSortingFeature: Nt,
	rowPaginationFeature: jt,
	columnVisibilityFeature: Re,
	sortedRowModel: dn(),
	paginatedRowModel: un()
}), Pn = Nn, Fn = {
	id: "select",
	label: J("follow:shared.select"),
	width: 48,
	min: 48,
	max: 48,
	required: !0
}, In = {
	id: "canonical",
	label: J("follow:creatorAliases.displayName"),
	width: 280,
	min: 240,
	required: !0,
	flex: !0
}, Ln = [
	Fn,
	In,
	{
		id: "alias",
		label: J("follow:creatorAliases.platformAlias"),
		width: 240
	},
	{
		id: "evidence",
		label: J("follow:creatorAliases.evidence"),
		width: 320
	},
	{
		id: "actions",
		label: J("follow:shared.actions"),
		width: 112
	}
], Rn = [
	Fn,
	In,
	{
		id: "aliases",
		label: J("follow:creatorAliases.platformAlias"),
		width: 400
	},
	{
		id: "actions",
		label: J("follow:shared.actions"),
		width: 184,
		min: 168
	}
], zn = (e) => e.alias;
function Bn(e, t, n) {
	let r = n ? `name:${n}` : "", i = r && e.find((e) => e.author_key === r) || e.find((e) => e.author_name === t || e.entity_name === t);
	return i ? e.filter((e) => e.author_key === i.author_key) : [];
}
function Vn({ sources: e, name: t, canonicalKey: n }) {
	return /* @__PURE__ */ (0, X.jsxs)("span", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, X.jsx)(an, {
			group: Bn(e, t, n),
			name: t
		}), /* @__PURE__ */ (0, X.jsx)("b", {
			className: "text-body-medium",
			children: t
		})]
	});
}
function Hn({ groups: e, suggestions: t, sources: s = [], readOnly: c, toast: l }) {
	let d = nn("alias-suggestions", Ln), f = nn("alias-saved", Rn), [p, g] = (0, Y.useState)(null), [_, v] = (0, Y.useState)({}), [y, T] = (0, Y.useState)({});
	Zt(() => {
		v({}), T({});
	}), (0, Y.useEffect)(() => {
		(Object.values(_).some(Boolean) || Object.values(y).some(Boolean)) && qe();
	}, [_, y]);
	let te = fn(() => v({})), E = fn(() => T({})), [D, O] = (0, Y.useState)([]), [k, ne] = (0, Y.useState)([]), [A, M] = (0, Y.useState)({
		pageIndex: 0,
		pageSize: 20
	}), [P, F] = (0, Y.useState)({
		pageIndex: 0,
		pageSize: 20
	}), I = tn(t, {
		canonical: {
			values: (e) => e.canonical,
			option: (e) => ({ leading: () => /* @__PURE__ */ (0, X.jsx)(an, {
				group: Bn(s, e),
				name: e,
				small: !0
			}) })
		},
		alias: {
			values: (e) => e.alias,
			option: (e, t) => ({ leading: () => /* @__PURE__ */ (0, X.jsx)(an, {
				group: Bn(s, t?.canonical ?? e),
				name: e,
				small: !0
			}) })
		},
		evidence: { values: (e) => It(e.evidence_code ?? "", e.evidence, e.evidence_params) }
	}, () => M((e) => ({
		...e,
		pageIndex: 0
	}))), L = tn(e, {
		canonical: {
			values: (e) => e.canonical_name,
			option: (e, t) => ({ leading: () => /* @__PURE__ */ (0, X.jsx)(an, {
				group: Bn(s, e, t?.canonical_key),
				name: e,
				small: !0
			}) })
		},
		aliases: {
			values: (e) => e.aliases.map((e) => e.name),
			option: (e, t) => ({ leading: () => /* @__PURE__ */ (0, X.jsx)(an, {
				group: Bn(s, t?.canonical_name ?? e, t?.canonical_key),
				name: e,
				small: !0
			}) })
		}
	}, () => F((e) => ({
		...e,
		pageIndex: 0
	}))), re = {
		...A,
		pageIndex: Math.min(A.pageIndex, Math.max(0, Math.ceil(I.items.length / A.pageSize) - 1))
	}, ie = {
		...P,
		pageIndex: Math.min(P.pageIndex, Math.max(0, Math.ceil(L.items.length / P.pageSize) - 1))
	}, [R, z] = (0, Y.useState)(""), [V, ae] = (0, Y.useState)(""), [oe, se] = (0, Y.useState)(""), ce = Xt({
		mutationFn: async (e) => {
			let t = 0;
			for (let n of e) {
				try {
					await Ce(n.canonical, n.alias);
				} catch (n) {
					throw t && q(), Error(J("follow:creatorAliases.mergePartialError", {
						error: K(n),
						count: e.length - t
					}));
				}
				t += 1;
			}
			return {
				done: t,
				items: e
			};
		},
		onSuccess: () => {
			z(""), v({}), q();
		},
		onError: (e) => z(K(e))
	}), H = Xt({
		mutationFn: (e) => Ce(e.canonical, e.alias),
		onSuccess: () => {
			z(""), ae(""), se(""), q(), l(J("follow:creatorAliases.saved"));
		},
		onError: (e) => z(K(e))
	}), U = Xt({
		mutationFn: async (e) => {
			let t = typeof e == "string" ? [e] : e, n = 0;
			try {
				for (let e of t) await wt(e), n += 1;
			} catch (e) {
				throw Error(J("follow:creatorAliases.removePartialError", {
					error: K(e),
					removed: n,
					count: t.length - n
				}));
			} finally {
				q();
			}
		},
		onSuccess: (e, t) => {
			z(""), T({}), typeof t == "string" && l(J("follow:creatorAliases.removed"));
		},
		onError: (e) => z(K(e))
	}), ue = {
		receipt: l,
		failure: (e) => z(K(e))
	}, de = (e, t) => ({
		key: e ? "merge-all" : "merge",
		reversal: "undo",
		label: J(e ? "follow:creatorAliases.mergeAllCount" : "follow:creatorAliases.mergeSelectedCount", { count: t }),
		confirm: (t) => ({
			title: J(e ? "follow:creatorAliases.mergeAllTitle" : "follow:creatorAliases.mergeSelectedTitle"),
			body: J("follow:creatorAliases.mergeBody", {
				count: t.length,
				pairs: dt(t.map((e) => J("follow:creatorAliases.mergePair", {
					alias: Ct(e.alias),
					canonical: Ct(e.canonical)
				})))
			}),
			confirmLabel: J(e ? "follow:creatorAliases.mergeAllConfirm" : "follow:creatorAliases.mergeSelectedConfirm")
		}),
		run: async (e) => {
			let { done: t } = await ce.mutateAsync([...e]);
			return async () => {
				for (let n of e.slice(0, t)) await wt(n.alias);
				await q();
			};
		},
		receipt: (e) => J("follow:creatorAliases.merged", { count: e.length })
	}), fe = (e, t) => {
		e.length && Pt(de(t, e.length), e, ue).catch(ue.failure);
	}, pe = {
		key: "remove",
		reversal: "undo",
		label: J("follow:creatorAliases.removeSelectedCount", { count: 0 }),
		confirm: (e) => ({
			title: J("follow:creatorAliases.removeSelectedTitle"),
			body: J("follow:creatorAliases.removeSelectedBody", { count: e.length }),
			items: e.map((e) => e.name),
			confirmLabel: J("follow:creatorAliases.removeSelectedConfirm")
		}),
		run: async (e) => (await U.mutateAsync(e.map((e) => e.name)), async () => {
			for (let t of e) await Ce(t.canonical, t.name);
			await q();
		}),
		receipt: () => J("follow:creatorAliases.removed")
	}, ve = (e) => void Be({
		title: J("follow:creatorAliases.removeTitle"),
		body: Mn(e),
		confirmLabel: J("follow:creatorAliases.removeTitle"),
		onConfirm: () => U.mutateAsync(e)
	}), W = (0, Y.useRef)({
		sources: s,
		readOnly: c,
		merging: ce.isPending,
		removing: U.isPending,
		merge: fe,
		remove: ve,
		rename: g
	});
	W.current = {
		sources: s,
		readOnly: c,
		merging: ce.isPending,
		removing: U.isPending,
		merge: fe,
		remove: ve,
		rename: g
	};
	let ye = (0, Y.useMemo)(() => {
		let e = Ve();
		return e.columns([
			e.display({
				id: "select",
				header: (e) => /* @__PURE__ */ (0, X.jsx)(_e, {
					table: e.table,
					label: J("follow:creatorAliases.selectAllPending")
				}),
				cell: (e) => /* @__PURE__ */ (0, X.jsx)(m, {
					slot: null,
					isSelected: e.row.getIsSelected(),
					"aria-label": J("follow:creatorAliases.selectPendingRow", {
						alias: e.row.original.alias,
						name: e.row.original.canonical
					}),
					onChange: (t) => e.row.toggleSelected(t)
				})
			}),
			e.accessor("canonical", {
				header: J("follow:creatorAliases.displayName"),
				cell: (e) => /* @__PURE__ */ (0, X.jsx)(Vn, {
					sources: W.current.sources,
					name: e.getValue()
				})
			}),
			e.accessor("alias", {
				header: J("follow:creatorAliases.platformAlias"),
				cell: (e) => e.getValue()
			}),
			e.accessor((e) => It(e.evidence_code ?? "", e.evidence, e.evidence_params), {
				id: "evidence",
				header: J("follow:creatorAliases.evidence"),
				cell: (e) => /* @__PURE__ */ (0, X.jsx)("span", {
					className: "text-body-2-regular text-text-secondary",
					children: e.getValue()
				})
			}),
			e.display({
				id: "actions",
				header: J("follow:shared.actions"),
				cell: (e) => /* @__PURE__ */ (0, X.jsx)(u, {
					variant: "secondary",
					size: "small",
					disabled: W.current.readOnly,
					...G(W.current.merging),
					onClick: () => W.current.merge([e.row.original], !1),
					children: J("follow:shared.merge")
				})
			})
		]);
	}, []), xe = (0, Y.useMemo)(() => {
		let e = Ve();
		return e.columns([
			e.display({
				id: "select",
				header: ({ table: e }) => /* @__PURE__ */ (0, X.jsx)(_e, {
					table: e,
					label: J("follow:creatorAliases.selectAllSaved")
				}),
				cell: ({ row: e }) => /* @__PURE__ */ (0, X.jsx)(m, {
					slot: null,
					"aria-label": J("follow:creatorAliases.selectSavedRow", { name: e.original.canonical_name }),
					isSelected: e.getIsSelected(),
					onChange: (t) => e.toggleSelected(t)
				})
			}),
			e.accessor("canonical_name", {
				id: "canonical",
				header: J("follow:creatorAliases.displayName"),
				cell: (e) => /* @__PURE__ */ (0, X.jsx)(Vn, {
					sources: W.current.sources,
					name: e.getValue(),
					canonicalKey: e.row.original.canonical_key
				})
			}),
			e.accessor("aliases", {
				header: J("follow:creatorAliases.platformAlias"),
				sortFn: (e, t) => e.original.aliases.map((e) => e.name).join(" ").localeCompare(t.original.aliases.map((e) => e.name).join(" "), "zh-CN"),
				cell: (e) => /* @__PURE__ */ (0, X.jsx)("span", {
					className: "flex flex-wrap items-center gap-1.5",
					children: e.getValue().map((e) => /* @__PURE__ */ (0, X.jsxs)("span", {
						className: "inline-flex items-center gap-1 rounded-md bg-background-secondary-default px-1.5 py-1 text-caption-1-medium text-text-secondary",
						children: [e.name, /* @__PURE__ */ (0, X.jsx)(u, {
							variant: "ghost",
							size: "xs",
							iconOnly: !0,
							leadingIcon: B,
							"aria-label": J("follow:creatorAliases.removeAliasNamed", { name: e.name }),
							disabled: W.current.readOnly,
							...G(W.current.removing),
							onClick: () => W.current.remove(e.name)
						})]
					}, e.key))
				})
			}),
			e.display({
				id: "actions",
				header: J("follow:shared.actions"),
				cell: ({ row: e }) => /* @__PURE__ */ (0, X.jsx)(u, {
					variant: "secondary",
					size: "small",
					disabled: W.current.readOnly,
					"aria-label": J("follow:creatorAliases.renameRowLabel", { name: e.original.canonical_name }),
					onClick: () => W.current.rename(e.original),
					children: J("follow:creatorAliases.rename")
				})
			})
		]);
	}, []), Se = en({
		features: Nn,
		data: I.items,
		columns: ye,
		getRowId: zn,
		state: {
			rowSelection: _,
			sorting: D,
			pagination: re,
			columnVisibility: d.visibility
		},
		onColumnVisibilityChange: d.change,
		onRowSelectionChange: (e) => {
			te(), v(e);
		},
		onSortingChange: (e) => {
			O(e), M((e) => ({
				...e,
				pageIndex: 0
			}));
		},
		onPaginationChange: M,
		enableRowSelection: !0
	}), we = en({
		features: Pn,
		data: L.items,
		columns: xe,
		getRowId: (e) => e.canonical_key,
		state: {
			rowSelection: y,
			sorting: k,
			pagination: ie,
			columnVisibility: f.visibility
		},
		onColumnVisibilityChange: f.change,
		onRowSelectionChange: (e) => {
			E(), T(e);
		},
		enableRowSelection: !0,
		onSortingChange: (e) => {
			ne(e), F((e) => ({
				...e,
				pageIndex: 0
			}));
		},
		onPaginationChange: F
	}), Te = t.filter((e) => _[zn(e)]), Ee = e.filter((e) => y[e.canonical_key]).flatMap((e) => e.aliases.map((t) => ({
		name: t.name,
		canonical: e.canonical_name
	}))), De = G(ce.isPending);
	return /* @__PURE__ */ (0, X.jsxs)("div", {
		className: ke({
			padding: "none",
			className: "flex flex-col gap-4 px-6 py-5 max-sm:px-4"
		}),
		children: [
			/* @__PURE__ */ (0, X.jsx)("h3", {
				className: "text-title-2-medium text-text-primary",
				children: J("follow:creatorAliases.title")
			}),
			/* @__PURE__ */ (0, X.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, X.jsx)(j, { children: J("follow:creatorAliases.addManually") }), /* @__PURE__ */ (0, X.jsxs)("div", {
					className: "flex flex-wrap items-end gap-2",
					children: [
						/* @__PURE__ */ (0, X.jsx)(N, {
							"aria-label": J("follow:creatorAliases.displayName"),
							placeholder: J("follow:creatorAliases.displayNamePlaceholder"),
							value: V,
							onChange: ae,
							isDisabled: c,
							className: "w-56"
						}),
						/* @__PURE__ */ (0, X.jsx)(N, {
							"aria-label": J("follow:creatorAliases.platformAlias"),
							placeholder: J("follow:creatorAliases.platformAlias"),
							value: oe,
							onChange: se,
							isDisabled: c,
							className: "w-56"
						}),
						/* @__PURE__ */ (0, X.jsx)(u, {
							variant: "primary",
							disabled: c || !V.trim() || !oe.trim(),
							...G(H.isPending),
							onClick: () => H.mutate({
								canonical: V.trim(),
								alias: oe.trim()
							}),
							children: J("follow:creatorAliases.saveAlias")
						})
					]
				})]
			}),
			R ? /* @__PURE__ */ (0, X.jsx)(w, { children: R }) : null,
			t.length ? /* @__PURE__ */ (0, X.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, X.jsxs)("div", {
						"data-responsive-toolbar": "",
						children: [/* @__PURE__ */ (0, X.jsxs)("div", {
							"data-toolbar-heading": "",
							children: [/* @__PURE__ */ (0, X.jsx)(j, { children: J("follow:creatorAliases.pending") }), /* @__PURE__ */ (0, X.jsx)("span", {
								className: "text-body-2-regular text-text-secondary",
								children: J("follow:creatorAliases.groupCount", { count: I.items.length })
							})]
						}), /* @__PURE__ */ (0, X.jsxs)("div", {
							"data-toolbar-actions": "",
							children: [
								/* @__PURE__ */ (0, X.jsx)(u, {
									variant: "primary",
									size: "small",
									disabled: c,
									...De,
									onClick: () => fe(I.items, !0),
									children: J("follow:creatorAliases.mergeAllCount", { count: I.items.length })
								}),
								/* @__PURE__ */ (0, X.jsx)(x, {
									label: J("follow:creatorAliases.pendingTable"),
									sorting: D,
									options: [
										{
											id: "canonical",
											label: J("follow:creatorAliases.displayName")
										},
										{
											id: "alias",
											label: J("follow:creatorAliases.platformAlias")
										},
										{
											id: "evidence",
											label: J("follow:creatorAliases.evidence")
										}
									],
									onChange: (e) => {
										O(e), M((e) => ({
											...e,
											pageIndex: 0
										}));
									}
								}),
								/* @__PURE__ */ (0, X.jsx)(he, {
									preferences: d,
									label: J("follow:creatorAliases.pendingTable")
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, X.jsx)(le, {
						label: J("follow:creatorAliases.pendingBulkActions"),
						visible: Te.length > 0,
						count: J("follow:creatorAliases.groupsSelected", { count: Te.length }),
						actions: [{
							action: de(!1, Te.length),
							items: Te,
							host: ue,
							disabled: c || ce.isPending
						}],
						children: /* @__PURE__ */ (0, X.jsx)(u, {
							variant: "ghost",
							size: "small",
							onClick: Ye,
							children: J("follow:shared.clearSelection")
						})
					}),
					/* @__PURE__ */ (0, X.jsx)(b, {
						follow: !0,
						preferences: d,
						onRowClick: (e) => Se.getRow(e)?.toggleSelected(),
						children: /* @__PURE__ */ (0, X.jsxs)(me, {
							"aria-label": J("follow:creatorAliases.pendingTable"),
							size: "sm",
							sortDescriptor: D[0] ? {
								column: D[0].id,
								direction: D[0].desc ? "descending" : "ascending"
							} : void 0,
							onSortChange: (e) => Se.getColumn(String(e.column))?.toggleSorting(e.direction === "descending"),
							children: [/* @__PURE__ */ (0, X.jsxs)(o, { children: [Se.getHeaderGroups()[0].headers.map((e) => /* @__PURE__ */ (0, X.jsx)(r, {
								id: e.id,
								isRowHeader: e.column.id === "canonical",
								allowsSorting: e.column.getCanSort(),
								...d.columnProps(e.id),
								children: ({ sortDirection: t }) => /* @__PURE__ */ (0, X.jsxs)(X.Fragment, { children: [/* @__PURE__ */ (0, X.jsxs)("span", {
									className: "flex items-center gap-0.5",
									children: [I.header(e.id, String(e.column.columnDef.header)) ?? rt(e.column.columnDef.header, e.getContext()), e.column.getCanSort() ? /* @__PURE__ */ (0, X.jsx)("span", {
										"data-sort-indicator": !0,
										"data-direction": t || void 0,
										children: /* @__PURE__ */ (0, X.jsx)(h, {})
									}) : null]
								}), /* @__PURE__ */ (0, X.jsx)(ge, {
									preferences: d,
									id: e.id
								})] })
							}, e.id)), /* @__PURE__ */ (0, X.jsx)(r, {
								id: "remaining-space",
								"aria-label": J("follow:shared.rowSpacer"),
								"data-table-space": "",
								width: d.spaceWidth,
								minWidth: 0
							})] }), /* @__PURE__ */ (0, X.jsx)(n, {
								renderEmptyState: () => J("shell:dataTable.empty"),
								children: Se.getRowModel().rows.map((e) => /* @__PURE__ */ (0, X.jsxs)(i, {
									id: e.id,
									"data-board-selected": e.getIsSelected() || void 0,
									children: [e.getVisibleCells().map((e) => /* @__PURE__ */ (0, X.jsx)(a, { children: rt(e.column.columnDef.cell, e.getContext()) }, e.id)), /* @__PURE__ */ (0, X.jsx)(a, { "data-table-space": "" })]
								}, e.id))
							})]
						})
					}),
					/* @__PURE__ */ (0, X.jsx)(ee, {
						label: J("follow:creatorAliases.pendingTable"),
						unit: J("follow:creatorAliases.groupUnit"),
						total: I.items.length,
						pagination: re,
						onChange: M
					})
				]
			}) : null,
			/* @__PURE__ */ (0, X.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, X.jsxs)("div", {
						"data-responsive-toolbar": "",
						children: [/* @__PURE__ */ (0, X.jsxs)("div", {
							"data-toolbar-heading": "",
							children: [/* @__PURE__ */ (0, X.jsx)(j, { children: J("follow:creatorAliases.savedAliases") }), /* @__PURE__ */ (0, X.jsx)("span", {
								className: "text-body-2-regular text-text-secondary",
								children: J("follow:creatorAliases.groupCount", { count: L.items.length })
							})]
						}), /* @__PURE__ */ (0, X.jsxs)("div", {
							"data-toolbar-actions": "",
							children: [/* @__PURE__ */ (0, X.jsx)(x, {
								label: J("follow:creatorAliases.saved"),
								sorting: k,
								options: [{
									id: "canonical",
									label: J("follow:creatorAliases.displayName")
								}, {
									id: "aliases",
									label: J("follow:creatorAliases.platformAlias")
								}],
								onChange: (e) => {
									ne(e), F((e) => ({
										...e,
										pageIndex: 0
									}));
								}
							}), /* @__PURE__ */ (0, X.jsx)(he, {
								preferences: f,
								label: J("follow:creatorAliases.saved")
							})]
						})]
					}),
					/* @__PURE__ */ (0, X.jsx)(le, {
						label: J("follow:creatorAliases.savedBulkActions"),
						visible: Ee.length > 0,
						count: J("follow:creatorAliases.aliasesSelected", { count: Ee.length }),
						actions: [{
							action: {
								...pe,
								label: J("follow:creatorAliases.removeSelectedCount", { count: Ee.length })
							},
							items: Ee,
							host: ue,
							disabled: c || U.isPending
						}],
						children: /* @__PURE__ */ (0, X.jsx)(u, {
							variant: "ghost",
							size: "small",
							onClick: Ye,
							children: J("follow:shared.clearSelection")
						})
					}),
					e.length ? /* @__PURE__ */ (0, X.jsxs)(X.Fragment, { children: [/* @__PURE__ */ (0, X.jsx)(b, {
						follow: !0,
						preferences: f,
						onRowClick: (e) => we.getRow(e)?.toggleSelected(),
						children: /* @__PURE__ */ (0, X.jsxs)(me, {
							"aria-label": J("follow:creatorAliases.saved"),
							size: "sm",
							sortDescriptor: k[0] ? {
								column: k[0].id,
								direction: k[0].desc ? "descending" : "ascending"
							} : void 0,
							onSortChange: (e) => we.getColumn(String(e.column))?.toggleSorting(e.direction === "descending"),
							children: [/* @__PURE__ */ (0, X.jsxs)(o, { children: [we.getHeaderGroups()[0].headers.map((e) => /* @__PURE__ */ (0, X.jsx)(r, {
								id: e.id,
								isRowHeader: e.column.id === "canonical",
								allowsSorting: e.column.getCanSort(),
								...f.columnProps(e.id),
								children: ({ sortDirection: t }) => /* @__PURE__ */ (0, X.jsxs)(X.Fragment, { children: [/* @__PURE__ */ (0, X.jsxs)("span", {
									className: "flex items-center gap-0.5",
									children: [L.header(e.id, String(e.column.columnDef.header)) ?? rt(e.column.columnDef.header, e.getContext()), e.column.getCanSort() ? /* @__PURE__ */ (0, X.jsx)("span", {
										"data-sort-indicator": !0,
										"data-direction": t || void 0,
										children: /* @__PURE__ */ (0, X.jsx)(h, {})
									}) : null]
								}), /* @__PURE__ */ (0, X.jsx)(ge, {
									preferences: f,
									id: e.id
								})] })
							}, e.id)), /* @__PURE__ */ (0, X.jsx)(r, {
								id: "remaining-space",
								"aria-label": J("follow:shared.rowSpacer"),
								"data-table-space": "",
								width: f.spaceWidth,
								minWidth: 0
							})] }), /* @__PURE__ */ (0, X.jsx)(n, {
								renderEmptyState: () => J("shell:dataTable.empty"),
								children: we.getRowModel().rows.map((e) => /* @__PURE__ */ (0, X.jsxs)(i, {
									id: e.id,
									"data-board-selected": e.getIsSelected() || void 0,
									children: [e.getVisibleCells().map((e) => /* @__PURE__ */ (0, X.jsx)(a, { children: rt(e.column.columnDef.cell, e.getContext()) }, e.id)), /* @__PURE__ */ (0, X.jsx)(a, { "data-table-space": "" })]
								}, e.id))
							})]
						})
					}), /* @__PURE__ */ (0, X.jsx)(ee, {
						label: J("follow:creatorAliases.saved"),
						unit: J("follow:creatorAliases.groupUnit"),
						total: L.items.length,
						pagination: ie,
						onChange: F
					})] }) : /* @__PURE__ */ (0, X.jsx)(C, {
						size: "compact",
						icon: be,
						title: J("follow:creatorAliases.emptyTitle"),
						actions: c ? void 0 : /* @__PURE__ */ (0, X.jsx)(S, {
							target: `input[aria-label="${J("follow:creatorAliases.displayName")}"]`,
							children: J("follow:creatorAliases.addAlias")
						}),
						children: J("follow:creatorAliases.emptyBody")
					})
				]
			}),
			/* @__PURE__ */ (0, X.jsx)(An, {
				group: p,
				close: () => g(null),
				receipt: l
			})
		]
	});
}
// src/react/follow-manage/feed-sources.tsx
var Un = Wt({
	rowPaginationFeature: jt,
	rowSelectionFeature: Mt,
	rowSortingFeature: Nt,
	columnVisibilityFeature: Re,
	sortedRowModel: dn(),
	paginatedRowModel: un()
}), Wn = {
	select: J("follow:shared.select"),
	name: J("follow:shared.name"),
	kind: J("follow:shared.type"),
	origin: J("follow:followFeed.filterKindSource"),
	status: J("follow:shared.status"),
	interval: J("follow:feedSources.colInterval"),
	fetched: J("follow:feedSources.colLastFetched"),
	fresh: J("follow:feedSources.colLastAdded"),
	actions: J("follow:shared.actions")
}, Gn = Object.entries(Wn).map(([e, t]) => ({
	id: e,
	label: t,
	width: e === "select" ? 48 : e === "name" ? 300 : e === "actions" ? 208 : e === "fetched" ? 200 : e === "origin" ? 184 : 160,
	min: e === "select" ? 48 : e === "actions" ? 200 : e === "name" ? 300 : 112,
	max: e === "select" ? 48 : e === "name" ? 2e3 : 800,
	flex: e === "name",
	required: e === "select" || e === "name"
})), Kn = () => St.invalidateQueries({
	queryKey: te,
	exact: !0
}), Z = (e) => e.name || e.url, qn = (e) => e.kind.startsWith("javdb") ? "javdb" : e.kind.startsWith("dmm") ? "dmm" : Jn(e.url);
function Jn(e) {
	try {
		return new URL(e).hostname.replace(/^www\./, "");
	} catch {
		return e;
	}
}
function Yn({ source: e }) {
	return e.enabled ? e.last_error ? /* @__PURE__ */ (0, X.jsx)(g, {
		variant: "caption",
		color: "rose",
		children: J("follow:feedSources.fetchFailed")
	}) : e.last_fetched_at ? /* @__PURE__ */ (0, X.jsx)(g, {
		variant: "caption",
		color: "lime",
		children: J("follow:shared.ok")
	}) : /* @__PURE__ */ (0, X.jsx)(g, {
		variant: "caption",
		color: "gray",
		children: J("follow:feedSources.notChecked")
	}) : /* @__PURE__ */ (0, X.jsx)(g, {
		variant: "caption",
		color: "gray",
		children: J("follow:shared.paused")
	});
}
function Xn({ source: e }) {
	let t = e.entity_kind === "studio", [n, r] = (0, Y.useState)(!1);
	if ((0, Y.useEffect)(() => {
		r(!1);
	}, [e.entity_id, e.logo_version]), t && e.has_logo && !n) {
		let t = `/logo?studio=${encodeURIComponent(Z(e))}&variant=icon${e.logo_version ? `&v=${encodeURIComponent(e.logo_version)}` : ""}`;
		return /* @__PURE__ */ (0, X.jsx)("span", {
			"aria-hidden": !0,
			className: `relative inline-grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-background-tertiary-default ${F}`,
			children: /* @__PURE__ */ (0, X.jsx)("img", {
				src: t,
				alt: "",
				className: "size-full object-contain",
				loading: "lazy",
				decoding: "async",
				onError: () => r(!0)
			})
		});
	}
	let i = !t && e.entity_id ? {
		id: e.entity_id,
		has_image: !!e.has_image,
		image_version: e.image_version,
		avatar_focus: e.avatar_focus
	} : null;
	return /* @__PURE__ */ (0, X.jsx)("span", {
		"aria-hidden": !0,
		className: `relative inline-grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-media-placeholder text-caption-1-semibold text-text-secondary ${F}`,
		dangerouslySetInnerHTML: { __html: Oe(Z(e), i, null, "performer") }
	});
}
var Zn = (e, t) => e.entity_id !== null && t.has(e.entity_id) && e.page_name && e.page_name !== e.name ? e.page_name : "";
function Qn(e) {
	let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
	for (let { entity_id: r } of e) r !== null && (t.has(r) ? n.add(r) : t.add(r));
	return n;
}
function $n(e, t) {
	let n = e.length === 1 ? e[0] : null;
	return Be({
		title: n ? J("follow:feedSources.removeOne") : J("follow:feedSources.removeMany", { count: e.length }),
		body: n ? J("follow:feedSources.removeOneBody", { name: Z(n) }) : J("follow:feedSources.removeManyBody"),
		confirmLabel: J(n ? "follow:feedSources.removeOne" : "follow:feedSources.removeSelected"),
		danger: !0,
		holdToConfirm: !0,
		onConfirm: t
	});
}
function er({ readOnly: e, toast: t, onAdd: s, selection: c }) {
	let l = Qt({
		queryKey: te,
		queryFn: ({ signal: e }) => $e(e)
	}), d = Jt(), p = nn("jav-feeds", Gn), g = l.data, _ = (0, Y.useMemo)(() => g?.sources ?? [], [g]), [v, S] = (0, Y.useState)(/* @__PURE__ */ new Set()), T = c?.ids ?? v, E = c?.onChange ?? S, [D, O] = (0, Y.useState)(1), [k, ne] = (0, Y.useState)(20), [A, j] = (0, Y.useState)([]), M = tn(_, {
		name: {
			values: Z,
			option: (e, t) => ({ leading: t && /* @__PURE__ */ (0, X.jsx)(y, { person: {
				...t,
				id: t.entity_id,
				name: e
			} }) })
		},
		kind: {
			values: (e) => Le(e, "kind_label"),
			option: (e, t) => ({ leading: t && /* @__PURE__ */ (0, X.jsx)(U, { site: qn(t) }) })
		},
		origin: {
			values: (e) => Jn(e.url),
			option: (e, t) => ({ leading: /* @__PURE__ */ (0, X.jsx)(U, { site: t ? qn(t) : e }) })
		},
		status: { values: (e) => e.enabled ? e.last_error ? J("follow:feedSources.fetchFailed") : e.last_fetched_at ? J("follow:shared.ok") : J("follow:feedSources.notChecked") : J("follow:shared.paused") },
		interval: { values: (e) => Xe(e.interval_minutes) }
	}, () => O(1)), N = yt(M.items.length, k, D);
	(0, Y.useEffect)(() => {
		O((e) => Math.min(e, N.pages));
	}, [N.pages]), (0, Y.useEffect)(() => {
		E((e) => {
			let t = new Set(_.map((e) => e.id)), n = new Set([...e].filter((e) => t.has(e)));
			return n.size === e.size ? e : n;
		});
	}, [_, E]);
	let P = Xt({
		mutationFn: async (e) => {
			let t = await gt(e.ids, 4, async (t) => {
				e.action === "remove" ? await Tt(t) : await Lt(t, e.action === "enabled");
			});
			return {
				...e,
				results: t
			};
		},
		onSuccess: (e) => {
			let t = e.results.filter((e) => !e.ok);
			if (E(/* @__PURE__ */ new Set()), Kn(), t.length) {
				let e = t[0];
				d.setError(J("follow:feedSources.writeFailed", {
					count: t.length,
					error: e.ok ? "" : K(e.error)
				}));
			}
		},
		onError: (e) => d.setError(K(e))
	}), F = {
		receipt: t,
		failure: (e) => d.setError(K(e))
	}, L = (e) => ({
		key: e ? "enable" : "pause",
		label: J(e ? "follow:shared.enable" : "follow:shared.pause"),
		reversal: "undo",
		confirm: (t) => ({
			title: J(e ? "follow:feedSources.enableMany" : "follow:feedSources.pauseMany"),
			body: J(e ? "follow:feedSources.enableManyBody" : "follow:feedSources.pauseManyBody", { count: t.length })
		}),
		run: async (t) => {
			let n = t.filter((t) => t.enabled !== e), { results: r } = await P.mutateAsync({
				ids: n.map((e) => e.id),
				action: e ? "enabled" : "paused"
			}), i = n.filter((e, t) => r[t]?.ok);
			return async () => {
				await gt(i.map((e) => e.id), 4, (t) => Lt(t, !e)), await Kn();
			};
		},
		receipt: (t) => J(e ? "follow:feedSources.enabledMany" : "follow:feedSources.pausedMany", { count: t.length })
	}), re = {
		key: "remove",
		label: J("follow:shared.remove"),
		reversal: "irreversible",
		danger: !0,
		holdToConfirm: !0,
		confirm: (e) => ({
			title: J("follow:feedSources.removeMany", { count: e.length }),
			danger: !0,
			body: J("follow:feedSources.removeManyBody"),
			confirmLabel: J("follow:feedSources.removeSelected")
		}),
		run: async (e) => {
			await P.mutateAsync({
				ids: e.map((e) => e.id),
				action: "remove"
			});
		},
		receipt: (e) => J("follow:feedSources.removedMany", { count: e.length })
	}, ie = (0, Y.useMemo)(() => Qn(_), [_]), R = (0, Y.useRef)({
		readOnly: e,
		shared: ie,
		busy: null,
		toggle: () => {},
		fetch: () => {},
		remove: () => {}
	});
	R.current = {
		readOnly: e,
		shared: ie,
		busy: d.busy,
		toggle: (e, t) => void d.run(`enabled-${e.id}`, (n) => Lt(e.id, t, n), () => void Kn()),
		fetch: (e) => void d.run(`check-${e.id}`, (t) => Me(t, [e.id]), () => void Kn()),
		remove: (e) => void $n([e], async () => {
			await Tt(e.id), t(J("follow:feedSources.removedOne", { name: Z(e) })), Kn();
		})
	};
	let B = (0, Y.useMemo)(() => {
		let e = Ve(), t = (e) => () => Wn[e] || e;
		return e.columns([
			e.display({
				id: "select",
				header: (e) => /* @__PURE__ */ (0, X.jsx)(_e, {
					table: e.table,
					label: J("follow:feedSources.selectPage"),
					page: !0
				}),
				cell: (e) => /* @__PURE__ */ (0, X.jsx)(m, {
					slot: null,
					isSelected: e.row.getIsSelected(),
					onChange: (t) => e.row.toggleSelected(t),
					"aria-label": J("follow:shared.selectNamed", { name: Z(e.row.original) })
				})
			}),
			e.accessor(Z, {
				id: "name",
				header: t("name"),
				cell: (e) => {
					let t = Zn(e.row.original, R.current.shared);
					return /* @__PURE__ */ (0, X.jsxs)("span", {
						className: "flex items-center gap-2 whitespace-nowrap text-body-medium text-text-primary",
						children: [
							/* @__PURE__ */ (0, X.jsx)(Xn, { source: e.row.original }),
							e.getValue(),
							t ? /* @__PURE__ */ (0, X.jsx)("span", {
								className: "text-body-2-regular text-text-secondary",
								title: J("follow:feedSources.aliasTitle", { alias: t }),
								children: t
							}) : null
						]
					});
				}
			}),
			e.accessor((e) => Le(e, "kind_label"), {
				id: "kind",
				header: t("kind"),
				cell: (e) => /* @__PURE__ */ (0, X.jsx)("span", {
					className: "whitespace-nowrap",
					children: e.getValue()
				})
			}),
			e.accessor((e) => e.url, {
				id: "origin",
				header: t("origin"),
				cell: (e) => /* @__PURE__ */ (0, X.jsxs)("a", {
					href: e.getValue(),
					target: "_blank",
					rel: "noopener noreferrer",
					title: J("follow:followDetail.viewOnSite"),
					className: "max-w-full text-text-primary underline-offset-2 hover:underline",
					children: [/* @__PURE__ */ (0, X.jsx)(ue, {
						site: qn(e.row.original),
						label: Jn(e.getValue())
					}), /* @__PURE__ */ (0, X.jsx)(ye, {
						"aria-hidden": !0,
						className: "size-(--icon-inline) shrink-0"
					})]
				})
			}),
			e.accessor((e) => e.last_error ? J("follow:feedSources.fetchFailed") : e.enabled ? J("follow:shared.enabled") : J("follow:shared.paused"), {
				id: "status",
				header: t("status"),
				cell: (e) => /* @__PURE__ */ (0, X.jsx)(Yn, { source: e.row.original })
			}),
			e.accessor((e) => e.interval_minutes, {
				id: "interval",
				header: t("interval"),
				cell: (e) => /* @__PURE__ */ (0, X.jsx)("span", {
					className: "whitespace-nowrap",
					children: Xe(e.getValue())
				})
			}),
			e.accessor((e) => e.last_fetched_at && Date.parse(e.last_fetched_at) || 0, {
				id: "fetched",
				header: t("fetched"),
				cell: (e) => /* @__PURE__ */ (0, X.jsx)("span", {
					className: "whitespace-nowrap tabular-nums",
					children: e.row.original.last_fetched_at ? mt(e.row.original.last_fetched_at) : J("follow:feedSources.neverFetched")
				})
			}),
			e.accessor((e) => e.last_new_count, {
				id: "fresh",
				header: t("fresh"),
				cell: (e) => /* @__PURE__ */ (0, X.jsx)("span", {
					className: "whitespace-nowrap tabular-nums",
					children: J("follow:feedSources.itemCount", { count: e.getValue() })
				})
			}),
			e.display({
				id: "actions",
				header: t("actions"),
				cell: (e) => /* @__PURE__ */ (0, X.jsxs)("span", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, X.jsx)(pe, {
							"aria-label": J("follow:shared.enableNamed", { name: Z(e.row.original) }),
							isSelected: e.row.original.enabled,
							isDisabled: R.current.readOnly,
							onChange: (t) => R.current.toggle(e.row.original, t)
						}),
						/* @__PURE__ */ (0, X.jsx)(u, {
							variant: "secondary",
							size: "small",
							iconOnly: !0,
							leadingIcon: We,
							"aria-label": J("follow:feedSources.fetchNamed", { name: Z(e.row.original) }),
							disabled: R.current.readOnly,
							...G(R.current.busy === `check-${e.row.original.id}`),
							onClick: () => R.current.fetch(e.row.original)
						}),
						/* @__PURE__ */ (0, X.jsx)(u, {
							variant: "secondary",
							size: "small",
							iconOnly: !0,
							leadingIcon: I,
							"aria-label": J("follow:shared.removeNamed", { name: Z(e.row.original) }),
							disabled: R.current.readOnly,
							onClick: () => R.current.remove(e.row.original)
						})
					]
				})
			})
		]);
	}, []), V = (0, Y.useMemo)(() => Object.fromEntries([...T].map((e) => [String(e), !0])), [T]), ae = en({
		features: Un,
		data: M.items,
		columns: B,
		getRowId: (e) => String(e.id),
		state: {
			rowSelection: V,
			sorting: A,
			pagination: {
				pageIndex: N.page - 1,
				pageSize: k
			},
			columnVisibility: p.visibility
		},
		onColumnVisibilityChange: p.change,
		onSortingChange: (e) => {
			j(e), O(1);
		},
		enableRowSelection: !0,
		onRowSelectionChange: (e) => {
			c?.onActivate();
			let t = typeof e == "function" ? e(V) : e;
			E(new Set(Object.entries(t).filter(([, e]) => e).map(([e]) => Number(e))));
		}
	});
	if (!g) return l.error ? /* @__PURE__ */ (0, X.jsx)(z, {
		tone: "error",
		title: J("follow:feedSources.loadFailed"),
		children: K(l.error)
	}) : /* @__PURE__ */ (0, X.jsx)("div", { dangerouslySetInnerHTML: { __html: zt(J("follow:feedSources.loading"), { fill: !1 }) } });
	let oe = () => void d.run("check", (e) => Me(e), () => void Kn()), se = (e) => {
		c?.onActivate(), E((t) => {
			let n = new Set(t);
			return n.has(e) ? n.delete(e) : n.add(e), n;
		});
	}, ce = _.filter((e) => T.has(e.id)), H = _.filter((e) => e.last_error);
	return /* @__PURE__ */ (0, X.jsx)("div", {
		className: "flex flex-col gap-3",
		children: /* @__PURE__ */ (0, X.jsxs)("section", {
			"aria-label": J("follow:feedSources.listLabel"),
			className: ke({
				padding: "none",
				className: "flex flex-col gap-4 px-6 py-5 max-sm:px-4"
			}),
			children: [
				/* @__PURE__ */ (0, X.jsxs)("div", {
					"data-responsive-toolbar": "",
					children: [/* @__PURE__ */ (0, X.jsxs)("div", {
						"data-toolbar-heading": "",
						children: [/* @__PURE__ */ (0, X.jsx)("h3", {
							className: "text-title-2-medium text-text-primary",
							children: J("follow:feedSources.title")
						}), /* @__PURE__ */ (0, X.jsx)("span", {
							className: "text-body-2-regular text-text-secondary",
							children: J("follow:feedSources.summary", {
								count: _.length,
								unread: Number(g.unread) || 0
							})
						})]
					}), /* @__PURE__ */ (0, X.jsxs)("div", {
						"data-toolbar-actions": "",
						children: [
							/* @__PURE__ */ (0, X.jsx)(u, {
								onClick: oe,
								disabled: e,
								...G(d.busy === "check"),
								children: J("follow:feedSources.fetchNow")
							}),
							/* @__PURE__ */ (0, X.jsx)(he, {
								preferences: p,
								label: J("follow:feedSources.title")
							}),
							/* @__PURE__ */ (0, X.jsx)(x, {
								label: J("follow:feedSources.title"),
								sorting: A,
								onChange: (e) => {
									j(e), O(1);
								},
								options: [
									"name",
									"kind",
									"origin",
									"status",
									"interval",
									"fetched",
									"fresh"
								].map((e) => ({
									id: e,
									label: Wn[e]
								}))
							})
						]
					})]
				}),
				H.length || d.error ? /* @__PURE__ */ (0, X.jsxs)("div", {
					className: "flex flex-col gap-3",
					children: [H.length ? /* @__PURE__ */ (0, X.jsx)(z, {
						tone: "error",
						title: J("follow:feedSources.failedTitle", { count: H.length }),
						extra: /* @__PURE__ */ (0, X.jsx)("ul", {
							className: "flex flex-col gap-0.5 text-body-2-regular",
							children: H.map((e) => /* @__PURE__ */ (0, X.jsx)("li", {
								className: "min-w-0 truncate",
								title: Le(e, "last_error"),
								children: J("follow:shared.labeled", {
									label: Z(e),
									value: Je(Le(e, "last_error")) || J("follow:shared.noReason")
								})
							}, e.id))
						}),
						children: J("follow:feedSources.failedBody")
					}) : null, d.error ? /* @__PURE__ */ (0, X.jsx)(w, { children: d.error }) : null]
				}) : null,
				/* @__PURE__ */ (0, X.jsx)(le, {
					visible: ce.length > 0,
					label: J("follow:feedSources.bulkActions"),
					count: J("follow:feedSources.selectedCount", { count: ce.length }),
					actions: [
						L(!0),
						L(!1),
						re
					].map((t) => ({
						action: t,
						items: ce,
						host: F,
						disabled: e || P.isPending
					})),
					children: /* @__PURE__ */ (0, X.jsx)(u, {
						variant: "ghost",
						size: "small",
						onClick: Ye,
						children: J("follow:shared.clearSelection")
					})
				}),
				_.length ? /* @__PURE__ */ (0, X.jsx)(b, {
					follow: !0,
					preferences: p,
					onRowClick: (e) => se(Number(e)),
					children: /* @__PURE__ */ (0, X.jsxs)(me, {
						"aria-label": J("follow:feedSources.title"),
						size: "sm",
						sortDescriptor: A[0] ? {
							column: A[0].id,
							direction: A[0].desc ? "descending" : "ascending"
						} : void 0,
						onSortChange: (e) => ae.getColumn(String(e.column))?.toggleSorting(e.direction === "descending"),
						children: [/* @__PURE__ */ (0, X.jsxs)(o, { children: [ae.getHeaderGroups()[0].headers.map((e) => {
							let t = rt(e.column.columnDef.header, e.getContext());
							return /* @__PURE__ */ (0, X.jsx)(r, {
								id: e.id,
								isRowHeader: e.column.id === "name",
								allowsSorting: e.column.getCanSort(),
								...p.columnProps(e.id),
								children: ({ sortDirection: n }) => /* @__PURE__ */ (0, X.jsxs)(X.Fragment, { children: [/* @__PURE__ */ (0, X.jsxs)("span", {
									className: "flex items-center gap-0.5",
									children: [M.header(e.id, Wn[e.id] || e.id) ?? t, e.column.getCanSort() ? /* @__PURE__ */ (0, X.jsx)("span", {
										"data-sort-indicator": !0,
										"data-direction": n || void 0,
										children: /* @__PURE__ */ (0, X.jsx)(h, {})
									}) : null]
								}), /* @__PURE__ */ (0, X.jsx)(ge, {
									preferences: p,
									id: e.id
								})] })
							}, e.id);
						}), /* @__PURE__ */ (0, X.jsx)(r, {
							id: "remaining-space",
							"aria-label": J("follow:shared.rowSpacer"),
							"data-table-space": "",
							width: p.spaceWidth,
							minWidth: 0
						})] }), /* @__PURE__ */ (0, X.jsx)(n, {
							renderEmptyState: () => J("shell:dataTable.empty"),
							children: ae.getRowModel().rows.map((e) => /* @__PURE__ */ (0, X.jsxs)(i, {
								id: e.id,
								"data-follow-selected": e.getIsSelected() || void 0,
								children: [e.getVisibleCells().map((e) => /* @__PURE__ */ (0, X.jsx)(a, { children: rt(e.column.columnDef.cell, e.getContext()) }, e.id)), /* @__PURE__ */ (0, X.jsx)(a, { "data-table-space": "" })]
							}, e.id))
						})]
					})
				}) : /* @__PURE__ */ (0, X.jsx)(C, {
					icon: f,
					title: J("follow:feedSources.empty"),
					size: "compact",
					actions: e ? void 0 : /* @__PURE__ */ (0, X.jsx)(u, {
						variant: "secondary",
						onClick: s,
						children: J("follow:feedSources.add")
					}),
					children: J("follow:feedSources.emptyHint")
				}),
				_.length ? /* @__PURE__ */ (0, X.jsx)(ee, {
					label: J("follow:feedSources.footerLabel"),
					total: N.total,
					unit: J("follow:feedSources.unit"),
					pagination: {
						pageIndex: N.page - 1,
						pageSize: k
					},
					onChange: (e) => {
						ne(e.pageSize), O(e.pageIndex + 1);
					}
				}) : null,
				/* @__PURE__ */ (0, X.jsx)("footer", {
					className: "-mx-6 -mb-5 flex flex-wrap items-center gap-2 border-t border-separator-border rounded-b-2xl bg-card-footer px-6 py-4 max-sm:-mx-4 max-sm:px-4",
					children: /* @__PURE__ */ (0, X.jsx)("span", {
						role: "status",
						className: "mr-auto text-body-2-regular text-text-secondary",
						children: J("follow:feedSources.footerSummary", {
							unread: Number(g.unread) || 0,
							enabled: _.filter((e) => e.enabled).length,
							total: _.length
						})
					})
				})
			]
		})
	});
}
// src/react/jav/studio-subscriptions.tsx
function tr({ close: e }) {
	let t = $t(), [n, r] = (0, Y.useState)(""), [i, a] = (0, Y.useState)(""), [o, s] = (0, Y.useState)(!1), [c, l] = (0, Y.useState)(!1), [u, d] = (0, Y.useState)(""), [f, p] = (0, Y.useState)(""), m = async (e) => {
		if (e.preventDefault(), !o && n.trim() && i.trim()) {
			s(!0), d("");
			try {
				let e = await Te("/api/feeds/merge-studio", {
					target: n.trim(),
					source: i.trim()
				});
				p(J("catalog:studioSubscriptions.mergeDone", {
					target: e.target,
					source: e.source,
					count: e.assets
				})), r(""), a(""), await t.invalidateQueries({ queryKey: ["studio-subscriptions"] });
			} catch (e) {
				d(K(e));
			} finally {
				s(!1);
			}
		}
	}, h = async () => {
		if (!c) {
			l(!0), d("");
			try {
				let e = await Te("/api/feeds/merge-duplicate-studios", {});
				p(J("catalog:studioSubscriptions.mergeAutoDone", { count: e.merged?.length || 0 })), await t.invalidateQueries({ queryKey: ["studio-subscriptions"] });
			} catch (e) {
				d(K(e));
			} finally {
				l(!1);
			}
		}
	};
	return /* @__PURE__ */ (0, X.jsxs)("form", {
		"data-studio-merge": "",
		onSubmit: m,
		className: "flex flex-col gap-2 rounded-xl border border-separator-border bg-background-secondary-default p-4",
		children: [
			/* @__PURE__ */ (0, X.jsx)("strong", {
				className: "text-body-1-medium text-text-primary",
				children: J("catalog:studioSubscriptions.mergeTitle")
			}),
			/* @__PURE__ */ (0, X.jsx)("p", {
				className: "text-caption-1-regular text-text-secondary",
				children: J("catalog:studioSubscriptions.mergeHint")
			}),
			/* @__PURE__ */ (0, X.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, X.jsx)("button", {
					type: "button",
					disabled: c,
					className: "h-9 rounded-lg bg-control px-3 text-body-2-medium text-text-primary hover:bg-control-hover disabled:opacity-50",
					onClick: () => void h(),
					children: J(c ? "catalog:studioSubscriptions.mergeAutoBusy" : "catalog:studioSubscriptions.mergeAuto")
				}), /* @__PURE__ */ (0, X.jsx)("button", {
					type: "button",
					className: "h-9 rounded-lg px-3 text-body-2-medium text-text-secondary hover:bg-control",
					onClick: e,
					children: J("catalog:studioSubscriptions.mergeClose")
				})]
			}),
			/* @__PURE__ */ (0, X.jsx)("strong", {
				className: "mt-2 text-caption-1-regular text-text-secondary",
				children: J("catalog:studioSubscriptions.mergeManual")
			}),
			/* @__PURE__ */ (0, X.jsxs)("div", {
				className: "flex flex-wrap items-end gap-2",
				children: [
					/* @__PURE__ */ (0, X.jsxs)("label", {
						className: "flex min-w-40 flex-col gap-1 text-caption-1-regular text-text-secondary",
						children: [J("catalog:studioSubscriptions.mergeTarget"), /* @__PURE__ */ (0, X.jsx)("input", {
							value: n,
							onChange: (e) => r(e.target.value),
							disabled: o,
							className: "h-9 rounded-lg border border-separator-border bg-surface px-2 text-body-2-regular text-text-primary"
						})]
					}),
					/* @__PURE__ */ (0, X.jsxs)("label", {
						className: "flex min-w-40 flex-col gap-1 text-caption-1-regular text-text-secondary",
						children: [J("catalog:studioSubscriptions.mergeSource"), /* @__PURE__ */ (0, X.jsx)("input", {
							value: i,
							onChange: (e) => a(e.target.value),
							disabled: o,
							className: "h-9 rounded-lg border border-separator-border bg-surface px-2 text-body-2-regular text-text-primary"
						})]
					}),
					/* @__PURE__ */ (0, X.jsx)("button", {
						type: "submit",
						disabled: o || !n.trim() || !i.trim(),
						className: "h-9 rounded-lg bg-control px-3 text-body-2-medium text-text-primary hover:bg-control-hover disabled:opacity-50",
						children: J(o ? "catalog:studioSubscriptions.mergeBusy" : "catalog:studioSubscriptions.mergeSubmit")
					})
				]
			}),
			f ? /* @__PURE__ */ (0, X.jsx)("p", {
				className: "text-caption-1-regular text-text-primary",
				children: f
			}) : null,
			u ? /* @__PURE__ */ (0, X.jsx)("p", {
				className: "text-caption-1-regular text-text-primary",
				children: u
			}) : null
		]
	});
}
// src/react/follow-manage/source-list.tsx
var nr = Wt({
	rowPaginationFeature: jt,
	rowSelectionFeature: Mt,
	rowSortingFeature: Nt,
	columnVisibilityFeature: Re,
	paginatedRowModel: un()
}), rr = Object.fromEntries(Object.entries(p).map(([e, t]) => [t, e])), ir = 740;
function ar() {
	let [e, t] = (0, Y.useState)(!1), n = (0, Y.useRef)(null), r = (0, Y.useCallback)((e) => {
		if (n.current?.disconnect(), !e) {
			n.current = null;
			return;
		}
		let r = new ResizeObserver(() => t(e.clientWidth < ir));
		r.observe(e), n.current = r, t(e.clientWidth < ir);
	}, []);
	return (0, Y.useEffect)(() => () => n.current?.disconnect(), []), [r, e];
}
var or = {
	select: J("follow:shared.select"),
	author: J("follow:shared.creator"),
	source: J("follow:followFeed.filterKindSource"),
	provider: J("follow:shared.site"),
	status: J("follow:shared.status"),
	checked: J("follow:sourceList.colLastChecked"),
	actions: J("follow:shared.actions")
}, sr = Object.entries(or).map(([e, t]) => ({
	id: e,
	label: t,
	width: e === "select" ? 48 : e === "source" ? 320 : e === "author" ? 240 : e === "actions" ? 208 : 184,
	min: e === "select" ? 48 : e === "actions" ? 200 : e === "source" ? 320 : 112,
	max: e === "select" ? 48 : e === "source" ? 2e3 : 800,
	flex: e === "source",
	required: e === "select" || e === "source"
}));
function cr({ source: e, selected: t, onToggle: n, handlers: r }) {
	return /* @__PURE__ */ (0, X.jsxs)("div", {
		"data-selected": t || void 0,
		"data-follow-source-row": "",
		className: "flex min-h-16 flex-wrap items-center gap-3 px-2 py-3 last:rounded-b-lg max-sm:gap-x-2",
		onClick: (e) => {
			Ie(e, e.currentTarget) && n(!t);
		},
		children: [
			/* @__PURE__ */ (0, X.jsx)(m, {
				isSelected: t,
				onChange: n,
				"aria-label": J("follow:shared.selectNamed", { name: e.label })
			}),
			/* @__PURE__ */ (0, X.jsxs)("span", {
				className: "flex min-w-0 grow basis-0 items-center gap-1.5",
				children: [/* @__PURE__ */ (0, X.jsx)("span", {
					"data-follow-source-site": "",
					className: "flex shrink-0 items-center text-body-medium",
					children: /* @__PURE__ */ (0, X.jsx)(sn, { provider: e.provider })
				}), /* @__PURE__ */ (0, X.jsx)(cn, { source: e })]
			}),
			/* @__PURE__ */ (0, X.jsx)(s, { children: e.provider_label }),
			/* @__PURE__ */ (0, X.jsx)(ln, { source: e }),
			e.last_error ? /* @__PURE__ */ (0, X.jsxs)("span", {
				"data-follow-source-error": "",
				className: "flex min-w-0 basis-full gap-3 max-sm:gap-x-2 sm:order-last",
				children: [/* @__PURE__ */ (0, X.jsx)("span", {
					"aria-hidden": !0,
					className: "w-4 shrink-0"
				}), /* @__PURE__ */ (0, X.jsxs)("span", {
					className: "flex min-w-0 grow gap-1.5",
					children: [/* @__PURE__ */ (0, X.jsx)("span", {
						"aria-hidden": !0,
						className: "w-(--icon-inline) shrink-0 text-body-medium"
					}), /* @__PURE__ */ (0, X.jsx)("span", {
						className: "min-w-0 grow",
						children: /* @__PURE__ */ (0, X.jsx)(on, { text: Le(e, "last_error") })
					})]
				})]
			}) : null,
			/* @__PURE__ */ (0, X.jsxs)("span", {
				"data-follow-source-controls": "",
				className: "flex w-max max-w-full flex-none flex-wrap items-center gap-1.5 max-sm:w-full",
				children: [
					/* @__PURE__ */ (0, X.jsx)("span", {
						className: "shrink-0 text-body-2-regular whitespace-nowrap text-text-secondary max-sm:mr-auto max-sm:text-caption-1-regular",
						children: Fe(e)
					}),
					/* @__PURE__ */ (0, X.jsx)(pe, {
						"aria-label": J("follow:shared.enableNamed", { name: e.label }),
						isSelected: e.enabled,
						isDisabled: r.readOnly,
						onChange: (t) => r.toggle(e, t)
					}),
					/* @__PURE__ */ (0, X.jsxs)("span", {
						className: "flex shrink-0 items-center gap-1",
						children: [/* @__PURE__ */ (0, X.jsx)(u, {
							variant: "secondary",
							size: "small",
							iconOnly: !0,
							leadingIcon: We,
							"aria-label": J("follow:sourceList.checkNamed", { name: e.label }),
							disabled: !e.enabled || r.readOnly,
							...G(r.busy),
							onClick: () => r.check([e.id])
						}), /* @__PURE__ */ (0, X.jsx)(u, {
							variant: "secondary",
							size: "small",
							iconOnly: !0,
							leadingIcon: I,
							"aria-label": J("follow:shared.removeNamed", { name: e.label }),
							disabled: r.readOnly,
							onClick: () => r.remove(e)
						})]
					})
				]
			})
		]
	});
}
function lr({ group: e, name: t, open: n, selected: r, handlers: i, onOpen: a, onToggleGroup: o, onToggle: c }) {
	let l = e.map((e) => e.id), d = e.filter((e) => e.enabled).map((e) => e.id), f = e.filter(ct).length, p = dt([...new Set(e.map((e) => e.provider_label || e.provider))]), m = `follow-author-${e[0].id}`, h = Ft(r, l);
	return /* @__PURE__ */ (0, X.jsxs)("section", {
		"aria-label": J("follow:sourceList.groupLabel", { name: t }),
		className: ke({
			variant: "raised",
			padding: "none",
			className: "flex flex-col overflow-hidden p-2"
		}),
		children: [/* @__PURE__ */ (0, X.jsxs)("div", {
			"data-follow-author-header": !0,
			"data-open": n || void 0,
			className: "flex flex-wrap items-center gap-3 px-2 py-2.5",
			children: [
				/* @__PURE__ */ (0, X.jsx)(an, {
					group: e,
					name: t
				}),
				/* @__PURE__ */ (0, X.jsxs)("span", {
					className: "flex min-w-0 grow basis-0 flex-col gap-1",
					children: [/* @__PURE__ */ (0, X.jsx)("b", {
						className: "min-w-0 text-body-medium wrap-anywhere text-text-primary",
						children: t
					}), /* @__PURE__ */ (0, X.jsxs)("span", {
						"data-follow-author-sites": "",
						className: "flex min-w-0 flex-wrap items-center gap-1 text-body-2-regular",
						title: p,
						children: [
							e.map((e) => /* @__PURE__ */ (0, X.jsx)(sn, { provider: e.provider }, e.id)),
							/* @__PURE__ */ (0, X.jsx)(s, { children: J("follow:sourceList.providers", { providers: p }) }),
							f ? /* @__PURE__ */ (0, X.jsx)("span", {
								className: "ml-1 shrink-0 text-text-error-primary",
								children: J("follow:shared.failedCount", { count: f })
							}) : null
						]
					})]
				}),
				/* @__PURE__ */ (0, X.jsxs)("span", {
					"data-follow-author-controls": "",
					className: "flex flex-none items-center gap-2 max-sm:w-full max-sm:justify-end",
					children: [/* @__PURE__ */ (0, X.jsx)(u, {
						variant: "secondary",
						size: "small",
						iconOnly: !0,
						leadingIcon: We,
						"aria-label": J("follow:sourceList.checkGroup", { name: t }),
						disabled: !d.length || i.readOnly,
						...G(i.busy),
						onClick: () => i.check(d)
					}), /* @__PURE__ */ (0, X.jsxs)("span", {
						className: "flex flex-none items-center gap-2",
						children: [/* @__PURE__ */ (0, X.jsx)(u, {
							variant: "secondary",
							size: "small",
							leadingIcon: pt,
							"aria-pressed": h.all ? "true" : h.some ? "mixed" : "false",
							"aria-label": J(h.all ? "follow:sourceList.deselectGroup" : "follow:sourceList.selectGroup", { name: t }),
							onClick: () => o(!h.all),
							children: h.all ? J("follow:shared.deselectAll") : J("follow:shared.selectAll")
						}), /* @__PURE__ */ (0, X.jsx)(u, {
							variant: "secondary",
							size: "small",
							"aria-expanded": n,
							"aria-controls": m,
							leadingIcon: _,
							"aria-label": J(n ? "follow:sourceList.collapseGroup" : "follow:sourceList.expandGroup", { name: t }),
							onClick: () => a(!n),
							children: J(n ? "follow:shared.collapse" : "follow:shared.expand")
						})]
					})]
				})
			]
		}), /* @__PURE__ */ (0, X.jsx)(v, {
			id: m,
			open: n,
			"data-source-divider": !0,
			children: e.map((e) => /* @__PURE__ */ (0, X.jsx)(cr, {
				source: e,
				handlers: i,
				selected: r.has(e.id),
				onToggle: (t) => c(e.id, t)
			}, e.id))
		})]
	});
}
function ur(e) {
	let { data: t, sort: s, dir: c, page: l, layout: d, pageSize: g, selected: v, readOnly: y, onSort: x, onPage: S, onLayout: w, onPageSize: T, onSelected: te, toast: O, openFollow: k, onAdd: ne } = e, A = t.sources, j = (0, Y.useMemo)(() => t.author_aliases || [], [t.author_aliases]), M = t.counts || {}, [N, F] = (0, Y.useState)(/* @__PURE__ */ new Set()), [L, re] = ar(), [ie, R] = (0, Y.useState)(""), B = (0, Y.useMemo)(() => Ee(A, s, c, j), [
		A,
		s,
		c,
		j
	]), oe = (0, Y.useMemo)(() => Gt(B, s, c, j), [
		B,
		s,
		c,
		j
	]), H = tn(oe, {
		author: {
			values: (e) => e.author,
			option: (e, t) => ({ leading: t && /* @__PURE__ */ (0, X.jsx)(an, {
				group: t.group,
				name: e,
				small: !0
			}) })
		},
		source: {
			values: (e) => e.source.label,
			option: (e, t) => ({ leading: t && /* @__PURE__ */ (0, X.jsx)(sn, { provider: t.source.provider }) })
		},
		provider: {
			values: (e) => e.source.provider_label,
			option: (e, t) => ({ leading: t && /* @__PURE__ */ (0, X.jsx)(sn, { provider: t.source.provider }) })
		},
		status: { values: (e) => Ut(e.source) }
	}, () => S(1)), { job: U, running: ue, outcome: fe, start: ye } = Yt({
		queryKey: E,
		taskKey: D,
		queryFn: ({ signal: e }) => Ze(e),
		start: (e) => Vt(e),
		onError: (e) => R(K(e)),
		onFinish: (e) => {
			q(), O(e.status === "failed" ? ut(e, "error") || J("follow:followCheck.checkFailed") : Ne(e));
		}
	}), be = (e) => {
		ue || ye.isPending || (R(""), ye.mutate(e));
	}, xe = (e, t) => te(Kt(v, [e], t)), Ce = (e, t) => te(Kt(v, e, t)), we = Xt({
		mutationFn: (e) => Et(e),
		onSuccess: (e, t) => {
			Ge([t]), te(Kt(v, [t], !1)), O(J("follow:sourceList.unfollowed"));
		},
		onError: (e) => R(K(e))
	}), Te = Xt({
		mutationFn: (e) => Rt(e.id, e.enabled),
		onSuccess: (e, t) => {
			bt(t.id, { enabled: t.enabled }), R("");
		},
		onError: (e) => R(K(e))
	}), Oe = (e) => void Be({
		title: J("follow:sourceList.unfollow"),
		body: J("follow:sourceList.unfollowBody"),
		confirmLabel: J("follow:sourceList.unfollow"),
		danger: !0,
		holdToConfirm: !0,
		onConfirm: () => we.mutateAsync(e.id)
	}), Me = Xt({
		mutationFn: async (e) => {
			let t = await gt(e.ids, 4, async (t) => {
				e.action === "remove" ? await Et(t) : await Rt(t, e.action === "enabled");
			});
			return {
				...e,
				done: e.ids.filter((e, n) => t[n]?.ok),
				results: t
			};
		},
		onSuccess: (e) => {
			if (e.action === "remove") Ge(e.done);
			else for (let t of e.done) bt(t, { enabled: e.action === "enabled" });
			te(Kt(v, e.done, !1));
			let t = e.results.filter((e) => !e.ok);
			t.length ? R(J("follow:sourceList.bulkPartialFail", {
				failed: t.length,
				total: e.ids.length,
				error: K(t[0]?.error)
			})) : R("");
		},
		onError: (e) => R(K(e))
	}), Ie = Xt({
		mutationFn: _t,
		onSuccess: (e) => {
			q(), e.failed ? R(J("follow:sourceList.bulkMarkFailed", {
				failed: e.failed,
				total: e.total,
				error: K(e.error)
			})) : R("");
		},
		onError: (e) => R(K(e))
	}), Re = {
		receipt: O,
		failure: (e) => R(K(e))
	}, ze = (e) => ({
		key: e ? "enable" : "pause",
		label: J(e ? "follow:shared.enable" : "follow:shared.pause"),
		reversal: "undo",
		confirm: (t) => ({
			title: J(e ? "follow:sourceList.enableMany" : "follow:sourceList.pauseMany"),
			body: J(e ? "follow:sourceList.enableManyBody" : "follow:sourceList.pauseManyBody", { count: t.length })
		}),
		run: async (t) => {
			let n = t.filter((t) => A.find((e) => e.id === t)?.enabled !== e), { done: r } = await Me.mutateAsync({
				ids: n,
				action: e ? "enabled" : "paused"
			});
			return async () => {
				await gt(r, 4, (t) => Rt(t, !e));
				for (let t of r) bt(t, { enabled: !e });
			};
		},
		receipt: (t) => J(e ? "follow:sourceList.bulkEnabled" : "follow:sourceList.bulkPaused", { count: t.length })
	}), He = {
		key: "delete",
		label: J("follow:shared.delete"),
		reversal: "irreversible",
		danger: !0,
		holdToConfirm: !0,
		confirm: (e) => ({
			title: J("follow:sourceList.deleteManyTitle", { count: e.length }),
			danger: !0,
			body: J("follow:sourceList.deleteManyBody"),
			confirmLabel: J("follow:sourceList.deleteSelected")
		}),
		run: async (e) => {
			await Me.mutateAsync({
				ids: [...e],
				action: "remove"
			});
		},
		receipt: (e) => J("follow:sourceList.bulkDeleted", { count: e.length })
	}, Ue = (e) => {
		let t = [];
		return {
			key: `mark-${e}`,
			label: J(e === "seen" ? "follow:sourceList.markAllWatched" : "follow:sourceList.ignoreAll"),
			reversal: "undo",
			confirm: ([t]) => e === "seen" ? {
				title: J("follow:followDetail.markSeen"),
				body: J("follow:sourceList.markWatchedBody", { count: t })
			} : {
				title: J("follow:sourceList.markIgnored"),
				body: J("follow:sourceList.markIgnoredBody", { count: t }),
				recovery: J("shell:batchFollow.ignoreRecovery")
			},
			run: async () => (t = (await Ie.mutateAsync(e)).marked, async () => {
				await qt(t), await q();
			}),
			receipt: () => J("follow:sourceList.bulkMarked", { count: t.length })
		};
	}, qe = (e, t) => Te.mutate({
		id: e.id,
		enabled: t
	}), Xe = (0, Y.useRef)({
		check: be,
		toggle: qe,
		remove: Oe,
		busy: !1,
		readOnly: y
	});
	Xe.current = {
		check: be,
		toggle: qe,
		remove: Oe,
		busy: ue || ye.isPending,
		readOnly: y
	};
	let Qe = Xe.current, $e = (0, Y.useMemo)(() => {
		let e = Ve(), t = (e) => () => or[e] || e;
		return e.columns([
			e.display({
				id: "select",
				header: (e) => /* @__PURE__ */ (0, X.jsx)(_e, {
					table: e.table,
					label: J("follow:sourceList.selectPage"),
					page: !0
				}),
				cell: (e) => /* @__PURE__ */ (0, X.jsx)(m, {
					slot: null,
					isSelected: e.row.getIsSelected(),
					onChange: (t) => e.row.toggleSelected(t),
					"aria-label": J("follow:shared.selectNamed", { name: e.row.original.source.label })
				})
			}),
			e.accessor((e) => e.author, {
				id: "author",
				header: t("author"),
				cell: (e) => /* @__PURE__ */ (0, X.jsxs)("span", {
					className: "flex min-w-0 items-center gap-2",
					children: [/* @__PURE__ */ (0, X.jsx)(an, {
						group: e.row.original.group,
						name: e.row.original.author
					}), /* @__PURE__ */ (0, X.jsx)("span", {
						className: "min-w-0 break-words",
						children: e.row.original.author
					})]
				})
			}),
			e.accessor((e) => e.source.label, {
				id: "source",
				header: t("source"),
				cell: (e) => /* @__PURE__ */ (0, X.jsxs)("span", {
					className: "flex min-w-0 flex-col gap-0.5",
					children: [/* @__PURE__ */ (0, X.jsx)(cn, { source: e.row.original.source }), e.row.original.source.last_error ? /* @__PURE__ */ (0, X.jsx)(on, { text: Le(e.row.original.source, "last_error") }) : null]
				})
			}),
			e.accessor((e) => e.source.provider_label, {
				id: "provider",
				header: t("provider"),
				cell: (e) => /* @__PURE__ */ (0, X.jsxs)("span", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, X.jsx)(sn, { provider: e.row.original.source.provider }), e.row.original.source.provider_label]
				})
			}),
			e.display({
				id: "status",
				header: t("status"),
				cell: (e) => /* @__PURE__ */ (0, X.jsx)(ln, { source: e.row.original.source })
			}),
			e.accessor((e) => e.source.last_checked_at || "", {
				id: "checked",
				header: t("checked"),
				cell: (e) => Fe(e.row.original.source)
			}),
			e.display({
				id: "actions",
				header: t("actions"),
				cell: (e) => /* @__PURE__ */ (0, X.jsxs)("span", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, X.jsx)(pe, {
							"aria-label": J("follow:shared.enableNamed", { name: e.row.original.source.label }),
							isSelected: e.row.original.source.enabled,
							isDisabled: Qe.readOnly,
							onChange: (t) => Xe.current.toggle(e.row.original.source, t)
						}),
						/* @__PURE__ */ (0, X.jsx)(u, {
							variant: "secondary",
							size: "small",
							iconOnly: !0,
							leadingIcon: We,
							"aria-label": J("follow:sourceList.checkNamed", { name: e.row.original.source.label }),
							disabled: !e.row.original.source.enabled || Qe.readOnly,
							...G(Qe.busy),
							onClick: () => Xe.current.check([e.row.original.source.id])
						}),
						/* @__PURE__ */ (0, X.jsx)(u, {
							variant: "secondary",
							size: "small",
							iconOnly: !0,
							leadingIcon: I,
							"aria-label": J("follow:shared.removeNamed", { name: e.row.original.source.label }),
							disabled: Qe.readOnly,
							onClick: () => Xe.current.remove(e.row.original.source)
						})
					]
				})
			})
		]);
	}, [Qe]), et = (0, Y.useMemo)(() => {
		let e = rr[s];
		return e ? [{
			id: e,
			desc: c === "desc"
		}] : [];
	}, [s, c]), tt = (0, Y.useMemo)(() => Object.fromEntries([...v].map((e) => [String(e), !0])), [v]), nt = d === "table", it = nn("follow-sources", sr), at = yt(nt ? H.items.length : B.length, g, l), ot = en({
		features: nr,
		data: H.items,
		columns: $e,
		getRowId: (e) => String(e.source.id),
		state: {
			sorting: et,
			rowSelection: tt,
			pagination: {
				pageIndex: at.page - 1,
				pageSize: g
			},
			columnVisibility: it.visibility
		},
		onColumnVisibilityChange: it.change,
		manualSorting: !0,
		enableRowSelection: !0,
		onSortingChange: (e) => {
			let t = (typeof e == "function" ? e(et) : e)[0];
			if (!t) return;
			let n = p[t.id];
			n && x(n, t.desc ? "desc" : "asc");
		},
		onRowSelectionChange: (e) => {
			let t = typeof e == "function" ? e(tt) : e;
			te(new Set(Object.entries(t).filter(([, e]) => e).map(([e]) => Number(e))));
		},
		onPaginationChange: (e) => {
			let t = {
				pageIndex: at.page - 1,
				pageSize: g
			}, n = typeof e == "function" ? e(t) : e;
			n.pageSize === g ? n.pageIndex !== t.pageIndex && S(n.pageIndex + 1) : T(n.pageSize);
		}
	}), st = ot.getRowModel().rows, ct = nt ? st.map((e) => e.original.source.id) : B.slice(at.start, at.end).flatMap((e) => e.map((e) => e.id)), lt = Ft(v, ct), dt = [...v], ft = je(fe), pt = A.filter((e) => e.enabled && (e.last_status === "error" || e.last_status === "unauthorized")).map((e) => e.id), mt = Ae(fe), ht = B.length > 0 && N.size >= B.length;
	return A.length ? /* @__PURE__ */ (0, X.jsxs)("div", {
		className: ke({
			padding: "none",
			className: "flex flex-col gap-4 px-6 py-5 max-sm:px-4"
		}),
		children: [
			/* @__PURE__ */ (0, X.jsxs)("div", {
				ref: L,
				"data-follow-toolbar": "",
				"data-responsive-toolbar": "",
				children: [/* @__PURE__ */ (0, X.jsxs)("span", {
					"data-follow-toolbar-heading": "",
					"data-toolbar-heading": "",
					children: [/* @__PURE__ */ (0, X.jsx)("h3", {
						className: "text-title-2-medium text-text-primary",
						children: J("follow:followManageNav.list")
					}), /* @__PURE__ */ (0, X.jsx)("span", {
						className: "text-body-2-regular text-text-secondary",
						children: M.new ? J("follow:sourceList.sourceCountUnseen", {
							count: A.length,
							unseen: Number(M.new) || 0
						}) : J("follow:sourceList.sourceCount", { count: A.length })
					})]
				}), /* @__PURE__ */ (0, X.jsxs)("div", {
					"data-follow-toolbar-actions": "",
					"data-toolbar-actions": "",
					children: [
						pt.length ? /* @__PURE__ */ (0, X.jsx)(u, {
							variant: "secondary",
							disabled: y,
							...G(Qe.busy),
							onClick: () => be(pt),
							children: J("follow:sourceList.checkFailed")
						}) : null,
						/* @__PURE__ */ (0, X.jsx)(u, {
							variant: "primary",
							leadingIcon: We,
							disabled: y,
							"aria-label": J("follow:sourceList.checkAll"),
							iconOnly: re,
							...G(Qe.busy),
							onClick: () => be([]),
							children: J("follow:sourceList.checkAll")
						}),
						/* @__PURE__ */ (0, X.jsxs)("span", {
							"data-follow-toolbar-controls": "",
							className: "contents",
							children: [
								/* @__PURE__ */ (0, X.jsxs)("span", {
									"data-button-group": !0,
									role: "group",
									"aria-label": J("follow:sourceList.layout"),
									children: [/* @__PURE__ */ (0, X.jsx)(u, {
										variant: "ghost",
										iconOnly: !0,
										leadingIcon: W,
										"aria-label": P[0][1],
										"aria-pressed": !nt,
										onClick: () => w("default")
									}), /* @__PURE__ */ (0, X.jsx)(u, {
										variant: "ghost",
										iconOnly: !0,
										leadingIcon: Ke,
										"aria-label": P[1][1],
										"aria-pressed": nt,
										onClick: () => w("table")
									})]
								}),
								nt ? /* @__PURE__ */ (0, X.jsx)(he, {
									preferences: it,
									label: J("follow:sourceList.tableLabel")
								}) : null,
								/* @__PURE__ */ (0, X.jsxs)("span", {
									className: "flex flex-none items-center gap-2",
									children: [/* @__PURE__ */ (0, X.jsx)(se, {
										"aria-label": J("follow:sourceList.sortLabel"),
										prefix: J("follow:shared.sort"),
										selectedKey: s,
										onSelectionChange: (e) => {
											if (e === null) return;
											let t = String(e);
											x(t, V[t]);
										},
										children: ae.map(([e, t]) => /* @__PURE__ */ (0, X.jsx)(ce, {
											id: e,
											children: t
										}, e))
									}), /* @__PURE__ */ (0, X.jsx)(u, {
										variant: "secondary",
										iconOnly: !0,
										leadingIcon: de,
										"data-icon-state": c === "asc" ? "a" : "b",
										"aria-label": Bt(s, c),
										onClick: () => x(s, c === "asc" ? "desc" : "asc")
									})]
								}),
								nt ? null : /* @__PURE__ */ (0, X.jsx)(u, {
									variant: "secondary",
									iconOnly: re,
									leadingIcon: _,
									"aria-expanded": !ht,
									"aria-label": J(ht ? "follow:shared.expandAll" : "follow:shared.collapseAll"),
									onClick: () => F(ht ? /* @__PURE__ */ new Set() : new Set(B.map((e) => String(e[0].author_key || e[0].id)))),
									children: J(ht ? "follow:shared.expandAll" : "follow:shared.collapseAll")
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, X.jsxs)("div", {
				"aria-live": "polite",
				className: "flex flex-col gap-3 empty:hidden",
				children: [
					ue ? /* @__PURE__ */ (0, X.jsx)(ve, {
						embedded: !0,
						kind: U?.older ? Se("feed-scrape") : Se("follow-check"),
						label: ut(U) || (U?.total ? J(U.older ? "follow:sourceList.backfillProgress" : "follow:sourceList.checkProgress", {
							checked: U.checked || 0,
							count: U.total
						}) : J("follow:sourceList.preparingCheck")),
						value: U?.checked,
						total: U?.total
					}) : null,
					ie ? /* @__PURE__ */ (0, X.jsx)(z, {
						tone: "error",
						title: J("follow:shared.actionFailed"),
						children: ie
					}) : null,
					!ue && fe?.results?.length ? /* @__PURE__ */ (0, X.jsx)(z, {
						tone: "neutral",
						title: J("follow:followFeed.checkResults"),
						children: Pe(fe)
					}) : null,
					ft.length ? /* @__PURE__ */ (0, X.jsx)(z, {
						tone: "error",
						title: J("follow:sourceList.failedTitle", { count: ft.length }),
						extra: /* @__PURE__ */ (0, X.jsx)("ul", {
							className: "flex flex-col gap-0.5 text-body-2-regular",
							children: ft.map((e, t) => /* @__PURE__ */ (0, X.jsx)("li", { children: J("follow:shared.labeled", {
								label: `${e.provider_label || e.provider || ""} ${e.author || e.label || e.ref || ""}`.trim(),
								value: Je(e.error || "") || J("follow:shared.noReason")
							}) }, `${e.provider || ""}-${e.ref || t}`))
						}),
						children: J("follow:sourceList.failedBody")
					}) : null,
					mt ? /* @__PURE__ */ (0, X.jsx)(z, {
						tone: "warning",
						children: J("follow:sourceList.evidenceGap", { error: mt })
					}) : null
				]
			}),
			/* @__PURE__ */ (0, X.jsx)(le, {
				label: J("follow:sourceList.bulkActions"),
				visible: dt.length > 0,
				count: J("follow:sourceList.selectedCount", { count: dt.length }),
				actions: [
					ze(!0),
					ze(!1),
					He
				].map((e) => ({
					action: e,
					items: dt,
					host: Re,
					disabled: y || Me.isPending
				})),
				leading: /* @__PURE__ */ (0, X.jsx)(u, {
					variant: "secondary",
					size: "small",
					disabled: y,
					...G(Qe.busy),
					onClick: () => be(dt),
					children: J("follow:sourceList.checkSelected")
				}),
				children: /* @__PURE__ */ (0, X.jsx)(u, {
					variant: "ghost",
					size: "small",
					onClick: Ye,
					children: J("follow:shared.clearSelection")
				})
			}),
			nt ? /* @__PURE__ */ (0, X.jsx)(b, {
				follow: !0,
				preferences: it,
				onRowClick: (e) => xe(Number(e), !v.has(Number(e))),
				children: /* @__PURE__ */ (0, X.jsxs)(me, {
					"aria-label": J("follow:sourceList.tableLabel"),
					size: "sm",
					sortDescriptor: et[0] ? {
						column: et[0].id,
						direction: et[0].desc ? "descending" : "ascending"
					} : void 0,
					onSortChange: (e) => ot.setSorting([{
						id: String(e.column),
						desc: e.direction === "descending"
					}]),
					children: [/* @__PURE__ */ (0, X.jsxs)(o, { children: [ot.getHeaderGroups()[0].headers.map((e) => {
						let t = e.column.id in p, n = rt(e.column.columnDef.header, e.getContext());
						return /* @__PURE__ */ (0, X.jsx)(r, {
							id: e.id,
							allowsSorting: t,
							isRowHeader: e.column.id === "source",
							...it.columnProps(e.id),
							children: ({ sortDirection: r }) => /* @__PURE__ */ (0, X.jsxs)(X.Fragment, { children: [e.id === "select" ? n : t ? /* @__PURE__ */ (0, X.jsxs)("span", {
								className: "flex items-center gap-0.5",
								children: [H.header(e.id, or[e.id] || e.id) ?? n, /* @__PURE__ */ (0, X.jsx)("span", {
									"data-sort-indicator": !0,
									"data-direction": r || void 0,
									children: /* @__PURE__ */ (0, X.jsx)(h, {})
								})]
							}) : H.header(e.id, or[e.id] || e.id) ?? n, /* @__PURE__ */ (0, X.jsx)(ge, {
								preferences: it,
								id: e.id
							})] })
						}, e.id);
					}), /* @__PURE__ */ (0, X.jsx)(r, {
						id: "remaining-space",
						"aria-label": J("follow:shared.rowSpacer"),
						"data-table-space": "",
						width: it.spaceWidth,
						minWidth: 0
					})] }), /* @__PURE__ */ (0, X.jsx)(n, {
						renderEmptyState: () => J("follow:sourceList.pageEmpty"),
						children: st.map((e) => /* @__PURE__ */ (0, X.jsxs)(i, {
							id: e.id,
							"data-follow-selected": e.getIsSelected() || void 0,
							children: [e.getVisibleCells().map((e) => /* @__PURE__ */ (0, X.jsx)(a, { children: rt(e.column.columnDef.cell, e.getContext()) }, e.id)), /* @__PURE__ */ (0, X.jsx)(a, { "data-table-space": "" })]
						}, e.id))
					})]
				})
			}) : /* @__PURE__ */ (0, X.jsxs)(X.Fragment, { children: [/* @__PURE__ */ (0, X.jsx)(m, {
				isSelected: lt.all,
				isIndeterminate: lt.some,
				onChange: (e) => Ce(ct, e),
				"aria-label": J("follow:sourceList.selectPage"),
				children: J("follow:sourceList.selectPageShort")
			}), /* @__PURE__ */ (0, X.jsx)("div", {
				className: "flex flex-col gap-3",
				children: B.slice(at.start, at.end).map((e) => {
					let t = String(e[0].author_key || e[0].id);
					return /* @__PURE__ */ (0, X.jsx)(lr, {
						group: e,
						name: De(e, j),
						handlers: Qe,
						selected: v,
						open: !N.has(t),
						onOpen: (e) => {
							let n = new Set(N);
							e ? n.delete(t) : n.add(t), F(n);
						},
						onToggleGroup: (t) => Ce(e.map((e) => e.id), t),
						onToggle: xe
					}, t);
				})
			})] }),
			/* @__PURE__ */ (0, X.jsx)(ee, {
				label: J("follow:followManageNav.list"),
				total: at.total,
				pagination: {
					pageIndex: at.page - 1,
					pageSize: g
				},
				unit: J(nt ? "follow:followOverview.sourceUnit" : "follow:sourceList.creatorUnit"),
				pageUnit: J(nt ? "follow:followOverview.itemUnit" : "follow:followOverview.creatorUnit"),
				onChange: (e) => {
					e.pageSize === g ? ot.setPageIndex(e.pageIndex) : ot.setPageSize(e.pageSize);
				}
			}),
			M.new ? /* @__PURE__ */ (0, X.jsxs)("div", {
				className: "-mx-6 -mb-5 flex flex-wrap items-center gap-2 border-t border-separator-border rounded-b-2xl bg-card-footer px-6 py-4 max-sm:-mx-4 max-sm:px-4",
				children: [
					/* @__PURE__ */ (0, X.jsx)("span", {
						className: "mr-auto text-body-2-regular text-text-secondary",
						children: J("follow:sourceList.markSummary", {
							unwatched: Number(M.new) || 0,
							watched: Number(M.seen) || 0,
							saved: Number(M.saved) || 0,
							ignored: Number(M.ignored) || 0
						})
					}),
					/* @__PURE__ */ (0, X.jsx)(u, {
						variant: "secondary",
						size: "small",
						onClick: k,
						children: J("follow:sourceList.seeUpdates")
					}),
					["seen", "ignored"].map((e) => {
						let t = Ue(e);
						return /* @__PURE__ */ (0, X.jsx)(u, {
							variant: "secondary",
							size: "small",
							disabled: y,
							...G(Ie.isPending),
							onClick: () => void Pt(t, [Number(M.new) || 0], Re).catch(Re.failure),
							children: t.label
						}, e);
					})
				]
			}) : null
		]
	}) : /* @__PURE__ */ (0, X.jsx)(C, {
		icon: f,
		title: J("follow:sourceList.empty"),
		actions: /* @__PURE__ */ (0, X.jsx)(u, {
			variant: "primary",
			size: "small",
			onClick: ne,
			children: J("follow:followFeed.addFollow")
		}),
		children: J("follow:sourceList.emptyHint")
	});
}
// node_modules/skullet/dist/index.mjs
var dr = "skullet-reveal", fr = "skullet-pane", pr = "skullet-loading", mr = "skullet-ghost", hr = "skullet-snapshot", gr = "skullet-layer", _r = "skullet-rect", vr = "skullet-bar", yr = "skullet-inactive", br = "skullet-exiting", xr = "skullet-covered", Sr = "skullet-own", Cr = "skullet-block", wr = Symbol.for("skullet.ghost"), Tr = Symbol.for("skullet.uncover"), Er = "skullet-status", Dr = "skullet-xray", Or = "var(--skullet-base, rgb(128 128 128 / 0.2))", kr = "var(--skullet-highlight, rgb(255 255 255 / 0.12))", Ar = 280, jr = 1e4, Mr = {
	shimmer: {
		slow: 4e3,
		fast: 2e3
	},
	pulse: {
		slow: 2400,
		fast: 1200
	}
}, Nr = [
	"a",
	"b",
	"code",
	"dd",
	"dt",
	"em",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"i",
	"label",
	"li",
	"p",
	"small",
	"span",
	"strong",
	"td",
	"th",
	"time"
], Pr = [
	"audio",
	"canvas",
	"embed",
	"iframe",
	"img",
	"input",
	"object",
	"picture",
	"select",
	"svg",
	"textarea",
	"video"
], Fr = Pr.join(", "), Ir = `
[${dr}] {
  position: relative;
}

skullet-reveal {
  display: block;
}

skullet-reveal[loading]:not(:defined) {
  visibility: hidden;
}

[${fr}] {
  display: block;
}

[${pr}] {
  position: relative;
  -webkit-user-select: none;
  user-select: none;
  pointer-events: none;
}

[${yr}] {
  display: none !important;
}

[${gr}] {
  position: absolute;
  inset: 0;
  overflow: visible;
}

[${vr}] {
  display: block;
  background-color: ${Or};
  background-repeat: no-repeat;
}

/* Containers keep their surface; what they hold is drawn by bones, measured before the first paint */
@scope ([${pr}]) to ([${Sr}], [${gr}]) {
  :scope,
  :scope * {
    color: transparent !important;
    -webkit-text-fill-color: transparent !important;
    text-shadow: none !important;
    text-decoration-color: transparent !important;
  }

  :scope ::placeholder {
    color: transparent !important;
  }

  /* A line to measure in empty text; content only, never a size, or a dot-sized span would grow round it */
  :scope :is(${Nr.join(", ")}):empty:not(svg *)::before {
    content: "000000";
  }

  /* Leaves are drawn by bones, so their own paint never shows; visibility, as measuring reads it */
  :scope :is(:not(:has(*)), ${Fr}, [${xr}], [${Cr}]):not(svg *) {
    visibility: hidden !important;
  }

  /* No script to measure: a bar struck through each line of text instead */
  @media (scripting: none) {
    :scope :not(:has(*)):not(svg *) {
      visibility: visible !important;
    }

    :scope,
    :scope * {
      text-decoration: line-through ${Or} !important;
      text-decoration-thickness: 0.72em !important;
      text-decoration-skip-ink: none !important;
    }

    :scope :is(${Fr}, [${Cr}]):not(svg *) {
      visibility: visible !important;
      background: ${Or} !important;
    }

    :scope svg * {
      fill: transparent !important;
      stroke: transparent !important;
    }

    :scope :is(img, video) {
      object-position: -100vw 0;
    }
  }
}

/* Read by screen readers in the skeleton's place, never seen */
[${Er}] {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

/* Debug x-ray: the ghost shown through its bones, to see what was measured */
[${Dr}] [${pr}] [${mr}],
[${Dr}] [${pr}] [${mr}] *:not(svg *) {
  visibility: visible !important;
  color: rgb(255 0 80 / 0.7) !important;
  -webkit-text-fill-color: rgb(255 0 80 / 0.7) !important;
}

/* Lets addStyles see a stylesheet already on the page, from styles.css or a server render */
:root {
  --skullet: 1;
}`, Lr = null, Rr = 0, zr;
function Br() {
	Rr++, !Lr && (zr ??= !!getComputedStyle(document.documentElement).getPropertyValue("--skullet"), !zr && (Lr = document.createElement("style"), Lr.dataset.skullet = "true", Lr.textContent = Ir, document.head.appendChild(Lr)));
}
function Vr() {
	Rr--, !(Rr > 0 || !Lr) && (Lr.remove(), Lr = null);
}
var Hr = "\"use strict\";(()=>{var B=\"skullet-ghost\";var D=\"skullet-layer\",L=\"skullet-rect\";var R=\"skullet-covered\",$=\"skullet-own\",v=\"skullet-ignore\",H=\"skullet-block\",I=Symbol.for(\"skullet.ghost\"),G=Symbol.for(\"skullet.uncover\"),P=\"skullet.boot\";var W=\"var(--skullet-base, rgb(128 128 128 / 0.2))\",z=\"var(--skullet-highlight, rgb(255 255 255 / 0.12))\";var F={shimmer:{slow:4e3,fast:2e3},pulse:{slow:2400,fast:1200}},X=[\"a\",\"b\",\"code\",\"dd\",\"dt\",\"em\",\"h1\",\"h2\",\"h3\",\"h4\",\"h5\",\"h6\",\"i\",\"label\",\"li\",\"p\",\"small\",\"span\",\"strong\",\"td\",\"th\",\"time\"],U=[\"audio\",\"canvas\",\"embed\",\"iframe\",\"img\",\"input\",\"object\",\"picture\",\"select\",\"svg\",\"textarea\",\"video\"];var gt,V=()=>gt??(gt=/jsdom/.test(navigator.userAgent)?null:document.createElement(\"canvas\").getContext(\"2d\"));var J=(t,n)=>t?{left:Math.max(t.left,n.left),right:Math.min(t.right,n.right),top:Math.max(t.top,n.top),bottom:Math.min(t.bottom,n.bottom)}:n,A=t=>[[t.left,t.top],[t.right,t.top],[t.right,t.bottom],[t.left,t.bottom]],k=(t,n)=>Math.abs(t[0]-n[0])<1&&Math.abs(t[1]-n[1])<1;function Q(t,n){let e=Math.min(n.right-n.left,n.bottom-n.top),o=r=>r.endsWith(\"%\")?parseFloat(r)/100*e:parseFloat(r)||0;return[o(t.borderTopLeftRadius),o(t.borderTopRightRadius),o(t.borderBottomRightRadius),o(t.borderBottomLeftRadius)]}function bt(t,n,e){let o=J(t,n),r=Q(e,n),c=t?A(t):[],a=A(n),l=A(o).map((f,T)=>k(f,a[T])?r[T]:t&&k(f,c[T])?t.corners[T]:0),{left:s,right:i,top:u,bottom:h}=o;return{left:s,right:i,top:u,bottom:h,corners:l}}function Tt(t,n,e,o){if(!t)return e;let r=A(t),c=A(n).map((l,s)=>t.corners[s]>0&&k(l,r[s]));if(!c.some(Boolean))return e;let a=Q(o,n);return c.map((l,s)=>l?Math.max(a[s],t.corners[s]):a[s]).map(l=>`${l}px`).join(\" \")}var j=(t,n)=>{let e=J(n,t);return e.right-e.left>=2&&e.bottom-e.top>=2?e:null},q={top:\"ascender\",bottom:\"descender\"},C=new Map,tt=t=>[...t.getClientRects?.()??[]];function St(t){let n=`${t.fontStyle} ${t.fontWeight} ${t.fontSize} ${t.fontFamily}`;if(C.has(n))return C.get(n);let e=V(),o=null;if(e){e.font=n;let r=e.measureText(\"H\"),c=a=>e.measureText(a).actualBoundingBoxAscent;o={ascent:r.fontBoundingBoxAscent,descent:r.fontBoundingBoxDescent,ascender:c(\"bdfhkl\"),capHeight:r.actualBoundingBoxAscent,xHeight:c(\"xz\"),descender:e.measureText(\"gjpqy\").actualBoundingBoxDescent}}return C.set(n,o),o}var Y={ascender:\"ascender\",\"cap-height\":\"capHeight\",\"x-height\":\"xHeight\"},K=(t,n,e,o)=>{let r=t.getPropertyValue(n).trim();return e.includes(r)?r:o};function xt(t,n,e){let o=St(n);if(!o){let s=Math.min(e*.72,t.bottom-t.top),i=(t.top+t.bottom)/2;return{barTop:i-s/2,barBottom:i+s/2}}let r=K(n,\"--skullet-text-top\",Object.keys(Y),q.top),c=K(n,\"--skullet-text-bottom\",[\"baseline\",\"descender\"],q.bottom),a=o.ascent+o.descent,l=t.top+(t.bottom-t.top-a)/2+o.ascent;return{barTop:l-o[Y[r]],barBottom:l+(c===\"descender\"?o.descender:0)}}var Et=new Set(U),Rt=new Set(X),et=.4,At=/[,/]\\s*0\\)$/,y=(t,n)=>t!==\"\"&&t!==n,yt=[\"Top\",\"Right\",\"Bottom\",\"Left\"],Mt=t=>yt.every(n=>y(t[`border${n}Style`],\"none\")&&y(t[`border${n}Width`],\"0px\")),Ct=t=>{let[n=0,e=0,o=0,r=0]=(t.replace(/rgba?\\([^)]*\\)|#\\w+/g,\"\").match(/-?[\\d.]+px/g)??[]).map(parseFloat);return t.includes(\"inset\")&&!o&&!r&&n===0!=(e===0)&&Math.abs(n+e)<=2},kt=t=>y(t,\"none\")&&!t.split(/,(?![^(]*\\))/).every(Ct),Ot=t=>y(t.backgroundColor,\"transparent\")&&!At.test(t.backgroundColor)||y(t.backgroundImage,\"none\")||kt(t.boxShadow)||Mt(t),ot=t=>Et.has(t.localName),nt=t=>Rt.has(t.localName)&&!t.firstElementChild&&!t.textContent?.trim(),wt=t=>{let n=document.createTreeWalker(t,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT),e=document.createRange(),o=[],r=0;for(;n.nextNode();){let i=n.currentNode;if(i.nodeType===Node.TEXT_NODE){let u=i.parentElement;if(!i.textContent?.trim()||!u)continue;r++;let h=u.getBoundingClientRect();if(h.width<=1||h.height<=1)continue;e.selectNodeContents(i),o.push(tt(e).filter(f=>f.width||f.height))}else nt(i)&&(r++,o.push([...i.getClientRects()]))}if(!o.some(i=>i.length))return r;let c=(parseFloat(getComputedStyle(t).fontSize)||16)*et,a=(i,u)=>Math.min(i.bottom,u.bottom)-Math.max(i.top,u.top)>=Math.min(i.height,u.height)/2&&Math.max(i.left,u.left)-Math.min(i.right,u.right)<=c,l=o.map((i,u)=>u),s=i=>l[i]===i?i:l[i]=s(l[i]);for(let i=0;i<o.length;i++)for(let u=i+1;u<o.length;u++)o[i].some(h=>o[u].some(f=>a(h,f)))&&(l[s(u)]=s(i));return new Set(o.map((i,u)=>s(u))).size},Nt=(t,n)=>t.hasAttribute(H)||ot(t)||Ot(n)&&wt(t)<=1;function _t(t,n){if(parseFloat(n.borderRadius)||!t.parentElement)return n.borderRadius||\"0px\";let e=t.parentElement,o=getComputedStyle(e),r=t.getBoundingClientRect(),c=e.getBoundingClientRect();return Math.abs(r.width-c.width)<1&&Math.abs(r.height-c.height)<1&&o.overflow!==\"visible\"?o.borderRadius:n.borderRadius||\"0px\"}function Z(t){t.sort((e,o)=>e.left-o.left);let n=[];for(let e of t){let o=n.find(r=>{let c=Math.min(r.bottom,e.bottom)-Math.max(r.top,e.top),a=Math.min(r.bottom-r.top,e.bottom-e.top),l=e.left-r.right;return c>=a/2&&l<=Math.max(r.fontSize,e.fontSize)*et});o?(o.left=Math.min(o.left,e.left),o.right=Math.max(o.right,e.right),o.top=Math.min(o.top,e.top),o.bottom=Math.max(o.bottom,e.bottom),o.fontSize=Math.max(o.fontSize,e.fontSize),o.barTop=Math.min(o.barTop,e.barTop),o.barBottom=Math.max(o.barBottom,e.barBottom)):n.push({...e})}return n.map(e=>{let o=e.barBottom-e.barTop;return{x:e.left,y:e.barTop,width:e.right-e.left,height:o,radius:e.radius||`${Math.round(o/3)}px`}})}function rt(t,n,{mark:e=!0,onCovered:o}={}){let r=n.getBoundingClientRect(),c=n.offsetWidth?r.width/n.offsetWidth:1,a=n.offsetHeight?r.height/n.offsetHeight:1,l=m=>({left:(m.left-r.left)/c,right:(m.right-r.left)/c,top:(m.top-r.top)/a,bottom:(m.bottom-r.top)/a}),s=[],i=[],u=new Set,h=document.createRange(),f=(m,g,b)=>{let d=j(m,b);if(!d)return;let p=parseFloat(g.fontSize)||16,M=l(d);i.push({...M,fontSize:p,...xt(M,g,p),radius:g.getPropertyValue(\"--skullet-radius\").trim()})},T=(m,g)=>{let b=m.data.search(/\\S/);if(b<0||!m.parentElement)return;h.setStart(m,b),h.setEnd(m,m.data.trimEnd().length);let d=getComputedStyle(m.parentElement);for(let p of tt(h))f(p,d,g)},_=(m,g)=>{for(let b of m.childNodes){if(b.nodeType===Node.TEXT_NODE){T(b,g);continue}if(b.nodeType!==Node.ELEMENT_NODE)continue;let d=b;if(d.hasAttribute(v)||d.hasAttribute($))continue;let p=getComputedStyle(d);if(p.display===\"none\")continue;if(Nt(d,p)){let E=j(d.getBoundingClientRect(),g);if(E){let S=l(E);s.push({x:S.left,y:S.top,width:S.right-S.left,height:S.bottom-S.top,radius:Tt(g,E,_t(d,p),p)})}ot(d)||u.add(d);continue}if(nt(d)){for(let E of d.getClientRects())f(E,p,g);continue}let M=p.overflowX!==\"visible\"||p.overflowY!==\"visible\";_(d,M?bt(g,d.getBoundingClientRect(),p):g)}};if(_(t,null),o?.(u),!e)return[...s,...Z(i)];for(let m of t.querySelectorAll(`[${R}]`))u.has(m)||m.removeAttribute(R);for(let m of u)m.hasAttribute(R)||m.setAttribute(R,\"\");return[...s,...Z(i)]}var Bt=t=>typeof matchMedia<\"u\"&&matchMedia(t).matches,Dt=()=>typeof Element<\"u\"&&typeof Element.prototype.animate==\"function\",st=()=>!Dt()||Bt(\"(prefers-reduced-motion: reduce)\");var it=t=>t.getAnimations?.()??[];var Lt=.7,$t=1280,at=320,vt=2.5,Ht=.45,It=[\"shimmer\",\"group-shimmer\",\"pulse\",\"none\"];function lt(t){let n=getComputedStyle(t),e=(c,a,l)=>{let s=n.getPropertyValue(c).trim();return a.includes(s)?s:l},o=e(\"--skullet-animation\",It,\"shimmer\"),r=e(\"--skullet-speed\",[\"slow\",\"fast\"],\"slow\");return{animation:o,duration:F[o===\"pulse\"?\"pulse\":\"shimmer\"][r]}}var w=20,Gt=Math.sin(w*Math.PI/180),ut=Math.cos(w*Math.PI/180),Pt=Gt/ut;var Wt=`${90+w}deg`,O=.85,x=12,ct=t=>(1-Math.cos(Math.PI*t))/2;function zt(t){let n=t*vt,e=(r,c)=>`color-mix(in srgb, ${z} ${(c*100).toFixed(1)}%, transparent) ${(r*t).toFixed(2)}px`,o=[];for(let r=0;r<=x;r++)o.push(e(r/x*O,ct(r/x)));for(let r=1;r<=x;r++)o.push(e(O+r/x*(1-O),ct(1-r/x)));return{width:n/ut,image:`repeating-linear-gradient(${Wt}, ${o.join(\", \")}, transparent ${n.toFixed(2)}px)`}}function Ft(t,n,e=lt(t)){for(let f of it(t))f.cancel();if(t.style.backgroundImage=\"\",t.style.backgroundRepeat=\"\",st()||typeof t.animate!=\"function\"||e.animation===\"none\")return;let o={duration:e.duration,iterations:1/0};if(e.animation===\"pulse\"){t.animate([{opacity:1,easing:\"ease-in-out\"},{opacity:Ht,easing:\"ease-in-out\"},{opacity:1}],o).startTime=0;return}let r=t.getBoundingClientRect(),c=r.left+scrollX,a=e.animation===\"group-shimmer\"?n??{left:c,top:r.top,width:r.width,height:r.height}:{left:0,top:0,width:document.documentElement.clientWidth||innerWidth,height:innerHeight},l=Math.min(Math.max(a.width*.4,80),at),{width:s,image:i}=zt(l),u=c-a.left+(r.top-a.top)*Pt,h=e.duration*Lt/($t+at);t.style.backgroundImage=i,t.style.backgroundSize=`${s}px 100%`,t.style.backgroundRepeat=\"repeat-x\",t.animate([{backgroundPosition:`${-u}px 0`},{backgroundPosition:`${s-u}px 0`}],{duration:s*h,iterations:1/0}).startTime=0}var Xt=t=>t.shadowRoot??t.attachShadow({mode:\"open\"});function mt(t,n){let e=Xt(t),o=t.getBoundingClientRect(),r={left:o.left+scrollX,top:o.top,width:o.width,height:o.height},c=lt(t);for(n.forEach((a,l)=>{let s=e.children[l];s||(s=document.createElement(\"div\"),s.setAttribute(L,\"\"),s.style.cssText=`position:absolute;display:block;pointer-events:none;background-color:${W};background-repeat:no-repeat`,e.append(s)),Object.assign(s.style,{left:`${a.x}px`,top:`${a.y}px`,width:`${a.width}px`,height:`${a.height}px`,borderRadius:a.radius});let i=`${Math.round(r.left+a.x)}|${Math.round(a.y)}|${Math.round(a.height)}|${Math.round(r.left)}|${Math.round(r.width)}|${Math.round(r.height)}|${document.documentElement.clientWidth}|${c.animation}|${c.duration}`;s.dataset.motion!==i&&(s.dataset.motion=i,Ft(s,r,c))});e.children.length>n.length;)e.lastElementChild.remove()}var pt=t=>t.parentElement?`${pt(t.parentElement)} > :nth-child(${[...t.parentElement.children].indexOf(t)+1})`:\":root\";function N(t){let n=t?.previousElementSibling,e=n?.querySelector(`:scope > [${B}]`),o=n?.querySelector(`:scope > [${D}]`);if(!n||!e||!o)return;let r=typeof CSSStyleSheet==\"function\"&&\"replaceSync\"in CSSStyleSheet.prototype?new CSSStyleSheet:null;r&&(document.adoptedStyleSheets=[...document.adoptedStyleSheets,r],n[G]=()=>{document.adoptedStyleSheets=document.adoptedStyleSheets.filter(s=>s!==r)});let c=s=>r?.replaceSync(s.size?`${[...s].map(pt).join(\", \")} { visibility: hidden !important; }`:\"\"),a=()=>{if(!o.isConnected||n[I])return l.disconnect();e.getClientRects().length&&mt(o,rt(e,o,{mark:!1,onCovered:c}))},l=new ResizeObserver(a);l.observe(n),document.fonts?.ready.then(a)}var ht=self,ft=Symbol.for(P),dt=ht[ft];ht[ft]=N;Array.isArray(dt)&&dt.forEach(N);N(document.currentScript);})();", Ur = {
	light: {
		base: "rgb(0 0 0 / 0.07)",
		highlight: "rgb(255 255 255 / 0.6)"
	},
	dark: {
		base: "rgb(255 255 255 / 0.08)",
		highlight: "rgb(255 255 255 / 0.1)"
	}
};
({ ...Ur });
function Wr(e = {}, t = null) {
	let n = {}, r = t && (e[t] ?? Ur[t]);
	return r && (n["--skullet-base"] = r.base, n["--skullet-highlight"] = r.highlight), e.radius && (n["--skullet-radius"] = e.radius), e.animation && (n["--skullet-animation"] = e.animation), e.speed && (n["--skullet-speed"] = e.speed), e.text?.top && (n["--skullet-text-top"] = e.text.top), e.text?.bottom && (n["--skullet-text-bottom"] = e.text.bottom), n;
}
var Gr = (e) => Object.entries(e).map(([e, t]) => `${e}: ${t};`).join(" ");
function Kr({ theme: e = {}, mode: t, text: n, selector: r = ":root" }) {
	let i = {
		...e,
		text: {
			...e.text,
			...n
		}
	}, a = t ?? (e.light || e.dark ? "system" : null), o = Wr(i, a === "dark" ? "dark" : a ? "light" : null), s = [];
	if (Object.keys(o).length && s.push(`${r} { ${Gr(o)} }`), a === "system") {
		let t = Wr({ dark: e.dark }, "dark");
		s.push(`@media (prefers-color-scheme: dark) { ${r} { ${Gr(t)} } }`);
	}
	return s.join("\n");
}
var qr = /* @__PURE__ */ new Map(), Jr, Q = null, Yr = 0;
function Xr() {
	try {
		return new URLSearchParams(location.search).has("skullet-debug") || localStorage.getItem("skullet:debug") === "1";
	} catch {
		return !1;
	}
}
var Zr = () => Jr ??= typeof window < "u" && Xr(), Qr = (e) => Zr() || !!e?.closest("[skullet-debug]");
function $r(e) {
	Jr = e, e ? ii() : ai();
}
function ei(e, t) {
	!e || !Qr(e) || (qr.set(e, {
		state: "loading",
		source: t
	}), ni());
}
function ti(e, t) {
	!e || !Qr(e) || (qr.set(e, {
		...qr.get(e),
		state: "shown",
		moved: t
	}), ni());
}
function ni() {
	ii(), cancelAnimationFrame(Yr), si();
}
var ri = "\n:host { all: initial; }\n.box { position: fixed; box-sizing: border-box; border: 1px dashed; border-radius: 4px; }\n.label {\n  position: absolute; left: -1px; bottom: 100%; margin-bottom: 2px;\n  padding: 1px 6px; border-radius: 4px; white-space: nowrap;\n  font: 500 11px/16px ui-monospace, SFMono-Regular, Menlo, monospace; color: #fff;\n}\n.loading { border-color: #3b82f6; } .loading .label { background: #3b82f6; }\n.still { border-color: #22c55e; } .still .label { background: #16a34a; }\n.moved { border-color: #ef4444; border-style: solid; } .moved .label { background: #dc2626; }\n.panel {\n  position: fixed; right: 12px; bottom: 12px; display: flex; gap: 8px; align-items: center;\n  padding: 6px 10px; border-radius: 8px; background: #111; color: #fff; pointer-events: auto;\n  font: 500 12px/16px ui-sans-serif, system-ui, sans-serif; box-shadow: 0 4px 16px rgb(0 0 0 / 0.3);\n}\n.panel label { display: flex; gap: 4px; align-items: center; cursor: pointer; }\n";
function ii() {
	if (typeof document > "u") return;
	if (!Q?.isConnected) {
		Q = document.createElement("div"), Q.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:2147483647";
		let e = Q.attachShadow({ mode: "open" });
		e.innerHTML = `<style>${ri}</style><div class="boxes"></div>`, document.body.append(Q);
	}
	let e = Q.shadowRoot;
	if (Jr && !e.querySelector(".panel")) {
		let t = document.createElement("div");
		t.className = "panel", t.innerHTML = "skullet debug <label><input type=\"checkbox\" class=\"xray\"> x-ray</label>", t.querySelector(".xray").addEventListener("change", (e) => {
			document.documentElement.toggleAttribute(Dr, e.target.checked);
		}), e.append(t);
	}
	Yr ||= requestAnimationFrame(si);
}
function ai() {
	Q?.shadowRoot?.querySelector(".panel")?.remove(), document.documentElement.removeAttribute(Dr), ![...qr.keys()].some((e) => Qr(e)) && (cancelAnimationFrame(Yr), Yr = 0, Q?.remove(), Q = null);
}
var oi = ({ state: e, source: t, moved: n }) => {
	let r = t ? ` \xB7 ${t}` : "";
	return e === "loading" ? {
		kind: "loading",
		text: `skeleton${r}`
	} : !n || n.width === 0 && n.height === 0 ? {
		kind: "still",
		text: `\u2713 no movement${r}`
	} : {
		kind: "moved",
		text: `\u2717 moved ${n.width}\xD7${n.height}px${r}`
	};
};
function si() {
	if (Yr = 0, !Q?.shadowRoot) return;
	let e = Q.shadowRoot.querySelector(".boxes");
	for (let e of qr.keys()) e.isConnected && Qr(e) || qr.delete(e);
	let t = [...qr];
	for (; e.children.length > t.length;) e.lastElementChild.remove();
	t.forEach(([t, n], r) => {
		let i = e.children[r];
		i || (i = e.appendChild(document.createElement("div")), i.innerHTML = "<span class=\"label\"></span>");
		let a = t.getBoundingClientRect(), { kind: o, text: s } = oi(n);
		i.className = `box ${o}`, Object.assign(i.style, {
			left: `${a.left - 2}px`,
			top: `${a.top - 2}px`,
			width: `${a.width + 4}px`,
			height: `${a.height + 4}px`
		}), i.firstElementChild.textContent = s;
	}), (Jr || qr.size) && (Yr = requestAnimationFrame(si));
}
var ci, li = () => ci ??= /jsdom/.test(navigator.userAgent) ? null : document.createElement("canvas").getContext("2d"), ui = (e, t) => e ? {
	left: Math.max(e.left, t.left),
	right: Math.min(e.right, t.right),
	top: Math.max(e.top, t.top),
	bottom: Math.min(e.bottom, t.bottom)
} : t, di = (e) => [
	[e.left, e.top],
	[e.right, e.top],
	[e.right, e.bottom],
	[e.left, e.bottom]
], fi = (e, t) => Math.abs(e[0] - t[0]) < 1 && Math.abs(e[1] - t[1]) < 1;
function pi(e, t) {
	let n = Math.min(t.right - t.left, t.bottom - t.top), r = (e) => e.endsWith("%") ? parseFloat(e) / 100 * n : parseFloat(e) || 0;
	return [
		r(e.borderTopLeftRadius),
		r(e.borderTopRightRadius),
		r(e.borderBottomRightRadius),
		r(e.borderBottomLeftRadius)
	];
}
function mi(e, t, n) {
	let r = ui(e, t), i = pi(n, t), a = e ? di(e) : [], o = di(t), s = di(r).map((t, n) => fi(t, o[n]) ? i[n] : e && fi(t, a[n]) ? e.corners[n] : 0), { left: c, right: l, top: u, bottom: d } = r;
	return {
		left: c,
		right: l,
		top: u,
		bottom: d,
		corners: s
	};
}
function hi(e, t, n, r) {
	if (!e) return n;
	let i = di(e), a = di(t).map((t, n) => e.corners[n] > 0 && fi(t, i[n]));
	if (!a.some(Boolean)) return n;
	let o = pi(r, t);
	return a.map((t, n) => t ? Math.max(o[n], e.corners[n]) : o[n]).map((e) => `${e}px`).join(" ");
}
var gi = (e, t) => {
	let n = ui(t, e);
	return n.right - n.left >= 2 && n.bottom - n.top >= 2 ? n : null;
}, _i = {
	top: "ascender",
	bottom: "descender"
}, vi = /* @__PURE__ */ new Map(), yi = (e) => [...e.getClientRects?.() ?? []];
function bi(e) {
	let t = `${e.fontStyle} ${e.fontWeight} ${e.fontSize} ${e.fontFamily}`;
	if (vi.has(t)) return vi.get(t);
	let n = li(), r = null;
	if (n) {
		n.font = t;
		let e = n.measureText("H"), i = (e) => n.measureText(e).actualBoundingBoxAscent;
		r = {
			ascent: e.fontBoundingBoxAscent,
			descent: e.fontBoundingBoxDescent,
			ascender: i("bdfhkl"),
			capHeight: e.actualBoundingBoxAscent,
			xHeight: i("xz"),
			descender: n.measureText("gjpqy").actualBoundingBoxDescent
		};
	}
	return vi.set(t, r), r;
}
var xi = {
	ascender: "ascender",
	"cap-height": "capHeight",
	"x-height": "xHeight"
}, Si = (e, t, n, r) => {
	let i = e.getPropertyValue(t).trim();
	return n.includes(i) ? i : r;
};
function Ci(e, t, n) {
	let r = bi(t);
	if (!r) {
		let t = Math.min(n * .72, e.bottom - e.top), r = (e.top + e.bottom) / 2;
		return {
			barTop: r - t / 2,
			barBottom: r + t / 2
		};
	}
	let i = Si(t, "--skullet-text-top", Object.keys(xi), _i.top), a = Si(t, "--skullet-text-bottom", ["baseline", "descender"], _i.bottom), o = r.ascent + r.descent, s = e.top + (e.bottom - e.top - o) / 2 + r.ascent;
	return {
		barTop: s - r[xi[i]],
		barBottom: s + (a === "descender" ? r.descender : 0)
	};
}
var wi = new Set(Pr), Ti = new Set(Nr), Ei = .4, Di = /[,/]\s*0\)$/, Oi = (e, t) => e !== "" && e !== t, ki = [
	"Top",
	"Right",
	"Bottom",
	"Left"
], Ai = (e) => ki.every((t) => Oi(e[`border${t}Style`], "none") && Oi(e[`border${t}Width`], "0px")), ji = (e) => {
	let [t = 0, n = 0, r = 0, i = 0] = (e.replace(/rgba?\([^)]*\)|#\w+/g, "").match(/-?[\d.]+px/g) ?? []).map(parseFloat);
	return e.includes("inset") && !r && !i && t === 0 != (n === 0) && Math.abs(t + n) <= 2;
}, Mi = (e) => Oi(e, "none") && !e.split(/,(?![^(]*\))/).every(ji), Ni = (e) => Oi(e.backgroundColor, "transparent") && !Di.test(e.backgroundColor) || Oi(e.backgroundImage, "none") || Mi(e.boxShadow) || Ai(e), Pi = (e) => wi.has(e.localName), Fi = (e) => Ti.has(e.localName) && !e.firstElementChild && !e.textContent?.trim(), Ii = (e) => {
	let t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT), n = document.createRange(), r = [], i = 0;
	for (; t.nextNode();) {
		let e = t.currentNode;
		if (e.nodeType === Node.TEXT_NODE) {
			let t = e.parentElement;
			if (!e.textContent?.trim() || !t) continue;
			i++;
			let a = t.getBoundingClientRect();
			if (a.width <= 1 || a.height <= 1) continue;
			n.selectNodeContents(e), r.push(yi(n).filter((e) => e.width || e.height));
		} else Fi(e) && (i++, r.push([...e.getClientRects()]));
	}
	if (!r.some((e) => e.length)) return i;
	let a = (parseFloat(getComputedStyle(e).fontSize) || 16) * Ei, o = (e, t) => Math.min(e.bottom, t.bottom) - Math.max(e.top, t.top) >= Math.min(e.height, t.height) / 2 && Math.max(e.left, t.left) - Math.min(e.right, t.right) <= a, s = r.map((e, t) => t), c = (e) => s[e] === e ? e : s[e] = c(s[e]);
	for (let e = 0; e < r.length; e++) for (let t = e + 1; t < r.length; t++) r[e].some((e) => r[t].some((t) => o(e, t))) && (s[c(t)] = c(e));
	return new Set(r.map((e, t) => c(t))).size;
}, Li = (e, t) => e.hasAttribute("skullet-block") || Pi(e) || Ni(t) && Ii(e) <= 1;
function Ri(e, t) {
	if (parseFloat(t.borderRadius) || !e.parentElement) return t.borderRadius || "0px";
	let n = e.parentElement, r = getComputedStyle(n), i = e.getBoundingClientRect(), a = n.getBoundingClientRect();
	return Math.abs(i.width - a.width) < 1 && Math.abs(i.height - a.height) < 1 && r.overflow !== "visible" ? r.borderRadius : t.borderRadius || "0px";
}
function zi(e) {
	e.sort((e, t) => e.left - t.left);
	let t = [];
	for (let n of e) {
		let e = t.find((e) => {
			let t = Math.min(e.bottom, n.bottom) - Math.max(e.top, n.top), r = Math.min(e.bottom - e.top, n.bottom - n.top), i = n.left - e.right;
			return t >= r / 2 && i <= Math.max(e.fontSize, n.fontSize) * Ei;
		});
		e ? (e.left = Math.min(e.left, n.left), e.right = Math.max(e.right, n.right), e.top = Math.min(e.top, n.top), e.bottom = Math.max(e.bottom, n.bottom), e.fontSize = Math.max(e.fontSize, n.fontSize), e.barTop = Math.min(e.barTop, n.barTop), e.barBottom = Math.max(e.barBottom, n.barBottom)) : t.push({ ...n });
	}
	return t.map((e) => {
		let t = e.barBottom - e.barTop;
		return {
			x: e.left,
			y: e.barTop,
			width: e.right - e.left,
			height: t,
			radius: e.radius || `${Math.round(t / 3)}px`
		};
	});
}
function Bi(e, t, { mark: n = !0, onCovered: r } = {}) {
	let i = t.getBoundingClientRect(), a = t.offsetWidth ? i.width / t.offsetWidth : 1, o = t.offsetHeight ? i.height / t.offsetHeight : 1, s = (e) => ({
		left: (e.left - i.left) / a,
		right: (e.right - i.left) / a,
		top: (e.top - i.top) / o,
		bottom: (e.bottom - i.top) / o
	}), c = [], l = [], u = /* @__PURE__ */ new Set(), d = document.createRange(), f = (e, t, n) => {
		let r = gi(e, n);
		if (!r) return;
		let i = parseFloat(t.fontSize) || 16, a = s(r);
		l.push({
			...a,
			fontSize: i,
			...Ci(a, t, i),
			radius: t.getPropertyValue("--skullet-radius").trim()
		});
	}, p = (e, t) => {
		let n = e.data.search(/\S/);
		if (n < 0 || !e.parentElement) return;
		d.setStart(e, n), d.setEnd(e, e.data.trimEnd().length);
		let r = getComputedStyle(e.parentElement);
		for (let e of yi(d)) f(e, r, t);
	}, m = (e, t) => {
		for (let n of e.childNodes) {
			if (n.nodeType === Node.TEXT_NODE) {
				p(n, t);
				continue;
			}
			if (n.nodeType !== Node.ELEMENT_NODE) continue;
			let e = n;
			if (e.hasAttribute("skullet-ignore") || e.hasAttribute("skullet-own")) continue;
			let r = getComputedStyle(e);
			if (r.display === "none") continue;
			if (Li(e, r)) {
				let n = gi(e.getBoundingClientRect(), t);
				if (n) {
					let i = s(n);
					c.push({
						x: i.left,
						y: i.top,
						width: i.right - i.left,
						height: i.bottom - i.top,
						radius: hi(t, n, Ri(e, r), r)
					});
				}
				Pi(e) || u.add(e);
				continue;
			}
			if (Fi(e)) {
				for (let n of e.getClientRects()) f(n, r, t);
				continue;
			}
			let i = r.overflowX !== "visible" || r.overflowY !== "visible";
			m(e, i ? mi(t, e.getBoundingClientRect(), r) : t);
		}
	};
	if (m(e, null), r?.(u), !n) return [...c, ...zi(l)];
	for (let t of e.querySelectorAll(`[${xr}]`)) u.has(t) || t.removeAttribute(xr);
	for (let e of u) e.hasAttribute(xr) || e.setAttribute(xr, "");
	return [...c, ...zi(l)];
}
var Vi = (e) => typeof matchMedia < "u" && matchMedia(e).matches, Hi = () => typeof Element < "u" && typeof Element.prototype.animate == "function", Ui = () => !Hi() || Vi("(prefers-reduced-motion: reduce)"), Wi = () => Vi("(prefers-reduced-transparency: reduce)"), Gi = (e) => e.getAnimations?.() ?? [], Ki = .7, qi = 1280, Ji = 320, Yi = 2.5, Xi = .45, Zi = [
	"shimmer",
	"group-shimmer",
	"pulse",
	"none"
];
function Qi(e) {
	let t = getComputedStyle(e), n = (e, n, r) => {
		let i = t.getPropertyValue(e).trim();
		return n.includes(i) ? i : r;
	}, r = n("--skullet-animation", Zi, "shimmer"), i = n("--skullet-speed", ["slow", "fast"], "slow");
	return {
		animation: r,
		duration: Mr[r === "pulse" ? "pulse" : "shimmer"][i]
	};
}
var $i = 20, ea = Math.sin($i * Math.PI / 180), ta = Math.cos($i * Math.PI / 180), na = ea / ta, ra = ta, ia = `${90 + $i}deg`, aa = .85, $ = 12, oa = (e) => (1 - Math.cos(Math.PI * e)) / 2;
function sa(e) {
	let t = e * Yi, n = (t, n) => `color-mix(in srgb, ${kr} ${(n * 100).toFixed(1)}%, transparent) ${(t * e).toFixed(2)}px`, r = [];
	for (let e = 0; e <= $; e++) r.push(n(e / $ * aa, oa(e / $)));
	for (let e = 1; e <= $; e++) r.push(n(aa + e / $ * (1 - aa), oa(1 - e / $)));
	return {
		width: t / ta,
		image: `repeating-linear-gradient(${ia}, ${r.join(", ")}, transparent ${t.toFixed(2)}px)`
	};
}
function ca(e, t, n = Qi(e)) {
	for (let t of Gi(e)) t.cancel();
	if (e.style.backgroundImage = "", e.style.backgroundRepeat = "", Ui() || typeof e.animate != "function" || n.animation === "none") return;
	let r = {
		duration: n.duration,
		iterations: 1 / 0
	};
	if (n.animation === "pulse") {
		e.animate([
			{
				opacity: 1,
				easing: "ease-in-out"
			},
			{
				opacity: Xi,
				easing: "ease-in-out"
			},
			{ opacity: 1 }
		], r).startTime = 0;
		return;
	}
	let i = e.getBoundingClientRect(), a = i.left + scrollX, o = n.animation === "group-shimmer" ? t ?? {
		left: a,
		top: i.top,
		width: i.width,
		height: i.height
	} : {
		left: 0,
		top: 0,
		width: document.documentElement.clientWidth || innerWidth
	}, { width: s, image: c } = sa(Math.min(Math.max(o.width * .4, 80), Ji)), l = a - o.left + (i.top - o.top) * na, u = n.duration * Ki / (qi + Ji);
	e.style.backgroundImage = c, e.style.backgroundSize = `${s}px 100%`, e.style.backgroundRepeat = "repeat-x", e.animate([{ backgroundPosition: `${-l}px 0` }, { backgroundPosition: `${s - l}px 0` }], {
		duration: s * u,
		iterations: 1 / 0
	}).startTime = 0;
}
function la(e) {
	if (Ui()) return null;
	let t = Qi(e);
	return t.animation !== "shimmer" && t.animation !== "group-shimmer" ? null : t.duration * Ki / (qi + Ji);
}
var ua = (e) => e.shadowRoot ?? e.attachShadow({ mode: "open" }), da = (e) => e.shadowRoot ? [...e.shadowRoot.children] : [];
function fa(e, t) {
	let n = ua(e), r = e.getBoundingClientRect(), i = {
		left: r.left + scrollX,
		top: r.top,
		width: r.width,
		height: r.height
	}, a = Qi(e);
	for (t.forEach((e, t) => {
		let r = n.children[t];
		r || (r = document.createElement("div"), r.setAttribute("skullet-rect", ""), r.style.cssText = `position:absolute;display:block;pointer-events:none;background-color:${Or};background-repeat:no-repeat`, n.append(r)), Object.assign(r.style, {
			left: `${e.x}px`,
			top: `${e.y}px`,
			width: `${e.width}px`,
			height: `${e.height}px`,
			borderRadius: e.radius
		});
		let o = `${Math.round(i.left + e.x)}|${Math.round(e.y)}|${Math.round(e.height)}|${Math.round(i.left)}|${Math.round(i.width)}|${Math.round(i.height)}|${document.documentElement.clientWidth}|${a.animation}|${a.duration}`;
		r.dataset.motion !== o && (r.dataset.motion = o, ca(r, i, a));
	}); n.children.length > t.length;) n.lastElementChild.remove();
}
var pa = 120, ma = 72, ha = 3, ga = 60, _a = 150, va = 400, ya = 1.5, ba = 1e3, xa = 1e3, Sa = /* @__PURE__ */ new Set([
	"filter",
	"transform",
	"translate",
	"scale",
	"rotate",
	"clipPath",
	"easing",
	"composite"
]), Ca = -1 / 0, wa = !1;
function Ta() {
	if (!(wa || typeof addEventListener > "u")) {
		wa = !0;
		for (let e of [
			"wheel",
			"touchmove",
			"keydown"
		]) addEventListener(e, () => Ca = performance.now(), {
			passive: !0,
			capture: !0
		});
	}
}
var Ea = /* @__PURE__ */ new WeakMap();
function Da(e, { served: t, refetch: n }) {
	Ta();
	let r = Ea.get(e)?.since ?? performance.now();
	Ea.set(e, {
		since: t ? -1 / 0 : r,
		refetch: n
	});
}
function Oa(e) {
	let t = [], n = (e) => {
		for (let r of e.children) {
			let e = [...r.childNodes].some((e) => e.nodeType === Node.TEXT_NODE && e.textContent?.trim());
			!r.firstElementChild || e || r.localName === "svg" ? t.push(r) : n(r);
		}
	};
	return n(e), t;
}
function ka(e, t) {
	for (let n = e; n && n !== t; n = n.parentElement) {
		let e = n.parentElement;
		if (!e) break;
		if ([...e.children].filter((e) => e.localName === n.localName && e.className === n.className).length >= 3) return n;
	}
	return e;
}
var Aa = (e, t) => {
	let n = t.left + t.width / 2, r = t.top + t.height / 2;
	return n >= e.left && n <= e.right && r >= e.top && r <= e.bottom;
};
function ja(e) {
	let { left: t, top: n, right: r, bottom: i } = e.getBoundingClientRect();
	for (let a of e.querySelectorAll(`:scope > [${br}]`)) {
		let e = a.getBoundingClientRect();
		t = Math.min(t, e.left), n = Math.min(n, e.top), r = Math.max(r, e.right), i = Math.max(i, e.bottom);
	}
	return new DOMRect(t, n, r - t, i - n);
}
var Ma = (e, t) => Math.min(Math.max(e, 0), t), Na = -1 / 0;
function Pa(e, t, n, r, i) {
	let a = performance.now();
	a - Na > _a && (Na = a);
	let o = a - Na, s = t.getBoundingClientRect(), c = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), u = (e) => parseFloat(getComputedStyle(e).fontSize) || 16;
	for (let t of Oa(e)) {
		let n = ka(t, e), r = c.get(n);
		r || (r = {
			rect: n.getBoundingClientRect(),
			size: 0
		}, c.set(n, r));
		let i = u(t);
		r.size = Math.max(r.size, i), l.set(t, {
			unit: r,
			size: i
		});
	}
	let d = (e) => {
		let t = n(e);
		return t === null ? null : Ma(t, ba) + Math.max(r.delay ?? 0, 0);
	};
	return {
		kind: "sequence",
		duration: i,
		enter: r.enter,
		pieceDelay: (e) => {
			let t = l.get(e);
			return t ? d({
				rect: e.getBoundingClientRect(),
				unit: t.unit.rect,
				secondary: t.size < t.unit.size,
				reveal: s,
				late: o
			}) : null;
		},
		boneDelay: (e) => {
			let t = [...c.values()].find((t) => Aa(t.rect, e));
			return d({
				rect: e,
				unit: t?.rect ?? null,
				secondary: !!t && e.height < t.size * .8,
				reveal: s,
				late: o
			});
		}
	};
}
function Fa(e, t) {
	if (!e) return;
	let n = {};
	for (let [r, i] of Object.entries(e)) Sa.has(r) ? n[r] = i : r !== "opacity" && t(r);
	return n;
}
function Ia(e, t, n, r = () => {}) {
	let i = Ea.get(t);
	Ea.delete(t);
	let a = n;
	for (; a.choose;) {
		let { choose: n, ...r } = a;
		a = {
			...r,
			...n({
				content: e,
				reveal: t,
				waited: i ? performance.now() - i.since : 1 / 0,
				input: performance.now() - Ca < va,
				refetch: !!i?.refetch,
				height: e.getBoundingClientRect().height,
				pieces: Oa(e).length
			})
		};
	}
	let o = Ma(a.duration ?? 200, xa);
	if (a = {
		...a,
		delay: Math.min(a.delay ?? 0, ba)
	}, !o) return { kind: "instant" };
	let s = Fa(a.enter, r);
	if (a.wipe) {
		let e = ja(t);
		if (e.width * e.height <= innerWidth * innerHeight * ya) return {
			kind: "wipe",
			wipe: a.wipe,
			start: performance.now() + (a.delay ?? 0),
			duration: o,
			reveal: e,
			enter: s
		};
	} else if (typeof a.order == "function") return Pa(e, t, a.order, {
		...a,
		enter: s
	}, o);
	return {
		kind: "together",
		delay: Math.max(a.delay ?? 0, 0),
		duration: o,
		enter: s
	};
}
var La = ({ rect: e, reveal: t }) => {
	let n = (e.top - t.top) / Math.max(t.height, 1), r = (e.left - t.left) / Math.max(t.width, 1);
	return Ma(n * .8 + r * .2, 1) * 320;
}, Ra = (e) => e.bottom > 0 && e.top < innerHeight, za = ({ rect: e, unit: t, secondary: n, late: r }) => {
	if (!t) return Ra(e) ? 0 : null;
	if (!Ra(t)) return null;
	let i = Ma(t.top / innerHeight, 1) * 320;
	return Math.max(i - r, 0) + (n ? ga : 0);
}, Ba = { duration: 0 }, Va = { order: "together" }, Ha = { order: La }, Ua = (e) => e.input || e.waited < 150 ? Ba : e.refetch ? {
	order: "together",
	duration: pa
} : null, Wa = (e) => e.height < ma || e.pieces <= ha ? Va : { order: za }, Ga = {
	hold: 150,
	choose: (e) => Ua(e) ?? Wa(e)
}, Ka = new Set(Pr), qa = "script, noscript, template, base, meta, link", Ja = /* @__PURE__ */ new Set([
	"iframe",
	"object",
	"embed"
]), Ya = /* @__PURE__ */ new Set([
	"src",
	"srcset",
	"sizes",
	"poster",
	"data",
	"srcdoc",
	"action",
	"formaction",
	"value",
	"alt",
	xr
]), Xa = (e) => e.replace(/[A-Z]/g, "X").replace(/[a-z]/g, "x").replace(/\d/g, "0");
function Za(e, t) {
	let n = Xa(t.data);
	t.data = n;
	let r = e.parentElement, i = li();
	if (!r || !i || !n.trim()) return;
	let a = getComputedStyle(r);
	i.font = `${a.fontStyle} ${a.fontWeight} ${a.fontSize} ${a.fontFamily}`;
	let o = (e) => {
		let t = e.replace(/\s+/g, " ");
		return a.textTransform === "uppercase" ? t.toUpperCase() : a.textTransform === "lowercase" ? t.toLowerCase() : t;
	}, s = (i.measureText(o(e.data)).width - i.measureText(o(n)).width) / o(n).length;
	if (Math.abs(s) < .01) return;
	let c = document.createElement("span");
	c.style.letterSpacing = `${(parseFloat(a.letterSpacing) || 0) + s}px`, t.replaceWith(c), c.append(t);
}
function Qa(e) {
	for (let t of e.querySelectorAll(qa)) t.remove();
	for (let t of e.querySelectorAll("*")) if (Ja.has(t.localName)) {
		let e = document.createElement("span");
		e.style.cssText = t.getAttribute("style") ?? "", e.style.display ||= "inline-block", t.replaceWith(e);
	} else {
		for (let { name: e, value: n } of [...t.attributes]) {
			let r = e.toLowerCase();
			(r.startsWith("on") || Ya.has(r) || r.endsWith("href") && /^\s*javascript:/i.test(n)) && t.removeAttribute(e);
		}
		t.localName === "img" && t.setAttribute("alt", "");
	}
	for (let t of e.querySelectorAll("video source, picture source")) t.remove();
}
function $a(e, t) {
	let n = e.cloneNode(!0), r = NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, i = document.createTreeWalker(e, r), a = document.createTreeWalker(n, r), o = [], s = [];
	for (; i.nextNode() && a.nextNode();) {
		let e = i.currentNode, n = a.currentNode;
		e.nodeType === Node.TEXT_NODE ? t && o.push([e, n]) : (Ka.has(e.localName) || Ja.has(e.localName)) && s.push([e, n]);
	}
	for (let [e, t] of s) {
		let n = e.getBoundingClientRect();
		t.style.boxSizing = "border-box", t.style.width = `${n.width}px`, n.width && n.height ? (t.style.maxWidth = "100%", t.style.height = "auto", t.style.aspectRatio = `${n.width} / ${n.height}`) : t.style.height = `${n.height}px`;
	}
	for (let [e, t] of o) Za(e, t);
	return Qa(n), n.innerHTML;
}
function eo(e) {
	let t = document.createElement("template");
	return t.innerHTML = e, Qa(t.content), t.content;
}
var to = (e, t) => [...e.children].map((e) => {
	let n = [...e.classList].sort().join("."), r = t > 1 && e.firstElementChild ? `(${to(e, t - 1)})` : "";
	return `${e.localName}${n ? `.${n}` : ""}${r}`;
}).join(","), no = (e) => {
	let t = 5381;
	for (let n = 0; n < e.length; n++) t = t * 33 ^ e.charCodeAt(n);
	return (t >>> 0).toString(36);
};
function ro(e) {
	let t = to(e, 2);
	return t ? `${location.pathname}|${no(t)}` : null;
}
var io = !1;
try {
	io = !1;
} catch {
	io = !1;
}
var ao = io, oo = /* @__PURE__ */ new Set();
function so(e, t) {
	!ao || oo.has(e) || (oo.add(e), console.warn(`[skullet] ${t}`));
}
var co = /^(https?:|\/|data:|blob:)/;
function lo(e) {
	return typeof e == "string" ? co.test(e) ? "" : Xa(e) : Array.isArray(e) ? e.map(lo) : e instanceof Date ? e : e && typeof e == "object" ? Object.fromEntries(Object.entries(e).map(([e, t]) => [e, lo(t)])) : e;
}
var uo = "skullet:shapes", fo = 2, po = 50, mo = 2e4, ho = /* @__PURE__ */ new Map(), go = /* @__PURE__ */ new Map();
function _o(e, t) {
	return go.has(e) || go.set(e, /* @__PURE__ */ new Set()), go.get(e).add(t), () => go.get(e)?.delete(t);
}
function vo(e) {
	for (let t of go.get(e) ?? []) t();
}
function yo() {
	try {
		let e = JSON.parse(localStorage.getItem(uo) ?? "null");
		return e?.v === fo ? e.shapes : {};
	} catch {
		return {};
	}
}
function bo(e) {
	try {
		localStorage.setItem(uo, JSON.stringify({
			v: fo,
			shapes: e
		}));
	} catch {}
}
function xo(e, t) {
	ho.set(e, $a(t, !1));
	let n = $a(t, !0);
	if (n.length > mo) return;
	let r = yo();
	delete r[e], r[e] = n;
	let i = Object.keys(r);
	for (let e of i.slice(0, i.length - po)) delete r[e];
	bo(r);
}
function So(e) {
	return ho.get(e) ?? yo()[e] ?? null;
}
var Co = [
	100,
	90,
	60
].map((e) => `<div ${Cr} style="width:${e}%;height:0.75em;margin:0.5em 0;border-radius:0.25em"></div>`).join(""), wo = new WeakSet(typeof document > "u" ? [] : document.querySelectorAll(`[${pr}]`)), To = /* @__PURE__ */ new WeakMap();
function Eo(e) {
	if (!e) return;
	let t = To.get(e);
	return To.delete(e), t;
}
function Do(e, t) {
	for (let n of e.children) if (n.hasAttribute(t)) return n;
	let n = document.createElement("div");
	return n.setAttribute(t, ""), e.append(n), n;
}
var Oo = (e) => !!e.firstElementChild || !!e.textContent?.trim(), ko = class {
	constructor(e, t = {}) {
		this.root = e, this.options = t, Br(), e[wr] = !0, e.setAttribute(pr, ""), e.setAttribute("aria-hidden", "true"), e.inert = !0, this.ghost = Do(e, mr), this.snapshot = Do(e, hr), this.layer = Do(e, gr), this.hadContent = Oo(this.ghost);
		let n = e.closest(`[${dr}]`);
		n && Da(n, {
			served: wo.has(e),
			refetch: !!t.refetch && this.hadContent
		}), this.choose(), this.measure(), e[Tr]?.(), this.mutations = new MutationObserver(this.schedule), this.mutations.observe(this.ghost, {
			childList: !0,
			subtree: !0,
			characterData: !0,
			attributes: !0
		}), this.resize = typeof ResizeObserver > "u" ? null : new ResizeObserver(this.schedule), this.resize?.observe(e), e.addEventListener("load", this.schedule, !0), addEventListener("resize", this.schedule), document.fonts?.ready.then(this.schedule);
	}
	root;
	options;
	ghost;
	snapshot;
	layer;
	source = null;
	hadContent = !1;
	frame = 0;
	mutations;
	resize;
	schedule = () => {
		this.root.closest(`[${br}]`) || (cancelAnimationFrame(this.frame), this.frame = requestAnimationFrame(() => {
			let e = Oo(this.ghost);
			e !== this.hadContent && (this.hadContent = e, this.choose()), this.measure();
		}));
	};
	choose() {
		let e = "fallback", t = null, n = this.options.exact || wo.has(this.root), r = !!this.ghost.querySelector(`[${Sr}]`);
		if ((n || r) && this.hadContent) e = "ghost";
		else {
			let n = this.options.id ?? ro(this.ghost);
			n && (vo(n), t = So(n)), t ? e = "recall" : this.hadContent && (e = "ghost");
		}
		e !== this.source && (e === "recall" && t ? this.snapshot.replaceChildren(eo(t)) : e === "fallback" ? (this.snapshot.innerHTML = Co, so(`fallback:${this.options.id}`, `Nothing to draw a skeleton from${this.options.id ? ` for "${this.options.id}"` : ""}. Pass \`sample\` data, or an \`id\` so its shape is remembered after the first load. For a lone placeholder box, use \`SkeletonBox\`.`)) : this.snapshot.replaceChildren()), this.ghost.toggleAttribute(yr, e !== "ghost"), this.snapshot.toggleAttribute(yr, e === "ghost"), this.source = e, ei(this.root.closest(`[${dr}]`), e === "recall" ? "remembered shape" : e === "fallback" ? "fallback" : this.options.exact ? "data" : wo.has(this.root) ? "server render" : "sample");
	}
	measure() {
		let e = this.source === "ghost" ? this.ghost : this.snapshot;
		fa(this.layer, Bi(e, this.layer));
		let t = this.root.closest(`[${dr}]`);
		t && To.set(t, {
			width: this.root.offsetWidth,
			height: this.root.offsetHeight,
			guessed: !(this.options.exact && this.source === "ghost"),
			images: [...e.querySelectorAll("img")].map((e) => e.getBoundingClientRect().height)
		});
	}
	destroy() {
		cancelAnimationFrame(this.frame), this.mutations.disconnect(), this.resize?.disconnect(), this.root.removeEventListener("load", this.schedule, !0), removeEventListener("resize", this.schedule), Vr();
	}
}, Ao = 250, jo = class {
	constructor(e, t = {}) {
		this.element = e, this.options = t, this.key = t.id ?? ro(e), this.untrack = this.key ? _o(this.key, () => this.save()) : () => {}, (ao || Qr(e)) && this.check(), this.save(), this.mutations = new MutationObserver(this.schedule), this.mutations.observe(e, {
			childList: !0,
			subtree: !0,
			characterData: !0
		}), this.resize = typeof ResizeObserver > "u" ? null : new ResizeObserver(this.schedule), this.resize?.observe(e), e.addEventListener("load", this.schedule, !0);
	}
	element;
	options;
	key;
	timer;
	mutations;
	resize;
	untrack;
	schedule = () => {
		clearTimeout(this.timer), this.timer = setTimeout(() => this.save(), Ao);
	};
	save() {
		clearTimeout(this.timer), this.key && this.element.isConnected && this.element.offsetHeight && xo(this.key, this.element);
	}
	check() {
		let { data: e, id: t, rendered: n, sample: r } = this.options, i = t ? `<Skeleton id="${t}">` : "<Skeleton>", a = this.element.closest(`[${dr}]`), o = Eo(a);
		if (!o) return;
		o.guessed && n && !r && e != null && so(`sample:${this.key}`, `${i} has no \`sample\`, so a first load guesses its shape${t ? "" : " and it can't be remembered"}. Pass this to make it exact:
  sample={${JSON.stringify(lo(e))}}`);
		let s = [...this.element.querySelectorAll("img")].filter((e) => !e.complete);
		Promise.all(s.map((e) => new Promise((t) => {
			e.addEventListener("load", t, { once: !0 }), e.addEventListener("error", t, { once: !0 });
		}))).then(() => {
			if (!this.element.isConnected) return;
			let e = this.element.offsetWidth, t = this.element.offsetHeight;
			if (ti(a, {
				width: e - o.width,
				height: t - o.height
			}), Math.abs(e - o.width) <= 1 && Math.abs(t - o.height) <= 1) return;
			let r = [...this.element.querySelectorAll("img")].filter((e, t) => (o.images[t] ?? 0) < 1 && e.getBoundingClientRect().height >= 1).map((e) => e.currentSrc.split("/").pop() || "an image");
			r.length ? so(`unsized:${this.key}`, `${i}'s skeleton had no room for ${r.length === 1 ? "an image" : `${r.length} images`} (${r.slice(0, 3).join(", ")}${r.length > 3 ? ", …" : ""}), so the layout jumped when they loaded. Give each \`width\` and \`height\` attributes, or an \`aspect-ratio\`, so its space is known before it loads.`) : so(`jump:${this.key}`, o.guessed ? `${i}'s skeleton was ${o.width}\xD7${o.height}px but its content is ${e}\xD7${t}px, so the layout jumped on reveal. ${n ? "Pass `sample` data shaped like the real thing" : "Pass an `id` so its shape is remembered"}, and give images a size.` : `${i}'s skeleton was drawn from the data on screen (${o.width}\xD7${o.height}px), but the new data is ${e}\xD7${t}px, so the layout jumped on reveal. When new data adds to what's shown \u2014 another page of a list \u2014 give the addition a reveal of its own.`);
		});
	}
	destroy() {
		this.save(), clearTimeout(this.timer), this.mutations.disconnect(), this.resize?.disconnect(), this.element.removeEventListener("load", this.schedule, !0), this.untrack();
	}
}, Mo = () => {}, No = (e) => {
	if (e.loading !== "lazy") return !1;
	let t = e.getBoundingClientRect();
	return t.bottom < -innerHeight || t.top > innerHeight * 2;
}, Po = (e) => [...e.querySelectorAll("img")].filter((e) => !e.complete && !No(e));
function Fo(e) {
	let t = e.complete ? Promise.resolve() : new Promise((t) => {
		e.addEventListener("load", () => t(), { once: !0 }), e.addEventListener("error", () => t(), { once: !0 });
	});
	return Promise.race([t.then(() => e.decode?.()).then(Mo, Mo), new Promise((e) => setTimeout(e, jr))]);
}
var Io = 360, Lo = 2, Ro = 600, zo = 40, Bo = zo / ra, Vo = 320, Ho = 120, Uo = .45, Wo = (e) => e.left + e.top * na, Go = (e) => e.width + e.height * na, Ko = (e, t) => Wo(t) - Bo + (Go(t) + 2 * Bo) * e, qo = {
	start: -1 / 0,
	origin: 0,
	speed: 1
};
function Jo(e) {
	let t = e.querySelector(`:scope > [${br}] [${gr}]`), n = t && la(t);
	if (!n) return null;
	let r = ja(e);
	if (r.width * r.height > innerWidth * innerHeight * ya) return null;
	let i = Wo(r), a = i + Go(r), o = performance.now(), s = o - qo.start;
	s <= _a && (i - qo.origin) / qo.speed >= s && (a - qo.origin) / qo.speed - s <= Ro || (qo = {
		start: o,
		origin: i,
		speed: Math.max(Lo / n, (a - i) / Io)
	});
	let { start: c, origin: l, speed: u } = qo;
	return {
		delay: (i - Bo - l) / u - (o - c),
		duration: (a - i + 2 * Bo) / u
	};
}
var Yo = (e) => (t, { rect: n, reveal: r }) => {
	let i = (Ko(t, r) - Wo(n)) * ra;
	return `linear-gradient(${ia}, ${Array.from({ length: $ + 1 }, (t, n) => {
		let r = e ? 1 - oa(n / $) : oa(n / $), a = -zo + 2 * zo * n / $;
		return `rgb(0 0 0 / ${r.toFixed(3)}) ${(i + a).toFixed(2)}px`;
	}).join(", ")})`;
}, Xo = "http://www.w3.org/2000/svg", Zo = null, Qo = 0;
function $o() {
	return Zo?.isConnected || (Zo = document.createElementNS(Xo, "svg"), Zo.setAttribute("aria-hidden", "true"), Zo.style.cssText = "position:absolute;width:0;height:0;overflow:hidden", document.body.append(Zo)), Zo;
}
var es = (e, t) => {
	let n = document.createElementNS(Xo, e);
	for (let [e, r] of Object.entries(t)) n.setAttribute(e, String(r));
	return n;
}, ts = {
	mask: Yo(!0),
	out: Yo(!1),
	effect: (e, { rect: t, reveal: n, progress: r }) => {
		if (Wi()) return;
		let i = Wo(t), a = Go(t), o = Vo / 2 / ra, s = () => Ko(r(), n) - i - Ho / ra;
		if (s() - o > a) return;
		let c = 2 * o + t.height * na, l = c / 2, u = t.height / 2, d = Vo / 2 * ra, f = Vo / 2 * na * ra, p = document.createElement("canvas");
		p.width = Math.ceil(c), p.height = Math.ceil(t.height);
		let m = p.getContext("2d");
		if (!m) return;
		let h = m.createLinearGradient(l - d, u - f, l + d, u + f);
		for (let e = 0; e <= $; e++) {
			let t = e / $;
			h.addColorStop(t, `rgb(255 255 255 / ${oa(1 - Math.abs(t * 2 - 1)).toFixed(3)})`);
		}
		m.fillStyle = h, m.fillRect(0, 0, p.width, p.height);
		let g = `skullet-gloss-${++Qo}`, _ = es("filter", {
			id: g,
			"color-interpolation-filters": "sRGB",
			primitiveUnits: "objectBoundingBox"
		}), v = es("feComponentTransfer", {
			in: "SourceGraphic",
			result: "lit"
		});
		for (let e of [
			"R",
			"G",
			"B"
		]) v.append(es(`feFunc${e}`, {
			type: "linear",
			slope: 1 - Uo,
			intercept: Uo
		}));
		let y = es("feImage", {
			href: p.toDataURL(),
			y: 0,
			width: c / t.width,
			height: 1,
			preserveAspectRatio: "none",
			result: "band"
		});
		_.append(v, y, es("feComposite", {
			in: "lit",
			in2: "band",
			operator: "in",
			result: "shine"
		}), es("feComposite", {
			in: "shine",
			in2: "SourceGraphic",
			operator: "over"
		})), $o().append(_), e.style.filter = `url(#${g})`;
		let ee = () => {
			let n = s();
			n - o > a || !e.isConnected ? (e.style.filter.includes(g) && (e.style.filter = ""), _.remove()) : (y.setAttribute("x", ((n - l - u * na) / t.width).toFixed(4)), requestAnimationFrame(ee));
		};
		ee();
	}
}, ns = {
	together: Va,
	sequence: Ha,
	smart: Ga,
	sweep: {
		hold: 150,
		choose: (e) => {
			let t = Ua(e);
			if (t) return t;
			let n = Jo(e.reveal);
			return n ? {
				wipe: ts,
				...n
			} : Wa(e);
		}
	}
}, rs = (e = "smart") => typeof e == "string" ? ns[e] : e, is = () => {}, as = (e) => e.finished.then(is, is), os = /* @__PURE__ */ new WeakMap();
function ss(e, t = 0, n = 200, r = 0, i) {
	return Ui() ? Promise.resolve() : as(e.animate([{
		...i,
		opacity: r
	}, { opacity: 1 }], {
		duration: n,
		delay: t,
		easing: "ease",
		fill: "backwards"
	}));
}
var cs = (e) => !!e.querySelector(`[${gr}], [${mr}], :scope > [${Sr}]`), ls = (e, t) => Math.abs(e.left - t.left) < 2 && Math.abs(e.top - t.top) < 2 && Math.abs(e.width - t.width) < 2 && Math.abs(e.height - t.height) < 2, us = /* @__PURE__ */ new WeakMap();
function ds(e) {
	for (let t of us.get(e) ?? []) t.remove();
	us.delete(e);
}
function fs(e, t) {
	let n = Po(e), r = [...t.children].some((t) => t !== e && t.hasAttribute("skullet-pane") && cs(t));
	if (n.length && r) {
		for (let e of n) e.style.opacity = "0";
		queueMicrotask(() => {
			if (!e.isConnected) return;
			let r = t.getBoundingClientRect(), i = [...t.querySelectorAll(`:scope > [${br}] [${gr}]`)].flatMap(da), a = us.get(t) ?? /* @__PURE__ */ new Set();
			us.set(t, a);
			for (let e of n) {
				let n = e.getBoundingClientRect(), o = i.find((e) => ls(e.getBoundingClientRect(), n)), s = o?.getBoundingClientRect() ?? n, c = document.createElement("div");
				c.setAttribute(_r, ""), Object.assign(c.style, {
					position: "absolute",
					left: `${s.left - r.left - t.clientLeft}px`,
					top: `${s.top - r.top - t.clientTop}px`,
					width: `${s.width}px`,
					height: `${s.height}px`,
					borderRadius: o?.style.borderRadius || getComputedStyle(e).borderRadius,
					backgroundColor: Or,
					backgroundRepeat: "no-repeat",
					pointerEvents: "none"
				}), t.append(c), a.add(c), o && (o.style.visibility = "hidden"), ca(c), Fo(e).then(() => {
					if (a.has(c)) {
						if (a.delete(c), e.style.opacity = "", ss(e), Ui()) return c.remove();
						as(c.animate([{ opacity: 1 }, { opacity: 0 }], {
							duration: 200,
							easing: "ease",
							fill: "forwards"
						})).then(() => c.remove());
					}
				});
			}
		});
	}
}
function ps(e, t) {
	return Ui() ? Promise.resolve() : Promise.all(Oa(e).map((e) => {
		let n = t.pieceDelay(e);
		if (n !== null) return ss(e, n, t.duration, 0, t.enter);
	})).then(is);
}
function ms(e) {
	for (let t of e.querySelectorAll(`:scope > [${br}]`)) {
		for (let e of Gi(t)) e.finish();
		t.style.opacity = "0";
	}
}
function hs(e) {
	let t = 0;
	for (let n of e.querySelectorAll(`:scope > [${br}]`)) if (!cs(n)) {
		t = Math.max(t, parseFloat(getComputedStyle(n).opacity) || 0);
		for (let e of Gi(n)) e.finish();
		n.style.opacity = "0";
	}
	return t;
}
function gs(e, t = "smart", { initial: n = !1 } = {}) {
	let r = _s.get(e);
	return r || (r = vs(e, t, n), _s.set(e, r)), r;
}
var _s = /* @__PURE__ */ new WeakMap();
function vs(e, t, n) {
	let r = e.parentElement, i = rs(t);
	if (cs(e)) {
		r && ds(r);
		let t = Math.max(i.hold ?? 0, 0);
		return t ? (r && os.set(r, {
			kind: "skeleton",
			hold: t
		}), n ? Promise.resolve() : ss(e, t)) : (r && os.delete(r), n ? Promise.resolve() : ss(e));
	}
	if (n || !r) return Promise.resolve();
	let a = hs(r);
	if (a > .01) {
		let t = 200 * (1 - a);
		return os.set(r, {
			kind: "together",
			delay: 0,
			duration: t
		}), ss(e, 0, t, a);
	}
	fs(e, r);
	let o = Ia(e, r, i, (e) => so(`enter:${e}`, `\`enter\` can't set \`${e}\`: only properties that change nothing's layout animate, so the reveal never moves the page.`));
	return os.set(r, o), o.kind === "instant" ? (ms(r), Promise.resolve()) : o.kind === "sequence" ? ps(e, o) : o.kind === "wipe" ? js(e, o, !0) : ss(e, o.delay, o.duration, 0, o.enter);
}
function ys(e) {
	let t = e.getBoundingClientRect(), n = e.offsetParent ?? document.documentElement, r = n.getBoundingClientRect();
	return {
		top: t.top - r.top - n.clientTop,
		left: t.left - r.left - n.clientLeft,
		width: t.width,
		height: t.height
	};
}
function bs(e, t = ys(e)) {
	return Object.assign(e.style, {
		position: "absolute",
		top: `${t.top}px`,
		left: `${t.left}px`,
		width: `${t.width}px`,
		height: `${t.height}px`,
		margin: "0",
		boxSizing: "border-box",
		pointerEvents: "none"
	}), e.inert = !0, e.setAttribute(br, ""), t;
}
var xs = /* @__PURE__ */ new WeakMap();
function Ss(e, t) {
	let n = e.querySelector(`:scope > [${fr}]:not([${br}])`);
	if (!n) return;
	let r = xs.get(e), i = e.getBoundingClientRect().height;
	r?.animation.cancel();
	let a = e.getBoundingClientRect().height, o = r ? i : a - n.getBoundingClientRect().height + t.height;
	if (Math.abs(o - a) < .5) {
		r && Cs(e, r);
		return;
	}
	let { overflow: s, boxSizing: c } = r ?? e.style;
	Object.assign(e.style, {
		overflow: "clip",
		boxSizing: "border-box"
	});
	let l = e.animate([{ height: `${o}px` }, { height: `${a}px` }], {
		duration: Ar,
		easing: "cubic-bezier(0.2, 0, 0, 1)"
	}), u = {
		animation: l,
		overflow: s,
		boxSizing: c
	};
	xs.set(e, u), as(l).then(() => {
		xs.get(e) === u && Cs(e, u);
	});
}
function Cs(e, { overflow: t, boxSizing: n }) {
	xs.delete(e), Object.assign(e.style, {
		overflow: t,
		boxSizing: n
	});
}
function ws(e, t) {
	let n = parseFloat(getComputedStyle(e).opacity), r = Number.isNaN(n) ? 1 : n;
	for (let t of Gi(e)) t.cancel();
	As(e), e.style.filter = "";
	let i = e.parentElement;
	i && !cs(e) && ds(i);
	let a = bs(e, t), o = (t, n) => Hi() ? as(e.animate([{ opacity: r }, { opacity: 0 }], {
		duration: n * r,
		delay: t,
		easing: "ease",
		fill: "forwards"
	})) : (e.style.opacity = "0", Promise.resolve());
	return Promise.resolve().then(() => {
		let t = i && os.get(i), n = Ui() || t?.kind === "instant";
		if (i && !n && Ss(i, a), t?.kind === "skeleton") return o(t.hold, 200);
		if (n) e.style.opacity = "0";
		else return t?.kind === "sequence" && cs(e) ? Ts(e, t) : t?.kind === "wipe" && cs(e) ? js(e, t, !1) : t?.kind === "together" ? o(t.delay, t.duration) : o(0, 200);
	});
}
function Ts(e, t) {
	for (let t of e.querySelectorAll(`[${mr}], [${hr}]`)) t.style.visibility = "hidden";
	let n = [...e.querySelectorAll(`[${mr}] [${Sr}]`)].filter((e) => !e.parentElement?.closest(`[${Sr}]`));
	for (let e of n) e.style.visibility = "visible";
	let r = [...[...e.querySelectorAll(`[${gr}]`)].flatMap(da), ...n];
	return Promise.all(r.map((e) => {
		let n = e.getBoundingClientRect(), r = (n) => as(e.animate([{ opacity: 1 }, { opacity: 0 }], {
			duration: t.duration,
			delay: n,
			easing: "ease",
			fill: "forwards"
		})), i = t.boneDelay(n);
		if (i === null) e.style.opacity = "0";
		else return r(i);
	})).then(is);
}
var Es = 100, Ds = /* @__PURE__ */ new WeakMap();
function Os(e, t) {
	e.style.setProperty("mask-image", t), e.style.setProperty("-webkit-mask-image", t);
}
function ks(e, t) {
	Os(e, `linear-gradient(#000 0 0), ${t}`), e.style.setProperty("-webkit-mask-composite", "xor"), e.style.setProperty("mask-composite", "exclude");
}
function As(e) {
	Ds.get(e)?.();
	for (let t of [
		"mask-image",
		"-webkit-mask-image",
		"mask-composite",
		"-webkit-mask-composite"
	]) e.style.removeProperty(t);
}
function js(e, t, n) {
	let r = {
		rect: e.getBoundingClientRect(),
		reveal: t.reveal
	}, { mask: i, out: a } = t.wipe, o = (t) => {
		n ? Os(e, i(t, r)) : a ? Os(e, a(t, r)) : ks(e, i(t, r));
	}, s = () => (performance.now() - t.start) / t.duration;
	return s() >= 1 ? (n || (e.style.opacity = "0"), Promise.resolve()) : (n && (t.wipe.effect?.(e, {
		...r,
		progress: s
	}), t.enter && e.animate([t.enter, {}], {
		duration: t.duration,
		delay: Math.max(t.start - performance.now(), 0),
		easing: "ease",
		fill: "backwards"
	})), new Promise((n) => {
		let r = 0, i = performance.now(), a = 0, c = () => {
			let e = performance.now();
			if (e - i > Es && (t.stalled = !0), i = e, t.stalled) return l(a);
			a = Math.min(Math.max(s(), 0), 1), o(a), a < 1 ? r = requestAnimationFrame(c) : l(null);
		}, l = (t = null) => {
			cancelAnimationFrame(r), clearTimeout(u), Ds.delete(e), n(t);
		}, u = setTimeout(() => l(null), Math.max(t.start + t.duration - performance.now(), 0) + Es);
		Ds.set(e, l), c();
	}).then((t) => {
		if (As(e), t === null) {
			n || (e.style.opacity = "0");
			return;
		}
		let r = 200 * (1 - t);
		return n ? ss(e, 0, r, t) : as(e.animate([{ opacity: 1 - t }, { opacity: 0 }], {
			duration: r,
			easing: "ease",
			fill: "forwards"
		})).then(() => {
			e.style.opacity = "0";
		});
	}));
}
// node_modules/skullet/dist/react/index.mjs
var Ms = Y.createContext({}), Ns = Y.createContext(null), Ps = () => Y.useContext(Ms), Fs = () => Y.useContext(Ns), Is = () => Ps().reveal;
function Ls({ children: e, ...t }) {
	let { debug: n, theme: r, mode: i, text: a, nonce: o } = t, s = Kr({
		theme: r,
		mode: i,
		text: a
	}), [c] = Y.useState(() => ({ sent: !1 }));
	return Y.useEffect(() => {
		n !== void 0 && $r(n);
	}, [n]), (0, X.jsx)(Ms.Provider, {
		value: t,
		children: (0, X.jsxs)(Ns.Provider, {
			value: c,
			children: [s && (0, X.jsx)("style", {
				nonce: o,
				children: s
			}), e]
		})
	});
}
var Rs = typeof window > "u" ? Y.useEffect : Y.useLayoutEffect, zs = () => Y.useInsertionEffect(() => (Br(), Vr), []), Bs = Number("19.3.1".split(".")[0]) >= 19, Vs = () => {
	let { nonce: e } = Ps();
	return Bs ? (0, X.jsx)("style", {
		href: "skullet",
		precedence: "medium",
		nonce: e,
		children: Ir
	}) : null;
}, Hs = Bs ? { inert: !0 } : { inert: "" }, Us = (e) => Y.Children.map(e, (e) => {
	if (!Y.isValidElement(e)) return e;
	let t = e.type.Skeleton;
	return t ? (0, X.jsx)("span", {
		[Sr]: "",
		children: (0, X.jsx)(t, { ...e.props })
	}) : e.props.children && typeof e.props.children != "function" ? Y.cloneElement(e, void 0, Us(e.props.children)) : e;
}), Ws = () => () => {}, Gs = () => Y.useSyncExternalStore(Ws, () => !1, () => !0), Ks = ({ children: e, id: t, exact: n, refetch: r, label: i }) => {
	let a = Y.useRef(null), { nonce: o } = Ps(), s = Fs(), c = Gs(), l = Hr;
	return c && s && (s.sent && (l = "(s=>{let k=Symbol.for(\"skullet.boot\"),b=self[k];typeof b==\"function\"?b(s):(self[k]=b||[]).push(s)})(document.currentScript)"), s.sent = !0), Rs(() => {
		if (!a.current) return;
		let e = new ko(a.current, {
			id: t,
			exact: n,
			refetch: r
		});
		return () => e.destroy();
	}, [
		t,
		n,
		r
	]), (0, X.jsxs)(X.Fragment, { children: [
		i && (0, X.jsx)("span", {
			"skullet-status": "",
			children: i
		}),
		(0, X.jsxs)("div", {
			ref: a,
			[pr]: "",
			"aria-hidden": !0,
			...Hs,
			children: [
				(0, X.jsx)("div", {
					[mr]: "",
					children: Us(e)
				}),
				(0, X.jsx)("div", { [hr]: "" }),
				(0, X.jsx)("div", { [gr]: "" })
			]
		}),
		c && (0, X.jsx)("script", {
			nonce: o,
			suppressHydrationWarning: !0,
			dangerouslySetInnerHTML: { __html: l }
		})
	] });
}, qs = ({ children: e, id: t, registry: n, enter: r, exiting: i, onExited: a, memory: o, onEntered: s }) => {
	let c = Y.useRef(null), l = Is();
	return Rs(() => {
		if (!c.current) return;
		let e = {
			element: c.current,
			memory: null
		};
		return n.set(t, e), gs(c.current, l, { initial: !r }).then(s), o && (e.memory = new jo(c.current, o)), () => {
			e.memory?.destroy(), n.delete(t);
		};
	}, []), Rs(() => {
		!i || !c.current || ws(c.current, n.get(t)?.box).then(a);
	}, [i]), (0, X.jsx)("div", {
		ref: c,
		[fr]: "",
		children: e
	});
}, Js = class extends Y.Component {
	getSnapshotBeforeUpdate(e) {
		for (let t of this.props.exiting) {
			if (e.exiting.includes(t)) continue;
			let n = this.props.registry.get(t);
			n && (n.memory?.save(), n.box = ys(n.element));
		}
		return null;
	}
	componentDidUpdate() {}
	render() {
		return this.props.children;
	}
};
function Ys(e) {
	let { id: t, label: n, skeleton: r, empty: i, emptyMessage: a, error: o, className: s, style: c } = e;
	zs();
	let l = typeof e.children == "function" ? e.children : null, u = l ? e.data : void 0, d = l ? e.sample : void 0, f = l ? null : e.children, p = Y.useRef(null);
	Rs(() => {
		u != null && (p.current = {
			id: t,
			data: u
		});
	});
	let m = (e) => l ? e == null ? null : l(e) : f, h = !!e.loading || !!l && u == null && !o && !i, g, _, v;
	if (h) {
		let e = p.current, i = u ?? (e && e.id === t ? e.data : null);
		g = "skeleton", _ = r ? (0, X.jsx)("div", {
			[Sr]: "",
			"aria-hidden": !0,
			children: r
		}) : (0, X.jsx)(Ks, {
			id: t,
			exact: i != null,
			refetch: u != null,
			label: n,
			children: m(i ?? d)
		});
	} else o ? (g = "error", _ = o) : i ? (g = "empty", _ = a ?? m(u)) : (g = "content", _ = m(u), v = {
		id: t,
		data: u,
		rendered: !!l,
		sample: d !== void 0
	});
	let [y, ee] = Y.useState({
		id: 0,
		key: g
	}), [b, x] = Y.useState([]), S = Y.useRef(/* @__PURE__ */ new Map()).current, C = Y.useRef(_);
	if (Rs(() => {
		C.current = _;
	}), y.key !== g) {
		let e = {
			id: y.id,
			node: C.current
		};
		x((t) => t.some((t) => t.id === e.id) ? t : [...t, e]), ee({
			id: y.id + 1,
			key: g,
			from: y.key
		});
	}
	let w = Y.useRef(e.onReveal);
	Rs(() => {
		w.current = e.onReveal;
	});
	let T = y.key === "content" && y.from === "skeleton" ? () => w.current?.() : void 0, te = (e) => x((t) => t.filter((t) => t.id !== e)), E = [...b.map((e) => (0, X.jsx)(qs, {
		id: e.id,
		registry: S,
		enter: !1,
		exiting: !0,
		onExited: () => te(e.id),
		children: e.node
	}, e.id)), (0, X.jsx)(qs, {
		id: y.id,
		registry: S,
		enter: y.id > 0,
		exiting: !1,
		onExited: () => {},
		memory: v,
		onEntered: T,
		children: _
	}, y.id)];
	return (0, X.jsxs)("div", {
		[dr]: "",
		"aria-busy": g === "skeleton" || void 0,
		className: s,
		style: c,
		children: [(0, X.jsx)(Vs, {}), (0, X.jsx)(Js, {
			exiting: b.map((e) => e.id),
			registry: S,
			children: E
		})]
	});
}
// src/react/follow-manage/measured-reading.tsx
var Xs = {
	creators: [J("follow:followOverview.creators"), J("follow:followOverview.creatorUnit")],
	enabled: [J("follow:followOverview.enabledSources"), ""],
	failed: [J("follow:followCheck.checkFailed"), J("follow:followOverview.sourceUnit")],
	updates: [J("follow:followOverview.unwatchedUpdates"), J("follow:followOverview.itemUnit")],
	subscriptions: [J("follow:feedSources.footerLabel"), J("follow:followOverview.actressUnit")],
	releases: [J("follow:followOverview.unwatchedReleases"), J("follow:followOverview.itemUnit")]
}, Zs = {
	duration: 0,
	delay: 0,
	hold: 150
}, Qs;
function $s() {
	return Qs || (Qs = new CSSStyleSheet(), Qs.replaceSync("\n      @keyframes peach-skeleton-sweep { to { transform: translateX(-50%); } }\n      [skullet-rect] { overflow: hidden; }\n      [skullet-rect]::after {\n        content: ''; position: absolute; inset: 0; right: -200%; border-radius: inherit;\n        background: linear-gradient(to right, var(--skullet-base), var(--skullet-highlight) 50%, var(--skullet-base));\n        background-size: 50% 100%; animation: peach-skeleton-sweep 1.5s ease-in-out infinite reverse;\n      }\n      @media (prefers-reduced-motion: reduce) { [skullet-rect]::after { animation: none; } }\n    ")), Qs;
}
function ec({ figure: e, unit: t }) {
	return /* @__PURE__ */ (0, X.jsxs)("b", {
		"data-follow-reading": "",
		className: `flex min-w-0 flex-wrap items-baseline gap-x-1 tabular-nums text-text-primary ${e >= 1e6 ? "text-headline-medium" : e >= 1e5 ? "text-title-3-medium" : "text-title-1-medium"}`,
		children: [/* @__PURE__ */ (0, X.jsx)("span", { children: e.toLocaleString() }), /* @__PURE__ */ (0, X.jsx)("small", {
			className: "whitespace-nowrap text-body-2-regular text-text-secondary",
			children: ` ${t}`
		})]
	});
}
function tc({ field: e, figure: t, total: n, failed: r = !1 }) {
	let [i, a] = Xs[e], o = (0, Y.useRef)(null);
	return (0, Y.useLayoutEffect)(() => {
		let e = [...o.current.querySelectorAll("[skullet-layer]")].map((e) => e.shadowRoot).filter((e) => !!e);
		if (!e.length) return;
		let t = $s();
		for (let n of e) n.adoptedStyleSheets = [...n.adoptedStyleSheets, t];
		return () => {
			for (let n of e) n.adoptedStyleSheets = n.adoptedStyleSheets.filter((e) => e !== t);
		};
	}, [t, r]), /* @__PURE__ */ (0, X.jsxs)("div", {
		ref: o,
		"data-measured-reading": e,
		className: ke({
			padding: "none",
			className: "flex flex-col justify-between gap-3 px-6 py-5 max-sm:gap-2 max-sm:p-4"
		}),
		children: [/* @__PURE__ */ (0, X.jsx)("span", {
			className: "text-body-medium text-text-secondary",
			children: i
		}), t === void 0 && r ? /* @__PURE__ */ (0, X.jsx)("b", {
			"data-follow-reading": "",
			className: "text-title-1-medium text-text-primary",
			children: J("follow:shared.notFound")
		}) : /* @__PURE__ */ (0, X.jsx)(Ls, {
			reveal: Zs,
			children: /* @__PURE__ */ (0, X.jsx)(Ys, {
				id: `peach:follow-reading:v1:${e}`,
				data: t,
				sample: 12345,
				label: J("follow:followOverview.loading", { term: i }),
				children: (t) => /* @__PURE__ */ (0, X.jsx)(ec, {
					figure: t,
					unit: e === "enabled" ? `/ ${n ?? 0}` : a
				})
			})
		})]
	});
}
// src/react/follow-manage/follow-manage-page.tsx
var nc = (e) => ne.some(([t]) => t === e);
function rc(e) {
	let { route: t, savePreference: n, toast: r, openFollow: i, readOnly: a, readOnlyMessage: o, writerUrl: s } = e, [c, l] = (0, Y.useState)(nc(e.tab) ? e.tab : "list"), [u, f] = (0, Y.useState)(Math.max(1, Math.floor(e.page) || 1)), [p, m] = (0, Y.useState)(() => At(e.sort, e.dir).sort), [h, g] = (0, Y.useState)(() => At(e.sort, e.dir).dir), [_, v] = (0, Y.useState)(lt(e.layout) ? e.layout : "default"), [y, ee] = (0, Y.useState)(vt(e.pageSize)), [b, x] = (0, Y.useState)(/* @__PURE__ */ new Set()), [S, C] = (0, Y.useState)(/* @__PURE__ */ new Set());
	Zt(() => {
		x(/* @__PURE__ */ new Set()), C(/* @__PURE__ */ new Set());
	}), (0, Y.useEffect)(() => {
		(b.size || S.size) && qe();
	}, [b, S]);
	let w = Qt({
		queryKey: k,
		queryFn: ({ signal: e }) => et(e)
	}), E = Qt({
		queryKey: O,
		queryFn: ({ signal: e }) => Qe(e)
	}), D = Qt({
		queryKey: te,
		queryFn: ({ signal: e }) => $e(e)
	}), A = w.data || { sources: [] }, j = E.data || {
		root: "",
		providers: []
	}, M = A.sources;
	(0, Y.useEffect)(() => {
		x((e) => {
			let t = ft(e, M);
			return t.size === e.size ? e : t;
		});
	}, [M]);
	let N = (e) => {
		let n = e.sort ?? p, r = e.dir ?? h;
		t({
			tab: e.tab ?? c,
			page: e.page ?? u,
			sort: n === "checked" ? "" : n,
			dir: r === V[n] ? "" : r
		});
	}, P = st(M), F = M.filter(ct).length, I = M.filter((e) => e.enabled).length, L = (j.providers || []).filter((e) => e.requirement === "required" && !He(e)).length, re = new Set((D.data?.sources || []).map((e) => e.entity_id ?? `source-${e.id}`)).size;
	return /* @__PURE__ */ (0, X.jsxs)(rn, { children: [
		a ? /* @__PURE__ */ (0, X.jsx)(z, {
			tone: "warning",
			title: J("follow:followManagePage.readOnly"),
			extra: s ? /* @__PURE__ */ (0, X.jsx)("p", {
				className: "text-body-2-regular",
				children: /* @__PURE__ */ (0, X.jsx)(T, {
					href: s,
					children: J("follow:followManagePage.goToPrimary")
				})
			}) : void 0,
			children: o
		}) : null,
		/* @__PURE__ */ (0, X.jsxs)("div", {
			className: oe,
			"aria-label": J("follow:followManagePage.overview"),
			children: [
				/* @__PURE__ */ (0, X.jsx)(tc, {
					field: "creators",
					figure: w.data ? P.length : void 0,
					failed: w.isError
				}),
				/* @__PURE__ */ (0, X.jsx)(tc, {
					field: "enabled",
					figure: w.data ? I : void 0,
					total: M.length,
					failed: w.isError
				}),
				/* @__PURE__ */ (0, X.jsx)(tc, {
					field: "failed",
					figure: w.data ? F : void 0,
					failed: w.isError
				}),
				/* @__PURE__ */ (0, X.jsx)(tc, {
					field: "updates",
					figure: w.data ? A.counts?.new || 0 : void 0,
					failed: w.isError
				}),
				/* @__PURE__ */ (0, X.jsx)(tc, {
					field: "subscriptions",
					figure: D.data ? re : void 0,
					failed: D.isError
				}),
				/* @__PURE__ */ (0, X.jsx)(tc, {
					field: "releases",
					figure: D.data ? D.data.unread || 0 : void 0,
					failed: D.isError
				})
			]
		}),
		/* @__PURE__ */ (0, X.jsxs)("div", {
			className: "flex flex-col gap-6",
			children: [
				/* @__PURE__ */ (0, X.jsx)("div", {
					"data-section-nav": !0,
					children: /* @__PURE__ */ (0, X.jsx)(fe, {
						group: "follow",
						label: J("follow:followManagePage.sectionTabs"),
						value: c,
						panelPrefix: "follow",
						sectionItems: !0,
						tabs: ne.map(([e, t]) => ({
							value: e,
							label: t
						})),
						className: "",
						itemClassName: "cursor-pointer whitespace-nowrap",
						onChange: (e) => {
							x(/* @__PURE__ */ new Set()), C(/* @__PURE__ */ new Set()), l(e), N({ tab: e });
						}
					})
				}),
				c === "list" ? /* @__PURE__ */ (0, X.jsxs)("div", {
					role: "tabpanel",
					id: "follow-panel-list",
					"aria-labelledby": "follow-tab-list",
					className: "flex flex-col gap-4",
					children: [/* @__PURE__ */ (0, X.jsx)(er, {
						readOnly: a,
						toast: r,
						onAdd: () => {
							l("add"), N({ tab: "add" });
						},
						selection: {
							ids: S,
							onChange: C,
							onActivate: () => x(/* @__PURE__ */ new Set())
						}
					}), w.data ? /* @__PURE__ */ (0, X.jsx)(ur, {
						data: A,
						sort: p,
						dir: h,
						page: u,
						layout: _,
						pageSize: y,
						selected: b,
						readOnly: a,
						toast: r,
						openFollow: i,
						onAdd: () => {
							l("add"), N({ tab: "add" });
						},
						onSort: (e, t) => {
							m(e), g(t), f(1), N({
								sort: e,
								dir: t,
								page: 1
							});
						},
						onPage: (e) => {
							f(e), N({ page: e });
						},
						onSelected: (e) => {
							x(e), C(/* @__PURE__ */ new Set());
						},
						onLayout: (e) => {
							v(e), f(1), n({ layout: e }), N({ page: 1 });
						},
						onPageSize: (e) => {
							ee(e), f(1), n({ pageSize: e }), N({ page: 1 });
						}
					}) : w.isError ? /* @__PURE__ */ (0, X.jsx)(z, {
						tone: "error",
						children: J("follow:followManagePage.listFailed")
					}) : /* @__PURE__ */ (0, X.jsx)("div", {
						role: "status",
						"aria-label": J("follow:followManagePage.listLoading"),
						"data-skeleton": "",
						className: "skeleton-sheen h-32 rounded-lg"
					})]
				}) : null,
				c === "add" ? /* @__PURE__ */ (0, X.jsxs)("div", {
					role: "tabpanel",
					id: "follow-panel-add",
					"aria-labelledby": "follow-tab-add",
					className: "flex flex-col gap-8",
					children: [
						E.data && w.data ? /* @__PURE__ */ (0, X.jsx)(wn, {
							data: A,
							credentials: j,
							readOnly: a,
							toast: r
						}) : E.isError || w.isError ? /* @__PURE__ */ (0, X.jsx)(z, {
							tone: "error",
							children: J("follow:followManagePage.credentialsFailed")
						}) : /* @__PURE__ */ (0, X.jsx)("div", {
							role: "status",
							"aria-label": J("follow:followManagePage.credentialsLoading"),
							"data-skeleton": "",
							className: "skeleton-sheen h-32 rounded-lg"
						}),
						/* @__PURE__ */ (0, X.jsx)(kn, {
							readOnly: a,
							toast: r,
							onAdded: () => {
								D.refetch(), l("list"), N({ tab: "list" });
							}
						}),
						w.data ? /* @__PURE__ */ (0, X.jsx)(Hn, {
							groups: A.author_aliases || [],
							readOnly: a,
							toast: r,
							suggestions: A.alias_suggestions || [],
							sources: A.sources
						}) : null
					]
				}) : null
			]
		}),
		/* @__PURE__ */ (0, X.jsxs)("details", {
			className: "rounded-xl border border-separator-border bg-background-secondary-default",
			children: [/* @__PURE__ */ (0, X.jsx)("summary", {
				className: "cursor-pointer px-4 py-3 text-body-2-medium text-text-primary",
				children: J("catalog:studioSubscriptions.mergeEntry")
			}), /* @__PURE__ */ (0, X.jsx)("div", {
				className: "px-4 pb-4",
				children: /* @__PURE__ */ (0, X.jsx)(tr, { close: () => void 0 })
			})]
		}),
		/* @__PURE__ */ (0, X.jsx)("div", { children: /* @__PURE__ */ (0, X.jsx)(d, {
			variant: "secondary",
			href: "/settings/subscriptions",
			children: L ? J("follow:followManagePage.feedSettingsPending", { count: L }) : J("follow:followManagePage.feedSettings")
		}) })
	] });
}
export { rc as FollowManagePage };

//# debugId=17daca0c-c894-491a-8453-cf5dcdebc391