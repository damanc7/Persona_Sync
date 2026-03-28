import { motion } from 'framer-motion'
import { FlipHorizontal2, Database } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { PerceptionCard } from '@/components/reverse-algorithm/PerceptionCard'
import { ExportPanel } from '@/components/reverse-algorithm/ExportPanel'
import { usePerceptions, useVoteOnPerception } from '@/hooks/usePerceptions'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

export function ReverseAlgorithm() {
  const { data, isLoading, isError, refetch } = usePerceptions()
  const { mutate: vote } = useVoteOnPerception()

  const handleVote = (platformId: string, voteValue: 'agree' | 'disagree' | null) => {
    vote({ platformId, vote: voteValue })
  }

  const sorted = data?.perceptions
    ? [...data.perceptions].sort((a, b) => {
        if (a.connected && !b.connected) return -1
        if (!a.connected && b.connected) return 1
        return b.confidenceScore - a.confidenceScore
      })
    : []

  const totalDataPoints = data?.perceptions.reduce((sum, p) => sum + p.dataPoints, 0) ?? 0

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero */}
      <motion.div variants={sectionVariants}>
        <Card variant="elevated" className="relative overflow-hidden p-6 md:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/5 pointer-events-none" />
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, transparent 0%, rgba(124,58,237,0.04) 50%, transparent 100%)',
              backgroundSize: '100% 60px',
            }}
            animate={{ backgroundPositionY: ['0px', '300px'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <FlipHorizontal2 className="h-5 w-5 text-[var(--color-accent-violet)]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-accent-violet)]">
                Reverse Algorithm
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-2">
              What Algorithms Think About You
            </h1>
            <p className="text-[var(--color-text-secondary)] max-w-xl mb-6 text-sm md:text-base">
              You've seen your data. Now see their model of you. Every platform builds an algorithmic
              profile from your behavior — here's what they've inferred.
            </p>
            {data && (
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-[var(--color-text-muted)]" />
                  <span className="text-sm font-mono text-[var(--color-text-secondary)]">
                    <span className="text-[var(--color-text-primary)] font-semibold">{data.connectedPlatforms}</span> platforms analyzed
                  </span>
                </div>
                <span className="text-[var(--color-text-muted)]">·</span>
                <span className="text-sm font-mono text-[var(--color-text-secondary)]">
                  <span className="text-[var(--color-text-primary)] font-semibold">{totalDataPoints.toLocaleString()}</span> inferred data points
                </span>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Platform Grid */}
      <motion.div variants={sectionVariants}>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Platform Profiles</h2>
        {isError && <ErrorBanner message="Failed to load perceptions" onRetry={() => refetch()} />}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
            variants={gridVariants}
            initial="hidden"
            animate="visible"
          >
            {sorted.map((perception, i) => (
              <PerceptionCard
                key={perception.platformId}
                perception={perception}
                onVote={handleVote}
                index={i}
              />
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Data Portability */}
      <motion.div variants={sectionVariants}>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Your Data, Your Rules</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            This is your algorithmic profile. Export it to any AI platform and bring your full context wherever you go.
          </p>
        </div>
        <ExportPanel />
      </motion.div>
    </motion.div>
  )
}
