import { useState, useEffect, useRef } from 'react'
import { storage } from '../utils/storage.js'
import PageContainer from '../components/ui/PageContainer.jsx'

function timeSince(iso) {
  const seconds = Math.floor((Date.now() - new Date(iso)) / 1000)
  if (seconds < 60)  return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

// ─── Note Editor Modal ───────────────────────────────────────────────────────
function NoteModal({ note, onSave, onClose }) {
  const [title,   setTitle]   = useState(note?.title   || '')
  const [content, setContent] = useState(note?.content || '')
  const [error,   setError]   = useState('')
  const titleRef = useRef(null)

  useEffect(() => {
    titleRef.current?.focus()

    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  function handleSave() {
    const trimTitle   = title.trim()
    const trimContent = content.trim()
    if (!trimTitle && !trimContent) {
      setError('Please add a title or some content before saving.')
      return
    }

    onSave({
      id:        note?.id || Date.now(),
      title:     trimTitle || 'Untitled note',
      content:   trimContent,
      createdAt: note?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Modal header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          <p style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.9375rem' }}>
            {note?.id ? 'Edit note' : 'New note'}
          </p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>
              {wordCount} word{wordCount !== 1 ? 's' : ''}
            </span>
            <button className="btn btn-ghost btn-icon-sm" onClick={onClose} aria-label="Close">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                <line x1="18" y1="6"  x2="6"  y2="18" />
                <line x1="6"  y1="6"  x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
          <input
            ref={titleRef}
            type="text"
            className="input"
            value={title}
            onChange={e => { setTitle(e.target.value); setError('') }}
            placeholder="Note title..."
            maxLength={120}
            style={{ fontWeight: 600, fontSize: '1rem' }}
          />
          <textarea
            className="input"
            value={content}
            onChange={e => { setContent(e.target.value); setError('') }}
            placeholder="Write your note here — ideas, summaries, formulas, anything..."
            rows={10}
            style={{ resize: 'vertical', minHeight: 200, lineHeight: 1.7 }}
          />
          {error && <p className="input-error-text">{error}</p>}
        </div>

        {/* Modal footer */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: 10,
          padding: '16px 24px',
          borderTop: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>
            {note?.id ? 'Save changes' : 'Create note'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Note Card ───────────────────────────────────────────────────────────────
function NoteCard({ note, onEdit, onDelete }) {
  return (
    <div
      className="note-card"
      onClick={() => onEdit(note)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onEdit(note)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text)', lineHeight: 1.3, flex: 1 }}>
          {note.title}
        </h3>
        <button
          className="btn btn-ghost btn-icon-sm"
          onClick={e => { e.stopPropagation(); onDelete(note.id) }}
          aria-label="Delete note"
          style={{ flexShrink: 0, color: 'var(--text-3)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
          </svg>
        </button>
      </div>

      {note.content && (
        <p className="truncate-3" style={{ fontSize: '0.85rem', color: 'var(--text-2)', lineHeight: 1.6 }}>
          {note.content}
        </p>
      )}

      <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: 4 }}>
        {timeSince(note.updatedAt)}
      </p>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function Notes() {
  const [notes,       setNotes]       = useState(() => storage.get('notes') || [])
  const [editingNote, setEditingNote] = useState(null)  // null | note object | {}
  const [showModal,   setShowModal]   = useState(false)
  const [search,      setSearch]      = useState('')

  useEffect(() => {
    storage.set('notes', notes)
  }, [notes])

  function openNew() {
    setEditingNote({})
    setShowModal(true)
  }

  function openEdit(note) {
    setEditingNote(note)
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditingNote(null)
  }

  function saveNote(updatedNote) {
    setNotes(prev => {
      const exists = prev.find(n => n.id === updatedNote.id)
      if (exists) {
        return prev.map(n => n.id === updatedNote.id ? updatedNote : n)
      }
      return [updatedNote, ...prev]
    })
    closeModal()
  }

  function deleteNote(id) {
    if (!window.confirm('Delete this note?')) return
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  const filtered = notes.filter(n => {
    const q = search.toLowerCase()
    return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
  })

  return (
    <PageContainer
      title="Notes"
      subtitle={notes.length > 0 ? `${notes.length} note${notes.length !== 1 ? 's' : ''} saved` : 'Capture what you learn'}
      action={
        <button className="btn btn-primary" onClick={openNew}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5"  y1="12" x2="19" y2="12" />
          </svg>
          New note
        </button>
      }
    >
      {/* Search */}
      {notes.length > 0 && (
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <svg
            width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            className="input"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search notes..."
            style={{ paddingLeft: 42 }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="btn btn-ghost btn-icon-sm"
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                <line x1="18" y1="6"  x2="6"  y2="18" />
                <line x1="6"  y1="6"  x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Empty state */}
      {notes.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" />
              <polyline strokeLinecap="round" points="14 2 14 8 20 8" />
            </svg>
          </div>
          <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text)' }}>No notes yet</p>
          <p style={{ color: 'var(--text-2)', fontSize: '0.875rem' }}>
            Create a note to start capturing ideas, formulas, and summaries.
          </p>
          <button className="btn btn-primary" onClick={openNew} style={{ marginTop: 8 }}>
            Create your first note
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card empty-state">
          <p style={{ color: 'var(--text-2)', fontSize: '0.875rem' }}>
            No notes match "{search}"
          </p>
          <button className="btn btn-ghost btn-sm" onClick={() => setSearch('')}>
            Clear search
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {filtered.map(note => (
            <NoteCard key={note.id} note={note} onEdit={openEdit} onDelete={deleteNote} />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <NoteModal
          note={editingNote}
          onSave={saveNote}
          onClose={closeModal}
        />
      )}
    </PageContainer>
  )
}