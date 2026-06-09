import { QueryClientProvider } from '@tanstack/react-query'
import { MsalProvider } from '@azure/msal-react'
import type { ReactNode } from 'react'

import { queryClient } from '../api/queryClient'
import { getMsalInstance } from '../auth/msalConfig'

type AppProvidersProps = {
  children: ReactNode
}

const msalInstance = getMsalInstance()

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <MsalProvider instance={msalInstance}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MsalProvider>
  )
}
