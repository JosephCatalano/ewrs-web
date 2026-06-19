// Ported from the Angular MsalInteractionService. An interrupted redirect can
// leave a stale `msal.*interaction.status` entry in storage, which then blocks
// the next login with an "interaction_in_progress" error. Clear those orphaned
// keys before starting a fresh login — but never while an auth response is being
// processed in the URL, and never when a redirect's temp keys are still present
// (that means a real interaction is genuinely in flight).

const INTERACTION_STATUS_FRAGMENT = 'interaction.status'

function hasAuthResponseInUrl(): boolean {
  const search = window.location.search ?? ''
  const hash = window.location.hash ?? ''
  const url = `${search}&${hash}`

  return /(?:^|[&#?])(code|id_token|access_token|error)=/i.test(url)
}

function findKeys(
  storage: Storage,
  predicate: (key: string) => boolean,
): string[] {
  const keys: string[] = []

  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i)

    if (key && predicate(key)) {
      keys.push(key)
    }
  }

  return keys
}

function isMsalTempKey(key: string): boolean {
  if (!key.startsWith('msal.')) {
    return false
  }

  return (
    key.includes('request.origin') ||
    key.includes('urlHash') ||
    key.includes('request.params') ||
    key.includes('code.verifier') ||
    key.includes('request.native')
  )
}

function clearInteractionStatus(storage: Storage): void {
  const interactionKeys = findKeys(
    storage,
    (key) =>
      key.startsWith('msal.') && key.includes(INTERACTION_STATUS_FRAGMENT),
  )

  if (interactionKeys.length === 0) {
    return
  }

  if (findKeys(storage, isMsalTempKey).length > 0) {
    return
  }

  interactionKeys.forEach((key) => storage.removeItem(key))
}

export function clearStaleInteraction(): void {
  if (typeof window === 'undefined' || hasAuthResponseInUrl()) {
    return
  }

  for (const storage of [window.sessionStorage, window.localStorage]) {
    try {
      clearInteractionStatus(storage)
    } catch {
      // Storage can be blocked by browser settings; ignore.
    }
  }
}
