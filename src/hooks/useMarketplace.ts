import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Listing, Bid } from '@/types'

interface VerificationData {
  verified: boolean
  score: number
  completedAt: string
  checks: { name: string; passed: boolean }[]
}

interface EarningsData {
  totalEarned: number
  pending: number
  thisMonth: number
  lastMonth: number
  history: { month: string; amount: number }[]
}

interface ListingsResponse {
  listings: Listing[]
  total: number
}

export function useVerification() {
  return useQuery<VerificationData>({
    queryKey: ['verification'],
    queryFn: () => fetch('/api/verification').then(r => r.json()),
  })
}

export function useListings() {
  return useQuery<ListingsResponse>({
    queryKey: ['listings'],
    queryFn: () => fetch('/api/listings').then(r => r.json()),
    refetchInterval: 30_000,
  })
}

export function useBids(listingId: string | null) {
  return useQuery<Bid[]>({
    queryKey: ['bids', listingId],
    queryFn: () =>
      fetch(`/api/bids?listingId=${listingId}`).then(r => r.json()),
    enabled: !!listingId,
  })
}

export function useEarnings() {
  return useQuery<EarningsData>({
    queryKey: ['earnings'],
    queryFn: () => fetch('/api/earnings').then(r => r.json()),
  })
}

export function useAcceptBid() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (bidId: string) =>
      fetch(`/api/bids/${bidId}/accept`, { method: 'POST' }).then(r => r.json()),
    onMutate: async (bidId: string) => {
      await queryClient.cancelQueries({ queryKey: ['bids'] })
      const previousBids = queryClient.getQueriesData<Bid[]>({ queryKey: ['bids'] })
      queryClient.setQueriesData<Bid[]>({ queryKey: ['bids'] }, (old) =>
        old?.map(b => b.id === bidId ? { ...b, status: 'accepted' as const } : b)
      )
      return { previousBids }
    },
    onError: (_err, _bidId, context) => {
      if (context?.previousBids) {
        context.previousBids.forEach(([key, data]) => {
          queryClient.setQueryData(key, data)
        })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['bids'] })
      queryClient.invalidateQueries({ queryKey: ['listings'] })
    },
  })
}

export function useRejectBid() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (bidId: string) =>
      fetch(`/api/bids/${bidId}/reject`, { method: 'POST' }).then(r => r.json()),
    onMutate: async (bidId: string) => {
      await queryClient.cancelQueries({ queryKey: ['bids'] })
      const previousBids = queryClient.getQueriesData<Bid[]>({ queryKey: ['bids'] })
      queryClient.setQueriesData<Bid[]>({ queryKey: ['bids'] }, (old) =>
        old?.map(b => b.id === bidId ? { ...b, status: 'rejected' as const } : b)
      )
      return { previousBids }
    },
    onError: (_err, _bidId, context) => {
      if (context?.previousBids) {
        context.previousBids.forEach(([key, data]) => {
          queryClient.setQueryData(key, data)
        })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['bids'] })
    },
  })
}

export function useCreateListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Listing, 'id' | 'bids' | 'status'>) =>
      fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(async r => {
        if (!r.ok) throw new Error('Failed to create listing')
        return r.json() as Promise<Listing>
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] })
    },
  })
}
