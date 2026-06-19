// Numeric user-status IDs from the Angular `userStatus.const`. These must match
// the API exactly and drive the route guard's status redirects (Active proceeds,
// UnRegistered is forced to /register, anything else is access denied).
export const UserStatusConst = {
  UnRegistered: 1,
  Active: 2,
  Deactivated: 3,
} as const

export type UserStatusId =
  (typeof UserStatusConst)[keyof typeof UserStatusConst]
