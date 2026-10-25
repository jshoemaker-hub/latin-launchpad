import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { buildEvent, commitChain } from '../data/events'
import { reduce, validate, type ProjectState } from '../domain/reducer'
import type { Actor, AnyEvent, EventPayloads, EventType } from '../domain/types'
import { useApp } from './app'

interface ProjectCtx {
  state: ProjectState
  events: AnyEvent[]
  loading: boolean
  /** The current user as an actor on this project, or null if they aren't a member. */
  me: Actor | null
  /** Checks the rules, signs, stores and broadcasts one action. Throws RuleError if not allowed. */
  dispatch<T extends EventType>(type: T, payload: EventPayloads[T]): Promise<void>
  pending: number
}

const Ctx = createContext<ProjectCtx | null>(null)

export function ProjectProvider({ projectId, children }: { projectId: string; children: ReactNode }) {
  const { backend, user, persona } = useApp()
  const [events, setEvents] = useState<AnyEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [pending, setPending] = useState(0)
  const queue = useRef<Promise<unknown>>(Promise.resolve())
  // Kept in step with `events` so queued actions validate against everything written so far.
  const eventsRef = useRef<AnyEvent[]>([])

  const merge = useCallback((incoming: AnyEvent[]) => {
    const byId = new Map(eventsRef.current.map((e) => [e.id, e]))
    for (const e of incoming) byId.set(e.id, e)
    eventsRef.current = [...byId.values()]
    setEvents(eventsRef.current)
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    backend.loadEvents(projectId).then((evs) => {
      if (cancelled) return
      eventsRef.current = evs
      setEvents(evs)
      setLoading(false)
    })
    const unsub = backend.subscribe(projectId, (ev) => merge([ev]))
    const tick = setInterval(() => backend.pendingCount().then(setPending), 3000)
    return () => {
      cancelled = true
      unsub()
      clearInterval(tick)
    }
  }, [backend, projectId, merge])

  const state = useMemo(() => reduce(projectId, events), [projectId, events])

  const me = useMemo<Actor | null>(() => {
    if (persona) return persona
    if (!user) return null
    const member = state.members.find((m) => m.email.toLowerCase() === user.email)
    return member ? { id: user.id, email: user.email, name: member.name || user.name, role: member.role } : null
  }, [persona, user, state.members])

  const dispatch = useCallback(
    <T extends EventType>(type: T, payload: EventPayloads[T]) => {
      const run = async () => {
        const actor = me ?? (type === 'project.created' && user ? { ...user, role: 'superintendent' as const } : null)
        if (!actor) throw new Error('You are not a member of this project')
        const ev = await buildEvent(projectId, type, payload, actor)
        validate(reduce(projectId, eventsRef.current), ev)
        commitChain(ev)
        await backend.append(ev)
        merge([{ ...ev, pending: backend.mode === 'supabase' }])
        setPending(await backend.pendingCount())
      }
      const next = queue.current.then(run, run)
      queue.current = next.catch(() => {})
      return next
    },
    [backend, me, user, projectId, merge],
  )

  const value = useMemo(() => ({ state, events, loading, me, dispatch, pending }), [state, events, loading, me, dispatch, pending])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useProject() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useProject outside ProjectProvider')
  return v
}
