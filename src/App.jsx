import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Planner from './pages/Planner.jsx'
import Notes from './pages/Notes.jsx'
import Chat from './pages/Chat.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'

function App() {
  const [user, setUser] = useState(null)

  const handleLogout = () => setUser(null)

  return (
    <Routes>
      <Route path="/" element={
        user ? <Navigate to="/dashboard" replace /> : <Login setUser={setUser} />
      } />

      <Route
        element={
          user
            ? <DashboardLayout user={user} onLogout={handleLogout} />
            : <Navigate to="/" replace />
        }
      >
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/planner"   element={<Planner />} />
        <Route path="/notes"     element={<Notes />} />
        <Route path="/chat"      element={<Chat user={user} />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App