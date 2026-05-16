import { useState, useRef, useEffect } from 'react'

const COLORS = ['zinc', 'indigo', 'blue', 'green', 'yellow', 'red', 'purple', 'pink']
const colorMap = {
  zinc:   'bg-zinc-500',
  indigo: 'bg-indigo-500',
  blue:   'bg-blue-500',
  green:  'bg-green-500',
  yellow: 'bg-yellow-500',
  red:    'bg-red-500',
  purple: 'bg-purple-500',
  pink:   'bg-pink-500',
}
const borderMap = {
  zinc:   'border-zinc-500/40',
  indigo: 'border-indigo-500/40',
  blue:   'border-blue-500/40',
  green:  'border-green-500/40',
  yellow: 'border-yellow-500/40',
  red:    'border-red-500/40',
  purple: 'border-purple-500/40',
  pink:   'border-pink-500/40',
}

function NoteCard({ note, onOpen, onDelete }) {
  const preview = note.content.slice(0, 120)
  return (
    <div
      className={`group bg-zinc-900 border ${borderMap[note.color]} rounded-2xl p-5 cursor-pointer hover:bg-zinc-800/60 transition-all flex flex-col gap-3`}
      onClick={() => onOpen(note)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`w-2.5 h-2.5 rounded-full ${colorMap[note.color]} shrink-0`} />
          <h3 className="text-white font-semibold text-sm leading-tight">{note.title || 'Untitled Note'}</h3>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onDelete(note.id) }}
          className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all shrink-0 p-0.5"
          title="Delete note"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {note.content ? (
        <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">{preview}{note.content.length > 120 ? '...' : ''}</p>
      ) : (
        <p className="text-zinc-600 text-xs italic">No content yet...</p>
      )}

      <div className="flex items-center justify-between mt-auto pt-1">
        <div className="flex flex-wrap gap-1">
          {note.tags.map(tag => (
            <span key={tag} className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-700">
              #{tag}
            </span>
          ))}
        </div>
        <span className="text-[11px] text-zinc-600 shrink-0">{note.updatedAt}</span>
      </div>
    </div>
  )
}

function NoteEditor({ note, onSave, onClose }) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [color, setColor] = useState(note.color)
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState(note.tags)
  const textareaRef = useRef(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const addTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault()
      const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
      if (!tags.includes(t)) setTags(prev => [...prev, t])
      setTagInput('')
    }
  }

  const removeTag = (t) => setTags(prev => prev.filter(x => x !== t))

  const save = () => {
    onSave({ ...note, title: title.trim() || 'Untitled Note', content, color, tags })
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-2xl flex flex-col max-h-[90vh] shadow-2xl">
        {/* Editor toolbar */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-zinc-800">
          <div className="flex items-center gap-1.5">
            {COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                title={c}
                className={`w-4 h-4 rounded-full ${colorMap[c]} transition-transform ${color === c ? 'scale-125 ring-2 ring-white ring-offset-1 ring-offset-zinc-900' : 'opacity-50 hover:opacity-100'}`}
              />
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={onClose} className="text-sm text-zinc-500 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-zinc-800">
              Discard
            </button>
            <button
              onClick={save}
              className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg font-medium transition-colors"
            >
              Save Note
            </button>
          </div>
        </div>

        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Note title..."
          className="bg-transparent text-white text-xl font-bold px-5 pt-4 pb-2 outline-none placeholder-zinc-700 border-none"
        />

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5 px-5 pb-3">
          {tags.map(tag => (
            <span key={tag} className="flex items-center gap-1 text-xs bg-zinc-800 text-zinc-400 px-2.5 py-0.5 rounded-full border border-zinc-700">
              #{tag}
              <button onClick={() => removeTag(tag)} className="text-zinc-600 hover:text-red-400 ml-0.5">×</button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={addTag}
            placeholder={tags.length === 0 ? 'Add tags (press Enter)...' : '+'}
            className="bg-transparent text-xs text-zinc-500 outline-none placeholder-zinc-600 min-w-0 w-32"
          />
        </div>

        {/* Content */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Start writing your note here..."
          className="flex-1 bg-transparent text-zinc-300 text-sm leading-relaxed px-5 pb-5 outline-none resize-none placeholder-zinc-700 min-h-[260px]"
        />

        <div className="px-5 py-2 border-t border-zinc-800">
          <p className="text-xs text-zinc-600">{content.length} characters · {content.split(/\s+/).filter(Boolean).length} words</p>
        </div>
      </div>
    </div>
  )
}

const fmt = () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [editingNote, setEditingNote] = useState(null)
  const [search, setSearch] = useState('')
  const [filterTag, setFilterTag] = useState('')
  const [view, setView] = useState('grid') // 'grid' | 'list'

  const allTags = [...new Set(notes.flatMap(n => n.tags))]

  const filtered = notes.filter(n => {
    const matchSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
    const matchTag = filterTag ? n.tags.includes(filterTag) : true
    return matchSearch && matchTag
  })

  const openNew = () => {
    setEditingNote({
      id: null,
      title: '',
      content: '',
      color: 'indigo',
      tags: [],
      updatedAt: fmt(),
    })
  }

  const openExisting = (note) => {
    setEditingNote({ ...note })
  }

  const saveNote = (updatedNote) => {
    if (updatedNote.id === null) {
      // new note
      setNotes(prev => [{ ...updatedNote, id: Date.now(), updatedAt: fmt() }, ...prev])
    } else {
      setNotes(prev => prev.map(n => n.id === updatedNote.id ? { ...updatedNote, updatedAt: fmt() } : n))
    }
    setEditingNote(null)
  }

  const deleteNote = (id) => {
    if (window.confirm('Delete this note?')) {
      setNotes(prev => prev.filter(n => n.id !== id))
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">My Notes</h1>
          <p className="text-zinc-500 text-sm mt-0.5">{notes.length} note{notes.length !== 1 ? 's' : ''} saved</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Note
        </button>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5">
          <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="bg-transparent text-sm text-white placeholder-zinc-500 outline-none flex-1"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-zinc-600 hover:text-zinc-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Tag filter */}
          {allTags.length > 0 && (
            <select
              value={filterTag}
              onChange={e => setFilterTag(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500"
            >
              <option value="">All tags</option>
              {allTags.map(t => <option key={t} value={t}>#{t}</option>)}
            </select>
          )}

          {/* View toggle */}
          <div className="flex bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden">
            {[['grid', 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'],
              ['list', 'M4 6h16M4 10h16M4 14h16M4 18h16']].map(([v, path]) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`p-2.5 transition-colors ${view === v ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-white'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notes content */}
      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-white font-semibold text-lg">No notes yet</h2>
          <p className="text-zinc-500 text-sm mt-1 mb-5">Create your first note and start capturing knowledge.</p>
          <button
            onClick={openNew}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            + Create First Note
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-zinc-500 text-sm">No notes match your search.</p>
          <button onClick={() => { setSearch(''); setFilterTag('') }} className="text-indigo-400 text-sm mt-2 hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        <div className={view === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'flex flex-col gap-3'
        }>
          {filtered.map(note => (
            <NoteCard key={note.id} note={note} onOpen={openExisting} onDelete={deleteNote} />
          ))}
        </div>
      )}

      {/* Tag chips when notes exist */}
      {allTags.length > 0 && (
        <div className="mt-8 pt-6 border-t border-zinc-800">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">Browse by tag</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterTag('')}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                !filterTag ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'
              }`}
            >
              All
            </button>
            {allTags.map(t => (
              <button
                key={t}
                onClick={() => setFilterTag(t === filterTag ? '' : t)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  filterTag === t ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'
                }`}
              >
                #{t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Editor modal */}
      {editingNote && (
        <NoteEditor
          note={editingNote}
          onSave={saveNote}
          onClose={() => setEditingNote(null)}
        />
      )}
    </div>
  )
}