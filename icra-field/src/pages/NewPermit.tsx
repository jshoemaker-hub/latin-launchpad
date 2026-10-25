import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ClassBadge } from '../components/ui'
import { addDays, localYmd } from '../domain/reducer'
import { ACTIVITY_TYPES, ILSM_MEASURES, RISK_GROUPS, SPECIAL_HAZARDS, computeClass, requiredPermitSigners, setupItems } from '../domain/templates'
import { ROLE_LABEL, type ActivityType, type RiskGroup } from '../domain/types'
import { useProject } from '../state/project'

const DEFAULT_MEASURES = ['M3', 'M4', 'M7', 'M8', 'M10', 'M12', 'M13']

export default function NewPermit() {
  const { state, dispatch } = useProject()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const zones = Object.values(state.zones)
  const nextNumber = `P-${101 + Object.keys(state.permits).length}`
  const [f, setF] = useState({
    zoneId: params.get('zone') ?? zones[0]?.id ?? '',
    number: nextNumber,
    scope: '',
    activityType: 'C' as ActivityType,
    riskGroup: 'high' as RiskGroup,
    specialHazards: [] as string[],
    ilsm: false,
    ilsmMeasures: DEFAULT_MEASURES,
    pressurePoints: 'Anteroom entry',
    pressureThreshold: state.settings.pressureThreshold,
    startDate: localYmd(),
    endDate: addDays(localYmd(), 14),
  })
  const [error, setError] = useState('')
  const cls = computeClass(state.settings.matrix, f.activityType, f.riskGroup, f.specialHazards)
  const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      const permitId = crypto.randomUUID()
      await dispatch('permit.created', {
        permitId,
        zoneId: f.zoneId,
        number: f.number.trim(),
        scope: f.scope.trim(),
        activityType: f.activityType,
        riskGroup: f.riskGroup,
        specialHazards: f.specialHazards,
        cls,
        matrixVersion: state.settings.matrixVersion,
        ilsm: f.ilsm,
        ilsmMeasures: f.ilsm ? f.ilsmMeasures : [],
        pressurePoints: cls >= 4 ? f.pressurePoints.split('\n').map((s) => s.trim()).filter(Boolean) : [],
        pressureThreshold: Number(f.pressureThreshold),
        startDate: f.startDate,
        endDate: f.endDate,
      })
      await dispatch('checklist.created', {
        checklistId: crypto.randomUUID(),
        permitId,
        kind: 'setup',
        date: localYmd(),
        title: 'Pre-start setup verification',
        items: setupItems(cls),
      })
      navigate(`/p/${state.id}/permit/${permitId}`)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  if (zones.length === 0) return <p className="page empty">Add a zone under Permits first.</p>

  return (
    <form className="page stack" onSubmit={submit}>
      <h1>New ICRA permit</h1>
      <div className="grid-2">
        <label className="field">
          Zone
          <select value={f.zoneId} onChange={(e) => setF({ ...f, zoneId: e.target.value })}>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Permit #
          <input required value={f.number} onChange={(e) => setF({ ...f, number: e.target.value })} />
        </label>
      </div>
      <label className="field">
        Scope of work
        <textarea required rows={2} value={f.scope} onChange={(e) => setF({ ...f, scope: e.target.value })} />
      </label>

      <fieldset>
        <legend>Construction activity</legend>
        <div className="choice-grid">
          {ACTIVITY_TYPES.map((t) => (
            <label key={t.id} className={`choice ${f.activityType === t.id ? 'on' : ''}`}>
              <input type="radio" name="type" checked={f.activityType === t.id} onChange={() => setF({ ...f, activityType: t.id })} />
              <strong>{t.label}</strong>
              <span className="small">{t.desc}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Patient risk group (highest affected area, including adjacent)</legend>
        <div className="choice-grid">
          {RISK_GROUPS.map((r) => (
            <label key={r.id} className={`choice ${f.riskGroup === r.id ? 'on' : ''}`}>
              <input type="radio" name="risk" checked={f.riskGroup === r.id} onChange={() => setF({ ...f, riskGroup: r.id })} />
              <strong>{r.label}</strong>
              <span className="small">{r.desc}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Special hazards</legend>
        {SPECIAL_HAZARDS.map((h) => (
          <label key={h.id} className="inline">
            <input type="checkbox" checked={f.specialHazards.includes(h.id)} onChange={() => setF({ ...f, specialHazards: toggle(f.specialHazards, h.id) })} /> {h.label}
          </label>
        ))}
      </fieldset>

      <div className="card class-result">
        <ClassBadge cls={cls} />
        <div>
          <div>
            Needs sign-off from: <strong>{requiredPermitSigners(cls, f.ilsm).map((r) => ROLE_LABEL[r]).join(', ')}</strong>
          </div>
          <div className="small muted">From matrix "{state.settings.matrixVersion}" (editable in Settings)</div>
        </div>
      </div>

      {cls >= 4 && (
        <div className="grid-2">
          <label className="field">
            Pressure reading points (one per line)
            <textarea rows={3} value={f.pressurePoints} onChange={(e) => setF({ ...f, pressurePoints: e.target.value })} />
          </label>
          <label className="field">
            Minimum negative pressure (in. w.c.)
            <input type="number" step="0.001" min="0" value={f.pressureThreshold} onChange={(e) => setF({ ...f, pressureThreshold: Number(e.target.value) })} />
          </label>
        </div>
      )}

      <fieldset>
        <legend>
          <label className="inline">
            <input type="checkbox" checked={f.ilsm} onChange={(e) => setF({ ...f, ilsm: e.target.checked })} /> Interim Life Safety Measures apply
          </label>
        </legend>
        {f.ilsm && (
          <div className="stack-tight">
            {ILSM_MEASURES.map((m) => (
              <label key={m.id} className="inline measure">
                <input type="checkbox" checked={f.ilsmMeasures.includes(m.id)} onChange={() => setF({ ...f, ilsmMeasures: toggle(f.ilsmMeasures, m.id) })} />
                <span>
                  {m.label} <span className="small muted">({m.cadence}{m.daily ? '; on the daily walk' : ''})</span>
                </span>
              </label>
            ))}
          </div>
        )}
      </fieldset>

      <div className="grid-2">
        <label className="field">
          Start
          <input type="date" value={f.startDate} onChange={(e) => setF({ ...f, startDate: e.target.value })} />
        </label>
        <label className="field">
          End
          <input type="date" value={f.endDate} onChange={(e) => setF({ ...f, endDate: e.target.value })} />
        </label>
      </div>

      {error && <p className="error">{error}</p>}
      <button className="btn-primary btn-block">Open permit</button>
    </form>
  )
}
