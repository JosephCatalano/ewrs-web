import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { User } from '../api/generated'
import { getUserRoleIds } from './useCurrentUser'

const mocks = vi.hoisted(() => ({
  apiFetch: vi.fn(),
}))

vi.mock('../api/httpClient', () => ({ apiFetch: mocks.apiFetch }))

describe('getUserRoleIds', () => {
  it('maps user roles to numeric ids and drops missing ones', () => {
    const user: User = {
      userRoles: [{ roleTypeId: 1 }, { roleTypeId: 20 }, {}],
    }

    expect(getUserRoleIds(user)).toEqual([1, 20])
  })

  it('returns an empty list when there is no user or no roles', () => {
    expect(getUserRoleIds(undefined)).toEqual([])
    expect(getUserRoleIds(null)).toEqual([])
    expect(getUserRoleIds({ userRoles: null })).toEqual([])
  })
})

describe('current user fetch', () => {
  beforeEach(() => {
    vi.resetModules()
    mocks.apiFetch.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('unwraps the ApiResult envelope and returns the user value', async () => {
    const user: User = { id: 7, displayName: 'Sam Patel' }
    mocks.apiFetch.mockResolvedValue(
      new Response(JSON.stringify({ value: user, message: null }), {
        status: 200,
      }),
    )

    const { readApiResult } = await import('../api/apiResult')
    const response = await mocks.apiFetch('User/me')

    expect(mocks.apiFetch).toHaveBeenCalledWith('User/me')
    await expect(readApiResult<User>(response)).resolves.toEqual(user)
  })
})
