type ConfigEnv = Record<string, string | boolean | undefined>

export type AuthMode = 'msal' | 'e2e-token'

export type AppConfig = {
  authMode: AuthMode
  apiBaseUrl: string
  aad: {
    clientId: string
    authority: string
    redirectUri: string
    apiScope: string
  }
  appInsights: {
    instrumentationKey?: string
    connectionString?: string
  }
  version: string
  e2eToken?: string
}

const authModes = ['msal', 'e2e-token'] as const

const requiredKeys = [
  'VITE_AUTH_MODE',
  'VITE_API_BASE_URL',
  'VITE_AAD_CLIENT_ID',
  'VITE_AAD_AUTHORITY',
  'VITE_AAD_REDIRECT_URI',
  'VITE_AAD_API_SCOPE',
  'VITE_EWRS_VERSION',
] as const

function readEnv(env: ConfigEnv, key: string): string {
  const value = env[key]

  return typeof value === 'string' ? value.trim() : ''
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value)

    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  )
}

function validateEnv(env: ConfigEnv): string[] {
  const errors: string[] = []

  for (const key of requiredKeys) {
    if (!readEnv(env, key)) {
      errors.push(`${key} is required`)
    }
  }

  const authMode = readEnv(env, 'VITE_AUTH_MODE')
  if (authMode && !authModes.includes(authMode as AuthMode)) {
    errors.push('VITE_AUTH_MODE must be "msal" or "e2e-token"')
  }

  const apiBaseUrl = readEnv(env, 'VITE_API_BASE_URL')
  if (apiBaseUrl && !isValidUrl(apiBaseUrl)) {
    errors.push('VITE_API_BASE_URL must be an absolute HTTP(S) URL')
  }

  const clientId = readEnv(env, 'VITE_AAD_CLIENT_ID')
  if (clientId && !isUuid(clientId)) {
    errors.push('VITE_AAD_CLIENT_ID must be a valid UUID')
  }

  const authority = readEnv(env, 'VITE_AAD_AUTHORITY')
  if (authority) {
    if (!isValidUrl(authority)) {
      errors.push('VITE_AAD_AUTHORITY must be an absolute HTTP(S) URL')
    }

    // MSAL expects the tenant authority (…/{tenant-id}), not an OAuth token
    // endpoint. Catch the common misconfiguration early instead of failing
    // later inside MSAL with an opaque error.
    if (/\/oauth2\/v2\.0\/token\/?$/i.test(authority)) {
      errors.push('VITE_AAD_AUTHORITY must be the tenant authority URL')
    }
  }

  const redirectUri = readEnv(env, 'VITE_AAD_REDIRECT_URI')
  if (redirectUri && !isValidUrl(redirectUri)) {
    errors.push('VITE_AAD_REDIRECT_URI must be an absolute HTTP(S) URL')
  }

  const appInsightsKey = readEnv(env, 'VITE_APP_INSIGHTS_KEY')
  if (appInsightsKey && !isUuid(appInsightsKey)) {
    errors.push('VITE_APP_INSIGHTS_KEY must be a valid UUID when provided')
  }

  const e2eToken = readEnv(env, 'VITE_E2E_TOKEN')
  if (authMode === 'e2e-token' && !e2eToken) {
    errors.push('VITE_E2E_TOKEN is required when VITE_AUTH_MODE is e2e-token')
  }

  if (authMode === 'msal' && e2eToken) {
    errors.push('VITE_E2E_TOKEN must be empty when VITE_AUTH_MODE is msal')
  }

  return errors
}

export function createAppConfig(env: ConfigEnv): AppConfig {
  const errors = validateEnv(env)

  if (errors.length > 0) {
    throw new Error(
      `Invalid app environment configuration: ${errors.join('; ')}`,
    )
  }

  const authMode = readEnv(env, 'VITE_AUTH_MODE') as AuthMode
  const appInsightsKey = readEnv(env, 'VITE_APP_INSIGHTS_KEY')
  const appInsightsConnectionString = readEnv(
    env,
    'VITE_APP_INSIGHTS_CONNECTION_STRING',
  )
  const e2eToken = readEnv(env, 'VITE_E2E_TOKEN')

  return {
    authMode,
    apiBaseUrl: readEnv(env, 'VITE_API_BASE_URL'),
    aad: {
      clientId: readEnv(env, 'VITE_AAD_CLIENT_ID'),
      authority: readEnv(env, 'VITE_AAD_AUTHORITY'),
      redirectUri: readEnv(env, 'VITE_AAD_REDIRECT_URI'),
      apiScope: readEnv(env, 'VITE_AAD_API_SCOPE'),
    },
    appInsights: {
      ...(appInsightsKey ? { instrumentationKey: appInsightsKey } : {}),
      ...(appInsightsConnectionString
        ? { connectionString: appInsightsConnectionString }
        : {}),
    },
    version: readEnv(env, 'VITE_EWRS_VERSION'),
    ...(e2eToken ? { e2eToken } : {}),
  }
}

let cachedConfig: AppConfig | undefined

export function getAppConfig(): AppConfig {
  cachedConfig ??= createAppConfig(import.meta.env)

  return cachedConfig
}
