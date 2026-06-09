import React, { useEffect, useMemo, useState } from 'react'
import { generateQuiz } from '../services/api.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorCard from '../components/ErrorCard.jsx'
import { CircleHelp, Check, X, RotateCcw } from 'lucide-react'
import { getQuiz, saveQuiz } from '../utils/localStorageService.js'
import { exportQuizPdf } from '../utils/pdfExport.js'
import { jsPDF } from 'jspdf'

export default function QuizGeneratorPage() {
  const [topic, setTopic] = useState('')
  const [quizState, setQuizState] = useState(() => getQuiz() || null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Interactive quiz session state
  const [answers, setAnswers] = useState({}) // idx -> selected option string
  const [submitted, setSubmitted] = useState(false)

  const hasQuiz = useMemo(
    () => Array.isArray(quizState?.questions) && quizState.questions.length > 0,
    [quizState],
  )

  useEffect(() => {
    if (quizState) saveQuiz(quizState)
  }, [quizState])

  function resetSession() {
    setAnswers({})
    setSubmitted(false)
  }

  async function onGenerate() {
    const t = topic.trim()
    if (!t) {
      setError({
        title: 'Invalid Input',
        message: 'Enter a topic to generate a quiz.',
      })
      return
    }
    setError(null)
    setIsLoading(true)
    setQuizState(null)
    resetSession()

    try {
      const res = await generateQuiz({ topic: t })
      const q = res?.data?.quiz ?? res?.data ?? {}
      setQuizState(q)
    } catch (err) {
      setError({ title: 'Quiz Generation Issue', message: 'Unable to generate quiz at this moment. Please try again or refine your topic.' })
    } finally {
      setIsLoading(false)
    }
  }

  function onDownloadPDF() {
    exportQuizPdf({ topic, quiz: quizState, jsPDF })
  }

  function onRetake() {
    resetSession()
  }

  function getQuestions() {
    if (!quizState) return []
    if (Array.isArray(quizState)) return quizState
    if (Array.isArray(quizState.questions)) return quizState.questions
    return []
  }

  const questions = useMemo(() => getQuestions(), [quizState])

  // Score calculation
  const score = useMemo(() => {
    if (!submitted) return 0
    return questions.reduce((acc, q, idx) => {
      const correct = q.correct_answer || q.correctAnswer || ''
      return answers[idx] === correct ? acc + 1 : acc
    }, 0)
  }, [submitted, answers, questions])

  const total = questions.length
  const percent = total > 0 ? Math.round((score / total) * 100) : 0
  const allAnswered =
    total > 0 && questions.every((_, idx) => Boolean(answers[idx]))

  // Distinguish: nothing generated yet vs. parse failure (quizState exists but empty)
  const parseFailed =
    quizState != null &&
    (!Array.isArray(quizState.questions) || quizState.questions.length === 0)

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-7 relative overflow-hidden">
        <div
          className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-gradient-to-br from-purple-500/15 to-cyan-400/10 blur-[1px]"
          aria-hidden="true"
        />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-white/80">
              <CircleHelp size={18} />
              <span className="text-sm">Quiz</span>
            </div>
            <h1 className="mt-1 text-2xl md:text-3xl font-heading font-semibold tracking-tight">
              Generate revision MCQs
            </h1>
            <p className="mt-2 text-white/70 max-w-2xl text-sm md:text-[15px]">
              Add a topic, pick your answers, then submit to see the score and explanations.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-8">
            <label className="text-xs text-white/60">Topic</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Data Structures in C"
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
            <LoadingSpinner label="Creating Quiz..." />
          </div>
        ) : null}
      </section>

      {error ? <ErrorCard title={error.title} message={error.message} /> : null}

      {parseFailed ? (
        <ErrorCard
          title="Couldn't parse quiz"
          message="The AI response didn't include any questions. Try again with a different topic."
        />
      ) : null}

      <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 md:p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="text-white/85 text-sm font-heading font-semibold">
            Questions
          </div>

          <div className="flex gap-3 flex-wrap">
            {hasQuiz && !submitted ? (
              <button
                type="button"
                onClick={() => setSubmitted(true)}
                disabled={!allAnswered}
                className="h-11 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-heading font-semibold disabled:opacity-40"
              >
                {allAnswered ? 'Submit Answers' : `Answer all (${Object.keys(answers).length}/${total})`}
              </button>
            ) : null}
            {hasQuiz && submitted ? (
              <button
                type="button"
                onClick={onRetake}
                className="h-11 px-5 rounded-xl bg-white/10 hover:bg-white/15 text-white/90 text-xs flex items-center gap-2"
              >
                <RotateCcw size={14} />
                Retake
              </button>
            ) : null}
            <button
              type="button"
              onClick={onDownloadPDF}
              disabled={!hasQuiz}
              className="h-11 px-6 rounded-xl bg-gradient-to-r from-purple-500/90 to-cyan-500/90 text-white/90 text-xs disabled:opacity-50"
            >
              Download PDF
            </button>
          </div>
        </div>

        {submitted ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/30 p-4 flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-white/60 text-xs font-semibold uppercase tracking-wide">
                Your Score
              </div>
              <div className="mt-1 text-2xl font-heading font-semibold text-white">
                {score} / {total}{' '}
                <span
                  className={
                    percent >= 70
                      ? 'text-emerald-300'
                      : percent >= 40
                      ? 'text-amber-300'
                      : 'text-rose-300'
                  }
                >
                  ({percent}%)
                </span>
              </div>
            </div>
            <div className="text-white/70 text-sm">
              {percent === 100
                ? 'Perfect run! 🎉'
                : percent >= 70
                ? 'Great work!'
                : percent >= 40
                ? 'Good attempt — review the explanations below.'
                : 'Review the explanations and try again.'}
            </div>
          </div>
        ) : null}

        {hasQuiz ? (
          <div className="mt-4 grid grid-cols-1 gap-4">
            {questions.map((q, idx) => {
              const question = q.question || q.q || ''
              const options = q.options || []
              const correct = q.correct_answer || q.correctAnswer || ''
              const explanation = q.explanation || ''
              const userPick = answers[idx]
              const isCorrect = submitted && userPick === correct
              const isWrong =
                submitted && userPick != null && userPick !== correct

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-[#0f172a]/30 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-white font-heading font-semibold">
                      {idx + 1}. {question}
                    </div>

                    {submitted ? (
                      <div
                        className={
                          'shrink-0 rounded-xl border px-3 py-1 text-xs font-semibold ' +
                          (isCorrect
                            ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200'
                            : 'border-rose-400/30 bg-rose-500/10 text-rose-200')
                        }
                      >
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-3 space-y-2">
                    {options.map((opt, i) => {
                      const isUserPick = userPick === opt
                      const isTheRightAnswer = submitted && opt === correct
                      const isTheWrongPick = submitted && isUserPick && opt !== correct

                      let optionClasses =
                        'flex items-start gap-3 text-white/85 text-sm rounded-xl border p-3 transition '
                      if (submitted) {
                        if (isTheRightAnswer) {
                          optionClasses +=
                            'border-emerald-400/40 bg-emerald-500/10 text-emerald-50'
                        } else if (isTheWrongPick) {
                          optionClasses +=
                            'border-rose-400/40 bg-rose-500/10 text-rose-50'
                        } else {
                          optionClasses +=
                            'border-white/10 bg-white/[0.02] text-white/70'
                        }
                      } else if (isUserPick) {
                        optionClasses +=
                          'border-purple-400/40 bg-purple-500/10 text-white'
                      } else {
                        optionClasses +=
                          'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04] cursor-pointer'
                      }

                      return (
                        <button
                          type="button"
                          key={i}
                          onClick={() =>
                            !submitted &&
                            setAnswers((prev) => ({ ...prev, [idx]: opt }))
                          }
                          disabled={submitted}
                          className={optionClasses + ' w-full text-left'}
                        >
                          <div className="mt-0.5 shrink-0">
                            {submitted && isTheRightAnswer ? (
                              <Check size={16} className="text-emerald-300" />
                            ) : submitted && isTheWrongPick ? (
                              <X size={16} className="text-rose-300" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-cyan-400/65" />
                            )}
                          </div>
                          <div className="leading-relaxed">{opt}</div>
                        </button>
                      )
                    })}
                  </div>

                  {submitted ? (
                    <>
                      {correct ? (
                        <div className="mt-4 text-sm">
                          <div className="text-white/60 text-xs font-semibold uppercase tracking-wide">
                            Answer
                          </div>
                          <div className="mt-1 text-purple-200">{correct}</div>
                        </div>
                      ) : null}

                      {explanation ? (
                        <div className="mt-3 text-sm">
                          <div className="text-white/60 text-xs font-semibold uppercase tracking-wide">
                            Explanation
                          </div>
                          <div className="mt-1 text-white/70 leading-relaxed">
                            {explanation}
                          </div>
                        </div>
                      ) : null}
                    </>
                  ) : null}
                </div>
              )
            })}
          </div>
        ) : (
          !parseFailed && (
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
                No Quiz Available
                </div>
                <div className="mt-1 text-sm">
                  Generate a quiz to preview questions and answers here.
                </div>
              </div>
            </div>
          )
        )}
      </section>
    </div>
  )
}
