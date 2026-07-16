import type { Mode, WorkModeInfo } from "./types";

export const TOOLTIP_ID = "checkout-hover-tooltip";
export const CHART_CONTAINER_ID = "checkout-hover-custom-chart";

export const MONTHS: Record<string, number> = {
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
  dec: 11,
};

export const getMode = (): Mode => {
  const path = window.location.pathname;

  if (
    path.includes("/attendance/my-check-in-data") ||
    document.querySelector("#my-checkin-detail")
  ) {
    return "my";
  }

  return "all";
};

export const parseWorkedMinutes = (text: string): number | null => {
  const match = text.match(/\(\s*(\d+)\s*hrs?\s+(\d+)\s*mins?\s*\)/i);
  if (!match) return null;

  return Number(match[1]) * 60 + Number(match[2]);
};

export const getCleanLabel = (text: string) => text.replace(/\s*\([^)]*\)\s*$/, "").trim();

export const parseDateLabel = (label: string): Date | null => {
  const match = label.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/);
  if (!match) return null;

  const day = Number(match[1]);
  const month = MONTHS[match[2].toLowerCase()];
  const year = Number(match[3]);

  if (month === undefined) return null;

  return new Date(year, month, day);
};

export const isSameDate = (a: Date | null, b: Date | null) =>
  !!a &&
  !!b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const formatDuration = (minutes: number) => {
  const total = Math.max(0, Math.round(minutes));
  const hrs = Math.floor(total / 60);
  const mins = total % 60;

  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;

  return `${hrs}h ${mins}m`;
};

export const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

export const getWorkModeInfo = ({
  officeMinutes,
  homeMinutes,
}: {
  officeMinutes: number;
  homeMinutes: number;
}): WorkModeInfo => {
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
      homeMinutes: home,
    };
  }

  if (hasOffice) {
    return {
      type: "wfo",
      label: "WFO",
      subtitle: `Office · ${formatDuration(office)}`,
      officeMinutes: office,
      homeMinutes: home,
    };
  }

  if (hasHome) {
    return {
      type: "wfh",
      label: "WFH",
      subtitle: `Home · ${formatDuration(home)}`,
      officeMinutes: office,
      homeMinutes: home,
    };
  }

  return {
    type: "none",
    label: "No check-in mode",
    subtitle: "No WFO/WFH check-in found",
    officeMinutes: office,
    homeMinutes: home,
  };
};

export const ensureTooltip = (): HTMLDivElement => {
  let tooltip = document.getElementById(TOOLTIP_ID) as HTMLDivElement | null;

  if (tooltip) return tooltip;

  tooltip = document.createElement("div");
  tooltip.id = TOOLTIP_ID;

  tooltip.className = "cht-tooltip";
  Object.assign(tooltip.style, {
    position: "fixed",
    zIndex: "999999",
    display: "none",
    pointerEvents: "none",
  });

  document.body.appendChild(tooltip);

  return tooltip;
};

export const moveTooltip = (tooltip: HTMLElement, event: MouseEvent) => {
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
