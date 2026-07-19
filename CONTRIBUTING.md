# Contributing

This is a fun side project to make [Hubble](https://hubble.mallow-tech.com) a little nicer — tweaks, small features, theme work. Contributions are welcome, no formal process required.

## Getting set up

```bash
npm install
npm run dev:local    # local install server + watch rebuild for all artifacts
```

Then open `http://localhost:5174/`, install the printed userscript/userstyle links into your userscript manager (Tampermonkey, ScriptCat, etc.) and Stylus, and reload Hubble. Edits under `src/` auto-rebuild.

For fast iteration on the work-log-summary card specifically, `npm run dev` gives you Vite HMR instead.

See the [README](README.md) for the full local-testing walkthrough and project layout.

## Before opening a PR

```bash
npm run validate   # typecheck + lint + format check
```

- Keep changes scoped — this repo favors small, focused PRs over big rewrites.
- Match the existing code style (Preact + TypeScript, SCSS partials under `src/styles/`, shared theme tokens via `--dr-*` CSS variables — see `src/styles/hubble-theme/_tokens.scss`).
- If you touch styling, check it against all theme modes (System/Dark/Light/Ayu Mirage) where relevant.
- No need to bump `version` in `package.json` yourself — that's done at merge/release time.

## Reporting bugs / ideas

Open a [GitHub issue](../../issues). Screenshots help a lot for anything visual. For security-relevant reports, see [SECURITY.md](SECURITY.md) instead.

## License

This project is [Unlicensed](LICENSE) — public domain, no restrictions. By contributing, you agree your contributions are released the same way.
