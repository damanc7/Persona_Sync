import { http, HttpResponse } from 'msw'
import type { ProfileSection } from '@/types'

const schema: ProfileSection[] = [
  {
    id: 'personal',
    title: 'Personal Information',
    fields: [
      { id: 'firstName', type: 'text', label: 'First Name', value: null, required: true },
      { id: 'lastName', type: 'text', label: 'Last Name', value: null, required: true },
      { id: 'email', type: 'email', label: 'Email Address', value: null, required: true },
      { id: 'phone', type: 'phone', label: 'Phone Number', value: null },
      { id: 'dob', type: 'date', label: 'Date of Birth', value: null },
      { id: 'bio', type: 'textarea', label: 'Bio', value: null },
    ],
  },
  {
    id: 'location',
    title: 'Location',
    fields: [
      { id: 'city', type: 'text', label: 'City', value: null },
      { id: 'state', type: 'text', label: 'State / Province', value: null },
      { id: 'country', type: 'select', label: 'Country', value: null, options: ['United States', 'Canada', 'United Kingdom', 'Australia', 'Other'] },
      { id: 'timezone', type: 'select', label: 'Timezone', value: null, options: ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'Europe/London', 'Europe/Berlin', 'Asia/Tokyo'] },
    ],
  },
  {
    id: 'professional',
    title: 'Professional',
    fields: [
      { id: 'jobTitle', type: 'text', label: 'Job Title', value: null },
      { id: 'company', type: 'text', label: 'Company', value: null },
      { id: 'industry', type: 'select', label: 'Industry', value: null, options: ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Media', 'Other'] },
      { id: 'linkedinUrl', type: 'text', label: 'LinkedIn URL', value: null },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy Settings',
    fields: [
      { id: 'shareWithPartners', type: 'boolean', label: 'Share with partners', value: false },
      { id: 'allowDataBrokering', type: 'boolean', label: 'Allow data brokering', value: false },
      { id: 'ssn', type: 'sensitive', label: 'SSN (last 4)', value: null },
      { id: 'passportId', type: 'sensitive', label: 'Passport ID', value: null },
    ],
  },
]

const profileData: Record<string, string | boolean | null> = {
  firstName: 'Alex',
  lastName: 'Chen',
  email: 'alex.chen@example.com',
  phone: '+1 (555) 234-5678',
  dob: '1990-06-15',
  bio: 'Software engineer passionate about data privacy and personal data ownership.',
  city: 'San Francisco',
  state: 'California',
  country: 'United States',
  timezone: 'America/Los_Angeles',
  jobTitle: 'Senior Software Engineer',
  company: 'TechCorp Inc.',
  industry: 'Technology',
  linkedinUrl: 'https://linkedin.com/in/alexchen',
  shareWithPartners: false,
  allowDataBrokering: false,
  ssn: null,
  passportId: null,
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
