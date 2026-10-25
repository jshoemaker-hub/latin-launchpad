import { Link, useNavigate } from 'react-router-dom'
import { ClassBadge, Empty, Pill, checklistName, fmtDate } from '../components/ui'
import { inbox, localYmd, missedDays } from '../domain/reducer'
import { ROLE_LABEL } from '../domain/types'
import { startDailyWalk, todaysWalk } from '../state/actions'
import { useProject } from '../state/project'

export default function Today() {
  const { state, me, dispatch } = useProject()
  const navigate = useNavigate()
  const today = localYmd()
  const base = `/p/${state.id}`
  const active = Object.values(state.permits).filter((p) => p.status === 'active')
  const work = me ? inbox(state, me.role, me.id) : null
  const zoneName = (id: string) => state.zones[id]?.name ?? ''
  const permitLabel = (id: string) => {
    const p = state.permits[id]
    return `${p.number} · ${zoneName(p.zoneId)}`
  }
  const needsCount = work ? work.permitsToSign.length + work.toCosign.length + work.rework.length + work.closeoutSteps.length : 0

  return (
    <div className="page">
      <h1>Today</h1>
      <p className="muted">{fmtDate(today)}</p>

      {me && (
        <section>
          <h2>
            Needs you <span className="muted small">as {ROLE_LABEL[me.role]}</span>
          </h2>
          {needsCount === 0 && <Empty>Nothing waiting on you right now.</Empty>}
          <ul className="list">
            {work!.permitsToSign.map((p) => (
              <li key={p.id}>
                <Link className="list-item attention" to={`${base}/permit/${p.id}`}>
                  <strong>Sign permit {p.number}</strong>
                  <span className="small">{zoneName(p.zoneId)}</span>
                </Link>
              </li>
            ))}
            {work!.toCosign.map((c) => (
              <li key={c.id}>
                <Link className="list-item attention" to={`${base}/c/${c.id}`}>
                  <strong>Co-sign {checklistName(c)}</strong>
                  <span className="small">
                    {permitLabel(c.permitId)} · submitted by {c.submitted?.name}
                  </span>
                </Link>
              </li>
            ))}
            {work!.rework.map((c) => (
              <li key={c.id}>
                <Link className="list-item bad" to={`${base}/c/${c.id}`}>
                  <strong>Rework: {checklistName(c)}</strong>
                  <span className="small">
                    {permitLabel(c.permitId)} · {c.reworkNote}
                  </span>
                </Link>
              </li>
            ))}
            {work!.closeoutSteps.map(({ checklist, item }) => (
              <li key={checklist.id}>
                <Link className="list-item attention" to={`${base}/c/${checklist.id}`}>
                  <strong>Closeout step: {item.text}</strong>
                  <span className="small">{permitLabel(checklist.permitId)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2>Today's walks</h2>
        {active.length === 0 && <Empty>No active permits. Open one under Permits.</Empty>}
        <ul className="list">
          {active.map((p) => {
            const walk = todaysWalk(state, p, today)
            const missed = missedDays(state, p, today)
            const done = walk ? walk.items.filter((i) => i.status !== 'open').length : 0
            return (
              <li key={p.id} className="card walk-card">
                <div className="row">
                  <ClassBadge cls={p.cls} />
                  {p.ilsm && <span className="ilsm-tag">ILSM</span>}
                  <strong className="grow">
                    <Link to={`${base}/permit/${p.id}`}>{p.number}</Link> · {zoneName(p.zoneId)}
                  </strong>
                </div>
                {missed.length > 0 && (
                  <p className="warn-text small">
                    ⚠ No walk recorded for {missed.length} day{missed.length > 1 ? 's' : ''}: {missed.map(fmtDate).join(', ')}
                  </p>
                )}
                {walk ? (
                  <div className="row">
                    <Pill status={walk.status} />
                    <span className="small muted grow">
                      {done}/{walk.items.length} items
                    </span>
                    <Link className="btn-primary" to={`${base}/c/${walk.id}`}>
                      {walk.status === 'in_progress' ? 'Continue' : 'Open'}
                    </Link>
                  </div>
                ) : (
                  me &&
                  me.role !== 'viewer' && (
                    <button
                      className="btn-primary btn-block"
                      onClick={async () => navigate(`${base}/c/${await startDailyWalk(dispatch, p, today)}`)}
                    >
                      Start today's walk
                    </button>
                  )
                )}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
