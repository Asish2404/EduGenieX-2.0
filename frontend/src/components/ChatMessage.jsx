import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function ChatMessage({ role = 'ai', content }) {
  const isUser = role === 'user'
  return (
    <div className={isUser ? 'flex justify-end' : 'flex justify-start'}>
      <div
        className={[ 
          'max-w-[85%] whitespace-pre-wrap rounded-2xl p-4 border',
          isUser
            ? 'bg-purple-500/10 border-purple-400/30 text-white'
            : 'bg-white/5 border-white/10 text-white',
        ].join(' ')}
      >
        <div className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
