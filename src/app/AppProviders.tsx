import { MsalProvider } from '@azure/msal-react'
import type { ReactNode } from 'react'

import { getMsalInstance } from '../auth/msalConfig'

type AppProvidersProps = {
  children: ReactNode
}

const msalInstance = getMsalInstance()

export function AppProviders({ children }: AppProvidersProps) {
  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>
}
