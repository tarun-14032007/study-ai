import { useState, useEffect, useRef } from 'react'
import { storage } from '../utils/storage.js'
import PageContainer from '../components/ui/PageContainer.jsx'

const FILTERS = ['All', 'Active', 'Done']

function CheckIcon() {
  return (
    <svg width="12" height="12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  )
}

export default function Planner() {
  const [tasks,     setTasks]     = useState(() => storage.get('tasks') || [])
  const [input,     setInput]     = useState('')
  const [filter,    setFilter]    = useState('All')
  const [error,     setError]     = useState('')
  const inputRef = useRef(null)

  // Persist to localStorage whenever tasks change
  useEffect(() => {
    storage.set('tasks', tasks)
  }, [tasks])

  function addTask(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text) {
      setError('Please type a task before adding.')
      inputRef.current?.focus()
      return
    }
    if (text.length > 200) {
      setError('Task text is too long (max 200 chars).')
      return
    }

    const newTask = {
      id:        Date.now(),
      text,
      done:      false,
      createdAt: new Date().toISOString(),
    }

    setTasks(prev => [newTask, ...prev])
    setInput('')
    setError('')
  }

  function toggleTask(id) {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, done: !t.done } : t)
    )
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  function clearDone() {
    setTasks(prev => prev.filter(t => !t.done))
  }

  const filtered = tasks.filter(t => {
    if (filter === 'Active') return !t.done
    if (filter === 'Done')   return  t.done
    return true
  })

  const doneCount   = tasks.filter(t =>  t.done).length
  const activeCount = tasks.filter(t => !t.done).length

  return (
    <PageContainer
      title="Study Planner"
      subtitle={
        tasks.length > 0
          ? `${activeCount} active · ${doneCount} completed`
          : 'Add tasks to start planning your study sessions'
      }
    >
      {/* Add task form */}
      <div className="card" style={{ padding: '18px 20px', marginBottom: 20 }}>
        <form onSubmit={addTask}>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <input
                ref={inputRef}
                type="text"
                className={`input ${error ? 'is-error' : ''}`}
                value={input}
                onChange={e => { setInput(e.target.value); setError('') }}
                placeholder="Add a task — e.g. Revise Chapter 5, Practice integrals..."
                maxLength={200}
                style={{ borderRadius: 10 }}
              />
              {error && <p className="input-error-text">{error}</p>}
            </div>
            <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5"  y1="12" x2="19" y2="12" />
              </svg>
              Add task
            </button>
          </div>
        </form>
      </div>

      {/* Filter tabs + clear done */}
      {tasks.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 4, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 4 }}>
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="btn btn-sm"
                style={{
                  background: filter === f ? 'var(--accent)' : 'transparent',
                  color:      filter === f ? '#fff' : 'var(--text-2)',
                  padding: '7px 16px',
                }}
              >
                {f}
                {f === 'Active' && activeCount > 0 && (
                  <span className="badge badge-muted" style={{ marginLeft: 2 }}>{activeCount}</span>
                )}
                {f === 'Done' && doneCount > 0 && (
                  <span className="badge" style={{ marginLeft: 2, background: 'var(--green-soft)', color: 'var(--green)' }}>{doneCount}</span>
                )}
              </button>
            ))}
          </div>

          {doneCount > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={clearDone} style={{ color: 'var(--red)' }}>
              Clear completed
            </button>
          )}
        </div>
      )}

      {/* Task list */}
      {tasks.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" />
              <line x1="8"  y1="2" x2="8"  y2="6" strokeLinecap="round" />
              <line x1="3"  y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text)' }}>No tasks yet</p>
          <p style={{ color: 'var(--text-2)', fontSize: '0.875rem' }}>
            Type a task above and press Add to get started.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card empty-state">
          <p style={{ color: 'var(--text-2)', fontSize: '0.875rem' }}>
            No {filter.toLowerCase()} tasks.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(task => (
            <div
              key={task.id}
              className={`task-item ${task.done ? 'done' : ''}`}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleTask(task.id)}
                className={`task-checkbox ${task.done ? 'checked' : ''}`}
                aria-label={task.done ? 'Mark incomplete' : 'Mark complete'}
              >
                {task.done && <CheckIcon />}
              </button>

              {/* Text */}
              <span style={{
                flex: 1,
                fontSize: '0.9375rem',
                color: task.done ? 'var(--text-3)' : 'var(--text)',
                textDecoration: task.done ? 'line-through' : 'none',
                lineHeight: 1.4,
                wordBreak: 'break-word',
              }}>
                {task.text}
              </span>

              {/* Timestamp */}
              <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', flexShrink: 0, display: window.innerWidth < 480 ? 'none' : undefined }}>
                {new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>

              {/* Delete */}
              <button
                onClick={() => deleteTask(task.id)}
                className="btn btn-ghost btn-icon-sm"
                aria-label="Delete task"
                style={{ color: 'var(--text-3)', flexShrink: 0 }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Summary bar — only when tasks exist */}
      {tasks.length > 0 && (
        <div style={{
          marginTop: 24,
          padding: '14px 18px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
        }}>
          <div className="progress-bar" style={{ flex: 1, minWidth: 120 }}>
            <div className="progress-fill" style={{ width: `${tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0}%` }} />
          </div>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-2)', flexShrink: 0 }}>
            {doneCount} of {tasks.length} done
            {tasks.length > 0 && ` (${Math.round((doneCount / tasks.length) * 100)}%)`}
          </span>
        </div>
      )}
    </PageContainer>
  )
}