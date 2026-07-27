import { render } from "preact";
import {
  MODES,
  MODE_LABELS,
  ACCENT_KEYS,
  getStoredMode,
  setMode,
  getCustomColors,
  setCustomColor,
  setCustomColors,
  resetCustomColors,
  type ThemeMode,
  type AccentKey,
  type CustomColors,
} from "./theme-switcher";
import {
  isHiddenUnlocked,
  isAutoApproveEnabled,
  setAutoApproveEnabled,
  isOnlyApproveEnabled,
  setOnlyApproveEnabled,
  isAutoAuthoriseEnabled,
  setAutoAuthoriseEnabled,
} from "../lib/feature-flags";

const MODAL_ROOT_ID = "hubble-profile-settings-modal";

const ACCENT_LABELS: Record<AccentKey, string> = {
  cyan: "Cyan",
  purple: "Purple",
  pink: "Pink",
  green: "Green",
  red: "Red",
  yellow: "Yellow",
  orange: "Orange",
};

// Complete 7-color sets a user can apply in one click. Selecting a preset
// replaces the whole custom palette (not a merge) — "Default" clears it back
// to each theme's own built-in colors. Values are lowercase to match what
// <input type="color"> round-trips, so the "active" preset check below works.
type Preset = { key: string; label: string; colors: CustomColors };

const PRESETS: Preset[] = [
  { key: "default", label: "Default", colors: {} },
  {
    key: "dracula-classic",
    label: "Dracula Classic",
    colors: {
      cyan: "#8be9fd",
      purple: "#bd93f9",
      pink: "#ff79c6",
      green: "#50fa7b",
      red: "#ff5555",
      yellow: "#f1fa8c",
      orange: "#ffb86c",
    },
  },
  {
    key: "nord",
    label: "Nord",
    colors: {
      cyan: "#88c0d0",
      purple: "#b48ead",
      pink: "#d0819c",
      green: "#a3be8c",
      red: "#bf616a",
      yellow: "#ebcb8b",
      orange: "#d08770",
    },
  },
  {
    key: "monokai",
    label: "Monokai",
    colors: {
      cyan: "#66d9ef",
      purple: "#ae81ff",
      pink: "#fd5ff0",
      green: "#a6e22e",
      red: "#f92672",
      yellow: "#e6db74",
      orange: "#fd971f",
    },
  },
];

const presetsMatch = (a: CustomColors, b: CustomColors) =>
  ACCENT_KEYS.every((key) => (a[key] || "") === (b[key] || ""));

// The <input type="color"> needs a concrete starting hex, not "unset" — read
// whatever's actually rendered right now (an existing override, or the
// active theme's own default for that token) so the swatch never opens blank.
const getEffectiveColor = (key: AccentKey) =>
  getComputedStyle(document.documentElement).getPropertyValue(`--dr-${key}`).trim() || "#000000";

const PREVIEW: Record<ThemeMode, { bg: string; dots: [string, string, string] }> = {
  system: {
    bg: "linear-gradient(135deg, #282a36 50%, #f8f8f2 50%)",
    dots: ["#bd93f9", "#8be9fd", "#7c4dff"],
  },
  dark: { bg: "#282a36", dots: ["#bd93f9", "#8be9fd", "#ff79c6"] },
  light: { bg: "#f8f8f2", dots: ["#7c4dff", "#0997b5", "#d63384"] },
  "ayu-mirage": { bg: "#1f2430", dots: ["#dfbfff", "#95e6cb", "#ffa659"] },
};

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    >
      <line x1="3" y1="3" x2="13" y2="13" />
      <line x1="13" y1="3" x2="3" y2="13" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M2.5 8a5.5 5.5 0 1 1 1.8 4.07" />
      <polyline points="2.3,4.5 2.5,8 6,7.6" />
    </svg>
  );
}

type ModalProps = {
  open: boolean;
  mode: ThemeMode;
  colors: CustomColors;
  autoApprove: boolean;
  onlyApprove: boolean;
  autoAuthorise: boolean;
  onClose: () => void;
  onSelect: (mode: ThemeMode) => void;
  onColorChange: (key: AccentKey, hex: string) => void;
  onColorReset: (key: AccentKey) => void;
  onResetAllColors: () => void;
  onApplyPreset: (preset: Preset) => void;
  onAutoApproveChange: (enabled: boolean) => void;
  onOnlyApproveChange: (enabled: boolean) => void;
  onAutoAuthoriseChange: (enabled: boolean) => void;
};

function ProfileSettingsModal({
  open,
  mode,
  colors,
  autoApprove,
  onlyApprove,
  autoAuthorise,
  onClose,
  onSelect,
  onColorChange,
  onColorReset,
  onResetAllColors,
  onApplyPreset,
  onAutoApproveChange,
  onOnlyApproveChange,
  onAutoAuthoriseChange,
}: ModalProps) {
  if (!open) return null;

  const hasCustomColors = ACCENT_KEYS.some((key) => colors[key]);

  return (
    <div
      class="hps-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div class="hps-modal">
        <div class="hps-modal-head">
          <div>
            <div class="hps-modal-title">User Config</div>
            <div class="hps-modal-subtitle">Personal preferences for Hubble</div>
          </div>
          <button type="button" class="hps-close-btn" onClick={onClose}>
            <CloseIcon /> Close
          </button>
        </div>
        <div class="hps-modal-body">
          <div class="hps-section">
            <div class="hps-section-title">Appearance</div>
            <div class="hps-theme-grid">
              {MODES.map((m) => (
                <button
                  key={m}
                  type="button"
                  class={`hps-theme-card${m === mode ? " hps-theme-card-active" : ""}`}
                  onClick={() => onSelect(m)}
                  title={MODE_LABELS[m].title}
                >
                  <span class="hps-theme-swatch" style={{ background: PREVIEW[m].bg }}>
                    {PREVIEW[m].dots.map((color, i) => (
                      <span key={i} class="hps-theme-dot" style={{ background: color }} />
                    ))}
                  </span>
                  <span class="hps-theme-label">{MODE_LABELS[m].label}</span>
                </button>
              ))}
            </div>
          </div>
          <div class="hps-section">
            <div class="hps-section-title-row">
              <div class="hps-section-title">Accent colors</div>
              {hasCustomColors && (
                <button type="button" class="hps-reset-all-btn" onClick={onResetAllColors}>
                  Reset all
                </button>
              )}
            </div>
            <div class="hps-preset-row">
              {PRESETS.map((preset) => (
                <button
                  key={preset.key}
                  type="button"
                  class={`hps-preset-btn${presetsMatch(colors, preset.colors) ? " hps-preset-btn-active" : ""}`}
                  onClick={() => onApplyPreset(preset)}
                  title={preset.label}
                >
                  <span class="hps-preset-dots">
                    {(["green", "cyan", "pink", "orange"] as AccentKey[]).map((key) => (
                      <span
                        key={key}
                        class="hps-preset-dot"
                        style={{ background: preset.colors[key] || getEffectiveColor(key) }}
                      />
                    ))}
                  </span>
                  <span class="hps-preset-label">{preset.label}</span>
                </button>
              ))}
            </div>
            <div class="hps-color-grid">
              {ACCENT_KEYS.map((key) => {
                const isCustom = !!colors[key];
                return (
                  <div key={key} class="hps-color-row">
                    <label class="hps-color-swatch">
                      <input
                        type="color"
                        value={colors[key] || getEffectiveColor(key)}
                        onInput={(e) => onColorChange(key, (e.target as HTMLInputElement).value)}
                      />
                    </label>
                    <span class="hps-color-label">{ACCENT_LABELS[key]}</span>
                    {isCustom && (
                      <button
                        type="button"
                        class="hps-color-reset-btn"
                        title={`Reset ${ACCENT_LABELS[key]} to theme default`}
                        onClick={() => onColorReset(key)}
                      >
                        <ResetIcon />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {isHiddenUnlocked() && (
            <div class="hps-section">
              <div class="hps-section-title">Experimental</div>
              <label class="hps-toggle-row">
                <input
                  type="checkbox"
                  checked={autoApprove}
                  onChange={(e) => onAutoApproveChange((e.target as HTMLInputElement).checked)}
                />
                <span class="hps-toggle-label">
                  <span class="hps-toggle-title">Timesheet Auto-Approve</span>
                  <span class="hps-toggle-desc">
                    Adds an "Auto Approve" button on the timesheet page
                  </span>
                </span>
              </label>
              {autoApprove && (
                <label class="hps-toggle-row hps-toggle-row-sub">
                  <input
                    type="checkbox"
                    checked={onlyApprove}
                    onChange={(e) => onOnlyApproveChange((e.target as HTMLInputElement).checked)}
                  />
                  <span class="hps-toggle-label">
                    <span class="hps-toggle-title">Only Approve</span>
                    <span class="hps-toggle-desc">
                      Button only does the approve step, skips efficiency/authorise
                    </span>
                  </span>
                </label>
              )}
              {autoApprove && onlyApprove && (
                <label class="hps-toggle-row hps-toggle-row-sub hps-toggle-row-sub2">
                  <input
                    type="checkbox"
                    checked={autoAuthorise}
                    onChange={(e) => onAutoAuthoriseChange((e.target as HTMLInputElement).checked)}
                  />
                  <span class="hps-toggle-label">
                    <span class="hps-toggle-title">Auto Authorise</span>
                    <span class="hps-toggle-desc">
                      Beta: shows two buttons on the timesheet page — "Just Approve" and "Approve &
                      Authorise"
                    </span>
                  </span>
                </label>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type State = {
  open: boolean;
  mode: ThemeMode;
  colors: CustomColors;
  autoApprove: boolean;
  onlyApprove: boolean;
  autoAuthorise: boolean;
};

const getFlagsState = () => ({
  autoApprove: isAutoApproveEnabled(),
  onlyApprove: isOnlyApproveEnabled(),
  autoAuthorise: isAutoAuthoriseEnabled(),
});

let root: HTMLElement | null = null;
let state: State = {
  open: false,
  mode: getStoredMode(),
  colors: getCustomColors(),
  ...getFlagsState(),
};

function renderModal() {
  if (!root) return;
  render(
    <ProfileSettingsModal
      open={state.open}
      mode={state.mode}
      colors={state.colors}
      autoApprove={state.autoApprove}
      onlyApprove={state.onlyApprove}
      autoAuthorise={state.autoAuthorise}
      onAutoApproveChange={(enabled) => {
        setAutoApproveEnabled(enabled);
        if (!enabled) {
          setOnlyApproveEnabled(false);
          setAutoAuthoriseEnabled(false);
        }
        state = {
          ...state,
          autoApprove: enabled,
          onlyApprove: enabled && state.onlyApprove,
          autoAuthorise: enabled && state.autoAuthorise,
        };
        renderModal();
      }}
      onOnlyApproveChange={(enabled) => {
        setOnlyApproveEnabled(enabled);
        if (!enabled) setAutoAuthoriseEnabled(false);
        state = { ...state, onlyApprove: enabled, autoAuthorise: enabled && state.autoAuthorise };
        renderModal();
      }}
      onAutoAuthoriseChange={(enabled) => {
        setAutoAuthoriseEnabled(enabled);
        state = { ...state, autoAuthorise: enabled };
        renderModal();
      }}
      onClose={() => {
        state = { ...state, open: false };
        renderModal();
      }}
      onSelect={(m) => {
        setMode(m);
        state = { ...state, mode: m };
        renderModal();
      }}
      onColorChange={(key, hex) => {
        setCustomColor(key, hex);
        state = { ...state, colors: { ...state.colors, [key]: hex } };
        renderModal();
      }}
      onColorReset={(key) => {
        setCustomColor(key, null);
        const colors = { ...state.colors };
        delete colors[key];
        state = { ...state, colors };
        renderModal();
      }}
      onResetAllColors={() => {
        resetCustomColors();
        state = { ...state, colors: {} };
        renderModal();
      }}
      onApplyPreset={(preset) => {
        if (preset.key === "default") resetCustomColors();
        else setCustomColors(preset.colors);
        state = { ...state, colors: preset.colors };
        renderModal();
      }}
    />,
    root,
  );
}

function ensureRoot() {
  if (root) return;
  root = document.createElement("div");
  root.id = MODAL_ROOT_ID;
  document.body.appendChild(root);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && state.open) {
      state = { ...state, open: false };
      renderModal();
    }
  });
}

export function openProfileSettingsModal() {
  ensureRoot();
  state = {
    open: true,
    mode: getStoredMode(),
    colors: getCustomColors(),
    ...getFlagsState(),
  };
  renderModal();
}
