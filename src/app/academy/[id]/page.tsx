"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Topbar } from "@/components/layout/topbar"
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
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null)

  // Get module and chapter from URL params
  const moduleIdFromUrl = searchParams.get('module')
  const chapterIdFromUrl = searchParams.get('chapter')

  const fetchCourse = useCallback(async () => {
    // Prevent fetching if courseId is invalid
    if (!courseId || courseId === 'undefined' || courseId === 'null') {
      setError('Course ID is missing or invalid')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/courses/${courseId}`)
      
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
      
      // Set initial module and chapter from URL or default to first
      if (moduleIdFromUrl && chapterIdFromUrl) {
        setSelectedModuleId(moduleIdFromUrl)
        setSelectedChapterId(chapterIdFromUrl)
      } else if (data.course.modules && data.course.modules.length > 0) {
        const firstModule = data.course.modules[0]
        setSelectedModuleId(firstModule.id)
        if (firstModule.chapters && firstModule.chapters.length > 0) {
          setSelectedChapterId(firstModule.chapters[0].id)
        }
      }
    } catch (err) {
      console.error("Error fetching course:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to load course. Please try again."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [courseId, moduleIdFromUrl, chapterIdFromUrl])

  useEffect(() => {
    if (courseId) {
      fetchCourse()
    }
  }, [courseId, fetchCourse])

  // Update URL when chapter changes
  const handleChapterSelect = useCallback((moduleId: string, chapterId: string) => {
    setSelectedModuleId(moduleId)
    setSelectedChapterId(chapterId)
    router.push(`/academy/${courseId}?module=${moduleId}&chapter=${chapterId}`, { scroll: false })
  }, [courseId, router])

  // Get current chapter data
  const currentChapter = course?.modules
    ?.find(m => m.id === selectedModuleId)
    ?.chapters?.find(c => c.id === selectedChapterId)

  // Get next chapter
  const getNextChapter = useCallback(() => {
    if (!course?.modules || !selectedModuleId || !selectedChapterId) return null

    const currentModule = course.modules.find(m => m.id === selectedModuleId)
    if (!currentModule?.chapters) return null

    const currentIndex = currentModule.chapters.findIndex(c => c.id === selectedChapterId)
    if (currentIndex < currentModule.chapters.length - 1) {
      // Next chapter in same module
      return {
        moduleId: selectedModuleId,
        chapterId: currentModule.chapters[currentIndex + 1].id
      }
    } else {
      // Find next module with chapters
      const currentModuleIndex = course.modules.findIndex(m => m.id === selectedModuleId)
      for (let i = currentModuleIndex + 1; i < course.modules.length; i++) {
        const nextModule = course.modules[i]
        if (nextModule && nextModule.chapters && nextModule.chapters.length > 0) {
          return {
            moduleId: nextModule.id,
            chapterId: nextModule.chapters[0].id
          }
        }
      }
    }
    return null
  }, [course, selectedModuleId, selectedChapterId])

  const handleNextLesson = useCallback(() => {
    const next = getNextChapter()
    if (next) {
      handleChapterSelect(next.moduleId, next.chapterId)
    }
  }, [getNextChapter, handleChapterSelect])

  const handleClose = useCallback(() => {
    router.push('/academy')
  }, [router])

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Topbar />
          <div className="flex flex-1 items-center justify-center p-8">
            <Loader />
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (error || !course) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Topbar />
          <div className="flex flex-1 flex-col items-center justify-center p-8">
            <Alert variant="destructive" className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error || 'Course not found'}</AlertDescription>
            </Alert>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <div className="flex flex-1 flex-col h-[calc(100vh-4rem)] overflow-hidden">
          {/* Header with Close and Next Lesson buttons */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-background">
            <button
              onClick={handleClose}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Close
            </button>
            <div className="text-sm text-muted-foreground">
              Lesson {((course.modules?.flatMap(m => m.chapters || []) ?? []).findIndex(c => c.id === selectedChapterId) + 1) || 0} of {course.lessons_count}
            </div>
            <button
              onClick={handleNextLesson}
              disabled={!getNextChapter()}
              className="text-sm text-primary hover:text-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Lesson
            </button>
          </div>

          {/* Main Content: Sidebar + Video/Content */}
          <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
            {/* Left Sidebar - Course Navigation */}
            <div className="w-full lg:w-[400px] border-r bg-background overflow-hidden flex-shrink-0">
              <CourseSidebar
                course={course}
                selectedModuleId={selectedModuleId}
                selectedChapterId={selectedChapterId}
                onChapterSelect={handleChapterSelect}
              />
            </div>

            {/* Right Main Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50/50">
              {currentChapter ? (
                <div className="p-6 space-y-6">
                  {/* Video Player - Only show for video content */}
                  {currentChapter.content_type === 'video' && (
                    <CourseVideoPlayer
                      chapter={currentChapter}
                      courseId={courseId}
                      moduleId={selectedModuleId!}
                      chapterId={selectedChapterId!}
                    />
                  )}

                  {/* Content Tabs */}
                  <CourseContentTabs
                    course={course}
                    chapter={currentChapter}
                    moduleId={selectedModuleId!}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full p-8">
                  <p className="text-muted-foreground">Select a chapter to view content</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function CourseDetailPage() {
  return (
    <Suspense fallback={
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Topbar />
          <div className="flex flex-1 items-center justify-center p-8">
            <Loader />
          </div>
        </SidebarInset>
      </SidebarProvider>
    }>
      <CourseDetailContent />
    </Suspense>
  )
}
