import { http, HttpResponse } from 'msw'

export const healthHandlers = [
  http.get('/api/health', () =>
    HttpResponse.json({ status: 'healthy', latency: 42, version: '0.1.0' })
  ),
]
