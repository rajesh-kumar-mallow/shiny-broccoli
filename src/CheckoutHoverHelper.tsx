import { initTheme } from "./shared/theme-switcher";
import type { HelperState } from "./checkout-hover/types";
import { TOOLTIP_ID, getMode } from "./checkout-hover/shared";
import { ensureAllModeChartActive, teardownAllModeChart } from "./checkout-hover/all-mode-chart";
import { ensureMyModeActive, teardownMyMode } from "./checkout-hover/my-mode-chart";

initTheme();

(() => {
  window.__checkoutHoverHelper?.destroy?.();

  const helperState: HelperState = {
    originalPushState: history.pushState,
    originalReplaceState: history.replaceState,
  };

  window.__checkoutHoverHelper = helperState;

  const applyForCurrentMode = () => {
    if (getMode() === "my") {
      teardownAllModeChart();
      ensureMyModeActive();
    } else {
      teardownMyMode();
      ensureAllModeChartActive();
    }
  };

  history.pushState = function patchedPushState(
    this: History,
    ...args: Parameters<History["pushState"]>
  ) {
    const result = helperState.originalPushState.apply(this, args);
    applyForCurrentMode();
    return result;
  };

  history.replaceState = function patchedReplaceState(
    this: History,
    ...args: Parameters<History["replaceState"]>
  ) {
    const result = helperState.originalReplaceState.apply(this, args);
    applyForCurrentMode();
    return result;
  };

  window.addEventListener("popstate", applyForCurrentMode);

  helperState.destroy = () => {
    teardownMyMode();
    teardownAllModeChart();

    history.pushState = helperState.originalPushState;
    history.replaceState = helperState.originalReplaceState;

    window.removeEventListener("popstate", applyForCurrentMode);

    document.getElementById(TOOLTIP_ID)?.remove();
  };

  applyForCurrentMode();
})();
