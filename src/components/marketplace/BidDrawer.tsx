import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useBids, useAcceptBid, useRejectBid } from '@/hooks/useMarketplace'
import { useUIStore } from '@/stores/uiStore'
import type { Listing } from '@/types'

interface BidDrawerProps {
  listing: Listing | null
}

const statusVariant = {
  pending: 'warning' as const,
  accepted: 'success' as const,
  rejected: 'error' as const,
}

export function BidDrawer({ listing }: BidDrawerProps) {
  const { isBidDrawerOpen, setBidDrawerOpen } = useUIStore()
  const { data: bids = [], isLoading } = useBids(listing?.id ?? null)
  const acceptBid = useAcceptBid()
  const rejectBid = useRejectBid()

  return (
    <AnimatePresence>
      {isBidDrawerOpen && listing && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setBidDrawerOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm z-50 bg-[var(--color-bg-elevated)] border-l border-[var(--color-border-default)] flex flex-col shadow-2xl shadow-black/50"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-[var(--color-border-subtle)]">
              <div className="flex-1 min-w-0 pr-4">
                <p className="text-xs text-[var(--color-text-muted)] mb-1">Bids for</p>
                <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">{listing.title}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-[var(--color-text-muted)]">
                    Ask: <span className="font-mono text-[var(--color-text-secondary)]">${listing.price}</span>
                  </span>
                  {listing.topBid !== undefined && (
                    <span className="text-xs text-[var(--color-text-muted)]">
                      Top: <span className="font-mono text-emerald-400">${listing.topBid}</span>
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setBidDrawerOpen(false)}
                className="rounded-lg p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Bids list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))
              ) : bids.length === 0 ? (
                <div className="text-center py-12 text-[var(--color-text-muted)] text-sm">
                  No bids yet
                </div>
              ) : (
                bids.map(bid => (
                  <div
                    key={bid.id}
                    className="p-3.5 rounded-xl bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono text-[var(--color-text-secondary)]">{bid.bidderAlias}</span>
                      <Badge variant={statusVariant[bid.status]}>{bid.status}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold font-mono text-[var(--color-text-primary)]">
                        ${bid.amount.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-[var(--color-text-muted)]">
                        {new Date(bid.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {bid.status === 'pending' && (
                      <div className="flex gap-2 pt-1">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => acceptBid.mutate(bid.id)}
                          loading={acceptBid.isPending && acceptBid.variables === bid.id}
                        >
                          <Check className="h-3 w-3" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          className="flex-1"
                          onClick={() => rejectBid.mutate(bid.id)}
                          loading={rejectBid.isPending && rejectBid.variables === bid.id}
                        >
                          <XCircle className="h-3 w-3" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
