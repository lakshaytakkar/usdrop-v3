"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Lock,
  CheckCircle2,
  Clock,
  ArrowLeft,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LearningVideo {
  id: string
  title: string
  description: string | null
  video_url: string | null
  video_duration: number | null
  order_index: number
  thumbnail: string | null
  globalIndex: number
  isPreview: boolean
  isAccessible: boolean
  completed: boolean
  completedAt: string | null
}

interface LearningModule {
  id: string
  title: string
  description: string | null
  order_index: number
  thumbnail: string | null
  videos: LearningVideo[]
  completedCount: number
  totalCount: number
  isFullyCompleted: boolean
}

interface LearningData {
  modules: LearningModule[]
  isPro: boolean
  previewCount: number
  totalVideos: number
  totalCompleted: number
  progressPercentage: number
}

const formatDuration = (seconds: number | null) => {
  if (!seconds) return "0:00"
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function LearnModuleContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const moduleId = params.moduleId as string

  const [data, setData] = useState<LearningData | null>(null)
  const [currentModule, setCurrentModule] = useState<LearningModule | null>(null)
  const [allVideos, setAllVideos] = useState<LearningVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null)
  const [completedVideoIds, setCompletedVideoIds] = useState<Set<string>>(new Set())
  const [markingComplete, setMarkingComplete] = useState(false)

  const videoIdFromUrl = searchParams.get("video")

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/learning/modules")
      if (!response.ok) {
        throw new Error("Failed to fetch learning data")
      }
      const result: LearningData = await response.json()
      setData(result)

      const flatVideos: LearningVideo[] = result.modules.flatMap((m) => m.videos)
      setAllVideos(flatVideos)

      const completed = new Set<string>(
        flatVideos.filter((v) => v.completed).map((v) => v.id)
      )
      setCompletedVideoIds(completed)

      const foundModule = result.modules.find((m) => m.id === moduleId)
      if (!foundModule) {
        setError("Module not found")
        return
      }
      setCurrentModule(foundModule)

      if (videoIdFromUrl) {
        setSelectedVideoId(videoIdFromUrl)
      } else if (foundModule.videos.length > 0) {
        setSelectedVideoId(foundModule.videos[0].id)
      }
    } catch (err) {
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

  const currentVideo = allVideos.find((v) => v.id === selectedVideoId)

  const handleVideoSelect = useCallback(
    (videoId: string) => {
      const video = allVideos.find((v) => v.id === videoId)
      if (video && !video.isAccessible) return
      setSelectedVideoId(videoId)
      const targetModule = data?.modules.find((m) =>
        m.videos.some((v) => v.id === videoId)
      )
      if (targetModule) {
        router.push(`/learn/${targetModule.id}?video=${videoId}`)
      }
    },
    [allVideos, data, router]
  )

  const handleMarkComplete = useCallback(async () => {
    if (!currentVideo || completedVideoIds.has(currentVideo.id)) return

    setMarkingComplete(true)
    try {
      const response = await fetch("/api/learning/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId: currentVideo.id,
          completed: true,
        }),
      })

      if (response.ok) {
        setCompletedVideoIds((prev) => new Set([...prev, currentVideo.id]))

        const currentIndex = allVideos.findIndex((v) => v.id === currentVideo.id)
        const nextAccessible = allVideos
          .slice(currentIndex + 1)
          .find((v) => v.isAccessible)
        if (nextAccessible) {
          handleVideoSelect(nextAccessible.id)
        }
      }
    } catch (err) {
      console.error("Failed to mark complete:", err)
    } finally {
      setMarkingComplete(false)
    }
  }, [currentVideo, completedVideoIds, allVideos, handleVideoSelect])

  const navigateVideo = useCallback(
    (direction: "next" | "prev") => {
      if (!allVideos.length || !selectedVideoId) return
      const currentIndex = allVideos.findIndex((v) => v.id === selectedVideoId)

      if (direction === "next") {
        const next = allVideos.slice(currentIndex + 1).find((v) => v.isAccessible)
        if (next) handleVideoSelect(next.id)
      } else if (direction === "prev" && currentIndex > 0) {
        const prev = [...allVideos.slice(0, currentIndex)]
          .reverse()
          .find((v) => v.isAccessible)
        if (prev) handleVideoSelect(prev.id)
      }
    },
    [allVideos, selectedVideoId, handleVideoSelect]
  )

  const totalVideos = currentModule?.totalCount || 0
  const completedCount = currentModule?.videos.filter((v) =>
    completedVideoIds.has(v.id)
  ).length || 0
  const progressPercentage = totalVideos > 0 ? (completedCount / totalVideos) * 100 : 0

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-gray-50/50">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
          <Skeleton className="aspect-video w-full rounded-xl" />
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !currentModule) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <Card className="p-8 max-w-md text-center">
          <p className="text-gray-500 mb-4">{error || "Module not found"}</p>
          <Link href="/learn">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Learning Center
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  const isVideoLocked = currentVideo && !currentVideo.isAccessible

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-gray-50/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/learn">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{currentModule.title}</h1>
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

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="space-y-4">
          <Card className="overflow-hidden">
            {isVideoLocked ? (
              <div className="aspect-video bg-gray-900/95 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
                <div className="relative z-10 text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                    <Lock className="h-8 w-8 text-white/70" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    This lesson is for Pro members
                  </h3>
                  <p className="text-sm text-white/60 mb-6 max-w-sm">
                    Upgrade your plan to access all lessons and accelerate your learning
                  </p>
                  <Link href="/settings">
                    <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                      Upgrade to Pro
                    </Button>
                  </Link>
                </div>
              </div>
            ) : currentVideo?.video_url ? (
              currentVideo.video_url.includes("youtube") ||
              currentVideo.video_url.includes("vimeo") ||
              currentVideo.video_url.includes("embed") ? (
                <div className="aspect-video bg-black">
                  <iframe
                    src={currentVideo.video_url}
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                    allowFullScreen
                    title={currentVideo.title}
                  />
                </div>
              ) : (
                <div className="aspect-video bg-black">
                  <video
                    src={currentVideo.video_url}
                    className="w-full h-full"
                    controls
                    controlsList="nodownload"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )
            ) : (
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <Play className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No video available</p>
                </div>
              </div>
            )}
          </Card>

          {currentVideo && !isVideoLocked && (
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
                  {currentVideo.isPreview && (
                    <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                      Preview
                    </Badge>
                  )}
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

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateVideo("prev")}
              disabled={
                !allVideos.length ||
                !allVideos.slice(0, allVideos.findIndex((v) => v.id === selectedVideoId)).some((v) => v.isAccessible)
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
                !allVideos.length ||
                !allVideos.slice(allVideos.findIndex((v) => v.id === selectedVideoId) + 1).some((v) => v.isAccessible)
              }
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        <Card className="p-4 h-fit max-h-[calc(100vh-200px)] overflow-y-auto">
          <h3 className="font-semibold text-gray-900 mb-3">All Videos</h3>
          <div className="space-y-1">
            {allVideos.map((video) => {
              const isSelected = video.id === selectedVideoId
              const isCompleted = completedVideoIds.has(video.id)
              const isLocked = !video.isAccessible

              return (
                <button
                  key={video.id}
                  onClick={() => !isLocked && handleVideoSelect(video.id)}
                  disabled={isLocked}
                  className={cn(
                    "w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors",
                    isSelected
                      ? "bg-amber-50 border border-amber-200"
                      : isLocked
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-50 border border-transparent",
                    isCompleted && !isSelected && "bg-green-50/50"
                  )}
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                    {isLocked ? (
                      <Lock className="h-3.5 w-3.5 text-gray-400" />
                    ) : isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Play className="h-3.5 w-3.5 text-amber-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-xs font-medium truncate",
                        isSelected ? "text-amber-900" : isLocked ? "text-gray-400" : "text-gray-900"
                      )}
                    >
                      {video.globalIndex}. {video.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-gray-400">
                        {formatDuration(video.video_duration)}
                      </span>
                      {video.isPreview && (
                        <Badge className="bg-green-100 text-green-700 border-green-200 text-[9px] px-1 py-0">
                          Preview
                        </Badge>
                      )}
                      {isLocked && (
                        <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-[9px] px-1 py-0">
                          Pro
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default function LearnModulePage() {
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
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
                  <Skeleton className="aspect-video w-full rounded-xl" />
                  <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-14 w-full rounded-lg" />
                    ))}
                  </div>
                </div>
              </div>
            }
          >
            <LearnModuleContent />
          </Suspense>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
