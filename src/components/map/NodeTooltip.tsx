import { createPortal } from 'react-dom'
import { Badge } from '@/components/ui/Badge'
import type { GraphNode } from '@/types'

interface NodeTooltipProps {
  node: GraphNode
  x: number
  y: number
  connectedCount: number
}

function coverageColor(exposure: number): string {
  if (exposure >= 0.7) return 'text-emerald-400'
  if (exposure >= 0.4) return 'text-amber-400'
  return 'text-[var(--color-text-muted)]'
}

function typeBadgeVariant(type: GraphNode['type']): 'violet' | 'cyan' | 'error' | 'success' {
  switch (type) {
    case 'self': return 'violet'
    case 'platform': return 'cyan'
    case 'broker': return 'violet'
    case 'partner': return 'success'
  }
}

export function NodeTooltip({ node, x, y, connectedCount }: NodeTooltipProps) {
  const OFFSET = 12

  return createPortal(
    <div
      style={{ left: x + OFFSET, top: y + OFFSET }}
      className="pointer-events-none fixed z-50 w-44 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-3 shadow-xl shadow-black/50 text-xs"
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-semibold text-[var(--color-text-primary)] truncate">{node.name}</span>
        <Badge variant={typeBadgeVariant(node.type)}>{node.type}</Badge>
      </div>
      <div className="space-y-1 text-[var(--color-text-secondary)]">
        <div className="flex justify-between">
          <span>Coverage</span>
          <span className={`font-mono font-medium ${coverageColor(node.exposure)}`}>
            {Math.round(node.exposure * 100)}%
          </span>
        </div>
        <div className="flex justify-between">
          <span>Category</span>
          <span className="text-[var(--color-text-primary)]">{node.category}</span>
        </div>
        <div className="flex justify-between">
          <span>Connections</span>
          <span className="text-[var(--color-text-primary)]">{connectedCount}</span>
        </div>
      </div>
    </div>,
    document.body
  )
}
