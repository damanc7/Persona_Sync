import { http, HttpResponse } from 'msw'

export const dashboardHandlers = [
  http.get('/api/dashboard/stats', () =>
    HttpResponse.json({
      exposureScore: 67,
      profileCompletion: 78,
      dataPoints: 142,
      pendingApprovals: 8,
      activeBids: 3,
      recentActivity: [
        { id: '1', type: 'scrape_complete', message: 'LinkedIn scan completed', timestamp: '2026-03-28T10:00:00Z', metadata: { itemCount: 23 } },
        { id: '2', type: 'bid_received', message: 'New bid on Professional Profile', timestamp: '2026-03-28T09:30:00Z', metadata: { amount: 45 } },
        { id: '3', type: 'approval_needed', message: '8 items awaiting your review', timestamp: '2026-03-28T09:00:00Z', metadata: {} },
        { id: '4', type: 'profile_updated', message: 'Profile completion improved to 78%', timestamp: '2026-03-27T18:00:00Z', metadata: {} },
      ],
      topSources: [
        { name: 'LinkedIn', itemCount: 58, riskLevel: 'medium' },
        { name: 'Twitter/X', itemCount: 34, riskLevel: 'low' },
        { name: 'Google', itemCount: 28, riskLevel: 'high' },
        { name: 'Facebook', itemCount: 22, riskLevel: 'medium' },
      ],
    })
  ),
]
