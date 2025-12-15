"use client"

import { useState, useEffect, useCallback } from "react"

interface Role {
  value: string
  label: string
}

interface Plan {
  value: string
  label: string
}

interface UsePermissionsDataReturn {
  roles: Role[]
  plans: Plan[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function usePermissionsData(): UsePermissionsDataReturn {
  const [roles, setRoles] = useState<Role[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // In real implementation, these would be API calls
      // For now, using mock data structure
      const mockRoles: Role[] = [
        { value: "superadmin", label: "Super Admin" },
        { value: "admin", label: "Admin" },
        { value: "manager", label: "Manager" },
        { value: "executive", label: "Executive" },
      ]

      const mockPlans: Plan[] = [
        { value: "free", label: "Free" },
        { value: "trial", label: "Trial" },
        { value: "pro", label: "Pro" },
        { value: "premium", label: "Premium" },
        { value: "enterprise", label: "Enterprise" },
      ]

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      setRoles(mockRoles)
      setPlans(mockPlans)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load data"
      setError(errorMessage)
      console.error("Error fetching permissions data:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    roles,
    plans,
    loading,
    error,
    refetch: fetchData,
  }
}























