(function() {
	try {
		var e = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, t = new e.Error().stack;
		t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "8b9a1248-bf4a-4f4d-b6e1-690a112365f6", e._sentryDebugIdIdentifier = "sentry-dbid-8b9a1248-bf4a-4f4d-b6e1-690a112365f6");
	} catch {}
})();
import { $542a13ca2fa5b484$export$5b6b19405a83ff9d as e, $b4f18e3395fe64d7$export$3d96ec278d3efce4 as t, $b4f18e3395fe64d7$export$3e41faf802a29e71 as n, $b4f18e3395fe64d7$export$b2539bed5023c21c as r, Button as i, ButtonLink as a, Disclosure as o, E3 as s, EmptyState as c, FLOW_LABEL_X as l, FLOW_VIEWBOX as u, Gg as d, IDLE_POLL_MS as f, Input as p, M6 as m, MENU_ITEM as h, MENU_ITEM_INTERACTIVE as g, MENU_POPOVER_SURFACE as _, MenuDialog as v, Note as y, OV as b, Progress as x, Rf as S, SEGMENT as ee, SEGMENTED_TRACK as te, STAT_STRIP as ne, SegmentedTabList as re, Select$1 as ie, SelectItem as ae, StatCard as C, TASTE_REFRESH_KEY as oe, TASTE_WINDOWS as se, TaskProgress as ce, Wt as w, Xt as le, _8 as T, __toESM as ue, aB as de, avatarInner as fe, busyProps as E, cB as pe, cardClass as D, clsx as O, configureTasteBrowser as k, confirmModal as A, cx as me, errorMessage as j, f1 as M, fetchTaste as he, fetchTasteJob as ge, firstGrapheme as N, flowGraph as _e, flowLabel as ve, fmtSize as ye, g4 as be, historySpan as xe, importTasteExport as Se, keepPreviousData as Ce, mM as we, pv as Te, queryClient as P, r2 as Ee, radarRows as De, rankDetail as Oe, rankShares as ke, removeTasteSource as Ae, require_jsx_runtime as je, require_react as Me, siteMarkUrl as Ne, startTasteRefresh as Pe, statCardClass as Fe, tasteDate as Ie, tasteDimensions as Le, tasteHours as Re, tasteKey as F, tasteRefetchInterval as ze, tasteTime as Be, topScores as Ve, uo as He, useBackgroundJob as Ue, useMutation as We, useQuery as Ge } from "./peach-app.js";
import { ActivityHeat as Ke, BAR_DOMAIN as qe, ExpandableRanking as Je, PolarAngleAxis as Ye, Polygon as Xe, barLabel as Ze, selectPolarAxisScale as Qe, selectPolarAxisTicks as I } from "./peach-app.expandable-ranking-BvMp3uyZ.js";
import { LEGACY_AVATAR_IMG as $e } from "./peach-app.legacy-avatar-NSITxLRS.js";
import { Page as et } from "./peach-app.page-QAncjzM1.js";
import { ActivePoints as tt, AnimatedItems as nt, CHART_CARD as rt, CHART_COLORS as it, CartesianLabelListContextProvider as at, CategoryTick as ot, ChartBackground as st, ChartContainer as ct, ChartHead as lt, ChartLegend as ut, ChartLegendContent as dt, ChartTip as ft, ChartTooltip as pt, ChartTooltipContent as mt, DefaultZIndexes as ht, Dots as gt, EvilBarChart as _t, LabelListFromLabelProp as vt, Layer as L, LoadingIndicator as yt, PolarChart as bt, PolarLabelContextProvider as xt, PolarLabelFromLabelProp as St, RegisterGraphicalItemId as Ct, SetPolarGraphicalItem as wt, SetPolarLegendPayload as Tt, SetTooltipEntrySettings as Et, Text as Dt, ZIndexLayer as Ot, adaptEventsOfChild as kt, addRadiusAxis as At, arrayTooltipSearcher as jt, categoryAxisWidth as Mt, cn as Nt, createSelector as R, defaultPolarChartProps as Pt, defaultPolarRadiusAxisProps as Ft, fitLabel as It, getAxisTypeBasedOnLayout as Lt, getBandSizeOfAxis as Rt, getClassNameFromUnknown as zt, getColorsCount as Bt, getTooltipNameProp as Vt, getValueByDataKey as Ht, identity as Ut, interpolate as z, isArrayLike as Wt, isCategoricalAxis as Gt, isNullish as Kt, iteratee as qt, matchAnimationItems as Jt, matchByIndex as Yt, noop as Xt, polarToCartesian as B, removeRadiusAxis as Zt, resolveDefaultProps as V, selectAngleAxis as Qt, selectChartDataAndAlwaysIgnoreIndexes as $t, selectChartLayout as en, selectPolarViewBox as tn, selectRadiusAxis as nn, selectUnfilteredPolarItems as rn, svgPropertiesAndEvents as an, svgPropertiesNoEvents as H, svgPropertiesNoEventsFromUnknown as on, tone as sn, useAnimationCallbacks as cn, useAnimationStartSnapshot as ln, useAppDispatch as un, useAppSelector as U, useIsPanorama as dn, usePolarChartLayout as fn } from "./peach-app.chart-tip-CRxYp6KT.js";
import { BrowserIcon as pn } from "./peach-app.browser-icon-N9Od-bAf.js";
var mn = R([(e, t) => I(e, "angleAxis", t, !1)], (e) => {
	if (e) return e.map((e) => e.coordinate);
}), hn = R([(e, t) => I(e, "radiusAxis", t, !1)], (e) => {
	if (e) return e.map((e) => e.coordinate);
}), W = /* @__PURE__ */ ue(Me()), gn = [
	"gridType",
	"radialLines",
	"angleAxisId",
	"radiusAxisId",
	"cx",
	"cy",
	"innerRadius",
	"outerRadius",
	"polarAngles",
	"polarRadius",
	"zIndex"
];
function _n(e, t) {
	if (e == null) return {};
	var n, r, i = vn(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function vn(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function G() {
	return G = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, G.apply(null, arguments);
}
function yn(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function bn(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? yn(Object(n), !0).forEach(function(t) {
			xn(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : yn(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function xn(e, t, n) {
	return (t = Sn(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Sn(e) {
	var t = Cn(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Cn(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var wn = (e, t, n, r) => {
	var i = "";
	return r.forEach((r, a) => {
		var o = B(t, n, e, r);
		i += a ? `L ${o.x},${o.y}` : `M ${o.x},${o.y}`;
	}), i += "Z", i;
}, Tn = (e) => {
	var t = e.cx, n = e.cy, r = e.innerRadius, i = e.outerRadius, a = e.polarAngles, o = e.radialLines;
	if (!a || !a.length || !o) return null;
	var s = bn({}, H(e));
	return /*#__PURE__*/ W.createElement("g", { className: "recharts-polar-grid-angle" }, a.map((e) => {
		var a = B(t, n, r, e), o = B(t, n, i, e);
		return /*#__PURE__*/ W.createElement("line", G({ key: `line-${e}` }, s, {
			x1: a.x,
			y1: a.y,
			x2: o.x,
			y2: o.y
		}));
	}));
}, En = (e) => {
	var t = e.cx, n = e.cy, r = e.radius, i = bn({}, H(e));
	return /*#__PURE__*/ W.createElement("circle", G({}, i, {
		className: O("recharts-polar-grid-concentric-circle", e.className),
		cx: t,
		cy: n,
		r
	}));
}, Dn = (e) => {
	var t = e.radius, n = bn({}, H(e));
	return /*#__PURE__*/ W.createElement("path", G({}, n, {
		className: O("recharts-polar-grid-concentric-polygon", e.className),
		d: wn(t, e.cx, e.cy, e.polarAngles)
	}));
}, On = (e) => {
	var t = e.polarRadius, n = e.gridType;
	if (!t || !t.length) return null;
	var r = Math.max(...t), i = e.fill && e.fill !== "none";
	return /*#__PURE__*/ W.createElement("g", { className: "recharts-polar-grid-concentric" }, i && n === "circle" && /*#__PURE__*/ W.createElement(En, G({}, e, { radius: r })), i && n !== "circle" && /*#__PURE__*/ W.createElement(Dn, G({}, e, { radius: r })), t.map((t, r) => {
		var i = r;
		return n === "circle" ? /*#__PURE__*/ W.createElement(En, G({ key: i }, e, {
			fill: "none",
			radius: t
		})) : /*#__PURE__*/ W.createElement(Dn, G({ key: i }, e, {
			fill: "none",
			radius: t
		}));
	}));
}, kn = {
	angleAxisId: 0,
	radiusAxisId: 0,
	gridType: "polygon",
	radialLines: !0,
	zIndex: ht.grid,
	stroke: "#ccc",
	strokeWidth: 1,
	fill: "none"
}, An = (e) => {
	var t = V(e, kn), n = t.gridType, r = t.radialLines, i = t.angleAxisId, a = t.radiusAxisId, o = t.cx, s = t.cy, c = t.innerRadius, l = t.outerRadius, u = t.polarAngles, d = t.polarRadius, f = t.zIndex, p = _n(t, gn), m = U(tn), h = U((e) => mn(e, i)), g = U((e) => hn(e, a)), _ = Array.isArray(u) ? u : h, v = Array.isArray(d) ? d : g;
	if (_ == null || v == null) return null;
	var y = bn({
		cx: m?.cx ?? o ?? 0,
		cy: m?.cy ?? s ?? 0,
		innerRadius: m?.innerRadius ?? c ?? 0,
		outerRadius: m?.outerRadius ?? l ?? 0,
		polarAngles: _,
		polarRadius: v,
		zIndex: f
	}, p);
	return y.outerRadius <= 0 ? null : /*#__PURE__*/ W.createElement(Ot, { zIndex: y.zIndex }, /*#__PURE__*/ W.createElement("g", { className: "recharts-polar-grid" }, /*#__PURE__*/ W.createElement(On, G({
		gridType: n,
		radialLines: r
	}, y, {
		polarAngles: _,
		polarRadius: v
	})), /*#__PURE__*/ W.createElement(Tn, G({
		gridType: n,
		radialLines: r
	}, y, {
		polarAngles: _,
		polarRadius: v
	}))));
};
An.displayName = "PolarGrid";
// node_modules/es-toolkit/dist/compat/_internal/toArray.mjs
function jn(e) {
	return Array.isArray(e) ? e : Array.from(e);
}
// node_modules/es-toolkit/dist/compat/math/maxBy.mjs
function Mn(e, t = Ut) {
	if (e == null) return;
	let n = jn(e);
	if (n.length === 0) return;
	let r = qt(t), i, a;
	for (let e = 0; e < n.length; e++) {
		let t = n[e], o = r(t, e, n);
		o == null || Number.isNaN(o) || typeof o == "symbol" || (a === void 0 || o > a) && (a = o, i = t);
	}
	return i;
}
// node_modules/es-toolkit/dist/compat/math/minBy.mjs
function Nn(e, t = Ut) {
	if (e == null) return;
	let n = jn(e);
	if (n.length === 0) return;
	let r = qt(t), i, a;
	for (let e = 0; e < n.length; e++) {
		let t = n[e], o = r(t, e, n);
		o == null || Number.isNaN(o) || typeof o == "symbol" || (a === void 0 || o < a) && (a = o, i = t);
	}
	return i;
}
// node_modules/recharts/es6/polar/PolarRadiusAxis.js
var Pn = ["type"], Fn = [
	"cx",
	"cy",
	"angle",
	"axisLine"
], In = [
	"angle",
	"tickFormatter",
	"stroke",
	"tick"
];
function K() {
	return K = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, K.apply(null, arguments);
}
function Ln(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function q(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Ln(Object(n), !0).forEach(function(t) {
			Rn(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ln(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Rn(e, t, n) {
	return (t = zn(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function zn(e) {
	var t = Bn(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Bn(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function Vn(e, t) {
	if (e == null) return {};
	var n, r, i = Hn(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function Hn(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var Un = "radiusAxis";
function Wn(e) {
	var t = un(), n = fn(), r = (0, W.useMemo)(() => {
		var t = e.type, r = Vn(e, Pn), i = Lt(n, "radiusAxis", t);
		if (i != null) return q(q({}, r), {}, { type: i });
	}, [e, n]);
	return (0, W.useEffect)(() => r == null ? Xt : (t(At(r)), () => {
		t(Zt(r));
	}), [t, r]), null;
}
var Gn = (e, t, n, r) => {
	var i = e.coordinate;
	return B(n, r, i, t);
}, Kn = (e) => {
	var t;
	switch (e) {
		case "left":
			t = "end";
			break;
		case "right":
			t = "start";
			break;
		default: t = "middle";
	}
	return t;
}, qn = (e, t, n, r) => {
	var i = Mn(r, (e) => e.coordinate || 0);
	return {
		cx: t,
		cy: n,
		startAngle: e,
		endAngle: e,
		innerRadius: Nn(r, (e) => e.coordinate || 0)?.coordinate || 0,
		outerRadius: i?.coordinate || 0,
		clockWise: !1
	};
}, Jn = (e, t) => {
	var n = e.cx, r = e.cy, i = e.angle, a = e.axisLine, o = Vn(e, Fn), s = t.reduce((e, t) => [Math.min(e[0], t.coordinate), Math.max(e[1], t.coordinate)], [Infinity, -Infinity]), c = B(n, r, s[0], i), l = B(n, r, s[1], i), u = q(q(q({}, H(o)), {}, { fill: "none" }, H(a)), {}, {
		x1: c.x,
		y1: c.y,
		x2: l.x,
		y2: l.y
	});
	return /*#__PURE__*/ W.createElement("line", K({ className: "recharts-polar-radius-axis-line" }, u));
}, Yn = (e, t, n) => /*#__PURE__*/ W.isValidElement(e) ? /*#__PURE__*/ W.cloneElement(e, t) : typeof e == "function" ? e(t) : /*#__PURE__*/ W.createElement(Dt, K({}, t, { className: "recharts-polar-radius-axis-tick-value" }), n), Xn = (e, t) => {
	var n = e.angle, r = e.tickFormatter, i = e.stroke, a = e.tick, o = Vn(e, In), s = Kn(e.orientation), c = H(o), l = on(a), u = t.map((t, o) => {
		var u = Gn(t, e.angle, e.cx, e.cy), d = q(q(q(q({
			textAnchor: s,
			transform: `rotate(${90 - n}, ${u.x}, ${u.y})`
		}, c), {}, {
			stroke: "none",
			fill: i
		}, l), {}, { index: o }, u), {}, { payload: t });
		return /*#__PURE__*/ W.createElement(L, K({
			className: O("recharts-polar-radius-axis-tick", zt(a)),
			key: `tick-${t.coordinate}`
		}, kt(e, t, o)), Yn(a, d, r ? r(t.value, o) : t.value));
	});
	return /*#__PURE__*/ W.createElement(L, { className: "recharts-polar-radius-axis-ticks" }, u);
}, Zn = (e) => {
	var t = e.radiusAxisId, n = U(tn), r = U((e) => Qe(e, "radiusAxis", t)), i = U((e) => I(e, "radiusAxis", t, !1));
	if (n == null || !i || !i.length || r == null) return null;
	var a = q(q({}, e), {}, { scale: r }, n), o = a.tick, s = a.axisLine;
	return /*#__PURE__*/ W.createElement(Ot, { zIndex: a.zIndex }, /*#__PURE__*/ W.createElement(L, { className: O("recharts-polar-radius-axis", Un, a.className) }, s && Jn(a, i), o && Xn(a, i), /*#__PURE__*/ W.createElement(xt, qn(a.angle, a.cx, a.cy, i), /*#__PURE__*/ W.createElement(St, { label: a.label }), a.children)));
};
function Qn(e) {
	var t = V(e, Ft);
	return /*#__PURE__*/ W.createElement(W.Fragment, null, /*#__PURE__*/ W.createElement(Wn, {
		domain: t.domain,
		id: t.radiusAxisId,
		scale: t.scale,
		type: t.type,
		dataKey: t.dataKey,
		unit: void 0,
		name: t.name,
		allowDuplicatedCategory: t.allowDuplicatedCategory,
		allowDataOverflow: t.allowDataOverflow,
		reversed: t.reversed,
		includeHidden: t.includeHidden,
		allowDecimals: t.allowDecimals,
		niceTicks: t.niceTicks ?? "auto",
		ticks: t.ticks,
		tickCount: t.tickCount,
		tick: t.tick
	}), /*#__PURE__*/ W.createElement(Zn, t));
}
Qn.displayName = "PolarRadiusAxis";
// node_modules/es-toolkit/dist/array/last.mjs
function $n(e) {
	return e[e.length - 1];
}
// node_modules/es-toolkit/dist/compat/array/last.mjs
function er(e) {
	if (Wt(e) && e.length !== 0) return $n(jn(e));
}
// node_modules/recharts/es6/state/selectors/radarSelectors.js
function tr(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function nr(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? tr(Object(n), !0).forEach(function(t) {
			rr(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : tr(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function rr(e, t, n) {
	return (t = ir(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function ir(e) {
	var t = ar(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function ar(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var or = (e, t) => Qe(e, "radiusAxis", t), sr = R([or], (e) => {
	if (e != null) return { scale: e };
}), cr = R([nn, or], (e, t) => {
	if (e != null && t != null) return nr(nr({}, e), {}, { scale: t });
}), lr = (e, t, n, r) => I(e, "radiusAxis", t, r), ur = (e, t, n) => Qt(e, n), dr = (e, t, n) => Qe(e, "angleAxis", n), fr = R([ur, dr], (e, t) => {
	if (e != null && t != null) return nr(nr({}, e), {}, { scale: t });
}), pr = (e, t, n, r) => I(e, "angleAxis", n, r), mr = R([
	ur,
	dr,
	tn
], (e, t, n) => {
	if (n != null && t != null) return {
		scale: t,
		type: e.type,
		dataKey: e.dataKey,
		cx: n.cx,
		cy: n.cy
	};
}), hr = (e, t, n, r, i) => i, gr = R([
	en,
	cr,
	lr,
	fr,
	pr
], (e, t, n, r, i) => Gt(e, "radiusAxis") ? Rt(t, n, !1) : Rt(r, i, !1)), _r = R([rn, hr], (e, t) => {
	if (e != null) return e.find((e) => e.type === "radar" && t === e.id)?.dataKey;
}), vr = R([
	sr,
	mr,
	$t,
	_r,
	gr
], (e, t, n, r, i) => {
	var a = n.chartData, o = n.dataStartIndex, s = n.dataEndIndex;
	if (e != null && t != null && a != null && i != null && r != null) return Ar({
		radiusAxis: e,
		angleAxis: t,
		displayedData: a.slice(o, s + 1),
		dataKey: r,
		bandSize: i
	});
}), yr = ["id"];
function J() {
	return J = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, J.apply(null, arguments);
}
function br(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Y(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? br(Object(n), !0).forEach(function(t) {
			xr(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : br(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function xr(e, t, n) {
	return (t = Sr(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Sr(e) {
	var t = Cr(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Cr(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function wr(e, t) {
	if (e == null) return {};
	var n, r, i = Tr(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function Tr(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function Er(e, t) {
	return e && e !== "none" ? e : t;
}
var Dr = (e) => {
	var t = e.dataKey, n = e.name, r = e.stroke, i = e.fill, a = e.legendType;
	return [{
		inactive: e.hide,
		dataKey: t,
		type: a,
		color: Er(r, i),
		value: Vt(n, t),
		payload: e
	}];
}, Or = /*#__PURE__*/ W.memo((e) => {
	var t = e.dataKey, n = e.stroke, r = e.strokeWidth, i = e.fill, a = e.name, o = e.hide, s = e.tooltipType, c = e.id, l = {
		dataDefinedOnItem: void 0,
		getPosition: Xt,
		settings: {
			stroke: n,
			strokeWidth: r,
			fill: i,
			nameKey: void 0,
			dataKey: t,
			name: Vt(a, t),
			hide: o,
			type: s,
			color: Er(n, i),
			unit: "",
			graphicalItemId: c
		}
	};
	return /*#__PURE__*/ W.createElement(Et, { tooltipEntrySettings: l });
});
function kr(e) {
	var t = e.points, n = e.props, r = n.dot, i = n.dataKey;
	n.id;
	var a = wr(n, yr), o = H(a);
	return /*#__PURE__*/ W.createElement(gt, {
		points: t,
		dot: r,
		className: "recharts-radar-dots",
		dotClassName: "recharts-radar-dot",
		dataKey: i,
		baseProps: o
	});
}
function Ar(e) {
	var t = e.radiusAxis, n = e.angleAxis, r = e.displayedData, i = e.dataKey, a = e.bandSize, o = n.cx, s = n.cy, c = !1, l = [], u = n.type === "number" ? 0 : a ?? 0;
	r.forEach((e, r) => {
		var a = Ht(e, n.dataKey, r), d = Ht(e, i), f = (n.scale.map(a) ?? 0) + u, p = Array.isArray(d) ? er(d) : d, m = Kt(p) ? 0 : t.scale.map(p) ?? 0;
		Array.isArray(d) && d.length >= 2 && (c = !0), l.push(Y(Y({}, B(o, s, m, f)), {}, {
			name: a,
			value: d,
			cx: o,
			cy: s,
			radius: m,
			angle: f,
			payload: e
		}));
	});
	var d = [];
	return c && l.forEach((e) => {
		if (Array.isArray(e.value)) {
			var n = e.value[0], r = Kt(n) ? 0 : t.scale.map(n) ?? 0;
			d.push(Y(Y({}, e), {}, { radius: r }, B(o, s, r, e.angle)));
		} else d.push(e);
	}), {
		points: l,
		isRange: c,
		baseLinePoints: d
	};
}
function jr(e) {
	var t = e.showLabels, n = e.points, r = e.children, i = n.map((e) => {
		var t = {
			x: e.x,
			y: e.y,
			width: 0,
			lowerWidth: 0,
			upperWidth: 0,
			height: 0
		};
		return Y(Y({}, t), {}, {
			value: e.value ?? "",
			payload: e.payload,
			parentViewBox: void 0,
			viewBox: t,
			fill: void 0
		});
	});
	return /*#__PURE__*/ W.createElement(at, { value: t ? i : void 0 }, r);
}
function Mr(e) {
	var t = e.points, n = e.baseLinePoints, r = e.props;
	if (t == null) return null;
	var i = r.shape, a = r.isRange, o = r.connectNulls, s = /*#__PURE__*/ W.isValidElement(i) ? /*#__PURE__*/ W.cloneElement(i, Y(Y({}, r), {}, { points: t })) : typeof i == "function" ? i(Y(Y({}, r), {}, { points: t })) : /*#__PURE__*/ W.createElement(Xe, J({}, an(r), {
		onMouseEnter: (e) => {
			var t = r.onMouseEnter;
			t && t(r, e);
		},
		onMouseLeave: (e) => {
			var t = r.onMouseLeave;
			t && t(r, e);
		},
		points: t,
		baseLinePoints: a ? n : void 0,
		connectNulls: o
	}));
	return /*#__PURE__*/ W.createElement(L, { className: "recharts-radar-polygon" }, s, /*#__PURE__*/ W.createElement(kr, {
		props: r,
		points: t
	}));
}
var Nr = (e, t) => e == null ? [] : t === 1 ? e.flatMap((e) => e.status === "removed" ? [] : [e.next]) : e.flatMap((e) => e.status === "removed" ? [] : e.status === "matched" ? [Y(Y({}, e.next), {}, {
	x: z(e.prev.x, e.next.x, t),
	y: z(e.prev.y, e.next.y, t)
})] : [Y(Y({}, e.next), {}, {
	x: z(e.next.cx, e.next.x, t),
	y: z(e.next.cy, e.next.y, t)
})]);
function Pr(e) {
	var t = e.props, n = e.previousPointsRef, r = e.previousBaseLinePointsRef, i = t.points, a = t.baseLinePoints, o = t.isAnimationActive, s = t.animationBegin, c = t.animationDuration, l = t.animationEasing, u = t.animationMatchBy, d = t.animationInterpolateFn, f = t.onAnimationStart, p = t.onAnimationEnd, m = ln(t, r), h = m.startValue, g = Jt(h ?? null, a, u), _ = cn(f, p), v = _.isAnimating, y = _.handleAnimationStart, b = _.handleAnimationEnd, x = fn();
	return x == null ? null : /*#__PURE__*/ W.createElement(jr, {
		showLabels: !v,
		points: i
	}, /*#__PURE__*/ W.createElement(nt, {
		animationInput: t,
		animationIdPrefix: "recharts-radar-",
		items: i,
		previousItemsRef: n,
		isAnimationActive: o,
		animationBegin: s,
		animationDuration: c,
		animationEasing: l,
		onAnimationStart: y,
		onAnimationEnd: b,
		animationInterpolateFn: d,
		animationMatchBy: u,
		layout: x
	}, (e, n) => {
		var r = n === 1 ? a : d(g, n, x);
		return m.syncStepValue(r, n), /*#__PURE__*/ W.createElement(Mr, {
			points: e,
			baseLinePoints: r,
			props: t
		});
	}), /*#__PURE__*/ W.createElement(vt, { label: t.label }), t.children);
}
function Fr(e) {
	var t = (0, W.useRef)(void 0), n = (0, W.useRef)(void 0);
	return /*#__PURE__*/ W.createElement(Pr, {
		props: e,
		previousPointsRef: t,
		previousBaseLinePointsRef: n
	});
}
var Ir = {
	activeDot: !0,
	angleAxisId: 0,
	animationBegin: 0,
	animationDuration: 1500,
	animationEasing: "ease",
	animationMatchBy: Yt,
	animationInterpolateFn: Nr,
	dot: !1,
	hide: !1,
	isAnimationActive: "auto",
	label: !1,
	legendType: "rect",
	radiusAxisId: 0,
	zIndex: ht.area
};
function Lr(e) {
	var t = e.hide, n = e.className, r = e.points;
	if (t) return null;
	var i = O("recharts-radar", n);
	return /*#__PURE__*/ W.createElement(Ot, { zIndex: e.zIndex }, /*#__PURE__*/ W.createElement(L, { className: i }, /*#__PURE__*/ W.createElement(Fr, e)), /*#__PURE__*/ W.createElement(tt, {
		points: r,
		mainColor: Er(e.stroke, e.fill),
		itemDataKey: e.dataKey,
		activeDot: e.activeDot
	}));
}
function Rr(e) {
	var t = dn(), n = U((n) => vr(n, e.radiusAxisId, e.angleAxisId, t, e.id));
	return n?.points == null ? null : /*#__PURE__*/ W.createElement(Lr, J({}, e, {
		points: n?.points,
		baseLinePoints: n?.baseLinePoints,
		isRange: n?.isRange
	}));
}
function zr(e) {
	var t = V(e, Ir);
	return /*#__PURE__*/ W.createElement(Ct, {
		id: t.id,
		type: "radar"
	}, (e) => /*#__PURE__*/ W.createElement(W.Fragment, null, /*#__PURE__*/ W.createElement(wt, {
		type: "radar",
		id: e,
		data: void 0,
		dataKey: t.dataKey,
		hide: t.hide,
		angleAxisId: t.angleAxisId,
		radiusAxisId: t.radiusAxisId
	}), /*#__PURE__*/ W.createElement(Tt, { legendPayload: Dr(t) }), /*#__PURE__*/ W.createElement(Or, {
		dataKey: t.dataKey,
		stroke: t.stroke,
		strokeWidth: t.strokeWidth,
		fill: t.fill,
		name: t.name,
		hide: t.hide,
		tooltipType: t.tooltipType,
		id: e
	}), /*#__PURE__*/ W.createElement(Rr, J({}, t, { id: e }))));
}
zr.displayName = "Radar";
// node_modules/recharts/es6/chart/RadarChart.js
function Br(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Vr(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Br(Object(n), !0).forEach(function(t) {
			Hr(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Br(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Hr(e, t, n) {
	return (t = Ur(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Ur(e) {
	var t = Wr(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Wr(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var Gr = ["axis"], Kr = Vr(Vr({}, Pt), {}, {
	layout: "centric",
	startAngle: 90,
	endAngle: -270
}), qr = /*#__PURE__*/ (0, W.forwardRef)((e, t) => {
	var n = V(e, Kr);
	return /*#__PURE__*/ W.createElement(bt, {
		chartName: "RadarChart",
		defaultTooltipEventType: "axis",
		validateTooltipEventTypes: Gr,
		tooltipPayloadSearcher: jt,
		categoricalChartProps: n,
		ref: t
	});
}), X = je(), Jr = W.memo(function({ cx: e, cy: t, dataKey: n, chartId: r, className: i, fillOpacity: a = 1, type: o = "default", maskId: s }) {
	let c = W.useId().replace(/:/g, ""), l = `url(#${r}-colors-${String(n)})`;
	if (e === void 0 || t === void 0) return null;
	switch (o) {
		case "border": return /* @__PURE__ */ (0, X.jsx)(Xr, {
			cx: e,
			cy: t,
			dotId: c,
			fillOpacity: a,
			gradientUrl: l,
			className: i,
			maskId: s
		});
		case "colored-border": return /* @__PURE__ */ (0, X.jsx)(Zr, {
			cx: e,
			cy: t,
			dotId: c,
			fillOpacity: a,
			gradientUrl: l,
			className: i,
			maskId: s
		});
		default: return /* @__PURE__ */ (0, X.jsx)(Yr, {
			cx: e,
			cy: t,
			dotId: c,
			fillOpacity: a,
			gradientUrl: l,
			className: i,
			maskId: s
		});
	}
}), Yr = W.memo(({ cx: e, cy: t, dotId: n, fillOpacity: r, gradientUrl: i, className: a, maskId: o }) => /* @__PURE__ */ (0, X.jsxs)("g", {
	className: a,
	mask: o ? `url(#${o})` : void 0,
	children: [/* @__PURE__ */ (0, X.jsx)("defs", { children: /* @__PURE__ */ (0, X.jsx)("clipPath", {
		id: `dot-clip-${n}`,
		children: /* @__PURE__ */ (0, X.jsx)("circle", {
			cx: e,
			cy: t,
			r: 3
		})
	}) }), /* @__PURE__ */ (0, X.jsx)("rect", {
		x: "0",
		y: t - 3,
		width: "100%",
		height: 6,
		fill: i,
		fillOpacity: r,
		clipPath: `url(#dot-clip-${n})`
	})]
}));
Yr.displayName = "DefaultDot";
var Xr = W.memo(({ cx: e, cy: t, dotId: n, fillOpacity: r, gradientUrl: i, className: a, maskId: o }) => /* @__PURE__ */ (0, X.jsxs)("g", {
	className: Nt(a, "text-background"),
	mask: o ? `url(#${o})` : void 0,
	children: [
		/* @__PURE__ */ (0, X.jsx)("defs", { children: /* @__PURE__ */ (0, X.jsx)("clipPath", {
			id: `dot-clip-${n}`,
			children: /* @__PURE__ */ (0, X.jsx)("circle", {
				cx: e,
				cy: t,
				r: 6
			})
		}) }),
		/* @__PURE__ */ (0, X.jsx)("circle", {
			cx: e,
			cy: t,
			r: 6,
			fill: "currentColor"
		}),
		/* @__PURE__ */ (0, X.jsx)("rect", {
			x: "0",
			y: t - (6 - 5 / 2),
			width: "100%",
			height: 7,
			fill: i,
			fillOpacity: r,
			clipPath: `url(#dot-clip-inner-${n})`
		}),
		/* @__PURE__ */ (0, X.jsx)("defs", { children: /* @__PURE__ */ (0, X.jsx)("clipPath", {
			id: `dot-clip-inner-${n}`,
			children: /* @__PURE__ */ (0, X.jsx)("circle", {
				cx: e,
				cy: t,
				r: 6 - 5 / 2
			})
		}) })
	]
}));
Xr.displayName = "PrimaryBorderDot";
var Zr = W.memo(({ cx: e, cy: t, dotId: n, fillOpacity: r, gradientUrl: i, className: a, maskId: o }) => /* @__PURE__ */ (0, X.jsxs)("g", {
	className: Nt(a, "text-background"),
	mask: o ? `url(#${o})` : void 0,
	children: [
		/* @__PURE__ */ (0, X.jsx)("defs", { children: /* @__PURE__ */ (0, X.jsx)("clipPath", {
			id: `dot-clip-${n}`,
			children: /* @__PURE__ */ (0, X.jsx)("circle", {
				cx: e,
				cy: t,
				r: 3.5
			})
		}) }),
		/* @__PURE__ */ (0, X.jsx)("rect", {
			x: "0",
			y: t - 3 - 1 / 2,
			width: "100%",
			height: 7,
			fill: i,
			fillOpacity: r,
			clipPath: `url(#dot-clip-${n})`
		}),
		/* @__PURE__ */ (0, X.jsx)("circle", {
			cx: e,
			cy: t,
			r: 3 - 1 / 2,
			fill: "currentColor"
		})
	]
}));
Zr.displayName = "ColoredBorderDot";
// src/react/evilcharts/registry/charts/recharts-radar-chart.tsx
var Qr = 1, $r = .3, ei = 6, ti = 1500, ni = "value", ri = (0, W.createContext)(null);
function Z() {
	let e = (0, W.use)(ri);
	if (!e) throw Error("Radar chart parts (<Radar />, <PolarAngleAxis />, …) must be used within <EvilRadarChart />");
	return e;
}
function Q({ config: e, data: t, children: n, className: r, chartProps: i, backgroundVariant: a, defaultSelectedDataKey: o = null, onSelectionChange: s, isLoading: c = !1, loadingPoints: l }) {
	let u = (0, W.useId)().replace(/:/g, ""), [d, f] = (0, W.useState)(o), p = yi(c, l), m = (0, W.useCallback)((e) => {
		f(e), s?.(e);
	}, [s]), h = (0, W.useMemo)(() => ({
		config: e,
		isLoading: c,
		selectedDataKey: d,
		selectDataKey: m
	}), [
		e,
		c,
		d,
		m
	]);
	return /* @__PURE__ */ (0, X.jsx)(ri, {
		value: h,
		children: /* @__PURE__ */ (0, X.jsxs)(ct, {
			className: r,
			config: e,
			children: [/* @__PURE__ */ (0, X.jsx)(yt, { isLoading: c }), /* @__PURE__ */ (0, X.jsxs)(qr, {
				id: u,
				data: c ? p : t,
				...i,
				children: [
					a && /* @__PURE__ */ (0, X.jsx)(st, { variant: a }),
					n,
					c && /* @__PURE__ */ (0, X.jsx)(bi, {})
				]
			})]
		})
	});
}
function ii({ dataKey: e, variant: t = "filled", fillOpacity: n = $r, isGlowing: r = !1, isClickable: i = !1, children: a, radarProps: o }) {
	let { config: s, isLoading: c, selectedDataKey: l, selectDataKey: u } = Z(), d = (0, W.useId)().replace(/:/g, "");
	if (c) return null;
	let f = i && l !== null && l !== e, p = {
		stroke: f ? .2 : 1,
		fill: f ? .1 : 1,
		dot: f ? .2 : 1
	}, m = t === "filled", { dot: h, activeDot: g } = fi(a, d, e, p.dot);
	return /* @__PURE__ */ (0, X.jsxs)(X.Fragment, { children: [/* @__PURE__ */ (0, X.jsx)(zr, {
		dataKey: e,
		stroke: `url(#${d}-radar-stroke-${e})`,
		strokeOpacity: p.stroke,
		strokeWidth: Qr,
		fill: m ? `url(#${d}-radar-fill-${e})` : "none",
		fillOpacity: m ? n * p.fill : 0,
		dot: h,
		activeDot: g,
		filter: r ? `url(#${d}-radar-glow-${e})` : void 0,
		className: "transition-opacity duration-200",
		style: i ? { cursor: "pointer" } : void 0,
		onClick: () => {
			i && u(l === e ? null : e);
		},
		...o
	}), /* @__PURE__ */ (0, X.jsxs)("defs", { children: [
		/* @__PURE__ */ (0, X.jsx)(mi, {
			id: d,
			dataKey: e,
			config: s
		}),
		/* @__PURE__ */ (0, X.jsx)(hi, {
			id: d,
			dataKey: e,
			config: s
		}),
		m && /* @__PURE__ */ (0, X.jsx)(gi, {
			id: d,
			dataKey: e,
			config: s
		}),
		r && /* @__PURE__ */ (0, X.jsx)(_i, {
			id: d,
			dataKey: e
		})
	] })] });
}
var ai = () => null, oi = () => null;
function si({ gridType: e = "polygon", stroke: t = "currentColor", strokeOpacity: n = .2, strokeDasharray: r = "3 4", ...i }) {
	return /* @__PURE__ */ (0, X.jsx)(An, {
		gridType: e,
		stroke: t,
		strokeOpacity: n,
		strokeDasharray: r,
		...i
	});
}
function ci({ tick: e = {
	fill: "currentColor",
	fontSize: 12
}, tickLine: t = !1, ...n }) {
	let { isLoading: r } = Z();
	return r ? null : /* @__PURE__ */ (0, X.jsx)(Ye, {
		tick: e,
		tickLine: t,
		...n
	});
}
function li({ tick: e = {
	fill: "currentColor",
	fontSize: 10
}, tickLine: t = !1, axisLine: n = !1, ...r }) {
	let { isLoading: i } = Z();
	return i ? null : /* @__PURE__ */ (0, X.jsx)(Qn, {
		tick: e,
		tickLine: t,
		axisLine: n,
		...r
	});
}
function ui({ variant: e, roundness: t, defaultIndex: n }) {
	let { isLoading: r, selectedDataKey: i } = Z();
	return r ? null : /* @__PURE__ */ (0, X.jsx)(pt, {
		defaultIndex: n,
		cursor: !1,
		content: /* @__PURE__ */ (0, X.jsx)(mt, {
			selected: i,
			roundness: t,
			variant: e
		})
	});
}
function di({ variant: e, align: t = "center", verticalAlign: n = "bottom", isClickable: r = !1 }) {
	let { isLoading: i, selectedDataKey: a, selectDataKey: o } = Z();
	return i ? null : /* @__PURE__ */ (0, X.jsx)(ut, {
		verticalAlign: n,
		align: t,
		content: /* @__PURE__ */ (0, X.jsx)(dt, {
			selected: a,
			onSelectChange: o,
			isClickable: r,
			variant: e
		})
	});
}
var fi = (e, t, n, r) => {
	let i = !1, a = !1;
	return W.Children.forEach(e, (e) => {
		if ((0, W.isValidElement)(e)) {
			if (e.type === ai) {
				let { variant: a } = e.props;
				i = /* @__PURE__ */ (0, X.jsx)(Jr, {
					type: a,
					dataKey: n,
					chartId: t,
					fillOpacity: r
				});
			}
			if (e.type === oi) {
				let { variant: i } = e.props;
				a = /* @__PURE__ */ (0, X.jsx)(Jr, {
					type: i,
					dataKey: n,
					chartId: t,
					fillOpacity: r
				});
			}
		}
	}), {
		dot: i,
		activeDot: a
	};
}, pi = ({ dataKey: e, colorsCount: t, opacities: n }) => t === 1 ? /* @__PURE__ */ (0, X.jsxs)(X.Fragment, { children: [/* @__PURE__ */ (0, X.jsx)("stop", {
	offset: "0%",
	stopColor: `var(--color-${e}-0)`,
	stopOpacity: n?.[0]
}), /* @__PURE__ */ (0, X.jsx)("stop", {
	offset: "100%",
	stopColor: `var(--color-${e}-0)`,
	stopOpacity: n?.[n.length - 1]
})] }) : /* @__PURE__ */ (0, X.jsx)(X.Fragment, { children: Array.from({ length: t }, (r, i) => {
	let a = `${i / (t - 1) * 100}%`;
	return /* @__PURE__ */ (0, X.jsx)("stop", {
		offset: a,
		stopColor: `var(--color-${e}-${i}, var(--color-${e}-0))`,
		stopOpacity: n?.[i]
	}, a);
}) }), mi = ({ id: e, dataKey: t, config: n }) => {
	let r = Bt(n[t] ?? {});
	return /* @__PURE__ */ (0, X.jsx)("linearGradient", {
		id: `${e}-colors-${t}`,
		x1: "0",
		y1: "0",
		x2: "1",
		y2: "0",
		children: /* @__PURE__ */ (0, X.jsx)(pi, {
			dataKey: t,
			colorsCount: r
		})
	});
}, hi = ({ id: e, dataKey: t, config: n }) => {
	let r = Bt(n[t] ?? {});
	return /* @__PURE__ */ (0, X.jsx)("linearGradient", {
		id: `${e}-radar-stroke-${t}`,
		x1: "0",
		y1: "0",
		x2: "1",
		y2: "1",
		children: /* @__PURE__ */ (0, X.jsx)(pi, {
			dataKey: t,
			colorsCount: r
		})
	});
}, gi = ({ id: e, dataKey: t, config: n }) => {
	let r = Bt(n[t] ?? {}), i = r === 1 ? [.8, .3] : Array.from({ length: r }, (e, t) => t === 0 ? .8 : .3);
	return /* @__PURE__ */ (0, X.jsx)("radialGradient", {
		id: `${e}-radar-fill-${t}`,
		cx: "50%",
		cy: "50%",
		r: "50%",
		children: /* @__PURE__ */ (0, X.jsx)(pi, {
			dataKey: t,
			colorsCount: r,
			opacities: i
		})
	});
}, _i = ({ id: e, dataKey: t }) => /* @__PURE__ */ (0, X.jsxs)("filter", {
	id: `${e}-radar-glow-${t}`,
	x: "-50%",
	y: "-50%",
	width: "200%",
	height: "200%",
	children: [
		/* @__PURE__ */ (0, X.jsx)("feGaussianBlur", {
			in: "SourceGraphic",
			stdDeviation: "4",
			result: "blur"
		}),
		/* @__PURE__ */ (0, X.jsx)("feColorMatrix", {
			in: "blur",
			type: "matrix",
			values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.6 0",
			result: "glow"
		}),
		/* @__PURE__ */ (0, X.jsxs)("feMerge", { children: [/* @__PURE__ */ (0, X.jsx)("feMergeNode", { in: "glow" }), /* @__PURE__ */ (0, X.jsx)("feMergeNode", { in: "SourceGraphic" })] })
	]
}), vi = (e) => [
	"A",
	"B",
	"C",
	"D",
	"E",
	"F"
].slice(0, e).map((e) => ({
	skill: e,
	[ni]: 30 + Math.random() * 70
}));
function yi(e, t = ei) {
	let [n, r] = (0, W.useState)(0);
	return (0, W.useEffect)(() => {
		if (!e) return;
		let t = setInterval(() => {
			r((e) => e + 1);
		}, ti);
		return () => clearInterval(t);
	}, [e]), (0, W.useMemo)(() => vi(t), [t, n]);
}
var bi = () => /* @__PURE__ */ (0, X.jsx)(zr, {
	dataKey: ni,
	stroke: "currentColor",
	strokeOpacity: .3,
	strokeWidth: 2,
	fill: "currentColor",
	fillOpacity: .1,
	dot: !1,
	isAnimationActive: !0,
	animationDuration: ti,
	animationEasing: "ease-in-out"
});
Q.Radar = ii, Q.Dot = ai, Q.ActiveDot = oi, Q.PolarGrid = si, Q.PolarAngleAxis = ci, Q.PolarRadiusAxis = li, Q.Tooltip = ui, Q.Legend = di;
// src/react/taste/charts.tsx
function xi(e) {
	let { x: t = 0, cx: n, textAnchor: r, payload: i, ...a } = e, o = String(i?.value ?? ""), s = typeof n == "number" ? n * 2 : 0, c = s ? r === "start" ? s - t : r === "end" ? t : 2 * Math.min(t, s - t) : 56;
	return /* @__PURE__ */ (0, X.jsxs)("g", { children: [/* @__PURE__ */ (0, X.jsx)("title", { children: o }), /* @__PURE__ */ (0, X.jsx)(Dt, {
		...a,
		x: t,
		textAnchor: r,
		fill: "currentColor",
		fontSize: 12,
		children: It(o, c - 4)
	})] });
}
var Si = [
	"stroke-chart-1",
	"stroke-chart-2",
	"stroke-chart-3",
	"stroke-chart-4",
	"stroke-chart-5",
	"stroke-chart-6"
], Ci = [
	"fill-chart-1",
	"fill-chart-2",
	"fill-chart-3",
	"fill-chart-4",
	"fill-chart-5",
	"fill-chart-6"
], wi = { value: {
	label: "标签出现次数",
	colors: sn(it[3])
} }, Ti = [
	"min-h-24",
	"min-h-24",
	"min-h-24",
	"min-h-32",
	"min-h-40",
	"min-h-48",
	"min-h-52",
	"min-h-60",
	"min-h-64"
], Ei = 26, Di = { radius: wi.value }, Oi = (e, t) => Math.sqrt(e / t);
function ki({ rows: e, label: t }) {
	let n = De(e);
	if (!n.length) return null;
	let r = n[0].value, i = n.map((e) => ({
		...e,
		radius: Oi(e.value, r)
	}));
	return /* @__PURE__ */ (0, X.jsx)("div", {
		role: "img",
		"aria-label": `${t}：${i.map((e) => e.name).join("，")}`,
		children: /* @__PURE__ */ (0, X.jsxs)(Q, {
			data: i,
			config: Di,
			chartProps: { outerRadius: "58%" },
			className: "aspect-auto h-70 text-text-secondary",
			children: [
				/* @__PURE__ */ (0, X.jsx)(Q.PolarGrid, {}),
				/* @__PURE__ */ (0, X.jsx)(Q.PolarAngleAxis, {
					dataKey: "name",
					tick: /* @__PURE__ */ (0, X.jsx)(xi, {})
				}),
				/* @__PURE__ */ (0, X.jsx)(Q.PolarRadiusAxis, {
					domain: [0, 1],
					allowDecimals: !0,
					tick: !1
				}),
				/* @__PURE__ */ (0, X.jsx)(Q.Radar, { dataKey: "radius" }),
				/* @__PURE__ */ (0, X.jsx)(ft, { valueKey: "value" })
			]
		})
	});
}
function Ai({ rows: e, label: t }) {
	let n = Ve(e, 8);
	return n.length ? /* @__PURE__ */ (0, X.jsx)("section", {
		"aria-label": t,
		className: `flex grow flex-col ${Ti[n.length]}`,
		children: /* @__PURE__ */ (0, X.jsxs)(_t, {
			data: n,
			config: wi,
			layout: "horizontal",
			barRadius: 4,
			chartProps: {
				maxBarSize: Ei,
				margin: {
					top: 5,
					right: 56,
					bottom: 5,
					left: 5
				}
			},
			className: "aspect-auto text-text-secondary",
			children: [
				/* @__PURE__ */ (0, X.jsx)(_t.YAxis, {
					dataKey: "name",
					interval: 0,
					tick: /* @__PURE__ */ (0, X.jsx)(ot, { along: "y" }),
					width: Mt(n.map((e) => e.name))
				}),
				/* @__PURE__ */ (0, X.jsx)(_t.XAxis, {
					hide: !0,
					domain: qe
				}),
				/* @__PURE__ */ (0, X.jsx)(_t.Bar, {
					dataKey: "value",
					enableHoverHighlight: !0,
					barProps: {
						dataKey: "value",
						label: Ze("right")
					}
				}),
				/* @__PURE__ */ (0, X.jsx)(ft, {})
			]
		})
	}) : null;
}
function ji({ flows: e }) {
	let [t, n] = (0, W.useState)(null), r = _e(e);
	if (!r) return null;
	let i = t?.node ?? null, a = (e, n) => t ? i === null ? t.label === n : e.source === i || e.target === i : !0;
	return /* @__PURE__ */ (0, X.jsxs)("section", {
		className: rt,
		children: [
			/* @__PURE__ */ (0, X.jsx)(lt, {
				title: "创作者线索来源",
				figure: (t ? t.value : r.total).toLocaleString(),
				note: t ? t.label : "条线索"
			}),
			/* @__PURE__ */ (0, X.jsx)("ol", {
				"aria-label": "来源网站与创作者线索",
				className: "flex flex-col sm:hidden",
				children: [...r.links].sort((e, t) => t.value - e.value).map((e) => /* @__PURE__ */ (0, X.jsxs)("li", {
					className: "flex items-baseline justify-between gap-3 border-b border-separator-border py-2 text-body-2-regular text-text-primary last:border-b-0",
					children: [/* @__PURE__ */ (0, X.jsx)("span", {
						className: "min-w-0 wrap-anywhere",
						children: e.label
					}), /* @__PURE__ */ (0, X.jsx)("b", {
						className: "shrink-0 tabular-nums",
						children: e.value.toLocaleString()
					})]
				}, e.key))
			}),
			/* @__PURE__ */ (0, X.jsx)("div", {
				className: "min-w-0 max-sm:hidden",
				children: /* @__PURE__ */ (0, X.jsxs)("svg", {
					viewBox: `0 0 ${u.width} ${r.height}`,
					fill: "none",
					role: "img",
					"aria-label": "来源网站与创作者线索",
					className: "block h-auto w-full",
					onPointerLeave: () => n(null),
					children: [/* @__PURE__ */ (0, X.jsx)("g", { children: r.links.map((e) => /* @__PURE__ */ (0, X.jsx)("path", {
						d: e.d,
						strokeWidth: e.width,
						tabIndex: 0,
						role: "img",
						"aria-label": `${e.label}：${e.value} 条线索`,
						fillOpacity: 0,
						strokeOpacity: a(e, e.label) ? .55 : .08,
						className: `outline-none transition-opacity ${Si[e.color]}`,
						onPointerEnter: () => n({
							value: e.value,
							label: e.label,
							node: null
						}),
						onFocus: () => n({
							value: e.value,
							label: e.label,
							node: null
						}),
						onBlur: () => n(null)
					}, e.key)) }), /* @__PURE__ */ (0, X.jsx)("g", { children: r.nodes.map((e) => /* @__PURE__ */ (0, X.jsxs)("g", {
						tabIndex: 0,
						role: "img",
						"aria-label": `${e.name}：${e.value} 条线索`,
						className: "outline-none focus-visible:opacity-100",
						onPointerEnter: () => n({
							value: e.value,
							label: e.name,
							node: e.index
						}),
						onFocus: () => n({
							value: e.value,
							label: e.name,
							node: e.index
						}),
						onBlur: () => n(null),
						children: [/* @__PURE__ */ (0, X.jsx)("rect", {
							x: e.x,
							y: e.y,
							width: 10,
							height: e.height,
							rx: 5,
							className: e.side === "source" ? Ci[e.color] : "fill-text-secondary"
						}), /* @__PURE__ */ (0, X.jsxs)("text", {
							x: l[e.side],
							y: e.y + e.height / 2,
							textAnchor: e.side === "source" ? "end" : "start",
							dominantBaseline: "middle",
							className: "fill-text-secondary text-caption-1-regular",
							children: [ve(e.name), /* @__PURE__ */ (0, X.jsx)("tspan", {
								x: l[e.side],
								dy: 15,
								children: e.side === "source" ? e.value.toLocaleString() : `${e.share.toFixed(1)}%`
							})]
						})]
					}, e.id)) })]
				})
			}),
			/* @__PURE__ */ (0, X.jsxs)("footer", {
				className: "flex justify-between gap-3 text-caption-1-regular text-text-secondary max-sm:hidden",
				children: [/* @__PURE__ */ (0, X.jsx)("span", { children: "来源网站" }), /* @__PURE__ */ (0, X.jsx)("span", { children: "创作者 · 线索占比" })]
			})
		]
	});
}
// src/react/taste/browser-sources.tsx
var Mi = "flex min-w-0 items-center gap-3 rounded-xl bg-background-primary-default p-3";
function Ni({ browsers: e, sources: t, range: n, children: r }) {
	let [a, o] = (0, W.useState)(!1), [s, c] = (0, W.useState)(""), [l, u] = (0, W.useState)(""), f = We({
		mutationFn: (e) => k(e, n),
		onSuccess: (e) => {
			P.setQueryData(F(n), e.dashboard), o(!1), c(""), u("");
		}
	});
	return /* @__PURE__ */ (0, X.jsxs)("section", {
		className: `${D()} flex flex-col gap-4`,
		"aria-label": "数据源",
		children: [
			/* @__PURE__ */ (0, X.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, X.jsx)("h3", {
					className: "text-title-2-medium text-text-primary",
					children: "数据源"
				}), /* @__PURE__ */ (0, X.jsx)(i, {
					variant: "secondary",
					onClick: () => o(!0),
					disabled: a,
					children: "添加浏览器"
				})]
			}),
			f.error ? /* @__PURE__ */ (0, X.jsx)(y, {
				tone: "error",
				children: j(f.error)
			}) : null,
			a ? /* @__PURE__ */ (0, X.jsxs)("form", {
				className: "flex flex-col gap-3",
				onSubmit: (e) => {
					e.preventDefault(), f.isPending || f.mutate({
						operation: "add",
						name: s,
						path: l
					});
				},
				children: [
					/* @__PURE__ */ (0, X.jsx)(p, {
						label: "浏览器名称",
						value: s,
						onChange: c,
						maxLength: 80,
						isRequired: !0,
						isDisabled: f.isPending
					}),
					/* @__PURE__ */ (0, X.jsx)(p, {
						label: "资料目录或历史文件",
						value: l,
						onChange: u,
						maxLength: 1024,
						isRequired: !0,
						isDisabled: f.isPending,
						hint: "请选择运行 Peach 的电脑上的浏览器资料。"
					}),
					/* @__PURE__ */ (0, X.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, X.jsx)(i, {
							variant: "ghost",
							disabled: f.isPending,
							onClick: () => {
								o(!1), f.reset();
							},
							children: "取消"
						}), /* @__PURE__ */ (0, X.jsx)(i, {
							type: "submit",
							variant: "secondary",
							disabled: !s.trim() || !l.trim(),
							...E(f.isPending),
							children: "添加"
						})]
					})
				]
			}) : null,
			/* @__PURE__ */ (0, X.jsxs)("div", {
				className: "inline-grid w-full min-w-0 gap-2 sm:grid-cols-2",
				children: [r, e.map((e) => {
					let n = t.filter((t) => e.source_keys?.includes(t.source_key)), r = n.reduce((e, t) => e + (t.visits || 0), 0), a = n.reduce((e, t) => e + (t.bookmarks || 0), 0);
					return /* @__PURE__ */ (0, X.jsxs)("div", {
						"data-taste-source": "browser",
						className: Mi,
						children: [
							/* @__PURE__ */ (0, X.jsx)("span", {
								className: "inline-grid size-8 shrink-0 place-items-center rounded-lg text-text-secondary",
								children: /* @__PURE__ */ (0, X.jsx)(pn, { name: e.name })
							}),
							/* @__PURE__ */ (0, X.jsxs)("div", {
								className: "flex min-w-0 grow flex-col gap-0.5",
								children: [
									/* @__PURE__ */ (0, X.jsx)("b", {
										className: "text-body-2-medium break-words text-text-primary",
										children: e.name
									}),
									/* @__PURE__ */ (0, X.jsx)("span", {
										className: "break-all text-caption-1-regular text-text-secondary",
										children: e.path
									}),
									/* @__PURE__ */ (0, X.jsx)("span", {
										className: "text-caption-1-regular text-text-secondary",
										children: e.enabled ? e.available ? `历史与书签 · ${e.profiles} 个资料` : "资料目录不可用" : "已停止读取"
									}),
									n.length ? /* @__PURE__ */ (0, X.jsxs)("span", {
										className: "text-caption-1-regular text-text-secondary",
										children: [
											r.toLocaleString(),
											" 条历史 · ",
											a.toLocaleString(),
											" 枚书签"
										]
									}) : null
								]
							}),
							/* @__PURE__ */ (0, X.jsxs)("span", {
								className: "flex shrink-0 gap-1",
								children: [/* @__PURE__ */ (0, X.jsx)(i, {
									variant: "secondary",
									size: "small",
									...E(f.isPending),
									iconOnly: !0,
									leadingIcon: e.enabled ? b : d,
									"aria-label": `${e.enabled ? "停止读取" : "启用"} ${e.name}`,
									onClick: () => {
										e.enabled ? A({
											title: `停止读取 ${e.name}`,
											body: "已导入的历史与书签仍用于口味分析。",
											confirmLabel: "停止读取",
											onConfirm: () => f.mutateAsync({
												operation: "disable",
												id: e.id
											})
										}) : f.mutate({
											operation: "enable",
											id: e.id
										});
									}
								}), /* @__PURE__ */ (0, X.jsx)(i, {
									variant: "secondary",
									size: "small",
									iconOnly: !0,
									leadingIcon: m,
									...E(f.isPending),
									"aria-label": `删除 ${e.name}`,
									onClick: () => {
										A({
											title: `删除 ${e.name}`,
											body: "移除该浏览器的读取配置和已导入历史、书签，浏览器原文件保留。可以通过添加浏览器重新接入。",
											confirmLabel: "删除浏览器来源",
											danger: !0,
											onConfirm: () => f.mutateAsync({
												operation: "delete_browser",
												id: e.id
											})
										});
									}
								})]
							})
						]
					}, e.id);
				})]
			})
		]
	});
}
// src/react/taste/taste-page.tsx
var Pi = 10, Fi = me(h, g, "text-body-2-medium"), Ii = `${D()} flex flex-col gap-4`, Li = "rounded-xl bg-background-primary-default p-3", Ri = "读取运行 Peach 的这台电脑上的浏览历史与书签", zi = "导入或读取浏览记录后，这里会列出记录来自哪些设备。", Bi = "馆藏中暂时没有与你浏览过的内容相符的标签。", Vi = "读取浏览记录后，这里会按类别汇总你浏览过的内容。", Hi = "这些标签出现在浏览记录中，Peach 的观看或评价记录中尚未出现这些标签", Ui = "采集浏览记录后，这里会列出浏览过的标签。", Wi = "采集浏览记录后，这里会列出浏览过的创作者。", Gi = "采集浏览记录后，这里会列出常访问的网站。", Ki = "在 Peach 里播放或评价作品后，这里会列出对应的标签。", qi = "在 Peach 里播放或评价作品后，这里会列出对应的创作者。", Ji = "在 Peach 里播放或评价作品后，这里会列出对应的女优。", Yi = "在运行 Peach 的电脑上使用浏览器：点上面的「读取浏览器记录」。", Xi = "记录在其他设备上：导出文件后，选择「导入历史文件」或「导入书签文件」。书签支持浏览器导出的 HTML 文件和 Chromium Bookmarks JSON 文件。", Zi = "需要刷新时再次读取或导入；数据源可在页面底部移除。", Qi = "删除这个来源的已导入记录，原始文件保留。若浏览器仍启用，下次读取会再次导入。", $i = "peach-taste-guide-dismissed", ea = (0, W.createContext)(/* @__PURE__ */ (0, X.jsx)(a, {
	size: "small",
	href: "/",
	children: "浏览馆藏"
}));
function ta() {
	return (0, W.useContext)(ea);
}
function $({ icon: e, term: t, figure: n, detail: r, detailTitle: i, accent: a }) {
	return /* @__PURE__ */ (0, X.jsx)("div", {
		className: Fe(),
		children: /* @__PURE__ */ (0, X.jsx)(C, {
			label: t,
			icon: e,
			accent: a,
			figure: n,
			footer: /* @__PURE__ */ (0, X.jsx)("span", {
				className: "block min-w-0 truncate",
				title: i || r,
				children: r ?? ""
			})
		})
	});
}
function na({ name: e, domain: t }) {
	return /* @__PURE__ */ (0, X.jsxs)("span", {
		className: "relative inline-grid size-8 shrink-0 place-items-center overflow-hidden rounded-lg bg-background-tertiary-default text-caption-1-medium text-text-secondary",
		children: [N(e).toUpperCase(), /* @__PURE__ */ (0, X.jsx)("img", {
			src: Ne({ domain: t }),
			alt: "",
			loading: "lazy",
			width: 20,
			height: 20,
			onError: (e) => e.currentTarget.remove(),
			className: "absolute size-5 object-contain"
		})]
	});
}
function ra({ html: e }) {
	return /* @__PURE__ */ (0, X.jsx)("span", {
		className: `relative inline-grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-background-tertiary-default text-caption-1-medium text-text-secondary ${$e}`,
		dangerouslySetInnerHTML: { __html: e }
	});
}
function ia({ rows: e, kind: t, visual: n, empty: r, onSignal: i }) {
	if (!e.length) return /* @__PURE__ */ (0, X.jsx)(c, {
		size: "compact",
		icon: Te,
		title: "记录还不够",
		actions: /* @__PURE__ */ (0, X.jsx)(ta, {}),
		children: r
	});
	let a = ke(e);
	return /* @__PURE__ */ (0, X.jsx)(Je, {
		previewCount: Pi,
		className: "inline-grid w-full gap-x-7 gap-y-2 sm:grid-cols-2",
		children: e.map((e, r) => {
			let o = !!t && !!e.peach_items, s = String(e.source_domain || ""), c = /* @__PURE__ */ (0, X.jsxs)(X.Fragment, { children: [
				/* @__PURE__ */ (0, X.jsx)("svg", {
					viewBox: "0 0 100 1",
					preserveAspectRatio: "none",
					"aria-hidden": !0,
					className: "absolute inset-0 -z-10 size-full overflow-hidden rounded-lg opacity-15",
					children: /* @__PURE__ */ (0, X.jsx)("rect", {
						width: a[r],
						height: 1,
						className: "fill-chart-4"
					})
				}),
				/* @__PURE__ */ (0, X.jsx)("span", {
					className: "w-6 shrink-0 text-caption-1-regular tabular-nums text-text-secondary",
					children: r + 1
				}),
				n === "domain" ? /* @__PURE__ */ (0, X.jsx)(na, {
					name: e.name,
					domain: e.name
				}) : null,
				n === "creator" && !e.entity_id && !e.has_avatar && s ? /* @__PURE__ */ (0, X.jsx)(na, {
					name: e.name,
					domain: s
				}) : null,
				n !== "none" && n !== "domain" && (e.entity_id || e.has_avatar || !s) ? /* @__PURE__ */ (0, X.jsx)(ra, { html: fe(e.name, e.entity_id ? {
					id: e.entity_id,
					has_image: !!e.has_image,
					image_version: e.image_version,
					avatar_focus: e.avatar_focus,
					avatar_stand_in: e.avatar_stand_in
				} : null, e.has_avatar ? e.representative_asset_id ?? null : null, n === "creator" ? "creator" : t || "performer") }) : null,
				/* @__PURE__ */ (0, X.jsxs)("span", {
					className: "flex min-w-0 grow flex-col gap-0.5",
					children: [/* @__PURE__ */ (0, X.jsx)("b", {
						className: "min-w-0 text-body-medium break-words text-text-primary",
						children: e.name
					}), /* @__PURE__ */ (0, X.jsx)("small", {
						className: "text-caption-1-regular text-text-secondary",
						children: Oe(e)
					})]
				}),
				o ? /* @__PURE__ */ (0, X.jsx)(Ee, {
					"aria-hidden": !0,
					className: "size-4 shrink-0 text-text-tertiary"
				}) : null
			] }), l = "relative isolate flex min-h-11 w-full min-w-0 items-center gap-2.5 rounded-lg px-3 py-2 text-left";
			return /* @__PURE__ */ (0, X.jsx)("li", {
				className: "min-w-0",
				children: o ? /* @__PURE__ */ (0, X.jsx)("button", {
					type: "button",
					onClick: () => i(t, e.name),
					className: `${l} cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring`,
					children: c
				}) : /* @__PURE__ */ (0, X.jsx)("div", {
					className: l,
					children: c
				})
			}, `${e.name}:${r}`);
		})
	});
}
function aa({ label: e, panels: i, onSignal: a }) {
	return /* @__PURE__ */ (0, X.jsxs)(r, {
		className: `${D({ padding: "none" })} flex flex-col`,
		children: [/* @__PURE__ */ (0, X.jsx)("div", {
			className: "px-4 pt-3",
			children: /* @__PURE__ */ (0, X.jsx)(re, {
				"aria-label": e,
				className: te,
				children: i.map((e) => /* @__PURE__ */ (0, X.jsx)(n, {
					id: e.id,
					className: ee,
					children: e.name
				}, e.id))
			})
		}), i.map((e) => /* @__PURE__ */ (0, X.jsx)(t, {
			id: e.id,
			className: "px-4 pt-3.5 pb-4",
			children: /* @__PURE__ */ (0, X.jsx)(ia, {
				...e.props,
				onSignal: a
			})
		}, e.id))]
	});
}
function oa({ data: e, onSignal: t, navigate: n }) {
	let r = e.analysis;
	if (!r?.headline) return null;
	let i = r.confidence || {}, o = [...(r.explore || []).map((e) => ({
		key: `tag:${e.tag}`,
		title: e.title,
		detail: e.detail,
		act: () => t("tag", e.tag)
	})), ...(r.next_steps || []).map((e) => ({
		key: `route:${e.route}`,
		title: e.title,
		detail: e.detail,
		act: () => n(e.route)
	}))];
	return /* @__PURE__ */ (0, X.jsxs)("section", {
		className: Ii,
		"aria-label": "口味总结",
		children: [
			/* @__PURE__ */ (0, X.jsxs)("header", {
				className: "flex flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, X.jsx)("h3", {
						className: "text-title-2-medium text-text-primary",
						children: "口味总结"
					}),
					/* @__PURE__ */ (0, X.jsx)("p", {
						className: "max-w-prose text-title-2-regular wrap-anywhere text-text-primary",
						children: r.headline
					}),
					/* @__PURE__ */ (0, X.jsxs)("p", {
						className: "flex flex-wrap items-center gap-2 text-body-2-regular text-text-secondary",
						children: [/* @__PURE__ */ (0, X.jsx)("i", {
							"aria-hidden": !0,
							className: `size-2 shrink-0 rounded-full ${i.level === "high" ? "bg-status-lime-text" : i.level === "medium" ? "bg-status-yellow-text" : "bg-text-tertiary"}`
						}), /* @__PURE__ */ (0, X.jsx)("span", {
							className: "min-w-0 wrap-anywhere",
							children: i.label || "仍在学习"
						})]
					})
				]
			}),
			r.points?.length ? /* @__PURE__ */ (0, X.jsx)("div", {
				className: "inline-grid w-full gap-3 sm:grid-cols-2",
				children: r.points.map((e) => /* @__PURE__ */ (0, X.jsxs)("div", {
					className: `flex min-w-0 flex-col gap-1 ${Li}`,
					children: [/* @__PURE__ */ (0, X.jsx)("span", {
						className: "text-caption-1-regular text-text-secondary",
						children: e.label
					}), /* @__PURE__ */ (0, X.jsx)("b", {
						className: "text-body-2-medium break-words text-text-primary",
						children: e.text
					})]
				}, e.label))
			}) : null,
			o.length ? /* @__PURE__ */ (0, X.jsx)("div", {
				className: "flex flex-col gap-2",
				children: o.map((e) => /* @__PURE__ */ (0, X.jsxs)("button", {
					type: "button",
					onClick: e.act,
					className: `flex w-full min-w-0 cursor-pointer items-center gap-3 ${Li} text-left outline-none hover:bg-background-primary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring`,
					children: [/* @__PURE__ */ (0, X.jsxs)("span", {
						className: "flex min-w-0 grow flex-col gap-1",
						children: [/* @__PURE__ */ (0, X.jsx)("b", {
							className: "text-body-2-medium wrap-anywhere text-text-primary",
							children: e.title
						}), /* @__PURE__ */ (0, X.jsx)("small", {
							className: "text-caption-1-regular wrap-anywhere text-text-secondary",
							children: e.detail
						})]
					}), /* @__PURE__ */ (0, X.jsx)(Ee, {
						"aria-hidden": !0,
						className: "size-4 shrink-0 text-text-tertiary"
					})]
				}, e.key))
			}) : /* @__PURE__ */ (0, X.jsx)(c, {
				size: "compact",
				icon: Te,
				title: "还没有可探索的入口",
				actions: /* @__PURE__ */ (0, X.jsx)(a, {
					size: "small",
					href: "/",
					children: "浏览馆藏"
				}),
				children: Bi
			})
		]
	});
}
function sa({ onboarding: e, done: t }) {
	let [n, r] = (0, W.useState)(() => {
		try {
			return localStorage.getItem($i) === "1";
		} catch {
			return !1;
		}
	});
	return t || n ? null : /* @__PURE__ */ (0, X.jsx)("div", {
		className: D({
			padding: "none",
			className: "p-4"
		}),
		children: /* @__PURE__ */ (0, X.jsxs)(o, {
			summary: "浏览器历史记录导入指南",
			defaultOpen: e,
			children: [
				/* @__PURE__ */ (0, X.jsx)("p", {
					className: "text-body-2-regular text-text-secondary",
					children: Yi
				}),
				/* @__PURE__ */ (0, X.jsx)("p", {
					className: "text-body-2-regular text-text-secondary",
					children: Xi
				}),
				/* @__PURE__ */ (0, X.jsxs)("ul", {
					className: "flex list-disc flex-col gap-1 pl-5 text-body-2-regular text-text-secondary",
					children: [/* @__PURE__ */ (0, X.jsxs)("li", { children: [
						"Chrome：在 ",
						/* @__PURE__ */ (0, X.jsxs)("a", {
							href: "https://takeout.google.com/",
							target: "_blank",
							rel: "noopener noreferrer",
							className: "text-text-primary underline-offset-4 hover:underline",
							children: ["Google Takeout", /* @__PURE__ */ (0, X.jsx)(w, {
								"aria-hidden": !0,
								className: "size-(--icon-inline) shrink-0"
							})]
						}),
						" ",
						"选择 Chrome 历史记录，下载 ZIP 后直接导入。"
					] }), /* @__PURE__ */ (0, X.jsxs)("li", { children: [
						"其他浏览器：用 ",
						/* @__PURE__ */ (0, X.jsxs)("a", {
							href: "https://github.com/purarue/browserexport",
							target: "_blank",
							rel: "noopener noreferrer",
							className: "text-text-primary underline-offset-4 hover:underline",
							children: ["browserexport", /* @__PURE__ */ (0, X.jsx)(w, {
								"aria-hidden": !0,
								className: "size-(--icon-inline) shrink-0"
							})]
						}),
						" ",
						"导出历史记录，再导入导出文件。"
					] })]
				}),
				/* @__PURE__ */ (0, X.jsx)("p", {
					className: "text-body-2-regular text-text-secondary",
					children: Zi
				}),
				/* @__PURE__ */ (0, X.jsx)("span", {
					className: "self-start",
					children: /* @__PURE__ */ (0, X.jsx)(i, {
						variant: "secondary",
						size: "small",
						onClick: () => {
							try {
								localStorage.setItem($i, "1");
							} catch {}
							r(!0);
						},
						children: "跳过"
					})
				})
			]
		})
	});
}
function ca({ busy: t, onRefresh: n, onImport: r, onImportBookmarks: a }) {
	let o = (0, W.useRef)(null), [c, l] = (0, W.useState)(!1), u = (e) => {
		l(!1), e();
	};
	return /* @__PURE__ */ (0, X.jsxs)(X.Fragment, { children: [/* @__PURE__ */ (0, X.jsxs)("span", {
		"data-guide-target": "history-import",
		"data-button-group": !0,
		"data-split-button": !0,
		"data-variant": "primary",
		children: [/* @__PURE__ */ (0, X.jsx)(i, {
			leadingIcon: s,
			title: Ri,
			onClick: n,
			...E(t),
			children: "读取浏览器记录"
		}), /* @__PURE__ */ (0, X.jsx)(i, {
			ref: o,
			iconOnly: !0,
			leadingIcon: M,
			"aria-label": "更多取得浏览记录的方式",
			"aria-haspopup": "dialog",
			"aria-expanded": c,
			...E(t),
			onClick: () => {
				t || l(!0);
			}
		})]
	}), /* @__PURE__ */ (0, X.jsx)(e, {
		triggerRef: o,
		isOpen: c,
		onOpenChange: l,
		placement: "bottom end",
		offset: 4,
		className: _,
		children: /* @__PURE__ */ (0, X.jsxs)(v, {
			"aria-label": "更多取得浏览记录的方式",
			className: "flex w-52 flex-col gap-1 outline-none",
			children: [
				/* @__PURE__ */ (0, X.jsxs)("button", {
					type: "button",
					className: Fi,
					onClick: () => u(n),
					children: [/* @__PURE__ */ (0, X.jsx)(s, {
						"aria-hidden": !0,
						className: "size-4 shrink-0"
					}), "读取浏览器记录"]
				}),
				/* @__PURE__ */ (0, X.jsxs)("button", {
					type: "button",
					className: Fi,
					onClick: () => u(r),
					children: [/* @__PURE__ */ (0, X.jsx)(S, {
						"aria-hidden": !0,
						className: "size-4 shrink-0"
					}), "导入历史文件"]
				}),
				/* @__PURE__ */ (0, X.jsxs)("button", {
					type: "button",
					className: Fi,
					onClick: () => u(a),
					children: [/* @__PURE__ */ (0, X.jsx)(be, {
						"aria-hidden": !0,
						className: "size-4 shrink-0"
					}), "导入书签文件"]
				})
			]
		})
	})] });
}
function la({ sources: e, browsers: t, window: n, toast: r, emptyActions: a }) {
	let o = We({
		mutationFn: (e) => Ae(e, n),
		onSuccess: (e) => {
			P.setQueryData(F(n), e.dashboard), r("已移除口味数据源");
		}
	});
	return /* @__PURE__ */ (0, X.jsxs)(Ni, {
		browsers: t,
		sources: e,
		range: n,
		children: [o.error ? /* @__PURE__ */ (0, X.jsx)("div", {
			className: "sm:col-span-2",
			children: /* @__PURE__ */ (0, X.jsx)(y, {
				tone: "error",
				children: j(o.error)
			})
		}) : null, e.length ? /* @__PURE__ */ (0, X.jsx)(X.Fragment, { children: e.filter((e) => !t.some((t) => t.source_keys?.includes(e.source_key))).map((e) => /* @__PURE__ */ (0, X.jsxs)("div", {
			"data-taste-source": "import",
			className: Mi,
			children: [
				/* @__PURE__ */ (0, X.jsx)("span", {
					className: "inline-grid size-8 shrink-0 place-items-center rounded-lg text-text-secondary",
					children: e.browser === "browserexport" ? /* @__PURE__ */ (0, X.jsx)(S, {
						"aria-hidden": !0,
						className: "size-4"
					}) : /* @__PURE__ */ (0, X.jsx)(T, {
						"aria-hidden": !0,
						className: "size-4"
					})
				}),
				/* @__PURE__ */ (0, X.jsxs)("span", {
					className: "flex min-w-0 grow flex-col gap-0.5",
					children: [/* @__PURE__ */ (0, X.jsx)("b", {
						className: "min-w-0 text-body-2-medium break-words text-text-primary",
						children: e.profile
					}), /* @__PURE__ */ (0, X.jsx)("small", {
						className: "min-w-0 text-caption-1-regular break-words text-text-secondary",
						children: `导入文件 · ${e.host} · ${Number(e.visits || e.bookmarks || 0).toLocaleString()} ${e.bookmarks ? "枚书签" : "条历史"}`
					})]
				}),
				/* @__PURE__ */ (0, X.jsx)(i, {
					variant: "secondary",
					size: "small",
					"aria-label": `移除 ${e.profile}`,
					className: "shrink-0",
					iconOnly: !0,
					leadingIcon: m,
					...E(o.isPending),
					onClick: () => {
						o.isPending || A({
							title: "移除口味数据源",
							body: Qi,
							confirmLabel: "移除口味数据源",
							onConfirm: () => o.mutateAsync(e.source_key)
						});
					}
				})
			]
		}, e.source_key)) }) : t.length ? null : /* @__PURE__ */ (0, X.jsx)(c, {
			size: "compact",
			icon: T,
			title: "还没有数据源",
			actions: a,
			children: zi
		})]
	});
}
function ua(e) {
	let { onSignal: o, navigate: s, toast: l, onboarding: u } = e, [d, p] = (0, W.useState)("all"), [m, h] = (0, W.useState)("browser"), g = (0, W.useRef)(null), _ = (0, W.useRef)(null), v = Ge({
		queryKey: F(d),
		queryFn: ({ signal: e }) => he(d, e),
		placeholderData: Ce,
		refetchInterval: (e) => ze(e.state.data)
	}), { job: b, running: x, outcome: S, start: C } = Ue({
		queryKey: oe,
		queryFn: ({ signal: e }) => ge(e),
		start: () => Pe(d),
		idlePollMs: f,
		onFinish: (e) => {
			e.status !== "failed" && (P.invalidateQueries({ queryKey: ["taste"] }), l(e.warnings?.length ? "部分浏览记录未取得" : "已更新口味分析"));
		}
	}), w = We({
		mutationFn: (e) => he(e, void 0, !0),
		onSuccess: (e, t) => {
			P.setQueryData(F(t), e);
		}
	}), T = We({
		mutationFn: (e) => Se(e),
		onSuccess: (e) => {
			P.setQueryData(F("all"), e.dashboard), p("all"), l("已导入口味数据");
		}
	}), ue = (e) => {
		let t = e.currentTarget.files?.[0];
		e.currentTarget.value = "", t && !T.isPending && (T.reset(), T.mutate(t));
	}, fe = () => {
		x || C.isPending || (C.reset(), C.mutate());
	}, D = v.data;
	if (!D) return /* @__PURE__ */ (0, X.jsx)(et, { children: /* @__PURE__ */ (0, X.jsx)(y, {
		tone: "error",
		title: "口味分析读取失败",
		children: v.error ? j(v.error) : "读取口味分析失败"
	}) });
	let O = D.summary || {}, k = D.coverage || {}, A = D.rankings || {}, me = D.storage || {}, M = Le(A.browser_categories || []), N = De(M).length > 0, _e = D.gaps || [], ve = k.tagged || 0, Ee = k.identified || 0, Oe = C.error ? j(C.error) : T.error ? j(T.error) : w.error ? j(w.error) : S?.status === "failed" ? S.error || "读取未取得" : "", ke = /* @__PURE__ */ (0, X.jsxs)("div", {
		className: "flex flex-wrap justify-center gap-2",
		children: [/* @__PURE__ */ (0, X.jsx)(i, {
			variant: "secondary",
			...E(x || C.isPending || T.isPending),
			onClick: fe,
			children: "读取浏览器记录"
		}), /* @__PURE__ */ (0, X.jsx)(i, {
			variant: "secondary",
			...E(T.isPending),
			onClick: () => g.current?.click(),
			children: "导入历史文件"
		})]
	});
	return /* @__PURE__ */ (0, X.jsx)(et, { children: /* @__PURE__ */ (0, X.jsxs)(ea, {
		value: d === "all" ? m === "peach" ? /* @__PURE__ */ (0, X.jsx)(a, {
			size: "small",
			variant: "secondary",
			href: "/",
			children: "浏览馆藏"
		}) : ke : /* @__PURE__ */ (0, X.jsx)(i, {
			size: "small",
			variant: "secondary",
			onClick: () => p("all"),
			children: "查看全部时间"
		}),
		children: [
			/* @__PURE__ */ (0, X.jsxs)(r, {
				selectedKey: m,
				onSelectionChange: (e) => h(String(e)),
				className: "flex flex-col gap-5",
				children: [
					/* @__PURE__ */ (0, X.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, X.jsxs)(re, {
							"aria-label": "口味分析的数据来源",
							className: te,
							children: [/* @__PURE__ */ (0, X.jsx)(n, {
								id: "peach",
								className: ee,
								children: "Peach 观看与评价"
							}), /* @__PURE__ */ (0, X.jsx)(n, {
								id: "browser",
								className: ee,
								children: "浏览器记录"
							})]
						}), /* @__PURE__ */ (0, X.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, X.jsx)(ie, {
									"aria-label": "分析范围",
									selectedKey: d,
									onSelectionChange: (e) => {
										e !== null && p(String(e));
									},
									children: se.map(([e, t]) => /* @__PURE__ */ (0, X.jsx)(ae, {
										id: e,
										children: t
									}, e))
								}),
								/* @__PURE__ */ (0, X.jsx)(ca, {
									busy: x || C.isPending || T.isPending,
									onRefresh: fe,
									onImport: () => g.current?.click(),
									onImportBookmarks: () => _.current?.click()
								}),
								/* @__PURE__ */ (0, X.jsx)("input", {
									ref: g,
									type: "file",
									tabIndex: -1,
									"aria-hidden": !0,
									className: "hidden",
									onChange: ue
								}),
								/* @__PURE__ */ (0, X.jsx)("input", {
									ref: _,
									type: "file",
									tabIndex: -1,
									"aria-hidden": !0,
									className: "hidden",
									"data-bookmark-import": !0,
									onChange: ue
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, X.jsx)(sa, {
						onboarding: u,
						done: !!(O.history_sources || D.updated_at)
					}),
					/* @__PURE__ */ (0, X.jsxs)("div", {
						"aria-live": "polite",
						className: "flex flex-col gap-3 empty:hidden",
						children: [
							x ? /* @__PURE__ */ (0, X.jsx)(ce, {
								label: b?.message || "正在读取浏览记录并更新口味分析",
								value: b?.checked,
								total: b?.total
							}) : null,
							T.isPending ? /* @__PURE__ */ (0, X.jsx)(ce, { label: "正在导入口味数据" }) : null,
							D.stale && D.error ? /* @__PURE__ */ (0, X.jsx)(y, {
								tone: "error",
								action: /* @__PURE__ */ (0, X.jsx)(i, {
									variant: "secondary",
									size: "small",
									...E(w.isPending),
									onClick: () => w.mutate(d),
									children: "立即重试"
								}),
								children: `口味分析更新失败，当前显示 ${Be(D.computed_at)} 的结果。${D.error}`
							}) : D.stale ? /* @__PURE__ */ (0, X.jsx)(ce, { label: `正在更新口味分析，当前显示 ${Be(D.computed_at)} 的结果` }) : null,
							Oe ? /* @__PURE__ */ (0, X.jsx)(y, {
								tone: "error",
								children: Oe
							}) : null,
							S?.warnings?.length ? /* @__PURE__ */ (0, X.jsx)(y, {
								tone: "warning",
								children: S.warnings.join("；")
							}) : null
						]
					}),
					/* @__PURE__ */ (0, X.jsxs)(t, {
						id: "browser",
						className: "flex flex-col gap-5",
						children: [
							/* @__PURE__ */ (0, X.jsxs)("div", {
								className: ne,
								children: [
									/* @__PURE__ */ (0, X.jsx)($, {
										accent: 0,
										icon: He,
										term: "浏览记录",
										figure: Number(O.history_visits || 0).toLocaleString(),
										detail: xe(O),
										detailTitle: `${Ie(O.range_start)}—${Ie(O.range_end)}`
									}),
									/* @__PURE__ */ (0, X.jsx)($, {
										accent: 1,
										icon: we,
										term: "口味维度",
										figure: M.length.toLocaleString(),
										detail: M[0]?.name || "尚无主维度"
									}),
									/* @__PURE__ */ (0, X.jsx)($, {
										accent: 2,
										icon: Te,
										term: "浏览线索",
										figure: _e.length.toLocaleString()
									}),
									/* @__PURE__ */ (0, X.jsx)($, {
										accent: 3,
										icon: be,
										term: "浏览器书签",
										figure: Number(O.bookmarks || 0).toLocaleString(),
										detail: `${Number(me.exports || 0).toLocaleString()} 份私有导出 · ${ye(me.bytes || 0)}`
									})
								]
							}),
							/* @__PURE__ */ (0, X.jsxs)("section", {
								className: N ? `${Ii} md:flex-row md:gap-6` : Ii,
								"aria-label": "浏览器画像",
								children: [/* @__PURE__ */ (0, X.jsxs)("div", {
									className: N ? "flex shrink-0 flex-col gap-2 pb-5 md:w-80 md:pr-6 md:pb-0" : "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1",
									children: [
										/* @__PURE__ */ (0, X.jsx)("span", {
											className: "text-caption-1-regular text-text-secondary",
											children: "浏览器画像"
										}),
										N ? /* @__PURE__ */ (0, X.jsx)(ki, {
											rows: M,
											label: "主要口味维度"
										}) : null,
										/* @__PURE__ */ (0, X.jsx)("small", {
											className: "text-caption-1-regular text-text-secondary",
											children: D.updated_at ? `更新于 ${Ie(D.updated_at)}` : "尚未采集浏览记录"
										})
									]
								}), /* @__PURE__ */ (0, X.jsx)("div", {
									className: "flex min-w-0 grow flex-col",
									children: M.length ? /* @__PURE__ */ (0, X.jsx)(Ai, {
										rows: M,
										label: "口味维度排名"
									}) : /* @__PURE__ */ (0, X.jsx)(c, {
										size: "compact",
										icon: Te,
										title: "暂无口味维度",
										actions: /* @__PURE__ */ (0, X.jsx)(ta, {}),
										children: Vi
									})
								})]
							}),
							/* @__PURE__ */ (0, X.jsx)(Ke, {
								activity: D.activity,
								title: "浏览活跃时间",
								dailyTitle: "每日活跃",
								words: {
									unit: "口味网站访问",
									series: "访问",
									cellUnit: "次访问"
								},
								tone: 4,
								empty: "还没有可用于分析的口味网站访问记录。"
							}),
							/* @__PURE__ */ (0, X.jsx)(ji, { flows: D.creator_flows }),
							/* @__PURE__ */ (0, X.jsx)(aa, {
								label: "浏览器口味维度",
								onSignal: o,
								panels: [
									{
										id: "tags",
										name: "标签",
										props: {
											rows: A.browser_tags || [],
											kind: "tag",
											visual: "none",
											empty: Ui
										}
									},
									{
										id: "creators",
										name: "创作者",
										props: {
											rows: A.browser_creators || [],
											kind: "creator",
											visual: "creator",
											empty: Wi
										}
									},
									{
										id: "performers",
										name: "女优",
										props: {
											rows: A.browser_performers || [],
											kind: "performer",
											visual: "entity",
											empty: "还没有与已建档女优关联的浏览记录。"
										}
									},
									{
										id: "domains",
										name: "常访问网站",
										props: {
											rows: A.domains || [],
											kind: "",
											visual: "domain",
											empty: Gi
										}
									},
									{
										id: "gaps",
										name: "浏览线索",
										props: {
											rows: _e,
											kind: "",
											visual: "none",
											empty: Hi
										}
									}
								]
							})
						]
					}),
					/* @__PURE__ */ (0, X.jsxs)(t, {
						id: "peach",
						className: "flex flex-col gap-5",
						children: [
							/* @__PURE__ */ (0, X.jsxs)("div", {
								className: ne,
								children: [
									/* @__PURE__ */ (0, X.jsx)($, {
										accent: 0,
										icon: le,
										term: "Peach 看过",
										figure: Number(O.peach_items || 0).toLocaleString(),
										detail: Re(O.peach_seconds || 0)
									}),
									/* @__PURE__ */ (0, X.jsx)($, {
										accent: 1,
										icon: de,
										term: "喜欢",
										figure: Number(O.liked || 0).toLocaleString()
									}),
									/* @__PURE__ */ (0, X.jsx)($, {
										accent: 2,
										icon: pe,
										term: "不合口味",
										figure: Number(O.disliked || 0).toLocaleString()
									}),
									/* @__PURE__ */ (0, X.jsx)($, {
										accent: 3,
										icon: we,
										term: "有标签",
										figure: ve.toLocaleString()
									})
								]
							}),
							/* @__PURE__ */ (0, X.jsxs)("section", {
								className: `${Ii} md:flex-row md:gap-6`,
								"aria-label": "Peach 观看",
								children: [/* @__PURE__ */ (0, X.jsxs)("div", {
									className: "flex shrink-0 flex-col gap-0.5 pb-5 md:w-72 md:pr-6 md:pb-0",
									children: [
										/* @__PURE__ */ (0, X.jsx)("span", {
											className: "text-caption-1-regular text-text-secondary",
											children: "Peach 观看"
										}),
										/* @__PURE__ */ (0, X.jsx)("b", {
											className: "text-display-4-medium tabular-nums text-text-primary",
											children: Number(O.peach_items || 0).toLocaleString()
										}),
										/* @__PURE__ */ (0, X.jsx)("span", {
											className: "text-body-2-regular text-text-secondary",
											children: "部作品有观看或评价记录"
										})
									]
								}), /* @__PURE__ */ (0, X.jsxs)("div", {
									className: "flex min-w-0 grow flex-col",
									children: [/* @__PURE__ */ (0, X.jsx)(da, {
										term: "有标签",
										value: ve,
										rest: k.untagged || 0
									}), /* @__PURE__ */ (0, X.jsx)(da, {
										term: "有身份",
										value: Ee,
										rest: k.unidentified || 0
									})]
								})]
							}),
							/* @__PURE__ */ (0, X.jsx)(aa, {
								label: "Peach 口味维度",
								onSignal: o,
								panels: [
									{
										id: "tags",
										name: "标签",
										props: {
											rows: A.peach_tags || [],
											kind: "tag",
											visual: "none",
											empty: Ki
										}
									},
									{
										id: "creators",
										name: "创作者",
										props: {
											rows: A.peach_creators || [],
											kind: "creator",
											visual: "creator",
											empty: qi
										}
									},
									{
										id: "performers",
										name: "女优",
										props: {
											rows: A.peach_performers || [],
											kind: "performer",
											visual: "entity",
											empty: Ji
										}
									}
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, X.jsx)(oa, {
				data: D,
				onSignal: o,
				navigate: s
			}),
			/* @__PURE__ */ (0, X.jsx)(la, {
				sources: D.sources || [],
				browsers: D.browsers || [],
				window: d,
				toast: l,
				emptyActions: ke
			})
		]
	}) });
}
function da({ term: e, value: t, rest: n }) {
	let r = Math.max(t + n, 1);
	return /* @__PURE__ */ (0, X.jsxs)("div", {
		className: "flex flex-col gap-1.5 border-b border-separator-border py-3 last:border-b-0",
		children: [/* @__PURE__ */ (0, X.jsxs)("p", {
			className: "flex items-baseline justify-between gap-3 text-body-2-regular text-text-primary",
			children: [/* @__PURE__ */ (0, X.jsx)("span", { children: e }), /* @__PURE__ */ (0, X.jsxs)("b", {
				className: "tabular-nums",
				children: [t.toLocaleString(), /* @__PURE__ */ (0, X.jsx)("span", {
					className: "ml-1.5 text-caption-1-regular text-text-secondary",
					children: `${n.toLocaleString()} 项待补`
				})]
			})]
		}), /* @__PURE__ */ (0, X.jsx)(x, {
			meter: !0,
			label: `${e}：${t.toLocaleString()} / ${r.toLocaleString()}`,
			value: t,
			max: r
		})]
	});
}
export { $i as TASTE_GUIDE_KEY, ua as TastePage };

//# debugId=8b9a1248-bf4a-4f4d-b6e1-690a112365f6