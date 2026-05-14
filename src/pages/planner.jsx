import { useState } from 'react'

function Planner() {
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState('')

  const addTask = () => {
    if (!input) return
    setTasks([...tasks, input])
    setInput('')
  }

  return (
    <div className="flex gap-6 p-6">
      <div className="flex-1">
        <h1 className="text-4xl font-bold mb-4">Planner</h1>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a task"
            className="flex-1 p-2 rounded bg-zinc-800 text-white"
          />
          <button
            onClick={addTask}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        <ul className="flex flex-col gap-2">
          {tasks.map((task, i) => (
            <li key={i} className="p-2 bg-zinc-800 rounded">
              {task}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-2">Upcoming Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-zinc-400">No tasks yet</p>
        ) : null}
      </div>
    </div>
  )
}

export default Planner