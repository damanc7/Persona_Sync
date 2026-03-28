import { motion } from 'framer-motion'
import type { ConfidenceLevel } from '@/types'

const levelConfig: Record<ConfidenceLevel, { color: string; label: string }> = {
  very_high: { color: '#7c3aed', label: 'Very High' },
  high: { color: '#06b6d4', label: 'High' },
  medium: { color: '#f59e0b', label: 'Medium' },
  low: { color: '#94a3b8', label: 'Low' },
}

interface ConfidenceBarProps {
  score: number
  level: ConfidenceLevel
  showLabel?: boolean
  label?: string
  className?: string
}

export function ConfidenceBar({ score, level, showLabel = true, label = 'Confidence', className }: ConfidenceBarProps) {
  const { color, label: levelLabel } = levelConfig[level]
  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-[var(--color-text-muted)] font-mono uppercase tracking-wider">{label}</span>
          <span className="text-xs font-mono font-semibold" style={{ color }}>
            {levelLabel} · {Math.round(score * 100)}%
          </span>
        </div>
      )}
      <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}60` }}
          initial={{ width: 0 }}
          animate={{ width: `${score * 100}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
    </div>
  )
}
