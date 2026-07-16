export type Mode = "my" | "all";

export type SegmentKind = "wfo" | "wfh" | "break" | "timeoff";

export type DaySegment = {
  kind: SegmentKind;
  startMinutes: number;
  endMinutes: number;
};

export type DayEntry = {
  dateLabel: string;
  dateObj: Date;
  workedMinutes: number;
  isDayOff: boolean;
  dayOffType?: string;
  segments: DaySegment[];
};

export type RawCheckInRow = {
  my_check_in_date?: string;
  type?: string;
  start_time?: string;
  end_time?: string;
  work_from_office?: boolean;
};

export type WindowRange = { startMinutes: number; endMinutes: number };

export type Point = { x: number; minutes: number };

export type RectInfo = {
  el: SVGRectElement;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
};

export type RowInfo = {
  text: SVGTextElement;
  content: string;
  label: string;
  x: number;
  y: number;
  workedMinutes: number | null;
};

export type WorkModeInfo = {
  type: "hybrid" | "wfo" | "wfh" | "none";
  label: string;
  subtitle: string;
  officeMinutes: number;
  homeMinutes: number;
};

export type RowTooltipData = {
  title: string;
  worked: string;
  timeOff: string;
  required: string;
  remaining: string;
  workMode: WorkModeInfo;
  isDayOffRow: boolean;
  dayOffSubtitle?: string;
  dayOffMessage?: string;
  subtitle?: string;
  heroTitle?: string;
  heroValue?: string;
  badgeText?: string;
  status?: string;
  primaryChipLabel?: string;
};

export type HelperState = {
  applyTimer: ReturnType<typeof setTimeout> | null;
  observer: MutationObserver | null;
  isApplying: boolean;
  applyTimestamps: number[];
  circuitOpenUntil: number;
  originalPushState: History["pushState"];
  originalReplaceState: History["replaceState"];
  destroy?: () => void;
};
