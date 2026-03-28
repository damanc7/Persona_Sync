import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import type { DataSource } from '@/types'

interface SourceSummaryProps {
  sources?: DataSource[]
  loading?: boolean
}

function riskVariant(level: DataSource['riskLevel']): 'success' | 'warning' | 'error' {
  switch (level) {
    case 'low': return 'success'
    case 'medium': return 'warning'
    case 'high': return 'error'
  }
}

function riskBarColor(level: DataSource['riskLevel']): string {
  switch (level) {
    case 'low': return 'bg-emerald-500'
    case 'medium': return 'bg-amber-500'
    case 'high': return 'bg-red-500'
  }
}

export function SourceSummary({ sources, loading }: SourceSummaryProps) {
  const maxCount = sources ? Math.max(...sources.map(s => s.itemCount)) : 1

  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">
        Top Data Sources
      </h3>
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
          ))}
        </div>
      ) : (
        <ul className="space-y-4">
          {(sources ?? []).map((source, index) => (
            <motion.li
              key={source.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.07 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">{source.name}</span>
                  <span className="text-xs font-mono text-[var(--color-text-muted)]">{source.itemCount} items</span>
                </div>
                <Badge variant={riskVariant(source.riskLevel)}>
                  {source.riskLevel}
                </Badge>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/8 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${riskBarColor(source.riskLevel)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(source.itemCount / maxCount) * 100}%` }}
                  transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 + index * 0.07 }}
                />
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </Card>
  )
}
