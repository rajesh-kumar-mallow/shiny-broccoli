import { CONFIG } from "./config";
import { flattenAttendanceData, getCsrfToken, getLoggedInUserId, getMonthRange } from "./utils";

export const fetchCheckInData = async (offset = 0) => {
  const { startDate, endDate } = getMonthRange(offset);
  const url = new URL(CONFIG.checkInApiUrl);
  url.searchParams.set("start_date", startDate);
  url.searchParams.set("end_date", endDate);
  const res = await fetch(url.toString(), {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Check-in API failed: ${res.status}`);
  const result = await res.json();
  return { startDate, endDate, rows: flattenAttendanceData(result.data || {}) };
};

const buildTimesheetBody = ({
  startDate,
  endDate,
  userId,
  userParamMode,
}: {
  startDate: string;
  endDate: string;
  userId: string;
  userParamMode: "array" | "scalar";
}) => {
  const body = new URLSearchParams();
  body.append("group_by", "date");
  body.append("start_date", startDate);
  body.append("end_date", endDate);
  body.append("un_approved_entries", "false");
  if (userId)
    body.append(userParamMode === "array" ? "filter_user_id[]" : "filter_user_id", userId);
  return body;
};

const requestTimesheetPage = async ({
  url,
  startDate,
  endDate,
  userId,
  userParamMode,
}: {
  url: string;
  startDate: string;
  endDate: string;
  userId: string;
  userParamMode: "array" | "scalar";
}) => {
  const csrf = getCsrfToken();
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-Requested-With": "XMLHttpRequest",
  };
  if (csrf) headers["X-CSRF-TOKEN"] = csrf;
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers,
    body: buildTimesheetBody({ startDate, endDate, userId, userParamMode }),
  });
  if (!res.ok) throw new Error(`Timesheet API failed: ${res.status}`);
  return res.json();
};

const fetchTimesheetAllPagesWithMode = async ({
  startDate,
  endDate,
  userId,
  userParamMode,
}: {
  startDate: string;
  endDate: string;
  userId: string;
  userParamMode: "array" | "scalar";
}) => {
  let nextUrl: string | "" = CONFIG.timesheetApiUrl;
  let page = 0;
  const allRows: unknown[] = [];
  while (nextUrl && page < CONFIG.maxTimesheetPages) {
    page++;
    const res = await requestTimesheetPage({
      url: nextUrl,
      startDate,
      endDate,
      userId,
      userParamMode,
    });
    const p = res.pages || {};
    allRows.push(...(Array.isArray(p.data) ? p.data : []));
    nextUrl = p.next_page_url ? new URL(p.next_page_url, window.location.origin).toString() : "";
  }
  return { rows: allRows, pagesFetched: page };
};

export const fetchTimesheetAllPages = async ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  const userId = getLoggedInUserId();
  try {
    return await fetchTimesheetAllPagesWithMode({
      startDate,
      endDate,
      userId,
      userParamMode: "array",
    });
  } catch {
    return fetchTimesheetAllPagesWithMode({ startDate, endDate, userId, userParamMode: "scalar" });
  }
};
