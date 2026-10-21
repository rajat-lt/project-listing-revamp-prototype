// Test Manager's project listing, revamped: three tabs attached to the
// platform top bar, each with its own URL (spec §1 and §4.1). Demo states:
// ?state=loading, ?state=error and ?state=empty.
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Announcer, announce } from './lt.jsx'
import { ToastProvider, useToast, LTUnderlineNav } from './overlays.jsx'
import { PlatformSidebar, TopBar } from './shell.jsx'
import { ForYou } from './foryou.jsx'
import { YourProjects, Archived } from './projects.jsx'
import { CreateTestRunDrawer } from './createrun.jsx'
import { PROJECTS, ARCHIVED, USER, NOW } from './data.js'

const TABS = [
  { id: 'for-you', label: 'For You' },
  { id: 'projects', label: 'Your Projects' },
  { id: 'archived', label: 'Archived' },
]
/* #/for-you, #/for-you/{project}, #/for-you/{project or all}/milestones,
   #/projects and #/archived. */
const parseHash = () => {
  const [tab, sel, sub] = window.location.hash.replace(/^#\/?/, '').split('/')
  if (tab === 'projects' || tab === 'archived') return { tab }
  return { tab: 'for-you', selected: sel && sel !== 'all' ? sel : null, sub: sub === 'milestones' ? 'milestones' : 'test-instances' }
}

/* Brief 6 and 7: the star and the view are the signed-in user's own. The
   prototype keeps them under the user's ID in this browser; the product would
   keep them on the account (spec §4.7). */
const KEY = name => `project-listing-revamp:${USER.id}:${name}`
const load = (name, fallback) => {
  try { const v = localStorage.getItem(KEY(name)); return v == null ? fallback : JSON.parse(v) } catch { return fallback }
}
const save = (name, value) => { try { localStorage.setItem(KEY(name), JSON.stringify(value)) } catch { /* private mode */ } }

const DEMO = ['loading', 'error', 'empty'].find(s => s === new URLSearchParams(window.location.search).get('state')) ?? 'ready'

function Page() {
  const toast = useToast()
  const onStub = useCallback(text => toast(text), [toast])
  const [route, setRoute] = useState(parseHash)
  const [view, setView] = useState(() => (load('view', 'list') === 'grid' ? 'grid' : 'list'))
  const [starred, setStarred] = useState(() => new Set(load('starred', PROJECTS.filter(p => p.starred).map(p => p.id))))
  // Your visits make a project recently used (brief 5).
  const [visits, setVisits] = useState(() => Object.fromEntries(PROJECTS.map(p => [p.id, { at: p.visitedAt }])))
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
  useEffect(() => {
    document.title = `${TABS.find(t => t.id === route.tab).label} · Test Manager`
    contentRef.current?.scrollTo(0, 0)
  }, [route.tab])

  const onView = v => { setView(v); save('view', v) }
  const onStar = p => {
    const next = new Set(starred)
    const on = !next.has(p.id)
    if (on) next.add(p.id); else next.delete(p.id)
    setStarred(next)
    save('starred', [...next])
    announce(`${p.name} ${on ? 'starred' : 'unstarred'}`)
  }
  // Opening a project counts as a visit, which makes it recently used.
  const onOpenProject = p => {
    setVisits(v => ({ ...v, [p.id]: { at: NOW } }))
    onStub(`The ${p.name} project opens here.`)
  }
  /* Answer 9: Create Test Run opens its drawer on this page. The new run
     joins the project's count, and a toast says where it went
     (ux-text-guidelines.md §3 Toasts: the object, and the past tense of the
     button's verb). */
  const onCreateRun = p => { setRunProject(p); drawerRef.current.open() }
  const onCreated = ({ project, name }) => {
    setRunsAdded(m => ({ ...m, [project.id]: (m[project.id] ?? 0) + 1 }))
    toast(`Test run "${name}" created in ${project.name}.`, 'success')
  }

  const ready = DEMO === 'ready'
  const navs = TABS.map(t => ({
    ...t,
    href: `#/${t.id}`,
    // Tab badges count the rows inside the tab (ux-text-guidelines.md §7).
    // For You holds two kinds of rows, so it carries none.
    counter: t.id === 'projects' ? (ready ? PROJECTS.length : DEMO === 'empty' ? 0 : null)
      : t.id === 'archived' ? (ready ? ARCHIVED.length : DEMO === 'empty' ? 0 : null) : null,
  }))

  return (
    <div className="app">
      <PlatformSidebar />
      <div className="main">
        <TopBar onStub={onStub} />
        {/* v2 item 1: the tabs sit on the top bar's lower edge, full width, as
            the project nav does on the test case and test run listings
            (test-entity-listing.md §3.1). Spec C17. */}
        <div className="pagenav">
          <LTUnderlineNav ariaLabel="Projects" navs={navs} current={route.tab} />
        </div>
        <main ref={contentRef} className={route.tab === 'for-you' ? 'content content--panes' : 'content'}>
          {route.tab === 'for-you' && <ForYou state={DEMO} selected={route.selected} tab={route.sub} onStub={onStub} />}
          {route.tab === 'projects' && (
            <YourProjects state={DEMO} view={view} onView={onView} starred={starred} onStar={onStar} visits={visits}
              runsAdded={runsAdded} onOpenProject={onOpenProject} onCreateRun={onCreateRun} onStub={onStub} />
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
