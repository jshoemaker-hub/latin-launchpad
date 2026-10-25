import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ClassBadge, Pill } from '../components/ui'
import { ROMAN } from '../domain/templates'
import type { PermitState, ZoneState } from '../domain/reducer'
import { useProject } from '../state/project'

type GroupBy = 'floor' | 'phase' | 'zone' | 'status' | 'class'

const GROUPS: { id: GroupBy; label: string }[] = [
  { id: 'floor', label: 'Floor' },
  { id: 'phase', label: 'Phase' },
  { id: 'zone', label: 'Zone' },
  { id: 'status', label: 'Status' },
  { id: 'class', label: 'Class' },
]

const STATUS_ORDER = ['pending', 'active', 'closing', 'closed']

export default function Permits() {
  const { state, me, dispatch } = useProject()
  const base = `/p/${state.id}`
  const [groupBy, setGroupBy] = useState<GroupBy>(() => (localStorage.getItem('icra.groupBy') as GroupBy) || 'floor')
  const [query, setQuery] = useState('')
  const [showClosed, setShowClosed] = useState(false)
  const [addingZone, setAddingZone] = useState(false)
  const [zone, setZone] = useState({ name: '', floor: '', area: '', phase: '', trades: '' })
  const canManage = me && ['superintendent', 'ip', 'facilities', 'safety'].includes(me.role)

  const q = query.trim().toLowerCase()
  const permits = Object.values(state.permits).filter((p) => {
    if (!showClosed && p.status === 'closed') return false
    if (!q) return true
    const z = state.zones[p.zoneId]
    return [p.number, p.scope, z.name, z.area, z.trades, z.phase].join(' ').toLowerCase().includes(q)
  })

  const keyOf = (p: PermitState, z: ZoneState): string => {
    switch (groupBy) {
      case 'floor':
        return z.floor ? `Floor ${z.floor}` : 'No floor'
      case 'phase':
        return z.phase || 'No phase'
      case 'zone':
        return z.name
      case 'status':
        return p.status
      case 'class':
        return `Class ${ROMAN[p.cls]}`
    }
  }
  const groups = new Map<string, PermitState[]>()
  for (const p of permits) {
    const k = keyOf(p, state.zones[p.zoneId])
    groups.set(k, [...(groups.get(k) ?? []), p])
  }
  const sortedKeys = [...groups.keys()].sort((a, b) =>
    groupBy === 'status' ? STATUS_ORDER.indexOf(a) - STATUS_ORDER.indexOf(b) : a.localeCompare(b, undefined, { numeric: true }),
  )
  const emptyZones = Object.values(state.zones).filter((z) => !Object.values(state.permits).some((p) => p.zoneId === z.id))

  async function addZone(e: React.FormEvent) {
    e.preventDefault()
    await dispatch('zone.created', { zoneId: crypto.randomUUID(), ...zone })
    setZone({ name: '', floor: '', area: '', phase: '', trades: '' })
    setAddingZone(false)
  }

  return (
    <div className="page">
      <header className="page-head">
        <h1>Permits</h1>
        {canManage && (
          <Link className="btn-primary" to={`${base}/permits/new`}>
            + Permit
          </Link>
        )}
      </header>

      <div className="toolbar">
        <input className="grow" placeholder="Search permit, zone, trade…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <label className="inline">
          Group by
          <select
            value={groupBy}
            onChange={(e) => {
              setGroupBy(e.target.value as GroupBy)
              localStorage.setItem('icra.groupBy', e.target.value)
            }}
          >
            {GROUPS.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label}
              </option>
            ))}
          </select>
        </label>
        <label className="inline">
          <input type="checkbox" checked={showClosed} onChange={(e) => setShowClosed(e.target.checked)} /> Closed
        </label>
      </div>

      {sortedKeys.map((k) => (
        <section key={k}>
          <h2 className="group-head">{groupBy === 'status' ? <Pill status={k} /> : k}</h2>
          <ul className="list">
            {groups.get(k)!.map((p) => {
              const z = state.zones[p.zoneId]
              const issues = Object.values(state.deficiencies).filter((d) => d.permitId === p.id && !d.resolvedAt).length
              return (
                <li key={p.id}>
                  <Link className="list-item" to={`${base}/permit/${p.id}`}>
                    <div className="row">
                      <ClassBadge cls={p.cls} />
                      {p.ilsm && <span className="ilsm-tag">ILSM</span>}
                      <strong className="grow">{p.number}</strong>
                      <Pill status={p.status} />
                    </div>
                    <span>{z.name}</span>
                    <span className="small muted">
                      Floor {z.floor || '–'} · {z.phase || 'No phase'} · {z.trades || 'No trades listed'}
                      {issues > 0 && <b className="bad-text"> · {issues} open issue{issues > 1 ? 's' : ''}</b>}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
      {permits.length === 0 && <p className="empty">No permits match.</p>}

      <section>
        <h2>Zones without a permit</h2>
        <ul className="list">
          {emptyZones.map((z) => (
            <li key={z.id} className="list-item">
              <strong>{z.name}</strong>
              <span className="small muted">
                Floor {z.floor || '–'} · {z.phase || 'No phase'}
              </span>
              {canManage && (
                <Link className="btn-secondary" to={`${base}/permits/new?zone=${z.id}`}>
                  Open permit
                </Link>
              )}
            </li>
          ))}
          {emptyZones.length === 0 && <li className="empty">Every zone has a permit.</li>}
        </ul>
        {canManage &&
          (addingZone ? (
            <form className="card stack" onSubmit={addZone}>
              <h3>New zone</h3>
              <label className="field">
                Name
                <input required value={zone.name} onChange={(e) => setZone({ ...zone, name: e.target.value })} placeholder="e.g. 3 North rooms 301–308" />
              </label>
              <div className="grid-2">
                <label className="field">
                  Floor
                  <input value={zone.floor} onChange={(e) => setZone({ ...zone, floor: e.target.value })} />
                </label>
                <label className="field">
                  Area / wing
                  <input value={zone.area} onChange={(e) => setZone({ ...zone, area: e.target.value })} />
                </label>
                <label className="field">
                  Phase
                  <input value={zone.phase} onChange={(e) => setZone({ ...zone, phase: e.target.value })} />
                </label>
                <label className="field">
                  Trades
                  <input value={zone.trades} onChange={(e) => setZone({ ...zone, trades: e.target.value })} placeholder="Drywall, Electrical" />
                </label>
              </div>
              <div className="row-end">
                <button type="button" className="btn-ghost" onClick={() => setAddingZone(false)}>
                  Cancel
                </button>
                <button className="btn-primary">Add zone</button>
              </div>
            </form>
          ) : (
            <button className="btn-secondary btn-block" onClick={() => setAddingZone(true)}>
              + Add zone
            </button>
          ))}
      </section>
    </div>
  )
}
