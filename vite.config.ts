import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import monkey from "vite-plugin-monkey";
import pkg from "./package.json" with { type: "json" };

const PAGES_BASE = "https://rajesh-kumar-mallow.github.io/shiny-broccoli";
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
        updateURL: `${PAGES_BASE}/${SCRIPT_FILE}`,
        downloadURL: `${PAGES_BASE}/${SCRIPT_FILE}`,
      },
      build: {
        fileName: SCRIPT_FILE,
      },
    }),
  ],
});
