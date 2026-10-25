import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { get, set } from 'idb-keyval'
import type { AnyEvent } from '../domain/types'
import type { Backend } from './backend'

interface EventRow {
  id: string
  project_id: string
  type: string
  payload: unknown
  actor_id: string
  actor_name: string
  actor_email: string
  actor_role: string
  client_ts: string
  server_ts: string | null
  device_id: string
  prev_hash: string
  hash: string
}

const toRow = (ev: AnyEvent): Omit<EventRow, 'server_ts'> => ({
  id: ev.id,
  project_id: ev.projectId,
  type: ev.type,
  payload: ev.payload,
  actor_id: ev.actor.id,
  actor_name: ev.actor.name,
  actor_email: ev.actor.email,
  actor_role: ev.actor.role,
  client_ts: ev.clientTs,
  device_id: ev.deviceId,
  prev_hash: ev.prevHash,
  hash: ev.hash,
})

const fromRow = (r: EventRow): AnyEvent =>
  ({
    id: r.id,
    projectId: r.project_id,
    type: r.type,
    payload: r.payload,
    actor: { id: r.actor_id, name: r.actor_name, email: r.actor_email, role: r.actor_role },
    clientTs: new Date(r.client_ts).toISOString(),
    serverTs: r.server_ts ?? undefined,
    deviceId: r.device_id,
    prevHash: r.prev_hash,
    hash: r.hash,
  }) as AnyEvent

// Events and photos go to an on-device outbox first, so work captured with no signal
// (basements, stairwells, mechanical rooms) is never lost and syncs when the phone reconnects.
const OUTBOX = 'outbox:events'
const PHOTO_QUEUE = 'outbox:photos'
const REJECTED = 'outbox:rejected'

export function createSupabaseBackend(url: string, anonKey: string): Backend & { client: SupabaseClient } {
  const client = createClient(url, anonKey)
  const urlCache = new Map<string, string>()
  let flushing: Promise<void> | null = null

  async function flushOnce() {
    const photos = (await get<string[]>(PHOTO_QUEUE)) ?? []
    for (const key of photos) {
      const blob = await get<Blob>(`photo:${key}`)
      if (blob) {
        const { error } = await client.storage.from('evidence').upload(key, blob, { contentType: 'image/jpeg', upsert: false })
        if (error && !/exists|duplicate/i.test(error.message)) throw error
      }
      await set(PHOTO_QUEUE, ((await get<string[]>(PHOTO_QUEUE)) ?? []).filter((k) => k !== key))
    }
    const events = (await get<AnyEvent[]>(OUTBOX)) ?? []
    for (const ev of events) {
      const { error } = await client.from('events').upsert(toRow(ev), { onConflict: 'id', ignoreDuplicates: true })
      if (error) {
        // A permission or rule rejection will never succeed on retry; set it aside so it doesn't block the queue.
        if (!/^(42501|23|P0001)/.test(error.code ?? '')) throw error
        console.error('Server rejected event', ev, error)
        await set(REJECTED, [...((await get<AnyEvent[]>(REJECTED)) ?? []), ev])
      }
      await set(OUTBOX, ((await get<AnyEvent[]>(OUTBOX)) ?? []).filter((e) => e.id !== ev.id))
    }
  }

  const backend: Backend & { client: SupabaseClient } = {
    mode: 'supabase',
    client,

    async listProjects() {
      const { data, error } = await client.from('projects').select('id, name, facility').order('created_at')
      if (error) throw error
      return data
    },

    async createProject(p) {
      const { error } = await client.from('projects').insert(p)
      if (error) throw error
    },

    async addMember(projectId, email, name, role) {
      const { error } = await client.from('project_members').insert({ project_id: projectId, email: email.toLowerCase(), name, role })
      if (error) throw error
    },

    async loadEvents(projectId) {
      const pending = ((await get<AnyEvent[]>(OUTBOX)) ?? []).filter((e) => e.projectId === projectId).map((e) => ({ ...e, pending: true }))
      try {
        const { data, error } = await client.from('events').select('*').eq('project_id', projectId).order('client_ts')
        if (error) throw error
        const remote = (data as EventRow[]).map(fromRow)
        await set(`cache:${projectId}`, remote)
        const seen = new Set(remote.map((e) => e.id))
        return [...remote, ...pending.filter((e) => !seen.has(e.id))]
      } catch {
        const cached = (await get<AnyEvent[]>(`cache:${projectId}`)) ?? []
        return [...cached, ...pending]
      }
    },

    async append(ev) {
      await set(OUTBOX, [...((await get<AnyEvent[]>(OUTBOX)) ?? []), ev])
      void backend.sync()
    },

    subscribe(projectId, onEvent) {
      const ch = client
        .channel(`events:${projectId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'events', filter: `project_id=eq.${projectId}` }, (msg) =>
          onEvent(fromRow(msg.new as EventRow)),
        )
        .subscribe()
      return () => void client.removeChannel(ch)
    },

    async putPhoto(projectId, blob, sha256) {
      const key = `${projectId}/${sha256}.jpg`
      await set(`photo:${key}`, blob)
      await set(PHOTO_QUEUE, [...((await get<string[]>(PHOTO_QUEUE)) ?? []), key])
      return key
    },

    async photoUrl(key) {
      const cached = urlCache.get(key)
      if (cached) return cached
      const blob = await get<Blob>(`photo:${key}`)
      let out = ''
      if (blob) out = URL.createObjectURL(blob)
      else {
        const { data } = await client.storage.from('evidence').createSignedUrl(key, 60 * 60)
        out = data?.signedUrl ?? ''
      }
      if (out) urlCache.set(key, out)
      return out
    },

    async pendingCount() {
      return ((await get<AnyEvent[]>(OUTBOX)) ?? []).length + ((await get<string[]>(PHOTO_QUEUE)) ?? []).length
    },

    async sync() {
      if (!navigator.onLine) return
      if (!flushing) {
        flushing = flushOnce()
          .catch((e) => console.warn('Sync failed, will retry', e))
          .finally(() => {
            flushing = null
          })
      }
      await flushing
    },
  }

  window.addEventListener('online', () => void backend.sync())
  setInterval(() => void backend.sync(), 30_000)
  return backend
}
