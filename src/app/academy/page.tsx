"use client"

import { useState, useEffect, useCallback } from "react"
import { ExternalLayout } from "@/components/layout/external-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, CheckCircle2, Users } from "lucide-react"
import Image from "next/image"
import { CourseCard } from "./components/course-card"
import { Course as APICourse } from "@/types/courses"
import { Course } from "./data/courses"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useOnboarding } from "@/contexts/onboarding-context"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BookOpen, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { getTeaserLockState } from "@/hooks/use-teaser-lock"
import { UpsellDialog } from "@/components/ui/upsell-dialog"

// Mentor features for the banner
const mentorFeatures = [
  "7-Figure Store Scaling",
  "Advanced Ad Strategies",
  "Product Research Secrets",
  "Conversion Optimization",
]

// Transform API Course to legacy Course format for CourseCard component
function transformCourse(apiCourse: APICourse): Course {
  // Convert duration_minutes to "X hours" format
  const formatDuration = (minutes: number | null): string => {
    if (!minutes) return "0 hours"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins} min`
    if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`
    return `${hours}h ${mins}m`
  }

  return {
    id: apiCourse.id,
    title: apiCourse.title,
    description: apiCourse.description || "",
    instructor: apiCourse.instructor_name || "Instructor",
    instructorAvatar: apiCourse.instructor_avatar || "/images/default-avatar.png",
    thumbnail: apiCourse.thumbnail || "/images/default-course.png",
    duration: formatDuration(apiCourse.duration_minutes),
    lessons: apiCourse.lessons_count,
    students: apiCourse.students_count,
    rating: apiCourse.rating || 0,
    price: apiCourse.price,
    category: apiCourse.category || "",
    level: apiCourse.level || "Beginner",
    featured: apiCourse.featured,
    tags: apiCourse.tags || [],
    modules: apiCourse.modules?.map((module) => ({
      id: module.id,
      title: module.title,
      duration: module.duration_minutes 
        ? `${Math.floor(module.duration_minutes / 60)}h ${module.duration_minutes % 60}m`
        : "0 min",
      lessons: module.chapters?.length || 0,
      completed: false, // Will be updated based on enrollment progress
      description: module.description || undefined,
      thumbnail: module.thumbnail || undefined,
    })) || [],
  }
}

export default function AcademyPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showOnboardingDialog, setShowOnboardingDialog] = useState(false)
  const [isUpsellOpen, setIsUpsellOpen] = useState(false)
  const { isFree, isPro } = useOnboarding()

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/courses?published=true')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch courses')
      }
      
      const data = await response.json()
      const transformedCourses = data.courses.map(transformCourse)
      setCourses(transformedCourses)
    } catch (err) {
      console.error("Error fetching courses:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to load courses. Please try again."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  return (
    <ExternalLayout>
        <div className="flex flex-1 flex-col gap-2 p-4 md:p-6 bg-gray-50/50 min-h-0">
          {/* Mentor Introduction Banner */}
          <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 h-[154px] flex-shrink-0">
            {/* Subtle blue gradient background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60 -mr-20 -mt-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-50 rounded-full blur-2xl opacity-40 -ml-10 -mb-10 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 flex items-center gap-4 h-full">
              {/* Mentor Portrait */}
              <div className="relative w-28 h-28 md:w-32 md:h-32 flex-shrink-0 -my-2">
                <div className="relative w-full h-full rounded-xl overflow-hidden border-2 border-blue-100 shadow-md">
                  <Image
                    src="/images/mentor-portrait.png"
                    alt="Mr. Suprans - Your Mentor"
                    fill
                    className="object-cover object-top"
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                {/* Badge */}
                <Badge
                  variant="outline"
                  className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-700 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide mb-2"
                >
                  <Users className="h-3 w-3" />
                  <span>HEAD MENTOR & STRATEGIST</span>
                </Badge>

                <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                  Learn from <span className="text-blue-600">Mr. Suprans</span>
                </h2>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed mt-0.5 line-clamp-1">
                  14+ years of e-commerce expertise and 25k+ students mentored
                </p>

                {/* Quick Features */}
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                  {mentorFeatures.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-green-600 shrink-0" />
                      <span className="text-[11px] text-slate-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action button */}
              <div className="flex-shrink-0 hidden sm:flex items-center">
                <Button
                  size="sm"
                  className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                >
                  <Play className="h-3 w-3" />
                  <span className="text-xs">Watch Intro</span>
                </Button>
              </div>
            </div>
          </div>

          {/* All Courses */}
          <div>
            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div key={index} className="rounded-lg border bg-card overflow-hidden">
                    <Skeleton className="aspect-video w-full" />
                    <div className="p-2.5 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                      <div className="flex items-center gap-1.5">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {!loading && !error && courses.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No courses available at the moment.
              </div>
            )}
            
            {!loading && !error && courses.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {courses.map((course, index) => {
                  const { isLocked } = getTeaserLockState(index, isFree, {
                    freeVisibleCount: 3,
                    strategy: "first-n-items"
                  })
                  return (
                    <CourseCard 
                      key={course.id} 
                      course={course}
                      isLocked={isLocked}
                      onLockedClick={() => setIsUpsellOpen(true)}
                    />
                  )
                })}
              </div>
            )}
          </div>

          {/* Onboarding Dialog */}
          <Dialog open={showOnboardingDialog} onOpenChange={setShowOnboardingDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <DialogTitle className="text-center text-xl">
                  Complete Your Onboarding
                </DialogTitle>
                <DialogDescription className="text-center">
                  Please complete your onboarding to unlock this part.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-3 pt-4">
                <Button
                  onClick={() => {
                    setShowOnboardingDialog(false)
                    router.push("/home")
                  }}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Continue Onboarding
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowOnboardingDialog(false)}
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

      <UpsellDialog 
        isOpen={isUpsellOpen} 
        onClose={() => setIsUpsellOpen(false)} 
      />
    </ExternalLayout>
  )
}

