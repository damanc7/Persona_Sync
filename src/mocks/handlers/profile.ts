import { http, HttpResponse } from 'msw'
import type { ProfileSection } from '@/types'

const schema: ProfileSection[] = [
  {
    id: 'identity',
    title: 'About You',
    fields: [
      { id: 'firstName', type: 'text', label: 'First Name', value: null, required: true },
      { id: 'lastName', type: 'text', label: 'Last Name', value: null, required: true },
      { id: 'email', type: 'email', label: 'Email Address', value: null, required: true },
      { id: 'phone', type: 'phone', label: 'Phone Number', value: null },
      { id: 'dob', type: 'date', label: 'Date of Birth', value: null },
      { id: 'bio', type: 'textarea', label: 'Short Bio', value: null },
    ],
  },
  {
    id: 'location',
    title: 'Location & Timezone',
    fields: [
      { id: 'city', type: 'text', label: 'City', value: null },
      { id: 'state', type: 'text', label: 'State / Province', value: null },
      { id: 'country', type: 'select', label: 'Country', value: null, options: ['United States', 'Canada', 'United Kingdom', 'Australia', 'Other'] },
      { id: 'timezone', type: 'select', label: 'Timezone', value: null, options: ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'Europe/London', 'Europe/Berlin', 'Asia/Tokyo'] },
    ],
  },
  {
    id: 'professional',
    title: 'Professional Context',
    fields: [
      { id: 'jobTitle', type: 'text', label: 'Job Title', value: null },
      { id: 'company', type: 'text', label: 'Company', value: null },
      { id: 'industry', type: 'select', label: 'Industry', value: null, options: ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Media', 'Other'] },
      { id: 'linkedinUrl', type: 'text', label: 'LinkedIn URL', value: null },
    ],
  },
  {
    id: 'developer',
    title: 'Developer Preferences',
    fields: [
      { id: 'primaryLanguages', type: 'text', label: 'Primary Languages (e.g. TypeScript, Python)', value: null },
      { id: 'preferredFrameworks', type: 'text', label: 'Preferred Frameworks (e.g. React, FastAPI)', value: null },
      { id: 'editor', type: 'select', label: 'Primary Editor', value: null, options: ['Cursor', 'VS Code', 'Neovim', 'JetBrains', 'Zed', 'Other'] },
      { id: 'codeStyle', type: 'select', label: 'Code Style', value: null, options: ['Concise & pragmatic', 'Verbose & explicit', 'Functional-first', 'OOP-first'] },
      { id: 'testingApproach', type: 'select', label: 'Testing Approach', value: null, options: ['TDD', 'Write tests after', 'Integration-first', 'Minimal testing'] },
      { id: 'codeReviewStyle', type: 'textarea', label: 'Code Review Preferences', value: null },
    ],
  },
  {
    id: 'workflow',
    title: 'Workflow & Constraints',
    fields: [
      { id: 'communicationStyle', type: 'select', label: 'Communication Style', value: null, options: ['Direct & concise', 'Detailed & thorough', 'Casual & conversational', 'Formal & structured'] },
      { id: 'learningStyle', type: 'select', label: 'Learning Style', value: null, options: ['Show me code', 'Explain concepts first', 'Interactive / Q&A', 'Documentation links'] },
      { id: 'availability', type: 'select', label: 'Typical Availability', value: null, options: ['Mornings', 'Afternoons', 'Evenings', 'Flexible'] },
      { id: 'currentFocus', type: 'textarea', label: 'Current Focus / Goals', value: null },
      { id: 'constraints', type: 'textarea', label: 'Known Constraints or Preferences', value: null },
    ],
  },
  {
    id: 'access',
    title: 'Data Access Controls',
    fields: [
      { id: 'shareWithAgents', type: 'boolean', label: 'Allow AI agents to read my profile via MCP', value: true },
      { id: 'shareWithCollaborators', type: 'boolean', label: 'Share profile with collaborators', value: false },
    ],
  },
]

const profileData: Record<string, string | boolean | null> = {
  firstName: 'Alex',
  lastName: 'Chen',
  email: 'alex.chen@example.com',
  phone: '+1 (555) 234-5678',
  dob: '1990-06-15',
  bio: 'Software engineer passionate about building great developer tools and owning my own data.',
  city: 'San Francisco',
  state: 'California',
  country: 'United States',
  timezone: 'America/Los_Angeles',
  jobTitle: 'Senior Software Engineer',
  company: 'TechCorp Inc.',
  industry: 'Technology',
  linkedinUrl: 'https://linkedin.com/in/alexchen',
  primaryLanguages: 'TypeScript, Python',
  preferredFrameworks: 'React, FastAPI, Tailwind',
  editor: 'Cursor',
  codeStyle: 'Concise & pragmatic',
  testingApproach: 'Integration-first',
  codeReviewStyle: 'Prefer small PRs with clear descriptions. Focus on readability over cleverness.',
  communicationStyle: 'Direct & concise',
  learningStyle: 'Show me code',
  availability: 'Mornings',
  currentFocus: 'Building a personal MCP server and profile system for Claude Code.',
  constraints: 'Prefer functional patterns. Avoid class components. Keep dependencies minimal.',
  shareWithAgents: true,
  shareWithCollaborators: false,
}

export const profileHandlers = [
  http.get('/api/schema', () => HttpResponse.json(schema)),

  http.get('/api/profile', () => HttpResponse.json(profileData)),

  http.post('/api/profile', async ({ request }) => {
    const body = await request.json() as Record<string, string | boolean | null>
    Object.assign(profileData, body)
    return HttpResponse.json({ success: true, data: profileData })
  }),
]
