import type { CheckInSummary, Comparison, StatusInfo, TimesheetSummary } from "./types";
import { formatMinutes } from "./utils";

export const getOverallStatus = ({
  checkInSummary,
  timesheetSummary,
  comparison,
  timesheetError,
}: {
  checkInSummary: CheckInSummary;
  timesheetSummary: TimesheetSummary;
  comparison: Comparison;
  timesheetError: string;
}): StatusInfo => {
  if (timesheetError) {
    return {
      label: "Flying blind",
      accentClass: "accent-muted",
      badgeClass: "badge-muted",
      summaryClass: "summary-muted",
      slabelClass: "slabel-muted",
      icon: "muted",
      message: `Timesheet API went quiet, so the logged-vs-worked picture is fuzzy right now. Your <strong>compensation math still works</strong> — it's running entirely on check-in data. Grab a coffee and hit Refresh in a bit.`,
    };
  }
  const yetToLog = Math.max(
    0,
    checkInSummary.totalCheckInWorkMinutes - timesheetSummary.totalMinutes,
  );
  const overLogged = Math.max(
    0,
    timesheetSummary.totalMinutes - checkInSummary.totalCheckInWorkMinutes,
  );
  const gap = Math.max(yetToLog, overLogged);
  const pending = checkInSummary.pendingMinutes;
  const mismatches = comparison.mismatchCount;

  if (mismatches === 0 && pending === 0) {
    return {
      label: "Squeaky clean ✨",
      accentClass: "accent-good",
      badgeClass: "badge-good",
      summaryClass: "summary-good",
      slabelClass: "slabel-good",
      icon: "check",
      message: `Everything lines up — check-ins, timesheet, and compensation are all singing the same tune. <strong>Nothing left to fix.</strong> Go touch some grass.`,
    };
  }
  if (gap <= 60 && pending <= 60) {
    const bits: string[] = [];
    if (gap > 0) bits.push(`<em>${formatMinutes(gap)}</em> to sort in your timesheet`);
    if (pending > 0) bits.push(`<em>${formatMinutes(pending)}</em> of uncompensated time-off`);
    return {
      label: "So close 👀",
      accentClass: "accent-warn",
      badgeClass: "badge-warn",
      summaryClass: "summary-warn",
      slabelClass: "slabel-warn",
      icon: "warn",
      message: `You're <strong>embarrassingly close to perfect</strong> — just ${bits.join(" and ")} standing in the way of a clean slate. One quick pass and you're golden.`,
    };
  }
  if (gap <= 4 * 60 || mismatches <= 4) {
    const bits: string[] = [];
    if (mismatches > 0)
      bits.push(
        `<strong>${mismatches} day${mismatches > 1 ? "s" : ""}</strong> where logged hours don't match what you worked`,
      );
    if (pending > 0)
      bits.push(`<em>${formatMinutes(pending)}</em> of time-off still waiting to be compensated`);
    return {
      label: "Needs some love 🛠",
      accentClass: "accent-mismatch",
      badgeClass: "badge-mismatch",
      summaryClass: "summary-mismatch",
      slabelClass: "slabel-mismatch",
      icon: "warn",
      message: `Getting there, but not quite. You've got ${bits.join(", plus ")}. A focused <strong>10-minute cleanup</strong> in the timesheet should sort this right out.`,
    };
  }
  const logNote =
    yetToLog > overLogged
      ? `<em>${formatMinutes(yetToLog)}</em> of worked time hasn't made it into the timesheet yet`
      : `<em>${formatMinutes(overLogged)}</em> is logged in excess of what check-in recorded`;
  return {
    label: "Gone rogue 🚨",
    accentClass: "accent-bad",
    badgeClass: "badge-bad",
    summaryClass: "summary-bad",
    slabelClass: "slabel-bad",
    icon: "error",
    message: `Your timesheet and check-ins are living completely separate lives. ${logNote}, and there are <strong>${mismatches} mismatched day${mismatches !== 1 ? "s" : ""}</strong> on record. This one needs a proper sit-down to untangle.`,
  };
};
