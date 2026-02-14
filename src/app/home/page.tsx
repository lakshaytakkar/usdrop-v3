"use client"

import { useState, useEffect, Suspense } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { BlueSpinner } from "@/components/ui/blue-spinner"
import { Flame, ChevronRight, BookOpen, Play, CheckCircle2, Lock, Clock, Book, Star } from "lucide-react"
import { BannerCarousel, ChristmasBanner } from "@/components/feedback/banners/banner-carousel"
import { MotionCard } from "@/components/motion/MotionCard"
import { MotionStagger } from "@/components/motion/MotionStagger"
import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { motion } from "motion/react"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface CourseData {
  id: string
  title: string
  description: string | null
  thumbnail: string | null
  category: string | null
  level: string | null
  lessons_count: number
  duration_minutes: number | null
  rating: number | null
  students_count: number
  featured: boolean
}

function QuickStatsGrid() {
  const { stats, isLoading } = useDashboardStats()
  const [courseCount, setCourseCount] = useState(0)

  useEffect(() => {
    fetch("/api/courses?published=true&pageSize=100")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setCourseCount(d.total || 0))
      .catch(() => {})
  }, [])

  const statItems = [
    {
      title: "Courses Available",
      value: courseCount,
      iconSrc: "/3d-icons/1_0003.png",
      link: "/academy",
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

function formatDuration(minutes: number | null): string {
  if (!minutes) return ""
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

function CoursesWidget() {
  const [courses, setCourses] = useState<CourseData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/courses?published=true&pageSize=6&sortBy=created_at&sortOrder=desc")
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then((d) => setCourses(d.courses || []))
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card overflow-hidden">
              <Skeleton className="aspect-video w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  if (courses.length === 0) return null

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
              {courses.length} courses available from your mentor
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <Link key={course.id} href={`/academy/${course.id}`} className="block group">
            <div className="rounded-xl border bg-white hover:bg-gray-50 overflow-hidden transition-all hover:shadow-md">
              <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
                {course.thumbnail ? (
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <BookOpen className="h-8 w-8 text-gray-300" />
                  </div>
                )}
                {course.featured && (
                  <div className="absolute top-2 left-2">
                    <Badge className="text-[10px] px-1.5 py-0.5">Featured</Badge>
                  </div>
                )}
                {course.level && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 bg-white/90">
                      {course.level}
                    </Badge>
                  </div>
                )}
              </div>
              <div className="p-3">
                <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1.5 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  {course.lessons_count > 0 && (
                    <div className="flex items-center gap-1">
                      <Book className="h-3 w-3" />
                      <span>{course.lessons_count} lessons</span>
                    </div>
                  )}
                  {course.duration_minutes && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDuration(course.duration_minutes)}</span>
                    </div>
                  )}
                  {course.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link href="/academy" className="block mt-4">
        <div className="text-center py-2 text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors">
          View All Courses
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
                <CoursesWidget />
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
                <BlueSpinner size="lg" label="Loading dashboard..." />
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
