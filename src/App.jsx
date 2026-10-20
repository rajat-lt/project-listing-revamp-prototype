// Test Manager's project listing, revamped: three tabs under the platform top
// bar, each with its own URL (spec §1 and §4.1). Demo states: ?state=loading,
// ?state=error and ?state=empty.
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Announcer, announce } from './lt.jsx'
import { ToastProvider, useToast, LTUnderlineNav } from './overlays.jsx'
import { PlatformSidebar, TopBar } from './shell.jsx'
import { ForYou } from './foryou.jsx'
import { YourProjects, Archived } from './projects.jsx'
import { PROJECTS, ARCHIVED, USER, NOW } from './data.js'

const TABS = [
  { id: 'for-you', label: 'For You' },
  { id: 'projects', label: 'Your Projects' },
  { id: 'archived', label: 'Archived' },
]
const routeFromHash = () => {
  const r = window.location.hash.replace(/^#\/?/, '')
  return TABS.some(t => t.id === r) ? r : 'for-you'
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
  const [route, setRoute] = useState(routeFromHash)
  const [view, setView] = useState(() => (load('view', 'list') === 'grid' ? 'grid' : 'list'))
  const [starred, setStarred] = useState(() => new Set(load('starred', PROJECTS.filter(p => p.starred).map(p => p.id))))
  // Your visits, and the changes others made since each (brief 3.3 and 5).
  const [visits, setVisits] = useState(() =>
    Object.fromEntries(PROJECTS.map(p => [p.id, { at: p.visitedAt, changes: p.changesSinceVisit }])))
  const contentRef = useRef(null)

  useEffect(() => {
    const onHash = () => setRoute(routeFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  useEffect(() => {
    document.title = `${TABS.find(t => t.id === route).label} · Test Manager`
    contentRef.current?.scrollTo(0, 0)
  }, [route])

  const onView = v => { setView(v); save('view', v) }
  const onStar = p => {
    const next = new Set(starred)
    const on = !next.has(p.id)
    if (on) next.add(p.id); else next.delete(p.id)
    setStarred(next)
    save('starred', [...next])
    announce(`${p.name} ${on ? 'starred' : 'unstarred'}`)
  }
  /* Opening a project counts as a visit: it moves to the front of Recently
     used, and its count of changes since your visit starts again at 0. */
  const onOpenProject = p => {
    setVisits(v => ({ ...v, [p.id]: { at: NOW, changes: 0 } }))
    onStub(`The ${p.name} project opens here.`)
  }

  const ready = DEMO === 'ready'
  const navs = TABS.map(t => ({
    ...t,
    href: `#/${t.id}`,
    // Tab badges count the rows inside the tab (ux-text-guidelines.md §7).
    // For You holds three kinds of rows, so it carries none.
    counter: t.id === 'projects' ? (ready ? PROJECTS.length : DEMO === 'empty' ? 0 : null)
      : t.id === 'archived' ? (ready ? ARCHIVED.length : DEMO === 'empty' ? 0 : null) : null,
  }))

  return (
    <div className="app">
      <PlatformSidebar />
      <div className="main">
        <TopBar onStub={onStub} />
        <main ref={contentRef} className="content">
          <div className="column">
            <LTUnderlineNav ariaLabel="Projects" navs={navs} current={route} />
            {route === 'for-you' && <ForYou state={DEMO} visits={visits} onOpenProject={onOpenProject} onStub={onStub} />}
            {route === 'projects' && (
              <YourProjects state={DEMO} view={view} onView={onView} starred={starred} onStar={onStar}
                visits={visits} onOpenProject={onOpenProject} onStub={onStub} />
            )}
            {route === 'archived' && <Archived state={DEMO} view={view} onView={onView} onStub={onStub} />}
          </div>
        </main>
      </div>
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
