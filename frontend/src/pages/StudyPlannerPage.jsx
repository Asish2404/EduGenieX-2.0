import React, { useEffect, useMemo, useState } from 'react'
import { generateStudyPlan } from '../services/api.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorCard from '../components/ErrorCard.jsx'
import { CalendarDays } from 'lucide-react'
import { getStudyPlan, saveStudyPlan } from '../utils/localStorageService.js'
import { exportStudyPlanPdf } from '../utils/pdfExport.js'
import { jsPDF } from 'jspdf'

export default function StudyPlannerPage() {
  const [goal, setGoal] = useState('')
  const [planState, setPlanState] = useState(() => getStudyPlan()?.[0] || null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const hasPlan = useMemo(
    () => Boolean(planState && (planState.weeks || planState)),
    [planState],
  )

  useEffect(() => {
    if (planState) saveStudyPlan(planState)
  }, [planState])

  async function onGenerate() {
    const g = goal.trim()
    if (!g) {
      setError({
        title: 'Invalid Input',
        message: 'Enter your goal to build a study plan.',
      })
      return
    }
    setError(null)
    setIsLoading(true)
    setPlanState(null)

    try {
      const res = await generateStudyPlan({ goal: g })
      const p = res?.data?.plan ?? res?.data ?? {}
      setPlanState(p)
    } catch (err) {
      setError({ title: 'Plan Generation Issue', message: 'Unable to generate study plan at this moment. Please try again or refine your goal.' })
    } finally {
      setIsLoading(false)
    }
  }

  function onDownloadPDF() {
    exportStudyPlanPdf({ topic: goal, plan: planState, jsPDF })
  }

  function getWeeks() {
    if (!planState) return []
    if (Array.isArray(planState)) return planState
    if (Array.isArray(planState.weeks)) return planState.weeks
    return []
  }

  const weeks = useMemo(() => getWeeks(), [planState])

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-7 relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-44 h-44 rounded-full bg-gradient-to-br from-purple-500/15 to-cyan-400/10 blur-[1px]" aria-hidden="true" />
        <div className="flex items-start justify-between gap-4 flex-wrap relative">
          <div>
            <div className="flex items-center gap-2 text-white/80">
              <CalendarDays size={18} />
              <span className="text-sm">Plan</span>
            </div>
            <h1 className="mt-1 text-2xl md:text-3xl font-heading font-semibold tracking-tight">
              Week-wise roadmap
            </h1>
            <p className="mt-2 text-white/70 max-w-2xl text-sm md:text-[15px]">
              Enter a goal. Get week topics, deliverables, and assessment.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-8">
            <label className="text-xs text-white/60">Goal</label>
            <input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., Learn Python in 4 Weeks"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/30 p-3 text-white outline-none focus:border-purple-400/40"
            />
          </div>

          <div className="md:col-span-4 flex gap-3">
            <button
              type="button"
              onClick={onGenerate}
              disabled={isLoading}
              className="flex-1 h-11 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-heading font-semibold disabled:opacity-50"
            >
              {isLoading ? 'Building...' : 'Build'}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-4">
            <LoadingSpinner label="Building Study Plan..." />
          </div>
        ) : null}
      </section>

      {error ? <ErrorCard title={error.title} message={error.message} /> : null}

      <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 md:p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="text-white/85 text-sm font-heading font-semibold">
            Timeline
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              type="button"
              onClick={onDownloadPDF}
              disabled={!hasPlan}
              className="h-11 px-6 rounded-xl bg-gradient-to-r from-purple-500/90 to-cyan-500/90 text-white/90 text-xs disabled:opacity-50"
            >
              Download PDF
            </button>
          </div>
        </div>

        {hasPlan ? (
          <div className="mt-4 relative pl-6">
            <div className="absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-400/35 to-cyan-400/35" />
            <div className="space-y-4">
              {weeks.map((w, idx) => {
                const weekLabel = w.week ?? idx + 1
                return (
                  <div key={idx} className="relative">
                    <div className="absolute -left-2 top-6 w-4 h-4 rounded-full bg-gradient-to-br from-purple-500/80 to-cyan-500/70 border-2 border-slate-950" />
                    <div className="rounded-2xl border border-white/10 bg-[#0f172a]/30 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
                              <div className="text-sm font-heading font-semibold">
                                W{weekLabel}
                              </div>
                            </div>
                            <div className="text-white font-heading font-semibold">
                              Week {weekLabel}
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="rounded-xl border border-white/10 bg-slate-950/20 p-3">
                              <div className="text-white/60 text-xs font-semibold uppercase tracking-wide">
                                Topics
                              </div>
                              <div className="mt-1 text-white/80 leading-relaxed">
                                {w.topics}
                              </div>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-slate-950/20 p-3">
                              <div className="text-white/60 text-xs font-semibold uppercase tracking-wide">
                                Practice
                              </div>
                              <div className="mt-1 text-white/80 leading-relaxed">
                                {w.practice}
                              </div>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-slate-950/20 p-3">
                              <div className="text-white/60 text-xs font-semibold uppercase tracking-wide">
                                Deliverables
                              </div>
                              <div className="mt-1 text-white/80 leading-relaxed">
                                {w.deliverables}
                              </div>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-slate-950/20 p-3">
                              <div className="text-white/60 text-xs font-semibold uppercase tracking-wide">
                                Assessment
                              </div>
                              <div className="mt-1 text-white/80 leading-relaxed">
                                {w.assessment}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-4 py-10 text-white/60">
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M18 10h28a4 4 0 0 1 4 4v36a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4Z"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="2"
              />
              <path
                d="M22 22h20M22 30h16M22 38h12"
                stroke="rgba(34,211,238,0.55)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <div className="max-w-[420px]">
              <div className="text-white/80 font-semibold">
                No Study Plan Generated
              </div>
              <div className="mt-1 text-sm">
                Build a plan to preview your weekly roadmap here.
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
