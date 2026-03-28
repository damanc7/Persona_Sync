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
  { value: 'api-design', label: 'API Design' },
  { value: 'auth', label: 'Auth & Security' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'tooling', label: 'Tooling & Workflow' },
]

export function PromptInput({ onSend, onStream, isStreaming, selectedTopic = 'general', onTopicChange }: PromptInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || isStreaming) return
    onSend(trimmed, selectedTopic)
    setValue('')
    textareaRef.current?.focus()

    const words = trimmed.split(' ')
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
          <Select.Trigger className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--color-overlay-dim)] border border-[var(--color-border-default)] text-xs text-[var(--color-text-secondary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-violet)]">
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
                      'data-[highlighted]:bg-[var(--color-overlay-dim)] text-[var(--color-text-primary)]'
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
          placeholder="Ask a question and each profile will respond... (Shift+Enter for new line)"
          rows={2}
          disabled={isStreaming}
          className="flex-1 resize-none px-3 py-2.5 rounded-lg bg-[var(--color-overlay-dim)] border border-[var(--color-border-default)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-violet)] transition-colors disabled:opacity-50 min-h-[60px]"
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
