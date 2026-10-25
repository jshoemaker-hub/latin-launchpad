import { useState } from 'react'
import { ACTIVITY_TYPES, DEFAULT_SETTINGS, RISK_GROUPS, ROMAN } from '../domain/templates'
import type { IcraClass, ProjectSettings } from '../domain/types'
import { useProject } from '../state/project'

export default function Settings() {
  const { state, me, dispatch } = useProject()
  const [s, setS] = useState<ProjectSettings>(state.settings)
  const [msg, setMsg] = useState('')
  const canEdit = me && ['superintendent', 'ip', 'facilities', 'safety'].includes(me.role)

  return (
    <div className="page stack">
      <h1>Project settings</h1>
      <section>
        <h2>ICRA class matrix</h2>
        <p className="small muted">
          Published matrices differ between ASHE, APIC, and individual hospitals. Match this to the owner's adopted permit. Changes apply to new permits only;
          existing permits keep the class they were issued with.
        </p>
        <div className="table-wrap">
          <table className="matrix">
            <thead>
              <tr>
                <th>Risk group</th>
                {ACTIVITY_TYPES.map((t) => (
                  <th key={t.id}>{t.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RISK_GROUPS.map((r) => (
                <tr key={r.id}>
                  <th>{r.label}</th>
                  {ACTIVITY_TYPES.map((t) => (
                    <td key={t.id}>
                      <select
                        disabled={!canEdit}
                        value={s.matrix[r.id][t.id]}
                        className={`class-${s.matrix[r.id][t.id]}`}
                        onChange={(e) =>
                          setS({ ...s, matrix: { ...s.matrix, [r.id]: { ...s.matrix[r.id], [t.id]: Number(e.target.value) as IcraClass } } })
                        }
                      >
                        {[1, 2, 3, 4, 5].map((c) => (
                          <option key={c} value={c}>
                            {ROMAN[c]}
                          </option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <label className="field">
          Matrix version label (printed on every permit)
          <input disabled={!canEdit} value={s.matrixVersion} onChange={(e) => setS({ ...s, matrixVersion: e.target.value })} />
        </label>
      </section>
      <section>
        <h2>Pressure</h2>
        <label className="field">
          Default minimum negative pressure for new permits (in. w.c.)
          <input
            disabled={!canEdit}
            type="number"
            step="0.001"
            min="0"
            value={s.pressureThreshold}
            onChange={(e) => setS({ ...s, pressureThreshold: Number(e.target.value) })}
          />
        </label>
        <p className="small muted">0.01 in. w.c. (2.5 Pa) is the CDC/ASHRAE isolation-room reference. Many hospitals require more for construction containment.</p>
      </section>
      {msg && <p className="good-text">{msg}</p>}
      {canEdit && (
        <div className="row-end">
          <button className="btn-ghost" onClick={() => setS(DEFAULT_SETTINGS)}>
            Reset to defaults
          </button>
          <button
            className="btn-primary"
            onClick={async () => {
              await dispatch('settings.updated', { settings: s })
              setMsg('Saved.')
            }}
          >
            Save
          </button>
        </div>
      )}
    </div>
  )
}
