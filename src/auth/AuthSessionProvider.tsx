import { InteractionStatus } from '@azure/msal-browser'
import { useMsal } from '@azure/msal-react'
import { useEffect, useMemo, type ReactNode } from 'react'

import { AuthSessionContext } from './authSessionContext'

interface AuthSessionProviderProps {
  children: ReactNode
}

export function AuthSessionProvider({ children }: AuthSessionProviderProps) {
  const { instance, accounts, inProgress } = useMsal()

  useEffect(() => {
    if (inProgress !== InteractionStatus.None) {
      return
    }

    // Angular active-account fallback: after a redirect MSAL may hold accounts
    // without an active one selected, so promote the first account.
    if (!instance.getActiveAccount() && accounts.length > 0) {
      instance.setActiveAccount(accounts[0])
    }
  }, [accounts, inProgress, instance])

  // Derived (not effect state): the user is authenticated once a redirect has
  // settled and at least one account exists. useCurrentUser gates its /me fetch
  // on this; the API client falls back to the first account if the active one
  // is not selected yet, so there is no token race on the first render.
  const isAuthenticated =
    inProgress === InteractionStatus.None && accounts.length > 0

  const value = useMemo(() => ({ isAuthenticated }), [isAuthenticated])

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  )
}
