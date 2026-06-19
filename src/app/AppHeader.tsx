import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

import { canAccess } from '../auth/roles'
import { getUserRoleIds, useCurrentUser } from '../auth/useCurrentUser'
import { useTheme } from '../shared/theme'
import './AppHeader.css'

interface NavItem {
  label: string
  href: string
  isVisible: (roleIds: readonly number[]) => boolean
}

// Single source for desktop and mobile nav. Unlike the Angular template, the
// mobile and desktop lists are shared, so "View buildings"/"View divisions"
// stay consistent across breakpoints.
const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Home', href: '/home', isVisible: canAccess.home },
  { label: 'My bookings', href: '/reservations', isVisible: canAccess.home },
  {
    label: 'Manage workstations',
    href: '/workstations',
    isVisible: canAccess.manageWorkstations,
  },
  {
    label: 'Manage buildings',
    href: '/buildings',
    isVisible: canAccess.manageBuildings,
  },
  {
    label: 'View buildings',
    href: '/buildings',
    isVisible: canAccess.viewBuildings,
  },
  { label: 'Manage users', href: '/users', isVisible: canAccess.manageUsers },
  {
    label: 'Manage divisions',
    href: '/divisions',
    isVisible: canAccess.manageDivisions,
  },
  {
    label: 'View divisions',
    href: '/divisions',
    isVisible: canAccess.viewDivisions,
  },
  { label: 'Extract report', href: '/reports', isVisible: canAccess.reports },
]

export function AppHeader() {
  const { preference, setSystemTheme, setLightTheme, setDarkTheme } = useTheme()
  const { data: currentUser } = useCurrentUser()
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  const roleIds = getUserRoleIds(currentUser)
  const visibleNavItems = NAV_ITEMS.filter((item) => item.isVisible(roleIds))
  const accountName = currentUser?.displayName ?? 'Account'

  useEffect(() => {
    if (!isAccountMenuOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setIsAccountMenuOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsAccountMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isAccountMenuOpen])

  return (
    <header className="app-header">
      <div className="app-header__bar">
        <span className="app-header__logo-frame">
          <img
            className="app-header__logo"
            src="/assets/images/ontario-logo.png"
            alt="Government of Ontario logo"
          />
        </span>

        <span className="app-header__title app-header__title--full">
          Employee Workspace Reservation System
        </span>
        <span className="app-header__title app-header__title--compact">
          EWRS
        </span>

        <div className="app-header__account" ref={accountRef}>
          <button
            aria-controls={menuId}
            aria-expanded={isAccountMenuOpen}
            aria-haspopup="menu"
            className="app-header__account-button"
            onClick={() => setIsAccountMenuOpen((open) => !open)}
            type="button"
          >
            <span
              aria-hidden="true"
              className="app-header__icon app-header__icon--account"
            />
            <span className="app-header__account-name">{accountName}</span>
            <span
              aria-hidden="true"
              className="app-header__icon app-header__icon--chevron"
            />
          </button>

          {isAccountMenuOpen ? (
            <div className="app-menu" id={menuId} role="menu">
              <Link
                className="app-menu__item"
                role="menuitem"
                to="/edit-profile"
              >
                Settings
              </Link>
              <Link className="app-menu__item" role="menuitem" to="/docs">
                User Guide
              </Link>

              <div aria-label="Theme" className="app-menu__group" role="group">
                <p className="app-menu__group-label">Theme</p>
                <button
                  aria-checked={preference === 'system'}
                  className="app-menu__item"
                  onClick={setSystemTheme}
                  role="menuitemradio"
                  type="button"
                >
                  System
                </button>
                <button
                  aria-checked={preference === 'light'}
                  className="app-menu__item"
                  onClick={setLightTheme}
                  role="menuitemradio"
                  type="button"
                >
                  Light
                </button>
                <button
                  aria-checked={preference === 'dark'}
                  className="app-menu__item"
                  onClick={setDarkTheme}
                  role="menuitemradio"
                  type="button"
                >
                  Dark
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {visibleNavItems.length > 0 ? (
        <nav aria-label="Primary" className="app-nav">
          {visibleNavItems.map((item) => (
            <NavLink className="app-nav__link" key={item.label} to={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      ) : null}
    </header>
  )
}
