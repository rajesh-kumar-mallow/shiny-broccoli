import { icon } from "./icons";
import type { CheckInSummary, Comparison, TimesheetSummary } from "./types";
import {
  escapeHtml,
  formatDisplayDate,
  formatMinutes,
  formatSignedMinutes,
  stripHtml,
} from "./utils";
import type { TableColumn } from "./types";
import type { StatusInfo } from "./types";

export const renderTable = <T>({
  columns,
  rows,
  emptyText,
}: {
  columns: TableColumn<T>[];
  rows: T[];
  emptyText?: string;
}) => {
  if (!rows.length) return `<div class="wls-empty">${escapeHtml(emptyText || "No records.")}</div>`;
  return `<div class="wls-table-wrap"><table><thead><tr>${columns.map((c) => `<th>${escapeHtml(c.label)}</th>`).join("")}</tr></thead><tbody>${rows
    .map(
      (r) =>
        `<tr>${columns
          .map((c) => `<td>${c.html ? c.render(r) : escapeHtml(c.render(r))}</td>`)
          .join("")}</tr>`,
    )
    .join("")}</tbody></table></div>`;
};

const kpiColors = [
  "kpi-purple",
  "kpi-blue",
  "kpi-green",
  "kpi-amber",
  "kpi-slate",
  "kpi-purple",
  "kpi-blue",
  "kpi-amber",
];

export const renderKpis = (items: { label: string; value: string }[]) =>
  `<div class="wls-kpi-row">${items
    .map(
      (x, i) =>
        `<div class="wls-kpi ${kpiColors[i % kpiColors.length]}"><div class="wls-kpi-label">${escapeHtml(x.label)}</div><div class="wls-kpi-value">${escapeHtml(x.value)}</div></div>`,
    )
    .join("")}</div>`;

export const sectionLabel = (ico: string, text: string) =>
  `<div class="wls-section-label">${icon(ico, 13)} ${escapeHtml(text)}</div>`;

export const buildDetailsHtml = ({
  checkInSummary,
  timesheetSummary,
  comparison,
  timesheetError,
  status,
}: {
  checkInSummary: CheckInSummary;
  timesheetSummary: TimesheetSummary;
  comparison: Comparison;
  timesheetError: string;
  status: StatusInfo;
}) => {
  const yetToLog = Math.max(
    0,
    checkInSummary.totalCheckInWorkMinutes - timesheetSummary.totalMinutes,
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
        value: timesheetError ? "API error" : formatMinutes(timesheetSummary.totalMinutes),
      },
      { label: "Yet to log", value: timesheetError ? "–" : formatMinutes(yetToLog) },
      { label: "Day-offs", value: String(checkInSummary.dayOffCount) },
    ])}
    <div class="wls-insight-row">
      <div class="wls-insight"><b>Overall:</b> ${status.message}</div>
      <div class="wls-insight"><b>Compensation:</b> Took ${escapeHtml(formatMinutes(checkInSummary.totalTimeOffMinutes))} time-off, compensated ${escapeHtml(formatMinutes(checkInSummary.totalExtraWorkedMinutes))}. ${checkInSummary.pendingMinutes > 0 ? `<b>${escapeHtml(formatMinutes(checkInSummary.pendingMinutes))}</b> pending.` : "Fully balanced ✓"}</div>
      <div class="wls-insight"><b>Timesheet:</b> Worked ${escapeHtml(formatMinutes(checkInSummary.totalCheckInWorkMinutes))}, logged ${escapeHtml(timesheetError ? "API error" : formatMinutes(timesheetSummary.totalMinutes))}. ${timesheetError ? "" : yetToLog > 0 ? `<b>${escapeHtml(formatMinutes(yetToLog))}</b> yet to log.` : "Fully logged ✓"}</div>
    </div>
    <div class="wls-modal-divider"></div>
    ${
      timesheetError
        ? `${sectionLabel("report", "Timesheet API error")}<div class="wls-error-box">${escapeHtml(timesheetError)}</div>`
        : `
          <div>${sectionLabel("table", "Worked vs logged")}${renderTable({
            emptyText: "No data.",
            columns: [
              { label: "Date", render: (r) => formatDisplayDate(r.date) },
              {
                label: "Worked",
                render: (r) => `${formatMinutes(r.checkInMinutes)} (${r.roundedCheckInHours}h)`,
              },
              {
                label: "Logged",
                render: (r) => `${formatMinutes(r.timesheetMinutes)} (${r.roundedTimesheetHours}h)`,
              },
              { label: "Gap", render: (r) => formatSignedMinutes(r.diffMinutes) },
              {
                label: "Status",
                html: true,
                render: (r) => `<span class="${r.statusClass}">${escapeHtml(r.status)}</span>`,
              },
            ],
            rows: comparison.rows,
          })}</div>
          <div>${sectionLabel("warn", "Mismatches — needs attention")}${renderTable({
            emptyText: "No mismatches! 🎉",
            columns: [
              { label: "Date", render: (r) => formatDisplayDate(r.date) },
              {
                label: "Worked",
                render: (r) => `${formatMinutes(r.checkInMinutes)} (${r.roundedCheckInHours}h)`,
              },
              {
                label: "Logged",
                render: (r) => `${formatMinutes(r.timesheetMinutes)} (${r.roundedTimesheetHours}h)`,
              },
              { label: "Gap", render: (r) => formatSignedMinutes(r.diffMinutes) },
            ],
            rows: comparison.mismatchRows,
          })}</div>`
    }
    <div>${sectionLabel("clock", "Time-off taken")}${renderTable({
      emptyText: "No time-off records.",
      columns: [
        { label: "Date", render: (r) => formatDisplayDate(r.date) },
        { label: "Start", render: (r) => r.start || "–" },
        { label: "End", render: (r) => r.end || "–" },
        { label: "Duration", render: (r) => formatMinutes(r.minutes) },
      ],
      rows: checkInSummary.timeOffRows,
    })}</div>
    <div>${sectionLabel("plus", "Compensated / extra worked")}${renderTable({
      emptyText: "No extra work.",
      columns: [
        { label: "Date", render: (r) => formatDisplayDate(r.date) },
        { label: "Worked", render: (r) => formatMinutes(r.workedMinutes) },
        { label: "Time-off", render: (r) => formatMinutes(r.timeOffMinutes) },
        { label: "Expected", render: (r) => formatMinutes(r.expectedMinutes) },
        { label: "Compensated", render: (r) => formatMinutes(r.extraMinutes) },
        { label: "Reason", render: (r) => r.reason },
      ],
      rows: checkInSummary.extraRows,
    })}</div>
    <div>${sectionLabel("cal", "Day-offs")}${renderTable({
      emptyText: "No day-offs.",
      columns: [
        { label: "Date", render: (r) => formatDisplayDate(r.date) },
        { label: "Type", render: (r) => r.type },
      ],
      rows: checkInSummary.dayOffRows,
    })}</div>
    ${
      timesheetError
        ? ""
        : ` <div>${sectionLabel("entries", "Timesheet entries")}${renderTable({
            emptyText: "No entries.",
            columns: [
              { label: "Date", render: (r) => formatDisplayDate(r.date) },
              { label: "Project / Module / Task", render: (r) => r.title },
              { label: "Logged", render: (r) => formatMinutes(r.minutes) },
              { label: "Description", render: (r) => stripHtml(r.description).slice(0, 160) },
            ],
            rows: timesheetSummary.records,
          })}</div>`
    }`;
};
