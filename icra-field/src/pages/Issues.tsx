import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Empty, Pill, PhotoStrip, RoleTag, fmtDateTime } from '../components/ui'
import { deficiencyStatus } from '../domain/reducer'
import { useProject } from '../state/project'

const FILTERS = ['open', 'resolved', 'verified'] as const

export default function Issues() {
  const { state } = useProject()
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('open')
  const base = `/p/${state.id}`
  const all = Object.values(state.deficiencies).sort((a, b) => b.openedAt.localeCompare(a.openedAt))
  const shown = all.filter((d) => deficiencyStatus(d) === filter)

  return (
    <div className="page">
      <h1>Issues</h1>
      <p className="muted small">Every problem, uncheck and rework request. An issue closes when the item is fixed and the checklist is co-signed again.</p>
      <div className="segmented">
        {FILTERS.map((f) => (
          <button key={f} className={filter === f ? 'on' : ''} onClick={() => setFilter(f)}>
            {f === 'open' ? 'Open' : f === 'resolved' ? 'Fixed' : 'Verified'} ({all.filter((d) => deficiencyStatus(d) === f).length})
          </button>
        ))}
      </div>
      {shown.length === 0 && <Empty>Nothing here.</Empty>}
      <ul className="list">
        {shown.map((d) => {
          const permit = state.permits[d.permitId]
          return (
            <li key={d.id} className="card">
              <div className="row">
                <strong className="grow">{d.itemText}</strong>
                <Pill status={deficiencyStatus(d)} />
              </div>
              <div className="small">
                Permit {permit.number} · {state.zones[permit.zoneId].name}
              </div>
              <p>
                <strong>{d.kind === 'rework' ? 'Rework requested' : d.kind === 'uncheck' ? 'Unchecked' : 'Reported'}</strong>: {d.reason}
              </p>
              <PhotoStrip photos={d.photos} />
              <div className="small muted">
                {d.openedBy.name} <RoleTag role={d.openedBy.role} /> · {fmtDateTime(d.openedAt)}
              </div>
              {d.resolvedBy && (
                <div className="small muted">
                  Fixed by {d.resolvedBy.name} · {fmtDateTime(d.resolvedAt!)}
                </div>
              )}
              {d.verifiedBy && (
                <div className="small muted">
                  Verified by {d.verifiedBy.name} · {fmtDateTime(d.verifiedAt!)}
                </div>
              )}
              <Link className="btn-secondary" to={`${base}/c/${d.checklistId}`}>
                Open checklist
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
