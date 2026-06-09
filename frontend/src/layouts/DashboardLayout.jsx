import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import Header from '../components/Header.jsx'

const routeMeta = {
  '/': { title: 'Dashboard', subtitle: 'EduGenie X Workspace' },
  '/tutor': { title: 'AI Tutor', subtitle: 'Ask questions and learn faster' },
  '/notes': {
    title: 'Notes',
    subtitle: 'Generate structured study notes',
  },
  '/quiz': { title: 'Quizzes', subtitle: 'Revision MCQs with explanations' },
  '/planner': { title: 'Study Planner', subtitle: 'Week-wise roadmap for your goal' },
  '/career': { title: 'Career Guidance', subtitle: 'Build your career roadmap' },
  '/research': { title: 'Research Assistant', subtitle: 'Structured research guidance' },
  '/analytics': { title: 'Analytics', subtitle: 'Track your learning progress' },
  '/profile': { title: 'Profile', subtitle: 'Manage your academic profile' },
}

export default function DashboardLayout() {
  const location = useLocation()
  const [sidebarKey, setSidebarKey] = useState(0)

  const toggleSidebar = () => {
    setSidebarKey((k) => k + 1)
  }

  const meta = routeMeta[location.pathname] || routeMeta['/']

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-white">
      <div className="flex">
        <div className="hidden md:block">
          <Sidebar key={sidebarKey} />
        </div>

        <div className="flex-1 min-w-0 md:ml-0">
          <Header onToggleSidebar={toggleSidebar} title={meta.title} subtitle={meta.subtitle} />

          <main className="p-5 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
