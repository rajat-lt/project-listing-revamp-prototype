// Reordering the page's tabs (v3 items 10 and 11, 21 Oct 2026): each user
// arranges For You, Your Projects and Archived as they like, and the order is
// kept for them. Carried over from the automation details prototype's tab
// reordering (its v2 item 1), so both prototypes move tabs the same way.
// Nothing in the library supports drag and drop, and drag alone is not
// keyboard accessible (guidelines/README.md §10), so every move a drag makes
// is also in the tab's own menu: right-click, Shift + F10 or the menu key
// opens Move left, Move right and Reset tab order. That is the answer
// design-context already gives for reordering (patterns/module-details.md,
// open question 3: "move up / move down in the step's own menu").
import React, { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import { announce, cx } from './lt.jsx'
import { LTActionMenu, LTUnderlineNav } from './overlays.jsx'

const GAP = 8 // the nav's gap between tabs: var(--space-2)
const moved = (order, from, to) => { const o = [...order]; o.splice(to, 0, o.splice(from, 1)[0]); return o }

/**
 * Drag to reorder, plus the tab's own menu. Each tab is an element with
 * data-tab; `tabSel(id)` finds the focusable part of a tab, which keeps
 * keyboard focus wherever the tab lands.
 */
function useReorder({ order, setOrder, label, tabSel }) {
  const wrapRef = useRef(null)
  const drag = useRef(null)
  const suppressClick = useRef(false)
  const refocus = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [menu, setMenu] = useState(null) // { id, x, y }

  const commit = (from, to, id) => {
    if (from === to) return
    setOrder(moved(order, from, to))
    refocus.current = id
    announce(`${label(id)} moved to position ${to + 1} of ${order.length}`)
  }
  // A moved tab keeps keyboard focus wherever it lands.
  useEffect(() => {
    const id = refocus.current
    if (!id) return
    refocus.current = null
    if (wrapRef.current?.contains(document.activeElement) || document.activeElement === document.body) {
      wrapRef.current?.querySelector(tabSel(id))?.focus()
    }
  }, [order])

  const clear = () => {
    drag.current?.lis.forEach(li => { li.style.transform = ''; li.classList.remove('is-dragged') })
    drag.current = null
    setDragging(false)
  }
  const onPointerDown = e => {
    if (e.button !== 0 || e.pointerType === 'touch') return
    const li = e.target.closest('[data-tab]')
    if (!li) return
    const lis = [...wrapRef.current.querySelectorAll('[data-tab]')]
    drag.current = { id: li.dataset.tab, x0: e.clientX, started: false, lis, rects: lis.map(l => l.getBoundingClientRect()),
      from: lis.indexOf(li), to: lis.indexOf(li), pointerId: e.pointerId }
  }
  const onPointerMove = e => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x0
    if (!d.started) {
      if (Math.abs(dx) < 4) return
      d.started = true
      setDragging(true)
      try { wrapRef.current.setPointerCapture(d.pointerId) } catch { /* pointer already gone */ }
      d.lis[d.from].classList.add('is-dragged')
    }
    const r = d.rects[d.from]
    const centre = r.left + r.width / 2 + dx
    // The drop slot is how many other tabs sit left of the dragged one's centre.
    d.to = d.rects.filter((rr, i) => i !== d.from && rr.left + rr.width / 2 < centre).length
    const shift = r.width + GAP
    d.lis.forEach((li, i) => {
      if (i === d.from) li.style.transform = `translateX(${dx}px)`
      else if (d.from < d.to && i > d.from && i <= d.to) li.style.transform = `translateX(${-shift}px)`
      else if (d.to < d.from && i >= d.to && i < d.from) li.style.transform = `translateX(${shift}px)`
      else li.style.transform = ''
    })
  }
  // The click that ends a drag must not open the tab. It fires right after
  // pointerup, so the flag only lives until the next task.
  const swallowNextClick = () => {
    suppressClick.current = true
    setTimeout(() => { suppressClick.current = false }, 0)
  }
  const onPointerUp = () => {
    const d = drag.current
    if (!d) return
    if (d.started) {
      swallowNextClick()
      commit(d.from, d.to, d.id)
    }
    clear()
  }
  useEffect(() => {
    if (!dragging) return
    // Esc puts the tabs back; the click that ends the held press opens nothing.
    const onKey = e => {
      if (e.key !== 'Escape') return
      e.preventDefault()
      document.addEventListener('pointerup', swallowNextClick, { once: true, capture: true })
      clear()
      announce('Tab move canceled')
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [dragging])

  const openMenu = (id, x, y) => setMenu({ id, x, y })
  const onKeyDown = e => {
    if ((e.key === 'F10' && e.shiftKey) || e.key === 'ContextMenu') {
      e.preventDefault()
      const li = e.currentTarget.closest('[data-tab]')
      const r = li.getBoundingClientRect()
      openMenu(li.dataset.tab, r.left, r.bottom)
    }
  }
  const moveBy = (id, step) => {
    const from = order.indexOf(id)
    const to = Math.min(order.length - 1, Math.max(0, from + step))
    commit(from, to, id)
  }
  const closeMenu = () => {
    const id = menu.id
    setMenu(null)
    wrapRef.current?.querySelector(tabSel(id))?.focus()
  }
  // Unavailable moves stay in the menu, inactive, saying why
  // (guidelines/ltactionmenu.md).
  const moveOptions = id => {
    const i = order.indexOf(id)
    return [
      { value: 'left', label: 'Move left', icon: ArrowLeft, inactive: i === 0, description: i === 0 ? 'Already the first tab' : undefined },
      { value: 'right', label: 'Move right', icon: ArrowRight, inactive: i === order.length - 1,
        description: i === order.length - 1 ? 'Already the last tab' : undefined },
    ]
  }
  const wrapProps = {
    ref: wrapRef, onPointerDown, onPointerMove, onPointerUp, onPointerCancel: clear,
    onClickCapture: e => { if (suppressClick.current) { suppressClick.current = false; e.preventDefault(); e.stopPropagation() } },
    onContextMenu: e => {
      const li = e.target.closest('[data-tab]')
      if (!li) return
      e.preventDefault()
      openMenu(li.dataset.tab, e.clientX, e.clientY)
    },
  }
  return { wrapProps, dragging, menu, closeMenu, onKeyDown, moveBy, moveOptions, refocus }
}

/** The page's tabs, in the user's order, with drag and the tab menu. */
export function ReorderTabs({ order, setOrder, defaultOrder, navs, current, ariaLabel }) {
  const label = id => navs.find(n => n.id === id)?.label ?? id
  const isDefault = order.join() === defaultOrder.join()
  const { wrapProps, dragging, menu, closeMenu, onKeyDown, moveBy, moveOptions, refocus } = useReorder({
    order, setOrder, label, tabSel: id => `li[data-tab="${id}"] a`,
  })
  const byId = Object.fromEntries(navs.map(n => [n.id, n]))

  return (
    <div {...wrapProps} className={cx('tabbar', dragging && 'is-dragging')}>
      <LTUnderlineNav ariaLabel={ariaLabel} current={current} navs={order.map(id => byId[id])} onKeyDown={onKeyDown} />
      {menu && (
        <LTActionMenu open align="start" width={232} ariaLabel={`Move ${label(menu.id)}`}
          onMenuToggle={o => { if (!o) closeMenu() }}
          customAnchor={<span className="ctx-anchor" style={{ left: menu.x, top: menu.y }} />}
          onSelect={o => {
            if (o.value === 'left') moveBy(menu.id, -1)
            if (o.value === 'right') moveBy(menu.id, 1)
            if (o.value === 'reset') { setOrder(defaultOrder); refocus.current = menu.id; announce('Tabs back in the default order') }
          }}
          options={[
            ...moveOptions(menu.id),
            { divider: true },
            { value: 'reset', label: 'Reset tab order', icon: RotateCcw, inactive: isDefault,
              description: isDefault ? 'Already in the default order' : undefined },
          ]} />
      )}
    </div>
  )
}
