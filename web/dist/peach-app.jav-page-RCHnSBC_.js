(function() {
	try {
		var e = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, t = new e.Error().stack;
		t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "dc589559-2948-4f1e-ae3d-101dcc46e9bb", e._sentryDebugIdIdentifier = "sentry-dbid-dc589559-2948-4f1e-ae3d-101dcc46e9bb");
	} catch {}
})();
import { $2ec61d1d4f780267$export$a8a3e93435678ff9 as e, $76d00c5a4edb230a$export$76ccd210b9029917 as t, $76d00c5a4edb230a$export$816b5d811295e6bc as n, $76d00c5a4edb230a$export$b59bdbef9ce70de2 as r, $76d00c5a4edb230a$export$f6f0c3fe4ec306ea as i, $76d00c5a4edb230a$export$f850895b287ef28e as a, $fe21c36db05242bb$export$d7b12c4107be0d61 as o, ActivityMotion as s, ArtSlot as c, Button as l, ButtonLink as u, Bx as d, COVER_STATE_TITLE as f, CatalogViewToggle as p, Checkbox as m, ChevronSortDown as h, Chip as g, CloudDownloadDialog as _, CoverQueue as v, DISCOVERY_METADATA_KEY as y, DISCOVERY_SORTS as b, DOWNLOADS_KEY as x, DOWNLOADS_URL as S, DataTableFooter as C, DataTableFrame as w, E3 as ee, EmptyFocusButton as T, EmptyState as E, FilterGlassRows as te, FilterIconButton as D, FilterPill as ne, GlassPill as re, IndexSearch as O, Input as ie, JAV_LAYOUTS as ae, JAV_RECOMMENDATION_GRID as oe, JAV_SELECTION_EVENT as k, JavHeader as A, LibraryShortcuts as j, M6 as se, ModalFrame as ce, Note as M, P7 as N, PHASES as P, RELEASE_COLUMN_VISIBILITY_KEY as F, RELEASE_COLUMN_WIDTHS_KEY as I, RELEASE_PAGE_SIZES as le, RELEASE_SORTS as ue, RELEASE_SORT_COLUMNS as L, SEGMENT as R, SEGMENTED_TRACK as z, SegmentedRadioGroup as B, Segments as de, SelectionDock as fe, Shuffle as pe, SortKeys as me, SourceAvatar as he, Table as ge, TableColumnControls as V, TableColumnResizer as H, TaskProgress as _e, WANTS_KEY as ve, WantMagnets as ye, Wt as be, __toESM as xe, activityKind as Se, addWant as Ce, apiGet as we, appSettingsStore as Te, avatarInner as Ee, busyProps as U, cachedMagnetStates as De, cardClass as Oe, cardRatio as ke, catalogListSkeletonCellHtml as Ae, composingKey as je, controlDiscoveryMetadata as Me, controlReleaseMetadata as Ne, coverArrived as Pe, coverFetching as Fe, coverFetchingHtml as Ie, coverReason as Le, coverStateAction as Re, coverUrl as ze, discoveryArtwork as Be, discoveryKey as Ve, discoveryScore as He, entityDisplayName as W, entityFaceImg as Ue, entityPath as We, errorMessage as G, esc as Ge, facePos as Ke, fetchCoverNow as qe, fetchDiscoveries as Je, fetchDiscoveryMetadata as Ye, fetchReleases as Xe, fetchWants as Ze, firstGrapheme as Qe, fmtDur as $e, gridLayout as et, invalidateWants as K, javContentSkeleton as tt, javLayout as nt, javTagSkeleton as rt, jobText as it, joinList as at, keepPreviousData as ot, leadingGraphemes as st, logoUrl as ct, metadataInterval as lt, pageWindow as ut, qE as dt, queryClient as q, recommendationScore as ft, relayoutCovers as pt, releaseColumns as mt, releaseFilters as ht, releaseKey as gt, removeWants as _t, require_jsx_runtime as vt, require_react as yt, resetWants as bt, searchNote as xt, selectRange as St, selectionSummary as Ct, serverLabelList as wt, spriteGlyph as Tt, storeJavLayout as Et, suppressShiftTextSelection as Dt, t as J, textLang as Ot, tierPlaceholdersHtml as kt, useAction as Y, useCatalogView as At, useEntityNames as jt, useQuery as X, useTablePreferences as Mt, wantName as Nt, wireHorizontalScroller as Pt, writeJavQuery as Z } from "./peach-app.js";
import { ErrorLine as Ft } from "./peach-app.source-view--K6uWAMi.js";
// src/react/wants/want-list.tsx
var Q = /* @__PURE__ */ xe(yt(), 1), $ = vt(), It = {
	code: J("catalog:wants.originManual"),
	feed: J("catalog:entityHero.subscribeNewReleases"),
	follow: J("catalog:entityHero.following")
}, Lt = [
	["all", J("catalog:shared.all")],
	["available", J("catalog:wants.hasMagnet")],
	["missing", J("catalog:wants.noMagnet")]
], Rt = (e) => [
	e.release_date,
	e.studio,
	e.performers,
	It[e.origin]
].filter(Boolean).join(" · ");
function zt({ want: e }) {
	return /* @__PURE__ */ (0, $.jsxs)("span", {
		className: "relative inline-grid w-card-cover shrink-0 aspect-card-cover place-items-center overflow-hidden rounded-2lg bg-background-tertiary-default max-sm:w-24",
		children: [/* @__PURE__ */ (0, $.jsx)("span", {
			className: "text-caption-1-regular text-text-secondary",
			children: J("catalog:shared.noCover")
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
function Bt({ want: e, readOnly: t, busy: n, onReset: r, onRemove: i, onCloudDownload: a, downloads: o, provider: s, toast: c }) {
	let [d, f] = (0, Q.useState)(""), p = e.link || d || (e.code ? `https://javdb.com/search?q=${encodeURIComponent(e.code)}&f=all` : "");
	return /* @__PURE__ */ (0, $.jsxs)("li", {
		"data-want-id": e.id,
		className: Oe({ className: "flex flex-col gap-4 max-sm:p-4" }),
		children: [/* @__PURE__ */ (0, $.jsxs)("div", {
			className: "flex min-w-0 items-start gap-4 max-sm:gap-3",
			children: [/* @__PURE__ */ (0, $.jsx)(zt, { want: e }), /* @__PURE__ */ (0, $.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col gap-1",
				children: [
					/* @__PURE__ */ (0, $.jsxs)("p", {
						className: "flex min-w-0 flex-wrap items-baseline gap-x-2",
						children: [/* @__PURE__ */ (0, $.jsx)("b", {
							className: "min-w-0 text-headline-medium wrap-anywhere text-text-primary",
							children: Nt(e)
						}), e.code && e.title ? /* @__PURE__ */ (0, $.jsx)("span", {
							className: "min-w-0 truncate text-body-2-regular text-text-secondary",
							children: e.title
						}) : null]
					}),
					Rt(e) ? /* @__PURE__ */ (0, $.jsx)("p", {
						className: "text-body-2-regular text-text-secondary",
						children: Rt(e)
					}) : null,
					!e.code || e.phase === "unreleased" || e.phase === "acquired" ? /* @__PURE__ */ (0, $.jsx)("p", {
						"data-want-note": "",
						className: "text-caption-1-regular text-text-secondary",
						children: xt(e)
					}) : null,
					e.scrape_error ? /* @__PURE__ */ (0, $.jsx)(Ft, {
						text: e.scrape_error,
						prefix: J("catalog:wants.metadataNotFound"),
						tone: "muted"
					}) : null,
					/* @__PURE__ */ (0, $.jsxs)("div", {
						className: "mt-1 flex flex-wrap items-center gap-2",
						children: [
							p ? /* @__PURE__ */ (0, $.jsx)(u, {
								"data-button-link": "",
								variant: "secondary",
								size: "small",
								trailingIcon: be,
								href: p,
								target: "_blank",
								rel: "noopener noreferrer",
								children: J("catalog:wants.sourcePage")
							}) : null,
							/* @__PURE__ */ (0, $.jsx)(l, {
								variant: "secondary",
								size: "small",
								leadingIcon: se,
								disabled: t,
								...U(n === `remove:${e.id}`),
								onClick: i,
								children: J("catalog:shared.remove")
							}),
							e.phase === "given_up" ? /* @__PURE__ */ (0, $.jsx)(l, {
								variant: "secondary",
								size: "small",
								disabled: t,
								...U(n === `reset:${e.id}`),
								onClick: r,
								children: J("catalog:wants.searchAgain")
							}) : null,
							e.phase === "searching" || e.phase === "given_up" ? /* @__PURE__ */ (0, $.jsx)(l, {
								variant: "secondary",
								size: "small",
								onClick: a,
								children: J("catalog:shared.searchTorrents")
							}) : null
						]
					})
				]
			})]
		}), e.code && (e.phase === "searching" || e.phase === "given_up") ? /* @__PURE__ */ (0, $.jsx)(ye, {
			want: e,
			readOnly: t,
			downloads: o,
			provider: s,
			toast: c,
			onSource: f
		}) : null]
	});
}
function Vt({ phase: e, label: t, rows: n, row: r }) {
	let [i, a] = (0, Q.useState)(1), [s, c] = (0, Q.useState)(20), [u, d] = (0, Q.useState)("all"), f = De(n), p = (e) => e.has_magnets ?? f.get(e.code || "") ?? !1, m = n.filter(p), h = e !== "searching" || u === "all" ? n : n.filter((e) => p(e) === (u === "available")), g = ut(h.length, s, i);
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
				}), e === "searching" ? /* @__PURE__ */ (0, $.jsx)(B, {
					name: "want-magnet-filter",
					"aria-label": J("catalog:wants.magnetFilter"),
					orientation: "horizontal",
					value: u,
					className: z,
					onChange: (e) => {
						d(e), a(1);
					},
					children: Lt.map(([e, t]) => /* @__PURE__ */ (0, $.jsxs)(o, {
						value: e,
						"aria-label": t,
						className: R,
						children: [t, /* @__PURE__ */ (0, $.jsx)("span", {
							className: "text-caption-1-regular tabular-nums text-text-tertiary",
							children: (e === "all" ? n.length : e === "available" ? m.length : n.length - m.length).toLocaleString()
						})]
					}, e))
				}) : null]
			}),
			h.length ? null : /* @__PURE__ */ (0, $.jsx)(E, {
				size: "compact",
				icon: dt,
				title: J("catalog:wants.noFilterMatches"),
				actions: /* @__PURE__ */ (0, $.jsx)(l, {
					size: "small",
					onClick: () => {
						d("all"), a(1);
					},
					children: J("catalog:shared.viewAll")
				}),
				children: null
			}),
			/* @__PURE__ */ (0, $.jsx)("ul", {
				className: "flex flex-col gap-4",
				children: h.slice(g.start, g.end).map(r)
			}),
			/* @__PURE__ */ (0, $.jsx)("div", {
				"data-want-pager": "",
				children: /* @__PURE__ */ (0, $.jsx)(C, {
					label: t,
					total: g.total,
					pagination: {
						pageIndex: g.page - 1,
						pageSize: s
					},
					onChange: (e) => {
						c(e.pageSize), a(e.pageIndex + 1);
					},
					unit: J("catalog:wants.itemUnit")
				})
			})
		]
	});
}
function Ht({ readOnly: e, toast: t, query: n = "", clearQuery: r }) {
	let [i, a] = (0, Q.useState)(""), [o, s] = (0, Q.useState)(null), c = Y(), u = X({
		queryKey: ve,
		queryFn: ({ signal: e }) => Ze(e),
		staleTime: 3e4,
		refetchInterval: (e) => e.state.data?.scraping ? 3e3 : !1
	}), d = () => {
		let n = i.trim();
		n && !e && c.run("add", (e) => Ce({ code: n }, e), (e) => {
			t(e.created ? J("catalog:wants.added", { name: Nt(e.want) }) : J("catalog:wants.alreadyAdded", { name: Nt(e.want) })), a(""), K();
		});
	}, f = (e) => {
		e.key === "Enter" && !je(e.nativeEvent) && (e.preventDefault(), d());
	}, p = (e) => {
		c.run(`remove:${e.id}`, (t) => _t([e.id], t), () => {
			t(J("catalog:wants.removed", { name: Nt(e) })), K();
		});
	}, m = (e) => {
		c.run(`reset:${e.id}`, (t) => bt([e.id], t), () => {
			t(J("catalog:wants.backToSearching", { name: Nt(e) })), K();
		});
	}, h = u.data, g = (h?.items || []).filter((e) => !n || [
		e.code,
		e.title,
		e.performers
	].join(" ").toLocaleLowerCase().includes(n.toLocaleLowerCase())), v = X({
		queryKey: x,
		queryFn: ({ signal: e }) => we(`${S}?limit=100`, e),
		enabled: g.some((e) => e.code && (e.phase === "searching" || e.phase === "given_up"))
	}), y = v.data?.providers.filter((e) => e.configured) || [], b = y[0]?.key || "";
	return /* @__PURE__ */ (0, $.jsxs)("div", {
		"aria-busy": u.isPending,
		className: "flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, $.jsxs)("div", {
				className: Oe({
					padding: "none",
					className: "flex flex-col gap-4 px-6 py-5 max-sm:px-4"
				}),
				children: [
					/* @__PURE__ */ (0, $.jsx)("h3", {
						className: "text-title-2-medium text-text-primary",
						children: J("catalog:wants.addByCode")
					}),
					/* @__PURE__ */ (0, $.jsxs)("div", {
						className: "flex flex-wrap items-end gap-2",
						children: [/* @__PURE__ */ (0, $.jsx)("div", {
							className: "min-w-64 grow max-sm:min-w-0",
							children: /* @__PURE__ */ (0, $.jsx)(ie, {
								"aria-label": J("catalog:shared.code"),
								placeholder: J("catalog:wants.codePlaceholder"),
								value: i,
								isDisabled: e,
								onChange: a,
								onKeyDown: f
							})
						}), /* @__PURE__ */ (0, $.jsx)(l, {
							variant: "primary",
							disabled: e || !i.trim(),
							...U(c.busy === "add"),
							onClick: d,
							children: J("catalog:shared.add")
						})]
					}),
					c.error ? /* @__PURE__ */ (0, $.jsx)(M, {
						tone: "error",
						title: J("catalog:wants.actionFailed"),
						children: c.error
					}) : null
				]
			}),
			u.error ? /* @__PURE__ */ (0, $.jsx)(M, {
				tone: "error",
				title: J("catalog:wants.loadFailed"),
				children: G(u.error)
			}) : null,
			u.isPending ? /* @__PURE__ */ (0, $.jsx)("div", {
				role: "status",
				"aria-label": J("catalog:wants.loading"),
				dangerouslySetInnerHTML: { __html: tt("wants") }
			}) : null,
			h?.scraping ? /* @__PURE__ */ (0, $.jsx)(_e, {
				embedded: !0,
				kind: Se("want-scrape"),
				label: J("catalog:wants.fetchingNew")
			}) : null,
			v.error ? /* @__PURE__ */ (0, $.jsx)(M, {
				tone: "error",
				title: J("catalog:wants.downloadSettingsFailed"),
				children: G(v.error)
			}) : null,
			v.data && !y.length ? /* @__PURE__ */ (0, $.jsxs)(M, {
				tone: "neutral",
				children: [
					J("shell:downloadChannels.notConfigured"),
					J("shell:format.sentenceGap"),
					/* @__PURE__ */ (0, $.jsx)("a", {
						href: "/settings/downloads",
						children: J("shell:downloadChannels.settingsLink")
					})
				]
			}) : null,
			v.data && !v.data.available ? /* @__PURE__ */ (0, $.jsx)(M, {
				tone: "neutral",
				children: J("catalog:wants.cloudPrimaryOnly")
			}) : null,
			h && !g.length ? /* @__PURE__ */ (0, $.jsx)(E, {
				size: "compact",
				icon: dt,
				title: J(n ? "catalog:wants.noSearchMatches" : "catalog:wants.empty"),
				actions: n && r ? /* @__PURE__ */ (0, $.jsx)(l, {
					size: "small",
					onClick: r,
					children: J("catalog:shared.clearSearch")
				}) : !n && !e ? /* @__PURE__ */ (0, $.jsx)(T, {
					target: `input[aria-label="${J("catalog:shared.code")}"]`,
					children: J("catalog:wants.addWork")
				}) : void 0,
				children: J(n ? "catalog:wants.tryOtherSearch" : "catalog:wants.emptyHint")
			}) : null,
			P.map(([n, r]) => {
				let i = g.filter((e) => e.phase === n);
				return i.length ? /* @__PURE__ */ (0, $.jsx)(Vt, {
					phase: n,
					label: r,
					rows: i,
					row: (n) => /* @__PURE__ */ (0, $.jsx)(Bt, {
						want: n,
						readOnly: e,
						busy: c.busy,
						downloads: v.data,
						provider: b,
						toast: t,
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
			/* @__PURE__ */ (0, $.jsx)(_, {
				prefill: o,
				close: () => s(null),
				receipt: t,
				provider: b
			})
		]
	});
}
// src/react/jav/jav-batch-resources.tsx
function Ut({ items: t, close: n, readOnly: r, receipt: i }) {
	let a = X({
		queryKey: x,
		queryFn: ({ signal: e }) => we(`${S}?limit=50`, e),
		enabled: !!t
	}), o = a.data?.providers.find((e) => e.configured)?.key || "";
	return /* @__PURE__ */ (0, $.jsxs)(ce, {
		isOpen: !!t,
		onOpenChange: (e) => {
			e || n();
		},
		width: "collections",
		children: [/* @__PURE__ */ (0, $.jsxs)("div", {
			className: "sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-separator-border bg-background-full px-5 py-4",
			children: [/* @__PURE__ */ (0, $.jsxs)(e, {
				slot: "title",
				className: "text-title-2-medium text-text-primary",
				children: [
					/* @__PURE__ */ (0, $.jsx)("span", {
						"data-copy-key": "jav.resources.title",
						children: J("catalog:javBatch.title")
					}),
					" · ",
					J("catalog:countLabel.works", { count: t?.length || 0 })
				]
			}), /* @__PURE__ */ (0, $.jsx)(l, {
				iconOnly: !0,
				variant: "ghost",
				leadingIcon: N,
				"aria-label": J("catalog:javBatch.close"),
				onClick: n
			})]
		}), /* @__PURE__ */ (0, $.jsxs)("div", {
			className: "flex min-w-0 flex-col gap-6 p-5",
			children: [a.error ? /* @__PURE__ */ (0, $.jsx)(M, {
				tone: "error",
				children: J("catalog:javBatch.downloadSettingsFailed", { error: G(a.error) })
			}) : null, t?.map((e) => /* @__PURE__ */ (0, $.jsxs)("section", {
				"aria-label": e.code,
				className: "flex min-w-0 flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, $.jsx)("h3", {
						className: "text-headline-medium text-text-primary",
						children: e.code
					}),
					e.title ? /* @__PURE__ */ (0, $.jsx)("p", {
						className: "text-body-2-regular text-text-secondary",
						children: e.title
					}) : null,
					/* @__PURE__ */ (0, $.jsx)(ye, {
						want: {
							id: e.id,
							code: e.code,
							title: e.title,
							release_date: e.release_date || null
						},
						queryUrl: `/api/jav/resources?code=${encodeURIComponent(e.code)}`,
						eager: !0,
						readOnly: r,
						downloads: a.data,
						provider: o,
						toast: i
					})
				]
			}, e.code))]
		})]
	});
}
// src/react/jav/jav-selection.tsx
function Wt(e) {
	let t = new MutationObserver(e);
	return t.observe(document.body, {
		attributes: !0,
		attributeFilter: ["data-density"]
	}), () => t.disconnect();
}
var Gt = () => document.body.dataset.density === "dense", Kt = (0, Q.createContext)(null), qt = () => (0, Q.useContext)(Kt);
function Jt(e) {
	let t = qt()?.visible;
	(0, Q.useEffect)(() => {
		t?.(e);
	}, [e, t]);
}
function Yt({ children: e, readOnly: t, receipt: n }) {
	let r = (0, Q.useSyncExternalStore)(Wt, Gt, () => !1), [i, a] = (0, Q.useState)(!1), [o, s] = (0, Q.useState)(/* @__PURE__ */ new Map()), [c, u] = (0, Q.useState)([]), [d, f] = (0, Q.useState)(null), p = (0, Q.useRef)(null), m = Y(), h = new Set(o.keys()), g = Ct(h, c.map((e) => e.code)), _ = (0, Q.useCallback)((e) => {
		u((t) => t.length === e.length && t.every((t, n) => t === e[n]) ? t : e), s((t) => {
			let n = e.filter((e) => t.has(e.code) && t.get(e.code) !== e);
			return n.length ? new Map([...t, ...n.map((e) => [e.code, e])]) : t;
		});
	}, []), v = m.cancel, y = (0, Q.useCallback)(() => {
		v(), a(!1), s(/* @__PURE__ */ new Map()), p.current = null;
	}, [v]), b = () => s((e) => {
		let t = new Map(e);
		return c.forEach((e) => g.all ? t.delete(e.code) : t.set(e.code, e)), t;
	});
	(0, Q.useEffect)(() => {
		let e = () => {
			i ? y() : a(!0);
		};
		return window.addEventListener(k, e), () => window.removeEventListener(k, e);
	}, [i, y]), (0, Q.useEffect)(() => (i || (s(/* @__PURE__ */ new Map()), p.current = null), document.getElementById("selectMode")?.setAttribute("aria-pressed", String(i)), () => document.getElementById("selectMode")?.setAttribute("aria-pressed", "false")), [i]), (0, Q.useEffect)(() => {
		if (!i) return;
		let e = (e) => {
			e.target.closest("input,textarea,[contenteditable]:not([contenteditable=\"false\"]),[role=\"dialog\"]") || (e.key === "Escape" && (e.preventDefault(), y()), (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a" && (e.preventDefault(), s((e) => new Map([...e, ...c.map((e) => [e.code, e])]))));
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [
		i,
		y,
		c
	]);
	let x = (e, t = !1) => {
		a(!0);
		let n = p.current;
		p.current = e.code, s((r) => {
			let i = new Set(r.keys());
			St(i, c.map((e) => e.code), n, e.code, t);
			let a = new Map([
				...r,
				...c.map((e) => [e.code, e]),
				[e.code, e]
			]);
			return new Map([...i].map((e) => [e, a.get(e)]));
		});
	}, S = [...o.values()].filter((e) => !e.wanted && !e.asset_id), C = () => {
		m.run("want", async (e) => {
			let t = 0;
			try {
				for (let n of S) {
					e.throwIfAborted();
					try {
						await Ce({ code: n.code }, e);
					} catch (e) {
						throw Error(J("catalog:javSelection.wantPartialFailed", {
							count: t,
							code: n.code,
							error: G(e)
						}));
					}
					e.throwIfAborted(), t++, s((e) => {
						let t = new Map(e);
						return t.delete(n.code), t;
					});
				}
				return t;
			} finally {
				K();
			}
		}, (e) => n(J("catalog:javSelection.wantAdded", { count: e })));
	};
	return /* @__PURE__ */ (0, $.jsxs)(Kt.Provider, {
		value: {
			dense: r,
			mode: i,
			selected: h,
			toggle: x,
			visible: _,
			selectPage: b,
			all: g.all,
			mixed: g.mixed
		},
		children: [
			/* @__PURE__ */ (0, $.jsx)("div", {
				"data-jav-selection": "",
				"data-select-mode": i ? "" : void 0,
				className: "flex min-w-0 flex-col gap-4",
				children: e
			}),
			/* @__PURE__ */ (0, $.jsxs)(fe, {
				visible: i,
				count: J("catalog:javSelection.selectedCount", { count: o.size }),
				label: J("catalog:javSelection.dockLabel"),
				children: [
					m.error ? /* @__PURE__ */ (0, $.jsx)("p", {
						role: "alert",
						className: "w-full px-2 text-caption-1-regular text-text-error-primary",
						children: m.error
					}) : null,
					/* @__PURE__ */ (0, $.jsx)(l, {
						size: "small",
						variant: "secondary",
						disabled: !c.length || !!m.busy,
						onClick: b,
						children: /* @__PURE__ */ (0, $.jsx)("span", {
							"data-copy-key": `jav.selection.page.${g.all ? "clear" : "all"}`,
							children: g.all ? J("catalog:javSelection.deselectPage") : J("catalog:javSelection.selectPage")
						})
					}),
					/* @__PURE__ */ (0, $.jsx)(l, {
						size: "small",
						variant: "secondary",
						disabled: t || !S.length,
						...U(m.busy === "want"),
						onClick: C,
						children: J("catalog:javSelection.addToWants")
					}),
					/* @__PURE__ */ (0, $.jsx)(l, {
						size: "small",
						variant: "secondary",
						disabled: !o.size || !!m.busy,
						onClick: () => f([...o.values()]),
						children: J("catalog:shared.searchTorrents")
					}),
					/* @__PURE__ */ (0, $.jsx)(l, {
						size: "small",
						variant: "ghost",
						onClick: y,
						children: J("catalog:javSelection.exit")
					})
				]
			}),
			/* @__PURE__ */ (0, $.jsx)(Ut, {
				items: d,
				close: () => f(null),
				readOnly: t,
				receipt: n
			})
		]
	});
}
// src/react/jav/discovery-faces.tsx
function Xt({ item: e }) {
	jt();
	let t = e.performer_refs?.length ? e.performer_refs : [...new Set(e.performers.split(/[,，、;/]/).filter(Boolean))].map((e) => ({ name: e })), n = t.slice(0, 5).map((t, n) => {
		let r = { "--media-avatar-index": n }, i = t.source_avatar && t.source_actor_id && !t.has_image ? { children: /* @__PURE__ */ (0, $.jsx)(he, {
			code: e.code,
			person: t
		}) } : { dangerouslySetInnerHTML: { __html: Ee(t.name, t, null) } };
		return t.id ? /* @__PURE__ */ (0, $.jsx)("a", {
			"data-media-avatar": "",
			style: r,
			href: We("performer", t.name, t.id),
			"aria-label": J("catalog:javDiscovery.openActress", { name: W("performer", t.name, t.id) }),
			...i
		}, t.name) : /* @__PURE__ */ (0, $.jsx)("span", {
			"data-media-avatar": "",
			style: r,
			title: W("performer", t.name),
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
var Zt = (e) => ({
	...e,
	cover: e.has_cover ? ze(e, !0) : e.cover_url,
	origin: `${e.asset_id ? "asset" : "feed"}:${e.id}`
}), Qt = "relative inline-grid place-items-center overflow-hidden rounded-2lg bg-background-tertiary-default";
function $t({ item: e, readOnly: t }) {
	let n = Y(), [r, i] = (0, Q.useState)("");
	(0, Q.useSyncExternalStore)(Fe.subscribe, Fe.revision);
	let a = e.cover_state;
	if (!a) return /* @__PURE__ */ (0, $.jsx)("span", {
		"data-media-nopic": "",
		children: J("catalog:shared.noCover")
	});
	if (a === "fetching" || Fe.has(e.code)) return /* @__PURE__ */ (0, $.jsx)("span", { dangerouslySetInnerHTML: { __html: Ie() } });
	let o = () => {
		n.run("cover", (t) => qe(e.code, t), (t) => {
			t.has_cover ? Pe(e.code, t) : i(t.message || J("catalog:javDiscovery.noOfficialCover"));
		});
	}, c = r || n.error ? "missing" : a, u = n.error || r || Le(e);
	return /* @__PURE__ */ (0, $.jsxs)("div", {
		"data-cover-state": c,
		className: "flex max-w-full flex-col items-center gap-1.5 px-4 text-center",
		children: [
			c === "queued" ? /* @__PURE__ */ (0, $.jsx)(s, {
				kind: "clock",
				size: "card",
				still: !0
			}) : null,
			/* @__PURE__ */ (0, $.jsx)("span", {
				"data-media-nopic": "",
				children: f[c]
			}),
			u ? /* @__PURE__ */ (0, $.jsx)("span", {
				className: "line-clamp-3 text-caption-1-regular text-text-secondary",
				title: u,
				children: u
			}) : null,
			t ? null : /* @__PURE__ */ (0, $.jsx)(l, {
				size: "small",
				variant: "secondary",
				className: "mt-1",
				onClick: o,
				children: Re(c)
			})
		]
	});
}
function en({ item: e, layout: t, javImage: n, readOnly: r, navigate: i, tag: a, onTag: o, wanting: s, onWant: d, onResource: f, badge: p }) {
	let m = qt(), h = m?.selected.has(e.code), g = !!m?.dense, _ = e.performer_refs?.length ? at(e.performer_refs.map((e) => e.name)) : e.performers, v = Be(e, t, n), y = e.asset_id ? `/assets/${e.asset_id}` : `/works/${encodeURIComponent(e.code)}`;
	return /* @__PURE__ */ (0, $.jsxs)("article", {
		"data-media-card": "",
		"data-jav-card": "",
		"data-selected": h ? "" : void 0,
		onMouseDown: Dt,
		onClickCapture: (t) => {
			m && (m.mode || t.shiftKey || t.ctrlKey || t.metaKey) && (t.preventDefault(), t.stopPropagation(), m.toggle(e, t.shiftKey));
		},
		onClick: (e) => {
			e.target.closest("a,button,input") || i(y);
		},
		children: [
			v ? /* @__PURE__ */ (0, $.jsx)("a", {
				href: y,
				"aria-label": J("catalog:javDiscovery.viewDetails", { code: e.code }),
				onClick: (e) => {
					e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0 || (e.preventDefault(), i(y));
				},
				"data-media-pic": "",
				"data-jav-cover-box": "",
				className: Qt,
				children: /* @__PURE__ */ (0, $.jsx)(c, {
					artwork: {
						kind: "cover",
						html: v
					},
					identity: Be(e, "small", n),
					relayout: (e) => pt(e, t)
				})
			}) : /* @__PURE__ */ (0, $.jsx)("div", {
				"data-media-pic": "",
				"data-jav-cover-box": "",
				className: Qt,
				children: /* @__PURE__ */ (0, $.jsx)($t, {
					item: e,
					readOnly: r
				})
			}),
			m?.mode ? /* @__PURE__ */ (0, $.jsx)("button", {
				type: "button",
				"data-media-check": "",
				"aria-label": J("catalog:javDiscovery.select", { code: e.code }),
				"aria-pressed": !!h,
				children: /* @__PURE__ */ (0, $.jsx)("svg", {
					viewBox: "0 0 24 24",
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, $.jsx)("use", { href: "#i-check" })
				})
			}) : null,
			/* @__PURE__ */ (0, $.jsxs)("div", {
				"data-media-meta": "",
				children: [/* @__PURE__ */ (0, $.jsx)(Xt, { item: e }), /* @__PURE__ */ (0, $.jsxs)("div", {
					"data-media-text": "",
					children: [
						/* @__PURE__ */ (0, $.jsxs)("h3", {
							"data-jav-title": "",
							"data-media-title": "",
							title: `${e.code} · ${e.title || J("catalog:javDiscovery.titleNotFound")}`,
							children: [
								/* @__PURE__ */ (0, $.jsx)("b", { children: e.code }),
								" ",
								e.title ? /* @__PURE__ */ (0, $.jsx)("span", {
									lang: Ot(e.title),
									children: e.title
								}) : J("catalog:javDiscovery.titleNotFound")
							]
						}),
						/* @__PURE__ */ (0, $.jsxs)("div", {
							"data-media-byline": "",
							children: [
								e.performer_refs?.[0]?.id ? /* @__PURE__ */ (0, $.jsxs)("a", {
									"data-media-who": "",
									href: We("performer", e.performer_refs[0].name),
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
									children: J("catalog:javDiscovery.morePeople", {
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
								"aria-pressed": a === e,
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
					e.link ? /* @__PURE__ */ (0, $.jsx)(u, {
						"data-button-link": "",
						"data-jav-source": "",
						variant: "secondary",
						size: g ? "small" : "medium",
						iconOnly: g,
						"aria-label": J("catalog:shared.viewOnSite"),
						title: J("catalog:shared.viewOnSite"),
						leadingIcon: g ? be : void 0,
						trailingIcon: g ? void 0 : be,
						href: e.link,
						target: "_blank",
						rel: "noopener noreferrer",
						children: g ? null : J("catalog:shared.viewOnSite")
					}) : null,
					/* @__PURE__ */ (0, $.jsx)(l, {
						variant: "ghost",
						size: g ? "small" : "medium",
						disabled: r || e.wanted || !!e.asset_id,
						...U(s),
						onClick: d,
						children: e.asset_id ? J("catalog:javWant.imported") : e.wanted ? J("catalog:javWant.wanted") : J("catalog:javWant.want")
					}),
					/* @__PURE__ */ (0, $.jsx)(l, {
						variant: "secondary",
						size: g ? "small" : "medium",
						onClick: f,
						children: J("catalog:shared.searchTorrents")
					})
				]
			})
		]
	});
}
// src/react/jav/jav-release-table.tsx
var tn = {
	widths: I,
	visibility: F
};
function nn({ studio: e }) {
	let [t, n] = (0, Q.useState)(!1);
	return e?.has_logo && !t ? /* @__PURE__ */ (0, $.jsx)("img", {
		"data-list-studio-mark": "",
		src: ct(e.name, "icon", e.logo_version),
		alt: "",
		width: 16,
		height: 16,
		loading: "lazy",
		decoding: "async",
		onError: () => n(!0)
	}) : /* @__PURE__ */ (0, $.jsx)("span", {
		"data-list-studio-mark": "",
		"aria-hidden": "true",
		children: st(e?.name || "", 1)
	});
}
function rn({ items: e, waiting: o, filters: s, studios: u, javImage: d, readOnly: p, navigate: g, onTag: _, onSort: v, wanting: y, onWant: b, onResource: x }) {
	let S = qt(), C = Mt("jav-releases", mt, tn), ee = mt.filter((e) => e.required || C.visibility[e.id] !== !1), T = Object.entries(L).find(([, e]) => e === s.sort)?.[0], E = new Map(u.map((e) => [e.name, e])), te = (e) => (t) => {
		t.preventDefault(), S?.mode || t.shiftKey || t.ctrlKey || t.metaKey ? S?.toggle(e, t.shiftKey) : g(`/works/${encodeURIComponent(e.code)}`);
	}, D = (e, t) => {
		let n = t.performer_refs?.[0]?.name || t.performers.split(/[,，、;/]/)[0] || "";
		switch (e) {
			case "name": {
				let e = Be(t, "small", d);
				return /* @__PURE__ */ (0, $.jsxs)("div", {
					"data-list-identity": "",
					children: [/* @__PURE__ */ (0, $.jsx)("button", {
						type: "button",
						"data-list-open": "",
						tabIndex: -1,
						"aria-hidden": "true",
						onClick: te(t),
						children: /* @__PURE__ */ (0, $.jsx)("span", {
							"data-list-picture": "",
							children: e ? /* @__PURE__ */ (0, $.jsx)(c, {
								artwork: {
									kind: "cover",
									html: e
								},
								relayout: (e) => pt(e, "small")
							}) : /* @__PURE__ */ (0, $.jsx)("span", {
								title: Le(t) || void 0,
								children: t.cover_state ? f[t.cover_state] : J("catalog:shared.noCover")
							})
						})
					}), /* @__PURE__ */ (0, $.jsx)("span", {
						"data-list-text": "",
						children: /* @__PURE__ */ (0, $.jsxs)("button", {
							type: "button",
							"data-list-name": "",
							title: `${t.code} · ${t.title || J("catalog:javDiscovery.titleNotFound")}`,
							"aria-label": J("catalog:javDiscovery.viewDetails", { code: t.code }),
							onClick: te(t),
							children: [
								/* @__PURE__ */ (0, $.jsx)("b", { children: t.code }),
								" ",
								t.title ? /* @__PURE__ */ (0, $.jsx)("span", {
									lang: Ot(t.title),
									children: t.title
								}) : J("catalog:javDiscovery.titleNotFound")
							]
						})
					})]
				});
			}
			case "people": return n ? /* @__PURE__ */ (0, $.jsxs)("div", {
				"data-list-people": "",
				children: [
					/* @__PURE__ */ (0, $.jsx)(Xt, { item: t }),
					t.performer_refs?.[0]?.id ? /* @__PURE__ */ (0, $.jsx)("a", {
						"data-media-who": "",
						href: We("performer", n),
						children: /* @__PURE__ */ (0, $.jsx)("span", { children: n })
					}) : /* @__PURE__ */ (0, $.jsx)("span", {
						"data-media-who": "",
						children: /* @__PURE__ */ (0, $.jsx)("span", { children: n })
					}),
					(t.performer_refs?.length || 0) > 1 ? /* @__PURE__ */ (0, $.jsx)("span", {
						"data-media-who-more": "",
						children: J("catalog:javDiscovery.morePeople", {
							count: t.performer_refs.length - 1,
							total: t.performer_refs.length
						})
					}) : null
				]
			}) : "—";
			case "studio": return t.studio ? /* @__PURE__ */ (0, $.jsxs)("span", {
				"data-list-library": "",
				title: t.studio,
				children: [/* @__PURE__ */ (0, $.jsx)(nn, { studio: E.get(t.studio) }), /* @__PURE__ */ (0, $.jsx)("span", { children: t.studio })]
			}) : "—";
			case "tags": return t.tags?.length ? /* @__PURE__ */ (0, $.jsx)("div", {
				"data-media-tags": "",
				"data-list-tags": "",
				children: t.tags.map((e) => /* @__PURE__ */ (0, $.jsx)("button", {
					type: "button",
					"data-media-tag": "",
					"aria-pressed": s.tag === e,
					onClick: () => _(s.tag === e ? "" : e),
					children: e
				}, e))
			}) : "—";
			case "code": return t.code;
			case "dur": return $e(t.duration) || "—";
			case "score": return t.source_score == null ? "—" : `${t.source_score.toFixed(2)} / 5`;
			case "release": return t.release_date || "—";
			default: return /* @__PURE__ */ (0, $.jsxs)("div", {
				"data-release-actions": "",
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, $.jsx)(l, {
					size: "small",
					variant: "ghost",
					disabled: p || t.wanted || !!t.asset_id,
					...U(y(t)),
					onClick: () => b(t),
					children: t.wanted ? J("catalog:javWant.wanted") : J("catalog:javWant.want")
				}), /* @__PURE__ */ (0, $.jsx)(l, {
					size: "small",
					variant: "secondary",
					onClick: () => x(t),
					children: J("catalog:shared.searchTorrents")
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
			"aria-label": J("catalog:javReleases.toolbar"),
			children: /* @__PURE__ */ (0, $.jsx)("div", {
				"data-toolbar-actions": "",
				children: /* @__PURE__ */ (0, $.jsx)(V, {
					preferences: C,
					label: J("catalog:javReleases.list")
				})
			})
		}), /* @__PURE__ */ (0, $.jsx)(w, {
			follow: !0,
			preferences: C,
			children: /* @__PURE__ */ (0, $.jsxs)(ge, {
				"aria-label": J("catalog:javReleases.list"),
				size: "sm",
				sortDescriptor: T ? {
					column: T,
					direction: s.dir === "asc" ? "ascending" : "descending"
				} : void 0,
				onSortChange: (e) => {
					let t = L[String(e.column)];
					t && v(t, e.direction === "ascending" ? "asc" : "desc");
				},
				children: [/* @__PURE__ */ (0, $.jsxs)(a, { children: [
					S?.mode ? /* @__PURE__ */ (0, $.jsx)(n, {
						id: "selection",
						width: 44,
						"aria-label": J("catalog:javReleases.selectVideos"),
						children: /* @__PURE__ */ (0, $.jsx)(m, {
							slot: null,
							"aria-label": J("catalog:catalogList.selectAllOnPage"),
							isSelected: S.all,
							isIndeterminate: S.mixed,
							isDisabled: o || !e.length,
							onChange: S.selectPage
						})
					}) : null,
					ee.map((e) => /* @__PURE__ */ (0, $.jsx)(n, {
						id: e.id,
						isRowHeader: e.id === "name",
						allowsSorting: e.id in L,
						...C.columnProps(e.id),
						children: ({ sortDirection: t }) => /* @__PURE__ */ (0, $.jsxs)($.Fragment, { children: [/* @__PURE__ */ (0, $.jsxs)("span", {
							className: "flex items-center gap-0.5",
							children: [e.label, e.id in L ? /* @__PURE__ */ (0, $.jsx)("span", {
								"data-sort-indicator": !0,
								"data-direction": t || void 0,
								children: /* @__PURE__ */ (0, $.jsx)(h, {})
							}) : null]
						}), /* @__PURE__ */ (0, $.jsx)(H, {
							preferences: C,
							id: e.id
						})] })
					}, e.id)),
					/* @__PURE__ */ (0, $.jsx)(n, {
						id: "remaining-space",
						"aria-label": J("catalog:catalogList.rowSpacer"),
						"data-table-space": "",
						width: C.spaceWidth,
						minWidth: 0
					})
				] }), /* @__PURE__ */ (0, $.jsx)(t, {
					renderEmptyState: () => J("catalog:javReleases.noMatches"),
					children: o ? Array.from({ length: 6 }, (e, t) => /* @__PURE__ */ (0, $.jsxs)(r, {
						id: `skeleton-${t}`,
						"data-list-skeleton-row": "",
						"aria-hidden": "true",
						children: [
							S?.mode ? /* @__PURE__ */ (0, $.jsx)(i, {}) : null,
							ee.map((e) => /* @__PURE__ */ (0, $.jsx)(i, { children: /* @__PURE__ */ (0, $.jsx)("span", { dangerouslySetInnerHTML: { __html: Ae(e.id) } }) }, e.id)),
							/* @__PURE__ */ (0, $.jsx)(i, { "data-table-space": "" })
						]
					}, `skeleton-${t}`)) : e.map((e) => /* @__PURE__ */ (0, $.jsxs)(r, {
						id: String(e.id),
						"data-catalog-row": "",
						"data-release-row": "",
						children: [
							S?.mode ? /* @__PURE__ */ (0, $.jsx)(i, { children: /* @__PURE__ */ (0, $.jsx)(m, {
								slot: null,
								"aria-label": J("catalog:javDiscovery.select", { code: e.code }),
								isSelected: S.selected.has(e.code),
								onChange: () => S.toggle(e)
							}) }) : null,
							ee.map((t) => /* @__PURE__ */ (0, $.jsx)(i, { children: D(t.id, e) }, t.id)),
							/* @__PURE__ */ (0, $.jsx)(i, { "data-table-space": "" })
						]
					}, e.id))
				})]
			})
		})]
	});
}
// src/react/jav/jav-releases.tsx
var an = `<div data-catalog-tier="performers" data-skeleton="tiers">${kt("performer")}</div><div data-catalog-tier="studios">${kt("studio")}</div>`, on = (e) => `<span data-tier-initial>${Ge(Qe(W("performer", e.name, e.id)))}</span>${Ue({
	id: e.id,
	hasImage: e.has_image,
	version: e.image_version,
	style: Ke(e.avatar_focus),
	focus: e.avatar_focus,
	standIn: e.avatar_stand_in
})}`;
function sn({ value: e }) {
	let t = ft(e);
	return /* @__PURE__ */ (0, $.jsx)("span", {
		"data-jav-taste-score": "",
		title: J("catalog:javScore.taste", { score: t.score }),
		children: /* @__PURE__ */ (0, $.jsx)(g, {
			color: t.color,
			children: t.label
		})
	});
}
function cn({ studio: e }) {
	let [t, n] = (0, Q.useState)(!1);
	return /* @__PURE__ */ (0, $.jsx)("span", {
		"data-tier-mark": "",
		children: e.has_logo && !t ? /* @__PURE__ */ (0, $.jsx)("img", {
			src: ct(e.name, "icon", e.logo_version),
			alt: "",
			width: 28,
			height: 28,
			loading: "lazy",
			decoding: "async",
			onError: () => n(!0)
		}) : st(e.name, 2)
	});
}
var ln = (e) => qe(e).then((t) => (t.has_cover && Pe(e, t), t.has_cover));
function un({ readOnly: e, receipt: t, resource: n, query: r, navigate: i, clearText: a }) {
	jt();
	let [o, s] = (0, Q.useState)(() => ht(location.search));
	(0, Q.useEffect)(() => {
		r !== o.q && (s((e) => ({
			...e,
			q: r,
			page: 1
		})), Z({ page: "" }));
	}, [r, o.q]);
	let c = (e, t) => {
		let n = o[e] === t ? "" : t;
		s((t) => ({
			...t,
			[e]: n,
			page: 1
		})), Z({
			[e]: n,
			page: ""
		});
	}, f = (0, Q.useRef)(null), m = ({ pageIndex: e, pageSize: t }) => {
		let n = e + 1;
		s((e) => ({
			...e,
			page: n,
			size: t
		})), Z({
			page: n > 1 ? String(n) : "",
			size: t === 24 ? "" : String(t)
		}), f.current?.scrollIntoView({ block: "start" });
	}, h = () => {
		s((e) => ({
			...e,
			performer: "",
			studio: "",
			tag: "",
			q: "",
			page: 1
		})), Z({
			performer: "",
			studio: "",
			tag: "",
			page: ""
		}), a();
	}, g = (e) => _(e, e === o.sort ? o.dir === "asc" ? "desc" : "asc" : e === "code" ? "asc" : "desc"), _ = (e, t) => {
		s((n) => ({
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
	}, b = () => {
		let e = Math.random().toString(36).slice(2, 10);
		s((t) => ({
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
		let e = [...f.current?.querySelectorAll("[data-catalog-tier],[data-catalog-tags],[data-filter-row=\"bottom\"]") || []].map((e) => Pt(e, { drag: !0 }));
		return () => e.forEach((e) => e.destroy());
	}, []);
	let x = Te();
	(0, Q.useSyncExternalStore)(x.subscribe, x.version, x.version);
	let S = nt(), w = At(), ee = ke(et({
		active: !0,
		home: !1,
		portrait: !1
	})), T = X({
		queryKey: gt(o),
		queryFn: ({ signal: e }) => Xe(o, e),
		placeholderData: ot,
		retry: !1,
		refetchOnWindowFocus: !1
	}), D = T.data?.metadata_job, O = (0, Q.useRef)(!1);
	O.current = D?.status === "running";
	let ie = q.getQueryData(y)?.metadata_job, k = X({
		queryKey: y,
		retry: !1,
		refetchOnWindowFocus: !1,
		enabled: D?.status === "running" || ie?.status === "running",
		queryFn: ({ signal: e }) => Ye(e),
		refetchInterval: lt(() => O.current)
	}), A = k.data && k.dataUpdatedAt >= T.dataUpdatedAt ? k.data.metadata_job : D, j = A?.status === "running", se = (0, Q.useRef)(!1);
	(0, Q.useEffect)(() => {
		se.current && !j && T.refetch(), se.current = j;
	}, [j, T]);
	let ce = (0, Q.useRef)(""), N = JSON.stringify([
		o.performer,
		o.studio,
		o.tag,
		o.q,
		o.sort,
		o.dir,
		o.seed
	]), P = !T.isPlaceholderData && (T.data?.metadata_unread || 0) > 0 && !j;
	(0, Q.useEffect)(() => {
		P && ce.current !== N && (ce.current = N, Ne("start", o).then(async (e) => {
			await q.cancelQueries({ queryKey: y }), q.setQueryData(y, e);
		}).catch(() => {}));
	}, [P, N]);
	let F = Y(), I = (e) => {
		F.run(String(e.id), (t) => Ce({ code: e.code }, t), () => {
			t(J("catalog:javWant.added")), K(), T.refetch();
		});
	}, L = T.data;
	Jt(L?.items || []);
	let R = T.isPending, z = !!(o.performer || o.studio || o.tag || o.q), B = Math.max(1, Math.ceil((L?.total || 0) / o.size));
	return (0, Q.useEffect)(() => {
		!L || T.isPlaceholderData || o.page <= B || (s((e) => ({
			...e,
			page: B
		})), Z({ page: B > 1 ? String(B) : "" }));
	}, [
		L,
		T.isPlaceholderData,
		o.page,
		B
	]), /* @__PURE__ */ (0, $.jsxs)("section", {
		ref: f,
		"aria-label": J("catalog:entityHero.subscribeNewReleases"),
		"aria-busy": R || T.isFetching,
		className: "flex min-w-0 scroll-mt-24 flex-col gap-4",
		children: [
			R ? /* @__PURE__ */ (0, $.jsx)("div", {
				"data-catalog-tiers": "",
				"aria-busy": "true",
				dangerouslySetInnerHTML: { __html: an }
			}) : null,
			L && (L.facets.performers.length || L.facets.studios.length) ? /* @__PURE__ */ (0, $.jsxs)("div", {
				"data-catalog-tiers": "",
				"data-release-tiers": "",
				children: [L.facets.performers.length ? /* @__PURE__ */ (0, $.jsx)("div", {
					"data-catalog-tier": "performers",
					role: "group",
					"aria-label": J("catalog:javReleases.filterByActress"),
					children: L.facets.performers.map((e) => /* @__PURE__ */ (0, $.jsxs)("button", {
						type: "button",
						"data-tier-performer": "",
						"aria-pressed": o.performer === e.name,
						title: J("catalog:javReleases.facetCount", {
							name: W("performer", e.name, e.id),
							count: e.count
						}),
						onClick: () => c("performer", e.name),
						children: [/* @__PURE__ */ (0, $.jsx)("span", {
							"data-tier-ring": "",
							dangerouslySetInnerHTML: { __html: on(e) }
						}), /* @__PURE__ */ (0, $.jsx)("span", {
							"data-tier-name": "",
							children: W("performer", e.name, e.id)
						})]
					}, e.name))
				}) : null, L.facets.studios.length ? /* @__PURE__ */ (0, $.jsx)("div", {
					"data-catalog-tier": "studios",
					role: "group",
					"aria-label": J("catalog:javReleases.filterByLabel"),
					children: L.facets.studios.map((e) => /* @__PURE__ */ (0, $.jsxs)("button", {
						type: "button",
						"data-tier-studio": "",
						"aria-pressed": o.studio === e.name,
						title: J("catalog:javReleases.facetCount", {
							name: e.name,
							count: e.count
						}),
						onClick: () => c("studio", e.name),
						children: [
							/* @__PURE__ */ (0, $.jsx)(cn, { studio: e }),
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
				label: J("catalog:javReleases.filtersLabel"),
				topLabel: J("catalog:javReleases.tagsLabel"),
				attrs: {
					"data-filter-frame": "",
					"data-jav-filter": "",
					"data-catalog-frame": ""
				},
				busy: R,
				topClassName: "gap-1.5 overflow-visible",
				bottomClassName: "min-h-12",
				top: /* @__PURE__ */ (0, $.jsx)("div", {
					"data-catalog-scroll": "",
					children: /* @__PURE__ */ (0, $.jsx)("div", {
						"data-catalog-tags": "",
						dangerouslySetInnerHTML: R ? { __html: rt() } : void 0,
						children: R ? null : L?.facets.tags.map((e) => /* @__PURE__ */ (0, $.jsxs)(ne, {
							"data-catalog-tag": e.name,
							"data-entity-press": "",
							pressed: o.tag === e.name,
							onPress: () => c("tag", e.name),
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
						children: R ? /* @__PURE__ */ (0, $.jsx)("span", {
							"data-skeleton": "count",
							"aria-hidden": !0,
							className: "relative inline-block h-3.5 w-37.5 rounded-md align-middle skeleton-sheen"
						}) : z ? J("catalog:javReleases.matchedCount", {
							matched: L?.total || 0,
							count: L?.candidate_total || 0
						}) : J("catalog:countLabel.works", { count: L?.total || 0 })
					}),
					z ? /* @__PURE__ */ (0, $.jsx)(re, {
						onPress: h,
						children: J("catalog:shared.clearFilters")
					}) : null,
					/* @__PURE__ */ (0, $.jsxs)("span", {
						"data-entity-sorts": "",
						children: [
							/* @__PURE__ */ (0, $.jsx)(pe, {
								onPress: b,
								busy: o.sort === "random" && T.isFetching
							}),
							w === "cards" ? /* @__PURE__ */ (0, $.jsx)(de, {
								label: J("catalog:entityFilter.javCardLayout"),
								value: S,
								options: ae,
								onChange: Et
							}) : null,
							/* @__PURE__ */ (0, $.jsx)(p, {}),
							/* @__PURE__ */ (0, $.jsx)(me, {
								sorts: ue.map(([e, t, n]) => ({
									key: e,
									label: t,
									ariaLabel: n,
									pressed: e === o.sort,
									dir: o.dir
								})),
								onSort: (e) => g(e)
							})
						]
					})
				] })
			}),
			R && w === "cards" ? /* @__PURE__ */ (0, $.jsx)("div", {
				role: "status",
				"aria-label": J("catalog:javReleases.loading"),
				dangerouslySetInnerHTML: { __html: tt("discover", S) }
			}) : null,
			T.error ? /* @__PURE__ */ (0, $.jsx)(M, {
				tone: "error",
				title: J("catalog:javReleases.failed"),
				children: G(T.error)
			}) : null,
			j && A ? /* @__PURE__ */ (0, $.jsx)("div", {
				"data-jav-metadata": "",
				className: "min-w-0",
				children: /* @__PURE__ */ (0, $.jsx)(_e, {
					kind: Se("jav-discovery-metadata"),
					label: J("catalog:javMetadata.loadingProgress", {
						completed: A.completed,
						count: A.total
					}),
					value: A.completed,
					total: A.total
				})
			}) : null,
			e ? null : /* @__PURE__ */ (0, $.jsx)(v, {
				scope: J("catalog:javReleases.coverQueueScope"),
				fetchOne: ln,
				codes: (L?.items || []).filter((e) => e.cover_state === "queued" && !e.cover_url).map((e) => e.code),
				settled: (e, n) => {
					t(e === n ? J("catalog:javReleases.coversFetched", { count: n }) : J("catalog:javReleases.coversPartial", {
						got: e,
						count: n
					})), T.refetch();
				}
			}),
			!R && !T.error && !L?.items.length ? /* @__PURE__ */ (0, $.jsx)(E, {
				icon: d,
				title: J(z ? "catalog:javReleases.noMatches" : "catalog:javReleases.emptyTitle"),
				actions: z ? /* @__PURE__ */ (0, $.jsx)(l, {
					size: "small",
					onClick: h,
					children: J("catalog:shared.clearFilters")
				}) : /* @__PURE__ */ (0, $.jsx)(u, {
					size: "small",
					href: "/subscriptions?tab=add",
					children: J("catalog:javReleases.addSubscription")
				}),
				children: J(z ? "catalog:javReleases.clearFiltersHint" : "catalog:javReleases.emptyHint")
			}) : null,
			F.error ? /* @__PURE__ */ (0, $.jsx)(M, {
				tone: "error",
				children: F.error
			}) : null,
			w === "list" ? R || L?.items.length ? /* @__PURE__ */ (0, $.jsx)(rn, {
				items: L?.items || [],
				waiting: R,
				filters: o,
				studios: L?.facets.studios || [],
				javImage: x.value.javImage,
				readOnly: e,
				navigate: i,
				onTag: (e) => c("tag", e || o.tag),
				onSort: _,
				wanting: (e) => F.busy === String(e.id),
				onWant: I,
				onResource: (e) => n(Zt(e))
			}) : null : /* @__PURE__ */ (0, $.jsx)("div", {
				"data-media-grid": "",
				className: oe,
				style: { "--card-ratio": ee },
				children: (L?.items || []).map((t) => /* @__PURE__ */ (0, $.jsx)(en, {
					item: t,
					layout: S,
					javImage: x.value.javImage,
					readOnly: e,
					navigate: i,
					tag: o.tag,
					onTag: (e) => c("tag", e || o.tag),
					wanting: F.busy === String(t.id),
					onWant: () => I(t),
					onResource: () => n(Zt(t)),
					badge: o.sort === "taste" ? /* @__PURE__ */ (0, $.jsx)(sn, { value: t.taste_score }) : void 0
				}, t.id))
			}),
			L ? /* @__PURE__ */ (0, $.jsx)(C, {
				label: J("catalog:javTabs.newReleases"),
				total: L.total,
				pagination: {
					pageIndex: o.page - 1,
					pageSize: o.size
				},
				onChange: m,
				unit: J("catalog:catalogList.footerUnit"),
				pageUnit: J("catalog:catalogList.footerPageUnit"),
				pageSizes: le
			}) : null
		]
	});
}
// src/react/jav/studio-subscriptions.tsx
var dn = (e) => e ? new Date(e).toLocaleString() : J("catalog:studioSubscriptions.neverFetched");
function fn(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		if (!n.enabled || n.entity_kind !== "studio" || typeof n.entity_id != "number") continue;
		let e = t.get(n.entity_id) || {
			entityId: n.entity_id,
			name: n.entity_name || n.name,
			kind: n.kind,
			kindLabel: n.kind_label,
			sources: 0,
			newCount: 0,
			seen: 0,
			lastFetchedAt: null
		};
		e.sources += 1, e.newCount += Number(n.last_new_count) || 0, e.seen += Number(n.seen) || 0, (!e.lastFetchedAt || n.last_fetched_at && n.last_fetched_at > e.lastFetchedAt) && (e.lastFetchedAt = n.last_fetched_at), t.set(n.entity_id, e);
	}
	return [...t.values()].sort((e, t) => t.newCount - e.newCount || e.name.localeCompare(t.name));
}
function pn({ navigate: e }) {
	let t = X({
		queryKey: ["studio-subscriptions"],
		queryFn: ({ signal: e }) => we("/api/feeds", e)
	});
	if (t.isPending) return /* @__PURE__ */ (0, $.jsx)("div", {
		"data-studio-subscriptions-loading": "",
		className: "text-body-2-regular text-text-secondary",
		children: J("catalog:studioSubscriptions.loading")
	});
	if (t.isError) return /* @__PURE__ */ (0, $.jsx)(M, {
		tone: "error",
		title: J("catalog:studioSubscriptions.failed"),
		children: G(t.error)
	});
	let n = fn(t.data?.sources || []);
	return n.length ? /* @__PURE__ */ (0, $.jsxs)("section", {
		"data-studio-subscriptions": "",
		className: "flex min-w-0 flex-col gap-4",
		children: [/* @__PURE__ */ (0, $.jsx)("header", {
			className: "flex flex-wrap items-end justify-between gap-3",
			children: /* @__PURE__ */ (0, $.jsxs)("div", { children: [/* @__PURE__ */ (0, $.jsx)("h2", {
				className: "text-title-2-medium text-text-primary",
				children: J("catalog:studioSubscriptions.title")
			}), /* @__PURE__ */ (0, $.jsx)("p", {
				className: "text-body-2-regular text-text-secondary",
				children: J("catalog:studioSubscriptions.hint")
			})] })
		}), /* @__PURE__ */ (0, $.jsx)("div", {
			className: "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3",
			children: n.map((t) => /* @__PURE__ */ (0, $.jsxs)("article", {
				"data-studio-subscription": "",
				className: "flex min-w-0 flex-col gap-3 rounded-xl border border-separator-border bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, $.jsxs)("div", {
						className: "flex min-w-0 items-center gap-3",
						children: [/* @__PURE__ */ (0, $.jsx)("img", {
							src: ct(t.name, "icon"),
							alt: "",
							width: 40,
							height: 40,
							loading: "lazy",
							decoding: "async",
							className: "h-10 w-10 flex-none rounded-lg object-contain",
							onError: (e) => {
								e.currentTarget.style.display = "none";
							}
						}), /* @__PURE__ */ (0, $.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, $.jsx)("strong", {
								className: "block truncate text-body-1-medium text-text-primary",
								children: t.name
							}), /* @__PURE__ */ (0, $.jsxs)("span", {
								className: "text-caption-1-regular text-text-secondary",
								children: [
									t.kindLabel,
									" · ",
									t.sources
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, $.jsxs)("div", {
						className: "flex flex-wrap gap-x-4 gap-y-1 text-caption-1-regular text-text-secondary",
						children: [
							/* @__PURE__ */ (0, $.jsx)("span", { children: J("catalog:studioSubscriptions.newCount", { count: t.newCount }) }),
							/* @__PURE__ */ (0, $.jsx)("span", { children: J("catalog:studioSubscriptions.seenCount", { count: t.seen }) }),
							/* @__PURE__ */ (0, $.jsx)("span", { children: J("catalog:studioSubscriptions.lastFetched", { time: dn(t.lastFetchedAt) }) })
						]
					}),
					/* @__PURE__ */ (0, $.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, $.jsx)("button", {
							type: "button",
							className: "rounded-lg bg-control px-3 py-1.5 text-body-2-medium text-text-primary hover:bg-control-hover",
							onClick: () => e(`/jav?tab=releases&studio=${encodeURIComponent(t.name)}`),
							children: J("catalog:studioSubscriptions.openReleases")
						}), /* @__PURE__ */ (0, $.jsx)("button", {
							type: "button",
							className: "rounded-lg px-3 py-1.5 text-body-2-medium text-text-secondary hover:bg-control",
							onClick: () => e("/subscriptions"),
							children: J("catalog:studioSubscriptions.manage")
						})]
					})
				]
			}, t.entityId))
		})]
	}) : /* @__PURE__ */ (0, $.jsxs)("section", {
		"data-studio-subscriptions-empty": "",
		className: "flex min-h-52 flex-col items-center justify-center gap-2 rounded-floating border border-separator-border bg-background-secondary-default px-6 py-12 text-center",
		children: [
			/* @__PURE__ */ (0, $.jsx)("h2", {
				className: "text-body-semibold text-text-primary",
				children: J("catalog:studioSubscriptions.empty")
			}),
			/* @__PURE__ */ (0, $.jsx)("p", {
				className: "max-w-empty-copy text-body-2-regular text-text-secondary",
				children: J("catalog:studioSubscriptions.emptyHint")
			}),
			/* @__PURE__ */ (0, $.jsx)("button", {
				type: "button",
				className: "mt-2 rounded-lg bg-control px-3 py-1.5 text-body-2-medium text-text-primary hover:bg-control-hover",
				onClick: () => e("/studios"),
				children: J("catalog:studioSubscriptions.browse")
			})
		]
	});
}
// src/react/jav/actor-subscriptions.tsx
var mn = (e) => e ? new Date(e).toLocaleString() : J("catalog:actorSubscriptions.neverFetched");
function hn(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		if (!n.enabled || n.entity_kind !== "performer" || typeof n.entity_id != "number") continue;
		let e = t.get(n.entity_id) || {
			entityId: n.entity_id,
			name: n.entity_name || n.name,
			kindLabel: n.kind_label,
			sources: 0,
			newCount: 0,
			seen: 0,
			lastFetchedAt: null
		};
		e.sources += 1, e.newCount += Number(n.last_new_count) || 0, e.seen += Number(n.seen) || 0, (!e.lastFetchedAt || n.last_fetched_at && n.last_fetched_at > e.lastFetchedAt) && (e.lastFetchedAt = n.last_fetched_at), t.set(n.entity_id, e);
	}
	return [...t.values()].sort((e, t) => t.newCount - e.newCount || e.name.localeCompare(t.name));
}
function gn({ navigate: e }) {
	let t = X({
		queryKey: ["actor-subscriptions"],
		queryFn: ({ signal: e }) => we("/api/feeds", e)
	});
	if (t.isPending) return /* @__PURE__ */ (0, $.jsx)("div", {
		className: "text-body-2-regular text-text-secondary",
		children: J("catalog:actorSubscriptions.loading")
	});
	if (t.isError) return /* @__PURE__ */ (0, $.jsx)(M, {
		tone: "error",
		title: J("catalog:actorSubscriptions.failed"),
		children: G(t.error)
	});
	let n = hn(t.data?.sources || []);
	return n.length ? /* @__PURE__ */ (0, $.jsxs)("section", {
		"data-actor-subscriptions": "",
		className: "flex min-w-0 flex-col gap-4",
		children: [/* @__PURE__ */ (0, $.jsxs)("header", { children: [/* @__PURE__ */ (0, $.jsx)("h2", {
			className: "text-title-2-medium text-text-primary",
			children: J("catalog:actorSubscriptions.title")
		}), /* @__PURE__ */ (0, $.jsx)("p", {
			className: "text-body-2-regular text-text-secondary",
			children: J("catalog:actorSubscriptions.hint")
		})] }), /* @__PURE__ */ (0, $.jsx)("div", {
			className: "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3",
			children: n.map((t) => /* @__PURE__ */ (0, $.jsxs)("article", {
				"data-actor-subscription": "",
				className: "flex min-w-0 flex-col gap-3 rounded-xl border border-separator-border bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, $.jsxs)("div", {
						className: "flex min-w-0 items-center gap-3",
						children: [/* @__PURE__ */ (0, $.jsx)("span", {
							"aria-hidden": !0,
							className: "grid h-10 w-10 flex-none place-items-center rounded-full bg-control text-body-2-medium text-text-primary",
							children: t.name.slice(0, 1)
						}), /* @__PURE__ */ (0, $.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, $.jsx)("strong", {
								className: "block truncate text-body-1-medium text-text-primary",
								children: t.name
							}), /* @__PURE__ */ (0, $.jsxs)("span", {
								className: "text-caption-1-regular text-text-secondary",
								children: [
									t.kindLabel,
									" · ",
									t.sources
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, $.jsxs)("div", {
						className: "flex flex-wrap gap-x-4 gap-y-1 text-caption-1-regular text-text-secondary",
						children: [
							/* @__PURE__ */ (0, $.jsx)("span", { children: J("catalog:actorSubscriptions.newCount", { count: t.newCount }) }),
							/* @__PURE__ */ (0, $.jsx)("span", { children: J("catalog:actorSubscriptions.seenCount", { count: t.seen }) }),
							/* @__PURE__ */ (0, $.jsx)("span", { children: J("catalog:actorSubscriptions.lastFetched", { time: mn(t.lastFetchedAt) }) })
						]
					}),
					/* @__PURE__ */ (0, $.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, $.jsx)("button", {
							type: "button",
							className: "rounded-lg bg-control px-3 py-1.5 text-body-2-medium text-text-primary hover:bg-control-hover",
							onClick: () => e(`/jav?tab=releases&performer=${encodeURIComponent(t.name)}`),
							children: J("catalog:actorSubscriptions.openReleases")
						}), /* @__PURE__ */ (0, $.jsx)("button", {
							type: "button",
							className: "rounded-lg px-3 py-1.5 text-body-2-medium text-text-secondary hover:bg-control",
							onClick: () => e("/subscriptions"),
							children: J("catalog:actorSubscriptions.manage")
						})]
					})
				]
			}, t.entityId))
		})]
	}) : /* @__PURE__ */ (0, $.jsxs)("section", {
		"data-actor-subscriptions-empty": "",
		className: "flex min-h-52 flex-col items-center justify-center gap-2 rounded-floating border border-separator-border bg-background-secondary-default px-6 py-12 text-center",
		children: [
			/* @__PURE__ */ (0, $.jsx)("h2", {
				className: "text-body-semibold text-text-primary",
				children: J("catalog:actorSubscriptions.empty")
			}),
			/* @__PURE__ */ (0, $.jsx)("p", {
				className: "max-w-empty-copy text-body-2-regular text-text-secondary",
				children: J("catalog:actorSubscriptions.emptyHint")
			}),
			/* @__PURE__ */ (0, $.jsx)("button", {
				type: "button",
				className: "mt-2 rounded-lg bg-control px-3 py-1.5 text-body-2-medium text-text-primary hover:bg-control-hover",
				onClick: () => e("/performers"),
				children: J("catalog:actorSubscriptions.browse")
			})
		]
	});
}
// src/react/jav/jav-page.tsx
var _n = Tt("x"), vn = Tt("refresh-cw"), yn = {
	releases: J("catalog:javSearch.filterReleases"),
	discover: J("catalog:javSearch.filterRecommended"),
	wants: J("catalog:javSearch.filterWants")
};
function bn({ tab: e, readOnly: t, navigate: n, receipt: r }) {
	let [i, a] = (0, Q.useState)(null), [o, s] = (0, Q.useState)(() => new URLSearchParams(location.search).get("q") || ""), c = (e) => {
		s(e), Z({ q: e });
	};
	return /* @__PURE__ */ (0, $.jsx)(Yt, {
		readOnly: t,
		receipt: r,
		children: /* @__PURE__ */ (0, $.jsxs)("div", {
			className: "flex w-full flex-col gap-6",
			children: [
				/* @__PURE__ */ (0, $.jsx)(A, {
					tab: e,
					navigate: n,
					find: () => a({}),
					search: /* @__PURE__ */ (0, $.jsx)(O, {
						label: yn[e] || J("catalog:javDiscover.filter"),
						value: o,
						onQuery: c
					})
				}),
				e === "releases" ? /* @__PURE__ */ (0, $.jsx)(un, {
					readOnly: t,
					receipt: r,
					resource: a,
					query: o.trim(),
					navigate: n,
					clearText: () => c("")
				}) : e === "discover" ? /* @__PURE__ */ (0, $.jsx)(xn, {
					readOnly: t,
					receipt: r,
					resource: a,
					query: o.trim(),
					navigate: n,
					clearText: () => c("")
				}) : e === "studios" ? /* @__PURE__ */ (0, $.jsx)(pn, { navigate: n }) : e === "actors" ? /* @__PURE__ */ (0, $.jsx)(gn, { navigate: n }) : /* @__PURE__ */ (0, $.jsx)(Ht, {
					readOnly: t,
					toast: r,
					query: o.trim(),
					clearQuery: () => c("")
				}),
				/* @__PURE__ */ (0, $.jsx)(_, {
					prefill: i,
					close: () => a(null),
					receipt: r
				})
			]
		})
	}, e);
}
function xn({ readOnly: e, receipt: t, resource: n, query: r, navigate: i, clearText: a }) {
	let o = new URLSearchParams(location.search), [s, c] = (0, Q.useState)(() => o.get("scope") === "library" ? "library" : "external"), [d, f] = (0, Q.useState)(() => o.get("tag") || ""), [p, m] = (0, Q.useState)(() => b.some(([e]) => e === o.get("sort")) ? o.get("sort") : "taste"), [h, _] = (0, Q.useState)(() => o.get("dir") === "asc"), v = (e) => {
		c(e), Z({ scope: e === "external" ? "" : e });
	}, x = (e) => {
		f(e), Z({ tag: e });
	}, S = (e) => {
		m(e), Z({ sort: e === "taste" ? "" : e });
	}, C = (e) => {
		_(e), Z({ dir: e ? "asc" : "" });
	}, w = (0, Q.useRef)(null);
	(0, Q.useEffect)(() => {
		let e = [...w.current?.querySelectorAll("[data-catalog-scroll],[data-catalog-tags],[data-filter-row=\"bottom\"]") || []].map((e) => Pt(e, { drag: !0 }));
		return () => e.forEach((e) => e.destroy());
	}, []);
	let T = Te();
	(0, Q.useSyncExternalStore)(T.subscribe, T.version, T.version);
	let O = nt(), ie = ke(et({
		active: !0,
		home: !1,
		portrait: !1
	})), k = h ? "asc" : "desc", A = X({
		queryKey: Ve(s, p, k),
		retry: !1,
		refetchOnWindowFocus: !1,
		queryFn: ({ signal: e }) => Je(s, e, {
			sort: p,
			direction: k
		})
	}), se = A.data?.metadata_job, ce = (0, Q.useRef)(!1);
	ce.current = se?.status === "running";
	let N = X({
		queryKey: y,
		retry: !1,
		refetchOnWindowFocus: !1,
		enabled: s === "external",
		queryFn: ({ signal: e }) => Ye(e),
		refetchInterval: lt(() => ce.current)
	}), P = N.data && N.dataUpdatedAt >= A.dataUpdatedAt ? N.data.metadata_job : se, F = (e) => e ? `${e.job_id}:${e.status}` : "", I = (0, Q.useRef)(""), le = (0, Q.useRef)(""), ue = N.data?.metadata_job;
	(0, Q.useEffect)(() => {
		let e = F(ue), t = le.current.endsWith(":running") && ue && ue.status !== "running";
		le.current = e, t && e !== I.current && A.refetch();
	}, [F(ue)]);
	let L = Y(), R = Y(), z = async (e, t) => {
		let n = await Me(e, {
			sort: p,
			direction: k,
			jobId: P?.job_id
		}, t);
		e !== "start" && await A.refetch({
			cancelRefetch: !0,
			throwOnError: !0
		}), await q.cancelQueries({ queryKey: y }), I.current = F(n.metadata_job), q.setQueryData(y, n);
	}, B = (e) => {
		R.run(e, (t) => z(e === "stop" ? "cancel" : "refresh", t), () => {});
	}, fe = (0, Q.useRef)(!1), pe = s === "external" && P?.status !== "running" && (A.data?.items || []).some((e) => e.metadata_state === "pending" || e.metadata_state === "stale");
	(0, Q.useEffect)(() => {
		pe && !fe.current && (fe.current = !0, z("start").catch(() => {}));
	}, [pe]);
	let he = A.data?.items || [], ge = [...new Set(he.flatMap((e) => e.tags || []))], V = he.filter((e) => (!d || e.tags?.includes(d)) && (!r || [
		e.code,
		e.title,
		e.performers,
		e.studio,
		...e.tags || [],
		...(e.performer_refs || []).map((e) => e.name)
	].join(" ").toLocaleLowerCase().includes(r.toLocaleLowerCase()))), H = A.isPending;
	return Jt(V), /* @__PURE__ */ (0, $.jsxs)("section", {
		ref: w,
		"aria-label": J("catalog:shared.recommendedForYou"),
		"aria-busy": H,
		className: "flex min-w-0 flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, $.jsx)(te, {
				label: J("catalog:javDiscover.filtersLabel"),
				topLabel: J("catalog:javDiscover.scopeLabel"),
				attrs: {
					"data-filter-frame": "",
					"data-jav-filter": "",
					"data-catalog-frame": ""
				},
				busy: H,
				topClassName: "gap-1.5 overflow-visible",
				bottomClassName: "min-h-12",
				top: /* @__PURE__ */ (0, $.jsxs)("div", {
					"data-catalog-scroll": "",
					children: [/* @__PURE__ */ (0, $.jsxs)("div", {
						"data-catalog-views": "",
						children: [[["external", J("catalog:javDiscover.external")], ["library", J("catalog:javDiscover.library")]].map(([e, t]) => /* @__PURE__ */ (0, $.jsx)(ne, {
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
						dangerouslySetInnerHTML: H ? { __html: rt() } : void 0,
						children: H ? null : ge.map((e) => /* @__PURE__ */ (0, $.jsxs)(ne, {
							"data-catalog-tag": e,
							"data-entity-press": "",
							pressed: d === e,
							onPress: () => x(d === e ? "" : e),
							children: [e, /* @__PURE__ */ (0, $.jsx)("span", {
								"data-count-badge": "",
								children: he.filter((t) => t.tags?.includes(e)).length
							})]
						}, e))
					})]
				}),
				bottom: /* @__PURE__ */ (0, $.jsxs)($.Fragment, { children: [
					/* @__PURE__ */ (0, $.jsx)("span", {
						"data-catalog-readout": "",
						children: H ? /* @__PURE__ */ (0, $.jsx)("span", {
							"data-skeleton": "count",
							"aria-hidden": !0,
							className: "relative inline-block h-3.5 w-37.5 rounded-md align-middle skeleton-sheen"
						}) : J("catalog:countLabel.works", { count: V.length })
					}),
					/* @__PURE__ */ (0, $.jsx)(j, { currentHref: () => location.pathname + location.search }),
					r || d ? /* @__PURE__ */ (0, $.jsx)(re, {
						onPress: () => {
							x(""), a();
						},
						children: J("catalog:shared.clearFilters")
					}) : null,
					/* @__PURE__ */ (0, $.jsxs)("span", {
						"data-entity-sorts": "",
						children: [
							s === "external" ? /* @__PURE__ */ (0, $.jsx)(D, {
								"data-entity-batch": "",
								"data-jav-metadata-update": "",
								label: P?.status === "running" ? J("catalog:javDiscover.stopUpdating") : J("catalog:javDiscover.updateMetadata"),
								disabled: H,
								"data-skeleton-action": H ? "" : void 0,
								busy: !!R.busy,
								icon: P?.status === "running" ? _n : vn,
								onPress: () => B(P?.status === "running" ? "stop" : "update")
							}) : null,
							/* @__PURE__ */ (0, $.jsx)(de, {
								label: J("catalog:entityFilter.javCardLayout"),
								value: O,
								options: ae,
								onChange: Et
							}),
							/* @__PURE__ */ (0, $.jsx)(me, {
								sorts: b.map(([e, t, n]) => ({
									key: e,
									label: t,
									ariaLabel: n,
									pressed: e === p,
									dir: k
								})),
								onSort: (e) => {
									e === p ? C(!h) : (S(e), C(e === "code"));
								}
							})
						]
					})
				] })
			}),
			H ? /* @__PURE__ */ (0, $.jsx)("div", {
				role: "status",
				"aria-label": J("catalog:javDiscover.loading"),
				dangerouslySetInnerHTML: { __html: tt("discover", O) }
			}) : null,
			A.error ? /* @__PURE__ */ (0, $.jsx)(M, {
				tone: "error",
				title: J("catalog:javDiscover.failed"),
				children: G(A.error)
			}) : null,
			s === "external" && P?.status === "running" ? /* @__PURE__ */ (0, $.jsx)("div", {
				"data-jav-metadata": "",
				className: "min-w-0",
				children: /* @__PURE__ */ (0, $.jsx)(_e, {
					kind: Se("jav-discovery-metadata"),
					label: J("catalog:javMetadata.loadingProgress", {
						completed: P.completed,
						count: P.total
					}),
					value: P.completed,
					total: P.total
				})
			}) : null,
			P && P.status !== "running" && (P.status !== "complete" || P.failed > 0) ? /* @__PURE__ */ (0, $.jsx)(M, {
				tone: "neutral",
				action: /* @__PURE__ */ (0, $.jsx)(l, {
					variant: "secondary",
					...U(R.busy === "retry"),
					"aria-label": J("catalog:javMetadata.retry"),
					onClick: () => B("retry"),
					children: J("catalog:shared.retryNow")
				}),
				children: it(P) || J("catalog:javMetadata.progress", {
					completed: P.completed,
					count: P.total
				})
			}) : null,
			R.error ? /* @__PURE__ */ (0, $.jsx)(M, {
				tone: "error",
				children: R.error
			}) : null,
			!H && !A.error && !V.length ? /* @__PURE__ */ (0, $.jsx)(E, {
				icon: ee,
				title: J(r || d ? "catalog:javDiscover.noMatches" : "catalog:javDiscover.noTasteMatches"),
				actions: /* @__PURE__ */ (0, $.jsxs)($.Fragment, { children: [/* @__PURE__ */ (0, $.jsx)(u, {
					size: "small",
					href: "/taste",
					variant: "secondary",
					children: J("catalog:javDiscover.viewTaste")
				}), r || d ? /* @__PURE__ */ (0, $.jsx)(l, {
					variant: "primary",
					size: "small",
					onClick: () => {
						a(), f(""), Z({
							q: "",
							tag: ""
						});
					},
					children: J("catalog:shared.clearFilters")
				}) : s === "library" ? /* @__PURE__ */ (0, $.jsx)(u, {
					variant: "primary",
					size: "small",
					href: "/",
					children: J("catalog:entityPage.browseCollection")
				}) : /* @__PURE__ */ (0, $.jsx)(l, {
					variant: "primary",
					size: "small",
					onClick: () => n({}),
					children: J("catalog:javDiscover.findVideos")
				})] }),
				children: J(r || d ? "catalog:javDiscover.clearFiltersHint" : s === "library" ? "catalog:javDiscover.libraryEmptyHint" : "catalog:javDiscover.externalEmptyHint")
			}) : null,
			L.error ? /* @__PURE__ */ (0, $.jsx)(M, {
				tone: "error",
				children: L.error
			}) : null,
			/* @__PURE__ */ (0, $.jsx)("div", {
				"data-media-grid": "",
				className: oe,
				style: { "--card-ratio": ie },
				children: V.map((r) => {
					let a = ft(r.taste_score ?? r.score), o = [
						a.label,
						J("catalog:javScore.taste", { score: He(r.taste_score ?? r.score) }),
						A.data?.ranking_method === "mmr" && r.ranking_score != null ? J("catalog:javScore.ranking", { score: He(r.ranking_score) }) : "",
						r.source_score == null ? "" : J("catalog:javScore.siteRating", { rating: r.source_score.toFixed(1) }),
						...wt(r.reasons, r.reason_codes, r.reason_params)
					].filter(Boolean).join(" · ");
					return /* @__PURE__ */ (0, $.jsx)(en, {
						item: r,
						layout: O,
						javImage: T.value.javImage,
						readOnly: e,
						navigate: i,
						tag: d,
						onTag: x,
						wanting: L.busy === String(r.id),
						onWant: () => {
							L.run(String(r.id), (e) => Ce({ code: r.code }, e), () => {
								t(J("catalog:javWant.added")), K(), A.refetch();
							});
						},
						onResource: () => n(Zt(r)),
						badge: /* @__PURE__ */ (0, $.jsx)("button", {
							"data-jav-taste-score": "",
							type: "button",
							title: o,
							"aria-label": J("catalog:javScore.badgeLabel", {
								score: a.score,
								label: a.label
							}),
							className: "rounded-md outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
							children: /* @__PURE__ */ (0, $.jsx)(g, {
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
export { bn as JavPage };

//# debugId=dc589559-2948-4f1e-ae3d-101dcc46e9bb