import { http, HttpResponse } from 'msw'
import type { Integration, ScrapedItem } from '@/types'

const integrations: Integration[] = [
  { id: 'google', name: 'Google', icon: 'google', connected: true, lastScan: '2024-03-27T10:00:00Z', itemCount: 42 },
  { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin', connected: true, lastScan: '2024-03-26T14:30:00Z', itemCount: 18 },
  { id: 'twitter', name: 'Twitter / X', icon: 'twitter', connected: false },
  { id: 'facebook', name: 'Facebook', icon: 'facebook', connected: true, lastScan: '2024-03-25T09:15:00Z', itemCount: 67 },
  { id: 'amazon', name: 'Amazon', icon: 'amazon', connected: false },
  { id: 'spotify', name: 'Spotify', icon: 'spotify', connected: true, lastScan: '2024-03-27T08:00:00Z', itemCount: 12 },
]

const scrapedItems: ScrapedItem[] = [
  { id: 's1', source: 'Google', field: 'Email', value: 'alex.chen@gmail.com', confidence: 0.99, status: 'approved', scrapedAt: '2024-03-27T10:00:00Z' },
  { id: 's2', source: 'Google', field: 'Phone', value: '+1 (555) 234-5678', confidence: 0.87, status: 'approved', scrapedAt: '2024-03-27T10:01:00Z' },
  { id: 's3', source: 'Google', field: 'Location', value: 'San Francisco, CA', confidence: 0.92, status: 'approved', scrapedAt: '2024-03-27T10:02:00Z' },
  { id: 's4', source: 'LinkedIn', field: 'Job Title', value: 'Senior Software Engineer', confidence: 0.98, status: 'approved', scrapedAt: '2024-03-26T14:30:00Z' },
  { id: 's5', source: 'LinkedIn', field: 'Company', value: 'TechCorp Inc.', confidence: 0.98, status: 'approved', scrapedAt: '2024-03-26T14:31:00Z' },
  { id: 's6', source: 'LinkedIn', field: 'Skills', value: 'TypeScript, React, Node.js', confidence: 0.95, status: 'pending', scrapedAt: '2024-03-26T14:32:00Z' },
  { id: 's7', source: 'Facebook', field: 'Date of Birth', value: '1990-06-15', confidence: 0.89, status: 'pending', scrapedAt: '2024-03-25T09:15:00Z' },
  { id: 's8', source: 'Facebook', field: 'Relationship Status', value: 'Single', confidence: 0.72, status: 'denied', scrapedAt: '2024-03-25T09:16:00Z' },
  { id: 's9', source: 'Facebook', field: 'Hometown', value: 'Seattle, WA', confidence: 0.81, status: 'pending', scrapedAt: '2024-03-25T09:17:00Z' },
  { id: 's10', source: 'Spotify', field: 'Music Preferences', value: 'Indie, Electronic, Jazz', confidence: 0.94, status: 'pending', scrapedAt: '2024-03-27T08:00:00Z' },
  { id: 's11', source: 'Google', field: 'Search History Summary', value: 'Technology, Finance, Travel', confidence: 0.76, status: 'denied', scrapedAt: '2024-03-27T10:03:00Z' },
  { id: 's12', source: 'LinkedIn', field: 'Education', value: 'BS Computer Science, Stanford University', confidence: 0.97, status: 'approved', scrapedAt: '2024-03-26T14:33:00Z' },
]

// Track scan jobs: jobId -> { progress, startedAt }
const scanJobs = new Map<string, { progress: number; complete: boolean }>()

export const scrapedHandlers = [
  // GET /api/integrations
  http.get('/api/integrations', () => HttpResponse.json(integrations)),

  // POST /api/integrations/:id/toggle
  http.post('/api/integrations/:id/toggle', ({ params }) => {
    const integration = integrations.find(i => i.id === params['id'])
    if (!integration) return HttpResponse.json({ error: 'Not found' }, { status: 404 })
    integration.connected = !integration.connected
    if (integration.connected) {
      integration.lastScan = new Date().toISOString()
      integration.itemCount = Math.floor(Math.random() * 50) + 5
    } else {
      delete integration.lastScan
      delete integration.itemCount
    }
    return HttpResponse.json(integration)
  }),

  // GET /api/scraped-items?status=all|pending|approved|denied
  http.get('/api/scraped-items', ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const search = url.searchParams.get('search') ?? ''
    let items = [...scrapedItems]
    if (status && status !== 'all') {
      items = items.filter(i => i.status === status)
    }
    if (search) {
      const lower = search.toLowerCase()
      items = items.filter(
        i => i.field.toLowerCase().includes(lower) || i.value.toLowerCase().includes(lower) || i.source.toLowerCase().includes(lower)
      )
    }
    return HttpResponse.json({ items, total: items.length })
  }),

  // POST /api/scrape/run
  http.post('/api/scrape/run', () => {
    const jobId = `job_${Date.now()}`
    scanJobs.set(jobId, { progress: 0, complete: false })
    return HttpResponse.json({ jobId, status: 'running' })
  }),

  // GET /api/scrape/status/:jobId — increments progress ~33% per poll, completes after 3
  http.get('/api/scrape/status/:jobId', ({ params }) => {
    const jobId = params['jobId'] as string
    const job = scanJobs.get(jobId)
    if (!job) return HttpResponse.json({ error: 'Job not found' }, { status: 404 })

    if (!job.complete) {
      job.progress = Math.min(job.progress + 34, 100)
      if (job.progress >= 100) {
        job.complete = true
      }
    }

    return HttpResponse.json({
      jobId,
      progress: job.progress,
      status: job.complete ? 'complete' : 'running',
      message: job.complete
        ? 'Scan complete'
        : job.progress < 40
        ? 'Scanning Google...'
        : job.progress < 70
        ? 'Scanning LinkedIn...'
        : 'Scanning remaining sources...',
    })
  }),

  // PATCH /api/scraped-items/:id
  http.patch('/api/scraped-items/:id', async ({ params, request }) => {
    const id = params['id'] as string
    const body = await request.json() as { status: 'approved' | 'denied' }
    const item = scrapedItems.find(i => i.id === id)
    if (!item) return HttpResponse.json({ error: 'Not found' }, { status: 404 })
    item.status = body.status
    return HttpResponse.json(item)
  }),

  // POST /api/scraped-items/batch
  http.post('/api/scraped-items/batch', async ({ request }) => {
    const body = await request.json() as { ids: string[]; status: 'approved' | 'denied' }
    const updated: ScrapedItem[] = []
    for (const id of body.ids) {
      const item = scrapedItems.find(i => i.id === id)
      if (item) {
        item.status = body.status
        updated.push(item)
      }
    }
    return HttpResponse.json({ updated, count: updated.length })
  }),

  // Legacy endpoints kept for compatibility
  http.get('/api/scrape/items', ({ request }) => {
    const url = new URL(request.url)
    const source = url.searchParams.get('source')
    const status = url.searchParams.get('status')
    let items = [...scrapedItems]
    if (source) items = items.filter(i => i.source.toLowerCase() === source.toLowerCase())
    if (status) items = items.filter(i => i.status === status)
    return HttpResponse.json({ items, total: items.length })
  }),

  http.post('/api/scrape/items/:id/approve', ({ params }) => {
    const item = scrapedItems.find(i => i.id === params['id'])
    if (item) item.status = 'approved'
    return HttpResponse.json({ success: true })
  }),

  http.post('/api/scrape/items/:id/deny', ({ params }) => {
    const item = scrapedItems.find(i => i.id === params['id'])
    if (item) item.status = 'denied'
    return HttpResponse.json({ success: true })
  }),

  http.get('/api/scrape/status', () =>
    HttpResponse.json({ running: false })
  ),
]
