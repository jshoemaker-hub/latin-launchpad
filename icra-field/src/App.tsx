import { BrowserRouter, NavLink, Navigate, Outlet, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { DEMO_PERSONAS } from './data/seed'
import { HOSPITAL_ROLES, ROLE_LABEL } from './domain/types'
import { AppProvider, useApp } from './state/app'
import { ProjectProvider, useProject } from './state/project'
import Login from './pages/Login'
import Projects from './pages/Projects'
import Today from './pages/Today'
import Permits from './pages/Permits'
import NewPermit from './pages/NewPermit'
import Permit from './pages/Permit'
import Checklist from './pages/Checklist'
import Issues from './pages/Issues'
import Activity from './pages/Activity'
import Team from './pages/Team'
import Settings from './pages/Settings'
import Report from './pages/Report'
import Shutdowns from './pages/Shutdowns'
import Weekly from './pages/Weekly'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </AppProvider>
  )
}

function Shell() {
  const { ready, user, mode } = useApp()
  if (!ready) return <div className="splash">Loading…</div>
  if (mode === 'supabase' && !user) return <Login />
  return (
    <Routes>
      <Route path="/" element={<Projects />} />
      <Route path="/p/:projectId" element={<ProjectLayout />}>
        <Route index element={<Today />} />
        <Route path="permits" element={<Permits />} />
        <Route path="permits/new" element={<NewPermit />} />
        <Route path="permit/:permitId" element={<Permit />} />
        <Route path="permit/:permitId/report" element={<Report />} />
        <Route path="c/:checklistId" element={<Checklist />} />
        <Route path="issues" element={<Issues />} />
        <Route path="shutdowns" element={<Shutdowns />} />
        <Route path="weekly" element={<Weekly />} />
        <Route path="activity" element={<Activity />} />
        <Route path="team" element={<Team />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function ProjectLayout() {
  const { projectId } = useParams()
  return (
    <ProjectProvider projectId={projectId!}>
      <ProjectChrome />
    </ProjectProvider>
  )
}

function ProjectChrome() {
  const { state, loading, me, pending } = useProject()
  const { mode, persona, setPersona } = useApp()
  const { pathname } = useLocation()
  const openIssues = Object.values(state.deficiencies).filter((d) => !d.resolvedAt).length
  const shutdownAlerts = Object.values(state.shutdowns).filter((s) => s.status === 'active' || (s.status === 'pending' && me && HOSPITAL_ROLES.includes(me.role))).length
  // The hospital dashboard and weekly report are tables meant for a desk screen.
  const wide = /\/weekly$/.test(pathname) || (me && HOSPITAL_ROLES.includes(me.role) && /^\/p\/[^/]+\/?$/.test(pathname))
  if (loading) return <div className="splash">Loading project…</div>
  return (
    <div className="app">
      <header className="topbar no-print">
        <NavLink to="/" className="topbar-back" aria-label="All projects">
          ‹
        </NavLink>
        <div className="topbar-title">
          <div className="topbar-name">{state.name || 'Project'}</div>
          <div className="topbar-sub">
            {navigator.onLine ? '● Online' : '○ Offline'}
            {pending > 0 && ` · ${pending} waiting to sync`}
          </div>
        </div>
        {mode === 'demo' && persona ? (
          <select className="persona" value={persona.id} onChange={(e) => setPersona(e.target.value)} aria-label="Acting as">
            {DEMO_PERSONAS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name.split(' ')[0]} · {ROLE_LABEL[p.role]}
              </option>
            ))}
          </select>
        ) : (
          me && <span className="role-tag">{ROLE_LABEL[me.role]}</span>
        )}
      </header>
      {mode === 'demo' && <div className="demo-banner no-print">Demo mode: data stays in this browser. Switch roles at top right to see each person's view.</div>}
      {mode === 'supabase' && !me && <div className="demo-banner warn no-print">You're not on this project's team yet. Ask the superintendent to add your email.</div>}
      <main className={`content${wide ? ' wide' : ''}`}>
        <Outlet />
      </main>
      <nav className="tabbar no-print">
        <NavLink end to="">
          <span aria-hidden>☀</span>Today
        </NavLink>
        <NavLink to="permits">
          <span aria-hidden>▦</span>Permits
        </NavLink>
        <NavLink to="shutdowns">
          <span aria-hidden>⏻</span>Shutdowns{shutdownAlerts > 0 && <b className="badge">{shutdownAlerts}</b>}
        </NavLink>
        <NavLink to="issues">
          <span aria-hidden>⚠</span>Issues{openIssues > 0 && <b className="badge">{openIssues}</b>}
        </NavLink>
        <NavLink to="activity">
          <span aria-hidden>≡</span>Log
        </NavLink>
        <NavLink to="team">
          <span aria-hidden>☺</span>Team
        </NavLink>
      </nav>
    </div>
  )
}
