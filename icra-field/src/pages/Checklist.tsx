import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Comments from '../components/Comments'
import ItemCard from '../components/ItemCard'
import { PressureCard, QuickList } from '../components/QuickCheck'
import { ClassBadge, Modal, Pill, SignDialog, SignatureView, checklistName } from '../components/ui'
import { HOSPITAL_ROLES, SUPERVISOR_ROLES, type Section, type Signature } from '../domain/types'
import { useProject } from '../state/project'
import { fmtTime } from '../state/status'

const SECTION_LABEL: Record<Section, string> = {
  Setup: 'Pre-start setup',
  ICRA: 'Barrier and containment (ICRA)',
  Pressure: 'Negative pressure',
  ILSM: 'Life safety (ILSM)',
  Closeout: 'Closeout steps (in order)',
}

// Pressure first: it's the reading that tells you whether the containment is working.
const SECTION_ORDER: Section[] = ['Pressure', 'Setup', 'ICRA', 'ILSM', 'Closeout']

export default function Checklist() {
  const { checklistId } = useParams()
  const { state, me, dispatch } = useProject()
  const [signing, setSigning] = useState<'submit' | 'cosign' | null>(null)
  const [reworkOpen, setReworkOpen] = useState(false)
  const [deficiencyNote, setDeficiencyNote] = useState('')
  const checklist = state.checklists[checklistId!]
  if (!checklist) return <p className="page empty">Checklist not found.</p>
  const permit = state.permits[checklist.permitId]
  const zone = state.zones[permit.zoneId]
  const base = `/p/${state.id}`

  const sections = SECTION_ORDER.filter((s) => checklist.items.some((i) => i.section === s))
  const done = checklist.items.filter((i) => i.status !== 'open').length
  const role = me?.role
  const reviewer = role && (SUPERVISOR_ROLES.includes(role) || HOSPITAL_ROLES.includes(role))
  const isCloseout = checklist.kind === 'closeout'
  const quick = !isCloseout
  const canSubmit = !isCloseout && role && role !== 'viewer' && (checklist.status === 'in_progress' || checklist.status === 'rework') && permit.status !== 'closed'
  const canCosign = reviewer && checklist.status === 'submitted' && checklist.submitted?.actorId !== me!.id
  const canRework = reviewer && !isCloseout && (checklist.status === 'submitted' || checklist.status === 'approved') && permit.status !== 'closed'
  const openItems = checklist.items.filter((i) => i.status === 'open')
  // Pressure items can't be skipped: unchecked boxes become deficiencies, but a reading must exist.
  const missingReadings = openItems.filter((i) => i.readingAt)
  const deficientCount = checklist.items.filter((i) => i.status === 'deficient').length

  async function submit(signature: Signature) {
    for (const item of openItems) {
      await dispatch('item.recorded', { checklistId: checklist.id, itemId: item.id, status: 'deficient', note: deficiencyNote.trim(), photos: [] })
    }
    await dispatch('checklist.submitted', { checklistId: checklist.id, signature })
  }

  return (
    <div className="page with-actionbar">
      <header className="page-head">
        <div>
          <div className="row">
            <ClassBadge cls={permit.cls} />
            <Pill status={isCloseout && permit.status === 'closed' ? 'closed' : checklist.status} />
          </div>
          <h1>{checklistName(checklist)}</h1>
          <Link to={`${base}/permit/${permit.id}`} className="muted">
            Permit {permit.number} · {zone.name}
          </Link>
        </div>
      </header>

      {checklist.status === 'rework' && checklist.reworkNote && <div className="banner bad">↺ {checklist.reworkNote}</div>}
      {(checklist.status === 'submitted' || checklist.status === 'approved') && checklist.submitted && (
        <div className={`status-box ${deficientCount ? 'warn' : 'ok'}`} role="status" style={{ margin: '10px 0' }}>
          {deficientCount
            ? `Logged ${fmtTime(checklist.submitted.at)} with ${deficientCount} deficienc${deficientCount > 1 ? 'ies' : 'y'} · corrective action opened`
            : `Logged ${fmtTime(checklist.submitted.at)} · sent to hospital log`}
          {checklist.status === 'submitted' ? ' · awaiting co-sign' : ' · co-signed'}
        </div>
      )}

      <div className="progress" aria-label={`${done} of ${checklist.items.length} recorded`}>
        <div style={{ width: `${(done / checklist.items.length) * 100}%` }} />
      </div>
      <p className="small muted">
        {done} of {checklist.items.length} recorded
      </p>

      {quick && checklist.status !== 'approved' && checklist.status !== 'submitted' && (
        <p className="small muted">Tap a line to check it. Tap ⋯ to add a note or photo, or to mark a problem or N/A.</p>
      )}

      {sections.map((section) => {
        const items = checklist.items.filter((i) => i.section === section)
        return (
          <section key={section}>
            <h2>{SECTION_LABEL[section]}</h2>
            {quick && section === 'Pressure' ? (
              items.map((item) => <PressureCard key={`${item.id}-${item.history.length}`} item={item} checklist={checklist} permit={permit} />)
            ) : quick ? (
              <QuickList items={items} checklist={checklist} permit={permit} />
            ) : (
              <ul className="items">
                {items.map((item) => (
                  <ItemCard key={`${item.id}-${item.history.length}`} item={item} checklist={checklist} permit={permit} />
                ))}
              </ul>
            )}
          </section>
        )
      })}

      {(checklist.submitted || checklist.cosigned) && (
        <section>
          <h2>Signatures</h2>
          {checklist.submitted && <SignatureView sig={checklist.submitted} />}
          {checklist.cosigned && <SignatureView sig={checklist.cosigned} />}
        </section>
      )}

      <Comments checklistId={checklist.id} permitId={permit.id} />

      {(canSubmit || canCosign || canRework) && (
        <div className="actionbar no-print">
          {canSubmit && (
            <button
              className={`grow ${openItems.length || deficientCount ? 'btn-bad' : 'btn-primary'}`}
              disabled={missingReadings.length > 0}
              onClick={() => setSigning('submit')}
            >
              {missingReadings.length
                ? 'Record pressure first'
                : openItems.length + deficientCount
                  ? `Submit with ${openItems.length + deficientCount} deficienc${openItems.length + deficientCount > 1 ? 'ies' : 'y'}`
                  : 'Sign and submit check'}
            </button>
          )}
          {canRework && (
            <button className="btn-bad" onClick={() => setReworkOpen(true)}>
              Request rework
            </button>
          )}
          {canCosign && (
            <button className="btn-good grow" onClick={() => setSigning('cosign')}>
              Co-sign
            </button>
          )}
        </div>
      )}

      {signing && me && (
        <SignDialog
          title={signing === 'submit' ? 'Submit for co-sign' : 'Co-sign checklist'}
          meaning={
            signing === 'submit'
              ? 'I personally checked these items and the record above is accurate.'
              : 'I reviewed this record and its evidence and approve it.'
          }
          role={me.role}
          defaultName={me.name}
          ready={signing !== 'submit' || openItems.length === 0 || deficiencyNote.trim() !== ''}
          onSign={(signature) => (signing === 'submit' ? submit(signature) : dispatch('checklist.cosigned', { checklistId: checklist.id, signature }))}
          onClose={() => setSigning(null)}
        >
          {signing === 'submit' && openItems.length > 0 && (
            <div className="stack-tight">
              <p className="small">
                <strong>Not checked, will be logged as deficiencies:</strong>
              </p>
              <ul className="small">
                {openItems.map((i) => (
                  <li key={i.id}>{i.text}</li>
                ))}
              </ul>
              <label className="field">
                What's wrong, and what's being done about it?
                <textarea rows={2} value={deficiencyNote} onChange={(e) => setDeficiencyNote(e.target.value)} />
              </label>
            </div>
          )}
        </SignDialog>
      )}
      {reworkOpen && <ReworkDialog checklistId={checklist.id} onClose={() => setReworkOpen(false)} />}
    </div>
  )
}

function ReworkDialog({ checklistId, onClose }: { checklistId: string; onClose(): void }) {
  const { state, dispatch } = useProject()
  const checklist = state.checklists[checklistId]
  const [selected, setSelected] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  return (
    <Modal title="Request rework" onClose={onClose}>
      <p className="small">Selected items go back to the crew marked as problems. The checklist must be fixed and re-submitted.</p>
      <div className="stack-tight rework-list">
        {checklist.items
          .filter((i) => i.status === 'complete' || i.status === 'na')
          .map((i) => (
            <label key={i.id} className="inline">
              <input
                type="checkbox"
                checked={selected.includes(i.id)}
                onChange={() => setSelected(selected.includes(i.id) ? selected.filter((x) => x !== i.id) : [...selected, i.id])}
              />
              {i.text}
            </label>
          ))}
      </div>
      <label className="field">
        What needs to be fixed?
        <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
      </label>
      {error && <p className="error">{error}</p>}
      <div className="row-end">
        <button className="btn-ghost" onClick={onClose}>
          Cancel
        </button>
        <button
          className="btn-bad"
          disabled={selected.length === 0 || !note.trim()}
          onClick={async () => {
            try {
              await dispatch('rework.requested', { checklistId, itemIds: selected, note: note.trim() })
              onClose()
            } catch (e) {
              setError((e as Error).message)
            }
          }}
        >
          Send back
        </button>
      </div>
    </Modal>
  )
}
