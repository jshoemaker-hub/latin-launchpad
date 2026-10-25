import { describe, expect, it } from 'vitest'
import { hashEvent, verifyChain } from './hash'
import { missedDays, reduce } from './reducer'
import { CLOSEOUT_STEPS, DEFAULT_SETTINGS, computeClass, dailyItems, setupItems } from './templates'
import type { Actor, AnyEvent, EventPayloads, EventType, ProjectEvent, Role } from './types'

const P = 'project-1'
const people: Record<string, Actor> = {
  worker: { id: 'u-worker', name: 'Wes Worker', email: 'w@x', role: 'worker' },
  foreman: { id: 'u-foreman', name: 'Fay Foreman', email: 'f@x', role: 'foreman' },
  super: { id: 'u-super', name: 'Sue Super', email: 's@x', role: 'superintendent' },
  ip: { id: 'u-ip', name: 'Ian IP', email: 'i@x', role: 'ip' },
  facilities: { id: 'u-fac', name: 'Fran Facilities', email: 'fa@x', role: 'facilities' },
  safety: { id: 'u-safety', name: 'Sal Safety', email: 'sa@x', role: 'safety' },
}

function log() {
  const events: AnyEvent[] = []
  let t = Date.parse('2026-10-01T08:00:00Z')
  const prev = new Map<string, string>()
  const add = async <T extends EventType>(who: keyof typeof people, type: T, payload: EventPayloads[T]) => {
    const deviceId = `dev-${who}`
    const base = { id: `e${events.length}`, projectId: P, type, payload, actor: people[who], clientTs: new Date((t += 60_000)).toISOString(), deviceId, prevHash: prev.get(deviceId) ?? '' }
    const ev = { ...base, hash: await hashEvent(base as Omit<ProjectEvent, 'hash'>) } as AnyEvent
    prev.set(deviceId, ev.hash)
    events.push(ev)
    return ev
  }
  return { events, add, state: () => reduce(P, events) }
}

const sig = (role: Role) => ({ name: 'x', role, meaning: 'm', image: '', at: '2026-10-01T00:00:00Z' })
const photo = { key: 'k', sha256: 'abc', capturedAt: '2026-10-01T00:00:00Z', width: 1, height: 1 }

async function activeClass4Permit() {
  const l = log()
  await l.add('super', 'project.created', { name: 'Demo', facility: 'H', owner: '', contractor: '', settings: DEFAULT_SETTINGS })
  await l.add('super', 'zone.created', { zoneId: 'z1', name: 'Zone 1', floor: '4', area: '', phase: '', trades: '' })
  const permit = {
    permitId: 'p1', zoneId: 'z1', number: 'P-1', scope: 's', activityType: 'C' as const, riskGroup: 'high' as const, specialHazards: [],
    cls: computeClass(DEFAULT_SETTINGS.matrix, 'C', 'high', []), matrixVersion: 'v', ilsm: false, ilsmMeasures: [],
    pressurePoints: ['Door'], pressureThreshold: 0.01, startDate: '2026-10-01', endDate: '2026-10-10',
  }
  await l.add('super', 'permit.created', permit)
  await l.add('ip', 'permit.signed', { permitId: 'p1', signature: sig('ip') })
  await l.add('facilities', 'permit.signed', { permitId: 'p1', signature: sig('facilities') })
  const items = dailyItems(permit)
  await l.add('worker', 'checklist.created', { checklistId: 'c1', permitId: 'p1', kind: 'daily', date: '2026-10-01', title: 'Daily', items })
  return { l, items }
}

async function completeAll(l: ReturnType<typeof log>, checklistId: string, items: ReturnType<typeof dailyItems>, who: keyof typeof people = 'worker') {
  for (const i of items) {
    await l.add(who, 'item.recorded', {
      checklistId, itemId: i.id, status: 'complete', note: '', photos: [photo],
      reading: i.readingAt ? { value: 0.02, location: i.readingAt, method: 'gauge', threshold: 0.01, pass: true } : undefined,
    })
  }
}

describe('ICRA class', () => {
  it('reads the matrix', () => {
    expect(computeClass(DEFAULT_SETTINGS.matrix, 'D', 'highest', [])).toBe(5)
    expect(computeClass(DEFAULT_SETTINGS.matrix, 'B', 'low', [])).toBe(2)
  })
  it('raises sewage or mold work to IV (low/medium) or V (high/highest)', () => {
    expect(computeClass(DEFAULT_SETTINGS.matrix, 'A', 'low', ['mold'])).toBe(4)
    expect(computeClass(DEFAULT_SETTINGS.matrix, 'A', 'high', ['sewage'])).toBe(5)
  })
  it('adds controls cumulatively by class', () => {
    expect(setupItems(2).some((i) => i.id === 's.barrier')).toBe(false)
    expect(setupItems(3).some((i) => i.id === 's.barrier')).toBe(true)
    expect(setupItems(5).some((i) => i.id === 's.ante5')).toBe(true)
    expect(setupItems(5).some((i) => i.id === 's.ante4')).toBe(false)
  })
})

describe('permit approval', () => {
  it('stays pending until every required role signs, and blocks daily walks until then', async () => {
    const l = log()
    await l.add('super', 'project.created', { name: 'Demo', facility: 'H', owner: '', contractor: '', settings: DEFAULT_SETTINGS })
    await l.add('super', 'zone.created', { zoneId: 'z1', name: 'Zone 1', floor: '', area: '', phase: '', trades: '' })
    await l.add('super', 'permit.created', {
      permitId: 'p1', zoneId: 'z1', number: 'P-1', scope: '', activityType: 'D', riskGroup: 'highest', specialHazards: [], cls: 5,
      matrixVersion: 'v', ilsm: true, ilsmMeasures: ['M4'], pressurePoints: [], pressureThreshold: 0.01, startDate: '2026-10-01', endDate: '2026-10-05',
    })
    expect(l.state().permits.p1.requiredSigners).toEqual(['ip', 'facilities', 'safety'])
    await l.add('worker', 'permit.signed', { permitId: 'p1', signature: sig('worker') })
    await l.add('ip', 'permit.signed', { permitId: 'p1', signature: sig('ip') })
    await l.add('facilities', 'permit.signed', { permitId: 'p1', signature: sig('facilities') })
    await l.add('worker', 'checklist.created', { checklistId: 'c1', permitId: 'p1', kind: 'daily', date: '2026-10-01', title: 'd', items: [] })
    let s = l.state()
    expect(s.permits.p1.status).toBe('pending')
    expect(s.log.filter((e) => !e.ok).map((e) => e.event.type)).toEqual(['permit.signed', 'checklist.created'])
    await l.add('safety', 'permit.signed', { permitId: 'p1', signature: sig('safety') })
    s = l.state()
    expect(s.permits.p1.status).toBe('active')
  })
})

describe('daily walk', () => {
  it('requires a photo where the template says so, and a reading on pressure items', async () => {
    const { l } = await activeClass4Permit()
    await l.add('worker', 'item.recorded', { checklistId: 'c1', itemId: 'd.barrier', status: 'complete', note: '', photos: [] })
    await l.add('worker', 'item.recorded', { checklistId: 'c1', itemId: 'p.0', status: 'complete', note: '', photos: [photo] })
    expect(l.state().log.filter((e) => !e.ok).map((e) => e.error)).toEqual(['A photo is required for this item', 'A reading is required for this item'])
  })

  it('opens an issue for a failed pressure reading', async () => {
    const { l } = await activeClass4Permit()
    await l.add('worker', 'item.recorded', {
      checklistId: 'c1', itemId: 'p.0', status: 'complete', note: '', photos: [photo],
      reading: { value: 0.004, location: 'Door', method: 'gauge', threshold: 0.01, pass: false },
    })
    const s = l.state()
    expect(s.checklists.c1.items.find((i) => i.id === 'p.0')!.status).toBe('deficient')
    expect(Object.values(s.deficiencies)).toHaveLength(1)
  })

  it('submit → co-sign by someone else → uncheck reopens it and the issue closes only after re-approval', async () => {
    const { l, items } = await activeClass4Permit()
    await completeAll(l, 'c1', items)
    await l.add('worker', 'checklist.submitted', { checklistId: 'c1', signature: sig('worker') })
    await l.add('worker', 'checklist.cosigned', { checklistId: 'c1', signature: sig('worker') }) // rejected: worker can't co-sign
    await l.add('foreman', 'checklist.cosigned', { checklistId: 'c1', signature: sig('foreman') })
    expect(l.state().checklists.c1.status).toBe('approved')

    await l.add('ip', 'item.unchecked', { checklistId: 'c1', itemId: 'd.barrier', reason: 'Gap at top', photos: [] })
    let s = l.state()
    expect(s.checklists.c1.status).toBe('rework')
    const issue = Object.values(s.deficiencies)[0]
    expect(issue.kind).toBe('uncheck')
    expect(issue.openedBy.role).toBe('ip')

    await l.add('worker', 'item.recorded', { checklistId: 'c1', itemId: 'd.barrier', status: 'complete', note: 'Sealed', photos: [photo] })
    expect(l.state().deficiencies[issue.id].resolvedAt).toBeTruthy()
    expect(l.state().deficiencies[issue.id].verifiedAt).toBeFalsy()
    await l.add('worker', 'checklist.submitted', { checklistId: 'c1', signature: sig('worker') })
    await l.add('super', 'checklist.cosigned', { checklistId: 'c1', signature: sig('superintendent') })
    s = l.state()
    expect(s.deficiencies[issue.id].verifiedAt).toBeTruthy()
    expect(s.checklists.c1.items.find((i) => i.id === 'd.barrier')!.history).toHaveLength(3)
  })

  it('rework request sends chosen items back', async () => {
    const { l, items } = await activeClass4Permit()
    await completeAll(l, 'c1', items)
    await l.add('worker', 'checklist.submitted', { checklistId: 'c1', signature: sig('worker') })
    await l.add('foreman', 'rework.requested', { checklistId: 'c1', itemIds: ['d.nam'], note: 'Hose kinked' })
    const s = l.state()
    expect(s.checklists.c1.status).toBe('rework')
    expect(s.checklists.c1.items.find((i) => i.id === 'd.nam')!.status).toBe('deficient')
  })

  it('locks items while awaiting co-sign', async () => {
    const { l, items } = await activeClass4Permit()
    await completeAll(l, 'c1', items)
    await l.add('worker', 'checklist.submitted', { checklistId: 'c1', signature: sig('worker') })
    await l.add('worker', 'item.recorded', { checklistId: 'c1', itemId: 'd.clean', status: 'na', note: '', photos: [] })
    expect(l.state().log.at(-1)!.ok).toBe(false)
  })
})

describe('closeout', () => {
  it('enforces step order and roles, then closes the permit', async () => {
    const { l } = await activeClass4Permit()
    await l.add('super', 'checklist.created', { checklistId: 'co', permitId: 'p1', kind: 'closeout', date: '2026-10-05', title: 'Closeout', items: CLOSEOUT_STEPS })
    expect(l.state().permits.p1.status).toBe('closing')
    const rec = (who: keyof typeof people, itemId: string) => l.add(who, 'item.recorded', { checklistId: 'co', itemId, status: 'complete', note: '', photos: [photo] })
    await rec('ip', 'c.ip1') // out of order
    await rec('worker', 'c.clean') // wrong role
    expect(l.state().log.slice(-2).every((e) => !e.ok)).toBe(true)
    await rec('super', 'c.clean')
    await rec('ip', 'c.ip1')
    await rec('facilities', 'c.evs')
    await rec('ip', 'c.iprelease')
    await rec('facilities', 'c.engrelease')
    await rec('facilities', 'c.hvac')
    await rec('foreman', 'c.barriers')
    expect(l.state().permits.p1.status).toBe('closing')
    await rec('ip', 'c.return')
    const s = l.state()
    expect(s.permits.p1.status).toBe('closed')
    await l.add('worker', 'item.unchecked', { checklistId: 'c1', itemId: 'd.clean', reason: 'x', photos: [] })
    expect(l.state().log.at(-1)!.ok).toBe(false)
  })
})

describe('missed days', () => {
  it('lists past days with no submitted walk', async () => {
    const { l, items } = await activeClass4Permit()
    await completeAll(l, 'c1', items)
    await l.add('worker', 'checklist.submitted', { checklistId: 'c1', signature: sig('worker') })
    const s = l.state()
    expect(missedDays(s, s.permits.p1, '2026-10-04')).toEqual(['2026-10-02', '2026-10-03'])
  })
})

describe('audit chain', () => {
  it('detects an edited event and a deleted one', async () => {
    const { l } = await activeClass4Permit()
    expect(await verifyChain(l.events)).toEqual([])
    const tampered = l.events.map((e) => (e.type === 'zone.created' ? ({ ...e, payload: { ...e.payload, name: 'Other' } } as AnyEvent) : e))
    expect((await verifyChain(tampered)).map((p) => p.problem)).toEqual(['Content does not match its hash (edited after signing)'])
    const missing = l.events.filter((e) => e.type !== 'zone.created')
    expect((await verifyChain(missing)).some((p) => p.problem.startsWith('Break in device chain'))).toBe(true)
  })
})
