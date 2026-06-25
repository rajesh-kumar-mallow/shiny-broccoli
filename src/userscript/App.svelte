<script lang="ts">
  import { onMount, tick } from "svelte";
  import Icon from "./components/Icon.svelte";
  import MonthPicker from "./components/MonthPicker.svelte";
  import { CONFIG } from "./lib/config";
  import { loadViewState } from "./lib/data-loader";
  import { buildDetailsHtml } from "./lib/details";
  import { hideMiniModal, setMiniModalState, attachModalClicks } from "./lib/mini-modal";
  import { attachPopovers, hidePopover, serializePop } from "./lib/popover";
  import { getOverallStatus } from "./lib/status";
  import type { ViewState } from "./lib/types";
  import { formatDisplayDate, formatMinutes, getMonthRange } from "./lib/utils";

  let monthOffset = $state(0);
  let isExpanded = $state(false);
  let view = $state<ViewState>({ kind: "loading", monthOffset: 0 });
  let detailsOpen = $state(false);
  let cardEl: HTMLDivElement | undefined = $state();

  const refresh = async () => {
    view = { kind: "loading", monthOffset };
    const result = await loadViewState(monthOffset);
    view = result;
    if (result.kind === "success") {
      setMiniModalState({
        checkInSummary: result.checkInSummary,
        timesheetSummary: result.timesheetSummary,
        comparison: result.comparison,
        timesheetError: result.timesheetError,
      });
      await tick();
      if (cardEl) {
        attachPopovers(cardEl);
        attachModalClicks(cardEl);
        const fill = cardEl.querySelector(".wls-prog-fill") as HTMLElement | null;
        if (fill) fill.style.width = `${Math.min(100, Number(fill.dataset.pct))}%`;
      }
    }
  };

  const selectMonth = (offset: number) => {
    if (offset !== monthOffset) {
      monthOffset = offset;
      refresh();
    }
  };

  onMount(() => {
    refresh();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      detailsOpen = false;
      hideMiniModal();
      hidePopover();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  $effect(() => {
    document.getElementById(CONFIG.cardId)?.classList.toggle("wls-expanded", isExpanded);
  });

  const pop = serializePop;
</script>

<div bind:this={cardEl}>
  {#if view.kind === "loading"}
    {@const range = getMonthRange(view.monthOffset)}
    <div class="wls-card">
      <div class="wls-accent accent-muted"></div>
      <div class="wls-top-row" style="cursor:default">
        <div class="wls-title">Work log summary</div>
        <MonthPicker currentOffset={monthOffset} onSelect={selectMonth} />
        <div class="wls-top-right">
          <span class="wls-range"
            >{formatDisplayDate(range.startDate)} – {formatDisplayDate(range.endDate)}</span
          >
        </div>
      </div>
      <div class="wls-loading">
        <div class="wls-spinner"></div>
        Crunching data for {getMonthRange(view.monthOffset).startDate.slice(0, 7)}…
      </div>
    </div>
  {:else if view.kind === "error"}
    {@const range = getMonthRange(view.monthOffset)}
    <div class="wls-card">
      <div class="wls-accent accent-bad"></div>
      <div class="wls-top-row" style="cursor:default">
        <div class="wls-title">Work log summary</div>
        <MonthPicker currentOffset={monthOffset} onSelect={selectMonth} />
        <div class="wls-top-right">
          <span class="wls-range"
            >{formatDisplayDate(range.startDate)} – {formatDisplayDate(range.endDate)}</span
          >
          <button class="wls-btn wls-btn-primary" type="button" onclick={refresh}>
            <Icon name="refresh" /> Refresh
          </button>
        </div>
      </div>
      <div class="wls-error-box">{view.message}</div>
    </div>
  {:else}
    {@const { checkInSummary, timesheetSummary, comparison, timesheetError, startDate, endDate } =
      view}
    {@const status = getOverallStatus({
      checkInSummary,
      timesheetSummary,
      comparison,
      timesheetError,
    })}
    {@const worked = checkInSummary.totalCheckInWorkMinutes}
    {@const logged = timesheetSummary.totalMinutes}
    {@const yetToLog = timesheetError ? 0 : Math.max(0, worked - logged)}
    {@const overLogged = timesheetError ? 0 : Math.max(0, logged - worked)}
    {@const progPct = worked > 0 ? Math.min(100, Math.round((logged / worked) * 100)) : 0}
    {@const progClass = logged > worked ? "prog-over" : progPct >= 95 ? "prog-ok" : "prog-low"}
    {@const popPending = pop({
      title: "Compensation balance",
      rows: [
        { label: "Time-off taken", value: formatMinutes(checkInSummary.totalTimeOffMinutes) },
        { label: "Compensated", value: formatMinutes(checkInSummary.totalExtraWorkedMinutes) },
        { label: "Still pending", value: formatMinutes(checkInSummary.pendingMinutes) },
      ],
      note:
        checkInSummary.pendingMinutes === 0
          ? "All balanced! 🎉"
          : "Work extra hours to clear this.",
    })}
    {@const popTimeoff = pop({
      title: "Time-off taken",
      rows: [
        { label: "Total", value: formatMinutes(checkInSummary.totalTimeOffMinutes) },
        { label: "Records", value: String(checkInSummary.timeOffRows.length) },
      ],
      note: "Individual slots listed inside.",
    })}
    {@const popComp = pop({
      title: "Compensated hours",
      rows: [
        { label: "Extra worked", value: formatMinutes(checkInSummary.totalExtraWorkedMinutes) },
        { label: "Sessions", value: String(checkInSummary.extraRows.length) },
      ],
      note: "Includes weekend work and above-target days.",
    })}
    {@const popLogged = pop({
      title: "Timesheet vs check-in",
      rows: [
        { label: "Worked", value: formatMinutes(worked) },
        { label: "Logged", value: timesheetError ? "API error" : formatMinutes(logged) },
        {
          label: "Gap",
          value: timesheetError
            ? "–"
            : `${logged - worked >= 0 ? "+" : "−"}${formatMinutes(Math.abs(logged - worked))}`,
        },
        { label: "Match rate", value: timesheetError ? "–" : `${progPct}%` },
      ],
      note: timesheetError
        ? "Timesheet unavailable."
        : overLogged > 0
          ? "Over-logged — double-check entries."
          : yetToLog > 0
            ? `${formatMinutes(yetToLog)} still unlogged.`
            : "Fully matched! ✓",
    })}
    {@const popWorked = pop({
      title: "Hours worked (check-in)",
      rows: [
        { label: "Total worked", value: formatMinutes(worked) },
        {
          label: "Days with check-in",
          value: String(checkInSummary.dayRows.filter((d) => d.workMinutes > 0).length),
        },
        { label: "Day-offs", value: String(checkInSummary.dayOffCount) },
      ],
      note: "Derived from check-in & check-out times.",
    })}
    {@const popMismatch = pop({
      title: "Day mismatches",
      rows: [
        { label: "Days compared", value: String(comparison.rows.length) },
        { label: "Mismatches", value: String(comparison.mismatchCount) },
        { label: "Method", value: "Rounded hour" },
      ],
      note:
        comparison.mismatchCount === 0
          ? "All days match! 🎉"
          : `Fix these ${comparison.mismatchCount} days in the timesheet.`,
    })}
    {@const popDayoff = pop({
      title: "Day-offs this month",
      rows: [
        { label: "Total day-offs", value: String(checkInSummary.dayOffCount) },
        {
          label: "Types",
          value: [...new Set(checkInSummary.dayOffRows.map((r) => r.type))].join(", ") || "–",
        },
      ],
      note: "Includes Day Off, Comp Off, and On Duty.",
    })}
    {@const mismatchColor = comparison.mismatchCount === 0 ? "wls-stat-good" : "wls-stat-bad"}
    {@const pendingColor = checkInSummary.pendingMinutes === 0 ? "wls-stat-good" : "wls-stat-warn"}
    <div class="wls-card">
      <div class="wls-accent {status.accentClass}"></div>
      <div
        class="wls-top-row"
        role="button"
        tabindex="0"
        onclick={(e) => {
          if ((e.target as HTMLElement).closest("button,[data-modal-key],.wls-month-picker"))
            return;
          isExpanded = !isExpanded;
        }}
        onkeydown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            isExpanded = !isExpanded;
          }
        }}
      >
        <span class="wls-chevron"><Icon name="chevron" size={16} /></span>
        <span class="wls-title">Work log summary</span>
        <span class="wls-badge {status.badgeClass}">
          <Icon name={status.icon} size={11} />
          {status.label}
        </span>
        <div class="wls-inline-stats">
          <span class="wls-stat-sep">·</span>
          <span
            class="wls-stat wls-stat-purple wls-dur"
            data-pop={popTimeoff}
            data-modal-key="timeoff"
          >
            Time-off <strong>{formatMinutes(checkInSummary.totalTimeOffMinutes)}</strong>
          </span>
          <span class="wls-stat-sep">·</span>
          <span
            class="wls-stat wls-stat-purple wls-dur"
            data-pop={popComp}
            data-modal-key="compensated"
          >
            Comp'd <strong>{formatMinutes(checkInSummary.totalExtraWorkedMinutes)}</strong>
          </span>
          <span class="wls-stat-sep">·</span>
          <span
            class="wls-stat {pendingColor} wls-dur"
            data-pop={popPending}
            data-modal-key="pending"
          >
            Pending <strong>{formatMinutes(checkInSummary.pendingMinutes)}</strong>
          </span>
          <span class="wls-stat-sep">·</span>
          <span class="wls-stat wls-dur" data-pop={popLogged} data-modal-key="logged">
            Logged <strong>{timesheetError ? "?" : `${progPct}%`}</strong>
          </span>
          <span class="wls-stat-sep">·</span>
          <span
            class="wls-stat {mismatchColor} wls-dur"
            data-pop={popMismatch}
            data-modal-key="mismatches"
          >
            <strong>{timesheetError ? "–" : comparison.mismatchCount}</strong>
            mismatch{comparison.mismatchCount !== 1 ? "es" : ""}
          </span>
          <span class="wls-stat-sep">·</span>
          <span class="wls-stat wls-dur" data-pop={popDayoff} data-modal-key="dayoffs">
            Day-offs <strong>{checkInSummary.dayOffCount}</strong>
          </span>
        </div>
        <div class="wls-top-right">
          <MonthPicker currentOffset={monthOffset} onSelect={selectMonth} />
          <span class="wls-range"
            >{formatDisplayDate(startDate)} – {formatDisplayDate(endDate)}</span
          >
          <button
            class="wls-btn wls-btn-primary"
            type="button"
            onclick={(e) => {
              e.stopPropagation();
              refresh();
            }}
          >
            <Icon name="refresh" /> Refresh
          </button>
        </div>
      </div>

      <div class="wls-expandable">
        <div class="wls-body-divider"></div>
        <div class="wls-expandable-inner">
          <div class="wls-main">
            <div class="wls-block wls-block-comp">
              <div class="wls-block-hd">
                <div class="wls-block-icon icon-comp"><Icon name="clock" size={14} /></div>
                <span class="wls-block-label">Compensation balance</span>
              </div>
              <div class="wls-big wls-big-c">
                <span class="wls-dur" data-pop={popPending} data-modal-key="pending">
                  {formatMinutes(checkInSummary.pendingMinutes)}
                </span>
                <span class="wls-big-sub"> pending</span>
              </div>
              <div class="wls-chips">
                <span
                  class="wls-chip chip-purple wls-dur"
                  data-pop={popTimeoff}
                  data-modal-key="timeoff"
                >
                  <Icon name="clock" size={11} /> Time-off &nbsp;<strong
                    >{formatMinutes(checkInSummary.totalTimeOffMinutes)}</strong
                  >
                </span>
                <span
                  class="wls-chip chip-pink wls-dur"
                  data-pop={popComp}
                  data-modal-key="compensated"
                >
                  <Icon name="check" size={11} /> Compensated &nbsp;<strong
                    >{formatMinutes(checkInSummary.totalExtraWorkedMinutes)}</strong
                  >
                </span>
                <span
                  class="wls-chip chip-amber wls-dur"
                  data-pop={popDayoff}
                  data-modal-key="dayoffs"
                >
                  <Icon name="cal" size={11} /> Day-offs &nbsp;<strong
                    >{checkInSummary.dayOffCount}</strong
                  >
                </span>
              </div>
            </div>
            <div class="wls-block wls-block-ts">
              <div class="wls-block-hd">
                <div class="wls-block-icon icon-ts"><Icon name="report" size={14} /></div>
                <span class="wls-block-label">Worked vs logged</span>
              </div>
              <div class="wls-big wls-big-t">
                {#if timesheetError}
                  <span style="font-size:14px;color:#94a3b8">Unavailable</span>
                {:else}
                  <span class="wls-dur" data-pop={popLogged} data-modal-key="logged"
                    >{formatMinutes(logged)}</span
                  >
                {/if}
                <span class="wls-big-sub"> logged</span>
              </div>
              <div class="wls-block-sub">
                of <span class="wls-dur" data-pop={popWorked} data-modal-key="worked"
                  >{formatMinutes(worked)}</span
                > worked
              </div>
              {#if !timesheetError}
                <div class="wls-prog-wrap">
                  <div class="wls-prog-track">
                    <div
                      class="wls-prog-fill {progClass}"
                      style="width:0%"
                      data-pct={progPct}
                    ></div>
                  </div>
                  <div class="wls-prog-labels">
                    <span>{progPct}% logged</span>
                    <span>
                      {logged > worked
                        ? "over-logged ⚠"
                        : yetToLog > 0
                          ? `${formatMinutes(yetToLog)} to go`
                          : "complete ✓"}
                    </span>
                  </div>
                </div>
              {/if}
              <div class="wls-chips">
                {#if timesheetError}
                  <span class="wls-chip chip-slate">Timesheet unavailable</span>
                {:else if overLogged > 0}
                  <span
                    class="wls-chip chip-amber wls-dur"
                    data-pop={popLogged}
                    data-modal-key="logged"
                  >
                    <Icon name="warn" size={11} />
                    {formatMinutes(overLogged)} over-logged
                  </span>
                {:else}
                  <span
                    class="wls-chip {yetToLog === 0 ? 'chip-green' : 'chip-blue'} wls-dur"
                    data-pop={popLogged}
                    data-modal-key="logged"
                  >
                    <Icon name={yetToLog === 0 ? "check" : "clock"} size={11} />
                    {yetToLog === 0 ? "All logged" : `${formatMinutes(yetToLog)} left`}
                  </span>
                {/if}
                <span
                  class="wls-chip {comparison.mismatchCount === 0
                    ? 'chip-green'
                    : 'chip-red'} wls-dur"
                  data-pop={popMismatch}
                  data-modal-key="mismatches"
                >
                  <Icon name={comparison.mismatchCount === 0 ? "check" : "warn"} size={11} />
                  {timesheetError ? "–" : comparison.mismatchCount} mismatch{comparison.mismatchCount !==
                  1
                    ? "es"
                    : ""}
                </span>
              </div>
            </div>
          </div>
          <div class="wls-summary {status.summaryClass}">
            <div class="wls-summary-label {status.slabelClass}">
              <Icon name={status.icon} size={11} />
              {status.label}
            </div>
            {@html status.message}
          </div>
          <div class="wls-exp-actions">
            <button
              class="wls-btn"
              type="button"
              onclick={(e) => {
                e.stopPropagation();
                detailsOpen = true;
              }}
            >
              <Icon name="list" /> View full details
            </button>
          </div>
        </div>
      </div>

      {#if detailsOpen}
        <div
          class="wls-modal-backdrop"
          role="presentation"
          onclick={(e) => {
            if (e.target === e.currentTarget) detailsOpen = false;
          }}
        >
          <div class="wls-modal" role="dialog" aria-modal="true">
            <div class="wls-modal-head">
              <div>
                <div class="wls-modal-title">Full work log breakdown</div>
                <div class="wls-modal-subtitle">
                  {formatDisplayDate(startDate)} – {formatDisplayDate(endDate)}
                </div>
              </div>
              <button class="wls-close-btn" type="button" onclick={() => (detailsOpen = false)}>
                <Icon name="close" /> Close
              </button>
            </div>
            <div class="wls-modal-body">
              {@html buildDetailsHtml({
                checkInSummary,
                timesheetSummary,
                comparison,
                timesheetError,
                status,
              })}
            </div>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>
