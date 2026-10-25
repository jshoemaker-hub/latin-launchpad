import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import type { Backend } from '../data/backend'
import { demoBackend } from '../data/demoBackend'
import { createSupabaseBackend } from '../data/supabaseBackend'
import { DEMO_PERSONAS, ensureDemoSeed } from '../data/seed'
import type { Actor } from '../domain/types'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY)

const supabaseBackend = supabaseConfigured ? createSupabaseBackend(SUPABASE_URL!, SUPABASE_KEY!) : null

export interface User {
  id: string
  email: string
  name: string
}

interface AppState {
  backend: Backend
  mode: 'demo' | 'supabase'
  ready: boolean
  /** Signed-in user (Supabase) or the demo persona being played. */
  user: User | null
  /** Demo mode only: the persona whose role is used for every action. */
  persona: Actor | null
  setPersona(id: string): void
  setMode(mode: 'demo' | 'supabase'): void
  signOut(): Promise<void>
}

const Ctx = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<'demo' | 'supabase'>(() =>
    supabaseBackend && localStorage.getItem('icra.mode') !== 'demo' ? 'supabase' : 'demo',
  )
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)
  const [personaId, setPersonaId] = useState(() => localStorage.getItem('icra.persona') ?? DEMO_PERSONAS[0].id)

  useEffect(() => {
    let cancelled = false
    setReady(false)
    if (mode === 'demo') {
      ensureDemoSeed().then(() => !cancelled && setReady(true))
      return () => {
        cancelled = true
      }
    }
    const client = supabaseBackend!.client
    client.auth.getSession().then(({ data }) => {
      if (cancelled) return
      setSession(data.session)
      setReady(true)
    })
    const { data } = client.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => {
      cancelled = true
      data.subscription.unsubscribe()
    }
  }, [mode])

  const value = useMemo<AppState>(() => {
    const persona = mode === 'demo' ? (DEMO_PERSONAS.find((p) => p.id === personaId) ?? DEMO_PERSONAS[0]) : null
    const user: User | null = persona
      ? { id: persona.id, email: persona.email, name: persona.name }
      : session
        ? { id: session.user.id, email: (session.user.email ?? '').toLowerCase(), name: (session.user.user_metadata?.name as string) || session.user.email || '' }
        : null
    return {
      backend: mode === 'demo' ? demoBackend : supabaseBackend!,
      mode,
      ready,
      user,
      persona,
      setPersona(id) {
        localStorage.setItem('icra.persona', id)
        setPersonaId(id)
      },
      setMode(m) {
        localStorage.setItem('icra.mode', m)
        setModeState(m)
      },
      async signOut() {
        if (mode === 'supabase') await supabaseBackend!.client.auth.signOut()
      },
    }
  }, [mode, ready, session, personaId])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp outside AppProvider')
  return v
}

export function supabaseClient() {
  return supabaseBackend?.client ?? null
}
