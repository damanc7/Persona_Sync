import { useMemo } from 'react'
import { Badge } from '@/components/ui/Badge'
import type { GraphNode } from '@/types'

interface ExposureStatsProps {
  nodes: GraphNode[]
}

type NodeType = 'platform' | 'broker' | 'partner'

const TYPE_LABELS: Record<NodeType, string> = {
  platform: 'Platforms',
  broker: 'Data Brokers',
  partner: 'Partners',
}

const TYPE_COLORS: Record<NodeType, string> = {
  platform: 'bg-cyan-500',
  broker: 'bg-red-500',
  partner: 'bg-emerald-500',
}

function riskLevel(score: number): { label: string; variant: 'error' | 'warning' | 'success' } {
  if (score >= 70) return { label: 'High Risk', variant: 'error' }
  if (score >= 40) return { label: 'Medium Risk', variant: 'warning' }
  return { label: 'Low Risk', variant: 'success' }
}

export function ExposureStats({ nodes }: ExposureStatsProps) {
  const stats = useMemo(() => {
    const dataNodes = nodes.filter(n => n.type !== 'self')
    const overall = dataNodes.length > 0
      ? Math.round(dataNodes.reduce((s, n) => s + n.exposure, 0) / dataNodes.length * 100)
      : 0

    const byType = (['platform', 'broker', 'partner'] as NodeType[]).map(type => {
      const group = dataNodes.filter(n => n.type === type)
      const avg = group.length > 0
        ? Math.round(group.reduce((s, n) => s + n.exposure, 0) / group.length * 100)
        : 0
      return { type, avg, count: group.length }
    })

    const topSources = [...dataNodes]
      .sort((a, b) => b.exposure - a.exposure)
      .slice(0, 3)

    return { overall, byType, topSources }
  }, [nodes])

  const risk = riskLevel(stats.overall)

  return (
    <div className="space-y-4">
      {/* Overall score */}
      <div className="text-center py-2">
        <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-1">Overall Exposure</p>
        <p className={`text-5xl font-bold font-mono ${
          stats.overall >= 70 ? 'text-red-400' : stats.overall >= 40 ? 'text-amber-400' : 'text-emerald-400'
        }`}>
          {stats.overall}
          <span className="text-2xl text-[var(--color-text-muted)]">%</span>
        </p>
        <div className="mt-2">
          <Badge variant={risk.variant}>{risk.label}</Badge>
        </div>
      </div>

      {/* By type */}
      <div>
        <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-2">By Source Type</p>
        <div className="space-y-2">
          {stats.byType.map(({ type, avg, count }) => (
            <div key={type}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--color-text-secondary)]">{TYPE_LABELS[type]}</span>
                <span className="text-[var(--color-text-muted)] font-mono">{count} · {avg}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full ${TYPE_COLORS[type]} opacity-70 transition-all duration-500`}
                  style={{ width: `${avg}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top sources */}
      <div>
        <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-2">Top Exposure Sources</p>
        <div className="space-y-1.5">
          {stats.topSources.map((node, i) => (
            <div key={node.id} className="flex items-center gap-2 text-xs">
              <span className="text-[var(--color-text-muted)] font-mono w-4">{i + 1}.</span>
              <span className="flex-1 text-[var(--color-text-secondary)] truncate">{node.name}</span>
              <span className={`font-mono font-medium ${
                node.exposure >= 0.7 ? 'text-red-400' : node.exposure >= 0.4 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {Math.round(node.exposure * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
