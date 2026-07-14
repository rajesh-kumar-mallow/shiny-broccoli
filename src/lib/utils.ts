import { CONFIG } from "./config";

const pad = (v: number | string) => String(v).padStart(2, "0");

export const escapeHtml = (v: unknown) =>
  String(v ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export const stripHtml = (v: unknown) => {
  const d = document.createElement("div");
  d.innerHTML = String(v ?? "");
  return d.textContent || d.innerText || "";
};

export const toYMD = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const getMonthRange = (offset = 0) => {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + offset;
  const start = new Date(y, m, 1);
  const end = new Date(y, m + 1, 0);
  return { startDate: toYMD(start), endDate: toYMD(end) };
};

export const buildMonthOptions = (count = 6) => {
  const now = new Date();
  const months = [];
  for (let i = 0; i >= -(count - 1); i--) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    months.push({
      offset: i,
      label:
        i === 0
          ? "This month"
          : i === -1
            ? "Last month"
            : d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
      shortLabel: d.toLocaleDateString("en-IN", { month: "short" }),
      year: d.getFullYear(),
      month: d.getMonth(),
      fullLabel: d.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
    });
  }
  return months;
};

export const parseDate = (value: unknown): Date | null => {
  if (!value) return null;
  const text = stripHtml(value).trim().replace(",", "");
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return new Date(`${text}T00:00:00`);
  if (window.moment) {
    const p = window.moment(
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
        "MMMM DD YYYY",
      ],
      true,
    );
    if (p.isValid()) return p.toDate();
  }
  const n = new Date(text);
  return isNaN(n.getTime()) ? null : n;
};

export const formatDisplayDate = (v: unknown) => {
  const d = parseDate(v);
  if (!d) return String(v || "-");
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export const parseTimeToMinutes = (time: unknown): number | null => {
  if (!time) return null;
  const v = stripHtml(time).trim();
  const m = v.match(/^(\d{1,2}):(\d{2})(?::\d{2})?(?:\s?(AM|PM))?$/i);
  if (!m) return null;
  let h = Number(m[1]);
  const min = Number(m[2]);
  const mer = m[3]?.toUpperCase();
  if (mer === "PM" && h !== 12) h += 12;
  if (mer === "AM" && h === 12) h = 0;
  return h * 60 + min;
};

export const parseTimesheetDurationToMinutes = (value: unknown): number => {
  if (value === null || typeof value === "undefined") return 0;
  if (typeof value === "number") return isFinite(value) ? Math.round(value * 60) : 0;
  const text = stripHtml(value).trim().toLowerCase();
  if (!text || text === "-" || text === "null") return 0;
  const n = Number(text);
  if (isFinite(n)) return Math.round(n * 60);
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

export const formatMinutes = (total: number) => {
  const s = Math.max(0, Math.round(total || 0));
  const h = Math.floor(s / 60);
  const m = s % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
};

export const formatSignedMinutes = (min: number) => {
  const v = Math.round(min || 0);
  if (v === 0) return "0m";
  return `${v > 0 ? "+" : "−"}${formatMinutes(Math.abs(v))}`;
};

export const roundedHour = (min: number) => Math.round((min || 0) / 60);

export const isToday = (d: Date | null) => d && toYMD(d) === toYMD(new Date());

const getCurrentMinutes = () => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

export const getDurationMinutes = (
  start: unknown,
  end: unknown,
  date: Date,
  allowRunning = false,
) => {
  const s = parseTimeToMinutes(start);
  let e = parseTimeToMinutes(end);
  if (e === null && allowRunning && isToday(date)) e = getCurrentMinutes();
  if (s === null || e === null || e <= s) return 0;
  return e - s;
};

export const getTypeLabel = (row: Record<string, unknown>) => {
  const t = String(row.type || "");
  if (
    [
      "Day Start Time Off",
      "Attendance Time Off",
      "attendance-time-off",
      "day-start-time-off",
    ].includes(t)
  )
    return "Time Off";
  if (t === "Day Off" && row.leave_category === "comp_off") return "Comp Off";
  if (t === "Day Off" && row.leave_category === "on_duty") return "On Duty";
  return t || "-";
};

export const flattenAttendanceData = (data: Record<string, unknown[]>) =>
  Object.entries(data || {}).flatMap(([key, rows]) =>
    (rows || []).map((r) => ({
      ...(r as Record<string, unknown>),
      date: (r as Record<string, unknown>).my_check_in_date || key,
    })),
  );

export const getCsrfToken = () =>
  document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "";

export const getLoggedInUserId = () => {
  const href = document.querySelector('a[href*="/users/"][href*="/profile"]')?.getAttribute("href");
  return href?.match(/\/users\/(\d+)\/profile/)?.[1] || "";
};

export const getTimesheetRecordTitle = (row: Record<string, unknown>) =>
  [row.project_name, row.module_name, row.task_name].filter(Boolean).join(" / ") || "-";

export const removePreviousArtifacts = () => {
  CONFIG.oldIds.forEach((id) => document.getElementById(id)?.remove());
};
