import { useRef, useState } from 'react'
import { processPhoto } from '../data/photos'
import type { ChecklistState, ItemState, PermitState, ProjectState } from '../domain/reducer'
import type { PhotoRef } from '../domain/types'
import { useApp } from '../state/app'
import { useProject } from '../state/project'
import ItemCard, { canRecord } from './ItemCard'
import { PhotoButton, PhotoStrip, fmtDateTime } from './ui'

const STEP = 0.001

/** Opens the phone camera and returns a processed, hashed, stored photo. */
function useCamera() {
  const { backend } = useApp()
  const { state } = useProject()
  const input = useRef<HTMLInputElement>(null)
  const resolver = useRef<((p: PhotoRef | null) => void) | null>(null)
  const el = (
    <input
      ref={input}
      type="file"
      accept="image/*"
      capture="environment"
      hidden
      onChange={async (e) => {
        const file = e.target.files?.[0]
        e.target.value = ''
        const done = resolver.current
        resolver.current = null
        if (!file) return done?.(null)
        const { blob, ref } = await processPhoto(file)
        done?.({ ...ref, key: await backend.putPhoto(state.id, blob, ref.sha256) })
      }}
    />
  )
  const take = () =>
    new Promise<PhotoRef | null>((resolve) => {
      resolver.current = resolve
      input.current?.click()
    })
  return { el, take }
}

function lastReading(state: ProjectState, permit: PermitState, checklist: ChecklistState, location: string) {
  const earlier = permit.checklistIds
    .map((id) => state.checklists[id])
    .filter((c) => c.kind === 'daily' && c.id !== checklist.id && c.date <= checklist.date)
    .sort((a, b) => b.date.localeCompare(a.date))
  for (const c of earlier) {
    const r = c.items.find((i) => i.readingAt === location && i.reading)?.reading
    if (r) return r.value
  }
  return undefined
}

export function PressureCard({ item, checklist, permit }: { item: ItemState; checklist: ChecklistState; permit: PermitState }) {
  const { state, me, dispatch } = useProject()
  const editable = canRecord(item, checklist, permit, me?.role)
  const start = item.reading?.value ?? lastReading(state, permit, checklist, item.readingAt!) ?? permit.pressureThreshold * 2
  const [value, setValue] = useState(start.toFixed(3))
  const [photos, setPhotos] = useState<PhotoRef[]>([])
  const [note, setNote] = useState('')
  const [rereading, setRereading] = useState(false)
  const [error, setError] = useState('')
  const [showDetail, setShowDetail] = useState(false)
  const magnitude = Math.abs(Number(value))
  const valid = value !== '' && !Number.isNaN(magnitude)
  const ok = valid && magnitude >= permit.pressureThreshold
  const recorded = item.status !== 'open' && item.reading
  const showInput = editable && (!recorded || rereading || item.status === 'deficient')
  const bump = (d: number) => setValue(Math.max(0, Math.round((magnitude + d) / STEP) * STEP).toFixed(3))

  async function save() {
    setError('')
    if (!ok && !note.trim()) return setError('Out of range: say what you did about it.')
    try {
      await dispatch('item.recorded', {
        checklistId: checklist.id,
        itemId: item.id,
        status: 'complete',
        note: note.trim(),
        photos,
        reading: { value: magnitude, location: item.readingAt!, method: 'gauge', threshold: permit.pressureThreshold, pass: ok },
      })
      setPhotos([])
      setNote('')
      setRereading(false)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <div className="pressure-card">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <b className="small">Differential pressure · {item.readingAt}</b>
        <span className="small muted">Target ≤ −{permit.pressureThreshold.toFixed(3)} in. w.c.</span>
      </div>
      {showInput ? (
        <>
          <div className="stepper">
            <button type="button" aria-label="More negative" onClick={() => bump(STEP)}>
              −
            </button>
            <input inputMode="decimal" aria-label="Reading in inches of water column" value={`−${value.replace('-', '')}`} onChange={(e) => setValue(e.target.value.replace(/[^\d.]/g, ''))} />
            <button type="button" aria-label="Less negative" onClick={() => bump(-STEP)}>
              +
            </button>
          </div>
          <div className={`status-box ${ok ? 'ok' : 'bad'}`} role="status">
            {ok ? 'In range: negative pressure holding' : 'Out of range: IP and facilities will be notified'}
          </div>
          {!ok && <input className="block" style={{ marginTop: 8 }} placeholder="Corrective action (e.g. re-taped door, swapped HEPA filter)" value={note} onChange={(e) => setNote(e.target.value)} />}
          <PhotoStrip photos={photos} />
          <div className="row" style={{ marginTop: 8 }}>
            <PhotoButton projectId={state.id} label={photos.length ? 'Another photo' : 'Gauge photo'} onAdd={(p) => setPhotos([...photos, p])} />
            <button className={`grow ${ok ? 'btn-primary' : 'btn-bad'}`} disabled={!valid || photos.length === 0} onClick={save}>
              {photos.length === 0 ? 'Add gauge photo to save' : ok ? 'Save reading' : 'Save out-of-range reading'}
            </button>
          </div>
          {error && <p className="error">{error}</p>}
        </>
      ) : recorded ? (
        <>
          <div className="stepper">
            <input readOnly value={`−${item.reading!.value.toFixed(3)}`} aria-label="Recorded reading" />
          </div>
          <div className={`status-box ${item.reading!.pass ? 'ok' : 'bad'}`}>{item.reading!.pass ? 'In range' : 'Out of range: IP and facilities notified'}</div>
          {item.note && <p className="small">“{item.note}”</p>}
          <PhotoStrip photos={item.photos} />
          <div className="row small muted">
            <span className="grow">
              {item.recordedBy?.name} · {fmtDateTime(item.recordedAt!)}
            </span>
            {editable && (
              <button className="btn-link" onClick={() => setRereading(true)}>
                Re-read
              </button>
            )}
            <button className="btn-link" onClick={() => setShowDetail(!showDetail)}>
              {showDetail ? 'Hide' : 'More'}
            </button>
          </div>
          {showDetail && <ItemCard key={item.history.length} item={item} checklist={checklist} permit={permit} embedded />}
        </>
      ) : (
        <p className="muted small">Not recorded.</p>
      )}
    </div>
  )
}

function QuickRow({ item, checklist, permit }: { item: ItemState; checklist: ChecklistState; permit: PermitState }) {
  const { me, dispatch } = useProject()
  const camera = useCamera()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const editable = canRecord(item, checklist, permit, me?.role)
  const tappable = editable && item.status !== 'deficient'

  async function tap() {
    if (busy) return
    setBusy(true)
    try {
      if (item.status === 'complete' || item.status === 'na') {
        await dispatch('item.recorded', { checklistId: checklist.id, itemId: item.id, status: 'open', note: '', photos: [] })
      } else if (item.photo === 'required') {
        const photo = await camera.take()
        if (photo) await dispatch('item.recorded', { checklistId: checklist.id, itemId: item.id, status: 'complete', note: '', photos: [photo] })
      } else {
        await dispatch('item.recorded', { checklistId: checklist.id, itemId: item.id, status: 'complete', note: '', photos: [] })
      }
    } finally {
      setBusy(false)
    }
  }

  const meta =
    item.status === 'deficient'
      ? item.note || 'Problem: open for details'
      : item.status === 'open'
        ? item.photo === 'required'
          ? '📷 Tap to take the required photo'
          : ''
        : `${item.recordedBy?.name ?? ''}${item.photos.length ? ` · ${item.photos.length} photo${item.photos.length > 1 ? 's' : ''}` : ''}${item.note ? ` · “${item.note}”` : ''}`

  return (
    <li className={`q-${item.status}`}>
      {camera.el}
      <div className="row" style={{ gap: 4, flexWrap: 'nowrap' }}>
        <button type="button" className="qrow" aria-pressed={item.status === 'complete'} disabled={!tappable} onClick={tap}>
          <span className="bx">{item.status === 'complete' ? '✓' : item.status === 'deficient' ? '!' : item.status === 'na' ? 'N/A' : ''}</span>
          <span className="qtext">
            {item.text}
            {meta && <div className="qmeta">{meta}</div>}
          </span>
        </button>
        <button type="button" className="qmore" aria-label={`Details for ${item.text}`} aria-expanded={open} onClick={() => setOpen(!open)}>
          ⋯
        </button>
      </div>
      {open && (
        <div className="qdetail">
          <ItemCard key={item.history.length} item={item} checklist={checklist} permit={permit} embedded />
        </div>
      )}
    </li>
  )
}

export function QuickList({ items, checklist, permit }: { items: ItemState[]; checklist: ChecklistState; permit: PermitState }) {
  return (
    <ul className="quick">
      {items.map((item) => (
        <QuickRow key={item.id} item={item} checklist={checklist} permit={permit} />
      ))}
    </ul>
  )
}
