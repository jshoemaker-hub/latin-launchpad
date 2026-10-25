import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Comments from '../components/Comments'
import ItemCard from '../components/ItemCard'
import { ClassBadge, Modal, Pill, SignDialog, SignatureView, checklistName } from '../components/ui'
import { HOSPITAL_ROLES, SUPERVISOR_ROLES, type Section } from '../domain/types'
import { useProject } from '../state/project'

const SECTION_LABEL: Record<Section, string> = {
  Setup: 'Pre-start setup',
  ICRA: 'Infection control (ICRA)',
  Pressure: 'Negative pressure',
  ILSM: 'Life safety (ILSM)',
  Closeout: 'Closeout steps (in order)',
}

export default function Checklist() {
  const { checklistId } = useParams()
  const { state, me, dispatch } = useProject()
  const [signing, setSigning] = useState<'submit' | 'cosign' | null>(null)
  const [reworkOpen, setReworkOpen] = useState(false)
  const checklist = state.checklists[checklistId!]
  if (!checklist) return <p className="page empty">Checklist not found.</p>
  const permit = state.permits[checklist.permitId]
  const zone = state.zones[permit.zoneId]
  const base = `/p/${state.id}`

  const sections = [...new Set(checklist.items.map((i) => i.section))]
  const done = checklist.items.filter((i) => i.status !== 'open').length
  const role = me?.role
  const reviewer = role && (SUPERVISOR_ROLES.includes(role) || HOSPITAL_ROLES.includes(role))
  const isCloseout = checklist.kind === 'closeout'
  const canSubmit = !isCloseout && role && role !== 'viewer' && (checklist.status === 'in_progress' || checklist.status === 'rework') && permit.status !== 'closed'
  const canCosign = reviewer && checklist.status === 'submitted' && checklist.submitted?.actorId !== me!.id
  const canRework = reviewer && !isCloseout && (checklist.status === 'submitted' || checklist.status === 'approved') && permit.status !== 'closed'
  const openCount = checklist.items.filter((i) => i.status === 'open').length

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
      {checklist.status === 'submitted' && <div className="banner warn">Submitted by {checklist.submitted?.name}. Waiting for a supervisor co-sign.</div>}

      <div className="progress" aria-label={`${done} of ${checklist.items.length} recorded`}>
        <div style={{ width: `${(done / checklist.items.length) * 100}%` }} />
      </div>
      <p className="small muted">
        {done} of {checklist.items.length} recorded
      </p>

      {sections.map((section) => (
        <section key={section}>
          <h2>{SECTION_LABEL[section]}</h2>
          <ul className="items">
            {checklist.items
              .filter((i) => i.section === section)
              .map((item) => (
                <ItemCard key={`${item.id}-${item.history.length}`} item={item} checklist={checklist} permit={permit} />
              ))}
          </ul>
        </section>
      ))}

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
            <button className="btn-primary grow" disabled={openCount > 0} onClick={() => setSigning('submit')}>
              {openCount > 0 ? `${openCount} item${openCount > 1 ? 's' : ''} left` : 'Sign & submit'}
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
          onSign={(signature) =>
            dispatch(signing === 'submit' ? 'checklist.submitted' : 'checklist.cosigned', { checklistId: checklist.id, signature })
          }
          onClose={() => setSigning(null)}
        />
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
