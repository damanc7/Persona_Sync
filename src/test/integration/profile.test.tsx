import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { QueryClientProvider } from '@tanstack/react-query'
import { QueryClient } from '@tanstack/react-query'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { Profile } from '@/pages/Profile'

// Inline fixtures matching the real mock shape (ProfileSection[])
const mockSchema = [
  {
    id: 'basic',
    title: 'Basic Info',
    fields: [
      { id: 'name', type: 'text', label: 'Full Name', value: null, required: true },
      { id: 'email', type: 'email', label: 'Email', value: null, required: true },
    ]
  }
]

const mockProfile: Record<string, string | boolean | null> = {
  name: 'Jane Doe',
  email: 'jane@example.com',
}

const server = setupServer(
  http.get('/api/schema', () => HttpResponse.json(mockSchema)),
  http.get('/api/profile', () => HttpResponse.json(mockProfile)),
  http.post('/api/profile', () => HttpResponse.json({ success: true })),
  http.get('/api/health', () => HttpResponse.json({ status: 'healthy', latency: 10, version: '0.1.0' })),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function renderProfile() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const router = createMemoryRouter([{ path: '/profile', element: <Profile /> }], {
    initialEntries: ['/profile'],
  })
  return render(
    <QueryClientProvider client={qc}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

describe('Profile page', () => {
  it('renders profile fields after loading', async () => {
    renderProfile()
    await waitFor(() => {
      expect(screen.getAllByText('Basic Info').length).toBeGreaterThan(0)
    })
    expect(screen.getByText('Full Name')).toBeInTheDocument()
  })

  it('shows error banner on fetch failure', async () => {
    server.use(
      http.get('/api/schema', () => HttpResponse.error())
    )
    renderProfile()
    await waitFor(() => {
      expect(screen.getByText(/failed to load profile/i)).toBeInTheDocument()
    })
  })
})
