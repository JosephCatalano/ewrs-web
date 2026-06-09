import { useQueryClient } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AppProviders } from './AppProviders'

function QueryProviderProbe() {
  const queryClient = useQueryClient()

  return (
    <main>
      {queryClient ? 'Query provider ready' : 'Query provider missing'}
    </main>
  )
}

describe('AppProviders', () => {
  it('renders children inside app providers', () => {
    render(
      <AppProviders>
        <main>Provider smoke test</main>
      </AppProviders>,
    )

    expect(screen.getByText(/provider smoke test/i)).toBeInTheDocument()
  })

  it('provides a TanStack Query client', () => {
    render(
      <AppProviders>
        <QueryProviderProbe />
      </AppProviders>,
    )

    expect(screen.getByText(/query provider ready/i)).toBeInTheDocument()
  })
})
