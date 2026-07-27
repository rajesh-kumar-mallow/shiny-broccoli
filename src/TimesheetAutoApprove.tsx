import { render } from "preact";
import { initTheme } from "./shared/theme-switcher";
import {
  isAutoApproveEnabled,
  isOnlyApproveEnabled,
  isAutoAuthoriseEnabled,
} from "./lib/feature-flags";
import { waitForElement } from "./lib/utils";
import { runTimesheetAutoApprove, type AutoApproveProgress } from "./lib/timesheet-auto-approve";

initTheme();

const CONTAINER_ID = "hubble-auto-approve-widget";

type RunState = "idle" | "running" | "done";

type Action = {
  key: string;
  label: string;
  runAuthoriseSteps: boolean;
};

function ActionLabel({
  state,
  progress,
  idleLabel,
}: {
  state: RunState;
  progress: AutoApproveProgress | null;
  idleLabel: string;
}) {
  if (state === "running") {
    return <span>Approving {progress ? `${progress.processed}/${progress.total}` : "…"}</span>;
  }
  if (state === "done") {
    return <span>✓ Done{progress ? ` (${progress.total})` : ""}</span>;
  }
  return <span>{idleLabel}</span>;
}

function showBetaWarning() {
  if (typeof Swal === "undefined") return;
  Swal.fire({
    icon: "warning",
    title: "Beta feature",
    text: 'Both "Only Approve" and "Auto Authorise" are on, so you get separate Approve / Approve & Authorise buttons on this page. This combination is experimental — use at your own risk.',
    confirmButtonText: "Got it",
  });
}

function initWidget() {
  if (document.getElementById(CONTAINER_ID)) return;

  const dualMode = isOnlyApproveEnabled() && isAutoAuthoriseEnabled();
  const actions: Action[] = dualMode
    ? [
        { key: "approve", label: "⚡ Just Approve", runAuthoriseSteps: false },
        { key: "approve-authorise", label: "⚡ Approve & Authorise", runAuthoriseSteps: true },
      ]
    : [
        {
          key: "auto",
          label: "⚡ Auto Approve",
          runAuthoriseSteps: !isOnlyApproveEnabled() || isAutoAuthoriseEnabled(),
        },
      ];

  const container = document.createElement("div");
  container.id = CONTAINER_ID;
  document.body.appendChild(container);

  const buttons = new Map<string, HTMLButtonElement>();
  const runStates = new Map<string, { state: RunState; progress: AutoApproveProgress | null }>();
  let running = false;

  const renderAction = (action: Action) => {
    const btn = buttons.get(action.key);
    const runState = runStates.get(action.key);
    if (!btn || !runState) return;
    btn.disabled = running && runState.state !== "running";
    btn.classList.toggle("haa-running", runState.state === "running");
    btn.classList.toggle("haa-done", runState.state === "done");
    render(
      <ActionLabel state={runState.state} progress={runState.progress} idleLabel={action.label} />,
      btn,
    );
  };

  const renderAll = () => actions.forEach(renderAction);

  actions.forEach((action) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "haa-btn";
    container.appendChild(btn);
    buttons.set(action.key, btn);
    runStates.set(action.key, { state: "idle", progress: null });

    btn.addEventListener("click", async () => {
      if (running) return;
      running = true;
      runStates.set(action.key, { state: "running", progress: null });
      renderAll();

      try {
        const result = await runTimesheetAutoApprove((p) => {
          runStates.set(action.key, { state: "running", progress: p });
          renderAction(action);
        }, action.runAuthoriseSteps);
        runStates.set(action.key, {
          state: "done",
          progress: { processed: result.processed, total: result.total, id: "" },
        });
      } catch (error) {
        console.error("Timesheet auto-approve failed", error);
        runStates.set(action.key, { state: "idle", progress: null });
      }

      running = false;
      renderAll();

      if (runStates.get(action.key)?.state === "done") {
        setTimeout(() => {
          runStates.set(action.key, { state: "idle", progress: null });
          renderAction(action);
        }, 3000);
      }
    });
  });

  renderAll();

  if (dualMode) showBetaWarning();
}

function boot() {
  if (!isAutoApproveEnabled()) return;
  waitForElement("#timesheet-lists", initWidget);
}

function init() {
  if (window.__hubbleAutoApproveInit) return;
  window.__hubbleAutoApproveInit = true;

  if (document.body) boot();
  else document.addEventListener("DOMContentLoaded", boot);
}

init();
