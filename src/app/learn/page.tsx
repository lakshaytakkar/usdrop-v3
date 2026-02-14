"use client"

import { useState, useEffect } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BlueSpinner } from "@/components/ui/blue-spinner"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Play,
  Lock,
  CheckCircle2,
  ChevronRight,
  BookOpen,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
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

function LearnContent() {
  const [data, setData] = useState<LearningData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/learning/modules")
        if (!response.ok) {
          throw new Error("Failed to fetch learning modules")
        }
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load modules")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[60vh] bg-gray-50/50">
        <BlueSpinner size="lg" label="Loading modules..." />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 bg-gray-50/50">
        <Card className="p-8 max-w-md text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Unable to load modules</h2>
          <p className="text-sm text-gray-500">{error || "Something went wrong"}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-gray-50/50">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Learning Center</h1>
        <p className="text-sm text-gray-500">Master dropshipping step by step</p>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Your Learning Progress</h2>
              <p className="text-xs text-gray-500">
                {data.totalCompleted}/{data.totalVideos} videos completed
              </p>
            </div>
          </div>
          <span className="text-2xl font-bold text-amber-600">{data.progressPercentage}%</span>
        </div>
        <Progress value={data.progressPercentage} className="h-2.5" />
      </Card>

      <Accordion type="multiple" className="space-y-3">
        {data.modules.map((module) => (
          <AccordionItem
            key={module.id}
            value={module.id}
            className="border rounded-xl overflow-hidden bg-white shadow-sm"
          >
            <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-gray-50/50">
              <div className="flex items-center gap-4 w-full pr-2">
                <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {module.thumbnail ? (
                    <Image
                      src={module.thumbnail}
                      alt={module.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                  {module.isFullyCompleted && (
                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{module.title}</h3>
                    {module.isFullyCompleted && (
                      <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px] px-1.5">
                        Completed
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500">
                      {module.completedCount}/{module.totalCount} videos
                    </span>
                    <div className="flex-1 max-w-[120px]">
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            module.isFullyCompleted ? "bg-green-500" : "bg-amber-500"
                          )}
                          style={{
                            width: `${module.totalCount > 0 ? (module.completedCount / module.totalCount) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-4">
              <div className="space-y-1 pt-2">
                {module.videos.map((video) => {
                  const isLocked = !video.isAccessible

                  if (isLocked) {
                    return (
                      <div
                        key={video.id}
                        className="flex items-center gap-3 p-3 rounded-lg opacity-60 cursor-not-allowed"
                        title="Upgrade to Pro to unlock"
                      >
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                          <Lock className="h-3.5 w-3.5 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 truncate">
                              {video.globalIndex}. {video.title}
                            </span>
                            <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-[10px] px-1.5">
                              Pro
                            </Badge>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 shrink-0">
                          {formatDuration(video.video_duration)}
                        </span>
                      </div>
                    )
                  }

                  return (
                    <Link
                      key={video.id}
                      href={`/learn/${module.id}?video=${video.id}`}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-gray-50",
                        video.completed && "bg-green-50/50"
                      )}
                    >
                      <div
                        className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                          video.completed
                            ? "bg-green-100"
                            : "bg-amber-50"
                        )}
                      >
                        {video.completed ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                        ) : (
                          <Play className="h-3.5 w-3.5 text-amber-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-sm truncate",
                              video.completed ? "text-green-700" : "text-gray-900"
                            )}
                          >
                            {video.globalIndex}. {video.title}
                          </span>
                          {video.isPreview && (
                            <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px] px-1.5">
                              Preview
                            </Badge>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 shrink-0">
                        {formatDuration(video.video_duration)}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-300 shrink-0" />
                    </Link>
                  )
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export default function LearnPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <main className="flex flex-1 flex-col min-h-0">
          <LearnContent />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
