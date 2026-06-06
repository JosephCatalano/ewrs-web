import type { AccountInfo } from '@azure/msal-browser'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { AppConfig } from '../app/config'
import { ApiAuthError, ApiError, apiFetch } from './httpClient'

const mocks = vi.hoisted(() => ({
  getAppConfig: vi.fn(),
  getApiTokenRequest: vi.fn(),
  getMsalInstance: vi.fn(),
}))

vi.mock('../app/config', () => ({
  getAppConfig: mocks.getAppConfig,
}))

vi.mock('../auth/msalConfig', () => ({
  getApiTokenRequest: mocks.getApiTokenRequest,
  getMsalInstance: mocks.getMsalInstance,
}))

const msalAppConfig: AppConfig = {
  authMode: 'msal',
  apiBaseUrl: 'https://example.test/api/',
  aad: {
    clientId: '11111111-1111-4111-8111-111111111111',
    authority:
      'https://login.microsoftonline.com/22222222-2222-4222-8222-222222222222',
    redirectUri: 'https://example.test/auth',
    apiScope: 'api://srv_l_auth_ewrs/user_impersonation',
  },
  appInsights: {},
  version: '2026.06.06.1',
}

const account: AccountInfo = {
  homeAccountId: 'home-account-id',
  environment: 'login.microsoftonline.com',
  tenantId: '22222222-2222-4222-8222-222222222222',
  username: 'user@example.test',
  localAccountId: 'local-account-id',
}

const apiTokenRequest = {
  scopes: [msalAppConfig.aad.apiScope],
  redirectUri: msalAppConfig.aad.redirectUri,
}

describe('apiFetch', () => {
  let fetchMock: ReturnType<typeof vi.fn>
  let msalMock: {
    acquireTokenSilent: ReturnType<typeof vi.fn>
    getActiveAccount: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    msalMock = {
      acquireTokenSilent: vi
        .fn()
        .mockResolvedValue({ accessToken: 'msal-access-token' }),
      getActiveAccount: vi.fn().mockReturnValue(account),
    }

    vi.stubGlobal('fetch', fetchMock)
    mocks.getAppConfig.mockReturnValue(msalAppConfig)
    mocks.getApiTokenRequest.mockReturnValue(apiTokenRequest)
    mocks.getMsalInstance.mockReturnValue(msalMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.resetAllMocks()
  })

  it('adds a silent MSAL bearer token to API requests', async () => {
    await apiFetch('/buildings?enabled=true', {
      body: 'request body',
      headers: {
        Authorization: 'Bearer caller-provided-token',
        'X-Correlation-Id': 'test-correlation',
      },
      method: 'POST',
    })

    expect(msalMock.acquireTokenSilent).toHaveBeenCalledWith({
      ...apiTokenRequest,
      account,
    })

    const [url, request] = fetchMock.mock.calls[0] as [URL, RequestInit]
    const headers = request.headers as Headers

    expect(url.href).toBe('https://example.test/api/buildings?enabled=true')
    expect(request.method).toBe('POST')
    expect(request.body).toBe('request body')
    expect(headers.get('Authorization')).toBe('Bearer msal-access-token')
    expect(headers.get('X-Correlation-Id')).toBe('test-correlation')
  })

  it('uses the e2e token only when e2e-token auth mode is configured', async () => {
    mocks.getAppConfig.mockReturnValue({
      ...msalAppConfig,
      authMode: 'e2e-token',
      e2eToken: 'e2e-token',
    } satisfies AppConfig)

    await apiFetch('users/me')

    const [, request] = fetchMock.mock.calls[0] as [URL, RequestInit]
    const headers = request.headers as Headers

    expect(mocks.getMsalInstance).not.toHaveBeenCalled()
    expect(headers.get('Authorization')).toBe('Bearer e2e-token')
  })

  it('rejects API paths that are absolute or escape the API base URL', async () => {
    await expect(apiFetch('https://evil.example.test/users')).rejects.toThrow(
      /relative to VITE_API_BASE_URL/,
    )

    await expect(apiFetch('../users')).rejects.toThrow(
      /stay within VITE_API_BASE_URL/,
    )

    expect(fetchMock).not.toHaveBeenCalled()
    expect(msalMock.acquireTokenSilent).not.toHaveBeenCalled()
  })

  it('fails safely when no active MSAL account is available', async () => {
    msalMock.getActiveAccount.mockReturnValue(null)

    await expect(apiFetch('users/me')).rejects.toBeInstanceOf(ApiAuthError)

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('throws a safe API error for non-success responses', async () => {
    fetchMock.mockResolvedValue(
      new Response('server stack trace should not be exposed', { status: 500 }),
    )

    await expect(apiFetch('users/me')).rejects.toMatchObject({
      message: 'API request failed',
      name: 'ApiError',
      status: 500,
    } satisfies Partial<ApiError>)
  })
})
