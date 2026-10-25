import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ClassBadge, Empty, Pill, SignDialog, SignatureView, fmtDate } from '../components/ui'
import Comments from '../components/Comments'
import { localYmd, missedDays } from '../domain/reducer'
import { ACTIVITY_TYPES, ILSM_MEASURES, RISK_GROUPS } from '../domain/templates'
import { HOSPITAL_ROLES, ROLE_LABEL, SUPERVISOR_ROLES } from '../domain/types'
import { startCloseout, startDailyWalk, todaysWalk } from '../state/actions'
import { useProject } from '../state/project'
import { ChangesDialog } from './HospitalDashboard'

export const PERMIT_SIGN_MEANING: Record<string, string> = {
  ip: 'I approve the ICRA class and the infection control measures on this permit.',
  facilities: 'I approve the HVAC isolation and building systems plan for this permit.',
  safety: 'I approve the ILSM assessment and the selected interim life safety measures.',
}

export default function Permit() {
  const { permitId } = useParams()
  const { state, me, dispatch } = useProject()
  const navigate = useNavigate()
  const [signing, setSigning] = useState(false)
  const [requesting, setRequesting] = useState(false)
  const [resubmitNote, setResubmitNote] = useState('')
  const permit = state.permits[permitId!]
  if (!permit) return <p className="page empty">Permit not found.</p>
  const base = `/p/${state.id}`
  const zone = state.zones[permit.zoneId]
  const today = localYmd()
  const checklists = permit.checklistIds.map((id) => state.checklists[id])
  const setup = checklists.filter((c) => c.kind === 'setup')
  const dailies = checklists.filter((c) => c.kind === 'daily').sort((a, b) => b.date.localeCompare(a.date))
  const closeout = checklists.find((c) => c.kind === 'closeout')
  const walk = todaysWalk(state, permit, today)
  const missed = permit.status === 'active' ? missedDays(state, permit, today) : []
  const mySignNeeded =
    me && permit.status === 'pending' && !permit.changesRequested && permit.requiredSigners.includes(me.role) && !permit.signatures.some((s) => s.role === me.role)
  const canResubmit = me && permit.changesRequested && (me.role === 'superintendent' || me.role === 'foreman')
  const canCloseout = me && permit.status === 'active' && (SUPERVISOR_ROLES.includes(me.role) || HOSPITAL_ROLES.includes(me.role))
  const issues = Object.values(state.deficiencies).filter((d) => d.permitId === permit.id && !d.resolvedAt)

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <div className="row">
            <ClassBadge cls={permit.cls} />
            {permit.ilsm && <span className="ilsm-tag">ILSM</span>}
            <Pill status={permit.status} />
          </div>
          <h1>Permit {permit.number}</h1>
          <p className="muted">{zone.name}</p>
        </div>
        <Link className="btn-secondary" to={`${base}/permit/${permit.id}/report`}>
          PDF
        </Link>
      </header>

      <section className="card">
        <p>{permit.scope}</p>
        <dl className="meta">
          <dt>Contractor</dt>
          <dd>{permit.contractor || state.contractor || '–'}</dd>
          <dt>Activity</dt>
          <dd>{ACTIVITY_TYPES.find((t) => t.id === permit.activityType)?.label}</dd>
          <dt>Risk group</dt>
          <dd>{RISK_GROUPS.find((r) => r.id === permit.riskGroup)?.label}</dd>
          {permit.specialHazards.length > 0 && (
            <>
              <dt>Hazards</dt>
              <dd>{permit.specialHazards.join(', ')}</dd>
            </>
          )}
          <dt>Dates</dt>
          <dd>
            {fmtDate(permit.startDate)} – {fmtDate(permit.endDate)}
          </dd>
          <dt>Location</dt>
          <dd>
            Floor {zone.floor || '–'} · {zone.area || '–'} · {zone.phase || '–'}
          </dd>
          {permit.pressurePoints.length > 0 && (
            <>
              <dt>Pressure</dt>
              <dd>
                At least {permit.pressureThreshold} in. w.c. negative at {permit.pressurePoints.join(', ')}
              </dd>
            </>
          )}
          <dt>Matrix</dt>
          <dd>{permit.matrixVersion}</dd>
        </dl>
      </section>

      {issues.length > 0 && (
        <Link to={`${base}/issues`} className="banner bad">
          ⚠ {issues.length} open issue{issues.length > 1 ? 's' : ''} on this permit
        </Link>
      )}

      <section>
        <h2>Approvals</h2>
        <ul className="list">
          {permit.requiredSigners.map((role) => {
            const sig = permit.signatures.find((s) => s.role === role)
            return (
              <li key={role} className="list-item">
                {sig ? <SignatureView sig={sig} /> : <span className="muted">Waiting on {ROLE_LABEL[role]}</span>}
              </li>
            )
          })}
        </ul>
        {permit.changesRequested && (
          <div className="banner bad">
            Changes requested by {permit.changesRequested.by.name} ({ROLE_LABEL[permit.changesRequested.by.role]}): {permit.changesRequested.note}
          </div>
        )}
        {canResubmit && (
          <form
            className="row"
            onSubmit={async (e) => {
              e.preventDefault()
              await dispatch('permit.resubmitted', { permitId: permit.id, note: resubmitNote.trim() })
              setResubmitNote('')
            }}
          >
            <input className="grow" placeholder="What did you change?" value={resubmitNote} onChange={(e) => setResubmitNote(e.target.value)} />
            <button className="btn-primary">Resubmit</button>
          </form>
        )}
        {mySignNeeded && (
          <div className="row">
            <button className="btn-primary grow" onClick={() => setSigning(true)}>
              Sign as {ROLE_LABEL[me.role]}
            </button>
            <button className="btn-secondary" onClick={() => setRequesting(true)}>
              Request changes
            </button>
          </div>
        )}
      </section>

      {permit.ilsm && (
        <section>
          <h2>Interim life safety measures</h2>
          <ul className="list compact">
            {ILSM_MEASURES.filter((m) => permit.ilsmMeasures.includes(m.id)).map((m) => (
              <li key={m.id}>
                <strong>{m.label}</strong> <span className="small muted">· {m.cadence}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2>Setup</h2>
        <ul className="list">
          {setup.map((c) => (
            <li key={c.id}>
              <Link className="list-item row" to={`${base}/c/${c.id}`}>
                <span className="grow">{c.title}</span>
                <Pill status={c.status} />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Daily barrier checks</h2>
        {missed.length > 0 && (
          <p className="warn-text">
            ⚠ Missed: {missed.map(fmtDate).join(', ')}
          </p>
        )}
        {permit.status === 'active' && !walk && me && me.role !== 'viewer' && (
          <button className="btn-primary btn-block" onClick={async () => navigate(`${base}/c/${await startDailyWalk(dispatch, permit, today)}`)}>
            Start today's check
          </button>
        )}
        {permit.status === 'pending' && <Empty>Daily checks start once all approvals are signed.</Empty>}
        <ul className="list">
          {dailies.map((c) => (
            <li key={c.id}>
              <Link className="list-item row" to={`${base}/c/${c.id}`}>
                <span className="grow">{fmtDate(c.date)}</span>
                <Pill status={c.status} />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Closeout</h2>
        {closeout ? (
          <Link className="list-item row" to={`${base}/c/${closeout.id}`}>
            <span className="grow">
              {closeout.items.filter((i) => i.status === 'complete').length}/{closeout.items.length} steps signed
            </span>
            <Pill status={permit.status === 'closed' ? 'closed' : 'in_progress'} />
          </Link>
        ) : canCloseout ? (
          <button
            className="btn-secondary btn-block"
            onClick={async () => {
              if (confirm('Start closeout? Daily checks stop and each closeout step must be signed in order by the listed role.'))
                navigate(`${base}/c/${await startCloseout(dispatch, permit, today)}`)
            }}
          >
            Start closeout
          </button>
        ) : (
          <Empty>Closeout starts when work in this zone is complete.</Empty>
        )}
      </section>

      <Comments permitId={permit.id} />

      {signing && me && (
        <SignDialog
          title={`Sign permit ${permit.number}`}
          meaning={PERMIT_SIGN_MEANING[me.role] ?? 'I approve this permit.'}
          role={me.role}
          defaultName={me.name}
          onSign={(signature) => dispatch('permit.signed', { permitId: permit.id, signature })}
          onClose={() => setSigning(false)}
        />
      )}
      {requesting && <ChangesDialog target={{ kind: 'permit', permit }} onClose={() => setRequesting(false)} />}
    </div>
  )
}
