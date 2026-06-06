import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('App', () => {
  it('renders the migration shell', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /react shell ready/i,
      }),
    ).toBeInTheDocument()

    expect(screen.getByText(/ewrs react migration/i)).toBeInTheDocument()
    expect(
      screen.getByText(/the vite react shell is ready for phase 2/i),
    ).toBeInTheDocument()
  })
})
