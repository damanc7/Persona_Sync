import { useState, useCallback } from 'react'
import { Users } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { Button } from '@/components/ui/Button'
import { CollaboratorList } from '@/components/collaborators/CollaboratorList'
import { InviteModal } from '@/components/collaborators/InviteModal'
import { MessageThread } from '@/components/collaborators/MessageThread'
import { PromptInput } from '@/components/collaborators/PromptInput'
import { useCollaborators, useMessages } from '@/hooks/useCollaborators'
import type { Message } from '@/types'

export function Collaborators() {
  const [inviteOpen, setInviteOpen] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState('general')
  const [localMessages, setLocalMessages] = useState<Message[]>([])
  const [streamingText, setStreamingText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [toast, setToast] = useState('')

  const { data: collaborators = [], isLoading: loadingCollabs } = useCollaborators()
  const { data: fetchedMessages = [], isLoading: loadingMessages } = useMessages(selectedTopic !== 'general' ? selectedTopic : undefined)

  const allMessages = [...fetchedMessages, ...localMessages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleSend = useCallback((content: string, topic?: string) => {
    const newMsg: Message = {
      id: `local-${Date.now()}`,
      authorId: 'u1',
      authorType: 'user',
      content,
      timestamp: new Date().toISOString(),
      topic: topic ?? 'general',
    }
    setLocalMessages(prev => [...prev, newMsg])
  }, [])

  const handleStream = useCallback((words: string[]) => {
    setIsStreaming(true)
    setStreamingText('')
    let i = 0
    const tick = () => {
      if (i >= words.length) {
        const final = words.join(' ')
        setStreamingText('')
        setIsStreaming(false)
        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          authorId: 'llm',
          authorType: 'llm',
          content: final,
          timestamp: new Date().toISOString(),
          topic: selectedTopic,
        }
        setLocalMessages(prev => [...prev, aiMsg])
        return
      }
      i++
      setStreamingText(words.slice(0, i).join(' '))
      const delay = 60 + Math.random() * 60
      setTimeout(tick, delay)
    }
    setTimeout(tick, 200)
  }, [selectedTopic])

  const handleTopicChange = (topic: string) => {
    setSelectedTopic(topic)
    setLocalMessages([])
  }

  return (
    <div className="flex flex-col h-screen">
      <TopBar
        title="Collaborators"
        actions={
          <Button size="sm" onClick={() => setInviteOpen(true)}>
            <Users className="h-3.5 w-3.5" />
            Invite
          </Button>
        }
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: collaborator roster */}
        <aside className="w-72 shrink-0 border-r border-[var(--color-border-subtle)] overflow-y-auto p-4">
          <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3 px-3">
            Members ({collaborators.length})
          </p>
          <CollaboratorList collaborators={collaborators} loading={loadingCollabs} />
        </aside>

        {/* Right panel: discussion */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b border-[var(--color-border-subtle)] px-4 py-3">
            <p className="text-xs text-[var(--color-text-muted)]">
              Discussion thread for
              <span className="text-[var(--color-text-secondary)] font-medium ml-1">{selectedTopic === 'general' ? 'all topics' : selectedTopic}</span>
            </p>
          </div>

          <MessageThread
            messages={allMessages}
            collaborators={collaborators}
            loading={loadingMessages}
            streamingMessage={streamingText}
          />

          <PromptInput
            onSend={handleSend}
            onStream={handleStream}
            isStreaming={isStreaming}
            selectedTopic={selectedTopic}
            onTopicChange={handleTopicChange}
          />
        </main>
      </div>

      <InviteModal
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onSuccess={() => showToast('Invitation sent successfully!')}
      />

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm shadow-xl animate-in fade-in slide-in-from-bottom-2">
          {toast}
        </div>
      )}
    </div>
  )
}
