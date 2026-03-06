import { useState, useEffect, useCallback } from "react"
import { apiFetch } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { freeLearningModules } from "@/pages/free-learning/data"

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

const allLessonIds = freeLearningModules.flatMap(m => m.lessons.map(l => l.id))
const TOTAL_LESSONS = allLessonIds.length

export function useFreeLearningStatus(): FreeLearningStatus {
  const { user, loading: authLoading } = useAuth()
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([])
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

      const response = await apiFetch("/api/learning/progress")

      if (response.ok) {
        const data = await response.json()
        const serverLessonIds: string[] = (data.lessons || []).map((l: any) => l.lesson_id)
        const validIds = serverLessonIds.filter(id => allLessonIds.includes(id))
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
  const progress = TOTAL_LESSONS > 0 ? Math.round((completedCount / TOTAL_LESSONS) * 100) : 0

  return {
    isFreeLearningComplete: completedCount >= TOTAL_LESSONS,
    freeLearningProgress: progress,
    completedLessons: completedCount,
    totalLessons: TOTAL_LESSONS,
    completedLessonIds,
    isLoading,
    error,
    refetch: fetchProgress,
  }
}
