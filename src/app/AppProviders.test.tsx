import { useQueryClient } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useLoader } from '../shared/loader'
import { AppProviders } from './AppProviders'

const telemetryMocks = vi.hoisted(() => ({
  initializeAppInsights: vi.fn(),
}))

vi.mock('../telemetry/appInsights', () => ({
  initializeAppInsights: telemetryMocks.initializeAppInsights,
}))

function QueryProviderProbe() {
  const queryClient = useQueryClient()

  return (
    <main>
      {queryClient ? 'Query provider ready' : 'Query provider missing'}
    </main>
  )
}

function LoaderProviderProbe() {
  const { isManuallyLoading } = useLoader()

  return (
    <main>
      {isManuallyLoading ? 'Loader provider active' : 'Loader provider ready'}
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

  it('provides the shared loader context', () => {
    render(
      <AppProviders>
        <LoaderProviderProbe />
      </AppProviders>,
    )

    expect(screen.getByText(/loader provider ready/i)).toBeInTheDocument()
  })

  it('initializes telemetry through the provider module', () => {
    expect(telemetryMocks.initializeAppInsights).toHaveBeenCalledTimes(1)
  })
})
