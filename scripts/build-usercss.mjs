import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getArtifactBase, STYLES } from "./shared/manifest.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const version = pkg.version;
const base = getArtifactBase();

mkdirSync(join(root, "dist"), { recursive: true });

for (const style of STYLES) {
  const url = `${base}/${style.file}`;
  const css = readFileSync(join(root, "src/styles", style.src), "utf8");

  const header = `/* ==UserStyle==
@name           ${style.name}
@namespace      https://hubble.mallow-tech.com
@version        ${version}
@description    ${style.description}
@updateURL      ${url}
@downloadURL    ${url}
==/UserStyle== */

@-moz-document ${style.document} {
`;

  const footer = `
}
`;

  writeFileSync(join(root, "dist", style.file), header + css.trim() + footer);
  console.log(`Wrote dist/${style.file} (@version ${version}, base ${base})`);
}
