import type { AnyEvent, ProjectEvent } from './types'

/** JSON with object keys sorted, so the same event always hashes the same way. */
export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null'
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`
  const obj = value as Record<string, unknown>
  const keys = Object.keys(obj).filter((k) => obj[k] !== undefined).sort()
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalJson(obj[k])}`).join(',')}}`
}

export async function sha256Hex(data: string | ArrayBuffer): Promise<string> {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : new Uint8Array(data)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

// The actor's role is left out: in Supabase mode the server assigns it from project membership,
// so the client can't claim a role it doesn't have.
export function hashEvent(ev: Omit<ProjectEvent, 'hash'>): Promise<string> {
  const { id, projectId, type, payload, actor, clientTs, deviceId, prevHash } = ev
  return sha256Hex(
    canonicalJson({ id, projectId, type, payload, actor: { id: actor.id, name: actor.name, email: actor.email }, clientTs, deviceId, prevHash }),
  )
}

export interface ChainProblem {
  eventId: string
  problem: string
}

/**
 * Recomputes every hash and follows each device's chain by its links (not by timestamps, since
 * device clocks drift). Catches edited events and events removed from the middle of a chain.
 */
export async function verifyChain(events: AnyEvent[]): Promise<ChainProblem[]> {
  const problems: ChainProblem[] = []
  const hashes = new Set(events.map((e) => `${e.deviceId}:${e.hash}`))
  const successors = new Map<string, number>()
  for (const ev of events) {
    if ((await hashEvent(ev)) !== ev.hash) problems.push({ eventId: ev.id, problem: 'Content does not match its hash (edited after signing)' })
    const link = `${ev.deviceId}:${ev.prevHash}`
    if (ev.prevHash && !hashes.has(link)) problems.push({ eventId: ev.id, problem: 'Break in device chain (an earlier event from this device is missing)' })
    successors.set(link, (successors.get(link) ?? 0) + 1)
    if (successors.get(link) === 2) problems.push({ eventId: ev.id, problem: 'Break in device chain (two events claim the same predecessor)' })
  }
  return problems
}
