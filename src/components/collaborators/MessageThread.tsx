import { useEffect, useRef } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import type { Message, Collaborator } from '@/types'

interface MessageThreadProps {
  messages: Message[]
  collaborators: Collaborator[]
  loading?: boolean
  streamingMessage?: string
}

function formatRelative(iso: string) {
  const date = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60_000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

function formatDateGroup(iso: string) {
  const date = new Date(iso)
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === now.toDateString()) return 'Today'
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function groupByDate(messages: Message[]): Array<{ label: string; messages: Message[] }> {
  const groups: Record<string, Message[]> = {}
  for (const msg of messages) {
    const label = formatDateGroup(msg.timestamp)
    if (!groups[label]) groups[label] = []
    groups[label].push(msg)
  }
  return Object.entries(groups).map(([label, messages]) => ({ label, messages }))
}

interface MessageBubbleProps {
  msg: Message
  collaborators: Collaborator[]
}

function MessageBubble({ msg, collaborators }: MessageBubbleProps) {
  const isUser = msg.authorType === 'user'
  const isLLM = msg.authorType === 'llm'
  const author = collaborators.find(c => c.id === msg.authorId)
  const authorName = isUser ? 'You' : isLLM ? 'AI Assistant' : (author?.name ?? 'Collaborator')

  if (isUser) {
    return (
      <div className="flex flex-col items-end gap-1">
        <div className="max-w-[75%] px-4 py-2.5 rounded-2xl rounded-tr-sm bg-violet-600/80 text-white text-sm leading-relaxed">
          {msg.content}
        </div>
        <span className="text-[10px] text-[var(--color-text-muted)] pr-1">{formatRelative(msg.timestamp)}</span>
      </div>
    )
  }

  if (isLLM) {
    return (
      <div className="flex flex-col items-start gap-1">
        <div className="flex items-center gap-1.5 mb-0.5">
          <Badge variant="cyan">AI</Badge>
          <span className="text-xs text-[var(--color-text-muted)]">{authorName}</span>
        </div>
        <div className="max-w-[75%] px-4 py-2.5 rounded-2xl rounded-tl-sm bg-[var(--color-bg-elevated)] border border-cyan-500/20 text-sm text-[var(--color-text-primary)] leading-relaxed">
          {msg.content}
        </div>
        <span className="text-[10px] text-[var(--color-text-muted)] pl-1">{formatRelative(msg.timestamp)}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <span className="text-xs text-[var(--color-text-muted)] pl-1">{authorName}</span>
      <div className="max-w-[75%] px-4 py-2.5 rounded-2xl rounded-tl-sm bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] text-sm text-[var(--color-text-primary)] leading-relaxed">
        {msg.content}
      </div>
      <span className="text-[10px] text-[var(--color-text-muted)] pl-1">{formatRelative(msg.timestamp)}</span>
    </div>
  )
}

export function MessageThread({ messages, collaborators, loading, streamingMessage }: MessageThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingMessage])

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
            <Skeleton className={`h-12 rounded-2xl ${i % 2 === 0 ? 'w-56' : 'w-44'}`} />
          </div>
        ))}
      </div>
    )
  }

  const groups = groupByDate(messages)

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {groups.map(group => (
        <div key={group.label}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[var(--color-border-subtle)]" />
            <span className="text-xs text-[var(--color-text-muted)] px-2">{group.label}</span>
            <div className="flex-1 h-px bg-[var(--color-border-subtle)]" />
          </div>
          <div className="space-y-3">
            {group.messages.map(msg => (
              <MessageBubble key={msg.id} msg={msg} collaborators={collaborators} />
            ))}
          </div>
        </div>
      ))}

      {streamingMessage && (
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Badge variant="cyan">AI</Badge>
            <span className="text-xs text-[var(--color-text-muted)]">AI Assistant</span>
          </div>
          <div className="max-w-[75%] px-4 py-2.5 rounded-2xl rounded-tl-sm bg-[var(--color-bg-elevated)] border border-cyan-500/20 text-sm text-[var(--color-text-primary)] leading-relaxed">
            {streamingMessage}
            <span className="inline-block w-1.5 h-3.5 bg-cyan-400 ml-0.5 animate-pulse rounded-sm" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
