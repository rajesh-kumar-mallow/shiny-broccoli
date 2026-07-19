// ==UserScript==
// @name         Check-in summary with compensation V2
// @namespace    https://hubble.mallow-tech.com
// @version      1.0.1
// @author       Neon Raven
// @description  Work log summary with month filter, tooltips, and mini-modals
// @license      Unlicense
// @downloadURL  https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/check-in-summary-with-compensation-v2.user.js
// @updateURL    https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/check-in-summary-with-compensation-v2.user.js
// @match        https://hubble.mallow-tech.com/attendance/my-check-in-data*
// @tag          timesheet
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  var n, l$1, u$2, i$1, r$1, o$1, e$1, f$2, c$1, a$1, s$1, h$1, p$1, v$1, d$1 = {}, w$1 = [], _ = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, g = Array.isArray;
  function m$1(n2, l2) {
    for (var u2 in l2) n2[u2] = l2[u2];
    return n2;
  }
  function b(n2) {
    n2 && n2.parentNode && n2.parentNode.removeChild(n2);
  }
  function k$1(l2, u2, t2) {
    var i2, r2, o2, e2 = {};
    for (o2 in u2) "key" == o2 ? i2 = u2[o2] : "ref" == o2 ? r2 = u2[o2] : e2[o2] = u2[o2];
    if (arguments.length > 2 && (e2.children = arguments.length > 3 ? n.call(arguments, 2) : t2), "function" == typeof l2 && null != l2.defaultProps) for (o2 in l2.defaultProps) void 0 === e2[o2] && (e2[o2] = l2.defaultProps[o2]);
    return x(l2, e2, i2, r2, null);
  }
  function x(n2, t2, i2, r2, o2) {
    var e2 = { type: n2, props: t2, key: i2, ref: r2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == o2 ? ++u$2 : o2, __i: -1, __u: 0 };
    return null == o2 && null != l$1.vnode && l$1.vnode(e2), e2;
  }
  function S(n2) {
    return n2.children;
  }
  function C$1(n2, l2) {
    this.props = n2, this.context = l2;
  }
  function $(n2, l2) {
    if (null == l2) return n2.__ ? $(n2.__, n2.__i + 1) : null;
    for (var u2; l2 < n2.__k.length; l2++) if (null != (u2 = n2.__k[l2]) && null != u2.__e) return u2.__e;
    return "function" == typeof n2.type ? $(n2) : null;
  }
  function I(n2) {
    if (n2.__P && n2.__d) {
      var u2 = n2.__v, t2 = u2.__e, i2 = [], r2 = [], o2 = m$1({}, u2);
      o2.__v = u2.__v + 1, l$1.vnode && l$1.vnode(o2), q(n2.__P, o2, u2, n2.__n, n2.__P.namespaceURI, 32 & u2.__u ? [t2] : null, i2, null == t2 ? $(u2) : t2, !!(32 & u2.__u), r2), o2.__v = u2.__v, o2.__.__k[o2.__i] = o2, D$1(i2, o2, r2), u2.__e = u2.__ = null, o2.__e != t2 && P(o2);
    }
  }
  function P(n2) {
    if (null != (n2 = n2.__) && null != n2.__c) return n2.__e = n2.__c.base = null, n2.__k.some(function(l2) {
      if (null != l2 && null != l2.__e) return n2.__e = n2.__c.base = l2.__e;
    }), P(n2);
  }
  function A$1(n2) {
    (!n2.__d && (n2.__d = true) && i$1.push(n2) && !H.__r++ || r$1 != l$1.debounceRendering) && ((r$1 = l$1.debounceRendering) || o$1)(H);
  }
  function H() {
    try {
      for (var n2, l2 = 1; i$1.length; ) i$1.length > l2 && i$1.sort(e$1), n2 = i$1.shift(), l2 = i$1.length, I(n2);
    } finally {
      i$1.length = H.__r = 0;
    }
  }
  function L(n2, l2, u2, t2, i2, r2, o2, e2, f2, c2, a2) {
    var s2, h2, p2, v2, y2, _2, g2, m2 = t2 && t2.__k || w$1, b2 = l2.length;
    for (f2 = T$1(u2, l2, m2, f2, b2), s2 = 0; s2 < b2; s2++) null != (p2 = u2.__k[s2]) && (h2 = -1 != p2.__i && m2[p2.__i] || d$1, p2.__i = s2, _2 = q(n2, p2, h2, i2, r2, o2, e2, f2, c2, a2), v2 = p2.__e, p2.ref && h2.ref != p2.ref && (h2.ref && J(h2.ref, null, p2), a2.push(p2.ref, p2.__c || v2, p2)), null == y2 && null != v2 && (y2 = v2), (g2 = !!(4 & p2.__u)) || h2.__k === p2.__k ? (f2 = j$1(p2, f2, n2, g2), g2 && h2.__e && (h2.__e = null)) : "function" == typeof p2.type && void 0 !== _2 ? f2 = _2 : v2 && (f2 = v2.nextSibling), p2.__u &= -7);
    return u2.__e = y2, f2;
  }
  function T$1(n2, l2, u2, t2, i2) {
    var r2, o2, e2, f2, c2, a2 = u2.length, s2 = a2, h2 = 0;
    for (n2.__k = new Array(i2), r2 = 0; r2 < i2; r2++) null != (o2 = l2[r2]) && "boolean" != typeof o2 && "function" != typeof o2 ? ("string" == typeof o2 || "number" == typeof o2 || "bigint" == typeof o2 || o2.constructor == String ? o2 = n2.__k[r2] = x(null, o2, null, null, null) : g(o2) ? o2 = n2.__k[r2] = x(S, { children: o2 }, null, null, null) : void 0 === o2.constructor && o2.__b > 0 ? o2 = n2.__k[r2] = x(o2.type, o2.props, o2.key, o2.ref ? o2.ref : null, o2.__v) : n2.__k[r2] = o2, f2 = r2 + h2, o2.__ = n2, o2.__b = n2.__b + 1, e2 = null, -1 != (c2 = o2.__i = O(o2, u2, f2, s2)) && (s2--, (e2 = u2[c2]) && (e2.__u |= 2)), null == e2 || null == e2.__v ? (-1 == c2 && (i2 > a2 ? h2-- : i2 < a2 && h2++), "function" != typeof o2.type && (o2.__u |= 4)) : c2 != f2 && (c2 == f2 - 1 ? h2-- : c2 == f2 + 1 ? h2++ : (c2 > f2 ? h2-- : h2++, o2.__u |= 4))) : n2.__k[r2] = null;
    if (s2) for (r2 = 0; r2 < a2; r2++) null != (e2 = u2[r2]) && 0 == (2 & e2.__u) && (e2.__e == t2 && (t2 = $(e2)), K(e2, e2));
    return t2;
  }
  function j$1(n2, l2, u2, t2) {
    var i2, r2;
    if ("function" == typeof n2.type) {
      for (i2 = n2.__k, r2 = 0; i2 && r2 < i2.length; r2++) i2[r2] && (i2[r2].__ = n2, l2 = j$1(i2[r2], l2, u2, t2));
      return l2;
    }
    n2.__e != l2 && (t2 && (l2 && n2.type && !l2.parentNode && (l2 = $(n2)), u2.insertBefore(n2.__e, l2 || null)), l2 = n2.__e);
    do {
      l2 = l2 && l2.nextSibling;
    } while (null != l2 && 8 == l2.nodeType);
    return l2;
  }
  function O(n2, l2, u2, t2) {
    var i2, r2, o2, e2 = n2.key, f2 = n2.type, c2 = l2[u2], a2 = null != c2 && 0 == (2 & c2.__u);
    if (null === c2 && null == e2 || a2 && e2 == c2.key && f2 == c2.type) return u2;
    if (t2 > (a2 ? 1 : 0)) {
      for (i2 = u2 - 1, r2 = u2 + 1; i2 >= 0 || r2 < l2.length; ) if (null != (c2 = l2[o2 = i2 >= 0 ? i2-- : r2++]) && 0 == (2 & c2.__u) && e2 == c2.key && f2 == c2.type) return o2;
    }
    return -1;
  }
  function z$1(n2, l2, u2) {
    "-" == l2[0] ? n2.setProperty(l2, null == u2 ? "" : u2) : n2[l2] = null == u2 ? "" : "number" != typeof u2 || _.test(l2) ? u2 : u2 + "px";
  }
  function N(n2, l2, u2, t2, i2) {
    var r2, o2;
    n: if ("style" == l2) if ("string" == typeof u2) n2.style.cssText = u2;
    else {
      if ("string" == typeof t2 && (n2.style.cssText = t2 = ""), t2) for (l2 in t2) u2 && l2 in u2 || z$1(n2.style, l2, "");
      if (u2) for (l2 in u2) t2 && u2[l2] == t2[l2] || z$1(n2.style, l2, u2[l2]);
    }
    else if ("o" == l2[0] && "n" == l2[1]) r2 = l2 != (l2 = l2.replace(s$1, "$1")), o2 = l2.toLowerCase(), l2 = o2 in n2 || "onFocusOut" == l2 || "onFocusIn" == l2 ? o2.slice(2) : l2.slice(2), n2.l || (n2.l = {}), n2.l[l2 + r2] = u2, u2 ? t2 ? u2[a$1] = t2[a$1] : (u2[a$1] = h$1, n2.addEventListener(l2, r2 ? v$1 : p$1, r2)) : n2.removeEventListener(l2, r2 ? v$1 : p$1, r2);
    else {
      if ("http://www.w3.org/2000/svg" == i2) l2 = l2.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
      else if ("width" != l2 && "height" != l2 && "href" != l2 && "list" != l2 && "form" != l2 && "tabIndex" != l2 && "download" != l2 && "rowSpan" != l2 && "colSpan" != l2 && "role" != l2 && "popover" != l2 && l2 in n2) try {
        n2[l2] = null == u2 ? "" : u2;
        break n;
      } catch (n3) {
      }
      "function" == typeof u2 || (null == u2 || false === u2 && "-" != l2[4] ? n2.removeAttribute(l2) : n2.setAttribute(l2, "popover" == l2 && 1 == u2 ? "" : u2));
    }
  }
  function V(n2) {
    return function(u2) {
      if (this.l) {
        var t2 = this.l[u2.type + n2];
        if (null == u2[c$1]) u2[c$1] = h$1++;
        else if (u2[c$1] < t2[a$1]) return;
        return t2(l$1.event ? l$1.event(u2) : u2);
      }
    };
  }
  function q(n2, u2, t2, i2, r2, o2, e2, f2, c2, a2) {
    var s2, h2, p2, v2, y2, d2, _2, k2, x2, M, $2, I2, P2, A2, H2, T2, j2 = u2.type;
    if (void 0 !== u2.constructor) return null;
    128 & t2.__u && (c2 = !!(32 & t2.__u), o2 = [f2 = u2.__e = t2.__e]), (s2 = l$1.__b) && s2(u2);
    n: if ("function" == typeof j2) {
      h2 = e2.length;
      try {
        if (x2 = u2.props, M = j2.prototype && j2.prototype.render, $2 = (s2 = j2.contextType) && i2[s2.__c], I2 = s2 ? $2 ? $2.props.value : s2.__ : i2, t2.__c ? k2 = (p2 = u2.__c = t2.__c).__ = p2.__E : (M ? u2.__c = p2 = new j2(x2, I2) : (u2.__c = p2 = new C$1(x2, I2), p2.constructor = j2, p2.render = Q), $2 && $2.sub(p2), p2.state || (p2.state = {}), p2.__n = i2, v2 = p2.__d = true, p2.__h = [], p2._sb = []), M && null == p2.__s && (p2.__s = p2.state), M && null != j2.getDerivedStateFromProps && (p2.__s == p2.state && (p2.__s = m$1({}, p2.__s)), m$1(p2.__s, j2.getDerivedStateFromProps(x2, p2.__s))), y2 = p2.props, d2 = p2.state, p2.__v = u2, v2) M && null == j2.getDerivedStateFromProps && null != p2.componentWillMount && p2.componentWillMount(), M && null != p2.componentDidMount && p2.__h.push(p2.componentDidMount);
        else {
          if (M && null == j2.getDerivedStateFromProps && x2 !== y2 && null != p2.componentWillReceiveProps && p2.componentWillReceiveProps(x2, I2), u2.__v == t2.__v || !p2.__e && null != p2.shouldComponentUpdate && false === p2.shouldComponentUpdate(x2, p2.__s, I2)) {
            u2.__v != t2.__v && (p2.props = x2, p2.state = p2.__s, p2.__d = false), u2.__e = t2.__e, u2.__k = t2.__k, u2.__k.some(function(n3) {
              n3 && (n3.__ = u2);
            }), w$1.push.apply(p2.__h, p2._sb), p2._sb = [], p2.__h.length && e2.push(p2);
            break n;
          }
          null != p2.componentWillUpdate && p2.componentWillUpdate(x2, p2.__s, I2), M && null != p2.componentDidUpdate && p2.__h.push(function() {
            p2.componentDidUpdate(y2, d2, _2);
          });
        }
        if (p2.context = I2, p2.props = x2, p2.__P = n2, p2.__e = false, P2 = l$1.__r, A2 = 0, M) p2.state = p2.__s, p2.__d = false, P2 && P2(u2), s2 = p2.render(p2.props, p2.state, p2.context), w$1.push.apply(p2.__h, p2._sb), p2._sb = [];
        else do {
          p2.__d = false, P2 && P2(u2), s2 = p2.render(p2.props, p2.state, p2.context), p2.state = p2.__s;
        } while (p2.__d && ++A2 < 25);
        p2.state = p2.__s, null != p2.getChildContext && (i2 = m$1(m$1({}, i2), p2.getChildContext())), M && !v2 && null != p2.getSnapshotBeforeUpdate && (_2 = p2.getSnapshotBeforeUpdate(y2, d2)), H2 = null != s2 && s2.type === S && null == s2.key ? E(s2.props.children) : s2, f2 = L(n2, g(H2) ? H2 : [H2], u2, t2, i2, r2, o2, e2, f2, c2, a2), p2.base = u2.__e, u2.__u &= -161, p2.__h.length && e2.push(p2), k2 && (p2.__E = p2.__ = null);
      } catch (n3) {
        if (e2.length = h2, u2.__v = null, c2 || null != o2) {
          if (n3.then) {
            for (u2.__u |= c2 ? 160 : 128; f2 && 8 == f2.nodeType && f2.nextSibling; ) f2 = f2.nextSibling;
            null != o2 && (o2[o2.indexOf(f2)] = null), u2.__e = f2;
          } else if (null != o2) for (T2 = o2.length; T2--; ) b(o2[T2]);
        } else u2.__e = t2.__e;
        null == u2.__k && (u2.__k = t2.__k || []), n3.then || B$1(u2), l$1.__e(n3, u2, t2);
      }
    } else null == o2 && u2.__v == t2.__v ? (u2.__k = t2.__k, u2.__e = t2.__e) : f2 = u2.__e = G(t2.__e, u2, t2, i2, r2, o2, e2, c2, a2);
    return (s2 = l$1.diffed) && s2(u2), 128 & u2.__u ? void 0 : f2;
  }
  function B$1(n2) {
    n2 && (n2.__c && (n2.__c.__e = true), n2.__k && n2.__k.some(B$1));
  }
  function D$1(n2, u2, t2) {
    for (var i2 = 0; i2 < t2.length; i2++) J(t2[i2], t2[++i2], t2[++i2]);
    l$1.__c && l$1.__c(u2, n2), n2.some(function(u3) {
      try {
        n2 = u3.__h, u3.__h = [], n2.some(function(n3) {
          n3.call(u3);
        });
      } catch (n3) {
        l$1.__e(n3, u3.__v);
      }
    });
  }
  function E(n2) {
    return "object" != typeof n2 || null == n2 || n2.__b > 0 ? n2 : g(n2) ? n2.map(E) : void 0 !== n2.constructor ? null : m$1({}, n2);
  }
  function G(u2, t2, i2, r2, o2, e2, f2, c2, a2) {
    var s2, h2, p2, v2, y2, w2, _2, m2 = i2.props || d$1, k2 = t2.props, x2 = t2.type;
    if ("svg" == x2 ? o2 = "http://www.w3.org/2000/svg" : "math" == x2 ? o2 = "http://www.w3.org/1998/Math/MathML" : o2 || (o2 = "http://www.w3.org/1999/xhtml"), null != e2) {
      for (s2 = 0; s2 < e2.length; s2++) if ((y2 = e2[s2]) && "setAttribute" in y2 == !!x2 && (x2 ? y2.localName == x2 : 3 == y2.nodeType)) {
        u2 = y2, e2[s2] = null;
        break;
      }
    }
    if (null == u2) {
      if (null == x2) return document.createTextNode(k2);
      u2 = document.createElementNS(o2, x2, k2.is && k2), c2 && (l$1.__m && l$1.__m(t2, e2), c2 = false), e2 = null;
    }
    if (null == x2) m2 === k2 || c2 && u2.data == k2 || (u2.data = k2);
    else {
      if (e2 = "textarea" == x2 && null != k2.defaultValue ? null : e2 && n.call(u2.childNodes), !c2 && null != e2) for (m2 = {}, s2 = 0; s2 < u2.attributes.length; s2++) m2[(y2 = u2.attributes[s2]).name] = y2.value;
      for (s2 in m2) y2 = m2[s2], "dangerouslySetInnerHTML" == s2 ? p2 = y2 : "children" == s2 || s2 in k2 || "value" == s2 && "defaultValue" in k2 || "checked" == s2 && "defaultChecked" in k2 || N(u2, s2, null, y2, o2);
      for (s2 in k2) y2 = k2[s2], "children" == s2 ? v2 = y2 : "dangerouslySetInnerHTML" == s2 ? h2 = y2 : "value" == s2 ? w2 = y2 : "checked" == s2 ? _2 = y2 : c2 && "function" != typeof y2 || m2[s2] === y2 || N(u2, s2, y2, m2[s2], o2);
      if (h2) c2 || p2 && (h2.__html == p2.__html || h2.__html == u2.innerHTML) || (u2.innerHTML = h2.__html), t2.__k = [];
      else if (p2 && (u2.innerHTML = ""), L("template" == t2.type ? u2.content : u2, g(v2) ? v2 : [v2], t2, i2, r2, "foreignObject" == x2 ? "http://www.w3.org/1999/xhtml" : o2, e2, f2, e2 ? e2[0] : i2.__k && $(i2, 0), c2, a2), null != e2) for (s2 = e2.length; s2--; ) b(e2[s2]);
      c2 && "textarea" != x2 || (s2 = "value", "progress" == x2 && null == w2 ? u2.removeAttribute("value") : null != w2 && (w2 !== u2[s2] || "progress" == x2 && !w2 || "option" == x2 && w2 != m2[s2]) && N(u2, s2, w2, m2[s2], o2), s2 = "checked", null != _2 && _2 != u2[s2] && N(u2, s2, _2, m2[s2], o2));
    }
    return u2;
  }
  function J(n2, u2, t2) {
    try {
      if ("function" == typeof n2) {
        var i2 = "function" == typeof n2.__u;
        i2 && n2.__u(), i2 && null == u2 || (n2.__u = n2(u2));
      } else n2.current = u2;
    } catch (n3) {
      l$1.__e(n3, t2);
    }
  }
  function K(n2, u2, t2) {
    var i2, r2;
    if (l$1.unmount && l$1.unmount(n2), (i2 = n2.ref) && (i2.current && i2.current != n2.__e || J(i2, null, u2)), null != (i2 = n2.__c)) {
      if (i2.componentWillUnmount) try {
        i2.componentWillUnmount();
      } catch (n3) {
        l$1.__e(n3, u2);
      }
      i2.base = i2.__P = i2.__n = null;
    }
    if (i2 = n2.__k) for (r2 = 0; r2 < i2.length; r2++) i2[r2] && K(i2[r2], u2, t2 || "function" != typeof n2.type);
    t2 || b(n2.__e), n2.__c = n2.__ = n2.__e = void 0;
  }
  function Q(n2, l2, u2) {
    return this.constructor(n2, u2);
  }
  function R(u2, t2, i2) {
    var r2, o2, e2, f2;
    t2 == document && (t2 = document.documentElement), l$1.__ && l$1.__(u2, t2), o2 = (r2 = false) ? null : t2.__k, e2 = [], f2 = [], q(t2, u2 = t2.__k = k$1(S, null, [u2]), o2 || d$1, d$1, t2.namespaceURI, o2 ? null : t2.firstChild ? n.call(t2.childNodes) : null, e2, o2 ? o2.__e : t2.firstChild, r2, f2), D$1(e2, u2, f2), u2.props.children = null;
  }
  n = w$1.slice, l$1 = { __e: function(n2, l2, u2, t2) {
    for (var i2, r2, o2; l2 = l2.__; ) if ((i2 = l2.__c) && !i2.__) try {
      if ((r2 = i2.constructor) && null != r2.getDerivedStateFromError && (i2.setState(r2.getDerivedStateFromError(n2)), o2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), o2 = i2.__d), o2) return i2.__E = i2;
    } catch (l3) {
      n2 = l3;
    }
    throw n2;
  } }, u$2 = 0, C$1.prototype.setState = function(n2, l2) {
    var u2;
    u2 = null != this.__s && this.__s != this.state ? this.__s : this.__s = m$1({}, this.state), "function" == typeof n2 && (n2 = n2(m$1({}, u2), this.props)), n2 && m$1(u2, n2), null != n2 && this.__v && (l2 && this._sb.push(l2), A$1(this));
  }, C$1.prototype.forceUpdate = function(n2) {
    this.__v && (this.__e = true, n2 && this.__h.push(n2), A$1(this));
  }, C$1.prototype.render = S, i$1 = [], o$1 = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e$1 = function(n2, l2) {
    return n2.__v.__b - l2.__v.__b;
  }, H.__r = 0, f$2 = Math.random().toString(8), c$1 = "__d" + f$2, a$1 = "__a" + f$2, s$1 = /(PointerCapture)$|Capture$/i, h$1 = 0, p$1 = V(false), v$1 = V(true);
  var f$1 = 0;
  function u$1(e2, t2, n2, o2, i2, u2) {
    t2 || (t2 = {});
    var a2, c2, p2 = t2;
    if ("ref" in p2) for (c2 in p2 = {}, t2) "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
    var l2 = { type: e2, props: p2, key: n2, ref: a2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f$1, __i: -1, __u: 0, __source: i2, __self: u2 };
    if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2]);
    return l$1.vnode && l$1.vnode(l2), l2;
  }
  var t, r, u, i, o = 0, f = [], c = l$1, e = c.__b, a = c.__r, v = c.diffed, l = c.__c, m = c.unmount, p = c.__;
  function s(n2, t2) {
    c.__h && c.__h(r, n2, o || t2), o = 0;
    var u2 = r.__H || (r.__H = { __: [], __h: [] });
    return n2 >= u2.__.length && u2.__.push({}), u2.__[n2];
  }
  function d(n2) {
    return o = 1, y(D, n2);
  }
  function y(n2, u2, i2) {
    var o2 = s(t++, 2);
    if (o2.t = n2, !o2.__c && (o2.__ = [D(void 0, u2), function(n3) {
      var t2 = o2.__N ? o2.__N[0] : o2.__[0], r2 = o2.t(t2, n3);
      t2 !== r2 && (o2.__N = [r2, o2.__[1]], o2.__c.setState({}));
    }], o2.__c = r, !r.__f)) {
      var f2 = function(n3, t2, r2) {
        if (!o2.__c.__H) return true;
        var u3 = false, i3 = o2.__c.props !== n3;
        if (o2.__c.__H.__.some(function(n4) {
          if (n4.__N) {
            u3 = true;
            var t3 = n4.__[0];
            n4.__ = n4.__N, n4.__N = void 0, t3 !== n4.__[0] && (i3 = true);
          }
        }), c2) {
          var f3 = c2.call(this, n3, t2, r2);
          return u3 ? f3 || i3 : f3;
        }
        return !u3 || i3;
      };
      r.__f = true;
      var c2 = r.shouldComponentUpdate, e2 = r.componentWillUpdate;
      r.componentWillUpdate = function(n3, t2, r2) {
        if (this.__e) {
          var u3 = c2;
          c2 = void 0, f2(n3, t2, r2), c2 = u3;
        }
        e2 && e2.call(this, n3, t2, r2);
      }, r.shouldComponentUpdate = f2;
    }
    return o2.__N || o2.__;
  }
  function h(n2, u2) {
    var i2 = s(t++, 3);
    !c.__s && C(i2.__H, u2) && (i2.__ = n2, i2.u = u2, r.__H.__h.push(i2));
  }
  function A(n2) {
    return o = 5, T(function() {
      return { current: n2 };
    }, []);
  }
  function T(n2, r2) {
    var u2 = s(t++, 7);
    return C(u2.__H, r2) && (u2.__ = n2(), u2.__H = r2, u2.__h = n2), u2.__;
  }
  function j() {
    for (var n2; n2 = f.shift(); ) {
      var t2 = n2.__H;
      if (n2.__P && t2) try {
        t2.__h.some(z), t2.__h.some(B), t2.__h = [];
      } catch (r2) {
        t2.__h = [], c.__e(r2, n2.__v);
      }
    }
  }
  c.__b = function(n2) {
    r = null, e && e(n2);
  }, c.__ = function(n2, t2) {
    n2 && t2.__k && t2.__k.__m && (n2.__m = t2.__k.__m), p && p(n2, t2);
  }, c.__r = function(n2) {
    a && a(n2), t = 0;
    var i2 = (r = n2.__c).__H;
    i2 && (u === r ? (i2.__h = [], r.__h = [], i2.__.some(function(n3) {
      n3.__N && (n3.__ = n3.__N), n3.u = n3.__N = void 0;
    })) : (i2.__h.some(z), i2.__h.some(B), i2.__h = [], t = 0)), u = r;
  }, c.diffed = function(n2) {
    v && v(n2);
    var t2 = n2.__c;
    t2 && t2.__H && (t2.__H.__h.length && (1 !== f.push(t2) && i === c.requestAnimationFrame || ((i = c.requestAnimationFrame) || w)(j)), t2.__H.__.some(function(n3) {
      n3.u && (n3.__H = n3.u, n3.u = void 0);
    })), u = r = null;
  }, c.__c = function(n2, t2) {
    t2.some(function(n3) {
      try {
        n3.__h.some(z), n3.__h = n3.__h.filter(function(n4) {
          return !n4.__ || B(n4);
        });
      } catch (r2) {
        t2.some(function(n4) {
          n4.__h && (n4.__h = []);
        }), t2 = [], c.__e(r2, n3.__v);
      }
    }), l && l(n2, t2);
  }, c.unmount = function(n2) {
    m && m(n2);
    var t2, r2 = n2.__c;
    r2 && r2.__H && (r2.__H.__.some(function(n3) {
      try {
        z(n3);
      } catch (n4) {
        t2 = n4;
      }
    }), r2.__H = void 0, t2 && c.__e(t2, r2.__v));
  };
  var k = "function" == typeof requestAnimationFrame;
  function w(n2) {
    var t2, r2 = function() {
      clearTimeout(u2), k && cancelAnimationFrame(t2), setTimeout(n2);
    }, u2 = setTimeout(r2, 35);
    k && (t2 = requestAnimationFrame(r2));
  }
  function z(n2) {
    var t2 = r, u2 = n2.__c;
    "function" == typeof u2 && (n2.__c = void 0, u2()), r = t2;
  }
  function B(n2) {
    var t2 = r;
    n2.__c = n2.__(), r = t2;
  }
  function C(n2, t2) {
    return !n2 || n2.length !== t2.length || t2.some(function(t3, r2) {
      return t3 !== n2[r2];
    });
  }
  function D(n2, t2) {
    return "function" == typeof t2 ? t2(n2) : t2;
  }
  const ICONS = {
    check: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="2.5,8 6,11.5 13.5,4.5"/></svg>',
    warn: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2L14.5 13H1.5L8 2z"/><line x1="8" y1="7" x2="8" y2="10"/><circle cx="8" cy="12" r="0.5" fill="currentColor"/></svg>',
    error: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><line x1="8" y1="5" x2="8" y2="8.5"/><circle cx="8" cy="11" r="0.5" fill="currentColor"/></svg>',
    muted: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><line x1="8" y1="5" x2="8" y2="9"/><circle cx="8" cy="11.5" r="0.5" fill="currentColor"/></svg>',
    refresh: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6" stroke-dasharray="28.3 12"/><polyline points="5,0 8,2 5,4"/></svg>',
    list: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="4" x2="12" y2="4"/><line x1="4" y1="8" x2="12" y2="8"/><line x1="4" y1="12" x2="8" y2="12"/></svg>',
    close: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/></svg>',
    clock: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="8" cy="8" r="6"/><polyline points="8,5 8,8 10.5,10"/></svg>',
    report: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="2" width="10" height="12" rx="1.5"/><line x1="6" y1="6" x2="10" y2="6"/><line x1="6" y1="9" x2="10" y2="9"/><line x1="6" y1="12" x2="8" y2="12"/></svg>',
    table: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="2" width="12" height="12" rx="1.5"/><line x1="2" y1="6" x2="14" y2="6"/><line x1="2" y1="10" x2="14" y2="10"/><line x1="7" y1="6" x2="7" y2="14"/></svg>',
    plus: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="3" x2="8" y2="13"/><line x1="3" y1="8" x2="13" y2="8"/></svg>',
    cal: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="3" width="12" height="11" rx="1.5"/><line x1="2" y1="7" x2="14" y2="7"/><line x1="5" y1="2" x2="5" y2="4"/><line x1="11" y1="2" x2="11" y2="4"/></svg>',
    entries: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 2H4a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 4 14h8a1.5 1.5 0 0 0 1.5-1.5V7L9 2z"/><polyline points="9,2 9,7 13.5,7"/></svg>',
    chevron: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4,6 8,10 12,6"/></svg>'
  };
  const icon = (name, size = 14) => {
    const s2 = size;
    return `<span style="display:inline-flex;width:${s2}px;height:${s2}px;flex-shrink:0;align-items:center;justify-content:center">${ICONS[name] || ""}</span>`;
  };
  function Icon({ name, size = 14 }) {
    return /* @__PURE__ */ u$1(
      "span",
      {
        class: "wls-icon",
        style: `display:inline-flex;width:${size}px;height:${size}px;flex-shrink:0;align-items:center;justify-content:center`,
        dangerouslySetInnerHTML: { __html: ICONS[name] || "" }
      }
    );
  }
  const WORK_DAY_MINUTES = 8 * 60;
  const CONFIG = {
    checkInApiUrl: "https://hubble.mallow-tech.com/attendance/get-my-check-in-data",
    timesheetApiUrl: "https://hubble.mallow-tech.com/v2/timesheet-entries",
    cardId: "custom-work-log-summary-card",
    oldIds: ["custom-timeoff-compensation-card", "custom-work-log-summary-card"],
    workDayMinutes: WORK_DAY_MINUTES,
    weekendDays: [0, 6],
    maxTimesheetPages: 50,
    timeOffTypes: /* @__PURE__ */ new Set([
      "Time Off",
      "Day Start Time Off",
      "Attendance Time Off",
      "attendance-time-off",
      "day-start-time-off"
    ]),
    workTypes: /* @__PURE__ */ new Set(["login", "Check In", "Check In Office", "Check In Home"]),
    dayOffLabels: /* @__PURE__ */ new Set(["Day Off", "Comp Off", "On Duty"])
  };
  const pad = (v2) => String(v2).padStart(2, "0");
  const escapeHtml = (v2) => String(v2 ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  const stripHtml = (v2) => {
    const d2 = document.createElement("div");
    d2.innerHTML = String(v2 ?? "");
    return d2.textContent || d2.innerText || "";
  };
  const toYMD = (d2) => `${d2.getFullYear()}-${pad(d2.getMonth() + 1)}-${pad(d2.getDate())}`;
  const getMonthRange = (offset = 0) => {
    const now = /* @__PURE__ */ new Date();
    const y2 = now.getFullYear();
    const m2 = now.getMonth() + offset;
    const start = new Date(y2, m2, 1);
    const end = new Date(y2, m2 + 1, 0);
    return { startDate: toYMD(start), endDate: toYMD(end) };
  };
  const buildMonthOptions = (count = 6) => {
    const now = /* @__PURE__ */ new Date();
    const months = [];
    for (let i2 = 0; i2 >= -(count - 1); i2--) {
      const d2 = new Date(now.getFullYear(), now.getMonth() + i2, 1);
      months.push({
        offset: i2,
        label: i2 === 0 ? "This month" : i2 === -1 ? "Last month" : d2.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
        shortLabel: d2.toLocaleDateString("en-IN", { month: "short" }),
        year: d2.getFullYear(),
        month: d2.getMonth(),
        fullLabel: d2.toLocaleDateString("en-IN", { month: "long", year: "numeric" })
      });
    }
    return months;
  };
  const parseDate = (value) => {
    if (!value) return null;
    const text = stripHtml(value).trim().replace(",", "");
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return /* @__PURE__ */ new Date(`${text}T00:00:00`);
    if (window.moment) {
      const p2 = window.moment(
        text,
        [
          "YYYY-MM-DD",
          "DD MMM YYYY",
          "DD MMMM YYYY",
          "MM/DD/YYYY",
          "DD-MM-YYYY",
          "DD/MM/YYYY",
          "DD/MMM/YYYY",
          "MMM DD YYYY",
          "MMMM DD YYYY"
        ],
        true
      );
      if (p2.isValid()) return p2.toDate();
    }
    const n2 = new Date(text);
    return isNaN(n2.getTime()) ? null : n2;
  };
  const formatDisplayDate = (v2) => {
    const d2 = parseDate(v2);
    if (!d2) return String(v2 || "-");
    return d2.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };
  const parseTimeToMinutes = (time) => {
    var _a;
    if (!time) return null;
    const v2 = stripHtml(time).trim();
    const m2 = v2.match(/^(\d{1,2}):(\d{2})(?::\d{2})?(?:\s?(AM|PM))?$/i);
    if (!m2) return null;
    let h2 = Number(m2[1]);
    const min = Number(m2[2]);
    const mer = (_a = m2[3]) == null ? void 0 : _a.toUpperCase();
    if (mer === "PM" && h2 !== 12) h2 += 12;
    if (mer === "AM" && h2 === 12) h2 = 0;
    return h2 * 60 + min;
  };
  const parseTimesheetDurationToMinutes = (value) => {
    if (value === null || typeof value === "undefined") return 0;
    if (typeof value === "number") return isFinite(value) ? Math.round(value * 60) : 0;
    const text = stripHtml(value).trim().toLowerCase();
    if (!text || text === "-" || text === "null") return 0;
    const n2 = Number(text);
    if (isFinite(n2)) return Math.round(n2 * 60);
    let total = 0;
    let matched = false;
    const hm = text.match(/(\d+(?:\.\d+)?)\s*(h|hr|hrs|hour|hours)\b/i);
    if (hm) {
      total += Math.round(Number(hm[1]) * 60);
      matched = true;
    }
    const mm = text.match(/(\d+)\s*(m|min|mins|minute|minutes)\b/i);
    if (mm) {
      total += Number(mm[1]);
      matched = true;
    }
    if (matched) return total;
    const hhmm = text.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (hhmm) return Number(hhmm[1]) * 60 + Number(hhmm[2]);
    return 0;
  };
  const formatMinutes = (total) => {
    const s2 = Math.max(0, Math.round(total || 0));
    const h2 = Math.floor(s2 / 60);
    const m2 = s2 % 60;
    if (h2 && m2) return `${h2}h ${m2}m`;
    if (h2) return `${h2}h`;
    return `${m2}m`;
  };
  const formatSignedMinutes = (min) => {
    const v2 = Math.round(min || 0);
    if (v2 === 0) return "0m";
    return `${v2 > 0 ? "+" : "−"}${formatMinutes(Math.abs(v2))}`;
  };
  const roundedHour = (min) => Math.round((min || 0) / 60);
  const isToday = (d2) => d2 && toYMD(d2) === toYMD(/* @__PURE__ */ new Date());
  const getCurrentMinutes = () => {
    const now = /* @__PURE__ */ new Date();
    return now.getHours() * 60 + now.getMinutes();
  };
  const getDurationMinutes = (start, end, date, allowRunning = false) => {
    const s2 = parseTimeToMinutes(start);
    let e2 = parseTimeToMinutes(end);
    if (e2 === null && allowRunning && isToday(date)) e2 = getCurrentMinutes();
    if (s2 === null || e2 === null || e2 <= s2) return 0;
    return e2 - s2;
  };
  const getTypeLabel = (row) => {
    const t2 = String(row.type || "");
    if ([
      "Day Start Time Off",
      "Attendance Time Off",
      "attendance-time-off",
      "day-start-time-off"
    ].includes(t2))
      return "Time Off";
    if (t2 === "Day Off" && row.leave_category === "comp_off") return "Comp Off";
    if (t2 === "Day Off" && row.leave_category === "on_duty") return "On Duty";
    return t2 || "-";
  };
  const flattenAttendanceData = (data) => Object.entries(data || {}).flatMap(
    ([key, rows]) => (rows || []).map((r2) => ({
      ...r2,
      date: r2.my_check_in_date || key
    }))
  );
  const getCsrfToken = () => {
    var _a;
    return ((_a = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a.getAttribute("content")) || "";
  };
  const getLoggedInUserId = () => {
    var _a, _b;
    const href = (_a = document.querySelector('a[href*="/users/"][href*="/profile"]')) == null ? void 0 : _a.getAttribute("href");
    return ((_b = href == null ? void 0 : href.match(/\/users\/(\d+)\/profile/)) == null ? void 0 : _b[1]) || "";
  };
  const getTimesheetRecordTitle = (row) => [row.project_name, row.module_name, row.task_name].filter(Boolean).join(" / ") || "-";
  const removePreviousArtifacts = () => {
    CONFIG.oldIds.forEach((id) => {
      var _a;
      return (_a = document.getElementById(id)) == null ? void 0 : _a.remove();
    });
  };
  function MonthPicker({
    currentOffset,
    onSelect
  }) {
    const months = buildMonthOptions(6);
    return /* @__PURE__ */ u$1("div", { class: "wls-month-picker", children: months.map((m2) => /* @__PURE__ */ u$1(
      "button",
      {
        class: `wls-month-btn${m2.offset === currentOffset ? " active" : ""}${m2.offset < 0 && m2.offset !== currentOffset ? " past" : ""}`,
        type: "button",
        title: m2.fullLabel,
        onClick: (e2) => {
          e2.stopPropagation();
          onSelect(m2.offset);
        },
        children: m2.label
      },
      m2.offset
    )) });
  }
  const TIMELINE_CONTAINER_IDS = [
    "my-checkin-detail",
    "checkin-detail",
    "all-checkin-detail",
    "all-check-in-detail"
  ];
  const BAR_CLASSES = ["htl-row-bg", "htl-wfo", "htl-wfh", "htl-timeoff", "htl-dayoff", "htl-other"];
  function getRgb(color) {
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!rgbMatch) return null;
    return {
      r: Number(rgbMatch[1]),
      g: Number(rgbMatch[2]),
      b: Number(rgbMatch[3])
    };
  }
  function getFill(rect) {
    const fill = (rect.getAttribute("fill") || "").trim().toLowerCase();
    if (fill && fill !== "none") return fill;
    return (getComputedStyle(rect).fill || "").trim().toLowerCase();
  }
  function isRowBackground(color) {
    if (!color || color === "none") return false;
    if (["#fff", "#ffffff", "white", "#f5f5f5", "#fafafa", "#f8f9fa", "#f1f5f9"].includes(color)) {
      return true;
    }
    const rgb = getRgb(color);
    if (!rgb) return false;
    return rgb.r >= 235 && rgb.g >= 235 && rgb.b >= 235;
  }
  function isTimeOffColor(color) {
    if (!color) return false;
    if (["#ff4f00", "#ff5000", "#f4511e", "#e24301", "#ff5722"].includes(color)) return true;
    const rgb = getRgb(color);
    if (!rgb) return false;
    return rgb.r >= 180 && rgb.g <= 120 && rgb.b <= 90;
  }
  function isDayOffColor(color) {
    if (!color) return false;
    if (["#cd0404", "#b91c1c", "#dc2626"].includes(color)) return true;
    const rgb = getRgb(color);
    if (!rgb) return false;
    return rgb.r >= 150 && rgb.g <= 60 && rgb.b <= 60;
  }
  function isWfoColor(color) {
    if (!color) return false;
    if (["#22914b", "#22c55e", "#16a34a", "#15803d", "#008000", "green"].includes(color)) {
      return true;
    }
    const rgb = getRgb(color);
    if (!rgb) return false;
    return rgb.g >= 110 && rgb.r <= 90 && rgb.b <= 120;
  }
  function isWfhColor(color) {
    if (!color) return false;
    if (["#0066cc", "#1976d2", "#2563eb", "#1d4ed8", "#0ea5e9", "blue"].includes(color)) {
      return true;
    }
    const rgb = getRgb(color);
    if (!rgb) return false;
    return rgb.b >= 140 && rgb.r <= 100 && rgb.g <= 170;
  }
  function classifyRect(rect) {
    const fill = getFill(rect);
    const width = Number(rect.getAttribute("width") || 0);
    const height = Number(rect.getAttribute("height") || 0);
    if (width < 1 || height < 1) return null;
    if (isRowBackground(fill)) return "htl-row-bg";
    const area = width * height;
    if (area < 8) return null;
    if (isWfoColor(fill)) return "htl-wfo";
    if (isWfhColor(fill)) return "htl-wfh";
    if (isTimeOffColor(fill)) return "htl-timeoff";
    if (isDayOffColor(fill)) return "htl-dayoff";
    if (fill && fill !== "none") return "htl-other";
    return null;
  }
  function themeTimelineContainer(container) {
    if (!container) return;
    container.querySelectorAll("svg rect").forEach((rect) => {
      rect.classList.remove(...BAR_CLASSES);
      const cls = classifyRect(rect);
      if (cls) rect.classList.add(cls);
    });
    container.querySelectorAll("svg text").forEach((text) => {
      text.classList.add("htl-label");
    });
    container.querySelectorAll("svg line, svg path").forEach((el) => {
      const fill = (el.getAttribute("fill") || "").toLowerCase();
      if (!fill || fill === "none") {
        el.classList.add("htl-grid");
      }
    });
  }
  function themeAllTimelines() {
    for (const id of TIMELINE_CONTAINER_IDS) {
      themeTimelineContainer(document.getElementById(id));
    }
  }
  function debounce(fn, ms = 120) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  }
  const scheduleTheme = debounce(themeAllTimelines);
  function initTimelineTheme() {
    if (window.__hubbleTimelineThemeInit) return;
    window.__hubbleTimelineThemeInit = true;
    const boot = () => {
      themeAllTimelines();
      const observer = new MutationObserver(() => {
        scheduleTheme();
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["fill", "width", "height"]
      });
      window.addEventListener("load", scheduleTheme);
    };
    if (document.body) boot();
    else document.addEventListener("DOMContentLoaded", boot);
  }
  const STORAGE_KEY = "hubble-theme";
  const MODES = ["system", "dark", "light", "ayu-mirage"];
  function getStoredMode() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return MODES.includes(stored || "") ? stored : "system";
  }
  function applyTheme(mode) {
    document.documentElement.dataset.hubbleTheme = mode;
  }
  const COLORS_STORAGE_KEY = "hubble-custom-colors";
  const ACCENT_KEYS = ["cyan", "purple", "pink", "green", "red", "yellow", "orange"];
  const HEX_COLOR_RE = /^#[0-9a-f]{6}$/i;
  function getCustomColors() {
    let parsed;
    try {
      parsed = JSON.parse(localStorage.getItem(COLORS_STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
    if (!parsed || typeof parsed !== "object") return {};
    const result = {};
    for (const key of ACCENT_KEYS) {
      const value = parsed[key];
      if (typeof value === "string" && HEX_COLOR_RE.test(value)) result[key] = value;
    }
    return result;
  }
  function applyCustomColors(colors = getCustomColors()) {
    const style = document.documentElement.style;
    for (const key of ACCENT_KEYS) {
      const value = colors[key];
      if (value) style.setProperty(`--dr-${key}`, value);
      else style.removeProperty(`--dr-${key}`);
    }
  }
  function initTheme() {
    if (window.__hubbleThemeInit) return;
    window.__hubbleThemeInit = true;
    applyTheme(getStoredMode());
    applyCustomColors();
    const boot = () => {
      applyTheme(getStoredMode());
      applyCustomColors();
      initTimelineTheme();
    };
    if (document.body) boot();
    else document.addEventListener("DOMContentLoaded", boot);
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if (getStoredMode() === "system") applyTheme("system");
    });
  }
  const getOrCreateCard = () => {
    let card2 = document.getElementById(CONFIG.cardId);
    if (card2) return card2;
    card2 = document.createElement("div");
    card2.id = CONFIG.cardId;
    const notifyEl = document.getElementById("notify_my_check_in_data");
    const checkinDetail = document.getElementById("my-checkin-detail");
    if (notifyEl == null ? void 0 : notifyEl.parentElement) notifyEl.parentElement.insertBefore(card2, notifyEl);
    else if (checkinDetail == null ? void 0 : checkinDetail.parentElement)
      checkinDetail.parentElement.insertBefore(card2, checkinDetail);
    else document.body.prepend(card2);
    return card2;
  };
  const initDom = () => {
    removePreviousArtifacts();
    getOrCreateCard();
  };
  const fetchCheckInData = async (offset = 0) => {
    const { startDate, endDate } = getMonthRange(offset);
    const url = new URL(CONFIG.checkInApiUrl);
    url.searchParams.set("start_date", startDate);
    url.searchParams.set("end_date", endDate);
    const res = await fetch(url.toString(), {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" }
    });
    if (!res.ok) throw new Error(`Check-in API failed: ${res.status}`);
    const result = await res.json();
    return { startDate, endDate, rows: flattenAttendanceData(result.data || {}) };
  };
  const buildTimesheetBody = ({
    startDate,
    endDate,
    userId,
    userParamMode
  }) => {
    const body = new URLSearchParams();
    body.append("group_by", "date");
    body.append("start_date", startDate);
    body.append("end_date", endDate);
    body.append("un_approved_entries", "false");
    if (userId)
      body.append(userParamMode === "array" ? "filter_user_id[]" : "filter_user_id", userId);
    return body;
  };
  const requestTimesheetPage = async ({
    url,
    startDate,
    endDate,
    userId,
    userParamMode
  }) => {
    const csrf = getCsrfToken();
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest"
    };
    if (csrf) headers["X-CSRF-TOKEN"] = csrf;
    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers,
      body: buildTimesheetBody({ startDate, endDate, userId, userParamMode })
    });
    if (!res.ok) throw new Error(`Timesheet API failed: ${res.status}`);
    return res.json();
  };
  const fetchTimesheetAllPagesWithMode = async ({
    startDate,
    endDate,
    userId,
    userParamMode
  }) => {
    let nextUrl = CONFIG.timesheetApiUrl;
    let page = 0;
    const allRows = [];
    while (nextUrl && page < CONFIG.maxTimesheetPages) {
      page++;
      const res = await requestTimesheetPage({
        url: nextUrl,
        startDate,
        endDate,
        userId,
        userParamMode
      });
      const p2 = res.pages || {};
      allRows.push(...Array.isArray(p2.data) ? p2.data : []);
      nextUrl = p2.next_page_url ? new URL(p2.next_page_url, window.location.origin).toString() : "";
    }
    return { rows: allRows, pagesFetched: page };
  };
  const fetchTimesheetAllPages = async ({
    startDate,
    endDate
  }) => {
    const userId = getLoggedInUserId();
    try {
      return await fetchTimesheetAllPagesWithMode({
        startDate,
        endDate,
        userId,
        userParamMode: "array"
      });
    } catch {
      return fetchTimesheetAllPagesWithMode({ startDate, endDate, userId, userParamMode: "scalar" });
    }
  };
  const groupCheckIn = (rows) => {
    const dayMap = /* @__PURE__ */ new Map();
    const timeOffRows = [];
    const dayOffRows = [];
    const ensureDay = (dateKey, dateObj) => {
      if (!dayMap.has(dateKey)) {
        dayMap.set(dateKey, {
          dateKey,
          dateObj,
          workMinutes: 0,
          timeOffMinutes: 0,
          workRecords: [],
          timeOffRecords: []
        });
      }
      return dayMap.get(dateKey);
    };
    rows.forEach((row) => {
      const dateObj = parseDate(row.date);
      if (!dateObj) return;
      const dateKey = toYMD(dateObj);
      const typeLabel = getTypeLabel(row);
      const rawType = String(row.type || "");
      const day = ensureDay(dateKey, dateObj);
      const isTimeOff = CONFIG.timeOffTypes.has(rawType) || CONFIG.timeOffTypes.has(typeLabel);
      const isWork = CONFIG.workTypes.has(rawType) || CONFIG.workTypes.has(typeLabel);
      const isDayOff = rawType === "Day Off" || CONFIG.dayOffLabels.has(typeLabel);
      if (isWork) {
        const minutes = getDurationMinutes(row.start_time, row.end_time, dateObj, true);
        if (minutes > 0) {
          const rec = {
            date: dateKey,
            type: typeLabel,
            start: String(row.start_time || ""),
            end: String(row.end_time || (isToday(dateObj) ? "Now" : "-")),
            minutes
          };
          day.workMinutes += minutes;
          day.workRecords.push(rec);
        }
      }
      if (isTimeOff) {
        const minutes = getDurationMinutes(row.start_time, row.end_time, dateObj, false);
        if (minutes > 0) {
          const rec = {
            date: dateKey,
            type: typeLabel,
            start: String(row.start_time || ""),
            end: String(row.end_time || ""),
            minutes
          };
          day.timeOffMinutes += minutes;
          day.timeOffRecords.push(rec);
          timeOffRows.push(rec);
        }
      }
      if (isDayOff && !dayOffRows.some((x2) => x2.date === dateKey && x2.type === typeLabel)) {
        dayOffRows.push({ date: dateKey, type: typeLabel });
      }
    });
    const dayRows = Array.from(dayMap.values()).sort((a2, b2) => a2.dateKey.localeCompare(b2.dateKey));
    const extraRows = dayRows.map((day) => {
      const isWeekend = CONFIG.weekendDays.includes(day.dateObj.getDay());
      const expectedMinutes = isWeekend ? 0 : Math.max(0, CONFIG.workDayMinutes - day.timeOffMinutes);
      let extraMinutes = 0;
      let reason = "";
      if (isWeekend && day.workMinutes > 0) {
        extraMinutes = day.workMinutes;
        reason = "Weekend work";
      } else if (!isWeekend && day.workMinutes > expectedMinutes) {
        extraMinutes = day.workMinutes - expectedMinutes;
        reason = day.timeOffMinutes > 0 ? "Worked above adjusted target" : "Worked more than 8h";
      }
      return {
        date: day.dateKey,
        workedMinutes: day.workMinutes,
        timeOffMinutes: day.timeOffMinutes,
        expectedMinutes,
        extraMinutes,
        reason,
        workRecords: day.workRecords
      };
    }).filter((r2) => r2.extraMinutes > 0);
    const totalTimeOffMinutes = timeOffRows.reduce((s2, r2) => s2 + r2.minutes, 0);
    const totalExtraWorkedMinutes = extraRows.reduce((s2, r2) => s2 + r2.extraMinutes, 0);
    const totalCheckInWorkMinutes = dayRows.reduce((s2, r2) => s2 + r2.workMinutes, 0);
    return {
      dayMap,
      dayRows,
      timeOffRows: timeOffRows.sort(
        (a2, b2) => a2.date.localeCompare(b2.date) || String(a2.start).localeCompare(String(b2.start))
      ),
      extraRows,
      dayOffRows: dayOffRows.sort((a2, b2) => a2.date.localeCompare(b2.date)),
      totalTimeOffMinutes,
      totalExtraWorkedMinutes,
      totalCheckInWorkMinutes,
      pendingMinutes: Math.max(0, totalTimeOffMinutes - totalExtraWorkedMinutes),
      surplusMinutes: Math.max(0, totalExtraWorkedMinutes - totalTimeOffMinutes),
      dayOffCount: new Set(dayOffRows.map((r2) => r2.date)).size
    };
  };
  const groupTimesheet = ({
    rows,
    startDate,
    endDate
  }) => {
    const userId = getLoggedInUserId();
    const dayMap = /* @__PURE__ */ new Map();
    const records = [];
    rows.forEach((raw) => {
      const row = raw;
      if (userId && row.user_id && String(row.user_id) !== String(userId)) return;
      const dateObj = parseDate(row.entry_date || row.date);
      if (!dateObj) return;
      const dateKey = toYMD(dateObj);
      if (dateKey < startDate || dateKey > endDate) return;
      const minutes = parseTimesheetDurationToMinutes(row.working_hours);
      if (!dayMap.has(dateKey)) {
        dayMap.set(dateKey, { date: dateKey, minutes: 0, recordsCount: 0, records: [] });
      }
      const rec = {
        id: row.id,
        date: dateKey,
        title: getTimesheetRecordTitle(row),
        project: String(row.project_name || "-"),
        module: String(row.module_name || "-"),
        task: String(row.task_name || "-"),
        description: String(row.description || "-"),
        minutes,
        rawWorkingHours: row.working_hours
      };
      const day = dayMap.get(dateKey);
      day.minutes += minutes;
      day.recordsCount += 1;
      day.records.push(rec);
      records.push(rec);
    });
    const dayRows = Array.from(dayMap.values()).sort((a2, b2) => a2.date.localeCompare(b2.date));
    return {
      dayMap,
      dayRows,
      records: records.sort(
        (a2, b2) => a2.date.localeCompare(b2.date) || String(a2.id || "").localeCompare(String(b2.id || ""))
      ),
      totalMinutes: dayRows.reduce((s2, r2) => s2 + r2.minutes, 0)
    };
  };
  const buildComparison = ({
    checkInSummary,
    timesheetSummary
  }) => {
    const dates = /* @__PURE__ */ new Set();
    checkInSummary.dayRows.forEach((r2) => {
      if (r2.workMinutes > 0 || r2.timeOffMinutes > 0) dates.add(r2.dateKey);
    });
    timesheetSummary.dayRows.forEach((r2) => {
      if (r2.minutes > 0) dates.add(r2.date);
    });
    const rows = Array.from(dates).sort().map((date) => {
      const ci = checkInSummary.dayMap.get(date);
      const ts = timesheetSummary.dayMap.get(date);
      const isTodayRow = isToday(parseDate(date));
      const ciMin = (ci == null ? void 0 : ci.workMinutes) || 0;
      const toMin = (ci == null ? void 0 : ci.timeOffMinutes) || 0;
      const tsMin = (ts == null ? void 0 : ts.minutes) || 0;
      let status = "OK";
      let statusClass = "t-ok";
      if (isTodayRow) {
        status = "Skipped today";
        statusClass = "t-skip";
      } else {
        const match = roundedHour(ciMin) === roundedHour(tsMin);
        status = match ? "OK" : "Mismatch";
        statusClass = match ? "t-ok" : "t-bad";
      }
      return {
        date,
        checkInMinutes: ciMin,
        timeOffMinutes: toMin,
        timesheetMinutes: tsMin,
        diffMinutes: tsMin - ciMin,
        roundedCheckInHours: roundedHour(ciMin),
        roundedTimesheetHours: roundedHour(tsMin),
        isTodayRow: !!isTodayRow,
        isMatch: statusClass === "t-ok",
        status,
        statusClass,
        timesheetRecords: (ts == null ? void 0 : ts.records) || []
      };
    });
    const mismatchRows = rows.filter(
      (r2) => !r2.isTodayRow && !r2.isMatch
    );
    return { rows, mismatchRows, mismatchCount: mismatchRows.length };
  };
  const loadViewState = async (monthOffset) => {
    try {
      const checkInResult = await fetchCheckInData(monthOffset);
      const checkInSummary = groupCheckIn(checkInResult.rows);
      let timesheetSummary = {
        dayMap: /* @__PURE__ */ new Map(),
        dayRows: [],
        records: [],
        totalMinutes: 0
      };
      let comparison = { rows: [], mismatchRows: [], mismatchCount: 0 };
      let timesheetError = "";
      try {
        const tsResult = await fetchTimesheetAllPages({
          startDate: checkInResult.startDate,
          endDate: checkInResult.endDate
        });
        timesheetSummary = groupTimesheet({
          rows: tsResult.rows,
          startDate: checkInResult.startDate,
          endDate: checkInResult.endDate
        });
        comparison = buildComparison({ checkInSummary, timesheetSummary });
      } catch (err) {
        timesheetError = err instanceof Error ? err.message : "Unable to fetch timesheet data.";
      }
      return {
        kind: "success",
        monthOffset,
        startDate: checkInResult.startDate,
        endDate: checkInResult.endDate,
        checkInSummary,
        timesheetSummary,
        comparison,
        timesheetError
      };
    } catch (err) {
      return {
        kind: "error",
        monthOffset,
        message: err instanceof Error ? err.message : "Unable to calculate work log summary."
      };
    }
  };
  const renderTable = ({
    columns,
    rows,
    emptyText
  }) => {
    if (!rows.length) return `<div class="wls-empty">${escapeHtml(emptyText || "No records.")}</div>`;
    return `<div class="wls-table-wrap"><table><thead><tr>${columns.map((c2) => `<th>${escapeHtml(c2.label)}</th>`).join("")}</tr></thead><tbody>${rows.map(
    (r2) => `<tr>${columns.map((c2) => `<td>${c2.html ? c2.render(r2) : escapeHtml(c2.render(r2))}</td>`).join("")}</tr>`
  ).join("")}</tbody></table></div>`;
  };
  const kpiColors = [
    "kpi-purple",
    "kpi-blue",
    "kpi-green",
    "kpi-amber",
    "kpi-slate",
    "kpi-purple",
    "kpi-blue",
    "kpi-amber"
  ];
  const renderKpis = (items) => `<div class="wls-kpi-row">${items.map(
  (x2, i2) => `<div class="wls-kpi ${kpiColors[i2 % kpiColors.length]}"><div class="wls-kpi-label">${escapeHtml(x2.label)}</div><div class="wls-kpi-value">${escapeHtml(x2.value)}</div></div>`
).join("")}</div>`;
  const sectionLabel = (ico, text) => `<div class="wls-section-label">${icon(ico, 13)} ${escapeHtml(text)}</div>`;
  const buildDetailsHtml = ({
    checkInSummary,
    timesheetSummary,
    comparison,
    timesheetError,
    status
  }) => {
    const yetToLog = Math.max(
      0,
      checkInSummary.totalCheckInWorkMinutes - timesheetSummary.totalMinutes
    );
    return `
    ${renderKpis([
    { label: "Status", value: status.label.replace(/\s[\S]*$/, "").trim() },
    { label: "Time-off taken", value: formatMinutes(checkInSummary.totalTimeOffMinutes) },
    { label: "Compensated", value: formatMinutes(checkInSummary.totalExtraWorkedMinutes) },
    { label: "Pending comp.", value: formatMinutes(checkInSummary.pendingMinutes) },
    { label: "Worked (check-in)", value: formatMinutes(checkInSummary.totalCheckInWorkMinutes) },
    {
      label: "Logged (timesheet)",
      value: timesheetError ? "API error" : formatMinutes(timesheetSummary.totalMinutes)
    },
    { label: "Yet to log", value: timesheetError ? "–" : formatMinutes(yetToLog) },
    { label: "Day-offs", value: String(checkInSummary.dayOffCount) }
  ])}
    <div class="wls-insight-row">
      <div class="wls-insight"><b>Overall:</b> ${status.message}</div>
      <div class="wls-insight"><b>Compensation:</b> Took ${escapeHtml(formatMinutes(checkInSummary.totalTimeOffMinutes))} time-off, compensated ${escapeHtml(formatMinutes(checkInSummary.totalExtraWorkedMinutes))}. ${checkInSummary.pendingMinutes > 0 ? `<b>${escapeHtml(formatMinutes(checkInSummary.pendingMinutes))}</b> pending.` : "Fully balanced ✓"}</div>
      <div class="wls-insight"><b>Timesheet:</b> Worked ${escapeHtml(formatMinutes(checkInSummary.totalCheckInWorkMinutes))}, logged ${escapeHtml(timesheetError ? "API error" : formatMinutes(timesheetSummary.totalMinutes))}. ${timesheetError ? "" : yetToLog > 0 ? `<b>${escapeHtml(formatMinutes(yetToLog))}</b> yet to log.` : "Fully logged ✓"}</div>
    </div>
    <div class="wls-modal-divider"></div>
    ${timesheetError ? `${sectionLabel("report", "Timesheet API error")}<div class="wls-error-box">${escapeHtml(timesheetError)}</div>` : `
          <div>${sectionLabel("table", "Worked vs logged")}${renderTable({
    emptyText: "No data.",
    columns: [
      { label: "Date", render: (r2) => formatDisplayDate(r2.date) },
      {
        label: "Worked",
        render: (r2) => `${formatMinutes(r2.checkInMinutes)} (${r2.roundedCheckInHours}h)`
      },
      {
        label: "Logged",
        render: (r2) => `${formatMinutes(r2.timesheetMinutes)} (${r2.roundedTimesheetHours}h)`
      },
      { label: "Gap", render: (r2) => formatSignedMinutes(r2.diffMinutes) },
      {
        label: "Status",
        html: true,
        render: (r2) => `<span class="${r2.statusClass}">${escapeHtml(r2.status)}</span>`
      }
    ],
    rows: comparison.rows
  })}</div>
          <div>${sectionLabel("warn", "Mismatches — needs attention")}${renderTable({
    emptyText: "No mismatches! 🎉",
    columns: [
      { label: "Date", render: (r2) => formatDisplayDate(r2.date) },
      {
        label: "Worked",
        render: (r2) => `${formatMinutes(r2.checkInMinutes)} (${r2.roundedCheckInHours}h)`
      },
      {
        label: "Logged",
        render: (r2) => `${formatMinutes(r2.timesheetMinutes)} (${r2.roundedTimesheetHours}h)`
      },
      { label: "Gap", render: (r2) => formatSignedMinutes(r2.diffMinutes) }
    ],
    rows: comparison.mismatchRows
  })}</div>`}
    <div>${sectionLabel("clock", "Time-off taken")}${renderTable({
    emptyText: "No time-off records.",
    columns: [
      { label: "Date", render: (r2) => formatDisplayDate(r2.date) },
      { label: "Start", render: (r2) => r2.start || "–" },
      { label: "End", render: (r2) => r2.end || "–" },
      { label: "Duration", render: (r2) => formatMinutes(r2.minutes) }
    ],
    rows: checkInSummary.timeOffRows
  })}</div>
    <div>${sectionLabel("plus", "Compensated / extra worked")}${renderTable({
    emptyText: "No extra work.",
    columns: [
      { label: "Date", render: (r2) => formatDisplayDate(r2.date) },
      { label: "Worked", render: (r2) => formatMinutes(r2.workedMinutes) },
      { label: "Time-off", render: (r2) => formatMinutes(r2.timeOffMinutes) },
      { label: "Expected", render: (r2) => formatMinutes(r2.expectedMinutes) },
      { label: "Compensated", render: (r2) => formatMinutes(r2.extraMinutes) },
      { label: "Reason", render: (r2) => r2.reason }
    ],
    rows: checkInSummary.extraRows
  })}</div>
    <div>${sectionLabel("cal", "Day-offs")}${renderTable({
    emptyText: "No day-offs.",
    columns: [
      { label: "Date", render: (r2) => formatDisplayDate(r2.date) },
      { label: "Type", render: (r2) => r2.type }
    ],
    rows: checkInSummary.dayOffRows
  })}</div>
    ${timesheetError ? "" : ` <div>${sectionLabel("entries", "Timesheet entries")}${renderTable({
    emptyText: "No entries.",
    columns: [
      { label: "Date", render: (r2) => formatDisplayDate(r2.date) },
      { label: "Project / Module / Task", render: (r2) => r2.title },
      { label: "Logged", render: (r2) => formatMinutes(r2.minutes) },
      { label: "Description", render: (r2) => stripHtml(r2.description).slice(0, 160) }
    ],
    rows: timesheetSummary.records
  })}</div>`}`;
  };
  const setupPopover = () => {
    const existing = document.getElementById("wls-popover-el");
    if (existing) return existing;
    const el = document.createElement("div");
    el.id = "wls-popover-el";
    el.hidden = true;
    el.innerHTML = `<div class="pop-title"></div><div class="pop-rows"></div><div class="pop-note"></div><div class="pop-hint">Click to see full breakdown →</div>`;
    document.body.appendChild(el);
    return el;
  };
  const showPopover = (anchorEl, data, hasModalKey = false) => {
    const el = setupPopover();
    const titleEl = el.querySelector(".pop-title");
    const rowsEl = el.querySelector(".pop-rows");
    const noteEl = el.querySelector(".pop-note");
    const hintEl = el.querySelector(".pop-hint");
    if (titleEl) titleEl.textContent = data.title || "";
    if (rowsEl) {
      rowsEl.innerHTML = (data.rows || []).map(
        (r2) => `<div class="pop-row"><span class="pop-lbl">${escapeHtml(r2.label)}</span><span class="pop-val">${escapeHtml(r2.value)}</span></div>`
      ).join("");
    }
    if (noteEl) {
      if (data.note) {
        noteEl.textContent = data.note;
        noteEl.style.display = "";
      } else noteEl.style.display = "none";
    }
    if (hintEl) hintEl.style.display = hasModalKey ? "" : "none";
    el.hidden = false;
    const rect = anchorEl.getBoundingClientRect();
    const ew = el.offsetWidth || 220;
    const eh = el.offsetHeight || 90;
    let left = rect.left + rect.width / 2 - ew / 2;
    const top = rect.top + window.scrollY - eh - 10;
    left = Math.max(8, Math.min(left, window.innerWidth - ew - 8));
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
  };
  const hidePopover = () => {
    const el = document.getElementById("wls-popover-el");
    if (el) el.hidden = true;
  };
  const attachPopovers = (container) => {
    container.querySelectorAll("[data-pop]").forEach((el) => {
      let t2;
      el.addEventListener("mouseenter", () => {
        clearTimeout(t2);
        try {
          t2 = setTimeout(() => {
            showPopover(
              el,
              JSON.parse(el.getAttribute("data-pop") || "{}"),
              !!el.dataset.modalKey
            );
          }, 130);
        } catch {
        }
      });
      el.addEventListener("mouseleave", () => {
        clearTimeout(t2);
        hidePopover();
      });
    });
  };
  const serializePop = (data) => JSON.stringify(data);
  let appState = null;
  const setMiniModalState = (state) => {
    appState = state;
  };
  const setupMiniModal = () => {
    var _a, _b;
    const existing = document.getElementById("wls-mini-modal-el");
    if (existing) return existing;
    const el = document.createElement("div");
    el.id = "wls-mini-modal-el";
    el.innerHTML = `<div class="wmm-backdrop"><div class="wmm-box"><div class="wmm-head"><div><div class="wmm-title"></div><div class="wmm-sub"></div></div><button class="wmm-close" type="button">${icon("close", 13)} Close</button></div><div class="wmm-body"></div></div></div>`;
    document.body.appendChild(el);
    (_a = el.querySelector(".wmm-backdrop")) == null ? void 0 : _a.addEventListener("click", (e2) => {
      if (e2.target === e2.currentTarget) hideMiniModal();
    });
    (_b = el.querySelector(".wmm-close")) == null ? void 0 : _b.addEventListener("click", hideMiniModal);
    return el;
  };
  const hideMiniModal = () => {
    var _a;
    (_a = document.getElementById("wls-mini-modal-el")) == null ? void 0 : _a.classList.remove("wls-mm-open");
  };
  const mmKpis = (items) => {
    const colors = ["kpi-purple", "kpi-blue", "kpi-green", "kpi-amber", "kpi-slate", "kpi-red"];
    return `<div class="wls-kpi-row">${items.map(
    (x2, i2) => `<div class="wls-kpi ${colors[i2 % colors.length]}"><div class="wls-kpi-label">${escapeHtml(x2.label)}</div><div class="wls-kpi-value">${escapeHtml(x2.value)}</div></div>`
  ).join("")}</div>`;
  };
  const buildMiniModalContent = (key) => {
    if (!appState) return null;
    const { checkInSummary, timesheetSummary, comparison, timesheetError } = appState;
    switch (key) {
      case "pending":
        return {
          title: "Compensation balance",
          sub: "Time-off taken vs extra hours worked",
          body: `
          ${mmKpis([
          { label: "Time-off taken", value: formatMinutes(checkInSummary.totalTimeOffMinutes) },
          { label: "Compensated", value: formatMinutes(checkInSummary.totalExtraWorkedMinutes) },
          { label: "Still pending", value: formatMinutes(checkInSummary.pendingMinutes) }
        ])}
          <div>${sectionLabel("clock", "Time-off records")}${renderTable({
          emptyText: "No time-off records.",
          columns: [
            { label: "Date", render: (r2) => formatDisplayDate(r2.date) },
            { label: "Start", render: (r2) => r2.start || "–" },
            { label: "End", render: (r2) => r2.end || "–" },
            { label: "Duration", render: (r2) => formatMinutes(r2.minutes) }
          ],
          rows: checkInSummary.timeOffRows
        })}</div>
          <div>${sectionLabel("plus", "Extra work / compensated sessions")}${renderTable({
          emptyText: "No extra work records.",
          columns: [
            { label: "Date", render: (r2) => formatDisplayDate(r2.date) },
            { label: "Worked", render: (r2) => formatMinutes(r2.workedMinutes) },
            { label: "Expected", render: (r2) => formatMinutes(r2.expectedMinutes) },
            { label: "Extra", render: (r2) => formatMinutes(r2.extraMinutes) },
            { label: "Reason", render: (r2) => r2.reason }
          ],
          rows: checkInSummary.extraRows
        })}</div>`
        };
      case "timeoff":
        return {
          title: "Time-off taken",
          sub: `${checkInSummary.timeOffRows.length} record(s) · Total ${formatMinutes(checkInSummary.totalTimeOffMinutes)}`,
          body: renderTable({
            emptyText: "No time-off records.",
            columns: [
              { label: "Date", render: (r2) => formatDisplayDate(r2.date) },
              { label: "Type", render: (r2) => r2.type },
              { label: "Start", render: (r2) => r2.start || "–" },
              { label: "End", render: (r2) => r2.end || "–" },
              { label: "Duration", render: (r2) => formatMinutes(r2.minutes) }
            ],
            rows: checkInSummary.timeOffRows
          })
        };
      case "compensated":
        return {
          title: "Extra work & compensation earned",
          sub: `${checkInSummary.extraRows.length} session(s) · Total ${formatMinutes(checkInSummary.totalExtraWorkedMinutes)}`,
          body: renderTable({
            emptyText: "No extra work recorded.",
            columns: [
              { label: "Date", render: (r2) => formatDisplayDate(r2.date) },
              { label: "Worked", render: (r2) => formatMinutes(r2.workedMinutes) },
              { label: "Time-off adj.", render: (r2) => formatMinutes(r2.timeOffMinutes) },
              { label: "Expected", render: (r2) => formatMinutes(r2.expectedMinutes) },
              { label: "Compensated", render: (r2) => formatMinutes(r2.extraMinutes) },
              { label: "Reason", render: (r2) => r2.reason }
            ],
            rows: checkInSummary.extraRows
          })
        };
      case "worked":
        return {
          title: "Hours worked — check-in breakdown",
          sub: `Total ${formatMinutes(checkInSummary.totalCheckInWorkMinutes)} across ${checkInSummary.dayRows.filter((d2) => d2.workMinutes > 0).length} days`,
          body: renderTable({
            emptyText: "No work records.",
            columns: [
              { label: "Date", render: (r2) => formatDisplayDate(r2.dateKey) },
              { label: "Worked", render: (r2) => formatMinutes(r2.workMinutes) },
              { label: "Time-off that day", render: (r2) => formatMinutes(r2.timeOffMinutes) },
              { label: "Sessions", render: (r2) => String(r2.workRecords.length) }
            ],
            rows: checkInSummary.dayRows.filter((d2) => d2.workMinutes > 0)
          })
        };
      case "logged":
        return {
          title: "Worked vs logged — day by day",
          sub: timesheetError ? "Timesheet unavailable" : `${comparison.rows.length} days compared · ${formatMinutes(timesheetSummary.totalMinutes)} total logged`,
          body: timesheetError ? `<div class="wls-error-box">${escapeHtml(timesheetError)}</div>` : renderTable({
            emptyText: "No data.",
            columns: [
              { label: "Date", render: (r2) => formatDisplayDate(r2.date) },
              {
                label: "Worked",
                render: (r2) => `${formatMinutes(r2.checkInMinutes)} (${r2.roundedCheckInHours}h)`
              },
              {
                label: "Logged",
                render: (r2) => `${formatMinutes(r2.timesheetMinutes)} (${r2.roundedTimesheetHours}h)`
              },
              { label: "Gap", render: (r2) => formatSignedMinutes(r2.diffMinutes) },
              {
                label: "Status",
                html: true,
                render: (r2) => `<span class="${r2.statusClass}">${escapeHtml(r2.status)}</span>`
              }
            ],
            rows: comparison.rows
          })
        };
      case "mismatches":
        return {
          title: "Days with mismatch",
          sub: `${comparison.mismatchCount} day(s) where logged ≠ worked (rounded hour)`,
          body: renderTable({
            emptyText: "No mismatches — everything lines up! 🎉",
            columns: [
              { label: "Date", render: (r2) => formatDisplayDate(r2.date) },
              {
                label: "Worked",
                render: (r2) => `${formatMinutes(r2.checkInMinutes)} (${r2.roundedCheckInHours}h)`
              },
              {
                label: "Logged",
                render: (r2) => `${formatMinutes(r2.timesheetMinutes)} (${r2.roundedTimesheetHours}h)`
              },
              { label: "Gap", render: (r2) => formatSignedMinutes(r2.diffMinutes) }
            ],
            rows: comparison.mismatchRows
          })
        };
      case "dayoffs":
        return {
          title: "Day-offs this month",
          sub: `${checkInSummary.dayOffCount} day(s) off recorded`,
          body: renderTable({
            emptyText: "No day-offs recorded.",
            columns: [
              { label: "Date", render: (r2) => formatDisplayDate(r2.date) },
              { label: "Type", render: (r2) => r2.type }
            ],
            rows: checkInSummary.dayOffRows
          })
        };
      default:
        return null;
    }
  };
  const showMiniModal = (key) => {
    const content = buildMiniModalContent(key);
    if (!content) return;
    const el = setupMiniModal();
    const titleEl = el.querySelector(".wmm-title");
    const subEl = el.querySelector(".wmm-sub");
    const bodyEl = el.querySelector(".wmm-body");
    if (titleEl) titleEl.textContent = content.title;
    if (subEl) subEl.textContent = content.sub || "";
    if (bodyEl) bodyEl.innerHTML = content.body;
    el.classList.add("wls-mm-open");
  };
  const attachModalClicks = (container) => {
    container.addEventListener("click", (e2) => {
      if (e2.target.closest("button")) return;
      const trigger = e2.target.closest("[data-modal-key]");
      if (!trigger) return;
      hidePopover();
      showMiniModal(trigger.dataset.modalKey || "");
    });
  };
  const getOverallStatus = ({
    checkInSummary,
    timesheetSummary,
    comparison,
    timesheetError
  }) => {
    if (timesheetError) {
      return {
        label: "Flying blind",
        accentClass: "accent-muted",
        badgeClass: "badge-muted",
        summaryClass: "summary-muted",
        slabelClass: "slabel-muted",
        icon: "muted",
        message: `Timesheet API went quiet, so the logged-vs-worked picture is fuzzy right now. Your <strong>compensation math still works</strong> — it's running entirely on check-in data. Grab a coffee and hit Refresh in a bit.`
      };
    }
    const yetToLog = Math.max(
      0,
      checkInSummary.totalCheckInWorkMinutes - timesheetSummary.totalMinutes
    );
    const overLogged = Math.max(
      0,
      timesheetSummary.totalMinutes - checkInSummary.totalCheckInWorkMinutes
    );
    const gap = Math.max(yetToLog, overLogged);
    const pending = checkInSummary.pendingMinutes;
    const mismatches = comparison.mismatchCount;
    if (mismatches === 0 && pending === 0) {
      return {
        label: "Squeaky clean ✨",
        accentClass: "accent-good",
        badgeClass: "badge-good",
        summaryClass: "summary-good",
        slabelClass: "slabel-good",
        icon: "check",
        message: `Everything lines up — check-ins, timesheet, and compensation are all singing the same tune. <strong>Nothing left to fix.</strong> Go touch some grass.`
      };
    }
    if (gap <= 60 && pending <= 60) {
      const bits = [];
      if (gap > 0) bits.push(`<em>${formatMinutes(gap)}</em> to sort in your timesheet`);
      if (pending > 0) bits.push(`<em>${formatMinutes(pending)}</em> of uncompensated time-off`);
      return {
        label: "So close 👀",
        accentClass: "accent-warn",
        badgeClass: "badge-warn",
        summaryClass: "summary-warn",
        slabelClass: "slabel-warn",
        icon: "warn",
        message: `You're <strong>embarrassingly close to perfect</strong> — just ${bits.join(" and ")} standing in the way of a clean slate. One quick pass and you're golden.`
      };
    }
    if (gap <= 4 * 60 || mismatches <= 4) {
      const bits = [];
      if (mismatches > 0)
        bits.push(
          `<strong>${mismatches} day${mismatches > 1 ? "s" : ""}</strong> where logged hours don't match what you worked`
        );
      if (pending > 0)
        bits.push(`<em>${formatMinutes(pending)}</em> of time-off still waiting to be compensated`);
      return {
        label: "Needs some love 🛠",
        accentClass: "accent-mismatch",
        badgeClass: "badge-mismatch",
        summaryClass: "summary-mismatch",
        slabelClass: "slabel-mismatch",
        icon: "warn",
        message: `Getting there, but not quite. You've got ${bits.join(", plus ")}. A focused <strong>10-minute cleanup</strong> in the timesheet should sort this right out.`
      };
    }
    const logNote = yetToLog > overLogged ? `<em>${formatMinutes(yetToLog)}</em> of worked time hasn't made it into the timesheet yet` : `<em>${formatMinutes(overLogged)}</em> is logged in excess of what check-in recorded`;
    return {
      label: "Gone rogue 🚨",
      accentClass: "accent-bad",
      badgeClass: "badge-bad",
      summaryClass: "summary-bad",
      slabelClass: "slabel-bad",
      icon: "error",
      message: `Your timesheet and check-ins are living completely separate lives. ${logNote}, and there are <strong>${mismatches} mismatched day${mismatches !== 1 ? "s" : ""}</strong> on record. This one needs a proper sit-down to untangle.`
    };
  };
  const pop = serializePop;
  function WorkLogSummary() {
    const [monthOffset, setMonthOffset] = d(0);
    const [isExpanded, setIsExpanded] = d(false);
    const [view, setView] = d({ kind: "loading", monthOffset: 0 });
    const [detailsOpen, setDetailsOpen] = d(false);
    const cardRef = A(null);
    const refresh = async (offset) => {
      setView({ kind: "loading", monthOffset: offset });
      const result = await loadViewState(offset);
      setView(result);
      if (result.kind === "success") {
        setMiniModalState({
          checkInSummary: result.checkInSummary,
          timesheetSummary: result.timesheetSummary,
          comparison: result.comparison,
          timesheetError: result.timesheetError
        });
      }
    };
    const selectMonth = (offset) => {
      if (offset !== monthOffset) {
        setMonthOffset(offset);
        refresh(offset);
      }
    };
    h(() => {
      refresh(monthOffset);
      const onKey = (e2) => {
        if (e2.key !== "Escape") return;
        setDetailsOpen(false);
        hideMiniModal();
        hidePopover();
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, []);
    h(() => {
      if (view.kind !== "success" || !cardRef.current) return;
      attachPopovers(cardRef.current);
      attachModalClicks(cardRef.current);
      const fill = cardRef.current.querySelector(".wls-prog-fill");
      if (fill) fill.style.width = `${Math.min(100, Number(fill.dataset.pct))}%`;
    }, [view]);
    h(() => {
      var _a;
      (_a = document.getElementById(CONFIG.cardId)) == null ? void 0 : _a.classList.toggle("wls-expanded", isExpanded);
    }, [isExpanded]);
    let content;
    if (view.kind === "loading") {
      const range = getMonthRange(view.monthOffset);
      content = /* @__PURE__ */ u$1("div", { class: "wls-card", children: [
        /* @__PURE__ */ u$1("div", { class: "wls-accent accent-muted" }),
        /* @__PURE__ */ u$1("div", { class: "wls-top-row", style: "cursor:default", children: [
          /* @__PURE__ */ u$1("div", { class: "wls-title", children: "Work log summary" }),
          /* @__PURE__ */ u$1(MonthPicker, { currentOffset: monthOffset, onSelect: selectMonth }),
          /* @__PURE__ */ u$1("div", { class: "wls-top-right", children: /* @__PURE__ */ u$1("span", { class: "wls-range", children: [
            formatDisplayDate(range.startDate),
            " – ",
            formatDisplayDate(range.endDate)
          ] }) })
        ] }),
        /* @__PURE__ */ u$1("div", { class: "wls-loading", children: [
          /* @__PURE__ */ u$1("div", { class: "wls-spinner" }),
          "Crunching data for ",
          getMonthRange(view.monthOffset).startDate.slice(0, 7),
          "…"
        ] })
      ] });
    } else if (view.kind === "error") {
      const range = getMonthRange(view.monthOffset);
      content = /* @__PURE__ */ u$1("div", { class: "wls-card", children: [
        /* @__PURE__ */ u$1("div", { class: "wls-accent accent-bad" }),
        /* @__PURE__ */ u$1("div", { class: "wls-top-row", style: "cursor:default", children: [
          /* @__PURE__ */ u$1("div", { class: "wls-title", children: "Work log summary" }),
          /* @__PURE__ */ u$1(MonthPicker, { currentOffset: monthOffset, onSelect: selectMonth }),
          /* @__PURE__ */ u$1("div", { class: "wls-top-right", children: [
            /* @__PURE__ */ u$1("span", { class: "wls-range", children: [
              formatDisplayDate(range.startDate),
              " – ",
              formatDisplayDate(range.endDate)
            ] }),
            /* @__PURE__ */ u$1(
              "button",
              {
                class: "wls-btn wls-btn-primary",
                type: "button",
                onClick: () => refresh(monthOffset),
                children: [
                  /* @__PURE__ */ u$1(Icon, { name: "refresh" }),
                  " Refresh"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ u$1("div", { class: "wls-error-box", children: view.message })
      ] });
    } else {
      const { checkInSummary, timesheetSummary, comparison, timesheetError, startDate, endDate } = view;
      const status = getOverallStatus({
        checkInSummary,
        timesheetSummary,
        comparison,
        timesheetError
      });
      const worked = checkInSummary.totalCheckInWorkMinutes;
      const logged = timesheetSummary.totalMinutes;
      const yetToLog = timesheetError ? 0 : Math.max(0, worked - logged);
      const overLogged = timesheetError ? 0 : Math.max(0, logged - worked);
      const progPct = worked > 0 ? Math.min(100, Math.round(logged / worked * 100)) : 0;
      const progClass = logged > worked ? "prog-over" : progPct >= 95 ? "prog-ok" : "prog-low";
      const popPending = pop({
        title: "Compensation balance",
        rows: [
          { label: "Time-off taken", value: formatMinutes(checkInSummary.totalTimeOffMinutes) },
          { label: "Compensated", value: formatMinutes(checkInSummary.totalExtraWorkedMinutes) },
          { label: "Still pending", value: formatMinutes(checkInSummary.pendingMinutes) }
        ],
        note: checkInSummary.pendingMinutes === 0 ? "All balanced! 🎉" : "Work extra hours to clear this."
      });
      const popTimeoff = pop({
        title: "Time-off taken",
        rows: [
          { label: "Total", value: formatMinutes(checkInSummary.totalTimeOffMinutes) },
          { label: "Records", value: String(checkInSummary.timeOffRows.length) }
        ],
        note: "Individual slots listed inside."
      });
      const popComp = pop({
        title: "Compensated hours",
        rows: [
          { label: "Extra worked", value: formatMinutes(checkInSummary.totalExtraWorkedMinutes) },
          { label: "Sessions", value: String(checkInSummary.extraRows.length) }
        ],
        note: "Includes weekend work and above-target days."
      });
      const popLogged = pop({
        title: "Timesheet vs check-in",
        rows: [
          { label: "Worked", value: formatMinutes(worked) },
          { label: "Logged", value: timesheetError ? "API error" : formatMinutes(logged) },
          {
            label: "Gap",
            value: timesheetError ? "–" : `${logged - worked >= 0 ? "+" : "−"}${formatMinutes(Math.abs(logged - worked))}`
          },
          { label: "Match rate", value: timesheetError ? "–" : `${progPct}%` }
        ],
        note: timesheetError ? "Timesheet unavailable." : overLogged > 0 ? "Over-logged — double-check entries." : yetToLog > 0 ? `${formatMinutes(yetToLog)} still unlogged.` : "Fully matched! ✓"
      });
      const popWorked = pop({
        title: "Hours worked (check-in)",
        rows: [
          { label: "Total worked", value: formatMinutes(worked) },
          {
            label: "Days with check-in",
            value: String(checkInSummary.dayRows.filter((d2) => d2.workMinutes > 0).length)
          },
          { label: "Day-offs", value: String(checkInSummary.dayOffCount) }
        ],
        note: "Derived from check-in & check-out times."
      });
      const popMismatch = pop({
        title: "Day mismatches",
        rows: [
          { label: "Days compared", value: String(comparison.rows.length) },
          { label: "Mismatches", value: String(comparison.mismatchCount) },
          { label: "Method", value: "Rounded hour" }
        ],
        note: comparison.mismatchCount === 0 ? "All days match! 🎉" : `Fix these ${comparison.mismatchCount} days in the timesheet.`
      });
      const popDayoff = pop({
        title: "Day-offs this month",
        rows: [
          { label: "Total day-offs", value: String(checkInSummary.dayOffCount) },
          {
            label: "Types",
            value: [...new Set(checkInSummary.dayOffRows.map((r2) => r2.type))].join(", ") || "–"
          }
        ],
        note: "Includes Day Off, Comp Off, and On Duty."
      });
      const mismatchColor = comparison.mismatchCount === 0 ? "wls-stat-good" : "wls-stat-bad";
      const pendingColor = checkInSummary.pendingMinutes === 0 ? "wls-stat-good" : "wls-stat-warn";
      content = /* @__PURE__ */ u$1("div", { class: "wls-card", children: [
        /* @__PURE__ */ u$1("div", { class: `wls-accent ${status.accentClass}` }),
        /* @__PURE__ */ u$1(
          "div",
          {
            class: "wls-top-row",
            role: "button",
            tabIndex: 0,
            onClick: (e2) => {
              if (e2.target.closest("button,[data-modal-key],.wls-month-picker"))
                return;
              setIsExpanded((v2) => !v2);
            },
            onKeyDown: (e2) => {
              if (e2.key === "Enter" || e2.key === " ") {
                e2.preventDefault();
                setIsExpanded((v2) => !v2);
              }
            },
            children: [
              /* @__PURE__ */ u$1("span", { class: "wls-chevron", children: /* @__PURE__ */ u$1(Icon, { name: "chevron", size: 16 }) }),
              /* @__PURE__ */ u$1("span", { class: "wls-title", children: "Work log summary" }),
              /* @__PURE__ */ u$1("span", { class: `wls-badge ${status.badgeClass}`, children: [
                /* @__PURE__ */ u$1(Icon, { name: status.icon, size: 11 }),
                status.label
              ] }),
              /* @__PURE__ */ u$1("div", { class: "wls-inline-stats", children: [
                /* @__PURE__ */ u$1("span", { class: "wls-stat-sep", children: "·" }),
                /* @__PURE__ */ u$1(
                  "span",
                  {
                    class: "wls-stat wls-stat-purple wls-dur",
                    "data-pop": popTimeoff,
                    "data-modal-key": "timeoff",
                    children: [
                      "Time-off ",
                      /* @__PURE__ */ u$1("strong", { children: formatMinutes(checkInSummary.totalTimeOffMinutes) })
                    ]
                  }
                ),
                /* @__PURE__ */ u$1("span", { class: "wls-stat-sep", children: "·" }),
                /* @__PURE__ */ u$1(
                  "span",
                  {
                    class: "wls-stat wls-stat-purple wls-dur",
                    "data-pop": popComp,
                    "data-modal-key": "compensated",
                    children: [
                      "Comp'd ",
                      /* @__PURE__ */ u$1("strong", { children: formatMinutes(checkInSummary.totalExtraWorkedMinutes) })
                    ]
                  }
                ),
                /* @__PURE__ */ u$1("span", { class: "wls-stat-sep", children: "·" }),
                /* @__PURE__ */ u$1(
                  "span",
                  {
                    class: `wls-stat ${pendingColor} wls-dur`,
                    "data-pop": popPending,
                    "data-modal-key": "pending",
                    children: [
                      "Pending ",
                      /* @__PURE__ */ u$1("strong", { children: formatMinutes(checkInSummary.pendingMinutes) })
                    ]
                  }
                ),
                /* @__PURE__ */ u$1("span", { class: "wls-stat-sep", children: "·" }),
                /* @__PURE__ */ u$1("span", { class: "wls-stat wls-dur", "data-pop": popLogged, "data-modal-key": "logged", children: [
                  "Logged ",
                  /* @__PURE__ */ u$1("strong", { children: timesheetError ? "?" : `${progPct}%` })
                ] }),
                /* @__PURE__ */ u$1("span", { class: "wls-stat-sep", children: "·" }),
                /* @__PURE__ */ u$1(
                  "span",
                  {
                    class: `wls-stat ${mismatchColor} wls-dur`,
                    "data-pop": popMismatch,
                    "data-modal-key": "mismatches",
                    children: [
                      /* @__PURE__ */ u$1("strong", { children: timesheetError ? "–" : comparison.mismatchCount }),
                      "mismatch",
                      comparison.mismatchCount !== 1 ? "es" : ""
                    ]
                  }
                ),
                /* @__PURE__ */ u$1("span", { class: "wls-stat-sep", children: "·" }),
                /* @__PURE__ */ u$1("span", { class: "wls-stat wls-dur", "data-pop": popDayoff, "data-modal-key": "dayoffs", children: [
                  "Day-offs ",
                  /* @__PURE__ */ u$1("strong", { children: checkInSummary.dayOffCount })
                ] })
              ] }),
              /* @__PURE__ */ u$1("div", { class: "wls-top-right", children: [
                /* @__PURE__ */ u$1(MonthPicker, { currentOffset: monthOffset, onSelect: selectMonth }),
                /* @__PURE__ */ u$1("span", { class: "wls-range", children: [
                  formatDisplayDate(startDate),
                  " – ",
                  formatDisplayDate(endDate)
                ] }),
                /* @__PURE__ */ u$1(
                  "button",
                  {
                    class: "wls-btn wls-btn-primary",
                    type: "button",
                    onClick: (e2) => {
                      e2.stopPropagation();
                      refresh(monthOffset);
                    },
                    children: [
                      /* @__PURE__ */ u$1(Icon, { name: "refresh" }),
                      " Refresh"
                    ]
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ u$1("div", { class: "wls-expandable", children: [
          /* @__PURE__ */ u$1("div", { class: "wls-body-divider" }),
          /* @__PURE__ */ u$1("div", { class: "wls-expandable-inner", children: [
            /* @__PURE__ */ u$1("div", { class: "wls-main", children: [
              /* @__PURE__ */ u$1("div", { class: "wls-block wls-block-comp", children: [
                /* @__PURE__ */ u$1("div", { class: "wls-block-hd", children: [
                  /* @__PURE__ */ u$1("div", { class: "wls-block-icon icon-comp", children: /* @__PURE__ */ u$1(Icon, { name: "clock", size: 14 }) }),
                  /* @__PURE__ */ u$1("span", { class: "wls-block-label", children: "Compensation balance" })
                ] }),
                /* @__PURE__ */ u$1("div", { class: "wls-big wls-big-c", children: [
                  /* @__PURE__ */ u$1("span", { class: "wls-dur", "data-pop": popPending, "data-modal-key": "pending", children: formatMinutes(checkInSummary.pendingMinutes) }),
                  /* @__PURE__ */ u$1("span", { class: "wls-big-sub", children: " pending" })
                ] }),
                /* @__PURE__ */ u$1("div", { class: "wls-chips", children: [
                  /* @__PURE__ */ u$1(
                    "span",
                    {
                      class: "wls-chip chip-purple wls-dur",
                      "data-pop": popTimeoff,
                      "data-modal-key": "timeoff",
                      children: [
                        /* @__PURE__ */ u$1(Icon, { name: "clock", size: 11 }),
                        " Time-off  ",
                        /* @__PURE__ */ u$1("strong", { children: formatMinutes(checkInSummary.totalTimeOffMinutes) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ u$1(
                    "span",
                    {
                      class: "wls-chip chip-pink wls-dur",
                      "data-pop": popComp,
                      "data-modal-key": "compensated",
                      children: [
                        /* @__PURE__ */ u$1(Icon, { name: "check", size: 11 }),
                        " Compensated  ",
                        /* @__PURE__ */ u$1("strong", { children: formatMinutes(checkInSummary.totalExtraWorkedMinutes) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ u$1(
                    "span",
                    {
                      class: "wls-chip chip-amber wls-dur",
                      "data-pop": popDayoff,
                      "data-modal-key": "dayoffs",
                      children: [
                        /* @__PURE__ */ u$1(Icon, { name: "cal", size: 11 }),
                        " Day-offs  ",
                        /* @__PURE__ */ u$1("strong", { children: checkInSummary.dayOffCount })
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ u$1("div", { class: "wls-block wls-block-ts", children: [
                /* @__PURE__ */ u$1("div", { class: "wls-block-hd", children: [
                  /* @__PURE__ */ u$1("div", { class: "wls-block-icon icon-ts", children: /* @__PURE__ */ u$1(Icon, { name: "report", size: 14 }) }),
                  /* @__PURE__ */ u$1("span", { class: "wls-block-label", children: "Worked vs logged" })
                ] }),
                /* @__PURE__ */ u$1("div", { class: "wls-big wls-big-t", children: [
                  timesheetError ? /* @__PURE__ */ u$1("span", { style: "font-size:14px;color:#94a3b8", children: "Unavailable" }) : /* @__PURE__ */ u$1("span", { class: "wls-dur", "data-pop": popLogged, "data-modal-key": "logged", children: formatMinutes(logged) }),
                  /* @__PURE__ */ u$1("span", { class: "wls-big-sub", children: " logged" })
                ] }),
                /* @__PURE__ */ u$1("div", { class: "wls-block-sub", children: [
                  "of",
                  " ",
                  /* @__PURE__ */ u$1("span", { class: "wls-dur", "data-pop": popWorked, "data-modal-key": "worked", children: formatMinutes(worked) }),
                  " ",
                  "worked"
                ] }),
                !timesheetError && /* @__PURE__ */ u$1("div", { class: "wls-prog-wrap", children: [
                  /* @__PURE__ */ u$1("div", { class: "wls-prog-track", children: /* @__PURE__ */ u$1(
                    "div",
                    {
                      class: `wls-prog-fill ${progClass}`,
                      style: "width:0%",
                      "data-pct": progPct
                    }
                  ) }),
                  /* @__PURE__ */ u$1("div", { class: "wls-prog-labels", children: [
                    /* @__PURE__ */ u$1("span", { children: [
                      progPct,
                      "% logged"
                    ] }),
                    /* @__PURE__ */ u$1("span", { children: logged > worked ? "over-logged ⚠" : yetToLog > 0 ? `${formatMinutes(yetToLog)} to go` : "complete ✓" })
                  ] })
                ] }),
                /* @__PURE__ */ u$1("div", { class: "wls-chips", children: [
                  timesheetError ? /* @__PURE__ */ u$1("span", { class: "wls-chip chip-slate", children: "Timesheet unavailable" }) : overLogged > 0 ? /* @__PURE__ */ u$1(
                    "span",
                    {
                      class: "wls-chip chip-amber wls-dur",
                      "data-pop": popLogged,
                      "data-modal-key": "logged",
                      children: [
                        /* @__PURE__ */ u$1(Icon, { name: "warn", size: 11 }),
                        formatMinutes(overLogged),
                        " over-logged"
                      ]
                    }
                  ) : /* @__PURE__ */ u$1(
                    "span",
                    {
                      class: `wls-chip ${yetToLog === 0 ? "chip-green" : "chip-blue"} wls-dur`,
                      "data-pop": popLogged,
                      "data-modal-key": "logged",
                      children: [
                        /* @__PURE__ */ u$1(Icon, { name: yetToLog === 0 ? "check" : "clock", size: 11 }),
                        yetToLog === 0 ? "All logged" : `${formatMinutes(yetToLog)} left`
                      ]
                    }
                  ),
                  /* @__PURE__ */ u$1(
                    "span",
                    {
                      class: `wls-chip ${comparison.mismatchCount === 0 ? "chip-green" : "chip-red"} wls-dur`,
                      "data-pop": popMismatch,
                      "data-modal-key": "mismatches",
                      children: [
                        /* @__PURE__ */ u$1(Icon, { name: comparison.mismatchCount === 0 ? "check" : "warn", size: 11 }),
                        timesheetError ? "–" : comparison.mismatchCount,
                        " mismatch",
                        comparison.mismatchCount !== 1 ? "es" : ""
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ u$1("div", { class: `wls-summary ${status.summaryClass}`, children: [
              /* @__PURE__ */ u$1("div", { class: `wls-summary-label ${status.slabelClass}`, children: [
                /* @__PURE__ */ u$1(Icon, { name: status.icon, size: 11 }),
                status.label
              ] }),
              /* @__PURE__ */ u$1(
                "span",
                {
                  class: "wls-status-message",
                  dangerouslySetInnerHTML: { __html: status.message }
                }
              )
            ] }),
            /* @__PURE__ */ u$1("div", { class: "wls-exp-actions", children: /* @__PURE__ */ u$1(
              "button",
              {
                class: "wls-btn",
                type: "button",
                onClick: (e2) => {
                  e2.stopPropagation();
                  setDetailsOpen(true);
                },
                children: [
                  /* @__PURE__ */ u$1(Icon, { name: "list" }),
                  " View full details"
                ]
              }
            ) })
          ] })
        ] }),
        detailsOpen && /* @__PURE__ */ u$1(
          "div",
          {
            class: "wls-modal-backdrop",
            role: "presentation",
            onClick: (e2) => {
              if (e2.target === e2.currentTarget) setDetailsOpen(false);
            },
            children: /* @__PURE__ */ u$1("div", { class: "wls-modal", role: "dialog", "aria-modal": "true", children: [
              /* @__PURE__ */ u$1("div", { class: "wls-modal-head", children: [
                /* @__PURE__ */ u$1("div", { children: [
                  /* @__PURE__ */ u$1("div", { class: "wls-modal-title", children: "Full work log breakdown" }),
                  /* @__PURE__ */ u$1("div", { class: "wls-modal-subtitle", children: [
                    formatDisplayDate(startDate),
                    " – ",
                    formatDisplayDate(endDate)
                  ] })
                ] }),
                /* @__PURE__ */ u$1("button", { class: "wls-close-btn", type: "button", onClick: () => setDetailsOpen(false), children: [
                  /* @__PURE__ */ u$1(Icon, { name: "close" }),
                  " Close"
                ] })
              ] }),
              /* @__PURE__ */ u$1(
                "div",
                {
                  class: "wls-modal-body",
                  dangerouslySetInnerHTML: {
                    __html: buildDetailsHtml({
                      checkInSummary,
                      timesheetSummary,
                      comparison,
                      timesheetError,
                      status
                    })
                  }
                }
              )
            ] })
          }
        )
      ] });
    }
    return /* @__PURE__ */ u$1("div", { ref: cardRef, children: content });
  }
  initTheme();
  initDom();
  const card = document.getElementById(CONFIG.cardId);
  if (card) {
    R(/* @__PURE__ */ u$1(WorkLogSummary, {}), card);
  }

})();