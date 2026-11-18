(function() {
	try {
		var e = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, t = new e.Error().stack;
		t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "d9dca213-2e1d-4bc3-86ee-92c6e89fc973", e._sentryDebugIdIdentifier = "sentry-dbid-d9dca213-2e1d-4bc3-86ee-92c6e89fc973");
	} catch {}
})();
import { $76d00c5a4edb230a$export$76ccd210b9029917 as e, $76d00c5a4edb230a$export$816b5d811295e6bc as t, $76d00c5a4edb230a$export$b59bdbef9ce70de2 as n, $76d00c5a4edb230a$export$f6f0c3fe4ec306ea as r, $76d00c5a4edb230a$export$f850895b287ef28e as i, $fe21c36db05242bb$export$d7b12c4107be0d61 as a, ActivityMotion as o, ArtSlot as s, Button as c, ButtonLink as l, Bx as u, COVER_STATE_TITLE as d, CatalogViewToggle as f, Checkbox as p, ChevronSortDown as m, Chip as h, CloudDownloadDialog as g, ColumnFilterAvatar as _, CoverQueue as v, DISCOVERY_METADATA_KEY as y, DISCOVERY_SORTS as b, DOWNLOADS_KEY as x, DOWNLOADS_URL as ee, DataTableFooter as S, DataTableFrame as C, E3 as w, EmptyFocusButton as T, EmptyState as E, FilterActionButton as D, FilterGlassRows as te, FilterIconButton as O, FilterPill as ne, IndexSearch as k, Input as re, JAV_LAYOUTS as ie, JAV_RECOMMENDATION_GRID as A, JAV_SELECTION_EVENT as j, JavHeader as M, LibraryShortcuts as ae, M6 as N, Note as P, PHASES as F, RELEASE_COLUMN_VISIBILITY_KEY as I, RELEASE_COLUMN_WIDTHS_KEY as L, RELEASE_PAGE_SIZES as oe, RELEASE_SORTS as se, RELEASE_SORT_COLUMNS as R, SEGMENT as z, SEGMENTED_TRACK as B, ScrapeSourceLabel as V, SegmentedRadioGroup as H, Segments as ce, SelectionDock as U, Shuffle as le, SortKeys as ue, SourceAvatar as W, Table as G, TableColumnControls as de, TableColumnFilter as fe, TableColumnResizer as K, TaskProgress as pe, WANTS_KEY as me, WantMagnets as he, Wt as ge, __toESM as _e, activityKind as ve, addWant as ye, apiGet as be, appSettingsStore as xe, avatarInner as Se, busyProps as q, cachedMagnetStates as Ce, cardClass as we, cardRatio as Te, catalogListSkeletonCellHtml as Ee, columnValueSelected as De, composingKey as Oe, controlDiscoveryMetadata as ke, controlReleaseMetadata as Ae, coverArrived as je, coverFetching as Me, coverFetchingHtml as Ne, coverReason as Pe, coverStateAction as Fe, coverUrl as Ie, discoveryArtwork as Le, discoveryKey as Re, discoveryScore as ze, entityDisplayName as Be, entityFaceImg as Ve, entityPath as He, entityWriting as Ue, errorMessage as We, esc as Ge, facePos as Ke, fetchCoverNow as qe, fetchDiscoveries as Je, fetchDiscoveryMetadata as Ye, fetchReleaseColumn as Xe, fetchReleases as Ze, fetchWants as Qe, firstGrapheme as $e, fmtDur as et, gridLayout as tt, invalidateWants as J, javContentSkeleton as nt, javLayout as rt, javTagSkeleton as it, jobText as at, joinList as ot, keepPreviousData as st, lastSearchNote as ct, leadingGraphemes as lt, logoUrl as ut, metadataInterval as dt, pageWindow as ft, pv as pt, qE as mt, queryClient as ht, recommendationScore as gt, relayoutCovers as _t, releaseColumnSelection as vt, releaseColumnValues as yt, releaseColumns as bt, releaseFilters as xt, releaseKey as St, removeWants as Ct, require_jsx_runtime as wt, require_react as Tt, resetWants as Et, resourceSourceKey as Dt, restoreWants as Ot, searchNote as kt, selectRange as At, selectionSummary as jt, serverLabelList as Mt, setReleaseColumn as Nt, spriteGlyph as Pt, storeJavLayout as Ft, suppressShiftTextSelection as It, t as Y, textLang as Lt, tierPlaceholdersHtml as Rt, toggleColumnValue as zt, useAction as Bt, useCatalogView as Vt, useDense as Ht, useEntityNames as Ut, useQuery as X, useTablePreferences as Wt, wantName as Gt, wantsInterval as Kt, wireHorizontalScroller as qt, writeJavQuery as Z } from "./peach-app.js";
import { JavBatchResources as Jt } from "./peach-app.jav-batch-resources-B1BkGgyg.js";
import { ErrorLine as Yt } from "./peach-app.source-view-CDbKpFus.js";
// src/react/jav/jav-selection.tsx
var Q = /* @__PURE__ */ _e(Tt(), 1), $ = wt(), Xt = (0, Q.createContext)(null), Zt = () => (0, Q.useContext)(Xt);
function Qt(e) {
	let t = Zt()?.visible;
	(0, Q.useEffect)(() => {
		t?.(e);
	}, [e, t]);
}
function $t({ children: e, readOnly: t, receipt: n, dock: r = !0 }) {
	let i = Ht(), [a, o] = (0, Q.useState)(!1), [s, l] = (0, Q.useState)(/* @__PURE__ */ new Map()), [u, d] = (0, Q.useState)([]), [f, p] = (0, Q.useState)(null), m = (0, Q.useRef)(null), h = new Set(s.keys()), g = jt(h, u.map((e) => e.code)), _ = (0, Q.useCallback)((e) => {
		d((t) => t.length === e.length && t.every((t, n) => t === e[n]) ? t : e), l((t) => {
			let n = e.filter((e) => t.has(e.code) && t.get(e.code) !== e);
			return n.length ? new Map([...t, ...n.map((e) => [e.code, e])]) : t;
		});
	}, []), v = (0, Q.useCallback)(() => {
		o(!1), l(/* @__PURE__ */ new Map()), m.current = null;
	}, []), y = () => l((e) => {
		let t = new Map(e);
		return u.forEach((e) => g.all ? t.delete(e.code) : t.set(e.code, e)), t;
	});
	(0, Q.useEffect)(() => {
		let e = () => {
			a ? v() : o(!0);
		};
		return window.addEventListener(j, e), () => window.removeEventListener(j, e);
	}, [a, v]), (0, Q.useEffect)(() => (a || (l(/* @__PURE__ */ new Map()), m.current = null), document.getElementById("selectMode")?.setAttribute("aria-pressed", String(a)), () => document.getElementById("selectMode")?.setAttribute("aria-pressed", "false")), [a]), (0, Q.useEffect)(() => {
		if (!a) return;
		let e = (e) => {
			e.target.closest("input,textarea,[contenteditable]:not([contenteditable=\"false\"]),[role=\"dialog\"]") || (e.key === "Escape" && (e.preventDefault(), v()), (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a" && (e.preventDefault(), l((e) => new Map([...e, ...u.map((e) => [e.code, e])]))));
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [
		a,
		v,
		u
	]);
	let b = (e, t = !1) => {
		o(!0);
		let n = m.current;
		m.current = e.code, l((r) => {
			let i = new Set(r.keys());
			At(i, u.map((e) => e.code), n, e.code, t);
			let a = new Map([
				...r,
				...u.map((e) => [e.code, e]),
				[e.code, e]
			]);
			return new Map([...i].map((e) => [e, a.get(e)]));
		});
	}, x = [...s.values()].filter((e) => !e.wanted && !e.asset_id), ee = (() => {
		let e = /* @__PURE__ */ new Set(), t = [];
		return {
			key: "want",
			label: Y("catalog:javSelection.addToWants"),
			reversal: "undo",
			confirm: (e) => ({
				title: Y("catalog:javSelection.addToWants"),
				body: Y("catalog:javSelection.wantConfirm", { count: e.length })
			}),
			run: async (n) => {
				try {
					for (let r of n) if (!e.has(r.code)) {
						try {
							let e = await ye({ code: r.code });
							e?.created && t.push(e.want.id);
						} catch (t) {
							throw Error(Y("catalog:javSelection.wantPartialFailed", {
								count: e.size,
								code: r.code,
								error: We(t)
							}));
						}
						e.add(r.code), l((e) => {
							let t = new Map(e);
							return t.delete(r.code), t;
						});
					}
				} finally {
					J();
				}
				return async () => {
					t.length && await Ct(t), await J();
				};
			},
			receipt: () => Y("catalog:javSelection.wantAdded", { count: e.size })
		};
	})(), S = { receipt: n };
	return /* @__PURE__ */ (0, $.jsxs)(Xt.Provider, {
		value: {
			dense: i,
			mode: a,
			selected: h,
			toggle: b,
			visible: _,
			selectPage: y,
			close: v,
			all: g.all,
			mixed: g.mixed
		},
		children: [
			/* @__PURE__ */ (0, $.jsx)("div", {
				"data-jav-selection": "",
				"data-select-mode": a ? "" : void 0,
				className: "flex min-w-0 flex-col gap-4",
				children: e
			}),
			/* @__PURE__ */ (0, $.jsxs)(U, {
				visible: r && a,
				count: Y("catalog:javSelection.selectedCount", { count: s.size }),
				label: Y("catalog:javSelection.dockLabel"),
				actions: [{
					action: ee,
					items: x,
					host: S,
					disabled: t
				}],
				leading: /* @__PURE__ */ (0, $.jsx)(c, {
					size: "small",
					variant: "secondary",
					disabled: !u.length,
					onClick: y,
					children: /* @__PURE__ */ (0, $.jsx)("span", {
						"data-copy-key": `jav.selection.page.${g.all ? "clear" : "all"}`,
						children: g.all ? Y("catalog:javSelection.deselectPage") : Y("catalog:javSelection.selectPage")
					})
				}),
				children: [/* @__PURE__ */ (0, $.jsx)(c, {
					size: "small",
					variant: "secondary",
					disabled: !s.size,
					onClick: () => p([...s.values()]),
					children: Y("catalog:shared.searchTorrents")
				}), /* @__PURE__ */ (0, $.jsx)(c, {
					size: "small",
					variant: "ghost",
					onClick: v,
					children: Y("catalog:javSelection.exit")
				})]
			}),
			/* @__PURE__ */ (0, $.jsx)(Jt, {
				items: f,
				close: () => p(null),
				readOnly: t,
				receipt: n
			})
		]
	});
}
// src/react/wants/want-list.tsx
var en = {
	code: Y("catalog:wants.originManual"),
	feed: Y("catalog:entityHero.subscribeNewReleases"),
	follow: Y("catalog:entityHero.following")
}, tn = [
	["all", Y("catalog:shared.all")],
	["available", Y("catalog:wants.hasMagnet")],
	["missing", Y("catalog:wants.noMagnet")]
], nn = (e) => [
	e.release_date,
	e.studio,
	e.performers,
	en[e.origin]
].filter(Boolean).join(" · ");
function rn({ want: e }) {
	return /* @__PURE__ */ (0, $.jsxs)("span", {
		className: "relative inline-grid w-card-cover shrink-0 aspect-card-cover place-items-center overflow-hidden rounded-2lg bg-media-placeholder max-sm:w-24",
		children: [/* @__PURE__ */ (0, $.jsx)("span", {
			className: "text-caption-1-regular text-text-secondary",
			children: Y("catalog:shared.noCover")
		}), e.cover ? /* @__PURE__ */ (0, $.jsx)("img", {
			src: e.cover,
			alt: "",
			loading: "lazy",
			referrerPolicy: e.remote_cover ? "no-referrer" : void 0,
			onError: (e) => e.currentTarget.remove(),
			className: "absolute inset-0 size-full object-cover"
		}) : null]
	});
}
function an({ want: e, readOnly: t, busy: n, onReset: r, onRemove: i, onCloudDownload: a, downloads: o, provider: s, toast: u, picked: d }) {
	let [f, m] = (0, Q.useState)([]), h = e.link || (!f.length && e.code ? `https://javdb.com/search?q=${encodeURIComponent(e.code)}&f=all` : ""), g = h && URL.canParse(h) ? new URL(h).hostname.replace(/^www\./, "") : "", _ = Dt(e.follow_provider || g.split(".")[0] || ""), v = _ === "javdb" ? "JavDB" : _ === "javbus" ? "JavBus" : g, y = h && g && !f.some((e) => e.source === _) ? [{
		source: _,
		label: v,
		url: h
	}, ...f] : f, b = e.code && e.phase === "searching" ? ct(e) : kt(e);
	return /* @__PURE__ */ (0, $.jsxs)("li", {
		"data-want-id": e.id,
		className: we({ className: "flex flex-col gap-4 max-sm:p-4" }),
		children: [/* @__PURE__ */ (0, $.jsxs)("div", {
			className: "flex min-w-0 items-start gap-4 max-sm:gap-3",
			children: [
				d ? /* @__PURE__ */ (0, $.jsx)(p, {
					slot: null,
					className: "mt-1 shrink-0 self-start",
					"aria-label": Y("catalog:wants.selectRow", { name: Gt(e) }),
					isSelected: d.on,
					onChange: d.toggle
				}) : null,
				/* @__PURE__ */ (0, $.jsx)(rn, { want: e }),
				/* @__PURE__ */ (0, $.jsxs)("div", {
					className: "flex min-w-0 flex-1 flex-col gap-1",
					children: [
						/* @__PURE__ */ (0, $.jsxs)("p", {
							className: "flex min-w-0 flex-wrap items-baseline gap-x-2",
							children: [/* @__PURE__ */ (0, $.jsx)("b", {
								className: "min-w-0 text-headline-medium wrap-anywhere text-text-primary",
								children: Gt(e)
							}), e.code && e.title ? /* @__PURE__ */ (0, $.jsx)("span", {
								className: "min-w-0 truncate text-body-2-regular text-text-secondary",
								children: e.title
							}) : null]
						}),
						nn(e) ? /* @__PURE__ */ (0, $.jsx)("p", {
							className: "text-body-2-regular text-text-secondary",
							children: nn(e)
						}) : null,
						b ? /* @__PURE__ */ (0, $.jsx)("p", {
							"data-want-note": "",
							className: "text-caption-1-regular text-text-secondary",
							children: b
						}) : null,
						e.scrape_error ? /* @__PURE__ */ (0, $.jsx)(Yt, {
							text: e.scrape_error,
							prefix: Y("catalog:wants.metadataNotFound"),
							tone: "muted"
						}) : null,
						/* @__PURE__ */ (0, $.jsxs)("div", {
							"data-want-actions": "",
							className: "mt-1 flex flex-wrap items-center gap-2",
							children: [
								y.map((e) => /* @__PURE__ */ (0, $.jsx)(l, {
									"data-button-link": "",
									variant: "secondary",
									size: "small",
									trailingIcon: ge,
									href: e.url,
									target: "_blank",
									rel: "noopener noreferrer",
									children: /* @__PURE__ */ (0, $.jsx)(V, {
										source: e.source,
										label: e.label
									})
								}, e.source)),
								e.phase === "given_up" ? /* @__PURE__ */ (0, $.jsx)(c, {
									variant: "secondary",
									size: "small",
									disabled: t,
									...q(n === `reset:${e.id}`),
									onClick: r,
									children: Y("catalog:wants.searchAgain")
								}) : null,
								e.phase === "searching" || e.phase === "given_up" ? /* @__PURE__ */ (0, $.jsx)(c, {
									variant: "primary",
									size: "small",
									leadingIcon: pt,
									onClick: a,
									children: Y("catalog:shared.searchTorrents")
								}) : null,
								/* @__PURE__ */ (0, $.jsx)(c, {
									variant: "danger",
									size: "small",
									leadingIcon: N,
									disabled: t,
									...q(n === `remove:${e.id}`),
									onClick: i,
									children: Y("catalog:shared.remove")
								})
							]
						})
					]
				})
			]
		}), e.code && (e.phase === "searching" || e.phase === "given_up") ? /* @__PURE__ */ (0, $.jsx)(he, {
			want: e,
			readOnly: t,
			downloads: o,
			provider: s,
			toast: u,
			onSources: m
		}) : null]
	});
}
function on({ phase: e, label: t, rows: n, row: r }) {
	let [i, o] = (0, Q.useState)(1), [s, l] = (0, Q.useState)(20), [u, d] = (0, Q.useState)("all"), f = Ce(n), p = (e) => e.has_magnets ?? f.get(e.code || "") ?? !1, m = n.filter(p), h = e !== "searching" || u === "all" ? n : n.filter((e) => p(e) === (u === "available")), g = ft(h.length, s, i);
	return /* @__PURE__ */ (0, $.jsxs)("section", {
		"aria-label": t,
		"data-want-phase": e,
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, $.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, $.jsxs)("h3", {
					className: "flex items-baseline gap-2 text-title-2-medium text-text-primary",
					children: [t, /* @__PURE__ */ (0, $.jsx)("span", {
						className: "text-body-2-regular tabular-nums text-text-secondary",
						children: n.length.toLocaleString()
					})]
				}), e === "searching" ? /* @__PURE__ */ (0, $.jsx)(H, {
					name: "want-magnet-filter",
					"aria-label": Y("catalog:wants.magnetFilter"),
					orientation: "horizontal",
					value: u,
					className: B,
					onChange: (e) => {
						d(e), o(1);
					},
					children: tn.map(([e, t]) => /* @__PURE__ */ (0, $.jsxs)(a, {
						value: e,
						"aria-label": t,
						className: z,
						children: [t, /* @__PURE__ */ (0, $.jsx)("span", {
							className: "text-caption-1-regular tabular-nums text-text-tertiary",
							children: (e === "all" ? n.length : e === "available" ? m.length : n.length - m.length).toLocaleString()
						})]
					}, e))
				}) : null]
			}),
			h.length ? null : /* @__PURE__ */ (0, $.jsx)(E, {
				size: "compact",
				icon: mt,
				title: Y("catalog:wants.noFilterMatches"),
				actions: /* @__PURE__ */ (0, $.jsx)(c, {
					size: "small",
					onClick: () => {
						d("all"), o(1);
					},
					children: Y("catalog:shared.viewAll")
				}),
				children: null
			}),
			/* @__PURE__ */ (0, $.jsx)("ul", {
				className: "flex flex-col gap-4",
				children: h.slice(g.start, g.end).map(r)
			}),
			/* @__PURE__ */ (0, $.jsx)("div", {
				"data-want-pager": "",
				children: /* @__PURE__ */ (0, $.jsx)(S, {
					label: t,
					total: g.total,
					pagination: {
						pageIndex: g.page - 1,
						pageSize: s
					},
					onChange: (e) => {
						l(e.pageSize), o(e.pageIndex + 1);
					},
					unit: Y("catalog:wants.itemUnit")
				})
			})
		]
	});
}
function sn({ readOnly: e, toast: t, query: n = "", clearQuery: r }) {
	let [i, a] = (0, Q.useState)(""), [o, s] = (0, Q.useState)(null), l = Bt(), u = X({
		queryKey: me,
		queryFn: ({ signal: e }) => Qe(e),
		staleTime: 3e4,
		refetchInterval: Kt
	}), d = () => {
		let n = i.trim();
		n && !e && l.run("add", (e) => ye({ code: n }, e), (e) => {
			t(e.created ? Y("catalog:wants.added", { name: Gt(e.want) }) : Y("catalog:wants.alreadyAdded", { name: Gt(e.want) })), a(""), J();
		});
	}, f = (e) => {
		e.key === "Enter" && !Oe(e.nativeEvent) && (e.preventDefault(), d());
	}, p = (e) => {
		l.run(`remove:${e.id}`, (t) => Ct([e.id], t), () => {
			t(Y("catalog:wants.removed", { name: Gt(e) })), J();
		});
	}, m = (e) => {
		l.run(`reset:${e.id}`, (t) => Et([e.id], t), () => {
			t(Y("catalog:wants.backToSearching", { name: Gt(e) })), J();
		});
	}, h = u.data, _ = (h?.items || []).filter((e) => !n || [
		e.code,
		e.title,
		e.performers
	].join(" ").toLocaleLowerCase().includes(n.toLocaleLowerCase())), v = Zt(), y = !!v?.mode, [b, S] = (0, Q.useState)(/* @__PURE__ */ new Set()), [C, w] = (0, Q.useState)(null);
	(0, Q.useEffect)(() => {
		y || S(/* @__PURE__ */ new Set());
	}, [y]);
	let D = _.filter((e) => b.has(e.id)), te = _.length > 0 && D.length === _.length, O = { receipt: t }, ne = {
		key: "remove",
		label: Y("catalog:shared.remove"),
		reversal: "undo",
		danger: !0,
		confirm: (e) => ({
			title: Y("catalog:wants.removeMany"),
			body: Y("catalog:wants.removeManyBody", { count: e.length })
		}),
		run: async (e) => {
			let { previous: t } = await Ct(e.map((e) => e.id));
			return await J(), async () => {
				await Ot(t), await J();
			};
		},
		receipt: (e) => Y("catalog:wants.removedMany", { count: e.length })
	}, k = {
		key: "reset",
		label: Y("catalog:wants.searchAgain"),
		reversal: "undo",
		confirm: (e) => ({
			title: Y("catalog:wants.searchAgainMany"),
			body: Y("catalog:wants.searchAgainManyBody", { count: e.length })
		}),
		run: async (e) => {
			let { previous: t } = await Et(e.map((e) => e.id));
			return await J(), async () => {
				await Ot(t), await J();
			};
		},
		receipt: (e) => Y("catalog:wants.searchAgainDone", { count: e.length })
	}, ie = D.filter((e) => e.code && (e.phase === "searching" || e.phase === "given_up")), A = X({
		queryKey: x,
		queryFn: ({ signal: e }) => be(`${ee}?limit=100`, e),
		enabled: _.some((e) => e.code && (e.phase === "searching" || e.phase === "given_up"))
	}), j = A.data?.providers.filter((e) => e.configured) || [], M = j[0]?.key || "";
	return /* @__PURE__ */ (0, $.jsxs)("div", {
		"aria-busy": u.isPending,
		className: "flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, $.jsxs)("div", {
				className: we({
					padding: "none",
					className: "flex flex-col gap-4 px-6 py-5 max-sm:px-4"
				}),
				children: [
					/* @__PURE__ */ (0, $.jsx)("h3", {
						className: "text-title-2-medium text-text-primary",
						children: Y("catalog:wants.addByCode")
					}),
					/* @__PURE__ */ (0, $.jsxs)("div", {
						className: "flex flex-wrap items-end gap-2",
						children: [/* @__PURE__ */ (0, $.jsx)("div", {
							className: "min-w-64 grow max-sm:min-w-0",
							children: /* @__PURE__ */ (0, $.jsx)(re, {
								"aria-label": Y("catalog:shared.code"),
								placeholder: Y("catalog:wants.codePlaceholder"),
								value: i,
								isDisabled: e,
								onChange: a,
								onKeyDown: f
							})
						}), /* @__PURE__ */ (0, $.jsx)(c, {
							variant: "primary",
							disabled: e || !i.trim(),
							...q(l.busy === "add"),
							onClick: d,
							children: Y("catalog:shared.add")
						})]
					}),
					l.error ? /* @__PURE__ */ (0, $.jsx)(P, {
						tone: "error",
						title: Y("catalog:wants.actionFailed"),
						children: l.error
					}) : null
				]
			}),
			u.error ? /* @__PURE__ */ (0, $.jsx)(P, {
				tone: "error",
				title: Y("catalog:wants.loadFailed"),
				children: We(u.error)
			}) : null,
			u.isPending ? /* @__PURE__ */ (0, $.jsx)("div", {
				role: "status",
				"aria-label": Y("catalog:wants.loading"),
				dangerouslySetInnerHTML: { __html: nt("wants") }
			}) : null,
			h?.scraping ? /* @__PURE__ */ (0, $.jsx)(pe, {
				embedded: !0,
				kind: ve("want-scrape"),
				label: Y("catalog:wants.fetchingNew")
			}) : null,
			h?.searching ? /* @__PURE__ */ (0, $.jsx)(pe, {
				embedded: !0,
				kind: ve("want-search"),
				label: Y("catalog:wants.searchingResources")
			}) : null,
			A.error ? /* @__PURE__ */ (0, $.jsx)(P, {
				tone: "error",
				title: Y("catalog:wants.downloadSettingsFailed"),
				children: We(A.error)
			}) : null,
			A.data && !j.length ? /* @__PURE__ */ (0, $.jsxs)(P, {
				tone: "neutral",
				children: [
					Y("shell:downloadChannels.notConfigured"),
					Y("shell:format.sentenceGap"),
					/* @__PURE__ */ (0, $.jsx)("a", {
						href: "/settings/downloads",
						children: Y("shell:downloadChannels.settingsLink")
					})
				]
			}) : null,
			A.data && !A.data.available ? /* @__PURE__ */ (0, $.jsx)(P, {
				tone: "neutral",
				children: Y("catalog:wants.cloudPrimaryOnly")
			}) : null,
			h && !_.length ? /* @__PURE__ */ (0, $.jsx)(E, {
				size: "compact",
				icon: mt,
				title: Y(n ? "catalog:wants.noSearchMatches" : "catalog:wants.empty"),
				actions: n && r ? /* @__PURE__ */ (0, $.jsx)(c, {
					size: "small",
					onClick: r,
					children: Y("catalog:shared.clearSearch")
				}) : !n && !e ? /* @__PURE__ */ (0, $.jsx)(T, {
					target: `input[aria-label="${Y("catalog:shared.code")}"]`,
					children: Y("catalog:wants.addWork")
				}) : void 0,
				children: Y(n ? "catalog:wants.tryOtherSearch" : "catalog:wants.emptyHint")
			}) : null,
			F.map(([n, r]) => {
				let i = _.filter((e) => e.phase === n);
				return i.length ? /* @__PURE__ */ (0, $.jsx)(on, {
					phase: n,
					label: r,
					rows: i,
					row: (n) => /* @__PURE__ */ (0, $.jsx)(an, {
						want: n,
						readOnly: e,
						busy: l.busy,
						downloads: A.data,
						provider: M,
						toast: t,
						picked: y ? {
							on: b.has(n.id),
							toggle: (e) => S((t) => {
								let r = new Set(t);
								return e ? r.add(n.id) : r.delete(n.id), r;
							})
						} : void 0,
						onReset: () => m(n),
						onRemove: () => p(n),
						onCloudDownload: () => s({
							code: n.code || "",
							title: n.title || "",
							origin: `wishlist:${n.id}`,
							cover: n.cover || "",
							performers: n.performers || "",
							release_date: n.release_date || "",
							studio: n.studio || ""
						})
					}, n.id)
				}, n) : null;
			}),
			/* @__PURE__ */ (0, $.jsx)(g, {
				prefill: o,
				close: () => s(null),
				receipt: t,
				provider: M
			}),
			/* @__PURE__ */ (0, $.jsxs)(U, {
				visible: y,
				label: Y("catalog:wants.dockLabel"),
				count: Y("catalog:javSelection.selectedCount", { count: D.length }),
				actions: [{
					action: ne,
					items: D,
					host: O,
					disabled: e,
					done: () => S(/* @__PURE__ */ new Set())
				}, {
					action: k,
					items: D.filter((e) => e.phase === "given_up"),
					host: O,
					disabled: e,
					done: () => S(/* @__PURE__ */ new Set())
				}],
				leading: /* @__PURE__ */ (0, $.jsx)(c, {
					size: "small",
					variant: "secondary",
					disabled: !_.length,
					onClick: () => S(te ? /* @__PURE__ */ new Set() : new Set(_.map((e) => e.id))),
					children: Y(te ? "catalog:javSelection.deselectPage" : "catalog:wants.selectAll")
				}),
				children: [/* @__PURE__ */ (0, $.jsx)(c, {
					size: "small",
					variant: "secondary",
					disabled: !ie.length,
					onClick: () => w(ie.map((e) => ({
						id: e.id,
						code: e.code,
						title: e.title || "",
						release_date: e.release_date || void 0
					}))),
					children: Y("catalog:shared.searchTorrents")
				}), /* @__PURE__ */ (0, $.jsx)(c, {
					size: "small",
					variant: "ghost",
					onClick: () => v?.close(),
					children: Y("catalog:javSelection.exit")
				})]
			}),
			/* @__PURE__ */ (0, $.jsx)(Jt, {
				items: C,
				close: () => w(null),
				readOnly: e,
				receipt: t
			})
		]
	});
}
// src/react/jav/discovery-faces.tsx
function cn({ item: e }) {
	Ut();
	let t = e.performer_refs?.length ? e.performer_refs : [...new Set(e.performers.split(/[,，、;/]/).filter(Boolean))].map((e) => ({ name: e })), n = t.slice(0, 5).map((t, n) => {
		let r = { "--media-avatar-index": n }, i = t.source_avatar && t.source_actor_id && !t.has_image && !t.has_avatar ? { children: /* @__PURE__ */ (0, $.jsx)(W, {
			code: e.code,
			person: t
		}) } : { dangerouslySetInnerHTML: { __html: Se(t.name, t, null) } };
		return t.id ? /* @__PURE__ */ (0, $.jsx)("a", {
			"data-media-avatar": "",
			style: r,
			href: He("performer", t.name, t.id),
			"aria-label": Y("catalog:javDiscovery.openActress", { name: Be("performer", t.name, t.id) }),
			...i
		}, t.name) : /* @__PURE__ */ (0, $.jsx)("span", {
			"data-media-avatar": "",
			style: r,
			title: Be("performer", t.name),
			...i
		}, t.name);
	});
	return t.length > 1 ? /* @__PURE__ */ (0, $.jsx)("div", {
		"data-media-avatars": "",
		style: { "--media-avatar-count": Math.min(5, t.length) },
		children: n
	}) : n[0] || null;
}
// src/react/jav/discovery-card.tsx
var ln = (e) => ({
	...e,
	cover: e.has_cover ? Ie(e, !0) : e.cover_url,
	origin: `${e.asset_id ? "asset" : "feed"}:${e.id}`
}), un = "relative inline-grid place-items-center overflow-hidden rounded-2lg bg-background-tertiary-default";
function dn({ item: e, readOnly: t }) {
	let n = Bt(), [r, i] = (0, Q.useState)("");
	(0, Q.useSyncExternalStore)(Me.subscribe, Me.revision);
	let a = e.cover_state;
	if (!a) return /* @__PURE__ */ (0, $.jsx)("span", {
		"data-media-nopic": "",
		children: Y("catalog:shared.noCover")
	});
	if (a === "fetching" || Me.has(e.code)) return /* @__PURE__ */ (0, $.jsx)("span", { dangerouslySetInnerHTML: { __html: Ne() } });
	let s = () => {
		n.run("cover", (t) => qe(e.code, t), (t) => {
			t.has_cover ? je(e.code, t) : i(t.message || Y("catalog:javDiscovery.noOfficialCover"));
		});
	}, l = r || n.error ? "missing" : a, u = n.error || r || Pe(e);
	return /* @__PURE__ */ (0, $.jsxs)("div", {
		"data-cover-state": l,
		className: "flex max-w-full flex-col items-center gap-1.5 px-4 text-center",
		children: [
			l === "queued" ? /* @__PURE__ */ (0, $.jsx)(o, {
				kind: "clock",
				size: "card",
				still: !0
			}) : null,
			/* @__PURE__ */ (0, $.jsx)("span", {
				"data-media-nopic": "",
				children: d[l]
			}),
			u ? /* @__PURE__ */ (0, $.jsx)("span", {
				className: "line-clamp-3 text-caption-1-regular text-text-secondary",
				title: u,
				children: u
			}) : null,
			t ? null : /* @__PURE__ */ (0, $.jsx)(c, {
				size: "small",
				variant: "secondary",
				className: "mt-1",
				onClick: s,
				children: Fe(l)
			})
		]
	});
}
function fn({ item: e, layout: t, javImage: n, readOnly: r, navigate: i, tag: a, onTag: o, wanting: u, onWant: d, onResource: f, badge: p }) {
	let m = Zt(), h = m?.selected.has(e.code), g = !!m?.dense, _ = e.performer_refs?.length ? ot(e.performer_refs.map((e) => e.name)) : e.performers, v = Le(e, t, n), y = e.asset_id ? `/assets/${e.asset_id}` : `/works/${encodeURIComponent(e.code)}`;
	return /* @__PURE__ */ (0, $.jsxs)("article", {
		"data-media-card": "",
		"data-jav-card": "",
		"data-selected": h ? "" : void 0,
		onMouseDown: It,
		onClickCapture: (t) => {
			m && (m.mode || t.shiftKey || t.ctrlKey || t.metaKey) && (t.preventDefault(), t.stopPropagation(), m.toggle(e, t.shiftKey));
		},
		onClick: (e) => {
			e.target.closest("a,button,input") || i(y);
		},
		children: [
			v ? /* @__PURE__ */ (0, $.jsx)("a", {
				href: y,
				"aria-label": Y("catalog:javDiscovery.viewDetails", { code: e.code }),
				onClick: (e) => {
					e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0 || (e.preventDefault(), i(y));
				},
				"data-media-pic": "",
				"data-jav-cover-box": "",
				className: un,
				children: /* @__PURE__ */ (0, $.jsx)(s, {
					artwork: {
						kind: "cover",
						html: v
					},
					identity: Le(e, "small", n),
					relayout: (e) => _t(e, t)
				})
			}) : /* @__PURE__ */ (0, $.jsx)("div", {
				"data-media-pic": "",
				"data-jav-cover-box": "",
				className: un,
				children: /* @__PURE__ */ (0, $.jsx)(dn, {
					item: e,
					readOnly: r
				})
			}),
			m?.mode ? /* @__PURE__ */ (0, $.jsx)("button", {
				type: "button",
				"data-media-check": "",
				"aria-label": Y("catalog:javDiscovery.select", { code: e.code }),
				"aria-pressed": !!h,
				children: /* @__PURE__ */ (0, $.jsx)("svg", {
					viewBox: "0 0 24 24",
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, $.jsx)("use", { href: "#i-check" })
				})
			}) : null,
			/* @__PURE__ */ (0, $.jsxs)("div", {
				"data-media-meta": "",
				children: [/* @__PURE__ */ (0, $.jsx)(cn, { item: e }), /* @__PURE__ */ (0, $.jsxs)("div", {
					"data-media-text": "",
					children: [
						/* @__PURE__ */ (0, $.jsxs)("h3", {
							"data-jav-title": "",
							"data-media-title": "",
							title: `${e.code} · ${e.title || Y("catalog:javDiscovery.titleNotFound")}`,
							children: [
								/* @__PURE__ */ (0, $.jsx)("b", { children: e.code }),
								" ",
								e.title ? /* @__PURE__ */ (0, $.jsx)("span", {
									lang: Lt(e.title),
									children: e.title
								}) : Y("catalog:javDiscovery.titleNotFound")
							]
						}),
						/* @__PURE__ */ (0, $.jsxs)("div", {
							"data-media-byline": "",
							children: [
								e.performer_refs?.[0]?.id ? /* @__PURE__ */ (0, $.jsxs)("a", {
									"data-media-who": "",
									href: He("performer", e.performer_refs[0].name),
									title: _,
									children: [/* @__PURE__ */ (0, $.jsx)("svg", {
										viewBox: "0 0 24 24",
										"aria-hidden": "true",
										children: /* @__PURE__ */ (0, $.jsx)("use", { href: "#i-user-round" })
									}), /* @__PURE__ */ (0, $.jsx)("span", { children: e.performer_refs[0].name })]
								}) : /* @__PURE__ */ (0, $.jsxs)("span", {
									"data-media-who": "",
									title: _,
									children: [/* @__PURE__ */ (0, $.jsx)("svg", {
										viewBox: "0 0 24 24",
										"aria-hidden": "true",
										children: /* @__PURE__ */ (0, $.jsx)("use", { href: "#i-user-round" })
									}), /* @__PURE__ */ (0, $.jsx)("span", { children: e.performer_refs?.[0]?.name || _ })]
								}),
								(e.performer_refs?.length || 0) > 1 ? /* @__PURE__ */ (0, $.jsx)("span", {
									"data-media-who-more": "",
									children: Y("catalog:javDiscovery.morePeople", {
										count: e.performer_refs.length - 1,
										total: e.performer_refs.length
									})
								}) : null,
								e.release_date ? /* @__PURE__ */ (0, $.jsx)("span", {
									"data-media-facts": "",
									children: /* @__PURE__ */ (0, $.jsxs)("time", {
										"data-media-release": "",
										dateTime: e.release_date,
										children: [/* @__PURE__ */ (0, $.jsx)("svg", {
											viewBox: "0 0 24 24",
											"aria-hidden": "true",
											children: /* @__PURE__ */ (0, $.jsx)("use", { href: "#i-calendar" })
										}), e.release_date]
									})
								}) : null
							]
						}),
						/* @__PURE__ */ (0, $.jsxs)("div", {
							"data-jav-tags": "",
							"data-media-tags": "",
							children: [p, (e.tags || []).slice(0, 4).map((e) => /* @__PURE__ */ (0, $.jsx)("button", {
								type: "button",
								"data-media-tag": "",
								"aria-pressed": typeof a == "string" ? a === e : a.includes(e),
								onClick: () => o(a === e ? "" : e),
								children: e
							}, e))]
						})
					]
				})]
			}),
			m?.mode ? null : /* @__PURE__ */ (0, $.jsxs)("div", {
				"data-jav-actions": "",
				"data-compact": g ? "" : void 0,
				"data-has-source": e.link ? "" : void 0,
				className: "flex flex-wrap gap-2",
				children: [
					e.link ? /* @__PURE__ */ (0, $.jsx)(l, {
						"data-button-link": "",
						"data-jav-source": "",
						variant: "secondary",
						size: g ? "small" : "medium",
						iconOnly: g,
						"aria-label": Y("catalog:shared.viewOnSite"),
						title: Y("catalog:shared.viewOnSite"),
						leadingIcon: g ? ge : void 0,
						trailingIcon: g ? void 0 : ge,
						href: e.link,
						target: "_blank",
						rel: "noopener noreferrer",
						children: g ? null : Y("catalog:shared.viewOnSite")
					}) : null,
					/* @__PURE__ */ (0, $.jsx)(c, {
						variant: "ghost",
						size: g ? "small" : "medium",
						disabled: r || e.wanted || !!e.asset_id,
						...q(u),
						onClick: d,
						children: e.asset_id ? Y("catalog:javWant.imported") : e.wanted ? Y("catalog:javWant.wanted") : Y("catalog:javWant.want")
					}),
					/* @__PURE__ */ (0, $.jsx)(c, {
						variant: "secondary",
						size: g ? "small" : "medium",
						onClick: f,
						children: Y("catalog:shared.searchTorrents")
					})
				]
			})
		]
	});
}
// src/react/jav/jav-release-table.tsx
var pn = {
	widths: L,
	visibility: I
};
function mn({ studio: e }) {
	let [t, n] = (0, Q.useState)(!1);
	return e?.has_logo && !t ? /* @__PURE__ */ (0, $.jsx)("img", {
		"data-list-studio-mark": "",
		src: ut(e.name, "icon", e.logo_version),
		alt: "",
		width: 16,
		height: 16,
		loading: "lazy",
		decoding: "async",
		onError: () => n(!0)
	}) : /* @__PURE__ */ (0, $.jsx)("span", {
		"data-list-studio-mark": "",
		"aria-hidden": "true",
		children: lt(e?.name || "", 1)
	});
}
function hn({ column: e, label: t, filters: n, onChange: r }) {
	let i = e === "people" ? "performer" : e === "tags" ? "tag" : "studio", a = Nt(n, i, void 0);
	return /* @__PURE__ */ (0, $.jsx)(fe, {
		id: e,
		label: t,
		values: vt(n, i),
		load: async (t, n, r) => {
			let i = await Xe(a, e, n, r, t);
			return {
				items: i.items.map((t) => {
					let n = e === "people" ? t : null, r = n && Ue("performer", n.name, n.id);
					return {
						id: t.name,
						label: t.name,
						count: t.count,
						searchTerms: [...n?.aliases || [], ...[r?.ja, r?.zh_cn].filter((e) => !!e)],
						leading: n ? /* @__PURE__ */ (0, $.jsx)(_, { person: n }) : void 0
					};
				}),
				nextOffset: i.next_offset ?? void 0
			};
		},
		queryKey: [
			"jav-release-column",
			e,
			a.performer,
			a.studio,
			a.tag,
			a.column_filters || "",
			a.q
		],
		onChange: (e) => r(i, e)
	});
}
function gn({ items: a, waiting: o, filters: l, studios: u, facets: f, javImage: h, readOnly: g, navigate: _, onTag: v, onFilter: y, onSort: b, wanting: x, onWant: ee, onResource: S }) {
	let w = Zt(), T = Wt("jav-releases", bt, pn), E = bt.filter((e) => e.required || T.visibility[e.id] !== !1), D = Object.entries(R).find(([, e]) => e === l.sort)?.[0], te = new Map(u.map((e) => [e.name, e])), O = (e) => (t) => {
		t.preventDefault(), w?.mode || t.shiftKey || t.ctrlKey || t.metaKey ? w?.toggle(e, t.shiftKey) : _(`/works/${encodeURIComponent(e.code)}`);
	}, ne = (e, t) => {
		let n = t.performer_refs?.[0]?.name || t.performers.split(/[,，、;/]/)[0] || "";
		switch (e) {
			case "name": {
				let e = Le(t, "small", h);
				return /* @__PURE__ */ (0, $.jsxs)("div", {
					"data-list-identity": "",
					children: [/* @__PURE__ */ (0, $.jsx)("button", {
						type: "button",
						"data-list-open": "",
						tabIndex: -1,
						"aria-hidden": "true",
						onClick: O(t),
						children: /* @__PURE__ */ (0, $.jsx)("span", {
							"data-list-picture": "",
							children: e ? /* @__PURE__ */ (0, $.jsx)(s, {
								artwork: {
									kind: "cover",
									html: e
								},
								relayout: (e) => _t(e, "small")
							}) : /* @__PURE__ */ (0, $.jsx)("span", {
								title: Pe(t) || void 0,
								children: t.cover_state ? d[t.cover_state] : Y("catalog:shared.noCover")
							})
						})
					}), /* @__PURE__ */ (0, $.jsx)("span", {
						"data-list-text": "",
						children: /* @__PURE__ */ (0, $.jsxs)("button", {
							type: "button",
							"data-list-name": "",
							title: `${t.code} · ${t.title || Y("catalog:javDiscovery.titleNotFound")}`,
							"aria-label": Y("catalog:javDiscovery.viewDetails", { code: t.code }),
							onClick: O(t),
							children: [
								/* @__PURE__ */ (0, $.jsx)("b", { children: t.code }),
								" ",
								t.title ? /* @__PURE__ */ (0, $.jsx)("span", {
									lang: Lt(t.title),
									children: t.title
								}) : Y("catalog:javDiscovery.titleNotFound")
							]
						})
					})]
				});
			}
			case "people": return n ? /* @__PURE__ */ (0, $.jsxs)("div", {
				"data-list-people": "",
				children: [
					/* @__PURE__ */ (0, $.jsx)(cn, { item: t }),
					t.performer_refs?.[0]?.id ? /* @__PURE__ */ (0, $.jsx)("a", {
						"data-media-who": "",
						href: He("performer", n),
						children: /* @__PURE__ */ (0, $.jsx)("span", { children: n })
					}) : /* @__PURE__ */ (0, $.jsx)("span", {
						"data-media-who": "",
						children: /* @__PURE__ */ (0, $.jsx)("span", { children: n })
					}),
					(t.performer_refs?.length || 0) > 1 ? /* @__PURE__ */ (0, $.jsx)("span", {
						"data-media-who-more": "",
						children: Y("catalog:javDiscovery.morePeople", {
							count: t.performer_refs.length - 1,
							total: t.performer_refs.length
						})
					}) : null
				]
			}) : "—";
			case "studio": return t.studio ? /* @__PURE__ */ (0, $.jsxs)("span", {
				"data-list-library": "",
				title: t.studio,
				children: [/* @__PURE__ */ (0, $.jsx)(mn, { studio: t.studio_ref || te.get(t.studio) }), /* @__PURE__ */ (0, $.jsx)("span", { children: t.studio })]
			}) : "—";
			case "tags": return t.tags?.length ? /* @__PURE__ */ (0, $.jsx)("div", {
				"data-media-tags": "",
				"data-list-tags": "",
				children: t.tags.map((e) => /* @__PURE__ */ (0, $.jsx)("button", {
					type: "button",
					"data-media-tag": "",
					"aria-pressed": yt(l, "tag").includes(e),
					onClick: () => v(e),
					children: e
				}, e))
			}) : "—";
			case "code": return t.code;
			case "dur": return et(t.duration) || "—";
			case "score": return t.source_score == null ? "—" : `${t.source_score.toFixed(2)} / 5`;
			case "release": return t.release_date || "—";
			default: return /* @__PURE__ */ (0, $.jsxs)("div", {
				"data-release-actions": "",
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, $.jsx)(c, {
					size: "small",
					variant: "ghost",
					disabled: g || t.wanted || !!t.asset_id,
					...q(x(t)),
					onClick: () => ee(t),
					children: t.wanted ? Y("catalog:javWant.wanted") : Y("catalog:javWant.want")
				}), /* @__PURE__ */ (0, $.jsx)(c, {
					size: "small",
					variant: "secondary",
					onClick: () => S(t),
					children: Y("catalog:shared.searchTorrents")
				})]
			});
		}
	};
	return /* @__PURE__ */ (0, $.jsxs)("div", {
		"data-catalog-table": "",
		"data-release-table": "",
		className: "flex min-w-0 flex-col gap-4",
		children: [/* @__PURE__ */ (0, $.jsx)("div", {
			className: "flex flex-wrap justify-end gap-2",
			role: "toolbar",
			"aria-label": Y("catalog:javReleases.toolbar"),
			children: /* @__PURE__ */ (0, $.jsx)("div", {
				"data-toolbar-actions": "",
				children: /* @__PURE__ */ (0, $.jsx)(de, {
					preferences: T,
					label: Y("catalog:javReleases.list")
				})
			})
		}), /* @__PURE__ */ (0, $.jsx)(C, {
			follow: !0,
			preferences: T,
			children: /* @__PURE__ */ (0, $.jsxs)(G, {
				"aria-label": Y("catalog:javReleases.list"),
				size: "sm",
				sortDescriptor: D ? {
					column: D,
					direction: l.dir === "asc" ? "ascending" : "descending"
				} : void 0,
				onSortChange: (e) => {
					let t = R[String(e.column)];
					t && b(t, e.direction === "ascending" ? "asc" : "desc");
				},
				children: [/* @__PURE__ */ (0, $.jsxs)(i, { children: [
					w?.mode ? /* @__PURE__ */ (0, $.jsx)(t, {
						id: "selection",
						width: 44,
						"aria-label": Y("catalog:javReleases.selectVideos"),
						children: /* @__PURE__ */ (0, $.jsx)(p, {
							slot: null,
							"aria-label": Y("catalog:catalogList.selectAllOnPage"),
							isSelected: w.all,
							isIndeterminate: w.mixed,
							isDisabled: o || !a.length,
							onChange: w.selectPage
						})
					}) : null,
					E.map((e) => /* @__PURE__ */ (0, $.jsx)(t, {
						id: e.id,
						isRowHeader: e.id === "name",
						allowsSorting: e.id in R,
						...T.columnProps(e.id),
						children: ({ sortDirection: t }) => /* @__PURE__ */ (0, $.jsxs)($.Fragment, { children: [/* @__PURE__ */ (0, $.jsxs)("span", {
							className: "flex items-center gap-0.5",
							children: [f && y && [
								"people",
								"studio",
								"tags"
							].includes(e.id) ? /* @__PURE__ */ (0, $.jsx)(hn, {
								column: e.id,
								label: e.label,
								filters: l,
								onChange: y
							}) : e.label, e.id in R ? /* @__PURE__ */ (0, $.jsx)("span", {
								"data-sort-indicator": !0,
								"data-direction": t || void 0,
								children: /* @__PURE__ */ (0, $.jsx)(m, {})
							}) : null]
						}), /* @__PURE__ */ (0, $.jsx)(K, {
							preferences: T,
							id: e.id
						})] })
					}, e.id)),
					/* @__PURE__ */ (0, $.jsx)(t, {
						id: "remaining-space",
						"aria-label": Y("catalog:catalogList.rowSpacer"),
						"data-table-space": "",
						width: T.spaceWidth,
						minWidth: 0
					})
				] }), /* @__PURE__ */ (0, $.jsx)(e, {
					renderEmptyState: () => Y("catalog:javReleases.noMatches"),
					children: o ? Array.from({ length: 6 }, (e, t) => /* @__PURE__ */ (0, $.jsxs)(n, {
						id: `skeleton-${t}`,
						"data-list-skeleton-row": "",
						"aria-hidden": "true",
						children: [
							w?.mode ? /* @__PURE__ */ (0, $.jsx)(r, {}) : null,
							E.map((e) => /* @__PURE__ */ (0, $.jsx)(r, { children: /* @__PURE__ */ (0, $.jsx)("span", { dangerouslySetInnerHTML: { __html: Ee(e.id) } }) }, e.id)),
							/* @__PURE__ */ (0, $.jsx)(r, { "data-table-space": "" })
						]
					}, `skeleton-${t}`)) : a.map((e) => /* @__PURE__ */ (0, $.jsxs)(n, {
						id: String(e.id),
						"data-catalog-row": "",
						"data-release-row": "",
						children: [
							w?.mode ? /* @__PURE__ */ (0, $.jsx)(r, { children: /* @__PURE__ */ (0, $.jsx)(p, {
								slot: null,
								"aria-label": Y("catalog:javDiscovery.select", { code: e.code }),
								isSelected: w.selected.has(e.code),
								onChange: () => w.toggle(e)
							}) }) : null,
							E.map((t) => /* @__PURE__ */ (0, $.jsx)(r, { children: ne(t.id, e) }, t.id)),
							/* @__PURE__ */ (0, $.jsx)(r, { "data-table-space": "" })
						]
					}, e.id))
				})]
			})
		})]
	});
}
// src/react/jav/jav-releases.tsx
var _n = `<div data-catalog-tier="performers" data-skeleton="tiers">${Rt("performer")}</div><div data-catalog-tier="studios">${Rt("studio")}</div>`, vn = (e) => `<span data-tier-initial>${Ge($e(Be("performer", e.name, e.id)))}</span>${Ve({
	id: e.id,
	hasImage: e.has_image,
	version: e.image_version,
	style: Ke(e.avatar_focus),
	focus: e.avatar_focus,
	standIn: e.avatar_stand_in
})}`;
function yn({ value: e }) {
	let t = gt(e);
	return /* @__PURE__ */ (0, $.jsx)("span", {
		"data-jav-taste-score": "",
		title: Y("catalog:javScore.taste", { score: t.score }),
		children: /* @__PURE__ */ (0, $.jsx)(h, {
			color: t.color,
			children: t.label
		})
	});
}
function bn({ studio: e }) {
	let [t, n] = (0, Q.useState)(!1);
	return /* @__PURE__ */ (0, $.jsx)("span", {
		"data-tier-mark": "",
		children: e.has_logo && !t ? /* @__PURE__ */ (0, $.jsx)("img", {
			src: ut(e.name, "icon", e.logo_version),
			alt: "",
			width: 28,
			height: 28,
			loading: "lazy",
			decoding: "async",
			onError: () => n(!0)
		}) : lt(e.name, 2)
	});
}
var xn = (e) => qe(e).then((t) => (t.has_cover && je(e, t), t.has_cover));
function Sn({ readOnly: e, receipt: t, resource: n, query: r, navigate: i, clearText: a, subscription: o }) {
	Ut();
	let [s, d] = (0, Q.useState)(() => {
		let e = xt(location.search);
		return o && (e.subscription = o), e;
	});
	(0, Q.useEffect)(() => {
		r !== s.q && (d((e) => ({
			...e,
			q: r,
			page: 1
		})), Z({ page: "" }));
	}, [r, s.q]);
	let p = (e, t) => {
		let n = Nt(s, e, t);
		d(n), Z({
			[e]: "",
			column_filters: n.column_filters || "",
			page: ""
		});
	}, m = (e, t) => {
		let n = vt(s, e);
		p(e, n === void 0 ? [t] : zt(n, t, !De(n, t)));
	}, h = (0, Q.useRef)(null), g = ({ pageIndex: e, pageSize: t }) => {
		let n = e + 1;
		d((e) => ({
			...e,
			page: n,
			size: t
		})), Z({
			page: n > 1 ? String(n) : "",
			size: t === 24 ? "" : String(t)
		}), h.current?.scrollIntoView({ block: "start" });
	}, _ = () => {
		d((e) => ({
			...e,
			performer: "",
			studio: "",
			tag: "",
			column_filters: "",
			q: "",
			page: 1
		})), Z({
			performer: "",
			studio: "",
			tag: "",
			column_filters: "",
			page: ""
		}), a();
	}, b = (e) => x(e, e === s.sort ? s.dir === "asc" ? "desc" : "asc" : e === "code" ? "asc" : "desc"), x = (e, t) => {
		d((n) => ({
			...n,
			sort: e,
			dir: t,
			seed: "",
			page: 1
		})), Z({
			sort: e === "release_date" ? "" : e,
			dir: t === "asc" ? "asc" : "",
			seed: "",
			page: ""
		});
	}, ee = () => {
		let e = Math.random().toString(36).slice(2, 10);
		d((t) => ({
			...t,
			sort: "random",
			dir: "desc",
			seed: e,
			page: 1
		})), Z({
			sort: "random",
			dir: "",
			seed: e,
			page: ""
		});
	};
	(0, Q.useEffect)(() => {
		let e = [...h.current?.querySelectorAll("[data-catalog-tier],[data-catalog-tags],[data-filter-row=\"bottom\"]") || []].map((e) => qt(e, { drag: !0 }));
		return () => e.forEach((e) => e.destroy());
	}, []);
	let C = xe();
	(0, Q.useSyncExternalStore)(C.subscribe, C.version, C.version);
	let w = rt(), T = Vt(), O = Te(tt({
		active: !0,
		home: !1,
		portrait: !1
	})), k = X({
		queryKey: St(s),
		queryFn: ({ signal: e }) => Ze(s, e),
		placeholderData: st,
		retry: !1,
		refetchOnWindowFocus: !1
	}), re = k.data?.metadata_job, j = (0, Q.useRef)(!1);
	j.current = re?.status === "running";
	let M = ht.getQueryData(y)?.metadata_job, ae = X({
		queryKey: y,
		retry: !1,
		refetchOnWindowFocus: !1,
		enabled: re?.status === "running" || M?.status === "running",
		queryFn: ({ signal: e }) => Ye(e),
		refetchInterval: dt(() => j.current)
	}), N = ae.data && ae.dataUpdatedAt >= k.dataUpdatedAt ? ae.data.metadata_job : re, F = N?.status === "running", I = (0, Q.useRef)(!1);
	(0, Q.useEffect)(() => {
		I.current && !F && k.refetch(), I.current = F;
	}, [F, k]);
	let L = (0, Q.useRef)(""), R = JSON.stringify([
		s.performer,
		s.studio,
		s.tag,
		s.column_filters,
		s.q,
		s.sort,
		s.dir,
		s.seed
	]), z = !k.isPlaceholderData && (k.data?.metadata_unread || 0) > 0 && !F;
	(0, Q.useEffect)(() => {
		z && L.current !== R && (L.current = R, Ae("start", s).then(async (e) => {
			await ht.cancelQueries({ queryKey: y }), ht.setQueryData(y, e);
		}).catch(() => {}));
	}, [z, R]);
	let B = Bt(), V = (e) => {
		B.run(String(e.id), (t) => ye({ code: e.code }, t), () => {
			t(Y("catalog:javWant.added")), J(), k.refetch();
		});
	}, H = k.data;
	Qt(H?.items || []);
	let U = k.isPending, W = !!(s.performer || s.studio || s.tag || s.column_filters || s.q), G = Math.max(1, Math.ceil((H?.total || 0) / s.size));
	return (0, Q.useEffect)(() => {
		!H || k.isPlaceholderData || s.page <= G || (d((e) => ({
			...e,
			page: G
		})), Z({ page: G > 1 ? String(G) : "" }));
	}, [
		H,
		k.isPlaceholderData,
		s.page,
		G
	]), /* @__PURE__ */ (0, $.jsxs)("section", {
		ref: h,
		"aria-label": Y("catalog:entityHero.subscribeNewReleases"),
		"aria-busy": U || k.isFetching,
		className: "flex min-w-0 scroll-mt-24 flex-col gap-4",
		children: [
			U ? /* @__PURE__ */ (0, $.jsx)("div", {
				"data-catalog-tiers": "",
				"aria-busy": "true",
				dangerouslySetInnerHTML: { __html: _n }
			}) : null,
			H && (H.facets.performers.length || H.facets.studios.length) ? /* @__PURE__ */ (0, $.jsxs)("div", {
				"data-catalog-tiers": "",
				"data-release-tiers": "",
				children: [H.facets.performers.length ? /* @__PURE__ */ (0, $.jsx)("div", {
					"data-catalog-tier": "performers",
					role: "group",
					"aria-label": Y("catalog:javReleases.filterByActress"),
					children: H.facets.performers.map((e) => /* @__PURE__ */ (0, $.jsxs)("button", {
						type: "button",
						"data-tier-performer": "",
						"aria-pressed": yt(s, "performer").includes(e.name),
						title: Y("catalog:javReleases.facetCount", {
							name: Be("performer", e.name, e.id),
							count: e.count
						}),
						onClick: () => m("performer", e.name),
						children: [/* @__PURE__ */ (0, $.jsx)("span", {
							"data-tier-ring": "",
							dangerouslySetInnerHTML: { __html: vn(e) }
						}), /* @__PURE__ */ (0, $.jsx)("span", {
							"data-tier-name": "",
							children: Be("performer", e.name, e.id)
						})]
					}, e.name))
				}) : null, H.facets.studios.length ? /* @__PURE__ */ (0, $.jsx)("div", {
					"data-catalog-tier": "studios",
					role: "group",
					"aria-label": Y("catalog:javReleases.filterByLabel"),
					children: H.facets.studios.map((e) => /* @__PURE__ */ (0, $.jsxs)("button", {
						type: "button",
						"data-tier-studio": "",
						"aria-pressed": yt(s, "studio").includes(e.name),
						title: Y("catalog:javReleases.facetCount", {
							name: e.name,
							count: e.count
						}),
						onClick: () => m("studio", e.name),
						children: [
							/* @__PURE__ */ (0, $.jsx)(bn, { studio: e }),
							e.name,
							/* @__PURE__ */ (0, $.jsx)("span", {
								"data-count-badge": "",
								children: e.count
							})
						]
					}, e.name))
				}) : null]
			}) : null,
			/* @__PURE__ */ (0, $.jsx)(te, {
				label: Y("catalog:javReleases.filtersLabel"),
				topLabel: Y("catalog:javReleases.tagsLabel"),
				attrs: {
					"data-filter-frame": "",
					"data-jav-filter": "",
					"data-catalog-frame": ""
				},
				busy: U,
				topClassName: "gap-1.5 overflow-visible",
				bottomClassName: "min-h-12",
				top: /* @__PURE__ */ (0, $.jsx)("div", {
					"data-catalog-scroll": "",
					children: /* @__PURE__ */ (0, $.jsx)("div", {
						"data-catalog-tags": "",
						dangerouslySetInnerHTML: U ? { __html: it() } : void 0,
						children: U ? null : H?.facets.tags.map((e) => /* @__PURE__ */ (0, $.jsxs)(ne, {
							"data-catalog-tag": e.name,
							"data-entity-press": "",
							pressed: yt(s, "tag").includes(e.name),
							onPress: () => m("tag", e.name),
							children: [e.name, /* @__PURE__ */ (0, $.jsx)("span", {
								"data-count-badge": "",
								children: e.count
							})]
						}, e.name))
					})
				}),
				bottom: /* @__PURE__ */ (0, $.jsxs)($.Fragment, { children: [
					/* @__PURE__ */ (0, $.jsx)("span", {
						"data-catalog-readout": "",
						children: U ? /* @__PURE__ */ (0, $.jsx)("span", {
							"data-skeleton": "count",
							"aria-hidden": !0,
							className: "relative inline-block h-3.5 w-37.5 rounded-md align-middle skeleton-sheen"
						}) : W ? Y("catalog:javReleases.matchedCount", {
							matched: H?.total || 0,
							count: H?.candidate_total || 0
						}) : Y("catalog:countLabel.works", { count: H?.total || 0 })
					}),
					W ? /* @__PURE__ */ (0, $.jsx)(D, {
						onPress: _,
						children: Y("catalog:shared.clearFilters")
					}) : null,
					/* @__PURE__ */ (0, $.jsxs)("span", {
						"data-entity-sorts": "",
						children: [
							/* @__PURE__ */ (0, $.jsx)(le, {
								onPress: ee,
								busy: s.sort === "random" && k.isFetching
							}),
							T === "cards" ? /* @__PURE__ */ (0, $.jsx)(ce, {
								label: Y("catalog:entityFilter.javCardLayout"),
								value: w,
								options: ie,
								onChange: Ft
							}) : null,
							/* @__PURE__ */ (0, $.jsx)(f, {}),
							/* @__PURE__ */ (0, $.jsx)(ue, {
								group: "releases",
								sorts: se.map(([e, t, n]) => ({
									key: e,
									label: t,
									ariaLabel: n,
									pressed: e === s.sort,
									dir: s.dir
								})),
								onSort: (e) => b(e)
							})
						]
					})
				] })
			}),
			U && T === "cards" ? /* @__PURE__ */ (0, $.jsx)("div", {
				role: "status",
				"aria-label": Y("catalog:javReleases.loading"),
				dangerouslySetInnerHTML: { __html: nt("discover", w) }
			}) : null,
			k.error ? /* @__PURE__ */ (0, $.jsx)(P, {
				tone: "error",
				title: Y("catalog:javReleases.failed"),
				children: We(k.error)
			}) : null,
			F && N ? /* @__PURE__ */ (0, $.jsx)("div", {
				"data-jav-metadata": "",
				className: "min-w-0",
				children: /* @__PURE__ */ (0, $.jsx)(pe, {
					kind: ve("jav-discovery-metadata"),
					label: Y("catalog:javMetadata.loadingProgress", {
						completed: N.completed,
						count: N.total
					}),
					value: N.completed,
					total: N.total
				})
			}) : null,
			e ? null : /* @__PURE__ */ (0, $.jsx)(v, {
				scope: Y("catalog:javReleases.coverQueueScope"),
				fetchOne: xn,
				codes: (H?.items || []).filter((e) => e.cover_state === "queued" && !e.cover_url).map((e) => e.code),
				settled: (e, n) => {
					t(e === n ? Y("catalog:javReleases.coversFetched", { count: n }) : Y("catalog:javReleases.coversPartial", {
						got: e,
						count: n
					})), k.refetch();
				}
			}),
			!U && !k.error && !H?.items.length && (T === "cards" || !W) ? /* @__PURE__ */ (0, $.jsx)(E, {
				icon: u,
				title: Y(W ? "catalog:javReleases.noMatches" : "catalog:javReleases.emptyTitle"),
				actions: W ? /* @__PURE__ */ (0, $.jsx)(c, {
					size: "small",
					onClick: _,
					children: Y("catalog:shared.clearFilters")
				}) : /* @__PURE__ */ (0, $.jsx)(l, {
					size: "small",
					href: "/subscriptions?tab=add",
					children: Y("catalog:javReleases.addSubscription")
				}),
				children: Y(W ? "catalog:javReleases.clearFiltersHint" : "catalog:javReleases.emptyHint")
			}) : null,
			B.error ? /* @__PURE__ */ (0, $.jsx)(P, {
				tone: "error",
				children: B.error
			}) : null,
			T === "list" ? U || H?.items.length || W ? /* @__PURE__ */ (0, $.jsx)(gn, {
				items: H?.items || [],
				waiting: U,
				filters: s,
				studios: H?.facets.studios || [],
				javImage: C.value.javImage,
				readOnly: e,
				navigate: i,
				facets: H?.facets,
				onFilter: p,
				onTag: (e) => m("tag", e),
				onSort: x,
				wanting: (e) => B.busy === String(e.id),
				onWant: V,
				onResource: (e) => n(ln(e))
			}) : null : /* @__PURE__ */ (0, $.jsx)("div", {
				"data-media-grid": "",
				className: A,
				style: { "--card-ratio": O },
				children: (H?.items || []).map((t) => /* @__PURE__ */ (0, $.jsx)(fn, {
					item: t,
					layout: w,
					javImage: C.value.javImage,
					readOnly: e,
					navigate: i,
					tag: yt(s, "tag"),
					onTag: (e) => m("tag", e),
					wanting: B.busy === String(t.id),
					onWant: () => V(t),
					onResource: () => n(ln(t)),
					badge: s.sort === "taste" ? /* @__PURE__ */ (0, $.jsx)(yn, { value: t.taste_score }) : void 0
				}, t.id))
			}),
			H ? /* @__PURE__ */ (0, $.jsx)(S, {
				label: Y("catalog:javTabs.newReleases"),
				total: H.total,
				pagination: {
					pageIndex: s.page - 1,
					pageSize: s.size
				},
				onChange: g,
				unit: Y("catalog:catalogList.footerUnit"),
				pageUnit: Y("catalog:catalogList.footerPageUnit"),
				pageSizes: oe
			}) : null
		]
	});
}
// src/react/jav/jav-page.tsx
var Cn = Pt("x"), wn = Pt("refresh-cw"), Tn = {
	releases: Y("catalog:javSearch.filterReleases"),
	discover: Y("catalog:javSearch.filterRecommended"),
	wants: Y("catalog:javSearch.filterWants")
};
function En({ tab: e, readOnly: t, navigate: n, receipt: r }) {
	let [i, a] = (0, Q.useState)(null), [o, s] = (0, Q.useState)(() => new URLSearchParams(location.search).get("q") || ""), c = (e) => {
		s(e), Z({ q: e });
	};
	return /* @__PURE__ */ (0, $.jsx)($t, {
		readOnly: t,
		receipt: r,
		dock: e !== "wants",
		children: /* @__PURE__ */ (0, $.jsxs)("div", {
			className: "flex w-full flex-col gap-6",
			children: [
				/* @__PURE__ */ (0, $.jsx)(M, {
					tab: e,
					navigate: n,
					find: () => a({}),
					search: /* @__PURE__ */ (0, $.jsx)(k, {
						label: Tn[e] || Y("catalog:javDiscover.filter"),
						value: o,
						onQuery: c
					})
				}),
				e === "releases" ? /* @__PURE__ */ (0, $.jsx)(Sn, {
					readOnly: t,
					receipt: r,
					resource: a,
					query: o.trim(),
					navigate: n,
					clearText: () => c("")
				}) : e === "discover" ? /* @__PURE__ */ (0, $.jsx)(Dn, {
					readOnly: t,
					receipt: r,
					resource: a,
					query: o.trim(),
					navigate: n,
					clearText: () => c("")
				}) : e === "studios" ? /* @__PURE__ */ (0, $.jsx)(Sn, {
					readOnly: t,
					receipt: r,
					resource: a,
					query: o.trim(),
					navigate: n,
					clearText: () => c(""),
					subscription: "studio"
				}) : e === "actors" ? /* @__PURE__ */ (0, $.jsx)(Sn, {
					readOnly: t,
					receipt: r,
					resource: a,
					query: o.trim(),
					navigate: n,
					clearText: () => c(""),
					subscription: "performer"
				}) : /* @__PURE__ */ (0, $.jsx)(sn, {
					readOnly: t,
					toast: r,
					query: o.trim(),
					clearQuery: () => c("")
				}),
				/* @__PURE__ */ (0, $.jsx)(g, {
					prefill: i,
					close: () => a(null),
					receipt: r
				})
			]
		})
	}, e);
}
function Dn({ readOnly: e, receipt: t, resource: n, query: r, navigate: i, clearText: a }) {
	let o = new URLSearchParams(location.search), [s, u] = (0, Q.useState)(() => o.get("scope") === "library" ? "library" : "external"), [d, f] = (0, Q.useState)(() => o.get("tag") || ""), [p, m] = (0, Q.useState)(() => b.some(([e]) => e === o.get("sort")) ? o.get("sort") : "taste"), [g, _] = (0, Q.useState)(() => o.get("dir") === "asc"), v = (e) => {
		u(e), Z({ scope: e === "external" ? "" : e });
	}, x = (e) => {
		f(e), Z({ tag: e });
	}, ee = (e) => {
		m(e), Z({ sort: e === "taste" ? "" : e });
	}, S = (e) => {
		_(e), Z({ dir: e ? "asc" : "" });
	}, C = (0, Q.useRef)(null);
	(0, Q.useEffect)(() => {
		let e = [...C.current?.querySelectorAll("[data-catalog-scroll],[data-catalog-tags],[data-filter-row=\"bottom\"]") || []].map((e) => qt(e, { drag: !0 }));
		return () => e.forEach((e) => e.destroy());
	}, []);
	let T = xe();
	(0, Q.useSyncExternalStore)(T.subscribe, T.version, T.version);
	let k = rt(), re = Te(tt({
		active: !0,
		home: !1,
		portrait: !1
	})), j = g ? "asc" : "desc", M = X({
		queryKey: Re(s, p, j),
		retry: !1,
		refetchOnWindowFocus: !1,
		queryFn: ({ signal: e }) => Je(s, e, {
			sort: p,
			direction: j
		})
	}), N = M.data?.metadata_job, F = (0, Q.useRef)(!1);
	F.current = N?.status === "running";
	let I = X({
		queryKey: y,
		retry: !1,
		refetchOnWindowFocus: !1,
		enabled: s === "external",
		queryFn: ({ signal: e }) => Ye(e),
		refetchInterval: dt(() => F.current)
	}), L = I.data && I.dataUpdatedAt >= M.dataUpdatedAt ? I.data.metadata_job : N, oe = (e) => e ? `${e.job_id}:${e.status}` : "", se = (0, Q.useRef)(""), R = (0, Q.useRef)(""), z = I.data?.metadata_job;
	(0, Q.useEffect)(() => {
		let e = oe(z), t = R.current.endsWith(":running") && z && z.status !== "running";
		R.current = e, t && e !== se.current && M.refetch();
	}, [oe(z)]);
	let B = Bt(), V = Bt(), H = async (e, t) => {
		let n = await ke(e, {
			sort: p,
			direction: j,
			jobId: L?.job_id
		}, t);
		e !== "start" && await M.refetch({
			cancelRefetch: !0,
			throwOnError: !0
		}), await ht.cancelQueries({ queryKey: y }), se.current = oe(n.metadata_job), ht.setQueryData(y, n);
	}, U = (e) => {
		V.run(e, (t) => H(e === "stop" ? "cancel" : "refresh", t), () => {});
	}, le = (0, Q.useRef)(!1), W = s === "external" && L?.status !== "running" && (M.data?.items || []).some((e) => e.metadata_state === "pending" || e.metadata_state === "stale");
	(0, Q.useEffect)(() => {
		W && !le.current && (le.current = !0, H("start").catch(() => {}));
	}, [W]);
	let G = M.data?.items || [], de = [...new Set(G.flatMap((e) => e.tags || []))], fe = G.filter((e) => (!d || e.tags?.includes(d)) && (!r || [
		e.code,
		e.title,
		e.performers,
		e.studio,
		...e.tags || [],
		...(e.performer_refs || []).map((e) => e.name)
	].join(" ").toLocaleLowerCase().includes(r.toLocaleLowerCase()))), K = M.isPending;
	return Qt(fe), /* @__PURE__ */ (0, $.jsxs)("section", {
		ref: C,
		"aria-label": Y("catalog:shared.recommendedForYou"),
		"aria-busy": K,
		className: "flex min-w-0 flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, $.jsx)(te, {
				label: Y("catalog:javDiscover.filtersLabel"),
				topLabel: Y("catalog:javDiscover.scopeLabel"),
				attrs: {
					"data-filter-frame": "",
					"data-jav-filter": "",
					"data-catalog-frame": ""
				},
				busy: K,
				topClassName: "gap-1.5 overflow-visible",
				bottomClassName: "min-h-12",
				top: /* @__PURE__ */ (0, $.jsxs)("div", {
					"data-catalog-scroll": "",
					children: [/* @__PURE__ */ (0, $.jsxs)("div", {
						"data-catalog-views": "",
						children: [[["external", Y("catalog:javDiscover.external")], ["library", Y("catalog:javDiscover.library")]].map(([e, t]) => /* @__PURE__ */ (0, $.jsx)(ne, {
							"data-entity-tag": e,
							"data-entity-press": "",
							pressed: s === e,
							onPress: () => {
								v(e), x("");
							},
							children: t
						}, e)), /* @__PURE__ */ (0, $.jsx)("span", {
							"data-entity-sep": "",
							"aria-hidden": "true"
						})]
					}), /* @__PURE__ */ (0, $.jsx)("div", {
						"data-catalog-tags": "",
						dangerouslySetInnerHTML: K ? { __html: it() } : void 0,
						children: K ? null : de.map((e) => /* @__PURE__ */ (0, $.jsxs)(ne, {
							"data-catalog-tag": e,
							"data-entity-press": "",
							pressed: d === e,
							onPress: () => x(d === e ? "" : e),
							children: [e, /* @__PURE__ */ (0, $.jsx)("span", {
								"data-count-badge": "",
								children: G.filter((t) => t.tags?.includes(e)).length
							})]
						}, e))
					})]
				}),
				bottom: /* @__PURE__ */ (0, $.jsxs)($.Fragment, { children: [
					/* @__PURE__ */ (0, $.jsx)("span", {
						"data-catalog-readout": "",
						children: K ? /* @__PURE__ */ (0, $.jsx)("span", {
							"data-skeleton": "count",
							"aria-hidden": !0,
							className: "relative inline-block h-3.5 w-37.5 rounded-md align-middle skeleton-sheen"
						}) : Y("catalog:countLabel.works", { count: fe.length })
					}),
					/* @__PURE__ */ (0, $.jsx)(ae, { currentHref: () => location.pathname + location.search }),
					r || d ? /* @__PURE__ */ (0, $.jsx)(D, {
						onPress: () => {
							x(""), a();
						},
						children: Y("catalog:shared.clearFilters")
					}) : null,
					/* @__PURE__ */ (0, $.jsxs)("span", {
						"data-entity-sorts": "",
						children: [
							s === "external" ? /* @__PURE__ */ (0, $.jsx)(O, {
								"data-entity-batch": "",
								"data-jav-metadata-update": "",
								label: L?.status === "running" ? Y("catalog:javDiscover.stopUpdating") : Y("catalog:javDiscover.updateMetadata"),
								disabled: K,
								"data-skeleton-action": K ? "" : void 0,
								busy: !!V.busy,
								icon: L?.status === "running" ? Cn : wn,
								onPress: () => U(L?.status === "running" ? "stop" : "update")
							}) : null,
							/* @__PURE__ */ (0, $.jsx)(ce, {
								label: Y("catalog:entityFilter.javCardLayout"),
								value: k,
								options: ie,
								onChange: Ft
							}),
							/* @__PURE__ */ (0, $.jsx)(ue, {
								group: "discover",
								sorts: b.map(([e, t, n]) => ({
									key: e,
									label: t,
									ariaLabel: n,
									pressed: e === p,
									dir: j
								})),
								onSort: (e) => {
									e === p ? S(!g) : (ee(e), S(e === "code"));
								}
							})
						]
					})
				] })
			}),
			K ? /* @__PURE__ */ (0, $.jsx)("div", {
				role: "status",
				"aria-label": Y("catalog:javDiscover.loading"),
				dangerouslySetInnerHTML: { __html: nt("discover", k) }
			}) : null,
			M.error ? /* @__PURE__ */ (0, $.jsx)(P, {
				tone: "error",
				title: Y("catalog:javDiscover.failed"),
				children: We(M.error)
			}) : null,
			s === "external" && L?.status === "running" ? /* @__PURE__ */ (0, $.jsx)("div", {
				"data-jav-metadata": "",
				className: "min-w-0",
				children: /* @__PURE__ */ (0, $.jsx)(pe, {
					kind: ve("jav-discovery-metadata"),
					label: Y("catalog:javMetadata.loadingProgress", {
						completed: L.completed,
						count: L.total
					}),
					value: L.completed,
					total: L.total
				})
			}) : null,
			L && L.status !== "running" && (L.status !== "complete" || L.failed > 0) ? /* @__PURE__ */ (0, $.jsx)(P, {
				tone: "neutral",
				action: /* @__PURE__ */ (0, $.jsx)(c, {
					variant: "secondary",
					...q(V.busy === "retry"),
					"aria-label": Y("catalog:javMetadata.retry"),
					onClick: () => U("retry"),
					children: Y("catalog:shared.retryNow")
				}),
				children: at(L) || Y("catalog:javMetadata.progress", {
					completed: L.completed,
					count: L.total
				})
			}) : null,
			V.error ? /* @__PURE__ */ (0, $.jsx)(P, {
				tone: "error",
				children: V.error
			}) : null,
			!K && !M.error && !fe.length ? /* @__PURE__ */ (0, $.jsx)(E, {
				icon: w,
				title: Y(r || d ? "catalog:javDiscover.noMatches" : "catalog:javDiscover.noTasteMatches"),
				actions: /* @__PURE__ */ (0, $.jsxs)($.Fragment, { children: [/* @__PURE__ */ (0, $.jsx)(l, {
					size: "small",
					href: "/taste",
					variant: "secondary",
					children: Y("catalog:javDiscover.viewTaste")
				}), r || d ? /* @__PURE__ */ (0, $.jsx)(c, {
					variant: "primary",
					size: "small",
					onClick: () => {
						a(), f(""), Z({
							q: "",
							tag: ""
						});
					},
					children: Y("catalog:shared.clearFilters")
				}) : s === "library" ? /* @__PURE__ */ (0, $.jsx)(l, {
					variant: "primary",
					size: "small",
					href: "/",
					children: Y("catalog:entityPage.browseCollection")
				}) : /* @__PURE__ */ (0, $.jsx)(c, {
					variant: "primary",
					size: "small",
					onClick: () => n({}),
					children: Y("catalog:javDiscover.findVideos")
				})] }),
				children: Y(r || d ? "catalog:javDiscover.clearFiltersHint" : s === "library" ? "catalog:javDiscover.libraryEmptyHint" : "catalog:javDiscover.externalEmptyHint")
			}) : null,
			B.error ? /* @__PURE__ */ (0, $.jsx)(P, {
				tone: "error",
				children: B.error
			}) : null,
			/* @__PURE__ */ (0, $.jsx)("div", {
				"data-media-grid": "",
				className: A,
				style: { "--card-ratio": re },
				children: fe.map((r) => {
					let a = gt(r.taste_score ?? r.score), o = [
						a.label,
						Y("catalog:javScore.taste", { score: ze(r.taste_score ?? r.score) }),
						M.data?.ranking_method === "mmr" && r.ranking_score != null ? Y("catalog:javScore.ranking", { score: ze(r.ranking_score) }) : "",
						r.source_score == null ? "" : Y("catalog:javScore.siteRating", { rating: r.source_score.toFixed(1) }),
						...Mt(r.reasons, r.reason_codes, r.reason_params)
					].filter(Boolean).join(" · ");
					return /* @__PURE__ */ (0, $.jsx)(fn, {
						item: r,
						layout: k,
						javImage: T.value.javImage,
						readOnly: e,
						navigate: i,
						tag: d,
						onTag: x,
						wanting: B.busy === String(r.id),
						onWant: () => {
							B.run(String(r.id), (e) => ye({ code: r.code }, e), () => {
								t(Y("catalog:javWant.added")), J(), M.refetch();
							});
						},
						onResource: () => n(ln(r)),
						badge: /* @__PURE__ */ (0, $.jsx)("button", {
							"data-jav-taste-score": "",
							type: "button",
							title: o,
							"aria-label": Y("catalog:javScore.badgeLabel", {
								score: a.score,
								label: a.label
							}),
							className: "rounded-md outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
							children: /* @__PURE__ */ (0, $.jsx)(h, {
								color: a.color,
								children: a.label
							})
						})
					}, r.id);
				})
			})
		]
	});
}
export { En as JavPage };

//# debugId=d9dca213-2e1d-4bc3-86ee-92c6e89fc973