import { useState } from 'react'
import { supabaseClient, useApp } from '../state/app'

export default function Login() {
  const { setMode } = useApp()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function send(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const { error } = await supabaseClient()!.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin, data: { name: name.trim() } },
    })
    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <div className="login">
      <h1>ICRA Field</h1>
      <p className="muted">Infection control and life safety checklists for healthcare construction crews.</p>
      {sent ? (
        <p className="card">Check {email} for a sign-in link. Open it on this device.</p>
      ) : (
        <form className="card stack" onSubmit={send}>
          <label className="field">
            Your name
            <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
          </label>
          <label className="field">
            Work email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          </label>
          {error && <p className="error">{error}</p>}
          <button className="btn-primary btn-block">Email me a sign-in link</button>
        </form>
      )}
      <button className="btn-ghost" onClick={() => setMode('demo')}>
        Try the demo instead (no account)
      </button>
    </div>
  )
}
