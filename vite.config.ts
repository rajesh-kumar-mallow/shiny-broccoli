import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import monkey from "vite-plugin-monkey";
import pkg from "./package.json" with { type: "json" };
import { getArtifactBase } from "./scripts/shared/manifest.mjs";

const SCRIPT_FILE = "check-in-summary-with-compensation-v2.user.js";
const ARTIFACT_BASE = getArtifactBase();

export default defineConfig({
  plugins: [
    preact(),
    monkey({
      entry: "src/userscript/main.tsx",
      userscript: {
        name: "Check-in summary with compensation V2",
        namespace: "https://hubble.mallow-tech.com",
        version: pkg.version,
        description: "Work log summary with month filter, tooltips, and mini-modals",
        author: "Neon Raven",
        match: ["https://hubble.mallow-tech.com/attendance/my-check-in-data*"],
        grant: "none",
        tag: ["timesheet"],
        updateURL: `${ARTIFACT_BASE}/${SCRIPT_FILE}`,
        downloadURL: `${ARTIFACT_BASE}/${SCRIPT_FILE}`,
      },
      build: {
        fileName: SCRIPT_FILE,
      },
    }),
  ],
});
