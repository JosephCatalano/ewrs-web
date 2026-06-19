import { expect, test } from '@playwright/test'

test('renders the migration shell', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { level: 1, name: /react shell ready/i }),
  ).toBeVisible()

  await expect(page.getByText(/ewrs react migration/i)).toBeVisible()
})

test('renders the compact mobile header', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 })
  await page.goto('/')

  await expect(page.locator('.app-header__title--compact')).toBeVisible()
  await expect(page.locator('.app-header__actions')).toBeVisible()
  await expect(page.getByRole('link', { name: /home/i })).toBeVisible()
})
