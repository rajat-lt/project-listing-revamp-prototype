// Test Manager's project listing, revamped: three tabs attached to the
// platform top bar, in each user's own order, each with its own URL (spec §1
// and §4.1); and, inside a project, its test case listing (v3 item 1).
// Demo states: ?state=loading, ?state=error and ?state=empty.
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Announcer, announce } from './lt.jsx'
import { ToastProvider, useToast, LTUnderlineNav } from './overlays.jsx'
import { PlatformSidebar, TopBar } from './shell.jsx'
import { ReorderTabs } from './tabbar.jsx'
import { ForYou } from './foryou.jsx'
import { YourProjects, Archived } from './projects.jsx'
import { ProjectPage } from './projectpage.jsx'
import { CreateTestRunDrawer } from './createrun.jsx'
import {
  PROJECTS, ARCHIVED, USER, NOW, FOLDERS, projectById, isArchived, milestonesIn, testCasesOf,
} from './data.js'
import { fmtCount } from './format.js'

/* v3 item 11: Your Projects first, For You second, Archived third, until a
   user reorders them (v3 item 10). */
const TABS = [
  { id: 'projects', label: 'Your Projects' },
  { id: 'for-you', label: 'For You' },
  { id: 'archived', label: 'Archived' },
]
const DEFAULT_ORDER = TABS.map(t => t.id)
/* Answer 1: the page opens on For You, wherever it sits in the order
   (question 17). */
const LANDING = 'for-you'
const RECENT_MAX = 4

/* #/for-you, #/for-you/{project}, #/for-you/{project or all}/milestones,
   #/projects, #/projects/all, #/projects/all/page/{n}, #/archived, and
   inside a project #/project/{id}, /folder/{folder}, /page/{n}. */
const parseHash = () => {
  const [head, ...rest] = window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  const after = (list, key) => { const i = list.indexOf(key); return i >= 0 ? list[i + 1] : undefined }
  if (head === 'project' && projectById(rest[0])) {
    const tail = rest.slice(1)
    const folder = after(tail, 'folder')
    return { tab: 'project', project: rest[0], folder: FOLDERS.some(f => f.id === folder) ? folder : null,
      page: Number(after(tail, 'page')) || 1 }
  }
  if (head === 'projects') return { tab: 'projects', all: rest[0] === 'all', page: Number(after(rest, 'page')) || 1 }
  if (head === 'archived') return { tab: 'archived' }
  if (head === 'for-you') {
    return { tab: 'for-you', selected: rest[0] && rest[0] !== 'all' ? rest[0] : null,
      sub: rest[1] === 'milestones' ? 'milestones' : 'test-instances' }
  }
  return { tab: LANDING, selected: null, sub: 'test-instances' }
}

/* Brief 6, 7 and v3 item 10: the star, the view and the tab order are the
   signed-in user's own. The prototype keeps them under the user's ID in this
   browser; the product would keep them on the account (spec §4.7). */
const KEY = name => `project-listing-revamp:${USER.id}:${name}`
const load = (name, fallback) => {
  try { const v = localStorage.getItem(KEY(name)); return v == null ? fallback : JSON.parse(v) } catch { return fallback }
}
const save = (name, value) => { try { localStorage.setItem(KEY(name), JSON.stringify(value)) } catch { /* private mode */ } }
const validOrder = o => (Array.isArray(o) && o.length === DEFAULT_ORDER.length && DEFAULT_ORDER.every(id => o.includes(id))
  ? o : DEFAULT_ORDER)

const DEMO = ['loading', 'error', 'empty'].find(s => s === new URLSearchParams(window.location.search).get('state')) ?? 'ready'
const byUpdated = (a, b) => b.updatedAt - a.updatedAt

function Page() {
  const toast = useToast()
  const onStub = useCallback(text => toast(text), [toast])
  const [route, setRoute] = useState(parseHash)
  const [view, setView] = useState(() => (load('view', 'list') === 'grid' ? 'grid' : 'list'))
  const [starred, setStarred] = useState(() => new Set(load('starred', PROJECTS.filter(p => p.starred).map(p => p.id))))
  const [order, setOrder] = useState(() => validOrder(load('tabs', DEFAULT_ORDER)))
  // Your visits make a project recently used (brief 5).
  const [visits, setVisits] = useState(() =>
    Object.fromEntries([...PROJECTS, ...ARCHIVED].map(p => [p.id, { at: p.visitedAt ?? null }])))
  // Test runs created here, by project, until a reload.
  const [runsAdded, setRunsAdded] = useState({})
  const [runProject, setRunProject] = useState(null)
  const drawerRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const onHash = () => setRoute(parseHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const project = route.tab === 'project' ? projectById(route.project) : null
  // Opening a project counts as a visit, which makes it recently used.
  useEffect(() => {
    if (project) setVisits(v => ({ ...v, [project.id]: { at: NOW } }))
  }, [project?.id])
  useEffect(() => {
    const folder = FOLDERS.find(f => f.id === route.folder)
    document.title = project
      ? `${folder ? folder.name : 'All Test Cases'} · ${project.name} · Test Manager`
      : `${TABS.find(t => t.id === route.tab).label} · Test Manager`
    contentRef.current?.scrollTo(0, 0)
  }, [route.tab, project?.id, route.folder])

  const onView = v => { setView(v); save('view', v) }
  const onOrder = o => { setOrder(o); save('tabs', o) }
  const onStar = p => {
    const next = new Set(starred)
    const on = !next.has(p.id)
    if (on) next.add(p.id); else next.delete(p.id)
    setStarred(next)
    save('starred', [...next])
    announce(`${p.name} ${on ? 'starred' : 'unstarred'}`)
  }
  /* Answer 9: Create Test Run opens its drawer on this page. The new run
     joins the project's count, and a toast says where it went
     (ux-text-guidelines.md §3 Toasts: the object, and the past tense of the
     button's verb). */
  const onCreateRun = p => { setRunProject(p); drawerRef.current.open() }
  const onCreated = ({ project: p, name }) => {
    setRunsAdded(m => ({ ...m, [p.id]: (m[p.id] ?? 0) + 1 }))
    toast(`Test run "${name}" created in ${p.name}.`, 'success')
  }

  /* v3 item 2: the switcher lists every project, archived ones too: recently
     used first (up to 4, as on Your Projects), then starred, then the rest,
     the most recently updated first and the archived ones last. */
  const switchGroups = useMemo(() => {
    const everyone = [...PROJECTS, ...ARCHIVED]
    const recent = everyone.filter(p => visits[p.id]?.at).sort((a, b) => visits[b.id].at - visits[a.id].at).slice(0, RECENT_MAX)
    const star = PROJECTS.filter(p => starred.has(p.id) && !recent.includes(p)).sort(byUpdated)
    const rest = [
      ...PROJECTS.filter(p => !recent.includes(p) && !star.includes(p)).sort(byUpdated),
      ...ARCHIVED.filter(p => !recent.includes(p)).sort((a, b) => b.archivedAt - a.archivedAt),
    ]
    const item = p => ({ id: p.id, name: p.name, archived: isArchived(p.id) })
    return [
      { id: 'recent', heading: 'Recently used', items: recent.map(item) },
      { id: 'starred', heading: 'Starred', items: star.map(item) },
      { id: 'rest', heading: 'Other projects', items: rest.map(item) },
    ].filter(g => g.items.length)
  }, [visits, starred])

  const ready = DEMO === 'ready'
  const navs = TABS.map(t => ({
    ...t,
    href: `#/${t.id}`,
    // Tab badges count the rows inside the tab (ux-text-guidelines.md §7).
    // For You holds two kinds of rows, so it carries none.
    counter: t.id === 'projects' ? (ready ? PROJECTS.length : DEMO === 'empty' ? 0 : null)
      : t.id === 'archived' ? (ready ? ARCHIVED.length : DEMO === 'empty' ? 0 : null) : null,
  }))
  /* Inside a project, the project's own nav (test-entity-listing.md §3.1;
     test-instance-details.md: Test Cases, Test Runs, Milestones). Only the
     test case listing is built (v3 item 1); the other tabs answer with a
     toast. */
  const projectNavs = project && [
    { id: 'test-cases', label: 'Test Cases', href: `#/project/${project.id}`,
      counter: DEMO === 'ready' ? fmtCount(testCasesOf(project).length) : DEMO === 'empty' ? 0 : null },
    { id: 'test-runs', label: 'Test Runs', href: '#test-runs',
      counter: fmtCount(project.testRuns + (runsAdded[project.id] ?? 0)) },
    { id: 'milestones', label: 'Milestones', href: '#milestones', counter: fmtCount(milestonesIn(project.id).length) },
  ]

  return (
    <div className="app">
      <PlatformSidebar />
      <div className="main">
        <TopBar onStub={onStub} project={project} switchGroups={switchGroups} switchState={DEMO} />
        {/* The tabs sit on the top bar's lower edge, full width, as the
            project nav does on the test case and test run listings
            (test-entity-listing.md §3.1). Spec C17. */}
        <div className="pagenav">
          {project ? (
            <LTUnderlineNav ariaLabel="Project" navs={projectNavs} current="test-cases"
              onClick={(e, t) => {
                if (t.id === 'test-cases') return
                e.preventDefault()
                onStub(`The ${t.label} tab of ${project.name} opens here.`)
              }} />
          ) : (
            <ReorderTabs ariaLabel="Projects" navs={navs} order={order} setOrder={onOrder} defaultOrder={DEFAULT_ORDER}
              current={route.tab} />
          )}
        </div>
        <main ref={contentRef} className={route.tab === 'for-you' || project ? 'content content--panes' : 'content'}>
          {project && (
            <ProjectPage key={project.id} state={DEMO} project={project} readOnly={isArchived(project.id)}
              folder={route.folder} page={route.page} onStub={onStub} />
          )}
          {route.tab === 'for-you' && <ForYou state={DEMO} selected={route.selected} tab={route.sub} onStub={onStub} />}
          {route.tab === 'projects' && (
            <YourProjects state={DEMO} view={view} onView={onView} starred={starred} onStar={onStar} visits={visits}
              runsAdded={runsAdded} showAll={route.all} page={route.page} onCreateRun={onCreateRun} onStub={onStub} />
          )}
          {route.tab === 'archived' && <Archived state={DEMO} view={view} onView={onView} onStub={onStub} />}
        </main>
      </div>
      <CreateTestRunDrawer ref={drawerRef} project={runProject} onCreate={onCreated} />
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <Page />
      <Announcer />
    </ToastProvider>
  )
}
