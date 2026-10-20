// Your Projects (brief 4 to 11) and Archived (brief 12). Spec §3.4, §3.5 and §4.
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Star, Flag, ListTodo, List, LayoutGrid } from 'lucide-react'
import {
  cx, announce, LTLink, LTTag, LTLabelGroup, LTMetaData, MetaLine, LTButton, LTIconButton, LTInlineMessage, LTProgressBar,
  LTTestStatusLabel, StatusGlyph, LTInputBox, LTBlankSlate, LTLoader, LTFlash, LTAvatar,
} from './lt.jsx'
import { LTSegmentedControl, LTSelectPanel, LTPopover } from './overlays.jsx'
import { PROJECTS, ARCHIVED, NOW, isInactive } from './data.js'
import { fmtDate, fmtRelative, fmtCount, fmtDuration, initials } from './format.js'

const plural = (n, one, many) => `${fmtCount(n)} ${n === 1 ? one : many}`
const stop = fn => e => { e.preventDefault(); fn() }

/* Brief 7: list or grid, one setting for both tabs. Icon-only, so every
   segment has a tooltip and a label (guidelines/ltsegmentedcontrol.md). */
const VIEWS = [{ value: 'list', label: 'List', icon: List }, { value: 'grid', label: 'Grid', icon: LayoutGrid }]
function ViewToggle({ view, onView }) {
  return <LTSegmentedControl ariaLabel="View" role="radiogroup" isIconButton showTooltip options={VIEWS}
    selectedValue={view} onChange={onView} />
}

/* ---------- shared pieces of a row and a card ---------- */

/* Tags in an LTLabelGroup: three at most, then "Show {n} More", so every tag
   stays reachable (guidelines/ltlabelgroup.md). */
const MAX_TAGS = 3
function ProjectTags({ tags }) {
  const [all, setAll] = useState(false)
  if (!tags.length) return null
  const hidden = tags.length - MAX_TAGS
  return (
    <div className="tags">
      <LTLabelGroup>
        {(all ? tags : tags.slice(0, MAX_TAGS)).map(t => <LTTag key={t} text={t} variant="blueAccent" />)}
      </LTLabelGroup>
      {hidden > 0 && (
        <LTButton variant="invisible" size="small" className="tags__more" aria-expanded={all}
          label={all ? 'Show Less' : `Show ${hidden} More`} onClick={() => setAll(v => !v)} />
      )}
    </div>
  )
}

/* Brief 4: "total TC count (automated TC percentage)". A project with no test
   cases has no automated share, so it shows none. */
const testCasesText = p => (p.testCases
  ? `${plural(p.testCases, 'test case', 'test cases')} (${p.automatedPct}% automated)`
  : '0 test cases')

/* Brief 6. The name says what pressing it will do; screen readers also hear
   the result (ux-text-guidelines.md §3, silent success still speaks). The
   shape, outline or filled, carries the state, never the colour alone. */
function StarToggle({ p, starred, onStar }) {
  return (
    <LTIconButton icon={Star} variant="invisible" size="small" className={cx('star', starred && 'is-starred')}
      ariaLabel={`${starred ? 'Unstar' : 'Star'} ${p.name}`} onClick={() => onStar(p)} />
  )
}

/* Brief 8 and the milestone of brief 4: what needs you in this project. Each
   count links to the project's test instance list, filtered; a zero count is
   omitted, and with both at zero the line is gone. */
function NeedsYou({ p, onStub, stacked = false }) {
  const ti = [
    p.unassigned > 0 && { key: 'u', label: `${fmtCount(p.unassigned)} unassigned`,
      toast: `The ${plural(p.unassigned, 'unassigned test instance', 'unassigned test instances')} in ${p.name} open here.` },
    p.needConfig > 0 && { key: 'c', label: `${fmtCount(p.needConfig)} ${p.needConfig === 1 ? 'needs' : 'need'} a configuration`,
      toast: `The ${plural(p.needConfig, 'test instance', 'test instances')} in ${p.name} that need a configuration open here.` },
  ].filter(Boolean)
  if (!p.milestone && !ti.length && !p.actions.length) return null
  return (
    <div className={cx('needs', stacked && 'needs--stacked')}>
      {p.milestone && (
        <p className="need">
          <Flag size={16} aria-hidden="true" className="need__icon" />
          <span>Your next milestone: {p.milestone.name} · {fmtDate(p.milestone.due)}</span>
        </p>
      )}
      {ti.length > 0 && (
        <p className="need">
          <ListTodo size={16} aria-hidden="true" className="need__icon" />
          <span>
            Test instances:{' '}
            {ti.map((t, i) => (
              <React.Fragment key={t.key}>
                {i > 0 && <span className="meta-dot" aria-hidden="true">·</span>}
                <LTLink muted label={t.label} onClick={stop(() => onStub(t.toast))} />
              </React.Fragment>
            ))}
          </span>
        </p>
      )}
      {p.actions.length > 0 && <OngoingActions p={p} onStub={onStub} />}
    </div>
  )
}

/* Brief 11. The count of running and queued actions; hovering it for 250ms,
   or pressing it, opens the list in an LTPopover (spec C3, C5, C12). */
const RunningIcon = () => <StatusGlyph status="running" size={16} />
const QueuedIcon = () => <StatusGlyph status="queued" size={16} />
function OngoingActions({ p, onStub }) {
  const n = p.actions.length
  const label = `${n} ongoing ${n === 1 ? 'action' : 'actions'}`
  return (
    <LTPopover direction="bottom-left" canChangeDirection containsInteractiveChildElement heading={label}
      popOverbodyJSX={<ActionList p={p} onStub={onStub} />}>
      <LTButton variant="invisible" size="small" className="need__btn" label={label}
        leadingIcon={p.actions.some(a => a.status === 'running') ? RunningIcon : QueuedIcon} />
    </LTPopover>
  )
}

/* Each action: status icon, title, then progress as counts processed (no ETA,
   ux-text-guidelines.md §7) and how long it has been running or waiting.
   The bar repeats the visible percentage, so it is decoration to screen
   readers (guidelines/ltprogressbar.md). */
function ActionList({ p, onStub }) {
  return (
    <>
      <ul className="acts">
        {p.actions.map(a => (
          <li key={a.id} className="act">
            <span className="act__status"><StatusGlyph status={a.status} size={16} /></span>
            <div className="act__main">
              <p className="act__title">{a.title}</p>
              {a.status === 'running' && (
                <>
                  <p className="act__progress">{fmtCount(a.done)}/{fmtCount(a.total)} {a.unit} · {a.pct}%</p>
                  <LTProgressBar size="small" className="act__bar"
                    segments={[{ id: a.id, progress: a.pct, style: { backgroundColor: 'var(--accent-emphasis)' } }]} />
                </>
              )}
              <p className="act__meta">
                {a.status === 'running' ? 'Running' : 'Queued'} · {fmtDuration(a.elapsed)} · Started by {a.by}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div className="acts__foot">
        <LTLink label="View All Actions" onClick={stop(() => onStub(`The Actions tab of ${p.name} opens here.`))} />
      </div>
    </>
  )
}

/* Brief 10: more than 30 days without any action by anyone [proposed]. Info,
   not warning: a fact with no decision attached (spec C4). Its date is the
   last action, which can be later than "Updated". */
function Inactive({ p }) {
  if (!isInactive(p)) return null
  return <LTInlineMessage variant="info" size="medium" className="inactive">Inactive since {fmtDate(p.lastActionAt)}.</LTInlineMessage>
}

/* ---------- the list row and the grid card ---------- */

function ProjectRow({ p, starred, onStar, onOpen, onStub }) {
  return (
    <li className="prow">
      <div className="prow__main">
        <div className="prow__head">
          <h3 className="prow__title"><LTLink label={p.name} onClick={stop(() => onOpen(p))} /></h3>
          <ProjectTags tags={p.tags} />
        </div>
        <MetaLine>
          <LTMetaData value={testCasesText(p)} showLeadingDot={false} />
          <LTMetaData value={plural(p.testRuns, 'test run', 'test runs')} />
          <LTMetaData value={`Created by ${p.createdBy}`} />
          <LTMetaData value={`Updated ${fmtRelative(p.updatedAt, NOW)}`} />
        </MetaLine>
        <NeedsYou p={p} onStub={onStub} />
        <Inactive p={p} />
      </div>
      <div className="prow__actions">
        <LTButton variant="outline" size="small" label="Create Test Run"
          onClick={() => onStub(`The test run form for ${p.name} opens here.`)} />
        <StarToggle p={p} starred={starred} onStar={onStar} />
      </div>
    </li>
  )
}

/* The grid card carries the row's facts, rearranged (spec §3.4). No card
   component exists among the 69, so it is composed, as SmartUI's are. */
function ProjectCard({ p, starred, onStar, onOpen, onStub }) {
  return (
    <li className="pcard">
      <div className="pcard__head">
        <h3 className="pcard__title"><LTLink label={p.name} onClick={stop(() => onOpen(p))} /></h3>
        <StarToggle p={p} starred={starred} onStar={onStar} />
      </div>
      <ProjectTags tags={p.tags} />
      <MetaLine>
        <LTMetaData value={plural(p.testCases, 'test case', 'test cases')} showLeadingDot={false} />
        <LTMetaData value={plural(p.testRuns, 'test run', 'test runs')} />
      </MetaLine>
      {p.testCases > 0 && (
        <div className="pcard__auto">
          <LTProgressBar size="small" className="pcard__bar"
            segments={[{ id: 'automated', progress: p.automatedPct, style: { backgroundColor: 'var(--accent-emphasis)' } }]} />
          <span>{p.automatedPct}% automated</span>
        </div>
      )}
      <NeedsYou p={p} onStub={onStub} stacked />
      <Inactive p={p} />
      <div className="pcard__foot">
        <MetaLine>
          <LTMetaData value={`Created by ${p.createdBy}`} showLeadingDot={false} />
          <LTMetaData value={`Updated ${fmtRelative(p.updatedAt, NOW)}`} />
        </MetaLine>
        <LTButton variant="outline" size="small" label="Create Test Run"
          onClick={() => onStub(`The test run form for ${p.name} opens here.`)} />
      </div>
    </li>
  )
}

/* ---------- Your Projects ---------- */

const RECENT_MAX = 4
const byName = (a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })

export function YourProjects({ state, view, onView, starred, onStar, visits, onOpenProject, onStub }) {
  const projects = state === 'empty' ? [] : PROJECTS
  const [query, setQuery] = useState('')
  const [createdBy, setCreatedBy] = useState([])
  const [tags, setTags] = useState([])
  const filtering = Boolean(query.trim() || createdBy.length || tags.length)

  /* Brief 6: starred first, then the most recently updated. The order is set
     when the tab opens and when the search or a filter changes, never by a
     star, so a row never jumps away from the pointer [proposed]. */
  const starredRef = useRef(starred)
  starredRef.current = starred
  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    const s = starredRef.current
    return projects
      .filter(p => !q || p.name.toLowerCase().includes(q))
      .filter(p => !createdBy.length || createdBy.includes(p.createdBy))
      .filter(p => !tags.length || p.tags.some(t => tags.includes(t)))
      .sort((a, b) => (s.has(b.id) - s.has(a.id)) || (b.updatedAt - a.updatedAt))
  }, [projects, query, createdBy, tags])

  // The result count, for screen readers, once typing pauses.
  const first = useRef(true)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    const text = filtering ? plural(list.length, 'matching project', 'matching projects') : plural(list.length, 'project', 'projects')
    const t = setTimeout(() => announce(text), 500)
    return () => clearTimeout(t)
  }, [list])

  // Brief 5: the projects you opened most recently, up to 4.
  const recent = projects.filter(p => visits[p.id]?.at).sort((a, b) => visits[b.id].at - visits[a.id].at).slice(0, RECENT_MAX)
  const creators = [...new Set(projects.map(p => p.createdBy))].sort(byName)
    .map(n => ({ value: n, label: n, leadingVisual: <LTAvatar initials={initials(n)} name={n} size={20} decorative /> }))
  const allTags = [...new Set(projects.flatMap(p => p.tags))].sort(byName).map(t => ({ value: t, label: t }))
  const createProject = () => onStub('The project form opens here.')

  return (
    <>
      <header className="view-head">
        <h1 className="view-title">Your Projects</h1>
        <p className="view-desc">Projects hold all your test case information.</p>
      </header>
      {state === 'loading' && <LTLoader />}
      {state === 'error' && <LTFlash variant="danger" text="Project list failed to load. Try again." />}
      {state === 'empty' && (
        <div className="panel">
          <LTBlankSlate heading="Start with your first project" description="Projects keep your test cases organized."
            primaryAction={<LTButton variant="primary" size="medium" label="Create Project" onClick={createProject} />} />
        </div>
      )}
      {state === 'ready' && (
        <>
          {!filtering && recent.length > 0 && (
            <section className="recent" aria-labelledby="recent-h">
              <h2 id="recent-h" className="section-title">Recently used</h2>
              <ul className="recent__list">
                {recent.map(p => (
                  <li key={p.id} className="recent__card">
                    <LTLink label={p.name} className="recent__name" onClick={stop(() => onOpenProject(p))} />
                    <p className="recent__when">You visited {fmtRelative(visits[p.id].at, NOW)}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section className="all" aria-labelledby="all-h">
            <h2 id="all-h" className="section-title">All projects</h2>
            <div className="toolbar">
              <LTInputBox value={query} onChange={setQuery} placeholder="Search projects" ariaLabel="Search projects"
                className="toolbar__search" />
              <LTSelectPanel title="Created by" buttonLabel="Created by" searchPlaceholder="Filter people"
                options={creators} defaultValues={createdBy} onApply={setCreatedBy} />
              <LTSelectPanel title="Tags" buttonLabel="Tags" searchPlaceholder="Filter tags"
                options={allTags} defaultValues={tags} onApply={setTags} />
              <ViewToggle view={view} onView={onView} />
              <LTButton variant="primary" size="medium" label="Create Project" onClick={createProject} />
            </div>
            {list.length > 0 ? (
              <>
                <p className="caption">Starred projects first, then the most recently updated.</p>
                {view === 'list' ? (
                  <ul className="plist">
                    {list.map(p => <ProjectRow key={p.id} p={p} starred={starred.has(p.id)} onStar={onStar}
                      onOpen={onOpenProject} onStub={onStub} />)}
                  </ul>
                ) : (
                  <ul className="pgrid">
                    {list.map(p => <ProjectCard key={p.id} p={p} starred={starred.has(p.id)} onStar={onStar}
                      onOpen={onOpenProject} onStub={onStub} />)}
                  </ul>
                )}
              </>
            ) : (
              <div className="panel">
                <LTBlankSlate heading="0 matching projects" description="Change or clear the filters to see more projects." />
              </div>
            )}
          </section>
        </>
      )}
    </>
  )
}

/* ---------- Archived ---------- */

/* Brief 12: read-only. No star, no Create Test Run, no milestone, no test
   instance counts and no actions: nothing in an archived project changes.
   It leads with the archived status icon (mock-data.md, type=Archive). */
function ArchivedRow({ p, onOpen }) {
  return (
    <li className="prow prow--archived">
      <LTTestStatusLabel status="archived" showStatusText={false} className="prow__status" />
      <div className="prow__main">
        <div className="prow__head">
          <h3 className="prow__title"><LTLink label={p.name} onClick={stop(() => onOpen(p))} /></h3>
          <LTTag text="Read-only" variant="secondary" />
          <ProjectTags tags={p.tags} />
        </div>
        <MetaLine>
          <LTMetaData value={testCasesText(p)} showLeadingDot={false} />
          <LTMetaData value={plural(p.testRuns, 'test run', 'test runs')} />
          <LTMetaData value={`Created by ${p.createdBy}`} />
        </MetaLine>
        <MetaLine>
          <LTMetaData value={`Archived ${fmtRelative(p.archivedAt, NOW)} by ${p.archivedBy}`} showLeadingDot={false} />
        </MetaLine>
      </div>
    </li>
  )
}

function ArchivedCard({ p, onOpen }) {
  return (
    <li className="pcard pcard--archived">
      <div className="pcard__head">
        <LTTestStatusLabel status="archived" showStatusText={false} className="pcard__status" />
        <h3 className="pcard__title"><LTLink label={p.name} onClick={stop(() => onOpen(p))} /></h3>
        <LTTag text="Read-only" variant="secondary" />
      </div>
      <ProjectTags tags={p.tags} />
      <MetaLine>
        <LTMetaData value={plural(p.testCases, 'test case', 'test cases')} showLeadingDot={false} />
        <LTMetaData value={plural(p.testRuns, 'test run', 'test runs')} />
      </MetaLine>
      {p.testCases > 0 && (
        <div className="pcard__auto">
          <LTProgressBar size="small" className="pcard__bar"
            segments={[{ id: 'automated', progress: p.automatedPct, style: { backgroundColor: 'var(--accent-emphasis)' } }]} />
          <span>{p.automatedPct}% automated</span>
        </div>
      )}
      <div className="pcard__foot">
        <MetaLine>
          <LTMetaData value={`Created by ${p.createdBy}`} showLeadingDot={false} />
          <LTMetaData value={`Archived ${fmtRelative(p.archivedAt, NOW)} by ${p.archivedBy}`} />
        </MetaLine>
      </div>
    </li>
  )
}

export function Archived({ state, view, onView, onStub }) {
  const projects = state === 'empty' ? [] : ARCHIVED
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const list = projects.filter(p => !q || p.name.toLowerCase().includes(q)).sort((a, b) => b.archivedAt - a.archivedAt)
  const first = useRef(true)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    const text = q ? plural(list.length, 'matching project', 'matching projects') : plural(list.length, 'project', 'projects')
    const t = setTimeout(() => announce(text), 500)
    return () => clearTimeout(t)
  }, [q])
  const open = p => onStub(`${p.name} opens here, read-only.`)
  return (
    <>
      <header className="view-head">
        <h1 className="view-title">Archived</h1>
        <p className="view-desc">Archived projects are read-only. Their test cases and test runs stay as they were.</p>
      </header>
      {state === 'loading' && <LTLoader />}
      {state === 'error' && <LTFlash variant="danger" text="Archived projects failed to load. Try again." />}
      {state === 'empty' && (
        <div className="panel">
          <LTBlankSlate heading="0 archived projects"
            description="An archived project stays readable here, with its test cases and test runs." />
        </div>
      )}
      {state === 'ready' && (
        <section className="all" aria-label="Archived projects">
          <div className="toolbar">
            <LTInputBox value={query} onChange={setQuery} placeholder="Search archived projects"
              ariaLabel="Search archived projects" className="toolbar__search" />
            <ViewToggle view={view} onView={onView} />
          </div>
          {list.length > 0 ? (
            view === 'list' ? (
              <ul className="plist">{list.map(p => <ArchivedRow key={p.id} p={p} onOpen={open} />)}</ul>
            ) : (
              <ul className="pgrid">{list.map(p => <ArchivedCard key={p.id} p={p} onOpen={open} />)}</ul>
            )
          ) : (
            <div className="panel">
              <LTBlankSlate heading="0 matching projects" description="Change or clear the search to see more projects." />
            </div>
          )}
        </section>
      )}
    </>
  )
}
