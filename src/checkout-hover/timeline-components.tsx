import type { DaySegment, TimelineEntry, WindowRange } from "./types";
import { formatMinutesAsTime } from "./shared";

export const getSharedWindow = (entries: { segments: DaySegment[] }[]): WindowRange => {
  let min = Infinity;
  let max = -Infinity;

  entries.forEach((entry) => {
    entry.segments.forEach((seg) => {
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

  return Array.from({ length: count }, (_, index) =>
    formatMinutesAsTime(windowRange.startMinutes + (span * index) / (count - 1)),
  );
};

type HoverHandlers = {
  onHoverLabel: (event: MouseEvent, entry: TimelineEntry) => void;
  onHoverSegment: (event: MouseEvent, entry: TimelineEntry, segment: DaySegment) => void;
  onMove: (event: MouseEvent) => void;
  onLeave: () => void;
};

function TimelineRow({
  entry,
  windowRange,
  onHoverLabel,
  onHoverSegment,
  onMove,
  onLeave,
}: HoverHandlers & { entry: TimelineEntry; windowRange: WindowRange }) {
  const span = windowRange.endMinutes - windowRange.startMinutes;
  const toPct = (minutes: number) =>
    Math.min(100, Math.max(0, ((minutes - windowRange.startMinutes) / span) * 100));

  // Sorted so adjacency (touching segments) can be detected below — the
  // order segments arrived in isn't guaranteed to be chronological.
  const sortedSegments = [...entry.segments].sort((a, b) => a.startMinutes - b.startMinutes);

  return (
    <div class={`cht-chart-row${entry.isHighlighted ? " cht-chart-row--today" : ""}`}>
      <div
        class="cht-chart-row-label"
        onMouseEnter={(event) => onHoverLabel(event, entry)}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <span class="cht-chart-row-date" title={entry.label}>
          {entry.label}
        </span>
        <span class="cht-chart-row-worked">{entry.sublabel}</span>
      </div>
      <div class="cht-chart-row-track">
        {entry.isDayOff ? (
          <div
            class="cht-chart-seg cht-chart-seg--dayoff"
            style="left:0%;width:100%"
            onMouseEnter={(event) => onHoverLabel(event, entry)}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
          >
            {entry.dayOffType || "Day Off"}
          </div>
        ) : (
          sortedSegments.map((seg, index) => {
            const prev = sortedSegments[index - 1];
            const next = sortedSegments[index + 1];
            const touchesPrev = !!prev && prev.endMinutes === seg.startMinutes;
            const touchesNext = !!next && next.startMinutes === seg.endMinutes;

            const modifiers = [
              `cht-chart-seg--${seg.kind}`,
              touchesPrev && "cht-chart-seg--sq-l",
              touchesNext && "cht-chart-seg--sq-r",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <div
                key={index}
                class={`cht-chart-seg ${modifiers}`}
                style={`left:${toPct(seg.startMinutes)}%;width:${
                  toPct(seg.endMinutes) - toPct(seg.startMinutes)
                }%`}
                onMouseEnter={(event) => onHoverSegment(event, entry, seg)}
                onMouseMove={onMove}
                onMouseLeave={onLeave}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

export function CustomTimeline({
  entries,
  windowRange,
  onHoverLabel,
  onHoverSegment,
  onMove,
  onLeave,
}: HoverHandlers & { entries: TimelineEntry[]; windowRange: WindowRange }) {
  const axisLabels = getAxisLabels(windowRange);

  return (
    <div class="cht-chart">
      <div class="cht-chart-axis">
        {axisLabels.map((label, index) => (
          <span key={index}>{label}</span>
        ))}
      </div>
      <div class="cht-chart-rows">
        {entries.map((entry) => (
          <TimelineRow
            key={entry.key}
            entry={entry}
            windowRange={windowRange}
            onHoverLabel={onHoverLabel}
            onHoverSegment={onHoverSegment}
            onMove={onMove}
            onLeave={onLeave}
          />
        ))}
      </div>
    </div>
  );
}
