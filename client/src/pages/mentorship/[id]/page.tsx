

import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useCallback, Suspense } from "react"
import { useParams, useRouter, useSearchParams } from "@/hooks/use-router"
import { ExternalLayout } from "@/components/layout/external-layout"
import { Course } from "@/types/courses"
import { Loader } from "@/components/ui/loader"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { CourseSidebar } from "./components/course-sidebar"
import { CourseVideoPlayer } from "./components/course-video-player"
import { CourseContentTabs } from "./components/course-content-tabs"

function CourseDetailContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const courseId = params.id as string
  
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)

  const moduleIdFromUrl = searchParams.get('module')

  const fetchCourse = useCallback(async () => {
    if (!courseId || courseId === 'undefined' || courseId === 'null') {
      setError('Course ID is missing or invalid')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await apiFetch(`/api/courses/${courseId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Course not found')
        } else {
          const errorData = await response.json().catch(() => ({}))
          setError(errorData.error || 'Failed to fetch course')
        }
        setLoading(false)
        return
      }
      
      const data = await response.json()
      
      if (!data.course) {
        setError('Course data is missing')
        setLoading(false)
        return
      }
      
      setCourse(data.course)
      
      if (moduleIdFromUrl) {
        setSelectedModuleId(moduleIdFromUrl)
      } else if (data.course.modules && data.course.modules.length > 0) {
        setSelectedModuleId(data.course.modules[0].id)
      }
    } catch (err) {
      console.error("Error fetching course:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to load course. Please try again."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [courseId, moduleIdFromUrl])

  useEffect(() => {
    if (courseId) {
      fetchCourse()
    }
  }, [courseId, fetchCourse])

  const handleModuleSelect = useCallback((moduleId: string) => {
    setSelectedModuleId(moduleId)
    router.push(`/mentorship/${courseId}?module=${moduleId}`, { scroll: false })
  }, [courseId, router])

  const currentModule = course?.modules?.find(m => m.id === selectedModuleId)

  const currentModuleIndex = course?.modules?.findIndex(m => m.id === selectedModuleId) ?? -1

  const getNextModule = useCallback(() => {
    if (!course?.modules || currentModuleIndex < 0) return null
    if (currentModuleIndex < course.modules.length - 1) {
      return course.modules[currentModuleIndex + 1]
    }
    return null
  }, [course, currentModuleIndex])

  const handleNextLesson = useCallback(() => {
    const next = getNextModule()
    if (next) {
      handleModuleSelect(next.id)
    }
  }, [getNextModule, handleModuleSelect])

  const handleClose = useCallback(() => {
    router.push('/mentorship')
  }, [router])

  if (loading) {
    return (
      <ExternalLayout>
          <div className="flex flex-1 items-center justify-center p-8">
            <Loader />
          </div>
      </ExternalLayout>
    )
  }

  if (error || !course) {
    return (
      <ExternalLayout>
          <div className="flex flex-1 flex-col items-center justify-center p-8">
            <Alert variant="destructive" className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error || 'Course not found'}</AlertDescription>
            </Alert>
          </div>
      </ExternalLayout>
    )
  }

  return (
    <ExternalLayout>
        <div className="flex flex-1 flex-col h-[calc(100vh-4rem)] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b bg-background">
            <button
              onClick={handleClose}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Close
            </button>
            <div className="text-sm text-muted-foreground">
              Module {currentModuleIndex + 1} of {course.modules?.length || 0}
            </div>
            <button
              onClick={handleNextLesson}
              disabled={!getNextModule()}
              className="text-sm text-primary hover:text-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Module
            </button>
          </div>

          <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
            <div className="w-full lg:w-[400px] border-r bg-background overflow-hidden flex-shrink-0">
              <CourseSidebar
                course={course}
                selectedModuleId={selectedModuleId}
                onModuleSelect={handleModuleSelect}
              />
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50/50">
              {currentModule ? (
                <div className="p-6 space-y-6">
                  <CourseVideoPlayer
                    module={currentModule}
                    courseId={courseId}
                    moduleId={selectedModuleId!}
                  />

                  <div>
                    <h2 className="text-xl font-semibold">{currentModule.title}</h2>
                    {currentModule.description && (
                      <p className="text-sm text-muted-foreground mt-1">{currentModule.description}</p>
                    )}
                  </div>

                  <CourseContentTabs
                    module={currentModule}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full p-8">
                  <p className="text-muted-foreground">Select a module to view content</p>
                </div>
              )}
            </div>
          </div>
        </div>
    </ExternalLayout>
  )
}

export default function CourseDetailPage() {
  return (
    <Suspense fallback={
      <ExternalLayout>
          <div className="flex flex-1 items-center justify-center p-8">
            <Loader />
          </div>
      </ExternalLayout>
    }>
      <CourseDetailContent />
    </Suspense>
  )
}
