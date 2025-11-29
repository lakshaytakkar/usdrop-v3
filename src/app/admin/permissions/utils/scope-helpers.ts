import { RolePermissions, ViewScope } from "@/types/admin/permissions"

/**
 * Get the current view scope for a module based on permissions
 * @param rolePermissions - Current role permissions
 * @param moduleId - Module identifier
 * @returns Current view scope ('all', 'assigned', or null)
 */
export function getViewScope(
  rolePermissions: RolePermissions,
  moduleId: string
): ViewScope {
  const viewAllKey = `${moduleId}.view_all`
  const viewAssignedKey = `${moduleId}.view_assigned`
  
  if (rolePermissions[viewAllKey] === true) {
    return 'all'
  }
  if (rolePermissions[viewAssignedKey] === true) {
    return 'assigned'
  }
  
  // Default to 'all' if view permission exists but no scope is set
  const viewKey = `${moduleId}.view`
  if (rolePermissions[viewKey] === true) {
    return 'all'
  }
  
  return null
}

/**
 * Set view scope for a module by updating both view_all and view_assigned permissions
 * @param rolePermissions - Current role permissions
 * @param moduleId - Module identifier
 * @param scope - New view scope ('all', 'assigned', or null)
 * @param onPermissionChange - Callback to update permissions
 */
export function setViewScope(
  rolePermissions: RolePermissions,
  moduleId: string,
  scope: ViewScope,
  onPermissionChange: (permissionKey: string, allowed: boolean) => void
): void {
  const viewAllKey = `${moduleId}.view_all`
  const viewAssignedKey = `${moduleId}.view_assigned`
  const viewKey = `${moduleId}.view`
  
  if (scope === 'all') {
    // Set view_all to true, view_assigned to false, and ensure view is true
    onPermissionChange(viewAllKey, true)
    onPermissionChange(viewAssignedKey, false)
    onPermissionChange(viewKey, true)
  } else if (scope === 'assigned') {
    // Set view_assigned to true, view_all to false, and ensure view is true
    onPermissionChange(viewAssignedKey, true)
    onPermissionChange(viewAllKey, false)
    onPermissionChange(viewKey, true)
  } else {
    // Clear both scope permissions and view permission
    onPermissionChange(viewAllKey, false)
    onPermissionChange(viewAssignedKey, false)
    onPermissionChange(viewKey, false)
  }
}

/**
 * Check if user has any view permission for a module
 * @param rolePermissions - Current role permissions
 * @param moduleId - Module identifier
 * @returns True if user has any view permission
 */
export function hasViewPermission(
  rolePermissions: RolePermissions,
  moduleId: string
): boolean {
  const viewKey = `${moduleId}.view`
  const viewAllKey = `${moduleId}.view_all`
  const viewAssignedKey = `${moduleId}.view_assigned`
  
  return (
    rolePermissions[viewKey] === true ||
    rolePermissions[viewAllKey] === true ||
    rolePermissions[viewAssignedKey] === true
  )
}

