import { useQuery } from '@tanstack/react-query'
import type { HealthStatus } from '@/types'

export function useHealth() {
  return useQuery<HealthStatus>({
    queryKey: ['health'],
    queryFn: () => fetch('/api/health').then(r => r.json()),
    refetchInterval: 30_000,
  })
}
