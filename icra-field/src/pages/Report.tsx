import { useParams } from 'react-router-dom'
import { PhotoStrip, SignatureView, checklistName, fmtDate, fmtDateTime } from '../components/ui'
import { deficiencyStatus } from '../domain/reducer'
import { ACTIVITY_TYPES, ILSM_MEASURES, RISK_GROUPS, ROMAN } from '../domain/templates'
import { ROLE_LABEL } from '../domain/types'
import { useProject } from '../state/project'

/** Survey / closeout packet for one permit. Uses the browser's print dialog to save as PDF. */
export default function Report() {
  const { permitId } = useParams()
  const { state } = useProject()
  const permit = state.permits[permitId!]
  if (!permit) return <p className="page empty">Permit not found.</p>
  const zone = state.zones[permit.zoneId]
  const checklists = permit.checklistIds.map((id) => state.checklists[id]).sort((a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt))
  const issues = Object.values(state.deficiencies).filter((d) => d.permitId === permit.id)
  const related = new Set([permit.id, ...permit.checklistIds])
  const log = state.log.filter(({ event: ev }) => {
    const p = ev.payload as { permitId?: string; checklistId?: string }
    return (p.permitId && related.has(p.permitId)) || (p.checklistId && related.has(p.checklistId))
  })

  return (
    <div className="page report">
      <div className="no-print row-end">
        <button className="btn-primary" onClick={() => window.print()}>
          Print / Save as PDF
        </button>
      </div>

      <h1>
        ICRA Permit {permit.number} · Class {ROMAN[permit.cls]}
        {permit.ilsm && ' + ILSM'}
      </h1>
      <p>
        {state.name} · {state.facility}
        <br />
        Owner: {state.owner || '–'} · Contractor: {state.contractor || '–'}
        <br />
        Generated {fmtDateTime(new Date().toISOString())}
      </p>

      <h2>Permit</h2>
      <dl className="meta">
        <dt>Zone</dt>
        <dd>
          {zone.name} (Floor {zone.floor || '–'}, {zone.area || '–'}, {zone.phase || '–'})
        </dd>
        <dt>Scope</dt>
        <dd>{permit.scope}</dd>
        <dt>Activity / risk</dt>
        <dd>
          {ACTIVITY_TYPES.find((t) => t.id === permit.activityType)?.label} × {RISK_GROUPS.find((r) => r.id === permit.riskGroup)?.label} risk
          {permit.specialHazards.length > 0 && ` · hazards: ${permit.specialHazards.join(', ')}`}
        </dd>
        <dt>Matrix</dt>
        <dd>{permit.matrixVersion}</dd>
        <dt>Dates</dt>
        <dd>
          {fmtDate(permit.startDate)} – {fmtDate(permit.endDate)} · status {permit.status}
        </dd>
        {permit.pressurePoints.length > 0 && (
          <>
            <dt>Pressure</dt>
            <dd>
              At least {permit.pressureThreshold} in. w.c. negative at {permit.pressurePoints.join(', ')}
            </dd>
          </>
        )}
        {permit.ilsm && (
          <>
            <dt>ILSM</dt>
            <dd>{ILSM_MEASURES.filter((m) => permit.ilsmMeasures.includes(m.id)).map((m) => m.label).join('; ')}</dd>
          </>
        )}
      </dl>

      <h3>Approvals</h3>
      {permit.signatures.map((s) => (
        <SignatureView key={s.role} sig={s} />
      ))}
      {permit.requiredSigners
        .filter((r) => !permit.signatures.some((s) => s.role === r))
        .map((r) => (
          <p key={r} className="bad-text">
            Missing: {ROLE_LABEL[r]}
          </p>
        ))}

      {checklists.map((c) => (
        <section key={c.id} className="report-checklist">
          <h2>
            {checklistName(c)} · {c.status.replace('_', ' ')}
          </h2>
          <table className="report-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Status</th>
                <th>Evidence</th>
                <th>By</th>
              </tr>
            </thead>
            <tbody>
              {c.items.map((i) => (
                <tr key={i.id} className={i.status === 'deficient' ? 'bad-row' : ''}>
                  <td>{i.text}</td>
                  <td>{i.status === 'na' ? 'N/A' : i.status}</td>
                  <td>
                    {i.reading && (
                      <div>
                        −{i.reading.value} in. w.c. ({i.reading.pass ? 'pass' : 'FAIL'})
                      </div>
                    )}
                    {i.note && <div>{i.note}</div>}
                    <PhotoStrip photos={i.photos} />
                    {i.photos.map((p) => (
                      <div key={p.key} className="mono tiny">
                        sha256 {p.sha256.slice(0, 16)}…
                      </div>
                    ))}
                  </td>
                  <td className="small">{i.recordedBy ? `${i.recordedBy.name}, ${fmtDateTime(i.recordedAt!)}` : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {c.submitted && <SignatureView sig={c.submitted} />}
          {c.cosigned && <SignatureView sig={c.cosigned} />}
        </section>
      ))}

      <h2>Issues ({issues.length})</h2>
      <table className="report-table">
        <tbody>
          {issues.map((d) => (
            <tr key={d.id}>
              <td>{d.itemText}</td>
              <td>{d.reason}</td>
              <td className="small">
                Opened {d.openedBy.name} {fmtDateTime(d.openedAt)}
                {d.resolvedBy && `; fixed ${d.resolvedBy.name} ${fmtDateTime(d.resolvedAt!)}`}
                {d.verifiedBy && `; verified ${d.verifiedBy.name} ${fmtDateTime(d.verifiedAt!)}`}
              </td>
              <td>{deficiencyStatus(d)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Audit trail ({log.length} entries)</h2>
      <table className="report-table small">
        <tbody>
          {log.map(({ event: ev, summary, ok }) => (
            <tr key={ev.id}>
              <td>{fmtDateTime(ev.clientTs)}</td>
              <td>
                {ev.actor.name} ({ROLE_LABEL[ev.actor.role]})
              </td>
              <td>
                {summary}
                {!ok && ' [rejected]'}
              </td>
              <td className="mono tiny">{ev.hash.slice(0, 12)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
