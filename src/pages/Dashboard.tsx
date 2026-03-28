import { motion } from 'framer-motion'
import { Database, Layers, Puzzle, UserCheck } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { ExposureScoreHero } from '@/components/dashboard/ExposureScoreHero'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { SourceSummary } from '@/components/dashboard/SourceSummary'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { useDashboardStats } from '@/hooks/useDashboardStats'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}

export function Dashboard() {
  const { data, isLoading, isError, refetch } = useDashboardStats()

  return (
    <div>
      <TopBar title="My Profile" />
      <motion.div
        className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {isError && (
          <motion.div variants={sectionVariants}>
            <ErrorBanner
              message="Failed to load dashboard data."
              onRetry={() => refetch()}
            />
          </motion.div>
        )}

        {/* Profile completeness hero */}
        <motion.section variants={sectionVariants}>
          <ExposureScoreHero score={data?.exposureScore} loading={isLoading} />
        </motion.section>

        {/* Metric cards row */}
        <motion.section variants={sectionVariants}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
            ) : (
              <>
                <MetricCard
                  icon={<UserCheck className="h-4 w-4" />}
                  label="Profile Sections Filled"
                  value={data?.profileCompletion ?? 0}
                  valueSuffix="%"
                />
                <MetricCard
                  icon={<Database className="h-4 w-4" />}
                  label="Preferences Stored"
                  value={data?.dataPoints ?? 0}
                />
                <MetricCard
                  icon={<Layers className="h-4 w-4" />}
                  label="Pending Reviews"
                  value={data?.pendingApprovals ?? 0}
                  trend={{ direction: 'up', percentage: 14 }}
                />
                <MetricCard
                  icon={<Puzzle className="h-4 w-4" />}
                  label="Connected Integrations"
                  value={data?.activeBids ?? 0}
                />
              </>
            )}
          </div>
        </motion.section>

        {/* Activity feed + Source summary */}
        <motion.section variants={sectionVariants}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ActivityFeed items={data?.recentActivity} loading={isLoading} />
            <SourceSummary sources={data?.topSources} loading={isLoading} />
          </div>
        </motion.section>

        {/* Quick actions */}
        <motion.section variants={sectionVariants}>
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
            Quick Actions
          </h2>
          <QuickActions />
        </motion.section>
      </motion.div>
    </div>
  )
}
