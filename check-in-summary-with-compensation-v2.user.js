// ==UserScript==
// @name         Check-in summary with compensation V2
// @namespace    https://hubble.mallow-tech.com
// @version      2026-05-26
// @updateURL    https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/main/check-in-summary-with-compensation-v2.user.js
// @downloadURL  https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/main/check-in-summary-with-compensation-v2.user.js
// @description  Work log summary with month filter, tooltips, and mini-modals
// @author       You
// @match        https://hubble.mallow-tech.com/attendance/my-check-in-data*
// @grant        none
// @tag          timesheet
// ==/UserScript==

(async function addSimpleWorkLogSummary() {
    const CONFIG = {
      checkInApiUrl: "https://hubble.mallow-tech.com/attendance/get-my-check-in-data",
      timesheetApiUrl: "https://hubble.mallow-tech.com/v2/timesheet-entries",
      cardId: "custom-work-log-summary-card",
      styleId: "custom-work-log-summary-style",
      oldIds: ["custom-timeoff-compensation-card", "custom-work-log-summary-card"],
      oldStyleIds: ["custom-timeoff-compensation-style", "custom-compensation-summary-style", "custom-work-log-summary-style"],
      workDayMinutes: 8 * 60,
      weekendDays: [0, 6],
      maxTimesheetPages: 50,
      compareByRoundedHours: true,
      ignoreTodayForTimesheetMismatch: true,
      timeOffTypes: new Set(["Time Off","Day Start Time Off","Attendance Time Off","attendance-time-off","day-start-time-off"]),
      workTypes: new Set(["login","Check In","Check In Office","Check In Home"]),
      dayOffLabels: new Set(["Day Off","Comp Off","On Duty"]),
    };
  
    // ─── Utils ────────────────────────────────────────────────────────────────────
    const pad = (v) => String(v).padStart(2, "0");
    const escapeHtml = (v) => String(v ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
    const stripHtml = (v) => { const d = document.createElement("div"); d.innerHTML = String(v ?? ""); return d.textContent || d.innerText || ""; };
    const toYMD = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  
    // ─── Dynamic month range (offset: 0 = current, -1 = last month, etc.) ────────
    const getMonthRange = (offset = 0) => {
      const now = new Date();
      const y = now.getFullYear();
      const m = now.getMonth() + offset; // JS handles overflow
      const start = new Date(y, m, 1);
      const end   = new Date(y, m + 1, 0);
      return { startDate: toYMD(start), endDate: toYMD(end) };
    };
  
    // Build last N months metadata for the picker
    const buildMonthOptions = (count = 6) => {
      const now = new Date();
      const months = [];
      for (let i = 0; i >= -(count - 1); i--) {
        const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
        months.push({
          offset: i,
          label: i === 0 ? "This month" : i === -1 ? "Last month" : d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
          shortLabel: d.toLocaleDateString("en-IN", { month: "short" }),
          year: d.getFullYear(),
          month: d.getMonth(),
          fullLabel: d.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
        });
      }
      return months;
    };
  
    const parseDate = (value) => {
      if (!value) return null;
      const text = stripHtml(value).trim().replace(",", "");
      if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return new Date(`${text}T00:00:00`);
      if (window.moment) { const p = window.moment(text, ["YYYY-MM-DD","DD MMM YYYY","DD MMMM YYYY","MM/DD/YYYY","DD-MM-YYYY","DD/MM/YYYY","DD/MMM/YYYY","MMM DD YYYY","MMMM DD YYYY"], true); if (p.isValid()) return p.toDate(); }
      const n = new Date(text); return isNaN(n.getTime()) ? null : n;
    };
    const formatDisplayDate = (v) => { const d = parseDate(v); if (!d) return v || "-"; return d.toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }); };
    const parseTimeToMinutes = (time) => {
      if (!time) return null;
      const v = stripHtml(time).trim();
      const m = v.match(/^(\d{1,2}):(\d{2})(?::\d{2})?(?:\s?(AM|PM))?$/i);
      if (!m) return null;
      let h = Number(m[1]); const min = Number(m[2]); const mer = m[3]?.toUpperCase();
      if (mer === "PM" && h !== 12) h += 12;
      if (mer === "AM" && h === 12) h = 0;
      return h * 60 + min;
    };
    const parseTimesheetDurationToMinutes = (value) => {
      if (value === null || typeof value === "undefined") return 0;
      if (typeof value === "number") return isFinite(value) ? Math.round(value * 60) : 0;
      const text = stripHtml(value).trim().toLowerCase();
      if (!text || text === "-" || text === "null") return 0;
      const n = Number(text); if (isFinite(n)) return Math.round(n * 60);
      let total = 0, matched = false;
      const hm = text.match(/(\d+(?:\.\d+)?)\s*(h|hr|hrs|hour|hours)\b/i); if (hm) { total += Math.round(Number(hm[1])*60); matched = true; }
      const mm = text.match(/(\d+)\s*(m|min|mins|minute|minutes)\b/i); if (mm) { total += Number(mm[1]); matched = true; }
      if (matched) return total;
      const hhmm = text.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/); if (hhmm) return Number(hhmm[1])*60+Number(hhmm[2]);
      return 0;
    };
    const formatMinutes = (total) => { const s = Math.max(0, Math.round(total||0)); const h = Math.floor(s/60), m = s%60; if (h && m) return `${h}h ${m}m`; if (h) return `${h}h`; return `${m}m`; };
    const formatSignedMinutes = (min) => { const v = Math.round(min||0); if (v === 0) return "0m"; return `${v > 0 ? "+" : "−"}${formatMinutes(Math.abs(v))}`; };
    const roundedHour = (min) => Math.round((min||0)/60);
    const isToday = (d) => d && toYMD(d) === toYMD(new Date());
    const getCurrentMinutes = () => { const now = new Date(); return now.getHours()*60+now.getMinutes(); };
    const getDurationMinutes = (start, end, date, allowRunning=false) => {
      const s = parseTimeToMinutes(start); let e = parseTimeToMinutes(end);
      if (e === null && allowRunning && isToday(date)) e = getCurrentMinutes();
      if (s === null || e === null || e <= s) return 0; return e - s;
    };
    const getTypeLabel = (row) => {
      const t = row.type || "";
      if (["Day Start Time Off","Attendance Time Off","attendance-time-off","day-start-time-off"].includes(t)) return "Time Off";
      if (t === "Day Off" && row.leave_category === "comp_off") return "Comp Off";
      if (t === "Day Off" && row.leave_category === "on_duty") return "On Duty";
      return t || "-";
    };
    const flattenAttendanceData = (data) => Object.entries(data||{}).flatMap(([key, rows]) => (rows||[]).map((r) => ({ date: r.my_check_in_date||key, ...r })));
    const getCsrfToken = () => document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "";
    const getLoggedInUserId = () => { const href = document.querySelector('a[href*="/users/"][href*="/profile"]')?.getAttribute("href"); return href?.match(/\/users\/(\d+)\/profile/)?.[1] || ""; };
    const getTimesheetRecordTitle = (row) => [row.project_name, row.module_name, row.task_name].filter(Boolean).join(" / ") || "-";
    const removePreviousArtifacts = () => { CONFIG.oldIds.forEach((id) => document.getElementById(id)?.remove()); CONFIG.oldStyleIds.forEach((id) => document.getElementById(id)?.remove()); };
  
    // ─── Module-level state ───────────────────────────────────────────────────────
    let _state = null;
    let _isExpanded = false;
    let _monthOffset = 0; // 0 = current month, -1 = last month, etc.
  
    // ─── Icons ────────────────────────────────────────────────────────────────────
    const ICONS = {
      check:   `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="2.5,8 6,11.5 13.5,4.5"/></svg>`,
      warn:    `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2L14.5 13H1.5L8 2z"/><line x1="8" y1="7" x2="8" y2="10"/><circle cx="8" cy="12" r="0.5" fill="currentColor"/></svg>`,
      error:   `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><line x1="8" y1="5" x2="8" y2="8.5"/><circle cx="8" cy="11" r="0.5" fill="currentColor"/></svg>`,
      muted:   `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><line x1="8" y1="5" x2="8" y2="9"/><circle cx="8" cy="11.5" r="0.5" fill="currentColor"/></svg>`,
      refresh: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.5 2.5A7 7 0 1 0 14 9"/><polyline points="14,2.5 13.5,6 10,5.5"/></svg>`,
      list:    `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="4" x2="12" y2="4"/><line x1="4" y1="8" x2="12" y2="8"/><line x1="4" y1="12" x2="8" y2="12"/></svg>`,
      close:   `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/></svg>`,
      clock:   `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="8" cy="8" r="6"/><polyline points="8,5 8,8 10.5,10"/></svg>`,
      report:  `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="2" width="10" height="12" rx="1.5"/><line x1="6" y1="6" x2="10" y2="6"/><line x1="6" y1="9" x2="10" y2="9"/><line x1="6" y1="12" x2="8" y2="12"/></svg>`,
      table:   `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="2" width="12" height="12" rx="1.5"/><line x1="2" y1="6" x2="14" y2="6"/><line x1="2" y1="10" x2="14" y2="10"/><line x1="7" y1="6" x2="7" y2="14"/></svg>`,
      plus:    `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="3" x2="8" y2="13"/><line x1="3" y1="8" x2="13" y2="8"/></svg>`,
      cal:     `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="3" width="12" height="11" rx="1.5"/><line x1="2" y1="7" x2="14" y2="7"/><line x1="5" y1="2" x2="5" y2="4"/><line x1="11" y1="2" x2="11" y2="4"/></svg>`,
      entries: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 2H4a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 4 14h8a1.5 1.5 0 0 0 1.5-1.5V7L9 2z"/><polyline points="9,2 9,7 13.5,7"/></svg>`,
      chevron: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4,6 8,10 12,6"/></svg>`,
    };
    const icon = (name, size) => {
      const s = size || 14;
      return `<span style="display:inline-flex;width:${s}px;height:${s}px;flex-shrink:0;align-items:center;justify-content:center">${ICONS[name]||""}</span>`;
    };
  
    // ─── Styles ───────────────────────────────────────────────────────────────────
    const createStyles = () => {
      removePreviousArtifacts();
      const style = document.createElement("style");
      style.id = CONFIG.styleId;
      style.textContent = `
        /* ── Root ── */
        #${CONFIG.cardId} {
          position: relative;
          margin: 0 0 12px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 14px;
          color: #1e293b;
        }
        #${CONFIG.cardId} * { box-sizing: border-box; }
  
        /* ── Card shell ── */
        #${CONFIG.cardId} .wls-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }
  
        /* ── Status accent bar ── */
        #${CONFIG.cardId} .wls-accent { height: 3px; }
        #${CONFIG.cardId} .accent-good     { background: linear-gradient(90deg,#22c55e,#86efac); }
        #${CONFIG.cardId} .accent-warn     { background: linear-gradient(90deg,#f59e0b,#fcd34d); }
        #${CONFIG.cardId} .accent-mismatch { background: linear-gradient(90deg,#f97316,#fb923c); }
        #${CONFIG.cardId} .accent-bad      { background: linear-gradient(90deg,#ef4444,#fca5a5); }
        #${CONFIG.cardId} .accent-muted    { background: linear-gradient(90deg,#8b5cf6,#c4b5fd); }
  
        /* ── Top row (always visible) ── */
        #${CONFIG.cardId} .wls-top-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          cursor: pointer;
          user-select: none;
          transition: background 0.12s;
          min-height: 46px;
        }
        #${CONFIG.cardId} .wls-top-row:hover { background: #f8fafc; }
  
        #${CONFIG.cardId} .wls-chevron {
          display: inline-flex; width: 16px; height: 16px;
          flex-shrink: 0; color: #94a3b8;
          transition: transform 0.25s ease;
        }
        #${CONFIG.cardId}.wls-expanded .wls-chevron { transform: rotate(180deg); }
  
        #${CONFIG.cardId} .wls-title {
          font-size: 14px; font-weight: 700; color: #1e293b; white-space: nowrap;
        }
  
        /* ── Status badge ── */
        #${CONFIG.cardId} .wls-badge {
          display: inline-flex; align-items: center; gap: 4px;
          border-radius: 999px; padding: 3px 10px;
          font-size: 12px; font-weight: 700; line-height: 1.2; white-space: nowrap;
        }
        #${CONFIG.cardId} .badge-good     { background:#dcfce7; color:#15803d; }
        #${CONFIG.cardId} .badge-warn     { background:#fef9c3; color:#a16207; }
        #${CONFIG.cardId} .badge-mismatch { background:#ffedd5; color:#c2410c; }
        #${CONFIG.cardId} .badge-bad      { background:#fee2e2; color:#b91c1c; }
        #${CONFIG.cardId} .badge-muted    { background:#ede9fe; color:#6d28d9; }
  
        /* ── Month picker ── */
        #${CONFIG.cardId} .wls-month-picker {
          display: flex; align-items: center; gap: 4px;
          flex-shrink: 0;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 3px 5px;
        }
        #${CONFIG.cardId} .wls-month-btn {
          display: inline-flex; align-items: center;
          border: none; outline: none; cursor: pointer;
          border-radius: 7px; background: transparent;
          color: #64748b; font-size: 12px; font-weight: 600;
          padding: 4px 9px; font-family: inherit;
          transition: all 0.14s; white-space: nowrap;
          position: relative;
        }
        #${CONFIG.cardId} .wls-month-btn:hover {
          background: #fff; color: #1e293b;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }
        #${CONFIG.cardId} .wls-month-btn.active {
          background: #fff;
          color: #4f46e5;
          font-weight: 800;
          box-shadow: 0 1px 4px rgba(99,102,241,0.18);
        }
        /* dot indicator on active month */
        #${CONFIG.cardId} .wls-month-btn.active::after {
          content: "";
          position: absolute; bottom: 2px; left: 50%;
          transform: translateX(-50%);
          width: 4px; height: 4px; border-radius: 50%;
          background: #6366f1;
        }
        /* Past-month badge styling — slightly faded */
        #${CONFIG.cardId} .wls-month-btn.past { color: #94a3b8; }
        #${CONFIG.cardId} .wls-month-btn.past:hover { color: #475569; }
  
        /* ── Inline stats (collapsed only) ── */
        #${CONFIG.cardId} .wls-inline-stats {
          display: flex; align-items: center; gap: 0;
          flex: 1; min-width: 0; overflow: hidden; margin-left: 2px;
        }
        #${CONFIG.cardId}.wls-expanded .wls-inline-stats { display: none; }
  
        #${CONFIG.cardId} .wls-stat-sep { color: #cbd5e1; font-size: 14px; padding: 0 6px; flex-shrink: 0; }
        #${CONFIG.cardId} .wls-stat {
          font-size: 13px; color: #64748b; white-space: nowrap;
          cursor: pointer; padding: 2px 6px; border-radius: 6px;
          transition: background 0.12s; border-bottom: 1.5px dashed transparent;
        }
        #${CONFIG.cardId} .wls-stat:hover { background: #f1f5f9; border-bottom-color: #6366f1; }
        #${CONFIG.cardId} .wls-stat strong { font-weight: 700; color: #1e293b; }
        #${CONFIG.cardId} .wls-stat-warn strong  { color: #b45309; }
        #${CONFIG.cardId} .wls-stat-bad strong   { color: #b91c1c; }
        #${CONFIG.cardId} .wls-stat-good strong  { color: #15803d; }
        #${CONFIG.cardId} .wls-stat-purple strong { color: #7c3aed; }
  
        /* ── Top-right cluster ── */
        #${CONFIG.cardId} .wls-top-right {
          display: flex; align-items: center; gap: 8px;
          margin-left: auto; flex-shrink: 0;
        }
        #${CONFIG.cardId} .wls-range {
          font-size: 12px; color: #94a3b8; font-weight: 500; white-space: nowrap;
        }
  
        /* ── Buttons ── */
        #${CONFIG.cardId} .wls-btn {
          display: inline-flex; align-items: center; gap: 5px;
          border: 1px solid #e2e8f0; outline: none; cursor: pointer;
          border-radius: 8px; background: #f8fafc; color: #475569;
          font-size: 13px; font-weight: 600; padding: 5px 12px;
          font-family: inherit; transition: all 0.12s; white-space: nowrap;
        }
        #${CONFIG.cardId} .wls-btn:hover { background: #f1f5f9; border-color: #cbd5e1; color: #1e293b; }
        #${CONFIG.cardId} .wls-btn-primary {
          background: linear-gradient(135deg,#6366f1,#8b5cf6);
          color: #fff; border-color: transparent;
          box-shadow: 0 2px 6px rgba(99,102,241,0.28);
        }
        #${CONFIG.cardId} .wls-btn-primary:hover { background: linear-gradient(135deg,#4f46e5,#7c3aed); }
  
        /* ── Expandable body ── */
        #${CONFIG.cardId} .wls-expandable {
          max-height: 0; overflow: hidden;
          transition: max-height 0.32s cubic-bezier(0.4,0,0.2,1);
        }
        #${CONFIG.cardId}.wls-expanded .wls-expandable { max-height: 900px; }
  
        #${CONFIG.cardId} .wls-expandable-inner {
          padding: 0 14px 14px;
          display: flex; flex-direction: column; gap: 10px;
        }
  
        #${CONFIG.cardId} .wls-body-divider { height: 1px; background: #f1f5f9; margin: 0 14px; }
        #${CONFIG.cardId} .wls-expandable .wls-body-divider { display: none; }
        #${CONFIG.cardId}.wls-expanded .wls-expandable .wls-body-divider { display: block; }
  
        /* ── Metric grid ── */
        #${CONFIG.cardId} .wls-main { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; }
        #${CONFIG.cardId} .wls-block { border-radius: 12px; padding: 12px 14px; border: 1px solid; }
        #${CONFIG.cardId} .wls-block-comp { background: #fdf8ff; border-color: #e9d5ff; }
        #${CONFIG.cardId} .wls-block-ts   { background: #f0f9ff; border-color: #bae6fd; }
  
        #${CONFIG.cardId} .wls-block-hd { display: flex; align-items: center; gap: 7px; margin-bottom: 8px; }
        #${CONFIG.cardId} .wls-block-icon { width: 26px; height: 26px; border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        #${CONFIG.cardId} .icon-comp { background: #f3e8ff; color: #9333ea; }
        #${CONFIG.cardId} .icon-ts   { background: #e0f2fe; color: #0284c7; }
        #${CONFIG.cardId} .wls-block-label { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
  
        #${CONFIG.cardId} .wls-big { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; line-height: 1.1; }
        #${CONFIG.cardId} .wls-big-c { color: #9333ea; }
        #${CONFIG.cardId} .wls-big-t { color: #0284c7; }
        #${CONFIG.cardId} .wls-big-sub { font-size: 14px; font-weight: 400; color: #94a3b8; }
        #${CONFIG.cardId} .wls-block-sub { font-size: 12px; color: #94a3b8; margin-top: 2px; font-weight: 500; }
  
        /* ── Progress bar ── */
        #${CONFIG.cardId} .wls-prog-wrap { margin-top: 9px; }
        #${CONFIG.cardId} .wls-prog-track { height: 5px; background: #e0f2fe; border-radius: 999px; overflow: hidden; }
        #${CONFIG.cardId} .wls-prog-fill { height: 100%; border-radius: 999px; transition: width 0.9s cubic-bezier(.22,.68,0,1.2); }
        #${CONFIG.cardId} .prog-ok   { background: linear-gradient(90deg,#22c55e,#4ade80); }
        #${CONFIG.cardId} .prog-over { background: linear-gradient(90deg,#f59e0b,#fcd34d); }
        #${CONFIG.cardId} .prog-low  { background: linear-gradient(90deg,#6366f1,#a5b4fc); }
        #${CONFIG.cardId} .wls-prog-labels { display: flex; justify-content: space-between; margin-top: 4px; font-size: 11px; font-weight: 600; color: #94a3b8; }
  
        /* ── Chips ── */
        #${CONFIG.cardId} .wls-chips { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 9px; }
        #${CONFIG.cardId} .wls-chip {
          font-size: 12px; border-radius: 999px; padding: 3px 10px;
          display: inline-flex; align-items: center; gap: 4px; font-weight: 600;
          cursor: pointer; transition: filter 0.12s, transform 0.1s; border: 1px solid;
        }
        #${CONFIG.cardId} .wls-chip:hover { filter: brightness(0.95); transform: scale(1.03); }
        #${CONFIG.cardId} .chip-purple { background:#faf5ff; color:#7c3aed; border-color:#ddd6fe; }
        #${CONFIG.cardId} .chip-pink   { background:#fdf2f8; color:#be185d; border-color:#fbcfe8; }
        #${CONFIG.cardId} .chip-blue   { background:#eff6ff; color:#1d4ed8; border-color:#bfdbfe; }
        #${CONFIG.cardId} .chip-sky    { background:#f0f9ff; color:#0369a1; border-color:#bae6fd; }
        #${CONFIG.cardId} .chip-green  { background:#f0fdf4; color:#15803d; border-color:#bbf7d0; }
        #${CONFIG.cardId} .chip-red    { background:#fff1f2; color:#be123c; border-color:#fecdd3; }
        #${CONFIG.cardId} .chip-amber  { background:#fffbeb; color:#b45309; border-color:#fde68a; }
        #${CONFIG.cardId} .chip-slate  { background:#f8fafc; color:#475569; border-color:#e2e8f0; }
  
        /* ── Summary panel ── */
        #${CONFIG.cardId} .wls-summary {
          border-radius: 10px; padding: 11px 14px;
          font-size: 13.5px; line-height: 1.65; color: #374151;
          border-left: 3px solid transparent;
        }
        #${CONFIG.cardId} .summary-good     { background:#f0fdf4; border-left-color:#22c55e; }
        #${CONFIG.cardId} .summary-warn     { background:#fefce8; border-left-color:#f59e0b; }
        #${CONFIG.cardId} .summary-mismatch { background:#fff7ed; border-left-color:#f97316; }
        #${CONFIG.cardId} .summary-bad      { background:#fff1f2; border-left-color:#ef4444; }
        #${CONFIG.cardId} .summary-muted    { background:#f5f3ff; border-left-color:#8b5cf6; }
        #${CONFIG.cardId} .wls-summary-label {
          font-size: 11px; font-weight: 800; text-transform: uppercase;
          letter-spacing: 0.7px; margin-bottom: 4px;
          display: flex; align-items: center; gap: 4px;
        }
        #${CONFIG.cardId} .slabel-good     { color:#15803d; }
        #${CONFIG.cardId} .slabel-warn     { color:#a16207; }
        #${CONFIG.cardId} .slabel-mismatch { color:#c2410c; }
        #${CONFIG.cardId} .slabel-bad      { color:#b91c1c; }
        #${CONFIG.cardId} .slabel-muted    { color:#6d28d9; }
        #${CONFIG.cardId} .wls-summary strong { font-weight:700; color:#111827; }
        #${CONFIG.cardId} .wls-summary em { font-style:normal; background:rgba(0,0,0,0.07); border-radius:4px; padding:1px 5px; font-weight:700; font-size:13px; }
  
        /* ── Expanded actions ── */
        #${CONFIG.cardId} .wls-exp-actions { display: flex; align-items: center; justify-content: flex-end; gap: 8px; padding-top: 2px; }
  
        /* ── Loading / error ── */
        #${CONFIG.cardId} .wls-loading { font-size: 13px; color: #94a3b8; display: flex; align-items: center; gap: 8px; padding: 10px 14px; }
        #${CONFIG.cardId} .wls-spinner { width: 14px; height: 14px; border: 2px solid #e2e8f0; border-top-color: #6366f1; border-radius: 50%; animation: wls-spin 0.7s linear infinite; flex-shrink: 0; }
        @keyframes wls-spin { to { transform: rotate(360deg); } }
        #${CONFIG.cardId} .wls-error-box { font-size: 13px; color: #b91c1c; background: #fff1f2; border: 1px solid #fecdd3; border-radius: 10px; padding: 10px 13px; margin: 10px 14px; }
  
        /* ── Hoverable duration ── */
        #${CONFIG.cardId} .wls-dur { cursor: pointer; border-bottom: 1.5px dashed rgba(0,0,0,0.2); padding: 0 1px; border-radius: 2px; transition: background 0.1s; }
        #${CONFIG.cardId} .wls-dur:hover { background: rgba(99,102,241,0.08); border-bottom-color: #6366f1; }
  
        /* ── Full details modal ── */
        #${CONFIG.cardId} .wls-modal-backdrop { position: fixed; inset: 0; z-index: 9998; background: rgba(15,23,42,0.45); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 20px; }
        #${CONFIG.cardId} .wls-modal-backdrop[hidden] { display: none; }
        #${CONFIG.cardId} .wls-modal { width: min(1080px,calc(100vw - 40px)); max-height: min(800px,calc(100vh - 40px)); display: flex; flex-direction: column; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.2); border: 1px solid #e2e8f0; }
        #${CONFIG.cardId} .wls-modal-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 14px 18px; border-bottom: 1px solid #f1f5f9; flex-shrink: 0; background: #fafafa; }
        #${CONFIG.cardId} .wls-modal-title { font-size: 15px; font-weight: 800; color: #1e293b; }
        #${CONFIG.cardId} .wls-modal-subtitle { font-size: 13px; color: #94a3b8; margin-top: 2px; }
        #${CONFIG.cardId} .wls-close-btn { display: inline-flex; align-items: center; gap: 5px; border: 1px solid #e2e8f0; outline: none; cursor: pointer; border-radius: 8px; background: #fff; color: #64748b; font-size: 13px; font-weight: 600; padding: 5px 11px; font-family: inherit; transition: all 0.12s; }
        #${CONFIG.cardId} .wls-close-btn:hover { background: #f1f5f9; color: #1e293b; }
        #${CONFIG.cardId} .wls-modal-body { padding: 16px 18px 20px; overflow: auto; display: flex; flex-direction: column; gap: 16px; }
  
        /* ── KPI strip ── */
        #${CONFIG.cardId} .wls-kpi-row { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 8px; }
        #${CONFIG.cardId} .wls-kpi { border-radius: 10px; padding: 10px 12px; border: 1px solid; }
        #${CONFIG.cardId} .kpi-purple { background:#faf5ff; border-color:#ddd6fe; }
        #${CONFIG.cardId} .kpi-blue   { background:#eff6ff; border-color:#bfdbfe; }
        #${CONFIG.cardId} .kpi-green  { background:#f0fdf4; border-color:#bbf7d0; }
        #${CONFIG.cardId} .kpi-amber  { background:#fffbeb; border-color:#fde68a; }
        #${CONFIG.cardId} .kpi-slate  { background:#f8fafc; border-color:#e2e8f0; }
        #${CONFIG.cardId} .wls-kpi-label { font-size:11px; color:#94a3b8; font-weight:700; margin-bottom:3px; text-transform:uppercase; letter-spacing:0.4px; }
        #${CONFIG.cardId} .wls-kpi-value { font-size:17px; font-weight:800; color:#1e293b; letter-spacing:-0.3px; }
  
        /* ── Insights ── */
        #${CONFIG.cardId} .wls-insight-row { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 8px; }
        #${CONFIG.cardId} .wls-insight { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 11px 13px; font-size: 13px; color: #475569; line-height: 1.55; }
        #${CONFIG.cardId} .wls-insight b { color: #1e293b; font-weight: 700; }
  
        /* ── Section label ── */
        #${CONFIG.cardId} .wls-section-label { font-size: 12px; font-weight: 800; color: #94a3b8; margin-bottom: 6px; display: flex; align-items: center; gap: 5px; text-transform: uppercase; letter-spacing: 0.5px; }
  
        /* ── Tables ── */
        #${CONFIG.cardId} .wls-table-wrap { border: 1px solid #f1f5f9; border-radius: 10px; overflow: auto; }
        #${CONFIG.cardId} table { width: 100%; border-collapse: collapse; font-size: 13px; }
        #${CONFIG.cardId} th, #${CONFIG.cardId} td { padding: 9px 12px; border-bottom: 1px solid #f8fafc; text-align: left; white-space: nowrap; vertical-align: top; }
        #${CONFIG.cardId} th { color: #94a3b8; background: #fafafa; font-weight: 700; font-size: 12px; letter-spacing: 0.2px; }
        #${CONFIG.cardId} tr:last-child td { border-bottom: none; }
        #${CONFIG.cardId} tr:hover td { background: #fafeff; }
        #${CONFIG.cardId} .t-ok   { color: #15803d; font-weight: 700; }
        #${CONFIG.cardId} .t-bad  { color: #b91c1c; font-weight: 700; }
        #${CONFIG.cardId} .t-skip { color: #cbd5e1; font-weight: 600; }
        #${CONFIG.cardId} .wls-modal-divider { height: 1px; background: #f1f5f9; }
        #${CONFIG.cardId} .wls-empty { font-size: 13px; color: #cbd5e1; padding: 8px 2px; font-style: italic; }
  
        /* ── Responsive ── */
        @media (max-width: 960px) {
          #${CONFIG.cardId} .wls-main { grid-template-columns: 1fr; }
          #${CONFIG.cardId} .wls-kpi-row { grid-template-columns: repeat(2,minmax(0,1fr)); }
          #${CONFIG.cardId} .wls-insight-row { grid-template-columns: repeat(2,minmax(0,1fr)); }
          #${CONFIG.cardId} .wls-inline-stats .wls-stat:nth-child(n+8) { display: none; }
        }
        @media (max-width: 700px) {
          #${CONFIG.cardId} .wls-top-row { flex-wrap: wrap; }
          #${CONFIG.cardId} .wls-inline-stats { display: none !important; }
          #${CONFIG.cardId} .wls-kpi-row { grid-template-columns: repeat(2,minmax(0,1fr)); }
          #${CONFIG.cardId} .wls-insight-row { grid-template-columns: 1fr; }
          #${CONFIG.cardId} .wls-month-picker { overflow-x: auto; }
        }
  
        /* ── Light-themed popover ── */
        #wls-popover-el {
          position: fixed; z-index: 99999;
          background: #fff; color: #1e293b;
          border: 1px solid #e2e8f0; border-radius: 10px;
          padding: 11px 13px; font-size: 13px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          box-shadow: 0 6px 24px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.06);
          pointer-events: none; max-width: 250px; min-width: 170px;
          transition: opacity 0.1s;
        }
        #wls-popover-el[hidden] { display: none; }
        #wls-popover-el .pop-title { font-weight: 700; color: #0f172a; margin-bottom: 7px; font-size: 13px; }
        #wls-popover-el .pop-row { display: flex; justify-content: space-between; gap: 12px; padding: 3px 0; border-bottom: 1px solid #f1f5f9; }
        #wls-popover-el .pop-row:last-of-type { border-bottom: none; }
        #wls-popover-el .pop-lbl { color: #64748b; }
        #wls-popover-el .pop-val { color: #1e293b; font-weight: 700; text-align: right; }
        #wls-popover-el .pop-note { margin-top: 7px; font-size: 12px; color: #94a3b8; line-height: 1.4; border-top: 1px solid #f1f5f9; padding-top: 6px; }
        #wls-popover-el .pop-hint { margin-top: 5px; font-size: 11px; color: #a5b4fc; font-weight: 600; }
  
        /* ── Mini-modal ── */
        #wls-mini-modal-el { display: none; }
        #wls-mini-modal-el.wls-mm-open { display: block; }
        #wls-mini-modal-el .wmm-backdrop { position: fixed; inset: 0; z-index: 9999; background: rgba(15,23,42,0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 20px; }
        #wls-mini-modal-el .wmm-box { background: #fff; border-radius: 14px; width: min(680px,calc(100vw - 40px)); max-height: min(580px,calc(100vh - 40px)); display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 16px 50px rgba(0,0,0,0.18); border: 1px solid #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 13px; color: #1e293b; }
        #wls-mini-modal-el .wmm-box * { box-sizing: border-box; }
        #wls-mini-modal-el .wmm-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 14px 16px; border-bottom: 1px solid #f1f5f9; flex-shrink: 0; background: #fafafa; }
        #wls-mini-modal-el .wmm-title { font-size: 15px; font-weight: 800; color: #1e293b; }
        #wls-mini-modal-el .wmm-sub { font-size: 13px; color: #94a3b8; margin-top: 2px; }
        #wls-mini-modal-el .wmm-close { display: inline-flex; align-items: center; gap: 5px; border: 1px solid #e2e8f0; outline: none; cursor: pointer; border-radius: 8px; background: #fff; color: #64748b; font-size: 13px; font-weight: 600; padding: 5px 10px; font-family: inherit; transition: all 0.12s; white-space: nowrap; }
        #wls-mini-modal-el .wmm-close:hover { background: #f1f5f9; color: #1e293b; }
        #wls-mini-modal-el .wmm-body { padding: 14px 16px 18px; overflow: auto; display: flex; flex-direction: column; gap: 12px; }
        #wls-mini-modal-el .wls-table-wrap { border: 1px solid #f1f5f9; border-radius: 10px; overflow: auto; }
        #wls-mini-modal-el table { width: 100%; border-collapse: collapse; font-size: 13px; }
        #wls-mini-modal-el th, #wls-mini-modal-el td { padding: 8px 11px; border-bottom: 1px solid #f8fafc; text-align: left; white-space: nowrap; vertical-align: top; }
        #wls-mini-modal-el th { color: #94a3b8; background: #fafafa; font-weight: 700; font-size: 12px; }
        #wls-mini-modal-el tr:last-child td { border-bottom: none; }
        #wls-mini-modal-el tr:hover td { background: #fafeff; }
        #wls-mini-modal-el .t-ok  { color: #15803d; font-weight: 700; }
        #wls-mini-modal-el .t-bad { color: #b91c1c; font-weight: 700; }
        #wls-mini-modal-el .t-skip { color: #cbd5e1; font-weight: 600; }
        #wls-mini-modal-el .wls-kpi-row { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 8px; margin-bottom: 4px; }
        #wls-mini-modal-el .wls-kpi { border-radius: 10px; padding: 10px 12px; border: 1px solid; }
        #wls-mini-modal-el .kpi-purple { background:#faf5ff; border-color:#ddd6fe; }
        #wls-mini-modal-el .kpi-blue   { background:#eff6ff; border-color:#bfdbfe; }
        #wls-mini-modal-el .kpi-green  { background:#f0fdf4; border-color:#bbf7d0; }
        #wls-mini-modal-el .kpi-amber  { background:#fffbeb; border-color:#fde68a; }
        #wls-mini-modal-el .kpi-slate  { background:#f8fafc; border-color:#e2e8f0; }
        #wls-mini-modal-el .kpi-red    { background:#fff1f2; border-color:#fecdd3; }
        #wls-mini-modal-el .wls-kpi-label { font-size:11px; color:#94a3b8; font-weight:700; margin-bottom:3px; text-transform:uppercase; letter-spacing:0.4px; }
        #wls-mini-modal-el .wls-kpi-value { font-size:16px; font-weight:800; color:#1e293b; }
        #wls-mini-modal-el .wls-section-label { font-size:12px; font-weight:800; color:#94a3b8; margin-bottom:6px; display:flex; align-items:center; gap:5px; text-transform:uppercase; letter-spacing:0.5px; }
        #wls-mini-modal-el .wls-empty { font-size:13px; color:#cbd5e1; padding:8px 2px; font-style:italic; }
        #wls-mini-modal-el .wls-error-box { font-size:13px; color:#b91c1c; background:#fff1f2; border:1px solid #fecdd3; border-radius:10px; padding:10px 13px; }
      `;
      document.head.appendChild(style);
    };
  
    // ─── Popover ─────────────────────────────────────────────────────────────────
    const setupPopover = () => {
      if (document.getElementById("wls-popover-el")) return document.getElementById("wls-popover-el");
      const el = document.createElement("div");
      el.id = "wls-popover-el"; el.hidden = true;
      el.innerHTML = `<div class="pop-title"></div><div class="pop-rows"></div><div class="pop-note"></div><div class="pop-hint">Click to see full breakdown →</div>`;
      document.body.appendChild(el); return el;
    };
    const showPopover = (anchorEl, data) => {
      const el = setupPopover();
      el.querySelector(".pop-title").textContent = data.title || "";
      el.querySelector(".pop-rows").innerHTML = (data.rows||[]).map((r) =>
        `<div class="pop-row"><span class="pop-lbl">${escapeHtml(r.label)}</span><span class="pop-val">${escapeHtml(r.value)}</span></div>`
      ).join("");
      const noteEl = el.querySelector(".pop-note");
      if (data.note) { noteEl.textContent = data.note; noteEl.style.display = ""; } else noteEl.style.display = "none";
      const hintEl = el.querySelector(".pop-hint");
      if (hintEl) hintEl.style.display = anchorEl.dataset.modalKey ? "" : "none";
      el.hidden = false;
      const rect = anchorEl.getBoundingClientRect();
      const ew = el.offsetWidth || 220, eh = el.offsetHeight || 90;
      let left = rect.left + rect.width / 2 - ew / 2;
      let top = rect.top + window.scrollY - eh - 10;
      left = Math.max(8, Math.min(left, window.innerWidth - ew - 8));
      el.style.left = `${left}px`; el.style.top = `${top}px`;
    };
    const hidePopover = () => { const el = document.getElementById("wls-popover-el"); if (el) el.hidden = true; };
    const makePop = (data) => `data-pop='${JSON.stringify(data).replace(/'/g, "&#39;")}'`;
    const attachPopovers = (container) => {
      container.querySelectorAll("[data-pop]").forEach((el) => {
        let t;
        el.addEventListener("mouseenter", () => { clearTimeout(t); try { t = setTimeout(() => showPopover(el, JSON.parse(el.getAttribute("data-pop"))), 130); } catch {} });
        el.addEventListener("mouseleave", () => { clearTimeout(t); hidePopover(); });
      });
    };
  
    // ─── Mini-modal ───────────────────────────────────────────────────────────────
    const setupMiniModal = () => {
      if (document.getElementById("wls-mini-modal-el")) return document.getElementById("wls-mini-modal-el");
      const el = document.createElement("div"); el.id = "wls-mini-modal-el";
      el.innerHTML = `<div class="wmm-backdrop"><div class="wmm-box"><div class="wmm-head"><div><div class="wmm-title"></div><div class="wmm-sub"></div></div><button class="wmm-close">${icon("close",13)} Close</button></div><div class="wmm-body"></div></div></div>`;
      document.body.appendChild(el);
      el.querySelector(".wmm-backdrop").addEventListener("click", (e) => { if (e.target === e.currentTarget) hideMiniModal(); });
      el.querySelector(".wmm-close").addEventListener("click", hideMiniModal);
      return el;
    };
    const hideMiniModal = () => { const el = document.getElementById("wls-mini-modal-el"); if (el) el.classList.remove("wls-mm-open"); };
  
    const mmRenderTable = ({ columns, rows, emptyText }) => {
      if (!rows.length) return `<div class="wls-empty">${escapeHtml(emptyText||"No records.")}</div>`;
      return `<div class="wls-table-wrap"><table><thead><tr>${columns.map((c)=>`<th>${escapeHtml(c.label)}</th>`).join("")}</tr></thead><tbody>${rows.map((r)=>`<tr>${columns.map((c)=>`<td>${c.html?c.render(r):escapeHtml(c.render(r))}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    };
    const mmKpis = (items) => {
      const colors = ["kpi-purple","kpi-blue","kpi-green","kpi-amber","kpi-slate","kpi-red"];
      return `<div class="wls-kpi-row">${items.map((x,i)=>`<div class="wls-kpi ${colors[i%colors.length]}"><div class="wls-kpi-label">${escapeHtml(x.label)}</div><div class="wls-kpi-value">${escapeHtml(x.value)}</div></div>`).join("")}</div>`;
    };
    const mmSectionLabel = (ico, text) => `<div class="wls-section-label">${icon(ico,13)} ${escapeHtml(text)}</div>`;
  
    const buildMiniModalContent = (key) => {
      if (!_state) return null;
      const { checkInSummary, timesheetSummary, comparison, timesheetError } = _state;
      switch (key) {
        case "pending": return { title:"Compensation balance", sub:`Time-off taken vs extra hours worked`, body:`
          ${mmKpis([{ label:"Time-off taken",value:formatMinutes(checkInSummary.totalTimeOffMinutes) },{ label:"Compensated",value:formatMinutes(checkInSummary.totalExtraWorkedMinutes) },{ label:"Still pending",value:formatMinutes(checkInSummary.pendingMinutes) }])}
          <div>${mmSectionLabel("clock","Time-off records")}${mmRenderTable({ emptyText:"No time-off records.", columns:[{ label:"Date",render:(r)=>formatDisplayDate(r.date) },{ label:"Start",render:(r)=>r.start||"–" },{ label:"End",render:(r)=>r.end||"–" },{ label:"Duration",render:(r)=>formatMinutes(r.minutes) }], rows:checkInSummary.timeOffRows })}</div>
          <div>${mmSectionLabel("plus","Extra work / compensated sessions")}${mmRenderTable({ emptyText:"No extra work records.", columns:[{ label:"Date",render:(r)=>formatDisplayDate(r.date) },{ label:"Worked",render:(r)=>formatMinutes(r.workedMinutes) },{ label:"Expected",render:(r)=>formatMinutes(r.expectedMinutes) },{ label:"Extra",render:(r)=>formatMinutes(r.extraMinutes) },{ label:"Reason",render:(r)=>r.reason }], rows:checkInSummary.extraRows })}</div>` };
        case "timeoff": return { title:"Time-off taken", sub:`${checkInSummary.timeOffRows.length} record(s) · Total ${formatMinutes(checkInSummary.totalTimeOffMinutes)}`, body:mmRenderTable({ emptyText:"No time-off records.", columns:[{ label:"Date",render:(r)=>formatDisplayDate(r.date) },{ label:"Type",render:(r)=>r.type },{ label:"Start",render:(r)=>r.start||"–" },{ label:"End",render:(r)=>r.end||"–" },{ label:"Duration",render:(r)=>formatMinutes(r.minutes) }], rows:checkInSummary.timeOffRows }) };
        case "compensated": return { title:"Extra work & compensation earned", sub:`${checkInSummary.extraRows.length} session(s) · Total ${formatMinutes(checkInSummary.totalExtraWorkedMinutes)}`, body:mmRenderTable({ emptyText:"No extra work recorded.", columns:[{ label:"Date",render:(r)=>formatDisplayDate(r.date) },{ label:"Worked",render:(r)=>formatMinutes(r.workedMinutes) },{ label:"Time-off adj.",render:(r)=>formatMinutes(r.timeOffMinutes) },{ label:"Expected",render:(r)=>formatMinutes(r.expectedMinutes) },{ label:"Compensated",render:(r)=>formatMinutes(r.extraMinutes) },{ label:"Reason",render:(r)=>r.reason }], rows:checkInSummary.extraRows }) };
        case "worked": return { title:"Hours worked — check-in breakdown", sub:`Total ${formatMinutes(checkInSummary.totalCheckInWorkMinutes)} across ${checkInSummary.dayRows.filter(d=>d.workMinutes>0).length} days`, body:mmRenderTable({ emptyText:"No work records.", columns:[{ label:"Date",render:(r)=>formatDisplayDate(r.dateKey) },{ label:"Worked",render:(r)=>formatMinutes(r.workMinutes) },{ label:"Time-off that day",render:(r)=>formatMinutes(r.timeOffMinutes) },{ label:"Sessions",render:(r)=>String(r.workRecords.length) }], rows:checkInSummary.dayRows.filter(d=>d.workMinutes>0) }) };
        case "logged": return { title:"Worked vs logged — day by day", sub:timesheetError?"Timesheet unavailable":`${comparison.rows.length} days compared · ${formatMinutes(timesheetSummary.totalMinutes)} total logged`, body:timesheetError?`<div class="wls-error-box">${escapeHtml(timesheetError)}</div>`:mmRenderTable({ emptyText:"No data.", columns:[{ label:"Date",render:(r)=>formatDisplayDate(r.date) },{ label:"Worked",render:(r)=>`${formatMinutes(r.checkInMinutes)} (${r.roundedCheckInHours}h)` },{ label:"Logged",render:(r)=>`${formatMinutes(r.timesheetMinutes)} (${r.roundedTimesheetHours}h)` },{ label:"Gap",render:(r)=>formatSignedMinutes(r.diffMinutes) },{ label:"Status",html:true,render:(r)=>`<span class="${r.statusClass}">${escapeHtml(r.status)}</span>` }], rows:comparison.rows }) };
        case "mismatches": return { title:"Days with mismatch", sub:`${comparison.mismatchCount} day(s) where logged ≠ worked (rounded hour)`, body:mmRenderTable({ emptyText:"No mismatches — everything lines up! 🎉", columns:[{ label:"Date",render:(r)=>formatDisplayDate(r.date) },{ label:"Worked",render:(r)=>`${formatMinutes(r.checkInMinutes)} (${r.roundedCheckInHours}h)` },{ label:"Logged",render:(r)=>`${formatMinutes(r.timesheetMinutes)} (${r.roundedTimesheetHours}h)` },{ label:"Gap",render:(r)=>formatSignedMinutes(r.diffMinutes) }], rows:comparison.mismatchRows }) };
        case "dayoffs": return { title:"Day-offs this month", sub:`${checkInSummary.dayOffCount} day(s) off recorded`, body:mmRenderTable({ emptyText:"No day-offs recorded.", columns:[{ label:"Date",render:(r)=>formatDisplayDate(r.date) },{ label:"Type",render:(r)=>r.type }], rows:checkInSummary.dayOffRows }) };
        default: return null;
      }
    };
    const showMiniModal = (key) => {
      if (!_state) return;
      const content = buildMiniModalContent(key); if (!content) return;
      const el = setupMiniModal();
      el.querySelector(".wmm-title").textContent = content.title;
      el.querySelector(".wmm-sub").textContent = content.sub || "";
      el.querySelector(".wmm-body").innerHTML = content.body;
      el.classList.add("wls-mm-open");
    };
    const attachModalClicks = (container) => {
      container.addEventListener("click", (e) => {
        if (e.target.closest("button")) return;
        const trigger = e.target.closest("[data-modal-key]"); if (!trigger) return;
        hidePopover(); showMiniModal(trigger.dataset.modalKey);
      });
    };
  
    // ─── DOM ──────────────────────────────────────────────────────────────────────
    const getOrCreateCard = () => {
      let card = document.getElementById(CONFIG.cardId); if (card) return card;
      card = document.createElement("div"); card.id = CONFIG.cardId;
      const notifyEl = document.getElementById("notify_my_check_in_data");
      const checkinDetail = document.getElementById("my-checkin-detail");
      if (notifyEl?.parentElement) notifyEl.parentElement.insertBefore(card, notifyEl);
      else if (checkinDetail?.parentElement) checkinDetail.parentElement.insertBefore(card, checkinDetail);
      else document.body.prepend(card);
      return card;
    };
  
    // ─── API ──────────────────────────────────────────────────────────────────────
    const fetchCheckInData = async (offset = 0) => {
      const { startDate, endDate } = getMonthRange(offset);
      const url = new URL(CONFIG.checkInApiUrl);
      url.searchParams.set("start_date", startDate); url.searchParams.set("end_date", endDate);
      const res = await fetch(url.toString(), { method:"GET", credentials:"include", headers:{ Accept:"application/json" } });
      if (!res.ok) throw new Error(`Check-in API failed: ${res.status}`);
      const result = await res.json();
      return { startDate, endDate, rows: flattenAttendanceData(result.data||{}) };
    };
    const buildTimesheetBody = ({ startDate, endDate, userId, userParamMode }) => {
      const body = new URLSearchParams();
      body.append("group_by","date"); body.append("start_date",startDate); body.append("end_date",endDate); body.append("un_approved_entries","false");
      if (userId) body.append(userParamMode==="array"?"filter_user_id[]":"filter_user_id", userId);
      return body;
    };
    const requestTimesheetPage = async ({ url, startDate, endDate, userId, userParamMode }) => {
      const csrf = getCsrfToken();
      const headers = { Accept:"application/json", "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8", "X-Requested-With":"XMLHttpRequest" };
      if (csrf) headers["X-CSRF-TOKEN"] = csrf;
      const res = await fetch(url, { method:"POST", credentials:"include", headers, body:buildTimesheetBody({ startDate, endDate, userId, userParamMode }) });
      if (!res.ok) throw new Error(`Timesheet API failed: ${res.status}`);
      return res.json();
    };
    const fetchTimesheetAllPagesWithMode = async ({ startDate, endDate, userId, userParamMode }) => {
      let nextUrl = CONFIG.timesheetApiUrl, page = 0; const allRows = [];
      while (nextUrl && page < CONFIG.maxTimesheetPages) {
        page++;
        const res = await requestTimesheetPage({ url:nextUrl, startDate, endDate, userId, userParamMode });
        const p = res.pages||{}; allRows.push(...(Array.isArray(p.data)?p.data:[]));
        nextUrl = p.next_page_url ? new URL(p.next_page_url, window.location.origin).toString() : "";
      }
      return { rows:allRows, pagesFetched:page };
    };
    const fetchTimesheetAllPages = async ({ startDate, endDate }) => {
      const userId = getLoggedInUserId();
      try { return await fetchTimesheetAllPagesWithMode({ startDate, endDate, userId, userParamMode:"array" }); }
      catch { return fetchTimesheetAllPagesWithMode({ startDate, endDate, userId, userParamMode:"scalar" }); }
    };
  
    // ─── Data processing (unchanged logic) ───────────────────────────────────────
    const groupCheckIn = (rows) => {
      const dayMap = new Map(); const timeOffRows = []; const dayOffRows = [];
      const ensureDay = (dateKey, dateObj) => { if (!dayMap.has(dateKey)) dayMap.set(dateKey, { dateKey, dateObj, workMinutes:0, timeOffMinutes:0, workRecords:[], timeOffRecords:[] }); return dayMap.get(dateKey); };
      rows.forEach((row) => {
        const dateObj = parseDate(row.date); if (!dateObj) return;
        const dateKey = toYMD(dateObj); const typeLabel = getTypeLabel(row); const rawType = row.type||"";
        const day = ensureDay(dateKey, dateObj);
        const isTimeOff = CONFIG.timeOffTypes.has(rawType)||CONFIG.timeOffTypes.has(typeLabel);
        const isWork = CONFIG.workTypes.has(rawType)||CONFIG.workTypes.has(typeLabel);
        const isDayOff = rawType==="Day Off"||CONFIG.dayOffLabels.has(typeLabel);
        if (isWork) { const minutes = getDurationMinutes(row.start_time, row.end_time, dateObj, true); if (minutes > 0) { const rec={date:dateKey,type:typeLabel,start:row.start_time,end:row.end_time||(isToday(dateObj)?"Now":"-"),minutes}; day.workMinutes+=minutes; day.workRecords.push(rec); } }
        if (isTimeOff) { const minutes = getDurationMinutes(row.start_time, row.end_time, dateObj, false); if (minutes > 0) { const rec={date:dateKey,type:typeLabel,start:row.start_time,end:row.end_time,minutes}; day.timeOffMinutes+=minutes; day.timeOffRecords.push(rec); timeOffRows.push(rec); } }
        if (isDayOff && !dayOffRows.some((x) => x.date===dateKey && x.type===typeLabel)) dayOffRows.push({ date:dateKey, type:typeLabel });
      });
      const dayRows = Array.from(dayMap.values()).sort((a,b)=>a.dateKey.localeCompare(b.dateKey));
      const extraRows = dayRows.map((day) => {
        const isWeekend = CONFIG.weekendDays.includes(day.dateObj.getDay());
        const expectedMinutes = isWeekend ? 0 : Math.max(0, CONFIG.workDayMinutes-day.timeOffMinutes);
        let extraMinutes=0, reason="";
        if (isWeekend && day.workMinutes>0) { extraMinutes=day.workMinutes; reason="Weekend work"; }
        else if (!isWeekend && day.workMinutes>expectedMinutes) { extraMinutes=day.workMinutes-expectedMinutes; reason=day.timeOffMinutes>0?"Worked above adjusted target":"Worked more than 8h"; }
        return { date:day.dateKey, workedMinutes:day.workMinutes, timeOffMinutes:day.timeOffMinutes, expectedMinutes, extraMinutes, reason, workRecords:day.workRecords };
      }).filter((r)=>r.extraMinutes>0);
      const totalTimeOffMinutes = timeOffRows.reduce((s,r)=>s+r.minutes,0);
      const totalExtraWorkedMinutes = extraRows.reduce((s,r)=>s+r.extraMinutes,0);
      const totalCheckInWorkMinutes = dayRows.reduce((s,r)=>s+r.workMinutes,0);
      return { dayMap, dayRows, timeOffRows:timeOffRows.sort((a,b)=>a.date.localeCompare(b.date)||String(a.start).localeCompare(String(b.start))), extraRows, dayOffRows:dayOffRows.sort((a,b)=>a.date.localeCompare(b.date)), totalTimeOffMinutes, totalExtraWorkedMinutes, totalCheckInWorkMinutes, pendingMinutes:Math.max(0,totalTimeOffMinutes-totalExtraWorkedMinutes), surplusMinutes:Math.max(0,totalExtraWorkedMinutes-totalTimeOffMinutes), dayOffCount:new Set(dayOffRows.map((r)=>r.date)).size };
    };
    const groupTimesheet = ({ rows, startDate, endDate }) => {
      const userId = getLoggedInUserId(); const dayMap = new Map(); const records = [];
      rows.forEach((row) => {
        if (userId && row.user_id && String(row.user_id)!==String(userId)) return;
        const dateObj = parseDate(row.entry_date||row.date); if (!dateObj) return;
        const dateKey = toYMD(dateObj); if (dateKey<startDate||dateKey>endDate) return;
        const minutes = parseTimesheetDurationToMinutes(row.working_hours);
        if (!dayMap.has(dateKey)) dayMap.set(dateKey, { date:dateKey, minutes:0, recordsCount:0, records:[] });
        const rec={ id:row.id, date:dateKey, title:getTimesheetRecordTitle(row), project:row.project_name||"-", module:row.module_name||"-", task:row.task_name||"-", description:row.description||"-", minutes, rawWorkingHours:row.working_hours };
        dayMap.get(dateKey).minutes+=minutes; dayMap.get(dateKey).recordsCount+=1; dayMap.get(dateKey).records.push(rec); records.push(rec);
      });
      const dayRows = Array.from(dayMap.values()).sort((a,b)=>a.date.localeCompare(b.date));
      return { dayMap, dayRows, records:records.sort((a,b)=>a.date.localeCompare(b.date)||String(a.id||"").localeCompare(String(b.id||""))), totalMinutes:dayRows.reduce((s,r)=>s+r.minutes,0) };
    };
    const buildComparison = ({ checkInSummary, timesheetSummary }) => {
      const dates = new Set();
      checkInSummary.dayRows.forEach((r)=>{ if(r.workMinutes>0||r.timeOffMinutes>0) dates.add(r.dateKey); });
      timesheetSummary.dayRows.forEach((r)=>{ if(r.minutes>0) dates.add(r.date); });
      const rows = Array.from(dates).sort().map((date) => {
        const ci = checkInSummary.dayMap.get(date); const ts = timesheetSummary.dayMap.get(date);
        const isTodayRow = isToday(parseDate(date));
        const ciMin=ci?.workMinutes||0, toMin=ci?.timeOffMinutes||0, tsMin=ts?.minutes||0;
        let status="OK", statusClass="t-ok";
        if (CONFIG.ignoreTodayForTimesheetMismatch && isTodayRow) { status="Skipped today"; statusClass="t-skip"; }
        else { const match=CONFIG.compareByRoundedHours?roundedHour(ciMin)===roundedHour(tsMin):ciMin===tsMin; status=match?"OK":"Mismatch"; statusClass=match?"t-ok":"t-bad"; }
        return { date, checkInMinutes:ciMin, timeOffMinutes:toMin, timesheetMinutes:tsMin, diffMinutes:tsMin-ciMin, roundedCheckInHours:roundedHour(ciMin), roundedTimesheetHours:roundedHour(tsMin), isTodayRow, isMatch:statusClass==="t-ok", status, statusClass, timesheetRecords:ts?.records||[] };
      });
      const mismatchRows = rows.filter((r)=>!(CONFIG.ignoreTodayForTimesheetMismatch&&r.isTodayRow)&&!r.isMatch);
      return { rows, mismatchRows, mismatchCount:mismatchRows.length };
    };
  
    // ─── Status (fun copy) ────────────────────────────────────────────────────────
    const getOverallStatus = ({ checkInSummary, timesheetSummary, comparison, timesheetError }) => {
      if (timesheetError) return { label:"Flying blind", accentClass:"accent-muted", badgeClass:"badge-muted", summaryClass:"summary-muted", slabelClass:"slabel-muted", icon:"muted", message:`Timesheet API went quiet, so the logged-vs-worked picture is fuzzy right now. Your <strong>compensation math still works</strong> — it's running entirely on check-in data. Grab a coffee and hit Refresh in a bit.` };
      const yetToLog = Math.max(0, checkInSummary.totalCheckInWorkMinutes - timesheetSummary.totalMinutes);
      const overLogged = Math.max(0, timesheetSummary.totalMinutes - checkInSummary.totalCheckInWorkMinutes);
      const gap = Math.max(yetToLog, overLogged);
      const pending = checkInSummary.pendingMinutes;
      const mismatches = comparison.mismatchCount;
      if (mismatches === 0 && pending === 0) return { label:"Squeaky clean ✨", accentClass:"accent-good", badgeClass:"badge-good", summaryClass:"summary-good", slabelClass:"slabel-good", icon:"check", message:`Everything lines up — check-ins, timesheet, and compensation are all singing the same tune. <strong>Nothing left to fix.</strong> Go touch some grass.` };
      if (gap <= 60 && pending <= 60) { const bits=[]; if(gap>0) bits.push(`<em>${formatMinutes(gap)}</em> to sort in your timesheet`); if(pending>0) bits.push(`<em>${formatMinutes(pending)}</em> of uncompensated time-off`); return { label:"So close 👀", accentClass:"accent-warn", badgeClass:"badge-warn", summaryClass:"summary-warn", slabelClass:"slabel-warn", icon:"warn", message:`You're <strong>embarrassingly close to perfect</strong> — just ${bits.join(" and ")} standing in the way of a clean slate. One quick pass and you're golden.` }; }
      if (gap <= 4 * 60 || mismatches <= 4) { const bits=[]; if(mismatches>0) bits.push(`<strong>${mismatches} day${mismatches>1?"s":""}</strong> where logged hours don't match what you worked`); if(pending>0) bits.push(`<em>${formatMinutes(pending)}</em> of time-off still waiting to be compensated`); return { label:"Needs some love 🛠", accentClass:"accent-mismatch", badgeClass:"badge-mismatch", summaryClass:"summary-mismatch", slabelClass:"slabel-mismatch", icon:"warn", message:`Getting there, but not quite. You've got ${bits.join(", plus ")}. A focused <strong>10-minute cleanup</strong> in the timesheet should sort this right out.` }; }
      const logNote = yetToLog > overLogged ? `<em>${formatMinutes(yetToLog)}</em> of worked time hasn't made it into the timesheet yet` : `<em>${formatMinutes(overLogged)}</em> is logged in excess of what check-in recorded`;
      return { label:"Gone rogue 🚨", accentClass:"accent-bad", badgeClass:"badge-bad", summaryClass:"summary-bad", slabelClass:"slabel-bad", icon:"error", message:`Your timesheet and check-ins are living completely separate lives. ${logNote}, and there are <strong>${mismatches} mismatched day${mismatches!==1?"s":""}</strong> on record. This one needs a proper sit-down to untangle.` };
    };
  
    // ─── Full-detail modal helpers ────────────────────────────────────────────────
    const renderTable = ({ columns, rows, emptyText }) => {
      if (!rows.length) return `<div class="wls-empty">${escapeHtml(emptyText||"No records.")}</div>`;
      return `<div class="wls-table-wrap"><table><thead><tr>${columns.map((c)=>`<th>${escapeHtml(c.label)}</th>`).join("")}</tr></thead><tbody>${rows.map((r)=>`<tr>${columns.map((c)=>`<td>${c.html?c.render(r):escapeHtml(c.render(r))}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    };
    const kpiColors = ["kpi-purple","kpi-blue","kpi-green","kpi-amber","kpi-slate","kpi-purple","kpi-blue","kpi-amber"];
    const renderKpis = (items) => `<div class="wls-kpi-row">${items.map((x,i)=>`<div class="wls-kpi ${kpiColors[i%kpiColors.length]}"><div class="wls-kpi-label">${escapeHtml(x.label)}</div><div class="wls-kpi-value">${escapeHtml(x.value)}</div></div>`).join("")}</div>`;
    const sectionLabel = (ico, text) => `<div class="wls-section-label">${icon(ico,13)} ${escapeHtml(text)}</div>`;
  
    const buildDetailsHtml = ({ checkInSummary, timesheetSummary, comparison, timesheetError, status }) => {
      const yetToLog = Math.max(0, checkInSummary.totalCheckInWorkMinutes - timesheetSummary.totalMinutes);
      return `
        ${renderKpis([{ label:"Status",value:status.label.replace(/\s[\S]*$/,"").trim() },{ label:"Time-off taken",value:formatMinutes(checkInSummary.totalTimeOffMinutes) },{ label:"Compensated",value:formatMinutes(checkInSummary.totalExtraWorkedMinutes) },{ label:"Pending comp.",value:formatMinutes(checkInSummary.pendingMinutes) },{ label:"Worked (check-in)",value:formatMinutes(checkInSummary.totalCheckInWorkMinutes) },{ label:"Logged (timesheet)",value:timesheetError?"API error":formatMinutes(timesheetSummary.totalMinutes) },{ label:"Yet to log",value:timesheetError?"–":formatMinutes(yetToLog) },{ label:"Day-offs",value:String(checkInSummary.dayOffCount) }])}
        <div class="wls-insight-row">
          <div class="wls-insight"><b>Overall:</b> ${status.message}</div>
          <div class="wls-insight"><b>Compensation:</b> Took ${escapeHtml(formatMinutes(checkInSummary.totalTimeOffMinutes))} time-off, compensated ${escapeHtml(formatMinutes(checkInSummary.totalExtraWorkedMinutes))}. ${checkInSummary.pendingMinutes>0?`<b>${escapeHtml(formatMinutes(checkInSummary.pendingMinutes))}</b> pending.`:"Fully balanced ✓"}</div>
          <div class="wls-insight"><b>Timesheet:</b> Worked ${escapeHtml(formatMinutes(checkInSummary.totalCheckInWorkMinutes))}, logged ${escapeHtml(timesheetError?"API error":formatMinutes(timesheetSummary.totalMinutes))}. ${timesheetError?"":yetToLog>0?`<b>${escapeHtml(formatMinutes(yetToLog))}</b> yet to log.`:"Fully logged ✓"}</div>
        </div>
        <div class="wls-modal-divider"></div>
        ${timesheetError?`${sectionLabel("report","Timesheet API error")}<div class="wls-error-box">${escapeHtml(timesheetError)}</div>`:`
          <div>${sectionLabel("table","Worked vs logged")}${renderTable({ emptyText:"No data.", columns:[{ label:"Date",render:(r)=>formatDisplayDate(r.date) },{ label:"Worked",render:(r)=>`${formatMinutes(r.checkInMinutes)} (${r.roundedCheckInHours}h)` },{ label:"Logged",render:(r)=>`${formatMinutes(r.timesheetMinutes)} (${r.roundedTimesheetHours}h)` },{ label:"Gap",render:(r)=>formatSignedMinutes(r.diffMinutes) },{ label:"Status",html:true,render:(r)=>`<span class="${r.statusClass}">${escapeHtml(r.status)}</span>` }], rows:comparison.rows })}</div>
          <div>${sectionLabel("warn","Mismatches — needs attention")}${renderTable({ emptyText:"No mismatches! 🎉", columns:[{ label:"Date",render:(r)=>formatDisplayDate(r.date) },{ label:"Worked",render:(r)=>`${formatMinutes(r.checkInMinutes)} (${r.roundedCheckInHours}h)` },{ label:"Logged",render:(r)=>`${formatMinutes(r.timesheetMinutes)} (${r.roundedTimesheetHours}h)` },{ label:"Gap",render:(r)=>formatSignedMinutes(r.diffMinutes) }], rows:comparison.mismatchRows })}</div>`}
        <div>${sectionLabel("clock","Time-off taken")}${renderTable({ emptyText:"No time-off records.", columns:[{ label:"Date",render:(r)=>formatDisplayDate(r.date) },{ label:"Start",render:(r)=>r.start||"–" },{ label:"End",render:(r)=>r.end||"–" },{ label:"Duration",render:(r)=>formatMinutes(r.minutes) }], rows:checkInSummary.timeOffRows })}</div>
        <div>${sectionLabel("plus","Compensated / extra worked")}${renderTable({ emptyText:"No extra work.", columns:[{ label:"Date",render:(r)=>formatDisplayDate(r.date) },{ label:"Worked",render:(r)=>formatMinutes(r.workedMinutes) },{ label:"Time-off",render:(r)=>formatMinutes(r.timeOffMinutes) },{ label:"Expected",render:(r)=>formatMinutes(r.expectedMinutes) },{ label:"Compensated",render:(r)=>formatMinutes(r.extraMinutes) },{ label:"Reason",render:(r)=>r.reason }], rows:checkInSummary.extraRows })}</div>
        <div>${sectionLabel("cal","Day-offs")}${renderTable({ emptyText:"No day-offs.", columns:[{ label:"Date",render:(r)=>formatDisplayDate(r.date) },{ label:"Type",render:(r)=>r.type }], rows:checkInSummary.dayOffRows })}</div>
        ${timesheetError?"":` <div>${sectionLabel("entries","Timesheet entries")}${renderTable({ emptyText:"No entries.", columns:[{ label:"Date",render:(r)=>formatDisplayDate(r.date) },{ label:"Project / Module / Task",render:(r)=>r.title },{ label:"Logged",render:(r)=>formatMinutes(r.minutes) },{ label:"Description",render:(r)=>stripHtml(r.description).slice(0,160) }], rows:timesheetSummary.records })}</div>`}`;
    };
  
    // ─── Month picker HTML ────────────────────────────────────────────────────────
    const buildMonthPickerHtml = (currentOffset) => {
      const months = buildMonthOptions(6);
      const pills = months.map((m) => {
        const isActive = m.offset === currentOffset;
        const isPast = m.offset < 0;
        return `<button class="wls-month-btn${isActive?" active":""}${isPast&&!isActive?" past":""}" type="button" data-month-offset="${m.offset}" title="${escapeHtml(m.fullLabel)}">${escapeHtml(m.label)}</button>`;
      }).join("");
      return `<div class="wls-month-picker">${pills}</div>`;
    };
  
    // ─── Render states ────────────────────────────────────────────────────────────
    const renderLoading = (offset = 0) => {
      const card = getOrCreateCard();
      const { startDate, endDate } = getMonthRange(offset);
      const monthPickerHtml = buildMonthPickerHtml(offset);
      card.innerHTML = `
        <div class="wls-card">
          <div class="wls-accent accent-muted"></div>
          <div class="wls-top-row" style="cursor:default">
            <div class="wls-title">Work log summary</div>
            ${monthPickerHtml}
            <div class="wls-top-right">
              <span class="wls-range">${formatDisplayDate(startDate)} – ${formatDisplayDate(endDate)}</span>
            </div>
          </div>
          <div class="wls-loading"><div class="wls-spinner"></div> Crunching data for ${getMonthRange(offset).startDate.slice(0,7)}…</div>
        </div>`;
      // month buttons during loading — switch immediately
      card.querySelectorAll("[data-month-offset]").forEach((btn) => {
        btn.addEventListener("click", (e) => { e.stopPropagation(); const o = Number(btn.dataset.monthOffset); if (o !== _monthOffset) { _monthOffset = o; render(); } });
      });
    };
  
    const renderError = (message, offset = 0) => {
      const card = getOrCreateCard(); card.className = "";
      const { startDate, endDate } = getMonthRange(offset);
      const monthPickerHtml = buildMonthPickerHtml(offset);
      card.innerHTML = `
        <div class="wls-card">
          <div class="wls-accent accent-bad"></div>
          <div class="wls-top-row" style="cursor:default">
            <div class="wls-title">Work log summary</div>
            ${monthPickerHtml}
            <div class="wls-top-right">
              <span class="wls-range">${formatDisplayDate(startDate)} – ${formatDisplayDate(endDate)}</span>
              <button class="wls-btn wls-btn-primary" type="button" data-wls-refresh>${icon("refresh")} Refresh</button>
            </div>
          </div>
          <div class="wls-error-box">${escapeHtml(message)}</div>
        </div>`;
      card.querySelector("[data-wls-refresh]")?.addEventListener("click", render);
      card.querySelectorAll("[data-month-offset]").forEach((btn) => {
        btn.addEventListener("click", (e) => { e.stopPropagation(); const o = Number(btn.dataset.monthOffset); if (o !== _monthOffset) { _monthOffset = o; render(); } });
      });
    };
  
    const renderSuccess = ({ startDate, endDate, checkInSummary, timesheetSummary, comparison, timesheetError }) => {
      _state = { checkInSummary, timesheetSummary, comparison, timesheetError };
      const card = getOrCreateCard();
      if (_isExpanded) card.classList.add("wls-expanded");
      else card.classList.remove("wls-expanded");
  
      const status = getOverallStatus({ checkInSummary, timesheetSummary, comparison, timesheetError });
      const worked = checkInSummary.totalCheckInWorkMinutes;
      const logged = timesheetSummary.totalMinutes;
      const yetToLog = timesheetError ? 0 : Math.max(0, worked - logged);
      const overLogged = timesheetError ? 0 : Math.max(0, logged - worked);
      const progPct = worked > 0 ? Math.min(100, Math.round((logged / worked) * 100)) : 0;
      const progClass = logged > worked ? "prog-over" : progPct >= 95 ? "prog-ok" : "prog-low";
  
      // popover data
      const popPending  = makePop({ title:"Compensation balance", rows:[{ label:"Time-off taken",value:formatMinutes(checkInSummary.totalTimeOffMinutes) },{ label:"Compensated",value:formatMinutes(checkInSummary.totalExtraWorkedMinutes) },{ label:"Still pending",value:formatMinutes(checkInSummary.pendingMinutes) }], note:checkInSummary.pendingMinutes===0?"All balanced! 🎉":"Work extra hours to clear this." });
      const popTimeoff  = makePop({ title:"Time-off taken", rows:[{ label:"Total",value:formatMinutes(checkInSummary.totalTimeOffMinutes) },{ label:"Records",value:String(checkInSummary.timeOffRows.length) }], note:"Individual slots listed inside." });
      const popComp     = makePop({ title:"Compensated hours", rows:[{ label:"Extra worked",value:formatMinutes(checkInSummary.totalExtraWorkedMinutes) },{ label:"Sessions",value:String(checkInSummary.extraRows.length) }], note:"Includes weekend work and above-target days." });
      const popLogged   = makePop({ title:"Timesheet vs check-in", rows:[{ label:"Worked",value:formatMinutes(worked) },{ label:"Logged",value:timesheetError?"API error":formatMinutes(logged) },{ label:"Gap",value:timesheetError?"–":formatSignedMinutes(logged-worked) },{ label:"Match rate",value:timesheetError?"–":`${progPct}%` }], note:timesheetError?"Timesheet unavailable.":overLogged>0?"Over-logged — double-check entries.":yetToLog>0?`${formatMinutes(yetToLog)} still unlogged.`:"Fully matched! ✓" });
      const popWorked   = makePop({ title:"Hours worked (check-in)", rows:[{ label:"Total worked",value:formatMinutes(worked) },{ label:"Days with check-in",value:String(checkInSummary.dayRows.filter(d=>d.workMinutes>0).length) },{ label:"Day-offs",value:String(checkInSummary.dayOffCount) }], note:"Derived from check-in & check-out times." });
      const popMismatch = makePop({ title:"Day mismatches", rows:[{ label:"Days compared",value:String(comparison.rows.length) },{ label:"Mismatches",value:String(comparison.mismatchCount) },{ label:"Method",value:"Rounded hour" }], note:comparison.mismatchCount===0?"All days match! 🎉":`Fix these ${comparison.mismatchCount} days in the timesheet.` });
      const popDayoff   = makePop({ title:"Day-offs this month", rows:[{ label:"Total day-offs",value:String(checkInSummary.dayOffCount) },{ label:"Types",value:[...new Set(checkInSummary.dayOffRows.map(r=>r.type))].join(", ")||"–" }], note:"Includes Day Off, Comp Off, and On Duty." });
  
      // collapsed inline stats
      const mismatchColor = comparison.mismatchCount === 0 ? "wls-stat-good" : "wls-stat-bad";
      const pendingColor  = checkInSummary.pendingMinutes === 0 ? "wls-stat-good" : "wls-stat-warn";
      const inlineStats = `
        <div class="wls-inline-stats">
          <span class="wls-stat-sep">·</span>
          <span class="wls-stat wls-stat-purple wls-dur" ${popTimeoff} data-modal-key="timeoff">Time-off <strong>${escapeHtml(formatMinutes(checkInSummary.totalTimeOffMinutes))}</strong></span>
          <span class="wls-stat-sep">·</span>
          <span class="wls-stat wls-stat-purple wls-dur" ${popComp} data-modal-key="compensated">Comp'd <strong>${escapeHtml(formatMinutes(checkInSummary.totalExtraWorkedMinutes))}</strong></span>
          <span class="wls-stat-sep">·</span>
          <span class="wls-stat ${pendingColor} wls-dur" ${popPending} data-modal-key="pending">Pending <strong>${escapeHtml(formatMinutes(checkInSummary.pendingMinutes))}</strong></span>
          <span class="wls-stat-sep">·</span>
          <span class="wls-stat wls-dur" ${popLogged} data-modal-key="logged">Logged <strong>${timesheetError?"?":progPct+"%"}</strong></span>
          <span class="wls-stat-sep">·</span>
          <span class="wls-stat ${mismatchColor} wls-dur" ${popMismatch} data-modal-key="mismatches"><strong>${timesheetError?"–":comparison.mismatchCount}</strong> mismatch${comparison.mismatchCount!==1?"es":""}</span>
          <span class="wls-stat-sep">·</span>
          <span class="wls-stat wls-dur" ${popDayoff} data-modal-key="dayoffs">Day-offs <strong>${checkInSummary.dayOffCount}</strong></span>
        </div>`;
  
      const detailsHtml = buildDetailsHtml({ checkInSummary, timesheetSummary, comparison, timesheetError, status });
      const monthPickerHtml = buildMonthPickerHtml(_monthOffset);
  
      const expandedBody = `
        <div class="wls-expandable">
          <div class="wls-body-divider"></div>
          <div class="wls-expandable-inner">
            <div class="wls-main">
              <div class="wls-block wls-block-comp">
                <div class="wls-block-hd"><div class="wls-block-icon icon-comp">${icon("clock",14)}</div><span class="wls-block-label">Compensation balance</span></div>
                <div class="wls-big wls-big-c"><span class="wls-dur" ${popPending} data-modal-key="pending">${escapeHtml(formatMinutes(checkInSummary.pendingMinutes))}</span><span class="wls-big-sub"> pending</span></div>
                <div class="wls-chips">
                  <span class="wls-chip chip-purple wls-dur" ${popTimeoff} data-modal-key="timeoff">${icon("clock",11)} Time-off &nbsp;<strong>${escapeHtml(formatMinutes(checkInSummary.totalTimeOffMinutes))}</strong></span>
                  <span class="wls-chip chip-pink wls-dur" ${popComp} data-modal-key="compensated">${icon("check",11)} Compensated &nbsp;<strong>${escapeHtml(formatMinutes(checkInSummary.totalExtraWorkedMinutes))}</strong></span>
                  <span class="wls-chip chip-amber wls-dur" ${popDayoff} data-modal-key="dayoffs">${icon("cal",11)} Day-offs &nbsp;<strong>${checkInSummary.dayOffCount}</strong></span>
                </div>
              </div>
              <div class="wls-block wls-block-ts">
                <div class="wls-block-hd"><div class="wls-block-icon icon-ts">${icon("report",14)}</div><span class="wls-block-label">Worked vs logged</span></div>
                <div class="wls-big wls-big-t">${timesheetError?`<span style="font-size:14px;color:#94a3b8">Unavailable</span>`:`<span class="wls-dur" ${popLogged} data-modal-key="logged">${escapeHtml(formatMinutes(logged))}</span>`}<span class="wls-big-sub"> logged</span></div>
                <div class="wls-block-sub">of <span class="wls-dur" ${popWorked} data-modal-key="worked">${escapeHtml(formatMinutes(worked))}</span> worked</div>
                ${timesheetError?"":`<div class="wls-prog-wrap"><div class="wls-prog-track"><div class="wls-prog-fill ${progClass}" style="width:0%" data-pct="${progPct}"></div></div><div class="wls-prog-labels"><span>${progPct}% logged</span><span>${logged>worked?"over-logged ⚠":yetToLog>0?escapeHtml(formatMinutes(yetToLog))+" to go":"complete ✓"}</span></div></div>`}
                <div class="wls-chips">
                  ${timesheetError?`<span class="wls-chip chip-slate">Timesheet unavailable</span>`:overLogged>0?`<span class="wls-chip chip-amber wls-dur" ${popLogged} data-modal-key="logged">${icon("warn",11)} ${escapeHtml(formatMinutes(overLogged))} over-logged</span>`:`<span class="wls-chip ${yetToLog===0?"chip-green":"chip-blue"} wls-dur" ${popLogged} data-modal-key="logged">${icon(yetToLog===0?"check":"clock",11)} ${yetToLog===0?"All logged":""+escapeHtml(formatMinutes(yetToLog))+" left"}</span>`}
                  <span class="wls-chip ${comparison.mismatchCount===0?"chip-green":"chip-red"} wls-dur" ${popMismatch} data-modal-key="mismatches">${icon(comparison.mismatchCount===0?"check":"warn",11)} ${timesheetError?"–":comparison.mismatchCount} mismatch${comparison.mismatchCount!==1?"es":""}</span>
                </div>
              </div>
            </div>
            <div class="wls-summary ${status.summaryClass}">
              <div class="wls-summary-label ${status.slabelClass}">${icon(status.icon,11)} ${escapeHtml(status.label)}</div>
              ${status.message}
            </div>
            <div class="wls-exp-actions">
              <button class="wls-btn" type="button" data-wls-details>${icon("list")} View full details</button>
            </div>
          </div>
        </div>
        <div class="wls-modal-backdrop" data-wls-modal hidden>
          <div class="wls-modal" role="dialog" aria-modal="true">
            <div class="wls-modal-head">
              <div><div class="wls-modal-title">Full work log breakdown</div><div class="wls-modal-subtitle">${formatDisplayDate(startDate)} – ${formatDisplayDate(endDate)}</div></div>
              <button class="wls-close-btn" type="button" data-wls-close>${icon("close")} Close</button>
            </div>
            <div class="wls-modal-body">${detailsHtml}</div>
          </div>
        </div>`;
  
      card.innerHTML = `
        <div class="wls-card">
          <div class="wls-accent ${status.accentClass}"></div>
          <div class="wls-top-row" data-wls-toggle>
            <span class="wls-chevron">${icon("chevron",16)}</span>
            <span class="wls-title">Work log summary</span>
            <span class="wls-badge ${status.badgeClass}">${icon(status.icon,11)} ${escapeHtml(status.label)}</span>
            ${inlineStats}
            <div class="wls-top-right">
              ${monthPickerHtml}
              <span class="wls-range">${formatDisplayDate(startDate)} – ${formatDisplayDate(endDate)}</span>
              <button class="wls-btn wls-btn-primary" type="button" data-wls-refresh>${icon("refresh")} Refresh</button>
            </div>
          </div>
          ${expandedBody}
        </div>`;
  
      // progress bar animation
      setTimeout(() => { const fill = card.querySelector(".wls-prog-fill"); if (fill) fill.style.width = `${Math.min(100, Number(fill.dataset.pct))}%`; }, 80);
  
      // month picker
      card.querySelectorAll("[data-month-offset]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const o = Number(btn.dataset.monthOffset);
          if (o !== _monthOffset) { _monthOffset = o; render(); }
        });
      });
  
      // accordion toggle (ignore clicks on month picker, chips, modals, buttons)
      card.querySelector("[data-wls-toggle]")?.addEventListener("click", (e) => {
        if (e.target.closest("button,[data-modal-key],.wls-month-picker")) return;
        _isExpanded = !_isExpanded;
        card.classList.toggle("wls-expanded", _isExpanded);
      });
  
      // full details modal
      const modal = card.querySelector("[data-wls-modal]");
      card.querySelector("[data-wls-details]")?.addEventListener("click", (e) => { e.stopPropagation(); modal.hidden = false; });
      card.querySelector("[data-wls-close]")?.addEventListener("click", () => { modal.hidden = true; });
      modal?.addEventListener("click", (e) => { if (e.target === modal) modal.hidden = true; });
      card.querySelector("[data-wls-refresh]")?.addEventListener("click", (e) => { e.stopPropagation(); render(); });
  
      attachPopovers(card);
      attachModalClicks(card);
    };
  
    // ─── Main render ─────────────────────────────────────────────────────────────
    async function render() {
      createStyles();
      renderLoading(_monthOffset);
      try {
        const checkInResult = await fetchCheckInData(_monthOffset);
        const checkInSummary = groupCheckIn(checkInResult.rows);
        let timesheetSummary = { dayMap:new Map(), dayRows:[], records:[], totalMinutes:0 };
        let comparison = { rows:[], mismatchRows:[], mismatchCount:0 };
        let timesheetError = "";
        try {
          const tsResult = await fetchTimesheetAllPages({ startDate:checkInResult.startDate, endDate:checkInResult.endDate });
          timesheetSummary = groupTimesheet({ rows:tsResult.rows, startDate:checkInResult.startDate, endDate:checkInResult.endDate });
          comparison = buildComparison({ checkInSummary, timesheetSummary });
        } catch (err) { timesheetError = err.message || "Unable to fetch timesheet data."; }
        renderSuccess({ startDate:checkInResult.startDate, endDate:checkInResult.endDate, checkInSummary, timesheetSummary, comparison, timesheetError });
      } catch (err) { renderError(err.message || "Unable to calculate work log summary.", _monthOffset); }
    }
  
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      document.getElementById(CONFIG.cardId)?.querySelector("[data-wls-modal]") &&
        (document.getElementById(CONFIG.cardId).querySelector("[data-wls-modal]").hidden = true);
      hideMiniModal(); hidePopover();
    });
  
    await render();
  })();
  