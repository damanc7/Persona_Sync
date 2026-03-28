import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { PerceptionsResponse, AIExportFormatId } from '@/types'

export const perceptionKeys = {
  all: ['perceptions'] as const,
  export: (format: AIExportFormatId) => ['export', format] as const,
}

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json() as Promise<T>
}

export function usePerceptions() {
  return useQuery<PerceptionsResponse>({
    queryKey: perceptionKeys.all,
    queryFn: () => fetchJSON<PerceptionsResponse>('/api/perceptions'),
    staleTime: 5 * 60 * 1000,
  })
}

interface VoteVars {
  platformId: string
  vote: 'agree' | 'disagree' | null
}

export function useVoteOnPerception() {
  const qc = useQueryClient()
  return useMutation<{ platformId: string; vote: string | null }, Error, VoteVars, { previous: PerceptionsResponse | undefined }>({
    mutationFn: ({ platformId, vote }) =>
      fetchJSON(`/api/perceptions/${platformId}/vote`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote }),
      }),
    onMutate: async ({ platformId, vote }) => {
      await qc.cancelQueries({ queryKey: perceptionKeys.all })
      const previous = qc.getQueryData<PerceptionsResponse>(perceptionKeys.all)
      if (previous) {
        qc.setQueryData<PerceptionsResponse>(perceptionKeys.all, {
          ...previous,
          perceptions: previous.perceptions.map(p =>
            p.platformId === platformId ? { ...p, userAccuracyVote: vote } : p
          ),
        })
      }
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        qc.setQueryData(perceptionKeys.all, context.previous)
      }
      toast.error('Failed to save your vote')
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: perceptionKeys.all })
    },
  })
}

interface ExportResponse {
  generatedAt: string
  version: string
  format: string
  content: string
}

export function useExportPersona(format: AIExportFormatId | null) {
  return useQuery<ExportResponse>({
    queryKey: perceptionKeys.export(format as AIExportFormatId),
    queryFn: () => fetchJSON<ExportResponse>(`/api/export/${format}`),
    enabled: !!format,
    staleTime: Infinity,
  })
}
