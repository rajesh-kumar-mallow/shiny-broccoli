import { render } from "preact";
import { fetchCheckInData } from "../lib/api";
import { parseTimeToMinutes, waitForElement } from "../lib/utils";
import { WORK_DAY_MINUTES } from "../shared/constants";
import type { DayEntry, DaySegment, RawCheckInRow, RowTooltipData, TimelineEntry } from "./types";
import {
  CHART_CONTAINER_ID,
  classifySegment,
  DAY_OFF_TYPES,
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
import { getSharedWindow, CustomTimeline } from "./timeline-components";
import { WorkTooltip, DayOffTooltip, SegmentTooltip } from "./tooltip";

const REQUIRED_WORK_MINUTES = WORK_DAY_MINUTES;

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

const toTimelineEntry = (day: DayEntry, isToday: boolean): TimelineEntry => ({
  key: day.dateLabel,
  label: day.dateLabel,
  sublabel: formatDuration(day.workedMinutes),
  segments: day.segments,
  isDayOff: day.isDayOff,
  dayOffType: day.dayOffType,
  isHighlighted: isToday,
});

const buildDayTooltipData = ({
  day,
  isToday,
}: {
  day: DayEntry;
  isToday: boolean;
}): RowTooltipData => {
  const sum = (kind: DaySegment["kind"]) =>
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
  if (!nativeContainer) {
    waitForElement("#my-checkin-detail", () => renderCustomTimeline());
    return;
  }

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

  const today = new Date();
  const entries = days.map((day) => toTimelineEntry(day, isSameDate(day.dateObj, today)));
  const windowRange = getSharedWindow(days);
  const dayByKey = new Map(days.map((day) => [day.dateLabel, day]));

  const handleHoverLabel = (event: MouseEvent, entry: TimelineEntry) => {
    const day = dayByKey.get(entry.key);
    if (!day) return;

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

  const nativeContainer = document.getElementById("my-checkin-detail");
  if (nativeContainer) nativeContainer.style.display = "";
  document.getElementById(CHART_CONTAINER_ID)?.remove();
};
