import React, { useEffect, useMemo, useState } from 'react'
import { generateResearchAssistance } from '../services/api.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorCard from '../components/ErrorCard.jsx'
import { Search } from 'lucide-react'
import { getResearchHistory, saveResearchHistory } from '../utils/localStorageService.js'
import { exportResearchPdf } from '../utils/pdfExport.js'
import { jsPDF } from 'jspdf'

export default function ResearchAssistantPage() {
  const [topic, setTopic] = useState('')
  const [researchState, setResearchState] = useState(() => getResearchHistory() || null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const hasResearch = useMemo(
    () => Boolean(researchState && researchState.output),
    [researchState],
  )

  useEffect(() => {
    if (researchState) saveResearchHistory(researchState)
  }, [researchState])

  async function onGenerate() {
    const t = topic.trim()
    if (!t) {
      setError({
        title: 'Invalid Input',
        message: 'Enter a research topic to generate guidance.',
      })
      return
    }
    setError(null)
    setIsLoading(true)
    setResearchState(null)

    try {
      const res = await generateResearchAssistance({ topic: t })
      const r = res?.data?.output ?? res?.data ?? {}
      setResearchState({ topic: t, output: r })
    } catch (err) {
      setError({ title: 'Research Guidance Issue', message: 'Unable to generate research guidance at this moment. Please try again or refine your topic.' })
      setResearchState({ topic: t, output: _fallbackResearch(t) })
    } finally {
      setIsLoading(false)
    }
  }

  function _fallbackResearch(t) {
    // This fallback should be updated to match the new detailed structure
    // For now, it's a placeholder, but the backend will provide the full structure.
    return {
      problem_statement: `The current research landscape in '${t}' faces significant challenges related to [identify a specific gap or inefficiency]. This problem manifests as [describe the impact or symptoms], hindering progress in [relevant domain]. Addressing this issue is crucial for [mention broader implications or benefits].`,
      research_gap: `Existing literature primarily focuses on [current approaches/solutions], often overlooking [specific aspect or limitation]. There is a notable lack of studies investigating [unexplored area] or providing [missing methodology/data]. This gap prevents a comprehensive understanding of [problem area] and limits the development of [improved solutions].`,
      methodology: `This research will employ a [e.g., mixed-methods, quantitative, qualitative] approach. Initially, a systematic literature review will synthesize current knowledge on '${t}'. Subsequently, [e.g., empirical experiments, case studies, surveys] will be conducted to collect primary data. Data analysis will involve [e.g., statistical analysis, thematic analysis, machine learning models] to validate hypotheses and derive insights.`,
      tools: [
        'Google Scholar / Semantic Scholar / IEEE Xplore',
        'Zotero / Mendeley for reference management',
        'Python (pandas, numpy) or R for data analysis',
        'Overleaf / LaTeX for writing',
      ],
      dataset_suggestions: [
        `Publicly available datasets related to '${t}' from [e.g., Kaggle, UCI Machine Learning Repository, government open data portals].`,
        "Synthetic datasets generated using [e.g., specific simulation tools, generative adversarial networks] to explore edge cases.",
        "Proprietary datasets from [e.g., industry partners, academic collaborations] (if access can be secured).",
        "Web-scraped data from [e.g., relevant online forums, social media platforms] (with ethical considerations).",
      ],
      next_steps: [
        `Finalize research questions for ${t}`,
        'Conduct systematic literature review',
        'Design methodology and collect/analyze data',
        'Draft and iterate on the write-up',
      ],
      expected_outcome: `This research is expected to yield [e.g., a novel framework, an optimized algorithm, empirical evidence supporting a theory] for '${t}'. Key contributions will include [list 2-3 specific, measurable outcomes]. The findings will provide valuable insights for [target audience, e.g., researchers, practitioners, policymakers].`,
      future_scope: `Future work could extend this research by [e.g., applying the proposed framework to a new domain, exploring alternative methodologies, conducting longitudinal studies]. Further investigation into [related emerging trends] would also be beneficial to enhance the robustness and generalizability of the findings.`,
    }
  }

  function onDownloadPDF() {
    exportResearchPdf({ topic, output: researchState?.output, jsPDF })
  }
  const sections = [ // Updated sections to match the new schema
    { key: 'problem_statement', title: 'Problem Statement', icon: '🔍' },
    { key: 'research_gap', title: 'Research Gap', icon: '💡' },
    { key: 'methodology', title: 'Research Methodology', icon: '📋' },
    { key: 'tools', title: 'Tools & Technologies', icon: '🛠️', isList: true },
    { key: 'dataset_suggestions', title: 'Dataset Suggestions', icon: '📊', isList: true },
    { key: 'expected_outcome', title: 'Expected Outcome', icon: '🎯' },
    { key: 'future_scope', title: 'Future Scope', icon: '🚀' },
  ]

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-7 relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-44 h-44 rounded-full bg-gradient-to-br from-purple-500/15 to-cyan-400/10 blur-[1px]" aria-hidden="true" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-white/80">
              <Search size={18} />
              <span className="text-sm">Research</span>
            </div>
            <h1 className="mt-1 text-2xl md:text-3xl font-heading font-semibold tracking-tight">
              Research Assistant
            </h1>
            <p className="mt-2 text-white/70 max-w-2xl text-sm md:text-[15px]">
              Enter a research topic and get structured guidance with problem statement, methodology, tools, and next steps.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-8">
            <label className="text-xs text-white/60">Research Topic</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Transformer architectures for low-resource languages"
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
              {isLoading ? 'Generating...' : 'Generate Guidance'}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-4">
            <LoadingSpinner label="Generating Research Guidance..." />
          </div>
        ) : null}
      </section>

      {error ? <ErrorCard title={error.title} message={error.message} /> : null}

      <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 md:p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="text-white/85 text-sm font-heading font-semibold">
            Research Output
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              type="button"
              onClick={onDownloadPDF}
              disabled={!hasResearch}
              className="h-11 px-6 rounded-xl bg-gradient-to-r from-purple-500/90 to-cyan-500/90 text-white/90 text-xs disabled:opacity-50"
            >
              Download PDF
            </button>
          </div>
        </div>

        {hasResearch ? (
          <div className="mt-4 space-y-4">
            {sections.map((s) => {
              const value = researchState?.output?.[s.key]
              if (!value) return null

              return (
                <div key={s.key} className="rounded-2xl border border-white/10 bg-[#0f172a]/30 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-xl">
                      {s.icon}
                    </div>
                    <div className="text-white font-heading font-semibold">{s.title}</div>
                  </div>
                  {s.isList ? (
                    <ul className="space-y-2">
                      {value.map((item, idx) => (
                        <li key={idx} className="text-white/80 text-sm leading-relaxed flex items-start gap-2">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{value}</div>
                  )}
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
                No Research Output Yet
              </div>
              <div className="mt-1 text-sm">
                Enter a research topic to generate structured guidance.
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}