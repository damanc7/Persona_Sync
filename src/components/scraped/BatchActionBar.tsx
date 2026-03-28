import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface BatchActionBarProps {
  selectedCount: number
  onApproveAll: () => void
  onDenyAll: () => void
  onDeselectAll: () => void
  loading?: boolean
}

export function BatchActionBar({
  selectedCount,
  onApproveAll,
  onDenyAll,
  onDeselectAll,
  loading,
}: BatchActionBarProps) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] shadow-2xl shadow-black/50 backdrop-blur-md">
            <span className="text-sm font-medium text-[var(--color-text-primary)] whitespace-nowrap">
              {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
            </span>

            <div className="w-px h-4 bg-[var(--color-border-subtle)]" />

            <Button
              size="sm"
              variant="secondary"
              loading={loading}
              onClick={onApproveAll}
              className="gap-1.5 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Approve All
            </Button>

            <Button
              size="sm"
              variant="danger"
              loading={loading}
              onClick={onDenyAll}
              className="gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" />
              Deny All
            </Button>

            <button
              onClick={onDeselectAll}
              className="ml-1 p-1 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-white/8 transition-colors"
              aria-label="Deselect all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
