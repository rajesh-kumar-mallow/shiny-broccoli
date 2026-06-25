# Hubble Userscripts (shiny-broccoli)

Tampermonkey + Stylus extensions for [Hubble](https://hubble.mallow-tech.com): work log summary, checkout hover helper, smart attendance assistant, and a shared Dracula theme with system/dark/light switching.

## Install

Install **Tampermonkey** scripts you need, plus **Stylus** userstyles. Always install `hubble-theme.user.css` for the Dracula theme and theme switcher styling.

### Tampermonkey (userscripts)

| Script                                | Install                                                                                                                                                                                         |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Check-in summary with compensation V2 | [Install](https://www.tampermonkey.net/script_installation.php#url=https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/check-in-summary-with-compensation-v2.user.js) |
| Hubble Checkout Hover Helper          | [Install](https://www.tampermonkey.net/script_installation.php#url=https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/hubble-checkout-hover-helper.user.js)          |
| Hubble Smart Attendance Assistant     | [Install](https://www.tampermonkey.net/script_installation.php#url=https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/hubble-smart-attendance-assistant.user.js)     |

### Stylus (userstyles)

| Style                             | Install                                                                                                                                 |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Hubble Dracula Theme (required)   | [Install](https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/hubble-theme.user.css)                          |
| Work log summary styles           | [Install](https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/check-in-summary-with-compensation-v2.user.css) |
| Smart Attendance Assistant styles | [Install](https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/hubble-smart-attendance-assistant.user.css)     |

### What to install together

| Feature           | Tampermonkey                                    | Stylus                                                                     |
| ----------------- | ----------------------------------------------- | -------------------------------------------------------------------------- |
| Work log summary  | `check-in-summary-with-compensation-v2.user.js` | `hubble-theme.user.css` + `check-in-summary-with-compensation-v2.user.css` |
| Checkout hover    | `hubble-checkout-hover-helper.user.js`          | `hubble-theme.user.css`                                                    |
| Attendance widget | `hubble-smart-attendance-assistant.user.js`     | `hubble-theme.user.css` + `hubble-smart-attendance-assistant.user.css`     |

A floating **Auto / Dark / Light** theme switcher appears when any userscript is active. Choice is saved in `localStorage` (`hubble-theme`).

## Raw URLs (auto-update)

- https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/check-in-summary-with-compensation-v2.user.js
- https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/hubble-checkout-hover-helper.user.js
- https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/hubble-smart-attendance-assistant.user.js
- https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/hubble-theme.user.css
- https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/check-in-summary-with-compensation-v2.user.css
- https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/hubble-smart-attendance-assistant.user.css

## Updates

Tampermonkey and Stylus auto-update from the `gh-pages` branch when they check for updates (enabled by default).

After merging to `main`, GitHub Actions builds and deploys to the `gh-pages` branch automatically.

## Development

```bash
npm install
npm run dev          # Vite HMR for check-in summary (script 1 only)
npm run dev:local    # Local install server + watch rebuild for all 6 artifacts
npm run build        # Production dist/*.user.js + dist/*.user.css
npm run build:local  # One-shot local build (localhost update URLs)
```

### Local testing (recommended for collaborators)

1. Run `npm run dev:local`
2. Open the install page: `http://localhost:5174/`
3. Install needed Tampermonkey + Stylus files from that page
4. Edit `src/` — saves auto-rebuild `dist/`
5. Reload Hubble (Tampermonkey: check for updates if script did not refresh)

**Share with teammates on same Wi‑Fi:** the install page also prints a LAN URL like `http://192.168.x.x:5174/`.

**Script 1 fast iteration:** use `npm run dev` for Vite HMR on the Svelte userscript while Hubble is open.

### Publish

1. Edit `src/userscript/`, `src/userscripts/`, or `src/styles/`
2. Bump `version` in `package.json`
3. Push to `main`

## Project layout

```
src/userscript/     Svelte + TypeScript (check-in summary)
src/userscripts/    Plain JS userscripts + shared theme switcher
src/styles/         CSS sources (Stylus userstyles)
dist/               Built artifacts (deployed to gh-pages branch)
```

## Cost

Free on a public GitHub repo — GitHub Actions have no charge for public projects.
