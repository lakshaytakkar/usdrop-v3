"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowLeft
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Fallback thumbnails for onboarding chapters
const CHAPTER_THUMBNAILS = [
  "/images/thumbnail-store-setup.png",
  "/images/thumbnail-product-research.png",
  "/images/thumbnail-supplier-management.png",
  "/images/thumbnail-store-research.png",
  "/images/thumbnail-financial-planning.png",
  "/images/thumbnail-ai-marketing.png",
  "/images/thumbnail-scaling-automation.png",
  "/images/thumbnail-advanced-facebook-ads.png",
]

interface OnboardingVideo {
  id: string
  module_id: string
  title: string
  description: string | null
  video_url: string | null
  video_storage_path?: string | null
  video_source?: 'upload' | 'embed'
  video_duration: number | null
  thumbnail: string | null
  order_index: number
}

interface OnboardingModule {
  id: string
  title: string
  description: string | null
  order_index: number
  thumbnail: string | null
  onboarding_videos?: OnboardingVideo[]
  videos?: OnboardingVideo[]
}

interface ProgressItem {
  video_id: string
  completed: boolean
  watch_duration: number
  last_position: number
}

function OnboardingModuleContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const moduleId = params.id as string

  const [module, setModule] = useState<OnboardingModule | null>(null)
  const [allVideos, setAllVideos] = useState<OnboardingVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null)
  const [completedVideoIds, setCompletedVideoIds] = useState<Set<string>>(new Set())
  const [markingComplete, setMarkingComplete] = useState(false)

  const videoIdFromUrl = searchParams.get("video")

  // Fetch module and videos
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch course data
      const courseResponse = await fetch("/api/onboarding/course")
      if (!courseResponse.ok) {
        throw new Error("Failed to fetch onboarding data")
      }
      const courseData = await courseResponse.json()

      const modules: OnboardingModule[] = courseData.modules || []

      // Build a flat list of all onboarding videos (chapters) with thumbnails
      const flatVideos: OnboardingVideo[] = modules
        .flatMap((m: OnboardingModule, moduleIndex: number) => {
          const sourceVideos = m.onboarding_videos || m.videos || []
          return sourceVideos.map((video) => ({
            ...video,
            thumbnail:
              video.thumbnail ||
              m.thumbnail ||
              CHAPTER_THUMBNAILS[moduleIndex % CHAPTER_THUMBNAILS.length],
          }))
        })
        .sort((a, b) => a.order_index - b.order_index)

      setAllVideos(flatVideos)

      // Find the specific module for this page
      const foundModule = modules.find(
        (m: OnboardingModule) => m.id === moduleId
      )

      if (!foundModule) {
        setError("Module not found")
        return
      }

      setModule(foundModule)

      // Set initial video
      // Check both onboarding_videos (old) and videos (new) properties
      const moduleVideos = foundModule.onboarding_videos || foundModule.videos || []
      if (videoIdFromUrl) {
        setSelectedVideoId(videoIdFromUrl)
      } else if (moduleVideos.length > 0) {
        setSelectedVideoId(moduleVideos[0].id)
      }

      // Fetch progress
      try {
        const progressResponse = await fetch("/api/onboarding/progress")
        if (progressResponse.ok) {
          const progressData = await progressResponse.json()
          const completed = new Set<string>(
            (progressData.progress || [])
              .filter((p: ProgressItem) => p.completed)
              .map((p: ProgressItem) => p.video_id)
          )
          setCompletedVideoIds(completed)
        }
      } catch {
        console.warn("Could not fetch progress")
      }
    } catch (err) {
      console.error("Error fetching module:", err)
      setError(err instanceof Error ? err.message : "Failed to load module")
    } finally {
      setLoading(false)
    }
  }, [moduleId, videoIdFromUrl])

  useEffect(() => {
    if (moduleId) {
      fetchData()
    }
  }, [moduleId, fetchData])

  // Get current video - check both onboarding_videos (old) and videos (new) properties
  const moduleVideos = module?.onboarding_videos || module?.videos || []
  const currentVideo = moduleVideos.find(
    (v) => v.id === selectedVideoId
  )

  // Handle video selection
  const handleVideoSelect = useCallback(
    (videoId: string) => {
      setSelectedVideoId(videoId)
      router.push(`/onboarding/${moduleId}?video=${videoId}`)
    },
    [moduleId, router]
  )

  // Mark video as complete
  const handleMarkComplete = useCallback(async () => {
    if (!currentVideo || completedVideoIds.has(currentVideo.id)) return

    setMarkingComplete(true)
    try {
      const response = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          video_id: currentVideo.id,
          watch_duration: currentVideo.video_duration || 0,
        }),
      })

      if (response.ok) {
        setCompletedVideoIds((prev) => new Set([...prev, currentVideo.id]))

        // Auto-advance to next video
        const videos = module?.onboarding_videos || module?.videos || []
        const currentIndex = videos.findIndex((v) => v.id === currentVideo.id)
        if (currentIndex < videos.length - 1) {
          handleVideoSelect(videos[currentIndex + 1].id)
        }
      }
    } catch (err) {
      console.error("Failed to mark complete:", err)
    } finally {
      setMarkingComplete(false)
    }
  }, [currentVideo, completedVideoIds, module, handleVideoSelect])

  // Navigate to next/prev video
  const navigateVideo = useCallback(
    (direction: "next" | "prev") => {
      const videos = module?.onboarding_videos || module?.videos || []
      if (!videos.length || !selectedVideoId) return
      const currentIndex = videos.findIndex((v) => v.id === selectedVideoId)

      if (direction === "next" && currentIndex < videos.length - 1) {
        handleVideoSelect(videos[currentIndex + 1].id)
      } else if (direction === "prev" && currentIndex > 0) {
        handleVideoSelect(videos[currentIndex - 1].id)
      }
    },
    [module, selectedVideoId, handleVideoSelect]
  )

  // Format duration
  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Calculate progress
  const moduleVideosForProgress = module?.onboarding_videos || module?.videos || []
  const totalVideos = moduleVideosForProgress.length
  const completedCount = moduleVideosForProgress.filter((v) =>
    completedVideoIds.has(v.id)
  ).length
  const progressPercentage = totalVideos > 0 ? (completedCount / totalVideos) * 100 : 0

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-gray-50/50">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
          <Skeleton className="aspect-video w-full rounded-xl" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !module) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Module not found"}</AlertDescription>
        </Alert>
        <Link href="/onboarding" className="mt-4">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-gray-50/50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/onboarding">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{module.title}</h1>
            <p className="text-sm text-gray-500">
              {completedCount}/{totalVideos} videos completed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-amber-600">
            {Math.round(progressPercentage)}%
          </span>
          <Progress value={progressPercentage} className="w-32 h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        {/* Video Player */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            {currentVideo ? (
              // Check if video_source is 'embed' (YouTube) or if video_url exists (legacy embed)
              currentVideo.video_source === 'embed' || 
              (currentVideo.video_url && !currentVideo.video_storage_path) ? (
                // YouTube embed or external embed URL
                <div className="aspect-video bg-black">
                  <iframe
                    src={currentVideo.video_url || ''}
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                    allowFullScreen
                    title={currentVideo.title}
                  />
                </div>
              ) : currentVideo.video_storage_path || currentVideo.video_url ? (
                // Uploaded video from Supabase Storage
                <div className="aspect-video bg-black">
                  <video
                    src={currentVideo.video_url || ''}
                    className="w-full h-full"
                    controls
                    controlsList="nodownload"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                // No video available
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <Play className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No video available</p>
                  </div>
                </div>
              )
            ) : (
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <Play className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </Card>

          {/* Video Info */}
          {currentVideo && (
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {currentVideo.title}
                </h2>
                {currentVideo.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {currentVideo.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatDuration(currentVideo.video_duration)}
                  </span>
                </div>
              </div>
              <Button
                onClick={handleMarkComplete}
                disabled={markingComplete || completedVideoIds.has(currentVideo.id)}
                className={cn(
                  completedVideoIds.has(currentVideo.id)
                    ? "bg-green-600 hover:bg-green-600"
                    : "bg-amber-600 hover:bg-amber-700"
                )}
              >
                {completedVideoIds.has(currentVideo.id) ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Completed
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {markingComplete ? "Saving..." : "Mark Complete"}
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateVideo("prev")}
              disabled={
                !moduleVideos.length ||
                moduleVideos[0]?.id === selectedVideoId
              }
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateVideo("next")}
              disabled={
                !moduleVideos.length ||
                moduleVideos[moduleVideos.length - 1]?.id === selectedVideoId
              }
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Video List – all chapters playlist */}
        <Card className="p-4 h-fit">
          <h3 className="font-semibold text-gray-900 mb-3">Videos</h3>
          <div className="space-y-2">
            {allVideos.map((video, index) => {
              const isSelected = video.id === selectedVideoId
              const isCompleted = completedVideoIds.has(video.id)

              return (
                <button
                  key={video.id}
                  onClick={() => handleVideoSelect(video.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                    isSelected
                      ? "bg-amber-50 border border-amber-200"
                      : "hover:bg-gray-50 border border-transparent",
                    isCompleted && !isSelected && "bg-green-50/50"
                  )}
                >
                  {/* Thumbnail */}
                  <div className="relative w-16 h-10 rounded overflow-hidden bg-gray-100 shrink-0">
                    {video.thumbnail ? (
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                    {isCompleted && (
                      <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium truncate",
                        isSelected ? "text-amber-900" : "text-gray-900"
                      )}
                    >
                      {index + 1}. {video.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDuration(video.video_duration)}
                    </p>
                  </div>

                  {/* Status */}
                  {isCompleted && (
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default function OnboardingModulePage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <main className="flex flex-1 flex-col min-h-0">
          <Suspense
            fallback={
              <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-gray-50/50">
                <Skeleton className="h-8 w-64" />
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
                  <Skeleton className="aspect-video w-full rounded-xl" />
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full rounded-lg" />
                    ))}
                  </div>
                </div>
              </div>
            }
          >
            <OnboardingModuleContent />
          </Suspense>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

