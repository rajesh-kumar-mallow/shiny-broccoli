const STORAGE_KEY = "hubble-theme";
const MODES = ["system", "dark", "light"];
const SWITCHER_ID = "hubble-theme-switcher";

function getStoredMode() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return MODES.includes(stored) ? stored : "system";
}

function applyTheme(mode) {
  document.documentElement.dataset.hubbleTheme = mode;
  const root = document.getElementById(SWITCHER_ID);
  if (root) {
    root.querySelectorAll("[data-mode]").forEach((btn) => {
      btn.classList.toggle("hts-active", btn.dataset.mode === mode);
    });
  }
}

function setMode(mode) {
  if (!MODES.includes(mode)) return;
  localStorage.setItem(STORAGE_KEY, mode);
  applyTheme(mode);
}

function cycleMode() {
  const idx = MODES.indexOf(getStoredMode());
  setMode(MODES[(idx + 1) % MODES.length]);
}

function ensureSwitcher() {
  if (document.getElementById(SWITCHER_ID)) return;

  const root = document.createElement("div");
  root.id = SWITCHER_ID;
  root.innerHTML = `
    <button type="button" data-mode="system" title="System theme">Auto</button>
    <button type="button" data-mode="dark" title="Dark Dracula">Dark</button>
    <button type="button" data-mode="light" title="Light Dracula">Light</button>
  `;

  root.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-mode]");
    if (btn) setMode(btn.dataset.mode);
  });

  document.body.appendChild(root);
  applyTheme(getStoredMode());
}

import { initTimelineTheme } from "./timeline-theme.js";

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
