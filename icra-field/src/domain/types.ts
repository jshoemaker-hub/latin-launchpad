export type Role = 'worker' | 'foreman' | 'superintendent' | 'ip' | 'facilities' | 'safety' | 'viewer'

export const ROLE_LABEL: Record<Role, string> = {
  worker: 'Worker',
  foreman: 'Foreman',
  superintendent: 'Superintendent',
  ip: 'Infection Preventionist',
  facilities: 'Facilities / Engineering',
  safety: 'Safety Officer',
  viewer: 'Viewer',
}

export const ROLES = Object.keys(ROLE_LABEL) as Role[]
export const SUPERVISOR_ROLES: Role[] = ['foreman', 'superintendent']
export const HOSPITAL_ROLES: Role[] = ['ip', 'facilities', 'safety']

export type ActivityType = 'A' | 'B' | 'C' | 'D'
export type RiskGroup = 'low' | 'medium' | 'high' | 'highest'
export type IcraClass = 1 | 2 | 3 | 4 | 5
export type Matrix = Record<RiskGroup, Record<ActivityType, IcraClass>>

export interface ProjectSettings {
  matrix: Matrix
  matrixVersion: string
  /** Minimum negative pressure, in inches of water column, as a positive magnitude. */
  pressureThreshold: number
  /** Local time (HH:MM) by which each day's walk should be submitted. */
  checkDueTime?: string
}

export interface Actor {
  id: string
  name: string
  email: string
  role: Role
}

export interface Signature {
  name: string
  role: Role
  meaning: string
  image: string // PNG data URL
  at: string
}

export interface PhotoRef {
  key: string
  sha256: string
  capturedAt: string
  width: number
  height: number
}

export interface Reading {
  /** Negative pressure magnitude in in. w.c. (0.012 means -0.012 in. w.c.). */
  value: number
  location: string
  method: 'gauge' | 'continuous_monitor' | 'smoke_test'
  threshold: number
  pass: boolean
}

export type Section = 'Setup' | 'ICRA' | 'Pressure' | 'ILSM' | 'Closeout'

export interface ItemTemplate {
  id: string
  text: string
  section: Section
  photo: 'required' | 'optional'
  /** Pressure items: where the reading is taken. */
  readingAt?: string
  /** Closeout steps: only these roles may record the step. */
  roles?: Role[]
  help?: string
}

export type ChecklistKind = 'setup' | 'daily' | 'closeout'

export interface EventPayloads {
  'project.created': { name: string; facility: string; owner: string; contractor: string; settings: ProjectSettings }
  'settings.updated': { settings: ProjectSettings }
  'member.added': { email: string; name: string; role: Role }
  'zone.created': { zoneId: string; name: string; floor: string; area: string; phase: string; trades: string }
  'permit.created': {
    permitId: string
    zoneId: string
    number: string
    scope: string
    activityType: ActivityType
    riskGroup: RiskGroup
    specialHazards: string[]
    cls: IcraClass
    matrixVersion: string
    ilsm: boolean
    ilsmMeasures: string[]
    pressurePoints: string[]
    pressureThreshold: number
    startDate: string
    endDate: string
    /** Company doing the work (GC or sub); defaults to the project's contractor. */
    contractor?: string
  }
  'permit.signed': { permitId: string; signature: Signature }
  'permit.changes_requested': { permitId: string; note: string }
  'permit.resubmitted': { permitId: string; note: string }
  'checklist.created': {
    checklistId: string
    permitId: string
    kind: ChecklistKind
    date: string
    title: string
    items: ItemTemplate[]
  }
  'item.recorded': {
    checklistId: string
    itemId: string
    /** 'open' clears an item that was tapped by mistake, before the checklist is submitted. */
    status: 'open' | 'complete' | 'deficient' | 'na'
    note: string
    photos: PhotoRef[]
    reading?: Reading
  }
  'item.unchecked': { checklistId: string; itemId: string; reason: string; photos: PhotoRef[] }
  'checklist.submitted': { checklistId: string; signature: Signature }
  'checklist.cosigned': { checklistId: string; signature: Signature }
  'rework.requested': { checklistId: string; itemIds: string[]; note: string }
  'comment.added': { checklistId?: string; permitId?: string; itemId?: string; text: string }
  'shutdown.requested': {
    shutdownId: string
    system: ShutdownSystem
    title: string
    zoneId?: string
    contractor: string
    /** Planned window, ISO datetimes. */
    start: string
    end: string
    affectedAreas: string
    mitigation: string
  }
  'shutdown.decided': { shutdownId: string; decision: 'approved' | 'changes_requested'; note: string }
  'shutdown.resubmitted': { shutdownId: string; note: string }
  'shutdown.started': { shutdownId: string }
  'shutdown.restored': { shutdownId: string; note: string }
}

export type ShutdownSystem = 'fire_alarm' | 'sprinkler' | 'medical_gas' | 'electrical' | 'hvac' | 'water' | 'other'

export type EventType = keyof EventPayloads

export interface ProjectEvent<T extends EventType = EventType> {
  id: string
  projectId: string
  type: T
  payload: EventPayloads[T]
  actor: Actor
  /** Time on the device when the action happened. */
  clientTs: string
  /** Time the server received it (absent until synced, and in demo mode). */
  serverTs?: string
  deviceId: string
  /** Hash of the previous event written by the same device, forming a per-device chain. */
  prevHash: string
  hash: string
  /** True while the event is queued on this device and not yet synced. */
  pending?: boolean
}

export type AnyEvent = { [K in EventType]: ProjectEvent<K> }[EventType]
