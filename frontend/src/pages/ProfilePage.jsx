import React, { useEffect, useState } from 'react'
import { User, GraduationCap, BookOpen, Award, Save, CheckCircle } from 'lucide-react'
import { getProfile, saveProfile } from '../utils/localStorageService.js'

export default function ProfilePage() {
  const [profile, setProfile] = useState(() => getProfile())
  const [saved, setSaved] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (saved) {
      const timer = setTimeout(() => {
        setSaved(false)
        setMessage('')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [saved])

  function onChange(field, value) {
    setProfile((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  function onSave() {
    saveProfile(profile)
    setSaved(true)
    setMessage('Profile saved successfully!')
  }

  function onReset() {
    const defaultProfile = { name: '', college: '', program: '', semester: '' }
    setProfile(defaultProfile)
    saveProfile(defaultProfile)
    setSaved(true)
    setMessage('Profile reset to defaults')
  }

  const fields = [
    { key: 'name', label: 'Full Name', placeholder: 'Enter your name', icon: User },
    { key: 'college', label: 'College / University', placeholder: 'Enter college name', icon: GraduationCap },
    { key: 'program', label: 'Program / Course', placeholder: 'e.g., B.Tech Computer Science', icon: BookOpen },
    { key: 'semester', label: 'Current Semester', placeholder: 'e.g., 3rd Semester', icon: Award },
  ]

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-7 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-gradient-to-br from-purple-500/15 to-cyan-400/10 blur-[1px]" aria-hidden="true" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-white/80">
              <User size={18} />
              <span className="text-sm">Profile</span>
            </div>
            <h1 className="mt-1 text-2xl md:text-3xl font-heading font-semibold tracking-tight">
              Your Profile
            </h1>
            <p className="mt-2 text-white/70 max-w-2xl text-sm md:text-[15px]">
              Manage your academic profile details. All information is securely stored within your browser.
            </p>
          </div>
        </div>
      </section>

      {message && (
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-white flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle size={20} className="text-emerald-300 shrink-0" />
          <span className="text-sm">{message}</span>
        </div>
      )}

      <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 md:p-6 max-w-xl">
        <div className="space-y-5">
          {fields.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.key} className="rounded-xl border border-white/10 bg-[#0f172a]/30 p-4">
                <label className="flex items-center gap-3 text-xs text-white/60 mb-2">
                  <Icon size={14} />
                  {f.label}
                </label>
                <input
                  type="text"
                  value={profile[f.key] || ''}
                  onChange={(e) => onChange(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/30 p-3 text-white outline-none focus:border-purple-400/40 bg-transparent"
                />
              </div>
            )
          })}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onSave}
              disabled={saved}
              className="flex-1 h-11 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-heading font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save size={16} />
              {saved ? 'Saved' : 'Save Profile'}
            </button>

            <button
              type="button"
              onClick={onReset}
              className="h-11 px-6 rounded-xl border border-white/10 bg-white/5 text-white/80 text-xs hover:bg-white/10 transition"
            >
              Reset
            </button>
          </div>

          <div className="text-xs text-white/50 text-center">
            No authentication required. All data stays in your browser's localStorage.
          </div>
        </div>
      </section>

      {/* Data Summary */}
      <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 md:p-6 max-w-xl">
        <div className="text-white/85 font-heading font-semibold mb-4">Profile Summary</div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-white/10 bg-[#0f172a]/30 p-3">
            <div className="text-white/60">Name</div>
            <div className="text-white font-medium truncate">{profile.name || '—'}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0f172a]/30 p-3">
            <div className="text-white/60">College</div>
            <div className="text-white font-medium truncate">{profile.college || '—'}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0f172a]/30 p-3">
            <div className="text-white/60">Program</div>
            <div className="text-white font-medium truncate">{profile.program || '—'}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0f172a]/30 p-3">
            <div className="text-white/60">Semester</div>
            <div className="text-white font-medium truncate">{profile.semester || '—'}</div>
          </div>
        </div>
      </section>
    </div>
  )
}