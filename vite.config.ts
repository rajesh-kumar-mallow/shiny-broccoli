import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import monkey from "vite-plugin-monkey";
import pkg from "./package.json" with { type: "json" };

const SCRIPT_FILE = "check-in-summary-with-compensation-v2.user.js";
const env =
  (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};
const ARTIFACT_BASE =
  env.HUBBLE_LOCAL_DEV === "1"
    ? `http://${env.HUBBLE_DEV_HOST ?? "localhost"}:${env.HUBBLE_DEV_PORT ?? "5174"}`
    : "https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages";

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
