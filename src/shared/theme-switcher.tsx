import { render } from "preact";
import { initTimelineTheme } from "./timeline-theme";

const STORAGE_KEY = "hubble-theme";
const MODES = ["system", "dark", "light"] as const;
type ThemeMode = (typeof MODES)[number];
const SWITCHER_ID = "hubble-theme-switcher";

function getStoredMode(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY);
  return (MODES as readonly string[]).includes(stored || "") ? (stored as ThemeMode) : "system";
}

function applyTheme(mode: ThemeMode) {
  document.documentElement.dataset.hubbleTheme = mode;
  const root = document.getElementById(SWITCHER_ID);
  if (root) {
    root.querySelectorAll<HTMLElement>("[data-mode]").forEach((btn) => {
      btn.classList.toggle("hts-active", btn.dataset.mode === mode);
    });
  }
}

function setMode(mode: string) {
  if (!(MODES as readonly string[]).includes(mode)) return;
  localStorage.setItem(STORAGE_KEY, mode);
  applyTheme(mode as ThemeMode);
}

function cycleMode() {
  const idx = MODES.indexOf(getStoredMode());
  setMode(MODES[(idx + 1) % MODES.length]);
}

const MODE_LABELS: Record<ThemeMode, { label: string; title: string }> = {
  system: { label: "Auto", title: "System theme" },
  dark: { label: "Dark", title: "Dark Dracula" },
  light: { label: "Light", title: "Light Dracula" },
};

function ThemeSwitcher() {
  return (
    <>
      {MODES.map((mode) => (
        <button
          key={mode}
          type="button"
          data-mode={mode}
          title={MODE_LABELS[mode].title}
          onClick={() => setMode(mode)}
        >
          {MODE_LABELS[mode].label}
        </button>
      ))}
    </>
  );
}

function ensureSwitcher() {
  if (document.getElementById(SWITCHER_ID)) return;

  const root = document.createElement("div");
  root.id = SWITCHER_ID;
  document.body.appendChild(root);
  render(<ThemeSwitcher />, root);

  applyTheme(getStoredMode());
}

export function initThemeSwitcher() {
  if (window.__hubbleThemeSwitcherInit) return;
  window.__hubbleThemeSwitcherInit = true;

  applyTheme(getStoredMode());

  const boot = () => {
    ensureSwitcher();
    applyTheme(getStoredMode());
    initTimelineTheme();
  };

  if (document.body) boot();
  else document.addEventListener("DOMContentLoaded", boot);

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (getStoredMode() === "system") applyTheme("system");
  });
}

export { getStoredMode, setMode, cycleMode };
