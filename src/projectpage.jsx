// The test case listing inside a project (v3 item 1, 21 Oct 2026): the one
// page this prototype builds inside a project; every other destination there
// answers with a toast. Built from patterns/test-entity-listing.md: the
// folder pane and list (§3.2), the filter bar (§3.3), the row (§3.4), the
// Test Cases header (§3.5), the states (§4), and pagination at 20 a page
// (delta 1, guidelines/ltpagination.md). An archived project opens the same
// page, read-only.
import React, { useEffect, useRef, useState } from 'react'
import {
  LTTestStatusLabel, LTMetaData, MetaLine, LTButton, LTInputBox, LTBlankSlate, LTLoader, LTFlash, LTTag, LTLabelGroup,
  LTCheckbox, LTPagination, TruncText, PersonHint, TimeHint, announce,
} from './lt.jsx'
import { LTNavList, LTSelectPanel } from './overlays.jsx'
import { testCasesOf, FOLDERS, NOW } from './data.js'
import { fmtCount } from './format.js'

const PAGE_SIZE = 20 // guidelines/ltpagination.md: the default for every list
const plural = (n, one, many) => `${fmtCount(n)} ${n === 1 ? one : many}`
const stop = fn => e => { e.preventDefault(); fn() }

export function ProjectPage({ state, project, readOnly, folder, page, onStub }) {
  // The demo states: loading and error know no test cases yet; empty has none.
  const loaded = state === 'ready' || state === 'empty'
  const all = state === 'ready' ? testCasesOf(project) : []
  const [query, setQuery] = useState('')
  const [tags, setTags] = useState([])
  const [picked, setPicked] = useState(() => new Set())
  const listRef = useRef(null)
  const firstPage = useRef(true)

  const current = FOLDERS.find(f => f.id === folder) ?? null
  const inFolder = current ? all.filter(t => t.folder === current.id) : all
  const q = query.trim().toLowerCase()
  const list = inFolder
    .filter(t => !q || t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q))
    .filter(t => !tags.length || t.tags.some(x => tags.includes(x)))
  const pageCount = Math.max(1, Math.ceil(list.length / PAGE_SIZE))
  const cur = Math.min(Math.max(1, page), pageCount)
  const rows = list.slice((cur - 1) * PAGE_SIZE, cur * PAGE_SIZE)
  const base = `#/project/${project.id}${current ? `/folder/${current.id}` : ''}`
  const hrefFor = n => (n === 1 ? base : `${base}/page/${n}`)

  // A new search or filter starts again at page 1, and says how many match.
  const filterKey = `${q}|${tags.join()}`
  const firstFilter = useRef(true)
  useEffect(() => {
    if (firstFilter.current) { firstFilter.current = false; return }
    if (page !== 1) window.location.hash = base
    const t = setTimeout(() => announce(plural(list.length, 'matching test case', 'matching test cases')), 500)
    return () => clearTimeout(t)
  }, [filterKey])
  // Paging moves focus to the start of the new content (ltpagination.md).
  useEffect(() => {
    if (firstPage.current) { firstPage.current = false; return }
    listRef.current?.focus()
  }, [cur])

  // Counts show once the list has loaded.
  const count = n => (loaded ? fmtCount(n) : undefined)
  const folderItems = [
    { id: 'all', label: 'All Test Cases', counter: count(all.length), href: `#/project/${project.id}` },
    ...FOLDERS.map(f => ({ id: f.id, label: f.name, counter: count(all.filter(t => t.folder === f.id).length),
      href: `#/project/${project.id}/folder/${f.id}` })),
  ]
  const allTags = [...new Set(all.flatMap(t => t.tags))].sort().map(t => ({ value: t, label: t }))
  const addTestCase = () => onStub(`The test case form for ${project.name} opens here.`)
  const onPage = rows.map(t => t.id)
  const pickedHere = onPage.filter(id => picked.has(id)).length
  const toggle = (id, on) => setPicked(s => { const n = new Set(s); if (on) n.add(id); else n.delete(id); return n })
  const toggleAll = on => setPicked(s => { const n = new Set(s); onPage.forEach(id => (on ? n.add(id) : n.delete(id))); return n })

  // What fills the list's place when it has no rows (§4).
  const noRows = () => {
    if (state === 'loading') return <LTLoader />
    if (state === 'error') return <LTFlash variant="danger" text="Test case list failed to load. Try again." />
    if (all.length > 0) {
      return (
        <div className="panel">
          <LTBlankSlate heading="0 matching test cases" description="Change or clear the filters to see more test cases." />
        </div>
      )
    }
    return (
      <div className="panel">
        {readOnly
          ? <LTBlankSlate heading="0 test cases" description="This project was archived with 0 test cases." />
          : <LTBlankSlate heading="Start with your first test case" description="Test cases appear here once you create one."
              primaryAction={<LTButton variant="primary" size="medium" label="Add Test Case" onClick={addTestCase} />} />}
      </div>
    )
  }

  return (
    <div className="fy">
      {/* The folder pane, 320px (test-entity-listing.md §6). */}
      <div className="fy-pane">
        <p className="fy-pane__title">Folders</p>
        <LTNavList ariaLabel="Folders" selectedTab={current?.id ?? 'all'} listItems={folderItems} />
      </div>

      <div className="fy-main">
        {/* Test Cases: no page header, straight to the content head (§3.5).
            The folder pane, this head and the filter bar stay in place in
            every state; only the list's place changes (§4). */}
        <header className="pp-head">
          <h1 className="view-title">{current ? current.name : 'All Test Cases'}</h1>
          {readOnly
            ? <LTTag text="Read-only" variant="secondary" />
            : <LTButton variant="primary" size="medium" label="Add Test Case" className="pp-head__action" onClick={addTestCase} />}
        </header>

        {/* The filter bar (§3.3): select-all, search, then the filters. */}
        <div className="toolbar">
          {!readOnly && (
            <LTCheckbox ariaLabel="Select all test cases on this page" checked={rows.length > 0 && pickedHere === rows.length}
              indeterminate={pickedHere > 0 && pickedHere < rows.length} onChange={toggleAll} />
          )}
          {!readOnly && picked.size > 0 && (
            <span className="pp-picked" role="status">{plural(picked.size, 'test case', 'test cases')} selected</span>
          )}
          <LTInputBox value={query} onChange={setQuery} placeholder="Search by test case ID or title"
            ariaLabel="Search by test case ID or title" className="toolbar__search" />
          <LTSelectPanel title="Tags" buttonLabel="Tags" searchPlaceholder="Filter tags" showCountOnCta
            emptyText="0 tags in this project" options={allTags} defaultValues={tags} onApply={setTags} />
        </div>

        {rows.length > 0 ? (
          <>
            <ul ref={listRef} tabIndex={-1} className="rows pp-list"
              aria-label={`Test cases, page ${cur} of ${pageCount}`}>
              {rows.map(t => (
                <li key={t.id} className={`tc-row clickrow${picked.has(t.id) ? ' is-picked' : ''}`}>
                  {!readOnly && (
                    <span className="tc-row__pick">
                      <LTCheckbox ariaLabel={`Select ${t.id}`} checked={picked.has(t.id)} onChange={on => toggle(t.id, on)} />
                    </span>
                  )}
                  <LTTestStatusLabel status={t.status} showStatusText={false} className="ti-row__status" />
                  <div className="tc-row__main">
                    <div className="tc-row__head">
                      <TruncText as="a" href="#tc" className="lt-link tc-row__title clickrow__link" text={t.title}
                        onClick={stop(() => onStub(`Test case ${t.id} opens here.`))} />
                      {t.tags.length > 0 && (
                        <LTLabelGroup>{t.tags.map(x => <LTTag key={x} text={x} variant="blueAccent" />)}</LTLabelGroup>
                      )}
                    </div>
                    <MetaLine className="tc-row__meta">
                      <LTMetaData value={t.id} showLeadingDot={false} label="Test case ID" />
                      <LTMetaData>Updated <TimeHint date={t.updatedAt} now={NOW} /> by <PersonHint name={t.by} /></LTMetaData>
                    </MetaLine>
                  </div>
                </li>
              ))}
            </ul>
            <LTPagination currentPage={cur} pageCount={pageCount} hrefFor={hrefFor} />
          </>
        ) : noRows()}
      </div>
    </div>
  )
}
