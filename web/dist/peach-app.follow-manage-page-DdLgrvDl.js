(function() {
	try {
		var e = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, t = new e.Error().stack;
		t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "7f7a8a2b-ca30-45c7-916b-31269d396899", e._sentryDebugIdIdentifier = "sentry-dbid-7f7a8a2b-ca30-45c7-916b-31269d396899");
	} catch {}
})();
import { $2ec61d1d4f780267$export$a8a3e93435678ff9 as e, $542a13ca2fa5b484$export$5b6b19405a83ff9d as t, $76d00c5a4edb230a$export$76ccd210b9029917 as n, $76d00c5a4edb230a$export$816b5d811295e6bc as r, $76d00c5a4edb230a$export$b59bdbef9ce70de2 as i, $76d00c5a4edb230a$export$f6f0c3fe4ec306ea as a, $76d00c5a4edb230a$export$f850895b287ef28e as o, $ea3928288112382f$export$439d29a4e110a164 as s, $l as c, ActivityStatus as l, Button as u, ButtonLink as d, Bx as f, COLUMN_SORT as p, Checkbox as m, ChevronSortDown as h, Chip as g, CollapseChevron as _, CollapseRegion as v, DataTableFooter as y, DataTableFrame as ee, DataTableSort as b, EmptyFocusButton as x, EmptyState as te, ErrorText as S, ExternalLink as ne, FEEDS_KEY as C, FOLLOW_CHECK_KEY as w, FOLLOW_CHECK_TASK as T, FOLLOW_CREDENTIALS_KEY as E, FOLLOW_MANAGE_KEY as D, FOLLOW_MANAGE_NAV as O, FOLLOW_RESOLVE_KEY as k, FieldLabel as A, Help as j, Input as M, LAYOUTS as N, M6 as P, MENU_ITEM as F, MENU_ITEM_INTERACTIVE as I, MENU_POPOVER_SURFACE as L, ModalFrame as re, Note as R, P7 as ie, SORT_DEFAULT_DIR as ae, SORT_OPTIONS as oe, STAT_STRIP_SIX as z, Select as B, SelectItem as V, SelectionDock as se, SelectionPopover as H, SiteLabel as U, SortDirectionIcon as ce, SortableBoardTabs as le, Switch as W, Table as ue, TableColumnControls as de, TableColumnResizer as fe, TableSelectionHeader as pe, TagManager as G, TaskProgress as me, Un as he, Wt as K, Xf as ge, __toESM as _e, activityKind as ve, addAlias as ye, addSource as be, apiSend as xe, authorGroups as Se, authorName as Ce, avatarInner as we, busyProps as q, cardClass as Te, checkEvidenceGap as Ee, checkFailures as De, checkFeeds as Oe, checkReceipt as ke, checkSummary as Ae, checkedText as je, clickedBlank as Me, codedText as Ne, columnVisibilityFeature as Pe, composingKey as Fe, confirmModal as Ie, createColumnHelper as Le, credentialDone as Re, cx as ze, dZ as Be, dropSources as Ve, du as He, errorHeadline as Ue, errorMessage as J, feedIntervalText as We, fetchCheckJob as Ge, fetchCredentials as Ke, fetchFeeds as qe, fetchFollow as Je, fetchResolveJob as Ye, fetchSuggestions as Xe, flexRender as Ze, followFeedByName as Qe, followFeedEntity as $e, followSuggestKey as et, groupByAuthor as tt, isBroken as nt, isLayout as rt, jobText as it, joinList as at, keepSelected as ot, l7 as st, localTime as ct, lookupFeedActor as lt, mapLimit as ut, markAllPending as dt, pageSizeOf as ft, pageWindow as pt, patchSource as mt, pv as ht, queryClient as gt, quoted as _t, reloadFollowManage as vt, removeAlias as yt, removeFeed as bt, removeSource as xt, renameAliasGroup as St, require_jsx_runtime as Ct, require_react as wt, resolveFollowSort as Tt, rowPaginationFeature as Et, rowSelectionFeature as Dt, rowSortingFeature as Ot, selectionState as kt, serverLabel as At, setFeedEnabled as jt, setSourceEnabled as Mt, sortLabel as Nt, startCheck as Pt, startResolve as Ft, t as Y, tableFeatures as It, tableRows as Lt, toggleGroup as Rt, useAction as zt, useBackgroundJob as Bt, useMutation as Vt, useQuery as Ht, useQueryClient as Ut, useTable as Wt, useTablePreferences as Gt } from "./peach-app.js";
import { Page as Kt } from "./peach-app.page-QAncjzM1.js";
import { AuthorAvatar as qt, ErrorLine as Jt, SourceIcon as Yt, SourceLink as Xt, StatusBadge as Zt } from "./peach-app.source-view--K6uWAMi.js";
import { createPaginatedRowModel as Qt, createSortedRowModel as $t, useTableSelection as en } from "./peach-app.use-table-selection-D3dTCZpj.js";
import { LEGACY_AVATAR_IMG as tn } from "./peach-app.legacy-avatar-NSITxLRS.js";
// src/react/follow-manage/add-source.tsx
var X = /* @__PURE__ */ _e(wt(), 1), Z = Ct(), nn = ze(F, I, "text-body-2-medium"), rn = Y("follow:addCreatorSource.placeholder"), an = Y("follow:addCreatorSource.title"), on = Y("follow:addCreatorSource.searchingByName"), sn = Y("follow:addCreatorSource.recognizing"), cn = Y("follow:addCreatorSource.noSourceFound"), ln = "/settings/subscriptions", un = (e, t) => `${e}:${t.url}`;
function dn({ field: e, menu: n, options: r, active: i, busy: a, onPick: o, onClose: s }) {
	return (0, X.useEffect)(() => {
		n.current?.querySelector("[aria-current=\"true\"]")?.scrollIntoView({ block: "nearest" });
	}, [n, i]), /* @__PURE__ */ (0, Z.jsxs)(t, {
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
		"aria-label": Y("follow:addCreatorSource.suggestions"),
		className: ze(L, "flex w-(--trigger-width) flex-col gap-1 overscroll-contain"),
		children: [a && !r.length ? /* @__PURE__ */ (0, Z.jsx)("div", {
			className: "px-2 py-1.5",
			children: /* @__PURE__ */ (0, Z.jsx)(l, {
				kind: "radar",
				label: Y("follow:addCreatorSource.findingSuggestions")
			})
		}) : null, r.map((e, t) => /* @__PURE__ */ (0, Z.jsxs)(X.Fragment, { children: [e.group === r[t - 1]?.group ? null : /* @__PURE__ */ (0, Z.jsx)("div", {
			className: "px-2 pt-1 text-caption-1-regular text-text-tertiary",
			children: e.group
		}), /* @__PURE__ */ (0, Z.jsxs)("button", {
			type: "button",
			"aria-current": t === i ? "true" : void 0,
			className: t === i ? ze(nn, "bg-background-secondary-default") : nn,
			onMouseDown: (e) => e.preventDefault(),
			onClick: () => o(e.value),
			children: [
				/* @__PURE__ */ (0, Z.jsx)("span", {
					className: "min-w-0 grow truncate text-left",
					children: e.value
				}),
				e.matched ? /* @__PURE__ */ (0, Z.jsx)("span", {
					className: "shrink-0 text-caption-1-regular text-text-tertiary",
					children: e.matched
				}) : null,
				e.n ? /* @__PURE__ */ (0, Z.jsx)("span", {
					className: "shrink-0 text-caption-1-regular tabular-nums text-text-tertiary",
					children: e.n.toLocaleString()
				}) : null
			]
		})] }, `${e.group}-${e.value}`))]
	});
}
function fn({ credentials: e, hidden: t, onHidden: n }) {
	let r = (e.providers || []).filter((e) => e.followable), i = r.filter((e) => !t.has(e.provider_label)).length, a = i === r.length ? Y("follow:addCreatorSource.allSources") : Y("follow:addCreatorSource.shownSources", {
		shown: i,
		count: r.length
	});
	return /* @__PURE__ */ (0, Z.jsx)(H, {
		label: Y("follow:addCreatorSource.sourceFilter"),
		triggerLabel: a,
		leadingIcon: c,
		empty: Y("follow:addCreatorSource.noSources"),
		items: r.map((e) => ({
			id: e.provider_label,
			selected: !t.has(e.provider_label),
			label: /* @__PURE__ */ (0, Z.jsxs)("span", {
				className: "flex min-w-0 items-center gap-1.5",
				children: [/* @__PURE__ */ (0, Z.jsx)(Yt, { provider: e.provider }), e.provider_label]
			})
		})),
		onChange: (e, r) => {
			let i = new Set(t);
			r ? i.delete(e) : i.add(e), n(i);
		},
		actions: [
			{
				label: Y("follow:shared.selectAll"),
				disabled: !r.length,
				onPress: () => n(/* @__PURE__ */ new Set())
			},
			{
				label: Y("follow:shared.selectNone"),
				disabled: !r.length,
				onPress: () => n(new Set(r.map((e) => e.provider_label)))
			},
			{
				label: Y("follow:addCreatorSource.credentialSettings"),
				href: ln
			}
		]
	});
}
function pn({ row: e, at: t, hidden: n, unpicked: r, onPick: i }) {
	if (e.kind === "error") return /* @__PURE__ */ (0, Z.jsx)(R, {
		tone: "error",
		title: e.line,
		children: it(e, "error") || Y("follow:addCreatorSource.searchFailed")
	});
	let a = (e.candidates || []).filter((e) => !n.has(e.provider_label || "")), o = Object.entries(e.failures || {});
	return /* @__PURE__ */ (0, Z.jsxs)("div", {
		className: Te({
			variant: "outlined",
			padding: "none",
			className: "flex flex-col gap-2 p-4"
		}),
		children: [
			/* @__PURE__ */ (0, Z.jsx)("b", {
				className: "text-body-medium text-text-primary",
				children: e.line
			}),
			a.length ? a.map((e) => {
				let n = un(t, e);
				return /* @__PURE__ */ (0, Z.jsx)(m, {
					isSelected: !e.known && !r.has(n),
					isDisabled: e.known,
					onChange: (e) => i(n, e),
					children: /* @__PURE__ */ (0, Z.jsxs)("span", {
						className: "flex min-w-0 flex-wrap items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, Z.jsx)(Yt, { provider: e.provider }),
							/* @__PURE__ */ (0, Z.jsx)("b", {
								className: "text-body-medium",
								children: e.provider_label
							}),
							/* @__PURE__ */ (0, Z.jsx)("span", {
								className: "min-w-0 break-words",
								children: Ne(e, "label")
							}),
							/* @__PURE__ */ (0, Z.jsx)("small", {
								className: "text-caption-1-regular text-text-secondary",
								children: e.known ? Y("follow:addCreatorSource.alreadyFollowing") : Ne(e, "evidence")
							})
						]
					})
				}, n);
			}) : /* @__PURE__ */ (0, Z.jsx)(j, { children: cn }),
			(e.external_searches || []).map((e) => /* @__PURE__ */ (0, Z.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, Z.jsx)("small", {
					className: "text-caption-1-regular text-text-secondary",
					children: Ne(e, "evidence")
				}), /* @__PURE__ */ (0, Z.jsx)(ne, {
					href: e.url,
					children: Y("follow:shared.labeled", {
						label: Ne(e, "label"),
						value: e.query
					})
				})]
			}, e.url)),
			o.length ? /* @__PURE__ */ (0, Z.jsx)(j, { children: at(o.map(([t, n]) => Y("follow:shared.labeled", {
				label: t,
				value: At(e.failure_codes?.[t]?.code ?? "", n, e.failure_codes?.[t]?.params)
			}))) }) : null
		]
	});
}
function mn({ data: e, credentials: t, readOnly: n, toast: r }) {
	let [i, a] = (0, X.useState)(""), [o, s] = (0, X.useState)(!1), [c, l] = (0, X.useState)(""), [d, f] = (0, X.useState)(""), [p, m] = (0, X.useState)(!1), [h, g] = (0, X.useState)(null), [_, v] = (0, X.useState)(-1), y = (0, X.useRef)(null), ee = (0, X.useRef)(null), [b, x] = (0, X.useState)(/* @__PURE__ */ new Set()), [te, S] = (0, X.useState)(/* @__PURE__ */ new Set()), [ne, C] = (0, X.useState)(""), [w, T] = (0, X.useState)(0);
	(0, X.useEffect)(() => {
		let e = i.trim();
		if (o || !e || e.includes("/")) {
			f("");
			return;
		}
		let t = setTimeout(() => f(e), 250);
		return () => clearTimeout(t);
	}, [i, o]);
	let E = Ht({
		queryKey: et(d),
		queryFn: ({ signal: e }) => Xe(d, e),
		enabled: d.length > 0 && p && !o && h !== i
	}), D = (0, X.useMemo)(() => (E.data?.groups || []).flatMap((e) => e.items.map((t) => ({
		value: t.value,
		matched: At(t.matched_code ?? "", t.matched || ""),
		n: t.n || 0,
		group: At(e.label_code ?? "", e.label)
	}))), [E.data]), { job: O, running: j, outcome: N, start: P, dismiss: F } = Bt({
		queryKey: k,
		queryFn: ({ signal: e }) => Ye(e),
		start: (e) => Ft([e]),
		onStarted: () => S(/* @__PURE__ */ new Set()),
		onError: (e) => C(J(e)),
		onFinish: (e) => {
			e.status === "failed" && C(it(e, "error") || Y("follow:addCreatorSource.searchFailed"));
		}
	}), I = (e) => {
		let t = e.trim();
		!t || n || o || j || P.isPending || (C(""), v(-1), l(t), a(t), f(""), g(t), P.mutate(t));
	}, L = E.isFetching, re = p && !o && h !== i && (D.length > 0 || L), ie = () => {
		v(-1), g(i);
	}, ae = (e) => {
		if (!(o || Fe(e.nativeEvent))) {
			if (e.key === "Escape" && re) ie();
			else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
				if (!D.length) return;
				if (e.preventDefault(), !re) {
					g(null);
					return;
				}
				let t = e.key === "ArrowDown" ? 1 : -1;
				v((e) => {
					let n = e + t;
					return n < 0 ? D.length - 1 : n >= D.length ? 0 : n;
				});
			} else e.key === "Enter" && (e.preventDefault(), I(D[_]?.value || i));
		}
	}, oe = N?.results || [], z = oe.flatMap((e, t) => (e.candidates || []).filter((e) => !e.known && !b.has(e.provider_label || "")).map((e) => ({
		candidate: e,
		key: un(t, e)
	})).filter((e) => !te.has(e.key))), B = Vt({
		mutationFn: async (e) => {
			let t = [], n = [];
			T(0);
			for (let r of e) {
				try {
					let e = await be(r.candidate);
					n.push(e.source);
				} catch (e) {
					t.push(Y("follow:shared.labeled", {
						label: r.candidate.label,
						value: J(e)
					}));
				}
				T((e) => e + 1);
			}
			if (n.length) try {
				await Pt(n);
			} catch (e) {
				t.push(J(e));
			}
			return {
				failures: t,
				sources: n
			};
		},
		onSuccess: (e) => {
			vt(), e.failures.length ? C(at(e.failures)) : (C(""), F(), r(Y("follow:addCreatorSource.sourcesAdded", { count: e.sources.length })));
		},
		onError: (e) => C(J(e))
	}), V = e.suggestions || [], se = !c.includes("/");
	return /* @__PURE__ */ (0, Z.jsxs)("section", {
		"aria-label": an,
		className: Te({
			padding: "none",
			className: "flex flex-col gap-4 px-6 py-5 max-sm:px-4"
		}),
		children: [
			/* @__PURE__ */ (0, Z.jsx)("h3", {
				className: "text-title-2-medium text-text-primary",
				children: an
			}),
			/* @__PURE__ */ (0, Z.jsxs)("div", {
				className: "flex flex-wrap items-end gap-2",
				children: [
					/* @__PURE__ */ (0, Z.jsxs)("div", {
						ref: y,
						className: "min-w-64 grow",
						onFocus: () => m(!0),
						onBlur: (e) => {
							let t = e.relatedTarget;
							!e.currentTarget.contains(t) && !ee.current?.contains(t) && m(!1);
						},
						children: [/* @__PURE__ */ (0, Z.jsx)(M, {
							"aria-label": Y("follow:addCreatorSource.inputLabel"),
							placeholder: rn,
							value: i,
							leadingIcon: ht,
							enterKeyHint: "search",
							isDisabled: n,
							onChange: a,
							onCompositionStart: () => {
								s(!0), v(-1);
							},
							onCompositionEnd: (e) => {
								s(!1), a(e.currentTarget.value);
							},
							onKeyDown: ae
						}), re ? /* @__PURE__ */ (0, Z.jsx)(dn, {
							field: y,
							menu: ee,
							options: D,
							active: _,
							busy: L,
							onPick: I,
							onClose: ie
						}) : null]
					}),
					/* @__PURE__ */ (0, Z.jsx)(fn, {
						credentials: t,
						hidden: b,
						onHidden: x
					}),
					/* @__PURE__ */ (0, Z.jsx)(u, {
						variant: "primary",
						disabled: n || !i.trim(),
						...q(j || P.isPending),
						onClick: () => I(i),
						children: Y("follow:shared.search")
					})
				]
			}),
			/* @__PURE__ */ (0, Z.jsxs)("div", {
				"aria-live": "polite",
				className: "flex flex-col gap-3 empty:hidden",
				children: [j || P.isPending ? /* @__PURE__ */ (0, Z.jsx)(me, {
					embedded: !0,
					kind: ve("follow-resolve"),
					label: it(O) || (O?.total ? Y("follow:addCreatorSource.searchProgress", {
						checked: O.checked || 0,
						count: O.total
					}) : se ? on : sn),
					value: O?.checked,
					total: O?.total
				}) : null, ne ? /* @__PURE__ */ (0, Z.jsx)(R, {
					tone: "error",
					title: Y("follow:addJavFeed.notCompleted"),
					children: ne
				}) : null]
			}),
			oe.length ? /* @__PURE__ */ (0, Z.jsxs)("div", {
				className: "flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, Z.jsx)(A, { children: Y("follow:addCreatorSource.results") }),
					oe.map((e, t) => /* @__PURE__ */ (0, Z.jsx)(pn, {
						row: e,
						at: t,
						hidden: b,
						unpicked: te,
						onPick: (e, t) => {
							let n = new Set(te);
							t ? n.delete(e) : n.add(e), S(n);
						}
					}, `${e.line}-${t}`)),
					/* @__PURE__ */ (0, Z.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, Z.jsx)(u, {
								variant: "secondary",
								size: "small",
								onClick: () => F(),
								children: Y("follow:shared.close")
							}),
							/* @__PURE__ */ (0, Z.jsx)(u, {
								variant: "primary",
								size: "small",
								disabled: n || !z.length,
								...q(B.isPending),
								onClick: () => B.mutate(z),
								children: Y("follow:addCreatorSource.addSelected", { count: z.length })
							}),
							B.isPending ? /* @__PURE__ */ (0, Z.jsx)("span", {
								role: "status",
								className: "text-body-2-regular text-text-secondary",
								children: Y("follow:addCreatorSource.addingProgress", {
									added: w,
									count: z.length
								})
							}) : null
						]
					})
				]
			}) : null,
			V.length ? /* @__PURE__ */ (0, Z.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, Z.jsx)("span", {
					className: "text-body-2-regular text-text-secondary",
					children: Y("follow:addCreatorSource.suggested")
				}), V.map((e) => /* @__PURE__ */ (0, Z.jsx)(u, {
					variant: "secondary",
					size: "small",
					disabled: n,
					title: e.origin ? Y("follow:addCreatorSource.historyVisitsFrom", {
						count: e.visits,
						origin: e.origin
					}) : Y("follow:addCreatorSource.historyVisits", { count: e.visits }),
					onClick: () => I(e.name),
					children: e.name
				}, e.name))]
			}) : null
		]
	});
}
// src/react/follow-manage/add-feed.tsx
var hn = Y("follow:addJavFeed.placeholder"), gn = Y("follow:addJavFeed.title");
function _n(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e.candidates) t.has(r.id) && r.held_by && n.set(r.held_by.id, r.held_by.name);
	if (n.size > 1) return {
		text: Y("follow:addJavFeed.cardsSplitAcrossPeople", { names: at([...n.values()]) }),
		blocked: !0
	};
	let [r] = n.values();
	return r ? {
		text: Y("follow:addJavFeed.willAddUnder", { name: r }),
		blocked: !1
	} : e.known ? {
		text: Y("follow:addJavFeed.willAddUnderKnown", { name: e.known.name }),
		blocked: !1
	} : {
		text: Y("follow:addJavFeed.willCreate", { name: e.q }),
		blocked: !1
	};
}
function vn({ card: e, picked: t, onPick: n }) {
	return /* @__PURE__ */ (0, Z.jsxs)("div", {
		className: "flex flex-wrap items-center gap-2",
		children: [/* @__PURE__ */ (0, Z.jsx)(m, {
			isSelected: t,
			onChange: n,
			children: /* @__PURE__ */ (0, Z.jsxs)("span", {
				className: "flex min-w-0 flex-wrap items-center gap-1.5",
				children: [
					/* @__PURE__ */ (0, Z.jsx)("span", {
						className: "min-w-0 break-words",
						children: at(e.names)
					}),
					e.record ? /* @__PURE__ */ (0, Z.jsx)(g, {
						variant: "caption",
						color: "neutral",
						children: e.record
					}) : null,
					e.held_by ? /* @__PURE__ */ (0, Z.jsx)("small", {
						className: "text-caption-1-regular text-text-secondary",
						children: Y("follow:addJavFeed.alreadyUnder", { name: e.held_by.name })
					}) : null
				]
			})
		}), /* @__PURE__ */ (0, Z.jsx)(ne, {
			href: e.url,
			children: e.id
		})]
	});
}
function yn({ readOnly: e, toast: t, onAdded: n }) {
	let [r, i] = (0, X.useState)(""), [a, o] = (0, X.useState)(null), [s, c] = (0, X.useState)(/* @__PURE__ */ new Set()), l = zt(), d = () => {
		let t = r.trim();
		t && !e && l.run("lookup", (e) => lt(t, e), (e) => {
			o(e), c(new Set(e.suggested));
		});
	}, f = (e) => {
		e.key === "Enter" && !Fe(e.nativeEvent) && (e.preventDefault(), d());
	}, p = () => {
		o(null), c(/* @__PURE__ */ new Set()), l.setError("");
	}, m = () => {
		a && l.run("follow", (e) => Qe(a.q, [...s], e), (e) => {
			t(e.created ? Y("follow:addJavFeed.createdAndSubscribed", { name: e.entity_name }) : Y("follow:addJavFeed.subscribed", { name: e.entity_name })), i(""), p(), n();
		});
	}, h = () => {
		let e = a?.known;
		e && l.run("known", (t) => $e(e.id, t), () => {
			t(Y("follow:addJavFeed.subscribed", { name: e.name })), i(""), p(), n();
		});
	}, g = a ? _n(a, s) : null, _ = a && !a.candidates.length && a.known?.subscribable ? a.known : null;
	return /* @__PURE__ */ (0, Z.jsxs)("section", {
		"aria-label": gn,
		className: Te({
			padding: "none",
			className: "flex flex-col gap-4 px-6 py-5 max-sm:px-4"
		}),
		children: [
			/* @__PURE__ */ (0, Z.jsx)("h3", {
				className: "text-title-2-medium text-text-primary",
				children: gn
			}),
			/* @__PURE__ */ (0, Z.jsxs)("div", {
				className: "flex flex-wrap items-end gap-2",
				children: [/* @__PURE__ */ (0, Z.jsx)("div", {
					className: "min-w-64 grow",
					children: /* @__PURE__ */ (0, Z.jsx)(M, {
						"aria-label": Y("follow:addJavFeed.actressName"),
						placeholder: hn,
						value: r,
						leadingIcon: ht,
						enterKeyHint: "search",
						isDisabled: e,
						onChange: i,
						onKeyDown: f
					})
				}), /* @__PURE__ */ (0, Z.jsx)(u, {
					variant: "primary",
					disabled: e || !r.trim(),
					...q(l.busy === "lookup"),
					onClick: d,
					children: Y("follow:shared.search")
				})]
			}),
			l.error ? /* @__PURE__ */ (0, Z.jsx)(R, {
				tone: "error",
				title: Y("follow:addJavFeed.notCompleted"),
				children: l.error
			}) : null,
			a ? /* @__PURE__ */ (0, Z.jsxs)("div", {
				className: "flex flex-col gap-3",
				children: [
					a.unavailable ? /* @__PURE__ */ (0, Z.jsx)(R, {
						tone: "warning",
						title: Y("follow:addJavFeed.javdbSearchFailed"),
						children: At(a.unavailable_code ?? "", a.unavailable, a.unavailable_params)
					}) : null,
					/* @__PURE__ */ (0, Z.jsx)(A, { children: Y("follow:addJavFeed.javdbCards") }),
					a.candidates.length ? a.candidates.map((e) => /* @__PURE__ */ (0, Z.jsx)(vn, {
						card: e,
						picked: s.has(e.id),
						onPick: (t) => c((n) => {
							let r = new Set(n);
							return t ? r.add(e.id) : r.delete(e.id), r;
						})
					}, e.id)) : /* @__PURE__ */ (0, Z.jsx)(j, { children: a.unavailable ? Y("follow:addJavFeed.noCardsThisTime") : Y("follow:addJavFeed.noJavdbMatch") }),
					a.candidates.length ? /* @__PURE__ */ (0, Z.jsx)(j, {
						role: "status",
						children: s.size ? g.text : Y("follow:addJavFeed.pickCardsHint")
					}) : null,
					_ ? /* @__PURE__ */ (0, Z.jsx)(j, {
						role: "status",
						children: _.following ? Y("follow:addJavFeed.alreadySubscribed", { name: _.name }) : Y("follow:addJavFeed.canSubscribeDirectly", { name: _.name })
					}) : null,
					/* @__PURE__ */ (0, Z.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, Z.jsx)(u, {
								variant: "secondary",
								size: "small",
								onClick: p,
								children: Y("follow:shared.close")
							}),
							a.candidates.length ? /* @__PURE__ */ (0, Z.jsx)(u, {
								variant: "primary",
								size: "small",
								disabled: e || !s.size || g.blocked,
								...q(l.busy === "follow"),
								onClick: m,
								children: Y("follow:addJavFeed.subscribePicked", { count: s.size })
							}) : null,
							_ && !_.following ? /* @__PURE__ */ (0, Z.jsx)(u, {
								variant: "primary",
								size: "small",
								disabled: e,
								...q(l.busy === "known"),
								onClick: h,
								children: Y("follow:addJavFeed.subscribeTo", { name: _.name })
							}) : null
						]
					})
				]
			}) : null
		]
	});
}
// src/react/follow-manage/alias-rename-dialog.tsx
function bn({ group: e, close: t, receipt: n }) {
	return /* @__PURE__ */ (0, Z.jsx)(re, {
		isOpen: !!e,
		onOpenChange: (e) => {
			e || t();
		},
		width: "form",
		label: Y("follow:creatorAliases.rename"),
		children: e ? /* @__PURE__ */ (0, Z.jsx)(xn, {
			group: e,
			close: t,
			receipt: n
		}, e.canonical_key) : null
	});
}
function xn({ group: t, close: n, receipt: r }) {
	let [i, a] = (0, X.useState)(t.canonical_name), o = zt();
	return /* @__PURE__ */ (0, Z.jsxs)("form", {
		onSubmit: (e) => {
			e.preventDefault(), i.trim() && i.trim() !== t.canonical_name && o.run("rename", (e) => St(t.canonical_key, i.trim(), e), () => {
				vt(), r(Y("follow:creatorAliases.renamed", { name: i.trim() })), n();
			});
		},
		className: "flex min-h-0 flex-col gap-4 p-5",
		children: [
			/* @__PURE__ */ (0, Z.jsx)(e, {
				slot: "title",
				className: "text-title-2-semibold text-text-primary",
				children: Y("follow:creatorAliases.rename")
			}),
			/* @__PURE__ */ (0, Z.jsxs)("p", {
				className: "text-body-2-regular wrap-anywhere text-text-secondary",
				children: [Y("follow:creatorAliases.currentName"), t.canonical_name]
			}),
			/* @__PURE__ */ (0, Z.jsx)(M, {
				"aria-label": Y("follow:creatorAliases.displayName"),
				autoFocus: !0,
				value: i,
				onChange: a
			}),
			/* @__PURE__ */ (0, Z.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, Z.jsx)(A, { children: Y("follow:creatorAliases.chooseExisting") }), /* @__PURE__ */ (0, Z.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: t.aliases.map((e) => /* @__PURE__ */ (0, Z.jsx)(u, {
						variant: "secondary",
						size: "small",
						onClick: () => a(e.name),
						children: e.name
					}, e.key))
				})]
			}),
			/* @__PURE__ */ (0, Z.jsx)("p", {
				className: "text-body-2-regular text-text-secondary",
				children: Y("follow:creatorAliases.renameHint")
			}),
			o.error ? /* @__PURE__ */ (0, Z.jsx)(R, {
				tone: "error",
				children: o.error
			}) : null,
			/* @__PURE__ */ (0, Z.jsxs)("div", {
				className: "flex flex-wrap justify-end gap-2",
				children: [/* @__PURE__ */ (0, Z.jsx)(u, {
					variant: "secondary",
					onClick: n,
					children: Y("follow:shared.cancel")
				}), /* @__PURE__ */ (0, Z.jsx)(u, {
					type: "submit",
					variant: "primary",
					disabled: !i.trim() || i.trim() === t.canonical_name,
					...q(!!o.busy),
					children: Y("follow:creatorAliases.rename")
				})]
			})
		]
	});
}
// src/react/follow-manage/alias-manager.tsx
var Sn = (e) => Y("follow:creatorAliases.removeBody", { alias: e }), Cn = It({
	rowSelectionFeature: Dt,
	rowSortingFeature: Ot,
	rowPaginationFeature: Et,
	columnVisibilityFeature: Pe,
	sortedRowModel: $t(),
	paginatedRowModel: Qt()
}), wn = Cn, Tn = {
	id: "select",
	label: Y("follow:shared.select"),
	width: 48,
	min: 48,
	max: 48,
	required: !0
}, En = {
	id: "canonical",
	label: Y("follow:creatorAliases.displayName"),
	width: 280,
	min: 240,
	required: !0,
	flex: !0
}, Dn = [
	Tn,
	En,
	{
		id: "alias",
		label: Y("follow:creatorAliases.platformAlias"),
		width: 240
	},
	{
		id: "evidence",
		label: Y("follow:creatorAliases.evidence"),
		width: 320
	},
	{
		id: "actions",
		label: Y("follow:shared.actions"),
		width: 112
	}
], On = [
	Tn,
	En,
	{
		id: "aliases",
		label: Y("follow:creatorAliases.platformAlias"),
		width: 400
	},
	{
		id: "actions",
		label: Y("follow:shared.actions"),
		width: 184,
		min: 168
	}
], kn = (e) => e.alias;
function An(e, t, n) {
	let r = n ? `name:${n}` : "", i = r && e.find((e) => e.author_key === r) || e.find((e) => e.author_name === t || e.entity_name === t);
	return i ? e.filter((e) => e.author_key === i.author_key) : [];
}
function jn({ sources: e, name: t, canonicalKey: n }) {
	return /* @__PURE__ */ (0, Z.jsxs)("span", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, Z.jsx)(qt, {
			group: An(e, t, n),
			name: t
		}), /* @__PURE__ */ (0, Z.jsx)("b", {
			className: "text-body-medium",
			children: t
		})]
	});
}
function Mn({ groups: e, suggestions: t, sources: s = [], readOnly: c, toast: l }) {
	let d = Gt("alias-suggestions", Dn), f = Gt("alias-saved", On), [p, g] = (0, X.useState)(null), [_, v] = (0, X.useState)({}), [ne, C] = (0, X.useState)({}), w = en(() => v({})), T = en(() => C({})), [E, D] = (0, X.useState)([]), [O, k] = (0, X.useState)([]), [j, N] = (0, X.useState)({
		pageIndex: 0,
		pageSize: 20
	}), [P, F] = (0, X.useState)({
		pageIndex: 0,
		pageSize: 20
	}), I = {
		...j,
		pageIndex: Math.min(j.pageIndex, Math.max(0, Math.ceil(t.length / j.pageSize) - 1))
	}, L = {
		...P,
		pageIndex: Math.min(P.pageIndex, Math.max(0, Math.ceil(e.length / P.pageSize) - 1))
	}, [re, R] = (0, X.useState)(""), [ae, oe] = (0, X.useState)(""), [z, B] = (0, X.useState)(""), V = Vt({
		mutationFn: async (e) => {
			let t = 0;
			for (let n of e) {
				try {
					await ye(n.canonical, n.alias);
				} catch (n) {
					throw t && vt(), Error(Y("follow:creatorAliases.mergePartialError", {
						error: J(n),
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
		onSuccess: (e) => {
			R(""), v({}), vt(), l(Y("follow:creatorAliases.merged", { count: e.done }));
		},
		onError: (e) => R(J(e))
	}), H = Vt({
		mutationFn: (e) => ye(e.canonical, e.alias),
		onSuccess: () => {
			R(""), oe(""), B(""), vt(), l(Y("follow:creatorAliases.saved"));
		},
		onError: (e) => R(J(e))
	}), U = Vt({
		mutationFn: async (e) => {
			let t = typeof e == "string" ? [e] : e, n = 0;
			try {
				for (let e of t) await yt(e), n += 1;
			} catch (e) {
				throw Error(Y("follow:creatorAliases.removePartialError", {
					error: J(e),
					removed: n,
					count: t.length - n
				}));
			} finally {
				vt();
			}
		},
		onSuccess: () => {
			R(""), C({}), l(Y("follow:creatorAliases.removed"));
		},
		onError: (e) => R(J(e))
	}), ce = (e, t) => {
		e.length && Ie({
			title: Y(t ? "follow:creatorAliases.mergeAllTitle" : "follow:creatorAliases.mergeSelectedTitle"),
			body: Y("follow:creatorAliases.mergeBody", {
				count: e.length,
				pairs: at(e.map((e) => Y("follow:creatorAliases.mergePair", {
					alias: _t(e.alias),
					canonical: _t(e.canonical)
				})))
			}),
			confirmLabel: Y(t ? "follow:creatorAliases.mergeAllConfirm" : "follow:creatorAliases.mergeSelectedConfirm"),
			onConfirm: () => V.mutateAsync(e)
		});
	}, le = (e) => void Ie({
		title: Y("follow:creatorAliases.removeTitle"),
		body: Sn(e),
		confirmLabel: Y("follow:creatorAliases.removeTitle"),
		onConfirm: () => U.mutateAsync(e)
	}), W = (0, X.useRef)({
		sources: s,
		readOnly: c,
		merging: V.isPending,
		removing: U.isPending,
		merge: ce,
		remove: le,
		rename: g
	});
	W.current = {
		sources: s,
		readOnly: c,
		merging: V.isPending,
		removing: U.isPending,
		merge: ce,
		remove: le,
		rename: g
	};
	let G = (0, X.useMemo)(() => {
		let e = Le();
		return e.columns([
			e.display({
				id: "select",
				header: (e) => /* @__PURE__ */ (0, Z.jsx)(pe, {
					table: e.table,
					label: Y("follow:creatorAliases.selectAllPending")
				}),
				cell: (e) => /* @__PURE__ */ (0, Z.jsx)(m, {
					slot: null,
					isSelected: e.row.getIsSelected(),
					"aria-label": Y("follow:creatorAliases.selectPendingRow", {
						alias: e.row.original.alias,
						name: e.row.original.canonical
					}),
					onChange: (t) => e.row.toggleSelected(t)
				})
			}),
			e.accessor("canonical", {
				header: Y("follow:creatorAliases.displayName"),
				cell: (e) => /* @__PURE__ */ (0, Z.jsx)(jn, {
					sources: W.current.sources,
					name: e.getValue()
				})
			}),
			e.accessor("alias", {
				header: Y("follow:creatorAliases.platformAlias"),
				cell: (e) => e.getValue()
			}),
			e.accessor((e) => At(e.evidence_code ?? "", e.evidence, e.evidence_params), {
				id: "evidence",
				header: Y("follow:creatorAliases.evidence"),
				cell: (e) => /* @__PURE__ */ (0, Z.jsx)("span", {
					className: "text-body-2-regular text-text-secondary",
					children: e.getValue()
				})
			}),
			e.display({
				id: "actions",
				header: Y("follow:shared.actions"),
				cell: (e) => /* @__PURE__ */ (0, Z.jsx)(u, {
					variant: "secondary",
					size: "small",
					disabled: W.current.readOnly,
					...q(W.current.merging),
					onClick: () => W.current.merge([e.row.original], !1),
					children: Y("follow:shared.merge")
				})
			})
		]);
	}, []), me = (0, X.useMemo)(() => {
		let e = Le();
		return e.columns([
			e.display({
				id: "select",
				header: ({ table: e }) => /* @__PURE__ */ (0, Z.jsx)(pe, {
					table: e,
					label: Y("follow:creatorAliases.selectAllSaved")
				}),
				cell: ({ row: e }) => /* @__PURE__ */ (0, Z.jsx)(m, {
					slot: null,
					"aria-label": Y("follow:creatorAliases.selectSavedRow", { name: e.original.canonical_name }),
					isSelected: e.getIsSelected(),
					onChange: (t) => e.toggleSelected(t)
				})
			}),
			e.accessor("canonical_name", {
				id: "canonical",
				header: Y("follow:creatorAliases.displayName"),
				cell: (e) => /* @__PURE__ */ (0, Z.jsx)(jn, {
					sources: W.current.sources,
					name: e.getValue(),
					canonicalKey: e.row.original.canonical_key
				})
			}),
			e.accessor("aliases", {
				header: Y("follow:creatorAliases.platformAlias"),
				sortFn: (e, t) => e.original.aliases.map((e) => e.name).join(" ").localeCompare(t.original.aliases.map((e) => e.name).join(" "), "zh-CN"),
				cell: (e) => /* @__PURE__ */ (0, Z.jsx)("span", {
					className: "flex flex-wrap items-center gap-1.5",
					children: e.getValue().map((e) => /* @__PURE__ */ (0, Z.jsxs)("span", {
						className: "inline-flex items-center gap-1 rounded-md bg-background-secondary-default px-1.5 py-1 text-caption-1-medium text-text-secondary",
						children: [e.name, /* @__PURE__ */ (0, Z.jsx)(u, {
							variant: "ghost",
							size: "xs",
							iconOnly: !0,
							leadingIcon: ie,
							"aria-label": Y("follow:creatorAliases.removeAliasNamed", { name: e.name }),
							disabled: W.current.readOnly,
							...q(W.current.removing),
							onClick: () => W.current.remove(e.name)
						})]
					}, e.key))
				})
			}),
			e.display({
				id: "actions",
				header: Y("follow:shared.actions"),
				cell: ({ row: e }) => /* @__PURE__ */ (0, Z.jsx)(u, {
					variant: "secondary",
					size: "small",
					disabled: W.current.readOnly,
					"aria-label": Y("follow:creatorAliases.renameRowLabel", { name: e.original.canonical_name }),
					onClick: () => W.current.rename(e.original),
					children: Y("follow:creatorAliases.rename")
				})
			})
		]);
	}, []), he = Wt({
		features: Cn,
		data: t,
		columns: G,
		getRowId: kn,
		state: {
			rowSelection: _,
			sorting: E,
			pagination: I,
			columnVisibility: d.visibility
		},
		onColumnVisibilityChange: d.change,
		onRowSelectionChange: (e) => {
			w(), v(e);
		},
		onSortingChange: (e) => {
			D(e), N((e) => ({
				...e,
				pageIndex: 0
			}));
		},
		onPaginationChange: N,
		enableRowSelection: !0
	}), K = Wt({
		features: wn,
		data: e,
		columns: me,
		getRowId: (e) => e.canonical_key,
		state: {
			rowSelection: ne,
			sorting: O,
			pagination: L,
			columnVisibility: f.visibility
		},
		onColumnVisibilityChange: f.change,
		onRowSelectionChange: (e) => {
			T(), C(e);
		},
		enableRowSelection: !0,
		onSortingChange: (e) => {
			k(e), F((e) => ({
				...e,
				pageIndex: 0
			}));
		},
		onPaginationChange: F
	}), _e = he.getSelectedRowModel().rows.map((e) => e.original), ve = K.getSelectedRowModel().rows.flatMap((e) => e.original.aliases.map((e) => e.name)), be = q(V.isPending);
	return /* @__PURE__ */ (0, Z.jsxs)("div", {
		className: Te({
			padding: "none",
			className: "flex flex-col gap-4 px-6 py-5 max-sm:px-4"
		}),
		children: [
			/* @__PURE__ */ (0, Z.jsx)("h3", {
				className: "text-title-2-medium text-text-primary",
				children: Y("follow:creatorAliases.title")
			}),
			/* @__PURE__ */ (0, Z.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, Z.jsx)(A, { children: Y("follow:creatorAliases.addManually") }), /* @__PURE__ */ (0, Z.jsxs)("div", {
					className: "flex flex-wrap items-end gap-2",
					children: [
						/* @__PURE__ */ (0, Z.jsx)(M, {
							"aria-label": Y("follow:creatorAliases.displayName"),
							placeholder: Y("follow:creatorAliases.displayNamePlaceholder"),
							value: ae,
							onChange: oe,
							isDisabled: c,
							className: "w-56"
						}),
						/* @__PURE__ */ (0, Z.jsx)(M, {
							"aria-label": Y("follow:creatorAliases.platformAlias"),
							placeholder: Y("follow:creatorAliases.platformAlias"),
							value: z,
							onChange: B,
							isDisabled: c,
							className: "w-56"
						}),
						/* @__PURE__ */ (0, Z.jsx)(u, {
							variant: "primary",
							disabled: c || !ae.trim() || !z.trim(),
							...q(H.isPending),
							onClick: () => H.mutate({
								canonical: ae.trim(),
								alias: z.trim()
							}),
							children: Y("follow:creatorAliases.saveAlias")
						})
					]
				})]
			}),
			re ? /* @__PURE__ */ (0, Z.jsx)(S, { children: re }) : null,
			t.length ? /* @__PURE__ */ (0, Z.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, Z.jsxs)("div", {
						"data-responsive-toolbar": "",
						children: [/* @__PURE__ */ (0, Z.jsxs)("div", {
							"data-toolbar-heading": "",
							children: [/* @__PURE__ */ (0, Z.jsx)(A, { children: Y("follow:creatorAliases.pending") }), /* @__PURE__ */ (0, Z.jsx)("span", {
								className: "text-body-2-regular text-text-secondary",
								children: Y("follow:creatorAliases.groupCount", { count: t.length })
							})]
						}), /* @__PURE__ */ (0, Z.jsxs)("div", {
							"data-toolbar-actions": "",
							children: [
								/* @__PURE__ */ (0, Z.jsx)(u, {
									variant: "primary",
									size: "small",
									disabled: c,
									...be,
									onClick: () => ce(t, !0),
									children: Y("follow:creatorAliases.mergeAllCount", { count: t.length })
								}),
								/* @__PURE__ */ (0, Z.jsx)(b, {
									label: Y("follow:creatorAliases.pendingTable"),
									sorting: E,
									options: [
										{
											id: "canonical",
											label: Y("follow:creatorAliases.displayName")
										},
										{
											id: "alias",
											label: Y("follow:creatorAliases.platformAlias")
										},
										{
											id: "evidence",
											label: Y("follow:creatorAliases.evidence")
										}
									],
									onChange: (e) => {
										D(e), N((e) => ({
											...e,
											pageIndex: 0
										}));
									}
								}),
								/* @__PURE__ */ (0, Z.jsx)(de, {
									preferences: d,
									label: Y("follow:creatorAliases.pendingTable")
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, Z.jsxs)(se, {
						label: Y("follow:creatorAliases.pendingBulkActions"),
						visible: _e.length > 0,
						count: Y("follow:creatorAliases.groupsSelected", { count: _e.length }),
						children: [/* @__PURE__ */ (0, Z.jsx)(u, {
							variant: "secondary",
							size: "small",
							disabled: c,
							...be,
							onClick: () => ce(_e, !1),
							children: Y("follow:creatorAliases.mergeSelectedCount", { count: _e.length })
						}), /* @__PURE__ */ (0, Z.jsx)(u, {
							variant: "ghost",
							size: "small",
							onClick: () => v({}),
							children: Y("follow:shared.clearSelection")
						})]
					}),
					/* @__PURE__ */ (0, Z.jsx)(ee, {
						follow: !0,
						preferences: d,
						onRowClick: (e) => he.getRow(e)?.toggleSelected(),
						children: /* @__PURE__ */ (0, Z.jsxs)(ue, {
							"aria-label": Y("follow:creatorAliases.pendingTable"),
							size: "sm",
							sortDescriptor: E[0] ? {
								column: E[0].id,
								direction: E[0].desc ? "descending" : "ascending"
							} : void 0,
							onSortChange: (e) => he.getColumn(String(e.column))?.toggleSorting(e.direction === "descending"),
							children: [/* @__PURE__ */ (0, Z.jsxs)(o, { children: [he.getHeaderGroups()[0].headers.map((e) => /* @__PURE__ */ (0, Z.jsx)(r, {
								id: e.id,
								isRowHeader: e.column.id === "canonical",
								allowsSorting: e.column.getCanSort(),
								...d.columnProps(e.id),
								children: ({ sortDirection: t }) => /* @__PURE__ */ (0, Z.jsxs)(Z.Fragment, { children: [/* @__PURE__ */ (0, Z.jsxs)("span", {
									className: "flex items-center gap-0.5",
									children: [Ze(e.column.columnDef.header, e.getContext()), e.column.getCanSort() ? /* @__PURE__ */ (0, Z.jsx)("span", {
										"data-sort-indicator": !0,
										"data-direction": t || void 0,
										children: /* @__PURE__ */ (0, Z.jsx)(h, {})
									}) : null]
								}), /* @__PURE__ */ (0, Z.jsx)(fe, {
									preferences: d,
									id: e.id
								})] })
							}, e.id)), /* @__PURE__ */ (0, Z.jsx)(r, {
								id: "remaining-space",
								"aria-label": Y("follow:shared.rowSpacer"),
								"data-table-space": "",
								width: d.spaceWidth,
								minWidth: 0
							})] }), /* @__PURE__ */ (0, Z.jsx)(n, { children: he.getRowModel().rows.map((e) => /* @__PURE__ */ (0, Z.jsxs)(i, {
								id: e.id,
								"data-board-selected": e.getIsSelected() || void 0,
								children: [e.getVisibleCells().map((e) => /* @__PURE__ */ (0, Z.jsx)(a, { children: Ze(e.column.columnDef.cell, e.getContext()) }, e.id)), /* @__PURE__ */ (0, Z.jsx)(a, { "data-table-space": "" })]
							}, e.id)) })]
						})
					}),
					/* @__PURE__ */ (0, Z.jsx)(y, {
						label: Y("follow:creatorAliases.pendingTable"),
						unit: Y("follow:creatorAliases.groupUnit"),
						total: t.length,
						pagination: I,
						onChange: N
					})
				]
			}) : null,
			/* @__PURE__ */ (0, Z.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, Z.jsxs)("div", {
						"data-responsive-toolbar": "",
						children: [/* @__PURE__ */ (0, Z.jsxs)("div", {
							"data-toolbar-heading": "",
							children: [/* @__PURE__ */ (0, Z.jsx)(A, { children: Y("follow:creatorAliases.savedAliases") }), /* @__PURE__ */ (0, Z.jsx)("span", {
								className: "text-body-2-regular text-text-secondary",
								children: Y("follow:creatorAliases.groupCount", { count: e.length })
							})]
						}), /* @__PURE__ */ (0, Z.jsxs)("div", {
							"data-toolbar-actions": "",
							children: [/* @__PURE__ */ (0, Z.jsx)(b, {
								label: Y("follow:creatorAliases.saved"),
								sorting: O,
								options: [{
									id: "canonical",
									label: Y("follow:creatorAliases.displayName")
								}, {
									id: "aliases",
									label: Y("follow:creatorAliases.platformAlias")
								}],
								onChange: (e) => {
									k(e), F((e) => ({
										...e,
										pageIndex: 0
									}));
								}
							}), /* @__PURE__ */ (0, Z.jsx)(de, {
								preferences: f,
								label: Y("follow:creatorAliases.saved")
							})]
						})]
					}),
					/* @__PURE__ */ (0, Z.jsxs)(se, {
						label: Y("follow:creatorAliases.savedBulkActions"),
						visible: ve.length > 0,
						count: Y("follow:creatorAliases.aliasesSelected", { count: ve.length }),
						children: [/* @__PURE__ */ (0, Z.jsx)(u, {
							variant: "secondary",
							size: "small",
							disabled: c,
							...q(U.isPending),
							onClick: () => void Ie({
								title: Y("follow:creatorAliases.removeSelectedTitle"),
								body: Y("follow:creatorAliases.removeSelectedBody", { count: ve.length }),
								items: ve,
								confirmLabel: Y("follow:creatorAliases.removeSelectedConfirm"),
								onConfirm: () => U.mutateAsync(ve)
							}),
							children: Y("follow:creatorAliases.removeSelectedCount", { count: ve.length })
						}), /* @__PURE__ */ (0, Z.jsx)(u, {
							variant: "ghost",
							size: "small",
							onClick: () => C({}),
							children: Y("follow:shared.clearSelection")
						})]
					}),
					e.length ? /* @__PURE__ */ (0, Z.jsxs)(Z.Fragment, { children: [/* @__PURE__ */ (0, Z.jsx)(ee, {
						follow: !0,
						preferences: f,
						onRowClick: (e) => K.getRow(e)?.toggleSelected(),
						children: /* @__PURE__ */ (0, Z.jsxs)(ue, {
							"aria-label": Y("follow:creatorAliases.saved"),
							size: "sm",
							sortDescriptor: O[0] ? {
								column: O[0].id,
								direction: O[0].desc ? "descending" : "ascending"
							} : void 0,
							onSortChange: (e) => K.getColumn(String(e.column))?.toggleSorting(e.direction === "descending"),
							children: [/* @__PURE__ */ (0, Z.jsxs)(o, { children: [K.getHeaderGroups()[0].headers.map((e) => /* @__PURE__ */ (0, Z.jsx)(r, {
								id: e.id,
								isRowHeader: e.column.id === "canonical",
								allowsSorting: e.column.getCanSort(),
								...f.columnProps(e.id),
								children: ({ sortDirection: t }) => /* @__PURE__ */ (0, Z.jsxs)(Z.Fragment, { children: [/* @__PURE__ */ (0, Z.jsxs)("span", {
									className: "flex items-center gap-0.5",
									children: [Ze(e.column.columnDef.header, e.getContext()), e.column.getCanSort() ? /* @__PURE__ */ (0, Z.jsx)("span", {
										"data-sort-indicator": !0,
										"data-direction": t || void 0,
										children: /* @__PURE__ */ (0, Z.jsx)(h, {})
									}) : null]
								}), /* @__PURE__ */ (0, Z.jsx)(fe, {
									preferences: f,
									id: e.id
								})] })
							}, e.id)), /* @__PURE__ */ (0, Z.jsx)(r, {
								id: "remaining-space",
								"aria-label": Y("follow:shared.rowSpacer"),
								"data-table-space": "",
								width: f.spaceWidth,
								minWidth: 0
							})] }), /* @__PURE__ */ (0, Z.jsx)(n, { children: K.getRowModel().rows.map((e) => /* @__PURE__ */ (0, Z.jsxs)(i, {
								id: e.id,
								"data-board-selected": e.getIsSelected() || void 0,
								children: [e.getVisibleCells().map((e) => /* @__PURE__ */ (0, Z.jsx)(a, { children: Ze(e.column.columnDef.cell, e.getContext()) }, e.id)), /* @__PURE__ */ (0, Z.jsx)(a, { "data-table-space": "" })]
							}, e.id)) })]
						})
					}), /* @__PURE__ */ (0, Z.jsx)(y, {
						label: Y("follow:creatorAliases.saved"),
						unit: Y("follow:creatorAliases.groupUnit"),
						total: e.length,
						pagination: L,
						onChange: F
					})] }) : /* @__PURE__ */ (0, Z.jsx)(te, {
						size: "compact",
						icon: ge,
						title: Y("follow:creatorAliases.emptyTitle"),
						actions: c ? void 0 : /* @__PURE__ */ (0, Z.jsx)(x, {
							target: `input[aria-label="${Y("follow:creatorAliases.displayName")}"]`,
							children: Y("follow:creatorAliases.addAlias")
						}),
						children: Y("follow:creatorAliases.emptyBody")
					})
				]
			}),
			/* @__PURE__ */ (0, Z.jsx)(bn, {
				group: p,
				close: () => g(null),
				receipt: l
			})
		]
	});
}
// src/react/follow-manage/feed-sources.tsx
var Nn = It({
	rowPaginationFeature: Et,
	rowSelectionFeature: Dt,
	rowSortingFeature: Ot,
	columnVisibilityFeature: Pe,
	sortedRowModel: $t(),
	paginatedRowModel: Qt()
}), Pn = {
	select: Y("follow:shared.select"),
	name: Y("follow:shared.name"),
	kind: Y("follow:shared.type"),
	origin: Y("follow:followFeed.filterKindSource"),
	status: Y("follow:shared.status"),
	interval: Y("follow:feedSources.colInterval"),
	fetched: Y("follow:feedSources.colLastFetched"),
	fresh: Y("follow:feedSources.colLastAdded"),
	actions: Y("follow:shared.actions")
}, Fn = /* @__PURE__ */ new Set(["actions"]), In = Object.entries(Pn).map(([e, t]) => ({
	id: e,
	label: t,
	width: e === "select" ? 48 : e === "name" ? 300 : e === "actions" ? 208 : e === "fetched" ? 200 : e === "origin" ? 184 : 160,
	min: e === "select" ? 48 : e === "actions" ? 200 : e === "name" ? 300 : 112,
	max: e === "select" ? 48 : e === "name" ? 2e3 : 800,
	flex: e === "name",
	required: e === "select" || e === "name"
})), Ln = () => gt.invalidateQueries({
	queryKey: C,
	exact: !0
}), Rn = (e) => e.name || e.url;
function zn(e) {
	try {
		return new URL(e).hostname.replace(/^www\./, "");
	} catch {
		return e;
	}
}
function Bn({ source: e }) {
	return e.enabled ? e.last_error ? /* @__PURE__ */ (0, Z.jsx)(g, {
		variant: "caption",
		color: "rose",
		children: Y("follow:feedSources.fetchFailed")
	}) : e.last_fetched_at ? /* @__PURE__ */ (0, Z.jsx)(g, {
		variant: "caption",
		color: "lime",
		children: Y("follow:shared.ok")
	}) : /* @__PURE__ */ (0, Z.jsx)(g, {
		variant: "caption",
		color: "gray",
		children: Y("follow:feedSources.notChecked")
	}) : /* @__PURE__ */ (0, Z.jsx)(g, {
		variant: "caption",
		color: "gray",
		children: Y("follow:shared.paused")
	});
}
function Vn({ source: e }) {
	let t = e.entity_kind === "studio", [n, r] = (0, X.useState)(!1);
	if ((0, X.useEffect)(() => {
		r(!1);
	}, [e.entity_id, e.logo_version]), t && e.has_logo && !n) {
		let t = `/logo?studio=${encodeURIComponent(Rn(e))}&variant=icon${e.logo_version ? `&v=${encodeURIComponent(e.logo_version)}` : ""}`;
		return /* @__PURE__ */ (0, Z.jsx)("span", {
			"aria-hidden": !0,
			className: `relative inline-grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-background-tertiary-default ${tn}`,
			children: /* @__PURE__ */ (0, Z.jsx)("img", {
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
	return /* @__PURE__ */ (0, Z.jsx)("span", {
		"aria-hidden": !0,
		className: `relative inline-grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-background-tertiary-default text-caption-1-semibold text-text-secondary ${tn}`,
		dangerouslySetInnerHTML: { __html: we(Rn(e), i, null, t ? "studio" : "performer") }
	});
}
var Hn = (e, t) => e.entity_id !== null && t.has(e.entity_id) && e.page_name && e.page_name !== e.name ? e.page_name : "";
function Un(e) {
	let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
	for (let { entity_id: r } of e) r !== null && (t.has(r) ? n.add(r) : t.add(r));
	return n;
}
function Wn(e, t) {
	let n = e.length === 1 ? e[0] : null;
	return Ie({
		title: n ? Y("follow:feedSources.removeOne") : Y("follow:feedSources.removeMany", { count: e.length }),
		body: n ? Y("follow:feedSources.removeOneBody", { name: Rn(n) }) : Y("follow:feedSources.removeManyBody"),
		confirmLabel: Y(n ? "follow:feedSources.removeOne" : "follow:feedSources.removeSelected"),
		danger: !0,
		onConfirm: t
	});
}
function Gn({ readOnly: e, toast: t, onAdd: c, selection: l }) {
	let d = Ht({
		queryKey: C,
		queryFn: ({ signal: e }) => qe(e)
	}), p = zt(), g = Gt("jav-feeds", In), _ = d.data, v = (0, X.useMemo)(() => _?.sources ?? [], [_]), [x, ne] = (0, X.useState)(/* @__PURE__ */ new Set()), w = l?.ids ?? x, T = l?.onChange ?? ne, [E, D] = (0, X.useState)(1), [O, k] = (0, X.useState)(20), [A, M] = (0, X.useState)([]), N = pt(v.length, O, E);
	(0, X.useEffect)(() => {
		D((e) => Math.min(e, N.pages));
	}, [N.pages]), (0, X.useEffect)(() => {
		T((e) => {
			let t = new Set(v.map((e) => e.id)), n = new Set([...e].filter((e) => t.has(e)));
			return n.size === e.size ? e : n;
		});
	}, [v, T]);
	let F = Vt({
		mutationFn: async (e) => {
			let t = await ut(e.ids, 4, async (t) => {
				e.action === "remove" ? await bt(t) : await jt(t, e.action === "enabled");
			});
			return {
				...e,
				results: t
			};
		},
		onSuccess: (e) => {
			let n = e.results.filter((e) => !e.ok), r = e.ids.length - n.length;
			if (T(/* @__PURE__ */ new Set()), Ln(), e.action === "remove" && r && t(Y("follow:feedSources.removedMany", { count: r })), n.length) {
				let e = n[0];
				p.setError(Y("follow:feedSources.writeFailed", {
					count: n.length,
					error: e.ok ? "" : J(e.error)
				}));
			}
		},
		onError: (e) => p.setError(J(e))
	}), I = (0, X.useMemo)(() => Un(v), [v]), L = (0, X.useRef)({
		readOnly: e,
		shared: I,
		busy: null,
		toggle: () => {},
		fetch: () => {},
		remove: () => {}
	});
	L.current = {
		readOnly: e,
		shared: I,
		busy: p.busy,
		toggle: (e, t) => void p.run(`enabled-${e.id}`, (n) => jt(e.id, t, n), () => void Ln()),
		fetch: (e) => void p.run(`check-${e.id}`, (t) => Oe(t, [e.id]), () => void Ln()),
		remove: (e) => void Wn([e], async () => {
			await bt(e.id), t(Y("follow:feedSources.removedOne", { name: Rn(e) })), Ln();
		})
	};
	let re = (0, X.useMemo)(() => {
		let e = Le(), t = (e) => () => Pn[e] || e;
		return e.columns([
			e.display({
				id: "select",
				header: (e) => /* @__PURE__ */ (0, Z.jsx)(pe, {
					table: e.table,
					label: Y("follow:feedSources.selectPage"),
					page: !0
				}),
				cell: (e) => /* @__PURE__ */ (0, Z.jsx)(m, {
					slot: null,
					isSelected: e.row.getIsSelected(),
					onChange: (t) => e.row.toggleSelected(t),
					"aria-label": Y("follow:shared.selectNamed", { name: Rn(e.row.original) })
				})
			}),
			e.accessor(Rn, {
				id: "name",
				header: t("name"),
				cell: (e) => {
					let t = Hn(e.row.original, L.current.shared);
					return /* @__PURE__ */ (0, Z.jsxs)("span", {
						className: "flex items-center gap-2 whitespace-nowrap text-body-medium text-text-primary",
						children: [
							/* @__PURE__ */ (0, Z.jsx)(Vn, { source: e.row.original }),
							e.getValue(),
							t ? /* @__PURE__ */ (0, Z.jsx)("span", {
								className: "text-body-2-regular text-text-secondary",
								title: Y("follow:feedSources.aliasTitle", { alias: t }),
								children: t
							}) : null
						]
					});
				}
			}),
			e.accessor((e) => Ne(e, "kind_label"), {
				id: "kind",
				header: t("kind"),
				cell: (e) => /* @__PURE__ */ (0, Z.jsx)("span", {
					className: "whitespace-nowrap",
					children: e.getValue()
				})
			}),
			e.accessor((e) => e.url, {
				id: "origin",
				header: t("origin"),
				cell: (e) => /* @__PURE__ */ (0, Z.jsxs)("a", {
					href: e.getValue(),
					target: "_blank",
					rel: "noopener noreferrer",
					title: Y("follow:followDetail.viewOnSite"),
					className: "max-w-full text-text-primary underline-offset-2 hover:underline",
					children: [/* @__PURE__ */ (0, Z.jsx)(U, {
						site: e.row.original.kind.startsWith("javdb") ? "javdb" : e.row.original.kind.startsWith("dmm") ? "dmm" : zn(e.getValue()),
						label: zn(e.getValue())
					}), /* @__PURE__ */ (0, Z.jsx)(K, {
						"aria-hidden": !0,
						className: "size-(--icon-inline) shrink-0"
					})]
				})
			}),
			e.accessor((e) => e.last_error ? Y("follow:feedSources.fetchFailed") : e.enabled ? Y("follow:shared.enabled") : Y("follow:shared.paused"), {
				id: "status",
				header: t("status"),
				cell: (e) => /* @__PURE__ */ (0, Z.jsx)(Bn, { source: e.row.original })
			}),
			e.accessor((e) => e.interval_minutes, {
				id: "interval",
				header: t("interval"),
				cell: (e) => /* @__PURE__ */ (0, Z.jsx)("span", {
					className: "whitespace-nowrap",
					children: We(e.getValue())
				})
			}),
			e.accessor((e) => e.last_fetched_at && Date.parse(e.last_fetched_at) || 0, {
				id: "fetched",
				header: t("fetched"),
				cell: (e) => /* @__PURE__ */ (0, Z.jsx)("span", {
					className: "whitespace-nowrap tabular-nums",
					children: e.row.original.last_fetched_at ? ct(e.row.original.last_fetched_at) : Y("follow:feedSources.neverFetched")
				})
			}),
			e.accessor((e) => e.last_new_count, {
				id: "fresh",
				header: t("fresh"),
				cell: (e) => /* @__PURE__ */ (0, Z.jsx)("span", {
					className: "whitespace-nowrap tabular-nums",
					children: Y("follow:feedSources.itemCount", { count: e.getValue() })
				})
			}),
			e.display({
				id: "actions",
				header: t("actions"),
				cell: (e) => /* @__PURE__ */ (0, Z.jsxs)("span", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, Z.jsx)(W, {
							"aria-label": Y("follow:shared.enableNamed", { name: Rn(e.row.original) }),
							isSelected: e.row.original.enabled,
							isDisabled: L.current.readOnly,
							onChange: (t) => L.current.toggle(e.row.original, t)
						}),
						/* @__PURE__ */ (0, Z.jsx)(u, {
							variant: "secondary",
							size: "small",
							iconOnly: !0,
							leadingIcon: Be,
							"aria-label": Y("follow:feedSources.fetchNamed", { name: Rn(e.row.original) }),
							disabled: L.current.readOnly,
							...q(L.current.busy === `check-${e.row.original.id}`),
							onClick: () => L.current.fetch(e.row.original)
						}),
						/* @__PURE__ */ (0, Z.jsx)(u, {
							variant: "secondary",
							size: "small",
							iconOnly: !0,
							leadingIcon: P,
							"aria-label": Y("follow:shared.removeNamed", { name: Rn(e.row.original) }),
							disabled: L.current.readOnly,
							onClick: () => L.current.remove(e.row.original)
						})
					]
				})
			})
		]);
	}, []), ie = (0, X.useMemo)(() => Object.fromEntries([...w].map((e) => [String(e), !0])), [w]), ae = Wt({
		features: Nn,
		data: v,
		columns: re,
		getRowId: (e) => String(e.id),
		state: {
			rowSelection: ie,
			sorting: A,
			pagination: {
				pageIndex: N.page - 1,
				pageSize: O
			},
			columnVisibility: g.visibility
		},
		onColumnVisibilityChange: g.change,
		onSortingChange: (e) => {
			M(e), D(1);
		},
		enableRowSelection: !0,
		onRowSelectionChange: (e) => {
			l?.onActivate();
			let t = typeof e == "function" ? e(ie) : e;
			T(new Set(Object.entries(t).filter(([, e]) => e).map(([e]) => Number(e))));
		}
	});
	if (!_) return d.error ? /* @__PURE__ */ (0, Z.jsx)(R, {
		tone: "error",
		title: Y("follow:feedSources.loadFailed"),
		children: J(d.error)
	}) : /* @__PURE__ */ (0, Z.jsx)(j, { children: Y("follow:feedSources.loading") });
	let oe = () => void p.run("check", (e) => Oe(e), () => void Ln()), z = (e) => {
		l?.onActivate(), T((t) => {
			let n = new Set(t);
			return n.has(e) ? n.delete(e) : n.add(e), n;
		});
	}, B = v.filter((e) => w.has(e.id)), V = v.filter((e) => e.last_error);
	return /* @__PURE__ */ (0, Z.jsx)("div", {
		className: "flex flex-col gap-3",
		children: /* @__PURE__ */ (0, Z.jsxs)("section", {
			"aria-label": Y("follow:feedSources.listLabel"),
			className: Te({
				padding: "none",
				className: "flex flex-col gap-4 px-6 py-5 max-sm:px-4"
			}),
			children: [
				/* @__PURE__ */ (0, Z.jsxs)("div", {
					"data-responsive-toolbar": "",
					children: [/* @__PURE__ */ (0, Z.jsxs)("div", {
						"data-toolbar-heading": "",
						children: [/* @__PURE__ */ (0, Z.jsx)("h3", {
							className: "text-title-2-medium text-text-primary",
							children: Y("follow:feedSources.title")
						}), /* @__PURE__ */ (0, Z.jsx)("span", {
							className: "text-body-2-regular text-text-secondary",
							children: Y("follow:feedSources.summary", {
								count: v.length,
								unread: Number(_.unread) || 0
							})
						})]
					}), /* @__PURE__ */ (0, Z.jsxs)("div", {
						"data-toolbar-actions": "",
						children: [
							/* @__PURE__ */ (0, Z.jsx)(u, {
								onClick: oe,
								disabled: e,
								...q(p.busy === "check"),
								children: Y("follow:feedSources.fetchNow")
							}),
							/* @__PURE__ */ (0, Z.jsx)(de, {
								preferences: g,
								label: Y("follow:feedSources.title")
							}),
							/* @__PURE__ */ (0, Z.jsx)(b, {
								label: Y("follow:feedSources.title"),
								sorting: A,
								onChange: (e) => {
									M(e), D(1);
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
									label: Pn[e]
								}))
							})
						]
					})]
				}),
				V.length || p.error ? /* @__PURE__ */ (0, Z.jsxs)("div", {
					className: "flex flex-col gap-3",
					children: [V.length ? /* @__PURE__ */ (0, Z.jsx)(R, {
						tone: "error",
						title: Y("follow:feedSources.failedTitle", { count: V.length }),
						extra: /* @__PURE__ */ (0, Z.jsx)("ul", {
							className: "flex flex-col gap-0.5 text-body-2-regular",
							children: V.map((e) => /* @__PURE__ */ (0, Z.jsx)("li", {
								className: "min-w-0 truncate",
								title: Ne(e, "last_error"),
								children: Y("follow:shared.labeled", {
									label: Rn(e),
									value: Ue(Ne(e, "last_error")) || Y("follow:shared.noReason")
								})
							}, e.id))
						}),
						children: Y("follow:feedSources.failedBody")
					}) : null, p.error ? /* @__PURE__ */ (0, Z.jsx)(S, { children: p.error }) : null]
				}) : null,
				/* @__PURE__ */ (0, Z.jsxs)(se, {
					visible: B.length > 0,
					label: Y("follow:feedSources.bulkActions"),
					count: Y("follow:feedSources.selectedCount", { count: B.length }),
					children: [
						/* @__PURE__ */ (0, Z.jsx)(u, {
							variant: "secondary",
							size: "small",
							disabled: e,
							...q(F.isPending),
							onClick: () => F.mutate({
								ids: B.map((e) => e.id),
								action: "enabled"
							}),
							children: Y("follow:shared.enable")
						}),
						/* @__PURE__ */ (0, Z.jsx)(u, {
							variant: "secondary",
							size: "small",
							disabled: e,
							...q(F.isPending),
							onClick: () => F.mutate({
								ids: B.map((e) => e.id),
								action: "paused"
							}),
							children: Y("follow:shared.pause")
						}),
						/* @__PURE__ */ (0, Z.jsx)(u, {
							variant: "danger",
							size: "small",
							disabled: e,
							...q(F.isPending),
							onClick: () => void Wn(B, () => F.mutateAsync({
								ids: B.map((e) => e.id),
								action: "remove"
							})),
							children: Y("follow:shared.remove")
						}),
						/* @__PURE__ */ (0, Z.jsx)(u, {
							variant: "ghost",
							size: "small",
							onClick: () => T(/* @__PURE__ */ new Set()),
							children: Y("follow:shared.clearSelection")
						})
					]
				}),
				v.length ? /* @__PURE__ */ (0, Z.jsx)(ee, {
					follow: !0,
					preferences: g,
					onRowClick: (e) => z(Number(e)),
					children: /* @__PURE__ */ (0, Z.jsxs)(ue, {
						"aria-label": Y("follow:feedSources.title"),
						size: "sm",
						sortDescriptor: A[0] ? {
							column: A[0].id,
							direction: A[0].desc ? "descending" : "ascending"
						} : void 0,
						onSortChange: (e) => ae.getColumn(String(e.column))?.toggleSorting(e.direction === "descending"),
						children: [/* @__PURE__ */ (0, Z.jsxs)(o, { children: [ae.getHeaderGroups()[0].headers.map((e) => {
							let t = Ze(e.column.columnDef.header, e.getContext());
							return /* @__PURE__ */ (0, Z.jsx)(r, {
								id: e.id,
								isRowHeader: e.column.id === "name",
								allowsSorting: e.column.getCanSort(),
								...g.columnProps(e.id),
								children: ({ sortDirection: n }) => /* @__PURE__ */ (0, Z.jsxs)(Z.Fragment, { children: [Fn.has(e.column.id) ? /* @__PURE__ */ (0, Z.jsx)(s, { children: t }) : /* @__PURE__ */ (0, Z.jsxs)("span", {
									className: "flex items-center gap-0.5",
									children: [t, e.column.getCanSort() ? /* @__PURE__ */ (0, Z.jsx)("span", {
										"data-sort-indicator": !0,
										"data-direction": n || void 0,
										children: /* @__PURE__ */ (0, Z.jsx)(h, {})
									}) : null]
								}), /* @__PURE__ */ (0, Z.jsx)(fe, {
									preferences: g,
									id: e.id
								})] })
							}, e.id);
						}), /* @__PURE__ */ (0, Z.jsx)(r, {
							id: "remaining-space",
							"aria-label": Y("follow:shared.rowSpacer"),
							"data-table-space": "",
							width: g.spaceWidth,
							minWidth: 0
						})] }), /* @__PURE__ */ (0, Z.jsx)(n, { children: ae.getRowModel().rows.map((e) => /* @__PURE__ */ (0, Z.jsxs)(i, {
							id: e.id,
							"data-follow-selected": e.getIsSelected() || void 0,
							children: [e.getVisibleCells().map((e) => /* @__PURE__ */ (0, Z.jsx)(a, { children: Ze(e.column.columnDef.cell, e.getContext()) }, e.id)), /* @__PURE__ */ (0, Z.jsx)(a, { "data-table-space": "" })]
						}, e.id)) })]
					})
				}) : /* @__PURE__ */ (0, Z.jsx)(te, {
					icon: f,
					title: Y("follow:feedSources.empty"),
					size: "compact",
					actions: e ? void 0 : /* @__PURE__ */ (0, Z.jsx)(u, {
						variant: "secondary",
						onClick: c,
						children: Y("follow:feedSources.add")
					}),
					children: Y("follow:feedSources.emptyHint")
				}),
				v.length ? /* @__PURE__ */ (0, Z.jsx)(y, {
					label: Y("follow:feedSources.footerLabel"),
					total: N.total,
					unit: Y("follow:feedSources.unit"),
					pagination: {
						pageIndex: N.page - 1,
						pageSize: O
					},
					onChange: (e) => {
						k(e.pageSize), D(e.pageIndex + 1);
					}
				}) : null,
				/* @__PURE__ */ (0, Z.jsx)("footer", {
					className: "-mx-6 -mb-5 flex flex-wrap items-center gap-2 border-t border-separator-border rounded-b-2xl bg-card-footer px-6 py-4 max-sm:-mx-4 max-sm:px-4",
					children: /* @__PURE__ */ (0, Z.jsx)("span", {
						role: "status",
						className: "mr-auto text-body-2-regular text-text-secondary",
						children: Y("follow:feedSources.footerSummary", {
							unread: Number(_.unread) || 0,
							enabled: v.filter((e) => e.enabled).length,
							total: v.length
						})
					})
				})
			]
		})
	});
}
// src/react/jav/studio-subscriptions.tsx
function Kn({ close: e }) {
	let t = Ut(), [n, r] = (0, X.useState)(""), [i, a] = (0, X.useState)(""), [o, s] = (0, X.useState)(!1), [c, l] = (0, X.useState)(!1), [u, d] = (0, X.useState)(""), [f, p] = (0, X.useState)(""), m = async (e) => {
		if (e.preventDefault(), !o && n.trim() && i.trim()) {
			s(!0), d("");
			try {
				let e = await xe("/api/feeds/merge-studio", {
					target: n.trim(),
					source: i.trim()
				});
				p(Y("catalog:studioSubscriptions.mergeDone", {
					target: e.target,
					source: e.source,
					count: e.assets
				})), r(""), a(""), await t.invalidateQueries({ queryKey: ["studio-subscriptions"] });
			} catch (e) {
				d(J(e));
			} finally {
				s(!1);
			}
		}
	}, h = async () => {
		if (!c) {
			l(!0), d("");
			try {
				let e = await xe("/api/feeds/merge-duplicate-studios", {});
				p(Y("catalog:studioSubscriptions.mergeAutoDone", { count: e.merged?.length || 0 })), await t.invalidateQueries({ queryKey: ["studio-subscriptions"] });
			} catch (e) {
				d(J(e));
			} finally {
				l(!1);
			}
		}
	};
	return /* @__PURE__ */ (0, Z.jsxs)("form", {
		"data-studio-merge": "",
		onSubmit: m,
		className: "flex flex-col gap-2 rounded-xl border border-separator-border bg-background-secondary-default p-4",
		children: [
			/* @__PURE__ */ (0, Z.jsx)("strong", {
				className: "text-body-1-medium text-text-primary",
				children: Y("catalog:studioSubscriptions.mergeTitle")
			}),
			/* @__PURE__ */ (0, Z.jsx)("p", {
				className: "text-caption-1-regular text-text-secondary",
				children: Y("catalog:studioSubscriptions.mergeHint")
			}),
			/* @__PURE__ */ (0, Z.jsxs)("div", {
				className: "flex flex-wrap items-end gap-2",
				children: [
					/* @__PURE__ */ (0, Z.jsxs)("label", {
						className: "flex min-w-40 flex-col gap-1 text-caption-1-regular text-text-secondary",
						children: [Y("catalog:studioSubscriptions.mergeTarget"), /* @__PURE__ */ (0, Z.jsx)("input", {
							value: n,
							onChange: (e) => r(e.target.value),
							disabled: o,
							className: "h-9 rounded-lg border border-separator-border bg-surface px-2 text-body-2-regular text-text-primary"
						})]
					}),
					/* @__PURE__ */ (0, Z.jsxs)("label", {
						className: "flex min-w-40 flex-col gap-1 text-caption-1-regular text-text-secondary",
						children: [Y("catalog:studioSubscriptions.mergeSource"), /* @__PURE__ */ (0, Z.jsx)("input", {
							value: i,
							onChange: (e) => a(e.target.value),
							disabled: o,
							className: "h-9 rounded-lg border border-separator-border bg-surface px-2 text-body-2-regular text-text-primary"
						})]
					}),
					/* @__PURE__ */ (0, Z.jsx)("button", {
						type: "submit",
						disabled: o || !n.trim() || !i.trim(),
						className: "h-9 rounded-lg bg-control px-3 text-body-2-medium text-text-primary hover:bg-control-hover disabled:opacity-50",
						children: Y(o ? "catalog:studioSubscriptions.mergeBusy" : "catalog:studioSubscriptions.mergeSubmit")
					}),
					/* @__PURE__ */ (0, Z.jsx)("button", {
						type: "button",
						disabled: c,
						className: "h-9 rounded-lg bg-control px-3 text-body-2-medium text-text-primary hover:bg-control-hover disabled:opacity-50",
						onClick: () => void h(),
						children: Y(c ? "catalog:studioSubscriptions.mergeAutoBusy" : "catalog:studioSubscriptions.mergeAuto")
					}),
					/* @__PURE__ */ (0, Z.jsx)("button", {
						type: "button",
						className: "h-9 rounded-lg px-3 text-body-2-medium text-text-secondary hover:bg-control",
						onClick: e,
						children: Y("catalog:studioSubscriptions.mergeClose")
					})
				]
			}),
			f ? /* @__PURE__ */ (0, Z.jsx)("p", {
				className: "text-caption-1-regular text-text-primary",
				children: f
			}) : null,
			u ? /* @__PURE__ */ (0, Z.jsx)("p", {
				className: "text-caption-1-regular text-text-primary",
				children: u
			}) : null
		]
	});
}
// src/react/follow-manage/source-list.tsx
var qn = It({
	rowPaginationFeature: Et,
	rowSelectionFeature: Dt,
	rowSortingFeature: Ot,
	columnVisibilityFeature: Pe,
	paginatedRowModel: Qt()
}), Jn = Object.fromEntries(Object.entries(p).map(([e, t]) => [t, e])), Yn = 740;
function Xn() {
	let [e, t] = (0, X.useState)(!1), n = (0, X.useRef)(null), r = (0, X.useCallback)((e) => {
		if (n.current?.disconnect(), !e) {
			n.current = null;
			return;
		}
		let r = new ResizeObserver(() => t(e.clientWidth < Yn));
		r.observe(e), n.current = r, t(e.clientWidth < Yn);
	}, []);
	return (0, X.useEffect)(() => () => n.current?.disconnect(), []), [r, e];
}
var Zn = {
	select: Y("follow:shared.select"),
	author: Y("follow:shared.creator"),
	source: Y("follow:followFeed.filterKindSource"),
	provider: Y("follow:shared.site"),
	status: Y("follow:shared.status"),
	checked: Y("follow:sourceList.colLastChecked"),
	actions: Y("follow:shared.actions")
}, Qn = Object.entries(Zn).map(([e, t]) => ({
	id: e,
	label: t,
	width: e === "select" ? 48 : e === "source" ? 320 : e === "author" ? 240 : e === "actions" ? 208 : 184,
	min: e === "select" ? 48 : e === "actions" ? 200 : e === "source" ? 320 : 112,
	max: e === "select" ? 48 : e === "source" ? 2e3 : 800,
	flex: e === "source",
	required: e === "select" || e === "source"
}));
function $n({ source: e, selected: t, onToggle: n, handlers: r }) {
	return /* @__PURE__ */ (0, Z.jsxs)("div", {
		"data-selected": t || void 0,
		"data-follow-source-row": "",
		className: "flex min-h-16 flex-wrap items-center gap-3 px-2 py-3 last:rounded-b-lg max-sm:gap-x-2",
		onClick: (e) => {
			Me(e, e.currentTarget) && n(!t);
		},
		children: [
			/* @__PURE__ */ (0, Z.jsx)(m, {
				isSelected: t,
				onChange: n,
				"aria-label": Y("follow:shared.selectNamed", { name: e.label })
			}),
			/* @__PURE__ */ (0, Z.jsxs)("span", {
				className: "flex min-w-0 grow basis-0 items-center gap-1.5",
				children: [/* @__PURE__ */ (0, Z.jsx)("span", {
					"data-follow-source-site": "",
					className: "flex shrink-0 items-center text-body-medium",
					children: /* @__PURE__ */ (0, Z.jsx)(Yt, { provider: e.provider })
				}), /* @__PURE__ */ (0, Z.jsx)(Xt, { source: e })]
			}),
			/* @__PURE__ */ (0, Z.jsx)(s, { children: e.provider_label }),
			/* @__PURE__ */ (0, Z.jsx)(Zt, { source: e }),
			e.last_error ? /* @__PURE__ */ (0, Z.jsxs)("span", {
				"data-follow-source-error": "",
				className: "flex min-w-0 basis-full gap-3 max-sm:gap-x-2 sm:order-last",
				children: [/* @__PURE__ */ (0, Z.jsx)("span", {
					"aria-hidden": !0,
					className: "w-4 shrink-0"
				}), /* @__PURE__ */ (0, Z.jsxs)("span", {
					className: "flex min-w-0 grow gap-1.5",
					children: [/* @__PURE__ */ (0, Z.jsx)("span", {
						"aria-hidden": !0,
						className: "w-(--icon-inline) shrink-0 text-body-medium"
					}), /* @__PURE__ */ (0, Z.jsx)("span", {
						className: "min-w-0 grow",
						children: /* @__PURE__ */ (0, Z.jsx)(Jt, { text: Ne(e, "last_error") })
					})]
				})]
			}) : null,
			/* @__PURE__ */ (0, Z.jsxs)("span", {
				"data-follow-source-controls": "",
				className: "flex w-max max-w-full flex-none flex-wrap items-center gap-1.5 max-sm:w-full",
				children: [
					/* @__PURE__ */ (0, Z.jsx)("span", {
						className: "shrink-0 text-body-2-regular whitespace-nowrap text-text-secondary max-sm:mr-auto max-sm:text-caption-1-regular",
						children: je(e)
					}),
					/* @__PURE__ */ (0, Z.jsx)(W, {
						"aria-label": Y("follow:shared.enableNamed", { name: e.label }),
						isSelected: e.enabled,
						isDisabled: r.readOnly,
						onChange: (t) => r.toggle(e, t)
					}),
					/* @__PURE__ */ (0, Z.jsxs)("span", {
						className: "flex shrink-0 items-center gap-1",
						children: [/* @__PURE__ */ (0, Z.jsx)(u, {
							variant: "secondary",
							size: "small",
							iconOnly: !0,
							leadingIcon: Be,
							"aria-label": Y("follow:sourceList.checkNamed", { name: e.label }),
							disabled: !e.enabled || r.readOnly,
							...q(r.busy),
							onClick: () => r.check([e.id])
						}), /* @__PURE__ */ (0, Z.jsx)(u, {
							variant: "secondary",
							size: "small",
							iconOnly: !0,
							leadingIcon: P,
							"aria-label": Y("follow:shared.removeNamed", { name: e.label }),
							disabled: r.readOnly,
							onClick: () => r.remove(e)
						})]
					})
				]
			})
		]
	});
}
function er({ group: e, name: t, open: n, selected: r, handlers: i, onOpen: a, onToggleGroup: o, onToggle: c }) {
	let l = e.map((e) => e.id), d = e.filter((e) => e.enabled).map((e) => e.id), f = e.filter(nt).length, p = at([...new Set(e.map((e) => e.provider_label || e.provider))]), m = `follow-author-${e[0].id}`, h = kt(r, l);
	return /* @__PURE__ */ (0, Z.jsxs)("section", {
		"aria-label": Y("follow:sourceList.groupLabel", { name: t }),
		className: Te({
			variant: "raised",
			padding: "none",
			className: "flex flex-col overflow-hidden p-2"
		}),
		children: [/* @__PURE__ */ (0, Z.jsxs)("div", {
			"data-follow-author-header": !0,
			"data-open": n || void 0,
			className: "flex flex-wrap items-center gap-3 px-2 py-2.5",
			children: [
				/* @__PURE__ */ (0, Z.jsx)(qt, {
					group: e,
					name: t
				}),
				/* @__PURE__ */ (0, Z.jsxs)("span", {
					className: "flex min-w-0 grow basis-0 flex-col gap-1",
					children: [/* @__PURE__ */ (0, Z.jsx)("b", {
						className: "min-w-0 text-body-medium wrap-anywhere text-text-primary",
						children: t
					}), /* @__PURE__ */ (0, Z.jsxs)("span", {
						"data-follow-author-sites": "",
						className: "flex min-w-0 flex-wrap items-center gap-1 text-body-2-regular",
						title: p,
						children: [
							e.map((e) => /* @__PURE__ */ (0, Z.jsx)(Yt, { provider: e.provider }, e.id)),
							/* @__PURE__ */ (0, Z.jsx)(s, { children: Y("follow:sourceList.providers", { providers: p }) }),
							f ? /* @__PURE__ */ (0, Z.jsx)("span", {
								className: "ml-1 shrink-0 text-text-error-primary",
								children: Y("follow:shared.failedCount", { count: f })
							}) : null
						]
					})]
				}),
				/* @__PURE__ */ (0, Z.jsxs)("span", {
					"data-follow-author-controls": "",
					className: "flex flex-none items-center gap-2 max-sm:w-full max-sm:justify-end",
					children: [/* @__PURE__ */ (0, Z.jsx)(u, {
						variant: "secondary",
						size: "small",
						iconOnly: !0,
						leadingIcon: Be,
						"aria-label": Y("follow:sourceList.checkGroup", { name: t }),
						disabled: !d.length || i.readOnly,
						...q(i.busy),
						onClick: () => i.check(d)
					}), /* @__PURE__ */ (0, Z.jsxs)("span", {
						className: "flex flex-none items-center gap-2",
						children: [/* @__PURE__ */ (0, Z.jsx)(u, {
							variant: "secondary",
							size: "small",
							leadingIcon: st,
							"aria-pressed": h.all ? "true" : h.some ? "mixed" : "false",
							"aria-label": Y(h.all ? "follow:sourceList.deselectGroup" : "follow:sourceList.selectGroup", { name: t }),
							onClick: () => o(!h.all),
							children: h.all ? Y("follow:shared.deselectAll") : Y("follow:shared.selectAll")
						}), /* @__PURE__ */ (0, Z.jsx)(u, {
							variant: "secondary",
							size: "small",
							"aria-expanded": n,
							"aria-controls": m,
							leadingIcon: _,
							"aria-label": Y(n ? "follow:sourceList.collapseGroup" : "follow:sourceList.expandGroup", { name: t }),
							onClick: () => a(!n),
							children: Y(n ? "follow:shared.collapse" : "follow:shared.expand")
						})]
					})]
				})
			]
		}), /* @__PURE__ */ (0, Z.jsx)(v, {
			id: m,
			open: n,
			"data-source-divider": !0,
			children: e.map((e) => /* @__PURE__ */ (0, Z.jsx)($n, {
				source: e,
				handlers: i,
				selected: r.has(e.id),
				onToggle: (t) => c(e.id, t)
			}, e.id))
		})]
	});
}
function tr(e) {
	let { data: t, sort: c, dir: l, page: d, layout: g, pageSize: v, selected: b, readOnly: x, onSort: S, onPage: ne, onLayout: C, onPageSize: E, onSelected: D, toast: O, openFollow: k, onAdd: A } = e, j = t.sources, M = (0, X.useMemo)(() => t.author_aliases || [], [t.author_aliases]), F = t.counts || {}, [I, L] = (0, X.useState)(/* @__PURE__ */ new Set()), [re, ie] = Xn(), [z, H] = (0, X.useState)(""), U = (0, X.useMemo)(() => Se(j, c, l, M), [
		j,
		c,
		l,
		M
	]), le = (0, X.useMemo)(() => Lt(U, c, l, M), [
		U,
		c,
		l,
		M
	]), { job: G, running: K, outcome: ge, start: _e } = Bt({
		queryKey: w,
		taskKey: T,
		queryFn: ({ signal: e }) => Ge(e),
		start: (e) => Pt(e),
		onError: (e) => H(J(e)),
		onFinish: (e) => {
			vt(), O(e.status === "failed" ? it(e, "error") || Y("follow:followCheck.checkFailed") : ke(e));
		}
	}), ye = (e) => {
		K || _e.isPending || (H(""), _e.mutate(e));
	}, be = (e, t) => D(Rt(b, [e], t)), xe = (e, t) => D(Rt(b, e, t)), we = Vt({
		mutationFn: (e) => xt(e),
		onSuccess: (e, t) => {
			Ve([t]), D(Rt(b, [t], !1)), O(Y("follow:sourceList.unfollowed"));
		},
		onError: (e) => H(J(e))
	}), Oe = Vt({
		mutationFn: (e) => Mt(e.id, e.enabled),
		onSuccess: (e, t) => {
			mt(t.id, { enabled: t.enabled }), H("");
		},
		onError: (e) => H(J(e))
	}), Me = (e) => void Ie({
		title: Y("follow:sourceList.unfollow"),
		body: Y("follow:sourceList.unfollowBody"),
		confirmLabel: Y("follow:sourceList.unfollow"),
		danger: !0,
		onConfirm: () => we.mutateAsync(e.id)
	}), Pe = Vt({
		mutationFn: async (e) => {
			let t = await ut(e.ids, 4, async (t) => {
				e.action === "remove" ? await xt(t) : await Mt(t, e.action === "enabled");
			});
			return {
				...e,
				done: e.ids.filter((e, n) => t[n]?.ok),
				results: t
			};
		},
		onSuccess: (e) => {
			if (e.action === "remove") Ve(e.done);
			else for (let t of e.done) mt(t, { enabled: e.action === "enabled" });
			D(Rt(b, e.done, !1));
			let t = e.results.filter((e) => !e.ok);
			if (t.length) {
				H(Y("follow:sourceList.bulkPartialFail", {
					failed: t.length,
					total: e.ids.length,
					error: J(t[0]?.error)
				}));
				return;
			}
			H("");
			let n = e.action === "remove" ? "follow:sourceList.bulkDeleted" : e.action === "enabled" ? "follow:sourceList.bulkEnabled" : "follow:sourceList.bulkPaused";
			O(Y(n, { count: e.done.length }));
		},
		onError: (e) => H(J(e))
	}), Fe = Vt({
		mutationFn: dt,
		onSuccess: (e) => {
			vt(), e.failed ? H(Y("follow:sourceList.bulkMarkFailed", {
				failed: e.failed,
				total: e.total,
				error: J(e.error)
			})) : (H(""), O(Y("follow:sourceList.bulkMarked", { count: e.total })));
		},
		onError: (e) => H(J(e))
	}), Re = (e, t) => Oe.mutate({
		id: e.id,
		enabled: t
	}), ze = (0, X.useRef)({
		check: ye,
		toggle: Re,
		remove: Me,
		busy: !1,
		readOnly: x
	});
	ze.current = {
		check: ye,
		toggle: Re,
		remove: Me,
		busy: K || _e.isPending,
		readOnly: x
	};
	let We = ze.current, Ke = (0, X.useMemo)(() => {
		let e = Le(), t = (e) => () => Zn[e] || e;
		return e.columns([
			e.display({
				id: "select",
				header: (e) => /* @__PURE__ */ (0, Z.jsx)(pe, {
					table: e.table,
					label: Y("follow:sourceList.selectPage"),
					page: !0
				}),
				cell: (e) => /* @__PURE__ */ (0, Z.jsx)(m, {
					slot: null,
					isSelected: e.row.getIsSelected(),
					onChange: (t) => e.row.toggleSelected(t),
					"aria-label": Y("follow:shared.selectNamed", { name: e.row.original.source.label })
				})
			}),
			e.accessor((e) => e.author, {
				id: "author",
				header: t("author"),
				cell: (e) => /* @__PURE__ */ (0, Z.jsxs)("span", {
					className: "flex min-w-0 items-center gap-2",
					children: [/* @__PURE__ */ (0, Z.jsx)(qt, {
						group: e.row.original.group,
						name: e.row.original.author
					}), /* @__PURE__ */ (0, Z.jsx)("span", {
						className: "min-w-0 break-words",
						children: e.row.original.author
					})]
				})
			}),
			e.accessor((e) => e.source.label, {
				id: "source",
				header: t("source"),
				cell: (e) => /* @__PURE__ */ (0, Z.jsxs)("span", {
					className: "flex min-w-0 flex-col gap-0.5",
					children: [/* @__PURE__ */ (0, Z.jsx)(Xt, { source: e.row.original.source }), e.row.original.source.last_error ? /* @__PURE__ */ (0, Z.jsx)(Jt, { text: Ne(e.row.original.source, "last_error") }) : null]
				})
			}),
			e.accessor((e) => e.source.provider_label, {
				id: "provider",
				header: t("provider"),
				cell: (e) => /* @__PURE__ */ (0, Z.jsxs)("span", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, Z.jsx)(Yt, { provider: e.row.original.source.provider }), e.row.original.source.provider_label]
				})
			}),
			e.display({
				id: "status",
				header: t("status"),
				cell: (e) => /* @__PURE__ */ (0, Z.jsx)(Zt, { source: e.row.original.source })
			}),
			e.accessor((e) => e.source.last_checked_at || "", {
				id: "checked",
				header: t("checked"),
				cell: (e) => je(e.row.original.source)
			}),
			e.display({
				id: "actions",
				header: t("actions"),
				cell: (e) => /* @__PURE__ */ (0, Z.jsxs)("span", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, Z.jsx)(W, {
							"aria-label": Y("follow:shared.enableNamed", { name: e.row.original.source.label }),
							isSelected: e.row.original.source.enabled,
							isDisabled: We.readOnly,
							onChange: (t) => ze.current.toggle(e.row.original.source, t)
						}),
						/* @__PURE__ */ (0, Z.jsx)(u, {
							variant: "secondary",
							size: "small",
							iconOnly: !0,
							leadingIcon: Be,
							"aria-label": Y("follow:sourceList.checkNamed", { name: e.row.original.source.label }),
							disabled: !e.row.original.source.enabled || We.readOnly,
							...q(We.busy),
							onClick: () => ze.current.check([e.row.original.source.id])
						}),
						/* @__PURE__ */ (0, Z.jsx)(u, {
							variant: "secondary",
							size: "small",
							iconOnly: !0,
							leadingIcon: P,
							"aria-label": Y("follow:shared.removeNamed", { name: e.row.original.source.label }),
							disabled: We.readOnly,
							onClick: () => ze.current.remove(e.row.original.source)
						})
					]
				})
			})
		]);
	}, [We]), qe = (0, X.useMemo)(() => {
		let e = Jn[c];
		return e ? [{
			id: e,
			desc: l === "desc"
		}] : [];
	}, [c, l]), Je = (0, X.useMemo)(() => Object.fromEntries([...b].map((e) => [String(e), !0])), [b]), Ye = g === "table", Xe = Gt("follow-sources", Qn), Qe = pt(Ye ? le.length : U.length, v, d), $e = Wt({
		features: qn,
		data: le,
		columns: Ke,
		getRowId: (e) => String(e.source.id),
		state: {
			sorting: qe,
			rowSelection: Je,
			pagination: {
				pageIndex: Qe.page - 1,
				pageSize: v
			},
			columnVisibility: Xe.visibility
		},
		onColumnVisibilityChange: Xe.change,
		manualSorting: !0,
		enableRowSelection: !0,
		onSortingChange: (e) => {
			let t = (typeof e == "function" ? e(qe) : e)[0];
			if (!t) return;
			let n = p[t.id];
			n && S(n, t.desc ? "desc" : "asc");
		},
		onRowSelectionChange: (e) => {
			let t = typeof e == "function" ? e(Je) : e;
			D(new Set(Object.entries(t).filter(([, e]) => e).map(([e]) => Number(e))));
		},
		onPaginationChange: (e) => {
			let t = {
				pageIndex: Qe.page - 1,
				pageSize: v
			}, n = typeof e == "function" ? e(t) : e;
			n.pageSize === v ? n.pageIndex !== t.pageIndex && ne(n.pageIndex + 1) : E(n.pageSize);
		}
	}), et = $e.getRowModel().rows, tt = Ye ? et.map((e) => e.original.source.id) : U.slice(Qe.start, Qe.end).flatMap((e) => e.map((e) => e.id)), nt = kt(b, tt), rt = [...b], at = De(ge), ot = j.filter((e) => e.enabled && (e.last_status === "error" || e.last_status === "unauthorized")).map((e) => e.id), st = Ee(ge), ct = U.length > 0 && I.size >= U.length;
	return j.length ? /* @__PURE__ */ (0, Z.jsxs)("div", {
		className: Te({
			padding: "none",
			className: "flex flex-col gap-4 px-6 py-5 max-sm:px-4"
		}),
		children: [
			/* @__PURE__ */ (0, Z.jsxs)("div", {
				ref: re,
				"data-follow-toolbar": "",
				"data-responsive-toolbar": "",
				children: [/* @__PURE__ */ (0, Z.jsxs)("span", {
					"data-follow-toolbar-heading": "",
					"data-toolbar-heading": "",
					children: [/* @__PURE__ */ (0, Z.jsx)("h3", {
						className: "text-title-2-medium text-text-primary",
						children: Y("follow:followManageNav.list")
					}), /* @__PURE__ */ (0, Z.jsx)("span", {
						className: "text-body-2-regular text-text-secondary",
						children: F.new ? Y("follow:sourceList.sourceCountUnseen", {
							count: j.length,
							unseen: Number(F.new) || 0
						}) : Y("follow:sourceList.sourceCount", { count: j.length })
					})]
				}), /* @__PURE__ */ (0, Z.jsxs)("div", {
					"data-follow-toolbar-actions": "",
					"data-toolbar-actions": "",
					children: [
						ot.length ? /* @__PURE__ */ (0, Z.jsx)(u, {
							variant: "secondary",
							disabled: x,
							...q(We.busy),
							onClick: () => ye(ot),
							children: Y("follow:sourceList.checkFailed")
						}) : null,
						/* @__PURE__ */ (0, Z.jsx)(u, {
							variant: "primary",
							leadingIcon: Be,
							disabled: x,
							"aria-label": Y("follow:sourceList.checkAll"),
							iconOnly: ie,
							...q(We.busy),
							onClick: () => ye([]),
							children: Y("follow:sourceList.checkAll")
						}),
						/* @__PURE__ */ (0, Z.jsxs)("span", {
							"data-follow-toolbar-controls": "",
							className: "contents",
							children: [
								/* @__PURE__ */ (0, Z.jsxs)("span", {
									"data-button-group": !0,
									role: "group",
									"aria-label": Y("follow:sourceList.layout"),
									children: [/* @__PURE__ */ (0, Z.jsx)(u, {
										variant: "ghost",
										iconOnly: !0,
										leadingIcon: he,
										"aria-label": N[0][1],
										"aria-pressed": !Ye,
										onClick: () => C("default")
									}), /* @__PURE__ */ (0, Z.jsx)(u, {
										variant: "ghost",
										iconOnly: !0,
										leadingIcon: He,
										"aria-label": N[1][1],
										"aria-pressed": Ye,
										onClick: () => C("table")
									})]
								}),
								Ye ? /* @__PURE__ */ (0, Z.jsx)(de, {
									preferences: Xe,
									label: Y("follow:sourceList.tableLabel")
								}) : null,
								/* @__PURE__ */ (0, Z.jsxs)("span", {
									className: "flex flex-none items-center gap-2",
									children: [/* @__PURE__ */ (0, Z.jsx)(B, {
										"aria-label": Y("follow:sourceList.sortLabel"),
										prefix: Y("follow:shared.sort"),
										selectedKey: c,
										onSelectionChange: (e) => {
											if (e === null) return;
											let t = String(e);
											S(t, ae[t]);
										},
										children: oe.map(([e, t]) => /* @__PURE__ */ (0, Z.jsx)(V, {
											id: e,
											children: t
										}, e))
									}), /* @__PURE__ */ (0, Z.jsx)(u, {
										variant: "secondary",
										iconOnly: !0,
										leadingIcon: ce,
										"data-icon-state": l === "asc" ? "a" : "b",
										"aria-label": Nt(c, l),
										onClick: () => S(c, l === "asc" ? "desc" : "asc")
									})]
								}),
								Ye ? null : /* @__PURE__ */ (0, Z.jsx)(u, {
									variant: "secondary",
									iconOnly: ie,
									leadingIcon: _,
									"aria-expanded": !ct,
									"aria-label": Y(ct ? "follow:shared.expandAll" : "follow:shared.collapseAll"),
									onClick: () => L(ct ? /* @__PURE__ */ new Set() : new Set(U.map((e) => String(e[0].author_key || e[0].id)))),
									children: Y(ct ? "follow:shared.expandAll" : "follow:shared.collapseAll")
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, Z.jsxs)("div", {
				"aria-live": "polite",
				className: "flex flex-col gap-3 empty:hidden",
				children: [
					K ? /* @__PURE__ */ (0, Z.jsx)(me, {
						embedded: !0,
						kind: G?.older ? ve("feed-scrape") : ve("follow-check"),
						label: it(G) || (G?.total ? Y(G.older ? "follow:sourceList.backfillProgress" : "follow:sourceList.checkProgress", {
							checked: G.checked || 0,
							count: G.total
						}) : Y("follow:sourceList.preparingCheck")),
						value: G?.checked,
						total: G?.total
					}) : null,
					z ? /* @__PURE__ */ (0, Z.jsx)(R, {
						tone: "error",
						title: Y("follow:shared.actionFailed"),
						children: z
					}) : null,
					!K && ge?.results?.length ? /* @__PURE__ */ (0, Z.jsx)(R, {
						tone: "neutral",
						title: Y("follow:followFeed.checkResults"),
						children: Ae(ge)
					}) : null,
					at.length ? /* @__PURE__ */ (0, Z.jsx)(R, {
						tone: "error",
						title: Y("follow:sourceList.failedTitle", { count: at.length }),
						extra: /* @__PURE__ */ (0, Z.jsx)("ul", {
							className: "flex flex-col gap-0.5 text-body-2-regular",
							children: at.map((e, t) => /* @__PURE__ */ (0, Z.jsx)("li", { children: Y("follow:shared.labeled", {
								label: `${e.provider_label || e.provider || ""} ${e.author || e.label || e.ref || ""}`.trim(),
								value: Ue(e.error || "") || Y("follow:shared.noReason")
							}) }, `${e.provider || ""}-${e.ref || t}`))
						}),
						children: Y("follow:sourceList.failedBody")
					}) : null,
					st ? /* @__PURE__ */ (0, Z.jsx)(R, {
						tone: "warning",
						children: Y("follow:sourceList.evidenceGap", { error: st })
					}) : null
				]
			}),
			/* @__PURE__ */ (0, Z.jsxs)(se, {
				label: Y("follow:sourceList.bulkActions"),
				visible: rt.length > 0,
				count: Y("follow:sourceList.selectedCount", { count: rt.length }),
				children: [
					/* @__PURE__ */ (0, Z.jsx)(u, {
						variant: "secondary",
						size: "small",
						disabled: x,
						...q(We.busy),
						onClick: () => ye(rt),
						children: Y("follow:sourceList.checkSelected")
					}),
					/* @__PURE__ */ (0, Z.jsx)(u, {
						variant: "secondary",
						size: "small",
						disabled: x,
						...q(Pe.isPending),
						onClick: () => Pe.mutate({
							ids: rt,
							action: "enabled"
						}),
						children: Y("follow:shared.enable")
					}),
					/* @__PURE__ */ (0, Z.jsx)(u, {
						variant: "secondary",
						size: "small",
						disabled: x,
						...q(Pe.isPending),
						onClick: () => Pe.mutate({
							ids: rt,
							action: "paused"
						}),
						children: Y("follow:shared.pause")
					}),
					/* @__PURE__ */ (0, Z.jsx)(u, {
						variant: "danger",
						size: "small",
						disabled: x,
						...q(Pe.isPending),
						onClick: () => void Ie({
							title: Y("follow:sourceList.deleteManyTitle", { count: rt.length }),
							body: Y("follow:sourceList.deleteManyBody"),
							confirmLabel: Y("follow:sourceList.deleteSelected"),
							danger: !0,
							onConfirm: () => Pe.mutateAsync({
								ids: rt,
								action: "remove"
							})
						}),
						children: Y("follow:shared.delete")
					}),
					/* @__PURE__ */ (0, Z.jsx)(u, {
						variant: "ghost",
						size: "small",
						onClick: () => D(/* @__PURE__ */ new Set()),
						children: Y("follow:shared.clearSelection")
					})
				]
			}),
			Ye ? /* @__PURE__ */ (0, Z.jsx)(ee, {
				follow: !0,
				preferences: Xe,
				onRowClick: (e) => be(Number(e), !b.has(Number(e))),
				children: /* @__PURE__ */ (0, Z.jsxs)(ue, {
					"aria-label": Y("follow:sourceList.tableLabel"),
					size: "sm",
					sortDescriptor: qe[0] ? {
						column: qe[0].id,
						direction: qe[0].desc ? "descending" : "ascending"
					} : void 0,
					onSortChange: (e) => $e.setSorting([{
						id: String(e.column),
						desc: e.direction === "descending"
					}]),
					children: [/* @__PURE__ */ (0, Z.jsxs)(o, { children: [$e.getHeaderGroups()[0].headers.map((e) => {
						let t = e.column.id in p, n = Ze(e.column.columnDef.header, e.getContext());
						return /* @__PURE__ */ (0, Z.jsx)(r, {
							id: e.id,
							allowsSorting: t,
							isRowHeader: e.column.id === "source",
							...Xe.columnProps(e.id),
							children: ({ sortDirection: r }) => /* @__PURE__ */ (0, Z.jsxs)(Z.Fragment, { children: [e.id === "select" ? n : t ? /* @__PURE__ */ (0, Z.jsxs)("span", {
								className: "flex items-center gap-0.5",
								children: [n, /* @__PURE__ */ (0, Z.jsx)("span", {
									"data-sort-indicator": !0,
									"data-direction": r || void 0,
									children: /* @__PURE__ */ (0, Z.jsx)(h, {})
								})]
							}) : /* @__PURE__ */ (0, Z.jsx)(s, { children: n }), /* @__PURE__ */ (0, Z.jsx)(fe, {
								preferences: Xe,
								id: e.id
							})] })
						}, e.id);
					}), /* @__PURE__ */ (0, Z.jsx)(r, {
						id: "remaining-space",
						"aria-label": Y("follow:shared.rowSpacer"),
						"data-table-space": "",
						width: Xe.spaceWidth,
						minWidth: 0
					})] }), /* @__PURE__ */ (0, Z.jsx)(n, {
						renderEmptyState: () => Y("follow:sourceList.pageEmpty"),
						children: et.map((e) => /* @__PURE__ */ (0, Z.jsxs)(i, {
							id: e.id,
							"data-follow-selected": e.getIsSelected() || void 0,
							children: [e.getVisibleCells().map((e) => /* @__PURE__ */ (0, Z.jsx)(a, { children: Ze(e.column.columnDef.cell, e.getContext()) }, e.id)), /* @__PURE__ */ (0, Z.jsx)(a, { "data-table-space": "" })]
						}, e.id))
					})]
				})
			}) : /* @__PURE__ */ (0, Z.jsxs)(Z.Fragment, { children: [/* @__PURE__ */ (0, Z.jsx)(m, {
				isSelected: nt.all,
				isIndeterminate: nt.some,
				onChange: (e) => xe(tt, e),
				"aria-label": Y("follow:sourceList.selectPage"),
				children: Y("follow:sourceList.selectPageShort")
			}), /* @__PURE__ */ (0, Z.jsx)("div", {
				className: "flex flex-col gap-3",
				children: U.slice(Qe.start, Qe.end).map((e) => {
					let t = String(e[0].author_key || e[0].id);
					return /* @__PURE__ */ (0, Z.jsx)(er, {
						group: e,
						name: Ce(e, M),
						handlers: We,
						selected: b,
						open: !I.has(t),
						onOpen: (e) => {
							let n = new Set(I);
							e ? n.delete(t) : n.add(t), L(n);
						},
						onToggleGroup: (t) => xe(e.map((e) => e.id), t),
						onToggle: be
					}, t);
				})
			})] }),
			/* @__PURE__ */ (0, Z.jsx)(y, {
				label: Y("follow:followManageNav.list"),
				total: Qe.total,
				pagination: {
					pageIndex: Qe.page - 1,
					pageSize: v
				},
				unit: Y(Ye ? "follow:followOverview.sourceUnit" : "follow:sourceList.creatorUnit"),
				pageUnit: Y(Ye ? "follow:followOverview.itemUnit" : "follow:followOverview.creatorUnit"),
				onChange: (e) => {
					e.pageSize === v ? $e.setPageIndex(e.pageIndex) : $e.setPageSize(e.pageSize);
				}
			}),
			F.new ? /* @__PURE__ */ (0, Z.jsxs)("div", {
				className: "-mx-6 -mb-5 flex flex-wrap items-center gap-2 border-t border-separator-border rounded-b-2xl bg-card-footer px-6 py-4 max-sm:-mx-4 max-sm:px-4",
				children: [
					/* @__PURE__ */ (0, Z.jsx)("span", {
						className: "mr-auto text-body-2-regular text-text-secondary",
						children: Y("follow:sourceList.markSummary", {
							unwatched: Number(F.new) || 0,
							watched: Number(F.seen) || 0,
							saved: Number(F.saved) || 0,
							ignored: Number(F.ignored) || 0
						})
					}),
					/* @__PURE__ */ (0, Z.jsx)(u, {
						variant: "secondary",
						size: "small",
						onClick: k,
						children: Y("follow:sourceList.seeUpdates")
					}),
					/* @__PURE__ */ (0, Z.jsx)(u, {
						variant: "secondary",
						size: "small",
						disabled: x,
						...q(Fe.isPending),
						onClick: () => void Ie({
							title: Y("follow:followDetail.markSeen"),
							body: Y("follow:sourceList.markWatchedBody"),
							confirmLabel: Y("follow:followDetail.markSeen"),
							onConfirm: () => Fe.mutateAsync("seen")
						}),
						children: Y("follow:sourceList.markAllWatched")
					}),
					/* @__PURE__ */ (0, Z.jsx)(u, {
						variant: "secondary",
						size: "small",
						disabled: x,
						...q(Fe.isPending),
						onClick: () => void Ie({
							title: Y("follow:sourceList.markIgnored"),
							body: Y("follow:sourceList.markIgnoredBody"),
							confirmLabel: Y("follow:sourceList.markIgnored"),
							onConfirm: () => Fe.mutateAsync("ignored")
						}),
						children: Y("follow:sourceList.ignoreAll")
					})
				]
			}) : null
		]
	}) : /* @__PURE__ */ (0, Z.jsx)(te, {
		icon: f,
		title: Y("follow:sourceList.empty"),
		actions: /* @__PURE__ */ (0, Z.jsx)(u, {
			variant: "primary",
			size: "small",
			onClick: A,
			children: Y("follow:followFeed.addFollow")
		}),
		children: Y("follow:sourceList.emptyHint")
	});
}
// node_modules/.pnpm/skullet@0.0.3_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/skullet/dist/index.mjs
var nr = "skullet-reveal", rr = "skullet-pane", ir = "skullet-loading", ar = "skullet-ghost", or = "skullet-snapshot", sr = "skullet-layer", cr = "skullet-rect", lr = "skullet-bar", ur = "skullet-inactive", dr = "skullet-exiting", fr = "skullet-covered", pr = "skullet-own", mr = "skullet-block", hr = Symbol.for("skullet.ghost"), gr = Symbol.for("skullet.uncover"), _r = "skullet-status", vr = "skullet-xray", yr = "var(--skullet-base, rgb(128 128 128 / 0.2))", br = "var(--skullet-highlight, rgb(255 255 255 / 0.12))", xr = 280, Sr = 1e4, Cr = {
	shimmer: {
		slow: 4e3,
		fast: 2e3
	},
	pulse: {
		slow: 2400,
		fast: 1200
	}
}, wr = [
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
], Tr = [
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
], Er = Tr.join(", "), Dr = `
[${nr}] {
  position: relative;
}

skullet-reveal {
  display: block;
}

skullet-reveal[loading]:not(:defined) {
  visibility: hidden;
}

[${rr}] {
  display: block;
}

[${ir}] {
  position: relative;
  -webkit-user-select: none;
  user-select: none;
  pointer-events: none;
}

[${ur}] {
  display: none !important;
}

[${sr}] {
  position: absolute;
  inset: 0;
  overflow: visible;
}

[${lr}] {
  display: block;
  background-color: ${yr};
  background-repeat: no-repeat;
}

/* Containers keep their surface; what they hold is drawn by bones, measured before the first paint */
@scope ([${ir}]) to ([${pr}], [${sr}]) {
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
  :scope :is(${wr.join(", ")}):empty:not(svg *)::before {
    content: "000000";
  }

  /* Leaves are drawn by bones, so their own paint never shows; visibility, as measuring reads it */
  :scope :is(:not(:has(*)), ${Er}, [${fr}], [${mr}]):not(svg *) {
    visibility: hidden !important;
  }

  /* No script to measure: a bar struck through each line of text instead */
  @media (scripting: none) {
    :scope :not(:has(*)):not(svg *) {
      visibility: visible !important;
    }

    :scope,
    :scope * {
      text-decoration: line-through ${yr} !important;
      text-decoration-thickness: 0.72em !important;
      text-decoration-skip-ink: none !important;
    }

    :scope :is(${Er}, [${mr}]):not(svg *) {
      visibility: visible !important;
      background: ${yr} !important;
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
[${_r}] {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

/* Debug x-ray: the ghost shown through its bones, to see what was measured */
[${vr}] [${ir}] [${ar}],
[${vr}] [${ir}] [${ar}] *:not(svg *) {
  visibility: visible !important;
  color: rgb(255 0 80 / 0.7) !important;
  -webkit-text-fill-color: rgb(255 0 80 / 0.7) !important;
}

/* Lets addStyles see a stylesheet already on the page, from styles.css or a server render */
:root {
  --skullet: 1;
}`, Or = null, kr = 0, Ar;
function jr() {
	kr++, !Or && (Ar ??= !!getComputedStyle(document.documentElement).getPropertyValue("--skullet"), !Ar && (Or = document.createElement("style"), Or.dataset.skullet = "true", Or.textContent = Dr, document.head.appendChild(Or)));
}
function Mr() {
	kr--, !(kr > 0 || !Or) && (Or.remove(), Or = null);
}
var Nr = "\"use strict\";(()=>{var B=\"skullet-ghost\";var D=\"skullet-layer\",L=\"skullet-rect\";var R=\"skullet-covered\",$=\"skullet-own\",v=\"skullet-ignore\",H=\"skullet-block\",I=Symbol.for(\"skullet.ghost\"),G=Symbol.for(\"skullet.uncover\"),P=\"skullet.boot\";var W=\"var(--skullet-base, rgb(128 128 128 / 0.2))\",z=\"var(--skullet-highlight, rgb(255 255 255 / 0.12))\";var F={shimmer:{slow:4e3,fast:2e3},pulse:{slow:2400,fast:1200}},X=[\"a\",\"b\",\"code\",\"dd\",\"dt\",\"em\",\"h1\",\"h2\",\"h3\",\"h4\",\"h5\",\"h6\",\"i\",\"label\",\"li\",\"p\",\"small\",\"span\",\"strong\",\"td\",\"th\",\"time\"],U=[\"audio\",\"canvas\",\"embed\",\"iframe\",\"img\",\"input\",\"object\",\"picture\",\"select\",\"svg\",\"textarea\",\"video\"];var gt,V=()=>gt??(gt=/jsdom/.test(navigator.userAgent)?null:document.createElement(\"canvas\").getContext(\"2d\"));var J=(t,n)=>t?{left:Math.max(t.left,n.left),right:Math.min(t.right,n.right),top:Math.max(t.top,n.top),bottom:Math.min(t.bottom,n.bottom)}:n,A=t=>[[t.left,t.top],[t.right,t.top],[t.right,t.bottom],[t.left,t.bottom]],k=(t,n)=>Math.abs(t[0]-n[0])<1&&Math.abs(t[1]-n[1])<1;function Q(t,n){let e=Math.min(n.right-n.left,n.bottom-n.top),o=r=>r.endsWith(\"%\")?parseFloat(r)/100*e:parseFloat(r)||0;return[o(t.borderTopLeftRadius),o(t.borderTopRightRadius),o(t.borderBottomRightRadius),o(t.borderBottomLeftRadius)]}function bt(t,n,e){let o=J(t,n),r=Q(e,n),c=t?A(t):[],a=A(n),l=A(o).map((f,T)=>k(f,a[T])?r[T]:t&&k(f,c[T])?t.corners[T]:0),{left:s,right:i,top:u,bottom:h}=o;return{left:s,right:i,top:u,bottom:h,corners:l}}function Tt(t,n,e,o){if(!t)return e;let r=A(t),c=A(n).map((l,s)=>t.corners[s]>0&&k(l,r[s]));if(!c.some(Boolean))return e;let a=Q(o,n);return c.map((l,s)=>l?Math.max(a[s],t.corners[s]):a[s]).map(l=>`${l}px`).join(\" \")}var j=(t,n)=>{let e=J(n,t);return e.right-e.left>=2&&e.bottom-e.top>=2?e:null},q={top:\"ascender\",bottom:\"descender\"},C=new Map,tt=t=>[...t.getClientRects?.()??[]];function St(t){let n=`${t.fontStyle} ${t.fontWeight} ${t.fontSize} ${t.fontFamily}`;if(C.has(n))return C.get(n);let e=V(),o=null;if(e){e.font=n;let r=e.measureText(\"H\"),c=a=>e.measureText(a).actualBoundingBoxAscent;o={ascent:r.fontBoundingBoxAscent,descent:r.fontBoundingBoxDescent,ascender:c(\"bdfhkl\"),capHeight:r.actualBoundingBoxAscent,xHeight:c(\"xz\"),descender:e.measureText(\"gjpqy\").actualBoundingBoxDescent}}return C.set(n,o),o}var Y={ascender:\"ascender\",\"cap-height\":\"capHeight\",\"x-height\":\"xHeight\"},K=(t,n,e,o)=>{let r=t.getPropertyValue(n).trim();return e.includes(r)?r:o};function xt(t,n,e){let o=St(n);if(!o){let s=Math.min(e*.72,t.bottom-t.top),i=(t.top+t.bottom)/2;return{barTop:i-s/2,barBottom:i+s/2}}let r=K(n,\"--skullet-text-top\",Object.keys(Y),q.top),c=K(n,\"--skullet-text-bottom\",[\"baseline\",\"descender\"],q.bottom),a=o.ascent+o.descent,l=t.top+(t.bottom-t.top-a)/2+o.ascent;return{barTop:l-o[Y[r]],barBottom:l+(c===\"descender\"?o.descender:0)}}var Et=new Set(U),Rt=new Set(X),et=.4,At=/[,/]\\s*0\\)$/,y=(t,n)=>t!==\"\"&&t!==n,yt=[\"Top\",\"Right\",\"Bottom\",\"Left\"],Mt=t=>yt.every(n=>y(t[`border${n}Style`],\"none\")&&y(t[`border${n}Width`],\"0px\")),Ct=t=>{let[n=0,e=0,o=0,r=0]=(t.replace(/rgba?\\([^)]*\\)|#\\w+/g,\"\").match(/-?[\\d.]+px/g)??[]).map(parseFloat);return t.includes(\"inset\")&&!o&&!r&&n===0!=(e===0)&&Math.abs(n+e)<=2},kt=t=>y(t,\"none\")&&!t.split(/,(?![^(]*\\))/).every(Ct),Ot=t=>y(t.backgroundColor,\"transparent\")&&!At.test(t.backgroundColor)||y(t.backgroundImage,\"none\")||kt(t.boxShadow)||Mt(t),ot=t=>Et.has(t.localName),nt=t=>Rt.has(t.localName)&&!t.firstElementChild&&!t.textContent?.trim(),wt=t=>{let n=document.createTreeWalker(t,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT),e=document.createRange(),o=[],r=0;for(;n.nextNode();){let i=n.currentNode;if(i.nodeType===Node.TEXT_NODE){let u=i.parentElement;if(!i.textContent?.trim()||!u)continue;r++;let h=u.getBoundingClientRect();if(h.width<=1||h.height<=1)continue;e.selectNodeContents(i),o.push(tt(e).filter(f=>f.width||f.height))}else nt(i)&&(r++,o.push([...i.getClientRects()]))}if(!o.some(i=>i.length))return r;let c=(parseFloat(getComputedStyle(t).fontSize)||16)*et,a=(i,u)=>Math.min(i.bottom,u.bottom)-Math.max(i.top,u.top)>=Math.min(i.height,u.height)/2&&Math.max(i.left,u.left)-Math.min(i.right,u.right)<=c,l=o.map((i,u)=>u),s=i=>l[i]===i?i:l[i]=s(l[i]);for(let i=0;i<o.length;i++)for(let u=i+1;u<o.length;u++)o[i].some(h=>o[u].some(f=>a(h,f)))&&(l[s(u)]=s(i));return new Set(o.map((i,u)=>s(u))).size},Nt=(t,n)=>t.hasAttribute(H)||ot(t)||Ot(n)&&wt(t)<=1;function _t(t,n){if(parseFloat(n.borderRadius)||!t.parentElement)return n.borderRadius||\"0px\";let e=t.parentElement,o=getComputedStyle(e),r=t.getBoundingClientRect(),c=e.getBoundingClientRect();return Math.abs(r.width-c.width)<1&&Math.abs(r.height-c.height)<1&&o.overflow!==\"visible\"?o.borderRadius:n.borderRadius||\"0px\"}function Z(t){t.sort((e,o)=>e.left-o.left);let n=[];for(let e of t){let o=n.find(r=>{let c=Math.min(r.bottom,e.bottom)-Math.max(r.top,e.top),a=Math.min(r.bottom-r.top,e.bottom-e.top),l=e.left-r.right;return c>=a/2&&l<=Math.max(r.fontSize,e.fontSize)*et});o?(o.left=Math.min(o.left,e.left),o.right=Math.max(o.right,e.right),o.top=Math.min(o.top,e.top),o.bottom=Math.max(o.bottom,e.bottom),o.fontSize=Math.max(o.fontSize,e.fontSize),o.barTop=Math.min(o.barTop,e.barTop),o.barBottom=Math.max(o.barBottom,e.barBottom)):n.push({...e})}return n.map(e=>{let o=e.barBottom-e.barTop;return{x:e.left,y:e.barTop,width:e.right-e.left,height:o,radius:e.radius||`${Math.round(o/3)}px`}})}function rt(t,n,{mark:e=!0,onCovered:o}={}){let r=n.getBoundingClientRect(),c=n.offsetWidth?r.width/n.offsetWidth:1,a=n.offsetHeight?r.height/n.offsetHeight:1,l=m=>({left:(m.left-r.left)/c,right:(m.right-r.left)/c,top:(m.top-r.top)/a,bottom:(m.bottom-r.top)/a}),s=[],i=[],u=new Set,h=document.createRange(),f=(m,g,b)=>{let d=j(m,b);if(!d)return;let p=parseFloat(g.fontSize)||16,M=l(d);i.push({...M,fontSize:p,...xt(M,g,p),radius:g.getPropertyValue(\"--skullet-radius\").trim()})},T=(m,g)=>{let b=m.data.search(/\\S/);if(b<0||!m.parentElement)return;h.setStart(m,b),h.setEnd(m,m.data.trimEnd().length);let d=getComputedStyle(m.parentElement);for(let p of tt(h))f(p,d,g)},_=(m,g)=>{for(let b of m.childNodes){if(b.nodeType===Node.TEXT_NODE){T(b,g);continue}if(b.nodeType!==Node.ELEMENT_NODE)continue;let d=b;if(d.hasAttribute(v)||d.hasAttribute($))continue;let p=getComputedStyle(d);if(p.display===\"none\")continue;if(Nt(d,p)){let E=j(d.getBoundingClientRect(),g);if(E){let S=l(E);s.push({x:S.left,y:S.top,width:S.right-S.left,height:S.bottom-S.top,radius:Tt(g,E,_t(d,p),p)})}ot(d)||u.add(d);continue}if(nt(d)){for(let E of d.getClientRects())f(E,p,g);continue}let M=p.overflowX!==\"visible\"||p.overflowY!==\"visible\";_(d,M?bt(g,d.getBoundingClientRect(),p):g)}};if(_(t,null),o?.(u),!e)return[...s,...Z(i)];for(let m of t.querySelectorAll(`[${R}]`))u.has(m)||m.removeAttribute(R);for(let m of u)m.hasAttribute(R)||m.setAttribute(R,\"\");return[...s,...Z(i)]}var Bt=t=>typeof matchMedia<\"u\"&&matchMedia(t).matches,Dt=()=>typeof Element<\"u\"&&typeof Element.prototype.animate==\"function\",st=()=>!Dt()||Bt(\"(prefers-reduced-motion: reduce)\");var it=t=>t.getAnimations?.()??[];var Lt=.7,$t=1280,at=320,vt=2.5,Ht=.45,It=[\"shimmer\",\"group-shimmer\",\"pulse\",\"none\"];function lt(t){let n=getComputedStyle(t),e=(c,a,l)=>{let s=n.getPropertyValue(c).trim();return a.includes(s)?s:l},o=e(\"--skullet-animation\",It,\"shimmer\"),r=e(\"--skullet-speed\",[\"slow\",\"fast\"],\"slow\");return{animation:o,duration:F[o===\"pulse\"?\"pulse\":\"shimmer\"][r]}}var w=20,Gt=Math.sin(w*Math.PI/180),ut=Math.cos(w*Math.PI/180),Pt=Gt/ut;var Wt=`${90+w}deg`,O=.85,x=12,ct=t=>(1-Math.cos(Math.PI*t))/2;function zt(t){let n=t*vt,e=(r,c)=>`color-mix(in srgb, ${z} ${(c*100).toFixed(1)}%, transparent) ${(r*t).toFixed(2)}px`,o=[];for(let r=0;r<=x;r++)o.push(e(r/x*O,ct(r/x)));for(let r=1;r<=x;r++)o.push(e(O+r/x*(1-O),ct(1-r/x)));return{width:n/ut,image:`repeating-linear-gradient(${Wt}, ${o.join(\", \")}, transparent ${n.toFixed(2)}px)`}}function Ft(t,n,e=lt(t)){for(let f of it(t))f.cancel();if(t.style.backgroundImage=\"\",t.style.backgroundRepeat=\"\",st()||typeof t.animate!=\"function\"||e.animation===\"none\")return;let o={duration:e.duration,iterations:1/0};if(e.animation===\"pulse\"){t.animate([{opacity:1,easing:\"ease-in-out\"},{opacity:Ht,easing:\"ease-in-out\"},{opacity:1}],o).startTime=0;return}let r=t.getBoundingClientRect(),c=r.left+scrollX,a=e.animation===\"group-shimmer\"?n??{left:c,top:r.top,width:r.width,height:r.height}:{left:0,top:0,width:document.documentElement.clientWidth||innerWidth,height:innerHeight},l=Math.min(Math.max(a.width*.4,80),at),{width:s,image:i}=zt(l),u=c-a.left+(r.top-a.top)*Pt,h=e.duration*Lt/($t+at);t.style.backgroundImage=i,t.style.backgroundSize=`${s}px 100%`,t.style.backgroundRepeat=\"repeat-x\",t.animate([{backgroundPosition:`${-u}px 0`},{backgroundPosition:`${s-u}px 0`}],{duration:s*h,iterations:1/0}).startTime=0}var Xt=t=>t.shadowRoot??t.attachShadow({mode:\"open\"});function mt(t,n){let e=Xt(t),o=t.getBoundingClientRect(),r={left:o.left+scrollX,top:o.top,width:o.width,height:o.height},c=lt(t);for(n.forEach((a,l)=>{let s=e.children[l];s||(s=document.createElement(\"div\"),s.setAttribute(L,\"\"),s.style.cssText=`position:absolute;display:block;pointer-events:none;background-color:${W};background-repeat:no-repeat`,e.append(s)),Object.assign(s.style,{left:`${a.x}px`,top:`${a.y}px`,width:`${a.width}px`,height:`${a.height}px`,borderRadius:a.radius});let i=`${Math.round(r.left+a.x)}|${Math.round(a.y)}|${Math.round(a.height)}|${Math.round(r.left)}|${Math.round(r.width)}|${Math.round(r.height)}|${document.documentElement.clientWidth}|${c.animation}|${c.duration}`;s.dataset.motion!==i&&(s.dataset.motion=i,Ft(s,r,c))});e.children.length>n.length;)e.lastElementChild.remove()}var pt=t=>t.parentElement?`${pt(t.parentElement)} > :nth-child(${[...t.parentElement.children].indexOf(t)+1})`:\":root\";function N(t){let n=t?.previousElementSibling,e=n?.querySelector(`:scope > [${B}]`),o=n?.querySelector(`:scope > [${D}]`);if(!n||!e||!o)return;let r=typeof CSSStyleSheet==\"function\"&&\"replaceSync\"in CSSStyleSheet.prototype?new CSSStyleSheet:null;r&&(document.adoptedStyleSheets=[...document.adoptedStyleSheets,r],n[G]=()=>{document.adoptedStyleSheets=document.adoptedStyleSheets.filter(s=>s!==r)});let c=s=>r?.replaceSync(s.size?`${[...s].map(pt).join(\", \")} { visibility: hidden !important; }`:\"\"),a=()=>{if(!o.isConnected||n[I])return l.disconnect();e.getClientRects().length&&mt(o,rt(e,o,{mark:!1,onCovered:c}))},l=new ResizeObserver(a);l.observe(n),document.fonts?.ready.then(a)}var ht=self,ft=Symbol.for(P),dt=ht[ft];ht[ft]=N;Array.isArray(dt)&&dt.forEach(N);N(document.currentScript);})();", Pr = {
	light: {
		base: "rgb(0 0 0 / 0.07)",
		highlight: "rgb(255 255 255 / 0.6)"
	},
	dark: {
		base: "rgb(255 255 255 / 0.08)",
		highlight: "rgb(255 255 255 / 0.1)"
	}
};
({ ...Pr });
function Fr(e = {}, t = null) {
	let n = {}, r = t && (e[t] ?? Pr[t]);
	return r && (n["--skullet-base"] = r.base, n["--skullet-highlight"] = r.highlight), e.radius && (n["--skullet-radius"] = e.radius), e.animation && (n["--skullet-animation"] = e.animation), e.speed && (n["--skullet-speed"] = e.speed), e.text?.top && (n["--skullet-text-top"] = e.text.top), e.text?.bottom && (n["--skullet-text-bottom"] = e.text.bottom), n;
}
var Ir = (e) => Object.entries(e).map(([e, t]) => `${e}: ${t};`).join(" ");
function Lr({ theme: e = {}, mode: t, text: n, selector: r = ":root" }) {
	let i = {
		...e,
		text: {
			...e.text,
			...n
		}
	}, a = t ?? (e.light || e.dark ? "system" : null), o = Fr(i, a === "dark" ? "dark" : a ? "light" : null), s = [];
	if (Object.keys(o).length && s.push(`${r} { ${Ir(o)} }`), a === "system") {
		let t = Fr({ dark: e.dark }, "dark");
		s.push(`@media (prefers-color-scheme: dark) { ${r} { ${Ir(t)} } }`);
	}
	return s.join("\n");
}
var Rr = /* @__PURE__ */ new Map(), zr, Q = null, Br = 0;
function Vr() {
	try {
		return new URLSearchParams(location.search).has("skullet-debug") || localStorage.getItem("skullet:debug") === "1";
	} catch {
		return !1;
	}
}
var Hr = () => zr ??= typeof window < "u" && Vr(), Ur = (e) => Hr() || !!e?.closest("[skullet-debug]");
function Wr(e) {
	zr = e, e ? Yr() : Xr();
}
function Gr(e, t) {
	!e || !Ur(e) || (Rr.set(e, {
		state: "loading",
		source: t
	}), qr());
}
function Kr(e, t) {
	!e || !Ur(e) || (Rr.set(e, {
		...Rr.get(e),
		state: "shown",
		moved: t
	}), qr());
}
function qr() {
	Yr(), cancelAnimationFrame(Br), Qr();
}
var Jr = "\n:host { all: initial; }\n.box { position: fixed; box-sizing: border-box; border: 1px dashed; border-radius: 4px; }\n.label {\n  position: absolute; left: -1px; bottom: 100%; margin-bottom: 2px;\n  padding: 1px 6px; border-radius: 4px; white-space: nowrap;\n  font: 500 11px/16px ui-monospace, SFMono-Regular, Menlo, monospace; color: #fff;\n}\n.loading { border-color: #3b82f6; } .loading .label { background: #3b82f6; }\n.still { border-color: #22c55e; } .still .label { background: #16a34a; }\n.moved { border-color: #ef4444; border-style: solid; } .moved .label { background: #dc2626; }\n.panel {\n  position: fixed; right: 12px; bottom: 12px; display: flex; gap: 8px; align-items: center;\n  padding: 6px 10px; border-radius: 8px; background: #111; color: #fff; pointer-events: auto;\n  font: 500 12px/16px ui-sans-serif, system-ui, sans-serif; box-shadow: 0 4px 16px rgb(0 0 0 / 0.3);\n}\n.panel label { display: flex; gap: 4px; align-items: center; cursor: pointer; }\n";
function Yr() {
	if (typeof document > "u") return;
	if (!Q?.isConnected) {
		Q = document.createElement("div"), Q.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:2147483647";
		let e = Q.attachShadow({ mode: "open" });
		e.innerHTML = `<style>${Jr}</style><div class="boxes"></div>`, document.body.append(Q);
	}
	let e = Q.shadowRoot;
	if (zr && !e.querySelector(".panel")) {
		let t = document.createElement("div");
		t.className = "panel", t.innerHTML = "skullet debug <label><input type=\"checkbox\" class=\"xray\"> x-ray</label>", t.querySelector(".xray").addEventListener("change", (e) => {
			document.documentElement.toggleAttribute(vr, e.target.checked);
		}), e.append(t);
	}
	Br ||= requestAnimationFrame(Qr);
}
function Xr() {
	Q?.shadowRoot?.querySelector(".panel")?.remove(), document.documentElement.removeAttribute(vr), ![...Rr.keys()].some((e) => Ur(e)) && (cancelAnimationFrame(Br), Br = 0, Q?.remove(), Q = null);
}
var Zr = ({ state: e, source: t, moved: n }) => {
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
function Qr() {
	if (Br = 0, !Q?.shadowRoot) return;
	let e = Q.shadowRoot.querySelector(".boxes");
	for (let e of Rr.keys()) e.isConnected && Ur(e) || Rr.delete(e);
	let t = [...Rr];
	for (; e.children.length > t.length;) e.lastElementChild.remove();
	t.forEach(([t, n], r) => {
		let i = e.children[r];
		i || (i = e.appendChild(document.createElement("div")), i.innerHTML = "<span class=\"label\"></span>");
		let a = t.getBoundingClientRect(), { kind: o, text: s } = Zr(n);
		i.className = `box ${o}`, Object.assign(i.style, {
			left: `${a.left - 2}px`,
			top: `${a.top - 2}px`,
			width: `${a.width + 4}px`,
			height: `${a.height + 4}px`
		}), i.firstElementChild.textContent = s;
	}), (zr || Rr.size) && (Br = requestAnimationFrame(Qr));
}
var $r, ei = () => $r ??= /jsdom/.test(navigator.userAgent) ? null : document.createElement("canvas").getContext("2d"), ti = (e, t) => e ? {
	left: Math.max(e.left, t.left),
	right: Math.min(e.right, t.right),
	top: Math.max(e.top, t.top),
	bottom: Math.min(e.bottom, t.bottom)
} : t, ni = (e) => [
	[e.left, e.top],
	[e.right, e.top],
	[e.right, e.bottom],
	[e.left, e.bottom]
], ri = (e, t) => Math.abs(e[0] - t[0]) < 1 && Math.abs(e[1] - t[1]) < 1;
function ii(e, t) {
	let n = Math.min(t.right - t.left, t.bottom - t.top), r = (e) => e.endsWith("%") ? parseFloat(e) / 100 * n : parseFloat(e) || 0;
	return [
		r(e.borderTopLeftRadius),
		r(e.borderTopRightRadius),
		r(e.borderBottomRightRadius),
		r(e.borderBottomLeftRadius)
	];
}
function ai(e, t, n) {
	let r = ti(e, t), i = ii(n, t), a = e ? ni(e) : [], o = ni(t), s = ni(r).map((t, n) => ri(t, o[n]) ? i[n] : e && ri(t, a[n]) ? e.corners[n] : 0), { left: c, right: l, top: u, bottom: d } = r;
	return {
		left: c,
		right: l,
		top: u,
		bottom: d,
		corners: s
	};
}
function oi(e, t, n, r) {
	if (!e) return n;
	let i = ni(e), a = ni(t).map((t, n) => e.corners[n] > 0 && ri(t, i[n]));
	if (!a.some(Boolean)) return n;
	let o = ii(r, t);
	return a.map((t, n) => t ? Math.max(o[n], e.corners[n]) : o[n]).map((e) => `${e}px`).join(" ");
}
var si = (e, t) => {
	let n = ti(t, e);
	return n.right - n.left >= 2 && n.bottom - n.top >= 2 ? n : null;
}, ci = {
	top: "ascender",
	bottom: "descender"
}, li = /* @__PURE__ */ new Map(), ui = (e) => [...e.getClientRects?.() ?? []];
function di(e) {
	let t = `${e.fontStyle} ${e.fontWeight} ${e.fontSize} ${e.fontFamily}`;
	if (li.has(t)) return li.get(t);
	let n = ei(), r = null;
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
	return li.set(t, r), r;
}
var fi = {
	ascender: "ascender",
	"cap-height": "capHeight",
	"x-height": "xHeight"
}, pi = (e, t, n, r) => {
	let i = e.getPropertyValue(t).trim();
	return n.includes(i) ? i : r;
};
function mi(e, t, n) {
	let r = di(t);
	if (!r) {
		let t = Math.min(n * .72, e.bottom - e.top), r = (e.top + e.bottom) / 2;
		return {
			barTop: r - t / 2,
			barBottom: r + t / 2
		};
	}
	let i = pi(t, "--skullet-text-top", Object.keys(fi), ci.top), a = pi(t, "--skullet-text-bottom", ["baseline", "descender"], ci.bottom), o = r.ascent + r.descent, s = e.top + (e.bottom - e.top - o) / 2 + r.ascent;
	return {
		barTop: s - r[fi[i]],
		barBottom: s + (a === "descender" ? r.descender : 0)
	};
}
var hi = new Set(Tr), gi = new Set(wr), _i = .4, vi = /[,/]\s*0\)$/, yi = (e, t) => e !== "" && e !== t, bi = [
	"Top",
	"Right",
	"Bottom",
	"Left"
], xi = (e) => bi.every((t) => yi(e[`border${t}Style`], "none") && yi(e[`border${t}Width`], "0px")), Si = (e) => {
	let [t = 0, n = 0, r = 0, i = 0] = (e.replace(/rgba?\([^)]*\)|#\w+/g, "").match(/-?[\d.]+px/g) ?? []).map(parseFloat);
	return e.includes("inset") && !r && !i && t === 0 != (n === 0) && Math.abs(t + n) <= 2;
}, Ci = (e) => yi(e, "none") && !e.split(/,(?![^(]*\))/).every(Si), wi = (e) => yi(e.backgroundColor, "transparent") && !vi.test(e.backgroundColor) || yi(e.backgroundImage, "none") || Ci(e.boxShadow) || xi(e), Ti = (e) => hi.has(e.localName), Ei = (e) => gi.has(e.localName) && !e.firstElementChild && !e.textContent?.trim(), Di = (e) => {
	let t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT), n = document.createRange(), r = [], i = 0;
	for (; t.nextNode();) {
		let e = t.currentNode;
		if (e.nodeType === Node.TEXT_NODE) {
			let t = e.parentElement;
			if (!e.textContent?.trim() || !t) continue;
			i++;
			let a = t.getBoundingClientRect();
			if (a.width <= 1 || a.height <= 1) continue;
			n.selectNodeContents(e), r.push(ui(n).filter((e) => e.width || e.height));
		} else Ei(e) && (i++, r.push([...e.getClientRects()]));
	}
	if (!r.some((e) => e.length)) return i;
	let a = (parseFloat(getComputedStyle(e).fontSize) || 16) * _i, o = (e, t) => Math.min(e.bottom, t.bottom) - Math.max(e.top, t.top) >= Math.min(e.height, t.height) / 2 && Math.max(e.left, t.left) - Math.min(e.right, t.right) <= a, s = r.map((e, t) => t), c = (e) => s[e] === e ? e : s[e] = c(s[e]);
	for (let e = 0; e < r.length; e++) for (let t = e + 1; t < r.length; t++) r[e].some((e) => r[t].some((t) => o(e, t))) && (s[c(t)] = c(e));
	return new Set(r.map((e, t) => c(t))).size;
}, Oi = (e, t) => e.hasAttribute("skullet-block") || Ti(e) || wi(t) && Di(e) <= 1;
function ki(e, t) {
	if (parseFloat(t.borderRadius) || !e.parentElement) return t.borderRadius || "0px";
	let n = e.parentElement, r = getComputedStyle(n), i = e.getBoundingClientRect(), a = n.getBoundingClientRect();
	return Math.abs(i.width - a.width) < 1 && Math.abs(i.height - a.height) < 1 && r.overflow !== "visible" ? r.borderRadius : t.borderRadius || "0px";
}
function Ai(e) {
	e.sort((e, t) => e.left - t.left);
	let t = [];
	for (let n of e) {
		let e = t.find((e) => {
			let t = Math.min(e.bottom, n.bottom) - Math.max(e.top, n.top), r = Math.min(e.bottom - e.top, n.bottom - n.top), i = n.left - e.right;
			return t >= r / 2 && i <= Math.max(e.fontSize, n.fontSize) * _i;
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
function ji(e, t, { mark: n = !0, onCovered: r } = {}) {
	let i = t.getBoundingClientRect(), a = t.offsetWidth ? i.width / t.offsetWidth : 1, o = t.offsetHeight ? i.height / t.offsetHeight : 1, s = (e) => ({
		left: (e.left - i.left) / a,
		right: (e.right - i.left) / a,
		top: (e.top - i.top) / o,
		bottom: (e.bottom - i.top) / o
	}), c = [], l = [], u = /* @__PURE__ */ new Set(), d = document.createRange(), f = (e, t, n) => {
		let r = si(e, n);
		if (!r) return;
		let i = parseFloat(t.fontSize) || 16, a = s(r);
		l.push({
			...a,
			fontSize: i,
			...mi(a, t, i),
			radius: t.getPropertyValue("--skullet-radius").trim()
		});
	}, p = (e, t) => {
		let n = e.data.search(/\S/);
		if (n < 0 || !e.parentElement) return;
		d.setStart(e, n), d.setEnd(e, e.data.trimEnd().length);
		let r = getComputedStyle(e.parentElement);
		for (let e of ui(d)) f(e, r, t);
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
			if (Oi(e, r)) {
				let n = si(e.getBoundingClientRect(), t);
				if (n) {
					let i = s(n);
					c.push({
						x: i.left,
						y: i.top,
						width: i.right - i.left,
						height: i.bottom - i.top,
						radius: oi(t, n, ki(e, r), r)
					});
				}
				Ti(e) || u.add(e);
				continue;
			}
			if (Ei(e)) {
				for (let n of e.getClientRects()) f(n, r, t);
				continue;
			}
			let i = r.overflowX !== "visible" || r.overflowY !== "visible";
			m(e, i ? ai(t, e.getBoundingClientRect(), r) : t);
		}
	};
	if (m(e, null), r?.(u), !n) return [...c, ...Ai(l)];
	for (let t of e.querySelectorAll(`[${fr}]`)) u.has(t) || t.removeAttribute(fr);
	for (let e of u) e.hasAttribute(fr) || e.setAttribute(fr, "");
	return [...c, ...Ai(l)];
}
var Mi = (e) => typeof matchMedia < "u" && matchMedia(e).matches, Ni = () => typeof Element < "u" && typeof Element.prototype.animate == "function", Pi = () => !Ni() || Mi("(prefers-reduced-motion: reduce)"), Fi = () => Mi("(prefers-reduced-transparency: reduce)"), Ii = (e) => e.getAnimations?.() ?? [], Li = .7, Ri = 1280, zi = 320, Bi = 2.5, Vi = .45, Hi = [
	"shimmer",
	"group-shimmer",
	"pulse",
	"none"
];
function Ui(e) {
	let t = getComputedStyle(e), n = (e, n, r) => {
		let i = t.getPropertyValue(e).trim();
		return n.includes(i) ? i : r;
	}, r = n("--skullet-animation", Hi, "shimmer"), i = n("--skullet-speed", ["slow", "fast"], "slow");
	return {
		animation: r,
		duration: Cr[r === "pulse" ? "pulse" : "shimmer"][i]
	};
}
var Wi = 20, Gi = Math.sin(Wi * Math.PI / 180), Ki = Math.cos(Wi * Math.PI / 180), qi = Gi / Ki, Ji = Ki, Yi = `${90 + Wi}deg`, Xi = .85, $ = 12, Zi = (e) => (1 - Math.cos(Math.PI * e)) / 2;
function Qi(e) {
	let t = e * Bi, n = (t, n) => `color-mix(in srgb, ${br} ${(n * 100).toFixed(1)}%, transparent) ${(t * e).toFixed(2)}px`, r = [];
	for (let e = 0; e <= $; e++) r.push(n(e / $ * Xi, Zi(e / $)));
	for (let e = 1; e <= $; e++) r.push(n(Xi + e / $ * (1 - Xi), Zi(1 - e / $)));
	return {
		width: t / Ki,
		image: `repeating-linear-gradient(${Yi}, ${r.join(", ")}, transparent ${t.toFixed(2)}px)`
	};
}
function $i(e, t, n = Ui(e)) {
	for (let t of Ii(e)) t.cancel();
	if (e.style.backgroundImage = "", e.style.backgroundRepeat = "", Pi() || typeof e.animate != "function" || n.animation === "none") return;
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
				opacity: Vi,
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
	}, { width: s, image: c } = Qi(Math.min(Math.max(o.width * .4, 80), zi)), l = a - o.left + (i.top - o.top) * qi, u = n.duration * Li / (Ri + zi);
	e.style.backgroundImage = c, e.style.backgroundSize = `${s}px 100%`, e.style.backgroundRepeat = "repeat-x", e.animate([{ backgroundPosition: `${-l}px 0` }, { backgroundPosition: `${s - l}px 0` }], {
		duration: s * u,
		iterations: 1 / 0
	}).startTime = 0;
}
function ea(e) {
	if (Pi()) return null;
	let t = Ui(e);
	return t.animation !== "shimmer" && t.animation !== "group-shimmer" ? null : t.duration * Li / (Ri + zi);
}
var ta = (e) => e.shadowRoot ?? e.attachShadow({ mode: "open" }), na = (e) => e.shadowRoot ? [...e.shadowRoot.children] : [];
function ra(e, t) {
	let n = ta(e), r = e.getBoundingClientRect(), i = {
		left: r.left + scrollX,
		top: r.top,
		width: r.width,
		height: r.height
	}, a = Ui(e);
	for (t.forEach((e, t) => {
		let r = n.children[t];
		r || (r = document.createElement("div"), r.setAttribute("skullet-rect", ""), r.style.cssText = `position:absolute;display:block;pointer-events:none;background-color:${yr};background-repeat:no-repeat`, n.append(r)), Object.assign(r.style, {
			left: `${e.x}px`,
			top: `${e.y}px`,
			width: `${e.width}px`,
			height: `${e.height}px`,
			borderRadius: e.radius
		});
		let o = `${Math.round(i.left + e.x)}|${Math.round(e.y)}|${Math.round(e.height)}|${Math.round(i.left)}|${Math.round(i.width)}|${Math.round(i.height)}|${document.documentElement.clientWidth}|${a.animation}|${a.duration}`;
		r.dataset.motion !== o && (r.dataset.motion = o, $i(r, i, a));
	}); n.children.length > t.length;) n.lastElementChild.remove();
}
var ia = 120, aa = 72, oa = 3, sa = 60, ca = 150, la = 400, ua = 1.5, da = 1e3, fa = 1e3, pa = /* @__PURE__ */ new Set([
	"filter",
	"transform",
	"translate",
	"scale",
	"rotate",
	"clipPath",
	"easing",
	"composite"
]), ma = -1 / 0, ha = !1;
function ga() {
	if (!(ha || typeof addEventListener > "u")) {
		ha = !0;
		for (let e of [
			"wheel",
			"touchmove",
			"keydown"
		]) addEventListener(e, () => ma = performance.now(), {
			passive: !0,
			capture: !0
		});
	}
}
var _a = /* @__PURE__ */ new WeakMap();
function va(e, { served: t, refetch: n }) {
	ga();
	let r = _a.get(e)?.since ?? performance.now();
	_a.set(e, {
		since: t ? -1 / 0 : r,
		refetch: n
	});
}
function ya(e) {
	let t = [], n = (e) => {
		for (let r of e.children) {
			let e = [...r.childNodes].some((e) => e.nodeType === Node.TEXT_NODE && e.textContent?.trim());
			!r.firstElementChild || e || r.localName === "svg" ? t.push(r) : n(r);
		}
	};
	return n(e), t;
}
function ba(e, t) {
	for (let n = e; n && n !== t; n = n.parentElement) {
		let e = n.parentElement;
		if (!e) break;
		if ([...e.children].filter((e) => e.localName === n.localName && e.className === n.className).length >= 3) return n;
	}
	return e;
}
var xa = (e, t) => {
	let n = t.left + t.width / 2, r = t.top + t.height / 2;
	return n >= e.left && n <= e.right && r >= e.top && r <= e.bottom;
};
function Sa(e) {
	let { left: t, top: n, right: r, bottom: i } = e.getBoundingClientRect();
	for (let a of e.querySelectorAll(`:scope > [${dr}]`)) {
		let e = a.getBoundingClientRect();
		t = Math.min(t, e.left), n = Math.min(n, e.top), r = Math.max(r, e.right), i = Math.max(i, e.bottom);
	}
	return new DOMRect(t, n, r - t, i - n);
}
var Ca = (e, t) => Math.min(Math.max(e, 0), t), wa = -1 / 0;
function Ta(e, t, n, r, i) {
	let a = performance.now();
	a - wa > ca && (wa = a);
	let o = a - wa, s = t.getBoundingClientRect(), c = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), u = (e) => parseFloat(getComputedStyle(e).fontSize) || 16;
	for (let t of ya(e)) {
		let n = ba(t, e), r = c.get(n);
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
		return t === null ? null : Ca(t, da) + Math.max(r.delay ?? 0, 0);
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
			let t = [...c.values()].find((t) => xa(t.rect, e));
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
function Ea(e, t) {
	if (!e) return;
	let n = {};
	for (let [r, i] of Object.entries(e)) pa.has(r) ? n[r] = i : r !== "opacity" && t(r);
	return n;
}
function Da(e, t, n, r = () => {}) {
	let i = _a.get(t);
	_a.delete(t);
	let a = n;
	for (; a.choose;) {
		let { choose: n, ...r } = a;
		a = {
			...r,
			...n({
				content: e,
				reveal: t,
				waited: i ? performance.now() - i.since : 1 / 0,
				input: performance.now() - ma < la,
				refetch: !!i?.refetch,
				height: e.getBoundingClientRect().height,
				pieces: ya(e).length
			})
		};
	}
	let o = Ca(a.duration ?? 200, fa);
	if (a = {
		...a,
		delay: Math.min(a.delay ?? 0, da)
	}, !o) return { kind: "instant" };
	let s = Ea(a.enter, r);
	if (a.wipe) {
		let e = Sa(t);
		if (e.width * e.height <= innerWidth * innerHeight * ua) return {
			kind: "wipe",
			wipe: a.wipe,
			start: performance.now() + (a.delay ?? 0),
			duration: o,
			reveal: e,
			enter: s
		};
	} else if (typeof a.order == "function") return Ta(e, t, a.order, {
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
var Oa = ({ rect: e, reveal: t }) => {
	let n = (e.top - t.top) / Math.max(t.height, 1), r = (e.left - t.left) / Math.max(t.width, 1);
	return Ca(n * .8 + r * .2, 1) * 320;
}, ka = (e) => e.bottom > 0 && e.top < innerHeight, Aa = ({ rect: e, unit: t, secondary: n, late: r }) => {
	if (!t) return ka(e) ? 0 : null;
	if (!ka(t)) return null;
	let i = Ca(t.top / innerHeight, 1) * 320;
	return Math.max(i - r, 0) + (n ? sa : 0);
}, ja = { duration: 0 }, Ma = { order: "together" }, Na = { order: Oa }, Pa = (e) => e.input || e.waited < 150 ? ja : e.refetch ? {
	order: "together",
	duration: ia
} : null, Fa = (e) => e.height < aa || e.pieces <= oa ? Ma : { order: Aa }, Ia = {
	hold: 150,
	choose: (e) => Pa(e) ?? Fa(e)
}, La = new Set(Tr), Ra = "script, noscript, template, base, meta, link", za = /* @__PURE__ */ new Set([
	"iframe",
	"object",
	"embed"
]), Ba = /* @__PURE__ */ new Set([
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
	fr
]), Va = (e) => e.replace(/[A-Z]/g, "X").replace(/[a-z]/g, "x").replace(/\d/g, "0");
function Ha(e, t) {
	let n = Va(t.data);
	t.data = n;
	let r = e.parentElement, i = ei();
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
function Ua(e) {
	for (let t of e.querySelectorAll(Ra)) t.remove();
	for (let t of e.querySelectorAll("*")) if (za.has(t.localName)) {
		let e = document.createElement("span");
		e.style.cssText = t.getAttribute("style") ?? "", e.style.display ||= "inline-block", t.replaceWith(e);
	} else {
		for (let { name: e, value: n } of [...t.attributes]) {
			let r = e.toLowerCase();
			(r.startsWith("on") || Ba.has(r) || r.endsWith("href") && /^\s*javascript:/i.test(n)) && t.removeAttribute(e);
		}
		t.localName === "img" && t.setAttribute("alt", "");
	}
	for (let t of e.querySelectorAll("video source, picture source")) t.remove();
}
function Wa(e, t) {
	let n = e.cloneNode(!0), r = NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, i = document.createTreeWalker(e, r), a = document.createTreeWalker(n, r), o = [], s = [];
	for (; i.nextNode() && a.nextNode();) {
		let e = i.currentNode, n = a.currentNode;
		e.nodeType === Node.TEXT_NODE ? t && o.push([e, n]) : (La.has(e.localName) || za.has(e.localName)) && s.push([e, n]);
	}
	for (let [e, t] of s) {
		let n = e.getBoundingClientRect();
		t.style.boxSizing = "border-box", t.style.width = `${n.width}px`, n.width && n.height ? (t.style.maxWidth = "100%", t.style.height = "auto", t.style.aspectRatio = `${n.width} / ${n.height}`) : t.style.height = `${n.height}px`;
	}
	for (let [e, t] of o) Ha(e, t);
	return Ua(n), n.innerHTML;
}
function Ga(e) {
	let t = document.createElement("template");
	return t.innerHTML = e, Ua(t.content), t.content;
}
var Ka = (e, t) => [...e.children].map((e) => {
	let n = [...e.classList].sort().join("."), r = t > 1 && e.firstElementChild ? `(${Ka(e, t - 1)})` : "";
	return `${e.localName}${n ? `.${n}` : ""}${r}`;
}).join(","), qa = (e) => {
	let t = 5381;
	for (let n = 0; n < e.length; n++) t = t * 33 ^ e.charCodeAt(n);
	return (t >>> 0).toString(36);
};
function Ja(e) {
	let t = Ka(e, 2);
	return t ? `${location.pathname}|${qa(t)}` : null;
}
var Ya = !1;
try {
	Ya = !1;
} catch {
	Ya = !1;
}
var Xa = Ya, Za = /* @__PURE__ */ new Set();
function Qa(e, t) {
	!Xa || Za.has(e) || (Za.add(e), console.warn(`[skullet] ${t}`));
}
var $a = /^(https?:|\/|data:|blob:)/;
function eo(e) {
	return typeof e == "string" ? $a.test(e) ? "" : Va(e) : Array.isArray(e) ? e.map(eo) : e instanceof Date ? e : e && typeof e == "object" ? Object.fromEntries(Object.entries(e).map(([e, t]) => [e, eo(t)])) : e;
}
var to = "skullet:shapes", no = 2, ro = 50, io = 2e4, ao = /* @__PURE__ */ new Map(), oo = /* @__PURE__ */ new Map();
function so(e, t) {
	return oo.has(e) || oo.set(e, /* @__PURE__ */ new Set()), oo.get(e).add(t), () => oo.get(e)?.delete(t);
}
function co(e) {
	for (let t of oo.get(e) ?? []) t();
}
function lo() {
	try {
		let e = JSON.parse(localStorage.getItem(to) ?? "null");
		return e?.v === no ? e.shapes : {};
	} catch {
		return {};
	}
}
function uo(e) {
	try {
		localStorage.setItem(to, JSON.stringify({
			v: no,
			shapes: e
		}));
	} catch {}
}
function fo(e, t) {
	ao.set(e, Wa(t, !1));
	let n = Wa(t, !0);
	if (n.length > io) return;
	let r = lo();
	delete r[e], r[e] = n;
	let i = Object.keys(r);
	for (let e of i.slice(0, i.length - ro)) delete r[e];
	uo(r);
}
function po(e) {
	return ao.get(e) ?? lo()[e] ?? null;
}
var mo = [
	100,
	90,
	60
].map((e) => `<div ${mr} style="width:${e}%;height:0.75em;margin:0.5em 0;border-radius:0.25em"></div>`).join(""), ho = new WeakSet(typeof document > "u" ? [] : document.querySelectorAll(`[${ir}]`)), go = /* @__PURE__ */ new WeakMap();
function _o(e) {
	if (!e) return;
	let t = go.get(e);
	return go.delete(e), t;
}
function vo(e, t) {
	for (let n of e.children) if (n.hasAttribute(t)) return n;
	let n = document.createElement("div");
	return n.setAttribute(t, ""), e.append(n), n;
}
var yo = (e) => !!e.firstElementChild || !!e.textContent?.trim(), bo = class {
	constructor(e, t = {}) {
		this.root = e, this.options = t, jr(), e[hr] = !0, e.setAttribute(ir, ""), e.setAttribute("aria-hidden", "true"), e.inert = !0, this.ghost = vo(e, ar), this.snapshot = vo(e, or), this.layer = vo(e, sr), this.hadContent = yo(this.ghost);
		let n = e.closest(`[${nr}]`);
		n && va(n, {
			served: ho.has(e),
			refetch: !!t.refetch && this.hadContent
		}), this.choose(), this.measure(), e[gr]?.(), this.mutations = new MutationObserver(this.schedule), this.mutations.observe(this.ghost, {
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
		this.root.closest(`[${dr}]`) || (cancelAnimationFrame(this.frame), this.frame = requestAnimationFrame(() => {
			let e = yo(this.ghost);
			e !== this.hadContent && (this.hadContent = e, this.choose()), this.measure();
		}));
	};
	choose() {
		let e = "fallback", t = null, n = this.options.exact || ho.has(this.root), r = !!this.ghost.querySelector(`[${pr}]`);
		if ((n || r) && this.hadContent) e = "ghost";
		else {
			let n = this.options.id ?? Ja(this.ghost);
			n && (co(n), t = po(n)), t ? e = "recall" : this.hadContent && (e = "ghost");
		}
		e !== this.source && (e === "recall" && t ? this.snapshot.replaceChildren(Ga(t)) : e === "fallback" ? (this.snapshot.innerHTML = mo, Qa(`fallback:${this.options.id}`, `Nothing to draw a skeleton from${this.options.id ? ` for "${this.options.id}"` : ""}. Pass \`sample\` data, or an \`id\` so its shape is remembered after the first load. For a lone placeholder box, use \`SkeletonBox\`.`)) : this.snapshot.replaceChildren()), this.ghost.toggleAttribute(ur, e !== "ghost"), this.snapshot.toggleAttribute(ur, e === "ghost"), this.source = e, Gr(this.root.closest(`[${nr}]`), e === "recall" ? "remembered shape" : e === "fallback" ? "fallback" : this.options.exact ? "data" : ho.has(this.root) ? "server render" : "sample");
	}
	measure() {
		let e = this.source === "ghost" ? this.ghost : this.snapshot;
		ra(this.layer, ji(e, this.layer));
		let t = this.root.closest(`[${nr}]`);
		t && go.set(t, {
			width: this.root.offsetWidth,
			height: this.root.offsetHeight,
			guessed: !(this.options.exact && this.source === "ghost"),
			images: [...e.querySelectorAll("img")].map((e) => e.getBoundingClientRect().height)
		});
	}
	destroy() {
		cancelAnimationFrame(this.frame), this.mutations.disconnect(), this.resize?.disconnect(), this.root.removeEventListener("load", this.schedule, !0), removeEventListener("resize", this.schedule), Mr();
	}
}, xo = 250, So = class {
	constructor(e, t = {}) {
		this.element = e, this.options = t, this.key = t.id ?? Ja(e), this.untrack = this.key ? so(this.key, () => this.save()) : () => {}, (Xa || Ur(e)) && this.check(), this.save(), this.mutations = new MutationObserver(this.schedule), this.mutations.observe(e, {
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
		clearTimeout(this.timer), this.timer = setTimeout(() => this.save(), xo);
	};
	save() {
		clearTimeout(this.timer), this.key && this.element.isConnected && this.element.offsetHeight && fo(this.key, this.element);
	}
	check() {
		let { data: e, id: t, rendered: n, sample: r } = this.options, i = t ? `<Skeleton id="${t}">` : "<Skeleton>", a = this.element.closest(`[${nr}]`), o = _o(a);
		if (!o) return;
		o.guessed && n && !r && e != null && Qa(`sample:${this.key}`, `${i} has no \`sample\`, so a first load guesses its shape${t ? "" : " and it can't be remembered"}. Pass this to make it exact:
  sample={${JSON.stringify(eo(e))}}`);
		let s = [...this.element.querySelectorAll("img")].filter((e) => !e.complete);
		Promise.all(s.map((e) => new Promise((t) => {
			e.addEventListener("load", t, { once: !0 }), e.addEventListener("error", t, { once: !0 });
		}))).then(() => {
			if (!this.element.isConnected) return;
			let e = this.element.offsetWidth, t = this.element.offsetHeight;
			if (Kr(a, {
				width: e - o.width,
				height: t - o.height
			}), Math.abs(e - o.width) <= 1 && Math.abs(t - o.height) <= 1) return;
			let r = [...this.element.querySelectorAll("img")].filter((e, t) => (o.images[t] ?? 0) < 1 && e.getBoundingClientRect().height >= 1).map((e) => e.currentSrc.split("/").pop() || "an image");
			r.length ? Qa(`unsized:${this.key}`, `${i}'s skeleton had no room for ${r.length === 1 ? "an image" : `${r.length} images`} (${r.slice(0, 3).join(", ")}${r.length > 3 ? ", …" : ""}), so the layout jumped when they loaded. Give each \`width\` and \`height\` attributes, or an \`aspect-ratio\`, so its space is known before it loads.`) : Qa(`jump:${this.key}`, o.guessed ? `${i}'s skeleton was ${o.width}\xD7${o.height}px but its content is ${e}\xD7${t}px, so the layout jumped on reveal. ${n ? "Pass `sample` data shaped like the real thing" : "Pass an `id` so its shape is remembered"}, and give images a size.` : `${i}'s skeleton was drawn from the data on screen (${o.width}\xD7${o.height}px), but the new data is ${e}\xD7${t}px, so the layout jumped on reveal. When new data adds to what's shown \u2014 another page of a list \u2014 give the addition a reveal of its own.`);
		});
	}
	destroy() {
		this.save(), clearTimeout(this.timer), this.mutations.disconnect(), this.resize?.disconnect(), this.element.removeEventListener("load", this.schedule, !0), this.untrack();
	}
}, Co = () => {}, wo = (e) => {
	if (e.loading !== "lazy") return !1;
	let t = e.getBoundingClientRect();
	return t.bottom < -innerHeight || t.top > innerHeight * 2;
}, To = (e) => [...e.querySelectorAll("img")].filter((e) => !e.complete && !wo(e));
function Eo(e) {
	let t = e.complete ? Promise.resolve() : new Promise((t) => {
		e.addEventListener("load", () => t(), { once: !0 }), e.addEventListener("error", () => t(), { once: !0 });
	});
	return Promise.race([t.then(() => e.decode?.()).then(Co, Co), new Promise((e) => setTimeout(e, Sr))]);
}
var Do = 360, Oo = 2, ko = 600, Ao = 40, jo = Ao / Ji, Mo = 320, No = 120, Po = .45, Fo = (e) => e.left + e.top * qi, Io = (e) => e.width + e.height * qi, Lo = (e, t) => Fo(t) - jo + (Io(t) + 2 * jo) * e, Ro = {
	start: -1 / 0,
	origin: 0,
	speed: 1
};
function zo(e) {
	let t = e.querySelector(`:scope > [${dr}] [${sr}]`), n = t && ea(t);
	if (!n) return null;
	let r = Sa(e);
	if (r.width * r.height > innerWidth * innerHeight * ua) return null;
	let i = Fo(r), a = i + Io(r), o = performance.now(), s = o - Ro.start;
	s <= ca && (i - Ro.origin) / Ro.speed >= s && (a - Ro.origin) / Ro.speed - s <= ko || (Ro = {
		start: o,
		origin: i,
		speed: Math.max(Oo / n, (a - i) / Do)
	});
	let { start: c, origin: l, speed: u } = Ro;
	return {
		delay: (i - jo - l) / u - (o - c),
		duration: (a - i + 2 * jo) / u
	};
}
var Bo = (e) => (t, { rect: n, reveal: r }) => {
	let i = (Lo(t, r) - Fo(n)) * Ji;
	return `linear-gradient(${Yi}, ${Array.from({ length: $ + 1 }, (t, n) => {
		let r = e ? 1 - Zi(n / $) : Zi(n / $), a = -Ao + 2 * Ao * n / $;
		return `rgb(0 0 0 / ${r.toFixed(3)}) ${(i + a).toFixed(2)}px`;
	}).join(", ")})`;
}, Vo = "http://www.w3.org/2000/svg", Ho = null, Uo = 0;
function Wo() {
	return Ho?.isConnected || (Ho = document.createElementNS(Vo, "svg"), Ho.setAttribute("aria-hidden", "true"), Ho.style.cssText = "position:absolute;width:0;height:0;overflow:hidden", document.body.append(Ho)), Ho;
}
var Go = (e, t) => {
	let n = document.createElementNS(Vo, e);
	for (let [e, r] of Object.entries(t)) n.setAttribute(e, String(r));
	return n;
}, Ko = {
	mask: Bo(!0),
	out: Bo(!1),
	effect: (e, { rect: t, reveal: n, progress: r }) => {
		if (Fi()) return;
		let i = Fo(t), a = Io(t), o = Mo / 2 / Ji, s = () => Lo(r(), n) - i - No / Ji;
		if (s() - o > a) return;
		let c = 2 * o + t.height * qi, l = c / 2, u = t.height / 2, d = Mo / 2 * Ji, f = Mo / 2 * qi * Ji, p = document.createElement("canvas");
		p.width = Math.ceil(c), p.height = Math.ceil(t.height);
		let m = p.getContext("2d");
		if (!m) return;
		let h = m.createLinearGradient(l - d, u - f, l + d, u + f);
		for (let e = 0; e <= $; e++) {
			let t = e / $;
			h.addColorStop(t, `rgb(255 255 255 / ${Zi(1 - Math.abs(t * 2 - 1)).toFixed(3)})`);
		}
		m.fillStyle = h, m.fillRect(0, 0, p.width, p.height);
		let g = `skullet-gloss-${++Uo}`, _ = Go("filter", {
			id: g,
			"color-interpolation-filters": "sRGB",
			primitiveUnits: "objectBoundingBox"
		}), v = Go("feComponentTransfer", {
			in: "SourceGraphic",
			result: "lit"
		});
		for (let e of [
			"R",
			"G",
			"B"
		]) v.append(Go(`feFunc${e}`, {
			type: "linear",
			slope: 1 - Po,
			intercept: Po
		}));
		let y = Go("feImage", {
			href: p.toDataURL(),
			y: 0,
			width: c / t.width,
			height: 1,
			preserveAspectRatio: "none",
			result: "band"
		});
		_.append(v, y, Go("feComposite", {
			in: "lit",
			in2: "band",
			operator: "in",
			result: "shine"
		}), Go("feComposite", {
			in: "shine",
			in2: "SourceGraphic",
			operator: "over"
		})), Wo().append(_), e.style.filter = `url(#${g})`;
		let ee = () => {
			let n = s();
			n - o > a || !e.isConnected ? (e.style.filter.includes(g) && (e.style.filter = ""), _.remove()) : (y.setAttribute("x", ((n - l - u * qi) / t.width).toFixed(4)), requestAnimationFrame(ee));
		};
		ee();
	}
}, qo = {
	together: Ma,
	sequence: Na,
	smart: Ia,
	sweep: {
		hold: 150,
		choose: (e) => {
			let t = Pa(e);
			if (t) return t;
			let n = zo(e.reveal);
			return n ? {
				wipe: Ko,
				...n
			} : Fa(e);
		}
	}
}, Jo = (e = "smart") => typeof e == "string" ? qo[e] : e, Yo = () => {}, Xo = (e) => e.finished.then(Yo, Yo), Zo = /* @__PURE__ */ new WeakMap();
function Qo(e, t = 0, n = 200, r = 0, i) {
	return Pi() ? Promise.resolve() : Xo(e.animate([{
		...i,
		opacity: r
	}, { opacity: 1 }], {
		duration: n,
		delay: t,
		easing: "ease",
		fill: "backwards"
	}));
}
var $o = (e) => !!e.querySelector(`[${sr}], [${ar}], :scope > [${pr}]`), es = (e, t) => Math.abs(e.left - t.left) < 2 && Math.abs(e.top - t.top) < 2 && Math.abs(e.width - t.width) < 2 && Math.abs(e.height - t.height) < 2, ts = /* @__PURE__ */ new WeakMap();
function ns(e) {
	for (let t of ts.get(e) ?? []) t.remove();
	ts.delete(e);
}
function rs(e, t) {
	let n = To(e), r = [...t.children].some((t) => t !== e && t.hasAttribute("skullet-pane") && $o(t));
	if (n.length && r) {
		for (let e of n) e.style.opacity = "0";
		queueMicrotask(() => {
			if (!e.isConnected) return;
			let r = t.getBoundingClientRect(), i = [...t.querySelectorAll(`:scope > [${dr}] [${sr}]`)].flatMap(na), a = ts.get(t) ?? /* @__PURE__ */ new Set();
			ts.set(t, a);
			for (let e of n) {
				let n = e.getBoundingClientRect(), o = i.find((e) => es(e.getBoundingClientRect(), n)), s = o?.getBoundingClientRect() ?? n, c = document.createElement("div");
				c.setAttribute(cr, ""), Object.assign(c.style, {
					position: "absolute",
					left: `${s.left - r.left - t.clientLeft}px`,
					top: `${s.top - r.top - t.clientTop}px`,
					width: `${s.width}px`,
					height: `${s.height}px`,
					borderRadius: o?.style.borderRadius || getComputedStyle(e).borderRadius,
					backgroundColor: yr,
					backgroundRepeat: "no-repeat",
					pointerEvents: "none"
				}), t.append(c), a.add(c), o && (o.style.visibility = "hidden"), $i(c), Eo(e).then(() => {
					if (a.has(c)) {
						if (a.delete(c), e.style.opacity = "", Qo(e), Pi()) return c.remove();
						Xo(c.animate([{ opacity: 1 }, { opacity: 0 }], {
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
function is(e, t) {
	return Pi() ? Promise.resolve() : Promise.all(ya(e).map((e) => {
		let n = t.pieceDelay(e);
		if (n !== null) return Qo(e, n, t.duration, 0, t.enter);
	})).then(Yo);
}
function as(e) {
	for (let t of e.querySelectorAll(`:scope > [${dr}]`)) {
		for (let e of Ii(t)) e.finish();
		t.style.opacity = "0";
	}
}
function os(e) {
	let t = 0;
	for (let n of e.querySelectorAll(`:scope > [${dr}]`)) if (!$o(n)) {
		t = Math.max(t, parseFloat(getComputedStyle(n).opacity) || 0);
		for (let e of Ii(n)) e.finish();
		n.style.opacity = "0";
	}
	return t;
}
function ss(e, t = "smart", { initial: n = !1 } = {}) {
	let r = cs.get(e);
	return r || (r = ls(e, t, n), cs.set(e, r)), r;
}
var cs = /* @__PURE__ */ new WeakMap();
function ls(e, t, n) {
	let r = e.parentElement, i = Jo(t);
	if ($o(e)) {
		r && ns(r);
		let t = Math.max(i.hold ?? 0, 0);
		return t ? (r && Zo.set(r, {
			kind: "skeleton",
			hold: t
		}), n ? Promise.resolve() : Qo(e, t)) : (r && Zo.delete(r), n ? Promise.resolve() : Qo(e));
	}
	if (n || !r) return Promise.resolve();
	let a = os(r);
	if (a > .01) {
		let t = 200 * (1 - a);
		return Zo.set(r, {
			kind: "together",
			delay: 0,
			duration: t
		}), Qo(e, 0, t, a);
	}
	rs(e, r);
	let o = Da(e, r, i, (e) => Qa(`enter:${e}`, `\`enter\` can't set \`${e}\`: only properties that change nothing's layout animate, so the reveal never moves the page.`));
	return Zo.set(r, o), o.kind === "instant" ? (as(r), Promise.resolve()) : o.kind === "sequence" ? is(e, o) : o.kind === "wipe" ? Ss(e, o, !0) : Qo(e, o.delay, o.duration, 0, o.enter);
}
function us(e) {
	let t = e.getBoundingClientRect(), n = e.offsetParent ?? document.documentElement, r = n.getBoundingClientRect();
	return {
		top: t.top - r.top - n.clientTop,
		left: t.left - r.left - n.clientLeft,
		width: t.width,
		height: t.height
	};
}
function ds(e, t = us(e)) {
	return Object.assign(e.style, {
		position: "absolute",
		top: `${t.top}px`,
		left: `${t.left}px`,
		width: `${t.width}px`,
		height: `${t.height}px`,
		margin: "0",
		boxSizing: "border-box",
		pointerEvents: "none"
	}), e.inert = !0, e.setAttribute(dr, ""), t;
}
var fs = /* @__PURE__ */ new WeakMap();
function ps(e, t) {
	let n = e.querySelector(`:scope > [${rr}]:not([${dr}])`);
	if (!n) return;
	let r = fs.get(e), i = e.getBoundingClientRect().height;
	r?.animation.cancel();
	let a = e.getBoundingClientRect().height, o = r ? i : a - n.getBoundingClientRect().height + t.height;
	if (Math.abs(o - a) < .5) {
		r && ms(e, r);
		return;
	}
	let { overflow: s, boxSizing: c } = r ?? e.style;
	Object.assign(e.style, {
		overflow: "clip",
		boxSizing: "border-box"
	});
	let l = e.animate([{ height: `${o}px` }, { height: `${a}px` }], {
		duration: xr,
		easing: "cubic-bezier(0.2, 0, 0, 1)"
	}), u = {
		animation: l,
		overflow: s,
		boxSizing: c
	};
	fs.set(e, u), Xo(l).then(() => {
		fs.get(e) === u && ms(e, u);
	});
}
function ms(e, { overflow: t, boxSizing: n }) {
	fs.delete(e), Object.assign(e.style, {
		overflow: t,
		boxSizing: n
	});
}
function hs(e, t) {
	let n = parseFloat(getComputedStyle(e).opacity), r = Number.isNaN(n) ? 1 : n;
	for (let t of Ii(e)) t.cancel();
	xs(e), e.style.filter = "";
	let i = e.parentElement;
	i && !$o(e) && ns(i);
	let a = ds(e, t), o = (t, n) => Ni() ? Xo(e.animate([{ opacity: r }, { opacity: 0 }], {
		duration: n * r,
		delay: t,
		easing: "ease",
		fill: "forwards"
	})) : (e.style.opacity = "0", Promise.resolve());
	return Promise.resolve().then(() => {
		let t = i && Zo.get(i), n = Pi() || t?.kind === "instant";
		if (i && !n && ps(i, a), t?.kind === "skeleton") return o(t.hold, 200);
		if (n) e.style.opacity = "0";
		else return t?.kind === "sequence" && $o(e) ? gs(e, t) : t?.kind === "wipe" && $o(e) ? Ss(e, t, !1) : t?.kind === "together" ? o(t.delay, t.duration) : o(0, 200);
	});
}
function gs(e, t) {
	for (let t of e.querySelectorAll(`[${ar}], [${or}]`)) t.style.visibility = "hidden";
	let n = [...e.querySelectorAll(`[${ar}] [${pr}]`)].filter((e) => !e.parentElement?.closest(`[${pr}]`));
	for (let e of n) e.style.visibility = "visible";
	let r = [...[...e.querySelectorAll(`[${sr}]`)].flatMap(na), ...n];
	return Promise.all(r.map((e) => {
		let n = e.getBoundingClientRect(), r = (n) => Xo(e.animate([{ opacity: 1 }, { opacity: 0 }], {
			duration: t.duration,
			delay: n,
			easing: "ease",
			fill: "forwards"
		})), i = t.boneDelay(n);
		if (i === null) e.style.opacity = "0";
		else return r(i);
	})).then(Yo);
}
var _s = 100, vs = /* @__PURE__ */ new WeakMap();
function ys(e, t) {
	e.style.setProperty("mask-image", t), e.style.setProperty("-webkit-mask-image", t);
}
function bs(e, t) {
	ys(e, `linear-gradient(#000 0 0), ${t}`), e.style.setProperty("-webkit-mask-composite", "xor"), e.style.setProperty("mask-composite", "exclude");
}
function xs(e) {
	vs.get(e)?.();
	for (let t of [
		"mask-image",
		"-webkit-mask-image",
		"mask-composite",
		"-webkit-mask-composite"
	]) e.style.removeProperty(t);
}
function Ss(e, t, n) {
	let r = {
		rect: e.getBoundingClientRect(),
		reveal: t.reveal
	}, { mask: i, out: a } = t.wipe, o = (t) => {
		n ? ys(e, i(t, r)) : a ? ys(e, a(t, r)) : bs(e, i(t, r));
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
			if (e - i > _s && (t.stalled = !0), i = e, t.stalled) return l(a);
			a = Math.min(Math.max(s(), 0), 1), o(a), a < 1 ? r = requestAnimationFrame(c) : l(null);
		}, l = (t = null) => {
			cancelAnimationFrame(r), clearTimeout(u), vs.delete(e), n(t);
		}, u = setTimeout(() => l(null), Math.max(t.start + t.duration - performance.now(), 0) + _s);
		vs.set(e, l), c();
	}).then((t) => {
		if (xs(e), t === null) {
			n || (e.style.opacity = "0");
			return;
		}
		let r = 200 * (1 - t);
		return n ? Qo(e, 0, r, t) : Xo(e.animate([{ opacity: 1 - t }, { opacity: 0 }], {
			duration: r,
			easing: "ease",
			fill: "forwards"
		})).then(() => {
			e.style.opacity = "0";
		});
	}));
}
// node_modules/.pnpm/skullet@0.0.3_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/skullet/dist/react/index.mjs
var Cs = X.createContext({}), ws = X.createContext(null), Ts = () => X.useContext(Cs), Es = () => X.useContext(ws), Ds = () => Ts().reveal;
function Os({ children: e, ...t }) {
	let { debug: n, theme: r, mode: i, text: a, nonce: o } = t, s = Lr({
		theme: r,
		mode: i,
		text: a
	}), [c] = X.useState(() => ({ sent: !1 }));
	return X.useEffect(() => {
		n !== void 0 && Wr(n);
	}, [n]), (0, Z.jsx)(Cs.Provider, {
		value: t,
		children: (0, Z.jsxs)(ws.Provider, {
			value: c,
			children: [s && (0, Z.jsx)("style", {
				nonce: o,
				children: s
			}), e]
		})
	});
}
var ks = typeof window > "u" ? X.useEffect : X.useLayoutEffect, As = () => X.useInsertionEffect(() => (jr(), Mr), []), js = Number("19.3.1".split(".")[0]) >= 19, Ms = () => {
	let { nonce: e } = Ts();
	return js ? (0, Z.jsx)("style", {
		href: "skullet",
		precedence: "medium",
		nonce: e,
		children: Dr
	}) : null;
}, Ns = js ? { inert: !0 } : { inert: "" }, Ps = (e) => X.Children.map(e, (e) => {
	if (!X.isValidElement(e)) return e;
	let t = e.type.Skeleton;
	return t ? (0, Z.jsx)("span", {
		[pr]: "",
		children: (0, Z.jsx)(t, { ...e.props })
	}) : e.props.children && typeof e.props.children != "function" ? X.cloneElement(e, void 0, Ps(e.props.children)) : e;
}), Fs = () => () => {}, Is = () => X.useSyncExternalStore(Fs, () => !1, () => !0), Ls = ({ children: e, id: t, exact: n, refetch: r, label: i }) => {
	let a = X.useRef(null), { nonce: o } = Ts(), s = Es(), c = Is(), l = Nr;
	return c && s && (s.sent && (l = "(s=>{let k=Symbol.for(\"skullet.boot\"),b=self[k];typeof b==\"function\"?b(s):(self[k]=b||[]).push(s)})(document.currentScript)"), s.sent = !0), ks(() => {
		if (!a.current) return;
		let e = new bo(a.current, {
			id: t,
			exact: n,
			refetch: r
		});
		return () => e.destroy();
	}, [
		t,
		n,
		r
	]), (0, Z.jsxs)(Z.Fragment, { children: [
		i && (0, Z.jsx)("span", {
			"skullet-status": "",
			children: i
		}),
		(0, Z.jsxs)("div", {
			ref: a,
			[ir]: "",
			"aria-hidden": !0,
			...Ns,
			children: [
				(0, Z.jsx)("div", {
					[ar]: "",
					children: Ps(e)
				}),
				(0, Z.jsx)("div", { [or]: "" }),
				(0, Z.jsx)("div", { [sr]: "" })
			]
		}),
		c && (0, Z.jsx)("script", {
			nonce: o,
			suppressHydrationWarning: !0,
			dangerouslySetInnerHTML: { __html: l }
		})
	] });
}, Rs = ({ children: e, id: t, registry: n, enter: r, exiting: i, onExited: a, memory: o, onEntered: s }) => {
	let c = X.useRef(null), l = Ds();
	return ks(() => {
		if (!c.current) return;
		let e = {
			element: c.current,
			memory: null
		};
		return n.set(t, e), ss(c.current, l, { initial: !r }).then(s), o && (e.memory = new So(c.current, o)), () => {
			e.memory?.destroy(), n.delete(t);
		};
	}, []), ks(() => {
		!i || !c.current || hs(c.current, n.get(t)?.box).then(a);
	}, [i]), (0, Z.jsx)("div", {
		ref: c,
		[rr]: "",
		children: e
	});
}, zs = class extends X.Component {
	getSnapshotBeforeUpdate(e) {
		for (let t of this.props.exiting) {
			if (e.exiting.includes(t)) continue;
			let n = this.props.registry.get(t);
			n && (n.memory?.save(), n.box = us(n.element));
		}
		return null;
	}
	componentDidUpdate() {}
	render() {
		return this.props.children;
	}
};
function Bs(e) {
	let { id: t, label: n, skeleton: r, empty: i, emptyMessage: a, error: o, className: s, style: c } = e;
	As();
	let l = typeof e.children == "function" ? e.children : null, u = l ? e.data : void 0, d = l ? e.sample : void 0, f = l ? null : e.children, p = X.useRef(null);
	ks(() => {
		u != null && (p.current = {
			id: t,
			data: u
		});
	});
	let m = (e) => l ? e == null ? null : l(e) : f, h = !!e.loading || !!l && u == null && !o && !i, g, _, v;
	if (h) {
		let e = p.current, i = u ?? (e && e.id === t ? e.data : null);
		g = "skeleton", _ = r ? (0, Z.jsx)("div", {
			[pr]: "",
			"aria-hidden": !0,
			children: r
		}) : (0, Z.jsx)(Ls, {
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
	let [y, ee] = X.useState({
		id: 0,
		key: g
	}), [b, x] = X.useState([]), te = X.useRef(/* @__PURE__ */ new Map()).current, S = X.useRef(_);
	if (ks(() => {
		S.current = _;
	}), y.key !== g) {
		let e = {
			id: y.id,
			node: S.current
		};
		x((t) => t.some((t) => t.id === e.id) ? t : [...t, e]), ee({
			id: y.id + 1,
			key: g,
			from: y.key
		});
	}
	let ne = X.useRef(e.onReveal);
	ks(() => {
		ne.current = e.onReveal;
	});
	let C = y.key === "content" && y.from === "skeleton" ? () => ne.current?.() : void 0, w = (e) => x((t) => t.filter((t) => t.id !== e)), T = [...b.map((e) => (0, Z.jsx)(Rs, {
		id: e.id,
		registry: te,
		enter: !1,
		exiting: !0,
		onExited: () => w(e.id),
		children: e.node
	}, e.id)), (0, Z.jsx)(Rs, {
		id: y.id,
		registry: te,
		enter: y.id > 0,
		exiting: !1,
		onExited: () => {},
		memory: v,
		onEntered: C,
		children: _
	}, y.id)];
	return (0, Z.jsxs)("div", {
		[nr]: "",
		"aria-busy": g === "skeleton" || void 0,
		className: s,
		style: c,
		children: [(0, Z.jsx)(Ms, {}), (0, Z.jsx)(zs, {
			exiting: b.map((e) => e.id),
			registry: te,
			children: T
		})]
	});
}
// src/react/follow-manage/measured-reading.tsx
var Vs = {
	creators: [Y("follow:followOverview.creators"), Y("follow:followOverview.creatorUnit")],
	enabled: [Y("follow:followOverview.enabledSources"), ""],
	failed: [Y("follow:followCheck.checkFailed"), Y("follow:followOverview.sourceUnit")],
	updates: [Y("follow:followOverview.unwatchedUpdates"), Y("follow:followOverview.itemUnit")],
	subscriptions: [Y("follow:feedSources.footerLabel"), Y("follow:followOverview.actressUnit")],
	releases: [Y("follow:followOverview.unwatchedReleases"), Y("follow:followOverview.itemUnit")]
}, Hs = {
	duration: 0,
	delay: 0,
	hold: 150
}, Us;
function Ws() {
	return Us || (Us = new CSSStyleSheet(), Us.replaceSync("\n      @keyframes peach-skeleton-sweep { to { transform: translateX(-50%); } }\n      [skullet-rect] { overflow: hidden; }\n      [skullet-rect]::after {\n        content: ''; position: absolute; inset: 0; right: -200%; border-radius: inherit;\n        background: linear-gradient(to right, var(--skullet-base), var(--skullet-highlight) 50%, var(--skullet-base));\n        background-size: 50% 100%; animation: peach-skeleton-sweep 1.5s ease-in-out infinite reverse;\n      }\n      @media (prefers-reduced-motion: reduce) { [skullet-rect]::after { animation: none; } }\n    ")), Us;
}
function Gs({ figure: e, unit: t }) {
	return /* @__PURE__ */ (0, Z.jsxs)("b", {
		"data-follow-reading": "",
		className: `flex min-w-0 flex-wrap items-baseline gap-x-1 tabular-nums text-text-primary ${e >= 1e6 ? "text-headline-medium" : e >= 1e5 ? "text-title-3-medium" : "text-title-1-medium"}`,
		children: [/* @__PURE__ */ (0, Z.jsx)("span", { children: e.toLocaleString() }), /* @__PURE__ */ (0, Z.jsx)("small", {
			className: "whitespace-nowrap text-body-2-regular text-text-secondary",
			children: ` ${t}`
		})]
	});
}
function Ks({ field: e, figure: t, total: n, failed: r = !1 }) {
	let [i, a] = Vs[e], o = (0, X.useRef)(null);
	return (0, X.useLayoutEffect)(() => {
		let e = [...o.current.querySelectorAll("[skullet-layer]")].map((e) => e.shadowRoot).filter((e) => !!e);
		if (!e.length) return;
		let t = Ws();
		for (let n of e) n.adoptedStyleSheets = [...n.adoptedStyleSheets, t];
		return () => {
			for (let n of e) n.adoptedStyleSheets = n.adoptedStyleSheets.filter((e) => e !== t);
		};
	}, [t, r]), /* @__PURE__ */ (0, Z.jsxs)("div", {
		ref: o,
		"data-measured-reading": e,
		className: Te({
			padding: "none",
			className: "flex flex-col gap-3 px-6 py-5 max-sm:gap-2 max-sm:p-4"
		}),
		children: [/* @__PURE__ */ (0, Z.jsx)("span", {
			className: "text-body-medium text-text-secondary",
			children: i
		}), t === void 0 && r ? /* @__PURE__ */ (0, Z.jsx)("b", {
			"data-follow-reading": "",
			className: "text-title-1-medium text-text-primary",
			children: Y("follow:shared.notFound")
		}) : /* @__PURE__ */ (0, Z.jsx)(Os, {
			reveal: Hs,
			children: /* @__PURE__ */ (0, Z.jsx)(Bs, {
				id: `peach:follow-reading:v1:${e}`,
				data: t,
				sample: 12345,
				label: Y("follow:followOverview.loading", { term: i }),
				children: (t) => /* @__PURE__ */ (0, Z.jsx)(Gs, {
					figure: t,
					unit: e === "enabled" ? `/ ${n ?? 0}` : a
				})
			})
		})]
	});
}
// src/react/follow-manage/follow-manage-page.tsx
var qs = (e) => O.some(([t]) => t === e);
function Js(e) {
	let { route: t, savePreference: n, toast: r, openFollow: i, readOnly: a, readOnlyMessage: o, writerUrl: s } = e, [c, l] = (0, X.useState)(qs(e.tab) ? e.tab : "list"), [u, f] = (0, X.useState)(Math.max(1, Math.floor(e.page) || 1)), [p, m] = (0, X.useState)(() => Tt(e.sort, e.dir).sort), [h, g] = (0, X.useState)(() => Tt(e.sort, e.dir).dir), [_, v] = (0, X.useState)(rt(e.layout) ? e.layout : "default"), [y, ee] = (0, X.useState)(ft(e.pageSize)), [b, x] = (0, X.useState)(/* @__PURE__ */ new Set()), [te, S] = (0, X.useState)(/* @__PURE__ */ new Set()), w = Ht({
		queryKey: D,
		queryFn: ({ signal: e }) => Je(e)
	}), T = Ht({
		queryKey: E,
		queryFn: ({ signal: e }) => Ke(e)
	}), k = Ht({
		queryKey: C,
		queryFn: ({ signal: e }) => qe(e)
	}), A = w.data || { sources: [] }, j = T.data || {
		root: "",
		providers: []
	}, M = A.sources;
	(0, X.useEffect)(() => {
		x((e) => {
			let t = ot(e, M);
			return t.size === e.size ? e : t;
		});
	}, [M]);
	let N = (e) => {
		let n = e.sort ?? p, r = e.dir ?? h;
		t({
			tab: e.tab ?? c,
			page: e.page ?? u,
			sort: n === "checked" ? "" : n,
			dir: r === ae[n] ? "" : r
		});
	}, P = tt(M), F = M.filter(nt).length, I = M.filter((e) => e.enabled).length, L = (j.providers || []).filter((e) => e.requirement === "required" && !Re(e)).length, re = new Set((k.data?.sources || []).map((e) => e.entity_id ?? `source-${e.id}`)).size;
	return /* @__PURE__ */ (0, Z.jsxs)(Kt, { children: [
		a ? /* @__PURE__ */ (0, Z.jsx)(R, {
			tone: "warning",
			title: Y("follow:followManagePage.readOnly"),
			extra: s ? /* @__PURE__ */ (0, Z.jsx)("p", {
				className: "text-body-2-regular",
				children: /* @__PURE__ */ (0, Z.jsx)(ne, {
					href: s,
					children: Y("follow:followManagePage.goToPrimary")
				})
			}) : void 0,
			children: o
		}) : null,
		/* @__PURE__ */ (0, Z.jsxs)("div", {
			className: z,
			"aria-label": Y("follow:followManagePage.overview"),
			children: [
				/* @__PURE__ */ (0, Z.jsx)(Ks, {
					field: "creators",
					figure: w.data ? P.length : void 0,
					failed: w.isError
				}),
				/* @__PURE__ */ (0, Z.jsx)(Ks, {
					field: "enabled",
					figure: w.data ? I : void 0,
					total: M.length,
					failed: w.isError
				}),
				/* @__PURE__ */ (0, Z.jsx)(Ks, {
					field: "failed",
					figure: w.data ? F : void 0,
					failed: w.isError
				}),
				/* @__PURE__ */ (0, Z.jsx)(Ks, {
					field: "updates",
					figure: w.data ? A.counts?.new || 0 : void 0,
					failed: w.isError
				}),
				/* @__PURE__ */ (0, Z.jsx)(Ks, {
					field: "subscriptions",
					figure: k.data ? re : void 0,
					failed: k.isError
				}),
				/* @__PURE__ */ (0, Z.jsx)(Ks, {
					field: "releases",
					figure: k.data ? k.data.unread || 0 : void 0,
					failed: k.isError
				})
			]
		}),
		/* @__PURE__ */ (0, Z.jsxs)("div", {
			className: "flex flex-col gap-6",
			children: [
				/* @__PURE__ */ (0, Z.jsx)("div", {
					"data-section-nav": !0,
					children: /* @__PURE__ */ (0, Z.jsx)(le, {
						group: "follow",
						label: Y("follow:followManagePage.sectionTabs"),
						value: c,
						panelPrefix: "follow",
						sectionItems: !0,
						tabs: O.map(([e, t]) => ({
							value: e,
							label: t
						})),
						className: "",
						itemClassName: "cursor-pointer whitespace-nowrap",
						onChange: (e) => {
							x(/* @__PURE__ */ new Set()), S(/* @__PURE__ */ new Set()), l(e), N({ tab: e });
						}
					})
				}),
				c === "list" ? /* @__PURE__ */ (0, Z.jsxs)("div", {
					role: "tabpanel",
					id: "follow-panel-list",
					"aria-labelledby": "follow-tab-list",
					className: "flex flex-col gap-4",
					children: [/* @__PURE__ */ (0, Z.jsx)(Gn, {
						readOnly: a,
						toast: r,
						onAdd: () => {
							l("add"), N({ tab: "add" });
						},
						selection: {
							ids: te,
							onChange: S,
							onActivate: () => x(/* @__PURE__ */ new Set())
						}
					}), w.data ? /* @__PURE__ */ (0, Z.jsx)(tr, {
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
							x(e), S(/* @__PURE__ */ new Set());
						},
						onLayout: (e) => {
							v(e), f(1), n({ layout: e }), N({ page: 1 });
						},
						onPageSize: (e) => {
							ee(e), f(1), n({ pageSize: e }), N({ page: 1 });
						}
					}) : w.isError ? /* @__PURE__ */ (0, Z.jsx)(R, {
						tone: "error",
						children: Y("follow:followManagePage.listFailed")
					}) : /* @__PURE__ */ (0, Z.jsx)("div", {
						role: "status",
						"aria-label": Y("follow:followManagePage.listLoading"),
						"data-skeleton": "",
						className: "skeleton-sheen h-32 rounded-lg"
					})]
				}) : null,
				c === "add" ? /* @__PURE__ */ (0, Z.jsxs)("div", {
					role: "tabpanel",
					id: "follow-panel-add",
					"aria-labelledby": "follow-tab-add",
					className: "flex flex-col gap-8",
					children: [
						T.data && w.data ? /* @__PURE__ */ (0, Z.jsx)(mn, {
							data: A,
							credentials: j,
							readOnly: a,
							toast: r
						}) : T.isError || w.isError ? /* @__PURE__ */ (0, Z.jsx)(R, {
							tone: "error",
							children: Y("follow:followManagePage.credentialsFailed")
						}) : /* @__PURE__ */ (0, Z.jsx)("div", {
							role: "status",
							"aria-label": Y("follow:followManagePage.credentialsLoading"),
							"data-skeleton": "",
							className: "skeleton-sheen h-32 rounded-lg"
						}),
						/* @__PURE__ */ (0, Z.jsx)(yn, {
							readOnly: a,
							toast: r,
							onAdded: () => {
								k.refetch(), l("list"), N({ tab: "list" });
							}
						}),
						w.data ? /* @__PURE__ */ (0, Z.jsx)(Mn, {
							groups: A.author_aliases || [],
							readOnly: a,
							toast: r,
							suggestions: A.alias_suggestions || [],
							sources: A.sources
						}) : null
					]
				}) : null,
				c === "tags" ? /* @__PURE__ */ (0, Z.jsx)("div", {
					role: "tabpanel",
					id: "follow-panel-tags",
					"aria-labelledby": "follow-tab-tags",
					className: "flex flex-col gap-4",
					children: /* @__PURE__ */ (0, Z.jsx)(G, { scope: "online" })
				}) : null
			]
		}),
		/* @__PURE__ */ (0, Z.jsxs)("details", {
			className: "rounded-xl border border-separator-border bg-background-secondary-default",
			children: [/* @__PURE__ */ (0, Z.jsx)("summary", {
				className: "cursor-pointer px-4 py-3 text-body-2-medium text-text-primary",
				children: Y("catalog:studioSubscriptions.mergeEntry")
			}), /* @__PURE__ */ (0, Z.jsx)("div", {
				className: "px-4 pb-4",
				children: /* @__PURE__ */ (0, Z.jsx)(Kn, { close: () => void 0 })
			})]
		}),
		/* @__PURE__ */ (0, Z.jsx)("div", { children: /* @__PURE__ */ (0, Z.jsx)(d, {
			variant: "secondary",
			href: "/settings/subscriptions",
			children: L ? Y("follow:followManagePage.feedSettingsPending", { count: L }) : Y("follow:followManagePage.feedSettings")
		}) })
	] });
}
export { Js as FollowManagePage };

//# debugId=7f7a8a2b-ca30-45c7-916b-31269d396899