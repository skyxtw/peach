(function() {
	try {
		var e = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, t = new e.Error().stack;
		t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "52440621-eae9-4c48-b8fd-9760b9a90b0b", e._sentryDebugIdIdentifier = "sentry-dbid-52440621-eae9-4c48-b8fd-9760b9a90b0b");
	} catch {}
})();
import { $76d00c5a4edb230a$export$76ccd210b9029917 as e, $76d00c5a4edb230a$export$816b5d811295e6bc as t, $76d00c5a4edb230a$export$b59bdbef9ce70de2 as n, $76d00c5a4edb230a$export$f6f0c3fe4ec306ea as r, $76d00c5a4edb230a$export$f850895b287ef28e as i, Button as a, Checkbox as o, ChevronSortDown as s, DataTableFooter as c, DataTableFrame as l, DataTableSort as u, SelectionDock as d, Table as f, TableColumnControls as p, TableColumnResizer as m, TableSelectionHeader as h, __toESM as g, cardClass as _, columnVisibilityFeature as v, createColumnHelper as y, flexRender as b, require_jsx_runtime as x, require_react as S, rowPaginationFeature as C, rowSelectionFeature as w, rowSortingFeature as T, t as E, tableFeatures as D, useTable as O, useTablePreferences as k } from "./peach-app.js";
import { createPaginatedRowModel as A, createSortedRowModel as j, useTableSelection as M } from "./peach-app.use-table-selection-B1681jEl.js";
// src/react/components/data-table.tsx
var N = /* @__PURE__ */ g(S(), 1), P = x(), F = D({
	rowSortingFeature: T,
	rowSelectionFeature: w,
	rowPaginationFeature: C,
	columnVisibilityFeature: v,
	sortedRowModel: j(),
	paginatedRowModel: A()
});
function I({ label: g, items: v, columns: x, rowId: S, rowLabel: C, selected: w, onSelected: T, actions: D, title: A = g, titleId: j, description: I, footerActions: L, toolbarActions: R, panel: z = !0, unit: B = E("shell:dataTable.recordUnit") }) {
	let [V, H] = (0, N.useState)([]), U = (0, N.useMemo)(() => [{
		id: "select",
		label: E("shell:dataTable.selectColumn"),
		width: 48,
		min: 48,
		max: 48,
		required: !0
	}, ...x.map((e, t) => ({
		...e,
		width: e.width ?? (t === 0 ? 320 : 160),
		min: e.min ?? (t === 0 ? 320 : 96),
		flex: e.flex ?? t === 0,
		required: t === 0
	}))], [x]), W = k(`data:${g}`, U), [G, K] = (0, N.useState)({
		pageIndex: 0,
		pageSize: 20
	}), q = M(() => T([])), J = Math.max(1, Math.ceil(v.length / G.pageSize)), Y = Math.min(G.pageIndex, J - 1), X = Object.fromEntries(w.map((e) => [e, !0])), Z = (0, N.useMemo)(() => {
		let e = y();
		return e.columns([e.display({
			id: "select",
			header: ({ table: e }) => /* @__PURE__ */ (0, P.jsx)(h, {
				table: e,
				label: E("shell:dataTable.selectAll", { label: g })
			}),
			cell: ({ row: e }) => /* @__PURE__ */ (0, P.jsx)(o, {
				slot: null,
				"aria-label": E("shell:dataTable.selectRow", { name: C(e.original) }),
				isSelected: e.getIsSelected(),
				onChange: (t) => e.toggleSelected(t)
			})
		}), ...x.map((t) => e.accessor((e) => t.value?.(e) ?? "", {
			id: t.id,
			header: t.label,
			enableSorting: !!t.value,
			sortFn: (e, n) => {
				let r = t.value(e.original), i = t.value(n.original);
				return typeof r == "number" && typeof i == "number" ? r - i : String(r).localeCompare(String(i), "zh-CN", { numeric: !0 });
			},
			cell: ({ row: e }) => t.render(e.original)
		}))]);
	}, [
		x,
		g,
		C
	]), Q = O({
		features: F,
		data: v,
		columns: Z,
		getRowId: S,
		state: {
			sorting: V,
			rowSelection: X,
			pagination: {
				...G,
				pageIndex: Y
			},
			columnVisibility: W.visibility
		},
		onColumnVisibilityChange: W.change,
		onSortingChange: (e) => {
			H(e), K((e) => ({
				...e,
				pageIndex: 0
			}));
		},
		onPaginationChange: K,
		enableRowSelection: !0,
		onRowSelectionChange: (e) => {
			let t = typeof e == "function" ? e(X) : e;
			Object.values(t).some(Boolean) && q(), T(v.filter((e) => t[S(e)]).map(S));
		}
	}), $ = Q.getSelectedRowModel().rows.map((e) => e.original);
	return /* @__PURE__ */ (0, P.jsxs)("div", {
		"data-data-table-panel": z || void 0,
		className: z ? _({
			padding: "none",
			className: "flex flex-col gap-4 px-6 py-5 max-sm:px-4"
		}) : "flex min-w-0 flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, P.jsxs)("div", {
				"data-responsive-toolbar": "",
				role: "toolbar",
				"aria-label": E("shell:dataTable.toolbar", { label: g }),
				children: [/* @__PURE__ */ (0, P.jsxs)("div", {
					"data-toolbar-heading": "",
					children: [/* @__PURE__ */ (0, P.jsx)("h3", {
						id: j,
						className: "text-title-2-medium text-text-primary",
						children: A
					}), /* @__PURE__ */ (0, P.jsx)("span", {
						className: "text-body-2-regular tabular-nums text-text-secondary",
						children: `${v.length.toLocaleString()} ${B}`
					})]
				}), /* @__PURE__ */ (0, P.jsxs)("div", {
					"data-toolbar-actions": "",
					children: [
						R,
						/* @__PURE__ */ (0, P.jsx)(p, {
							preferences: W,
							label: g
						}),
						/* @__PURE__ */ (0, P.jsx)(u, {
							label: g,
							options: x.filter((e) => e.value).map((e) => ({
								id: e.id,
								label: e.label
							})),
							sorting: V,
							onChange: (e) => {
								H(e), K((e) => ({
									...e,
									pageIndex: 0
								}));
							}
						})
					]
				})]
			}),
			I ? /* @__PURE__ */ (0, P.jsx)("p", {
				className: "text-body-2-regular text-text-secondary",
				children: I
			}) : null,
			/* @__PURE__ */ (0, P.jsxs)(d, {
				label: E("shell:dataTable.bulkActions", { label: g }),
				visible: $.length > 0,
				count: E("shell:dataTable.selectedCount", {
					count: $.length,
					unit: B
				}),
				children: [D($, () => T([])), /* @__PURE__ */ (0, P.jsx)(a, {
					variant: "ghost",
					size: "small",
					onClick: () => T([]),
					children: E("shell:dataTable.clearSelection")
				})]
			}),
			/* @__PURE__ */ (0, P.jsx)(l, {
				follow: !0,
				preferences: W,
				onRowClick: (e) => Q.getRow(e)?.toggleSelected(),
				children: /* @__PURE__ */ (0, P.jsxs)(f, {
					"aria-label": g,
					size: "sm",
					sortDescriptor: V[0] ? {
						column: V[0].id,
						direction: V[0].desc ? "descending" : "ascending"
					} : void 0,
					onSortChange: (e) => Q.getColumn(String(e.column))?.toggleSorting(e.direction === "descending"),
					children: [/* @__PURE__ */ (0, P.jsxs)(i, { children: [Q.getHeaderGroups()[0].headers.map((e) => /* @__PURE__ */ (0, P.jsx)(t, {
						id: e.id,
						isRowHeader: e.id === x[0].id,
						allowsSorting: e.column.getCanSort(),
						...W.columnProps(e.id),
						children: ({ sortDirection: t }) => /* @__PURE__ */ (0, P.jsxs)(P.Fragment, { children: [/* @__PURE__ */ (0, P.jsxs)("span", {
							className: "flex items-center gap-0.5",
							children: [b(e.column.columnDef.header, e.getContext()), e.column.getCanSort() ? /* @__PURE__ */ (0, P.jsx)("span", {
								"data-sort-indicator": !0,
								"data-direction": t || void 0,
								children: /* @__PURE__ */ (0, P.jsx)(s, {})
							}) : null]
						}), /* @__PURE__ */ (0, P.jsx)(m, {
							preferences: W,
							id: e.id
						})] })
					}, e.id)), /* @__PURE__ */ (0, P.jsx)(t, {
						id: "remaining-space",
						"aria-label": E("shell:dataTable.spacerColumn"),
						"data-table-space": "",
						width: W.spaceWidth,
						minWidth: 0
					})] }), /* @__PURE__ */ (0, P.jsx)(e, {
						renderEmptyState: () => E("shell:dataTable.empty"),
						children: Q.getRowModel().rows.map((e) => /* @__PURE__ */ (0, P.jsxs)(n, {
							id: e.id,
							"data-board-selected": e.getIsSelected() || void 0,
							children: [e.getVisibleCells().map((e) => /* @__PURE__ */ (0, P.jsx)(r, { children: b(e.column.columnDef.cell, e.getContext()) }, e.id)), /* @__PURE__ */ (0, P.jsx)(r, { "data-table-space": "" })]
						}, e.id))
					})]
				})
			}),
			/* @__PURE__ */ (0, P.jsx)(c, {
				label: g,
				total: v.length,
				pagination: {
					...G,
					pageIndex: Y
				},
				onChange: K,
				unit: B
			}),
			L ? /* @__PURE__ */ (0, P.jsx)("div", {
				className: "flex flex-wrap items-center justify-end gap-2 border-t border-separator-border pt-4",
				children: L
			}) : null
		]
	});
}
export { I as DataTable };

//# debugId=52440621-eae9-4c48-b8fd-9760b9a90b0b