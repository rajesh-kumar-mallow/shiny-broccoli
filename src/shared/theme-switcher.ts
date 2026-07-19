import { initTimelineTheme } from "./timeline-theme";

const STORAGE_KEY = "hubble-theme";
const MODES = ["system", "dark", "light", "ayu-mirage"] as const;
export type ThemeMode = (typeof MODES)[number];

function getStoredMode(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY);
  return (MODES as readonly string[]).includes(stored || "") ? (stored as ThemeMode) : "system";
}

function applyTheme(mode: ThemeMode) {
  document.documentElement.dataset.hubbleTheme = mode;
}

function setMode(mode: string) {
  if (!(MODES as readonly string[]).includes(mode)) return;
  localStorage.setItem(STORAGE_KEY, mode);
  applyTheme(mode as ThemeMode);
}

// ── Custom accent colors ──
// Sits on top of whichever theme mode is active: an unset accent falls back
// to that theme's own default, a set one overrides it everywhere the token
// is used (badges, timeline segments, buttons, ...) via an inline custom
// property on <html>, which beats any [data-hubble-theme="..."] rule in the
// cascade regardless of mode.
const COLORS_STORAGE_KEY = "hubble-custom-colors";
const ACCENT_KEYS = ["cyan", "purple", "pink", "green", "red", "yellow", "orange"] as const;
export type AccentKey = (typeof ACCENT_KEYS)[number];
export type CustomColors = Partial<Record<AccentKey, string>>;

const HEX_COLOR_RE = /^#[0-9a-f]{6}$/i;

function getCustomColors(): CustomColors {
  let parsed: unknown;
  try {
    parsed = JSON.parse(localStorage.getItem(COLORS_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
  if (!parsed || typeof parsed !== "object") return {};

  const result: CustomColors = {};
  for (const key of ACCENT_KEYS) {
    const value = (parsed as Record<string, unknown>)[key];
    if (typeof value === "string" && HEX_COLOR_RE.test(value)) result[key] = value;
  }
  return result;
}

function applyCustomColors(colors: CustomColors = getCustomColors()) {
  const style = document.documentElement.style;
  for (const key of ACCENT_KEYS) {
    const value = colors[key];
    if (value) style.setProperty(`--dr-${key}`, value);
    else style.removeProperty(`--dr-${key}`);
  }
}

function setCustomColor(key: AccentKey, value: string | null) {
  const colors = getCustomColors();
  if (value && HEX_COLOR_RE.test(value)) colors[key] = value;
  else delete colors[key];
  localStorage.setItem(COLORS_STORAGE_KEY, JSON.stringify(colors));
  applyCustomColors(colors);
}

// Replaces the whole custom palette at once (used by presets), rather than
// merging into whatever overrides already existed.
function setCustomColors(colors: CustomColors) {
  const validated: CustomColors = {};
  for (const key of ACCENT_KEYS) {
    const value = colors[key];
    if (value && HEX_COLOR_RE.test(value)) validated[key] = value;
  }
  localStorage.setItem(COLORS_STORAGE_KEY, JSON.stringify(validated));
  applyCustomColors(validated);
}

function resetCustomColors() {
  localStorage.removeItem(COLORS_STORAGE_KEY);
  applyCustomColors({});
}

export const MODE_LABELS: Record<ThemeMode, { label: string; title: string }> = {
  system: { label: "Auto", title: "System theme" },
  dark: { label: "Dark", title: "Dark Dracula" },
  light: { label: "Light", title: "Light Dracula" },
  "ayu-mirage": { label: "Ayu", title: "Ayu Mirage" },
};

export function initTheme() {
  if (window.__hubbleThemeInit) return;
  window.__hubbleThemeInit = true;

  applyTheme(getStoredMode());
  applyCustomColors();

  const boot = () => {
    applyTheme(getStoredMode());
    applyCustomColors();
    initTimelineTheme();
  };

  if (document.body) boot();
  else document.addEventListener("DOMContentLoaded", boot);

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (getStoredMode() === "system") applyTheme("system");
  });
}

export { ACCENT_KEYS, getCustomColors, setCustomColor, setCustomColors, resetCustomColors };

export { MODES, getStoredMode, setMode };
