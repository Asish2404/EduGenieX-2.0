import React, { useEffect, useMemo, useState } from 'react'
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
  const meta = useMemo(() => routeMeta[location.pathname] || routeMeta['/'], [location.pathname])

  // Mobile sidebar open/close is controlled here (single source of truth)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  useEffect(() => {
    // When resizing to desktop, keep sidebar visible and close mobile overlay
    const onResize = () => {
      if (window.innerWidth >= 768) setIsMobileNavOpen(false)
    }
    window.addEventListener('resize', onResize)
    onResize()

    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Close mobile nav on route change
  useEffect(() => {
    setIsMobileNavOpen(false)
  }, [location.pathname])

  const toggleMobileNav = () => setIsMobileNavOpen((v) => !v)
  const closeMobileNav = () => setIsMobileNavOpen(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-white overflow-x-hidden">
      <div className="flex">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <Sidebar variant="desktop" />
        </div>

        {/* Mobile sidebar + overlay */}
        <div className="md:hidden">
          <Sidebar
            variant="mobile"
            isOpen={isMobileNavOpen}
            onClose={closeMobileNav}
          />
        </div>

        <div className="flex-1 min-w-0 md:ml-0">
          <Header
            onToggleSidebar={toggleMobileNav}
            title={meta.title}
            subtitle={meta.subtitle}
          />

          <main className="p-5 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

