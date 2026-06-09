import { useId } from 'react'

import './AlertHost.css'
import { useAlert, type AlertInfo, type AlertType } from './alertContext'

interface AlertHostProps {
  targetId?: string
}

interface AlertPresentation {
  className: string
  iconSrc: string
}

const alertPresentationByType: Record<AlertType, AlertPresentation> = {
  info: {
    className: 'ontario-alert--informational',
    iconSrc: '/assets/images/ontario-icon-alert-information.svg',
  },
  warning: {
    className: 'ontario-alert--warning',
    iconSrc: '/assets/images/ontario-icon-alert-warning.svg',
  },
  success: {
    className: 'ontario-alert--success',
    iconSrc: '/assets/images/ontario-icon-alert-success.svg',
  },
  error: {
    className: 'ontario-alert--error',
    iconSrc: '/assets/images/ontario-icon-alert-error.svg',
  },
}

function shouldRenderAlert(alert: AlertInfo, hostTargetId?: string) {
  if (hostTargetId === undefined) {
    return alert.targetId === undefined
  }

  return alert.targetId === hostTargetId
}

export function AlertHost({ targetId }: AlertHostProps) {
  const { alert, clearAlert } = useAlert()
  const titleId = useId()

  if (!alert || !shouldRenderAlert(alert, targetId)) {
    return null
  }

  const presentation = alertPresentationByType[alert.type]
  const closeableClassName =
    alert.closeable === true ? ' ewrs-alert--closeable' : ''

  return (
    <div className="alert-host">
      <section
        aria-labelledby={titleId}
        aria-atomic="true"
        className={`ontario-alert ${presentation.className} ewrs-alert${closeableClassName}`}
        role="alert"
      >
        <div className="ontario-alert__header-icon ewrs-alert__icon-wrapper">
          <img
            alt=""
            aria-hidden="true"
            className="ewrs-alert__icon"
            src={presentation.iconSrc}
          />
        </div>
        <div className="ewrs-alert__content">
          <p
            className="ontario-alert__header-title ewrs-alert__title"
            id={titleId}
          >
            {alert.title}
          </p>

          {alert.message ? (
            <p className="ontario-alert__body ewrs-alert__body">
              {alert.message}
            </p>
          ) : null}
        </div>

        {alert.closeable === true ? (
          <button
            aria-label="Dismiss alert"
            className="ewrs-alert__close"
            onClick={clearAlert}
            type="button"
          >
            <span aria-hidden="true">X</span>
          </button>
        ) : null}
      </section>
    </div>
  )
}
