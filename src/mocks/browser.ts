import { setupWorker } from 'msw/browser'
import { healthHandlers } from './handlers/health'
import { profileHandlers } from './handlers/profile'
import { scrapedHandlers } from './handlers/scraped'
import { mapHandlers } from './handlers/map'
import { collaboratorHandlers } from './handlers/collaborators'
import { marketplaceHandlers } from './handlers/marketplace'
import { dashboardHandlers } from './handlers/dashboard'
import { perceptionHandlers } from './handlers/perceptions'

export const worker = setupWorker(
  ...healthHandlers,
  ...profileHandlers,
  ...scrapedHandlers,
  ...mapHandlers,
  ...collaboratorHandlers,
  ...marketplaceHandlers,
  ...dashboardHandlers,
  ...perceptionHandlers,
)
