import { useIsFetching, useIsMutating } from '@tanstack/react-query'

import './LoaderOverlay.css'
import { useLoader } from './loaderContext'

interface LoaderOverlayProps {
  label?: string
}

export function LoaderOverlay({ label = 'Loading' }: LoaderOverlayProps) {
  const { isManuallyLoading } = useLoader()
  const activeFetches = useIsFetching()
  const activeMutations = useIsMutating()
  const isLoading =
    isManuallyLoading || activeFetches > 0 || activeMutations > 0

  if (!isLoading) {
    return null
  }

  return (
    <div
      aria-label={label}
      aria-live="polite"
      className="loader-overlay"
      role="status"
    >
      <span className="loader-overlay__label">{label}</span>
      <span
        aria-hidden="true"
        className="loader-overlay__track"
        data-testid="loader-progress"
      >
        <span className="loader-overlay__bar" />
      </span>
    </div>
  )
}
