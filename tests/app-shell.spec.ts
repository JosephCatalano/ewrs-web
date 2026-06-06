import { expect, test } from '@playwright/test'

test('renders the migration shell', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { level: 1, name: /react shell ready/i }),
  ).toBeVisible()

  await expect(page.getByText(/ewrs react migration/i)).toBeVisible()
})
