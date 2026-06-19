import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { createQueryClient } from '../api/queryClient'
import { ThemeProvider } from '../shared/theme'
import { AppShell } from './AppShell'

function renderShell() {
  const queryClient = createQueryClient()

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MemoryRouter>
          <AppShell>
            <p>Page content</p>
          </AppShell>
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>,
  )
}

describe('AppShell', () => {
  it('renders the branded shell, page content, and footer', () => {
    renderShell()

    expect(
      screen.getByRole('link', { name: /skip to main content/i }),
    ).toHaveAttribute('href', '#main-content')
    expect(
      screen.getByAltText(/government of ontario logo/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/employee workspace reservation system/i),
    ).toBeInTheDocument()
    expect(screen.getByText(/page content/i)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /need help using ewrs\?/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /accessibility/i }),
    ).toHaveAttribute('href', 'http://www.ontario.ca/page/accessibility')
  })

  it('hides role-gated navigation when there is no authenticated user', () => {
    renderShell()

    expect(
      screen.queryByRole('navigation', { name: /primary/i }),
    ).not.toBeInTheDocument()
  })
})
