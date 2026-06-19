import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { AppRoutes } from './AppRoutes'

function renderAt(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

describe('AppRoutes', () => {
  it('renders a placeholder titled for the matched route', () => {
    renderAt('/reports/workstation-occupancy')

    expect(
      screen.getByRole('heading', { level: 1, name: /occupancy report/i }),
    ).toBeInTheDocument()
  })

  it('preserves parameterized admin routes', () => {
    renderAt('/buildings/12/floors/edit/3')

    expect(
      screen.getByRole('heading', { level: 1, name: /edit floor/i }),
    ).toBeInTheDocument()
  })

  it('redirects unknown routes to home', () => {
    renderAt('/does-not-exist')

    expect(
      screen.getByRole('heading', { level: 1, name: /^home$/i }),
    ).toBeInTheDocument()
  })
})
