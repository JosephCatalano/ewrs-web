/// <reference types="vite/client" />
import type { Preview } from '@storybook/react-vite'

// Keep stories on the same root CSS as the running app.
import '../src/index.css'

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
