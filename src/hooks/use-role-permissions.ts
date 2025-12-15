"use client"

import { useState, useCallback } from "react"
import { RolePermissions } from "@/types/admin/permissions"

interface UseRolePermissionsReturn {
  permissions: RolePermissions
  loading: boolean
  saving: boolean
  error: string | null
  loadPermissions: (role: string, mockPermissions: Record<string, RolePermissions>) => void
  updatePermission: (key: string, value: boolean) => void
  savePermissions: (role: string) => Promise<void>
}

export function useRolePermissions(): UseRolePermissionsReturn {
  const [permissions, setPermissions] = useState<RolePermissions>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadPermissions = useCallback(
    (role: string, mockPermissions: Record<string, RolePermissions>) => {
      setLoading(true)
      setError(null)
      try {
        const rolePerms = mockPermissions[role] || {}
        setPermissions(rolePerms)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load permissions"
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const updatePermission = useCallback((key: string, value: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  const savePermissions = useCallback(async (role: string) => {
    try {
      setSaving(true)
      setError(null)
      // In real implementation, this would save to the database
      await new Promise((resolve) => setTimeout(resolve, 500))
      console.log("Permissions saved for role:", role, permissions)
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
    loadPermissions,
    updatePermission,
    savePermissions,
  }
}























