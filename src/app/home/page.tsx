"use client"

import { useState, useEffect, Suspense } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import Loader from "@/components/kokonutui/loader"
import { Flame, ChevronRight, BookOpen, Play, CheckCircle2, Lock } from "lucide-react"
import { BannerCarousel, ChristmasBanner } from "@/components/feedback/banners/banner-carousel"
import { MotionCard } from "@/components/motion/MotionCard"
import { MotionStagger } from "@/components/motion/MotionStagger"
import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { motion } from "motion/react"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LearningVideo {
  id: string
  title: string
  globalIndex: number
  isPreview: boolean
  isAccessible: boolean
  completed: boolean
}

interface LearningModule {
  id: string
  title: string
  thumbnail: string | null
  videos: LearningVideo[]
  completedCount: number
  totalCount: number
  isFullyCompleted: boolean
}

interface LearningData {
  modules: LearningModule[]
  isPro: boolean
  totalVideos: number
  totalCompleted: number
  progressPercentage: number
}

function QuickStatsGrid() {
  const { stats, isLoading } = useDashboardStats()
  const [learningData, setLearningData] = useState<LearningData | null>(null)

  useEffect(() => {
    fetch("/api/learning/modules")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setLearningData(d))
      .catch(() => {})
  }, [])

  const learningProgress = learningData?.progressPercentage || 0

  const statItems = [
    {
      title: "Learning Progress",
      value: `${Math.round(learningProgress)}%`,
      iconSrc: "/3d-icons/1_0003.png",
      link: "/learn",
      highlighted: true,
    },
    {
      title: "Products Saved",
      value: stats?.products?.inPicklist || 0,
      iconSrc: "/3d-icons/1_0001.png",
      link: "/my-products",
    },
    {
      title: "Connected Stores",
      value: stats?.stores?.connected || 0,
      iconSrc: "/3d-icons/1_0002.png",
      link: "/my-shopify-stores",
    },
    {
      title: "Day Streak",
      value: stats?.activity?.streakDays || 0,
      iconSrc: "/3d-icons/1_0004.png",
      suffix: stats?.activity?.streakDays === 1 ? " day" : " days",
    },
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
              {item.value}
              {item.suffix || ""}
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

function LearningProgressWidget() {
  const [data, setData] = useState<LearningData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/learning/modules")
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-3 w-full mb-6" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </Card>
    )
  }

  if (!data || data.modules.length === 0) return null

  return (
    <Card className="p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Your Learning Journey</h3>
            <p className="text-sm text-gray-500">
              {data.totalCompleted}/{data.totalVideos} videos completed
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-amber-600">{data.progressPercentage}%</p>
        </div>
      </div>

      <Progress value={data.progressPercentage} className="h-2 mb-6" />

      <div className="space-y-2">
        {data.modules.map((mod) => {
          const moduleProgress =
            mod.totalCount > 0
              ? Math.round((mod.completedCount / mod.totalCount) * 100)
              : 0

          const nextVideo = mod.videos.find((v) => !v.completed && v.isAccessible)
          const hasLockedVideos = mod.videos.some((v) => !v.isAccessible)

          return (
            <Link
              key={mod.id}
              href={
                nextVideo
                  ? `/learn/${mod.id}?video=${nextVideo.id}`
                  : `/learn/${mod.id}`
              }
              className="block"
            >
              <div
                className={cn(
                  "flex items-center gap-4 p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors",
                  mod.isFullyCompleted
                    ? "border-green-200 bg-green-50/30"
                    : "border-gray-200"
                )}
              >
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                  {mod.isFullyCompleted ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  ) : (
                    <Play className="h-5 w-5 text-gray-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4
                      className={cn(
                        "font-medium text-sm truncate",
                        mod.isFullyCompleted ? "text-green-700" : "text-gray-900"
                      )}
                    >
                      {mod.title}
                    </h4>
                    {mod.isFullyCompleted && (
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-700 border-green-200 text-xs shrink-0"
                      >
                        Done
                      </Badge>
                    )}
                    {hasLockedVideos && !data.isPro && (
                      <Badge
                        variant="outline"
                        className="bg-purple-100 text-purple-700 border-purple-200 text-xs shrink-0"
                      >
                        <Lock className="h-3 w-3 mr-1" />
                        Pro
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          mod.isFullyCompleted ? "bg-green-500" : "bg-amber-500"
                        )}
                        style={{ width: `${moduleProgress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 shrink-0">
                      {mod.completedCount}/{mod.totalCount}
                    </span>
                  </div>
                </div>

                <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
              </div>
            </Link>
          )
        })}
      </div>

      <Link href="/learn" className="block mt-4">
        <div className="text-center py-2 text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors">
          View All Lessons
        </div>
      </Link>
    </Card>
  )
}

function HomePageContent() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Topbar />
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-gray-100/50">
            <main className="flex flex-1 flex-col gap-6">
              <MotionFadeIn direction="none" delay={0.1}>
                <BannerCarousel autoRotateInterval={6000}>
                  <ChristmasBanner />
                </BannerCarousel>
              </MotionFadeIn>

              <MotionFadeIn delay={0.15}>
                <QuickStatsGrid />
              </MotionFadeIn>

              <MotionFadeIn delay={0.2}>
                <LearningProgressWidget />
              </MotionFadeIn>

              <div>
                <MotionFadeIn delay={0.25}>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">
                    USDrop AI Studio Tools
                  </h3>
                </MotionFadeIn>
                <MotionStagger staggerDelay={0.1}>
                  <div className="grid gap-4 md:grid-cols-3">
                    <MotionCard
                      className="rounded-xl border bg-card p-6 cursor-pointer"
                      hoverLift
                      hoverShadow
                      delay={0.1}
                    >
                      <img
                        src="/3d-icons/1_0024.png"
                        alt="Model Studio"
                        width={64}
                        height={64}
                        className="object-contain mb-4 w-16 h-16"
                      />
                      <h4 className="font-semibold mb-2 text-lg">Model Studio</h4>
                      <p className="text-sm text-muted-foreground">
                        Generate professional model advertisements for your apparel
                        products with AI-generated models
                      </p>
                    </MotionCard>

                    <MotionCard
                      className="rounded-xl border bg-card p-6 cursor-pointer"
                      hoverLift
                      hoverShadow
                      delay={0.15}
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <img
                          src="/3d-icons/1_0011.png"
                          alt="Whitelabelling"
                          width={64}
                          height={64}
                          className="object-contain w-16 h-16"
                        />
                        <motion.div
                          className="flex items-center gap-1"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4, duration: 0.3 }}
                        >
                          <Badge
                            variant="outline"
                            className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-xs"
                          >
                            Nano
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-xs"
                          >
                            Banana
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-xs"
                          >
                            Pro
                          </Badge>
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatDelay: 3,
                            }}
                          >
                            <Flame className="h-4 w-4 text-orange-500" />
                          </motion.div>
                        </motion.div>
                      </div>
                      <h4 className="font-semibold mb-2 text-lg">Whitelabelling</h4>
                      <p className="text-sm text-muted-foreground">
                        Apply your logo to multiple images in bulk. Customize placement,
                        size, and opacity
                      </p>
                    </MotionCard>

                    <MotionCard
                      className="rounded-xl border bg-card p-6 cursor-pointer"
                      hoverLift
                      hoverShadow
                      delay={0.2}
                    >
                      <img
                        src="/3d-icons/1_0022.png"
                        alt="Brand Studio"
                        width={64}
                        height={64}
                        className="object-contain mb-4 w-16 h-16"
                      />
                      <h4 className="font-semibold mb-2 text-lg">Brand Studio</h4>
                      <p className="text-sm text-muted-foreground">
                        Automatically place your brand logo on product images with
                        customizable placement and size
                      </p>
                    </MotionCard>

                    <MotionCard
                      className="rounded-xl border bg-card p-6 cursor-pointer"
                      hoverLift
                      hoverShadow
                      delay={0.25}
                    >
                      <img
                        src="/3d-icons/1_0024.png"
                        alt="Campaign Studio"
                        width={64}
                        height={64}
                        className="object-contain mb-4 w-16 h-16"
                      />
                      <h4 className="font-semibold mb-2 text-lg">Campaign Studio</h4>
                      <p className="text-sm text-muted-foreground">
                        Strategize and plan your Meta advertising campaigns. Set
                        budgets, define audiences, and track performance
                      </p>
                    </MotionCard>
                  </div>
                </MotionStagger>
              </div>
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <Topbar />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-gray-100/50">
              <div
                className="flex justify-center items-center"
                style={{ minHeight: "calc(100vh - 300px)" }}
              >
                <Loader title="Loading..." subtitle="Please wait" size="md" />
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      }
    >
      <HomePageContent />
    </Suspense>
  )
}
