import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test('shows exposure score', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText(/exposure score/i)).toBeVisible({ timeout: 10000 })
  })

  test('quick actions navigate correctly', async ({ page }) => {
    await page.goto('/')
    // Wait for quick actions to render
    await page.waitForSelector('text=Review Pending', { timeout: 10000 })
    await page.getByText('Review Pending').click()
    await expect(page).toHaveURL(/scraped/)
  })
})
