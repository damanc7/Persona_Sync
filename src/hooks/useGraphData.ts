import { useQuery } from '@tanstack/react-query'
import type { GraphNode, GraphLink } from '@/types'

interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
}

export function useGraphData() {
  return useQuery<GraphData>({
    queryKey: ['graph'],
    queryFn: () => fetch('/api/graph').then(r => r.json()),
  })
}
