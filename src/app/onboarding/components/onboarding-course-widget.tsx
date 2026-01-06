"use client"

import { useState, useEffect } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CheckCircle2, Circle, Play, Clock } from "lucide-react"
import { OnboardingModule } from "@/types/onboarding"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface OnboardingCourseWidgetProps {
  onVideoClick?: (moduleId: string, videoId: string) => void
}

interface ProgressItem {
  video_id: string
  completed: boolean
}

export function OnboardingCourseWidget({ onVideoClick }: OnboardingCourseWidgetProps) {
  const [modules, setModules] = useState<OnboardingModule[]>([])
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch course data
        const courseResponse = await fetch("/api/onboarding/course")
        if (!courseResponse.ok) {
          // Handle errors gracefully - don't throw, just show empty state
          if (courseResponse.status === 404) {
            // API endpoint doesn't exist yet
            setModules([])
            return
          }
          
          const errorData = await courseResponse.json().catch(() => ({}))
          // If tables don't exist, show empty state gracefully
          if (courseResponse.status === 500 && errorData.details?.includes('does not exist')) {
            setModules([])
            return
          }
          
          // For other errors, just set empty modules
          setModules([])
          return
        }
        
        const courseData = await courseResponse.json()
        setModules(courseData.modules || [])

        // Fetch progress data (optional - don't fail if this fails)
        try {
          const progressResponse = await fetch("/api/onboarding/progress")
          if (progressResponse.ok) {
            const progressData = await progressResponse.json()
            const progressItems = (progressData.progress || []) as ProgressItem[]
            const completed = new Set<string>(
              progressItems
                .filter((p) => p.completed)
                .map((p) => p.video_id)
            )
            setCompletedVideos(completed)
          }
        } catch (progressErr) {
          // Silently fail progress fetch - it's optional
          console.warn("Could not fetch progress data:", progressErr)
        }
      } catch (err) {
        // Network errors or other issues - just show empty state
        console.warn("Error fetching onboarding data:", err)
        setModules([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "N/A"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleVideoClick = (moduleId: string, videoId: string) => {
    if (onVideoClick) {
      onVideoClick(moduleId, videoId)
    } else {
      // Default: navigate to video player page
      window.location.href = `/onboarding/${moduleId}?video=${videoId}`
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white border border-[#e6e6e6] rounded-xl shadow-sm p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (modules.length === 0 && !isLoading) {
    // Don't show anything if there are no modules - just return null to hide the widget
    return null
  }

  const handleViewAllClick = () => {
    // Take the user to the dedicated onboarding page,
    // keeping this separate from the main Academy courses.
    window.location.href = "/onboarding"
  }

  return (
    <div className="bg-white border border-[#e6e6e6] rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium text-[#1b1b1b] leading-[1.2]">
          Getting Started Course
        </h3>
        <button
          className="h-8 px-3 py-2 rounded-lg border border-[#dfe1e7] bg-white shadow-sm flex items-center gap-2 text-xs font-medium text-[#0d0d12] hover:bg-gray-50"
          onClick={handleViewAllClick}
        >
          Go to onboarding
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {modules.map((module) => {
          type VideoType = { id: string; title: string; description?: string; video_duration?: number | null }
          const moduleVideos = ((module as { onboarding_videos?: VideoType[] }).onboarding_videos || 
                                (module as { videos?: VideoType[] }).videos || []) as VideoType[]
          const completedCount = moduleVideos.filter((v) =>
            completedVideos.has(v.id)
          ).length
          const totalCount = moduleVideos.length

          return (
            <AccordionItem key={module.id} value={module.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {completedCount === totalCount && totalCount > 0 ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{module.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {completedCount} of {totalCount} videos completed
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pl-8 pt-2">
                  {moduleVideos.map((video) => {
                    const isCompleted = completedVideos.has(video.id)
                    return (
                      <div
                        key={video.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {isCompleted ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">{video.title}</div>
                            {video.description && (
                              <div className="text-xs text-muted-foreground line-clamp-1">
                                {video.description}
                              </div>
                            )}
                          </div>
                          {video.video_duration && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                              <Clock className="h-3 w-3" />
                              {formatDuration(video.video_duration)}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 shrink-0"
                          onClick={() => handleVideoClick(module.id, video.id)}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          {isCompleted ? "Review" : "Watch"}
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}

