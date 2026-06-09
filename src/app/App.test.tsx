import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { createQueryClient } from '../api/queryClient'
import { AlertProvider } from '../shared/alerts'
import { LoaderProvider } from '../shared/loader'
import { ThemeProvider } from '../shared/theme'
import App from './App'

describe('App', () => {
  it('renders the migration shell', () => {
    const queryClient = createQueryClient()

    render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LoaderProvider>
            <AlertProvider>
              <App />
            </AlertProvider>
          </LoaderProvider>
        </ThemeProvider>
      </QueryClientProvider>,
    )

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /react shell ready/i,
      }),
    ).toBeInTheDocument()

    expect(screen.getByText(/ewrs react migration/i)).toBeInTheDocument()
    expect(
      screen.getByText(/the vite react shell is ready for phase 2/i),
    ).toBeInTheDocument()
  })
})
