import { hidePopover } from "./popover";
import { icon } from "./icons";
import type { CheckInSummary, Comparison, TimesheetSummary } from "./types";
import { escapeHtml, formatDisplayDate, formatMinutes, formatSignedMinutes } from "./utils";
import { renderTable, sectionLabel } from "./details";

let appState: {
  checkInSummary: CheckInSummary;
  timesheetSummary: TimesheetSummary;
  comparison: Comparison;
  timesheetError: string;
} | null = null;

export const setMiniModalState = (state: typeof appState) => {
  appState = state;
};

const setupMiniModal = () => {
  const existing = document.getElementById("wls-mini-modal-el");
  if (existing) return existing;
  const el = document.createElement("div");
  el.id = "wls-mini-modal-el";
  el.innerHTML = `<div class="wmm-backdrop"><div class="wmm-box"><div class="wmm-head"><div><div class="wmm-title"></div><div class="wmm-sub"></div></div><button class="wmm-close" type="button">${icon("close", 13)} Close</button></div><div class="wmm-body"></div></div></div>`;
  document.body.appendChild(el);
  el.querySelector(".wmm-backdrop")?.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) hideMiniModal();
  });
  el.querySelector(".wmm-close")?.addEventListener("click", hideMiniModal);
  return el;
};

export const hideMiniModal = () => {
  document.getElementById("wls-mini-modal-el")?.classList.remove("wls-mm-open");
};

const mmKpis = (items: { label: string; value: string }[]) => {
  const colors = ["kpi-purple", "kpi-blue", "kpi-green", "kpi-amber", "kpi-slate", "kpi-red"];
  return `<div class="wls-kpi-row">${items
    .map(
      (x, i) =>
        `<div class="wls-kpi ${colors[i % colors.length]}"><div class="wls-kpi-label">${escapeHtml(x.label)}</div><div class="wls-kpi-value">${escapeHtml(x.value)}</div></div>`,
    )
    .join("")}</div>`;
};

const buildMiniModalContent = (key: string) => {
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
            { label: "Still pending", value: formatMinutes(checkInSummary.pendingMinutes) },
          ])}
          <div>${sectionLabel("clock", "Time-off records")}${renderTable({
            emptyText: "No time-off records.",
            columns: [
              { label: "Date", render: (r) => formatDisplayDate(r.date) },
              { label: "Start", render: (r) => r.start || "–" },
              { label: "End", render: (r) => r.end || "–" },
              { label: "Duration", render: (r) => formatMinutes(r.minutes) },
            ],
            rows: checkInSummary.timeOffRows,
          })}</div>
          <div>${sectionLabel("plus", "Extra work / compensated sessions")}${renderTable({
            emptyText: "No extra work records.",
            columns: [
              { label: "Date", render: (r) => formatDisplayDate(r.date) },
              { label: "Worked", render: (r) => formatMinutes(r.workedMinutes) },
              { label: "Expected", render: (r) => formatMinutes(r.expectedMinutes) },
              { label: "Extra", render: (r) => formatMinutes(r.extraMinutes) },
              { label: "Reason", render: (r) => r.reason },
            ],
            rows: checkInSummary.extraRows,
          })}</div>`,
      };
    case "timeoff":
      return {
        title: "Time-off taken",
        sub: `${checkInSummary.timeOffRows.length} record(s) · Total ${formatMinutes(checkInSummary.totalTimeOffMinutes)}`,
        body: renderTable({
          emptyText: "No time-off records.",
          columns: [
            { label: "Date", render: (r) => formatDisplayDate(r.date) },
            { label: "Type", render: (r) => r.type },
            { label: "Start", render: (r) => r.start || "–" },
            { label: "End", render: (r) => r.end || "–" },
            { label: "Duration", render: (r) => formatMinutes(r.minutes) },
          ],
          rows: checkInSummary.timeOffRows,
        }),
      };
    case "compensated":
      return {
        title: "Extra work & compensation earned",
        sub: `${checkInSummary.extraRows.length} session(s) · Total ${formatMinutes(checkInSummary.totalExtraWorkedMinutes)}`,
        body: renderTable({
          emptyText: "No extra work recorded.",
          columns: [
            { label: "Date", render: (r) => formatDisplayDate(r.date) },
            { label: "Worked", render: (r) => formatMinutes(r.workedMinutes) },
            { label: "Time-off adj.", render: (r) => formatMinutes(r.timeOffMinutes) },
            { label: "Expected", render: (r) => formatMinutes(r.expectedMinutes) },
            { label: "Compensated", render: (r) => formatMinutes(r.extraMinutes) },
            { label: "Reason", render: (r) => r.reason },
          ],
          rows: checkInSummary.extraRows,
        }),
      };
    case "worked":
      return {
        title: "Hours worked — check-in breakdown",
        sub: `Total ${formatMinutes(checkInSummary.totalCheckInWorkMinutes)} across ${checkInSummary.dayRows.filter((d) => d.workMinutes > 0).length} days`,
        body: renderTable({
          emptyText: "No work records.",
          columns: [
            { label: "Date", render: (r) => formatDisplayDate(r.dateKey) },
            { label: "Worked", render: (r) => formatMinutes(r.workMinutes) },
            { label: "Time-off that day", render: (r) => formatMinutes(r.timeOffMinutes) },
            { label: "Sessions", render: (r) => String(r.workRecords.length) },
          ],
          rows: checkInSummary.dayRows.filter((d) => d.workMinutes > 0),
        }),
      };
    case "logged":
      return {
        title: "Worked vs logged — day by day",
        sub: timesheetError
          ? "Timesheet unavailable"
          : `${comparison.rows.length} days compared · ${formatMinutes(timesheetSummary.totalMinutes)} total logged`,
        body: timesheetError
          ? `<div class="wls-error-box">${escapeHtml(timesheetError)}</div>`
          : renderTable({
              emptyText: "No data.",
              columns: [
                { label: "Date", render: (r) => formatDisplayDate(r.date) },
                {
                  label: "Worked",
                  render: (r) => `${formatMinutes(r.checkInMinutes)} (${r.roundedCheckInHours}h)`,
                },
                {
                  label: "Logged",
                  render: (r) =>
                    `${formatMinutes(r.timesheetMinutes)} (${r.roundedTimesheetHours}h)`,
                },
                { label: "Gap", render: (r) => formatSignedMinutes(r.diffMinutes) },
                {
                  label: "Status",
                  html: true,
                  render: (r) => `<span class="${r.statusClass}">${escapeHtml(r.status)}</span>`,
                },
              ],
              rows: comparison.rows,
            }),
      };
    case "mismatches":
      return {
        title: "Days with mismatch",
        sub: `${comparison.mismatchCount} day(s) where logged ≠ worked (rounded hour)`,
        body: renderTable({
          emptyText: "No mismatches — everything lines up! 🎉",
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
        }),
      };
    case "dayoffs":
      return {
        title: "Day-offs this month",
        sub: `${checkInSummary.dayOffCount} day(s) off recorded`,
        body: renderTable({
          emptyText: "No day-offs recorded.",
          columns: [
            { label: "Date", render: (r) => formatDisplayDate(r.date) },
            { label: "Type", render: (r) => r.type },
          ],
          rows: checkInSummary.dayOffRows,
        }),
      };
    default:
      return null;
  }
};

export const showMiniModal = (key: string) => {
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

export const attachModalClicks = (container: HTMLElement) => {
  container.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).closest("button")) return;
    const trigger = (e.target as HTMLElement).closest("[data-modal-key]");
    if (!trigger) return;
    hidePopover();
    showMiniModal((trigger as HTMLElement).dataset.modalKey || "");
  });
};
