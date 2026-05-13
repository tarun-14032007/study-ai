// src/components/layout/Sidebar.jsx
import React from 'react'
import { NavLink } from 'react-router-dom'

function Sidebar() {
  const links = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Chat', path: '/chat' },
    { name: 'Notes', path: '/notes' },
    { name: 'Planner', path: '/planner' },
  ]

  return (
    <aside className="w-60 bg-zinc-800 p-6 flex flex-col">
      {links.map((link) => (
        <NavLink
          key={link.name}
          to={link.path}
          className={({ isActive }) =>
            `mb-4 p-3 rounded hover:bg-zinc-700 transition ${
              isActive ? 'bg-zinc-700 font-bold' : ''
            }`
          }
        >
          {link.name}
        </NavLink>
      ))}
    </aside>
  )
}

export default Sidebar