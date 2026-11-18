(function() {
	try {
		var e = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, t = new e.Error().stack;
		t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "d3639b7a-240c-4e8f-916e-847f7a9a1e0a", e._sentryDebugIdIdentifier = "sentry-dbid-d3639b7a-240c-4e8f-916e-847f7a9a1e0a");
	} catch {}
})();
import { beginPlayerGuidePreview as e, closeDrawerAfterNav as t, disposeStage as n, peachHistory$1 as r } from "./peach-app.js";
// node_modules/driver.js/dist/driver.js.mjs
function i(e, t, n) {
	a(e);
	let r = {
		step: t,
		controller: new AbortController(),
		placeholder: n,
		latched: !1
	};
	return e.state.__activation = r, e.state.__lastAnnouncement = void 0, r;
}
function a(e) {
	let t = e.state.__activation;
	t && (e.state.__activation = void 0, t.waitController?.abort(), t.controller.abort());
}
function o(e, t) {
	return e.state.__activation === t;
}
function s(e, t, n) {
	e.state.__keepReturnFocus || (e.state.__activeOnDestroyed = document.activeElement), e.state.__keepReturnFocus = n, e.state.activeIndex = t;
}
function c(e, t) {
	e.state.__transitionCallback = t;
}
function l(e) {
	return !!e.state.__transitionCallback;
}
function u(e, t) {
	return e.state.__transitionCallback === t;
}
function d(e) {
	let t = !!e.state.__refreshMissed;
	return e.state.__transitionCallback = void 0, t && (e.state.__refreshMissed = !1), t;
}
function f(e) {
	e.state.__refreshMissed = !0;
}
function p(e, t) {
	let n = e.state.__activation;
	n && (n.waitController?.abort(), n.waitController = void 0, n.wait = t);
}
function m(e) {
	let t = e.state.__activation;
	return t?.wait ? (t.wait = void 0, t.waitController?.abort(), t.waitController = void 0, !0) : !1;
}
function h(e) {
	return !!e.state.__activation?.wait;
}
function g(e, t) {
	e.state.__pendingWaitCancel = t;
}
function _(e) {
	return !!e.state.__pendingWaitCancel;
}
function v(e) {
	let t = e.state.__pendingWaitCancel;
	t && (g(e), t());
}
function y(e) {
	let t = e.state.__activation;
	return t?.placeholder && {
		...t.placeholder,
		step: t.step
	};
}
function b(e) {
	return y(e)?.step ?? e.state.__activeStep;
}
function x(e) {
	let t = e.state.__activation;
	return t?.placeholder ? (t.placeholder = void 0, !0) : !1;
}
function S(e, t) {
	e.settling = t;
}
function C(e, t) {
	return !o(e, t) || t.latched ? !1 : (t.latched = !0, !0);
}
function w(e) {
	e.done = !0;
}
function T(e, t) {
	!o(e, t) || _(e) || (t.latched = !1, t.recheck?.());
}
function E(e, t) {
	return t.latched || _(e);
}
function D(e, t) {
	return !!t.settling || E(e, t);
}
function O(e, t) {
	let n = e.state.__activation;
	return n?.step === t && !!n.done;
}
function k(e, t, n) {
	return t?.[n] ?? e.config[n];
}
function A(e) {
	return !!k(e, e.state.activeStep, "allowPageInteraction");
}
function ee(e, t) {
	if (t.advanceOn !== void 0) return t.advanceOn || void 0;
	if (t.advanceOnClick !== void 0) return t.advanceOnClick ? "click" : void 0;
	let n = e.config.advanceOn;
	return n === void 0 ? e.config.advanceOnClick ? "click" : void 0 : n || void 0;
}
function j(e, t) {
	return t.advanceOn === void 0 ? t.advanceOnClick ?? (e.config.advanceOn === void 0 && !!e.config.advanceOnClick) : !1;
}
function M(e) {
	return e ? typeof e == "string" || Array.isArray(e) ? { types: [e].flat() } : {
		types: [e.event].flat(),
		when: e.when,
		strict: e.strict
	} : { types: [] };
}
var N = ["press0", "click"], te = {
	click: N,
	dblclick: [...N, "dblclick"],
	mousedown: N,
	mouseup: N,
	pointerdown: N,
	pointerup: N,
	contextmenu: [
		"press2",
		"contextmenu",
		"auxclick"
	],
	auxclick: [
		"press1",
		"press2",
		"auxclick"
	]
};
function P(e) {
	return e in te;
}
function ne(e, t = {}) {
	e.config = {
		animate: !0,
		duration: 400,
		allowClose: !0,
		allowScroll: !0,
		overlayClickBehavior: "close",
		overlayOpacity: .7,
		smoothScroll: !1,
		disableActiveInteraction: !1,
		advanceOnClick: !1,
		skipMissingElement: !1,
		waitForElement: 0,
		showProgress: !1,
		stagePadding: 10,
		stageRadius: 5,
		popoverOffset: 10,
		showButtons: [
			"next",
			"previous",
			"close"
		],
		disableButtons: [],
		overlayColor: "#000",
		...t
	};
}
function F(e, t, n) {
	let r = t || e.state;
	return {
		config: e.config,
		state: r,
		driver: e.driver,
		index: r.activeIndex,
		...n ? { reason: n } : {}
	};
}
function re(e, t, n) {
	let r = {
		tour: n,
		ui: t,
		config: {},
		state: {},
		consumed: /* @__PURE__ */ new WeakSet()
	};
	return ne(r, e), Object.assign(r.tour, t.controls?.(r)), r;
}
var ie = [
	"pointerdown",
	"mousedown",
	"pointerup",
	"mouseup",
	"click"
], ae = /* @__PURE__ */ new WeakMap();
function oe(e, t, n) {
	se(e);
	let r = (r) => {
		let i = r.target;
		e.contains(i) && ((!n || n(i)) && (r.preventDefault(), r.stopPropagation(), r.stopImmediatePropagation()), r.type === "click" && t?.(r));
	};
	for (let e of ie) document.addEventListener(e, r, !0);
	ae.set(e, r);
}
function se(e) {
	let t = ae.get(e);
	if (t) {
		for (let e of ie) document.removeEventListener(e, t, !0);
		ae.delete(e);
	}
}
function I(e) {
	return typeof e == "function" ? e() : typeof e == "string" ? document.querySelector(e) : e;
}
var ce = "driver-dummy-element";
function L(e) {
	return !e || e.id === "driver-dummy-element";
}
var R = "driver-allowed-element", le = "driver-active-element-raised", ue = "driver-page-interactive";
function de(e) {
	return !!e.closest(`.${R}`);
}
function fe(e) {
	let t = window.getComputedStyle(e);
	return [
		t.overflow,
		t.overflowX,
		t.overflowY
	].some((e) => e === "auto" || e === "scroll");
}
function z(e, t, n, r) {
	return (e /= r / 2) < 1 ? n / 2 * e * e + t : -n / 2 * (--e * (e - 2) - 1) + t;
}
var pe = "a[href], area[href], button:not([disabled]), input:not([disabled]):not([type=\"hidden\"]), select:not([disabled]), textarea:not([disabled]), summary, audio[controls], video[controls], [contenteditable]:not([contenteditable=\"false\"]), [tabindex]:not([tabindex=\"-1\"]):not([disabled])";
function me(e) {
	return e.flatMap((e) => {
		let t = e.matches(pe), n = Array.from(e.querySelectorAll(pe));
		return [...t ? [e] : [], ...n];
	});
}
function he(e) {
	return getComputedStyle(e).pointerEvents !== "none" && De(e);
}
function ge(e) {
	return me(e).filter(he);
}
function _e(e, t, n) {
	if (!e || ye(e)) return;
	let r = e.offsetHeight > window.innerHeight;
	e.scrollIntoView({
		behavior: !t || ve(e) ? "auto" : "smooth",
		inline: n?.inline ?? "center",
		block: n?.block ?? (r ? "start" : "center")
	});
}
function ve(e) {
	if (!e || !e.parentElement) return;
	let t = e.parentElement;
	return t.scrollHeight > t.clientHeight;
}
function ye(e) {
	let t = e.getBoundingClientRect();
	return t.top >= 0 && t.left >= 0 && t.bottom <= (window.innerHeight || document.documentElement.clientHeight) && t.right <= (window.innerWidth || document.documentElement.clientWidth) && !Ee(e, t);
}
function be(e) {
	let t = e.assignedSlot ?? e.parentElement;
	if (t) return t;
	let n = e.parentNode;
	return n instanceof ShadowRoot ? n.host : null;
}
function xe(e, t) {
	try {
		return e.matches(t);
	} catch {
		return !1;
	}
}
function Se(e) {
	return /paint|strict|content/.test(e.contain || "");
}
function Ce(e, t) {
	return t !== "absolute" && t !== "fixed" || (e.transform || "none") !== "none" || (e.perspective || "none") !== "none" || (e.filter || "none") !== "none" || /layout|paint|strict|content/.test(e.contain || "") || /transform|perspective|filter/.test(e.willChange || "") || t === "absolute" && e.position !== "static";
}
var we = (e) => !!e && e !== "visible", Te = (e, t, n) => Math.min(Math.max(e, t), n);
function B(e) {
	let { left: t, top: n, right: r, bottom: i } = e.getBoundingClientRect(), a = getComputedStyle(e).position;
	for (let o = be(e); o && o !== document.body && o !== document.documentElement; o = be(o)) {
		let e = getComputedStyle(o);
		if (!Ce(e, a)) continue;
		let s = Se(e), c = (e.overflow || "").split(" "), l = s || we(e.overflowX) || we(c[0]), u = s || we(e.overflowY) || we(c[1] ?? c[0]);
		if (l || u) {
			let e = o.getBoundingClientRect(), a = e.left + o.clientLeft, s = e.top + o.clientTop, c = a + (o.clientWidth || e.width), d = s + (o.clientHeight || e.height);
			l && (t = Te(t, a, c), r = Te(r, a, c)), u && (n = Te(n, s, d), i = Te(i, s, d));
		}
		if (xe(o, ":modal, :popover-open")) break;
		a = e.position;
	}
	return new DOMRect(t, n, r - t, i - n);
}
function Ee(e, t) {
	let n = B(e);
	return n.width < t.width || n.height < t.height;
}
function De(e) {
	return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
}
var Oe = /* @__PURE__ */ new WeakSet();
function ke(e) {
	let t = e.closest("dialog[open]");
	if (!t) return document.body;
	if (!("showPopover" in t)) return t;
	let n = t.querySelector(":scope > .driver-layer");
	return n || (n = document.createElement("div"), n.className = "driver-layer", n.setAttribute("popover", "manual"), t.appendChild(n)), Oe.has(t) || (Oe.add(t), t.addEventListener("close", () => {
		t.querySelector(":scope > .driver-layer:popover-open")?.hidePopover();
	})), n.matches(":popover-open") || n.showPopover(), n;
}
function Ae(e) {
	e?.classList.contains("driver-layer") && !e.childElementCount && e.remove();
}
function je(e) {
	let t = e.parentElement;
	e.remove(), Ae(t);
}
function Me(e, t, n = !1) {
	n && t !== document.body ? t.prepend(e) : t.appendChild(e);
}
function Ne(e, t, n = !1) {
	let r = ke(t), i = e.parentElement;
	return i !== r && (Me(e, r, n), Ae(i), !0);
}
function Pe(e) {
	return e instanceof HTMLElement ? e.isContentEditable || !!e.closest("input, textarea, select, [role=combobox], [role=grid], [role=listbox], [role=menu], [role=menubar], [role=radiogroup], [role=slider], [role=spinbutton], [role=tablist], [role=textbox], [role=tree], [role=treegrid]") : !1;
}
var Fe = 2 ** 31 - 1;
function Ie(e) {
	return e > Fe;
}
function Le(e, t, n, r, i, a, o) {
	let s;
	if (e === "start") s = t - a;
	else if (e === "end") s = t - r + n + a;
	else if (e === "center") s = t + n / 2 - r / 2;
	else return 0;
	return Math.max(Math.min(s, i - r - o), o);
}
function V(e, t, n) {
	let { align: r, side: i } = n, a = n.centered ? "over" : i, o = n.padding, { style: s, classList: c } = e.wrapper, { width: l, height: u } = e.wrapper.getBoundingClientRect(), d = l + n.offset, f = u + n.offset, p = e.arrow.getBoundingClientRect(), m = B(t), h = m.top - f, g = h >= 0, _ = window.innerHeight - (m.bottom + f), v = _ >= 0, y = m.left - d, b = y >= 0, x = window.innerWidth - (m.right + d), S = x >= 0, C = p.width, w = () => Le(r, m.top, m.height, u, window.innerHeight, o, C), T = () => Le(r, m.left, m.width, l, window.innerWidth, o, C), E = !g && !v && !b && !S, D = a;
	a === "top" && g ? S = b = v = !1 : a === "bottom" && v ? S = b = g = !1 : a === "left" && b ? S = g = v = !1 : a === "right" && S && (b = g = v = !1);
	let O = (e, t) => {
		s[e] = t === void 0 ? "auto" : `${t}px`;
	}, k = window.innerWidth / 2 - l / 2, A = window.innerWidth - l - C, ee = window.innerHeight - u - C;
	a === "over" ? (O("left", k), O("right"), O("top", window.innerHeight / 2 - u / 2), O("bottom")) : E ? (O("left", k), O("right"), O("bottom", 10), O("top")) : b ? (O("left", Math.min(y, A)), O("top", w()), O("bottom"), O("right"), D = "left") : S ? (O("right", Math.min(x, A)), O("top", w()), O("bottom"), O("left"), D = "right") : g ? (O("top", Math.min(h, ee)), O("left", T()), O("bottom"), O("right"), D = "top") : v && (O("left", T()), O("bottom", Math.min(_, ee)), O("top"), O("right"), D = "bottom"), Ve(e, E ? "over" : D, r, m);
	let j = `driver-popover-side-${D}`, M = `driver-popover-align-${r}`;
	[...c].filter((e) => e.startsWith("driver-popover-side-") || e.startsWith("driver-popover-align-")).filter((e) => e !== j && e !== M).forEach((e) => c.remove(e)), c.contains(j) || c.add(j), c.contains(M) || c.add(M), n.onPositioned?.();
}
function Re(e, t, n, r, i, a = 10) {
	let o = r - n;
	return e <= n && t >= r ? i === "start" ? 15 + a / 2 : i === "end" ? o - 15 - a / 2 : o / 2 : (Math.min(Math.max(e, n), r) + Math.min(Math.max(t, n), r)) / 2 - n;
}
function ze(e, t, n = 10) {
	let r = t - 15 - n;
	if (r < 15) return Math.max(0, (t - n) / 2);
	let i = e - n / 2;
	return Math.min(Math.max(i, 15), r);
}
function Be(e, t, n) {
	return e === "left" || e === "right" ? t.bottom > n.top && t.top < n.bottom ? e : t.bottom <= n.top ? "bottom" : "top" : t.right > n.left && t.left < n.right ? e : t.right <= n.left ? "right" : "left";
}
function Ve(e, t, n, r) {
	let i = e.arrow;
	if (i.className = "driver-popover-arrow", i.style.top = "", i.style.right = "", i.style.bottom = "", i.style.left = "", t === "over") {
		i.classList.add("driver-popover-arrow-none");
		return;
	}
	let a = e.wrapper.getBoundingClientRect(), o = i.getBoundingClientRect().width || 10, s = Be(t, r, a);
	if (i.classList.add(`driver-popover-arrow-side-${s}`), s === "left" || s === "right") {
		let e = Re(r.top, r.bottom, a.top, a.bottom, n, o);
		i.style.top = `${ze(e, a.height, o)}px`;
	} else {
		let e = Re(r.left, r.right, a.left, a.right, n, o);
		i.style.left = `${ze(e, a.width, o)}px`;
	}
}
function He(e) {
	e && (e.wrapper.style.display = "none");
}
var Ue = /* @__PURE__ */ new WeakMap(), We = /* @__PURE__ */ new WeakMap();
function H(e, t) {
	We.get(e) !== t && (e.innerHTML = t, We.set(e, t));
}
function U(e, t) {
	e.style.display = t ? "" : "none";
}
var Ge = /* @__PURE__ */ new WeakSet();
function Ke(e) {
	e?.setAttribute("tabindex", "-1"), e?.focus();
}
function W(e, t) {
	let n = e.closest(".driver-popover");
	t && document.activeElement === e && (Ke(n), Ge.add(e)), e.disabled = t, e.classList.toggle(qe, t), !t && Ge.delete(e) && n && document.activeElement === n && e.focus();
}
var G = "driver-popover-instruction-text", qe = "driver-popover-btn-disabled";
function Je(e, t, n) {
	let r = (e.getAttribute("aria-describedby") || "").split(/\s+/).filter((e) => e && e !== t);
	n && r.push(t), e.setAttribute("aria-describedby", r.join(" "));
}
function Ye(e, t) {
	let n = K("div", t), r = e.footer.parentNode === e.wrapper ? e.footer : null;
	return e.wrapper.insertBefore(n, r), n;
}
function Xe(e) {
	let t = Ye(e, "driver-popover-instruction"), n = K("span", "driver-popover-instruction-indicator");
	n.setAttribute("aria-hidden", "true"), t.append(K("span", G, G), n), e.instruction = t, e.instructionIndicator = n;
}
function Ze(e, t) {
	let n = !!t.isGated;
	(n || t.instruction) && !e.instruction && Xe(e);
	let { instruction: r, instructionIndicator: i, wrapper: a, nextButton: o } = e;
	if (!r || !i) return;
	let s = t.instruction || "";
	a.classList.toggle("driver-popover-has-instruction", n), a.classList.toggle("driver-popover-instruction-done", n && !!t.isDone), Je(a, G, !!s);
	let c = r.querySelector(`:scope > .${G}`);
	c && s && H(c, s), U(r, !!s), n ? (o.setAttribute("aria-disabled", "true"), o.classList.add(qe)) : o.removeAttribute("aria-disabled");
}
function Qe(e, t) {
	t.feedback && !e.feedback && (e.feedback = Ye(e, "driver-popover-feedback")), e.feedback && (H(e.feedback, t.feedback || ""), U(e.feedback, !!t.feedback));
}
function $e(e, t) {
	let { title: n, description: r, showButtons: i, disableButtons: a, showProgress: o, nextBtnText: s, prevBtnText: c, progressText: l } = t;
	H(e.nextButton, s), H(e.previousButton, c), H(e.progress, l), e.closeButton.setAttribute("aria-label", t.closeBtnLabel), e.nextButton.classList.toggle("driver-popover-done-btn", !!t.doneButton), n && H(e.title, n), U(e.title, !!n), r && H(e.description, r), U(e.description, !!r);
	let u = i.includes("next") || i.includes("previous") || o;
	U(e.closeButton, i.includes("close")), U(e.footer, u), U(e.progress, o), U(e.nextButton, i.includes("next")), U(e.previousButton, i.includes("previous")), W(e.nextButton, a.includes("next")), W(e.previousButton, a.includes("previous")), W(e.closeButton, a.includes("close")), Ze(e, t), Qe(e, t);
	let d = e.wrapper;
	d.classList.remove(...Ue.get(d) || []);
	let f = (t.popoverClass || "").split(/\s+/).filter(Boolean);
	d.classList.add(...f), Ue.set(d, f);
}
function et(e, t) {
	if (e.disabled) return !0;
	for (let n = e; n && n !== t; n = n.parentElement) if (n.style?.display === "none") return !0;
	return !1;
}
function tt(e, t, n) {
	let r = document.activeElement, i = !!r && e.wrapper.contains(r) && r !== e.wrapper;
	$e(e, n), i && (!r.isConnected || et(r, e.wrapper)) && (e.wrapper.setAttribute("tabindex", "-1"), e.wrapper.focus()), V(e, t, n.position), ot(e, t, n.position);
}
function nt(e, t) {
	let n = st();
	ke(e).appendChild(n.wrapper);
	let r = n.wrapper;
	return r.className = "driver-popover", $e(n, t), r.style.display = "block", r.style.left = "", r.style.top = "", r.style.bottom = "", r.style.right = "", r.id = "driver-popover-content", r.setAttribute("role", "dialog"), r.setAttribute("aria-labelledby", "driver-popover-title"), n.arrow.className = "driver-popover-arrow", oe(n.wrapper, (e) => {
		let n = e.target instanceof Element ? e.target : e.target?.parentElement;
		if (n) {
			if (n.closest(".driver-popover-next-btn")) return t.onNextClick?.();
			if (n.closest(".driver-popover-prev-btn")) return t.onPrevClick?.();
			if (n.closest(".driver-popover-close-btn")) return t.onCloseClick?.();
		}
	}, (e) => n.description.contains(e) || n.title.contains(e) ? !1 : !!e.closest(".driver-popover-prev-btn, .driver-popover-next-btn, .driver-popover-close-btn")), t.onRender?.(n), V(n, e, t.position), ot(n, e, t.position), t.scrollIntoView !== !1 && _e(r, t.smoothScroll, {
		block: "nearest",
		inline: "nearest"
	}), t.keepFocus || rt(n), n;
}
function rt(e) {
	let { nextButton: t, wrapper: n } = e;
	t.isConnected && t.style.display !== "none" && !t.disabled && !t.hasAttribute("aria-disabled") && t.focus(), document.activeElement !== t && Ke(n);
}
var it = /* @__PURE__ */ new WeakMap(), at = /* @__PURE__ */ new WeakSet();
function ot(e, t, n) {
	it.set(e, {
		anchor: t,
		position: n
	}), e.wrapper.querySelectorAll("img").forEach((t) => {
		if (t.complete || at.has(t)) return;
		at.add(t);
		let n = () => {
			at.delete(t);
			let n = it.get(e);
			n && e.wrapper.isConnected && V(e, n.anchor, n.position);
		};
		t.addEventListener("load", n, { once: !0 }), t.addEventListener("error", n, { once: !0 });
	});
}
function K(e, t, n) {
	let r = document.createElement(e);
	return n && (r.id = n), r instanceof HTMLButtonElement && (r.type = "button"), r.className = t, r;
}
function st() {
	let e = K("div", "driver-popover");
	e.setAttribute("aria-describedby", "driver-popover-description");
	let t = K("div", "driver-popover-arrow"), n = K("div", "driver-popover-title", "driver-popover-title");
	n.style.display = "none", n.innerText = "Popover Title";
	let r = K("div", "driver-popover-description", "driver-popover-description");
	r.style.display = "none", r.innerText = "Popover description is here";
	let i = K("button", "driver-popover-close-btn");
	i.innerHTML = "&times;";
	let a = K("div", "driver-popover-footer"), o = K("span", "driver-popover-progress-text"), s = K("span", "driver-popover-navigation-btns"), c = K("button", "driver-popover-prev-btn driver-popover-footer-btn");
	c.innerHTML = "Previous";
	let l = K("button", "driver-popover-next-btn driver-popover-footer-btn");
	return l.innerHTML = "Next", s.append(c, l), a.append(o, s), e.append(i, t, n, r, a), {
		wrapper: e,
		arrow: t,
		title: n,
		description: r,
		footer: a,
		previousButton: c,
		nextButton: l,
		closeButton: i,
		footerButtons: s,
		progress: o
	};
}
function ct(e) {
	e && (se(e.wrapper), je(e.wrapper));
}
var lt = "http://www.w3.org/2000/svg";
function ut() {
	return `0 0 ${window.innerWidth} ${window.innerHeight}`;
}
function dt(e, t, n, r) {
	let i = document.createElementNS(lt, "svg");
	i.setAttribute("class", e), i.setAttribute("viewBox", ut()), i.setAttribute("preserveAspectRatio", "xMinYMin slice"), i.style.fillRule = "evenodd";
	let a = document.createElementNS(lt, "path");
	return a.setAttribute("d", t), a.style.fill = n, a.style.opacity = `${r}`, a.style.pointerEvents = "auto", i.appendChild(a), i;
}
function ft(e, t) {
	let n = e.width + t.padding * 2, r = e.height + t.padding * 2, i = Math.min(t.radius, n / 2, r / 2);
	return {
		x: e.x - t.padding,
		y: e.y - t.padding,
		width: n,
		height: r,
		radius: Math.floor(Math.max(i, 0))
	};
}
function pt(e, t) {
	let n = window.innerWidth, r = window.innerHeight, i = ft(e, t), a = i.radius, o = i.x + a, s = i.y, c = i.width - a * 2, l = i.height - a * 2;
	return `M${n},0L0,0L0,${r}L${n},${r}L${n},0Z
    M${o},${s} h${c} a${a},${a} 0 0 1 ${a},${a} v${l} a${a},${a} 0 0 1 -${a},${a} h-${c} a${a},${a} 0 0 1 -${a},-${a} v-${l} a${a},${a} 0 0 1 ${a},-${a} z`;
}
function mt(e, t, n) {
	return t > e.x && t < e.x + e.width && n > e.y && n < e.y + e.height;
}
function ht(e, t) {
	let n = (e, n) => t.some((t) => mt(t, e, n)), r = (n, r) => [...new Set([e, ...t].flatMap((e) => [e[n], e[n] + e[r]]))].sort((e, t) => e - t), i = r("x", "width"), a = r("y", "height"), o = "";
	i.forEach((t, r) => {
		a.forEach((s, c) => {
			let l = i[r + 1] - t, u = a[c + 1] - s, d = t + l / 2, f = s + u / 2;
			n(d, f) && !mt(e, d, f) && (o += `M${t},${s}h${l}v${u}h-${l}z`);
		});
	});
	let s = e.radius;
	for (let t of [0, 1]) for (let r of [0, 1]) {
		let i = e.x + t * e.width, a = e.y + r * e.height, c = t ? -s : s, l = r ? -s : s;
		s && n(i + c / 2, a + l / 2) && (o += `M${i},${a}h${c}a${s},${s} 0 0 ${t ^ r} ${-c},${l}z`);
	}
	return o;
}
function gt(e, t, n, r, i) {
	let a = e.state.__activeStagePosition, o = a || B(r), s = B(i);
	a = {
		x: z(t, o.x, s.x - o.x, n),
		y: z(t, o.y, s.y - o.y, n),
		width: z(t, o.width, s.width - o.width, n),
		height: z(t, o.height, s.height - o.height, n)
	}, Ct(e, a, i), e.state.__activeStagePosition = a;
}
function _t(e, t) {
	if (!t) return;
	let n = B(t), r = {
		x: n.x,
		y: n.y,
		width: n.width,
		height: n.height
	};
	e.state.__activeStagePosition = r, Ct(e, r, t);
}
function vt(e) {
	let t = e.state.__activeStagePosition, n = e.state.__overlaySvg;
	!t || !n || n.setAttribute("viewBox", ut());
}
function yt(e, t, n) {
	let r = Et(e, t);
	return Me(r, ke(n), !0), oe(r, (t) => {
		t.target.tagName === "path" && e.tour.overlayClick();
	}), e.state.__overlaySvg = r, r;
}
function bt(e) {
	e.style.animation = "none";
}
function xt(e, t) {
	Ne(e, t, !0) && bt(e);
}
function St(e, t) {
	let n = e.closest("dialog");
	return n ? ht(t, Array.from(n.querySelectorAll(".driver-allowed-element")).map((e) => e.getBoundingClientRect())) : "";
}
function Ct(e, t, n) {
	let r = e.state.__overlaySvg ?? yt(e, t, n);
	xt(r, n);
	let i = r.firstElementChild;
	if (i?.tagName !== "path") return;
	let a = Tt(e), o = pt(t, a) + St(r, ft(t, a));
	i.getAttribute("d") !== o && i.setAttribute("d", o);
}
function wt(e, t = !1) {
	let n = e.state.__activeStagePosition, r = e.state.activeElement, i = e.state.__overlaySvg;
	n && r && i && (t || i.closest("dialog")) && Ct(e, n, r);
}
function Tt(e) {
	let t = e.state.activeElement;
	return t && (L(t) || de(t)) ? {
		padding: 0,
		radius: 0
	} : {
		padding: e.config.stagePadding || 0,
		radius: e.config.stageRadius || 0
	};
}
function Et(e, t) {
	let n = dt("driver-overlay driver-overlay-animated", pt(t, Tt(e)), e.config.overlayColor || "rgb(0,0,0)", `${e.config.overlayOpacity}`);
	return n.setAttribute("version", "1.1"), n.style.cssText += "clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;z-index:10000;position:fixed;top:0;left:0;width:100%;height:100%", n.firstElementChild.style.cursor = "auto", n;
}
function Dt(e) {
	let t = e.state.__overlaySvg;
	t && (se(t), je(t));
}
function Ot(e, t) {
	return k(e, t, "allowedElements");
}
function kt(e) {
	return e ? typeof e == "function" ? Array.from(e() || []) : (Array.isArray(e) ? e : [e]).flatMap((e) => typeof e == "string" ? Array.from(document.querySelectorAll(e)) : e ? [e] : []) : [];
}
function At(e, t, n) {
	let r = Ot(e, t);
	if (!r) return;
	let i = /* @__PURE__ */ new Set(), a, o = () => {
		if (n.aborted) return;
		let t = new Set(kt(r));
		i.forEach((e) => {
			!t.has(e) && e.classList.contains("driver-allowed-element") && e.classList.remove(R);
		}), t.forEach((e) => {
			e.classList.contains("driver-allowed-element") || e.classList.add(R);
		}), i = t;
		let a = e.state.activeElement, o = !!a && !L(a) && de(a);
		a && o !== a.classList.contains("driver-active-element-raised") && (a.classList.toggle(le, o), wt(e, !0));
	}, s = () => {
		a === void 0 && (a = window.requestAnimationFrame(() => {
			a = void 0, o(), wt(e);
		}));
	}, c = new MutationObserver((e) => {
		let t = !1;
		e.forEach((e) => {
			let n = e.target;
			n.closest?.(".driver-layer, .driver-overlay, .driver-popover") || (t = !0, e.attributeName === "class" && i.has(n) && !n.classList.contains("driver-allowed-element") && n.classList.add(R));
		}), t && s();
	}), l = typeof r == "function" || [r].flat().some((e) => typeof e == "string");
	o(), c.observe(document.body, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		...l ? {} : { attributeFilter: ["class"] }
	}), e.state.__syncAllowedElements = o, n.addEventListener("abort", () => {
		c.disconnect(), a !== void 0 && window.cancelAnimationFrame(a), i.forEach((e) => e.classList.remove(R)), e.state.__syncAllowedElements === o && (e.state.__syncAllowedElements = void 0);
	});
}
function jt(e, t, n) {
	let r = document.activeElement;
	if (!r || r === document.body) return !1;
	let i = k(e, n, "disableActiveInteraction") !== !0;
	return !L(t) && i && t.contains(r) ? !0 : kt(Ot(e, n)).some((e) => e.contains(r));
}
function Mt(e) {
	if (e.state.__liveRegion) return;
	let t = document.createElement("div");
	t.className = "driver-live-region", t.setAttribute("aria-live", "polite"), t.setAttribute("aria-atomic", "true"), t.style.cssText = "position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;border:0", document.body.appendChild(t), e.state.__liveRegion = t;
}
function Nt(e, t) {
	let n = e.state.__liveRegion, r = t.trim();
	!n || !r || e.state.__lastAnnouncement === r || (e.state.__lastAnnouncement = r, n.textContent = r);
}
function Pt(e) {
	e.state.__liveRegion?.remove();
}
function Ft(e, t) {
	return !k(e, t, "skipMissingElement") || !t.element ? !1 : !I(t.element);
}
function q(e, t, n) {
	let r = e.config.steps || [];
	for (let i = t; i >= 0 && i < r.length; i += n) if (!Ft(e, r[i])) return i;
}
function J(e, t) {
	let n = e.state.activeIndex;
	return n !== void 0 && q(e, n + t, t) === void 0;
}
function It(e, t) {
	let n = J(e, 1), r = t?.popover?.onDoneClick || e.config.onDoneClick;
	return n && r ? r : t?.popover?.onNextClick || e.config.onNextClick;
}
function Lt(e, t) {
	return t?.popover?.onPrevClick || e.config.onPrevClick;
}
function Rt(e, t) {
	return t?.popover?.onCloseClick || e.config.onCloseClick;
}
function zt(e, t, n) {
	let r = (e.config.steps || []).length;
	return t.replace("{{current}}", `${n + 1}`).replace("{{total}}", `${r}`);
}
var Bt = [
	"next",
	"previous",
	"close"
];
function Vt(e, t) {
	return {
		index: t,
		hasNext: q(e, t + 1, 1) !== void 0,
		hasPrevious: q(e, t - 1, -1) !== void 0
	};
}
function Ht(e, t = {}, n) {
	let r = e.config, i = t.showButtons || r.showButtons, a = r.progressText || "{{current}} of {{total}}", o = {
		showProgress: t.showProgress ?? r.showProgress ?? !1,
		prevBtnText: t.prevBtnText ?? (r.prevBtnText || "Previous"),
		closeBtnLabel: t.closeBtnLabel ?? (r.closeBtnLabel || "Close"),
		popoverClass: t.popoverClass || r.popoverClass || ""
	};
	return n ? {
		...o,
		showButtons: Bt.filter((e) => (e !== "close" || r.allowClose) && (!i || i.includes(e))),
		disableButtons: [...r.disableButtons || [], ...n.hasPrevious ? [] : ["previous"]],
		progressText: zt(e, t.progressText || a, n.index),
		nextBtnText: n.hasNext ? t.nextBtnText ?? (r.nextBtnText || "Next") : t.doneBtnText || r.doneBtnText || "Done"
	} : {
		...o,
		showButtons: i || [],
		disableButtons: t.disableButtons || r.disableButtons || [],
		progressText: t.progressText ?? a,
		nextBtnText: t.nextBtnText ?? (r.nextBtnText || "Next")
	};
}
function Y(e, t) {
	let n = (e.config.steps || [])[t], r = n.popover || {}, i = Vt(e, t), a = Ht(e, r, i);
	return {
		...n,
		popover: {
			showButtons: a.showButtons,
			nextBtnText: i.hasNext ? void 0 : a.nextBtnText,
			disableButtons: a.disableButtons,
			showProgress: a.showProgress,
			onNextClick: r.onNextClick || e.config.onNextClick || e.tour.moveNext,
			onPrevClick: Lt(e, n) || e.tour.movePrevious,
			onCloseClick: Rt(e, n) || e.tour.close,
			...r,
			progressText: a.progressText
		}
	};
}
function X(e) {
	return !!e?.popover?.instruction && !Wt(e);
}
var Ut = /* @__PURE__ */ new WeakSet();
function Wt(e) {
	return !!e && Ut.has(e);
}
function Gt(e) {
	return Ut.add(e), e;
}
function Kt(e, t, n) {
	let r = e.config.stagePadding || 0;
	return {
		side: n.popover?.side || "bottom",
		align: n.popover?.align || "start",
		offset: r + (e.config.popoverOffset || 0),
		padding: r,
		centered: L(t),
		onPositioned: () => {
			let t = n.popover?.onPopoverPositioned || e.config.onPopoverPositioned;
			t && e.state.popover && t(e.state.popover, F(e));
		}
	};
}
function qt(e, t) {
	let n = e.state.__activation;
	return n?.popoverPatch && n.step === t ? n.popoverPatch : void 0;
}
function Jt(e, t) {
	let n = qt(e, t), r = {
		...t.popover,
		...n
	}, i = Ht(e, r);
	return n?.popoverClass !== void 0 && (i.popoverClass = n.popoverClass), n?.progressText !== void 0 && (i.progressText = zt(e, n.progressText, e.state.activeIndex ?? 0)), {
		popover: r,
		options: i
	};
}
function Yt(e, t) {
	let { showButtons: n, disableButtons: r } = t ? Jt(e, t).options : Ht(e);
	return {
		showButtons: n,
		disableButtons: r
	};
}
function Xt(e, t, n) {
	let { popover: r, options: i } = Jt(e, n), a = e.state.__activation, o = X(n);
	return {
		...i,
		title: r.title,
		description: r.description,
		isGated: o,
		isDone: o && O(e, n),
		instruction: o || Wt(n) ? r.instruction : void 0,
		feedback: a?.step === n ? a.feedback : void 0,
		doneButton: J(e, 1),
		smoothScroll: e.config.smoothScroll,
		scrollIntoView: k(e, n, "scrollIntoView"),
		onNextClick: e.tour.pressNext,
		onPrevClick: e.tour.previous,
		onCloseClick: () => {
			e.state.__destroyReason = "close";
			let r = Rt(e, n);
			return r ? r(e.state.activeElement ?? t, n, F(e)) : e.tour.requestClose();
		},
		onRender: (t) => {
			e.state.popover = t, (r.onPopoverRender || e.config.onPopoverRender)?.(t, F(e));
		},
		position: Kt(e, t, n)
	};
}
function Zt(e, t, n) {
	let r = !L(t) && k(e, n, "disableActiveInteraction") !== !0;
	if (k(e, n, "focus") === "element" && r) return ge([t])[0];
}
function Qt(e, t, n) {
	jt(e, t, n) || Zt(e, t, n)?.focus({ preventScroll: !0 });
}
function $t(e, t, n) {
	ct(e.state.popover);
	let r = jt(e, t, n) || k(e, n, "focus") === "none" || !!Zt(e, t, n), i = nt(t, {
		...Xt(e, t, n),
		keepFocus: r
	});
	tn(e), r && Nt(e, en(i).filter(Boolean).join(". "));
}
function en(e) {
	return [
		e.title,
		e.description,
		e.instruction
	].map((e) => !e || e.style.display === "none" ? "" : e.textContent || "");
}
function tn(e) {
	h(e) && an(e);
}
function nn(e, t, n) {
	let r = e.state.popover;
	r && (tt(r, t, Xt(e, t, n)), tn(e));
}
function rn(e, t, n) {
	let r = e.state.popover;
	r && V(r, t, Kt(e, t, n));
}
function an(e) {
	let t = e.state.popover;
	!t || t.wrapper.style.display === "none" || (t.wrapper.classList.add("driver-popover-waiting"), t.wrapper.setAttribute("aria-busy", "true"), W(t.nextButton, !0), W(t.previousButton, !0));
}
function on(e, t, n) {
	let r = e.state.popover;
	!r || r.wrapper.style.display === "none" || (r.wrapper.classList.remove("driver-popover-waiting"), r.wrapper.removeAttribute("aria-busy"), t && n && nn(e, t, n));
}
function sn(e, t) {
	if (!C(e, t)) return;
	let n = k(e, t.step, "advanceDelay") ?? 0;
	if (n <= 0) {
		e.tour.next(), T(e, t);
		return;
	}
	w(t), e.tour.refreshPopover(), X(t.step) && e.ui.announce(e, t.step.popover?.doneBtnText || e.config.doneBtnText || "Done");
	let r = window.setTimeout(() => {
		o(e, t) && (e.tour.next(), T(e, t));
	}, n);
	t.controller.signal.addEventListener("abort", () => window.clearTimeout(r));
}
function cn(e) {
	let t = y(e);
	return {
		element: t?.element ?? e.state.activeElement,
		step: t?.step ?? e.state.activeStep
	};
}
function ln(e, t) {
	p(e, t), e.ui.showWaiting(e);
}
function un(e, t, n, r) {
	let i = e.state.__activation, a = k(e, t, "onWaitingForElement");
	if (!a || !i?.wait) return;
	i.waitController?.abort();
	let o = new AbortController();
	i.waitController = o, a(r, t, {
		...F(e),
		index: n,
		signal: o.signal
	});
}
function dn(e) {
	let t = cn(e);
	m(e) && e.ui.hideWaiting(e, t.element, t.step);
}
function fn(e, t, n, r) {
	let i = e.state.__activation, a, o = () => {
		l.disconnect(), window.clearTimeout(u), a !== void 0 && window.cancelAnimationFrame(a);
	}, s = (t) => {
		o(), g(e), r(t), i && T(e, i);
	}, c = () => {
		a = void 0, I(t.element) && s(!0);
	}, l = new MutationObserver(() => {
		a ??= window.requestAnimationFrame(c);
	}), u = Ie(n) ? void 0 : window.setTimeout(() => s(!1), n);
	g(e, o), l.observe(document.documentElement, {
		childList: !0,
		subtree: !0,
		attributes: !0
	});
}
function pn(e, t) {
	let n = Y(e, t), r = mn(e, n), i = !!e.state.activeStep;
	if (r === "stay" || typeof r == "string" && !i) {
		e.tour.drive(t, !0);
		return;
	}
	let a = e.state.__activation;
	if (dn(e), typeof r == "string") return;
	let s = r(void 0, n, {
		...F(e),
		index: t,
		cause: "timeout"
	}), c = !e.state.isInitialized || !o(e, a) || _(e);
	s === !1 || c || e.tour.drive(t, !0);
}
function mn(e, t) {
	return k(e, t, "onElementMissing") ?? "stay";
}
function hn(e, t) {
	let n = e.state.activeIndex;
	if (!n) return;
	let r = e.config.steps || [];
	for (let i = n - 1; t === "previousAction" && i >= 0; i--) {
		let t = r[i];
		if (X(t) && t.element && I(t.element)?.isConnected) {
			e.tour.drive(i);
			return;
		}
	}
	e.tour.drive(n - 1);
}
function gn(e, t) {
	let { step: n } = t, { signal: r } = t.controller;
	if (!n.element) return;
	let i, a, o = !1, s = (n) => {
		window.clearTimeout(a), a = void 0, o = !1, e.ui.rebind(e, n), E(e, t) || dn(e);
	}, c = () => {
		let t = I(n.element);
		if (!t || !t.isConnected) return !1;
		let i = e.state.activeElement;
		s(t);
		let a = k(e, n, "onElementReplaced");
		return a && t !== i && a(t, n, {
			...F(e),
			signal: r
		}), !0;
	}, l = (t) => {
		o = !0, dn(e);
		let r = mn(e, n);
		typeof r == "function" ? r(t, n, {
			...F(e),
			cause: "removed"
		}) : r !== "stay" && hn(e, r);
	}, u = () => {
		i = void 0;
		let u = e.state.activeElement;
		if (r.aborted || !u || L(u)) return;
		if (u.isConnected) {
			(o || a !== void 0) && s(u);
			return;
		}
		if (D(e, t) || c() || o || a || mn(e, n) === "stay") return;
		let d = k(e, n, "waitForRemovedElement") ?? k(e, n, "waitForElement") ?? 0;
		d <= 0 ? l(u) : (ln(e, "missing"), a = Ie(d) ? -1 : window.setTimeout(() => {
			a = void 0, !(r.aborted || D(e, t) || c()) && l(u);
		}, d), un(e, n, e.state.activeIndex, u));
	}, d = () => {
		i === void 0 && (i = window.requestAnimationFrame(u));
	}, f = new MutationObserver(d);
	f.observe(document.documentElement, {
		childList: !0,
		subtree: !0
	}), t.recheck = d, r.addEventListener("abort", () => {
		f.disconnect(), window.clearTimeout(a), i !== void 0 && window.cancelAnimationFrame(i);
	});
}
function _n(e, t) {
	if (!t) return !1;
	let n = e.composedPath();
	return n.length > 0 ? n.includes(t) : e.target instanceof Node && t.contains(e.target);
}
function vn(e, t, n, r) {
	let { signal: i } = n.controller, { types: a, when: o } = M(t), s = () => j(e, n.step) && l(e), c = (t) => {
		let n = e.state.__advanceClick, r = t;
		return !n || r.detail < 2 || r.timeStamp - n.timeStamp > 500 ? !1 : Math.abs(r.clientX - n.clientX) < 8 && Math.abs(r.clientY - n.clientY) < 8;
	}, u = (e) => s() || c(e), d = (t) => {
		if (!o) return !0;
		let r = e.state.activeElement;
		return !!r && o(r, n.step, {
			...F(e),
			event: t
		});
	}, f, p, m = (t) => {
		f === t && (window.clearTimeout(p), f = void 0, p = void 0, S(n, !1), !i.aborted && (!e.consumed.has(t) && d(t) && (P(t.type) && (e.state.__advanceClick = t), r()), n.recheck?.()));
	}, h = (t) => {
		_n(t, e.state.activeElement) && (P(t.type) && u(t) || (f = t, S(n, !0), window.clearTimeout(p), p = window.setTimeout(() => m(t), 0)));
	};
	for (let e of a) window.addEventListener(e, h, {
		capture: !0,
		signal: i
	}), window.addEventListener(e, m, { signal: i });
	i.addEventListener("abort", () => window.clearTimeout(p));
}
var Z;
function yn(e, t) {
	let n = re(e, t, {
		drive: w,
		next: c,
		moveNext: l,
		movePrevious: u,
		close: () => D("close"),
		destroy: D,
		refreshPopover: S
	}), r = () => D("replaced", !1);
	function c() {
		let { element: e, step: t } = cn(n), r = It(n, t);
		!t || !r ? Wt(t) || l() : (J(n, 1) && (n.state.__destroyReason = "done"), r(e, t, F(n)));
	}
	function l() {
		let e = n.state.activeIndex, t = n.config.steps || [];
		if (e === void 0) return;
		let r = e + 1;
		t[r] ? w(r) : D("done");
	}
	function u() {
		let e = n.state.activeIndex, t = n.config.steps || [];
		if (e === void 0) return;
		let r = e - 1;
		t[r] ? w(r) : D("api");
	}
	function d(e) {
		(n.config.steps || [])[e] ? (C(), w(e)) : D("api");
	}
	function f() {
		let e = n.state.__activation;
		!e || h(n) || sn(n, e);
	}
	let p = /* @__PURE__ */ new WeakSet();
	function m(e, r) {
		let { types: i } = M(r);
		if (!(t.blocksInteraction && k(n, e, "disableActiveInteraction")) || !i.length || !i.every(P)) return;
		let a = n.state.activeIndex, o = a !== void 0 && n.config.steps?.[a] || e;
		if (p.has(o)) return;
		p.add(o);
		let s = a === void 0 ? "The highlight" : `Step ${a + 1}`;
		console.warn(`[driver.js] ${s} can't complete: disableActiveInteraction blocks its advanceOn events.`);
	}
	function g(e) {
		if (!o(n, e)) return;
		let { step: r } = e;
		t.trackAllowed(n, r, e.controller.signal), gn(n, e);
		let i = ee(n, r);
		m(r, i), i && vn(n, i, e, () => sn(n, e));
	}
	function _(e) {
		let t = n.state.__activation;
		t && (t.popoverPatch = e ? {
			...t.popoverPatch,
			...e
		} : void 0, S());
	}
	function x(e) {
		let r = n.state.__activation;
		!r || (r.feedback || "") === e || (r.feedback = e, S(), t.announce(n, n.state.popover?.feedback?.textContent || ""));
	}
	function S() {
		t.refreshPopover(n);
	}
	function C() {
		n.state.isInitialized || (Z && Z !== r && Z(), Z = r, n.state.isInitialized = !0, t.mount(n));
	}
	function w(e = 0, r = !1) {
		v(n), n.state.__destroyReason = void 0;
		let i = n.config.steps;
		if (!i) {
			console.error("No steps to drive through"), D("api");
			return;
		}
		if (!i[e]) {
			D("api");
			return;
		}
		let a = i[e], o = k(n, a, "waitForElement") ?? 0;
		if (!r && o > 0 && a.element && !I(a.element)) y(n)?.index === e ? ln(n, "initial") : n.state.activeStep ? ln(n, "next") : (t.endInitialWait(n), t.showInitialWait(n, e)), fn(n, a, o, (t) => {
			t ? w(e, !0) : pn(n, e);
		}), un(n, Y(n, e), e);
		else if (t.endInitialWait(n), Ft(n, a)) {
			let t = n.state.activeIndex, r = typeof t == "number" && e < t ? -1 : 1;
			i[e + r] ? w(e + r) : r === 1 && D("done");
		} else s(n, e, !1), T(Y(n, e));
	}
	function T(e) {
		let r = i(n, e);
		t.highlight(n, e), g(r);
	}
	function E() {
		Z === r && (Z = void 0), t.detach(n), v(n), a(n), t.unmount(n);
		let e = n.state;
		return n.state = {}, e;
	}
	function D(e, r = !0) {
		if (!n.state.isInitialized) return;
		e === "api" && (e = n.state.__destroyReason ?? "api");
		let i = !!n.state.__activeElement || !!n.state.__activeStep, a = i ? n.state.__activeElement : n.state.activeElement, o = n.state.__activeStep ?? y(n)?.step ?? n.state.activeStep ?? n.state.__activation?.step, s = L(a) ? void 0 : a, c = document.activeElement, l = !c || c === document.body || n.state.popover?.wrapper.contains(c) ? n.state.__activeOnDestroyed : void 0, u = n.config.onDestroyStarted, d = b(n) ?? n.state.activeStep ?? n.state.__activation?.step;
		if (r && u && d) {
			n.state.__destroyReason = e, u(s, d, F(n, void 0, e));
			return;
		}
		let f = o?.onDeselected || n.config.onDeselected, p = n.config.onDestroyed, m = E();
		o && (i && f && f(s, o, F(n, m, e)), p?.(s, o, F(n, m, e))), l && t.restoreFocus(l);
	}
	let O = {
		isActive: () => n.state.isInitialized || !1,
		refresh: () => t.refresh(n),
		drive: (e = 0) => {
			C(), w(e);
		},
		setConfig: (e) => ne(n, e),
		setSteps: (e) => {
			n.state.isInitialized ? E() : n.state = {}, ne(n, {
				...n.config,
				steps: e
			});
		},
		getConfig: ((e) => e ? n.config[e] : n.config),
		getState: (e) => e ? n.state[e] : n.state,
		getActiveIndex: () => n.state.activeIndex,
		isFirstStep: () => J(n, -1),
		isLastStep: () => J(n, 1),
		getActiveStep: () => n.state.activeStep,
		getActiveElement: () => n.state.activeElement,
		getPreviousElement: () => n.state.previousElement,
		getPreviousStep: () => n.state.previousStep,
		getNextStep: () => {
			let e = n.config.steps || [], t = n.state.activeIndex;
			if (t === void 0) return;
			let r = q(n, t + 1, 1);
			return r === void 0 ? void 0 : e[r];
		},
		moveNext: l,
		movePrevious: u,
		moveTo: d,
		hasNextStep: () => n.state.activeIndex !== void 0 && !J(n, 1),
		hasPreviousStep: () => n.state.activeIndex !== void 0 && !J(n, -1),
		highlight: (e) => {
			C(), v(n), t.endInitialWait(n), n.state.__destroyReason = void 0, T(Gt({
				...e,
				popover: e.popover ? {
					showButtons: [],
					showProgress: !1,
					progressText: "",
					...e.popover
				} : void 0
			}));
		},
		updatePopover: _,
		advance: f,
		nudge: (e) => {
			typeof e == "object" && _(e), x(typeof e == "string" ? e : ""), t.nudge(n);
		},
		destroy: () => {
			D("api", !1);
		}
	};
	return n.driver = O, O;
}
function bn(e, t, n) {
	let r = e.state.__activation, i = () => !o(e, r), a = e.state.__activeStep, s = e.state.__activeElement || (a ? void 0 : t), c = n.onHighlightStarted || e.config.onHighlightStarted, l = n.onHighlighted || e.config.onHighlighted, u = a?.onDeselected || e.config.onDeselected, d = r?.controller.signal, f = F(e);
	if (!(a && a !== n && u && (u(L(s) ? void 0 : s, a, f), i())) && !(c && (c(L(t) ? void 0 : t, n, {
		...f,
		signal: d
	}), i()))) return e.state.previousStep = a, e.state.previousElement = s, e.state.activeStep = n, e.state.activeElement = t, (r) => {
		e.state.__previousStep = a, e.state.__previousElement = s, e.state.__activeStep = n, e.state.__activeElement = r, l && l(L(t) ? void 0 : r, n, {
			...F(e),
			signal: d
		});
	};
}
function xn(e, t, n) {
	return (e.state.activeStep === t ? e.state.activeElement : void 0) || n;
}
var Sn = {
	"aria-haspopup": "dialog",
	"aria-expanded": "true",
	"aria-controls": "driver-popover-content"
}, Cn = /* @__PURE__ */ new WeakSet();
function wn(e) {
	if (!Object.keys(Sn).some((t) => e.hasAttribute(t)) || Cn.has(e)) {
		for (let [t, n] of Object.entries(Sn)) e.setAttribute(t, n);
		Cn.add(e);
	}
}
function Tn(e) {
	if (Cn.has(e)) {
		for (let [t, n] of Object.entries(Sn)) e.getAttribute(t) === n && e.removeAttribute(t);
		Cn.delete(e);
	}
}
function En() {
	let e = document.getElementById(ce);
	if (e) return e;
	let t = document.createElement("div");
	return t.id = ce, t.style.cssText = "width:0;height:0;pointer-events:none;opacity:0;position:fixed;top:50%;left:50%", document.body.appendChild(t), t;
}
function Dn(e, t) {
	let n = I(t.element);
	n ||= En(), jn(e, n, t);
}
function On(e, t) {
	let n = e.state.__resizeObserver;
	n?.disconnect(), t && n?.observe(t);
}
function kn(e) {
	let t = e.state.__activeElement, n = e.state.__activeStep;
	if (t && n) {
		if (l(e)) {
			f(e), vt(e);
			return;
		}
		e.state.__syncAllowedElements?.(), An(e, t), _t(e, t), vt(e), rn(e, t, n);
	}
}
function An(e, t) {
	let n = e.state.popover?.wrapper;
	n && Ne(n, t);
}
function jn(e, t, n) {
	On(e);
	let r = e.config.duration || 400, i = Date.now(), a = e.config.animate, o = bn(e, t, n);
	if (!o) return;
	let s = e.state.previousElement || t, l = s !== t && a, f = !1;
	He(e.state.popover);
	let p = () => {
		if (!u(e, p)) return;
		let a = Date.now() - i, c = r - a <= r / 2, m = xn(e, n, t);
		if (n.popover && c && !f && l && ($t(e, m, n), f = !0), e.config.animate && a < r) gt(e, a, r, s, m);
		else {
			if (_t(e, m), o(m), !u(e, p)) return;
			Qt(e, m, n);
			let t = d(e);
			On(e, m), t && kn(e);
			return;
		}
		window.requestAnimationFrame(p);
	};
	c(e, p), window.requestAnimationFrame(p), In(e);
	let m = k(e, n, "scrollIntoView");
	m !== !1 && _e(t, e.config.smoothScroll, typeof m == "object" ? m : void 0), !l && n.popover && $t(e, t, n), Fn(e), Ln(e, t, n);
}
var Mn = /* @__PURE__ */ new WeakMap();
function Nn(e, t) {
	Mn.get(e)?.disconnect();
	let n = new MutationObserver(() => {
		let n = t().filter((t) => !e.classList.contains(t));
		n.length > 0 && e.classList.add(...n);
	});
	n.observe(e, {
		attributes: !0,
		attributeFilter: ["class"]
	}), Mn.set(e, n);
}
function Pn(e) {
	Mn.get(e)?.disconnect(), Mn.delete(e), e.classList.remove("driver-active-element", "driver-no-interaction", le), Tn(e);
}
function Fn(e) {
	let t = e.state.__marked?.element;
	(/* @__PURE__ */ new Set([t, ...document.querySelectorAll(".driver-active-element")])).forEach((e) => {
		e && Pn(e);
	});
}
function In(e) {
	let t = e.state.__marked?.parent;
	(/* @__PURE__ */ new Set([t, ...document.querySelectorAll(".driver-active-element-parent")])).forEach((e) => {
		e?.classList.remove("driver-active-element-parent", "driver-active-element-parent-no-scroll");
	});
}
function Ln(e, t, n) {
	document.body.classList.toggle(ue, !!k(e, n, "allowPageInteraction"));
	let r = k(e, n, "disableActiveInteraction") === !0;
	r && t.classList.add("driver-no-interaction");
	let i = t.parentElement, a = i && i !== document.body ? i : void 0;
	a && (a.classList.add("driver-active-element-parent"), fe(a) && a.classList.add("driver-active-element-parent-no-scroll")), e.state.__marked = {
		element: t,
		parent: a
	}, t.classList.add("driver-active-element"), L(t) || (wn(t), t.classList.toggle(le, de(t)), Nn(t, () => [
		"driver-active-element",
		...r ? ["driver-no-interaction"] : [],
		...de(t) ? [le] : []
	]));
}
function Rn() {
	document.getElementById(ce)?.remove();
}
function zn(e) {
	Rn(), In(e), Fn(e);
}
function Bn(e, t) {
	let n = e.state.activeStep;
	n && (In(e), Fn(e), Ln(e, t, n), e.state.activeElement = t, e.state.__activeElement = t, On(e, t), An(e, t), _t(e, t), rn(e, t, n));
}
function Vn(e, t) {
	let n = e.state.activeElement;
	return !L(n) && !!n && t.includes(n);
}
function Hn(e, t) {
	let n = e.state.popover?.wrapper;
	return n && t.includes(n) ? "popover" : Vn(e, t) ? "element" : e.ui.isAllowed(e, t) ? "allowed" : "outside";
}
function Un(e) {
	let t = [];
	for (let n = e; n;) t.push(n), n = n.parentNode || (n instanceof ShadowRoot ? n.host : null);
	return t;
}
var Wn = /* @__PURE__ */ new Set([
	"pointerdown",
	"mousedown",
	"pointerup",
	"mouseup"
]), Gn = [
	"click",
	"auxclick",
	"contextmenu",
	"dblclick"
];
function Kn(e) {
	if (e instanceof MouseEvent) return Wn.has(e.type) ? `press${e.button}` : Gn.includes(e.type) ? e.type : void 0;
}
function qn(e, t) {
	let { types: n, strict: r } = M(ee(e, t));
	if (r && n.length) return n.every(P) ? n : void 0;
}
function Jn(e, t) {
	let n = e.state.activeStep, r = Kn(t);
	if (!n || !r || !Vn(e, t.composedPath())) return;
	if (e.ui.blocksInteraction && k(e, n, "disableActiveInteraction")) return "disabled";
	let i = qn(e, n);
	if (i && !i.some((e) => te[e].includes(r))) return "strict";
}
function Yn(e) {
	return e.isTrusted;
}
var Xn = [
	"pointerdown",
	"mousedown",
	"touchstart"
], Zn = [
	"pointerup",
	"mouseup",
	"touchend"
], Qn = /* @__PURE__ */ new Set(["touchstart", "touchend"]), $n = /* @__PURE__ */ new Set([
	"pointerdown",
	"mousedown",
	"pointerup",
	"mouseup",
	"click"
]);
function er(e, t) {
	t.preventDefault(), t.stopImmediatePropagation(), e.consumed.add(t);
}
function tr(e, t) {
	if (!e.ui.blocksInteraction || A(e)) return;
	let n = t.composedPath();
	if (Hn(e, n) !== "outside") return;
	let r = n[0];
	if (r === document.body || r === document.documentElement) return "root";
	let i = e.state.__overlaySvg;
	if (i && n.includes(i)) return "overlay";
}
function nr(e) {
	$n.has(e.type) && e.preventDefault(), e.stopImmediatePropagation();
}
function rr(e, t) {
	if (!e.state.isInitialized) return;
	let n = e.state.activeStep, r = k(e, n, "onInteraction");
	if (!n || !r || t.type === "auxclick" && t.button === 2) return;
	let i = Hn(e, t.composedPath());
	if (i === "popover") return;
	let a = e.state.activeElement;
	r(L(a) ? void 0 : a, n, {
		...F(e),
		event: t,
		region: i
	}) === !1 && er(e, t);
}
function ir(e) {
	let t = new AbortController(), n = !1, r = (t) => {
		!e.state.isInitialized || !Yn(t) || (n = !!tr(e, t), (n || Jn(e, t)) && nr(t));
	}, i = (t) => {
		!e.state.isInitialized || !Yn(t) || (n && tr(e, t) || Jn(e, t)) && nr(t);
	}, a = (t) => {
		if (rr(e, t), !e.state.isInitialized || e.consumed.has(t) || !Yn(t)) return;
		let r = t.type === "dblclick" || t.type === "auxclick" && t.button === 2;
		if (n && tr(e, t) === "root") {
			nr(t), X(e.state.activeStep) && !r && e.ui.nudge(e);
			return;
		}
		let i = Jn(e, t);
		i && (er(e, t), i === "strict" && !r && e.ui.nudge(e));
	}, o = (e, n) => {
		window.addEventListener(e, n, {
			capture: !0,
			passive: Qn.has(e) || void 0,
			signal: t.signal
		});
	};
	return Xn.forEach((e) => o(e, r)), Zn.forEach((e) => o(e, i)), Gn.forEach((e) => o(e, a)), () => t.abort();
}
function ar(e, t) {
	let n = Hn(e, t);
	return n === "element" || n === "allowed" || n === "outside" && A(e);
}
function or(e, t) {
	return Pe(t[0]) && ar(e, t);
}
function sr(e) {
	return or(e, Un(document.activeElement));
}
function Q(e) {
	return e.code || e.key;
}
function cr(e) {
	let t = e.state.__handledKeys;
	return t || (t = /* @__PURE__ */ new Set(), e.state.__handledKeys = t), t;
}
function lr(e, t) {
	let n = e.state.__pressedKeys, r = Q(t);
	return n?.has(r) ? n.get(r) !== e.state.__activation : t.repeat;
}
function ur(e) {
	let t = new AbortController(), n = /* @__PURE__ */ new Map();
	e.state.__pressedKeys = n;
	let r = (t) => {
		let r = t;
		r.type === "keydown" && !r.repeat && n.set(Q(r), e.state.__activation);
		let i = e.state.popover?.wrapper;
		i && r.composedPath().includes(i) && lr(e, r) && r.preventDefault();
	};
	return [
		"keydown",
		"keypress",
		"keyup"
	].forEach((e) => window.addEventListener(e, r, {
		capture: !0,
		signal: t.signal
	})), window.addEventListener("blur", () => {
		e.state.__widgetKey = void 0, n.clear();
	}, { signal: t.signal }), () => t.abort();
}
function $(e) {
	let t = e.state.__resizeTimeout;
	t && window.cancelAnimationFrame(t), e.state.__resizeTimeout = window.requestAnimationFrame(() => kn(e));
}
function dr(e) {
	let t = e.state.__activeElement?.getBoundingClientRect();
	!t || t.width === 0 && t.height === 0 || $(e);
}
function fr(e, t) {
	if (!e.state.isInitialized || t.key !== "Tab" && t.keyCode !== 9 || A(e)) return;
	let n = e.state.__activeElement, r = e.state.popover?.wrapper, i = [...new Set(ge([
		...r ? [r] : [],
		...n ? [n] : [],
		...Array.from(document.querySelectorAll(`.${R}`))
	]))], a = i[0], o = i[i.length - 1];
	t.preventDefault(), t.shiftKey ? (i[i.indexOf(document.activeElement) - 1] || o)?.focus() : (i[i.indexOf(document.activeElement) + 1] || a)?.focus();
}
function pr(e, t) {
	cr(e).add(Q(t)), (or(e, t.composedPath()) || sr(e)) && (e.state.__widgetKey = Q(t));
}
function mr(e, t) {
	let n = Q(t);
	!t.defaultPrevented && e.state.__widgetKey !== n && cr(e).delete(n);
}
function hr(e, t) {
	let n = e.config.allowKeyboardControl ?? !0, r = cr(e).delete(Q(t)), i = lr(e, t);
	e.state.__pressedKeys?.delete(Q(t)), e.state.__widgetKey === Q(t) && (e.state.__widgetKey = void 0), !(!n || r || i || sr(e)) && (t.key === "Escape" ? e.tour.escape() : t.key === "ArrowRight" ? e.tour.arrowRight() : t.key === "ArrowLeft" && e.tour.arrowLeft());
}
function gr(e) {
	if (e.state.__events) return;
	let t = (t) => hr(e, t), n = (t) => {
		mr(e, t), fr(e, t);
	}, r = (t) => pr(e, t), i = () => $(e), a = (t) => {
		t.target instanceof Node && e.state.popover?.wrapper.contains(t.target) || $(e);
	};
	e.state.__events = {
		onKeyup: t,
		onKeydown: n,
		onKeydownCapture: r,
		onResize: i,
		onScroll: a
	}, typeof ResizeObserver < "u" && (e.state.__resizeObserver = new ResizeObserver(() => dr(e)));
	let o = new MutationObserver(() => $(e));
	o.observe(document.documentElement, {
		attributes: !0,
		attributeFilter: ["open"],
		subtree: !0
	}), e.state.__openObserver = o;
	let s = ir(e), c = ur(e);
	e.state.__teardownGate = () => {
		s(), c();
	}, window.addEventListener("keydown", r, !0), window.addEventListener("keyup", t, !1), window.addEventListener("keydown", n, !1), window.addEventListener("resize", i), window.addEventListener("scroll", a, !0), document.addEventListener("close", i, !0);
}
function _r(e) {
	let t = e.state.__events;
	t && (window.removeEventListener("keyup", t.onKeyup), window.removeEventListener("keydown", t.onKeydown), window.removeEventListener("keydown", t.onKeydownCapture, !0), e.state.__teardownGate?.(), e.state.__resizeObserver?.disconnect(), e.state.__openObserver?.disconnect(), window.removeEventListener("resize", t.onResize), document.removeEventListener("close", t.onResize, !0), window.removeEventListener("scroll", t.onScroll, !0));
}
function vr(e) {
	let t = e.state.__activation?.step ?? b(e);
	return !h(e) && !X(t);
}
function yr(e) {
	let t = e.state.__activation;
	return X(t?.step ?? b(e)) ? (!(t && O(e, t.step)) && !h(e) && e.ui.nudge(e), !0) : !1;
}
function br(e, t) {
	if (t === "previous" && h(e) || t === "next" && !vr(e)) return !1;
	let n = Yt(e, b(e));
	return n.showButtons.includes(t) && !n.disableButtons.includes(t);
}
function xr(e, t = "close") {
	e.config.allowClose && e.tour.destroy(t);
}
function Sr(e) {
	Yt(e, b(e)).disableButtons.includes("close") || xr(e, "escape");
}
function Cr(e) {
	yr(e) || e.tour.next();
}
function wr(e) {
	let { element: t, step: n } = cn(e), r = Lt(e, n);
	!n || !r ? Wt(n) || e.tour.movePrevious() : r(t, n, F(e));
}
function Tr(e) {
	let t = e.config.overlayClickBehavior;
	if (!(typeof t != "function" && t !== "none" && yr(e))) {
		if (e.config.allowClose && t === "close") {
			e.tour.destroy("overlay");
			return;
		}
		if (typeof t == "function") {
			e.state.__destroyReason = "overlay";
			let n = b(e) ?? e.state.activeStep;
			n && t(e.state.__activeElement, n, F(e));
			return;
		}
		t === "nextStep" && vr(e) && e.tour.next();
	}
}
function Er(e) {
	let t = e.state.activeIndex;
	l(e) || t === void 0 || !e.state.__activeStep || !(e.config.steps || [])[t - 1] || !br(e, "previous") || wr(e);
}
function Dr(e) {
	let t = e.state.activeIndex !== void 0 && !!b(e);
	l(e) || !t || yr(e) || !br(e, "next") || e.tour.next();
}
function Or(e) {
	return {
		pressNext: () => Cr(e),
		previous: () => wr(e),
		requestClose: () => xr(e),
		overlayClick: () => Tr(e),
		escape: () => Sr(e),
		arrowLeft: () => Er(e),
		arrowRight: () => Dr(e)
	};
}
var kr = "driver-popover-nudge", Ar = /* @__PURE__ */ new WeakMap();
function jr() {
	let e = getComputedStyle(document.documentElement).getPropertyValue("--driver-nudge-duration").trim(), t = parseFloat(e);
	return Number.isNaN(t) ? 500 : e.endsWith("ms") || !e.endsWith("s") ? t : t * 1e3;
}
function Mr(e, t) {
	window.clearTimeout(Ar.get(e));
	let n = () => {
		window.clearTimeout(Ar.get(e)), Ar.delete(e), e.removeEventListener("animationend", r), t();
	}, r = (e) => {
		let t = e.animationName;
		t && !t.startsWith("driver-nudge") || n();
	};
	e.addEventListener("animationend", r), Ar.set(e, window.setTimeout(n, jr() + 150));
}
function Nr(e) {
	e.classList.remove(kr), e.offsetWidth, e.classList.add(kr);
}
function Pr(e) {
	let t = e.state.popover?.wrapper;
	e.state.isInitialized && t && t.isConnected && t.style.display !== "none" && (Nr(t), Mr(t, () => t.classList.remove(kr)));
}
function Fr(e) {
	document.body.classList.add("driver-active", e.config.animate ? "driver-fade" : "driver-simple"), e.config.allowScroll || document.body.classList.add("driver-no-scroll"), document.body.style.setProperty("--driver-animation-duration", `${e.config.duration || 400}ms`), gr(e), Mt(e);
}
function Ir() {
	document.body.classList.remove("driver-active", "driver-fade", "driver-simple", "driver-no-scroll", ue), document.body.style.removeProperty("--driver-animation-duration");
}
function Lr(e) {
	_r(e), Pt(e), ct(e.state.popover), zn(e), Dt(e);
}
function Rr(e, t) {
	let n = Y(e, t);
	if (!n.popover) return;
	let r = En();
	s(e, t, !0), i(e, n, {
		element: r,
		index: t
	}), $t(e, r, n), ln(e, "initial");
}
function zr(e) {
	x(e) && (ct(e.state.popover), e.state.popover = void 0, Rn());
}
function Br(e) {
	let t = e.state.__activation;
	if (!t) return;
	let n = e.state.popover, { element: r, step: i } = cn(e);
	if (!n || !r || i !== t.step || n.wrapper.style.display === "none" || !n.wrapper.isConnected) return;
	let a = en(n);
	nn(e, r, t.step), Nt(e, en(n).filter((e, t) => e && e !== a[t]).join(". "));
}
var Vr = {
	blocksInteraction: !0,
	controls: Or,
	mount: Fr,
	detach: Ir,
	unmount: Lr,
	highlight: Dn,
	rebind: Bn,
	refresh: $,
	trackAllowed: At,
	isAllowed: (e, t) => t.some((e) => e instanceof Element && e.classList.contains("driver-allowed-element")),
	showWaiting: an,
	hideWaiting: on,
	showInitialWait: Rr,
	endInitialWait: zr,
	refreshPopover: Br,
	nudge: Pr,
	announce: Nt,
	restoreFocus: (e) => e.focus()
};
function Hr(e = {}) {
	return yn(e, Vr);
}
// src/onboarding/guide-driver.ts
function Ur(e) {
	let t = e.getBoundingClientRect();
	if (!e.isConnected || !t.width || !t.height || t.right <= 0 || t.left >= innerWidth || e.closest("[hidden],[inert],[data-skeleton]")) return !1;
	for (let t = e; t; t = t.parentElement) {
		let e = getComputedStyle(t);
		if (e.display === "none" || e.visibility === "hidden" || e.visibility === "collapse" || e.opacity === "0") return !1;
	}
	return ![...e.querySelectorAll("[data-skeleton]")].some((e) => e.getBoundingClientRect().height > 0);
}
function Wr(e) {
	if (!e) return;
	let t = e.split(",").flatMap((e) => [...document.querySelectorAll(e.trim())]).find(Ur);
	if (t) return t.closest("[data-setting-row], [data-setting-sort-controls]") || t;
}
async function Gr(e, t, n = 4e3) {
	if (!e) return;
	let r = Date.now();
	for (; !t.aborted;) {
		let t = Wr(e);
		if (t) return t;
		if (Date.now() - r >= n) return;
		await new Promise((e) => setTimeout(e, 80));
	}
}
function Kr(i) {
	let a = null, o = null, s = !1, c = !1, l, u = 0, d, f, p = () => {
		f &&= (n(!1, !1, { miniplayer: !1 }), f(), void 0);
	}, m = document.activeElement, h = (e) => {
		let t = new URL(e, location.origin);
		if (location.pathname !== t.pathname || t.search && location.search !== t.search || t.hash && location.hash !== t.hash) {
			new URLSearchParams(location.search).has("edit") && t.searchParams.set("edit", ""), s = !0;
			try {
				i.navigate(`${t.pathname}${t.search}${t.hash}`);
			} finally {
				s = !1;
			}
		}
	}, g = (e) => {
		if (e.target instanceof Element && e.target.closest("[data-copy-inline], [data-copy-input]")) return;
		if (e.key === "Escape") {
			e.preventDefault(), e.stopImmediatePropagation(), i.close();
			return;
		}
		let t = document.querySelector(".peach-guide-popover");
		if (!t) return;
		let n = i.invitation && e.target instanceof Element && e.target.closest("#tutorialBtn");
		if (!t.contains(e.target) && !n && e.key !== "Tab") {
			e.preventDefault(), e.stopImmediatePropagation();
			return;
		}
		if (e.key !== "Tab") return;
		let r = [...t.querySelectorAll("button:not([disabled]), summary, a[href], [tabindex=\"0\"]")].filter((e) => e.offsetWidth && e.offsetHeight), a = i.invitation ? document.getElementById("tutorialBtn") : null;
		a && r.unshift(a);
		let o = r.indexOf(document.activeElement);
		e.preventDefault(), e.stopImmediatePropagation(), r[(o + (e.shiftKey ? -1 : 1) + r.length) % r.length]?.focus();
	};
	window.addEventListener("keydown", g, !0), window.addEventListener("resize", t);
	let _ = r.listen(() => {
		s || (i.leave || i.close)();
	}), v = () => {
		o?.abort(), cancelAnimationFrame(u), l?.(), l = void 0, a?.destroy(), a = null;
	};
	return {
		async show(n, r, s) {
			v(), t();
			let m = new AbortController();
			o = m, document.querySelector("#stage .vjs-peach-settings-toggle[aria-expanded=\"true\"]")?.click();
			let g = n.route;
			if (n.surface || p(), n.surface) {
				if (!d) {
					h("/");
					let e = await Gr("[data-guide-video][data-id]", m.signal), t = Number(e?.dataset.id);
					Number.isSafeInteger(t) && t > 0 && (d = t);
				}
				if (c || m.signal.aborted) return;
				d && (f ||= e(), g = `/assets/${d}`);
			}
			if (g && h(g), n.surface === "subtitles" && d) {
				let e = await Gr("#stage .vjs-peach-settings-toggle", m.signal);
				!m.signal.aborted && e?.getAttribute("aria-expanded") !== "true" && e?.click();
			}
			let _ = await Gr(n.target, m.signal);
			if (c || m.signal.aborted) return;
			let y = !_;
			a = Hr({
				animate: !1,
				smoothScroll: !1,
				disableActiveInteraction: !i.invitation,
				allowKeyboardControl: !1,
				allowClose: !0,
				overlayClickBehavior: () => i.close(),
				stagePadding: 6,
				stageRadius: parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--control-radius")) || 8,
				popoverClass: "peach-react peach-guide-popover",
				showButtons: [],
				onPopoverRender(e) {
					l?.();
					let t = document.querySelector("#stage[open]");
					if (n.surface && t) {
						t.append(e.wrapper);
						let n = document.querySelector(".driver-overlay");
						n && t.append(n);
					}
					e.wrapper.setAttribute("role", "dialog"), e.wrapper.setAttribute("aria-modal", "true"), l = i.mountPopover(e.wrapper, e.arrow, {
						step: n,
						position: r,
						total: s,
						missing: y,
						...i
					});
				},
				onNextClick: () => i.next(y),
				onDoneClick: () => i.next(y),
				onPrevClick: () => i.previous(),
				onCloseClick: () => i.close()
			});
			let b = () => a?.highlight({
				..._ ? { element: _ } : {},
				popover: {
					side: "bottom",
					align: "center",
					showButtons: []
				}
			});
			b();
			let x = "", S = () => {
				if (c || m.signal.aborted) return;
				let e = n.surface ? document.querySelector("#stage[open]") : null, t = document.querySelector(".driver-overlay");
				e && t && t.parentElement !== e && e.append(t);
				let r = Wr(n.target);
				r !== _ && (_ = r, y = !r, b(), x = "");
				let i = _?.getBoundingClientRect(), o = window.visualViewport, s = `${i?.x}:${i?.y}:${i?.width}:${i?.height}:${innerWidth}:${innerHeight}:${o?.height}:${o?.offsetTop}`;
				s !== x && (x = s, a?.refresh()), u = requestAnimationFrame(S);
			};
			u = requestAnimationFrame(S), queueMicrotask(() => {
				m.signal.aborted || document.querySelector(".peach-guide-popover [data-guide-next]")?.focus();
			});
		},
		stop() {
			c = !0, v(), _(), p(), window.removeEventListener("keydown", g, !0), window.removeEventListener("resize", t), m?.isConnected && m.getBoundingClientRect().width && m.focus();
		}
	};
}
export { Kr as createGuideSession };

//# debugId=d3639b7a-240c-4e8f-916e-847f7a9a1e0a