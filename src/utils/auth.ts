import type { User } from '../core/types'

/**
 * Checks if a user has admin privileges
 * @param user - The user object to check
 * @returns true if the user is an admin, false otherwise
 */
export function isAdmin(user: User | null): boolean {
  if (!user || !user.role) {
    return false
  }

  // Check if the role type is 'admin' or name is 'Admin'
  return user.role.type === 'admin' || user.role.name.toLowerCase() === 'admin'
}

/**
 * Gets the user's role name or returns 'User' as default
 * @param user - The user object
 * @returns the role name or 'User' as fallback
 */
export function getUserRole(user: User | null): string {
  if (!user || !user.role) {
    return 'User'
  }

  return user.role.name
}

/**
 * Checks if user has a specific role type
 * @param user - The user object to check
 * @param roleType - The role type to check for
 * @returns true if user has the specified role type
 */
export function hasRole(user: User | null, roleType: string): boolean {
  if (!user || !user.role) {
    return false
  }

  return user.role.type === roleType
}
