import { useEffect, useState } from 'react'
import { Timer, TrendingUp, Gavel } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Listing } from '@/types'

interface ListingCardProps {
  listing: Listing
  onViewBids: (id: string) => void
}

function useCountdown(endsAt: string) {
  const [remaining, setRemaining] = useState('')

  useEffect(() => {
    const calc = () => {
      const diff = new Date(endsAt).getTime() - Date.now()
      if (diff <= 0) {
        setRemaining('Ended')
        return
      }
      const d = Math.floor(diff / 86_400_000)
      const h = Math.floor((diff % 86_400_000) / 3_600_000)
      const m = Math.floor((diff % 3_600_000) / 60_000)
      const s = Math.floor((diff % 60_000) / 1_000)
      if (d > 0) setRemaining(`${d}d ${h}h`)
      else if (h > 0) setRemaining(`${h}h ${m}m`)
      else setRemaining(`${m}m ${s}s`)
    }
    calc()
    const id = setInterval(calc, 1_000)
    return () => clearInterval(id)
  }, [endsAt])

  return remaining
}

const categoryColors: Record<string, string> = {
  Professional: 'violet',
  Consumer: 'cyan',
  Location: 'warning',
  Media: 'default',
  Social: 'success',
  Commerce: 'error',
}

export function ListingCard({ listing, onViewBids }: ListingCardProps) {
  const countdown = useCountdown(listing.endsAt)

  return (
    <Card variant="elevated" className="p-4 flex flex-col gap-3 hover:border-[var(--color-border-default)] transition-colors">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-[var(--color-text-primary)] leading-snug flex-1">{listing.title}</p>
        <Badge variant={(categoryColors[listing.category] ?? 'default') as Parameters<typeof Badge>[0]['variant']}>
          {listing.category}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-0.5">Asking Price</p>
          <p className="text-base font-bold font-mono text-[var(--color-text-primary)]">
            ${listing.price.toFixed(2)}
          </p>
        </div>
        {listing.topBid !== undefined && (
          <div>
            <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-0.5 flex items-center gap-1">
              <TrendingUp className="h-2.5 w-2.5" />
              Top Bid
            </p>
            <p className="text-base font-bold font-mono text-emerald-400">
              ${listing.topBid.toFixed(2)}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
        <div className="flex items-center gap-1">
          <Gavel className="h-3 w-3" />
          <span>{listing.bids} {listing.bids === 1 ? 'bid' : 'bids'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Timer className="h-3 w-3" />
          <span className={countdown === 'Ended' ? 'text-red-400' : ''}>{countdown}</span>
        </div>
      </div>

      <Button
        variant="secondary"
        size="sm"
        className="w-full mt-1"
        onClick={() => onViewBids(listing.id)}
      >
        View Bids
      </Button>
    </Card>
  )
}
