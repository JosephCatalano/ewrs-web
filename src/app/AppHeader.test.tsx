import type { UseQueryResult } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { User } from '../api/generated'
import { RoleConst } from '../auth/roles'
import { useCurrentUser } from '../auth/useCurrentUser'
import { ThemeProvider } from '../shared/theme'
import { AppHeader } from './AppHeader'

vi.mock('../auth/useCurrentUser', async (importActual) => {
  const actual = await importActual<typeof import('../auth/useCurrentUser')>()

  return { ...actual, useCurrentUser: vi.fn() }
})

const useCurrentUserMock = vi.mocked(useCurrentUser)

function mockCurrentUser(user: User | undefined) {
  useCurrentUserMock.mockReturnValue({
    data: user,
  } as UseQueryResult<User>)
}

function userWithRoles(roleTypeIds: number[]): User {
  return {
    displayName: 'Jordan Lee',
    userRoles: roleTypeIds.map((roleTypeId) => ({ roleTypeId })),
  }
}

function renderHeader() {
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <AppHeader />
      </ThemeProvider>
    </MemoryRouter>,
  )
}

describe('AppHeader', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('theme-light', 'theme-dark')
    localStorage.clear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('shows every authorized nav item for a SuperUser', () => {
    mockCurrentUser(userWithRoles([RoleConst.SuperUser]))
    renderHeader()

    const nav = screen.getByRole('navigation', { name: /primary/i })

    for (const label of [
      'Home',
      'My bookings',
      'Manage workstations',
      'Manage buildings',
      'Manage users',
      'Manage divisions',
      'Extract report',
    ]) {
      expect(
        screen.getByRole('link', { name: new RegExp(`^${label}$`, 'i') }),
      ).toBeInTheDocument()
    }

    // SuperUser does not see the SpaceAdmin-only "view" variants.
    expect(nav).not.toHaveTextContent('View buildings')
    expect(nav).not.toHaveTextContent('View divisions')
  })

  it('limits a SpaceAdmin to space management and view-only admin links', () => {
    mockCurrentUser(userWithRoles([RoleConst.SpaceAdmin]))
    renderHeader()

    expect(
      screen.getByRole('link', { name: /manage workstations/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /view buildings/i }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: /manage users/i }),
    ).not.toBeInTheDocument()
  })

  it('renders no navigation when there is no authenticated user', () => {
    mockCurrentUser(undefined)
    renderHeader()

    expect(
      screen.queryByRole('navigation', { name: /primary/i }),
    ).not.toBeInTheDocument()
  })

  it('opens the account menu and switches the theme preference', async () => {
    const user = userEvent.setup()
    mockCurrentUser(userWithRoles([RoleConst.User]))
    renderHeader()

    await user.click(screen.getByRole('button', { name: /jordan lee/i }))

    const darkOption = screen.getByRole('menuitemradio', { name: /dark/i })
    expect(darkOption).toHaveAttribute('aria-checked', 'false')

    await user.click(darkOption)

    expect(darkOption).toHaveAttribute('aria-checked', 'true')
    expect(document.documentElement).toHaveClass('theme-dark')
  })
})
