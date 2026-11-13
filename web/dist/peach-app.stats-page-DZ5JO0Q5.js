(function() {
	try {
		var e = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, t = new e.Error().stack;
		t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "cae53a6a-7f63-4dbe-8104-5dc94f0fb524", e._sentryDebugIdIdentifier = "sentry-dbid-cae53a6a-7f63-4dbe-8104-5dc94f0fb524");
	} catch {}
})();
import { $b4f18e3395fe64d7$export$3d96ec278d3efce4 as e, $b4f18e3395fe64d7$export$3e41faf802a29e71 as t, $b4f18e3395fe64d7$export$b2539bed5023c21c as n, $b4f18e3395fe64d7$export$e51a686c67fdaa2d as r, ButtonLink as i, EmptyState as a, LOC as o, MEDIA_SOURCE_ICONS as s, NR as c, Note as l, Progress as u, SEGMENT as d, SEGMENTED_TRACK as f, STATS_KEY as p, STAT_STRIP as m, SegmentedTabList as h, SourceMark as g, StatCard as _, StatusLabel as v, Xc as y, Xt as b, _8 as x, __toESM as S, bandRows as C, cardClass as w, clsx as T, errorMessage as E, fetchStats as ee, fmtCount as D, fmtSize as O, known as k, lengthRows as te, mM as A, mediumRows as ne, percentText as j, playedFor as re, playedItemUrl as ie, radialArc as ae, radialBarSize as oe, radialCeiling as se, radialSlices as ce, reachedShare as le, replayRows as ue, require_jsx_runtime as de, require_react as fe, settingsPath as pe, statCardClass as me, uo as he, useQuery as ge, watchNote as _e, watchedShare as ve } from "./peach-app.js";
import { ActivityHeat as ye, BarCard as M, ExpandableRanking as be, PolarAngleAxis as xe, selectPolarAxisScale as Se, selectPolarAxisTicks as Ce, selectPolarGraphicalItemAxisTicks as we } from "./peach-app.expandable-ranking-BvMp3uyZ.js";
import { AnimatedItems as Te, CHART_CARD as Ee, CHART_COLORS as De, Cell as Oe, ChartBackground as ke, ChartContainer as Ae, ChartEmpty as je, ChartLegend as Me, ChartLegendContent as Ne, ChartTip as Pe, ChartTooltip as Fe, ChartTooltipContent as Ie, DefaultZIndexes as Le, LabelListFromLabelProp as Re, Layer as N, LoadingIndicator as ze, PolarChart as Be, PolarLabelListContextProvider as Ve, RegisterGraphicalItemId as He, Sector as P, SetPolarGraphicalItem as Ue, SetPolarLegendPayload as We, SetTooltipEntrySettings as Ge, Shape as Ke, ZIndexLayer as qe, adaptEventsOfChild as Je, arrayTooltipSearcher as Ye, combineAllBarPositions as Xe, combineBarPosition as Ze, combineBarSizeList as Qe, combineDisplayedStackedData as $e, combineStackGroups as et, combineStackedData as tt, createSelector as F, defaultPolarChartProps as nt, findAllByType as rt, getBandSizeOfAxis as I, getBaseValueOfBar as it, getCateCoordinateOfBar as at, getColorsCount as ot, getNormalizedStackId as st, getTooltipNameProp as ct, getValueByDataKey as lt, getZIndexFromUnknown as ut, interpolate as dt, isCategoricalAxis as ft, isNullish as pt, isStacked as mt, matchAppend as ht, mathSign as gt, noop as _t, resolveDefaultProps as vt, selectActiveTooltipIndex as yt, selectAngleAxis as bt, selectBarCategoryGap as xt, selectBarGap as St, selectChartDataAndAlwaysIgnoreIndexes as Ct, selectChartDataWithIndexes as wt, selectChartLayout as L, selectPolarItemsSettings as Tt, selectPolarViewBox as Et, selectRadiusAxis as Dt, selectReverseStackOrder as Ot, selectRootBarSize as kt, selectRootMaxBarSize as At, selectStackOffsetType as jt, selectTooltipAxis as Mt, selectUnfilteredPolarItems as Nt, sliceConfig as Pt, sliceKey as Ft, svgPropertiesNoEvents as It, svgPropertiesNoEventsFromUnknown as Lt, truncateByDomain as Rt, useAnimationCallbacks as zt, useAppSelector as R, useMouseClickItemDispatch as Bt, useMouseEnterItemDispatch as Vt, useMouseLeaveItemDispatch as Ht, usePolarChartLayout as Ut } from "./peach-app.chart-tip-CRxYp6KT.js";
import { ConnectionStatus as Wt } from "./peach-app.connection-status-DI6kgn3i.js";
import { Page as Gt } from "./peach-app.page-QAncjzM1.js";
// node_modules/recharts/es6/util/RadialBarUtils.js
var z = /* @__PURE__ */ S(fe()), Kt = ["option"];
function qt(e, t) {
	if (e == null) return {};
	var n, r, i = Jt(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function Jt(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var Yt = P;
function Xt(e) {
	return typeof e == "string" ? parseInt(e, 10) : e;
}
function Zt(e) {
	var t = e.option, n = qt(e, Kt);
	return /*#__PURE__*/ z.createElement(Ke, {
		option: t,
		DefaultShape: Yt,
		shapeProps: n
	});
}
// node_modules/recharts/es6/state/selectors/radialBarSelectors.js
function Qt(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function B(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Qt(Object(n), !0).forEach(function(t) {
			$t(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Qt(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function $t(e, t, n) {
	return (t = en(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function en(e) {
	var t = tn(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function tn(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var V = F([(e, t) => Dt(e, t), (e, t) => Se(e, "radiusAxis", t)], (e, t) => {
	if (e != null && t != null) return B(B({}, e), {}, { scale: t });
}), nn = (e, t) => we(e, "radiusAxis", t, !1), H = F([(e, t, n) => bt(e, n), (e, t, n) => Se(e, "angleAxis", n)], (e, t) => {
	if (e != null && t != null) return B(B({}, e), {}, { scale: t });
}), U = (e, t, n) => Ce(e, "angleAxis", n, !1), W = F([Nt, (e, t, n, r) => r], (e, t) => {
	if (e.some((e) => e.type === "radialBar" && t.dataKey === e.dataKey && t.stackId === e.stackId)) return t;
}), rn = F([
	L,
	V,
	nn,
	H,
	U
], (e, t, n, r, i) => ft(e, "radiusAxis") ? I(t, n, !1) : I(r, i, !1)), an = F([
	H,
	V,
	L
], (e, t, n) => {
	var r = n === "radial" ? e : t;
	if (r != null && r.scale != null) return it({ numericAxis: r });
}), on = (e, t, n, r, i) => i, sn = (e, t, n, r, i) => n, cn = (e, t, n, r, i) => t, ln = (e, t, n, r, i) => r.maxBarSize, un = (e) => e.type === "radialBar", dn = F([
	L,
	Nt,
	sn,
	cn
], (e, t, n, r) => t.filter((t) => e === "centric" ? t.angleAxisId === n : t.radiusAxisId === r).filter((e) => e.hide === !1).filter(un)), fn = F([
	dn,
	kt,
	() => void 0
], Qe), pn = F([
	L,
	At,
	H,
	U,
	V,
	nn,
	ln
], (e, t, n, r, i, a, o) => {
	var s = pt(o) ? t : o;
	return e === "centric" ? I(n, r, !0) ?? s ?? 0 : I(i, a, !0) ?? s ?? 0;
}), mn = F([
	fn,
	At,
	St,
	xt,
	pn,
	rn,
	ln
], Xe), hn = F([mn, W], Ze), gn = F([Tt], (e) => e.filter(un).filter(mt)), _n = F([
	gn,
	Ct,
	Mt
], $e), vn = F([
	_n,
	gn,
	jt,
	Ot
], et), yn = F([(e, t, n) => L(e) === "centric" ? vn(e, "radiusAxis", t) : vn(e, "angleAxis", n), W], tt), bn = F([
	H,
	U,
	V,
	nn,
	wt,
	W,
	rn,
	L,
	an,
	Et,
	on,
	hn,
	yn
], (e, t, n, r, i, a, o, s, c, l, u, d, f) => {
	var p = i.chartData, m = i.dataStartIndex, h = i.dataEndIndex;
	if (a == null || n == null || e == null || p == null || o == null || d == null || s !== "centric" && s !== "radial" || r == null || l == null) return [];
	var g = a.dataKey, _ = a.minPointSize, v = l.cx, y = l.cy, b = l.startAngle, x = l.endAngle;
	return Bn({
		angleAxis: e,
		angleAxisTicks: t,
		bandSize: o,
		baseValue: c,
		cells: u,
		cx: v,
		cy: y,
		dataKey: g,
		dataStartIndex: m,
		displayedData: p.slice(m, h + 1),
		endAngle: x,
		layout: s,
		minPointSize: _,
		pos: d,
		radiusAxis: n,
		radiusAxisTicks: r,
		stackedData: f,
		stackedDomain: f ? (s === "centric" ? n : e).scale.domain() : null,
		startAngle: b
	});
}), xn = F([Ct, (e, t) => t], (e, t) => {
	var n = e.chartData, r = e.dataStartIndex, i = e.dataEndIndex;
	if (n == null) return [];
	var a = n.slice(r, i + 1);
	return a.length === 0 ? [] : a.map((e) => ({
		type: t,
		value: e.name,
		color: e.fill,
		payload: e
	}));
}), Sn = [
	"shape",
	"activeShape",
	"cornerRadius",
	"id"
], Cn = [
	"onMouseEnter",
	"onClick",
	"onMouseLeave"
], wn = ["value", "background"];
function G() {
	return G = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, G.apply(null, arguments);
}
function Tn(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function K(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Tn(Object(n), !0).forEach(function(t) {
			En(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Tn(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function En(e, t, n) {
	return (t = Dn(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Dn(e) {
	var t = On(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function On(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function q(e, t) {
	if (e == null) return {};
	var n, r, i = kn(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function kn(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var An = [];
function jn(e) {
	var t = e.showLabels, n = e.sectors, r = e.children, i = n.map((e) => ({
		value: e.value,
		payload: e.payload,
		parentViewBox: void 0,
		clockWise: !1,
		viewBox: {
			cx: e.cx,
			cy: e.cy,
			innerRadius: e.innerRadius,
			outerRadius: e.outerRadius,
			startAngle: e.startAngle,
			endAngle: e.endAngle,
			clockWise: !1
		},
		fill: e.fill
	}));
	return /*#__PURE__*/ z.createElement(Ve, { value: t ? i : void 0 }, r);
}
function Mn(e) {
	var t = e.sectors, n = e.allOtherRadialBarProps, r = e.showLabels, i = e.animationElapsedTime, a = e.isAnimating, o = e.isEntrance, s = n.shape, c = n.activeShape, l = n.cornerRadius, u = n.id, d = q(n, Sn), f = It(d), p = R(yt), m = n.onMouseEnter, h = n.onClick, g = n.onMouseLeave, _ = q(n, Cn), v = Vt(m, n.dataKey, u), y = Ht(g), b = Bt(h, n.dataKey, u);
	return t == null ? null : /*#__PURE__*/ z.createElement(jn, {
		showLabels: r,
		sectors: t
	}, t.map((e, t) => {
		var n = !!(c && p === String(t)), r = v(e, t), u = y(e, t), m = b(e, t), h = K(K(K(K({}, f), {}, { cornerRadius: Xt(l) }, e), Je(_, e, t)), {}, {
			onMouseEnter: r,
			onMouseLeave: u,
			onClick: m,
			className: `recharts-radial-bar-sector ${e.className}`,
			forceCornerRadius: d.forceCornerRadius,
			cornerIsExternal: d.cornerIsExternal,
			animationElapsedTime: i,
			isAnimating: a,
			isEntrance: o,
			isActive: n,
			option: n && c != null ? c : s,
			index: t
		});
		return n ? /*#__PURE__*/ z.createElement(qe, {
			zIndex: Le.activeBar,
			key: `sector-${e.cx}-${e.cy}-${e.innerRadius}-${e.outerRadius}-${e.startAngle}-${e.endAngle}-${t}`
		}, /*#__PURE__*/ z.createElement(Zt, h)) : /*#__PURE__*/ z.createElement(Zt, G({ key: `sector-${e.cx}-${e.cy}-${e.innerRadius}-${e.outerRadius}-${e.startAngle}-${e.endAngle}-${t}` }, h));
	}), /*#__PURE__*/ z.createElement(Re, { label: n.label }), n.children);
}
var Nn = (e, t) => e == null ? [] : t === 1 ? e.flatMap((e) => e.status === "removed" ? [] : [e.next]) : e.flatMap((e) => e.status === "removed" ? [] : e.status === "matched" ? [K(K({}, e.next), {}, {
	startAngle: dt(e.prev.startAngle, e.next.startAngle, t),
	endAngle: dt(e.prev.endAngle, e.next.endAngle, t)
})] : [K(K({}, e.next), {}, { endAngle: dt(e.next.startAngle, e.next.endAngle, t) })]);
function Pn(e) {
	var t = e.props, n = e.previousSectorsRef, r = t.sectors, i = t.isAnimationActive, a = t.animationBegin, o = t.animationDuration, s = t.animationEasing, c = t.onAnimationStart, l = t.onAnimationEnd, u = zt(c, l), d = u.isAnimating, f = u.handleAnimationStart, p = u.handleAnimationEnd, m = Ut();
	return m == null ? null : /*#__PURE__*/ z.createElement(Te, {
		animationInput: t,
		animationIdPrefix: "recharts-radialbar-",
		items: r,
		previousItemsRef: n,
		isAnimationActive: i,
		animationBegin: a,
		animationDuration: o,
		animationEasing: s,
		onAnimationStart: f,
		onAnimationEnd: p,
		animationInterpolateFn: t.animationInterpolateFn,
		animationMatchBy: t.animationMatchBy,
		layout: m
	}, (e, n, r) => /*#__PURE__*/ z.createElement(Mn, {
		sectors: e,
		allOtherRadialBarProps: t,
		showLabels: !d,
		animationElapsedTime: n,
		isAnimating: d || n < 1,
		isEntrance: r
	}));
}
function Fn(e) {
	var t = (0, z.useRef)(null);
	return /*#__PURE__*/ z.createElement(Pn, {
		props: e,
		previousSectorsRef: t
	});
}
function In(e) {
	var t = R((t) => xn(t, e.legendType));
	return /*#__PURE__*/ z.createElement(We, { legendPayload: t ?? [] });
}
var Ln = /*#__PURE__*/ z.memo((e) => {
	var t = e.dataKey, n = e.sectors, r = e.stroke, i = e.strokeWidth, a = e.name, o = e.hide, s = e.fill, c = e.tooltipType, l = e.formatter, u = e.id, d = {
		dataDefinedOnItem: n,
		getPosition: _t,
		settings: {
			graphicalItemId: u,
			stroke: r,
			strokeWidth: i,
			fill: s,
			nameKey: void 0,
			dataKey: t,
			name: ct(a, t),
			hide: o,
			type: c,
			color: s,
			unit: "",
			formatter: l
		}
	};
	return /*#__PURE__*/ z.createElement(Ge, { tooltipEntrySettings: d });
}), Rn = class extends z.PureComponent {
	renderBackground(e) {
		if (e == null) return null;
		var t = this.props.cornerRadius, n = Lt(this.props.background);
		return /*#__PURE__*/ z.createElement(qe, { zIndex: ut(this.props.background, Le.barBackground) }, e.map((e, r) => {
			e.value;
			var i = e.background, a = q(e, wn);
			if (!i) return null;
			var o = K(K(K(K(K({ cornerRadius: Xt(t) }, a), {}, { fill: "#eee" }, i), n), Je(this.props, e, r)), {}, {
				index: r,
				className: T("recharts-radial-bar-background-sector", String(n?.className)),
				option: i,
				isActive: !1
			});
			return /*#__PURE__*/ z.createElement(Zt, G({ key: `background-${a.cx}-${a.cy}-${a.innerRadius}-${a.outerRadius}-${a.startAngle}-${a.endAngle}-${r}` }, o));
		}));
	}
	render() {
		var e = this.props, t = e.hide, n = e.sectors, r = e.className, i = e.background;
		if (t) return null;
		var a = T("recharts-area", r);
		return /*#__PURE__*/ z.createElement(qe, { zIndex: this.props.zIndex }, /*#__PURE__*/ z.createElement(N, { className: a }, i && /*#__PURE__*/ z.createElement(N, { className: "recharts-radial-bar-background" }, this.renderBackground(n)), /*#__PURE__*/ z.createElement(N, { className: "recharts-radial-bar-sectors" }, /*#__PURE__*/ z.createElement(Fn, this.props))));
	}
};
function zn(e) {
	var t = z.useMemo(() => rt(e.children, Oe), [e.children]), n = z.useMemo(() => ({
		data: void 0,
		hide: !1,
		id: e.id,
		dataKey: e.dataKey,
		minPointSize: e.minPointSize,
		stackId: st(e.stackId),
		maxBarSize: e.maxBarSize,
		barSize: e.barSize,
		type: "radialBar",
		angleAxisId: e.angleAxisId,
		radiusAxisId: e.radiusAxisId
	}), [
		e.id,
		e.dataKey,
		e.minPointSize,
		e.stackId,
		e.maxBarSize,
		e.barSize,
		e.angleAxisId,
		e.radiusAxisId
	]), r = R((r) => bn(r, e.radiusAxisId, e.angleAxisId, n, t)) ?? An;
	return /*#__PURE__*/ z.createElement(z.Fragment, null, /*#__PURE__*/ z.createElement(Ln, {
		dataKey: e.dataKey,
		sectors: r,
		stroke: e.stroke,
		strokeWidth: e.strokeWidth,
		name: e.name,
		hide: e.hide,
		fill: e.fill,
		tooltipType: e.tooltipType,
		formatter: e.formatter,
		id: e.id
	}), /*#__PURE__*/ z.createElement(Rn, G({}, e, { sectors: r })));
}
var J = {
	angleAxisId: 0,
	animationBegin: 0,
	animationDuration: 1500,
	animationEasing: "ease",
	animationMatchBy: ht,
	animationInterpolateFn: Nn,
	background: !1,
	cornerIsExternal: !1,
	cornerRadius: 0,
	forceCornerRadius: !1,
	hide: !1,
	isAnimationActive: "auto",
	label: !1,
	legendType: "rect",
	minPointSize: 0,
	radiusAxisId: 0,
	shape: Yt,
	zIndex: Le.bar
};
function Bn(e) {
	var t = e.displayedData, n = e.stackedData, r = e.dataStartIndex, i = e.stackedDomain, a = e.dataKey, o = e.baseValue, s = e.layout, c = e.radiusAxis, l = e.radiusAxisTicks, u = e.bandSize, d = e.pos, f = e.angleAxis, p = e.minPointSize, m = e.cx, h = e.cy, g = e.angleAxisTicks, _ = e.cells, v = e.startAngle, y = e.endAngle;
	return g == null || l == null ? An : (t ?? []).map((e, t) => {
		var b, x, S, C, w, T;
		if (n ? b = Rt(n[r + t], i) : (b = lt(e, a), Array.isArray(b) || (b = [o, b])), s === "radial") {
			if (C = f.scale.map(b[0]) ?? v, w = f.scale.map(b[1]) ?? y, x = at({
				axis: c,
				ticks: l,
				bandSize: u,
				offset: d.offset,
				entry: e,
				index: t
			}), x != null && w != null && C != null) {
				S = x + d.size;
				var E = w - C;
				if (Math.abs(p) > 0 && Math.abs(E) < Math.abs(p)) {
					var ee = gt(E || p) * (Math.abs(p) - Math.abs(E));
					w += ee;
				}
				T = { background: {
					cx: m,
					cy: h,
					innerRadius: x,
					outerRadius: S,
					startAngle: v,
					endAngle: y
				} };
			}
		} else if (x = c.scale.map(b[0]), S = c.scale.map(b[1]), C = at({
			axis: f,
			ticks: g,
			bandSize: u,
			offset: d.offset,
			entry: e,
			index: t
		}), x != null && S != null && C != null) {
			w = C + d.size;
			var D = S - x;
			if (Math.abs(p) > 0 && Math.abs(D) < Math.abs(p)) {
				var O = gt(D || p) * (Math.abs(p) - Math.abs(D));
				S += O;
			}
		}
		return K(K(K({}, e), T), {}, {
			payload: e,
			value: n ? b : b[1],
			cx: m,
			cy: h,
			innerRadius: x,
			outerRadius: S,
			startAngle: C,
			endAngle: w
		}, _ && _[t] && _[t].props);
	});
}
function Vn(e) {
	var t = vt(e, J);
	return /*#__PURE__*/ z.createElement(He, {
		id: t.id,
		type: "radialBar"
	}, (e) => /*#__PURE__*/ z.createElement(z.Fragment, null, /*#__PURE__*/ z.createElement(Ue, {
		type: "radialBar",
		id: e,
		data: void 0,
		dataKey: t.dataKey,
		hide: t.hide ?? J.hide,
		angleAxisId: t.angleAxisId ?? J.angleAxisId,
		radiusAxisId: t.radiusAxisId ?? J.radiusAxisId,
		stackId: st(t.stackId),
		barSize: t.barSize,
		minPointSize: t.minPointSize,
		maxBarSize: t.maxBarSize
	}), /*#__PURE__*/ z.createElement(In, t), /*#__PURE__*/ z.createElement(zn, G({}, t, { id: e }))));
}
Vn.displayName = "RadialBar";
// node_modules/recharts/es6/chart/RadialBarChart.js
function Hn(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Un(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Hn(Object(n), !0).forEach(function(t) {
			Wn(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Hn(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Wn(e, t, n) {
	return (t = Gn(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Gn(e) {
	var t = Kn(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Kn(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var qn = ["axis", "item"], Jn = Un(Un({}, nt), {}, {
	layout: "radial",
	startAngle: 0,
	endAngle: 360
}), Yn = /*#__PURE__*/ (0, z.forwardRef)((e, t) => {
	var n = vt(e, Jn);
	return /*#__PURE__*/ z.createElement(Be, {
		chartName: "RadialBarChart",
		defaultTooltipEventType: "axis",
		validateTooltipEventTypes: qn,
		tooltipPayloadSearcher: Ye,
		categoricalChartProps: n,
		ref: t
	});
}), Y = de(), Xn = "30%", Zn = "100%", Qn = 5, $n = 14, er = 5, tr = 1500, nr = (0, z.createContext)(null);
function rr() {
	let e = (0, z.use)(nr);
	if (!e) throw Error("Radial chart parts (<RadialBar />, <Tooltip />, …) must be used within <EvilRadialChart />");
	return e;
}
function X({ config: e, data: t, nameKey: n, children: r, className: i, chartProps: a, variant: o = "full", max: s, innerRadius: c = Xn, outerRadius: l = Zn, defaultSelectedDataKey: u = null, onSelectionChange: d, isLoading: f = !1, backgroundVariant: p }) {
	let m = (0, z.useId)().replace(/:/g, ""), [h, g] = (0, z.useState)(u), _ = ur(f), v = sr(o), y = (0, z.useCallback)((e, t) => {
		g(e), d?.(e === null ? null : {
			dataKey: e,
			value: t ?? 0
		});
	}, [d]), b = (0, z.useMemo)(() => t.map((e) => ({
		...e,
		fill: `url(#${m}-radial-colors-${e[n]})`
	})), [
		t,
		n,
		m
	]), x = (0, z.useMemo)(() => ({
		config: e,
		nameKey: n,
		chartId: m,
		isLoading: f,
		selectedBar: h,
		selectBar: y
	}), [
		e,
		n,
		m,
		f,
		h,
		y
	]);
	return /* @__PURE__ */ (0, Y.jsx)(nr, {
		value: x,
		children: /* @__PURE__ */ (0, Y.jsxs)(Ae, {
			className: i,
			config: e,
			children: [/* @__PURE__ */ (0, Y.jsx)(ze, { isLoading: f }), /* @__PURE__ */ (0, Y.jsxs)(Yn, {
				id: m,
				data: f ? _ : b,
				innerRadius: c,
				outerRadius: l,
				startAngle: v.startAngle,
				endAngle: v.endAngle,
				cx: v.cx,
				cy: v.cy,
				...a,
				children: [
					s != null && s > 0 && /* @__PURE__ */ (0, Y.jsx)(xe, {
						type: "number",
						domain: [0, s],
						tick: !1,
						axisLine: !1
					}),
					p && /* @__PURE__ */ (0, Y.jsx)(ke, { variant: p }),
					r,
					f && /* @__PURE__ */ (0, Y.jsx)(dr, {}),
					/* @__PURE__ */ (0, Y.jsx)("defs", { children: /* @__PURE__ */ (0, Y.jsx)(cr, {
						config: e,
						chartId: m
					}) })
				]
			})]
		})
	});
}
function ir({ dataKey: e, cornerRadius: t = Qn, barSize: n = $n, showBackground: r = !0, isClickable: i = !1, radialBarProps: a }) {
	let { nameKey: o, isLoading: s, selectedBar: c, selectBar: l } = rr();
	return s ? null : /* @__PURE__ */ (0, Y.jsx)(Vn, {
		dataKey: e,
		cornerRadius: t,
		barSize: n,
		background: r,
		className: "drop-shadow-sm",
		style: i ? { cursor: "pointer" } : void 0,
		onClick: (t, n) => {
			if (!i) return;
			let r = t, a = r?.[o] ?? String(n), s = Number(r?.[e] ?? 0);
			l(c === a ? null : a, s);
		},
		shape: (e) => {
			let t = e[o], n = c === null || c === t;
			return /* @__PURE__ */ (0, Y.jsx)(P, {
				...e,
				opacity: i && !n ? .15 : 1,
				className: "transition-opacity duration-200"
			});
		},
		...a
	});
}
function ar({ variant: e, roundness: t, defaultIndex: n }) {
	let { nameKey: r, isLoading: i } = rr();
	return i ? null : /* @__PURE__ */ (0, Y.jsx)(Fe, {
		defaultIndex: n,
		cursor: !1,
		content: /* @__PURE__ */ (0, Y.jsx)(Ie, {
			nameKey: r,
			hideLabel: !0,
			roundness: t,
			variant: e
		})
	});
}
function or({ variant: e, align: t = "center", verticalAlign: n = "bottom", isClickable: r = !1 }) {
	let { nameKey: i, isLoading: a, selectedBar: o, selectBar: s } = rr();
	return a ? null : /* @__PURE__ */ (0, Y.jsx)(Me, {
		verticalAlign: n,
		align: t,
		content: /* @__PURE__ */ (0, Y.jsx)(Ne, {
			selected: o,
			onSelectChange: s,
			isClickable: r,
			nameKey: i,
			variant: e
		})
	});
}
function sr(e) {
	switch (e) {
		case "semi": return {
			startAngle: 180,
			endAngle: 0,
			cx: "50%",
			cy: "70%"
		};
		default: return {
			startAngle: 90,
			endAngle: -270,
			cx: "50%",
			cy: "50%"
		};
	}
}
var cr = ({ config: e, chartId: t }) => /* @__PURE__ */ (0, Y.jsx)(Y.Fragment, { children: Object.entries(e).map(([e, n]) => {
	let r = ot(n);
	return /* @__PURE__ */ (0, Y.jsx)("linearGradient", {
		id: `${t}-radial-colors-${e}`,
		x1: "0",
		y1: "0",
		x2: "1",
		y2: "1",
		children: r === 1 ? /* @__PURE__ */ (0, Y.jsxs)(Y.Fragment, { children: [/* @__PURE__ */ (0, Y.jsx)("stop", {
			offset: "0%",
			stopColor: `var(--color-${e}-0)`
		}), /* @__PURE__ */ (0, Y.jsx)("stop", {
			offset: "100%",
			stopColor: `var(--color-${e}-0)`
		})] }) : Array.from({ length: r }, (t, n) => {
			let i = `${n / (r - 1) * 100}%`;
			return /* @__PURE__ */ (0, Y.jsx)("stop", {
				offset: i,
				stopColor: `var(--color-${e}-${n}, var(--color-${e}-0))`
			}, i);
		})
	}, `${t}-radial-colors-${e}`);
}) });
function lr() {
	return Array.from({ length: er }, (e, t) => ({
		name: `loading${t}`,
		value: 40 + Math.random() * 60
	}));
}
function ur(e) {
	let [t, n] = (0, z.useState)(0);
	return (0, z.useEffect)(() => {
		if (!e) return;
		let t = setInterval(() => {
			n((e) => e + 1);
		}, tr);
		return () => clearInterval(t);
	}, [e]), (0, z.useMemo)(() => lr(), [t]);
}
var dr = () => /* @__PURE__ */ (0, Y.jsx)(Vn, {
	dataKey: "value",
	cornerRadius: Qn,
	barSize: $n,
	background: !0,
	isAnimationActive: !0,
	animationDuration: tr,
	animationEasing: "ease-in-out",
	shape: (e) => /* @__PURE__ */ (0, Y.jsx)(P, {
		...e,
		fill: "currentColor",
		fillOpacity: .25
	})
});
X.RadialBar = ir, X.Tooltip = ar, X.Legend = or;
// src/react/stats/radial-card.tsx
var fr = [
	"bg-chart-1",
	"bg-chart-2",
	"bg-chart-3",
	"bg-chart-4",
	"bg-chart-5",
	"bg-chart-6"
], pr = [
	"aria-pressed:bg-chart-1/10 aria-pressed:ring-chart-1",
	"aria-pressed:bg-chart-2/10 aria-pressed:ring-chart-2",
	"aria-pressed:bg-chart-3/10 aria-pressed:ring-chart-3",
	"aria-pressed:bg-chart-4/10 aria-pressed:ring-chart-4",
	"aria-pressed:bg-chart-5/10 aria-pressed:ring-chart-5",
	"aria-pressed:bg-chart-6/10 aria-pressed:ring-chart-6"
];
function mr({ title: e, rows: t, empty: n, unit: r = "个视频" }) {
	let [i, a] = (0, z.useState)(-1), [o, s] = (0, z.useState)(-1), c = ce(t);
	if (!c.length) return /* @__PURE__ */ (0, Y.jsx)(je, {
		title: e,
		children: n
	});
	let l = o >= 0 ? o : i, u = c.reduce((e, t) => e + t.value, 0), d = c[l], f = (e) => a((t) => t === e ? -1 : e), p = se(c.map((e) => e.value)), m = c.map((e, t) => ({
		slice: Ft(t),
		count: e.value,
		arc: ae(e.value, p)
	}));
	return /* @__PURE__ */ (0, Y.jsxs)("section", {
		className: Ee,
		children: [
			/* @__PURE__ */ (0, Y.jsxs)("header", {
				className: "flex flex-wrap items-end justify-between gap-x-4 gap-y-1",
				children: [/* @__PURE__ */ (0, Y.jsxs)("span", {
					className: "flex min-w-0 flex-col gap-1",
					children: [/* @__PURE__ */ (0, Y.jsxs)("h3", {
						className: "flex items-center gap-1.5 text-title-2-medium wrap-anywhere text-text-primary",
						children: [d?.mark ? /* @__PURE__ */ (0, Y.jsx)(g, { mark: d.mark }) : null, d ? d.name : e]
					}), /* @__PURE__ */ (0, Y.jsx)("b", {
						className: "text-display-4-medium tabular-nums text-text-primary",
						children: (d ? d.value : u).toLocaleString()
					})]
				}), /* @__PURE__ */ (0, Y.jsx)("small", {
					className: "text-caption-1-regular text-text-secondary",
					children: r
				})]
			}),
			/* @__PURE__ */ (0, Y.jsx)("div", {
				role: "img",
				"aria-label": e,
				onPointerLeave: () => s(-1),
				children: /* @__PURE__ */ (0, Y.jsxs)(X, {
					data: m,
					nameKey: "slice",
					config: Pt(c.map((e) => e.name)),
					max: p,
					innerRadius: "22%",
					className: "aspect-auto h-75 max-sm:h-65",
					children: [/* @__PURE__ */ (0, Y.jsx)(X.RadialBar, {
						dataKey: "arc",
						barSize: oe(c.length),
						radialBarProps: {
							shape: (e) => /* @__PURE__ */ (0, Y.jsx)(P, {
								...e,
								opacity: l >= 0 && l !== e.index ? .3 : 1,
								className: "cursor-pointer transition-opacity duration-200"
							}),
							onClick: (e, t) => f(t),
							onMouseEnter: (e, t) => s(t)
						}
					}), /* @__PURE__ */ (0, Y.jsx)(Pe, {
						nameKey: "slice",
						valueKey: "count",
						hideLabel: !0
					})]
				})
			}),
			/* @__PURE__ */ (0, Y.jsx)("div", {
				className: "inline-grid w-full grid-cols-3 gap-2 max-sm:grid-cols-2",
				children: c.map((e, t) => /* @__PURE__ */ (0, Y.jsxs)("button", {
					type: "button",
					"aria-pressed": i === t,
					onClick: () => f(t),
					onPointerEnter: () => s(t),
					onPointerLeave: () => s(-1),
					onFocus: () => s(t),
					onBlur: () => s(-1),
					className: `flex min-w-0 cursor-pointer flex-col items-start gap-1 rounded-xl bg-background-tertiary-default p-2.5 text-left outline-none aria-pressed:ring-1 aria-pressed:ring-inset focus-visible:ring-2 focus-visible:ring-border-focus-ring ${pr[t % 6]}`,
					children: [
						/* @__PURE__ */ (0, Y.jsxs)("span", {
							className: "flex min-w-0 max-w-full items-start gap-1.5 text-caption-1-regular text-text-secondary",
							children: [/* @__PURE__ */ (0, Y.jsx)("i", {
								"aria-hidden": !0,
								className: `mt-0.5 size-3 shrink-0 rounded-sm ${fr[t % 6]}`
							}), /* @__PURE__ */ (0, Y.jsxs)("span", {
								className: "inline-flex min-w-0 items-start gap-1.5 wrap-anywhere",
								children: [e.mark ? /* @__PURE__ */ (0, Y.jsx)(g, { mark: e.mark }) : null, e.name]
							})]
						}),
						/* @__PURE__ */ (0, Y.jsx)("b", {
							className: "text-title-2-medium tabular-nums text-text-primary",
							children: e.value.toLocaleString()
						}),
						e.bytes == null ? null : /* @__PURE__ */ (0, Y.jsx)("small", {
							className: "text-caption-1-regular text-text-secondary",
							children: O(e.bytes)
						})
					]
				}, Ft(t)))
			})
		]
	});
}
// src/react/stats/stats-page.tsx
var hr = pe("媒体库与入库"), gr = 10, _r = De[5], vr = De[4], yr = `${w()} flex flex-col gap-4`, br = "添加媒体目录或关注来源后，这里会显示馆藏统计。", xr = "补全资料或添加标签后，这里会显示馆藏中的内容标签。", Sr = "开始播放后，这里会显示最近的真实观看证据。", Cr = "补充作品资料或手动添加标签后，这里会显示各个标签来源对应的视频数量。", wr = "添加媒体目录后，这里会显示存储空间。", Tr = "把媒体目录归进媒体库后，这里会按库显示视频数。", Er = "探测时长后，这里会显示时长分布。", Dr = "探测画质后，这里会显示画质分布。", Or = "开始播放后，这里会显示播放落在一周的哪些时段。", kr = "开始播放后，这里会显示每个作品播了几次。", Ar = (e, t) => Math.min(Math.max(e, 0), t);
function Z({ term: e, value: t }) {
	return /* @__PURE__ */ (0, Y.jsxs)("div", {
		className: "flex min-h-16 min-w-0 flex-col gap-1.5 rounded-2lg bg-background-primary-default p-3",
		children: [/* @__PURE__ */ (0, Y.jsx)("span", {
			className: "text-caption-1-regular text-text-secondary",
			children: e
		}), /* @__PURE__ */ (0, Y.jsx)("b", {
			className: "text-title-3-medium tabular-nums text-text-primary",
			children: D(t)
		})]
	});
}
function Q({ term: e, value: t, total: n }) {
	let r = Math.max(n, 1);
	return /* @__PURE__ */ (0, Y.jsxs)("div", {
		className: "flex flex-col gap-1.5 border-b border-separator-border py-3 last:border-b-0",
		children: [/* @__PURE__ */ (0, Y.jsxs)("p", {
			className: "flex items-baseline justify-between gap-3 text-body-2-regular text-text-primary",
			children: [/* @__PURE__ */ (0, Y.jsx)("span", { children: e }), /* @__PURE__ */ (0, Y.jsxs)("b", {
				className: "tabular-nums",
				children: [D(t), k(t) ? /* @__PURE__ */ (0, Y.jsx)("span", {
					className: "ml-1.5 text-caption-1-regular text-text-secondary",
					children: j(t, n)
				}) : null]
			})]
		}), /* @__PURE__ */ (0, Y.jsx)(u, {
			meter: !0,
			label: `${e}：${D(t)} / ${n.toLocaleString()}`,
			value: k(t) ? Ar(t, r) : 0,
			max: r
		})]
	});
}
function jr({ term: e, figure: t, unit: n }) {
	return /* @__PURE__ */ (0, Y.jsxs)("div", {
		className: "flex shrink-0 flex-col gap-0.5 pb-5 md:w-64 md:pr-6 md:pb-0",
		children: [
			/* @__PURE__ */ (0, Y.jsx)("span", {
				className: "text-caption-1-regular text-text-secondary",
				children: e
			}),
			/* @__PURE__ */ (0, Y.jsx)("b", {
				className: "text-display-4-medium tabular-nums text-text-primary",
				children: t
			}),
			/* @__PURE__ */ (0, Y.jsx)("span", {
				className: "text-body-2-regular text-text-secondary",
				children: n
			})
		]
	});
}
function Mr({ headline: e, children: t }) {
	return /* @__PURE__ */ (0, Y.jsxs)("div", {
		className: `${yr} md:flex-row md:gap-6`,
		children: [e, /* @__PURE__ */ (0, Y.jsx)("div", {
			className: "min-w-0 grow",
			children: t
		})]
	});
}
function Nr({ data: e }) {
	return e.by_loc.reduce((e, t) => e + t.videos, 0) ? /* @__PURE__ */ (0, Y.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [/* @__PURE__ */ (0, Y.jsxs)("div", {
			className: "inline-grid w-full gap-5 md:grid-cols-2",
			children: [/* @__PURE__ */ (0, Y.jsx)(mr, {
				title: "网盘与本地",
				empty: br,
				rows: e.by_loc.map((e) => ({
					name: o[e.k] ?? e.k,
					value: e.videos,
					bytes: e.bytes,
					mark: s[e.k] || "database"
				}))
			}), /* @__PURE__ */ (0, Y.jsx)(mr, {
				title: "媒体库",
				empty: Tr,
				rows: e.by_library.map((e) => ({
					name: e.name,
					value: e.videos,
					bytes: e.bytes,
					mark: s[e.icon] || e.icon || "database"
				}))
			})]
		}), /* @__PURE__ */ (0, Y.jsxs)("div", {
			className: "inline-grid w-full gap-5 md:grid-cols-2 xl:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, Y.jsx)(M, {
					title: "时长",
					unit: "个视频",
					series: "视频",
					color: _r,
					rows: te(e.by_length),
					empty: Er
				}),
				/* @__PURE__ */ (0, Y.jsx)(M, {
					title: "画质",
					unit: "个视频",
					series: "视频",
					color: _r,
					rows: C(e.by_quality),
					empty: Dr
				}),
				/* @__PURE__ */ (0, Y.jsx)(M, {
					title: "文件类型",
					unit: "个条目",
					series: "条目",
					color: _r,
					layout: "horizontal",
					rows: ne(e.by_medium),
					empty: br
				})
			]
		})]
	}) : /* @__PURE__ */ (0, Y.jsx)(a, {
		icon: c,
		title: "还没有视频",
		actions: /* @__PURE__ */ (0, Y.jsxs)(Y.Fragment, { children: [/* @__PURE__ */ (0, Y.jsx)(i, {
			variant: "secondary",
			href: "/subscriptions?tab=add",
			size: "small",
			children: "添加关注"
		}), /* @__PURE__ */ (0, Y.jsx)(i, {
			variant: "primary",
			href: hr,
			size: "small",
			children: "添加媒体"
		})] }),
		children: br
	});
}
function Pr({ data: e }) {
	return /* @__PURE__ */ (0, Y.jsxs)(Y.Fragment, { children: [/* @__PURE__ */ (0, Y.jsx)(ye, {
		activity: e.play_activity,
		title: "播放时间",
		dailyTitle: "每日播放",
		words: {
			unit: "个作品",
			series: "作品",
			cellUnit: "个作品"
		},
		tone: 5,
		empty: Or
	}), /* @__PURE__ */ (0, Y.jsx)(M, {
		title: "播放次数",
		unit: "个作品",
		series: "作品",
		color: vr,
		rows: ue(e.replays),
		empty: kr
	})] });
}
function Fr({ attribution: e }) {
	let t = e.videos;
	return /* @__PURE__ */ (0, Y.jsxs)("div", {
		className: "flex flex-col",
		children: [
			/* @__PURE__ */ (0, Y.jsx)(Q, {
				term: "有创作者",
				value: e.creator,
				total: t
			}),
			/* @__PURE__ */ (0, Y.jsx)(Q, {
				term: "有番号",
				value: e.code,
				total: t
			}),
			/* @__PURE__ */ (0, Y.jsx)(Q, {
				term: "有厂牌",
				value: e.studio,
				total: t
			}),
			/* @__PURE__ */ (0, Y.jsx)(Q, {
				term: "已抽帧",
				value: e.thumb,
				total: t
			}),
			/* @__PURE__ */ (0, Y.jsx)(Q, {
				term: "已探测时长",
				value: e.duration,
				total: t
			})
		]
	});
}
function Ir({ volume: e }) {
	let t = e.total, n = e.used ?? 0;
	return /* @__PURE__ */ (0, Y.jsxs)("article", {
		className: "flex min-w-0 flex-col gap-1.5 border-b border-separator-border py-3 last:border-b-0",
		children: [
			/* @__PURE__ */ (0, Y.jsxs)("header", {
				className: "flex items-baseline justify-between gap-3 text-body-2-regular text-text-primary",
				children: [/* @__PURE__ */ (0, Y.jsx)("h3", {
					className: "min-w-0 break-words",
					children: e.label
				}), t == null ? e.online ? /* @__PURE__ */ (0, Y.jsx)(v, { children: "容量未取得" }) : /* @__PURE__ */ (0, Y.jsx)(Wt, { online: !1 }) : /* @__PURE__ */ (0, Y.jsxs)("b", {
					className: "whitespace-nowrap tabular-nums",
					children: [O(n), /* @__PURE__ */ (0, Y.jsx)("span", {
						className: "ml-1.5 text-caption-1-regular text-text-secondary",
						children: j(n, t)
					})]
				})]
			}),
			t == null ? null : /* @__PURE__ */ (0, Y.jsx)(u, {
				meter: !0,
				label: `${e.label}空间使用率`,
				value: Ar(n, Math.max(t, 1)),
				max: Math.max(t, 1)
			}),
			/* @__PURE__ */ (0, Y.jsxs)("p", {
				className: "flex justify-between gap-3 text-caption-1-regular text-text-secondary",
				children: [/* @__PURE__ */ (0, Y.jsx)("span", {
					className: "min-w-0 break-words",
					children: e.root ?? "未映射"
				}), t == null ? null : /* @__PURE__ */ (0, Y.jsx)("span", {
					className: "whitespace-nowrap tabular-nums",
					children: `可用 ${O(e.free ?? 0)} · 共 ${O(t)}`
				})]
			})
		]
	});
}
function Lr({ volumes: e }) {
	return e.length ? /* @__PURE__ */ (0, Y.jsx)("div", {
		className: "flex flex-col",
		children: e.map((e) => /* @__PURE__ */ (0, Y.jsx)(Ir, { volume: e }, `${e.kind}:${e.label}`))
	}) : /* @__PURE__ */ (0, Y.jsx)(a, {
		icon: y,
		title: "还没有存储来源",
		actions: /* @__PURE__ */ (0, Y.jsx)(i, {
			variant: "primary",
			href: hr,
			size: "small",
			children: "添加媒体"
		}),
		children: wr
	});
}
function Rr({ tags: e, tagLabel: t, onTag: n, hasMedia: r }) {
	return e.length ? /* @__PURE__ */ (0, Y.jsx)(be, {
		previewCount: gr,
		className: "inline-grid w-full gap-x-6 gap-y-1 sm:grid-cols-2",
		children: e.map((e, r) => /* @__PURE__ */ (0, Y.jsx)("li", {
			className: "min-w-0",
			children: /* @__PURE__ */ (0, Y.jsxs)("button", {
				type: "button",
				onClick: () => n(e.k),
				className: "flex min-h-11 w-full min-w-0 cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
				children: [
					/* @__PURE__ */ (0, Y.jsx)("span", {
						className: "w-6 shrink-0 text-caption-1-regular tabular-nums text-text-secondary",
						children: r + 1
					}),
					/* @__PURE__ */ (0, Y.jsx)("span", {
						className: "min-w-0 grow text-body-2-regular break-words text-text-primary",
						children: t(e.k)
					}),
					/* @__PURE__ */ (0, Y.jsx)("b", {
						className: "text-body-2-medium tabular-nums text-text-secondary",
						children: e.n.toLocaleString()
					})
				]
			})
		}, `${e.k}:${r}`))
	}) : /* @__PURE__ */ (0, Y.jsx)(a, {
		icon: A,
		title: "还没有内容标签",
		actions: /* @__PURE__ */ (0, Y.jsx)(i, {
			variant: "secondary",
			href: r ? "/data-cleanup" : "/settings/library",
			size: "small",
			children: r ? "补全资料" : "添加媒体"
		}),
		children: xr
	});
}
function zr({ rows: e, hasMedia: t }) {
	return e.length ? /* @__PURE__ */ (0, Y.jsx)("div", {
		className: "flex flex-col gap-5",
		children: e.map((e) => {
			let t = ve(e);
			return /* @__PURE__ */ (0, Y.jsxs)("article", {
				className: "flex flex-wrap items-center gap-x-6 gap-y-2",
				children: [/* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "min-w-0 grow basis-64",
					children: [/* @__PURE__ */ (0, Y.jsx)("h3", {
						className: "min-w-0 text-body-2-medium text-text-primary",
						children: /* @__PURE__ */ (0, Y.jsx)("a", {
							href: ie(e),
							"data-middle-truncate": !0,
							className: "block max-w-full overflow-hidden whitespace-nowrap hover:underline",
							children: e.name
						})
					}), /* @__PURE__ */ (0, Y.jsxs)("p", {
						className: "flex flex-wrap gap-3 text-caption-1-regular text-text-secondary",
						children: [e.creator ? /* @__PURE__ */ (0, Y.jsx)("span", {
							className: "min-w-0 wrap-anywhere",
							children: e.creator
						}) : null, /* @__PURE__ */ (0, Y.jsx)("span", { children: _e(e) })]
					})]
				}), /* @__PURE__ */ (0, Y.jsxs)("div", {
					className: "min-w-0 basis-40",
					children: [/* @__PURE__ */ (0, Y.jsx)(u, {
						meter: !0,
						label: `真实观看 ${t.toFixed(0)}%`,
						value: t
					}), /* @__PURE__ */ (0, Y.jsx)("small", {
						className: "mt-1.5 block text-caption-1-regular text-text-secondary",
						children: `真实 ${t.toFixed(0)}% · 到达 ${le(e).toFixed(0)}%`
					})]
				})]
			}, `${e.kind}:${e.id}`);
		})
	}) : /* @__PURE__ */ (0, Y.jsx)(a, {
		icon: he,
		title: "还没有观看记录",
		actions: /* @__PURE__ */ (0, Y.jsx)(i, {
			variant: "secondary",
			href: t ? "/" : "/settings/library",
			size: "small",
			children: t ? "浏览馆藏" : "添加媒体"
		}),
		children: Sr
	});
}
function Br({ sources: e, videos: t }) {
	return e.length ? /* @__PURE__ */ (0, Y.jsx)("div", {
		className: "inline-grid w-full gap-x-8 gap-y-6 sm:grid-cols-2",
		children: e.map((e) => /* @__PURE__ */ (0, Y.jsxs)("article", {
			className: "flex min-w-0 flex-col gap-1.5",
			children: [
				/* @__PURE__ */ (0, Y.jsxs)("header", {
					className: "flex items-baseline justify-between gap-3",
					children: [/* @__PURE__ */ (0, Y.jsx)("h3", {
						className: "min-w-0 text-body-2-medium break-words text-text-primary",
						children: e.k
					}), /* @__PURE__ */ (0, Y.jsxs)("b", {
						className: "text-body-2-medium whitespace-nowrap text-text-primary",
						children: [e.assets.toLocaleString(), /* @__PURE__ */ (0, Y.jsx)("small", {
							className: "ml-1 text-caption-1-regular font-normal text-text-secondary",
							children: "个视频"
						})]
					})]
				}),
				/* @__PURE__ */ (0, Y.jsx)(u, {
					meter: !0,
					label: `${e.k} 覆盖视频`,
					value: Ar(e.assets, Math.max(t, 1)),
					max: Math.max(t, 1)
				}),
				/* @__PURE__ */ (0, Y.jsxs)("small", {
					className: "text-caption-1-regular text-text-secondary",
					children: [e.n.toLocaleString(), " 条标签"]
				})
			]
		}, e.k))
	}) : /* @__PURE__ */ (0, Y.jsx)(a, {
		icon: A,
		title: "还没有标签来源",
		actions: /* @__PURE__ */ (0, Y.jsx)(i, {
			variant: "secondary",
			href: t ? "/data-cleanup" : "/settings/library",
			size: "small",
			children: t ? "补全资料" : "添加媒体"
		}),
		children: Cr
	});
}
function $({ id: e, label: n, figure: r, detail: i, icon: a, accent: o }) {
	return /* @__PURE__ */ (0, Y.jsx)(t, {
		id: e,
		className: me({
			interactive: !0,
			selectable: !0
		}),
		children: /* @__PURE__ */ (0, Y.jsx)(_, {
			label: n,
			icon: a,
			accent: o,
			figure: r,
			footer: i
		})
	});
}
function Vr(i) {
	let a = ge({
		queryKey: p,
		queryFn: ({ signal: e }) => ee(e)
	}), o = a.data;
	if (!o) return /* @__PURE__ */ (0, Y.jsx)(Gt, { children: /* @__PURE__ */ (0, Y.jsx)(l, {
		tone: "error",
		title: "馆藏统计读取失败",
		children: a.error ? E(a.error) : "未取得统计数据，请刷新页面重试。"
	}) });
	let s = o.consumption, c = o.storage_summary, u = o.by_loc.reduce((e, t) => e + t.videos, 0), g = o.by_loc.reduce((e, t) => e + t.bytes, 0), _ = k(o.tag_cov) ? j(o.tag_cov, o.attribution.videos) : "未取得", v = `${D(o.tag_cov)} / ${o.attribution.videos.toLocaleString()}`;
	return /* @__PURE__ */ (0, Y.jsxs)(Gt, { children: [/* @__PURE__ */ (0, Y.jsxs)(n, {
		defaultSelectedKey: "inventory",
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, Y.jsxs)(r, {
				"aria-label": "统计视图",
				className: m,
				children: [
					/* @__PURE__ */ (0, Y.jsx)($, {
						id: "inventory",
						label: "馆藏视频",
						icon: x,
						accent: 0,
						figure: u.toLocaleString(),
						detail: O(g)
					}),
					/* @__PURE__ */ (0, Y.jsx)($, {
						id: "viewing",
						label: "看过",
						icon: b,
						accent: 1,
						figure: D(s.played),
						detail: re(s.play_seconds)
					}),
					/* @__PURE__ */ (0, Y.jsx)($, {
						id: "coverage",
						label: "内容标签",
						icon: A,
						accent: 2,
						figure: _,
						detail: v
					}),
					/* @__PURE__ */ (0, Y.jsx)($, {
						id: "storage",
						label: "使用空间",
						icon: y,
						accent: 3,
						figure: `${c.online.toLocaleString()} 个卷`,
						detail: c.measured ? `已用 ${O(c.used)}` : "容量未取得"
					})
				]
			}),
			/* @__PURE__ */ (0, Y.jsx)(e, {
				id: "inventory",
				children: /* @__PURE__ */ (0, Y.jsx)(Nr, {
					data: o,
					...i
				})
			}),
			/* @__PURE__ */ (0, Y.jsxs)(e, {
				id: "viewing",
				className: "flex flex-col gap-5",
				children: [/* @__PURE__ */ (0, Y.jsx)(Mr, {
					headline: /* @__PURE__ */ (0, Y.jsx)(jr, {
						term: "观看",
						figure: D(s.played),
						unit: "个作品有播放记录"
					}),
					children: /* @__PURE__ */ (0, Y.jsxs)("div", {
						className: "inline-grid w-full gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, Y.jsx)(Z, {
								term: "馆藏观看",
								value: s.library_played
							}),
							/* @__PURE__ */ (0, Y.jsx)(Z, {
								term: "在线直接观看",
								value: s.online_played
							}),
							/* @__PURE__ */ (0, Y.jsx)(Z, {
								term: "高潮计数",
								value: s.o_total
							}),
							/* @__PURE__ */ (0, Y.jsx)(Z, {
								term: "快进扫过",
								value: s.skimmed
							}),
							/* @__PURE__ */ (0, Y.jsx)(Z, {
								term: "喜欢",
								value: s.liked
							}),
							/* @__PURE__ */ (0, Y.jsx)(Z, {
								term: "明确不喜欢",
								value: s.dislike
							}),
							/* @__PURE__ */ (0, Y.jsx)(Z, {
								term: "看过了",
								value: s.seen
							}),
							/* @__PURE__ */ (0, Y.jsx)(Z, {
								term: "回收站",
								value: s.trash
							})
						]
					})
				}), /* @__PURE__ */ (0, Y.jsx)(Pr, { data: o })]
			}),
			/* @__PURE__ */ (0, Y.jsx)(e, {
				id: "coverage",
				children: /* @__PURE__ */ (0, Y.jsx)(Mr, {
					headline: /* @__PURE__ */ (0, Y.jsx)(jr, {
						term: "内容标签覆盖",
						figure: _,
						unit: v
					}),
					children: /* @__PURE__ */ (0, Y.jsx)(Fr, { attribution: o.attribution })
				})
			}),
			/* @__PURE__ */ (0, Y.jsx)(e, {
				id: "storage",
				children: /* @__PURE__ */ (0, Y.jsx)(Mr, {
					headline: /* @__PURE__ */ (0, Y.jsx)(jr, {
						term: "使用空间",
						figure: c.measured.toLocaleString(),
						unit: "个卷已取得容量"
					}),
					children: /* @__PURE__ */ (0, Y.jsx)(Lr, {
						volumes: o.storage_volumes,
						...i
					})
				})
			})
		]
	}), /* @__PURE__ */ (0, Y.jsxs)(n, {
		defaultSelectedKey: "tags",
		className: `${w({ padding: "none" })} flex flex-col`,
		children: [
			/* @__PURE__ */ (0, Y.jsx)("div", {
				className: "px-4 pt-3",
				children: /* @__PURE__ */ (0, Y.jsxs)(h, {
					"aria-label": "统计维度",
					className: f,
					children: [
						/* @__PURE__ */ (0, Y.jsx)(t, {
							id: "tags",
							className: d,
							children: "内容标签"
						}),
						/* @__PURE__ */ (0, Y.jsx)(t, {
							id: "recent",
							className: d,
							children: "最近看过"
						}),
						/* @__PURE__ */ (0, Y.jsx)(t, {
							id: "sources",
							className: d,
							children: "标签来源"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, Y.jsx)(e, {
				id: "tags",
				className: "px-4 pt-3.5 pb-4",
				children: /* @__PURE__ */ (0, Y.jsx)(Rr, {
					tags: o.top_tags,
					hasMedia: u > 0,
					...i
				})
			}),
			/* @__PURE__ */ (0, Y.jsx)(e, {
				id: "recent",
				className: "px-4 pt-3.5 pb-4",
				children: /* @__PURE__ */ (0, Y.jsx)(zr, {
					rows: o.recent,
					hasMedia: u > 0
				})
			}),
			/* @__PURE__ */ (0, Y.jsx)(e, {
				id: "sources",
				className: "px-4 pt-3.5 pb-4",
				children: /* @__PURE__ */ (0, Y.jsx)(Br, {
					sources: o.tag_source,
					videos: o.attribution.videos
				})
			})
		]
	})] });
}
export { Vr as StatsPage };

//# debugId=cae53a6a-7f63-4dbe-8104-5dc94f0fb524