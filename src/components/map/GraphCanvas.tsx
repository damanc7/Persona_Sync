import { useRef, useEffect, useCallback, useMemo, useState, type MutableRefObject } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import type { GraphNode, GraphLink } from '@/types'
import { NodeTooltip } from './NodeTooltip'

interface GraphCanvasProps {
  nodes: GraphNode[]
  links: GraphLink[]
  filters: string[]
  graphRef?: MutableRefObject<any>
}

type NodeType = GraphNode['type']

const NODE_COLORS: Record<NodeType, string> = {
  self: '#7c3aed',
  platform: '#06b6d4',
  broker: '#8b5cf6',
  partner: '#10b981',
}

function nodeSizeFromExposure(exposure: number): number {
  return 3 + exposure * 8
}

function isDarkMode(): boolean {
  return document.documentElement.classList.contains('dark')
}

function linkColorFromType(type: string): string {
  const dark = isDarkMode()
  switch (type) {
    case 'direct': return dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.25)'
    case 'indirect': return dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.12)'
    default: return dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'
  }
}

interface TooltipState {
  node: GraphNode
  x: number
  y: number
  connectedCount: number
}

export function GraphCanvas({ nodes, links, filters, graphRef: externalRef }: GraphCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const internalRef = useRef<any>(null)
  const graphRef = externalRef ?? internalRef
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(new Set())
  const physicsStoppedRef = useRef(false)

  // Measure container
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const ro = new ResizeObserver(entries => {
      const entry = entries[0]
      if (entry) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        })
      }
    })
    ro.observe(container)
    setDimensions({ width: container.clientWidth, height: container.clientHeight })
    return () => ro.disconnect()
  }, [])

  // Filter nodes/links by active category filters
  const filteredNodes = useMemo(() => {
    if (filters.length === 0) return nodes
    return nodes.filter(n => n.type === 'self' || filters.includes(n.category))
  }, [nodes, filters])

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes])

  const filteredLinks = useMemo(() => {
    return links.filter(l => {
      const srcId = typeof l.source === 'object' ? (l.source as any).id : l.source
      const tgtId = typeof l.target === 'object' ? (l.target as any).id : l.target
      return filteredNodeIds.has(srcId) && filteredNodeIds.has(tgtId)
    })
  }, [links, filteredNodeIds])

  // Connection count map
  const connectionCounts = useMemo(() => {
    const counts = new Map<string, number>()
    links.forEach(l => {
      const src = typeof l.source === 'object' ? (l.source as any).id : l.source
      const tgt = typeof l.target === 'object' ? (l.target as any).id : l.target
      counts.set(src, (counts.get(src) ?? 0) + 1)
      counts.set(tgt, (counts.get(tgt) ?? 0) + 1)
    })
    return counts
  }, [links])

  // Connected node ids for a given node
  const getConnectedIds = useCallback((nodeId: string) => {
    const ids = new Set<string>([nodeId])
    links.forEach(l => {
      const src = typeof l.source === 'object' ? (l.source as any).id : l.source
      const tgt = typeof l.target === 'object' ? (l.target as any).id : l.target
      if (src === nodeId) ids.add(tgt)
      if (tgt === nodeId) ids.add(src)
    })
    return ids
  }, [links])

  // Graph data with self node pinned
  const graphData = useMemo(() => {
    const nodesWithFix = filteredNodes.map(n => ({
      ...n,
      fx: n.type === 'self' ? 0 : undefined,
      fy: n.type === 'self' ? 0 : undefined,
    }))
    return { nodes: nodesWithFix, links: filteredLinks }
  }, [filteredNodes, filteredLinks])

  const handleEngineStop = useCallback(() => {
    if (!physicsStoppedRef.current && graphRef.current) {
      physicsStoppedRef.current = true
      graphRef.current.zoomToFit(400, 40)
    }
  }, [])

  const handleNodeHover = useCallback((node: any, _prevNode: any) => {
    if (!node) {
      setTooltip(null)
      return
    }
    // Tooltip position is updated on mouse move; store the node here only
    setTooltip(prev => ({
      node: node as GraphNode,
      x: prev?.x ?? 0,
      y: prev?.y ?? 0,
      connectedCount: (connectionCounts.get(node.id) ?? 0),
    }))
  }, [connectionCounts])

  const handleNodeClick = useCallback((node: any) => {
    const ids = getConnectedIds(node.id as string)
    setHighlightedIds(prev => {
      // If already highlighting this node, clear
      if (prev.size > 0 && prev.has(node.id as string)) return new Set()
      return ids
    })
  }, [getConnectedIds])

  // Track mouse position for tooltip
  const tooltipActiveRef = useRef(false)
  tooltipActiveRef.current = tooltip !== null

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const onMove = (e: MouseEvent) => {
      if (tooltipActiveRef.current) {
        setTooltip(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null)
      }
    }
    container.addEventListener('mousemove', onMove)
    return () => container.removeEventListener('mousemove', onMove)
  }, [])

  const nodeColor = useCallback((node: any) => {
    const n = node as GraphNode
    const base = NODE_COLORS[n.type] ?? '#888888'
    if (highlightedIds.size === 0) return base
    return highlightedIds.has(n.id) ? base : `${base}33`
  }, [highlightedIds])

  const nodeVal = useCallback((node: any) => {
    return nodeSizeFromExposure((node as GraphNode).exposure)
  }, [])

  const linkColor = useCallback((link: any) => {
    return linkColorFromType(link.type as string)
  }, [])

  const linkWidth = useCallback((link: any) => {
    return (link.strength as number) * 2
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden" style={{ background: 'var(--color-graph-bg)' }}>
      <ForceGraph2D
        ref={graphRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        backgroundColor="rgba(0,0,0,0)"
        nodeColor={nodeColor}
        nodeVal={nodeVal}
        nodeRelSize={4}
        nodeLabel={() => ''}
        linkColor={linkColor}
        linkWidth={linkWidth}
        onNodeHover={handleNodeHover}
        onNodeClick={handleNodeClick}
        onEngineStop={handleEngineStop}
        enableNodeDrag={true}
        cooldownTime={2000}
      />
      {tooltip && (
        <NodeTooltip
          node={tooltip.node}
          x={tooltip.x}
          y={tooltip.y}
          connectedCount={tooltip.connectedCount}
        />
      )}
    </div>
  )
}
