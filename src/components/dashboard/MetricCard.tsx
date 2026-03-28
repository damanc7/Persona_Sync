import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { CardSkeleton } from '@/components/ui/Skeleton'

interface MetricCardProps {
  icon: React.ReactNode
  label: string
  value: number
  trend?: { direction: 'up' | 'down'; percentage: number }
  loading?: boolean
  valuePrefix?: string
  valueSuffix?: string
}

function useCountUp(target: number, duration = 1000) {
  const [current, setCurrent] = useState(0)
  const frameRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    startRef.current = null
    const step = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp
      const elapsed = timestamp - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(eased * target))
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step)
      }
    }
    frameRef.current = requestAnimationFrame(step)
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [target, duration])

  return current
}

export function MetricCard({ icon, label, value, trend, loading, valuePrefix = '', valueSuffix = '' }: MetricCardProps) {
  if (loading) return <CardSkeleton />

  const displayValue = useCountUp(value, 900)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-lg bg-[var(--color-overlay-dim)] text-[var(--color-text-secondary)]">
            {icon}
          </div>
          {trend && (
            <span
              className={`flex items-center gap-1 text-xs font-mono font-medium ${
                trend.direction === 'up' ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {trend.direction === 'up' ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {trend.percentage}%
            </span>
          )}
        </div>
        <div>
          <p className="font-mono text-3xl font-bold text-[var(--color-text-primary)] leading-none">
            {valuePrefix}{displayValue}{valueSuffix}
          </p>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">{label}</p>
        </div>
      </Card>
    </motion.div>
  )
}
