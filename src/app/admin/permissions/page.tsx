"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { RolePermissions } from "@/types/admin/permissions"
import {
  mockPermissionDefinitions,
  mockRolePermissions,
  mockPlanPermissions,
} from "./data/permissions"

export default function AdminPermissionsPage() {
  const [selectedRole, setSelectedRole] = useState("superadmin")
  const [selectedPlan, setSelectedPlan] = useState("free")
  const [rolePermissions, setRolePermissions] = useState<RolePermissions>(
    mockRolePermissions[selectedRole] || {}
  )
  const [isReadOnly, setIsReadOnly] = useState(false) // Set to true for non-superadmin users
  const [saving, setSaving] = useState(false)

  const roles = [
    { value: "superadmin", label: "Super Admin" },
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "executive", label: "Executive" },
  ]

  const plans = [
    { value: "free", label: "Free" },
    { value: "trial", label: "Trial" },
    { value: "pro", label: "Pro" },
    { value: "premium", label: "Premium" },
    { value: "enterprise", label: "Enterprise" },
  ]

  const modules = ["users", "plans", "internal_users", "external_users", "products"]

  const handleRoleChange = (role: string) => {
    setSelectedRole(role)
    setRolePermissions(mockRolePermissions[role] || {})
  }

  const handlePermissionChange = (permissionKey: string, allowed: boolean) => {
    if (isReadOnly) return
    setRolePermissions({
      ...rolePermissions,
      [permissionKey]: allowed,
    })
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

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold tracking-tight">Permissions Management</h1>
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

      <Tabs defaultValue="roles" className="space-y-4">
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
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Select Plan:</label>
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
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
            </CardContent>
          </Card>

          <PlanPermissionsMatrix
            planPermissions={mockPlanPermissions}
            selectedPlan={selectedPlan}
            modules={modules}
            isReadOnly={isReadOnly}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

