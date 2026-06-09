import React, { useEffect, useRef, useState } from 'react'
import { tutorChat } from '../services/api.js'
import ChatMessage from '../components/ChatMessage.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorCard from '../components/ErrorCard.jsx'
import { Bot } from 'lucide-react'
import { getTutorHistory, saveTutorHistory } from '../utils/localStorageService.js'

function normalizeTutorError(err) {
  if (
    err?.code === 'ERR_NETWORK' ||
    String(err?.message || '').includes('Network')
  ) {
    return {
      title: 'Network Error',
      message: 'Please check your connection and try again.',
    }
  }

  return {
    title: 'Academic Guidance',
    message: 'Generating a helpful response.',
  }
}

export default function AITutorPage() {
  const [messages, setMessages] = useState(() => getTutorHistory() || [])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const scrollRef = useRef(null)

  useEffect(() => {
    saveTutorHistory(messages)
  }, [messages])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  function clearChat() {
    setMessages([])
    setError(null)
    setInput('')
    saveTutorHistory([])
  }

  async function onSend() {
    const text = input.trim()

    if (!text) {
      setError({
        title: 'Invalid Input',
        message: 'Enter a question to continue.',
      })
      return
    }

    setError(null)

    const userMsg = {
      role: 'user',
      content: text,
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const res = await tutorChat({
        message: text,
      })

      const aiText =
        res?.data?.response ||
        res?.data?.message ||
        res?.data?.content ||
        'No response received from AI.'

      // console.log('AI TEXT:', aiText)

      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content: aiText,
        },
      ])


    } catch (err) {
      // console.error('TUTOR ERROR:', err)
      // console.error('ERROR RESPONSE:', err?.response)
      // console.error('ERROR DATA:', err?.response?.data)

      setError({
        title: 'AI Assistant',
        message:
          err?.response?.data?.detail ||
          'Unable to generate a response at the moment. Please try again.',
      })


    } finally {
      setIsLoading(false)
    }
  }

  return (<div className="space-y-5"> <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"> <div className="flex items-start justify-between gap-4"> <div> <div className="flex items-center gap-2 text-white/80"> <Bot size={18} /> <span className="text-sm">AI Tutor</span> </div>
    <h1 className="mt-1 text-2xl font-heading font-semibold">
      Ask anything about your syllabus
    </h1>

    <p className="mt-2 text-white/70 max-w-2xl">
      Your conversations are available during this session.
    </p>
  </div>
  </div>
  </section>

    {error ? (
      <ErrorCard title={error.title} message={error.message} />
    ) : null}

    <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 md:p-6">
      <div className="max-h-[52vh] overflow-y-auto pr-2 space-y-3">
        {messages.length === 0 ? (
          <div className="text-white/60 text-sm">
            Start a conversation. Ask for explanations, examples, or
            practice questions.
          </div>
        ) : null}

        {messages.map((m, idx) => (
          <ChatMessage
            key={idx}
            role={m.role}
            content={m.content}
          />
        ))}

        <div ref={scrollRef} />
      </div>

      <div className="mt-4 flex gap-3 items-end">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={2}
          placeholder="Type your question..."
          className="flex-1 resize-none rounded-2xl border border-white/10 bg-slate-950/30 p-3 text-white outline-none focus:border-purple-400/40"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()

              if (!isLoading) {
                onSend()
              }
            }
          }}
        />

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onSend}
            disabled={isLoading}
            className="rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 px-4 py-3 text-white font-heading font-semibold disabled:opacity-50"
          >
            {isLoading ? 'Generating...' : 'Send'}
          </button>

          <button
            type="button"
            onClick={clearChat}
            disabled={isLoading || messages.length === 0}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white/80 text-xs disabled:opacity-50"
          >
            Clear Chat
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-4">
          <LoadingSpinner label="Generating Response..." />
        </div>
      ) : null}
    </section>
  </div>


  )
}
