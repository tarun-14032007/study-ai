import React from 'react'
import { Outlet } from 'react-router-dom' // 
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'

function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-zinc-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6">
          <Outlet /> {/* ✅ renders nested routes */}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout