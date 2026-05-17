import { NavLink, useNavigate } from 'react-router-dom'

const NAV = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    to: '/chat',
    label: 'AI Chat',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    to: '/notes',
    label: 'Notes',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline strokeLinecap="round" strokeLinejoin="round" points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round" />
        <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round" />
        <line x1="10" y1="9" x2="8" y2="9" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: '/planner',
    label: 'Planner',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" />
        <line x1="8"  y1="2" x2="8"  y2="6" strokeLinecap="round" />
        <line x1="3"  y1="10" x2="21" y2="10" />
        <path strokeLinecap="round" d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </svg>
    ),
  },
]

function Avatar({ name }) {
  const initials = name
    ? name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'
  return (
    <div style={{
      width: 34, height: 34,
      borderRadius: '50%',
      background: 'var(--accent-soft)',
      border: '1.5px solid var(--accent)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '0.8rem', fontWeight: 700,
      color: 'var(--accent)',
      flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}

export default function Sidebar({ user, onLogout, isMobile, isOpen, onLinkClick }) {
  const navigate = useNavigate()

  function handleLogout() {
    onLogout()
    navigate('/')
  }

  const sidebarClass = [
    'sidebar',
    isMobile && !isOpen ? 'mobile-closed' : '',
  ].filter(Boolean).join(' ')

  return (
    <aside className={sidebarClass}>
      {/* Brand */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 18px',
        height: 'var(--nav-h)',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <div style={{
          width: 32, height: 32,
          background: 'var(--accent)',
          borderRadius: 9,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="17" height="17" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', letterSpacing: '-0.02em' }}>
          Study AI
        </span>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <p style={{
          fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-3)',
          textTransform: 'uppercase', letterSpacing: '0.08em',
          padding: '8px 10px 4px',
        }}>
          Menu
        </p>

        {NAV.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onLinkClick}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div style={{
        padding: '12px 10px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        flexShrink: 0,
      }}>
        {/* User info row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 10px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--surface-2)',
        }}>
          <Avatar name={user?.name} />
          <div style={{ minWidth: 0 }}>
            <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.2 }}>
              {user?.name || 'User'}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', lineHeight: 1.2, marginTop: 2 }}>
              Student
            </p>
          </div>
        </div>

        {/* Logout */}
        <button className="btn btn-ghost" onClick={handleLogout} style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--red)', padding: '9px 10px' }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign out
        </button>
      </div>
    </aside>
  )
}