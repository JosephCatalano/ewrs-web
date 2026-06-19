import { useQuery } from '@tanstack/react-query'

import { readApiResult } from '../api/apiResult'
import type { User } from '../api/generated'
import { apiFetch } from '../api/httpClient'
import { getAppConfig } from '../app/config'
import { getActiveAccountIfReady } from './msalConfig'

export const currentUserQueryKey = ['currentUser'] as const

// `GET /api/User/me` returns an ApiResult envelope; the user is in `value`
// (the Angular AuthGuard/CurrentUserService both read `data.value`). Swagger
// types the body as `unknown`, so the `User` shape is assumed and should be
// verified against the live API.
async function fetchCurrentUser(): Promise<User | null> {
  const response = await apiFetch('User/me')

  return readApiResult<User>(response)
}

// Only load the current user once an auth context exists. Guarded so component
// renders (and tests) never trigger MSAL construction or a /me call before
// login. The config read is wrapped because getAppConfig throws on invalid
// environments, which must not break rendering.
function hasAuthContext(): boolean {
  try {
    const config = getAppConfig()

    if (config.authMode === 'e2e-token') {
      return Boolean(config.e2eToken)
    }

    return Boolean(getActiveAccountIfReady())
  } catch {
    return false
  }
}

export function getUserRoleIds(user: User | null | undefined): number[] {
  return (user?.userRoles ?? [])
    .map((role) => role.roleTypeId)
    .filter((roleId): roleId is number => typeof roleId === 'number')
}

export function useCurrentUser() {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: fetchCurrentUser,
    enabled: hasAuthContext(),
    staleTime: 5 * 60 * 1000,
  })
}
