import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'

interface ExposureScoreHeroProps {
  score?: number
  loading?: boolean
}

function getScoreColor(score: number): string {
  if (score >= 75) return '#10b981' // green — strong profile
  if (score >= 40) return '#f59e0b' // amber — growing
  return '#94a3b8' // muted — getting started
}

function getScoreLabel(score: number): string {
  if (score >= 75) return 'Strong Profile'
  if (score >= 40) return 'Growing Profile'
  return 'Getting Started'
}

function ScoreArc({ score, animated }: { score: number; animated: boolean }) {
  const size = 200
  const strokeWidth = 14
  const radius = (size - strokeWidth) / 2
  const cx = size / 2
  const cy = size / 2

  // Arc spans 240 degrees (from 150deg to 390deg / -210deg to 30deg)
  const startAngle = -210
  const totalAngle = 240
  // Convert angle to radians for path
  function polarToCartesian(angleDeg: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    }
  }

  function arcPath(startDeg: number, endDeg: number) {
    const start = polarToCartesian(startDeg)
    const end = polarToCartesian(endDeg)
    const largeArc = endDeg - startDeg > 180 ? 1 : 0
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`
  }

  const endAngle = startAngle + totalAngle
  const fillEndAngle = startAngle + (score / 100) * totalAngle
  const color = getScoreColor(score)

  return (
    <svg width={size} height={size} className="overflow-visible">
      {/* Background track */}
      <path
        d={arcPath(startAngle, endAngle)}
        fill="none"
        stroke="var(--color-track-bg)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Filled arc */}
      {animated ? (
        <motion.path
          d={arcPath(startAngle, fillEndAngle)}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}
        />
      ) : (
        <path
          d={arcPath(startAngle, fillEndAngle)}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}
        />
      )}
      {/* Pulse dot at arc tip */}
      {animated && (
        <motion.circle
          cx={polarToCartesian(fillEndAngle).x}
          cy={polarToCartesian(fillEndAngle).y}
          r={6}
          fill={color}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [1, 1.4, 1], opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut', delay: 1.4, repeat: Infinity, repeatDelay: 2 }}
        />
      )}
    </svg>
  )
}

export function ExposureScoreHero({ score, loading }: ExposureScoreHeroProps) {
  if (loading || score === undefined) {
    return (
      <Card className="p-8 flex flex-col items-center gap-4">
        <Skeleton className="w-[200px] h-[200px] rounded-full" />
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-64" />
      </Card>
    )
  }

  const color = getScoreColor(score)
  const label = getScoreLabel(score)

  return (
    <Card variant="elevated" className="p-8 flex flex-col items-center gap-2">
      <div className="relative">
        <ScoreArc score={score} animated />
        <div className="absolute inset-0 flex flex-col items-center justify-center mt-4">
          <motion.span
            className="font-mono text-5xl font-bold leading-none"
            style={{ color }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-[var(--color-text-muted)] mt-1 font-mono uppercase tracking-widest">/ 100</span>
        </div>
      </div>
      <motion.div
        className="text-center mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        <p className="text-base font-semibold" style={{ color }}>{label}</p>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1 max-w-xs">
          Your profile completeness score. The more Claude Code knows about your preferences, the better it can assist you.
        </p>
      </motion.div>
    </Card>
  )
}
