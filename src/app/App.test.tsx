import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { createQueryClient } from '../api/queryClient'
import { AlertProvider } from '../shared/alerts'
import { LoaderProvider } from '../shared/loader'
import { ThemeProvider } from '../shared/theme'
import App from './App'

function renderApp(initialPath: string) {
  const queryClient = createQueryClient()

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LoaderProvider>
          <AlertProvider>
            <MemoryRouter initialEntries={[initialPath]}>
              <App />
            </MemoryRouter>
          </AlertProvider>
        </LoaderProvider>
      </ThemeProvider>
    </QueryClientProvider>,
  )
}

describe('App', () => {
  it('renders the shell and the routed home placeholder', () => {
    renderApp('/home')

    expect(
      screen.getByAltText(/government of ontario logo/i),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 1, name: /^home$/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /need help using ewrs\?/i }),
    ).toBeInTheDocument()
  })

  it('redirects the index route to home', () => {
    renderApp('/')

    expect(
      screen.getByRole('heading', { level: 1, name: /^home$/i }),
    ).toBeInTheDocument()
  })
})
