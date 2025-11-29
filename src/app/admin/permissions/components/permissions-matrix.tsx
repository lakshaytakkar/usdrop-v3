"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { ModulePermissionGroup, RolePermissions } from "@/types/admin/permissions"
import { Skeleton } from "@/components/ui/skeleton"
import { PermissionCard } from "./permission-card"

interface PermissionsMatrixProps {
  permissionDefinitions: ModulePermissionGroup[]
  rolePermissions: RolePermissions
  selectedRole: string
  isReadOnly?: boolean
  loading?: boolean
  onPermissionChange?: (permissionKey: string, allowed: boolean) => void
}

export function PermissionsMatrix({
  permissionDefinitions,
  rolePermissions,
  selectedRole,
  isReadOnly = false,
  loading = false,
  onPermissionChange,
}: PermissionsMatrixProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handlePermissionToggle = (permissionKey: string, currentValue: boolean) => {
    if (isReadOnly || !onPermissionChange) return
    onPermissionChange(permissionKey, !currentValue)
  }

  const handleModuleSelectAll = (moduleId: string, checked: boolean) => {
    if (isReadOnly || !onPermissionChange) return
    const group = permissionDefinitions.find((g) => g.moduleId === moduleId)
    if (!group) return

    // Collect all permission changes to apply them
    const permissionUpdates: Array<{ key: string; value: boolean }> = []

    group.permissions.forEach((perm) => {
      // Skip scope-specific permissions (view_all, view_assigned) as they're handled by scope selector
      if (perm.key.endsWith('.view_all') || perm.key.endsWith('.view_assigned')) {
        return
      }
      
      if (checked && perm.supportsScope) {
        // For view permissions with scope, set view_all to true when selecting all
        permissionUpdates.push({ key: `${moduleId}.view_all`, value: true })
        permissionUpdates.push({ key: `${moduleId}.view_assigned`, value: false })
        permissionUpdates.push({ key: perm.key, value: true })
      } else {
        permissionUpdates.push({ key: perm.key, value: checked })
        if (!checked && perm.supportsScope) {
          // Clear scope permissions when unchecking view
          permissionUpdates.push({ key: `${moduleId}.view_all`, value: false })
          permissionUpdates.push({ key: `${moduleId}.view_assigned`, value: false })
        }
      }
    })

    // Apply all updates
    permissionUpdates.forEach(({ key, value }) => {
      onPermissionChange(key, value)
    })
  }

  const areAllModulePermissionsSelected = (moduleId: string): boolean => {
    const group = permissionDefinitions.find((g) => g.moduleId === moduleId)
    if (!group) return false
    // Filter out scope-specific permissions (view_all, view_assigned) as they're handled separately
    const nonScopePermissions = group.permissions.filter(
      (perm) => !perm.key.endsWith('.view_all') && !perm.key.endsWith('.view_assigned')
    )
    return nonScopePermissions.every((perm) => {
      // For view permissions with scope, check if either view_all or view_assigned is true
      if (perm.supportsScope) {
        const viewAllKey = `${moduleId}.view_all`
        const viewAssignedKey = `${moduleId}.view_assigned`
        return rolePermissions[viewAllKey] === true || rolePermissions[viewAssignedKey] === true
      }
      return rolePermissions[perm.key] === true
    })
  }

  const areSomeModulePermissionsSelected = (moduleId: string): boolean => {
    const group = permissionDefinitions.find((g) => g.moduleId === moduleId)
    if (!group) return false
    // Filter out scope-specific permissions (view_all, view_assigned) as they're handled separately
    const nonScopePermissions = group.permissions.filter(
      (perm) => !perm.key.endsWith('.view_all') && !perm.key.endsWith('.view_assigned')
    )
    const selectedCount = nonScopePermissions.filter((perm) => {
      // For view permissions with scope, check if either view_all or view_assigned is true
      if (perm.supportsScope) {
        const viewAllKey = `${moduleId}.view_all`
        const viewAssignedKey = `${moduleId}.view_assigned`
        return rolePermissions[viewAllKey] === true || rolePermissions[viewAssignedKey] === true
      }
      return rolePermissions[perm.key] === true
    }).length
    return selectedCount > 0 && selectedCount < nonScopePermissions.length
  }

  const filteredPermissionGroups = useMemo(() => {
    if (!searchQuery.trim()) return permissionDefinitions
    return permissionDefinitions.filter(
      (group) =>
        group.moduleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.permissions.some(
          (perm) =>
            perm.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            perm.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            perm.key.toLowerCase().includes(searchQuery.toLowerCase())
        )
    )
  }, [searchQuery, permissionDefinitions])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Skeleton className="h-10 max-w-md" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-1 px-3 pt-3">
                <Skeleton className="h-5 w-24" />
              </CardHeader>
              <CardContent className="pt-0 px-3 pb-3">
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search modules or permissions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {filteredPermissionGroups.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">
              No modules or permissions found matching your search.
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="mt-4"
              >
                Clear Search
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2">
          {filteredPermissionGroups.map((group) => {
            const allSelected = areAllModulePermissionsSelected(group.moduleId)
            const someSelected = areSomeModulePermissionsSelected(group.moduleId)
            // Calculate selected count excluding scope-specific permissions
            const nonScopePermissions = group.permissions.filter(
              (perm) => !perm.key.endsWith('.view_all') && !perm.key.endsWith('.view_assigned')
            )
            const selectedCount = nonScopePermissions.filter((perm) => {
              // For view permissions with scope, check if either view_all or view_assigned is true
              if (perm.supportsScope) {
                const viewAllKey = `${group.moduleId}.view_all`
                const viewAssignedKey = `${group.moduleId}.view_assigned`
                return rolePermissions[viewAllKey] === true || rolePermissions[viewAssignedKey] === true
              }
              return rolePermissions[perm.key] === true
            }).length

            return (
              <PermissionCard
                key={group.moduleId}
                group={group}
                rolePermissions={rolePermissions}
                isReadOnly={isReadOnly}
                onPermissionChange={onPermissionChange}
                onSelectAll={handleModuleSelectAll}
                allSelected={allSelected}
                someSelected={someSelected}
                selectedCount={selectedCount}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

