import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import App from './App'

const meta = {
  component: App,
  parameters: { layout: 'fullscreen' },
  tags: ['ai-generated'],
} satisfies Meta<typeof App>

export default meta
type Story = StoryObj<typeof meta>

// The migration scaffold shell. The play proves the accessibility wiring
// resolves: <main aria-labelledby="app-title"> must derive its accessible
// name from the <h1 id="app-title"> — something the bare render doesn't assert.
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('main', { name: /scaffold ready/i }),
    ).toBeVisible()
  },
}

// The single project-wide CssCheck. src/index.css (the root stylesheet the
// shared preview must supply) declares `* { box-sizing: border-box }`. The
// browser default is `content-box`, so a resolved `border-box` is concrete
// proof that the preview actually loaded the app's root CSS.
export const CssCheck: Story = {
  play: async ({ canvas }) => {
    const heading = canvas.getByRole('heading', {
      level: 1,
      name: /scaffold ready/i,
    })
    await expect(getComputedStyle(heading).boxSizing).toBe('border-box')
  },
}
