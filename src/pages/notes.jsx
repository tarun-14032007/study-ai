import { useState } from 'react'

function Notes() {
  const [notes, setNotes] = useState([])
  const [input, setInput] = useState('')

  const addNote = () => {
    if (!input) return
    setNotes([...notes, input])
    setInput('')
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-4">Notes</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a note"
          className="flex-1 p-2 rounded bg-zinc-800 text-white"
        />
        <button
          onClick={addNote}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>
      <ul className="flex flex-col gap-2">
        {notes.map((note, i) => (
          <li key={i} className="p-2 bg-zinc-800 rounded">
            {note}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Notes