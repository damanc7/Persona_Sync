import type { MutableRefObject } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface GraphControlsProps {
  graphRef: MutableRefObject<any>
  activeFilters: string[]
  onToggleFilter: (category: string) => void
  allCategories: string[]
}

const ZOOM_STEP = 1.5

export function GraphControls({ graphRef, activeFilters, onToggleFilter, allCategories }: GraphControlsProps) {
  function handleZoomIn() {
    if (!graphRef.current) return
    const current = graphRef.current.zoom() as number
    graphRef.current.zoom(current * ZOOM_STEP, 300)
  }

  function handleZoomOut() {
    if (!graphRef.current) return
    const current = graphRef.current.zoom() as number
    graphRef.current.zoom(current / ZOOM_STEP, 300)
  }

  function handleReset() {
    graphRef.current?.zoomToFit(400, 40)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Zoom controls */}
      <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)]/90 backdrop-blur-sm p-2 flex flex-col gap-1">
        <Button variant="ghost" size="sm" onClick={handleZoomIn} title="Zoom in" className="w-8 h-8 p-0 text-base">
          +
        </Button>
        <Button variant="ghost" size="sm" onClick={handleZoomOut} title="Zoom out" className="w-8 h-8 p-0 text-base">
          −
        </Button>
        <div className="h-px bg-[var(--color-border-subtle)] mx-1" />
        <Button variant="ghost" size="sm" onClick={handleReset} title="Fit view" className="w-8 h-8 p-0">
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="4" height="4" rx="0.5" />
            <rect x="10" y="2" width="4" height="4" rx="0.5" />
            <rect x="2" y="10" width="4" height="4" rx="0.5" />
            <rect x="10" y="10" width="4" height="4" rx="0.5" />
          </svg>
        </Button>
      </div>

      {/* Category filters */}
      {allCategories.length > 0 && (
        <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)]/90 backdrop-blur-sm p-2 flex flex-col gap-1.5">
          <p className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wide px-1">Filter</p>
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => onToggleFilter(cat)}
              className={cn(
                'text-xs rounded-md px-2 py-1 text-left transition-colors',
                activeFilters.includes(cat)
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                  : 'text-[var(--color-text-muted)] hover:bg-white/8 border border-transparent'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
