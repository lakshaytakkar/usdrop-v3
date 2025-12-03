"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { ExternalUserModulePermissionGroup, ExternalPlanPermission } from "@/types/admin/permissions"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { PlanPermissionCard } from "./plan-permission-card"

interface PlanPermissionsMatrixProps {
  permissionDefinitions: ExternalUserModulePermissionGroup[]
  planPermissions: Record<string, ExternalPlanPermission>
  selectedPlan: string
  isReadOnly?: boolean
  loading?: boolean
  onPermissionChange?: (moduleId: string, field: keyof ExternalPlanPermission, value: any) => void
  onPermissionBatchUpdate?: (moduleId: string, updates: Partial<ExternalPlanPermission>) => void
}

export function PlanPermissionsMatrix({
  permissionDefinitions,
  planPermissions,
  selectedPlan,
  isReadOnly = false,
  loading = false,
  onPermissionChange,
  onPermissionBatchUpdate,
}: PlanPermissionsMatrixProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const getModulePermission = (moduleId: string): ExternalPlanPermission => {
    return planPermissions[moduleId] || {
      moduleId,
      accessLevel: "locked",
      view: false,
      viewDetails: false,
      limitedView: false,
      limitCount: null,
      lockPage: false,
    }
  }

  const handlePermissionToggle = (moduleId: string, field: keyof ExternalPlanPermission, currentValue: boolean) => {
    if (isReadOnly || !onPermissionChange) return
    const newValue = !currentValue
    
    // Get current permission state
    const perm = getModulePermission(moduleId)
    
    // Create updated permission with new value
    const updatedPerm = { ...perm, [field]: newValue }
    
    // Update the field
    onPermissionChange(moduleId, field, newValue)
    
    // Auto-update access level based on permissions
    let newAccessLevel: "full_access" | "limited_access" | "locked" | "hidden" = perm.accessLevel
    
    if (field === "lockPage") {
      // If lockPage is enabled, set to locked
      if (newValue) {
        newAccessLevel = "locked"
      } else {
        // If lockPage is disabled, recalculate based on other permissions
        if (updatedPerm.view && updatedPerm.viewDetails && !updatedPerm.limitedView) {
          newAccessLevel = "full_access"
        } else if (updatedPerm.view && updatedPerm.limitedView) {
          newAccessLevel = "limited_access"
        } else if (updatedPerm.view) {
          newAccessLevel = "limited_access"
        } else {
          newAccessLevel = "locked"
        }
      }
    } else if (field === "view" || field === "viewDetails" || field === "limitedView") {
      // Recalculate access level based on updated permissions
      if (updatedPerm.lockPage) {
        newAccessLevel = "locked"
      } else if (updatedPerm.view && updatedPerm.viewDetails && !updatedPerm.limitedView) {
        newAccessLevel = "full_access"
      } else if (updatedPerm.view && updatedPerm.limitedView) {
        newAccessLevel = "limited_access"
      } else if (updatedPerm.view) {
        newAccessLevel = "limited_access"
      } else {
        newAccessLevel = "locked"
      }
    }
    
    // Only update access level if it changed
    if (newAccessLevel !== perm.accessLevel) {
      onPermissionChange(moduleId, "accessLevel", newAccessLevel)
    }
  }

  const handleHiddenToggle = (moduleId: string, isHidden: boolean) => {
    if (isReadOnly) return
    
    // Use batch update if available, otherwise fall back to individual updates
    if (onPermissionBatchUpdate) {
      if (isHidden) {
        // Hidden: hide from sidebar, block routes, disable all permissions
        onPermissionBatchUpdate(moduleId, {
          accessLevel: "hidden",
          view: false,
          viewDetails: false,
          limitedView: false,
          limitCount: null,
          lockPage: false,
        })
      } else {
        // Unhide: restore to a default state (locked with lockPage)
        onPermissionBatchUpdate(moduleId, {
          accessLevel: "locked",
          view: false,
          viewDetails: false,
          limitedView: false,
          limitCount: null,
          lockPage: true,
        })
      }
    } else if (onPermissionChange) {
      // Fallback to individual updates
      if (isHidden) {
        onPermissionChange(moduleId, "accessLevel", "hidden")
        onPermissionChange(moduleId, "view", false)
        onPermissionChange(moduleId, "viewDetails", false)
        onPermissionChange(moduleId, "limitedView", false)
        onPermissionChange(moduleId, "limitCount", null)
        onPermissionChange(moduleId, "lockPage", false)
      } else {
        onPermissionChange(moduleId, "accessLevel", "locked")
        onPermissionChange(moduleId, "view", false)
        onPermissionChange(moduleId, "viewDetails", false)
        onPermissionChange(moduleId, "limitedView", false)
        onPermissionChange(moduleId, "limitCount", null)
        onPermissionChange(moduleId, "lockPage", true)
      }
    }
  }

  const handleLimitCountChange = (moduleId: string, value: string) => {
    if (isReadOnly || !onPermissionChange) return
    const numValue = value === "" ? null : parseInt(value, 10)
    if (numValue !== null && isNaN(numValue)) return
    onPermissionChange(moduleId, "limitCount", numValue)
  }

  const filteredPermissionGroups = useMemo(() => {
    if (!searchQuery.trim()) return permissionDefinitions
    return permissionDefinitions.filter(
      (group) =>
        group.moduleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.moduleId.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, permissionDefinitions])

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Skeleton className="h-8 max-w-md" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-1 px-3 pt-3">
                <Skeleton className="h-5 w-24" />
              </CardHeader>
              <CardContent className="pt-0 px-3 pb-3">
                <div className="flex flex-col gap-0.5">
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
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search modules..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md h-8"
        />
      </div>

      {filteredPermissionGroups.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground mb-2">
              No modules found matching your search.
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
            const perm = getModulePermission(group.moduleId)

            return (
              <PlanPermissionCard
                key={group.moduleId}
                group={group}
                permission={perm}
                isReadOnly={isReadOnly}
                onPermissionChange={onPermissionChange}
                onPermissionBatchUpdate={onPermissionBatchUpdate}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
