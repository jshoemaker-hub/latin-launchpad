import { get, set } from 'idb-keyval'
import { addDays, localYmd } from '../domain/reducer'
import { DEFAULT_SETTINGS, ILSM_MEASURES, CLOSEOUT_STEPS, computeClass, dailyItems, setupItems } from '../domain/templates'
import type { Actor, AnyEvent, EventPayloads, EventType, ItemTemplate, PhotoRef, Role, Signature } from '../domain/types'
import { buildEvent, commitChain } from './events'
import { demoBackend } from './demoBackend'
import { sha256Hex } from '../domain/hash'

export const DEMO_PERSONAS: Actor[] = [
  { id: 'demo-worker', name: 'Marco Diaz', email: 'marco@brightline.demo', role: 'worker' },
  { id: 'demo-foreman', name: 'Dana Brooks', email: 'dana@brightline.demo', role: 'foreman' },
  { id: 'demo-super', name: 'Sam Okafor', email: 'sam@brightline.demo', role: 'superintendent' },
  { id: 'demo-ip', name: 'Priya Shah', email: 'priya@mercy.demo', role: 'ip' },
  { id: 'demo-facilities', name: 'Lee Turner', email: 'lee@mercy.demo', role: 'facilities' },
  { id: 'demo-safety', name: 'Jordan Kim', email: 'jordan@mercy.demo', role: 'safety' },
]

const SEED_VERSION = 'demo-seed-v1'

/** Creates the demo project the first time demo mode runs in this browser. */
export async function ensureDemoSeed() {
  if ((await get('seedVersion')) === SEED_VERSION) return
  await seedDemoProject()
  await set('seedVersion', SEED_VERSION)
}

/** A stand-in photo drawn on a canvas, labelled so nobody mistakes it for real evidence. */
async function demoPhoto(projectId: string, label: string, when: string): Promise<PhotoRef> {
  const canvas = document.createElement('canvas')
  canvas.width = 640
  canvas.height = 480
  const g = canvas.getContext('2d')!
  const grad = g.createLinearGradient(0, 0, 640, 480)
  grad.addColorStop(0, '#5b6670')
  grad.addColorStop(1, '#2e353b')
  g.fillStyle = grad
  g.fillRect(0, 0, 640, 480)
  g.strokeStyle = '#f2c94c'
  g.lineWidth = 10
  g.strokeRect(40, 40, 560, 400)
  g.fillStyle = '#fff'
  g.font = 'bold 28px system-ui, sans-serif'
  g.fillText('DEMO PHOTO', 60, 100)
  g.font = '24px system-ui, sans-serif'
  wrap(g, label, 60, 160, 520, 32)
  g.font = '18px system-ui, sans-serif'
  g.fillText(new Date(when).toLocaleString(), 60, 420)
  const blob = await new Promise<Blob>((r) => canvas.toBlob((b) => r(b!), 'image/jpeg', 0.8))
  const sha256 = await sha256Hex(await blob.arrayBuffer())
  const key = await demoBackend.putPhoto(projectId, blob, sha256)
  return { key, sha256, capturedAt: when, width: 640, height: 480 }
}

function wrap(g: CanvasRenderingContext2D, text: string, x: number, y: number, max: number, lh: number) {
  let line = ''
  for (const word of text.split(' ')) {
    if (g.measureText(line + word).width > max) {
      g.fillText(line, x, y)
      line = ''
      y += lh
    }
    line += `${word} `
  }
  g.fillText(line, x, y)
}

function demoSignature(name: string): string {
  const canvas = document.createElement('canvas')
  canvas.width = 300
  canvas.height = 80
  const g = canvas.getContext('2d')!
  g.font = 'italic 34px "Segoe Script", "Brush Script MT", cursive'
  g.fillStyle = '#1a2b4c'
  g.fillText(name, 10, 52)
  return canvas.toDataURL('image/png')
}

async function seedDemoProject() {
  const projectId = crypto.randomUUID()
  const events: AnyEvent[] = []
  const persona = (role: Role) => DEMO_PERSONAS.find((p) => p.role === role)!
  const today = localYmd()
  const at = (daysAgo: number, hour: number, minute = 0) => {
    const d = new Date(`${addDays(today, -daysAgo)}T00:00:00`)
    d.setHours(hour, minute, Math.floor(Math.random() * 59))
    return d.toISOString()
  }
  const sig = (role: Role, meaning: string, when: string): Signature => ({ name: persona(role).name, role, meaning, image: demoSignature(persona(role).name), at: when })

  async function emit<T extends EventType>(role: Role, when: string, type: T, payload: EventPayloads[T]) {
    const ev = await buildEvent(projectId, type, payload, persona(role), { clientTs: when, deviceId: `demo-device-${role}` })
    commitChain(ev)
    events.push(ev)
  }

  async function walk(role: Role, daysAgo: number, startHour: number, checklistId: string, items: ItemTemplate[], overrides: Record<string, Partial<EventPayloads['item.recorded']>> = {}) {
    let minute = 0
    for (const item of items) {
      minute += 3
      const when = at(daysAgo, startHour, minute)
      const photos = item.photo === 'required' ? [await demoPhoto(projectId, item.text, when)] : []
      const reading = item.readingAt
        ? { value: 0.018, location: item.readingAt, method: 'gauge' as const, threshold: 0.01, pass: true }
        : undefined
      await emit(role, when, 'item.recorded', { checklistId, itemId: item.id, status: 'complete', note: '', photos, reading, ...overrides[item.id] })
    }
  }

  await emit('superintendent', at(10, 7), 'project.created', {
    name: 'Mercy General: 4 West Oncology Renovation',
    facility: 'Mercy General Hospital (demo)',
    owner: 'Mercy Health (demo)',
    contractor: 'Brightline Builders (demo)',
    settings: DEFAULT_SETTINGS,
  })
  for (const p of DEMO_PERSONAS.filter((p) => p.role !== 'superintendent')) {
    await emit('superintendent', at(10, 7, 5), 'member.added', { email: p.email, name: p.name, role: p.role })
  }

  const zones = [
    { zoneId: crypto.randomUUID(), name: '4 West patient rooms 401–410', floor: '4', area: '4 West', phase: 'Phase 1', trades: 'Demo, Drywall, Electrical, HVAC' },
    { zoneId: crypto.randomUUID(), name: '4 East corridor above-ceiling', floor: '4', area: '4 East', phase: 'Phase 1', trades: 'Electrical, Low voltage' },
    { zoneId: crypto.randomUUID(), name: '2nd floor admin offices', floor: '2', area: 'Admin', phase: 'Phase 2', trades: 'Painting, Flooring' },
    { zoneId: crypto.randomUUID(), name: 'Pharmacy clean room anteroom', floor: '1', area: 'Pharmacy', phase: 'Phase 1', trades: 'Plumbing, Drywall' },
  ]
  for (const z of zones) await emit('superintendent', at(10, 7, 10), 'zone.created', z)

  const ilsmMeasures = ILSM_MEASURES.filter((m) => m.daily || m.id === 'M12').map((m) => m.id)

  // P-101: Class V with ILSM, active for three days, one day missed, IP found a barrier gap after sign-off.
  const p101 = {
    permitId: crypto.randomUUID(), zoneId: zones[0].zoneId, number: 'P-101',
    scope: 'Full demolition and rebuild of patient rooms 401–410 on an occupied oncology floor.',
    activityType: 'D' as const, riskGroup: 'highest' as const, specialHazards: [],
    cls: computeClass(DEFAULT_SETTINGS.matrix, 'D', 'highest', []), matrixVersion: DEFAULT_SETTINGS.matrixVersion,
    ilsm: true, ilsmMeasures, pressurePoints: ['Anteroom entry', 'Corridor door 4W-12'], pressureThreshold: 0.01,
    startDate: addDays(today, -4), endDate: addDays(today, 60),
  }
  await emit('superintendent', at(5, 9), 'permit.created', p101)
  const setup101 = crypto.randomUUID()
  const setupItems101 = setupItems(p101.cls)
  await emit('superintendent', at(5, 9, 1), 'checklist.created', { checklistId: setup101, permitId: p101.permitId, kind: 'setup', date: addDays(today, -5), title: 'Pre-start setup verification', items: setupItems101 })
  await emit('ip', at(5, 11), 'permit.signed', { permitId: p101.permitId, signature: sig('ip', 'Approved ICRA class and controls', at(5, 11)) })
  await emit('facilities', at(5, 13), 'permit.signed', { permitId: p101.permitId, signature: sig('facilities', 'HVAC isolation plan approved', at(5, 13)) })
  await emit('safety', at(4, 7), 'permit.signed', { permitId: p101.permitId, signature: sig('safety', 'ILSM assessment approved', at(4, 7)) })
  await walk('foreman', 4, 7, setup101, setupItems101, { 's.hvac': { note: 'Confirmed with Lee Turner (facilities) at 7:20.' } })
  await emit('foreman', at(4, 9), 'checklist.submitted', { checklistId: setup101, signature: sig('foreman', 'Setup complete as recorded', at(4, 9)) })
  await emit('superintendent', at(4, 9, 30), 'checklist.cosigned', { checklistId: setup101, signature: sig('superintendent', 'Reviewed and approved', at(4, 9, 30)) })

  const daily101 = dailyItems(p101)
  const d4 = crypto.randomUUID()
  await emit('foreman', at(4, 15), 'checklist.created', { checklistId: d4, permitId: p101.permitId, kind: 'daily', date: addDays(today, -4), title: `Daily walk ${addDays(today, -4)}`, items: daily101 })
  await walk('foreman', 4, 15, d4, daily101)
  await emit('foreman', at(4, 17), 'checklist.submitted', { checklistId: d4, signature: sig('foreman', 'Daily walk complete as recorded', at(4, 17)) })
  await emit('superintendent', at(4, 17, 20), 'checklist.cosigned', { checklistId: d4, signature: sig('superintendent', 'Reviewed and approved', at(4, 17, 20)) })

  const d3 = crypto.randomUUID()
  await emit('worker', at(3, 7), 'checklist.created', { checklistId: d3, permitId: p101.permitId, kind: 'daily', date: addDays(today, -3), title: `Daily walk ${addDays(today, -3)}`, items: daily101 })
  await walk('worker', 3, 7, d3, daily101, {
    'p.1': { reading: { value: 0.006, location: 'Corridor door 4W-12', method: 'gauge', threshold: 0.01, pass: false }, note: 'Door seal pulled loose; reading low.' },
  })
  await emit('worker', at(3, 8, 30), 'item.recorded', {
    checklistId: d3, itemId: 'p.1', status: 'complete', note: 'Re-taped door seal; re-read after 10 min.',
    photos: [await demoPhoto(projectId, 'Pressure gauge after re-taping corridor door', at(3, 8, 30))],
    reading: { value: 0.015, location: 'Corridor door 4W-12', method: 'gauge', threshold: 0.01, pass: true },
  })
  await emit('worker', at(3, 9), 'checklist.submitted', { checklistId: d3, signature: sig('worker', 'Daily walk complete as recorded', at(3, 9)) })
  await emit('foreman', at(3, 10), 'checklist.cosigned', { checklistId: d3, signature: sig('foreman', 'Reviewed and approved', at(3, 10)) })
  await emit('ip', at(3, 14), 'item.unchecked', {
    checklistId: d3, itemId: 'd.barrier', reason: 'Gap at top of barrier above door 412 during IP round.',
    photos: [await demoPhoto(projectId, 'Gap at top of barrier above door 412', at(3, 14))],
  })
  await emit('ip', at(3, 14, 5), 'comment.added', { checklistId: d3, itemId: 'd.barrier', text: 'Please seal to deck and send a photo before end of shift.' })
  // Day -2 missed on purpose; day -1 walk submitted and waiting for co-sign.
  const d1 = crypto.randomUUID()
  await emit('worker', at(1, 7), 'checklist.created', { checklistId: d1, permitId: p101.permitId, kind: 'daily', date: addDays(today, -1), title: `Daily walk ${addDays(today, -1)}`, items: daily101 })
  await walk('worker', 1, 7, d1, daily101)
  await emit('worker', at(1, 9), 'checklist.submitted', { checklistId: d1, signature: sig('worker', 'Daily walk complete as recorded', at(1, 9)) })

  // P-102: Class IV, facilities signed, waiting on the IP.
  const p102 = {
    permitId: crypto.randomUUID(), zoneId: zones[1].zoneId, number: 'P-102',
    scope: 'Cable tray and low-voltage runs above ceiling, 4 East corridor, outside the ICU suite.',
    activityType: 'C' as const, riskGroup: 'high' as const, specialHazards: [],
    cls: computeClass(DEFAULT_SETTINGS.matrix, 'C', 'high', []), matrixVersion: DEFAULT_SETTINGS.matrixVersion,
    ilsm: false, ilsmMeasures: [], pressurePoints: ['Containment cube'], pressureThreshold: 0.01,
    startDate: addDays(today, 1), endDate: addDays(today, 14),
  }
  await emit('superintendent', at(1, 13), 'permit.created', p102)
  await emit('superintendent', at(1, 13, 1), 'checklist.created', { checklistId: crypto.randomUUID(), permitId: p102.permitId, kind: 'setup', date: addDays(today, -1), title: 'Pre-start setup verification', items: setupItems(p102.cls) })
  await emit('facilities', at(0, 8), 'permit.signed', { permitId: p102.permitId, signature: sig('facilities', 'HVAC isolation plan approved', at(0, 8)) })

  // P-103: Class II, today's walk half done.
  const p103 = {
    permitId: crypto.randomUUID(), zoneId: zones[2].zoneId, number: 'P-103',
    scope: 'Repaint and replace carpet in admin offices 210–218.',
    activityType: 'B' as const, riskGroup: 'low' as const, specialHazards: [],
    cls: computeClass(DEFAULT_SETTINGS.matrix, 'B', 'low', []), matrixVersion: DEFAULT_SETTINGS.matrixVersion,
    ilsm: false, ilsmMeasures: [], pressurePoints: [], pressureThreshold: 0.01,
    startDate: addDays(today, -1), endDate: addDays(today, 10),
  }
  await emit('superintendent', at(2, 10), 'permit.created', p103)
  await emit('facilities', at(2, 11), 'permit.signed', { permitId: p103.permitId, signature: sig('facilities', 'Approved', at(2, 11)) })
  const d103prev = crypto.randomUUID()
  const daily103 = dailyItems(p103)
  await emit('worker', at(1, 15), 'checklist.created', { checklistId: d103prev, permitId: p103.permitId, kind: 'daily', date: addDays(today, -1), title: `Daily walk ${addDays(today, -1)}`, items: daily103 })
  await walk('worker', 1, 15, d103prev, daily103)
  await emit('worker', at(1, 16), 'checklist.submitted', { checklistId: d103prev, signature: sig('worker', 'Daily walk complete as recorded', at(1, 16)) })
  await emit('superintendent', at(1, 16, 30), 'checklist.cosigned', { checklistId: d103prev, signature: sig('superintendent', 'Reviewed and approved', at(1, 16, 30)) })
  const d103 = crypto.randomUUID()
  await emit('worker', at(0, 7), 'checklist.created', { checklistId: d103, permitId: p103.permitId, kind: 'daily', date: today, title: `Daily walk ${today}`, items: daily103 })
  await walk('worker', 0, 7, d103, daily103.slice(0, 3))

  // P-104: Class IV, in closeout; next step is the EVS terminal clean (facilities).
  const p104 = {
    permitId: crypto.randomUUID(), zoneId: zones[3].zoneId, number: 'P-104',
    scope: 'Replace sink and casework in pharmacy clean room anteroom.',
    activityType: 'C' as const, riskGroup: 'high' as const, specialHazards: [],
    cls: computeClass(DEFAULT_SETTINGS.matrix, 'C', 'high', []), matrixVersion: DEFAULT_SETTINGS.matrixVersion,
    ilsm: false, ilsmMeasures: [], pressurePoints: ['Anteroom entry'], pressureThreshold: 0.01,
    startDate: addDays(today, -9), endDate: addDays(today, -1),
  }
  await emit('superintendent', at(9, 8), 'permit.created', p104)
  await emit('ip', at(9, 9), 'permit.signed', { permitId: p104.permitId, signature: sig('ip', 'Approved ICRA class and controls', at(9, 9)) })
  await emit('facilities', at(9, 10), 'permit.signed', { permitId: p104.permitId, signature: sig('facilities', 'HVAC isolation plan approved', at(9, 10)) })
  const daily104 = dailyItems(p104)
  for (let d = 9; d >= 2; d--) {
    const id = crypto.randomUUID()
    await emit('foreman', at(d, 7), 'checklist.created', { checklistId: id, permitId: p104.permitId, kind: 'daily', date: addDays(today, -d), title: `Daily walk ${addDays(today, -d)}`, items: daily104 })
    await walk('foreman', d, 7, id, daily104)
    await emit('foreman', at(d, 9), 'checklist.submitted', { checklistId: id, signature: sig('foreman', 'Daily walk complete as recorded', at(d, 9)) })
    await emit('superintendent', at(d, 10), 'checklist.cosigned', { checklistId: id, signature: sig('superintendent', 'Reviewed and approved', at(d, 10)) })
  }
  const close104 = crypto.randomUUID()
  await emit('superintendent', at(1, 10), 'checklist.created', { checklistId: close104, permitId: p104.permitId, kind: 'closeout', date: addDays(today, -1), title: 'Closeout', items: CLOSEOUT_STEPS })
  await walk('superintendent', 1, 11, close104, CLOSEOUT_STEPS.slice(0, 1))
  await walk('ip', 1, 14, close104, CLOSEOUT_STEPS.slice(1, 2))

  await demoBackend.createProject({ id: projectId, name: 'Mercy General: 4 West Oncology Renovation', facility: 'Mercy General Hospital (demo)' })
  await set(`events:${projectId}`, events)
}
