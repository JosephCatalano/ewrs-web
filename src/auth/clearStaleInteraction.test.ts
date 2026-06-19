import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { clearStaleInteraction } from './clearStaleInteraction'

describe('clearStaleInteraction', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    window.history.replaceState({}, '', '/home')
  })

  afterEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
  })

  it('removes orphaned interaction-status keys with no in-flight redirect', () => {
    window.localStorage.setItem('msal.abc.interaction.status', 'interaction')
    window.sessionStorage.setItem('msal.def.interaction.status', 'interaction')

    clearStaleInteraction()

    expect(
      window.localStorage.getItem('msal.abc.interaction.status'),
    ).toBeNull()
    expect(
      window.sessionStorage.getItem('msal.def.interaction.status'),
    ).toBeNull()
  })

  it('keeps interaction status while a redirect still has temp keys', () => {
    window.localStorage.setItem('msal.abc.interaction.status', 'interaction')
    window.localStorage.setItem('msal.abc.request.params', 'pending')

    clearStaleInteraction()

    expect(window.localStorage.getItem('msal.abc.interaction.status')).toBe(
      'interaction',
    )
  })

  it('does nothing while an auth response is present in the URL', () => {
    window.history.replaceState({}, '', '/auth#code=abc123')
    window.localStorage.setItem('msal.abc.interaction.status', 'interaction')

    clearStaleInteraction()

    expect(window.localStorage.getItem('msal.abc.interaction.status')).toBe(
      'interaction',
    )
  })

  it('leaves unrelated keys untouched', () => {
    window.localStorage.setItem('themePreference', 'dark')

    clearStaleInteraction()

    expect(window.localStorage.getItem('themePreference')).toBe('dark')
  })
})
