import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ClassBadge, Modal, SignDialog, fmtDate, fmtDateTime } from '../components/ui'
import { checksDue, inbox, localYmd, type PermitState, type ShutdownState } from '../domain/reducer'
import { ACTIVITY_TYPES, RISK_GROUPS, SHUTDOWN_SYSTEMS } from '../domain/templates'
import { ROLE_LABEL } from '../domain/types'
import { useProject } from '../state/project'
import { PERMIT_SIGN_MEANING } from './Permit'
import { shortDate, todayStatus } from '../state/status'

/** Desktop-first view for infection prevention, facilities and safety, after the superintendent's mockup. */
export default function HospitalDashboard() {
  const { state, me, dispatch } = useProject()
  const [signing, setSigning] = useState<PermitState | null>(null)
  const [changes, setChanges] = useState<{ kind: 'permit'; permit: PermitState } | { kind: 'shutdown'; shutdown: ShutdownState } | null>(null)
  const today = localYmd()
  const base = `/p/${state.id}`
  const active = Object.values(state.permits).filter((p) => p.status === 'active')
  const contractors = new Set(active.map((p) => p.contractor || state.contractor))
  const due = checksDue(state, today)
  const work = inbox(state, me!.role, me!.id)
  const outOfRange = Object.values(state.deficiencies).filter(
    (d) => !d.resolvedAt && state.checklists[d.checklistId].items.some((i) => i.id === d.itemId && i.readingAt),
  )
  const openIssues = Object.values(state.deficiencies).filter((d) => !d.resolvedAt && !outOfRange.includes(d))
  const awaiting = work.permitsToSign.length + work.shutdownsToDecide.length
  const zoneName = (id?: string) => (id ? state.zones[id]?.name ?? '' : '')
  const dueBy = state.settings.checkDueTime ?? '12:00'

  return (
    <div className="page">
      <p className="eyebrow">
        {state.facility} · {ROLE_LABEL[me!.role]}
      </p>
      <h1>Construction activity · {fmtDate(today)}</h1>

      <div className="stats four">
        <div className="stat">
          <span>Active permits</span>
          <b>{active.length}</b>
          <span>
            {contractors.size} contractor{contractors.size === 1 ? '' : 's'}
          </span>
        </div>
        <div className={`stat ${due.length ? 'warn' : ''}`}>
          <span>Daily checks logged</span>
          <b>
            {active.length - due.length} of {active.length}
          </b>
          <span>
            {due.length} due by {dueBy === '12:00' ? 'noon' : dueBy}
          </span>
        </div>
        <Link className={`stat ${outOfRange.length ? 'bad' : ''}`} to={`${base}/issues`}>
          <span>Out of range</span>
          <b>{outOfRange.length}</b>
          <span>{outOfRange[0] ? `Pressure, ${zoneName(state.permits[outOfRange[0].permitId].zoneId)}` : 'All readings in range'}</span>
        </Link>
        <div className="stat">
          <span>Awaiting your sign-off</span>
          <b>{awaiting}</b>
          <span>
            {work.permitsToSign.length} permit{work.permitsToSign.length === 1 ? '' : 's'} · {work.shutdownsToDecide.length} shutdown
            {work.shutdownsToDecide.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      <h2>Needs your attention</h2>
      <div className="agrid">
        {work.permitsToSign.map((p) => (
          <article key={p.id} className="card ask">
            <div className="row" style={{ gap: 8 }}>
              <span className="kind">Permit to sign</span>
              <ClassBadge cls={p.cls} short />
              {p.ilsm && <span className="ilsm-tag">ILSM</span>}
            </div>
            <h3>
              {p.number} · {zoneName(p.zoneId)}
            </h3>
            <p>
              {p.contractor || state.contractor} · {ACTIVITY_TYPES.find((t) => t.id === p.activityType)?.label} next to{' '}
              {RISK_GROUPS.find((r) => r.id === p.riskGroup)?.label}-risk area. {p.scope} Starts {fmtDate(p.startDate)}.
            </p>
            <div className="row">
              <button className="btn-primary" onClick={() => setSigning(p)}>
                Sign permit
              </button>
              <button className="btn-secondary" onClick={() => setChanges({ kind: 'permit', permit: p })}>
                Request changes
              </button>
              <Link className="btn-link" to={`${base}/permit/${p.id}`}>
                Details
              </Link>
            </div>
          </article>
        ))}
        {work.shutdownsToDecide.map((s) => (
          <article key={s.id} className="card ask">
            <div className="row" style={{ gap: 8 }}>
              <span className="kind">Utility shutdown</span>
              <span className="ilsm-tag">{SHUTDOWN_SYSTEMS.find((x) => x.id === s.system)?.label}</span>
            </div>
            <h3>{s.title}</h3>
            <p>
              {s.contractor} · {fmtDateTime(s.start)} – {fmtDateTime(s.end)}. Affects {s.affectedAreas || 'not stated'}. {s.mitigation}
            </p>
            <div className="row">
              <button className="btn-primary" onClick={() => dispatch('shutdown.decided', { shutdownId: s.id, decision: 'approved', note: '' })}>
                Approve shutdown
              </button>
              <button className="btn-secondary" onClick={() => setChanges({ kind: 'shutdown', shutdown: s })}>
                Request changes
              </button>
            </div>
          </article>
        ))}
        {outOfRange.map((d) => {
          const p = state.permits[d.permitId]
          const item = state.checklists[d.checklistId].items.find((i) => i.id === d.itemId)!
          return (
            <article key={d.id} className="card ask" style={{ borderColor: '#f0b394' }}>
              <div className="row" style={{ gap: 8 }}>
                <span className="pill pill-bad">Deficiency</span>
                <ClassBadge cls={p.cls} short />
              </div>
              <h3>
                {zoneName(p.zoneId)} · pressure −{item.reading?.value.toFixed(3) ?? '?'}
              </h3>
              <p>
                {d.openedBy.name} ({p.contractor || state.contractor}) logged at {fmtDateTime(d.openedAt)}. {d.reason}
              </p>
              <Link className="btn-secondary" to={`${base}/c/${d.checklistId}`}>
                Open check
              </Link>
            </article>
          )
        })}
        {awaiting + outOfRange.length === 0 && <p className="empty">Nothing needs you right now.</p>}
      </div>
      {openIssues.length > 0 && (
        <Link className="banner warn" to={`${base}/issues`}>
          {openIssues.length} other open issue{openIssues.length > 1 ? 's' : ''} (unchecked items, rework) ›
        </Link>
      )}

      <h2>All active permits</h2>
      <div className="tbl">
        <table>
          <thead>
            <tr>
              <th>Permit</th>
              <th>Area</th>
              <th>Contractor</th>
              <th>Class</th>
              <th>Today's check</th>
              <th>Expires</th>
            </tr>
          </thead>
          <tbody>
            {active.map((p) => {
              const st = todayStatus(state, p, today)
              return (
                <tr key={p.id}>
                  <td className="mono">
                    <Link to={`${base}/permit/${p.id}`}>{p.number}</Link>
                  </td>
                  <td>{zoneName(p.zoneId)}</td>
                  <td className="muted">{p.contractor || state.contractor}</td>
                  <td>
                    <ClassBadge cls={p.cls} short />
                  </td>
                  <td className={`${st.tone}-text`} style={{ fontWeight: 600 }}>
                    {st.text}
                  </td>
                  <td className={p.endDate < today ? 'bad-text' : 'muted'}>{p.endDate < today ? `Expired ${shortDate(p.endDate)}` : shortDate(p.endDate)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="row" style={{ marginTop: 16 }}>
        <Link className="btn-secondary" to={`${base}/weekly`}>
          ⤓ Weekly compliance report
        </Link>
        <Link className="btn-link" to={`${base}/shutdowns`}>
          All shutdowns
        </Link>
      </div>

      {signing && (
        <SignDialog
          title={`Sign permit ${signing.number}`}
          meaning={PERMIT_SIGN_MEANING[me!.role] ?? 'I approve this permit.'}
          role={me!.role}
          defaultName={me!.name}
          onSign={(signature) => dispatch('permit.signed', { permitId: signing.id, signature })}
          onClose={() => setSigning(null)}
        />
      )}
      {changes && <ChangesDialog target={changes} onClose={() => setChanges(null)} />}
    </div>
  )
}

export function ChangesDialog({
  target,
  onClose,
}: {
  target: { kind: 'permit'; permit: PermitState } | { kind: 'shutdown'; shutdown: ShutdownState }
  onClose(): void
}) {
  const { dispatch } = useProject()
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  return (
    <Modal title="Request changes" onClose={onClose}>
      <p className="small">The contractor sees this on their Today screen and resubmits when it's addressed.</p>
      <label className="field">
        What needs to change?
        <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} autoFocus />
      </label>
      {error && <p className="error">{error}</p>}
      <div className="row-end">
        <button className="btn-ghost" onClick={onClose}>
          Cancel
        </button>
        <button
          className="btn-primary"
          disabled={!note.trim()}
          onClick={async () => {
            try {
              if (target.kind === 'permit') await dispatch('permit.changes_requested', { permitId: target.permit.id, note: note.trim() })
              else await dispatch('shutdown.decided', { shutdownId: target.shutdown.id, decision: 'changes_requested', note: note.trim() })
              onClose()
            } catch (e) {
              setError((e as Error).message)
            }
          }}
        >
          Send to contractor
        </button>
      </div>
    </Modal>
  )
}
