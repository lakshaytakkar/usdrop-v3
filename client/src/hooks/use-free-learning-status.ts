import { useState, useEffect, useCallback } from "react"
import { apiFetch } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { freeLearningModules } from "@/pages/free-learning/data"

const fallbackLessonIds = freeLearningModules.flatMap(m => m.lessons.map(l => l.id))
const FALLBACK_TOTAL = fallbackLessonIds.length

interface FreeLearningStatus {
  isFreeLearningComplete: boolean
  freeLearningProgress: number
  completedLessons: number
  totalLessons: number
  completedLessonIds: string[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useFreeLearningStatus(): FreeLearningStatus {
  const { user, loading: authLoading } = useAuth()
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([])
  const [totalLessons, setTotalLessons] = useState(FALLBACK_TOTAL)
  const [allLessonIds, setAllLessonIds] = useState<string[]>(fallbackLessonIds)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProgress = useCallback(async () => {
    if (!user) {
      setCompletedLessonIds([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const [progressRes, modulesRes] = await Promise.all([
        apiFetch("/api/learning/progress"),
        apiFetch("/api/learning/modules"),
      ])

      let fetchedLessonIds: string[] = fallbackLessonIds
      if (modulesRes.ok) {
        const modulesData = await modulesRes.json()
        const apiIds = (modulesData.modules || []).flatMap((m: any) =>
          (m.videos || []).map((v: any) => v.id)
        )
        if (apiIds.length > 0) {
          fetchedLessonIds = apiIds
          setAllLessonIds(apiIds)
          setTotalLessons(modulesData.totalVideos || apiIds.length)
        }
      }

      if (progressRes.ok) {
        const data = await progressRes.json()
        const serverLessonIds: string[] = (data.lessons || []).map((l: any) => l.lesson_id)
        const validIds = serverLessonIds.filter(id => fetchedLessonIds.includes(id))
        setCompletedLessonIds(validIds)
      } else {
        setCompletedLessonIds([])
      }
    } catch (err) {
      console.error("Error fetching free learning progress:", err)
      setError(err instanceof Error ? err.message : "Failed to load progress")
      setCompletedLessonIds([])
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (authLoading) return
    fetchProgress()
  }, [authLoading, fetchProgress])

  const completedCount = completedLessonIds.length
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  return {
    isFreeLearningComplete: totalLessons > 0 && completedCount >= totalLessons,
    freeLearningProgress: progress,
    completedLessons: completedCount,
    totalLessons,
    completedLessonIds,
    isLoading,
    error,
    refetch: fetchProgress,
  }
}
