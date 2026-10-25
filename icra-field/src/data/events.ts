import { hashEvent } from '../domain/hash'
import type { Actor, AnyEvent, EventPayloads, EventType, ProjectEvent } from '../domain/types'
import { getDeviceId } from './backend'

const chainKey = (projectId: string, deviceId: string) => `icra.chain.${projectId}.${deviceId}`

/**
 * Builds a signed event. Each device keeps a hash chain per project, so a missing or edited event
 * shows up when the chain is verified. Callers must commit (or drop) one event before building the next.
 */
export async function buildEvent<T extends EventType>(
  projectId: string,
  type: T,
  payload: EventPayloads[T],
  actor: Actor,
  opts: { clientTs?: string; deviceId?: string } = {},
): Promise<AnyEvent> {
  const deviceId = opts.deviceId ?? getDeviceId()
  const base = {
    id: crypto.randomUUID(),
    projectId,
    type,
    payload,
    actor,
    clientTs: opts.clientTs ?? new Date().toISOString(),
    deviceId,
    prevHash: localStorage.getItem(chainKey(projectId, deviceId)) ?? '',
  }
  return { ...base, hash: await hashEvent(base as Omit<ProjectEvent, 'hash'>) } as AnyEvent
}

/** Advances this device's chain once an event built by buildEvent is accepted and stored. */
export function commitChain(ev: AnyEvent) {
  localStorage.setItem(chainKey(ev.projectId, ev.deviceId), ev.hash)
}
