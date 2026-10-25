import { ClassBadge, fmtDate } from '../components/ui'
import { addDays, deficiencyStatus, hoursOut, localYmd } from '../domain/reducer'
import { SHUTDOWN_SYSTEMS } from '../domain/templates'
import { useProject } from '../state/project'

const CELL: Record<string, { mark: string; cls: string; label: string }> = {
  approved: { mark: '✓', cls: 'good-text', label: 'Logged and co-signed' },
  submitted: { mark: '✓', cls: 'warn-text', label: 'Logged, awaiting co-sign' },
  rework: { mark: '!', cls: 'bad-text', label: 'Sent back for rework' },
  in_progress: { mark: '…', cls: 'warn-text', label: 'Started, not submitted' },
  missed: { mark: '✗', cls: 'bad-text', label: 'No check logged' },
  none: { mark: '', cls: 'muted', label: 'Permit not active' },
}

/** Seven-day compliance summary for hospital review or a survey binder. Print to save as PDF. */
export default function Weekly() {
  const { state } = useProject()
  const today = localYmd()
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6))
  const from = days[0]
  const permits = Object.values(state.permits).filter((p) => p.activatedAt && localYmd(new Date(p.activatedAt)) <= today && (!p.closedAt || localYmd(new Date(p.closedAt)) >= from))

  const cell = (permitId: string, day: string) => {
    const p = state.permits[permitId]
    const lists = p.checklistIds.map((id) => state.checklists[id])
    // Daily checks stop once closeout starts.
    const closeoutFrom = lists.find((c) => c.kind === 'closeout')?.date
    const activeOn = localYmd(new Date(p.activatedAt!)) <= day && day >= p.startDate && day <= p.endDate && (!closeoutFrom || day < closeoutFrom)
    const c = lists.find((c) => c.kind === 'daily' && c.date === day)
    if (c) return CELL[c.status]
    if (!activeOn) return CELL.none
    return day === today ? CELL.none : CELL.missed
  }

  let expected = 0
  let logged = 0
  for (const p of permits)
    for (const d of days.slice(0, -1)) {
      const c = cell(p.id, d)
      if (c !== CELL.none) expected++
      if (c === CELL.approved || c === CELL.submitted) logged++
    }

  const readings = permits.flatMap((p) =>
    p.checklistIds
      .map((id) => state.checklists[id])
      .filter((c) => c.kind === 'daily' && c.date >= from)
      .flatMap((c) => c.items.flatMap((i) => i.history.filter((ev) => ev.type === 'item.recorded' && ev.payload.reading).map((ev) => ({ p, c, ev })))),
  )
  const failed = readings.filter(({ ev }) => ev.type === 'item.recorded' && !ev.payload.reading!.pass)
  const issues = Object.values(state.deficiencies).filter((d) => d.openedAt.slice(0, 10) >= from || !d.verifiedAt)
  const shutdowns = Object.values(state.shutdowns).filter((s) => s.end.slice(0, 10) >= from || s.status === 'active')

  return (
    <div className="page report">
      <div className="no-print row-end">
        <button className="btn-primary" onClick={() => window.print()}>
          Print / Save as PDF
        </button>
      </div>
      <p className="eyebrow">{state.facility}</p>
      <h1>Weekly ICRA / ILSM compliance</h1>
      <p className="muted">
        {state.name} · {fmtDate(from)} – {fmtDate(today)}
      </p>

      <div className="stats four">
        <div className={`stat ${logged < expected ? 'warn' : ''}`}>
          <span>Daily checks logged</span>
          <b>
            {logged} of {expected}
          </b>
          <span>{expected ? Math.round((logged / expected) * 100) : 100}% (through yesterday)</span>
        </div>
        <div className={`stat ${failed.length ? 'bad' : ''}`}>
          <span>Pressure readings</span>
          <b>{readings.length}</b>
          <span>{failed.length} out of range</span>
        </div>
        <div className="stat">
          <span>Issues</span>
          <b>{issues.length}</b>
          <span>{issues.filter((d) => deficiencyStatus(d) === 'open').length} still open</span>
        </div>
        <div className="stat">
          <span>Shutdowns</span>
          <b>{shutdowns.length}</b>
          <span>{shutdowns.filter((s) => s.status === 'active').length} out of service now</span>
        </div>
      </div>

      <h2>Daily barrier checks</h2>
      <div className="tbl">
        <table>
          <thead>
            <tr>
              <th>Permit</th>
              {days.map((d) => (
                <th key={d}>{new Date(`${d}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permits.map((p) => (
              <tr key={p.id}>
                <td>
                  <ClassBadge cls={p.cls} short /> <b>{p.number}</b>
                  <div className="small muted">{state.zones[p.zoneId].name}</div>
                </td>
                {days.map((d) => {
                  const c = cell(p.id, d)
                  return (
                    <td key={d} className={c.cls} title={c.label} style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                      {c.mark}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="small muted">
        {Object.values(CELL)
          .filter((c) => c.mark)
          .map((c) => `${c.mark} ${c.label}`)
          .join(' · ')}
      </p>

      <h2>Out-of-range pressure readings</h2>
      {failed.length === 0 ? (
        <p className="muted">None.</p>
      ) : (
        <table className="report-table">
          <tbody>
            {failed.map(({ p, ev }) =>
              ev.type === 'item.recorded' ? (
                <tr key={ev.id}>
                  <td>{new Date(ev.clientTs).toLocaleString()}</td>
                  <td>
                    {p.number} · {ev.payload.reading!.location}
                  </td>
                  <td className="bad-text">
                    −{ev.payload.reading!.value.toFixed(3)} (target −{ev.payload.reading!.threshold.toFixed(3)})
                  </td>
                  <td>{ev.payload.note}</td>
                  <td>{ev.actor.name}</td>
                </tr>
              ) : null,
            )}
          </tbody>
        </table>
      )}

      <h2>Issues</h2>
      <table className="report-table">
        <tbody>
          {issues.map((d) => (
            <tr key={d.id}>
              <td>{state.permits[d.permitId].number}</td>
              <td>{d.itemText}</td>
              <td>{d.reason}</td>
              <td>{deficiencyStatus(d)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Utility shutdowns</h2>
      <table className="report-table">
        <tbody>
          {shutdowns.map((s) => {
            const sys = SHUTDOWN_SYSTEMS.find((x) => x.id === s.system)!
            const h = hoursOut(s)
            return (
              <tr key={s.id}>
                <td>{sys.label}</td>
                <td>{s.title}</td>
                <td>{s.status.replace('_', ' ')}</td>
                <td className={sys.fireWatchAfterHours && h > sys.fireWatchAfterHours ? 'bad-text' : ''}>
                  {s.startedAt ? `${h.toFixed(1)} h out` : '–'}
                  {sys.fireWatchAfterHours && h > sys.fireWatchAfterHours ? ' · fire watch required' : ''}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
