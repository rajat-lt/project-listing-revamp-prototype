# Project listing revamp: For You, Your Projects, Archived

Test Manager's project listing page, revamped from Rajat's brief of 21 Oct 2026 (12 points), then reworked the same day by his answers to the open questions and 7 more changes (v2, §1b), and again by 11 more (v3, §1c): the test case listing inside each project, a project switcher in the top bar, tabs each user can reorder, and the product's own Create Test Run drawer. On 22 Oct 2026, after Rajat's review with the PM, 8 more (v4, §1d): Create Test Run, the automated share and the count of test instances that need a configuration leave the project rows and cards, what needs you becomes one line split by middle dots, one ongoing action changes, the rows and cards are re-laid, and the toolbar takes the product's own buttons, with Create Project as a split button. Written in the `design-context/patterns/` house format, as an amendment proposal for `patterns/project-listing.md`. The working prototype in this repo implements it.

Precedence, as the house workflow sets it: **Rajat's brief > design-context guidelines > screenshots**. The first two rounds came without screenshots (v2's answer 9 mentions one that did not arrive). v3 came with four: GitHub's *Switch repository* panel (inspiration only, v3 item 3), the product's Create Test Run drawer, the product's test case and test run icons, and a v2 project row showing what they replace. v4 came with two: the product's toolbar (*Owners*, *Tags*, *Products 1* and *Create Project* with its menu open on *Import data*), and the v3 row's line of what needs you. Every conflict between the brief, a screenshot and the guidelines is recorded in §6, never resolved silently.

Sources, all read from `design-context` `main` (`e014a73`) on 21 Oct 2026, and rechecked on 22 Oct 2026 at `618b4b8`, where only illustration-kit files had changed; v4 added `guidelines/ltbuttongroup.md` and two tokens (`btn.primary.selectedBg`, `btn.primary.border`): `ux-persona.md`, `ux-text-guidelines.md`, `guidelines/README.md` and the component files (`ltunderlinenav.md`, `ltsegmentedcontrol.md`, `ltinlinemessage.md`, `notification-messaging.md`, `ltpopover.md`, `lttooltip.md`, `lttag.md`, `ltlabelgroup.md`, `ltcounterlabel.md`, `ltprogressbar.md`, `ltpagination.md`, `lticonbutton.md`, `ltlink.md`, `ltbutton.md`, `ltactionmenu.md`, `ltselectpanel.md`, `ltinputbox.md`, `lttextarea.md`, `ltflash.md`, `ltmodal.md`, `ltbuttongroup.md`, and for v3 `ltbreadcrumbs.md`, `ltcheckbox.md` and `ltradiogroup.md`), `patterns/project-listing.md` (the base), `patterns/topbar.md`, `patterns/platform-sidebar.md`, `patterns/test-entity-listing.md` (the attached tabs and the two panes of v2; the test case listing of v3), `patterns/test-instance-details.md`, `patterns/smartui-build-screenshots.md` (the list and grid precedent), `patterns/module-details.md` (reordering, v3), `patterns/manual-test-case-summary.md` (the tags field, v3), `COMPONENTS.md`, `data/components.json` (the prop audit, §9), `mock-data.md`, `icons.md` and `data/tokens.json`. Outside the repo: Rajat's own `project-actions/project-actions-listing.md` (11 Sep 2026), the house definition of a project's long-running operations, and the source of the folder names; the notification-center prototype, whose Test Manager top bar and `LTTabNav` look this page reuses; the automation details prototype, whose name and date tooltips (its C1) and tab reordering (its v2 item 1) it reuses; LambdaTest's docs page *Test Run - Creation and Management* (read 21 Oct 2026, last updated Oct 15, 2026); and Primer's LabelGroup page (primer.style, read 21 Oct 2026), the precedent for the *+{n}* overflow.

Every component and prop below was read from `COMPONENTS.md`. Structured prop shapes the manifest leaves undocumented are marked `TBD` with the story that shows them. Props the prototype's look-alikes take beyond the manifest are listed in §9. Proposals carry **[proposed]**.

---

## 1. What this page is

The entry point to Test Manager, still with no project selected. Today it is one list of projects (`patterns/project-listing.md`). The revamp turns it into three views, each with its own URL, under tabs attached to the top bar, in an order each user can change (v3 item 10):

| Tab, in the default order (v3 item 11) | Answers | Brief |
|---|---|---|
| **Your Projects** | Which project do I open, and which one needs attention? | 2, 4 to 11; v2 4 to 7; v3 7 to 9; v4 1 to 7 |
| **For You** (where the page opens, answer 1) | What is assigned to me, and which milestones are mine? | 2, 3; v2 2 |
| **Archived** | Where did the old projects go? | 2, 12 |

Opening a project leads to its test case listing (v3 item 1, §3.6), where the top bar's project name carries a switcher to every other project (v3 items 2 to 5, §3.7).

Brief point by point (21 Oct 2026, first round):

| # | Brief | Where it lands |
|---|---|---|
| 1 | Revamp, more useful | The whole page |
| 2 | Tabs below the top bar: For You, Your Projects, Archived | `LTUnderlineNav`, page-primary, one URL per tab, attached to the top bar (C1, C2, C17), in each user's order (v3 items 10 and 11) |
| 3.1 | Test instances assigned to me: test case ID, version, test run, configuration if any, assigned by, assigned date, status icon | For You, **Test Instances** tab |
| 3.2 | My next milestone, if any | For You, **Milestones** tab, soonest first; and *Your next milestone* on each project |
| 3.3 | Changes since my last visit, as a count | Removed by v2 item 3 |
| 4 | Per project: name, tags, test case count (automated percentage), test run count, my next milestone, last updated, creator | Project row and card. The automated percentage left both views in v4 (item 4) |
| 5 | Recently used projects on top | Your Projects opens on your recently used and starred projects (v2 item 7) |
| 6 | Star a project | Star toggle on every active project; starred projects lead the list |
| 7 | List or grid, remembered per user | `LTSegmentedControl`, icon-only, stored per user |
| 8 | Unassigned test instances and test instances without a configuration, per project | *Test instances: 12 unassigned*, in the line of what needs you. The count that needs a configuration left in v4 (item 3, C6) |
| 9 | Create a test run from each project | Removed by v4 item 1. It was **Create Test Run** on every active project, opening the product's drawer (answer 9, v3 item 6, C15) |
| 10 | *Inactive since* inline message | `LTInlineMessage` `info` on a project idle for more than 90 days (C4) |
| 11 | Ongoing operations count, list on hover | *3 ongoing actions*, opening an `LTPopover` (C3, C5, C12) |
| 12 | Archived projects, read-only | Archived tab; each opens its test case listing, read-only |

## 1b. v2, 21 Oct 2026: answers and seven changes

Rajat's answers to §10's first ten questions, binding from now on:

| # | Question | Answer | What changed |
|---|---|---|---|
| 1 | Default tab | For You | Nothing; already so. v3 item 11 puts Your Projects first in the order, and the page still opens on For You (question 17) |
| 2 | What counts as a change since your last visit | Only other people's | Recorded; the section itself went with item 3 below |
| 3 | Owner and creator the same person | Yes, for now | *Created by* stays on the row and the filter (C7 resolved). v4 item 7 names the filter *Owners*, as the product does (C30) |
| 4 | Inactive projects: inform or ask | Simply inform; no Archive decision; 90 days | The threshold moved from 30 to 90 days (C4 resolved) |
| 5 | Products filter and row menu | Leave them for now | Left out (C9). v4 item 7 brings the Products filter back, and Create Project's caret back as a split button; the row menu stays out (C31, C32) |
| 6 | Whose milestones are yours | The ones you own or created | §4.3, *Your next milestone* and the Milestones tab use this rule |
| 7 | Starred order | Starred projects first | Kept |
| 8 | Restoring archived projects | Forget it for now | Nothing |
| 9 | Create Test Run | Opens the create test run side drawer on this page ("see attached ss") | A drawer (C15). The screenshot did not arrive with v2; it came with v3 (§1c), and the drawer followed it. v4 item 1 removed the button, and the drawer with it |
| 10 | Reliable time-left estimates for actions | Assumably yes | The popover shows the time left again (C12) |

The seven changes:

| # | Change | Where it lands |
|---|---|---|
| v2 1 | Attach the three tabs to the top bar, as inside a project on the test case and test run listings | The nav leaves the content column and sits on the top bar's lower edge, full width (C17) |
| v2 2 | For You in two sides: on the left, the projects with test instances assigned to you (name, assigned test instance count, assigned milestone count); on the right an `LTTabNav` with Test Instances and Milestones, with counts and lists | §3.3 |
| v2 3 | Remove *Since you last visited* | Removed; Rajat is taking it to the PM |
| v2 4 | Remove *Starred projects first, then the most recently updated.* | Removed |
| v2 5 | Underline a list item's title while the pointer is on the item; controls inside keep their behaviour | Every row and card, the left pane and the test case rows included; a click anywhere on a row or card opens its item (§4.13) |
| v2 6 | Project cards: icons for test cases and test runs; a name shows its email on hover; a relative date shows its full date and time on hover | §4.4, §4.14 (C13, C14, C18) |
| v2 7 | Progressive disclosure: open on your recently used and starred projects, with *Show all* at the bottom for the rest | §4.5 (C16), reworked by v3 item 7 |

## 1c. v3, 21 Oct 2026: eleven changes

| # | Change | Where it lands |
|---|---|---|
| v3 1 | A test case listing inside each project, with dummy test cases; no other page inside a project | §3.6, §4.17. The project nav's Test Runs and Milestones answer with a toast |
| v3 2 | A small caret beside the project name in the top bar, opening a SelectPanel of every project with a search field: recently used, then starred, then the rest | §3.7, §4.16 |
| v3 3 | GitHub's *Switch repository* panel as inspiration | §3.7 says what was taken and what was not |
| v3 4 | Rest, hover and pressed states for the project name and the caret | §3.7, the state table |
| v3 5 | Ctrl or Cmd + click opens a project from the panel in a new browser tab | Every project in the panel is a link (§4.16) |
| v3 6 | The product's Create Test Run drawer, from the screenshot | §8b records its copy changes; C15, C19, C20, C23, C25, C28. Retired by v4 item 1 |
| v3 7 | *Show all* as a link, gone once used, and no *Show less*, since the full list paginates | §4.5; C16 resolved |
| v3 8 | The product's test case and test run icons in the project's meta, without the words | §4.4; C18, C26 |
| v3 9 | *+1* or *+2* opening the label group, instead of *Show 1 More* | §4.15; C22 |
| v3 10 | For You, Your Projects and Archived reorderable by each user, and remembered | §4.2, §4.18; C27 |
| v3 11 | Default order: Your Projects, For You, Archived | §4.1, §4.2; question 17 |

## 1d. v4, 22 Oct 2026: eight changes, after Rajat's review with the PM

| # | Change | Where it lands |
|---|---|---|
| v4 1 | Remove **Create Test Run** from the list and grid views | Gone from every row and card. Nothing else opened the drawer, so it left too; C15, C19, C20, C23, C25 and C28 are retired, and §8b stays as a record of the product drawer's copy |
| v4 2 | A middle dot between the next milestone, the test instance count and the ongoing actions | What needs you is one meta line in both views, its parts split by middle dots, each led by its icon (§4.8, C33) |
| v4 3 | Remove the count that needs a configuration; with nothing else left, the test instance part goes too | *Test instances: 12 unassigned*. A project with none unassigned, like Mobile app, shows no test instance part (§4.8, C6) |
| v4 4 | Remove the automated share from both views | The test case count stands alone, and the card's bar is gone, on Archived too (§4.4) |
| v4 5 | Replace *Import test cases from TestRail* with another ongoing action | *Copy test cases to Payments*, queued, in `project-actions-listing.md` §1.1's grammar, to Web app's own folder (§4.11) |
| v4 6 | Re-align the rows and cards after the removals | §3.4: the name and tags, the facts, then what needs you, one level each, on an 8px rhythm; the star alone at the side |
| v4 7 | The product's buttons beside the search field, Create Project as a button group | **Owners**, **Tags** and **Products**, then **Create Project** as a split button whose menu holds **Import data** (§3.4, §4.19; C29 to C32) |
| v4 8 | Everything else as it was | Unchanged |

## 2. Component inventory

| Component | Role | Props used (all in `COMPONENTS.md`, except where §9 says otherwise) |
|---|---|---|
| `LTUnderlineNav` | Your Projects · For You · Archived, in each user's order; inside a project, Test Cases · Test Runs · Milestones | `navs` (shape TBD → `ltunderlinenav--with-counters`), `ariaLabel`, `size="medium"`, `onClick`, `onKeyDown` (the tab's menu, §4.18). Counters on Your Projects, Archived and the project's three tabs |
| `LTActionMenu` | Each page tab's menu: Move left, Move right, Reset tab order (v3 item 10); and Create Project's menu, **Import data** (v4 item 7) | `options` (shape TBD → `ltactionmenu` stories), `customAnchor` (the pointer or the tab; the split button's caret), `width` (200 for Create Project's, as in the product), and the story-verified controlled `open` and `onMenuToggle` (`test-entity-listing.md` §2) |
| `LTBreadcrumbs` | Inside a project: *Test Manager / {project}* (`test-entity-listing.md` §1) | `items` (shape TBD → `ltbreadcrumbs--default`), `separator="/"`, `size`, `ariaLabel`. It has no slot for the switcher's caret, so the last crumb is composed (§9) |
| `LTSelectPanel` | Owners and Tags filters, multi-select (v4 item 7); and the project switcher's look (v3 item 2) | Filters, anchored: saves on close (`guidelines/ltselectpanel.md`). `title`, `buttonLabel`, `defaultValues`, `onApply`, `cancelButtonText` (*Reset*, the default), `showCountOnCta`. `options` TBD → `ltselectpanel--select-panel`. 320px wide, so the longest cast name fits. The switcher: `title="Switch project"`, `loading`; its caret anchor, single choice, links and group headings are composed (§9) |
| `LTNavList` | For You's left pane; the project's folder pane | `ariaLabel`, `listItems` (shape TBD → `ltnavlist--nav-list`), `selectedTab`, `handleSelectedTab`, `showTruncatedName` |
| `LTTabNav` | For You's Test Instances · Milestones, below the `LTUnderlineNav` (`ltunderlinenav.md`) | `items` (shape TBD → `lttabnav--tab-nav`), `activeTab`, `ariaLabel`, `size` |
| `LTText` | `h1` per view, meta | `HEADER_BOLD` for the `h1`, `SUBHEADER_BOLD` for row and card titles, `SMALL_BOLD` for the pane titles, `SMALL_REGULAR` for meta (`guidelines/README.md` §3) |
| `LTCounterLabel` | Counts on both tab layers and the folders | `count`, `scheme="secondary"` |
| `LTLink` | Project names, test case titles, test instance titles, milestone names, the unassigned test instance count, **View All Actions**, **Show All** (v3 item 7) | `href`, `label`, `muted` for the count |
| `LTLabelGroup` + `LTTag` | Project tags, three then *+{n}* (v3 item 9); test case tags; *Read-only*; *Archived* in the switcher | `text`, `labelStyle="outline"`, `variant="blueAccent"` for tags, `variant="secondary"` for *Read-only* and *Archived*. `LTLabelGroup` documents only `children`, so the overflow is composed (C22, §9) |
| `LTAnchoredOverlay` | The whole tag group, from *+{n}* | `ariaLabel`, `align`, `overlayClassName`, `closeOverlay`; a custom anchor, as its `ltanchoredoverlay--custom-component-anchor` story shows (the anchor prop's name TBD) |
| `LTTestStatusLabel` | Test instance and test case status; ongoing action status; archived project status | `status`, `showStatusText={false}` in lists, `width`, `height` |
| `LTMetaData` | The `·`-separated meta lines: a project's facts, and what needs you (v4 item 2) | `value`, `leadingIcon` (test cases, test runs, the milestone flag, the test instance list), `label` (the words the count icons replace, for screen readers, C18), `showLeadingDot`, `size="small"` |
| `LTTooltip` | A name's email, a relative date's full date and time (v2 item 6), and *Switch project* on the caret | `direction`. The text and the `description` type are Primer Tooltip's and absent from the manifest (§9). On a focusable trigger (C13) |
| `LTAvatar` | Assigner in For You; people in the Owners filter | `initials`, `name`, `size={20}`, `type="circle"` |
| `LTInlineMessage` | *Inactive since {date}.* | `variant="info"`, `size="medium"` (`ltinlinemessage.md`: medium whenever it fits). The text has no documented prop; passed as children (§9) |
| `LTPopover` | Ongoing actions on hover | `heading`, `popOverbodyJSX`, `direction`, `canChangeDirection`, `containsInteractiveChildElement`, `forceClose` |
| `LTProgressBar` | Progress of a running action, in the popover. The card's automated share left in v4 (item 4) | `segments=[{ id, progress, style }]` (story-verified), `size="small"`. No `ariaLabel`: the value is written beside each bar, and a label that repeats it doubles up for screen readers (`ltprogressbar.md`) |
| `LTSegmentedControl` | List or grid | `isIconButton`, `showTooltip`, `options` (TBD → `ltsegmentedcontrol--icon-buttons`), `selectedValue`, `onChange`, `ariaLabel`, `role="radiogroup"` (C8) |
| `LTInputBox` | Search fields | `inputOnly`, `type="search"`, `variant="default"` (`ltinputbox.md`: search fields keep the background), `allowClearSearch` |
| `LTCheckbox` | Test case selection: each row, and all rows on the page | `ariaLabel`, `checked`, `indeterminate` for a partial page, `onChange` (`test-entity-listing.md` §3.3, §3.4) |
| `LTPagination` | The test case list; Your Projects once Show All has been used | `currentPage`, `pageCount` (story-verified, `ltpagination.md`), `showPages`, `marginPageCount`, `surroundingPageCount`, `onChange`. 20 a page, each page its own URL (§9) |
| `LTButton` | Filter triggers; Create Project; Add Test Case | Filters: `variant="outline"`, `counter`, caret via `trailingIcon` (`guidelines/README.md` §5), and an accessible name that says what is chosen, *Owners: 2 selected* (`ltselectpanel.md`). Create Project: `variant="primary"`, `size="medium"`, `leadingIcon={Notebook}`, inside an `LTButtonGroup` (C32). Add Test Case: `variant="primary"` |
| `LTButtonGroup` | **Create Project** and its caret, as one split button (v4 item 7) | `children`. Compositional, as `ltbuttongroup.md` sets the split button: an `LTButton`, then an `LTActionMenu` whose `customAnchor` is an icon-only `LTIconButton` of the same variant and size, with `unsafeDisableTooltip` |
| `LTIconButton` | Star toggle; popover and overlay close; the split button's caret | `icon`, `ariaLabel`, `variant="invisible"`, `size="small"`, `tooltipDirection`. The caret: `variant="primary"`, `size="medium"`, `unsafeDisableTooltip` |
| `LTBlankSlate` / `LTLoader` / `LTFlash` | Empty, loading, error | Required on every list (`guidelines/README.md` §1) |
| `LTToast` | Results the user cannot see; destinations not built | top right, 4 seconds |
| `LTBox`, `LTDivider` | Layout, row separators, grid cards | Rows sit in one bordered container (`project-listing.md` delta 4, `test-entity-listing.md` delta 2) |

**Composed, and flagged (§9):** the grid card (no card component exists among the 69, the SmartUI precedent), the vertical rule in the top bar, the wrapping meta line (when a line of `LTMetaData` wraps, the new line never starts with a middle dot), the whole-item click of v2 item 5, the project crumb with its caret, the switcher's list of links in groups, the *+{n}* overflow, and the drag that reorders tabs (`guidelines/README.md` §10: nothing in the library supports drag and drop).

**Deliberately absent:** the row `LTActionMenu` on projects (C9) and on test cases (C24), `LTCheckbox` on project rows (project rows are not selectable, `project-listing.md` §7), and `LTPagination` on Archived (2 archived projects fit one page, and pagination never renders for a single page, `guidelines/ltpagination.md`). Your Projects paginates only after **Show All** or while searching, and 7 projects still fit one page.

**Retired with v4 item 1:** the Create Test Run drawer and what only it used: `LTDrawer`, `LTTextarea`, `LTFormControl` with `LTTextInputWithTokens` and `LTToken`, `LTRadioGroup`, and `LTInputBox`'s form field. Their look-alikes stay in `src/lt.jsx` and `src/overlays.jsx`; the drawer itself is in the repo's history (`08c1a89`).

## 3. Structure

### 3.1 Shell

The platform shell, unchanged: the 56px rail with Test Manager active (`platform-sidebar.md`), and the top bar (`topbar.md`). On this page, depth 1, its left slot is the plain label *Test Manager*; inside a project, depth 2, the breadcrumb *Test Manager / {project}* with the project switcher (§3.7). On the right *Credits: 20k*, a separator, **Recent Tests**, Announcements, the notifications bell, the avatar (`RS`, Ritika Sharma, the signed-in user) and **Upgrade Now**. Both sit on `canvas.subtle`; page content stays white.

### 3.2 Tabs, attached to the top bar (v2 item 1), in each user's order (v3 items 10 and 11)

```jsx
{/* Directly under the top bar, full width, the way the project nav sits on the
    test case and test run listings (test-entity-listing.md §3.1): 24px from
    the rail, as the top bar's own left edge. It stays put while the content
    below scrolls. navs shape TBD → ltunderlinenav--with-counters (C17).
    The order is the signed-in user's own; this is the default (v3 item 11). */}
<LTUnderlineNav ariaLabel="Projects" size="medium" onKeyDown={openTabMenu} navs={[
  { id: "projects", label: "Your Projects", href: "#/projects", counter: 7 },
  /* For You: no counter. It holds two kinds of rows, and a tab badge counts
     the rows inside the tab (ux-text-guidelines.md §7). */
  { id: "for-you", label: "For You", href: "#/for-you" },
  { id: "archived", label: "Archived", href: "#/archived", counter: 2 },
]} />
{/* Each tab's menu, opened by a right-click, Shift + F10 or the menu key:
    the keyboard's way to do what a drag does (guidelines/README.md §10).
    Unavailable moves stay, inactive, saying why (ltactionmenu.md). */}
<LTActionMenu open={menuOpen} onMenuToggle={setMenuOpen} width={232} customAnchor={tabOrPointer}
  options={[/* shape TBD
    { label: "Move left", icon: ArrowLeft, inactive: first, description: "Already the first tab" },
    { label: "Move right", icon: ArrowRight, inactive: last, description: "Already the last tab" },
    divider,
    { label: "Reset tab order", icon: RotateCcw, inactive: isDefault, description: "Already in the default order" } */]} />
{/* Then the view. For You runs full width with its pane; Your Projects and
    Archived keep the centred 1232px column (guidelines/README.md §2). */}
```

### 3.3 For You (v2 item 2)

Two panes, as the test case and test run listings lay out their folder pane and list (`test-entity-listing.md` §3.2), and so full width (`guidelines/README.md` §2: pages with a folder or navigation pane run full width). Each pane scrolls on its own.

```jsx
<LTBox styles={{ display: "flex" }}>
  {/* Left pane, 320px: the pane scale's simple-list step (README §2). Its
      title is SMALL_BOLD, as "Folders" is on those listings. */}
  <LTBox styles={{ width: "320px", flex: "0 0 320px", padding: "16px" }}>
    <LTText variant="SMALL_BOLD" text="Projects" />
    {/* listItems shape TBD → ltnavlist--nav-list. The selected item has the
        orange bar and the grey fill (README §1). All Projects first, as the
        folder pane's root row [proposed], then the projects where test
        instances are assigned to you, the newest assignment first. */}
    <LTNavList ariaLabel="Projects" selectedTab="all" showTruncatedName listItems={[
      { id: "all", label: "All Projects", meta: "16 test instances · 5 milestones" },
      { id: "web-app", label: "Web app", meta: "6 test instances · 2 milestones" },
      /* Mobile app, Mobile web, iPad app ("3 test instances · 0 milestones") */
    ]} />
  </LTBox>

  <LTBox styles={{ flex: 1, minWidth: 0, padding: "16px 24px" }}>
    {/* The h1 names what the panel shows, as the listings' h1 names the
        selected folder ("All Test Cases"). */}
    <LTText as="h1" variant="HEADER_BOLD" text="All Projects" />
    <LTText variant="SUBHEADER_REGULAR" text="Test instances assigned to you and milestones you own or created." />
    {/* items shape TBD → lttabnav--tab-nav. Each tab has its own URL. */}
    <LTTabNav ariaLabel="Your work" activeTab="test-instances" items={[
      { id: "test-instances", label: "Test Instances", counter: 16 },
      { id: "milestones", label: "Milestones", counter: 5 },
    ]} />
    {tab === "test-instances" ? <TestInstanceRows /> : <MilestoneRows />}
  </LTBox>
</LTBox>
```

A test instance row, two lines and a right column. The title is the test case's own (`mock-data.md`: a test instance inherits its test case's title, and every list shows title, configuration, version and status):

```jsx
<LTBox styles={{ display: "flex", gap: "12px", padding: "12px 16px" }}>
  {/* Status icon, filled, as on the test instance listing. The word is the
      accessible name; the glyph shapes differ, so colour is never alone. */}
  <LTTestStatusLabel status={ti.status} showStatusText={false} width={16} height={16} />
  <LTBox styles={{ flex: 1, minWidth: 0 }}>
    {/* One line, cut with an ellipsis; the full title shows on hover. */}
    <LTLink label={ti.title} />
    {/* The meta line of the test instance listing (test-entity-listing.md
        §3.4), with the test run added, since this list spans runs, and the
        project first under All Projects. Without a configuration the line
        names the state, as the project rows do (C6). */}
    <LTMetaData value={ti.project} showLeadingDot={false} />       {/* Web app, under All Projects only */}
    <LTMetaData value={ti.testCaseId} />                           {/* #TC-225 */}
    <LTMetaData value={ti.version} />                              {/* v2 */}
    <LTMetaData value={ti.testRun} />                              {/* Regression Suite - Release 8.4 */}
    {ti.config
      ? <><LTMetaData value={ti.browserOs} /><LTMetaData value={ti.resolution} /></>  /* Chrome 120 on Windows 12 · 1920x1080 */
      : <LTMetaData value="Needs a configuration" />}
  </LTBox>
  <LTBox styles={{ flex: "0 0 200px" }}>
    {/* v2 item 6: the date shows its full date and time on hover and focus,
        the name its email (C13). */}
    <LTText variant="SMALL_REGULAR" text={`Assigned ${ti.assignedAt}`} />  {/* 2 hours ago, or on Sep 03, 2026 */}
    <LTAvatar initials={ti.by.initials} name={ti.by.name} size={20} /> {ti.by.name}
  </LTBox>
</LTBox>
```

A milestone row, the same anatomy: a flag where the status icon sits, the name as a link, then *Web app · Owned by Darth Vader · Created by you* (the project only under All Projects), and on the right *2 days left* above *Oct 23, 2026*.

### 3.4 Your Projects

```jsx
<LTText as="h1" variant="HEADER_BOLD" text="Your Projects" />
<LTText variant="SUBHEADER_REGULAR" text="Projects hold all your test case information." />

{/* v4 item 7: the product's toolbar (Rajat's screenshot, and the filter set
    of patterns/project-listing.md). Filter triggers: outline LTButton, caret,
    applied count in `counter` (guidelines/README.md §5). */}
<LTBox styles={{ display: "flex", alignItems: "center", gap: "12px" }}>
  <LTInputBox inputOnly type="search" variant="default" placeholder="Search projects"
    ariaLabel="Search projects" allowClearSearch extraStyle={{ flex: 1 }} />
  {/* Owners and Tags open an anchored LTSelectPanel. A project's owner is its
      creator, for now (answer 3, C30). */}
  <LTButton variant="outline" size="medium" label="Owners" trailingIcon={ChevronDown} />
  <LTButton variant="outline" size="medium" label="Tags" counter={1} trailingIcon={ChevronDown} />
  {/* design-context has no product values yet, so Products answers with a toast (C31). */}
  <LTButton variant="outline" size="medium" label="Products" trailingIcon={ChevronDown} />
  {/* Brief 7. Icon-only, two segments, tooltips, a label (ltsegmentedcontrol.md). */}
  <LTSegmentedControl ariaLabel="View" role="radiogroup" isIconButton showTooltip
    options={[/* List, Grid */]} selectedValue={view} onChange={setView} />
  {/* The split button as guidelines/ltbuttongroup.md sets it (C32): the
      action, then a caret of the same variant and size, with no tooltip of
      its own, opening the other ways to create. The menu is 200px, right
      edge on the group's, as in the product. */}
  <LTButtonGroup>
    <LTButton variant="primary" size="medium" label="Create Project" leadingIcon={Notebook} />
    <LTActionMenu width={200}
      customAnchor={<LTIconButton icon={ChevronDown} variant="primary" size="medium"
        unsafeDisableTooltip ariaLabel="More ways to create a project" />}
      options={[/* shape TBD: { label: "Import data", icon: FolderInput } */]} />
  </LTButtonGroup>
</LTBox>

{/* v2 item 7, reworked by v3 item 7: your starred, then your recently used
    projects; Show All is a link to the whole list (#/projects/all), which
    paginates at 20. It is gone once followed, and nothing collapses the list
    again. While a search or filter is applied, the list holds every match,
    paginated, and the link is gone. */}
{view === "list"
  ? <LTBox styles={{ border: "1px solid", borderRadius: "8px" }}>{rows}</LTBox>
  : <LTBox styles={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "16px" }}>{cards}</LTBox>}
<LTLink href="#/projects/all" label="Show All" />   {/* C16 */}
<LTPagination currentPage={page} pageCount={pages} />   {/* after Show All, from 21 projects */}
```

The project row, list view (v4 item 6). Three lines, one level of the hierarchy each, 8px apart: what the project is, its facts, and what needs you there; an inactive project adds its note last, and a line with nothing on it is omitted. The star is the one control left at the side, centred on the name's line:

```jsx
<LTBox styles={{ display: "flex", alignItems: "flex-start", gap: "16px", padding: "16px 20px" }}>
  <LTBox styles={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
    {/* 1. What it is: the name (it navigates to the project's test case
        listing, so LTLink, project-listing.md delta 5) and the tags: three,
        then "+{n}" (v3 item 9, C22), which opens the whole group in an
        overlay. Desktop website's fourth tag shows as "+1", named "Show +1
        more tag". */}
    <LTLink label="Web app" size="medium" href="#/project/web-app" />
    <LTLabelGroup><LTTag text="prod" /><LTTag text="report" /></LTLabelGroup>

    {/* 2. Its facts. The counts carry the product's icons in place of words
        (v3 item 8, C18, C26), and the test case count no automated share (v4
        item 4). The name shows its email and the relative date its full date
        and time (C13, C14). */}
    <LTMetaData leadingIcon={TestCaseIcon} label="Test cases" value="1.24k" showLeadingDot={false} />
    <LTMetaData leadingIcon={TestRunIcon} label="Test runs" value="38" />
    <LTMetaData value="Created by Ritika Sharma" />   {/* ritika.sharma@dundermifflin.com on hover */}
    <LTMetaData value="Updated 4 days ago" />          {/* Oct 17, 2026, 08:13 AM on hover */}

    {/* 3. What needs you: one meta line, a middle dot between its parts (v4
        item 2). Your next milestone (one you own or created, answer 6), its
        date after a comma (C33); the unassigned test instances (brief 8), a
        link to the filtered list, now without the count that needs a
        configuration (v4 item 3); and the ongoing actions (brief 11). A part
        with nothing to say is left out. */}
    <LTMetaData leadingIcon={Flag} value="Your next milestone: UAT Round 2, due Oct 23, 2026" showLeadingDot={false} />
    <LTMetaData leadingIcon={ListTodo}>Test instances: <LTLink muted label="12 unassigned" /></LTMetaData>
    <OngoingActions project={p} />   {/* "3 ongoing actions", opens the popover */}

    {/* 4. Brief 10, only on an inactive project. */}
    <LTInlineMessage variant="info" size="medium">Inactive since Jul 14, 2026.</LTInlineMessage>
  </LTBox>

  {/* Brief 6: the star, a toggle whose name says what it will do. */}
  <LTIconButton icon={Star} variant="invisible" size="small" ariaLabel="Unstar Web app" />
</LTBox>
```

The grid card carries the same three levels in the same order, set for a narrower box: the name and the star in the head, the tags, the counts, the line of what needs you (it wraps, and a wrapped line never starts with a middle dot), the inactive note, then a foot under a rule with the creator and the last update. Cards in a row share one height, so their feet line up.

The ongoing actions popover:

```jsx
<LTPopover direction="bottom-left" canChangeDirection containsInteractiveChildElement
  heading="3 ongoing actions"
  popOverbodyJSX={<>
    {actions.map(a => (
      <ActionItem key={a.id}
        status={a.status}                 /* running | queued (project-actions-listing.md §1.1) */
        title={a.title}                   /* Import test cases from CSV */
        progress={a.progress}             /* 312/1.24k test cases · 25% · ~4m 10s left, and the bar */
        elapsed={a.elapsed} />            /* Running · 4m 12s · Started by Ritika Sharma (C12) */
    ))}
    <LTLink label="View All Actions" />   {/* the project's Actions tab, project-actions-listing.md */}
  </>}>
  {/* Leading icon: the running status glyph, or queued when none runs. */}
  <LTButton variant="invisible" size="small" leadingIcon={RunningStatus} label="3 ongoing actions" />
</LTPopover>
```

The Create Test Run drawer that v3 built from the product's screenshot left with its button (v4 item 1). The changes its copy needed stay on record in §8b.

### 3.5 Archived

The same list and grid, read-only. No star, no milestone, no test instance counts and no actions: nothing in an archived project changes. Each row leads with the `archived` status icon (`type=Archive`, `mock-data.md`) and carries a *Read-only* tag, the counts with their icons, and the line *Archived on Aug 22, 2026 by Darth Vader*. Search stays, so a long archive is still findable. A name opens the project's test case listing, read-only (§3.6).

### 3.6 The test case listing inside a project (v3 item 1)

`patterns/test-entity-listing.md`'s Test Cases page, the one page built inside a project. The project nav's other two tabs answer with a toast.

```jsx
{/* Depth 2. The project nav on the top bar's lower edge, as on the root page
    (test-entity-listing.md §3.1). navs shape TBD → ltunderlinenav--with-counters */}
<LTUnderlineNav ariaLabel="Project" size="medium" navs={[
  { id: "test-cases", label: "Test Cases", href: "#/project/web-app", counter: "1.24k" },
  { id: "test-runs", label: "Test Runs", counter: 38 },     /* a toast: "The Test Runs tab of Web app opens here." */
  { id: "milestones", label: "Milestones", counter: 2 },    /* a toast */
]} />

<LTBox styles={{ display: "flex" }}>
  {/* The folder pane, 320px (§3.2, §6). Each folder has its own URL. The
      folder search, the add-folder and options buttons and the collapse are
      left out (C24). listItems shape TBD → ltnavlist--nav-list */}
  <LTBox styles={{ width: "320px", flex: "0 0 320px", padding: "16px" }}>
    <LTText variant="SMALL_BOLD" text="Folders" />
    <LTNavList ariaLabel="Folders" selectedTab="all" listItems={[
      { id: "all", label: "All Test Cases", counter: "1.24k" },
      { id: "regression", label: "Regression", counter: 620 },
      { id: "checkout", label: "Checkout", counter: 310 },
      { id: "payments", label: "Payments", counter: 310 },
    ]} />
  </LTBox>

  <LTBox styles={{ flex: 1, minWidth: 0, padding: "16px 24px" }}>
    {/* §3.5: no page header, straight to the content head; the h1 names the
        folder. An archived project shows the Read-only tag instead of the
        button, and no checkboxes. */}
    <LTBox styles={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <LTText as="h1" variant="HEADER_BOLD" text="All Test Cases" />
      <LTButton variant="primary" size="medium" label="Add Test Case" />   {/* Generate with AI left out (C24) */}
    </LTBox>

    {/* §3.3, the filter bar: select-all for the page, search, Tags. Sort,
        Status and More are left out (C24). */}
    <LTBox styles={{ display: "flex", alignItems: "center", gap: "12px", margin: "16px 0" }}>
      <LTCheckbox ariaLabel="Select all test cases on this page" checked={all} indeterminate={some} onChange={toggleAll} />
      <LTInputBox inputOnly type="search" size="medium" variant="default" allowClearSearch
        placeholder="Search by test case ID or title" ariaLabel="Search by test case ID or title" extraStyle={{ flex: 1 }} />
      <LTSelectPanel title="Tags" buttonLabel="Tags" showCountOnCta options={tags} defaultValues={[]} onApply={setTags} />
    </LTBox>

    {/* §3.4, the row, 16px by 12px, in one bordered container (delta 2); 20
        a page (delta 1). The title is body/medium-bold (README §3, §9). */}
    <LTBox styles={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "16px 12px" }}>
      <LTCheckbox ariaLabel="Select #TC-71953" checked={false} onChange={toggle} />
      {/* The execution status: mock-data.md applies that vocabulary to test cases too. */}
      <LTTestStatusLabel status="passed" showStatusText={false} width={16} height={16} />
      <LTBox styles={{ flex: 1, minWidth: 0 }}>
        <LTLink label="Filter and Verify Product Search Results" />   {/* one line; the full title on hover */}
        <LTTag text="positive" labelStyle="outline" variant="blueAccent" size="small" />
        <LTTag text="edge" labelStyle="outline" variant="blueAccent" size="small" />
        {/* Priority, platform, browser and type are left out (C24). */}
        <LTMetaData label="Test case ID" value="#TC-71953" showLeadingDot={false} size="small" />
        <LTMetaData value="Updated 1 day ago by Mehmed Dracul" size="small" />   {/* hints, C13 */}
      </LTBox>
    </LTBox>
    {/* Each page its own URL: #/project/web-app/page/2 */}
    <LTPagination currentPage={1} pageCount={62} onChange={goTo} />
  </LTBox>
</LTBox>
```

The test cases are dummy data, as v3 item 1 asks: each project has as many as its count says, titles only from `mock-data.md`'s test case and test instance name lists, IDs in its `#TC-` format, people from the cast, the tags the pattern records (*positive*, *negative*, *edge*), and the three folders from `project-actions-listing.md` (§9). The test cases assigned to you in For You come first, under their own IDs, so both pages agree.

### 3.7 The project crumb and the switcher (v3 items 2 to 5)

The top bar's left slot inside a project, after GitHub's repository switcher (v3 item 3):

```jsx
{/* Depth 2: "Test Manager / {project}" (test-entity-listing.md §1). items
    shape TBD → ltbreadcrumbs--default. Every crumb is a link
    (ltbreadcrumbs.md), the project's included, marked current (C21). */}
<LTBreadcrumbs separator="/" size="medium" ariaLabel="Breadcrumb" items={[
  { label: "Test Manager", href: "#/" },
  { label: "Web app", href: "#/project/web-app" },
]} />
{/* Composed beside the last crumb: LTBreadcrumbs has no slot for it (§9). */}
<LTTooltip text="Switch project" direction="s">
  <button aria-label="Switch project" aria-haspopup="dialog" aria-expanded={open}>{/* ChevronDown, 16px */}</button>
</LTTooltip>
{/* The panel: LTSelectPanel's anatomy (title, search, list, groups) and its
    documented `loading`. The caret anchor, the single choice and the links
    are composed (§9). 320px, anchored under the caret, its left edges on the
    caret's. */}
```

The panel, top to bottom: the title *Switch project*; a search field, *Search projects*, focused on open; then three groups under headings (`ltselectpanel.md`: group options with headings when the list has natural categories): **Recently used** (the last 4 projects you opened, archived ones included), **Starred** (the rest of your stars, most recently updated first), and **Other projects** (active ones by update, then archived ones by archive date). Each project is a link to its test case listing. The current one carries a check and bold text and is marked current; an archived one carries an *Archived* tag.

The name and the caret are two parts of one control, each with its own states (v3 item 4):

| Part | Rest | Hover | Pressed | Open |
|---|---|---|---|---|
| Name | Bold, `fg.default`, no fill | The whole crumb takes `neutral.muted`; the name `btn.invisible.hoverBg` | `btn.invisible.activeBg` | The crumb keeps `neutral.muted` |
| Caret | `fg.muted`, no fill | The whole crumb takes `neutral.muted`; the caret `btn.invisible.hoverBg` and `fg.default` | `btn.invisible.activeBg` | Stays pressed, `btn.invisible.activeBg`, while the panel is open |

Focus shows the 2px `focus.outlineColor` ring inside each part. The crumb is 28px tall; the caret part is 24px wide, so both parts meet the 24px minimum target (`guidelines/README.md` §9).

From GitHub's panel (the screenshot), taken: the caret joined to the name as one pill, darker on the caret's side while open; the panel under the caret, aligned to its left edge; the title in the form *Switch {thing}*; the focused search field; the check on the current item. Not taken: per-item icons (a project has none), the blue bar GitHub draws on the focused item (the house's left bar means selection, and it is orange, README §1), and the flat list (grouped here, as `ltselectpanel.md` asks).

## 4. Behaviour, item by item

1. **The page.** It opens on For You (answer 1), wherever For You sits in your order (question 17). Each tab has its own URL (`#/for-you`, `#/projects`, `#/archived`); For You's selection and tab have theirs too (`#/for-you/web-app`, `#/for-you/all/milestones`), and so does the whole project list (`#/projects/all`, `#/projects/all/page/2`). The top bar's label stays *Test Manager*.
2. **Tabs.** `LTUnderlineNav` on the top bar's lower edge, full width, fixed while the content scrolls (v2 item 1, C17), in the signed-in user's order: Your Projects, For You, Archived until they change it (v3 items 10 and 11, §4.18). Your Projects and Archived carry counters that count the rows inside them; For You carries none, since it holds two kinds of rows. Brief 2 said "2 tabs" and named three; point 12 describes the third, so all three are built (C2).
3. **For You** (v2 item 2).
   1. *The left pane* lists **All Projects** [proposed], then each project where test instances are assigned to you, the newest assignment first, so new work rises. Each item: the name, then *6 test instances · 2 milestones*. Your milestones are the ones you own or created (answer 6). The selection keeps the open tab: picking a project on Milestones shows its milestones.
   2. *The panel* is headed by the selection's name, *All Projects* or the project, with one line on what it holds, then an `LTTabNav`: **Test Instances** and **Milestones**, each with its count.
   3. *Test Instances* lists the test instances assigned to you, the newest assignment first. Each row: status icon, the test case title as a link (one line, the full title on hover), then `{project} · #TC-225 · v2 · {test run} · {configuration}` (the project only under All Projects), and on the right *Assigned {when}* above the assigner's avatar and name. A test instance without a configuration says *Needs a configuration*: brief 3.1 shows the configuration "if any", and an empty value names the state, never a blank (`ux-text-guidelines.md` §3), in the words the project rows use (C6). Dates are relative up to 30 days and `MMM DD, YYYY` after (`mock-data.md`).
   4. *Milestones* lists your milestones, soonest first, so the first row is your next one (brief 3.2): the name as a link, the project under All Projects, *Owned by {name}* and *Created by {name}* (*you* for you: they say why it is yours), and on the right *2 days left* above *Oct 23, 2026*. A deadline carries its absolute date beside the countdown (`ux-text-guidelines.md` §7).
4. **Per project.** Name, tags, the test case count and the test run count, each after its icon and without the words (v3 item 8, C18), *Created by {name}* and *Updated {when}*; then, on a line of its own, what needs you (item 8). Screen readers hear *Test cases 1.24k* and *Test runs 38*. The automated share left both views in v4 (item 4). A project with no test cases shows *0*. The icons are the product's: a file with a tick and a cross for test cases, a route for test runs (C26).
5. **Progressive disclosure** (v2 item 7, reworked by v3 item 7). Your Projects opens on your projects: the starred ones first (answer 7), then the ones you used most recently, up to 4 (brief 5) [proposed count]. **Show All**, a link under the list, opens the whole list at its own URL (`#/projects/all`): your projects stay on top and the rest follow, most recently updated first, so nothing already on screen moves; focus goes to the first project it revealed, and screen readers hear *7 projects*. The link is then gone, and nothing collapses the list again: it paginates at 20 a page, each page with its own URL, and the browser's Back returns to your projects. A search or a filter looks through every project, in the same order, paginated, and hides the link. With no starred or recent project, the list opens complete. Opening a project counts as a visit, which makes it recently used the next time the tab opens.
6. **Star.** A star toggle on every active project. Starred projects come first. Starring does not move the row under the pointer: the order is set when the tab opens [proposed]. The toggle's name says what it will do (*Star Web app*, *Unstar Web app*), and screen readers hear *Web app starred*.
7. **List or grid.** An icon-only `LTSegmentedControl` with tooltips (*List*, *Grid*), in the toolbar of Your Projects and of Archived, sharing one setting. It applies at once and is remembered per user: the prototype stores it under the signed-in user's ID in the browser; the product would store it on the account.
8. **What needs you** (v4 items 2 and 3). One meta line, a middle dot between its parts, each led by its icon: *Your next milestone: UAT Round 2, due Oct 23, 2026*, the soonest milestone you own or created (answer 6); *Test instances: 12 unassigned*, the count a link to the project's test instance list, filtered to them (brief 8); and *3 ongoing actions* (item 11). A part with nothing to say is left out, and with all three empty the line is gone: Mobile app has no unassigned test instances, so its line holds the milestone and its action. The count of test instances that need a configuration left in v4 (item 3). The milestone's date follows a comma, so every middle dot on the line separates parts (C33). In a card the line wraps, and a wrapped line never starts with a middle dot.
9. **Create Test Run** left the rows and cards in v4 (item 1), and the drawer it opened left with it. Its copy changes from the product's drawer stay in §8b.
10. **Inactive since.** A project where nobody in the org has taken any action on any entity for more than 90 days (answer 4) shows `LTInlineMessage` `info`: *Inactive since Jul 14, 2026.* It informs and offers nothing (answer 4). Its date is the last action, which can be later than *Updated*: a test run executed on Jul 14 changes no project details.
11. **Ongoing actions.** *3 ongoing actions* counts the project's actions that are running or queued, the operations of `project-actions-listing.md` (imports, exports, automation, moves, copies, deletions and test run executions). Hovering it for 250ms, or pressing it, opens an `LTPopover` listing each one: status icon, title, progress as counts processed with a bar and the time left (*312/1.24k test cases · 25% · ~4m 10s left*, or *Estimating time left…* before the first estimate), then how long it has run or waited and who started it (*Running · 4m 12s · Started by Ritika Sharma*, *Queued · 2m 5s · Started by Darth Vader*), and last **View All Actions** (C12). It stays open when the pointer leaves, and closes with its close button, Esc or a click outside (C3). A press moves focus into it; Tab past its last control closes it and returns focus to the trigger. A project with none shows nothing.
12. **Archived.** Archived projects, read-only: the `archived` status icon, a *Read-only* tag, the counts, the creator, and *Archived on {date} by {name}*. Opening one opens its test case listing, read-only.
13. **A whole row or card opens its item** (v2 item 5). Hovering anywhere on a row, a card, a left-pane item or a test case row underlines its title, and a click anywhere on it opens the item, through the title link, which stays the one link for keyboard and screen readers. The controls inside (tags and *+{n}*, the test instance link, the actions popover, the star, the checkboxes, and the name and date hints) work as before, and while the pointer is on one of them the title stays as it is. Keyboard focus on the title outlines the whole row.
14. **Names and dates** (v2 item 6). Every person's name in a row, a card or the popover shows their email on hover and focus (`ritika.sharma@dundermifflin.com`, `mock-data.md` format); *you* shows nothing. Every relative date shows its full date and time (*Oct 17, 2026, 08:13 AM*); an absolute date already says when, so it shows nothing more. Both are focusable, so the keyboard reaches them (C13).
15. **More tags** (v3 item 9). A project shows three tags, then *+{n}* for the rest (*+1* on Desktop website). It is a button, named *Show +1 more tag*; a press opens the whole group in an overlay beside it, with focus inside, as Primer's LabelGroup does with `overflowStyle="overlay"` (C22). Its close button, Esc, a click outside or Tab past its end closes it and returns focus to *+1*.
16. **Switching projects** (v3 items 2 to 5). The caret beside the project's name opens the panel of §3.7, focus in its search field; typing narrows every group at once, and a search that matches nothing says *0 matches for "{query}"*. Down arrow moves from the search into the list and through it, up arrow back, Home and End to its ends. A click or Enter on a project opens it here and closes the panel; Ctrl or Cmd + click, Shift + click and a middle click are the browser's own (a new tab or window), and the panel stays open for the next one (v3 item 5). Esc closes it and returns focus to the caret, as Tab past either end does; a click outside closes it. The project's name itself is a link to the project's test case listing, the current page (C21). Opening a project, from here or anywhere, makes it recently used.
17. **The test case listing** (v3 item 1). The folder pane lists *All Test Cases* and the three folders, each with its count and its own URL (`#/project/web-app/folder/checkout`); the `h1` names the selection. The list shows 20 test cases a page, most recently updated first, with **Previous**, page numbers and **Next**, each page at its own URL (`#/project/web-app/page/2`), and moving to a page moves focus to the list, which says *Test cases, page 2 of 62*. A search (by ID or title) or a tag filter returns to page 1, and screen readers hear *{n} matching test cases*. A row's checkbox selects it: the row takes the orange bar and the grey fill (README §1), and the bar says *{n} test cases selected*; the select-all box covers the page and is mixed while the page is partly selected. Selections hold across pages until a reload. A title opens the test case, here a toast; **Add Test Case** likewise. An archived project shows *Read-only* in place of **Add Test Case**, and no checkboxes.
18. **Your tab order** (v3 items 10 and 11). Drag a tab sideways with the mouse or a pen: the others slide aside, and letting go drops it there; Esc puts it back. The same moves are in each tab's own menu, opened by a right-click, Shift + F10 or the menu key: **Move left**, **Move right** and **Reset tab order**; a move that is unavailable stays, inactive, saying why (*Already the first tab*). Focus stays on the moved tab, and screen readers hear *Archived moved to position 1 of 3*. The order is the signed-in user's own and survives a reload: the prototype stores it under the user's ID in the browser; the product would store it on the account.
19. **The toolbar** (v4 item 7). The search field, then **Owners**, **Tags** and **Products**, the list and grid switch, and **Create Project**. Owners and Tags open an anchored `LTSelectPanel`, pick several and close it to apply; a project's owner is its creator, for now (answer 3, C30). Products answers with a toast until its values exist (C31). **Create Project** is a split button (C32): its main part opens the project form, here a toast, and its caret opens a menu under it, right edges aligned, with **Import data**; the arrows move through it, Esc closes it, and focus returns to the caret.

## 5. States

| Surface | Empty | Loading | Error |
|---|---|---|---|
| For You | *0 test instances assigned to you* · *Test instances assigned to you appear here, with their test run and configuration.* Under the heading *For You* | `LTLoader`, under the heading | `LTFlash` `danger`: *Assigned test instances failed to load. Try again.* |
| For You, Milestones of one project | *0 milestones you own or created* · *Milestones you own or create in iPad app appear here.* | with the tab | with the tab |
| Your Projects | *Start with your first project* · *Projects keep your test cases organized.* · **Create Project** (`project-listing.md` §4) | `LTLoader` | `LTFlash` `danger`: *Project list failed to load. Try again.* |
| Your Projects, filtered | *0 matching projects* · *Change or clear the filters to see more projects.* | | |
| Archived | *0 archived projects* · *An archived project stays readable here, with its test cases and test runs.* | `LTLoader` | `LTFlash` `danger`: *Archived projects failed to load. Try again.* |
| Archived, searched | *0 matching projects* · *Change or clear the search to see more projects.* | | |
| Test case listing | *Start with your first test case* · *Test cases appear here once you create one.* · **Add Test Case**. The folder pane, the head and the filter bar stay in place (`test-entity-listing.md` §4); Internal HRMS shows it | `LTLoader` in the list's place; the folders show no counts | `LTFlash` `danger` in the list's place: *Test case list failed to load. Try again.* |
| Test case listing, archived project | *0 test cases* · *This project was archived with 0 test cases.* | as above | as above |
| Test case listing, filtered | *0 matching test cases* · *Change or clear the filters to see more test cases.* | | |
| Tags filter, nothing to pick | *0 tags in this project* | | |
| Project switcher | A search that matches nothing: *0 matches for "{query}"*. The current project is always listed | `LTLoader`, small, in the list's place | *Project list failed to load. Try again.* in the list's place (`ltselectpanel.md`: an error placeholder) |
| Ongoing actions | Absent at 0 | | |

One `LTFlash` per page at most (`guidelines/README.md` §1). The prototype shows each state with `?state=loading`, `?state=error` and `?state=empty`, on every tab and inside a project.

## 6. Conflicts recorded

| # | Topic | Brief | design-context | Prototype does | Why |
|---|---|---|---|---|---|
| C1 | Tabs on the root page | Tabs below the top bar | `project-listing.md` §1: primary nav **None**, no project scope exists yet | `LTUnderlineNav` For You · Your Projects · Archived, page-primary, one URL each | Brief wins. These tabs are views of the root page, not project navigation, so the pattern's reason does not apply |
| C2 | Tab count | "add 2 tabs: For You, Your Projects and Archived" | | Three tabs | Point 12 describes the Archived list, so the count was the slip. Not questioned in v2 |
| C3 | A popover on hover, holding data | Hover shows the ongoing operations in a popover | `ltpopover.md`: for onboarding and instructions; always a visible dismiss, Esc and click-outside. `guidelines/README.md` §5: a short tip | `LTPopover`, opening on a 250ms hover or a press, with a close button, Esc and click-outside | Brief wins on the trigger and the content; the guideline wins on dismissal. The same split as the automation details prototype's C20 and C31 |
| C4 | *Inactive since* as an alert | "alert inline message" | `ux-text-guidelines.md` §4: yellow only when the user has a decision; `ltinlinemessage.md`: `warning` likewise | `info` (blue), at 90 days | **Resolved 21 Oct 2026** (answer 4): simply inform, no Archive decision, 90 days |
| C5 | One term: operations or actions | "ongoing operations" | `project-actions-listing.md`: these operations are *actions*, on an **Actions** tab; `ux-text-guidelines.md` §6: one term per concept | *3 ongoing actions*, **View All Actions** | The house already named them |
| C6 | "without configs" | Test instances without configs | `ux-text-guidelines.md` §1 rule 2 and §3 Empty states: name the state or the next step | v3: *4 need a configuration*, beside *12 unassigned* (the guide's own empty value). v4: the count is gone from the rows and cards; For You still names the state, *Needs a configuration* | Says what to do, not what is missing. **Updated 22 Oct 2026** (v4 item 3): the count left the project's line |
| C7 | Owner or creator | "creator user's name" | `project-listing.md`: an owner avatar per row and an **Owners** filter | *Created by {name}* in words on the row; since v4 the product's **Owners** filter, over the same people (C30) | **Resolved 21 Oct 2026** (answer 3): the same person, for now. **Updated 22 Oct 2026** (v4 item 7): the filter takes the product's name |
| C8 | Segmented control role | List or grid | `ltsegmentedcontrol.md`: no `role` without a design decision | `role="radiogroup"`, with the radio keyboard model (one tab stop, arrows move and select) | The decision exists: `smartui-build-screenshots.md` §5 settles `radiogroup` for list and grid (its delta 2; its component table calls it delta 4, §9) |
| C9 | Pattern elements not carried over | | `project-listing.md`: a **Products** filter, a row `...` menu, and a caret on **Create Project** | v4 brings back the **Products** filter (a toast until it has values, C31) and the caret, as a split button (C32); the row menu stays out | **Answered 21 Oct 2026** (answer 5): leave them for now. **Updated 22 Oct 2026** (v4 item 7): the toolbar follows the product's |
| C10 | Volume | | `mock-data.md`: 15 to 25 rows per list, and only these 9 project names | 7 active and 2 archived projects | Names are never invented; the gap is in §9 |
| C11 | The heading count | | `project-listing.md` delta 3: `LTCounterLabel` beside the `Projects` heading | The counts move to the tabs | A tab badge counts the rows inside the tab (`ux-text-guidelines.md` §7); two counters for one list is one too many |
| C12 | Time on an ongoing action | | `project-actions-listing.md` §3.4 and §3.6 (Rajat, 11 Sep 2026): *Started at 09:12 AM by {name}* and *~4m 10s left*. `ux-text-guidelines.md` §7 (8 Oct 2026): "Running work shows elapsed time, not its start time" (*Running · 14m 11s*) and "No ETA unless it is reliable. Show counts processed instead." | *312/1.24k test cases · 25% · ~4m 10s left* and *Running · 4m 12s · Started by Ritika Sharma* | **Updated 21 Oct 2026** (answer 10): the estimates are reliable, so the time left shows, as the guide then allows. The elapsed time keeps the place of the start time, per the guide |
| C13 | Tooltips on plain text | v2 item 6: a name shows its email on hover; a relative date its full date and time | `lttooltip.md`: never on non-interactive elements (plain text, spans) | Both shown; the name and the date are made focusable, so the keyboard reaches them | Brief wins. The automation details prototype settled it the same way (its C1) |
| C14 | The time in a last-updated date | v2 item 6: "absolute date-time stamp" | `mock-data.md`: append the time only where it matters, and omit it "such as a project's last-updated date" | *Oct 17, 2026, 08:13 AM* in the tooltip | Brief wins; the row itself still shows the date alone |
| C15 | A create form in a drawer | Answer 9: Create Test Run opens the create test run side drawer; v3 item 6: the product's drawer, from the screenshot | `ltmodal.md`: a drawer is for global actions or quick previews, "Never for create/edit forms or heavy information" | `LTDrawer`, right side, 480px, the screenshot's four fields | Brief wins, and the product already does this. **Updated 21 Oct 2026** (v3): the fields follow the screenshot, no longer LambdaTest's docs **Retired 22 Oct 2026** (v4 item 1): the drawer left with its button |
| C16 | *Show all* as a link | v2 item 7: "give a 'Show all' link"; v3 item 7: a link, removed once clicked, and no *Show less*, since the full list paginates | `ltlink.md`: "Links navigate. Buttons act. If activating it changes the URL … it's a link." `ux-text-guidelines.md` §2: a standalone action link is a CTA, Title Case | `LTLink` **Show All** to `#/projects/all`, gone once followed; the full list paginates at 20 | **Resolved 21 Oct 2026** (v3 item 7). v2 built a button, since it revealed rows in place. Now it goes to a URL of its own, so it is a link by the guideline's own test, and Back undoes it |
| C17 | Tabs wider than their content | v2 item 1: attach the tabs to the top bar, as inside a project | `ltunderlinenav.md`: directly above the content it controls, aligned left, "not wider than that content" | Full width under the top bar, 24px from the rail; Your Projects and Archived keep the centred 1232px column below | Brief wins: it is the place the product gives the project nav on the test case and test run listings (`test-entity-listing.md` §3.1) |
| C18 | Icons in place of words | v2 item 6: "use icons for TC, TR"; v3 item 8: the product's icons, and remove the words | `lttooltip.md`: never hide essential information in a tooltip; `icons.md`: names no icon for either, and says "12px icons use the filled variant. 16px and 24px use the outline variant, paired with 14px text or larger" | The icon and the value only (*5.2k*, *87*; the automated share left in v4); the words stay for screen readers (`LTMetaData` `label`); no tooltip; 16px outline icons beside 12px meta | **Updated 21 Oct 2026** (v3 item 8): brief wins. v2 kept the words, since an icon alone needs a tooltip to say what it counts; the product shows the icons alone (the screenshot), so sighted users learn them there. Whether they should name themselves on hover is question 24. lucide has no filled set, so the 12px filled variant is not available (§9) |
| C19 | A negated option name | v3 item 6: the screenshot's *Non KaneAI Generated* and *KaneAI Generated* | `ux-text-guidelines.md` §1 rule 2: no negation; §2: labels in sentence case | *Non KaneAI generated* and *KaneAI generated* | The names are the product's vocabulary, so they stay, as `not started` does (`mock-data.md`: renaming is a product decision, not a copy edit); only the casing follows the guide. Question 18 **Retired 22 Oct 2026** (v4 item 1): the drawer left with its button |
| C20 | A disabled primary button | The screenshot shows **Create Test Run** faded, disabled until the name is filled | `ltbutton.md`: "Never disable buttons; keyboard users can't reach them. Use `inactive`." `manual-test-case-summary.md` records *Save Changes* disabled until the form is dirty as "confirmed correct" | Always active; a submit with an empty name shows *Enter a test run name.* and moves focus to the field | The guideline outranks the screenshot, and states a rule where the pattern records an observation (§9). `inactive` would also be wrong here: it is for a system issue (`ltbutton.md`), and an empty field is the user's next step. Question 22 **Retired 22 Oct 2026** (v4 item 1): the drawer left with its button |
| C21 | The last crumb as a link | v3 items 2 and 4: the project name beside its caret, with rest, hover and pressed states; GitHub's screenshot shows the name as a link | `topbar.md`: "earlier levels are muted links, the last is bold and not a link"; `ltbreadcrumbs.md`: "Every crumb is a link; the last one is the current page and is marked as such" | The project name is a link to its test case listing, bold, `aria-current="page"` | Brief and `ltbreadcrumbs.md` agree, and states that react to hover and press promise an action. `topbar.md` asks the same question itself (its open question 4) |
| C22 | The tag overflow control | v3 item 9: *+1* or *+2*, opening the label group, in place of *Show 1 More* | `ltlabelgroup.md`: truncate "with a 'Show {n} More' control"; `ux-text-guidelines.md` §2 and §9: write *and*, never *&* or *+* | *+{n}*, a button named *Show +{n} more tag*, opening the whole group in an anchored overlay | Brief wins. The *+* stands for a count, not for *and*, which is what the guide bans it for. Primer's own LabelGroup does exactly this with `overflowStyle="overlay"`: its button shows *+11* and is named *Show +11 more* (primer.style, read 21 Oct 2026) |
| C23 | Required marks | v3 item 6: the screenshot marks *Test run name* and *Type* with a red asterisk and explains it at the foot: *Required fields are marked with an asterisks (\*).* | `ltradiogroup.md`: mark it on the group, "preferring clear text "(required)" over an asterisk alone"; `ltinputbox.md`: the required indicator on every required field | The asterisks, on the field and on the group, with the explanation at the foot; screen readers hear *required* | The explanation on the same form means the asterisk is not alone, so the screenshot's way meets the guideline's reason **Retired 22 Oct 2026** (v4 item 1): the drawer left with its button |
| C24 | The test case listing's controls | v3 item 1: the test case listing with dummy data, and no other page inside a project | `test-entity-listing.md`: **Generate with AI** beside **Add Test Case** (§3.5); filters *Sort, Status, Tags, More* (§3.3); a row `...` menu (§3.4); the folder pane's search, add, options and collapse (§3.2); meta *priority · Web · browser · Classic* (§3.4) | All left out; **Add Test Case** and the titles answer with toasts | Each needs what design-context lacks: the `ai` button's look (`data/tokens.json` holds only `ai.bg` white and `ai.fg`), *Sort*'s options and *More*'s contents (unrecorded), *Status*'s vocabulary (`mock-data.md` leaves open whether a test case's Status is the lifecycle or the execution set), the row menu's items, and priority, platform and type values (absent from `mock-data.md`). Building them would invent product. Question 20 |
| C25 | The drawer's subtitle | v3 item 6: the screenshot's drawer has a title only | | `subTitle`: the project's name | The drawer opens from a list of projects, so it says which one the run goes into; the product's drawer, opened inside a project, needs no reminder. Question 21 **Retired 22 Oct 2026** (v4 item 1): the drawer left with its button |
| C26 | An icon outside lucide | v3 item 8: the product's test case icon, a file with a tick and a cross | `ux-persona.md`: "Lucide line icons only. Never mix icon families." `icons.md`: in-house icons in `assets/icons/`, used only if listed in its `index.json` | Test runs: lucide `Route`, flipped vertically, which matches the screenshot's icon. Test cases: drawn on lucide's 24px grid with its 2px round stroke: lucide's file outline, its corner fold, a tick and a cross | lucide 1.58.0 has no file with both marks, and `assets/icons/` is absent from `main` (§9). Drawn in lucide's geometry, it sits in the family; the in-house original should replace it |
| C27 | Reordering out of sight | v3 item 10: tabs each user can reorder | `guidelines/README.md` §10: a custom drag "needs a keyboard alternative"; `ux-persona.md` §3: "Every power-user shortcut has a visible twin that beginners can find" | Drag, and each tab's own menu by right-click, Shift + F10 or the menu key: **Move left**, **Move right**, **Reset tab order**. Nothing on screen says either exists | The keyboard alternative is the one `module-details.md` names (its open question 3: "move up / move down in the step's own menu"), and the automation details prototype uses both. A visible entry point is new UI the brief did not ask for: question 23 |
| C28 | Placeholders that instruct | v3 item 6: the screenshot's *Enter Test Run name*, *Add description to the Test Run* and *Add Tags separated by enter* | `ltinputbox.md`: a placeholder "is only an example of the expected input", and never "for critical information" | The screenshot's three, in house style (§8b) | design-context's own pattern for this field type keeps *Add tags separated by Enter* (`manual-test-case-summary.md`), and its component table calls `LTTextInputWithTokens` "purpose-built" for it; the other two repeat their labels, so nothing critical hides in them **Retired 22 Oct 2026** (v4 item 1): the drawer left with its button |
| C29 | Carets | v4 item 7: the screenshot draws Primer's filled triangle on every filter and on the split button's caret | `ltbuttongroup.md`: the split button's caret is an icon-only "triangle-down trigger" (its story uses Primer's `TriangleDownIcon`); `ux-persona.md`: "Lucide line icons only. Never mix icon families." lucide 1.58.0 has no triangle-down | lucide `ChevronDown` on every caret, as on every caret in this prototype since v1 | The brief and `ltbuttongroup.md` ask for the product's look; the persona's icon rule, with no triangle in lucide, rules the octicon out. The structure follows the screenshot exactly; only the glyph differs. Question 27 |
| C30 | Two words for one person | v4 item 7: the product's **Owners** filter | `ux-text-guidelines.md` §6: one term per concept. Brief 4 and answer 3: the row says who created the project, and owner and creator are the same person for now | **Owners** on the filter, *Created by {name}* on the row; the filter lists the creators | Both strings come from Rajat's briefs. Until the product tells owners from creators, the two words name one person. Question 26 |
| C31 | A filter with no values | v4 item 7: **Products**, as in the product | `mock-data.md`: "Use only the values on this page" and "If a field you need is not here, flag it instead of guessing"; it names no products, and no product per project | The **Products** button, as shown; pressing it shows a toast, *The Products filter opens here.* | Inventing products, and which project belongs to which, would make the filter claim something the product may not do. Question 25 |
| C32 | Create Project's caret | v4 item 7: a button group, as the screenshot shows: **Create Project**, then a caret opening **Import data** | `project-listing.md` §3: one `LTButton` with `trailingIcon` for the caret. `ltbuttongroup.md`: the split button is compositional, `LTButtonGroup` around an `LTButton` and an `LTActionMenu` whose anchor is an `LTIconButton` (story-verified 11 Sep 2026) | The split button of `ltbuttongroup.md`: lucide `Notebook` on **Create Project**, as the product shows it; a 200px menu under the caret, right edges aligned, holding **Import data** with lucide `FolderInput`; both answer with a toast | The brief and `ltbuttongroup.md` agree; `project-listing.md` predates the split button's story (§9) |
| C33 | Two kinds of middle dot | v4 item 2: a middle dot between the next milestone, the test instance count and the ongoing actions; the screenshot's milestone already holds one (*UAT Round 2 · Oct 23, 2026*) | `ux-text-guidelines.md` §1 rule 5: each string has exactly one reading; §2: a middle dot separates related fragments | *Your next milestone: UAT Round 2, due Oct 23, 2026* | With dots now between the parts, a dot inside the milestone would read as one more part, its date standing alone. A comma and *due* keep the date with its milestone, and say what the date is |

## 7. Design decisions [proposed]

- **For You is where the page opens** (answer 1), while Your Projects leads the default order (v3 item 11). Each user's order could decide instead: question 17.
- **For You is a pane and a panel, like the listings inside a project** (v2 item 2). The pane is the 320px simple-list step; the panel takes the rest, full width, since a page with a pane runs full width (README §2).
- **All Projects leads the pane, selected on arrival** [proposed]. It mirrors the listings' root row (*All Test Cases*), and it keeps the cross-project view: every test instance assigned to you, and your milestones across projects, soonest first, so your next milestone is the first row (brief 3.2). Rejected: opening on the first project, which hides the rest of your work behind a click.
- **Projects in the pane order by the newest assignment**, so new work rises. Rejected: alphabetical, which buries what changed.
- **Switching projects keeps the open tab**, so comparing milestones across projects is one click each.
- **A milestone row says why it is yours**: *Owned by* and *Created by*, with *you* where it applies (answer 6).
- **Your Projects opens on your projects, then Show All** (v2 item 7, v3 item 7). Starred first, then recently used, then the rest by update; the whole list is a URL of its own, so Back is the way back, and it paginates like every other list. Focus goes to the first new row.
- **Starring never moves the row you just starred.** The order is set when the tab opens. A row jumping away from the pointer is the hostile kind of motion.
- **A whole row opens its item, through the title link** (v2 item 5). The hover underline promises a click anywhere; the link keeps one stop per row for the keyboard. Rejected: underlining on hover with no row click, which promises what it does not do.
- **The row and the card read top down in three levels** (v4 item 6): what the project is (its name and tags), its facts (the counts, the creator, the last update), then what needs you; an inactive note comes last. Every line sits 8px from the next, and the 24px actions trigger overhangs its 18px line rather than growing it, so rows with and without actions keep one rhythm.
- **The star is the one control left at a row's side** (v4 item 1 took the other), centred on the name's line, where GitHub's repository list puts its star.
- **A card keeps its facts near the top and its provenance in its foot**, so the cards in a row line up by their feet.
- **The view switch keeps its place before Create Project** (v4 item 7): the product's toolbar has no view switch, and the primary action stays at the end of the row.
- **A meta line clips sideways only**, so a focus ring or a 24px target on it shows whole above and below.
- **The unassigned test instance count is a link** to the filtered list: a question with its answer one click away.
- **The popover counts queued actions as ongoing**, since they will run without anyone touching them, and says *Queued* in each one.
- **The list and grid setting is shared by Your Projects and Archived**, since it is one preference about projects.
- **The project name opens the project's test case listing**, and counts as a visit, wherever it is opened from.
- **A test instance without a configuration says so** (*Needs a configuration*), rather than leaving a gap: it is the state the project rows count (brief 8).
- **Overlays hand focus back.** The popover, the tag overlay and the switcher are portaled, so Tab past their ends closes them and returns focus to their trigger; Create Project's menu returns focus to its caret.
- **The switcher groups its list** (v3 item 2): *Recently used*, *Starred*, *Other projects*, under headings, as `ltselectpanel.md` asks for natural categories. GitHub's flat list says less: a heading tells you why a project sits where it does.
- **The switcher lists archived projects too**, last and tagged *Archived*, since an archived project still opens, read-only. Question 19.
- **Recently used means the last 4 projects opened**, the same count as Your Projects (question 15), archived ones included.
- **A plain click switches and closes; a modified click opens a tab and keeps the panel open**, so several projects can be opened in a row (v3 item 5).
- **The test case listing keeps its frame in every state**: the folders, the head and the filter bar stay, and only the list's place changes (`test-entity-listing.md` §4).
- **A selected test case row takes the orange bar and the grey fill** (README §1: selection is both, everywhere).
- **A row checkbox is named by the test case ID** (*Select #TC-71953*), not by the title the pattern's sketch uses: titles repeat (two rows on Web app's first page share *Filter and Verify Product Search Results*), and IDs never do.
- **Select-all says what it covers**: *Select all test cases on this page* (`ux-text-guidelines.md` §1 rule 5: a qualifier where it removes doubt).
- **Only the test case listing is built inside a project** (v3 item 1). Test Runs and Milestones keep their real counts and answer with a toast.
- **The tab order is a per-user setting**, beside the view and the stars, and, like them, would live on the account in the product.

## 8. Copy

All strings follow `ux-text-guidelines.md`.

| Where | String | Rule |
|---|---|---|
| Tabs | Your Projects · For You · Archived | §2 page headings up to 4 words in Title Case; the tab names its view (`ltunderlinenav.md`) |
| Tab menu | Move left · Move right · Reset tab order · Already the first tab · Already the last tab · Already in the default order | §2 action-menu items in sentence case; `ltactionmenu.md`: the reason in the item text, positive, no full stop |
| For You | Projects · All Projects · 16 test instances · 5 milestones · *Test instances assigned to you and milestones you own or created.* · Test Instances · Milestones · Needs a configuration · Assigned 2 hours ago · Owned by Darth Vader · Created by you · 2 days left · Oct 23, 2026 | §2 Title Case for headings of 4 words or fewer, sentence case for labels; §3 empty values name the state; §7 deadlines carry the absolute date |
| Your Projects | Your Projects · *Projects hold all your test case information.* · Search projects · Owners · Tags · Products · List · Grid · Create Project · More ways to create a project · Import data · **Show All** | §2 sentence case for labels and menu items, Title Case for buttons and standalone action links |
| Row | +1 · Show +1 more tag · Tags of Desktop website · 1.24k · 38 · Created by Ritika Sharma · Updated 4 days ago · Your next milestone: UAT Round 2, due Oct 23, 2026 · Test instances: 12 unassigned · 3 ongoing actions · Star Web app · Unstar Web app | §2 k for numbers over 999, a middle dot between parts (C33); §3 Tooltips name the action; C22 |
| Tooltips | ritika.sharma@dundermifflin.com · Oct 17, 2026, 08:13 AM · Switch project | `mock-data.md` email and timestamp formats; §2 no full stop |
| Inline message | *Inactive since Jul 14, 2026.* | `ltinlinemessage.md`: one clause with a full stop |
| Popover | 3 ongoing actions · Import test cases from CSV · 312/1.24k test cases · 25% · ~4m 10s left · Estimating time left… · Running · 4m 12s · Started by Ritika Sharma · Copy test cases to Payments · Queued · 2m 5s · Started by Darth Vader · **View All Actions** · Close | `project-actions-listing.md` §1.1 and §3.4 grammar; §7 elapsed time (C12); §2 standalone action links in Title Case |
| Drawer | Retired with the drawer (v4 item 1); its strings stay in §8b | |
| Archived | Archived · *Archived projects are read-only. Their test cases and test runs stay as they were.* · Read-only · Archived on Aug 22, 2026 by Darth Vader | §2 |
| Switcher | Switch project · Search projects · Recently used · Starred · Other projects · Archived · 0 matches for "{query}" · *Project list failed to load. Try again.* | §2 sentence case for headings and labels; §3 Error messages: "{object} failed to {verb}. Try again." |
| Test case listing | Test Cases · Test Runs · Milestones · Folders · All Test Cases · Regression · Checkout · Payments · Add Test Case · Read-only · Select all test cases on this page · Select #TC-71953 · 12 test cases selected · Search by test case ID or title · Tags · Filter tags · 0 tags in this project · Test case ID · Updated 1 day ago by Mehmed Dracul · Previous · Next · Page 2 | §2 page headings in Title Case, a label that starts with a number keeps the rest lowercase (*12 test cases selected*); `test-entity-listing.md` §3.3 (its placeholder, in sentence case) |
| Empty, error | §5 | §3 Empty states and Error messages |
| Announcements | Web app starred · Web app unstarred · 2 matching projects · 7 projects (after a search, a filter or Show All) · {n} matching test cases · Archived moved to position 1 of 3 · Tab move canceled · Tabs back in the default order | §3 Silent success still speaks. The view switch needs none: its radios speak their state |
| Toasts (stubs) | *The 12 unassigned test instances in Web app open here.*, *The Actions tab of Web app opens here.*, *UAT Round 2 in Web app opens here.*, *The Test Runs tab of Web app opens here.*, *Test case #TC-71953 opens here.*, *The test case form for Web app opens here.*, *The project form opens here.*, *The data import opens here.*, *The Products filter opens here.* and the like, one per destination this prototype links to and does not build | The convention of the earlier prototypes |

### 8b. The drawer's copy: the screenshot, and what changed (retired with the drawer, v4 item 1)

v3 item 6's screenshot is the product's drawer. Its structure was kept whole; these strings changed to meet the house guide. The drawer left the prototype with its button (v4 item 1); the table stays as a record, since the product's drawer still shows the strings on the left.

| Where | Screenshot | Now | Rule |
|---|---|---|---|
| Name, placeholder | Enter Test Run name | Enter a test run name | `ux-text-guidelines.md` §2: mid-sentence, only proper nouns and product names take capitals; §1 rule 1, reads naturally |
| Name, caption | The unique name for your Test Run. | The unique name for your test run. | §2 mid-sentence casing |
| Description, placeholder | Add description to the Test Run | Add a description to the test run | §2 mid-sentence casing; §1 rule 1 |
| Description, caption | A brief overview of the test run's purpose | A brief overview of the test run's purpose. | §2: helper text ends with a full stop |
| Tags, label | Tag(s) | Tags | §1 rules 1 and 6: the plain plural; §2: no punctuation in labels |
| Tags, placeholder | Add Tags separated by enter | Add tags separated by Enter | §2 mid-sentence casing; *Enter* names the key, as in `manual-test-case-summary.md` |
| Tags, caption | Keywords to help categorize and filter the Test Run. | Keywords to help categorize and filter the test run. | §2 mid-sentence casing |
| Type, options | Non KaneAI Generated · KaneAI Generated | Non KaneAI generated · KaneAI generated | §2: labels in sentence case; the names stay (C19) |
| Type, caption | Define the source of test cases for this Test Run | Define the source of test cases for this test run. | §2 mid-sentence casing; helper text ends with a full stop |
| Foot note | *Required fields are marked with an asterisks (\*).* (italic) | Required fields are marked with an asterisk (\*). | Grammar: one asterisk. Not italic: `guidelines/README.md` §3 has no italic style, and emphasis comes from words and weight (`ux-text-guidelines.md` §3) |
| Submit | **Create Test Run**, disabled | **Create Test Run**, always active | C20 |

## 9. Gaps found in design-context

Recorded, not changed. Each is a candidate for a design-context pull request once Rajat decides.

- **`mock-data.md` has no milestones.** Milestones exist in the product (`test-instance-details.md`: the project nav's *Milestones*), but with no names, fields, dates or format. The prototype names them from the qualifiers in the approved test run names (*Release 8.4*, *Sprint 42*, *UAT Round 2*, *Release Candidate 12.1*) and gives each an owner, a creator and a due date (question 13).
- **`mock-data.md` has no project tags.** The prototype uses the two the project listing screenshot showed (*Zephyr Scale Import*, *report*, `project-listing.md`) and the approved environment values (*prod*, *stage*, *dev*).
- **`mock-data.md` has 9 project names** against a volume rule of 15 to 25 rows, and none is long, though the pattern asks for a very long project name as its awkward row. The awkward rows here are a project with 0 test cases and 0 test runs, single-word creators (*Oppenheimer*, *Kokushibo*), the longest cast name, and a 3840x1600 configuration.
- **`mock-data.md` has no folder names**, and no test case priority, platform or type values. The folders here are the three in `project-actions-listing.md` (*Regression*, *Checkout*, *Payments*); the meta line leaves the rest out (C24).
- **A test case's *Status* is unsettled.** `mock-data.md` applies the execution vocabulary to test cases and also names a lifecycle set (`ready`, `live`, `not automated`), with its own TO FILL on whether the product's *Status* and *Automation Status* are one axis or two. The rows show the execution status, as the pattern's row does (`not started` in its sketch); the *Status* filter waits on the answer (C24).
- **No concept of a visit or of inactivity** anywhere in design-context. Both are defined in §4; inactivity at 90 days by Rajat's answer.
- **No favourite or star pattern**, no `icons.md` entry for it, and no star colour token. The prototype uses lucide `Star`, outline or filled, and fills it with `attention.fg` (`#9a6700`), the nearest token; the shape carries the state, never the colour alone.
- **The product's test case and test run icons are not in design-context.** `icons.md` names no icon for either and sends in-house icons to `assets/icons/` and its `index.json`, and neither exists on `main`. The prototype draws the test case icon on lucide's grid and uses lucide `Route`, flipped, for test runs (C26). `icons.md`'s fill-follows-size rule gives 12px icons the filled variant; beside 12px meta text the prototype has 16px outline icons, since lucide has no filled set (C18).
- **No archived state for a project.** The `archived` status and its `Archive` icon exist for test entities (`mock-data.md`); the prototype borrows them.
- **No card component.** Grid cards are composed from `LTBox`, as SmartUI's are.
- **`LTInlineMessage` documents no text prop** (`className`, `size`, `sx`, `variant` only). The prototype passes the message as children; confirm against `ltinlinemessage--default`.
- **`LTTextInputWithTokens` documents no label and no way to pass its tokens in** (`onTokenAdd`, `removeToken`, `placeholder`, `size` and a few more). The prototype labels it with `LTFormControl` and lets it keep its own tokens.
- **`LTSegmentedControl` `options`, `LTUnderlineNav` `navs`, `LTTabNav` `items`, `LTNavList` `listItems`, `LTBreadcrumbs` `items`, `LTRadioGroup` `options` and `LTActionMenu` `options` shapes** are still TBD.
- **`LTSelectPanel`'s anchored variant is unverified in the component.** Its props (`onApply`, `cancelButtonText` defaulting to *Reset*) suggest a footer; the save-on-close behaviour here is the guideline's, not observed in the story.
- **`LTSelectPanel` documents nothing for a switcher**: no single-choice mode, no options that are links, no group headings in `options` (shape TBD), and no anchor other than its own button. `ltselectpanel.md` describes single-select and groups, so the behaviour is sanctioned; the props are not. The switcher is composed to its anatomy (v3 item 2).
- **`LTBreadcrumbs` has no slot for a control after a crumb**, so the switcher's caret is composed beside the last one (C21).
- **`LTLabelGroup` documents only `children`.** Primer's LabelGroup has `visibleChildCount` and `overflowStyle`; whether LT's passes them through is unknown, so *+{n}* is composed with `LTAnchoredOverlay` (C22). `ltlabelgroup.md` points to `primer-dos-donts/label-group.md` for detail, and no `primer-dos-donts/` folder exists on `main`.
- **`LTAnchoredOverlay` documents no prop for a custom anchor**, though its `ltanchoredoverlay--custom-component-anchor` story shows one.
- **design-context disagrees with itself in four places:**
  - *A disabled button.* `manual-test-case-summary.md` records *Save Changes* disabled until the form is dirty as "confirmed correct"; `ltbutton.md` says never disable (C20).
  - *Instructing placeholders.* `manual-test-case-summary.md` uses *Enter description* and *Add tags separated by Enter*; `ltinputbox.md` says a placeholder is only an example (C28).
  - *A row checkbox without a visible label.* `test-entity-listing.md` §3.3 and §3.4 name the checkboxes by `ariaLabel` only (*Select all*, *Select {title}*); `ltcheckbox.md` says "Never visually hide a checkbox's label." The prototype follows the pattern: in a list, the row is the label.
  - *The row title's size.* `test-entity-listing.md` §3.4 sets it in `SMALL_BOLD` (12px); `guidelines/README.md` §3 (11 Sep 2026) sets list-row titles in `SUBHEADER_BOLD` (14px). The prototype follows README §3.
- **Props beyond the manifest.** Audited 21 Oct 2026 against `data/components.json` (the same props as `COMPONENTS.md`). v2's §2 said every prop it used was documented; that was wrong for `LTTooltip`, which documents `delayDuration`, `direction` and `wrap`, and not the `text` and `type` this spec uses. The prototype's look-alikes also take these, each standing in for something the manifest leaves unnamed:
  - `LTSelectPanel`: `searchPlaceholder`, `emptyText`, `width` (*Filter people*, *Filter tags*, *0 tags in this project*, 320px).
  - `LTRadioGroup`: `required`, for the visible asterisk; the manifest has only `ariaRequired`.
  - `LTPagination`: `hrefFor`, so every page is a link (`ltpagination.md`: every page gets its own URL); `pageCount` is the story-verified one.
  - `LTDrawer`: `dirty` and `initialFocusRef`, and the imperative `closeDrawer` beside the story-verified `openDrawer`.
  - `LTActionMenu`: `onSelect`, `align` and `ariaLabel`; `open` and `onMenuToggle` are story-verified.
  - `LTUnderlineNav`: `current`, where the manifest has `ariaCurrent`.
  - `LTIconButton`: `tooltipText`, `shortcutLabel`, `pressed`, `expanded`, `controls`, `haspopup`, `unsafeDisableTooltip`, `iconClassName`.
  - `LTToken`: `text` and `onRemove`. `LTTextInputWithTokens`: `id` and `describedBy`.
  - `LTButton`: `form` and ARIA attributes, passed through to the button (`form` let the drawer's submit, in its footer, submit the form; unused since v4).
  - `LTInputBox`: `onKeyDown` and `keyshortcuts`. `LTTestStatusLabel`: `bare`. `LTAvatar`: `decorative`. `LTFlash`: `action`. `LTLink`: `onClick`. `LTAnchoredOverlay`: `anchor`.
  - `className` on `LTCounterLabel`, `LTTag`, `LTMetaData`, `LTLink`, `LTTextarea`, `LTFormControl`, `LTLabelGroup`, `LTProgressBar`, `LTRadioGroup`, `LTTestStatusLabel` and `LTFlash`, a styling hook only.
- **No products.** `mock-data.md` names no LambdaTest products for the Products filter, and no product per project, so the filter answers with a toast (C31).
- **`project-listing.md` models Create Project as one button with a caret** (`trailingIcon`); the product's is a split button, the compositional one `ltbuttongroup.md` sets out (C32).
- **The split button's caret is a Primer octicon** in `ltbuttongroup.md`'s story (`TriangleDownIcon`), and lucide has no triangle-down, so the house icon set cannot draw the product's caret (C29).
- **`smartui-build-screenshots.md` cites itself wrongly:** its component table points the view toggle's role to "delta 4", and §5 numbers that delta 2.
- **`icons.md` is mostly TO FILL**, and names no icon for milestones, test instances, ongoing actions, list and grid, or reordering. The prototype pins lucide-react **1.58.0** and uses only names confirmed present (README).
- **The collapsed rail's Test Manager icons are unnamed** (`platform-sidebar.md` names four, not which). The prototype shows Test Manager only.

## 10. Open questions

Questions 1 to 10 were answered on 21 Oct 2026 (§1b). Question 11 (the drawer's screenshot) and question 14 (the icons) were answered by v3 (§1c). Questions 18, 21 and 22 left with the drawer (v4 item 1). Still open:

12. **All Projects in For You's pane:** keep it, selected on arrival, or open on the first project?
13. **What else does a milestone carry** (a start date, a status, its test runs, progress)? As built: name, owner, creator and due date.
15. **Recently used:** how many projects count (4 as built, on Your Projects and in the switcher), and from how far back?
16. **Since you last visited:** with the PM (v2 item 3). If it returns, answer 2 stands: only other people's changes count.

New with v3:

17. **Where should the page open:** on For You (answer 1, as built), or on the first tab in each user's order?
19. **Should the switcher list archived projects?** As built: yes, last, tagged *Archived*, opening read-only.
20. **On the test case listing, which of the pattern's controls should the prototype add:** Generate with AI, Sort, Status, More, the row menu, the folder tools? Each needs values design-context lacks (C24).
23. **A visible way to reorder tabs**, for people who never drag or right-click a tab (C27)?
24. **Should the test case and test run icons name themselves on hover and focus** (*Test cases*, *Test runs*), now that the words are gone (C18)?

New with v4:

25. **What does the Products filter list, and which products does each project belong to?** Until then it answers with a toast (C31).
26. **Owners or Created by:** which word for the one person? The filter says *Owners*, as the product does; the rows say *Created by*, as brief 4 does (C30).
27. **Carets:** keep lucide's chevron, or draw the product's triangle, which lucide lacks (C29)?
28. **Import data:** what does it import, and into what? As built, a toast.

## 11. When this ships into design-context/

- [ ] Amend `patterns/project-listing.md` with the attached tabs and their per-user order, For You's pane and panel, the toolbar with its split button, the row and the card in three levels, the line of what needs you, the *+{n}* overflow, **Show All** as a link and the states; record C1 to C33 as deltas.
- [ ] Amend `patterns/topbar.md` with the project crumb and its switcher (C21), and answer its open question 4.
- [ ] `patterns/test-entity-listing.md`: the empty, loading and error states as built here; the row checkbox named by ID; and the row title's size (§9).
- [ ] `mock-data.md`: milestones (fields and names), project tags, folder names, test case priority, platform and type, more project names (including a long one), and the visit and inactivity values.
- [ ] `icons.md`: lucide 1.58.0 and the names this page uses (README), and the product's test case and test run icons in `assets/icons/` (C26).
- [ ] `guidelines/`: the hover popover holding data (C3, with the automation details prototype's C20), tooltips on names and dates (C13, with its C1), the star toggle, the whole-row click, per-user view and tab-order preferences, reordering without drag (C27), and the four places design-context disagrees with itself (§9).
- [ ] FE asks: a card component, a documented text prop on `LTInlineMessage`, a label and a tokens prop on `LTTextInputWithTokens`, a switcher mode for `LTSelectPanel`, a trailing slot on `LTBreadcrumbs`, the overflow props on `LTLabelGroup`, a custom-anchor prop on `LTAnchoredOverlay`, a visible required mark on `LTRadioGroup`, and the `options`, `navs`, `items` and `listItems` shapes.
