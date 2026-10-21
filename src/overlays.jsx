// Tabs, the nav list, the segmented control, the select panel, the popover,
// the drawer, the token input and toasts. Same rules as lt.jsx: real component
// names, documented props, token styling, and the matching guidelines/ file
// for behaviour.
import React, {
  createContext, useCallback, useContext, useEffect, useId, useImperativeHandle, useLayoutEffect, useRef, useState,
} from 'react'
import { createPortal } from 'react-dom'
import { X, CircleCheck, CircleAlert, Info, ChevronDown, Check } from 'lucide-react'
import { cx, placeFloating, LTTooltip, LTIconButton, LTButton, LTInputBox, LTToken, TruncText, usePortalRoot } from './lt.jsx'

/* ---------- LTUnderlineNav ----------
   The page's main tabs: one per page, each tab its own URL, aligned left and
   no wider than the content it controls (guidelines/ltunderlinenav.md). The
   counter counts the rows in the tab (ux-text-guidelines.md §7). Documented
   props: navs (shape TBD → ltunderlinenav--with-counters), ariaLabel, size,
   onClick. `current` marks the tab whose view is showing. */
export function LTUnderlineNav({ navs, current, ariaLabel, size = 'medium', onClick }) {
  return (
    <div className={cx('lt-unav', `lt-unav--${size}`)}>
      <nav aria-label={ariaLabel}>
        <ul>
          {navs.map(t => (
            <li key={t.id}>
              <a href={t.href} aria-current={t.id === current ? 'page' : undefined}
                className={cx('lt-unav__item', t.id === current && 'is-current')}
                onClick={e => onClick?.(e, t)}>
                <span className="lt-unav__label" data-text={t.label}>{t.label}</span>
                {t.counter != null && <span className="lt-counter lt-counter--secondary">{t.counter}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

/* ---------- LTTabNav ----------
   The second tab layer. It always sits below the page's LTUnderlineNav
   (guidelines/ltunderlinenav.md); here it switches the For You panel between
   Test Instances and Milestones. Boxed tabs on a hairline, the current one
   raised white, as in the notification-center prototype. Documented props:
   items (shape TBD → lttabnav--tab-nav), activeTab, ariaLabel, size,
   onSelect. Each tab has its own URL. */
export function LTTabNav({ items, activeTab, ariaLabel, size = 'medium', onSelect }) {
  return (
    <nav className={cx('lt-tabnav', `lt-tabnav--${size}`)} aria-label={ariaLabel}>
      <ul>
        {items.map(t => (
          <li key={t.id}>
            <a href={t.href} aria-current={t.id === activeTab ? 'page' : undefined}
              className={cx('lt-tabnav__item', t.id === activeTab && 'is-current')}
              onClick={e => onSelect?.(e, t)}>
              <span className="lt-unav__label" data-text={t.label}>{t.label}</span>
              {t.counter != null && <span className="lt-counter lt-counter--secondary">{t.counter}</span>}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/* ---------- LTNavList ----------
   The left pane's list, as the folder pane of the test case and test run
   listings (test-entity-listing.md §3.2). Each item is a link with its own
   URL. The selected one carries the orange bar and the grey fill; a grey
   fill alone is hover (guidelines/README.md §1). Documented props:
   ariaLabel, listItems (shape TBD → ltnavlist--nav-list; { id, label, meta,
   href } here), selectedTab, handleSelectedTab, showTruncatedName. */
export function LTNavList({ ariaLabel, listItems, selectedTab, handleSelectedTab, showTruncatedName = true }) {
  return (
    <nav aria-label={ariaLabel} className="lt-navlist">
      <ul>
        {listItems.map(i => (
          <li key={i.id}>
            <a href={i.href} aria-current={i.id === selectedTab ? 'page' : undefined}
              className={cx('lt-navlist__item', i.id === selectedTab && 'is-selected')}
              onClick={e => handleSelectedTab?.(e, i)}>
              {showTruncatedName
                ? <TruncText text={i.label} className="lt-navlist__label" />
                : <span className="lt-navlist__label">{i.label}</span>}
              {i.meta && <span className="lt-navlist__meta">{i.meta}</span>}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/* ---------- LTSegmentedControl ----------
   Applied at once, no Save. Icon-only segments always carry a tooltip and a
   label (guidelines/ltsegmentedcontrol.md). `role="radiogroup"` only with a
   design decision behind it; for list and grid that decision is recorded in
   patterns/smartui-build-screenshots.md §5 (spec C8). As a radiogroup it
   follows the radio pattern: one tab stop, arrows move and select. */
export function LTSegmentedControl({ options, selectedValue, onChange, ariaLabel, isIconButton = false,
  showTooltip = isIconButton, role, variant = 'medium', className }) {
  const refs = useRef([])
  const radio = role === 'radiogroup'
  const onKeyDown = (e, i) => {
    if (!radio) return
    const n = options.length
    const to = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1 + n, ArrowUp: i - 1 + n, Home: 0, End: n - 1 }[e.key]
    if (to == null) return
    e.preventDefault()
    const k = to % n
    onChange(options[k].value)
    refs.current[k]?.focus()
  }
  return (
    <div role={radio ? 'radiogroup' : 'group'} aria-label={ariaLabel}
      className={cx('lt-seg', `lt-seg--${variant}`, isIconButton && 'lt-seg--icons', className)}>
      {options.map((o, i) => {
        const on = o.value === selectedValue
        const btn = (
          <button key={o.value} ref={el => { refs.current[i] = el }} type="button"
            role={radio ? 'radio' : undefined} aria-checked={radio ? on : undefined}
            aria-pressed={radio ? undefined : on} tabIndex={radio && !on ? -1 : undefined}
            aria-label={isIconButton ? o.label : undefined}
            className={cx('lt-seg__btn', on && 'is-selected')}
            onClick={() => onChange(o.value)} onKeyDown={e => onKeyDown(e, i)}>
            {isIconButton ? <o.icon size={16} aria-hidden="true" /> : o.label}
          </button>
        )
        return isIconButton && showTooltip
          ? <LTTooltip key={o.value} text={o.label} direction="bottom">{btn}</LTTooltip>
          : btn
      })}
    </div>
  )
}

/* Placement beside the anchor, shared by LTSelectPanel and LTPopover. The
   caret points at the anchor's centre, however the box was clamped. */
function useAnchoredPlacement(open, anchorRef, boxRef, { side = 'bottom', align = 'start', offset = 4, flip = true } = {}) {
  const [pos, setPos] = useState(null)
  useLayoutEffect(() => {
    if (!open || !anchorRef.current || !boxRef.current) return
    const update = () => {
      if (!anchorRef.current || !boxRef.current) return
      const p = placeFloating(anchorRef.current, boxRef.current, { side, align, offset, flip })
      const a = anchorRef.current.getBoundingClientRect()
      p.caretX = Math.min(boxRef.current.offsetWidth - 16, Math.max(16, a.left + a.width / 2 - p.left))
      setPos(p)
    }
    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update, true); window.removeEventListener('resize', update) }
  }, [open, side, align])
  return pos
}

/* ---------- LTSelectPanel ----------
   The anchored (nonmodal) variant: selections save automatically, and closing
   the panel (the trigger again, a click outside, or Esc) applies everything
   (guidelines/ltselectpanel.md). Multi-select stays open while the user picks.
   Selected items sit at the top when the panel opens and when the filter is
   cleared, and the list never reorders while the user selects.
   Documented props: title, subtitle, buttonLabel, label, ariaLabel, options
   (shape TBD → ltselectpanel--select-panel; { value, label, leadingVisual }
   here), defaultValues, onApply, cancelButtonText ("Reset", the component's
   default), showCountOnCta.
   The trigger is the filter-bar button of guidelines/README.md §5: outline,
   the applied count in `counter`, a caret. Its accessible name says both what
   it controls and what is chosen ("Created by: 2 selected"), as
   ltselectpanel.md asks; the visible text stays "Created by 2". */
export function LTSelectPanel({ title, subtitle, buttonLabel, label, ariaLabel, options, defaultValues = [], onApply,
  cancelButtonText = 'Reset', showCountOnCta = true, searchPlaceholder = 'Filter', width = 320 }) {
  const [open, setOpen] = useState(false)
  const [picked, setPicked] = useState(defaultValues)
  const [query, setQuery] = useState('')
  const [order, setOrder] = useState(() => options.map(o => o.value))
  const anchorRef = useRef(null)
  const boxRef = useRef(null)
  const inputRef = useRef(null)
  const pickedRef = useRef(picked)
  pickedRef.current = picked
  const id = useId()
  const root = usePortalRoot()
  const pos = useAnchoredPlacement(open, anchorRef, boxRef, { side: 'bottom', align: 'start' })

  // Selected first, frozen for as long as the panel stays open.
  const freezeOrder = sel => setOrder([
    ...options.filter(o => sel.includes(o.value)).map(o => o.value),
    ...options.filter(o => !sel.includes(o.value)).map(o => o.value),
  ])
  const openPanel = () => { setPicked(defaultValues); freezeOrder(defaultValues); setQuery(''); setOpen(true) }
  const close = (refocus = true) => {
    setOpen(false)
    onApply?.(pickedRef.current)
    if (refocus) anchorRef.current?.focus()
  }
  useEffect(() => { if (open) inputRef.current?.focus() }, [open])
  useEffect(() => {
    if (!open) return
    const onDown = e => {
      if (boxRef.current?.contains(e.target) || anchorRef.current?.contains(e.target)) return
      close(false)
    }
    document.addEventListener('pointerdown', onDown, true)
    return () => document.removeEventListener('pointerdown', onDown, true)
  }, [open])

  const toggle = v => setPicked(p => (p.includes(v) ? p.filter(x => x !== v) : [...p, v]))
  const byValue = Object.fromEntries(options.map(o => [o.value, o]))
  const q = query.trim().toLowerCase()
  const shown = order.map(v => byValue[v]).filter(o => o && (!q || o.label.toLowerCase().includes(q)))
  const n = defaultValues.length

  return (
    <>
      <LTButton ref={anchorRef} variant="outline" size="medium" label={buttonLabel}
        counter={showCountOnCta && n ? n : undefined} trailingIcon={ChevronDown}
        ariaLabel={n ? `${buttonLabel}: ${n} selected` : undefined}
        aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? id : undefined}
        onClick={() => (open ? close() : openPanel())} />
      {open && createPortal(
        <div ref={boxRef} id={id} role="dialog" aria-label={ariaLabel ?? title} className="lt-selpanel"
          style={{ width, top: pos?.top ?? -9999, left: pos?.left ?? -9999 }}
          onKeyDown={e => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close() } }}>
          <div className="lt-selpanel__head">
            <p className="lt-selpanel__title">{title}</p>
            {subtitle && <p className="lt-selpanel__sub">{subtitle}</p>}
          </div>
          <div className="lt-selpanel__search">
            <LTInputBox value={query} onChange={v => { setQuery(v); if (!v) freezeOrder(pickedRef.current) }}
              placeholder={searchPlaceholder} ariaLabel={label ?? searchPlaceholder} forwardRef={inputRef} />
          </div>
          {shown.length ? (
            <ul className="lt-selpanel__list" aria-label={title}>
              {shown.map(o => {
                const on = picked.includes(o.value)
                return (
                  <li key={o.value}>
                    <label className={cx('lt-selpanel__opt', on && 'is-selected')}>
                      <input type="checkbox" className="lt-selpanel__input" checked={on} onChange={() => toggle(o.value)} />
                      <span className="lt-selpanel__box" aria-hidden="true">{on && <Check size={12} strokeWidth={3} />}</span>
                      {o.leadingVisual && <span className="lt-selpanel__visual" aria-hidden="true">{o.leadingVisual}</span>}
                      <span className="lt-selpanel__label">{o.label}</span>
                    </label>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="lt-selpanel__empty" role="status">0 matches for "{query.trim()}"</p>
          )}
          <div className="lt-selpanel__foot">
            <LTButton variant="invisible" size="small" label={cancelButtonText} inactive={!picked.length}
              onClick={() => setPicked([])} />
          </div>
        </div>, root)}
    </>
  )
}

/* ---------- LTDrawer ----------
   Right side only, over a backdrop, so nothing behind it stays interactive
   (guidelines/ltmodal.md). Widths 320, 480, 640, 960 or 1120. It opens
   imperatively, drawerRef.current.openDrawer(), as the component does
   (story-verified). Documented props: title, subTitle, content,
   footerContent, showFooter, onClose, width, closable. Focus moves in and is
   held there; Esc and the close button close it, and the backdrop closes it
   only while nothing has been typed (ltmodal.md: never with unsaved
   changes), which `dirty` reports. Focus returns to whatever opened it. */
export const LTDrawer = React.forwardRef(function LTDrawer(
  { title, subTitle, content, footerContent, showFooter = true, onClose, width = 480, closable = true, dirty = false,
    initialFocusRef },
  ref,
) {
  const [open, setOpen] = useState(false)
  const boxRef = useRef(null)
  const returnTo = useRef(null)
  const id = useId()
  const close = () => {
    setOpen(false)
    onClose?.()
    returnTo.current?.focus?.()
  }
  useImperativeHandle(ref, () => ({
    openDrawer: () => { returnTo.current = document.activeElement; setOpen(true) },
    closeDrawer: close,
  }))
  useEffect(() => {
    if (!open) return
    const box = boxRef.current
    const focusables = () => [...box.querySelectorAll(
      'button:not([aria-disabled="true"]), [href], input, textarea, select, [tabindex]:not([tabindex="-1"])')]
    ;(initialFocusRef?.current ?? focusables()[0])?.focus()
    const onKey = e => {
      if (e.key === 'Escape') { e.preventDefault(); close() }
      if (e.key === 'Tab') {
        const f = focusables()
        if (!f.length) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])
  if (!open) return null
  return createPortal(
    <div className="lt-backdrop lt-backdrop--drawer" onMouseDown={e => { if (e.target === e.currentTarget && !dirty) close() }}>
      <div ref={boxRef} role="dialog" aria-modal="true" aria-labelledby={`${id}-t`} className="lt-drawer" style={{ width }}>
        <div className="lt-drawer__head">
          <div className="lt-drawer__titles">
            <h2 id={`${id}-t`} className="lt-drawer__title">{title}</h2>
            {subTitle && <p className="lt-drawer__sub">{subTitle}</p>}
          </div>
          {closable && <LTIconButton icon={X} ariaLabel="Close" variant="invisible" onClick={close} />}
        </div>
        <div className="lt-drawer__body">{content}</div>
        {showFooter && footerContent && <div className="lt-drawer__foot">{footerContent}</div>}
      </div>
    </div>, document.body)
})

/* ---------- LTTextInputWithTokens ----------
   Free text that becomes tokens: Enter adds one, Backspace in an empty field
   removes the last, and each token has its own remove button. Documented
   props: placeholder, onTokenAdd, removeToken, size, ariaRequired. It has no
   label prop, so an LTFormControl labels it (`id` ties the two). The tokens
   it shows are its own; the callbacks tell the form. */
export function LTTextInputWithTokens({ id, placeholder, onTokenAdd, removeToken, size = 'medium', ariaRequired = false,
  describedBy }) {
  const [tokens, setTokens] = useState([])
  const [text, setText] = useState('')
  const inputRef = useRef(null)
  const add = () => {
    const t = text.trim()
    if (!t) return
    if (!tokens.some(x => x.toLowerCase() === t.toLowerCase())) { setTokens(l => [...l, t]); onTokenAdd?.(t) }
    setText('')
  }
  const remove = t => { setTokens(l => l.filter(x => x !== t)); removeToken?.(t); inputRef.current?.focus() }
  return (
    <div className={cx('lt-tokens', `lt-tokens--${size}`)} onMouseDown={e => { if (e.target === e.currentTarget) { e.preventDefault(); inputRef.current?.focus() } }}>
      {tokens.map(t => <LTToken key={t} text={t} size="small" onRemove={() => remove(t)} />)}
      <input id={id} ref={inputRef} value={text} placeholder={tokens.length ? '' : placeholder}
        aria-required={ariaRequired || undefined} aria-describedby={describedBy} autoComplete="off" spellCheck={false}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => {
          // Enter adds a token and never submits the form around it.
          if (e.key === 'Enter') { e.preventDefault(); add() }
          else if (e.key === 'Backspace' && !text && tokens.length) remove(tokens[tokens.length - 1])
        }}
        onBlur={add} />
    </div>
  )
}

/* ---------- LTToast ---------- top right, 4 seconds (guidelines/README.md §7).
   A toast holds while the pointer or focus is on it. */
const ToastCtx = createContext(() => {})
export const useToast = () => useContext(ToastCtx)
export function ToastProvider({ children }) {
  const [list, setList] = useState([])
  const timers = useRef(new Map())
  const root = usePortalRoot()
  const remove = useCallback(id => {
    clearTimeout(timers.current.get(id)); timers.current.delete(id)
    setList(l => l.filter(t => t.id !== id))
  }, [])
  const arm = useCallback(id => {
    clearTimeout(timers.current.get(id))
    timers.current.set(id, setTimeout(() => remove(id), 4000))
  }, [remove])
  const push = useCallback((text, variant = 'default') => {
    const id = Math.random().toString(36).slice(2)
    setList(l => [...l.slice(-2), { id, text, variant }])
    arm(id)
  }, [arm])
  const hold = id => clearTimeout(timers.current.get(id))
  return (
    <ToastCtx.Provider value={push}>
      {children}
      {createPortal(
        <div className="lt-toasts" role="status" aria-live="polite">
          {list.map(t => {
            const Icon = t.variant === 'success' ? CircleCheck : t.variant === 'danger' ? CircleAlert : Info
            return (
              <div key={t.id} className={cx('lt-toast', `lt-toast--${t.variant}`)}
                onMouseEnter={() => hold(t.id)} onMouseLeave={() => arm(t.id)}
                onFocus={() => hold(t.id)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) arm(t.id) }}>
                <Icon size={16} aria-hidden="true" className="lt-toast__icon" />
                <span>{t.text}</span>
                <button type="button" className="lt-toast__close" aria-label="Dismiss"
                  onClick={() => remove(t.id)}><X size={14} aria-hidden="true" /></button>
              </div>
            )
          })}
        </div>, root)}
    </ToastCtx.Provider>
  )
}

/* ---------- LTPopover ----------
   Documented props: heading, popOverbodyJSX, direction, canChangeDirection,
   containsInteractiveChildElement, forceClose, openOnClick, onOpen.
   Brief 11 opens it on hover; guidelines/ltpopover.md asks for a visible
   dismiss, Esc and click-outside (spec C3). So it opens after a 250ms hover
   (a pointer passing over does not open it), and on a press of its trigger
   (click, Enter or Space), which also moves focus into it so the keyboard can
   reach its link. It stays open when the pointer leaves, until its close
   button, Esc, a click outside, focus leaving it, or another popover opening
   closes it; Tab past its last control returns focus to the trigger. Only
   one is ever open (ltpopover.md: never stack popovers). */
let currentPopover = null // the close function of the popover open now

export function LTPopover({ children, heading, popOverbodyJSX, direction = 'bottom-left', canChangeDirection = true,
  openOnClick = false, forceClose = false, onOpen, containsInteractiveChildElement = true }) {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef(null)
  const popRef = useRef(null)
  const timer = useRef(0)
  const closeRef = useRef(null)
  const viaPress = useRef(false)
  const headingId = useId()
  const popId = useId()
  const root = usePortalRoot()
  const [side, end] = direction.split('-')
  const align = { left: 'start', right: 'end' }[end] ?? 'center'
  const pos = useAnchoredPlacement(open, anchorRef, popRef, { side, align, offset: 10, flip: canChangeDirection })

  closeRef.current = () => setOpen(false)
  const show = press => {
    if (currentPopover && currentPopover !== closeRef) currentPopover.current()
    currentPopover = closeRef
    viaPress.current = press
    setOpen(true)
  }
  const close = (refocus = false) => { setOpen(false); if (refocus) anchorRef.current?.focus() }
  useEffect(() => { if (!open && currentPopover === closeRef) currentPopover = null }, [open])
  useEffect(() => () => { clearTimeout(timer.current); if (currentPopover === closeRef) currentPopover = null }, [])
  useEffect(() => { if (forceClose) setOpen(false) }, [forceClose])
  useEffect(() => {
    if (!open) return
    onOpen?.()
    if (viaPress.current) popRef.current?.focus()
    const onKey = e => { if (e.key === 'Escape') close(popRef.current?.contains(document.activeElement)) }
    const onDown = e => {
      if (popRef.current?.contains(e.target) || anchorRef.current?.contains(e.target)) return
      close()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown, true)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown, true) }
  }, [open])

  const child = React.Children.only(children)
  const trigger = React.cloneElement(child, {
    ref: node => {
      anchorRef.current = node
      const r = child.props.ref
      if (typeof r === 'function') r(node); else if (r) r.current = node
    },
    'aria-haspopup': 'dialog',
    'aria-expanded': open,
    'aria-controls': open ? popId : undefined,
    onMouseEnter: e => {
      child.props.onMouseEnter?.(e)
      clearTimeout(timer.current)
      if (!open && !openOnClick) timer.current = setTimeout(() => show(false), 250)
    },
    onMouseLeave: e => { child.props.onMouseLeave?.(e); clearTimeout(timer.current) },
    onClick: e => {
      child.props.onClick?.(e)
      clearTimeout(timer.current)
      if (open) popRef.current?.focus()
      else show(true)
    },
  })
  const style = { top: pos?.top ?? -9999, left: pos?.left ?? -9999, '--caret-x': `${pos?.caretX ?? 16}px` }
  return (
    <>
      {trigger}
      {open && createPortal(
        <div ref={popRef} id={popId} role="dialog" tabIndex={-1} aria-labelledby={heading ? headingId : undefined}
          className={cx('lt-popover', containsInteractiveChildElement && 'is-interactive', pos && `is-${pos.side}`)}
          style={style}
          onBlur={e => {
            const to = e.relatedTarget
            if (to && !popRef.current?.contains(to) && !anchorRef.current?.contains(to)) close()
          }}
          onKeyDown={e => {
            // It is portaled to <body>, so Tab past either end would leave the
            // page's order. It closes and hands focus back to its trigger
            // instead, as if it sat right after it.
            if (e.key !== 'Tab') return
            const f = [...popRef.current.querySelectorAll('a[href], button:not([aria-disabled="true"])')]
            const atEnd = !e.shiftKey && document.activeElement === f[f.length - 1]
            const atStart = e.shiftKey && (document.activeElement === f[0] || document.activeElement === popRef.current)
            if (atEnd || atStart) { e.preventDefault(); close(true) }
          }}>
          <div className="lt-popover__head">
            {heading && <p id={headingId} className="lt-popover__heading">{heading}</p>}
            <LTIconButton icon={X} ariaLabel="Close" variant="invisible" size="xsmall" tooltipDirection="n"
              className="lt-popover__close" onClick={() => close(true)} />
          </div>
          {popOverbodyJSX}
        </div>, root)}
    </>
  )
}
