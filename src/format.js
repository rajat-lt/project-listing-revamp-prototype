// Formats from design-context mock-data.md (§ Formats, § Relative or absolute
// timestamps, § People).

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const pad = n => String(n).padStart(2, '0')

/** `MMM DD, YYYY`, the only absolute date format. Zero-padded day. */
export function fmtDate(d) {
  return `${MONTHS[d.getMonth()]} ${pad(d.getDate())}, ${d.getFullYear()}`
}

/** `MMM DD, YYYY, HH:MM AM/PM`, 12-hour, zero-padded hour (`07:33 AM`). */
export function fmtDateTime(d) {
  const h = d.getHours() % 12 || 12
  return `${fmtDate(d)}, ${pad(h)}:${pad(d.getMinutes())} ${d.getHours() < 12 ? 'AM' : 'PM'}`
}

/** True when fmtRelative shows the date relative ("4 days ago"), not absolute. */
export const isRelative = (d, now) => (now - d) / 86400000 < 31

/**
 * Relative under 30 days, absolute after (mock-data.md). The examples there
 * spell the unit out ("Updated 4 days ago"), so hours and minutes do too.
 */
export function fmtRelative(d, now = new Date()) {
  const s = Math.max(0, (now - d) / 1000)
  const days = Math.floor(s / 86400)
  if (days > 30) return `on ${fmtDate(d)}`
  const unit = (n, w) => `${n} ${w}${n === 1 ? '' : 's'} ago`
  if (days >= 1) return unit(days, 'day')
  const hours = Math.floor(s / 3600)
  if (hours >= 1) return unit(hours, 'hour')
  return unit(Math.max(1, Math.floor(s / 60)), 'minute')
}

/** Duration `Mo D H M S`, leading units dropped: `3m 20s`, `14m 11s`, `11s`. */
export function fmtDuration(sec) {
  let s = Math.round(sec)
  const h = Math.floor(s / 3600); s -= h * 3600
  const m = Math.floor(s / 60); s -= m * 60
  const parts = []
  if (h) parts.push(`${h}h`)
  if (h || m) parts.push(`${m}m`)
  parts.push(`${s}s`)
  return parts.join(' ')
}

/** Numbers above 999: `k` and `M`, up to 2 decimals, zeros trimmed (9 Oct 2026). */
export function fmtCount(n) {
  if (n < 1000) return String(n)
  if (n < 1e6) return `${+(n / 1000).toFixed(2)}k`
  return `${+(n / 1e6).toFixed(2)}M`
}

/** `firstname.lastname@company.com`, all lowercase; single-word names use the
   first name (mock-data.md § Formats). The cast work at Dunder Mifflin, as in
   the automation details prototype. */
export function emailFor(name, domain = 'dundermifflin.com') {
  const w = name.trim().toLowerCase().split(/\s+/)
  return `${w.length === 1 ? w[0] : `${w[0]}.${w[w.length - 1]}`}@${domain}`
}

/** Avatar initials (mock-data.md § People). */
export function initials(name) {
  const w = name.trim().split(/\s+/)
  return (w.length === 1 ? w[0][0] : w[0][0] + w[w.length - 1][0]).toUpperCase()
}
