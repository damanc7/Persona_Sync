import type { GraphNode, GraphLink } from '@/types'

interface GraphLegendProps {
  nodes: GraphNode[]
  links: GraphLink[]
}

const NODE_TYPES = [
  { type: 'self', label: 'You', color: '#7c3aed' },
  { type: 'platform', label: 'Platform', color: '#06b6d4' },
  { type: 'broker', label: 'Enrichment', color: '#8b5cf6' },
  { type: 'partner', label: 'Integration', color: '#10b981' },
] as const

const LINK_TYPES = [
  { type: 'direct', label: 'Direct', opacity: 'opacity-70' },
  { type: 'indirect', label: 'Shared', opacity: 'opacity-40' },
  { type: 'inferred', label: 'Inferred', opacity: 'opacity-20' },
] as const

export function GraphLegend({ nodes, links }: GraphLegendProps) {
  const avgExposure = nodes.length > 0
    ? Math.round((nodes.reduce((sum, n) => sum + n.exposure, 0) / nodes.length) * 100)
    : 0

  return (
    <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)]/90 backdrop-blur-sm p-4 space-y-4 w-44">
      <div>
        <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-2">Node Types</p>
        <div className="space-y-1.5">
          {NODE_TYPES.map(({ type, label, color }) => (
            <div key={type} className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <span className="text-xs text-[var(--color-text-secondary)]">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-2">Link Types</p>
        <div className="space-y-1.5">
          {LINK_TYPES.map(({ type, label, opacity }) => (
            <div key={type} className="flex items-center gap-2">
              <span className={`h-px w-6 bg-[var(--color-text-primary)] flex-shrink-0 ${opacity}`} />
              <span className="text-xs text-[var(--color-text-secondary)]">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[var(--color-border-subtle)] pt-3 space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-[var(--color-text-muted)]">Total nodes</span>
          <span className="text-[var(--color-text-primary)] font-mono">{nodes.length}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-[var(--color-text-muted)]">Total links</span>
          <span className="text-[var(--color-text-primary)] font-mono">{links.length}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-[var(--color-text-muted)]">Avg coverage</span>
          <span className="font-mono text-violet-400">{avgExposure}%</span>
        </div>
      </div>
    </div>
  )
}
