"use client"

import { useState, useEffect, useCallback } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Topbar } from "@/components/layout/topbar"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { useOnboarding } from "@/contexts/onboarding-context"
import { Card } from "@/components/ui/card"
import { OnboardingModule } from "@/types/onboarding"
import {
  ChevronRight,
  CheckCircle2,
  Clock
} from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Skeleton } from "@/components/ui/skeleton"
import Loader from "@/components/kokonutui/loader"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { EmptyState } from "@/components/ui/empty-state"
import { SectionError } from "@/components/ui/section-error"
import { SectionErrorBoundary } from "@/components/shared/section-error-boundary"

// Placeholder thumbnails for onboarding modules
const MODULE_THUMBNAILS = [
  "/images/thumbnail-store-setup.png",
  "/images/thumbnail-product-research.png",
  "/images/thumbnail-supplier-management.png",
  "/images/thumbnail-store-research.png",
  "/images/thumbnail-financial-planning.png",
  "/images/thumbnail-ai-marketing.png",
  "/images/thumbnail-scaling-automation.png",
  "/images/thumbnail-advanced-facebook-ads.png",
]


function WelcomeMessage() {
  return (
    <div className="text-center py-6">
      <div className="flex items-center justify-center gap-3">
        <span className="text-4xl md:text-5xl">👋</span>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Welcome, Please complete your onboarding
        </h1>
      </div>
    </div>
  )
}

function QuickStatsGrid() {
  const { stats, isLoading } = useDashboardStats()
  const { progressPercentage } = useOnboarding()

  const statItems = [
    {
      title: "Learning Progress",
      value: `${Math.round(progressPercentage || 0)}%`,
      iconSrc: "/3d-icons/1_0003.png",
      link: "/academy",
      highlighted: true
    },
    {
      title: "Products Saved",
      value: stats?.products?.inPicklist || 0,
      iconSrc: "/3d-icons/1_0001.png",
      link: "/my-products"
    },
    {
      title: "Connected Stores",
      value: stats?.stores?.connected || 0,
      iconSrc: "/3d-icons/1_0002.png",
      link: "/my-shopify-stores"
    },
    {
      title: "Day Streak",
      value: stats?.activity?.streakDays || 0,
      iconSrc: "/3d-icons/1_0004.png",
      suffix: stats?.activity?.streakDays === 1 ? " day" : " days"
    }
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-10 w-10 rounded-lg mb-3" />
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-16" />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <Card
          key={index}
          className={cn(
            "p-4 hover:shadow-md transition-all duration-200 cursor-pointer group",
            item.link && "hover:border-gray-300",
            item.highlighted && "border-2 border-purple-500 bg-purple-50/50 shadow-md"
          )}
          onClick={() => item.link && (window.location.href = item.link)}
        >
          <Image
            src={item.iconSrc}
            alt={item.title}
            width={40}
            height={40}
            className="object-contain mb-3"
          />
          <p className="text-xs text-gray-500 mb-1">{item.title}</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-gray-900">
              {item.value}{item.suffix || ""}
            </p>
            {item.link && (
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}

interface ProgressItem {
  video_id: string
  completed: boolean
}

function OnboardingSection() {
  const {
    progressPercentage,
    completedVideos,
    totalVideos,
    isLoading: contextLoading,
    isComplete
  } = useOnboarding()

  const [modules, setModules] = useState<OnboardingModule[]>([])
  const [completedVideoIds, setCompletedVideoIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      setErrorMessage(null)

      const courseResponse = await fetch("/api/onboarding/course")
      if (!courseResponse.ok) {
        setModules([])
        setErrorMessage("We couldn’t load your onboarding modules. You can still use the rest of your dashboard.")
        return
      }
      
      // Check if response is JSON before parsing
      const contentType = courseResponse.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        setModules([])
        setErrorMessage("The onboarding data looks different than expected. Please try again in a moment.")
        return
      }
      
      const courseData = await courseResponse.json()
      setModules(courseData.modules || [])

      try {
        const progressResponse = await fetch("/api/onboarding/progress")
        if (progressResponse.ok) {
          // Check if response is JSON before parsing
          const progressContentType = progressResponse.headers.get("content-type")
          if (progressContentType && progressContentType.includes("application/json")) {
            const progressData = await progressResponse.json()
            const progressItems = (progressData.progress || []) as ProgressItem[]
            const completed = new Set<string>(
              progressItems.filter((p) => p.completed).map((p) => p.video_id)
            )
            setCompletedVideoIds(completed)
          }
        }
      } catch {
        console.warn("Could not fetch progress data")
      }
    } catch (error) {
      console.warn("Error fetching onboarding data:", error)
      setModules([])
      setErrorMessage("We’re having trouble loading your onboarding journey right now. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (contextLoading || isLoading) {
    return (
      <div className="space-y-4">
        <Card className="p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-3 w-full mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl" />
            ))}
          </div>
        </Card>
      </div>
    )
  }

  if (totalVideos === 0 && modules.length === 0) {
    return (
      <Card className="p-6">
        <EmptyState
          title="Onboarding is not available yet"
          description="We couldn’t find any onboarding lessons for your account. You can still explore your dashboard while we get things ready."
          action={{
            label: "Retry loading onboarding",
            onClick: () => fetchData(),
          }}
        />
      </Card>
    )
  }

  // If complete, only show "Onboarding Complete!" message
  if (isComplete) {
    return (
      <Card className="p-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50" />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <Image
              src="/3d-icons/1_0000.png"
              alt="Onboarding Complete"
              width={48}
              height={48}
              className="object-contain"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Onboarding Complete!
              </h3>
              <p className="text-sm text-gray-500">
                You've unlocked all features
              </p>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 overflow-hidden relative">
      {errorMessage && (
        <div className="mb-4">
          <SectionError
            description={errorMessage}
            onRetry={() => fetchData()}
          />
        </div>
      )}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="onboarding" className="border-none">
          <AccordionTrigger className="hover:no-underline [&>svg]:ml-auto">
            <div className="flex items-center justify-between w-full pr-2">
              <div className="flex items-center gap-3">
                <Image
                  src="/3d-icons/1_0005.png"
                  alt="Onboarding"
                  width={48}
                  height={48}
                  className="object-contain"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Complete Your Onboarding
                  </h3>
                  <p className="text-sm text-gray-500">
                    Watch all videos to unlock premium features
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-amber-600">
                  {Math.round(progressPercentage)}%
                </p>
                <p className="text-xs text-gray-500">{completedVideos}/{totalVideos} videos</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-6 space-y-4">
              {/* Progress Bar */}
              <div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-amber-400 to-amber-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Module List */}
              {modules.length > 0 && (
                <div className="space-y-3">
                  {modules.map((module, index) => {
                    type VideoType = { id: string; title: string; video_duration?: number | null }
                    const moduleVideos = ((module as { onboarding_videos?: VideoType[] }).onboarding_videos ||
                      (module as { videos?: VideoType[] }).videos || []) as VideoType[]
                    const completedCount = moduleVideos.filter((v) => completedVideoIds.has(v.id)).length
                    const totalCount = moduleVideos.length
                    const moduleProgress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0
                    const isModuleComplete = moduleProgress === 100

                    const totalDuration = moduleVideos.reduce((sum, v) => sum + (v.video_duration || 0), 0)
                    const formatDuration = (seconds: number) => {
                      const mins = Math.floor(seconds / 60)
                      return `${mins} min`
                    }

                    // Get thumbnail from module data or use placeholder
                    const moduleThumbnail = module.thumbnail || MODULE_THUMBNAILS[index % MODULE_THUMBNAILS.length]

                    // Get the video ID from the module (each module now contains 1 video)
                    const videoId = moduleVideos[0]?.id || module.id
                    
                    return (
                      <Link
                        key={module.id}
                        href={`/onboarding/${module.id}?video=${videoId}`}
                        className="block"
                      >
                        <div className={cn(
                          "flex items-center gap-4 p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors",
                          isModuleComplete ? "border-green-200 bg-green-50/30" : "border-gray-200"
                        )}>
                          {/* Module Thumbnail */}
                          <div className="relative w-28 aspect-video rounded-lg overflow-hidden shrink-0 bg-gray-100">
                            <Image
                              src={moduleThumbnail}
                              alt={module.title}
                              fill
                              className="object-cover"
                            />
                            {isModuleComplete && (
                              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                  <CheckCircle2 className="h-4 w-4 text-white" />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={cn(
                                "font-medium text-sm",
                                isModuleComplete ? "text-green-700" : "text-gray-900"
                              )}>
                                {module.title}
                              </h4>
                              {isModuleComplete && (
                                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded">
                                  Completed
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              {totalCount > 1 ? (
                                <span>{completedCount}/{totalCount} videos</span>
                              ) : (
                                moduleVideos[0]?.video_duration && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatDuration(moduleVideos[0].video_duration)}
                                  </span>
                                )
                              )}
                              {totalCount > 1 && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDuration(totalDuration)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Progress */}
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="w-20 hidden sm:block">
                              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                <span>{Math.round(moduleProgress)}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={cn(
                                    "h-full rounded-full transition-all",
                                    isModuleComplete ? "bg-green-500" : "bg-amber-500"
                                  )}
                                  style={{ width: `${moduleProgress}%` }}
                                />
                              </div>
                            </div>

                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  )
}

function DashboardContent() {
  const { stats, isLoading: statsLoading, error, refetch } = useDashboardStats()

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-gray-50/50 min-h-0">
      {statsLoading && !stats && (
        <div className="flex h-[calc(100vh-140px)] items-center justify-center">
          <Loader
            title="Loading your dashboard..."
            subtitle="Gathering your stats and onboarding progress"
            size="md"
          />
        </div>
      )}

      {!statsLoading && error && (
        <SectionError
          className="max-w-xl"
          description={error}
          onRetry={refetch}
        />
      )}

      <SectionErrorBoundary className="space-y-6">
        <WelcomeMessage />
        <QuickStatsGrid />
        <OnboardingSection />
      </SectionErrorBoundary>
    </div>
  )
}

export default function MyDashboardPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <main className="flex flex-1 flex-col min-h-0">
          <DashboardContent />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
