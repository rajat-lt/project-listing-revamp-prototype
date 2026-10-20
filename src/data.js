// Mock data, from design-context mock-data.md only: the 9 approved project
// names, the cast, test case and test run names, browser and OS strings,
// resolutions, the status vocabulary and every format. Where mock-data.md has
// nothing, the value is marked GAP and listed in project-listing-revamp.md §9.
// The ongoing actions follow Rajat's project-actions-listing.md (§1.1 and the
// worked rows in §3.6).

/** A fixed "now", so relative dates read the same on every visit. */
export const NOW = new Date(2026, 9, 21, 10, 30)
const MIN = 60 * 1000, HOUR = 60 * MIN, DAY = 24 * HOUR
const ago = ms => new Date(NOW - ms)
const on = (y, m, d) => new Date(y, m - 1, d, 12, 0)

/** The signed-in user: the top bar's RS avatar in every prototype. */
export const USER = { id: 'ritika-sharma', name: 'Ritika Sharma' }

/* GAP: mock-data.md has no milestones. Named from the qualifiers in its
   approved test run names ("Regression Suite - Release 8.4", "Smoke - Sprint
   42 Nightly", "Checkout Revamp - UAT Round 2"). */
const M = {
  release: { name: 'Release 8.4', due: on(2026, 10, 28) },
  sprint: { name: 'Sprint 42', due: on(2026, 11, 4) },
  uat: { name: 'UAT Round 2', due: on(2026, 10, 23) },
}

/* Ongoing actions: running or queued (project-actions-listing.md §1.1). Titles,
   initiators and most counts follow its worked rows (§3.6). Each shows how long it
   has been running or waiting, never its start time or an ETA:
   ux-text-guidelines.md §7, "Running work shows elapsed time, not its start
   time" and "No ETA unless it is reliable" (spec C12). `elapsed` is seconds. */
const ACTIONS = {
  web: [
    { id: 'a1', status: 'running', title: 'Import test cases from CSV', done: 312, total: 1240, unit: 'test cases',
      pct: 25, elapsed: 4 * 60 + 12, by: 'Ritika Sharma' },
    { id: 'a2', status: 'running', title: 'Regression Suite - Release 8.4', done: 34, total: 50, unit: 'test instances',
      pct: 68, elapsed: 26 * 60 + 40, by: 'Mahendra Damodardas Baahubali' },
    { id: 'a3', status: 'queued', title: 'Import test cases from TestRail', elapsed: 2 * 60 + 5, by: 'Darth Vader' },
  ],
  mobileApp: [
    { id: 'a4', status: 'running', title: 'Move test cases to Internal HRMS / Archive', done: 9, total: 24, unit: 'test cases',
      pct: 37, elapsed: 33, by: 'Oppenheimer' },
  ],
  mobileWeb: [
    { id: 'a5', status: 'running', title: 'Export test cases', done: 0, total: 482, unit: 'test cases',
      pct: 0, elapsed: 6, by: 'Gabbar Singh' },
    { id: 'a6', status: 'running', title: 'Automate test cases', done: 5, total: 12, unit: 'test cases',
      pct: 42, elapsed: 7 * 60 + 30, by: 'Ritika Sharma' },
  ],
}

/*
 * Projects. GAP: mock-data.md has no project tags; these are the two the
 * project listing screenshot showed (project-listing.md: "Zephyr Scale
 * Import", "report") and the approved environment values (prod, stage, dev).
 * `lastActionAt` is the last action by anyone, on anything, in the project;
 * more than 30 days ago makes it inactive (brief 10). `visitedAt` and
 * `changesSinceVisit` are the signed-in user's own.
 *
 * The awkward rows mock-data.md asks for: Internal HRMS with 0 test cases and
 * 0 test runs, single-word creators (Oppenheimer, Kokushibo), the longest cast
 * name, four tags on one project, and an inactive project. None of the nine
 * approved names is long (GAP).
 */
export const PROJECTS = [
  {
    id: 'web-app', name: 'Web app', tags: ['prod', 'report'], testCases: 1240, automatedPct: 62, testRuns: 38,
    createdBy: 'Ritika Sharma', updatedAt: ago(4 * DAY), lastActionAt: ago(2 * HOUR), milestone: M.release,
    unassigned: 12, needConfig: 4, actions: ACTIONS.web, visitedAt: ago(2 * HOUR), changesSinceVisit: 24, starred: true,
  },
  {
    id: 'mobile-app', name: 'Mobile app', tags: ['stage'], testCases: 3110, automatedPct: 48, testRuns: 112,
    createdBy: 'Mahendra Damodardas Baahubali', updatedAt: ago(1 * DAY), lastActionAt: ago(40 * MIN), milestone: M.sprint,
    unassigned: 0, needConfig: 9, actions: ACTIONS.mobileApp, visitedAt: ago(1 * DAY + 3 * HOUR), changesSinceVisit: 7,
  },
  {
    id: 'ipad-app', name: 'iPad app', tags: ['Zephyr Scale Import'], testCases: 9890, automatedPct: 91, testRuns: 240,
    createdBy: 'Oppenheimer', updatedAt: ago(3 * HOUR), lastActionAt: ago(3 * HOUR), milestone: null,
    unassigned: 3, needConfig: 0, actions: [], visitedAt: ago(3 * DAY), changesSinceVisit: 132,
  },
  {
    id: 'mobile-web', name: 'Mobile web', tags: [], testCases: 482, automatedPct: 18, testRuns: 6,
    createdBy: 'Darth Vader', updatedAt: ago(12 * DAY), lastActionAt: ago(1 * HOUR), milestone: M.uat,
    unassigned: 27, needConfig: 2, actions: ACTIONS.mobileWeb, visitedAt: null, changesSinceVisit: null,
  },
  {
    id: 'desktop-website', name: 'Desktop website', tags: ['dev', 'stage', 'report', 'Zephyr Scale Import'],
    testCases: 5200, automatedPct: 74, testRuns: 87,
    createdBy: 'Gabbar Singh', updatedAt: ago(6 * DAY), lastActionAt: ago(6 * DAY), milestone: null,
    unassigned: 0, needConfig: 0, actions: [], visitedAt: ago(6 * DAY), changesSinceVisit: 0, starred: true,
  },
  {
    id: 'blog-website', name: 'Blog website', tags: [], testCases: 64, automatedPct: 25, testRuns: 2,
    // Updated (project details) on Jun 30; a test run executed on Jul 14 was
    // the last action of any kind, so the project is inactive since then.
    createdBy: 'Kokushibo', updatedAt: on(2026, 6, 30), lastActionAt: on(2026, 7, 14), milestone: null,
    unassigned: 0, needConfig: 0, actions: [], visitedAt: null, changesSinceVisit: null,
  },
  {
    id: 'internal-hrms', name: 'Internal HRMS', tags: ['prod'], testCases: 0, automatedPct: null, testRuns: 0,
    createdBy: 'George Orwell', updatedAt: ago(2 * DAY), lastActionAt: ago(2 * DAY), milestone: null,
    unassigned: 0, needConfig: 0, actions: [], visitedAt: null, changesSinceVisit: null,
  },
]

/* Archived projects: read-only (brief 12). The `archived` status and its
   Archive icon come from the test status vocabulary (GAP: no project state). */
export const ARCHIVED = [
  {
    id: 'tv-app', name: 'TV app', tags: ['report'], testCases: 2300, automatedPct: 55, testRuns: 64,
    createdBy: 'Mehmed Dracul', archivedAt: on(2026, 8, 22), archivedBy: 'Darth Vader',
  },
  {
    id: 'watch-app', name: 'Watch app', tags: [], testCases: 118, automatedPct: 0, testRuns: 9,
    createdBy: 'Ritika Sharma', archivedAt: on(2026, 9, 3), archivedBy: 'Ritika Sharma',
  },
]

/*
 * Test instances assigned to the signed-in user (brief 3.1). A test instance
 * has no name of its own: it shows its test case's title, configuration,
 * version and status (mock-data.md, Test instance names). Titles come from
 * the approved test case and test instance name lists; the same test case on
 * two configurations makes two instances with one title, as in the product.
 * Test case IDs follow the `#TC-` format; #TC-8, #TC-225 and #TC-56345 are
 * mock-data.md's own examples. A null configuration is the brief's "if any".
 */
const C = {
  chrome120: 'Chrome 120 on Windows 12 · 1920x1080',
  firefox: 'Firefox 144 on macOS Tahoe · 3840x1600',
  brave: 'Brave 1.63 on Windows 11 · 1024x768',
  edge147: 'Edge 147 on macOS Ventura · 1920x1080',
  edge150: 'Edge 150 on Windows 10 · 1280x1024',
  opera: 'Opera 108 on macOS Golden Gate · 1440x900',
  chrome151: 'Chrome 151 on macOS Ventura · 1280x1024',
  safari: 'Safari 27 on macOS Sonoma · 1440x900',
}
export const ASSIGNED = [
  // Web app
  { id: 'ti-1', project: 'web-app', tc: '#TC-225', v: 'v2', title: 'Filter and Verify Product Search Results',
    run: 'Regression Suite - Release 8.4', config: C.chrome120, status: 'not started', at: ago(2 * HOUR), by: 'Gabbar Singh' },
  { id: 'ti-2', project: 'web-app', tc: '#TC-225', v: 'v2', title: 'Filter and Verify Product Search Results',
    run: 'Regression Suite - Release 8.4', config: C.safari, status: 'not started', at: ago(2 * HOUR), by: 'Gabbar Singh' },
  { id: 'ti-3', project: 'web-app', tc: '#TC-56345', v: 'v1', title: 'Complete Purchase Using Gift Card and Credit Card',
    run: 'Checkout Revamp - UAT Round 2', config: C.edge147, status: 'running', at: ago(1 * DAY), by: 'Darth Vader' },
  { id: 'ti-4', project: 'web-app', tc: '#TC-8', v: 'v4',
    title: 'Verify the siteplan shown on Tourbook property page when property has Leasing and Standard siteplan',
    run: 'Checkout Revamp - UAT Round 2', config: C.firefox, status: 'failed', at: ago(3 * DAY), by: 'Mahendra Damodardas Baahubali' },
  { id: 'ti-5', project: 'web-app', tc: '#TC-9500', v: 'v1', title: 'Validate cart total after applying two coupon codes',
    run: 'Payments Regression - Safari 27 backlog', config: null, status: 'not started', at: ago(5 * DAY), by: 'Oppenheimer' },
  { id: 'ti-6', project: 'web-app', tc: '#TC-8445', v: 'v2', title: 'Check invoice download in both PDF and CSV formats',
    run: 'Payments Regression - Safari 27 backlog', config: C.safari, status: 'passed', at: ago(9 * DAY), by: 'George Orwell' },
  // Mobile app
  { id: 'ti-7', project: 'mobile-app', tc: '#TC-7742', v: 'v3', title: 'Attempt Signup and Verify Preferences Screen Persistence',
    run: 'KaneAI Generated Run - Login and Signup Flows', config: C.edge150, status: 'running', at: ago(4 * HOUR), by: 'Darth Vader' },
  { id: 'ti-8', project: 'mobile-app', tc: '#TC-4410', v: 'v1', title: 'Verify session timeout redirects to login with the return URL preserved',
    run: 'Release Candidate 12.1 - Full Regression', config: C.brave, status: 'failed', at: ago(1 * DAY), by: 'Kokushibo' },
  { id: 'ti-9', project: 'mobile-app', tc: '#TC-1207', v: 'v2', title: 'Verify OTP expiry after 60 seconds on the login screen',
    run: 'Release Candidate 12.1 - Full Regression', config: null, status: 'not started', at: ago(13 * DAY), by: 'Mehmed Dracul' },
  { id: 'ti-10', project: 'mobile-app', tc: '#TC-311', v: 'v1', title: 'Verify account lock after multiple failed login attempts',
    run: 'Smoke - Sprint 42 Nightly', config: C.opera, status: 'skipped', at: ago(21 * DAY), by: 'Gabbar Singh' },
  // iPad app
  { id: 'ti-11', project: 'ipad-app', tc: '#TC-88904', v: 'v1',
    title: 'Paste the shadow and non-shadow propeties in properties filter and verify the diplayed properties',
    run: 'Cross-browser Sanity || 2026-09-03 07:33:26', config: C.chrome151, status: 'passed', at: ago(3 * DAY), by: 'Darth Vader' },
  { id: 'ti-12', project: 'ipad-app', tc: '#TC-6090', v: 'v3', title: 'Validate bulk upload of 500 records shows progress and a summary',
    run: 'Cross-browser Sanity || 2026-09-03 07:33:26', config: C.chrome120, status: 'not started', at: ago(7 * DAY), by: 'Oppenheimer' },
  { id: 'ti-13', project: 'ipad-app', tc: '#TC-9515', v: 'v1', title: 'Verify dark mode persists across page reloads and new tabs',
    run: 'Smoke - Sprint 42 Nightly', config: C.edge147, status: 'passed', at: on(2026, 9, 3), by: 'George Orwell' },
  // Mobile web
  { id: 'ti-14', project: 'mobile-web', tc: '#TC-27', v: 'v1', title: 'Check filter chips clear individually and via Clear all',
    run: 'Checkout Revamp - UAT Round 2', config: C.safari, status: 'not started', at: ago(6 * HOUR), by: 'Darth Vader' },
  { id: 'ti-15', project: 'mobile-web', tc: '#TC-15002', v: 'v2',
    title: 'Verify the building specification and Units details table on properties details page with source data',
    run: 'Checkout Revamp - UAT Round 2', config: null, status: 'not started', at: ago(2 * DAY), by: 'Mahendra Damodardas Baahubali' },
  { id: 'ti-16', project: 'mobile-web', tc: '#TC-731', v: 'v1', title: 'Attempt Signup and Verify Preferences Screen Persistence',
    run: 'Checkout Revamp - UAT Round 2', config: C.firefox, status: 'failed', at: ago(4 * DAY), by: 'Oppenheimer' },
]

/** More than 30 days without any action by anyone [proposed threshold]. */
export const isInactive = p => NOW - p.lastActionAt > 30 * DAY

/** The soonest milestone across projects, or null (brief 3.2). */
export function nextMilestone(projects) {
  const all = projects.filter(p => p.milestone && p.milestone.due >= NOW)
  all.sort((a, b) => a.milestone.due - b.milestone.due)
  return all[0] ? { ...all[0].milestone, project: all[0] } : null
}

/** Calendar days from today to a date, for "2 days left". */
const startOfDay = d => new Date(d.getFullYear(), d.getMonth(), d.getDate())
export const daysUntil = d => Math.round((startOfDay(d) - startOfDay(NOW)) / DAY)
