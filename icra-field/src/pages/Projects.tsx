import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { ProjectSummary } from '../data/backend'
import { buildEvent, commitChain } from '../data/events'
import { DEFAULT_SETTINGS } from '../domain/templates'
import { supabaseConfigured, useApp } from '../state/app'

export default function Projects() {
  const { backend, mode, user, persona, setMode, signOut } = useApp()
  const navigate = useNavigate()
  const [projects, setProjects] = useState<ProjectSummary[] | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ name: '', facility: '', owner: '', contractor: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    backend.listProjects().then(setProjects, (e) => setError(e.message))
  }, [backend])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setError('')
    try {
      const id = crypto.randomUUID()
      await backend.createProject({ id, name: form.name, facility: form.facility })
      const actor = persona ?? { ...user, role: 'superintendent' as const }
      const ev = await buildEvent(id, 'project.created', { ...form, settings: DEFAULT_SETTINGS }, actor)
      commitChain(ev)
      await backend.append(ev)
      navigate(`/p/${id}/permits`)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <div className="page narrow">
      <header className="page-head">
        <h1>Projects</h1>
        {mode === 'supabase' ? (
          <button className="btn-ghost" onClick={signOut}>
            Sign out
          </button>
        ) : (
          supabaseConfigured && (
            <button className="btn-ghost" onClick={() => setMode('supabase')}>
              Leave demo
            </button>
          )
        )}
      </header>
      {mode === 'supabase' && <p className="muted">Signed in as {user?.email}</p>}
      {error && <p className="error">{error}</p>}
      {projects === null ? (
        <p className="muted">Loading…</p>
      ) : (
        <ul className="list">
          {projects.map((p) => (
            <li key={p.id}>
              <Link className="list-item" to={`/p/${p.id}`}>
                <strong>{p.name}</strong>
                <span className="muted small">{p.facility}</span>
              </Link>
            </li>
          ))}
          {projects.length === 0 && <li className="empty">No projects yet. Create one, or ask your superintendent to add your email to theirs.</li>}
        </ul>
      )}
      {creating ? (
        <form className="card stack" onSubmit={create}>
          <h2>New project</h2>
          <label className="field">
            Project name
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. 3 North ICU Renovation" />
          </label>
          <label className="field">
            Hospital / facility
            <input required value={form.facility} onChange={(e) => setForm({ ...form, facility: e.target.value })} />
          </label>
          <label className="field">
            Owner
            <input value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} />
          </label>
          <label className="field">
            General contractor
            <input value={form.contractor} onChange={(e) => setForm({ ...form, contractor: e.target.value })} />
          </label>
          <div className="row-end">
            <button type="button" className="btn-ghost" onClick={() => setCreating(false)}>
              Cancel
            </button>
            <button className="btn-primary">Create project</button>
          </div>
        </form>
      ) : (
        <button className="btn-primary btn-block" onClick={() => setCreating(true)}>
          + New project
        </button>
      )}
    </div>
  )
}
