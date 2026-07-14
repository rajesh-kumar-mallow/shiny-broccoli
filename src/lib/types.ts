export type PopRow = { label: string; value: string };
export type PopData = { title?: string; rows?: PopRow[]; note?: string };

export type StatusInfo = {
  label: string;
  accentClass: string;
  badgeClass: string;
  summaryClass: string;
  slabelClass: string;
  icon: string;
  message: string;
};

export type TimeOffRow = {
  date: string;
  type: string;
  start: string;
  end: string;
  minutes: number;
};

export type ExtraRow = {
  date: string;
  workedMinutes: number;
  timeOffMinutes: number;
  expectedMinutes: number;
  extraMinutes: number;
  reason: string;
  workRecords: WorkRecord[];
};

export type WorkRecord = {
  date: string;
  type: string;
  start: string;
  end: string;
  minutes: number;
};

export type DayRow = {
  dateKey: string;
  dateObj: Date;
  workMinutes: number;
  timeOffMinutes: number;
  workRecords: WorkRecord[];
  timeOffRecords: TimeOffRow[];
};

export type DayOffRow = { date: string; type: string };

export type CheckInSummary = {
  dayMap: Map<string, DayRow>;
  dayRows: DayRow[];
  timeOffRows: TimeOffRow[];
  extraRows: ExtraRow[];
  dayOffRows: DayOffRow[];
  totalTimeOffMinutes: number;
  totalExtraWorkedMinutes: number;
  totalCheckInWorkMinutes: number;
  pendingMinutes: number;
  surplusMinutes: number;
  dayOffCount: number;
};

export type TimesheetRecord = {
  id?: string | number;
  date: string;
  title: string;
  project: string;
  module: string;
  task: string;
  description: string;
  minutes: number;
  rawWorkingHours: unknown;
};

export type TimesheetDayRow = {
  date: string;
  minutes: number;
  recordsCount: number;
  records: TimesheetRecord[];
};

export type TimesheetSummary = {
  dayMap: Map<string, TimesheetDayRow>;
  dayRows: TimesheetDayRow[];
  records: TimesheetRecord[];
  totalMinutes: number;
};

export type ComparisonRow = {
  date: string;
  checkInMinutes: number;
  timeOffMinutes: number;
  timesheetMinutes: number;
  diffMinutes: number;
  roundedCheckInHours: number;
  roundedTimesheetHours: number;
  isTodayRow: boolean;
  isMatch: boolean;
  status: string;
  statusClass: string;
  timesheetRecords: TimesheetRecord[];
};

export type Comparison = {
  rows: ComparisonRow[];
  mismatchRows: ComparisonRow[];
  mismatchCount: number;
};

export type MonthOption = {
  offset: number;
  label: string;
  shortLabel: string;
  year: number;
  month: number;
  fullLabel: string;
};

export type ViewState =
  | { kind: "loading"; monthOffset: number }
  | { kind: "error"; monthOffset: number; message: string }
  | {
      kind: "success";
      monthOffset: number;
      startDate: string;
      endDate: string;
      checkInSummary: CheckInSummary;
      timesheetSummary: TimesheetSummary;
      comparison: Comparison;
      timesheetError: string;
    };

export type TableColumn<T> = {
  label: string;
  html?: boolean;
  render: (row: T) => string;
};
