import { useState } from 'react'
import { Bot, MessageCircle, Sparkles, Code2, FileText, Copy, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useExportPersona } from '@/hooks/usePerceptions'
import type { AIExportFormatId } from '@/types'
import { cn } from '@/lib/utils'

const formats = [
  { id: 'anthropic' as AIExportFormatId, label: 'Claude (Anthropic)', description: 'Paste into any Claude Project as context.', Icon: Bot, accentClass: 'border-amber-500/40 bg-amber-500/5', textClass: 'text-amber-400' },
  { id: 'openai' as AIExportFormatId, label: 'ChatGPT (OpenAI)', description: 'Formatted as Custom Instructions.', Icon: MessageCircle, accentClass: 'border-emerald-500/40 bg-emerald-500/5', textClass: 'text-emerald-400' },
  { id: 'gemini' as AIExportFormatId, label: 'Gemini (Google)', description: 'Structured for Gemini personalization.', Icon: Sparkles, accentClass: 'border-blue-500/40 bg-blue-500/5', textClass: 'text-blue-400' },
  { id: 'json' as AIExportFormatId, label: 'JSON Export', description: 'Machine-readable. Use with any API.', Icon: Code2, accentClass: 'border-violet-500/40 bg-violet-500/5', textClass: 'text-violet-400' },
  { id: 'markdown' as AIExportFormatId, label: 'Markdown', description: 'Human-readable. Paste anywhere.', Icon: FileText, accentClass: 'border-cyan-500/40 bg-cyan-500/5', textClass: 'text-cyan-400' },
]

async function handleCopy(content: string, label: string) {
  try {
    await navigator.clipboard.writeText(content)
    toast.success(`${label} copied to clipboard`)
  } catch {
    toast.error('Copy failed - please select and copy manually')
  }
}

function handleDownload(content: string, format: AIExportFormatId, label: string) {
  const ext = format === 'json' ? 'json' : 'md'
  const mimeType = format === 'json' ? 'application/json' : 'text/markdown'
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `persona-sync-export-${new Date().toISOString().split('T')[0]}.${ext}`
  a.click()
  URL.revokeObjectURL(url)
  toast.success(`${label} downloaded`)
}

export function ExportPanel() {
  const [activeFormat, setActiveFormat] = useState<AIExportFormatId>('anthropic')
  const { data, isLoading } = useExportPersona(activeFormat)

  const activeFormatMeta = formats.find(f => f.id === activeFormat)!
  const canDownload = activeFormat === 'json' || activeFormat === 'markdown'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6">
      <div>
        <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">Take Your Data Anywhere</h3>
        <p className="text-sm text-[var(--color-text-secondary)] mb-4">
          You own this profile. Export it to any AI platform in one click.
        </p>
        <div className="flex flex-col gap-2">
          {formats.map(({ id, label, description, Icon, accentClass, textClass }) => {
            const isActive = activeFormat === id
            return (
              <button
                key={id}
                onClick={() => setActiveFormat(id)}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-lg border text-left transition-all',
                  isActive
                    ? accentClass
                    : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-default)] bg-transparent'
                )}
              >
                <Icon className={cn('h-4 w-4 mt-0.5 shrink-0', isActive ? textClass : 'text-[var(--color-text-muted)]')} />
                <div>
                  <p className={cn('text-sm font-medium', isActive ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]')}>{label}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <Card variant="elevated" className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">{activeFormatMeta.label}</span>
          <div className="flex items-center gap-2">
            {canDownload && data && (
              <Button variant="ghost" size="sm" onClick={() => handleDownload(data.content, activeFormat, activeFormatMeta.label)}>
                <Download className="h-3.5 w-3.5 mr-1" />
                Download
              </Button>
            )}
            <Button variant="primary" size="sm" disabled={!data} onClick={() => data && handleCopy(data.content, activeFormatMeta.label)}>
              <Copy className="h-3.5 w-3.5 mr-1" />
              Copy
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className={`h-3 ${i % 3 === 2 ? 'w-2/3' : 'w-full'}`} />
            ))}
          </div>
        ) : (
          <pre className="text-xs font-mono text-[var(--color-text-secondary)] bg-[var(--color-bg-base)] p-4 rounded-lg border border-[var(--color-border-subtle)] overflow-auto max-h-80 whitespace-pre-wrap break-words">
            {data?.content ?? ''}
          </pre>
        )}

        <p className="text-xs text-[var(--color-text-muted)]">
          Generated from your connected platforms. This data is yours to use anywhere.
        </p>
      </Card>
    </div>
  )
}
