import { getAppConfig } from '../app/config'
import { getApiTokenRequest, getMsalInstance } from '../auth/msalConfig'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message = 'API request failed') {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export class ApiAuthError extends Error {
  constructor(message = 'API authentication is not available') {
    super(message)
    this.name = 'ApiAuthError'
  }
}

function createApiUrl(path: string, apiBaseUrl: string): URL {
  if (/^[a-z][a-z\d+\-.]*:/i.test(path) || path.startsWith('//')) {
    throw new TypeError('API path must be relative to VITE_API_BASE_URL')
  }

  const baseUrl = new URL(apiBaseUrl)
  const basePath = baseUrl.pathname.endsWith('/')
    ? baseUrl.pathname
    : `${baseUrl.pathname}/`

  const normalizedPath = path.replace(/^\/+/, '')
  const url = new URL(normalizedPath, `${baseUrl.origin}${basePath}`)

  if (url.origin !== baseUrl.origin || !url.pathname.startsWith(basePath)) {
    throw new TypeError('API path must stay within VITE_API_BASE_URL')
  }

  return url
}

async function getAuthorizationHeader(): Promise<string> {
  const appConfig = getAppConfig()

  if (appConfig.authMode === 'e2e-token') {
    if (!appConfig.e2eToken) {
      throw new ApiAuthError('E2E token auth is configured without a token')
    }

    return `Bearer ${appConfig.e2eToken}`
  }

  const msal = getMsalInstance()
  const account = msal.getActiveAccount()

  if (!account) {
    throw new ApiAuthError('No active MSAL account is available')
  }

  const tokenResult = await msal.acquireTokenSilent({
    ...getApiTokenRequest(),
    account,
  })

  return `Bearer ${tokenResult.accessToken}`
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const appConfig = getAppConfig()
  const url = createApiUrl(path, appConfig.apiBaseUrl)
  const headers = new Headers(options.headers)

  headers.set('Authorization', await getAuthorizationHeader())

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new ApiError(response.status)
  }

  return response
}
