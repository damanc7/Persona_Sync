import { motion } from 'framer-motion'
import { ThumbsUp, ThumbsDown, Lock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PlatformIcon } from './PlatformIcon'
import { TraitBadge } from './TraitBadge'
import { ConfidenceBar } from './ConfidenceBar'
import type { PlatformPerception } from '@/types'

function getExposureColor(score: number): string {
  if (score >= 0.7) return '#ef4444'
  if (score >= 0.4) return '#f59e0b'
  return '#10b981'
}

function formatDate(iso: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const categoryVariantMap: Record<string, 'violet' | 'cyan' | 'default' | 'muted'> = {
  Professional: 'violet',
  Consumer: 'cyan',
  Productivity: 'cyan',
  Creative: 'default',
  Social: 'muted',
}

interface PerceptionCardProps {
  perception: PlatformPerception
  onVote: (platformId: string, vote: 'agree' | 'disagree' | null) => void
  index?: number
}

export function PerceptionCard({ perception, onVote, index = 0 }: PerceptionCardProps) {
  const {
    platformId, platformName, connected, category, summary,
    confidenceLevel, confidenceScore, exposureScore, traits,
    lastUpdated, dataPoints, userAccuracyVote,
  } = perception

  const cardVariant = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { duration: 0.4, delay: index * 0.06 },
    },
  }

  if (!connected) {
    return (
      <motion.div variants={cardVariant}>
        <Card variant="elevated" className="p-5 flex flex-col items-center justify-center gap-3 min-h-[200px] opacity-50">
          <PlatformIcon platformId={platformId} platformName={platformName} size="lg" />
          <p className="font-semibold text-[var(--color-text-primary)]">{platformName}</p>
          <div className="flex items-center gap-1.5 text-[var(--color-text-muted)] text-sm">
            <Lock className="h-3.5 w-3.5" />
            <span>Not connected</span>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] text-center max-w-[200px]">{summary}</p>
          <Button variant="secondary" size="sm">Connect {platformName}</Button>
        </Card>
      </motion.div>
    )
  }

  const exposureColor = getExposureColor(exposureScore)

  return (
    <motion.div variants={cardVariant}>
      <Card variant="elevated" className="p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <PlatformIcon platformId={platformId} platformName={platformName} size="md" />
            <div>
              <p className="font-semibold text-[var(--color-text-primary)] text-sm">{platformName}</p>
              <Badge variant={categoryVariantMap[category] ?? 'default'}>{category}</Badge>
            </div>
          </div>
          <span className="text-xs font-mono text-[var(--color-text-muted)] shrink-0">
            {dataPoints.toLocaleString()} pts
          </span>
        </div>

        <p className="text-sm text-[var(--color-text-secondary)] line-clamp-3 leading-relaxed">{summary}</p>

        <ConfidenceBar score={confidenceScore} level={confidenceLevel} showLabel />

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-[var(--color-text-muted)] font-mono uppercase tracking-wider">Data Exposure</span>
            <span className="text-xs font-mono font-semibold" style={{ color: exposureColor }}>
              {Math.round(exposureScore * 100)}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: exposureColor, boxShadow: `0 0 6px ${exposureColor}60` }}
              initial={{ width: 0 }}
              animate={{ width: `${exposureScore * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.35 }}
            />
          </div>
        </div>

        {traits.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {traits.map(trait => (
              <TraitBadge key={trait.id} trait={trait} />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-1 border-t border-[var(--color-border-subtle)]">
          <span className="text-xs text-[var(--color-text-muted)]">
            {lastUpdated ? `Updated ${formatDate(lastUpdated)}` : ''}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onVote(platformId, userAccuracyVote === 'agree' ? null : 'agree')}
              className={`p-1.5 rounded-md transition-colors hover:bg-emerald-500/10 ${userAccuracyVote === 'agree' ? 'text-emerald-400' : 'text-[var(--color-text-muted)]'}`}
              title="This is accurate"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onVote(platformId, userAccuracyVote === 'disagree' ? null : 'disagree')}
              className={`p-1.5 rounded-md transition-colors hover:bg-red-500/10 ${userAccuracyVote === 'disagree' ? 'text-red-400' : 'text-[var(--color-text-muted)]'}`}
              title="This is inaccurate"
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
