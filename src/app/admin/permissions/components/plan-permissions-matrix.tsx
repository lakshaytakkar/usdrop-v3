"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { PermissionLevel } from "@/types/admin/permissions"

interface PlanPermissionsMatrixProps {
  planPermissions: Record<string, Record<string, PermissionLevel>>
  selectedPlan: string
  modules: string[]
  isReadOnly?: boolean
  onPermissionChange?: (planId: string, moduleId: string, level: PermissionLevel) => void
}

const permissionLevelLabels: Record<PermissionLevel, string> = {
  trial: "Trial",
  hidden: "Hidden",
  locked: "Locked",
  limited_access: "Limited",
  full_access: "Full Access",
}

const permissionLevelVariants: Record<PermissionLevel, "default" | "secondary" | "destructive" | "outline"> = {
  trial: "outline",
  hidden: "destructive",
  locked: "secondary",
  limited_access: "outline",
  full_access: "default",
}

export function PlanPermissionsMatrix({
  planPermissions,
  selectedPlan,
  modules,
  isReadOnly = false,
  onPermissionChange,
}: PlanPermissionsMatrixProps) {
  const selectedPlanPermissions = planPermissions[selectedPlan] || {}

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search modules..." className="max-w-sm" />
      </div>

      <div className="space-y-4">
        {modules.map((moduleId) => {
          const level = selectedPlanPermissions[moduleId] || "locked"
          return (
            <Card key={moduleId}>
              <CardHeader>
                <CardTitle className="text-lg capitalize">{moduleId.replace(/_/g, " ")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      Permission level for this module in the {selectedPlan} plan
                    </p>
                  </div>
                  <Badge variant={permissionLevelVariants[level]}>
                    {permissionLevelLabels[level]}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

