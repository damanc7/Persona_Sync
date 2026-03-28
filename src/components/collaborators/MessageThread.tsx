import { useEffect, useRef } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import type { Message, PersonaProfile } from '@/types'

interface MessageThreadProps {
  messages: Message[]
  collaborators: PersonaProfile[]
  loading?: boolean
  streamingMessage?: string
  streamingAuthorId?: string | null
}

const PERSONA_BADGE_STYLES: Record<string, string> = {
  joe: 'bg-cyan-500/15 text-cyan-400',
  harish: 'bg-violet-500/15 text-violet-400',
  daman: 'bg-amber-500/15 text-amber-400',
}

const PERSONA_BORDER_STYLES: Record<string, string> = {
  joe: 'border-cyan-500/20',
  harish: 'border-violet-500/20',
  daman: 'border-amber-500/20',
}

function personaBadgeClass(id: string): string {
  return PERSONA_BADGE_STYLES[id] ?? 'bg-emerald-500/15 text-emerald-400'
}

function personaBorderClass(id: string): string {
  return PERSONA_BORDER_STYLES[id] ?? 'border-emerald-500/20'
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
  collaborators: PersonaProfile[]
}

function MessageBubble({ msg, collaborators }: MessageBubbleProps) {
  const isUser = msg.authorType === 'user'
  const author = collaborators.find(c => c.id === msg.authorId)
  const authorName = isUser ? 'You' : (author?.name ?? 'Unknown')

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

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${personaBadgeClass(msg.authorId)}`}>
          {authorName}
        </span>
        {author?.preferences['editor'] && (
          <span className="text-[10px] text-[var(--color-text-muted)]">&middot; {author.preferences['editor']}</span>
        )}
      </div>
      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl rounded-tl-sm bg-[var(--color-bg-elevated)] border ${personaBorderClass(msg.authorId)} text-sm text-[var(--color-text-primary)] leading-relaxed`}>
        {msg.content}
      </div>
      <span className="text-[10px] text-[var(--color-text-muted)] pl-1">{formatRelative(msg.timestamp)}</span>
    </div>
  )
}

export function MessageThread({ messages, collaborators, loading, streamingMessage, streamingAuthorId }: MessageThreadProps) {
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
  const streamingAuthor = streamingAuthorId ? collaborators.find(c => c.id === streamingAuthorId) : null

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.length === 0 && !streamingMessage && (
        <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">Ask a question to start the conversation</p>
          <p className="text-xs text-[var(--color-text-muted)] max-w-sm">
            Each selected profile will respond from their own perspective, based on their preferences and experience.
          </p>
        </div>
      )}

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

      {streamingMessage && streamingAuthor && (
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${personaBadgeClass(streamingAuthor.id)}`}>
              {streamingAuthor.name}
            </span>
            <span className="text-[10px] text-[var(--color-text-muted)]">typing&hellip;</span>
          </div>
          <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl rounded-tl-sm bg-[var(--color-bg-elevated)] border ${personaBorderClass(streamingAuthor.id)} text-sm text-[var(--color-text-primary)] leading-relaxed`}>
            {streamingMessage}
            <span className="inline-block w-1.5 h-3.5 bg-violet-400 ml-0.5 animate-pulse rounded-sm" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
