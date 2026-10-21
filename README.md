# Project listing revamp · prototype

A working prototype of Test Manager's project listing, revamped from Rajat's 12-point brief of 21 Oct 2026, then reworked the same day by his answers and 7 more changes (v2): three tabs attached to the platform top bar (For You, Your Projects, Archived), built from the `design-context` repo: its tokens, component names and props, guidelines, page patterns, text guide and mock data.

**Live:** https://rajat-lt.github.io/project-listing-revamp-prototype/

**Spec:** [`project-listing-revamp.md`](project-listing-revamp.md), in the `design-context/patterns/` house format, as an amendment proposal for `patterns/project-listing.md`. It maps each brief point to components (§1, and §1b for v2), and records every conflict between the brief and the guidelines (§6, C1 to C18), the design decisions (§7), the copy (§8), the gaps found in design-context (§9), and the open questions (§10).

## Where to see each brief point

| # | Brief | Try it |
|---|---|---|
| 1 | A more useful listing | The whole page |
| 2 | Tabs under the top bar | For You, Your Projects 7, Archived 2, attached to the top bar. Each has its own URL: [`#/for-you`](https://rajat-lt.github.io/project-listing-revamp-prototype/#/for-you), [`#/projects`](https://rajat-lt.github.io/project-listing-revamp-prototype/#/projects), [`#/archived`](https://rajat-lt.github.io/project-listing-revamp-prototype/#/archived) |
| 3.1 | Test instances assigned to you | For You, **Test Instances**: status icon, title, `#TC-` ID, version, test run, configuration (or *Needs a configuration*), when it was assigned and by whom. Hover a cut title for the whole of it |
| 3.2 | Your next milestone | For You, **Milestones**: yours (you own it or created it), soonest first. Each project row also shows *Your next milestone* |
| 3.3 | Changes since your last visit | Removed in v2, for the PM to decide |
| 4 | Facts per project | Your Projects: name, tags, *1.24k test cases (62% automated)*, test runs, your next milestone, *Updated {when}*, *Created by {name}* |
| 5 | Recently used on top | Your Projects opens on your starred and recently used projects |
| 6 | Star a project | The star at the end of each row, or in each card's corner. Starred projects lead the list the next time the tab opens; a row never jumps away while you star it |
| 7 | List or grid, remembered | The two icons beside **Create Project**. Reload the page: your choice stays |
| 8 | Unassigned and unconfigured test instances | *Test instances: 12 unassigned · 4 need a configuration*. Each count is a link |
| 9 | Create a test run | **Create Test Run** on every project opens a drawer (see the note below) |
| 10 | Inactive since | Blog website: *Inactive since Jul 14, 2026.* (more than 90 days idle) |
| 11 | Ongoing actions | Hover *3 ongoing actions* on Web app for a moment, or press it. Close it with ×, Esc or a click outside |
| 12 | Archived, read-only | The Archived tab: TV app and Watch app, with no star, no Create Test Run and nothing that changes them |

**v2, 21 Oct 2026**

| # | Change | Try it |
|---|---|---|
| v2 1 | Tabs attached to the top bar | The tab bar sits on the top bar's lower edge, full width, and stays put while the page scrolls |
| v2 2 | For You in two sides | On the left, **All Projects** and each project with test instances assigned to you, with its test instance and milestone counts. On the right, **Test Instances** and **Milestones** for the selection. Try [`#/for-you/ipad-app/milestones`](https://rajat-lt.github.io/project-listing-revamp-prototype/#/for-you/ipad-app/milestones): no milestone of yours there |
| v2 3 | *Since you last visited* removed | For You |
| v2 4 | The sort caption removed | Your Projects |
| v2 5 | Hover a list item, its title underlines | Any row, card or left-pane item. A click anywhere on it opens the item; the controls inside keep working |
| v2 6 | Icons, emails, full dates | The icons beside the test case and test run counts. Hover or tab to a name for the email, to a relative date for the full date and time |
| v2 7 | Show All | Under the list on Your Projects: **Show All**, then **Show Less** |

Also: the **Created by** and **Tags** filters (pick several, then close the panel to apply; **Reset** clears) and the search, which look through every project.

**The Create Test Run drawer is provisional.** Rajat's screenshot of the product's drawer did not come through, so the drawer has the fields LambdaTest's docs list for a new test run: name (required), description and tags, then **Create Test Run**. Leave the name empty to see the error; a created run joins the project's count.

## Review states

| State | Link |
|---|---|
| Loading | [`?state=loading`](https://rajat-lt.github.io/project-listing-revamp-prototype/?state=loading#/projects) |
| Error | [`?state=error`](https://rajat-lt.github.io/project-listing-revamp-prototype/?state=error#/projects) |
| Empty | [`?state=empty`](https://rajat-lt.github.io/project-listing-revamp-prototype/?state=empty#/projects) |
| Filtered to nothing | Search for *zzz* on Your Projects |
| No milestones of yours | [`#/for-you/ipad-app/milestones`](https://rajat-lt.github.io/project-listing-revamp-prototype/#/for-you/ipad-app/milestones) |

Each `?state=` applies to all three tabs; switch tabs to see each one.

## Remembered, and what resets

- **Per user, in this browser:** the list or grid choice and your stars, under the signed-in user's ID (Ritika Sharma). The product would keep them on the account (spec §4.7). Clear the site's data to start fresh.
- **Until a reload:** visits made by opening a project, Show All, the search and filters, and test runs created in the drawer.

## Simulated in this prototype

- **Every destination outside this page** (a project, a test instance, a milestone, the filtered test instance list, the Actions tab, Create Project, the top bar's Credits, Recent Tests, Announcements and Upgrade Now) shows a toast naming where it leads.
- **Create Test Run** creates nothing outside the page: the run joins the project's count until a reload.
- **The notifications bell** opens the [notification center prototype](https://rajat-lt.github.io/notification-center-prototype/) in a new tab.
- **Time stands still** at Oct 21, 2026, 10:30 AM, so every relative date reads the same on every visit.

## How it is built from design-context

- **Tokens:** `scripts/tokens.mjs` reads `data/tokens.json` from design-context's `main` branch and writes `src/tokens.css`. Every variable names its token path, and the script stops if a token is missing. The current file holds 104 tokens from `main` at `e014a73`.
- **Components:** each one is a look-alike of the private `lt-components` library under its real name, using only props documented in `COMPONENTS.md`, styled from the tokens and used as `guidelines/` says. Shapes the manifest leaves undocumented (`navs`, `items`, `listItems`, `options`) are marked TBD in the spec.
- **Layout, copy and data:** `patterns/project-listing.md` is the base, with the shell from `patterns/topbar.md` and `patterns/platform-sidebar.md`, and the attached tabs and the two panes from `patterns/test-entity-listing.md`. `ux-text-guidelines.md` governs every string. `mock-data.md` supplies the projects, cast, test case and test run names, configurations, formats and IDs, and everything it lacks is listed in the spec's §9. The ongoing actions follow Rajat's `project-actions-listing.md`.
- **Icons:** lucide-react **1.58.0**, the library `icons.md` names, and only icon names confirmed present in that version. All 39 used: Accessibility, Bell, Bot, ChartColumn, Check, ChevronDown, ChevronRight, CircleAlert, CircleCheck, CircleHelp, CirclePlay, CircleSlash, ClipboardList, Clock, Coins, Ellipsis, FileText, Flag, Globe, House, Info, KeyRound, LayoutGrid, List, ListTodo, LoaderCircle, Megaphone, Monitor, ScanEye, Search, Settings, Smartphone, SquareTerminal, Star, TestTubes, TriangleAlert, Workflow, X, Zap. The status icons are drawn to `mock-data.md`'s description of the Status component. The platform sidebar's icons, and `FileText` and `CirclePlay` for test cases and test runs, are placeholders chosen by intent, since design-context names none.

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
| `src/lt.jsx`, `src/overlays.jsx` | The LT component look-alikes, including `LTSelectPanel`, `LTPopover`, `LTTabNav`, `LTNavList`, `LTDrawer` and the form fields |
| `src/shell.jsx` | Platform sidebar and top bar |
| `src/App.jsx` | The tabs, their URLs, the per-user settings, visits, the drawer and the demo states |
| `src/foryou.jsx` | For You (brief 3; v2 item 2) |
| `src/projects.jsx` | Your Projects and Archived (brief 4 to 12; v2 items 4 to 7) |
| `src/createrun.jsx` | The Create Test Run drawer (answer 9) |
| `src/data.js`, `src/format.js` | Mock data and the `mock-data.md` formats |
