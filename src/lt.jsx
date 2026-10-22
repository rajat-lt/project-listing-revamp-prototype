// Look-alikes of the lt-components this page needs. The real library
// (@lambdatestincprivate/lt-components) is private, so each one is hand-built
// here under its real name, with only the props COMPONENTS.md documents, and
// styled from design-context tokens (src/tokens.css). Usage rules follow the
// matching guidelines/<component>.md file. Carried over from the automation
// details prototype, so the prototypes read as one product.
import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Search, CircleAlert, CircleCheck, TriangleAlert, Info, CircleSlash, LoaderCircle, Route, Check, Minus } from 'lucide-react'
import { emailFor, fmtDateTime, fmtRelative, isRelative } from './format.js'

export const cx = (...a) => a.filter(Boolean).join(' ')

/* ---------- where overlays mount: <body> ---------- */
export const usePortalRoot = () => document.body

/* ---------- announcements (guidelines/README.md §9, ux-text-guidelines.md §3) ---------- */
let announceFn = () => {}
export const announce = text => announceFn(text)
export function Announcer() {
  const [msg, setMsg] = useState({ text: '', n: 0 })
  useEffect(() => { announceFn = text => setMsg(m => ({ text, n: m.n + 1 })) }, [])
  return <div className="vh" role="status" aria-live="polite" key={msg.n}>{msg.text}</div>
}

/* ---------- positioning for tooltips and menus ---------- */
export function placeFloating(anchor, el, { side = 'bottom', align = 'center', offset = 4, flip = true } = {}) {
  const a = anchor.getBoundingClientRect()
  const w = el.offsetWidth, h = el.offsetHeight
  const vw = window.innerWidth, vh = window.innerHeight
  let s = side
  if (flip && s === 'bottom' && a.bottom + offset + h > vh - 8 && a.top - offset - h > 8) s = 'top'
  else if (flip && s === 'top' && a.top - offset - h < 8 && a.bottom + offset + h < vh - 8) s = 'bottom'
  let top, left
  if (s === 'top' || s === 'bottom') {
    top = s === 'bottom' ? a.bottom + offset : a.top - offset - h
    left = align === 'start' ? a.left : align === 'end' ? a.right - w : a.left + a.width / 2 - w / 2
  } else {
    left = s === 'right' ? a.right + offset : a.left - offset - w
    top = a.top + a.height / 2 - h / 2
  }
  left = Math.min(Math.max(8, left), vw - w - 8)
  top = Math.min(Math.max(8, top), vh - h - 8)
  return { top, left, side: s }
}

/* ---------- LTTooltip ----------
   Its primary job is naming LTIconButtons (guidelines/lttooltip.md). It wraps
   one child, opens after delayDuration (400) on hover and at once on keyboard
   focus, closes on Esc, blur and leave, and stays open while the pointer is
   over it. `type="description"` also wires aria-describedby. */
export function LTTooltip({ text, direction = 'top', delayDuration = 400, type = 'label', children }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState(null)
  const anchorRef = useRef(null)
  const tipRef = useRef(null)
  const timer = useRef(0)
  const overTip = useRef(false)
  const id = useId()
  const root = usePortalRoot()

  const show = delay => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(true), delay)
  }
  const hide = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => { if (!overTip.current) setOpen(false) }, 60)
  }
  useEffect(() => () => clearTimeout(timer.current), [])
  useLayoutEffect(() => {
    if (!open || !anchorRef.current || !tipRef.current) return
    const update = () => anchorRef.current && tipRef.current &&
      setPos(placeFloating(anchorRef.current, tipRef.current, { side: direction, align: 'center', offset: 6 }))
    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update, true); window.removeEventListener('resize', update) }
  }, [open, direction, text])
  useEffect(() => {
    if (!open) return
    const onKey = e => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const child = React.Children.only(children)
  const props = {
    ref: node => {
      anchorRef.current = node
      const r = child.props.ref // React 19: ref is an ordinary prop
      if (typeof r === 'function') r(node); else if (r) r.current = node
    },
    onMouseEnter: e => { child.props.onMouseEnter?.(e); show(delayDuration) },
    onMouseLeave: e => { child.props.onMouseLeave?.(e); hide() },
    onFocus: e => { child.props.onFocus?.(e); if (e.target.matches?.(':focus-visible')) show(0) },
    onBlur: e => { child.props.onBlur?.(e); clearTimeout(timer.current); setOpen(false) },
    onMouseDown: e => { child.props.onMouseDown?.(e); clearTimeout(timer.current); setOpen(false) },
  }
  if (type === 'description') props['aria-describedby'] = `${id}-d`
  return (
    <>
      {React.cloneElement(child, props)}
      {type === 'description' && <span id={`${id}-d`} className="vh">{text}</span>}
      {open && text && createPortal(
        <div ref={tipRef} role="tooltip" aria-hidden="true"
          className={cx('lt-tooltip', pos && `is-${pos.side}`)}
          style={{ top: pos?.top ?? -9999, left: pos?.left ?? -9999 }}
          onMouseEnter={() => { overTip.current = true }}
          onMouseLeave={() => { overTip.current = false; hide() }}>
          {text}
        </div>, root)}
    </>
  )
}

/* ---------- full text of truncated text ----------
   Not a library component: LTTooltip on a span, shown only while the span is
   actually cut off, measured at the moment of hover, so it follows the
   viewport and whatever sits beside the text. `lines` checks a line clamp
   instead of an ellipsis. Text that fits never gets a tooltip
   (guidelines/lttooltip.md: never repeat text already visible). */
export function TruncText({ text, children, className, direction = 'top', lines = false, as: Tag = 'span', ...rest }) {
  const ref = useRef(null)
  const [tip, setTip] = useState('')
  const check = () => {
    const el = ref.current
    if (!el) return
    const cut = lines ? el.scrollHeight > el.clientHeight + 1 : el.scrollWidth > el.clientWidth + 1
    setTip(cut ? text : '')
  }
  return (
    <LTTooltip text={tip} direction={direction}>
      <Tag ref={ref} className={className} onMouseEnter={check} {...rest}>{children ?? text}</Tag>
    </LTTooltip>
  )
}

/* ---------- LTButton ----------
   Variants and sizes from COMPONENTS.md. `inactive` replaces disabled
   (guidelines/ltbutton.md: never disable). */
export const LTButton = React.forwardRef(function LTButton(
  { variant = 'outline', size = 'small', label, children, leadingIcon: Lead, trailingIcon: Trail,
    counter, inactive = false, loading = false, onClick, ariaLabel, className, style, btnType = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={btnType} aria-label={ariaLabel}
      aria-disabled={inactive || loading || undefined}
      className={cx('lt-btn', `lt-btn--${variant}`, `lt-btn--${size}`, inactive && 'is-inactive', className)}
      style={style}
      onClick={e => { if (inactive || loading) { e.preventDefault(); return } onClick?.(e) }}
      {...rest}>
      {Lead && <Lead size={16} aria-hidden="true" className="lt-btn__icon" />}
      <span className="lt-btn__label">{label ?? children}</span>
      {counter != null && <span className="lt-btn__counter">{counter}</span>}
      {Trail && <Trail size={16} aria-hidden="true" className="lt-btn__icon lt-btn__icon--trail" />}
    </button>
  )
})

/* ---------- LTButtonGroup ----------
   Related actions joined into one control: the inner corners square off and
   neighbouring borders overlap into one divider. Actions only, never a
   selection or a set of views (guidelines/ltbuttongroup.md, README §1).
   Documented props: children, className, style. The split button is
   compositional: an LTButton, then an LTActionMenu whose anchor is an
   icon-only LTIconButton of the same variant and size, with no tooltip of
   its own (ltbuttongroup.md, "The split button, officially"). */
export function LTButtonGroup({ children, className, style }) {
  return <div className={cx('lt-btngroup', className)} style={style}>{children}</div>
}

/* ---------- LTIconButton ----------
   Always an accessible label plus a tooltip showing it, with the shortcut
   when one exists (guidelines/lticonbutton.md). */
export const LTIconButton = React.forwardRef(function LTIconButton(
  { icon: Icon, ariaLabel, variant = 'default', size = 'medium', tooltipDirection = 's', keyshortcuts,
    shortcutLabel, onClick, inactive = false, pressed, expanded, controls, haspopup, className,
    unsafeDisableTooltip = false, tooltipText, iconClassName, ...rest },
  ref,
) {
  const dir = { n: 'top', s: 'bottom', e: 'right', w: 'left', ne: 'top', nw: 'top', se: 'bottom', sw: 'bottom' }[tooltipDirection] ?? 'bottom'
  const btn = (
    <button ref={ref} type="button" aria-label={ariaLabel}
      aria-keyshortcuts={keyshortcuts} aria-pressed={pressed} aria-expanded={expanded}
      aria-controls={controls} aria-haspopup={haspopup}
      aria-disabled={inactive || undefined}
      className={cx('lt-iconbtn', `lt-iconbtn--${variant}`, `lt-iconbtn--${size}`, inactive && 'is-inactive', className)}
      onClick={e => { if (inactive) return; onClick?.(e) }}
      {...rest}>
      <Icon size={size === 'xsmall' ? 14 : 16} aria-hidden="true" className={iconClassName} />
    </button>
  )
  if (unsafeDisableTooltip) return btn
  const tip = tooltipText ?? (shortcutLabel ? `${ariaLabel} (${shortcutLabel})` : ariaLabel)
  return <LTTooltip text={tip} direction={dir}>{btn}</LTTooltip>
})

/* ---------- LTCounterLabel ---------- */
export function LTCounterLabel({ count, scheme = 'secondary', className, ...rest }) {
  return <span className={cx('lt-counter', `lt-counter--${scheme}`, className)} {...rest}>{count}</span>
}

/* ---------- LTTag ---------- read-only metadata (guidelines/lttag.md).
   `leadingVisual` takes an icon (icons.md, "How icons are passed"). A tag
   cut off by its 200px cap shows its full text on hover. */
export function LTTag({ text, variant = 'secondary', labelStyle = 'outline', size = 'small', leadingVisual: Icon, className }) {
  return (
    <span className={cx('lt-tag', `lt-tag--${variant}`, `lt-tag--${labelStyle}`, `lt-tag--${size}`, className)}>
      {Icon && <Icon size={12} aria-hidden="true" className="lt-tag__icon" />}
      <TruncText text={text} className="lt-tag__text" />
    </span>
  )
}

/* ---------- LTTestStatusLabel ----------
   Glyphs follow the Status component as mock-data.md describes each one, and
   never stand in for it: passed = green circle, white tick; failed = red
   circle, white cross; running = blue partial ring; queued = purple circle,
   stacked lines; not started = dotted circle outline; skipped = grey circle,
   skip-forward; archived = archive box (the component's `Archive`). `bare` is
   the component's bg?=No, held per surface. The word is the accessible name,
   so colour is never the only signal (guidelines/README.md §9). */
export const STATUS_WORD = {
  passed: 'Passed', failed: 'Failed', running: 'Running', queued: 'Queued', 'not started': 'Not started',
  skipped: 'Skipped', archived: 'Archived',
}
export function StatusGlyph({ status, size = 16, bare = false }) {
  const s = { width: size, height: size, viewBox: '0 0 16 16', 'aria-hidden': true, className: 'status-glyph' }
  if (status === 'running') {
    return <svg {...s}><circle cx="8" cy="8" r="6" fill="none" stroke="var(--accent-emphasis)" strokeWidth="2"
      strokeDasharray="28 10" strokeLinecap="round" transform="rotate(-90 8 8)" /></svg>
  }
  if (status === 'not started') {
    return <svg {...s}><circle cx="8" cy="8" r="6.5" fill="none" stroke="var(--fg-muted)" strokeWidth="1.5" strokeDasharray="2 2.1" /></svg>
  }
  if (status === 'archived') {
    return <svg {...s}><g fill="none" stroke="var(--fg-muted)" strokeWidth="1.4" strokeLinejoin="round">
      <rect x="1.75" y="2.5" width="12.5" height="3.5" rx="1" /><path d="M3 6v6.5a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6" />
      <path d="M6.5 8.75h3" strokeLinecap="round" /></g></svg>
  }
  const fg = { passed: 'var(--success-fg)', failed: 'var(--danger-fg)', queued: 'var(--done-fg)', skipped: 'var(--fg-muted)' }[status]
    ?? 'var(--fg-muted)'
  const ink = bare ? fg : 'var(--fg-on-emphasis)'
  const glyph = {
    passed: <path d="M4.6 8.3l2.2 2.2 4.6-4.8" fill="none" stroke={ink} strokeWidth={bare ? 1.8 : 1.6} strokeLinecap="round" strokeLinejoin="round" />,
    failed: <path d="M5.4 5.4l5.2 5.2M10.6 5.4l-5.2 5.2" fill="none" stroke={ink} strokeWidth={bare ? 1.8 : 1.6} strokeLinecap="round" />,
    queued: <path d="M5 6h6M5 8h6M5 10h6" fill="none" stroke={ink} strokeWidth="1.4" strokeLinecap="round" />,
    skipped: <path d="M5 5.2v5.6l4-2.8zM10.6 5.2v5.6" fill={ink} stroke={ink} strokeWidth="1.2" strokeLinejoin="round" />,
  }[status]
  return (
    <svg {...s}>
      {!bare && <circle cx="8" cy="8" r="8" fill={fg} />}
      {glyph}
    </svg>
  )
}
export function LTTestStatusLabel({ status, showStatusText = true, width = 16, bare = false, className }) {
  if (!showStatusText) {
    return (
      <span className={cx('status-label', className)} role="img" aria-label={STATUS_WORD[status] ?? status}>
        <StatusGlyph status={status} size={width} bare={bare} />
      </span>
    )
  }
  return (
    <span className={cx('status-text', className)}>
      <StatusGlyph status={status} size={width} bare={bare} />
      <span>{STATUS_WORD[status] ?? status}</span>
    </span>
  )
}

/* ---------- LTMetaData ----------
   `showLeadingDot` puts the middle dot before the item (ux-text-guidelines.md
   §2: middle dot between related fragments). */
export function LTMetaData({ leadingIcon: Icon, value, showLeadingDot = true, label, children, className }) {
  return (
    <span className={cx('meta-item', !showLeadingDot && 'meta-item--lead', className)}>
      {showLeadingDot && <span className="meta-dot" aria-hidden="true">·</span>}
      {Icon && <Icon size={16} aria-hidden="true" className="meta-icon" />}
      {/* One span, so text and a hint inside it wrap as one line of text. */}
      <span className="meta-item__value">{label && <span className="vh">{label} </span>}{children ?? value}</span>
    </span>
  )
}

/* A line of LTMetaData items that may wrap (composed, not a component). A
   wrapped line never starts with a middle dot: each dot sits in a 12px lead
   before its item, and the line clips that lead at its left edge. */
export function MetaLine({ children, className }) {
  return <p className={cx('meta-line', className)}><span className="meta-line__items">{children}</span></p>
}

/* ---------- LTLink ---------- links navigate (guidelines/ltlink.md).
   `size` is medium or small. */
export function LTLink({ href = '#', label, children, muted = false, size, className, onClick, ...rest }) {
  return (
    <a href={href} className={cx('lt-link', muted && 'lt-link--muted', size && `lt-link--${size}`, className)}
      onClick={onClick} {...rest}>
      {label ?? children}
    </a>
  )
}

/* ---------- LTAvatar ---------- initials only, never an image (mock-data.md
   § People). Beside a visible name it is decoration (aria-hidden). */
export function LTAvatar({ initials, name, size = 32, decorative = false }) {
  return (
    <span className="lt-avatar" style={{ width: size, height: size }}
      role={decorative ? undefined : 'img'} aria-label={decorative ? undefined : name} aria-hidden={decorative || undefined}>
      {initials}
    </span>
  )
}

/* ---------- LTInputBox ----------
   variant="default", the component's default, has a background, which
   search fields must keep (guidelines/ltinputbox.md); variant="white" has
   none, and the form fields of the product's Create Test Run drawer pass it.
   With a `label` it is a form field: the label above, the required
   indicator, then the validation message and the caption below. The
   message leads with the fix, and an icon and words carry the error, never
   the border colour alone. */
export function LTInputBox({ value, onChange, placeholder, ariaLabel = 'Search', type = 'search', size = 'medium',
  allowClearSearch = type === 'search', forwardRef, onKeyDown, keyshortcuts, className, extraStyle,
  label, required = false, caption, validationStatus = 'default', validationMessage, id, maxLength,
  variant = 'default' }) {
  const autoId = useId()
  const fid = id || autoId
  const lead = type === 'search'
  const error = validationStatus === 'error' && validationMessage
  const box = (
    <div className={cx('lt-input', `lt-input--${size}`, `lt-input--${variant}`, !lead && 'lt-input--plain', error && 'is-error', !label && className)}
      style={label ? undefined : extraStyle}>
      {lead && <Search size={16} aria-hidden="true" className="lt-input__lead" />}
      <input id={fid} ref={forwardRef} type={type} value={value} placeholder={placeholder}
        aria-label={label ? undefined : ariaLabel} aria-required={required || undefined} aria-invalid={error ? true : undefined}
        aria-describedby={cx(error && `${fid}-msg`, caption && `${fid}-cap`) || undefined}
        aria-keyshortcuts={keyshortcuts} maxLength={maxLength} autoComplete="off" spellCheck={false}
        onChange={e => onChange(e.target.value)} onKeyDown={onKeyDown} />
      {allowClearSearch && value && (
        <button type="button" className="lt-input__clear" aria-label="Clear search"
          onClick={() => { onChange(''); forwardRef?.current?.focus() }}>
          <X size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  )
  if (!label) return box
  return (
    <div className={cx('lt-field', className)} style={extraStyle}>
      <label htmlFor={fid} className="lt-field__label">
        {label}{required && <span className="lt-field__req" aria-hidden="true"> *</span>}
      </label>
      {box}
      {error && <FieldMessage id={`${fid}-msg`} text={validationMessage} />}
      {caption && <p id={`${fid}-cap`} className="lt-field__caption">{caption}</p>}
    </div>
  )
}

function FieldMessage({ id, text }) {
  return (
    <p id={id} className="lt-field__msg">
      <span className="lt-field__msg-icon" aria-hidden="true"><CircleAlert size={12} /></span>{text}
    </p>
  )
}

/* ---------- LTTextarea ----------
   Label above, caption below, vertical resize only so it never breaks the
   layout (guidelines/lttextarea.md). */
export function LTTextarea({ label, value, onChange, placeholder, required = false, caption, rows = 4, resize = 'vertical',
  validationStatus = 'default', validationMessage, id, forwardRef, className }) {
  const autoId = useId()
  const fid = id || autoId
  const error = validationStatus === 'error' && validationMessage
  return (
    <div className={cx('lt-field', className)}>
      <label htmlFor={fid} className="lt-field__label">
        {label}{required && <span className="lt-field__req" aria-hidden="true"> *</span>}
      </label>
      <textarea id={fid} ref={forwardRef} rows={rows} value={value} placeholder={placeholder}
        className={cx('lt-textarea', error && 'is-error')} style={{ resize }}
        aria-required={required || undefined} aria-invalid={error ? true : undefined}
        aria-describedby={cx(error && `${fid}-msg`, caption && `${fid}-cap`) || undefined}
        onChange={e => onChange(e.target.value)} />
      {error && <FieldMessage id={`${fid}-msg`} text={validationMessage} />}
      {caption && <p id={`${fid}-cap`} className="lt-field__caption">{caption}</p>}
    </div>
  )
}

/* ---------- LTFormControl ----------
   A label and a caption around a control that has neither prop of its own
   (here LTTextInputWithTokens). Documented props: label, caption, id,
   isRequired, children. */
export function LTFormControl({ label, caption, id, isRequired = false, children, className }) {
  return (
    <div className={cx('lt-field', className)}>
      <label htmlFor={id} className="lt-field__label">
        {label}{isRequired && <span className="lt-field__req" aria-hidden="true"> *</span>}
      </label>
      {children}
      {caption && <p id={`${id}-cap`} className="lt-field__caption">{caption}</p>}
    </div>
  )
}

/* ---------- LTToken ----------
   Metadata the user can remove: a token, never a removable LTTag
   (guidelines/lttag.md). Documented props: as, hideRemoveButton, isSelected,
   size; the text and the remove handler stand in for the undocumented rest.
   The remove button keeps a 24px target (guidelines/README.md §9). */
export function LTToken({ text, onRemove, hideRemoveButton = false, size = 'medium' }) {
  return (
    <span className={cx('lt-token', `lt-token--${size}`)}>
      <span className="lt-token__text">{text}</span>
      {!hideRemoveButton && (
        <button type="button" className="lt-token__remove" aria-label={`Remove ${text}`} onClick={onRemove}>
          <X size={12} aria-hidden="true" />
        </button>
      )}
    </span>
  )
}

/* ---------- names and dates that explain themselves (v2 item 6) ----------
   A name shows its email, a relative date its full date and time, on hover
   and on keyboard focus. guidelines/lttooltip.md keeps tooltips off plain
   text, so the text is made focusable, as in the automation details
   prototype (spec C13). An absolute date already says when, so it carries
   none. */
export function PersonHint({ name }) {
  return (
    <LTTooltip type="description" text={emailFor(name)} direction="bottom">
      <span className="meta-hint" tabIndex={0}>{name}</span>
    </LTTooltip>
  )
}
export function TimeHint({ date, now }) {
  const text = fmtRelative(date, now)
  if (!isRelative(date, now)) return <time dateTime={date.toISOString()}>{text}</time>
  return (
    <LTTooltip type="description" text={fmtDateTime(date)} direction="bottom">
      <time className="meta-hint" tabIndex={0} dateTime={date.toISOString()}>{text}</time>
    </LTTooltip>
  )
}

/* ---------- LTBlankSlate ---------- */
export function LTBlankSlate({ heading, description, primaryAction, visual, narrow = true }) {
  return (
    <div className={cx('lt-blank', narrow && 'lt-blank--narrow')}>
      {visual && <div className="lt-blank__visual" aria-hidden="true">{visual}</div>}
      <p className="lt-blank__heading">{heading}</p>
      {description && <p className="lt-blank__desc">{description}</p>}
      {primaryAction && <div className="lt-blank__action">{primaryAction}</div>}
    </div>
  )
}

/* ---------- LTFlash ---------- one per page (guidelines/ltflash.md) */
export function LTFlash({ variant = 'default', text, action, className }) {
  const Icon = variant === 'danger' ? CircleAlert : TriangleAlert
  return (
    <div className={cx('lt-flash', `lt-flash--${variant}`, className)} role={variant === 'danger' ? 'alert' : 'status'}>
      <Icon size={16} aria-hidden="true" className="lt-flash__icon" />
      <span className="lt-flash__text">{text}</span>
      {action && <span className="lt-flash__action">{action}</span>}
    </div>
  )
}

/* ---------- LTInlineMessage ----------
   Beside the thing it is about (guidelines/ltinlinemessage.md). Variants from
   COMPONENTS.md; the variant's icon plus the words carry the meaning, never
   the colour alone. COMPONENTS.md documents no text prop (className, size, sx,
   variant), so the message is passed as children (spec §9). */
const INLINE_ICON = { info: Info, warning: TriangleAlert, error: CircleAlert, success: CircleCheck, disabled: CircleSlash, loading: LoaderCircle }
export function LTInlineMessage({ variant = 'error', size = 'medium', children, className }) {
  const Icon = INLINE_ICON[variant] ?? Info
  return (
    <p className={cx('lt-inline-msg', `lt-inline-msg--${variant}`, `lt-inline-msg--${size}`, className)}>
      <span className="lt-inline-msg__icon" aria-hidden="true"><Icon size={size === 'small' ? 12 : 16} /></span>
      <span>{children}</span>
    </p>
  )
}

/* ---------- LTLabelGroup ----------
   A real <ul>, one tag per item (guidelines/ltlabelgroup.md). Its only
   documented prop is `children`; the "Show {n} More" control that keeps long
   collections reachable is composed beside it (projects.jsx, ProjectTags). */
export function LTLabelGroup({ children, className }) {
  return (
    <ul className={cx('lt-labelgroup', className)}>
      {React.Children.map(children, c => c && <li>{c}</li>)}
    </ul>
  )
}

/* ---------- LTProgressBar ----------
   Passive, never focusable (guidelines/ltprogressbar.md). Segments shape is
   story-verified: [{ id, progress, style: { backgroundColor } }]. Beside
   visible text that states its value, it carries no label of its own, so the
   value is not read twice; without that text, `ariaLabel` describes it.
   Static: nothing here changes while the user watches. */
export function LTProgressBar({ segments = [], size = 'default', ariaLabel, className }) {
  return (
    <span className={cx('lt-progress', `lt-progress--${size}`, className)}
      role={ariaLabel ? 'img' : undefined} aria-label={ariaLabel} aria-hidden={ariaLabel ? undefined : true}>
      {segments.map(sg => (
        <span key={sg.id} className="lt-progress__seg" style={{ width: `${sg.progress}%`, ...sg.style }} />
      ))}
    </span>
  )
}

/* ---------- LTLoader ---------- a first load or a full-pane wait
   (guidelines/README.md §7). */
export function LTLoader({ size = 'medium', heading, description }) {
  return (
    <div className={cx('lt-loader', `lt-loader--${size}`)} role="status" aria-live="polite">
      <LoaderCircle size={size === 'small' ? 16 : 24} aria-hidden="true" className="lt-loader__spinner" />
      {heading && <p className="lt-loader__heading">{heading}</p>}
      {description && <p className="lt-loader__desc">{description}</p>}
      {!heading && <span className="vh">Loading</span>}
    </div>
  )
}

/* ---------- the test case and test run icons (v3 item 8) ----------
   Rajat's screenshot of 21 Oct 2026 gives the product's two icons. The test
   run icon is lucide's Route turned upside down (the same geometry, mirrored
   top to bottom). No lucide icon has the test case icon's tick and cross
   (file-check-corner and file-x-corner each put one mark at the bottom
   right), so it is drawn here on lucide's 24px grid and 2px stroke. Both are
   decoration beside a number; the meaning travels in words to screen readers
   (spec C18). */
export function TestCaseIcon({ size = 24, className, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className={className} {...rest}>
      <path d="M4 9V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2h-8" />
      <path d="M14 2v5a1 1 0 0 0 1 1h5" />
      <path d="m3 13 2 2 4-4" />
      <path d="m3 17 4 4" />
      <path d="m7 17-4 4" />
    </svg>
  )
}
export const TestRunIcon = ({ style, ...rest }) => <Route {...rest} style={{ ...style, transform: 'scaleY(-1)' }} />

/* ---------- LTCheckbox ----------
   Documented props: checked, indeterminate, ariaLabel, label, onChange, id.
   The box is 16px inside a 24px target (guidelines/README.md §9). */
export function LTCheckbox({ checked = false, indeterminate = false, onChange, ariaLabel, label, id, className }) {
  const ref = useRef(null)
  useEffect(() => { if (ref.current) ref.current.indeterminate = indeterminate }, [indeterminate])
  const on = checked || indeterminate
  return (
    <label className={cx('lt-checkbox', on && 'is-on', className)}>
      <input ref={ref} id={id} type="checkbox" className="lt-checkbox__input" checked={checked}
        aria-label={label ? undefined : ariaLabel} onChange={e => onChange?.(e.target.checked)} />
      <span className="lt-checkbox__box" aria-hidden="true">
        {indeterminate ? <Minus size={12} strokeWidth={3} /> : checked ? <Check size={12} strokeWidth={3} /> : null}
      </span>
      {label && <span className="lt-checkbox__label">{label}</span>}
    </label>
  )
}

/* ---------- LTRadioGroup ----------
   One group label, vertical options, one tab stop with arrow keys (native
   radios), the most likely option pre-checked, the caption under the group
   (guidelines/ltradiogroup.md). A required group carries its mark on the
   group, never on an option (guidelines/ltradio.md). Documented props:
   label, caption, options (shape TBD → ltradiogroup--radio-group),
   defaultCheckedValue, onChange, groupName, ariaRequired, id. */
export function LTRadioGroup({ label, caption, options, defaultCheckedValue, onChange, groupName, ariaRequired = false,
  required = false, id, className }) {
  const autoId = useId()
  const gid = id || autoId
  const [value, setValue] = useState(defaultCheckedValue)
  return (
    <div className={cx('lt-field', 'lt-radiogroup', className)}>
      <span id={`${gid}-label`} className="lt-field__label">
        {label}{required && <span className="lt-field__req" aria-hidden="true"> *</span>}
      </span>
      <ul role="radiogroup" aria-labelledby={`${gid}-label`} aria-required={ariaRequired || undefined}
        aria-describedby={caption ? `${gid}-cap` : undefined} className="lt-radiogroup__list">
        {options.map(o => (
          <li key={o.value}>
            <label className={cx('lt-radio', value === o.value && 'is-checked')}>
              <input type="radio" className="lt-radio__input" name={groupName ?? gid} value={o.value}
                checked={value === o.value} onChange={() => { setValue(o.value); onChange?.(o.value) }} />
              <span className="lt-radio__dot" aria-hidden="true" />
              <span className="lt-radio__label">{o.label}</span>
            </label>
          </li>
        ))}
      </ul>
      {caption && <p id={`${gid}-cap`} className="lt-field__caption">{caption}</p>}
    </div>
  )
}

/* ---------- LTPagination ----------
   Pagination is navigation: every page has its own URL, and Previous and Next
   point to the adjacent pages (guidelines/ltpagination.md). Page numbers show
   by default; the current page is marked by more than colour (bold and a
   border) and by aria-current. Nothing renders when everything fits on one
   page. Documented props: currentPage, showPages, marginPageCount,
   surroundingPageCount, onChange, and pageCount (story-verified). `hrefFor`
   builds each page's URL. */
export function LTPagination({ currentPage, pageCount, showPages = true, marginPageCount = 1, surroundingPageCount = 2,
  hrefFor, onChange }) {
  if (!pageCount || pageCount <= 1) return null
  const pages = []
  for (let n = 1; n <= pageCount; n++) {
    const edge = n <= marginPageCount || n > pageCount - marginPageCount
    const near = Math.abs(n - currentPage) <= surroundingPageCount
    if (edge || near) pages.push(n)
    else if (pages[pages.length - 1] !== 'gap') pages.push('gap')
  }
  const step = (n, text, rel) => (n < 1 || n > pageCount
    ? <span className="lt-pagination__step is-off" aria-hidden="true">{text}</span>
    : <a className="lt-pagination__step" href={hrefFor(n)} rel={rel} onClick={() => onChange?.(n)}>{text}</a>)
  return (
    <nav className="lt-pagination" aria-label="Pagination">
      {step(currentPage - 1, 'Previous', 'prev')}
      {showPages && pages.map((n, i) => (n === 'gap'
        ? <span key={`g${i}`} className="lt-pagination__gap" aria-hidden="true">…</span>
        : <a key={n} href={hrefFor(n)} aria-current={n === currentPage ? 'page' : undefined}
          aria-label={`Page ${n}`} className={cx('lt-pagination__page', n === currentPage && 'is-current')}
          onClick={() => onChange?.(n)}>{n}</a>))}
      {step(currentPage + 1, 'Next', 'next')}
    </nav>
  )
}
