import { useState } from 'react'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'English', 'Computer Science', 'Economics', 'Geography', 'Other']
const PRIORITY = ['Low', 'Medium', 'High']
const priorityColor = { Low: 'text-green-400 bg-green-400/10 border-green-400/20', Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', High: 'text-red-400 bg-red-400/10 border-red-400/20' }
const subjectColor = ['bg-indigo-500', 'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-cyan-500', 'bg-yellow-500', 'bg-rose-500', 'bg-teal-500']

function getSubjectColor(subject) {
  return subjectColor[SUBJECTS.indexOf(subject) % subjectColor.length] || 'bg-zinc-500'
}

const today = new Date()
const todayDayIdx = (today.getDay() + 6) % 7 // 0=Mon

function getWeekDates() {
  const dates = []
  const monday = new Date(today)
  monday.setDate(today.getDate() - todayDayIdx)
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    dates.push(d)
  }
  return dates
}

const weekDates = getWeekDates()
const fmtDate = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

function SessionForm({ onAdd, onClose }) {
  const [form, setForm] = useState({
    subject: 'Mathematics',
    topic: '',
    day: DAYS[todayDayIdx],
    startTime: '09:00',
    endTime: '10:00',
    priority: 'Medium',
    notes: '',
  })
  const [error, setError] = useState('')

  const set = (k, v) => { setError(''); setForm(p => ({ ...p, [k]: v })) }

  const submit = (e) => {
    e.preventDefault()
    if (!form.topic.trim()) { setError('Please enter a topic.'); return }
    if (form.startTime >= form.endTime) { setError('End time must be after start time.'); return }
    onAdd({ ...form, id: Date.now(), done: false, topic: form.topic.trim() })
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-white font-semibold">Schedule Study Session</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          {/* Subject */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Subject</label>
              <select
                value={form.subject}
                onChange={e => set('subject', e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm rounded-lg px-3 py-2.5 outline-none focus:border-indigo-500"
              >
                {SUBJECTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Day</label>
              <select
                value={form.day}
                onChange={e => set('day', e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm rounded-lg px-3 py-2.5 outline-none focus:border-indigo-500"
              >
                {DAYS.map((d, i) => (
                  <option key={d} value={d}>{d} – {fmtDate(weekDates[i])}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Topic / Chapter</label>
            <input
              type="text"
              value={form.topic}
              onChange={e => set('topic', e.target.value)}
              placeholder="e.g. Quadratic Equations, Newton's Laws..."
              className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Start Time</label>
              <input
                type="time"
                value={form.startTime}
                onChange={e => set('startTime', e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm rounded-lg px-3 py-2.5 outline-none focus:border-indigo-500 [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">End Time</label>
              <input
                type="time"
                value={form.endTime}
                onChange={e => set('endTime', e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm rounded-lg px-3 py-2.5 outline-none focus:border-indigo-500 [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Priority + Notes */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Priority</label>
            <div className="flex gap-2">
              {PRIORITY.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => set('priority', p)}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors ${
                    form.priority === p ? priorityColor[p] : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Notes (optional)</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Any extra details for this session..."
              className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors">
              Add Session
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function SessionCard({ session, onToggle, onDelete }) {
  const duration = (() => {
    const [sh, sm] = session.startTime.split(':').map(Number)
    const [eh, em] = session.endTime.split(':').map(Number)
    const mins = (eh * 60 + em) - (sh * 60 + sm)
    return mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60 > 0 ? `${mins % 60}m` : ''}`.trim() : `${mins}m`
  })()

  return (
    <div className={`flex items-start gap-3 bg-zinc-900 border rounded-xl p-4 transition-all group ${
      session.done ? 'border-zinc-800 opacity-60' : 'border-zinc-800 hover:border-zinc-700'
    }`}>
      <button
        onClick={() => onToggle(session.id)}
        className={`mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
          session.done ? 'bg-green-500 border-green-500' : 'border-zinc-600 hover:border-indigo-500'
        }`}
      >
        {session.done && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`w-2 h-2 rounded-full ${getSubjectColor(session.subject)}`} />
          <span className={`text-sm font-semibold ${session.done ? 'line-through text-zinc-500' : 'text-white'}`}>
            {session.topic}
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${priorityColor[session.priority]}`}>
            {session.priority}
          </span>
        </div>
        <p className="text-xs text-zinc-500 mt-0.5">{session.subject}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-zinc-500 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {session.startTime} – {session.endTime}
          </span>
          <span className="text-xs text-indigo-400 font-medium">{duration}</span>
        </div>
        {session.notes && <p className="text-xs text-zinc-600 mt-1.5 italic">{session.notes}</p>}
      </div>

      <button
        onClick={() => onDelete(session.id)}
        className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all shrink-0"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  )
}

export default function Planner() {
  const [sessions, setSessions] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [activeDay, setActiveDay] = useState(DAYS[todayDayIdx])

  const addSession = (s) => {
    setSessions(prev => [...prev, s])
    setShowForm(false)
    setActiveDay(s.day)
  }

  const toggleSession = (id) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, done: !s.done } : s))
  }

  const deleteSession = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id))
  }

  const daySessions = sessions
    .filter(s => s.day === activeDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  const totalHours = (() => {
    const mins = sessions.reduce((acc, s) => {
      const [sh, sm] = s.startTime.split(':').map(Number)
      const [eh, em] = s.endTime.split(':').map(Number)
      return acc + (eh * 60 + em) - (sh * 60 + sm)
    }, 0)
    return (mins / 60).toFixed(1)
  })()

  const completedCount = sessions.filter(s => s.done).length

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Study Planner</h1>
          <p className="text-zinc-500 text-sm mt-0.5">
            Week of {fmtDate(weekDates[0])} – {fmtDate(weekDates[6])}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Session
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total Sessions', value: sessions.length },
          { label: 'Hours Planned', value: totalHours + 'h' },
          { label: 'Completed', value: `${completedCount}/${sessions.length}` },
        ].map(s => (
          <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Day tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 mb-6 scrollbar-hide">
        {DAYS.map((d, i) => {
          const count = sessions.filter(s => s.day === d).length
          const isToday = i === todayDayIdx
          return (
            <button
              key={d}
              onClick={() => setActiveDay(d)}
              className={`flex flex-col items-center gap-0.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shrink-0 border ${
                activeDay === d
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : isToday
                  ? 'bg-zinc-800 border-indigo-500/40 text-zinc-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <span>{d}</span>
              <span className="text-[10px] opacity-75">{fmtDate(weekDates[i])}</span>
              {count > 0 && (
                <span className={`text-[10px] font-semibold px-1.5 rounded-full ${
                  activeDay === d ? 'bg-white/20 text-white' : 'bg-indigo-600/20 text-indigo-400'
                }`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Sessions for selected day */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">
            {activeDay === DAYS[todayDayIdx] ? "Today's Sessions" : `${activeDay}'s Sessions`}
          </h2>
          <span className="text-xs text-zinc-500">{daySessions.length} session{daySessions.length !== 1 ? 's' : ''}</span>
        </div>

        {daySessions.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-zinc-500 text-sm">No sessions for {activeDay}</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-indigo-400 text-sm mt-2 hover:underline"
            >
              + Schedule one
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {daySessions.map(s => (
              <SessionCard key={s.id} session={s} onToggle={toggleSession} onDelete={deleteSession} />
            ))}
          </div>
        )}
      </div>

      {/* Subject breakdown */}
      {sessions.length > 0 && (
        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Subject Breakdown (This Week)</h3>
          <div className="space-y-3">
            {[...new Set(sessions.map(s => s.subject))].map(subject => {
              const subSessions = sessions.filter(s => s.subject === subject)
              const done = subSessions.filter(s => s.done).length
              const pct = Math.round((done / subSessions.length) * 100)
              return (
                <div key={subject}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${getSubjectColor(subject)}`} />
                      <span className="text-sm text-zinc-300">{subject}</span>
                    </div>
                    <span className="text-xs text-zinc-500">{done}/{subSessions.length} done</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getSubjectColor(subject)}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {showForm && <SessionForm onAdd={addSession} onClose={() => setShowForm(false)} />}
    </div>
  )
}