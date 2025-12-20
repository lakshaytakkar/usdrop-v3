"use client"

import { useState, useCallback } from "react"
import { ExternalPlanPermissions, ExternalPlanPermission } from "@/types/admin/permissions"

interface UsePlanPermissionsReturn {
  permissions: ExternalPlanPermissions
  loading: boolean
  saving: boolean
  error: string | null
  updatePermission: (moduleId: string, field: keyof ExternalPlanPermission, value: any) => void
  batchUpdate: (moduleId: string, updates: Partial<ExternalPlanPermission>) => void
  savePermissions: (planId: string) => Promise<void>
  initializePermissions: (plan: string, definitions: any[]) => void
}

export function usePlanPermissions(): UsePlanPermissionsReturn {
  const [permissions, setPermissions] = useState<ExternalPlanPermissions>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updatePermission = useCallback(
    (moduleId: string, field: keyof ExternalPlanPermission, value: any) => {
      setPermissions((prev) => {
        const currentPerm = prev[moduleId] || {
          moduleId,
          accessLevel: "locked" as const,
          view: false,
          viewDetails: false,
          limitedView: false,
          limitCount: null,
          lockPage: false,
        }
        return {
          ...prev,
          [moduleId]: {
            ...currentPerm,
            [field]: value,
          },
        }
      })
    },
    []
  )

  const batchUpdate = useCallback((moduleId: string, updates: Partial<ExternalPlanPermission>) => {
    setPermissions((prev) => {
      const currentPerm = prev[moduleId] || {
        moduleId,
        accessLevel: "locked" as const,
        view: false,
        viewDetails: false,
        limitedView: false,
        limitCount: null,
        lockPage: false,
      }
      return {
        ...prev,
        [moduleId]: {
          ...currentPerm,
          ...updates,
        },
      }
    })
  }, [])

  const initializePermissions = useCallback((plan: string, definitions: any[]) => {
    setLoading(true)
    try {
      const planPerms: ExternalPlanPermissions = {}

      definitions.forEach((group) => {
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

      // Set defaults based on plan - Only Free and Pro
      // Free: Only dashboard access, everything else locked with overlay
      // Pro: Full access to all features (except admin pages)
      if (plan === "free") {
        Object.keys(planPerms).forEach((moduleId) => {
          if (moduleId === "home") {
            // Dashboard is accessible for free users
            planPerms[moduleId] = {
              ...planPerms[moduleId],
              accessLevel: "full_access",
              view: true,
              viewDetails: true,
            }
          } else {
            // All other features show locked overlay
            planPerms[moduleId] = {
              ...planPerms[moduleId],
              accessLevel: "locked",
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
          }
        })
      }

      setPermissions(planPerms)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to initialize permissions"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const savePermissions = useCallback(async (planId: string) => {
    try {
      setSaving(true)
      setError(null)
      // In real implementation, this would save to the database
      await new Promise((resolve) => setTimeout(resolve, 500))
      console.log("Plan permissions saved for plan:", planId, permissions)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save permissions"
      setError(errorMessage)
      throw err
    } finally {
      setSaving(false)
    }
  }, [permissions])

  return {
    permissions,
    loading,
    saving,
    error,
    updatePermission,
    batchUpdate,
    savePermissions,
    initializePermissions,
  }
}





