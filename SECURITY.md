# Security Policy

## What this project does (and doesn't do)

These are userscripts/userstyles that run inside your browser on [hubble.mallow-tech.com](https://hubble.mallow-tech.com). They:

- Only run on Hubble pages (see each script's `@match`).
- Only talk to Hubble itself — they read/re-style data already on the page, or intercept requests Hubble's own frontend makes to Hubble's own API. No third-party endpoints, no analytics, no telemetry.
- Store only a theme preference in `localStorage` (`hubble-theme`), on your own machine. No data is collected, transmitted elsewhere, or persisted server-side by this project.

## Reporting a vulnerability

If you find something that could let a Hubble page (or a third party) do more than it should through these scripts — e.g. XSS via unescaped data, a way to exfiltrate data, or a userscript permission (`@grant`) that's broader than it needs to be — please report it privately via a [GitHub security advisory](../../security/advisories/new) rather than a public issue, so it can be fixed before details are public.

For anything that isn't security-sensitive (bugs, styling glitches, feature requests), a regular [GitHub issue](../../issues) is fine.
