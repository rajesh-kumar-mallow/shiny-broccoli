import { fetchCheckInData, fetchTimesheetAllPages } from "./api";
import { buildComparison, groupCheckIn, groupTimesheet } from "./grouping";
import type { ViewState } from "./types";

export const loadViewState = async (monthOffset: number): Promise<ViewState> => {
  try {
    const checkInResult = await fetchCheckInData(monthOffset);
    const checkInSummary = groupCheckIn(checkInResult.rows);
    let timesheetSummary = {
      dayMap: new Map(),
      dayRows: [],
      records: [],
      totalMinutes: 0,
    } as ReturnType<typeof groupTimesheet>;
    let comparison = { rows: [], mismatchRows: [], mismatchCount: 0 } as ReturnType<
      typeof buildComparison
    >;
    let timesheetError = "";
    try {
      const tsResult = await fetchTimesheetAllPages({
        startDate: checkInResult.startDate,
        endDate: checkInResult.endDate,
      });
      timesheetSummary = groupTimesheet({
        rows: tsResult.rows,
        startDate: checkInResult.startDate,
        endDate: checkInResult.endDate,
      });
      comparison = buildComparison({ checkInSummary, timesheetSummary });
    } catch (err) {
      timesheetError = err instanceof Error ? err.message : "Unable to fetch timesheet data.";
    }
    return {
      kind: "success",
      monthOffset,
      startDate: checkInResult.startDate,
      endDate: checkInResult.endDate,
      checkInSummary,
      timesheetSummary,
      comparison,
      timesheetError,
    };
  } catch (err) {
    return {
      kind: "error",
      monthOffset,
      message: err instanceof Error ? err.message : "Unable to calculate work log summary.",
    };
  }
};
