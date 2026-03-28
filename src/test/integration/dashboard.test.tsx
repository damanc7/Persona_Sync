import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { QueryClientProvider } from '@tanstack/react-query'
import { QueryClient } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { Dashboard } from '@/pages/Dashboard'

const server = setupServer(
  http.get('/api/dashboard/stats', () => HttpResponse.json({
    exposureScore: 67,
    profileCompletion: 78,
    dataPoints: 142,
    pendingApprovals: 8,
    activeBids: 3,
    recentActivity: [],
    topSources: [],
  })),
  http.get('/api/health', () => HttpResponse.json({ status: 'healthy', latency: 10, version: '0.1.0' })),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function renderDashboard() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('Dashboard page', () => {
  it('renders metric cards after loading', async () => {
    renderDashboard()
    await waitFor(() => {
      expect(screen.getByText(/profile sections filled/i)).toBeInTheDocument()
    })
  })

  it('renders the profile completeness section', async () => {
    renderDashboard()
    await waitFor(() => {
      expect(screen.getByText(/profile completeness score/i)).toBeInTheDocument()
    })
  })
})
