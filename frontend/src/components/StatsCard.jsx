import React from 'react'

export default function StatsCard({ label, value }) {
  return (
    <div
      className="rounded-2xl border border-white/10 bg-[#0f172a]/30 backdrop-blur-xl p-5
                 hover:bg-[#0f172a]/40 transition focus:outline-none
                 focus:ring-2 focus:ring-purple-400/25"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-white/60">{label}</div>

        <div className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
          <div
            className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-purple-400 to-cyan-300"
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="mt-3">
        <div className="text-3xl font-heading font-semibold text-white leading-none">
          {value}
        </div>
      </div>
    </div>
  )
}
