// For You (brief 3): the test instances assigned to the signed-in user, their
// next milestone, and what changed in each project since their last visit.
// Spec §3.3 and §4.3.
import React from 'react'
import { Flag } from 'lucide-react'
import {
  LTTestStatusLabel, LTLink, LTMetaData, MetaLine, LTAvatar, LTCounterLabel, LTBlankSlate, LTLoader, LTFlash, TruncText,
} from './lt.jsx'
import { ASSIGNED, PROJECTS, NOW, daysUntil, nextMilestone } from './data.js'
import { fmtDate, fmtRelative, fmtCount, initials } from './format.js'

const plural = (n, one, many) => `${fmtCount(n)} ${n === 1 ? one : many}`

/* Visited projects first, most recent visit first; the rest keep their order. */
const byVisit = visits => (a, b) => (visits[b.id]?.at ?? 0) - (visits[a.id]?.at ?? 0)

export function ForYou({ state, visits, onOpenProject, onStub }) {
  return (
    <>
      <header className="view-head">
        <h1 className="view-title">For You</h1>
        <p className="view-desc">Test instances assigned to you, your next milestone, and what changed since you last visited.</p>
      </header>
      {state === 'loading' && <LTLoader />}
      {state === 'error' && <LTFlash variant="danger" text="Assigned test instances failed to load. Try again." />}
      {(state === 'ready' || state === 'empty') && (
        <div className="foryou">
          <Assigned rows={state === 'empty' ? [] : ASSIGNED} visits={visits} onOpenProject={onOpenProject} onStub={onStub} />
          <div className="foryou__aside">
            {state === 'ready' && <Milestone onStub={onStub} />}
            <SinceLastVisit projects={state === 'empty' ? [] : PROJECTS} visits={visits} onOpenProject={onOpenProject} />
          </div>
        </div>
      )}
    </>
  )
}

/* Brief 3.1. Grouped by project: the project is context every row needs, and
   a heading carries it once. Groups follow your recent visits; rows are the
   newest assignment first. */
function Assigned({ rows, visits, onOpenProject, onStub }) {
  const groups = PROJECTS.slice().sort(byVisit(visits))
    .map(p => ({ project: p, rows: rows.filter(r => r.project === p.id).sort((a, b) => b.at - a.at) }))
    .filter(g => g.rows.length)
  return (
    <section className="assigned" aria-labelledby="assigned-h">
      <div className="section-head">
        <h2 id="assigned-h" className="section-title">Assigned to you</h2>
        {rows.length > 0 && <LTCounterLabel count={fmtCount(rows.length)} aria-hidden="true" />}
        {rows.length > 0 && <span className="vh">{plural(rows.length, 'test instance', 'test instances')}</span>}
      </div>
      {groups.length ? groups.map(g => (
        <section key={g.project.id} className="ti-group" aria-labelledby={`g-${g.project.id}`}>
          <div className="ti-group__head">
            <h3 id={`g-${g.project.id}`} className="ti-group__title">
              <LTLink label={g.project.name} onClick={e => { e.preventDefault(); onOpenProject(g.project) }} />
            </h3>
            <span className="ti-group__count">{plural(g.rows.length, 'test instance', 'test instances')}</span>
          </div>
          <ul className="ti-list">
            {g.rows.map(ti => <AssignedRow key={ti.id} ti={ti} onStub={onStub} />)}
          </ul>
        </section>
      )) : (
        <div className="panel">
          <LTBlankSlate heading="0 test instances assigned to you"
            description="Test instances assigned to you appear here, with their test run and configuration." />
        </div>
      )}
    </section>
  )
}

/* One assigned test instance. A test instance has no name of its own: it
   shows its test case's title, then the meta line of the test instance
   listing (test-entity-listing.md §3.4): ID, version, and here the test run
   too, since this list spans runs. A missing configuration names the state
   rather than leaving a gap (ux-text-guidelines.md §3 Empty states), the term
   the project rows use for the same thing (spec C6). */
function AssignedRow({ ti, onStub }) {
  const [browserOs, resolution] = ti.config ? ti.config.split(' · ') : []
  return (
    <li className="ti-row">
      <LTTestStatusLabel status={ti.status} showStatusText={false} className="ti-row__status" />
      <div className="ti-row__main">
        <TruncText as="a" href="#ti" className="lt-link ti-row__title" text={ti.title}
          onClick={e => { e.preventDefault(); onStub(`Test instance ${ti.tc} ${ti.v} opens here.`) }} />
        <MetaLine>
          <LTMetaData value={ti.tc} showLeadingDot={false} label="Test case ID" />
          <LTMetaData value={ti.v} label="Version" />
          <LTMetaData value={ti.run} label="Test run" />
          {ti.config
            ? <><LTMetaData value={browserOs} label="Configuration" /><LTMetaData value={resolution} /></>
            : <LTMetaData value="Needs a configuration" />}
        </MetaLine>
      </div>
      <div className="ti-row__side">
        <p className="ti-row__when">Assigned {fmtRelative(ti.at, NOW)}</p>
        <p className="ti-row__by">
          <span className="vh">by </span>
          <LTAvatar initials={initials(ti.by)} name={ti.by} size={20} decorative />
          <TruncText text={ti.by} className="ti-row__name" />
        </p>
      </div>
    </li>
  )
}

/* Brief 3.2. The soonest milestone you have, across projects. A deadline
   carries its absolute date beside the countdown (ux-text-guidelines.md §7).
   Absent when there is none: an empty value is omitted, never "No
   milestone" (§3). */
function Milestone({ onStub }) {
  const m = nextMilestone(PROJECTS)
  if (!m) return null
  const days = daysUntil(m.due)
  const left = days === 0 ? 'Due today' : `${days} ${days === 1 ? 'day' : 'days'} left`
  return (
    <section className="aside-card" aria-labelledby="milestone-h">
      <h2 id="milestone-h" className="section-title">Your next milestone</h2>
      <div className="milestone">
        <span className="milestone__icon" aria-hidden="true"><Flag size={16} /></span>
        <div className="milestone__main">
          <LTLink label={m.name} className="milestone__name"
            onClick={e => { e.preventDefault(); onStub(`${m.name} in ${m.project.name} opens here.`) }} />
          <p className="milestone__project">{m.project.name}</p>
          <p className="milestone__due"><strong>{left}</strong> · {fmtDate(m.due)}</p>
        </div>
      </div>
    </section>
  )
}

/* Brief 3.3. Each project you visited, with the changes made by anyone else
   since that visit [proposed]. 0 changes is the honest number, so it shows. */
function SinceLastVisit({ projects, visits, onOpenProject }) {
  const visited = projects.filter(p => visits[p.id]?.at).sort(byVisit(visits))
  return (
    <section className="aside-card" aria-labelledby="since-h">
      <h2 id="since-h" className="section-title">Since you last visited</h2>
      {visited.length ? (
        <ul className="since">
          {visited.map(p => {
            const v = visits[p.id]
            return (
              <li key={p.id} className="since__row">
                <div className="since__main">
                  <LTLink label={p.name} onClick={e => { e.preventDefault(); onOpenProject(p) }} />
                  <p className="since__when">You visited {fmtRelative(v.at, NOW)}</p>
                </div>
                <span className="since__count">{plural(v.changes, 'change', 'changes')}</span>
              </li>
            )
          })}
        </ul>
      ) : (
        <LTBlankSlate heading="Projects you visit appear here"
          description="Each one shows how many changes happened since your visit." />
      )}
    </section>
  )
}
