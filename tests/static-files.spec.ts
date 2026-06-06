import { expect, test } from '@playwright/test'

test('serves copied docs and assets from stable public paths', async ({
  request,
}) => {
  const manifestResponse = await request.get('/docs/docs-manifest.json')
  expect(manifestResponse.ok()).toBe(true)

  const manifest = (await manifestResponse.json()) as {
    items: Array<{ title: string }>
  }
  expect(manifest.items.some((item) => item.title === 'Getting Started')).toBe(
    true,
  )

  const markdownResponse = await request.get(
    '/docs/getting-started/introduction.md',
  )
  expect(markdownResponse.ok()).toBe(true)

  const manualResponse = await request.get('/assets/EWRS-Manual.pdf')
  expect(manualResponse.ok()).toBe(true)

  const checkInPdfResponse = await request.get(
    '/assets/How%20to%20-%20Check-in.pdf',
  )
  expect(checkInPdfResponse.ok()).toBe(true)
})
