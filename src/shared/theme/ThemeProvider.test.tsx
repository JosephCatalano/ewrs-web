import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from 'vitest'

import { ThemeProvider } from './ThemeProvider'
import { useTheme } from './themeContext'

const systemDarkQuery = '(prefers-color-scheme: dark)'

interface MatchMediaMock {
  setMatches: (matches: boolean) => void
}

function createMatchMediaMock(initialMatches: boolean): MatchMediaMock {
  let matches = initialMatches
  const listeners = new Set<EventListenerOrEventListenerObject>()

  const createEvent = () =>
    ({
      matches,
      media: systemDarkQuery,
    }) as MediaQueryListEvent

  const notifyListener = (listener: EventListenerOrEventListenerObject) => {
    const event = createEvent()

    if (typeof listener === 'function') {
      listener(event)
      return
    }

    listener.handleEvent(event)
  }

  const mediaQueryList = {
    get matches() {
      return matches
    },
    media: systemDarkQuery,
    onchange: null,
    addEventListener: (
      type: string,
      listener: EventListenerOrEventListenerObject,
    ) => {
      if (type === 'change') {
        listeners.add(listener)
      }
    },
    removeEventListener: (
      type: string,
      listener: EventListenerOrEventListenerObject,
    ) => {
      if (type === 'change') {
        listeners.delete(listener)
      }
    },
    addListener: (listener: EventListenerOrEventListenerObject) => {
      listeners.add(listener)
    },
    removeListener: (listener: EventListenerOrEventListenerObject) => {
      listeners.delete(listener)
    },
    dispatchEvent: () => true,
  } as MediaQueryList

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn().mockReturnValue(mediaQueryList),
  })

  return {
    setMatches: (nextMatches: boolean) => {
      matches = nextMatches
      listeners.forEach(notifyListener)
    },
  }
}

function ThemeControls() {
  const {
    effectiveTheme,
    preference,
    setDarkTheme,
    setLightTheme,
    setSystemTheme,
  } = useTheme()

  return (
    <main>
      <p>Preference: {preference}</p>
      <p>Effective theme: {effectiveTheme}</p>
      <button onClick={setLightTheme} type="button">
        Use light theme
      </button>
      <button onClick={setDarkTheme} type="button">
        Use dark theme
      </button>
      <button onClick={setSystemTheme} type="button">
        Use system theme
      </button>
    </main>
  )
}

function UseThemeOutsideProviderProbe() {
  useTheme()

  return null
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('theme-light', 'theme-dark')
    delete document.documentElement.dataset.theme
    document.body.classList.remove('dark-mode')
    createMatchMediaMock(false)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders children', () => {
    render(
      <ThemeProvider>
        <main>Theme provider child</main>
      </ThemeProvider>,
    )

    expect(screen.getByText(/theme provider child/i)).toBeInTheDocument()
  })

  it('defaults to system preference and applies the light theme when the system is light', async () => {
    render(
      <ThemeProvider>
        <ThemeControls />
      </ThemeProvider>,
    )

    expect(screen.getByText('Preference: system')).toBeInTheDocument()
    expect(screen.getByText('Effective theme: light')).toBeInTheDocument()

    await waitFor(() => {
      expect(document.documentElement).toHaveClass('theme-light')
    })
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
    expect(document.body).not.toHaveClass('dark-mode')
  })

  it('uses the system dark theme when system preference is dark', async () => {
    createMatchMediaMock(true)

    render(
      <ThemeProvider>
        <ThemeControls />
      </ThemeProvider>,
    )

    expect(screen.getByText('Preference: system')).toBeInTheDocument()
    expect(screen.getByText('Effective theme: dark')).toBeInTheDocument()

    await waitFor(() => {
      expect(document.documentElement).toHaveClass('theme-dark')
    })
    expect(document.body).toHaveClass('dark-mode')
  })

  it('stores explicit light and dark preferences', async () => {
    const user = userEvent.setup()

    render(
      <ThemeProvider>
        <ThemeControls />
      </ThemeProvider>,
    )

    await user.click(screen.getByRole('button', { name: /use dark theme/i }))

    expect(screen.getByText('Preference: dark')).toBeInTheDocument()
    expect(screen.getByText('Effective theme: dark')).toBeInTheDocument()
    expect(localStorage.getItem('themePreference')).toBe('dark')
    expect(localStorage.getItem('darkMode')).toBe('1')
    expect(document.body).toHaveClass('dark-mode')

    await user.click(screen.getByRole('button', { name: /use light theme/i }))

    expect(screen.getByText('Preference: light')).toBeInTheDocument()
    expect(screen.getByText('Effective theme: light')).toBeInTheDocument()
    expect(localStorage.getItem('themePreference')).toBe('light')
    expect(localStorage.getItem('darkMode')).toBe('0')
    expect(document.body).not.toHaveClass('dark-mode')
  })

  it('reads a valid stored preference', () => {
    localStorage.setItem('themePreference', 'dark')

    render(
      <ThemeProvider>
        <ThemeControls />
      </ThemeProvider>,
    )

    expect(screen.getByText('Preference: dark')).toBeInTheDocument()
    expect(screen.getByText('Effective theme: dark')).toBeInTheDocument()
  })

  it('falls back to system when stored preference is invalid', () => {
    localStorage.setItem('themePreference', 'invalid')

    render(
      <ThemeProvider>
        <ThemeControls />
      </ThemeProvider>,
    )

    expect(screen.getByText('Preference: system')).toBeInTheDocument()
    expect(screen.getByText('Effective theme: light')).toBeInTheDocument()
  })

  it('migrates the legacy darkMode storage value', () => {
    localStorage.setItem('darkMode', '1')

    render(
      <ThemeProvider>
        <ThemeControls />
      </ThemeProvider>,
    )

    expect(screen.getByText('Preference: dark')).toBeInTheDocument()
    expect(localStorage.getItem('themePreference')).toBe('dark')
  })

  it('updates when the system preference changes in system mode', async () => {
    const matchMediaMock = createMatchMediaMock(false)

    render(
      <ThemeProvider>
        <ThemeControls />
      </ThemeProvider>,
    )

    expect(screen.getByText('Effective theme: light')).toBeInTheDocument()

    matchMediaMock.setMatches(true)

    expect(await screen.findByText('Effective theme: dark')).toBeInTheDocument()
    expect(document.body).toHaveClass('dark-mode')
  })

  it('keeps explicit light preference when the system preference changes', async () => {
    const user = userEvent.setup()
    const matchMediaMock = createMatchMediaMock(false)

    render(
      <ThemeProvider>
        <ThemeControls />
      </ThemeProvider>,
    )

    await user.click(screen.getByRole('button', { name: /use light theme/i }))

    matchMediaMock.setMatches(true)

    expect(screen.getByText('Preference: light')).toBeInTheDocument()
    expect(screen.getByText('Effective theme: light')).toBeInTheDocument()
    expect(document.body).not.toHaveClass('dark-mode')
  })

  it('keeps theme state in memory when localStorage writes fail', async () => {
    const user = userEvent.setup()
    const setItemMock = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('Storage unavailable')
      })

    render(
      <ThemeProvider>
        <ThemeControls />
      </ThemeProvider>,
    )

    await user.click(screen.getByRole('button', { name: /use dark theme/i }))

    expect(setItemMock).toHaveBeenCalled()
    expect(screen.getByText('Preference: dark')).toBeInTheDocument()
    expect(screen.getByText('Effective theme: dark')).toBeInTheDocument()
  })

  it('throws when useTheme is called outside ThemeProvider', () => {
    const consoleErrorMock = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)

    expect(() => render(<UseThemeOutsideProviderProbe />)).toThrow(
      /useTheme must be used within a ThemeProvider/i,
    )
    ;(consoleErrorMock as Mock).mockRestore()
  })
})
