"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ModulePermissionGroup, RolePermissions } from "@/types/admin/permissions"
import { getViewScope, setViewScope } from "../utils/scope-helpers"

interface PermissionCardProps {
  group: ModulePermissionGroup
  rolePermissions: RolePermissions
  isReadOnly: boolean
  onPermissionChange?: (permissionKey: string, allowed: boolean) => void
  onSelectAll?: (moduleId: string, checked: boolean) => void
  allSelected: boolean
  someSelected: boolean
  selectedCount: number
}

export function PermissionCard({
  group,
  rolePermissions,
  isReadOnly,
  onPermissionChange,
  onSelectAll,
  allSelected,
  someSelected,
  selectedCount,
}: PermissionCardProps) {
  // Calculate total permissions count (excluding scope-specific ones)
  const totalPermissions = group.permissions.filter(
    (p) => !p.key.endsWith('.view_all') && !p.key.endsWith('.view_assigned')
  ).length

  const handlePermissionToggle = (permissionKey: string, currentValue: boolean) => {
    if (isReadOnly || !onPermissionChange) return
    
    // Check if this is a view permission with scope support
    const isViewPermission = permissionKey === `${group.moduleId}.view`
    const perm = group.permissions.find((p) => p.key === permissionKey)
    const supportsScope = perm?.supportsScope === true
    
    if (isViewPermission && supportsScope) {
      // When unchecking view, clear scope permissions
      if (currentValue) {
        // Unchecking - clear scope permissions
        onPermissionChange(permissionKey, false)
        onPermissionChange(`${group.moduleId}.view_all`, false)
        onPermissionChange(`${group.moduleId}.view_assigned`, false)
      } else {
        // Checking - set default to view_all
        onPermissionChange(permissionKey, true)
        onPermissionChange(`${group.moduleId}.view_all`, true)
        onPermissionChange(`${group.moduleId}.view_assigned`, false)
      }
    } else {
      onPermissionChange(permissionKey, !currentValue)
    }
  }

  return (
    <Card className="border hover:border-primary/20 transition-colors">
      <CardHeader className="pb-1 px-3 pt-3">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <CardTitle className="text-sm font-semibold truncate" title={group.moduleName}>
            {group.moduleName}
          </CardTitle>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {selectedCount}/{totalPermissions}
            </span>
            <Checkbox
              checked={allSelected}
              onCheckedChange={(checked) => {
                if (!onSelectAll) return
                
                // If some are selected but not all, clicking should always select all
                // Otherwise, use the checked value: true = select all, false = deselect all
                if (someSelected && !allSelected) {
                  onSelectAll(group.moduleId, true)
                } else {
                  onSelectAll(group.moduleId, checked === true)
                }
              }}
              disabled={isReadOnly}
              aria-label={`Select all ${group.moduleName} permissions`}
              className={`flex-shrink-0 ${someSelected && !allSelected ? 'opacity-75' : ''}`}
              title={
                someSelected
                  ? "Some permissions selected. Click to select all."
                  : allSelected
                  ? "All permissions selected. Click to deselect all."
                  : "Click to select all permissions"
              }
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-3 pb-3">
        <div className="flex flex-col gap-0.5">
          {group.permissions.length === 0 ? (
            <p className="text-xs text-muted-foreground">No permissions available</p>
          ) : (
            group.permissions.map((perm, idx) => {
              // Skip scope-specific permissions (view_all, view_assigned) as they're handled by the scope selector
              if (perm.key.endsWith('.view_all') || perm.key.endsWith('.view_assigned')) {
                return null
              }
              
              const isAllowed = rolePermissions[perm.key] === true
              const isViewPermission = perm.key === `${group.moduleId}.view`
              const supportsScope = perm.supportsScope === true
              const currentScope = supportsScope ? getViewScope(rolePermissions, group.moduleId) : null
              
              return (
                <div key={perm.key} className="flex items-center gap-2 group">
                  <Checkbox
                    id={`perm-${perm.key}`}
                    checked={isAllowed}
                    onCheckedChange={() => handlePermissionToggle(perm.key, isAllowed)}
                    disabled={isReadOnly}
                    className="flex-shrink-0"
                    aria-label={`Toggle ${perm.label}`}
                  />
                  <label
                    htmlFor={`perm-${perm.key}`}
                    className="text-xs cursor-pointer hover:text-primary transition-colors flex-1"
                    title={perm.description || perm.label}
                  >
                    {perm.label}
                  </label>
                  {supportsScope && isAllowed && (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <label className="flex items-center gap-1 cursor-pointer group/radio">
                        <input
                          type="radio"
                          name={`scope-${group.moduleId}`}
                          value="all"
                          checked={currentScope === 'all'}
                          onChange={() => {
                            if (onPermissionChange && !isReadOnly) {
                              setViewScope(rolePermissions, group.moduleId, 'all', onPermissionChange)
                            }
                          }}
                          disabled={isReadOnly}
                          className="w-3 h-3 cursor-pointer disabled:cursor-not-allowed transition-colors"
                          style={{ accentColor: 'var(--primary)' }}
                        />
                        <span className="text-xs text-muted-foreground group-hover/radio:text-foreground transition-colors">all</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer group/radio">
                        <input
                          type="radio"
                          name={`scope-${group.moduleId}`}
                          value="assigned"
                          checked={currentScope === 'assigned'}
                          onChange={() => {
                            if (onPermissionChange && !isReadOnly) {
                              setViewScope(rolePermissions, group.moduleId, 'assigned', onPermissionChange)
                            }
                          }}
                          disabled={isReadOnly}
                          className="w-3 h-3 cursor-pointer disabled:cursor-not-allowed transition-colors"
                          style={{ accentColor: 'var(--primary)' }}
                        />
                        <span className="text-xs text-muted-foreground group-hover/radio:text-foreground transition-colors">assigned</span>
                      </label>
                    </div>
                  )}
                  <span className="text-muted-foreground/50 text-xs flex-shrink-0">•</span>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}

