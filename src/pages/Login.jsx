import { useState } from 'react'
import { useTheme } from '../utils/theme.jsx'

export default function Login({ onLogin }) {
  const { theme, toggleTheme } = useTheme()
  const [name, setName]       = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    setError('')

    if (!trimmed) {
      setError('Please enter your name to continue.')
      return
    }
    if (trimmed.length < 2) {
      setError('Name must be at least 2 characters.')
      return
    }
    if (trimmed.length > 40) {
      setError('Name is too long.')
      return
    }

    setLoading(true)
    // Simulate auth — replace with real API call later
    setTimeout(() => {
      onLogin({ name: trimmed, joinedAt: new Date().toISOString() })
    }, 600)
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Theme toggle top-right */}
      <button
        onClick={toggleTheme}
        className="btn btn-ghost btn-icon"
        style={{ position: 'fixed', top: 16, right: 16 }}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1"  x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22"  x2="5.64"  y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1"  y1="12" x2="3"  y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" />
            <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        )}
      </button>

      <div className="fade-in" style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo + heading */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56,
            background: 'var(--accent)',
            borderRadius: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 32px var(--accent-glow)',
          }}>
            <svg width="28" height="28" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>

          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Study AI
          </h1>
          <p style={{ color: 'var(--text-2)', marginTop: 8, fontSize: '0.9375rem' }}>
            Your personal learning workspace
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: 32 }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--text)', marginBottom: 6 }}>
            Welcome back 👋
          </h2>
          <p style={{ color: 'var(--text-2)', fontSize: '0.875rem', marginBottom: 24 }}>
            Enter your name to get started. No password needed yet.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="name-input" className="field-label">
                Your name
              </label>
              <input
                id="name-input"
                type="text"
                className={`input ${error ? 'is-error' : ''}`}
                value={name}
                onChange={e => { setName(e.target.value); setError('') }}
                placeholder="e.g. Arjun, Priya, Ravi..."
                autoFocus
                autoComplete="given-name"
                maxLength={40}
              />
              {error && (
                <p className="input-error-text">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                    <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Setting up your space...
                </>
              ) : (
                <>
                  Continue
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-3)', fontSize: '0.8125rem', marginTop: 20 }}>
          Your data stays in your browser. No account required.
        </p>
      </div>
    </div>
  )
}