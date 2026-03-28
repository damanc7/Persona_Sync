import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import * as Tabs from '@radix-ui/react-tabs'
import { Search, ScanLine } from 'lucide-react'

import { TopBar } from '@/components/layout/TopBar'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { IntegrationCard } from '@/components/scraped/IntegrationCard'
import { ScanProgressBar } from '@/components/scraped/ScanProgressBar'
import { ScrapedItemCard } from '@/components/scraped/ScrapedItemCard'
import { BatchActionBar } from '@/components/scraped/BatchActionBar'

import {
  useIntegrations,
  useToggleIntegration,
  useScrapedItems,
  useRunScan,
  useScanStatus,
  useUpdateItem,
  useBatchUpdate,
} from '@/hooks/useScrapedData'

type Filter = 'all' | 'pending' | 'approved' | 'denied'

const FILTER_TABS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'denied', label: 'Denied' },
]

export function ScrapedData() {
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [activeJobId, setActiveJobId] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  // Queries
  const integrations = useIntegrations()
  const items = useScrapedItems(filter, search)
  const scanStatus = useScanStatus(activeJobId)

  // Mutations
  const toggleIntegration = useToggleIntegration()
  const runScan = useRunScan()
  const updateItem = useUpdateItem()
  const batchUpdate = useBatchUpdate()

  // When scan completes, clear the jobId after a short delay so the complete state is visible
  const scanData = scanStatus.data
  const isScanning = !!activeJobId && scanData?.status !== 'complete'
  const scanComplete = !!activeJobId && scanData?.status === 'complete'

  const handleRunScan = () => {
    runScan.mutate(undefined, {
      onSuccess: ({ jobId }) => {
        setActiveJobId(jobId)
      },
    })
  }

  const handleScanDismiss = () => {
    setActiveJobId(null)
  }

  const toggleSelect = useCallback((id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleApprove = (id: string) => {
    updateItem.mutate({ id, status: 'approved' })
  }

  const handleDeny = (id: string) => {
    updateItem.mutate({ id, status: 'denied' })
  }

  const handleBatchApprove = () => {
    batchUpdate.mutate(
      { ids: Array.from(selected), status: 'approved' },
      { onSuccess: () => setSelected(new Set()) }
    )
  }

  const handleBatchDeny = () => {
    batchUpdate.mutate(
      { ids: Array.from(selected), status: 'denied' },
      { onSuccess: () => setSelected(new Set()) }
    )
  }

  // Count helpers for tab labels
  const allItems = items.data?.items ?? []
  const countByStatus = (s: Filter) =>
    s === 'all' ? allItems.length : allItems.filter(i => i.status === s).length

  const updatingId = updateItem.isPending ? (updateItem.variables?.id ?? null) : null

  return (
    <div className="min-h-screen pb-24">
      <TopBar
        title="Scraped Data"
        actions={
          <Button
            size="sm"
            variant="primary"
            loading={runScan.isPending}
            onClick={handleRunScan}
            disabled={isScanning}
          >
            <ScanLine className="w-4 h-4" />
            {isScanning ? 'Scanning...' : 'Run Scan'}
          </Button>
        }
      />

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
        {/* Scan progress */}
        <AnimatePresence>
          {(isScanning || scanComplete) && scanData && (
            <div>
              <ScanProgressBar
                progress={scanData.progress}
                message={scanData.message}
                status={scanData.status}
              />
              {scanComplete && (
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={handleScanDismiss}
                    className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          )}
        </AnimatePresence>

        {/* Integrations */}
        <section>
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
            Data Sources
          </h2>
          {integrations.isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[140px] rounded-xl" />
              ))}
            </div>
          ) : integrations.error ? (
            <p className="text-sm text-red-400">Failed to load integrations</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {integrations.data?.map(integration => (
                <IntegrationCard
                  key={integration.id}
                  integration={integration}
                  onToggle={id => toggleIntegration.mutate(id)}
                  loading={
                    toggleIntegration.isPending &&
                    toggleIntegration.variables === integration.id
                  }
                />
              ))}
            </div>
          )}
        </section>

        {/* Items feed */}
        <section>
          <Tabs.Root
            value={filter}
            onValueChange={v => {
              setFilter(v as Filter)
              setSelected(new Set())
            }}
          >
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <Tabs.List className="flex gap-1 p-1 rounded-lg bg-white/5 border border-[var(--color-border-subtle)]">
                {FILTER_TABS.map(tab => (
                  <Tabs.Trigger
                    key={tab.value}
                    value={tab.value}
                    className="px-3 py-1.5 text-xs font-medium rounded-md transition-all text-[var(--color-text-muted)] data-[state=active]:bg-[var(--color-bg-elevated)] data-[state=active]:text-[var(--color-text-primary)] data-[state=active]:shadow-sm"
                  >
                    {tab.label}
                    {items.data && (
                      <span className="ml-1.5 font-mono opacity-60">
                        {countByStatus(tab.value)}
                      </span>
                    )}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-muted)] pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-lg bg-white/5 border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-violet)] w-48 transition-all"
                />
              </div>
            </div>

            {FILTER_TABS.map(tab => (
              <Tabs.Content key={tab.value} value={tab.value}>
                {items.isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-[140px] rounded-xl" />
                    ))}
                  </div>
                ) : items.error ? (
                  <p className="text-sm text-red-400">Failed to load items</p>
                ) : allItems.length === 0 ? (
                  <EmptyState
                    icon={<ScanLine className="w-10 h-10" />}
                    title="No scraped items"
                    description="Run a scan to discover data that has been scraped from your connected sources."
                    action={{ label: 'Run Scan', onClick: handleRunScan }}
                  />
                ) : (
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.04 } },
                    }}
                  >
                    <AnimatePresence>
                      {allItems.map(item => (
                        <ScrapedItemCard
                          key={item.id}
                          item={item}
                          selected={selected.has(item.id)}
                          onToggleSelect={toggleSelect}
                          onApprove={handleApprove}
                          onDeny={handleDeny}
                          updatingId={updatingId}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </Tabs.Content>
            ))}
          </Tabs.Root>
        </section>
      </div>

      {/* Batch action bar */}
      <BatchActionBar
        selectedCount={selected.size}
        onApproveAll={handleBatchApprove}
        onDenyAll={handleBatchDeny}
        onDeselectAll={() => setSelected(new Set())}
        loading={batchUpdate.isPending}
      />
    </div>
  )
}
