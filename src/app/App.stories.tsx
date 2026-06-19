import { QueryClientProvider } from '@tanstack/react-query'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { expect } from 'storybook/test'

import { queryClient } from '../api/queryClient'
import { AlertProvider } from '../shared/alerts'
import { LoaderProvider } from '../shared/loader'
import { ThemeProvider } from '../shared/theme'
import App from './App'

const meta = {
  component: App,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LoaderProvider>
            <AlertProvider>
              <MemoryRouter initialEntries={['/home']}>
                <Story />
              </MemoryRouter>
            </AlertProvider>
          </LoaderProvider>
        </ThemeProvider>
      </QueryClientProvider>
    ),
  ],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof App>

export default meta
type Story = StoryObj<typeof meta>

// Proves the shell renders the routed home placeholder inside the main landmark.
export const Default: Story = {
  play: async ({ canvas }) => {
    const main = canvas.getByRole('main')

    await expect(
      canvas.getByRole('heading', { level: 1, name: /^home$/i }),
    ).toBeVisible()
    await expect(main).toBeVisible()
  },
}

// Verifies Storybook preview loaded the same root CSS as the running app.
export const CssCheck: Story = {
  play: async ({ canvas }) => {
    const heading = canvas.getByRole('heading', {
      level: 1,
      name: /^home$/i,
    })

    await expect(getComputedStyle(heading).boxSizing).toBe('border-box')
  },
}
