import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { ScrapedItem } from '@/types'

const SOURCE_COLOR_MAP: Record<string, 'success' | 'cyan' | 'violet' | 'warning' | 'error' | 'default'> = {
  Google: 'error',
  LinkedIn: 'cyan',
  Facebook: 'violet',
  Twitter: 'cyan',
  Amazon: 'warning',
  Spotify: 'success',
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  })
}

interface ScrapedItemCardProps {
  item: ScrapedItem
  selected: boolean
  onToggleSelect: (id: string) => void
  onApprove: (id: string) => void
  onDeny: (id: string) => void
  updatingId?: string | null
}

export function ScrapedItemCard({
  item,
  selected,
  onToggleSelect,
  onApprove,
  onDeny,
  updatingId,
}: ScrapedItemCardProps) {
  const badgeVariant = SOURCE_COLOR_MAP[item.source] ?? 'default'
  const isUpdating = updatingId === item.id

  const flashClass =
    item.status === 'approved'
      ? 'ring-1 ring-emerald-500/40 bg-emerald-500/5'
      : item.status === 'denied'
      ? 'ring-1 ring-red-500/40 bg-red-500/5'
      : ''

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      className={cn(
        'rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-4 flex flex-col gap-3 transition-all duration-300',
        selected && 'ring-1 ring-[var(--color-accent-violet)] border-[var(--color-accent-violet)]',
        flashClass
      )}
    >
      {/* Header row */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect(item.id)}
          className="mt-0.5 w-4 h-4 rounded accent-violet-500 cursor-pointer flex-shrink-0"
          aria-label={`Select item ${item.field}`}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={badgeVariant}>{item.source}</Badge>
            <span className="text-xs font-mono text-[var(--color-text-muted)]">
              {Math.round(item.confidence * 100)}% confidence
            </span>
            <AnimatePresence mode="wait">
              {item.status !== 'pending' && (
                <motion.span
                  key={item.status}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Badge variant={item.status === 'approved' ? 'success' : 'error'}>
                    {item.status}
                  </Badge>
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <p className="mt-1 text-xs text-[var(--color-text-muted)]">{item.field}</p>
          <p className="mt-0.5 text-sm font-medium text-[var(--color-text-primary)] truncate">{item.value}</p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">{formatTime(item.scrapedAt)}</p>
        </div>
      </div>

      {/* Action row */}
      <div className="flex items-center gap-2 pl-7">
        <Button
          size="sm"
          variant="secondary"
          loading={isUpdating}
          onClick={() => onApprove(item.id)}
          disabled={item.status === 'approved' || isUpdating}
          aria-label={`Approve ${item.field} from ${item.source}`}
          className={cn(
            'gap-1.5',
            item.status === 'approved' && 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
          )}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Approve
        </Button>
        <Button
          size="sm"
          variant="danger"
          loading={isUpdating}
          onClick={() => onDeny(item.id)}
          disabled={item.status === 'denied' || isUpdating}
          aria-label={`Deny ${item.field} from ${item.source}`}
        >
          <XCircle className="w-3.5 h-3.5" />
          Deny
        </Button>
      </div>
    </motion.div>
  )
}
