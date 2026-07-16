import { render } from "preact";
import { CONFIG } from "../lib/config";
import { fetchCheckInData } from "../lib/api";
import { parseTimeToMinutes } from "../lib/utils";
import { WORK_DAY_MINUTES } from "../shared/constants";
import type { DayEntry, RawCheckInRow, RowTooltipData, SegmentKind, WindowRange } from "./types";
import {
  CHART_CONTAINER_ID,
  ensureTooltip,
  formatDuration,
  formatTime,
  getCleanLabel,
  getWorkModeInfo,
  isSameDate,
  moveTooltip,
  parseDateLabel,
  parseWorkedMinutes,
} from "./shared";
import { WorkTooltip, DayOffTooltip } from "./tooltip";

const REQUIRED_WORK_MINUTES = WORK_DAY_MINUTES;

const BREAK_TYPES = new Set(["Short Break", "Long Break", "break", "lunch"]);
const DAY_OFF_TYPES = new Set([...CONFIG.dayOffLabels, "Declared Holiday"]);

const classifySegment = (row: RawCheckInRow): SegmentKind | null => {
  const type = String(row.type || "");

  if (CONFIG.workTypes.has(type)) return row.work_from_office ? "wfo" : "wfh";
  if (BREAK_TYPES.has(type)) return "break";
  if (CONFIG.timeOffTypes.has(type)) return "timeoff";

  return null;
};

const groupMyDays = (rows: RawCheckInRow[]): DayEntry[] => {
  const dayMap = new Map<string, DayEntry>();

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
        dayOffType: isDayOff ? type : undefined,
        segments: [],
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

  return [...dayMap.values()].sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
};

const getSharedWindow = (days: DayEntry[]): WindowRange => {
  let min = Infinity;
  let max = -Infinity;

  days.forEach((day) => {
    day.segments.forEach((seg) => {
      min = Math.min(min, seg.startMinutes);
      max = Math.max(max, seg.endMinutes);
    });
  });

  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) {
    return { startMinutes: 9 * 60, endMinutes: 19 * 60 };
  }

  const pad = 15;
  return {
    startMinutes: Math.max(0, Math.floor(min / 30) * 30 - pad),
    endMinutes: Math.min(24 * 60, Math.ceil(max / 30) * 30 + pad),
  };
};

const getAxisLabels = (windowRange: WindowRange) => {
  const count = 5;
  const span = windowRange.endMinutes - windowRange.startMinutes;

  return Array.from({ length: count }, (_, index) => {
    const minutes = windowRange.startMinutes + (span * index) / (count - 1);
    return formatTime(new Date(0, 0, 0, Math.floor(minutes / 60), Math.round(minutes % 60)));
  });
};

const buildDayTooltipData = ({
  day,
  isToday,
}: {
  day: DayEntry;
  isToday: boolean;
}): RowTooltipData => {
  const sum = (kind: SegmentKind) =>
    day.segments
      .filter((seg) => seg.kind === kind)
      .reduce((total, seg) => total + (seg.endMinutes - seg.startMinutes), 0);

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
    isDayOffRow: day.isDayOff,
  };

  if (day.isDayOff) {
    return {
      ...base,
      dayOffSubtitle: isToday ? "No checkout needed today" : "No checkout was needed for this day",
      dayOffMessage: isToday
        ? "Off duty and chilling today 🎉"
        : "A well-earned break was logged 🎉",
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
      primaryChipLabel: "Remaining",
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
        primaryChipLabel: "Remaining",
      };
    }

    const checkoutTime = new Date(Date.now() + remainingMinutes * 60 * 1000);

    return {
      ...base,
      subtitle: "Your checkout plan",
      heroTitle: "Recommended checkout",
      heroValue: `Checkout at ${formatTime(checkoutTime)}`,
      badgeText: `${formatDuration(remainingMinutes)} left`,
      status: "pending",
      primaryChipLabel: "Remaining",
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
      primaryChipLabel: "Remaining",
    };
  }

  return {
    ...base,
    subtitle: "Check-in summary",
    heroTitle: "Workday status",
    heroValue: `Short by ${formatDuration(remainingMinutes)}`,
    badgeText: `Short by ${formatDuration(remainingMinutes)}`,
    status: "short",
    primaryChipLabel: "Shortfall",
  };
};

function TimelineRow({
  day,
  windowRange,
  isToday,
  onHover,
  onMove,
  onLeave,
}: {
  day: DayEntry;
  windowRange: WindowRange;
  isToday: boolean;
  onHover: (event: MouseEvent, day: DayEntry) => void;
  onMove: (event: MouseEvent) => void;
  onLeave: () => void;
}) {
  const span = windowRange.endMinutes - windowRange.startMinutes;
  const toPct = (minutes: number) =>
    Math.min(100, Math.max(0, ((minutes - windowRange.startMinutes) / span) * 100));

  return (
    <div
      class={`cht-chart-row${isToday ? " cht-chart-row--today" : ""}`}
      onMouseEnter={(event) => onHover(event, day)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div class="cht-chart-row-label">
        <span class="cht-chart-row-date">{day.dateLabel}</span>
        <span class="cht-chart-row-worked">{formatDuration(day.workedMinutes)}</span>
      </div>
      <div class="cht-chart-row-track">
        {day.isDayOff ? (
          <div class="cht-chart-seg cht-chart-seg--dayoff" style="left:0%;width:100%">
            {day.dayOffType || "Day Off"}
          </div>
        ) : (
          day.segments.map((seg, index) => (
            <div
              key={index}
              class={`cht-chart-seg cht-chart-seg--${seg.kind}`}
              style={`left:${toPct(seg.startMinutes)}%;width:${
                toPct(seg.endMinutes) - toPct(seg.startMinutes)
              }%`}
            />
          ))
        )}
      </div>
    </div>
  );
}

function CustomTimeline({
  days,
  windowRange,
  onHover,
  onMove,
  onLeave,
}: {
  days: DayEntry[];
  windowRange: WindowRange;
  onHover: (event: MouseEvent, day: DayEntry) => void;
  onMove: (event: MouseEvent) => void;
  onLeave: () => void;
}) {
  const axisLabels = getAxisLabels(windowRange);
  const today = new Date();

  return (
    <div class="cht-chart">
      <div class="cht-chart-axis">
        {axisLabels.map((label, index) => (
          <span key={index}>{label}</span>
        ))}
      </div>
      <div class="cht-chart-rows">
        {days.map((day) => (
          <TimelineRow
            key={day.dateLabel}
            day={day}
            windowRange={windowRange}
            isToday={isSameDate(day.dateObj, today)}
            onHover={onHover}
            onMove={onMove}
            onLeave={onLeave}
          />
        ))}
      </div>
    </div>
  );
}

const ensureChartContainer = (nativeContainer: HTMLElement): HTMLElement => {
  let container = document.getElementById(CHART_CONTAINER_ID) as HTMLElement | null;
  if (container) return container;

  container = document.createElement("div");
  container.id = CHART_CONTAINER_ID;
  nativeContainer.parentElement?.insertBefore(container, nativeContainer);

  return container;
};

let myModeActive = false;
let myRefreshTimer: ReturnType<typeof setInterval> | null = null;

const renderCustomTimeline = async () => {
  const nativeContainer = document.getElementById("my-checkin-detail");
  if (!nativeContainer) return;

  nativeContainer.style.display = "none";
  const chartContainer = ensureChartContainer(nativeContainer);
  const tooltip = ensureTooltip();

  let rows: RawCheckInRow[];

  try {
    const result = await fetchCheckInData(0);
    rows = result.rows as RawCheckInRow[];
  } catch (error) {
    console.error("[checkout-hover-helper] Failed to fetch check-in data.", error);
    return;
  }

  const days = groupMyDays(rows);
  if (!days.length) return;

  const windowRange = getSharedWindow(days);

  const handleHover = (event: MouseEvent, day: DayEntry) => {
    const isToday = isSameDate(day.dateObj, new Date());
    const data = buildDayTooltipData({ day, isToday });

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

  render(
    <CustomTimeline
      days={days}
      windowRange={windowRange}
      onHover={handleHover}
      onMove={(event) => moveTooltip(tooltip, event)}
      onLeave={() => {
        tooltip.style.display = "none";
      }}
    />,
    chartContainer,
  );
};

export const ensureMyModeActive = () => {
  if (myModeActive) return;
  myModeActive = true;

  renderCustomTimeline();
  myRefreshTimer = window.setInterval(renderCustomTimeline, 60000);
};

export const teardownMyMode = () => {
  if (!myModeActive) return;
  myModeActive = false;

  if (myRefreshTimer) window.clearInterval(myRefreshTimer);
  myRefreshTimer = null;
};
