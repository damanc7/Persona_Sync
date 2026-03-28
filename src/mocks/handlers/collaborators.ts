import { http, HttpResponse } from 'msw'
import type { PersonaProfile, Message } from '@/types'

const collaborators: PersonaProfile[] = [
  {
    id: 'u1', name: 'You (Alex)', email: 'alex.chen@example.com', role: 'owner', status: 'active', avatarUrl: undefined,
    tagline: 'Profile owner',
    preferences: {},
  },
  {
    id: 'joe', name: 'Joe', email: 'joe@example.com', role: 'editor', status: 'active', avatarUrl: undefined,
    tagline: 'Backend engineer, Go & Rust, prefers minimal abstractions',
    preferences: {
      languages: 'Go, Rust',
      style: 'Systems-level, explicit error handling, no magic',
      testing: 'Table-driven tests, benchmarks first',
      communication: 'Short and direct',
      editor: 'Neovim',
    },
  },
  {
    id: 'harish', name: 'Harish', email: 'harish@example.com', role: 'editor', status: 'active', avatarUrl: undefined,
    tagline: 'Full-stack dev, TypeScript & React, design-minded',
    preferences: {
      languages: 'TypeScript, Python',
      style: 'Component-driven, clean APIs, strong types',
      testing: 'Integration tests with Playwright, Vitest',
      communication: 'Detailed with diagrams',
      editor: 'Cursor',
    },
  },
  {
    id: 'daman', name: 'Daman', email: 'daman@example.com', role: 'editor', status: 'active', avatarUrl: undefined,
    tagline: 'Product engineer, Rails & React, ships fast',
    preferences: {
      languages: 'Ruby, TypeScript',
      style: 'Convention over configuration, ship and iterate',
      testing: 'RSpec, happy-path first, then edge cases',
      communication: 'Casual, emoji-friendly, voice notes',
      editor: 'VS Code',
    },
  },
]

const messages: Message[] = [
  {
    id: 'm1', authorId: 'u1', authorType: 'user',
    content: 'How should we structure the API for the new profile service?',
    timestamp: '2026-03-28T09:00:00Z', topic: 'api-design',
  },
  {
    id: 'm2', authorId: 'joe', authorType: 'persona',
    content: 'Keep it simple. A single /profile endpoint with GET and PUT. No nested resources. Use protobuf if performance matters, otherwise plain JSON. Avoid over-abstracting early.',
    timestamp: '2026-03-28T09:02:00Z', topic: 'api-design',
  },
  {
    id: 'm3', authorId: 'harish', authorType: 'persona',
    content: 'I\'d split it into /profile/schema for field definitions and /profile/data for values. That way the UI can dynamically render forms from the schema. TypeScript types can be generated from the schema too.',
    timestamp: '2026-03-28T09:03:00Z', topic: 'api-design',
  },
  {
    id: 'm4', authorId: 'daman', authorType: 'persona',
    content: 'Honestly, just use Rails resources. `resources :profiles` gives you CRUD for free. Ship it, see what users actually need, then optimize. Don\'t build what nobody asked for yet.',
    timestamp: '2026-03-28T09:05:00Z', topic: 'api-design',
  },
  {
    id: 'm5', authorId: 'u1', authorType: 'user',
    content: 'What about auth? Should we use JWT or session cookies?',
    timestamp: '2026-03-28T09:10:00Z', topic: 'auth',
  },
  {
    id: 'm6', authorId: 'joe', authorType: 'persona',
    content: 'JWT with short expiry and refresh tokens. Stateless. The server should never have to hit a session store on every request. Keep the token payload minimal \u2014 just user ID and expiry.',
    timestamp: '2026-03-28T09:11:00Z', topic: 'auth',
  },
  {
    id: 'm7', authorId: 'harish', authorType: 'persona',
    content: 'For a profile app like this, session cookies are simpler and more secure by default (HttpOnly, SameSite). JWTs are overkill unless you need cross-service auth. I\'d start with cookies.',
    timestamp: '2026-03-28T09:12:00Z', topic: 'auth',
  },
]

export const collaboratorHandlers = [
  http.get('/api/collaborators', () =>
    HttpResponse.json(collaborators)
  ),

  http.post('/api/collaborators/invite', async ({ request }) => {
    const body = await request.json() as { email: string; role: string; name: string; tagline: string }
    const newCollaborator: PersonaProfile = {
      id: `u${Date.now()}`,
      name: body.name || body.email.split('@')[0] || 'Unknown',
      email: body.email,
      role: body.role as PersonaProfile['role'],
      status: 'invited',
      tagline: body.tagline || '',
      preferences: {},
    }
    collaborators.push(newCollaborator)
    return HttpResponse.json(newCollaborator, { status: 201 })
  }),

  http.delete('/api/collaborators/:id', ({ params }) => {
    const idx = collaborators.findIndex(c => c.id === params['id'])
    if (idx !== -1) collaborators.splice(idx, 1)
    return HttpResponse.json({ success: true })
  }),

  http.get('/api/messages', ({ request }) => {
    const url = new URL(request.url)
    const topic = url.searchParams.get('topic')
    const filtered = topic ? messages.filter(m => m.topic === topic) : messages
    return HttpResponse.json(filtered)
  }),

  http.post('/api/messages', async ({ request }) => {
    const body = await request.json() as { content: string; topic?: string }
    const newMsg: Message = {
      id: `m${Date.now()}`,
      authorId: 'u1',
      authorType: 'user',
      content: body.content,
      timestamp: new Date().toISOString(),
      topic: body.topic,
    }
    messages.push(newMsg)
    return HttpResponse.json(newMsg, { status: 201 })
  }),
]
