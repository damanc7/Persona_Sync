import { http, HttpResponse } from 'msw'

export const dashboardHandlers = [
  http.get('/api/dashboard/stats', () =>
    HttpResponse.json({
      exposureScore: 72,
      profileCompletion: 78,
      dataPoints: 142,
      pendingApprovals: 5,
      activeBids: 4,
      recentActivity: [
        { id: '1', type: 'scrape_complete', message: 'LinkedIn profile imported', timestamp: '2026-03-28T10:00:00Z', metadata: { itemCount: 23 } },
        { id: '2', type: 'profile_updated', message: 'Developer preferences updated', timestamp: '2026-03-28T09:30:00Z', metadata: {} },
        { id: '3', type: 'approval_needed', message: '5 imported fields need your review', timestamp: '2026-03-28T09:00:00Z', metadata: {} },
        { id: '4', type: 'profile_updated', message: 'Profile completeness improved to 78%', timestamp: '2026-03-27T18:00:00Z', metadata: {} },
      ],
      topSources: [
        { name: 'Manual Entry', itemCount: 58, riskLevel: 'low' },
        { name: 'LinkedIn', itemCount: 34, riskLevel: 'low' },
        { name: 'GitHub', itemCount: 28, riskLevel: 'low' },
        { name: 'Google', itemCount: 22, riskLevel: 'medium' },
      ],
    })
  ),
]
