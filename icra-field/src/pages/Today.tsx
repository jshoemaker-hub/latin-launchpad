import { Link, useNavigate } from 'react-router-dom'
import { ClassBadge, Empty, checklistName, fmtDate } from '../components/ui'
import { checksDue, hoursOut, inbox, localYmd, missedDays, type PermitState } from '../domain/reducer'
import { ROMAN, SHUTDOWN_SYSTEMS } from '../domain/templates'
import { HOSPITAL_ROLES, ROLE_LABEL } from '../domain/types'
import { dueLabel, shortDate, todayStatus } from '../state/status'
import { startDailyWalk, todaysWalk } from '../state/actions'
import { useProject } from '../state/project'
import HospitalDashboard from './HospitalDashboard'

export default function Today() {
  const { me } = useProject()
  if (me && HOSPITAL_ROLES.includes(me.role)) return <HospitalDashboard />
  return <CrewToday />
}

function CrewToday() {
  const { state, me, dispatch } = useProject()
  const navigate = useNavigate()
  const today = localYmd()
  const base = `/p/${state.id}`
  const active = Object.values(state.permits).filter((p) => p.status === 'active' || p.status === 'closing')
  const due = checksDue(state, today)
  const pendingShutdowns = Object.values(state.shutdowns).filter((s) => s.status === 'pending' || s.status === 'changes_requested' || s.status === 'approved')
  const activeShutdowns = Object.values(state.shutdowns).filter((s) => s.status === 'active')
  const work = me ? inbox(state, me.role, me.id) : null
  const zoneName = (id: string) => state.zones[id]?.name ?? ''
  const canManage = me && ['superintendent', 'ip', 'facilities', 'safety'].includes(me.role)

  async function openCheck(p: PermitState) {
    const walk = todaysWalk(state, p, today)
    navigate(`${base}/c/${walk ? walk.id : await startDailyWalk(dispatch, p, today)}`)
  }

  const asks = work
    ? [
        ...work.permitChanges.map((p) => ({ key: `pc${p.id}`, to: `${base}/permit/${p.id}`, title: `Changes requested · ${p.number}`, sub: `${p.changesRequested!.by.name}: ${p.changesRequested!.note}`, tone: 'bad' })),
        ...work.rework.map((c) => ({ key: `rw${c.id}`, to: `${base}/c/${c.id}`, title: `Rework · ${checklistName(c)}`, sub: `${state.permits[c.permitId].number} · ${c.reworkNote ?? ''}`, tone: 'bad' })),
        ...work.shutdownChanges.map((s) => ({ key: `sc${s.id}`, to: `${base}/shutdowns`, title: 'Shutdown changes requested', sub: s.title, tone: 'bad' })),
        ...work.toCosign.map((c) => ({
          key: `cs${c.id}`,
          to: `${base}/c/${c.id}`,
          title: `Co-sign · ${checklistName(c)}`,
          sub: `${state.permits[c.permitId].number} · ${zoneName(state.permits[c.permitId].zoneId)} · by ${c.submitted?.name}`,
          tone: 'attention',
        })),
        ...work.closeoutSteps.map(({ checklist, item }) => ({ key: `co${checklist.id}`, to: `${base}/c/${checklist.id}`, title: `Closeout · ${item.text}`, sub: state.permits[checklist.permitId].number, tone: 'attention' })),
      ]
    : []

  return (
    <div className="page">
      <p className="eyebrow">
        {me ? ROLE_LABEL[me.role] : 'Viewer'} · {fmtDate(today)}
      </p>
      <h1>Today</h1>
      <div className="stats">
        <Link className="stat" to={`${base}/permits`}>
          <b>{active.length}</b>
          <span>Active permits</span>
        </Link>
        <div className={`stat ${due.length ? 'warn' : ''}`}>
          <b>{due.length}</b>
          <span>Checks due</span>
        </div>
        <Link className={`stat ${activeShutdowns.length ? 'bad' : ''}`} to={`${base}/shutdowns`}>
          <b>{activeShutdowns.length || pendingShutdowns.length}</b>
          <span>{activeShutdowns.length ? 'Systems out now' : 'Shutdowns pending'}</span>
        </Link>
      </div>

      {activeShutdowns.map((s) => {
        const h = hoursOut(s)
        const limit = SHUTDOWN_SYSTEMS.find((x) => x.id === s.system)?.fireWatchAfterHours
        return (
          <Link key={s.id} to={`${base}/shutdowns`} className="banner bad">
            ⚠ {s.title}: out of service {h.toFixed(1)} h{limit && h > limit ? ' · fire watch required' : ''}
          </Link>
        )
      })}

      <h2>Due now</h2>
      {due.length === 0 && <Empty>All of today's checks are logged.</Empty>}
      <ul className="list">
        {due.map((p) => {
          const walk = todaysWalk(state, p, today)
          return (
            <li key={p.id}>
              <button className="list-item due-row tap-row" onClick={() => openCheck(p)} disabled={!me || me.role === 'viewer'}>
                <span className="grow">
                  <b>Daily barrier check · {p.number}</b>
                  <br />
                  <span className="small muted">
                    {zoneName(p.zoneId)} · Class {ROMAN[p.cls]} · {walk ? 'in progress' : dueLabel(state, today)}
                  </span>
                </span>
                <span className="chev" aria-hidden>
                  ›
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      {asks.length > 0 && (
        <>
          <h2>Needs you</h2>
          <ul className="list">
            {asks.map((a) => (
              <li key={a.key}>
                <Link className={`list-item ${a.tone}`} to={a.to}>
                  <strong>{a.title}</strong>
                  <span className="small">{a.sub}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <h2>Active permits</h2>
      <ul className="list">
        {active.map((p) => {
          const st = todayStatus(state, p, today)
          const missed = p.status === 'active' ? missedDays(state, p, today).length : 0
          return (
            <li key={p.id}>
              <Link className="list-item due-row" to={`${base}/permit/${p.id}`}>
                <ClassBadge cls={p.cls} short />
                <span className="grow">
                  <b>{zoneName(p.zoneId)}</b>
                  <br />
                  <span className="small muted">
                    {p.number} · {p.contractor || state.contractor} · exp {shortDate(p.endDate)}
                    {missed > 0 && (
                      <b className="warn-text">
                        {' '}
                        · {missed} missed day{missed > 1 ? 's' : ''}
                      </b>
                    )}
                  </span>
                </span>
                <span className={`small ${st.tone}-text`} style={{ fontWeight: 600 }}>
                  {p.status === 'closing' ? 'Closeout' : st.text}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
      {active.length === 0 && <Empty>No active permits.</Empty>}

      {canManage && (
        <Link className="btn-primary btn-block" style={{ marginTop: 20 }} to={`${base}/permits/new`}>
          + New ICRA permit
        </Link>
      )}
    </div>
  )
}
