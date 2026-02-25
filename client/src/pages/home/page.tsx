
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { useUserPlanContext } from "@/contexts/user-plan-context"
import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/supabase"
import {
  ArrowRight,
  ChevronRight,
  Play,
  Mail,
  Sparkles,
  GraduationCap,
} from "lucide-react"

import { Link } from "wouter"

const howToCards = [
  {
    title: "Trending Products",
    subtitle: "Find today's hottest selling products.",
    href: "/products/product-hunt",
    thumbnail: "/thumbnails/trending-products.png",
  },
  {
    title: "Competitors' List",
    subtitle: "Spy on top stores and their best sellers.",
    href: "/products/competitor-stores",
    thumbnail: "/thumbnails/competitor-stores.png",
  },
  {
    title: "Mentorship",
    subtitle: "Learn step-by-step from expert mentors.",
    href: "/mentorship",
    thumbnail: "/thumbnails/mentorship-learning.png",
  },
  {
    title: "Marketing & Ads",
    subtitle: "Discover winning ad creatives and strategies.",
    href: "/ads/meta-ads",
    thumbnail: "/thumbnails/marketing-ads.png",
  },
  {
    title: "Private Suppliers",
    subtitle: "Connect with verified US suppliers.",
    href: "/private-supplier",
    thumbnail: "/thumbnails/suppliers-shipping.png",
  },
  {
    title: "AI Studio",
    subtitle: "Create branded content with AI tools.",
    href: "/studio/whitelabelling",
    thumbnail: "/thumbnails/ai-studio.png",
  },
]


function formatDuration(minutes: number | null): string {
  if (!minutes || minutes <= 0) return ""
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h > 0) return `${h}h ${m}m`
  return `${m} min`
}

function FreeLearningSection() {
  const { data, isLoading } = useQuery<{ courses: any[] }>({
    queryKey: ['/api/courses'],
    queryFn: () => apiFetch('/api/courses?published=true&pageSize=20&sortBy=created_at&sortOrder=asc').then(r => r.json()),
  })

  const courses = data?.courses || []

  if (isLoading) {
    return (
      <div>
        <h2 className="ds-section-title mb-4 flex items-center gap-2">
          <img src="/3d-ecom-icons-blue/Graduation_Book.png" alt="" width={24} height={24} className="w-6 h-6 object-contain" />
          Free Learning
        </h2>
        <div className="space-y-2.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[4.5rem] w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (courses.length === 0) return null

  const previewCourses = courses.slice(0, 6)
  const hasMore = courses.length > 6

  return (
    <div>
      <h2 className="ds-section-title mb-4 flex items-center gap-2">
        <img src="/3d-ecom-icons-blue/Graduation_Book.png" alt="" width={24} height={24} className="w-6 h-6 object-contain" />
        Free Learning
      </h2>
      <div className="space-y-2.5">
        {previewCourses.map((course: any) => (
          <Link
            key={course.id}
            href={`/framework/my-learning/${course.id}`}
            className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 bg-gradient-to-br from-blue-50/40 to-white hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer group"
            data-testid={`card-free-video-${course.id}`}
          >
            <div className="relative w-28 h-[4.5rem] rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  decoding="async"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100" />
              )}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                <div className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center">
                  <Play className="h-3.5 w-3.5 text-blue-600 ml-0.5" />
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="ds-card-title group-hover:text-blue-600 transition-colors line-clamp-1" data-testid={`text-course-title-${course.id}`}>{course.title}</h3>
              <p className="ds-caption mt-0.5">
                {course.lessons_count ? `${course.lessons_count} modules` : ""}
                {course.lessons_count && course.duration_minutes ? " · " : ""}
                {formatDuration(course.duration_minutes)}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
          </Link>
        ))}
      </div>
      {hasMore && (
        <div className="mt-3 flex justify-center">
          <Link
            href="/framework/my-learning"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
            data-testid="link-see-all-courses"
          >
            See all {courses.length} courses
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  )
}

function HowToUseSection() {
  return (
    <div>
      <h2 className="ds-section-title mb-4 flex items-center gap-2">
        <img src="/3d-ecom-icons-blue/Open_Board.png" alt="" width={24} height={24} className="w-6 h-6 object-contain" />
        How to use USDrop
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {howToCards.map((card) => (
          <Link key={card.href} href={card.href} data-testid={`link-howto-${card.title.toLowerCase().replace(/\s/g, '-')}`}>
            <div
              className="group relative rounded-[16px] overflow-hidden cursor-pointer h-full aspect-[16/10]"
              data-testid={`card-howto-${card.title.toLowerCase().replace(/\s/g, '-')}`}
            >
              <img
                src={card.thumbnail}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                decoding="async"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent transition-all duration-300 group-hover:from-black/75 group-hover:via-black/45 group-hover:to-black/25" />

              <div className="absolute bottom-0 left-0 right-0 p-6 z-10 transition-transform duration-300 ease-out group-hover:-translate-y-2">
                <div className="flex items-center gap-3 mb-1.5">
                  <h3 className="text-[22px] font-extrabold text-white uppercase tracking-[0.04em] leading-none">
                    {card.title}
                  </h3>
                  <ArrowRight className="w-6 h-6 text-white/80 transition-all duration-300 group-hover:text-white group-hover:translate-x-1" />
                </div>
                <p className="text-[14px] text-white/70 leading-[1.4] font-normal">
                  {card.subtitle}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function MentorshipBanner() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 30%, #8b5cf6 55%, #a855f7 75%, #ec4899 100%)',
      }}
      data-testid="banner-mentorship"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #fbbf24 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #38bdf8 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, white 0%, transparent 50%)' }}
        />
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 400 200">
          <circle cx="50" cy="30" r="40" fill="white" />
          <circle cx="350" cy="160" r="50" fill="white" />
          <circle cx="200" cy="100" r="30" fill="white" />
          <circle cx="320" cy="40" r="20" fill="white" />
          <circle cx="80" cy="150" r="25" fill="white" />
        </svg>
      </div>

      <div className="relative flex items-center gap-5 md:gap-8 p-6 md:p-8">
        <div className="shrink-0">
          <div className="w-20 h-20 md:w-[104px] md:h-[104px] rounded-2xl overflow-hidden border-[3px] border-white/30 shadow-2xl bg-white">
            <img
              src="/images/mentor-suprans.png"
              alt="Mr. Suprans - Your Mentor"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-sm">
              <GraduationCap className="h-3 w-3 text-amber-200" />
              <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.1em] text-amber-100">Your Mentor</span>
            </div>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-0.5">Mr. Suprans</h2>
          <p className="text-white/70 text-sm md:text-base font-medium">
            USA Dropshipping Mentorship
          </p>
        </div>

        <div className="shrink-0 flex flex-col items-end gap-3">
          <a
            href="mailto:info@suprans.in"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-white text-indigo-600 hover:bg-white/90 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shadow-lg shadow-black/10"
            data-testid="button-email-mentor"
          >
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Send Email</span>
            <span className="sm:hidden">Email</span>
          </a>
          <span className="text-[10px] text-white/40 hidden md:block">info@suprans.in</span>
        </div>
      </div>
    </div>
  )
}

function DashboardContent() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-6 px-12 md:px-20 lg:px-32 py-6 md:py-8">
        <MentorshipBanner />
        <FreeLearningSection />
        <HowToUseSection />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 flex-col gap-6 px-12 md:px-20 lg:px-32 py-6 md:py-8">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-white/60 bg-white/40 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-20 w-28 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  )
}
