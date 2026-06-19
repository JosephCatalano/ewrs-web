import { createContext, useContext } from 'react'

export interface AuthSessionValue {
  isAuthenticated: boolean
}

// Defaults to signed-out so components and stories that render without the
// provider (and without MSAL) behave as logged-out instead of crashing.
export const AuthSessionContext = createContext<AuthSessionValue>({
  isAuthenticated: false,
})

export function useAuthSession(): AuthSessionValue {
  return useContext(AuthSessionContext)
}
