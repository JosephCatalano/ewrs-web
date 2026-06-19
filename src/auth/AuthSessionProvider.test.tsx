import { InteractionStatus } from '@azure/msal-browser'
import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AuthSessionProvider } from './AuthSessionProvider'
import { useAuthSession } from './authSessionContext'

const mocks = vi.hoisted(() => ({ useMsal: vi.fn() }))

vi.mock('@azure/msal-react', () => ({ useMsal: mocks.useMsal }))

function Probe() {
  const { isAuthenticated } = useAuthSession()

  return <span>{isAuthenticated ? 'authenticated' : 'anonymous'}</span>
}

function mockMsal(options: {
  activeAccount?: object | null
  accounts?: object[]
  inProgress?: InteractionStatus
}) {
  let active = options.activeAccount ?? null
  const instance = {
    getActiveAccount: vi.fn(() => active),
    setActiveAccount: vi.fn((account: object) => {
      active = account
    }),
  }

  mocks.useMsal.mockReturnValue({
    instance,
    accounts: options.accounts ?? [],
    inProgress: options.inProgress ?? InteractionStatus.None,
  })

  return instance
}

function renderProbe() {
  return render(
    <AuthSessionProvider>
      <Probe />
    </AuthSessionProvider>,
  )
}

describe('AuthSessionProvider', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('promotes the first account to active and reports authenticated', () => {
    const account = { homeAccountId: 'a' }
    const instance = mockMsal({ activeAccount: null, accounts: [account] })

    renderProbe()

    expect(instance.setActiveAccount).toHaveBeenCalledWith(account)
    expect(screen.getByText('authenticated')).toBeInTheDocument()
  })

  it('keeps an account that is already active', () => {
    const account = { homeAccountId: 'a' }
    const instance = mockMsal({ activeAccount: account, accounts: [account] })

    renderProbe()

    expect(instance.setActiveAccount).not.toHaveBeenCalled()
    expect(screen.getByText('authenticated')).toBeInTheDocument()
  })

  it('stays anonymous while an interaction is in progress', () => {
    const instance = mockMsal({
      accounts: [{ homeAccountId: 'a' }],
      inProgress: InteractionStatus.HandleRedirect,
    })

    renderProbe()

    expect(instance.setActiveAccount).not.toHaveBeenCalled()
    expect(screen.getByText('anonymous')).toBeInTheDocument()
  })

  it('stays anonymous when there are no accounts', () => {
    mockMsal({ accounts: [] })

    renderProbe()

    expect(screen.getByText('anonymous')).toBeInTheDocument()
  })
})
