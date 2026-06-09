import { QueryClientProvider } from '@tanstack/react-query'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { queryClient } from '../api/queryClient'
import { AlertProvider } from '../shared/alerts'
import { LoaderProvider } from '../shared/loader'
import App from './App'

const meta = {
  component: App,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <LoaderProvider>
          <AlertProvider>
            <Story />
          </AlertProvider>
        </LoaderProvider>
      </QueryClientProvider>
    ),
  ],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof App>

export default meta
type Story = StoryObj<typeof meta>

// Proves <main aria-labelledby="app-title"> derives its accessible name from
// the heading, which the bare render test does not assert.
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('main', { name: /react shell ready/i }),
    ).toBeVisible()
  },
}

// Verifies Storybook preview loaded the same root CSS as the running app.
export const CssCheck: Story = {
  play: async ({ canvas }) => {
    const heading = canvas.getByRole('heading', {
      level: 1,
      name: /react shell ready/i,
    })

    await expect(getComputedStyle(heading).boxSizing).toBe('border-box')
  },
}
