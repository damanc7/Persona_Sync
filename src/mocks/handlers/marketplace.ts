import { http, HttpResponse } from 'msw'
import type { Listing, Bid } from '@/types'

const listings: Listing[] = [
  { id: 'l1', title: 'Professional Profile Bundle', category: 'Professional', price: 150, bids: 4, topBid: 175, endsAt: '2024-04-05T00:00:00Z', status: 'active' },
  { id: 'l2', title: 'Consumer Preferences Dataset', category: 'Consumer', price: 80, bids: 2, topBid: 90, endsAt: '2024-04-03T00:00:00Z', status: 'active' },
  { id: 'l3', title: 'Location History Summary', category: 'Location', price: 120, bids: 6, topBid: 145, endsAt: '2024-04-10T00:00:00Z', status: 'active' },
  { id: 'l4', title: 'Media Consumption Patterns', category: 'Media', price: 60, bids: 1, endsAt: '2024-04-02T00:00:00Z', status: 'active' },
  { id: 'l5', title: 'Social Graph Connections', category: 'Social', price: 200, bids: 8, topBid: 240, endsAt: '2024-03-20T00:00:00Z', status: 'sold' },
  { id: 'l6', title: 'Purchase History Q4 2023', category: 'Commerce', price: 100, bids: 3, topBid: 110, endsAt: '2024-03-15T00:00:00Z', status: 'expired' },
]

const bids: Bid[] = [
  { id: 'b1', listingId: 'l1', amount: 160, bidderAlias: 'Researcher_7f3a', createdAt: '2024-03-26T10:00:00Z', status: 'pending' },
  { id: 'b2', listingId: 'l1', amount: 175, bidderAlias: 'DataCo_alpha', createdAt: '2024-03-27T08:00:00Z', status: 'pending' },
  { id: 'b3', listingId: 'l1', amount: 155, bidderAlias: 'AcademicLab_12', createdAt: '2024-03-25T14:00:00Z', status: 'rejected' },
  { id: 'b4', listingId: 'l2', amount: 85, bidderAlias: 'MarketFirm_9x', createdAt: '2024-03-26T11:00:00Z', status: 'pending' },
  { id: 'b5', listingId: 'l2', amount: 90, bidderAlias: 'InsightsCo_b2', createdAt: '2024-03-27T09:00:00Z', status: 'pending' },
  { id: 'b6', listingId: 'l3', amount: 125, bidderAlias: 'GeoAnalytics_5', createdAt: '2024-03-26T09:00:00Z', status: 'pending' },
  { id: 'b7', listingId: 'l3', amount: 130, bidderAlias: 'UrbanStudies_7', createdAt: '2024-03-26T12:00:00Z', status: 'pending' },
  { id: 'b8', listingId: 'l3', amount: 145, bidderAlias: 'LogisticsPro_2', createdAt: '2024-03-27T07:00:00Z', status: 'pending' },
]

const earningsData = {
  totalEarned: 450.00,
  pending: 175.00,
  thisMonth: 175.00,
  lastMonth: 275.00,
  history: [
    { month: 'Oct 2023', amount: 120 },
    { month: 'Nov 2023', amount: 200 },
    { month: 'Dec 2023', amount: 180 },
    { month: 'Jan 2024', amount: 95 },
    { month: 'Feb 2024', amount: 275 },
    { month: 'Mar 2024', amount: 175 },
  ],
}

const verification = {
  verified: true,
  score: 87,
  completedAt: '2024-03-01T00:00:00Z',
  checks: [
    { name: 'Identity Verified', passed: true },
    { name: 'Email Confirmed', passed: true },
    { name: 'No Duplicate Data', passed: true },
    { name: 'Data Quality Score', passed: true },
    { name: 'Privacy Compliance', passed: false },
  ],
}

export const marketplaceHandlers = [
  http.get('/api/verification', () =>
    HttpResponse.json(verification)
  ),

  http.get('/api/listings', ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const filtered = status ? listings.filter(l => l.status === status) : listings
    return HttpResponse.json({ listings: filtered, total: filtered.length })
  }),

  http.get('/api/bids', ({ request }) => {
    const url = new URL(request.url)
    const listingId = url.searchParams.get('listingId')
    const filtered = listingId ? bids.filter(b => b.listingId === listingId) : bids
    return HttpResponse.json(filtered)
  }),

  http.get('/api/earnings', () =>
    HttpResponse.json(earningsData)
  ),

  http.post('/api/bids/:id/accept', ({ params }) => {
    const bid = bids.find(b => b.id === params['id'])
    if (bid) {
      bid.status = 'accepted'
      const listing = listings.find(l => l.id === bid.listingId)
      if (listing) listing.status = 'sold'
    }
    return HttpResponse.json({ success: true })
  }),

  http.post('/api/bids/:id/reject', ({ params }) => {
    const bid = bids.find(b => b.id === params['id'])
    if (bid) bid.status = 'rejected'
    return HttpResponse.json({ success: true })
  }),

  http.post('/api/listings', async ({ request }) => {
    const body = await request.json() as Omit<Listing, 'id' | 'bids' | 'status'>
    const newListing: Listing = {
      ...body,
      id: `l${Date.now()}`,
      bids: 0,
      status: 'active',
    }
    listings.push(newListing)
    return HttpResponse.json(newListing, { status: 201 })
  }),
]
