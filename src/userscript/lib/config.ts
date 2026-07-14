import { WORK_DAY_MINUTES } from "../../userscripts/shared/constants.js";

export const CONFIG = {
  checkInApiUrl: "https://hubble.mallow-tech.com/attendance/get-my-check-in-data",
  timesheetApiUrl: "https://hubble.mallow-tech.com/v2/timesheet-entries",
  cardId: "custom-work-log-summary-card",
  oldIds: ["custom-timeoff-compensation-card", "custom-work-log-summary-card"],
  workDayMinutes: WORK_DAY_MINUTES,
  weekendDays: [0, 6] as number[],
  maxTimesheetPages: 50,
  compareByRoundedHours: true,
  ignoreTodayForTimesheetMismatch: true,
  timeOffTypes: new Set([
    "Time Off",
    "Day Start Time Off",
    "Attendance Time Off",
    "attendance-time-off",
    "day-start-time-off",
  ]),
  workTypes: new Set(["login", "Check In", "Check In Office", "Check In Home"]),
  dayOffLabels: new Set(["Day Off", "Comp Off", "On Duty"]),
} as const;
