import { ApplicationInsights } from '@microsoft/applicationinsights-web'

import { getAppConfig } from '../app/config'

export type TelemetryProperties = Record<
  string,
  string | number | boolean | null | undefined
>

let appInsights: ApplicationInsights | undefined
let initializationAttempted = false

function hasTelemetryConfig(): boolean {
  const { appInsights: config } = getAppConfig()

  return Boolean(config.instrumentationKey || config.connectionString)
}

function createAppInsights(): ApplicationInsights | undefined {
  const { appInsights: config } = getAppConfig()

  if (!config.instrumentationKey && !config.connectionString) {
    return undefined
  }

  const client = new ApplicationInsights({
    config: {
      ...(config.instrumentationKey
        ? { instrumentationKey: config.instrumentationKey }
        : {}),
      ...(config.connectionString
        ? { connectionString: config.connectionString }
        : {}),
      enableAutoRouteTracking: false,
    },
  })

  client.loadAppInsights()

  return client
}

export function initializeAppInsights(): ApplicationInsights | undefined {
  if (initializationAttempted) {
    return appInsights
  }

  initializationAttempted = true
  appInsights = createAppInsights()

  return appInsights
}

export function isAppInsightsConfigured(): boolean {
  return hasTelemetryConfig()
}

export function trackPageView(
  name?: string,
  uri?: string,
  properties?: TelemetryProperties,
): void {
  initializeAppInsights()?.trackPageView({ name, uri, properties })
}

export function trackEvent(
  name: string,
  properties?: TelemetryProperties,
): void {
  initializeAppInsights()?.trackEvent({ name }, properties)
}

export function trackMetric(
  name: string,
  average: number,
  properties?: TelemetryProperties,
): void {
  initializeAppInsights()?.trackMetric({ name, average }, properties)
}

export function trackException(
  exception: Error,
  severityLevel?: number,
  properties?: TelemetryProperties,
): void {
  initializeAppInsights()?.trackException(
    { exception, severityLevel },
    properties,
  )
}

export function trackTrace(
  message: string,
  properties?: TelemetryProperties,
): void {
  initializeAppInsights()?.trackTrace({ message }, properties)
}

export function setAuthenticatedUserContext(
  userId: string,
  accountId?: string,
): void {
  if (!userId.trim()) {
    return
  }

  initializeAppInsights()?.setAuthenticatedUserContext(userId, accountId, false)
}

export function clearAuthenticatedUserContext(): void {
  initializeAppInsights()?.clearAuthenticatedUserContext()
}

export function flushAppInsights(): void {
  appInsights?.flush()
}

export function resetAppInsightsForTests(): void {
  appInsights = undefined
  initializationAttempted = false
}

// Automatic route tracking is disabled (enableAutoRouteTracking: false). Now
// that React Router and useCurrentUser exist, the remaining work is to call
// `trackPageView` from a route-change effect and `setAuthenticatedUserContext`
// after `/me` succeeds. Keep access tokens, auth responses, and unnecessary
// personal data out of telemetry properties.
