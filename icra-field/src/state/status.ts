import { localYmd, type PermitState, type ProjectState } from '../domain/reducer'
import { todaysWalk } from './actions'

export const shortDate = (ymd: string) => new Date(`${ymd}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
export const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })

const dueTime = (state: ProjectState) => state.settings.checkDueTime ?? '12:00'

/** Has today's check passed its due time? */
export function isOverdue(state: ProjectState, today: string) {
  return localYmd() === today && new Date().toTimeString().slice(0, 5) > dueTime(state)
}

export function dueLabel(state: ProjectState, today: string) {
  if (isOverdue(state, today)) return 'overdue'
  const t = dueTime(state)
  return `due by ${t === '12:00' ? 'noon' : t}`
}

/** One-line status of a permit's check for the day, as shown on Today and the hospital table. */
export function todayStatus(state: ProjectState, p: PermitState, today: string): { text: string; tone: 'good' | 'warn' | 'bad' } {
  const walk = todaysWalk(state, p, today)
  if (walk?.items.some((i) => i.reading && !i.reading.pass && i.status === 'deficient')) return { text: 'Out of range', tone: 'bad' }
  if (walk?.status === 'rework') return { text: 'Rework', tone: 'bad' }
  if (walk && walk.status !== 'in_progress') return { text: `Logged ${walk.submitted ? fmtTime(walk.submitted.at) : ''}`, tone: 'good' }
  if (walk) return { text: 'In progress', tone: 'warn' }
  const label = dueLabel(state, today)
  return { text: label[0].toUpperCase() + label.slice(1), tone: isOverdue(state, today) ? 'bad' : 'warn' }
}
