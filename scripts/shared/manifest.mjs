export const PROD_ARTIFACT_BASE =
  "https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages";

export const DEFAULT_DEV_PORT = 5174;
export const VITE_DEV_PORT = 5173;

export const SVELTE_SCRIPT = {
  entry: "src/userscript/main.ts",
  fileName: "check-in-summary-with-compensation-v2.user.js",
  userscript: {
    name: "Check-in summary with compensation V2",
    namespace: "https://hubble.mallow-tech.com",
    description: "Work log summary with month filter, tooltips, and mini-modals",
    author: "Neon Raven",
    match: ["https://hubble.mallow-tech.com/attendance/my-check-in-data*"],
    grant: "none",
    tag: ["timesheet"],
  },
};

export const PLAIN_SCRIPTS = [
  {
    entry: "src/userscripts/theme-host.js",
    fileName: "hubble-theme-host.user.js",
    userscript: {
      name: "Hubble Dracula Theme Host",
      namespace: "https://hubble.mallow-tech.com",
      version: "1.0.0",
      description: "Applies saved Dracula theme (Auto/Dark/Light) on all Hubble pages",
      author: "Neon Raven",
      match: ["*://hubble.mallow-tech.com/*"],
      "run-at": "document-start",
      grant: "none",
      tag: ["theme"],
    },
  },
  {
    entry: "src/userscripts/checkout-hover-helper.js",
    fileName: "hubble-checkout-hover-helper.user.js",
    userscript: {
      name: "Hubble Checkout Hover Helper",
      namespace: "https://hubble.mallow-tech.com",
      version: "1.0.0",
      description: "Auto checkout helper for Hubble attendance pages",
      author: "Neon Raven",
      match: [
        "https://hubble.mallow-tech.com/attendance/all-check-in-data*",
        "https://hubble.mallow-tech.com/attendance/my-check-in-data*",
      ],
      "run-at": "document-idle",
      grant: "none",
      tag: ["timesheet"],
    },
  },
  {
    entry: "src/userscripts/smart-attendance-assistant.js",
    fileName: "hubble-smart-attendance-assistant.user.js",
    userscript: {
      name: "Hubble Smart Attendance Assistant",
      namespace: "https://hubble.mallow-tech.com",
      version: "9.2",
      description: "Smart draggable checkout assistant with Dracula-themed UI",
      author: "Neon Raven",
      match: [
        "*://hubble.mallow-tech.com/attendance/my-check-in-data",
        "*://hubble.mallow-tech.com/attendance/all-check-in-data",
        "*://hubble.mallow-tech.com/v2/timesheet",
      ],
      grant: "none",
      tag: ["timesheet"],
    },
  },
];

export const STYLES = [
  {
    name: "Check-in summary with compensation V2 (styles)",
    file: "check-in-summary-with-compensation-v2.user.css",
    src: "work-log-summary.css",
    document: 'url-prefix("https://hubble.mallow-tech.com/attendance/my-check-in-data")',
    description: "Styles for Hubble work log summary card",
  },
  {
    name: "Hubble Smart Attendance Assistant (styles)",
    file: "hubble-smart-attendance-assistant.user.css",
    src: "smart-attendance-assistant.css",
    document: 'domain("hubble.mallow-tech.com")',
    description: "Styles for Hubble Smart Attendance Assistant widget",
  },
  {
    name: "Hubble Dracula Theme",
    file: "hubble-theme.user.css",
    src: "hubble-theme.css",
    document: 'domain("hubble.mallow-tech.com")',
    description: "Dracula theme for Hubble with system/dark/light modes",
  },
];

export const ALL_ARTIFACTS = [
  SVELTE_SCRIPT.fileName,
  ...PLAIN_SCRIPTS.map((s) => s.fileName),
  ...STYLES.map((s) => s.file),
];

export function isLocalDev() {
  return process.env.HUBBLE_LOCAL_DEV === "1";
}

export function getDevHost() {
  return process.env.HUBBLE_DEV_HOST || "localhost";
}

export function getDevPort() {
  return Number(process.env.HUBBLE_DEV_PORT || DEFAULT_DEV_PORT);
}

export function getArtifactBase() {
  if (isLocalDev()) {
    return `http://${getDevHost()}:${getDevPort()}`;
  }
  return PROD_ARTIFACT_BASE;
}
