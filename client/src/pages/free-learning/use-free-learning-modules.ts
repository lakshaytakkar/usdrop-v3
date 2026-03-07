import { useState, useEffect, useCallback, useMemo } from "react"
import { apiFetch } from "@/lib/supabase"
import type { FreeLearningModule, FreeLearningLesson } from "./data"
import { freeLearningModules as fallbackModules } from "./data"

interface UseFreeLearningModulesResult {
  modules: FreeLearningModule[]
  isLoading: boolean
  totalLessons: number
  findLesson: (lessonId: string) => { module: FreeLearningModule; lesson: FreeLearningLesson; lessonIndex: number; moduleIndex: number } | null
  getNextLesson: (currentLessonId: string) => FreeLearningLesson | null
  getPrevLesson: (currentLessonId: string) => FreeLearningLesson | null
}

function mapApiToModules(apiData: any): FreeLearningModule[] {
  if (!apiData?.modules || !Array.isArray(apiData.modules)) return []

  return apiData.modules.map((mod: any) => {
    const lessons: FreeLearningLesson[] = (mod.videos || []).map((v: any) => ({
      id: v.id,
      title: v.title,
      duration: v.video_duration || "",
      videoUrl: v.video_url || null,
      externalUrl: v.external_url || null,
      description: v.description || "",
      tags: v.tags || [],
      thumbnail: v.thumbnail || undefined,
    }))

    const totalMinutes = lessons.reduce((sum, l) => {
      const match = l.duration.match(/(\d+)/)
      return sum + (match ? parseInt(match[1], 10) : 0)
    }, 0)

    return {
      id: mod.id,
      title: mod.title,
      lessons,
      totalDuration: totalMinutes > 0 ? `${totalMinutes} mins` : "",
    }
  })
}

export function useFreeLearningModules(): UseFreeLearningModulesResult {
  const [modules, setModules] = useState<FreeLearningModule[]>(fallbackModules)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    apiFetch('/api/learning/modules')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then(data => {
        if (cancelled) return
        const mapped = mapApiToModules(data)
        if (mapped.length > 0) {
          setModules(mapped)
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  const totalLessons = useMemo(() =>
    modules.reduce((acc, m) => acc + m.lessons.length, 0),
    [modules]
  )

  const findLesson = useCallback((lessonId: string) => {
    for (let mi = 0; mi < modules.length; mi++) {
      const mod = modules[mi]
      for (let li = 0; li < mod.lessons.length; li++) {
        if (mod.lessons[li].id === lessonId) {
          return { module: mod, lesson: mod.lessons[li], lessonIndex: li, moduleIndex: mi }
        }
      }
    }
    return null
  }, [modules])

  const getNextLesson = useCallback((currentLessonId: string) => {
    const allLessons = modules.flatMap(m => m.lessons)
    const idx = allLessons.findIndex(l => l.id === currentLessonId)
    if (idx >= 0 && idx < allLessons.length - 1) {
      return allLessons[idx + 1]
    }
    return null
  }, [modules])

  const getPrevLesson = useCallback((currentLessonId: string) => {
    const allLessons = modules.flatMap(m => m.lessons)
    const idx = allLessons.findIndex(l => l.id === currentLessonId)
    if (idx > 0) {
      return allLessons[idx - 1]
    }
    return null
  }, [modules])

  return { modules, isLoading, totalLessons, findLesson, getNextLesson, getPrevLesson }
}
