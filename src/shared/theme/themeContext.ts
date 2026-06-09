import { createContext, useContext } from 'react'

export type ThemePreference = 'system' | 'light' | 'dark'
export type EffectiveTheme = 'light' | 'dark'

export interface ThemeContextValue {
  preference: ThemePreference
  effectiveTheme: EffectiveTheme
  setThemePreference: (preference: ThemePreference) => void
  setSystemTheme: () => void
  setLightTheme: () => void
  setDarkTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
)

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}
