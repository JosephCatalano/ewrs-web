import { describe, expect, it } from 'vitest'

import { createAppConfig } from './config'

const validEnv = {
  VITE_AUTH_MODE: 'msal',
  VITE_API_BASE_URL: 'https://example.test/api/',
  VITE_AAD_CLIENT_ID: '11111111-1111-4111-8111-111111111111',
  VITE_AAD_AUTHORITY:
    'https://login.microsoftonline.com/22222222-2222-4222-8222-222222222222',
  VITE_AAD_REDIRECT_URI: 'https://example.test/auth',
  VITE_AAD_API_SCOPE: 'api://srv_d_auth_ewrs/user_impersonation',
  VITE_APP_INSIGHTS_KEY: '33333333-3333-4333-8333-333333333333',
  VITE_APP_INSIGHTS_CONNECTION_STRING: '',
  VITE_EWRS_VERSION: '2026.06.06.1',
  VITE_E2E_TOKEN: '',
}

describe('createAppConfig', () => {
  it('creates a typed app config from valid public environment values', () => {
    const config = createAppConfig(validEnv)

    expect(config).toEqual({
      authMode: 'msal',
      apiBaseUrl: 'https://example.test/api/',
      aad: {
        clientId: '11111111-1111-4111-8111-111111111111',
        authority:
          'https://login.microsoftonline.com/22222222-2222-4222-8222-222222222222',
        redirectUri: 'https://example.test/auth',
        apiScope: 'api://srv_d_auth_ewrs/user_impersonation',
      },
      appInsights: {
        instrumentationKey: '33333333-3333-4333-8333-333333333333',
      },
      version: '2026.06.06.1',
    })
  })

  it('fails safely when required values are missing', () => {
    expect(() =>
      createAppConfig({
        ...validEnv,
        VITE_API_BASE_URL: '',
        VITE_AAD_CLIENT_ID: '',
      }),
    ).toThrow(/VITE_API_BASE_URL is required; VITE_AAD_CLIENT_ID is required/)
  })

  it('rejects a token endpoint as the MSAL authority', () => {
    expect(() =>
      createAppConfig({
        ...validEnv,
        VITE_AAD_AUTHORITY:
          'https://login.microsoftonline.com/22222222-2222-4222-8222-222222222222/oauth2/v2.0/token',
      }),
    ).toThrow(/VITE_AAD_AUTHORITY must be the tenant authority URL/)
  })

  it('requires e2e tokens only for e2e token auth mode', () => {
    expect(() =>
      createAppConfig({
        ...validEnv,
        VITE_AUTH_MODE: 'e2e-token',
      }),
    ).toThrow(/VITE_E2E_TOKEN is required/)

    expect(() =>
      createAppConfig({
        ...validEnv,
        VITE_E2E_TOKEN: 'do-not-commit-real-tokens',
      }),
    ).toThrow(/VITE_E2E_TOKEN must be empty/)
  })
})
