import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import monkey from "vite-plugin-monkey";
import pkg from "./package.json" with { type: "json" };

const ARTIFACT_BASE =
  "https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages";
const SCRIPT_FILE = "check-in-summary-with-compensation-v2.user.js";

export default defineConfig({
  plugins: [
    svelte(),
    monkey({
      entry: "src/userscript/main.ts",
      userscript: {
        name: "Check-in summary with compensation V2",
        namespace: "https://hubble.mallow-tech.com",
        version: pkg.version,
        description: "Work log summary with month filter, tooltips, and mini-modals",
        author: "You",
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
