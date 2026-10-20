# Project listing revamp · prototype

A working prototype of Test Manager's project listing, revamped from Rajat's 12-point brief of 21 Oct 2026: three tabs under the platform top bar (For You, Your Projects, Archived), built from the `design-context` repo: its tokens, component names and props, guidelines, page patterns, text guide and mock data.

**Live:** https://rajat-lt.github.io/project-listing-revamp-prototype/

**Spec:** [`project-listing-revamp.md`](project-listing-revamp.md), in the `design-context/patterns/` house format, as an amendment proposal for `patterns/project-listing.md`. It maps each brief point to components, and records every conflict between the brief and the guidelines (§6, C1 to C12), the design decisions (§7), the copy (§8), the gaps found in design-context (§9), and the open questions (§10).

## Where to see each brief point

| # | Brief | Try it |
|---|---|---|
| 1 | A more useful listing | The whole page |
| 2 | Tabs under the top bar | For You, Your Projects 7, Archived 2. Each has its own URL: [`#/for-you`](https://rajat-lt.github.io/project-listing-revamp-prototype/#/for-you), [`#/projects`](https://rajat-lt.github.io/project-listing-revamp-prototype/#/projects), [`#/archived`](https://rajat-lt.github.io/project-listing-revamp-prototype/#/archived) |
| 3.1 | Test instances assigned to you | For You, *Assigned to you*: 16 test instances grouped by project. Each row: status icon, title, `#TC-` ID, version, test run, configuration (or *Needs a configuration*), *Assigned {when}* and who assigned it. Hover a cut title for the whole of it |
| 3.2 | Your next milestone | For You, right column: *UAT Round 2 · 2 days left · Oct 23, 2026* |
| 3.3 | Changes since your last visit | For You, *Since you last visited*: each project you visited, its change count and when you visited |
| 4 | Facts per project | Your Projects: name, tags, *1.24k test cases (62% automated)*, test runs, your next milestone, *Updated {when}*, *Created by {name}* |
| 5 | Recently used on top | Your Projects, *Recently used*. Open any project by its name: it moves to the front, and in For You its count starts again at 0 |
| 6 | Star a project | The star at the end of each row, or in each card's corner. Starred projects lead the list the next time the tab opens; a row never jumps away while you star it |
| 7 | List or grid, remembered | The two icons beside **Create Project**. Reload the page: your choice stays |
| 8 | Unassigned and unconfigured test instances | *Test instances: 12 unassigned · 4 need a configuration*. Each count is a link |
| 9 | Create a test run | **Create Test Run** on every project |
| 10 | Inactive since | Blog website: *Inactive since Jul 14, 2026.* |
| 11 | Ongoing actions | Hover *3 ongoing actions* on Web app for a moment, or press it. Close it with ×, Esc or a click outside |
| 12 | Archived, read-only | The Archived tab: TV app and Watch app, with no star, no Create Test Run and nothing that changes them |

Also: the **Created by** and **Tags** filters (pick several, then close the panel to apply; **Reset** clears), and the search. While either is applied, *Recently used* steps aside.

## Review states

| State | Link |
|---|---|
| Loading | [`?state=loading`](https://rajat-lt.github.io/project-listing-revamp-prototype/?state=loading#/projects) |
| Error | [`?state=error`](https://rajat-lt.github.io/project-listing-revamp-prototype/?state=error#/projects) |
| Empty | [`?state=empty`](https://rajat-lt.github.io/project-listing-revamp-prototype/?state=empty#/projects) |
| Filtered to nothing | Search for *zzz* on Your Projects |

Each state applies to all three tabs; switch tabs to see each one.

## Remembered, and what resets

- **Per user, in this browser:** the list or grid choice and your stars, under the signed-in user's ID (Ritika Sharma). The product would keep them on the account (spec §4.7). Clear the site's data to start fresh.
- **Until a reload:** visits made by opening a project, and the search and filters.

## Simulated in this prototype

- **Every destination outside this page** (a project, a test instance, a milestone, the filtered test instance list, the Actions tab, Create Project, Create Test Run, the top bar's Credits, Recent Tests, Announcements and Upgrade Now) shows a toast naming where it leads.
- **The notifications bell** opens the [notification center prototype](https://rajat-lt.github.io/notification-center-prototype/) in a new tab.
- **Time stands still** at Oct 21, 2026, 10:30 AM, so every relative date reads the same on every visit.

## How it is built from design-context

- **Tokens:** `scripts/tokens.mjs` reads `data/tokens.json` from design-context's `main` branch and writes `src/tokens.css`. Every variable names its token path, and the script stops if a token is missing. The current file holds 104 tokens from `main` at `e014a73`.
- **Components:** each one is a look-alike of the private `lt-components` library under its real name, using only props documented in `COMPONENTS.md`, styled from the tokens and used as `guidelines/` says. Shapes the manifest leaves undocumented (`navs`, `options`) are marked TBD in the spec.
- **Layout, copy and data:** `patterns/project-listing.md` is the base, with the shell from `patterns/topbar.md` and `patterns/platform-sidebar.md`. `ux-text-guidelines.md` governs every string. `mock-data.md` supplies the projects, cast, test case and test run names, configurations, formats and IDs, and everything it lacks is listed in the spec's §9. The ongoing actions follow Rajat's `project-actions-listing.md`.
- **Icons:** lucide-react **1.58.0**, the library `icons.md` names, and only icon names confirmed present in that version. All 37 used: Accessibility, Bell, Bot, ChartColumn, Check, ChevronDown, ChevronRight, CircleAlert, CircleCheck, CircleHelp, CircleSlash, ClipboardList, Clock, Coins, Ellipsis, Flag, Globe, House, Info, KeyRound, LayoutGrid, List, ListTodo, LoaderCircle, Megaphone, Monitor, ScanEye, Search, Settings, Smartphone, SquareTerminal, Star, TestTubes, TriangleAlert, Workflow, X, Zap. The status icons are drawn to `mock-data.md`'s description of the Status component, and the platform sidebar's icons are placeholders chosen by intent, since `patterns/platform-sidebar.md` names none.

## Run it

```bash
npm install
npm run dev
```

To regenerate the tokens, with a design-context checkout beside this folder (or set `DESIGN_CONTEXT`):

```bash
npm run tokens
```

Build for GitHub Pages with `npm run build`; the site is served from the `gh-pages` branch.

## Files

| Path | What it holds |
|---|---|
| `project-listing-revamp.md` | The spec |
| `scripts/tokens.mjs`, `src/tokens.css` | Token generator and its output |
| `src/lt.jsx`, `src/overlays.jsx` | The LT component look-alikes, including `LTSelectPanel` and `LTPopover` |
| `src/shell.jsx` | Platform sidebar and top bar |
| `src/App.jsx` | The tabs, their URLs, the per-user settings, visits and the demo states |
| `src/foryou.jsx` | For You (brief 3) |
| `src/projects.jsx` | Your Projects and Archived (brief 4 to 12) |
| `src/data.js`, `src/format.js` | Mock data and the `mock-data.md` formats |
