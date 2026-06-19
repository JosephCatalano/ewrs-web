import { useQuery } from '@tanstack/react-query'

import type { User } from '../api/generated'
import { apiFetch } from '../api/httpClient'
import { getAppConfig } from '../app/config'
import { getActiveAccountIfReady } from './msalConfig'

export const currentUserQueryKey = ['currentUser'] as const

// Swagger types the `GET /api/User/me` 200 body as `unknown`, so we treat the
// response as the generated `User` entity. Verify this shape against the API
// before depending on fields beyond id/displayName/userRoles/userStatusId.
async function fetchCurrentUser(): Promise<User> {
  const response = await apiFetch('User/me')

  return (await response.json()) as User
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

export function getUserRoleIds(user: User | undefined): number[] {
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
