import { useMemo, useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { GraphCanvas } from '@/components/map/GraphCanvas'
import { GraphLegend } from '@/components/map/GraphLegend'
import { GraphControls } from '@/components/map/GraphControls'
import { ExposureStats } from '@/components/map/ExposureStats'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { useGraphData } from '@/hooks/useGraphData'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

export function DataMap() {
  const { data, isLoading, isError } = useGraphData()
  const graphRef = useRef<any>(null)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [statsOpen, setStatsOpen] = useState(true)

  const allCategories = useMemo(() => {
    if (!data) return []
    const cats = new Set(data.nodes.filter(n => n.type !== 'self').map(n => n.category))
    return Array.from(cats).sort()
  }, [data])

  function handleToggleFilter(category: string) {
    setActiveFilters(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar
        title="Profile Map"
        actions={
          <button
            onClick={() => setStatsOpen(o => !o)}
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors px-2 py-1 rounded-md hover:bg-[var(--color-overlay-dim)]"
          >
            {statsOpen ? 'Hide' : 'Show'} Stats
          </button>
        }
      />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Graph area */}
        <div className="flex-1 relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg-base)]">
              <div className="space-y-3 w-64">
                <CardSkeleton />
                <CardSkeleton />
              </div>
            </div>
          )}
          {isError && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg-base)]">
              <p className="text-[var(--color-text-muted)] text-sm">Failed to load graph data.</p>
            </div>
          )}
          {data && (
            <>
              <p className="sr-only">
                Interactive profile map showing {data.nodes.length} connected data sources and {data.links.length} relationships that shape your personal profile.
              </p>
              <GraphCanvas
                nodes={data.nodes}
                links={data.links}
                filters={activeFilters}
                graphRef={graphRef}
              />
            </>
          )}

          {/* Overlay controls (top-left) */}
          <div className="absolute top-4 left-4 z-10">
            <GraphControls
              graphRef={graphRef}
              activeFilters={activeFilters}
              onToggleFilter={handleToggleFilter}
              allCategories={allCategories}
            />
          </div>

          {/* Legend (bottom-left) */}
          <div className="absolute bottom-4 left-4 z-10">
            <GraphLegend nodes={data?.nodes ?? []} links={data?.links ?? []} />
          </div>
        </div>

        {/* Exposure stats sidebar */}
        <div className={cn(
          'flex-shrink-0 overflow-y-auto border-l border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] transition-all duration-300',
          statsOpen ? 'w-60 p-4' : 'w-0 p-0 overflow-hidden border-l-0'
        )}>
          {statsOpen && data && (
            <>
              <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-4">Profile Coverage</p>
              <ExposureStats nodes={data.nodes} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
