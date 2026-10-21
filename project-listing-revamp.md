# Project listing revamp: For You, Your Projects, Archived

Test Manager's project listing page, revamped from Rajat's brief of 21 Oct 2026 (12 points), then reworked the same day by his answers to the open questions and 7 more changes (v2, §1b). Written in the `design-context/patterns/` house format, as an amendment proposal for `patterns/project-listing.md`. The working prototype in this repo implements it.

Precedence, as the house workflow sets it: **Rajat's brief > design-context guidelines > screenshots**. Neither brief came with a screenshot (v2's answer 9 mentions one that did not arrive, §1b). Every conflict between the brief and the guidelines is recorded in §6, never resolved silently.

Sources, all read from `design-context` `main` (`e014a73`) on 21 Oct 2026: `ux-persona.md`, `ux-text-guidelines.md`, `guidelines/README.md` and the component files (`ltunderlinenav.md`, `ltsegmentedcontrol.md`, `ltinlinemessage.md`, `notification-messaging.md`, `ltpopover.md`, `lttooltip.md`, `lttag.md`, `ltlabelgroup.md`, `ltcounterlabel.md`, `ltprogressbar.md`, `ltpagination.md`, `lticonbutton.md`, `ltlink.md`, `ltbutton.md`, `ltactionmenu.md`, `ltselectpanel.md`, `ltinputbox.md`, `lttextarea.md`, `ltflash.md`, `ltmodal.md`, `ltbuttongroup.md`), `patterns/project-listing.md` (the base), `patterns/topbar.md`, `patterns/platform-sidebar.md`, `patterns/test-entity-listing.md` (the attached tabs and the two panes of v2), `patterns/test-instance-details.md`, `patterns/smartui-build-screenshots.md` (the list and grid precedent), `COMPONENTS.md`, `mock-data.md`, `icons.md` and `data/tokens.json`. Outside the repo: Rajat's own `project-actions/project-actions-listing.md` (11 Sep 2026), the house definition of a project's long-running operations; the notification-center prototype, whose Test Manager top bar and `LTTabNav` look this page reuses; the automation details prototype, whose name and date tooltips it reuses (its C1); and LambdaTest's docs page *Test Run - Creation and Management* (read 21 Oct 2026, last updated Oct 15, 2026), the source of the Create Test Run fields.

Every component and prop below was read from `COMPONENTS.md`. Structured prop shapes the manifest leaves undocumented are marked `TBD` with the story that shows them. Proposals carry **[proposed]**.

---

## 1. What this page is

The entry point to Test Manager, still with no project selected. Today it is one list of projects (`patterns/project-listing.md`). The revamp turns it into three views, each with its own URL, under tabs attached to the top bar:

| Tab | Answers | Brief |
|---|---|---|
| **For You** (default) | What is assigned to me, and which milestones are mine? | 2, 3; v2 2 |
| **Your Projects** | Which project do I open, and which one needs attention? | 2, 4 to 11; v2 4 to 7 |
| **Archived** | Where did the old projects go? | 2, 12 |

Brief point by point (21 Oct 2026, first round):

| # | Brief | Where it lands |
|---|---|---|
| 1 | Revamp, more useful | The whole page |
| 2 | Tabs below the top bar: For You, Your Projects, Archived | `LTUnderlineNav`, page-primary, one URL per tab, attached to the top bar (C1, C2, C17) |
| 3.1 | Test instances assigned to me: test case ID, version, test run, configuration if any, assigned by, assigned date, status icon | For You, **Test Instances** tab |
| 3.2 | My next milestone, if any | For You, **Milestones** tab, soonest first; and *Your next milestone* on each project |
| 3.3 | Changes since my last visit, as a count | Removed by v2 item 3 |
| 4 | Per project: name, tags, test case count (automated percentage), test run count, my next milestone, last updated, creator | Project row and card |
| 5 | Recently used projects on top | Your Projects opens on your recently used and starred projects (v2 item 7) |
| 6 | Star a project | Star toggle on every active project; starred projects lead the list |
| 7 | List or grid, remembered per user | `LTSegmentedControl`, icon-only, stored per user |
| 8 | Unassigned test instances and test instances without a configuration, per project | Row line *Test instances: 12 unassigned · 4 need a configuration* (C6) |
| 9 | Create a test run from each project | **Create Test Run** on every active project, opening a drawer (answer 9, C15) |
| 10 | *Inactive since* inline message | `LTInlineMessage` `info` on a project idle for more than 90 days (C4) |
| 11 | Ongoing operations count, list on hover | *3 ongoing actions*, opening an `LTPopover` (C3, C5, C12) |
| 12 | Archived projects, read-only | Archived tab |

## 1b. v2, 21 Oct 2026: answers and seven changes

Rajat's answers to §10's first ten questions, binding from now on:

| # | Question | Answer | What changed |
|---|---|---|---|
| 1 | Default tab | For You | Nothing; already so |
| 2 | What counts as a change since your last visit | Only other people's | Recorded; the section itself went with item 3 below |
| 3 | Owner and creator the same person | Yes, for now | *Created by* stays on the row and the filter (C7 resolved) |
| 4 | Inactive projects: inform or ask | Simply inform; no Archive decision; 90 days | The threshold moved from 30 to 90 days (C4 resolved) |
| 5 | Products filter and row menu | Leave them for now | Still left out (C9) |
| 6 | Whose milestones are yours | The ones you own or created | §4.3, *Your next milestone* and the Milestones tab use this rule |
| 7 | Starred order | Starred projects first | Kept |
| 8 | Restoring archived projects | Forget it for now | Nothing |
| 9 | Create Test Run | Opens the create test run side drawer on this page ("see attached ss") | A drawer (C15). **The screenshot did not arrive**: the drawer's fields come from LambdaTest's docs until it does (question 11) |
| 10 | Reliable time-left estimates for actions | Assumably yes | The popover shows the time left again (C12) |

The seven changes:

| # | Change | Where it lands |
|---|---|---|
| v2 1 | Attach the three tabs to the top bar, as inside a project on the test case and test run listings | The nav leaves the content column and sits on the top bar's lower edge, full width (C17) |
| v2 2 | For You in two sides: on the left, the projects with test instances assigned to you (name, assigned test instance count, assigned milestone count); on the right an `LTTabNav` with Test Instances and Milestones, with counts and lists | §3.3 |
| v2 3 | Remove *Since you last visited* | Removed; Rajat is taking it to the PM |
| v2 4 | Remove *Starred projects first, then the most recently updated.* | Removed |
| v2 5 | Underline a list item's title while the pointer is on the item; controls inside keep their behaviour | Every row and card, the left pane included; a click anywhere on a row or card opens its item (§4.13) |
| v2 6 | Project cards: icons for test cases and test runs; a name shows its email on hover; a relative date shows its full date and time on hover | §4.4, §4.14 (C13, C14, C18) |
| v2 7 | Progressive disclosure: open on your recently used and starred projects, with *Show all* at the bottom for the rest | §4.5 (C16) |

## 2. Component inventory

| Component | Role | Props used (all in `COMPONENTS.md`) |
|---|---|---|
| `LTUnderlineNav` | For You · Your Projects · Archived | `navs` (shape TBD → `ltunderlinenav--with-counters`), `ariaLabel`, `size="medium"`. Counters on Your Projects and Archived |
| `LTNavList` | For You's left pane: All Projects, then each project with test instances assigned to you | `ariaLabel`, `listItems` (shape TBD → `ltnavlist--nav-list`), `selectedTab`, `handleSelectedTab`, `showTruncatedName` |
| `LTTabNav` | For You's Test Instances · Milestones, below the `LTUnderlineNav` (`ltunderlinenav.md`) | `items` (shape TBD → `lttabnav--tab-nav`), `activeTab`, `ariaLabel`, `size` |
| `LTText` | `h1` per view, meta | `HEADER_BOLD` for the `h1`, `SUBHEADER_BOLD` for row titles and the drawer heading, `SMALL_BOLD` for the pane title, `SMALL_REGULAR` for meta (`guidelines/README.md` §3) |
| `LTCounterLabel` | Counts on both tab layers | `count`, `scheme="secondary"` |
| `LTLink` | Project names, test instance titles, milestone names, the two test instance counts, **View All Actions** | `href`, `label`, `muted` for the counts |
| `LTLabelGroup` + `LTTag` | Project tags; *Read-only* on archived projects | `text`, `labelStyle="outline"`, `variant="blueAccent"` for tags, `variant="secondary"` for *Read-only* |
| `LTTestStatusLabel` | Test instance status; ongoing action status; archived project status | `status`, `showStatusText={false}` in lists, `width`, `height` |
| `LTMetaData` | The `·`-separated meta lines | `value`, `leadingIcon` (test cases, test runs), `showLeadingDot`, `size="small"` |
| `LTTooltip` | A name's email and a relative date's full date and time (v2 item 6) | `text`, `type="description"`, `direction`, on a focusable trigger (C13) |
| `LTAvatar` | Assigner in For You; people in the Created by filter | `initials`, `name`, `size={20}`, `type="circle"` |
| `LTInlineMessage` | *Inactive since {date}.* | `variant="info"`, `size="medium"` (`ltinlinemessage.md`: medium whenever it fits). The text has no documented prop; passed as children (§9) |
| `LTPopover` | Ongoing actions on hover | `heading`, `popOverbodyJSX`, `direction`, `canChangeDirection`, `containsInteractiveChildElement`, `forceClose` |
| `LTProgressBar` | Progress of a running action; automated share on grid cards | `segments=[{ id, progress, style }]` (story-verified), `size="small"`. No `ariaLabel`: the value is written beside each bar, and a label that repeats it doubles up for screen readers (`ltprogressbar.md`) |
| `LTSegmentedControl` | List or grid | `isIconButton`, `showTooltip`, `options` (TBD → `ltsegmentedcontrol--icon-buttons`), `selectedValue`, `onChange`, `ariaLabel`, `role="radiogroup"` (C8) |
| `LTInputBox` | Search projects; the test run name | Search: `inputOnly`, `type="search"`, `variant="default"`, `allowClearSearch`. Name: `label`, `required`, `caption`, `validationStatus`, `validationMessage` |
| `LTTextarea` | The test run description | `label`, `rows={4}`, `resize="vertical"` (`lttextarea.md`) |
| `LTFormControl` + `LTTextInputWithTokens` + `LTToken` | The test run tags | `LTFormControl`: `label`, `caption`, `id`. `LTTextInputWithTokens`: `onTokenAdd`, `removeToken`, `placeholder`. `LTToken`: `size`. The token input has no `label` prop, hence the form control |
| `LTDrawer` | Create Test Run (answer 9) | `title`, `subTitle`, `content`, `footerContent`, `width={480}`, `onClose`, `closable`; opened with `drawerRef.current.openDrawer()` (story-verified, `ltmodal.md`). Right side only (C15) |
| `LTButton` | Filter triggers; Create Project; Create Test Run; Show All; Cancel | Filters: `variant="outline"`, `counter`, caret via `trailingIcon` (`guidelines/README.md` §5), and an accessible name that says what is chosen, *Created by: 2 selected* (`ltselectpanel.md`). Create Project: `variant="primary"`, no caret (C9). Create Test Run: `variant="outline"`, `size="small"` on rows, `variant="primary"` in the drawer. Show All: `variant="invisible"` (C16) |
| `LTSelectPanel` | Created by and Tags filters, multi-select | Anchored: saves on close (`guidelines/ltselectpanel.md`). `title`, `buttonLabel`, `defaultValues`, `onApply`, `cancelButtonText` (*Reset*, the default), `showCountOnCta`. `options` TBD → `ltselectpanel--select-panel`. 320px wide, so the longest cast name fits |
| `LTIconButton` | Star toggle; popover and drawer close | `icon`, `ariaLabel`, `variant="invisible"`, `size="small"`, `tooltipDirection` |
| `LTBlankSlate` / `LTLoader` / `LTFlash` | Empty, loading, error | Required on every list (`guidelines/README.md` §1) |
| `LTToast` | Results the user cannot see | top right, 4 seconds |
| `LTBox`, `LTDivider` | Layout, row separators, grid cards | Rows sit in one bordered container (`project-listing.md` delta 4) |

**Composed, and flagged (§9):** the grid card (no card component exists among the 69, the SmartUI precedent), the vertical rule in the top bar, the wrapping meta line (when a line of `LTMetaData` wraps, the new line never starts with a middle dot), and the whole-item click of v2 item 5.

**Deliberately absent:** `LTPagination` (7 active and 2 archived projects fit one page, and pagination never renders for a single page, `guidelines/ltpagination.md`), the row `LTActionMenu` (C9), `LTCheckbox` (project rows are not selectable, `project-listing.md` §7).

## 3. Structure

### 3.1 Shell

The platform shell, unchanged: the 56px rail with Test Manager active (`platform-sidebar.md`), and the top bar at depth 1 (`topbar.md`): the plain label *Test Manager* on the left; on the right *Credits: 20k*, a separator, **Recent Tests**, Announcements, the notifications bell, the avatar (`RS`, Ritika Sharma, the signed-in user) and **Upgrade Now**. Both sit on `canvas.subtle`; page content stays white.

### 3.2 Tabs, attached to the top bar (v2 item 1)

```jsx
{/* Directly under the top bar, full width, the way the project nav sits on the
    test case and test run listings (test-entity-listing.md §3.1): 24px from
    the rail, as the top bar's own left edge. It stays put while the content
    below scrolls. navs shape TBD → ltunderlinenav--with-counters (C17) */}
<LTUnderlineNav ariaLabel="Projects" size="medium" navs={[
  /* For You: no counter. It holds two kinds of rows, and a tab badge counts
     the rows inside the tab (ux-text-guidelines.md §7). */
  { id: "for-you", label: "For You", href: "#/for-you" },
  { id: "projects", label: "Your Projects", href: "#/projects", counter: 7 },
  { id: "archived", label: "Archived", href: "#/archived", counter: 2 },
]} />
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

<LTBox styles={{ display: "flex", alignItems: "center", gap: "12px" }}>
  <LTInputBox inputOnly type="search" variant="default" placeholder="Search projects"
    ariaLabel="Search projects" allowClearSearch extraStyle={{ flex: 1 }} />
  {/* Filter triggers: outline LTButton, caret, applied count in `counter`
      (guidelines/README.md §5). Both open an anchored LTSelectPanel. */}
  <LTButton variant="outline" size="medium" label="Created by" trailingIcon={ChevronDown} />
  <LTButton variant="outline" size="medium" label="Tags" counter={1} trailingIcon={ChevronDown} />
  {/* Brief 7. Icon-only, two segments, tooltips, a label (ltsegmentedcontrol.md). */}
  <LTSegmentedControl ariaLabel="View" role="radiogroup" isIconButton showTooltip
    options={[/* List, Grid */]} selectedValue={view} onChange={setView} />
  <LTButton variant="primary" size="medium" label="Create Project" />
</LTBox>

{/* v2 item 7: your starred, then your recently used projects; Show All adds
    the rest below them. While a search or filter is applied, it looks
    through every project and the control is gone. */}
{view === "list"
  ? <LTBox styles={{ border: "1px solid", borderRadius: "8px" }}>{rows}</LTBox>
  : <LTBox styles={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "16px" }}>{cards}</LTBox>}
<LTButton variant="invisible" size="medium" label="Show All" />   {/* then "Show Less" (C16) */}
```

The project row, list view. Up to four lines; a line with nothing on it is omitted:

```jsx
<LTBox styles={{ display: "flex", gap: "16px", padding: "16px 20px" }}>
  <LTBox styles={{ flex: 1, minWidth: 0 }}>
    {/* 1. Name (navigates, so LTLink, project-listing.md delta 5) and tags. */}
    <LTLink label="Web app" size="medium" />
    <LTLabelGroup><LTTag text="prod" /><LTTag text="report" /></LTLabelGroup>

    {/* 2. Facts. Brief 4's "total TC count (automated TC percentage)". v2 item
        6: an icon beside each count, the words kept (C18); the name shows its
        email and the relative date its full date and time (C13, C14). */}
    <LTMetaData leadingIcon={FileText} value="1.24k test cases (62% automated)" showLeadingDot={false} />
    <LTMetaData leadingIcon={CirclePlay} value="38 test runs" />
    <LTMetaData value="Created by Ritika Sharma" />   {/* ritika.sharma@dundermifflin.com on hover */}
    <LTMetaData value="Updated 4 days ago" />          {/* Oct 17, 2026, 08:13 AM on hover */}

    {/* 3. What needs you: your next milestone (one you own or created,
        answer 6), the test instances that need an owner or a configuration
        (brief 8, links into the filtered test instance list), and the
        ongoing actions (brief 11). */}
    <LTMetaData leadingIcon={Flag} value="Your next milestone: UAT Round 2 · Oct 23, 2026" showLeadingDot={false} />
    <LTMetaData leadingIcon={ListTodo}>Test instances: <LTLink muted label="12 unassigned" /> · <LTLink muted label="4 need a configuration" /></LTMetaData>
    <OngoingActions project={p} />   {/* "3 ongoing actions", opens the popover */}

    {/* 4. Brief 10, only on an inactive project. */}
    <LTInlineMessage variant="info" size="medium">Inactive since Jul 14, 2026.</LTInlineMessage>
  </LTBox>

  {/* Brief 9 and 6. Create Test Run opens the drawer; the star is a toggle
      whose name says what it will do. */}
  <LTButton variant="outline" size="small" label="Create Test Run" />
  <LTIconButton icon={Star} variant="invisible" size="small" ariaLabel="Star Web app" />
</LTBox>
```

The grid card carries the same facts, rearranged: name and star in the head, tags, the two counts with their icons, the automated share as a small `LTProgressBar` with its value beside it, the *needs you* lines, the inline message, then a footer with the creator, the update time and **Create Test Run**.

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

The Create Test Run drawer (answer 9). **Provisional:** the fields are the ones LambdaTest's docs list for creating a test run, until the screenshot arrives (question 11):

```jsx
{/* Right side only, over a backdrop (ltmodal.md); 480px, "most tasks". */}
<LTDrawer ref={drawerRef} title="Create Test Run" subTitle="Web app" width={480}
  content={<>
    <LTInputBox type="text" label="Test run name" required placeholder="Regression Suite - Release 8.4"
      caption="A descriptive name helps you find it later."
      validationStatus="error" validationMessage="Enter a test run name." />
    <LTTextarea label="Description" rows={4} resize="vertical" />
    <LTFormControl label="Tags" caption="Press Enter to add each tag.">
      <LTTextInputWithTokens onTokenAdd={add} removeToken={remove} />
    </LTFormControl>
  </>}
  footerContent={<>
    {/* Footer order: secondary, then primary hard right (README §7). */}
    <LTButton variant="outline" size="medium" label="Cancel" />
    <LTButton variant="primary" size="medium" label="Create Test Run" />
  </>} />
```

### 3.5 Archived

The same list and grid, read-only. No star, no **Create Test Run**, no milestone, no test instance counts and no actions: nothing in an archived project changes. Each row leads with the `archived` status icon (`type=Archive`, `mock-data.md`) and carries a *Read-only* tag, the counts with their icons, and the line *Archived on Aug 22, 2026 by Darth Vader*. Search stays, so a long archive is still findable.

## 4. Behaviour, item by item

1. **The page.** For You is the default tab (answer 1). Each tab has its own URL (`#/for-you`, `#/projects`, `#/archived`); For You's selection and tab have theirs too (`#/for-you/web-app`, `#/for-you/all/milestones`). The top bar's label stays *Test Manager*.
2. **Tabs.** `LTUnderlineNav` on the top bar's lower edge, full width, fixed while the content scrolls (v2 item 1, C17). Your Projects and Archived carry counters that count the rows inside them; For You carries none, since it holds two kinds of rows. Brief 2 said "2 tabs" and named three; point 12 describes the third, so all three are built (C2).
3. **For You** (v2 item 2).
   1. *The left pane* lists **All Projects** [proposed], then each project where test instances are assigned to you, the newest assignment first, so new work rises. Each item: the name, then *6 test instances · 2 milestones*. Your milestones are the ones you own or created (answer 6). The selection keeps the open tab: picking a project on Milestones shows its milestones.
   2. *The panel* is headed by the selection's name, *All Projects* or the project, with one line on what it holds, then an `LTTabNav`: **Test Instances** and **Milestones**, each with its count.
   3. *Test Instances* lists the test instances assigned to you, the newest assignment first. Each row: status icon, the test case title as a link (one line, the full title on hover), then `{project} · #TC-225 · v2 · {test run} · {configuration}` (the project only under All Projects), and on the right *Assigned {when}* above the assigner's avatar and name. A test instance without a configuration says *Needs a configuration*: brief 3.1 shows the configuration "if any", and an empty value names the state, never a blank (`ux-text-guidelines.md` §3), in the words the project rows use (C6). Dates are relative up to 30 days and `MMM DD, YYYY` after (`mock-data.md`).
   4. *Milestones* lists your milestones, soonest first, so the first row is your next one (brief 3.2): the name as a link, the project under All Projects, *Owned by {name}* and *Created by {name}* (*you* for you: they say why it is yours), and on the right *2 days left* above *Oct 23, 2026*. A deadline carries its absolute date beside the countdown (`ux-text-guidelines.md` §7).
4. **Per project.** Name, tags, *1.24k test cases (62% automated)* and *38 test runs* each with an icon (v2 item 6, C18), *Created by {name}*, *Updated {when}*, and, when you have one there, *Your next milestone: {name} · {date}*. A project with no test cases shows *0 test cases* and no automated share.
5. **Progressive disclosure** (v2 item 7, replacing the *Recently used* strip). Your Projects opens on your projects: the starred ones first (answer 7), then the ones you used most recently, up to 4 (brief 5) [proposed count]. **Show All**, under the list, adds the rest below them, most recently updated first, so nothing already on screen moves; focus goes to the first project it revealed, and screen readers hear *7 projects*. **Show Less** returns to your projects. A search or a filter looks through every project, in the same order, and hides the control. With no starred or recent project, the list opens complete. Opening a project counts as a visit, which makes it recently used the next time the tab opens.
6. **Star.** A star toggle on every active project. Starred projects come first. Starring does not move the row under the pointer: the order is set when the tab opens [proposed]. The toggle's name says what it will do (*Star Web app*, *Unstar Web app*), and screen readers hear *Web app starred*.
7. **List or grid.** An icon-only `LTSegmentedControl` with tooltips (*List*, *Grid*), in the toolbar of Your Projects and of Archived, sharing one setting. It applies at once and is remembered per user: the prototype stores it under the signed-in user's ID in the browser; the product would store it on the account.
8. **Test instances that need attention.** *Test instances: 12 unassigned · 4 need a configuration*. Each count is a link to the project's test instance list, filtered to those instances. A zero count is omitted, and with both at zero the line is gone.
9. **Create Test Run** (answer 9). An outline button on every active project, in the row's right cluster and in the card's footer. It opens a 480px drawer on the right, focus on the name: *Test run name* (required), *Description*, *Tags* (Enter adds each). An empty name says *Enter a test run name.* and keeps focus there. **Create Test Run** closes the drawer, adds the run to the project's count, and a toast says *Test run "{name}" created in {project}.* Esc and the close button close it; the backdrop closes it only while nothing has been typed (`ltmodal.md`); focus returns to the button that opened it. The fields are provisional (question 11).
10. **Inactive since.** A project where nobody in the org has taken any action on any entity for more than 90 days (answer 4) shows `LTInlineMessage` `info`: *Inactive since Jul 14, 2026.* It informs and offers nothing (answer 4). Its date is the last action, which can be later than *Updated*: a test run executed on Jul 14 changes no project details.
11. **Ongoing actions.** *3 ongoing actions* counts the project's actions that are running or queued, the operations of `project-actions-listing.md` (imports, exports, automation, moves, copies, deletions and test run executions). Hovering it for 250ms, or pressing it, opens an `LTPopover` listing each one: status icon, title, progress as counts processed with a bar and the time left (*312/1.24k test cases · 25% · ~4m 10s left*, or *Estimating time left…* before the first estimate), then how long it has run or waited and who started it (*Running · 4m 12s · Started by Ritika Sharma*, *Queued · 2m 5s · Started by Darth Vader*), and last **View All Actions** (C12). It stays open when the pointer leaves, and closes with its close button, Esc or a click outside (C3). A press moves focus into it; Tab past its last control closes it and returns focus to the trigger. A project with none shows nothing.
12. **Archived.** Archived projects, read-only: the `archived` status icon, a *Read-only* tag, the counts, the creator, and *Archived on {date} by {name}*. Opening one opens it read-only.
13. **A whole row or card opens its item** (v2 item 5). Hovering anywhere on a row, a card or a left-pane item underlines its title, and a click anywhere on it opens the item, through the title link, which stays the one link for keyboard and screen readers. The controls inside (tags, the two counts, the actions popover, **Create Test Run**, the star, and the name and date hints) work as before, and while the pointer is on one of them the title stays as it is. Keyboard focus on the title outlines the whole row.
14. **Names and dates** (v2 item 6). Every person's name in a row, a card or the popover shows their email on hover and focus (`ritika.sharma@dundermifflin.com`, `mock-data.md` format); *you* shows nothing. Every relative date shows its full date and time (*Oct 17, 2026, 08:13 AM*); an absolute date already says when, so it shows nothing more. Both are focusable, so the keyboard reaches them (C13).

## 5. States

| Surface | Empty | Loading | Error |
|---|---|---|---|
| For You | *0 test instances assigned to you* · *Test instances assigned to you appear here, with their test run and configuration.* Under the heading *For You* | `LTLoader`, under the heading | `LTFlash` `danger`: *Assigned test instances failed to load. Try again.* |
| For You, Milestones of one project | *0 milestones you own or created* · *Milestones you own or create in iPad app appear here.* | with the tab | with the tab |
| Your Projects | *Start with your first project* · *Projects keep your test cases organized.* · **Create Project** (`project-listing.md` §4) | `LTLoader` | `LTFlash` `danger`: *Project list failed to load. Try again.* |
| Your Projects, filtered | *0 matching projects* · *Change or clear the filters to see more projects.* | | |
| Archived | *0 archived projects* · *An archived project stays readable here, with its test cases and test runs.* | `LTLoader` | `LTFlash` `danger`: *Archived projects failed to load. Try again.* |
| Archived, searched | *0 matching projects* · *Change or clear the search to see more projects.* | | |
| Ongoing actions | Absent at 0 | | |
| Create Test Run | *Enter a test run name.* under an empty name | | |

One `LTFlash` per page at most (`guidelines/README.md` §1). The prototype shows each state with `?state=loading`, `?state=error` and `?state=empty`.

## 6. Conflicts recorded

| # | Topic | Brief | design-context | Prototype does | Why |
|---|---|---|---|---|---|
| C1 | Tabs on the root page | Tabs below the top bar | `project-listing.md` §1: primary nav **None**, no project scope exists yet | `LTUnderlineNav` For You · Your Projects · Archived, page-primary, one URL each | Brief wins. These tabs are views of the root page, not project navigation, so the pattern's reason does not apply |
| C2 | Tab count | "add 2 tabs: For You, Your Projects and Archived" | | Three tabs | Point 12 describes the Archived list, so the count was the slip. Not questioned in v2 |
| C3 | A popover on hover, holding data | Hover shows the ongoing operations in a popover | `ltpopover.md`: for onboarding and instructions; always a visible dismiss, Esc and click-outside. `guidelines/README.md` §5: a short tip | `LTPopover`, opening on a 250ms hover or a press, with a close button, Esc and click-outside | Brief wins on the trigger and the content; the guideline wins on dismissal. The same split as the automation details prototype's C20 and C31 |
| C4 | *Inactive since* as an alert | "alert inline message" | `ux-text-guidelines.md` §4: yellow only when the user has a decision; `ltinlinemessage.md`: `warning` likewise | `info` (blue), at 90 days | **Resolved 21 Oct 2026** (answer 4): simply inform, no Archive decision, 90 days |
| C5 | One term: operations or actions | "ongoing operations" | `project-actions-listing.md`: these operations are *actions*, on an **Actions** tab; `ux-text-guidelines.md` §6: one term per concept | *3 ongoing actions*, **View All Actions** | The house already named them |
| C6 | "without configs" | Test instances without configs | `ux-text-guidelines.md` §1 rule 2 and §3 Empty states: name the state or the next step | *4 need a configuration*, beside *12 unassigned* (the guide's own empty value) | Says what to do, not what is missing |
| C7 | Owner or creator | "creator user's name" | `project-listing.md`: an owner avatar per row and an **Owners** filter | *Created by {name}* in words, and a **Created by** filter | **Resolved 21 Oct 2026** (answer 3): the same person, for now |
| C8 | Segmented control role | List or grid | `ltsegmentedcontrol.md`: no `role` without a design decision | `role="radiogroup"`, with the radio keyboard model (one tab stop, arrows move and select) | The decision exists: `smartui-build-screenshots.md` §5 settles `radiogroup` for list and grid (its delta 2; its component table calls it delta 4, §9) |
| C9 | Pattern elements not carried over | | `project-listing.md`: a **Products** filter, a row `...` menu, and a caret on **Create Project** | All three left out | **Answered 21 Oct 2026** (answer 5): leave them for now |
| C10 | Volume | | `mock-data.md`: 15 to 25 rows per list, and only these 9 project names | 7 active and 2 archived projects | Names are never invented; the gap is in §9 |
| C11 | The heading count | | `project-listing.md` delta 3: `LTCounterLabel` beside the `Projects` heading | The counts move to the tabs | A tab badge counts the rows inside the tab (`ux-text-guidelines.md` §7); two counters for one list is one too many |
| C12 | Time on an ongoing action | | `project-actions-listing.md` §3.4 and §3.6 (Rajat, 11 Sep 2026): *Started at 09:12 AM by {name}* and *~4m 10s left*. `ux-text-guidelines.md` §7 (8 Oct 2026): "Running work shows elapsed time, not its start time" (*Running · 14m 11s*) and "No ETA unless it is reliable. Show counts processed instead." | *312/1.24k test cases · 25% · ~4m 10s left* and *Running · 4m 12s · Started by Ritika Sharma* | **Updated 21 Oct 2026** (answer 10): the estimates are reliable, so the time left shows, as the guide then allows. The elapsed time keeps the place of the start time, per the guide |
| C13 | Tooltips on plain text | v2 item 6: a name shows its email on hover; a relative date its full date and time | `lttooltip.md`: never on non-interactive elements (plain text, spans) | Both shown; the name and the date are made focusable, so the keyboard reaches them | Brief wins. The automation details prototype settled it the same way (its C1) |
| C14 | The time in a last-updated date | v2 item 6: "absolute date-time stamp" | `mock-data.md`: append the time only where it matters, and omit it "such as a project's last-updated date" | *Oct 17, 2026, 08:13 AM* in the tooltip | Brief wins; the row itself still shows the date alone |
| C15 | A create form in a drawer | Answer 9: Create Test Run opens the create test run side drawer | `ltmodal.md`: a drawer is for global actions or quick previews, "Never for create/edit forms or heavy information" | `LTDrawer`, right side, 480px, three fields | Brief wins, and per Rajat the product already does this. The fields are provisional: the screenshot did not arrive, so they follow LambdaTest's docs (question 11) |
| C16 | *Show all* as a link | "give a 'Show all' link at the bottom of that list" | `guidelines/README.md` §5 and `ltlink.md`: links navigate, buttons act; an in-page reveal is a button. `ux-text-guidelines.md` §2: a standalone action is a CTA, Title Case | `LTButton` `invisible`, **Show All**, then **Show Less** | It reveals rows in place, so it is a button; the invisible variant reads as the light text control the brief asked for |
| C17 | Tabs wider than their content | v2 item 1: attach the tabs to the top bar, as inside a project | `ltunderlinenav.md`: directly above the content it controls, aligned left, "not wider than that content" | Full width under the top bar, 24px from the rail; Your Projects and Archived keep the centred 1232px column below | Brief wins: it is the place the product gives the project nav on the test case and test run listings (`test-entity-listing.md` §3.1) |
| C18 | Icons for test cases and test runs | v2 item 6: "use icons for TC, TR" | `lttooltip.md`: never hide essential information in a tooltip; `icons.md`: names no icon for either, and says "12px icons use the filled variant. 16px and 24px use the outline variant, paired with 14px text or larger" | The icons join the words (*1.24k test cases*, *38 test runs*), 16px outline beside 12px meta | An icon alone would need a tooltip to say what it counts. lucide has no filled set, so a 12px filled icon is not available (§9) |

## 7. Design decisions [proposed]

- **For You is the default tab** (answer 1).
- **For You is a pane and a panel, like the listings inside a project** (v2 item 2). The pane is the 320px simple-list step; the panel takes the rest, full width, since a page with a pane runs full width (README §2).
- **All Projects leads the pane, selected on arrival** [proposed]. It mirrors the listings' root row (*All Test Cases*), and it keeps the cross-project view: every test instance assigned to you, and your milestones across projects, soonest first, so your next milestone is the first row (brief 3.2). Rejected: opening on the first project, which hides the rest of your work behind a click.
- **Projects in the pane order by the newest assignment**, so new work rises. Rejected: alphabetical, which buries what changed.
- **Switching projects keeps the open tab**, so comparing milestones across projects is one click each.
- **A milestone row says why it is yours**: *Owned by* and *Created by*, with *you* where it applies (answer 6).
- **Your Projects opens on your projects, then Show All** (v2 item 7). Starred first, then recently used, then the rest by update; the reveal adds rows below, so nothing on screen moves, and focus goes to the first new row.
- **Starring never moves the row you just starred.** The order is set when the tab opens. A row jumping away from the pointer is the hostile kind of motion.
- **A whole row opens its item, through the title link** (v2 item 5). The hover underline promises a click anywhere; the link keeps one stop per row for the keyboard. Rejected: underlining on hover with no row click, which promises what it does not do.
- **Icons join the words, never replace them** (C18).
- **Create Test Run is a visible button on every project** and opens the drawer on this page (answer 9). The new run joins the project's count, so the result shows where the user is.
- **The two test instance counts are links** to the filtered list: they are questions with an answer one click away.
- **The popover counts queued actions as ongoing**, since they will run without anyone touching them, and says *Queued* in each one.
- **The list and grid setting is shared by Your Projects and Archived**, since it is one preference about projects.
- **The project name opens the project** (stubbed here with a toast), and counts as a visit.
- **A test instance without a configuration says so** (*Needs a configuration*), rather than leaving a gap: it is the state the project rows count (brief 8).
- **Overlays hand focus back.** The popover is portaled, so Tab past its last control closes it and returns focus to its trigger; the drawer returns focus to the button that opened it.

## 8. Copy

All strings follow `ux-text-guidelines.md`.

| Where | String | Rule |
|---|---|---|
| Tabs | For You · Your Projects · Archived | §2 page headings up to 4 words in Title Case; the tab names its view (`ltunderlinenav.md`) |
| For You | Projects · All Projects · 16 test instances · 5 milestones · *Test instances assigned to you and milestones you own or created.* · Test Instances · Milestones · Needs a configuration · Assigned 2 hours ago · Owned by Darth Vader · Created by you · 2 days left · Oct 23, 2026 | §2 Title Case for headings of 4 words or fewer, sentence case for labels; §3 empty values name the state; §7 deadlines carry the absolute date |
| Your Projects | Your Projects · *Projects hold all your test case information.* · Search projects · Created by · Tags · List · Grid · Create Project · **Show All** · **Show Less** | §2 sentence case for labels, Title Case for buttons and CTAs |
| Row | 1.24k test cases (62% automated) · 38 test runs · Created by Ritika Sharma · Updated 4 days ago · Your next milestone: UAT Round 2 · Oct 23, 2026 · Test instances: 12 unassigned · 4 need a configuration · 3 ongoing actions · **Create Test Run** · Star Web app · Unstar Web app | §2 k for numbers over 999, middle dot; §3 Tooltips name the action |
| Tooltips | ritika.sharma@dundermifflin.com · Oct 17, 2026, 08:13 AM | `mock-data.md` email and timestamp formats; §2 no full stop |
| Inline message | *Inactive since Jul 14, 2026.* | `ltinlinemessage.md`: one clause with a full stop |
| Popover | 3 ongoing actions · Import test cases from CSV · 312/1.24k test cases · 25% · ~4m 10s left · Estimating time left… · Running · 4m 12s · Started by Ritika Sharma · Queued · 2m 5s · Started by Darth Vader · **View All Actions** · Close | `project-actions-listing.md` §1.1 and §3.4 grammar; §7 elapsed time (C12); §2 standalone action links in Title Case |
| Drawer | Create Test Run · Web app · Test run name * · *A descriptive name helps you find it later.* · *Enter a test run name.* · Description · Tags · *Press Enter to add each tag.* · Cancel · **Create Test Run** · Remove {tag} | §2 labels in sentence case without a colon, captions and messages with a full stop; §3 field errors lead with the fix; §1 rule 14, nothing called easy |
| Toast | *Test run "Smoke - Sprint 42 Nightly" created in Web app.* | §3 Toasts: the object and the past tense of the button's verb |
| Archived | Archived · *Archived projects are read-only. Their test cases and test runs stay as they were.* · Read-only · Archived on Aug 22, 2026 by Darth Vader | §2 |
| Empty, error | §5 | §3 Empty states and Error messages |
| Announcements | Web app starred · Web app unstarred · 2 matching projects · 7 projects (after a search, a filter, Show All or Show Less) | §3 Silent success still speaks. The view switch needs none: its radios speak their state |
| Toasts (stubs) | *The Web app project opens here.*, *The 12 unassigned test instances in Web app open here.*, *The Actions tab of Web app opens here.*, *UAT Round 2 in Web app opens here.*, *TV app opens here, read-only.* and the like, one per destination this page links to | The convention of the earlier prototypes |

## 9. Gaps found in design-context

Recorded, not changed. Each is a candidate for a design-context pull request once Rajat decides.

- **`mock-data.md` has no milestones.** Milestones exist in the product (`test-instance-details.md`: the project nav's *Milestones*), but with no names, fields, dates or format. The prototype names them from the qualifiers in the approved test run names (*Release 8.4*, *Sprint 42*, *UAT Round 2*, *Release Candidate 12.1*) and gives each an owner, a creator and a due date (question 13).
- **`mock-data.md` has no project tags.** The prototype uses the two the project listing screenshot showed (*Zephyr Scale Import*, *report*, `project-listing.md`) and the approved environment values (*prod*, *stage*, *dev*).
- **`mock-data.md` has 9 project names** against a volume rule of 15 to 25 rows, and none is long, though the pattern asks for a very long project name as its awkward row. The awkward rows here are a project with 0 test cases and 0 test runs, single-word creators (*Oppenheimer*, *Kokushibo*), the longest cast name, and a 3840x1600 configuration.
- **No concept of a visit or of inactivity** anywhere in design-context. Both are defined in §4; inactivity at 90 days by Rajat's answer.
- **No favourite or star pattern**, no `icons.md` entry for it, and no star colour token. The prototype uses lucide `Star`, outline or filled, and fills it with `attention.fg` (`#9a6700`), the nearest token; the shape carries the state, never the colour alone.
- **No icons for test cases and test runs** in `icons.md`. The prototype uses lucide `FileText` and `CirclePlay` as placeholders (question 14). `icons.md`'s fill-follows-size rule pairs 16px outline icons with 14px text or larger and gives 12px icons the filled variant; beside 12px meta text the prototype has 16px outline icons, since lucide has no filled set (C18).
- **No archived state for a project.** The `archived` status and its `Archive` icon exist for test entities (`mock-data.md`); the prototype borrows them.
- **No card component.** Grid cards are composed from `LTBox`, as SmartUI's are.
- **`LTInlineMessage` documents no text prop** (`className`, `size`, `sx`, `variant` only). The prototype passes the message as children; confirm against `ltinlinemessage--default`.
- **`LTTextInputWithTokens` documents no label and no way to pass its tokens in** (`onTokenAdd`, `removeToken`, `placeholder`, `size` and a few more). The prototype labels it with `LTFormControl` and lets it keep its own tokens.
- **`LTSegmentedControl` `options`, `LTUnderlineNav` `navs`, `LTTabNav` `items` and `LTNavList` `listItems` shapes** are still TBD.
- **`LTSelectPanel`'s anchored variant is unverified in the component.** Its props (`onApply`, `cancelButtonText` defaulting to *Reset*) suggest a footer; the save-on-close behaviour here is the guideline's, not observed in the story.
- **`smartui-build-screenshots.md` cites itself wrongly:** its component table points the view toggle's role to "delta 4", and §5 numbers that delta 2.
- **`icons.md` is mostly TO FILL**, and names no icon for milestones, test instances, ongoing actions or list and grid. The prototype pins lucide-react **1.58.0** and uses only names confirmed present (README).
- **The collapsed rail's Test Manager icons are unnamed** (`platform-sidebar.md` names four, not which). The prototype shows Test Manager only.

## 10. Open questions

Questions 1 to 10 were answered on 21 Oct 2026 (§1b). New ones:

11. **The Create Test Run drawer screenshot did not arrive.** Please send it again. Until then the drawer has the three fields LambdaTest's docs list (name, description, tags) and the docs' button, **Create Test Run** (C15).
12. **All Projects in For You's pane:** keep it, selected on arrival, or open on the first project?
13. **What else does a milestone carry** (a start date, a status, its test runs, progress)? As built: name, owner, creator and due date.
14. **Icons for test cases and test runs:** which ones does the product use? `FileText` and `CirclePlay` are placeholders.
15. **Recently used:** how many projects count (4 as built), and from how far back?
16. **Since you last visited:** with the PM (v2 item 3). If it returns, answer 2 stands: only other people's changes count.

## 11. When this ships into design-context/

- [ ] Amend `patterns/project-listing.md` with the attached tabs, For You's pane and panel, the row, the card, the drawer and the states; record C1 to C18 as deltas.
- [ ] `mock-data.md`: milestones (fields and names), project tags, more project names (including a long one), and the visit and inactivity values.
- [ ] `icons.md`: lucide 1.58.0 and the names this page uses (README), including the test case and test run icons once chosen.
- [ ] `guidelines/`: the hover popover holding data (C3, with the automation details prototype's C20), tooltips on names and dates (C13, with its C1), drawers for create forms (C15), the star toggle, the whole-row click, and a per-user view preference.
- [ ] FE asks: a card component, a documented text prop on `LTInlineMessage`, a label and a tokens prop on `LTTextInputWithTokens`, and the `options`, `navs`, `items` and `listItems` shapes.
