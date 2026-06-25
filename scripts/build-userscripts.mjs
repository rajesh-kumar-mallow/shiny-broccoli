import { execSync } from "node:child_process";
import { build } from "vite";
import monkey from "vite-plugin-monkey";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getArtifactBase, PLAIN_SCRIPTS } from "./shared/manifest.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const artifactBase = getArtifactBase();

execSync("npx vite build", {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env },
});
console.log(
  `Built dist/check-in-summary-with-compensation-v2.user.js (@version ${pkg.version}, base ${artifactBase})`,
);

for (const script of PLAIN_SCRIPTS) {
  await build({
    root,
    plugins: [
      monkey({
        entry: script.entry,
        userscript: {
          ...script.userscript,
          updateURL: `${artifactBase}/${script.fileName}`,
          downloadURL: `${artifactBase}/${script.fileName}`,
        },
        build: {
          fileName: script.fileName,
        },
      }),
    ],
    build: {
      emptyOutDir: false,
    },
  });

  console.log(`Built dist/${script.fileName}`);
}
