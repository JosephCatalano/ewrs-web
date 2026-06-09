import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AlertHost } from './AlertHost'
import { AlertProvider } from './AlertProvider'
import { useAlert, type AlertInfo } from './alertContext'

function ShowAlertButton({ alert }: { alert: AlertInfo }) {
  const { showAlert } = useAlert()

  return (
    <button onClick={() => showAlert(alert)} type="button">
      Show alert
    </button>
  )
}

describe('AlertHost', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn()
  })

  it('renders nothing when there is no alert', () => {
    render(
      <AlertProvider>
        <AlertHost />
      </AlertProvider>,
    )

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('clears a closeable alert from the close button', async () => {
    const user = userEvent.setup()

    render(
      <AlertProvider>
        <ShowAlertButton
          alert={{
            title: 'Booking cancelled',
            message: 'The booking was cancelled.',
            type: 'info',
            closeable: true,
          }}
        />
        <AlertHost />
      </AlertProvider>,
    )

    await user.click(screen.getByRole('button', { name: /show alert/i }))
    expect(screen.getByRole('alert')).toHaveTextContent('Booking cancelled')

    await user.click(screen.getByRole('button', { name: /dismiss alert/i }))

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('does not show a close button for a non-closeable alert', async () => {
    const user = userEvent.setup()

    render(
      <AlertProvider>
        <ShowAlertButton
          alert={{
            title: 'Action required',
            message: 'Review the booking details.',
            type: 'warning',
            closeable: false,
          }}
        />
        <AlertHost />
      </AlertProvider>,
    )

    await user.click(screen.getByRole('button', { name: /show alert/i }))

    expect(screen.getByRole('alert')).toHaveTextContent('Action required')
    expect(
      screen.queryByRole('button', { name: /dismiss alert/i }),
    ).not.toBeInTheDocument()
  })

  it('only renders a targeted alert in the matching host', async () => {
    const user = userEvent.setup()

    render(
      <AlertProvider>
        <ShowAlertButton
          alert={{
            title: 'Settings saved',
            message: 'Notification preferences were saved.',
            type: 'success',
            targetId: 'settings',
          }}
        />
        <div data-testid="global-host">
          <AlertHost />
        </div>
        <div data-testid="settings-host">
          <AlertHost targetId="settings" />
        </div>
        <div data-testid="profile-host">
          <AlertHost targetId="profile" />
        </div>
      </AlertProvider>,
    )

    await user.click(screen.getByRole('button', { name: /show alert/i }))

    expect(
      within(screen.getByTestId('global-host')).queryByRole('alert'),
    ).not.toBeInTheDocument()
    expect(
      within(screen.getByTestId('settings-host')).getByRole('alert'),
    ).toHaveTextContent('Settings saved')
    expect(
      within(screen.getByTestId('profile-host')).queryByRole('alert'),
    ).not.toBeInTheDocument()
  })

  it('renders message strings as text instead of HTML', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <AlertProvider>
        <ShowAlertButton
          alert={{
            title: 'Unsafe message test',
            message: '<strong>Error</strong>',
            type: 'error',
          }}
        />
        <AlertHost />
      </AlertProvider>,
    )

    await user.click(screen.getByRole('button', { name: /show alert/i }))

    expect(screen.getByText('<strong>Error</strong>')).toBeInTheDocument()
    expect(container.querySelector('strong')).toBeNull()
  })
})
