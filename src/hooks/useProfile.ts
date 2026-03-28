import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ProfileSection } from '@/types'

export function useProfileSchema() {
  return useQuery<ProfileSection[]>({
    queryKey: ['profile-schema'],
    queryFn: () => fetch('/api/schema').then(r => r.json()),
    staleTime: Infinity,
  })
}

export function useProfile() {
  return useQuery<Record<string, string | boolean | null>>({
    queryKey: ['profile'],
    queryFn: () => fetch('/api/profile').then(r => r.json()),
  })
}

export function useSaveProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, string | boolean | null>) =>
      fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
