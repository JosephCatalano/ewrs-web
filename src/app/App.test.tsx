import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('App', () => {
  it('renders the migration scaffold shell', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /scaffold ready/i,
      }),
    ).toBeInTheDocument()

    expect(screen.getByText(/ewrs react migration/i)).toBeInTheDocument()
    expect(
      screen.getByText(/the vite react shell is in place/i),
    ).toBeInTheDocument()
  })
})
