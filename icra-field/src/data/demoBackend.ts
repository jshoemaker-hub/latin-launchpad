import { get, set } from 'idb-keyval'
import type { AnyEvent } from '../domain/types'
import type { Backend, ProjectSummary } from './backend'

// Demo mode keeps everything in this browser's IndexedDB. Other tabs on the same browser
// see changes live, so two tabs can play worker and supervisor side by side.
const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('icra-field') : null
const urlCache = new Map<string, string>()

export const demoBackend: Backend = {
  mode: 'demo',

  async listProjects() {
    return (await get<ProjectSummary[]>('projects')) ?? []
  },

  async createProject(p) {
    const list = (await get<ProjectSummary[]>('projects')) ?? []
    await set('projects', [...list, p])
  },

  async addMember() {
    // Membership lives in the event log in demo mode.
  },

  async loadEvents(projectId) {
    return (await get<AnyEvent[]>(`events:${projectId}`)) ?? []
  },

  async append(ev) {
    const list = (await get<AnyEvent[]>(`events:${ev.projectId}`)) ?? []
    await set(`events:${ev.projectId}`, [...list, ev])
    channel?.postMessage(ev)
  },

  subscribe(projectId, onEvent) {
    if (!channel) return () => {}
    const handler = (m: MessageEvent<AnyEvent>) => {
      if (m.data.projectId === projectId) onEvent(m.data)
    }
    channel.addEventListener('message', handler)
    return () => channel.removeEventListener('message', handler)
  },

  async putPhoto(projectId, blob, sha256) {
    const key = `${projectId}/${sha256}.jpg`
    await set(`photo:${key}`, blob)
    return key
  },

  async photoUrl(key) {
    const cached = urlCache.get(key)
    if (cached) return cached
    const blob = await get<Blob>(`photo:${key}`)
    if (!blob) return ''
    const url = URL.createObjectURL(blob)
    urlCache.set(key, url)
    return url
  },

  async pendingCount() {
    return 0
  },

  async sync() {},
}

