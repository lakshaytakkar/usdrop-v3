import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useCallback, useMemo } from "react"
import { ModuleAccessGuard } from "@/components/auth/module-access-guard"
import { Link } from "wouter"
import { Play, ChevronDown, ChevronRight, Clock, Lock, Video, Layers, BookOpen, BadgeCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { Course as APICourse, CourseModule } from "@/types/courses"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useOnboarding } from "@/contexts/onboarding-context"
import { FrameworkBanner } from "@/components/framework-banner"
import { getTeaserLockState } from "@/hooks/use-teaser-lock"
import { UpsellDialog } from "@/components/ui/upsell-dialog"

function formatDuration(minutes: number | null): string {
  if (!minutes) return ""
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins} min`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

function ModuleCard({
  module,
  index,
  courseId,
  locked,
  onLockedClick,
}: {
  module: CourseModule
  index: number
  courseId: string
  locked: boolean
  onLockedClick: () => void
}) {
  const thumbnail = module.thumbnail
  const [imgError, setImgError] = useState(false)
  const chaptersCount = module.chapters?.length || 0
  const duration = formatDuration(module.duration_minutes)

  const inner = (
    <div
      data-testid={`card-module-${module.id}`}
      className={cn(
        "flex bg-white border border-black/[0.06] rounded-xl overflow-hidden hover:shadow-sm transition-shadow group",
        locked && "opacity-60"
      )}
    >
      <div className="w-[200px] min-w-[200px] h-[120px] relative bg-gray-100 overflow-hidden shrink-0">
        {thumbnail && !imgError ? (
          <img
            src={thumbnail}
            alt={module.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgError(true)}
            data-testid={`img-module-${module.id}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
            <Play className="h-8 w-8 text-white/40" />
          </div>
        )}
        {locked && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Lock className="h-6 w-6 text-white/80" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 px-4 py-3 flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1" data-testid={`text-module-title-${module.id}`}>
            {index + 1}. {module.title}
          </h4>
          {module.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{module.description}</p>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            {locked ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-200 text-gray-500 text-xs font-semibold">
                <Lock className="h-3 w-3" />
                Locked
              </span>
            ) : (
              <span
                data-testid={`button-watch-${module.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition-colors"
              >
                <Play className="h-3 w-3" />
                Watch
              </span>
            )}
            {duration && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                {duration}
              </span>
            )}
          </div>

          {chaptersCount > 0 && (
            <span className="text-[10px] text-gray-400 font-medium px-2 py-0.5 rounded border border-gray-100 bg-gray-50">
              {chaptersCount} chapter{chaptersCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  )

  if (locked) {
    return (
      <div className="cursor-pointer" onClick={onLockedClick} data-testid={`link-module-${module.id}`}>
        {inner}
      </div>
    )
  }

  return (
    <Link href={`/framework/my-learning/${courseId}?module=${module.id}`} data-testid={`link-module-${module.id}`}>
      {inner}
    </Link>
  )
}

function CourseAccordion({
  course,
  courseIndex,
  defaultOpen,
  locked,
  onLockedClick,
}: {
  course: APICourse
  courseIndex: number
  defaultOpen?: boolean
  locked: boolean
  onLockedClick: () => void
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen ?? false)
  const modules = course.modules || []
  const totalChapters = modules.reduce((sum, m) => sum + (m.chapters?.length || 0), 0)
  const duration = formatDuration(course.duration_minutes)

  return (
    <div className="rounded-xl overflow-hidden" data-testid={`course-${course.id}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-white border border-black/[0.06] rounded-xl hover:bg-gray-50/50 transition-colors cursor-pointer"
        data-testid={`button-toggle-course-${course.id}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn(
            "flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors",
            isOpen ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"
          )}>
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </div>
          <div className="flex items-center gap-2.5 min-w-0">
            {course.thumbnail && (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-10 h-10 rounded-lg object-cover shrink-0 border border-black/[0.06]"
              />
            )}
            <div className="min-w-0 text-left">
              <span className="text-[15px] font-semibold truncate block">{course.title}</span>
              {course.description && (
                <span className="text-xs text-gray-400 truncate block">{course.description}</span>
              )}
            </div>
          </div>
          {locked && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500 shrink-0 ml-2">
              <Lock className="h-2.5 w-2.5" />
              Locked
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-3">
          <span className="text-xs text-gray-400 font-medium">{modules.length} Module{modules.length !== 1 ? "s" : ""}</span>
          {totalChapters > 0 && (
            <>
              <span className="text-gray-200">·</span>
              <span className="text-xs text-gray-400 font-medium">{totalChapters} Lesson{totalChapters !== 1 ? "s" : ""}</span>
            </>
          )}
          {duration && (
            <>
              <span className="text-gray-200">·</span>
              <span className="text-xs text-gray-400 font-medium">{duration}</span>
            </>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="space-y-3 pt-4 pl-5">
          {modules.map((mod, idx) => (
            <ModuleCard
              key={mod.id}
              module={mod}
              index={idx}
              courseId={course.id}
              locked={locked}
              onLockedClick={onLockedClick}
            />
          ))}
          {modules.length === 0 && (
            <p className="text-sm text-gray-400 py-4 pl-2">No modules available yet.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default function AcademyPage() {
  const [courses, setCourses] = useState<APICourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpsellOpen, setIsUpsellOpen] = useState(false)
  const { isFree } = useOnboarding()

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiFetch("/api/courses?published=true")
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch courses')
      }
      const data = await response.json()
      setCourses(data.courses || [])
    } catch (err) {
      console.error("Error fetching courses:", err)
      setError(err instanceof Error ? err.message : "Failed to load courses.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const totalModules = useMemo(() => courses.reduce((sum, c) => sum + (c.modules?.length || 0), 0), [courses])
  const totalLessons = useMemo(() => courses.reduce((sum, c) => sum + c.lessons_count, 0), [courses])

  return (
    <ModuleAccessGuard moduleId="courses">
      <div className="flex flex-1 flex-col gap-6 px-12 md:px-20 lg:px-32 py-6 md:py-8">
        <FrameworkBanner
          title="My Learning"
          description="Videos, tutorials, and training about dropshipping fundamentals"
          iconSrc="/images/banners/3d-learning.png"
          tutorialVideoUrl=""
        />

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900" data-testid="text-course-content">
            Course Library
          </h2>
          <span className="text-sm text-gray-400 font-medium">
            {courses.length} course{courses.length !== 1 ? "s" : ""} · {totalModules} modules · {totalLessons} lessons
          </span>
        </div>

        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-black/[0.06] bg-white p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive">
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
          <div className="space-y-4">
            {courses.map((course, index) => {
              const { isLocked } = getTeaserLockState(index, isFree, {
                freeVisibleCount: 3,
                strategy: "first-n-items"
              })
              return (
                <CourseAccordion
                  key={course.id}
                  course={course}
                  courseIndex={index}
                  defaultOpen={index === 0}
                  locked={isLocked}
                  onLockedClick={() => setIsUpsellOpen(true)}
                />
              )
            })}
          </div>
        )}
      </div>

      <UpsellDialog
        isOpen={isUpsellOpen}
        onClose={() => setIsUpsellOpen(false)}
      />
    </ModuleAccessGuard>
  )
}
