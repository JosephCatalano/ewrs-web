import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { AppConfig } from '../app/config'
import {
  clearAuthenticatedUserContext,
  flushAppInsights,
  initializeAppInsights,
  isAppInsightsConfigured,
  resetAppInsightsForTests,
  setAuthenticatedUserContext,
  trackEvent,
  trackException,
  trackMetric,
  trackPageView,
  trackTrace,
} from './appInsights'

const mocks = vi.hoisted(() => {
  const appInsightsInstance = {
    clearAuthenticatedUserContext: vi.fn(),
    flush: vi.fn(),
    loadAppInsights: vi.fn(),
    setAuthenticatedUserContext: vi.fn(),
    trackEvent: vi.fn(),
    trackException: vi.fn(),
    trackMetric: vi.fn(),
    trackPageView: vi.fn(),
    trackTrace: vi.fn(),
  }

  return {
    ApplicationInsights: vi.fn(function ApplicationInsightsMock() {
      return appInsightsInstance
    }),
    appInsightsInstance,
    getAppConfig: vi.fn(),
  }
})

vi.mock('@microsoft/applicationinsights-web', () => ({
  ApplicationInsights: mocks.ApplicationInsights,
}))

vi.mock('../app/config', () => ({
  getAppConfig: mocks.getAppConfig,
}))

const baseConfig: AppConfig = {
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

const telemetryConfig: AppConfig = {
  ...baseConfig,
  appInsights: {
    instrumentationKey: '33333333-3333-4333-8333-333333333333',
  },
}

describe('appInsights telemetry wrapper', () => {
  beforeEach(() => {
    resetAppInsightsForTests()
    vi.clearAllMocks()
    mocks.getAppConfig.mockReturnValue(baseConfig)
  })

  it('does not create the SDK when telemetry config is missing', () => {
    expect(isAppInsightsConfigured()).toBe(false)
    expect(initializeAppInsights()).toBeUndefined()

    trackPageView('Home', 'https://example.test/home')
    trackEvent('Test event')
    trackMetric('Test metric', 1)
    trackException(new Error('test exception'))
    trackTrace('Test trace')
    clearAuthenticatedUserContext()
    flushAppInsights()

    expect(mocks.ApplicationInsights).not.toHaveBeenCalled()
  })

  it('creates and loads the SDK once when telemetry config is present', () => {
    mocks.getAppConfig.mockReturnValue(telemetryConfig)

    const firstClient = initializeAppInsights()
    const secondClient = initializeAppInsights()

    expect(firstClient).toBe(secondClient)
    expect(mocks.ApplicationInsights).toHaveBeenCalledTimes(1)
    expect(mocks.ApplicationInsights).toHaveBeenCalledWith({
      config: {
        enableAutoRouteTracking: false,
        instrumentationKey: telemetryConfig.appInsights.instrumentationKey,
      },
    })
    expect(mocks.appInsightsInstance.loadAppInsights).toHaveBeenCalledTimes(1)
  })

  it('forwards page views, events, metrics, exceptions, and traces to the SDK', () => {
    mocks.getAppConfig.mockReturnValue(telemetryConfig)
    const error = new Error('tracked exception')

    trackPageView('Home', 'https://example.test/home', { route: '/home' })
    trackEvent('Booking created', { bookingId: 123 })
    trackMetric('Search duration', 250, { unit: 'ms' })
    trackException(error, 3, { source: 'test' })
    trackTrace('Trace message', { area: 'telemetry' })

    expect(mocks.appInsightsInstance.trackPageView).toHaveBeenCalledWith({
      name: 'Home',
      properties: { route: '/home' },
      uri: 'https://example.test/home',
    })
    expect(mocks.appInsightsInstance.trackEvent).toHaveBeenCalledWith(
      { name: 'Booking created' },
      { bookingId: 123 },
    )
    expect(mocks.appInsightsInstance.trackMetric).toHaveBeenCalledWith(
      { average: 250, name: 'Search duration' },
      { unit: 'ms' },
    )
    expect(mocks.appInsightsInstance.trackException).toHaveBeenCalledWith(
      { exception: error, severityLevel: 3 },
      { source: 'test' },
    )
    expect(mocks.appInsightsInstance.trackTrace).toHaveBeenCalledWith(
      { message: 'Trace message' },
      { area: 'telemetry' },
    )
  })

  it('sets and clears authenticated user context without accepting blank user ids', () => {
    mocks.getAppConfig.mockReturnValue(telemetryConfig)

    setAuthenticatedUserContext('   ', 'ignored-account-id')
    expect(
      mocks.appInsightsInstance.setAuthenticatedUserContext,
    ).not.toHaveBeenCalled()

    setAuthenticatedUserContext('user-id', 'account-id')
    clearAuthenticatedUserContext()

    expect(
      mocks.appInsightsInstance.setAuthenticatedUserContext,
    ).toHaveBeenCalledWith('user-id', 'account-id', false)
    expect(
      mocks.appInsightsInstance.clearAuthenticatedUserContext,
    ).toHaveBeenCalledTimes(1)
  })

  it('flushes only after the SDK has been initialized', () => {
    flushAppInsights()
    expect(mocks.appInsightsInstance.flush).not.toHaveBeenCalled()

    mocks.getAppConfig.mockReturnValue(telemetryConfig)
    initializeAppInsights()
    flushAppInsights()

    expect(mocks.appInsightsInstance.flush).toHaveBeenCalledTimes(1)
  })
})
