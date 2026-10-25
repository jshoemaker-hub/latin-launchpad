import { useState } from 'react'
import { RoleTag, fmtDateTime } from '../components/ui'
import { verifyChain, type ChainProblem } from '../domain/hash'
import { useProject } from '../state/project'

export default function Activity() {
  const { state, events } = useProject()
  const [query, setQuery] = useState('')
  const [check, setCheck] = useState<ChainProblem[] | null>(null)
  const [checking, setChecking] = useState(false)
  const q = query.trim().toLowerCase()
  const entries = [...state.log].reverse().filter((e) => !q || `${e.summary} ${e.event.actor.name}`.toLowerCase().includes(q))

  return (
    <div className="page">
      <header className="page-head">
        <h1>Activity log</h1>
        <button
          className="btn-secondary"
          disabled={checking}
          onClick={async () => {
            setChecking(true)
            setCheck(await verifyChain(events))
            setChecking(false)
          }}
        >
          {checking ? 'Checking…' : 'Verify integrity'}
        </button>
      </header>
      <p className="small muted">
        Append-only record of every action. Entries can't be edited or deleted; each is fingerprinted and linked to the one before it from the same device.
      </p>
      {check && (
        <div className={`banner ${check.length ? 'bad' : 'good'}`}>
          {check.length === 0
            ? `✓ All ${events.length} entries match their fingerprints and every device chain is unbroken.`
            : `✗ ${check.length} problem(s): ${check.slice(0, 3).map((p) => p.problem).join('; ')}`}
        </div>
      )}
      <input className="block" placeholder="Search the log" value={query} onChange={(e) => setQuery(e.target.value)} />
      <ol className="log">
        {entries.map(({ event: ev, ok, error, summary }) => (
          <li key={ev.id} className={ok ? '' : 'rejected'}>
            <div className="small muted">
              {fmtDateTime(ev.clientTs)}
              {ev.serverTs && Math.abs(Date.parse(ev.serverTs) - Date.parse(ev.clientTs)) > 120_000 && <> · synced {fmtDateTime(ev.serverTs)}</>}
              {ev.pending && <b className="warn-text"> · not yet synced</b>}
            </div>
            <div>
              <strong>{ev.actor.name}</strong> <RoleTag role={ev.actor.role} /> {summary}
            </div>
            {!ok && <div className="bad-text small">Rejected: {error}</div>}
            <div className="mono tiny muted" title={ev.hash}>
              #{ev.hash.slice(0, 12)}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
