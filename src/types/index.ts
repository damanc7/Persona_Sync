export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'down'
  latency: number
  version: string
}

export interface ProfileField {
  id: string
  type: 'text' | 'email' | 'phone' | 'date' | 'textarea' | 'select' | 'boolean' | 'sensitive'
  label: string
  value: string | boolean | null
  required?: boolean
  options?: string[]
}

export interface ProfileSection {
  id: string
  title: string
  fields: ProfileField[]
}

export interface ScrapedItem {
  id: string
  source: string
  field: string
  value: string
  confidence: number
  status: 'pending' | 'approved' | 'denied'
  scrapedAt: string
}

export interface Integration {
  id: string
  name: string
  icon: string
  connected: boolean
  lastScan?: string
  itemCount?: number
}

export interface GraphNode {
  id: string
  name: string
  type: 'self' | 'platform' | 'broker' | 'partner'
  exposure: number
  category: string
}

export interface GraphLink {
  source: string
  target: string
  strength: number
  type: string
}

export interface Collaborator {
  id: string
  name: string
  email: string
  role: 'owner' | 'editor' | 'viewer'
  avatarUrl?: string
  status: 'active' | 'invited'
}

export interface Message {
  id: string
  authorId: string
  authorType: 'user' | 'collaborator' | 'llm'
  content: string
  timestamp: string
  topic?: string
}

export interface Listing {
  id: string
  title: string
  category: string
  price: number
  bids: number
  topBid?: number
  endsAt: string
  status: 'active' | 'sold' | 'expired'
}

export interface Bid {
  id: string
  listingId: string
  amount: number
  bidderAlias: string
  createdAt: string
  status: 'pending' | 'accepted' | 'rejected'
}

export interface ActivityItem {
  id: string
  type: 'scrape_complete' | 'bid_received' | 'approval_needed' | 'profile_updated'
  message: string
  timestamp: string
  metadata: Record<string, unknown>
}

export interface DataSource {
  name: string
  itemCount: number
  riskLevel: 'low' | 'medium' | 'high'
}

export interface DashboardStats {
  exposureScore: number
  profileCompletion: number
  dataPoints: number
  pendingApprovals: number
  activeBids: number
  recentActivity: ActivityItem[]
  topSources: DataSource[]
}
