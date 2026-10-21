// The project crumb in the top bar inside a project (v3 items 2 to 5, 21 Oct
// 2026), after GitHub's "Switch repository" (Rajat's screenshot). Two parts,
// each with its own rest, hover and pressed states: the project's name, a
// link to the project, as every crumb is a link (guidelines/ltbreadcrumbs.md);
// and a caret that opens an anchored LTSelectPanel of every project, with a
// search field. Recently used projects come first, then starred, then the
// rest (Rajat's order), under group headings (guidelines/ltselectpanel.md:
// group options when the list has natural categories). Every project is a
// link, so Cmd or Ctrl + click (or a middle click) opens it in a new browser
// tab and leaves the panel open; a plain click opens it here and closes the
// panel. The current project is marked with a check, as a single selection is.
// Its three states (guidelines/README.md §1): a search that matches nothing
// is the empty one, since the current project is always listed; loading and
// error follow the page's ?state= (ltselectpanel.md: an error placeholder
// when the list fails to load).
import React, { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown } from 'lucide-react'
import { cx, LTInputBox, LTLoader, LTTag, LTTooltip } from './lt.jsx'
import { useAnchoredPlacement } from './overlays.jsx'

export function ProjectCrumb({ project, groups, state = 'ready' }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const caretRef = useRef(null)
  const boxRef = useRef(null)
  const searchRef = useRef(null)
  const listRef = useRef(null)
  const id = useId()
  const pos = useAnchoredPlacement(open, caretRef, boxRef, { side: 'bottom', align: 'start', offset: 4 })

  const close = (refocus = true) => { setOpen(false); if (refocus) caretRef.current?.focus() }
  useEffect(() => { if (open) { setQuery(''); searchRef.current?.focus() } }, [open])
  useEffect(() => { setOpen(false) }, [project.id])
  useEffect(() => {
    if (!open) return
    const onDown = e => {
      if (boxRef.current?.contains(e.target) || caretRef.current?.contains(e.target)) return
      close(false)
    }
    document.addEventListener('pointerdown', onDown, true)
    return () => document.removeEventListener('pointerdown', onDown, true)
  }, [open])

  const q = query.trim().toLowerCase()
  const shown = groups.map(g => ({ ...g, items: g.items.filter(i => !q || i.name.toLowerCase().includes(q)) }))
    .filter(g => g.items.length)
  const links = () => [...(listRef.current?.querySelectorAll('a') ?? [])]
  // Arrows walk the list from the search field and back; Esc closes.
  const onKeyDown = e => {
    const all = links()
    const i = all.indexOf(document.activeElement)
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close() }
    else if (e.key === 'ArrowDown') { e.preventDefault(); all[i < 0 ? 0 : Math.min(all.length - 1, i + 1)]?.focus() }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (i <= 0) searchRef.current?.focus(); else all[i - 1]?.focus() }
    else if (e.key === 'Home' && i >= 0) { e.preventDefault(); all[0]?.focus() }
    else if (e.key === 'End' && i >= 0) { e.preventDefault(); all[all.length - 1]?.focus() }
    // It is portaled to <body>: Tab past either end closes it and hands focus
    // back to the caret, as if the panel sat right after it.
    else if (e.key === 'Tab') {
      const atEnd = !e.shiftKey && document.activeElement === all[all.length - 1]
      const atStart = e.shiftKey && document.activeElement === searchRef.current
      if (atEnd || atStart) { e.preventDefault(); close() }
    }
  }
  const onLinkClick = e => {
    // Cmd, Ctrl or Shift + click opens a new tab or window: the panel stays.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    close(false)
  }

  return (
    <span className={cx('crumb-switch', open && 'is-open')}>
      <a className="crumb-switch__name" href={`#/project/${project.id}`} aria-current="page">{project.name}</a>
      <LTTooltip text="Switch project" direction="bottom">
        <button ref={caretRef} type="button" className="crumb-switch__caret" aria-label="Switch project"
          aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? id : undefined}
          onClick={() => (open ? close(false) : setOpen(true))}>
          <ChevronDown size={16} aria-hidden="true" />
        </button>
      </LTTooltip>
      {open && createPortal(
        <div ref={boxRef} id={id} role="dialog" aria-label="Switch project" className="lt-selpanel lt-selpanel--switch"
          style={{ width: 320, top: pos?.top ?? -9999, left: pos?.left ?? -9999 }} onKeyDown={onKeyDown}
          onBlur={e => { const to = e.relatedTarget; if (to && !boxRef.current?.contains(to) && to !== caretRef.current) close(false) }}>
          <div className="lt-selpanel__head"><p className="lt-selpanel__title">Switch project</p></div>
          <div className="lt-selpanel__search">
            <LTInputBox value={query} onChange={setQuery} placeholder="Search projects" ariaLabel="Search projects"
              forwardRef={searchRef} />
          </div>
          <div ref={listRef} className="lt-selpanel__groups">
            {state === 'loading' ? <LTLoader size="small" />
              : state === 'error' ? <p className="lt-selpanel__empty" role="alert">Project list failed to load. Try again.</p>
              : shown.length ? shown.map(g => (
              <section key={g.id} aria-labelledby={`${id}-${g.id}`} className="lt-selpanel__group">
                <p id={`${id}-${g.id}`} className="lt-selpanel__group-title">{g.heading}</p>
                <ul>
                  {g.items.map(i => {
                    const current = i.id === project.id
                    return (
                      <li key={i.id}>
                        <a href={`#/project/${i.id}`} className={cx('lt-selpanel__link', current && 'is-current')}
                          aria-current={current ? 'page' : undefined} onClick={onLinkClick}>
                          <span className="lt-selpanel__check" aria-hidden="true">{current && <Check size={16} />}</span>
                          <span className="lt-selpanel__label">{i.name}</span>
                          {i.archived && <LTTag text="Archived" variant="secondary" />}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </section>
            )) : <p className="lt-selpanel__empty" role="status">0 matches for "{query.trim()}"</p>}
          </div>
        </div>, document.body)}
    </span>
  )
}
