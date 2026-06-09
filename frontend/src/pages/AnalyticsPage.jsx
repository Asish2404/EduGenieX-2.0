import React, { useMemo } from 'react'
import { BarChart, TrendingUp, Brain, FileText, HelpCircle, CalendarDays, Briefcase, Search } from 'lucide-react'
import { getStats } from '../utils/localStorageService.js'

const statConfig = [
  { key: 'tutorConversations', label: 'Tutor Sessions', icon: Brain, color: 'from-purple-500 to-pink-500' },
  { key: 'notesGenerated', label: 'Notes Generated', icon: FileText, color: 'from-cyan-500 to-blue-500' },
  { key: 'quizGenerated', label: 'Quizzes Generated', icon: HelpCircle, color: 'from-emerald-500 to-teal-500' },
  { key: 'plansCreated', label: 'Study Plans Created', icon: CalendarDays, color: 'from-amber-500 to-orange-500' },
  { key: 'careerPlansCreated', label: 'Career Plans Created', icon: Briefcase, color: 'from-rose-500 to-red-500' },
  { key: 'researchQueries', label: 'Research Queries', icon: Search, color: 'from-indigo-500 to-purple-500' },
]

const chartColors = [
  'bg-gradient-to-t from-purple-500 to-pink-500',
  'bg-gradient-to-t from-cyan-500 to-blue-500',
  'bg-gradient-to-t from-emerald-500 to-teal-500',
  'bg-gradient-to-t from-amber-500 to-orange-500',
  'bg-gradient-to-t from-rose-500 to-red-500',
  'bg-gradient-to-t from-indigo-500 to-purple-500',
]

export default function AnalyticsPage() {
  const stats = useMemo(() => getStats(), [])

  const statValues = statConfig.map((s) => stats[s.key] || 0)
  const maxValue = Math.max(...statValues, 1)
  const totalItems = statValues.reduce((a, b) => a + b, 0)

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
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-white/80">
              <BarChart size={18} />
              <span className="text-sm">Analytics</span>
            </div>
            <h1 className="mt-1 text-2xl md:text-3xl font-heading font-semibold tracking-tight">
              Your Learning Analytics
            </h1>
            <p className="mt-2 text-white/70 max-w-2xl">
              Track your progress across all EduGenie X features. Data is stored locally in your browser.
            </p>
          </div>
          <div className="flex items-center gap-4 text-white/60">
            <div className="text-3xl font-heading font-semibold">{totalItems}</div>
            <div className="text-sm">Total Activities</div>
          </div>
        </div>
      </section>

      {/* Stat Cards */}
      <section>
        <div className="text-white/85 font-heading font-semibold mb-4">
          Overview
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statConfig.map((s, idx) => {
            const Icon = s.icon
            const value = stats[s.key] || 0
            return (
              <div
                key={s.key}
                className="rounded-2xl border border-white/10 bg-[#0f172a]/30 backdrop-blur-xl p-5
                           hover:bg-[#0f172a]/40 transition focus:outline-none
                           focus:ring-2 focus:ring-purple-400/25"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs text-white/60">{s.label}</div>
                  <div className={`w-10 h-10 rounded-xl border border-white/10 bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                    <Icon size={18} className="text-white" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-3xl font-heading font-semibold text-white leading-none">{value}</div>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full ${chartColors[idx]} rounded-full transition-all duration-500`}
                    style={{ width: `${(value / maxValue) * 100}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Bar Chart */}
      <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
        <div className="text-white/85 font-heading font-semibold mb-5">
          Activity Distribution
        </div>

        <div className="flex items-end justify-center gap-4 h-64 px-4">
          {statConfig.map((s, idx) => {
            const value = stats[s.key] || 0
            const heightPercent = (value / maxValue) * 100
            const Icon = s.icon

            return (
              <div key={s.key} className="flex flex-col items-center gap-3 flex-1 max-w-32">
                <div className="w-full flex justify-center">
                  <div
                    className={`w-12 rounded-t-xl ${chartColors[idx]} transition-all duration-500`}
                    style={{ height: `${Math.max(heightPercent, 5)}%`, minHeight: '12px' }}
                  />
                </div>
                <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
                  <Icon size={18} className="text-white/70" />
                </div>
                <div className="text-xs text-white/60 text-center px-2 leading-tight">{s.label}</div>
                <div className="text-lg font-heading font-semibold text-white">{value}</div>
              </div>
            )
          })}
        </div>

        {/* Legend / Summary */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          {statConfig.map((s, idx) => {
            const value = stats[s.key] || 0
            const percentage = totalItems > 0 ? Math.round((value / totalItems) * 100) : 0
            return (
              <div key={s.key} className="flex items-center gap-2 text-white/70">
                <div className={`w-3 h-3 rounded ${chartColors[idx]}`} />
                <span className="font-medium text-white">{s.label}</span>
                <span className="text-white/50">({value}, {percentage}%)</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* Quick Insights */}
      <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
        <div className="flex items-center gap-2 text-white/85 font-heading font-semibold mb-4">
          <TrendingUp size={18} />
          Quick Insights
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(() => {
            const insights = []

            if (stats.tutorConversations > 0) {
              insights.push(
                <div key="tutor" className="rounded-xl border border-white/10 bg-[#0f172a]/30 p-4">
                  <div className="text-white font-medium">Active Learner</div>
                  <div className="mt-1 text-white/70 text-sm">
                    You've had {stats.tutorConversations} tutor conversation{stats.tutorConversations !== 1 ? 's' : ''}.{' '}
                    {stats.tutorConversations >= 5 ? 'Great consistency!' : 'Keep the questions coming!'}
                  </div>
                </div>
              )
            }

            if (stats.notesGenerated > 0) {
              insights.push(
                <div key="notes" className="rounded-xl border border-white/10 bg-[#0f172a]/30 p-4">
                  <div className="text-white font-medium">Notes Builder</div>
                  <div className="mt-1 text-white/70 text-sm">
                    You've generated structured notes.{' '}
                    {stats.quizGenerated > 0 ? 'Try creating a quiz from them!' : 'Consider generating a quiz to test retention.'}
                  </div>
                </div>
              )
            }

            if (stats.plansCreated > 0) {
              insights.push(
                <div key="plans" className="rounded-xl border border-white/10 bg-[#0f172a]/30 p-4">
                  <div className="text-white font-medium">Planner</div>
                  <div className="mt-1 text-white/70 text-sm">
                    You have a study plan.{' '}
                    {stats.careerPlansCreated > 0 ? 'Your career roadmap aligns well!' : 'Consider adding a career roadmap for long-term goals.'}
                  </div>
                </div>
              )
            }

            if (stats.careerPlansCreated > 0) {
              insights.push(
                <div key="career" className="rounded-xl border border-white/10 bg-[#0f172a]/30 p-4">
                  <div className="text-white font-medium">Career-Focused</div>
                  <div className="mt-1 text-white/70 text-sm">
                    You've built a career roadmap.{' '}
                    {stats.researchQueries > 0 ? 'Research + career planning = strong profile!' : 'Research could strengthen your academic profile.'}
                  </div>
                </div>
              )
            }

            if (insights.length === 0) {
              insights.push(
                <div key="empty" className="rounded-xl border border-white/10 bg-[#0f172a]/30 p-4 md:col-span-2">
                  <div className="text-white font-medium">Welcome to Analytics</div>
                  <div className="mt-1 text-white/70 text-sm">
                    Start using EduGenie X features to see your learning analytics here. Generate notes, quizzes, study plans, career roadmaps, or research guidance.
                  </div>
                </div>
              )
            }

            return insights
          })()}
        </div>
      </section>
    </div>
  )
}