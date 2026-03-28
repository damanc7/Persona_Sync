import { http, HttpResponse } from 'msw'
import type { GraphNode, GraphLink } from '@/types'

const nodes: GraphNode[] = [
  { id: 'self', name: 'You', type: 'self', exposure: 1.0, category: 'identity' },
  { id: 'github', name: 'GitHub', type: 'platform', exposure: 0.85, category: 'developer' },
  { id: 'linkedin', name: 'LinkedIn', type: 'platform', exposure: 0.72, category: 'professional' },
  { id: 'google', name: 'Google', type: 'platform', exposure: 0.68, category: 'personal' },
  { id: 'cursor', name: 'Cursor', type: 'platform', exposure: 0.9, category: 'developer' },
  { id: 'manual', name: 'Manual Entry', type: 'broker', exposure: 0.95, category: 'identity' },
  { id: 'npm', name: 'npm', type: 'broker', exposure: 0.6, category: 'developer' },
  { id: 'stackoverflow', name: 'Stack Overflow', type: 'broker', exposure: 0.55, category: 'developer' },
  { id: 'claude', name: 'Claude Code', type: 'partner', exposure: 0.88, category: 'ai-agent' },
  { id: 'vscode', name: 'VS Code Settings', type: 'partner', exposure: 0.5, category: 'developer' },
  { id: 'slack', name: 'Slack', type: 'partner', exposure: 0.42, category: 'communication' },
  { id: 'notion', name: 'Notion', type: 'partner', exposure: 0.35, category: 'productivity' },
  { id: 'calendar', name: 'Calendar', type: 'partner', exposure: 0.3, category: 'scheduling' },
]

const links: GraphLink[] = [
  { source: 'self', target: 'github', strength: 0.9, type: 'direct' },
  { source: 'self', target: 'linkedin', strength: 0.75, type: 'direct' },
  { source: 'self', target: 'google', strength: 0.7, type: 'direct' },
  { source: 'self', target: 'cursor', strength: 0.95, type: 'direct' },
  { source: 'self', target: 'manual', strength: 1.0, type: 'direct' },
  { source: 'manual', target: 'claude', strength: 0.9, type: 'direct' },
  { source: 'github', target: 'npm', strength: 0.65, type: 'indirect' },
  { source: 'github', target: 'stackoverflow', strength: 0.5, type: 'indirect' },
  { source: 'cursor', target: 'claude', strength: 0.85, type: 'direct' },
  { source: 'cursor', target: 'vscode', strength: 0.6, type: 'indirect' },
  { source: 'linkedin', target: 'slack', strength: 0.4, type: 'indirect' },
  { source: 'google', target: 'calendar', strength: 0.5, type: 'indirect' },
  { source: 'google', target: 'notion', strength: 0.35, type: 'indirect' },
  { source: 'claude', target: 'notion', strength: 0.3, type: 'indirect' },
]

export const mapHandlers = [
  http.get('/api/graph', () =>
    HttpResponse.json({ nodes, links })
  ),
]
