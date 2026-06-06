import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AppProviders } from './AppProviders'

describe('AppProviders', () => {
  it('renders children inside app providers', () => {
    render(
      <AppProviders>
        <main>Provider smoke test</main>
      </AppProviders>,
    )

    expect(screen.getByText(/provider smoke test/i)).toBeInTheDocument()
  })
})
