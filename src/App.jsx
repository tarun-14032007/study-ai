import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { storage } from './utils/storage.js'

import DashboardLayout from './layouts/DashboardLayout.jsx'
import Login     from './pages/login.jsx'
import Dashboard from './pages/dashboard.jsx'
import Planner   from './pages/planner.jsx'
import Notes     from './pages/notes.jsx'
import Chat      from './pages/chat.jsx'

export default function App() {
  const [user, setUser] = useState(() => storage.get('user'))

  function login(userData) {
    storage.set('user', userData)
    setUser(userData)
  }

  function logout() {
    storage.remove('user')
    setUser(null)
  }

  return (
    <Routes>
      {/* Public */}
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" replace /> : <Login onLogin={login} />}
      />

      {/* Protected — wrapped in DashboardLayout */}
      <Route
        element={
          user
            ? <DashboardLayout user={user} onLogout={logout} />
            : <Navigate to="/" replace />
        }
      >
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/planner"   element={<Planner />} />
        <Route path="/notes"     element={<Notes />} />
        <Route path="/chat"      element={<Chat user={user} />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}