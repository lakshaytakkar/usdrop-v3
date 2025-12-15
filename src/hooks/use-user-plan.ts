"use client"

import { useState, useEffect } from "react"

interface UseUserPlanReturn {
  plan: string | null
  isFree: boolean
  isLoading: boolean
}

export function useUserPlan(): UseUserPlanReturn {
  const [plan, setPlan] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        // Fetch user profile to get plan
        const response = await fetch("/api/auth/user")
        
        if (response.ok) {
          const data = await response.json()
          setPlan(data.plan || "free")
        } else {
          // Default to free if unable to fetch
          setPlan("free")
        }
      } catch (error) {
        console.error("Error fetching user plan:", error)
        setPlan("free")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserPlan()
  }, [])

  const isFree = plan === "free" || plan === null

  return {
    plan,
    isFree,
    isLoading,
  }
}

