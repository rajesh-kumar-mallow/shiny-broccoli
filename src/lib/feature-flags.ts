// Hidden/experimental features: not discoverable through the UI at all
// unless a secret key has been manually set in localStorage (devtools console
// or by hand). Presence of the unlock key gates whether the toggle even shows
// up in User Config; the per-feature flag is a separate key so unlocking
// doesn't itself turn anything on.
const HIDDEN_UNLOCK_KEY = "hubble-hidden-unlock";
const AUTO_APPROVE_ENABLED_KEY = "hubble-timesheet-auto-approve-enabled";
const ONLY_APPROVE_ENABLED_KEY = "hubble-timesheet-only-approve-enabled";
const AUTO_AUTHORISE_ENABLED_KEY = "hubble-timesheet-auto-authorise-enabled";

export function isHiddenUnlocked(): boolean {
  return !!localStorage.getItem(HIDDEN_UNLOCK_KEY);
}

export function isAutoApproveEnabled(): boolean {
  return isHiddenUnlocked() && localStorage.getItem(AUTO_APPROVE_ENABLED_KEY) === "1";
}

export function setAutoApproveEnabled(enabled: boolean): void {
  if (enabled) localStorage.setItem(AUTO_APPROVE_ENABLED_KEY, "1");
  else localStorage.removeItem(AUTO_APPROVE_ENABLED_KEY);
}

// Restricts the auto-approve button to just the approve step, skipping the
// efficiency + authorise steps. Only meaningful while auto-approve itself is on.
export function isOnlyApproveEnabled(): boolean {
  return isAutoApproveEnabled() && localStorage.getItem(ONLY_APPROVE_ENABLED_KEY) === "1";
}

export function setOnlyApproveEnabled(enabled: boolean): void {
  if (enabled) localStorage.setItem(ONLY_APPROVE_ENABLED_KEY, "1");
  else localStorage.removeItem(ONLY_APPROVE_ENABLED_KEY);
}

// Opts back into the efficiency + authorise steps while "only approve" is on,
// so the button runs the full flow again. There's no standalone "authorise
// only" mode — this only ever adds onto the approve step, never replaces it.
export function isAutoAuthoriseEnabled(): boolean {
  return isOnlyApproveEnabled() && localStorage.getItem(AUTO_AUTHORISE_ENABLED_KEY) === "1";
}

export function setAutoAuthoriseEnabled(enabled: boolean): void {
  if (enabled) localStorage.setItem(AUTO_AUTHORISE_ENABLED_KEY, "1");
  else localStorage.removeItem(AUTO_AUTHORISE_ENABLED_KEY);
}

// Whether the efficiency + authorise steps should run at all: always, unless
// "only approve" has restricted the flow and "auto authorise" hasn't opted
// back in.
export function shouldRunAuthoriseSteps(): boolean {
  return !isOnlyApproveEnabled() || isAutoAuthoriseEnabled();
}

export { HIDDEN_UNLOCK_KEY };
