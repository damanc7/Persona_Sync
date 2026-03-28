import { useState, useCallback } from 'react'
import { UserPlus } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { Button } from '@/components/ui/Button'
import { CollaboratorList } from '@/components/collaborators/CollaboratorList'
import { InviteModal } from '@/components/collaborators/InviteModal'
import { MessageThread } from '@/components/collaborators/MessageThread'
import { PromptInput } from '@/components/collaborators/PromptInput'
import { useCollaborators, useMessages } from '@/hooks/useCollaborators'
import type { Message, PersonaProfile } from '@/types'

function generatePersonaResponse(persona: PersonaProfile, question: string): string {
  const style = persona.preferences['style'] ?? ''
  const langs = persona.preferences['languages'] ?? ''
  const comm = persona.preferences['communication'] ?? ''

  const lowerQ = question.toLowerCase()

  if (lowerQ.includes('api') || lowerQ.includes('endpoint') || lowerQ.includes('rest')) {
    if (persona.id === 'joe') return 'Keep the API surface tiny. One resource, GET and PUT. Flat JSON payloads. Add endpoints only when you have a real use case, not before.'
    if (persona.id === 'harish') return 'I\'d separate schema from data \u2014 /profile/schema and /profile/data. That lets the UI render forms dynamically and you can version the schema independently.'
    if (persona.id === 'daman') return 'Rails-style resources. `resources :profiles` and you\'re done. Ship it today, refactor next week if needed.'
  }
  if (lowerQ.includes('test') || lowerQ.includes('testing')) {
    if (persona.id === 'joe') return 'Table-driven tests. Every edge case gets a row in the table. Benchmarks before you optimize. No mocks unless absolutely necessary.'
    if (persona.id === 'harish') return 'Integration tests with Vitest and Playwright. Test the user flow end-to-end. Unit tests for pure logic, but don\'t over-unit-test React components.'
    if (persona.id === 'daman') return 'Happy path first with RSpec. Get the critical flows covered, then add edge cases as bugs come in. Don\'t test what the framework already tests.'
  }
  if (lowerQ.includes('database') || lowerQ.includes('db') || lowerQ.includes('storage')) {
    if (persona.id === 'joe') return 'SQLite for local-first, Postgres if you need concurrency. Keep your queries in raw SQL \u2014 ORMs hide too much.'
    if (persona.id === 'harish') return 'Prisma with Postgres. Type-safe queries, auto-generated migrations, and the schema is the source of truth.'
    if (persona.id === 'daman') return 'ActiveRecord with Postgres. Migrations are built in, the query interface is intuitive, and Rails handles connection pooling for you.'
  }

  return `From my perspective (${langs}, ${style}): ${comm === 'Short and direct' ? 'Keep it simple and ship.' : comm === 'Detailed with diagrams' ? 'Let me think through this carefully and map it out.' : 'Let\'s move fast and iterate!'}`
}

export function Collaborators() {
  const [inviteOpen, setInviteOpen] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState('general')
  const [localMessages, setLocalMessages] = useState<Message[]>([])
  const [streamingText, setStreamingText] = useState('')
  const [streamingAuthorId, setStreamingAuthorId] = useState<string | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [toast, setToast] = useState('')
  const [selectedPersonas, setSelectedPersonas] = useState<Set<string>>(new Set(['joe', 'harish', 'daman']))

  const { data: collaborators = [], isLoading: loadingCollabs } = useCollaborators()
  const { data: fetchedMessages = [], isLoading: loadingMessages } = useMessages(selectedTopic !== 'general' ? selectedTopic : undefined)

  const allMessages = [...fetchedMessages, ...localMessages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const togglePersona = useCallback((id: string) => {
    setSelectedPersonas(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

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
    const personas = collaborators.filter(
      c => c.id !== 'u1' && selectedPersonas.has(c.id)
    )
    if (personas.length === 0) return

    const question = words.join(' ')

    setIsStreaming(true)
    let personaIdx = 0

    function streamNextPersona() {
      if (personaIdx >= personas.length) {
        setIsStreaming(false)
        setStreamingText('')
        setStreamingAuthorId(null)
        return
      }

      const persona = personas[personaIdx]!
      const response = generatePersonaResponse(persona, question)
      const responseWords = response.split(' ')
      let wordIdx = 0

      setStreamingAuthorId(persona.id)
      setStreamingText('')

      const tick = () => {
        if (wordIdx >= responseWords.length) {
          setStreamingText('')
          setStreamingAuthorId(null)
          const personaMsg: Message = {
            id: `persona-${persona.id}-${Date.now()}`,
            authorId: persona.id,
            authorType: 'persona',
            content: response,
            timestamp: new Date().toISOString(),
            topic: selectedTopic,
          }
          setLocalMessages(prev => [...prev, personaMsg])
          personaIdx++
          setTimeout(streamNextPersona, 400)
          return
        }
        wordIdx++
        setStreamingText(responseWords.slice(0, wordIdx).join(' '))
        setTimeout(tick, 40 + Math.random() * 40)
      }
      setTimeout(tick, 300)
    }

    streamNextPersona()
  }, [collaborators, selectedPersonas, selectedTopic])

  const handleTopicChange = (topic: string) => {
    setSelectedTopic(topic)
    setLocalMessages([])
  }

  return (
    <div className="flex flex-col h-screen">
      <TopBar
        title="Conversations"
        actions={
          <Button size="sm" onClick={() => setInviteOpen(true)}>
            <UserPlus className="h-3.5 w-3.5" />
            Add Profile
          </Button>
        }
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: persona profiles */}
        <aside className="w-72 shrink-0 border-r border-[var(--color-border-subtle)] overflow-y-auto p-4">
          <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3 px-3">
            Profiles ({collaborators.length})
          </p>
          <CollaboratorList
            collaborators={collaborators}
            loading={loadingCollabs}
            selectedPersonas={selectedPersonas}
            onTogglePersona={togglePersona}
          />
        </aside>

        {/* Right panel: multi-persona conversation */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b border-[var(--color-border-subtle)] px-4 py-3">
            <p className="text-xs text-[var(--color-text-muted)]">
              Ask a question and each profile responds with their perspective
              <span className="text-[var(--color-text-secondary)] font-medium ml-1">
                &middot; {selectedTopic === 'general' ? 'general' : selectedTopic}
              </span>
            </p>
          </div>

          <MessageThread
            messages={allMessages}
            collaborators={collaborators}
            loading={loadingMessages}
            streamingMessage={streamingText}
            streamingAuthorId={streamingAuthorId}
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
        onSuccess={() => showToast('Profile added!')}
      />

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm shadow-xl animate-in fade-in slide-in-from-bottom-2">
          {toast}
        </div>
      )}
    </div>
  )
}
