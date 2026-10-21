// For You (brief 3; reshaped by v2 item 2, 21 Oct 2026). Two panes, as the
// test case and test run listings lay out their folder pane and list
// (test-entity-listing.md §3.2): on the left the projects where test
// instances are assigned to you; on the right, for the selection, an
// LTTabNav with its Test Instances and Milestones. Spec §3.3 and §4.3.
import React from 'react'
import { Flag } from 'lucide-react'
import {
  LTTestStatusLabel, LTLink, LTMetaData, MetaLine, LTAvatar, LTBlankSlate, LTLoader, LTFlash, TruncText,
  PersonHint, TimeHint,
} from './lt.jsx'
import { LTNavList, LTTabNav } from './overlays.jsx'
import { ASSIGNED, PROJECTS, NOW, USER, myMilestones, daysUntil } from './data.js'
import { fmtDate, fmtCount, initials } from './format.js'

const plural = (n, one, many) => `${fmtCount(n)} ${n === 1 ? one : many}`
const stop = fn => e => { e.preventDefault(); fn() }
const latest = rows => Math.max(...rows.map(r => r.at))

const DESC = 'Test instances assigned to you and milestones you own or created.'
/* Loading, error and empty take the whole tab, under its own heading. */
function State({ children }) {
  return (
    <div className="fy-state">
      <header className="view-head">
        <h1 className="view-title">For You</h1>
        <p className="view-desc">{DESC}</p>
      </header>
      {children}
    </div>
  )
}

export function ForYou({ state, selected, tab, onStub }) {
  if (state === 'loading') return <State><LTLoader /></State>
  if (state === 'error') return <State><LTFlash variant="danger" text="Assigned test instances failed to load. Try again." /></State>
  const rows = state === 'empty' ? [] : ASSIGNED
  /* The projects where test instances are assigned to you, the newest
     assignment first, so new work rises to the top. Each counts your test
     instances and your milestones (you own it or created it). */
  const projects = PROJECTS
    .map(p => ({ p, tis: rows.filter(r => r.project === p.id), ms: myMilestones(p.id) }))
    .filter(x => x.tis.length)
    .sort((a, b) => latest(b.tis) - latest(a.tis))
  if (!projects.length) {
    return (
      <State>
        <div className="panel">
          <LTBlankSlate heading="0 test instances assigned to you"
            description="Test instances assigned to you appear here, with their test run and configuration." />
        </div>
      </State>
    )
  }

  const current = projects.find(x => x.p.id === selected) ?? null // null: All Projects
  const allMs = projects.flatMap(x => x.ms).sort((a, b) => a.due - b.due)
  const tis = (current ? current.tis : rows).slice().sort((a, b) => b.at - a.at)
  const ms = current ? current.ms : allMs
  const counts = (t, m) => `${plural(t, 'test instance', 'test instances')} · ${plural(m, 'milestone', 'milestones')}`
  // Each selection and tab has its own URL; switching projects keeps the tab.
  const href = (id, t) => {
    if (t !== 'milestones') return id === 'all' ? '#/for-you' : `#/for-you/${id}`
    return `#/for-you/${id}/milestones`
  }
  const here = current ? current.p.id : 'all'

  return (
    <div className="fy">
      {/* Left pane, 320px: the pane scale's simple-list step (guidelines/README.md §2). */}
      <div className="fy-pane">
        <p className="fy-pane__title">Projects</p>
        <LTNavList ariaLabel="Projects" selectedTab={here} listItems={[
          { id: 'all', label: 'All Projects', meta: counts(rows.length, allMs.length), href: href('all', tab) },
          ...projects.map(x => ({ id: x.p.id, label: x.p.name, meta: counts(x.tis.length, x.ms.length), href: href(x.p.id, tab) })),
        ]} />
      </div>

      <div className="fy-main">
        <header className="fy-head">
          <h1 className="view-title">{current ? current.p.name : 'All Projects'}</h1>
          <p className="view-desc">{DESC}</p>
        </header>
        <LTTabNav ariaLabel="Your work" activeTab={tab} items={[
          { id: 'test-instances', label: 'Test Instances', counter: fmtCount(tis.length), href: href(here, 'test-instances') },
          { id: 'milestones', label: 'Milestones', counter: fmtCount(ms.length), href: href(here, 'milestones') },
        ]} />
        <div className="fy-panel">
          {tab === 'milestones'
            ? <MilestoneList ms={ms} showProject={!current} inProject={current?.p.name} onStub={onStub} />
            : <TestInstanceList tis={tis} showProject={!current} onStub={onStub} />}
        </div>
      </div>
    </div>
  )
}

const projectName = id => PROJECTS.find(p => p.id === id)?.name

/* Brief 3.1. A test instance has no name of its own: it shows its test case's
   title, then the meta line of the test instance listing
   (test-entity-listing.md §3.4), with the test run added, since this list
   spans runs, and the project when All Projects is selected. A missing
   configuration names the state (C6). The whole row opens the test
   instance, and hovering it underlines the title (v2 item 5). */
function TestInstanceList({ tis, showProject, onStub }) {
  return (
    <ul className="rows">
      {tis.map(ti => {
        const [browserOs, resolution] = ti.config ? ti.config.split(' · ') : []
        return (
          <li key={ti.id} className="ti-row clickrow">
            <LTTestStatusLabel status={ti.status} showStatusText={false} className="ti-row__status" />
            <div className="ti-row__main">
              <TruncText as="a" href="#ti" className="lt-link ti-row__title clickrow__link" text={ti.title}
                onClick={stop(() => onStub(`Test instance ${ti.tc} ${ti.v} opens here.`))} />
              <MetaLine className="ti-row__meta">
                {showProject && <LTMetaData value={projectName(ti.project)} showLeadingDot={false} label="Project" />}
                <LTMetaData value={ti.tc} showLeadingDot={showProject} label="Test case ID" />
                <LTMetaData value={ti.v} label="Version" />
                <LTMetaData value={ti.run} label="Test run" />
                {ti.config
                  ? <><LTMetaData value={browserOs} label="Configuration" /><LTMetaData value={resolution} /></>
                  : <LTMetaData value="Needs a configuration" />}
              </MetaLine>
            </div>
            <div className="ti-row__side">
              <p className="ti-row__when">Assigned <TimeHint date={ti.at} now={NOW} /></p>
              <p className="ti-row__by">
                <span className="vh">by </span>
                <LTAvatar initials={initials(ti.by)} name={ti.by} size={20} decorative />
                <PersonHint name={ti.by} />
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/* Your milestones (Rajat, 21 Oct 2026: answer 6): the ones you own or
   created, soonest first, so the first row is your next one (brief 3.2). A
   deadline carries its absolute date beside the countdown
   (ux-text-guidelines.md §7). The row says which of the two makes it yours. */
function MilestoneList({ ms, showProject, inProject, onStub }) {
  if (!ms.length) {
    return (
      <div className="panel">
        <LTBlankSlate heading="0 milestones you own or created"
          description={`Milestones you own or create in ${inProject} appear here.`} />
      </div>
    )
  }
  const who = name => (name === USER.name ? 'you' : <PersonHint name={name} />)
  return (
    <ul className="rows">
      {ms.map(m => {
        const days = daysUntil(m.due)
        const left = days === 0 ? 'Due today' : `${days} ${days === 1 ? 'day' : 'days'} left`
        return (
          <li key={m.id} className="ms-row clickrow">
            <span className="ms-row__icon" aria-hidden="true"><Flag size={16} /></span>
            <div className="ms-row__main">
              <LTLink label={m.name} className="ms-row__title clickrow__link"
                onClick={stop(() => onStub(`${m.name} in ${projectName(m.project)} opens here.`))} />
              <MetaLine className="ms-row__meta">
                {showProject && <LTMetaData value={projectName(m.project)} showLeadingDot={false} label="Project" />}
                <LTMetaData showLeadingDot={showProject}>Owned by {who(m.owner)}</LTMetaData>
                <LTMetaData>Created by {who(m.createdBy)}</LTMetaData>
              </MetaLine>
            </div>
            <div className="ms-row__side">
              <p className="ms-row__left">{left}</p>
              <p className="ms-row__due">{fmtDate(m.due)}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
