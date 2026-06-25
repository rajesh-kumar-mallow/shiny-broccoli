// ==UserScript==
// @name         Hubble Checkout Hover Helper
// @namespace    https://hubble.mallow-tech.com
// @version      1.0.0
// @author       Neon Raven
// @description  Auto checkout helper for Hubble attendance pages
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
  // @version      2026.06.25.1
  // @author       Neon Raven
  // @description  Work log summary with month filter, tooltips, and mini-modals
  // @downloadURL  https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/check-in-summary-with-compensation-v2.user.js
  // @updateURL    https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/check-in-summary-with-compensation-v2.user.js
  // @match        https://hubble.mallow-tech.com/attendance/my-check-in-data*
  // @tag          timesheet
  // @grant        none
  // ==/UserScript==

  (function () {

    const STORAGE_KEY = "hubble-theme";
    const MODES = ["system", "dark", "light"];
    const SWITCHER_ID = "hubble-theme-switcher";
    function getStoredMode() {
      const stored = localStorage.getItem(STORAGE_KEY);
      return MODES.includes(stored) ? stored : "system";
    }
    function applyTheme(mode) {
      document.documentElement.dataset.hubbleTheme = mode;
      const root = document.getElementById(SWITCHER_ID);
      if (root) {
        root.querySelectorAll("[data-mode]").forEach((btn) => {
          btn.classList.toggle("hts-active", btn.dataset.mode === mode);
        });
      }
    }
    function setMode(mode) {
      if (!MODES.includes(mode)) return;
      localStorage.setItem(STORAGE_KEY, mode);
      applyTheme(mode);
    }
    function ensureSwitcher() {
      if (document.getElementById(SWITCHER_ID)) return;
      const root = document.createElement("div");
      root.id = SWITCHER_ID;
      root.innerHTML = `
    <button type="button" data-mode="system" title="System theme">Auto</button>
    <button type="button" data-mode="dark" title="Dark Dracula">Dark</button>
    <button type="button" data-mode="light" title="Light Dracula">Light</button>
  `;
      root.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-mode]");
        if (btn) setMode(btn.dataset.mode);
      });
      document.body.appendChild(root);
      applyTheme(getStoredMode());
    }
    function initThemeSwitcher() {
      if (window.__hubbleThemeSwitcherInit) return;
      window.__hubbleThemeSwitcherInit = true;
      const boot = () => {
        ensureSwitcher();
        applyTheme(getStoredMode());
      };
      if (document.body) boot();
      else document.addEventListener("DOMContentLoaded", boot);
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
        if (getStoredMode() === "system") applyTheme("system");
      });
    }
    initThemeSwitcher();
    (() => {
      var _a, _b;
      (_b = (_a = window.__checkoutHoverHelper) == null ? void 0 : _a.destroy) == null ? void 0 : _b.call(_a);
      const REQUIRED_WORK_MINUTES = 8 * 60;
      const TOOLTIP_ID = "checkout-hover-tooltip";
      const HIGHLIGHT_NAME = "Dheeraj Prakash";
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
      const helperState = {
        applyTimer: null,
        observer: null,
        isApplying: false,
        originalPushState: history.pushState,
        originalReplaceState: history.replaceState
      };
      window.__checkoutHoverHelper = helperState;
      const round = (value, precision = 3) => Math.round(value * 10 ** precision) / 10 ** precision;
      const toNumber = (value) => Number(value || 0);
      const median = (values) => {
        const sorted = values.slice().sort((a, b) => a - b);
        return sorted[Math.floor(sorted.length / 2)];
      };
      const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
      const getMode = () => {
        const path = window.location.pathname;
        if (path.includes("/attendance/my-check-in-data") || document.querySelector("#my-checkin-detail")) {
          return "my";
        }
        return "all";
      };
      const getRoot = (mode) => {
        if (mode === "my") {
          return document.querySelector("#my-checkin-detail") || document.body;
        }
        return document.querySelector("#all-checkin-detail") || document.querySelector("#all-check-in-detail") || document.body;
      };
      const parseWorkedMinutes = (text) => {
        const match = text.match(/\(\s*(\d+)\s*hrs?\s+(\d+)\s*mins?\s*\)/i);
        if (!match) return null;
        return Number(match[1]) * 60 + Number(match[2]);
      };
      const getCleanLabel = (text) => text.replace(/\s*\([^)]*\)\s*$/, "").trim();
      const parseTimeLabelMinutes = (text) => {
        const match = text.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (!match) return null;
        let hours = Number(match[1]);
        const minutes = Number(match[2]);
        const meridiem = match[3].toUpperCase();
        if (meridiem === "PM" && hours !== 12) hours += 12;
        if (meridiem === "AM" && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };
      const parseDateLabel = (label) => {
        const match = label.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/);
        if (!match) return null;
        const day = Number(match[1]);
        const month = MONTHS[match[2].toLowerCase()];
        const year = Number(match[3]);
        if (month === void 0) return null;
        return new Date(year, month, day);
      };
      const isSameDate = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
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
      const getBBoxSafe = (el) => {
        try {
          return el.getBBox();
        } catch {
          return null;
        }
      };
      const getFill = (el) => {
        const fill = (el.getAttribute("fill") || "").trim().toLowerCase();
        if (fill) return fill;
        return (window.getComputedStyle(el).fill || "").trim().toLowerCase();
      };
      const getRgb = (color) => {
        const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/i);
        if (!rgbMatch) return null;
        return {
          r: Number(rgbMatch[1]),
          g: Number(rgbMatch[2]),
          b: Number(rgbMatch[3])
        };
      };
      const isTimeOffColor = (color) => {
        if (!color) return false;
        const normalizedColor = color.toLowerCase();
        if (["#ff4f00", "#ff5000", "#f4511e", "#e24301", "#ff5722"].includes(normalizedColor)) {
          return true;
        }
        const rgb = getRgb(normalizedColor);
        if (!rgb) return false;
        return rgb.r >= 180 && rgb.g <= 120 && rgb.b <= 90;
      };
      const isDayOffColor = (color) => {
        if (!color) return false;
        const normalizedColor = color.toLowerCase();
        if (["#cd0404", "#b91c1c", "#dc2626"].includes(normalizedColor)) {
          return true;
        }
        const rgb = getRgb(normalizedColor);
        if (!rgb) return false;
        return rgb.r >= 150 && rgb.g <= 60 && rgb.b <= 60;
      };
      const isWfoColor = (color) => {
        if (!color) return false;
        const normalizedColor = color.toLowerCase();
        if (["#22914b", "#22c55e", "#16a34a", "#15803d", "#008000", "green"].includes(normalizedColor)) {
          return true;
        }
        const rgb = getRgb(normalizedColor);
        if (!rgb) return false;
        return rgb.g >= 110 && rgb.r <= 90 && rgb.b <= 120;
      };
      const isWfhColor = (color) => {
        if (!color) return false;
        const normalizedColor = color.toLowerCase();
        if (["#0066cc", "#1976d2", "#2563eb", "#1d4ed8", "#0ea5e9", "blue"].includes(normalizedColor)) {
          return true;
        }
        const rgb = getRgb(normalizedColor);
        if (!rgb) return false;
        return rgb.b >= 140 && rgb.r <= 100 && rgb.g <= 170;
      };
      const isDayOffText = (text) => {
        const value = text.trim().toLowerCase();
        if (value.includes("time off")) return false;
        return /day\s*off|week\s*off|weekly\s*off|holiday|off\s*day/i.test(value);
      };
      const pickAttendanceSvg = (root) => {
        var _a2;
        const svgs = [...root.querySelectorAll("svg")];
        return (_a2 = svgs.map((svg) => {
          const workedTextCount = [...svg.querySelectorAll("text")].filter(
            (text) => parseWorkedMinutes(text.textContent.trim()) !== null
          ).length;
          const barCount = [...svg.querySelectorAll("rect")].filter((rect) => {
            const x = toNumber(rect.getAttribute("x"));
            const width = toNumber(rect.getAttribute("width"));
            const height = toNumber(rect.getAttribute("height"));
            return x > 100 && width > 2 && height > 5;
          }).length;
          const verticalLineCount = [...svg.querySelectorAll("path")].filter((path) => {
            const box = getBBoxSafe(path);
            return box && box.x > 100 && box.width <= 2 && box.height > 20;
          }).length;
          return {
            svg,
            score: workedTextCount * 100 + barCount * 10 + verticalLineCount
          };
        }).sort((a, b) => b.score - a.score)[0]) == null ? void 0 : _a2.svg;
      };
      const getVerticalGridXs = (svg) => {
        const xs = [];
        [...svg.querySelectorAll("path")].forEach((path) => {
          const box = getBBoxSafe(path);
          if (!box) return;
          const isVerticalGridLine = box.x > 100 && box.width <= 2 && box.height > 20;
          if (isVerticalGridLine) {
            xs.push(round(box.x));
          }
        });
        const sortedXs = xs.sort((a, b) => a - b);
        const uniqueXs = [];
        sortedXs.forEach((x) => {
          const lastX = uniqueXs[uniqueXs.length - 1];
          if (lastX === void 0 || Math.abs(x - lastX) > 1) {
            uniqueXs.push(x);
          }
        });
        return uniqueXs;
      };
      const getDominantGridGap = (xs) => {
        const diffs = xs.slice(1).map((x, index) => x - xs[index]).filter((diff) => diff > 20 && diff < 220);
        if (!diffs.length) return null;
        const buckets = /* @__PURE__ */ new Map();
        diffs.forEach((diff) => {
          const key = Math.round(diff);
          const bucket = buckets.get(key) || {
            count: 0,
            total: 0
          };
          bucket.count += 1;
          bucket.total += diff;
          buckets.set(key, bucket);
        });
        const dominantBucket = [...buckets.values()].sort((a, b) => b.count - a.count)[0];
        return dominantBucket.total / dominantBucket.count;
      };
      const inferPxPerMinuteFromTimeLabels = (root) => {
        const points = [...root.querySelectorAll("svg text")].map((text) => {
          const minutes = parseTimeLabelMinutes(text.textContent || "");
          if (minutes === null) return null;
          return {
            x: toNumber(text.getAttribute("x")),
            minutes
          };
        }).filter(Boolean).sort((a, b) => a.x - b.x);
        const candidates = [];
        for (let index = 0; index < points.length - 1; index += 1) {
          const current = points[index];
          const next = points[index + 1];
          const pxDiff = next.x - current.x;
          const minuteDiff = next.minutes - current.minutes;
          if (pxDiff > 20 && minuteDiff > 0 && minuteDiff <= 180) {
            candidates.push(pxDiff / minuteDiff);
          }
        }
        if (!candidates.length) return null;
        return median(candidates);
      };
      const inferPxPerMinute = ({ root, gridXs, mode }) => {
        const fromTimeLabels = inferPxPerMinuteFromTimeLabels(root);
        if (fromTimeLabels) return fromTimeLabels;
        const gridGapPx = getDominantGridGap(gridXs);
        if (!gridGapPx) return null;
        return gridGapPx / (mode === "my" ? 30 : 60);
      };
      const getAxisTicks = (root) => {
        const ticks = [...root.querySelectorAll("svg text")].map((text) => {
          const minutes = parseTimeLabelMinutes(text.textContent || "");
          if (minutes === null) return null;
          return {
            x: toNumber(text.getAttribute("x")),
            minutes
          };
        }).filter(Boolean).sort((a, b) => a.x - b.x);
        const uniqueTicks = [];
        ticks.forEach((tick) => {
          const lastTick = uniqueTicks[uniqueTicks.length - 1];
          if (!lastTick || Math.abs(lastTick.x - tick.x) > 1) {
            uniqueTicks.push(tick);
          }
        });
        return uniqueTicks;
      };
      const getNearestAxisTick = ({ x, axisTicks, pxPerMinute }) => {
        const tolerancePx = Math.max(4, pxPerMinute * 4);
        let nearestTick = null;
        let nearestDiff = Infinity;
        axisTicks.forEach((tick) => {
          const diff = Math.abs(tick.x - x);
          if (diff < nearestDiff) {
            nearestDiff = diff;
            nearestTick = tick;
          }
        });
        return nearestDiff <= tolerancePx ? nearestTick : null;
      };
      const getMinutesFromX = ({ x, axisTicks, pxPerMinute }) => {
        const nearestTick = getNearestAxisTick({
          x,
          axisTicks,
          pxPerMinute
        });
        if (nearestTick) {
          return nearestTick.minutes;
        }
        const previousTick = [...axisTicks].reverse().find((tick) => tick.x <= x);
        const nextTick = axisTicks.find((tick) => tick.x >= x);
        if (!previousTick || !nextTick || previousTick.x === nextTick.x) {
          return null;
        }
        const progress = (x - previousTick.x) / (nextTick.x - previousTick.x);
        return previousTick.minutes + progress * (nextTick.minutes - previousTick.minutes);
      };
      const getRectDurationMinutes = ({ rect, axisTicks, pxPerMinute }) => {
        const startMinutes = getMinutesFromX({
          x: rect.x,
          axisTicks,
          pxPerMinute
        });
        const endMinutes = getMinutesFromX({
          x: rect.x + rect.width,
          axisTicks,
          pxPerMinute
        });
        if (Number.isFinite(startMinutes) && Number.isFinite(endMinutes) && endMinutes >= startMinutes) {
          return endMinutes - startMinutes;
        }
        return rect.width / pxPerMinute;
      };
      const getTotalRectDurationMinutes = ({ rowRects, predicate, axisTicks, pxPerMinute }) => {
        return rowRects.filter((rect) => predicate(rect.fill)).reduce(
          (total, rect) => total + getRectDurationMinutes({
            rect,
            axisTicks,
            pxPerMinute
          }),
          0
        );
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
      const getChipHtml = ({ label, value, variant = "default" }) => `
    <div class="cht-chip cht-chip--${variant}">
      <div class="cht-chip-label">${label}</div>
      <div class="cht-chip-value">${value}</div>
    </div>
  `;
      const getWorkModeInfo = ({ officeMinutes, homeMinutes }) => {
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
      const getWorkModeHtml = (workMode) => {
        if (!workMode || workMode.type === "none") {
          return "";
        }
        const modeText = workMode.type === "wfo" ? `WFO · ${formatDuration(workMode.officeMinutes)}` : workMode.type === "wfh" ? `WFH · ${formatDuration(workMode.homeMinutes)}` : `Hybrid · WFO ${formatDuration(
      workMode.officeMinutes
    )} · WFH ${formatDuration(workMode.homeMinutes)}`;
        return `
      <div class="cht-work-mode-wrap">
        <div class="cht-work-mode cht-work-mode--${workMode.type}">
          <span class="cht-work-mode-dot"></span>
          <span>${escapeHtml(modeText)}</span>
        </div>
      </div>
    `;
      };
      const getStatusClass = (status) => {
        const valid = ["pending", "short", "ready", "completed", "full-time-off"];
        return valid.includes(status) ? status : "pending";
      };
      const getWorkTooltipHtml = ({
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
      }) => {
        const safeTitle = escapeHtml(title);
        const safeSubtitle = escapeHtml(subtitle);
        const safeHeroTitle = escapeHtml(heroTitle);
        const safeHeroValue = escapeHtml(heroValue);
        const safeBadgeText = escapeHtml(badgeText);
        const statusClass = getStatusClass(status);
        return `
      <div class="cht-tooltip-body cht-status--${statusClass}">
        <div class="cht-tooltip-header">
          <div class="cht-tooltip-header-text">
            <div class="cht-tooltip-title">${safeTitle}</div>
            <div class="cht-tooltip-subtitle">${safeSubtitle}</div>
          </div>
          <div class="cht-tooltip-badge">${safeBadgeText}</div>
        </div>

        <div class="cht-tooltip-hero">
          <div class="cht-tooltip-hero-label">${safeHeroTitle}</div>
          <div class="cht-tooltip-hero-value">${safeHeroValue}</div>
        </div>

        <div class="cht-tooltip-chips">
          ${getChipHtml({
      label: primaryChipLabel,
      value: remaining,
      variant: "accent"
    })}
          ${getChipHtml({
      label: "Worked",
      value: worked
    })}
          ${getChipHtml({
      label: "Time off",
      value: timeOff
    })}
          ${getChipHtml({
      label: "Required",
      value: required
    })}
        </div>

        ${getWorkModeHtml(workMode)}
      </div>
    `;
      };
      const getDayOffTooltipHtml = ({ title, subtitle, message }) => {
        const safeTitle = escapeHtml(title);
        const safeSubtitle = escapeHtml(subtitle);
        const safeMessage = escapeHtml(message);
        return `
      <div class="cht-tooltip-body cht-dayoff">
        <div class="cht-dayoff-header">
          <div class="cht-dayoff-icon">🎉</div>
          <div class="cht-tooltip-header-text">
            <div class="cht-tooltip-title">${safeTitle}</div>
            <div class="cht-dayoff-subtitle">${safeSubtitle}</div>
          </div>
        </div>
        <div class="cht-dayoff-card">
          <div class="cht-dayoff-title">Day Off</div>
          <div class="cht-dayoff-message">${safeMessage}</div>
        </div>
      </div>
    `;
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
      const getRowTexts = ({ allTexts, row }) => {
        return allTexts.filter((text) => {
          if (text === row.text) return false;
          const y = toNumber(text.getAttribute("y"));
          return Math.abs(y - row.y) <= 30;
        });
      };
      const shouldHighlightRow = ({ mode, row }) => {
        if (mode === "all") {
          return row.label.trim().toLowerCase() === HIGHLIGHT_NAME.toLowerCase();
        }
        const rowDate = parseDateLabel(row.label);
        return isSameDate(rowDate, /* @__PURE__ */ new Date());
      };
      const storeOriginalTextAttrs = (text) => {
        if (!text.hasAttribute("data-checkout-original-fill")) {
          text.setAttribute("data-checkout-original-fill", text.getAttribute("fill") || "");
        }
        if (!text.hasAttribute("data-checkout-original-font-weight")) {
          text.setAttribute(
            "data-checkout-original-font-weight",
            text.getAttribute("font-weight") || ""
          );
        }
      };
      const resetTextAttrs = (text) => {
        if (text.hasAttribute("data-checkout-original-fill")) {
          const originalFill = text.getAttribute("data-checkout-original-fill");
          if (originalFill) {
            text.setAttribute("fill", originalFill);
          } else {
            text.removeAttribute("fill");
          }
          text.removeAttribute("data-checkout-original-fill");
        }
        if (text.hasAttribute("data-checkout-original-font-weight")) {
          const originalFontWeight = text.getAttribute("data-checkout-original-font-weight");
          if (originalFontWeight) {
            text.setAttribute("font-weight", originalFontWeight);
          } else {
            text.removeAttribute("font-weight");
          }
          text.removeAttribute("data-checkout-original-font-weight");
        }
      };
      const applyRowHighlight = ({ row, mode, svg }) => {
        var _a2, _b2;
        const SVG_NS = "http://www.w3.org/2000/svg";
        const textBox = getBBoxSafe(row.text);
        if (!textBox) return;
        const svgBox = getBBoxSafe(svg);
        const chartWidth = (svgBox == null ? void 0 : svgBox.width) || Number(svg.getAttribute("width")) || ((_b2 = (_a2 = svg.viewBox) == null ? void 0 : _a2.baseVal) == null ? void 0 : _b2.width) || window.innerWidth;
        const isAllCheckIn = mode === "all";
        const bandY = row.y - 27;
        const bandHeight = 42;
        const highlightGroup = document.createElementNS(SVG_NS, "g");
        highlightGroup.setAttribute("data-checkout-helper", "true");
        highlightGroup.setAttribute("pointer-events", "none");
        const rowBand = document.createElementNS(SVG_NS, "rect");
        rowBand.setAttribute("x", "0");
        rowBand.setAttribute("y", String(bandY));
        rowBand.setAttribute("width", String(chartWidth));
        rowBand.setAttribute("height", String(bandHeight));
        rowBand.setAttribute("rx", "8");
        rowBand.setAttribute("fill", isAllCheckIn ? "#2248c315" : "#eff6ff");
        rowBand.setAttribute("opacity", "0.85");
        const leftRail = document.createElementNS(SVG_NS, "rect");
        leftRail.setAttribute("x", "0");
        leftRail.setAttribute("y", String(bandY));
        leftRail.setAttribute("width", "8");
        leftRail.setAttribute("height", String(bandHeight));
        leftRail.setAttribute("rx", "4");
        leftRail.setAttribute("fill", isAllCheckIn ? "#2248c3" : "#2563eb");
        highlightGroup.appendChild(rowBand);
        highlightGroup.appendChild(leftRail);
        row.text.parentNode.insertBefore(highlightGroup, row.text);
        storeOriginalTextAttrs(row.text);
        row.text.setAttribute("font-weight", "900");
        row.text.setAttribute("fill", isAllCheckIn ? "#0d0c1d" : "#1e3a8a");
      };
      const buildRowTooltipData = ({ mode, row, rowRects, rowTexts, pxPerMinute, axisTicks }) => {
        const timeOffMinutes = getTotalRectDurationMinutes({
          rowRects,
          predicate: isTimeOffColor,
          axisTicks,
          pxPerMinute
        });
        const officeMinutes = getTotalRectDurationMinutes({
          rowRects,
          predicate: isWfoColor,
          axisTicks,
          pxPerMinute
        });
        const homeMinutes = getTotalRectDurationMinutes({
          rowRects,
          predicate: isWfhColor,
          axisTicks,
          pxPerMinute
        });
        const workMode = getWorkModeInfo({
          officeMinutes,
          homeMinutes
        });
        const requiredMinutes = Math.max(0, Math.round(REQUIRED_WORK_MINUTES - timeOffMinutes));
        const remainingMinutes = Math.max(0, requiredMinutes - row.workedMinutes);
        const isDayOffRow = rowTexts.some((text) => isDayOffText(text.textContent || "")) || rowRects.some((rect) => isDayOffColor(rect.fill));
        const rowDate = parseDateLabel(row.label);
        const isMyToday = mode === "my" && isSameDate(rowDate, /* @__PURE__ */ new Date());
        const isLiveMode = mode === "all" || isMyToday;
        const base = {
          title: row.label,
          worked: formatDuration(row.workedMinutes),
          timeOff: formatDuration(timeOffMinutes),
          required: formatDuration(requiredMinutes),
          remaining: formatDuration(remainingMinutes),
          workMode,
          isDayOffRow
        };
        if (isDayOffRow) {
          const shouldUseTodayMessage = mode === "all" || isMyToday;
          return {
            ...base,
            dayOffSubtitle: shouldUseTodayMessage ? "No checkout needed today" : "No checkout was needed for this day",
            dayOffMessage: shouldUseTodayMessage ? "Off duty and chilling today 🎉" : "A well-earned break was logged 🎉"
          };
        }
        if (requiredMinutes === 0) {
          return {
            ...base,
            subtitle: mode === "my" ? "Check-in summary" : "Today’s checkout plan",
            heroTitle: "Checkout status",
            heroValue: "Full time-off",
            badgeText: "Time off",
            status: "full-time-off",
            primaryChipLabel: "Remaining"
          };
        }
        if (isLiveMode) {
          if (remainingMinutes === 0) {
            return {
              ...base,
              subtitle: mode === "my" ? "Your checkout plan" : "Today’s checkout plan",
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
            subtitle: mode === "my" ? "Your checkout plan" : "Today’s checkout plan",
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
      const applyCheckoutHover = () => {
        helperState.isApplying = true;
        try {
          const mode = getMode();
          const root = getRoot(mode);
          const tooltip = ensureTooltip();
          const svg = pickAttendanceSvg(root);
          if (!svg) return;
          [...svg.querySelectorAll("[data-checkout-helper='true']")].forEach((el) => el.remove());
          [
            ...svg.querySelectorAll(
              "[data-checkout-original-fill], [data-checkout-original-font-weight]"
            )
          ].forEach(resetTextAttrs);
          const gridXs = getVerticalGridXs(svg);
          const leftBoundary = gridXs.length ? Math.min(...gridXs) : 250;
          const pxPerMinute = inferPxPerMinute({
            root,
            gridXs,
            mode
          });
          const axisTicks = getAxisTicks(root);
          if (!pxPerMinute || !axisTicks.length) {
            console.error("Unable to calculate chart time scale.");
            console.log("Detected grid X values:", gridXs);
            console.log("Detected axis ticks:", axisTicks);
            return;
          }
          const allTexts = [...svg.querySelectorAll("text")];
          const rowTexts = allTexts.filter((text) => {
            const content = text.textContent.trim();
            const x = toNumber(text.getAttribute("x"));
            return parseWorkedMinutes(content) !== null && x < leftBoundary + 20;
          });
          const rows = rowTexts.map((text) => ({
            text,
            content: text.textContent.trim(),
            label: getCleanLabel(text.textContent.trim()),
            x: toNumber(text.getAttribute("x")),
            y: toNumber(text.getAttribute("y")),
            workedMinutes: parseWorkedMinutes(text.textContent.trim())
          }));
          const rects = [...svg.querySelectorAll("rect")].map((rect) => ({
            el: rect,
            x: toNumber(rect.getAttribute("x")),
            y: toNumber(rect.getAttribute("y")),
            width: toNumber(rect.getAttribute("width")),
            height: toNumber(rect.getAttribute("height")),
            fill: getFill(rect)
          })).filter((rect) => rect.x > leftBoundary - 5 && rect.width > 2 && rect.height > 5);
          const findNearestRow = (rect) => {
            const rectCenterY = rect.y + rect.height / 2;
            let nearestRow = null;
            let nearestDiff = Infinity;
            rows.forEach((row) => {
              const diff = Math.abs(row.y - rectCenterY);
              if (diff < nearestDiff) {
                nearestDiff = diff;
                nearestRow = row;
              }
            });
            return nearestDiff <= 45 ? nearestRow : null;
          };
          const rectsByRow = /* @__PURE__ */ new Map();
          rects.forEach((rect) => {
            const row = findNearestRow(rect);
            if (!row) return;
            if (!rectsByRow.has(row)) {
              rectsByRow.set(row, []);
            }
            rectsByRow.get(row).push(rect);
          });
          const results = [];
          rows.forEach((row) => {
            const rowRects = rectsByRow.get(row) || [];
            const relatedRowTexts = getRowTexts({
              allTexts,
              row
            });
            row.text.style.cursor = "";
            row.text.style.textDecoration = "";
            row.text.style.textDecorationLine = "";
            row.text.style.textDecorationStyle = "";
            row.text.style.textDecorationColor = "";
            row.text.onmouseenter = null;
            row.text.onmousemove = null;
            row.text.onmouseleave = null;
            const isHighlighted = shouldHighlightRow({ mode, row });
            if (isHighlighted) {
              applyRowHighlight({
                row,
                mode,
                svg
              });
            }
            const data = buildRowTooltipData({
              mode,
              row,
              rowRects,
              rowTexts: relatedRowTexts,
              pxPerMinute,
              axisTicks
            });
            let tooltipHtml = "";
            if (data.isDayOffRow) {
              tooltipHtml = getDayOffTooltipHtml({
                title: data.title,
                subtitle: data.dayOffSubtitle,
                message: data.dayOffMessage
              });
            } else {
              tooltipHtml = getWorkTooltipHtml({
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
              });
            }
            row.text.onmouseenter = (event) => {
              tooltip.innerHTML = tooltipHtml;
              tooltip.style.display = "block";
              moveTooltip(tooltip, event);
            };
            row.text.onmousemove = (event) => {
              moveTooltip(tooltip, event);
            };
            row.text.onmouseleave = () => {
              tooltip.style.display = "none";
            };
            results.push({
              mode,
              label: row.label,
              highlighted: isHighlighted,
              workMode: data.workMode.label,
              workModeSplit: data.workMode.subtitle,
              worked: data.worked,
              timeOff: data.timeOff,
              required: data.required,
              remaining: data.remaining,
              status: data.isDayOffRow ? data.dayOffMessage : data.heroValue
            });
          });
          console.table(results);
          console.log(
            `Checkout hover enabled for ${results.length} rows on ${mode === "my" ? "my check-in" : "all check-in"} page`
          );
        } finally {
          window.setTimeout(() => {
            helperState.isApplying = false;
          }, 100);
        }
      };
      const scheduleApply = () => {
        window.clearTimeout(helperState.applyTimer);
        helperState.applyTimer = window.setTimeout(() => {
          applyCheckoutHover();
        }, 250);
      };
      history.pushState = function patchedPushState(...args) {
        const result = helperState.originalPushState.apply(this, args);
        scheduleApply();
        return result;
      };
      history.replaceState = function patchedReplaceState(...args) {
        const result = helperState.originalReplaceState.apply(this, args);
        scheduleApply();
        return result;
      };
      window.addEventListener("popstate", scheduleApply);
      window.addEventListener("resize", scheduleApply);
      helperState.observer = new MutationObserver((records) => {
        if (helperState.isApplying) return;
        const onlyTooltipChanged = records.every((record) => {
          const target = record.target;
          return target instanceof Element && (target.id === TOOLTIP_ID || target.closest(`#${TOOLTIP_ID}`));
        });
        if (onlyTooltipChanged) return;
        scheduleApply();
      });
      helperState.observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      helperState.destroy = () => {
        var _a2, _b2, _c;
        window.clearTimeout(helperState.applyTimer);
        (_b2 = (_a2 = helperState.observer) == null ? void 0 : _a2.disconnect) == null ? void 0 : _b2.call(_a2);
        history.pushState = helperState.originalPushState;
        history.replaceState = helperState.originalReplaceState;
        window.removeEventListener("popstate", scheduleApply);
        window.removeEventListener("resize", scheduleApply);
        (_c = document.getElementById(TOOLTIP_ID)) == null ? void 0 : _c.remove();
        document.querySelectorAll("[data-checkout-helper='true']").forEach((el) => el.remove());
        document.querySelectorAll("[data-checkout-original-fill], [data-checkout-original-font-weight]").forEach(resetTextAttrs);
      };
      applyCheckoutHover();
    })();

  })();

})();