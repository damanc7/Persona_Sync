import * as Progress from '@radix-ui/react-progress'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ScanProgressBarProps {
  progress: number
  message: string
  status: 'running' | 'complete'
}

export function ScanProgressBar({ progress, message, status }: ScanProgressBarProps) {
  const isComplete = status === 'complete'

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-4 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isComplete ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <span className={cn('w-2 h-2 rounded-full bg-violet-400', !isComplete && 'animate-pulse')} />
          )}
          <span className="text-sm font-medium text-[var(--color-text-primary)]">
            {isComplete ? 'Scan Complete' : 'Scanning...'}
          </span>
        </div>
        <span className="text-xs font-mono text-[var(--color-text-muted)]">{progress}%</span>
      </div>

      <Progress.Root
        className="relative overflow-hidden bg-white/8 rounded-full h-1.5"
        value={progress}
      >
        <Progress.Indicator
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            isComplete ? 'bg-emerald-500' : 'bg-violet-500'
          )}
          style={{ width: `${progress}%` }}
        />
      </Progress.Root>

      <p className="text-xs text-[var(--color-text-muted)]">{message}</p>
    </motion.div>
  )
}
