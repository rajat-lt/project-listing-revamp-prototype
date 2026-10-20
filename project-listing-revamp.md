# Project listing revamp: For You, Your Projects, Archived

Test Manager's project listing page, revamped from Rajat's brief of 21 Oct 2026 (12 points). Written in the `design-context/patterns/` house format, as an amendment proposal for `patterns/project-listing.md`. The working prototype in this repo implements it.

Precedence, as the house workflow sets it: **Rajat's brief > design-context guidelines > screenshots**. This brief came without screenshots. Every conflict between the brief and the guidelines is recorded in §6, never resolved silently.

Sources, all read from `design-context` `main` (`e014a73`) on 21 Oct 2026: `ux-persona.md`, `ux-text-guidelines.md`, `guidelines/README.md` and the component files (`ltunderlinenav.md`, `ltsegmentedcontrol.md`, `ltinlinemessage.md`, `notification-messaging.md`, `ltpopover.md`, `lttooltip.md`, `lttag.md`, `ltlabelgroup.md`, `ltcounterlabel.md`, `ltprogressbar.md`, `ltpagination.md`, `lticonbutton.md`, `ltlink.md`, `ltbutton.md`, `ltactionmenu.md`, `ltselectpanel.md`, `ltinputbox.md`, `ltflash.md`, `ltmodal.md`, `ltbuttongroup.md`), `patterns/project-listing.md` (the base), `patterns/topbar.md`, `patterns/platform-sidebar.md`, `patterns/test-entity-listing.md`, `patterns/test-instance-details.md`, `patterns/smartui-build-screenshots.md` (the list and grid precedent), `COMPONENTS.md`, `mock-data.md`, `icons.md` and `data/tokens.json`. Two sources outside the repo, both Rajat's own: `project-actions/project-actions-listing.md` (11 Sep 2026), the house definition of a project's long-running operations, and the notification-center prototype, whose Test Manager top bar this page reuses.

Every component and prop below was read from `COMPONENTS.md`. Structured prop shapes the manifest leaves undocumented are marked `TBD` with the story that shows them. Proposals carry **[proposed]**.

---

## 1. What this page is

The entry point to Test Manager, still with no project selected. Today it is one list of projects (`patterns/project-listing.md`). The revamp turns it into three views, each with its own URL:

| Tab | Answers | Brief |
|---|---|---|
| **For You** (default) | What do I need to do, what is due, and what changed while I was away? | 2, 3 |
| **Your Projects** | Which project do I open, and which one needs attention? | 2, 4 to 11 |
| **Archived** | Where did the old projects go? | 2, 12 |

Brief point by point:

| # | Brief | Where it lands |
|---|---|---|
| 1 | Revamp, more useful | The whole page |
| 2 | Tabs below the top bar: For You, Your Projects, Archived | `LTUnderlineNav`, page-primary, one URL per tab (C1, C2) |
| 3.1 | Test instances assigned to me: test case ID, version, test run, configuration if any, assigned by, assigned date, status icon | For You, *Assigned to you*, grouped by project |
| 3.2 | My next milestone, if any | For You, *Your next milestone* card; also per project row |
| 3.3 | Changes since my last visit, as a count | For You, *Since you last visited* |
| 4 | Per project: name, tags, test case count (automated percentage), test run count, my next milestone, last updated, creator | Project row and card |
| 5 | Recently used projects on top | Your Projects, *Recently used* strip above the list |
| 6 | Star a project | Star toggle on every active project; starred projects lead the list |
| 7 | List or grid, remembered per user | `LTSegmentedControl`, icon-only, stored per user |
| 8 | Unassigned test instances and test instances without a configuration, per project | Row line *Test instances: 12 unassigned · 4 need a configuration* (C6) |
| 9 | Create a test run from each project | **Create Test Run** on every active project |
| 10 | *Inactive since* inline message | `LTInlineMessage` `info` on the inactive project (C4) |
| 11 | Ongoing operations count, list on hover | *3 ongoing actions*, opening an `LTPopover` (C3, C5) |
| 12 | Archived projects, read-only | Archived tab |

## 2. Component inventory

| Component | Role | Props used (all in `COMPONENTS.md`) |
|---|---|---|
| `LTUnderlineNav` | For You · Your Projects · Archived | `navs` (shape TBD → `ltunderlinenav--with-counters`), `ariaLabel`, `size="medium"`. Counters on Your Projects and Archived |
| `LTText` | `h1` per tab, section headings, meta | `HEADER_BOLD` for the `h1`, `SUBHEADER_BOLD` for sections, `SMALL_REGULAR` for meta (`guidelines/README.md` §3) |
| `LTCounterLabel` | Tab counts; *Assigned to you* count | `count`, `scheme="secondary"` |
| `LTLink` | Project names, test instance titles, the two test instance counts, milestone names, **View All Actions** | `href`, `label`, `muted` for the counts |
| `LTLabelGroup` + `LTTag` | Project tags; *Read-only* on archived projects | `text`, `labelStyle="outline"`, `variant="blueAccent"` for tags, `variant="secondary"` for *Read-only* |
| `LTTestStatusLabel` | Test instance status; ongoing action status; archived project status | `status`, `showStatusText={false}` in lists, `width`, `height` |
| `LTMetaData` | The `·`-separated meta lines | `value`, `leadingIcon`, `showLeadingDot`, `size="small"` |
| `LTAvatar` | Assigner in For You | `initials`, `name`, `size={20}`, `type="circle"` |
| `LTInlineMessage` | *Inactive since {date}.* | `variant="info"`, `size="medium"` (`ltinlinemessage.md`: medium whenever it fits). The text has no documented prop; passed as children (§9) |
| `LTPopover` | Ongoing actions on hover | `heading`, `popOverbodyJSX`, `direction`, `canChangeDirection`, `containsInteractiveChildElement`, `forceClose` |
| `LTProgressBar` | Progress of a running action; automated share on grid cards | `segments=[{ id, progress, style }]` (story-verified), `size="small"`. No `ariaLabel`: the value is written beside each bar, and a label that repeats it doubles up for screen readers (`ltprogressbar.md`) |
| `LTSegmentedControl` | List or grid | `isIconButton`, `showTooltip`, `options` (TBD → `ltsegmentedcontrol--icon-buttons`), `selectedValue`, `onChange`, `ariaLabel`, `role="radiogroup"` (C8) |
| `LTInputBox` | Search projects | `inputOnly`, `type="search"`, `variant="default"`, `allowClearSearch` |
| `LTButton` | Created by and Tags filter triggers; Create Project; Create Test Run | Filters: `variant="outline"`, `counter`, caret via `trailingIcon` (`guidelines/README.md` §5), and an accessible name that says what is chosen, *Created by: 2 selected* (`ltselectpanel.md`); the visible text stays *Created by 2*. Create Project: `variant="primary"`, no caret (C9). Create Test Run: `variant="outline"`, `size="small"` |
| `LTSelectPanel` | Created by and Tags filters, multi-select | Anchored: saves on close (`guidelines/ltselectpanel.md`). `title`, `buttonLabel`, `defaultValues`, `onApply`, `cancelButtonText` (*Reset*, the default), `showCountOnCta`. `options` TBD → `ltselectpanel--select-panel`. 320px wide, so the longest cast name fits |
| `LTIconButton` | Star toggle; popover close | `icon`, `ariaLabel`, `variant="invisible"`, `size="small"`, `tooltipDirection` |
| `LTBlankSlate` / `LTLoader` / `LTFlash` | Empty, loading, error | Required on every list (`guidelines/README.md` §1) |
| `LTToast` | Results the user cannot see | top right, 4 seconds |
| `LTBox`, `LTDivider` | Layout, row separators, grid cards | Rows sit in one bordered container (`project-listing.md` delta 4) |

**Composed, and flagged (§9):** the grid card (no card component exists among the 69, the SmartUI precedent), the *Recently used* card, the milestone card, the vertical rule in the top bar, and the wrapping meta line: when a line of `LTMetaData` wraps, the new line never starts with a middle dot.

**Deliberately absent:** `LTPagination` (7 active and 2 archived projects fit one page, and pagination never renders for a single page, `guidelines/ltpagination.md`), the row `LTActionMenu` (C9), `LTCheckbox` (project rows are not selectable, `project-listing.md` §7).

## 3. Structure

### 3.1 Shell

The platform shell, unchanged: the 56px rail with Test Manager active (`platform-sidebar.md`), and the top bar at depth 1 (`topbar.md`): the plain label *Test Manager* on the left; on the right *Credits: 20k*, a separator, **Recent Tests**, Announcements, the notifications bell, the avatar (`RS`, Ritika Sharma, the signed-in user) and **Upgrade Now**. Both sit on `canvas.subtle`; page content stays white.

### 3.2 Tabs and the column

```jsx
{/* One centred column: 112px each side, 1232px at 1512, 1000px at 1280
    (guidelines/README.md §2). The nav sits at the top of that column,
    aligned left and no wider than the content it controls
    (guidelines/ltunderlinenav.md). navs shape TBD → ltunderlinenav--with-counters */}
<LTBox styles={{ maxWidth: "1232px", margin: "0 auto" }}>
  <LTUnderlineNav ariaLabel="Projects" size="medium" navs={[
    /* For You: no counter. It holds three kinds of rows, and a tab badge
       counts the rows inside the tab (ux-text-guidelines.md §7). */
    { id: "for-you", label: "For You", href: "#/for-you" },
    { id: "projects", label: "Your Projects", href: "#/projects", counter: 7 },
    { id: "archived", label: "Archived", href: "#/archived", counter: 2 },
  ]} />
  {/* Each tab carries its own h1, the title of the view the tab opens. */}
</LTBox>
```

### 3.3 For You

Two columns inside the 1232px column: the work on the left, the context on the right, at 320px (the pane scale's simple-list step, `guidelines/README.md` §2). 888px and 320px at 1512; 656px and 320px at 1280.

```jsx
<LTText as="h1" variant="HEADER_BOLD" text="For You" />
<LTText variant="SUBHEADER_REGULAR"
  text="Test instances assigned to you, your next milestone, and what changed since you last visited." />

<LTBox styles={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px" }}>
  <section aria-labelledby="assigned">
    <LTText as="h2" id="assigned" variant="SUBHEADER_BOLD" text="Assigned to you" />
    <LTCounterLabel count={16} />
    {/* Grouped by project: the project is the context every row needs, and
        repeating it in 16 rows is noise. Groups follow your recent visits. */}
    {groups.map(g => (
      <ProjectGroup key={g.project} heading={<LTLink label={g.project} />} count={`${g.rows.length} test instances`}>
        {g.rows.map(ti => <AssignedRow key={ti.id} ti={ti} />)}
      </ProjectGroup>
    ))}
  </section>

  <aside>
    {/* Hidden when there is none: an empty value is omitted, never filled
        with "No milestone" (ux-text-guidelines.md §3, the topbar's
        omit-never-empty rule). */}
    {next && <MilestoneCard milestone={next} />}
    <SinceLastVisit projects={recent} />
  </aside>
</LTBox>
```

An assigned test instance, two lines and a right column. The title is the test case's own (`mock-data.md`: a test instance inherits its test case's title, and every list shows title, configuration, version and status):

```jsx
<LTBox styles={{ display: "flex", gap: "12px", padding: "12px 16px" }}>
  {/* Status icon, filled, as on the test instance listing. The word is the
      accessible name; the glyph shapes differ, so colour is never alone. */}
  <LTTestStatusLabel status={ti.status} showStatusText={false} width={16} height={16} />
  <LTBox styles={{ flex: 1, minWidth: 0 }}>
    {/* One line, cut with an ellipsis; the full title shows on hover. */}
    <LTLink label={ti.title} />
    {/* The meta line of the test instance listing (test-entity-listing.md
        §3.4), with the test run added, since this list spans runs. Without a
        configuration the line names the state, as the project rows do (C6). */}
    <LTMetaData value={ti.testCaseId} showLeadingDot={false} />   {/* #TC-225 */}
    <LTMetaData value={ti.version} />                              {/* v2 */}
    <LTMetaData value={ti.testRun} />                              {/* Regression Suite - Release 8.4 */}
    {ti.config
      ? <><LTMetaData value={ti.browserOs} /><LTMetaData value={ti.resolution} /></>  /* Chrome 120 on Windows 12 · 1920x1080 */
      : <LTMetaData value="Needs a configuration" />}
  </LTBox>
  <LTBox styles={{ flex: "0 0 200px" }}>
    <LTText variant="SMALL_REGULAR" text={`Assigned ${ti.assignedAt}`} />  {/* 2 hours ago, or Sep 03, 2026 */}
    <LTAvatar initials={ti.by.initials} name={ti.by.name} size={20} /> {ti.by.name}
  </LTBox>
</LTBox>
```

### 3.4 Your Projects

```jsx
<LTText as="h1" variant="HEADER_BOLD" text="Your Projects" />
<LTText variant="SUBHEADER_REGULAR" text="Projects hold all your test case information." />

{/* Brief 5. Up to 4, most recent first. Hidden while a search or filter is
    applied, so it never sits above results it does not belong to. */}
<section aria-labelledby="recent">
  <LTText as="h2" id="recent" variant="SUBHEADER_BOLD" text="Recently used" />
  {recent.map(p => <RecentCard key={p.id} name={p.name} visited={`You visited ${p.visitedAgo}`} />)}
</section>

<section aria-labelledby="all">
  <LTText as="h2" id="all" variant="SUBHEADER_BOLD" text="All projects" />
  <LTBox styles={{ display: "flex", alignItems: "center", gap: "12px" }}>
    <LTInputBox inputOnly type="search" variant="default" placeholder="Search projects"
      ariaLabel="Search projects" allowClearSearch extraStyle={{ flex: 1 }} />
    {/* Filter triggers: outline LTButton, caret, applied count in `counter`
        (guidelines/README.md §5). Both open an anchored LTSelectPanel. */}
    <LTButton variant="outline" size="medium" label="Created by" counter={undefined} trailingIcon={ChevronDown} />
    <LTButton variant="outline" size="medium" label="Tags" counter={1} trailingIcon={ChevronDown} />
    {/* Brief 7. Icon-only, two segments, tooltips, a label (ltsegmentedcontrol.md). */}
    <LTSegmentedControl ariaLabel="View" role="radiogroup" isIconButton showTooltip
      options={[/* List, Grid */]} selectedValue={view} onChange={setView} />
    <LTButton variant="primary" size="medium" label="Create Project" />
  </LTBox>
  {view === "list"
    ? <LTBox styles={{ border: "1px solid", borderRadius: "8px" }}>{rows}</LTBox>
    : <LTBox styles={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "16px" }}>{cards}</LTBox>}
</section>
```

The project row, list view. Up to four lines; a line with nothing on it is omitted:

```jsx
<LTBox styles={{ display: "flex", gap: "16px", padding: "16px 20px" }}>
  <LTBox styles={{ flex: 1, minWidth: 0 }}>
    {/* 1. Name (navigates, so LTLink, project-listing.md delta 5) and tags. */}
    <LTLink label="Web app" size="medium" />
    <LTLabelGroup><LTTag text="prod" /><LTTag text="report" /></LTLabelGroup>

    {/* 2. Facts. Brief 4's "total TC count (automated TC percentage)". */}
    <LTMetaData value="1.24k test cases (62% automated)" showLeadingDot={false} />
    <LTMetaData value="38 test runs" />
    <LTMetaData value="Created by Ritika Sharma" />
    <LTMetaData value="Updated 4 days ago" />

    {/* 3. What needs you: your next milestone, the test instances that need
        an owner or a configuration (brief 8, links into the filtered test
        instance list), and the ongoing actions (brief 11). */}
    <LTMetaData leadingIcon={Flag} value="Your next milestone: Release 8.4 · Oct 28, 2026" showLeadingDot={false} />
    <LTMetaData leadingIcon={ListTodo}>Test instances: <LTLink muted label="12 unassigned" /> · <LTLink muted label="4 need a configuration" /></LTMetaData>
    <OngoingActions project={p} />   {/* "3 ongoing actions", opens the popover */}

    {/* 4. Brief 10, only on an inactive project. */}
    <LTInlineMessage variant="info" size="medium">Inactive since Jul 14, 2026.</LTInlineMessage>
  </LTBox>

  {/* Brief 9 and 6. Create Test Run is a button on every active project; the
      star is a toggle whose name says what it will do. */}
  <LTButton variant="outline" size="small" label="Create Test Run" />
  <LTIconButton icon={Star} variant="invisible" size="small" ariaLabel="Star Web app" />
</LTBox>
```

The grid card carries the same facts, rearranged: name and star in the head, tags, the two counts, the automated share as a small `LTProgressBar` with its value beside it, the *needs you* lines, the inline message, then a footer with the creator, the update time and **Create Test Run**.

The ongoing actions popover:

```jsx
<LTPopover direction="bottom-left" canChangeDirection containsInteractiveChildElement
  heading="3 ongoing actions"
  popOverbodyJSX={<>
    {actions.map(a => (
      <ActionItem key={a.id}
        status={a.status}                 /* running | queued (project-actions-listing.md §1.1) */
        title={a.title}                   /* Import test cases from CSV */
        progress={a.progress}             /* 312/1.24k test cases · 25%, and the bar */
        elapsed={a.elapsed} />            /* Running · 4m 12s · Started by Ritika Sharma (C12) */
    ))}
    <LTLink label="View All Actions" />   {/* the project's Actions tab, project-actions-listing.md */}
  </>}>
  {/* Leading icon: the running status glyph, or queued when none runs. */}
  <LTButton variant="invisible" size="small" leadingIcon={RunningStatus} label="3 ongoing actions" />
</LTPopover>
```

### 3.5 Archived

The same list and grid, read-only. No star, no **Create Test Run**, no milestone, no test instance counts and no actions: nothing in an archived project changes. Each row leads with the `archived` status icon (`type=Archive`, `mock-data.md`) and carries a *Read-only* tag and the line *Archived on Aug 22, 2026 by Darth Vader*. Search stays, so a long archive is still findable.

## 4. Behaviour, item by item

1. **The page.** For You is the default tab. Each tab has its own URL (`#/for-you`, `#/projects`, `#/archived`) and its own `h1`; the top bar's label stays *Test Manager*.
2. **Tabs.** `LTUnderlineNav` at the top of the content column, under the top bar. Your Projects and Archived carry counters that count the rows inside them; For You carries none, since it holds three kinds of rows. Brief 2 says "2 tabs" and names three; point 12 describes the third, so all three are built (C2).
3. **For You.**
   1. *Assigned to you* lists every test instance assigned to the signed-in user, grouped by project, the groups in the order of your recent visits and the rows newest assignment first. Each row: status icon, the test case title as a link (one line, the full title on hover), then `#TC-225 · v2 · {test run} · {configuration}`, and on the right *Assigned {when}* above the assigner's avatar and name. A test instance without a configuration says *Needs a configuration*: brief 3.1 shows the configuration "if any", and an empty value names the state, never a blank (`ux-text-guidelines.md` §3), in the words the project rows use (C6). Dates are relative up to 30 days and `MMM DD, YYYY` after (`mock-data.md`).
   2. *Your next milestone* shows the soonest milestone you are part of, across projects: its name, its project, and *2 days left · Oct 23, 2026*. A deadline carries its absolute date beside the countdown (`ux-text-guidelines.md` §7). With none, the card is absent.
   3. *Since you last visited* lists the projects you visited recently, each with its count of changes made since that visit and when the visit was: *Web app · 24 changes · You visited 2 hours ago*. A change is any action by anyone else on any entity in the project [proposed]. A project with no change shows *0 changes*, the honest number.
4. **Per project.** Name, tags, *1.24k test cases (62% automated)*, *38 test runs*, *Created by {name}*, *Updated {when}*, and, when you have one there, *Your next milestone: {name} · {date}*. A project with no test cases shows *0 test cases* and no automated share.
5. **Recently used on top.** Your Projects opens with up to 4 compact cards: the projects you visited most recently, with *You visited {when}*. Opening a project counts as a visit: it moves to the front of the strip and its *Since you last visited* count resets to 0. The strip hides while a search or filter is applied.
6. **Star.** A star toggle on every active project. Starred projects come first in *All projects*, then the rest by most recently updated; a caption under the toolbar says so. Starring does not move the row under the pointer: the order is computed when the tab opens and when a search or filter changes [proposed]. The toggle's name says what it will do (*Star Web app*, *Unstar Web app*), and screen readers hear *Web app starred*.
7. **List or grid.** An icon-only `LTSegmentedControl` with tooltips (*List*, *Grid*), in the toolbar of Your Projects and of Archived, sharing one setting. It applies at once and is remembered per user: the prototype stores it under the signed-in user's ID in the browser; the product would store it on the account.
8. **Test instances that need attention.** *Test instances: 12 unassigned · 4 need a configuration*. Each count is a link to the project's test instance list, filtered to those instances. A zero count is omitted, and with both at zero the line is gone.
9. **Create Test Run.** An outline button on every active project, in the row's right cluster and in the card's footer. It opens the project's test run creation, which is outside this page.
10. **Inactive since.** A project where nobody in the org has taken any action on any entity for more than 30 days [proposed threshold] shows `LTInlineMessage` `info`: *Inactive since Jul 14, 2026.* It sits under the project's lines, beside nothing else, as an inline message must. Its date is the last action, which can be later than *Updated*: a test run executed on Jul 14 changes no project details.
11. **Ongoing actions.** *3 ongoing actions* counts the project's actions that are running or queued, the operations of `project-actions-listing.md` (imports, exports, automation, moves, copies, deletions and test run executions). Hovering it for 250ms, or pressing it, opens an `LTPopover` listing each one: status icon, title, progress as counts processed with a bar (*312/1.24k test cases · 25%*), then how long it has run or waited and who started it (*Running · 4m 12s · Started by Ritika Sharma*, *Queued · 2m 5s · Started by Darth Vader*), and last **View All Actions** (C12). It stays open when the pointer leaves, and closes with its close button, Esc or a click outside (C3). A press moves focus into it; Tab past its last control closes it and returns focus to the trigger. A project with none shows nothing.
12. **Archived.** Archived projects, read-only: the `archived` status icon, a *Read-only* tag, the counts, the creator, and *Archived on {date} by {name}*. Opening one opens it read-only.

## 5. States

| Surface | Empty | Loading | Error |
|---|---|---|---|
| Your Projects | *Start with your first project* · *Projects keep your test cases organized.* · **Create Project** (`project-listing.md` §4) | `LTLoader` | `LTFlash` `danger`: *Project list failed to load. Try again.* |
| Your Projects, filtered | *0 matching projects* · *Change or clear the filters to see more projects.* | | |
| Archived | *0 archived projects* · *An archived project stays readable here, with its test cases and test runs.* | `LTLoader` | `LTFlash` `danger`: *Archived projects failed to load. Try again.* |
| Archived, searched | *0 matching projects* · *Change or clear the search to see more projects.* | | |
| For You, assigned | *0 test instances assigned to you* · *Test instances assigned to you appear here, with their test run and configuration.* | `LTLoader` | `LTFlash` `danger`: *Assigned test instances failed to load. Try again.* |
| For You, since you last visited | *Projects you visit appear here* · *Each one shows how many changes happened since your visit.* | with the tab | with the tab |
| For You, next milestone | Absent | with the tab | with the tab |
| Ongoing actions | Absent at 0 | | |

One `LTFlash` per page at most (`guidelines/README.md` §1). The prototype shows each state with `?state=loading`, `?state=error` and `?state=empty`.

## 6. Conflicts recorded

| # | Topic | Brief | design-context | Prototype does | Why |
|---|---|---|---|---|---|
| C1 | Tabs on the root page | Tabs below the top bar | `project-listing.md` §1: primary nav **None**, no project scope exists yet | `LTUnderlineNav` For You · Your Projects · Archived, page-primary, one URL each | Brief wins. These tabs are views of the root page, not project navigation, so the pattern's reason does not apply |
| C2 | Tab count | "add 2 tabs: For You, Your Projects and Archived" | | Three tabs | Point 12 describes the Archived list, so the count is the slip |
| C3 | A popover on hover, holding data | Hover shows the ongoing operations in a popover | `ltpopover.md`: for onboarding and instructions; always a visible dismiss, Esc and click-outside. `guidelines/README.md` §5: a short tip | `LTPopover`, opening on a 250ms hover or a press, with a close button, Esc and click-outside | Brief wins on the trigger and the content; the guideline wins on dismissal. The same split as the automation details prototype's C20 and C31 |
| C4 | *Inactive since* as an alert | "alert inline message" | `ux-text-guidelines.md` §4: yellow only when the user has a decision; `ltinlinemessage.md`: `warning` likewise | `info` (blue) | Inactivity is a fact with no decision attached. If an action joins it (archive, say), it becomes a decision and `warning` (question 4) |
| C5 | One term: operations or actions | "ongoing operations" | `project-actions-listing.md`: these operations are *actions*, on an **Actions** tab; `ux-text-guidelines.md` §6: one term per concept | *3 ongoing actions*, **View All Actions** | The house already named them |
| C6 | "without configs" | Test instances without configs | `ux-text-guidelines.md` §1 rule 2 and §3 Empty states: name the state or the next step | *4 need a configuration*, beside *12 unassigned* (the guide's own empty value) | Says what to do, not what is missing |
| C7 | Owner or creator | "creator user's name" | `project-listing.md`: an owner avatar per row and an **Owners** filter | *Created by {name}* in words, and a **Created by** filter | Brief wins; one term on the row and the filter (question 3) |
| C8 | Segmented control role | List or grid | `ltsegmentedcontrol.md`: no `role` without a design decision | `role="radiogroup"`, with the radio keyboard model (one tab stop, arrows move and select) | The decision exists: `smartui-build-screenshots.md` §5 settles `radiogroup` for list and grid (its delta 2; its component table calls it delta 4, §9) |
| C9 | Pattern elements not carried over | | `project-listing.md`: a **Products** filter, a row `...` menu, and a caret on **Create Project** | All three left out | The pattern names none of their contents (its row menu is commented out), and a control that does nothing misleads in a working prototype. Recorded, not dropped silently (question 5) |
| C10 | Volume | | `mock-data.md`: 15 to 25 rows per list, and only these 9 project names | 7 active and 2 archived projects | Names are never invented; the gap is in §9 |
| C11 | The heading count | | `project-listing.md` delta 3: `LTCounterLabel` beside the `Projects` heading | The counts move to the tabs | A tab badge counts the rows inside the tab (`ux-text-guidelines.md` §7); two counters for one list is one too many |
| C12 | Time on an ongoing action | | `project-actions-listing.md` §3.4 and §3.6 (Rajat, 11 Sep 2026): *Started at 09:12 AM by {name}* and *~4m 10s left*. `ux-text-guidelines.md` §7 (8 Oct 2026): "Running work shows elapsed time, not its start time" (*Running · 14m 11s*) and "No ETA unless it is reliable. Show counts processed instead." | *Running · 4m 12s · Started by Ritika Sharma*, and *312/1.24k test cases · 25%* with no time left | design-context wins over a spec outside it, and the guide is the later word. The actions spec's own question 5 (does the backend produce ETAs) is still open (question 10) |

## 7. Design decisions [proposed]

- **For You is the default tab.** It answers the question a returning user arrives with; Your Projects is one click away and keeps the old page's job. Rejected: opening on Your Projects, which buries the brief's new content behind a click.
- **For You is two columns.** The work (assigned test instances) takes the width; the context (milestone, changes) sits in a 320px column. Rejected: three stacked sections, which push the work below the fold.
- **Assigned test instances group by project**, in the order of your recent visits. The project is context every row needs, and a heading carries it once.
- **The milestone and the empty states are omitted when empty**, never filled with *No milestone* (`ux-text-guidelines.md` §3).
- **Recently used is a strip, not a sort.** Brief 5 and brief 6 both ask for the top of the list; one list cannot be sorted by both. The strip takes recency, the list takes stars. Rejected: sorting the list by your last visit, which leaves stars nowhere to go.
- **Starring never moves the row you just starred.** The order is set when the view opens or the search changes. A row jumping away from the pointer is the hostile kind of motion.
- **Create Test Run is a visible button on every project.** The brief asks for it on each project; an icon alone would not say what it creates, and a menu would hide it (`guidelines/README.md` §5).
- **The two test instance counts are links** to the filtered list: they are questions with an answer one click away.
- **Changes since your last visit count other people's changes only**, since your own are not news [proposed].
- **Inactive means 30 days without any action**, the same boundary the house uses between recent and old (`mock-data.md`) [proposed].
- **The popover counts queued actions as ongoing**, since they will run without anyone touching them, and says *Queued* in each one.
- **The list and grid setting is shared by Your Projects and Archived**, since it is one preference about projects.
- **The project name opens the project** (stubbed here with a toast), and counts as a visit.
- **A test instance without a configuration says so** (*Needs a configuration*) in For You, rather than leaving a gap: it is the state the project rows count (brief 8).
- **The popover hands focus back.** It is portaled, so Tab past its last control would jump to the end of the page; it closes and returns focus to its trigger instead.

## 8. Copy

All strings follow `ux-text-guidelines.md`.

| Where | String | Rule |
|---|---|---|
| Tabs | For You · Your Projects · Archived | §2 page headings up to 4 words in Title Case; the tab names its view (`ltunderlinenav.md`) |
| For You | For You · *Test instances assigned to you, your next milestone, and what changed since you last visited.* · Assigned to you · {n} test instances · Needs a configuration · Assigned 2 hours ago · Your next milestone · 2 days left · Oct 23, 2026 · Since you last visited · 24 changes · You visited 2 hours ago | §2 serial comma, body ends with a full stop; §3 empty values name the state; §7 deadlines carry the absolute date |
| Your Projects | Your Projects · *Projects hold all your test case information.* · Recently used · You visited 2 hours ago · All projects · Search projects · Created by · Tags · List · Grid · Create Project · *Starred projects first, then the most recently updated.* | §2 sentence case for labels, Title Case for buttons |
| Row | 1.24k test cases (62% automated) · 38 test runs · Created by Ritika Sharma · Updated 4 days ago · Your next milestone: Release 8.4 · Oct 28, 2026 · Test instances: 12 unassigned · 4 need a configuration · 3 ongoing actions · **Create Test Run** · Star Web app · Unstar Web app | §2 k for numbers over 999, middle dot; §3 Tooltips name the action |
| Inline message | *Inactive since Jul 14, 2026.* | `ltinlinemessage.md`: one clause with a full stop |
| Popover | 3 ongoing actions · Import test cases from CSV · 312/1.24k test cases · 25% · Running · 4m 12s · Started by Ritika Sharma · Queued · 2m 5s · Started by Darth Vader · **View All Actions** · Close | `project-actions-listing.md` §1.1 title grammar; §7 elapsed time and no ETA (C12); §2 standalone action links in Title Case |
| Archived | Archived · *Archived projects are read-only. Their test cases and test runs stay as they were.* · Read-only · Archived on Aug 22, 2026 by Darth Vader | §2 |
| Empty, error | §5 | §3 Empty states and Error messages |
| Announcements | Web app starred · Web app unstarred · 2 matching projects · 7 projects (after a search or filter changes) | §3 Silent success still speaks. The view switch needs none: its radios speak their state |
| Toasts (stubs) | *The Web app project opens here.*, *The test run form for Web app opens here.*, *The 12 unassigned test instances in Web app open here.*, *The Actions tab of Web app opens here.*, *TV app opens here, read-only.* and the like, one per destination this page links to | The convention of the earlier prototypes |

## 9. Gaps found in design-context

Recorded, not changed. Each is a candidate for a design-context pull request once Rajat decides.

- **`mock-data.md` has no milestones.** Milestones exist in the product (`test-instance-details.md`, project nav), but no names, dates or format. The prototype names them from the qualifiers in the approved test run names: *Release 8.4*, *Sprint 42*, *UAT Round 2*.
- **`mock-data.md` has no project tags.** The prototype uses the two the project listing screenshot showed (*Zephyr Scale Import*, *report*, `project-listing.md`) and the approved environment values (*prod*, *stage*, *dev*).
- **`mock-data.md` has 9 project names** against a volume rule of 15 to 25 rows, and none is long, though the pattern asks for a very long project name as its awkward row. The awkward rows here are a project with 0 test cases and 0 test runs, single-word creators (*Oppenheimer*, *Kokushibo*), the longest cast name, and a 3840x1600 configuration.
- **No concept of a visit, a change count or inactivity** anywhere in design-context. All three are defined in §4 [proposed].
- **No favourite or star pattern**, no `icons.md` entry for it, and no star colour token. The prototype uses lucide `Star`, outline or filled, and fills it with `attention.fg` (`#9a6700`), the nearest token; the shape carries the state, never the colour alone.
- **No archived state for a project.** The `archived` status and its `Archive` icon exist for test entities (`mock-data.md`); the prototype borrows them.
- **No card component.** Grid cards are composed from `LTBox`, as SmartUI's are.
- **`LTInlineMessage` documents no text prop** (`className`, `size`, `sx`, `variant` only). The prototype passes the message as children; confirm against `ltinlinemessage--default`.
- **`LTSegmentedControl` `options` and `LTUnderlineNav` `navs` shapes** are still TBD.
- **`LTSelectPanel`'s anchored variant is unverified in the component.** Its props (`onApply`, `cancelButtonText` defaulting to *Reset*) suggest a footer; the save-on-close behaviour here is the guideline's, not observed in the story.
- **`smartui-build-screenshots.md` cites itself wrongly:** its component table points the view toggle's role to "delta 4", and §5 numbers that delta 2.
- **`icons.md` is mostly TO FILL**, and names no icon for milestones, test instances, ongoing actions or list and grid. The prototype pins lucide-react **1.58.0** and uses only names confirmed present (README).
- **The collapsed rail's Test Manager icons are unnamed** (`platform-sidebar.md` names four, not which). The prototype shows Test Manager only.

## 10. Open questions

1. **For You as the default tab**, or Your Projects?
2. **What counts as a change** for *Since you last visited*: everyone's, or everyone else's (as built)? Entity edits only, or runs and imports too?
3. **Owner and creator:** the same person? The live page says *Owners*; the brief says creator.
4. **Inactive projects: inform or ask?** As built, a blue message. Pair it with **Archive Project** and it becomes a yellow decision (C4). Also: is 30 days the threshold?
5. **The Products filter and the row `...` menu** from the live page: what do they hold, and should the revamp keep them (C9)?
6. **Your next milestone:** whose milestones are *yours*: ones you own, or any you are part of?
7. **Starred order:** starred first (as built), or a *Starred* filter instead?
8. **Archived projects:** can anyone restore one, and from where? This page offers nothing, being read-only.
9. **Create Test Run:** straight into the creation page (as built), or a short dialog first?
10. **Ongoing actions: elapsed time or start time, and any ETA?** As built, elapsed time and no ETA, per the text guide (C12). If the backend reports reliable estimates, the guide allows them.

## 11. When this ships into design-context/

- [ ] Amend `patterns/project-listing.md` with the three tabs, the row, the card and the states; record C1 to C12 as deltas.
- [ ] `mock-data.md`: milestones, project tags, more project names (including a long one), and the visit, change and inactivity values once decided.
- [ ] `icons.md`: lucide 1.58.0 and the names this page uses (README).
- [ ] `guidelines/`: the hover popover holding data (C3, with the automation details prototype's C20), the star toggle, and a per-user view preference.
- [ ] FE asks: a card component, a documented text prop on `LTInlineMessage`, and the `options` and `navs` shapes.
