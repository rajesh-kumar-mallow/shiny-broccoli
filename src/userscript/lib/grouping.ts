import { CONFIG } from "./config";
import type { CheckInSummary, Comparison, TimesheetSummary } from "./types";
import {
  getDurationMinutes,
  getLoggedInUserId,
  getTimesheetRecordTitle,
  getTypeLabel,
  isToday,
  parseDate,
  parseTimesheetDurationToMinutes,
  roundedHour,
  toYMD,
} from "./utils";

export const groupCheckIn = (rows: Record<string, unknown>[]): CheckInSummary => {
  const dayMap = new Map<string, CheckInSummary["dayRows"][0]>();
  const timeOffRows: CheckInSummary["timeOffRows"] = [];
  const dayOffRows: CheckInSummary["dayOffRows"] = [];

  const ensureDay = (dateKey: string, dateObj: Date) => {
    if (!dayMap.has(dateKey)) {
      dayMap.set(dateKey, {
        dateKey,
        dateObj,
        workMinutes: 0,
        timeOffMinutes: 0,
        workRecords: [],
        timeOffRecords: [],
      });
    }
    return dayMap.get(dateKey)!;
  };

  rows.forEach((row) => {
    const dateObj = parseDate(row.date);
    if (!dateObj) return;
    const dateKey = toYMD(dateObj);
    const typeLabel = getTypeLabel(row);
    const rawType = String(row.type || "");
    const day = ensureDay(dateKey, dateObj);
    const isTimeOff = CONFIG.timeOffTypes.has(rawType) || CONFIG.timeOffTypes.has(typeLabel);
    const isWork = CONFIG.workTypes.has(rawType) || CONFIG.workTypes.has(typeLabel);
    const isDayOff = rawType === "Day Off" || CONFIG.dayOffLabels.has(typeLabel);

    if (isWork) {
      const minutes = getDurationMinutes(row.start_time, row.end_time, dateObj, true);
      if (minutes > 0) {
        const rec = {
          date: dateKey,
          type: typeLabel,
          start: String(row.start_time || ""),
          end: String(row.end_time || (isToday(dateObj) ? "Now" : "-")),
          minutes,
        };
        day.workMinutes += minutes;
        day.workRecords.push(rec);
      }
    }
    if (isTimeOff) {
      const minutes = getDurationMinutes(row.start_time, row.end_time, dateObj, false);
      if (minutes > 0) {
        const rec = {
          date: dateKey,
          type: typeLabel,
          start: String(row.start_time || ""),
          end: String(row.end_time || ""),
          minutes,
        };
        day.timeOffMinutes += minutes;
        day.timeOffRecords.push(rec);
        timeOffRows.push(rec);
      }
    }
    if (isDayOff && !dayOffRows.some((x) => x.date === dateKey && x.type === typeLabel)) {
      dayOffRows.push({ date: dateKey, type: typeLabel });
    }
  });

  const dayRows = Array.from(dayMap.values()).sort((a, b) => a.dateKey.localeCompare(b.dateKey));
  const extraRows = dayRows
    .map((day) => {
      const isWeekend = CONFIG.weekendDays.includes(day.dateObj.getDay());
      const expectedMinutes = isWeekend
        ? 0
        : Math.max(0, CONFIG.workDayMinutes - day.timeOffMinutes);
      let extraMinutes = 0;
      let reason = "";
      if (isWeekend && day.workMinutes > 0) {
        extraMinutes = day.workMinutes;
        reason = "Weekend work";
      } else if (!isWeekend && day.workMinutes > expectedMinutes) {
        extraMinutes = day.workMinutes - expectedMinutes;
        reason = day.timeOffMinutes > 0 ? "Worked above adjusted target" : "Worked more than 8h";
      }
      return {
        date: day.dateKey,
        workedMinutes: day.workMinutes,
        timeOffMinutes: day.timeOffMinutes,
        expectedMinutes,
        extraMinutes,
        reason,
        workRecords: day.workRecords,
      };
    })
    .filter((r) => r.extraMinutes > 0);

  const totalTimeOffMinutes = timeOffRows.reduce((s, r) => s + r.minutes, 0);
  const totalExtraWorkedMinutes = extraRows.reduce((s, r) => s + r.extraMinutes, 0);
  const totalCheckInWorkMinutes = dayRows.reduce((s, r) => s + r.workMinutes, 0);

  return {
    dayMap,
    dayRows,
    timeOffRows: timeOffRows.sort(
      (a, b) => a.date.localeCompare(b.date) || String(a.start).localeCompare(String(b.start)),
    ),
    extraRows,
    dayOffRows: dayOffRows.sort((a, b) => a.date.localeCompare(b.date)),
    totalTimeOffMinutes,
    totalExtraWorkedMinutes,
    totalCheckInWorkMinutes,
    pendingMinutes: Math.max(0, totalTimeOffMinutes - totalExtraWorkedMinutes),
    surplusMinutes: Math.max(0, totalExtraWorkedMinutes - totalTimeOffMinutes),
    dayOffCount: new Set(dayOffRows.map((r) => r.date)).size,
  };
};

export const groupTimesheet = ({
  rows,
  startDate,
  endDate,
}: {
  rows: unknown[];
  startDate: string;
  endDate: string;
}): TimesheetSummary => {
  const userId = getLoggedInUserId();
  const dayMap = new Map<string, TimesheetSummary["dayRows"][0]>();
  const records: TimesheetSummary["records"] = [];

  rows.forEach((raw) => {
    const row = raw as Record<string, unknown>;
    if (userId && row.user_id && String(row.user_id) !== String(userId)) return;
    const dateObj = parseDate(row.entry_date || row.date);
    if (!dateObj) return;
    const dateKey = toYMD(dateObj);
    if (dateKey < startDate || dateKey > endDate) return;
    const minutes = parseTimesheetDurationToMinutes(row.working_hours);
    if (!dayMap.has(dateKey)) {
      dayMap.set(dateKey, { date: dateKey, minutes: 0, recordsCount: 0, records: [] });
    }
    const rec = {
      id: row.id as string | number | undefined,
      date: dateKey,
      title: getTimesheetRecordTitle(row),
      project: String(row.project_name || "-"),
      module: String(row.module_name || "-"),
      task: String(row.task_name || "-"),
      description: String(row.description || "-"),
      minutes,
      rawWorkingHours: row.working_hours,
    };
    const day = dayMap.get(dateKey)!;
    day.minutes += minutes;
    day.recordsCount += 1;
    day.records.push(rec);
    records.push(rec);
  });

  const dayRows = Array.from(dayMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  return {
    dayMap,
    dayRows,
    records: records.sort(
      (a, b) =>
        a.date.localeCompare(b.date) || String(a.id || "").localeCompare(String(b.id || "")),
    ),
    totalMinutes: dayRows.reduce((s, r) => s + r.minutes, 0),
  };
};

export const buildComparison = ({
  checkInSummary,
  timesheetSummary,
}: {
  checkInSummary: CheckInSummary;
  timesheetSummary: TimesheetSummary;
}): Comparison => {
  const dates = new Set<string>();
  checkInSummary.dayRows.forEach((r) => {
    if (r.workMinutes > 0 || r.timeOffMinutes > 0) dates.add(r.dateKey);
  });
  timesheetSummary.dayRows.forEach((r) => {
    if (r.minutes > 0) dates.add(r.date);
  });

  const rows = Array.from(dates)
    .sort()
    .map((date) => {
      const ci = checkInSummary.dayMap.get(date);
      const ts = timesheetSummary.dayMap.get(date);
      const isTodayRow = isToday(parseDate(date));
      const ciMin = ci?.workMinutes || 0;
      const toMin = ci?.timeOffMinutes || 0;
      const tsMin = ts?.minutes || 0;
      let status = "OK";
      let statusClass = "t-ok";
      if (CONFIG.ignoreTodayForTimesheetMismatch && isTodayRow) {
        status = "Skipped today";
        statusClass = "t-skip";
      } else {
        const match = CONFIG.compareByRoundedHours
          ? roundedHour(ciMin) === roundedHour(tsMin)
          : ciMin === tsMin;
        status = match ? "OK" : "Mismatch";
        statusClass = match ? "t-ok" : "t-bad";
      }
      return {
        date,
        checkInMinutes: ciMin,
        timeOffMinutes: toMin,
        timesheetMinutes: tsMin,
        diffMinutes: tsMin - ciMin,
        roundedCheckInHours: roundedHour(ciMin),
        roundedTimesheetHours: roundedHour(tsMin),
        isTodayRow: !!isTodayRow,
        isMatch: statusClass === "t-ok",
        status,
        statusClass,
        timesheetRecords: ts?.records || [],
      };
    });

  const mismatchRows = rows.filter(
    (r) => !(CONFIG.ignoreTodayForTimesheetMismatch && r.isTodayRow) && !r.isMatch,
  );
  return { rows, mismatchRows, mismatchCount: mismatchRows.length };
};
