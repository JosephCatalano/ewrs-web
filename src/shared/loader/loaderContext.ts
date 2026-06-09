import { createContext, useContext } from 'react'

export type LoaderOperation<T> = () => Promise<T>

export interface LoaderContextValue {
  activeManualLoaders: number
  isManuallyLoading: boolean
  showLoader: () => void
  hideLoader: () => void
  withLoader: <T>(operation: LoaderOperation<T>) => Promise<T>
}

export const LoaderContext = createContext<LoaderContextValue | undefined>(
  undefined,
)

export function useLoader() {
  const context = useContext(LoaderContext)

  if (!context) {
    throw new Error('useLoader must be used within a LoaderProvider')
  }

  return context
}
