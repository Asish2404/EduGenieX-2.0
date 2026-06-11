import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import FeatureCard from '../components/FeatureCard.jsx'
import StatsCard from '../components/StatsCard.jsx'
import { featureCards } from '../utils/constants.js'
import { getStats } from '../utils/localStorageService.js'
import { Bot, FileText, CircleHelp, CalendarDays, Briefcase, Search } from 'lucide-react'

const featureIcon = {
  tutor: Bot,
  notes: FileText,
  quiz: CircleHelp,
  planner: CalendarDays,
  career: Briefcase,
  research: Search,
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const stats = useMemo(() => getStats(), [])

  const statCards = [
    { label: 'Tutor Sessions', value: stats.tutorConversations },
    { label: 'Notes Generated', value: stats.notesGenerated },
    { label: 'Quizzes Generated', value: stats.quizGenerated },
    { label: 'Study Plans Created', value: stats.plansCreated },
    { label: 'Career Plans Created', value: stats.careerPlansCreated },
    { label: 'Research Queries', value: stats.researchQueries },
  ]

  return (
    <div className="space-y-7">
      {/* Hero */}
      <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-7 relative overflow-hidden">
        <div
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, rgba(168,85,247,0.22), rgba(34,211,238,0.12) 45%, rgba(0,0,0,0) 70%)',
          }}
          aria-hidden="true"
        />
        <div className="relative">
          <div className="text-sm text-white/60">Welcome</div>
          <h1 className="mt-1 text-3xl md:text-4xl font-heading font-semibold tracking-tight">
            Your Personalized Academic Companion
          </h1>
          <p className="mt-3 text-white/70 max-w-2xl">
            Access intelligent tools for study notes, quizzes, career roadmaps, and research assistance.
            All your progress is securely managed within your browser.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section>
        <div className="text-white/85 font-heading font-semibold mb-4">
          Statistics
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {statCards.map((s) => (
            <StatsCard key={s.label} label={s.label} value={s.value} />
          ))}
        </div>
      </section>

      {/* Feature Cards */}
      <section>
        <div className="text-white/85 font-heading font-semibold mb-4">
          What you can do
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {featureCards.map((f) => {
            const Icon = featureIcon[f.key]
            return (
              <FeatureCard
                key={f.key}
                icon={Icon}
                title={f.title}
                description={f.description}
                onClick={() => navigate(f.route)}
              />
            )
          })}
        </div>
      </section>
    </div>
  )
}
