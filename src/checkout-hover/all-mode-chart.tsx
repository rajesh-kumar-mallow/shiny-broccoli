import { render } from "preact";
import { parseTimeToMinutes, waitForElement } from "../lib/utils";
import { WORK_DAY_MINUTES } from "../shared/constants";
import type {
  AllCheckInResponse,
  AllCheckInRow,
  DaySegment,
  EmployeeEntry,
  TimelineEntry,
} from "./types";
import {
  ALL_CHART_CONTAINER_ID,
  classifySegment,
  DAY_OFF_TYPES,
  ensureTooltip,
  formatDuration,
  formatTime,
  getCleanLabel,
  getWorkModeInfo,
  moveTooltip,
  parseWorkedMinutes,
} from "./shared";
import { getSharedWindow, CustomTimeline } from "./timeline-components";
import { WorkTooltip, DayOffTooltip, SegmentTooltip } from "./tooltip";
import type { RowTooltipData } from "./types";

const REQUIRED_WORK_MINUTES = WORK_DAY_MINUTES;
const NO_DATA_TYPE = "No Data Found for Attendance";
const TARGET_URL_FRAGMENT = "get-all-check-in-data";
const NATIVE_CONTAINER_SELECTOR = "#checkin-detail, #all-checkin-detail, #all-check-in-detail";

// GET /attendance/get-all-check-in-data is fired by the native page itself
// (via jQuery, which runs on XMLHttpRequest under the hood) whenever the
// admin changes the date/team/user filter. Watching XHR directly — rather
// than calling the endpoint ourselves — means we never duplicate that
// request and always see exactly the data the admin is currently looking
// at, filters included, for free.
type XhrWithUrl = XMLHttpRequest & { __hpsInterceptUrl?: string };

const installAjaxInterceptor = (onData: (data: AllCheckInResponse) => void) => {
  if (window.__hubbleAllModeInterceptorInit) return;
  window.__hubbleAllModeInterceptorInit = true;

  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (
    this: XhrWithUrl,
    ...args: Parameters<typeof XMLHttpRequest.prototype.open>
  ): ReturnType<typeof XMLHttpRequest.prototype.open> {
    this.__hpsInterceptUrl = String(args[1]);
    return originalOpen.apply(this, args);
  } as typeof XMLHttpRequest.prototype.open;

  XMLHttpRequest.prototype.send = function (
    this: XhrWithUrl,
    ...args: Parameters<typeof XMLHttpRequest.prototype.send>
  ): ReturnType<typeof XMLHttpRequest.prototype.send> {
    if (this.__hpsInterceptUrl?.includes(TARGET_URL_FRAGMENT)) {
      this.addEventListener("load", () => {
        try {
          onData(JSON.parse(this.responseText) as AllCheckInResponse);
        } catch (error) {
          console.error("[checkout-hover-helper] Failed to parse all check-in data.", error);
        }
      });
    }
    return originalSend.apply(this, args);
  };
};

const groupAllEmployees = (data: Record<string, AllCheckInRow[]>): EmployeeEntry[] =>
  Object.entries(data)
    .map(([userIdStr, rows]) => {
      const userId = Number(userIdStr);
      const rawName = String(rows[0]?.name || "");

      const hasNoData = rows.every((row) => row.type === NO_DATA_TYPE);
      const dayOffRow = rows.find((row) => row.type && DAY_OFF_TYPES.has(row.type));

      const segments: DaySegment[] = [];
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

      const entry: EmployeeEntry = {
        userId,
        name: getCleanLabel(rawName),
        team: rows[0]?.team,
        workedMinutes: parseWorkedMinutes(rawName) || 0,
        isDayOff: !!dayOffRow,
        dayOffType: dayOffRow?.type,
        hasNoData,
        segments,
      };
      return entry;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

const toTimelineEntry = (employee: EmployeeEntry): TimelineEntry => ({
  key: String(employee.userId),
  label: employee.name,
  sublabel: employee.hasNoData ? "No data" : formatDuration(employee.workedMinutes),
  segments: employee.segments,
  isDayOff: employee.isDayOff,
  dayOffType: employee.dayOffType,
});

// Adapted from the pixel-inference version this replaces (formerly
// all-mode-engine.tsx's buildRowTooltipData) — same "always today, no
// isToday branching" shape, now summed from real segment data instead of
// SVG rect widths.
const buildEmployeeTooltipData = (employee: EmployeeEntry): RowTooltipData => {
  const sum = (kind: DaySegment["kind"]) =>
    employee.segments
      .filter((seg) => seg.kind === kind)
      .reduce((total, seg) => total + (seg.endMinutes - seg.startMinutes), 0);

  const officeMinutes = sum("wfo");
  const homeMinutes = sum("wfh");
  const timeOffMinutes = sum("timeoff");

  const workMode = getWorkModeInfo({ officeMinutes, homeMinutes });
  const requiredMinutes = Math.max(0, Math.round(REQUIRED_WORK_MINUTES - timeOffMinutes));
  const remainingMinutes = Math.max(0, requiredMinutes - employee.workedMinutes);

  const base = {
    title: employee.team ? `${employee.name} · ${employee.team}` : employee.name,
    worked: formatDuration(employee.workedMinutes),
    timeOff: formatDuration(timeOffMinutes),
    required: formatDuration(requiredMinutes),
    remaining: formatDuration(remainingMinutes),
    workMode,
    isDayOffRow: employee.isDayOff,
  };

  if (employee.isDayOff) {
    return {
      ...base,
      dayOffSubtitle: "No checkout needed today",
      dayOffMessage: "Off duty and chilling today 🎉",
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
      primaryChipLabel: "Remaining",
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
      primaryChipLabel: "Remaining",
    };
  }

  const checkoutTime = new Date(Date.now() + remainingMinutes * 60 * 1000);

  return {
    ...base,
    subtitle: "Today’s checkout plan",
    heroTitle: "Recommended checkout",
    heroValue: `Checkout at ${formatTime(checkoutTime)}`,
    badgeText: `${formatDuration(remainingMinutes)} left`,
    status: "pending",
    primaryChipLabel: "Remaining",
  };
};

function NoDataTooltip({ name }: { name: string }) {
  return (
    <div class="cht-tooltip-body">
      <div class="cht-tooltip-title">{name}</div>
      <div class="cht-tooltip-subtitle">No attendance data for today</div>
    </div>
  );
}

const ensureAllChartContainer = (nativeContainer: HTMLElement): HTMLElement => {
  let container = document.getElementById(ALL_CHART_CONTAINER_ID) as HTMLElement | null;
  if (container) return container;

  container = document.createElement("div");
  container.id = ALL_CHART_CONTAINER_ID;
  nativeContainer.parentElement?.insertBefore(container, nativeContainer);

  return container;
};

let allModeActive = false;
let lastResponse: AllCheckInResponse | null = null;

const renderAllTimeline = (response: AllCheckInResponse) => {
  const nativeContainer = document.querySelector<HTMLElement>(NATIVE_CONTAINER_SELECTOR);
  if (!nativeContainer) {
    waitForElement(NATIVE_CONTAINER_SELECTOR, () => renderAllTimeline(response));
    return;
  }

  nativeContainer.style.display = "none";
  const chartContainer = ensureAllChartContainer(nativeContainer);
  const tooltip = ensureTooltip();

  const employees = groupAllEmployees(response.data || {});
  if (!employees.length) return;

  const entries = employees.map(toTimelineEntry);
  const windowRange = getSharedWindow(employees);
  const employeeByKey = new Map(employees.map((employee) => [String(employee.userId), employee]));

  const handleHoverLabel = (event: MouseEvent, entry: TimelineEntry) => {
    const employee = employeeByKey.get(entry.key);
    if (!employee) return;

    if (employee.hasNoData) {
      render(<NoDataTooltip name={employee.name} />, tooltip);
      tooltip.style.display = "block";
      moveTooltip(tooltip, event);
      return;
    }

    const data = buildEmployeeTooltipData(employee);

    const tooltipVNode = data.isDayOffRow ? (
      <DayOffTooltip
        title={data.title}
        subtitle={data.dayOffSubtitle}
        message={data.dayOffMessage}
      />
    ) : (
      <WorkTooltip
        title={data.title}
        subtitle={data.subtitle}
        worked={data.worked}
        timeOff={data.timeOff}
        required={data.required}
        remaining={data.remaining}
        heroTitle={data.heroTitle}
        heroValue={data.heroValue}
        badgeText={data.badgeText}
        status={data.status}
        primaryChipLabel={data.primaryChipLabel}
        workMode={data.workMode}
      />
    );

    render(tooltipVNode, tooltip);
    tooltip.style.display = "block";
    moveTooltip(tooltip, event);
  };

  const handleHoverSegment = (event: MouseEvent, _entry: TimelineEntry, segment: DaySegment) => {
    render(
      <SegmentTooltip
        kind={segment.kind}
        startMinutes={segment.startMinutes}
        endMinutes={segment.endMinutes}
      />,
      tooltip,
    );
    tooltip.style.display = "block";
    moveTooltip(tooltip, event);
  };

  render(
    <CustomTimeline
      entries={entries}
      windowRange={windowRange}
      onHoverLabel={handleHoverLabel}
      onHoverSegment={handleHoverSegment}
      onMove={(event) => moveTooltip(tooltip, event)}
      onLeave={() => {
        tooltip.style.display = "none";
      }}
    />,
    chartContainer,
  );
};

export const ensureAllModeChartActive = () => {
  if (allModeActive) return;
  allModeActive = true;

  installAjaxInterceptor((data) => {
    lastResponse = data;
    renderAllTimeline(data);
  });

  if (lastResponse) renderAllTimeline(lastResponse);
};

export const teardownAllModeChart = () => {
  if (!allModeActive) return;
  allModeActive = false;

  const nativeContainer = document.querySelector<HTMLElement>(NATIVE_CONTAINER_SELECTOR);
  if (nativeContainer) nativeContainer.style.display = "";
  document.getElementById(ALL_CHART_CONTAINER_ID)?.remove();
};
