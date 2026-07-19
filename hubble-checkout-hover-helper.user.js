// ==UserScript==
// @name         Hubble Checkout Hover Helper
// @namespace    https://hubble.mallow-tech.com
// @version      1.0.1
// @author       Neon Raven
// @description  Auto checkout helper for Hubble attendance pages
// @license      Unlicense
// @downloadURL  https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/hubble-checkout-hover-helper.user.js
// @updateURL    https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/hubble-checkout-hover-helper.user.js
// @match        https://hubble.mallow-tech.com/attendance/all-check-in-data*
// @match        https://hubble.mallow-tech.com/attendance/my-check-in-data*
// @tag          timesheet
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

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
    const WORK_DAY_MINUTES = 8 * 60;
    const CONFIG = {
      checkInApiUrl: "https://hubble.mallow-tech.com/attendance/get-my-check-in-data",
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
    const TOOLTIP_ID = "checkout-hover-tooltip";
    const CHART_CONTAINER_ID = "checkout-hover-custom-chart";
    const ALL_CHART_CONTAINER_ID = "checkout-hover-all-custom-chart";
    const BREAK_TYPES = /* @__PURE__ */ new Set(["Short Break", "Long Break", "break", "lunch"]);
    const DAY_OFF_TYPES = /* @__PURE__ */ new Set([...CONFIG.dayOffLabels, "Declared Holiday"]);
    const classifySegment = (row) => {
      const type = String(row.type || "");
      if (CONFIG.workTypes.has(type)) return row.work_from_office ? "wfo" : "wfh";
      if (BREAK_TYPES.has(type)) return "break";
      if (CONFIG.timeOffTypes.has(type)) return "timeoff";
      return null;
    };
    const KIND_LABELS = {
      wfo: "Work from office",
      wfh: "Work from home",
      break: "Break",
      timeoff: "Time off"
    };
    const getSegmentKindLabel = (kind) => KIND_LABELS[kind];
    const formatMinutesAsTime = (minutes) => formatTime(new Date(0, 0, 0, Math.floor(minutes / 60), Math.round(minutes % 60)));
    const MONTHS = {
      jan: 0,
      feb: 1,
      mar: 2,
      apr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      aug: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dec: 11
    };
    const getMode = () => {
      const path = window.location.pathname;
      if (path.includes("/attendance/my-check-in-data") || document.querySelector("#my-checkin-detail")) {
        return "my";
      }
      return "all";
    };
    const parseWorkedMinutes = (text) => {
      const match = text.match(/\(\s*(\d+)\s*hrs?\s+(\d+)\s*mins?\s*\)/i);
      if (!match) return null;
      return Number(match[1]) * 60 + Number(match[2]);
    };
    const getCleanLabel = (text) => text.replace(/\s*\([^)]*\)\s*$/, "").trim();
    const parseDateLabel = (label) => {
      const match = label.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/);
      if (!match) return null;
      const day = Number(match[1]);
      const month = MONTHS[match[2].toLowerCase()];
      const year = Number(match[3]);
      if (month === void 0) return null;
      return new Date(year, month, day);
    };
    const isSameDate = (a2, b2) => !!a2 && !!b2 && a2.getFullYear() === b2.getFullYear() && a2.getMonth() === b2.getMonth() && a2.getDate() === b2.getDate();
    const formatDuration = (minutes) => {
      const total = Math.max(0, Math.round(minutes));
      const hrs = Math.floor(total / 60);
      const mins = total % 60;
      if (hrs === 0) return `${mins}m`;
      if (mins === 0) return `${hrs}h`;
      return `${hrs}h ${mins}m`;
    };
    const formatTime = (date) => date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
    const getWorkModeInfo = ({
      officeMinutes,
      homeMinutes
    }) => {
      const office = Math.max(0, Math.round(officeMinutes));
      const home = Math.max(0, Math.round(homeMinutes));
      const hasOffice = office > 0;
      const hasHome = home > 0;
      if (hasOffice && hasHome) {
        return {
          type: "hybrid",
          label: "Hybrid",
          subtitle: `WFO ${formatDuration(office)} · WFH ${formatDuration(home)}`,
          officeMinutes: office,
          homeMinutes: home
        };
      }
      if (hasOffice) {
        return {
          type: "wfo",
          label: "WFO",
          subtitle: `Office · ${formatDuration(office)}`,
          officeMinutes: office,
          homeMinutes: home
        };
      }
      if (hasHome) {
        return {
          type: "wfh",
          label: "WFH",
          subtitle: `Home · ${formatDuration(home)}`,
          officeMinutes: office,
          homeMinutes: home
        };
      }
      return {
        type: "none",
        label: "No check-in mode",
        subtitle: "No WFO/WFH check-in found",
        officeMinutes: office,
        homeMinutes: home
      };
    };
    const ensureTooltip = () => {
      let tooltip = document.getElementById(TOOLTIP_ID);
      if (tooltip) return tooltip;
      tooltip = document.createElement("div");
      tooltip.id = TOOLTIP_ID;
      tooltip.className = "cht-tooltip";
      Object.assign(tooltip.style, {
        position: "fixed",
        zIndex: "999999",
        display: "none",
        pointerEvents: "none"
      });
      document.body.appendChild(tooltip);
      return tooltip;
    };
    const moveTooltip = (tooltip, event) => {
      const offset = 16;
      const tooltipRect = tooltip.getBoundingClientRect();
      let left = event.clientX + offset;
      let top = event.clientY + offset;
      if (left + tooltipRect.width > window.innerWidth - 12) {
        left = event.clientX - tooltipRect.width - offset;
      }
      if (top + tooltipRect.height > window.innerHeight - 12) {
        top = event.clientY - tooltipRect.height - offset;
      }
      tooltip.style.left = `${Math.max(12, left)}px`;
      tooltip.style.top = `${Math.max(12, top)}px`;
    };
    var n, l, u$1, i, r, o, e, f$1, c, a, s, h, p, v, d = {}, w = [], _ = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, g = Array.isArray;
    function m(n2, l2) {
      for (var u2 in l2) n2[u2] = l2[u2];
      return n2;
    }
    function b(n2) {
      n2 && n2.parentNode && n2.parentNode.removeChild(n2);
    }
    function k(l2, u2, t) {
      var i2, r2, o2, e2 = {};
      for (o2 in u2) "key" == o2 ? i2 = u2[o2] : "ref" == o2 ? r2 = u2[o2] : e2[o2] = u2[o2];
      if (arguments.length > 2 && (e2.children = arguments.length > 3 ? n.call(arguments, 2) : t), "function" == typeof l2 && null != l2.defaultProps) for (o2 in l2.defaultProps) void 0 === e2[o2] && (e2[o2] = l2.defaultProps[o2]);
      return x(l2, e2, i2, r2, null);
    }
    function x(n2, t, i2, r2, o2) {
      var e2 = { type: n2, props: t, key: i2, ref: r2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == o2 ? ++u$1 : o2, __i: -1, __u: 0 };
      return null == o2 && null != l.vnode && l.vnode(e2), e2;
    }
    function S(n2) {
      return n2.children;
    }
    function C(n2, l2) {
      this.props = n2, this.context = l2;
    }
    function $(n2, l2) {
      if (null == l2) return n2.__ ? $(n2.__, n2.__i + 1) : null;
      for (var u2; l2 < n2.__k.length; l2++) if (null != (u2 = n2.__k[l2]) && null != u2.__e) return u2.__e;
      return "function" == typeof n2.type ? $(n2) : null;
    }
    function I(n2) {
      if (n2.__P && n2.__d) {
        var u2 = n2.__v, t = u2.__e, i2 = [], r2 = [], o2 = m({}, u2);
        o2.__v = u2.__v + 1, l.vnode && l.vnode(o2), q(n2.__P, o2, u2, n2.__n, n2.__P.namespaceURI, 32 & u2.__u ? [t] : null, i2, null == t ? $(u2) : t, !!(32 & u2.__u), r2), o2.__v = u2.__v, o2.__.__k[o2.__i] = o2, D(i2, o2, r2), u2.__e = u2.__ = null, o2.__e != t && P(o2);
      }
    }
    function P(n2) {
      if (null != (n2 = n2.__) && null != n2.__c) return n2.__e = n2.__c.base = null, n2.__k.some(function(l2) {
        if (null != l2 && null != l2.__e) return n2.__e = n2.__c.base = l2.__e;
      }), P(n2);
    }
    function A(n2) {
      (!n2.__d && (n2.__d = true) && i.push(n2) && !H.__r++ || r != l.debounceRendering) && ((r = l.debounceRendering) || o)(H);
    }
    function H() {
      try {
        for (var n2, l2 = 1; i.length; ) i.length > l2 && i.sort(e), n2 = i.shift(), l2 = i.length, I(n2);
      } finally {
        i.length = H.__r = 0;
      }
    }
    function L(n2, l2, u2, t, i2, r2, o2, e2, f2, c2, a2) {
      var s2, h2, p2, v2, y, _2, g2, m2 = t && t.__k || w, b2 = l2.length;
      for (f2 = T(u2, l2, m2, f2, b2), s2 = 0; s2 < b2; s2++) null != (p2 = u2.__k[s2]) && (h2 = -1 != p2.__i && m2[p2.__i] || d, p2.__i = s2, _2 = q(n2, p2, h2, i2, r2, o2, e2, f2, c2, a2), v2 = p2.__e, p2.ref && h2.ref != p2.ref && (h2.ref && J(h2.ref, null, p2), a2.push(p2.ref, p2.__c || v2, p2)), null == y && null != v2 && (y = v2), (g2 = !!(4 & p2.__u)) || h2.__k === p2.__k ? (f2 = j(p2, f2, n2, g2), g2 && h2.__e && (h2.__e = null)) : "function" == typeof p2.type && void 0 !== _2 ? f2 = _2 : v2 && (f2 = v2.nextSibling), p2.__u &= -7);
      return u2.__e = y, f2;
    }
    function T(n2, l2, u2, t, i2) {
      var r2, o2, e2, f2, c2, a2 = u2.length, s2 = a2, h2 = 0;
      for (n2.__k = new Array(i2), r2 = 0; r2 < i2; r2++) null != (o2 = l2[r2]) && "boolean" != typeof o2 && "function" != typeof o2 ? ("string" == typeof o2 || "number" == typeof o2 || "bigint" == typeof o2 || o2.constructor == String ? o2 = n2.__k[r2] = x(null, o2, null, null, null) : g(o2) ? o2 = n2.__k[r2] = x(S, { children: o2 }, null, null, null) : void 0 === o2.constructor && o2.__b > 0 ? o2 = n2.__k[r2] = x(o2.type, o2.props, o2.key, o2.ref ? o2.ref : null, o2.__v) : n2.__k[r2] = o2, f2 = r2 + h2, o2.__ = n2, o2.__b = n2.__b + 1, e2 = null, -1 != (c2 = o2.__i = O(o2, u2, f2, s2)) && (s2--, (e2 = u2[c2]) && (e2.__u |= 2)), null == e2 || null == e2.__v ? (-1 == c2 && (i2 > a2 ? h2-- : i2 < a2 && h2++), "function" != typeof o2.type && (o2.__u |= 4)) : c2 != f2 && (c2 == f2 - 1 ? h2-- : c2 == f2 + 1 ? h2++ : (c2 > f2 ? h2-- : h2++, o2.__u |= 4))) : n2.__k[r2] = null;
      if (s2) for (r2 = 0; r2 < a2; r2++) null != (e2 = u2[r2]) && 0 == (2 & e2.__u) && (e2.__e == t && (t = $(e2)), K(e2, e2));
      return t;
    }
    function j(n2, l2, u2, t) {
      var i2, r2;
      if ("function" == typeof n2.type) {
        for (i2 = n2.__k, r2 = 0; i2 && r2 < i2.length; r2++) i2[r2] && (i2[r2].__ = n2, l2 = j(i2[r2], l2, u2, t));
        return l2;
      }
      n2.__e != l2 && (t && (l2 && n2.type && !l2.parentNode && (l2 = $(n2)), u2.insertBefore(n2.__e, l2 || null)), l2 = n2.__e);
      do {
        l2 = l2 && l2.nextSibling;
      } while (null != l2 && 8 == l2.nodeType);
      return l2;
    }
    function O(n2, l2, u2, t) {
      var i2, r2, o2, e2 = n2.key, f2 = n2.type, c2 = l2[u2], a2 = null != c2 && 0 == (2 & c2.__u);
      if (null === c2 && null == e2 || a2 && e2 == c2.key && f2 == c2.type) return u2;
      if (t > (a2 ? 1 : 0)) {
        for (i2 = u2 - 1, r2 = u2 + 1; i2 >= 0 || r2 < l2.length; ) if (null != (c2 = l2[o2 = i2 >= 0 ? i2-- : r2++]) && 0 == (2 & c2.__u) && e2 == c2.key && f2 == c2.type) return o2;
      }
      return -1;
    }
    function z(n2, l2, u2) {
      "-" == l2[0] ? n2.setProperty(l2, null == u2 ? "" : u2) : n2[l2] = null == u2 ? "" : "number" != typeof u2 || _.test(l2) ? u2 : u2 + "px";
    }
    function N(n2, l2, u2, t, i2) {
      var r2, o2;
      n: if ("style" == l2) if ("string" == typeof u2) n2.style.cssText = u2;
      else {
        if ("string" == typeof t && (n2.style.cssText = t = ""), t) for (l2 in t) u2 && l2 in u2 || z(n2.style, l2, "");
        if (u2) for (l2 in u2) t && u2[l2] == t[l2] || z(n2.style, l2, u2[l2]);
      }
      else if ("o" == l2[0] && "n" == l2[1]) r2 = l2 != (l2 = l2.replace(s, "$1")), o2 = l2.toLowerCase(), l2 = o2 in n2 || "onFocusOut" == l2 || "onFocusIn" == l2 ? o2.slice(2) : l2.slice(2), n2.l || (n2.l = {}), n2.l[l2 + r2] = u2, u2 ? t ? u2[a] = t[a] : (u2[a] = h, n2.addEventListener(l2, r2 ? v : p, r2)) : n2.removeEventListener(l2, r2 ? v : p, r2);
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
          var t = this.l[u2.type + n2];
          if (null == u2[c]) u2[c] = h++;
          else if (u2[c] < t[a]) return;
          return t(l.event ? l.event(u2) : u2);
        }
      };
    }
    function q(n2, u2, t, i2, r2, o2, e2, f2, c2, a2) {
      var s2, h2, p2, v2, y, d2, _2, k2, x2, M, $2, I2, P2, A2, H2, T2, j2 = u2.type;
      if (void 0 !== u2.constructor) return null;
      128 & t.__u && (c2 = !!(32 & t.__u), o2 = [f2 = u2.__e = t.__e]), (s2 = l.__b) && s2(u2);
      n: if ("function" == typeof j2) {
        h2 = e2.length;
        try {
          if (x2 = u2.props, M = j2.prototype && j2.prototype.render, $2 = (s2 = j2.contextType) && i2[s2.__c], I2 = s2 ? $2 ? $2.props.value : s2.__ : i2, t.__c ? k2 = (p2 = u2.__c = t.__c).__ = p2.__E : (M ? u2.__c = p2 = new j2(x2, I2) : (u2.__c = p2 = new C(x2, I2), p2.constructor = j2, p2.render = Q), $2 && $2.sub(p2), p2.state || (p2.state = {}), p2.__n = i2, v2 = p2.__d = true, p2.__h = [], p2._sb = []), M && null == p2.__s && (p2.__s = p2.state), M && null != j2.getDerivedStateFromProps && (p2.__s == p2.state && (p2.__s = m({}, p2.__s)), m(p2.__s, j2.getDerivedStateFromProps(x2, p2.__s))), y = p2.props, d2 = p2.state, p2.__v = u2, v2) M && null == j2.getDerivedStateFromProps && null != p2.componentWillMount && p2.componentWillMount(), M && null != p2.componentDidMount && p2.__h.push(p2.componentDidMount);
          else {
            if (M && null == j2.getDerivedStateFromProps && x2 !== y && null != p2.componentWillReceiveProps && p2.componentWillReceiveProps(x2, I2), u2.__v == t.__v || !p2.__e && null != p2.shouldComponentUpdate && false === p2.shouldComponentUpdate(x2, p2.__s, I2)) {
              u2.__v != t.__v && (p2.props = x2, p2.state = p2.__s, p2.__d = false), u2.__e = t.__e, u2.__k = t.__k, u2.__k.some(function(n3) {
                n3 && (n3.__ = u2);
              }), w.push.apply(p2.__h, p2._sb), p2._sb = [], p2.__h.length && e2.push(p2);
              break n;
            }
            null != p2.componentWillUpdate && p2.componentWillUpdate(x2, p2.__s, I2), M && null != p2.componentDidUpdate && p2.__h.push(function() {
              p2.componentDidUpdate(y, d2, _2);
            });
          }
          if (p2.context = I2, p2.props = x2, p2.__P = n2, p2.__e = false, P2 = l.__r, A2 = 0, M) p2.state = p2.__s, p2.__d = false, P2 && P2(u2), s2 = p2.render(p2.props, p2.state, p2.context), w.push.apply(p2.__h, p2._sb), p2._sb = [];
          else do {
            p2.__d = false, P2 && P2(u2), s2 = p2.render(p2.props, p2.state, p2.context), p2.state = p2.__s;
          } while (p2.__d && ++A2 < 25);
          p2.state = p2.__s, null != p2.getChildContext && (i2 = m(m({}, i2), p2.getChildContext())), M && !v2 && null != p2.getSnapshotBeforeUpdate && (_2 = p2.getSnapshotBeforeUpdate(y, d2)), H2 = null != s2 && s2.type === S && null == s2.key ? E(s2.props.children) : s2, f2 = L(n2, g(H2) ? H2 : [H2], u2, t, i2, r2, o2, e2, f2, c2, a2), p2.base = u2.__e, u2.__u &= -161, p2.__h.length && e2.push(p2), k2 && (p2.__E = p2.__ = null);
        } catch (n3) {
          if (e2.length = h2, u2.__v = null, c2 || null != o2) {
            if (n3.then) {
              for (u2.__u |= c2 ? 160 : 128; f2 && 8 == f2.nodeType && f2.nextSibling; ) f2 = f2.nextSibling;
              null != o2 && (o2[o2.indexOf(f2)] = null), u2.__e = f2;
            } else if (null != o2) for (T2 = o2.length; T2--; ) b(o2[T2]);
          } else u2.__e = t.__e;
          null == u2.__k && (u2.__k = t.__k || []), n3.then || B(u2), l.__e(n3, u2, t);
        }
      } else null == o2 && u2.__v == t.__v ? (u2.__k = t.__k, u2.__e = t.__e) : f2 = u2.__e = G(t.__e, u2, t, i2, r2, o2, e2, c2, a2);
      return (s2 = l.diffed) && s2(u2), 128 & u2.__u ? void 0 : f2;
    }
    function B(n2) {
      n2 && (n2.__c && (n2.__c.__e = true), n2.__k && n2.__k.some(B));
    }
    function D(n2, u2, t) {
      for (var i2 = 0; i2 < t.length; i2++) J(t[i2], t[++i2], t[++i2]);
      l.__c && l.__c(u2, n2), n2.some(function(u3) {
        try {
          n2 = u3.__h, u3.__h = [], n2.some(function(n3) {
            n3.call(u3);
          });
        } catch (n3) {
          l.__e(n3, u3.__v);
        }
      });
    }
    function E(n2) {
      return "object" != typeof n2 || null == n2 || n2.__b > 0 ? n2 : g(n2) ? n2.map(E) : void 0 !== n2.constructor ? null : m({}, n2);
    }
    function G(u2, t, i2, r2, o2, e2, f2, c2, a2) {
      var s2, h2, p2, v2, y, w2, _2, m2 = i2.props || d, k2 = t.props, x2 = t.type;
      if ("svg" == x2 ? o2 = "http://www.w3.org/2000/svg" : "math" == x2 ? o2 = "http://www.w3.org/1998/Math/MathML" : o2 || (o2 = "http://www.w3.org/1999/xhtml"), null != e2) {
        for (s2 = 0; s2 < e2.length; s2++) if ((y = e2[s2]) && "setAttribute" in y == !!x2 && (x2 ? y.localName == x2 : 3 == y.nodeType)) {
          u2 = y, e2[s2] = null;
          break;
        }
      }
      if (null == u2) {
        if (null == x2) return document.createTextNode(k2);
        u2 = document.createElementNS(o2, x2, k2.is && k2), c2 && (l.__m && l.__m(t, e2), c2 = false), e2 = null;
      }
      if (null == x2) m2 === k2 || c2 && u2.data == k2 || (u2.data = k2);
      else {
        if (e2 = "textarea" == x2 && null != k2.defaultValue ? null : e2 && n.call(u2.childNodes), !c2 && null != e2) for (m2 = {}, s2 = 0; s2 < u2.attributes.length; s2++) m2[(y = u2.attributes[s2]).name] = y.value;
        for (s2 in m2) y = m2[s2], "dangerouslySetInnerHTML" == s2 ? p2 = y : "children" == s2 || s2 in k2 || "value" == s2 && "defaultValue" in k2 || "checked" == s2 && "defaultChecked" in k2 || N(u2, s2, null, y, o2);
        for (s2 in k2) y = k2[s2], "children" == s2 ? v2 = y : "dangerouslySetInnerHTML" == s2 ? h2 = y : "value" == s2 ? w2 = y : "checked" == s2 ? _2 = y : c2 && "function" != typeof y || m2[s2] === y || N(u2, s2, y, m2[s2], o2);
        if (h2) c2 || p2 && (h2.__html == p2.__html || h2.__html == u2.innerHTML) || (u2.innerHTML = h2.__html), t.__k = [];
        else if (p2 && (u2.innerHTML = ""), L("template" == t.type ? u2.content : u2, g(v2) ? v2 : [v2], t, i2, r2, "foreignObject" == x2 ? "http://www.w3.org/1999/xhtml" : o2, e2, f2, e2 ? e2[0] : i2.__k && $(i2, 0), c2, a2), null != e2) for (s2 = e2.length; s2--; ) b(e2[s2]);
        c2 && "textarea" != x2 || (s2 = "value", "progress" == x2 && null == w2 ? u2.removeAttribute("value") : null != w2 && (w2 !== u2[s2] || "progress" == x2 && !w2 || "option" == x2 && w2 != m2[s2]) && N(u2, s2, w2, m2[s2], o2), s2 = "checked", null != _2 && _2 != u2[s2] && N(u2, s2, _2, m2[s2], o2));
      }
      return u2;
    }
    function J(n2, u2, t) {
      try {
        if ("function" == typeof n2) {
          var i2 = "function" == typeof n2.__u;
          i2 && n2.__u(), i2 && null == u2 || (n2.__u = n2(u2));
        } else n2.current = u2;
      } catch (n3) {
        l.__e(n3, t);
      }
    }
    function K(n2, u2, t) {
      var i2, r2;
      if (l.unmount && l.unmount(n2), (i2 = n2.ref) && (i2.current && i2.current != n2.__e || J(i2, null, u2)), null != (i2 = n2.__c)) {
        if (i2.componentWillUnmount) try {
          i2.componentWillUnmount();
        } catch (n3) {
          l.__e(n3, u2);
        }
        i2.base = i2.__P = i2.__n = null;
      }
      if (i2 = n2.__k) for (r2 = 0; r2 < i2.length; r2++) i2[r2] && K(i2[r2], u2, t || "function" != typeof n2.type);
      t || b(n2.__e), n2.__c = n2.__ = n2.__e = void 0;
    }
    function Q(n2, l2, u2) {
      return this.constructor(n2, u2);
    }
    function R(u2, t, i2) {
      var r2, o2, e2, f2;
      t == document && (t = document.documentElement), l.__ && l.__(u2, t), o2 = (r2 = false) ? null : t.__k, e2 = [], f2 = [], q(t, u2 = t.__k = k(S, null, [u2]), o2 || d, d, t.namespaceURI, o2 ? null : t.firstChild ? n.call(t.childNodes) : null, e2, o2 ? o2.__e : t.firstChild, r2, f2), D(e2, u2, f2), u2.props.children = null;
    }
    n = w.slice, l = { __e: function(n2, l2, u2, t) {
      for (var i2, r2, o2; l2 = l2.__; ) if ((i2 = l2.__c) && !i2.__) try {
        if ((r2 = i2.constructor) && null != r2.getDerivedStateFromError && (i2.setState(r2.getDerivedStateFromError(n2)), o2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t || {}), o2 = i2.__d), o2) return i2.__E = i2;
      } catch (l3) {
        n2 = l3;
      }
      throw n2;
    } }, u$1 = 0, C.prototype.setState = function(n2, l2) {
      var u2;
      u2 = null != this.__s && this.__s != this.state ? this.__s : this.__s = m({}, this.state), "function" == typeof n2 && (n2 = n2(m({}, u2), this.props)), n2 && m(u2, n2), null != n2 && this.__v && (l2 && this._sb.push(l2), A(this));
    }, C.prototype.forceUpdate = function(n2) {
      this.__v && (this.__e = true, n2 && this.__h.push(n2), A(this));
    }, C.prototype.render = S, i = [], o = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e = function(n2, l2) {
      return n2.__v.__b - l2.__v.__b;
    }, H.__r = 0, f$1 = Math.random().toString(8), c = "__d" + f$1, a = "__a" + f$1, s = /(PointerCapture)$|Capture$/i, h = 0, p = V(false), v = V(true);
    var f = 0;
    function u(e2, t, n2, o2, i2, u2) {
      t || (t = {});
      var a2, c2, p2 = t;
      if ("ref" in p2) for (c2 in p2 = {}, t) "ref" == c2 ? a2 = t[c2] : p2[c2] = t[c2];
      var l$1 = { type: e2, props: p2, key: n2, ref: a2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f, __i: -1, __u: 0, __source: i2, __self: u2 };
      if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2]);
      return l.vnode && l.vnode(l$1), l$1;
    }
    const pad = (v2) => String(v2).padStart(2, "0");
    const stripHtml = (v2) => {
      const d2 = document.createElement("div");
      d2.innerHTML = String(v2 ?? "");
      return d2.textContent || d2.innerText || "";
    };
    const toYMD = (d2) => `${d2.getFullYear()}-${pad(d2.getMonth() + 1)}-${pad(d2.getDate())}`;
    const getMonthRange = (offset = 0) => {
      const now = /* @__PURE__ */ new Date();
      const y = now.getFullYear();
      const m2 = now.getMonth() + offset;
      const start = new Date(y, m2, 1);
      const end = new Date(y, m2 + 1, 0);
      return { startDate: toYMD(start), endDate: toYMD(end) };
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
    const flattenAttendanceData = (data) => Object.entries(data || {}).flatMap(
      ([key, rows]) => (rows || []).map((r2) => ({
        ...r2,
        date: r2.my_check_in_date || key
      }))
    );
    const pendingElementWaits = /* @__PURE__ */ new Set();
    const waitForElement = (selector, onFound, timeoutMs = 1e4) => {
      const existing = document.querySelector(selector);
      if (existing) {
        onFound(existing);
        return;
      }
      if (pendingElementWaits.has(selector)) return;
      pendingElementWaits.add(selector);
      const stop = () => {
        observer.disconnect();
        pendingElementWaits.delete(selector);
      };
      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (!el) return;
        stop();
        onFound(el);
      });
      observer.observe(document.body, { childList: true, subtree: true });
      window.setTimeout(stop, timeoutMs);
    };
    const getSharedWindow = (entries) => {
      let min = Infinity;
      let max = -Infinity;
      entries.forEach((entry) => {
        entry.segments.forEach((seg) => {
          min = Math.min(min, seg.startMinutes);
          max = Math.max(max, seg.endMinutes);
        });
      });
      if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) {
        return { startMinutes: 9 * 60, endMinutes: 19 * 60 };
      }
      const pad2 = 15;
      return {
        startMinutes: Math.max(0, Math.floor(min / 30) * 30 - pad2),
        endMinutes: Math.min(24 * 60, Math.ceil(max / 30) * 30 + pad2)
      };
    };
    const getAxisLabels = (windowRange) => {
      const count = 5;
      const span = windowRange.endMinutes - windowRange.startMinutes;
      return Array.from(
        { length: count },
        (_2, index) => formatMinutesAsTime(windowRange.startMinutes + span * index / (count - 1))
      );
    };
    function TimelineRow({
      entry,
      windowRange,
      onHoverLabel,
      onHoverSegment,
      onMove,
      onLeave
    }) {
      const span = windowRange.endMinutes - windowRange.startMinutes;
      const toPct = (minutes) => Math.min(100, Math.max(0, (minutes - windowRange.startMinutes) / span * 100));
      const sortedSegments = [...entry.segments].sort((a2, b2) => a2.startMinutes - b2.startMinutes);
      return /* @__PURE__ */ u("div", { class: `cht-chart-row${entry.isHighlighted ? " cht-chart-row--today" : ""}`, children: [
        /* @__PURE__ */ u(
          "div",
          {
            class: "cht-chart-row-label",
            onMouseEnter: (event) => onHoverLabel(event, entry),
            onMouseMove: onMove,
            onMouseLeave: onLeave,
            children: [
              /* @__PURE__ */ u("span", { class: "cht-chart-row-date", title: entry.label, children: entry.label }),
              /* @__PURE__ */ u("span", { class: "cht-chart-row-worked", children: entry.sublabel })
            ]
          }
        ),
        /* @__PURE__ */ u("div", { class: "cht-chart-row-track", children: entry.isDayOff ? /* @__PURE__ */ u(
          "div",
          {
            class: "cht-chart-seg cht-chart-seg--dayoff",
            style: "left:0%;width:100%",
            onMouseEnter: (event) => onHoverLabel(event, entry),
            onMouseMove: onMove,
            onMouseLeave: onLeave,
            children: entry.dayOffType || "Day Off"
          }
        ) : sortedSegments.map((seg, index) => {
          const prev = sortedSegments[index - 1];
          const next = sortedSegments[index + 1];
          const touchesPrev = !!prev && prev.endMinutes === seg.startMinutes;
          const touchesNext = !!next && next.startMinutes === seg.endMinutes;
          const modifiers = [
            `cht-chart-seg--${seg.kind}`,
            touchesPrev && "cht-chart-seg--sq-l",
            touchesNext && "cht-chart-seg--sq-r"
          ].filter(Boolean).join(" ");
          return /* @__PURE__ */ u(
            "div",
            {
              class: `cht-chart-seg ${modifiers}`,
              style: `left:${toPct(seg.startMinutes)}%;width:${toPct(seg.endMinutes) - toPct(seg.startMinutes)}%`,
              onMouseEnter: (event) => onHoverSegment(event, entry, seg),
              onMouseMove: onMove,
              onMouseLeave: onLeave
            },
            index
          );
        }) })
      ] });
    }
    function CustomTimeline({
      entries,
      windowRange,
      onHoverLabel,
      onHoverSegment,
      onMove,
      onLeave
    }) {
      const axisLabels = getAxisLabels(windowRange);
      return /* @__PURE__ */ u("div", { class: "cht-chart", children: [
        /* @__PURE__ */ u("div", { class: "cht-chart-axis", children: axisLabels.map((label, index) => /* @__PURE__ */ u("span", { children: label }, index)) }),
        /* @__PURE__ */ u("div", { class: "cht-chart-rows", children: entries.map((entry) => /* @__PURE__ */ u(
          TimelineRow,
          {
            entry,
            windowRange,
            onHoverLabel,
            onHoverSegment,
            onMove,
            onLeave
          },
          entry.key
        )) })
      ] });
    }
    function Chip({
      label,
      value,
      variant = "default"
    }) {
      return /* @__PURE__ */ u("div", { class: `cht-chip cht-chip--${variant}`, children: [
        /* @__PURE__ */ u("div", { class: "cht-chip-label", children: label }),
        /* @__PURE__ */ u("div", { class: "cht-chip-value", children: value })
      ] });
    }
    function WorkModeBadge({ workMode }) {
      if (!workMode || workMode.type === "none") {
        return null;
      }
      const modeText = workMode.type === "wfo" ? `WFO · ${formatDuration(workMode.officeMinutes)}` : workMode.type === "wfh" ? `WFH · ${formatDuration(workMode.homeMinutes)}` : `Hybrid · WFO ${formatDuration(
    workMode.officeMinutes
  )} · WFH ${formatDuration(workMode.homeMinutes)}`;
      return /* @__PURE__ */ u("div", { class: "cht-work-mode-wrap", children: /* @__PURE__ */ u("div", { class: `cht-work-mode cht-work-mode--${workMode.type}`, children: [
        /* @__PURE__ */ u("span", { class: "cht-work-mode-dot" }),
        /* @__PURE__ */ u("span", { children: modeText })
      ] }) });
    }
    const getStatusClass = (status) => {
      const valid = ["pending", "short", "ready", "completed", "full-time-off"];
      return status && valid.includes(status) ? status : "pending";
    };
    function WorkTooltip({
      title,
      subtitle,
      worked,
      timeOff,
      required,
      remaining,
      heroTitle,
      heroValue,
      badgeText,
      status,
      primaryChipLabel,
      workMode
    }) {
      const statusClass = getStatusClass(status);
      return /* @__PURE__ */ u("div", { class: `cht-tooltip-body cht-status--${statusClass}`, children: [
        /* @__PURE__ */ u("div", { class: "cht-tooltip-header", children: [
          /* @__PURE__ */ u("div", { class: "cht-tooltip-header-text", children: [
            /* @__PURE__ */ u("div", { class: "cht-tooltip-title", children: title }),
            /* @__PURE__ */ u("div", { class: "cht-tooltip-subtitle", children: subtitle })
          ] }),
          /* @__PURE__ */ u("div", { class: "cht-tooltip-badge", children: badgeText })
        ] }),
        /* @__PURE__ */ u("div", { class: "cht-tooltip-hero", children: [
          /* @__PURE__ */ u("div", { class: "cht-tooltip-hero-label", children: heroTitle }),
          /* @__PURE__ */ u("div", { class: "cht-tooltip-hero-value", children: heroValue })
        ] }),
        /* @__PURE__ */ u("div", { class: "cht-tooltip-chips", children: [
          /* @__PURE__ */ u(Chip, { label: primaryChipLabel || "", value: remaining, variant: "accent" }),
          /* @__PURE__ */ u(Chip, { label: "Worked", value: worked }),
          /* @__PURE__ */ u(Chip, { label: "Time off", value: timeOff }),
          /* @__PURE__ */ u(Chip, { label: "Required", value: required })
        ] }),
        /* @__PURE__ */ u(WorkModeBadge, { workMode })
      ] });
    }
    function SegmentTooltip({
      kind,
      startMinutes,
      endMinutes
    }) {
      return /* @__PURE__ */ u("div", { class: "cht-tooltip-body cht-seg-tooltip", children: [
        /* @__PURE__ */ u("div", { class: `cht-seg-tooltip-title cht-seg-tooltip-title--${kind}`, children: [
          /* @__PURE__ */ u("span", { class: "cht-seg-tooltip-dot" }),
          getSegmentKindLabel(kind)
        ] }),
        /* @__PURE__ */ u("div", { class: "cht-seg-tooltip-range", children: [
          formatMinutesAsTime(startMinutes),
          " – ",
          formatMinutesAsTime(endMinutes)
        ] }),
        /* @__PURE__ */ u("div", { class: "cht-seg-tooltip-duration", children: formatDuration(endMinutes - startMinutes) })
      ] });
    }
    function DayOffTooltip({
      title,
      subtitle,
      message
    }) {
      return /* @__PURE__ */ u("div", { class: "cht-tooltip-body cht-dayoff", children: [
        /* @__PURE__ */ u("div", { class: "cht-dayoff-header", children: [
          /* @__PURE__ */ u("div", { class: "cht-dayoff-icon", children: "🎉" }),
          /* @__PURE__ */ u("div", { class: "cht-tooltip-header-text", children: [
            /* @__PURE__ */ u("div", { class: "cht-tooltip-title", children: title }),
            /* @__PURE__ */ u("div", { class: "cht-dayoff-subtitle", children: subtitle })
          ] })
        ] }),
        /* @__PURE__ */ u("div", { class: "cht-dayoff-card", children: [
          /* @__PURE__ */ u("div", { class: "cht-dayoff-title", children: "Day Off" }),
          /* @__PURE__ */ u("div", { class: "cht-dayoff-message", children: message })
        ] })
      ] });
    }
    const REQUIRED_WORK_MINUTES$1 = WORK_DAY_MINUTES;
    const NO_DATA_TYPE = "No Data Found for Attendance";
    const TARGET_URL_FRAGMENT = "get-all-check-in-data";
    const NATIVE_CONTAINER_SELECTOR = "#checkin-detail, #all-checkin-detail, #all-check-in-detail";
    const installAjaxInterceptor = (onData) => {
      if (window.__hubbleAllModeInterceptorInit) return;
      window.__hubbleAllModeInterceptorInit = true;
      const originalOpen = XMLHttpRequest.prototype.open;
      const originalSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.open = function(...args) {
        this.__hpsInterceptUrl = String(args[1]);
        return originalOpen.apply(this, args);
      };
      XMLHttpRequest.prototype.send = function(...args) {
        var _a;
        if ((_a = this.__hpsInterceptUrl) == null ? void 0 : _a.includes(TARGET_URL_FRAGMENT)) {
          this.addEventListener("load", () => {
            try {
              onData(JSON.parse(this.responseText));
            } catch (error) {
              console.error("[checkout-hover-helper] Failed to parse all check-in data.", error);
            }
          });
        }
        return originalSend.apply(this, args);
      };
    };
    const groupAllEmployees = (data) => Object.entries(data).map(([userIdStr, rows]) => {
      var _a, _b;
      const userId = Number(userIdStr);
      const rawName = String(((_a = rows[0]) == null ? void 0 : _a.name) || "");
      const hasNoData = rows.every((row) => row.type === NO_DATA_TYPE);
      const dayOffRow = rows.find((row) => row.type && DAY_OFF_TYPES.has(row.type));
      const segments = [];
      if (!hasNoData && !dayOffRow) {
        rows.forEach((row) => {
          const kind = classifySegment(row);
          if (!kind) return;
          const startMinutes = parseTimeToMinutes(row.start_time);
          const endMinutes = parseTimeToMinutes(row.end_time);
          if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) return;
          segments.push({ kind, startMinutes, endMinutes });
        });
      }
      const entry = {
        userId,
        name: getCleanLabel(rawName),
        team: (_b = rows[0]) == null ? void 0 : _b.team,
        workedMinutes: parseWorkedMinutes(rawName) || 0,
        isDayOff: !!dayOffRow,
        dayOffType: dayOffRow == null ? void 0 : dayOffRow.type,
        hasNoData,
        segments
      };
      return entry;
    }).sort((a2, b2) => a2.name.localeCompare(b2.name));
    const toTimelineEntry$1 = (employee) => ({
      key: String(employee.userId),
      label: employee.name,
      sublabel: employee.hasNoData ? "No data" : formatDuration(employee.workedMinutes),
      segments: employee.segments,
      isDayOff: employee.isDayOff,
      dayOffType: employee.dayOffType
    });
    const buildEmployeeTooltipData = (employee) => {
      const sum = (kind) => employee.segments.filter((seg) => seg.kind === kind).reduce((total, seg) => total + (seg.endMinutes - seg.startMinutes), 0);
      const officeMinutes = sum("wfo");
      const homeMinutes = sum("wfh");
      const timeOffMinutes = sum("timeoff");
      const workMode = getWorkModeInfo({ officeMinutes, homeMinutes });
      const requiredMinutes = Math.max(0, Math.round(REQUIRED_WORK_MINUTES$1 - timeOffMinutes));
      const remainingMinutes = Math.max(0, requiredMinutes - employee.workedMinutes);
      const base = {
        title: employee.team ? `${employee.name} · ${employee.team}` : employee.name,
        worked: formatDuration(employee.workedMinutes),
        timeOff: formatDuration(timeOffMinutes),
        required: formatDuration(requiredMinutes),
        remaining: formatDuration(remainingMinutes),
        workMode,
        isDayOffRow: employee.isDayOff
      };
      if (employee.isDayOff) {
        return {
          ...base,
          dayOffSubtitle: "No checkout needed today",
          dayOffMessage: "Off duty and chilling today 🎉"
        };
      }
      if (requiredMinutes === 0) {
        return {
          ...base,
          subtitle: "Today’s checkout plan",
          heroTitle: "Checkout status",
          heroValue: "Full time-off",
          badgeText: "Time off",
          status: "full-time-off",
          primaryChipLabel: "Remaining"
        };
      }
      if (remainingMinutes === 0) {
        return {
          ...base,
          subtitle: "Today’s checkout plan",
          heroTitle: "Checkout status",
          heroValue: "Can check out now",
          badgeText: "Ready",
          status: "ready",
          primaryChipLabel: "Remaining"
        };
      }
      const checkoutTime = new Date(Date.now() + remainingMinutes * 60 * 1e3);
      return {
        ...base,
        subtitle: "Today’s checkout plan",
        heroTitle: "Recommended checkout",
        heroValue: `Checkout at ${formatTime(checkoutTime)}`,
        badgeText: `${formatDuration(remainingMinutes)} left`,
        status: "pending",
        primaryChipLabel: "Remaining"
      };
    };
    function NoDataTooltip({ name }) {
      return /* @__PURE__ */ u("div", { class: "cht-tooltip-body", children: [
        /* @__PURE__ */ u("div", { class: "cht-tooltip-title", children: name }),
        /* @__PURE__ */ u("div", { class: "cht-tooltip-subtitle", children: "No attendance data for today" })
      ] });
    }
    const ensureAllChartContainer = (nativeContainer) => {
      var _a;
      let container = document.getElementById(ALL_CHART_CONTAINER_ID);
      if (container) return container;
      container = document.createElement("div");
      container.id = ALL_CHART_CONTAINER_ID;
      (_a = nativeContainer.parentElement) == null ? void 0 : _a.insertBefore(container, nativeContainer);
      return container;
    };
    let allModeActive = false;
    let lastResponse = null;
    const renderAllTimeline = (response) => {
      const nativeContainer = document.querySelector(NATIVE_CONTAINER_SELECTOR);
      if (!nativeContainer) {
        waitForElement(NATIVE_CONTAINER_SELECTOR, () => renderAllTimeline(response));
        return;
      }
      nativeContainer.style.display = "none";
      const chartContainer = ensureAllChartContainer(nativeContainer);
      const tooltip = ensureTooltip();
      const employees = groupAllEmployees(response.data || {});
      if (!employees.length) return;
      const entries = employees.map(toTimelineEntry$1);
      const windowRange = getSharedWindow(employees);
      const employeeByKey = new Map(employees.map((employee) => [String(employee.userId), employee]));
      const handleHoverLabel = (event, entry) => {
        const employee = employeeByKey.get(entry.key);
        if (!employee) return;
        if (employee.hasNoData) {
          R(/* @__PURE__ */ u(NoDataTooltip, { name: employee.name }), tooltip);
          tooltip.style.display = "block";
          moveTooltip(tooltip, event);
          return;
        }
        const data = buildEmployeeTooltipData(employee);
        const tooltipVNode = data.isDayOffRow ? /* @__PURE__ */ u(
          DayOffTooltip,
          {
            title: data.title,
            subtitle: data.dayOffSubtitle,
            message: data.dayOffMessage
          }
        ) : /* @__PURE__ */ u(
          WorkTooltip,
          {
            title: data.title,
            subtitle: data.subtitle,
            worked: data.worked,
            timeOff: data.timeOff,
            required: data.required,
            remaining: data.remaining,
            heroTitle: data.heroTitle,
            heroValue: data.heroValue,
            badgeText: data.badgeText,
            status: data.status,
            primaryChipLabel: data.primaryChipLabel,
            workMode: data.workMode
          }
        );
        R(tooltipVNode, tooltip);
        tooltip.style.display = "block";
        moveTooltip(tooltip, event);
      };
      const handleHoverSegment = (event, _entry, segment) => {
        R(
          /* @__PURE__ */ u(
            SegmentTooltip,
            {
              kind: segment.kind,
              startMinutes: segment.startMinutes,
              endMinutes: segment.endMinutes
            }
          ),
          tooltip
        );
        tooltip.style.display = "block";
        moveTooltip(tooltip, event);
      };
      R(
        /* @__PURE__ */ u(
          CustomTimeline,
          {
            entries,
            windowRange,
            onHoverLabel: handleHoverLabel,
            onHoverSegment: handleHoverSegment,
            onMove: (event) => moveTooltip(tooltip, event),
            onLeave: () => {
              tooltip.style.display = "none";
            }
          }
        ),
        chartContainer
      );
    };
    const ensureAllModeChartActive = () => {
      if (allModeActive) return;
      allModeActive = true;
      installAjaxInterceptor((data) => {
        lastResponse = data;
        renderAllTimeline(data);
      });
      if (lastResponse) renderAllTimeline(lastResponse);
    };
    const teardownAllModeChart = () => {
      var _a;
      if (!allModeActive) return;
      allModeActive = false;
      const nativeContainer = document.querySelector(NATIVE_CONTAINER_SELECTOR);
      if (nativeContainer) nativeContainer.style.display = "";
      (_a = document.getElementById(ALL_CHART_CONTAINER_ID)) == null ? void 0 : _a.remove();
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
    const REQUIRED_WORK_MINUTES = WORK_DAY_MINUTES;
    const groupMyDays = (rows) => {
      const dayMap = /* @__PURE__ */ new Map();
      rows.forEach((row) => {
        const rawLabel = String(row.my_check_in_date || "");
        const dateLabel = getCleanLabel(rawLabel);
        const dateObj = parseDateLabel(dateLabel);
        if (!dateObj) return;
        let day = dayMap.get(dateLabel);
        if (!day) {
          const type = String(row.type || "");
          const isDayOff = DAY_OFF_TYPES.has(type);
          day = {
            dateLabel,
            dateObj,
            workedMinutes: parseWorkedMinutes(rawLabel) || 0,
            isDayOff,
            dayOffType: isDayOff ? type : void 0,
            segments: []
          };
          dayMap.set(dateLabel, day);
        }
        const kind = classifySegment(row);
        if (!kind) return;
        const startMinutes = parseTimeToMinutes(row.start_time);
        const endMinutes = parseTimeToMinutes(row.end_time);
        if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) return;
        day.segments.push({ kind, startMinutes, endMinutes });
      });
      return [...dayMap.values()].sort((a2, b2) => b2.dateObj.getTime() - a2.dateObj.getTime());
    };
    const toTimelineEntry = (day, isToday) => ({
      key: day.dateLabel,
      label: day.dateLabel,
      sublabel: formatDuration(day.workedMinutes),
      segments: day.segments,
      isDayOff: day.isDayOff,
      dayOffType: day.dayOffType,
      isHighlighted: isToday
    });
    const buildDayTooltipData = ({
      day,
      isToday
    }) => {
      const sum = (kind) => day.segments.filter((seg) => seg.kind === kind).reduce((total, seg) => total + (seg.endMinutes - seg.startMinutes), 0);
      const officeMinutes = sum("wfo");
      const homeMinutes = sum("wfh");
      const timeOffMinutes = sum("timeoff");
      const workMode = getWorkModeInfo({ officeMinutes, homeMinutes });
      const requiredMinutes = Math.max(0, Math.round(REQUIRED_WORK_MINUTES - timeOffMinutes));
      const remainingMinutes = Math.max(0, requiredMinutes - day.workedMinutes);
      const base = {
        title: day.dateLabel,
        worked: formatDuration(day.workedMinutes),
        timeOff: formatDuration(timeOffMinutes),
        required: formatDuration(requiredMinutes),
        remaining: formatDuration(remainingMinutes),
        workMode,
        isDayOffRow: day.isDayOff
      };
      if (day.isDayOff) {
        return {
          ...base,
          dayOffSubtitle: isToday ? "No checkout needed today" : "No checkout was needed for this day",
          dayOffMessage: isToday ? "Off duty and chilling today 🎉" : "A well-earned break was logged 🎉"
        };
      }
      if (requiredMinutes === 0) {
        return {
          ...base,
          subtitle: "Check-in summary",
          heroTitle: "Checkout status",
          heroValue: "Full time-off",
          badgeText: "Time off",
          status: "full-time-off",
          primaryChipLabel: "Remaining"
        };
      }
      if (isToday) {
        if (remainingMinutes === 0) {
          return {
            ...base,
            subtitle: "Your checkout plan",
            heroTitle: "Checkout status",
            heroValue: "Can check out now",
            badgeText: "Ready",
            status: "ready",
            primaryChipLabel: "Remaining"
          };
        }
        const checkoutTime = new Date(Date.now() + remainingMinutes * 60 * 1e3);
        return {
          ...base,
          subtitle: "Your checkout plan",
          heroTitle: "Recommended checkout",
          heroValue: `Checkout at ${formatTime(checkoutTime)}`,
          badgeText: `${formatDuration(remainingMinutes)} left`,
          status: "pending",
          primaryChipLabel: "Remaining"
        };
      }
      if (remainingMinutes === 0) {
        return {
          ...base,
          subtitle: "Check-in summary",
          heroTitle: "Workday status",
          heroValue: "Completed required hours",
          badgeText: "Completed",
          status: "completed",
          primaryChipLabel: "Remaining"
        };
      }
      return {
        ...base,
        subtitle: "Check-in summary",
        heroTitle: "Workday status",
        heroValue: `Short by ${formatDuration(remainingMinutes)}`,
        badgeText: `Short by ${formatDuration(remainingMinutes)}`,
        status: "short",
        primaryChipLabel: "Shortfall"
      };
    };
    const ensureChartContainer = (nativeContainer) => {
      var _a;
      let container = document.getElementById(CHART_CONTAINER_ID);
      if (container) return container;
      container = document.createElement("div");
      container.id = CHART_CONTAINER_ID;
      (_a = nativeContainer.parentElement) == null ? void 0 : _a.insertBefore(container, nativeContainer);
      return container;
    };
    let myModeActive = false;
    let myRefreshTimer = null;
    const renderCustomTimeline = async () => {
      const nativeContainer = document.getElementById("my-checkin-detail");
      if (!nativeContainer) {
        waitForElement("#my-checkin-detail", () => renderCustomTimeline());
        return;
      }
      nativeContainer.style.display = "none";
      const chartContainer = ensureChartContainer(nativeContainer);
      const tooltip = ensureTooltip();
      let rows;
      try {
        const result = await fetchCheckInData(0);
        rows = result.rows;
      } catch (error) {
        console.error("[checkout-hover-helper] Failed to fetch check-in data.", error);
        return;
      }
      const days = groupMyDays(rows);
      if (!days.length) return;
      const today = /* @__PURE__ */ new Date();
      const entries = days.map((day) => toTimelineEntry(day, isSameDate(day.dateObj, today)));
      const windowRange = getSharedWindow(days);
      const dayByKey = new Map(days.map((day) => [day.dateLabel, day]));
      const handleHoverLabel = (event, entry) => {
        const day = dayByKey.get(entry.key);
        if (!day) return;
        const isToday = isSameDate(day.dateObj, /* @__PURE__ */ new Date());
        const data = buildDayTooltipData({ day, isToday });
        const tooltipVNode = data.isDayOffRow ? /* @__PURE__ */ u(
          DayOffTooltip,
          {
            title: data.title,
            subtitle: data.dayOffSubtitle,
            message: data.dayOffMessage
          }
        ) : /* @__PURE__ */ u(
          WorkTooltip,
          {
            title: data.title,
            subtitle: data.subtitle,
            worked: data.worked,
            timeOff: data.timeOff,
            required: data.required,
            remaining: data.remaining,
            heroTitle: data.heroTitle,
            heroValue: data.heroValue,
            badgeText: data.badgeText,
            status: data.status,
            primaryChipLabel: data.primaryChipLabel,
            workMode: data.workMode
          }
        );
        R(tooltipVNode, tooltip);
        tooltip.style.display = "block";
        moveTooltip(tooltip, event);
      };
      const handleHoverSegment = (event, _entry, segment) => {
        R(
          /* @__PURE__ */ u(
            SegmentTooltip,
            {
              kind: segment.kind,
              startMinutes: segment.startMinutes,
              endMinutes: segment.endMinutes
            }
          ),
          tooltip
        );
        tooltip.style.display = "block";
        moveTooltip(tooltip, event);
      };
      R(
        /* @__PURE__ */ u(
          CustomTimeline,
          {
            entries,
            windowRange,
            onHoverLabel: handleHoverLabel,
            onHoverSegment: handleHoverSegment,
            onMove: (event) => moveTooltip(tooltip, event),
            onLeave: () => {
              tooltip.style.display = "none";
            }
          }
        ),
        chartContainer
      );
    };
    const ensureMyModeActive = () => {
      if (myModeActive) return;
      myModeActive = true;
      renderCustomTimeline();
      myRefreshTimer = window.setInterval(renderCustomTimeline, 6e4);
    };
    const teardownMyMode = () => {
      var _a;
      if (!myModeActive) return;
      myModeActive = false;
      if (myRefreshTimer) window.clearInterval(myRefreshTimer);
      myRefreshTimer = null;
      const nativeContainer = document.getElementById("my-checkin-detail");
      if (nativeContainer) nativeContainer.style.display = "";
      (_a = document.getElementById(CHART_CONTAINER_ID)) == null ? void 0 : _a.remove();
    };
    initTheme();
    (() => {
      var _a, _b;
      (_b = (_a = window.__checkoutHoverHelper) == null ? void 0 : _a.destroy) == null ? void 0 : _b.call(_a);
      const helperState = {
        originalPushState: history.pushState,
        originalReplaceState: history.replaceState
      };
      window.__checkoutHoverHelper = helperState;
      const applyForCurrentMode = () => {
        if (getMode() === "my") {
          teardownAllModeChart();
          ensureMyModeActive();
        } else {
          teardownMyMode();
          ensureAllModeChartActive();
        }
      };
      history.pushState = function patchedPushState(...args) {
        const result = helperState.originalPushState.apply(this, args);
        applyForCurrentMode();
        return result;
      };
      history.replaceState = function patchedReplaceState(...args) {
        const result = helperState.originalReplaceState.apply(this, args);
        applyForCurrentMode();
        return result;
      };
      window.addEventListener("popstate", applyForCurrentMode);
      helperState.destroy = () => {
        var _a2;
        teardownMyMode();
        teardownAllModeChart();
        history.pushState = helperState.originalPushState;
        history.replaceState = helperState.originalReplaceState;
        window.removeEventListener("popstate", applyForCurrentMode);
        (_a2 = document.getElementById(TOOLTIP_ID)) == null ? void 0 : _a2.remove();
      };
      applyForCurrentMode();
    })();

  })();

})();