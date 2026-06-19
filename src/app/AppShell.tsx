import type { ReactNode } from 'react'

import { AppFooter } from './AppFooter'
import { AppHeader } from './AppHeader'
import './AppShell.css'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-layout">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <AppHeader />

      <main className="app-layout__content" id="main-content">
        {children}
      </main>

      <AppFooter />
    </div>
  )
}
