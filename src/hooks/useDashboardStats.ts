import { useQuery } from '@tanstack/react-query'
import type { DashboardStats } from '@/types'

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => fetch('/api/dashboard/stats').then(r => r.json()),
    refetchInterval: 60_000,
  })
}
