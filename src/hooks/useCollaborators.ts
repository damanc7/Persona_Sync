import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Collaborator, Message } from '@/types'

export function useCollaborators() {
  return useQuery<Collaborator[]>({
    queryKey: ['collaborators'],
    queryFn: () => fetch('/api/collaborators').then(r => r.json()),
  })
}

export function useMessages(topic?: string) {
  return useQuery<Message[]>({
    queryKey: ['messages', topic],
    queryFn: () => {
      const url = topic ? `/api/messages?topic=${topic}` : '/api/messages'
      return fetch(url).then(r => r.json())
    },
  })
}

export function useInviteCollaborator() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { email: string; role: string }) =>
      fetch('/api/collaborators/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(async r => {
        if (!r.ok) throw new Error('Failed to invite collaborator')
        return r.json() as Promise<Collaborator>
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborators'] })
    },
  })
}
