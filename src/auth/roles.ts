// Numeric role IDs come from REACT_VITE_MIGRATION.md and must match the API
// exactly. Do not change these values during migration.
export const RoleConst = {
  User: 1,
  SpaceAdmin: 5,
  UserAdmin: 10,
  ReportAdmin: 15,
  SuperUser: 20,
} as const

export type RoleId = (typeof RoleConst)[keyof typeof RoleConst]

export function hasAnyRole(
  userRoles: readonly number[],
  allowedRoles: readonly number[],
): boolean {
  return userRoles.some((role) => allowedRoles.includes(role))
}

// Route/nav visibility rules ported 1:1 from the Angular AppComponent
// `authorize*` helpers. SuperUser is included wherever Angular allowed it so the
// bypass behavior stays identical. Keep these in sync with RequireAuth when the
// route guard is added.
export const canAccess = {
  home: (roles: readonly number[]) =>
    hasAnyRole(roles, [
      RoleConst.User,
      RoleConst.SpaceAdmin,
      RoleConst.UserAdmin,
      RoleConst.ReportAdmin,
      RoleConst.SuperUser,
    ]),
  manageWorkstations: (roles: readonly number[]) =>
    hasAnyRole(roles, [RoleConst.SpaceAdmin, RoleConst.SuperUser]),
  manageBuildings: (roles: readonly number[]) =>
    hasAnyRole(roles, [RoleConst.SuperUser]),
  viewBuildings: (roles: readonly number[]) =>
    hasAnyRole(roles, [RoleConst.SpaceAdmin]),
  manageUsers: (roles: readonly number[]) =>
    hasAnyRole(roles, [RoleConst.UserAdmin, RoleConst.SuperUser]),
  manageDivisions: (roles: readonly number[]) =>
    hasAnyRole(roles, [RoleConst.SuperUser]),
  viewDivisions: (roles: readonly number[]) =>
    hasAnyRole(roles, [RoleConst.SpaceAdmin]),
  reports: (roles: readonly number[]) =>
    hasAnyRole(roles, [RoleConst.ReportAdmin, RoleConst.SuperUser]),
} as const
