import { describe, expect, it } from 'vitest'

import { canAccess, hasAnyRole, RoleConst } from './roles'

describe('roles', () => {
  it('keeps the exact numeric role IDs from the migration plan', () => {
    expect(RoleConst).toEqual({
      User: 1,
      SpaceAdmin: 5,
      UserAdmin: 10,
      ReportAdmin: 15,
      SuperUser: 20,
    })
  })

  it('matches when the user holds any allowed role', () => {
    expect(hasAnyRole([RoleConst.User], [RoleConst.User])).toBe(true)
    expect(hasAnyRole([RoleConst.SpaceAdmin], [RoleConst.SuperUser])).toBe(
      false,
    )
    expect(hasAnyRole([], [RoleConst.User])).toBe(false)
  })

  it('grants SuperUser the same access Angular allowed', () => {
    const superUser = [RoleConst.SuperUser]

    expect(canAccess.home(superUser)).toBe(true)
    expect(canAccess.manageWorkstations(superUser)).toBe(true)
    expect(canAccess.manageBuildings(superUser)).toBe(true)
    expect(canAccess.manageUsers(superUser)).toBe(true)
    expect(canAccess.manageDivisions(superUser)).toBe(true)
    expect(canAccess.reports(superUser)).toBe(true)
  })

  it('keeps SpaceAdmin scoped to space management and view-only admin lists', () => {
    const spaceAdmin = [RoleConst.SpaceAdmin]

    expect(canAccess.home(spaceAdmin)).toBe(true)
    expect(canAccess.manageWorkstations(spaceAdmin)).toBe(true)
    expect(canAccess.viewBuildings(spaceAdmin)).toBe(true)
    expect(canAccess.viewDivisions(spaceAdmin)).toBe(true)
    expect(canAccess.manageBuildings(spaceAdmin)).toBe(false)
    expect(canAccess.manageUsers(spaceAdmin)).toBe(false)
    expect(canAccess.reports(spaceAdmin)).toBe(false)
  })

  it('limits a plain User to the home/bookings area', () => {
    const user = [RoleConst.User]

    expect(canAccess.home(user)).toBe(true)
    expect(canAccess.manageWorkstations(user)).toBe(false)
    expect(canAccess.manageUsers(user)).toBe(false)
    expect(canAccess.reports(user)).toBe(false)
  })
})
