import type { AnyEvent, Role } from '../domain/types'

export interface ProjectSummary {
  id: string
  name: string
  facility: string
}

/** Storage for a project's append-only event log and photo evidence. */
export interface Backend {
  mode: 'demo' | 'supabase'
  listProjects(): Promise<ProjectSummary[]>
  createProject(p: ProjectSummary): Promise<void>
  addMember(projectId: string, email: string, name: string, role: Role): Promise<void>
  loadEvents(projectId: string): Promise<AnyEvent[]>
  append(ev: AnyEvent): Promise<void>
  /** Calls back with events written elsewhere (another tab, device, or person). */
  subscribe(projectId: string, onEvent: (ev: AnyEvent) => void): () => void
  putPhoto(projectId: string, blob: Blob, sha256: string): Promise<string>
  photoUrl(key: string): Promise<string>
  /** Events and photos captured on this device and not yet synced. */
  pendingCount(): Promise<number>
  sync(): Promise<void>
}

export function getDeviceId(): string {
  let id = localStorage.getItem('icra.deviceId')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('icra.deviceId', id)
  }
  return id
}
