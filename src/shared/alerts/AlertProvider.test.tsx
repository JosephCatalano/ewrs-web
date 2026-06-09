import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AlertHost } from './AlertHost'
import { AlertProvider } from './AlertProvider'
import { useAlert } from './alertContext'

function AlertControls() {
  const { clearAlert, showAlert } = useAlert()

  return (
    <>
      <button
        onClick={() =>
          showAlert({
            title: 'Settings saved',
            message: 'Your changes were saved.',
            type: 'success',
          })
        }
        type="button"
      >
        Show success
      </button>
      <button onClick={clearAlert} type="button">
        Clear alert
      </button>
    </>
  )
}

describe('AlertProvider', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn()
  })

  it('renders children', () => {
    render(
      <AlertProvider>
        <main>Alert provider child</main>
      </AlertProvider>,
    )

    expect(screen.getByText(/alert provider child/i)).toBeInTheDocument()
  })

  it('shows an alert and scrolls to the top', async () => {
    const user = userEvent.setup()

    render(
      <AlertProvider>
        <AlertControls />
        <AlertHost />
      </AlertProvider>,
    )

    await user.click(screen.getByRole('button', { name: /show success/i }))

    expect(screen.getByRole('alert')).toHaveTextContent('Settings saved')
    expect(screen.getByText('Your changes were saved.')).toBeInTheDocument()
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    })
  })

  it('clears the current alert', async () => {
    const user = userEvent.setup()

    render(
      <AlertProvider>
        <AlertControls />
        <AlertHost />
      </AlertProvider>,
    )

    await user.click(screen.getByRole('button', { name: /show success/i }))
    expect(screen.getByRole('alert')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /clear alert/i }))

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
