import React from 'react'

export default function ErrorCard({ title = 'Something went wrong', message }) {
  return (
    <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-white">
      <div className="text-sm font-semibold text-red-200">{title}</div>
      {message ? <div className="mt-2 text-sm text-white/80">{message}</div> : null}
    </div>
  )
}
