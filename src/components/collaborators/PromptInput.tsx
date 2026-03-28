import { useState, useRef } from 'react'
import * as Select from '@radix-ui/react-select'
import { ChevronDown, Send, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface PromptInputProps {
  onSend: (content: string, topic?: string) => void
  onStream: (words: string[]) => void
  isStreaming: boolean
  selectedTopic?: string
  onTopicChange: (topic: string) => void
}

const topics = [
  { value: 'general', label: 'General' },
  { value: 'scraped-data', label: 'Scraped Data' },
  { value: 'data-map', label: 'Data Map' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'privacy', label: 'Privacy' },
]

const aiResponses: Record<string, string[]> = {
  'scraped-data': [
    'I have analyzed the scraped data items. There appear to be some duplicate entries from LinkedIn that may need manual review. Items with confidence scores below 0.7 are flagged for your attention.',
    'Looking at the scraped data patterns, the email field has the highest accuracy rate at 96%. Phone numbers and addresses tend to have more variability across sources.',
    'The scraped data shows 3 items marked as pending approval. Based on the source reliability scores, I recommend approving items from LinkedIn and GitHub while reviewing the others.',
  ],
  'data-map': [
    'The data map shows your information is distributed across 12 platforms. Acxiom and Experian have the highest exposure scores. I can help you initiate opt-out requests for these brokers.',
    'Based on the exposure analysis, your professional data (LinkedIn, GitHub) is most widely shared. Your location data has more controlled access. Would you like a detailed breakdown?',
    'I notice the data map has not been updated in the last 7 days. Running a fresh scan could reveal new data broker relationships. Shall I initiate a scan?',
  ],
  general: [
    'I am here to help you manage your persona data. You can ask me about your scraped data, data map connections, marketplace listings, or privacy settings.',
    'Feel free to ask me anything about your data. I can analyze patterns, suggest privacy improvements, or help you understand how your data is being used.',
    'I can assist with reviewing collaborator activity, checking data integrity, or explaining any aspect of your PersonaSync account.',
  ],
}

function getAIResponse(topic: string): string {
  const responses = aiResponses[topic] ?? aiResponses['general']!
  return responses[Math.floor(Math.random() * responses.length)]!
}

export function PromptInput({ onSend, onStream, isStreaming, selectedTopic = 'general', onTopicChange }: PromptInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || isStreaming) return
    onSend(trimmed, selectedTopic)
    setValue('')
    textareaRef.current?.focus()

    // Simulate streaming AI response
    const response = getAIResponse(selectedTopic)
    const words = response.split(' ')
    onStream(words)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-[var(--color-border-subtle)] p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--color-text-muted)]">Topic:</span>
        <Select.Root value={selectedTopic} onValueChange={onTopicChange}>
          <Select.Trigger className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-[var(--color-border-default)] text-xs text-[var(--color-text-secondary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-violet)]">
            <Select.Value />
            <Select.Icon>
              <ChevronDown className="h-3 w-3" />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content
              className="z-50 overflow-hidden rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] shadow-xl shadow-black/40"
              position="popper"
              sideOffset={4}
            >
              <Select.Viewport className="p-1">
                {topics.map(t => (
                  <Select.Item
                    key={t.value}
                    value={t.value}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-md text-xs cursor-pointer outline-none',
                      'data-[highlighted]:bg-white/10 text-[var(--color-text-primary)]'
                    )}
                  >
                    <Select.ItemText>{t.label}</Select.ItemText>
                    <Select.ItemIndicator className="ml-auto">
                      <Check className="h-3 w-3 text-violet-400" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      <div className="flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question or add a comment... (Shift+Enter for new line)"
          rows={2}
          disabled={isStreaming}
          className="flex-1 resize-none px-3 py-2.5 rounded-lg bg-white/5 border border-[var(--color-border-default)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-violet)] transition-colors disabled:opacity-50 min-h-[60px]"
        />
        <Button
          onClick={handleSend}
          disabled={!value.trim() || isStreaming}
          loading={isStreaming}
          size="sm"
          className="shrink-0 self-end"
        >
          {!isStreaming && <Send className="h-3.5 w-3.5" />}
          {isStreaming ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </div>
  )
}
