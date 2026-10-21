# Project listing revamp · prototype

A working prototype of Test Manager's project listing, revamped from Rajat's 12-point brief of 21 Oct 2026, then reworked the same day by his answers and 7 more changes (v2), and by 11 more (v3): three tabs attached to the platform top bar (Your Projects, For You, Archived) that each user can reorder, the test case listing inside each project, and a project switcher in the top bar. Built from the `design-context` repo: its tokens, component names and props, guidelines, page patterns, text guide and mock data.

**Live:** https://rajat-lt.github.io/project-listing-revamp-prototype/

**Spec:** [`project-listing-revamp.md`](project-listing-revamp.md), in the `design-context/patterns/` house format, as an amendment proposal for `patterns/project-listing.md`. It maps each brief point to components (§1, §1b for v2, §1c for v3), and records every conflict between the brief, the screenshots and the guidelines (§6, C1 to C28), the design decisions (§7), the copy (§8, and §8b for the drawer's changes from the product), the gaps found in design-context (§9), and the open questions (§10).

## Where to see each brief point

| # | Brief | Try it |
|---|---|---|
| 1 | A more useful listing | The whole page |
| 2 | Tabs under the top bar | Your Projects 7, For You, Archived 2, attached to the top bar. Each has its own URL: [`#/projects`](https://rajat-lt.github.io/project-listing-revamp-prototype/#/projects), [`#/for-you`](https://rajat-lt.github.io/project-listing-revamp-prototype/#/for-you), [`#/archived`](https://rajat-lt.github.io/project-listing-revamp-prototype/#/archived) |
| 3.1 | Test instances assigned to you | For You, **Test Instances**: status icon, title, `#TC-` ID, version, test run, configuration (or *Needs a configuration*), when it was assigned and by whom. Hover a cut title for the whole of it |
| 3.2 | Your next milestone | For You, **Milestones**: yours (you own it or created it), soonest first. Each project row also shows *Your next milestone* |
| 3.3 | Changes since your last visit | Removed in v2, for the PM to decide |
| 4 | Facts per project | Your Projects: name, tags, the test case count with its automated share, test runs, your next milestone, *Updated {when}*, *Created by {name}* |
| 5 | Recently used on top | Your Projects opens on your starred and recently used projects |
| 6 | Star a project | The star at the end of each row, or in each card's corner. Starred projects lead the list the next time the tab opens; a row never jumps away while you star it |
| 7 | List or grid, remembered | The two icons beside **Create Project**. Reload the page: your choice stays |
| 8 | Unassigned and unconfigured test instances | *Test instances: 12 unassigned · 4 need a configuration*. Each count is a link |
| 9 | Create a test run | **Create Test Run** on every project opens the product's drawer |
| 10 | Inactive since | Blog website: *Inactive since Jul 14, 2026.* (more than 90 days idle) |
| 11 | Ongoing actions | Hover *3 ongoing actions* on Web app for a moment, or press it. Close it with ×, Esc or a click outside |
| 12 | Archived, read-only | The Archived tab: TV app and Watch app, with no star, no Create Test Run and nothing that changes them. Open one: its test cases, read-only |

**v2, 21 Oct 2026**

| # | Change | Try it |
|---|---|---|
| v2 1 | Tabs attached to the top bar | The tab bar sits on the top bar's lower edge, full width, and stays put while the page scrolls |
| v2 2 | For You in two sides | On the left, **All Projects** and each project with test instances assigned to you, with its test instance and milestone counts. On the right, **Test Instances** and **Milestones** for the selection. Try [`#/for-you/ipad-app/milestones`](https://rajat-lt.github.io/project-listing-revamp-prototype/#/for-you/ipad-app/milestones): no milestone of yours there |
| v2 3 | *Since you last visited* removed | For You |
| v2 4 | The sort caption removed | Your Projects |
| v2 5 | Hover a list item, its title underlines | Any row, card, left-pane item or test case row. A click anywhere on it opens the item; the controls inside keep working |
| v2 6 | Icons, emails, full dates | The icons beside the two counts. Hover or tab to a name for the email, to a relative date for the full date and time |
| v2 7 | Show All | Under the list on Your Projects (reworked in v3, item 7) |

**v3, 21 Oct 2026**

| # | Change | Try it |
|---|---|---|
| v3 1 | The test case listing inside each project | Open any project, say [Web app](https://rajat-lt.github.io/project-listing-revamp-prototype/#/project/web-app): folders on the left, 20 test cases a page, search, the Tags filter, checkboxes, and pages with their own URLs. Test Runs and Milestones answer with a toast. [Internal HRMS](https://rajat-lt.github.io/project-listing-revamp-prototype/#/project/internal-hrms) has no test cases |
| v3 2 | A switcher by the project's name | Inside a project, the caret after its name in the top bar: *Recently used*, *Starred*, then *Other projects*, with a search field. Open another project and come back: it moves to *Recently used* |
| v3 3 | GitHub's switcher as inspiration | What was taken and what was not: spec §3.7 |
| v3 4 | Rest, hover and pressed states | Hover the project's name, then the caret; press each; open the panel |
| v3 5 | Ctrl or Cmd + click | On a project in the panel: it opens in a new tab and the panel stays open. A plain click switches here |
| v3 6 | The product's Create Test Run drawer | **Create Test Run** on any project: name, description, tags and type, as the product has them. Leave the name empty to see the error; the button stays active (spec C20) |
| v3 7 | Show All as a link | Under the list on Your Projects: it opens the whole list at [`#/projects/all`](https://rajat-lt.github.io/project-listing-revamp-prototype/#/projects/all) and is gone; Back returns. The whole list paginates at 20, so 7 projects fit one page |
| v3 8 | The product's icons, without the words | The two counts on every project: a file with a tick and a cross, and a route |
| v3 9 | *+1* opens the label group | Desktop website: *+1* after its three tags opens all four |
| v3 10 | Tabs in your own order | Drag a tab sideways, or right-click it (Shift + F10 from the keyboard) for **Move left**, **Move right** and **Reset tab order**. Reload: your order stays |
| v3 11 | Your Projects first | The default order. The page still opens on For You (spec question 17) |

Also: the **Created by** and **Tags** filters (pick several, then close the panel to apply; **Reset** clears) and the search, which look through every project.

## Review states

| State | Link |
|---|---|
| Loading | [`?state=loading`](https://rajat-lt.github.io/project-listing-revamp-prototype/?state=loading#/projects) |
| Error | [`?state=error`](https://rajat-lt.github.io/project-listing-revamp-prototype/?state=error#/projects) |
| Empty | [`?state=empty`](https://rajat-lt.github.io/project-listing-revamp-prototype/?state=empty#/projects) |
| Filtered to nothing | Search for *zzz* on Your Projects, or on a project's test cases |
| No milestones of yours | [`#/for-you/ipad-app/milestones`](https://rajat-lt.github.io/project-listing-revamp-prototype/#/for-you/ipad-app/milestones) |
| A project, loading or failed | [`?state=loading`](https://rajat-lt.github.io/project-listing-revamp-prototype/?state=loading#/project/web-app) and [`?state=error`](https://rajat-lt.github.io/project-listing-revamp-prototype/?state=error#/project/web-app) inside Web app; open the switcher too |
| A project with no test cases | [Internal HRMS](https://rajat-lt.github.io/project-listing-revamp-prototype/#/project/internal-hrms) |

Each `?state=` applies to all three tabs and to the project pages; switch tabs to see each one.

## Remembered, and what resets

- **Per user, in this browser:** the list or grid choice, your stars and your tab order, under the signed-in user's ID (Ritika Sharma). The product would keep them on the account (spec §4.7). Clear the site's data to start fresh, or use **Reset tab order** in a tab's menu.
- **Until a reload:** visits made by opening a project, the search and filters, selected test cases, and test runs created in the drawer.

## Simulated in this prototype

- **Every destination not built here** (a test case, Add Test Case, a project's Test Runs and Milestones, a test instance, a milestone, the filtered test instance list, the Actions tab, Create Project, the top bar's Credits, Recent Tests, Announcements and Upgrade Now) shows a toast naming where it leads. A project's name opens its test case listing, which is built.
- **Create Test Run** creates nothing outside the page: the run joins the project's count until a reload.
- **The notifications bell** opens the [notification center prototype](https://rajat-lt.github.io/notification-center-prototype/) in a new tab.
- **Time stands still** at Oct 21, 2026, 10:30 AM, so every relative date reads the same on every visit.
- **The test cases are dummy data** (v3 item 1): as many as each project's count, with titles from `mock-data.md`'s lists, so titles repeat. The ones assigned to you in For You come first, under their own IDs.

## How it is built from design-context

- **Tokens:** `scripts/tokens.mjs` reads `data/tokens.json` from design-context's `main` branch and writes `src/tokens.css`. Every variable names its token path, and the script stops if a token is missing. The current file holds 104 tokens from `main` at `e014a73`.
- **Components:** each one is a look-alike of the private `lt-components` library under its real name, styled from the tokens and used as `guidelines/` says. The spec uses only props documented in `COMPONENTS.md`; the props the look-alikes take beyond it are listed in the spec's §9, from an audit against `data/components.json`. Shapes the manifest leaves undocumented (`navs`, `items`, `listItems`, `options`) are marked TBD in the spec.
- **Layout, copy and data:** `patterns/project-listing.md` is the base, with the shell from `patterns/topbar.md` and `patterns/platform-sidebar.md`, the attached tabs, the two panes and the test case listing from `patterns/test-entity-listing.md`, and reordering from `patterns/module-details.md`. `ux-text-guidelines.md` governs every string. `mock-data.md` supplies the projects, cast, test case and test run names, configurations, formats and IDs, and everything it lacks is listed in the spec's §9. The ongoing actions and the folder names follow Rajat's `project-actions-listing.md`.
- **Icons:** lucide-react **1.58.0**, the library `icons.md` names, and only icon names confirmed present in that version. All 42 used: Accessibility, ArrowLeft, ArrowRight, Bell, Bot, ChartColumn, Check, ChevronDown, ChevronRight, CircleAlert, CircleCheck, CircleHelp, CircleSlash, ClipboardList, Clock, Coins, Ellipsis, Flag, Globe, House, Info, KeyRound, LayoutGrid, List, ListTodo, LoaderCircle, Megaphone, Minus, Monitor, RotateCcw, Route, ScanEye, Search, Settings, Smartphone, SquareTerminal, Star, TestTubes, TriangleAlert, Workflow, X, Zap. The status icons are drawn to `mock-data.md`'s description of the Status component. The test run icon is `Route`, flipped vertically, as the product shows it; the test case icon, a file with a tick and a cross, has no lucide match and is drawn on lucide's grid (`TestCaseIcon` in `src/lt.jsx`, spec C26). The platform sidebar's icons are placeholders chosen by intent, since design-context names none.

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
| `src/lt.jsx`, `src/overlays.jsx` | The LT component look-alikes, including `LTSelectPanel`, `LTPopover`, `LTTabNav`, `LTNavList`, `LTDrawer`, `LTActionMenu`, `LTAnchoredOverlay`, `LTPagination`, `LTCheckbox`, `LTRadioGroup` and the form fields; and the test case and test run icons |
| `src/shell.jsx` | Platform sidebar and top bar, with the breadcrumb inside a project |
| `src/switcher.jsx` | The project crumb and its switcher (v3 items 2 to 5) |
| `src/tabbar.jsx` | The page's tabs in each user's order: drag and the tab's menu (v3 items 10 and 11) |
| `src/App.jsx` | The routes, the per-user settings, visits, the switcher's groups, the drawer and the demo states |
| `src/foryou.jsx` | For You (brief 3; v2 item 2) |
| `src/projects.jsx` | Your Projects and Archived (brief 4 to 12; v2 items 4 to 7; v3 items 7 to 9) |
| `src/projectpage.jsx` | The test case listing inside a project (v3 item 1) |
| `src/createrun.jsx` | The Create Test Run drawer (answer 9; v3 item 6) |
| `src/data.js`, `src/format.js` | Mock data, including the dummy test cases, and the `mock-data.md` formats |
