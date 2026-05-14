import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar.jsx'
import Sidebar from '../components/layout/Sidebar.jsx'

export default function DashboardLayout({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={onLogout}
      />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={onLogout}
        />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}