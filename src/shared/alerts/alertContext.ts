import { createContext, useContext } from 'react'

export type AlertType = 'info' | 'warning' | 'success' | 'error'

export interface AlertInfo {
  title: string
  message?: string
  type: AlertType
  closeable?: boolean
  targetId?: string
}

export interface AlertContextValue {
  alert: AlertInfo | null
  showAlert: (alert: AlertInfo) => void
  clearAlert: () => void
}

export const AlertContext = createContext<AlertContextValue | undefined>(
  undefined,
)

export function useAlert() {
  const context = useContext(AlertContext)

  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider')
  }

  return context
}
