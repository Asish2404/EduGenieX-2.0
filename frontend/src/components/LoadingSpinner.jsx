import React from 'react'

export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center gap-3 text-white/80 text-sm">
      <div className="w-5 h-5 rounded-full border border-white/20 border-t-purple-400 animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  )
}
