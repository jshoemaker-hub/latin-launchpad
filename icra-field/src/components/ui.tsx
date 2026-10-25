import { useEffect, useRef, useState, type ReactNode } from 'react'
import { processPhoto } from '../data/photos'
import { ROMAN } from '../domain/templates'
import type { IcraClass, PhotoRef, Role, Signature } from '../domain/types'
import { ROLE_LABEL } from '../domain/types'
import { useApp } from '../state/app'

export const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
export const fmtDate = (ymd: string) =>
  new Date(`${ymd}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })

export const checklistName = (c: { kind: string; date: string; title: string }) =>
  c.kind === 'daily' ? `Daily barrier check · ${fmtDate(c.date)}` : c.title

const PILL_TONE: Record<string, string> = {
  open: 'muted',
  in_progress: 'info',
  pending: 'warn',
  submitted: 'warn',
  closing: 'info',
  rework: 'bad',
  deficient: 'bad',
  complete: 'good',
  approved: 'good',
  active: 'good',
  verified: 'good',
  resolved: 'info',
  closed: 'muted',
  na: 'muted',
  changes_requested: 'bad',
  restored: 'muted',
  out_of_service: 'bad',
}

const PILL_LABEL: Record<string, string> = {
  in_progress: 'In progress',
  submitted: 'Awaiting co-sign',
  pending: 'Awaiting approval',
  rework: 'Rework needed',
  na: 'N/A',
  resolved: 'Fixed, awaiting check',
  changes_requested: 'Changes requested',
  restored: 'Restored',
  out_of_service: 'Out of service',
}

export function Pill({ status }: { status: string }) {
  const label = PILL_LABEL[status] ?? status[0].toUpperCase() + status.slice(1)
  return <span className={`pill pill-${PILL_TONE[status] ?? 'muted'}`}>{label}</span>
}

export function ClassBadge({ cls, short = false }: { cls: IcraClass; short?: boolean }) {
  return (
    <span className={`class-badge class-${cls}`} title={`Class ${ROMAN[cls]}`}>
      {short ? ROMAN[cls] : `Class ${ROMAN[cls]}`}
    </span>
  )
}

export function RoleTag({ role }: { role: Role }) {
  return <span className="role-tag">{ROLE_LABEL[role]}</span>
}

export function Modal({ title, onClose, children }: { title: string; onClose(): void; children: ReactNode }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="btn-ghost" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

/** Signature capture: finger signature plus a printed name and what the signature means. */
export function SignDialog({ title, meaning, role, defaultName, onSign, onClose, children, ready = true }: {
  title: string
  meaning: string
  role: Role
  defaultName: string
  onSign(sig: Signature): Promise<void> | void
  onClose(): void
  /** Extra fields shown above the signature (e.g. a deficiency note). */
  children?: ReactNode
  /** False keeps Sign disabled until the extra fields are filled in. */
  ready?: boolean
}) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const [inked, setInked] = useState(false)
  const [name, setName] = useState(defaultName)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const c = canvas.current!
    const ratio = window.devicePixelRatio || 1
    c.width = c.clientWidth * ratio
    c.height = c.clientHeight * ratio
    const g = c.getContext('2d')!
    g.scale(ratio, ratio)
    g.lineWidth = 2.5
    g.lineCap = 'round'
    g.strokeStyle = '#13213d'
  }, [])

  const pos = (e: React.PointerEvent) => {
    const r = canvas.current!.getBoundingClientRect()
    return [e.clientX - r.left, e.clientY - r.top] as const
  }

  async function sign() {
    setBusy(true)
    setError('')
    try {
      await onSign({ name: name.trim(), role, meaning, image: canvas.current!.toDataURL('image/png'), at: new Date().toISOString() })
      onClose()
    } catch (e) {
      setError((e as Error).message)
      setBusy(false)
    }
  }

  return (
    <Modal title={title} onClose={onClose}>
      <p className="sign-meaning">
        <strong>By signing:</strong> {meaning}
      </p>
      {children}
      <label className="field">
        Printed name
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <div className="sign-pad-wrap">
        <canvas
          ref={canvas}
          className="sign-pad"
          onPointerDown={(e) => {
            drawing.current = true
            const g = canvas.current!.getContext('2d')!
            g.beginPath()
            g.moveTo(...pos(e))
            canvas.current!.setPointerCapture(e.pointerId)
          }}
          onPointerMove={(e) => {
            if (!drawing.current) return
            const g = canvas.current!.getContext('2d')!
            g.lineTo(...pos(e))
            g.stroke()
            setInked(true)
          }}
          onPointerUp={() => (drawing.current = false)}
        />
        <span className="sign-hint">Sign with your finger</span>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="row-end">
        <button
          className="btn-ghost"
          onClick={() => {
            const c = canvas.current!
            c.getContext('2d')!.clearRect(0, 0, c.width, c.height)
            setInked(false)
          }}
        >
          Clear
        </button>
        <button className="btn-primary" disabled={!inked || !name.trim() || busy || !ready} onClick={sign}>
          Sign
        </button>
      </div>
    </Modal>
  )
}

export function PhotoThumb({ photo }: { photo: PhotoRef }) {
  const { backend } = useApp()
  const [url, setUrl] = useState('')
  const [open, setOpen] = useState(false)
  useEffect(() => {
    backend.photoUrl(photo.key).then(setUrl)
  }, [backend, photo.key])
  return (
    <>
      <button className="thumb" onClick={() => setOpen(true)} aria-label="View photo">
        {url ? <img src={url} alt="" /> : <span className="thumb-missing">…</span>}
      </button>
      {open && (
        <Modal title="Photo evidence" onClose={() => setOpen(false)}>
          {url && <img className="photo-full" src={url} alt="" />}
          <dl className="meta">
            <dt>Captured</dt>
            <dd>{fmtDateTime(photo.capturedAt)}</dd>
            <dt>SHA-256</dt>
            <dd className="mono">{photo.sha256}</dd>
          </dl>
        </Modal>
      )}
    </>
  )
}

export function PhotoStrip({ photos }: { photos: PhotoRef[] }) {
  if (photos.length === 0) return null
  return (
    <div className="photo-strip">
      {photos.map((p) => (
        <PhotoThumb key={p.key} photo={p} />
      ))}
    </div>
  )
}

export function PhotoButton({ projectId, onAdd, label = 'Add photo' }: { projectId: string; onAdd(p: PhotoRef): void; label?: string }) {
  const { backend } = useApp()
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  return (
    <>
      <input
        ref={input}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={async (e) => {
          const file = e.target.files?.[0]
          e.target.value = ''
          if (!file) return
          setBusy(true)
          try {
            const { blob, ref } = await processPhoto(file)
            const key = await backend.putPhoto(projectId, blob, ref.sha256)
            onAdd({ ...ref, key })
          } finally {
            setBusy(false)
          }
        }}
      />
      <button className="btn-secondary" onClick={() => input.current?.click()} disabled={busy}>
        📷 {busy ? 'Saving…' : label}
      </button>
    </>
  )
}

export function SignatureView({ sig }: { sig: Signature }) {
  return (
    <div className="sig">
      <img src={sig.image} alt={`Signature of ${sig.name}`} />
      <div>
        <strong>{sig.name}</strong> <RoleTag role={sig.role} />
        <div className="muted small">
          {sig.meaning} · {fmtDateTime(sig.at)}
        </div>
      </div>
    </div>
  )
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="empty">{children}</p>
}
