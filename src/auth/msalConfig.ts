import {
  BrowserCacheLocation,
  LogLevel,
  PublicClientApplication,
  type AccountInfo,
  type Configuration,
  type RedirectRequest,
  type SilentRequest,
} from '@azure/msal-browser'

import { getAppConfig, type AppConfig } from '../app/config'

const graphUserReadScope = 'user.read'

export function createMsalConfiguration(appConfig: AppConfig): Configuration {
  return {
    auth: {
      clientId: appConfig.aad.clientId,
      authority: appConfig.aad.authority,
      redirectUri: appConfig.aad.redirectUri,
    },
    cache: {
      // Preserve the Angular/MSAL cache location until security owners approve a change.
      cacheLocation: BrowserCacheLocation.LocalStorage,
    },
    system: {
      loggerOptions: {
        logLevel: LogLevel.Warning,
        piiLoggingEnabled: false,
        loggerCallback: (level, message, containsPii) => {
          if (containsPii || !import.meta.env.DEV) {
            return
          }

          if (level === LogLevel.Error) {
            console.error(`[MSAL] ${message}`)
          } else if (level === LogLevel.Warning) {
            console.warn(`[MSAL] ${message}`)
          }
        },
      },
    },
    telemetry: {
      application: {
        appName: 'EWRS Web',
        appVersion: appConfig.version,
      },
    },
  }
}

export function createLoginRequest(appConfig: AppConfig): RedirectRequest {
  return {
    scopes: [graphUserReadScope, appConfig.aad.apiScope],
  }
}

export function createApiTokenRequest(appConfig: AppConfig): SilentRequest {
  return {
    scopes: [appConfig.aad.apiScope],
    redirectUri: appConfig.aad.redirectUri,
  }
}

export function createGraphUserRequest(appConfig: AppConfig): SilentRequest {
  return {
    scopes: [graphUserReadScope],
    redirectUri: appConfig.aad.redirectUri,
  }
}

let cachedMsalConfiguration: Configuration | undefined
let cachedMsalInstance: PublicClientApplication | undefined

export function getMsalConfiguration(): Configuration {
  cachedMsalConfiguration ??= createMsalConfiguration(getAppConfig())

  return cachedMsalConfiguration
}

export function getMsalInstance(): PublicClientApplication {
  cachedMsalInstance ??= new PublicClientApplication(getMsalConfiguration())

  return cachedMsalInstance
}

// Reads the active account without constructing MSAL. Used by render-time
// auth checks (e.g. useCurrentUser) so they cannot trigger MSAL setup or
// network work before the provider has initialized the instance.
export function getActiveAccountIfReady(): AccountInfo | null {
  return cachedMsalInstance?.getActiveAccount() ?? null
}

export function getLoginRequest(): RedirectRequest {
  return createLoginRequest(getAppConfig())
}

export function getApiTokenRequest(): SilentRequest {
  return createApiTokenRequest(getAppConfig())
}

export function getGraphUserRequest(): SilentRequest {
  return createGraphUserRequest(getAppConfig())
}
