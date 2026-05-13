import { NavLink } from 'react-router-dom'

function Sidebar() {
  const links = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Chat', path: '/chat' },
    { name: 'Notes', path: '/notes' },
    { name: 'Planner', path: '/planner' },
  ]

  return (
    <aside className="w-64 min-h-screen bg-zinc-800 border-r border-zinc-700 p-6">

      <h1 className="text-3xl font-bold mb-10">
        Study AI
      </h1>

      <nav className="flex flex-col gap-3">

        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `p-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-zinc-700'
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}

      </nav>

    </aside>
  )
}

export default Sidebar