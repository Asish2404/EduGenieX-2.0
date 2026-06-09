import React from 'react'
import { Menu } from 'lucide-react'

export default function Header({ onToggleSidebar, title, subtitle }) {
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white"
          onClick={onToggleSidebar}
          aria-label="Open navigation"
        >
          <Menu size={18} />
        </button>

        <div className="min-w-0">
          <div className="text-sm text-white/60 truncate">{subtitle}</div>
          <div className="text-lg font-heading font-semibold text-white truncate">
            {title}
          </div>
        </div>
      </div>

      <div className="text-xs text-white/50" aria-hidden="true" />
    </header>
  )
}
