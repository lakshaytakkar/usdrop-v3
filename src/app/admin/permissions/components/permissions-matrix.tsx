"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Check } from "lucide-react"
import { ModulePermissionGroup, RolePermissions } from "@/types/admin/permissions"

interface PermissionsMatrixProps {
  permissionDefinitions: ModulePermissionGroup[]
  rolePermissions: RolePermissions
  selectedRole: string
  isReadOnly?: boolean
  onPermissionChange?: (permissionKey: string, allowed: boolean) => void
}

export function PermissionsMatrix({
  permissionDefinitions,
  rolePermissions,
  selectedRole,
  isReadOnly = false,
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

    group.permissions.forEach((perm) => {
      onPermissionChange(perm.key, checked)
    })
  }

  const areAllModulePermissionsSelected = (moduleId: string): boolean => {
    const group = permissionDefinitions.find((g) => g.moduleId === moduleId)
    if (!group) return false
    return group.permissions.every((perm) => rolePermissions[perm.key] === true)
  }

  const areSomeModulePermissionsSelected = (moduleId: string): boolean => {
    const group = permissionDefinitions.find((g) => g.moduleId === moduleId)
    if (!group) return false
    const selectedCount = group.permissions.filter(
      (perm) => rolePermissions[perm.key] === true
    ).length
    return selectedCount > 0 && selectedCount < group.permissions.length
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
            <p className="text-muted-foreground">
              No modules or permissions found matching your search.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
          {filteredPermissionGroups.map((group) => {
            const allSelected = areAllModulePermissionsSelected(group.moduleId)
            const someSelected = areSomeModulePermissionsSelected(group.moduleId)
            const selectedCount = group.permissions.filter(
              (perm) => rolePermissions[perm.key] === true
            ).length

            return (
              <Card
                key={group.moduleId}
                className="border hover:border-primary/20 transition-colors"
              >
                <CardHeader className="pb-2 px-4 pt-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">{group.moduleName}</CardTitle>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">
                        {selectedCount}/{group.permissions.length}
                      </span>
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={(checked) =>
                          handleModuleSelectAll(group.moduleId, checked === true)
                        }
                        disabled={isReadOnly}
                        aria-label={`Select all ${group.moduleName} permissions`}
                        className="flex-shrink-0"
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
                <CardContent className="pt-0 px-4 pb-4">
                  <div className="flex flex-wrap gap-x-2 gap-y-1.5 items-center">
                    {group.permissions.map((perm, idx) => {
                      const isAllowed = rolePermissions[perm.key] === true
                      return (
                        <div key={perm.key} className="flex items-center gap-1 group">
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
                            className="text-xs cursor-pointer whitespace-nowrap hover:text-primary transition-colors"
                            title={perm.description || perm.label}
                          >
                            {perm.label}
                          </label>
                          {idx < group.permissions.length - 1 && (
                            <span className="text-muted-foreground/50 text-xs mx-0.5">•</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

