var j0 = Object.defineProperty;
var B0 = (e, t, n) => t in e ? j0(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var oe = (e, t, n) => B0(e, typeof t != "symbol" ? t + "" : t, n);
import * as O from "react";
import F, { forwardRef as ut, createContext as gn, useLayoutEffect as Da, useEffect as xe, useContext as Qe, useRef as ye, useInsertionEffect as lg, useCallback as Et, useMemo as Ue, Fragment as it, createElement as Eo, useId as Yn, Component as z0, useState as Me, cloneElement as W0, Children as H0, isValidElement as U0, useImperativeHandle as Gr, useReducer as G0 } from "react";
import { jsx as S, jsxs as Z, Fragment as xc } from "react/jsx-runtime";
import * as cg from "react-dom";
import Y0 from "react-dom";
function ug(e) {
  var t, n, r = "";
  if (typeof e == "string" || typeof e == "number") r += e;
  else if (typeof e == "object") if (Array.isArray(e)) for (t = 0; t < e.length; t++) e[t] && (n = ug(e[t])) && (r && (r += " "), r += n);
  else for (t in e) e[t] && (r && (r += " "), r += t);
  return r;
}
function q0() {
  for (var e, t, n = 0, r = ""; n < arguments.length; ) (e = arguments[n++]) && (t = ug(e)) && (r && (r += " "), r += t);
  return r;
}
const nf = (e) => typeof e == "boolean" ? "".concat(e) : e === 0 ? "0" : e, rf = q0, Ma = (e, t) => (n) => {
  var r;
  if ((t == null ? void 0 : t.variants) == null) return rf(e, n == null ? void 0 : n.class, n == null ? void 0 : n.className);
  const { variants: o, defaultVariants: i } = t, s = Object.keys(o).map((c) => {
    const u = n == null ? void 0 : n[c], d = i == null ? void 0 : i[c];
    if (u === null) return null;
    const f = nf(u) || nf(d);
    return o[c][f];
  }), a = n && Object.entries(n).reduce((c, u) => {
    let [d, f] = u;
    return f === void 0 || (c[d] = f), c;
  }, {}), l = t == null || (r = t.compoundVariants) === null || r === void 0 ? void 0 : r.reduce((c, u) => {
    let { class: d, className: f, ...h } = u;
    return Object.entries(h).every((p) => {
      let [m, g] = p;
      return Array.isArray(g) ? g.includes({
        ...i,
        ...a
      }[m]) : {
        ...i,
        ...a
      }[m] === g;
    }) ? [
      ...c,
      d,
      f
    ] : c;
  }, []);
  return rf(e, s, l, n == null ? void 0 : n.class, n == null ? void 0 : n.className);
};
function dg(e) {
  var t, n, r = "";
  if (typeof e == "string" || typeof e == "number") r += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (n = dg(e[t])) && (r && (r += " "), r += n);
  } else for (n in e) e[n] && (r && (r += " "), r += n);
  return r;
}
function K0() {
  for (var e, t, n = 0, r = "", o = arguments.length; n < o; n++) (e = arguments[n]) && (t = dg(e)) && (r && (r += " "), r += t);
  return r;
}
var of = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function fg(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function Z0(e) {
  if (e.__esModule) return e;
  var t = e.default;
  if (typeof t == "function") {
    var n = function r() {
      return this instanceof r ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    n.prototype = t.prototype;
  } else n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(e).forEach(function(r) {
    var o = Object.getOwnPropertyDescriptor(e, r);
    Object.defineProperty(n, r, o.get ? o : {
      enumerable: !0,
      get: function() {
        return e[r];
      }
    });
  }), n;
}
var X0 = Error, Q0 = EvalError, J0 = RangeError, ew = ReferenceError, hg = SyntaxError, Ki = TypeError, tw = URIError, nw = function() {
  if (typeof Symbol != "function" || typeof Object.getOwnPropertySymbols != "function")
    return !1;
  if (typeof Symbol.iterator == "symbol")
    return !0;
  var t = {}, n = Symbol("test"), r = Object(n);
  if (typeof n == "string" || Object.prototype.toString.call(n) !== "[object Symbol]" || Object.prototype.toString.call(r) !== "[object Symbol]")
    return !1;
  var o = 42;
  t[n] = o;
  for (n in t)
    return !1;
  if (typeof Object.keys == "function" && Object.keys(t).length !== 0 || typeof Object.getOwnPropertyNames == "function" && Object.getOwnPropertyNames(t).length !== 0)
    return !1;
  var i = Object.getOwnPropertySymbols(t);
  if (i.length !== 1 || i[0] !== n || !Object.prototype.propertyIsEnumerable.call(t, n))
    return !1;
  if (typeof Object.getOwnPropertyDescriptor == "function") {
    var s = Object.getOwnPropertyDescriptor(t, n);
    if (s.value !== o || s.enumerable !== !0)
      return !1;
  }
  return !0;
}, sf = typeof Symbol < "u" && Symbol, rw = nw, ow = function() {
  return typeof sf != "function" || typeof Symbol != "function" || typeof sf("foo") != "symbol" || typeof Symbol("bar") != "symbol" ? !1 : rw();
}, fl = {
  __proto__: null,
  foo: {}
}, iw = Object, sw = function() {
  return { __proto__: fl }.foo === fl.foo && !(fl instanceof iw);
}, aw = "Function.prototype.bind called on incompatible ", lw = Object.prototype.toString, cw = Math.max, uw = "[object Function]", af = function(t, n) {
  for (var r = [], o = 0; o < t.length; o += 1)
    r[o] = t[o];
  for (var i = 0; i < n.length; i += 1)
    r[i + t.length] = n[i];
  return r;
}, dw = function(t, n) {
  for (var r = [], o = n, i = 0; o < t.length; o += 1, i += 1)
    r[i] = t[o];
  return r;
}, fw = function(e, t) {
  for (var n = "", r = 0; r < e.length; r += 1)
    n += e[r], r + 1 < e.length && (n += t);
  return n;
}, hw = function(t) {
  var n = this;
  if (typeof n != "function" || lw.apply(n) !== uw)
    throw new TypeError(aw + n);
  for (var r = dw(arguments, 1), o, i = function() {
    if (this instanceof o) {
      var u = n.apply(
        this,
        af(r, arguments)
      );
      return Object(u) === u ? u : this;
    }
    return n.apply(
      t,
      af(r, arguments)
    );
  }, s = cw(0, n.length - r.length), a = [], l = 0; l < s; l++)
    a[l] = "$" + l;
  if (o = Function("binder", "return function (" + fw(a, ",") + "){ return binder.apply(this,arguments); }")(i), n.prototype) {
    var c = function() {
    };
    c.prototype = n.prototype, o.prototype = new c(), c.prototype = null;
  }
  return o;
}, pw = hw, Ou = Function.prototype.bind || pw, mw = Function.prototype.call, gw = Object.prototype.hasOwnProperty, yw = Ou, vw = yw.call(mw, gw), Ee, bw = X0, ww = Q0, xw = J0, Tw = ew, Co = hg, bo = Ki, Sw = tw, pg = Function, hl = function(e) {
  try {
    return pg('"use strict"; return (' + e + ").constructor;")();
  } catch {
  }
}, zr = Object.getOwnPropertyDescriptor;
if (zr)
  try {
    zr({}, "");
  } catch {
    zr = null;
  }
var pl = function() {
  throw new bo();
}, Ew = zr ? function() {
  try {
    return arguments.callee, pl;
  } catch {
    try {
      return zr(arguments, "callee").get;
    } catch {
      return pl;
    }
  }
}() : pl, oo = ow(), Cw = sw(), Ct = Object.getPrototypeOf || (Cw ? function(e) {
  return e.__proto__;
} : null), uo = {}, Pw = typeof Uint8Array > "u" || !Ct ? Ee : Ct(Uint8Array), Wr = {
  __proto__: null,
  "%AggregateError%": typeof AggregateError > "u" ? Ee : AggregateError,
  "%Array%": Array,
  "%ArrayBuffer%": typeof ArrayBuffer > "u" ? Ee : ArrayBuffer,
  "%ArrayIteratorPrototype%": oo && Ct ? Ct([][Symbol.iterator]()) : Ee,
  "%AsyncFromSyncIteratorPrototype%": Ee,
  "%AsyncFunction%": uo,
  "%AsyncGenerator%": uo,
  "%AsyncGeneratorFunction%": uo,
  "%AsyncIteratorPrototype%": uo,
  "%Atomics%": typeof Atomics > "u" ? Ee : Atomics,
  "%BigInt%": typeof BigInt > "u" ? Ee : BigInt,
  "%BigInt64Array%": typeof BigInt64Array > "u" ? Ee : BigInt64Array,
  "%BigUint64Array%": typeof BigUint64Array > "u" ? Ee : BigUint64Array,
  "%Boolean%": Boolean,
  "%DataView%": typeof DataView > "u" ? Ee : DataView,
  "%Date%": Date,
  "%decodeURI%": decodeURI,
  "%decodeURIComponent%": decodeURIComponent,
  "%encodeURI%": encodeURI,
  "%encodeURIComponent%": encodeURIComponent,
  "%Error%": bw,
  "%eval%": eval,
  // eslint-disable-line no-eval
  "%EvalError%": ww,
  "%Float32Array%": typeof Float32Array > "u" ? Ee : Float32Array,
  "%Float64Array%": typeof Float64Array > "u" ? Ee : Float64Array,
  "%FinalizationRegistry%": typeof FinalizationRegistry > "u" ? Ee : FinalizationRegistry,
  "%Function%": pg,
  "%GeneratorFunction%": uo,
  "%Int8Array%": typeof Int8Array > "u" ? Ee : Int8Array,
  "%Int16Array%": typeof Int16Array > "u" ? Ee : Int16Array,
  "%Int32Array%": typeof Int32Array > "u" ? Ee : Int32Array,
  "%isFinite%": isFinite,
  "%isNaN%": isNaN,
  "%IteratorPrototype%": oo && Ct ? Ct(Ct([][Symbol.iterator]())) : Ee,
  "%JSON%": typeof JSON == "object" ? JSON : Ee,
  "%Map%": typeof Map > "u" ? Ee : Map,
  "%MapIteratorPrototype%": typeof Map > "u" || !oo || !Ct ? Ee : Ct((/* @__PURE__ */ new Map())[Symbol.iterator]()),
  "%Math%": Math,
  "%Number%": Number,
  "%Object%": Object,
  "%parseFloat%": parseFloat,
  "%parseInt%": parseInt,
  "%Promise%": typeof Promise > "u" ? Ee : Promise,
  "%Proxy%": typeof Proxy > "u" ? Ee : Proxy,
  "%RangeError%": xw,
  "%ReferenceError%": Tw,
  "%Reflect%": typeof Reflect > "u" ? Ee : Reflect,
  "%RegExp%": RegExp,
  "%Set%": typeof Set > "u" ? Ee : Set,
  "%SetIteratorPrototype%": typeof Set > "u" || !oo || !Ct ? Ee : Ct((/* @__PURE__ */ new Set())[Symbol.iterator]()),
  "%SharedArrayBuffer%": typeof SharedArrayBuffer > "u" ? Ee : SharedArrayBuffer,
  "%String%": String,
  "%StringIteratorPrototype%": oo && Ct ? Ct(""[Symbol.iterator]()) : Ee,
  "%Symbol%": oo ? Symbol : Ee,
  "%SyntaxError%": Co,
  "%ThrowTypeError%": Ew,
  "%TypedArray%": Pw,
  "%TypeError%": bo,
  "%Uint8Array%": typeof Uint8Array > "u" ? Ee : Uint8Array,
  "%Uint8ClampedArray%": typeof Uint8ClampedArray > "u" ? Ee : Uint8ClampedArray,
  "%Uint16Array%": typeof Uint16Array > "u" ? Ee : Uint16Array,
  "%Uint32Array%": typeof Uint32Array > "u" ? Ee : Uint32Array,
  "%URIError%": Sw,
  "%WeakMap%": typeof WeakMap > "u" ? Ee : WeakMap,
  "%WeakRef%": typeof WeakRef > "u" ? Ee : WeakRef,
  "%WeakSet%": typeof WeakSet > "u" ? Ee : WeakSet
};
if (Ct)
  try {
    null.error;
  } catch (e) {
    var Rw = Ct(Ct(e));
    Wr["%Error.prototype%"] = Rw;
  }
var kw = function e(t) {
  var n;
  if (t === "%AsyncFunction%")
    n = hl("async function () {}");
  else if (t === "%GeneratorFunction%")
    n = hl("function* () {}");
  else if (t === "%AsyncGeneratorFunction%")
    n = hl("async function* () {}");
  else if (t === "%AsyncGenerator%") {
    var r = e("%AsyncGeneratorFunction%");
    r && (n = r.prototype);
  } else if (t === "%AsyncIteratorPrototype%") {
    var o = e("%AsyncGenerator%");
    o && Ct && (n = Ct(o.prototype));
  }
  return Wr[t] = n, n;
}, lf = {
  __proto__: null,
  "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
  "%ArrayPrototype%": ["Array", "prototype"],
  "%ArrayProto_entries%": ["Array", "prototype", "entries"],
  "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
  "%ArrayProto_keys%": ["Array", "prototype", "keys"],
  "%ArrayProto_values%": ["Array", "prototype", "values"],
  "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
  "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
  "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
  "%BooleanPrototype%": ["Boolean", "prototype"],
  "%DataViewPrototype%": ["DataView", "prototype"],
  "%DatePrototype%": ["Date", "prototype"],
  "%ErrorPrototype%": ["Error", "prototype"],
  "%EvalErrorPrototype%": ["EvalError", "prototype"],
  "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
  "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
  "%FunctionPrototype%": ["Function", "prototype"],
  "%Generator%": ["GeneratorFunction", "prototype"],
  "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
  "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
  "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
  "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
  "%JSONParse%": ["JSON", "parse"],
  "%JSONStringify%": ["JSON", "stringify"],
  "%MapPrototype%": ["Map", "prototype"],
  "%NumberPrototype%": ["Number", "prototype"],
  "%ObjectPrototype%": ["Object", "prototype"],
  "%ObjProto_toString%": ["Object", "prototype", "toString"],
  "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
  "%PromisePrototype%": ["Promise", "prototype"],
  "%PromiseProto_then%": ["Promise", "prototype", "then"],
  "%Promise_all%": ["Promise", "all"],
  "%Promise_reject%": ["Promise", "reject"],
  "%Promise_resolve%": ["Promise", "resolve"],
  "%RangeErrorPrototype%": ["RangeError", "prototype"],
  "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
  "%RegExpPrototype%": ["RegExp", "prototype"],
  "%SetPrototype%": ["Set", "prototype"],
  "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
  "%StringPrototype%": ["String", "prototype"],
  "%SymbolPrototype%": ["Symbol", "prototype"],
  "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
  "%TypedArrayPrototype%": ["TypedArray", "prototype"],
  "%TypeErrorPrototype%": ["TypeError", "prototype"],
  "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
  "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
  "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
  "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
  "%URIErrorPrototype%": ["URIError", "prototype"],
  "%WeakMapPrototype%": ["WeakMap", "prototype"],
  "%WeakSetPrototype%": ["WeakSet", "prototype"]
}, Zi = Ou, zs = vw, Ow = Zi.call(Function.call, Array.prototype.concat), Iw = Zi.call(Function.apply, Array.prototype.splice), cf = Zi.call(Function.call, String.prototype.replace), Ws = Zi.call(Function.call, String.prototype.slice), _w = Zi.call(Function.call, RegExp.prototype.exec), Aw = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, Dw = /\\(\\)?/g, Mw = function(t) {
  var n = Ws(t, 0, 1), r = Ws(t, -1);
  if (n === "%" && r !== "%")
    throw new Co("invalid intrinsic syntax, expected closing `%`");
  if (r === "%" && n !== "%")
    throw new Co("invalid intrinsic syntax, expected opening `%`");
  var o = [];
  return cf(t, Aw, function(i, s, a, l) {
    o[o.length] = a ? cf(l, Dw, "$1") : s || i;
  }), o;
}, Nw = function(t, n) {
  var r = t, o;
  if (zs(lf, r) && (o = lf[r], r = "%" + o[0] + "%"), zs(Wr, r)) {
    var i = Wr[r];
    if (i === uo && (i = kw(r)), typeof i > "u" && !n)
      throw new bo("intrinsic " + t + " exists, but is not available. Please file an issue!");
    return {
      alias: o,
      name: r,
      value: i
    };
  }
  throw new Co("intrinsic " + t + " does not exist!");
}, Ho = function(t, n) {
  if (typeof t != "string" || t.length === 0)
    throw new bo("intrinsic name must be a non-empty string");
  if (arguments.length > 1 && typeof n != "boolean")
    throw new bo('"allowMissing" argument must be a boolean');
  if (_w(/^%?[^%]*%?$/, t) === null)
    throw new Co("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
  var r = Mw(t), o = r.length > 0 ? r[0] : "", i = Nw("%" + o + "%", n), s = i.name, a = i.value, l = !1, c = i.alias;
  c && (o = c[0], Iw(r, Ow([0, 1], c)));
  for (var u = 1, d = !0; u < r.length; u += 1) {
    var f = r[u], h = Ws(f, 0, 1), p = Ws(f, -1);
    if ((h === '"' || h === "'" || h === "`" || p === '"' || p === "'" || p === "`") && h !== p)
      throw new Co("property names with quotes must have matching quotes");
    if ((f === "constructor" || !d) && (l = !0), o += "." + f, s = "%" + o + "%", zs(Wr, s))
      a = Wr[s];
    else if (a != null) {
      if (!(f in a)) {
        if (!n)
          throw new bo("base intrinsic for " + t + " exists, but the property is not available.");
        return;
      }
      if (zr && u + 1 >= r.length) {
        var m = zr(a, f);
        d = !!m, d && "get" in m && !("originalValue" in m.get) ? a = m.get : a = a[f];
      } else
        d = zs(a, f), a = a[f];
      d && !l && (Wr[s] = a);
    }
  }
  return a;
}, mg = { exports: {} }, ml, uf;
function Iu() {
  if (uf) return ml;
  uf = 1;
  var e = Ho, t = e("%Object.defineProperty%", !0) || !1;
  if (t)
    try {
      t({}, "a", { value: 1 });
    } catch {
      t = !1;
    }
  return ml = t, ml;
}
var Fw = Ho, Is = Fw("%Object.getOwnPropertyDescriptor%", !0);
if (Is)
  try {
    Is([], "length");
  } catch {
    Is = null;
  }
var gg = Is, df = Iu(), Lw = hg, io = Ki, ff = gg, Vw = function(t, n, r) {
  if (!t || typeof t != "object" && typeof t != "function")
    throw new io("`obj` must be an object or a function`");
  if (typeof n != "string" && typeof n != "symbol")
    throw new io("`property` must be a string or a symbol`");
  if (arguments.length > 3 && typeof arguments[3] != "boolean" && arguments[3] !== null)
    throw new io("`nonEnumerable`, if provided, must be a boolean or null");
  if (arguments.length > 4 && typeof arguments[4] != "boolean" && arguments[4] !== null)
    throw new io("`nonWritable`, if provided, must be a boolean or null");
  if (arguments.length > 5 && typeof arguments[5] != "boolean" && arguments[5] !== null)
    throw new io("`nonConfigurable`, if provided, must be a boolean or null");
  if (arguments.length > 6 && typeof arguments[6] != "boolean")
    throw new io("`loose`, if provided, must be a boolean");
  var o = arguments.length > 3 ? arguments[3] : null, i = arguments.length > 4 ? arguments[4] : null, s = arguments.length > 5 ? arguments[5] : null, a = arguments.length > 6 ? arguments[6] : !1, l = !!ff && ff(t, n);
  if (df)
    df(t, n, {
      configurable: s === null && l ? l.configurable : !s,
      enumerable: o === null && l ? l.enumerable : !o,
      value: r,
      writable: i === null && l ? l.writable : !i
    });
  else if (a || !o && !i && !s)
    t[n] = r;
  else
    throw new Lw("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
}, Tc = Iu(), yg = function() {
  return !!Tc;
};
yg.hasArrayLengthDefineBug = function() {
  if (!Tc)
    return null;
  try {
    return Tc([], "length", { value: 1 }).length !== 1;
  } catch {
    return !0;
  }
};
var $w = yg, jw = Ho, hf = Vw, Bw = $w(), pf = gg, mf = Ki, zw = jw("%Math.floor%"), Ww = function(t, n) {
  if (typeof t != "function")
    throw new mf("`fn` is not a function");
  if (typeof n != "number" || n < 0 || n > 4294967295 || zw(n) !== n)
    throw new mf("`length` must be a positive 32-bit integer");
  var r = arguments.length > 2 && !!arguments[2], o = !0, i = !0;
  if ("length" in t && pf) {
    var s = pf(t, "length");
    s && !s.configurable && (o = !1), s && !s.writable && (i = !1);
  }
  return (o || i || !r) && (Bw ? hf(
    /** @type {Parameters<define>[0]} */
    t,
    "length",
    n,
    !0,
    !0
  ) : hf(
    /** @type {Parameters<define>[0]} */
    t,
    "length",
    n
  )), t;
};
(function(e) {
  var t = Ou, n = Ho, r = Ww, o = Ki, i = n("%Function.prototype.apply%"), s = n("%Function.prototype.call%"), a = n("%Reflect.apply%", !0) || t.call(s, i), l = Iu(), c = n("%Math.max%");
  e.exports = function(f) {
    if (typeof f != "function")
      throw new o("a function is required");
    var h = a(t, s, arguments);
    return r(
      h,
      1 + c(0, f.length - (arguments.length - 1)),
      !0
    );
  };
  var u = function() {
    return a(t, i, arguments);
  };
  l ? l(e.exports, "apply", { value: u }) : e.exports.apply = u;
})(mg);
var Hw = mg.exports, vg = Ho, bg = Hw, Uw = bg(vg("String.prototype.indexOf")), Gw = function(t, n) {
  var r = vg(t, !!n);
  return typeof r == "function" && Uw(t, ".prototype.") > -1 ? bg(r) : r;
};
const Yw = {}, qw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Yw
}, Symbol.toStringTag, { value: "Module" })), Kw = /* @__PURE__ */ Z0(qw);
var _u = typeof Map == "function" && Map.prototype, gl = Object.getOwnPropertyDescriptor && _u ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null, Hs = _u && gl && typeof gl.get == "function" ? gl.get : null, gf = _u && Map.prototype.forEach, Au = typeof Set == "function" && Set.prototype, yl = Object.getOwnPropertyDescriptor && Au ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null, Us = Au && yl && typeof yl.get == "function" ? yl.get : null, yf = Au && Set.prototype.forEach, Zw = typeof WeakMap == "function" && WeakMap.prototype, mi = Zw ? WeakMap.prototype.has : null, Xw = typeof WeakSet == "function" && WeakSet.prototype, gi = Xw ? WeakSet.prototype.has : null, Qw = typeof WeakRef == "function" && WeakRef.prototype, vf = Qw ? WeakRef.prototype.deref : null, Jw = Boolean.prototype.valueOf, ex = Object.prototype.toString, tx = Function.prototype.toString, nx = String.prototype.match, Du = String.prototype.slice, ir = String.prototype.replace, rx = String.prototype.toUpperCase, bf = String.prototype.toLowerCase, wg = RegExp.prototype.test, wf = Array.prototype.concat, Tn = Array.prototype.join, ox = Array.prototype.slice, xf = Math.floor, Sc = typeof BigInt == "function" ? BigInt.prototype.valueOf : null, vl = Object.getOwnPropertySymbols, Ec = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? Symbol.prototype.toString : null, Po = typeof Symbol == "function" && typeof Symbol.iterator == "object", Bt = typeof Symbol == "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === Po || !0) ? Symbol.toStringTag : null, xg = Object.prototype.propertyIsEnumerable, Tf = (typeof Reflect == "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(e) {
  return e.__proto__;
} : null);
function Sf(e, t) {
  if (e === 1 / 0 || e === -1 / 0 || e !== e || e && e > -1e3 && e < 1e3 || wg.call(/e/, t))
    return t;
  var n = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
  if (typeof e == "number") {
    var r = e < 0 ? -xf(-e) : xf(e);
    if (r !== e) {
      var o = String(r), i = Du.call(t, o.length + 1);
      return ir.call(o, n, "$&_") + "." + ir.call(ir.call(i, /([0-9]{3})/g, "$&_"), /_$/, "");
    }
  }
  return ir.call(t, n, "$&_");
}
var Cc = Kw, Ef = Cc.custom, Cf = Sg(Ef) ? Ef : null, ix = function e(t, n, r, o) {
  var i = n || {};
  if (nr(i, "quoteStyle") && i.quoteStyle !== "single" && i.quoteStyle !== "double")
    throw new TypeError('option "quoteStyle" must be "single" or "double"');
  if (nr(i, "maxStringLength") && (typeof i.maxStringLength == "number" ? i.maxStringLength < 0 && i.maxStringLength !== 1 / 0 : i.maxStringLength !== null))
    throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
  var s = nr(i, "customInspect") ? i.customInspect : !0;
  if (typeof s != "boolean" && s !== "symbol")
    throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
  if (nr(i, "indent") && i.indent !== null && i.indent !== "	" && !(parseInt(i.indent, 10) === i.indent && i.indent > 0))
    throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
  if (nr(i, "numericSeparator") && typeof i.numericSeparator != "boolean")
    throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
  var a = i.numericSeparator;
  if (typeof t > "u")
    return "undefined";
  if (t === null)
    return "null";
  if (typeof t == "boolean")
    return t ? "true" : "false";
  if (typeof t == "string")
    return Cg(t, i);
  if (typeof t == "number") {
    if (t === 0)
      return 1 / 0 / t > 0 ? "0" : "-0";
    var l = String(t);
    return a ? Sf(t, l) : l;
  }
  if (typeof t == "bigint") {
    var c = String(t) + "n";
    return a ? Sf(t, c) : c;
  }
  var u = typeof i.depth > "u" ? 5 : i.depth;
  if (typeof r > "u" && (r = 0), r >= u && u > 0 && typeof t == "object")
    return Pc(t) ? "[Array]" : "[Object]";
  var d = Sx(i, r);
  if (typeof o > "u")
    o = [];
  else if (Eg(o, t) >= 0)
    return "[Circular]";
  function f(V, E, k) {
    if (E && (o = ox.call(o), o.push(E)), k) {
      var A = {
        depth: i.depth
      };
      return nr(i, "quoteStyle") && (A.quoteStyle = i.quoteStyle), e(V, A, r + 1, o);
    }
    return e(V, i, r + 1, o);
  }
  if (typeof t == "function" && !Pf(t)) {
    var h = px(t), p = ms(t, f);
    return "[Function" + (h ? ": " + h : " (anonymous)") + "]" + (p.length > 0 ? " { " + Tn.call(p, ", ") + " }" : "");
  }
  if (Sg(t)) {
    var m = Po ? ir.call(String(t), /^(Symbol\(.*\))_[^)]*$/, "$1") : Ec.call(t);
    return typeof t == "object" && !Po ? oi(m) : m;
  }
  if (wx(t)) {
    for (var g = "<" + bf.call(String(t.nodeName)), v = t.attributes || [], b = 0; b < v.length; b++)
      g += " " + v[b].name + "=" + Tg(sx(v[b].value), "double", i);
    return g += ">", t.childNodes && t.childNodes.length && (g += "..."), g += "</" + bf.call(String(t.nodeName)) + ">", g;
  }
  if (Pc(t)) {
    if (t.length === 0)
      return "[]";
    var y = ms(t, f);
    return d && !Tx(y) ? "[" + Rc(y, d) + "]" : "[ " + Tn.call(y, ", ") + " ]";
  }
  if (lx(t)) {
    var x = ms(t, f);
    return !("cause" in Error.prototype) && "cause" in t && !xg.call(t, "cause") ? "{ [" + String(t) + "] " + Tn.call(wf.call("[cause]: " + f(t.cause), x), ", ") + " }" : x.length === 0 ? "[" + String(t) + "]" : "{ [" + String(t) + "] " + Tn.call(x, ", ") + " }";
  }
  if (typeof t == "object" && s) {
    if (Cf && typeof t[Cf] == "function" && Cc)
      return Cc(t, { depth: u - r });
    if (s !== "symbol" && typeof t.inspect == "function")
      return t.inspect();
  }
  if (mx(t)) {
    var w = [];
    return gf && gf.call(t, function(V, E) {
      w.push(f(E, t, !0) + " => " + f(V, t));
    }), Rf("Map", Hs.call(t), w, d);
  }
  if (vx(t)) {
    var T = [];
    return yf && yf.call(t, function(V) {
      T.push(f(V, t));
    }), Rf("Set", Us.call(t), T, d);
  }
  if (gx(t))
    return bl("WeakMap");
  if (bx(t))
    return bl("WeakSet");
  if (yx(t))
    return bl("WeakRef");
  if (ux(t))
    return oi(f(Number(t)));
  if (fx(t))
    return oi(f(Sc.call(t)));
  if (dx(t))
    return oi(Jw.call(t));
  if (cx(t))
    return oi(f(String(t)));
  if (typeof window < "u" && t === window)
    return "{ [object Window] }";
  if (typeof globalThis < "u" && t === globalThis || typeof of < "u" && t === of)
    return "{ [object globalThis] }";
  if (!ax(t) && !Pf(t)) {
    var P = ms(t, f), I = Tf ? Tf(t) === Object.prototype : t instanceof Object || t.constructor === Object, _ = t instanceof Object ? "" : "null prototype", R = !I && Bt && Object(t) === t && Bt in t ? Du.call(yr(t), 8, -1) : _ ? "Object" : "", L = I || typeof t.constructor != "function" ? "" : t.constructor.name ? t.constructor.name + " " : "", M = L + (R || _ ? "[" + Tn.call(wf.call([], R || [], _ || []), ": ") + "] " : "");
    return P.length === 0 ? M + "{}" : d ? M + "{" + Rc(P, d) + "}" : M + "{ " + Tn.call(P, ", ") + " }";
  }
  return String(t);
};
function Tg(e, t, n) {
  var r = (n.quoteStyle || t) === "double" ? '"' : "'";
  return r + e + r;
}
function sx(e) {
  return ir.call(String(e), /"/g, "&quot;");
}
function Pc(e) {
  return yr(e) === "[object Array]" && (!Bt || !(typeof e == "object" && Bt in e));
}
function ax(e) {
  return yr(e) === "[object Date]" && (!Bt || !(typeof e == "object" && Bt in e));
}
function Pf(e) {
  return yr(e) === "[object RegExp]" && (!Bt || !(typeof e == "object" && Bt in e));
}
function lx(e) {
  return yr(e) === "[object Error]" && (!Bt || !(typeof e == "object" && Bt in e));
}
function cx(e) {
  return yr(e) === "[object String]" && (!Bt || !(typeof e == "object" && Bt in e));
}
function ux(e) {
  return yr(e) === "[object Number]" && (!Bt || !(typeof e == "object" && Bt in e));
}
function dx(e) {
  return yr(e) === "[object Boolean]" && (!Bt || !(typeof e == "object" && Bt in e));
}
function Sg(e) {
  if (Po)
    return e && typeof e == "object" && e instanceof Symbol;
  if (typeof e == "symbol")
    return !0;
  if (!e || typeof e != "object" || !Ec)
    return !1;
  try {
    return Ec.call(e), !0;
  } catch {
  }
  return !1;
}
function fx(e) {
  if (!e || typeof e != "object" || !Sc)
    return !1;
  try {
    return Sc.call(e), !0;
  } catch {
  }
  return !1;
}
var hx = Object.prototype.hasOwnProperty || function(e) {
  return e in this;
};
function nr(e, t) {
  return hx.call(e, t);
}
function yr(e) {
  return ex.call(e);
}
function px(e) {
  if (e.name)
    return e.name;
  var t = nx.call(tx.call(e), /^function\s*([\w$]+)/);
  return t ? t[1] : null;
}
function Eg(e, t) {
  if (e.indexOf)
    return e.indexOf(t);
  for (var n = 0, r = e.length; n < r; n++)
    if (e[n] === t)
      return n;
  return -1;
}
function mx(e) {
  if (!Hs || !e || typeof e != "object")
    return !1;
  try {
    Hs.call(e);
    try {
      Us.call(e);
    } catch {
      return !0;
    }
    return e instanceof Map;
  } catch {
  }
  return !1;
}
function gx(e) {
  if (!mi || !e || typeof e != "object")
    return !1;
  try {
    mi.call(e, mi);
    try {
      gi.call(e, gi);
    } catch {
      return !0;
    }
    return e instanceof WeakMap;
  } catch {
  }
  return !1;
}
function yx(e) {
  if (!vf || !e || typeof e != "object")
    return !1;
  try {
    return vf.call(e), !0;
  } catch {
  }
  return !1;
}
function vx(e) {
  if (!Us || !e || typeof e != "object")
    return !1;
  try {
    Us.call(e);
    try {
      Hs.call(e);
    } catch {
      return !0;
    }
    return e instanceof Set;
  } catch {
  }
  return !1;
}
function bx(e) {
  if (!gi || !e || typeof e != "object")
    return !1;
  try {
    gi.call(e, gi);
    try {
      mi.call(e, mi);
    } catch {
      return !0;
    }
    return e instanceof WeakSet;
  } catch {
  }
  return !1;
}
function wx(e) {
  return !e || typeof e != "object" ? !1 : typeof HTMLElement < "u" && e instanceof HTMLElement ? !0 : typeof e.nodeName == "string" && typeof e.getAttribute == "function";
}
function Cg(e, t) {
  if (e.length > t.maxStringLength) {
    var n = e.length - t.maxStringLength, r = "... " + n + " more character" + (n > 1 ? "s" : "");
    return Cg(Du.call(e, 0, t.maxStringLength), t) + r;
  }
  var o = ir.call(ir.call(e, /(['\\])/g, "\\$1"), /[\x00-\x1f]/g, xx);
  return Tg(o, "single", t);
}
function xx(e) {
  var t = e.charCodeAt(0), n = {
    8: "b",
    9: "t",
    10: "n",
    12: "f",
    13: "r"
  }[t];
  return n ? "\\" + n : "\\x" + (t < 16 ? "0" : "") + rx.call(t.toString(16));
}
function oi(e) {
  return "Object(" + e + ")";
}
function bl(e) {
  return e + " { ? }";
}
function Rf(e, t, n, r) {
  var o = r ? Rc(n, r) : Tn.call(n, ", ");
  return e + " (" + t + ") {" + o + "}";
}
function Tx(e) {
  for (var t = 0; t < e.length; t++)
    if (Eg(e[t], `
`) >= 0)
      return !1;
  return !0;
}
function Sx(e, t) {
  var n;
  if (e.indent === "	")
    n = "	";
  else if (typeof e.indent == "number" && e.indent > 0)
    n = Tn.call(Array(e.indent + 1), " ");
  else
    return null;
  return {
    base: n,
    prev: Tn.call(Array(t + 1), n)
  };
}
function Rc(e, t) {
  if (e.length === 0)
    return "";
  var n = `
` + t.prev + t.base;
  return n + Tn.call(e, "," + n) + `
` + t.prev;
}
function ms(e, t) {
  var n = Pc(e), r = [];
  if (n) {
    r.length = e.length;
    for (var o = 0; o < e.length; o++)
      r[o] = nr(e, o) ? t(e[o], e) : "";
  }
  var i = typeof vl == "function" ? vl(e) : [], s;
  if (Po) {
    s = {};
    for (var a = 0; a < i.length; a++)
      s["$" + i[a]] = i[a];
  }
  for (var l in e)
    nr(e, l) && (n && String(Number(l)) === l && l < e.length || Po && s["$" + l] instanceof Symbol || (wg.call(/[^\w$]/, l) ? r.push(t(l, e) + ": " + t(e[l], e)) : r.push(l + ": " + t(e[l], e))));
  if (typeof vl == "function")
    for (var c = 0; c < i.length; c++)
      xg.call(e, i[c]) && r.push("[" + t(i[c]) + "]: " + t(e[i[c]], e));
  return r;
}
var Pg = Ho, Uo = Gw, Ex = ix, Cx = Ki, gs = Pg("%WeakMap%", !0), ys = Pg("%Map%", !0), Px = Uo("WeakMap.prototype.get", !0), Rx = Uo("WeakMap.prototype.set", !0), kx = Uo("WeakMap.prototype.has", !0), Ox = Uo("Map.prototype.get", !0), Ix = Uo("Map.prototype.set", !0), _x = Uo("Map.prototype.has", !0), Mu = function(e, t) {
  for (var n = e, r; (r = n.next) !== null; n = r)
    if (r.key === t)
      return n.next = r.next, r.next = /** @type {NonNullable<typeof list.next>} */
      e.next, e.next = r, r;
}, Ax = function(e, t) {
  var n = Mu(e, t);
  return n && n.value;
}, Dx = function(e, t, n) {
  var r = Mu(e, t);
  r ? r.value = n : e.next = /** @type {import('.').ListNode<typeof value>} */
  {
    // eslint-disable-line no-param-reassign, no-extra-parens
    key: t,
    next: e.next,
    value: n
  };
}, Mx = function(e, t) {
  return !!Mu(e, t);
}, Nx = function() {
  var t, n, r, o = {
    assert: function(i) {
      if (!o.has(i))
        throw new Cx("Side channel does not contain " + Ex(i));
    },
    get: function(i) {
      if (gs && i && (typeof i == "object" || typeof i == "function")) {
        if (t)
          return Px(t, i);
      } else if (ys) {
        if (n)
          return Ox(n, i);
      } else if (r)
        return Ax(r, i);
    },
    has: function(i) {
      if (gs && i && (typeof i == "object" || typeof i == "function")) {
        if (t)
          return kx(t, i);
      } else if (ys) {
        if (n)
          return _x(n, i);
      } else if (r)
        return Mx(r, i);
      return !1;
    },
    set: function(i, s) {
      gs && i && (typeof i == "object" || typeof i == "function") ? (t || (t = new gs()), Rx(t, i, s)) : ys ? (n || (n = new ys()), Ix(n, i, s)) : (r || (r = { key: {}, next: null }), Dx(r, i, s));
    }
  };
  return o;
}, Fx = String.prototype.replace, Lx = /%20/g, wl = {
  RFC1738: "RFC1738",
  RFC3986: "RFC3986"
}, Rg = {
  default: wl.RFC3986,
  formatters: {
    RFC1738: function(e) {
      return Fx.call(e, Lx, "+");
    },
    RFC3986: function(e) {
      return String(e);
    }
  },
  RFC1738: wl.RFC1738,
  RFC3986: wl.RFC3986
}, Vx = Rg, xl = Object.prototype.hasOwnProperty, Nr = Array.isArray, vn = function() {
  for (var e = [], t = 0; t < 256; ++t)
    e.push("%" + ((t < 16 ? "0" : "") + t.toString(16)).toUpperCase());
  return e;
}(), $x = function(t) {
  for (; t.length > 1; ) {
    var n = t.pop(), r = n.obj[n.prop];
    if (Nr(r)) {
      for (var o = [], i = 0; i < r.length; ++i)
        typeof r[i] < "u" && o.push(r[i]);
      n.obj[n.prop] = o;
    }
  }
}, kg = function(t, n) {
  for (var r = n && n.plainObjects ? /* @__PURE__ */ Object.create(null) : {}, o = 0; o < t.length; ++o)
    typeof t[o] < "u" && (r[o] = t[o]);
  return r;
}, jx = function e(t, n, r) {
  if (!n)
    return t;
  if (typeof n != "object") {
    if (Nr(t))
      t.push(n);
    else if (t && typeof t == "object")
      (r && (r.plainObjects || r.allowPrototypes) || !xl.call(Object.prototype, n)) && (t[n] = !0);
    else
      return [t, n];
    return t;
  }
  if (!t || typeof t != "object")
    return [t].concat(n);
  var o = t;
  return Nr(t) && !Nr(n) && (o = kg(t, r)), Nr(t) && Nr(n) ? (n.forEach(function(i, s) {
    if (xl.call(t, s)) {
      var a = t[s];
      a && typeof a == "object" && i && typeof i == "object" ? t[s] = e(a, i, r) : t.push(i);
    } else
      t[s] = i;
  }), t) : Object.keys(n).reduce(function(i, s) {
    var a = n[s];
    return xl.call(i, s) ? i[s] = e(i[s], a, r) : i[s] = a, i;
  }, o);
}, Bx = function(t, n) {
  return Object.keys(n).reduce(function(r, o) {
    return r[o] = n[o], r;
  }, t);
}, zx = function(e, t, n) {
  var r = e.replace(/\+/g, " ");
  if (n === "iso-8859-1")
    return r.replace(/%[0-9a-f]{2}/gi, unescape);
  try {
    return decodeURIComponent(r);
  } catch {
    return r;
  }
}, Wx = function(t, n, r, o, i) {
  if (t.length === 0)
    return t;
  var s = t;
  if (typeof t == "symbol" ? s = Symbol.prototype.toString.call(t) : typeof t != "string" && (s = String(t)), r === "iso-8859-1")
    return escape(s).replace(/%u[0-9a-f]{4}/gi, function(u) {
      return "%26%23" + parseInt(u.slice(2), 16) + "%3B";
    });
  for (var a = "", l = 0; l < s.length; ++l) {
    var c = s.charCodeAt(l);
    if (c === 45 || c === 46 || c === 95 || c === 126 || c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || i === Vx.RFC1738 && (c === 40 || c === 41)) {
      a += s.charAt(l);
      continue;
    }
    if (c < 128) {
      a = a + vn[c];
      continue;
    }
    if (c < 2048) {
      a = a + (vn[192 | c >> 6] + vn[128 | c & 63]);
      continue;
    }
    if (c < 55296 || c >= 57344) {
      a = a + (vn[224 | c >> 12] + vn[128 | c >> 6 & 63] + vn[128 | c & 63]);
      continue;
    }
    l += 1, c = 65536 + ((c & 1023) << 10 | s.charCodeAt(l) & 1023), a += vn[240 | c >> 18] + vn[128 | c >> 12 & 63] + vn[128 | c >> 6 & 63] + vn[128 | c & 63];
  }
  return a;
}, Hx = function(t) {
  for (var n = [{ obj: { o: t }, prop: "o" }], r = [], o = 0; o < n.length; ++o)
    for (var i = n[o], s = i.obj[i.prop], a = Object.keys(s), l = 0; l < a.length; ++l) {
      var c = a[l], u = s[c];
      typeof u == "object" && u !== null && r.indexOf(u) === -1 && (n.push({ obj: s, prop: c }), r.push(u));
    }
  return $x(n), t;
}, Ux = function(t) {
  return Object.prototype.toString.call(t) === "[object RegExp]";
}, Gx = function(t) {
  return !t || typeof t != "object" ? !1 : !!(t.constructor && t.constructor.isBuffer && t.constructor.isBuffer(t));
}, Yx = function(t, n) {
  return [].concat(t, n);
}, qx = function(t, n) {
  if (Nr(t)) {
    for (var r = [], o = 0; o < t.length; o += 1)
      r.push(n(t[o]));
    return r;
  }
  return n(t);
}, Og = {
  arrayToObject: kg,
  assign: Bx,
  combine: Yx,
  compact: Hx,
  decode: zx,
  encode: Wx,
  isBuffer: Gx,
  isRegExp: Ux,
  maybeMap: qx,
  merge: jx
}, Kx = Og, Ig = Rg, Zx = Date.prototype.toISOString, kf = Ig.default;
Kx.encode, Ig.formatters[kf];
var Xx = Og;
Xx.decode;
var Of = (e) => Array.isArray(e), Tl = (e) => e === void 0, Sl = (e) => e === null, Qx = Function.bind.call(Function.call, Object.prototype.toString), Jx = (e) => !!e && Qx(e) === "[object Error]" || e instanceof Error, _g = (e, t) => e instanceof t, e1 = (e) => {
  const t = typeof e;
  return t === "undefined" || t === null || t === "number" || t === "string" || t === "boolean" || t === "bigint";
}, t1 = (e) => Object.prototype.toString.call(e) === "[object Date]" && _g(e, Date), Bn = {
  array: Of,
  date: t1,
  empty: (e) => Sl(e) || Tl(e) ? !0 : typeof e == "object" ? Object.keys(e).length === 0 : typeof e == "string" ? e === "" : Array.isArray(e) ? e.length === 0 : Number.isNaN(e),
  function: (e) => typeof e == "function",
  instance: _g,
  isError: Jx,
  keyof: (e, t) => Object.prototype.hasOwnProperty.call(e, t),
  nan: (e) => Number.isNaN(e),
  nil: (e) => Sl(e) || Tl(e),
  null: Sl,
  number: (e) => typeof e == "number" || !Number.isNaN(e),
  object: (e) => !Of(e) && typeof e == "object",
  primitive: e1,
  string: (e) => typeof e == "string",
  undefined: Tl
}, kc = (e, t, n) => {
  const [r, ...o] = t;
  if (o.length > 0) {
    if (!e[r]) {
      const i = `${+o[0]}` === o[0];
      e[r] = i ? [] : {};
    }
    if (typeof e[r] != "object") {
      const i = `${+o[0]}` === o[0];
      e[r] = kc(i ? [] : {}, o, n);
    } else
      e[r] = kc(e[r], o, n);
  } else
    e[r] = n;
  return e;
}, n1 = (e) => Object.keys(e), r1 = (e) => e.replace("[", ".").replace("]", "").split("."), If = (e, t, n) => {
  const r = Array.isArray(t) ? t : r1(t), o = structuredClone(e);
  return kc(o, r, n), o;
};
const Nu = "-";
function o1(e) {
  const t = s1(e), {
    conflictingClassGroups: n,
    conflictingClassGroupModifiers: r
  } = e;
  function o(s) {
    const a = s.split(Nu);
    return a[0] === "" && a.length !== 1 && a.shift(), Ag(a, t) || i1(s);
  }
  function i(s, a) {
    const l = n[s] || [];
    return a && r[s] ? [...l, ...r[s]] : l;
  }
  return {
    getClassGroupId: o,
    getConflictingClassGroupIds: i
  };
}
function Ag(e, t) {
  var s;
  if (e.length === 0)
    return t.classGroupId;
  const n = e[0], r = t.nextPart.get(n), o = r ? Ag(e.slice(1), r) : void 0;
  if (o)
    return o;
  if (t.validators.length === 0)
    return;
  const i = e.join(Nu);
  return (s = t.validators.find(({
    validator: a
  }) => a(i))) == null ? void 0 : s.classGroupId;
}
const _f = /^\[(.+)\]$/;
function i1(e) {
  if (_f.test(e)) {
    const t = _f.exec(e)[1], n = t == null ? void 0 : t.substring(0, t.indexOf(":"));
    if (n)
      return "arbitrary.." + n;
  }
}
function s1(e) {
  const {
    theme: t,
    prefix: n
  } = e, r = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return l1(Object.entries(e.classGroups), n).forEach(([i, s]) => {
    Oc(s, r, i, t);
  }), r;
}
function Oc(e, t, n, r) {
  e.forEach((o) => {
    if (typeof o == "string") {
      const i = o === "" ? t : Af(t, o);
      i.classGroupId = n;
      return;
    }
    if (typeof o == "function") {
      if (a1(o)) {
        Oc(o(r), t, n, r);
        return;
      }
      t.validators.push({
        validator: o,
        classGroupId: n
      });
      return;
    }
    Object.entries(o).forEach(([i, s]) => {
      Oc(s, Af(t, i), n, r);
    });
  });
}
function Af(e, t) {
  let n = e;
  return t.split(Nu).forEach((r) => {
    n.nextPart.has(r) || n.nextPart.set(r, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), n = n.nextPart.get(r);
  }), n;
}
function a1(e) {
  return e.isThemeGetter;
}
function l1(e, t) {
  return t ? e.map(([n, r]) => {
    const o = r.map((i) => typeof i == "string" ? t + i : typeof i == "object" ? Object.fromEntries(Object.entries(i).map(([s, a]) => [t + s, a])) : i);
    return [n, o];
  }) : e;
}
function c1(e) {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let t = 0, n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
  function o(i, s) {
    n.set(i, s), t++, t > e && (t = 0, r = n, n = /* @__PURE__ */ new Map());
  }
  return {
    get(i) {
      let s = n.get(i);
      if (s !== void 0)
        return s;
      if ((s = r.get(i)) !== void 0)
        return o(i, s), s;
    },
    set(i, s) {
      n.has(i) ? n.set(i, s) : o(i, s);
    }
  };
}
const Dg = "!";
function u1(e) {
  const {
    separator: t,
    experimentalParseClassName: n
  } = e, r = t.length === 1, o = t[0], i = t.length;
  function s(a) {
    const l = [];
    let c = 0, u = 0, d;
    for (let g = 0; g < a.length; g++) {
      let v = a[g];
      if (c === 0) {
        if (v === o && (r || a.slice(g, g + i) === t)) {
          l.push(a.slice(u, g)), u = g + i;
          continue;
        }
        if (v === "/") {
          d = g;
          continue;
        }
      }
      v === "[" ? c++ : v === "]" && c--;
    }
    const f = l.length === 0 ? a : a.substring(u), h = f.startsWith(Dg), p = h ? f.substring(1) : f, m = d && d > u ? d - u : void 0;
    return {
      modifiers: l,
      hasImportantModifier: h,
      baseClassName: p,
      maybePostfixModifierPosition: m
    };
  }
  return n ? function(l) {
    return n({
      className: l,
      parseClassName: s
    });
  } : s;
}
function d1(e) {
  if (e.length <= 1)
    return e;
  const t = [];
  let n = [];
  return e.forEach((r) => {
    r[0] === "[" ? (t.push(...n.sort(), r), n = []) : n.push(r);
  }), t.push(...n.sort()), t;
}
function f1(e) {
  return {
    cache: c1(e.cacheSize),
    parseClassName: u1(e),
    ...o1(e)
  };
}
const h1 = /\s+/;
function p1(e, t) {
  const {
    parseClassName: n,
    getClassGroupId: r,
    getConflictingClassGroupIds: o
  } = t, i = /* @__PURE__ */ new Set();
  return e.trim().split(h1).map((s) => {
    const {
      modifiers: a,
      hasImportantModifier: l,
      baseClassName: c,
      maybePostfixModifierPosition: u
    } = n(s);
    let d = !!u, f = r(d ? c.substring(0, u) : c);
    if (!f) {
      if (!d)
        return {
          isTailwindClass: !1,
          originalClassName: s
        };
      if (f = r(c), !f)
        return {
          isTailwindClass: !1,
          originalClassName: s
        };
      d = !1;
    }
    const h = d1(a).join(":");
    return {
      isTailwindClass: !0,
      modifierId: l ? h + Dg : h,
      classGroupId: f,
      originalClassName: s,
      hasPostfixModifier: d
    };
  }).reverse().filter((s) => {
    if (!s.isTailwindClass)
      return !0;
    const {
      modifierId: a,
      classGroupId: l,
      hasPostfixModifier: c
    } = s, u = a + l;
    return i.has(u) ? !1 : (i.add(u), o(l, c).forEach((d) => i.add(a + d)), !0);
  }).reverse().map((s) => s.originalClassName).join(" ");
}
function m1() {
  let e = 0, t, n, r = "";
  for (; e < arguments.length; )
    (t = arguments[e++]) && (n = Mg(t)) && (r && (r += " "), r += n);
  return r;
}
function Mg(e) {
  if (typeof e == "string")
    return e;
  let t, n = "";
  for (let r = 0; r < e.length; r++)
    e[r] && (t = Mg(e[r])) && (n && (n += " "), n += t);
  return n;
}
function g1(e, ...t) {
  let n, r, o, i = s;
  function s(l) {
    const c = t.reduce((u, d) => d(u), e());
    return n = f1(c), r = n.cache.get, o = n.cache.set, i = a, a(l);
  }
  function a(l) {
    const c = r(l);
    if (c)
      return c;
    const u = p1(l, n);
    return o(l, u), u;
  }
  return function() {
    return i(m1.apply(null, arguments));
  };
}
function Ze(e) {
  const t = (n) => n[e] || [];
  return t.isThemeGetter = !0, t;
}
const Ng = /^\[(?:([a-z-]+):)?(.+)\]$/i, y1 = /^\d+\/\d+$/, v1 = /* @__PURE__ */ new Set(["px", "full", "screen"]), b1 = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, w1 = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, x1 = /^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/, T1 = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, S1 = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
function Nn(e) {
  return $r(e) || v1.has(e) || y1.test(e);
}
function Qn(e) {
  return Go(e, "length", _1);
}
function $r(e) {
  return !!e && !Number.isNaN(Number(e));
}
function vs(e) {
  return Go(e, "number", $r);
}
function ii(e) {
  return !!e && Number.isInteger(Number(e));
}
function E1(e) {
  return e.endsWith("%") && $r(e.slice(0, -1));
}
function be(e) {
  return Ng.test(e);
}
function Jn(e) {
  return b1.test(e);
}
const C1 = /* @__PURE__ */ new Set(["length", "size", "percentage"]);
function P1(e) {
  return Go(e, C1, Fg);
}
function R1(e) {
  return Go(e, "position", Fg);
}
const k1 = /* @__PURE__ */ new Set(["image", "url"]);
function O1(e) {
  return Go(e, k1, D1);
}
function I1(e) {
  return Go(e, "", A1);
}
function si() {
  return !0;
}
function Go(e, t, n) {
  const r = Ng.exec(e);
  return r ? r[1] ? typeof t == "string" ? r[1] === t : t.has(r[1]) : n(r[2]) : !1;
}
function _1(e) {
  return w1.test(e) && !x1.test(e);
}
function Fg() {
  return !1;
}
function A1(e) {
  return T1.test(e);
}
function D1(e) {
  return S1.test(e);
}
function M1() {
  const e = Ze("colors"), t = Ze("spacing"), n = Ze("blur"), r = Ze("brightness"), o = Ze("borderColor"), i = Ze("borderRadius"), s = Ze("borderSpacing"), a = Ze("borderWidth"), l = Ze("contrast"), c = Ze("grayscale"), u = Ze("hueRotate"), d = Ze("invert"), f = Ze("gap"), h = Ze("gradientColorStops"), p = Ze("gradientColorStopPositions"), m = Ze("inset"), g = Ze("margin"), v = Ze("opacity"), b = Ze("padding"), y = Ze("saturate"), x = Ze("scale"), w = Ze("sepia"), T = Ze("skew"), P = Ze("space"), I = Ze("translate"), _ = () => ["auto", "contain", "none"], R = () => ["auto", "hidden", "clip", "visible", "scroll"], L = () => ["auto", be, t], M = () => [be, t], V = () => ["", Nn, Qn], E = () => ["auto", $r, be], k = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], A = () => ["solid", "dashed", "dotted", "double", "none"], N = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], H = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], Y = () => ["", "0", be], C = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], $ = () => [$r, vs], X = () => [$r, be];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [si],
      spacing: [Nn, Qn],
      blur: ["none", "", Jn, be],
      brightness: $(),
      borderColor: [e],
      borderRadius: ["none", "", "full", Jn, be],
      borderSpacing: M(),
      borderWidth: V(),
      contrast: $(),
      grayscale: Y(),
      hueRotate: X(),
      invert: Y(),
      gap: M(),
      gradientColorStops: [e],
      gradientColorStopPositions: [E1, Qn],
      inset: L(),
      margin: L(),
      opacity: $(),
      padding: M(),
      saturate: $(),
      scale: $(),
      sepia: Y(),
      skew: X(),
      space: M(),
      translate: M()
    },
    classGroups: {
      // Layout
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", "video", be]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       */
      container: ["container"],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [Jn]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": C()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": C()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: [...k(), be]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: R()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": R()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": R()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: _()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": _()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": _()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: [m]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [m]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [m]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [m]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [m]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [m]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [m]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [m]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [m]
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: ["auto", ii, be]
      }],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: L()
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["wrap", "wrap-reverse", "nowrap"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: ["1", "auto", "initial", "none", be]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: Y()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: Y()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ["first", "last", "none", ii, be]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [si]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", ii, be]
        }, be]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": E()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": E()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [si]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [ii, be]
        }, be]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": E()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": E()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": ["auto", "min", "max", "fr", be]
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ["auto", "min", "max", "fr", be]
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: [f]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": [f]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": [f]
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: ["normal", ...H()]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": ["start", "end", "center", "stretch"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", "start", "end", "center", "stretch"]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...H(), "baseline"]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", "start", "end", "center", "stretch", "baseline"]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": [...H(), "baseline"]
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", "start", "end", "center", "stretch"]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: [b]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [b]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [b]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [b]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [b]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [b]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [b]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [b]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [b]
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: [g]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [g]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [g]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [g]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [g]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [g]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [g]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [g]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [g]
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      "space-x": [{
        "space-x": [P]
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/space
       */
      "space-y": [{
        "space-y": [P]
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-y-reverse": ["space-y-reverse"],
      // Sizing
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", be, t]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [be, t, "min", "max", "fit"]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [be, t, "none", "full", "min", "max", "fit", "prose", {
          screen: [Jn]
        }, Jn]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [be, t, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": [be, t, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [be, t, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [be, t, "auto", "min", "max", "fit"]
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", Jn, Qn]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", vs]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [si]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractons"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", be]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": ["none", $r, vs]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", Nn, be]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", be]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["none", "disc", "decimal", be]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: [e]
      }],
      /**
       * Placeholder Opacity
       * @see https://tailwindcss.com/docs/placeholder-opacity
       */
      "placeholder-opacity": [{
        "placeholder-opacity": [v]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: [e]
      }],
      /**
       * Text Opacity
       * @see https://tailwindcss.com/docs/text-opacity
       */
      "text-opacity": [{
        "text-opacity": [v]
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...A(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", Nn, Qn]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", Nn, be]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: [e]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: M()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", be]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", be]
      }],
      // Backgrounds
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Opacity
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/background-opacity
       */
      "bg-opacity": [{
        "bg-opacity": [v]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: [...k(), R1]
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: ["no-repeat", {
          repeat: ["", "x", "y", "round", "space"]
        }]
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: ["auto", "cover", "contain", P1]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, O1]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: [e]
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: [p]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [p]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [p]
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: [h]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [h]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [h]
      }],
      // Borders
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: [i]
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": [i]
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": [i]
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": [i]
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": [i]
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": [i]
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": [i]
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": [i]
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": [i]
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": [i]
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": [i]
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": [i]
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": [i]
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": [i]
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": [i]
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: [a]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": [a]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": [a]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": [a]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": [a]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": [a]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": [a]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": [a]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": [a]
      }],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      "border-opacity": [{
        "border-opacity": [v]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...A(), "hidden"]
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x": [{
        "divide-x": [a]
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y": [{
        "divide-y": [a]
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Divide Opacity
       * @see https://tailwindcss.com/docs/divide-opacity
       */
      "divide-opacity": [{
        "divide-opacity": [v]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      "divide-style": [{
        divide: A()
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: [o]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": [o]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": [o]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": [o]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": [o]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": [o]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": [o]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: [o]
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: ["", ...A()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [Nn, be]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [Nn, Qn]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: [e]
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w": [{
        ring: V()
      }],
      /**
       * Ring Width Inset
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/ring-color
       */
      "ring-color": [{
        ring: [e]
      }],
      /**
       * Ring Opacity
       * @see https://tailwindcss.com/docs/ring-opacity
       */
      "ring-opacity": [{
        "ring-opacity": [v]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [Nn, Qn]
      }],
      /**
       * Ring Offset Color
       * @see https://tailwindcss.com/docs/ring-offset-color
       */
      "ring-offset-color": [{
        "ring-offset": [e]
      }],
      // Effects
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: ["", "inner", "none", Jn, I1]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [si]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [v]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...N(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": N()
      }],
      // Filters
      /**
       * Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: ["", "none"]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: [n]
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [r]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [l]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": ["", "none", Jn, be]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: [c]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [u]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [d]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [y]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [w]
      }],
      /**
       * Backdrop Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": ["", "none"]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": [n]
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [r]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [l]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": [c]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [u]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": [d]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [v]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [y]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": [w]
      }],
      // Tables
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": [s]
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": [s]
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": [s]
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // Transitions and Animation
      /**
       * Tranisition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", be]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: X()
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "in", "out", "in-out", be]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: X()
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", "spin", "ping", "pulse", "bounce", be]
      }],
      // Transforms
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: ["", "gpu", "none"]
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: [x]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [x]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [x]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [ii, be]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [I]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [I]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [T]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [T]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", be]
      }],
      // Interactivity
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: ["auto", e]
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", be]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: [e]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["none", "auto"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "y", "x", ""]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": M()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": M()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": M()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": M()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": M()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": M()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": M()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": M()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": M()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": M()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": M()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": M()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": M()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": M()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": M()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": M()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": M()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": M()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", be]
      }],
      // SVG
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: [e, "none"]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [Nn, Qn, vs]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: [e, "none"]
      }],
      // Accessibility
      /**
       * Screen Readers
       * @see https://tailwindcss.com/docs/screen-readers
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    }
  };
}
const N1 = /* @__PURE__ */ g1(M1), Lg = (...e) => (t) => {
  e.forEach((n) => {
    typeof n == "function" ? n(t) : n !== null && (n.current = t);
  });
}, oL = (e) => e.$$typeof === Symbol.for("react.forward_ref") || e.$$typeof === Symbol.for("react.fragment") ? !0 : e.$$typeof === Symbol.for("react.element"), iL = (e) => Bn.function(e), bt = (...e) => N1(K0(e)), Df = (e, t) => {
  var r;
  if (!e) return;
  if ([window.HTMLInputElement, window.HTMLSelectElement, window.HTMLTextAreaElement].indexOf(e.__proto__.constructor) > -1) {
    const o = (r = Object.getOwnPropertyDescriptor(e.__proto__, "value")) == null ? void 0 : r.set, i = new Event("input", { bubbles: !0 });
    return o == null || o.call(e, t), e.dispatchEvent(i), i;
  }
}, Xi = ut(function({ as: t, ...n }, r) {
  return /* @__PURE__ */ S(t || "span", { ...n, ref: r });
}), F1 = Ma(
  "inline-flex duration-700 enabled:hover:bg-opacity-80 data-[loading=true]:opacity-30 data-[loading=true]:animate-pulse gap-1.5 text-main-foreground border-2 border-transparent items-center justify-center align-middle cursor-pointer whitespace-nowrap font-medium transition-colors ease-in disabled:cursor-not-allowed disabled:bg-opacity-40 disabled:text-opacity-80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring ease-normal",
  {
    variants: {
      size: {
        default: "h-10 px-4 py-2",
        big: "h-12 px-6 py-4",
        small: "h-10 p-2 text-sm",
        icon: "p-1"
      },
      rounded: {
        rough: "rounded-sm",
        default: "rounded-md",
        squared: "rounded-none",
        circle: "rounded-full aspect-square"
      },
      theme: {
        raw: "",
        main: "bg-primary text-primary-foreground",
        warn: "bg-warn text-warn-foreground",
        danger: "bg-danger text-danger-foreground",
        secondary: "bg-secondary-background text-secondary-foreground disabled:text-secondary-subtle",
        success: "bg-success text-success-foreground",
        info: "bg-info text-info-foreground"
      }
    },
    defaultVariants: { theme: "main", size: "default", rounded: "default" }
  }
), Gs = ut(function({ className: t, icon: n, loading: r, theme: o, type: i = "button", size: s, rounded: a, ...l }, c) {
  const u = r || l.disabled;
  return /* @__PURE__ */ Z(
    Xi,
    {
      ...l,
      ref: c,
      type: i,
      "data-theme": o,
      "data-loading": r,
      disabled: u,
      "aria-busy": u || r,
      as: l.as ?? "button",
      onClick: u ? void 0 : l.onClick,
      className: bt(F1({ size: s, rounded: a, theme: o }), t),
      children: [
        l.children,
        n
      ]
    }
  );
}), sL = (e) => /* @__PURE__ */ S("ul", { className: "border-main-bg text-main-foreground flex w-full flex-row rounded-md border-2", children: e.buttons.map((t) => /* @__PURE__ */ S("li", { className: "flex flex-1", children: /* @__PURE__ */ S(
  "button",
  {
    ...t,
    type: t.type || "button",
    "data-active": e.active === t.name ? "true" : "false",
    className: bt(
      "flex flex-1 items-center gap-1.5 rounded-sm border-r-2 px-4 py-2 last:border-r-0",
      "cursor-pointer justify-center whitespace-nowrap align-middle font-medium",
      "focus-visible:ring-ring shadow-sm focus-visible:outline-none focus-visible:ring-2 disabled:text-opacity-80",
      "data-[active=true]:bg-main-bg text-body data-[active=true]:text-main transition-colors ease-in disabled:cursor-not-allowed disabled:bg-opacity-50"
    )
  }
) }, `button-group-${t.name}`)) }), L1 = Ma(
  "inline-flex rounded-pill gap-1.5 text-main-foreground border-2 border-transparent items-center justify-center align-middle whitespace-nowrap",
  {
    variants: {
      size: {
        icon: "p-1",
        big: "h-12 px-6 py-4",
        default: "h-8 px-4 py-2",
        small: "h-6 p-2 px-3 text-sm"
      },
      theme: {
        raw: "",
        main: "bg-primary-subtle text-primary-hover",
        warn: "bg-warn-subtle text-warn-hover",
        danger: "bg-danger-subtle text-danger-hover",
        secondary: "bg-secondary-background text-secondary-foreground",
        success: "bg-success-subtle text-success-hover",
        info: "bg-info-subtle text-info-hover",
        loading: "animate-pulse bg-disabled duration-700 opacity-70",
        disabled: "bg-disabled duration-700 opacity-70"
      }
    },
    defaultVariants: { theme: "main", size: "default" }
  }
), aL = ut(function({ className: t, icon: n, loading: r, theme: o, size: i, ...s }, a) {
  return /* @__PURE__ */ Z(Xi, { ...s, ref: a, "data-theme": o, as: s.as ?? "span", className: bt(L1({ size: i, theme: o }), t), children: [
    s.children,
    n
  ] });
}), Ro = gn({
  transformPagePoint: (e) => e,
  isStatic: !1,
  reducedMotion: "never"
}), Na = gn({}), Fa = gn(null), Fu = typeof document < "u", La = Fu ? Da : xe, Vg = gn({ strict: !1 }), Va = (e) => e.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase(), V1 = "framerAppearId", $g = "data-" + Va(V1), $1 = {
  skipAnimations: !1,
  useManualTiming: !1
};
function j1(e) {
  let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), r = !1, o = !1;
  const i = /* @__PURE__ */ new WeakSet();
  let s = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  };
  function a(c) {
    i.has(c) && (l.schedule(c), e()), c(s);
  }
  const l = {
    /**
     * Schedule a process to run on the next frame.
     */
    schedule: (c, u = !1, d = !1) => {
      const h = d && r ? t : n;
      return u && i.add(c), h.has(c) || h.add(c), c;
    },
    /**
     * Cancel the provided callback from running on the next frame.
     */
    cancel: (c) => {
      n.delete(c), i.delete(c);
    },
    /**
     * Execute all schedule callbacks.
     */
    process: (c) => {
      if (s = c, r) {
        o = !0;
        return;
      }
      r = !0, [t, n] = [n, t], n.clear(), t.forEach(a), r = !1, o && (o = !1, l.process(c));
    }
  };
  return l;
}
const bs = [
  "read",
  // Read
  "resolveKeyframes",
  // Write/Read/Write/Read
  "update",
  // Compute
  "preRender",
  // Compute
  "render",
  // Write
  "postRender"
  // Compute
], B1 = 40;
function jg(e, t) {
  let n = !1, r = !0;
  const o = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  }, i = () => n = !0, s = bs.reduce((v, b) => (v[b] = j1(i), v), {}), { read: a, resolveKeyframes: l, update: c, preRender: u, render: d, postRender: f } = s, h = () => {
    const v = performance.now();
    n = !1, o.delta = r ? 1e3 / 60 : Math.max(Math.min(v - o.timestamp, B1), 1), o.timestamp = v, o.isProcessing = !0, a.process(o), l.process(o), c.process(o), u.process(o), d.process(o), f.process(o), o.isProcessing = !1, n && t && (r = !1, e(h));
  }, p = () => {
    n = !0, r = !0, o.isProcessing || e(h);
  };
  return { schedule: bs.reduce((v, b) => {
    const y = s[b];
    return v[b] = (x, w = !1, T = !1) => (n || p(), y.schedule(x, w, T)), v;
  }, {}), cancel: (v) => {
    for (let b = 0; b < bs.length; b++)
      s[bs[b]].cancel(v);
  }, state: o, steps: s };
}
const { schedule: Lu, cancel: lL } = jg(queueMicrotask, !1);
function ho(e) {
  return e && typeof e == "object" && Object.prototype.hasOwnProperty.call(e, "current");
}
const Bg = gn({});
let Mf = !1;
function z1(e, t, n, r, o) {
  const { visualElement: i } = Qe(Na), s = Qe(Vg), a = Qe(Fa), l = Qe(Ro).reducedMotion, c = ye();
  r = r || s.renderer, !c.current && r && (c.current = r(e, {
    visualState: t,
    parent: i,
    props: n,
    presenceContext: a,
    blockInitialAnimation: a ? a.initial === !1 : !1,
    reducedMotionConfig: l
  }));
  const u = c.current, d = Qe(Bg);
  u && !u.projection && o && (u.type === "html" || u.type === "svg") && H1(c.current, n, o, d), lg(() => {
    u && u.update(n, a);
  });
  const f = ye(!!(n[$g] && !window.HandoffComplete));
  return La(() => {
    u && (u.updateFeatures(), Lu.render(u.render), f.current && u.animationState && u.animationState.animateChanges());
  }), xe(() => {
    u && (!f.current && u.animationState && u.animationState.animateChanges(), f.current && (f.current = !1, Mf || (Mf = !0, queueMicrotask(W1))));
  }), u;
}
function W1() {
  window.HandoffComplete = !0;
}
function H1(e, t, n, r) {
  const { layoutId: o, layout: i, drag: s, dragConstraints: a, layoutScroll: l, layoutRoot: c } = t;
  e.projection = new n(e.latestValues, t["data-framer-portal-id"] ? void 0 : zg(e.parent)), e.projection.setOptions({
    layoutId: o,
    layout: i,
    alwaysMeasureLayout: !!s || a && ho(a),
    visualElement: e,
    scheduleRender: () => e.scheduleRender(),
    /**
     * TODO: Update options in an effect. This could be tricky as it'll be too late
     * to update by the time layout animations run.
     * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
     * ensuring it gets called if there's no potential layout animations.
     *
     */
    animationType: typeof i == "string" ? i : "both",
    initialPromotionConfig: r,
    layoutScroll: l,
    layoutRoot: c
  });
}
function zg(e) {
  if (e)
    return e.options.allowProjection !== !1 ? e.projection : zg(e.parent);
}
function U1(e, t, n) {
  return Et(
    (r) => {
      r && e.mount && e.mount(r), t && (r ? t.mount(r) : t.unmount()), n && (typeof n == "function" ? n(r) : ho(n) && (n.current = r));
    },
    /**
     * Only pass a new ref callback to React if we've received a visual element
     * factory. Otherwise we'll be mounting/remounting every time externalRef
     * or other dependencies change.
     */
    [t]
  );
}
function Ii(e) {
  return typeof e == "string" || Array.isArray(e);
}
function _i(e) {
  return e !== null && typeof e == "object" && typeof e.start == "function";
}
const Vu = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
], $u = ["initial", ...Vu];
function $a(e) {
  return _i(e.animate) || $u.some((t) => Ii(e[t]));
}
function Wg(e) {
  return !!($a(e) || e.variants);
}
function G1(e, t) {
  if ($a(e)) {
    const { initial: n, animate: r } = e;
    return {
      initial: n === !1 || Ii(n) ? n : void 0,
      animate: Ii(r) ? r : void 0
    };
  }
  return e.inherit !== !1 ? t : {};
}
function Y1(e) {
  const { initial: t, animate: n } = G1(e, Qe(Na));
  return Ue(() => ({ initial: t, animate: n }), [Nf(t), Nf(n)]);
}
function Nf(e) {
  return Array.isArray(e) ? e.join(" ") : e;
}
const Ff = {
  animation: [
    "animate",
    "variants",
    "whileHover",
    "whileTap",
    "exit",
    "whileInView",
    "whileFocus",
    "whileDrag"
  ],
  exit: ["exit"],
  drag: ["drag", "dragControls"],
  focus: ["whileFocus"],
  hover: ["whileHover", "onHoverStart", "onHoverEnd"],
  tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
  pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
  inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
  layout: ["layout", "layoutId"]
}, ko = {};
for (const e in Ff)
  ko[e] = {
    isEnabled: (t) => Ff[e].some((n) => !!t[n])
  };
function q1(e) {
  for (const t in e)
    ko[t] = {
      ...ko[t],
      ...e[t]
    };
}
const Ai = gn({}), K1 = Symbol.for("motionComponentSymbol"), Mt = (e) => e;
let Yo = Mt, hn = Mt;
process.env.NODE_ENV !== "production" && (Yo = (e, t) => {
  !e && typeof console < "u" && console.warn(t);
}, hn = (e, t) => {
  if (!e)
    throw new Error(t);
});
function Z1({ preloadedFeatures: e, createVisualElement: t, useRender: n, useVisualState: r, Component: o }) {
  e && q1(e);
  function i(a, l) {
    let c;
    const u = {
      ...Qe(Ro),
      ...a,
      layoutId: X1(a)
    }, { isStatic: d } = u, f = Y1(a), h = r(a, d);
    if (!d && Fu) {
      Q1(u, e);
      const p = J1(u);
      c = p.MeasureLayout, f.visualElement = z1(o, h, u, t, p.ProjectionNode);
    }
    return Z(Na.Provider, { value: f, children: [c && f.visualElement ? S(c, { visualElement: f.visualElement, ...u }) : null, n(o, a, U1(h, f.visualElement, l), h, d, f.visualElement)] });
  }
  const s = ut(i);
  return s[K1] = o, s;
}
function X1({ layoutId: e }) {
  const t = Qe(Ai).id;
  return t && e !== void 0 ? t + "-" + e : e;
}
function Q1(e, t) {
  const n = Qe(Vg).strict;
  if (process.env.NODE_ENV !== "production" && t && n) {
    const r = "You have rendered a `motion` component within a `LazyMotion` component. This will break tree shaking. Import and render a `m` component instead.";
    e.ignoreStrict ? Yo(!1, r) : hn(!1, r);
  }
}
function J1(e) {
  const { drag: t, layout: n } = ko;
  if (!t && !n)
    return {};
  const r = { ...t, ...n };
  return {
    MeasureLayout: t != null && t.isEnabled(e) || n != null && n.isEnabled(e) ? r.MeasureLayout : void 0,
    ProjectionNode: r.ProjectionNode
  };
}
function eT(e) {
  function t(r, o = {}) {
    return Z1(e(r, o));
  }
  if (typeof Proxy > "u")
    return t;
  const n = /* @__PURE__ */ new Map();
  return new Proxy(t, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (r, o) => (n.has(o) || n.set(o, t(o)), n.get(o))
  });
}
const tT = [
  "animate",
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "image",
  "line",
  "filter",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "switch",
  "symbol",
  "svg",
  "text",
  "tspan",
  "use",
  "view"
];
function ju(e) {
  return (
    /**
     * If it's not a string, it's a custom React component. Currently we only support
     * HTML custom React components.
     */
    typeof e != "string" || /**
     * If it contains a dash, the element is a custom HTML webcomponent.
     */
    e.includes("-") ? !1 : (
      /**
       * If it's in our list of lowercase SVG tags, it's an SVG component
       */
      !!(tT.indexOf(e) > -1 || /**
       * If it contains a capital letter, it's an SVG component
       */
      /[A-Z]/u.test(e))
    )
  );
}
const Ys = {};
function nT(e) {
  Object.assign(Ys, e);
}
const Qi = [
  "transformPerspective",
  "x",
  "y",
  "z",
  "translateX",
  "translateY",
  "translateZ",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skew",
  "skewX",
  "skewY"
], vr = new Set(Qi);
function Hg(e, { layout: t, layoutId: n }) {
  return vr.has(e) || e.startsWith("origin") || (t || n !== void 0) && (!!Ys[e] || e === "opacity");
}
const Dt = (e) => !!(e && e.getVelocity), rT = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
}, oT = Qi.length;
function iT(e, t, n) {
  let r = "";
  for (let o = 0; o < oT; o++) {
    const i = Qi[o];
    if (e[i] !== void 0) {
      const s = rT[i] || i;
      r += `${s}(${e[i]}) `;
    }
  }
  return r = r.trim(), n ? r = n(e, t ? "" : r) : t && (r = "none"), r;
}
const Ug = (e) => (t) => typeof t == "string" && t.startsWith(e), Gg = Ug("--"), sT = Ug("var(--"), Bu = (e) => sT(e) ? aT.test(e.split("/*")[0].trim()) : !1, aT = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu, lT = (e, t) => t && typeof e == "number" ? t.transform(e) : e, ur = (e, t, n) => n > t ? t : n < e ? e : n, qo = {
  test: (e) => typeof e == "number",
  parse: parseFloat,
  transform: (e) => e
}, yi = {
  ...qo,
  transform: (e) => ur(0, 1, e)
}, ws = {
  ...qo,
  default: 1
}, vi = (e) => Math.round(e * 1e5) / 1e5, zu = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu, cT = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu, uT = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu;
function Ji(e) {
  return typeof e == "string";
}
function dT(e) {
  return e == null;
}
const es = (e) => ({
  test: (t) => Ji(t) && t.endsWith(e) && t.split(" ").length === 1,
  parse: parseFloat,
  transform: (t) => `${t}${e}`
}), tr = es("deg"), kn = es("%"), fe = es("px"), fT = es("vh"), hT = es("vw"), Lf = {
  ...kn,
  parse: (e) => kn.parse(e) / 100,
  transform: (e) => kn.transform(e * 100)
}, Vf = {
  ...qo,
  transform: Math.round
}, Yg = {
  // Border props
  borderWidth: fe,
  borderTopWidth: fe,
  borderRightWidth: fe,
  borderBottomWidth: fe,
  borderLeftWidth: fe,
  borderRadius: fe,
  radius: fe,
  borderTopLeftRadius: fe,
  borderTopRightRadius: fe,
  borderBottomRightRadius: fe,
  borderBottomLeftRadius: fe,
  // Positioning props
  width: fe,
  maxWidth: fe,
  height: fe,
  maxHeight: fe,
  size: fe,
  top: fe,
  right: fe,
  bottom: fe,
  left: fe,
  // Spacing props
  padding: fe,
  paddingTop: fe,
  paddingRight: fe,
  paddingBottom: fe,
  paddingLeft: fe,
  margin: fe,
  marginTop: fe,
  marginRight: fe,
  marginBottom: fe,
  marginLeft: fe,
  // Transform props
  rotate: tr,
  rotateX: tr,
  rotateY: tr,
  rotateZ: tr,
  scale: ws,
  scaleX: ws,
  scaleY: ws,
  scaleZ: ws,
  skew: tr,
  skewX: tr,
  skewY: tr,
  distance: fe,
  translateX: fe,
  translateY: fe,
  translateZ: fe,
  x: fe,
  y: fe,
  z: fe,
  perspective: fe,
  transformPerspective: fe,
  opacity: yi,
  originX: Lf,
  originY: Lf,
  originZ: fe,
  // Misc
  zIndex: Vf,
  backgroundPositionX: fe,
  backgroundPositionY: fe,
  // SVG
  fillOpacity: yi,
  strokeOpacity: yi,
  numOctaves: Vf
};
function Wu(e, t, n) {
  const { style: r, vars: o, transform: i, transformOrigin: s } = e;
  let a = !1, l = !1, c = !0;
  for (const u in t) {
    const d = t[u];
    if (Gg(u)) {
      o[u] = d;
      continue;
    }
    const f = Yg[u], h = lT(d, f);
    if (vr.has(u)) {
      if (a = !0, i[u] = h, !c)
        continue;
      d !== (f.default || 0) && (c = !1);
    } else u.startsWith("origin") ? (l = !0, s[u] = h) : r[u] = h;
  }
  if (t.transform || (a || n ? r.transform = iT(e.transform, c, n) : r.transform && (r.transform = "none")), l) {
    const { originX: u = "50%", originY: d = "50%", originZ: f = 0 } = s;
    r.transformOrigin = `${u} ${d} ${f}`;
  }
}
const Hu = () => ({
  style: {},
  transform: {},
  transformOrigin: {},
  vars: {}
});
function qg(e, t, n) {
  for (const r in t)
    !Dt(t[r]) && !Hg(r, n) && (e[r] = t[r]);
}
function pT({ transformTemplate: e }, t) {
  return Ue(() => {
    const n = Hu();
    return Wu(n, t, e), Object.assign({}, n.vars, n.style);
  }, [t]);
}
function mT(e, t) {
  const n = e.style || {}, r = {};
  return qg(r, n, e), Object.assign(r, pT(e, t)), r;
}
function gT(e, t) {
  const n = {}, r = mT(e, t);
  return e.drag && e.dragListener !== !1 && (n.draggable = !1, r.userSelect = r.WebkitUserSelect = r.WebkitTouchCallout = "none", r.touchAction = e.drag === !0 ? "none" : `pan-${e.drag === "x" ? "y" : "x"}`), e.tabIndex === void 0 && (e.onTap || e.onTapStart || e.whileTap) && (n.tabIndex = 0), n.style = r, n;
}
const yT = /* @__PURE__ */ new Set([
  "animate",
  "exit",
  "variants",
  "initial",
  "style",
  "values",
  "variants",
  "transition",
  "transformTemplate",
  "custom",
  "inherit",
  "onBeforeLayoutMeasure",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onDragStart",
  "onDrag",
  "onDragEnd",
  "onMeasureDragConstraints",
  "onDirectionLock",
  "onDragTransitionEnd",
  "_dragX",
  "_dragY",
  "onHoverStart",
  "onHoverEnd",
  "onViewportEnter",
  "onViewportLeave",
  "globalTapTarget",
  "ignoreStrict",
  "viewport"
]);
function qs(e) {
  return e.startsWith("while") || e.startsWith("drag") && e !== "draggable" || e.startsWith("layout") || e.startsWith("onTap") || e.startsWith("onPan") || e.startsWith("onLayout") || yT.has(e);
}
let Kg = (e) => !qs(e);
function Zg(e) {
  e && (Kg = (t) => t.startsWith("on") ? !qs(t) : e(t));
}
try {
  Zg(require("@emotion/is-prop-valid").default);
} catch {
}
function vT(e, t, n) {
  const r = {};
  for (const o in e)
    o === "values" && typeof e.values == "object" || (Kg(o) || n === !0 && qs(o) || !t && !qs(o) || // If trying to use native HTML drag events, forward drag listeners
    e.draggable && o.startsWith("onDrag")) && (r[o] = e[o]);
  return r;
}
function $f(e, t, n) {
  return typeof e == "string" ? e : fe.transform(t + n * e);
}
function bT(e, t, n) {
  const r = $f(t, e.x, e.width), o = $f(n, e.y, e.height);
  return `${r} ${o}`;
}
const wT = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
}, xT = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function TT(e, t, n = 1, r = 0, o = !0) {
  e.pathLength = 1;
  const i = o ? wT : xT;
  e[i.offset] = fe.transform(-r);
  const s = fe.transform(t), a = fe.transform(n);
  e[i.array] = `${s} ${a}`;
}
function Uu(e, {
  attrX: t,
  attrY: n,
  attrScale: r,
  originX: o,
  originY: i,
  pathLength: s,
  pathSpacing: a = 1,
  pathOffset: l = 0,
  // This is object creation, which we try to avoid per-frame.
  ...c
}, u, d) {
  if (Wu(e, c, d), u) {
    e.style.viewBox && (e.attrs.viewBox = e.style.viewBox);
    return;
  }
  e.attrs = e.style, e.style = {};
  const { attrs: f, style: h, dimensions: p } = e;
  f.transform && (p && (h.transform = f.transform), delete f.transform), p && (o !== void 0 || i !== void 0 || h.transform) && (h.transformOrigin = bT(p, o !== void 0 ? o : 0.5, i !== void 0 ? i : 0.5)), t !== void 0 && (f.x = t), n !== void 0 && (f.y = n), r !== void 0 && (f.scale = r), s !== void 0 && TT(f, s, a, l, !1);
}
const Xg = () => ({
  ...Hu(),
  attrs: {}
}), Gu = (e) => typeof e == "string" && e.toLowerCase() === "svg";
function ST(e, t, n, r) {
  const o = Ue(() => {
    const i = Xg();
    return Uu(i, t, Gu(r), e.transformTemplate), {
      ...i.attrs,
      style: { ...i.style }
    };
  }, [t]);
  if (e.style) {
    const i = {};
    qg(i, e.style, e), o.style = { ...i, ...o.style };
  }
  return o;
}
function ET(e = !1) {
  return (n, r, o, { latestValues: i }, s) => {
    const l = (ju(n) ? ST : gT)(r, i, s, n), c = vT(r, typeof n == "string", e), u = n !== it ? { ...c, ...l, ref: o } : {}, { children: d } = r, f = Ue(() => Dt(d) ? d.get() : d, [d]);
    return Eo(n, {
      ...u,
      children: f
    });
  };
}
function Qg(e, { style: t, vars: n }, r, o) {
  Object.assign(e.style, t, o && o.getProjectionStyles(r));
  for (const i in n)
    e.style.setProperty(i, n[i]);
}
const Jg = /* @__PURE__ */ new Set([
  "baseFrequency",
  "diffuseConstant",
  "kernelMatrix",
  "kernelUnitLength",
  "keySplines",
  "keyTimes",
  "limitingConeAngle",
  "markerHeight",
  "markerWidth",
  "numOctaves",
  "targetX",
  "targetY",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "stdDeviation",
  "tableValues",
  "viewBox",
  "gradientTransform",
  "pathLength",
  "startOffset",
  "textLength",
  "lengthAdjust"
]);
function ey(e, t, n, r) {
  Qg(e, t, void 0, r);
  for (const o in t.attrs)
    e.setAttribute(Jg.has(o) ? o : Va(o), t.attrs[o]);
}
function Yu(e, t, n) {
  var r;
  const { style: o } = e, i = {};
  for (const s in o)
    (Dt(o[s]) || t.style && Dt(t.style[s]) || Hg(s, e) || ((r = n == null ? void 0 : n.getValue(s)) === null || r === void 0 ? void 0 : r.liveStyle) !== void 0) && (i[s] = o[s]);
  return n && o && typeof o.willChange == "string" && (n.applyWillChange = !1), i;
}
function ty(e, t, n) {
  const r = Yu(e, t, n);
  for (const o in e)
    if (Dt(e[o]) || Dt(t[o])) {
      const i = Qi.indexOf(o) !== -1 ? "attr" + o.charAt(0).toUpperCase() + o.substring(1) : o;
      r[i] = e[o];
    }
  return r;
}
function jf(e) {
  const t = [{}, {}];
  return e == null || e.values.forEach((n, r) => {
    t[0][r] = n.get(), t[1][r] = n.getVelocity();
  }), t;
}
function qu(e, t, n, r) {
  if (typeof t == "function") {
    const [o, i] = jf(r);
    t = t(n !== void 0 ? n : e.custom, o, i);
  }
  if (typeof t == "string" && (t = e.variants && e.variants[t]), typeof t == "function") {
    const [o, i] = jf(r);
    t = t(n !== void 0 ? n : e.custom, o, i);
  }
  return t;
}
function br(e) {
  const t = ye(null);
  return t.current === null && (t.current = e()), t.current;
}
const Ic = (e) => Array.isArray(e), CT = (e) => !!(e && typeof e == "object" && e.mix && e.toValue), PT = (e) => Ic(e) ? e[e.length - 1] || 0 : e;
function _s(e) {
  const t = Dt(e) ? e.get() : e;
  return CT(t) ? t.toValue() : t;
}
const ny = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform"
  // TODO: Can be accelerated but currently disabled until https://issues.chromium.org/issues/41491098 is resolved
  // or until we implement support for linear() easing.
  // "background-color"
]);
function ry(e) {
  if (vr.has(e))
    return "transform";
  if (ny.has(e))
    return Va(e);
}
function ja(e, t) {
  e.indexOf(t) === -1 && e.push(t);
}
function Ba(e, t) {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
function RT([...e], t, n) {
  const r = t < 0 ? e.length + t : t;
  if (r >= 0 && r < e.length) {
    const o = n < 0 ? e.length + n : n, [i] = e.splice(t, 1);
    e.splice(o, 0, i);
  }
  return e;
}
function kT({ applyWillChange: e = !1, scrapeMotionValuesFromProps: t, createRenderState: n, onMount: r }, o, i, s, a) {
  const l = {
    latestValues: IT(o, i, s, a ? !1 : e, t),
    renderState: n()
  };
  return r && (l.mount = (c) => r(o, c, l)), l;
}
const oy = (e) => (t, n) => {
  const r = Qe(Na), o = Qe(Fa), i = () => kT(e, t, r, o, n);
  return n ? i() : br(i);
};
function OT(e, t) {
  const n = ry(t);
  n && ja(e, n);
}
function Bf(e, t, n) {
  const r = Array.isArray(t) ? t : [t];
  for (let o = 0; o < r.length; o++) {
    const i = qu(e, r[o]);
    if (i) {
      const { transitionEnd: s, transition: a, ...l } = i;
      n(l, s);
    }
  }
}
function IT(e, t, n, r, o) {
  var i;
  const s = {}, a = [], l = r && ((i = e.style) === null || i === void 0 ? void 0 : i.willChange) === void 0, c = o(e, {});
  for (const g in c)
    s[g] = _s(c[g]);
  let { initial: u, animate: d } = e;
  const f = $a(e), h = Wg(e);
  t && h && !f && e.inherit !== !1 && (u === void 0 && (u = t.initial), d === void 0 && (d = t.animate));
  let p = n ? n.initial === !1 : !1;
  p = p || u === !1;
  const m = p ? d : u;
  return m && typeof m != "boolean" && !_i(m) && Bf(e, m, (g, v) => {
    for (const b in g) {
      let y = g[b];
      if (Array.isArray(y)) {
        const x = p ? y.length - 1 : 0;
        y = y[x];
      }
      y !== null && (s[b] = y);
    }
    for (const b in v)
      s[b] = v[b];
  }), l && (d && u !== !1 && !_i(d) && Bf(e, d, (g) => {
    for (const v in g)
      OT(a, v);
  }), a.length && (s.willChange = a.join(","))), s;
}
const { schedule: Ne, cancel: On, state: Ot, steps: El } = jg(typeof requestAnimationFrame < "u" ? requestAnimationFrame : Mt, !0), _T = {
  useVisualState: oy({
    scrapeMotionValuesFromProps: ty,
    createRenderState: Xg,
    onMount: (e, t, { renderState: n, latestValues: r }) => {
      Ne.read(() => {
        try {
          n.dimensions = typeof t.getBBox == "function" ? t.getBBox() : t.getBoundingClientRect();
        } catch {
          n.dimensions = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
          };
        }
      }), Ne.render(() => {
        Uu(n, r, Gu(t.tagName), e.transformTemplate), ey(t, n);
      });
    }
  })
}, AT = {
  useVisualState: oy({
    applyWillChange: !0,
    scrapeMotionValuesFromProps: Yu,
    createRenderState: Hu
  })
};
function DT(e, { forwardMotionProps: t = !1 }, n, r) {
  return {
    ...ju(e) ? _T : AT,
    preloadedFeatures: n,
    useRender: ET(t),
    createVisualElement: r,
    Component: e
  };
}
function $n(e, t, n, r = { passive: !0 }) {
  return e.addEventListener(t, n, r), () => e.removeEventListener(t, n);
}
const iy = (e) => e.pointerType === "mouse" ? typeof e.button != "number" || e.button <= 0 : e.isPrimary !== !1;
function za(e, t = "page") {
  return {
    point: {
      x: e[`${t}X`],
      y: e[`${t}Y`]
    }
  };
}
const MT = (e) => (t) => iy(t) && e(t, za(t));
function zn(e, t, n, r) {
  return $n(e, t, MT(n), r);
}
const NT = (e, t) => (n) => t(e(n)), Wn = (...e) => e.reduce(NT);
function sy(e) {
  let t = null;
  return () => {
    const n = () => {
      t = null;
    };
    return t === null ? (t = e, n) : !1;
  };
}
const zf = sy("dragHorizontal"), Wf = sy("dragVertical");
function ay(e) {
  let t = !1;
  if (e === "y")
    t = Wf();
  else if (e === "x")
    t = zf();
  else {
    const n = zf(), r = Wf();
    n && r ? t = () => {
      n(), r();
    } : (n && n(), r && r());
  }
  return t;
}
function ly() {
  const e = ay(!0);
  return e ? (e(), !1) : !0;
}
class wr {
  constructor(t) {
    this.isMounted = !1, this.node = t;
  }
  update() {
  }
}
function Hf(e, t) {
  const n = t ? "pointerenter" : "pointerleave", r = t ? "onHoverStart" : "onHoverEnd", o = (i, s) => {
    if (i.pointerType === "touch" || ly())
      return;
    const a = e.getProps();
    e.animationState && a.whileHover && e.animationState.setActive("whileHover", t);
    const l = a[r];
    l && Ne.postRender(() => l(i, s));
  };
  return zn(e.current, n, o, {
    passive: !e.getProps()[r]
  });
}
class FT extends wr {
  mount() {
    this.unmount = Wn(Hf(this.node, !0), Hf(this.node, !1));
  }
  unmount() {
  }
}
class LT extends wr {
  constructor() {
    super(...arguments), this.isActive = !1;
  }
  onFocus() {
    let t = !1;
    try {
      t = this.node.current.matches(":focus-visible");
    } catch {
      t = !0;
    }
    !t || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !0), this.isActive = !0);
  }
  onBlur() {
    !this.isActive || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !1), this.isActive = !1);
  }
  mount() {
    this.unmount = Wn($n(this.node.current, "focus", () => this.onFocus()), $n(this.node.current, "blur", () => this.onBlur()));
  }
  unmount() {
  }
}
const cy = (e, t) => t ? e === t ? !0 : cy(e, t.parentElement) : !1;
function Cl(e, t) {
  if (!t)
    return;
  const n = new PointerEvent("pointer" + e);
  t(n, za(n));
}
class VT extends wr {
  constructor() {
    super(...arguments), this.removeStartListeners = Mt, this.removeEndListeners = Mt, this.removeAccessibleListeners = Mt, this.startPointerPress = (t, n) => {
      if (this.isPressing)
        return;
      this.removeEndListeners();
      const r = this.node.getProps(), i = zn(window, "pointerup", (a, l) => {
        if (!this.checkPressEnd())
          return;
        const { onTap: c, onTapCancel: u, globalTapTarget: d } = this.node.getProps(), f = !d && !cy(this.node.current, a.target) ? u : c;
        f && Ne.update(() => f(a, l));
      }, {
        passive: !(r.onTap || r.onPointerUp)
      }), s = zn(window, "pointercancel", (a, l) => this.cancelPress(a, l), {
        passive: !(r.onTapCancel || r.onPointerCancel)
      });
      this.removeEndListeners = Wn(i, s), this.startPress(t, n);
    }, this.startAccessiblePress = () => {
      const t = (i) => {
        if (i.key !== "Enter" || this.isPressing)
          return;
        const s = (a) => {
          a.key !== "Enter" || !this.checkPressEnd() || Cl("up", (l, c) => {
            const { onTap: u } = this.node.getProps();
            u && Ne.postRender(() => u(l, c));
          });
        };
        this.removeEndListeners(), this.removeEndListeners = $n(this.node.current, "keyup", s), Cl("down", (a, l) => {
          this.startPress(a, l);
        });
      }, n = $n(this.node.current, "keydown", t), r = () => {
        this.isPressing && Cl("cancel", (i, s) => this.cancelPress(i, s));
      }, o = $n(this.node.current, "blur", r);
      this.removeAccessibleListeners = Wn(n, o);
    };
  }
  startPress(t, n) {
    this.isPressing = !0;
    const { onTapStart: r, whileTap: o } = this.node.getProps();
    o && this.node.animationState && this.node.animationState.setActive("whileTap", !0), r && Ne.postRender(() => r(t, n));
  }
  checkPressEnd() {
    return this.removeEndListeners(), this.isPressing = !1, this.node.getProps().whileTap && this.node.animationState && this.node.animationState.setActive("whileTap", !1), !ly();
  }
  cancelPress(t, n) {
    if (!this.checkPressEnd())
      return;
    const { onTapCancel: r } = this.node.getProps();
    r && Ne.postRender(() => r(t, n));
  }
  mount() {
    const t = this.node.getProps(), n = zn(t.globalTapTarget ? window : this.node.current, "pointerdown", this.startPointerPress, {
      passive: !(t.onTapStart || t.onPointerStart)
    }), r = $n(this.node.current, "focus", this.startAccessiblePress);
    this.removeStartListeners = Wn(n, r);
  }
  unmount() {
    this.removeStartListeners(), this.removeEndListeners(), this.removeAccessibleListeners();
  }
}
const _c = /* @__PURE__ */ new WeakMap(), Pl = /* @__PURE__ */ new WeakMap(), $T = (e) => {
  const t = _c.get(e.target);
  t && t(e);
}, jT = (e) => {
  e.forEach($T);
};
function BT({ root: e, ...t }) {
  const n = e || document;
  Pl.has(n) || Pl.set(n, {});
  const r = Pl.get(n), o = JSON.stringify(t);
  return r[o] || (r[o] = new IntersectionObserver(jT, { root: e, ...t })), r[o];
}
function zT(e, t, n) {
  const r = BT(t);
  return _c.set(e, n), r.observe(e), () => {
    _c.delete(e), r.unobserve(e);
  };
}
const WT = {
  some: 0,
  all: 1
};
class HT extends wr {
  constructor() {
    super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
  }
  startObserver() {
    this.unmount();
    const { viewport: t = {} } = this.node.getProps(), { root: n, margin: r, amount: o = "some", once: i } = t, s = {
      root: n ? n.current : void 0,
      rootMargin: r,
      threshold: typeof o == "number" ? o : WT[o]
    }, a = (l) => {
      const { isIntersecting: c } = l;
      if (this.isInView === c || (this.isInView = c, i && !c && this.hasEnteredView))
        return;
      c && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", c);
      const { onViewportEnter: u, onViewportLeave: d } = this.node.getProps(), f = c ? u : d;
      f && f(l);
    };
    return zT(this.node.current, s, a);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver > "u")
      return;
    const { props: t, prevProps: n } = this.node;
    ["amount", "margin", "root"].some(UT(t, n)) && this.startObserver();
  }
  unmount() {
  }
}
function UT({ viewport: e = {} }, { viewport: t = {} } = {}) {
  return (n) => e[n] !== t[n];
}
const GT = {
  inView: {
    Feature: HT
  },
  tap: {
    Feature: VT
  },
  focus: {
    Feature: LT
  },
  hover: {
    Feature: FT
  }
};
function uy(e, t) {
  if (!Array.isArray(t))
    return !1;
  const n = t.length;
  if (n !== e.length)
    return !1;
  for (let r = 0; r < n; r++)
    if (t[r] !== e[r])
      return !1;
  return !0;
}
function Wa(e, t, n) {
  const r = e.getProps();
  return qu(r, t, n !== void 0 ? n : r.custom, e);
}
const Hn = (e) => e * 1e3, Un = (e) => e / 1e3, YT = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
}, qT = (e) => ({
  type: "spring",
  stiffness: 550,
  damping: e === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
}), KT = {
  type: "keyframes",
  duration: 0.8
}, ZT = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
}, XT = (e, { keyframes: t }) => t.length > 2 ? KT : vr.has(e) ? e.startsWith("scale") ? qT(t[1]) : YT : ZT;
function QT({ when: e, delay: t, delayChildren: n, staggerChildren: r, staggerDirection: o, repeat: i, repeatType: s, repeatDelay: a, from: l, elapsed: c, ...u }) {
  return !!Object.keys(u).length;
}
function Ku(e, t) {
  return e[t] || e.default || e;
}
const JT = (e) => e !== null;
function Ha(e, { repeat: t, repeatType: n = "loop" }, r) {
  const o = e.filter(JT), i = t && n !== "loop" && t % 2 === 1 ? 0 : o.length - 1;
  return !i || r === void 0 ? o[i] : r;
}
let As;
function eS() {
  As = void 0;
}
const ar = {
  now: () => (As === void 0 && ar.set(Ot.isProcessing || $1.useManualTiming ? Ot.timestamp : performance.now()), As),
  set: (e) => {
    As = e, queueMicrotask(eS);
  }
}, dy = (e) => /^0[^.\s]+$/u.test(e);
function tS(e) {
  return typeof e == "number" ? e === 0 : e !== null ? e === "none" || e === "0" || dy(e) : !0;
}
const fy = (e) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e), nS = (
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
  /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
);
function rS(e) {
  const t = nS.exec(e);
  if (!t)
    return [,];
  const [, n, r, o] = t;
  return [`--${n ?? r}`, o];
}
const oS = 4;
function hy(e, t, n = 1) {
  hn(n <= oS, `Max CSS variable fallback depth detected in property "${e}". This may indicate a circular fallback dependency.`);
  const [r, o] = rS(e);
  if (!r)
    return;
  const i = window.getComputedStyle(t).getPropertyValue(r);
  if (i) {
    const s = i.trim();
    return fy(s) ? parseFloat(s) : s;
  }
  return Bu(o) ? hy(o, t, n + 1) : o;
}
const iS = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  "x",
  "y",
  "translateX",
  "translateY"
]), Uf = (e) => e === qo || e === fe, Gf = (e, t) => parseFloat(e.split(", ")[t]), Yf = (e, t) => (n, { transform: r }) => {
  if (r === "none" || !r)
    return 0;
  const o = r.match(/^matrix3d\((.+)\)$/u);
  if (o)
    return Gf(o[1], t);
  {
    const i = r.match(/^matrix\((.+)\)$/u);
    return i ? Gf(i[1], e) : 0;
  }
}, sS = /* @__PURE__ */ new Set(["x", "y", "z"]), aS = Qi.filter((e) => !sS.has(e));
function lS(e) {
  const t = [];
  return aS.forEach((n) => {
    const r = e.getValue(n);
    r !== void 0 && (t.push([n, r.get()]), r.set(n.startsWith("scale") ? 1 : 0));
  }), t;
}
const Oo = {
  // Dimensions
  width: ({ x: e }, { paddingLeft: t = "0", paddingRight: n = "0" }) => e.max - e.min - parseFloat(t) - parseFloat(n),
  height: ({ y: e }, { paddingTop: t = "0", paddingBottom: n = "0" }) => e.max - e.min - parseFloat(t) - parseFloat(n),
  top: (e, { top: t }) => parseFloat(t),
  left: (e, { left: t }) => parseFloat(t),
  bottom: ({ y: e }, { top: t }) => parseFloat(t) + (e.max - e.min),
  right: ({ x: e }, { left: t }) => parseFloat(t) + (e.max - e.min),
  // Transform
  x: Yf(4, 13),
  y: Yf(5, 14)
};
Oo.translateX = Oo.x;
Oo.translateY = Oo.y;
const py = (e) => (t) => t.test(e), cS = {
  test: (e) => e === "auto",
  parse: (e) => e
}, my = [qo, fe, kn, tr, hT, fT, cS], qf = (e) => my.find(py(e)), Hr = /* @__PURE__ */ new Set();
let Ac = !1, Dc = !1;
function gy() {
  if (Dc) {
    const e = Array.from(Hr).filter((r) => r.needsMeasurement), t = new Set(e.map((r) => r.element)), n = /* @__PURE__ */ new Map();
    t.forEach((r) => {
      const o = lS(r);
      o.length && (n.set(r, o), r.render());
    }), e.forEach((r) => r.measureInitialState()), t.forEach((r) => {
      r.render();
      const o = n.get(r);
      o && o.forEach(([i, s]) => {
        var a;
        (a = r.getValue(i)) === null || a === void 0 || a.set(s);
      });
    }), e.forEach((r) => r.measureEndState()), e.forEach((r) => {
      r.suspendedScrollY !== void 0 && window.scrollTo(0, r.suspendedScrollY);
    });
  }
  Dc = !1, Ac = !1, Hr.forEach((e) => e.complete()), Hr.clear();
}
function yy() {
  Hr.forEach((e) => {
    e.readKeyframes(), e.needsMeasurement && (Dc = !0);
  });
}
function uS() {
  yy(), gy();
}
class Zu {
  constructor(t, n, r, o, i, s = !1) {
    this.isComplete = !1, this.isAsync = !1, this.needsMeasurement = !1, this.isScheduled = !1, this.unresolvedKeyframes = [...t], this.onComplete = n, this.name = r, this.motionValue = o, this.element = i, this.isAsync = s;
  }
  scheduleResolve() {
    this.isScheduled = !0, this.isAsync ? (Hr.add(this), Ac || (Ac = !0, Ne.read(yy), Ne.resolveKeyframes(gy))) : (this.readKeyframes(), this.complete());
  }
  readKeyframes() {
    const { unresolvedKeyframes: t, name: n, element: r, motionValue: o } = this;
    for (let i = 0; i < t.length; i++)
      if (t[i] === null)
        if (i === 0) {
          const s = o == null ? void 0 : o.get(), a = t[t.length - 1];
          if (s !== void 0)
            t[0] = s;
          else if (r && n) {
            const l = r.readValue(n, a);
            l != null && (t[0] = l);
          }
          t[0] === void 0 && (t[0] = a), o && s === void 0 && o.set(t[0]);
        } else
          t[i] = t[i - 1];
  }
  setFinalKeyframe() {
  }
  measureInitialState() {
  }
  renderEndStyles() {
  }
  measureEndState() {
  }
  complete() {
    this.isComplete = !0, this.onComplete(this.unresolvedKeyframes, this.finalKeyframe), Hr.delete(this);
  }
  cancel() {
    this.isComplete || (this.isScheduled = !1, Hr.delete(this));
  }
  resume() {
    this.isComplete || this.scheduleResolve();
  }
}
const Xu = (e, t) => (n) => !!(Ji(n) && uT.test(n) && n.startsWith(e) || t && !dT(n) && Object.prototype.hasOwnProperty.call(n, t)), vy = (e, t, n) => (r) => {
  if (!Ji(r))
    return r;
  const [o, i, s, a] = r.match(zu);
  return {
    [e]: parseFloat(o),
    [t]: parseFloat(i),
    [n]: parseFloat(s),
    alpha: a !== void 0 ? parseFloat(a) : 1
  };
}, dS = (e) => ur(0, 255, e), Rl = {
  ...qo,
  transform: (e) => Math.round(dS(e))
}, jr = {
  test: Xu("rgb", "red"),
  parse: vy("red", "green", "blue"),
  transform: ({ red: e, green: t, blue: n, alpha: r = 1 }) => "rgba(" + Rl.transform(e) + ", " + Rl.transform(t) + ", " + Rl.transform(n) + ", " + vi(yi.transform(r)) + ")"
};
function fS(e) {
  let t = "", n = "", r = "", o = "";
  return e.length > 5 ? (t = e.substring(1, 3), n = e.substring(3, 5), r = e.substring(5, 7), o = e.substring(7, 9)) : (t = e.substring(1, 2), n = e.substring(2, 3), r = e.substring(3, 4), o = e.substring(4, 5), t += t, n += n, r += r, o += o), {
    red: parseInt(t, 16),
    green: parseInt(n, 16),
    blue: parseInt(r, 16),
    alpha: o ? parseInt(o, 16) / 255 : 1
  };
}
const Mc = {
  test: Xu("#"),
  parse: fS,
  transform: jr.transform
}, po = {
  test: Xu("hsl", "hue"),
  parse: vy("hue", "saturation", "lightness"),
  transform: ({ hue: e, saturation: t, lightness: n, alpha: r = 1 }) => "hsla(" + Math.round(e) + ", " + kn.transform(vi(t)) + ", " + kn.transform(vi(n)) + ", " + vi(yi.transform(r)) + ")"
}, Lt = {
  test: (e) => jr.test(e) || Mc.test(e) || po.test(e),
  parse: (e) => jr.test(e) ? jr.parse(e) : po.test(e) ? po.parse(e) : Mc.parse(e),
  transform: (e) => Ji(e) ? e : e.hasOwnProperty("red") ? jr.transform(e) : po.transform(e)
};
function hS(e) {
  var t, n;
  return isNaN(e) && Ji(e) && (((t = e.match(zu)) === null || t === void 0 ? void 0 : t.length) || 0) + (((n = e.match(cT)) === null || n === void 0 ? void 0 : n.length) || 0) > 0;
}
const by = "number", wy = "color", pS = "var", mS = "var(", Kf = "${}", gS = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function Di(e) {
  const t = e.toString(), n = [], r = {
    color: [],
    number: [],
    var: []
  }, o = [];
  let i = 0;
  const a = t.replace(gS, (l) => (Lt.test(l) ? (r.color.push(i), o.push(wy), n.push(Lt.parse(l))) : l.startsWith(mS) ? (r.var.push(i), o.push(pS), n.push(l)) : (r.number.push(i), o.push(by), n.push(parseFloat(l))), ++i, Kf)).split(Kf);
  return { values: n, split: a, indexes: r, types: o };
}
function xy(e) {
  return Di(e).values;
}
function Ty(e) {
  const { split: t, types: n } = Di(e), r = t.length;
  return (o) => {
    let i = "";
    for (let s = 0; s < r; s++)
      if (i += t[s], o[s] !== void 0) {
        const a = n[s];
        a === by ? i += vi(o[s]) : a === wy ? i += Lt.transform(o[s]) : i += o[s];
      }
    return i;
  };
}
const yS = (e) => typeof e == "number" ? 0 : e;
function vS(e) {
  const t = xy(e);
  return Ty(e)(t.map(yS));
}
const dr = {
  test: hS,
  parse: xy,
  createTransformer: Ty,
  getAnimatableNone: vS
}, bS = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function wS(e) {
  const [t, n] = e.slice(0, -1).split("(");
  if (t === "drop-shadow")
    return e;
  const [r] = n.match(zu) || [];
  if (!r)
    return e;
  const o = n.replace(r, "");
  let i = bS.has(t) ? 1 : 0;
  return r !== n && (i *= 100), t + "(" + i + o + ")";
}
const xS = /\b([a-z-]*)\(.*?\)/gu, Nc = {
  ...dr,
  getAnimatableNone: (e) => {
    const t = e.match(xS);
    return t ? t.map(wS).join(" ") : e;
  }
}, TS = {
  ...Yg,
  // Color props
  color: Lt,
  backgroundColor: Lt,
  outlineColor: Lt,
  fill: Lt,
  stroke: Lt,
  // Border props
  borderColor: Lt,
  borderTopColor: Lt,
  borderRightColor: Lt,
  borderBottomColor: Lt,
  borderLeftColor: Lt,
  filter: Nc,
  WebkitFilter: Nc
}, Qu = (e) => TS[e];
function Sy(e, t) {
  let n = Qu(e);
  return n !== Nc && (n = dr), n.getAnimatableNone ? n.getAnimatableNone(t) : void 0;
}
const SS = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function ES(e, t, n) {
  let r = 0, o;
  for (; r < e.length && !o; ) {
    const i = e[r];
    typeof i == "string" && !SS.has(i) && Di(i).values.length && (o = e[r]), r++;
  }
  if (o && n)
    for (const i of t)
      e[i] = Sy(n, o);
}
class Ey extends Zu {
  constructor(t, n, r, o) {
    super(t, n, r, o, o == null ? void 0 : o.owner, !0);
  }
  readKeyframes() {
    const { unresolvedKeyframes: t, element: n, name: r } = this;
    if (!n.current)
      return;
    super.readKeyframes();
    for (let l = 0; l < t.length; l++) {
      let c = t[l];
      if (typeof c == "string" && (c = c.trim(), Bu(c))) {
        const u = hy(c, n.current);
        u !== void 0 && (t[l] = u), l === t.length - 1 && (this.finalKeyframe = c);
      }
    }
    if (this.resolveNoneKeyframes(), !iS.has(r) || t.length !== 2)
      return;
    const [o, i] = t, s = qf(o), a = qf(i);
    if (s !== a)
      if (Uf(s) && Uf(a))
        for (let l = 0; l < t.length; l++) {
          const c = t[l];
          typeof c == "string" && (t[l] = parseFloat(c));
        }
      else
        this.needsMeasurement = !0;
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: t, name: n } = this, r = [];
    for (let o = 0; o < t.length; o++)
      tS(t[o]) && r.push(o);
    r.length && ES(t, r, n);
  }
  measureInitialState() {
    const { element: t, unresolvedKeyframes: n, name: r } = this;
    if (!t.current)
      return;
    r === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = Oo[r](t.measureViewportBox(), window.getComputedStyle(t.current)), n[0] = this.measuredOrigin;
    const o = n[n.length - 1];
    o !== void 0 && t.getValue(r, o).jump(o, !1);
  }
  measureEndState() {
    var t;
    const { element: n, name: r, unresolvedKeyframes: o } = this;
    if (!n.current)
      return;
    const i = n.getValue(r);
    i && i.jump(this.measuredOrigin, !1);
    const s = o.length - 1, a = o[s];
    o[s] = Oo[r](n.measureViewportBox(), window.getComputedStyle(n.current)), a !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = a), !((t = this.removedTransforms) === null || t === void 0) && t.length && this.removedTransforms.forEach(([l, c]) => {
      n.getValue(l).set(c);
    }), this.resolveNoneKeyframes();
  }
}
function Cy(e) {
  let t;
  return () => (t === void 0 && (t = e()), t);
}
const Zf = (e, t) => t === "zIndex" ? !1 : !!(typeof e == "number" || Array.isArray(e) || typeof e == "string" && // It's animatable if we have a string
(dr.test(e) || e === "0") && // And it contains numbers and/or colors
!e.startsWith("url("));
function CS(e) {
  const t = e[0];
  if (e.length === 1)
    return !0;
  for (let n = 0; n < e.length; n++)
    if (e[n] !== t)
      return !0;
}
function PS(e, t, n, r) {
  const o = e[0];
  if (o === null)
    return !1;
  if (t === "display" || t === "visibility")
    return !0;
  const i = e[e.length - 1], s = Zf(o, t), a = Zf(i, t);
  return Yo(s === a, `You are trying to animate ${t} from "${o}" to "${i}". ${o} is not an animatable value - to enable this animation set ${o} to a value animatable to ${i} via the \`style\` property.`), !s || !a ? !1 : CS(e) || n === "spring" && r;
}
class Py {
  constructor({ autoplay: t = !0, delay: n = 0, type: r = "keyframes", repeat: o = 0, repeatDelay: i = 0, repeatType: s = "loop", ...a }) {
    this.isStopped = !1, this.hasAttemptedResolve = !1, this.options = {
      autoplay: t,
      delay: n,
      type: r,
      repeat: o,
      repeatDelay: i,
      repeatType: s,
      ...a
    }, this.updateFinishedPromise();
  }
  /**
   * A getter for resolved data. If keyframes are not yet resolved, accessing
   * this.resolved will synchronously flush all pending keyframe resolvers.
   * This is a deoptimisation, but at its worst still batches read/writes.
   */
  get resolved() {
    return !this._resolved && !this.hasAttemptedResolve && uS(), this._resolved;
  }
  /**
   * A method to be called when the keyframes resolver completes. This method
   * will check if its possible to run the animation and, if not, skip it.
   * Otherwise, it will call initPlayback on the implementing class.
   */
  onKeyframesResolved(t, n) {
    this.hasAttemptedResolve = !0;
    const { name: r, type: o, velocity: i, delay: s, onComplete: a, onUpdate: l, isGenerator: c } = this.options;
    if (!c && !PS(t, r, o, i))
      if (s)
        this.options.duration = 0;
      else {
        l == null || l(Ha(t, this.options, n)), a == null || a(), this.resolveFinishedPromise();
        return;
      }
    const u = this.initPlayback(t, n);
    u !== !1 && (this._resolved = {
      keyframes: t,
      finalKeyframe: n,
      ...u
    }, this.onPostResolved());
  }
  onPostResolved() {
  }
  /**
   * Allows the returned animation to be awaited or promise-chained. Currently
   * resolves when the animation finishes at all but in a future update could/should
   * reject if its cancels.
   */
  then(t, n) {
    return this.currentFinishedPromise.then(t, n);
  }
  updateFinishedPromise() {
    this.currentFinishedPromise = new Promise((t) => {
      this.resolveFinishedPromise = t;
    });
  }
}
function Ry(e, t) {
  return t ? e * (1e3 / t) : 0;
}
const RS = 5;
function ky(e, t, n) {
  const r = Math.max(t - RS, 0);
  return Ry(n - e(r), t - r);
}
const kl = 1e-3, kS = 0.01, Xf = 10, OS = 0.05, IS = 1;
function _S({ duration: e = 800, bounce: t = 0.25, velocity: n = 0, mass: r = 1 }) {
  let o, i;
  Yo(e <= Hn(Xf), "Spring duration must be 10 seconds or less");
  let s = 1 - t;
  s = ur(OS, IS, s), e = ur(kS, Xf, Un(e)), s < 1 ? (o = (c) => {
    const u = c * s, d = u * e, f = u - n, h = Fc(c, s), p = Math.exp(-d);
    return kl - f / h * p;
  }, i = (c) => {
    const d = c * s * e, f = d * n + n, h = Math.pow(s, 2) * Math.pow(c, 2) * e, p = Math.exp(-d), m = Fc(Math.pow(c, 2), s);
    return (-o(c) + kl > 0 ? -1 : 1) * ((f - h) * p) / m;
  }) : (o = (c) => {
    const u = Math.exp(-c * e), d = (c - n) * e + 1;
    return -kl + u * d;
  }, i = (c) => {
    const u = Math.exp(-c * e), d = (n - c) * (e * e);
    return u * d;
  });
  const a = 5 / e, l = DS(o, i, a);
  if (e = Hn(e), isNaN(l))
    return {
      stiffness: 100,
      damping: 10,
      duration: e
    };
  {
    const c = Math.pow(l, 2) * r;
    return {
      stiffness: c,
      damping: s * 2 * Math.sqrt(r * c),
      duration: e
    };
  }
}
const AS = 12;
function DS(e, t, n) {
  let r = n;
  for (let o = 1; o < AS; o++)
    r = r - e(r) / t(r);
  return r;
}
function Fc(e, t) {
  return e * Math.sqrt(1 - t * t);
}
const MS = ["duration", "bounce"], NS = ["stiffness", "damping", "mass"];
function Qf(e, t) {
  return t.some((n) => e[n] !== void 0);
}
function FS(e) {
  let t = {
    velocity: 0,
    stiffness: 100,
    damping: 10,
    mass: 1,
    isResolvedFromDuration: !1,
    ...e
  };
  if (!Qf(e, NS) && Qf(e, MS)) {
    const n = _S(e);
    t = {
      ...t,
      ...n,
      mass: 1
    }, t.isResolvedFromDuration = !0;
  }
  return t;
}
function Oy({ keyframes: e, restDelta: t, restSpeed: n, ...r }) {
  const o = e[0], i = e[e.length - 1], s = { done: !1, value: o }, { stiffness: a, damping: l, mass: c, duration: u, velocity: d, isResolvedFromDuration: f } = FS({
    ...r,
    velocity: -Un(r.velocity || 0)
  }), h = d || 0, p = l / (2 * Math.sqrt(a * c)), m = i - o, g = Un(Math.sqrt(a / c)), v = Math.abs(m) < 5;
  n || (n = v ? 0.01 : 2), t || (t = v ? 5e-3 : 0.5);
  let b;
  if (p < 1) {
    const y = Fc(g, p);
    b = (x) => {
      const w = Math.exp(-p * g * x);
      return i - w * ((h + p * g * m) / y * Math.sin(y * x) + m * Math.cos(y * x));
    };
  } else if (p === 1)
    b = (y) => i - Math.exp(-g * y) * (m + (h + g * m) * y);
  else {
    const y = g * Math.sqrt(p * p - 1);
    b = (x) => {
      const w = Math.exp(-p * g * x), T = Math.min(y * x, 300);
      return i - w * ((h + p * g * m) * Math.sinh(T) + y * m * Math.cosh(T)) / y;
    };
  }
  return {
    calculatedDuration: f && u || null,
    next: (y) => {
      const x = b(y);
      if (f)
        s.done = y >= u;
      else {
        let w = h;
        y !== 0 && (p < 1 ? w = ky(b, y, x) : w = 0);
        const T = Math.abs(w) <= n, P = Math.abs(i - x) <= t;
        s.done = T && P;
      }
      return s.value = s.done ? i : x, s;
    }
  };
}
function Jf({ keyframes: e, velocity: t = 0, power: n = 0.8, timeConstant: r = 325, bounceDamping: o = 10, bounceStiffness: i = 500, modifyTarget: s, min: a, max: l, restDelta: c = 0.5, restSpeed: u }) {
  const d = e[0], f = {
    done: !1,
    value: d
  }, h = (I) => a !== void 0 && I < a || l !== void 0 && I > l, p = (I) => a === void 0 ? l : l === void 0 || Math.abs(a - I) < Math.abs(l - I) ? a : l;
  let m = n * t;
  const g = d + m, v = s === void 0 ? g : s(g);
  v !== g && (m = v - d);
  const b = (I) => -m * Math.exp(-I / r), y = (I) => v + b(I), x = (I) => {
    const _ = b(I), R = y(I);
    f.done = Math.abs(_) <= c, f.value = f.done ? v : R;
  };
  let w, T;
  const P = (I) => {
    h(f.value) && (w = I, T = Oy({
      keyframes: [f.value, p(f.value)],
      velocity: ky(y, I, f.value),
      // TODO: This should be passing * 1000
      damping: o,
      stiffness: i,
      restDelta: c,
      restSpeed: u
    }));
  };
  return P(0), {
    calculatedDuration: null,
    next: (I) => {
      let _ = !1;
      return !T && w === void 0 && (_ = !0, x(I), P(I)), w !== void 0 && I >= w ? T.next(I - w) : (!_ && x(I), f);
    }
  };
}
const Iy = (e, t, n) => (((1 - 3 * n + 3 * t) * e + (3 * n - 6 * t)) * e + 3 * t) * e, LS = 1e-7, VS = 12;
function $S(e, t, n, r, o) {
  let i, s, a = 0;
  do
    s = t + (n - t) / 2, i = Iy(s, r, o) - e, i > 0 ? n = s : t = s;
  while (Math.abs(i) > LS && ++a < VS);
  return s;
}
function ts(e, t, n, r) {
  if (e === t && n === r)
    return Mt;
  const o = (i) => $S(i, 0, 1, e, n);
  return (i) => i === 0 || i === 1 ? i : Iy(o(i), t, r);
}
const jS = ts(0.42, 0, 1, 1), BS = ts(0, 0, 0.58, 1), _y = ts(0.42, 0, 0.58, 1), zS = (e) => Array.isArray(e) && typeof e[0] != "number", Ay = (e) => (t) => t <= 0.5 ? e(2 * t) / 2 : (2 - e(2 * (1 - t))) / 2, Dy = (e) => (t) => 1 - e(1 - t), Ju = (e) => 1 - Math.sin(Math.acos(e)), My = Dy(Ju), WS = Ay(Ju), Ny = ts(0.33, 1.53, 0.69, 0.99), ed = Dy(Ny), HS = Ay(ed), US = (e) => (e *= 2) < 1 ? 0.5 * ed(e) : 0.5 * (2 - Math.pow(2, -10 * (e - 1))), eh = {
  linear: Mt,
  easeIn: jS,
  easeInOut: _y,
  easeOut: BS,
  circIn: Ju,
  circInOut: WS,
  circOut: My,
  backIn: ed,
  backInOut: HS,
  backOut: Ny,
  anticipate: US
}, th = (e) => {
  if (Array.isArray(e)) {
    hn(e.length === 4, "Cubic bezier arrays must contain four numerical values.");
    const [t, n, r, o] = e;
    return ts(t, n, r, o);
  } else if (typeof e == "string")
    return hn(eh[e] !== void 0, `Invalid easing type '${e}'`), eh[e];
  return e;
}, Mi = (e, t, n) => {
  const r = t - e;
  return r === 0 ? 1 : (n - e) / r;
}, tt = (e, t, n) => e + (t - e) * n;
function Ol(e, t, n) {
  return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
}
function GS({ hue: e, saturation: t, lightness: n, alpha: r }) {
  e /= 360, t /= 100, n /= 100;
  let o = 0, i = 0, s = 0;
  if (!t)
    o = i = s = n;
  else {
    const a = n < 0.5 ? n * (1 + t) : n + t - n * t, l = 2 * n - a;
    o = Ol(l, a, e + 1 / 3), i = Ol(l, a, e), s = Ol(l, a, e - 1 / 3);
  }
  return {
    red: Math.round(o * 255),
    green: Math.round(i * 255),
    blue: Math.round(s * 255),
    alpha: r
  };
}
function Ks(e, t) {
  return (n) => n > 0 ? t : e;
}
const Il = (e, t, n) => {
  const r = e * e, o = n * (t * t - r) + r;
  return o < 0 ? 0 : Math.sqrt(o);
}, YS = [Mc, jr, po], qS = (e) => YS.find((t) => t.test(e));
function nh(e) {
  const t = qS(e);
  if (Yo(!!t, `'${e}' is not an animatable color. Use the equivalent color code instead.`), !t)
    return !1;
  let n = t.parse(e);
  return t === po && (n = GS(n)), n;
}
const rh = (e, t) => {
  const n = nh(e), r = nh(t);
  if (!n || !r)
    return Ks(e, t);
  const o = { ...n };
  return (i) => (o.red = Il(n.red, r.red, i), o.green = Il(n.green, r.green, i), o.blue = Il(n.blue, r.blue, i), o.alpha = tt(n.alpha, r.alpha, i), jr.transform(o));
}, Lc = /* @__PURE__ */ new Set(["none", "hidden"]);
function KS(e, t) {
  return Lc.has(e) ? (n) => n <= 0 ? e : t : (n) => n >= 1 ? t : e;
}
function ZS(e, t) {
  return (n) => tt(e, t, n);
}
function td(e) {
  return typeof e == "number" ? ZS : typeof e == "string" ? Bu(e) ? Ks : Lt.test(e) ? rh : JS : Array.isArray(e) ? Fy : typeof e == "object" ? Lt.test(e) ? rh : XS : Ks;
}
function Fy(e, t) {
  const n = [...e], r = n.length, o = e.map((i, s) => td(i)(i, t[s]));
  return (i) => {
    for (let s = 0; s < r; s++)
      n[s] = o[s](i);
    return n;
  };
}
function XS(e, t) {
  const n = { ...e, ...t }, r = {};
  for (const o in n)
    e[o] !== void 0 && t[o] !== void 0 && (r[o] = td(e[o])(e[o], t[o]));
  return (o) => {
    for (const i in r)
      n[i] = r[i](o);
    return n;
  };
}
function QS(e, t) {
  var n;
  const r = [], o = { color: 0, var: 0, number: 0 };
  for (let i = 0; i < t.values.length; i++) {
    const s = t.types[i], a = e.indexes[s][o[s]], l = (n = e.values[a]) !== null && n !== void 0 ? n : 0;
    r[i] = l, o[s]++;
  }
  return r;
}
const JS = (e, t) => {
  const n = dr.createTransformer(t), r = Di(e), o = Di(t);
  return r.indexes.var.length === o.indexes.var.length && r.indexes.color.length === o.indexes.color.length && r.indexes.number.length >= o.indexes.number.length ? Lc.has(e) && !o.values.length || Lc.has(t) && !r.values.length ? KS(e, t) : Wn(Fy(QS(r, o), o.values), n) : (Yo(!0, `Complex values '${e}' and '${t}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`), Ks(e, t));
};
function Ly(e, t, n) {
  return typeof e == "number" && typeof t == "number" && typeof n == "number" ? tt(e, t, n) : td(e)(e, t);
}
function eE(e, t, n) {
  const r = [], o = n || Ly, i = e.length - 1;
  for (let s = 0; s < i; s++) {
    let a = o(e[s], e[s + 1]);
    if (t) {
      const l = Array.isArray(t) ? t[s] || Mt : t;
      a = Wn(l, a);
    }
    r.push(a);
  }
  return r;
}
function Vy(e, t, { clamp: n = !0, ease: r, mixer: o } = {}) {
  const i = e.length;
  if (hn(i === t.length, "Both input and output ranges must be the same length"), i === 1)
    return () => t[0];
  if (i === 2 && e[0] === e[1])
    return () => t[1];
  e[0] > e[i - 1] && (e = [...e].reverse(), t = [...t].reverse());
  const s = eE(t, r, o), a = s.length, l = (c) => {
    let u = 0;
    if (a > 1)
      for (; u < e.length - 2 && !(c < e[u + 1]); u++)
        ;
    const d = Mi(e[u], e[u + 1], c);
    return s[u](d);
  };
  return n ? (c) => l(ur(e[0], e[i - 1], c)) : l;
}
function tE(e, t) {
  const n = e[e.length - 1];
  for (let r = 1; r <= t; r++) {
    const o = Mi(0, t, r);
    e.push(tt(n, 1, o));
  }
}
function nE(e) {
  const t = [0];
  return tE(t, e.length - 1), t;
}
function rE(e, t) {
  return e.map((n) => n * t);
}
function oE(e, t) {
  return e.map(() => t || _y).splice(0, e.length - 1);
}
function Zs({ duration: e = 300, keyframes: t, times: n, ease: r = "easeInOut" }) {
  const o = zS(r) ? r.map(th) : th(r), i = {
    done: !1,
    value: t[0]
  }, s = rE(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    n && n.length === t.length ? n : nE(t),
    e
  ), a = Vy(s, t, {
    ease: Array.isArray(o) ? o : oE(t, o)
  });
  return {
    calculatedDuration: e,
    next: (l) => (i.value = a(l), i.done = l >= e, i)
  };
}
const oh = 2e4;
function iE(e) {
  let t = 0;
  const n = 50;
  let r = e.next(t);
  for (; !r.done && t < oh; )
    t += n, r = e.next(t);
  return t >= oh ? 1 / 0 : t;
}
const sE = (e) => {
  const t = ({ timestamp: n }) => e(n);
  return {
    start: () => Ne.update(t, !0),
    stop: () => On(t),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => Ot.isProcessing ? Ot.timestamp : ar.now()
  };
}, aE = {
  decay: Jf,
  inertia: Jf,
  tween: Zs,
  keyframes: Zs,
  spring: Oy
}, lE = (e) => e / 100;
class nd extends Py {
  constructor({ KeyframeResolver: t = Zu, ...n }) {
    super(n), this.holdTime = null, this.startTime = null, this.cancelTime = null, this.currentTime = 0, this.playbackSpeed = 1, this.pendingPlayState = "running", this.state = "idle", this.stop = () => {
      if (this.resolver.cancel(), this.isStopped = !0, this.state === "idle")
        return;
      this.teardown();
      const { onStop: a } = this.options;
      a && a();
    };
    const { name: r, motionValue: o, keyframes: i } = this.options, s = (a, l) => this.onKeyframesResolved(a, l);
    r && o && o.owner ? this.resolver = o.owner.resolveKeyframes(i, s, r, o) : this.resolver = new t(i, s, r, o), this.resolver.scheduleResolve();
  }
  initPlayback(t) {
    const { type: n = "keyframes", repeat: r = 0, repeatDelay: o = 0, repeatType: i, velocity: s = 0 } = this.options, a = aE[n] || Zs;
    let l, c;
    a !== Zs && typeof t[0] != "number" && (process.env.NODE_ENV !== "production" && hn(t.length === 2, `Only two keyframes currently supported with spring and inertia animations. Trying to animate ${t}`), l = Wn(lE, Ly(t[0], t[1])), t = [0, 100]);
    const u = a({ ...this.options, keyframes: t });
    i === "mirror" && (c = a({
      ...this.options,
      keyframes: [...t].reverse(),
      velocity: -s
    })), u.calculatedDuration === null && (u.calculatedDuration = iE(u));
    const { calculatedDuration: d } = u, f = d + o, h = f * (r + 1) - o;
    return {
      generator: u,
      mirroredGenerator: c,
      mapPercentToKeyframes: l,
      calculatedDuration: d,
      resolvedDuration: f,
      totalDuration: h
    };
  }
  onPostResolved() {
    const { autoplay: t = !0 } = this.options;
    this.play(), this.pendingPlayState === "paused" || !t ? this.pause() : this.state = this.pendingPlayState;
  }
  tick(t, n = !1) {
    const { resolved: r } = this;
    if (!r) {
      const { keyframes: I } = this.options;
      return { done: !0, value: I[I.length - 1] };
    }
    const { finalKeyframe: o, generator: i, mirroredGenerator: s, mapPercentToKeyframes: a, keyframes: l, calculatedDuration: c, totalDuration: u, resolvedDuration: d } = r;
    if (this.startTime === null)
      return i.next(0);
    const { delay: f, repeat: h, repeatType: p, repeatDelay: m, onUpdate: g } = this.options;
    this.speed > 0 ? this.startTime = Math.min(this.startTime, t) : this.speed < 0 && (this.startTime = Math.min(t - u / this.speed, this.startTime)), n ? this.currentTime = t : this.holdTime !== null ? this.currentTime = this.holdTime : this.currentTime = Math.round(t - this.startTime) * this.speed;
    const v = this.currentTime - f * (this.speed >= 0 ? 1 : -1), b = this.speed >= 0 ? v < 0 : v > u;
    this.currentTime = Math.max(v, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = u);
    let y = this.currentTime, x = i;
    if (h) {
      const I = Math.min(this.currentTime, u) / d;
      let _ = Math.floor(I), R = I % 1;
      !R && I >= 1 && (R = 1), R === 1 && _--, _ = Math.min(_, h + 1), !!(_ % 2) && (p === "reverse" ? (R = 1 - R, m && (R -= m / d)) : p === "mirror" && (x = s)), y = ur(0, 1, R) * d;
    }
    const w = b ? { done: !1, value: l[0] } : x.next(y);
    a && (w.value = a(w.value));
    let { done: T } = w;
    !b && c !== null && (T = this.speed >= 0 ? this.currentTime >= u : this.currentTime <= 0);
    const P = this.holdTime === null && (this.state === "finished" || this.state === "running" && T);
    return P && o !== void 0 && (w.value = Ha(l, this.options, o)), g && g(w.value), P && this.finish(), w;
  }
  get duration() {
    const { resolved: t } = this;
    return t ? Un(t.calculatedDuration) : 0;
  }
  get time() {
    return Un(this.currentTime);
  }
  set time(t) {
    t = Hn(t), this.currentTime = t, this.holdTime !== null || this.speed === 0 ? this.holdTime = t : this.driver && (this.startTime = this.driver.now() - t / this.speed);
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(t) {
    const n = this.playbackSpeed !== t;
    this.playbackSpeed = t, n && (this.time = Un(this.currentTime));
  }
  play() {
    if (this.resolver.isScheduled || this.resolver.resume(), !this._resolved) {
      this.pendingPlayState = "running";
      return;
    }
    if (this.isStopped)
      return;
    const { driver: t = sE, onPlay: n } = this.options;
    this.driver || (this.driver = t((o) => this.tick(o))), n && n();
    const r = this.driver.now();
    this.holdTime !== null ? this.startTime = r - this.holdTime : (!this.startTime || this.state === "finished") && (this.startTime = r), this.state === "finished" && this.updateFinishedPromise(), this.cancelTime = this.startTime, this.holdTime = null, this.state = "running", this.driver.start();
  }
  pause() {
    var t;
    if (!this._resolved) {
      this.pendingPlayState = "paused";
      return;
    }
    this.state = "paused", this.holdTime = (t = this.currentTime) !== null && t !== void 0 ? t : 0;
  }
  complete() {
    this.state !== "running" && this.play(), this.pendingPlayState = this.state = "finished", this.holdTime = null;
  }
  finish() {
    this.teardown(), this.state = "finished";
    const { onComplete: t } = this.options;
    t && t();
  }
  cancel() {
    this.cancelTime !== null && this.tick(this.cancelTime), this.teardown(), this.updateFinishedPromise();
  }
  teardown() {
    this.state = "idle", this.stopDriver(), this.resolveFinishedPromise(), this.updateFinishedPromise(), this.startTime = this.cancelTime = null, this.resolver.cancel();
  }
  stopDriver() {
    this.driver && (this.driver.stop(), this.driver = void 0);
  }
  sample(t) {
    return this.startTime = 0, this.tick(t, !0);
  }
}
const $y = (e) => Array.isArray(e) && typeof e[0] == "number";
function jy(e) {
  return !!(!e || typeof e == "string" && e in rd || $y(e) || Array.isArray(e) && e.every(jy));
}
const ui = ([e, t, n, r]) => `cubic-bezier(${e}, ${t}, ${n}, ${r})`, rd = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: ui([0, 0.65, 0.55, 1]),
  circOut: ui([0.55, 0, 1, 0.45]),
  backIn: ui([0.31, 0.01, 0.66, -0.59]),
  backOut: ui([0.33, 1.53, 0.69, 0.99])
};
function cE(e) {
  return By(e) || rd.easeOut;
}
function By(e) {
  if (e)
    return $y(e) ? ui(e) : Array.isArray(e) ? e.map(cE) : rd[e];
}
function uE(e, t, n, { delay: r = 0, duration: o = 300, repeat: i = 0, repeatType: s = "loop", ease: a, times: l } = {}) {
  const c = { [t]: n };
  l && (c.offset = l);
  const u = By(a);
  return Array.isArray(u) && (c.easing = u), e.animate(c, {
    delay: r,
    duration: o,
    easing: Array.isArray(u) ? "linear" : u,
    fill: "both",
    iterations: i + 1,
    direction: s === "reverse" ? "alternate" : "normal"
  });
}
const dE = Cy(() => Object.hasOwnProperty.call(Element.prototype, "animate")), Xs = 10, fE = 2e4;
function hE(e) {
  return e.type === "spring" || !jy(e.ease);
}
function pE(e, t) {
  const n = new nd({
    ...t,
    keyframes: e,
    repeat: 0,
    delay: 0,
    isGenerator: !0
  });
  let r = { done: !1, value: e[0] };
  const o = [];
  let i = 0;
  for (; !r.done && i < fE; )
    r = n.sample(i), o.push(r.value), i += Xs;
  return {
    times: void 0,
    keyframes: o,
    duration: i - Xs,
    ease: "linear"
  };
}
class ih extends Py {
  constructor(t) {
    super(t);
    const { name: n, motionValue: r, keyframes: o } = this.options;
    this.resolver = new Ey(o, (i, s) => this.onKeyframesResolved(i, s), n, r), this.resolver.scheduleResolve();
  }
  initPlayback(t, n) {
    var r;
    let { duration: o = 300, times: i, ease: s, type: a, motionValue: l, name: c } = this.options;
    if (!(!((r = l.owner) === null || r === void 0) && r.current))
      return !1;
    if (hE(this.options)) {
      const { onComplete: d, onUpdate: f, motionValue: h, ...p } = this.options, m = pE(t, p);
      t = m.keyframes, t.length === 1 && (t[1] = t[0]), o = m.duration, i = m.times, s = m.ease, a = "keyframes";
    }
    const u = uE(l.owner.current, c, t, { ...this.options, duration: o, times: i, ease: s });
    return u.startTime = ar.now(), this.pendingTimeline ? (u.timeline = this.pendingTimeline, this.pendingTimeline = void 0) : u.onfinish = () => {
      const { onComplete: d } = this.options;
      l.set(Ha(t, this.options, n)), d && d(), this.cancel(), this.resolveFinishedPromise();
    }, {
      animation: u,
      duration: o,
      times: i,
      type: a,
      ease: s,
      keyframes: t
    };
  }
  get duration() {
    const { resolved: t } = this;
    if (!t)
      return 0;
    const { duration: n } = t;
    return Un(n);
  }
  get time() {
    const { resolved: t } = this;
    if (!t)
      return 0;
    const { animation: n } = t;
    return Un(n.currentTime || 0);
  }
  set time(t) {
    const { resolved: n } = this;
    if (!n)
      return;
    const { animation: r } = n;
    r.currentTime = Hn(t);
  }
  get speed() {
    const { resolved: t } = this;
    if (!t)
      return 1;
    const { animation: n } = t;
    return n.playbackRate;
  }
  set speed(t) {
    const { resolved: n } = this;
    if (!n)
      return;
    const { animation: r } = n;
    r.playbackRate = t;
  }
  get state() {
    const { resolved: t } = this;
    if (!t)
      return "idle";
    const { animation: n } = t;
    return n.playState;
  }
  /**
   * Replace the default DocumentTimeline with another AnimationTimeline.
   * Currently used for scroll animations.
   */
  attachTimeline(t) {
    if (!this._resolved)
      this.pendingTimeline = t;
    else {
      const { resolved: n } = this;
      if (!n)
        return Mt;
      const { animation: r } = n;
      r.timeline = t, r.onfinish = null;
    }
    return Mt;
  }
  play() {
    if (this.isStopped)
      return;
    const { resolved: t } = this;
    if (!t)
      return;
    const { animation: n } = t;
    n.playState === "finished" && this.updateFinishedPromise(), n.play();
  }
  pause() {
    const { resolved: t } = this;
    if (!t)
      return;
    const { animation: n } = t;
    n.pause();
  }
  stop() {
    if (this.resolver.cancel(), this.isStopped = !0, this.state === "idle")
      return;
    const { resolved: t } = this;
    if (!t)
      return;
    const { animation: n, keyframes: r, duration: o, type: i, ease: s, times: a } = t;
    if (n.playState === "idle" || n.playState === "finished")
      return;
    if (this.time) {
      const { motionValue: c, onUpdate: u, onComplete: d, ...f } = this.options, h = new nd({
        ...f,
        keyframes: r,
        duration: o,
        type: i,
        ease: s,
        times: a,
        isGenerator: !0
      }), p = Hn(this.time);
      c.setWithVelocity(h.sample(p - Xs).value, h.sample(p).value, Xs);
    }
    const { onStop: l } = this.options;
    l && l(), this.cancel();
  }
  complete() {
    const { resolved: t } = this;
    t && t.animation.finish();
  }
  cancel() {
    const { resolved: t } = this;
    t && t.animation.cancel();
  }
  static supports(t) {
    const { motionValue: n, name: r, repeatDelay: o, repeatType: i, damping: s, type: a } = t;
    return dE() && r && ny.has(r) && n && n.owner && n.owner.current instanceof HTMLElement && /**
     * If we're outputting values to onUpdate then we can't use WAAPI as there's
     * no way to read the value from WAAPI every frame.
     */
    !n.owner.getProps().onUpdate && !o && i !== "mirror" && s !== 0 && a !== "inertia";
  }
}
function mE(e, t) {
  let n;
  const r = () => {
    const { currentTime: o } = t, s = (o === null ? 0 : o.value) / 100;
    n !== s && e(s), n = s;
  };
  return Ne.update(r, !0), () => On(r);
}
const gE = Cy(() => window.ScrollTimeline !== void 0);
class yE {
  constructor(t) {
    this.stop = () => this.runAll("stop"), this.animations = t.filter(Boolean);
  }
  then(t, n) {
    return Promise.all(this.animations).then(t).catch(n);
  }
  /**
   * TODO: Filter out cancelled or stopped animations before returning
   */
  getAll(t) {
    return this.animations[0][t];
  }
  setAll(t, n) {
    for (let r = 0; r < this.animations.length; r++)
      this.animations[r][t] = n;
  }
  attachTimeline(t) {
    const n = this.animations.map((r) => {
      if (gE() && r.attachTimeline)
        r.attachTimeline(t);
      else
        return r.pause(), mE((o) => {
          r.time = r.duration * o;
        }, t);
    });
    return () => {
      n.forEach((r, o) => {
        r && r(), this.animations[o].stop();
      });
    };
  }
  get time() {
    return this.getAll("time");
  }
  set time(t) {
    this.setAll("time", t);
  }
  get speed() {
    return this.getAll("speed");
  }
  set speed(t) {
    this.setAll("speed", t);
  }
  get duration() {
    let t = 0;
    for (let n = 0; n < this.animations.length; n++)
      t = Math.max(t, this.animations[n].duration);
    return t;
  }
  runAll(t) {
    this.animations.forEach((n) => n[t]());
  }
  play() {
    this.runAll("play");
  }
  pause() {
    this.runAll("pause");
  }
  cancel() {
    this.runAll("cancel");
  }
  complete() {
    this.runAll("complete");
  }
}
const od = (e, t, n, r = {}, o, i, s) => (a) => {
  const l = Ku(r, e) || {}, c = l.delay || r.delay || 0;
  let { elapsed: u = 0 } = r;
  u = u - Hn(c);
  let d = {
    keyframes: Array.isArray(n) ? n : [null, n],
    ease: "easeOut",
    velocity: t.getVelocity(),
    ...l,
    delay: -u,
    onUpdate: (h) => {
      t.set(h), l.onUpdate && l.onUpdate(h);
    },
    onComplete: () => {
      a(), l.onComplete && l.onComplete(), s && s();
    },
    onStop: s,
    name: e,
    motionValue: t,
    element: i ? void 0 : o
  };
  QT(l) || (d = {
    ...d,
    ...XT(e, d)
  }), d.duration && (d.duration = Hn(d.duration)), d.repeatDelay && (d.repeatDelay = Hn(d.repeatDelay)), d.from !== void 0 && (d.keyframes[0] = d.from);
  let f = !1;
  if ((d.type === !1 || d.duration === 0 && !d.repeatDelay) && (d.duration = 0, d.delay === 0 && (f = !0)), f && !i && t.get() !== void 0) {
    const h = Ha(d.keyframes, l);
    if (h !== void 0)
      return Ne.update(() => {
        d.onUpdate(h), d.onComplete();
      }), new yE([]);
  }
  return !i && ih.supports(d) ? new ih(d) : new nd(d);
};
class id {
  constructor() {
    this.subscriptions = [];
  }
  add(t) {
    return ja(this.subscriptions, t), () => Ba(this.subscriptions, t);
  }
  notify(t, n, r) {
    const o = this.subscriptions.length;
    if (o)
      if (o === 1)
        this.subscriptions[0](t, n, r);
      else
        for (let i = 0; i < o; i++) {
          const s = this.subscriptions[i];
          s && s(t, n, r);
        }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
const sh = /* @__PURE__ */ new Set();
function sd(e, t, n) {
  e || sh.has(t) || (console.warn(t), sh.add(t));
}
const ah = 30, vE = (e) => !isNaN(parseFloat(e)), bi = {
  current: void 0
};
class zy {
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   *
   * @internal
   */
  constructor(t, n = {}) {
    this.version = "11.3.8", this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (r, o = !0) => {
      const i = ar.now();
      this.updatedAt !== i && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(r), this.current !== this.prev && this.events.change && this.events.change.notify(this.current), o && this.events.renderRequest && this.events.renderRequest.notify(this.current);
    }, this.hasAnimated = !1, this.setCurrent(t), this.owner = n.owner;
  }
  setCurrent(t) {
    this.current = t, this.updatedAt = ar.now(), this.canTrackVelocity === null && t !== void 0 && (this.canTrackVelocity = vE(this.current));
  }
  setPrevFrameValue(t = this.current) {
    this.prevFrameValue = t, this.prevUpdatedAt = this.updatedAt;
  }
  /**
   * Adds a function that will be notified when the `MotionValue` is updated.
   *
   * It returns a function that, when called, will cancel the subscription.
   *
   * When calling `onChange` inside a React component, it should be wrapped with the
   * `useEffect` hook. As it returns an unsubscribe function, this should be returned
   * from the `useEffect` function to ensure you don't add duplicate subscribers..
   *
   * ```jsx
   * export const MyComponent = () => {
   *   const x = useMotionValue(0)
   *   const y = useMotionValue(0)
   *   const opacity = useMotionValue(1)
   *
   *   useEffect(() => {
   *     function updateOpacity() {
   *       const maxXY = Math.max(x.get(), y.get())
   *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
   *       opacity.set(newOpacity)
   *     }
   *
   *     const unsubscribeX = x.on("change", updateOpacity)
   *     const unsubscribeY = y.on("change", updateOpacity)
   *
   *     return () => {
   *       unsubscribeX()
   *       unsubscribeY()
   *     }
   *   }, [])
   *
   *   return <motion.div style={{ x }} />
   * }
   * ```
   *
   * @param subscriber - A function that receives the latest value.
   * @returns A function that, when called, will cancel this subscription.
   *
   * @deprecated
   */
  onChange(t) {
    return process.env.NODE_ENV !== "production" && sd(!1, 'value.onChange(callback) is deprecated. Switch to value.on("change", callback).'), this.on("change", t);
  }
  on(t, n) {
    this.events[t] || (this.events[t] = new id());
    const r = this.events[t].add(n);
    return t === "change" ? () => {
      r(), Ne.read(() => {
        this.events.change.getSize() || this.stop();
      });
    } : r;
  }
  clearListeners() {
    for (const t in this.events)
      this.events[t].clear();
  }
  /**
   * Attaches a passive effect to the `MotionValue`.
   *
   * @internal
   */
  attach(t, n) {
    this.passiveEffect = t, this.stopPassiveEffect = n;
  }
  /**
   * Sets the state of the `MotionValue`.
   *
   * @remarks
   *
   * ```jsx
   * const x = useMotionValue(0)
   * x.set(10)
   * ```
   *
   * @param latest - Latest value to set.
   * @param render - Whether to notify render subscribers. Defaults to `true`
   *
   * @public
   */
  set(t, n = !0) {
    !n || !this.passiveEffect ? this.updateAndNotify(t, n) : this.passiveEffect(t, this.updateAndNotify);
  }
  setWithVelocity(t, n, r) {
    this.set(n), this.prev = void 0, this.prevFrameValue = t, this.prevUpdatedAt = this.updatedAt - r;
  }
  /**
   * Set the state of the `MotionValue`, stopping any active animations,
   * effects, and resets velocity to `0`.
   */
  jump(t, n = !0) {
    this.updateAndNotify(t), this.prev = t, this.prevUpdatedAt = this.prevFrameValue = void 0, n && this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
  /**
   * Returns the latest state of `MotionValue`
   *
   * @returns - The latest state of `MotionValue`
   *
   * @public
   */
  get() {
    return bi.current && bi.current.push(this), this.current;
  }
  /**
   * @public
   */
  getPrevious() {
    return this.prev;
  }
  /**
   * Returns the latest velocity of `MotionValue`
   *
   * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
   *
   * @public
   */
  getVelocity() {
    const t = ar.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || t - this.updatedAt > ah)
      return 0;
    const n = Math.min(this.updatedAt - this.prevUpdatedAt, ah);
    return Ry(parseFloat(this.current) - parseFloat(this.prevFrameValue), n);
  }
  /**
   * Registers a new animation to control this `MotionValue`. Only one
   * animation can drive a `MotionValue` at one time.
   *
   * ```jsx
   * value.start()
   * ```
   *
   * @param animation - A function that starts the provided animation
   *
   * @internal
   */
  start(t) {
    return this.stop(), new Promise((n) => {
      this.hasAnimated = !0, this.animation = t(n), this.events.animationStart && this.events.animationStart.notify();
    }).then(() => {
      this.events.animationComplete && this.events.animationComplete.notify(), this.clearAnimation();
    });
  }
  /**
   * Stop the currently active animation.
   *
   * @public
   */
  stop() {
    this.animation && (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()), this.clearAnimation();
  }
  /**
   * Returns `true` if this value is currently animating.
   *
   * @public
   */
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  /**
   * Destroy and clean up subscribers to this `MotionValue`.
   *
   * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
   * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
   * created a `MotionValue` via the `motionValue` function.
   *
   * @public
   */
  destroy() {
    this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
}
function Io(e, t) {
  return new zy(e, t);
}
function bE(e, t, n) {
  e.hasValue(t) ? e.getValue(t).set(n) : e.addValue(t, Io(n));
}
function wE(e, t) {
  const n = Wa(e, t);
  let { transitionEnd: r = {}, transition: o = {}, ...i } = n || {};
  i = { ...i, ...r };
  for (const s in i) {
    const a = PT(i[s]);
    bE(e, s, a);
  }
}
function Wy(e) {
  return e.getProps()[$g];
}
class xE extends zy {
  constructor() {
    super(...arguments), this.output = [], this.counts = /* @__PURE__ */ new Map();
  }
  add(t) {
    const n = ry(t);
    if (!n)
      return;
    const r = this.counts.get(n) || 0;
    this.counts.set(n, r + 1), r === 0 && (this.output.push(n), this.update());
    let o = !1;
    return () => {
      if (o)
        return;
      o = !0;
      const i = this.counts.get(n) - 1;
      this.counts.set(n, i), i === 0 && (Ba(this.output, n), this.update());
    };
  }
  update() {
    this.set(this.output.length ? this.output.join(", ") : "auto");
  }
}
function TE(e) {
  return !!(Dt(e) && e.add);
}
function Vc(e, t) {
  var n;
  if (!e.applyWillChange)
    return;
  let r = e.getValue("willChange");
  if (!r && !(!((n = e.props.style) === null || n === void 0) && n.willChange) && (r = new xE("auto"), e.addValue("willChange", r)), TE(r))
    return r.add(t);
}
function SE({ protectedKeys: e, needsAnimating: t }, n) {
  const r = e.hasOwnProperty(n) && t[n] !== !0;
  return t[n] = !1, r;
}
function Hy(e, t, { delay: n = 0, transitionOverride: r, type: o } = {}) {
  var i;
  let { transition: s = e.getDefaultTransition(), transitionEnd: a, ...l } = t;
  r && (s = r);
  const c = [], u = o && e.animationState && e.animationState.getState()[o];
  for (const d in l) {
    const f = e.getValue(d, (i = e.latestValues[d]) !== null && i !== void 0 ? i : null), h = l[d];
    if (h === void 0 || u && SE(u, d))
      continue;
    const p = {
      delay: n,
      elapsed: 0,
      ...Ku(s || {}, d)
    };
    let m = !1;
    if (window.HandoffAppearAnimations) {
      const v = Wy(e);
      if (v) {
        const b = window.HandoffAppearAnimations(v, d, f, Ne);
        b !== null && (p.elapsed = b, m = !0);
      }
    }
    f.start(od(d, f, h, e.shouldReduceMotion && vr.has(d) ? { type: !1 } : p, e, m, Vc(e, d)));
    const g = f.animation;
    g && c.push(g);
  }
  return a && Promise.all(c).then(() => {
    Ne.update(() => {
      a && wE(e, a);
    });
  }), c;
}
function $c(e, t, n = {}) {
  var r;
  const o = Wa(e, t, n.type === "exit" ? (r = e.presenceContext) === null || r === void 0 ? void 0 : r.custom : void 0);
  let { transition: i = e.getDefaultTransition() || {} } = o || {};
  n.transitionOverride && (i = n.transitionOverride);
  const s = o ? () => Promise.all(Hy(e, o, n)) : () => Promise.resolve(), a = e.variantChildren && e.variantChildren.size ? (c = 0) => {
    const { delayChildren: u = 0, staggerChildren: d, staggerDirection: f } = i;
    return EE(e, t, u + c, d, f, n);
  } : () => Promise.resolve(), { when: l } = i;
  if (l) {
    const [c, u] = l === "beforeChildren" ? [s, a] : [a, s];
    return c().then(() => u());
  } else
    return Promise.all([s(), a(n.delay)]);
}
function EE(e, t, n = 0, r = 0, o = 1, i) {
  const s = [], a = (e.variantChildren.size - 1) * r, l = o === 1 ? (c = 0) => c * r : (c = 0) => a - c * r;
  return Array.from(e.variantChildren).sort(CE).forEach((c, u) => {
    c.notify("AnimationStart", t), s.push($c(c, t, {
      ...i,
      delay: n + l(u)
    }).then(() => c.notify("AnimationComplete", t)));
  }), Promise.all(s);
}
function CE(e, t) {
  return e.sortNodePosition(t);
}
function PE(e, t, n = {}) {
  e.notify("AnimationStart", t);
  let r;
  if (Array.isArray(t)) {
    const o = t.map((i) => $c(e, i, n));
    r = Promise.all(o);
  } else if (typeof t == "string")
    r = $c(e, t, n);
  else {
    const o = typeof t == "function" ? Wa(e, t, n.custom) : t;
    r = Promise.all(Hy(e, o, n));
  }
  return r.then(() => {
    Ne.postRender(() => {
      e.notify("AnimationComplete", t);
    });
  });
}
const RE = [...Vu].reverse(), kE = Vu.length;
function OE(e) {
  return (t) => Promise.all(t.map(({ animation: n, options: r }) => PE(e, n, r)));
}
function IE(e) {
  let t = OE(e), n = lh(), r = !0;
  const o = (l) => (c, u) => {
    var d;
    const f = Wa(e, u, l === "exit" ? (d = e.presenceContext) === null || d === void 0 ? void 0 : d.custom : void 0);
    if (f) {
      const { transition: h, transitionEnd: p, ...m } = f;
      c = { ...c, ...m, ...p };
    }
    return c;
  };
  function i(l) {
    t = l(e);
  }
  function s(l) {
    const c = e.getProps(), u = e.getVariantContext(!0) || {}, d = [], f = /* @__PURE__ */ new Set();
    let h = {}, p = 1 / 0;
    for (let g = 0; g < kE; g++) {
      const v = RE[g], b = n[v], y = c[v] !== void 0 ? c[v] : u[v], x = Ii(y), w = v === l ? b.isActive : null;
      w === !1 && (p = g);
      let T = y === u[v] && y !== c[v] && x;
      if (T && r && e.manuallyAnimateOnMount && (T = !1), b.protectedKeys = { ...h }, // If it isn't active and hasn't *just* been set as inactive
      !b.isActive && w === null || // If we didn't and don't have any defined prop for this animation type
      !y && !b.prevProp || // Or if the prop doesn't define an animation
      _i(y) || typeof y == "boolean")
        continue;
      let I = _E(b.prevProp, y) || // If we're making this variant active, we want to always make it active
      v === l && b.isActive && !T && x || // If we removed a higher-priority variant (i is in reverse order)
      g > p && x, _ = !1;
      const R = Array.isArray(y) ? y : [y];
      let L = R.reduce(o(v), {});
      w === !1 && (L = {});
      const { prevResolvedValues: M = {} } = b, V = {
        ...M,
        ...L
      }, E = (k) => {
        I = !0, f.has(k) && (_ = !0, f.delete(k)), b.needsAnimating[k] = !0;
        const A = e.getValue(k);
        A && (A.liveStyle = !1);
      };
      for (const k in V) {
        const A = L[k], N = M[k];
        if (h.hasOwnProperty(k))
          continue;
        let H = !1;
        Ic(A) && Ic(N) ? H = !uy(A, N) : H = A !== N, H ? A != null ? E(k) : f.add(k) : A !== void 0 && f.has(k) ? E(k) : b.protectedKeys[k] = !0;
      }
      b.prevProp = y, b.prevResolvedValues = L, b.isActive && (h = { ...h, ...L }), r && e.blockInitialAnimation && (I = !1), I && (!T || _) && d.push(...R.map((k) => ({
        animation: k,
        options: { type: v }
      })));
    }
    if (f.size) {
      const g = {};
      f.forEach((v) => {
        const b = e.getBaseTarget(v), y = e.getValue(v);
        y && (y.liveStyle = !0), g[v] = b ?? null;
      }), d.push({ animation: g });
    }
    let m = !!d.length;
    return r && (c.initial === !1 || c.initial === c.animate) && !e.manuallyAnimateOnMount && (m = !1), r = !1, m ? t(d) : Promise.resolve();
  }
  function a(l, c) {
    var u;
    if (n[l].isActive === c)
      return Promise.resolve();
    (u = e.variantChildren) === null || u === void 0 || u.forEach((f) => {
      var h;
      return (h = f.animationState) === null || h === void 0 ? void 0 : h.setActive(l, c);
    }), n[l].isActive = c;
    const d = s(l);
    for (const f in n)
      n[f].protectedKeys = {};
    return d;
  }
  return {
    animateChanges: s,
    setActive: a,
    setAnimateFunction: i,
    getState: () => n,
    reset: () => {
      n = lh(), r = !0;
    }
  };
}
function _E(e, t) {
  return typeof t == "string" ? t !== e : Array.isArray(t) ? !uy(t, e) : !1;
}
function kr(e = !1) {
  return {
    isActive: e,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function lh() {
  return {
    animate: kr(!0),
    whileInView: kr(),
    whileHover: kr(),
    whileTap: kr(),
    whileDrag: kr(),
    whileFocus: kr(),
    exit: kr()
  };
}
class AE extends wr {
  /**
   * We dynamically generate the AnimationState manager as it contains a reference
   * to the underlying animation library. We only want to load that if we load this,
   * so people can optionally code split it out using the `m` component.
   */
  constructor(t) {
    super(t), t.animationState || (t.animationState = IE(t));
  }
  updateAnimationControlsSubscription() {
    const { animate: t } = this.node.getProps();
    _i(t) && (this.unmountControls = t.subscribe(this.node));
  }
  /**
   * Subscribe any provided AnimationControls to the component's VisualElement
   */
  mount() {
    this.updateAnimationControlsSubscription();
  }
  update() {
    const { animate: t } = this.node.getProps(), { animate: n } = this.node.prevProps || {};
    t !== n && this.updateAnimationControlsSubscription();
  }
  unmount() {
    var t;
    this.node.animationState.reset(), (t = this.unmountControls) === null || t === void 0 || t.call(this);
  }
}
let DE = 0;
class ME extends wr {
  constructor() {
    super(...arguments), this.id = DE++;
  }
  update() {
    if (!this.node.presenceContext)
      return;
    const { isPresent: t, onExitComplete: n } = this.node.presenceContext, { isPresent: r } = this.node.prevPresenceContext || {};
    if (!this.node.animationState || t === r)
      return;
    const o = this.node.animationState.setActive("exit", !t);
    n && !t && o.then(() => n(this.id));
  }
  mount() {
    const { register: t } = this.node.presenceContext || {};
    t && (this.unmount = t(this.id));
  }
  unmount() {
  }
}
const NE = {
  animation: {
    Feature: AE
  },
  exit: {
    Feature: ME
  }
}, ch = (e, t) => Math.abs(e - t);
function FE(e, t) {
  const n = ch(e.x, t.x), r = ch(e.y, t.y);
  return Math.sqrt(n ** 2 + r ** 2);
}
class Uy {
  constructor(t, n, { transformPagePoint: r, contextWindow: o, dragSnapToOrigin: i = !1 } = {}) {
    if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.updatePoint = () => {
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const d = Al(this.lastMoveEventInfo, this.history), f = this.startEvent !== null, h = FE(d.offset, { x: 0, y: 0 }) >= 3;
      if (!f && !h)
        return;
      const { point: p } = d, { timestamp: m } = Ot;
      this.history.push({ ...p, timestamp: m });
      const { onStart: g, onMove: v } = this.handlers;
      f || (g && g(this.lastMoveEvent, d), this.startEvent = this.lastMoveEvent), v && v(this.lastMoveEvent, d);
    }, this.handlePointerMove = (d, f) => {
      this.lastMoveEvent = d, this.lastMoveEventInfo = _l(f, this.transformPagePoint), Ne.update(this.updatePoint, !0);
    }, this.handlePointerUp = (d, f) => {
      this.end();
      const { onEnd: h, onSessionEnd: p, resumeAnimation: m } = this.handlers;
      if (this.dragSnapToOrigin && m && m(), !(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const g = Al(d.type === "pointercancel" ? this.lastMoveEventInfo : _l(f, this.transformPagePoint), this.history);
      this.startEvent && h && h(d, g), p && p(d, g);
    }, !iy(t))
      return;
    this.dragSnapToOrigin = i, this.handlers = n, this.transformPagePoint = r, this.contextWindow = o || window;
    const s = za(t), a = _l(s, this.transformPagePoint), { point: l } = a, { timestamp: c } = Ot;
    this.history = [{ ...l, timestamp: c }];
    const { onSessionStart: u } = n;
    u && u(t, Al(a, this.history)), this.removeListeners = Wn(zn(this.contextWindow, "pointermove", this.handlePointerMove), zn(this.contextWindow, "pointerup", this.handlePointerUp), zn(this.contextWindow, "pointercancel", this.handlePointerUp));
  }
  updateHandlers(t) {
    this.handlers = t;
  }
  end() {
    this.removeListeners && this.removeListeners(), On(this.updatePoint);
  }
}
function _l(e, t) {
  return t ? { point: t(e.point) } : e;
}
function uh(e, t) {
  return { x: e.x - t.x, y: e.y - t.y };
}
function Al({ point: e }, t) {
  return {
    point: e,
    delta: uh(e, Gy(t)),
    offset: uh(e, LE(t)),
    velocity: VE(t, 0.1)
  };
}
function LE(e) {
  return e[0];
}
function Gy(e) {
  return e[e.length - 1];
}
function VE(e, t) {
  if (e.length < 2)
    return { x: 0, y: 0 };
  let n = e.length - 1, r = null;
  const o = Gy(e);
  for (; n >= 0 && (r = e[n], !(o.timestamp - r.timestamp > Hn(t))); )
    n--;
  if (!r)
    return { x: 0, y: 0 };
  const i = Un(o.timestamp - r.timestamp);
  if (i === 0)
    return { x: 0, y: 0 };
  const s = {
    x: (o.x - r.x) / i,
    y: (o.y - r.y) / i
  };
  return s.x === 1 / 0 && (s.x = 0), s.y === 1 / 0 && (s.y = 0), s;
}
const Yy = 1e-4, $E = 1 - Yy, jE = 1 + Yy, qy = 0.01, BE = 0 - qy, zE = 0 + qy;
function nn(e) {
  return e.max - e.min;
}
function WE(e, t, n) {
  return Math.abs(e - t) <= n;
}
function dh(e, t, n, r = 0.5) {
  e.origin = r, e.originPoint = tt(t.min, t.max, e.origin), e.scale = nn(n) / nn(t), e.translate = tt(n.min, n.max, e.origin) - e.originPoint, (e.scale >= $E && e.scale <= jE || isNaN(e.scale)) && (e.scale = 1), (e.translate >= BE && e.translate <= zE || isNaN(e.translate)) && (e.translate = 0);
}
function wi(e, t, n, r) {
  dh(e.x, t.x, n.x, r ? r.originX : void 0), dh(e.y, t.y, n.y, r ? r.originY : void 0);
}
function fh(e, t, n) {
  e.min = n.min + t.min, e.max = e.min + nn(t);
}
function HE(e, t, n) {
  fh(e.x, t.x, n.x), fh(e.y, t.y, n.y);
}
function hh(e, t, n) {
  e.min = t.min - n.min, e.max = e.min + nn(t);
}
function xi(e, t, n) {
  hh(e.x, t.x, n.x), hh(e.y, t.y, n.y);
}
function UE(e, { min: t, max: n }, r) {
  return t !== void 0 && e < t ? e = r ? tt(t, e, r.min) : Math.max(e, t) : n !== void 0 && e > n && (e = r ? tt(n, e, r.max) : Math.min(e, n)), e;
}
function ph(e, t, n) {
  return {
    min: t !== void 0 ? e.min + t : void 0,
    max: n !== void 0 ? e.max + n - (e.max - e.min) : void 0
  };
}
function GE(e, { top: t, left: n, bottom: r, right: o }) {
  return {
    x: ph(e.x, n, o),
    y: ph(e.y, t, r)
  };
}
function mh(e, t) {
  let n = t.min - e.min, r = t.max - e.max;
  return t.max - t.min < e.max - e.min && ([n, r] = [r, n]), { min: n, max: r };
}
function YE(e, t) {
  return {
    x: mh(e.x, t.x),
    y: mh(e.y, t.y)
  };
}
function qE(e, t) {
  let n = 0.5;
  const r = nn(e), o = nn(t);
  return o > r ? n = Mi(t.min, t.max - r, e.min) : r > o && (n = Mi(e.min, e.max - o, t.min)), ur(0, 1, n);
}
function KE(e, t) {
  const n = {};
  return t.min !== void 0 && (n.min = t.min - e.min), t.max !== void 0 && (n.max = t.max - e.min), n;
}
const jc = 0.35;
function ZE(e = jc) {
  return e === !1 ? e = 0 : e === !0 && (e = jc), {
    x: gh(e, "left", "right"),
    y: gh(e, "top", "bottom")
  };
}
function gh(e, t, n) {
  return {
    min: yh(e, t),
    max: yh(e, n)
  };
}
function yh(e, t) {
  return typeof e == "number" ? e : e[t] || 0;
}
const vh = () => ({
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
}), mo = () => ({
  x: vh(),
  y: vh()
}), bh = () => ({ min: 0, max: 0 }), pt = () => ({
  x: bh(),
  y: bh()
});
function sn(e) {
  return [e("x"), e("y")];
}
function Ky({ top: e, left: t, right: n, bottom: r }) {
  return {
    x: { min: t, max: n },
    y: { min: e, max: r }
  };
}
function XE({ x: e, y: t }) {
  return { top: t.min, right: e.max, bottom: t.max, left: e.min };
}
function QE(e, t) {
  if (!t)
    return e;
  const n = t({ x: e.left, y: e.top }), r = t({ x: e.right, y: e.bottom });
  return {
    top: n.y,
    left: n.x,
    bottom: r.y,
    right: r.x
  };
}
function Dl(e) {
  return e === void 0 || e === 1;
}
function Bc({ scale: e, scaleX: t, scaleY: n }) {
  return !Dl(e) || !Dl(t) || !Dl(n);
}
function Ir(e) {
  return Bc(e) || Zy(e) || e.z || e.rotate || e.rotateX || e.rotateY || e.skewX || e.skewY;
}
function Zy(e) {
  return wh(e.x) || wh(e.y);
}
function wh(e) {
  return e && e !== "0%";
}
function Qs(e, t, n) {
  const r = e - n, o = t * r;
  return n + o;
}
function xh(e, t, n, r, o) {
  return o !== void 0 && (e = Qs(e, o, r)), Qs(e, n, r) + t;
}
function zc(e, t = 0, n = 1, r, o) {
  e.min = xh(e.min, t, n, r, o), e.max = xh(e.max, t, n, r, o);
}
function Xy(e, { x: t, y: n }) {
  zc(e.x, t.translate, t.scale, t.originPoint), zc(e.y, n.translate, n.scale, n.originPoint);
}
const Th = 0.999999999999, Sh = 1.0000000000001;
function JE(e, t, n, r = !1) {
  const o = n.length;
  if (!o)
    return;
  t.x = t.y = 1;
  let i, s;
  for (let a = 0; a < o; a++) {
    i = n[a], s = i.projectionDelta;
    const { visualElement: l } = i.options;
    l && l.props.style && l.props.style.display === "contents" || (r && i.options.layoutScroll && i.scroll && i !== i.root && go(e, {
      x: -i.scroll.offset.x,
      y: -i.scroll.offset.y
    }), s && (t.x *= s.x.scale, t.y *= s.y.scale, Xy(e, s)), r && Ir(i.latestValues) && go(e, i.latestValues));
  }
  t.x < Sh && t.x > Th && (t.x = 1), t.y < Sh && t.y > Th && (t.y = 1);
}
function rr(e, t) {
  e.min = e.min + t, e.max = e.max + t;
}
function Eh(e, t, n, r, o = 0.5) {
  const i = tt(e.min, e.max, o);
  zc(e, t, n, i, r);
}
function go(e, t) {
  Eh(e.x, t.x, t.scaleX, t.scale, t.originX), Eh(e.y, t.y, t.scaleY, t.scale, t.originY);
}
function Qy(e, t) {
  return Ky(QE(e.getBoundingClientRect(), t));
}
function eC(e, t, n) {
  const r = Qy(e, n), { scroll: o } = t;
  return o && (rr(r.x, o.offset.x), rr(r.y, o.offset.y)), r;
}
const Jy = ({ current: e }) => e ? e.ownerDocument.defaultView : null, tC = /* @__PURE__ */ new WeakMap();
class nC {
  constructor(t) {
    this.openGlobalLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = { x: 0, y: 0 }, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = pt(), this.visualElement = t;
  }
  start(t, { snapToCursor: n = !1 } = {}) {
    const { presenceContext: r } = this.visualElement;
    if (r && r.isPresent === !1)
      return;
    const o = (u) => {
      const { dragSnapToOrigin: d } = this.getProps();
      d ? this.pauseAnimation() : this.stopAnimation(), n && this.snapToCursor(za(u, "page").point);
    }, i = (u, d) => {
      var f;
      const { drag: h, dragPropagation: p, onDragStart: m } = this.getProps();
      if (h && !p && (this.openGlobalLock && this.openGlobalLock(), this.openGlobalLock = ay(h), !this.openGlobalLock))
        return;
      this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), sn((v) => {
        let b = this.getAxisMotionValue(v).get() || 0;
        if (kn.test(b)) {
          const { projection: y } = this.visualElement;
          if (y && y.layout) {
            const x = y.layout.layoutBox[v];
            x && (b = nn(x) * (parseFloat(b) / 100));
          }
        }
        this.originPoint[v] = b;
      }), m && Ne.postRender(() => m(u, d)), (f = this.removeWillChange) === null || f === void 0 || f.call(this), this.removeWillChange = Vc(this.visualElement, "transform");
      const { animationState: g } = this.visualElement;
      g && g.setActive("whileDrag", !0);
    }, s = (u, d) => {
      const { dragPropagation: f, dragDirectionLock: h, onDirectionLock: p, onDrag: m } = this.getProps();
      if (!f && !this.openGlobalLock)
        return;
      const { offset: g } = d;
      if (h && this.currentDirection === null) {
        this.currentDirection = rC(g), this.currentDirection !== null && p && p(this.currentDirection);
        return;
      }
      this.updateAxis("x", d.point, g), this.updateAxis("y", d.point, g), this.visualElement.render(), m && m(u, d);
    }, a = (u, d) => this.stop(u, d), l = () => sn((u) => {
      var d;
      return this.getAnimationState(u) === "paused" && ((d = this.getAxisMotionValue(u).animation) === null || d === void 0 ? void 0 : d.play());
    }), { dragSnapToOrigin: c } = this.getProps();
    this.panSession = new Uy(t, {
      onSessionStart: o,
      onStart: i,
      onMove: s,
      onSessionEnd: a,
      resumeAnimation: l
    }, {
      transformPagePoint: this.visualElement.getTransformPagePoint(),
      dragSnapToOrigin: c,
      contextWindow: Jy(this.visualElement)
    });
  }
  stop(t, n) {
    var r;
    (r = this.removeWillChange) === null || r === void 0 || r.call(this);
    const o = this.isDragging;
    if (this.cancel(), !o)
      return;
    const { velocity: i } = n;
    this.startAnimation(i);
    const { onDragEnd: s } = this.getProps();
    s && Ne.postRender(() => s(t, n));
  }
  cancel() {
    this.isDragging = !1;
    const { projection: t, animationState: n } = this.visualElement;
    t && (t.isAnimationBlocked = !1), this.panSession && this.panSession.end(), this.panSession = void 0;
    const { dragPropagation: r } = this.getProps();
    !r && this.openGlobalLock && (this.openGlobalLock(), this.openGlobalLock = null), n && n.setActive("whileDrag", !1);
  }
  updateAxis(t, n, r) {
    const { drag: o } = this.getProps();
    if (!r || !xs(t, o, this.currentDirection))
      return;
    const i = this.getAxisMotionValue(t);
    let s = this.originPoint[t] + r[t];
    this.constraints && this.constraints[t] && (s = UE(s, this.constraints[t], this.elastic[t])), i.set(s);
  }
  resolveConstraints() {
    var t;
    const { dragConstraints: n, dragElastic: r } = this.getProps(), o = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : (t = this.visualElement.projection) === null || t === void 0 ? void 0 : t.layout, i = this.constraints;
    n && ho(n) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : n && o ? this.constraints = GE(o.layoutBox, n) : this.constraints = !1, this.elastic = ZE(r), i !== this.constraints && o && this.constraints && !this.hasMutatedConstraints && sn((s) => {
      this.constraints !== !1 && this.getAxisMotionValue(s) && (this.constraints[s] = KE(o.layoutBox[s], this.constraints[s]));
    });
  }
  resolveRefConstraints() {
    const { dragConstraints: t, onMeasureDragConstraints: n } = this.getProps();
    if (!t || !ho(t))
      return !1;
    const r = t.current;
    hn(r !== null, "If `dragConstraints` is set as a React ref, that ref must be passed to another component's `ref` prop.");
    const { projection: o } = this.visualElement;
    if (!o || !o.layout)
      return !1;
    const i = eC(r, o.root, this.visualElement.getTransformPagePoint());
    let s = YE(o.layout.layoutBox, i);
    if (n) {
      const a = n(XE(s));
      this.hasMutatedConstraints = !!a, a && (s = Ky(a));
    }
    return s;
  }
  startAnimation(t) {
    const { drag: n, dragMomentum: r, dragElastic: o, dragTransition: i, dragSnapToOrigin: s, onDragTransitionEnd: a } = this.getProps(), l = this.constraints || {}, c = sn((u) => {
      if (!xs(u, n, this.currentDirection))
        return;
      let d = l && l[u] || {};
      s && (d = { min: 0, max: 0 });
      const f = o ? 200 : 1e6, h = o ? 40 : 1e7, p = {
        type: "inertia",
        velocity: r ? t[u] : 0,
        bounceStiffness: f,
        bounceDamping: h,
        timeConstant: 750,
        restDelta: 1,
        restSpeed: 10,
        ...i,
        ...d
      };
      return this.startAxisValueAnimation(u, p);
    });
    return Promise.all(c).then(a);
  }
  startAxisValueAnimation(t, n) {
    const r = this.getAxisMotionValue(t);
    return r.start(od(t, r, 0, n, this.visualElement, !1, Vc(this.visualElement, t)));
  }
  stopAnimation() {
    sn((t) => this.getAxisMotionValue(t).stop());
  }
  pauseAnimation() {
    sn((t) => {
      var n;
      return (n = this.getAxisMotionValue(t).animation) === null || n === void 0 ? void 0 : n.pause();
    });
  }
  getAnimationState(t) {
    var n;
    return (n = this.getAxisMotionValue(t).animation) === null || n === void 0 ? void 0 : n.state;
  }
  /**
   * Drag works differently depending on which props are provided.
   *
   * - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.
   * - Otherwise, we apply the delta to the x/y motion values.
   */
  getAxisMotionValue(t) {
    const n = `_drag${t.toUpperCase()}`, r = this.visualElement.getProps(), o = r[n];
    return o || this.visualElement.getValue(t, (r.initial ? r.initial[t] : void 0) || 0);
  }
  snapToCursor(t) {
    sn((n) => {
      const { drag: r } = this.getProps();
      if (!xs(n, r, this.currentDirection))
        return;
      const { projection: o } = this.visualElement, i = this.getAxisMotionValue(n);
      if (o && o.layout) {
        const { min: s, max: a } = o.layout.layoutBox[n];
        i.set(t[n] - tt(s, a, 0.5));
      }
    });
  }
  /**
   * When the viewport resizes we want to check if the measured constraints
   * have changed and, if so, reposition the element within those new constraints
   * relative to where it was before the resize.
   */
  scalePositionWithinConstraints() {
    if (!this.visualElement.current)
      return;
    const { drag: t, dragConstraints: n } = this.getProps(), { projection: r } = this.visualElement;
    if (!ho(n) || !r || !this.constraints)
      return;
    this.stopAnimation();
    const o = { x: 0, y: 0 };
    sn((s) => {
      const a = this.getAxisMotionValue(s);
      if (a && this.constraints !== !1) {
        const l = a.get();
        o[s] = qE({ min: l, max: l }, this.constraints[s]);
      }
    });
    const { transformTemplate: i } = this.visualElement.getProps();
    this.visualElement.current.style.transform = i ? i({}, "") : "none", r.root && r.root.updateScroll(), r.updateLayout(), this.resolveConstraints(), sn((s) => {
      if (!xs(s, t, null))
        return;
      const a = this.getAxisMotionValue(s), { min: l, max: c } = this.constraints[s];
      a.set(tt(l, c, o[s]));
    });
  }
  addListeners() {
    if (!this.visualElement.current)
      return;
    tC.set(this.visualElement, this);
    const t = this.visualElement.current, n = zn(t, "pointerdown", (l) => {
      const { drag: c, dragListener: u = !0 } = this.getProps();
      c && u && this.start(l);
    }), r = () => {
      const { dragConstraints: l } = this.getProps();
      ho(l) && l.current && (this.constraints = this.resolveRefConstraints());
    }, { projection: o } = this.visualElement, i = o.addEventListener("measure", r);
    o && !o.layout && (o.root && o.root.updateScroll(), o.updateLayout()), Ne.read(r);
    const s = $n(window, "resize", () => this.scalePositionWithinConstraints()), a = o.addEventListener("didUpdate", ({ delta: l, hasLayoutChanged: c }) => {
      this.isDragging && c && (sn((u) => {
        const d = this.getAxisMotionValue(u);
        d && (this.originPoint[u] += l[u].translate, d.set(d.get() + l[u].translate));
      }), this.visualElement.render());
    });
    return () => {
      s(), n(), i(), a && a();
    };
  }
  getProps() {
    const t = this.visualElement.getProps(), { drag: n = !1, dragDirectionLock: r = !1, dragPropagation: o = !1, dragConstraints: i = !1, dragElastic: s = jc, dragMomentum: a = !0 } = t;
    return {
      ...t,
      drag: n,
      dragDirectionLock: r,
      dragPropagation: o,
      dragConstraints: i,
      dragElastic: s,
      dragMomentum: a
    };
  }
}
function xs(e, t, n) {
  return (t === !0 || t === e) && (n === null || n === e);
}
function rC(e, t = 10) {
  let n = null;
  return Math.abs(e.y) > t ? n = "y" : Math.abs(e.x) > t && (n = "x"), n;
}
class oC extends wr {
  constructor(t) {
    super(t), this.removeGroupControls = Mt, this.removeListeners = Mt, this.controls = new nC(t);
  }
  mount() {
    const { dragControls: t } = this.node.getProps();
    t && (this.removeGroupControls = t.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || Mt;
  }
  unmount() {
    this.removeGroupControls(), this.removeListeners();
  }
}
const Ch = (e) => (t, n) => {
  e && Ne.postRender(() => e(t, n));
};
class iC extends wr {
  constructor() {
    super(...arguments), this.removePointerDownListener = Mt;
  }
  onPointerDown(t) {
    this.session = new Uy(t, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: Jy(this.node)
    });
  }
  createPanHandlers() {
    const { onPanSessionStart: t, onPanStart: n, onPan: r, onPanEnd: o } = this.node.getProps();
    return {
      onSessionStart: Ch(t),
      onStart: Ch(n),
      onMove: r,
      onEnd: (i, s) => {
        delete this.session, o && Ne.postRender(() => o(i, s));
      }
    };
  }
  mount() {
    this.removePointerDownListener = zn(this.node.current, "pointerdown", (t) => this.onPointerDown(t));
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    this.removePointerDownListener(), this.session && this.session.end();
  }
}
function sC() {
  const e = Qe(Fa);
  if (e === null)
    return [!0, null];
  const { isPresent: t, onExitComplete: n, register: r } = e, o = Yn();
  return xe(() => r(o), []), !t && n ? [!1, () => n && n(o)] : [!0];
}
const Ds = {
  /**
   * Global flag as to whether the tree has animated since the last time
   * we resized the window
   */
  hasAnimatedSinceResize: !0,
  /**
   * We set this to true once, on the first update. Any nodes added to the tree beyond that
   * update will be given a `data-projection-id` attribute.
   */
  hasEverUpdated: !1
};
function Ph(e, t) {
  return t.max === t.min ? 0 : e / (t.max - t.min) * 100;
}
const ai = {
  correct: (e, t) => {
    if (!t.target)
      return e;
    if (typeof e == "string")
      if (fe.test(e))
        e = parseFloat(e);
      else
        return e;
    const n = Ph(e, t.target.x), r = Ph(e, t.target.y);
    return `${n}% ${r}%`;
  }
}, aC = {
  correct: (e, { treeScale: t, projectionDelta: n }) => {
    const r = e, o = dr.parse(e);
    if (o.length > 5)
      return r;
    const i = dr.createTransformer(e), s = typeof o[0] != "number" ? 1 : 0, a = n.x.scale * t.x, l = n.y.scale * t.y;
    o[0 + s] /= a, o[1 + s] /= l;
    const c = tt(a, l, 0.5);
    return typeof o[2 + s] == "number" && (o[2 + s] /= c), typeof o[3 + s] == "number" && (o[3 + s] /= c), i(o);
  }
};
class lC extends z0 {
  /**
   * This only mounts projection nodes for components that
   * need measuring, we might want to do it for all components
   * in order to incorporate transforms
   */
  componentDidMount() {
    const { visualElement: t, layoutGroup: n, switchLayoutGroup: r, layoutId: o } = this.props, { projection: i } = t;
    nT(cC), i && (n.group && n.group.add(i), r && r.register && o && r.register(i), i.root.didUpdate(), i.addEventListener("animationComplete", () => {
      this.safeToRemove();
    }), i.setOptions({
      ...i.options,
      onExitComplete: () => this.safeToRemove()
    })), Ds.hasEverUpdated = !0;
  }
  getSnapshotBeforeUpdate(t) {
    const { layoutDependency: n, visualElement: r, drag: o, isPresent: i } = this.props, s = r.projection;
    return s && (s.isPresent = i, o || t.layoutDependency !== n || n === void 0 ? s.willUpdate() : this.safeToRemove(), t.isPresent !== i && (i ? s.promote() : s.relegate() || Ne.postRender(() => {
      const a = s.getStack();
      (!a || !a.members.length) && this.safeToRemove();
    }))), null;
  }
  componentDidUpdate() {
    const { projection: t } = this.props.visualElement;
    t && (t.root.didUpdate(), Lu.postRender(() => {
      !t.currentAnimation && t.isLead() && this.safeToRemove();
    }));
  }
  componentWillUnmount() {
    const { visualElement: t, layoutGroup: n, switchLayoutGroup: r } = this.props, { projection: o } = t;
    o && (o.scheduleCheckAfterUnmount(), n && n.group && n.group.remove(o), r && r.deregister && r.deregister(o));
  }
  safeToRemove() {
    const { safeToRemove: t } = this.props;
    t && t();
  }
  render() {
    return null;
  }
}
function ev(e) {
  const [t, n] = sC(), r = Qe(Ai);
  return S(lC, { ...e, layoutGroup: r, switchLayoutGroup: Qe(Bg), isPresent: t, safeToRemove: n });
}
const cC = {
  borderRadius: {
    ...ai,
    applyTo: [
      "borderTopLeftRadius",
      "borderTopRightRadius",
      "borderBottomLeftRadius",
      "borderBottomRightRadius"
    ]
  },
  borderTopLeftRadius: ai,
  borderTopRightRadius: ai,
  borderBottomLeftRadius: ai,
  borderBottomRightRadius: ai,
  boxShadow: aC
}, tv = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"], uC = tv.length, Rh = (e) => typeof e == "string" ? parseFloat(e) : e, kh = (e) => typeof e == "number" || fe.test(e);
function dC(e, t, n, r, o, i) {
  o ? (e.opacity = tt(
    0,
    // TODO Reinstate this if only child
    n.opacity !== void 0 ? n.opacity : 1,
    fC(r)
  ), e.opacityExit = tt(t.opacity !== void 0 ? t.opacity : 1, 0, hC(r))) : i && (e.opacity = tt(t.opacity !== void 0 ? t.opacity : 1, n.opacity !== void 0 ? n.opacity : 1, r));
  for (let s = 0; s < uC; s++) {
    const a = `border${tv[s]}Radius`;
    let l = Oh(t, a), c = Oh(n, a);
    if (l === void 0 && c === void 0)
      continue;
    l || (l = 0), c || (c = 0), l === 0 || c === 0 || kh(l) === kh(c) ? (e[a] = Math.max(tt(Rh(l), Rh(c), r), 0), (kn.test(c) || kn.test(l)) && (e[a] += "%")) : e[a] = c;
  }
  (t.rotate || n.rotate) && (e.rotate = tt(t.rotate || 0, n.rotate || 0, r));
}
function Oh(e, t) {
  return e[t] !== void 0 ? e[t] : e.borderRadius;
}
const fC = nv(0, 0.5, My), hC = nv(0.5, 0.95, Mt);
function nv(e, t, n) {
  return (r) => r < e ? 0 : r > t ? 1 : n(Mi(e, t, r));
}
function Ih(e, t) {
  e.min = t.min, e.max = t.max;
}
function on(e, t) {
  Ih(e.x, t.x), Ih(e.y, t.y);
}
function _h(e, t) {
  e.translate = t.translate, e.scale = t.scale, e.originPoint = t.originPoint, e.origin = t.origin;
}
function Ah(e, t, n, r, o) {
  return e -= t, e = Qs(e, 1 / n, r), o !== void 0 && (e = Qs(e, 1 / o, r)), e;
}
function pC(e, t = 0, n = 1, r = 0.5, o, i = e, s = e) {
  if (kn.test(t) && (t = parseFloat(t), t = tt(s.min, s.max, t / 100) - s.min), typeof t != "number")
    return;
  let a = tt(i.min, i.max, r);
  e === i && (a -= t), e.min = Ah(e.min, t, n, a, o), e.max = Ah(e.max, t, n, a, o);
}
function Dh(e, t, [n, r, o], i, s) {
  pC(e, t[n], t[r], t[o], t.scale, i, s);
}
const mC = ["x", "scaleX", "originX"], gC = ["y", "scaleY", "originY"];
function Mh(e, t, n, r) {
  Dh(e.x, t, mC, n ? n.x : void 0, r ? r.x : void 0), Dh(e.y, t, gC, n ? n.y : void 0, r ? r.y : void 0);
}
function Nh(e) {
  return e.translate === 0 && e.scale === 1;
}
function rv(e) {
  return Nh(e.x) && Nh(e.y);
}
function yC(e, t) {
  return e.x.min === t.x.min && e.x.max === t.x.max && e.y.min === t.y.min && e.y.max === t.y.max;
}
function ov(e, t) {
  return Math.round(e.x.min) === Math.round(t.x.min) && Math.round(e.x.max) === Math.round(t.x.max) && Math.round(e.y.min) === Math.round(t.y.min) && Math.round(e.y.max) === Math.round(t.y.max);
}
function Fh(e) {
  return nn(e.x) / nn(e.y);
}
function Lh(e, t) {
  return e.translate === t.translate && e.scale === t.scale && e.originPoint === t.originPoint;
}
class vC {
  constructor() {
    this.members = [];
  }
  add(t) {
    ja(this.members, t), t.scheduleRender();
  }
  remove(t) {
    if (Ba(this.members, t), t === this.prevLead && (this.prevLead = void 0), t === this.lead) {
      const n = this.members[this.members.length - 1];
      n && this.promote(n);
    }
  }
  relegate(t) {
    const n = this.members.findIndex((o) => t === o);
    if (n === 0)
      return !1;
    let r;
    for (let o = n; o >= 0; o--) {
      const i = this.members[o];
      if (i.isPresent !== !1) {
        r = i;
        break;
      }
    }
    return r ? (this.promote(r), !0) : !1;
  }
  promote(t, n) {
    const r = this.lead;
    if (t !== r && (this.prevLead = r, this.lead = t, t.show(), r)) {
      r.instance && r.scheduleRender(), t.scheduleRender(), t.resumeFrom = r, n && (t.resumeFrom.preserveOpacity = !0), r.snapshot && (t.snapshot = r.snapshot, t.snapshot.latestValues = r.animationValues || r.latestValues), t.root && t.root.isUpdating && (t.isLayoutDirty = !0);
      const { crossfade: o } = t.options;
      o === !1 && r.hide();
    }
  }
  exitAnimationComplete() {
    this.members.forEach((t) => {
      const { options: n, resumingFrom: r } = t;
      n.onExitComplete && n.onExitComplete(), r && r.options.onExitComplete && r.options.onExitComplete();
    });
  }
  scheduleRender() {
    this.members.forEach((t) => {
      t.instance && t.scheduleRender(!1);
    });
  }
  /**
   * Clear any leads that have been removed this render to prevent them from being
   * used in future animations and to prevent memory leaks
   */
  removeLeadSnapshot() {
    this.lead && this.lead.snapshot && (this.lead.snapshot = void 0);
  }
}
function bC(e, t, n) {
  let r = "";
  const o = e.x.translate / t.x, i = e.y.translate / t.y, s = (n == null ? void 0 : n.z) || 0;
  if ((o || i || s) && (r = `translate3d(${o}px, ${i}px, ${s}px) `), (t.x !== 1 || t.y !== 1) && (r += `scale(${1 / t.x}, ${1 / t.y}) `), n) {
    const { transformPerspective: c, rotate: u, rotateX: d, rotateY: f, skewX: h, skewY: p } = n;
    c && (r = `perspective(${c}px) ${r}`), u && (r += `rotate(${u}deg) `), d && (r += `rotateX(${d}deg) `), f && (r += `rotateY(${f}deg) `), h && (r += `skewX(${h}deg) `), p && (r += `skewY(${p}deg) `);
  }
  const a = e.x.scale * t.x, l = e.y.scale * t.y;
  return (a !== 1 || l !== 1) && (r += `scale(${a}, ${l})`), r || "none";
}
const wC = (e, t) => e.depth - t.depth;
class xC {
  constructor() {
    this.children = [], this.isDirty = !1;
  }
  add(t) {
    ja(this.children, t), this.isDirty = !0;
  }
  remove(t) {
    Ba(this.children, t), this.isDirty = !0;
  }
  forEach(t) {
    this.isDirty && this.children.sort(wC), this.isDirty = !1, this.children.forEach(t);
  }
}
function TC(e, t) {
  const n = ar.now(), r = ({ timestamp: o }) => {
    const i = o - n;
    i >= t && (On(r), e(i - t));
  };
  return Ne.read(r, !0), () => On(r);
}
function SC(e) {
  return e instanceof SVGElement && e.tagName !== "svg";
}
function EC(e, t, n) {
  const r = Dt(e) ? e : Io(e);
  return r.start(od("", r, t, n)), r.animation;
}
const _r = {
  type: "projectionFrame",
  totalNodes: 0,
  resolvedTargetDeltas: 0,
  recalculatedProjection: 0
}, Ml = ["", "X", "Y", "Z"], CC = { visibility: "hidden" }, Vh = 1e3;
let PC = 0;
function Nl(e, t, n, r) {
  const { latestValues: o } = t;
  o[e] && (n[e] = o[e], t.setStaticValue(e, 0), r && (r[e] = 0));
}
function iv(e) {
  if (e.hasCheckedOptimisedAppear = !0, e.root === e)
    return !1;
  const { visualElement: t } = e.options;
  return t ? Wy(t) ? !0 : e.parent && !e.parent.hasCheckedOptimisedAppear ? iv(e.parent) : !1 : !1;
}
function sv({ attachResizeListener: e, defaultParent: t, measureScroll: n, checkIsScrollRoot: r, resetTransform: o }) {
  return class {
    constructor(s = {}, a = t == null ? void 0 : t()) {
      this.id = PC++, this.animationId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = { x: 1, y: 1 }, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
        this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
      }, this.updateProjection = () => {
        this.projectionUpdateScheduled = !1, window.MotionDebug && (_r.totalNodes = _r.resolvedTargetDeltas = _r.recalculatedProjection = 0), this.nodes.forEach(OC), this.nodes.forEach(MC), this.nodes.forEach(NC), this.nodes.forEach(IC), window.MotionDebug && window.MotionDebug.record(_r);
      }, this.resolvedRelativeTargetAt = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = s, this.root = a ? a.root || a : this, this.path = a ? [...a.path, a] : [], this.parent = a, this.depth = a ? a.depth + 1 : 0;
      for (let l = 0; l < this.path.length; l++)
        this.path[l].shouldResetTransform = !0;
      this.root === this && (this.nodes = new xC());
    }
    addEventListener(s, a) {
      return this.eventHandlers.has(s) || this.eventHandlers.set(s, new id()), this.eventHandlers.get(s).add(a);
    }
    notifyListeners(s, ...a) {
      const l = this.eventHandlers.get(s);
      l && l.notify(...a);
    }
    hasListeners(s) {
      return this.eventHandlers.has(s);
    }
    /**
     * Lifecycles
     */
    mount(s, a = this.root.hasTreeAnimated) {
      if (this.instance)
        return;
      this.isSVG = SC(s), this.instance = s;
      const { layoutId: l, layout: c, visualElement: u } = this.options;
      if (u && !u.current && u.mount(s), this.root.nodes.add(this), this.parent && this.parent.children.add(this), a && (c || l) && (this.isLayoutDirty = !0), e) {
        let d;
        const f = () => this.root.updateBlockedByResize = !1;
        e(s, () => {
          this.root.updateBlockedByResize = !0, d && d(), d = TC(f, 250), Ds.hasAnimatedSinceResize && (Ds.hasAnimatedSinceResize = !1, this.nodes.forEach(jh));
        });
      }
      l && this.root.registerSharedNode(l, this), this.options.animate !== !1 && u && (l || c) && this.addEventListener("didUpdate", ({ delta: d, hasLayoutChanged: f, hasRelativeTargetChanged: h, layout: p }) => {
        if (this.isTreeAnimationBlocked()) {
          this.target = void 0, this.relativeTarget = void 0;
          return;
        }
        const m = this.options.transition || u.getDefaultTransition() || jC, { onLayoutAnimationStart: g, onLayoutAnimationComplete: v } = u.getProps(), b = !this.targetLayout || !ov(this.targetLayout, p) || h, y = !f && h;
        if (this.options.layoutRoot || this.resumeFrom && this.resumeFrom.instance || y || f && (b || !this.currentAnimation)) {
          this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0), this.setAnimationOrigin(d, y);
          const x = {
            ...Ku(m, "layout"),
            onPlay: g,
            onComplete: v
          };
          (u.shouldReduceMotion || this.options.layoutRoot) && (x.delay = 0, x.type = !1), this.startAnimation(x);
        } else
          f || jh(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
        this.targetLayout = p;
      });
    }
    unmount() {
      this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
      const s = this.getStack();
      s && s.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, On(this.updateProjection);
    }
    // only on the root
    blockUpdate() {
      this.updateManuallyBlocked = !0;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = !1;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || !1;
    }
    // Note: currently only running on root node
    startUpdate() {
      this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(FC), this.animationId++);
    }
    getTransformTemplate() {
      const { visualElement: s } = this.options;
      return s && s.getProps().transformTemplate;
    }
    willUpdate(s = !0) {
      if (this.root.hasTreeAnimated = !0, this.root.isUpdateBlocked()) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (window.HandoffCancelAllAnimations && iv(this) && window.HandoffCancelAllAnimations(), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty)
        return;
      this.isLayoutDirty = !0;
      for (let u = 0; u < this.path.length; u++) {
        const d = this.path[u];
        d.shouldResetTransform = !0, d.updateScroll("snapshot"), d.options.layoutRoot && d.willUpdate(!1);
      }
      const { layoutId: a, layout: l } = this.options;
      if (a === void 0 && !l)
        return;
      const c = this.getTransformTemplate();
      this.prevTransformTemplateValue = c ? c(this.latestValues, "") : void 0, this.updateSnapshot(), s && this.notifyListeners("willUpdate");
    }
    update() {
      if (this.updateScheduled = !1, this.isUpdateBlocked()) {
        this.unblockUpdate(), this.clearAllSnapshots(), this.nodes.forEach($h);
        return;
      }
      this.isUpdating || this.nodes.forEach(AC), this.isUpdating = !1, this.nodes.forEach(DC), this.nodes.forEach(RC), this.nodes.forEach(kC), this.clearAllSnapshots();
      const a = ar.now();
      Ot.delta = ur(0, 1e3 / 60, a - Ot.timestamp), Ot.timestamp = a, Ot.isProcessing = !0, El.update.process(Ot), El.preRender.process(Ot), El.render.process(Ot), Ot.isProcessing = !1;
    }
    didUpdate() {
      this.updateScheduled || (this.updateScheduled = !0, Lu.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      this.nodes.forEach(_C), this.sharedNodes.forEach(LC);
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, Ne.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      Ne.postRender(() => {
        this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
      });
    }
    /**
     * Update measurements
     */
    updateSnapshot() {
      this.snapshot || !this.instance || (this.snapshot = this.measure());
    }
    updateLayout() {
      if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty))
        return;
      if (this.resumeFrom && !this.resumeFrom.instance)
        for (let l = 0; l < this.path.length; l++)
          this.path[l].updateScroll();
      const s = this.layout;
      this.layout = this.measure(!1), this.layoutCorrected = pt(), this.isLayoutDirty = !1, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
      const { visualElement: a } = this.options;
      a && a.notify("LayoutMeasure", this.layout.layoutBox, s ? s.layoutBox : void 0);
    }
    updateScroll(s = "measure") {
      let a = !!(this.options.layoutScroll && this.instance);
      this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === s && (a = !1), a && (this.scroll = {
        animationId: this.root.animationId,
        phase: s,
        isRoot: r(this.instance),
        offset: n(this.instance)
      });
    }
    resetTransform() {
      if (!o)
        return;
      const s = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout, a = this.projectionDelta && !rv(this.projectionDelta), l = this.getTransformTemplate(), c = l ? l(this.latestValues, "") : void 0, u = c !== this.prevTransformTemplateValue;
      s && (a || Ir(this.latestValues) || u) && (o(this.instance, c), this.shouldResetTransform = !1, this.scheduleRender());
    }
    measure(s = !0) {
      const a = this.measurePageBox();
      let l = this.removeElementScroll(a);
      return s && (l = this.removeTransform(l)), BC(l), {
        animationId: this.root.animationId,
        measuredBox: a,
        layoutBox: l,
        latestValues: {},
        source: this.id
      };
    }
    measurePageBox() {
      const { visualElement: s } = this.options;
      if (!s)
        return pt();
      const a = s.measureViewportBox(), { scroll: l } = this.root;
      return l && (rr(a.x, l.offset.x), rr(a.y, l.offset.y)), a;
    }
    removeElementScroll(s) {
      const a = pt();
      on(a, s);
      for (let l = 0; l < this.path.length; l++) {
        const c = this.path[l], { scroll: u, options: d } = c;
        if (c !== this.root && u && d.layoutScroll) {
          if (u.isRoot) {
            on(a, s);
            const { scroll: f } = this.root;
            f && (rr(a.x, -f.offset.x), rr(a.y, -f.offset.y));
          }
          rr(a.x, u.offset.x), rr(a.y, u.offset.y);
        }
      }
      return a;
    }
    applyTransform(s, a = !1) {
      const l = pt();
      on(l, s);
      for (let c = 0; c < this.path.length; c++) {
        const u = this.path[c];
        !a && u.options.layoutScroll && u.scroll && u !== u.root && go(l, {
          x: -u.scroll.offset.x,
          y: -u.scroll.offset.y
        }), Ir(u.latestValues) && go(l, u.latestValues);
      }
      return Ir(this.latestValues) && go(l, this.latestValues), l;
    }
    removeTransform(s) {
      const a = pt();
      on(a, s);
      for (let l = 0; l < this.path.length; l++) {
        const c = this.path[l];
        if (!c.instance || !Ir(c.latestValues))
          continue;
        Bc(c.latestValues) && c.updateSnapshot();
        const u = pt(), d = c.measurePageBox();
        on(u, d), Mh(a, c.latestValues, c.snapshot ? c.snapshot.layoutBox : void 0, u);
      }
      return Ir(this.latestValues) && Mh(a, this.latestValues), a;
    }
    setTargetDelta(s) {
      this.targetDelta = s, this.root.scheduleUpdateProjection(), this.isProjectionDirty = !0;
    }
    setOptions(s) {
      this.options = {
        ...this.options,
        ...s,
        crossfade: s.crossfade !== void 0 ? s.crossfade : !0
      };
    }
    clearMeasurements() {
      this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = !1;
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== Ot.timestamp && this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(s = !1) {
      var a;
      const l = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = l.isProjectionDirty), this.isTransformDirty || (this.isTransformDirty = l.isTransformDirty), this.isSharedProjectionDirty || (this.isSharedProjectionDirty = l.isSharedProjectionDirty);
      const c = !!this.resumingFrom || this !== l;
      if (!(s || c && this.isSharedProjectionDirty || this.isProjectionDirty || !((a = this.parent) === null || a === void 0) && a.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize))
        return;
      const { layout: d, layoutId: f } = this.options;
      if (!(!this.layout || !(d || f))) {
        if (this.resolvedRelativeTargetAt = Ot.timestamp, !this.targetDelta && !this.relativeTarget) {
          const h = this.getClosestProjectingParent();
          h && h.layout && this.animationProgress !== 1 ? (this.relativeParent = h, this.forceRelativeParentToResolveTarget(), this.relativeTarget = pt(), this.relativeTargetOrigin = pt(), xi(this.relativeTargetOrigin, this.layout.layoutBox, h.layout.layoutBox), on(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
        }
        if (!(!this.relativeTarget && !this.targetDelta)) {
          if (this.target || (this.target = pt(), this.targetWithTransforms = pt()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), HE(this.target, this.relativeTarget, this.relativeParent.target)) : this.targetDelta ? (this.resumingFrom ? this.target = this.applyTransform(this.layout.layoutBox) : on(this.target, this.layout.layoutBox), Xy(this.target, this.targetDelta)) : on(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget) {
            this.attemptToResolveRelativeTarget = !1;
            const h = this.getClosestProjectingParent();
            h && !!h.resumingFrom == !!this.resumingFrom && !h.options.layoutScroll && h.target && this.animationProgress !== 1 ? (this.relativeParent = h, this.forceRelativeParentToResolveTarget(), this.relativeTarget = pt(), this.relativeTargetOrigin = pt(), xi(this.relativeTargetOrigin, this.target, h.target), on(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
          }
          window.MotionDebug && _r.resolvedTargetDeltas++;
        }
      }
    }
    getClosestProjectingParent() {
      if (!(!this.parent || Bc(this.parent.latestValues) || Zy(this.parent.latestValues)))
        return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
    }
    calcProjection() {
      var s;
      const a = this.getLead(), l = !!this.resumingFrom || this !== a;
      let c = !0;
      if ((this.isProjectionDirty || !((s = this.parent) === null || s === void 0) && s.isProjectionDirty) && (c = !1), l && (this.isSharedProjectionDirty || this.isTransformDirty) && (c = !1), this.resolvedRelativeTargetAt === Ot.timestamp && (c = !1), c)
        return;
      const { layout: u, layoutId: d } = this.options;
      if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(u || d))
        return;
      on(this.layoutCorrected, this.layout.layoutBox);
      const f = this.treeScale.x, h = this.treeScale.y;
      JE(this.layoutCorrected, this.treeScale, this.path, l), a.layout && !a.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (a.target = a.layout.layoutBox, a.targetWithTransforms = pt());
      const { target: p } = a;
      if (!p) {
        this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      !this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (_h(this.prevProjectionDelta.x, this.projectionDelta.x), _h(this.prevProjectionDelta.y, this.projectionDelta.y)), wi(this.projectionDelta, this.layoutCorrected, p, this.latestValues), (this.treeScale.x !== f || this.treeScale.y !== h || !Lh(this.projectionDelta.x, this.prevProjectionDelta.x) || !Lh(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", p)), window.MotionDebug && _r.recalculatedProjection++;
    }
    hide() {
      this.isVisible = !1;
    }
    show() {
      this.isVisible = !0;
    }
    scheduleRender(s = !0) {
      if (this.options.scheduleRender && this.options.scheduleRender(), s) {
        const a = this.getStack();
        a && a.scheduleRender();
      }
      this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
    }
    createProjectionDeltas() {
      this.prevProjectionDelta = mo(), this.projectionDelta = mo(), this.projectionDeltaWithTransform = mo();
    }
    setAnimationOrigin(s, a = !1) {
      const l = this.snapshot, c = l ? l.latestValues : {}, u = { ...this.latestValues }, d = mo();
      (!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !a;
      const f = pt(), h = l ? l.source : void 0, p = this.layout ? this.layout.source : void 0, m = h !== p, g = this.getStack(), v = !g || g.members.length <= 1, b = !!(m && !v && this.options.crossfade === !0 && !this.path.some($C));
      this.animationProgress = 0;
      let y;
      this.mixTargetDelta = (x) => {
        const w = x / 1e3;
        Bh(d.x, s.x, w), Bh(d.y, s.y, w), this.setTargetDelta(d), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (xi(f, this.layout.layoutBox, this.relativeParent.layout.layoutBox), VC(this.relativeTarget, this.relativeTargetOrigin, f, w), y && yC(this.relativeTarget, y) && (this.isProjectionDirty = !1), y || (y = pt()), on(y, this.relativeTarget)), m && (this.animationValues = u, dC(u, c, this.latestValues, w, b, v)), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = w;
      }, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(s) {
      this.notifyListeners("animationStart"), this.currentAnimation && this.currentAnimation.stop(), this.resumingFrom && this.resumingFrom.currentAnimation && this.resumingFrom.currentAnimation.stop(), this.pendingAnimation && (On(this.pendingAnimation), this.pendingAnimation = void 0), this.pendingAnimation = Ne.update(() => {
        Ds.hasAnimatedSinceResize = !0, this.currentAnimation = EC(0, Vh, {
          ...s,
          onUpdate: (a) => {
            this.mixTargetDelta(a), s.onUpdate && s.onUpdate(a);
          },
          onComplete: () => {
            s.onComplete && s.onComplete(), this.completeAnimation();
          }
        }), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
      });
    }
    completeAnimation() {
      this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
      const s = this.getStack();
      s && s.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete");
    }
    finishAnimation() {
      this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(Vh), this.currentAnimation.stop()), this.completeAnimation();
    }
    applyTransformsToTarget() {
      const s = this.getLead();
      let { targetWithTransforms: a, target: l, layout: c, latestValues: u } = s;
      if (!(!a || !l || !c)) {
        if (this !== s && this.layout && c && av(this.options.animationType, this.layout.layoutBox, c.layoutBox)) {
          l = this.target || pt();
          const d = nn(this.layout.layoutBox.x);
          l.x.min = s.target.x.min, l.x.max = l.x.min + d;
          const f = nn(this.layout.layoutBox.y);
          l.y.min = s.target.y.min, l.y.max = l.y.min + f;
        }
        on(a, l), go(a, u), wi(this.projectionDeltaWithTransform, this.layoutCorrected, a, u);
      }
    }
    registerSharedNode(s, a) {
      this.sharedNodes.has(s) || this.sharedNodes.set(s, new vC()), this.sharedNodes.get(s).add(a);
      const c = a.options.initialPromotionConfig;
      a.promote({
        transition: c ? c.transition : void 0,
        preserveFollowOpacity: c && c.shouldPreserveFollowOpacity ? c.shouldPreserveFollowOpacity(a) : void 0
      });
    }
    isLead() {
      const s = this.getStack();
      return s ? s.lead === this : !0;
    }
    getLead() {
      var s;
      const { layoutId: a } = this.options;
      return a ? ((s = this.getStack()) === null || s === void 0 ? void 0 : s.lead) || this : this;
    }
    getPrevLead() {
      var s;
      const { layoutId: a } = this.options;
      return a ? (s = this.getStack()) === null || s === void 0 ? void 0 : s.prevLead : void 0;
    }
    getStack() {
      const { layoutId: s } = this.options;
      if (s)
        return this.root.sharedNodes.get(s);
    }
    promote({ needsReset: s, transition: a, preserveFollowOpacity: l } = {}) {
      const c = this.getStack();
      c && c.promote(this, l), s && (this.projectionDelta = void 0, this.needsReset = !0), a && this.setOptions({ transition: a });
    }
    relegate() {
      const s = this.getStack();
      return s ? s.relegate(this) : !1;
    }
    resetSkewAndRotation() {
      const { visualElement: s } = this.options;
      if (!s)
        return;
      let a = !1;
      const { latestValues: l } = s;
      if ((l.z || l.rotate || l.rotateX || l.rotateY || l.rotateZ || l.skewX || l.skewY) && (a = !0), !a)
        return;
      const c = {};
      l.z && Nl("z", s, c, this.animationValues);
      for (let u = 0; u < Ml.length; u++)
        Nl(`rotate${Ml[u]}`, s, c, this.animationValues), Nl(`skew${Ml[u]}`, s, c, this.animationValues);
      s.render();
      for (const u in c)
        s.setStaticValue(u, c[u]), this.animationValues && (this.animationValues[u] = c[u]);
      s.scheduleRender();
    }
    getProjectionStyles(s) {
      var a, l;
      if (!this.instance || this.isSVG)
        return;
      if (!this.isVisible)
        return CC;
      const c = {
        visibility: ""
      }, u = this.getTransformTemplate();
      if (this.needsReset)
        return this.needsReset = !1, c.opacity = "", c.pointerEvents = _s(s == null ? void 0 : s.pointerEvents) || "", c.transform = u ? u(this.latestValues, "") : "none", c;
      const d = this.getLead();
      if (!this.projectionDelta || !this.layout || !d.target) {
        const m = {};
        return this.options.layoutId && (m.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1, m.pointerEvents = _s(s == null ? void 0 : s.pointerEvents) || ""), this.hasProjected && !Ir(this.latestValues) && (m.transform = u ? u({}, "") : "none", this.hasProjected = !1), m;
      }
      const f = d.animationValues || d.latestValues;
      this.applyTransformsToTarget(), c.transform = bC(this.projectionDeltaWithTransform, this.treeScale, f), u && (c.transform = u(f, c.transform));
      const { x: h, y: p } = this.projectionDelta;
      c.transformOrigin = `${h.origin * 100}% ${p.origin * 100}% 0`, d.animationValues ? c.opacity = d === this ? (l = (a = f.opacity) !== null && a !== void 0 ? a : this.latestValues.opacity) !== null && l !== void 0 ? l : 1 : this.preserveOpacity ? this.latestValues.opacity : f.opacityExit : c.opacity = d === this ? f.opacity !== void 0 ? f.opacity : "" : f.opacityExit !== void 0 ? f.opacityExit : 0;
      for (const m in Ys) {
        if (f[m] === void 0)
          continue;
        const { correct: g, applyTo: v } = Ys[m], b = c.transform === "none" ? f[m] : g(f[m], d);
        if (v) {
          const y = v.length;
          for (let x = 0; x < y; x++)
            c[v[x]] = b;
        } else
          c[m] = b;
      }
      return this.options.layoutId && (c.pointerEvents = d === this ? _s(s == null ? void 0 : s.pointerEvents) || "" : "none"), c;
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    // Only run on root
    resetTree() {
      this.root.nodes.forEach((s) => {
        var a;
        return (a = s.currentAnimation) === null || a === void 0 ? void 0 : a.stop();
      }), this.root.nodes.forEach($h), this.root.sharedNodes.clear();
    }
  };
}
function RC(e) {
  e.updateLayout();
}
function kC(e) {
  var t;
  const n = ((t = e.resumeFrom) === null || t === void 0 ? void 0 : t.snapshot) || e.snapshot;
  if (e.isLead() && e.layout && n && e.hasListeners("didUpdate")) {
    const { layoutBox: r, measuredBox: o } = e.layout, { animationType: i } = e.options, s = n.source !== e.layout.source;
    i === "size" ? sn((d) => {
      const f = s ? n.measuredBox[d] : n.layoutBox[d], h = nn(f);
      f.min = r[d].min, f.max = f.min + h;
    }) : av(i, n.layoutBox, r) && sn((d) => {
      const f = s ? n.measuredBox[d] : n.layoutBox[d], h = nn(r[d]);
      f.max = f.min + h, e.relativeTarget && !e.currentAnimation && (e.isProjectionDirty = !0, e.relativeTarget[d].max = e.relativeTarget[d].min + h);
    });
    const a = mo();
    wi(a, r, n.layoutBox);
    const l = mo();
    s ? wi(l, e.applyTransform(o, !0), n.measuredBox) : wi(l, r, n.layoutBox);
    const c = !rv(a);
    let u = !1;
    if (!e.resumeFrom) {
      const d = e.getClosestProjectingParent();
      if (d && !d.resumeFrom) {
        const { snapshot: f, layout: h } = d;
        if (f && h) {
          const p = pt();
          xi(p, n.layoutBox, f.layoutBox);
          const m = pt();
          xi(m, r, h.layoutBox), ov(p, m) || (u = !0), d.options.layoutRoot && (e.relativeTarget = m, e.relativeTargetOrigin = p, e.relativeParent = d);
        }
      }
    }
    e.notifyListeners("didUpdate", {
      layout: r,
      snapshot: n,
      delta: l,
      layoutDelta: a,
      hasLayoutChanged: c,
      hasRelativeTargetChanged: u
    });
  } else if (e.isLead()) {
    const { onExitComplete: r } = e.options;
    r && r();
  }
  e.options.transition = void 0;
}
function OC(e) {
  window.MotionDebug && _r.totalNodes++, e.parent && (e.isProjecting() || (e.isProjectionDirty = e.parent.isProjectionDirty), e.isSharedProjectionDirty || (e.isSharedProjectionDirty = !!(e.isProjectionDirty || e.parent.isProjectionDirty || e.parent.isSharedProjectionDirty)), e.isTransformDirty || (e.isTransformDirty = e.parent.isTransformDirty));
}
function IC(e) {
  e.isProjectionDirty = e.isSharedProjectionDirty = e.isTransformDirty = !1;
}
function _C(e) {
  e.clearSnapshot();
}
function $h(e) {
  e.clearMeasurements();
}
function AC(e) {
  e.isLayoutDirty = !1;
}
function DC(e) {
  const { visualElement: t } = e.options;
  t && t.getProps().onBeforeLayoutMeasure && t.notify("BeforeLayoutMeasure"), e.resetTransform();
}
function jh(e) {
  e.finishAnimation(), e.targetDelta = e.relativeTarget = e.target = void 0, e.isProjectionDirty = !0;
}
function MC(e) {
  e.resolveTargetDelta();
}
function NC(e) {
  e.calcProjection();
}
function FC(e) {
  e.resetSkewAndRotation();
}
function LC(e) {
  e.removeLeadSnapshot();
}
function Bh(e, t, n) {
  e.translate = tt(t.translate, 0, n), e.scale = tt(t.scale, 1, n), e.origin = t.origin, e.originPoint = t.originPoint;
}
function zh(e, t, n, r) {
  e.min = tt(t.min, n.min, r), e.max = tt(t.max, n.max, r);
}
function VC(e, t, n, r) {
  zh(e.x, t.x, n.x, r), zh(e.y, t.y, n.y, r);
}
function $C(e) {
  return e.animationValues && e.animationValues.opacityExit !== void 0;
}
const jC = {
  duration: 0.45,
  ease: [0.4, 0, 0.1, 1]
}, Wh = (e) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(e), Hh = Wh("applewebkit/") && !Wh("chrome/") ? Math.round : Mt;
function Uh(e) {
  e.min = Hh(e.min), e.max = Hh(e.max);
}
function BC(e) {
  Uh(e.x), Uh(e.y);
}
function av(e, t, n) {
  return e === "position" || e === "preserve-aspect" && !WE(Fh(t), Fh(n), 0.2);
}
const zC = sv({
  attachResizeListener: (e, t) => $n(e, "resize", t),
  measureScroll: () => ({
    x: document.documentElement.scrollLeft || document.body.scrollLeft,
    y: document.documentElement.scrollTop || document.body.scrollTop
  }),
  checkIsScrollRoot: () => !0
}), Fl = {
  current: void 0
}, lv = sv({
  measureScroll: (e) => ({
    x: e.scrollLeft,
    y: e.scrollTop
  }),
  defaultParent: () => {
    if (!Fl.current) {
      const e = new zC({});
      e.mount(window), e.setOptions({ layoutScroll: !0 }), Fl.current = e;
    }
    return Fl.current;
  },
  resetTransform: (e, t) => {
    e.style.transform = t !== void 0 ? t : "none";
  },
  checkIsScrollRoot: (e) => window.getComputedStyle(e).position === "fixed"
}), WC = {
  pan: {
    Feature: iC
  },
  drag: {
    Feature: oC,
    ProjectionNode: lv,
    MeasureLayout: ev
  }
}, Wc = { current: null }, cv = { current: !1 };
function HC() {
  if (cv.current = !0, !!Fu)
    if (window.matchMedia) {
      const e = window.matchMedia("(prefers-reduced-motion)"), t = () => Wc.current = e.matches;
      e.addListener(t), t();
    } else
      Wc.current = !1;
}
function UC(e, t, n) {
  for (const r in t) {
    const o = t[r], i = n[r];
    if (Dt(o))
      e.addValue(r, o), process.env.NODE_ENV === "development" && sd(o.version === "11.3.8", `Attempting to mix Framer Motion versions ${o.version} with 11.3.8 may not work as expected.`);
    else if (Dt(i))
      e.addValue(r, Io(o, { owner: e }));
    else if (i !== o)
      if (e.hasValue(r)) {
        const s = e.getValue(r);
        s.liveStyle === !0 ? s.jump(o) : s.hasAnimated || s.set(o);
      } else {
        const s = e.getStaticValue(r);
        e.addValue(r, Io(s !== void 0 ? s : o, { owner: e }));
      }
  }
  for (const r in n)
    t[r] === void 0 && e.removeValue(r);
  return t;
}
const Gh = /* @__PURE__ */ new WeakMap(), GC = [...my, Lt, dr], YC = (e) => GC.find(py(e)), Yh = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
], qC = $u.length;
class KC {
  /**
   * This method takes React props and returns found MotionValues. For example, HTML
   * MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
   *
   * This isn't an abstract method as it needs calling in the constructor, but it is
   * intended to be one.
   */
  scrapeMotionValuesFromProps(t, n, r) {
    return {};
  }
  constructor({ parent: t, props: n, presenceContext: r, reducedMotionConfig: o, blockInitialAnimation: i, visualState: s }, a = {}) {
    this.applyWillChange = !1, this.resolveKeyframes = (f, h, p, m) => new this.KeyframeResolver(f, h, p, m, this), this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = Zu, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
      this.isRenderScheduled = !1, this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
    }, this.isRenderScheduled = !1, this.scheduleRender = () => {
      this.isRenderScheduled || (this.isRenderScheduled = !0, Ne.render(this.render, !1, !0));
    };
    const { latestValues: l, renderState: c } = s;
    this.latestValues = l, this.baseTarget = { ...l }, this.initialValues = n.initial ? { ...l } : {}, this.renderState = c, this.parent = t, this.props = n, this.presenceContext = r, this.depth = t ? t.depth + 1 : 0, this.reducedMotionConfig = o, this.options = a, this.blockInitialAnimation = !!i, this.isControllingVariants = $a(n), this.isVariantNode = Wg(n), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(t && t.current);
    const { willChange: u, ...d } = this.scrapeMotionValuesFromProps(n, {}, this);
    for (const f in d) {
      const h = d[f];
      l[f] !== void 0 && Dt(h) && h.set(l[f], !1);
    }
  }
  mount(t) {
    this.current = t, Gh.set(t, this), this.projection && !this.projection.instance && this.projection.mount(t), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach((n, r) => this.bindToMotionValue(r, n)), cv.current || HC(), this.shouldReduceMotion = this.reducedMotionConfig === "never" ? !1 : this.reducedMotionConfig === "always" ? !0 : Wc.current, process.env.NODE_ENV !== "production" && sd(this.shouldReduceMotion !== !0, "You have Reduced Motion enabled on your device. Animations may not appear as expected."), this.parent && this.parent.children.add(this), this.update(this.props, this.presenceContext);
  }
  unmount() {
    Gh.delete(this.current), this.projection && this.projection.unmount(), On(this.notifyUpdate), On(this.render), this.valueSubscriptions.forEach((t) => t()), this.removeFromVariantTree && this.removeFromVariantTree(), this.parent && this.parent.children.delete(this);
    for (const t in this.events)
      this.events[t].clear();
    for (const t in this.features) {
      const n = this.features[t];
      n && (n.unmount(), n.isMounted = !1);
    }
    this.current = null;
  }
  bindToMotionValue(t, n) {
    const r = vr.has(t), o = n.on("change", (s) => {
      this.latestValues[t] = s, this.props.onUpdate && Ne.preRender(this.notifyUpdate), r && this.projection && (this.projection.isTransformDirty = !0);
    }), i = n.on("renderRequest", this.scheduleRender);
    this.valueSubscriptions.set(t, () => {
      o(), i(), n.owner && n.stop();
    });
  }
  sortNodePosition(t) {
    return !this.current || !this.sortInstanceNodePosition || this.type !== t.type ? 0 : this.sortInstanceNodePosition(this.current, t.current);
  }
  updateFeatures() {
    let t = "animation";
    for (t in ko) {
      const n = ko[t];
      if (!n)
        continue;
      const { isEnabled: r, Feature: o } = n;
      if (!this.features[t] && o && r(this.props) && (this.features[t] = new o(this)), this.features[t]) {
        const i = this.features[t];
        i.isMounted ? i.update() : (i.mount(), i.isMounted = !0);
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  /**
   * Measure the current viewport box with or without transforms.
   * Only measures axis-aligned boxes, rotate and skew must be manually
   * removed with a re-render to work.
   */
  measureViewportBox() {
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : pt();
  }
  getStaticValue(t) {
    return this.latestValues[t];
  }
  setStaticValue(t, n) {
    this.latestValues[t] = n;
  }
  /**
   * Update the provided props. Ensure any newly-added motion values are
   * added to our map, old ones removed, and listeners updated.
   */
  update(t, n) {
    (t.transformTemplate || this.props.transformTemplate) && this.scheduleRender(), this.prevProps = this.props, this.props = t, this.prevPresenceContext = this.presenceContext, this.presenceContext = n;
    for (let r = 0; r < Yh.length; r++) {
      const o = Yh[r];
      this.propEventSubscriptions[o] && (this.propEventSubscriptions[o](), delete this.propEventSubscriptions[o]);
      const i = "on" + o, s = t[i];
      s && (this.propEventSubscriptions[o] = this.on(o, s));
    }
    this.prevMotionValues = UC(this, this.scrapeMotionValuesFromProps(t, this.prevProps, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue();
  }
  getProps() {
    return this.props;
  }
  /**
   * Returns the variant definition with a given name.
   */
  getVariant(t) {
    return this.props.variants ? this.props.variants[t] : void 0;
  }
  /**
   * Returns the defined default transition on this component.
   */
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
  }
  getVariantContext(t = !1) {
    if (t)
      return this.parent ? this.parent.getVariantContext() : void 0;
    if (!this.isControllingVariants) {
      const r = this.parent ? this.parent.getVariantContext() || {} : {};
      return this.props.initial !== void 0 && (r.initial = this.props.initial), r;
    }
    const n = {};
    for (let r = 0; r < qC; r++) {
      const o = $u[r], i = this.props[o];
      (Ii(i) || i === !1) && (n[o] = i);
    }
    return n;
  }
  /**
   * Add a child visual element to our set of children.
   */
  addVariantChild(t) {
    const n = this.getClosestVariantNode();
    if (n)
      return n.variantChildren && n.variantChildren.add(t), () => n.variantChildren.delete(t);
  }
  /**
   * Add a motion value and bind it to this visual element.
   */
  addValue(t, n) {
    const r = this.values.get(t);
    n !== r && (r && this.removeValue(t), this.bindToMotionValue(t, n), this.values.set(t, n), this.latestValues[t] = n.get());
  }
  /**
   * Remove a motion value and unbind any active subscriptions.
   */
  removeValue(t) {
    this.values.delete(t);
    const n = this.valueSubscriptions.get(t);
    n && (n(), this.valueSubscriptions.delete(t)), delete this.latestValues[t], this.removeValueFromRenderState(t, this.renderState);
  }
  /**
   * Check whether we have a motion value for this key
   */
  hasValue(t) {
    return this.values.has(t);
  }
  getValue(t, n) {
    if (this.props.values && this.props.values[t])
      return this.props.values[t];
    let r = this.values.get(t);
    return r === void 0 && n !== void 0 && (r = Io(n === null ? void 0 : n, { owner: this }), this.addValue(t, r)), r;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(t, n) {
    var r;
    let o = this.latestValues[t] !== void 0 || !this.current ? this.latestValues[t] : (r = this.getBaseTargetFromProps(this.props, t)) !== null && r !== void 0 ? r : this.readValueFromInstance(this.current, t, this.options);
    return o != null && (typeof o == "string" && (fy(o) || dy(o)) ? o = parseFloat(o) : !YC(o) && dr.test(n) && (o = Sy(t, n)), this.setBaseTarget(t, Dt(o) ? o.get() : o)), Dt(o) ? o.get() : o;
  }
  /**
   * Set the base target to later animate back to. This is currently
   * only hydrated on creation and when we first read a value.
   */
  setBaseTarget(t, n) {
    this.baseTarget[t] = n;
  }
  /**
   * Find the base target for a value thats been removed from all animation
   * props.
   */
  getBaseTarget(t) {
    var n;
    const { initial: r } = this.props;
    let o;
    if (typeof r == "string" || typeof r == "object") {
      const s = qu(this.props, r, (n = this.presenceContext) === null || n === void 0 ? void 0 : n.custom);
      s && (o = s[t]);
    }
    if (r && o !== void 0)
      return o;
    const i = this.getBaseTargetFromProps(this.props, t);
    return i !== void 0 && !Dt(i) ? i : this.initialValues[t] !== void 0 && o === void 0 ? void 0 : this.baseTarget[t];
  }
  on(t, n) {
    return this.events[t] || (this.events[t] = new id()), this.events[t].add(n);
  }
  notify(t, ...n) {
    this.events[t] && this.events[t].notify(...n);
  }
}
class uv extends KC {
  constructor() {
    super(...arguments), this.KeyframeResolver = Ey;
  }
  sortInstanceNodePosition(t, n) {
    return t.compareDocumentPosition(n) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(t, n) {
    return t.style ? t.style[n] : void 0;
  }
  removeValueFromRenderState(t, { vars: n, style: r }) {
    delete n[t], delete r[t];
  }
}
function ZC(e) {
  return window.getComputedStyle(e);
}
class XC extends uv {
  constructor() {
    super(...arguments), this.type = "html", this.applyWillChange = !0, this.renderInstance = Qg;
  }
  readValueFromInstance(t, n) {
    if (vr.has(n)) {
      const r = Qu(n);
      return r && r.default || 0;
    } else {
      const r = ZC(t), o = (Gg(n) ? r.getPropertyValue(n) : r[n]) || 0;
      return typeof o == "string" ? o.trim() : o;
    }
  }
  measureInstanceViewportBox(t, { transformPagePoint: n }) {
    return Qy(t, n);
  }
  build(t, n, r) {
    Wu(t, n, r.transformTemplate);
  }
  scrapeMotionValuesFromProps(t, n, r) {
    return Yu(t, n, r);
  }
  handleChildMotionValue() {
    this.childSubscription && (this.childSubscription(), delete this.childSubscription);
    const { children: t } = this.props;
    Dt(t) && (this.childSubscription = t.on("change", (n) => {
      this.current && (this.current.textContent = `${n}`);
    }));
  }
}
class QC extends uv {
  constructor() {
    super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = pt;
  }
  getBaseTargetFromProps(t, n) {
    return t[n];
  }
  readValueFromInstance(t, n) {
    if (vr.has(n)) {
      const r = Qu(n);
      return r && r.default || 0;
    }
    return n = Jg.has(n) ? n : Va(n), t.getAttribute(n);
  }
  scrapeMotionValuesFromProps(t, n, r) {
    return ty(t, n, r);
  }
  build(t, n, r) {
    Uu(t, n, this.isSVGTag, r.transformTemplate);
  }
  renderInstance(t, n, r, o) {
    ey(t, n, r, o);
  }
  mount(t) {
    this.isSVGTag = Gu(t.tagName), super.mount(t);
  }
}
const JC = (e, t) => ju(e) ? new QC(t) : new XC(t, {
  allowProjection: e !== it
}), eP = {
  layout: {
    ProjectionNode: lv,
    MeasureLayout: ev
  }
}, tP = {
  ...NE,
  ...GT,
  ...WC,
  ...eP
}, Qt = /* @__PURE__ */ eT((e, t) => DT(e, t, tP, JC));
function dv() {
  const e = ye(!1);
  return La(() => (e.current = !0, () => {
    e.current = !1;
  }), []), e;
}
function fv() {
  const e = dv(), [t, n] = Me(0), r = Et(() => {
    e.current && n(t + 1);
  }, [t]);
  return [Et(() => Ne.postRender(r), [r]), t];
}
class nP extends O.Component {
  getSnapshotBeforeUpdate(t) {
    const n = this.props.childRef.current;
    if (n && t.isPresent && !this.props.isPresent) {
      const r = this.props.sizeRef.current;
      r.height = n.offsetHeight || 0, r.width = n.offsetWidth || 0, r.top = n.offsetTop, r.left = n.offsetLeft;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function rP({ children: e, isPresent: t }) {
  const n = Yn(), r = ye(null), o = ye({
    width: 0,
    height: 0,
    top: 0,
    left: 0
  }), { nonce: i } = Qe(Ro);
  return lg(() => {
    const { width: s, height: a, top: l, left: c } = o.current;
    if (t || !r.current || !s || !a)
      return;
    r.current.dataset.motionPopId = n;
    const u = document.createElement("style");
    return i && (u.nonce = i), document.head.appendChild(u), u.sheet && u.sheet.insertRule(`
          [data-motion-pop-id="${n}"] {
            position: absolute !important;
            width: ${s}px !important;
            height: ${a}px !important;
            top: ${l}px !important;
            left: ${c}px !important;
          }
        `), () => {
      document.head.removeChild(u);
    };
  }, [t]), S(nP, { isPresent: t, childRef: r, sizeRef: o, children: O.cloneElement(e, { ref: r }) });
}
const Ll = ({ children: e, initial: t, isPresent: n, onExitComplete: r, custom: o, presenceAffectsLayout: i, mode: s }) => {
  const a = br(oP), l = Yn(), c = Ue(
    () => ({
      id: l,
      initial: t,
      isPresent: n,
      custom: o,
      onExitComplete: (u) => {
        a.set(u, !0);
        for (const d of a.values())
          if (!d)
            return;
        r && r();
      },
      register: (u) => (a.set(u, !1), () => a.delete(u))
    }),
    /**
     * If the presence of a child affects the layout of the components around it,
     * we want to make a new context value to ensure they get re-rendered
     * so they can detect that layout change.
     */
    i ? [Math.random()] : [n]
  );
  return Ue(() => {
    a.forEach((u, d) => a.set(d, !1));
  }, [n]), O.useEffect(() => {
    !n && !a.size && r && r();
  }, [n]), s === "popLayout" && (e = S(rP, { isPresent: n, children: e })), S(Fa.Provider, { value: c, children: e });
};
function oP() {
  return /* @__PURE__ */ new Map();
}
function iP(e) {
  return xe(() => () => e(), []);
}
const Ar = (e) => e.key || "";
function sP(e, t) {
  e.forEach((n) => {
    const r = Ar(n);
    t.set(r, n);
  });
}
function aP(e) {
  const t = [];
  return H0.forEach(e, (n) => {
    U0(n) && t.push(n);
  }), t;
}
const Ua = ({ children: e, custom: t, initial: n = !0, onExitComplete: r, exitBeforeEnter: o, presenceAffectsLayout: i = !0, mode: s = "sync" }) => {
  hn(!o, "Replace exitBeforeEnter with mode='wait'");
  const a = Qe(Ai).forceRender || fv()[0], l = dv(), c = aP(e);
  let u = c;
  const d = ye(/* @__PURE__ */ new Map()).current, f = ye(u), h = ye(/* @__PURE__ */ new Map()).current, p = ye(!0);
  if (La(() => {
    p.current = !1, sP(c, h), f.current = u;
  }), iP(() => {
    p.current = !0, h.clear(), d.clear();
  }), p.current)
    return S(xc, { children: u.map((b) => S(Ll, { isPresent: !0, initial: n ? void 0 : !1, presenceAffectsLayout: i, mode: s, children: b }, Ar(b))) });
  u = [...u];
  const m = f.current.map(Ar), g = c.map(Ar), v = m.length;
  for (let b = 0; b < v; b++) {
    const y = m[b];
    g.indexOf(y) === -1 && !d.has(y) && d.set(y, void 0);
  }
  return s === "wait" && d.size && (u = []), d.forEach((b, y) => {
    if (g.indexOf(y) !== -1)
      return;
    const x = h.get(y);
    if (!x)
      return;
    const w = m.indexOf(y);
    let T = b;
    T || (T = S(Ll, { isPresent: !1, onExitComplete: () => {
      d.delete(y);
      const I = Array.from(h.keys()).filter((_) => !g.includes(_));
      if (I.forEach((_) => h.delete(_)), f.current = c.filter((_) => {
        const R = Ar(_);
        return (
          // filter out the node exiting
          R === y || // filter out the leftover children
          I.includes(R)
        );
      }), !d.size) {
        if (l.current === !1)
          return;
        a(), r && r();
      }
    }, custom: t, presenceAffectsLayout: i, mode: s, children: x }, Ar(x)), d.set(y, T)), u.splice(w, 0, T);
  }), u = u.map((b) => {
    const y = b.key;
    return d.has(y) ? b : S(Ll, { isPresent: !0, presenceAffectsLayout: i, mode: s, children: b }, Ar(b));
  }), process.env.NODE_ENV !== "production" && s === "wait" && u.length > 1 && console.warn(`You're attempting to animate multiple children within AnimatePresence, but its mode is set to "wait". This will lead to odd visual behaviour.`), S(xc, { children: d.size ? u : u.map((b) => W0(b)) });
};
function lP({ children: e, isValidProp: t, ...n }) {
  t && Zg(t), n = { ...Qe(Ro), ...n }, n.isStatic = br(() => n.isStatic);
  const r = Ue(() => n, [JSON.stringify(n.transition), n.transformPagePoint, n.reducedMotion]);
  return S(Ro.Provider, { value: r, children: e });
}
const cP = gn(null), uP = (e) => !e.isLayoutDirty && e.willUpdate(!1);
function qh() {
  const e = /* @__PURE__ */ new Set(), t = /* @__PURE__ */ new WeakMap(), n = () => e.forEach(uP);
  return {
    add: (r) => {
      e.add(r), t.set(r, r.addEventListener("willUpdate", n));
    },
    remove: (r) => {
      e.delete(r);
      const o = t.get(r);
      o && (o(), t.delete(r)), n();
    },
    dirty: n
  };
}
const hv = (e) => e === !0, dP = (e) => hv(e === !0) || e === "id", fP = ({ children: e, id: t, inherit: n = !0 }) => {
  const r = Qe(Ai), o = Qe(cP), [i, s] = fv(), a = ye(null), l = r.id || o;
  a.current === null && (dP(n) && l && (t = t ? l + "-" + t : l), a.current = {
    id: t,
    group: hv(n) && r.group || qh()
  });
  const c = Ue(() => ({ ...a.current, forceRender: i }), [s]);
  return S(Ai.Provider, { value: c, children: e });
}, pv = gn(null);
function hP(e, t, n, r) {
  if (!r)
    return e;
  const o = e.findIndex((u) => u.value === t);
  if (o === -1)
    return e;
  const i = r > 0 ? 1 : -1, s = e[o + i];
  if (!s)
    return e;
  const a = e[o], l = s.layout, c = tt(l.min, l.max, 0.5);
  return i === 1 && a.layout.max + n > c || i === -1 && a.layout.min + n < c ? RT(e, o, o + i) : e;
}
function pP({ children: e, as: t = "ul", axis: n = "y", onReorder: r, values: o, ...i }, s) {
  const a = br(() => Qt(t)), l = [], c = ye(!1);
  hn(!!o, "Reorder.Group must be provided a values prop");
  const u = {
    axis: n,
    registerItem: (d, f) => {
      const h = l.findIndex((p) => d === p.value);
      h !== -1 ? l[h].layout = f[n] : l.push({ value: d, layout: f[n] }), l.sort(yP);
    },
    updateOrder: (d, f, h) => {
      if (c.current)
        return;
      const p = hP(l, d, f, h);
      l !== p && (c.current = !0, r(p.map(gP).filter((m) => o.indexOf(m) !== -1)));
    }
  };
  return xe(() => {
    c.current = !1;
  }), S(a, { ...i, ref: s, ignoreStrict: !0, children: S(pv.Provider, { value: u, children: e }) });
}
const mP = ut(pP);
function gP(e) {
  return e.value;
}
function yP(e, t) {
  return e.layout.min - t.layout.min;
}
function _o(e) {
  const t = br(() => Io(e)), { isStatic: n } = Qe(Ro);
  if (n) {
    const [, r] = Me(e);
    xe(() => t.on("change", r), []);
  }
  return t;
}
const vP = (e) => e && typeof e == "object" && e.mix, bP = (e) => vP(e) ? e.mix : void 0;
function wP(...e) {
  const t = !Array.isArray(e[0]), n = t ? 0 : -1, r = e[0 + n], o = e[1 + n], i = e[2 + n], s = e[3 + n], a = Vy(o, i, {
    mixer: bP(i[0]),
    ...s
  });
  return t ? a(r) : a;
}
function mv(e, t) {
  const n = _o(t()), r = () => n.set(t());
  return r(), La(() => {
    const o = () => Ne.preRender(r, !1, !0), i = e.map((s) => s.on("change", o));
    return () => {
      i.forEach((s) => s()), On(r);
    };
  }), n;
}
function xP(e) {
  bi.current = [], e();
  const t = mv(bi.current, e);
  return bi.current = void 0, t;
}
function TP(e, t, n, r) {
  if (typeof e == "function")
    return xP(e);
  const o = typeof t == "function" ? t : wP(t, n, r);
  return Array.isArray(e) ? Kh(e, o) : Kh([e], ([i]) => o(i));
}
function Kh(e, t) {
  const n = br(() => []);
  return mv(e, () => {
    n.length = 0;
    const r = e.length;
    for (let o = 0; o < r; o++)
      n[o] = e[o].get();
    return t(n);
  });
}
function Zh(e, t = 0) {
  return Dt(e) ? e : _o(t);
}
function SP({ children: e, style: t = {}, value: n, as: r = "li", onDrag: o, layout: i = !0, ...s }, a) {
  const l = br(() => Qt(r)), c = Qe(pv), u = {
    x: Zh(t.x),
    y: Zh(t.y)
  }, d = TP([u.x, u.y], ([m, g]) => m || g ? 1 : "unset");
  hn(!!c, "Reorder.Item must be a child of Reorder.Group");
  const { axis: f, registerItem: h, updateOrder: p } = c;
  return S(l, { drag: f, ...s, dragSnapToOrigin: !0, style: { ...t, x: u.x, y: u.y, zIndex: d }, layout: i, onDrag: (m, g) => {
    const { velocity: v } = g;
    v[f] && p(n, u[f].get(), v[f]), o && o(m, g);
  }, onLayoutMeasure: (m) => h(n, m), ref: a, ignoreStrict: !0, children: e });
}
const EP = ut(SP), Ga = {
  Group: mP,
  Item: EP
};
class CP {
  constructor() {
    this.componentControls = /* @__PURE__ */ new Set();
  }
  /**
   * Subscribe a component's internal `VisualElementDragControls` to the user-facing API.
   *
   * @internal
   */
  subscribe(t) {
    return this.componentControls.add(t), () => this.componentControls.delete(t);
  }
  /**
   * Start a drag gesture on every `motion` component that has this set of drag controls
   * passed into it via the `dragControls` prop.
   *
   * ```jsx
   * dragControls.start(e, {
   *   snapToCursor: true
   * })
   * ```
   *
   * @param event - PointerEvent
   * @param options - Options
   *
   * @public
   */
  start(t, n) {
    this.componentControls.forEach((r) => {
      r.start(t.nativeEvent || t, n);
    });
  }
}
const PP = () => new CP();
function RP() {
  return br(PP);
}
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const kP = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), gv = (...e) => e.filter((t, n, r) => !!t && r.indexOf(t) === n).join(" ");
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var OP = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const IP = ut(
  ({
    color: e = "currentColor",
    size: t = 24,
    strokeWidth: n = 2,
    absoluteStrokeWidth: r,
    className: o = "",
    children: i,
    iconNode: s,
    ...a
  }, l) => Eo(
    "svg",
    {
      ref: l,
      ...OP,
      width: t,
      height: t,
      stroke: e,
      strokeWidth: r ? Number(n) * 24 / Number(t) : n,
      className: gv("lucide", o),
      ...a
    },
    [
      ...s.map(([c, u]) => Eo(c, u)),
      ...Array.isArray(i) ? i : [i]
    ]
  )
);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const wt = (e, t) => {
  const n = ut(
    ({ className: r, ...o }, i) => Eo(IP, {
      ref: i,
      iconNode: t,
      className: gv(`lucide-${kP(e)}`, r),
      ...o
    })
  );
  return n.displayName = `${e}`, n;
};
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const _P = wt("ArrowDown01", [
  ["path", { d: "m3 16 4 4 4-4", key: "1co6wj" }],
  ["path", { d: "M7 20V4", key: "1yoxec" }],
  ["rect", { x: "15", y: "4", width: "4", height: "6", ry: "2", key: "1bwicg" }],
  ["path", { d: "M17 20v-6h-2", key: "1qp1so" }],
  ["path", { d: "M15 20h4", key: "1j968p" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AP = wt("ArrowUp01", [
  ["path", { d: "m3 8 4-4 4 4", key: "11wl7u" }],
  ["path", { d: "M7 4v16", key: "1glfcx" }],
  ["rect", { x: "15", y: "4", width: "4", height: "6", ry: "2", key: "1bwicg" }],
  ["path", { d: "M17 20v-6h-2", key: "1qp1so" }],
  ["path", { d: "M15 20h4", key: "1j968p" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const yv = wt("ArrowUpDown", [
  ["path", { d: "m21 16-4 4-4-4", key: "f6ql7i" }],
  ["path", { d: "M17 20V4", key: "1ejh1v" }],
  ["path", { d: "m3 8 4-4 4 4", key: "11wl7u" }],
  ["path", { d: "M7 4v16", key: "1glfcx" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const DP = wt("Calendar", [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const vv = wt("ChevronDown", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MP = wt("ChevronLeft", [
  ["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ad = wt("ChevronRight", [
  ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const NP = wt("CircleAlert", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const bv = wt("CircleCheckBig", [
  ["path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14", key: "g774vq" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FP = wt("CircleX", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LP = wt("File", [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const VP = wt("GripVertical", [
  ["circle", { cx: "9", cy: "12", r: "1", key: "1vctgf" }],
  ["circle", { cx: "9", cy: "5", r: "1", key: "hp0tcf" }],
  ["circle", { cx: "9", cy: "19", r: "1", key: "fkjjf6" }],
  ["circle", { cx: "15", cy: "12", r: "1", key: "1tmaij" }],
  ["circle", { cx: "15", cy: "5", r: "1", key: "19l28e" }],
  ["circle", { cx: "15", cy: "19", r: "1", key: "f4zoj3" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const $P = wt("Info", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const jP = wt("ListFilter", [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M7 12h10", key: "b7w52i" }],
  ["path", { d: "M10 18h4", key: "1ulq68" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ld = wt("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BP = wt("Search", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ao = wt("Trash2", [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const zP = wt("Ungroup", [
  ["rect", { width: "8", height: "6", x: "5", y: "4", rx: "1", key: "nzclkv" }],
  ["rect", { width: "8", height: "6", x: "11", y: "14", rx: "1", key: "4tytwb" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const WP = wt("Upload", [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "17 8 12 3 7 8", key: "t8dd8p" }],
  ["line", { x1: "12", x2: "12", y1: "3", y2: "15", key: "widbto" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const wv = wt("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]);
/**
 * @license lucide-react v0.414.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const HP = wt("ZoomIn", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["line", { x1: "21", x2: "16.65", y1: "21", y2: "16.65", key: "13gj7c" }],
  ["line", { x1: "11", x2: "11", y1: "8", y2: "14", key: "1vmskp" }],
  ["line", { x1: "8", x2: "14", y1: "11", y2: "11", key: "durymu" }]
]), Xh = {
  true: { opacity: 1, height: "auto" },
  false: { opacity: [0.7, 0.3, 0], height: 0 }
}, UP = {
  type: "tween",
  duration: 0.7,
  ease: [0.04, 0.62, 0.23, 0.98]
}, GP = (e) => /* @__PURE__ */ S(
  Qt.section,
  {
    ...e,
    layout: !0,
    layoutRoot: !0,
    layoutScroll: !0,
    initial: !e.open,
    animate: e.open.toString(),
    "aria-hidden": !e.open,
    className: e.className,
    exit: Xh.false,
    transition: UP,
    variants: Xh,
    children: e.children
  }
), YP = Ma("px-4 py-4 border relative rounded-lg text-sm", {
  variants: {
    theme: {
      neutral: "border-border bg-background",
      danger: "text-danger-contrast bg-danger/10 border-danger/50",
      success: "text-success-foreground bg-success/10 border-success/50"
    }
  },
  defaultVariants: { theme: "neutral" }
}), uL = ut(function({ className: t, theme: n, onClose: r, open: o = !0, ...i }, s) {
  return /* @__PURE__ */ S(
    "div",
    {
      "data-open": !!o,
      "aria-hidden": !o,
      className: "pointer-events-none isolate data-[open=true]:pointer-events-auto data-[open=true]:mb-4",
      children: /* @__PURE__ */ S(GP, { "data-open": !!o, open: !!o, children: /* @__PURE__ */ Z(
        Xi,
        {
          ...i,
          className: bt(YP({ theme: n }), t),
          ref: s,
          "data-theme": n,
          role: "alert",
          as: i.as ?? "div",
          children: [
            /* @__PURE__ */ Z("h4", { className: "mb-2 flex items-center gap-2", children: [
              n === "success" ? /* @__PURE__ */ S(bv, { size: 20 }) : null,
              n === "danger" ? /* @__PURE__ */ S(NP, { size: 20 }) : null,
              /* @__PURE__ */ S("span", { className: "tracking-3 text-balance text-lg font-semibold", children: i.title })
            ] }),
            i.children,
            r !== void 0 ? /* @__PURE__ */ S(
              "button",
              {
                type: "button",
                onClick: () => r(!1),
                className: "duration-300 ease-in-out absolute right-3 top-3 text-foreground transition-colors hover:text-danger",
                children: /* @__PURE__ */ S(wv, { size: 20 })
              }
            ) : null
          ]
        }
      ) })
    }
  );
});
function Ye(e) {
  const t = Object.prototype.toString.call(e);
  return e instanceof Date || typeof e == "object" && t === "[object Date]" ? new e.constructor(+e) : typeof e == "number" || t === "[object Number]" || typeof e == "string" || t === "[object String]" ? new Date(e) : /* @__PURE__ */ new Date(NaN);
}
function Xe(e, t) {
  return e instanceof Date ? new e.constructor(t) : new Date(t);
}
function Ko(e, t) {
  const n = Ye(e);
  return isNaN(t) ? Xe(e, NaN) : (t && n.setDate(n.getDate() + t), n);
}
function Ya(e, t) {
  const n = Ye(e);
  if (isNaN(t)) return Xe(e, NaN);
  if (!t)
    return n;
  const r = n.getDate(), o = Xe(e, n.getTime());
  o.setMonth(n.getMonth() + t + 1, 0);
  const i = o.getDate();
  return r >= i ? o : (n.setFullYear(
    o.getFullYear(),
    o.getMonth(),
    r
  ), n);
}
const xv = 6048e5, qP = 864e5, KP = 6e4, ZP = 36e5, XP = 1e3;
let QP = {};
function Jr() {
  return QP;
}
function In(e, t) {
  var a, l, c, u;
  const n = Jr(), r = (t == null ? void 0 : t.weekStartsOn) ?? ((l = (a = t == null ? void 0 : t.locale) == null ? void 0 : a.options) == null ? void 0 : l.weekStartsOn) ?? n.weekStartsOn ?? ((u = (c = n.locale) == null ? void 0 : c.options) == null ? void 0 : u.weekStartsOn) ?? 0, o = Ye(e), i = o.getDay(), s = (i < r ? 7 : 0) + i - r;
  return o.setDate(o.getDate() - s), o.setHours(0, 0, 0, 0), o;
}
function Do(e) {
  return In(e, { weekStartsOn: 1 });
}
function Tv(e) {
  const t = Ye(e), n = t.getFullYear(), r = Xe(e, 0);
  r.setFullYear(n + 1, 0, 4), r.setHours(0, 0, 0, 0);
  const o = Do(r), i = Xe(e, 0);
  i.setFullYear(n, 0, 4), i.setHours(0, 0, 0, 0);
  const s = Do(i);
  return t.getTime() >= o.getTime() ? n + 1 : t.getTime() >= s.getTime() ? n : n - 1;
}
function Mo(e) {
  const t = Ye(e);
  return t.setHours(0, 0, 0, 0), t;
}
function Js(e) {
  const t = Ye(e), n = new Date(
    Date.UTC(
      t.getFullYear(),
      t.getMonth(),
      t.getDate(),
      t.getHours(),
      t.getMinutes(),
      t.getSeconds(),
      t.getMilliseconds()
    )
  );
  return n.setUTCFullYear(t.getFullYear()), +e - +n;
}
function JP(e, t) {
  const n = Mo(e), r = Mo(t), o = +n - Js(n), i = +r - Js(r);
  return Math.round((o - i) / qP);
}
function eR(e) {
  const t = Tv(e), n = Xe(e, 0);
  return n.setFullYear(t, 0, 4), n.setHours(0, 0, 0, 0), Do(n);
}
function Sv(e, t) {
  const n = t * 7;
  return Ko(e, n);
}
function Ev(e, t) {
  return Ya(e, t * 12);
}
function tR(e) {
  return Xe(e, Date.now());
}
function nR(e, t) {
  const n = Mo(e), r = Mo(t);
  return +n == +r;
}
function rR(e) {
  return e instanceof Date || typeof e == "object" && Object.prototype.toString.call(e) === "[object Date]";
}
function oR(e) {
  if (!rR(e) && typeof e != "number")
    return !1;
  const t = Ye(e);
  return !isNaN(Number(t));
}
function Cv(e, t) {
  const n = Ye(e.start), r = Ye(e.end);
  let o = +n > +r;
  const i = o ? +n : +r, s = o ? r : n;
  s.setHours(0, 0, 0, 0);
  let a = 1;
  const l = [];
  for (; +s <= i; )
    l.push(Ye(s)), s.setDate(s.getDate() + a), s.setHours(0, 0, 0, 0);
  return o ? l.reverse() : l;
}
function Pv(e) {
  const t = Ye(e);
  return t.setDate(1), t.setHours(0, 0, 0, 0), t;
}
function iR(e) {
  const t = Ye(e), n = Xe(e, 0);
  return n.setFullYear(t.getFullYear(), 0, 1), n.setHours(0, 0, 0, 0), n;
}
function sR(e, t) {
  var a, l;
  const n = Jr(), r = n.weekStartsOn ?? ((l = (a = n.locale) == null ? void 0 : a.options) == null ? void 0 : l.weekStartsOn) ?? 0, o = Ye(e), i = o.getDay(), s = (i < r ? -7 : 0) + 6 - (i - r);
  return o.setDate(o.getDate() + s), o.setHours(23, 59, 59, 999), o;
}
const aR = {
  lessThanXSeconds: {
    one: "less than a second",
    other: "less than {{count}} seconds"
  },
  xSeconds: {
    one: "1 second",
    other: "{{count}} seconds"
  },
  halfAMinute: "half a minute",
  lessThanXMinutes: {
    one: "less than a minute",
    other: "less than {{count}} minutes"
  },
  xMinutes: {
    one: "1 minute",
    other: "{{count}} minutes"
  },
  aboutXHours: {
    one: "about 1 hour",
    other: "about {{count}} hours"
  },
  xHours: {
    one: "1 hour",
    other: "{{count}} hours"
  },
  xDays: {
    one: "1 day",
    other: "{{count}} days"
  },
  aboutXWeeks: {
    one: "about 1 week",
    other: "about {{count}} weeks"
  },
  xWeeks: {
    one: "1 week",
    other: "{{count}} weeks"
  },
  aboutXMonths: {
    one: "about 1 month",
    other: "about {{count}} months"
  },
  xMonths: {
    one: "1 month",
    other: "{{count}} months"
  },
  aboutXYears: {
    one: "about 1 year",
    other: "about {{count}} years"
  },
  xYears: {
    one: "1 year",
    other: "{{count}} years"
  },
  overXYears: {
    one: "over 1 year",
    other: "over {{count}} years"
  },
  almostXYears: {
    one: "almost 1 year",
    other: "almost {{count}} years"
  }
}, lR = (e, t, n) => {
  let r;
  const o = aR[e];
  return typeof o == "string" ? r = o : t === 1 ? r = o.one : r = o.other.replace("{{count}}", t.toString()), n != null && n.addSuffix ? n.comparison && n.comparison > 0 ? "in " + r : r + " ago" : r;
};
function Vl(e) {
  return (t = {}) => {
    const n = t.width ? String(t.width) : e.defaultWidth;
    return e.formats[n] || e.formats[e.defaultWidth];
  };
}
const cR = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
}, uR = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
}, dR = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
}, fR = {
  date: Vl({
    formats: cR,
    defaultWidth: "full"
  }),
  time: Vl({
    formats: uR,
    defaultWidth: "full"
  }),
  dateTime: Vl({
    formats: dR,
    defaultWidth: "full"
  })
}, hR = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
}, pR = (e, t, n, r) => hR[e];
function li(e) {
  return (t, n) => {
    const r = n != null && n.context ? String(n.context) : "standalone";
    let o;
    if (r === "formatting" && e.formattingValues) {
      const s = e.defaultFormattingWidth || e.defaultWidth, a = n != null && n.width ? String(n.width) : s;
      o = e.formattingValues[a] || e.formattingValues[s];
    } else {
      const s = e.defaultWidth, a = n != null && n.width ? String(n.width) : e.defaultWidth;
      o = e.values[a] || e.values[s];
    }
    const i = e.argumentCallback ? e.argumentCallback(t) : t;
    return o[i];
  };
}
const mR = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
}, gR = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
}, yR = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ],
  wide: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]
}, vR = {
  narrow: ["S", "M", "T", "W", "T", "F", "S"],
  short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  wide: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]
}, bR = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  }
}, wR = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  }
}, xR = (e, t) => {
  const n = Number(e), r = n % 100;
  if (r > 20 || r < 10)
    switch (r % 10) {
      case 1:
        return n + "st";
      case 2:
        return n + "nd";
      case 3:
        return n + "rd";
    }
  return n + "th";
}, TR = {
  ordinalNumber: xR,
  era: li({
    values: mR,
    defaultWidth: "wide"
  }),
  quarter: li({
    values: gR,
    defaultWidth: "wide",
    argumentCallback: (e) => e - 1
  }),
  month: li({
    values: yR,
    defaultWidth: "wide"
  }),
  day: li({
    values: vR,
    defaultWidth: "wide"
  }),
  dayPeriod: li({
    values: bR,
    defaultWidth: "wide",
    formattingValues: wR,
    defaultFormattingWidth: "wide"
  })
};
function ci(e) {
  return (t, n = {}) => {
    const r = n.width, o = r && e.matchPatterns[r] || e.matchPatterns[e.defaultMatchWidth], i = t.match(o);
    if (!i)
      return null;
    const s = i[0], a = r && e.parsePatterns[r] || e.parsePatterns[e.defaultParseWidth], l = Array.isArray(a) ? ER(a, (d) => d.test(s)) : (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I challange you to fix the type
      SR(a, (d) => d.test(s))
    );
    let c;
    c = e.valueCallback ? e.valueCallback(l) : l, c = n.valueCallback ? (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I challange you to fix the type
      n.valueCallback(c)
    ) : c;
    const u = t.slice(s.length);
    return { value: c, rest: u };
  };
}
function SR(e, t) {
  for (const n in e)
    if (Object.prototype.hasOwnProperty.call(e, n) && t(e[n]))
      return n;
}
function ER(e, t) {
  for (let n = 0; n < e.length; n++)
    if (t(e[n]))
      return n;
}
function CR(e) {
  return (t, n = {}) => {
    const r = t.match(e.matchPattern);
    if (!r) return null;
    const o = r[0], i = t.match(e.parsePattern);
    if (!i) return null;
    let s = e.valueCallback ? e.valueCallback(i[0]) : i[0];
    s = n.valueCallback ? n.valueCallback(s) : s;
    const a = t.slice(o.length);
    return { value: s, rest: a };
  };
}
const PR = /^(\d+)(th|st|nd|rd)?/i, RR = /\d+/i, kR = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
}, OR = {
  any: [/^b/i, /^(a|c)/i]
}, IR = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
}, _R = {
  any: [/1/i, /2/i, /3/i, /4/i]
}, AR = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
}, DR = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^may/i,
    /^jun/i,
    /^jul/i,
    /^au/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
}, MR = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
}, NR = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
}, FR = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
}, LR = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
}, VR = {
  ordinalNumber: CR({
    matchPattern: PR,
    parsePattern: RR,
    valueCallback: (e) => parseInt(e, 10)
  }),
  era: ci({
    matchPatterns: kR,
    defaultMatchWidth: "wide",
    parsePatterns: OR,
    defaultParseWidth: "any"
  }),
  quarter: ci({
    matchPatterns: IR,
    defaultMatchWidth: "wide",
    parsePatterns: _R,
    defaultParseWidth: "any",
    valueCallback: (e) => e + 1
  }),
  month: ci({
    matchPatterns: AR,
    defaultMatchWidth: "wide",
    parsePatterns: DR,
    defaultParseWidth: "any"
  }),
  day: ci({
    matchPatterns: MR,
    defaultMatchWidth: "wide",
    parsePatterns: NR,
    defaultParseWidth: "any"
  }),
  dayPeriod: ci({
    matchPatterns: FR,
    defaultMatchWidth: "any",
    parsePatterns: LR,
    defaultParseWidth: "any"
  })
}, Rv = {
  code: "en-US",
  formatDistance: lR,
  formatLong: fR,
  formatRelative: pR,
  localize: TR,
  match: VR,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function $R(e) {
  const t = Ye(e);
  return JP(t, iR(t)) + 1;
}
function kv(e) {
  const t = Ye(e), n = +Do(t) - +eR(t);
  return Math.round(n / xv) + 1;
}
function cd(e, t) {
  var u, d, f, h;
  const n = Ye(e), r = n.getFullYear(), o = Jr(), i = (t == null ? void 0 : t.firstWeekContainsDate) ?? ((d = (u = t == null ? void 0 : t.locale) == null ? void 0 : u.options) == null ? void 0 : d.firstWeekContainsDate) ?? o.firstWeekContainsDate ?? ((h = (f = o.locale) == null ? void 0 : f.options) == null ? void 0 : h.firstWeekContainsDate) ?? 1, s = Xe(e, 0);
  s.setFullYear(r + 1, 0, i), s.setHours(0, 0, 0, 0);
  const a = In(s, t), l = Xe(e, 0);
  l.setFullYear(r, 0, i), l.setHours(0, 0, 0, 0);
  const c = In(l, t);
  return n.getTime() >= a.getTime() ? r + 1 : n.getTime() >= c.getTime() ? r : r - 1;
}
function jR(e, t) {
  var a, l, c, u;
  const n = Jr(), r = (t == null ? void 0 : t.firstWeekContainsDate) ?? ((l = (a = t == null ? void 0 : t.locale) == null ? void 0 : a.options) == null ? void 0 : l.firstWeekContainsDate) ?? n.firstWeekContainsDate ?? ((u = (c = n.locale) == null ? void 0 : c.options) == null ? void 0 : u.firstWeekContainsDate) ?? 1, o = cd(e, t), i = Xe(e, 0);
  return i.setFullYear(o, 0, r), i.setHours(0, 0, 0, 0), In(i, t);
}
function Ov(e, t) {
  const n = Ye(e), r = +In(n, t) - +jR(n, t);
  return Math.round(r / xv) + 1;
}
function Be(e, t) {
  const n = e < 0 ? "-" : "", r = Math.abs(e).toString().padStart(t, "0");
  return n + r;
}
const er = {
  // Year
  y(e, t) {
    const n = e.getFullYear(), r = n > 0 ? n : 1 - n;
    return Be(t === "yy" ? r % 100 : r, t.length);
  },
  // Month
  M(e, t) {
    const n = e.getMonth();
    return t === "M" ? String(n + 1) : Be(n + 1, 2);
  },
  // Day of the month
  d(e, t) {
    return Be(e.getDate(), t.length);
  },
  // AM or PM
  a(e, t) {
    const n = e.getHours() / 12 >= 1 ? "pm" : "am";
    switch (t) {
      case "a":
      case "aa":
        return n.toUpperCase();
      case "aaa":
        return n;
      case "aaaaa":
        return n[0];
      case "aaaa":
      default:
        return n === "am" ? "a.m." : "p.m.";
    }
  },
  // Hour [1-12]
  h(e, t) {
    return Be(e.getHours() % 12 || 12, t.length);
  },
  // Hour [0-23]
  H(e, t) {
    return Be(e.getHours(), t.length);
  },
  // Minute
  m(e, t) {
    return Be(e.getMinutes(), t.length);
  },
  // Second
  s(e, t) {
    return Be(e.getSeconds(), t.length);
  },
  // Fraction of second
  S(e, t) {
    const n = t.length, r = e.getMilliseconds(), o = Math.trunc(
      r * Math.pow(10, n - 3)
    );
    return Be(o, t.length);
  }
}, so = {
  am: "am",
  pm: "pm",
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
}, Qh = {
  // Era
  G: function(e, t, n) {
    const r = e.getFullYear() > 0 ? 1 : 0;
    switch (t) {
      case "G":
      case "GG":
      case "GGG":
        return n.era(r, { width: "abbreviated" });
      case "GGGGG":
        return n.era(r, { width: "narrow" });
      case "GGGG":
      default:
        return n.era(r, { width: "wide" });
    }
  },
  // Year
  y: function(e, t, n) {
    if (t === "yo") {
      const r = e.getFullYear(), o = r > 0 ? r : 1 - r;
      return n.ordinalNumber(o, { unit: "year" });
    }
    return er.y(e, t);
  },
  // Local week-numbering year
  Y: function(e, t, n, r) {
    const o = cd(e, r), i = o > 0 ? o : 1 - o;
    if (t === "YY") {
      const s = i % 100;
      return Be(s, 2);
    }
    return t === "Yo" ? n.ordinalNumber(i, { unit: "year" }) : Be(i, t.length);
  },
  // ISO week-numbering year
  R: function(e, t) {
    const n = Tv(e);
    return Be(n, t.length);
  },
  // Extended year. This is a single number designating the year of this calendar system.
  // The main difference between `y` and `u` localizers are B.C. years:
  // | Year | `y` | `u` |
  // |------|-----|-----|
  // | AC 1 |   1 |   1 |
  // | BC 1 |   1 |   0 |
  // | BC 2 |   2 |  -1 |
  // Also `yy` always returns the last two digits of a year,
  // while `uu` pads single digit years to 2 characters and returns other years unchanged.
  u: function(e, t) {
    const n = e.getFullYear();
    return Be(n, t.length);
  },
  // Quarter
  Q: function(e, t, n) {
    const r = Math.ceil((e.getMonth() + 1) / 3);
    switch (t) {
      case "Q":
        return String(r);
      case "QQ":
        return Be(r, 2);
      case "Qo":
        return n.ordinalNumber(r, { unit: "quarter" });
      case "QQQ":
        return n.quarter(r, {
          width: "abbreviated",
          context: "formatting"
        });
      case "QQQQQ":
        return n.quarter(r, {
          width: "narrow",
          context: "formatting"
        });
      case "QQQQ":
      default:
        return n.quarter(r, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone quarter
  q: function(e, t, n) {
    const r = Math.ceil((e.getMonth() + 1) / 3);
    switch (t) {
      case "q":
        return String(r);
      case "qq":
        return Be(r, 2);
      case "qo":
        return n.ordinalNumber(r, { unit: "quarter" });
      case "qqq":
        return n.quarter(r, {
          width: "abbreviated",
          context: "standalone"
        });
      case "qqqqq":
        return n.quarter(r, {
          width: "narrow",
          context: "standalone"
        });
      case "qqqq":
      default:
        return n.quarter(r, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // Month
  M: function(e, t, n) {
    const r = e.getMonth();
    switch (t) {
      case "M":
      case "MM":
        return er.M(e, t);
      case "Mo":
        return n.ordinalNumber(r + 1, { unit: "month" });
      case "MMM":
        return n.month(r, {
          width: "abbreviated",
          context: "formatting"
        });
      case "MMMMM":
        return n.month(r, {
          width: "narrow",
          context: "formatting"
        });
      case "MMMM":
      default:
        return n.month(r, { width: "wide", context: "formatting" });
    }
  },
  // Stand-alone month
  L: function(e, t, n) {
    const r = e.getMonth();
    switch (t) {
      case "L":
        return String(r + 1);
      case "LL":
        return Be(r + 1, 2);
      case "Lo":
        return n.ordinalNumber(r + 1, { unit: "month" });
      case "LLL":
        return n.month(r, {
          width: "abbreviated",
          context: "standalone"
        });
      case "LLLLL":
        return n.month(r, {
          width: "narrow",
          context: "standalone"
        });
      case "LLLL":
      default:
        return n.month(r, { width: "wide", context: "standalone" });
    }
  },
  // Local week of year
  w: function(e, t, n, r) {
    const o = Ov(e, r);
    return t === "wo" ? n.ordinalNumber(o, { unit: "week" }) : Be(o, t.length);
  },
  // ISO week of year
  I: function(e, t, n) {
    const r = kv(e);
    return t === "Io" ? n.ordinalNumber(r, { unit: "week" }) : Be(r, t.length);
  },
  // Day of the month
  d: function(e, t, n) {
    return t === "do" ? n.ordinalNumber(e.getDate(), { unit: "date" }) : er.d(e, t);
  },
  // Day of year
  D: function(e, t, n) {
    const r = $R(e);
    return t === "Do" ? n.ordinalNumber(r, { unit: "dayOfYear" }) : Be(r, t.length);
  },
  // Day of week
  E: function(e, t, n) {
    const r = e.getDay();
    switch (t) {
      case "E":
      case "EE":
      case "EEE":
        return n.day(r, {
          width: "abbreviated",
          context: "formatting"
        });
      case "EEEEE":
        return n.day(r, {
          width: "narrow",
          context: "formatting"
        });
      case "EEEEEE":
        return n.day(r, {
          width: "short",
          context: "formatting"
        });
      case "EEEE":
      default:
        return n.day(r, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Local day of week
  e: function(e, t, n, r) {
    const o = e.getDay(), i = (o - r.weekStartsOn + 8) % 7 || 7;
    switch (t) {
      case "e":
        return String(i);
      case "ee":
        return Be(i, 2);
      case "eo":
        return n.ordinalNumber(i, { unit: "day" });
      case "eee":
        return n.day(o, {
          width: "abbreviated",
          context: "formatting"
        });
      case "eeeee":
        return n.day(o, {
          width: "narrow",
          context: "formatting"
        });
      case "eeeeee":
        return n.day(o, {
          width: "short",
          context: "formatting"
        });
      case "eeee":
      default:
        return n.day(o, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone local day of week
  c: function(e, t, n, r) {
    const o = e.getDay(), i = (o - r.weekStartsOn + 8) % 7 || 7;
    switch (t) {
      case "c":
        return String(i);
      case "cc":
        return Be(i, t.length);
      case "co":
        return n.ordinalNumber(i, { unit: "day" });
      case "ccc":
        return n.day(o, {
          width: "abbreviated",
          context: "standalone"
        });
      case "ccccc":
        return n.day(o, {
          width: "narrow",
          context: "standalone"
        });
      case "cccccc":
        return n.day(o, {
          width: "short",
          context: "standalone"
        });
      case "cccc":
      default:
        return n.day(o, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // ISO day of week
  i: function(e, t, n) {
    const r = e.getDay(), o = r === 0 ? 7 : r;
    switch (t) {
      case "i":
        return String(o);
      case "ii":
        return Be(o, t.length);
      case "io":
        return n.ordinalNumber(o, { unit: "day" });
      case "iii":
        return n.day(r, {
          width: "abbreviated",
          context: "formatting"
        });
      case "iiiii":
        return n.day(r, {
          width: "narrow",
          context: "formatting"
        });
      case "iiiiii":
        return n.day(r, {
          width: "short",
          context: "formatting"
        });
      case "iiii":
      default:
        return n.day(r, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM or PM
  a: function(e, t, n) {
    const o = e.getHours() / 12 >= 1 ? "pm" : "am";
    switch (t) {
      case "a":
      case "aa":
        return n.dayPeriod(o, {
          width: "abbreviated",
          context: "formatting"
        });
      case "aaa":
        return n.dayPeriod(o, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "aaaaa":
        return n.dayPeriod(o, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaa":
      default:
        return n.dayPeriod(o, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM, PM, midnight, noon
  b: function(e, t, n) {
    const r = e.getHours();
    let o;
    switch (r === 12 ? o = so.noon : r === 0 ? o = so.midnight : o = r / 12 >= 1 ? "pm" : "am", t) {
      case "b":
      case "bb":
        return n.dayPeriod(o, {
          width: "abbreviated",
          context: "formatting"
        });
      case "bbb":
        return n.dayPeriod(o, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "bbbbb":
        return n.dayPeriod(o, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbb":
      default:
        return n.dayPeriod(o, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // in the morning, in the afternoon, in the evening, at night
  B: function(e, t, n) {
    const r = e.getHours();
    let o;
    switch (r >= 17 ? o = so.evening : r >= 12 ? o = so.afternoon : r >= 4 ? o = so.morning : o = so.night, t) {
      case "B":
      case "BB":
      case "BBB":
        return n.dayPeriod(o, {
          width: "abbreviated",
          context: "formatting"
        });
      case "BBBBB":
        return n.dayPeriod(o, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBB":
      default:
        return n.dayPeriod(o, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Hour [1-12]
  h: function(e, t, n) {
    if (t === "ho") {
      let r = e.getHours() % 12;
      return r === 0 && (r = 12), n.ordinalNumber(r, { unit: "hour" });
    }
    return er.h(e, t);
  },
  // Hour [0-23]
  H: function(e, t, n) {
    return t === "Ho" ? n.ordinalNumber(e.getHours(), { unit: "hour" }) : er.H(e, t);
  },
  // Hour [0-11]
  K: function(e, t, n) {
    const r = e.getHours() % 12;
    return t === "Ko" ? n.ordinalNumber(r, { unit: "hour" }) : Be(r, t.length);
  },
  // Hour [1-24]
  k: function(e, t, n) {
    let r = e.getHours();
    return r === 0 && (r = 24), t === "ko" ? n.ordinalNumber(r, { unit: "hour" }) : Be(r, t.length);
  },
  // Minute
  m: function(e, t, n) {
    return t === "mo" ? n.ordinalNumber(e.getMinutes(), { unit: "minute" }) : er.m(e, t);
  },
  // Second
  s: function(e, t, n) {
    return t === "so" ? n.ordinalNumber(e.getSeconds(), { unit: "second" }) : er.s(e, t);
  },
  // Fraction of second
  S: function(e, t) {
    return er.S(e, t);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function(e, t, n) {
    const r = e.getTimezoneOffset();
    if (r === 0)
      return "Z";
    switch (t) {
      case "X":
        return ep(r);
      case "XXXX":
      case "XX":
        return Dr(r);
      case "XXXXX":
      case "XXX":
      default:
        return Dr(r, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function(e, t, n) {
    const r = e.getTimezoneOffset();
    switch (t) {
      case "x":
        return ep(r);
      case "xxxx":
      case "xx":
        return Dr(r);
      case "xxxxx":
      case "xxx":
      default:
        return Dr(r, ":");
    }
  },
  // Timezone (GMT)
  O: function(e, t, n) {
    const r = e.getTimezoneOffset();
    switch (t) {
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + Jh(r, ":");
      case "OOOO":
      default:
        return "GMT" + Dr(r, ":");
    }
  },
  // Timezone (specific non-location)
  z: function(e, t, n) {
    const r = e.getTimezoneOffset();
    switch (t) {
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + Jh(r, ":");
      case "zzzz":
      default:
        return "GMT" + Dr(r, ":");
    }
  },
  // Seconds timestamp
  t: function(e, t, n) {
    const r = Math.trunc(e.getTime() / 1e3);
    return Be(r, t.length);
  },
  // Milliseconds timestamp
  T: function(e, t, n) {
    const r = e.getTime();
    return Be(r, t.length);
  }
};
function Jh(e, t = "") {
  const n = e > 0 ? "-" : "+", r = Math.abs(e), o = Math.trunc(r / 60), i = r % 60;
  return i === 0 ? n + String(o) : n + String(o) + t + Be(i, 2);
}
function ep(e, t) {
  return e % 60 === 0 ? (e > 0 ? "-" : "+") + Be(Math.abs(e) / 60, 2) : Dr(e, t);
}
function Dr(e, t = "") {
  const n = e > 0 ? "-" : "+", r = Math.abs(e), o = Be(Math.trunc(r / 60), 2), i = Be(r % 60, 2);
  return n + o + t + i;
}
const tp = (e, t) => {
  switch (e) {
    case "P":
      return t.date({ width: "short" });
    case "PP":
      return t.date({ width: "medium" });
    case "PPP":
      return t.date({ width: "long" });
    case "PPPP":
    default:
      return t.date({ width: "full" });
  }
}, Iv = (e, t) => {
  switch (e) {
    case "p":
      return t.time({ width: "short" });
    case "pp":
      return t.time({ width: "medium" });
    case "ppp":
      return t.time({ width: "long" });
    case "pppp":
    default:
      return t.time({ width: "full" });
  }
}, BR = (e, t) => {
  const n = e.match(/(P+)(p+)?/) || [], r = n[1], o = n[2];
  if (!o)
    return tp(e, t);
  let i;
  switch (r) {
    case "P":
      i = t.dateTime({ width: "short" });
      break;
    case "PP":
      i = t.dateTime({ width: "medium" });
      break;
    case "PPP":
      i = t.dateTime({ width: "long" });
      break;
    case "PPPP":
    default:
      i = t.dateTime({ width: "full" });
      break;
  }
  return i.replace("{{date}}", tp(r, t)).replace("{{time}}", Iv(o, t));
}, Hc = {
  p: Iv,
  P: BR
}, zR = /^D+$/, WR = /^Y+$/, HR = ["D", "DD", "YY", "YYYY"];
function _v(e) {
  return zR.test(e);
}
function Av(e) {
  return WR.test(e);
}
function Uc(e, t, n) {
  const r = UR(e, t, n);
  if (console.warn(r), HR.includes(e)) throw new RangeError(r);
}
function UR(e, t, n) {
  const r = e[0] === "Y" ? "years" : "days of the month";
  return `Use \`${e.toLowerCase()}\` instead of \`${e}\` (in \`${t}\`) for formatting ${r} to the input \`${n}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const GR = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, YR = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, qR = /^'([^]*?)'?$/, KR = /''/g, ZR = /[a-zA-Z]/;
function XR(e, t, n) {
  var u, d, f, h;
  const r = Jr(), o = r.locale ?? Rv, i = r.firstWeekContainsDate ?? ((d = (u = r.locale) == null ? void 0 : u.options) == null ? void 0 : d.firstWeekContainsDate) ?? 1, s = r.weekStartsOn ?? ((h = (f = r.locale) == null ? void 0 : f.options) == null ? void 0 : h.weekStartsOn) ?? 0, a = Ye(e);
  if (!oR(a))
    throw new RangeError("Invalid time value");
  let l = t.match(YR).map((p) => {
    const m = p[0];
    if (m === "p" || m === "P") {
      const g = Hc[m];
      return g(p, o.formatLong);
    }
    return p;
  }).join("").match(GR).map((p) => {
    if (p === "''")
      return { isToken: !1, value: "'" };
    const m = p[0];
    if (m === "'")
      return { isToken: !1, value: QR(p) };
    if (Qh[m])
      return { isToken: !0, value: p };
    if (m.match(ZR))
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + m + "`"
      );
    return { isToken: !1, value: p };
  });
  o.localize.preprocessor && (l = o.localize.preprocessor(a, l));
  const c = {
    firstWeekContainsDate: i,
    weekStartsOn: s,
    locale: o
  };
  return l.map((p) => {
    if (!p.isToken) return p.value;
    const m = p.value;
    (Av(m) || _v(m)) && Uc(m, t, String(e));
    const g = Qh[m[0]];
    return g(a, m, o.localize, c);
  }).join("");
}
function QR(e) {
  const t = e.match(qR);
  return t ? t[1].replace(KR, "'") : e;
}
function JR() {
  return Object.assign({}, Jr());
}
function ek(e) {
  let n = Ye(e).getDay();
  return n === 0 && (n = 7), n;
}
function tk(e, t) {
  const n = t instanceof Date ? Xe(t, 0) : new t(0);
  return n.setFullYear(
    e.getFullYear(),
    e.getMonth(),
    e.getDate()
  ), n.setHours(
    e.getHours(),
    e.getMinutes(),
    e.getSeconds(),
    e.getMilliseconds()
  ), n;
}
const nk = 10;
class Dv {
  constructor() {
    oe(this, "subPriority", 0);
  }
  validate(t, n) {
    return !0;
  }
}
class rk extends Dv {
  constructor(t, n, r, o, i) {
    super(), this.value = t, this.validateValue = n, this.setValue = r, this.priority = o, i && (this.subPriority = i);
  }
  validate(t, n) {
    return this.validateValue(t, this.value, n);
  }
  set(t, n, r) {
    return this.setValue(t, n, this.value, r);
  }
}
class ok extends Dv {
  constructor() {
    super(...arguments);
    oe(this, "priority", nk);
    oe(this, "subPriority", -1);
  }
  set(n, r) {
    return r.timestampIsSet ? n : Xe(n, tk(n, Date));
  }
}
class Fe {
  run(t, n, r, o) {
    const i = this.parse(t, n, r, o);
    return i ? {
      setter: new rk(
        i.value,
        this.validate,
        this.set,
        this.priority,
        this.subPriority
      ),
      rest: i.rest
    } : null;
  }
  validate(t, n, r) {
    return !0;
  }
}
class ik extends Fe {
  constructor() {
    super(...arguments);
    oe(this, "priority", 140);
    oe(this, "incompatibleTokens", ["R", "u", "t", "T"]);
  }
  parse(n, r, o) {
    switch (r) {
      case "G":
      case "GG":
      case "GGG":
        return o.era(n, { width: "abbreviated" }) || o.era(n, { width: "narrow" });
      case "GGGGG":
        return o.era(n, { width: "narrow" });
      case "GGGG":
      default:
        return o.era(n, { width: "wide" }) || o.era(n, { width: "abbreviated" }) || o.era(n, { width: "narrow" });
    }
  }
  set(n, r, o) {
    return r.era = o, n.setFullYear(o, 0, 1), n.setHours(0, 0, 0, 0), n;
  }
}
const yt = {
  month: /^(1[0-2]|0?\d)/,
  // 0 to 12
  date: /^(3[0-1]|[0-2]?\d)/,
  // 0 to 31
  dayOfYear: /^(36[0-6]|3[0-5]\d|[0-2]?\d?\d)/,
  // 0 to 366
  week: /^(5[0-3]|[0-4]?\d)/,
  // 0 to 53
  hour23h: /^(2[0-3]|[0-1]?\d)/,
  // 0 to 23
  hour24h: /^(2[0-4]|[0-1]?\d)/,
  // 0 to 24
  hour11h: /^(1[0-1]|0?\d)/,
  // 0 to 11
  hour12h: /^(1[0-2]|0?\d)/,
  // 0 to 12
  minute: /^[0-5]?\d/,
  // 0 to 59
  second: /^[0-5]?\d/,
  // 0 to 59
  singleDigit: /^\d/,
  // 0 to 9
  twoDigits: /^\d{1,2}/,
  // 0 to 99
  threeDigits: /^\d{1,3}/,
  // 0 to 999
  fourDigits: /^\d{1,4}/,
  // 0 to 9999
  anyDigitsSigned: /^-?\d+/,
  singleDigitSigned: /^-?\d/,
  // 0 to 9, -0 to -9
  twoDigitsSigned: /^-?\d{1,2}/,
  // 0 to 99, -0 to -99
  threeDigitsSigned: /^-?\d{1,3}/,
  // 0 to 999, -0 to -999
  fourDigitsSigned: /^-?\d{1,4}/
  // 0 to 9999, -0 to -9999
}, En = {
  basicOptionalMinutes: /^([+-])(\d{2})(\d{2})?|Z/,
  basic: /^([+-])(\d{2})(\d{2})|Z/,
  basicOptionalSeconds: /^([+-])(\d{2})(\d{2})((\d{2}))?|Z/,
  extended: /^([+-])(\d{2}):(\d{2})|Z/,
  extendedOptionalSeconds: /^([+-])(\d{2}):(\d{2})(:(\d{2}))?|Z/
};
function vt(e, t) {
  return e && {
    value: t(e.value),
    rest: e.rest
  };
}
function ot(e, t) {
  const n = t.match(e);
  return n ? {
    value: parseInt(n[0], 10),
    rest: t.slice(n[0].length)
  } : null;
}
function Cn(e, t) {
  const n = t.match(e);
  if (!n)
    return null;
  if (n[0] === "Z")
    return {
      value: 0,
      rest: t.slice(1)
    };
  const r = n[1] === "+" ? 1 : -1, o = n[2] ? parseInt(n[2], 10) : 0, i = n[3] ? parseInt(n[3], 10) : 0, s = n[5] ? parseInt(n[5], 10) : 0;
  return {
    value: r * (o * ZP + i * KP + s * XP),
    rest: t.slice(n[0].length)
  };
}
function Mv(e) {
  return ot(yt.anyDigitsSigned, e);
}
function dt(e, t) {
  switch (e) {
    case 1:
      return ot(yt.singleDigit, t);
    case 2:
      return ot(yt.twoDigits, t);
    case 3:
      return ot(yt.threeDigits, t);
    case 4:
      return ot(yt.fourDigits, t);
    default:
      return ot(new RegExp("^\\d{1," + e + "}"), t);
  }
}
function ea(e, t) {
  switch (e) {
    case 1:
      return ot(yt.singleDigitSigned, t);
    case 2:
      return ot(yt.twoDigitsSigned, t);
    case 3:
      return ot(yt.threeDigitsSigned, t);
    case 4:
      return ot(yt.fourDigitsSigned, t);
    default:
      return ot(new RegExp("^-?\\d{1," + e + "}"), t);
  }
}
function ud(e) {
  switch (e) {
    case "morning":
      return 4;
    case "evening":
      return 17;
    case "pm":
    case "noon":
    case "afternoon":
      return 12;
    case "am":
    case "midnight":
    case "night":
    default:
      return 0;
  }
}
function Nv(e, t) {
  const n = t > 0, r = n ? t : 1 - t;
  let o;
  if (r <= 50)
    o = e || 100;
  else {
    const i = r + 50, s = Math.trunc(i / 100) * 100, a = e >= i % 100;
    o = e + s - (a ? 100 : 0);
  }
  return n ? o : 1 - o;
}
function Fv(e) {
  return e % 400 === 0 || e % 4 === 0 && e % 100 !== 0;
}
class sk extends Fe {
  constructor() {
    super(...arguments);
    oe(this, "priority", 130);
    oe(this, "incompatibleTokens", ["Y", "R", "u", "w", "I", "i", "e", "c", "t", "T"]);
  }
  parse(n, r, o) {
    const i = (s) => ({
      year: s,
      isTwoDigitYear: r === "yy"
    });
    switch (r) {
      case "y":
        return vt(dt(4, n), i);
      case "yo":
        return vt(
          o.ordinalNumber(n, {
            unit: "year"
          }),
          i
        );
      default:
        return vt(dt(r.length, n), i);
    }
  }
  validate(n, r) {
    return r.isTwoDigitYear || r.year > 0;
  }
  set(n, r, o) {
    const i = n.getFullYear();
    if (o.isTwoDigitYear) {
      const a = Nv(
        o.year,
        i
      );
      return n.setFullYear(a, 0, 1), n.setHours(0, 0, 0, 0), n;
    }
    const s = !("era" in r) || r.era === 1 ? o.year : 1 - o.year;
    return n.setFullYear(s, 0, 1), n.setHours(0, 0, 0, 0), n;
  }
}
class ak extends Fe {
  constructor() {
    super(...arguments);
    oe(this, "priority", 130);
    oe(this, "incompatibleTokens", [
      "y",
      "R",
      "u",
      "Q",
      "q",
      "M",
      "L",
      "I",
      "d",
      "D",
      "i",
      "t",
      "T"
    ]);
  }
  parse(n, r, o) {
    const i = (s) => ({
      year: s,
      isTwoDigitYear: r === "YY"
    });
    switch (r) {
      case "Y":
        return vt(dt(4, n), i);
      case "Yo":
        return vt(
          o.ordinalNumber(n, {
            unit: "year"
          }),
          i
        );
      default:
        return vt(dt(r.length, n), i);
    }
  }
  validate(n, r) {
    return r.isTwoDigitYear || r.year > 0;
  }
  set(n, r, o, i) {
    const s = cd(n, i);
    if (o.isTwoDigitYear) {
      const l = Nv(
        o.year,
        s
      );
      return n.setFullYear(
        l,
        0,
        i.firstWeekContainsDate
      ), n.setHours(0, 0, 0, 0), In(n, i);
    }
    const a = !("era" in r) || r.era === 1 ? o.year : 1 - o.year;
    return n.setFullYear(a, 0, i.firstWeekContainsDate), n.setHours(0, 0, 0, 0), In(n, i);
  }
}
class lk extends Fe {
  constructor() {
    super(...arguments);
    oe(this, "priority", 130);
    oe(this, "incompatibleTokens", [
      "G",
      "y",
      "Y",
      "u",
      "Q",
      "q",
      "M",
      "L",
      "w",
      "d",
      "D",
      "e",
      "c",
      "t",
      "T"
    ]);
  }
  parse(n, r) {
    return ea(r === "R" ? 4 : r.length, n);
  }
  set(n, r, o) {
    const i = Xe(n, 0);
    return i.setFullYear(o, 0, 4), i.setHours(0, 0, 0, 0), Do(i);
  }
}
class ck extends Fe {
  constructor() {
    super(...arguments);
    oe(this, "priority", 130);
    oe(this, "incompatibleTokens", ["G", "y", "Y", "R", "w", "I", "i", "e", "c", "t", "T"]);
  }
  parse(n, r) {
    return ea(r === "u" ? 4 : r.length, n);
  }
  set(n, r, o) {
    return n.setFullYear(o, 0, 1), n.setHours(0, 0, 0, 0), n;
  }
}
class uk extends Fe {
  constructor() {
    super(...arguments);
    oe(this, "priority", 120);
    oe(this, "incompatibleTokens", [
      "Y",
      "R",
      "q",
      "M",
      "L",
      "w",
      "I",
      "d",
      "D",
      "i",
      "e",
      "c",
      "t",
      "T"
    ]);
  }
  parse(n, r, o) {
    switch (r) {
      case "Q":
      case "QQ":
        return dt(r.length, n);
      case "Qo":
        return o.ordinalNumber(n, { unit: "quarter" });
      case "QQQ":
        return o.quarter(n, {
          width: "abbreviated",
          context: "formatting"
        }) || o.quarter(n, {
          width: "narrow",
          context: "formatting"
        });
      case "QQQQQ":
        return o.quarter(n, {
          width: "narrow",
          context: "formatting"
        });
      case "QQQQ":
      default:
        return o.quarter(n, {
          width: "wide",
          context: "formatting"
        }) || o.quarter(n, {
          width: "abbreviated",
          context: "formatting"
        }) || o.quarter(n, {
          width: "narrow",
          context: "formatting"
        });
    }
  }
  validate(n, r) {
    return r >= 1 && r <= 4;
  }
  set(n, r, o) {
    return n.setMonth((o - 1) * 3, 1), n.setHours(0, 0, 0, 0), n;
  }
}
class dk extends Fe {
  constructor() {
    super(...arguments);
    oe(this, "priority", 120);
    oe(this, "incompatibleTokens", [
      "Y",
      "R",
      "Q",
      "M",
      "L",
      "w",
      "I",
      "d",
      "D",
      "i",
      "e",
      "c",
      "t",
      "T"
    ]);
  }
  parse(n, r, o) {
    switch (r) {
      case "q":
      case "qq":
        return dt(r.length, n);
      case "qo":
        return o.ordinalNumber(n, { unit: "quarter" });
      case "qqq":
        return o.quarter(n, {
          width: "abbreviated",
          context: "standalone"
        }) || o.quarter(n, {
          width: "narrow",
          context: "standalone"
        });
      case "qqqqq":
        return o.quarter(n, {
          width: "narrow",
          context: "standalone"
        });
      case "qqqq":
      default:
        return o.quarter(n, {
          width: "wide",
          context: "standalone"
        }) || o.quarter(n, {
          width: "abbreviated",
          context: "standalone"
        }) || o.quarter(n, {
          width: "narrow",
          context: "standalone"
        });
    }
  }
  validate(n, r) {
    return r >= 1 && r <= 4;
  }
  set(n, r, o) {
    return n.setMonth((o - 1) * 3, 1), n.setHours(0, 0, 0, 0), n;
  }
}
class fk extends Fe {
  constructor() {
    super(...arguments);
    oe(this, "incompatibleTokens", [
      "Y",
      "R",
      "q",
      "Q",
      "L",
      "w",
      "I",
      "D",
      "i",
      "e",
      "c",
      "t",
      "T"
    ]);
    oe(this, "priority", 110);
  }
  parse(n, r, o) {
    const i = (s) => s - 1;
    switch (r) {
      case "M":
        return vt(
          ot(yt.month, n),
          i
        );
      case "MM":
        return vt(dt(2, n), i);
      case "Mo":
        return vt(
          o.ordinalNumber(n, {
            unit: "month"
          }),
          i
        );
      case "MMM":
        return o.month(n, {
          width: "abbreviated",
          context: "formatting"
        }) || o.month(n, { width: "narrow", context: "formatting" });
      case "MMMMM":
        return o.month(n, {
          width: "narrow",
          context: "formatting"
        });
      case "MMMM":
      default:
        return o.month(n, { width: "wide", context: "formatting" }) || o.month(n, {
          width: "abbreviated",
          context: "formatting"
        }) || o.month(n, { width: "narrow", context: "formatting" });
    }
  }
  validate(n, r) {
    return r >= 0 && r <= 11;
  }
  set(n, r, o) {
    return n.setMonth(o, 1), n.setHours(0, 0, 0, 0), n;
  }
}
class hk extends Fe {
  constructor() {
    super(...arguments);
    oe(this, "priority", 110);
    oe(this, "incompatibleTokens", [
      "Y",
      "R",
      "q",
      "Q",
      "M",
      "w",
      "I",
      "D",
      "i",
      "e",
      "c",
      "t",
      "T"
    ]);
  }
  parse(n, r, o) {
    const i = (s) => s - 1;
    switch (r) {
      case "L":
        return vt(
          ot(yt.month, n),
          i
        );
      case "LL":
        return vt(dt(2, n), i);
      case "Lo":
        return vt(
          o.ordinalNumber(n, {
            unit: "month"
          }),
          i
        );
      case "LLL":
        return o.month(n, {
          width: "abbreviated",
          context: "standalone"
        }) || o.month(n, { width: "narrow", context: "standalone" });
      case "LLLLL":
        return o.month(n, {
          width: "narrow",
          context: "standalone"
        });
      case "LLLL":
      default:
        return o.month(n, { width: "wide", context: "standalone" }) || o.month(n, {
          width: "abbreviated",
          context: "standalone"
        }) || o.month(n, { width: "narrow", context: "standalone" });
    }
  }
  validate(n, r) {
    return r >= 0 && r <= 11;
  }
  set(n, r, o) {
    return n.setMonth(o, 1), n.setHours(0, 0, 0, 0), n;
  }
}
function pk(e, t, n) {
  const r = Ye(e), o = Ov(r, n) - t;
  return r.setDate(r.getDate() - o * 7), r;
}
class mk extends Fe {
  constructor() {
    super(...arguments);
    oe(this, "priority", 100);
    oe(this, "incompatibleTokens", [
      "y",
      "R",
      "u",
      "q",
      "Q",
      "M",
      "L",
      "I",
      "d",
      "D",
      "i",
      "t",
      "T"
    ]);
  }
  parse(n, r, o) {
    switch (r) {
      case "w":
        return ot(yt.week, n);
      case "wo":
        return o.ordinalNumber(n, { unit: "week" });
      default:
        return dt(r.length, n);
    }
  }
  validate(n, r) {
    return r >= 1 && r <= 53;
  }
  set(n, r, o, i) {
    return In(pk(n, o, i), i);
  }
}
function gk(e, t) {
  const n = Ye(e), r = kv(n) - t;
  return n.setDate(n.getDate() - r * 7), n;
}
class yk extends Fe {
  constructor() {
    super(...arguments);
    oe(this, "priority", 100);
    oe(this, "incompatibleTokens", [
      "y",
      "Y",
      "u",
      "q",
      "Q",
      "M",
      "L",
      "w",
      "d",
      "D",
      "e",
      "c",
      "t",
      "T"
    ]);
  }
  parse(n, r, o) {
    switch (r) {
      case "I":
        return ot(yt.week, n);
      case "Io":
        return o.ordinalNumber(n, { unit: "week" });
      default:
        return dt(r.length, n);
    }
  }
  validate(n, r) {
    return r >= 1 && r <= 53;
  }
  set(n, r, o) {
    return Do(gk(n, o));
  }
}
const vk = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], bk = [
  31,
  29,
  31,
  30,
  31,
  30,
  31,
  31,
  30,
  31,
  30,
  31
];
class wk extends Fe {
  constructor() {
    super(...arguments);
    oe(this, "priority", 90);
    oe(this, "subPriority", 1);
    oe(this, "incompatibleTokens", [
      "Y",
      "R",
      "q",
      "Q",
      "w",
      "I",
      "D",
      "i",
      "e",
      "c",
      "t",
      "T"
    ]);
  }
  parse(n, r, o) {
    switch (r) {
      case "d":
        return ot(yt.date, n);
      case "do":
        return o.ordinalNumber(n, { unit: "date" });
      default:
        return dt(r.length, n);
    }
  }
  validate(n, r) {
    const o = n.getFullYear(), i = Fv(o), s = n.getMonth();
    return i ? r >= 1 && r <= bk[s] : r >= 1 && r <= vk[s];
  }
  set(n, r, o) {
    return n.setDate(o), n.setHours(0, 0, 0, 0), n;
  }
}
class xk extends Fe {
  constructor() {
    super(...arguments);
    oe(this, "priority", 90);
    oe(this, "subpriority", 1);
    oe(this, "incompatibleTokens", [
      "Y",
      "R",
      "q",
      "Q",
      "M",
      "L",
      "w",
      "I",
      "d",
      "E",
      "i",
      "e",
      "c",
      "t",
      "T"
    ]);
  }
  parse(n, r, o) {
    switch (r) {
      case "D":
      case "DD":
        return ot(yt.dayOfYear, n);
      case "Do":
        return o.ordinalNumber(n, { unit: "date" });
      default:
        return dt(r.length, n);
    }
  }
  validate(n, r) {
    const o = n.getFullYear();
    return Fv(o) ? r >= 1 && r <= 366 : r >= 1 && r <= 365;
  }
  set(n, r, o) {
    return n.setMonth(0, o), n.setHours(0, 0, 0, 0), n;
  }
}
function dd(e, t, n) {
  var d, f, h, p;
  const r = Jr(), o = (n == null ? void 0 : n.weekStartsOn) ?? ((f = (d = n == null ? void 0 : n.locale) == null ? void 0 : d.options) == null ? void 0 : f.weekStartsOn) ?? r.weekStartsOn ?? ((p = (h = r.locale) == null ? void 0 : h.options) == null ? void 0 : p.weekStartsOn) ?? 0, i = Ye(e), s = i.getDay(), l = (t % 7 + 7) % 7, c = 7 - o, u = t < 0 || t > 6 ? t - (s + c) % 7 : (l + c) % 7 - (s + c) % 7;
  return Ko(i, u);
}
class Tk extends Fe {
  constructor() {
    super(...arguments);
    oe(this, "priority", 90);
    oe(this, "incompatibleTokens", ["D", "i", "e", "c", "t", "T"]);
  }
  parse(n, r, o) {
    switch (r) {
      case "E":
      case "EE":
      case "EEE":
        return o.day(n, {
          width: "abbreviated",
          context: "formatting"
        }) || o.day(n, { width: "short", context: "formatting" }) || o.day(n, { width: "narrow", context: "formatting" });
      case "EEEEE":
        return o.day(n, {
          width: "narrow",
          context: "formatting"
        });
      case "EEEEEE":
        return o.day(n, { width: "short", context: "formatting" }) || o.day(n, { width: "narrow", context: "formatting" });
      case "EEEE":
      default:
        return o.day(n, { width: "wide", context: "formatting" }) || o.day(n, {
          width: "abbreviated",
          context: "formatting"
        }) || o.day(n, { width: "short", context: "formatting" }) || o.day(n, { width: "narrow", context: "formatting" });
    }
  }
  validate(n, r) {
    return r >= 0 && r <= 6;
  }
  set(n, r, o, i) {
    return n = dd(n, o, i), n.setHours(0, 0, 0, 0), n;
  }
}
class Sk extends Fe {
  constructor() {
    super(...arguments);
    oe(this, "priority", 90);
    oe(this, "incompatibleTokens", [
      "y",
      "R",
      "u",
      "q",
      "Q",
      "M",
      "L",
      "I",
      "d",
      "D",
      "E",
      "i",
      "c",
      "t",
      "T"
    ]);
  }
  parse(n, r, o, i) {
    const s = (a) => {
      const l = Math.floor((a - 1) / 7) * 7;
      return (a + i.weekStartsOn + 6) % 7 + l;
    };
    switch (r) {
      case "e":
      case "ee":
        return vt(dt(r.length, n), s);
      case "eo":
        return vt(
          o.ordinalNumber(n, {
            unit: "day"
          }),
          s
        );
      case "eee":
        return o.day(n, {
          width: "abbreviated",
          context: "formatting"
        }) || o.day(n, { width: "short", context: "formatting" }) || o.day(n, { width: "narrow", context: "formatting" });
      case "eeeee":
        return o.day(n, {
          width: "narrow",
          context: "formatting"
        });
      case "eeeeee":
        return o.day(n, { width: "short", context: "formatting" }) || o.day(n, { width: "narrow", context: "formatting" });
      case "eeee":
      default:
        return o.day(n, { width: "wide", context: "formatting" }) || o.day(n, {
          width: "abbreviated",
          context: "formatting"
        }) || o.day(n, { width: "short", context: "formatting" }) || o.day(n, { width: "narrow", context: "formatting" });
    }
  }
  validate(n, r) {
    return r >= 0 && r <= 6;
  }
  set(n, r, o, i) {
    return n = dd(n, o, i), n.setHours(0, 0, 0, 0), n;
  }
}
class Ek extends Fe {
  constructor() {
    super(...arguments);
    oe(this, "priority", 90);
    oe(this, "incompatibleTokens", [
      "y",
      "R",
      "u",
      "q",
      "Q",
      "M",
      "L",
      "I",
      "d",
      "D",
      "E",
      "i",
      "e",
      "t",
      "T"
    ]);
  }
  parse(n, r, o, i) {
    const s = (a) => {
      const l = Math.floor((a - 1) / 7) * 7;
      return (a + i.weekStartsOn + 6) % 7 + l;
    };
    switch (r) {
      case "c":
      case "cc":
        return vt(dt(r.length, n), s);
      case "co":
        return vt(
          o.ordinalNumber(n, {
            unit: "day"
          }),
          s
        );
      case "ccc":
        return o.day(n, {
          width: "abbreviated",
          context: "standalone"
        }) || o.day(n, { width: "short", context: "standalone" }) || o.day(n, { width: "narrow", context: "standalone" });
      case "ccccc":
        return o.day(n, {
          width: "narrow",
          context: "standalone"
        });
      case "cccccc":
        return o.day(n, { width: "short", context: "standalone" }) || o.day(n, { width: "narrow", context: "standalone" });
      case "cccc":
      default:
        return o.day(n, { width: "wide", context: "standalone" }) || o.day(n, {
          width: "abbreviated",
          context: "standalone"
        }) || o.day(n, { width: "short", context: "standalone" }) || o.day(n, { width: "narrow", context: "standalone" });
    }
  }
  validate(n, r) {
    return r >= 0 && r <= 6;
  }
  set(n, r, o, i) {
    return n = dd(n, o, i), n.setHours(0, 0, 0, 0), n;
  }
}
function Ck(e, t) {
  const n = Ye(e), r = ek(n), o = t - r;
  return Ko(n, o);
}
class Pk extends Fe {
  constructor() {
    super(...arguments);
    oe(this, "priority", 90);
    oe(this, "incompatibleTokens", [
      "y",
      "Y",
      "u",
      "q",
      "Q",
      "M",
      "L",
      "w",
      "d",
      "D",
      "E",
      "e",
      "c",
      "t",
      "T"
    ]);
  }
  parse(n, r, o) {
    const i = (s) => s === 0 ? 7 : s;
    switch (r) {
      case "i":
      case "ii":
        return dt(r.length, n);
      case "io":
        return o.ordinalNumber(n, { unit: "day" });
      case "iii":
        return vt(
          o.day(n, {
            width: "abbreviated",
            context: "formatting"
          }) || o.day(n, {
            width: "short",
            context: "formatting"
          }) || o.day(n, {
            width: "narrow",
            context: "formatting"
          }),
          i
        );
      case "iiiii":
        return vt(
          o.day(n, {
            width: "narrow",
            context: "formatting"
          }),
          i
        );
      case "iiiiii":
        return vt(
          o.day(n, {
            width: "short",
            context: "formatting"
          }) || o.day(n, {
            width: "narrow",
            context: "formatting"
          }),
          i
        );
      case "iiii":
      default:
        return vt(
          o.day(n, {
            width: "wide",
            context: "formatting"
          }) || o.day(n, {
            width: "abbreviated",
            context: "formatting"
          }) || o.day(n, {
            width: "short",
            context: "formatting"
          }) || o.day(n, {
            width: "narrow",
            context: "formatting"
          }),
          i
        );
    }
  }
  validate(n, r) {
    return r >= 1 && r <= 7;
  }
  set(n, r, o) {
    return n = Ck(n, o), n.setHours(0, 0, 0, 0), n;
  }
}
class Rk extends Fe {
  constructor() {
    super(...arguments);
    oe(this, "priority", 80);
    oe(this, "incompatibleTokens", ["b", "B", "H", "k", "t", "T"]);
  }
  parse(n, r, o) {
    switch (r) {
      case "a":
      case "aa":
      case "aaa":
        return o.dayPeriod(n, {
          width: "abbreviated",
          context: "formatting"
        }) || o.dayPeriod(n, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaaa":
        return o.dayPeriod(n, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaa":
      default:
        return o.dayPeriod(n, {
          width: "wide",
          context: "formatting"
        }) || o.dayPeriod(n, {
          width: "abbreviated",
          context: "formatting"
        }) || o.dayPeriod(n, {
          width: "narrow",
          context: "formatting"
        });
    }
  }
  set(n, r, o) {
    return n.setHours(ud(o), 0, 0, 0), n;
  }
}
class kk extends Fe {
  constructor() {
    super(...arguments);
    oe(this, "priority", 80);
    oe(this, "incompatibleTokens", ["a", "B", "H", "k", "t", "T"]);
  }
  parse(n, r, o) {
    switch (r) {
      case "b":
      case "bb":
      case "bbb":
        return o.dayPeriod(n, {
          width: "abbreviated",
          context: "formatting"
        }) || o.dayPeriod(n, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbbb":
        return o.dayPeriod(n, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbb":
      default:
        return o.dayPeriod(n, {
          width: "wide",
          context: "formatting"
        }) || o.dayPeriod(n, {
          width: "abbreviated",
          context: "formatting"
        }) || o.dayPeriod(n, {
          width: "narrow",
          context: "formatting"
        });
    }
  }
  set(n, r, o) {
    return n.setHours(ud(o), 0, 0, 0), n;
  }
}
class Ok extends Fe {
  constructor() {
    super(...arguments);
    oe(this, "priority", 80);
    oe(this, "incompatibleTokens", ["a", "b", "t", "T"]);
  }
  parse(n, r, o) {
    switch (r) {
      case "B":
      case "BB":
      case "BBB":
        return o.dayPeriod(n, {
          width: "abbreviated",
          context: "formatting"
        }) || o.dayPeriod(n, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBBB":
        return o.dayPeriod(n, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBB":
      default:
        return o.dayPeriod(n, {
          width: "wide",
          context: "formatting"
        }) || o.dayPeriod(n, {
          width: "abbreviated",
          context: "formatting"
        }) || o.dayPeriod(n, {
          width: "narrow",
          context: "formatting"
        });
    }
  }
  set(n, r, o) {
    return n.setHours(ud(o), 0, 0, 0), n;
  }
}
class Ik extends Fe {
  constructor() {
    super(...arguments);
    oe(this, "priority", 70);
    oe(this, "incompatibleTokens", ["H", "K", "k", "t", "T"]);
  }
  parse(n, r, o) {
    switch (r) {
      case "h":
        return ot(yt.hour12h, n);
      case "ho":
        return o.ordinalNumber(n, { unit: "hour" });
      default:
        return dt(r.length, n);
    }
  }
  validate(n, r) {
    return r >= 1 && r <= 12;
  }
  set(n, r, o) {
    const i = n.getHours() >= 12;
    return i && o < 12 ? n.setHours(o + 12, 0, 0, 0) : !i && o === 12 ? n.setHours(0, 0, 0, 0) : n.setHours(o, 0, 0, 0), n;
  }
}
class _k extends Fe {
  constructor() {
    super(...arguments);
    oe(this, "priority", 70);
    oe(this, "incompatibleTokens", ["a", "b", "h", "K", "k", "t", "T"]);
  }
  parse(n, r, o) {
    switch (r) {
      case "H":
        return ot(yt.hour23h, n);
      case "Ho":
        return o.ordinalNumber(n, { unit: "hour" });
      default:
        return dt(r.length, n);
    }
  }
  validate(n, r) {
    return r >= 0 && r <= 23;
  }
  set(n, r, o) {
    return n.setHours(o, 0, 0, 0), n;
  }
}
class Ak extends Fe {
  constructor() {
    super(...arguments);
    oe(this, "priority", 70);
    oe(this, "incompatibleTokens", ["h", "H", "k", "t", "T"]);
  }
  parse(n, r, o) {
    switch (r) {
      case "K":
        return ot(yt.hour11h, n);
      case "Ko":
        return o.ordinalNumber(n, { unit: "hour" });
      default:
        return dt(r.length, n);
    }
  }
  validate(n, r) {
    return r >= 0 && r <= 11;
  }
  set(n, r, o) {
    return n.getHours() >= 12 && o < 12 ? n.setHours(o + 12, 0, 0, 0) : n.setHours(o, 0, 0, 0), n;
  }
}
class Dk extends Fe {
  constructor() {
    super(...arguments);
    oe(this, "priority", 70);
    oe(this, "incompatibleTokens", ["a", "b", "h", "H", "K", "t", "T"]);
  }
  parse(n, r, o) {
    switch (r) {
      case "k":
        return ot(yt.hour24h, n);
      case "ko":
        return o.ordinalNumber(n, { unit: "hour" });
      default:
        return dt(r.length, n);
    }
  }
  validate(n, r) {
    return r >= 1 && r <= 24;
  }
  set(n, r, o) {
    const i = o <= 24 ? o % 24 : o;
    return n.setHours(i, 0, 0, 0), n;
  }
}
class Mk extends Fe {
  constructor() {
    super(...arguments);
    oe(this, "priority", 60);
    oe(this, "incompatibleTokens", ["t", "T"]);
  }
  parse(n, r, o) {
    switch (r) {
      case "m":
        return ot(yt.minute, n);
      case "mo":
        return o.ordinalNumber(n, { unit: "minute" });
      default:
        return dt(r.length, n);
    }
  }
  validate(n, r) {
    return r >= 0 && r <= 59;
  }
  set(n, r, o) {
    return n.setMinutes(o, 0, 0), n;
  }
}
class Nk extends Fe {
  constructor() {
    super(...arguments);
    oe(this, "priority", 50);
    oe(this, "incompatibleTokens", ["t", "T"]);
  }
  parse(n, r, o) {
    switch (r) {
      case "s":
        return ot(yt.second, n);
      case "so":
        return o.ordinalNumber(n, { unit: "second" });
      default:
        return dt(r.length, n);
    }
  }
  validate(n, r) {
    return r >= 0 && r <= 59;
  }
  set(n, r, o) {
    return n.setSeconds(o, 0), n;
  }
}
class Fk extends Fe {
  constructor() {
    super(...arguments);
    oe(this, "priority", 30);
    oe(this, "incompatibleTokens", ["t", "T"]);
  }
  parse(n, r) {
    const o = (i) => Math.trunc(i * Math.pow(10, -r.length + 3));
    return vt(dt(r.length, n), o);
  }
  set(n, r, o) {
    return n.setMilliseconds(o), n;
  }
}
class Lk extends Fe {
  constructor() {
    super(...arguments);
    oe(this, "priority", 10);
    oe(this, "incompatibleTokens", ["t", "T", "x"]);
  }
  parse(n, r) {
    switch (r) {
      case "X":
        return Cn(
          En.basicOptionalMinutes,
          n
        );
      case "XX":
        return Cn(En.basic, n);
      case "XXXX":
        return Cn(
          En.basicOptionalSeconds,
          n
        );
      case "XXXXX":
        return Cn(
          En.extendedOptionalSeconds,
          n
        );
      case "XXX":
      default:
        return Cn(En.extended, n);
    }
  }
  set(n, r, o) {
    return r.timestampIsSet ? n : Xe(
      n,
      n.getTime() - Js(n) - o
    );
  }
}
class Vk extends Fe {
  constructor() {
    super(...arguments);
    oe(this, "priority", 10);
    oe(this, "incompatibleTokens", ["t", "T", "X"]);
  }
  parse(n, r) {
    switch (r) {
      case "x":
        return Cn(
          En.basicOptionalMinutes,
          n
        );
      case "xx":
        return Cn(En.basic, n);
      case "xxxx":
        return Cn(
          En.basicOptionalSeconds,
          n
        );
      case "xxxxx":
        return Cn(
          En.extendedOptionalSeconds,
          n
        );
      case "xxx":
      default:
        return Cn(En.extended, n);
    }
  }
  set(n, r, o) {
    return r.timestampIsSet ? n : Xe(
      n,
      n.getTime() - Js(n) - o
    );
  }
}
class $k extends Fe {
  constructor() {
    super(...arguments);
    oe(this, "priority", 40);
    oe(this, "incompatibleTokens", "*");
  }
  parse(n) {
    return Mv(n);
  }
  set(n, r, o) {
    return [Xe(n, o * 1e3), { timestampIsSet: !0 }];
  }
}
class jk extends Fe {
  constructor() {
    super(...arguments);
    oe(this, "priority", 20);
    oe(this, "incompatibleTokens", "*");
  }
  parse(n) {
    return Mv(n);
  }
  set(n, r, o) {
    return [Xe(n, o), { timestampIsSet: !0 }];
  }
}
const Bk = {
  G: new ik(),
  y: new sk(),
  Y: new ak(),
  R: new lk(),
  u: new ck(),
  Q: new uk(),
  q: new dk(),
  M: new fk(),
  L: new hk(),
  w: new mk(),
  I: new yk(),
  d: new wk(),
  D: new xk(),
  E: new Tk(),
  e: new Sk(),
  c: new Ek(),
  i: new Pk(),
  a: new Rk(),
  b: new kk(),
  B: new Ok(),
  h: new Ik(),
  H: new _k(),
  K: new Ak(),
  k: new Dk(),
  m: new Mk(),
  s: new Nk(),
  S: new Fk(),
  X: new Lk(),
  x: new Vk(),
  t: new $k(),
  T: new jk()
}, zk = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, Wk = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, Hk = /^'([^]*?)'?$/, Uk = /''/g, Gk = /\S/, Yk = /[a-zA-Z]/;
function qk(e, t, n, r) {
  var m, g, v, b;
  const o = JR(), i = o.locale ?? Rv, s = o.firstWeekContainsDate ?? ((g = (m = o.locale) == null ? void 0 : m.options) == null ? void 0 : g.firstWeekContainsDate) ?? 1, a = o.weekStartsOn ?? ((b = (v = o.locale) == null ? void 0 : v.options) == null ? void 0 : b.weekStartsOn) ?? 0;
  if (t === "")
    return e === "" ? Ye(n) : Xe(n, NaN);
  const l = {
    firstWeekContainsDate: s,
    weekStartsOn: a,
    locale: i
  }, c = [new ok()], u = t.match(Wk).map((y) => {
    const x = y[0];
    if (x in Hc) {
      const w = Hc[x];
      return w(y, i.formatLong);
    }
    return y;
  }).join("").match(zk), d = [];
  for (let y of u) {
    Av(y) && Uc(y, t, e), _v(y) && Uc(y, t, e);
    const x = y[0], w = Bk[x];
    if (w) {
      const { incompatibleTokens: T } = w;
      if (Array.isArray(T)) {
        const I = d.find(
          (_) => T.includes(_.token) || _.token === x
        );
        if (I)
          throw new RangeError(
            `The format string mustn't contain \`${I.fullToken}\` and \`${y}\` at the same time`
          );
      } else if (w.incompatibleTokens === "*" && d.length > 0)
        throw new RangeError(
          `The format string mustn't contain \`${y}\` and any other token at the same time`
        );
      d.push({ token: x, fullToken: y });
      const P = w.run(
        e,
        y,
        i.match,
        l
      );
      if (!P)
        return Xe(n, NaN);
      c.push(P.setter), e = P.rest;
    } else {
      if (x.match(Yk))
        throw new RangeError(
          "Format string contains an unescaped latin alphabet character `" + x + "`"
        );
      if (y === "''" ? y = "'" : x === "'" && (y = Kk(y)), e.indexOf(y) === 0)
        e = e.slice(y.length);
      else
        return Xe(n, NaN);
    }
  }
  if (e.length > 0 && Gk.test(e))
    return Xe(n, NaN);
  const f = c.map((y) => y.priority).sort((y, x) => x - y).filter((y, x, w) => w.indexOf(y) === x).map(
    (y) => c.filter((x) => x.priority === y).sort((x, w) => w.subPriority - x.subPriority)
  ).map((y) => y[0]);
  let h = Ye(n);
  if (isNaN(h.getTime()))
    return Xe(n, NaN);
  const p = {};
  for (const y of f) {
    if (!y.validate(h, l))
      return Xe(n, NaN);
    const x = y.set(h, p, l);
    Array.isArray(x) ? (h = x[0], Object.assign(p, x[1])) : h = x;
  }
  return Xe(n, h);
}
function Kk(e) {
  return e.match(Hk)[1].replace(Uk, "'");
}
function Zk(e, t) {
  const n = Ye(e), r = Ye(t);
  return n.getFullYear() === r.getFullYear() && n.getMonth() === r.getMonth();
}
function Xk(e) {
  return nR(e, tR(e));
}
function Qk(e, t) {
  return Ko(e, -t);
}
function Lv(e, t) {
  return Ya(e, -t);
}
function Jk(e, t) {
  return Sv(e, -t);
}
function eO(e, t) {
  return Ev(e, -t);
}
var Nt = function() {
  return Nt = Object.assign || function(t) {
    for (var n, r = 1, o = arguments.length; r < o; r++) {
      n = arguments[r];
      for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i]);
    }
    return t;
  }, Nt.apply(this, arguments);
};
function fd(e, t) {
  var n = {};
  for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
  return n;
}
function Gc(e, t) {
  var n = typeof Symbol == "function" && e[Symbol.iterator];
  if (!n) return e;
  var r = n.call(e), o, i = [], s;
  try {
    for (; (t === void 0 || t-- > 0) && !(o = r.next()).done; ) i.push(o.value);
  } catch (a) {
    s = { error: a };
  } finally {
    try {
      o && !o.done && (n = r.return) && n.call(r);
    } finally {
      if (s) throw s.error;
    }
  }
  return i;
}
var Ni = function(e) {
  return e.replace(new RegExp(" ", "g"), " ");
}, Vv = function(e, t) {
  var n = e.length, r = t + 1;
  if (n >= r)
    return e;
  var o = "0".repeat(r - n);
  return "".concat(o).concat(e);
}, tO = function(e) {
  return e.replace(/^0+([0-9]+)/, "$1");
}, $v = function(e, t, n) {
  var r = e.length - 2, o = tO(e.substring(0, r)), i = e.substring(r);
  return o.split(/(?=(?:\d{3})*$)/).join(t) + n + i;
}, jv = function(e) {
  return e === void 0 && (e = ""), e.replace(/(-(?!\d))|[^0-9|-]/g, "") || "";
}, Bv = function(e) {
  return Number.parseFloat(e.replace(/,/g, ".").replace(/(.*)\./, function(t) {
    return "".concat(t.replace(/\./g, ""), ".");
  }).replace(/[^0-9.]/g, ""));
}, nO = function(e, t) {
  return Object.prototype.hasOwnProperty.call(e, t);
}, $l = function(e) {
  var t = ye(e);
  return xe(function() {
    t.current = e;
  }, [e]), t;
}, rO = function(e) {
  return e === "money" || e === "currency";
}, oO = function(e, t, n) {
  return new Intl.NumberFormat(e, { style: "currency", currency: t, currencyDisplay: n }).formatToParts(1e3).reduce(function(r, o) {
    var i;
    return Nt(Nt({}, r), (i = {}, i[o.type] = o.value, i));
  }, { currency: "", currencyDisplay: "", decimal: ",", fraction: "", group: "", integer: "", literal: "" });
}, jl = function(e, t) {
  var n = Vv(jv(e), t.fraction.length), r = "".concat(t.currency).concat($v(n, t.group, t.decimal));
  return Ni(r);
}, iO = ut(function(e, t) {
  var n = e.locale, r = n === void 0 ? "pt-BR" : n, o = e.currency, i = o === void 0 ? "BRL" : o, s = e.currencyDisplay, a = s === void 0 ? "symbol" : s;
  e.mask;
  var l = e.onChange, c = fd(e, ["locale", "currency", "currencyDisplay", "mask", "onChange"]), u = ye(null);
  Gr(t, function() {
    return u.current;
  });
  var d = Ue(function() {
    var p = oO(r, i, a);
    return p.currency = Ni("".concat(p.currency.trim(), " ")), p.literal = Ni(p.literal.trim()), p;
  }, [r, i]), f = function(p) {
    var m = jl(p.target.value, d), g = Bv(m);
    p.target.value = m, p.target.setAttribute("data-number", g.toString()), l == null || l(p), g !== 0 && (u.current.selectionEnd = m.length);
  }, h = c.defaultValue ? jl(c.defaultValue, d) : void 0;
  return F.createElement("input", Nt({}, c, { value: typeof c.value == "string" ? jl(c.value, d) : c.value, defaultValue: h, type: "text", ref: u, onChange: f, inputMode: "decimal" }));
}), sO = 1, aO = function(e) {
  return e === "percentage" || e === "percent" || e === "percentual";
}, lO = function(e) {
  return new Intl.NumberFormat(e, { style: "percent", minimumFractionDigits: 2 }).formatToParts(1e3).reduce(function(t, n) {
    var r;
    return Nt(Nt({}, t), (r = {}, r[n.type] = n.value, r));
  }, { decimal: "", fraction: "", group: "", integer: "", percentSign: "", type: "", value: "" });
}, Bl = function(e, t) {
  var n = Vv(jv(e), t.fraction.length), r = "".concat($v(n, t.group, t.decimal), " ").concat(t.percentSign);
  return Ni(r);
}, cO = ut(function(e, t) {
  var n = e.locale, r = n === void 0 ? "pt-BR" : n;
  e.mask;
  var o = e.onChange, i = e.onKeyUp, s = fd(e, ["locale", "mask", "onChange", "onKeyUp"]), a = ye(null), l = Gc(Me(function() {
    var v, b;
    return (b = (v = s.value) === null || v === void 0 ? void 0 : v.toString()) !== null && b !== void 0 ? b : "";
  }), 2), c = l[0], u = l[1];
  Gr(t, function() {
    return a.current;
  }), xe(function() {
    var v, b = Number.parseFloat("".concat((v = s.value) !== null && v !== void 0 ? v : "0")).toFixed(d.fraction.length);
    u(Bl(b, d));
  }, [s.value]);
  var d = Ue(function() {
    var v = lO(r);
    return v.percentSign = Ni("".concat(v.percentSign)), v;
  }, [r]), f = c.length - d.percentSign.length - sO, h = function(v) {
    var b, y = a.current;
    y && (y.setSelectionRange(f, f), v && ((b = s.onFocus) === null || b === void 0 || b.call(s, v)));
  }, p = function(v) {
    var b = v.currentTarget;
    if (b.selectionStart !== null) {
      var y = b.selectionStart, x = b.selectionEnd, w = y !== x, T = f < y;
      !w && T && h();
    }
    i == null || i(v);
  }, m = function(v) {
    var b = Bl(v.target.value, d), y = Bv(b);
    u(b), v.target.value = b, v.target.setAttribute("data-number", y.toString()), o == null || o(v);
  };
  xe(function() {
    return h();
  }, [c]);
  var g = s.defaultValue ? Bl(s.defaultValue, d) : void 0;
  return F.createElement("input", Nt({}, s, { defaultValue: g, inputMode: "decimal", onChange: m, onFocus: h, onKeyUp: p, ref: a, type: "text" }));
}), di = {
  dots: /\./g,
  openParenthesis: /\(/g,
  closeParenthesis: /\)/g,
  leadingBars: /\\\\/g,
  escape: /[.*+?^${}()|[\]\\]/g
}, uO = function(e) {
  for (var t, n = e.length, r = [], o = 0; o < n; o++) {
    var i = e[o], s = ta[i];
    s === void 0 ? r.push(i.replace(di.dots, "\\.").replace(di.openParenthesis, "\\(").replace(di.closeParenthesis, "\\)")) : r.push((t = s.regex) === null || t === void 0 ? void 0 : t.source);
  }
  return r.join("").replace(di.leadingBars, "\\");
}, Ti = function(e, t, n) {
  var r = typeof e == "function", o = r ? "" : e;
  if (r && (o = e(t)), Array.isArray(o))
    return Yc(o, n);
  var i = uO(o);
  return n ? "^".concat(i, "$") : i;
}, dO = function(e) {
  return e.replace(di.escape, "\\$&");
}, Yc = function(e, t) {
  var n = e.map(function(r) {
    return typeof r == "string" ? dO(r) : r.source;
  }).join("");
  return new RegExp(t ? "^".concat(n, "$") : n).source;
}, ta = {
  A: { regex: /[a-zA-Z]/, parse: function(e) {
    return e.toLocaleUpperCase();
  } },
  H: { regex: /[a-fA-F0-9]/ },
  X: { regex: /[0-9a-zA-Z]/ },
  a: { regex: /[a-zA-Z]/, parse: function(e) {
    return e.toLocaleLowerCase();
  } },
  d: { regex: /\d/, escape: !0 },
  x: { regex: /[a-zA-Z]/ }
}, fO = /\d/, np = "(dd) 9dddd-dddd", rp = "(dd) dddd-dddd", op = "ddd.ddd.ddd-dd", ip = "dd.ddd.ddd/dddd-dd", Ms = function(e) {
  return e.replace(/\D/g, "");
}, hO = ["2", /[0-3]/, ":", /[0-5]/, /\d/], pO = [/[012]/, /\d/, ":", /[0-5]/, /[0-9]/], Gt = {
  cep: "ddddd-ddd",
  date: "dd/dd/dddd",
  cpf: op,
  isoDate: "dddd-dd-dd",
  cnpj: ip,
  telephone: rp,
  cellphone: np,
  creditCard: "dddd dddd dddd dddd",
  uuid: "HHHHHHHH-HHHH-HHHH-HHHH-HHHHHHHHHHHH",
  color: function(e) {
    return e.length > 4 ? "#HHHHHH" : "#HHH";
  },
  cpfCnpj: function(e) {
    return Ms(e).length <= 11 ? op : ip;
  },
  int: function(e) {
    return e === void 0 && (e = ""), fO.test(e.toString().slice(-1)) ? "d".repeat(Math.max(e.length, 0)) : "d".repeat(Math.max(e.length - 1, 0));
  },
  cellTelephone: function(e) {
    var t = Ms(e);
    return t.length < 11 ? rp : np;
  },
  time: function(e) {
    var t = Ms(e), n = t[0];
    return n === "2" ? hO : pO;
  }
}, Yt = function(e, t, n) {
  var r;
  return n === void 0 && (n = {}), Nt({ mask: e, inputMode: t, strict: !0, pattern: ((r = n.pattern) !== null && r !== void 0 ? r : typeof e == "function") ? void 0 : Ti(e, "", !0), infinity: n.infinity }, n);
}, zt = {
  cellTelephone: Yt(Gt.cellTelephone, "tel"),
  cellphone: Yt(Gt.cellphone, "tel"),
  cep: Yt(Gt.cep, "decimal"),
  cnpj: Yt(Gt.cnpj, "decimal"),
  color: Yt(Gt.color, "decimal", { pattern: "#[a-fA-F0-9]{3}([a-fA-F0-9]{3})?" }),
  cpf: Yt(Gt.cpf, "decimal"),
  cpfCnpj: Yt(Gt.cpfCnpj, "decimal", { transform: Ms }),
  creditCard: Yt(Gt.creditCard, "decimal", { pattern: "[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{3,4}" }),
  date: Yt(Gt.date, "decimal"),
  int: Yt(Gt.int, "decimal", { pattern: "[0-9]+" }),
  isoDate: Yt(Gt.isoDate, "decimal"),
  telephone: Yt(Gt.telephone, "tel"),
  time: Yt(Gt.time, "decimal", { pattern: "[0-9]{2}:[0-9]{2}" }),
  uuid: Yt(Gt.uuid, "decimal", { pattern: "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}" })
};
function sp(e, t, n, r) {
  var o, i;
  r === void 0 && (r = ta);
  for (var s = n(e), a = "", l = 0, c = 0; l < t.length && c < s.length; ) {
    var u = t[l], d = u instanceof RegExp ? u : r[u], f = s[c];
    if (d === void 0) {
      a += u, f === u && (c += 1), l += 1;
      continue;
    }
    var h = d instanceof RegExp ? { regex: d } : d;
    h.regex.test(f) && (a += (i = (o = h.parse) === null || o === void 0 ? void 0 : o.call(h, f)) !== null && i !== void 0 ? i : f), c += 1, l += 1;
  }
  return a;
}
var ap = function(e) {
  return e;
}, mO = function(e, t, n) {
  if (!e || !n)
    return !1;
  var r = new RegExp(Ti(e, n, t));
  return r.test(n);
};
function gO(e) {
  var t = ye(e);
  return xe(function() {
    t.current = e;
  }, [e]), t.current;
}
var yO = ut(function(e, t) {
  var n = e.infinity, r = n === void 0 ? !1 : n, o = e.strict, i = o === void 0 ? !0 : o, s = e.transform, a = e.onChange, l = e.pattern, c = e.tokens, u = e.mask, d = e.onChangeText, f = e.as, h = fd(e, ["infinity", "strict", "transform", "onChange", "pattern", "tokens", "mask", "onChangeText", "as"]), p = ye(null);
  Gr(t, function() {
    return p.current;
  });
  var m = $l(a), g = $l(d), v = $l(u), b = ye(mO(u, i, h.value || h.defaultValue)), y = f ?? "input", x = Gc(Me(""), 2), w = x[0], T = x[1], P = gO(w), I = Et(function(k, A) {
    var N, H, Y = (N = k ?? A) !== null && N !== void 0 ? N : "";
    if (u === void 0)
      return Y;
    var C = (H = Y == null ? void 0 : Y.toString()) !== null && H !== void 0 ? H : "";
    return sp(C, typeof u == "function" ? u(C) : u, s ?? ap, c ?? ta);
  }, [s, u, c]), _ = Gc(Me(function() {
    return I(h.value, h.defaultValue);
  }), 2), R = _[0], L = _[1], M = I(h.defaultValue, h.defaultValue), V = Ue(function() {
    if (l || u === void 0)
      return l;
    if (typeof u == "function") {
      var k = u(R);
      return Array.isArray(k) ? Yc(k, i) : Ti(u, R, i);
    }
    return typeof u == "string" ? Ti(u, R, i) : Yc(u, i);
  }, [l, R, i, u]);
  xe(function() {
    if (h.value !== void 0) {
      var k = I(h.value, h.defaultValue);
      L(k), p.current !== null && (p.current.value = k);
    }
  }, [h.value, u, s, h.defaultValue]);
  var E = function(k) {
    var A, N, H, Y, C, $ = k.currentTarget, X = k.target.value;
    if (v.current === void 0)
      return L(X), (A = g.current) === null || A === void 0 || A.call(g, X), (N = m.current) === null || N === void 0 || N.call(m, k), d == null ? void 0 : d(X);
    var re = new RegExp(Ti(v.current, X, i)), ee = (H = $.selectionEnd) !== null && H !== void 0 ? H : 0, G = function(z, te, B) {
      if (z.type !== "number")
        return z.setSelectionRange(te, B);
    };
    if (r && b.current && X.length >= R.length)
      return $.value = R, G($, ee - 1, ee - 1);
    var D = !1;
    X.length < P.length && (b.current = !1, D = !0), re.test(X) && (b.current = !0);
    var j = ee, W = X[j - 1], U = sp(X, typeof v.current == "function" ? v.current(X) : v.current, s ?? ap, c ?? ta);
    for ($.value = U, L(U); j < U.length && U.charAt(j - 1) !== W; )
      j += 1;
    D ? G($, ee, ee) : G($, j, j), k.target.value = U, T(U), (Y = g.current) === null || Y === void 0 || Y.call(g, U), (C = m.current) === null || C === void 0 || C.call(m, k);
  };
  return F.createElement(y, Nt({}, h, { ref: p, pattern: V, onChange: E, defaultValue: lp(h.defaultValue) ? M : void 0, value: lp(h.value) ? I(h.value, h.value) : h.value }));
}), lp = function(e) {
  return typeof e == "string";
}, zv = ut(function(e, t) {
  return rO(e.mask) ? F.createElement(iO, Nt({}, e, { mask: void 0, ref: t })) : aO(e.mask) ? F.createElement(cO, Nt({}, e, { mask: void 0, ref: t })) : F.createElement(yO, Nt({}, e, { ref: t }));
}), Zt = function(e) {
  return function(t) {
    return F.createElement(zv, Nt({}, e, t));
  };
};
Zt(zt.cellTelephone);
Zt(zt.cellphone);
Zt(zt.cep);
Zt(zt.cnpj);
Zt(zt.color);
Zt(zt.cpf);
Zt(zt.cpfCnpj);
Zt(zt.creditCard);
Zt(zt.date);
Zt(zt.int);
Zt(zt.isoDate);
Zt(zt.telephone);
Zt(zt.time);
Zt(zt.uuid);
var Wv = F.forwardRef(function(t, n) {
  var r = Ue(function() {
    if (t.mask)
      return typeof t.mask == "string" && nO(zt, t.mask) ? zt[t.mask] : { mask: t.mask };
  }, [t.mask]), o = Nt(Nt({}, t), r);
  return F.createElement(zv, Nt({}, o, { ref: n }));
}), zl = {}, Wl = { exports: {} }, Hl = {};
/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var cp;
function vO() {
  if (cp)
    return Hl;
  cp = 1;
  var e = F;
  function t(d, f) {
    return d === f && (d !== 0 || 1 / d === 1 / f) || d !== d && f !== f;
  }
  var n = typeof Object.is == "function" ? Object.is : t, r = e.useState, o = e.useEffect, i = e.useLayoutEffect, s = e.useDebugValue;
  function a(d, f) {
    var h = f(), p = r({ inst: { value: h, getSnapshot: f } }), m = p[0].inst, g = p[1];
    return i(function() {
      m.value = h, m.getSnapshot = f, l(m) && g({ inst: m });
    }, [d, h, f]), o(function() {
      return l(m) && g({ inst: m }), d(function() {
        l(m) && g({ inst: m });
      });
    }, [d]), s(h), h;
  }
  function l(d) {
    var f = d.getSnapshot;
    d = d.value;
    try {
      var h = f();
      return !n(d, h);
    } catch {
      return !0;
    }
  }
  function c(d, f) {
    return f();
  }
  var u = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? c : a;
  return Hl.useSyncExternalStore = e.useSyncExternalStore !== void 0 ? e.useSyncExternalStore : u, Hl;
}
var up = {};
/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var dp;
function bO() {
  return dp || (dp = 1, process.env.NODE_ENV !== "production" && function() {
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    var e = F, t = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function n(y) {
      {
        for (var x = arguments.length, w = new Array(x > 1 ? x - 1 : 0), T = 1; T < x; T++)
          w[T - 1] = arguments[T];
        r("error", y, w);
      }
    }
    function r(y, x, w) {
      {
        var T = t.ReactDebugCurrentFrame, P = T.getStackAddendum();
        P !== "" && (x += "%s", w = w.concat([P]));
        var I = w.map(function(_) {
          return String(_);
        });
        I.unshift("Warning: " + x), Function.prototype.apply.call(console[y], console, I);
      }
    }
    function o(y, x) {
      return y === x && (y !== 0 || 1 / y === 1 / x) || y !== y && x !== x;
    }
    var i = typeof Object.is == "function" ? Object.is : o, s = e.useState, a = e.useEffect, l = e.useLayoutEffect, c = e.useDebugValue, u = !1, d = !1;
    function f(y, x, w) {
      u || e.startTransition !== void 0 && (u = !0, n("You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."));
      var T = x();
      if (!d) {
        var P = x();
        i(T, P) || (n("The result of getSnapshot should be cached to avoid an infinite loop"), d = !0);
      }
      var I = s({
        inst: {
          value: T,
          getSnapshot: x
        }
      }), _ = I[0].inst, R = I[1];
      return l(function() {
        _.value = T, _.getSnapshot = x, h(_) && R({
          inst: _
        });
      }, [y, T, x]), a(function() {
        h(_) && R({
          inst: _
        });
        var L = function() {
          h(_) && R({
            inst: _
          });
        };
        return y(L);
      }, [y]), c(T), T;
    }
    function h(y) {
      var x = y.getSnapshot, w = y.value;
      try {
        var T = x();
        return !i(w, T);
      } catch {
        return !0;
      }
    }
    function p(y, x, w) {
      return x();
    }
    var m = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", g = !m, v = g ? p : f, b = e.useSyncExternalStore !== void 0 ? e.useSyncExternalStore : v;
    up.useSyncExternalStore = b, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  }()), up;
}
var fp;
function Hv() {
  return fp || (fp = 1, process.env.NODE_ENV === "production" ? Wl.exports = vO() : Wl.exports = bO()), Wl.exports;
}
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hp;
function wO() {
  if (hp)
    return zl;
  hp = 1;
  var e = F, t = Hv();
  function n(c, u) {
    return c === u && (c !== 0 || 1 / c === 1 / u) || c !== c && u !== u;
  }
  var r = typeof Object.is == "function" ? Object.is : n, o = t.useSyncExternalStore, i = e.useRef, s = e.useEffect, a = e.useMemo, l = e.useDebugValue;
  return zl.useSyncExternalStoreWithSelector = function(c, u, d, f, h) {
    var p = i(null);
    if (p.current === null) {
      var m = { hasValue: !1, value: null };
      p.current = m;
    } else
      m = p.current;
    p = a(function() {
      function v(T) {
        if (!b) {
          if (b = !0, y = T, T = f(T), h !== void 0 && m.hasValue) {
            var P = m.value;
            if (h(P, T))
              return x = P;
          }
          return x = T;
        }
        if (P = x, r(y, T))
          return P;
        var I = f(T);
        return h !== void 0 && h(P, I) ? P : (y = T, x = I);
      }
      var b = !1, y, x, w = d === void 0 ? null : d;
      return [function() {
        return v(u());
      }, w === null ? void 0 : function() {
        return v(w());
      }];
    }, [u, d, f, h]);
    var g = o(c, p[0], p[1]);
    return s(function() {
      m.hasValue = !0, m.value = g;
    }, [g]), l(g), g;
  }, zl;
}
var pp = {};
/**
 * @license React
 * use-sync-external-store-shim/with-selector.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var mp;
function xO() {
  return mp || (mp = 1, process.env.NODE_ENV !== "production" && function() {
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    var e = F, t = Hv();
    function n(u, d) {
      return u === d && (u !== 0 || 1 / u === 1 / d) || u !== u && d !== d;
    }
    var r = typeof Object.is == "function" ? Object.is : n, o = t.useSyncExternalStore, i = e.useRef, s = e.useEffect, a = e.useMemo, l = e.useDebugValue;
    function c(u, d, f, h, p) {
      var m = i(null), g;
      m.current === null ? (g = {
        hasValue: !1,
        value: null
      }, m.current = g) : g = m.current;
      var v = a(function() {
        var w = !1, T, P, I = function(M) {
          if (!w) {
            w = !0, T = M;
            var V = h(M);
            if (p !== void 0 && g.hasValue) {
              var E = g.value;
              if (p(E, V))
                return P = E, E;
            }
            return P = V, V;
          }
          var k = T, A = P;
          if (r(k, M))
            return A;
          var N = h(M);
          return p !== void 0 && p(A, N) ? A : (T = M, P = N, N);
        }, _ = f === void 0 ? null : f, R = function() {
          return I(d());
        }, L = _ === null ? void 0 : function() {
          return I(_());
        };
        return [R, L];
      }, [d, f, h, p]), b = v[0], y = v[1], x = o(u, b, y);
      return s(function() {
        g.hasValue = !0, g.value = x;
      }, [x]), l(x), x;
    }
    pp.useSyncExternalStoreWithSelector = c, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  }()), pp;
}
process.env.NODE_ENV === "production" ? wO() : xO();
const ao = (e) => {
  const t = ye(e ?? {});
  return xe(() => void (t.current = e), [e]), t;
}, TO = (e) => {
  const t = ye();
  return xe(() => {
    t.current = e;
  }, [e]), t.current;
}, SO = (e) => Object.entries(e), Uv = (e) => e instanceof Promise, Gv = (e, t, n, r) => t === e ? n.reduce((o, i) => i(o, t, r), e) : e.constructor.name === Object.name ? n.reduce((o, i) => i(o, t, r), { ...t, ...e }) : n.reduce((o, i) => i(o, t, r), e), EO = (e, t, n, r, o, i) => (...s) => {
  const a = performance.now(), l = t(...s), c = (u, d) => n((f) => Gv(u, f, i, d));
  return Uv(l) ? l.then((u) => {
    o.current = {
      method: e,
      props: r(),
      time: performance.now() - a
    }, c(u, o.current);
  }) : (o.current = {
    method: e,
    props: r(),
    time: performance.now() - a
  }, void c(l, o.current));
}, CO = (e, t, n, r, o, i) => (...s) => {
  o.current = { method: e, time: 0, props: r() };
  const a = t(...s), l = (c) => n((u) => Gv(c, u, i, o.current));
  return Uv(a) ? a.then((c) => l(c)) : l(a);
}, hd = (e, t, n) => {
  const [r, o] = Me(() => e), i = ao(r), s = ao((n == null ? void 0 : n.props) ?? {}), a = ao(t), l = ao((n == null ? void 0 : n.postMiddleware) ?? []), c = ao((n == null ? void 0 : n.interceptor) ?? []), u = ye(e), d = TO(r), f = ao(d), h = ye(null);
  xe(() => {
    if (h.current === null)
      return;
    const m = h.current;
    l.current.forEach((g) => {
      g(r, d, m);
    });
  }, [r, l, d]);
  const [p] = Me(() => {
    const m = () => s.current, g = a.current({
      props: m,
      state: () => i.current,
      initialState: u.current,
      previousState: () => f.current
    });
    return SO(g).reduce(
      (v, [b, y]) => ({
        ...v,
        [b]: n != null && n.debug ? EO(b, y, o, m, h, c.current) : CO(b, y, o, m, h, c.current)
      }),
      {}
    );
  });
  return [r, p, s.current];
}, PO = (e, t = 0) => {
  let n;
  return function(...o) {
    clearTimeout(n), n = setTimeout(() => e(...o), t);
  };
};
function RO(e, t) {
  return ye(PO(e, t)).current;
}
function qc(e, t, n) {
  var r, o, i, s, a;
  t == null && (t = 100);
  function l() {
    var u = Date.now() - s;
    u < t && u >= 0 ? r = setTimeout(l, t - u) : (r = null, n || (a = e.apply(i, o), i = o = null));
  }
  var c = function() {
    i = this, o = arguments, s = Date.now();
    var u = n && !r;
    return r || (r = setTimeout(l, t)), u && (a = e.apply(i, o), i = o = null), a;
  };
  return c.clear = function() {
    r && (clearTimeout(r), r = null);
  }, c.flush = function() {
    r && (a = e.apply(i, o), i = o = null, clearTimeout(r), r = null);
  }, c;
}
qc.debounce = qc;
var kO = qc;
const gp = /* @__PURE__ */ fg(kO);
function OO(e) {
  let {
    debounce: t,
    scroll: n,
    polyfill: r,
    offsetSize: o
  } = {
    debounce: 0,
    scroll: !1,
    offsetSize: !1
  };
  const i = r || (typeof window > "u" ? class {
  } : window.ResizeObserver);
  if (!i)
    throw new Error("This browser does not support ResizeObserver out of the box. See: https://github.com/react-spring/react-use-measure/#resize-observer-polyfills");
  const [s, a] = Me({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    bottom: 0,
    right: 0,
    x: 0,
    y: 0
  }), l = ye({
    element: null,
    scrollContainers: null,
    resizeObserver: null,
    lastBounds: s
  }), c = t ? typeof t == "number" ? t : t.scroll : null, u = t ? typeof t == "number" ? t : t.resize : null, d = ye(!1);
  xe(() => (d.current = !0, () => void (d.current = !1)));
  const [f, h, p] = Ue(() => {
    const b = () => {
      if (!l.current.element) return;
      const {
        left: y,
        top: x,
        width: w,
        height: T,
        bottom: P,
        right: I,
        x: _,
        y: R
      } = l.current.element.getBoundingClientRect(), L = {
        left: y,
        top: x,
        width: w,
        height: T,
        bottom: P,
        right: I,
        x: _,
        y: R
      };
      l.current.element instanceof HTMLElement && o && (L.height = l.current.element.offsetHeight, L.width = l.current.element.offsetWidth), Object.freeze(L), d.current && !DO(l.current.lastBounds, L) && a(l.current.lastBounds = L);
    };
    return [b, u ? gp(b, u) : b, c ? gp(b, c) : b];
  }, [a, o, c, u]);
  function m() {
    l.current.scrollContainers && (l.current.scrollContainers.forEach((b) => b.removeEventListener("scroll", p, !0)), l.current.scrollContainers = null), l.current.resizeObserver && (l.current.resizeObserver.disconnect(), l.current.resizeObserver = null);
  }
  function g() {
    l.current.element && (l.current.resizeObserver = new i(p), l.current.resizeObserver.observe(l.current.element), n && l.current.scrollContainers && l.current.scrollContainers.forEach((b) => b.addEventListener("scroll", p, {
      capture: !0,
      passive: !0
    })));
  }
  const v = (b) => {
    !b || b === l.current.element || (m(), l.current.element = b, l.current.scrollContainers = Yv(b), g());
  };
  return _O(p, !!n), IO(h), xe(() => {
    m(), g();
  }, [n, p, h]), xe(() => m, []), [v, s, f];
}
function IO(e) {
  xe(() => {
    const t = e;
    return window.addEventListener("resize", t), () => void window.removeEventListener("resize", t);
  }, [e]);
}
function _O(e, t) {
  xe(() => {
    if (t) {
      const n = e;
      return window.addEventListener("scroll", n, {
        capture: !0,
        passive: !0
      }), () => void window.removeEventListener("scroll", n, !0);
    }
  }, [e, t]);
}
function Yv(e) {
  const t = [];
  if (!e || e === document.body) return t;
  const {
    overflow: n,
    overflowX: r,
    overflowY: o
  } = window.getComputedStyle(e);
  return [n, r, o].some((i) => i === "auto" || i === "scroll") && t.push(e), [...t, ...Yv(e.parentElement)];
}
const AO = ["x", "y", "top", "bottom", "left", "right", "width", "height"], DO = (e, t) => AO.every((n) => e[n] === t[n]), MO = ({ children: e }) => {
  const [t, n] = OO();
  return /* @__PURE__ */ S(Qt.div, { animate: { height: n.height > 0 ? n.height : "auto" }, children: /* @__PURE__ */ S("div", { ref: t, children: e }) });
}, NO = { type: "spring", bounce: 0.1, duration: 0.3 }, yp = (e) => (t = 1) => ({ x: `${100 * e * t}%`, opacity: 0.5 }), vp = {
  middle: { x: "0%", opacity: 1 },
  enter: yp(1),
  exit: yp(-1)
}, bp = { exit: { visibility: "hidden" } }, FO = (e) => {
  const t = In(Pv(e));
  return Cv({ start: t, end: Ko(t, 41) });
}, qv = (e, t) => e.toLocaleDateString(t, { month: "long" }), LO = (e, t) => Array.from({ length: 12 }).map((n, r) => {
  const o = Pv(new Date(e).setMonth(r)), i = qv(o, t);
  return /* @__PURE__ */ S("option", { value: i, "data-index": r, children: i }, i);
}), Ul = {
  ArrowLeft: (e, t) => t === "days" ? Qk(e, 1) : Lv(e, 1),
  ArrowRight: (e, t) => t === "days" ? Ko(e, 1) : Ya(e, 1),
  ArrowUp: (e, t) => t === "days" ? Jk(e, 1) : eO(e, 1),
  ArrowDown: (e, t) => t === "days" ? Sv(e, 1) : Ev(e, 1)
}, wp = (e, t = 0) => {
  const n = e.toISOString(), r = () => {
    const o = document.querySelector(`button[data-date="${n}"]`);
    if (o) return o.focus({ preventScroll: !1 });
  };
  t === 0 && r(), setTimeout(r, t);
}, Or = (e) => e.getFullYear().toString().padStart(4, "0"), VO = ({ locale: e, disabledDate: t, markToday: n = !0, autoFocusToday: r = !0, date: o, onChange: i }) => {
  const s = o || /* @__PURE__ */ new Date(), [a, l] = hd(
    {
      date: s,
      isAnimating: !1,
      year: Or(s),
      direction: void 0,
      months: LO(s, e),
      week: Cv({ start: In(s), end: sR(s) })
    },
    (p) => ({
      onChangeYear: (m) => ({ year: m }),
      setToday: () => ({ date: Mo(/* @__PURE__ */ new Date()) }),
      onExitComplete: () => (wp(p.state().date, 200), { isAnimating: !1 }),
      date: (m) => {
        const g = m(p.state().date);
        return { date: g, year: Or(g) };
      },
      nextMonth: () => {
        const m = p.state();
        if (m.isAnimating) return m;
        const g = Ya(m.date, 1);
        return { date: g, isAnimating: !0, direction: 1, year: Or(g) };
      },
      previousMonth: () => {
        const m = p.state();
        if (m.isAnimating) return m;
        const g = Lv(m.date, 1);
        return { date: g, isAnimating: !0, direction: -1, year: Or(g) };
      },
      onSelectDate: (m) => {
        const g = m.currentTarget.dataset.date || "", v = new Date(g);
        return { date: v, year: Or(v) };
      },
      onChangeMonth: (m) => {
        const g = m.target.value, b = Array.from(m.target.options).find((y) => y.value === g);
        if (b) {
          const y = b.dataset.index || "", x = new Date(p.state().date);
          return x.setMonth(+y), { date: x, year: Or(x) };
        }
        return p.state();
      },
      onKeyDown: (m) => {
        const g = m.key;
        if (g in Ul) {
          (g === "ArrowUp" || g === "ArrowDown") && m.preventDefault();
          const v = p.state().date, b = Bn.keyof(Ul, g) ? Ul[g](v, m.shiftKey ? "month" : "days") : null;
          if (b !== null)
            return wp(b), { date: b, year: Or(b) };
        }
        return p.state();
      }
    })
  ), c = FO(a.date), u = a.date.toISOString(), d = qv(a.date, e);
  xe(() => i == null ? void 0 : i(a.date), [u]);
  const f = RO((p) => {
    l.date((m) => {
      const g = new Date(m);
      return g.setFullYear(+p), g;
    });
  }, 700), h = (p) => {
    const m = p.currentTarget.value;
    l.onChangeYear(m), f(m);
  };
  return /* @__PURE__ */ S(lP, { transition: NO, children: /* @__PURE__ */ Z("div", { className: "relative overflow-hidden", children: [
    /* @__PURE__ */ S("div", { className: "flex flex-col justify-center rounded text-center", children: /* @__PURE__ */ S(MO, { children: /* @__PURE__ */ S(
      Ua,
      {
        presenceAffectsLayout: !0,
        mode: "popLayout",
        initial: !1,
        custom: a.direction,
        onExitComplete: l.onExitComplete,
        children: /* @__PURE__ */ Z(Qt.div, { initial: "enter", animate: "middle", exit: "exit", children: [
          /* @__PURE__ */ Z("header", { className: "relative flex justify-between", children: [
            /* @__PURE__ */ S(
              Qt.button,
              {
                onClick: l.previousMonth,
                variants: bp,
                className: "z-calendar rounded-full p-1.5 hover:bg-primary",
                children: /* @__PURE__ */ S(MP, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ S(
              Qt.span,
              {
                variants: vp,
                custom: a.direction,
                className: "absolute z-normal isolate inset-0 flex items-center justify-center font-semibold",
                children: /* @__PURE__ */ Z("span", { className: "w-fit flex items-center justify-center gap-0.5 py-1", children: [
                  /* @__PURE__ */ S(
                    "select",
                    {
                      style: { width: `${d.length}ch` },
                      value: d,
                      onChange: l.onChangeMonth,
                      className: "appearance-none capitalize bg-transparent proportional-nums hover:text-primary cursor-pointer w-fit",
                      children: a.months
                    }
                  ),
                  /* @__PURE__ */ S(
                    Wv,
                    {
                      mask: "int",
                      value: a.year,
                      maxLength: 4,
                      placeholder: "YYYY",
                      onChange: h,
                      style: { width: `${a.year.length}ch` },
                      className: "w-16 bg-transparent appearance-none hover:text-primary cursor-pointer"
                    }
                  )
                ] })
              }
            ),
            /* @__PURE__ */ S(
              Qt.button,
              {
                variants: bp,
                className: "z-calendar rounded-full p-1.5 hover:bg-primary",
                onClick: l.nextMonth,
                children: /* @__PURE__ */ S(ad, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ S(
              "div",
              {
                className: "absolute inset-0",
                style: {
                  backgroundImage: "linear-gradient(to right, hsla(var(--card-background)) 15%, transparent 30%, transparent 70%, hsla(var(--card-background)) 85%)"
                }
              }
            )
          ] }),
          /* @__PURE__ */ S("div", { className: "mt-4 grid grid-cols-7 gap-y-4", children: a.week.map((p) => /* @__PURE__ */ S("span", { className: "font-medium capitalize text-sm", children: p.toLocaleDateString(e, { weekday: "short" }) }, p.toString())) }),
          /* @__PURE__ */ S(
            Qt.ul,
            {
              onKeyDown: l.onKeyDown,
              variants: vp,
              custom: a.direction,
              className: "mt-4 pb-2 grid grid-cols-7 gap-y-4",
              children: c.map((p) => {
                const m = p.toISOString(), g = m === u, v = Xk(p) && n, b = (t == null ? void 0 : t(p)) || !1, y = !Zk(p, a.date) || b;
                return /* @__PURE__ */ S("li", { className: "w-full flex items-center justify-center", children: /* @__PURE__ */ S(
                  "button",
                  {
                    type: "button",
                    "data-date": m,
                    disabled: b,
                    onClick: l.onSelectDate,
                    "data-view": a.date.getMonth().toString(),
                    className: `size-8 disabled:cursor-not-allowed rounded-full font-semibold flex items-center justify-center proportional-nums ${v ? "text-primary" : ""} ${y ? "text-disabled" : ""} ${g ? "bg-primary text-primary-foreground" : ""}`,
                    children: p.getDate()
                  }
                ) }, m);
              })
            }
          )
        ] }, d)
      }
    ) }) }),
    /* @__PURE__ */ S("footer", { className: "text-center text-primary mt-2", children: /* @__PURE__ */ S("button", { className: "hover:scale-105 transition-transform duration-300", type: "button", onClick: l.setToday, children: "Today" }) })
  ] }) });
}, $O = ({ children: e, title: t, as: n = "div", container: r = "", header: o = null, className: i = "", ...s }) => /* @__PURE__ */ Z(
  Xi,
  {
    ...s,
    as: n,
    className: bt("flex flex-col gap-4 rounded-card border border-card-border bg-card-background py-4 pb-8 shadow", r),
    children: [
      t ? /* @__PURE__ */ S("header", { className: "mb-2 w-full border-b border-card-border px-8 pb-4 text-xl font-medium", children: t }) : o,
      /* @__PURE__ */ S("div", { className: bt("min-w-full px-8", i), children: e })
    ]
  }
), fL = (e) => /* @__PURE__ */ Z("div", { className: "divide-y divide-card-border bg-card-background shadow border border-card-border rounded-card", children: [
  /* @__PURE__ */ Z("header", { className: "p-6 items-start flex gap-4", children: [
    /* @__PURE__ */ S("div", { className: bt("size-10 p-8 rounded-card flex items-center justify-center aspect-square bg-primary", e.iconContainer), children: /* @__PURE__ */ S("div", { children: /* @__PURE__ */ S(e.Icon, { className: "size-10 aspect-square text-primary-foreground" }) }) }),
    /* @__PURE__ */ Z("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ S("header", { children: /* @__PURE__ */ S("h3", { className: "text-base leading-none", children: e.title }) }),
      /* @__PURE__ */ S("p", { className: "text-4xl font-semibold", children: e.children })
    ] })
  ] }),
  e.footer ? /* @__PURE__ */ S("footer", { className: "px-6 py-2", children: e.footer }) : null
] }), jO = (e, t) => {
  const [n, r] = Me(() => t || e);
  return xe(() => {
    r(e);
  }, [e]), [n, r];
}, pd = {
  inputCaretDown: "Click to see all options",
  datePickerCalendarButtonLabel: "Click to open a date picker",
  inputOptionalLabel: "Optional",
  tableSortAsc: "Ascending",
  tableSortOrderByLabel: "Order by",
  tableSortOrderInputPlaceholder: "Order by",
  tableSortOrderInputTitle: "Order by",
  tableSortTypeInputPlaceholder: "Ascending",
  tableSortTypeInputTitle: "Sort type",
  tableSortAddButton: "Add sort",
  tableSortDropdownTitle: "Order by",
  tableSortDesc: "Descending",
  tableFilterTypeContains: "Contains",
  tableFilterTypeIs: "Is",
  tableFilterTypeIsNot: "Is not",
  tableFilterTypeNotContains: "Not contains",
  tableFilterTypeLessThan: "Less than",
  tableFilterTypeGreaterThan: "Greater than",
  tableFilterTypeStartsWith: "Starts with",
  tableFilterTypeEndsWith: "Ends with",
  tableFilterNewFilter: "New filter",
  tableFilterColumnTitle: "Filter by",
  tableFilterColumnPlaceholder: "Filter by",
  tableFilterOperatorTitle: "Operation",
  tableFilterOperatorPlaceholder: "Equals to...",
  tableFilterValueTitle: "Value",
  tableFilterValuePlaceholder: "Something...",
  tableFilterLabel: "Filters",
  tableFilterDropdownTitle: "Filters",
  tableFilterDropdownTitleUnique: "Filter by",
  tablePaginationPrevious: "Previous",
  tablePaginationNext: "Next",
  tablePaginationSelectLabel: "Select the size of page",
  tablePaginationFooter: (e) => /* @__PURE__ */ Z(it, { children: [
    e.current,
    " to ",
    e.pages,
    " of ",
    e.totalItems,
    " items.",
    Array.isArray(e.sizes) ? e.select : null,
    " per page."
  ] })
}, Kv = gn({ translations: pd }), hL = (e) => {
  const t = Ue(() => ({ translations: { ...pd, ...e.map } }), [e.map]);
  return /* @__PURE__ */ S(Kv.Provider, { value: t, children: e.children });
}, yn = () => {
  const e = Qe(Kv);
  return e ? e.translations : pd;
};
function xr(e) {
  return Zv(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function qt(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function Xn(e) {
  var t;
  return (t = (Zv(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function Zv(e) {
  return e instanceof Node || e instanceof qt(e).Node;
}
function We(e) {
  return e instanceof Element || e instanceof qt(e).Element;
}
function gt(e) {
  return e instanceof HTMLElement || e instanceof qt(e).HTMLElement;
}
function Kc(e) {
  return typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof qt(e).ShadowRoot;
}
function ns(e) {
  const {
    overflow: t,
    overflowX: n,
    overflowY: r,
    display: o
  } = rn(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && !["inline", "contents"].includes(o);
}
function BO(e) {
  return ["table", "td", "th"].includes(xr(e));
}
function qa(e) {
  return [":popover-open", ":modal"].some((t) => {
    try {
      return e.matches(t);
    } catch {
      return !1;
    }
  });
}
function md(e) {
  const t = gd(), n = We(e) ? rn(e) : e;
  return n.transform !== "none" || n.perspective !== "none" || (n.containerType ? n.containerType !== "normal" : !1) || !t && (n.backdropFilter ? n.backdropFilter !== "none" : !1) || !t && (n.filter ? n.filter !== "none" : !1) || ["transform", "perspective", "filter"].some((r) => (n.willChange || "").includes(r)) || ["paint", "layout", "strict", "content"].some((r) => (n.contain || "").includes(r));
}
function zO(e) {
  let t = qn(e);
  for (; gt(t) && !fr(t); ) {
    if (md(t))
      return t;
    if (qa(t))
      return null;
    t = qn(t);
  }
  return null;
}
function gd() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function fr(e) {
  return ["html", "body", "#document"].includes(xr(e));
}
function rn(e) {
  return qt(e).getComputedStyle(e);
}
function Ka(e) {
  return We(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.scrollX,
    scrollTop: e.scrollY
  };
}
function qn(e) {
  if (xr(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    Kc(e) && e.host || // Fallback.
    Xn(e)
  );
  return Kc(t) ? t.host : t;
}
function Xv(e) {
  const t = qn(e);
  return fr(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : gt(t) && ns(t) ? t : Xv(t);
}
function lr(e, t, n) {
  var r;
  t === void 0 && (t = []), n === void 0 && (n = !0);
  const o = Xv(e), i = o === ((r = e.ownerDocument) == null ? void 0 : r.body), s = qt(o);
  if (i) {
    const a = Zc(s);
    return t.concat(s, s.visualViewport || [], ns(o) ? o : [], a && n ? lr(a) : []);
  }
  return t.concat(o, lr(o, [], n));
}
function Zc(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function cn(e) {
  let t = e.activeElement;
  for (; ((n = t) == null || (n = n.shadowRoot) == null ? void 0 : n.activeElement) != null; ) {
    var n;
    t = t.shadowRoot.activeElement;
  }
  return t;
}
function mt(e, t) {
  if (!e || !t)
    return !1;
  const n = t.getRootNode == null ? void 0 : t.getRootNode();
  if (e.contains(t))
    return !0;
  if (n && Kc(n)) {
    let r = t;
    for (; r; ) {
      if (e === r)
        return !0;
      r = r.parentNode || r.host;
    }
  }
  return !1;
}
function yd() {
  const e = navigator.userAgentData;
  return e != null && e.platform ? e.platform : navigator.platform;
}
function Qv() {
  const e = navigator.userAgentData;
  return e && Array.isArray(e.brands) ? e.brands.map((t) => {
    let {
      brand: n,
      version: r
    } = t;
    return n + "/" + r;
  }).join(" ") : navigator.userAgent;
}
function Jv(e) {
  return e.mozInputSource === 0 && e.isTrusted ? !0 : Xc() && e.pointerType ? e.type === "click" && e.buttons === 1 : e.detail === 0 && !e.pointerType;
}
function vd(e) {
  return WO() ? !1 : !Xc() && e.width === 0 && e.height === 0 || Xc() && e.width === 1 && e.height === 1 && e.pressure === 0 && e.detail === 0 && e.pointerType === "mouse" || // iOS VoiceOver returns 0.333• for width/height.
  e.width < 1 && e.height < 1 && e.pressure === 0 && e.detail === 0 && e.pointerType === "touch";
}
function bd() {
  return /apple/i.test(navigator.vendor);
}
function Xc() {
  const e = /android/i;
  return e.test(yd()) || e.test(Qv());
}
function eb() {
  return yd().toLowerCase().startsWith("mac") && !navigator.maxTouchPoints;
}
function WO() {
  return Qv().includes("jsdom/");
}
function Fi(e, t) {
  const n = ["mouse", "pen"];
  return t || n.push("", void 0), n.includes(e);
}
function HO(e) {
  return "nativeEvent" in e;
}
function UO(e) {
  return e.matches("html,body");
}
function Pt(e) {
  return (e == null ? void 0 : e.ownerDocument) || document;
}
function Gl(e, t) {
  if (t == null)
    return !1;
  if ("composedPath" in e)
    return e.composedPath().includes(t);
  const n = e;
  return n.target != null && t.contains(n.target);
}
function Vn(e) {
  return "composedPath" in e ? e.composedPath()[0] : e.target;
}
const GO = "input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])";
function wd(e) {
  return gt(e) && e.matches(GO);
}
function It(e) {
  e.preventDefault(), e.stopPropagation();
}
function tb(e) {
  return e ? e.getAttribute("role") === "combobox" && wd(e) : !1;
}
const Pn = Math.min, Xt = Math.max, na = Math.round, yo = Math.floor, hr = (e) => ({
  x: e,
  y: e
}), YO = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, qO = {
  start: "end",
  end: "start"
};
function Qc(e, t, n) {
  return Xt(e, Pn(t, n));
}
function Zo(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function pr(e) {
  return e.split("-")[0];
}
function Xo(e) {
  return e.split("-")[1];
}
function nb(e) {
  return e === "x" ? "y" : "x";
}
function xd(e) {
  return e === "y" ? "height" : "width";
}
function Yr(e) {
  return ["top", "bottom"].includes(pr(e)) ? "y" : "x";
}
function Td(e) {
  return nb(Yr(e));
}
function KO(e, t, n) {
  n === void 0 && (n = !1);
  const r = Xo(e), o = Td(e), i = xd(o);
  let s = o === "x" ? r === (n ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
  return t.reference[i] > t.floating[i] && (s = ra(s)), [s, ra(s)];
}
function ZO(e) {
  const t = ra(e);
  return [Jc(e), t, Jc(t)];
}
function Jc(e) {
  return e.replace(/start|end/g, (t) => qO[t]);
}
function XO(e, t, n) {
  const r = ["left", "right"], o = ["right", "left"], i = ["top", "bottom"], s = ["bottom", "top"];
  switch (e) {
    case "top":
    case "bottom":
      return n ? t ? o : r : t ? r : o;
    case "left":
    case "right":
      return t ? i : s;
    default:
      return [];
  }
}
function QO(e, t, n, r) {
  const o = Xo(e);
  let i = XO(pr(e), n === "start", r);
  return o && (i = i.map((s) => s + "-" + o), t && (i = i.concat(i.map(Jc)))), i;
}
function ra(e) {
  return e.replace(/left|right|bottom|top/g, (t) => YO[t]);
}
function JO(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function rb(e) {
  return typeof e != "number" ? JO(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function oa(e) {
  const {
    x: t,
    y: n,
    width: r,
    height: o
  } = e;
  return {
    width: r,
    height: o,
    top: n,
    left: t,
    right: t + r,
    bottom: n + o,
    x: t,
    y: n
  };
}
/*!
* tabbable 6.2.0
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/
var eI = ["input:not([inert])", "select:not([inert])", "textarea:not([inert])", "a[href]:not([inert])", "button:not([inert])", "[tabindex]:not(slot):not([inert])", "audio[controls]:not([inert])", "video[controls]:not([inert])", '[contenteditable]:not([contenteditable="false"]):not([inert])', "details>summary:first-of-type:not([inert])", "details:not([inert])"], ia = /* @__PURE__ */ eI.join(","), ob = typeof Element > "u", No = ob ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, sa = !ob && Element.prototype.getRootNode ? function(e) {
  var t;
  return e == null || (t = e.getRootNode) === null || t === void 0 ? void 0 : t.call(e);
} : function(e) {
  return e == null ? void 0 : e.ownerDocument;
}, aa = function e(t, n) {
  var r;
  n === void 0 && (n = !0);
  var o = t == null || (r = t.getAttribute) === null || r === void 0 ? void 0 : r.call(t, "inert"), i = o === "" || o === "true", s = i || n && t && e(t.parentNode);
  return s;
}, tI = function(t) {
  var n, r = t == null || (n = t.getAttribute) === null || n === void 0 ? void 0 : n.call(t, "contenteditable");
  return r === "" || r === "true";
}, nI = function(t, n, r) {
  if (aa(t))
    return [];
  var o = Array.prototype.slice.apply(t.querySelectorAll(ia));
  return n && No.call(t, ia) && o.unshift(t), o = o.filter(r), o;
}, rI = function e(t, n, r) {
  for (var o = [], i = Array.from(t); i.length; ) {
    var s = i.shift();
    if (!aa(s, !1))
      if (s.tagName === "SLOT") {
        var a = s.assignedElements(), l = a.length ? a : s.children, c = e(l, !0, r);
        r.flatten ? o.push.apply(o, c) : o.push({
          scopeParent: s,
          candidates: c
        });
      } else {
        var u = No.call(s, ia);
        u && r.filter(s) && (n || !t.includes(s)) && o.push(s);
        var d = s.shadowRoot || // check for an undisclosed shadow
        typeof r.getShadowRoot == "function" && r.getShadowRoot(s), f = !aa(d, !1) && (!r.shadowRootFilter || r.shadowRootFilter(s));
        if (d && f) {
          var h = e(d === !0 ? s.children : d.children, !0, r);
          r.flatten ? o.push.apply(o, h) : o.push({
            scopeParent: s,
            candidates: h
          });
        } else
          i.unshift.apply(i, s.children);
      }
  }
  return o;
}, ib = function(t) {
  return !isNaN(parseInt(t.getAttribute("tabindex"), 10));
}, sb = function(t) {
  if (!t)
    throw new Error("No node provided");
  return t.tabIndex < 0 && (/^(AUDIO|VIDEO|DETAILS)$/.test(t.tagName) || tI(t)) && !ib(t) ? 0 : t.tabIndex;
}, oI = function(t, n) {
  var r = sb(t);
  return r < 0 && n && !ib(t) ? 0 : r;
}, iI = function(t, n) {
  return t.tabIndex === n.tabIndex ? t.documentOrder - n.documentOrder : t.tabIndex - n.tabIndex;
}, ab = function(t) {
  return t.tagName === "INPUT";
}, sI = function(t) {
  return ab(t) && t.type === "hidden";
}, aI = function(t) {
  var n = t.tagName === "DETAILS" && Array.prototype.slice.apply(t.children).some(function(r) {
    return r.tagName === "SUMMARY";
  });
  return n;
}, lI = function(t, n) {
  for (var r = 0; r < t.length; r++)
    if (t[r].checked && t[r].form === n)
      return t[r];
}, cI = function(t) {
  if (!t.name)
    return !0;
  var n = t.form || sa(t), r = function(a) {
    return n.querySelectorAll('input[type="radio"][name="' + a + '"]');
  }, o;
  if (typeof window < "u" && typeof window.CSS < "u" && typeof window.CSS.escape == "function")
    o = r(window.CSS.escape(t.name));
  else
    try {
      o = r(t.name);
    } catch (s) {
      return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", s.message), !1;
    }
  var i = lI(o, t.form);
  return !i || i === t;
}, uI = function(t) {
  return ab(t) && t.type === "radio";
}, dI = function(t) {
  return uI(t) && !cI(t);
}, fI = function(t) {
  var n, r = t && sa(t), o = (n = r) === null || n === void 0 ? void 0 : n.host, i = !1;
  if (r && r !== t) {
    var s, a, l;
    for (i = !!((s = o) !== null && s !== void 0 && (a = s.ownerDocument) !== null && a !== void 0 && a.contains(o) || t != null && (l = t.ownerDocument) !== null && l !== void 0 && l.contains(t)); !i && o; ) {
      var c, u, d;
      r = sa(o), o = (c = r) === null || c === void 0 ? void 0 : c.host, i = !!((u = o) !== null && u !== void 0 && (d = u.ownerDocument) !== null && d !== void 0 && d.contains(o));
    }
  }
  return i;
}, xp = function(t) {
  var n = t.getBoundingClientRect(), r = n.width, o = n.height;
  return r === 0 && o === 0;
}, hI = function(t, n) {
  var r = n.displayCheck, o = n.getShadowRoot;
  if (getComputedStyle(t).visibility === "hidden")
    return !0;
  var i = No.call(t, "details>summary:first-of-type"), s = i ? t.parentElement : t;
  if (No.call(s, "details:not([open]) *"))
    return !0;
  if (!r || r === "full" || r === "legacy-full") {
    if (typeof o == "function") {
      for (var a = t; t; ) {
        var l = t.parentElement, c = sa(t);
        if (l && !l.shadowRoot && o(l) === !0)
          return xp(t);
        t.assignedSlot ? t = t.assignedSlot : !l && c !== t.ownerDocument ? t = c.host : t = l;
      }
      t = a;
    }
    if (fI(t))
      return !t.getClientRects().length;
    if (r !== "legacy-full")
      return !0;
  } else if (r === "non-zero-area")
    return xp(t);
  return !1;
}, pI = function(t) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(t.tagName))
    for (var n = t.parentElement; n; ) {
      if (n.tagName === "FIELDSET" && n.disabled) {
        for (var r = 0; r < n.children.length; r++) {
          var o = n.children.item(r);
          if (o.tagName === "LEGEND")
            return No.call(n, "fieldset[disabled] *") ? !0 : !o.contains(t);
        }
        return !0;
      }
      n = n.parentElement;
    }
  return !1;
}, mI = function(t, n) {
  return !(n.disabled || // we must do an inert look up to filter out any elements inside an inert ancestor
  //  because we're limited in the type of selectors we can use in JSDom (see related
  //  note related to `candidateSelectors`)
  aa(n) || sI(n) || hI(n, t) || // For a details element with a summary, the summary element gets the focus
  aI(n) || pI(n));
}, eu = function(t, n) {
  return !(dI(n) || sb(n) < 0 || !mI(t, n));
}, gI = function(t) {
  var n = parseInt(t.getAttribute("tabindex"), 10);
  return !!(isNaN(n) || n >= 0);
}, yI = function e(t) {
  var n = [], r = [];
  return t.forEach(function(o, i) {
    var s = !!o.scopeParent, a = s ? o.scopeParent : o, l = oI(a, s), c = s ? e(o.candidates) : a;
    l === 0 ? s ? n.push.apply(n, c) : n.push(a) : r.push({
      documentOrder: i,
      tabIndex: l,
      item: o,
      isScope: s,
      content: c
    });
  }), r.sort(iI).reduce(function(o, i) {
    return i.isScope ? o.push.apply(o, i.content) : o.push(i.content), o;
  }, []).concat(n);
}, Li = function(t, n) {
  n = n || {};
  var r;
  return n.getShadowRoot ? r = rI([t], n.includeContainer, {
    filter: eu.bind(null, n),
    flatten: !1,
    getShadowRoot: n.getShadowRoot,
    shadowRootFilter: gI
  }) : r = nI(t, n.includeContainer, eu.bind(null, n)), yI(r);
}, vI = function(t, n) {
  if (n = n || {}, !t)
    throw new Error("No node provided");
  return No.call(t, ia) === !1 ? !1 : eu(n, t);
};
function Tp(e, t, n) {
  let {
    reference: r,
    floating: o
  } = e;
  const i = Yr(t), s = Td(t), a = xd(s), l = pr(t), c = i === "y", u = r.x + r.width / 2 - o.width / 2, d = r.y + r.height / 2 - o.height / 2, f = r[a] / 2 - o[a] / 2;
  let h;
  switch (l) {
    case "top":
      h = {
        x: u,
        y: r.y - o.height
      };
      break;
    case "bottom":
      h = {
        x: u,
        y: r.y + r.height
      };
      break;
    case "right":
      h = {
        x: r.x + r.width,
        y: d
      };
      break;
    case "left":
      h = {
        x: r.x - o.width,
        y: d
      };
      break;
    default:
      h = {
        x: r.x,
        y: r.y
      };
  }
  switch (Xo(t)) {
    case "start":
      h[s] -= f * (n && c ? -1 : 1);
      break;
    case "end":
      h[s] += f * (n && c ? -1 : 1);
      break;
  }
  return h;
}
const bI = async (e, t, n) => {
  const {
    placement: r = "bottom",
    strategy: o = "absolute",
    middleware: i = [],
    platform: s
  } = n, a = i.filter(Boolean), l = await (s.isRTL == null ? void 0 : s.isRTL(t));
  let c = await s.getElementRects({
    reference: e,
    floating: t,
    strategy: o
  }), {
    x: u,
    y: d
  } = Tp(c, r, l), f = r, h = {}, p = 0;
  for (let m = 0; m < a.length; m++) {
    const {
      name: g,
      fn: v
    } = a[m], {
      x: b,
      y,
      data: x,
      reset: w
    } = await v({
      x: u,
      y: d,
      initialPlacement: r,
      placement: f,
      strategy: o,
      middlewareData: h,
      rects: c,
      platform: s,
      elements: {
        reference: e,
        floating: t
      }
    });
    u = b ?? u, d = y ?? d, h = {
      ...h,
      [g]: {
        ...h[g],
        ...x
      }
    }, w && p <= 50 && (p++, typeof w == "object" && (w.placement && (f = w.placement), w.rects && (c = w.rects === !0 ? await s.getElementRects({
      reference: e,
      floating: t,
      strategy: o
    }) : w.rects), {
      x: u,
      y: d
    } = Tp(c, f, l)), m = -1);
  }
  return {
    x: u,
    y: d,
    placement: f,
    strategy: o,
    middlewareData: h
  };
};
async function Sd(e, t) {
  var n;
  t === void 0 && (t = {});
  const {
    x: r,
    y: o,
    platform: i,
    rects: s,
    elements: a,
    strategy: l
  } = e, {
    boundary: c = "clippingAncestors",
    rootBoundary: u = "viewport",
    elementContext: d = "floating",
    altBoundary: f = !1,
    padding: h = 0
  } = Zo(t, e), p = rb(h), g = a[f ? d === "floating" ? "reference" : "floating" : d], v = oa(await i.getClippingRect({
    element: (n = await (i.isElement == null ? void 0 : i.isElement(g))) == null || n ? g : g.contextElement || await (i.getDocumentElement == null ? void 0 : i.getDocumentElement(a.floating)),
    boundary: c,
    rootBoundary: u,
    strategy: l
  })), b = d === "floating" ? {
    x: r,
    y: o,
    width: s.floating.width,
    height: s.floating.height
  } : s.reference, y = await (i.getOffsetParent == null ? void 0 : i.getOffsetParent(a.floating)), x = await (i.isElement == null ? void 0 : i.isElement(y)) ? await (i.getScale == null ? void 0 : i.getScale(y)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, w = oa(i.convertOffsetParentRelativeRectToViewportRelativeRect ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: b,
    offsetParent: y,
    strategy: l
  }) : b);
  return {
    top: (v.top - w.top + p.top) / x.y,
    bottom: (w.bottom - v.bottom + p.bottom) / x.y,
    left: (v.left - w.left + p.left) / x.x,
    right: (w.right - v.right + p.right) / x.x
  };
}
const wI = (e) => ({
  name: "arrow",
  options: e,
  async fn(t) {
    const {
      x: n,
      y: r,
      placement: o,
      rects: i,
      platform: s,
      elements: a,
      middlewareData: l
    } = t, {
      element: c,
      padding: u = 0
    } = Zo(e, t) || {};
    if (c == null)
      return {};
    const d = rb(u), f = {
      x: n,
      y: r
    }, h = Td(o), p = xd(h), m = await s.getDimensions(c), g = h === "y", v = g ? "top" : "left", b = g ? "bottom" : "right", y = g ? "clientHeight" : "clientWidth", x = i.reference[p] + i.reference[h] - f[h] - i.floating[p], w = f[h] - i.reference[h], T = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(c));
    let P = T ? T[y] : 0;
    (!P || !await (s.isElement == null ? void 0 : s.isElement(T))) && (P = a.floating[y] || i.floating[p]);
    const I = x / 2 - w / 2, _ = P / 2 - m[p] / 2 - 1, R = Pn(d[v], _), L = Pn(d[b], _), M = R, V = P - m[p] - L, E = P / 2 - m[p] / 2 + I, k = Qc(M, E, V), A = !l.arrow && Xo(o) != null && E !== k && i.reference[p] / 2 - (E < M ? R : L) - m[p] / 2 < 0, N = A ? E < M ? E - M : E - V : 0;
    return {
      [h]: f[h] + N,
      data: {
        [h]: k,
        centerOffset: E - k - N,
        ...A && {
          alignmentOffset: N
        }
      },
      reset: A
    };
  }
}), xI = function(e) {
  return e === void 0 && (e = {}), {
    name: "flip",
    options: e,
    async fn(t) {
      var n, r;
      const {
        placement: o,
        middlewareData: i,
        rects: s,
        initialPlacement: a,
        platform: l,
        elements: c
      } = t, {
        mainAxis: u = !0,
        crossAxis: d = !0,
        fallbackPlacements: f,
        fallbackStrategy: h = "bestFit",
        fallbackAxisSideDirection: p = "none",
        flipAlignment: m = !0,
        ...g
      } = Zo(e, t);
      if ((n = i.arrow) != null && n.alignmentOffset)
        return {};
      const v = pr(o), b = Yr(a), y = pr(a) === a, x = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), w = f || (y || !m ? [ra(a)] : ZO(a)), T = p !== "none";
      !f && T && w.push(...QO(a, m, p, x));
      const P = [a, ...w], I = await Sd(t, g), _ = [];
      let R = ((r = i.flip) == null ? void 0 : r.overflows) || [];
      if (u && _.push(I[v]), d) {
        const E = KO(o, s, x);
        _.push(I[E[0]], I[E[1]]);
      }
      if (R = [...R, {
        placement: o,
        overflows: _
      }], !_.every((E) => E <= 0)) {
        var L, M;
        const E = (((L = i.flip) == null ? void 0 : L.index) || 0) + 1, k = P[E];
        if (k)
          return {
            data: {
              index: E,
              overflows: R
            },
            reset: {
              placement: k
            }
          };
        let A = (M = R.filter((N) => N.overflows[0] <= 0).sort((N, H) => N.overflows[1] - H.overflows[1])[0]) == null ? void 0 : M.placement;
        if (!A)
          switch (h) {
            case "bestFit": {
              var V;
              const N = (V = R.filter((H) => {
                if (T) {
                  const Y = Yr(H.placement);
                  return Y === b || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  Y === "y";
                }
                return !0;
              }).map((H) => [H.placement, H.overflows.filter((Y) => Y > 0).reduce((Y, C) => Y + C, 0)]).sort((H, Y) => H[1] - Y[1])[0]) == null ? void 0 : V[0];
              N && (A = N);
              break;
            }
            case "initialPlacement":
              A = a;
              break;
          }
        if (o !== A)
          return {
            reset: {
              placement: A
            }
          };
      }
      return {};
    }
  };
};
async function TI(e, t) {
  const {
    placement: n,
    platform: r,
    elements: o
  } = e, i = await (r.isRTL == null ? void 0 : r.isRTL(o.floating)), s = pr(n), a = Xo(n), l = Yr(n) === "y", c = ["left", "top"].includes(s) ? -1 : 1, u = i && l ? -1 : 1, d = Zo(t, e);
  let {
    mainAxis: f,
    crossAxis: h,
    alignmentAxis: p
  } = typeof d == "number" ? {
    mainAxis: d,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: 0,
    crossAxis: 0,
    alignmentAxis: null,
    ...d
  };
  return a && typeof p == "number" && (h = a === "end" ? p * -1 : p), l ? {
    x: h * u,
    y: f * c
  } : {
    x: f * c,
    y: h * u
  };
}
const SI = function(e) {
  return e === void 0 && (e = 0), {
    name: "offset",
    options: e,
    async fn(t) {
      var n, r;
      const {
        x: o,
        y: i,
        placement: s,
        middlewareData: a
      } = t, l = await TI(t, e);
      return s === ((n = a.offset) == null ? void 0 : n.placement) && (r = a.arrow) != null && r.alignmentOffset ? {} : {
        x: o + l.x,
        y: i + l.y,
        data: {
          ...l,
          placement: s
        }
      };
    }
  };
}, EI = function(e) {
  return e === void 0 && (e = {}), {
    name: "shift",
    options: e,
    async fn(t) {
      const {
        x: n,
        y: r,
        placement: o
      } = t, {
        mainAxis: i = !0,
        crossAxis: s = !1,
        limiter: a = {
          fn: (g) => {
            let {
              x: v,
              y: b
            } = g;
            return {
              x: v,
              y: b
            };
          }
        },
        ...l
      } = Zo(e, t), c = {
        x: n,
        y: r
      }, u = await Sd(t, l), d = Yr(pr(o)), f = nb(d);
      let h = c[f], p = c[d];
      if (i) {
        const g = f === "y" ? "top" : "left", v = f === "y" ? "bottom" : "right", b = h + u[g], y = h - u[v];
        h = Qc(b, h, y);
      }
      if (s) {
        const g = d === "y" ? "top" : "left", v = d === "y" ? "bottom" : "right", b = p + u[g], y = p - u[v];
        p = Qc(b, p, y);
      }
      const m = a.fn({
        ...t,
        [f]: h,
        [d]: p
      });
      return {
        ...m,
        data: {
          x: m.x - n,
          y: m.y - r
        }
      };
    }
  };
}, CI = function(e) {
  return e === void 0 && (e = {}), {
    name: "size",
    options: e,
    async fn(t) {
      const {
        placement: n,
        rects: r,
        platform: o,
        elements: i
      } = t, {
        apply: s = () => {
        },
        ...a
      } = Zo(e, t), l = await Sd(t, a), c = pr(n), u = Xo(n), d = Yr(n) === "y", {
        width: f,
        height: h
      } = r.floating;
      let p, m;
      c === "top" || c === "bottom" ? (p = c, m = u === (await (o.isRTL == null ? void 0 : o.isRTL(i.floating)) ? "start" : "end") ? "left" : "right") : (m = c, p = u === "end" ? "top" : "bottom");
      const g = h - l.top - l.bottom, v = f - l.left - l.right, b = Pn(h - l[p], g), y = Pn(f - l[m], v), x = !t.middlewareData.shift;
      let w = b, T = y;
      if (d ? T = u || x ? Pn(y, v) : v : w = u || x ? Pn(b, g) : g, x && !u) {
        const I = Xt(l.left, 0), _ = Xt(l.right, 0), R = Xt(l.top, 0), L = Xt(l.bottom, 0);
        d ? T = f - 2 * (I !== 0 || _ !== 0 ? I + _ : Xt(l.left, l.right)) : w = h - 2 * (R !== 0 || L !== 0 ? R + L : Xt(l.top, l.bottom));
      }
      await s({
        ...t,
        availableWidth: T,
        availableHeight: w
      });
      const P = await o.getDimensions(i.floating);
      return f !== P.width || h !== P.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function lb(e) {
  const t = rn(e);
  let n = parseFloat(t.width) || 0, r = parseFloat(t.height) || 0;
  const o = gt(e), i = o ? e.offsetWidth : n, s = o ? e.offsetHeight : r, a = na(n) !== i || na(r) !== s;
  return a && (n = i, r = s), {
    width: n,
    height: r,
    $: a
  };
}
function Ed(e) {
  return We(e) ? e : e.contextElement;
}
function wo(e) {
  const t = Ed(e);
  if (!gt(t))
    return hr(1);
  const n = t.getBoundingClientRect(), {
    width: r,
    height: o,
    $: i
  } = lb(t);
  let s = (i ? na(n.width) : n.width) / r, a = (i ? na(n.height) : n.height) / o;
  return (!s || !Number.isFinite(s)) && (s = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: s,
    y: a
  };
}
const PI = /* @__PURE__ */ hr(0);
function cb(e) {
  const t = qt(e);
  return !gd() || !t.visualViewport ? PI : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function RI(e, t, n) {
  return t === void 0 && (t = !1), !n || t && n !== qt(e) ? !1 : t;
}
function qr(e, t, n, r) {
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  const o = e.getBoundingClientRect(), i = Ed(e);
  let s = hr(1);
  t && (r ? We(r) && (s = wo(r)) : s = wo(e));
  const a = RI(i, n, r) ? cb(i) : hr(0);
  let l = (o.left + a.x) / s.x, c = (o.top + a.y) / s.y, u = o.width / s.x, d = o.height / s.y;
  if (i) {
    const f = qt(i), h = r && We(r) ? qt(r) : r;
    let p = f, m = Zc(p);
    for (; m && r && h !== p; ) {
      const g = wo(m), v = m.getBoundingClientRect(), b = rn(m), y = v.left + (m.clientLeft + parseFloat(b.paddingLeft)) * g.x, x = v.top + (m.clientTop + parseFloat(b.paddingTop)) * g.y;
      l *= g.x, c *= g.y, u *= g.x, d *= g.y, l += y, c += x, p = qt(m), m = Zc(p);
    }
  }
  return oa({
    width: u,
    height: d,
    x: l,
    y: c
  });
}
function kI(e) {
  let {
    elements: t,
    rect: n,
    offsetParent: r,
    strategy: o
  } = e;
  const i = o === "fixed", s = Xn(r), a = t ? qa(t.floating) : !1;
  if (r === s || a && i)
    return n;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = hr(1);
  const u = hr(0), d = gt(r);
  if ((d || !d && !i) && ((xr(r) !== "body" || ns(s)) && (l = Ka(r)), gt(r))) {
    const f = qr(r);
    c = wo(r), u.x = f.x + r.clientLeft, u.y = f.y + r.clientTop;
  }
  return {
    width: n.width * c.x,
    height: n.height * c.y,
    x: n.x * c.x - l.scrollLeft * c.x + u.x,
    y: n.y * c.y - l.scrollTop * c.y + u.y
  };
}
function OI(e) {
  return Array.from(e.getClientRects());
}
function ub(e) {
  return qr(Xn(e)).left + Ka(e).scrollLeft;
}
function II(e) {
  const t = Xn(e), n = Ka(e), r = e.ownerDocument.body, o = Xt(t.scrollWidth, t.clientWidth, r.scrollWidth, r.clientWidth), i = Xt(t.scrollHeight, t.clientHeight, r.scrollHeight, r.clientHeight);
  let s = -n.scrollLeft + ub(e);
  const a = -n.scrollTop;
  return rn(r).direction === "rtl" && (s += Xt(t.clientWidth, r.clientWidth) - o), {
    width: o,
    height: i,
    x: s,
    y: a
  };
}
function _I(e, t) {
  const n = qt(e), r = Xn(e), o = n.visualViewport;
  let i = r.clientWidth, s = r.clientHeight, a = 0, l = 0;
  if (o) {
    i = o.width, s = o.height;
    const c = gd();
    (!c || c && t === "fixed") && (a = o.offsetLeft, l = o.offsetTop);
  }
  return {
    width: i,
    height: s,
    x: a,
    y: l
  };
}
function AI(e, t) {
  const n = qr(e, !0, t === "fixed"), r = n.top + e.clientTop, o = n.left + e.clientLeft, i = gt(e) ? wo(e) : hr(1), s = e.clientWidth * i.x, a = e.clientHeight * i.y, l = o * i.x, c = r * i.y;
  return {
    width: s,
    height: a,
    x: l,
    y: c
  };
}
function Sp(e, t, n) {
  let r;
  if (t === "viewport")
    r = _I(e, n);
  else if (t === "document")
    r = II(Xn(e));
  else if (We(t))
    r = AI(t, n);
  else {
    const o = cb(e);
    r = {
      ...t,
      x: t.x - o.x,
      y: t.y - o.y
    };
  }
  return oa(r);
}
function db(e, t) {
  const n = qn(e);
  return n === t || !We(n) || fr(n) ? !1 : rn(n).position === "fixed" || db(n, t);
}
function DI(e, t) {
  const n = t.get(e);
  if (n)
    return n;
  let r = lr(e, [], !1).filter((a) => We(a) && xr(a) !== "body"), o = null;
  const i = rn(e).position === "fixed";
  let s = i ? qn(e) : e;
  for (; We(s) && !fr(s); ) {
    const a = rn(s), l = md(s);
    !l && a.position === "fixed" && (o = null), (i ? !l && !o : !l && a.position === "static" && !!o && ["absolute", "fixed"].includes(o.position) || ns(s) && !l && db(e, s)) ? r = r.filter((u) => u !== s) : o = a, s = qn(s);
  }
  return t.set(e, r), r;
}
function MI(e) {
  let {
    element: t,
    boundary: n,
    rootBoundary: r,
    strategy: o
  } = e;
  const s = [...n === "clippingAncestors" ? qa(t) ? [] : DI(t, this._c) : [].concat(n), r], a = s[0], l = s.reduce((c, u) => {
    const d = Sp(t, u, o);
    return c.top = Xt(d.top, c.top), c.right = Pn(d.right, c.right), c.bottom = Pn(d.bottom, c.bottom), c.left = Xt(d.left, c.left), c;
  }, Sp(t, a, o));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function NI(e) {
  const {
    width: t,
    height: n
  } = lb(e);
  return {
    width: t,
    height: n
  };
}
function FI(e, t, n) {
  const r = gt(t), o = Xn(t), i = n === "fixed", s = qr(e, !0, i, t);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = hr(0);
  if (r || !r && !i)
    if ((xr(t) !== "body" || ns(o)) && (a = Ka(t)), r) {
      const d = qr(t, !0, i, t);
      l.x = d.x + t.clientLeft, l.y = d.y + t.clientTop;
    } else o && (l.x = ub(o));
  const c = s.left + a.scrollLeft - l.x, u = s.top + a.scrollTop - l.y;
  return {
    x: c,
    y: u,
    width: s.width,
    height: s.height
  };
}
function Yl(e) {
  return rn(e).position === "static";
}
function Ep(e, t) {
  return !gt(e) || rn(e).position === "fixed" ? null : t ? t(e) : e.offsetParent;
}
function fb(e, t) {
  const n = qt(e);
  if (qa(e))
    return n;
  if (!gt(e)) {
    let o = qn(e);
    for (; o && !fr(o); ) {
      if (We(o) && !Yl(o))
        return o;
      o = qn(o);
    }
    return n;
  }
  let r = Ep(e, t);
  for (; r && BO(r) && Yl(r); )
    r = Ep(r, t);
  return r && fr(r) && Yl(r) && !md(r) ? n : r || zO(e) || n;
}
const LI = async function(e) {
  const t = this.getOffsetParent || fb, n = this.getDimensions, r = await n(e.floating);
  return {
    reference: FI(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: r.width,
      height: r.height
    }
  };
};
function VI(e) {
  return rn(e).direction === "rtl";
}
const $I = {
  convertOffsetParentRelativeRectToViewportRelativeRect: kI,
  getDocumentElement: Xn,
  getClippingRect: MI,
  getOffsetParent: fb,
  getElementRects: LI,
  getClientRects: OI,
  getDimensions: NI,
  getScale: wo,
  isElement: We,
  isRTL: VI
};
function jI(e, t) {
  let n = null, r;
  const o = Xn(e);
  function i() {
    var a;
    clearTimeout(r), (a = n) == null || a.disconnect(), n = null;
  }
  function s(a, l) {
    a === void 0 && (a = !1), l === void 0 && (l = 1), i();
    const {
      left: c,
      top: u,
      width: d,
      height: f
    } = e.getBoundingClientRect();
    if (a || t(), !d || !f)
      return;
    const h = yo(u), p = yo(o.clientWidth - (c + d)), m = yo(o.clientHeight - (u + f)), g = yo(c), b = {
      rootMargin: -h + "px " + -p + "px " + -m + "px " + -g + "px",
      threshold: Xt(0, Pn(1, l)) || 1
    };
    let y = !0;
    function x(w) {
      const T = w[0].intersectionRatio;
      if (T !== l) {
        if (!y)
          return s();
        T ? s(!1, T) : r = setTimeout(() => {
          s(!1, 1e-7);
        }, 1e3);
      }
      y = !1;
    }
    try {
      n = new IntersectionObserver(x, {
        ...b,
        // Handle <iframe>s
        root: o.ownerDocument
      });
    } catch {
      n = new IntersectionObserver(x, b);
    }
    n.observe(e);
  }
  return s(!0), i;
}
function Za(e, t, n, r) {
  r === void 0 && (r = {});
  const {
    ancestorScroll: o = !0,
    ancestorResize: i = !0,
    elementResize: s = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = r, c = Ed(e), u = o || i ? [...c ? lr(c) : [], ...lr(t)] : [];
  u.forEach((v) => {
    o && v.addEventListener("scroll", n, {
      passive: !0
    }), i && v.addEventListener("resize", n);
  });
  const d = c && a ? jI(c, n) : null;
  let f = -1, h = null;
  s && (h = new ResizeObserver((v) => {
    let [b] = v;
    b && b.target === c && h && (h.unobserve(t), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
      var y;
      (y = h) == null || y.observe(t);
    })), n();
  }), c && !l && h.observe(c), h.observe(t));
  let p, m = l ? qr(e) : null;
  l && g();
  function g() {
    const v = qr(e);
    m && (v.x !== m.x || v.y !== m.y || v.width !== m.width || v.height !== m.height) && n(), m = v, p = requestAnimationFrame(g);
  }
  return n(), () => {
    var v;
    u.forEach((b) => {
      o && b.removeEventListener("scroll", n), i && b.removeEventListener("resize", n);
    }), d == null || d(), (v = h) == null || v.disconnect(), h = null, l && cancelAnimationFrame(p);
  };
}
const BI = SI, zI = EI, WI = xI, HI = CI, Cp = wI, UI = (e, t, n) => {
  const r = /* @__PURE__ */ new Map(), o = {
    platform: $I,
    ...n
  }, i = {
    ...o.platform,
    _c: r
  };
  return bI(e, t, {
    ...o,
    platform: i
  });
};
var Ns = typeof document < "u" ? Da : xe;
function la(e, t) {
  if (e === t)
    return !0;
  if (typeof e != typeof t)
    return !1;
  if (typeof e == "function" && e.toString() === t.toString())
    return !0;
  let n, r, o;
  if (e && t && typeof e == "object") {
    if (Array.isArray(e)) {
      if (n = e.length, n !== t.length) return !1;
      for (r = n; r-- !== 0; )
        if (!la(e[r], t[r]))
          return !1;
      return !0;
    }
    if (o = Object.keys(e), n = o.length, n !== Object.keys(t).length)
      return !1;
    for (r = n; r-- !== 0; )
      if (!{}.hasOwnProperty.call(t, o[r]))
        return !1;
    for (r = n; r-- !== 0; ) {
      const i = o[r];
      if (!(i === "_owner" && e.$$typeof) && !la(e[i], t[i]))
        return !1;
    }
    return !0;
  }
  return e !== e && t !== t;
}
function hb(e) {
  return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function Pp(e, t) {
  const n = hb(e);
  return Math.round(t * n) / n;
}
function Rp(e) {
  const t = O.useRef(e);
  return Ns(() => {
    t.current = e;
  }), t;
}
function GI(e) {
  e === void 0 && (e = {});
  const {
    placement: t = "bottom",
    strategy: n = "absolute",
    middleware: r = [],
    platform: o,
    elements: {
      reference: i,
      floating: s
    } = {},
    transform: a = !0,
    whileElementsMounted: l,
    open: c
  } = e, [u, d] = O.useState({
    x: 0,
    y: 0,
    strategy: n,
    placement: t,
    middlewareData: {},
    isPositioned: !1
  }), [f, h] = O.useState(r);
  la(f, r) || h(r);
  const [p, m] = O.useState(null), [g, v] = O.useState(null), b = O.useCallback((N) => {
    N !== T.current && (T.current = N, m(N));
  }, []), y = O.useCallback((N) => {
    N !== P.current && (P.current = N, v(N));
  }, []), x = i || p, w = s || g, T = O.useRef(null), P = O.useRef(null), I = O.useRef(u), _ = l != null, R = Rp(l), L = Rp(o), M = O.useCallback(() => {
    if (!T.current || !P.current)
      return;
    const N = {
      placement: t,
      strategy: n,
      middleware: f
    };
    L.current && (N.platform = L.current), UI(T.current, P.current, N).then((H) => {
      const Y = {
        ...H,
        isPositioned: !0
      };
      V.current && !la(I.current, Y) && (I.current = Y, cg.flushSync(() => {
        d(Y);
      }));
    });
  }, [f, t, n, L]);
  Ns(() => {
    c === !1 && I.current.isPositioned && (I.current.isPositioned = !1, d((N) => ({
      ...N,
      isPositioned: !1
    })));
  }, [c]);
  const V = O.useRef(!1);
  Ns(() => (V.current = !0, () => {
    V.current = !1;
  }), []), Ns(() => {
    if (x && (T.current = x), w && (P.current = w), x && w) {
      if (R.current)
        return R.current(x, w, M);
      M();
    }
  }, [x, w, M, R, _]);
  const E = O.useMemo(() => ({
    reference: T,
    floating: P,
    setReference: b,
    setFloating: y
  }), [b, y]), k = O.useMemo(() => ({
    reference: x,
    floating: w
  }), [x, w]), A = O.useMemo(() => {
    const N = {
      position: n,
      left: 0,
      top: 0
    };
    if (!k.floating)
      return N;
    const H = Pp(k.floating, u.x), Y = Pp(k.floating, u.y);
    return a ? {
      ...N,
      transform: "translate(" + H + "px, " + Y + "px)",
      ...hb(k.floating) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: n,
      left: H,
      top: Y
    };
  }, [n, a, k.floating, u.x, u.y]);
  return O.useMemo(() => ({
    ...u,
    update: M,
    refs: E,
    elements: k,
    floatingStyles: A
  }), [u, M, E, k, A]);
}
const YI = (e) => {
  function t(n) {
    return {}.hasOwnProperty.call(n, "current");
  }
  return {
    name: "arrow",
    options: e,
    fn(n) {
      const {
        element: r,
        padding: o
      } = typeof e == "function" ? e(n) : e;
      return r && t(r) ? r.current != null ? Cp({
        element: r.current,
        padding: o
      }).fn(n) : {} : r ? Cp({
        element: r,
        padding: o
      }).fn(n) : {};
    }
  };
}, Xa = (e, t) => ({
  ...BI(e),
  options: [e, t]
}), Cd = (e, t) => ({
  ...zI(e),
  options: [e, t]
}), Pd = (e, t) => ({
  ...WI(e),
  options: [e, t]
}), qI = (e, t) => ({
  ...HI(e),
  options: [e, t]
}), pb = (e, t) => ({
  ...YI(e),
  options: [e, t]
});
function mb(e) {
  return O.useMemo(() => e.every((t) => t == null) ? null : (t) => {
    e.forEach((n) => {
      typeof n == "function" ? n(t) : n != null && (n.current = t);
    });
  }, e);
}
const gb = {
  ...O
}, KI = gb.useInsertionEffect, ZI = KI || ((e) => e());
function _t(e) {
  const t = O.useRef(() => {
    if (process.env.NODE_ENV !== "production")
      throw new Error("Cannot call an event handler while rendering.");
  });
  return ZI(() => {
    t.current = e;
  }), O.useCallback(function() {
    for (var n = arguments.length, r = new Array(n), o = 0; o < n; o++)
      r[o] = arguments[o];
    return t.current == null ? void 0 : t.current(...r);
  }, []);
}
const Rd = "ArrowUp", rs = "ArrowDown", Fo = "ArrowLeft", Qo = "ArrowRight";
function Ts(e, t, n) {
  return Math.floor(e / t) !== n;
}
function Si(e, t) {
  return t < 0 || t >= e.current.length;
}
function ql(e, t) {
  return Vt(e, {
    disabledIndices: t
  });
}
function kp(e, t) {
  return Vt(e, {
    decrement: !0,
    startingIndex: e.current.length,
    disabledIndices: t
  });
}
function Vt(e, t) {
  let {
    startingIndex: n = -1,
    decrement: r = !1,
    disabledIndices: o,
    amount: i = 1
  } = t === void 0 ? {} : t;
  const s = e.current;
  let a = n;
  do
    a += r ? -i : i;
  while (a >= 0 && a <= s.length - 1 && Fs(s, a, o));
  return a;
}
function XI(e, t) {
  let {
    event: n,
    orientation: r,
    loop: o,
    cols: i,
    disabledIndices: s,
    minIndex: a,
    maxIndex: l,
    prevIndex: c,
    stopEvent: u = !1
  } = t, d = c;
  if (n.key === Rd) {
    if (u && It(n), c === -1)
      d = l;
    else if (d = Vt(e, {
      startingIndex: d,
      amount: i,
      decrement: !0,
      disabledIndices: s
    }), o && (c - i < a || d < 0)) {
      const f = c % i, h = l % i, p = l - (h - f);
      h === f ? d = l : d = h > f ? p : p - i;
    }
    Si(e, d) && (d = c);
  }
  if (n.key === rs && (u && It(n), c === -1 ? d = a : (d = Vt(e, {
    startingIndex: c,
    amount: i,
    disabledIndices: s
  }), o && c + i > l && (d = Vt(e, {
    startingIndex: c % i - i,
    amount: i,
    disabledIndices: s
  }))), Si(e, d) && (d = c)), r === "both") {
    const f = yo(c / i);
    n.key === Qo && (u && It(n), c % i !== i - 1 ? (d = Vt(e, {
      startingIndex: c,
      disabledIndices: s
    }), o && Ts(d, i, f) && (d = Vt(e, {
      startingIndex: c - c % i - 1,
      disabledIndices: s
    }))) : o && (d = Vt(e, {
      startingIndex: c - c % i - 1,
      disabledIndices: s
    })), Ts(d, i, f) && (d = c)), n.key === Fo && (u && It(n), c % i !== 0 ? (d = Vt(e, {
      startingIndex: c,
      decrement: !0,
      disabledIndices: s
    }), o && Ts(d, i, f) && (d = Vt(e, {
      startingIndex: c + (i - c % i),
      decrement: !0,
      disabledIndices: s
    }))) : o && (d = Vt(e, {
      startingIndex: c + (i - c % i),
      decrement: !0,
      disabledIndices: s
    })), Ts(d, i, f) && (d = c));
    const h = yo(l / i) === f;
    Si(e, d) && (o && h ? d = n.key === Fo ? l : Vt(e, {
      startingIndex: c - c % i - 1,
      disabledIndices: s
    }) : d = c);
  }
  return d;
}
function QI(e, t, n) {
  const r = [];
  let o = 0;
  return e.forEach((i, s) => {
    let {
      width: a,
      height: l
    } = i;
    if (a > t && process.env.NODE_ENV !== "production")
      throw new Error("[Floating UI]: Invalid grid - item width at index " + s + " is greater than grid columns");
    let c = !1;
    for (n && (o = 0); !c; ) {
      const u = [];
      for (let d = 0; d < a; d++)
        for (let f = 0; f < l; f++)
          u.push(o + d + f * t);
      o % t + a <= t && u.every((d) => r[d] == null) ? (u.forEach((d) => {
        r[d] = s;
      }), c = !0) : o++;
    }
  }), [...r];
}
function JI(e, t, n, r, o) {
  if (e === -1) return -1;
  const i = n.indexOf(e), s = t[e];
  switch (o) {
    case "tl":
      return i;
    case "tr":
      return s ? i + s.width - 1 : i;
    case "bl":
      return s ? i + (s.height - 1) * r : i;
    case "br":
      return n.lastIndexOf(e);
  }
}
function e_(e, t) {
  return t.flatMap((n, r) => e.includes(n) ? [r] : []);
}
function Fs(e, t, n) {
  if (n)
    return n.includes(t);
  const r = e[t];
  return r == null || r.hasAttribute("disabled") || r.getAttribute("aria-disabled") === "true";
}
let Op = 0;
function or(e, t) {
  t === void 0 && (t = {});
  const {
    preventScroll: n = !1,
    cancelPrevious: r = !0,
    sync: o = !1
  } = t;
  r && cancelAnimationFrame(Op);
  const i = () => e == null ? void 0 : e.focus({
    preventScroll: n
  });
  o ? i() : Op = requestAnimationFrame(i);
}
var Ae = typeof document < "u" ? Da : xe;
function t_(e, t) {
  const n = e.compareDocumentPosition(t);
  return n & Node.DOCUMENT_POSITION_FOLLOWING || n & Node.DOCUMENT_POSITION_CONTAINED_BY ? -1 : n & Node.DOCUMENT_POSITION_PRECEDING || n & Node.DOCUMENT_POSITION_CONTAINS ? 1 : 0;
}
function n_(e, t) {
  if (e.size !== t.size)
    return !1;
  for (const [n, r] of e.entries())
    if (r !== t.get(n))
      return !1;
  return !0;
}
const yb = /* @__PURE__ */ O.createContext({
  register: () => {
  },
  unregister: () => {
  },
  map: /* @__PURE__ */ new Map(),
  elementsRef: {
    current: []
  }
});
function r_(e) {
  const {
    children: t,
    elementsRef: n,
    labelsRef: r
  } = e, [o, i] = O.useState(() => /* @__PURE__ */ new Map()), s = O.useCallback((l) => {
    i((c) => new Map(c).set(l, null));
  }, []), a = O.useCallback((l) => {
    i((c) => {
      const u = new Map(c);
      return u.delete(l), u;
    });
  }, []);
  return Ae(() => {
    const l = new Map(o);
    Array.from(l.keys()).sort(t_).forEach((u, d) => {
      l.set(u, d);
    }), n_(o, l) || i(l);
  }, [o]), /* @__PURE__ */ O.createElement(yb.Provider, {
    value: O.useMemo(() => ({
      register: s,
      unregister: a,
      map: o,
      elementsRef: n,
      labelsRef: r
    }), [s, a, o, n, r])
  }, t);
}
function vb(e) {
  e === void 0 && (e = {});
  const {
    label: t
  } = e, {
    register: n,
    unregister: r,
    map: o,
    elementsRef: i,
    labelsRef: s
  } = O.useContext(yb), [a, l] = O.useState(null), c = O.useRef(null), u = O.useCallback((d) => {
    if (c.current = d, a !== null && (i.current[a] = d, s)) {
      var f;
      const h = t !== void 0;
      s.current[a] = h ? t : (f = d == null ? void 0 : d.textContent) != null ? f : null;
    }
  }, [a, i, s, t]);
  return Ae(() => {
    const d = c.current;
    if (d)
      return n(d), () => {
        r(d);
      };
  }, [n, r]), Ae(() => {
    const d = c.current ? o.get(c.current) : null;
    d != null && l(d);
  }, [o]), O.useMemo(() => ({
    ref: u,
    index: a ?? -1
  }), [a, u]);
}
function Lo() {
  return Lo = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n)
        Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, Lo.apply(this, arguments);
}
let Ip = !1, o_ = 0;
const _p = () => (
  // Ensure the id is unique with multiple independent versions of Floating UI
  // on <React 18
  "floating-ui-" + Math.random().toString(36).slice(2, 6) + o_++
);
function i_() {
  const [e, t] = O.useState(() => Ip ? _p() : void 0);
  return Ae(() => {
    e == null && t(_p());
  }, []), O.useEffect(() => {
    Ip = !0;
  }, []), e;
}
const s_ = gb.useId, Jo = s_ || i_;
let Vi;
process.env.NODE_ENV !== "production" && (Vi = /* @__PURE__ */ new Set());
function Ls() {
  for (var e, t = arguments.length, n = new Array(t), r = 0; r < t; r++)
    n[r] = arguments[r];
  const o = "Floating UI: " + n.join(" ");
  if (!((e = Vi) != null && e.has(o))) {
    var i;
    (i = Vi) == null || i.add(o), console.warn(o);
  }
}
function a_() {
  for (var e, t = arguments.length, n = new Array(t), r = 0; r < t; r++)
    n[r] = arguments[r];
  const o = "Floating UI: " + n.join(" ");
  if (!((e = Vi) != null && e.has(o))) {
    var i;
    (i = Vi) == null || i.add(o), console.error(o);
  }
}
const bb = /* @__PURE__ */ O.forwardRef(function(t, n) {
  const {
    context: {
      placement: r,
      elements: {
        floating: o
      },
      middlewareData: {
        arrow: i
      }
    },
    width: s = 14,
    height: a = 7,
    tipRadius: l = 0,
    strokeWidth: c = 0,
    staticOffset: u,
    stroke: d,
    d: f,
    style: {
      transform: h,
      ...p
    } = {},
    ...m
  } = t;
  process.env.NODE_ENV !== "production" && (n || Ls("The `ref` prop is required for `FloatingArrow`."));
  const g = Jo(), [v, b] = O.useState(!1);
  if (Ae(() => {
    if (!o) return;
    rn(o).direction === "rtl" && b(!0);
  }, [o]), !o)
    return null;
  const y = c * 2, x = y / 2, w = s / 2 * (l / -8 + 1), T = a / 2 * l / 4, [P, I] = r.split("-"), _ = !!f, R = P === "top" || P === "bottom", L = u && I === "end" ? "bottom" : "top";
  let M = u && I === "end" ? "right" : "left";
  u && v && (M = I === "end" ? "left" : "right");
  const V = (i == null ? void 0 : i.x) != null ? u || i.x : "", E = (i == null ? void 0 : i.y) != null ? u || i.y : "", k = f || "M0,0" + (" H" + s) + (" L" + (s - w) + "," + (a - T)) + (" Q" + s / 2 + "," + a + " " + w + "," + (a - T)) + " Z", A = {
    top: _ ? "rotate(180deg)" : "",
    left: _ ? "rotate(90deg)" : "rotate(-90deg)",
    bottom: _ ? "" : "rotate(180deg)",
    right: _ ? "rotate(-90deg)" : "rotate(90deg)"
  }[P];
  return /* @__PURE__ */ O.createElement("svg", Lo({}, m, {
    "aria-hidden": !0,
    ref: n,
    width: _ ? s : s + y,
    height: s,
    viewBox: "0 0 " + s + " " + (a > s ? a : s),
    style: {
      position: "absolute",
      pointerEvents: "none",
      [M]: V,
      [L]: E,
      [P]: R || _ ? "100%" : "calc(100% - " + y / 2 + "px)",
      transform: "" + A + (h ?? ""),
      ...p
    }
  }), y > 0 && /* @__PURE__ */ O.createElement("path", {
    clipPath: "url(#" + g + ")",
    fill: "none",
    stroke: d,
    strokeWidth: y + (f ? 0 : 1),
    d: k
  }), /* @__PURE__ */ O.createElement("path", {
    stroke: y && !f ? m.fill : "none",
    d: k
  }), /* @__PURE__ */ O.createElement("clipPath", {
    id: g
  }, /* @__PURE__ */ O.createElement("rect", {
    x: -x,
    y: x * (_ ? -1 : 1),
    width: s + y,
    height: s
  })));
});
function wb() {
  const e = /* @__PURE__ */ new Map();
  return {
    emit(t, n) {
      var r;
      (r = e.get(t)) == null || r.forEach((o) => o(n));
    },
    on(t, n) {
      e.set(t, [...e.get(t) || [], n]);
    },
    off(t, n) {
      var r;
      e.set(t, ((r = e.get(t)) == null ? void 0 : r.filter((o) => o !== n)) || []);
    }
  };
}
const xb = /* @__PURE__ */ O.createContext(null), Tb = /* @__PURE__ */ O.createContext(null), Tr = () => {
  var e;
  return ((e = O.useContext(xb)) == null ? void 0 : e.id) || null;
}, Sr = () => O.useContext(Tb);
function l_(e) {
  const t = Jo(), n = Sr(), o = Tr();
  return Ae(() => {
    const i = {
      id: t,
      parentId: o
    };
    return n == null || n.addNode(i), () => {
      n == null || n.removeNode(i);
    };
  }, [n, t, o]), t;
}
function c_(e) {
  const {
    children: t,
    id: n
  } = e, r = Tr();
  return /* @__PURE__ */ O.createElement(xb.Provider, {
    value: O.useMemo(() => ({
      id: n,
      parentId: r
    }), [n, r])
  }, t);
}
function u_(e) {
  const {
    children: t
  } = e, n = O.useRef([]), r = O.useCallback((s) => {
    n.current = [...n.current, s];
  }, []), o = O.useCallback((s) => {
    n.current = n.current.filter((a) => a !== s);
  }, []), i = O.useState(() => wb())[0];
  return /* @__PURE__ */ O.createElement(Tb.Provider, {
    value: O.useMemo(() => ({
      nodesRef: n,
      addNode: r,
      removeNode: o,
      events: i
    }), [r, o, i])
  }, t);
}
function mr(e) {
  return "data-floating-ui-" + e;
}
function At(e) {
  const t = ye(e);
  return Ae(() => {
    t.current = e;
  }), t;
}
const Ap = /* @__PURE__ */ mr("safe-polygon");
function Kl(e, t, n) {
  return n && !Fi(n) ? 0 : typeof e == "number" ? e : e == null ? void 0 : e[t];
}
function Sb(e, t) {
  t === void 0 && (t = {});
  const {
    open: n,
    onOpenChange: r,
    dataRef: o,
    events: i,
    elements: s
  } = e, {
    enabled: a = !0,
    delay: l = 0,
    handleClose: c = null,
    mouseOnly: u = !1,
    restMs: d = 0,
    move: f = !0
  } = t, h = Sr(), p = Tr(), m = At(c), g = At(l), v = At(n), b = O.useRef(), y = O.useRef(-1), x = O.useRef(), w = O.useRef(-1), T = O.useRef(!0), P = O.useRef(!1), I = O.useRef(() => {
  }), _ = O.useCallback(() => {
    var k;
    const A = (k = o.current.openEvent) == null ? void 0 : k.type;
    return (A == null ? void 0 : A.includes("mouse")) && A !== "mousedown";
  }, [o]);
  O.useEffect(() => {
    if (!a) return;
    function k(A) {
      let {
        open: N
      } = A;
      N || (clearTimeout(y.current), clearTimeout(w.current), T.current = !0);
    }
    return i.on("openchange", k), () => {
      i.off("openchange", k);
    };
  }, [a, i]), O.useEffect(() => {
    if (!a || !m.current || !n) return;
    function k(N) {
      _() && r(!1, N, "hover");
    }
    const A = Pt(s.floating).documentElement;
    return A.addEventListener("mouseleave", k), () => {
      A.removeEventListener("mouseleave", k);
    };
  }, [s.floating, n, r, a, m, _]);
  const R = O.useCallback(function(k, A, N) {
    A === void 0 && (A = !0), N === void 0 && (N = "hover");
    const H = Kl(g.current, "close", b.current);
    H && !x.current ? (clearTimeout(y.current), y.current = window.setTimeout(() => r(!1, k, N), H)) : A && (clearTimeout(y.current), r(!1, k, N));
  }, [g, r]), L = _t(() => {
    I.current(), x.current = void 0;
  }), M = _t(() => {
    if (P.current) {
      const k = Pt(s.floating).body;
      k.style.pointerEvents = "", k.removeAttribute(Ap), P.current = !1;
    }
  });
  O.useEffect(() => {
    if (!a) return;
    function k() {
      return o.current.openEvent ? ["click", "mousedown"].includes(o.current.openEvent.type) : !1;
    }
    function A(C) {
      if (clearTimeout(y.current), T.current = !1, u && !Fi(b.current) || d > 0 && !Kl(g.current, "open"))
        return;
      const $ = Kl(g.current, "open", b.current);
      $ ? y.current = window.setTimeout(() => {
        v.current || r(!0, C, "hover");
      }, $) : r(!0, C, "hover");
    }
    function N(C) {
      if (k()) return;
      I.current();
      const $ = Pt(s.floating);
      if (clearTimeout(w.current), m.current && o.current.floatingContext) {
        n || clearTimeout(y.current), x.current = m.current({
          ...o.current.floatingContext,
          tree: h,
          x: C.clientX,
          y: C.clientY,
          onClose() {
            M(), L(), R(C, !0, "safe-polygon");
          }
        });
        const re = x.current;
        $.addEventListener("mousemove", re), I.current = () => {
          $.removeEventListener("mousemove", re);
        };
        return;
      }
      (b.current === "touch" ? !mt(s.floating, C.relatedTarget) : !0) && R(C);
    }
    function H(C) {
      k() || o.current.floatingContext && (m.current == null || m.current({
        ...o.current.floatingContext,
        tree: h,
        x: C.clientX,
        y: C.clientY,
        onClose() {
          M(), L(), R(C);
        }
      })(C));
    }
    if (We(s.domReference)) {
      var Y;
      const C = s.domReference;
      return n && C.addEventListener("mouseleave", H), (Y = s.floating) == null || Y.addEventListener("mouseleave", H), f && C.addEventListener("mousemove", A, {
        once: !0
      }), C.addEventListener("mouseenter", A), C.addEventListener("mouseleave", N), () => {
        var $;
        n && C.removeEventListener("mouseleave", H), ($ = s.floating) == null || $.removeEventListener("mouseleave", H), f && C.removeEventListener("mousemove", A), C.removeEventListener("mouseenter", A), C.removeEventListener("mouseleave", N);
      };
    }
  }, [s, a, e, u, d, f, R, L, M, r, n, v, h, g, m, o]), Ae(() => {
    var k;
    if (a && n && (k = m.current) != null && k.__options.blockPointerEvents && _()) {
      const N = Pt(s.floating).body;
      N.setAttribute(Ap, ""), N.style.pointerEvents = "none", P.current = !0;
      const H = s.floating;
      if (We(s.domReference) && H) {
        var A;
        const Y = s.domReference, C = h == null || (A = h.nodesRef.current.find(($) => $.id === p)) == null || (A = A.context) == null ? void 0 : A.elements.floating;
        return C && (C.style.pointerEvents = ""), Y.style.pointerEvents = "auto", H.style.pointerEvents = "auto", () => {
          Y.style.pointerEvents = "", H.style.pointerEvents = "";
        };
      }
    }
  }, [a, n, p, s, h, m, _]), Ae(() => {
    n || (b.current = void 0, L(), M());
  }, [n, L, M]), O.useEffect(() => () => {
    L(), clearTimeout(y.current), clearTimeout(w.current), M();
  }, [a, s.domReference, L, M]);
  const V = O.useMemo(() => {
    function k(A) {
      b.current = A.pointerType;
    }
    return {
      onPointerDown: k,
      onPointerEnter: k,
      onMouseMove(A) {
        const {
          nativeEvent: N
        } = A;
        function H() {
          !T.current && !v.current && r(!0, N, "hover");
        }
        u && !Fi(b.current) || n || d === 0 || (clearTimeout(w.current), b.current === "touch" ? H() : w.current = window.setTimeout(H, d));
      }
    };
  }, [u, r, n, v, d]), E = O.useMemo(() => ({
    onMouseEnter() {
      clearTimeout(y.current);
    },
    onMouseLeave(k) {
      R(k.nativeEvent, !1);
    }
  }), [R]);
  return O.useMemo(() => a ? {
    reference: V,
    floating: E
  } : {}, [a, V, E]);
}
function d_(e, t) {
  var n;
  let r = [], o = (n = e.find((i) => i.id === t)) == null ? void 0 : n.parentId;
  for (; o; ) {
    const i = e.find((s) => s.id === o);
    o = i == null ? void 0 : i.parentId, i && (r = r.concat(i));
  }
  return r;
}
function Ur(e, t) {
  let n = e.filter((o) => {
    var i;
    return o.parentId === t && ((i = o.context) == null ? void 0 : i.open);
  }), r = n;
  for (; r.length; )
    r = e.filter((o) => {
      var i;
      return (i = r) == null ? void 0 : i.some((s) => {
        var a;
        return o.parentId === s.id && ((a = o.context) == null ? void 0 : a.open);
      });
    }), n = n.concat(r);
  return n;
}
function f_(e, t) {
  let n, r = -1;
  function o(i, s) {
    s > r && (n = i, r = s), Ur(e, i).forEach((l) => {
      o(l.id, s + 1);
    });
  }
  return o(t, 0), e.find((i) => i.id === n);
}
let lo = /* @__PURE__ */ new WeakMap(), Ss = /* @__PURE__ */ new WeakSet(), Es = {}, Zl = 0;
const h_ = () => typeof HTMLElement < "u" && "inert" in HTMLElement.prototype, Eb = (e) => e && (e.host || Eb(e.parentNode)), p_ = (e, t) => t.map((n) => {
  if (e.contains(n))
    return n;
  const r = Eb(n);
  return e.contains(r) ? r : null;
}).filter((n) => n != null);
function m_(e, t, n, r) {
  const o = "data-floating-ui-inert", i = r ? "inert" : n ? "aria-hidden" : null, s = p_(t, e), a = /* @__PURE__ */ new Set(), l = new Set(s), c = [];
  Es[o] || (Es[o] = /* @__PURE__ */ new WeakMap());
  const u = Es[o];
  s.forEach(d), f(t), a.clear();
  function d(h) {
    !h || a.has(h) || (a.add(h), h.parentNode && d(h.parentNode));
  }
  function f(h) {
    !h || l.has(h) || [].forEach.call(h.children, (p) => {
      if (xr(p) !== "script")
        if (a.has(p))
          f(p);
        else {
          const m = i ? p.getAttribute(i) : null, g = m !== null && m !== "false", v = (lo.get(p) || 0) + 1, b = (u.get(p) || 0) + 1;
          lo.set(p, v), u.set(p, b), c.push(p), v === 1 && g && Ss.add(p), b === 1 && p.setAttribute(o, ""), !g && i && p.setAttribute(i, "true");
        }
    });
  }
  return Zl++, () => {
    c.forEach((h) => {
      const p = (lo.get(h) || 0) - 1, m = (u.get(h) || 0) - 1;
      lo.set(h, p), u.set(h, m), p || (!Ss.has(h) && i && h.removeAttribute(i), Ss.delete(h)), m || h.removeAttribute(o);
    }), Zl--, Zl || (lo = /* @__PURE__ */ new WeakMap(), lo = /* @__PURE__ */ new WeakMap(), Ss = /* @__PURE__ */ new WeakSet(), Es = {});
  };
}
function Dp(e, t, n) {
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  const r = Pt(e[0]).body;
  return m_(e.concat(Array.from(r.querySelectorAll("[aria-live]"))), r, t, n);
}
const Vo = () => ({
  getShadowRoot: !0,
  displayCheck: (
    // JSDOM does not support the `tabbable` library. To solve this we can
    // check if `ResizeObserver` is a real function (not polyfilled), which
    // determines if the current environment is JSDOM-like.
    typeof ResizeObserver == "function" && ResizeObserver.toString().includes("[native code]") ? "full" : "none"
  )
});
function Cb(e, t) {
  const n = Li(e, Vo());
  t === "prev" && n.reverse();
  const r = n.indexOf(cn(Pt(e)));
  return n.slice(r + 1)[0];
}
function Pb() {
  return Cb(document.body, "next");
}
function Rb() {
  return Cb(document.body, "prev");
}
function Ei(e, t) {
  const n = t || e.currentTarget, r = e.relatedTarget;
  return !r || !mt(n, r);
}
function g_(e) {
  Li(e, Vo()).forEach((n) => {
    n.dataset.tabindex = n.getAttribute("tabindex") || "", n.setAttribute("tabindex", "-1");
  });
}
function y_(e) {
  e.querySelectorAll("[data-tabindex]").forEach((n) => {
    const r = n.dataset.tabindex;
    delete n.dataset.tabindex, r ? n.setAttribute("tabindex", r) : n.removeAttribute("tabindex");
  });
}
function v_(e, t, n) {
  const r = e.indexOf(t);
  function o(s) {
    const a = mr("focus-guard");
    let l = r + (s ? 1 : 0), c = e[l];
    for (; c && (!c.isConnected || c.hasAttribute(a) || mt(n, c)); )
      s ? l++ : l--, c = e[l];
    return c;
  }
  const i = o(!0);
  return i || o(!1);
}
const kd = {
  border: 0,
  clip: "rect(0 0 0 0)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  padding: 0,
  position: "fixed",
  whiteSpace: "nowrap",
  width: "1px",
  top: 0,
  left: 0
};
let b_;
function Mp(e) {
  e.key === "Tab" && (e.target, clearTimeout(b_));
}
const ca = /* @__PURE__ */ O.forwardRef(function(t, n) {
  const [r, o] = O.useState();
  Ae(() => (bd() && o("button"), document.addEventListener("keydown", Mp), () => {
    document.removeEventListener("keydown", Mp);
  }), []);
  const i = {
    ref: n,
    tabIndex: 0,
    // Role is only for VoiceOver
    role: r,
    "aria-hidden": r ? void 0 : !0,
    [mr("focus-guard")]: "",
    style: kd
  };
  return /* @__PURE__ */ O.createElement("span", Lo({}, t, i));
}), kb = /* @__PURE__ */ O.createContext(null), Np = /* @__PURE__ */ mr("portal");
function w_(e) {
  e === void 0 && (e = {});
  const {
    id: t,
    root: n
  } = e, r = Jo(), o = Ob(), [i, s] = O.useState(null), a = O.useRef(null);
  return Ae(() => () => {
    i == null || i.remove(), queueMicrotask(() => {
      a.current = null;
    });
  }, [i]), Ae(() => {
    if (!r || a.current) return;
    const l = t ? document.getElementById(t) : null;
    if (!l) return;
    const c = document.createElement("div");
    c.id = r, c.setAttribute(Np, ""), l.appendChild(c), a.current = c, s(c);
  }, [t, r]), Ae(() => {
    if (!r || a.current) return;
    let l = n || (o == null ? void 0 : o.portalNode);
    l && !We(l) && (l = l.current), l = l || document.body;
    let c = null;
    t && (c = document.createElement("div"), c.id = t, l.appendChild(c));
    const u = document.createElement("div");
    u.id = r, u.setAttribute(Np, ""), l = c || l, l.appendChild(u), a.current = u, s(u);
  }, [t, n, r, o]), i;
}
function os(e) {
  const {
    children: t,
    id: n,
    root: r = null,
    preserveTabOrder: o = !0
  } = e, i = w_({
    id: n,
    root: r
  }), [s, a] = O.useState(null), l = O.useRef(null), c = O.useRef(null), u = O.useRef(null), d = O.useRef(null), f = (
    // The FocusManager and therefore floating element are currently open/
    // rendered.
    !!s && // Guards are only for non-modal focus management.
    !s.modal && // Don't render if unmount is transitioning.
    s.open && o && !!(r || i)
  );
  return O.useEffect(() => {
    if (!i || !o || s != null && s.modal)
      return;
    function h(p) {
      i && Ei(p) && (p.type === "focusin" ? y_ : g_)(i);
    }
    return i.addEventListener("focusin", h, !0), i.addEventListener("focusout", h, !0), () => {
      i.removeEventListener("focusin", h, !0), i.removeEventListener("focusout", h, !0);
    };
  }, [i, o, s == null ? void 0 : s.modal]), /* @__PURE__ */ O.createElement(kb.Provider, {
    value: O.useMemo(() => ({
      preserveTabOrder: o,
      beforeOutsideRef: l,
      afterOutsideRef: c,
      beforeInsideRef: u,
      afterInsideRef: d,
      portalNode: i,
      setFocusManagerState: a
    }), [o, i])
  }, f && i && /* @__PURE__ */ O.createElement(ca, {
    "data-type": "outside",
    ref: l,
    onFocus: (h) => {
      if (Ei(h, i)) {
        var p;
        (p = u.current) == null || p.focus();
      } else {
        const m = Rb() || (s == null ? void 0 : s.refs.domReference.current);
        m == null || m.focus();
      }
    }
  }), f && i && /* @__PURE__ */ O.createElement("span", {
    "aria-owns": i.id,
    style: kd
  }), i && /* @__PURE__ */ cg.createPortal(t, i), f && i && /* @__PURE__ */ O.createElement(ca, {
    "data-type": "outside",
    ref: c,
    onFocus: (h) => {
      if (Ei(h, i)) {
        var p;
        (p = d.current) == null || p.focus();
      } else {
        const m = Pb() || (s == null ? void 0 : s.refs.domReference.current);
        m == null || m.focus(), s != null && s.closeOnFocusOut && (s == null || s.onOpenChange(!1, h.nativeEvent));
      }
    }
  }));
}
const Ob = () => O.useContext(kb), Fp = 20;
let Mr = [];
function Xl(e) {
  Mr = Mr.filter((n) => n.isConnected);
  let t = e;
  if (!(!t || xr(t) === "body")) {
    if (!vI(t, Vo())) {
      const n = Li(t, Vo())[0];
      n && (t = n);
    }
    Mr.push(t), Mr.length > Fp && (Mr = Mr.slice(-Fp));
  }
}
function Lp() {
  return Mr.slice().reverse().find((e) => e.isConnected);
}
const x_ = /* @__PURE__ */ O.forwardRef(function(t, n) {
  return /* @__PURE__ */ O.createElement("button", Lo({}, t, {
    type: "button",
    ref: n,
    tabIndex: -1,
    style: kd
  }));
});
function Qa(e) {
  const {
    context: t,
    children: n,
    disabled: r = !1,
    order: o = ["content"],
    guards: i = !0,
    initialFocus: s = 0,
    returnFocus: a = !0,
    restoreFocus: l = !1,
    modal: c = !0,
    visuallyHiddenDismiss: u = !1,
    closeOnFocusOut: d = !0
  } = e, {
    open: f,
    refs: h,
    nodeId: p,
    onOpenChange: m,
    events: g,
    dataRef: v,
    floatingId: b,
    elements: {
      domReference: y,
      floating: x
    }
  } = t, w = typeof s == "number" && s < 0, T = tb(y) && w, P = h_() ? i : !0, I = At(o), _ = At(s), R = At(a), L = Sr(), M = Ob(), V = O.useRef(null), E = O.useRef(null), k = O.useRef(!1), A = O.useRef(!1), N = O.useRef(-1), H = M != null, Y = x == null ? void 0 : x.firstElementChild, C = (Y == null ? void 0 : Y.id) === b ? Y : x, $ = _t(function(G) {
    return G === void 0 && (G = C), G ? Li(G, Vo()) : [];
  }), X = _t((G) => {
    const D = $(G);
    return I.current.map((j) => y && j === "reference" ? y : C && j === "floating" ? C : D).filter(Boolean).flat();
  });
  O.useEffect(() => {
    if (r || !c) return;
    function G(j) {
      if (j.key === "Tab") {
        mt(C, cn(Pt(C))) && $().length === 0 && !T && It(j);
        const W = X(), U = Vn(j);
        I.current[0] === "reference" && U === y && (It(j), j.shiftKey ? or(W[W.length - 1]) : or(W[1])), I.current[1] === "floating" && U === C && j.shiftKey && (It(j), or(W[0]));
      }
    }
    const D = Pt(C);
    return D.addEventListener("keydown", G), () => {
      D.removeEventListener("keydown", G);
    };
  }, [r, y, C, c, I, T, $, X]), O.useEffect(() => {
    if (r || !x) return;
    function G(D) {
      const j = Vn(D), U = $().indexOf(j);
      U !== -1 && (N.current = U);
    }
    return x.addEventListener("focusin", G), () => {
      x.removeEventListener("focusin", G);
    };
  }, [r, x, $]), O.useEffect(() => {
    if (r || !d) return;
    function G() {
      A.current = !0, setTimeout(() => {
        A.current = !1;
      });
    }
    function D(j) {
      const W = j.relatedTarget;
      queueMicrotask(() => {
        const U = !(mt(y, W) || mt(x, W) || mt(W, x) || mt(M == null ? void 0 : M.portalNode, W) || W != null && W.hasAttribute(mr("focus-guard")) || L && (Ur(L.nodesRef.current, p).find((z) => {
          var te, B;
          return mt((te = z.context) == null ? void 0 : te.elements.floating, W) || mt((B = z.context) == null ? void 0 : B.elements.domReference, W);
        }) || d_(L.nodesRef.current, p).find((z) => {
          var te, B;
          return ((te = z.context) == null ? void 0 : te.elements.floating) === W || ((B = z.context) == null ? void 0 : B.elements.domReference) === W;
        })));
        if (l && U && cn(Pt(C)) === Pt(C).body) {
          gt(C) && (C == null || C.focus());
          const z = N.current, te = $(), B = te[z] || te[te.length - 1] || C;
          gt(B) && B.focus();
        }
        (T || !c) && W && U && !A.current && // Fix React 18 Strict Mode returnFocus due to double rendering.
        W !== Lp() && (k.current = !0, m(!1, j));
      });
    }
    if (x && gt(y))
      return y.addEventListener("focusout", D), y.addEventListener("pointerdown", G), x.addEventListener("focusout", D), () => {
        y.removeEventListener("focusout", D), y.removeEventListener("pointerdown", G), x.removeEventListener("focusout", D);
      };
  }, [r, y, x, C, c, p, L, M, m, d, l, $, T]), O.useEffect(() => {
    var G;
    if (r) return;
    const D = Array.from((M == null || (G = M.portalNode) == null ? void 0 : G.querySelectorAll("[" + mr("portal") + "]")) || []);
    if (x) {
      const j = [x, ...D, V.current, E.current, I.current.includes("reference") || T ? y : null].filter((U) => U != null), W = c || T ? Dp(j, P, !P) : Dp(j);
      return () => {
        W();
      };
    }
  }, [r, y, x, c, I, M, T, P]), Ae(() => {
    if (r || !gt(C)) return;
    const G = Pt(C), D = cn(G);
    queueMicrotask(() => {
      const j = X(C), W = _.current, U = (typeof W == "number" ? j[W] : W.current) || C, z = mt(C, D);
      !w && !z && f && or(U, {
        preventScroll: U === C
      });
    });
  }, [r, f, C, w, X, _]), Ae(() => {
    if (r || !C) return;
    let G = !1;
    const D = Pt(C), j = cn(D);
    let U = v.current.openEvent;
    const z = h.domReference.current;
    Xl(j);
    function te(B) {
      let {
        open: De,
        reason: st,
        event: qe,
        nested: at
      } = B;
      De && (U = qe), st === "escape-key" && h.domReference.current && Xl(h.domReference.current), st === "hover" && qe.type === "mouseleave" && (k.current = !0), st === "outside-press" && (at ? (k.current = !1, G = !0) : k.current = !(Jv(qe) || vd(qe)));
    }
    return g.on("openchange", te), () => {
      g.off("openchange", te);
      const B = cn(D), De = mt(x, B) || L && Ur(L.nodesRef.current, p).some((ue) => {
        var Pe;
        return mt((Pe = ue.context) == null ? void 0 : Pe.elements.floating, B);
      });
      (De || U && ["click", "mousedown"].includes(U.type)) && h.domReference.current && Xl(h.domReference.current);
      const qe = z || j, at = Li(Pt(qe).body, Vo());
      queueMicrotask(() => {
        let ue = Lp();
        !ue && gt(qe) && x && (ue = v_(at, qe, x)), // eslint-disable-next-line react-hooks/exhaustive-deps
        R.current && !k.current && gt(ue) && // If the focus moved somewhere else after mount, avoid returning focus
        // since it likely entered a different element which should be
        // respected: https://github.com/floating-ui/floating-ui/issues/2607
        (!(ue !== B && B !== D.body) || De) && ue.focus({
          preventScroll: G
        });
      });
    };
  }, [r, x, C, R, v, h, g, L, p]), Ae(() => {
    if (!r && M)
      return M.setFocusManagerState({
        modal: c,
        closeOnFocusOut: d,
        open: f,
        onOpenChange: m,
        refs: h
      }), () => {
        M.setFocusManagerState(null);
      };
  }, [r, M, c, f, m, h, d]), Ae(() => {
    if (r || !C || typeof MutationObserver != "function" || w) return;
    const G = () => {
      const j = C.getAttribute("tabindex"), W = $(), U = cn(Pt(x)), z = W.indexOf(U);
      z !== -1 && (N.current = z), I.current.includes("floating") || U !== h.domReference.current && W.length === 0 ? j !== "0" && C.setAttribute("tabindex", "0") : j !== "-1" && C.setAttribute("tabindex", "-1");
    };
    G();
    const D = new MutationObserver(G);
    return D.observe(C, {
      childList: !0,
      subtree: !0,
      attributes: !0
    }), () => {
      D.disconnect();
    };
  }, [r, x, C, h, I, $, w]);
  function re(G) {
    return r || !u || !c ? null : /* @__PURE__ */ O.createElement(x_, {
      ref: G === "start" ? V : E,
      onClick: (D) => m(!1, D.nativeEvent)
    }, typeof u == "string" ? u : "Dismiss");
  }
  const ee = !r && P && (c ? !T : !0) && (H || c);
  return /* @__PURE__ */ O.createElement(O.Fragment, null, ee && /* @__PURE__ */ O.createElement(ca, {
    "data-type": "inside",
    ref: M == null ? void 0 : M.beforeInsideRef,
    onFocus: (G) => {
      if (c) {
        const j = X();
        or(o[0] === "reference" ? j[0] : j[j.length - 1]);
      } else if (M != null && M.preserveTabOrder && M.portalNode)
        if (k.current = !1, Ei(G, M.portalNode)) {
          const j = Pb() || y;
          j == null || j.focus();
        } else {
          var D;
          (D = M.beforeOutsideRef.current) == null || D.focus();
        }
    }
  }), !T && re("start"), n, re("end"), ee && /* @__PURE__ */ O.createElement(ca, {
    "data-type": "inside",
    ref: M == null ? void 0 : M.afterInsideRef,
    onFocus: (G) => {
      if (c)
        or(X()[0]);
      else if (M != null && M.preserveTabOrder && M.portalNode)
        if (d && (k.current = !0), Ei(G, M.portalNode)) {
          const j = Rb() || y;
          j == null || j.focus();
        } else {
          var D;
          (D = M.afterOutsideRef.current) == null || D.focus();
        }
    }
  }));
}
const Ql = /* @__PURE__ */ new Set(), T_ = /* @__PURE__ */ O.forwardRef(function(t, n) {
  const {
    lockScroll: r = !1,
    ...o
  } = t, i = Jo();
  return Ae(() => {
    if (!r) return;
    Ql.add(i);
    const s = /iP(hone|ad|od)|iOS/.test(yd()), a = document.body.style, c = Math.round(document.documentElement.getBoundingClientRect().left) + document.documentElement.scrollLeft ? "paddingLeft" : "paddingRight", u = window.innerWidth - document.documentElement.clientWidth, d = a.left ? parseFloat(a.left) : window.scrollX, f = a.top ? parseFloat(a.top) : window.scrollY;
    if (a.overflow = "hidden", u && (a[c] = u + "px"), s) {
      var h, p;
      const m = ((h = window.visualViewport) == null ? void 0 : h.offsetLeft) || 0, g = ((p = window.visualViewport) == null ? void 0 : p.offsetTop) || 0;
      Object.assign(a, {
        position: "fixed",
        top: -(f - Math.floor(g)) + "px",
        left: -(d - Math.floor(m)) + "px",
        right: "0"
      });
    }
    return () => {
      Ql.delete(i), Ql.size === 0 && (Object.assign(a, {
        overflow: "",
        [c]: ""
      }), s && (Object.assign(a, {
        position: "",
        top: "",
        left: "",
        right: ""
      }), window.scrollTo(d, f)));
    };
  }, [i, r]), /* @__PURE__ */ O.createElement("div", Lo({
    ref: n
  }, o, {
    style: {
      position: "fixed",
      overflow: "auto",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...o.style
    }
  }));
});
function Vp(e) {
  return gt(e.target) && e.target.tagName === "BUTTON";
}
function $p(e) {
  return wd(e);
}
function Od(e, t) {
  t === void 0 && (t = {});
  const {
    open: n,
    onOpenChange: r,
    dataRef: o,
    elements: {
      domReference: i
    }
  } = e, {
    enabled: s = !0,
    event: a = "click",
    toggle: l = !0,
    ignoreMouse: c = !1,
    keyboardHandlers: u = !0
  } = t, d = O.useRef(), f = O.useRef(!1), h = O.useMemo(() => ({
    onPointerDown(p) {
      d.current = p.pointerType;
    },
    onMouseDown(p) {
      const m = d.current;
      p.button === 0 && a !== "click" && (Fi(m, !0) && c || (n && l && (!o.current.openEvent || o.current.openEvent.type === "mousedown") ? r(!1, p.nativeEvent, "click") : (p.preventDefault(), r(!0, p.nativeEvent, "click"))));
    },
    onClick(p) {
      const m = d.current;
      if (a === "mousedown" && d.current) {
        d.current = void 0;
        return;
      }
      Fi(m, !0) && c || (n && l && (!o.current.openEvent || o.current.openEvent.type === "click") ? r(!1, p.nativeEvent, "click") : r(!0, p.nativeEvent, "click"));
    },
    onKeyDown(p) {
      d.current = void 0, !(p.defaultPrevented || !u || Vp(p)) && (p.key === " " && !$p(i) && (p.preventDefault(), f.current = !0), p.key === "Enter" && r(!(n && l), p.nativeEvent, "click"));
    },
    onKeyUp(p) {
      p.defaultPrevented || !u || Vp(p) || $p(i) || p.key === " " && f.current && (f.current = !1, r(!(n && l), p.nativeEvent, "click"));
    }
  }), [o, i, a, c, u, r, n, l]);
  return O.useMemo(() => s ? {
    reference: h
  } : {}, [s, h]);
}
const S_ = {
  pointerdown: "onPointerDown",
  mousedown: "onMouseDown",
  click: "onClick"
}, E_ = {
  pointerdown: "onPointerDownCapture",
  mousedown: "onMouseDownCapture",
  click: "onClickCapture"
}, jp = (e) => {
  var t, n;
  return {
    escapeKey: typeof e == "boolean" ? e : (t = e == null ? void 0 : e.escapeKey) != null ? t : !1,
    outsidePress: typeof e == "boolean" ? e : (n = e == null ? void 0 : e.outsidePress) != null ? n : !0
  };
};
function is(e, t) {
  t === void 0 && (t = {});
  const {
    open: n,
    onOpenChange: r,
    elements: o,
    dataRef: i
  } = e, {
    enabled: s = !0,
    escapeKey: a = !0,
    outsidePress: l = !0,
    outsidePressEvent: c = "pointerdown",
    referencePress: u = !1,
    referencePressEvent: d = "pointerdown",
    ancestorScroll: f = !1,
    bubbles: h,
    capture: p
  } = t, m = Sr(), g = _t(typeof l == "function" ? l : () => !1), v = typeof l == "function" ? g : l, b = O.useRef(!1), y = O.useRef(!1), {
    escapeKey: x,
    outsidePress: w
  } = jp(h), {
    escapeKey: T,
    outsidePress: P
  } = jp(p), I = _t((E) => {
    var k;
    if (!n || !s || !a || E.key !== "Escape")
      return;
    const A = (k = i.current.floatingContext) == null ? void 0 : k.nodeId, N = m ? Ur(m.nodesRef.current, A) : [];
    if (!x && (E.stopPropagation(), N.length > 0)) {
      let H = !0;
      if (N.forEach((Y) => {
        var C;
        if ((C = Y.context) != null && C.open && !Y.context.dataRef.current.__escapeKeyBubbles) {
          H = !1;
          return;
        }
      }), !H)
        return;
    }
    r(!1, HO(E) ? E.nativeEvent : E, "escape-key");
  }), _ = _t((E) => {
    var k;
    const A = () => {
      var N;
      I(E), (N = Vn(E)) == null || N.removeEventListener("keydown", A);
    };
    (k = Vn(E)) == null || k.addEventListener("keydown", A);
  }), R = _t((E) => {
    var k;
    const A = b.current;
    b.current = !1;
    const N = y.current;
    if (y.current = !1, c === "click" && N || A || typeof v == "function" && !v(E))
      return;
    const H = Vn(E), Y = "[" + mr("inert") + "]", C = Pt(o.floating).querySelectorAll(Y);
    let $ = We(H) ? H : null;
    for (; $ && !fr($); ) {
      const G = qn($);
      if (fr(G) || !We(G))
        break;
      $ = G;
    }
    if (C.length && We(H) && !UO(H) && // Clicked on a direct ancestor (e.g. FloatingOverlay).
    !mt(H, o.floating) && // If the target root element contains none of the markers, then the
    // element was injected after the floating element rendered.
    Array.from(C).every((G) => !mt($, G)))
      return;
    if (gt(H) && V) {
      const G = H.clientWidth > 0 && H.scrollWidth > H.clientWidth, D = H.clientHeight > 0 && H.scrollHeight > H.clientHeight;
      let j = D && E.offsetX > H.clientWidth;
      if (D && rn(H).direction === "rtl" && (j = E.offsetX <= H.offsetWidth - H.clientWidth), j || G && E.offsetY > H.clientHeight)
        return;
    }
    const X = (k = i.current.floatingContext) == null ? void 0 : k.nodeId, re = m && Ur(m.nodesRef.current, X).some((G) => {
      var D;
      return Gl(E, (D = G.context) == null ? void 0 : D.elements.floating);
    });
    if (Gl(E, o.floating) || Gl(E, o.domReference) || re)
      return;
    const ee = m ? Ur(m.nodesRef.current, X) : [];
    if (ee.length > 0) {
      let G = !0;
      if (ee.forEach((D) => {
        var j;
        if ((j = D.context) != null && j.open && !D.context.dataRef.current.__outsidePressBubbles) {
          G = !1;
          return;
        }
      }), !G)
        return;
    }
    r(!1, E, "outside-press");
  }), L = _t((E) => {
    var k;
    const A = () => {
      var N;
      R(E), (N = Vn(E)) == null || N.removeEventListener(c, A);
    };
    (k = Vn(E)) == null || k.addEventListener(c, A);
  });
  O.useEffect(() => {
    if (!n || !s)
      return;
    i.current.__escapeKeyBubbles = x, i.current.__outsidePressBubbles = w;
    function E(N) {
      r(!1, N, "ancestor-scroll");
    }
    const k = Pt(o.floating);
    a && k.addEventListener("keydown", T ? _ : I, T), v && k.addEventListener(c, P ? L : R, P);
    let A = [];
    return f && (We(o.domReference) && (A = lr(o.domReference)), We(o.floating) && (A = A.concat(lr(o.floating))), !We(o.reference) && o.reference && o.reference.contextElement && (A = A.concat(lr(o.reference.contextElement)))), A = A.filter((N) => {
      var H;
      return N !== ((H = k.defaultView) == null ? void 0 : H.visualViewport);
    }), A.forEach((N) => {
      N.addEventListener("scroll", E, {
        passive: !0
      });
    }), () => {
      a && k.removeEventListener("keydown", T ? _ : I, T), v && k.removeEventListener(c, P ? L : R, P), A.forEach((N) => {
        N.removeEventListener("scroll", E);
      });
    };
  }, [i, o, a, v, c, n, r, f, s, x, w, I, T, _, R, P, L]), O.useEffect(() => {
    b.current = !1;
  }, [v, c]);
  const M = O.useMemo(() => ({
    onKeyDown: I,
    [S_[d]]: (E) => {
      u && r(!1, E.nativeEvent, "reference-press");
    }
  }), [I, r, u, d]), V = O.useMemo(() => ({
    onKeyDown: I,
    onMouseDown() {
      y.current = !0;
    },
    onMouseUp() {
      y.current = !0;
    },
    [E_[c]]: () => {
      b.current = !0;
    }
  }), [I, c]);
  return O.useMemo(() => s ? {
    reference: M,
    floating: V
  } : {}, [s, M, V]);
}
function C_(e) {
  const {
    open: t = !1,
    onOpenChange: n,
    elements: r
  } = e, o = Jo(), i = O.useRef({}), [s] = O.useState(() => wb()), a = Tr() != null;
  if (process.env.NODE_ENV !== "production") {
    const h = r.reference;
    h && !We(h) && a_("Cannot pass a virtual element to the `elements.reference` option,", "as it must be a real DOM element. Use `refs.setPositionReference()`", "instead.");
  }
  const [l, c] = O.useState(r.reference), u = _t((h, p, m) => {
    i.current.openEvent = h ? p : void 0, s.emit("openchange", {
      open: h,
      event: p,
      reason: m,
      nested: a
    }), n == null || n(h, p, m);
  }), d = O.useMemo(() => ({
    setPositionReference: c
  }), []), f = O.useMemo(() => ({
    reference: l || r.reference || null,
    floating: r.floating || null,
    domReference: r.reference
  }), [l, r.reference, r.floating]);
  return O.useMemo(() => ({
    dataRef: i,
    open: t,
    onOpenChange: u,
    elements: f,
    events: s,
    floatingId: o,
    refs: d
  }), [t, u, f, s, o, d]);
}
function ss(e) {
  e === void 0 && (e = {});
  const {
    nodeId: t
  } = e, n = C_({
    ...e,
    elements: {
      reference: null,
      floating: null,
      ...e.elements
    }
  }), r = e.rootContext || n, o = r.elements, [i, s] = O.useState(null), [a, l] = O.useState(null), u = (o == null ? void 0 : o.reference) || i, d = O.useRef(null), f = Sr();
  Ae(() => {
    u && (d.current = u);
  }, [u]);
  const h = GI({
    ...e,
    elements: {
      ...o,
      ...a && {
        reference: a
      }
    }
  }), p = O.useCallback((y) => {
    const x = We(y) ? {
      getBoundingClientRect: () => y.getBoundingClientRect(),
      contextElement: y
    } : y;
    l(x), h.refs.setReference(x);
  }, [h.refs]), m = O.useCallback((y) => {
    (We(y) || y === null) && (d.current = y, s(y)), (We(h.refs.reference.current) || h.refs.reference.current === null || // Don't allow setting virtual elements using the old technique back to
    // `null` to support `positionReference` + an unstable `reference`
    // callback ref.
    y !== null && !We(y)) && h.refs.setReference(y);
  }, [h.refs]), g = O.useMemo(() => ({
    ...h.refs,
    setReference: m,
    setPositionReference: p,
    domReference: d
  }), [h.refs, m, p]), v = O.useMemo(() => ({
    ...h.elements,
    domReference: u
  }), [h.elements, u]), b = O.useMemo(() => ({
    ...h,
    ...r,
    refs: g,
    elements: v,
    nodeId: t
  }), [h, g, v, t, r]);
  return Ae(() => {
    r.dataRef.current.floatingContext = b;
    const y = f == null ? void 0 : f.nodesRef.current.find((x) => x.id === t);
    y && (y.context = b);
  }), O.useMemo(() => ({
    ...h,
    context: b,
    refs: g,
    elements: v
  }), [h, g, v, b]);
}
function P_(e, t) {
  t === void 0 && (t = {});
  const {
    open: n,
    onOpenChange: r,
    events: o,
    dataRef: i,
    elements: s
  } = e, {
    enabled: a = !0,
    visibleOnly: l = !0
  } = t, c = O.useRef(!1), u = O.useRef(), d = O.useRef(!0);
  O.useEffect(() => {
    if (!a) return;
    const h = qt(s.domReference);
    function p() {
      !n && gt(s.domReference) && s.domReference === cn(Pt(s.domReference)) && (c.current = !0);
    }
    function m() {
      d.current = !0;
    }
    return h.addEventListener("blur", p), h.addEventListener("keydown", m, !0), () => {
      h.removeEventListener("blur", p), h.removeEventListener("keydown", m, !0);
    };
  }, [s.domReference, n, a]), O.useEffect(() => {
    if (!a) return;
    function h(p) {
      let {
        reason: m
      } = p;
      (m === "reference-press" || m === "escape-key") && (c.current = !0);
    }
    return o.on("openchange", h), () => {
      o.off("openchange", h);
    };
  }, [o, a]), O.useEffect(() => () => {
    clearTimeout(u.current);
  }, []);
  const f = O.useMemo(() => ({
    onPointerDown(h) {
      vd(h.nativeEvent) || (d.current = !1);
    },
    onMouseLeave() {
      c.current = !1;
    },
    onFocus(h) {
      if (c.current) return;
      const p = Vn(h.nativeEvent);
      if (l && We(p))
        try {
          if (bd() && eb()) throw Error();
          if (!p.matches(":focus-visible")) return;
        } catch {
          if (!d.current && !wd(p))
            return;
        }
      r(!0, h.nativeEvent, "focus");
    },
    onBlur(h) {
      c.current = !1;
      const p = h.relatedTarget, m = h.nativeEvent, g = We(p) && p.hasAttribute(mr("focus-guard")) && p.getAttribute("data-type") === "outside";
      u.current = window.setTimeout(() => {
        var v;
        const b = cn(s.domReference ? s.domReference.ownerDocument : document);
        !p && b === s.domReference || mt((v = i.current.floatingContext) == null ? void 0 : v.refs.floating.current, b) || mt(s.domReference, b) || g || r(!1, m, "focus");
      });
    }
  }), [i, s.domReference, r, l]);
  return O.useMemo(() => a ? {
    reference: f
  } : {}, [a, f]);
}
const Bp = "active", zp = "selected";
function Jl(e, t, n) {
  const r = /* @__PURE__ */ new Map(), o = n === "item";
  let i = e;
  if (o && e) {
    const {
      [Bp]: s,
      [zp]: a,
      ...l
    } = e;
    i = l;
  }
  return {
    ...n === "floating" && {
      tabIndex: -1
    },
    ...i,
    ...t.map((s) => {
      const a = s ? s[n] : null;
      return typeof a == "function" ? e ? a(e) : null : a;
    }).concat(e).reduce((s, a) => (a && Object.entries(a).forEach((l) => {
      let [c, u] = l;
      if (!(o && [Bp, zp].includes(c)))
        if (c.indexOf("on") === 0) {
          if (r.has(c) || r.set(c, []), typeof u == "function") {
            var d;
            (d = r.get(c)) == null || d.push(u), s[c] = function() {
              for (var f, h = arguments.length, p = new Array(h), m = 0; m < h; m++)
                p[m] = arguments[m];
              return (f = r.get(c)) == null ? void 0 : f.map((g) => g(...p)).find((g) => g !== void 0);
            };
          }
        } else
          s[c] = u;
    }), s), {})
  };
}
function as(e) {
  e === void 0 && (e = []);
  const t = e.map((a) => a == null ? void 0 : a.reference), n = e.map((a) => a == null ? void 0 : a.floating), r = e.map((a) => a == null ? void 0 : a.item), o = O.useCallback(
    (a) => Jl(a, e, "reference"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    t
  ), i = O.useCallback(
    (a) => Jl(a, e, "floating"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    n
  ), s = O.useCallback(
    (a) => Jl(a, e, "item"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    r
  );
  return O.useMemo(() => ({
    getReferenceProps: o,
    getFloatingProps: i,
    getItemProps: s
  }), [o, i, s]);
}
let Wp = !1;
function Ja(e, t, n) {
  switch (e) {
    case "vertical":
      return t;
    case "horizontal":
      return n;
    default:
      return t || n;
  }
}
function Hp(e, t) {
  return Ja(t, e === Rd || e === rs, e === Fo || e === Qo);
}
function ec(e, t, n) {
  return Ja(t, e === rs, n ? e === Fo : e === Qo) || e === "Enter" || e === " " || e === "";
}
function R_(e, t, n) {
  return Ja(t, n ? e === Fo : e === Qo, e === rs);
}
function Up(e, t, n) {
  return Ja(t, n ? e === Qo : e === Fo, e === Rd);
}
function Ib(e, t) {
  const {
    open: n,
    onOpenChange: r,
    elements: o
  } = e, {
    listRef: i,
    activeIndex: s,
    onNavigate: a = () => {
    },
    enabled: l = !0,
    selectedIndex: c = null,
    allowEscape: u = !1,
    loop: d = !1,
    nested: f = !1,
    rtl: h = !1,
    virtual: p = !1,
    focusItemOnOpen: m = "auto",
    focusItemOnHover: g = !0,
    openOnArrowKeyDown: v = !0,
    disabledIndices: b = void 0,
    orientation: y = "vertical",
    cols: x = 1,
    scrollItemIntoView: w = !0,
    virtualItemRef: T,
    itemSizes: P,
    dense: I = !1
  } = t;
  process.env.NODE_ENV !== "production" && (u && (d || Ls("`useListNavigation` looping must be enabled to allow escaping."), p || Ls("`useListNavigation` must be virtual to allow escaping.")), y === "vertical" && x > 1 && Ls("In grid list navigation mode (`cols` > 1), the `orientation` should", 'be either "horizontal" or "both".'));
  const _ = Tr(), R = Sr(), L = _t(a), M = O.useRef(m), V = O.useRef(c ?? -1), E = O.useRef(null), k = O.useRef(!0), A = O.useRef(L), N = O.useRef(!!o.floating), H = O.useRef(n), Y = O.useRef(!1), C = O.useRef(!1), $ = At(b), X = At(n), re = At(w), ee = At(o.floating), G = At(c), [D, j] = O.useState(), [W, U] = O.useState(), z = _t(function(ue, Pe, ce) {
    ce === void 0 && (ce = !1);
    function ke(Oe) {
      p ? (j(Oe.id), R == null || R.events.emit("virtualfocus", Oe), T && (T.current = Oe)) : or(Oe, {
        preventScroll: !0,
        // Mac Safari does not move the virtual cursor unless the focus call
        // is sync. However, for the very first focus call, we need to wait
        // for the position to be ready in order to prevent unwanted
        // scrolling. This means the virtual cursor will not move to the first
        // item when first opening the floating element, but will on
        // subsequent calls. `preventScroll` is supported in modern Safari,
        // so we can use that instead.
        // iOS Safari must be async or the first item will not be focused.
        sync: eb() && bd() ? Wp || Y.current : !1
      });
    }
    const ft = ue.current[Pe.current];
    ft && ke(ft), requestAnimationFrame(() => {
      const Oe = ue.current[Pe.current] || ft;
      if (!Oe) return;
      ft || ke(Oe);
      const xt = re.current;
      xt && B && (ce || !k.current) && (Oe.scrollIntoView == null || Oe.scrollIntoView(typeof xt == "boolean" ? {
        block: "nearest",
        inline: "nearest"
      } : xt));
    });
  });
  Ae(() => {
    document.createElement("div").focus({
      get preventScroll() {
        return Wp = !0, !1;
      }
    });
  }, []), Ae(() => {
    l && (n && o.floating ? M.current && c != null && (C.current = !0, V.current = c, L(c)) : N.current && (V.current = -1, A.current(null)));
  }, [l, n, o.floating, c, L]), Ae(() => {
    if (l && n && o.floating)
      if (s == null) {
        if (Y.current = !1, G.current != null)
          return;
        if (N.current && (V.current = -1, z(i, V)), (!H.current || !N.current) && M.current && (E.current != null || M.current === !0 && E.current == null)) {
          let ue = 0;
          const Pe = () => {
            i.current[0] == null ? (ue < 2 && (ue ? requestAnimationFrame : queueMicrotask)(Pe), ue++) : (V.current = E.current == null || ec(E.current, y, h) || f ? ql(i, $.current) : kp(i, $.current), E.current = null, L(V.current));
          };
          Pe();
        }
      } else Si(i, s) || (V.current = s, z(i, V, C.current), C.current = !1);
  }, [l, n, o.floating, s, G, f, i, y, h, L, z, $]), Ae(() => {
    var ue;
    if (!l || o.floating || !R || p || !N.current)
      return;
    const Pe = R.nodesRef.current, ce = (ue = Pe.find((Oe) => Oe.id === _)) == null || (ue = ue.context) == null ? void 0 : ue.elements.floating, ke = cn(Pt(o.floating)), ft = Pe.some((Oe) => Oe.context && mt(Oe.context.elements.floating, ke));
    ce && !ft && k.current && ce.focus({
      preventScroll: !0
    });
  }, [l, o.floating, R, _, p]), Ae(() => {
    if (!l || !R || !p || _) return;
    function ue(Pe) {
      U(Pe.id), T && (T.current = Pe);
    }
    return R.events.on("virtualfocus", ue), () => {
      R.events.off("virtualfocus", ue);
    };
  }, [l, R, p, _, T]), Ae(() => {
    A.current = L, N.current = !!o.floating;
  }), Ae(() => {
    n || (E.current = null);
  }, [n]), Ae(() => {
    H.current = n;
  }, [n]);
  const te = s != null, B = O.useMemo(() => {
    function ue(ce) {
      if (!n) return;
      const ke = i.current.indexOf(ce);
      ke !== -1 && L(ke);
    }
    return {
      onFocus(ce) {
        let {
          currentTarget: ke
        } = ce;
        ue(ke);
      },
      onClick: (ce) => {
        let {
          currentTarget: ke
        } = ce;
        return ke.focus({
          preventScroll: !0
        });
      },
      // Safari
      ...g && {
        onMouseMove(ce) {
          let {
            currentTarget: ke
          } = ce;
          ue(ke);
        },
        onPointerLeave(ce) {
          let {
            pointerType: ke
          } = ce;
          !k.current || ke === "touch" || (V.current = -1, z(i, V), L(null), p || or(ee.current, {
            preventScroll: !0
          }));
        }
      }
    };
  }, [n, ee, z, g, i, L, p]), De = _t((ue) => {
    if (k.current = !1, Y.current = !0, !X.current && ue.currentTarget === ee.current)
      return;
    if (f && Up(ue.key, y, h)) {
      It(ue), r(!1, ue.nativeEvent, "list-navigation"), gt(o.domReference) && !p && o.domReference.focus();
      return;
    }
    const Pe = V.current, ce = ql(i, b), ke = kp(i, b);
    if (ue.key === "Home" && (It(ue), V.current = ce, L(V.current)), ue.key === "End" && (It(ue), V.current = ke, L(V.current)), x > 1) {
      const ft = P || Array.from({
        length: i.current.length
      }, () => ({
        width: 1,
        height: 1
      })), Oe = QI(ft, x, I), xt = Oe.findIndex((ae) => ae != null && !Fs(i.current, ae, b)), J = Oe.reduce((ae, _e, Ke) => _e != null && !Fs(i.current, _e, b) ? Ke : ae, -1);
      if (V.current = Oe[XI({
        current: Oe.map((ae) => ae != null ? i.current[ae] : null)
      }, {
        event: ue,
        orientation: y,
        loop: d,
        cols: x,
        // treat undefined (empty grid spaces) as disabled indices so we
        // don't end up in them
        disabledIndices: e_([...b || i.current.map((ae, _e) => Fs(i.current, _e) ? _e : void 0), void 0], Oe),
        minIndex: xt,
        maxIndex: J,
        prevIndex: JI(
          V.current > ke ? ce : V.current,
          ft,
          Oe,
          x,
          // use a corner matching the edge closest to the direction
          // we're moving in so we don't end up in the same item. Prefer
          // top/left over bottom/right.
          ue.key === rs ? "bl" : ue.key === Qo ? "tr" : "tl"
        ),
        stopEvent: !0
      })], L(V.current), y === "both")
        return;
    }
    if (Hp(ue.key, y)) {
      if (It(ue), n && !p && cn(ue.currentTarget.ownerDocument) === ue.currentTarget) {
        V.current = ec(ue.key, y, h) ? ce : ke, L(V.current);
        return;
      }
      ec(ue.key, y, h) ? d ? V.current = Pe >= ke ? u && Pe !== i.current.length ? -1 : ce : Vt(i, {
        startingIndex: Pe,
        disabledIndices: b
      }) : V.current = Math.min(ke, Vt(i, {
        startingIndex: Pe,
        disabledIndices: b
      })) : d ? V.current = Pe <= ce ? u && Pe !== -1 ? i.current.length : ke : Vt(i, {
        startingIndex: Pe,
        decrement: !0,
        disabledIndices: b
      }) : V.current = Math.max(ce, Vt(i, {
        startingIndex: Pe,
        decrement: !0,
        disabledIndices: b
      })), Si(i, V.current) ? L(null) : L(V.current);
    }
  }), st = O.useMemo(() => p && n && te && {
    "aria-activedescendant": W || D
  }, [p, n, te, W, D]), qe = O.useMemo(() => ({
    "aria-orientation": y === "both" ? void 0 : y,
    ...!tb(o.domReference) && st,
    onKeyDown: De,
    onPointerMove() {
      k.current = !0;
    }
  }), [st, De, o.domReference, y]), at = O.useMemo(() => {
    function ue(ce) {
      m === "auto" && Jv(ce.nativeEvent) && (M.current = !0);
    }
    function Pe(ce) {
      M.current = m, m === "auto" && vd(ce.nativeEvent) && (M.current = !0);
    }
    return {
      ...st,
      onKeyDown(ce) {
        k.current = !1;
        const ke = ce.key.indexOf("Arrow") === 0, ft = R_(ce.key, y, h), Oe = Up(ce.key, y, h), xt = Hp(ce.key, y), J = (f ? ft : xt) || ce.key === "Enter" || ce.key.trim() === "";
        if (p && n) {
          const kt = R == null ? void 0 : R.nodesRef.current.find((Wt) => Wt.parentId == null), Ft = R && kt ? f_(R.nodesRef.current, kt.id) : null;
          if (ke && Ft && T) {
            const Wt = new KeyboardEvent("keydown", {
              key: ce.key,
              bubbles: !0
            });
            if (ft || Oe) {
              var ae, _e;
              const Rr = ((ae = Ft.context) == null ? void 0 : ae.elements.domReference) === ce.currentTarget, no = Oe && !Rr ? (_e = Ft.context) == null ? void 0 : _e.elements.domReference : ft ? i.current.find((ro) => (ro == null ? void 0 : ro.id) === D) : null;
              no && (It(ce), no.dispatchEvent(Wt), U(void 0));
            }
            if (xt && Ft.context && Ft.context.open && Ft.parentId && ce.currentTarget !== Ft.context.elements.domReference) {
              var Ke;
              It(ce), (Ke = Ft.context.elements.domReference) == null || Ke.dispatchEvent(Wt);
              return;
            }
          }
          return De(ce);
        }
        if (!(!n && !v && ke)) {
          if (J && (E.current = f && xt ? null : ce.key), f) {
            ft && (It(ce), n ? (V.current = ql(i, $.current), L(V.current)) : r(!0, ce.nativeEvent, "list-navigation"));
            return;
          }
          xt && (c != null && (V.current = c), It(ce), !n && v ? r(!0, ce.nativeEvent, "list-navigation") : De(ce), n && L(V.current));
        }
      },
      onFocus() {
        n && !p && L(null);
      },
      onPointerDown: Pe,
      onMouseDown: ue,
      onClick: ue
    };
  }, [D, st, De, $, m, i, f, L, r, n, v, y, h, c, R, p, T]);
  return O.useMemo(() => l ? {
    reference: at,
    floating: qe,
    item: B
  } : {}, [l, at, qe, B]);
}
const k_ = /* @__PURE__ */ new Map([["select", "listbox"], ["combobox", "listbox"], ["label", !1]]);
function ls(e, t) {
  var n;
  t === void 0 && (t = {});
  const {
    open: r,
    floatingId: o
  } = e, {
    enabled: i = !0,
    role: s = "dialog"
  } = t, a = (n = k_.get(s)) != null ? n : s, l = Jo(), u = Tr() != null, d = O.useMemo(() => a === "tooltip" || s === "label" ? {
    ["aria-" + (s === "label" ? "labelledby" : "describedby")]: r ? o : void 0
  } : {
    "aria-expanded": r ? "true" : "false",
    "aria-haspopup": a === "alertdialog" ? "dialog" : a,
    "aria-controls": r ? o : void 0,
    ...a === "listbox" && {
      role: "combobox"
    },
    ...a === "menu" && {
      id: l
    },
    ...a === "menu" && u && {
      role: "menuitem"
    },
    ...s === "select" && {
      "aria-autocomplete": "none"
    },
    ...s === "combobox" && {
      "aria-autocomplete": "list"
    }
  }, [a, o, u, r, l, s]), f = O.useMemo(() => {
    const p = {
      id: o,
      ...a && {
        role: a
      }
    };
    return a === "tooltip" || s === "label" ? p : {
      ...p,
      ...a === "menu" && {
        "aria-labelledby": l
      }
    };
  }, [a, o, l, s]), h = O.useCallback((p) => {
    let {
      active: m,
      selected: g
    } = p;
    const v = {
      role: "option",
      ...m && {
        id: o + "-option"
      }
    };
    switch (s) {
      case "select":
        return {
          ...v,
          "aria-selected": m && g
        };
      case "combobox":
        return {
          ...v,
          ...m && {
            "aria-selected": !0
          }
        };
    }
    return {};
  }, [o, s]);
  return O.useMemo(() => i ? {
    reference: d,
    floating: f,
    item: h
  } : {}, [i, d, f, h]);
}
const Gp = (e) => e.replace(/[A-Z]+(?![a-z])|[A-Z]/g, (t, n) => (n ? "-" : "") + t.toLowerCase());
function co(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function O_(e, t) {
  const [n, r] = O.useState(e);
  return e && !n && r(!0), O.useEffect(() => {
    if (!e && n) {
      const o = setTimeout(() => r(!1), t);
      return () => clearTimeout(o);
    }
  }, [e, n, t]), n;
}
function I_(e, t) {
  t === void 0 && (t = {});
  const {
    open: n,
    elements: {
      floating: r
    }
  } = e, {
    duration: o = 250
  } = t, s = (typeof o == "number" ? o : o.close) || 0, [a, l] = O.useState("unmounted"), c = O_(n, s);
  return !c && a === "close" && l("unmounted"), Ae(() => {
    if (r) {
      if (n) {
        l("initial");
        const u = requestAnimationFrame(() => {
          l("open");
        });
        return () => {
          cancelAnimationFrame(u);
        };
      }
      l("close");
    }
  }, [n, r]), {
    isMounted: c,
    status: a
  };
}
function __(e, t) {
  t === void 0 && (t = {});
  const {
    initial: n = {
      opacity: 0
    },
    open: r,
    close: o,
    common: i,
    duration: s = 250
  } = t, a = e.placement, l = a.split("-")[0], c = O.useMemo(() => ({
    side: l,
    placement: a
  }), [l, a]), u = typeof s == "number", d = (u ? s : s.open) || 0, f = (u ? s : s.close) || 0, [h, p] = O.useState(() => ({
    ...co(i, c),
    ...co(n, c)
  })), {
    isMounted: m,
    status: g
  } = I_(e, {
    duration: s
  }), v = At(n), b = At(r), y = At(o), x = At(i);
  return Ae(() => {
    const w = co(v.current, c), T = co(y.current, c), P = co(x.current, c), I = co(b.current, c) || Object.keys(w).reduce((_, R) => (_[R] = "", _), {});
    if (g === "initial" && p((_) => ({
      transitionProperty: _.transitionProperty,
      ...P,
      ...w
    })), g === "open" && p({
      transitionProperty: Object.keys(I).map(Gp).join(","),
      transitionDuration: d + "ms",
      ...P,
      ...I
    }), g === "close") {
      const _ = T || w;
      p({
        transitionProperty: Object.keys(_).map(Gp).join(","),
        transitionDuration: f + "ms",
        ...P,
        ..._
      });
    }
  }, [f, y, v, b, x, d, g, c]), {
    isMounted: m,
    styles: h
  };
}
function A_(e, t) {
  var n;
  const {
    open: r,
    dataRef: o
  } = e, {
    listRef: i,
    activeIndex: s,
    onMatch: a,
    onTypingChange: l,
    enabled: c = !0,
    findMatch: u = null,
    resetMs: d = 750,
    ignoreKeys: f = [],
    selectedIndex: h = null
  } = t, p = O.useRef(), m = O.useRef(""), g = O.useRef((n = h ?? s) != null ? n : -1), v = O.useRef(null), b = _t(a), y = _t(l), x = At(u), w = At(f);
  Ae(() => {
    r && (clearTimeout(p.current), v.current = null, m.current = "");
  }, [r]), Ae(() => {
    if (r && m.current === "") {
      var R;
      g.current = (R = h ?? s) != null ? R : -1;
    }
  }, [r, h, s]);
  const T = _t((R) => {
    R ? o.current.typing || (o.current.typing = R, y(R)) : o.current.typing && (o.current.typing = R, y(R));
  }), P = _t((R) => {
    function L(A, N, H) {
      const Y = x.current ? x.current(N, H) : N.find((C) => (C == null ? void 0 : C.toLocaleLowerCase().indexOf(H.toLocaleLowerCase())) === 0);
      return Y ? A.indexOf(Y) : -1;
    }
    const M = i.current;
    if (m.current.length > 0 && m.current[0] !== " " && (L(M, M, m.current) === -1 ? T(!1) : R.key === " " && It(R)), M == null || w.current.includes(R.key) || // Character key.
    R.key.length !== 1 || // Modifier key.
    R.ctrlKey || R.metaKey || R.altKey)
      return;
    r && R.key !== " " && (It(R), T(!0)), M.every((A) => {
      var N, H;
      return A ? ((N = A[0]) == null ? void 0 : N.toLocaleLowerCase()) !== ((H = A[1]) == null ? void 0 : H.toLocaleLowerCase()) : !0;
    }) && m.current === R.key && (m.current = "", g.current = v.current), m.current += R.key, clearTimeout(p.current), p.current = setTimeout(() => {
      m.current = "", g.current = v.current, T(!1);
    }, d);
    const E = g.current, k = L(M, [...M.slice((E || 0) + 1), ...M.slice(0, (E || 0) + 1)], m.current);
    k !== -1 ? (b(k), v.current = k) : R.key !== " " && (m.current = "", T(!1));
  }), I = O.useMemo(() => ({
    onKeyDown: P
  }), [P]), _ = O.useMemo(() => ({
    onKeyDown: P,
    onKeyUp(R) {
      R.key === " " && T(!1);
    }
  }), [P, T]);
  return O.useMemo(() => c ? {
    reference: I,
    floating: _
  } : {}, [c, I, _]);
}
function Yp(e, t) {
  const [n, r] = e;
  let o = !1;
  const i = t.length;
  for (let s = 0, a = i - 1; s < i; a = s++) {
    const [l, c] = t[s] || [0, 0], [u, d] = t[a] || [0, 0];
    c >= r != d >= r && n <= (u - l) * (r - c) / (d - c) + l && (o = !o);
  }
  return o;
}
function D_(e, t) {
  return e[0] >= t.x && e[0] <= t.x + t.width && e[1] >= t.y && e[1] <= t.y + t.height;
}
function M_(e) {
  e === void 0 && (e = {});
  const {
    buffer: t = 0.5,
    blockPointerEvents: n = !1,
    requireIntent: r = !0
  } = e;
  let o, i = !1, s = null, a = null, l = performance.now();
  function c(d, f) {
    const h = performance.now(), p = h - l;
    if (s === null || a === null || p === 0)
      return s = d, a = f, l = h, null;
    const m = d - s, g = f - a, b = Math.sqrt(m * m + g * g) / p;
    return s = d, a = f, l = h, b;
  }
  const u = (d) => {
    let {
      x: f,
      y: h,
      placement: p,
      elements: m,
      onClose: g,
      nodeId: v,
      tree: b
    } = d;
    return function(x) {
      function w() {
        clearTimeout(o), g();
      }
      if (clearTimeout(o), !m.domReference || !m.floating || p == null || f == null || h == null)
        return;
      const {
        clientX: T,
        clientY: P
      } = x, I = [T, P], _ = Vn(x), R = x.type === "mouseleave", L = mt(m.floating, _), M = mt(m.domReference, _), V = m.domReference.getBoundingClientRect(), E = m.floating.getBoundingClientRect(), k = p.split("-")[0], A = f > E.right - E.width / 2, N = h > E.bottom - E.height / 2, H = D_(I, V), Y = E.width > V.width, C = E.height > V.height, $ = (Y ? V : E).left, X = (Y ? V : E).right, re = (C ? V : E).top, ee = (C ? V : E).bottom;
      if (L && (i = !0, !R))
        return;
      if (M && (i = !1), M && !R) {
        i = !0;
        return;
      }
      if (R && We(x.relatedTarget) && mt(m.floating, x.relatedTarget) || b && Ur(b.nodesRef.current, v).some((j) => {
        let {
          context: W
        } = j;
        return W == null ? void 0 : W.open;
      }))
        return;
      if (k === "top" && h >= V.bottom - 1 || k === "bottom" && h <= V.top + 1 || k === "left" && f >= V.right - 1 || k === "right" && f <= V.left + 1)
        return w();
      let G = [];
      switch (k) {
        case "top":
          G = [[$, V.top + 1], [$, E.bottom - 1], [X, E.bottom - 1], [X, V.top + 1]];
          break;
        case "bottom":
          G = [[$, E.top + 1], [$, V.bottom - 1], [X, V.bottom - 1], [X, E.top + 1]];
          break;
        case "left":
          G = [[E.right - 1, ee], [E.right - 1, re], [V.left + 1, re], [V.left + 1, ee]];
          break;
        case "right":
          G = [[V.right - 1, ee], [V.right - 1, re], [E.left + 1, re], [E.left + 1, ee]];
          break;
      }
      function D(j) {
        let [W, U] = j;
        switch (k) {
          case "top": {
            const z = [Y ? W + t / 2 : A ? W + t * 4 : W - t * 4, U + t + 1], te = [Y ? W - t / 2 : A ? W + t * 4 : W - t * 4, U + t + 1], B = [[E.left, A || Y ? E.bottom - t : E.top], [E.right, A ? Y ? E.bottom - t : E.top : E.bottom - t]];
            return [z, te, ...B];
          }
          case "bottom": {
            const z = [Y ? W + t / 2 : A ? W + t * 4 : W - t * 4, U - t], te = [Y ? W - t / 2 : A ? W + t * 4 : W - t * 4, U - t], B = [[E.left, A || Y ? E.top + t : E.bottom], [E.right, A ? Y ? E.top + t : E.bottom : E.top + t]];
            return [z, te, ...B];
          }
          case "left": {
            const z = [W + t + 1, C ? U + t / 2 : N ? U + t * 4 : U - t * 4], te = [W + t + 1, C ? U - t / 2 : N ? U + t * 4 : U - t * 4];
            return [...[[N || C ? E.right - t : E.left, E.top], [N ? C ? E.right - t : E.left : E.right - t, E.bottom]], z, te];
          }
          case "right": {
            const z = [W - t, C ? U + t / 2 : N ? U + t * 4 : U - t * 4], te = [W - t, C ? U - t / 2 : N ? U + t * 4 : U - t * 4], B = [[N || C ? E.left + t : E.right, E.top], [N ? C ? E.left + t : E.right : E.left + t, E.bottom]];
            return [z, te, ...B];
          }
        }
      }
      if (!Yp([T, P], G)) {
        if (i && !H)
          return w();
        if (!R && r) {
          const j = c(x.clientX, x.clientY);
          if (j !== null && j < 0.1)
            return w();
        }
        Yp([T, P], D([f, h])) ? !i && r && (o = window.setTimeout(w, 40)) : w();
      }
    };
  };
  return u.__options = {
    blockPointerEvents: n
  }, u;
}
const N_ = ({ children: e, as: t, title: n, ...r }) => {
  const [o, i] = Me(!1), s = ye(null), a = t || "span", { refs: l, floatingStyles: c, context: u } = ss({
    open: o,
    onOpenChange: i,
    whileElementsMounted: Za,
    transform: !0,
    middleware: [
      Xa(5),
      Pd({ fallbackAxisSideDirection: "start" }),
      Cd(),
      pb({
        element: s,
        padding: 5
      })
    ]
  }), d = Sb(u, { move: !0 }), f = P_(u), h = is(u), p = ls(u, { role: "tooltip" }), { getReferenceProps: m, getFloatingProps: g } = as([d, f, h, p]);
  return /* @__PURE__ */ Z(it, { children: [
    /* @__PURE__ */ S(a, { ref: l.setReference, ...m(r), children: n }),
    /* @__PURE__ */ S(os, { children: o && /* @__PURE__ */ Z(
      Xi,
      {
        ...g(),
        ref: l.setFloating,
        style: c,
        className: "bg-tooltip-background z-tooltip text-tooltip-foreground border border-tooltip-border p-3 rounded-lg",
        children: [
          /* @__PURE__ */ S(bb, { ref: s, context: u, strokeWidth: 0.1, className: "fill-tooltip-background stroke-tooltip-border" }),
          e
        ]
      }
    ) })
  ] });
}, F_ = ({ reportStatus: e, hideLeft: t = !1, className: n, info: r, children: o, title: i }) => /* @__PURE__ */ Z("div", { className: bt("w-full justify-between", t && o === null ? "hidden" : "flex", n), children: [
  t ? null : /* @__PURE__ */ Z("span", { className: "flex items-center gap-1 group-hover:text-primary group-focus-within:text-primary transition-colors group-error:text-danger", children: [
    i,
    e || r ? /* @__PURE__ */ Z("span", { className: "flex gap-1 items-center justify-center", children: [
      r ? /* @__PURE__ */ S(
        N_,
        {
          title: /* @__PURE__ */ Z("span", { children: [
            /* @__PURE__ */ S("span", { className: "sr-only", children: r }),
            /* @__PURE__ */ S(
              $P,
              {
                className: "aspect-square size-3",
                "aria-hidden": "true",
                size: 16,
                strokeWidth: 1,
                absoluteStrokeWidth: !0
              }
            )
          ] }),
          children: r
        }
      ) : null,
      e ? /* @__PURE__ */ Z(it, { children: [
        /* @__PURE__ */ S(
          bv,
          {
            className: "hidden aspect-square size-3 opacity-0 transition-opacity group-assert:block group-assert:text-success group-assert:opacity-100",
            "aria-hidden": "true",
            size: 16,
            strokeWidth: 1,
            absoluteStrokeWidth: !0
          }
        ),
        /* @__PURE__ */ S(
          FP,
          {
            className: "hidden aspect-square size-3 opacity-0 transition-opacity group-error:block group-error:opacity-100",
            "aria-hidden": "true",
            size: 16,
            strokeWidth: 1,
            absoluteStrokeWidth: !0
          }
        )
      ] }) : null
    ] }) : null
  ] }),
  o
] }), Id = ({
  optionalText: e,
  left: t,
  rightLabel: n,
  container: r,
  feedback: o,
  interactive: i,
  right: s,
  info: a,
  children: l,
  error: c,
  form: u,
  id: d,
  labelClassName: f = "",
  name: h,
  title: p,
  placeholder: m,
  hideLeft: g,
  required: v
}) => {
  const b = d ?? h, y = yn(), x = e ?? y.inputOptionalLabel;
  return /* @__PURE__ */ Z("fieldset", { form: u, "data-error": !!c, "data-interactive": !!i, className: bt("group inline-flex gap-1.5 w-full", r), children: [
    /* @__PURE__ */ Z(
      "label",
      {
        form: u,
        htmlFor: b,
        className: "inline-flex w-full cursor-text flex-row flex-wrap justify-between gap-1 text-sm transition-colors empty:hidden group-error:text-danger group-hover:border-primary",
        children: [
          !g && !n ? /* @__PURE__ */ S(F_, { info: a, hideLeft: g, reportStatus: !0, title: p, placeholder: m, children: x || n ? /* @__PURE__ */ Z(it, { children: [
            v ? null : /* @__PURE__ */ S("span", { className: "text-opacity-70", children: x }),
            n ? /* @__PURE__ */ S(it, { children: n }) : null
          ] }) : null }) : null,
          /* @__PURE__ */ Z(
            "div",
            {
              className: `relative group flex w-full flex-row flex-nowrap items-center gap-x-2 gap-y-1 rounded-md border border-input-border bg-transparent transition-colors group-focus-within:border-primary group-hover:border-primary group-error:border-danger ${f}
                    focus:ring-2 focus:ring-inset focus:ring-primary
                    `,
              children: [
                t ? /* @__PURE__ */ S("span", { className: "absolute left-0 flex flex-nowrap gap-1 whitespace-nowrap pl-2", children: t }) : null,
                l,
                s ? /* @__PURE__ */ S("span", { className: "absolute right-0 flex flex-nowrap gap-2 whitespace-nowrap pr-1", children: s }) : null
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ S("p", { className: "group-error:block empty:hidden group-error:text-danger hidden text-xs group-has-[input:not(:focus):invalid[data-initialized=true]]:block", children: c }),
    /* @__PURE__ */ S("p", { className: "text-xs group-assert:block group-error:hidden empty:mt-0 empty:hidden group-has-[input:not(:focus):valid[data-initialized=true]]:block", children: o })
  ] });
}, Kr = ut(
  ({
    required: e = !0,
    options: t,
    info: n,
    selectContainer: r = "",
    feedback: o = null,
    labelClassName: i,
    interactive: s,
    rightLabel: a,
    optionalText: l,
    container: c,
    hideLeft: u = !1,
    right: d,
    left: f,
    error: h,
    ...p
  }, m) => {
    const g = yn(), v = ye(null), b = p.id ?? p.name;
    Gr(m, () => v.current), xe(() => {
      if (v.current === null) return;
      const x = v.current, w = () => x.setAttribute("data-initialized", "true"), T = () => x.setAttribute("data-selected", "true");
      return x.addEventListener("focus", w), x.addEventListener("change", T), () => {
        x.removeEventListener("focus", w), x.removeEventListener("change", T);
      };
    }, []);
    const y = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.focus();
    };
    return /* @__PURE__ */ S(
      Id,
      {
        container: bt("group inline-block w-full", c),
        error: h,
        feedback: o,
        hideLeft: u,
        left: f,
        info: n,
        optionalText: l,
        rightLabel: a,
        interactive: s,
        form: p.form,
        id: p.name || p.id,
        name: p.name,
        labelClassName: i,
        title: p.title,
        placeholder: p.placeholder,
        required: e,
        right: /* @__PURE__ */ S("label", { htmlFor: b, children: /* @__PURE__ */ Z("button", { onClick: y, type: "button", className: "mt-2 transition-colors hover:text-primary", children: [
          /* @__PURE__ */ S(vv, { size: 20 }),
          /* @__PURE__ */ S("span", { className: "sr-only", children: g.inputCaretDown })
        ] }) }),
        children: /* @__PURE__ */ Z(
          "select",
          {
            ...p,
            ref: Lg(m, v),
            id: b,
            name: b,
            value: p.value,
            required: e,
            "data-selected": !!p.value || !1,
            defaultValue: p.value ? void 0 : "",
            className: bt(
              "input select group h-11 w-full flex-1 rounded-md bg-transparent p-2 text-foreground placeholder-input-placeholder outline-none transition-colors group-error:text-danger group-error:placeholder-input-mask-error",
              "data-[selected=false]:text-input-placeholder",
              p.className
            ),
            children: [
              /* @__PURE__ */ S("option", { value: "", disabled: !0, hidden: !0, children: p.placeholder }),
              t.map((x) => /* @__PURE__ */ S("option", { ...x, children: x.label ?? x.value }, `${b}-select-option-${x.value}`))
            ]
          }
        )
      }
    );
  }
), _b = gn(""), pL = (e) => {
  const [t, n] = jO(e.active), r = _o(0), o = _o(0), i = ye(null), s = e.useHash ? "a" : "button";
  xe(() => {
    const c = i.current;
    if (c === null) return;
    const u = (p) => {
      if (!p) return;
      const m = p.getBoundingClientRect();
      o.set(m.width), r.set(p.offsetLeft);
    }, d = () => {
      const p = c.querySelector("li[data-active=true]");
      return void u(p);
    };
    window.addEventListener("resize", d);
    let f = c.querySelector("li[data-active=true]");
    const h = window.location.hash.replace(/^#/, "");
    if (e.active === "" && h !== "" && (f = c.querySelector(`li[data-id=${h}]`), n(h)), f === null) {
      f = c.querySelector("li[data-id]");
      const p = f.getAttribute("data-id") || "";
      n(p);
    }
    return u(f), () => window.removeEventListener("resize", d);
  }, []), xe(() => {
    e.onChange && e.onChange(t);
  }, [e.onChange, t]);
  const a = F.Children.toArray(e.children), l = (c) => {
    const u = c.currentTarget, d = u.getBoundingClientRect();
    o.set(d.width), r.set(u.offsetLeft), n(u.dataset.id || "");
  };
  return /* @__PURE__ */ S(_b.Provider, { value: t, children: /* @__PURE__ */ S(
    $O,
    {
      className: e.className,
      container: "pt-0",
      header: /* @__PURE__ */ Z("header", { ref: i, className: "border-b border-card-border relative mb-2", children: [
        /* @__PURE__ */ S(
          Qt.div,
          {
            layout: !0,
            initial: !1,
            "aria-hidden": "true",
            style: { left: r, width: o },
            transition: { type: "tween", left: r, width: o },
            className: "w-28 h-0.5 bg-primary absolute bottom-0 duration-300 transition-all hidden lg:block"
          }
        ),
        /* @__PURE__ */ Z("nav", { children: [
          /* @__PURE__ */ S(
            Kr,
            {
              onChange: (c) => n(c.target.value),
              value: t,
              hideLeft: !0,
              container: "container rounded mt-4 lg:mt-0 min-w-full lg:hidden inline-flex px-6 w-full mx-auto",
              labelClassName: "border-transparent rounded-none",
              rightLabel: null,
              options: a.map((c) => {
                const u = c.props;
                return { value: u.id, label: u.label ?? u.title };
              })
            }
          ),
          /* @__PURE__ */ S("ul", { className: "hidden lg:flex divide-x divide-card-border overflow-x-auto justify-between md:justify-start", children: a.map((c) => {
            const u = c.props;
            return /* @__PURE__ */ S(
              "li",
              {
                "data-id": u.id,
                "data-active": t === u.id,
                className: "data-[active=true]:text-primary w-full md:w-auto",
                children: /* @__PURE__ */ S(
                  s,
                  {
                    "data-id": u.id,
                    onClick: l,
                    "aria-current": "page",
                    className: "px-10 py-4 block font-medium w-full whitespace-nowrap",
                    href: e.useHash ? `#${u.id}` : void 0,
                    children: u.title
                  }
                )
              },
              `tab-header-${u.id}`
            );
          }) })
        ] })
      ] }),
      children: e.children
    }
  ) });
}, L_ = () => Qe(_b), mL = (e) => {
  const t = L_();
  return /* @__PURE__ */ S(it, { children: e.id === t ? e.children : null });
}, cs = (e) => {
  const t = Yn(), [n, r] = Me(e.open), o = ye(null), i = Ue(
    () => [
      Xa(10),
      Pd({ fallbackAxisSideDirection: "end" }),
      Cd(),
      pb({
        padding: 5,
        element: o
      })
    ],
    [e.arrow]
  ), { refs: s, floatingStyles: a, context: l } = ss({
    open: n,
    middleware: i,
    transform: !0,
    whileElementsMounted: Za,
    onOpenChange: (p, m) => {
      var v;
      const g = m == null ? void 0 : m.relatedTarget;
      g && g.dataset.floating === "true" && !p || (r(p), (v = e.onChange) == null || v.call(e, p));
    }
  }), c = Od(l), u = is(l), d = ls(l), { getReferenceProps: f, getFloatingProps: h } = as([c, u, d]);
  return /* @__PURE__ */ Z(it, { children: [
    /* @__PURE__ */ S("button", { ref: s.setReference, ...f(e.buttonProps), type: "button", children: e.trigger }),
    n && /* @__PURE__ */ S(os, { id: `${t}-portal`, children: /* @__PURE__ */ S(
      Qa,
      {
        restoreFocus: e.restoreFocus ?? !0,
        returnFocus: e.restoreFocus ?? !0,
        visuallyHiddenDismiss: !0,
        context: l,
        modal: !1,
        children: /* @__PURE__ */ Z(
          "div",
          {
            className: "bg-floating-background relative min-w-96 isolate z-floating border shadow-2xl p-6 border-floating-border rounded-lg",
            ref: s.setFloating,
            style: a,
            "aria-labelledby": t,
            ...h(),
            children: [
              /* @__PURE__ */ S(
                bb,
                {
                  ref: o,
                  context: l,
                  strokeWidth: 0.1,
                  className: "fill-floating-background stroke-floating-border"
                }
              ),
              /* @__PURE__ */ S("header", { className: "mb-2", children: /* @__PURE__ */ S("h3", { className: "leading-snug font-medium text-2xl tracking-wide text-left", children: e.title }) }),
              e.children
            ]
          }
        )
      }
    ) })
  ] });
};
function V_(e, t) {
  typeof e == "function" ? e(t) : e != null && (e.current = t);
}
function $_(...e) {
  return (t) => e.forEach((n) => V_(n, t));
}
var Ab = O.forwardRef((e, t) => {
  const { children: n, ...r } = e, o = O.Children.toArray(n), i = o.find(B_);
  if (i) {
    const s = i.props.children, a = o.map((l) => l === i ? O.Children.count(s) > 1 ? O.Children.only(null) : O.isValidElement(s) ? s.props.children : null : l);
    return /* @__PURE__ */ S(tu, { ...r, ref: t, children: O.isValidElement(s) ? O.cloneElement(s, void 0, a) : null });
  }
  return /* @__PURE__ */ S(tu, { ...r, ref: t, children: n });
});
Ab.displayName = "Slot";
var tu = O.forwardRef((e, t) => {
  const { children: n, ...r } = e;
  if (O.isValidElement(n)) {
    const o = W_(n);
    return O.cloneElement(n, {
      ...z_(r, n.props),
      // @ts-ignore
      ref: t ? $_(t, o) : o
    });
  }
  return O.Children.count(n) > 1 ? O.Children.only(null) : null;
});
tu.displayName = "SlotClone";
var j_ = ({ children: e }) => /* @__PURE__ */ S(xc, { children: e });
function B_(e) {
  return O.isValidElement(e) && e.type === j_;
}
function z_(e, t) {
  const n = { ...t };
  for (const r in t) {
    const o = e[r], i = t[r];
    /^on[A-Z]/.test(r) ? o && i ? n[r] = (...a) => {
      i(...a), o(...a);
    } : o && (n[r] = o) : r === "style" ? n[r] = { ...o, ...i } : r === "className" && (n[r] = [o, i].filter(Boolean).join(" "));
  }
  return { ...e, ...n };
}
function W_(e) {
  var r, o;
  let t = (r = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
const _d = () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
  let t = Math.random() * 16 | 0;
  return (e == "x" ? t : t & 3 | 8).toString(16);
}), qp = (e, t, n) => e.split(t).filter(Boolean).reduce((r, o) => r != null ? r[o] : r, n), Kp = { basic: /[,[\]]+?/, extend: /[,[\].]+?/ }, H_ = (e, t) => {
  const n = qp(t, Kp.basic, e) || qp(t, Kp.extend, e);
  return n === void 0 || n === e ? void 0 : n;
}, nu = () => typeof window > "u", Zp = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), U_ = (e, t) => nu() ? t : window.matchMedia(e).matches, G_ = (e, t = !0) => {
  const [n, r] = Me(t);
  return Da(() => {
    const o = window.matchMedia(e), i = () => r(U_(e, t));
    return i(), o.addListener ? (o.addListener(i), () => o.removeListener ? o.removeListener(i) : void 0) : (o.addEventListener("change", i), () => o.removeEventListener("change", i));
  }, [e]), n;
}, Ln = "600ms", Db = (e) => ({
  initial: { [e]: "-60%", opacity: 0.8, animationDuration: Ln },
  enter: { [e]: 0, opacity: 1, animationDuration: Ln },
  exit: { [e]: ["-50%", "-90%"], opacity: 0, animationDuration: Ln }
}), Y_ = Db("left"), q_ = Db("right"), Xp = {
  drawer: (e) => e === "left" ? Y_ : q_,
  sheet: {
    initial: { opacity: 0.5, scaleY: 0.5, animationDuration: Ln, originY: "bottom" },
    enter: { opacity: 1, scaleY: 1, animationDuration: Ln, originY: "bottom" },
    exit: { opacity: 0.1, scaleY: 0.5, animationDuration: Ln, originY: "bottom" }
  },
  dialog: {
    initial: { opacity: 0, scale: 0.95, animationDuration: Ln },
    enter: { opacity: 1, scale: [1.05, 1], animationDuration: Ln },
    exit: { opacity: 0, scale: 0.97, animationDuration: Ln }
  }
}, K_ = Ma("isolate ring-0 outline-0 appearance-none flex flex-col gap-4 flex-nowrap min-w-xs bg-floating-background", {
  variants: {
    type: {
      drawer: "max-h-screen max-w-[90%] w-auto h-screen min-h-0",
      dialog: "max-h-[calc(100lvh-10%)] container h-min rounded-lg py-8",
      sheet: "w-full absolute bottom-0 max-h-[85vh] max-h-[85svh] pt-6 pb-4 rounded-t-lg"
    },
    position: {
      none: "",
      right: "py-4 absolute right-0 top-0 rounded-l-lg",
      left: "py-4 absolute left-0 top-0 rounded-r-lg"
    }
  },
  defaultVariants: { position: "right", type: "dialog" }
}), Z_ = { top: 0, left: 0, right: 0, bottom: -1 }, X_ = (e) => e * 0.62, Q_ = (e) => {
  const t = (n, r) => {
    if (e.parent.current) {
      if (!e.sheet) {
        const c = e.parent.current, u = e.value.get() || c.getBoundingClientRect().width, d = e.position === "right" ? -r.delta.x : r.delta.x;
        return e.value.set(Math.abs(u + d));
      }
      const i = e.parent.current.getBoundingClientRect(), s = e.value.get() || i.height, a = Math.abs(s - r.delta.y), l = X_(window.outerHeight);
      return a < l ? (e.onChange(!1), setTimeout(() => e.value.set(window.outerHeight), 350)) : e.value.set(a);
    }
  };
  return /* @__PURE__ */ S(
    Qt.div,
    {
      draggable: !0,
      dragMomentum: !0,
      dragListener: !0,
      dragPropagation: !0,
      onDrag: t,
      animate: !1,
      initial: !1,
      dragElastic: 0,
      dragDirectionLock: !0,
      dragSnapToOrigin: !0,
      drag: e.sheet ? "y" : "x",
      dragConstraints: Z_,
      whileDrag: { cursor: "grabbing" },
      className: bt(
        "absolute rounded-lg",
        e.sheet ? "cursor-row-resize" : "bg-floating-border cursor-col-resize",
        e.sheet ? "w-full py-2 top-1 h-3 flex justify-center" : e.position === "left" ? "top-1/2 right-5 h-10 w-2" : "top-1/2 left-2 h-10 w-2"
      ),
      children: e.sheet ? /* @__PURE__ */ S("div", { className: "bg-floating-border rounded-lg w-1/4 h-2" }) : null
    }
  );
}, Qp = { drawer: "right", sheet: "none", dialog: "none" }, gL = ({ type: e = "dialog", resizer: t = !0, ...n }) => {
  const r = Yn(), o = Yn(), i = G_("(min-width: 48rem)"), s = e === "drawer" || !i, a = i ? e === "drawer" ? n.position : Qp[e] : Qp.sheet, l = i ? Xp[e] : Xp.sheet, c = typeof l == "function" ? l(a) : l, u = i ? e : "sheet", { refs: d, context: f } = ss({ open: n.open, onOpenChange: n.onChange }), h = Od(f), p = ls(f), m = is(f, { escapeKey: !0, referencePress: !0, outsidePress: !1 }), { getReferenceProps: g, getFloatingProps: v } = as([h, p, m]), b = n.trigger, y = _o(void 0);
  return /* @__PURE__ */ Z(it, { children: [
    n.trigger ? /* @__PURE__ */ S(it, { children: n.asChild ? /* @__PURE__ */ S(Ab, { ref: d.setReference, ...g(), children: b }) : /* @__PURE__ */ S("button", { ref: d.setReference, ...g(), type: "button", children: b }) }) : null,
    /* @__PURE__ */ S(os, { children: /* @__PURE__ */ S(Ua, { presenceAffectsLayout: !0, children: n.open && /* @__PURE__ */ S(
      T_,
      {
        lockScroll: !0,
        className: `relative !overflow-clip h-[100dvh] z-floating bg-floating-overlay/70 ${u === "drawer" ? "" : "grid justify-center p-8"}`,
        children: /* @__PURE__ */ S(Qa, { modal: !0, closeOnFocusOut: !0, context: f, children: /* @__PURE__ */ Z(
          Qt.div,
          {
            animate: "enter",
            "aria-describedby": o,
            "aria-labelledby": r,
            className: K_({ position: a, type: u }),
            exit: "exit",
            initial: "initial",
            ref: d.setFloating,
            variants: c,
            style: i ? { width: y } : { height: y },
            ...v(),
            children: [
              s && t ? /* @__PURE__ */ S(
                Q_,
                {
                  onChange: n.onChange,
                  sheet: !i,
                  value: y,
                  parent: d.floating,
                  position: a
                }
              ) : null,
              n.title || n.closable ? /* @__PURE__ */ Z("header", { className: "w-full relative", children: [
                n.title ? /* @__PURE__ */ S("h2", { className: "px-8 pb-4 border-b border-floating-border text-3xl font-medium leading-relaxed", children: n.title }) : null,
                n.closable !== !1 ? /* @__PURE__ */ S("nav", { className: "absolute -top-2.5 lg:-top-1 right-4 lg:right-8", children: /* @__PURE__ */ S(
                  "button",
                  {
                    type: "button",
                    onClick: () => n.onChange(!1),
                    className: "p-1 transition-colors opacity-70 hover:opacity-100 hover:text-danger focus:text-danger",
                    children: /* @__PURE__ */ S(wv, {})
                  }
                ) }) : null
              ] }) : null,
              /* @__PURE__ */ S("section", { className: "flex-1 px-8 overflow-y-auto", children: n.children }),
              n.footer ? /* @__PURE__ */ S("footer", { className: "px-8 border-t border-floating-border pt-4 w-full", children: n.footer }) : null
            ]
          }
        ) })
      }
    ) }) })
  ] });
};
class ua {
  static getDescendantProperty(t, n, r = []) {
    let o, i, s, a, l, c;
    if (n) {
      if (s = n.indexOf("."), s === -1 ? o = n : (o = n.slice(0, s), i = n.slice(s + 1)), a = t[o], a !== null && typeof a < "u")
        if (!i && (typeof a == "string" || typeof a == "number"))
          r.push(a);
        else if (Object.prototype.toString.call(a) === "[object Array]")
          for (l = 0, c = a.length; l < c; l++)
            ua.getDescendantProperty(a[l], i, r);
        else i && ua.getDescendantProperty(a, i, r);
    } else
      r.push(t);
    return r;
  }
}
class vo {
  constructor(t = [], n = [], r = {}) {
    Array.isArray(n) || (r = n, n = []), this.haystack = t, this.keys = n, this.options = Object.assign({
      caseSensitive: !1,
      sort: !1
    }, r);
  }
  search(t = "") {
    if (t === "")
      return this.haystack;
    const n = [];
    for (let r = 0; r < this.haystack.length; r++) {
      const o = this.haystack[r];
      if (this.keys.length === 0) {
        const i = vo.isMatch(o, t, this.options.caseSensitive);
        i && n.push({ item: o, score: i });
      } else
        for (let i = 0; i < this.keys.length; i++) {
          const s = ua.getDescendantProperty(o, this.keys[i]);
          let a = !1;
          for (let l = 0; l < s.length; l++) {
            const c = vo.isMatch(s[l], t, this.options.caseSensitive);
            if (c) {
              a = !0, n.push({ item: o, score: c });
              break;
            }
          }
          if (a)
            break;
        }
    }
    return this.options.sort && n.sort((r, o) => r.score - o.score), n.map((r) => r.item);
  }
  static isMatch(t, n, r) {
    t = String(t), n = String(n), r || (t = t.toLocaleLowerCase(), n = n.toLocaleLowerCase());
    const o = vo.nearestIndexesFor(t, n);
    return o ? t === n ? 1 : o.length > 1 ? 2 + (o[o.length - 1] - o[0]) : 2 + o[0] : !1;
  }
  static nearestIndexesFor(t, n) {
    const r = n.split("");
    let o = [];
    return vo.indexesOfFirstLetter(t, n).forEach((s, a) => {
      let l = s + 1;
      o[a] = [s];
      for (let c = 1; c < r.length; c++) {
        const u = r[c];
        if (l = t.indexOf(u, l), l === -1) {
          o[a] = !1;
          break;
        }
        o[a].push(l), l++;
      }
    }), o = o.filter((s) => s !== !1), o.length ? o.sort((s, a) => s.length === 1 ? s[0] - a[0] : (s = s[s.length - 1] - s[0], a = a[a.length - 1] - a[0], s - a))[0] : !1;
  }
  static indexesOfFirstLetter(t, n) {
    const r = n[0];
    return t.split("").map((o, i) => o !== r ? !1 : i).filter((o) => o !== !1);
  }
}
const J_ = (e) => {
  const t = ye();
  return xe(() => {
    t.current = e;
  }, [e]), t.current;
}, eA = ut(({ selected: e, active: t, onClick: n, option: r, ...o }, i) => /* @__PURE__ */ S("li", { ...o, ref: i, role: "option", "aria-selected": e, className: "w-full border-b border-tooltip-border last:border-transparent", children: /* @__PURE__ */ S(
  "button",
  {
    type: "button",
    onClick: n,
    "aria-selected": e,
    className: `w-full cursor-pointer p-2 text-left ${e ? "bg-primary text-primary-foreground" : ""} ${t ? "bg-primary-subtle text-primary-foreground" : ""}`,
    children: r.label ?? r.value
  }
) })), tA = {
  duration: 300,
  initial: { transform: "scaleY(0)", opacity: 0.4 },
  open: { transform: "scaleY(1)", opacity: 1 },
  close: { transform: "scaleY(0)", opacity: 0 }
}, nA = { caseSensitive: !1, sort: !1 }, rA = [], yL = ut(
  ({
    options: e,
    dynamicOption: t = !1,
    feedback: n = null,
    labelClassName: r,
    interactive: o,
    rightLabel: i,
    optionalText: s,
    container: a,
    hideLeft: l = !1,
    right: c,
    left: u,
    error: d,
    required: f = !1,
    ...h
  }, p) => {
    const m = yn(), g = ye(null), [v, b] = Me(!1), [y, x] = Me(""), [w, T] = Me(h.value ?? h.defaultValue ?? ""), [P, I] = Me(h.value ?? h.defaultValue ?? ""), [_, R] = Me(null), L = ye(rA), M = J_(_), V = t && y !== "" ? [{ value: y, label: y, "data-dynamic": "true" }, ...e] : e, E = new vo(V, ["value", "label"], nA).search(y);
    Gr(p, () => g.current);
    const k = t ? void 0 : `^(${e.map((z) => `${Zp(z.value)}${z.label ? "|" + Zp(z.label) : ""}`).join("|")})$`;
    xe(() => {
      if (h.value) {
        T(h.value);
        const z = e.find((te) => te.value === h.value);
        T((z == null ? void 0 : z.label) ?? h.value);
      }
    }, [h.value]);
    const { x: A, y: N, strategy: H, refs: Y, context: C } = ss({
      open: v,
      transform: !0,
      onOpenChange: b,
      whileElementsMounted: Za,
      middleware: [
        Xa(4),
        qI({
          padding: 10,
          apply(z) {
            Object.assign(z.elements.floating.style, {
              width: `${z.rects.reference.width}px`,
              maxHeight: `${Math.min(480, z.availableHeight)}px`
            });
          }
        })
      ]
    });
    Gr(p, () => {
      var z;
      return (z = Y.domReference) == null ? void 0 : z.current;
    }, [Y]);
    const $ = __(C, tA), { getReferenceProps: X, getFloatingProps: re, getItemProps: ee } = as([
      ls(C, { role: "listbox" }),
      is(C),
      Ib(C, {
        listRef: L,
        loop: !0,
        activeIndex: _,
        allowEscape: !0,
        focusItemOnOpen: "auto",
        openOnArrowKeyDown: !0,
        scrollItemIntoView: !0,
        selectedIndex: _,
        virtual: !0,
        onNavigate: (z) => {
          const te = E.length - 1;
          if (z === null && M === 0) return R(te);
          if (z === null && M === te) return R(0);
          const B = z ?? M ?? null;
          return B === null ? void 0 : R(B);
        }
      })
    ]), G = (z) => {
      var B;
      T(z.value), I(z.label ?? "");
      const te = Df(g.current, z.value);
      te && ((B = h.onChange) == null || B.call(h, te)), b(!1), x("");
    }, D = (z) => {
      var B;
      const te = z.target.value;
      return x(te), !v && te === "" ? b(!0) : (z.target.name = h.name || "", te ? b(!0) : (B = h.onChange) == null ? void 0 : B.call(h, z));
    }, j = () => {
      b(!0), x("");
    }, W = () => {
      x(""), T(""), I(""), Df(Y.reference.current, ""), b(!1);
    }, U = h.id || h.name;
    return /* @__PURE__ */ Z(
      Id,
      {
        ...h,
        container: bt("group inline-block w-full", a),
        error: d,
        feedback: n,
        form: h.form,
        hideLeft: l,
        id: h.name || h.id,
        interactive: o,
        labelClassName: r,
        left: u,
        name: h.name,
        optionalText: s,
        placeholder: h.placeholder,
        required: f,
        rightLabel: i,
        title: h.title,
        right: /* @__PURE__ */ Z("span", { className: "flex items-center gap-0.5", children: [
          /* @__PURE__ */ Z("button", { type: "button", className: "transition-colors link:text-primary", children: [
            /* @__PURE__ */ S(vv, { size: 20 }),
            /* @__PURE__ */ S("span", { className: "sr-only", children: m.inputCaretDown })
          ] }),
          w ? /* @__PURE__ */ S("button", { type: "button", onClick: W, className: "transition-colors link:text-danger", children: /* @__PURE__ */ S("svg", { width: "15", height: "15", viewBox: "0 0 15 15", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ S(
            "path",
            {
              d: "M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z",
              fill: "currentColor",
              fillRule: "evenodd",
              clipRule: "evenodd"
            }
          ) }) }) : null
        ] }),
        children: [
          /* @__PURE__ */ S("input", { ref: g, required: f, type: "hidden", name: U, id: U, defaultValue: h.value || void 0 }),
          /* @__PURE__ */ S(
            "input",
            {
              ...X({
                ...h,
                onChange: D,
                onFocus: j,
                pattern: k,
                ref: Y.setReference,
                name: `${U}-shadow`,
                id: `${U}-shadow`,
                onClick: (z) => z.currentTarget.focus(),
                onKeyDown(z) {
                  if (z.key === "Escape")
                    return z.currentTarget.blur(), b(!1);
                  if (z.key === "Enter") {
                    if (_ !== null && E[_])
                      return z.preventDefault(), G(E[_]);
                    if (E.length === 1)
                      return z.preventDefault(), G(E[0]);
                  }
                }
              }),
              "data-name": U,
              "data-ignore": "ignore",
              required: f,
              value: v ? y : P || w,
              "aria-autocomplete": "list",
              autoComplete: "off",
              className: bt(
                "input placeholder-input-mask group h-11 w-full flex-1 rounded-md bg-transparent p-2 text-base text-foreground outline-none transition-colors group-error:text-danger group-error:placeholder-input-mask-error",
                c || y ? "pe-12" : "",
                u ? "ps-8" : "",
                h.className
              )
            }
          ),
          /* @__PURE__ */ S(os, { preserveTabOrder: !0, children: v ? /* @__PURE__ */ S(Qa, { guards: !0, returnFocus: !1, context: C, initialFocus: -1, visuallyHiddenDismiss: !0, children: /* @__PURE__ */ S(
            "ul",
            {
              ...re({
                ref: Y.setFloating,
                style: { position: H, left: A ?? 0, top: N ?? 0, ...$.styles }
              }),
              "data-floating": "true",
              className: "z-floating m-0 origin-[top_center] list-none overflow-auto overflow-y-auto rounded-b-lg rounded-t-lg bg-floating-background p-0 text-foreground shadow-floating",
              children: E.map((z, te) => /* @__PURE__ */ Eo(
                eA,
                {
                  ...ee({
                    onClick: () => G(z),
                    ref: (B) => void (L.current[te] = B),
                    selected: _ === te,
                    active: w === z.value
                  }),
                  key: `${z.value}-option`,
                  option: z,
                  selected: _ === te,
                  active: w === z.value
                }
              ))
            }
          ) }) : null })
        ]
      }
    );
  }
), oA = ut(
  ({ children: e, error: t, className: n = "", size: r, container: o, ...i }, s) => /* @__PURE__ */ Z(
    "label",
    {
      "data-disabled": i.disabled,
      "aria-disabled": i.disabled,
      className: bt("group flex flex-wrap items-center font-normal data-[disabled=true]:cursor-not-allowed", o),
      children: [
        /* @__PURE__ */ S(
          "input",
          {
            ...i,
            ref: s,
            type: "checkbox",
            className: bt(
              "form-checkbox mr-2 inline-block size-4 appearance-none rounded border-card-border bg-origin-border text-primary focus:ring-primary disabled:opacity-70 group-aria-disabled:cursor-not-allowed",
              n
            )
          }
        ),
        e,
        /* @__PURE__ */ S("span", { className: "flex-1 whitespace-nowrap text-xs text-danger empty:mt-0 empty:hidden", children: t })
      ]
    }
  )
), el = ut(
  ({
    type: e = "text",
    feedback: t = null,
    info: n,
    labelClassName: r,
    next: o,
    interactive: i,
    rightLabel: s,
    optionalText: a,
    container: l,
    hideLeft: c = !1,
    right: u,
    left: d,
    error: f,
    ...h
  }, p) => {
    const m = h.id ?? h.name, g = ye(null);
    return xe(() => {
      if (g.current === null) return;
      const v = g.current, b = () => v.setAttribute("data-initialized", "true"), y = (x) => {
        const w = x;
        if (w.key === "Enter" && v.enterKeyHint === "next") {
          const T = v.getAttribute("data-next");
          if (T) {
            const P = document.getElementById(T);
            if (P)
              return P.focus(), void w.preventDefault();
          }
        }
      };
      return v.addEventListener("keydown", y), v.addEventListener("focus", b), () => {
        v.removeEventListener("keydown", y), v.removeEventListener("focus", b);
      };
    }, []), /* @__PURE__ */ S(
      Id,
      {
        info: n,
        container: bt("group inline-block w-full", l),
        error: f,
        feedback: t,
        hideLeft: c,
        left: d,
        optionalText: a,
        right: u,
        rightLabel: s,
        interactive: i,
        form: h.form,
        id: h.name || h.id,
        name: h.name,
        labelClassName: r,
        title: h.title,
        placeholder: h.placeholder,
        required: h.required,
        children: /* @__PURE__ */ S(
          Wv,
          {
            ...h,
            type: e,
            "data-next": o,
            ref: Lg(p, g),
            id: m,
            name: m,
            className: bt(
              "input text-foreground group h-11 w-full flex-1 rounded-md bg-transparent p-2 placeholder-input-mask outline-none transition-colors group-error:text-danger group-error:placeholder-input-mask-error",
              u ? "pe-4" : "",
              d ? "ps-4" : "",
              h.className
            )
          }
        )
      }
    );
  }
), Jp = new Date(1970, 11, 31), tc = {
  year: () => [/\d/, /\d/, /\d/, /\d/],
  month: () => [/\d/, /\d/],
  day: () => [/\d/, /\d/],
  literal: (e) => e.split("")
}, em = {
  year: () => "yyyy",
  month: () => "MM",
  day: () => "dd",
  literal: (e) => e
}, iA = {
  literal: (e, t) => t,
  year: (e) => e.getFullYear(),
  day: (e) => e.getDate().toString().padStart(2, "0"),
  month: (e) => (e.getMonth() + 1).toString().padStart(2, "0")
}, vL = ({ date: e, locale: t, disabledDate: n, autoFocusToday: r, onChange: o, markToday: i, ...s }) => {
  const a = Yn(), l = yn(), c = Ue(() => new Intl.DateTimeFormat(t), [t]), [u, d] = Me(e || void 0), [f, h] = Me(!1), p = c.formatToParts(Jp).flatMap((x) => Bn.keyof(tc, x.type) ? tc[x.type](x.value) : []), m = c.formatToParts(Jp).reduce((x, w) => x + (Bn.keyof(em, w.type) ? em[w.type](w.value) : ""), ""), [g, v] = Me(
    u ? c.formatToParts(u).reduce((x, w) => x + (Bn.keyof(tc, w.type) ? iA[w.type](u, w.value) : ""), "") : ""
  ), b = (x) => {
    const w = x.target.value;
    if (v(w), p.length === w.length && p.every((P, I) => {
      const _ = w.charAt(I);
      return typeof P == "string" ? _ === P : P.test(_);
    })) {
      const P = Mo(qk(w, m, /* @__PURE__ */ new Date()));
      d(P), o == null || o(P);
    }
  }, y = (x) => {
    d(x), o == null || o(x), v(XR(x, m));
  };
  return /* @__PURE__ */ S(
    el,
    {
      ...s,
      mask: p,
      value: g,
      onChange: b,
      className: "uppercase",
      formNoValidate: !f,
      placeholder: m,
      required: s.required ?? !0,
      error: f ? void 0 : s.error,
      name: s.name ? `${s.name}-picker` : s.name,
      right: /* @__PURE__ */ Z(it, { children: [
        /* @__PURE__ */ S("input", { defaultValue: u == null ? void 0 : u.toISOString(), hidden: !0, type: "date", name: s.name }),
        /* @__PURE__ */ S(
          cs,
          {
            open: f,
            restoreFocus: !0,
            onChange: h,
            trigger: /* @__PURE__ */ Z("span", { "aria-labelledby": a, children: [
              /* @__PURE__ */ S("span", { id: a, className: "sr-only", children: l.datePickerCalendarButtonLabel }),
              /* @__PURE__ */ S(DP, {})
            ] }),
            buttonProps: { "aria-describedby": a },
            children: /* @__PURE__ */ S(
              VO,
              {
                ...s,
                locale: t,
                date: u,
                onChange: y,
                markToday: i,
                disabledDate: n,
                autoFocusToday: r
              }
            )
          }
        )
      ] })
    }
  );
}, sA = [
  "B",
  "kB",
  "MB",
  "GB",
  "TB",
  "PB",
  "EB",
  "ZB",
  "YB"
], aA = [
  "B",
  "KiB",
  "MiB",
  "GiB",
  "TiB",
  "PiB",
  "EiB",
  "ZiB",
  "YiB"
], lA = [
  "b",
  "kbit",
  "Mbit",
  "Gbit",
  "Tbit",
  "Pbit",
  "Ebit",
  "Zbit",
  "Ybit"
], cA = [
  "b",
  "kibit",
  "Mibit",
  "Gibit",
  "Tibit",
  "Pibit",
  "Eibit",
  "Zibit",
  "Yibit"
], tm = (e, t, n) => {
  let r = e;
  return typeof t == "string" || Array.isArray(t) ? r = e.toLocaleString(t, n) : (t === !0 || n !== void 0) && (r = e.toLocaleString(void 0, n)), r;
};
function nm(e, t) {
  if (!Number.isFinite(e))
    throw new TypeError(`Expected a finite number, got ${typeof e}: ${e}`);
  t = {
    bits: !1,
    binary: !1,
    space: !0,
    ...t
  };
  const n = t.bits ? t.binary ? cA : lA : t.binary ? aA : sA, r = t.space ? " " : "";
  if (t.signed && e === 0)
    return ` 0${r}${n[0]}`;
  const o = e < 0, i = o ? "-" : t.signed ? "+" : "";
  o && (e = -e);
  let s;
  if (t.minimumFractionDigits !== void 0 && (s = { minimumFractionDigits: t.minimumFractionDigits }), t.maximumFractionDigits !== void 0 && (s = { maximumFractionDigits: t.maximumFractionDigits, ...s }), e < 1) {
    const u = tm(e, t.locale, s);
    return i + u + r + n[0];
  }
  const a = Math.min(Math.floor(t.binary ? Math.log(e) / Math.log(1024) : Math.log10(e) / 3), n.length - 1);
  e /= (t.binary ? 1024 : 1e3) ** a, s || (e = e.toPrecision(3));
  const l = tm(Number(e), t.locale, s), c = n[a];
  return i + l + r + c;
}
var ru = { exports: {} }, Cs = { exports: {} }, Ve = {};
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var rm;
function uA() {
  if (rm) return Ve;
  rm = 1;
  var e = typeof Symbol == "function" && Symbol.for, t = e ? Symbol.for("react.element") : 60103, n = e ? Symbol.for("react.portal") : 60106, r = e ? Symbol.for("react.fragment") : 60107, o = e ? Symbol.for("react.strict_mode") : 60108, i = e ? Symbol.for("react.profiler") : 60114, s = e ? Symbol.for("react.provider") : 60109, a = e ? Symbol.for("react.context") : 60110, l = e ? Symbol.for("react.async_mode") : 60111, c = e ? Symbol.for("react.concurrent_mode") : 60111, u = e ? Symbol.for("react.forward_ref") : 60112, d = e ? Symbol.for("react.suspense") : 60113, f = e ? Symbol.for("react.suspense_list") : 60120, h = e ? Symbol.for("react.memo") : 60115, p = e ? Symbol.for("react.lazy") : 60116, m = e ? Symbol.for("react.block") : 60121, g = e ? Symbol.for("react.fundamental") : 60117, v = e ? Symbol.for("react.responder") : 60118, b = e ? Symbol.for("react.scope") : 60119;
  function y(w) {
    if (typeof w == "object" && w !== null) {
      var T = w.$$typeof;
      switch (T) {
        case t:
          switch (w = w.type, w) {
            case l:
            case c:
            case r:
            case i:
            case o:
            case d:
              return w;
            default:
              switch (w = w && w.$$typeof, w) {
                case a:
                case u:
                case p:
                case h:
                case s:
                  return w;
                default:
                  return T;
              }
          }
        case n:
          return T;
      }
    }
  }
  function x(w) {
    return y(w) === c;
  }
  return Ve.AsyncMode = l, Ve.ConcurrentMode = c, Ve.ContextConsumer = a, Ve.ContextProvider = s, Ve.Element = t, Ve.ForwardRef = u, Ve.Fragment = r, Ve.Lazy = p, Ve.Memo = h, Ve.Portal = n, Ve.Profiler = i, Ve.StrictMode = o, Ve.Suspense = d, Ve.isAsyncMode = function(w) {
    return x(w) || y(w) === l;
  }, Ve.isConcurrentMode = x, Ve.isContextConsumer = function(w) {
    return y(w) === a;
  }, Ve.isContextProvider = function(w) {
    return y(w) === s;
  }, Ve.isElement = function(w) {
    return typeof w == "object" && w !== null && w.$$typeof === t;
  }, Ve.isForwardRef = function(w) {
    return y(w) === u;
  }, Ve.isFragment = function(w) {
    return y(w) === r;
  }, Ve.isLazy = function(w) {
    return y(w) === p;
  }, Ve.isMemo = function(w) {
    return y(w) === h;
  }, Ve.isPortal = function(w) {
    return y(w) === n;
  }, Ve.isProfiler = function(w) {
    return y(w) === i;
  }, Ve.isStrictMode = function(w) {
    return y(w) === o;
  }, Ve.isSuspense = function(w) {
    return y(w) === d;
  }, Ve.isValidElementType = function(w) {
    return typeof w == "string" || typeof w == "function" || w === r || w === c || w === i || w === o || w === d || w === f || typeof w == "object" && w !== null && (w.$$typeof === p || w.$$typeof === h || w.$$typeof === s || w.$$typeof === a || w.$$typeof === u || w.$$typeof === g || w.$$typeof === v || w.$$typeof === b || w.$$typeof === m);
  }, Ve.typeOf = y, Ve;
}
var $e = {};
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var om;
function dA() {
  return om || (om = 1, process.env.NODE_ENV !== "production" && function() {
    var e = typeof Symbol == "function" && Symbol.for, t = e ? Symbol.for("react.element") : 60103, n = e ? Symbol.for("react.portal") : 60106, r = e ? Symbol.for("react.fragment") : 60107, o = e ? Symbol.for("react.strict_mode") : 60108, i = e ? Symbol.for("react.profiler") : 60114, s = e ? Symbol.for("react.provider") : 60109, a = e ? Symbol.for("react.context") : 60110, l = e ? Symbol.for("react.async_mode") : 60111, c = e ? Symbol.for("react.concurrent_mode") : 60111, u = e ? Symbol.for("react.forward_ref") : 60112, d = e ? Symbol.for("react.suspense") : 60113, f = e ? Symbol.for("react.suspense_list") : 60120, h = e ? Symbol.for("react.memo") : 60115, p = e ? Symbol.for("react.lazy") : 60116, m = e ? Symbol.for("react.block") : 60121, g = e ? Symbol.for("react.fundamental") : 60117, v = e ? Symbol.for("react.responder") : 60118, b = e ? Symbol.for("react.scope") : 60119;
    function y(B) {
      return typeof B == "string" || typeof B == "function" || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
      B === r || B === c || B === i || B === o || B === d || B === f || typeof B == "object" && B !== null && (B.$$typeof === p || B.$$typeof === h || B.$$typeof === s || B.$$typeof === a || B.$$typeof === u || B.$$typeof === g || B.$$typeof === v || B.$$typeof === b || B.$$typeof === m);
    }
    function x(B) {
      if (typeof B == "object" && B !== null) {
        var De = B.$$typeof;
        switch (De) {
          case t:
            var st = B.type;
            switch (st) {
              case l:
              case c:
              case r:
              case i:
              case o:
              case d:
                return st;
              default:
                var qe = st && st.$$typeof;
                switch (qe) {
                  case a:
                  case u:
                  case p:
                  case h:
                  case s:
                    return qe;
                  default:
                    return De;
                }
            }
          case n:
            return De;
        }
      }
    }
    var w = l, T = c, P = a, I = s, _ = t, R = u, L = r, M = p, V = h, E = n, k = i, A = o, N = d, H = !1;
    function Y(B) {
      return H || (H = !0, console.warn("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.")), C(B) || x(B) === l;
    }
    function C(B) {
      return x(B) === c;
    }
    function $(B) {
      return x(B) === a;
    }
    function X(B) {
      return x(B) === s;
    }
    function re(B) {
      return typeof B == "object" && B !== null && B.$$typeof === t;
    }
    function ee(B) {
      return x(B) === u;
    }
    function G(B) {
      return x(B) === r;
    }
    function D(B) {
      return x(B) === p;
    }
    function j(B) {
      return x(B) === h;
    }
    function W(B) {
      return x(B) === n;
    }
    function U(B) {
      return x(B) === i;
    }
    function z(B) {
      return x(B) === o;
    }
    function te(B) {
      return x(B) === d;
    }
    $e.AsyncMode = w, $e.ConcurrentMode = T, $e.ContextConsumer = P, $e.ContextProvider = I, $e.Element = _, $e.ForwardRef = R, $e.Fragment = L, $e.Lazy = M, $e.Memo = V, $e.Portal = E, $e.Profiler = k, $e.StrictMode = A, $e.Suspense = N, $e.isAsyncMode = Y, $e.isConcurrentMode = C, $e.isContextConsumer = $, $e.isContextProvider = X, $e.isElement = re, $e.isForwardRef = ee, $e.isFragment = G, $e.isLazy = D, $e.isMemo = j, $e.isPortal = W, $e.isProfiler = U, $e.isStrictMode = z, $e.isSuspense = te, $e.isValidElementType = y, $e.typeOf = x;
  }()), $e;
}
var im;
function Mb() {
  return im || (im = 1, process.env.NODE_ENV === "production" ? Cs.exports = uA() : Cs.exports = dA()), Cs.exports;
}
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var nc, sm;
function fA() {
  if (sm) return nc;
  sm = 1;
  var e = Object.getOwnPropertySymbols, t = Object.prototype.hasOwnProperty, n = Object.prototype.propertyIsEnumerable;
  function r(i) {
    if (i == null)
      throw new TypeError("Object.assign cannot be called with null or undefined");
    return Object(i);
  }
  function o() {
    try {
      if (!Object.assign)
        return !1;
      var i = new String("abc");
      if (i[5] = "de", Object.getOwnPropertyNames(i)[0] === "5")
        return !1;
      for (var s = {}, a = 0; a < 10; a++)
        s["_" + String.fromCharCode(a)] = a;
      var l = Object.getOwnPropertyNames(s).map(function(u) {
        return s[u];
      });
      if (l.join("") !== "0123456789")
        return !1;
      var c = {};
      return "abcdefghijklmnopqrst".split("").forEach(function(u) {
        c[u] = u;
      }), Object.keys(Object.assign({}, c)).join("") === "abcdefghijklmnopqrst";
    } catch {
      return !1;
    }
  }
  return nc = o() ? Object.assign : function(i, s) {
    for (var a, l = r(i), c, u = 1; u < arguments.length; u++) {
      a = Object(arguments[u]);
      for (var d in a)
        t.call(a, d) && (l[d] = a[d]);
      if (e) {
        c = e(a);
        for (var f = 0; f < c.length; f++)
          n.call(a, c[f]) && (l[c[f]] = a[c[f]]);
      }
    }
    return l;
  }, nc;
}
var rc, am;
function Ad() {
  if (am) return rc;
  am = 1;
  var e = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  return rc = e, rc;
}
var oc, lm;
function Nb() {
  return lm || (lm = 1, oc = Function.call.bind(Object.prototype.hasOwnProperty)), oc;
}
var ic, cm;
function hA() {
  if (cm) return ic;
  cm = 1;
  var e = function() {
  };
  if (process.env.NODE_ENV !== "production") {
    var t = Ad(), n = {}, r = Nb();
    e = function(i) {
      var s = "Warning: " + i;
      typeof console < "u" && console.error(s);
      try {
        throw new Error(s);
      } catch {
      }
    };
  }
  function o(i, s, a, l, c) {
    if (process.env.NODE_ENV !== "production") {
      for (var u in i)
        if (r(i, u)) {
          var d;
          try {
            if (typeof i[u] != "function") {
              var f = Error(
                (l || "React class") + ": " + a + " type `" + u + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof i[u] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`."
              );
              throw f.name = "Invariant Violation", f;
            }
            d = i[u](s, u, l, a, null, t);
          } catch (p) {
            d = p;
          }
          if (d && !(d instanceof Error) && e(
            (l || "React class") + ": type specification of " + a + " `" + u + "` is invalid; the type checker function must return `null` or an `Error` but returned a " + typeof d + ". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument)."
          ), d instanceof Error && !(d.message in n)) {
            n[d.message] = !0;
            var h = c ? c() : "";
            e(
              "Failed " + a + " type: " + d.message + (h ?? "")
            );
          }
        }
    }
  }
  return o.resetWarningCache = function() {
    process.env.NODE_ENV !== "production" && (n = {});
  }, ic = o, ic;
}
var sc, um;
function pA() {
  if (um) return sc;
  um = 1;
  var e = Mb(), t = fA(), n = Ad(), r = Nb(), o = hA(), i = function() {
  };
  process.env.NODE_ENV !== "production" && (i = function(a) {
    var l = "Warning: " + a;
    typeof console < "u" && console.error(l);
    try {
      throw new Error(l);
    } catch {
    }
  });
  function s() {
    return null;
  }
  return sc = function(a, l) {
    var c = typeof Symbol == "function" && Symbol.iterator, u = "@@iterator";
    function d(C) {
      var $ = C && (c && C[c] || C[u]);
      if (typeof $ == "function")
        return $;
    }
    var f = "<<anonymous>>", h = {
      array: v("array"),
      bigint: v("bigint"),
      bool: v("boolean"),
      func: v("function"),
      number: v("number"),
      object: v("object"),
      string: v("string"),
      symbol: v("symbol"),
      any: b(),
      arrayOf: y,
      element: x(),
      elementType: w(),
      instanceOf: T,
      node: R(),
      objectOf: I,
      oneOf: P,
      oneOfType: _,
      shape: M,
      exact: V
    };
    function p(C, $) {
      return C === $ ? C !== 0 || 1 / C === 1 / $ : C !== C && $ !== $;
    }
    function m(C, $) {
      this.message = C, this.data = $ && typeof $ == "object" ? $ : {}, this.stack = "";
    }
    m.prototype = Error.prototype;
    function g(C) {
      if (process.env.NODE_ENV !== "production")
        var $ = {}, X = 0;
      function re(G, D, j, W, U, z, te) {
        if (W = W || f, z = z || j, te !== n) {
          if (l) {
            var B = new Error(
              "Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types"
            );
            throw B.name = "Invariant Violation", B;
          } else if (process.env.NODE_ENV !== "production" && typeof console < "u") {
            var De = W + ":" + j;
            !$[De] && // Avoid spamming the console because they are often not actionable except for lib authors
            X < 3 && (i(
              "You are manually calling a React.PropTypes validation function for the `" + z + "` prop on `" + W + "`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details."
            ), $[De] = !0, X++);
          }
        }
        return D[j] == null ? G ? D[j] === null ? new m("The " + U + " `" + z + "` is marked as required " + ("in `" + W + "`, but its value is `null`.")) : new m("The " + U + " `" + z + "` is marked as required in " + ("`" + W + "`, but its value is `undefined`.")) : null : C(D, j, W, U, z);
      }
      var ee = re.bind(null, !1);
      return ee.isRequired = re.bind(null, !0), ee;
    }
    function v(C) {
      function $(X, re, ee, G, D, j) {
        var W = X[re], U = A(W);
        if (U !== C) {
          var z = N(W);
          return new m(
            "Invalid " + G + " `" + D + "` of type " + ("`" + z + "` supplied to `" + ee + "`, expected ") + ("`" + C + "`."),
            { expectedType: C }
          );
        }
        return null;
      }
      return g($);
    }
    function b() {
      return g(s);
    }
    function y(C) {
      function $(X, re, ee, G, D) {
        if (typeof C != "function")
          return new m("Property `" + D + "` of component `" + ee + "` has invalid PropType notation inside arrayOf.");
        var j = X[re];
        if (!Array.isArray(j)) {
          var W = A(j);
          return new m("Invalid " + G + " `" + D + "` of type " + ("`" + W + "` supplied to `" + ee + "`, expected an array."));
        }
        for (var U = 0; U < j.length; U++) {
          var z = C(j, U, ee, G, D + "[" + U + "]", n);
          if (z instanceof Error)
            return z;
        }
        return null;
      }
      return g($);
    }
    function x() {
      function C($, X, re, ee, G) {
        var D = $[X];
        if (!a(D)) {
          var j = A(D);
          return new m("Invalid " + ee + " `" + G + "` of type " + ("`" + j + "` supplied to `" + re + "`, expected a single ReactElement."));
        }
        return null;
      }
      return g(C);
    }
    function w() {
      function C($, X, re, ee, G) {
        var D = $[X];
        if (!e.isValidElementType(D)) {
          var j = A(D);
          return new m("Invalid " + ee + " `" + G + "` of type " + ("`" + j + "` supplied to `" + re + "`, expected a single ReactElement type."));
        }
        return null;
      }
      return g(C);
    }
    function T(C) {
      function $(X, re, ee, G, D) {
        if (!(X[re] instanceof C)) {
          var j = C.name || f, W = Y(X[re]);
          return new m("Invalid " + G + " `" + D + "` of type " + ("`" + W + "` supplied to `" + ee + "`, expected ") + ("instance of `" + j + "`."));
        }
        return null;
      }
      return g($);
    }
    function P(C) {
      if (!Array.isArray(C))
        return process.env.NODE_ENV !== "production" && (arguments.length > 1 ? i(
          "Invalid arguments supplied to oneOf, expected an array, got " + arguments.length + " arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z])."
        ) : i("Invalid argument supplied to oneOf, expected an array.")), s;
      function $(X, re, ee, G, D) {
        for (var j = X[re], W = 0; W < C.length; W++)
          if (p(j, C[W]))
            return null;
        var U = JSON.stringify(C, function(te, B) {
          var De = N(B);
          return De === "symbol" ? String(B) : B;
        });
        return new m("Invalid " + G + " `" + D + "` of value `" + String(j) + "` " + ("supplied to `" + ee + "`, expected one of " + U + "."));
      }
      return g($);
    }
    function I(C) {
      function $(X, re, ee, G, D) {
        if (typeof C != "function")
          return new m("Property `" + D + "` of component `" + ee + "` has invalid PropType notation inside objectOf.");
        var j = X[re], W = A(j);
        if (W !== "object")
          return new m("Invalid " + G + " `" + D + "` of type " + ("`" + W + "` supplied to `" + ee + "`, expected an object."));
        for (var U in j)
          if (r(j, U)) {
            var z = C(j, U, ee, G, D + "." + U, n);
            if (z instanceof Error)
              return z;
          }
        return null;
      }
      return g($);
    }
    function _(C) {
      if (!Array.isArray(C))
        return process.env.NODE_ENV !== "production" && i("Invalid argument supplied to oneOfType, expected an instance of array."), s;
      for (var $ = 0; $ < C.length; $++) {
        var X = C[$];
        if (typeof X != "function")
          return i(
            "Invalid argument supplied to oneOfType. Expected an array of check functions, but received " + H(X) + " at index " + $ + "."
          ), s;
      }
      function re(ee, G, D, j, W) {
        for (var U = [], z = 0; z < C.length; z++) {
          var te = C[z], B = te(ee, G, D, j, W, n);
          if (B == null)
            return null;
          B.data && r(B.data, "expectedType") && U.push(B.data.expectedType);
        }
        var De = U.length > 0 ? ", expected one of type [" + U.join(", ") + "]" : "";
        return new m("Invalid " + j + " `" + W + "` supplied to " + ("`" + D + "`" + De + "."));
      }
      return g(re);
    }
    function R() {
      function C($, X, re, ee, G) {
        return E($[X]) ? null : new m("Invalid " + ee + " `" + G + "` supplied to " + ("`" + re + "`, expected a ReactNode."));
      }
      return g(C);
    }
    function L(C, $, X, re, ee) {
      return new m(
        (C || "React class") + ": " + $ + " type `" + X + "." + re + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + ee + "`."
      );
    }
    function M(C) {
      function $(X, re, ee, G, D) {
        var j = X[re], W = A(j);
        if (W !== "object")
          return new m("Invalid " + G + " `" + D + "` of type `" + W + "` " + ("supplied to `" + ee + "`, expected `object`."));
        for (var U in C) {
          var z = C[U];
          if (typeof z != "function")
            return L(ee, G, D, U, N(z));
          var te = z(j, U, ee, G, D + "." + U, n);
          if (te)
            return te;
        }
        return null;
      }
      return g($);
    }
    function V(C) {
      function $(X, re, ee, G, D) {
        var j = X[re], W = A(j);
        if (W !== "object")
          return new m("Invalid " + G + " `" + D + "` of type `" + W + "` " + ("supplied to `" + ee + "`, expected `object`."));
        var U = t({}, X[re], C);
        for (var z in U) {
          var te = C[z];
          if (r(C, z) && typeof te != "function")
            return L(ee, G, D, z, N(te));
          if (!te)
            return new m(
              "Invalid " + G + " `" + D + "` key `" + z + "` supplied to `" + ee + "`.\nBad object: " + JSON.stringify(X[re], null, "  ") + `
Valid keys: ` + JSON.stringify(Object.keys(C), null, "  ")
            );
          var B = te(j, z, ee, G, D + "." + z, n);
          if (B)
            return B;
        }
        return null;
      }
      return g($);
    }
    function E(C) {
      switch (typeof C) {
        case "number":
        case "string":
        case "undefined":
          return !0;
        case "boolean":
          return !C;
        case "object":
          if (Array.isArray(C))
            return C.every(E);
          if (C === null || a(C))
            return !0;
          var $ = d(C);
          if ($) {
            var X = $.call(C), re;
            if ($ !== C.entries) {
              for (; !(re = X.next()).done; )
                if (!E(re.value))
                  return !1;
            } else
              for (; !(re = X.next()).done; ) {
                var ee = re.value;
                if (ee && !E(ee[1]))
                  return !1;
              }
          } else
            return !1;
          return !0;
        default:
          return !1;
      }
    }
    function k(C, $) {
      return C === "symbol" ? !0 : $ ? $["@@toStringTag"] === "Symbol" || typeof Symbol == "function" && $ instanceof Symbol : !1;
    }
    function A(C) {
      var $ = typeof C;
      return Array.isArray(C) ? "array" : C instanceof RegExp ? "object" : k($, C) ? "symbol" : $;
    }
    function N(C) {
      if (typeof C > "u" || C === null)
        return "" + C;
      var $ = A(C);
      if ($ === "object") {
        if (C instanceof Date)
          return "date";
        if (C instanceof RegExp)
          return "regexp";
      }
      return $;
    }
    function H(C) {
      var $ = N(C);
      switch ($) {
        case "array":
        case "object":
          return "an " + $;
        case "boolean":
        case "date":
        case "regexp":
          return "a " + $;
        default:
          return $;
      }
    }
    function Y(C) {
      return !C.constructor || !C.constructor.name ? f : C.constructor.name;
    }
    return h.checkPropTypes = o, h.resetWarningCache = o.resetWarningCache, h.PropTypes = h, h;
  }, sc;
}
var ac, dm;
function mA() {
  if (dm) return ac;
  dm = 1;
  var e = Ad();
  function t() {
  }
  function n() {
  }
  return n.resetWarningCache = t, ac = function() {
    function r(s, a, l, c, u, d) {
      if (d !== e) {
        var f = new Error(
          "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
        );
        throw f.name = "Invariant Violation", f;
      }
    }
    r.isRequired = r;
    function o() {
      return r;
    }
    var i = {
      array: r,
      bigint: r,
      bool: r,
      func: r,
      number: r,
      object: r,
      string: r,
      symbol: r,
      any: r,
      arrayOf: o,
      element: r,
      elementType: r,
      instanceOf: o,
      node: r,
      objectOf: o,
      oneOf: o,
      oneOfType: o,
      shape: o,
      exact: o,
      checkPropTypes: n,
      resetWarningCache: t
    };
    return i.PropTypes = i, i;
  }, ac;
}
if (process.env.NODE_ENV !== "production") {
  var gA = Mb(), yA = !0;
  ru.exports = pA()(gA.isElement, yA);
} else
  ru.exports = mA()();
var vA = ru.exports;
const He = /* @__PURE__ */ fg(vA);
function ei(e, t, n, r) {
  function o(i) {
    return i instanceof n ? i : new n(function(s) {
      s(i);
    });
  }
  return new (n || (n = Promise))(function(i, s) {
    function a(u) {
      try {
        c(r.next(u));
      } catch (d) {
        s(d);
      }
    }
    function l(u) {
      try {
        c(r.throw(u));
      } catch (d) {
        s(d);
      }
    }
    function c(u) {
      u.done ? i(u.value) : o(u.value).then(a, l);
    }
    c((r = r.apply(e, t || [])).next());
  });
}
function ti(e, t) {
  var n = { label: 0, sent: function() {
    if (i[0] & 1) throw i[1];
    return i[1];
  }, trys: [], ops: [] }, r, o, i, s;
  return s = { next: a(0), throw: a(1), return: a(2) }, typeof Symbol == "function" && (s[Symbol.iterator] = function() {
    return this;
  }), s;
  function a(c) {
    return function(u) {
      return l([c, u]);
    };
  }
  function l(c) {
    if (r) throw new TypeError("Generator is already executing.");
    for (; s && (s = 0, c[0] && (n = 0)), n; ) try {
      if (r = 1, o && (i = c[0] & 2 ? o.return : c[0] ? o.throw || ((i = o.return) && i.call(o), 0) : o.next) && !(i = i.call(o, c[1])).done) return i;
      switch (o = 0, i && (c = [c[0] & 2, i.value]), c[0]) {
        case 0:
        case 1:
          i = c;
          break;
        case 4:
          return n.label++, { value: c[1], done: !1 };
        case 5:
          n.label++, o = c[1], c = [0];
          continue;
        case 7:
          c = n.ops.pop(), n.trys.pop();
          continue;
        default:
          if (i = n.trys, !(i = i.length > 0 && i[i.length - 1]) && (c[0] === 6 || c[0] === 2)) {
            n = 0;
            continue;
          }
          if (c[0] === 3 && (!i || c[1] > i[0] && c[1] < i[3])) {
            n.label = c[1];
            break;
          }
          if (c[0] === 6 && n.label < i[1]) {
            n.label = i[1], i = c;
            break;
          }
          if (i && n.label < i[2]) {
            n.label = i[2], n.ops.push(c);
            break;
          }
          i[2] && n.ops.pop(), n.trys.pop();
          continue;
      }
      c = t.call(e, n);
    } catch (u) {
      c = [6, u], o = 0;
    } finally {
      r = i = 0;
    }
    if (c[0] & 5) throw c[1];
    return { value: c[0] ? c[1] : void 0, done: !0 };
  }
}
function fm(e, t) {
  var n = typeof Symbol == "function" && e[Symbol.iterator];
  if (!n) return e;
  var r = n.call(e), o, i = [], s;
  try {
    for (; (t === void 0 || t-- > 0) && !(o = r.next()).done; ) i.push(o.value);
  } catch (a) {
    s = { error: a };
  } finally {
    try {
      o && !o.done && (n = r.return) && n.call(r);
    } finally {
      if (s) throw s.error;
    }
  }
  return i;
}
function hm(e, t, n) {
  if (n || arguments.length === 2) for (var r = 0, o = t.length, i; r < o; r++)
    (i || !(r in t)) && (i || (i = Array.prototype.slice.call(t, 0, r)), i[r] = t[r]);
  return e.concat(i || Array.prototype.slice.call(t));
}
var bA = /* @__PURE__ */ new Map([
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
  ["aac", "audio/aac"],
  ["abw", "application/x-abiword"],
  ["arc", "application/x-freearc"],
  ["avif", "image/avif"],
  ["avi", "video/x-msvideo"],
  ["azw", "application/vnd.amazon.ebook"],
  ["bin", "application/octet-stream"],
  ["bmp", "image/bmp"],
  ["bz", "application/x-bzip"],
  ["bz2", "application/x-bzip2"],
  ["cda", "application/x-cdf"],
  ["csh", "application/x-csh"],
  ["css", "text/css"],
  ["csv", "text/csv"],
  ["doc", "application/msword"],
  ["docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  ["eot", "application/vnd.ms-fontobject"],
  ["epub", "application/epub+zip"],
  ["gz", "application/gzip"],
  ["gif", "image/gif"],
  ["heic", "image/heic"],
  ["heif", "image/heif"],
  ["htm", "text/html"],
  ["html", "text/html"],
  ["ico", "image/vnd.microsoft.icon"],
  ["ics", "text/calendar"],
  ["jar", "application/java-archive"],
  ["jpeg", "image/jpeg"],
  ["jpg", "image/jpeg"],
  ["js", "text/javascript"],
  ["json", "application/json"],
  ["jsonld", "application/ld+json"],
  ["mid", "audio/midi"],
  ["midi", "audio/midi"],
  ["mjs", "text/javascript"],
  ["mp3", "audio/mpeg"],
  ["mp4", "video/mp4"],
  ["mpeg", "video/mpeg"],
  ["mpkg", "application/vnd.apple.installer+xml"],
  ["odp", "application/vnd.oasis.opendocument.presentation"],
  ["ods", "application/vnd.oasis.opendocument.spreadsheet"],
  ["odt", "application/vnd.oasis.opendocument.text"],
  ["oga", "audio/ogg"],
  ["ogv", "video/ogg"],
  ["ogx", "application/ogg"],
  ["opus", "audio/opus"],
  ["otf", "font/otf"],
  ["png", "image/png"],
  ["pdf", "application/pdf"],
  ["php", "application/x-httpd-php"],
  ["ppt", "application/vnd.ms-powerpoint"],
  ["pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
  ["rar", "application/vnd.rar"],
  ["rtf", "application/rtf"],
  ["sh", "application/x-sh"],
  ["svg", "image/svg+xml"],
  ["swf", "application/x-shockwave-flash"],
  ["tar", "application/x-tar"],
  ["tif", "image/tiff"],
  ["tiff", "image/tiff"],
  ["ts", "video/mp2t"],
  ["ttf", "font/ttf"],
  ["txt", "text/plain"],
  ["vsd", "application/vnd.visio"],
  ["wav", "audio/wav"],
  ["weba", "audio/webm"],
  ["webm", "video/webm"],
  ["webp", "image/webp"],
  ["woff", "font/woff"],
  ["woff2", "font/woff2"],
  ["xhtml", "application/xhtml+xml"],
  ["xls", "application/vnd.ms-excel"],
  ["xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  ["xml", "application/xml"],
  ["xul", "application/vnd.mozilla.xul+xml"],
  ["zip", "application/zip"],
  ["7z", "application/x-7z-compressed"],
  // Others
  ["mkv", "video/x-matroska"],
  ["mov", "video/quicktime"],
  ["msg", "application/vnd.ms-outlook"]
]);
function us(e, t) {
  var n = wA(e);
  if (typeof n.path != "string") {
    var r = e.webkitRelativePath;
    Object.defineProperty(n, "path", {
      value: typeof t == "string" ? t : typeof r == "string" && r.length > 0 ? r : e.name,
      writable: !1,
      configurable: !1,
      enumerable: !0
    });
  }
  return n;
}
function wA(e) {
  var t = e.name, n = t && t.lastIndexOf(".") !== -1;
  if (n && !e.type) {
    var r = t.split(".").pop().toLowerCase(), o = bA.get(r);
    o && Object.defineProperty(e, "type", {
      value: o,
      writable: !1,
      configurable: !1,
      enumerable: !0
    });
  }
  return e;
}
var xA = [
  // Thumbnail cache files for macOS and Windows
  ".DS_Store",
  "Thumbs.db"
  // Windows
];
function TA(e) {
  return ei(this, void 0, void 0, function() {
    return ti(this, function(t) {
      return da(e) && SA(e.dataTransfer) ? [2, RA(e.dataTransfer, e.type)] : EA(e) ? [2, CA(e)] : Array.isArray(e) && e.every(function(n) {
        return "getFile" in n && typeof n.getFile == "function";
      }) ? [2, PA(e)] : [2, []];
    });
  });
}
function SA(e) {
  return da(e);
}
function EA(e) {
  return da(e) && da(e.target);
}
function da(e) {
  return typeof e == "object" && e !== null;
}
function CA(e) {
  return ou(e.target.files).map(function(t) {
    return us(t);
  });
}
function PA(e) {
  return ei(this, void 0, void 0, function() {
    var t;
    return ti(this, function(n) {
      switch (n.label) {
        case 0:
          return [4, Promise.all(e.map(function(r) {
            return r.getFile();
          }))];
        case 1:
          return t = n.sent(), [2, t.map(function(r) {
            return us(r);
          })];
      }
    });
  });
}
function RA(e, t) {
  return ei(this, void 0, void 0, function() {
    var n, r;
    return ti(this, function(o) {
      switch (o.label) {
        case 0:
          return e.items ? (n = ou(e.items).filter(function(i) {
            return i.kind === "file";
          }), t !== "drop" ? [2, n] : [4, Promise.all(n.map(kA))]) : [3, 2];
        case 1:
          return r = o.sent(), [2, pm(Fb(r))];
        case 2:
          return [2, pm(ou(e.files).map(function(i) {
            return us(i);
          }))];
      }
    });
  });
}
function pm(e) {
  return e.filter(function(t) {
    return xA.indexOf(t.name) === -1;
  });
}
function ou(e) {
  if (e === null)
    return [];
  for (var t = [], n = 0; n < e.length; n++) {
    var r = e[n];
    t.push(r);
  }
  return t;
}
function kA(e) {
  if (typeof e.webkitGetAsEntry != "function")
    return mm(e);
  var t = e.webkitGetAsEntry();
  return t && t.isDirectory ? Lb(t) : mm(e);
}
function Fb(e) {
  return e.reduce(function(t, n) {
    return hm(hm([], fm(t), !1), fm(Array.isArray(n) ? Fb(n) : [n]), !1);
  }, []);
}
function mm(e) {
  var t = e.getAsFile();
  if (!t)
    return Promise.reject("".concat(e, " is not a File"));
  var n = us(t);
  return Promise.resolve(n);
}
function OA(e) {
  return ei(this, void 0, void 0, function() {
    return ti(this, function(t) {
      return [2, e.isDirectory ? Lb(e) : IA(e)];
    });
  });
}
function Lb(e) {
  var t = e.createReader();
  return new Promise(function(n, r) {
    var o = [];
    function i() {
      var s = this;
      t.readEntries(function(a) {
        return ei(s, void 0, void 0, function() {
          var l, c, u;
          return ti(this, function(d) {
            switch (d.label) {
              case 0:
                if (a.length) return [3, 5];
                d.label = 1;
              case 1:
                return d.trys.push([1, 3, , 4]), [4, Promise.all(o)];
              case 2:
                return l = d.sent(), n(l), [3, 4];
              case 3:
                return c = d.sent(), r(c), [3, 4];
              case 4:
                return [3, 6];
              case 5:
                u = Promise.all(a.map(OA)), o.push(u), i(), d.label = 6;
              case 6:
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      }, function(a) {
        r(a);
      });
    }
    i();
  });
}
function IA(e) {
  return ei(this, void 0, void 0, function() {
    return ti(this, function(t) {
      return [2, new Promise(function(n, r) {
        e.file(function(o) {
          var i = us(o, e.fullPath);
          n(i);
        }, function(o) {
          r(o);
        });
      })];
    });
  });
}
var _A = function(e, t) {
  if (e && t) {
    var n = Array.isArray(t) ? t : t.split(","), r = e.name || "", o = (e.type || "").toLowerCase(), i = o.replace(/\/.*$/, "");
    return n.some(function(s) {
      var a = s.trim().toLowerCase();
      return a.charAt(0) === "." ? r.toLowerCase().endsWith(a) : a.endsWith("/*") ? i === a.replace(/\/.*$/, "") : o === a;
    });
  }
  return !0;
};
function gm(e) {
  return MA(e) || DA(e) || $b(e) || AA();
}
function AA() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function DA(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function MA(e) {
  if (Array.isArray(e)) return iu(e);
}
function ym(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function vm(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? ym(Object(n), !0).forEach(function(r) {
      Vb(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : ym(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function Vb(e, t, n) {
  return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function $i(e, t) {
  return LA(e) || FA(e, t) || $b(e, t) || NA();
}
function NA() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function $b(e, t) {
  if (e) {
    if (typeof e == "string") return iu(e, t);
    var n = Object.prototype.toString.call(e).slice(8, -1);
    if (n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set") return Array.from(e);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return iu(e, t);
  }
}
function iu(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = new Array(t); n < t; n++)
    r[n] = e[n];
  return r;
}
function FA(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var r = [], o = !0, i = !1, s, a;
    try {
      for (n = n.call(e); !(o = (s = n.next()).done) && (r.push(s.value), !(t && r.length === t)); o = !0)
        ;
    } catch (l) {
      i = !0, a = l;
    } finally {
      try {
        !o && n.return != null && n.return();
      } finally {
        if (i) throw a;
      }
    }
    return r;
  }
}
function LA(e) {
  if (Array.isArray(e)) return e;
}
var VA = "file-invalid-type", $A = "file-too-large", jA = "file-too-small", BA = "too-many-files", zA = function(t) {
  t = Array.isArray(t) && t.length === 1 ? t[0] : t;
  var n = Array.isArray(t) ? "one of ".concat(t.join(", ")) : t;
  return {
    code: VA,
    message: "File type must be ".concat(n)
  };
}, bm = function(t) {
  return {
    code: $A,
    message: "File is larger than ".concat(t, " ").concat(t === 1 ? "byte" : "bytes")
  };
}, wm = function(t) {
  return {
    code: jA,
    message: "File is smaller than ".concat(t, " ").concat(t === 1 ? "byte" : "bytes")
  };
}, WA = {
  code: BA,
  message: "Too many files"
};
function jb(e, t) {
  var n = e.type === "application/x-moz-file" || _A(e, t);
  return [n, n ? null : zA(t)];
}
function Bb(e, t, n) {
  if (Fr(e.size))
    if (Fr(t) && Fr(n)) {
      if (e.size > n) return [!1, bm(n)];
      if (e.size < t) return [!1, wm(t)];
    } else {
      if (Fr(t) && e.size < t) return [!1, wm(t)];
      if (Fr(n) && e.size > n) return [!1, bm(n)];
    }
  return [!0, null];
}
function Fr(e) {
  return e != null;
}
function HA(e) {
  var t = e.files, n = e.accept, r = e.minSize, o = e.maxSize, i = e.multiple, s = e.maxFiles, a = e.validator;
  return !i && t.length > 1 || i && s >= 1 && t.length > s ? !1 : t.every(function(l) {
    var c = jb(l, n), u = $i(c, 1), d = u[0], f = Bb(l, r, o), h = $i(f, 1), p = h[0], m = a ? a(l) : null;
    return d && p && !m;
  });
}
function fa(e) {
  return typeof e.isPropagationStopped == "function" ? e.isPropagationStopped() : typeof e.cancelBubble < "u" ? e.cancelBubble : !1;
}
function Ps(e) {
  return e.dataTransfer ? Array.prototype.some.call(e.dataTransfer.types, function(t) {
    return t === "Files" || t === "application/x-moz-file";
  }) : !!e.target && !!e.target.files;
}
function xm(e) {
  e.preventDefault();
}
function UA(e) {
  return e.indexOf("MSIE") !== -1 || e.indexOf("Trident/") !== -1;
}
function GA(e) {
  return e.indexOf("Edge/") !== -1;
}
function YA() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : window.navigator.userAgent;
  return UA(e) || GA(e);
}
function bn() {
  for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
    t[n] = arguments[n];
  return function(r) {
    for (var o = arguments.length, i = new Array(o > 1 ? o - 1 : 0), s = 1; s < o; s++)
      i[s - 1] = arguments[s];
    return t.some(function(a) {
      return !fa(r) && a && a.apply(void 0, [r].concat(i)), fa(r);
    });
  };
}
function qA() {
  return "showOpenFilePicker" in window;
}
function KA(e) {
  if (Fr(e)) {
    var t = Object.entries(e).filter(function(n) {
      var r = $i(n, 2), o = r[0], i = r[1], s = !0;
      return zb(o) || (console.warn('Skipped "'.concat(o, '" because it is not a valid MIME type. Check https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types for a list of valid MIME types.')), s = !1), (!Array.isArray(i) || !i.every(Wb)) && (console.warn('Skipped "'.concat(o, '" because an invalid file extension was provided.')), s = !1), s;
    }).reduce(function(n, r) {
      var o = $i(r, 2), i = o[0], s = o[1];
      return vm(vm({}, n), {}, Vb({}, i, s));
    }, {});
    return [{
      // description is required due to https://crbug.com/1264708
      description: "Files",
      accept: t
    }];
  }
  return e;
}
function ZA(e) {
  if (Fr(e))
    return Object.entries(e).reduce(function(t, n) {
      var r = $i(n, 2), o = r[0], i = r[1];
      return [].concat(gm(t), [o], gm(i));
    }, []).filter(function(t) {
      return zb(t) || Wb(t);
    }).join(",");
}
function XA(e) {
  return e instanceof DOMException && (e.name === "AbortError" || e.code === e.ABORT_ERR);
}
function QA(e) {
  return e instanceof DOMException && (e.name === "SecurityError" || e.code === e.SECURITY_ERR);
}
function zb(e) {
  return e === "audio/*" || e === "video/*" || e === "image/*" || e === "text/*" || /\w+\/[-+.\w]+/g.test(e);
}
function Wb(e) {
  return /^.*\.[\w]+$/.test(e);
}
var JA = ["children"], eD = ["open"], tD = ["refKey", "role", "onKeyDown", "onFocus", "onBlur", "onClick", "onDragEnter", "onDragOver", "onDragLeave", "onDrop"], nD = ["refKey", "onChange", "onClick"];
function rD(e) {
  return sD(e) || iD(e) || Hb(e) || oD();
}
function oD() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function iD(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function sD(e) {
  if (Array.isArray(e)) return su(e);
}
function lc(e, t) {
  return cD(e) || lD(e, t) || Hb(e, t) || aD();
}
function aD() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Hb(e, t) {
  if (e) {
    if (typeof e == "string") return su(e, t);
    var n = Object.prototype.toString.call(e).slice(8, -1);
    if (n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set") return Array.from(e);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return su(e, t);
  }
}
function su(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = new Array(t); n < t; n++)
    r[n] = e[n];
  return r;
}
function lD(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var r = [], o = !0, i = !1, s, a;
    try {
      for (n = n.call(e); !(o = (s = n.next()).done) && (r.push(s.value), !(t && r.length === t)); o = !0)
        ;
    } catch (l) {
      i = !0, a = l;
    } finally {
      try {
        !o && n.return != null && n.return();
      } finally {
        if (i) throw a;
      }
    }
    return r;
  }
}
function cD(e) {
  if (Array.isArray(e)) return e;
}
function Tm(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function nt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Tm(Object(n), !0).forEach(function(r) {
      au(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Tm(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function au(e, t, n) {
  return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function ha(e, t) {
  if (e == null) return {};
  var n = uD(e, t), r, o;
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    for (o = 0; o < i.length; o++)
      r = i[o], !(t.indexOf(r) >= 0) && Object.prototype.propertyIsEnumerable.call(e, r) && (n[r] = e[r]);
  }
  return n;
}
function uD(e, t) {
  if (e == null) return {};
  var n = {}, r = Object.keys(e), o, i;
  for (i = 0; i < r.length; i++)
    o = r[i], !(t.indexOf(o) >= 0) && (n[o] = e[o]);
  return n;
}
var Dd = /* @__PURE__ */ ut(function(e, t) {
  var n = e.children, r = ha(e, JA), o = Gb(r), i = o.open, s = ha(o, eD);
  return Gr(t, function() {
    return {
      open: i
    };
  }, [i]), /* @__PURE__ */ F.createElement(it, null, n(nt(nt({}, s), {}, {
    open: i
  })));
});
Dd.displayName = "Dropzone";
var Ub = {
  disabled: !1,
  getFilesFromEvent: TA,
  maxSize: 1 / 0,
  minSize: 0,
  multiple: !0,
  maxFiles: 0,
  preventDropOnDocument: !0,
  noClick: !1,
  noKeyboard: !1,
  noDrag: !1,
  noDragEventsBubbling: !1,
  validator: null,
  useFsAccessApi: !0,
  autoFocus: !1
};
Dd.defaultProps = Ub;
Dd.propTypes = {
  /**
   * Render function that exposes the dropzone state and prop getter fns
   *
   * @param {object} params
   * @param {Function} params.getRootProps Returns the props you should apply to the root drop container you render
   * @param {Function} params.getInputProps Returns the props you should apply to hidden file input you render
   * @param {Function} params.open Open the native file selection dialog
   * @param {boolean} params.isFocused Dropzone area is in focus
   * @param {boolean} params.isFileDialogActive File dialog is opened
   * @param {boolean} params.isDragActive Active drag is in progress
   * @param {boolean} params.isDragAccept Dragged files are accepted
   * @param {boolean} params.isDragReject Some dragged files are rejected
   * @param {File[]} params.acceptedFiles Accepted files
   * @param {FileRejection[]} params.fileRejections Rejected files and why they were rejected
   */
  children: He.func,
  /**
   * Set accepted file types.
   * Checkout https://developer.mozilla.org/en-US/docs/Web/API/window/showOpenFilePicker types option for more information.
   * Keep in mind that mime type determination is not reliable across platforms. CSV files,
   * for example, are reported as text/plain under macOS but as application/vnd.ms-excel under
   * Windows. In some cases there might not be a mime type set at all (https://github.com/react-dropzone/react-dropzone/issues/276).
   */
  accept: He.objectOf(He.arrayOf(He.string)),
  /**
   * Allow drag 'n' drop (or selection from the file dialog) of multiple files
   */
  multiple: He.bool,
  /**
   * If false, allow dropped items to take over the current browser window
   */
  preventDropOnDocument: He.bool,
  /**
   * If true, disables click to open the native file selection dialog
   */
  noClick: He.bool,
  /**
   * If true, disables SPACE/ENTER to open the native file selection dialog.
   * Note that it also stops tracking the focus state.
   */
  noKeyboard: He.bool,
  /**
   * If true, disables drag 'n' drop
   */
  noDrag: He.bool,
  /**
   * If true, stops drag event propagation to parents
   */
  noDragEventsBubbling: He.bool,
  /**
   * Minimum file size (in bytes)
   */
  minSize: He.number,
  /**
   * Maximum file size (in bytes)
   */
  maxSize: He.number,
  /**
   * Maximum accepted number of files
   * The default value is 0 which means there is no limitation to how many files are accepted.
   */
  maxFiles: He.number,
  /**
   * Enable/disable the dropzone
   */
  disabled: He.bool,
  /**
   * Use this to provide a custom file aggregator
   *
   * @param {(DragEvent|Event)} event A drag event or input change event (if files were selected via the file dialog)
   */
  getFilesFromEvent: He.func,
  /**
   * Cb for when closing the file dialog with no selection
   */
  onFileDialogCancel: He.func,
  /**
   * Cb for when opening the file dialog
   */
  onFileDialogOpen: He.func,
  /**
   * Set to true to use the https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API
   * to open the file picker instead of using an `<input type="file">` click event.
   */
  useFsAccessApi: He.bool,
  /**
   * Set to true to focus the root element on render
   */
  autoFocus: He.bool,
  /**
   * Cb for when the `dragenter` event occurs.
   *
   * @param {DragEvent} event
   */
  onDragEnter: He.func,
  /**
   * Cb for when the `dragleave` event occurs
   *
   * @param {DragEvent} event
   */
  onDragLeave: He.func,
  /**
   * Cb for when the `dragover` event occurs
   *
   * @param {DragEvent} event
   */
  onDragOver: He.func,
  /**
   * Cb for when the `drop` event occurs.
   * Note that this callback is invoked after the `getFilesFromEvent` callback is done.
   *
   * Files are accepted or rejected based on the `accept`, `multiple`, `minSize` and `maxSize` props.
   * `accept` must be a valid [MIME type](http://www.iana.org/assignments/media-types/media-types.xhtml) according to [input element specification](https://www.w3.org/wiki/HTML/Elements/input/file) or a valid file extension.
   * If `multiple` is set to false and additional files are dropped,
   * all files besides the first will be rejected.
   * Any file which does not have a size in the [`minSize`, `maxSize`] range, will be rejected as well.
   *
   * Note that the `onDrop` callback will always be invoked regardless if the dropped files were accepted or rejected.
   * If you'd like to react to a specific scenario, use the `onDropAccepted`/`onDropRejected` props.
   *
   * `onDrop` will provide you with an array of [File](https://developer.mozilla.org/en-US/docs/Web/API/File) objects which you can then process and send to a server.
   * For example, with [SuperAgent](https://github.com/visionmedia/superagent) as a http/ajax library:
   *
   * ```js
   * function onDrop(acceptedFiles) {
   *   const req = request.post('/upload')
   *   acceptedFiles.forEach(file => {
   *     req.attach(file.name, file)
   *   })
   *   req.end(callback)
   * }
   * ```
   *
   * @param {File[]} acceptedFiles
   * @param {FileRejection[]} fileRejections
   * @param {(DragEvent|Event)} event A drag event or input change event (if files were selected via the file dialog)
   */
  onDrop: He.func,
  /**
   * Cb for when the `drop` event occurs.
   * Note that if no files are accepted, this callback is not invoked.
   *
   * @param {File[]} files
   * @param {(DragEvent|Event)} event
   */
  onDropAccepted: He.func,
  /**
   * Cb for when the `drop` event occurs.
   * Note that if no files are rejected, this callback is not invoked.
   *
   * @param {FileRejection[]} fileRejections
   * @param {(DragEvent|Event)} event
   */
  onDropRejected: He.func,
  /**
   * Cb for when there's some error from any of the promises.
   *
   * @param {Error} error
   */
  onError: He.func,
  /**
   * Custom validation function. It must return null if there's no errors.
   * @param {File} file
   * @returns {FileError|FileError[]|null}
   */
  validator: He.func
};
var lu = {
  isFocused: !1,
  isFileDialogActive: !1,
  isDragActive: !1,
  isDragAccept: !1,
  isDragReject: !1,
  acceptedFiles: [],
  fileRejections: []
};
function Gb() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = nt(nt({}, Ub), e), n = t.accept, r = t.disabled, o = t.getFilesFromEvent, i = t.maxSize, s = t.minSize, a = t.multiple, l = t.maxFiles, c = t.onDragEnter, u = t.onDragLeave, d = t.onDragOver, f = t.onDrop, h = t.onDropAccepted, p = t.onDropRejected, m = t.onFileDialogCancel, g = t.onFileDialogOpen, v = t.useFsAccessApi, b = t.autoFocus, y = t.preventDropOnDocument, x = t.noClick, w = t.noKeyboard, T = t.noDrag, P = t.noDragEventsBubbling, I = t.onError, _ = t.validator, R = Ue(function() {
    return ZA(n);
  }, [n]), L = Ue(function() {
    return KA(n);
  }, [n]), M = Ue(function() {
    return typeof g == "function" ? g : Sm;
  }, [g]), V = Ue(function() {
    return typeof m == "function" ? m : Sm;
  }, [m]), E = ye(null), k = ye(null), A = G0(dD, lu), N = lc(A, 2), H = N[0], Y = N[1], C = H.isFocused, $ = H.isFileDialogActive, X = ye(typeof window < "u" && window.isSecureContext && v && qA()), re = function() {
    !X.current && $ && setTimeout(function() {
      if (k.current) {
        var ae = k.current.files;
        ae.length || (Y({
          type: "closeDialog"
        }), V());
      }
    }, 300);
  };
  xe(function() {
    return window.addEventListener("focus", re, !1), function() {
      window.removeEventListener("focus", re, !1);
    };
  }, [k, $, V, X]);
  var ee = ye([]), G = function(ae) {
    E.current && E.current.contains(ae.target) || (ae.preventDefault(), ee.current = []);
  };
  xe(function() {
    return y && (document.addEventListener("dragover", xm, !1), document.addEventListener("drop", G, !1)), function() {
      y && (document.removeEventListener("dragover", xm), document.removeEventListener("drop", G));
    };
  }, [E, y]), xe(function() {
    return !r && b && E.current && E.current.focus(), function() {
    };
  }, [E, b, r]);
  var D = Et(function(J) {
    I ? I(J) : console.error(J);
  }, [I]), j = Et(function(J) {
    J.preventDefault(), J.persist(), ke(J), ee.current = [].concat(rD(ee.current), [J.target]), Ps(J) && Promise.resolve(o(J)).then(function(ae) {
      if (!(fa(J) && !P)) {
        var _e = ae.length, Ke = _e > 0 && HA({
          files: ae,
          accept: R,
          minSize: s,
          maxSize: i,
          multiple: a,
          maxFiles: l,
          validator: _
        }), kt = _e > 0 && !Ke;
        Y({
          isDragAccept: Ke,
          isDragReject: kt,
          isDragActive: !0,
          type: "setDraggedFiles"
        }), c && c(J);
      }
    }).catch(function(ae) {
      return D(ae);
    });
  }, [o, c, D, P, R, s, i, a, l, _]), W = Et(function(J) {
    J.preventDefault(), J.persist(), ke(J);
    var ae = Ps(J);
    if (ae && J.dataTransfer)
      try {
        J.dataTransfer.dropEffect = "copy";
      } catch {
      }
    return ae && d && d(J), !1;
  }, [d, P]), U = Et(function(J) {
    J.preventDefault(), J.persist(), ke(J);
    var ae = ee.current.filter(function(Ke) {
      return E.current && E.current.contains(Ke);
    }), _e = ae.indexOf(J.target);
    _e !== -1 && ae.splice(_e, 1), ee.current = ae, !(ae.length > 0) && (Y({
      type: "setDraggedFiles",
      isDragActive: !1,
      isDragAccept: !1,
      isDragReject: !1
    }), Ps(J) && u && u(J));
  }, [E, u, P]), z = Et(function(J, ae) {
    var _e = [], Ke = [];
    J.forEach(function(kt) {
      var Ft = jb(kt, R), Wt = lc(Ft, 2), Rr = Wt[0], no = Wt[1], ro = Bb(kt, s, i), ps = lc(ro, 2), ll = ps[0], cl = ps[1], ul = _ ? _(kt) : null;
      if (Rr && ll && !ul)
        _e.push(kt);
      else {
        var dl = [no, cl];
        ul && (dl = dl.concat(ul)), Ke.push({
          file: kt,
          errors: dl.filter(function($0) {
            return $0;
          })
        });
      }
    }), (!a && _e.length > 1 || a && l >= 1 && _e.length > l) && (_e.forEach(function(kt) {
      Ke.push({
        file: kt,
        errors: [WA]
      });
    }), _e.splice(0)), Y({
      acceptedFiles: _e,
      fileRejections: Ke,
      type: "setFiles"
    }), f && f(_e, Ke, ae), Ke.length > 0 && p && p(Ke, ae), _e.length > 0 && h && h(_e, ae);
  }, [Y, a, R, s, i, l, f, h, p, _]), te = Et(function(J) {
    J.preventDefault(), J.persist(), ke(J), ee.current = [], Ps(J) && Promise.resolve(o(J)).then(function(ae) {
      fa(J) && !P || z(ae, J);
    }).catch(function(ae) {
      return D(ae);
    }), Y({
      type: "reset"
    });
  }, [o, z, D, P]), B = Et(function() {
    if (X.current) {
      Y({
        type: "openDialog"
      }), M();
      var J = {
        multiple: a,
        types: L
      };
      window.showOpenFilePicker(J).then(function(ae) {
        return o(ae);
      }).then(function(ae) {
        z(ae, null), Y({
          type: "closeDialog"
        });
      }).catch(function(ae) {
        XA(ae) ? (V(ae), Y({
          type: "closeDialog"
        })) : QA(ae) ? (X.current = !1, k.current ? (k.current.value = null, k.current.click()) : D(new Error("Cannot open the file picker because the https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API is not supported and no <input> was provided."))) : D(ae);
      });
      return;
    }
    k.current && (Y({
      type: "openDialog"
    }), M(), k.current.value = null, k.current.click());
  }, [Y, M, V, v, z, D, L, a]), De = Et(function(J) {
    !E.current || !E.current.isEqualNode(J.target) || (J.key === " " || J.key === "Enter" || J.keyCode === 32 || J.keyCode === 13) && (J.preventDefault(), B());
  }, [E, B]), st = Et(function() {
    Y({
      type: "focus"
    });
  }, []), qe = Et(function() {
    Y({
      type: "blur"
    });
  }, []), at = Et(function() {
    x || (YA() ? setTimeout(B, 0) : B());
  }, [x, B]), ue = function(ae) {
    return r ? null : ae;
  }, Pe = function(ae) {
    return w ? null : ue(ae);
  }, ce = function(ae) {
    return T ? null : ue(ae);
  }, ke = function(ae) {
    P && ae.stopPropagation();
  }, ft = Ue(function() {
    return function() {
      var J = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, ae = J.refKey, _e = ae === void 0 ? "ref" : ae, Ke = J.role, kt = J.onKeyDown, Ft = J.onFocus, Wt = J.onBlur, Rr = J.onClick, no = J.onDragEnter, ro = J.onDragOver, ps = J.onDragLeave, ll = J.onDrop, cl = ha(J, tD);
      return nt(nt(au({
        onKeyDown: Pe(bn(kt, De)),
        onFocus: Pe(bn(Ft, st)),
        onBlur: Pe(bn(Wt, qe)),
        onClick: ue(bn(Rr, at)),
        onDragEnter: ce(bn(no, j)),
        onDragOver: ce(bn(ro, W)),
        onDragLeave: ce(bn(ps, U)),
        onDrop: ce(bn(ll, te)),
        role: typeof Ke == "string" && Ke !== "" ? Ke : "presentation"
      }, _e, E), !r && !w ? {
        tabIndex: 0
      } : {}), cl);
    };
  }, [E, De, st, qe, at, j, W, U, te, w, T, r]), Oe = Et(function(J) {
    J.stopPropagation();
  }, []), xt = Ue(function() {
    return function() {
      var J = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, ae = J.refKey, _e = ae === void 0 ? "ref" : ae, Ke = J.onChange, kt = J.onClick, Ft = ha(J, nD), Wt = au({
        accept: R,
        multiple: a,
        type: "file",
        style: {
          display: "none"
        },
        onChange: ue(bn(Ke, te)),
        onClick: ue(bn(kt, Oe)),
        tabIndex: -1
      }, _e, k);
      return nt(nt({}, Wt), Ft);
    };
  }, [k, n, a, te, r]);
  return nt(nt({}, H), {}, {
    isFocused: C && !r,
    getRootProps: ft,
    getInputProps: xt,
    rootRef: E,
    inputRef: k,
    open: ue(B)
  });
}
function dD(e, t) {
  switch (t.type) {
    case "focus":
      return nt(nt({}, e), {}, {
        isFocused: !0
      });
    case "blur":
      return nt(nt({}, e), {}, {
        isFocused: !1
      });
    case "openDialog":
      return nt(nt({}, lu), {}, {
        isFileDialogActive: !0
      });
    case "closeDialog":
      return nt(nt({}, e), {}, {
        isFileDialogActive: !1
      });
    case "setDraggedFiles":
      return nt(nt({}, e), {}, {
        isDragActive: t.isDragActive,
        isDragAccept: t.isDragAccept,
        isDragReject: t.isDragReject
      });
    case "setFiles":
      return nt(nt({}, e), {}, {
        acceptedFiles: t.acceptedFiles,
        fileRejections: t.fileRejections
      });
    case "reset":
      return nt({}, lu);
    default:
      return e;
  }
}
function Sm() {
}
const fD = {
  isImage: (e) => e.type.includes("image")
}, hD = (e) => {
  const [t, n] = Me({ url: "", type: "", size: "" });
  return xe(() => {
    if (fD.isImage(e.file)) {
      const r = URL.createObjectURL(e.file);
      return n({ url: r, type: "img", size: nm(e.file.size) }), () => {
        URL.revokeObjectURL(r);
      };
    }
    n({ url: "", type: e.file.type, size: nm(e.file.size) });
  }, [e.file]), t.type === "img" ? /* @__PURE__ */ Z("div", { className: "flex flex-row gap-jade-200 items-center justify-between w-full", children: [
    /* @__PURE__ */ Z("header", { className: "flex flex-row gap-jade-200 items-center", children: [
      /* @__PURE__ */ S("img", { src: t.url, className: "size-jade-500 rounded-jade-xsmall", alt: `Miniatura do arquivo ${e.file.name}` }),
      /* @__PURE__ */ Z("div", { className: "flex flex-col", children: [
        /* @__PURE__ */ S("span", { children: e.file.name }),
        /* @__PURE__ */ S("span", { children: t.size })
      ] })
    ] }),
    /* @__PURE__ */ S(
      Gs,
      {
        className: "isolate",
        type: "button",
        theme: "raw",
        onClick: (r) => {
          var o;
          r.stopPropagation(), (o = e.onDeleteFile) == null || o.call(e, e.file);
        },
        children: /* @__PURE__ */ S(Ao, {})
      }
    )
  ] }) : /* @__PURE__ */ Z("div", { className: "flex flex-row gap-jade-200 items-center justify-between w-full", children: [
    /* @__PURE__ */ Z("header", { className: "flex flex-row gap-4 items-center", children: [
      /* @__PURE__ */ S(LP, { size: 48 }),
      /* @__PURE__ */ Z("div", { className: "flex flex-col text-left justify-start items-start", children: [
        /* @__PURE__ */ S("span", { children: e.file.name }),
        /* @__PURE__ */ S("span", { children: t.size })
      ] })
    ] }),
    /* @__PURE__ */ S(
      Gs,
      {
        className: "isolate",
        type: "button",
        theme: "raw",
        onClick: (r) => {
          var o;
          r.stopPropagation(), (o = e.onDeleteFile) == null || o.call(e, e.file);
        },
        children: /* @__PURE__ */ S(Ao, { className: "text-danger" })
      }
    )
  ] });
}, pD = (e) => /* @__PURE__ */ S("ul", { className: "w-full space-y-jade-200", children: e.files.map((t) => /* @__PURE__ */ S(hD, { onDeleteFile: e.onDeleteFile, file: t }, t.name)) }), mD = (e) => e.isDragActive ? /* @__PURE__ */ S("p", { children: "Solte os arquivos selecionados" }) : e.files.length > 0 ? /* @__PURE__ */ S(pD, { onDeleteFile: e.onDeleteFile, files: e.files }) : /* @__PURE__ */ S(it, { children: e.idle }), gD = /* @__PURE__ */ Z("div", { className: "flex flex-col gap-4 justify-center items-center", children: [
  /* @__PURE__ */ S(WP, { size: 64 }),
  /* @__PURE__ */ Z("p", { children: [
    "You can drag your files or",
    " ",
    /* @__PURE__ */ S("button", { className: "text-primary underline", type: "button", children: "drag to here" })
  ] })
] }), bL = ({ idle: e = gD, onDeleteFile: t, onDrop: n, ...r }) => {
  var u;
  const [o, i] = Me([]), s = (d) => {
    n == null || n(d), i(d);
  }, { getRootProps: a, getInputProps: l, isDragActive: c } = Gb({ onDrop: s });
  return /* @__PURE__ */ Z(
    "div",
    {
      ...a(),
      "data-active": (u = r.files) != null && u.length ? r.files.length > 0 : !1,
      className: "flex text-foreground flex-col items-center justify-center border-2 rounded-lg p-6 border-card-border data-[active=true]:bg-card-background data-[active=true]:border-solid data-[active=false]:border-dashed",
      children: [
        /* @__PURE__ */ S("input", { ...l(r), name: r.name, id: r.name }),
        /* @__PURE__ */ S(mD, { onDeleteFile: t, isDragActive: c, idle: e, files: r.files ?? o })
      ]
    }
  );
}, yD = ["INPUT", "SELECT"], Em = (e) => {
  if (!e) return;
  Array.from(e.elements).forEach((n) => {
    yD.includes(n.tagName) && (n.tagName === "INPUT" && (n.value = n.defaultValue), n.tagName === "SELECT" && (n.value = ""), n.setAttribute("data-initialized", "false"));
  });
}, wL = (e) => /* @__PURE__ */ S("form", { ...e, onSubmit: (n) => {
  var r;
  n.persist(), n.preventDefault(), (r = e.onSubmit) == null || r.call(e, n);
} }), xL = ({ children: e, className: t = "", size: n, ...r }) => /* @__PURE__ */ Z(
  "label",
  {
    "data-disabled": r.disabled,
    "aria-disabled": r.disabled,
    className: "group font-normal flex items-center gap-2 data-[disabled=true]:cursor-not-allowed",
    children: [
      /* @__PURE__ */ S(
        "input",
        {
          ...r,
          type: "radio",
          className: bt(
            "form-radio rounded-full h-4 w-4 app border-card-border text-primary focus:ring-primary appearance-none inline-block bg-origin-border group-aria-disabled:cursor-not-allowed disabled:opacity-70",
            t
          ),
          ...r
        }
      ),
      e
    ]
  }
), TL = ut(({ children: e, container: t, error: n, ...r }, o) => {
  const i = Yn(), [s, a] = Me(!1), l = r.checked ?? s, c = (u) => {
    var h;
    const f = u.target.dataset.checked !== "true";
    a(f), (h = r == null ? void 0 : r.onCheck) == null || h.call(r, f);
  };
  return /* @__PURE__ */ Z("fieldset", { className: bt("flex flex-wrap items-center", t), children: [
    /* @__PURE__ */ S("input", { ...r, ref: o, hidden: !0, type: "checkbox", checked: l, onChange: (u) => a(u.target.checked) }),
    /* @__PURE__ */ S(
      "button",
      {
        type: "button",
        role: "switch",
        onClick: c,
        "aria-checked": l,
        "data-checked": l,
        "aria-labelledby": `${i}-label`,
        className: "duration-300 ease-in-out relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 data-[checked=false]:bg-input-switch-bg data-[checked=true]:bg-primary",
        children: /* @__PURE__ */ S(
          "span",
          {
            "aria-hidden": "true",
            "data-checked": l,
            className: "duration-300 duration-300 ease-in-out inline-block aspect-square size-5 transform rounded-full shadow ring-0 transition data-[checked=false]:translate-x-0 data-[checked=true]:translate-x-5 data-[checked=false]:bg-disabled data-[checked=true]:bg-input-switch"
          }
        )
      }
    ),
    /* @__PURE__ */ S("span", { className: "ml-3 text-sm", id: `${i}-label`, children: /* @__PURE__ */ S("span", { className: "font-medium text-foreground", children: e }) }),
    /* @__PURE__ */ S("span", { className: "mt-1 flex-1 whitespace-nowrap text-xs text-danger empty:mt-0 empty:hidden", children: n })
  ] });
}), tl = 0, Er = 1, ni = 2, Yb = 4;
function ji(e, t) {
  return (n) => e(t(n));
}
function vD(e, t) {
  return t(e);
}
function qb(e, t) {
  return (n) => e(t, n);
}
function Cm(e, t) {
  return () => e(t);
}
function nl(e, t) {
  return t(e), e;
}
function et(...e) {
  return e;
}
function bD(e) {
  e();
}
function Pm(e) {
  return () => e;
}
function wD(...e) {
  return () => {
    e.map(bD);
  };
}
function Md(e) {
  return e !== void 0;
}
function eo() {
}
function ze(e, t) {
  return e(Er, t);
}
function we(e, t) {
  e(tl, t);
}
function Nd(e) {
  e(ni);
}
function $t(e) {
  return e(Yb);
}
function de(e, t) {
  return ze(e, qb(t, tl));
}
function _n(e, t) {
  const n = e(Er, (r) => {
    n(), t(r);
  });
  return n;
}
function Re() {
  const e = [];
  return (t, n) => {
    switch (t) {
      case ni:
        e.splice(0, e.length);
        return;
      case Er:
        return e.push(n), () => {
          const r = e.indexOf(n);
          r > -1 && e.splice(r, 1);
        };
      case tl:
        e.slice().forEach((r) => {
          r(n);
        });
        return;
      default:
        throw new Error(`unrecognized action ${t}`);
    }
  };
}
function Q(e) {
  let t = e;
  const n = Re();
  return (r, o) => {
    switch (r) {
      case Er:
        o(t);
        break;
      case tl:
        t = o;
        break;
      case Yb:
        return t;
    }
    return n(r, o);
  };
}
function xD(e) {
  let t, n;
  const r = () => t && t();
  return function(o, i) {
    switch (o) {
      case Er:
        return i ? n === i ? void 0 : (r(), n = i, t = ze(e, i), t) : (r(), eo);
      case ni:
        r(), n = null;
        return;
      default:
        throw new Error(`unrecognized action ${o}`);
    }
  };
}
function en(e) {
  return nl(Re(), (t) => de(e, t));
}
function jt(e, t) {
  return nl(Q(t), (n) => de(e, n));
}
function TD(...e) {
  return (t) => e.reduceRight(vD, t);
}
function q(e, ...t) {
  const n = TD(...t);
  return (r, o) => {
    switch (r) {
      case Er:
        return ze(e, n(o));
      case ni:
        Nd(e);
        return;
    }
  };
}
function Kb(e, t) {
  return e === t;
}
function Je(e = Kb) {
  let t;
  return (n) => (r) => {
    e(t, r) || (t = r, n(r));
  };
}
function pe(e) {
  return (t) => (n) => {
    e(n) && t(n);
  };
}
function se(e) {
  return (t) => ji(t, e);
}
function Sn(e) {
  return (t) => () => t(e);
}
function Rn(e, t) {
  return (n) => (r) => n(t = e(t, r));
}
function $o(e) {
  return (t) => (n) => {
    e > 0 ? e-- : t(n);
  };
}
function sr(e) {
  let t = null, n;
  return (r) => (o) => {
    t = o, !n && (n = setTimeout(() => {
      n = void 0, r(t);
    }, e));
  };
}
function Rm(e) {
  let t, n;
  return (r) => (o) => {
    t = o, n && clearTimeout(n), n = setTimeout(() => {
      r(t);
    }, e);
  };
}
function Te(...e) {
  const t = new Array(e.length);
  let n = 0, r = null;
  const o = Math.pow(2, e.length) - 1;
  return e.forEach((i, s) => {
    const a = Math.pow(2, s);
    ze(i, (l) => {
      const c = n;
      n = n | a, t[s] = l, c !== o && n === o && r && (r(), r = null);
    });
  }), (i) => (s) => {
    const a = () => i([s].concat(t));
    n === o ? a() : r = a;
  };
}
function km(...e) {
  return function(t, n) {
    switch (t) {
      case Er:
        return wD(...e.map((r) => ze(r, n)));
      case ni:
        return;
      default:
        throw new Error(`unrecognized action ${t}`);
    }
  };
}
function ge(e, t = Kb) {
  return q(e, Je(t));
}
function Rt(...e) {
  const t = Re(), n = new Array(e.length);
  let r = 0;
  const o = Math.pow(2, e.length) - 1;
  return e.forEach((i, s) => {
    const a = Math.pow(2, s);
    ze(i, (l) => {
      n[s] = l, r = r | a, r === o && we(t, n);
    });
  }), function(i, s) {
    switch (i) {
      case Er:
        return r === o && s(n), ze(t, s);
      case ni:
        return Nd(t);
      default:
        throw new Error(`unrecognized action ${i}`);
    }
  };
}
function Le(e, t = [], { singleton: n } = { singleton: !0 }) {
  return {
    id: SD(),
    constructor: e,
    dependencies: t,
    singleton: n
  };
}
const SD = () => Symbol();
function ED(e) {
  const t = /* @__PURE__ */ new Map(), n = ({ id: r, constructor: o, dependencies: i, singleton: s }) => {
    if (s && t.has(r))
      return t.get(r);
    const a = o(i.map((l) => n(l)));
    return s && t.set(r, a), a;
  };
  return n(e);
}
function CD(e, t) {
  const n = {}, r = {};
  let o = 0;
  const i = e.length;
  for (; o < i; )
    r[e[o]] = 1, o += 1;
  for (const s in t)
    r.hasOwnProperty(s) || (n[s] = t[s]);
  return n;
}
const Rs = typeof document < "u" ? F.useLayoutEffect : F.useEffect;
function Fd(e, t, n) {
  const r = Object.keys(t.required || {}), o = Object.keys(t.optional || {}), i = Object.keys(t.methods || {}), s = Object.keys(t.events || {}), a = F.createContext({});
  function l(v, b) {
    v.propsReady && we(v.propsReady, !1);
    for (const y of r) {
      const x = v[t.required[y]];
      we(x, b[y]);
    }
    for (const y of o)
      if (y in b) {
        const x = v[t.optional[y]];
        we(x, b[y]);
      }
    v.propsReady && we(v.propsReady, !0);
  }
  function c(v) {
    return i.reduce((b, y) => (b[y] = (x) => {
      const w = v[t.methods[y]];
      we(w, x);
    }, b), {});
  }
  function u(v) {
    return s.reduce((b, y) => (b[y] = xD(v[t.events[y]]), b), {});
  }
  const d = F.forwardRef((v, b) => {
    const { children: y, ...x } = v, [w] = F.useState(() => nl(ED(e), (P) => l(P, x))), [T] = F.useState(Cm(u, w));
    return Rs(() => {
      for (const P of s)
        P in x && ze(T[P], x[P]);
      return () => {
        Object.values(T).map(Nd);
      };
    }, [x, T, w]), Rs(() => {
      l(w, x);
    }), F.useImperativeHandle(b, Pm(c(w))), F.createElement(
      a.Provider,
      { value: w },
      n ? F.createElement(
        n,
        CD([...r, ...o, ...s], x),
        y
      ) : y
    );
  }), f = (v) => F.useCallback(qb(we, F.useContext(a)[v]), [v]), h = (v) => {
    const y = F.useContext(a)[v], x = F.useCallback(
      (w) => ze(y, w),
      [y]
    );
    return F.useSyncExternalStore(
      x,
      () => $t(y),
      () => $t(y)
    );
  }, p = (v) => {
    const y = F.useContext(a)[v], [x, w] = F.useState(Cm($t, y));
    return Rs(
      () => ze(y, (T) => {
        T !== x && w(Pm(T));
      }),
      [y, x]
    ), x;
  }, m = F.version.startsWith("18") ? h : p;
  return {
    Component: d,
    usePublisher: f,
    useEmitterValue: m,
    useEmitter: (v, b) => {
      const x = F.useContext(a)[v];
      Rs(() => ze(x, b), [b, x]);
    }
  };
}
const PD = typeof document < "u" ? F.useLayoutEffect : F.useEffect, RD = PD;
var tn = /* @__PURE__ */ ((e) => (e[e.DEBUG = 0] = "DEBUG", e[e.INFO = 1] = "INFO", e[e.WARN = 2] = "WARN", e[e.ERROR = 3] = "ERROR", e))(tn || {});
const kD = {
  0: "debug",
  1: "log",
  2: "warn",
  3: "error"
}, OD = () => typeof globalThis > "u" ? window : globalThis, Cr = Le(
  () => {
    const e = Q(
      3
      /* ERROR */
    );
    return {
      log: Q((n, r, o = 1) => {
        var i;
        const s = (i = OD().VIRTUOSO_LOG_LEVEL) != null ? i : $t(e);
        o >= s && console[kD[o]](
          "%creact-virtuoso: %c%s %o",
          "color: #0253b3; font-weight: bold",
          "color: initial",
          n,
          r
        );
      }),
      logLevel: e
    };
  },
  [],
  { singleton: !0 }
);
function Ld(e, t = !0) {
  const n = F.useRef(null);
  let r = (o) => {
  };
  if (typeof ResizeObserver < "u") {
    const o = F.useMemo(() => new ResizeObserver((i) => {
      requestAnimationFrame(() => {
        const s = i[0].target;
        s.offsetParent !== null && e(s);
      });
    }), [e]);
    r = (i) => {
      i && t ? (o.observe(i), n.current = i) : (n.current && o.unobserve(n.current), n.current = null);
    };
  }
  return { ref: n, callbackRef: r };
}
function An(e, t = !0) {
  return Ld(e, t).callbackRef;
}
function Zb(e, t, n, r, o, i, s) {
  const a = F.useCallback(
    (l) => {
      const c = ID(l.children, t, "offsetHeight", o);
      let u = l.parentElement;
      for (; !u.dataset.virtuosoScroller; )
        u = u.parentElement;
      const d = u.lastElementChild.dataset.viewportType === "window", f = s ? s.scrollTop : d ? window.pageYOffset || document.documentElement.scrollTop : u.scrollTop, h = s ? s.scrollHeight : d ? document.documentElement.scrollHeight : u.scrollHeight, p = s ? s.offsetHeight : d ? window.innerHeight : u.offsetHeight;
      r({
        scrollTop: Math.max(f, 0),
        scrollHeight: h,
        viewportHeight: p
      }), i == null || i(_D("row-gap", getComputedStyle(l).rowGap, o)), c !== null && e(c);
    },
    [e, t, o, i, s, r]
  );
  return Ld(a, n);
}
function ID(e, t, n, r) {
  const o = e.length;
  if (o === 0)
    return null;
  const i = [];
  for (let s = 0; s < o; s++) {
    const a = e.item(s);
    if (!a || a.dataset.index === void 0)
      continue;
    const l = parseInt(a.dataset.index), c = parseFloat(a.dataset.knownSize), u = t(a, n);
    if (u === 0 && r("Zero-sized element, this should not happen", { child: a }, tn.ERROR), u === c)
      continue;
    const d = i[i.length - 1];
    i.length === 0 || d.size !== u || d.endIndex !== l - 1 ? i.push({ startIndex: l, endIndex: l, size: u }) : i[i.length - 1].endIndex++;
  }
  return i;
}
function _D(e, t, n) {
  return t !== "normal" && !(t != null && t.endsWith("px")) && n(`${e} was not resolved to pixel value correctly`, t, tn.WARN), t === "normal" ? 0 : parseInt(t ?? "0", 10);
}
function pn(e, t) {
  return Math.round(e.getBoundingClientRect()[t]);
}
function Xb(e, t) {
  return Math.abs(e - t) < 1.01;
}
function Qb(e, t, n, r = eo, o) {
  const i = F.useRef(null), s = F.useRef(null), a = F.useRef(null), l = F.useCallback(
    (d) => {
      const f = d.target, h = f === window || f === document, p = h ? window.pageYOffset || document.documentElement.scrollTop : f.scrollTop, m = h ? document.documentElement.scrollHeight : f.scrollHeight, g = h ? window.innerHeight : f.offsetHeight, v = () => {
        e({
          scrollTop: Math.max(p, 0),
          scrollHeight: m,
          viewportHeight: g
        });
      };
      d.suppressFlushSync ? v() : Y0.flushSync(v), s.current !== null && (p === s.current || p <= 0 || p === m - g) && (s.current = null, t(!0), a.current && (clearTimeout(a.current), a.current = null));
    },
    [e, t]
  );
  F.useEffect(() => {
    const d = o || i.current;
    return r(o || i.current), l({ target: d, suppressFlushSync: !0 }), d.addEventListener("scroll", l, { passive: !0 }), () => {
      r(null), d.removeEventListener("scroll", l);
    };
  }, [i, l, n, r, o]);
  function c(d) {
    const f = i.current;
    if (!f || "offsetHeight" in f && f.offsetHeight === 0)
      return;
    const h = d.behavior === "smooth";
    let p, m, g;
    f === window ? (m = Math.max(pn(document.documentElement, "height"), document.documentElement.scrollHeight), p = window.innerHeight, g = document.documentElement.scrollTop) : (m = f.scrollHeight, p = pn(f, "height"), g = f.scrollTop);
    const v = m - p;
    if (d.top = Math.ceil(Math.max(Math.min(v, d.top), 0)), Xb(p, m) || d.top === g) {
      e({ scrollTop: g, scrollHeight: m, viewportHeight: p }), h && t(!0);
      return;
    }
    h ? (s.current = d.top, a.current && clearTimeout(a.current), a.current = setTimeout(() => {
      a.current = null, s.current = null, t(!0);
    }, 1e3)) : s.current = null, f.scrollTo(d);
  }
  function u(d) {
    i.current.scrollBy(d);
  }
  return { scrollerRef: i, scrollByCallback: u, scrollToCallback: c };
}
const Ut = Le(
  () => {
    const e = Re(), t = Re(), n = Q(0), r = Re(), o = Q(0), i = Re(), s = Re(), a = Q(0), l = Q(0), c = Q(0), u = Q(0), d = Re(), f = Re(), h = Q(!1);
    return de(
      q(
        e,
        se(({ scrollTop: p }) => p)
      ),
      t
    ), de(
      q(
        e,
        se(({ scrollHeight: p }) => p)
      ),
      s
    ), de(t, o), {
      // input
      scrollContainerState: e,
      scrollTop: t,
      viewportHeight: i,
      headerHeight: a,
      fixedHeaderHeight: l,
      fixedFooterHeight: c,
      footerHeight: u,
      scrollHeight: s,
      smoothScrollTargetReached: r,
      // signals
      scrollTo: d,
      scrollBy: f,
      // state
      statefulScrollTop: o,
      deviation: n,
      scrollingInProgress: h
    };
  },
  [],
  { singleton: !0 }
), Bi = { lvl: 0 };
function Jb(e, t, n, r = Bi, o = Bi) {
  return { k: e, v: t, lvl: n, l: r, r: o };
}
function Ge(e) {
  return e === Bi;
}
function xo() {
  return Bi;
}
function cu(e, t) {
  if (Ge(e))
    return Bi;
  const { k: n, l: r, r: o } = e;
  if (t === n) {
    if (Ge(r))
      return o;
    if (Ge(o))
      return r;
    {
      const [i, s] = e0(r);
      return Vs(St(e, { k: i, v: s, l: t0(r) }));
    }
  } else return t < n ? Vs(St(e, { l: cu(r, t) })) : Vs(St(e, { r: cu(o, t) }));
}
function zi(e, t) {
  if (!Ge(e))
    return t === e.k ? e.v : t < e.k ? zi(e.l, t) : zi(e.r, t);
}
function mn(e, t, n = "k") {
  if (Ge(e))
    return [-1 / 0, void 0];
  if (Number(e[n]) === t)
    return [e.k, e.v];
  if (Number(e[n]) < t) {
    const r = mn(e.r, t, n);
    return r[0] === -1 / 0 ? [e.k, e.v] : r;
  }
  return mn(e.l, t, n);
}
function Jt(e, t, n) {
  return Ge(e) ? Jb(t, n, 1) : t === e.k ? St(e, { k: t, v: n }) : t < e.k ? Om(St(e, { l: Jt(e.l, t, n) })) : Om(St(e, { r: Jt(e.r, t, n) }));
}
function uu(e, t, n) {
  if (Ge(e))
    return [];
  const { k: r, v: o, l: i, r: s } = e;
  let a = [];
  return r > t && (a = a.concat(uu(i, t, n))), r >= t && r <= n && a.push({ k: r, v: o }), r <= n && (a = a.concat(uu(s, t, n))), a;
}
function Br(e) {
  return Ge(e) ? [] : [...Br(e.l), { k: e.k, v: e.v }, ...Br(e.r)];
}
function e0(e) {
  return Ge(e.r) ? [e.k, e.v] : e0(e.r);
}
function t0(e) {
  return Ge(e.r) ? e.l : Vs(St(e, { r: t0(e.r) }));
}
function St(e, t) {
  return Jb(
    t.k !== void 0 ? t.k : e.k,
    t.v !== void 0 ? t.v : e.v,
    t.lvl !== void 0 ? t.lvl : e.lvl,
    t.l !== void 0 ? t.l : e.l,
    t.r !== void 0 ? t.r : e.r
  );
}
function cc(e) {
  return Ge(e) || e.lvl > e.r.lvl;
}
function Om(e) {
  return du(r0(e));
}
function Vs(e) {
  const { l: t, r: n, lvl: r } = e;
  if (n.lvl >= r - 1 && t.lvl >= r - 1)
    return e;
  if (r > n.lvl + 1) {
    if (cc(t))
      return r0(St(e, { lvl: r - 1 }));
    if (!Ge(t) && !Ge(t.r))
      return St(t.r, {
        l: St(t, { r: t.r.l }),
        r: St(e, {
          l: t.r.r,
          lvl: r - 1
        }),
        lvl: r
      });
    throw new Error("Unexpected empty nodes");
  } else {
    if (cc(e))
      return du(St(e, { lvl: r - 1 }));
    if (!Ge(n) && !Ge(n.l)) {
      const o = n.l, i = cc(o) ? n.lvl - 1 : n.lvl;
      return St(o, {
        l: St(e, {
          r: o.l,
          lvl: r - 1
        }),
        r: du(St(n, { l: o.r, lvl: i })),
        lvl: o.lvl + 1
      });
    } else
      throw new Error("Unexpected empty nodes");
  }
}
function rl(e, t, n) {
  if (Ge(e))
    return [];
  const r = mn(e, t)[0];
  return AD(uu(e, r, n));
}
function n0(e, t) {
  const n = e.length;
  if (n === 0)
    return [];
  let { index: r, value: o } = t(e[0]);
  const i = [];
  for (let s = 1; s < n; s++) {
    const { index: a, value: l } = t(e[s]);
    i.push({ start: r, end: a - 1, value: o }), r = a, o = l;
  }
  return i.push({ start: r, end: 1 / 0, value: o }), i;
}
function AD(e) {
  return n0(e, ({ k: t, v: n }) => ({ index: t, value: n }));
}
function du(e) {
  const { r: t, lvl: n } = e;
  return !Ge(t) && !Ge(t.r) && t.lvl === n && t.r.lvl === n ? St(t, { l: St(e, { r: t.l }), lvl: n + 1 }) : e;
}
function r0(e) {
  const { l: t } = e;
  return !Ge(t) && t.lvl === e.lvl ? St(t, { r: St(e, { l: t.r }) }) : e;
}
function pa(e, t, n, r = 0) {
  let o = e.length - 1;
  for (; r <= o; ) {
    const i = Math.floor((r + o) / 2), s = e[i], a = n(s, t);
    if (a === 0)
      return i;
    if (a === -1) {
      if (o - r < 2)
        return i - 1;
      o = i - 1;
    } else {
      if (o === r)
        return i;
      r = i + 1;
    }
  }
  throw new Error(`Failed binary finding record in array - ${e.join(",")}, searched for ${t}`);
}
function o0(e, t, n) {
  return e[pa(e, t, n)];
}
function DD(e, t, n, r) {
  const o = pa(e, t, r), i = pa(e, n, r, o);
  return e.slice(o, i + 1);
}
const Vd = Le(
  () => ({ recalcInProgress: Q(!1) }),
  [],
  { singleton: !0 }
);
function MD(e) {
  const { size: t, startIndex: n, endIndex: r } = e;
  return (o) => o.start === n && (o.end === r || o.end === 1 / 0) && o.value === t;
}
function Im(e, t) {
  let n = 0, r = 0;
  for (; n < e; )
    n += t[r + 1] - t[r] - 1, r++;
  return r - (n === e ? 0 : 1);
}
function ND(e, t) {
  let n = Ge(e) ? 0 : 1 / 0;
  for (const r of t) {
    const { size: o, startIndex: i, endIndex: s } = r;
    if (n = Math.min(n, i), Ge(e)) {
      e = Jt(e, 0, o);
      continue;
    }
    const a = rl(e, i - 1, s + 1);
    if (a.some(MD(r)))
      continue;
    let l = !1, c = !1;
    for (const { start: u, end: d, value: f } of a)
      l ? (s >= u || o === f) && (e = cu(e, u)) : (c = f !== o, l = !0), d > s && s >= u && f !== o && (e = Jt(e, s + 1, f));
    c && (e = Jt(e, i, o));
  }
  return [e, n];
}
function FD() {
  return {
    offsetTree: [],
    sizeTree: xo(),
    groupOffsetTree: xo(),
    lastIndex: 0,
    lastOffset: 0,
    lastSize: 0,
    groupIndices: []
  };
}
function $d({ index: e }, t) {
  return t === e ? 0 : t < e ? -1 : 1;
}
function LD({ offset: e }, t) {
  return t === e ? 0 : t < e ? -1 : 1;
}
function VD(e) {
  return { index: e.index, value: e };
}
function $D(e, t, n, r = 0) {
  return r > 0 && (t = Math.max(t, o0(e, r, $d).offset)), n0(DD(e, t, n, LD), VD);
}
function fu(e, t, n, r) {
  let o = e, i = 0, s = 0, a = 0, l = 0;
  if (t !== 0) {
    l = pa(o, t - 1, $d), a = o[l].offset;
    const u = mn(n, t - 1);
    i = u[0], s = u[1], o.length && o[l].size === mn(n, t)[1] && (l -= 1), o = o.slice(0, l + 1);
  } else
    o = [];
  for (const { start: c, value: u } of rl(n, t, 1 / 0)) {
    const d = c - i, f = d * s + a + d * r;
    o.push({
      offset: f,
      size: u,
      index: c
    }), i = c, a = f, s = u;
  }
  return {
    offsetTree: o,
    lastIndex: i,
    lastOffset: a,
    lastSize: s
  };
}
function jD(e, [t, n, r, o]) {
  t.length > 0 && r("received item sizes", t, tn.DEBUG);
  const i = e.sizeTree;
  let s = i, a = 0;
  if (n.length > 0 && Ge(i) && t.length === 2) {
    const f = t[0].size, h = t[1].size;
    s = n.reduce((p, m) => Jt(Jt(p, m, f), m + 1, h), s);
  } else
    [s, a] = ND(s, t);
  if (s === i)
    return e;
  const { offsetTree: l, lastIndex: c, lastSize: u, lastOffset: d } = fu(e.offsetTree, a, s, o);
  return {
    sizeTree: s,
    offsetTree: l,
    lastIndex: c,
    lastOffset: d,
    lastSize: u,
    groupOffsetTree: n.reduce((f, h) => Jt(f, h, Wi(h, l, o)), xo()),
    groupIndices: n
  };
}
function Wi(e, t, n) {
  if (t.length === 0)
    return 0;
  const { offset: r, index: o, size: i } = o0(t, e, $d), s = e - o, a = i * s + (s - 1) * n + r;
  return a > 0 ? a + n : a;
}
function BD(e) {
  return typeof e.groupIndex < "u";
}
function i0(e, t, n) {
  if (BD(e))
    return t.groupIndices[e.groupIndex] + 1;
  {
    const r = e.index === "LAST" ? n : e.index;
    let o = s0(r, t);
    return o = Math.max(0, o, Math.min(n, o)), o;
  }
}
function s0(e, t) {
  if (!ol(t))
    return e;
  let n = 0;
  for (; t.groupIndices[n] <= e + n; )
    n++;
  return e + n;
}
function ol(e) {
  return !Ge(e.groupOffsetTree);
}
function zD(e) {
  return Br(e).map(({ k: t, v: n }, r, o) => {
    const i = o[r + 1], s = i ? i.k - 1 : 1 / 0;
    return { startIndex: t, endIndex: s, size: n };
  });
}
const WD = {
  offsetHeight: "height",
  offsetWidth: "width"
}, Mn = Le(
  ([{ log: e }, { recalcInProgress: t }]) => {
    const n = Re(), r = Re(), o = jt(r, 0), i = Re(), s = Re(), a = Q(0), l = Q([]), c = Q(void 0), u = Q(void 0), d = Q((w, T) => pn(w, WD[T])), f = Q(void 0), h = Q(0), p = FD(), m = jt(
      q(n, Te(l, e, h), Rn(jD, p), Je()),
      p
    ), g = jt(
      q(
        l,
        Je(),
        Rn((w, T) => ({ prev: w.current, current: T }), {
          prev: [],
          current: []
        }),
        se(({ prev: w }) => w)
      ),
      []
    );
    de(
      q(
        l,
        pe((w) => w.length > 0),
        Te(m, h),
        se(([w, T, P]) => {
          const I = w.reduce((_, R, L) => Jt(_, R, Wi(R, T.offsetTree, P) || L), xo());
          return {
            ...T,
            groupIndices: w,
            groupOffsetTree: I
          };
        })
      ),
      m
    ), de(
      q(
        r,
        Te(m),
        pe(([w, { lastIndex: T }]) => w < T),
        se(([w, { lastIndex: T, lastSize: P }]) => [
          {
            startIndex: w,
            endIndex: T,
            size: P
          }
        ])
      ),
      n
    ), de(c, u);
    const v = jt(
      q(
        c,
        se((w) => w === void 0)
      ),
      !0
    );
    de(
      q(
        u,
        pe((w) => w !== void 0 && Ge($t(m).sizeTree)),
        se((w) => [{ startIndex: 0, endIndex: 0, size: w }])
      ),
      n
    );
    const b = en(
      q(
        n,
        Te(m),
        Rn(
          ({ sizes: w }, [T, P]) => ({
            changed: P !== w,
            sizes: P
          }),
          { changed: !1, sizes: p }
        ),
        se((w) => w.changed)
      )
    );
    ze(
      q(
        a,
        Rn(
          (w, T) => ({ diff: w.prev - T, prev: T }),
          { diff: 0, prev: 0 }
        ),
        se((w) => w.diff)
      ),
      (w) => {
        const { groupIndices: T } = $t(m);
        if (w > 0)
          we(t, !0), we(i, w + Im(w, T));
        else if (w < 0) {
          const P = $t(g);
          P.length > 0 && (w -= Im(-w, P)), we(s, w);
        }
      }
    ), ze(q(a, Te(e)), ([w, T]) => {
      w < 0 && T(
        "`firstItemIndex` prop should not be set to less than zero. If you don't know the total count, just use a very high value",
        { firstItemIndex: a },
        tn.ERROR
      );
    });
    const y = en(i);
    de(
      q(
        i,
        Te(m),
        se(([w, T]) => {
          const P = T.groupIndices.length > 0, I = [], _ = T.lastSize;
          if (P) {
            const R = zi(T.sizeTree, 0);
            let L = 0, M = 0;
            for (; L < w; ) {
              const k = T.groupIndices[M], A = T.groupIndices.length === M + 1 ? 1 / 0 : T.groupIndices[M + 1] - k - 1;
              I.push({
                startIndex: k,
                endIndex: k,
                size: R
              }), I.push({
                startIndex: k + 1,
                endIndex: k + 1 + A - 1,
                size: _
              }), M++, L += A + 1;
            }
            const V = Br(T.sizeTree);
            return L !== w && V.shift(), V.reduce(
              (k, { k: A, v: N }) => {
                let H = k.ranges;
                return k.prevSize !== 0 && (H = [
                  ...k.ranges,
                  {
                    startIndex: k.prevIndex,
                    endIndex: A + w - 1,
                    size: k.prevSize
                  }
                ]), {
                  ranges: H,
                  prevIndex: A + w,
                  prevSize: N
                };
              },
              {
                ranges: I,
                prevIndex: w,
                prevSize: 0
              }
            ).ranges;
          }
          return Br(T.sizeTree).reduce(
            (R, { k: L, v: M }) => ({
              ranges: [...R.ranges, { startIndex: R.prevIndex, endIndex: L + w - 1, size: R.prevSize }],
              prevIndex: L + w,
              prevSize: M
            }),
            {
              ranges: [],
              prevIndex: 0,
              prevSize: _
            }
          ).ranges;
        })
      ),
      n
    );
    const x = en(
      q(
        s,
        Te(m, h),
        se(([w, { offsetTree: T }, P]) => {
          const I = -w;
          return Wi(I, T, P);
        })
      )
    );
    return de(
      q(
        s,
        Te(m, h),
        se(([w, T, P]) => {
          if (T.groupIndices.length > 0) {
            if (Ge(T.sizeTree))
              return T;
            let _ = xo();
            const R = $t(g);
            let L = 0, M = 0, V = 0;
            for (; L < -w; ) {
              V = R[M];
              const k = R[M + 1] - V - 1;
              M++, L += k + 1;
            }
            if (_ = Br(T.sizeTree).reduce((k, { k: A, v: N }) => Jt(k, Math.max(0, A + w), N), _), L !== -w) {
              const k = zi(T.sizeTree, V);
              _ = Jt(_, 0, k);
              const A = mn(T.sizeTree, -w + 1)[1];
              _ = Jt(_, 1, A);
            }
            return {
              ...T,
              sizeTree: _,
              ...fu(T.offsetTree, 0, _, P)
            };
          } else {
            const _ = Br(T.sizeTree).reduce((R, { k: L, v: M }) => Jt(R, Math.max(0, L + w), M), xo());
            return {
              ...T,
              sizeTree: _,
              ...fu(T.offsetTree, 0, _, P)
            };
          }
        })
      ),
      m
    ), {
      // input
      data: f,
      totalCount: r,
      sizeRanges: n,
      groupIndices: l,
      defaultItemSize: u,
      fixedItemSize: c,
      unshiftWith: i,
      shiftWith: s,
      shiftWithOffset: x,
      beforeUnshiftWith: y,
      firstItemIndex: a,
      gap: h,
      // output
      sizes: m,
      listRefresh: b,
      statefulTotalCount: o,
      trackItemSizes: v,
      itemSize: d
    };
  },
  et(Cr, Vd),
  { singleton: !0 }
), HD = typeof document < "u" && "scrollBehavior" in document.documentElement.style;
function a0(e) {
  const t = typeof e == "number" ? { index: e } : e;
  return t.align || (t.align = "start"), (!t.behavior || !HD) && (t.behavior = "auto"), t.offset || (t.offset = 0), t;
}
const ds = Le(
  ([
    { sizes: e, totalCount: t, listRefresh: n, gap: r },
    {
      scrollingInProgress: o,
      viewportHeight: i,
      scrollTo: s,
      smoothScrollTargetReached: a,
      headerHeight: l,
      footerHeight: c,
      fixedHeaderHeight: u,
      fixedFooterHeight: d
    },
    { log: f }
  ]) => {
    const h = Re(), p = Re(), m = Q(0);
    let g = null, v = null, b = null;
    function y() {
      g && (g(), g = null), b && (b(), b = null), v && (clearTimeout(v), v = null), we(o, !1);
    }
    return de(
      q(
        h,
        Te(e, i, t, m, l, c, f),
        Te(r, u, d),
        se(
          ([
            [x, w, T, P, I, _, R, L],
            M,
            V,
            E
          ]) => {
            const k = a0(x), { align: A, behavior: N, offset: H } = k, Y = P - 1, C = i0(k, w, Y);
            let $ = Wi(C, w.offsetTree, M) + _;
            A === "end" ? ($ += V + mn(w.sizeTree, C)[1] - T + E, C === Y && ($ += R)) : A === "center" ? $ += (V + mn(w.sizeTree, C)[1] - T + E) / 2 : $ -= I, H && ($ += H);
            const X = (re) => {
              y(), re ? (L("retrying to scroll to", { location: x }, tn.DEBUG), we(h, x)) : (we(p, !0), L("list did not change, scroll successful", {}, tn.DEBUG));
            };
            if (y(), N === "smooth") {
              let re = !1;
              b = ze(n, (ee) => {
                re = re || ee;
              }), g = _n(a, () => {
                X(re);
              });
            } else
              g = _n(q(n, UD(150)), X);
            return v = setTimeout(() => {
              y();
            }, 1200), we(o, !0), L("scrolling from index to", { index: C, top: $, behavior: N }, tn.DEBUG), { top: $, behavior: N };
          }
        )
      ),
      s
    ), {
      scrollToIndex: h,
      scrollTargetReached: p,
      topListHeight: m
    };
  },
  et(Mn, Ut, Cr),
  { singleton: !0 }
);
function UD(e) {
  return (t) => {
    const n = setTimeout(() => {
      t(!1);
    }, e);
    return (r) => {
      r && (t(!0), clearTimeout(n));
    };
  };
}
const Hi = "up", Ci = "down", GD = "none", YD = {
  atBottom: !1,
  notAtBottomBecause: "NOT_SHOWING_LAST_ITEM",
  state: {
    offsetBottom: 0,
    scrollTop: 0,
    viewportHeight: 0,
    scrollHeight: 0
  }
}, qD = 0, fs = Le(([{ scrollContainerState: e, scrollTop: t, viewportHeight: n, headerHeight: r, footerHeight: o, scrollBy: i }]) => {
  const s = Q(!1), a = Q(!0), l = Re(), c = Re(), u = Q(4), d = Q(qD), f = jt(
    q(
      km(q(ge(t), $o(1), Sn(!0)), q(ge(t), $o(1), Sn(!1), Rm(100))),
      Je()
    ),
    !1
  ), h = jt(
    q(km(q(i, Sn(!0)), q(i, Sn(!1), Rm(200))), Je()),
    !1
  );
  de(
    q(
      Rt(ge(t), ge(d)),
      se(([b, y]) => b <= y),
      Je()
    ),
    a
  ), de(q(a, sr(50)), c);
  const p = en(
    q(
      Rt(e, ge(n), ge(r), ge(o), ge(u)),
      Rn((b, [{ scrollTop: y, scrollHeight: x }, w, T, P, I]) => {
        const _ = y + w - x > -I, R = {
          viewportHeight: w,
          scrollTop: y,
          scrollHeight: x
        };
        if (_) {
          let M, V;
          return y > b.state.scrollTop ? (M = "SCROLLED_DOWN", V = b.state.scrollTop - y) : (M = "SIZE_DECREASED", V = b.state.scrollTop - y || b.scrollTopDelta), {
            atBottom: !0,
            state: R,
            atBottomBecause: M,
            scrollTopDelta: V
          };
        }
        let L;
        return R.scrollHeight > b.state.scrollHeight ? L = "SIZE_INCREASED" : w < b.state.viewportHeight ? L = "VIEWPORT_HEIGHT_DECREASING" : y < b.state.scrollTop ? L = "SCROLLING_UPWARDS" : L = "NOT_FULLY_SCROLLED_TO_LAST_ITEM_BOTTOM", {
          atBottom: !1,
          notAtBottomBecause: L,
          state: R
        };
      }, YD),
      Je((b, y) => b && b.atBottom === y.atBottom)
    )
  ), m = jt(
    q(
      e,
      Rn(
        (b, { scrollTop: y, scrollHeight: x, viewportHeight: w }) => {
          if (Xb(b.scrollHeight, x))
            return {
              scrollTop: y,
              scrollHeight: x,
              jump: 0,
              changed: !1
            };
          {
            const T = x - (y + w) < 1;
            return b.scrollTop !== y && T ? {
              scrollHeight: x,
              scrollTop: y,
              jump: b.scrollTop - y,
              changed: !0
            } : {
              scrollHeight: x,
              scrollTop: y,
              jump: 0,
              changed: !0
            };
          }
        },
        { scrollHeight: 0, jump: 0, scrollTop: 0, changed: !1 }
      ),
      pe((b) => b.changed),
      se((b) => b.jump)
    ),
    0
  );
  de(
    q(
      p,
      se((b) => b.atBottom)
    ),
    s
  ), de(q(s, sr(50)), l);
  const g = Q(Ci);
  de(
    q(
      e,
      se(({ scrollTop: b }) => b),
      Je(),
      Rn(
        (b, y) => $t(h) ? { direction: b.direction, prevScrollTop: y } : { direction: y < b.prevScrollTop ? Hi : Ci, prevScrollTop: y },
        { direction: Ci, prevScrollTop: 0 }
      ),
      se((b) => b.direction)
    ),
    g
  ), de(q(e, sr(50), Sn(GD)), g);
  const v = Q(0);
  return de(
    q(
      f,
      pe((b) => !b),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      Sn(0)
    ),
    v
  ), de(
    q(
      t,
      sr(100),
      Te(f),
      pe(([b, y]) => !!y),
      Rn(([b, y], [x]) => [y, x], [0, 0]),
      se(([b, y]) => y - b)
    ),
    v
  ), {
    isScrolling: f,
    isAtTop: a,
    isAtBottom: s,
    atBottomState: p,
    atTopStateChange: c,
    atBottomStateChange: l,
    scrollDirection: g,
    atBottomThreshold: u,
    atTopThreshold: d,
    scrollVelocity: v,
    lastJumpDueToItemResize: m
  };
}, et(Ut)), Pr = Le(
  ([{ log: e }]) => {
    const t = Q(!1), n = en(
      q(
        t,
        pe((r) => r),
        Je()
      )
    );
    return ze(t, (r) => {
      r && $t(e)("props updated", {}, tn.DEBUG);
    }), { propsReady: t, didMount: n };
  },
  et(Cr),
  { singleton: !0 }
);
function jd(e, t) {
  e == 0 ? t() : requestAnimationFrame(() => jd(e - 1, t));
}
function Bd(e, t) {
  const n = t - 1;
  return typeof e == "number" ? e : e.index === "LAST" ? n : e.index;
}
const hs = Le(
  ([{ sizes: e, listRefresh: t, defaultItemSize: n }, { scrollTop: r }, { scrollToIndex: o, scrollTargetReached: i }, { didMount: s }]) => {
    const a = Q(!0), l = Q(0), c = Q(!0);
    return de(
      q(
        s,
        Te(l),
        pe(([u, d]) => !!d),
        Sn(!1)
      ),
      a
    ), de(
      q(
        s,
        Te(l),
        pe(([u, d]) => !!d),
        Sn(!1)
      ),
      c
    ), ze(
      q(
        Rt(t, s),
        Te(a, e, n, c),
        pe(([[, u], d, { sizeTree: f }, h, p]) => u && (!Ge(f) || Md(h)) && !d && !p),
        Te(l)
      ),
      ([, u]) => {
        _n(i, () => {
          we(c, !0);
        }), jd(4, () => {
          _n(r, () => {
            we(a, !0);
          }), we(o, u);
        });
      }
    ), {
      scrolledToInitialItem: a,
      initialTopMostItemIndex: l,
      initialItemFinalLocationReached: c
    };
  },
  et(Mn, Ut, ds, Pr),
  { singleton: !0 }
);
function _m(e) {
  return e ? e === "smooth" ? "smooth" : "auto" : !1;
}
const KD = (e, t) => typeof e == "function" ? _m(e(t)) : t && _m(e), ZD = Le(
  ([
    { totalCount: e, listRefresh: t },
    { isAtBottom: n, atBottomState: r },
    { scrollToIndex: o },
    { scrolledToInitialItem: i },
    { propsReady: s, didMount: a },
    { log: l },
    { scrollingInProgress: c }
  ]) => {
    const u = Q(!1), d = Re();
    let f = null;
    function h(m) {
      we(o, {
        index: "LAST",
        align: "end",
        behavior: m
      });
    }
    ze(
      q(
        Rt(q(ge(e), $o(1)), a),
        Te(ge(u), n, i, c),
        se(([[m, g], v, b, y, x]) => {
          let w = g && y, T = "auto";
          return w && (T = KD(v, b || x), w = w && !!T), { totalCount: m, shouldFollow: w, followOutputBehavior: T };
        }),
        pe(({ shouldFollow: m }) => m)
      ),
      ({ totalCount: m, followOutputBehavior: g }) => {
        f && (f(), f = null), f = _n(t, () => {
          $t(l)("following output to ", { totalCount: m }, tn.DEBUG), h(g), f = null;
        });
      }
    );
    function p(m) {
      const g = _n(r, (v) => {
        m && !v.atBottom && v.notAtBottomBecause === "SIZE_INCREASED" && !f && ($t(l)("scrolling to bottom due to increased size", {}, tn.DEBUG), h("auto"));
      });
      setTimeout(g, 100);
    }
    return ze(
      q(
        Rt(ge(u), e, s),
        pe(([m, , g]) => m && g),
        Rn(
          ({ value: m }, [, g]) => ({ refreshed: m === g, value: g }),
          { refreshed: !1, value: 0 }
        ),
        pe(({ refreshed: m }) => m),
        Te(u, e)
      ),
      ([, m]) => {
        $t(i) && p(m !== !1);
      }
    ), ze(d, () => {
      p($t(u) !== !1);
    }), ze(Rt(ge(u), r), ([m, g]) => {
      m && !g.atBottom && g.notAtBottomBecause === "VIEWPORT_HEIGHT_DECREASING" && h("auto");
    }), { followOutput: u, autoscrollToBottom: d };
  },
  et(Mn, fs, ds, hs, Pr, Cr, Ut)
);
function XD(e) {
  return e.reduce(
    (t, n) => (t.groupIndices.push(t.totalCount), t.totalCount += n + 1, t),
    {
      totalCount: 0,
      groupIndices: []
    }
  );
}
const l0 = Le(([{ totalCount: e, groupIndices: t, sizes: n }, { scrollTop: r, headerHeight: o }]) => {
  const i = Re(), s = Re(), a = en(q(i, se(XD)));
  return de(
    q(
      a,
      se((l) => l.totalCount)
    ),
    e
  ), de(
    q(
      a,
      se((l) => l.groupIndices)
    ),
    t
  ), de(
    q(
      Rt(r, n, o),
      pe(([l, c]) => ol(c)),
      se(([l, c, u]) => mn(c.groupOffsetTree, Math.max(l - u, 0), "v")[0]),
      Je(),
      se((l) => [l])
    ),
    s
  ), { groupCounts: i, topItemsIndexes: s };
}, et(Mn, Ut));
function Ui(e, t) {
  return !!(e && e[0] === t[0] && e[1] === t[1]);
}
function c0(e, t) {
  return !!(e && e.startIndex === t.startIndex && e.endIndex === t.endIndex);
}
const ma = "top", ga = "bottom", Am = "none";
function Dm(e, t, n) {
  return typeof e == "number" ? n === Hi && t === ma || n === Ci && t === ga ? e : 0 : n === Hi ? t === ma ? e.main : e.reverse : t === ga ? e.main : e.reverse;
}
function Mm(e, t) {
  return typeof e == "number" ? e : e[t] || 0;
}
const zd = Le(
  ([{ scrollTop: e, viewportHeight: t, deviation: n, headerHeight: r, fixedHeaderHeight: o }]) => {
    const i = Re(), s = Q(0), a = Q(0), l = Q(0), c = jt(
      q(
        Rt(
          ge(e),
          ge(t),
          ge(r),
          ge(i, Ui),
          ge(l),
          ge(s),
          ge(o),
          ge(n),
          ge(a)
        ),
        se(
          ([
            u,
            d,
            f,
            [h, p],
            m,
            g,
            v,
            b,
            y
          ]) => {
            const x = u - b, w = g + v, T = Math.max(f - x, 0);
            let P = Am;
            const I = Mm(y, ma), _ = Mm(y, ga);
            return h -= b, h += f + v, p += f + v, p -= b, h > u + w - I && (P = Hi), p < u - T + d + _ && (P = Ci), P !== Am ? [
              Math.max(x - f - Dm(m, ma, P) - I, 0),
              x - T - v + d + Dm(m, ga, P) + _
            ] : null;
          }
        ),
        pe((u) => u != null),
        Je(Ui)
      ),
      [0, 0]
    );
    return {
      // input
      listBoundary: i,
      overscan: l,
      topListHeight: s,
      increaseViewportBy: a,
      // output
      visibleRange: c
    };
  },
  et(Ut),
  { singleton: !0 }
);
function QD(e, t, n) {
  if (ol(t)) {
    const r = s0(e, t);
    return [
      { index: mn(t.groupOffsetTree, r)[0], size: 0, offset: 0 },
      { index: r, size: 0, offset: 0, data: n && n[0] }
    ];
  }
  return [{ index: e, size: 0, offset: 0, data: n && n[0] }];
}
const uc = {
  items: [],
  topItems: [],
  offsetTop: 0,
  offsetBottom: 0,
  top: 0,
  bottom: 0,
  topListHeight: 0,
  totalCount: 0,
  firstItemIndex: 0
};
function Nm(e, t, n) {
  if (e.length === 0)
    return [];
  if (!ol(t))
    return e.map((c) => ({ ...c, index: c.index + n, originalIndex: c.index }));
  const r = e[0].index, o = e[e.length - 1].index, i = [], s = rl(t.groupOffsetTree, r, o);
  let a, l = 0;
  for (const c of e) {
    (!a || a.end < c.index) && (a = s.shift(), l = t.groupIndices.indexOf(a.start));
    let u;
    c.index === a.start ? u = {
      type: "group",
      index: l
    } : u = {
      index: c.index - (l + 1) + n,
      groupIndex: l
    }, i.push({
      ...u,
      size: c.size,
      offset: c.offset,
      originalIndex: c.index,
      data: c.data
    });
  }
  return i;
}
function $s(e, t, n, r, o, i) {
  const { lastSize: s, lastOffset: a, lastIndex: l } = o;
  let c = 0, u = 0;
  if (e.length > 0) {
    c = e[0].offset;
    const m = e[e.length - 1];
    u = m.offset + m.size;
  }
  const d = n - l, f = a + d * s + (d - 1) * r, h = c, p = f - u;
  return {
    items: Nm(e, o, i),
    topItems: Nm(t, o, i),
    topListHeight: t.reduce((m, g) => g.size + m, 0),
    offsetTop: c,
    offsetBottom: p,
    top: h,
    bottom: u,
    totalCount: n,
    firstItemIndex: i
  };
}
function u0(e, t, n, r, o, i) {
  let s = 0;
  if (n.groupIndices.length > 0)
    for (const u of n.groupIndices) {
      if (u - s >= e)
        break;
      s++;
    }
  const a = e + s, l = Bd(t, a), c = Array.from({ length: a }).map((u, d) => ({
    index: d + l,
    size: 0,
    offset: 0,
    data: i[d + l]
  }));
  return $s(c, [], a, o, n, r);
}
const to = Le(
  ([
    { sizes: e, totalCount: t, data: n, firstItemIndex: r, gap: o },
    i,
    { visibleRange: s, listBoundary: a, topListHeight: l },
    { scrolledToInitialItem: c, initialTopMostItemIndex: u },
    { topListHeight: d },
    f,
    { didMount: h },
    { recalcInProgress: p }
  ]) => {
    const m = Q([]), g = Q(0), v = Re();
    de(i.topItemsIndexes, m);
    const b = jt(
      q(
        Rt(
          h,
          p,
          ge(s, Ui),
          ge(t),
          ge(e),
          ge(u),
          c,
          ge(m),
          ge(r),
          ge(o),
          n
        ),
        pe(([T, P, , I, , , , , , , _]) => {
          const R = _ && _.length !== I;
          return T && !P && !R;
        }),
        se(
          ([
            ,
            ,
            [T, P],
            I,
            _,
            R,
            L,
            M,
            V,
            E,
            k
          ]) => {
            const A = _, { sizeTree: N, offsetTree: H } = A, Y = $t(g);
            if (I === 0)
              return { ...uc, totalCount: I };
            if (T === 0 && P === 0)
              return Y === 0 ? { ...uc, totalCount: I } : u0(Y, R, _, V, E, k || []);
            if (Ge(N))
              return Y > 0 ? null : $s(
                QD(Bd(R, I), A, k),
                [],
                I,
                E,
                A,
                V
              );
            const C = [];
            if (M.length > 0) {
              const G = M[0], D = M[M.length - 1];
              let j = 0;
              for (const W of rl(N, G, D)) {
                const U = W.value, z = Math.max(W.start, G), te = Math.min(W.end, D);
                for (let B = z; B <= te; B++)
                  C.push({ index: B, size: U, offset: j, data: k && k[B] }), j += U;
              }
            }
            if (!L)
              return $s([], C, I, E, A, V);
            const $ = M.length > 0 ? M[M.length - 1] + 1 : 0, X = $D(H, T, P, $);
            if (X.length === 0)
              return null;
            const re = I - 1, ee = nl([], (G) => {
              for (const D of X) {
                const j = D.value;
                let W = j.offset, U = D.start;
                const z = j.size;
                if (j.offset < T) {
                  U += Math.floor((T - j.offset + E) / (z + E));
                  const B = U - D.start;
                  W += B * z + B * E;
                }
                U < $ && (W += ($ - U) * z, U = $);
                const te = Math.min(D.end, re);
                for (let B = U; B <= te && !(W >= P); B++)
                  G.push({ index: B, size: z, offset: W, data: k && k[B] }), W += z + E;
              }
            });
            return $s(ee, C, I, E, A, V);
          }
        ),
        //@ts-expect-error filter needs to be fixed
        pe((T) => T !== null),
        Je()
      ),
      uc
    );
    de(
      q(
        n,
        pe(Md),
        se((T) => T == null ? void 0 : T.length)
      ),
      t
    ), de(
      q(
        b,
        se((T) => T.topListHeight)
      ),
      d
    ), de(d, l), de(
      q(
        b,
        se((T) => [T.top, T.bottom])
      ),
      a
    ), de(
      q(
        b,
        se((T) => T.items)
      ),
      v
    );
    const y = en(
      q(
        b,
        pe(({ items: T }) => T.length > 0),
        Te(t, n),
        pe(([{ items: T }, P]) => T[T.length - 1].originalIndex === P - 1),
        se(([, T, P]) => [T - 1, P]),
        Je(Ui),
        se(([T]) => T)
      )
    ), x = en(
      q(
        b,
        sr(200),
        pe(({ items: T, topItems: P }) => T.length > 0 && T[0].originalIndex === P.length),
        se(({ items: T }) => T[0].index),
        Je()
      )
    ), w = en(
      q(
        b,
        pe(({ items: T }) => T.length > 0),
        se(({ items: T }) => {
          let P = 0, I = T.length - 1;
          for (; T[P].type === "group" && P < I; )
            P++;
          for (; T[I].type === "group" && I > P; )
            I--;
          return {
            startIndex: T[P].index,
            endIndex: T[I].index
          };
        }),
        Je(c0)
      )
    );
    return { listState: b, topItemsIndexes: m, endReached: y, startReached: x, rangeChanged: w, itemsRendered: v, initialItemCount: g, ...f };
  },
  et(
    Mn,
    l0,
    zd,
    hs,
    ds,
    fs,
    Pr,
    Vd
  ),
  { singleton: !0 }
), JD = Le(
  ([{ sizes: e, firstItemIndex: t, data: n, gap: r }, { initialTopMostItemIndex: o }, { initialItemCount: i, listState: s }, { didMount: a }]) => (de(
    q(
      a,
      Te(i),
      pe(([, l]) => l !== 0),
      Te(o, e, t, r, n),
      se(([[, l], c, u, d, f, h = []]) => u0(l, c, u, d, f, h))
    ),
    s
  ), {}),
  et(Mn, hs, to, Pr),
  { singleton: !0 }
), d0 = Le(
  ([{ scrollVelocity: e }]) => {
    const t = Q(!1), n = Re(), r = Q(!1);
    return de(
      q(
        e,
        Te(r, t, n),
        pe(([o, i]) => !!i),
        se(([o, i, s, a]) => {
          const { exit: l, enter: c } = i;
          if (s) {
            if (l(o, a))
              return !1;
          } else if (c(o, a))
            return !0;
          return s;
        }),
        Je()
      ),
      t
    ), ze(
      q(Rt(t, e, n), Te(r)),
      ([[o, i, s], a]) => o && a && a.change && a.change(i, s)
    ), { isSeeking: t, scrollSeekConfiguration: r, scrollVelocity: e, scrollSeekRangeChanged: n };
  },
  et(fs),
  { singleton: !0 }
), eM = Le(([{ topItemsIndexes: e }]) => {
  const t = Q(0);
  return de(
    q(
      t,
      pe((n) => n > 0),
      se((n) => Array.from({ length: n }).map((r, o) => o))
    ),
    e
  ), { topItemCount: t };
}, et(to)), f0 = Le(
  ([{ footerHeight: e, headerHeight: t, fixedHeaderHeight: n, fixedFooterHeight: r }, { listState: o }]) => {
    const i = Re(), s = jt(
      q(
        Rt(e, r, t, n, o),
        se(([a, l, c, u, d]) => a + l + c + u + d.offsetBottom + d.bottom)
      ),
      0
    );
    return de(ge(s), i), { totalListHeight: s, totalListHeightChanged: i };
  },
  et(Ut, to),
  { singleton: !0 }
);
function h0(e) {
  let t = !1, n;
  return () => (t || (t = !0, n = e()), n);
}
const tM = h0(() => /iP(ad|od|hone)/i.test(navigator.userAgent) && /WebKit/i.test(navigator.userAgent)), nM = Le(
  ([
    { scrollBy: e, scrollTop: t, deviation: n, scrollingInProgress: r },
    { isScrolling: o, isAtBottom: i, scrollDirection: s, lastJumpDueToItemResize: a },
    { listState: l },
    { beforeUnshiftWith: c, shiftWithOffset: u, sizes: d, gap: f },
    { log: h },
    { recalcInProgress: p }
  ]) => {
    const m = en(
      q(
        l,
        Te(a),
        Rn(
          ([, v, b, y], [{ items: x, totalCount: w, bottom: T, offsetBottom: P }, I]) => {
            const _ = T + P;
            let R = 0;
            return b === w && v.length > 0 && x.length > 0 && (x[0].originalIndex === 0 && v[0].originalIndex === 0 || (R = _ - y, R !== 0 && (R += I))), [R, x, w, _];
          },
          [0, [], 0, 0]
        ),
        pe(([v]) => v !== 0),
        Te(t, s, r, i, h, p),
        pe(([, v, b, y, , , x]) => !x && !y && v !== 0 && b === Hi),
        se(([[v], , , , , b]) => (b("Upward scrolling compensation", { amount: v }, tn.DEBUG), v))
      )
    );
    function g(v) {
      v > 0 ? (we(e, { top: -v, behavior: "auto" }), we(n, 0)) : (we(n, 0), we(e, { top: -v, behavior: "auto" }));
    }
    return ze(q(m, Te(n, o)), ([v, b, y]) => {
      y && tM() ? we(n, b - v) : g(-v);
    }), ze(
      q(
        Rt(jt(o, !1), n, p),
        pe(([v, b, y]) => !v && !y && b !== 0),
        se(([v, b]) => b),
        sr(1)
      ),
      g
    ), de(
      q(
        u,
        se((v) => ({ top: -v }))
      ),
      e
    ), ze(
      q(
        c,
        Te(d, f),
        se(([v, { lastSize: b, groupIndices: y, sizeTree: x }, w]) => {
          function T(P) {
            return P * (b + w);
          }
          if (y.length === 0)
            return T(v);
          {
            let P = 0;
            const I = zi(x, 0);
            let _ = 0, R = 0;
            for (; _ < v; ) {
              _++, P += I;
              let L = y.length === R + 1 ? 1 / 0 : y[R + 1] - y[R] - 1;
              _ + L > v && (P -= I, L = v - _ + 1), _ += L, P += T(L), R++;
            }
            return P;
          }
        })
      ),
      (v) => {
        we(n, v), requestAnimationFrame(() => {
          we(e, { top: v }), requestAnimationFrame(() => {
            we(n, 0), we(p, !1);
          });
        });
      }
    ), { deviation: n };
  },
  et(Ut, fs, to, Mn, Cr, Vd)
), rM = Le(
  ([{ didMount: e }, { scrollTo: t }, { listState: n }]) => {
    const r = Q(0);
    return ze(
      q(
        e,
        Te(r),
        pe(([, o]) => o !== 0),
        se(([, o]) => ({ top: o }))
      ),
      (o) => {
        _n(
          q(
            n,
            $o(1),
            pe((i) => i.items.length > 1)
          ),
          () => {
            requestAnimationFrame(() => {
              we(t, o);
            });
          }
        );
      }
    ), {
      initialScrollTop: r
    };
  },
  et(Pr, Ut, to),
  { singleton: !0 }
), oM = Le(
  ([{ viewportHeight: e }, { totalListHeight: t }]) => {
    const n = Q(!1), r = jt(
      q(
        Rt(n, e, t),
        pe(([o]) => o),
        se(([, o, i]) => Math.max(0, o - i)),
        sr(0),
        Je()
      ),
      0
    );
    return { alignToBottom: n, paddingTopAddition: r };
  },
  et(Ut, f0),
  { singleton: !0 }
), Wd = Le(([{ scrollTo: e, scrollContainerState: t }]) => {
  const n = Re(), r = Re(), o = Re(), i = Q(!1), s = Q(void 0);
  return de(
    q(
      Rt(n, r),
      se(([{ viewportHeight: a, scrollTop: l, scrollHeight: c }, { offsetTop: u }]) => ({
        scrollTop: Math.max(0, l - u),
        scrollHeight: c,
        viewportHeight: a
      }))
    ),
    t
  ), de(
    q(
      e,
      Te(r),
      se(([a, { offsetTop: l }]) => ({
        ...a,
        top: a.top + l
      }))
    ),
    o
  ), {
    // config
    useWindowScroll: i,
    customScrollParent: s,
    // input
    windowScrollContainerState: n,
    windowViewportRect: r,
    // signals
    windowScrollTo: o
  };
}, et(Ut)), iM = ({
  itemTop: e,
  itemBottom: t,
  viewportTop: n,
  viewportBottom: r,
  locationParams: { behavior: o, align: i, ...s }
}) => e < n ? { ...s, behavior: o, align: i ?? "start" } : t > r ? { ...s, behavior: o, align: i ?? "end" } : null, sM = Le(
  ([
    { sizes: e, totalCount: t, gap: n },
    { scrollTop: r, viewportHeight: o, headerHeight: i, fixedHeaderHeight: s, fixedFooterHeight: a, scrollingInProgress: l },
    { scrollToIndex: c }
  ]) => {
    const u = Re();
    return de(
      q(
        u,
        Te(e, o, t, i, s, a, r),
        Te(n),
        se(([[d, f, h, p, m, g, v, b], y]) => {
          const { done: x, behavior: w, align: T, calculateViewLocation: P = iM, ...I } = d, _ = i0(d, f, p - 1), R = Wi(_, f.offsetTree, y) + m + g, L = R + mn(f.sizeTree, _)[1], M = b + g, V = b + h - v, E = P({
            itemTop: R,
            itemBottom: L,
            viewportTop: M,
            viewportBottom: V,
            locationParams: { behavior: w, align: T, ...I }
          });
          return E ? x && _n(
            q(
              l,
              pe((k) => k === !1),
              // skips the initial publish of false, and the cleanup call.
              // but if scrollingInProgress is true, we skip the initial publish.
              $o($t(l) ? 1 : 2)
            ),
            x
          ) : x && x(), E;
        }),
        pe((d) => d !== null)
      ),
      c
    ), {
      scrollIntoView: u
    };
  },
  et(Mn, Ut, ds, to, Cr),
  { singleton: !0 }
), aM = Le(
  ([
    { sizes: e, sizeRanges: t },
    { scrollTop: n, headerHeight: r },
    { initialTopMostItemIndex: o },
    { didMount: i },
    { useWindowScroll: s, windowScrollContainerState: a, windowViewportRect: l }
  ]) => {
    const c = Re(), u = Q(void 0), d = Q(null), f = Q(null);
    return de(a, d), de(l, f), ze(
      q(
        c,
        Te(e, n, s, d, f, r)
      ),
      ([h, p, m, g, v, b, y]) => {
        const x = zD(p.sizeTree);
        g && v !== null && b !== null && (m = v.scrollTop - b.offsetTop), m -= y, h({ ranges: x, scrollTop: m });
      }
    ), de(q(u, pe(Md), se(lM)), o), de(
      q(
        i,
        Te(u),
        pe(([, h]) => h !== void 0),
        Je(),
        se(([, h]) => h.ranges)
      ),
      t
    ), {
      getState: c,
      restoreStateFrom: u
    };
  },
  et(Mn, Ut, hs, Pr, Wd)
);
function lM(e) {
  return { offset: e.scrollTop, index: 0, align: "start" };
}
const cM = Le(
  ([
    e,
    t,
    n,
    r,
    o,
    i,
    s,
    a,
    l,
    c
  ]) => ({
    ...e,
    ...t,
    ...n,
    ...r,
    ...o,
    ...i,
    ...s,
    ...a,
    ...l,
    ...c
  }),
  et(
    zd,
    JD,
    Pr,
    d0,
    f0,
    rM,
    oM,
    Wd,
    sM,
    Cr
  )
), p0 = Le(
  ([
    {
      totalCount: e,
      sizeRanges: t,
      fixedItemSize: n,
      defaultItemSize: r,
      trackItemSizes: o,
      itemSize: i,
      data: s,
      firstItemIndex: a,
      groupIndices: l,
      statefulTotalCount: c,
      gap: u,
      sizes: d
    },
    { initialTopMostItemIndex: f, scrolledToInitialItem: h, initialItemFinalLocationReached: p },
    m,
    g,
    v,
    { listState: b, topItemsIndexes: y, ...x },
    { scrollToIndex: w },
    T,
    { topItemCount: P },
    { groupCounts: I },
    _
  ]) => (de(x.rangeChanged, _.scrollSeekRangeChanged), de(
    q(
      _.windowViewportRect,
      se((R) => R.visibleHeight)
    ),
    m.viewportHeight
  ), {
    // input
    totalCount: e,
    data: s,
    firstItemIndex: a,
    sizeRanges: t,
    initialTopMostItemIndex: f,
    scrolledToInitialItem: h,
    initialItemFinalLocationReached: p,
    topItemsIndexes: y,
    topItemCount: P,
    groupCounts: I,
    fixedItemHeight: n,
    defaultItemHeight: r,
    gap: u,
    ...v,
    // output
    statefulTotalCount: c,
    listState: b,
    scrollToIndex: w,
    trackItemSizes: o,
    itemSize: i,
    groupIndices: l,
    // exported from stateFlagsSystem
    ...x,
    // the bag of IO from featureGroup1System
    ..._,
    ...m,
    sizes: d,
    ...g
  }),
  et(
    Mn,
    hs,
    Ut,
    aM,
    ZD,
    to,
    ds,
    nM,
    eM,
    l0,
    cM
  )
), dc = "-webkit-sticky", Fm = "sticky", m0 = h0(() => {
  if (typeof document > "u")
    return Fm;
  const e = document.createElement("div");
  return e.style.position = dc, e.style.position === dc ? dc : Fm;
});
function Hd(e, t) {
  const n = F.useRef(null), r = F.useCallback(
    (a) => {
      if (a === null || !a.offsetParent)
        return;
      const l = a.getBoundingClientRect(), c = l.width;
      let u, d;
      if (t) {
        const f = t.getBoundingClientRect(), h = l.top - f.top;
        u = f.height - Math.max(0, h), d = h + t.scrollTop;
      } else
        u = window.innerHeight - Math.max(0, l.top), d = l.top + window.pageYOffset;
      n.current = {
        offsetTop: d,
        visibleHeight: u,
        visibleWidth: c
      }, e(n.current);
    },
    [e, t]
  ), { callbackRef: o, ref: i } = Ld(r), s = F.useCallback(() => {
    r(i.current);
  }, [r, i]);
  return F.useEffect(() => {
    if (t) {
      t.addEventListener("scroll", s);
      const a = new ResizeObserver(() => {
        requestAnimationFrame(s);
      });
      return a.observe(t), () => {
        t.removeEventListener("scroll", s), a.unobserve(t);
      };
    } else
      return window.addEventListener("scroll", s), window.addEventListener("resize", s), () => {
        window.removeEventListener("scroll", s), window.removeEventListener("resize", s);
      };
  }, [s, t]), o;
}
const il = F.createContext(void 0), g0 = F.createContext(void 0);
function Ud(e) {
  return e;
}
const uM = /* @__PURE__ */ Le(() => {
  const e = Q((l) => `Item ${l}`), t = Q(null), n = Q((l) => `Group ${l}`), r = Q({}), o = Q(Ud), i = Q("div"), s = Q(eo), a = (l, c = null) => jt(
    q(
      r,
      se((u) => u[l]),
      Je()
    ),
    c
  );
  return {
    context: t,
    itemContent: e,
    groupContent: n,
    components: r,
    computeItemKey: o,
    headerFooterTag: i,
    scrollerRef: s,
    FooterComponent: a("Footer"),
    HeaderComponent: a("Header"),
    TopItemListComponent: a("TopItemList"),
    ListComponent: a("List", "div"),
    ItemComponent: a("Item", "div"),
    GroupComponent: a("Group", "div"),
    ScrollerComponent: a("Scroller", "div"),
    EmptyPlaceholder: a("EmptyPlaceholder"),
    ScrollSeekPlaceholder: a("ScrollSeekPlaceholder")
  };
}), dM = /* @__PURE__ */ Le(([e, t]) => ({ ...e, ...t }), et(p0, uM)), fM = ({ height: e }) => /* @__PURE__ */ F.createElement("div", { style: { height: e } }), hM = { position: m0(), zIndex: 1, overflowAnchor: "none" }, pM = { overflowAnchor: "none" }, Lm = /* @__PURE__ */ F.memo(function({ showTopList: t = !1 }) {
  const n = Ce("listState"), r = an("sizeRanges"), o = Ce("useWindowScroll"), i = Ce("customScrollParent"), s = an("windowScrollContainerState"), a = an("scrollContainerState"), l = i || o ? s : a, c = Ce("itemContent"), u = Ce("context"), d = Ce("groupContent"), f = Ce("trackItemSizes"), h = Ce("itemSize"), p = Ce("log"), m = an("gap"), { callbackRef: g } = Zb(
    r,
    h,
    f,
    t ? eo : l,
    p,
    m,
    i
  ), [v, b] = F.useState(0);
  qd("deviation", (E) => {
    v !== E && b(E);
  });
  const y = Ce("EmptyPlaceholder"), x = Ce("ScrollSeekPlaceholder") || fM, w = Ce("ListComponent"), T = Ce("ItemComponent"), P = Ce("GroupComponent"), I = Ce("computeItemKey"), _ = Ce("isSeeking"), R = Ce("groupIndices").length > 0, L = Ce("alignToBottom"), M = Ce("initialItemFinalLocationReached"), V = t ? {} : {
    boxSizing: "border-box",
    paddingTop: n.offsetTop,
    paddingBottom: n.offsetBottom,
    marginTop: v !== 0 ? v : L ? "auto" : 0,
    ...M ? {} : { visibility: "hidden" }
  };
  return !t && n.totalCount === 0 && y ? F.createElement(y, ct(y, u)) : F.createElement(
    w,
    {
      ...ct(w, u),
      ref: g,
      style: V,
      "data-testid": t ? "virtuoso-top-item-list" : "virtuoso-item-list"
    },
    (t ? n.topItems : n.items).map((E) => {
      const k = E.originalIndex, A = I(k + n.firstItemIndex, E.data, u);
      return _ ? F.createElement(x, {
        ...ct(x, u),
        key: A,
        index: E.index,
        height: E.size,
        type: E.type || "item",
        ...E.type === "group" ? {} : { groupIndex: E.groupIndex }
      }) : E.type === "group" ? F.createElement(
        P,
        {
          ...ct(P, u),
          key: A,
          "data-index": k,
          "data-known-size": E.size,
          "data-item-index": E.index,
          style: hM
        },
        d(E.index, u)
      ) : F.createElement(
        T,
        {
          ...ct(T, u),
          ...y0(T, E.data),
          key: A,
          "data-index": k,
          "data-known-size": E.size,
          "data-item-index": E.index,
          "data-item-group-index": E.groupIndex,
          style: pM
        },
        R ? c(E.index, E.groupIndex, E.data, u) : c(E.index, E.data, u)
      );
    })
  );
}), mM = {
  height: "100%",
  outline: "none",
  overflowY: "auto",
  position: "relative",
  WebkitOverflowScrolling: "touch"
}, ri = (e) => ({
  width: "100%",
  height: "100%",
  position: "absolute",
  top: 0,
  ...e ? { display: "flex", flexDirection: "column" } : {}
}), gM = {
  width: "100%",
  position: m0(),
  top: 0,
  zIndex: 1
};
function ct(e, t) {
  if (typeof e != "string")
    return { context: t };
}
function y0(e, t) {
  return { item: typeof e == "string" ? void 0 : t };
}
const yM = /* @__PURE__ */ F.memo(function() {
  const t = Ce("HeaderComponent"), n = an("headerHeight"), r = Ce("headerFooterTag"), o = An(F.useMemo(() => (s) => n(pn(s, "height")), [n])), i = Ce("context");
  return t ? F.createElement(r, { ref: o }, F.createElement(t, ct(t, i))) : null;
}), vM = /* @__PURE__ */ F.memo(function() {
  const t = Ce("FooterComponent"), n = an("footerHeight"), r = Ce("headerFooterTag"), o = An(F.useMemo(() => (s) => n(pn(s, "height")), [n])), i = Ce("context");
  return t ? F.createElement(r, { ref: o }, F.createElement(t, ct(t, i))) : null;
});
function Gd({ usePublisher: e, useEmitter: t, useEmitterValue: n }) {
  return F.memo(function({ style: i, children: s, ...a }) {
    const l = e("scrollContainerState"), c = n("ScrollerComponent"), u = e("smoothScrollTargetReached"), d = n("scrollerRef"), f = n("context"), { scrollerRef: h, scrollByCallback: p, scrollToCallback: m } = Qb(
      l,
      u,
      c,
      d
    );
    return t("scrollTo", m), t("scrollBy", p), F.createElement(
      c,
      {
        ref: h,
        style: { ...mM, ...i },
        "data-testid": "virtuoso-scroller",
        "data-virtuoso-scroller": !0,
        tabIndex: 0,
        ...a,
        ...ct(c, f)
      },
      s
    );
  });
}
function Yd({ usePublisher: e, useEmitter: t, useEmitterValue: n }) {
  return F.memo(function({ style: i, children: s, ...a }) {
    const l = e("windowScrollContainerState"), c = n("ScrollerComponent"), u = e("smoothScrollTargetReached"), d = n("totalListHeight"), f = n("deviation"), h = n("customScrollParent"), p = n("context"), { scrollerRef: m, scrollByCallback: g, scrollToCallback: v } = Qb(
      l,
      u,
      c,
      eo,
      h
    );
    return RD(() => (m.current = h || window, () => {
      m.current = null;
    }), [m, h]), t("windowScrollTo", v), t("scrollBy", g), F.createElement(
      c,
      {
        style: { position: "relative", ...i, ...d !== 0 ? { height: d + f } : {} },
        "data-virtuoso-scroller": !0,
        ...a,
        ...ct(c, p)
      },
      s
    );
  });
}
const bM = ({ children: e }) => {
  const t = F.useContext(il), n = an("viewportHeight"), r = an("fixedItemHeight"), o = Ce("alignToBottom"), i = An(F.useMemo(() => ji(n, (s) => pn(s, "height")), [n]));
  return F.useEffect(() => {
    t && (n(t.viewportHeight), r(t.itemHeight));
  }, [t, n, r]), /* @__PURE__ */ F.createElement("div", { style: ri(o), ref: i, "data-viewport-type": "element" }, e);
}, wM = ({ children: e }) => {
  const t = F.useContext(il), n = an("windowViewportRect"), r = an("fixedItemHeight"), o = Ce("customScrollParent"), i = Hd(n, o), s = Ce("alignToBottom");
  return F.useEffect(() => {
    t && (r(t.itemHeight), n({ offsetTop: 0, visibleHeight: t.viewportHeight, visibleWidth: 100 }));
  }, [t, n, r]), /* @__PURE__ */ F.createElement("div", { ref: i, style: ri(s), "data-viewport-type": "window" }, e);
}, xM = ({ children: e }) => {
  const t = Ce("TopItemListComponent") || "div", n = Ce("headerHeight"), r = { ...gM, marginTop: `${n}px` }, o = Ce("context");
  return F.createElement(t, { style: r, ...ct(t, o) }, e);
}, TM = /* @__PURE__ */ F.memo(function(t) {
  const n = Ce("useWindowScroll"), r = Ce("topItemsIndexes").length > 0, o = Ce("customScrollParent"), i = o || n ? CM : EM, s = o || n ? wM : bM;
  return /* @__PURE__ */ F.createElement(i, { ...t }, r && /* @__PURE__ */ F.createElement(xM, null, /* @__PURE__ */ F.createElement(Lm, { showTopList: !0 })), /* @__PURE__ */ F.createElement(s, null, /* @__PURE__ */ F.createElement(yM, null), /* @__PURE__ */ F.createElement(Lm, null), /* @__PURE__ */ F.createElement(vM, null)));
}), {
  Component: SM,
  usePublisher: an,
  useEmitterValue: Ce,
  useEmitter: qd
} = /* @__PURE__ */ Fd(
  dM,
  {
    required: {},
    optional: {
      restoreStateFrom: "restoreStateFrom",
      context: "context",
      followOutput: "followOutput",
      itemContent: "itemContent",
      groupContent: "groupContent",
      overscan: "overscan",
      increaseViewportBy: "increaseViewportBy",
      totalCount: "totalCount",
      groupCounts: "groupCounts",
      topItemCount: "topItemCount",
      firstItemIndex: "firstItemIndex",
      initialTopMostItemIndex: "initialTopMostItemIndex",
      components: "components",
      atBottomThreshold: "atBottomThreshold",
      atTopThreshold: "atTopThreshold",
      computeItemKey: "computeItemKey",
      defaultItemHeight: "defaultItemHeight",
      fixedItemHeight: "fixedItemHeight",
      itemSize: "itemSize",
      scrollSeekConfiguration: "scrollSeekConfiguration",
      headerFooterTag: "headerFooterTag",
      data: "data",
      initialItemCount: "initialItemCount",
      initialScrollTop: "initialScrollTop",
      alignToBottom: "alignToBottom",
      useWindowScroll: "useWindowScroll",
      customScrollParent: "customScrollParent",
      scrollerRef: "scrollerRef",
      logLevel: "logLevel"
    },
    methods: {
      scrollToIndex: "scrollToIndex",
      scrollIntoView: "scrollIntoView",
      scrollTo: "scrollTo",
      scrollBy: "scrollBy",
      autoscrollToBottom: "autoscrollToBottom",
      getState: "getState"
    },
    events: {
      isScrolling: "isScrolling",
      endReached: "endReached",
      startReached: "startReached",
      rangeChanged: "rangeChanged",
      atBottomStateChange: "atBottomStateChange",
      atTopStateChange: "atTopStateChange",
      totalListHeightChanged: "totalListHeightChanged",
      itemsRendered: "itemsRendered",
      groupIndices: "groupIndices"
    }
  },
  TM
), EM = /* @__PURE__ */ Gd({ usePublisher: an, useEmitterValue: Ce, useEmitter: qd }), CM = /* @__PURE__ */ Yd({ usePublisher: an, useEmitterValue: Ce, useEmitter: qd }), PM = SM, Vm = {
  items: [],
  offsetBottom: 0,
  offsetTop: 0,
  top: 0,
  bottom: 0,
  itemHeight: 0,
  itemWidth: 0
}, RM = {
  items: [{ index: 0 }],
  offsetBottom: 0,
  offsetTop: 0,
  top: 0,
  bottom: 0,
  itemHeight: 0,
  itemWidth: 0
}, { round: $m, ceil: jm, floor: ya, min: fc, max: Pi } = Math;
function kM(e) {
  return {
    ...RM,
    items: e
  };
}
function Bm(e, t, n) {
  return Array.from({ length: t - e + 1 }).map((r, o) => {
    const i = n === null ? null : n[o + e];
    return { index: o + e, data: i };
  });
}
function OM(e, t) {
  return e && e.column === t.column && e.row === t.row;
}
function ks(e, t) {
  return e && e.width === t.width && e.height === t.height;
}
const IM = /* @__PURE__ */ Le(
  ([
    { overscan: e, visibleRange: t, listBoundary: n },
    { scrollTop: r, viewportHeight: o, scrollBy: i, scrollTo: s, smoothScrollTargetReached: a, scrollContainerState: l, footerHeight: c, headerHeight: u },
    d,
    f,
    { propsReady: h, didMount: p },
    { windowViewportRect: m, useWindowScroll: g, customScrollParent: v, windowScrollContainerState: b, windowScrollTo: y },
    x
  ]) => {
    const w = Q(0), T = Q(0), P = Q(Vm), I = Q({ height: 0, width: 0 }), _ = Q({ height: 0, width: 0 }), R = Re(), L = Re(), M = Q(0), V = Q(null), E = Q({ row: 0, column: 0 }), k = Re(), A = Re(), N = Q(!1), H = Q(0), Y = Q(!0), C = Q(!1);
    ze(
      q(
        p,
        Te(H),
        pe(([D, j]) => !!j)
      ),
      () => {
        we(Y, !1), we(T, 0);
      }
    ), ze(
      q(
        Rt(p, Y, _, I, H, C),
        pe(([D, j, W, U, , z]) => D && !j && W.height !== 0 && U.height !== 0 && !z)
      ),
      ([, , , , D]) => {
        we(C, !0), jd(1, () => {
          we(R, D);
        }), _n(q(r), () => {
          we(n, [0, 0]), we(Y, !0);
        });
      }
    ), de(
      q(
        A,
        pe((D) => D != null && D.scrollTop > 0),
        Sn(0)
      ),
      T
    ), ze(
      q(
        p,
        Te(A),
        pe(([, D]) => D != null)
      ),
      ([, D]) => {
        D && (we(I, D.viewport), we(_, D == null ? void 0 : D.item), we(E, D.gap), D.scrollTop > 0 && (we(N, !0), _n(q(r, $o(1)), (j) => {
          we(N, !1);
        }), we(s, { top: D.scrollTop })));
      }
    ), de(
      q(
        I,
        se(({ height: D }) => D)
      ),
      o
    ), de(
      q(
        Rt(
          ge(I, ks),
          ge(_, ks),
          ge(E, (D, j) => D && D.column === j.column && D.row === j.row),
          ge(r)
        ),
        se(([D, j, W, U]) => ({
          viewport: D,
          item: j,
          gap: W,
          scrollTop: U
        }))
      ),
      k
    ), de(
      q(
        Rt(
          ge(w),
          t,
          ge(E, OM),
          ge(_, ks),
          ge(I, ks),
          ge(V),
          ge(T),
          ge(N),
          ge(Y),
          ge(H)
        ),
        pe(([, , , , , , , D]) => !D),
        se(
          ([
            D,
            [j, W],
            U,
            z,
            te,
            B,
            De,
            ,
            st,
            qe
          ]) => {
            const { row: at, column: ue } = U, { height: Pe, width: ce } = z, { width: ke } = te;
            if (De === 0 && (D === 0 || ke === 0))
              return Vm;
            if (ce === 0) {
              const Wt = Bd(qe, D), Rr = Wt === 0 ? Math.max(De - 1, 0) : Wt;
              return kM(Bm(Wt, Rr, B));
            }
            const ft = v0(ke, ce, ue);
            let Oe, xt;
            st ? j === 0 && W === 0 && De > 0 ? (Oe = 0, xt = De - 1) : (Oe = ft * ya((j + at) / (Pe + at)), xt = ft * jm((W + at) / (Pe + at)) - 1, xt = fc(D - 1, Pi(xt, ft - 1)), Oe = fc(xt, Pi(0, Oe))) : (Oe = 0, xt = -1);
            const J = Bm(Oe, xt, B), { top: ae, bottom: _e } = zm(te, U, z, J), Ke = jm(D / ft), Ft = Ke * Pe + (Ke - 1) * at - _e;
            return { items: J, offsetTop: ae, offsetBottom: Ft, top: ae, bottom: _e, itemHeight: Pe, itemWidth: ce };
          }
        )
      ),
      P
    ), de(
      q(
        V,
        pe((D) => D !== null),
        se((D) => D.length)
      ),
      w
    ), de(
      q(
        Rt(I, _, P, E),
        pe(([D, j, { items: W }]) => W.length > 0 && j.height !== 0 && D.height !== 0),
        se(([D, j, { items: W }, U]) => {
          const { top: z, bottom: te } = zm(D, U, j, W);
          return [z, te];
        }),
        Je(Ui)
      ),
      n
    );
    const $ = Q(!1);
    de(
      q(
        r,
        Te($),
        se(([D, j]) => j || D !== 0)
      ),
      $
    );
    const X = en(
      q(
        ge(P),
        pe(({ items: D }) => D.length > 0),
        Te(w, $),
        pe(([{ items: D }, j, W]) => W && D[D.length - 1].index === j - 1),
        se(([, D]) => D - 1),
        Je()
      )
    ), re = en(
      q(
        ge(P),
        pe(({ items: D }) => D.length > 0 && D[0].index === 0),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        Sn(0),
        Je()
      )
    ), ee = en(
      q(
        ge(P),
        Te(N),
        pe(([{ items: D }, j]) => D.length > 0 && !j),
        se(([{ items: D }]) => ({
          startIndex: D[0].index,
          endIndex: D[D.length - 1].index
        })),
        Je(c0),
        sr(0)
      )
    );
    de(ee, f.scrollSeekRangeChanged), de(
      q(
        R,
        Te(I, _, w, E),
        se(([D, j, W, U, z]) => {
          const te = a0(D), { align: B, behavior: De, offset: st } = te;
          let qe = te.index;
          qe === "LAST" && (qe = U - 1), qe = Pi(0, qe, fc(U - 1, qe));
          let at = hu(j, z, W, qe);
          return B === "end" ? at = $m(at - j.height + W.height) : B === "center" && (at = $m(at - j.height / 2 + W.height / 2)), st && (at += st), { top: at, behavior: De };
        })
      ),
      s
    );
    const G = jt(
      q(
        P,
        se((D) => D.offsetBottom + D.bottom)
      ),
      0
    );
    return de(
      q(
        m,
        se((D) => ({ width: D.visibleWidth, height: D.visibleHeight }))
      ),
      I
    ), {
      // input
      data: V,
      totalCount: w,
      viewportDimensions: I,
      itemDimensions: _,
      scrollTop: r,
      scrollHeight: L,
      overscan: e,
      scrollBy: i,
      scrollTo: s,
      scrollToIndex: R,
      smoothScrollTargetReached: a,
      windowViewportRect: m,
      windowScrollTo: y,
      useWindowScroll: g,
      customScrollParent: v,
      windowScrollContainerState: b,
      deviation: M,
      scrollContainerState: l,
      footerHeight: c,
      headerHeight: u,
      initialItemCount: T,
      gap: E,
      restoreStateFrom: A,
      ...f,
      initialTopMostItemIndex: H,
      // output
      gridState: P,
      totalListHeight: G,
      ...d,
      startReached: re,
      endReached: X,
      rangeChanged: ee,
      stateChanged: k,
      propsReady: h,
      stateRestoreInProgress: N,
      ...x
    };
  },
  et(zd, Ut, fs, d0, Pr, Wd, Cr)
);
function zm(e, t, n, r) {
  const { height: o } = n;
  if (o === void 0 || r.length === 0)
    return { top: 0, bottom: 0 };
  const i = hu(e, t, n, r[0].index), s = hu(e, t, n, r[r.length - 1].index) + o;
  return { top: i, bottom: s };
}
function hu(e, t, n, r) {
  const o = v0(e.width, n.width, t.column), i = ya(r / o), s = i * n.height + Pi(0, i - 1) * t.row;
  return s > 0 ? s + t.row : s;
}
function v0(e, t, n) {
  return Pi(1, ya((e + n) / (ya(t) + n)));
}
const _M = /* @__PURE__ */ Le(() => {
  const e = Q((c) => `Item ${c}`), t = Q({}), n = Q(null), r = Q("virtuoso-grid-item"), o = Q("virtuoso-grid-list"), i = Q(Ud), s = Q("div"), a = Q(eo), l = (c, u = null) => jt(
    q(
      t,
      se((d) => d[c]),
      Je()
    ),
    u
  );
  return {
    context: n,
    itemContent: e,
    components: t,
    computeItemKey: i,
    itemClassName: r,
    listClassName: o,
    headerFooterTag: s,
    scrollerRef: a,
    FooterComponent: l("Footer"),
    HeaderComponent: l("Header"),
    ListComponent: l("List", "div"),
    ItemComponent: l("Item", "div"),
    ScrollerComponent: l("Scroller", "div"),
    ScrollSeekPlaceholder: l("ScrollSeekPlaceholder", "div")
  };
}), AM = /* @__PURE__ */ Le(([e, t]) => ({ ...e, ...t }), et(IM, _M)), DM = /* @__PURE__ */ F.memo(function() {
  const t = rt("gridState"), n = rt("listClassName"), r = rt("itemClassName"), o = rt("itemContent"), i = rt("computeItemKey"), s = rt("isSeeking"), a = un("scrollHeight"), l = rt("ItemComponent"), c = rt("ListComponent"), u = rt("ScrollSeekPlaceholder"), d = rt("context"), f = un("itemDimensions"), h = un("gap"), p = rt("log"), m = rt("stateRestoreInProgress"), g = An(
    F.useMemo(
      () => (v) => {
        const b = v.parentElement.parentElement.scrollHeight;
        a(b);
        const y = v.firstChild;
        if (y) {
          const { width: x, height: w } = y.getBoundingClientRect();
          f({ width: x, height: w });
        }
        h({
          row: Wm("row-gap", getComputedStyle(v).rowGap, p),
          column: Wm("column-gap", getComputedStyle(v).columnGap, p)
        });
      },
      [a, f, h, p]
    )
  );
  return m ? null : F.createElement(
    c,
    {
      ref: g,
      className: n,
      ...ct(c, d),
      style: { paddingTop: t.offsetTop, paddingBottom: t.offsetBottom },
      "data-testid": "virtuoso-item-list"
    },
    t.items.map((v) => {
      const b = i(v.index, v.data, d);
      return s ? F.createElement(u, {
        key: b,
        ...ct(u, d),
        index: v.index,
        height: t.itemHeight,
        width: t.itemWidth
      }) : F.createElement(
        l,
        { ...ct(l, d), className: r, "data-index": v.index, key: b },
        o(v.index, v.data, d)
      );
    })
  );
}), MM = F.memo(function() {
  const t = rt("HeaderComponent"), n = un("headerHeight"), r = rt("headerFooterTag"), o = An(F.useMemo(() => (s) => n(pn(s, "height")), [n])), i = rt("context");
  return t ? F.createElement(r, { ref: o }, F.createElement(t, ct(t, i))) : null;
}), NM = F.memo(function() {
  const t = rt("FooterComponent"), n = un("footerHeight"), r = rt("headerFooterTag"), o = An(F.useMemo(() => (s) => n(pn(s, "height")), [n])), i = rt("context");
  return t ? F.createElement(r, { ref: o }, F.createElement(t, ct(t, i))) : null;
}), FM = ({ children: e }) => {
  const t = F.useContext(g0), n = un("itemDimensions"), r = un("viewportDimensions"), o = An(
    F.useMemo(
      () => (i) => {
        r(i.getBoundingClientRect());
      },
      [r]
    )
  );
  return F.useEffect(() => {
    t && (r({ height: t.viewportHeight, width: t.viewportWidth }), n({ height: t.itemHeight, width: t.itemWidth }));
  }, [t, r, n]), /* @__PURE__ */ F.createElement("div", { style: ri(!1), ref: o }, e);
}, LM = ({ children: e }) => {
  const t = F.useContext(g0), n = un("windowViewportRect"), r = un("itemDimensions"), o = rt("customScrollParent"), i = Hd(n, o);
  return F.useEffect(() => {
    t && (r({ height: t.itemHeight, width: t.itemWidth }), n({ offsetTop: 0, visibleHeight: t.viewportHeight, visibleWidth: t.viewportWidth }));
  }, [t, n, r]), /* @__PURE__ */ F.createElement("div", { ref: i, style: ri(!1) }, e);
}, VM = /* @__PURE__ */ F.memo(function({ ...t }) {
  const n = rt("useWindowScroll"), r = rt("customScrollParent"), o = r || n ? jM : $M, i = r || n ? LM : FM;
  return /* @__PURE__ */ F.createElement(o, { ...t }, /* @__PURE__ */ F.createElement(i, null, /* @__PURE__ */ F.createElement(MM, null), /* @__PURE__ */ F.createElement(DM, null), /* @__PURE__ */ F.createElement(NM, null)));
}), {
  Component: SL,
  usePublisher: un,
  useEmitterValue: rt,
  useEmitter: b0
} = /* @__PURE__ */ Fd(
  AM,
  {
    optional: {
      context: "context",
      totalCount: "totalCount",
      overscan: "overscan",
      itemContent: "itemContent",
      components: "components",
      computeItemKey: "computeItemKey",
      data: "data",
      initialItemCount: "initialItemCount",
      scrollSeekConfiguration: "scrollSeekConfiguration",
      headerFooterTag: "headerFooterTag",
      listClassName: "listClassName",
      itemClassName: "itemClassName",
      useWindowScroll: "useWindowScroll",
      customScrollParent: "customScrollParent",
      scrollerRef: "scrollerRef",
      logLevel: "logLevel",
      restoreStateFrom: "restoreStateFrom",
      initialTopMostItemIndex: "initialTopMostItemIndex"
    },
    methods: {
      scrollTo: "scrollTo",
      scrollBy: "scrollBy",
      scrollToIndex: "scrollToIndex"
    },
    events: {
      isScrolling: "isScrolling",
      endReached: "endReached",
      startReached: "startReached",
      rangeChanged: "rangeChanged",
      atBottomStateChange: "atBottomStateChange",
      atTopStateChange: "atTopStateChange",
      stateChanged: "stateChanged"
    }
  },
  VM
), $M = /* @__PURE__ */ Gd({ usePublisher: un, useEmitterValue: rt, useEmitter: b0 }), jM = /* @__PURE__ */ Yd({ usePublisher: un, useEmitterValue: rt, useEmitter: b0 });
function Wm(e, t, n) {
  return t !== "normal" && !(t != null && t.endsWith("px")) && n(`${e} was not resolved to pixel value correctly`, t, tn.WARN), t === "normal" ? 0 : parseInt(t ?? "0", 10);
}
const BM = /* @__PURE__ */ Le(() => {
  const e = Q((l) => /* @__PURE__ */ F.createElement("td", null, "Item $", l)), t = Q(null), n = Q(null), r = Q(null), o = Q({}), i = Q(Ud), s = Q(eo), a = (l, c = null) => jt(
    q(
      o,
      se((u) => u[l]),
      Je()
    ),
    c
  );
  return {
    context: t,
    itemContent: e,
    fixedHeaderContent: n,
    fixedFooterContent: r,
    components: o,
    computeItemKey: i,
    scrollerRef: s,
    TableComponent: a("Table", "table"),
    TableHeadComponent: a("TableHead", "thead"),
    TableFooterComponent: a("TableFoot", "tfoot"),
    TableBodyComponent: a("TableBody", "tbody"),
    TableRowComponent: a("TableRow", "tr"),
    ScrollerComponent: a("Scroller", "div"),
    EmptyPlaceholder: a("EmptyPlaceholder"),
    ScrollSeekPlaceholder: a("ScrollSeekPlaceholder"),
    FillerRow: a("FillerRow")
  };
}), zM = /* @__PURE__ */ Le(([e, t]) => ({ ...e, ...t }), et(p0, BM)), WM = ({ height: e }) => /* @__PURE__ */ F.createElement("tr", null, /* @__PURE__ */ F.createElement("td", { style: { height: e } })), HM = ({ height: e }) => /* @__PURE__ */ F.createElement("tr", null, /* @__PURE__ */ F.createElement("td", { style: { height: e, padding: 0, border: 0 } })), UM = { overflowAnchor: "none" }, GM = /* @__PURE__ */ F.memo(function() {
  const t = je("listState"), n = dn("sizeRanges"), r = je("useWindowScroll"), o = je("customScrollParent"), i = dn("windowScrollContainerState"), s = dn("scrollContainerState"), a = o || r ? i : s, l = je("itemContent"), c = je("trackItemSizes"), u = je("itemSize"), d = je("log"), { callbackRef: f, ref: h } = Zb(
    n,
    u,
    c,
    a,
    d,
    void 0,
    o
  ), [p, m] = F.useState(0);
  Kd("deviation", (A) => {
    p !== A && (h.current.style.marginTop = `${A}px`, m(A));
  });
  const g = je("EmptyPlaceholder"), v = je("ScrollSeekPlaceholder") || WM, b = je("FillerRow") || HM, y = je("TableBodyComponent"), x = je("TableRowComponent"), w = je("computeItemKey"), T = je("isSeeking"), P = je("paddingTopAddition"), I = je("firstItemIndex"), _ = je("statefulTotalCount"), R = je("context");
  if (_ === 0 && g)
    return F.createElement(g, ct(g, R));
  const L = t.offsetTop + P + p, M = t.offsetBottom, V = L > 0 ? /* @__PURE__ */ F.createElement(b, { height: L, key: "padding-top", context: R }) : null, E = M > 0 ? /* @__PURE__ */ F.createElement(b, { height: M, key: "padding-bottom", context: R }) : null, k = t.items.map((A) => {
    const N = A.originalIndex, H = w(N + I, A.data, R);
    return T ? F.createElement(v, {
      ...ct(v, R),
      key: H,
      index: A.index,
      height: A.size,
      type: A.type || "item"
    }) : F.createElement(
      x,
      {
        ...ct(x, R),
        ...y0(x, A.data),
        key: H,
        "data-index": N,
        "data-known-size": A.size,
        "data-item-index": A.index,
        style: UM
      },
      l(A.index, A.data, R)
    );
  });
  return F.createElement(
    y,
    { ref: f, "data-testid": "virtuoso-item-list", ...ct(y, R) },
    [V, ...k, E]
  );
}), YM = ({ children: e }) => {
  const t = F.useContext(il), n = dn("viewportHeight"), r = dn("fixedItemHeight"), o = An(F.useMemo(() => ji(n, (i) => pn(i, "height")), [n]));
  return F.useEffect(() => {
    t && (n(t.viewportHeight), r(t.itemHeight));
  }, [t, n, r]), /* @__PURE__ */ F.createElement("div", { style: ri(!1), ref: o, "data-viewport-type": "element" }, e);
}, qM = ({ children: e }) => {
  const t = F.useContext(il), n = dn("windowViewportRect"), r = dn("fixedItemHeight"), o = je("customScrollParent"), i = Hd(n, o);
  return F.useEffect(() => {
    t && (r(t.itemHeight), n({ offsetTop: 0, visibleHeight: t.viewportHeight, visibleWidth: 100 }));
  }, [t, n, r]), /* @__PURE__ */ F.createElement("div", { ref: i, style: ri(!1), "data-viewport-type": "window" }, e);
}, KM = /* @__PURE__ */ F.memo(function(t) {
  const n = je("useWindowScroll"), r = je("customScrollParent"), o = dn("fixedHeaderHeight"), i = dn("fixedFooterHeight"), s = je("fixedHeaderContent"), a = je("fixedFooterContent"), l = je("context"), c = An(F.useMemo(() => ji(o, (b) => pn(b, "height")), [o])), u = An(F.useMemo(() => ji(i, (b) => pn(b, "height")), [i])), d = r || n ? QM : XM, f = r || n ? qM : YM, h = je("TableComponent"), p = je("TableHeadComponent"), m = je("TableFooterComponent"), g = s ? F.createElement(
    p,
    {
      key: "TableHead",
      style: { zIndex: 2, position: "sticky", top: 0 },
      ref: c,
      ...ct(p, l)
    },
    s()
  ) : null, v = a ? F.createElement(
    m,
    {
      key: "TableFoot",
      style: { zIndex: 1, position: "sticky", bottom: 0 },
      ref: u,
      ...ct(m, l)
    },
    a()
  ) : null;
  return /* @__PURE__ */ F.createElement(d, { ...t }, /* @__PURE__ */ F.createElement(f, null, F.createElement(
    h,
    { style: { borderSpacing: 0, overflowAnchor: "none" }, ...ct(h, l) },
    [g, /* @__PURE__ */ F.createElement(GM, { key: "TableBody" }), v]
  )));
}), {
  Component: ZM,
  usePublisher: dn,
  useEmitterValue: je,
  useEmitter: Kd
} = /* @__PURE__ */ Fd(
  zM,
  {
    required: {},
    optional: {
      restoreStateFrom: "restoreStateFrom",
      context: "context",
      followOutput: "followOutput",
      firstItemIndex: "firstItemIndex",
      itemContent: "itemContent",
      fixedHeaderContent: "fixedHeaderContent",
      fixedFooterContent: "fixedFooterContent",
      overscan: "overscan",
      increaseViewportBy: "increaseViewportBy",
      totalCount: "totalCount",
      topItemCount: "topItemCount",
      initialTopMostItemIndex: "initialTopMostItemIndex",
      components: "components",
      groupCounts: "groupCounts",
      atBottomThreshold: "atBottomThreshold",
      atTopThreshold: "atTopThreshold",
      computeItemKey: "computeItemKey",
      defaultItemHeight: "defaultItemHeight",
      fixedItemHeight: "fixedItemHeight",
      itemSize: "itemSize",
      scrollSeekConfiguration: "scrollSeekConfiguration",
      data: "data",
      initialItemCount: "initialItemCount",
      initialScrollTop: "initialScrollTop",
      alignToBottom: "alignToBottom",
      useWindowScroll: "useWindowScroll",
      customScrollParent: "customScrollParent",
      scrollerRef: "scrollerRef",
      logLevel: "logLevel"
    },
    methods: {
      scrollToIndex: "scrollToIndex",
      scrollIntoView: "scrollIntoView",
      scrollTo: "scrollTo",
      scrollBy: "scrollBy",
      getState: "getState"
    },
    events: {
      isScrolling: "isScrolling",
      endReached: "endReached",
      startReached: "startReached",
      rangeChanged: "rangeChanged",
      atBottomStateChange: "atBottomStateChange",
      atTopStateChange: "atTopStateChange",
      totalListHeightChanged: "totalListHeightChanged",
      itemsRendered: "itemsRendered",
      groupIndices: "groupIndices"
    }
  },
  KM
), XM = /* @__PURE__ */ Gd({ usePublisher: dn, useEmitterValue: je, useEmitter: Kd }), QM = /* @__PURE__ */ Yd({ usePublisher: dn, useEmitterValue: je, useEmitter: Kd }), JM = ZM, eN = (e) => {
  const [t, n] = Me(0);
  return xe(() => {
    const r = e.current;
    if (!r) return;
    const o = r.parentElement;
    if (!o) return;
    const i = () => {
      n(o.clientHeight);
    };
    return o.addEventListener("resize", i), i(), () => {
      o.removeEventListener("resize", i);
    };
  }, []), t;
}, tN = {
  Item: ut(function(t, n) {
    return /* @__PURE__ */ S("li", { ...t, ref: n, className: "flex items-center gap-1 justify-between" });
  }),
  List: ut(function(t, n) {
    return /* @__PURE__ */ S("ul", { ...t, ref: n, className: "space-y-3" });
  })
}, EL = (e) => {
  const t = ye(null), n = eN(t);
  return /* @__PURE__ */ Z("div", { className: "flex flex-row gap-4", ref: t, children: [
    /* @__PURE__ */ Z("div", { className: "py-8 space-y-4 min-w-64 w-fit flex flex-col whitespace-nowrap rounded-lg border border-card-border", children: [
      /* @__PURE__ */ S("header", { className: "border-b border-card-border pb-2" }),
      /* @__PURE__ */ Z("div", { className: "px-8 space-y-2", children: [
        /* @__PURE__ */ S(el, { rightLabel: "", title: "Search", placeholder: "Looking for..." }),
        /* @__PURE__ */ S(
          PM,
          {
            height: n,
            useWindowScroll: !0,
            data: e.source,
            components: tN,
            itemContent: (r, o) => /* @__PURE__ */ S(it, { children: /* @__PURE__ */ S(oA, { children: /* @__PURE__ */ S(e.Item, { data: o }) }) })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ S("div", { children: /* @__PURE__ */ S(Gs, { children: /* @__PURE__ */ S(ad, {}) }) }),
    /* @__PURE__ */ S("div", {})
  ] });
};
var nN = Object.defineProperty, Hm = Object.getOwnPropertySymbols, rN = Object.prototype.hasOwnProperty, oN = Object.prototype.propertyIsEnumerable, Um = (e, t, n) => t in e ? nN(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, iN = (e, t) => {
  for (var n in t || (t = {}))
    rN.call(t, n) && Um(e, n, t[n]);
  if (Hm)
    for (var n of Hm(t))
      oN.call(t, n) && Um(e, n, t[n]);
  return e;
}, Zd = (e, t) => {
  const n = e.length;
  for (let r = 0; r < n; r++)
    if (t(e[r], r, e))
      return !0;
  return !1;
}, sN = (e, t, n, r) => sl(Zd, e, t, n, r), jo = (e) => typeof e == "object", cr = (e, t) => {
  if (e === t)
    return !0;
  if (e instanceof Date && t instanceof Date)
    return e.getTime() === t.getTime();
  if (!e || !t || !jo(e) && !jo(t))
    return e === t;
  if (e.prototype !== t.prototype)
    return !1;
  const n = Object.keys(e);
  return n.length !== Object.keys(t).length ? !1 : n.every((r) => cr(e[r], t[r]));
}, aN = (e, t) => (jo(e) || Array.isArray(e)) && t ? e[t] : e, lN = (e) => (t, n) => t[e] === n[e] ? 0 : t[e] > n[e] ? 1 : -1, va = (e) => /[0-9.]+/.test(e), Gm = (e) => ["string", "number"].includes(typeof e), Ym = (e) => e == null || (e == null ? void 0 : e.length) === 0 || e === "", qm = {
  eq: cr,
  is: Object.is,
  "!=": (e, t) => e != t,
  "!==": (e, t) => e !== t,
  "<": (e, t) => e < t,
  "<=": (e, t) => e <= t,
  "==": (e, t) => e == t,
  "===": (e, t) => e === t,
  ">": (e, t) => e > t,
  ">=": (e, t) => e >= t,
  includes: (e, t) => `${e}`.includes(t),
  notIncludes: (e, t) => !`${e}`.includes(t),
  startsWith: (e, t) => `${e}`.startsWith(t),
  endsWith: (e, t) => `${e}`.endsWith(t),
  like: (e, t) => new RegExp(`.*${t}.*`, "gi").test(`${e}`),
  alphabetical: (e, t) => e.toString().localeCompare(t.toString()),
  empty: Ym,
  notEmpty: (e) => !Ym(e),
  in: (e, t) => Zd(t, (n) => cr(e, n)),
  notIn: (e, t) => w0(t, (n) => !cr(e, n))
}, cN = (e) => {
  if (e in qm)
    return qm[e];
  throw new Error("Linq - Symbol not found");
}, To = (e, t) => {
  const n = [], r = e.length;
  for (let o = 0; o < r; o++)
    t(e[o], o, e) && n.push(e[o]);
  return n;
}, sl = (e, t, n, r, o) => {
  if (typeof n == "function")
    return e(t, n);
  const i = cN(r);
  return n && r && o !== void 0 ? e(t, (s) => i(s[n], o)) : e(t, (s) => i(s, o));
}, uN = (e, t, n, r) => sl(To, e, t, n, r), w0 = (e, t) => {
  for (let n = 0; n < e.length; n++)
    if (!t(e[n], n, e))
      return !1;
  return !0;
}, dN = (e, t, n, r) => sl(w0, e, t, n, r), x0 = (e) => {
  if (e === null)
    return null;
  const t = iN({}, e);
  return Object.keys(t).forEach((n) => t[n] = jo(e[n]) ? x0(e[n]) : e[n]), Array.isArray(e) && e.length ? (t.length = e.length) && Array.from(t) : Array.isArray(e) ? Array.from(e) : t;
}, Km = (e, t) => {
  if (jo(t)) {
    for (let n = 0; n < e.length; n++) {
      const r = e[n];
      if (cr(t, r))
        return !0;
    }
    return !1;
  }
  for (let n = 0; n < e.length; n++) {
    const r = e[n];
    if (cr(t, r))
      return !0;
  }
  return !1;
}, fN = (e, t) => {
  const n = new Map(e.map((r) => [r[t], r]));
  return Object.fromEntries(n.entries());
}, hN = (e) => To(
  e,
  (t, n, r) => jo(t) ? n === r.findIndex((o) => cr(o, t)) : n === r.indexOf(t)
), pN = (e, t) => {
  const n = e.length;
  for (let r = 0; r < n; r++)
    if (t(e[r], r, e))
      return e[r];
}, T0 = (e, t) => {
  const n = /* @__PURE__ */ new Map();
  return e.forEach((r) => {
    const o = t(r), i = n.get(o) || [];
    i.push(r), n.set(o, i);
  }), Object.fromEntries(n.entries());
}, mN = (e, t) => T0(e, (n) => n[t]), Zm = (e, t) => {
  const n = [];
  let r = 0;
  const o = e.length;
  for (r; r < o; r++) {
    const i = t(e[r], r, e);
    n.push(i);
  }
  return n;
}, gN = (e, t) => {
  let n = Number.parseInt(e, 10), r = Number.parseInt(t, 10);
  return n > r ? [r, n] : [n, r];
}, yN = (e, t, n = 1) => {
  const r = [];
  let o = e.charCodeAt(0);
  const i = t.charCodeAt(0);
  for (; o <= i; o += n)
    r.push(String.fromCharCode(o));
  return va(e) && va(t) ? r.map((s) => Number.parseInt(s)) : r;
}, hc = (e, t, n = 1) => {
  let r = Math.abs(n);
  if ((e.length > 1 || t.length > 1) && va(e) && va(t)) {
    const o = [], [i, s] = gN(e, t);
    for (let a = i; a <= s; a += r)
      o.push(a);
    return o;
  }
  return yN(e, t, r);
}, vN = (e, t, n = 1) => {
  if (t === void 0) {
    const [r, o, i] = e.split("..");
    return i === void 0 ? hc(r, o, 1) : hc(r, i, Number.parseInt(o, 10));
  }
  return Gm(e) && Gm(t) ? hc(`${e}`, `${t}`, n) : Array.from({ length: e }, (r, o) => o * Math.abs(t));
}, pc = (e, t, n) => {
  let r = t;
  const o = n.length;
  for (let i = 0; i < o; i++) {
    const s = n[i];
    r = e(r, s, i, n);
  }
  return r;
}, Xm = (e) => {
  const t = Array.from(e.values());
  let n = null, r = null, o = t.length;
  for (n = 0; n < o / 2; n += 1) {
    r = o - 1 - n;
    let i = t[n];
    t[n] = t[r], t[r] = i;
  }
  return t;
}, bN = (e, t) => {
  if (typeof t == "number")
    return e.slice(t);
  let n = e.length;
  for (let r = 0; r < n; r++) {
    const o = e[r];
    if (t(o, r, e))
      return e.slice(r);
  }
  return e.slice(0);
}, wN = (e, t, n, r) => sl(bN, e, t, n, r), Qm = (e, t) => {
  const n = [...e];
  return t === void 0 ? n.sort() : typeof t == "function" ? n.toSorted(t) : n.toSorted(lN(t));
}, S0 = /* @__PURE__ */ ((e) => (e.Asc = "asc", e.Desc = "desc", e))(S0 || {}), xN = (e) => (t, n) => e.reduce((r, o) => {
  const i = o.type === "desc" ? -1 : 1, s = o.key, a = t[s] > n[s] ? i : t[s] < n[s] ? -i : 0;
  return r !== 0 ? r : a;
}, 0), TN = (e, t) => e.sort(xN(t)), SN = (e, t) => {
  if (t === void 0)
    return [...new Set(e).values()];
  const n = /* @__PURE__ */ new Set();
  return Array.isArray(t) ? [...new Set(t)] : To(e, (r) => {
    const o = t ? n.has(r[t]) : n.has(t);
    return t && (o || n.add(r[t])), !o;
  });
}, EN = class pu {
  constructor(t = []) {
    this.array = t;
  }
  static Range(...t) {
    return vN(...t);
  }
  static New(t) {
    return new pu(t);
  }
  Where(t, n, r) {
    return this.array = uN(this.array, t, n, r), this;
  }
  Some(t, n, r) {
    return sN(this.array, t, n, r);
  }
  All(t, n, r) {
    return dN(this.array, t, n, r);
  }
  Reverse() {
    return this.array = Xm(this.array), this;
  }
  Add(t) {
    return this.array = Array.isArray(t) ? this.array.concat(t) : this.array.concat([t]), this;
  }
  Prepend(t) {
    return this.array = Array.isArray(t) ? t.concat(this.array) : [t].concat(this.array), this;
  }
  Select(t) {
    return t === void 0 ? this.array : this.array.map(t);
  }
  Take(t, n) {
    return n !== void 0 ? this.array = this.array.slice(t, Math.max(0, n)) : this.array = this.array.slice(t), this;
  }
  Head() {
    return this.array[0];
  }
  Tail() {
    return this.Skip(1);
  }
  Skip(t, n, r) {
    return this.array = wN(this.array, t, n, r), this;
  }
  Distinct() {
    return this.array = hN(this.array), this;
  }
  First(t) {
    return t === void 0 ? this.array[0] : pN(this.array, t) || null;
  }
  Last(t) {
    const n = this.array.length;
    if (t === void 0)
      return this.array[n - 1];
    for (let r = n; r !== 0; r--)
      if (t(this.array[r], r, this.array))
        return this.array[r];
  }
  Sum(t) {
    return t === void 0 ? pc((n, r) => n + r, 0, this.array) : pc((n, r) => n + aN(r, t), 0, this.array);
  }
  Average(t) {
    return this.Sum(t) / this.array.length;
  }
  GroupBy(t) {
    return mN(this.array, t);
  }
  GroupWith(t) {
    return T0(this.array, t);
  }
  Except(t) {
    return To(this.array, (n) => !Km(t, n));
  }
  Intersect(t) {
    return To(this.array, (n) => Km(t, n));
  }
  OrderBy(t, n) {
    let r;
    return r = t ? Qm(this.array, t) : this.array.toSorted(), this.array = n === "desc" ? Xm(r) : r, this;
  }
  Includes(t) {
    return Zd(this.array, (n) => cr(n, t));
  }
  In(t) {
    const n = t.length;
    for (let r = 0; r < n; r++) {
      const o = t[r];
      if (this.Includes(o))
        return !0;
    }
    return !1;
  }
  Reduce(t, n) {
    return pc(t, n ?? this.array[0], this.array);
  }
  Empty() {
    return this.array.length === 0;
  }
  ToMap(t) {
    return new Map(Zm(this.array, (n) => [t, n]));
  }
  Zip(t, n) {
    return Zm(this.array, (r, o) => n(r, t[o]));
  }
  Count(t) {
    return t === void 0 ? this.array.length : To(this.array, t).length;
  }
  Get(t) {
    return this.array[t];
  }
  Clone() {
    return new pu(x0(this.array));
  }
  ToObject(t) {
    return fN(this.array, t);
  }
  Sort(t) {
    return Array.isArray(t) ? TN(this.array, t) : Qm(this.array, t);
  }
  Unique(t) {
    return SN(this.array, t);
  }
}, E0 = EN;
const Jm = (e) => {
  const t = ye(e);
  return xe(() => {
    t.current = e;
  }), t;
};
var mu = {};
(function(e) {
  Object.defineProperty(e, Symbol.toStringTag, { value: "Module" });
  const t = (g, v) => {
    try {
      Object.keys(g).forEach(v);
    } catch (b) {
      window.console.log(b);
    }
  }, n = (g) => g == null, r = (g) => {
    const v = typeof g;
    return v === "string" || v === "number" || v === "boolean" || n(g);
  }, o = (g, v) => {
    const b = v.getItem(g);
    try {
      return JSON.parse(b);
    } catch {
      return b ?? null;
    }
  }, i = (g) => Object.keys(g).reduce((v, b) => ({ ...v, [b]: o(b, g) }), {}), s = (g) => g instanceof Date ? g : typeof g == "number" ? new Date(/* @__PURE__ */ new Date() * 1 + g * 864e5) : g, a = "1969-12-31T23:59:59.000Z", l = () => document.cookie === "" ? {} : document.cookie.split("; ").map((g) => g.split("=")).reduce((g, v) => (g[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim()), g), {}), c = /* @__PURE__ */ new Set(), u = () => {
    const g = l();
    c.forEach((v) => v(g));
  }, d = [{ name: "expires", parse: (g) => `expires=${s(g.expires ?? a)}` }, { name: "maxAge", parse: (g) => g.maxAge ? `max-age=${s(g.expires ?? a)}` : "" }, { name: "path", parse: (g) => `path=${g.path ?? "/"}` }, { name: "sameSite", parse: (g) => `samesite=${g.sameSite ?? "strict"}` }, { name: "useSecure", parse: (g) => `${g.useSecure ?? !0 ? "secure" : ""}` }, { name: "domain", parse: (g) => {
    const v = g.domain ?? "";
    return v === "" ? "" : `domain=${g.multiDomain ? "." : ""}${v}`;
  } }, { name: "partitioned", parse: (g) => g.partitioned ? "Partitioned" : "" }], f = { json: l, listener: (g) => (c.add(g), () => c.delete(g)), clearListeners: () => c.clear(), has: (g) => document.cookie.split(";").some((v) => v.trim().startsWith(`${g}=`)), deleteAll: () => {
    document.cookie.split(";").forEach((g) => {
      document.cookie = g.replace(/^ +/, "").replace(/=.*/, `=;expires=${(/* @__PURE__ */ new Date()).toUTCString()};path=/`);
    }), u();
  }, get: (g) => {
    const v = f.json()[g];
    if (n(v)) return null;
    try {
      return JSON.parse(decodeURIComponent(v));
    } catch {
      return v;
    }
  }, delete: (g) => {
    document.cookie = `${encodeURIComponent(g)}=;expires=${(/* @__PURE__ */ new Date()).toUTCString()}`, u();
  }, set: (g, v, b = {}) => {
    const y = r(v) ? v : encodeURIComponent(JSON.stringify(v)), x = d.reduce((w, T) => {
      const P = T.parse(b);
      return P === "" ? w : w.concat(P);
    }, [`${encodeURIComponent(g)}=${y}`]).join(";");
    document.cookie = x, u();
  } }, h = (g) => {
    const v = /* @__PURE__ */ new Set(), b = (y) => {
      g().removeItem(y);
      const x = i(g());
      v.forEach((w) => w(x));
    };
    return { delete: b, listener: (y) => (v.add(y), () => v.delete(y)), clearListeners: () => v.clear(), json: (y = !1) => y ? i(g()) : g(), has: (y) => {
      const x = g().getItem(y);
      return !n(x);
    }, deleteAll: () => {
      t(g(), b), v.forEach((y) => y(g()));
    }, get: (y) => o(y, g()), set: (y, x) => {
      g().setItem(y, JSON.stringify(x)), v.forEach((w) => w(g()));
    } };
  }, p = h(() => window.sessionStorage), m = h(() => window.localStorage);
  e.Cookie = f, e.LocalStorage = m, e.SessionStorage = p, e.createStorage = h;
})(mu);
const Xd = (e) => e.headerLabel ?? e.thead ?? e.id, C0 = (e) => e.map((t) => ({
  value: t.id,
  label: t.thead ?? t.headerLabel ?? t.id
}));
var Ri = /* @__PURE__ */ ((e) => (e.Boolean = "boolean", e.Number = "number", e.Select = "select", e.Text = "text", e))(Ri || {});
const Qd = (e) => e.type === "number" ? e.valueAsNumber : e.value, CL = (e) => {
  let t = [];
  return e({ add: (o, i, s) => t.push({ ...s, id: o, thead: i }), remove: (o) => t = t.filter((i) => i.id !== o) }), t;
}, CN = {}, PL = (e, t = CN) => {
  const n = nu() ? null : mu.LocalStorage.get(`@unamed/table-${e}`) || null, [r, o] = hd(
    {
      name: e,
      groups: t.groups || (n == null ? void 0 : n.groups) || [],
      sorters: t.sorters || (n == null ? void 0 : n.sorters) || [],
      filters: t.filters || (n == null ? void 0 : n.filters) || [],
      cols: t.cols || (n == null ? void 0 : n.cols) || []
    },
    (i) => {
      const s = (a) => {
        const l = i.state(), c = { ...l, ...a };
        return nu() || mu.LocalStorage.set(`@unamed/table-${l.name}`, c), c;
      };
      return {
        set: (a) => s(a)
      };
    }
  );
  return { ...r, ...o, name: e };
}, gu = (e, t, n, r = {}) => {
  var l;
  const o = e.id, i = e.type ?? Ri.Text, s = (l = t[i]) == null ? void 0 : l[0].value, a = n[s];
  return { id: _d(), operation: a, label: Xd(e), name: o, type: i, value: "", ...r };
}, Jd = () => {
  const e = yn(), t = Ue(() => ({
    contains: { value: "contains", label: e.tableFilterTypeContains, symbol: "includes" },
    is: { value: "is", label: e.tableFilterTypeIs, symbol: "is" },
    isNot: { value: "isNot", label: e.tableFilterTypeIsNot, symbol: "!==" },
    notContains: { value: "notContains", label: e.tableFilterTypeNotContains, symbol: "notIncludes" },
    lessThan: { value: "lessThan", label: e.tableFilterTypeLessThan, symbol: "<=" },
    greaterThan: { value: "greaterThan", label: e.tableFilterTypeGreaterThan, symbol: ">=" },
    startsWith: { value: "startsWith", label: e.tableFilterTypeStartsWith, symbol: "startsWith" },
    endsWith: { value: "endsWith", label: e.tableFilterTypeEndsWith, symbol: "endsWith" }
  }), [e]);
  return { operationOptions: Ue(() => ({
    [Ri.Text]: [t.is, t.isNot, t.contains, t.notContains, t.startsWith, t.endsWith],
    [Ri.Boolean]: [t.is, t.isNot],
    [Ri.Number]: [t.is, t.isNot, t.greaterThan, t.lessThan]
  }), [e]), operations: t };
}, PN = (e) => {
  const t = yn(), { operationOptions: n, operations: r } = Jd(), o = () => {
    const c = e.cols.at(0);
    e.set((u) => [...u, gu(c, n, r)]);
  }, i = (c) => {
    const u = c.target.dataset.id || "", d = c.target.value;
    e.set(
      (f) => f.map((h) => {
        if (u !== h.id) return h;
        const p = e.cols.find((m) => d === m.id);
        return gu(p, n, r, { value: "" });
      })
    );
  }, s = (c) => {
    const u = c.target.dataset.id || "", d = c.target.value;
    e.set((f) => f.map((h) => h.id === u ? { ...h, operation: r[d] } : h));
  }, a = (c) => {
    const u = c.currentTarget.dataset.id || "";
    e.set((d) => d.filter((f) => f.id !== u));
  }, l = (c) => {
    const u = c.target.dataset.id || "", d = Qd(c.target);
    e.set((f) => f.map((h) => h.id === u ? { ...h, value: d } : h));
  };
  return /* @__PURE__ */ S(it, { children: /* @__PURE__ */ S(
    cs,
    {
      arrow: !0,
      title: t.tableFilterDropdownTitle,
      trigger: /* @__PURE__ */ Z("span", { className: "flex items-center gap-1 proportional-nums", children: [
        /* @__PURE__ */ S(jP, { size: 14 }),
        t.tableFilterLabel,
        " ",
        e.filters.length === 0 ? "" : ` (${e.filters.length})`
      ] }),
      children: /* @__PURE__ */ Z("ul", { className: "mt-4 space-y-2", children: [
        e.filters.map((c) => {
          const u = n[c.type];
          return /* @__PURE__ */ Z("li", { className: "flex flex-nowrap gap-3", children: [
            /* @__PURE__ */ S(
              Kr,
              {
                options: e.options,
                title: t.tableFilterColumnTitle,
                placeholder: t.tableFilterColumnPlaceholder,
                value: c.name,
                "data-id": c.id,
                onChange: i
              }
            ),
            /* @__PURE__ */ S(
              Kr,
              {
                "data-id": c.id,
                onChange: s,
                value: c.operation.value,
                options: u,
                title: t.tableFilterOperatorTitle,
                placeholder: t.tableFilterOperatorPlaceholder
              }
            ),
            /* @__PURE__ */ S(
              el,
              {
                "data-id": c.id,
                onChange: l,
                title: t.tableFilterValueTitle,
                placeholder: t.tableFilterValuePlaceholder,
                type: c.type,
                value: c.value,
                optionalText: ""
              }
            ),
            /* @__PURE__ */ S("div", { className: "flex items-center justify-center mt-5", children: /* @__PURE__ */ S("button", { "data-id": c.id, type: "button", onClick: a, children: /* @__PURE__ */ S(Ao, { className: "text-danger", size: 16 }) }) })
          ] }, `filter-select-${c.id}`);
        }),
        /* @__PURE__ */ S("li", { children: /* @__PURE__ */ Z("button", { type: "button", onClick: o, className: "text-primary flex items-center gap-1", children: [
          /* @__PURE__ */ S(ld, { size: 14 }),
          " ",
          t.tableFilterNewFilter
        ] }) })
      ] })
    }
  ) });
}, RN = ({ filter: e, onDelete: t, set: n }) => {
  const r = yn(), { operationOptions: o, operations: i } = Jd(), s = (l) => {
    const c = l.target.value, u = l.target.dataset.id || "";
    n((d) => d.map((f) => f.id === u ? { ...f, operation: i[c] } : f));
  }, a = (l) => {
    const c = l.target.dataset.id || "", u = Qd(l.target);
    n((d) => d.map((f) => f.id === c ? { ...f, value: u } : f));
  };
  return /* @__PURE__ */ Z("div", { className: "flex flex-nowrap items-center gap-4 py-2", children: [
    /* @__PURE__ */ S(
      Kr,
      {
        "data-id": e.id,
        onChange: s,
        options: o[e.type],
        title: r.tableFilterColumnTitle,
        placeholder: r.tableFilterColumnPlaceholder,
        value: e.operation.value
      }
    ),
    /* @__PURE__ */ S(
      el,
      {
        "data-id": e.id,
        onChange: a,
        type: e.type,
        value: e.value,
        title: r.tableFilterValueTitle,
        placeholder: r.tableFilterValueTitle
      }
    ),
    /* @__PURE__ */ S("button", { onClick: t, "data-id": e.id, type: "button", className: "mt-4", children: /* @__PURE__ */ S(Ao, { className: "text-danger", size: 14 }) })
  ] });
}, kN = ({ item: e, onPointerDown: t }) => {
  const n = _o(0);
  return /* @__PURE__ */ Z(
    Ga.Item,
    {
      onPointerDown: t,
      id: e.groupId,
      className: "flex flex-row items-center gap-2",
      value: e,
      style: { y: n },
      children: [
        /* @__PURE__ */ S("button", { type: "button", className: "cursor-grab", children: /* @__PURE__ */ S(VP, { size: 14 }) }),
        /* @__PURE__ */ S("span", { children: e.groupName })
      ]
    },
    e.groupId
  );
}, ON = (e) => {
  var a;
  const t = C0(e.cols), n = RP(), [r, o] = Me(((a = e.groups[0]) == null ? void 0 : a.thead) || ""), i = (l) => {
    var m;
    const c = l.target, u = c.value, d = c.options.selectedIndex, f = ((m = c.options.item(d)) == null ? void 0 : m.label) || "";
    o(f);
    const h = new E0(e.rows).GroupBy(u), p = e.cols.find((g) => g.id === u);
    e.setGroups(
      n1(h).map((g, v) => {
        const b = h[g];
        return { ...p, groupId: _d(), groupKey: u, index: v, rows: b, groupName: g };
      })
    );
  }, s = () => e.setGroups([]);
  return /* @__PURE__ */ S(it, { children: /* @__PURE__ */ Z(
    cs,
    {
      arrow: !1,
      title: "Groups",
      trigger: /* @__PURE__ */ Z("span", { className: "flex items-center gap-1 proportional-nums", children: [
        /* @__PURE__ */ S(zP, { size: 14 }),
        "Groups",
        e.groups.length > 0 ? ` - ${r}(${e.groups.length})` : ""
      ] }),
      children: [
        /* @__PURE__ */ Z("div", { className: "flex flex-nowrap items-center", children: [
          /* @__PURE__ */ S(Kr, { value: r, title: "Tipo de agrupamento", onChange: i, options: t, placeholder: "Agrupar por..." }),
          /* @__PURE__ */ S(Gs, { className: "mt-4", onClick: s, theme: "raw", "data-id": r, children: /* @__PURE__ */ S(Ao, { size: 16, className: "text-danger" }) })
        ] }),
        e.groups.length > 0 ? /* @__PURE__ */ Z("section", { className: "my-4", children: [
          /* @__PURE__ */ S("header", { children: /* @__PURE__ */ S("h2", { className: "text-xl font-medium", children: "Order groups" }) }),
          /* @__PURE__ */ S(fP, { children: /* @__PURE__ */ S(
            Ga.Group,
            {
              axis: "y",
              className: "relative space-y-2",
              drag: !0,
              dragControls: n,
              dragListener: !1,
              layoutScroll: !0,
              onReorder: e.setGroups,
              values: e.groups,
              children: e.groups.map((l) => /* @__PURE__ */ S(
                kN,
                {
                  item: l,
                  onPointerDown: (c) => {
                    n.start(c), e.setGroups([...e.groups]);
                  }
                },
                l.groupId
              ))
            }
          ) })
        ] }) : null
      ]
    }
  ) });
}, IN = (e) => (t, n) => e.reduce((r, o) => {
  const i = o.type === "desc" ? -1 : 1, s = o.value, a = t[s] > n[s] ? i : t[s] < n[s] ? -i : 0;
  return r !== 0 ? r : a;
}, 0), _N = (e, t) => e.toSorted(IN(t)), P0 = (e, t, n) => ({
  id: _d(),
  type: n,
  value: e.id,
  label: t
}), AN = (e) => {
  const t = yn(), n = {
    asc: {
      label: t.tableSortAsc,
      value: "asc"
      /* Asc */
    },
    desc: {
      label: t.tableSortDesc,
      value: "desc"
      /* Desc */
    }
  }, r = [n.asc, n.desc], o = () => {
    const l = e.cols[0];
    l && e.set((c) => [...c, P0(l, n.asc.label, n.asc.value)]);
  }, i = (l) => (c) => {
    const u = c.target.value;
    e.set((d) => d.map((f) => f.id === l ? { ...f, value: u } : f));
  }, s = (l) => (c) => {
    const u = c.target.value;
    e.set((d) => d.map((f) => f.id === l ? { ...f, type: u } : f));
  }, a = (l) => {
    const c = l.currentTarget.dataset.id || "";
    e.set((u) => u.filter((d) => d.id !== c));
  };
  return /* @__PURE__ */ S(it, { children: /* @__PURE__ */ S(
    cs,
    {
      title: t.tableSortDropdownTitle,
      trigger: /* @__PURE__ */ Z("span", { className: "flex items-center gap-1 proportional-nums", children: [
        /* @__PURE__ */ S(yv, { size: 14 }),
        t.tableSortOrderByLabel,
        " ",
        e.sorters.length === 0 ? "" : ` (${e.sorters.length})`
      ] }),
      children: /* @__PURE__ */ Z("ul", { className: "mt-4 space-y-2", children: [
        e.sorters.map((l) => /* @__PURE__ */ Z("li", { className: "flex flex-nowrap gap-3", children: [
          /* @__PURE__ */ S(
            Kr,
            {
              options: e.options,
              value: l.value,
              onChange: i(l.id),
              title: t.tableSortOrderInputTitle,
              placeholder: t.tableSortOrderInputPlaceholder
            }
          ),
          /* @__PURE__ */ S(
            Kr,
            {
              onChange: s(l.id),
              value: l.type,
              options: r,
              title: t.tableSortTypeInputTitle,
              placeholder: t.tableSortTypeInputPlaceholder
            }
          ),
          /* @__PURE__ */ S("button", { className: "mt-4", "data-id": l.id, onClick: a, children: /* @__PURE__ */ S(Ao, { className: "text-danger", size: 14 }) })
        ] }, `sorter-select-${l.id}`)),
        /* @__PURE__ */ S("li", { children: /* @__PURE__ */ Z("button", { type: "button", onClick: o, className: "text-primary flex items-center gap-1", children: [
          /* @__PURE__ */ S(ld, { size: 14 }),
          " ",
          t.tableSortAddButton
        ] }) })
      ] })
    }
  ) });
}, DN = (e) => {
  const t = yn(), [n, r] = Me(() => {
    const a = e.sorters.find((l) => l.value === e.col.id);
    return a ? a.type : "undefined";
  }), o = () => r(
    (a) => a === "undefined" ? "asc" : a === "asc" ? "desc" : "undefined"
    /* Undefined */
  );
  xe(() => {
    e.setSorters((a) => {
      if (n === "undefined") return a.filter((u) => u.value !== e.col.id);
      const l = a.findIndex((u) => u.value === e.col.id), c = P0(e.col, n, n);
      return l === -1 ? [...a, c] : (a[l] = c, [...a]);
    });
  }, [n, e.col]);
  const i = `${e.col.id}-sorter-id`, s = Xd(e.col);
  return /* @__PURE__ */ Z("button", { "aria-labelledby": i, className: "isolate flex items-center", onClick: o, type: "button", children: [
    /* @__PURE__ */ Z("span", { id: i, className: "sr-only", children: [
      t.tableSortDropdownTitle,
      " ",
      s
    ] }),
    n === "asc" ? /* @__PURE__ */ S(AP, { size: 14 }) : null,
    n === "desc" ? /* @__PURE__ */ S(_P, { size: 14 }) : null,
    n === "undefined" ? /* @__PURE__ */ S(yv, { size: 14 }) : null
  ] });
}, MN = (e) => /* @__PURE__ */ S("header", { className: "min-w-full mb-1", children: /* @__PURE__ */ Z("div", { className: "flex flex-wrap min-w-full items-center justify-between gap-x-4 gap-y-1", children: [
  /* @__PURE__ */ Z("div", { className: "flex w-fit items-centeend gap-4 whitespace-nowrap py-2", children: [
    /* @__PURE__ */ S("span", { children: /* @__PURE__ */ S(PN, { cols: e.cols, options: e.options, filters: e.filters, set: e.setFilters }) }),
    /* @__PURE__ */ S("span", { children: /* @__PURE__ */ S(AN, { options: e.options, cols: e.cols, sorters: e.sorters, set: e.setSorters }) }),
    /* @__PURE__ */ S("span", { children: /* @__PURE__ */ S(ON, { rows: e.rows, groups: e.groups, setGroups: e.setGroups, options: e.options, cols: e.cols }) })
  ] }),
  /* @__PURE__ */ S("ul", { className: "flex flex-wrap w-full flex-1 flex-grow flex-row items-center md:justify-end gap-4", children: e.filters.map((t) => /* @__PURE__ */ Z("li", { className: "flex gap-1 items-center rounded-xl border border-card-border px-4 py-0.5", children: [
    /* @__PURE__ */ Z("span", { children: [
      /* @__PURE__ */ S("span", { className: "size-3 mr-2 aspect-square bg-primary inline-block rounded-full", "aria-hidden": "true" }),
      t.label,
      " ",
      t.operation.label.toLowerCase(),
      ":"
    ] }),
    /* @__PURE__ */ Z("div", { className: "relative w-min min-w-[1ch]", children: [
      /* @__PURE__ */ S("span", { "aria-hidden": "true", className: "invisible whitespace-pre p-0", children: t.value || " " }),
      /* @__PURE__ */ S(
        "input",
        {
          type: t.type,
          value: t.value,
          className: "absolute left-0 top-0 m-0 inline-block w-full bg-transparent p-0 placeholder-primary/70 outline-none [appearance:textfield] after:empty:text-primary/70 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          onChange: (n) => {
            const r = Qd(n.target);
            e.setFilters(
              (o) => o.map(
                (i) => t.id === i.id ? {
                  ...i,
                  value: r
                } : i
              )
            );
          }
        }
      )
    ] })
  ] }, `filter-table-${t.id}`)) })
] }) });
function NN(e, t) {
  if (!e || !t) return [];
  const n = [1];
  if (e === 1 && t === 1) return n;
  e > 4 && n.push("-");
  let r = 2;
  const o = e - r, i = e + r;
  for (let a = o > 2 ? o : 2; a <= Math.min(t, i); a++) n.push(a);
  const s = t - 2;
  return i + 1 !== s && i + 1 < t && n.push("_"), i < t && (n.push(t - 2), n.push(t - 1), n.push(t)), Array.from(new Set(n));
}
const FN = (e) => {
  const t = Yn(), n = yn(), r = e.asLink || "button", o = Ue(() => NN(e.current, e.pages), [e.current, e.pages]), i = e.current < e.pages;
  return /* @__PURE__ */ Z("footer", { className: "flex px-1 py-4 items-center justify-center gap-4 lg:justify-between flex-wrap lg:flex-nowrap", children: [
    /* @__PURE__ */ S("p", { children: /* @__PURE__ */ S(
      n.tablePaginationFooter,
      {
        ...e,
        sizes: e.sizes,
        select: e.onChangeSize && Array.isArray(e.sizes) ? /* @__PURE__ */ Z(it, { children: [
          /* @__PURE__ */ S("label", { htmlFor: t, children: n.tablePaginationSelectLabel }),
          /* @__PURE__ */ S(
            "select",
            {
              id: t,
              value: e.size,
              className: "cursor-pointer bg-transparent",
              onChange: (s) => {
                var a;
                (a = e.onChangeSize) == null || a.call(e, Number(s.target.value));
              },
              children: e.sizes.map((s) => /* @__PURE__ */ S("option", { value: s, children: s }, `pagination-opt-${s}`))
            }
          ),
          " "
        ] }) : null
      }
    ) }),
    /* @__PURE__ */ S("nav", { children: /* @__PURE__ */ Z("ul", { className: "flex items-center gap-2", children: [
      e.current > 1 ? /* @__PURE__ */ S("li", { children: /* @__PURE__ */ S(r, { href: "previous", className: "", children: n.tablePaginationPrevious }) }) : null,
      o.map((s) => s === null ? null : /* @__PURE__ */ S(it, { children: typeof s == "string" ? /* @__PURE__ */ S("li", { children: "..." }) : /* @__PURE__ */ S("li", { children: /* @__PURE__ */ S(
        r,
        {
          href: s,
          className: `cursor-pointer px-3 py-1 transition-colors border-b-2 hover:text-primary-subtle hover:border-primary-subtle proportional-nums ${s === e.current ? "text-primary border-primary" : "border-transparent"}`,
          children: s
        }
      ) }) }, `pagination-${s}`)),
      i ? /* @__PURE__ */ S("li", { children: /* @__PURE__ */ S(r, { href: "next", className: "", children: n.tablePaginationNext }) }) : null
    ] }) })
  ] });
}, LN = { opacity: 1 }, VN = { opacity: 0.75, backgroundColor: "var(--table-border)" }, $N = { opacity: 0, transition: { duration: 0.4, type: "spring" } }, jN = (e) => {
  var d;
  const t = yn(), n = e.filters.filter((f) => f.name === e.header.id), o = n.length > 0 ? HP : BP, { operationOptions: i, operations: s } = Jd(), a = (f) => {
    const h = f.currentTarget.dataset.id || "";
    return e.setFilters((p) => p.filter((m) => m.id !== h));
  }, l = e.sorters.find((f) => e.header.id === f.value), c = l != null && l.type ? l.type === S0.Asc ? "ascending" : "descending" : "none", u = Xd(e.header);
  return /* @__PURE__ */ S(
    Ga.Item,
    {
      ...e.header.thProps,
      as: "th",
      exit: $N,
      initial: !1,
      dragSnapToOrigin: !0,
      dragDirectionLock: !0,
      role: "columnheader",
      value: e.header,
      whileDrag: VN,
      "aria-sort": c,
      "aria-busy": e.loading,
      animate: LN,
      className: `hidden font-medium px-2 py-4 first:table-cell md:table-cell ${((d = e.header.thProps) == null ? void 0 : d.className) ?? ""}`,
      children: /* @__PURE__ */ S("span", { className: "flex items-center justify-between", children: /* @__PURE__ */ Z("span", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ S(
          cs,
          {
            arrow: !0,
            trigger: /* @__PURE__ */ Z("span", { children: [
              /* @__PURE__ */ Z("span", { id: `${e.header.id}-filter-dropdown-button`, className: "sr-only", children: [
                t.tableFilterDropdownTitleUnique,
                " ",
                u
              ] }),
              /* @__PURE__ */ S(o, { "aria-labelledby": `${e.header.id}-filter-dropdown-button`, size: 14 })
            ] }),
            title: /* @__PURE__ */ Z("span", { children: [
              t.tableFilterDropdownTitleUnique,
              " ",
              /* @__PURE__ */ S("span", { className: "text-primary", children: u })
            ] }),
            children: n.length === 0 === null ? null : /* @__PURE__ */ Z("ul", { className: "font-medium", children: [
              n.map((f) => /* @__PURE__ */ S("li", { className: "my-1", children: /* @__PURE__ */ S(RN, { onDelete: a, filter: f, set: e.setFilters }) }, `thead-filter-${f.id}`)),
              /* @__PURE__ */ S("li", { children: /* @__PURE__ */ Z(
                "button",
                {
                  onClick: () => e.setFilters((f) => f.concat(gu(e.header, i, s))),
                  type: "button",
                  className: "text-primary flex items-center gap-1",
                  children: [
                    /* @__PURE__ */ S(ld, { size: 14 }),
                    " ",
                    t.tableFilterNewFilter
                  ]
                }
              ) })
            ] })
          }
        ),
        /* @__PURE__ */ S("span", { className: "pointer-events-auto text-balance text-base", children: e.header.thead }),
        /* @__PURE__ */ S(DN, { col: e.header, setSorters: e.setSorters, sorters: e.sorters })
      ] }) })
    }
  );
}, BN = (e) => /* @__PURE__ */ S(
  Ga.Group,
  {
    as: "tr",
    role: "row",
    axis: "x",
    drag: !0,
    layout: !0,
    layoutRoot: !0,
    layoutScroll: !0,
    initial: !1,
    values: e.headers,
    onReorder: e.setCols,
    className: "bg-table-background border-none text-lg",
    children: /* @__PURE__ */ S(Ua, { children: e.headers.map((t) => /* @__PURE__ */ S(
      jN,
      {
        loading: e.loading,
        setFilters: e.setFilters,
        filters: e.filters,
        setSorters: e.setSorters,
        sorters: e.sorters,
        header: t
      },
      `header-child-item-${t.id}`
    )) })
  }
), zN = (e) => Math.min(Math.max(e + e * (e % 2 === 0 ? 2 : 4) + 10, 50), 90), WN = F.forwardRef((e, t) => /* @__PURE__ */ S("tbody", { ...e, role: "rowgroup", className: `divide-y divide-table-border ${e.className ?? ""}`, ref: t, children: /* @__PURE__ */ S(Ua, { children: e.children }) })), HN = F.forwardRef((e, t) => /* @__PURE__ */ S(
  "table",
  {
    ...e,
    ref: t,
    role: "table",
    className: `table min-w-full divide-y divide-table-border table-auto text-left ${e.className ?? ""}`
  }
)), UN = F.forwardRef(({ context: e, ...t }, n) => /* @__PURE__ */ S("thead", { ...t, role: "rowgroup", className: "bg-card-background shadow-xs group:sticky top-0", ref: n })), GN = F.forwardRef(({ context: e, item: t, ...n }, r) => /* @__PURE__ */ S("tr", { ...n, role: "row", ref: r, className: `table-row ${n.className ?? ""}` })), YN = F.forwardRef((e, t) => e.context.loadingMore ? /* @__PURE__ */ S("tfoot", { ...e, ref: t, className: "bg-card-background", children: /* @__PURE__ */ S("tr", { role: "row", className: "bg-card-background", children: /* @__PURE__ */ S("td", { colSpan: 999, className: "px-2 h-14 bg-card-background", children: /* @__PURE__ */ S("span", { className: "block w-full h-2 bg-foreground rounded opacity-60 animate-pulse" }) }) }) }) : null), qN = {
  TableHead: UN,
  Table: HN,
  TableBody: WN,
  TableRow: GN,
  TableFoot: YN
}, KN = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ZN = (e, t, n) => {
  const r = n.cols, o = n.loading;
  return /* @__PURE__ */ S(it, { children: r.map((i, s) => {
    const a = `${s},${e}`, l = H_(t, i.id), c = i.Element;
    return /* @__PURE__ */ Eo(
      "td",
      {
        ...i.cellProps,
        "data-matrix": a,
        role: "cell",
        key: `accessor-${e}-${s}`,
        className: "px-2 h-14 border-none first:table-cell hidden md:table-cell"
      },
      o ? /* @__PURE__ */ S(
        "div",
        {
          className: "animate-pulse h-2 bg-table-border rounded",
          style: { width: `${zN(e)}%` }
        }
      ) : c ? /* @__PURE__ */ S(c, { row: t, matrix: a, col: i, rowIndex: e, value: l }) : /* @__PURE__ */ S(it, { children: Bn.nil(l) ? "" : l })
    );
  }) });
}, XN = () => /* @__PURE__ */ S(it, {}), eg = ({
  filters: e,
  pagination: t = null,
  onScrollEnd: n,
  useControl: r = !1,
  setCols: o,
  setFilters: i,
  sorters: s,
  cols: a,
  border: l = !1,
  setSorters: c,
  ...u
}) => {
  const d = ye(null), [f, h] = Me(!1), p = Jm(n), m = Jm(u.loadingMore), g = Ue(() => {
    if (u.loading) return KN;
    if (r) return u.rows;
    const v = new E0(u.rows);
    return e.length > 0 && e.forEach(
      (b) => b.value === "" || Number.isNaN(b.value) ? void 0 : v.Where(b.name, b.operation.symbol, b.value)
    ), s.length === 0 ? v.Select() : _N(v.Select(), s);
  }, [u.rows, e, s, u.loading]);
  return xe(() => {
    if (d.current === null)
      return () => {
      };
    const v = d.current, b = new IntersectionObserver((y) => {
      var T;
      return y[y.length - 1].isIntersecting && m.current ? ((T = p.current) == null || T.call(p), void h(!0)) : h(!1);
    });
    return b.observe(v), () => b.disconnect();
  }, []), /* @__PURE__ */ Z("div", { className: "min-w-full", children: [
    /* @__PURE__ */ Z("div", { className: `group rounded-lg px-1 ${l ? "border border-table-border" : ""}`, children: [
      /* @__PURE__ */ S(
        JM,
        {
          data: g,
          useWindowScroll: !0,
          components: qN,
          totalCount: g.length,
          itemContent: ZN,
          context: { loading: u.loading, loadingMore: u.loadingMore, cols: a },
          fixedFooterContent: f ? XN : null,
          fixedHeaderContent: () => /* @__PURE__ */ S(
            BN,
            {
              headers: a,
              sorters: s,
              filters: e,
              setCols: o,
              setSorters: c,
              setFilters: i,
              loading: !!u.loading
            }
          )
        }
      ),
      /* @__PURE__ */ S("div", { "aria-hidden": "true", ref: d, className: "h-0.5 w-full" })
    ] }),
    t !== null ? /* @__PURE__ */ S(FN, { ...t }) : null
  ] });
}, QN = (e, t) => typeof t == "function" ? t(e) : t, RL = (e) => {
  const t = e.operations ?? !0, n = Ue(() => C0(e.cols), [e.cols]), [r, o] = hd(
    {
      cols: e.cols,
      filters: e.filters ?? [],
      groups: e.groups ?? [],
      sorters: e.sorters ?? []
    },
    (i) => {
      const s = (a) => (l) => {
        const c = i.state();
        return { ...c, [a]: QN(c[a], l) };
      };
      return {
        cols: s("cols"),
        filters: s("filters"),
        groups: s("groups"),
        sorters: s("sorters")
      };
    },
    {
      postMiddleware: [
        (i) => {
          var s;
          return (s = e.set) == null || s.call(e, i), i;
        }
      ]
    }
  );
  return /* @__PURE__ */ Z("div", { className: "relative min-w-full", children: [
    t ? /* @__PURE__ */ S(
      MN,
      {
        setCols: o.cols,
        rows: e.rows,
        cols: r.cols,
        filters: r.filters,
        groups: r.groups,
        options: n,
        setFilters: o.filters,
        setGroups: o.groups,
        setSorters: o.sorters,
        sorters: r.sorters,
        pagination: e.pagination ?? null
      }
    ) : null,
    r.groups.length === 0 ? /* @__PURE__ */ S(
      eg,
      {
        ...e,
        onScrollEnd: e.onScrollEnd,
        cols: r.cols,
        filters: r.filters,
        groups: r.groups,
        index: 0,
        optionCols: n,
        options: n,
        setCols: o.cols,
        setFilters: o.filters,
        setGroups: o.groups,
        setSorters: o.sorters,
        sorters: r.sorters,
        pagination: e.pagination ?? null
      }
    ) : /* @__PURE__ */ S("div", { className: "flex flex-wrap gap-4", children: r.groups.map((i, s) => /* @__PURE__ */ S(Qt.div, { className: "min-w-full", children: /* @__PURE__ */ S(
      eg,
      {
        ...e,
        pagination: null,
        onScrollEnd: e.onScrollEnd,
        cols: r.cols,
        filters: r.filters,
        group: i,
        groups: r.groups,
        index: s,
        optionCols: n,
        options: n,
        rows: i.rows,
        setCols: o.cols,
        setFilters: o.filters,
        setGroups: o.groups,
        setSorters: o.sorters,
        sorters: r.sorters
      }
    ) }, `group-${i.groupId}`)) })
  ] });
}, R0 = (e = "") => bt(
  "w-full min-w-36 outline-none px-2 py-1 items-center flex justify-between text-left",
  "data-[active=true]:bg-primary data-[open]:bg-primary focus:bg-primary aria-expanded:opacity-80",
  "first-of-type:rounded-t-lg last-of-type:rounded-b-lg",
  "disabled:opacity-40 disabled:cursor-not-allowed",
  e
), yu = gn({
  isOpen: !1,
  activeIndex: null,
  getItemProps: () => ({}),
  setActiveIndex: () => {
  },
  setHasFocusInside: () => {
  }
}), tg = F.forwardRef(
  ({ children: e, isParent: t, label: n, ...r }, o) => {
    const i = Tr(), s = i !== null, [a, l] = Me(!1), [c, u] = Me(!1), [d, f] = Me(null), h = ye([]), p = ye([]), m = Qe(yu), g = Sr(), v = l_(), b = vb(), { floatingStyles: y, refs: x, context: w } = ss({
      nodeId: v,
      open: a,
      transform: !0,
      onOpenChange: l,
      whileElementsMounted: Za,
      placement: s ? "right-start" : "bottom-start",
      middleware: [Xa({ mainAxis: s ? 0 : 4, alignmentAxis: s ? -4 : 0 }), Pd(), Cd()]
    }), T = ls(w, { role: "menu", enabled: !0 }), P = is(w, { bubbles: !0 }), I = Sb(w, {
      enabled: !0,
      delay: { open: 100 },
      handleClose: M_({ blockPointerEvents: !0 })
    }), _ = Od(w, {
      event: "mousedown",
      toggle: !s,
      ignoreMouse: s,
      keyboardHandlers: !0
    }), R = Ib(w, {
      loop: !0,
      activeIndex: d,
      virtual: !0,
      nested: s,
      allowEscape: !0,
      listRef: h,
      scrollItemIntoView: !0,
      onNavigate: f
    }), L = A_(w, {
      activeIndex: d,
      listRef: p,
      onMatch: a ? f : void 0
    }), { getReferenceProps: M, getFloatingProps: V, getItemProps: E } = as([I, _, T, P, R, L]);
    xe(() => {
      if (!g) return;
      const A = () => l(!1), N = (H) => {
        H.nodeId !== v && H.parentId === i && l(!1);
      };
      return g.events.on("click", A), g.events.on("menuopen", N), () => {
        g.events.off("click", A), g.events.off("menuopen", N);
      };
    }, [g, v, i]), xe(() => {
      a && g && g.events.emit("menuopen", { parentId: i, nodeId: v });
    }, [g, a, v, i]);
    const k = t ? r.className : R0(r.className);
    return /* @__PURE__ */ Z(c_, { id: v, children: [
      /* @__PURE__ */ Z(
        "button",
        {
          ref: mb([x.setReference, b.ref, o]),
          tabIndex: s ? m.activeIndex === b.index ? 0 : -1 : void 0,
          "data-open": a ? "" : void 0,
          "data-nested": s ? "" : void 0,
          role: s ? "menuitem" : void 0,
          "data-focus-inside": c ? "" : void 0,
          className: k,
          ...M(
            m.getItemProps({
              ...r,
              onFocus(A) {
                var N;
                (N = r.onFocus) == null || N.call(r, A), u(!1), m.setHasFocusInside(!0);
              }
            })
          ),
          children: [
            n,
            s && /* @__PURE__ */ Z("span", { style: { marginLeft: 10, fontSize: 10 }, children: [
              /* @__PURE__ */ S("span", { className: "sr-only", children: "Next menu" }),
              /* @__PURE__ */ S(ad, { size: 14 })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ S(yu.Provider, { value: { activeIndex: d, setActiveIndex: f, getItemProps: E, setHasFocusInside: u, isOpen: a }, children: /* @__PURE__ */ S(r_, { elementsRef: h, labelsRef: p, children: a && /* @__PURE__ */ S(os, { preserveTabOrder: !0, children: /* @__PURE__ */ S(Qa, { context: w, modal: !1, initialFocus: s ? -1 : 0, returnFocus: !s, children: /* @__PURE__ */ S(
        "div",
        {
          ref: x.setFloating,
          style: y,
          className: "bg-floating-background z-tooltip isolate outline-none items-start border text-left shadow-xl border-floating-border flex flex-col rounded-lg",
          ...V(),
          children: e
        }
      ) }) }) }) })
    ] });
  }
), kL = F.forwardRef(
  ({ label: e, Right: t, disabled: n, ...r }, o) => {
    const i = Qe(yu), s = vb({ label: n ? null : e }), a = Sr(), l = s.index === i.activeIndex;
    return /* @__PURE__ */ Z(
      "button",
      {
        ...r,
        ref: mb([s.ref, o]),
        "data-active": l,
        type: "button",
        role: "menuitem",
        disabled: n,
        tabIndex: l ? 0 : -1,
        className: R0(r.className),
        ...i.getItemProps({
          onClick(c) {
            var u;
            (u = r.onClick) == null || u.call(r, c), a == null || a.events.emit("click");
          },
          onFocus(c) {
            var u;
            (u = r.onFocus) == null || u.call(r, c), i.setHasFocusInside(!0);
          }
        }),
        children: [
          e,
          t ? /* @__PURE__ */ S(t, { size: 16 }) : null
        ]
      }
    );
  }
), OL = F.forwardRef((e, t) => Tr() !== null ? /* @__PURE__ */ S(tg, { ...e, isParent: !1, ref: t }) : /* @__PURE__ */ S(u_, { children: /* @__PURE__ */ S(tg, { ...e, isParent: !0, ref: t }) }));
var JN = String.prototype.replace, eF = /%20/g, mc = {
  RFC1738: "RFC1738",
  RFC3986: "RFC3986"
}, ef = {
  default: mc.RFC3986,
  formatters: {
    RFC1738: function(e) {
      return JN.call(e, eF, "+");
    },
    RFC3986: function(e) {
      return String(e);
    }
  },
  RFC1738: mc.RFC1738,
  RFC3986: mc.RFC3986
}, tF = ef, gc = Object.prototype.hasOwnProperty, Lr = Array.isArray, wn = function() {
  for (var e = [], t = 0; t < 256; ++t)
    e.push("%" + ((t < 16 ? "0" : "") + t.toString(16)).toUpperCase());
  return e;
}(), nF = function(t) {
  for (; t.length > 1; ) {
    var n = t.pop(), r = n.obj[n.prop];
    if (Lr(r)) {
      for (var o = [], i = 0; i < r.length; ++i)
        typeof r[i] < "u" && o.push(r[i]);
      n.obj[n.prop] = o;
    }
  }
}, k0 = function(t, n) {
  for (var r = n && n.plainObjects ? /* @__PURE__ */ Object.create(null) : {}, o = 0; o < t.length; ++o)
    typeof t[o] < "u" && (r[o] = t[o]);
  return r;
}, rF = function e(t, n, r) {
  if (!n)
    return t;
  if (typeof n != "object") {
    if (Lr(t))
      t.push(n);
    else if (t && typeof t == "object")
      (r && (r.plainObjects || r.allowPrototypes) || !gc.call(Object.prototype, n)) && (t[n] = !0);
    else
      return [t, n];
    return t;
  }
  if (!t || typeof t != "object")
    return [t].concat(n);
  var o = t;
  return Lr(t) && !Lr(n) && (o = k0(t, r)), Lr(t) && Lr(n) ? (n.forEach(function(i, s) {
    if (gc.call(t, s)) {
      var a = t[s];
      a && typeof a == "object" && i && typeof i == "object" ? t[s] = e(a, i, r) : t.push(i);
    } else
      t[s] = i;
  }), t) : Object.keys(n).reduce(function(i, s) {
    var a = n[s];
    return gc.call(i, s) ? i[s] = e(i[s], a, r) : i[s] = a, i;
  }, o);
}, oF = function(t, n) {
  return Object.keys(n).reduce(function(r, o) {
    return r[o] = n[o], r;
  }, t);
}, iF = function(e, t, n) {
  var r = e.replace(/\+/g, " ");
  if (n === "iso-8859-1")
    return r.replace(/%[0-9a-f]{2}/gi, unescape);
  try {
    return decodeURIComponent(r);
  } catch {
    return r;
  }
}, yc = 1024, sF = function(t, n, r, o, i) {
  if (t.length === 0)
    return t;
  var s = t;
  if (typeof t == "symbol" ? s = Symbol.prototype.toString.call(t) : typeof t != "string" && (s = String(t)), r === "iso-8859-1")
    return escape(s).replace(/%u[0-9a-f]{4}/gi, function(h) {
      return "%26%23" + parseInt(h.slice(2), 16) + "%3B";
    });
  for (var a = "", l = 0; l < s.length; l += yc) {
    for (var c = s.length >= yc ? s.slice(l, l + yc) : s, u = [], d = 0; d < c.length; ++d) {
      var f = c.charCodeAt(d);
      if (f === 45 || f === 46 || f === 95 || f === 126 || f >= 48 && f <= 57 || f >= 65 && f <= 90 || f >= 97 && f <= 122 || i === tF.RFC1738 && (f === 40 || f === 41)) {
        u[u.length] = c.charAt(d);
        continue;
      }
      if (f < 128) {
        u[u.length] = wn[f];
        continue;
      }
      if (f < 2048) {
        u[u.length] = wn[192 | f >> 6] + wn[128 | f & 63];
        continue;
      }
      if (f < 55296 || f >= 57344) {
        u[u.length] = wn[224 | f >> 12] + wn[128 | f >> 6 & 63] + wn[128 | f & 63];
        continue;
      }
      d += 1, f = 65536 + ((f & 1023) << 10 | c.charCodeAt(d) & 1023), u[u.length] = wn[240 | f >> 18] + wn[128 | f >> 12 & 63] + wn[128 | f >> 6 & 63] + wn[128 | f & 63];
    }
    a += u.join("");
  }
  return a;
}, aF = function(t) {
  for (var n = [{ obj: { o: t }, prop: "o" }], r = [], o = 0; o < n.length; ++o)
    for (var i = n[o], s = i.obj[i.prop], a = Object.keys(s), l = 0; l < a.length; ++l) {
      var c = a[l], u = s[c];
      typeof u == "object" && u !== null && r.indexOf(u) === -1 && (n.push({ obj: s, prop: c }), r.push(u));
    }
  return nF(n), t;
}, lF = function(t) {
  return Object.prototype.toString.call(t) === "[object RegExp]";
}, cF = function(t) {
  return !t || typeof t != "object" ? !1 : !!(t.constructor && t.constructor.isBuffer && t.constructor.isBuffer(t));
}, uF = function(t, n) {
  return [].concat(t, n);
}, dF = function(t, n) {
  if (Lr(t)) {
    for (var r = [], o = 0; o < t.length; o += 1)
      r.push(n(t[o]));
    return r;
  }
  return n(t);
}, O0 = {
  arrayToObject: k0,
  assign: oF,
  combine: uF,
  compact: aF,
  decode: iF,
  encode: sF,
  isBuffer: cF,
  isRegExp: lF,
  maybeMap: dF,
  merge: rF
}, I0 = Nx, js = O0, ki = ef, fF = Object.prototype.hasOwnProperty, _0 = {
  brackets: function(t) {
    return t + "[]";
  },
  comma: "comma",
  indices: function(t, n) {
    return t + "[" + n + "]";
  },
  repeat: function(t) {
    return t;
  }
}, xn = Array.isArray, hF = Array.prototype.push, A0 = function(e, t) {
  hF.apply(e, xn(t) ? t : [t]);
}, pF = Date.prototype.toISOString, ng = ki.default, Tt = {
  addQueryPrefix: !1,
  allowDots: !1,
  allowEmptyArrays: !1,
  arrayFormat: "indices",
  charset: "utf-8",
  charsetSentinel: !1,
  delimiter: "&",
  encode: !0,
  encodeDotInKeys: !1,
  encoder: js.encode,
  encodeValuesOnly: !1,
  format: ng,
  formatter: ki.formatters[ng],
  // deprecated
  indices: !1,
  serializeDate: function(t) {
    return pF.call(t);
  },
  skipNulls: !1,
  strictNullHandling: !1
}, mF = function(t) {
  return typeof t == "string" || typeof t == "number" || typeof t == "boolean" || typeof t == "symbol" || typeof t == "bigint";
}, vc = {}, gF = function e(t, n, r, o, i, s, a, l, c, u, d, f, h, p, m, g, v, b) {
  for (var y = t, x = b, w = 0, T = !1; (x = x.get(vc)) !== void 0 && !T; ) {
    var P = x.get(t);
    if (w += 1, typeof P < "u") {
      if (P === w)
        throw new RangeError("Cyclic object value");
      T = !0;
    }
    typeof x.get(vc) > "u" && (w = 0);
  }
  if (typeof u == "function" ? y = u(n, y) : y instanceof Date ? y = h(y) : r === "comma" && xn(y) && (y = js.maybeMap(y, function(C) {
    return C instanceof Date ? h(C) : C;
  })), y === null) {
    if (s)
      return c && !g ? c(n, Tt.encoder, v, "key", p) : n;
    y = "";
  }
  if (mF(y) || js.isBuffer(y)) {
    if (c) {
      var I = g ? n : c(n, Tt.encoder, v, "key", p);
      return [m(I) + "=" + m(c(y, Tt.encoder, v, "value", p))];
    }
    return [m(n) + "=" + m(String(y))];
  }
  var _ = [];
  if (typeof y > "u")
    return _;
  var R;
  if (r === "comma" && xn(y))
    g && c && (y = js.maybeMap(y, c)), R = [{ value: y.length > 0 ? y.join(",") || null : void 0 }];
  else if (xn(u))
    R = u;
  else {
    var L = Object.keys(y);
    R = d ? L.sort(d) : L;
  }
  var M = l ? n.replace(/\./g, "%2E") : n, V = o && xn(y) && y.length === 1 ? M + "[]" : M;
  if (i && xn(y) && y.length === 0)
    return V + "[]";
  for (var E = 0; E < R.length; ++E) {
    var k = R[E], A = typeof k == "object" && typeof k.value < "u" ? k.value : y[k];
    if (!(a && A === null)) {
      var N = f && l ? k.replace(/\./g, "%2E") : k, H = xn(y) ? typeof r == "function" ? r(V, N) : V : V + (f ? "." + N : "[" + N + "]");
      b.set(t, w);
      var Y = I0();
      Y.set(vc, b), A0(_, e(
        A,
        H,
        r,
        o,
        i,
        s,
        a,
        l,
        r === "comma" && g && xn(y) ? null : c,
        u,
        d,
        f,
        h,
        p,
        m,
        g,
        v,
        Y
      ));
    }
  }
  return _;
}, yF = function(t) {
  if (!t)
    return Tt;
  if (typeof t.allowEmptyArrays < "u" && typeof t.allowEmptyArrays != "boolean")
    throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
  if (typeof t.encodeDotInKeys < "u" && typeof t.encodeDotInKeys != "boolean")
    throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
  if (t.encoder !== null && typeof t.encoder < "u" && typeof t.encoder != "function")
    throw new TypeError("Encoder has to be a function.");
  var n = t.charset || Tt.charset;
  if (typeof t.charset < "u" && t.charset !== "utf-8" && t.charset !== "iso-8859-1")
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  var r = ki.default;
  if (typeof t.format < "u") {
    if (!fF.call(ki.formatters, t.format))
      throw new TypeError("Unknown format option provided.");
    r = t.format;
  }
  var o = ki.formatters[r], i = Tt.filter;
  (typeof t.filter == "function" || xn(t.filter)) && (i = t.filter);
  var s;
  if (t.arrayFormat in _0 ? s = t.arrayFormat : "indices" in t ? s = t.indices ? "indices" : "repeat" : s = Tt.arrayFormat, "commaRoundTrip" in t && typeof t.commaRoundTrip != "boolean")
    throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
  var a = typeof t.allowDots > "u" ? t.encodeDotInKeys === !0 ? !0 : Tt.allowDots : !!t.allowDots;
  return {
    addQueryPrefix: typeof t.addQueryPrefix == "boolean" ? t.addQueryPrefix : Tt.addQueryPrefix,
    allowDots: a,
    allowEmptyArrays: typeof t.allowEmptyArrays == "boolean" ? !!t.allowEmptyArrays : Tt.allowEmptyArrays,
    arrayFormat: s,
    charset: n,
    charsetSentinel: typeof t.charsetSentinel == "boolean" ? t.charsetSentinel : Tt.charsetSentinel,
    commaRoundTrip: t.commaRoundTrip,
    delimiter: typeof t.delimiter > "u" ? Tt.delimiter : t.delimiter,
    encode: typeof t.encode == "boolean" ? t.encode : Tt.encode,
    encodeDotInKeys: typeof t.encodeDotInKeys == "boolean" ? t.encodeDotInKeys : Tt.encodeDotInKeys,
    encoder: typeof t.encoder == "function" ? t.encoder : Tt.encoder,
    encodeValuesOnly: typeof t.encodeValuesOnly == "boolean" ? t.encodeValuesOnly : Tt.encodeValuesOnly,
    filter: i,
    format: r,
    formatter: o,
    serializeDate: typeof t.serializeDate == "function" ? t.serializeDate : Tt.serializeDate,
    skipNulls: typeof t.skipNulls == "boolean" ? t.skipNulls : Tt.skipNulls,
    sort: typeof t.sort == "function" ? t.sort : null,
    strictNullHandling: typeof t.strictNullHandling == "boolean" ? t.strictNullHandling : Tt.strictNullHandling
  };
}, vF = function(e, t) {
  var n = e, r = yF(t), o, i;
  typeof r.filter == "function" ? (i = r.filter, n = i("", n)) : xn(r.filter) && (i = r.filter, o = i);
  var s = [];
  if (typeof n != "object" || n === null)
    return "";
  var a = _0[r.arrayFormat], l = a === "comma" && r.commaRoundTrip;
  o || (o = Object.keys(n)), r.sort && o.sort(r.sort);
  for (var c = I0(), u = 0; u < o.length; ++u) {
    var d = o[u];
    r.skipNulls && n[d] === null || A0(s, gF(
      n[d],
      d,
      a,
      l,
      r.allowEmptyArrays,
      r.strictNullHandling,
      r.skipNulls,
      r.encodeDotInKeys,
      r.encode ? r.encoder : null,
      r.filter,
      r.sort,
      r.allowDots,
      r.serializeDate,
      r.format,
      r.formatter,
      r.encodeValuesOnly,
      r.charset,
      c
    ));
  }
  var f = s.join(r.delimiter), h = r.addQueryPrefix === !0 ? "?" : "";
  return r.charsetSentinel && (r.charset === "iso-8859-1" ? h += "utf8=%26%2310003%3B&" : h += "utf8=%E2%9C%93&"), f.length > 0 ? h + f : "";
}, Bo = O0, vu = Object.prototype.hasOwnProperty, bF = Array.isArray, ht = {
  allowDots: !1,
  allowEmptyArrays: !1,
  allowPrototypes: !1,
  allowSparse: !1,
  arrayLimit: 20,
  charset: "utf-8",
  charsetSentinel: !1,
  comma: !1,
  decodeDotInKeys: !1,
  decoder: Bo.decode,
  delimiter: "&",
  depth: 5,
  duplicates: "combine",
  ignoreQueryPrefix: !1,
  interpretNumericEntities: !1,
  parameterLimit: 1e3,
  parseArrays: !0,
  plainObjects: !1,
  strictNullHandling: !1
}, wF = function(e) {
  return e.replace(/&#(\d+);/g, function(t, n) {
    return String.fromCharCode(parseInt(n, 10));
  });
}, D0 = function(e, t) {
  return e && typeof e == "string" && t.comma && e.indexOf(",") > -1 ? e.split(",") : e;
}, xF = "utf8=%26%2310003%3B", TF = "utf8=%E2%9C%93", SF = function(t, n) {
  var r = { __proto__: null }, o = n.ignoreQueryPrefix ? t.replace(/^\?/, "") : t;
  o = o.replace(/%5B/gi, "[").replace(/%5D/gi, "]");
  var i = n.parameterLimit === 1 / 0 ? void 0 : n.parameterLimit, s = o.split(n.delimiter, i), a = -1, l, c = n.charset;
  if (n.charsetSentinel)
    for (l = 0; l < s.length; ++l)
      s[l].indexOf("utf8=") === 0 && (s[l] === TF ? c = "utf-8" : s[l] === xF && (c = "iso-8859-1"), a = l, l = s.length);
  for (l = 0; l < s.length; ++l)
    if (l !== a) {
      var u = s[l], d = u.indexOf("]="), f = d === -1 ? u.indexOf("=") : d + 1, h, p;
      f === -1 ? (h = n.decoder(u, ht.decoder, c, "key"), p = n.strictNullHandling ? null : "") : (h = n.decoder(u.slice(0, f), ht.decoder, c, "key"), p = Bo.maybeMap(
        D0(u.slice(f + 1), n),
        function(g) {
          return n.decoder(g, ht.decoder, c, "value");
        }
      )), p && n.interpretNumericEntities && c === "iso-8859-1" && (p = wF(p)), u.indexOf("[]=") > -1 && (p = bF(p) ? [p] : p);
      var m = vu.call(r, h);
      m && n.duplicates === "combine" ? r[h] = Bo.combine(r[h], p) : (!m || n.duplicates === "last") && (r[h] = p);
    }
  return r;
}, EF = function(e, t, n, r) {
  for (var o = r ? t : D0(t, n), i = e.length - 1; i >= 0; --i) {
    var s, a = e[i];
    if (a === "[]" && n.parseArrays)
      s = n.allowEmptyArrays && (o === "" || n.strictNullHandling && o === null) ? [] : [].concat(o);
    else {
      s = n.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
      var l = a.charAt(0) === "[" && a.charAt(a.length - 1) === "]" ? a.slice(1, -1) : a, c = n.decodeDotInKeys ? l.replace(/%2E/g, ".") : l, u = parseInt(c, 10);
      !n.parseArrays && c === "" ? s = { 0: o } : !isNaN(u) && a !== c && String(u) === c && u >= 0 && n.parseArrays && u <= n.arrayLimit ? (s = [], s[u] = o) : c !== "__proto__" && (s[c] = o);
    }
    o = s;
  }
  return o;
}, CF = function(t, n, r, o) {
  if (t) {
    var i = r.allowDots ? t.replace(/\.([^.[]+)/g, "[$1]") : t, s = /(\[[^[\]]*])/, a = /(\[[^[\]]*])/g, l = r.depth > 0 && s.exec(i), c = l ? i.slice(0, l.index) : i, u = [];
    if (c) {
      if (!r.plainObjects && vu.call(Object.prototype, c) && !r.allowPrototypes)
        return;
      u.push(c);
    }
    for (var d = 0; r.depth > 0 && (l = a.exec(i)) !== null && d < r.depth; ) {
      if (d += 1, !r.plainObjects && vu.call(Object.prototype, l[1].slice(1, -1)) && !r.allowPrototypes)
        return;
      u.push(l[1]);
    }
    return l && u.push("[" + i.slice(l.index) + "]"), EF(u, n, r, o);
  }
}, PF = function(t) {
  if (!t)
    return ht;
  if (typeof t.allowEmptyArrays < "u" && typeof t.allowEmptyArrays != "boolean")
    throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
  if (typeof t.decodeDotInKeys < "u" && typeof t.decodeDotInKeys != "boolean")
    throw new TypeError("`decodeDotInKeys` option can only be `true` or `false`, when provided");
  if (t.decoder !== null && typeof t.decoder < "u" && typeof t.decoder != "function")
    throw new TypeError("Decoder has to be a function.");
  if (typeof t.charset < "u" && t.charset !== "utf-8" && t.charset !== "iso-8859-1")
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  var n = typeof t.charset > "u" ? ht.charset : t.charset, r = typeof t.duplicates > "u" ? ht.duplicates : t.duplicates;
  if (r !== "combine" && r !== "first" && r !== "last")
    throw new TypeError("The duplicates option must be either combine, first, or last");
  var o = typeof t.allowDots > "u" ? t.decodeDotInKeys === !0 ? !0 : ht.allowDots : !!t.allowDots;
  return {
    allowDots: o,
    allowEmptyArrays: typeof t.allowEmptyArrays == "boolean" ? !!t.allowEmptyArrays : ht.allowEmptyArrays,
    allowPrototypes: typeof t.allowPrototypes == "boolean" ? t.allowPrototypes : ht.allowPrototypes,
    allowSparse: typeof t.allowSparse == "boolean" ? t.allowSparse : ht.allowSparse,
    arrayLimit: typeof t.arrayLimit == "number" ? t.arrayLimit : ht.arrayLimit,
    charset: n,
    charsetSentinel: typeof t.charsetSentinel == "boolean" ? t.charsetSentinel : ht.charsetSentinel,
    comma: typeof t.comma == "boolean" ? t.comma : ht.comma,
    decodeDotInKeys: typeof t.decodeDotInKeys == "boolean" ? t.decodeDotInKeys : ht.decodeDotInKeys,
    decoder: typeof t.decoder == "function" ? t.decoder : ht.decoder,
    delimiter: typeof t.delimiter == "string" || Bo.isRegExp(t.delimiter) ? t.delimiter : ht.delimiter,
    // eslint-disable-next-line no-implicit-coercion, no-extra-parens
    depth: typeof t.depth == "number" || t.depth === !1 ? +t.depth : ht.depth,
    duplicates: r,
    ignoreQueryPrefix: t.ignoreQueryPrefix === !0,
    interpretNumericEntities: typeof t.interpretNumericEntities == "boolean" ? t.interpretNumericEntities : ht.interpretNumericEntities,
    parameterLimit: typeof t.parameterLimit == "number" ? t.parameterLimit : ht.parameterLimit,
    parseArrays: t.parseArrays !== !1,
    plainObjects: typeof t.plainObjects == "boolean" ? t.plainObjects : ht.plainObjects,
    strictNullHandling: typeof t.strictNullHandling == "boolean" ? t.strictNullHandling : ht.strictNullHandling
  };
}, RF = function(e, t) {
  var n = PF(t);
  if (e === "" || e === null || typeof e > "u")
    return n.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  for (var r = typeof e == "string" ? SF(e, n) : e, o = n.plainObjects ? /* @__PURE__ */ Object.create(null) : {}, i = Object.keys(r), s = 0; s < i.length; ++s) {
    var a = i[s], l = CF(a, r[a], n, typeof e == "string");
    o = Bo.merge(o, l, n);
  }
  return n.allowSparse === !0 ? o : Bo.compact(o);
}, kF = vF, OF = RF, IF = ef, _F = {
  formats: IF,
  parse: OF,
  stringify: kF
}, Ie;
(function(e) {
  e.assertEqual = (o) => o;
  function t(o) {
  }
  e.assertIs = t;
  function n(o) {
    throw new Error();
  }
  e.assertNever = n, e.arrayToEnum = (o) => {
    const i = {};
    for (const s of o)
      i[s] = s;
    return i;
  }, e.getValidEnumValues = (o) => {
    const i = e.objectKeys(o).filter((a) => typeof o[o[a]] != "number"), s = {};
    for (const a of i)
      s[a] = o[a];
    return e.objectValues(s);
  }, e.objectValues = (o) => e.objectKeys(o).map(function(i) {
    return o[i];
  }), e.objectKeys = typeof Object.keys == "function" ? (o) => Object.keys(o) : (o) => {
    const i = [];
    for (const s in o)
      Object.prototype.hasOwnProperty.call(o, s) && i.push(s);
    return i;
  }, e.find = (o, i) => {
    for (const s of o)
      if (i(s))
        return s;
  }, e.isInteger = typeof Number.isInteger == "function" ? (o) => Number.isInteger(o) : (o) => typeof o == "number" && isFinite(o) && Math.floor(o) === o;
  function r(o, i = " | ") {
    return o.map((s) => typeof s == "string" ? `'${s}'` : s).join(i);
  }
  e.joinValues = r, e.jsonStringifyReplacer = (o, i) => typeof i == "bigint" ? i.toString() : i;
})(Ie || (Ie = {}));
var rg;
(function(e) {
  e.mergeShapes = (t, n) => ({
    ...t,
    ...n
    // second overwrites first
  });
})(rg || (rg = {}));
const ie = Ie.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]), Vr = (e) => {
  switch (typeof e) {
    case "undefined":
      return ie.undefined;
    case "string":
      return ie.string;
    case "number":
      return isNaN(e) ? ie.nan : ie.number;
    case "boolean":
      return ie.boolean;
    case "function":
      return ie.function;
    case "bigint":
      return ie.bigint;
    case "symbol":
      return ie.symbol;
    case "object":
      return Array.isArray(e) ? ie.array : e === null ? ie.null : e.then && typeof e.then == "function" && e.catch && typeof e.catch == "function" ? ie.promise : typeof Map < "u" && e instanceof Map ? ie.map : typeof Set < "u" && e instanceof Set ? ie.set : typeof Date < "u" && e instanceof Date ? ie.date : ie.object;
    default:
      return ie.unknown;
  }
}, K = Ie.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
class ln extends Error {
  constructor(t) {
    super(), this.issues = [], this.addIssue = (r) => {
      this.issues = [...this.issues, r];
    }, this.addIssues = (r = []) => {
      this.issues = [...this.issues, ...r];
    };
    const n = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, n) : this.__proto__ = n, this.name = "ZodError", this.issues = t;
  }
  get errors() {
    return this.issues;
  }
  format(t) {
    const n = t || function(i) {
      return i.message;
    }, r = { _errors: [] }, o = (i) => {
      for (const s of i.issues)
        if (s.code === "invalid_union")
          s.unionErrors.map(o);
        else if (s.code === "invalid_return_type")
          o(s.returnTypeError);
        else if (s.code === "invalid_arguments")
          o(s.argumentsError);
        else if (s.path.length === 0)
          r._errors.push(n(s));
        else {
          let a = r, l = 0;
          for (; l < s.path.length; ) {
            const c = s.path[l];
            l === s.path.length - 1 ? (a[c] = a[c] || { _errors: [] }, a[c]._errors.push(n(s))) : a[c] = a[c] || { _errors: [] }, a = a[c], l++;
          }
        }
    };
    return o(this), r;
  }
  static assert(t) {
    if (!(t instanceof ln))
      throw new Error(`Not a ZodError: ${t}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, Ie.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(t = (n) => n.message) {
    const n = {}, r = [];
    for (const o of this.issues)
      o.path.length > 0 ? (n[o.path[0]] = n[o.path[0]] || [], n[o.path[0]].push(t(o))) : r.push(t(o));
    return { formErrors: r, fieldErrors: n };
  }
  get formErrors() {
    return this.flatten();
  }
}
ln.create = (e) => new ln(e);
const Gi = (e, t) => {
  let n;
  switch (e.code) {
    case K.invalid_type:
      e.received === ie.undefined ? n = "Required" : n = `Expected ${e.expected}, received ${e.received}`;
      break;
    case K.invalid_literal:
      n = `Invalid literal value, expected ${JSON.stringify(e.expected, Ie.jsonStringifyReplacer)}`;
      break;
    case K.unrecognized_keys:
      n = `Unrecognized key(s) in object: ${Ie.joinValues(e.keys, ", ")}`;
      break;
    case K.invalid_union:
      n = "Invalid input";
      break;
    case K.invalid_union_discriminator:
      n = `Invalid discriminator value. Expected ${Ie.joinValues(e.options)}`;
      break;
    case K.invalid_enum_value:
      n = `Invalid enum value. Expected ${Ie.joinValues(e.options)}, received '${e.received}'`;
      break;
    case K.invalid_arguments:
      n = "Invalid function arguments";
      break;
    case K.invalid_return_type:
      n = "Invalid function return type";
      break;
    case K.invalid_date:
      n = "Invalid date";
      break;
    case K.invalid_string:
      typeof e.validation == "object" ? "includes" in e.validation ? (n = `Invalid input: must include "${e.validation.includes}"`, typeof e.validation.position == "number" && (n = `${n} at one or more positions greater than or equal to ${e.validation.position}`)) : "startsWith" in e.validation ? n = `Invalid input: must start with "${e.validation.startsWith}"` : "endsWith" in e.validation ? n = `Invalid input: must end with "${e.validation.endsWith}"` : Ie.assertNever(e.validation) : e.validation !== "regex" ? n = `Invalid ${e.validation}` : n = "Invalid";
      break;
    case K.too_small:
      e.type === "array" ? n = `Array must contain ${e.exact ? "exactly" : e.inclusive ? "at least" : "more than"} ${e.minimum} element(s)` : e.type === "string" ? n = `String must contain ${e.exact ? "exactly" : e.inclusive ? "at least" : "over"} ${e.minimum} character(s)` : e.type === "number" ? n = `Number must be ${e.exact ? "exactly equal to " : e.inclusive ? "greater than or equal to " : "greater than "}${e.minimum}` : e.type === "date" ? n = `Date must be ${e.exact ? "exactly equal to " : e.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(e.minimum))}` : n = "Invalid input";
      break;
    case K.too_big:
      e.type === "array" ? n = `Array must contain ${e.exact ? "exactly" : e.inclusive ? "at most" : "less than"} ${e.maximum} element(s)` : e.type === "string" ? n = `String must contain ${e.exact ? "exactly" : e.inclusive ? "at most" : "under"} ${e.maximum} character(s)` : e.type === "number" ? n = `Number must be ${e.exact ? "exactly" : e.inclusive ? "less than or equal to" : "less than"} ${e.maximum}` : e.type === "bigint" ? n = `BigInt must be ${e.exact ? "exactly" : e.inclusive ? "less than or equal to" : "less than"} ${e.maximum}` : e.type === "date" ? n = `Date must be ${e.exact ? "exactly" : e.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(e.maximum))}` : n = "Invalid input";
      break;
    case K.custom:
      n = "Invalid input";
      break;
    case K.invalid_intersection_types:
      n = "Intersection results could not be merged";
      break;
    case K.not_multiple_of:
      n = `Number must be a multiple of ${e.multipleOf}`;
      break;
    case K.not_finite:
      n = "Number must be finite";
      break;
    default:
      n = t.defaultError, Ie.assertNever(e);
  }
  return { message: n };
};
let AF = Gi;
function bu() {
  return AF;
}
const wu = (e) => {
  const { data: t, path: n, errorMaps: r, issueData: o } = e, i = [...n, ...o.path || []], s = {
    ...o,
    path: i
  };
  if (o.message !== void 0)
    return {
      ...o,
      path: i,
      message: o.message
    };
  let a = "";
  const l = r.filter((c) => !!c).slice().reverse();
  for (const c of l)
    a = c(s, { data: t, defaultError: a }).message;
  return {
    ...o,
    path: i,
    message: a
  };
};
function ne(e, t) {
  const n = bu(), r = wu({
    issueData: t,
    data: e.data,
    path: e.path,
    errorMaps: [
      e.common.contextualErrorMap,
      e.schemaErrorMap,
      n,
      n === Gi ? void 0 : Gi
      // then global default map
    ].filter((o) => !!o)
  });
  e.common.issues.push(r);
}
class Ht {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    this.value === "valid" && (this.value = "dirty");
  }
  abort() {
    this.value !== "aborted" && (this.value = "aborted");
  }
  static mergeArray(t, n) {
    const r = [];
    for (const o of n) {
      if (o.status === "aborted")
        return me;
      o.status === "dirty" && t.dirty(), r.push(o.value);
    }
    return { status: t.value, value: r };
  }
  static async mergeObjectAsync(t, n) {
    const r = [];
    for (const o of n) {
      const i = await o.key, s = await o.value;
      r.push({
        key: i,
        value: s
      });
    }
    return Ht.mergeObjectSync(t, r);
  }
  static mergeObjectSync(t, n) {
    const r = {};
    for (const o of n) {
      const { key: i, value: s } = o;
      if (i.status === "aborted" || s.status === "aborted")
        return me;
      i.status === "dirty" && t.dirty(), s.status === "dirty" && t.dirty(), i.value !== "__proto__" && (typeof s.value < "u" || o.alwaysSet) && (r[i.value] = s.value);
    }
    return { status: t.value, value: r };
  }
}
const me = Object.freeze({
  status: "aborted"
}), fi = (e) => ({ status: "dirty", value: e }), Kt = (e) => ({ status: "valid", value: e }), og = (e) => e.status === "aborted", ig = (e) => e.status === "dirty", ba = (e) => e.status === "valid", wa = (e) => typeof Promise < "u" && e instanceof Promise;
function xa(e, t, n, r) {
  if (typeof t == "function" ? e !== t || !r : !t.has(e)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t.get(e);
}
function M0(e, t, n, r, o) {
  if (typeof t == "function" ? e !== t || !o : !t.has(e)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return t.set(e, n), n;
}
var le;
(function(e) {
  e.errToObj = (t) => typeof t == "string" ? { message: t } : t || {}, e.toString = (t) => typeof t == "string" ? t : t == null ? void 0 : t.message;
})(le || (le = {}));
var hi, pi;
class Dn {
  constructor(t, n, r, o) {
    this._cachedPath = [], this.parent = t, this.data = n, this._path = r, this._key = o;
  }
  get path() {
    return this._cachedPath.length || (this._key instanceof Array ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const sg = (e, t) => {
  if (ba(t))
    return { success: !0, data: t.value };
  if (!e.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const n = new ln(e.common.issues);
      return this._error = n, this._error;
    }
  };
};
function ve(e) {
  if (!e)
    return {};
  const { errorMap: t, invalid_type_error: n, required_error: r, description: o } = e;
  if (t && (n || r))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return t ? { errorMap: t, description: o } : { errorMap: (s, a) => {
    var l, c;
    const { message: u } = e;
    return s.code === "invalid_enum_value" ? { message: u ?? a.defaultError } : typeof a.data > "u" ? { message: (l = u ?? r) !== null && l !== void 0 ? l : a.defaultError } : s.code !== "invalid_type" ? { message: a.defaultError } : { message: (c = u ?? n) !== null && c !== void 0 ? c : a.defaultError };
  }, description: o };
}
class Se {
  constructor(t) {
    this.spa = this.safeParseAsync, this._def = t, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this);
  }
  get description() {
    return this._def.description;
  }
  _getType(t) {
    return Vr(t.data);
  }
  _getOrReturnCtx(t, n) {
    return n || {
      common: t.parent.common,
      data: t.data,
      parsedType: Vr(t.data),
      schemaErrorMap: this._def.errorMap,
      path: t.path,
      parent: t.parent
    };
  }
  _processInputParams(t) {
    return {
      status: new Ht(),
      ctx: {
        common: t.parent.common,
        data: t.data,
        parsedType: Vr(t.data),
        schemaErrorMap: this._def.errorMap,
        path: t.path,
        parent: t.parent
      }
    };
  }
  _parseSync(t) {
    const n = this._parse(t);
    if (wa(n))
      throw new Error("Synchronous parse encountered promise.");
    return n;
  }
  _parseAsync(t) {
    const n = this._parse(t);
    return Promise.resolve(n);
  }
  parse(t, n) {
    const r = this.safeParse(t, n);
    if (r.success)
      return r.data;
    throw r.error;
  }
  safeParse(t, n) {
    var r;
    const o = {
      common: {
        issues: [],
        async: (r = n == null ? void 0 : n.async) !== null && r !== void 0 ? r : !1,
        contextualErrorMap: n == null ? void 0 : n.errorMap
      },
      path: (n == null ? void 0 : n.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: t,
      parsedType: Vr(t)
    }, i = this._parseSync({ data: t, path: o.path, parent: o });
    return sg(o, i);
  }
  async parseAsync(t, n) {
    const r = await this.safeParseAsync(t, n);
    if (r.success)
      return r.data;
    throw r.error;
  }
  async safeParseAsync(t, n) {
    const r = {
      common: {
        issues: [],
        contextualErrorMap: n == null ? void 0 : n.errorMap,
        async: !0
      },
      path: (n == null ? void 0 : n.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: t,
      parsedType: Vr(t)
    }, o = this._parse({ data: t, path: r.path, parent: r }), i = await (wa(o) ? o : Promise.resolve(o));
    return sg(r, i);
  }
  refine(t, n) {
    const r = (o) => typeof n == "string" || typeof n > "u" ? { message: n } : typeof n == "function" ? n(o) : n;
    return this._refinement((o, i) => {
      const s = t(o), a = () => i.addIssue({
        code: K.custom,
        ...r(o)
      });
      return typeof Promise < "u" && s instanceof Promise ? s.then((l) => l ? !0 : (a(), !1)) : s ? !0 : (a(), !1);
    });
  }
  refinement(t, n) {
    return this._refinement((r, o) => t(r) ? !0 : (o.addIssue(typeof n == "function" ? n(r, o) : n), !1));
  }
  _refinement(t) {
    return new Zn({
      schema: this,
      typeName: he.ZodEffects,
      effect: { type: "refinement", refinement: t }
    });
  }
  superRefine(t) {
    return this._refinement(t);
  }
  optional() {
    return Gn.create(this, this._def);
  }
  nullable() {
    return Qr.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return fn.create(this, this._def);
  }
  promise() {
    return qi.create(this, this._def);
  }
  or(t) {
    return Ea.create([this, t], this._def);
  }
  and(t) {
    return Ca.create(this, t, this._def);
  }
  transform(t) {
    return new Zn({
      ...ve(this._def),
      schema: this,
      typeName: he.ZodEffects,
      effect: { type: "transform", transform: t }
    });
  }
  default(t) {
    const n = typeof t == "function" ? t : () => t;
    return new Ia({
      ...ve(this._def),
      innerType: this,
      defaultValue: n,
      typeName: he.ZodDefault
    });
  }
  brand() {
    return new V0({
      typeName: he.ZodBranded,
      type: this,
      ...ve(this._def)
    });
  }
  catch(t) {
    const n = typeof t == "function" ? t : () => t;
    return new _a({
      ...ve(this._def),
      innerType: this,
      catchValue: n,
      typeName: he.ZodCatch
    });
  }
  describe(t) {
    const n = this.constructor;
    return new n({
      ...this._def,
      description: t
    });
  }
  pipe(t) {
    return al.create(this, t);
  }
  readonly() {
    return Aa.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const DF = /^c[^\s-]{8,}$/i, MF = /^[0-9a-z]+$/, NF = /^[0-9A-HJKMNP-TV-Z]{26}$/, FF = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, LF = /^[a-z0-9_-]{21}$/i, VF = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, $F = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, jF = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let bc;
const BF = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, zF = /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/, WF = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, N0 = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", HF = new RegExp(`^${N0}$`);
function F0(e) {
  let t = "([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d";
  return e.precision ? t = `${t}\\.\\d{${e.precision}}` : e.precision == null && (t = `${t}(\\.\\d+)?`), t;
}
function UF(e) {
  return new RegExp(`^${F0(e)}$`);
}
function GF(e) {
  let t = `${N0}T${F0(e)}`;
  const n = [];
  return n.push(e.local ? "Z?" : "Z"), e.offset && n.push("([+-]\\d{2}:?\\d{2})"), t = `${t}(${n.join("|")})`, new RegExp(`^${t}$`);
}
function YF(e, t) {
  return !!((t === "v4" || !t) && BF.test(e) || (t === "v6" || !t) && zF.test(e));
}
class jn extends Se {
  _parse(t) {
    if (this._def.coerce && (t.data = String(t.data)), this._getType(t) !== ie.string) {
      const i = this._getOrReturnCtx(t);
      return ne(i, {
        code: K.invalid_type,
        expected: ie.string,
        received: i.parsedType
      }), me;
    }
    const r = new Ht();
    let o;
    for (const i of this._def.checks)
      if (i.kind === "min")
        t.data.length < i.value && (o = this._getOrReturnCtx(t, o), ne(o, {
          code: K.too_small,
          minimum: i.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: i.message
        }), r.dirty());
      else if (i.kind === "max")
        t.data.length > i.value && (o = this._getOrReturnCtx(t, o), ne(o, {
          code: K.too_big,
          maximum: i.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: i.message
        }), r.dirty());
      else if (i.kind === "length") {
        const s = t.data.length > i.value, a = t.data.length < i.value;
        (s || a) && (o = this._getOrReturnCtx(t, o), s ? ne(o, {
          code: K.too_big,
          maximum: i.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: i.message
        }) : a && ne(o, {
          code: K.too_small,
          minimum: i.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: i.message
        }), r.dirty());
      } else if (i.kind === "email")
        $F.test(t.data) || (o = this._getOrReturnCtx(t, o), ne(o, {
          validation: "email",
          code: K.invalid_string,
          message: i.message
        }), r.dirty());
      else if (i.kind === "emoji")
        bc || (bc = new RegExp(jF, "u")), bc.test(t.data) || (o = this._getOrReturnCtx(t, o), ne(o, {
          validation: "emoji",
          code: K.invalid_string,
          message: i.message
        }), r.dirty());
      else if (i.kind === "uuid")
        FF.test(t.data) || (o = this._getOrReturnCtx(t, o), ne(o, {
          validation: "uuid",
          code: K.invalid_string,
          message: i.message
        }), r.dirty());
      else if (i.kind === "nanoid")
        LF.test(t.data) || (o = this._getOrReturnCtx(t, o), ne(o, {
          validation: "nanoid",
          code: K.invalid_string,
          message: i.message
        }), r.dirty());
      else if (i.kind === "cuid")
        DF.test(t.data) || (o = this._getOrReturnCtx(t, o), ne(o, {
          validation: "cuid",
          code: K.invalid_string,
          message: i.message
        }), r.dirty());
      else if (i.kind === "cuid2")
        MF.test(t.data) || (o = this._getOrReturnCtx(t, o), ne(o, {
          validation: "cuid2",
          code: K.invalid_string,
          message: i.message
        }), r.dirty());
      else if (i.kind === "ulid")
        NF.test(t.data) || (o = this._getOrReturnCtx(t, o), ne(o, {
          validation: "ulid",
          code: K.invalid_string,
          message: i.message
        }), r.dirty());
      else if (i.kind === "url")
        try {
          new URL(t.data);
        } catch {
          o = this._getOrReturnCtx(t, o), ne(o, {
            validation: "url",
            code: K.invalid_string,
            message: i.message
          }), r.dirty();
        }
      else i.kind === "regex" ? (i.regex.lastIndex = 0, i.regex.test(t.data) || (o = this._getOrReturnCtx(t, o), ne(o, {
        validation: "regex",
        code: K.invalid_string,
        message: i.message
      }), r.dirty())) : i.kind === "trim" ? t.data = t.data.trim() : i.kind === "includes" ? t.data.includes(i.value, i.position) || (o = this._getOrReturnCtx(t, o), ne(o, {
        code: K.invalid_string,
        validation: { includes: i.value, position: i.position },
        message: i.message
      }), r.dirty()) : i.kind === "toLowerCase" ? t.data = t.data.toLowerCase() : i.kind === "toUpperCase" ? t.data = t.data.toUpperCase() : i.kind === "startsWith" ? t.data.startsWith(i.value) || (o = this._getOrReturnCtx(t, o), ne(o, {
        code: K.invalid_string,
        validation: { startsWith: i.value },
        message: i.message
      }), r.dirty()) : i.kind === "endsWith" ? t.data.endsWith(i.value) || (o = this._getOrReturnCtx(t, o), ne(o, {
        code: K.invalid_string,
        validation: { endsWith: i.value },
        message: i.message
      }), r.dirty()) : i.kind === "datetime" ? GF(i).test(t.data) || (o = this._getOrReturnCtx(t, o), ne(o, {
        code: K.invalid_string,
        validation: "datetime",
        message: i.message
      }), r.dirty()) : i.kind === "date" ? HF.test(t.data) || (o = this._getOrReturnCtx(t, o), ne(o, {
        code: K.invalid_string,
        validation: "date",
        message: i.message
      }), r.dirty()) : i.kind === "time" ? UF(i).test(t.data) || (o = this._getOrReturnCtx(t, o), ne(o, {
        code: K.invalid_string,
        validation: "time",
        message: i.message
      }), r.dirty()) : i.kind === "duration" ? VF.test(t.data) || (o = this._getOrReturnCtx(t, o), ne(o, {
        validation: "duration",
        code: K.invalid_string,
        message: i.message
      }), r.dirty()) : i.kind === "ip" ? YF(t.data, i.version) || (o = this._getOrReturnCtx(t, o), ne(o, {
        validation: "ip",
        code: K.invalid_string,
        message: i.message
      }), r.dirty()) : i.kind === "base64" ? WF.test(t.data) || (o = this._getOrReturnCtx(t, o), ne(o, {
        validation: "base64",
        code: K.invalid_string,
        message: i.message
      }), r.dirty()) : Ie.assertNever(i);
    return { status: r.value, value: t.data };
  }
  _regex(t, n, r) {
    return this.refinement((o) => t.test(o), {
      validation: n,
      code: K.invalid_string,
      ...le.errToObj(r)
    });
  }
  _addCheck(t) {
    return new jn({
      ...this._def,
      checks: [...this._def.checks, t]
    });
  }
  email(t) {
    return this._addCheck({ kind: "email", ...le.errToObj(t) });
  }
  url(t) {
    return this._addCheck({ kind: "url", ...le.errToObj(t) });
  }
  emoji(t) {
    return this._addCheck({ kind: "emoji", ...le.errToObj(t) });
  }
  uuid(t) {
    return this._addCheck({ kind: "uuid", ...le.errToObj(t) });
  }
  nanoid(t) {
    return this._addCheck({ kind: "nanoid", ...le.errToObj(t) });
  }
  cuid(t) {
    return this._addCheck({ kind: "cuid", ...le.errToObj(t) });
  }
  cuid2(t) {
    return this._addCheck({ kind: "cuid2", ...le.errToObj(t) });
  }
  ulid(t) {
    return this._addCheck({ kind: "ulid", ...le.errToObj(t) });
  }
  base64(t) {
    return this._addCheck({ kind: "base64", ...le.errToObj(t) });
  }
  ip(t) {
    return this._addCheck({ kind: "ip", ...le.errToObj(t) });
  }
  datetime(t) {
    var n, r;
    return typeof t == "string" ? this._addCheck({
      kind: "datetime",
      precision: null,
      offset: !1,
      local: !1,
      message: t
    }) : this._addCheck({
      kind: "datetime",
      precision: typeof (t == null ? void 0 : t.precision) > "u" ? null : t == null ? void 0 : t.precision,
      offset: (n = t == null ? void 0 : t.offset) !== null && n !== void 0 ? n : !1,
      local: (r = t == null ? void 0 : t.local) !== null && r !== void 0 ? r : !1,
      ...le.errToObj(t == null ? void 0 : t.message)
    });
  }
  date(t) {
    return this._addCheck({ kind: "date", message: t });
  }
  time(t) {
    return typeof t == "string" ? this._addCheck({
      kind: "time",
      precision: null,
      message: t
    }) : this._addCheck({
      kind: "time",
      precision: typeof (t == null ? void 0 : t.precision) > "u" ? null : t == null ? void 0 : t.precision,
      ...le.errToObj(t == null ? void 0 : t.message)
    });
  }
  duration(t) {
    return this._addCheck({ kind: "duration", ...le.errToObj(t) });
  }
  regex(t, n) {
    return this._addCheck({
      kind: "regex",
      regex: t,
      ...le.errToObj(n)
    });
  }
  includes(t, n) {
    return this._addCheck({
      kind: "includes",
      value: t,
      position: n == null ? void 0 : n.position,
      ...le.errToObj(n == null ? void 0 : n.message)
    });
  }
  startsWith(t, n) {
    return this._addCheck({
      kind: "startsWith",
      value: t,
      ...le.errToObj(n)
    });
  }
  endsWith(t, n) {
    return this._addCheck({
      kind: "endsWith",
      value: t,
      ...le.errToObj(n)
    });
  }
  min(t, n) {
    return this._addCheck({
      kind: "min",
      value: t,
      ...le.errToObj(n)
    });
  }
  max(t, n) {
    return this._addCheck({
      kind: "max",
      value: t,
      ...le.errToObj(n)
    });
  }
  length(t, n) {
    return this._addCheck({
      kind: "length",
      value: t,
      ...le.errToObj(n)
    });
  }
  /**
   * @deprecated Use z.string().min(1) instead.
   * @see {@link ZodString.min}
   */
  nonempty(t) {
    return this.min(1, le.errToObj(t));
  }
  trim() {
    return new jn({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new jn({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new jn({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((t) => t.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((t) => t.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((t) => t.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((t) => t.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((t) => t.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((t) => t.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((t) => t.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((t) => t.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((t) => t.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((t) => t.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((t) => t.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((t) => t.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((t) => t.kind === "ip");
  }
  get isBase64() {
    return !!this._def.checks.find((t) => t.kind === "base64");
  }
  get minLength() {
    let t = null;
    for (const n of this._def.checks)
      n.kind === "min" && (t === null || n.value > t) && (t = n.value);
    return t;
  }
  get maxLength() {
    let t = null;
    for (const n of this._def.checks)
      n.kind === "max" && (t === null || n.value < t) && (t = n.value);
    return t;
  }
}
jn.create = (e) => {
  var t;
  return new jn({
    checks: [],
    typeName: he.ZodString,
    coerce: (t = e == null ? void 0 : e.coerce) !== null && t !== void 0 ? t : !1,
    ...ve(e)
  });
};
function qF(e, t) {
  const n = (e.toString().split(".")[1] || "").length, r = (t.toString().split(".")[1] || "").length, o = n > r ? n : r, i = parseInt(e.toFixed(o).replace(".", "")), s = parseInt(t.toFixed(o).replace(".", ""));
  return i % s / Math.pow(10, o);
}
class Zr extends Se {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(t) {
    if (this._def.coerce && (t.data = Number(t.data)), this._getType(t) !== ie.number) {
      const i = this._getOrReturnCtx(t);
      return ne(i, {
        code: K.invalid_type,
        expected: ie.number,
        received: i.parsedType
      }), me;
    }
    let r;
    const o = new Ht();
    for (const i of this._def.checks)
      i.kind === "int" ? Ie.isInteger(t.data) || (r = this._getOrReturnCtx(t, r), ne(r, {
        code: K.invalid_type,
        expected: "integer",
        received: "float",
        message: i.message
      }), o.dirty()) : i.kind === "min" ? (i.inclusive ? t.data < i.value : t.data <= i.value) && (r = this._getOrReturnCtx(t, r), ne(r, {
        code: K.too_small,
        minimum: i.value,
        type: "number",
        inclusive: i.inclusive,
        exact: !1,
        message: i.message
      }), o.dirty()) : i.kind === "max" ? (i.inclusive ? t.data > i.value : t.data >= i.value) && (r = this._getOrReturnCtx(t, r), ne(r, {
        code: K.too_big,
        maximum: i.value,
        type: "number",
        inclusive: i.inclusive,
        exact: !1,
        message: i.message
      }), o.dirty()) : i.kind === "multipleOf" ? qF(t.data, i.value) !== 0 && (r = this._getOrReturnCtx(t, r), ne(r, {
        code: K.not_multiple_of,
        multipleOf: i.value,
        message: i.message
      }), o.dirty()) : i.kind === "finite" ? Number.isFinite(t.data) || (r = this._getOrReturnCtx(t, r), ne(r, {
        code: K.not_finite,
        message: i.message
      }), o.dirty()) : Ie.assertNever(i);
    return { status: o.value, value: t.data };
  }
  gte(t, n) {
    return this.setLimit("min", t, !0, le.toString(n));
  }
  gt(t, n) {
    return this.setLimit("min", t, !1, le.toString(n));
  }
  lte(t, n) {
    return this.setLimit("max", t, !0, le.toString(n));
  }
  lt(t, n) {
    return this.setLimit("max", t, !1, le.toString(n));
  }
  setLimit(t, n, r, o) {
    return new Zr({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: t,
          value: n,
          inclusive: r,
          message: le.toString(o)
        }
      ]
    });
  }
  _addCheck(t) {
    return new Zr({
      ...this._def,
      checks: [...this._def.checks, t]
    });
  }
  int(t) {
    return this._addCheck({
      kind: "int",
      message: le.toString(t)
    });
  }
  positive(t) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: le.toString(t)
    });
  }
  negative(t) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: le.toString(t)
    });
  }
  nonpositive(t) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: le.toString(t)
    });
  }
  nonnegative(t) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: le.toString(t)
    });
  }
  multipleOf(t, n) {
    return this._addCheck({
      kind: "multipleOf",
      value: t,
      message: le.toString(n)
    });
  }
  finite(t) {
    return this._addCheck({
      kind: "finite",
      message: le.toString(t)
    });
  }
  safe(t) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: le.toString(t)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: le.toString(t)
    });
  }
  get minValue() {
    let t = null;
    for (const n of this._def.checks)
      n.kind === "min" && (t === null || n.value > t) && (t = n.value);
    return t;
  }
  get maxValue() {
    let t = null;
    for (const n of this._def.checks)
      n.kind === "max" && (t === null || n.value < t) && (t = n.value);
    return t;
  }
  get isInt() {
    return !!this._def.checks.find((t) => t.kind === "int" || t.kind === "multipleOf" && Ie.isInteger(t.value));
  }
  get isFinite() {
    let t = null, n = null;
    for (const r of this._def.checks) {
      if (r.kind === "finite" || r.kind === "int" || r.kind === "multipleOf")
        return !0;
      r.kind === "min" ? (n === null || r.value > n) && (n = r.value) : r.kind === "max" && (t === null || r.value < t) && (t = r.value);
    }
    return Number.isFinite(n) && Number.isFinite(t);
  }
}
Zr.create = (e) => new Zr({
  checks: [],
  typeName: he.ZodNumber,
  coerce: (e == null ? void 0 : e.coerce) || !1,
  ...ve(e)
});
class zo extends Se {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(t) {
    if (this._def.coerce && (t.data = BigInt(t.data)), this._getType(t) !== ie.bigint) {
      const i = this._getOrReturnCtx(t);
      return ne(i, {
        code: K.invalid_type,
        expected: ie.bigint,
        received: i.parsedType
      }), me;
    }
    let r;
    const o = new Ht();
    for (const i of this._def.checks)
      i.kind === "min" ? (i.inclusive ? t.data < i.value : t.data <= i.value) && (r = this._getOrReturnCtx(t, r), ne(r, {
        code: K.too_small,
        type: "bigint",
        minimum: i.value,
        inclusive: i.inclusive,
        message: i.message
      }), o.dirty()) : i.kind === "max" ? (i.inclusive ? t.data > i.value : t.data >= i.value) && (r = this._getOrReturnCtx(t, r), ne(r, {
        code: K.too_big,
        type: "bigint",
        maximum: i.value,
        inclusive: i.inclusive,
        message: i.message
      }), o.dirty()) : i.kind === "multipleOf" ? t.data % i.value !== BigInt(0) && (r = this._getOrReturnCtx(t, r), ne(r, {
        code: K.not_multiple_of,
        multipleOf: i.value,
        message: i.message
      }), o.dirty()) : Ie.assertNever(i);
    return { status: o.value, value: t.data };
  }
  gte(t, n) {
    return this.setLimit("min", t, !0, le.toString(n));
  }
  gt(t, n) {
    return this.setLimit("min", t, !1, le.toString(n));
  }
  lte(t, n) {
    return this.setLimit("max", t, !0, le.toString(n));
  }
  lt(t, n) {
    return this.setLimit("max", t, !1, le.toString(n));
  }
  setLimit(t, n, r, o) {
    return new zo({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: t,
          value: n,
          inclusive: r,
          message: le.toString(o)
        }
      ]
    });
  }
  _addCheck(t) {
    return new zo({
      ...this._def,
      checks: [...this._def.checks, t]
    });
  }
  positive(t) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: le.toString(t)
    });
  }
  negative(t) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: le.toString(t)
    });
  }
  nonpositive(t) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: le.toString(t)
    });
  }
  nonnegative(t) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: le.toString(t)
    });
  }
  multipleOf(t, n) {
    return this._addCheck({
      kind: "multipleOf",
      value: t,
      message: le.toString(n)
    });
  }
  get minValue() {
    let t = null;
    for (const n of this._def.checks)
      n.kind === "min" && (t === null || n.value > t) && (t = n.value);
    return t;
  }
  get maxValue() {
    let t = null;
    for (const n of this._def.checks)
      n.kind === "max" && (t === null || n.value < t) && (t = n.value);
    return t;
  }
}
zo.create = (e) => {
  var t;
  return new zo({
    checks: [],
    typeName: he.ZodBigInt,
    coerce: (t = e == null ? void 0 : e.coerce) !== null && t !== void 0 ? t : !1,
    ...ve(e)
  });
};
class xu extends Se {
  _parse(t) {
    if (this._def.coerce && (t.data = !!t.data), this._getType(t) !== ie.boolean) {
      const r = this._getOrReturnCtx(t);
      return ne(r, {
        code: K.invalid_type,
        expected: ie.boolean,
        received: r.parsedType
      }), me;
    }
    return Kt(t.data);
  }
}
xu.create = (e) => new xu({
  typeName: he.ZodBoolean,
  coerce: (e == null ? void 0 : e.coerce) || !1,
  ...ve(e)
});
class Yi extends Se {
  _parse(t) {
    if (this._def.coerce && (t.data = new Date(t.data)), this._getType(t) !== ie.date) {
      const i = this._getOrReturnCtx(t);
      return ne(i, {
        code: K.invalid_type,
        expected: ie.date,
        received: i.parsedType
      }), me;
    }
    if (isNaN(t.data.getTime())) {
      const i = this._getOrReturnCtx(t);
      return ne(i, {
        code: K.invalid_date
      }), me;
    }
    const r = new Ht();
    let o;
    for (const i of this._def.checks)
      i.kind === "min" ? t.data.getTime() < i.value && (o = this._getOrReturnCtx(t, o), ne(o, {
        code: K.too_small,
        message: i.message,
        inclusive: !0,
        exact: !1,
        minimum: i.value,
        type: "date"
      }), r.dirty()) : i.kind === "max" ? t.data.getTime() > i.value && (o = this._getOrReturnCtx(t, o), ne(o, {
        code: K.too_big,
        message: i.message,
        inclusive: !0,
        exact: !1,
        maximum: i.value,
        type: "date"
      }), r.dirty()) : Ie.assertNever(i);
    return {
      status: r.value,
      value: new Date(t.data.getTime())
    };
  }
  _addCheck(t) {
    return new Yi({
      ...this._def,
      checks: [...this._def.checks, t]
    });
  }
  min(t, n) {
    return this._addCheck({
      kind: "min",
      value: t.getTime(),
      message: le.toString(n)
    });
  }
  max(t, n) {
    return this._addCheck({
      kind: "max",
      value: t.getTime(),
      message: le.toString(n)
    });
  }
  get minDate() {
    let t = null;
    for (const n of this._def.checks)
      n.kind === "min" && (t === null || n.value > t) && (t = n.value);
    return t != null ? new Date(t) : null;
  }
  get maxDate() {
    let t = null;
    for (const n of this._def.checks)
      n.kind === "max" && (t === null || n.value < t) && (t = n.value);
    return t != null ? new Date(t) : null;
  }
}
Yi.create = (e) => new Yi({
  checks: [],
  coerce: (e == null ? void 0 : e.coerce) || !1,
  typeName: he.ZodDate,
  ...ve(e)
});
class Tu extends Se {
  _parse(t) {
    if (this._getType(t) !== ie.symbol) {
      const r = this._getOrReturnCtx(t);
      return ne(r, {
        code: K.invalid_type,
        expected: ie.symbol,
        received: r.parsedType
      }), me;
    }
    return Kt(t.data);
  }
}
Tu.create = (e) => new Tu({
  typeName: he.ZodSymbol,
  ...ve(e)
});
class Ta extends Se {
  _parse(t) {
    if (this._getType(t) !== ie.undefined) {
      const r = this._getOrReturnCtx(t);
      return ne(r, {
        code: K.invalid_type,
        expected: ie.undefined,
        received: r.parsedType
      }), me;
    }
    return Kt(t.data);
  }
}
Ta.create = (e) => new Ta({
  typeName: he.ZodUndefined,
  ...ve(e)
});
class Sa extends Se {
  _parse(t) {
    if (this._getType(t) !== ie.null) {
      const r = this._getOrReturnCtx(t);
      return ne(r, {
        code: K.invalid_type,
        expected: ie.null,
        received: r.parsedType
      }), me;
    }
    return Kt(t.data);
  }
}
Sa.create = (e) => new Sa({
  typeName: he.ZodNull,
  ...ve(e)
});
class Su extends Se {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(t) {
    return Kt(t.data);
  }
}
Su.create = (e) => new Su({
  typeName: he.ZodAny,
  ...ve(e)
});
class So extends Se {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(t) {
    return Kt(t.data);
  }
}
So.create = (e) => new So({
  typeName: he.ZodUnknown,
  ...ve(e)
});
class gr extends Se {
  _parse(t) {
    const n = this._getOrReturnCtx(t);
    return ne(n, {
      code: K.invalid_type,
      expected: ie.never,
      received: n.parsedType
    }), me;
  }
}
gr.create = (e) => new gr({
  typeName: he.ZodNever,
  ...ve(e)
});
class Eu extends Se {
  _parse(t) {
    if (this._getType(t) !== ie.undefined) {
      const r = this._getOrReturnCtx(t);
      return ne(r, {
        code: K.invalid_type,
        expected: ie.void,
        received: r.parsedType
      }), me;
    }
    return Kt(t.data);
  }
}
Eu.create = (e) => new Eu({
  typeName: he.ZodVoid,
  ...ve(e)
});
class fn extends Se {
  _parse(t) {
    const { ctx: n, status: r } = this._processInputParams(t), o = this._def;
    if (n.parsedType !== ie.array)
      return ne(n, {
        code: K.invalid_type,
        expected: ie.array,
        received: n.parsedType
      }), me;
    if (o.exactLength !== null) {
      const s = n.data.length > o.exactLength.value, a = n.data.length < o.exactLength.value;
      (s || a) && (ne(n, {
        code: s ? K.too_big : K.too_small,
        minimum: a ? o.exactLength.value : void 0,
        maximum: s ? o.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: o.exactLength.message
      }), r.dirty());
    }
    if (o.minLength !== null && n.data.length < o.minLength.value && (ne(n, {
      code: K.too_small,
      minimum: o.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: o.minLength.message
    }), r.dirty()), o.maxLength !== null && n.data.length > o.maxLength.value && (ne(n, {
      code: K.too_big,
      maximum: o.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: o.maxLength.message
    }), r.dirty()), n.common.async)
      return Promise.all([...n.data].map((s, a) => o.type._parseAsync(new Dn(n, s, n.path, a)))).then((s) => Ht.mergeArray(r, s));
    const i = [...n.data].map((s, a) => o.type._parseSync(new Dn(n, s, n.path, a)));
    return Ht.mergeArray(r, i);
  }
  get element() {
    return this._def.type;
  }
  min(t, n) {
    return new fn({
      ...this._def,
      minLength: { value: t, message: le.toString(n) }
    });
  }
  max(t, n) {
    return new fn({
      ...this._def,
      maxLength: { value: t, message: le.toString(n) }
    });
  }
  length(t, n) {
    return new fn({
      ...this._def,
      exactLength: { value: t, message: le.toString(n) }
    });
  }
  nonempty(t) {
    return this.min(1, t);
  }
}
fn.create = (e, t) => new fn({
  type: e,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: he.ZodArray,
  ...ve(t)
});
function fo(e) {
  if (e instanceof lt) {
    const t = {};
    for (const n in e.shape) {
      const r = e.shape[n];
      t[n] = Gn.create(fo(r));
    }
    return new lt({
      ...e._def,
      shape: () => t
    });
  } else return e instanceof fn ? new fn({
    ...e._def,
    type: fo(e.element)
  }) : e instanceof Gn ? Gn.create(fo(e.unwrap())) : e instanceof Qr ? Qr.create(fo(e.unwrap())) : e instanceof Kn ? Kn.create(e.items.map((t) => fo(t))) : e;
}
class lt extends Se {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const t = this._def.shape(), n = Ie.objectKeys(t);
    return this._cached = { shape: t, keys: n };
  }
  _parse(t) {
    if (this._getType(t) !== ie.object) {
      const c = this._getOrReturnCtx(t);
      return ne(c, {
        code: K.invalid_type,
        expected: ie.object,
        received: c.parsedType
      }), me;
    }
    const { status: r, ctx: o } = this._processInputParams(t), { shape: i, keys: s } = this._getCached(), a = [];
    if (!(this._def.catchall instanceof gr && this._def.unknownKeys === "strip"))
      for (const c in o.data)
        s.includes(c) || a.push(c);
    const l = [];
    for (const c of s) {
      const u = i[c], d = o.data[c];
      l.push({
        key: { status: "valid", value: c },
        value: u._parse(new Dn(o, d, o.path, c)),
        alwaysSet: c in o.data
      });
    }
    if (this._def.catchall instanceof gr) {
      const c = this._def.unknownKeys;
      if (c === "passthrough")
        for (const u of a)
          l.push({
            key: { status: "valid", value: u },
            value: { status: "valid", value: o.data[u] }
          });
      else if (c === "strict")
        a.length > 0 && (ne(o, {
          code: K.unrecognized_keys,
          keys: a
        }), r.dirty());
      else if (c !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const c = this._def.catchall;
      for (const u of a) {
        const d = o.data[u];
        l.push({
          key: { status: "valid", value: u },
          value: c._parse(
            new Dn(o, d, o.path, u)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: u in o.data
        });
      }
    }
    return o.common.async ? Promise.resolve().then(async () => {
      const c = [];
      for (const u of l) {
        const d = await u.key, f = await u.value;
        c.push({
          key: d,
          value: f,
          alwaysSet: u.alwaysSet
        });
      }
      return c;
    }).then((c) => Ht.mergeObjectSync(r, c)) : Ht.mergeObjectSync(r, l);
  }
  get shape() {
    return this._def.shape();
  }
  strict(t) {
    return le.errToObj, new lt({
      ...this._def,
      unknownKeys: "strict",
      ...t !== void 0 ? {
        errorMap: (n, r) => {
          var o, i, s, a;
          const l = (s = (i = (o = this._def).errorMap) === null || i === void 0 ? void 0 : i.call(o, n, r).message) !== null && s !== void 0 ? s : r.defaultError;
          return n.code === "unrecognized_keys" ? {
            message: (a = le.errToObj(t).message) !== null && a !== void 0 ? a : l
          } : {
            message: l
          };
        }
      } : {}
    });
  }
  strip() {
    return new lt({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new lt({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(t) {
    return new lt({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...t
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(t) {
    return new lt({
      unknownKeys: t._def.unknownKeys,
      catchall: t._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...t._def.shape()
      }),
      typeName: he.ZodObject
    });
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(t, n) {
    return this.augment({ [t]: n });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(t) {
    return new lt({
      ...this._def,
      catchall: t
    });
  }
  pick(t) {
    const n = {};
    return Ie.objectKeys(t).forEach((r) => {
      t[r] && this.shape[r] && (n[r] = this.shape[r]);
    }), new lt({
      ...this._def,
      shape: () => n
    });
  }
  omit(t) {
    const n = {};
    return Ie.objectKeys(this.shape).forEach((r) => {
      t[r] || (n[r] = this.shape[r]);
    }), new lt({
      ...this._def,
      shape: () => n
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return fo(this);
  }
  partial(t) {
    const n = {};
    return Ie.objectKeys(this.shape).forEach((r) => {
      const o = this.shape[r];
      t && !t[r] ? n[r] = o : n[r] = o.optional();
    }), new lt({
      ...this._def,
      shape: () => n
    });
  }
  required(t) {
    const n = {};
    return Ie.objectKeys(this.shape).forEach((r) => {
      if (t && !t[r])
        n[r] = this.shape[r];
      else {
        let i = this.shape[r];
        for (; i instanceof Gn; )
          i = i._def.innerType;
        n[r] = i;
      }
    }), new lt({
      ...this._def,
      shape: () => n
    });
  }
  keyof() {
    return L0(Ie.objectKeys(this.shape));
  }
}
lt.create = (e, t) => new lt({
  shape: () => e,
  unknownKeys: "strip",
  catchall: gr.create(),
  typeName: he.ZodObject,
  ...ve(t)
});
lt.strictCreate = (e, t) => new lt({
  shape: () => e,
  unknownKeys: "strict",
  catchall: gr.create(),
  typeName: he.ZodObject,
  ...ve(t)
});
lt.lazycreate = (e, t) => new lt({
  shape: e,
  unknownKeys: "strip",
  catchall: gr.create(),
  typeName: he.ZodObject,
  ...ve(t)
});
class Ea extends Se {
  _parse(t) {
    const { ctx: n } = this._processInputParams(t), r = this._def.options;
    function o(i) {
      for (const a of i)
        if (a.result.status === "valid")
          return a.result;
      for (const a of i)
        if (a.result.status === "dirty")
          return n.common.issues.push(...a.ctx.common.issues), a.result;
      const s = i.map((a) => new ln(a.ctx.common.issues));
      return ne(n, {
        code: K.invalid_union,
        unionErrors: s
      }), me;
    }
    if (n.common.async)
      return Promise.all(r.map(async (i) => {
        const s = {
          ...n,
          common: {
            ...n.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await i._parseAsync({
            data: n.data,
            path: n.path,
            parent: s
          }),
          ctx: s
        };
      })).then(o);
    {
      let i;
      const s = [];
      for (const l of r) {
        const c = {
          ...n,
          common: {
            ...n.common,
            issues: []
          },
          parent: null
        }, u = l._parseSync({
          data: n.data,
          path: n.path,
          parent: c
        });
        if (u.status === "valid")
          return u;
        u.status === "dirty" && !i && (i = { result: u, ctx: c }), c.common.issues.length && s.push(c.common.issues);
      }
      if (i)
        return n.common.issues.push(...i.ctx.common.issues), i.result;
      const a = s.map((l) => new ln(l));
      return ne(n, {
        code: K.invalid_union,
        unionErrors: a
      }), me;
    }
  }
  get options() {
    return this._def.options;
  }
}
Ea.create = (e, t) => new Ea({
  options: e,
  typeName: he.ZodUnion,
  ...ve(t)
});
const Fn = (e) => e instanceof Ra ? Fn(e.schema) : e instanceof Zn ? Fn(e.innerType()) : e instanceof ka ? [e.value] : e instanceof Xr ? e.options : e instanceof Oa ? Ie.objectValues(e.enum) : e instanceof Ia ? Fn(e._def.innerType) : e instanceof Ta ? [void 0] : e instanceof Sa ? [null] : e instanceof Gn ? [void 0, ...Fn(e.unwrap())] : e instanceof Qr ? [null, ...Fn(e.unwrap())] : e instanceof V0 || e instanceof Aa ? Fn(e.unwrap()) : e instanceof _a ? Fn(e._def.innerType) : [];
class tf extends Se {
  _parse(t) {
    const { ctx: n } = this._processInputParams(t);
    if (n.parsedType !== ie.object)
      return ne(n, {
        code: K.invalid_type,
        expected: ie.object,
        received: n.parsedType
      }), me;
    const r = this.discriminator, o = n.data[r], i = this.optionsMap.get(o);
    return i ? n.common.async ? i._parseAsync({
      data: n.data,
      path: n.path,
      parent: n
    }) : i._parseSync({
      data: n.data,
      path: n.path,
      parent: n
    }) : (ne(n, {
      code: K.invalid_union_discriminator,
      options: Array.from(this.optionsMap.keys()),
      path: [r]
    }), me);
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(t, n, r) {
    const o = /* @__PURE__ */ new Map();
    for (const i of n) {
      const s = Fn(i.shape[t]);
      if (!s.length)
        throw new Error(`A discriminator value for key \`${t}\` could not be extracted from all schema options`);
      for (const a of s) {
        if (o.has(a))
          throw new Error(`Discriminator property ${String(t)} has duplicate value ${String(a)}`);
        o.set(a, i);
      }
    }
    return new tf({
      typeName: he.ZodDiscriminatedUnion,
      discriminator: t,
      options: n,
      optionsMap: o,
      ...ve(r)
    });
  }
}
function Cu(e, t) {
  const n = Vr(e), r = Vr(t);
  if (e === t)
    return { valid: !0, data: e };
  if (n === ie.object && r === ie.object) {
    const o = Ie.objectKeys(t), i = Ie.objectKeys(e).filter((a) => o.indexOf(a) !== -1), s = { ...e, ...t };
    for (const a of i) {
      const l = Cu(e[a], t[a]);
      if (!l.valid)
        return { valid: !1 };
      s[a] = l.data;
    }
    return { valid: !0, data: s };
  } else if (n === ie.array && r === ie.array) {
    if (e.length !== t.length)
      return { valid: !1 };
    const o = [];
    for (let i = 0; i < e.length; i++) {
      const s = e[i], a = t[i], l = Cu(s, a);
      if (!l.valid)
        return { valid: !1 };
      o.push(l.data);
    }
    return { valid: !0, data: o };
  } else return n === ie.date && r === ie.date && +e == +t ? { valid: !0, data: e } : { valid: !1 };
}
class Ca extends Se {
  _parse(t) {
    const { status: n, ctx: r } = this._processInputParams(t), o = (i, s) => {
      if (og(i) || og(s))
        return me;
      const a = Cu(i.value, s.value);
      return a.valid ? ((ig(i) || ig(s)) && n.dirty(), { status: n.value, value: a.data }) : (ne(r, {
        code: K.invalid_intersection_types
      }), me);
    };
    return r.common.async ? Promise.all([
      this._def.left._parseAsync({
        data: r.data,
        path: r.path,
        parent: r
      }),
      this._def.right._parseAsync({
        data: r.data,
        path: r.path,
        parent: r
      })
    ]).then(([i, s]) => o(i, s)) : o(this._def.left._parseSync({
      data: r.data,
      path: r.path,
      parent: r
    }), this._def.right._parseSync({
      data: r.data,
      path: r.path,
      parent: r
    }));
  }
}
Ca.create = (e, t, n) => new Ca({
  left: e,
  right: t,
  typeName: he.ZodIntersection,
  ...ve(n)
});
class Kn extends Se {
  _parse(t) {
    const { status: n, ctx: r } = this._processInputParams(t);
    if (r.parsedType !== ie.array)
      return ne(r, {
        code: K.invalid_type,
        expected: ie.array,
        received: r.parsedType
      }), me;
    if (r.data.length < this._def.items.length)
      return ne(r, {
        code: K.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), me;
    !this._def.rest && r.data.length > this._def.items.length && (ne(r, {
      code: K.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), n.dirty());
    const i = [...r.data].map((s, a) => {
      const l = this._def.items[a] || this._def.rest;
      return l ? l._parse(new Dn(r, s, r.path, a)) : null;
    }).filter((s) => !!s);
    return r.common.async ? Promise.all(i).then((s) => Ht.mergeArray(n, s)) : Ht.mergeArray(n, i);
  }
  get items() {
    return this._def.items;
  }
  rest(t) {
    return new Kn({
      ...this._def,
      rest: t
    });
  }
}
Kn.create = (e, t) => {
  if (!Array.isArray(e))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new Kn({
    items: e,
    typeName: he.ZodTuple,
    rest: null,
    ...ve(t)
  });
};
class Pa extends Se {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(t) {
    const { status: n, ctx: r } = this._processInputParams(t);
    if (r.parsedType !== ie.object)
      return ne(r, {
        code: K.invalid_type,
        expected: ie.object,
        received: r.parsedType
      }), me;
    const o = [], i = this._def.keyType, s = this._def.valueType;
    for (const a in r.data)
      o.push({
        key: i._parse(new Dn(r, a, r.path, a)),
        value: s._parse(new Dn(r, r.data[a], r.path, a)),
        alwaysSet: a in r.data
      });
    return r.common.async ? Ht.mergeObjectAsync(n, o) : Ht.mergeObjectSync(n, o);
  }
  get element() {
    return this._def.valueType;
  }
  static create(t, n, r) {
    return n instanceof Se ? new Pa({
      keyType: t,
      valueType: n,
      typeName: he.ZodRecord,
      ...ve(r)
    }) : new Pa({
      keyType: jn.create(),
      valueType: t,
      typeName: he.ZodRecord,
      ...ve(n)
    });
  }
}
class Pu extends Se {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(t) {
    const { status: n, ctx: r } = this._processInputParams(t);
    if (r.parsedType !== ie.map)
      return ne(r, {
        code: K.invalid_type,
        expected: ie.map,
        received: r.parsedType
      }), me;
    const o = this._def.keyType, i = this._def.valueType, s = [...r.data.entries()].map(([a, l], c) => ({
      key: o._parse(new Dn(r, a, r.path, [c, "key"])),
      value: i._parse(new Dn(r, l, r.path, [c, "value"]))
    }));
    if (r.common.async) {
      const a = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const l of s) {
          const c = await l.key, u = await l.value;
          if (c.status === "aborted" || u.status === "aborted")
            return me;
          (c.status === "dirty" || u.status === "dirty") && n.dirty(), a.set(c.value, u.value);
        }
        return { status: n.value, value: a };
      });
    } else {
      const a = /* @__PURE__ */ new Map();
      for (const l of s) {
        const c = l.key, u = l.value;
        if (c.status === "aborted" || u.status === "aborted")
          return me;
        (c.status === "dirty" || u.status === "dirty") && n.dirty(), a.set(c.value, u.value);
      }
      return { status: n.value, value: a };
    }
  }
}
Pu.create = (e, t, n) => new Pu({
  valueType: t,
  keyType: e,
  typeName: he.ZodMap,
  ...ve(n)
});
class Wo extends Se {
  _parse(t) {
    const { status: n, ctx: r } = this._processInputParams(t);
    if (r.parsedType !== ie.set)
      return ne(r, {
        code: K.invalid_type,
        expected: ie.set,
        received: r.parsedType
      }), me;
    const o = this._def;
    o.minSize !== null && r.data.size < o.minSize.value && (ne(r, {
      code: K.too_small,
      minimum: o.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: o.minSize.message
    }), n.dirty()), o.maxSize !== null && r.data.size > o.maxSize.value && (ne(r, {
      code: K.too_big,
      maximum: o.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: o.maxSize.message
    }), n.dirty());
    const i = this._def.valueType;
    function s(l) {
      const c = /* @__PURE__ */ new Set();
      for (const u of l) {
        if (u.status === "aborted")
          return me;
        u.status === "dirty" && n.dirty(), c.add(u.value);
      }
      return { status: n.value, value: c };
    }
    const a = [...r.data.values()].map((l, c) => i._parse(new Dn(r, l, r.path, c)));
    return r.common.async ? Promise.all(a).then((l) => s(l)) : s(a);
  }
  min(t, n) {
    return new Wo({
      ...this._def,
      minSize: { value: t, message: le.toString(n) }
    });
  }
  max(t, n) {
    return new Wo({
      ...this._def,
      maxSize: { value: t, message: le.toString(n) }
    });
  }
  size(t, n) {
    return this.min(t, n).max(t, n);
  }
  nonempty(t) {
    return this.min(1, t);
  }
}
Wo.create = (e, t) => new Wo({
  valueType: e,
  minSize: null,
  maxSize: null,
  typeName: he.ZodSet,
  ...ve(t)
});
class Oi extends Se {
  constructor() {
    super(...arguments), this.validate = this.implement;
  }
  _parse(t) {
    const { ctx: n } = this._processInputParams(t);
    if (n.parsedType !== ie.function)
      return ne(n, {
        code: K.invalid_type,
        expected: ie.function,
        received: n.parsedType
      }), me;
    function r(a, l) {
      return wu({
        data: a,
        path: n.path,
        errorMaps: [
          n.common.contextualErrorMap,
          n.schemaErrorMap,
          bu(),
          Gi
        ].filter((c) => !!c),
        issueData: {
          code: K.invalid_arguments,
          argumentsError: l
        }
      });
    }
    function o(a, l) {
      return wu({
        data: a,
        path: n.path,
        errorMaps: [
          n.common.contextualErrorMap,
          n.schemaErrorMap,
          bu(),
          Gi
        ].filter((c) => !!c),
        issueData: {
          code: K.invalid_return_type,
          returnTypeError: l
        }
      });
    }
    const i = { errorMap: n.common.contextualErrorMap }, s = n.data;
    if (this._def.returns instanceof qi) {
      const a = this;
      return Kt(async function(...l) {
        const c = new ln([]), u = await a._def.args.parseAsync(l, i).catch((h) => {
          throw c.addIssue(r(l, h)), c;
        }), d = await Reflect.apply(s, this, u);
        return await a._def.returns._def.type.parseAsync(d, i).catch((h) => {
          throw c.addIssue(o(d, h)), c;
        });
      });
    } else {
      const a = this;
      return Kt(function(...l) {
        const c = a._def.args.safeParse(l, i);
        if (!c.success)
          throw new ln([r(l, c.error)]);
        const u = Reflect.apply(s, this, c.data), d = a._def.returns.safeParse(u, i);
        if (!d.success)
          throw new ln([o(u, d.error)]);
        return d.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...t) {
    return new Oi({
      ...this._def,
      args: Kn.create(t).rest(So.create())
    });
  }
  returns(t) {
    return new Oi({
      ...this._def,
      returns: t
    });
  }
  implement(t) {
    return this.parse(t);
  }
  strictImplement(t) {
    return this.parse(t);
  }
  static create(t, n, r) {
    return new Oi({
      args: t || Kn.create([]).rest(So.create()),
      returns: n || So.create(),
      typeName: he.ZodFunction,
      ...ve(r)
    });
  }
}
class Ra extends Se {
  get schema() {
    return this._def.getter();
  }
  _parse(t) {
    const { ctx: n } = this._processInputParams(t);
    return this._def.getter()._parse({ data: n.data, path: n.path, parent: n });
  }
}
Ra.create = (e, t) => new Ra({
  getter: e,
  typeName: he.ZodLazy,
  ...ve(t)
});
class ka extends Se {
  _parse(t) {
    if (t.data !== this._def.value) {
      const n = this._getOrReturnCtx(t);
      return ne(n, {
        received: n.data,
        code: K.invalid_literal,
        expected: this._def.value
      }), me;
    }
    return { status: "valid", value: t.data };
  }
  get value() {
    return this._def.value;
  }
}
ka.create = (e, t) => new ka({
  value: e,
  typeName: he.ZodLiteral,
  ...ve(t)
});
function L0(e, t) {
  return new Xr({
    values: e,
    typeName: he.ZodEnum,
    ...ve(t)
  });
}
class Xr extends Se {
  constructor() {
    super(...arguments), hi.set(this, void 0);
  }
  _parse(t) {
    if (typeof t.data != "string") {
      const n = this._getOrReturnCtx(t), r = this._def.values;
      return ne(n, {
        expected: Ie.joinValues(r),
        received: n.parsedType,
        code: K.invalid_type
      }), me;
    }
    if (xa(this, hi) || M0(this, hi, new Set(this._def.values)), !xa(this, hi).has(t.data)) {
      const n = this._getOrReturnCtx(t), r = this._def.values;
      return ne(n, {
        received: n.data,
        code: K.invalid_enum_value,
        options: r
      }), me;
    }
    return Kt(t.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const t = {};
    for (const n of this._def.values)
      t[n] = n;
    return t;
  }
  get Values() {
    const t = {};
    for (const n of this._def.values)
      t[n] = n;
    return t;
  }
  get Enum() {
    const t = {};
    for (const n of this._def.values)
      t[n] = n;
    return t;
  }
  extract(t, n = this._def) {
    return Xr.create(t, {
      ...this._def,
      ...n
    });
  }
  exclude(t, n = this._def) {
    return Xr.create(this.options.filter((r) => !t.includes(r)), {
      ...this._def,
      ...n
    });
  }
}
hi = /* @__PURE__ */ new WeakMap();
Xr.create = L0;
class Oa extends Se {
  constructor() {
    super(...arguments), pi.set(this, void 0);
  }
  _parse(t) {
    const n = Ie.getValidEnumValues(this._def.values), r = this._getOrReturnCtx(t);
    if (r.parsedType !== ie.string && r.parsedType !== ie.number) {
      const o = Ie.objectValues(n);
      return ne(r, {
        expected: Ie.joinValues(o),
        received: r.parsedType,
        code: K.invalid_type
      }), me;
    }
    if (xa(this, pi) || M0(this, pi, new Set(Ie.getValidEnumValues(this._def.values))), !xa(this, pi).has(t.data)) {
      const o = Ie.objectValues(n);
      return ne(r, {
        received: r.data,
        code: K.invalid_enum_value,
        options: o
      }), me;
    }
    return Kt(t.data);
  }
  get enum() {
    return this._def.values;
  }
}
pi = /* @__PURE__ */ new WeakMap();
Oa.create = (e, t) => new Oa({
  values: e,
  typeName: he.ZodNativeEnum,
  ...ve(t)
});
class qi extends Se {
  unwrap() {
    return this._def.type;
  }
  _parse(t) {
    const { ctx: n } = this._processInputParams(t);
    if (n.parsedType !== ie.promise && n.common.async === !1)
      return ne(n, {
        code: K.invalid_type,
        expected: ie.promise,
        received: n.parsedType
      }), me;
    const r = n.parsedType === ie.promise ? n.data : Promise.resolve(n.data);
    return Kt(r.then((o) => this._def.type.parseAsync(o, {
      path: n.path,
      errorMap: n.common.contextualErrorMap
    })));
  }
}
qi.create = (e, t) => new qi({
  type: e,
  typeName: he.ZodPromise,
  ...ve(t)
});
class Zn extends Se {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === he.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(t) {
    const { status: n, ctx: r } = this._processInputParams(t), o = this._def.effect || null, i = {
      addIssue: (s) => {
        ne(r, s), s.fatal ? n.abort() : n.dirty();
      },
      get path() {
        return r.path;
      }
    };
    if (i.addIssue = i.addIssue.bind(i), o.type === "preprocess") {
      const s = o.transform(r.data, i);
      if (r.common.async)
        return Promise.resolve(s).then(async (a) => {
          if (n.value === "aborted")
            return me;
          const l = await this._def.schema._parseAsync({
            data: a,
            path: r.path,
            parent: r
          });
          return l.status === "aborted" ? me : l.status === "dirty" || n.value === "dirty" ? fi(l.value) : l;
        });
      {
        if (n.value === "aborted")
          return me;
        const a = this._def.schema._parseSync({
          data: s,
          path: r.path,
          parent: r
        });
        return a.status === "aborted" ? me : a.status === "dirty" || n.value === "dirty" ? fi(a.value) : a;
      }
    }
    if (o.type === "refinement") {
      const s = (a) => {
        const l = o.refinement(a, i);
        if (r.common.async)
          return Promise.resolve(l);
        if (l instanceof Promise)
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return a;
      };
      if (r.common.async === !1) {
        const a = this._def.schema._parseSync({
          data: r.data,
          path: r.path,
          parent: r
        });
        return a.status === "aborted" ? me : (a.status === "dirty" && n.dirty(), s(a.value), { status: n.value, value: a.value });
      } else
        return this._def.schema._parseAsync({ data: r.data, path: r.path, parent: r }).then((a) => a.status === "aborted" ? me : (a.status === "dirty" && n.dirty(), s(a.value).then(() => ({ status: n.value, value: a.value }))));
    }
    if (o.type === "transform")
      if (r.common.async === !1) {
        const s = this._def.schema._parseSync({
          data: r.data,
          path: r.path,
          parent: r
        });
        if (!ba(s))
          return s;
        const a = o.transform(s.value, i);
        if (a instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: n.value, value: a };
      } else
        return this._def.schema._parseAsync({ data: r.data, path: r.path, parent: r }).then((s) => ba(s) ? Promise.resolve(o.transform(s.value, i)).then((a) => ({ status: n.value, value: a })) : s);
    Ie.assertNever(o);
  }
}
Zn.create = (e, t, n) => new Zn({
  schema: e,
  typeName: he.ZodEffects,
  effect: t,
  ...ve(n)
});
Zn.createWithPreprocess = (e, t, n) => new Zn({
  schema: t,
  effect: { type: "preprocess", transform: e },
  typeName: he.ZodEffects,
  ...ve(n)
});
class Gn extends Se {
  _parse(t) {
    return this._getType(t) === ie.undefined ? Kt(void 0) : this._def.innerType._parse(t);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Gn.create = (e, t) => new Gn({
  innerType: e,
  typeName: he.ZodOptional,
  ...ve(t)
});
class Qr extends Se {
  _parse(t) {
    return this._getType(t) === ie.null ? Kt(null) : this._def.innerType._parse(t);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Qr.create = (e, t) => new Qr({
  innerType: e,
  typeName: he.ZodNullable,
  ...ve(t)
});
class Ia extends Se {
  _parse(t) {
    const { ctx: n } = this._processInputParams(t);
    let r = n.data;
    return n.parsedType === ie.undefined && (r = this._def.defaultValue()), this._def.innerType._parse({
      data: r,
      path: n.path,
      parent: n
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
Ia.create = (e, t) => new Ia({
  innerType: e,
  typeName: he.ZodDefault,
  defaultValue: typeof t.default == "function" ? t.default : () => t.default,
  ...ve(t)
});
class _a extends Se {
  _parse(t) {
    const { ctx: n } = this._processInputParams(t), r = {
      ...n,
      common: {
        ...n.common,
        issues: []
      }
    }, o = this._def.innerType._parse({
      data: r.data,
      path: r.path,
      parent: {
        ...r
      }
    });
    return wa(o) ? o.then((i) => ({
      status: "valid",
      value: i.status === "valid" ? i.value : this._def.catchValue({
        get error() {
          return new ln(r.common.issues);
        },
        input: r.data
      })
    })) : {
      status: "valid",
      value: o.status === "valid" ? o.value : this._def.catchValue({
        get error() {
          return new ln(r.common.issues);
        },
        input: r.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
_a.create = (e, t) => new _a({
  innerType: e,
  typeName: he.ZodCatch,
  catchValue: typeof t.catch == "function" ? t.catch : () => t.catch,
  ...ve(t)
});
class Ru extends Se {
  _parse(t) {
    if (this._getType(t) !== ie.nan) {
      const r = this._getOrReturnCtx(t);
      return ne(r, {
        code: K.invalid_type,
        expected: ie.nan,
        received: r.parsedType
      }), me;
    }
    return { status: "valid", value: t.data };
  }
}
Ru.create = (e) => new Ru({
  typeName: he.ZodNaN,
  ...ve(e)
});
class V0 extends Se {
  _parse(t) {
    const { ctx: n } = this._processInputParams(t), r = n.data;
    return this._def.type._parse({
      data: r,
      path: n.path,
      parent: n
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class al extends Se {
  _parse(t) {
    const { status: n, ctx: r } = this._processInputParams(t);
    if (r.common.async)
      return (async () => {
        const i = await this._def.in._parseAsync({
          data: r.data,
          path: r.path,
          parent: r
        });
        return i.status === "aborted" ? me : i.status === "dirty" ? (n.dirty(), fi(i.value)) : this._def.out._parseAsync({
          data: i.value,
          path: r.path,
          parent: r
        });
      })();
    {
      const o = this._def.in._parseSync({
        data: r.data,
        path: r.path,
        parent: r
      });
      return o.status === "aborted" ? me : o.status === "dirty" ? (n.dirty(), {
        status: "dirty",
        value: o.value
      }) : this._def.out._parseSync({
        data: o.value,
        path: r.path,
        parent: r
      });
    }
  }
  static create(t, n) {
    return new al({
      in: t,
      out: n,
      typeName: he.ZodPipeline
    });
  }
}
class Aa extends Se {
  _parse(t) {
    const n = this._def.innerType._parse(t), r = (o) => (ba(o) && (o.value = Object.freeze(o.value)), o);
    return wa(n) ? n.then((o) => r(o)) : r(n);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Aa.create = (e, t) => new Aa({
  innerType: e,
  typeName: he.ZodReadonly,
  ...ve(t)
});
lt.lazycreate;
var he;
(function(e) {
  e.ZodString = "ZodString", e.ZodNumber = "ZodNumber", e.ZodNaN = "ZodNaN", e.ZodBigInt = "ZodBigInt", e.ZodBoolean = "ZodBoolean", e.ZodDate = "ZodDate", e.ZodSymbol = "ZodSymbol", e.ZodUndefined = "ZodUndefined", e.ZodNull = "ZodNull", e.ZodAny = "ZodAny", e.ZodUnknown = "ZodUnknown", e.ZodNever = "ZodNever", e.ZodVoid = "ZodVoid", e.ZodArray = "ZodArray", e.ZodObject = "ZodObject", e.ZodUnion = "ZodUnion", e.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", e.ZodIntersection = "ZodIntersection", e.ZodTuple = "ZodTuple", e.ZodRecord = "ZodRecord", e.ZodMap = "ZodMap", e.ZodSet = "ZodSet", e.ZodFunction = "ZodFunction", e.ZodLazy = "ZodLazy", e.ZodLiteral = "ZodLiteral", e.ZodEnum = "ZodEnum", e.ZodEffects = "ZodEffects", e.ZodNativeEnum = "ZodNativeEnum", e.ZodOptional = "ZodOptional", e.ZodNullable = "ZodNullable", e.ZodDefault = "ZodDefault", e.ZodCatch = "ZodCatch", e.ZodPromise = "ZodPromise", e.ZodBranded = "ZodBranded", e.ZodPipeline = "ZodPipeline", e.ZodReadonly = "ZodReadonly";
})(he || (he = {}));
jn.create;
Zr.create;
Ru.create;
zo.create;
xu.create;
Yi.create;
Tu.create;
Ta.create;
Sa.create;
Su.create;
So.create;
gr.create;
Eu.create;
fn.create;
lt.create;
lt.strictCreate;
Ea.create;
tf.create;
Ca.create;
Kn.create;
Pa.create;
Pu.create;
Wo.create;
Oi.create;
Ra.create;
ka.create;
Xr.create;
Oa.create;
qi.create;
Zn.create;
Gn.create;
Qr.create;
Zn.createWithPreprocess;
al.create;
const KF = (e, t) => e.localeCompare(t), ZF = {
  sort: KF,
  allowDots: !0,
  charset: "utf-8",
  parseArrays: !0,
  plainObjects: !0,
  charsetSentinel: !0,
  allowPrototypes: !1,
  depth: Number.MAX_SAFE_INTEGER,
  arrayLimit: Number.MAX_SAFE_INTEGER,
  parameterLimit: Number.MAX_SAFE_INTEGER
}, XF = (e) => {
  const t = new FormData(e), n = new URLSearchParams(t);
  return _F.parse(n.toString(), ZF);
}, QF = (e) => e.replace("[", ".").replace("]", "").split("."), wc = (e, t) => QF(e).reduce((n, r) => {
  var i;
  if (r === "") return n;
  const o = ((i = n.shape) == null ? void 0 : i[r]) || n;
  return o instanceof fn ? o.element : o;
}, t), Os = (e) => e.type === "checkbox" ? e.checked : e.type === "number" ? e.valueAsNumber : e.value, IL = (e) => {
  const [t, n] = Me(null), r = ye({}), o = (c, u) => {
    const d = wc(c, e);
    return {
      ...u,
      name: c,
      id: c,
      required: !d.isOptional(),
      error: t == null ? void 0 : t[c],
      ref: (f) => {
        f !== null && (r.current[c] = { element: f, schema: d });
      }
    };
  }, i = (c, u) => {
    const d = wc(c, e);
    return {
      ...u,
      name: c,
      id: c,
      required: !d.isOptional(),
      error: t == null ? void 0 : t[c],
      ref: (f) => {
        f !== null && (r.current[c] = { element: f, schema: d });
      }
    };
  }, s = (c, u) => {
    const d = wc(c, e);
    return {
      ...u,
      name: c,
      id: c,
      required: !d.isOptional(),
      type: Bn.instance(d, Zr) ? "number" : (u == null ? void 0 : u.type) ?? "text",
      error: t == null ? void 0 : t[c],
      ref: (f) => {
        f !== null && (r.current[c] = { element: f, schema: d });
      }
    };
  };
  xe(() => {
    const c = Object.values(r.current).map((d) => {
      if (d.element.dataset.ignore === "ignore")
        return {
          input: null,
          hasInitialError: !1,
          unsubscribe: () => {
          }
        };
      const f = d.schema.safeParse(Os(d.element)), h = (m) => {
        const g = d.element, v = g.name;
        if (!v) return;
        const b = Os(m.target), y = d.schema.safeParse(b);
        if (y.success)
          return g.setCustomValidity(""), n((x) => {
            const { [v]: w, ...T } = x || {};
            return T === null || Bn.empty(T) ? null : T;
          });
        if (g.required) {
          const x = y.error.issues[0].message;
          g.setCustomValidity(x), n((w) => ({ ...w, [v]: x }));
        }
      }, p = d.element.tagName === "INPUT" ? "blur" : "change";
      return d.element.addEventListener(p, h), {
        input: d,
        hasInitialError: d.element.required ? !f.success : !1,
        unsubscribe: () => d.element.removeEventListener(p, h)
      };
    });
    return c.some((d) => d.hasInitialError) && n((d) => d === null ? {} : d), () => c.forEach((d) => d.unsubscribe());
  });
  const a = Et(
    (c) => (u) => {
      const d = u.currentTarget, f = Object.values(r.current).reduce((p, m) => {
        const g = m.element, v = m.schema.safeParse(Os(g));
        if (g.dataset.ignore === "ignore" || v.success) return p;
        const b = v.error.issues[0].message;
        g.setAttribute("data-initialized", "true");
        const y = g.dataset.name || g.name || "";
        return { ...p, [y]: b };
      }, {}), h = Bn.empty(f) ? null : f;
      n(h), c == null || c({ form: d, errors: h || {} });
    },
    []
  ), l = Et(
    (c) => (u) => {
      u.preventDefault();
      const d = u.currentTarget;
      let f = XF(d);
      Array.from(d.elements).forEach((p) => {
        if (p.tagName === "SELECT") {
          const m = p;
          f = If(f, m.name, m.value);
        }
        if (p.tagName === "INPUT") {
          const m = p;
          f = If(f, m.name, Os(m));
        }
      });
      const h = e.safeParse(f);
      return h.success ? c({ form: d, json: f, data: h.data, event: u, reset: () => Em(d), success: !0, errors: [] }) : c({
        form: d,
        json: f,
        event: u,
        data: f,
        success: !1,
        reset: () => Em(d),
        errors: h.error.issues.map((p) => ({ message: p.message, path: p.path.map((m) => String(m)) }))
      });
    },
    []
  );
  return { input: s, checkbox: i, select: o, onSubmit: l, errors: t, onInvalid: a, disabled: t !== null };
}, _L = {
  name: "dark",
  spacing: { base: "1rem", lg: "1.5rem", sm: "0.75rem" },
  shadow: {
    floating: "rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 5px 12px"
  },
  rounded: {
    pill: "2rem",
    card: "0.75rem",
    full: "9999px"
  },
  colors: {
    foreground: "hsla(210, 50%, 98%)",
    background: "hsla(0, 0%, 9%)",
    disabled: "hsla(240, 4%, 33%)",
    primary: {
      foreground: "hsla(210, 40%, 98%)",
      DEFAULT: "hsla(200,98%,39%)",
      subtle: "hsla(199, 95%, 87%)",
      hover: "hsla(199, 97%, 40%)"
    },
    secondary: {
      DEFAULT: "hsla(210, 32%, 70%)",
      background: "hsla(210, 30%, 81%)",
      subtle: "hsla(210, 27%, 88%)",
      hover: "hsla(210, 10%, 58%)",
      foreground: "hsla(210, 20%, 30%)"
    },
    info: {
      DEFAULT: "hsla(219, 91%, 59%)",
      subtle: "hsla(219, 93%, 77%)",
      hover: "hsla(219, 83%, 41%)",
      foreground: "hsla(210, 40%, 98%)"
    },
    warn: {
      DEFAULT: "hsla(27, 96%, 61%)",
      subtle: "hsla(45, 95%, 66%)",
      hover: "hsla(21, 90%, 48%)",
      foreground: "hsla(210, 40%, 98%)"
    },
    danger: {
      DEFAULT: "hsla(358, 65%, 57%)",
      subtle: "hsla(0, 94%, 81%)",
      hover: "hsla(0, 82%, 47%)",
      foreground: "hsla(210, 40%, 98%)"
    },
    success: {
      DEFAULT: "hsla(160, 73%, 36%)",
      subtle: "hsla(160, 75%, 75%)",
      hover: "hsla(160, 91%, 27%)",
      foreground: "hsla(160, 91%, 50%)"
    },
    input: {
      border: "hsla(240, 4%, 25%)",
      placeholder: "hsla(210, 24%, 71%)",
      "mask-error": "hsla(0, 94%, 81%)",
      "switch-bg": "hsla(0, 0%, 9%)",
      switch: "hsla(0, 0%, 100%)"
    },
    card: {
      background: "hsla(0, 0%, 15%)",
      border: "hsla(240, 7%, 27%)"
    },
    floating: {
      background: "hsla(0, 0%, 14%)",
      border: "hsla(240, 7%, 27%)",
      overlay: "hsla(0, 0%, 0%)"
    },
    tooltip: {
      foreground: "hsla(210, 40%, 98%)",
      background: "hsla(0, 0%, 8%)",
      border: "hsla(0, 0%, 19%)"
    },
    table: {
      background: "hsla(0, 0%, 15%)",
      border: "hsla(240, 4%, 33%)"
    }
  }
}, AL = {
  name: "light",
  shadow: {
    floating: "rgba(50, 50, 50, 0.1) 0px 0px 0px 1px, rgba(50, 50, 50, 0.1) 0px 3px 6px, rgba(50, 50, 50, 0.1) 0px 2px 3px"
  },
  spacing: {
    base: "1rem",
    lg: "1.5rem",
    sm: "0.75rem"
  },
  rounded: {
    pill: "2rem",
    card: "0.75rem",
    full: "9999px"
  },
  colors: {
    foreground: "hsla(217, 15%, 20%)",
    background: "hsla(210, 34%, 96%)",
    disabled: "hsla(240, 10%, 75%)",
    primary: {
      foreground: "hsla(210, 40%, 98%)",
      DEFAULT: "hsla(199, 89%, 54%)",
      subtle: "hsla(199, 95%, 87%)",
      hover: "hsla(199, 97%, 40%)"
    },
    secondary: {
      background: "hsla(210, 25%, 35%)",
      DEFAULT: "hsla(210, 25%, 35%)",
      subtle: "hsla(207, 29%, 39%)",
      hover: "hsla(210, 21%, 67%)",
      foreground: "hsla(210, 40%, 98%)"
    },
    info: {
      DEFAULT: "hsla(219, 91%, 59%)",
      subtle: "hsla(219, 70%, 90%)",
      hover: "hsla(219, 83%, 41%)",
      foreground: "hsla(210, 34%, 96%)"
    },
    danger: {
      DEFAULT: "hsla(0, 82%, 63%)",
      subtle: "hsla(0, 96%, 95%)",
      hover: "hsla(0, 82%, 47%)",
      foreground: "hsla(210, 34%, 96%)"
    },
    warn: {
      DEFAULT: "hsla(27, 100%, 70%)",
      subtle: "hsla(45, 95%, 80%)",
      hover: "hsla(29, 85%, 50%)",
      foreground: "hsla(210, 34%, 96%)"
    },
    success: {
      DEFAULT: "hsla(160, 73%, 36%)",
      subtle: "hsla(160, 75%, 90%)",
      hover: "hsla(160, 91%, 27%)",
      foreground: "hsla(160, 91%, 17%)"
    },
    input: {
      border: "hsla(218, 22%, 80%)",
      placeholder: "hsla(210, 24%, 71%)",
      "mask-error": "hsla(0, 94%, 81%)",
      "switch-bg": "hsla(0, 0%, 45%)",
      switch: "hsla(0, 0%, 100%)"
    },
    card: {
      background: "hsla(0, 0%, 100%)",
      border: "hsla(210, 25%, 88%)"
    },
    floating: {
      background: "hsla(0, 0%, 100%)",
      border: "hsla(210, 25%, 88%)",
      overlay: "hsla(0, 0%, 0%)"
    },
    tooltip: {
      foreground: "hsla(210, 40%, 98%)",
      background: "hsla(0, 0%, 8%)",
      border: "hsla(0, 0%, 85%)"
    },
    table: {
      background: "hsla(0, 0%, 100%)",
      border: "hsla(210, 25%, 88%)"
    }
  }
}, DL = {
  cssVariable: (e, t, n) => `var(--${n})`,
  rgba: (e) => `rgba(${e})`,
  rgb: (e) => `rgb(${e})`,
  hsl: (e) => `hsl(${e})`,
  hsla: (e) => `hsla(${e})`,
  hex: (e) => e,
  raw: (e) => e,
  formatWithVar: (e) => (t, n, r) => `${e}(var(--${r}), <alpha-value>)`
}, Bs = (e, t, n = "", r = "") => Object.entries(e).reduce((o, [i, s]) => {
  const a = r === "" ? `${n}${i}` : `${r}-${i}`;
  if (typeof s == "string") {
    const l = r === "" ? `${n}${i}` : i;
    return o.concat(t(s, l, a));
  }
  return o.concat(Bs(s, t, n, a));
}, []), JF = (e, t, n = "", r = "") => Object.entries(e).reduce((o, [i, s]) => {
  const a = r === "" ? `${n}${i}` : `${r}-${i}`;
  if (typeof s == "string") {
    const l = r === "" ? `${n}${i}` : i;
    return { ...o, [l]: t(s, i, a) };
  }
  return {
    ...o,
    [i]: JF(s, t, n, a)
  };
}, {}), ag = {
  default: (e) => `:root { ${e} }`,
  dark: (e) => `html.dark {${e}}`
}, ku = (e, t) => {
  const n = t.value || ((o, i) => i), r = e.map((o) => `${o.key}: ${n(o.key, o.value)}`).join(";");
  return t.result(r);
}, ML = {
  default: (e) => ku(e, { result: ag.default }),
  dark: (e) => ku(e, { result: ag.dark })
}, NL = (e, t) => {
  const n = (s, a, l) => ({
    key: `--${l}`,
    value: `${s}`
  }), r = Bs(e.colors, n), o = Bs(e.spacing, n), i = Bs(e.rounded, n);
  return ku(r.concat(o, i), {
    result: (s) => `html${t ? `.${t}` : ""} {${s}}`,
    value: (s, a) => a.replace("hsla(", "").replace(")", "")
  });
};
export {
  uL as Alert,
  yL as Autocomplete,
  Gs as Button,
  sL as ButtonGroup,
  VO as Calendar,
  $O as Card,
  oA as Checkbox,
  Ri as ColType,
  GP as Collapse,
  hL as ComponentsProvider,
  vL as DatePicker,
  cs as Dropdown,
  bL as FileUpload,
  wL as Form,
  el as Input,
  F_ as InputFeedback,
  Id as InputField,
  OL as Menu,
  kL as MenuItem,
  gL as Modal,
  eA as Option,
  Xi as Polymorph,
  xL as Radiobox,
  Kr as Select,
  fL as Stats,
  TL as Switch,
  mL as Tab,
  RL as Table,
  pL as Tabs,
  aL as Tag,
  N_ as Tooltip,
  EL as TransferList,
  QF as convertPath,
  CL as createColumns,
  JF as createDesignTokens,
  C0 as createOptionCols,
  ML as createStyles,
  NL as createTheme,
  bt as css,
  _L as defaultDarkTheme,
  AL as defaultLightTheme,
  Df as dispatchInput,
  Em as formReset,
  XF as formToJson,
  wc as getSchemaShape,
  oL as isReactComponent,
  iL as isReactFC,
  nu as isSsr,
  Lg as mergeRefs,
  DL as parsers,
  H_ as path,
  Bs as reduceTokens,
  Zp as safeRegex,
  IL as useForm,
  J_ as usePrevious,
  jO as useReactive,
  PL as useTablePreferences,
  yn as useTranslations,
  _d as uuid
};
//# sourceMappingURL=index.mjs.map
