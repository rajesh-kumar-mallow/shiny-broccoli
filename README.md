# Hubble Userscripts (shiny-broccoli)

Userscript + Stylus extensions for [Hubble](https://hubble.mallow-tech.com): work log summary, checkout hover helper, smart attendance assistant, profile settings, and a shared Dracula theme with System/Dark/Light/Ayu Mirage switching.

## Install

### 0. Get the two browser extensions first

These `.user.js` / `.user.css` files don't do anything by themselves — you need a manager extension installed for each:

| Extension                                                                                                                                                       | Runs                      |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| A userscript manager — [Tampermonkey](https://www.tampermonkey.net/), [ScriptCat](https://scriptcat.org/), or [Violentmonkey](https://violentmonkey.github.io/) | `*.user.js` (userscripts) |
| [Stylus](https://github.com/openstyles/stylus)                                                                                                                  | `*.user.css` (userstyles) |

### 1. Pick the features you want

Each row is a bundle — install **everything in that row together**. A userscript installed without its matching userstyle (or vice versa) will look broken or do nothing, since the script renders the markup and the style makes it match the Dracula theme. The theme row is the shared base every other feature builds on, so install it no matter which features you pick below.

Clicking a `.user.js`/`.user.css` link below opens it directly — any userscript manager (Tampermonkey, ScriptCat, Violentmonkey) intercepts that navigation and offers to install it.

| Feature                                         | Userscript                                                                                                                                                           | Userstyle                                                                                                                                                                         |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Dracula theme** — always install this         | [Hubble Dracula Theme Host](https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/hubble-theme-host.user.js)                                 | [Hubble Dracula Theme](https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/hubble-theme.user.css)                                                       |
| Work log summary (check-in card + compensation) | [Check-in summary with compensation V2](https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/check-in-summary-with-compensation-v2.user.js) | Theme (above) **+** [Work log summary styles](https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/check-in-summary-with-compensation-v2.user.css)       |
| Checkout hover tooltips                         | [Hubble Checkout Hover Helper](https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/hubble-checkout-hover-helper.user.js)                   | Theme (above) only — no extra userstyle needed                                                                                                                                    |
| Smart attendance widget                         | [Hubble Smart Attendance Assistant](https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/hubble-smart-attendance-assistant.user.js)         | Theme (above) **+** [Smart Attendance Assistant styles](https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/hubble-smart-attendance-assistant.user.css) |
| Profile settings (theme switcher entry)         | [Hubble Profile Settings](https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/hubble-profile-settings.user.js)                             | Theme (above) **+** [Profile Settings styles](https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/hubble-profile-settings.user.css)                     |

Theme switching lives in the **User Config** entry added to the sidebar on any `/users/:id/*` page (e.g. your own profile) — click it to open a settings modal with System/Dark/Light/Ayu Mirage. Choice is saved in `localStorage` (`hubble-theme`) and applied on every Hubble page via the theme host script, so you only need the "Profile settings" row installed to _change_ the theme, not to have it _apply_.

## Raw URLs (auto-update)

- https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/hubble-theme-host.user.js
- https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/check-in-summary-with-compensation-v2.user.js
- https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/hubble-checkout-hover-helper.user.js
- https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/hubble-smart-attendance-assistant.user.js
- https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/hubble-profile-settings.user.js
- https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/hubble-theme.user.css
- https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/check-in-summary-with-compensation-v2.user.css
- https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/hubble-smart-attendance-assistant.user.css
- https://raw.githubusercontent.com/rajesh-kumar-mallow/shiny-broccoli/gh-pages/hubble-profile-settings.user.css

## Updates

Your userscript manager and Stylus auto-update from the `gh-pages` branch when they check for updates (enabled by default). Update detection is driven entirely by the `@version` header — all 5 userscripts share the single `version` in `package.json`, so **bumping `package.json`'s version is what makes existing installs notice an update.** Pushing to `main` without a version bump still redeploys `gh-pages`, but installed users won't be prompted to refresh.

After merging to `main`, GitHub Actions:

1. Builds and deploys `dist/` to the `gh-pages` branch (this is what your userscript manager/Stylus actually poll).
2. Publishes a [GitHub Release](releases) tagged `v<version>` with the built `.user.js`/`.user.css` files attached and auto-generated release notes — skipped if a release for the current version already exists, so pushes without a version bump don't create duplicates.

## Development

```bash
npm install
npm run dev          # Vite HMR for check-in summary (script 1 only)
npm run dev:local    # Local install server + watch rebuild for all artifacts
npm run build        # Production dist/*.user.js + dist/*.user.css
npm run build:local  # One-shot local build (localhost update URLs)
```

### Local testing (recommended for collaborators)

1. Run `npm run dev:local`
2. Open the install page: `http://localhost:5174/`
3. Install needed userscript + Stylus files from that page
4. Edit `src/` — saves auto-rebuild `dist/`
5. Reload Hubble (check for updates in your userscript manager if the script didn't refresh)

**Share with teammates on same Wi‑Fi:** the install page also prints a LAN URL like `http://192.168.x.x:5174/`.

**Script 1 fast iteration:** use `npm run dev` for Vite HMR on the `WorkLogSummary.tsx` userscript while Hubble is open.

### Publish

1. Edit `src/` or `src/styles/`
2. Bump `version` in `package.json`
3. Push to `main`

## Project layout

```
src/                Preact + TypeScript userscripts (WorkLogSummary, CheckoutHoverHelper, SmartAttendanceAssistant, ProfileSettings, theme-host)
src/lib/            Work-log-summary business logic
src/components/     Shared Preact components (Icon, MonthPicker)
src/shared/         Shared across all userscripts (theme switcher, timeline theme, constants)
src/styles/         CSS sources (Stylus userstyles)
dist/               Built artifacts (deployed to gh-pages branch)
```

## Cost

Free on a public GitHub repo — GitHub Actions have no charge for public projects.
