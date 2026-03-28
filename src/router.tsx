import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { Dashboard } from '@/pages/Dashboard'
import { Profile } from '@/pages/Profile'
import { ScrapedData } from '@/pages/ScrapedData'
import { DataMap } from '@/pages/DataMap'
import { Collaborators } from '@/pages/Collaborators'
import { Marketplace } from '@/pages/Marketplace'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'profile', element: <Profile /> },
      { path: 'scraped', element: <ScrapedData /> },
      { path: 'map', element: <DataMap /> },
      { path: 'collaborators', element: <Collaborators /> },
      { path: 'marketplace', element: <Marketplace /> },
    ]
  }
])
