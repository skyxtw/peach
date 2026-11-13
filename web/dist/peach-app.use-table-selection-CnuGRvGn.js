(function() {
	try {
		var e = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, t = new e.Error().stack;
		t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "3b1ffe1f-fc6a-4dd6-881b-26bb8533a510", e._sentryDebugIdIdentifier = "sentry-dbid-3b1ffe1f-fc6a-4dd6-881b-26bb8533a510");
	} catch {}
})();
import { __toESM as e, autoResetPageIndex as t, column_getCanSort as n, column_getSortFn as r, copyInstancePropertiesWithoutMemos as i, expandRowModel as a, getDefaultPaginationState as o, require_react as s, skipFirstRun as c, tableMemo as l } from "./peach-app.js";
// node_modules/@tanstack/table-core/dist/features/row-pagination/createPaginatedRowModel.js
function u() {
	return (e) => {
		let t = e;
		return l({
			feature: "rowPaginationFeature",
			table: t,
			fnName: "table.getPaginatedRowModel",
			memoDeps: () => [
				t.getPrePaginatedRowModel(),
				t.atoms.pagination?.get(),
				t.options.paginateExpandedRows ? void 0 : t.atoms.expanded?.get()
			],
			fn: () => d(t)
		});
	};
}
function d(e) {
	let t = e.getPrePaginatedRowModel(), n = e.atoms.pagination?.get();
	if (!t.rows.length) return t;
	let { pageSize: r, pageIndex: i } = n ?? o(), { rows: s, flatRows: c, rowsById: l } = t, u = s;
	if (r !== Infinity || i !== 0) {
		let e = r * i, t = e + r;
		u = s.slice(e, t);
	}
	let d;
	d = e.options.paginateExpandedRows ? {
		rows: u,
		flatRows: c,
		rowsById: l
	} : a(e, {
		rows: u,
		flatRows: c,
		rowsById: l
	}), d.flatRows = [];
	let f = /* @__PURE__ */ new Set(), p = (e) => {
		f.has(e.id) || (f.add(e.id), d.flatRows.push(e), e.subRows.length && e.subRows.forEach(p));
	};
	return d.rows.forEach(p), d;
}
// node_modules/@tanstack/table-core/dist/features/row-sorting/createSortedRowModel.js
function f() {
	return (e) => {
		let n = e;
		return l({
			feature: "rowSortingFeature",
			table: n,
			fnName: "table.getSortedRowModel",
			memoDeps: () => [n.atoms.sorting?.get(), n.getPreSortedRowModel()],
			fn: () => p(n),
			onAfterUpdate: c(() => t(n))
		});
	};
}
function p(e) {
	let t = e.getPreSortedRowModel(), a = e.atoms.sorting?.get();
	if (!t.rows.length || !a?.length) return t;
	let o = [], s = a.filter((t) => {
		let r = e.getColumn(t.id);
		return r ? n(r) : !1;
	});
	if (!s.length) return t;
	let c = [];
	for (let t = 0; t < s.length; t++) {
		let n = s[t], i = e.getColumn(n.id);
		i && c.push({
			id: n.id,
			desc: n.desc,
			sortUndefined: i.columnDef.sortUndefined,
			invertSorting: i.columnDef.invertSorting,
			sortFn: r(i)
		});
	}
	let l = (e, t) => {
		for (let n = 0; n < c.length; n++) {
			let r = c[n], i = r.sortUndefined, a = r.desc, o = 0;
			if (i) {
				let n = e.getValue(r.id), a = t.getValue(r.id), s = n === void 0, c = a === void 0;
				if (s && c) continue;
				if (s || c) {
					if (i === "first") return s ? -1 : 1;
					if (i === "last") return s ? 1 : -1;
					o = s ? i : -i;
				}
			}
			if (o === 0 && (o = r.sortFn(e, t, r.id)), o !== 0) return a && (o *= -1), r.invertSorting && (o *= -1), o;
		}
		return e.index - t.index;
	}, u = (e) => {
		let t = e.slice();
		t.sort(l);
		let n = !1;
		for (let r = 0; r < t.length; r++) {
			let a = t[r];
			a !== e[r] && (n = !0);
			let s = o.length;
			if (o.push(a), a.subRows.length) {
				let e = u(a.subRows);
				if (e.changed) {
					let c = Object.create(Object.getPrototypeOf(a));
					i(c, a), c.subRows = e.rows, t[r] = c, o[s] = c, n = !0;
				}
			}
		}
		return {
			rows: t,
			changed: n
		};
	};
	return {
		rows: u(t.rows).rows,
		flatRows: o,
		rowsById: t.rowsById
	};
}
// src/react/components/use-table-selection.ts
var m = /* @__PURE__ */ e(s(), 1), h = /* @__PURE__ */ new Map();
function g(e) {
	let t = (0, m.useId)(), n = (0, m.useRef)(e);
	return n.current = e, (0, m.useEffect)(() => (h.set(t, () => n.current()), () => {
		h.delete(t);
	}), [t]), (0, m.useCallback)(() => {
		for (let [e, n] of h) e !== t && n();
	}, [t]);
}
export { u as createPaginatedRowModel, f as createSortedRowModel, g as useTableSelection };

//# debugId=3b1ffe1f-fc6a-4dd6-881b-26bb8533a510