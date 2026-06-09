import React from 'react'

export default function FeatureCard({ icon: Icon, title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-3xl border border-white/10 bg-[#0f172a]/40 backdrop-blur-xl p-6
                 hover:bg-[#0f172a]/55 transition active:scale-[0.99] focus:outline-none
                 focus:ring-2 focus:ring-purple-400/30"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/15 border border-white/10 flex items-center justify-center">
          {Icon ? <Icon size={22} className="text-white/90" /> : null}
        </div>

        <div className="min-w-0">
          <div className="text-white font-heading font-semibold text-[15px] leading-tight">
            {title}
          </div>
          <div className="mt-2 text-sm text-white/65 leading-relaxed">
            {description}
          </div>
        </div>

        <div className="ml-auto flex items-center justify-center w-8 h-8 rounded-xl border border-white/10 bg-white/5 text-white/60">
          <span aria-hidden="true">↗</span>
        </div>
      </div>
    </button>
  )
}
