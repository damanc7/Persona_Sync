import { useState } from 'react'
import { Plus } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { VerificationBanner } from '@/components/marketplace/VerificationBanner'
import { ListingCard } from '@/components/marketplace/ListingCard'
import { BidDrawer } from '@/components/marketplace/BidDrawer'
import { EarningsChart } from '@/components/marketplace/EarningsChart'
import { CreateListingModal } from '@/components/marketplace/CreateListingModal'
import { useVerification, useListings, useEarnings } from '@/hooks/useMarketplace'
import { useUIStore } from '@/stores/uiStore'

export function Marketplace() {
  const [createOpen, setCreateOpen] = useState(false)
  const [toast, setToast] = useState('')

  const { data: verification, isLoading: loadingVerification } = useVerification()
  const { data: listingsData, isLoading: loadingListings } = useListings()
  const { data: earnings, isLoading: loadingEarnings } = useEarnings()

  const { setSelectedListingId, setBidDrawerOpen, selectedListingId } = useUIStore()

  const activeListings = listingsData?.listings.filter(l => l.status === 'active') ?? []
  const selectedListing = listingsData?.listings.find(l => l.id === selectedListingId) ?? null

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleViewBids = (id: string) => {
    setSelectedListingId(id)
    setBidDrawerOpen(true)
  }

  const isVerified = verification?.verified ?? false

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar
        title="Marketplace"
        actions={
          <Button
            size="sm"
            onClick={() => setCreateOpen(true)}
            disabled={!isVerified}
            title={!isVerified ? 'Verify your data to create listings' : undefined}
          >
            <Plus className="h-3.5 w-3.5" />
            Create Listing
          </Button>
        }
      />

      <div className="flex-1 p-6 space-y-6">
        {/* Verification banner */}
        {loadingVerification ? (
          <Skeleton className="h-16 w-full rounded-xl" />
        ) : (
          <VerificationBanner
            verified={isVerified}
            completedAt={verification?.completedAt}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Listings grid */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                Active Listings ({activeListings.length})
              </p>
            </div>

            {loadingListings ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-44 w-full rounded-xl" />
                ))}
              </div>
            ) : activeListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed border-[var(--color-border-default)] text-center">
                <p className="text-[var(--color-text-muted)] text-sm mb-2">No active listings</p>
                <p className="text-[var(--color-text-muted)] text-xs">
                  {isVerified ? 'Create your first listing to start earning.' : 'Get verified to create listings.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeListings.map(listing => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onViewBids={handleViewBids}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Earnings panel */}
          <div className="space-y-4">
            <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              Earnings
            </p>
            <EarningsChart data={earnings} loading={loadingEarnings} />
          </div>
        </div>
      </div>

      <BidDrawer listing={selectedListing} />

      <CreateListingModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={() => showToast('Listing published successfully!')}
      />

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm shadow-xl animate-in fade-in slide-in-from-bottom-2">
          {toast}
        </div>
      )}
    </div>
  )
}
