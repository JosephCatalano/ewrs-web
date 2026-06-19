import { QueryClientProvider } from '@tanstack/react-query'
import { MsalProvider } from '@azure/msal-react'
import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { queryClient } from '../api/queryClient'
import { getMsalInstance } from '../auth/msalConfig'
import { AlertProvider } from '../shared/alerts'
import { LoaderProvider } from '../shared/loader'
import { ThemeProvider } from '../shared/theme'
import { initializeAppInsights } from '../telemetry/appInsights'

type AppProvidersProps = {
  children: ReactNode
}

const msalInstance = getMsalInstance()

initializeAppInsights()

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <MsalProvider instance={msalInstance}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LoaderProvider>
            <AlertProvider>
              <BrowserRouter>{children}</BrowserRouter>
            </AlertProvider>
          </LoaderProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </MsalProvider>
  )
}
