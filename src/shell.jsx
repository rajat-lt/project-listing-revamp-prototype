// Platform shell: the 56px rail and the top bar, from design-context
// patterns/platform-sidebar.md and patterns/topbar.md. Carried over from the
// notification-center and automation details prototypes so the demos read as
// one product; Test Manager is the active product here, with the right
// cluster topbar.md §2 records for it. Nav icons are lucide names verified in
// the installed version and chosen by intent: platform-sidebar.md names no
// icons, so they are placeholders, not decisions.
import React, { useCallback, useRef, useState } from 'react'
import {
  House, Bot, SquareTerminal, ClipboardList, TestTubes, Monitor, Smartphone, Workflow, ScanEye, Zap,
  ChartColumn, Accessibility, Globe, Ellipsis, Settings, CircleHelp, KeyRound, ChevronRight, ChevronDown,
  Bell, Coins, Clock, Megaphone,
} from 'lucide-react'
import { LTTooltip, LTIconButton, LTButton, LTAvatar, cx } from './lt.jsx'
import { ProjectCrumb } from './switcher.jsx'

const PRIMARY_NAV = [
  ['home', 'Home', House], ['kaneai', 'KaneAI', Bot, true], ['kane-cli', 'Kane CLI', SquareTerminal],
  ['test-manager', 'Test Manager', ClipboardList, true], ['agent-testing', 'Agent Testing', TestTubes],
  ['real-time', 'Real Time', Monitor, true], ['real-device', 'Real Device', Smartphone, true],
  ['automation', 'Automation', Workflow, true], ['smartui', 'SmartUI', ScanEye],
  ['hyperexecute', 'HyperExecute', Zap, true], ['insights', 'Insights', ChartColumn, true],
  ['accessibility', 'Accessibility', Accessibility, true], ['web-scanner', 'Web Scanner', Globe, true],
  ['more-tools', 'More Tools', Ellipsis, true], ['settings', 'Settings', Settings, true],
]
const SECONDARY_NAV = [['help', 'Help', CircleHelp, true], ['credentials', 'Credentials', KeyRound, true], ['quick-actions', 'Quick Actions', Zap, true]]

function NavItem({ item: [id, label, Icon, sub], active }) {
  return (
    <li>
      <a className={cx('navitem', active && 'active')} href="#nav" aria-current={active ? 'page' : undefined}
        onClick={e => e.preventDefault()}>
        <Icon size={16} aria-hidden="true" className="navitem-icon" />
        <span className="navitem-label">{label}</span>
        {sub && <ChevronRight size={16} aria-hidden="true" className="navitem-caret" />}
      </a>
    </li>
  )
}

/**
 * The rail expands on hover into a 320px panel that overlays the page, never
 * pushing it (platform-sidebar.md §1). The brand mark also opens it from the
 * keyboard, the pattern's recorded recommendation. Collapsed, it shows Test
 * Manager only: the pattern counts four Test Manager rail icons (§1) without
 * naming them (spec §9).
 */
export function PlatformSidebar({ active = 'test-manager' }) {
  const [hover, setHover] = useState(false)
  const [pinned, setPinned] = useState(false)
  const wrap = useRef(null)
  const brand = useRef(null)
  const open = hover || pinned
  const close = useCallback(() => { setPinned(false); setHover(false) }, [])
  return (
    <>
      <div className="rail-slot" />
      <div ref={wrap} className={cx('rail', open && 'open')}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        onKeyDown={e => { if (e.key === 'Escape' && open) { close(); brand.current?.focus() } }}
        onBlurCapture={e => { if (!wrap.current?.contains(e.relatedTarget)) setPinned(false) }}>
        <div className="rail-corner">
          <button ref={brand} type="button" className="rail-brand" aria-expanded={open}
            aria-label="TestMu AI, open platform navigation"
            onFocus={() => setPinned(true)} onClick={() => setPinned(v => !v)}>
            <span className="rail-mark" aria-hidden="true">T</span>
          </button>
        </div>
        {open ? (
          <>
            <div className="rail-word"><strong>TestMu AI</strong><em>Formerly LambdaTest</em></div>
            <nav className="rail-nav" aria-label="Products">
              <ul>{PRIMARY_NAV.map(i => <NavItem key={i[0]} item={i} active={i[0] === active} />)}</ul>
            </nav>
            <hr className="rail-div" />
            <nav className="rail-secondary" aria-label="Support">
              <ul>{SECONDARY_NAV.map(i => <NavItem key={i[0]} item={i} />)}</ul>
            </nav>
            <button type="button" className="lt-btn lt-btn--orange lt-btn--large rail-upgrade">Upgrade Now</button>
          </>
        ) : (
          <div className="rail-icons">
            <LTTooltip text="Test Manager" direction="right">
              <a className="rail-icon active" href="#nav" aria-label="Test Manager" aria-current="page"
                onClick={e => e.preventDefault()}><ClipboardList size={16} aria-hidden="true" /></a>
            </LTTooltip>
          </div>
        )}
      </div>
    </>
  )
}

/**
 * Top bar. At depth 1, the plain label "Test Manager", since a one-item
 * breadcrumb is not navigation (topbar.md §1). Inside a project, depth 2: the
 * breadcrumb "Test Manager / {project}" (test-entity-listing.md §1), every
 * crumb a link (guidelines/ltbreadcrumbs.md), the project's with its switcher
 * caret (switcher.jsx). Test Manager's right cluster
 * (§2): Credits, a separator, Recent Tests, Announcements, then the constant
 * bell, avatar and Upgrade Now. What Credits opens is unconfirmed (§8 q1), so
 * it, Recent Tests and Announcements answer with a toast. The bell opens the
 * notification-center prototype, where the panel lives.
 */
export function TopBar({ onStub, project, switchGroups, switchState }) {
  return (
    <header className="topbar">
      {project ? (
        <nav aria-label="Breadcrumb">
          <ol className="crumbs">
            <li><a className="crumb" href="#/">Test Manager</a></li>
            <li>
              <span className="crumb-sep" aria-hidden="true">/</span>
              <ProjectCrumb project={project} groups={switchGroups} state={switchState} />
            </li>
          </ol>
        </nav>
      ) : <p className="topbar-label">Test Manager</p>}
      <div className="topbar-right">
        {/* "Credits: 20k": lowercase k, no space before the colon (topbar.md §6 delta 1). */}
        <LTButton variant="outline" size="small" leadingIcon={Coins} trailingIcon={ChevronDown} label="Credits: 20k"
          onClick={() => onStub('Your credit details open here.')} />
        {/* Composed 1px rule: LTDivider documents no orientation (topbar.md §8 q3). */}
        <span className="vsep" aria-hidden="true" />
        <LTButton variant="outline" size="small" leadingIcon={Clock} label="Recent Tests"
          onClick={() => onStub('Your recent tests open here.')} />
        {/* Announcements must not read as a bell (topbar.md §8 q5). */}
        <LTIconButton icon={Megaphone} ariaLabel="Announcements" variant="outline"
          onClick={() => onStub('Announcements open here.')} />
        <LTIconButton icon={Bell} ariaLabel="Notifications" variant="outline"
          onClick={() => window.open('https://rajat-lt.github.io/notification-center-prototype/', '_blank', 'noopener')} />
        <LTAvatar initials="RS" name="Ritika Sharma" size={32} />
        <LTButton variant="orange" size="medium" label="Upgrade Now" onClick={() => onStub('Plans and pricing open here.')} />
      </div>
    </header>
  )
}
