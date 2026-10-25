import { ROMAN, requiredPermitSigners } from './templates'
import type {
  Actor,
  AnyEvent,
  ChecklistKind,
  EventPayloads,
  ItemTemplate,
  PhotoRef,
  ProjectSettings,
  Reading,
  Role,
  Signature,
} from './types'
import { HOSPITAL_ROLES, SUPERVISOR_ROLES } from './types'

export type ItemStatus = 'open' | 'complete' | 'deficient' | 'na'

export interface Deficiency {
  id: string
  permitId: string
  checklistId: string
  itemId: string
  itemText: string
  kind: 'recorded' | 'uncheck' | 'rework'
  reason: string
  photos: PhotoRef[]
  openedBy: Actor
  openedAt: string
  resolvedBy?: Actor
  resolvedAt?: string
  verifiedBy?: Actor
  verifiedAt?: string
}

export const deficiencyStatus = (d: Deficiency) => (d.verifiedAt ? 'verified' : d.resolvedAt ? 'resolved' : 'open')

export interface ItemState extends ItemTemplate {
  status: ItemStatus
  note: string
  photos: PhotoRef[]
  reading?: Reading
  recordedBy?: Actor
  recordedAt?: string
  openDeficiencyId?: string
  history: AnyEvent[]
}

export type ChecklistStatus = 'in_progress' | 'submitted' | 'approved' | 'rework'

export interface ChecklistState {
  id: string
  permitId: string
  kind: ChecklistKind
  date: string
  title: string
  items: ItemState[]
  status: ChecklistStatus
  createdBy: Actor
  createdAt: string
  submitted?: Signature & { actorId: string }
  cosigned?: Signature
  reworkNote?: string
}

export type PermitStatus = 'pending' | 'active' | 'closing' | 'closed'

export interface PermitState extends Omit<EventPayloads['permit.created'], 'permitId'> {
  id: string
  status: PermitStatus
  requiredSigners: Role[]
  signatures: Signature[]
  createdBy: Actor
  createdAt: string
  activatedAt?: string
  closedAt?: string
  checklistIds: string[]
}

export interface ZoneState extends Omit<EventPayloads['zone.created'], 'zoneId'> {
  id: string
}

export interface Member {
  email: string
  name: string
  role: Role
}

export interface Comment {
  id: string
  actor: Actor
  at: string
  text: string
  checklistId?: string
  permitId?: string
  itemId?: string
}

export interface LogEntry {
  event: AnyEvent
  ok: boolean
  error?: string
  summary: string
}

export interface ProjectState {
  id: string
  name: string
  facility: string
  owner: string
  contractor: string
  settings: ProjectSettings
  members: Member[]
  zones: Record<string, ZoneState>
  permits: Record<string, PermitState>
  checklists: Record<string, ChecklistState>
  deficiencies: Record<string, Deficiency>
  comments: Comment[]
  log: LogEntry[]
}

export class RuleError extends Error {}

const fail = (msg: string): never => {
  throw new RuleError(msg)
}
const isSupervisor = (r: Role) => SUPERVISOR_ROLES.includes(r)
const isHospital = (r: Role) => HOSPITAL_ROLES.includes(r)
const canPermit = (r: Role) => r === 'superintendent' || isHospital(r)

export function emptyState(projectId: string): ProjectState {
  return {
    id: projectId,
    name: '',
    facility: '',
    owner: '',
    contractor: '',
    settings: { matrix: { low: { A: 1, B: 1, C: 1, D: 1 }, medium: { A: 1, B: 1, C: 1, D: 1 }, high: { A: 1, B: 1, C: 1, D: 1 }, highest: { A: 1, B: 1, C: 1, D: 1 } }, matrixVersion: '', pressureThreshold: 0.01 },
    members: [],
    zones: {},
    permits: {},
    checklists: {},
    deficiencies: {},
    comments: [],
    log: [],
  }
}

export function sortEvents(events: AnyEvent[]): AnyEvent[] {
  return [...events].sort((a, b) => a.clientTs.localeCompare(b.clientTs) || a.id.localeCompare(b.id))
}

/** Rebuilds project state from its event history. Events that break a rule are kept in the log, marked rejected. */
export function reduce(projectId: string, events: AnyEvent[]): ProjectState {
  const state = emptyState(projectId)
  for (const ev of sortEvents(events)) {
    try {
      const summary = describe(state, ev)
      validate(state, ev)
      apply(state, ev)
      state.log.push({ event: ev, ok: true, summary })
    } catch (e) {
      if (!(e instanceof RuleError)) throw e
      state.log.push({ event: ev, ok: false, error: e.message, summary: safeDescribe(state, ev) })
    }
  }
  return state
}

const checklistOf = (s: ProjectState, id: string) => s.checklists[id] ?? fail('Checklist not found')
const permitOf = (s: ProjectState, id: string) => s.permits[id] ?? fail('Permit not found')
const itemOf = (c: ChecklistState, id: string) => c.items.find((i) => i.id === id) ?? fail('Item not found')

/** Throws a RuleError if the event isn't allowed in the current state. Does not change state. */
export function validate(s: ProjectState, ev: AnyEvent): void {
  const role = ev.actor.role
  if (ev.type !== 'project.created' && !s.name) fail('Project has not been created')
  if (role === 'viewer' && ev.type !== 'comment.added') fail('Viewers can only comment')

  switch (ev.type) {
    case 'project.created':
      if (s.name) fail('Project already exists')
      return
    case 'settings.updated':
    case 'member.added':
    case 'zone.created':
      if (!canPermit(role)) fail('Only the superintendent or hospital staff can do this')
      if (ev.type === 'member.added' && s.members.some((m) => m.email.toLowerCase() === ev.payload.email.toLowerCase())) fail('Already a member')
      return
    case 'permit.created':
      if (!canPermit(role)) fail('Only the superintendent or hospital staff can open a permit')
      if (!s.zones[ev.payload.zoneId]) fail('Zone not found')
      if (s.permits[ev.payload.permitId]) fail('Permit already exists')
      return
    case 'permit.signed': {
      const p = permitOf(s, ev.payload.permitId)
      if (p.status !== 'pending') fail('Permit is not awaiting signatures')
      if (!p.requiredSigners.includes(role)) fail(`A ${role} signature is not required on this permit`)
      if (p.signatures.some((sig) => sig.role === role)) fail('Already signed for this role')
      return
    }
    case 'checklist.created': {
      const p = permitOf(s, ev.payload.permitId)
      if (p.status === 'closed') fail('Permit is closed')
      if (ev.payload.kind === 'daily') {
        if (p.status !== 'active') fail('Daily walks start once the permit is approved')
        if (p.checklistIds.some((id) => s.checklists[id].kind === 'daily' && s.checklists[id].date === ev.payload.date)) fail('A walk already exists for this date')
      }
      if (ev.payload.kind === 'closeout') {
        if (p.status !== 'active') fail('Only an active permit can start closeout')
        if (!isSupervisor(role) && !isHospital(role)) fail('Only a supervisor or hospital staff can start closeout')
      }
      return
    }
    case 'item.recorded': {
      const c = checklistOf(s, ev.payload.checklistId)
      const item = itemOf(c, ev.payload.itemId)
      if (s.permits[c.permitId].status === 'closed') fail('Permit is closed')
      if (c.status !== 'in_progress' && c.status !== 'rework') fail('Checklist is locked while awaiting sign-off')
      if (item.photo === 'required' && ev.payload.status === 'complete' && ev.payload.photos.length === 0) fail('A photo is required for this item')
      if (item.readingAt && ev.payload.status === 'complete' && !ev.payload.reading) fail('A reading is required for this item')
      if (c.kind === 'closeout') {
        if (item.roles && !item.roles.includes(role)) fail(`This step must be recorded by: ${item.roles.join(' or ')}`)
        if (ev.payload.status === 'na') fail('Closeout steps cannot be marked N/A')
        const idx = c.items.indexOf(item)
        if (c.items.slice(0, idx).some((i) => i.status !== 'complete')) fail('Earlier closeout steps must be complete first')
      }
      return
    }
    case 'item.unchecked': {
      const c = checklistOf(s, ev.payload.checklistId)
      const item = itemOf(c, ev.payload.itemId)
      if (s.permits[c.permitId].status === 'closed') fail('Permit is closed')
      if (item.status !== 'complete' && item.status !== 'na') fail('Only a checked item can be unchecked')
      if (!ev.payload.reason.trim()) fail('A reason is required to uncheck')
      return
    }
    case 'checklist.submitted': {
      const c = checklistOf(s, ev.payload.checklistId)
      if (c.kind === 'closeout') fail('Closeout is completed step by step, not submitted')
      if (c.status !== 'in_progress' && c.status !== 'rework') fail('Checklist already submitted')
      if (c.items.some((i) => i.status === 'open')) fail('Every item needs a status before submitting')
      return
    }
    case 'checklist.cosigned': {
      const c = checklistOf(s, ev.payload.checklistId)
      if (c.status !== 'submitted') fail('Checklist is not awaiting co-sign')
      if (!isSupervisor(role) && !isHospital(role)) fail('Only a supervisor or hospital staff can co-sign')
      if (c.submitted?.actorId === ev.actor.id) fail('Co-sign must be by a different person than the submitter')
      return
    }
    case 'rework.requested': {
      const c = checklistOf(s, ev.payload.checklistId)
      if (c.status !== 'submitted' && c.status !== 'approved') fail('Rework can be requested on a submitted or approved checklist')
      if (!isSupervisor(role) && !isHospital(role)) fail('Only a supervisor or hospital staff can request rework')
      if (ev.payload.itemIds.length === 0) fail('Choose at least one item')
      if (!ev.payload.note.trim()) fail('Say what needs to be fixed')
      ev.payload.itemIds.forEach((id) => itemOf(c, id))
      return
    }
    case 'comment.added':
      if (!ev.payload.text.trim()) fail('Empty comment')
      return
  }
}

function openDeficiency(s: ProjectState, ev: AnyEvent, c: ChecklistState, item: ItemState, kind: Deficiency['kind'], reason: string, photos: PhotoRef[]) {
  if (item.openDeficiencyId) {
    const existing = s.deficiencies[item.openDeficiencyId]
    if (!existing.resolvedAt) return
  }
  const d: Deficiency = {
    id: ev.id,
    permitId: c.permitId,
    checklistId: c.id,
    itemId: item.id,
    itemText: item.text,
    kind,
    reason,
    photos,
    openedBy: ev.actor,
    openedAt: ev.clientTs,
  }
  s.deficiencies[d.id] = d
  item.openDeficiencyId = d.id
}

function apply(s: ProjectState, ev: AnyEvent): void {
  switch (ev.type) {
    case 'project.created': {
      const { name, facility, owner, contractor, settings } = ev.payload
      Object.assign(s, { name, facility, owner, contractor, settings })
      s.members.push({ email: ev.actor.email, name: ev.actor.name, role: ev.actor.role })
      return
    }
    case 'settings.updated':
      s.settings = ev.payload.settings
      return
    case 'member.added':
      s.members.push({ ...ev.payload })
      return
    case 'zone.created': {
      const { zoneId, ...zone } = ev.payload
      s.zones[zoneId] = { id: zoneId, ...zone }
      return
    }
    case 'permit.created': {
      const { permitId, ...p } = ev.payload
      s.permits[permitId] = {
        ...p,
        id: permitId,
        status: 'pending',
        requiredSigners: requiredPermitSigners(p.cls, p.ilsm),
        signatures: [],
        createdBy: ev.actor,
        createdAt: ev.clientTs,
        checklistIds: [],
      }
      return
    }
    case 'permit.signed': {
      const p = s.permits[ev.payload.permitId]
      p.signatures.push(ev.payload.signature)
      if (p.requiredSigners.every((r) => p.signatures.some((sig) => sig.role === r))) {
        p.status = 'active'
        p.activatedAt = ev.clientTs
      }
      return
    }
    case 'checklist.created': {
      const { checklistId, items, ...rest } = ev.payload
      s.checklists[checklistId] = {
        ...rest,
        id: checklistId,
        items: items.map((t) => ({ ...t, status: 'open', note: '', photos: [], history: [] })),
        status: 'in_progress',
        createdBy: ev.actor,
        createdAt: ev.clientTs,
      }
      const p = s.permits[ev.payload.permitId]
      p.checklistIds.push(checklistId)
      if (ev.payload.kind === 'closeout') p.status = 'closing'
      return
    }
    case 'item.recorded': {
      const c = s.checklists[ev.payload.checklistId]
      const item = itemOf(c, ev.payload.itemId)
      Object.assign(item, {
        status: ev.payload.status,
        note: ev.payload.note,
        photos: ev.payload.photos,
        reading: ev.payload.reading,
        recordedBy: ev.actor,
        recordedAt: ev.clientTs,
      })
      item.history.push(ev)
      const failedReading = ev.payload.reading && !ev.payload.reading.pass
      if (failedReading) item.status = 'deficient'
      if (ev.payload.status === 'deficient' || failedReading) {
        const reason = ev.payload.note || (failedReading ? `Reading ${ev.payload.reading!.value} below threshold ${ev.payload.reading!.threshold}` : 'Marked deficient')
        openDeficiency(s, ev, c, item, 'recorded', reason, ev.payload.photos)
      } else if (item.openDeficiencyId) {
        const d = s.deficiencies[item.openDeficiencyId]
        if (!d.resolvedAt) Object.assign(d, { resolvedBy: ev.actor, resolvedAt: ev.clientTs })
      }
      if (c.kind === 'closeout' && c.items.every((i) => i.status === 'complete')) {
        const p = s.permits[c.permitId]
        p.status = 'closed'
        p.closedAt = ev.clientTs
        c.status = 'approved'
      }
      return
    }
    case 'item.unchecked': {
      const c = s.checklists[ev.payload.checklistId]
      const item = itemOf(c, ev.payload.itemId)
      item.status = 'deficient'
      item.history.push(ev)
      openDeficiency(s, ev, c, item, 'uncheck', ev.payload.reason, ev.payload.photos)
      if (c.status === 'submitted' || c.status === 'approved') {
        c.status = 'rework'
        c.reworkNote = `Unchecked by ${ev.actor.name}: ${ev.payload.reason}`
      }
      return
    }
    case 'checklist.submitted': {
      const c = s.checklists[ev.payload.checklistId]
      c.status = 'submitted'
      c.submitted = { ...ev.payload.signature, actorId: ev.actor.id }
      c.cosigned = undefined
      return
    }
    case 'checklist.cosigned': {
      const c = s.checklists[ev.payload.checklistId]
      c.status = 'approved'
      c.cosigned = ev.payload.signature
      c.reworkNote = undefined
      for (const item of c.items) {
        const d = item.openDeficiencyId ? s.deficiencies[item.openDeficiencyId] : undefined
        if (d?.resolvedAt && !d.verifiedAt) Object.assign(d, { verifiedBy: ev.actor, verifiedAt: ev.clientTs })
      }
      return
    }
    case 'rework.requested': {
      const c = s.checklists[ev.payload.checklistId]
      for (const id of ev.payload.itemIds) {
        const item = itemOf(c, id)
        item.status = 'deficient'
        item.history.push(ev)
        openDeficiency(s, ev, c, item, 'rework', ev.payload.note, [])
      }
      c.status = 'rework'
      c.reworkNote = ev.payload.note
      return
    }
    case 'comment.added':
      s.comments.push({ id: ev.id, actor: ev.actor, at: ev.clientTs, ...ev.payload })
      return
  }
}

function safeDescribe(s: ProjectState, ev: AnyEvent) {
  try {
    return describe(s, ev)
  } catch {
    return ev.type
  }
}

function itemText(s: ProjectState, checklistId: string, itemId: string) {
  return s.checklists[checklistId]?.items.find((i) => i.id === itemId)?.text ?? itemId
}

function checklistLabel(s: ProjectState, checklistId: string) {
  const c = s.checklists[checklistId]
  if (!c) return 'checklist'
  return `${c.title} (permit ${s.permits[c.permitId]?.number ?? ''})`
}

export function describe(s: ProjectState, ev: AnyEvent): string {
  switch (ev.type) {
    case 'project.created':
      return `Created project "${ev.payload.name}"`
    case 'settings.updated':
      return 'Updated project settings (ICRA matrix / pressure threshold)'
    case 'member.added':
      return `Added ${ev.payload.name} (${ev.payload.email}) as ${ev.payload.role}`
    case 'zone.created':
      return `Added zone "${ev.payload.name}"`
    case 'permit.created':
      return `Opened ICRA permit ${ev.payload.number}: Class ${ROMAN[ev.payload.cls]}${ev.payload.ilsm ? ' + ILSM' : ''} in ${s.zones[ev.payload.zoneId]?.name ?? 'zone'}`
    case 'permit.signed':
      return `Signed permit ${s.permits[ev.payload.permitId]?.number ?? ''}: ${ev.payload.signature.meaning}`
    case 'checklist.created':
      return `Started ${ev.payload.title}`
    case 'item.recorded': {
      const r = ev.payload.reading
      const extra = r ? ` (reading −${r.value} in. w.c., ${r.pass ? 'pass' : 'FAIL'})` : ''
      return `Marked "${itemText(s, ev.payload.checklistId, ev.payload.itemId)}" ${ev.payload.status === 'na' ? 'N/A' : ev.payload.status}${extra}`
    }
    case 'item.unchecked':
      return `Unchecked "${itemText(s, ev.payload.checklistId, ev.payload.itemId)}": ${ev.payload.reason}`
    case 'checklist.submitted':
      return `Submitted ${checklistLabel(s, ev.payload.checklistId)} for co-sign`
    case 'checklist.cosigned':
      return `Co-signed ${checklistLabel(s, ev.payload.checklistId)}`
    case 'rework.requested':
      return `Requested rework on ${ev.payload.itemIds.length} item(s) in ${checklistLabel(s, ev.payload.checklistId)}: ${ev.payload.note}`
    case 'comment.added':
      return `Commented: ${ev.payload.text}`
  }
}

/** Dates (YYYY-MM-DD) before today on which an active permit has no submitted daily walk. */
export function missedDays(s: ProjectState, permit: PermitState, today: string): string[] {
  if (!permit.activatedAt) return []
  const done = new Set(
    permit.checklistIds.map((id) => s.checklists[id]).filter((c) => c.kind === 'daily' && c.status !== 'in_progress').map((c) => c.date),
  )
  const end = permit.closedAt ? localYmd(new Date(permit.closedAt)) : today
  const out: string[] = []
  for (let d = maxDate(localYmd(new Date(permit.activatedAt)), permit.startDate); d < end && d <= permit.endDate; d = addDays(d, 1)) {
    if (!done.has(d)) out.push(d)
  }
  return out
}

const maxDate = (a: string, b: string) => (a > b ? a : b)

/** YYYY-MM-DD in the device's local time zone (a job's "day" is the crew's day, not UTC's). */
export function localYmd(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function addDays(date: string, n: number): string {
  const d = new Date(`${date}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

/** Work waiting on someone with this role. */
export function inbox(s: ProjectState, role: Role, actorId: string) {
  const permitsToSign = Object.values(s.permits).filter(
    (p) => p.status === 'pending' && p.requiredSigners.includes(role) && !p.signatures.some((sig) => sig.role === role),
  )
  const toCosign = Object.values(s.checklists).filter(
    (c) => c.status === 'submitted' && (isSupervisor(role) || isHospital(role)) && c.submitted?.actorId !== actorId,
  )
  const rework = Object.values(s.checklists).filter((c) => c.status === 'rework' && !isHospital(role))
  const closeoutSteps = Object.values(s.checklists)
    .filter((c) => c.kind === 'closeout' && s.permits[c.permitId].status === 'closing')
    .flatMap((c) => {
      const next = c.items.find((i) => i.status !== 'complete')
      return next && next.roles?.includes(role) ? [{ checklist: c, item: next }] : []
    })
  return { permitsToSign, toCosign, rework, closeoutSteps }
}
