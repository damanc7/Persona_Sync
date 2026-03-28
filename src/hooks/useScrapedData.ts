import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import type { Integration, ScrapedItem } from '@/types'

// ---- Query keys ----
export const scrapedKeys = {
  integrations: ['integrations'] as const,
  items: (filter: string, search: string) => ['scraped-items', filter, search] as const,
  scanStatus: (jobId: string | null) => ['scan-status', jobId] as const,
}

// ---- API helpers ----
async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json() as Promise<T>
}

// ---- Hooks ----

export function useIntegrations() {
  return useQuery<Integration[]>({
    queryKey: scrapedKeys.integrations,
    queryFn: () => fetchJSON<Integration[]>('/api/integrations'),
  })
}

export function useToggleIntegration() {
  const qc = useQueryClient()
  return useMutation<Integration, Error, string>({
    mutationFn: (id) =>
      fetchJSON<Integration>(`/api/integrations/${id}/toggle`, { method: 'POST' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: scrapedKeys.integrations })
    },
    onError: () => {
      toast.error('Failed to toggle integration')
    },
  })
}

export function useScrapedItems(filter: 'all' | 'pending' | 'approved' | 'denied', search: string) {
  return useQuery<{ items: ScrapedItem[]; total: number }>({
    queryKey: scrapedKeys.items(filter, search),
    queryFn: () => {
      const params = new URLSearchParams({ status: filter })
      if (search) params.set('search', search)
      return fetchJSON<{ items: ScrapedItem[]; total: number }>(`/api/scraped-items?${params}`)
    },
  })
}

interface ScanRunResponse { jobId: string; status: string }

export function useRunScan() {
  return useMutation<ScanRunResponse, Error>({
    mutationFn: () => fetchJSON<ScanRunResponse>('/api/scrape/run', { method: 'POST' }),
    onError: () => {
      toast.error('Failed to start scan')
    },
  })
}

interface ScanStatusResponse {
  jobId: string
  progress: number
  status: 'running' | 'complete'
  message: string
}

export function useScanStatus(jobId: string | null) {
  const qc = useQueryClient()
  const query = useQuery<ScanStatusResponse>({
    queryKey: scrapedKeys.scanStatus(jobId),
    queryFn: () => fetchJSON<ScanStatusResponse>(`/api/scrape/status/${jobId}`),
    enabled: !!jobId,
    refetchInterval: (q) => {
      const data = q.state.data as ScanStatusResponse | undefined
      if (!data || data.status === 'complete') return false
      return 2000
    },
  })

  // Fire side effects when scan transitions to complete
  const prevStatus = useRef<string | undefined>(undefined)
  useEffect(() => {
    if (query.data?.status === 'complete' && prevStatus.current !== 'complete') {
      qc.invalidateQueries({ queryKey: ['scraped-items'] })
      toast.success('Scan complete!')
    }
    prevStatus.current = query.data?.status
  }, [query.data?.status, qc])

  return query
}

export function useUpdateItem() {
  const qc = useQueryClient()
  return useMutation<
    ScrapedItem,
    Error,
    { id: string; status: 'approved' | 'denied' },
    { previousData: Map<string, { items: ScrapedItem[]; total: number }> }
  >({
    mutationFn: ({ id, status }) =>
      fetchJSON<ScrapedItem>(`/api/scraped-items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      }),
    onMutate: async ({ id, status }) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await qc.cancelQueries({ queryKey: ['scraped-items'] })

      // Snapshot all scraped-items cache entries
      const previousData = new Map<string, { items: ScrapedItem[]; total: number }>()
      const queries = qc.getQueriesData<{ items: ScrapedItem[]; total: number }>({ queryKey: ['scraped-items'] })
      for (const [key, data] of queries) {
        if (data) {
          previousData.set(JSON.stringify(key), data)
          qc.setQueryData(key, {
            ...data,
            items: data.items.map(item => item.id === id ? { ...item, status } : item),
          })
        }
      }
      return { previousData }
    },
    onError: (_err, _vars, context) => {
      // Rollback
      if (context?.previousData) {
        for (const [keyStr, data] of context.previousData) {
          qc.setQueryData(JSON.parse(keyStr) as unknown[], data)
        }
      }
      toast.error('Failed to update item')
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['scraped-items'] })
    },
  })
}

interface BatchUpdateVars { ids: string[]; status: 'approved' | 'denied' }
interface BatchUpdateResult { updated: ScrapedItem[]; count: number }

export function useBatchUpdate() {
  const qc = useQueryClient()
  return useMutation<
    BatchUpdateResult,
    Error,
    BatchUpdateVars,
    { previousData: Map<string, { items: ScrapedItem[]; total: number }> }
  >({
    mutationFn: ({ ids, status }) =>
      fetchJSON<BatchUpdateResult>('/api/scraped-items/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, status }),
      }),
    onMutate: async ({ ids, status }) => {
      await qc.cancelQueries({ queryKey: ['scraped-items'] })
      const previousData = new Map<string, { items: ScrapedItem[]; total: number }>()
      const idSet = new Set(ids)
      const queries = qc.getQueriesData<{ items: ScrapedItem[]; total: number }>({ queryKey: ['scraped-items'] })
      for (const [key, data] of queries) {
        if (data) {
          previousData.set(JSON.stringify(key), data)
          qc.setQueryData(key, {
            ...data,
            items: data.items.map(item => idSet.has(item.id) ? { ...item, status } : item),
          })
        }
      }
      return { previousData }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        for (const [keyStr, data] of context.previousData) {
          qc.setQueryData(JSON.parse(keyStr) as unknown[], data)
        }
      }
      toast.error('Batch update failed')
    },
    onSuccess: (_data, { status }) => {
      toast.success(`Items ${status === 'approved' ? 'approved' : 'denied'}`)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['scraped-items'] })
    },
  })
}
