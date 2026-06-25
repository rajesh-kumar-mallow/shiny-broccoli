export function initThemeSwitcher(): void;
export function getStoredMode(): "system" | "dark" | "light";
export function setMode(mode: "system" | "dark" | "light"): void;
export function cycleMode(): void;
