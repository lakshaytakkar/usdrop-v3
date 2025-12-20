"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Info, Check } from "lucide-react"
import { PermissionsMatrix } from "./components/permissions-matrix"
import { PlanPermissionsMatrix } from "./components/plan-permissions-matrix"
import { RolePermissions, ExternalPlanPermissions, ExternalPlanPermission } from "@/types/admin/permissions"
import {
  mockPermissionDefinitions,
  mockRolePermissions,
  externalUserPermissionDefinitions,
} from "./data/permissions"

export default function AdminPermissionsPage() {
  const [selectedRole, setSelectedRole] = useState("superadmin")
  const [selectedPlan, setSelectedPlan] = useState("free")
  const [rolePermissions, setRolePermissions] = useState<RolePermissions>(
    mockRolePermissions[selectedRole] || {}
  )
  const [planPermissions, setPlanPermissions] = useState<ExternalPlanPermissions>({})
  const [openingCredits, setOpeningCredits] = useState<Record<string, number>>({
    free: 0,
    pro: 500,
  })
  const [isReadOnly, setIsReadOnly] = useState(false) // Set to true for non-superadmin users
  const [saving, setSaving] = useState(false)
  const [savingPlan, setSavingPlan] = useState(false)

  const roles = [
    { value: "superadmin", label: "Super Admin" },
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "executive", label: "Executive" },
  ]

  const plans = [
    { value: "free", label: "Free" },
    { value: "pro", label: "Pro" },
  ]

  const modules = ["users", "plans", "internal_users", "external_users", "products"]

  const handleRoleChange = (role: string) => {
    setSelectedRole(role)
    setRolePermissions(mockRolePermissions[role] || {})
  }

  const handlePermissionChange = (permissionKey: string, allowed: boolean) => {
    if (isReadOnly) return
    setRolePermissions((prev) => ({
      ...prev,
      [permissionKey]: allowed,
    }))
    // In real implementation, this would save to the database
  }

  const handleSavePermissions = async () => {
    if (isReadOnly) return
    try {
      setSaving(true)
      // In real implementation, this would save to the database
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
      console.log("Permissions saved:", rolePermissions)
      // Show success message
    } catch (error) {
      console.error("Error saving permissions:", error)
      // Show error message
    } finally {
      setSaving(false)
    }
  }

  const initializePlanPermissions = (plan: string) => {
    // Initialize plan permissions - in real implementation, fetch from database
    const planPerms: ExternalPlanPermissions = {}
    
    // Initialize all modules with default permissions
    externalUserPermissionDefinitions.forEach((group) => {
      planPerms[group.moduleId] = {
        moduleId: group.moduleId,
        accessLevel: "locked",
        view: false,
        viewDetails: false,
        limitedView: false,
        limitCount: null,
        lockPage: false,
      }
    })
    
    // Only two plans: Free and Pro
    // Free: Only dashboard access, everything else locked with overlay
    // Pro: Full access to all features (except admin pages)
    if (plan === "free") {
      // Free plan: Only "home" (My Dashboard) is accessible, everything else locked
      Object.keys(planPerms).forEach((moduleId) => {
        if (moduleId === "home") {
          // Dashboard is accessible for free users
          planPerms[moduleId] = {
            ...planPerms[moduleId],
            accessLevel: "full_access",
            view: true,
            viewDetails: true,
            limitedView: false,
            limitCount: null,
            lockPage: false,
          }
        } else {
          // All other features show locked overlay
          planPerms[moduleId] = {
            ...planPerms[moduleId],
            accessLevel: "locked",
            view: false,
            viewDetails: false,
            limitedView: false,
            limitCount: null,
            lockPage: true,
          }
        }
      })
    } else if (plan === "pro") {
      // Pro plan: Full access to all features
      Object.keys(planPerms).forEach((moduleId) => {
        planPerms[moduleId] = {
          ...planPerms[moduleId],
          accessLevel: "full_access",
          view: true,
          viewDetails: true,
          limitedView: false,
          lockPage: false,
        }
      })
    }
    
    setPlanPermissions(planPerms)
  }

  const handlePlanChange = (plan: string) => {
    setSelectedPlan(plan)
    initializePlanPermissions(plan)
  }

  // Initialize plan permissions on mount
  useEffect(() => {
    initializePlanPermissions(selectedPlan)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePlanPermissionChange = (
    moduleId: string,
    field: keyof ExternalPlanPermission,
    value: any
  ) => {
    if (isReadOnly) return
    setPlanPermissions((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [field]: value,
      },
    }))
  }

  const handlePlanPermissionBatchUpdate = (
    moduleId: string,
    updates: Partial<ExternalPlanPermission>
  ) => {
    if (isReadOnly) return
    setPlanPermissions((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        ...updates,
      },
    }))
  }

  const handleOpeningCreditsChange = (plan: string, value: string) => {
    if (isReadOnly) return
    const numValue = value === "" ? 0 : parseInt(value, 10)
    if (isNaN(numValue)) return
    setOpeningCredits({
      ...openingCredits,
      [plan]: numValue,
    })
  }

  const handleSavePlanPermissions = async () => {
    if (isReadOnly) return
    try {
      setSavingPlan(true)
      // In real implementation, this would save to the database
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
      console.log("Plan permissions saved:", planPermissions)
      console.log("Opening credits saved:", openingCredits)
      // Show success message
    } catch (error) {
      console.error("Error saving plan permissions:", error)
      // Show error message
    } finally {
      setSavingPlan(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight">Permissions Management</h1>
            {isReadOnly && (
              <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300">
                Read-Only
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isReadOnly
              ? "View permissions and access control for roles and plans. Only superadmin users can modify permissions."
              : "Manage permissions and access control for roles and plans."}
          </p>
        </div>
      </div>

      {isReadOnly && (
        <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-amber-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                  Read-Only Access
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  You are viewing permissions in read-only mode. Only superadmin users can modify
                  permissions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="roles" className="space-y-3">
        <TabsList>
          <TabsTrigger value="roles">Internal Roles</TabsTrigger>
          <TabsTrigger value="plans">External Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <label className="text-sm font-medium">Select Role:</label>
              <Select value={selectedRole} onValueChange={handleRoleChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleSavePermissions}
              disabled={saving || isReadOnly}
              className="gap-2"
            >
              {saving ? (
                "Saving..."
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Save Permissions
                </>
              )}
            </Button>
          </div>

          <PermissionsMatrix
            permissionDefinitions={mockPermissionDefinitions}
            rolePermissions={rolePermissions}
            selectedRole={selectedRole}
            isReadOnly={isReadOnly}
            onPermissionChange={handlePermissionChange}
          />
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4 flex-1 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Select Plan:</label>
                <Select value={selectedPlan} onValueChange={handlePlanChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((plan) => (
                      <SelectItem key={plan.value} value={plan.value}>
                        {plan.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="opening-credits" className="text-sm font-medium">
                  Opening Credits:
                </Label>
                <Input
                  id="opening-credits"
                  type="number"
                  placeholder="e.g., 1000"
                  value={openingCredits[selectedPlan] || ""}
                  onChange={(e) => handleOpeningCreditsChange(selectedPlan, e.target.value)}
                  disabled={isReadOnly}
                  className="w-[120px]"
                  min="0"
                />
              </div>
            </div>
            <Button
              onClick={handleSavePlanPermissions}
              disabled={savingPlan || isReadOnly}
              className="gap-2"
            >
              {savingPlan ? (
                "Saving..."
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Save Permissions
                </>
              )}
            </Button>
          </div>

          <PlanPermissionsMatrix
            permissionDefinitions={externalUserPermissionDefinitions}
            planPermissions={planPermissions}
            selectedPlan={selectedPlan}
            isReadOnly={isReadOnly}
            onPermissionChange={handlePlanPermissionChange}
            onPermissionBatchUpdate={handlePlanPermissionBatchUpdate}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

