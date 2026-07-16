import { initThemeSwitcher } from "./shared/theme-switcher";
import type { HelperState } from "./checkout-hover/types";
import { CHART_CONTAINER_ID, TOOLTIP_ID, getMode } from "./checkout-hover/shared";
import { applyCheckoutHover } from "./checkout-hover/all-mode-engine";
import { ensureMyModeActive, teardownMyMode } from "./checkout-hover/my-mode-chart";

initThemeSwitcher();

(() => {
  window.__checkoutHoverHelper?.destroy?.();

  const MAX_APPLIES_PER_WINDOW = 6;
  const RATE_WINDOW_MS = 4000;
  const COOLDOWN_MS = 8000;

  const helperState: HelperState = {
    applyTimer: null,
    observer: null,
    isApplying: false,
    applyTimestamps: [],
    circuitOpenUntil: 0,
    originalPushState: history.pushState,
    originalReplaceState: history.replaceState,
  };

  window.__checkoutHoverHelper = helperState;

  const scheduleApply = () => {
    window.clearTimeout(helperState.applyTimer ?? undefined);

    helperState.applyTimer = window.setTimeout(() => {
      if (getMode() === "my") {
        ensureMyModeActive();
        return;
      }

      teardownMyMode();

      const now = Date.now();

      if (now < helperState.circuitOpenUntil) return;

      helperState.applyTimestamps = helperState.applyTimestamps.filter(
        (timestamp) => now - timestamp < RATE_WINDOW_MS,
      );
      helperState.applyTimestamps.push(now);

      if (helperState.applyTimestamps.length > MAX_APPLIES_PER_WINDOW) {
        helperState.circuitOpenUntil = now + COOLDOWN_MS;
        helperState.applyTimestamps = [];
        console.warn(
          `[checkout-hover-helper] Re-apply loop detected. Pausing auto re-sync for ${COOLDOWN_MS}ms.`,
        );
        return;
      }

      applyCheckoutHover(helperState);
    }, 250);
  };

  history.pushState = function patchedPushState(
    this: History,
    ...args: Parameters<History["pushState"]>
  ) {
    const result = helperState.originalPushState.apply(this, args);
    scheduleApply();
    return result;
  };

  history.replaceState = function patchedReplaceState(
    this: History,
    ...args: Parameters<History["replaceState"]>
  ) {
    const result = helperState.originalReplaceState.apply(this, args);
    scheduleApply();
    return result;
  };

  window.addEventListener("popstate", scheduleApply);
  window.addEventListener("resize", scheduleApply);

  const OWN_NODE_SELECTOR = `#${TOOLTIP_ID}, #${CHART_CONTAINER_ID}`;

  const isOwnNode = (node: Node): boolean =>
    node instanceof Element &&
    (node.matches(OWN_NODE_SELECTOR) || Boolean(node.closest(OWN_NODE_SELECTOR)));

  const isOwnMutation = (record: MutationRecord) => {
    if (isOwnNode(record.target)) return true;

    const changedNodes = [...record.addedNodes, ...record.removedNodes];
    return changedNodes.length > 0 && changedNodes.every(isOwnNode);
  };

  helperState.observer = new MutationObserver((records) => {
    if (helperState.isApplying) return;
    if (getMode() === "my") return;
    if (records.every(isOwnMutation)) return;

    scheduleApply();
  });

  helperState.observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  helperState.destroy = () => {
    window.clearTimeout(helperState.applyTimer ?? undefined);
    helperState.observer?.disconnect?.();
    teardownMyMode();

    const nativeMyChart = document.getElementById("my-checkin-detail");
    if (nativeMyChart) nativeMyChart.style.display = "";
    document.getElementById(CHART_CONTAINER_ID)?.remove();

    history.pushState = helperState.originalPushState;
    history.replaceState = helperState.originalReplaceState;

    window.removeEventListener("popstate", scheduleApply);
    window.removeEventListener("resize", scheduleApply);

    document.getElementById(TOOLTIP_ID)?.remove();
  };

  if (getMode() === "my") {
    ensureMyModeActive();
  } else {
    applyCheckoutHover(helperState);
  }
})();
