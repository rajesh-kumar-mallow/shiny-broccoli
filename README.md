# Hubble Userscripts (shiny-broccoli)

Tampermonkey + Stylus extensions for [Hubble](https://hubble.mallow-tech.com): work log summary, checkout hover helper, smart attendance assistant, and a shared Dracula theme with system/dark/light switching.

## Install

### 0. Get the two browser extensions first

These `.user.js` / `.user.css` files don't do anything by themselves — you need a manager extension installed for each:

| Extension                                      | Runs                      |
| ---------------------------------------------- | ------------------------- |
| [Tampermonkey](https://www.tampermonkey.net/)  | `*.user.js` (userscripts) |
| [Stylus](https://github.com/openstyles/stylus) | `*.user.css` (userstyles) |

### 1. Pick the features you want

Each row is a bundle — install **everything in that row together**. A userscript installed without its matching userstyle (or vice versa) will look broken or do nothing, since the script renders the markup and the style makes it match the Dracula theme. The theme row is the shared base every other feature builds on, so install it no matter which features you pick below.

| Feature                                         | Tampermonkey (userscript)                                                                                                                                                                                                     | Stylus (userstyle)                                                                                                                                                                |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Dracula theme** — always install this         | [Hubble Dracula Theme Host](https://www.tampermonkey.net/script_installation.php#url=https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/hubble-theme-host.user.js)                                 | [Hubble Dracula Theme](https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/hubble-theme.user.css)                                                       |
| Work log summary (check-in card + compensation) | [Check-in summary with compensation V2](https://www.tampermonkey.net/script_installation.php#url=https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/check-in-summary-with-compensation-v2.user.js) | Theme (above) **+** [Work log summary styles](https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/check-in-summary-with-compensation-v2.user.css)       |
| Checkout hover tooltips                         | [Hubble Checkout Hover Helper](https://www.tampermonkey.net/script_installation.php#url=https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/hubble-checkout-hover-helper.user.js)                   | Theme (above) only — no extra userstyle needed                                                                                                                                    |
| Smart attendance widget                         | [Hubble Smart Attendance Assistant](https://www.tampermonkey.net/script_installation.php#url=https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/hubble-smart-attendance-assistant.user.js)         | Theme (above) **+** [Smart Attendance Assistant styles](https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/hubble-smart-attendance-assistant.user.css) |

A floating **Auto / Dark / Light** theme switcher appears once `hubble-theme-host.user.js` (or any other userscript here, since they all bundle the switcher) is active. Choice is saved in `localStorage` (`hubble-theme`).

## Raw URLs (auto-update)

- https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/hubble-theme-host.user.js
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
src/userscript/     Preact + TypeScript (check-in summary)
src/userscripts/    Preact + TypeScript userscripts + shared theme switcher
src/styles/         CSS sources (Stylus userstyles)
dist/               Built artifacts (deployed to gh-pages branch)
```

## Cost

Free on a public GitHub repo — GitHub Actions have no charge for public projects.
