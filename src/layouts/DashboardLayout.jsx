import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar.jsx'
import Navbar  from '../components/layout/Navbar.jsx'

export default function DashboardLayout({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handler = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) setSidebarOpen(false)
    }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  // Close sidebar when clicking a link on mobile
  function closeSidebar() {
    if (isMobile) setSidebarOpen(false)
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="overlay"
          style={{ zIndex: 45 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        user={user}
        onLogout={onLogout}
        isMobile={isMobile}
        isOpen={sidebarOpen}
        onLinkClick={closeSidebar}
      />

      <Navbar
        user={user}
        onLogout={onLogout}
        onMenuToggle={() => setSidebarOpen(v => !v)}
        isMobile={isMobile}
      />

      <main className="page-body">
        <div style={{ padding: '32px 24px', maxWidth: 1000, margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>
    </>
  )
}