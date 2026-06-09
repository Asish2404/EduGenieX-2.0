import React, { useEffect, useMemo, useState } from 'react'
import { generateCareerGuidance } from '../services/api.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorCard from '../components/ErrorCard.jsx'
import { Briefcase } from 'lucide-react'
import { getCareerPlans, saveCareerPlans } from '../utils/localStorageService.js'
import { exportCareerRoadmapPdf } from '../utils/pdfExport.js'
import { jsPDF } from 'jspdf'

export default function CareerGuidancePage() {
  const [interest, setInterest] = useState('')
  const [roadmapState, setRoadmapState] = useState(() => getCareerPlans() || null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const hasRoadmap = useMemo(
    () => Boolean(roadmapState && roadmapState.roadmap),
    [roadmapState],
  )

  useEffect(() => {
    if (roadmapState) saveCareerPlans(roadmapState)
  }, [roadmapState])

  async function onGenerate() {
    const i = interest.trim()
    if (!i) {
      setError({
        title: 'Invalid Input',
        message: 'Enter your interest area to generate a career roadmap.',
      })
      return
    }
    setError(null)
    setIsLoading(true)
    setRoadmapState(null)

    try {
      const res = await generateCareerGuidance({ interest_area: i })
      const r = res?.data?.roadmap ?? res?.data ?? {}
      setRoadmapState({ interest: i, roadmap: r })
    } catch (err) {
      setError({ title: 'Roadmap Generation Issue', message: 'Unable to generate career roadmap at this moment. Please try again or refine your interest.' })
      setRoadmapState({ interest: i, roadmap: _fallbackCareerGuidance(i) })
    } finally {
      setIsLoading(false)
    }
  }

  function _fallbackCareerGuidance(i) {
    // This fallback should be updated to match the new detailed structure
    // For now, it's a placeholder, but the backend will provide the full structure.
    return {
      career_overview: `Explore a fulfilling career path in ${i}, a dynamic and evolving field offering numerous opportunities for growth and innovation.`,
      required_skills: [
        `Proficiency in ${i} core principles and methodologies`,
        'Strong analytical and problem-solving abilities',
        'Effective communication and presentation skills',
        'Adaptability to new technologies and industry trends',
        'Collaborative mindset for team-based projects',
      ],
      technologies: [
        `Key platforms and tools in ${i} (e.g., specific programming languages, software suites)`,
        'Relevant frameworks and libraries',
        'Data management systems',
        'Cloud computing services',
        'Development and deployment tools',
      ],
      certifications: [
        `Industry-recognized certifications in ${i} or related domains`,
        'Professional development courses',
        'Specialized training programs',
      ],
      projects: [
        `Develop a comprehensive portfolio project showcasing ${i} expertise`,
        'Participate in open-source contributions relevant to the field',
        'Undertake real-world case studies or freelance assignments',
        'Build personal projects to explore new concepts and tools',
      ],
      internship_plan: [
        'Identify leading companies offering internships in your area of interest',
        'Tailor your application materials to highlight relevant skills and projects',
        'Actively network with professionals and recruiters',
        'Seek out diverse internship experiences to broaden your exposure',
        'Focus on learning and skill development during your internship',
      ],
      placement_preparation: [
        'Master data structures and algorithms (DSA) for technical interviews',
        'Practice system design for advanced roles',
        'Refine behavioral interview responses using the STAR method',
        'Engage in mock interviews and coding challenges',
        'Stay updated on current industry trends and company news',
      ],
      interview_questions: [
        `"Describe a challenging project in ${i} and how you overcame obstacles."`,
        `"Explain a core concept in ${i} to a non-technical audience."`,
        `"How do you stay current with advancements in ${i}?"`,
        `"Walk me through your thought process for solving [a specific problem type in ${i}]."`,
      ],
      salary_expectations: `Entry-level positions in ${i} typically offer salaries ranging from $60,000 to $90,000 annually, depending on experience, location, and company. Mid-career professionals can expect $90,000 to $150,000, while senior roles may command $150,000 to $250,000+ depending on experience, location, and company.`,
      learning_timeline: [
        'Phase 1 (0-6 months): Foundational knowledge, basic projects, skill acquisition.',
        'Phase 2 (6-12 months): Intermediate projects, specialized learning, first internship.',
        'Phase 3 (12-24 months): Advanced concepts, open-source contributions, second internship.',
        'Phase 4 (24+ months): Portfolio refinement, intensive interview preparation, job placement.',
      ],
    }
  }

  function onDownloadPDF() {
    exportCareerRoadmapPdf({ interest, roadmap: roadmapState?.roadmap, jsPDF })
  }

  const sections = [
    { key: 'skills', title: 'Skills', icon: '🛠️' },
    { key: 'projects', title: 'Projects', icon: '📦' },
    { key: 'timeline', title: 'Timeline', icon: '📅' },
    { key: 'interview_prep', title: 'Interview Preparation', icon: '🎯' },
  ]

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-7 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-gradient-to-br from-purple-500/15 to-cyan-400/10 blur-[1px]" aria-hidden="true" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-white/80">
              <Briefcase size={18} />
              <span className="text-sm">Career</span>
            </div>
            <h1 className="mt-1 text-2xl md:text-3xl font-heading font-semibold tracking-tight">
              Build your career roadmap
            </h1>
            <p className="mt-2 text-white/70 max-w-2xl text-sm md:text-[15px]">
              Enter your interest area and get a structured plan with skills, projects, timeline, and interview prep.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-8">
            <label className="text-xs text-white/60">Interest Area</label>
            <input
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              placeholder="e.g., Machine Learning, Full Stack Development, Data Science"
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
              {isLoading ? 'Building...' : 'Build Roadmap'}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-4">
            <LoadingSpinner label="Building Career Roadmap..." />
          </div>
        ) : null}
      </section>

      {error ? <ErrorCard title={error.title} message={error.message} /> : null}

      <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 md:p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="text-white/85 text-sm font-heading font-semibold">
            Roadmap
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              type="button"
              onClick={onDownloadPDF}
              disabled={!hasRoadmap}
              className="h-11 px-6 rounded-xl bg-gradient-to-r from-purple-500/90 to-cyan-500/90 text-white/90 text-xs disabled:opacity-50"
            >
              Download PDF
            </button>
          </div>
        </div>

        {hasRoadmap ? (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.map((s) => {
              const items = roadmapState?.roadmap?.[s.key] || []
              return (
                <div key={s.key} className="rounded-2xl border border-white/10 bg-[#0f172a]/30 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-xl">
                      {s.icon}
                    </div>
                    <div className="text-white font-heading font-semibold">{s.title}</div>
                  </div>
                  <ul className="space-y-2">
                    {items.map((item, idx) => (
                      <li key={idx} className="text-white/80 text-sm leading-relaxed flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
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
                d="M18 10h18l10 10v34c0 1.1-.9 2-2 2H18c-1.1 0-2-.9-2-2V12c0-1.1.9-2 2-2Z"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M22 30h20M22 38h14"
                stroke="rgba(168,85,247,0.6)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M36 10v10h10"
                stroke="rgba(34,211,238,0.55)"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
            <div className="max-w-[420px]">
              <div className="text-white/80 font-semibold">
                No Career Roadmap Generated
              </div>
              <div className="mt-1 text-sm">
                Enter your interest area to generate a personalized career roadmap.
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}