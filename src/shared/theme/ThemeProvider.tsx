import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  ThemeContext,
  type EffectiveTheme,
  type ThemePreference,
} from './themeContext'

interface ThemeProviderProps {
  children: ReactNode
}

const THEME_STORAGE_KEY = 'themePreference'
const LEGACY_DARK_MODE_STORAGE_KEY = 'darkMode'
const SYSTEM_DARK_QUERY = '(prefers-color-scheme: dark)'

function isThemePreference(value: string | null): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark'
}

function getStorageItem(key: string) {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function setStorageItem(key: string, value: string) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Theme still works in memory when browser storage is unavailable.
  }
}

function getStoredThemePreference(): ThemePreference {
  const storedPreference = getStorageItem(THEME_STORAGE_KEY)

  if (isThemePreference(storedPreference)) {
    return storedPreference
  }

  const legacyDarkMode = getStorageItem(LEGACY_DARK_MODE_STORAGE_KEY)

  if (legacyDarkMode === '1' || legacyDarkMode === '0') {
    const migratedPreference: ThemePreference =
      legacyDarkMode === '1' ? 'dark' : 'light'

    setStorageItem(THEME_STORAGE_KEY, migratedPreference)

    return migratedPreference
  }

  return 'system'
}

function getSystemPrefersDark() {
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function'
  ) {
    return false
  }

  return window.matchMedia(SYSTEM_DARK_QUERY).matches
}

function getEffectiveTheme(
  preference: ThemePreference,
  systemPrefersDark: boolean,
): EffectiveTheme {
  if (preference === 'system') {
    return systemPrefersDark ? 'dark' : 'light'
  }

  return preference
}

function persistThemePreference(preference: ThemePreference) {
  setStorageItem(THEME_STORAGE_KEY, preference)

  if (preference === 'dark' || preference === 'light') {
    setStorageItem(
      LEGACY_DARK_MODE_STORAGE_KEY,
      preference === 'dark' ? '1' : '0',
    )
  }
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [preference, setPreference] = useState<ThemePreference>(
    getStoredThemePreference,
  )
  const [systemPrefersDark, setSystemPrefersDark] =
    useState(getSystemPrefersDark)

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    ) {
      return
    }

    const mediaQuery = window.matchMedia(SYSTEM_DARK_QUERY)
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setSystemPrefersDark(event.matches)
    }

    handleChange(mediaQuery)

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange)

      return () => {
        mediaQuery.removeEventListener('change', handleChange)
      }
    }

    mediaQuery.addListener(handleChange)

    return () => {
      mediaQuery.removeListener(handleChange)
    }
  }, [])

  const effectiveTheme = getEffectiveTheme(preference, systemPrefersDark)

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    const root = document.documentElement
    const body = document.body

    root.classList.toggle('theme-light', effectiveTheme === 'light')
    root.classList.toggle('theme-dark', effectiveTheme === 'dark')
    root.dataset.theme = effectiveTheme
    body.classList.toggle('dark-mode', effectiveTheme === 'dark')

    return () => {
      root.classList.remove('theme-light', 'theme-dark')
      delete root.dataset.theme
      body.classList.remove('dark-mode')
    }
  }, [effectiveTheme])

  const setThemePreference = useCallback((nextPreference: ThemePreference) => {
    setPreference(nextPreference)
    persistThemePreference(nextPreference)
  }, [])

  const setSystemTheme = useCallback(() => {
    setThemePreference('system')
  }, [setThemePreference])

  const setLightTheme = useCallback(() => {
    setThemePreference('light')
  }, [setThemePreference])

  const setDarkTheme = useCallback(() => {
    setThemePreference('dark')
  }, [setThemePreference])

  const value = useMemo(
    () => ({
      preference,
      effectiveTheme,
      setThemePreference,
      setSystemTheme,
      setLightTheme,
      setDarkTheme,
    }),
    [
      effectiveTheme,
      preference,
      setDarkTheme,
      setLightTheme,
      setSystemTheme,
      setThemePreference,
    ],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
