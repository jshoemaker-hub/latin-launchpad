import { useState } from 'react'
import { Empty, Pill, RoleTag, fmtDateTime } from '../components/ui'
import { hoursOut, type ShutdownState, type ShutdownStatus } from '../domain/reducer'
import { SHUTDOWN_SYSTEMS } from '../domain/templates'
import { HOSPITAL_ROLES, type ShutdownSystem } from '../domain/types'
import { useProject } from '../state/project'
import { ChangesDialog } from './HospitalDashboard'

const ORDER: ShutdownStatus[] = ['active', 'pending', 'changes_requested', 'approved', 'restored']
const HEADINGS: Record<ShutdownStatus, string> = {
  active: 'Out of service now',
  pending: 'Awaiting hospital approval',
  changes_requested: 'Changes requested',
  approved: 'Approved, not started',
  restored: 'Restored',
}

const toLocalInput = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 16)

export default function Shutdowns() {
  const { state, me } = useProject()
  const [creating, setCreating] = useState(false)
  const all = Object.values(state.shutdowns).sort((a, b) => a.start.localeCompare(b.start))

  return (
    <div className="page">
      <header className="page-head">
        <h1>Utility shutdowns</h1>
        {me && me.role !== 'viewer' && !creating && (
          <button className="btn-primary" onClick={() => setCreating(true)}>
            + Request
          </button>
        )}
      </header>
      <p className="small muted">
        Planned outages of building systems. Hospital staff approve before work starts. Fire alarm out more than 4 h, or sprinklers more than 10 h, in 24 h
        requires a fire watch or evacuation (CMS K-346 / K-354).
      </p>
      {creating && <RequestForm onDone={() => setCreating(false)} />}
      {ORDER.map((status) => {
        const list = all.filter((s) => s.status === status)
        if (list.length === 0) return null
        return (
          <section key={status}>
            <h2>{HEADINGS[status]}</h2>
            <ul className="list">
              {list.map((s) => (
                <ShutdownCard key={s.id} s={s} />
              ))}
            </ul>
          </section>
        )
      })}
      {all.length === 0 && !creating && <Empty>No shutdowns requested.</Empty>}
    </div>
  )
}

function ShutdownCard({ s }: { s: ShutdownState }) {
  const { state, me, dispatch } = useProject()
  const [changes, setChanges] = useState(false)
  const [note, setNote] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const sys = SHUTDOWN_SYSTEMS.find((x) => x.id === s.system)!
  const hospital = me && HOSPITAL_ROLES.includes(me.role)
  const canAct = me && me.role !== 'viewer'
  const plannedHours = (Date.parse(s.end) - Date.parse(s.start)) / 3_600_000
  const h = hoursOut(s)
  const limit = sys.fireWatchAfterHours
  const act = (fn: () => Promise<void>) => async () => {
    await fn()
    setNote('')
  }

  return (
    <li className="card">
      <div className="row">
        <span className="kind">{sys.label}</span>
        <Pill status={s.status === 'active' ? 'out_of_service' : s.status} />
      </div>
      <h3 style={{ marginTop: 8 }}>{s.title}</h3>
      <p className="small">
        {s.contractor} · planned {fmtDateTime(s.start)} – {fmtDateTime(s.end)} ({plannedHours.toFixed(1)} h)
        {s.zoneId && ` · ${state.zones[s.zoneId]?.name}`}
      </p>
      <dl className="meta">
        <dt>Affects</dt>
        <dd>{s.affectedAreas || '–'}</dd>
        <dt>Mitigation</dt>
        <dd>{s.mitigation || '–'}</dd>
      </dl>
      {limit && s.status !== 'restored' && plannedHours > limit && s.status !== 'active' && (
        <p className="warn-text small">Planned window is over {limit} h: fire watch and fire department notice will be required.</p>
      )}
      {s.status === 'active' && (
        <div className={`status-box ${limit && h > limit ? 'bad' : 'warn'}`} style={{ marginTop: 8 }}>
          Out of service {h.toFixed(1)} h{limit ? (h > limit ? ` · over ${limit} h: fire watch required now` : ` · fire watch required after ${limit} h`) : ''}
        </div>
      )}
      {s.status === 'restored' && (
        <p className="small muted">
          Out of service {h.toFixed(1)} h, restored {fmtDateTime(s.restoredAt!)}
        </p>
      )}

      <div className="row" style={{ marginTop: 10 }}>
        {s.status === 'pending' && hospital && (
          <>
            <button className="btn-primary" onClick={() => dispatch('shutdown.decided', { shutdownId: s.id, decision: 'approved', note: '' })}>
              Approve shutdown
            </button>
            <button className="btn-secondary" onClick={() => setChanges(true)}>
              Request changes
            </button>
          </>
        )}
        {s.status === 'changes_requested' && canAct && !hospital && (
          <>
            <input className="grow" placeholder="What changed?" value={note} onChange={(e) => setNote(e.target.value)} />
            <button className="btn-primary" onClick={act(() => dispatch('shutdown.resubmitted', { shutdownId: s.id, note: note.trim() }))}>
              Resubmit
            </button>
          </>
        )}
        {s.status === 'approved' && canAct && (
          <button className="btn-bad" onClick={() => confirm(`Take ${sys.label.toLowerCase()} out of service now?`) && dispatch('shutdown.started', { shutdownId: s.id })}>
            Take out of service now
          </button>
        )}
        {s.status === 'active' && canAct && (
          <>
            <input className="grow" placeholder="Restoration test / notes" value={note} onChange={(e) => setNote(e.target.value)} />
            <button className="btn-good" onClick={act(() => dispatch('shutdown.restored', { shutdownId: s.id, note: note.trim() }))}>
              Restored
            </button>
          </>
        )}
        <button className="btn-link" onClick={() => setShowHistory(!showHistory)}>
          History ({s.history.length})
        </button>
      </div>
      {showHistory && (
        <ol className="history">
          {s.history.map((h, i) => (
            <li key={i}>
              <span className="muted small">{fmtDateTime(h.at)}</span> <strong>{h.actor.name}</strong> <RoleTag role={h.actor.role} /> {h.text}
            </li>
          ))}
        </ol>
      )}
      {changes && <ChangesDialog target={{ kind: 'shutdown', shutdown: s }} onClose={() => setChanges(false)} />}
    </li>
  )
}

function RequestForm({ onDone }: { onDone(): void }) {
  const { state, dispatch } = useProject()
  const tonight = new Date()
  tonight.setHours(22, 0, 0, 0)
  const [f, setF] = useState({
    system: 'medical_gas' as ShutdownSystem,
    title: '',
    zoneId: '',
    contractor: state.contractor,
    start: toLocalInput(tonight),
    end: toLocalInput(new Date(tonight.getTime() + 4 * 3_600_000)),
    affectedAreas: '',
    mitigation: '',
  })
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await dispatch('shutdown.requested', {
        shutdownId: crypto.randomUUID(),
        system: f.system,
        title: f.title.trim(),
        zoneId: f.zoneId || undefined,
        contractor: f.contractor.trim(),
        start: new Date(f.start).toISOString(),
        end: new Date(f.end).toISOString(),
        affectedAreas: f.affectedAreas.trim(),
        mitigation: f.mitigation.trim(),
      })
      onDone()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const limit = SHUTDOWN_SYSTEMS.find((x) => x.id === f.system)?.fireWatchAfterHours
  return (
    <form className="card stack" onSubmit={submit}>
      <h2 style={{ margin: 0 }}>Request a shutdown</h2>
      <div className="grid-2">
        <label className="field">
          System
          <select value={f.system} onChange={(e) => setF({ ...f, system: e.target.value as ShutdownSystem })}>
            {SHUTDOWN_SYSTEMS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Zone (optional)
          <select value={f.zoneId} onChange={(e) => setF({ ...f, zoneId: e.target.value })}>
            <option value="">–</option>
            {Object.values(state.zones).map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="field">
        What's being shut down
        <input required value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="e.g. Medical gas zone valve, 4 West" />
      </label>
      <label className="field">
        Contractor
        <input value={f.contractor} onChange={(e) => setF({ ...f, contractor: e.target.value })} />
      </label>
      <div className="grid-2">
        <label className="field">
          Start
          <input type="datetime-local" value={f.start} onChange={(e) => setF({ ...f, start: e.target.value })} />
        </label>
        <label className="field">
          End
          <input type="datetime-local" value={f.end} onChange={(e) => setF({ ...f, end: e.target.value })} />
        </label>
      </div>
      <label className="field">
        Rooms / areas affected
        <input value={f.affectedAreas} onChange={(e) => setF({ ...f, affectedAreas: e.target.value })} placeholder="e.g. Rooms 410–424" />
      </label>
      <label className="field">
        Mitigation
        <textarea rows={2} value={f.mitigation} onChange={(e) => setF({ ...f, mitigation: e.target.value })} placeholder="e.g. Portable O2 staged, nursing notified" />
      </label>
      {limit && <p className="small warn-text">Over {limit} h out of service in 24 h requires a fire watch and fire department notice.</p>}
      {error && <p className="error">{error}</p>}
      <div className="row-end">
        <button type="button" className="btn-ghost" onClick={onDone}>
          Cancel
        </button>
        <button className="btn-primary">Send to hospital</button>
      </div>
    </form>
  )
}
