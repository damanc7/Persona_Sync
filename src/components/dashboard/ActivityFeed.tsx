import { motion } from 'framer-motion'
import { ScanLine, DollarSign, Clock, UserCheck, Activity } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import type { ActivityItem } from '@/types'

interface ActivityFeedProps {
  items?: ActivityItem[]
  loading?: boolean
}

function getActivityIcon(type: ActivityItem['type']) {
  switch (type) {
    case 'scrape_complete':
      return <ScanLine className="h-4 w-4" />
    case 'bid_received':
      return <DollarSign className="h-4 w-4" />
    case 'approval_needed':
      return <Clock className="h-4 w-4" />
    case 'profile_updated':
      return <UserCheck className="h-4 w-4" />
    default:
      return <Activity className="h-4 w-4" />
  }
}

function getActivityColor(type: ActivityItem['type']): string {
  switch (type) {
    case 'scrape_complete':
      return 'text-cyan-400 bg-cyan-500/15'
    case 'bid_received':
      return 'text-emerald-400 bg-emerald-500/15'
    case 'approval_needed':
      return 'text-amber-400 bg-amber-500/15'
    case 'profile_updated':
      return 'text-violet-400 bg-violet-500/15'
    default:
      return 'text-[var(--color-text-secondary)] bg-white/8'
  }
}

function relativeTime(timestamp: string): string {
  const now = new Date()
  const then = new Date(timestamp)
  const diffMs = now.getTime() - then.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffSec < 60) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  return `${diffDay}d ago`
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 py-3">
      <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  )
}

export function ActivityFeed({ items, loading }: ActivityFeedProps) {
  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">
        Recent Activity
      </h3>
      {loading ? (
        <div className="divide-y divide-[var(--color-border-subtle)]">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : !items || items.length === 0 ? (
        <EmptyState
          icon={<Activity className="h-8 w-8" />}
          title="No recent activity"
          description="Activity from scans, bids, and profile updates will appear here."
        />
      ) : (
        <ul className="divide-y divide-[var(--color-border-subtle)]">
          {items.map((item, index) => (
            <motion.li
              key={item.id}
              className="flex items-center gap-3 py-3"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.07 }}
            >
              <div className={`p-2 rounded-lg shrink-0 ${getActivityColor(item.type)}`}>
                {getActivityIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--color-text-primary)] truncate">{item.message}</p>
              </div>
              <span className="text-xs font-mono text-[var(--color-text-muted)] shrink-0 ml-2">
                {relativeTime(item.timestamp)}
              </span>
            </motion.li>
          ))}
        </ul>
      )}
    </Card>
  )
}
