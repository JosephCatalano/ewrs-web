import { BrowserCacheLocation, LogLevel } from '@azure/msal-browser'
import { describe, expect, it } from 'vitest'

import type { AppConfig } from '../app/config'
import {
  createApiTokenRequest,
  createGraphUserRequest,
  createLoginRequest,
  createMsalConfiguration,
} from './msalConfig'

const appConfig: AppConfig = {
  authMode: 'msal',
  apiBaseUrl: 'https://example.test/api/',
  aad: {
    clientId: '11111111-1111-4111-8111-111111111111',
    authority:
      'https://login.microsoftonline.com/22222222-2222-4222-8222-222222222222',
    redirectUri: 'https://example.test/auth',
    apiScope: 'api://srv_d_auth_ewrs/user_impersonation',
  },
  appInsights: {},
  version: '2026.06.06.1',
}

describe('MSAL config helpers', () => {
  it('creates a browser MSAL configuration from public app config', () => {
    const config = createMsalConfiguration(appConfig)

    expect(config.auth).toEqual({
      clientId: appConfig.aad.clientId,
      authority: appConfig.aad.authority,
      redirectUri: appConfig.aad.redirectUri,
    })
    expect(config.cache?.cacheLocation).toBe(BrowserCacheLocation.LocalStorage)
    expect(config.system?.loggerOptions?.logLevel).toBe(LogLevel.Warning)
    expect(config.system?.loggerOptions?.piiLoggingEnabled).toBe(false)
    expect(config.telemetry?.application).toEqual({
      appName: 'EWRS Web',
      appVersion: appConfig.version,
    })
  })

  it('requests Graph and EWRS API scopes during login', () => {
    expect(createLoginRequest(appConfig)).toEqual({
      scopes: ['user.read', appConfig.aad.apiScope],
    })
  })

  it('keeps API and Graph token requests scoped separately', () => {
    expect(createApiTokenRequest(appConfig)).toEqual({
      scopes: [appConfig.aad.apiScope],
      redirectUri: appConfig.aad.redirectUri,
    })
    expect(createGraphUserRequest(appConfig)).toEqual({
      scopes: ['user.read'],
      redirectUri: appConfig.aad.redirectUri,
    })
  })
})
