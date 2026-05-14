import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const quotes = [
  "The secret of getting ahead is getting started.",
  "Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.",
  "Education is not the filling of a pail, but the lighting of a fire.",
  "The more that you read, the more things you will know.",
]

function StatCard({ label, value, sub, color }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
      <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
      {sub && <p className="text-xs text-zinc-500 mt-1">{sub}</p>}
    </div>
  )
}

function QuickAction({ icon, label, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-start gap-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 text-left transition-all hover:bg-zinc-800/50 group"
    >
      <div className="w-10 h-10 rounded-xl bg-zinc-800 group-hover:bg-zinc-700 flex items-center justify-center text-indigo-400 shrink-0 transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{description}</p>
      </div>
    </button>
  )
}

export default function Dashboard({ user }) {
  const navigate = useNavigate()
  const quote = quotes[Math.floor(Math.random() * quotes.length)]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const [tasks, setTasks] = useState([])
  const [taskInput, setTaskInput] = useState('')

  const addTask = (e) => {
    e.preventDefault()
    if (!taskInput.trim()) return
    setTasks(prev => [{ id: Date.now(), text: taskInput.trim(), done: false }, ...prev])
    setTaskInput('')
  }

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const removeTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-indigo-600/20 via-purple-600/10 to-transparent border border-indigo-500/20 rounded-2xl px-6 py-6">
        <p className="text-zinc-400 text-sm">{greeting} 👋</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
          Welcome back, {user?.name?.split(' ')[0] || 'there'}!
        </h1>
        <p className="text-zinc-400 text-sm mt-3 italic">"{quote}"</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Study Streak" value="0 days" sub="Start today!" color="text-orange-400" />
        <StatCard label="Notes Created" value="0" sub="Create your first note" color="text-blue-400" />
        <StatCard label="Tasks Done" value={`${tasks.filter(t => t.done).length}`} sub={`of ${tasks.length} today`} color="text-green-400" />
        <StatCard label="AI Chats" value="0" sub="Ask anything" color="text-purple-400" />
      </div>

      {/* Quick actions */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <QuickAction
            onClick={() => navigate('/chat')}
            label="Ask AI a Question"
            description="Get instant explanations and answers"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
          />
          <QuickAction
            onClick={() => navigate('/notes')}
            label="Write a Note"
            description="Capture what you've learned"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>}
          />
          <QuickAction
            onClick={() => navigate('/planner')}
            label="Plan Your Day"
            description="Schedule your study sessions"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          />
        </div>
      </section>

      {/* Today's tasks */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">Today's Tasks</h2>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <form onSubmit={addTask} className="flex gap-2 mb-4">
            <input
              type="text"
              value={taskInput}
              onChange={e => setTaskInput(e.target.value)}
              placeholder="Add a task for today..."
              className="flex-1 bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-2 text-sm outline-none focus:border-indigo-500 transition-all"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0"
            >
              Add
            </button>
          </form>

          {tasks.length === 0 ? (
            <p className="text-center text-zinc-600 text-sm py-6">No tasks yet — add one above!</p>
          ) : (
            <ul className="space-y-2">
              {tasks.map(task => (
                <li key={task.id} className="flex items-center gap-3 group">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                      task.done ? 'bg-green-500 border-green-500' : 'border-zinc-600 hover:border-indigo-500'
                    }`}
                  >
                    {task.done && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <span className={`flex-1 text-sm ${task.done ? 'line-through text-zinc-600' : 'text-zinc-200'}`}>
                    {task.text}
                  </span>
                  <button
                    onClick={() => removeTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}