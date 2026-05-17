import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { storage } from '../utils/storage.js'
import StatCard from '../components/ui/StatCard.jsx'
import PageContainer from '../components/ui/PageContainer.jsx'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function QuickAction({ icon, label, desc, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="card"
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 14,
        padding: '18px 20px',
        cursor: 'pointer', border: 'none',
        background: 'var(--surface)',
        transition: 'all 0.15s',
        borderRadius: 'var(--radius-lg)',
        width: '100%', textAlign: 'left',
        borderColor: 'var(--border)',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-md)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 11,
        background: color.bg, color: color.fg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: 3 }}>{label}</p>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-2)', lineHeight: 1.4 }}>{desc}</p>
      </div>
    </button>
  )
}

export default function Dashboard({ user }) {
  const navigate = useNavigate()

  const [stats, setStats] = useState({ tasks: 0, done: 0, notes: 0, messages: 0 })

  // Load real counts from localStorage
  useEffect(() => {
    function readStats() {
      const tasks    = storage.get('tasks')    || []
      const notes    = storage.get('notes')    || []
      const messages = storage.get('messages') || []

      setStats({
        tasks:    tasks.length,
        done:     tasks.filter(t => t.done).length,
        notes:    notes.length,
        messages: messages.filter(m => m.role === 'user').length,
      })
    }

    readStats()
    // Re-read when user navigates back to this tab
    window.addEventListener('focus', readStats)
    return () => window.removeEventListener('focus', readStats)
  }, [])

  const completionPct = stats.tasks > 0
    ? Math.round((stats.done / stats.tasks) * 100)
    : 0

  return (
    <PageContainer>
      {/* Welcome */}
      <div className="card" style={{
        padding: '28px 32px',
        marginBottom: 28,
        background: 'linear-gradient(135deg, var(--surface) 60%, var(--accent-soft) 100%)',
        border: '1px solid var(--border-md)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circle */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 180, height: 180,
          borderRadius: '50%',
          background: 'var(--accent-glow)',
          pointerEvents: 'none',
        }} />

        <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', fontWeight: 500, marginBottom: 6 }}>
          {getGreeting()} 👋
        </p>
        <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 10 }}>
          {user?.name}
        </h2>
        <p style={{ color: 'var(--text-2)', fontSize: '0.9rem', maxWidth: 480, lineHeight: 1.6 }}>
          {stats.tasks === 0 && stats.notes === 0
            ? "You haven't added anything yet — start by planning your day or jotting down a note."
            : `You have ${stats.tasks - stats.done} task${stats.tasks - stats.done !== 1 ? 's' : ''} remaining${stats.notes > 0 ? ` and ${stats.notes} note${stats.notes !== 1 ? 's' : ''} saved` : ''}.`}
        </p>

        {/* Progress bar — only show if there are tasks */}
        {stats.tasks > 0 && (
          <div style={{ marginTop: 18, maxWidth: 280 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-2)', fontWeight: 600 }}>Today's progress</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 700 }}>{completionPct}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${completionPct}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 28 }}>
        <StatCard
          label="Total Tasks"
          value={stats.tasks}
          note={stats.tasks === 0 ? 'Go to Planner to add tasks' : `${stats.done} completed`}
          color="var(--accent)"
          bg="var(--accent-soft)"
          icon={
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <polyline strokeLinecap="round" strokeLinejoin="round" points="9 11 12 14 22 4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          }
        />
        <StatCard
          label="Completed"
          value={stats.done}
          note={stats.tasks > 0 ? `${completionPct}% of all tasks` : 'No tasks yet'}
          color="var(--green)"
          bg="var(--green-soft)"
          icon={
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          }
        />
        <StatCard
          label="Notes Saved"
          value={stats.notes}
          note={stats.notes === 0 ? 'Write your first note' : `${stats.notes} note${stats.notes !== 1 ? 's' : ''}`}
          color="var(--yellow)"
          bg="var(--yellow-soft)"
          icon={
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline strokeLinecap="round" strokeLinejoin="round" points="14 2 14 8 20 8" />
            </svg>
          }
        />
        <StatCard
          label="Messages Sent"
          value={stats.messages}
          note={stats.messages === 0 ? 'Chat with AI to get help' : 'to your AI tutor'}
          color="var(--red)"
          bg="var(--red-soft)"
          icon={
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          }
        />
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: 8 }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>
          Quick actions
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          <QuickAction
            label="Add a task"
            desc="Plan what you need to study today"
            onClick={() => navigate('/planner')}
            color={{ bg: 'var(--accent-soft)', fg: 'var(--accent)' }}
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8"  y1="2" x2="8"  y2="6" />
                <line x1="3"  y1="10" x2="21" y2="10" />
                <line x1="12" y1="14" x2="12" y2="18" />
                <line x1="10" y1="16" x2="14" y2="16" />
              </svg>
            }
          />
          <QuickAction
            label="Write a note"
            desc="Capture ideas, formulas, or summaries"
            onClick={() => navigate('/notes')}
            color={{ bg: 'var(--yellow-soft)', fg: 'var(--yellow)' }}
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            }
          />
          <QuickAction
            label="Ask the AI"
            desc="Get explanations or help with a topic"
            onClick={() => navigate('/chat')}
            color={{ bg: 'var(--green-soft)', fg: 'var(--green)' }}
            icon={
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            }
          />
        </div>
      </div>
    </PageContainer>
  )
}