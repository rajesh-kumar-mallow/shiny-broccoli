// ==UserScript==
// @name         Hubble Dracula Theme Host
// @namespace    https://hubble.mallow-tech.com
// @version      1.1.0
// @author       Neon Raven
// @description  Applies saved theme (Auto/Dark/Light/Ayu Mirage) on all Hubble pages
// @license      Unlicense
// @downloadURL  https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/hubble-theme-host.user.js
// @updateURL    https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/hubble-theme-host.user.js
// @match        *://hubble.mallow-tech.com/*
// @tag          theme
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  // ==UserScript==
  // @name         Check-in summary with compensation V2
  // @namespace    https://hubble.mallow-tech.com
  // @version      1.1.0
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
    initTheme();

  })();

})();