import {
  QueryClientProvider,
  useMutation,
  useQuery,
} from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useEffect, type ReactNode } from 'react'
import { describe, expect, it } from 'vitest'

import { createQueryClient } from '../../api/queryClient'
import { LoaderOverlay } from './LoaderOverlay'
import { LoaderProvider } from './LoaderProvider'
import { useLoader } from './loaderContext'

function renderWithLoader(children: ReactNode) {
  const queryClient = createQueryClient()

  return render(
    <QueryClientProvider client={queryClient}>
      <LoaderProvider>{children}</LoaderProvider>
    </QueryClientProvider>,
  )
}

function ManualLoaderButton() {
  const { showLoader } = useLoader()

  return (
    <button onClick={showLoader} type="button">
      Show loader
    </button>
  )
}

describe('LoaderOverlay', () => {
  it('renders nothing by default', () => {
    renderWithLoader(<LoaderOverlay />)

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('renders accessible loader status for manual loading', async () => {
    const user = userEvent.setup()

    renderWithLoader(
      <>
        <ManualLoaderButton />
        <LoaderOverlay />
      </>,
    )

    await user.click(screen.getByRole('button', { name: /show loader/i }))

    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument()
    expect(screen.getByTestId('loader-progress')).toBeInTheDocument()
  })

  it('renders while a query is fetching', async () => {
    let resolveQuery: ((value: string) => void) | undefined

    function PendingQuery() {
      useQuery({
        queryKey: ['loader-overlay-query-test'],
        queryFn: () =>
          new Promise<string>((resolve) => {
            resolveQuery = resolve
          }),
      })

      return null
    }

    renderWithLoader(
      <>
        <PendingQuery />
        <LoaderOverlay />
      </>,
    )

    expect(
      await screen.findByRole('status', { name: /loading/i }),
    ).toBeInTheDocument()

    resolveQuery?.('done')

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
  })

  it('renders while a mutation is pending', async () => {
    let resolveMutation: (() => void) | undefined

    function PendingMutation() {
      const { mutate } = useMutation({
        mutationFn: () =>
          new Promise<void>((resolve) => {
            resolveMutation = resolve
          }),
      })

      useEffect(() => {
        mutate()
      }, [mutate])

      return null
    }

    renderWithLoader(
      <>
        <PendingMutation />
        <LoaderOverlay />
      </>,
    )

    expect(
      await screen.findByRole('status', { name: /loading/i }),
    ).toBeInTheDocument()

    resolveMutation?.()

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
  })
})
