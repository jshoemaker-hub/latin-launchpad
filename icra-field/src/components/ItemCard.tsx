import { useState } from 'react'
import type { ChecklistState, ItemState, PermitState } from '../domain/reducer'
import { ROLE_LABEL, type PhotoRef, type Reading } from '../domain/types'
import { useProject } from '../state/project'
import { Modal, Pill, PhotoButton, PhotoStrip, RoleTag, fmtDateTime } from './ui'

export function canRecord(item: ItemState, checklist: ChecklistState, permit: PermitState, role: string | undefined) {
  if (!role || role === 'viewer' || permit.status === 'closed') return false
  if (checklist.status !== 'in_progress' && checklist.status !== 'rework') return false
  if (checklist.kind === 'closeout') {
    if (item.roles && !item.roles.includes(role as never)) return false
    const idx = checklist.items.indexOf(item)
    if (checklist.items.slice(0, idx).some((i) => i.status !== 'complete')) return false
  }
  return true
}

/** Full item view. `embedded` drops the outer card and title, for the detail panel of a quick-check row. */
export default function ItemCard({ item, checklist, permit, embedded = false }: { item: ItemState; checklist: ChecklistState; permit: PermitState; embedded?: boolean }) {
  const { state, me, dispatch } = useProject()
  const editable = canRecord(item, checklist, permit, me?.role)
  const [editing, setEditing] = useState(embedded || item.status === 'open' || item.status === 'deficient')
  const [note, setNote] = useState(item.status === 'deficient' ? '' : item.note)
  const [photos, setPhotos] = useState<PhotoRef[]>(item.status === 'deficient' ? [] : item.photos)
  const [value, setValue] = useState(item.reading ? String(item.reading.value) : '')
  const [method, setMethod] = useState<Reading['method']>(item.reading?.method ?? 'gauge')
  const [unchecking, setUnchecking] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [error, setError] = useState('')
  const isCloseout = checklist.kind === 'closeout'
  const showEditor = editable && editing

  const numeric = Number(value)
  const reading: Reading | undefined =
    item.readingAt && value !== '' && !Number.isNaN(numeric)
      ? { value: Math.abs(numeric), location: item.readingAt, method, threshold: permit.pressureThreshold, pass: Math.abs(numeric) >= permit.pressureThreshold }
      : undefined
  const missingPhoto = item.photo === 'required' && photos.length === 0
  const missingReading = Boolean(item.readingAt) && !reading

  async function record(status: 'complete' | 'deficient' | 'na') {
    setError('')
    if (status === 'deficient' && !note.trim()) return setError('Describe the problem in the note.')
    try {
      await dispatch('item.recorded', { checklistId: checklist.id, itemId: item.id, status, note: note.trim(), photos, reading: status === 'na' ? undefined : reading })
      setEditing(false)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  const deficiency = item.openDeficiencyId ? state.deficiencies[item.openDeficiencyId] : undefined
  const stepLocked = isCloseout && !editable && item.status !== 'complete' && checklist.status !== 'approved'

  const Root = embedded ? 'div' : 'li'
  return (
    <Root className={embedded ? 'item-embedded' : `item item-${item.status}`}>
      <div className="item-head" hidden={embedded}>
        <div className="grow">
          <div className="item-text">{item.text}</div>
          {item.help && <div className="small muted">{item.help}</div>}
          {isCloseout && item.roles && <div className="small">Signed by: {item.roles.map((r) => ROLE_LABEL[r]).join(' or ')}</div>}
          {item.photo === 'required' && item.status === 'open' && <div className="small muted">📷 Photo required</div>}
        </div>
        <Pill status={item.status} />
      </div>

      {deficiency && !deficiency.resolvedAt && (
        <div className="deficiency-note">
          <strong>{deficiency.kind === 'rework' ? 'Rework requested' : deficiency.kind === 'uncheck' ? 'Unchecked' : 'Problem'}</strong> by {deficiency.openedBy.name}{' '}
          <RoleTag role={deficiency.openedBy.role} />: {deficiency.reason}
          <PhotoStrip photos={deficiency.photos} />
        </div>
      )}

      {!showEditor && item.status !== 'open' && (
        <div className="item-recorded">
          {item.reading && (
            <div className={item.reading.pass ? '' : 'bad-text'}>
              −{item.reading.value} in. w.c. ({item.reading.pass ? 'pass' : 'below'} −{item.reading.threshold}) · {item.reading.method.replace('_', ' ')}
            </div>
          )}
          {item.note && <div>“{item.note}”</div>}
          <PhotoStrip photos={item.photos} />
          {item.recordedBy && (
            <div className="small muted">
              {item.recordedBy.name} · {fmtDateTime(item.recordedAt!)}
            </div>
          )}
        </div>
      )}

      {showEditor && (
        <div className="item-editor">
          {item.readingAt && (
            <div className="reading-row">
              <label className="field grow">
                Reading at {item.readingAt} (in. w.c., negative)
                <div className="reading-input">
                  <span>−</span>
                  <input inputMode="decimal" placeholder="0.020" value={value} onChange={(e) => setValue(e.target.value.replace('-', ''))} />
                </div>
              </label>
              <label className="field">
                Method
                <select value={method} onChange={(e) => setMethod(e.target.value as Reading['method'])}>
                  <option value="gauge">Gauge</option>
                  <option value="continuous_monitor">Monitor</option>
                  <option value="smoke_test">Smoke test</option>
                </select>
              </label>
              {reading && <div className={reading.pass ? 'good-text' : 'bad-text'}>{reading.pass ? '✓ Meets' : '✗ Below'} −{permit.pressureThreshold}</div>}
            </div>
          )}
          <PhotoStrip photos={photos} />
          <div className="row">
            <PhotoButton projectId={state.id} onAdd={(p) => setPhotos([...photos, p])} />
            <input className="grow" placeholder="Note (required if there's a problem)" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          {error && <p className="error">{error}</p>}
          <div className="item-actions">
            <button className="btn-good" disabled={missingPhoto || missingReading} onClick={() => record('complete')}>
              ✓ {isCloseout ? 'Sign step' : 'OK'}
            </button>
            <button className="btn-bad" onClick={() => record('deficient')}>
              ✗ Problem
            </button>
            {!isCloseout && (
              <button className="btn-ghost" onClick={() => record('na')}>
                N/A
              </button>
            )}
          </div>
          {(missingPhoto || missingReading) && <div className="small muted">{missingReading ? 'Enter the reading' : 'Add a photo'} to mark OK.</div>}
        </div>
      )}

      {stepLocked && <div className="small muted">Waiting on earlier steps or another role.</div>}

      <div className="item-foot">
        {editable && !editing && item.status !== 'open' && (
          <button className="btn-link" onClick={() => setEditing(true)}>
            Change
          </button>
        )}
        {me && me.role !== 'viewer' && permit.status !== 'closed' && (item.status === 'complete' || item.status === 'na') && (
          <button className="btn-link bad-text" onClick={() => setUnchecking(true)}>
            Uncheck
          </button>
        )}
        {item.history.length > 0 && (
          <button className="btn-link" onClick={() => setShowHistory(!showHistory)}>
            History ({item.history.length})
          </button>
        )}
      </div>

      {showHistory && (
        <ol className="history">
          {item.history.map((ev) => (
            <li key={ev.id}>
              <span className="muted small">{fmtDateTime(ev.clientTs)}</span> <strong>{ev.actor.name}</strong> <RoleTag role={ev.actor.role} />{' '}
              {ev.type === 'item.recorded' && <>marked {ev.payload.status === 'na' ? 'N/A' : ev.payload.status}{ev.payload.reading ? ` (−${ev.payload.reading.value})` : ''}{ev.payload.note ? `: “${ev.payload.note}”` : ''}</>}
              {ev.type === 'item.unchecked' && <>unchecked: “{ev.payload.reason}”</>}
              {ev.type === 'rework.requested' && <>requested rework: “{ev.payload.note}”</>}
            </li>
          ))}
        </ol>
      )}

      {unchecking && <UncheckDialog checklistId={checklist.id} itemId={item.id} onClose={() => setUnchecking(false)} />}
    </Root>
  )
}

function UncheckDialog({ checklistId, itemId, onClose }: { checklistId: string; itemId: string; onClose(): void }) {
  const { state, dispatch } = useProject()
  const [reason, setReason] = useState('')
  const [photos, setPhotos] = useState<PhotoRef[]>([])
  const [error, setError] = useState('')
  return (
    <Modal title="Uncheck item" onClose={onClose}>
      <p className="small">The earlier check stays in the history. This opens an issue and sends the checklist back for rework.</p>
      <label className="field">
        What is out of compliance?
        <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} autoFocus />
      </label>
      <PhotoStrip photos={photos} />
      <PhotoButton projectId={state.id} onAdd={(p) => setPhotos([...photos, p])} />
      {error && <p className="error">{error}</p>}
      <div className="row-end">
        <button className="btn-ghost" onClick={onClose}>
          Cancel
        </button>
        <button
          className="btn-bad"
          disabled={!reason.trim()}
          onClick={async () => {
            try {
              await dispatch('item.unchecked', { checklistId, itemId, reason: reason.trim(), photos })
              onClose()
            } catch (e) {
              setError((e as Error).message)
            }
          }}
        >
          Uncheck
        </button>
      </div>
    </Modal>
  )
}
