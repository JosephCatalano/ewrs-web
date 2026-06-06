/// <reference types="vite/client" />
import type { Preview } from '@storybook/react-vite'
// Real app root CSS (imported in src/main.tsx). Supplies the theme CSS
// variables, the global `* { box-sizing: border-box }` reset, and h1 sizing
// that App.css relies on — so stories render exactly like the running app.
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
