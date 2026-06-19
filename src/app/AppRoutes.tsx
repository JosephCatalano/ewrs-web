import { Navigate, Route, Routes } from 'react-router-dom'

import { PagePlaceholder } from './PagePlaceholder'

// All preserved EWRS route paths from the Angular routing module and feature
// modules. Each renders a placeholder until its feature page is migrated. Route
// guards and the /docs default-page redirect are added with their own steps.
const ROUTES: ReadonlyArray<{ path: string; title: string }> = [
  // Static / low-risk
  { path: '/home', title: 'Home' },
  { path: '/reservations', title: 'My bookings' },
  { path: '/register', title: 'Register' },
  { path: '/edit-profile', title: 'Settings' },
  { path: '/accessdenied', title: 'Access denied' },
  { path: '/unsupported-browser', title: 'Unsupported browser' },
  { path: '/autherror', title: 'Authentication error' },
  { path: '/session-expired', title: 'Session expired' },
  { path: '/error', title: 'Something went wrong' },
  { path: '/auth', title: 'Signing in' },
  { path: '/docs', title: 'Documentation' },
  { path: '/docs/*', title: 'Documentation' },

  // Buildings / floors / workstations admin
  { path: '/buildings', title: 'Manage buildings' },
  { path: '/buildings/edit/:id', title: 'Edit building' },
  { path: '/buildings/view/:id', title: 'Building details' },
  { path: '/buildings/disable/:id', title: 'Disable building' },
  { path: '/buildings/:parentId/floors/view/:id', title: 'Floor details' },
  { path: '/buildings/:parentId/floors/edit/:id', title: 'Edit floor' },
  { path: '/buildings/:parentId/floors/disable/:id', title: 'Disable floor' },
  { path: '/workstations', title: 'Manage workstations' },
  {
    path: '/floors/:parentId/workstations/view/:id',
    title: 'Workstation details',
  },
  {
    path: '/floors/:parentId/workstations/edit/:id',
    title: 'Edit workstation',
  },
  {
    path: '/floors/:parentId/workstations/disable/:id',
    title: 'Disable workstation',
  },

  // Users / roles admin
  { path: '/roles', title: 'User roles' },
  { path: '/users', title: 'Manage users' },
  { path: '/user/add', title: 'Add user' },
  { path: '/users/view/:id', title: 'User details' },
  { path: '/users/edit/:id', title: 'Edit user' },
  { path: '/user/:id/roles/add', title: 'Add role' },

  // Divisions
  { path: '/divisions', title: 'Manage divisions' },
  { path: '/divisions-confirm/:minId/:maxId', title: 'Confirm divisions' },
  {
    path: '/divisions/edit/:id/:ret/:page/:pageSize/:minId/:maxId',
    title: 'Edit division',
  },

  // Reports
  { path: '/reports', title: 'Reports' },
  { path: '/reports/workstation-occupancy', title: 'Occupancy report' },
  {
    path: '/reports/specific-user-reservation',
    title: 'User reservation report',
  },
  { path: '/reports/cross-reference', title: 'Cross-reference report' },
  {
    path: '/reports/cross-reference-division',
    title: 'Division cross-reference report',
  },
  { path: '/reports/table-report', title: 'Table report' },
  {
    path: '/reports/division-cross-reference-participant',
    title: 'Participant report',
  },
]

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/home" />} />
      {ROUTES.map(({ path, title }) => (
        <Route
          element={<PagePlaceholder title={title} />}
          key={path}
          path={path}
        />
      ))}
      <Route path="*" element={<Navigate replace to="/home" />} />
    </Routes>
  )
}
