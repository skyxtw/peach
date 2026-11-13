(function() {
	try {
		var e = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, t = new e.Error().stack;
		t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "bca450ee-266d-42a3-a1d6-db44088198c4", e._sentryDebugIdIdentifier = "sentry-dbid-bca450ee-266d-42a3-a1d6-db44088198c4");
	} catch {}
})();
import { $76d00c5a4edb230a$export$76ccd210b9029917 as e, $76d00c5a4edb230a$export$816b5d811295e6bc as t, $76d00c5a4edb230a$export$b59bdbef9ce70de2 as n, $76d00c5a4edb230a$export$f6f0c3fe4ec306ea as r, $76d00c5a4edb230a$export$f850895b287ef28e as i, Button as a, Checkbox as o, ChevronSortDown as s, DataTableFooter as c, DataTableFrame as l, DataTableSort as u, SelectionDock as d, Table as f, TableColumnControls as p, TableColumnResizer as m, TableSelectionHeader as h, __toESM as g, cardClass as _, columnVisibilityFeature as v, createColumnHelper as y, flexRender as b, require_jsx_runtime as x, require_react as S, rowPaginationFeature as C, rowSelectionFeature as w, rowSortingFeature as T, tableFeatures as E, useTable as D, useTablePreferences as O } from "./peach-app.js";
import { createPaginatedRowModel as k, createSortedRowModel as A, useTableSelection as j } from "./peach-app.use-table-selection-CnuGRvGn.js";
// src/react/components/data-table.tsx
var M = /* @__PURE__ */ g(S(), 1), N = x(), P = E({
	rowSortingFeature: T,
	rowSelectionFeature: w,
	rowPaginationFeature: C,
	columnVisibilityFeature: v,
	sortedRowModel: A(),
	paginatedRowModel: k()
});
function F({ label: g, items: v, columns: x, rowId: S, rowLabel: C, selected: w, onSelected: T, actions: E, title: k = g, titleId: A, description: F, footerActions: I, toolbarActions: L, panel: R = !0, unit: z = "条记录" }) {
	let [B, V] = (0, M.useState)([]), H = (0, M.useMemo)(() => [{
		id: "select",
		label: "选择",
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
	}))], [x]), U = O(`data:${g}`, H), [W, G] = (0, M.useState)({
		pageIndex: 0,
		pageSize: 20
	}), K = j(() => T([])), q = Math.max(1, Math.ceil(v.length / W.pageSize)), J = Math.min(W.pageIndex, q - 1), Y = Object.fromEntries(w.map((e) => [e, !0])), X = (0, M.useMemo)(() => {
		let e = y();
		return e.columns([e.display({
			id: "select",
			header: ({ table: e }) => /* @__PURE__ */ (0, N.jsx)(h, {
				table: e,
				label: `全选${g}`
			}),
			cell: ({ row: e }) => /* @__PURE__ */ (0, N.jsx)(o, {
				slot: null,
				"aria-label": `选择 ${C(e.original)}`,
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
	]), Z = D({
		features: P,
		data: v,
		columns: X,
		getRowId: S,
		state: {
			sorting: B,
			rowSelection: Y,
			pagination: {
				...W,
				pageIndex: J
			},
			columnVisibility: U.visibility
		},
		onColumnVisibilityChange: U.change,
		onSortingChange: (e) => {
			V(e), G((e) => ({
				...e,
				pageIndex: 0
			}));
		},
		onPaginationChange: G,
		enableRowSelection: !0,
		onRowSelectionChange: (e) => {
			let t = typeof e == "function" ? e(Y) : e;
			Object.values(t).some(Boolean) && K(), T(v.filter((e) => t[S(e)]).map(S));
		}
	}), Q = Z.getSelectedRowModel().rows.map((e) => e.original);
	return /* @__PURE__ */ (0, N.jsxs)("div", {
		"data-data-table-panel": R || void 0,
		className: R ? _({
			padding: "none",
			className: "flex flex-col gap-4 px-6 py-5 max-sm:px-4"
		}) : "flex min-w-0 flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, N.jsxs)("div", {
				"data-responsive-toolbar": "",
				role: "toolbar",
				"aria-label": `${g}工具栏`,
				children: [/* @__PURE__ */ (0, N.jsxs)("div", {
					"data-toolbar-heading": "",
					children: [/* @__PURE__ */ (0, N.jsx)("h3", {
						id: A,
						className: "text-title-2-medium text-text-primary",
						children: k
					}), /* @__PURE__ */ (0, N.jsx)("span", {
						className: "text-body-2-regular tabular-nums text-text-secondary",
						children: `${v.length.toLocaleString()} ${z}`
					})]
				}), /* @__PURE__ */ (0, N.jsxs)("div", {
					"data-toolbar-actions": "",
					children: [
						L,
						/* @__PURE__ */ (0, N.jsx)(p, {
							preferences: U,
							label: g
						}),
						/* @__PURE__ */ (0, N.jsx)(u, {
							label: g,
							options: x.filter((e) => e.value).map((e) => ({
								id: e.id,
								label: e.label
							})),
							sorting: B,
							onChange: (e) => {
								V(e), G((e) => ({
									...e,
									pageIndex: 0
								}));
							}
						})
					]
				})]
			}),
			F ? /* @__PURE__ */ (0, N.jsx)("p", {
				className: "text-body-2-regular text-text-secondary",
				children: F
			}) : null,
			/* @__PURE__ */ (0, N.jsxs)(d, {
				label: `${g}批量操作`,
				visible: Q.length > 0,
				count: `已选 ${Q.length.toLocaleString()} ${z}`,
				children: [E(Q, () => T([])), /* @__PURE__ */ (0, N.jsx)(a, {
					variant: "ghost",
					size: "small",
					onClick: () => T([]),
					children: "取消选择"
				})]
			}),
			/* @__PURE__ */ (0, N.jsx)(l, {
				follow: !0,
				preferences: U,
				onRowClick: (e) => Z.getRow(e)?.toggleSelected(),
				children: /* @__PURE__ */ (0, N.jsxs)(f, {
					"aria-label": g,
					size: "sm",
					sortDescriptor: B[0] ? {
						column: B[0].id,
						direction: B[0].desc ? "descending" : "ascending"
					} : void 0,
					onSortChange: (e) => Z.getColumn(String(e.column))?.toggleSorting(e.direction === "descending"),
					children: [/* @__PURE__ */ (0, N.jsxs)(i, { children: [Z.getHeaderGroups()[0].headers.map((e) => /* @__PURE__ */ (0, N.jsx)(t, {
						id: e.id,
						isRowHeader: e.id === x[0].id,
						allowsSorting: e.column.getCanSort(),
						...U.columnProps(e.id),
						children: ({ sortDirection: t }) => /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [/* @__PURE__ */ (0, N.jsxs)("span", {
							className: "flex items-center gap-0.5",
							children: [b(e.column.columnDef.header, e.getContext()), e.column.getCanSort() ? /* @__PURE__ */ (0, N.jsx)("span", {
								"data-sort-indicator": !0,
								"data-direction": t || void 0,
								children: /* @__PURE__ */ (0, N.jsx)(s, {})
							}) : null]
						}), /* @__PURE__ */ (0, N.jsx)(m, {
							preferences: U,
							id: e.id
						})] })
					}, e.id)), /* @__PURE__ */ (0, N.jsx)(t, {
						id: "remaining-space",
						"aria-label": "行空白区域",
						"data-table-space": "",
						width: U.spaceWidth,
						minWidth: 0
					})] }), /* @__PURE__ */ (0, N.jsx)(e, {
						renderEmptyState: () => "没有记录",
						children: Z.getRowModel().rows.map((e) => /* @__PURE__ */ (0, N.jsxs)(n, {
							id: e.id,
							"data-board-selected": e.getIsSelected() || void 0,
							children: [e.getVisibleCells().map((e) => /* @__PURE__ */ (0, N.jsx)(r, { children: b(e.column.columnDef.cell, e.getContext()) }, e.id)), /* @__PURE__ */ (0, N.jsx)(r, { "data-table-space": "" })]
						}, e.id))
					})]
				})
			}),
			/* @__PURE__ */ (0, N.jsx)(c, {
				label: g,
				total: v.length,
				pagination: {
					...W,
					pageIndex: J
				},
				onChange: G,
				unit: z
			}),
			I ? /* @__PURE__ */ (0, N.jsx)("div", {
				className: "flex flex-wrap items-center justify-end gap-2 border-t border-separator-border pt-4",
				children: I
			}) : null
		]
	});
}
export { F as DataTable };

//# debugId=bca450ee-266d-42a3-a1d6-db44088198c4