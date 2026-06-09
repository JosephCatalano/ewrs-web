import { useCallback, useMemo, useState, type ReactNode } from 'react'

import { AlertContext, type AlertInfo } from './alertContext'

interface AlertProviderProps {
  children: ReactNode
}

function scrollToTop() {
  if (typeof window === 'undefined' || typeof window.scrollTo !== 'function') {
    return
  }

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function AlertProvider({ children }: AlertProviderProps) {
  const [alert, setAlert] = useState<AlertInfo | null>(null)

  const showAlert = useCallback((nextAlert: AlertInfo) => {
    setAlert(nextAlert)
    scrollToTop()
  }, [])

  const clearAlert = useCallback(() => {
    setAlert(null)
  }, [])

  const value = useMemo(
    () => ({
      alert,
      showAlert,
      clearAlert,
    }),
    [alert, showAlert, clearAlert],
  )

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
}
