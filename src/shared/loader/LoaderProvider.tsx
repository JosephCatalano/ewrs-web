import { useCallback, useMemo, useState, type ReactNode } from 'react'

import { LoaderContext, type LoaderOperation } from './loaderContext'

interface LoaderProviderProps {
  children: ReactNode
}

export function LoaderProvider({ children }: LoaderProviderProps) {
  const [activeManualLoaders, setActiveManualLoaders] = useState(0)

  const showLoader = useCallback(() => {
    setActiveManualLoaders((currentCount) => currentCount + 1)
  }, [])

  const hideLoader = useCallback(() => {
    setActiveManualLoaders((currentCount) => Math.max(0, currentCount - 1))
  }, [])

  const withLoader = useCallback(
    async <T,>(operation: LoaderOperation<T>) => {
      showLoader()

      try {
        return await operation()
      } finally {
        hideLoader()
      }
    },
    [hideLoader, showLoader],
  )

  const value = useMemo(
    () => ({
      activeManualLoaders,
      isManuallyLoading: activeManualLoaders > 0,
      showLoader,
      hideLoader,
      withLoader,
    }),
    [activeManualLoaders, hideLoader, showLoader, withLoader],
  )

  return (
    <LoaderContext.Provider value={value}>{children}</LoaderContext.Provider>
  )
}
