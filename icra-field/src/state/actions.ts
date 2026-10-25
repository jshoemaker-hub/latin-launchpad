import type { PermitState, ProjectState } from '../domain/reducer'
import { CLOSEOUT_STEPS, dailyItems } from '../domain/templates'
import type { EventPayloads, EventType } from '../domain/types'

type Dispatch = <T extends EventType>(type: T, payload: EventPayloads[T]) => Promise<void>

export function todaysWalk(state: ProjectState, permit: PermitState, date: string) {
  return permit.checklistIds.map((id) => state.checklists[id]).find((c) => c.kind === 'daily' && c.date === date)
}

export async function startDailyWalk(dispatch: Dispatch, permit: PermitState, date: string): Promise<string> {
  const checklistId = crypto.randomUUID()
  await dispatch('checklist.created', {
    checklistId,
    permitId: permit.id,
    kind: 'daily',
    date,
    title: `Daily barrier check ${date}`,
    items: dailyItems(permit),
  })
  return checklistId
}

export async function startCloseout(dispatch: Dispatch, permit: PermitState, date: string): Promise<string> {
  const checklistId = crypto.randomUUID()
  await dispatch('checklist.created', { checklistId, permitId: permit.id, kind: 'closeout', date, title: 'Closeout', items: CLOSEOUT_STEPS })
  return checklistId
}
