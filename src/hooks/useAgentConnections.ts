import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface AgentConnection {
  id: string
  name: string
  provider: string
  connected: boolean
  lastConnected?: string
  toolsUsed?: number
  color: 'amber' | 'emerald' | 'blue' | 'cyan' | 'violet' | 'rose'
  description: string
}

export interface AgentConnectionsData {
  agents: AgentConnection[]
  mcpUrl: string
}

export function useAgentConnections() {
  return useQuery<AgentConnectionsData>({
    queryKey: ['agent-connections'],
    queryFn: () => fetch('/api/agent-connections').then(r => r.json()),
  })
}

export function useToggleAgentConnection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (agentId: string) =>
      fetch(`/api/agent-connections/${agentId}/toggle`, { method: 'POST' }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-connections'] })
    },
  })
}
