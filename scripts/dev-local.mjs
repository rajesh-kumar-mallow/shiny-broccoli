import { spawn } from "node:child_process";
import {
  createReadStream,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { createServer } from "node:http";
import { createServer as createNetServer } from "node:net";
import { networkInterfaces } from "node:os";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ALL_ARTIFACTS,
  getArtifactBase,
  getDevHost,
  getDevPort,
  PLAIN_SCRIPTS,
  STYLES,
  SVELTE_SCRIPT,
} from "./shared/manifest.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const distDir = join(root, "dist");

process.env.HUBBLE_LOCAL_DEV = "1";
process.env.HUBBLE_DEV_HOST = getDevHost();

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const probe = createNetServer();
    probe.once("error", () => resolve(false));
    probe.once("listening", () => {
      probe.close(() => resolve(true));
    });
    probe.listen(port, "0.0.0.0");
  });
}

async function resolveDevPort() {
  const start = getDevPort();
  for (let offset = 0; offset < 20; offset++) {
    const port = start + offset;
    if (await isPortAvailable(port)) {
      if (offset > 0) {
        console.warn(`[local] Port ${start} is in use, using ${port} instead`);
      }
      return port;
    }
  }
  throw new Error(`[local] No free port found near ${start}`);
}

const chosenPort = await resolveDevPort();
process.env.HUBBLE_DEV_PORT = String(chosenPort);

const MIME = {
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

function getLanIp() {
  try {
    const nets = networkInterfaces();
    for (const entries of Object.values(nets)) {
      for (const net of entries ?? []) {
        if (net.family === "IPv4" && !net.internal) return net.address;
      }
    }
  } catch {
    return null;
  }
  return null;
}

function debounce(fn, ms = 350) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

async function runBuild(label) {
  const started = Date.now();
  console.log(`\n[local] ${label}…`);
  await new Promise((resolve, reject) => {
    const child = spawn("npm", ["run", "build"], {
      cwd: root,
      stdio: "inherit",
      env: { ...process.env },
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${label} failed (exit ${code})`));
    });
  });
  writeInstallPage();
  console.log(`[local] ${label} done in ${Date.now() - started}ms`);
}

function artifactUrl(base, file) {
  return `${base}/${file}`;
}

function tampermonkeyInstallUrl(base, file) {
  return `https://www.tampermonkey.net/script_installation.php#url=${encodeURIComponent(artifactUrl(base, file))}`;
}

function writeInstallPage() {
  mkdirSync(distDir, { recursive: true });
  const base = getArtifactBase();
  const lanIp = getLanIp();
  const lanBase = lanIp ? `http://${lanIp}:${getDevPort()}` : null;

  const userscripts = [SVELTE_SCRIPT, ...PLAIN_SCRIPTS].map((script) => ({
    name: script.userscript.name,
    file: script.fileName,
    install: tampermonkeyInstallUrl(base, script.fileName),
    raw: artifactUrl(base, script.fileName),
    lanRaw: lanBase ? artifactUrl(lanBase, script.fileName) : null,
  }));

  const styles = STYLES.map((style) => ({
    name: style.name,
    file: style.file,
    raw: artifactUrl(base, style.file),
    lanRaw: lanBase ? artifactUrl(lanBase, style.file) : null,
  }));

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Hubble Local Dev — shiny-broccoli</title>
  <style>
    :root { color-scheme: dark light; font-family: system-ui, sans-serif; }
    body { margin: 0; padding: 24px; background: #1e1f29; color: #f8f8f2; }
    h1 { margin: 0 0 8px; font-size: 1.4rem; }
    p, li { line-height: 1.5; color: #c9cad3; }
    section { margin: 24px 0; }
    a { color: #8be9fd; word-break: break-all; }
    code { background: #313442; padding: 2px 6px; border-radius: 6px; }
    .card { background: #282a36; border: 1px solid #44475a; border-radius: 12px; padding: 16px; margin: 12px 0; }
    .tag { display: inline-block; font-size: 12px; padding: 2px 8px; border-radius: 999px; background: #44475a; margin-left: 8px; }
  </style>
</head>
<body>
  <h1>Hubble local dev</h1>
  <p>Serving <code>dist/</code> from <strong>${base}</strong>. Save source files to trigger rebuild.</p>
  <p>After install: open Hubble, reload page, use Tampermonkey/Stylus update if needed.</p>
  ${lanBase ? `<p>LAN teammates: share <code>${lanBase}</code> (same Wi‑Fi).</p>` : ""}

  <section>
    <h2>Tampermonkey</h2>
    ${userscripts
      .map(
        (item) => `<div class="card">
      <strong>${item.name}</strong><span class="tag">.user.js</span>
      <div><a href="${item.install}">Install / update</a></div>
      <div><a href="${item.raw}">${item.raw}</a></div>
      ${item.lanRaw ? `<div>LAN: <a href="${item.lanRaw}">${item.lanRaw}</a></div>` : ""}
    </div>`,
      )
      .join("")}
  </section>

  <section>
    <h2>Stylus</h2>
    ${styles
      .map(
        (item) => `<div class="card">
      <strong>${item.name}</strong><span class="tag">.user.css</span>
      <div><a href="${item.raw}">Install from URL</a></div>
      ${item.lanRaw ? `<div>LAN: <a href="${item.lanRaw}">${item.lanRaw}</a></div>` : ""}
    </div>`,
      )
      .join("")}
  </section>

  <section>
    <h2>Files</h2>
    <ul>
      ${ALL_ARTIFACTS.map((file) => `<li><a href="${artifactUrl(base, file)}">${file}</a></li>`).join("")}
    </ul>
  </section>
</body>
</html>`;

  writeFileSync(join(distDir, "index.html"), html);
}

function startStaticServer(port) {
  const server = createServer((req, res) => {
    const pathname = decodeURIComponent((req.url ?? "/").split("?")[0]);
    const relPath = pathname === "/" ? "index.html" : pathname.replace(/^\//, "");
    const filePath = join(distDir, relPath);

    if (
      !filePath.startsWith(distDir) ||
      !existsSync(filePath) ||
      statSync(filePath).isDirectory()
    ) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const ext = extname(filePath);
    res.writeHead(200, {
      "Content-Type": MIME[ext] ?? "application/octet-stream",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    });
    createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve, reject) => {
    server.once("error", (error) => {
      if (error.code === "EADDRINUSE") {
        reject(
          new Error(
            `[local] Port ${port} became unavailable. Stop the other dev:local task and retry.`,
          ),
        );
        return;
      }
      reject(error);
    });

    server.listen(port, "0.0.0.0", () => {
      const base = getArtifactBase();
      const lanIp = getLanIp();
      console.log("\n[local] Install page:");
      console.log(`  ${base}/`);
      if (lanIp) console.log(`  http://${lanIp}:${port}/`);
      console.log("\n[local] Watching src/ for changes (poll every 1.5s)…\n");
      resolve(server);
    });
  });
}

function listSourceFiles(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules") continue;
      listSourceFiles(fullPath, acc);
      continue;
    }
    if (/\.(svelte|ts|js|css)$/.test(entry.name)) acc.push(fullPath);
  }
  return acc;
}

function snapshotSourceTimes() {
  const map = new Map();
  for (const file of listSourceFiles(join(root, "src"))) {
    map.set(file, statSync(file).mtimeMs);
  }
  return map;
}

function startPolling(onChange) {
  let last = snapshotSourceTimes();
  setInterval(() => {
    const next = snapshotSourceTimes();
    let changed = next.size !== last.size;
    if (!changed) {
      for (const [file, mtime] of next) {
        if (last.get(file) !== mtime) {
          changed = true;
          break;
        }
      }
    }
    if (!changed) return;
    last = next;
    onChange();
  }, 1500);
}

await runBuild("Initial build");
await startStaticServer(chosenPort);

const rebuild = debounce(async () => {
  try {
    await runBuild("Rebuild");
  } catch (error) {
    console.error("[local] Rebuild failed:", error.message);
  }
});

startPolling(() => {
  console.log("[local] Source change detected");
  rebuild();
});
