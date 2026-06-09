import { QueryClient } from '@tanstack/react-query'

import { ApiAuthError, ApiError } from './httpClient'

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiAuthError) {
    return false
  }

  if (error instanceof ApiError && error.status < 500) {
    return false
  }

  return failureCount < 1
}

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: shouldRetry,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

export const queryClient = createQueryClient()
