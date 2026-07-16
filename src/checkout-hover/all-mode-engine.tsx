import { render } from "preact";
import { WORK_DAY_MINUTES } from "../shared/constants";
import type { HelperState, Point, RectInfo, RowInfo, RowTooltipData } from "./types";
import {
  ensureTooltip,
  formatDuration,
  formatTime,
  getCleanLabel,
  getWorkModeInfo,
  moveTooltip,
  parseWorkedMinutes,
} from "./shared";
import { WorkTooltip, DayOffTooltip } from "./tooltip";

const REQUIRED_WORK_MINUTES = WORK_DAY_MINUTES;

const round = (value: number, precision = 3) =>
  Math.round(value * 10 ** precision) / 10 ** precision;

const toNumber = (value: unknown) => Number(value || 0);

const median = (values: number[]) => {
  const sorted = values.slice().sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

const parseTimeLabelMinutes = (text: string): number | null => {
  const match = text.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3].toUpperCase();

  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

const getRoot = (): Element =>
  document.querySelector("#all-checkin-detail") ||
  document.querySelector("#all-check-in-detail") ||
  document.body;

const getBBoxSafe = (el: SVGGraphicsElement): DOMRect | null => {
  try {
    return el.getBBox();
  } catch {
    return null;
  }
};

const getFill = (el: Element) => {
  const fill = (el.getAttribute("fill") || "").trim().toLowerCase();
  if (fill) return fill;

  return (window.getComputedStyle(el).fill || "").trim().toLowerCase();
};

const getRgb = (color: string) => {
  const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/i);
  if (!rgbMatch) return null;

  return {
    r: Number(rgbMatch[1]),
    g: Number(rgbMatch[2]),
    b: Number(rgbMatch[3]),
  };
};

const isTimeOffColor = (color: string) => {
  if (!color) return false;

  const normalizedColor = color.toLowerCase();

  if (["#ff4f00", "#ff5000", "#f4511e", "#e24301", "#ff5722"].includes(normalizedColor)) {
    return true;
  }

  const rgb = getRgb(normalizedColor);
  if (!rgb) return false;

  return rgb.r >= 180 && rgb.g <= 120 && rgb.b <= 90;
};

const isDayOffColor = (color: string) => {
  if (!color) return false;

  const normalizedColor = color.toLowerCase();

  if (["#cd0404", "#b91c1c", "#dc2626"].includes(normalizedColor)) {
    return true;
  }

  const rgb = getRgb(normalizedColor);
  if (!rgb) return false;

  return rgb.r >= 150 && rgb.g <= 60 && rgb.b <= 60;
};

const isWfoColor = (color: string) => {
  if (!color) return false;

  const normalizedColor = color.toLowerCase();

  if (["#22914b", "#22c55e", "#16a34a", "#15803d", "#008000", "green"].includes(normalizedColor)) {
    return true;
  }

  const rgb = getRgb(normalizedColor);
  if (!rgb) return false;

  return rgb.g >= 110 && rgb.r <= 90 && rgb.b <= 120;
};

const isWfhColor = (color: string) => {
  if (!color) return false;

  const normalizedColor = color.toLowerCase();

  if (["#0066cc", "#1976d2", "#2563eb", "#1d4ed8", "#0ea5e9", "blue"].includes(normalizedColor)) {
    return true;
  }

  const rgb = getRgb(normalizedColor);
  if (!rgb) return false;

  return rgb.b >= 140 && rgb.r <= 100 && rgb.g <= 170;
};

const isDayOffText = (text: string) => {
  const value = text.trim().toLowerCase();

  if (value.includes("time off")) return false;

  return /day\s*off|week\s*off|weekly\s*off|holiday|off\s*day/i.test(value);
};

const pickAttendanceSvg = (root: Element): SVGSVGElement | undefined => {
  const svgs = [...root.querySelectorAll("svg")];

  return svgs
    .map((svg) => {
      const workedTextCount = [...svg.querySelectorAll("text")].filter(
        (text) => parseWorkedMinutes((text.textContent || "").trim()) !== null,
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
        score: workedTextCount * 100 + barCount * 10 + verticalLineCount,
      };
    })
    .sort((a, b) => b.score - a.score)[0]?.svg;
};

const getVerticalGridXs = (svg: SVGSVGElement) => {
  const xs: number[] = [];

  [...svg.querySelectorAll("path")].forEach((path) => {
    const box = getBBoxSafe(path);
    if (!box) return;

    const isVerticalGridLine = box.x > 100 && box.width <= 2 && box.height > 20;

    if (isVerticalGridLine) {
      xs.push(round(box.x));
    }
  });

  const sortedXs = xs.sort((a, b) => a - b);
  const uniqueXs: number[] = [];

  sortedXs.forEach((x) => {
    const lastX = uniqueXs[uniqueXs.length - 1];

    if (lastX === undefined || Math.abs(x - lastX) > 1) {
      uniqueXs.push(x);
    }
  });

  return uniqueXs;
};

const getDominantGridGap = (xs: number[]): number | null => {
  const diffs = xs
    .slice(1)
    .map((x, index) => x - xs[index])
    .filter((diff) => diff > 20 && diff < 220);

  if (!diffs.length) return null;

  const buckets = new Map<number, { count: number; total: number }>();

  diffs.forEach((diff) => {
    const key = Math.round(diff);
    const bucket = buckets.get(key) || {
      count: 0,
      total: 0,
    };

    bucket.count += 1;
    bucket.total += diff;
    buckets.set(key, bucket);
  });

  const dominantBucket = [...buckets.values()].sort((a, b) => b.count - a.count)[0];

  return dominantBucket.total / dominantBucket.count;
};

const inferPxPerMinuteFromTimeLabels = (root: Element): number | null => {
  const points: Point[] = [...root.querySelectorAll("svg text")]
    .map((text) => {
      const minutes = parseTimeLabelMinutes(text.textContent || "");
      if (minutes === null) return null;

      return {
        x: toNumber(text.getAttribute("x")),
        minutes,
      };
    })
    .filter((p): p is Point => p !== null)
    .sort((a, b) => a.x - b.x);

  const candidates: number[] = [];

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

const inferPxPerMinute = ({ root, gridXs }: { root: Element; gridXs: number[] }): number | null => {
  const fromTimeLabels = inferPxPerMinuteFromTimeLabels(root);
  if (fromTimeLabels) return fromTimeLabels;

  const gridGapPx = getDominantGridGap(gridXs);
  if (!gridGapPx) return null;

  return gridGapPx / 60;
};

const getAxisTicks = (root: Element): Point[] => {
  const ticks: Point[] = [...root.querySelectorAll("svg text")]
    .map((text) => {
      const minutes = parseTimeLabelMinutes(text.textContent || "");

      if (minutes === null) return null;

      return {
        x: toNumber(text.getAttribute("x")),
        minutes,
      };
    })
    .filter((p): p is Point => p !== null)
    .sort((a, b) => a.x - b.x);

  const uniqueTicks: Point[] = [];

  ticks.forEach((tick) => {
    const lastTick = uniqueTicks[uniqueTicks.length - 1];

    if (!lastTick || Math.abs(lastTick.x - tick.x) > 1) {
      uniqueTicks.push(tick);
    }
  });

  return uniqueTicks;
};

const getNearestAxisTick = ({
  x,
  axisTicks,
  pxPerMinute,
}: {
  x: number;
  axisTicks: Point[];
  pxPerMinute: number;
}): Point | null => {
  const tolerancePx = Math.max(4, pxPerMinute * 4);

  let nearestTick: Point | null = null;
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

const getMinutesFromX = ({
  x,
  axisTicks,
  pxPerMinute,
}: {
  x: number;
  axisTicks: Point[];
  pxPerMinute: number;
}): number | null => {
  const nearestTick = getNearestAxisTick({
    x,
    axisTicks,
    pxPerMinute,
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

const getRectDurationMinutes = ({
  rect,
  axisTicks,
  pxPerMinute,
}: {
  rect: RectInfo;
  axisTicks: Point[];
  pxPerMinute: number;
}) => {
  const startMinutes = getMinutesFromX({
    x: rect.x,
    axisTicks,
    pxPerMinute,
  });

  const endMinutes = getMinutesFromX({
    x: rect.x + rect.width,
    axisTicks,
    pxPerMinute,
  });

  if (
    Number.isFinite(startMinutes) &&
    Number.isFinite(endMinutes) &&
    (endMinutes as number) >= (startMinutes as number)
  ) {
    return (endMinutes as number) - (startMinutes as number);
  }

  return rect.width / pxPerMinute;
};

const getTotalRectDurationMinutes = ({
  rowRects,
  predicate,
  axisTicks,
  pxPerMinute,
}: {
  rowRects: RectInfo[];
  predicate: (fill: string) => boolean;
  axisTicks: Point[];
  pxPerMinute: number;
}) => {
  return rowRects
    .filter((rect) => predicate(rect.fill))
    .reduce(
      (total, rect) =>
        total +
        getRectDurationMinutes({
          rect,
          axisTicks,
          pxPerMinute,
        }),
      0,
    );
};

const getRowTexts = ({ allTexts, row }: { allTexts: SVGTextElement[]; row: RowInfo }) => {
  return allTexts.filter((text) => {
    if (text === row.text) return false;

    const y = toNumber(text.getAttribute("y"));
    return Math.abs(y - row.y) <= 30;
  });
};

// The "all check-in" page only ever shows today's rows for everyone, so this
// only needs the always-live-today branch (unlike `my` mode's per-day history,
// which lives in ./my-mode-chart.tsx and needs completed/short-by-X too).
const buildRowTooltipData = ({
  row,
  rowRects,
  rowTexts,
  pxPerMinute,
  axisTicks,
}: {
  row: RowInfo;
  rowRects: RectInfo[];
  rowTexts: SVGTextElement[];
  pxPerMinute: number;
  axisTicks: Point[];
}): RowTooltipData => {
  const timeOffMinutes = getTotalRectDurationMinutes({
    rowRects,
    predicate: isTimeOffColor,
    axisTicks,
    pxPerMinute,
  });

  const officeMinutes = getTotalRectDurationMinutes({
    rowRects,
    predicate: isWfoColor,
    axisTicks,
    pxPerMinute,
  });

  const homeMinutes = getTotalRectDurationMinutes({
    rowRects,
    predicate: isWfhColor,
    axisTicks,
    pxPerMinute,
  });

  const workMode = getWorkModeInfo({ officeMinutes, homeMinutes });
  const requiredMinutes = Math.max(0, Math.round(REQUIRED_WORK_MINUTES - timeOffMinutes));
  const remainingMinutes = Math.max(0, requiredMinutes - (row.workedMinutes || 0));

  const isDayOffRow =
    rowTexts.some((text) => isDayOffText(text.textContent || "")) ||
    rowRects.some((rect) => isDayOffColor(rect.fill));

  const base = {
    title: row.label,
    worked: formatDuration(row.workedMinutes || 0),
    timeOff: formatDuration(timeOffMinutes),
    required: formatDuration(requiredMinutes),
    remaining: formatDuration(remainingMinutes),
    workMode,
    isDayOffRow,
  };

  if (isDayOffRow) {
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

export const applyCheckoutHover = (helperState: HelperState) => {
  helperState.isApplying = true;

  try {
    const root = getRoot();
    const tooltip = ensureTooltip();

    const svg = pickAttendanceSvg(root);

    if (!svg) return;

    const gridXs = getVerticalGridXs(svg);
    const leftBoundary = gridXs.length ? Math.min(...gridXs) : 250;

    const pxPerMinute = inferPxPerMinute({ root, gridXs });
    const axisTicks = getAxisTicks(root);

    if (!pxPerMinute || !axisTicks.length) {
      console.error("Unable to calculate chart time scale.");
      console.log("Detected grid X values:", gridXs);
      console.log("Detected axis ticks:", axisTicks);
      return;
    }

    const allTexts = [...svg.querySelectorAll("text")];

    const rowTexts = allTexts.filter((text) => {
      const content = (text.textContent || "").trim();
      const x = toNumber(text.getAttribute("x"));

      return parseWorkedMinutes(content) !== null && x < leftBoundary + 20;
    });

    const rows: RowInfo[] = rowTexts.map((text) => ({
      text,
      content: (text.textContent || "").trim(),
      label: getCleanLabel((text.textContent || "").trim()),
      x: toNumber(text.getAttribute("x")),
      y: toNumber(text.getAttribute("y")),
      workedMinutes: parseWorkedMinutes((text.textContent || "").trim()),
    }));

    const rects: RectInfo[] = [...svg.querySelectorAll("rect")]
      .map((rect) => ({
        el: rect,
        x: toNumber(rect.getAttribute("x")),
        y: toNumber(rect.getAttribute("y")),
        width: toNumber(rect.getAttribute("width")),
        height: toNumber(rect.getAttribute("height")),
        fill: getFill(rect),
      }))
      .filter((rect) => rect.x > leftBoundary - 5 && rect.width > 2 && rect.height > 5);

    const findNearestRow = (rect: RectInfo): RowInfo | null => {
      const rectCenterY = rect.y + rect.height / 2;

      let nearestRow: RowInfo | null = null;
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

    const rectsByRow = new Map<RowInfo, RectInfo[]>();

    rects.forEach((rect) => {
      const row = findNearestRow(rect);

      if (!row) return;

      if (!rectsByRow.has(row)) {
        rectsByRow.set(row, []);
      }

      rectsByRow.get(row)?.push(rect);
    });

    const results: Record<string, unknown>[] = [];

    rows.forEach((row) => {
      const rowRects = rectsByRow.get(row) || [];
      const relatedRowTexts = getRowTexts({
        allTexts,
        row,
      });

      row.text.style.cursor = "";
      row.text.style.textDecoration = "";
      row.text.style.textDecorationLine = "";
      row.text.style.textDecorationStyle = "";
      row.text.style.textDecorationColor = "";

      row.text.onmouseenter = null;
      row.text.onmousemove = null;
      row.text.onmouseleave = null;

      const data = buildRowTooltipData({
        row,
        rowRects,
        rowTexts: relatedRowTexts,
        pxPerMinute,
        axisTicks,
      });

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

      row.text.onmouseenter = (event) => {
        render(tooltipVNode, tooltip);
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
        label: row.label,
        workMode: data.workMode.label,
        workModeSplit: data.workMode.subtitle,
        worked: data.worked,
        timeOff: data.timeOff,
        required: data.required,
        remaining: data.remaining,
        status: data.isDayOffRow ? data.dayOffMessage : data.heroValue,
      });
    });

    console.table(results);
    console.log(`Checkout hover enabled for ${results.length} rows on all check-in page`);
  } finally {
    window.setTimeout(() => {
      helperState.isApplying = false;
    }, 100);
  }
};
