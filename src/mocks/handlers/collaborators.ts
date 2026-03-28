import { http, HttpResponse } from 'msw'
import type { Collaborator, Message } from '@/types'

const collaborators: Collaborator[] = [
  { id: 'u1', name: 'Alex Chen', email: 'alex.chen@example.com', role: 'owner', status: 'active', avatarUrl: undefined },
  { id: 'u2', name: 'Jordan Lee', email: 'jordan.lee@example.com', role: 'editor', status: 'active', avatarUrl: undefined },
  { id: 'u3', name: 'Sam Rivera', email: 'sam.rivera@example.com', role: 'viewer', status: 'invited', avatarUrl: undefined },
  { id: 'u4', name: 'Taylor Kim', email: 'taylor.kim@example.com', role: 'editor', status: 'active', avatarUrl: undefined },
]

const messages: Message[] = [
  { id: 'm1', authorId: 'u1', authorType: 'user', content: 'I reviewed the scraped data from LinkedIn. Some entries look off.', timestamp: '2024-03-27T09:00:00Z', topic: 'scraped-data' },
  { id: 'm2', authorId: 'u2', authorType: 'collaborator', content: 'Agreed. The skills section seems to have pulled in data from a different profile.', timestamp: '2024-03-27T09:05:00Z', topic: 'scraped-data' },
  { id: 'm3', authorId: 'llm', authorType: 'llm', content: 'Based on the data patterns, the LinkedIn scrape may have captured connections\' profile data. I recommend reviewing items s6 and s12 manually.', timestamp: '2024-03-27T09:06:00Z', topic: 'scraped-data' },
  { id: 'm4', authorId: 'u4', authorType: 'collaborator', content: 'Should we deny those items until we can verify?', timestamp: '2024-03-27T09:10:00Z', topic: 'scraped-data' },
  { id: 'm5', authorId: 'u1', authorType: 'user', content: 'Yes, let\'s be conservative. Better to deny and re-approve than approve incorrect data.', timestamp: '2024-03-27T09:12:00Z', topic: 'scraped-data' },
  { id: 'm6', authorId: 'u2', authorType: 'collaborator', content: 'Also, the data map shows Acxiom has high exposure. Should we look into opt-outs?', timestamp: '2024-03-27T10:00:00Z', topic: 'data-map' },
  { id: 'm7', authorId: 'llm', authorType: 'llm', content: 'Acxiom offers an opt-out at optout.acxiom.com. Given the 0.91 exposure score, this is recommended. Would you like me to draft an opt-out request?', timestamp: '2024-03-27T10:01:00Z', topic: 'data-map' },
]

export const collaboratorHandlers = [
  http.get('/api/collaborators', () =>
    HttpResponse.json(collaborators)
  ),

  http.post('/api/collaborators/invite', async ({ request }) => {
    const body = await request.json() as { email: string; role: string }
    const newCollaborator: Collaborator = {
      id: `u${Date.now()}`,
      name: body.email.split('@')[0] ?? 'Unknown',
      email: body.email,
      role: body.role as Collaborator['role'],
      status: 'invited',
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
