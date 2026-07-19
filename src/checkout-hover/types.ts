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

// Generic row shape the shared timeline components render — both "my mode"
// (one row per date) and "all mode" (one row per employee) map their
// domain-specific entry into this before handing off to <CustomTimeline>.
export type TimelineEntry = {
  key: string;
  label: string;
  sublabel: string;
  segments: DaySegment[];
  isDayOff?: boolean;
  dayOffType?: string;
  isHighlighted?: boolean;
};

// Shape of a single row from GET /attendance/get-all-check-in-data.
export type AllCheckInRow = {
  name?: string;
  team?: string;
  user_id: number;
  work_from_office?: boolean | null;
  date?: string;
  start_time?: string;
  end_time?: string;
  type?: string;
  colour?: string;
  leave_category?: string | null;
};

export type AllCheckInResponse = {
  holiday_type?: string;
  data: Record<string, AllCheckInRow[]>;
};

export type EmployeeEntry = {
  userId: number;
  name: string;
  team?: string;
  workedMinutes: number;
  isDayOff: boolean;
  dayOffType?: string;
  hasNoData: boolean;
  segments: DaySegment[];
};

export type WindowRange = { startMinutes: number; endMinutes: number };

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
  originalPushState: History["pushState"];
  originalReplaceState: History["replaceState"];
  destroy?: () => void;
};
