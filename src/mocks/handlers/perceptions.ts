import { http, HttpResponse } from 'msw'
import type { PerceptionsResponse, PlatformPerception } from '../../types'

const perceptions: PlatformPerception[] = [
  {
    platformId: 'linkedin',
    platformName: 'LinkedIn',
    platformIcon: 'linkedin',
    connected: true,
    category: 'Professional',
    summary: 'A senior-level software engineer actively building toward a leadership or staff-eng transition, with a strong Python and React signal and a clear interest cluster around AI/ML tooling and developer productivity.',
    confidenceLevel: 'very_high',
    confidenceScore: 0.91,
    exposureScore: 0.72,
    dataPoints: 134,
    lastUpdated: '2026-03-27T14:30:00Z',
    userAccuracyVote: null,
    traits: [
      { id: 'lt1', label: 'Senior Individual Contributor', category: 'Professional', weight: 0.95 },
      { id: 'lt2', label: 'Python / React Expert', category: 'Professional', weight: 0.88 },
      { id: 'lt3', label: 'AI/ML Interest Cluster', category: 'Professional', weight: 0.82 },
      { id: 'lt4', label: 'Career Growth Focus', category: 'Behavioral', weight: 0.75 },
      { id: 'lt5', label: 'SF Bay Area Network', category: 'Demographic', weight: 0.70 },
      { id: 'lt6', label: 'Open Source Contributor', category: 'Professional', weight: 0.65 },
    ],
  },
  {
    platformId: 'google',
    platformName: 'Google',
    platformIcon: 'google',
    connected: true,
    category: 'Consumer',
    summary: 'A 28–35 year old developer in a high-income urban bracket. Productivity-maximizing behavior across Google Workspace. Strong early-adopter signal for AI tooling. Travel intent spiking quarterly.',
    confidenceLevel: 'high',
    confidenceScore: 0.78,
    exposureScore: 0.68,
    dataPoints: 289,
    lastUpdated: '2026-03-28T08:00:00Z',
    userAccuracyVote: null,
    traits: [
      { id: 'gt1', label: 'Age Bracket: 28–35', category: 'Demographic', weight: 0.80 },
      { id: 'gt2', label: 'High-Income Professional', category: 'Demographic', weight: 0.76 },
      { id: 'gt3', label: 'Productivity-Obsessed', category: 'Behavioral', weight: 0.85 },
      { id: 'gt4', label: 'Early AI Adopter', category: 'Behavioral', weight: 0.90 },
      { id: 'gt5', label: 'Urban SF Resident', category: 'Demographic', weight: 0.72 },
      { id: 'gt6', label: 'Travel Intent (Quarterly)', category: 'Behavioral', weight: 0.60 },
    ],
  },
  {
    platformId: 'github',
    platformName: 'GitHub',
    platformIcon: 'github',
    connected: true,
    category: 'Professional',
    summary: 'Polyglot programmer with TypeScript as primary language and active contribution history. Night-owl coding pattern (10pm–2am commits). Strong OSS engagement and a preference for developer tooling repos.',
    confidenceLevel: 'very_high',
    confidenceScore: 0.93,
    exposureScore: 0.85,
    dataPoints: 512,
    lastUpdated: '2026-03-28T02:15:00Z',
    userAccuracyVote: null,
    traits: [
      { id: 'ght1', label: 'TypeScript Primary', category: 'Professional', weight: 0.92 },
      { id: 'ght2', label: 'Night-Owl Coder (10pm–2am)', category: 'Behavioral', weight: 0.88 },
      { id: 'ght3', label: 'Active OSS Contributor', category: 'Professional', weight: 0.85 },
      { id: 'ght4', label: 'Polyglot Programmer', category: 'Professional', weight: 0.80 },
      { id: 'ght5', label: 'Developer Tooling Focus', category: 'Professional', weight: 0.77 },
      { id: 'ght6', label: 'Solo Project Initiator', category: 'Behavioral', weight: 0.65 },
    ],
  },
  {
    platformId: 'spotify',
    platformName: 'Spotify',
    platformIcon: 'spotify',
    connected: true,
    category: 'Productivity',
    summary: 'Focus-state listener. 70% of listening hours are instrumental or electronic with zero lyrics. Session lengths correlate with deep-work blocks. High Discover Weekly engagement signals strong taste novelty preference.',
    confidenceLevel: 'high',
    confidenceScore: 0.84,
    exposureScore: 0.55,
    dataPoints: 78,
    lastUpdated: '2026-03-27T22:00:00Z',
    userAccuracyVote: null,
    traits: [
      { id: 'st1', label: 'Focus-State Listener', category: 'Behavioral', weight: 0.90 },
      { id: 'st2', label: 'Instrumental / Electronic', category: 'Psychographic', weight: 0.85 },
      { id: 'st3', label: 'Deep Work Correlation', category: 'Behavioral', weight: 0.78 },
      { id: 'st4', label: 'Taste Novelty Seeker', category: 'Psychographic', weight: 0.68 },
    ],
  },
  {
    platformId: 'amazon',
    platformName: 'Amazon',
    platformIcon: 'amazon',
    connected: false,
    category: 'Consumer',
    summary: 'Amazon has no live data for this account. Connect Amazon to see what purchase patterns and product affinities they have inferred.',
    confidenceLevel: 'low',
    confidenceScore: 0,
    exposureScore: 0,
    dataPoints: 0,
    lastUpdated: '',
    userAccuracyVote: null,
    traits: [],
  },
  {
    platformId: 'instagram',
    platformName: 'Instagram',
    platformIcon: 'instagram',
    connected: false,
    category: 'Social',
    summary: 'Instagram has no live data for this account. Connect Instagram to reveal the aesthetic and content interest graph Meta has built for you.',
    confidenceLevel: 'low',
    confidenceScore: 0,
    exposureScore: 0,
    dataPoints: 0,
    lastUpdated: '',
    userAccuracyVote: null,
    traits: [],
  },
]

// vote state — mutable for optimistic-update demo
const voteState = new Map<string, 'agree' | 'disagree' | null>(
  perceptions.map(p => [p.platformId, null])
)

// Pre-rendered export strings
function getChatGPTPrompt(): string {
  return `You are a personal AI assistant for Alex Chen.

## About Alex
- Senior Software Engineer based in San Francisco, CA
- Core expertise: TypeScript, React, Python, Node.js
- Education: BS Computer Science, Stanford University
- Works at TechCorp Inc.

## Professional Identity (LinkedIn signal)
Alex is a senior IC actively exploring staff-engineer or leadership tracks. Deep interest in AI/ML tooling and developer productivity. Active open-source contributor with a polyglot coding style.

## Behavioral Patterns (inferred)
- Codes primarily 10pm–2am (night-owl pattern)
- Deep-work focused: uses instrumental/electronic music during work sessions
- Early adopter of AI tooling (GitHub, Google, Cursor data all agree)
- Quarterly travel intent

## Preferences
- Concise, technically precise responses
- Prefers code examples over prose explanations
- Values developer tooling and productivity workflows
- Does not need explanations of basic programming concepts

## Data Ownership Note
This context was self-exported from PersonaSync. Alex owns this data and chose to share it with you.`
}

function getClaudeContext(): string {
  const today = new Date().toISOString().split('T')[0]
  return `<persona_context>
  <identity>
    <name>Alex Chen</name>
    <role>Senior Software Engineer</role>
    <location>San Francisco, CA</location>
    <employer>TechCorp Inc.</employer>
    <education>BS Computer Science, Stanford University</education>
  </identity>

  <professional_profile source="linkedin" confidence="0.91">
    <expertise>TypeScript, React, Python, Node.js, AI/ML tooling</expertise>
    <career_trajectory>Senior IC to Staff Engineer track</career_trajectory>
    <oss_activity>Active contributor, polyglot, developer tooling focus</oss_activity>
  </professional_profile>

  <behavioral_signals>
    <coding_pattern source="github" confidence="0.93">Night-owl (10pm–2am peak commits)</coding_pattern>
    <focus_style source="spotify" confidence="0.84">Deep work sessions with instrumental/electronic music</focus_style>
    <adopter_curve source="google" confidence="0.78">Early adopter of AI and developer tooling</adopter_curve>
  </behavioral_signals>

  <communication_preferences>
    <style>Technical and concise</style>
    <examples>Strongly preferred over abstract explanations</examples>
    <assumed_knowledge>Senior engineer level — skip fundamentals</assumed_knowledge>
  </communication_preferences>

  <data_provenance>
    Self-exported from PersonaSync on ${today}.
    Alex controls this data and chose to share it.
  </data_provenance>
</persona_context>`
}

function getGeminiProfile(): string {
  const today = new Date().toISOString().split('T')[0]
  return `Personalization Profile — Alex Chen
Generated: ${today}

PROFESSIONAL CONTEXT
Role: Senior Software Engineer @ TechCorp Inc., San Francisco
Skills: TypeScript, React, Python, Node.js, AI/ML tooling
Education: BS CS, Stanford
OSS: Active contributor, night-owl coding pattern (10pm–2am)

BEHAVIORAL CONTEXT
Focus mode: Deep work with instrumental/electronic music (Spotify data)
Adoption curve: Early adopter — already using Cursor, Claude Code, GitHub Copilot
Career signal: Exploring staff-eng/leadership tracks

INTERACTION PREFERENCES
- Technically precise, minimal fluff
- Code examples strongly preferred
- Assumes senior-level knowledge
- Interested in AI/ML, developer productivity, OSS

SOURCE: User self-exported from PersonaSync. Data is user-owned and user-controlled.`
}

function getJsonExport(): string {
  return JSON.stringify({
    schema: 'persona-sync/v1',
    generatedAt: new Date().toISOString(),
    subject: {
      name: 'Alex Chen',
      email: 'alex.chen@gmail.com',
      location: 'San Francisco, CA',
      role: 'Senior Software Engineer',
      employer: 'TechCorp Inc.',
      education: 'BS Computer Science, Stanford University',
    },
    algorithmicProfile: {
      linkedin: { confidence: 0.91, category: 'Professional', traits: ['Senior IC', 'TypeScript/React/Python', 'AI/ML interest', 'OSS contributor'] },
      github: { confidence: 0.93, category: 'Professional', traits: ['Night-owl coder', 'Polyglot', 'Developer tooling focus', 'Active OSS'] },
      google: { confidence: 0.78, category: 'Consumer', traits: ['28–35 bracket', 'High-income urban', 'Early AI adopter', 'Productivity-maximizing'] },
      spotify: { confidence: 0.84, category: 'Productivity', traits: ['Focus-state listener', 'Instrumental/electronic', 'Deep-work correlation'] },
    },
    preferences: {
      communicationStyle: 'technical-concise',
      codeExamples: 'strongly-preferred',
      assumedKnowledge: 'senior-engineer',
    },
    dataOwnership: {
      exportedBy: 'subject',
      exportedAt: new Date().toISOString(),
      tool: 'PersonaSync',
      note: 'Subject owns this data and consented to this export.',
    },
  }, null, 2)
}

function getMarkdownExport(): string {
  const today = new Date().toISOString().split('T')[0]
  return `# Alex Chen — Persona Profile
> Exported from PersonaSync on ${today}

## Identity
| Field | Value |
|---|---|
| Name | Alex Chen |
| Role | Senior Software Engineer |
| Employer | TechCorp Inc. |
| Location | San Francisco, CA |
| Education | BS CS, Stanford University |

## What Algorithms Think About You

### LinkedIn (Confidence: 91%)
**Category:** Professional
- Senior IC on a staff-eng track
- Core expertise: TypeScript, React, Python
- Strong AI/ML and developer productivity interest cluster
- Active OSS contributor

### GitHub (Confidence: 93%)
**Category:** Professional
- Night-owl coder — peak commits 10pm–2am
- Polyglot programmer (TypeScript primary)
- Developer tooling and OSS focus

### Google (Confidence: 78%)
**Category:** Consumer / Behavioral
- Age bracket 28–35, high-income urban professional
- Early AI adopter across all tracked products
- Productivity-maximizing behavior pattern

### Spotify (Confidence: 84%)
**Category:** Productivity / Psychographic
- Deep-work focus-state listener
- 70% instrumental / electronic content
- Session lengths correlate with work blocks

## Communication Preferences
- **Style:** Technical and concise
- **Examples:** Strongly preferred over abstract prose
- **Assumed knowledge:** Senior engineer level

---
*This data is self-owned and was exported by the subject via PersonaSync.*`
}

export const perceptionHandlers = [
  http.get('/api/perceptions', () => {
    const connected = perceptions.filter(p => p.connected).length
    const result: PerceptionsResponse = {
      perceptions: perceptions.map(p => ({ ...p, userAccuracyVote: voteState.get(p.platformId) ?? null })),
      totalPlatforms: perceptions.length,
      connectedPlatforms: connected,
      lastAnalyzed: new Date().toISOString(),
    }
    return HttpResponse.json(result)
  }),

  http.patch('/api/perceptions/:platformId/vote', async ({ params, request }) => {
    const { platformId } = params as { platformId: string }
    const body = await request.json() as { vote: 'agree' | 'disagree' | null }
    if (!voteState.has(platformId)) {
      return HttpResponse.json({ error: 'Platform not found' }, { status: 404 })
    }
    voteState.set(platformId, body.vote)
    return HttpResponse.json({ platformId, vote: body.vote })
  }),

  http.get('/api/export/:format', ({ params }) => {
    const { format } = params as { format: string }
    const formats: Record<string, () => string> = {
      openai: getChatGPTPrompt,
      anthropic: getClaudeContext,
      gemini: getGeminiProfile,
      json: getJsonExport,
      markdown: getMarkdownExport,
    }
    if (!formats[format]) {
      return HttpResponse.json({ error: 'Unknown format' }, { status: 400 })
    }
    return HttpResponse.json({
      generatedAt: new Date().toISOString(),
      version: '1',
      format,
      content: formats[format](),
    })
  }),
]
