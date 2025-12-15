import { useState, useEffect } from "react"

interface DashboardStats {
  products: {
    total: number
    inPicklist: number
    winning: number
  }
  stores: {
    total: number
    connected: number
    active: number
  }
  learning: {
    progress: number
    completedVideos: number
    totalVideos: number
    enrolledCourses: number
  }
  activity: {
    lastActivityDate: string | null
    streakDays: number
  }
}

interface UseDashboardStatsReturn {
  stats: DashboardStats | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useDashboardStats(): UseDashboardStatsReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/dashboard/stats")
      
      if (!response.ok) {
        // For any error response, return default stats instead of throwing
        // This ensures the UI always works even if the API fails
        const defaultStats = {
          products: { total: 0, inPicklist: 0, winning: 0 },
          stores: { total: 0, connected: 0, active: 0 },
          learning: { progress: 0, completedVideos: 0, totalVideos: 0, enrolledCourses: 0 },
          activity: { lastActivityDate: null, streakDays: 0 }
        }
        
        // Only log error for debugging, but don't throw
        if (response.status !== 401) {
          console.warn(`Dashboard stats API returned ${response.status}. Using default stats.`)
        }
        
        setStats(defaultStats)
        return
      }

      const data = await response.json()
      setStats(data)
    } catch (err) {
      // Network errors or JSON parsing errors
      console.warn("Error fetching dashboard stats:", err)
      // Set default stats on error so UI doesn't break
      setStats({
        products: { total: 0, inPicklist: 0, winning: 0 },
        stores: { total: 0, connected: 0, active: 0 },
        learning: { progress: 0, completedVideos: 0, totalVideos: 0, enrolledCourses: 0 },
        activity: { lastActivityDate: null, streakDays: 0 }
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats
  }
}

