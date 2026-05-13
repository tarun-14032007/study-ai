import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import Notes from './pages/Notes'
import Planner from './pages/Planner'

import DashboardLayout from './layouts/DashboardLayout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Dashboard routes wrapped in layout */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/planner" element={<Planner />} />
      </Route>
    </Routes>
  )
}

export default App