"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { ExternalUserModulePermissionGroup, ExternalPlanPermission } from "@/types/admin/permissions"

interface PlanPermissionCardProps {
  group: ExternalUserModulePermissionGroup
  permission: ExternalPlanPermission
  isReadOnly: boolean
  onPermissionChange?: (moduleId: string, field: keyof ExternalPlanPermission, value: any) => void
  onPermissionBatchUpdate?: (moduleId: string, updates: Partial<ExternalPlanPermission>) => void
}

export function PlanPermissionCard({
  group,
  permission,
  isReadOnly,
  onPermissionChange,
  onPermissionBatchUpdate,
}: PlanPermissionCardProps) {
  const isHidden = permission.accessLevel === "hidden"

  const handlePermissionToggle = (
    field: keyof ExternalPlanPermission,
    currentValue: boolean
  ) => {
    // Prevent toggling any permission when hidden is selected
    if (isReadOnly || !onPermissionChange || isHidden) return
    const newValue = !currentValue

    const updatedPerm = { ...permission, [field]: newValue }

    let newAccessLevel: "full_access" | "limited_access" | "locked" | "hidden" =
      permission.accessLevel

    if (field === "lockPage") {
      if (newValue) {
        newAccessLevel = "locked"
      } else {
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

    onPermissionChange(group.moduleId, field, newValue)

    if (newAccessLevel !== permission.accessLevel) {
      onPermissionChange(group.moduleId, "accessLevel", newAccessLevel)
    }
  }

  const handleHiddenToggle = (shouldBeHidden: boolean) => {
    if (isReadOnly) return

    if (onPermissionBatchUpdate) {
      if (shouldBeHidden) {
        onPermissionBatchUpdate(group.moduleId, {
          accessLevel: "hidden",
          view: false,
          viewDetails: false,
          limitedView: false,
          limitCount: null,
          lockPage: false,
        })
      } else {
        onPermissionBatchUpdate(group.moduleId, {
          accessLevel: "locked",
          view: false,
          viewDetails: false,
          limitedView: false,
          limitCount: null,
          lockPage: true,
        })
      }
    } else if (onPermissionChange) {
      if (shouldBeHidden) {
        onPermissionChange(group.moduleId, "accessLevel", "hidden")
        onPermissionChange(group.moduleId, "view", false)
        onPermissionChange(group.moduleId, "viewDetails", false)
        onPermissionChange(group.moduleId, "limitedView", false)
        onPermissionChange(group.moduleId, "limitCount", null)
        onPermissionChange(group.moduleId, "lockPage", false)
      } else {
        onPermissionChange(group.moduleId, "accessLevel", "locked")
        onPermissionChange(group.moduleId, "view", false)
        onPermissionChange(group.moduleId, "viewDetails", false)
        onPermissionChange(group.moduleId, "limitedView", false)
        onPermissionChange(group.moduleId, "limitCount", null)
        onPermissionChange(group.moduleId, "lockPage", true)
      }
    }
  }

  const handleLimitCountChange = (value: string) => {
    // Prevent changing limit count when hidden is selected
    if (isReadOnly || !onPermissionChange || isHidden) return
    const numValue = value === "" ? null : parseInt(value, 10)
    if (numValue !== null && isNaN(numValue)) return
    onPermissionChange(group.moduleId, "limitCount", numValue)
  }

  // Calculate selected count for display
  const getSelectedCount = () => {
    if (isHidden) return 0
    let count = 0
    if (permission.view) count++
    if (permission.viewDetails) count++
    if (permission.limitedView) count++
    if (permission.lockPage) count++
    return count
  }

  const selectedCount = getSelectedCount()
  const totalPermissions = isHidden ? 0 : 4 // view, viewDetails, limitedView, lockPage
  // All selected means: view=true, viewDetails=true, limitedView=false, lockPage=false (full access)
  const allSelected = !isHidden && permission.view && permission.viewDetails && !permission.limitedView && !permission.lockPage
  const someSelected = !isHidden && selectedCount > 0 && !allSelected

  const handleSelectAll = (checked: boolean) => {
    // Prevent select all when hidden is selected
    if (isReadOnly || !onPermissionChange || isHidden) return
    
    if (checked) {
      // Select all = full access (view, viewDetails enabled, limitedView disabled, lockPage disabled)
      onPermissionChange(group.moduleId, "view", true)
      onPermissionChange(group.moduleId, "viewDetails", true)
      onPermissionChange(group.moduleId, "limitedView", false)
      onPermissionChange(group.moduleId, "lockPage", false)
      onPermissionChange(group.moduleId, "limitCount", null)
      onPermissionChange(group.moduleId, "accessLevel", "full_access")
    } else {
      // Deselect all = locked (all permissions disabled)
      onPermissionChange(group.moduleId, "view", false)
      onPermissionChange(group.moduleId, "viewDetails", false)
      onPermissionChange(group.moduleId, "limitedView", false)
      onPermissionChange(group.moduleId, "lockPage", true)
      onPermissionChange(group.moduleId, "limitCount", null)
      onPermissionChange(group.moduleId, "accessLevel", "locked")
    }
  }

  return (
    <Card className="border hover:border-primary/20 transition-colors">
      <CardHeader className="pb-1 px-3 pt-3">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <CardTitle className="text-sm font-semibold truncate" title={group.moduleName}>
            {group.moduleName}
          </CardTitle>
          {!isHidden && (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {selectedCount}/{totalPermissions}
              </span>
              <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) => {
                  handleSelectAll(checked === true)
                }}
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
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-3 pb-3">
        <div className="flex flex-col gap-0.5">
          {/* Hidden checkbox */}
          <div className="flex items-center gap-2 group">
            <Checkbox
              id={`${group.moduleId}-hidden`}
              checked={isHidden}
              onCheckedChange={(checked) => handleHiddenToggle(checked === true)}
              disabled={isReadOnly}
              className="flex-shrink-0"
              aria-label={`Toggle hidden for ${group.moduleName}`}
            />
            <label
              htmlFor={`${group.moduleId}-hidden`}
              className="text-xs cursor-pointer hover:text-primary transition-colors flex-1"
              title="Hide module from sidebar and block routes"
            >
              Hidden
            </label>
            <span className="text-muted-foreground/50 text-xs flex-shrink-0">•</span>
          </div>

          {/* Permissions - only show if not hidden */}
          {!isHidden && (
            <>
              <div className="flex items-center gap-2 group">
                <Checkbox
                  id={`${group.moduleId}-view`}
                  checked={permission.view}
                  onCheckedChange={() => handlePermissionToggle("view", permission.view)}
                  disabled={isReadOnly || permission.lockPage || isHidden}
                  className="flex-shrink-0"
                  aria-label={`Toggle view for ${group.moduleName}`}
                />
                <label
                  htmlFor={`${group.moduleId}-view`}
                  className={`text-xs transition-colors flex-1 ${
                    isHidden ? "cursor-not-allowed text-muted-foreground/50" : "cursor-pointer hover:text-primary"
                  }`}
                  title="Allow viewing the module"
                >
                  View
                </label>
                <span className="text-muted-foreground/50 text-xs flex-shrink-0">•</span>
              </div>
              <div className="flex items-center gap-2 group">
                <Checkbox
                  id={`${group.moduleId}-view-details`}
                  checked={permission.viewDetails}
                  onCheckedChange={() => handlePermissionToggle("viewDetails", permission.viewDetails)}
                  disabled={isReadOnly || permission.lockPage || isHidden}
                  className="flex-shrink-0"
                  aria-label={`Toggle view details for ${group.moduleName}`}
                />
                <label
                  htmlFor={`${group.moduleId}-view-details`}
                  className={`text-xs transition-colors flex-1 ${
                    isHidden ? "cursor-not-allowed text-muted-foreground/50" : "cursor-pointer hover:text-primary"
                  }`}
                  title="Allow viewing detailed information"
                >
                  View Details
                </label>
                <span className="text-muted-foreground/50 text-xs flex-shrink-0">•</span>
              </div>
              <div className="flex items-center gap-2 group">
                <Checkbox
                  id={`${group.moduleId}-limited-view`}
                  checked={permission.limitedView}
                  onCheckedChange={() => handlePermissionToggle("limitedView", permission.limitedView)}
                  disabled={isReadOnly || permission.lockPage || isHidden}
                  className="flex-shrink-0"
                  aria-label={`Toggle limited view for ${group.moduleName}`}
                />
                <label
                  htmlFor={`${group.moduleId}-limited-view`}
                  className={`text-xs transition-colors flex-1 ${
                    isHidden ? "cursor-not-allowed text-muted-foreground/50" : "cursor-pointer hover:text-primary"
                  }`}
                  title="Enable limited view with count restrictions"
                >
                  Limited View
                </label>
                {permission.limitedView && (
                  <Input
                    type="number"
                    placeholder="Count"
                    value={permission.limitCount || ""}
                    onChange={(e) => handleLimitCountChange(e.target.value)}
                    disabled={isReadOnly || permission.lockPage || isHidden}
                    className="h-6 w-16 text-xs px-2 flex-shrink-0"
                    min="1"
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                <span className="text-muted-foreground/50 text-xs flex-shrink-0">•</span>
              </div>
              <div className="flex items-center gap-2 group">
                <Checkbox
                  id={`${group.moduleId}-lock-page`}
                  checked={permission.lockPage}
                  onCheckedChange={() => handlePermissionToggle("lockPage", permission.lockPage)}
                  disabled={isReadOnly || isHidden}
                  className="flex-shrink-0"
                  aria-label={`Toggle lock page for ${group.moduleName}`}
                />
                <label
                  htmlFor={`${group.moduleId}-lock-page`}
                  className={`text-xs transition-colors flex-1 ${
                    isHidden ? "cursor-not-allowed text-muted-foreground/50" : "cursor-pointer hover:text-primary"
                  }`}
                  title="Show lock overlay on the page"
                >
                  Lock Page
                </label>
                <span className="text-muted-foreground/50 text-xs flex-shrink-0">•</span>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

