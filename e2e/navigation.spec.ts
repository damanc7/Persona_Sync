import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('visits dashboard by default', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible()
  })

  test('navigates to profile page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /profile/i }).first().click()
    await expect(page).toHaveURL(/profile/)
  })

  test('navigates to scraped data page', async ({ page }) => {
    await page.goto('/scraped')
    await expect(page.getByRole('heading', { name: /scraped data/i })).toBeVisible()
  })

  test('navigates to data map page', async ({ page }) => {
    await page.goto('/map')
    await expect(page.getByRole('heading', { name: /data map/i })).toBeVisible()
  })

  test('navigates to collaborators page', async ({ page }) => {
    await page.goto('/collaborators')
    await expect(page.getByRole('heading', { name: /collaborators/i })).toBeVisible()
  })

  test('navigates to marketplace page', async ({ page }) => {
    await page.goto('/marketplace')
    await expect(page.getByRole('heading', { name: /marketplace/i })).toBeVisible()
  })
})
