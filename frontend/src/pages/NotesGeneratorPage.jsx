import React, { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { generateNotes } from '../services/api.js'
import remarkGfm from 'remark-gfm'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorCard from '../components/ErrorCard.jsx'
import { FileText } from 'lucide-react'
import { getNotes, saveNotes } from '../utils/localStorageService.js'
import { jsPDF } from 'jspdf'
import * as pdfUtil from '../utils/pdfExport.js'

export default function NotesGeneratorPage() {
  const [topic, setTopic] = useState('')
  const [notes, setNotesState] = useState(() => getNotes() || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const hasNotes = useMemo(() => Boolean(notes && String(notes).trim()), [notes])

  useEffect(() => {
    if (notes) saveNotes(notes)
  }, [notes])

  async function onGenerate() {
    const t = topic.trim()
    if (!t) {
      setError({ title: 'Invalid Input', message: 'Enter a topic to generate notes.' })
      return
    }
    setError(null)
    setIsLoading(true)
    setNotesState('')

    try {
      const res = await generateNotes({ topic: t })
      const ai = res?.data?.notes ?? res?.data?.response ?? res?.data?.message ?? ''
      setNotesState(ai)
    } catch (err) {
      setError({ title: 'Content Generation Issue', message: 'Unable to generate notes at this moment. Please try again or refine your topic.' })
    } finally {
      setIsLoading(false)
    }
  }

  function onCopy() {
    navigator.clipboard.writeText(notes || '')
  }

  function onDownloadPDF() {
    pdfUtil.exportNotesPdf({ topic, notes, jsPDF })
  }

  function onSaveNotes() {
    if (!hasNotes) return
    saveNotes(notes)
  }

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-7 relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-44 h-44 rounded-full bg-gradient-to-br from-purple-500/15 to-cyan-400/10 blur-[1px]" aria-hidden="true" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-white/80">
              <FileText size={18} />
              <span className="text-sm">Notes</span>
            </div>
            <h1 className="mt-1 text-2xl md:text-3xl font-heading font-semibold tracking-tight">
              Generate clean study notes
            </h1>
            <p className="mt-2 text-white/70 max-w-2xl text-sm md:text-[15px]">
              Add a topic and get structured notes with headings and bullet points.
            </p>
          </div>
        </div>
      </section>

      {error ? <ErrorCard title={error.title} message={error.message} /> : null}

      <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-8">
            <label className="text-xs text-white/60">Topic</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Object-Oriented Programming in Java"
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
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-4">
            <LoadingSpinner label="Creating Notes..." />
          </div>
        ) : null}

        <div className="mt-5">
          <div className="text-white/90 text-sm font-heading font-semibold">
            Notes
          </div>

          <div className="mt-3 rounded-2xl border border-white/10 bg-[#0f172a]/30 p-4 max-h-[45vh] overflow-y-auto">
            {hasNotes ? (
              <div className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-cyan-300 prose-strong:text-white prose-code:text-purple-200 prose-pre:bg-slate-950/40 prose-pre:border prose-white/10 selection:bg-purple-500/30">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{notes}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex items-center gap-4 py-10 text-white/60">
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
                    d="M36 10v10h10"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 30h20M22 38h14"
                    stroke="rgba(34,211,238,0.65)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="max-w-[360px]">
                  <div className="text-white/80 font-semibold">
                    No Study Notes Available
                  </div>
                  <div className="mt-1 text-sm">
                    Generate notes to see results here.
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onCopy}
              disabled={!hasNotes}
              className="h-11 px-6 rounded-xl border border-white/10 bg-white/5 text-white/80 text-xs disabled:opacity-50"
            >
              Copy
            </button>

            <button
              type="button"
              onClick={onSaveNotes}
              disabled={!hasNotes}
              className="h-11 px-6 rounded-xl border border-white/10 bg-white/5 text-white/80 text-xs disabled:opacity-50"
            >
              Save
            </button>

            <button
              type="button"
              onClick={onDownloadPDF}
              disabled={!hasNotes}
              className="h-11 px-6 rounded-xl bg-gradient-to-r from-purple-500/90 to-cyan-500/90 text-white/90 text-xs disabled:opacity-50"
            >
              PDF
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
