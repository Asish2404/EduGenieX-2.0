import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import {
  LayoutDashboard,
  Bot,
  FileText,
  CircleHelp,
  CalendarDays,
  Briefcase,
  Search,
  BarChart,
  User,
} from 'lucide-react'

import Logo from '../images/logo1.png'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tutor', label: 'AI Tutor', icon: Bot },
  { to: '/notes', label: 'Notes Generator', icon: FileText },
  { to: '/quiz', label: 'Quiz Generator', icon: CircleHelp },
  { to: '/planner', label: 'Study Planner', icon: CalendarDays },
  { to: '/career', label: 'Career Guidance', icon: Briefcase },
  { to: '/research', label: 'Research Assistant', icon: Search },
  { to: '/analytics', label: 'Analytics', icon: BarChart },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function Sidebar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    const onResize = () => {
      setIsOpen(window.innerWidth >= 768)
    }

    onResize()
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const isActive = (to) => {
    if (to === '/' && location.pathname === '/') return true
    return location.pathname === to
  }

  return (
    <>
      {/* Mobile Toggle */}
      <button
        type="button"
        className="md:hidden fixed left-4 top-4 z-50 rounded-xl bg-slate-900/80 border border-white/10 px-3 py-2 text-white"
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Toggle navigation"
      >
        Menu
      </button>

      {/* Sidebar */}
      <aside
        className={[
          'fixed md:sticky z-40',
          'left-0 top-0 h-screen',
          'transition-transform duration-200',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
      >
        <div className="h-full w-[260px] bg-white/5 border-r border-white/10 backdrop-blur-xl text-white p-4 flex flex-col">

          {/* Brand */}
          <div className="flex items-center gap-3 px-2 py-3 mb-8">

            <div className="w-14 h-14 overflow-hidden rounded-2xl shadow-lg border border-white/10">
              <img
                src={Logo}
                alt="EduGenie X Logo"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">
                EduGenie X
              </h1>

              <p className="text-xs text-white/60">
                Your Intelligent Academic Partner
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.to)

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      setIsOpen(false)
                    }
                  }}
                  className={[
                    'flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200',
                    active
                      ? 'bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-violet-400/30 text-white'
                      : 'text-white/80 hover:bg-white/5 hover:text-white',
                  ].join(' ')}
                >
                  <Icon size={18} />
                  <span className="font-medium">
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-white/10 pt-4">
            <div className="text-xs text-white/50">
              EduGenie X
            </div>

            <div className="text-sm font-medium text-white/80 mt-1">
              Project by Asish Bose
            </div>
          </div>

        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}