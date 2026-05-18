import { useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../../utils/theme.jsx'

const ROUTE_LABELS = {
  '/dashboard': 'Dashboard',
  '/chat':      'AI Chat',
  '/notes':     'Notes',
  '/planner':   'Planner',
}

function MoonIcon() {
  return (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
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
  )
}

function MenuIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24">
      <line x1="3" y1="6"  x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

export default function Navbar({ user, onLogout, onMenuToggle, isMobile }) {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  const pageLabel = ROUTE_LABELS[location.pathname] || 'Study AI'

  function handleLogout() {
    onLogout()
    navigate('/')
  }

  return (
    <header className="navbar">
      {/* Left — hamburger on mobile + page title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
        {isMobile && (
          <button className="btn btn-ghost btn-icon" onClick={onMenuToggle} aria-label="Toggle menu">
            <MenuIcon />
          </button>
        )}
        <h1 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', letterSpacing: '-0.01em' }}>
          {pageLabel}
        </h1>
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {/* Theme toggle */}
        <button
          className="btn btn-ghost btn-icon"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* User pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--surface-2)',
          border: '1px solid var(--border-md)',
          borderRadius: 'var(--radius)',
          padding: '7px 12px',
        }}>
          <div style={{
            width: 26, height: 26,
            background: 'var(--accent-soft)',
            border: '1.5px solid var(--accent)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)',
          }}>
            {(user?.name || 'U')[0].toUpperCase()}
          </div>
          {!isMobile && (
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>
              {user?.name}
            </span>
          )}
        </div>

        {/* Logout — desktop */}
        {!isMobile && (
          <button
            className="btn btn-ghost btn-icon"
            onClick={handleLogout}
            title="Sign out"
            style={{ color: 'var(--red)' }}
          >
            <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        )}
      </div>
    </header>
  )
}