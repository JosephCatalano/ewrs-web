import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { LoaderProvider } from './LoaderProvider'
import { useLoader } from './loaderContext'

function ManualLoaderControls() {
  const { activeManualLoaders, hideLoader, isManuallyLoading, showLoader } =
    useLoader()

  return (
    <main>
      <p>Manual loader count: {activeManualLoaders}</p>
      <p>{isManuallyLoading ? 'Manual loader active' : 'Manual loader idle'}</p>
      <button onClick={showLoader} type="button">
        Show loader
      </button>
      <button onClick={hideLoader} type="button">
        Hide loader
      </button>
    </main>
  )
}

describe('LoaderProvider', () => {
  it('renders children', () => {
    render(
      <LoaderProvider>
        <main>Loader provider child</main>
      </LoaderProvider>,
    )

    expect(screen.getByText(/loader provider child/i)).toBeInTheDocument()
  })

  it('tracks manual loader show and hide calls', async () => {
    const user = userEvent.setup()

    render(
      <LoaderProvider>
        <ManualLoaderControls />
      </LoaderProvider>,
    )

    expect(screen.getByText(/manual loader idle/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /show loader/i }))
    await user.click(screen.getByRole('button', { name: /show loader/i }))

    expect(screen.getByText('Manual loader count: 2')).toBeInTheDocument()
    expect(screen.getByText(/manual loader active/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /hide loader/i }))

    expect(screen.getByText('Manual loader count: 1')).toBeInTheDocument()
    expect(screen.getByText(/manual loader active/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /hide loader/i }))

    expect(screen.getByText('Manual loader count: 0')).toBeInTheDocument()
    expect(screen.getByText(/manual loader idle/i)).toBeInTheDocument()
  })

  it('does not let extra hide calls make the manual loader count negative', async () => {
    const user = userEvent.setup()

    render(
      <LoaderProvider>
        <ManualLoaderControls />
      </LoaderProvider>,
    )

    await user.click(screen.getByRole('button', { name: /hide loader/i }))

    expect(screen.getByText('Manual loader count: 0')).toBeInTheDocument()
    expect(screen.getByText(/manual loader idle/i)).toBeInTheDocument()
  })

  it('clears the manual loader when a wrapped operation fails', async () => {
    const user = userEvent.setup()
    let rejectOperation: ((error: Error) => void) | undefined

    function FailingOperationControls() {
      const { isManuallyLoading, withLoader } = useLoader()

      return (
        <main>
          <p>
            {isManuallyLoading ? 'Manual loader active' : 'Manual loader idle'}
          </p>
          <button
            onClick={() => {
              void withLoader(
                () =>
                  new Promise<void>((_resolve, reject) => {
                    rejectOperation = reject
                  }),
              ).catch(() => undefined)
            }}
            type="button"
          >
            Run failing operation
          </button>
        </main>
      )
    }

    render(
      <LoaderProvider>
        <FailingOperationControls />
      </LoaderProvider>,
    )

    await user.click(
      screen.getByRole('button', { name: /run failing operation/i }),
    )

    expect(screen.getByText(/manual loader active/i)).toBeInTheDocument()

    rejectOperation?.(new Error('Failed operation'))

    await waitFor(() => {
      expect(screen.getByText(/manual loader idle/i)).toBeInTheDocument()
    })
  })
})
