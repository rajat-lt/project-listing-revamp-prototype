// Your Projects (brief 4 to 11) and Archived (brief 12), with the changes of
// 21 Oct 2026 (v2 items 4 to 7, v3 items 7 to 9). Spec §3.4, §3.5 and §4.
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Star, Flag, ListTodo, List, LayoutGrid } from 'lucide-react'
import {
  cx, announce, LTLink, LTTag, LTLabelGroup, LTMetaData, MetaLine, LTButton, LTIconButton, LTInlineMessage, LTProgressBar,
  LTTestStatusLabel, StatusGlyph, LTInputBox, LTBlankSlate, LTLoader, LTFlash, LTAvatar, LTPagination, PersonHint, TimeHint,
  TestCaseIcon, TestRunIcon,
} from './lt.jsx'
import { LTSegmentedControl, LTSelectPanel, LTPopover, LTAnchoredOverlay } from './overlays.jsx'
import { PROJECTS, ARCHIVED, NOW, isInactive, nextMilestoneOf } from './data.js'
import { fmtDate, fmtCount, fmtDuration, initials } from './format.js'

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

/* Tags in an LTLabelGroup: three at most, then a "+{n}" that opens the whole
   group in an anchored overlay (v3 item 9), as Primer's LabelGroup does with
   overflowStyle="overlay": its button shows "+11" and is named "Show +11
   more" (primer.style, read 21 Oct 2026). Every tag stays reachable
   (guidelines/ltlabelgroup.md). "+1" is a button: it opens something in
   place (guidelines/README.md §5). Spec C22. */
const MAX_TAGS = 3
function ProjectTags({ tags, name }) {
  if (!tags.length) return null
  const hidden = tags.length - MAX_TAGS
  const group = list => <LTLabelGroup>{list.map(t => <LTTag key={t} text={t} variant="blueAccent" />)}</LTLabelGroup>
  return (
    <div className="tags">
      {group(tags.slice(0, MAX_TAGS))}
      {hidden > 0 && (
        <LTAnchoredOverlay ariaLabel={`Tags of ${name}`} overlayClassName="tags-overlay"
          anchor={<button type="button" className="tags__more" aria-label={`Show +${hidden} more ${hidden === 1 ? 'tag' : 'tags'}`}>+{hidden}</button>}>
          {group(tags)}
        </LTAnchoredOverlay>
      )}
    </div>
  )
}

/* Brief 4: "total TC count (automated TC percentage)" and the test run count.
   v3 item 8: the product's own two icons stand for the words, which leave the
   line; screen readers still hear them (spec C18). */
const testCasesText = p => (p.testCases ? `${fmtCount(p.testCases)} (${p.automatedPct}% automated)` : '0')
const TestCaseCount = ({ p, withShare = true, lead = false }) => (
  <LTMetaData leadingIcon={TestCaseIcon} showLeadingDot={!lead} label="Test cases"
    value={withShare ? testCasesText(p) : fmtCount(p.testCases)} />
)
const TestRunCount = ({ n }) => <LTMetaData leadingIcon={TestRunIcon} label="Test runs" value={fmtCount(n)} />

/* v2 item 6: the name shows its email and the relative date its full date
   and time, on hover and focus (PersonHint, TimeHint; spec C13, C14). */
const CreatedBy = ({ name, lead = false }) => (
  <LTMetaData showLeadingDot={!lead}>Created by <PersonHint name={name} /></LTMetaData>
)
const Updated = ({ date }) => <LTMetaData>Updated <TimeHint date={date} now={NOW} /></LTMetaData>

/* Brief 6. The name says what pressing it will do; screen readers also hear
   the result (ux-text-guidelines.md §3, silent success still speaks). The
   shape, outline or filled, carries the state, never the colour alone. */
function StarToggle({ p, starred, onStar }) {
  return (
    <LTIconButton icon={Star} variant="invisible" size="small" className={cx('star', starred && 'is-starred')}
      ariaLabel={`${starred ? 'Unstar' : 'Star'} ${p.name}`} onClick={() => onStar(p)} />
  )
}

/* Brief 8 and the milestone of brief 4: what needs you in this project. Your
   next milestone is the soonest one you own or created (Rajat, 21 Oct 2026).
   Each count links to the project's test instance list, filtered; a zero
   count is omitted, and with both at zero the line is gone. */
function NeedsYou({ p, onStub, stacked = false }) {
  const milestone = nextMilestoneOf(p.id)
  const ti = [
    p.unassigned > 0 && { key: 'u', label: `${fmtCount(p.unassigned)} unassigned`,
      toast: `The ${plural(p.unassigned, 'unassigned test instance', 'unassigned test instances')} in ${p.name} open here.` },
    p.needConfig > 0 && { key: 'c', label: `${fmtCount(p.needConfig)} ${p.needConfig === 1 ? 'needs' : 'need'} a configuration`,
      toast: `The ${plural(p.needConfig, 'test instance', 'test instances')} in ${p.name} that need a configuration open here.` },
  ].filter(Boolean)
  if (!milestone && !ti.length && !p.actions.length) return null
  return (
    <div className={cx('needs', stacked && 'needs--stacked')}>
      {milestone && (
        <p className="need">
          <Flag size={16} aria-hidden="true" className="need__icon" />
          <span>Your next milestone: {milestone.name} · {fmtDate(milestone.due)}</span>
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

/* Each action: status icon, title, progress as counts processed with the time
   left (reliable, Rajat 21 Oct 2026; project-actions-listing.md §3.4 grammar),
   and how long it has run or waited (ux-text-guidelines.md §7). The bar
   repeats the visible percentage, so it is decoration to screen readers
   (guidelines/ltprogressbar.md). */
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
                  <p className="act__progress">
                    {fmtCount(a.done)}/{fmtCount(a.total)} {a.unit} · {a.pct}% · {a.left ? `~${a.left} left` : 'Estimating time left…'}
                  </p>
                  <LTProgressBar size="small" className="act__bar"
                    segments={[{ id: a.id, progress: a.pct, style: { backgroundColor: 'var(--accent-emphasis)' } }]} />
                </>
              )}
              <p className="act__meta">
                {a.status === 'running' ? 'Running' : 'Queued'} · {fmtDuration(a.elapsed)} · Started by <PersonHint name={a.by} />
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

/* Brief 10: more than 90 days without any action by anyone (Rajat, 21 Oct
   2026). Info, not warning: a fact with no decision attached (spec C4). Its
   date is the last action, which can be later than "Updated". */
function Inactive({ p }) {
  if (!isInactive(p)) return null
  return <LTInlineMessage variant="info" size="medium" className="inactive">Inactive since {fmtDate(p.lastActionAt)}.</LTInlineMessage>
}

/* ---------- the list row and the grid card ----------
   v2 item 5: hovering anywhere on a row or card underlines its title, and a
   click anywhere on it opens the project, through the title link. The
   controls inside it (tags, counts, the actions popover, Create Test Run,
   the star, and the name and date hints) sit above that and work as before. */

const projectHref = p => `#/project/${p.id}`

function ProjectRow({ p, runs, starred, onStar, onCreateRun, onStub }) {
  return (
    <li className="prow clickrow" data-pid={p.id}>
      <div className="prow__main">
        <div className="prow__head">
          <h3 className="prow__title"><LTLink label={p.name} href={projectHref(p)} className="clickrow__link" /></h3>
          <ProjectTags tags={p.tags} name={p.name} />
        </div>
        <MetaLine>
          <TestCaseCount p={p} lead />
          <TestRunCount n={runs} />
          <CreatedBy name={p.createdBy} />
          <Updated date={p.updatedAt} />
        </MetaLine>
        <NeedsYou p={p} onStub={onStub} />
        <Inactive p={p} />
      </div>
      <div className="prow__actions">
        <LTButton variant="outline" size="small" label="Create Test Run" onClick={() => onCreateRun(p)} />
        <StarToggle p={p} starred={starred} onStar={onStar} />
      </div>
    </li>
  )
}

/* The grid card carries the row's facts, rearranged (spec §3.4). No card
   component exists among the 69, so it is composed, as SmartUI's are. */
function ProjectCard({ p, runs, starred, onStar, onCreateRun, onStub }) {
  return (
    <li className="pcard clickrow" data-pid={p.id}>
      <div className="pcard__head">
        <h3 className="pcard__title"><LTLink label={p.name} href={projectHref(p)} className="clickrow__link" /></h3>
        <StarToggle p={p} starred={starred} onStar={onStar} />
      </div>
      <ProjectTags tags={p.tags} name={p.name} />
      <MetaLine>
        <TestCaseCount p={p} withShare={false} lead />
        <TestRunCount n={runs} />
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
          <CreatedBy name={p.createdBy} lead />
          <Updated date={p.updatedAt} />
        </MetaLine>
        <LTButton variant="outline" size="small" label="Create Test Run" onClick={() => onCreateRun(p)} />
      </div>
    </li>
  )
}

/* ---------- Your Projects ---------- */

const RECENT_MAX = 4
const byName = (a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })
const byUpdated = (a, b) => b.updatedAt - a.updatedAt

export function YourProjects({ state, view, onView, starred, onStar, visits, runsAdded, showAll, page, onCreateRun, onStub }) {
  const projects = state === 'empty' ? [] : PROJECTS
  const [query, setQuery] = useState('')
  const [createdBy, setCreatedBy] = useState([])
  const [tags, setTags] = useState([])
  const filtering = Boolean(query.trim() || createdBy.length || tags.length)
  const listRef = useRef(null)

  /* v2 item 7, progressive disclosure: the tab opens on your projects, the
     starred ones first (answer 7), then the ones you used most recently (up
     to 4, brief 5). Show All (v3 item 7) is a link to the whole list,
     #/projects/all, where the rest follow, most recently updated first, so
     nothing already on screen moves. There it is gone, and there is no Show
     Less: the whole list paginates, 20 a page, which a collapse would fight.
     The order is set when the tab opens, so a star or a visit never moves a
     row under the pointer. */
  const starredRef = useRef(starred)
  starredRef.current = starred
  const visitsRef = useRef(visits)
  visitsRef.current = visits
  const order = useMemo(() => {
    const s = starredRef.current, v = visitsRef.current
    const recent = projects.filter(p => v[p.id]?.at).sort((a, b) => v[b.id].at - v[a.id].at).slice(0, RECENT_MAX)
    const yours = [...projects.filter(p => s.has(p.id)).sort(byUpdated), ...recent.filter(p => !s.has(p.id))]
    return { yours, rest: projects.filter(p => !yours.includes(p)).sort(byUpdated) }
  }, [projects])

  // A search or a filter looks through every project, in the same order.
  const q = query.trim().toLowerCase()
  const everything = [...order.yours, ...order.rest]
  const matched = filtering
    ? everything
      .filter(p => !q || p.name.toLowerCase().includes(q))
      .filter(p => !createdBy.length || createdBy.includes(p.createdBy))
      .filter(p => !tags.length || p.tags.some(t => tags.includes(t)))
    : showAll || !order.yours.length ? everything : order.yours
  const canShowAll = !filtering && !showAll && order.yours.length > 0 && order.rest.length > 0
  // The whole list (and any search or filter result) pages at 20
  // (guidelines/ltpagination.md); nothing renders while it fits one page.
  const PAGE_SIZE = 20
  const paged = filtering || showAll
  const pageCount = paged ? Math.max(1, Math.ceil(matched.length / PAGE_SIZE)) : 1
  const cur = Math.min(Math.max(1, page), pageCount)
  const list = paged ? matched.slice((cur - 1) * PAGE_SIZE, cur * PAGE_SIZE) : matched

  // The result count, for screen readers, once typing pauses.
  const first = useRef(true)
  const filterKey = `${q}|${createdBy.join()}|${tags.join()}`
  useEffect(() => {
    if (first.current) { first.current = false; return }
    const text = filtering ? plural(list.length, 'matching project', 'matching projects') : plural(list.length, 'project', 'projects')
    const t = setTimeout(() => announce(text), 500)
    return () => clearTimeout(t)
  }, [filterKey])

  // Show All moves focus to the first project it revealed, and says how
  // many projects the list now holds.
  const firstShow = useRef(true)
  useEffect(() => {
    if (firstShow.current) { firstShow.current = false; return }
    if (!showAll) return
    listRef.current?.querySelector(`[data-pid="${order.rest[0]?.id}"] .clickrow__link`)?.focus()
    announce(plural(everything.length, 'project', 'projects'))
  }, [showAll])

  const creators = [...new Set(projects.map(p => p.createdBy))].sort(byName)
    .map(n => ({ value: n, label: n, leadingVisual: <LTAvatar initials={initials(n)} name={n} size={20} decorative /> }))
  const allTags = [...new Set(projects.flatMap(p => p.tags))].sort(byName).map(t => ({ value: t, label: t }))
  const createProject = () => onStub('The project form opens here.')
  const item = p => ({ p, runs: p.testRuns + (runsAdded[p.id] ?? 0), starred: starred.has(p.id), onStar, onCreateRun, onStub })

  return (
    <div className="column">
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
        <section aria-label="Projects">
          <div className="toolbar">
            <LTInputBox value={query} onChange={setQuery} placeholder="Search projects" ariaLabel="Search projects"
              className="toolbar__search" />
            <LTSelectPanel title="Created by" buttonLabel="Created by" searchPlaceholder="Filter people" showCountOnCta
              options={creators} defaultValues={createdBy} onApply={setCreatedBy} />
            <LTSelectPanel title="Tags" buttonLabel="Tags" searchPlaceholder="Filter tags" showCountOnCta
              options={allTags} defaultValues={tags} onApply={setTags} />
            <ViewToggle view={view} onView={onView} />
            <LTButton variant="primary" size="medium" label="Create Project" onClick={createProject} />
          </div>
          {list.length > 0 ? (
            <div ref={listRef}>
              {view === 'list'
                ? <ul className="plist">{list.map(p => <ProjectRow key={p.id} {...item(p)} />)}</ul>
                : <ul className="pgrid">{list.map(p => <ProjectCard key={p.id} {...item(p)} />)}</ul>}
              {/* v3 item 7: a link to the whole list (spec C16). A standalone
                  action link is a CTA, so Title Case (ux-text-guidelines.md §2). */}
              {canShowAll && <p className="showall"><LTLink href="#/projects/all" label="Show All" /></p>}
              {paged && <LTPagination currentPage={cur} pageCount={pageCount}
                hrefFor={n => (n === 1 ? '#/projects/all' : `#/projects/all/page/${n}`)} />}
            </div>
          ) : (
            <div className="panel">
              <LTBlankSlate heading="0 matching projects" description="Change or clear the filters to see more projects." />
            </div>
          )}
        </section>
      )}
    </div>
  )
}

/* ---------- Archived ---------- */

/* Brief 12: read-only. No star, no Create Test Run, no milestone, no test
   instance counts and no actions: nothing in an archived project changes.
   It leads with the archived status icon (mock-data.md, type=Archive). */
function ArchivedBy({ p, lead = false }) {
  return (
    <LTMetaData showLeadingDot={!lead}>
      Archived <TimeHint date={p.archivedAt} now={NOW} /> by <PersonHint name={p.archivedBy} />
    </LTMetaData>
  )
}

function ArchivedRow({ p }) {
  return (
    <li className="prow prow--archived clickrow">
      <LTTestStatusLabel status="archived" showStatusText={false} className="prow__status" />
      <div className="prow__main">
        <div className="prow__head">
          <h3 className="prow__title"><LTLink label={p.name} href={projectHref(p)} className="clickrow__link" /></h3>
          <LTTag text="Read-only" variant="secondary" />
          <ProjectTags tags={p.tags} name={p.name} />
        </div>
        <MetaLine>
          <TestCaseCount p={p} lead />
          <TestRunCount n={p.testRuns} />
          <CreatedBy name={p.createdBy} />
        </MetaLine>
        <MetaLine><ArchivedBy p={p} lead /></MetaLine>
      </div>
    </li>
  )
}

function ArchivedCard({ p }) {
  return (
    <li className="pcard pcard--archived clickrow">
      <div className="pcard__head">
        <LTTestStatusLabel status="archived" showStatusText={false} className="pcard__status" />
        <h3 className="pcard__title"><LTLink label={p.name} href={projectHref(p)} className="clickrow__link" /></h3>
        <LTTag text="Read-only" variant="secondary" />
      </div>
      <ProjectTags tags={p.tags} name={p.name} />
      <MetaLine>
        <TestCaseCount p={p} withShare={false} lead />
        <TestRunCount n={p.testRuns} />
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
          <CreatedBy name={p.createdBy} lead />
          <ArchivedBy p={p} />
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
  return (
    <div className="column">
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
        <section aria-label="Archived projects">
          <div className="toolbar">
            <LTInputBox value={query} onChange={setQuery} placeholder="Search archived projects"
              ariaLabel="Search archived projects" className="toolbar__search" />
            <ViewToggle view={view} onView={onView} />
          </div>
          {list.length > 0 ? (
            view === 'list' ? (
              <ul className="plist">{list.map(p => <ArchivedRow key={p.id} p={p} />)}</ul>
            ) : (
              <ul className="pgrid">{list.map(p => <ArchivedCard key={p.id} p={p} />)}</ul>
            )
          ) : (
            <div className="panel">
              <LTBlankSlate heading="0 matching projects" description="Change or clear the search to see more projects." />
            </div>
          )}
        </section>
      )}
    </div>
  )
}
