import { http, HttpResponse } from 'msw'
import type { GraphNode, GraphLink } from '@/types'

const nodes: GraphNode[] = [
  { id: 'self', name: 'You', type: 'self', exposure: 1.0, category: 'identity' },
  { id: 'google', name: 'Google', type: 'platform', exposure: 0.85, category: 'search' },
  { id: 'linkedin', name: 'LinkedIn', type: 'platform', exposure: 0.72, category: 'professional' },
  { id: 'facebook', name: 'Facebook', type: 'platform', exposure: 0.78, category: 'social' },
  { id: 'spotify', name: 'Spotify', type: 'platform', exposure: 0.45, category: 'media' },
  { id: 'amazon', name: 'Amazon', type: 'platform', exposure: 0.68, category: 'commerce' },
  { id: 'acxiom', name: 'Acxiom', type: 'broker', exposure: 0.91, category: 'data-broker' },
  { id: 'experian', name: 'Experian', type: 'broker', exposure: 0.88, category: 'credit' },
  { id: 'lexisnexis', name: 'LexisNexis', type: 'broker', exposure: 0.79, category: 'data-broker' },
  { id: 'doubleclick', name: 'DoubleClick', type: 'broker', exposure: 0.83, category: 'advertising' },
  { id: 'partner1', name: 'RetailCo', type: 'partner', exposure: 0.35, category: 'retail' },
  { id: 'partner2', name: 'InsuranceCo', type: 'partner', exposure: 0.42, category: 'insurance' },
  { id: 'partner3', name: 'NewsletterHub', type: 'partner', exposure: 0.28, category: 'media' },
  { id: 'partner4', name: 'AdNetwork', type: 'partner', exposure: 0.61, category: 'advertising' },
  { id: 'partner5', name: 'Analytics Co', type: 'partner', exposure: 0.55, category: 'analytics' },
]

const links: GraphLink[] = [
  { source: 'self', target: 'google', strength: 0.9, type: 'direct' },
  { source: 'self', target: 'linkedin', strength: 0.75, type: 'direct' },
  { source: 'self', target: 'facebook', strength: 0.8, type: 'direct' },
  { source: 'self', target: 'spotify', strength: 0.5, type: 'direct' },
  { source: 'self', target: 'amazon', strength: 0.7, type: 'direct' },
  { source: 'google', target: 'acxiom', strength: 0.7, type: 'data-share' },
  { source: 'google', target: 'doubleclick', strength: 0.85, type: 'data-share' },
  { source: 'facebook', target: 'acxiom', strength: 0.65, type: 'data-share' },
  { source: 'facebook', target: 'partner4', strength: 0.6, type: 'advertising' },
  { source: 'linkedin', target: 'partner5', strength: 0.4, type: 'analytics' },
  { source: 'amazon', target: 'experian', strength: 0.55, type: 'data-share' },
  { source: 'amazon', target: 'partner1', strength: 0.45, type: 'partner' },
  { source: 'acxiom', target: 'lexisnexis', strength: 0.8, type: 'data-share' },
  { source: 'acxiom', target: 'partner2', strength: 0.5, type: 'sale' },
  { source: 'doubleclick', target: 'partner4', strength: 0.7, type: 'advertising' },
  { source: 'experian', target: 'partner2', strength: 0.6, type: 'partner' },
  { source: 'lexisnexis', target: 'partner3', strength: 0.35, type: 'sale' },
  { source: 'partner4', target: 'partner5', strength: 0.3, type: 'analytics' },
]

export const mapHandlers = [
  http.get('/api/graph', () =>
    HttpResponse.json({ nodes, links })
  ),
]
