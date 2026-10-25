import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RoleTag } from '../components/ui'
import { ROLE_LABEL, ROLES, type Role } from '../domain/types'
import { useApp } from '../state/app'
import { useProject } from '../state/project'

export default function Team() {
  const { state, me, dispatch } = useProject()
  const { backend, mode } = useApp()
  const [form, setForm] = useState({ email: '', name: '', role: 'worker' as Role })
  const [error, setError] = useState('')
  const [saved, setSaved] = useState('')
  const canAdd = me && ['superintendent', 'ip', 'facilities', 'safety'].includes(me.role)

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaved('')
    try {
      const email = form.email.trim().toLowerCase()
      await backend.addMember(state.id, email, form.name.trim(), form.role)
      await dispatch('member.added', { email, name: form.name.trim(), role: form.role })
      setSaved(mode === 'supabase' ? `Added. ${form.name} can now sign in at ${location.origin} with ${email}.` : 'Added.')
      setForm({ email: '', name: '', role: 'worker' })
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <div className="page">
      <header className="page-head">
        <h1>Team</h1>
        <Link className="btn-secondary" to={`/p/${state.id}/settings`}>
          Settings
        </Link>
      </header>
      <dl className="meta card">
        <dt>Facility</dt>
        <dd>{state.facility}</dd>
        <dt>Owner</dt>
        <dd>{state.owner || '–'}</dd>
        <dt>Contractor</dt>
        <dd>{state.contractor || '–'}</dd>
      </dl>
      <ul className="list">
        {state.members.map((m) => (
          <li key={m.email} className="list-item">
            <div className="row">
              <strong className="grow">{m.name}</strong>
              <RoleTag role={m.role} />
            </div>
            <span className="small muted">{m.email}</span>
          </li>
        ))}
      </ul>
      {canAdd && (
        <form className="card stack" onSubmit={add}>
          <h2>Add someone</h2>
          <label className="field">
            Name
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="field">
            Email
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label className="field">
            Role
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABEL[r]}
                </option>
              ))}
            </select>
          </label>
          {error && <p className="error">{error}</p>}
          {saved && <p className="good-text">{saved}</p>}
          <button className="btn-primary">Add to project</button>
        </form>
      )}
    </div>
  )
}
