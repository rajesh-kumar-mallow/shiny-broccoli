import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const version = pkg.version;
const base = "https://rajesh-kumar-mallow.github.io/shiny-broccoli";
const file = "check-in-summary-with-compensation-v2.user.css";
const url = `${base}/${file}`;

const css = readFileSync(join(root, "src/styles/work-log-summary.css"), "utf8");

const header = `/*
@name           Check-in summary with compensation V2 (styles)
@namespace      https://hubble.mallow-tech.com
@version        ${version}
@description    Styles for Hubble work log summary card
@updateURL      ${url}
@downloadURL    ${url}
@match          https://hubble.mallow-tech.com/attendance/my-check-in-data*
*/
`;

mkdirSync(join(root, "dist"), { recursive: true });
writeFileSync(join(root, "dist", file), header + "\n" + css.trim() + "\n");
console.log(`Wrote dist/${file} (@version ${version})`);
