# Check-in summary with compensation V2

Tampermonkey + Stylus userscripts for [Hubble](https://hubble.mallow-tech.com) that add a work log summary with month filter, tooltips, and mini-modals on the my check-in data page.

**Install both extensions** — Tampermonkey runs the logic; Stylus provides the styles.

## Install

| Extension             | Link                                                                                                                                                                                                       |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tampermonkey** (JS) | [Install userscript](https://www.tampermonkey.net/script_installation.php#url=https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/check-in-summary-with-compensation-v2.user.js) |
| **Stylus** (CSS)      | [Install userstyle](https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/check-in-summary-with-compensation-v2.user.css)                                                          |

Raw URLs (used for auto-update):

- https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/check-in-summary-with-compensation-v2.user.js
- https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/check-in-summary-with-compensation-v2.user.css

## Updates

Both Tampermonkey and Stylus auto-update from the `gh-pages` branch when they check for updates (enabled by default).

After merging to `main`, GitHub Actions builds and deploys to the `gh-pages` branch automatically.

## Development

```bash
npm install
npm run dev      # Vite dev server for the userscript
npm run build    # dist/*.user.js + dist/*.user.css
```

To publish a new version:

1. Edit `src/userscript/` or `src/styles/`
2. Bump `version` in `package.json`
3. Push to `main`

## Project layout

```
src/userscript/   Svelte + TypeScript (Tampermonkey)
src/styles/       CSS source (Stylus userstyle)
dist/             Built artifacts (deployed to gh-pages branch)
```

## Cost

Free on a public GitHub repo — GitHub Actions have no charge for public projects.
