
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { useUserPlanContext } from "@/contexts/user-plan-context"
import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/supabase"
import {
  ArrowRight,
  ChevronRight,
  Play,
  Sparkles,
  GraduationCap,
  Check,
  Building2,
  ShoppingBag,
  FileText,
  Truck,
  BarChart3,
  Palette,
} from "lucide-react"
import { SiGmail } from "react-icons/si"
import { useAuth } from "@/contexts/auth-context"
import { journeyStages } from "@/data/journey-stages"

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

const businessQuickLinks = [
  {
    icon: Building2,
    label: "My LLC",
    description: "US company formation",
    href: "/llc",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: ShoppingBag,
    label: "My Shopify Store",
    description: "Store setup & management",
    href: "/framework/my-store",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: FileText,
    label: "My Products",
    description: "Product list & research",
    href: "/framework/my-products",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    icon: Truck,
    label: "Private Supplier",
    description: "Sourcing & fulfillment",
    href: "/private-supplier",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    icon: BarChart3,
    label: "Hot Products",
    description: "Trending & bestsellers",
    href: "/winning-products",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
  },
  {
    icon: Palette,
    label: "AI Studio",
    description: "Whitelabelling & creatives",
    href: "/studio/whitelabelling",
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
  },
]

function MyBusinessSection() {
  return (
    <div>
      <h2 className="ds-section-title mb-4 flex items-center gap-2">
        <img src="/3d-ecom-icons-blue/Toolbox_Wrench.png" alt="" width={24} height={24} className="w-6 h-6 object-contain" />
        My Business
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {businessQuickLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            data-testid={`link-business-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <div className="group flex items-center gap-3.5 px-5 py-4 rounded-xl bg-white border border-black/[0.06] hover:border-black/[0.12] hover:shadow-sm transition-all cursor-pointer h-full">
              <div className={`flex items-center justify-center w-10 h-10 rounded-[10px] ${item.iconBg} flex-shrink-0`}>
                <item.icon className={`h-[18px] w-[18px] ${item.iconColor}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-black leading-tight" data-testid={`text-business-label-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  {item.label}
                </p>
                <p className="text-[11px] text-[#999] leading-tight mt-0.5 hidden md:block">
                  {item.description}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
            </div>
          </Link>
        ))}
      </div>
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

const mentorAchievements = [
  "100+ Students Mentored",
  "USA Dropshipping Expert",
  "1-on-1 Guidance",
  "Proven Framework",
]

function RoadmapProgressChart() {
  const { data, isLoading } = useQuery<{ statuses: Record<string, string> }>({
    queryKey: ['/api/roadmap-progress'],
    queryFn: () => apiFetch('/api/roadmap-progress', { credentials: 'include' }).then(r => r.json()),
  })

  const totalTasks = journeyStages.reduce((sum, s) => sum + s.tasks.length, 0)
  const completedTasks = data?.statuses
    ? Object.values(data.statuses).filter(s => s === 'completed').length
    : 0
  const inProgressTasks = data?.statuses
    ? Object.values(data.statuses).filter(s => s === 'in_progress').length
    : 0
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const radius = 62
  const strokeWidth = 10
  const circumference = 2 * Math.PI * radius
  const completedOffset = circumference - (completedTasks / totalTasks) * circumference
  const inProgressArc = (inProgressTasks / totalTasks) * circumference
  const completedArc = (completedTasks / totalTasks) * circumference
  const inProgressOffset = circumference - completedArc - inProgressArc

  const currentStageIndex = journeyStages.findIndex((stage) => {
    return stage.tasks.some(t => {
      const status = data?.statuses?.[t.id]
      return !status || status !== 'completed'
    })
  })
  const currentStage = currentStageIndex >= 0 ? journeyStages[currentStageIndex] : journeyStages[journeyStages.length - 1]

  const remainingTasks = totalTasks - completedTasks - inProgressTasks
  const chartSize = 180
  const cx = chartSize / 2
  const cy = chartSize / 2
  const outerR = 82
  const innerR = 45

  const completedAngle = totalTasks > 0 ? (completedTasks / totalTasks) * 360 : 0
  const inProgressAngle = totalTasks > 0 ? (inProgressTasks / totalTasks) * 360 : 0
  const remainingAngle = totalTasks > 0 ? (remainingTasks / totalTasks) * 360 : 360

  function describeArc(startAngle: number, endAngle: number, outerRadius: number, innerRadius: number) {
    const startRad = ((startAngle - 90) * Math.PI) / 180
    const endRad = ((endAngle - 90) * Math.PI) / 180
    const largeArc = endAngle - startAngle > 180 ? 1 : 0

    const x1 = cx + outerRadius * Math.cos(startRad)
    const y1 = cy + outerRadius * Math.sin(startRad)
    const x2 = cx + outerRadius * Math.cos(endRad)
    const y2 = cy + outerRadius * Math.sin(endRad)
    const x3 = cx + innerRadius * Math.cos(endRad)
    const y3 = cy + innerRadius * Math.sin(endRad)
    const x4 = cx + innerRadius * Math.cos(startRad)
    const y4 = cy + innerRadius * Math.sin(startRad)

    if (endAngle - startAngle >= 360) {
      return [
        `M ${cx + outerRadius} ${cy}`,
        `A ${outerRadius} ${outerRadius} 0 1 1 ${cx - outerRadius} ${cy}`,
        `A ${outerRadius} ${outerRadius} 0 1 1 ${cx + outerRadius} ${cy}`,
        `M ${cx + innerRadius} ${cy}`,
        `A ${innerRadius} ${innerRadius} 0 1 0 ${cx - innerRadius} ${cy}`,
        `A ${innerRadius} ${innerRadius} 0 1 0 ${cx + innerRadius} ${cy}`,
        'Z'
      ].join(' ')
    }

    return [
      `M ${x1} ${y1}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
      'Z'
    ].join(' ')
  }

  let offset = 0
  const segments: { color: string; angle: number }[] = []
  if (completedAngle > 0) segments.push({ color: '#22c55e', angle: completedAngle })
  if (inProgressAngle > 0) segments.push({ color: '#eab308', angle: inProgressAngle })
  if (remainingAngle > 0) segments.push({ color: '#ef4444', angle: remainingAngle })

  return (
    <Link
      href="/framework/my-roadmap"
      className="flex flex-col items-center justify-center h-full cursor-pointer group"
      data-testid="link-roadmap-progress"
    >
      <div className="relative">
        {isLoading ? (
          <div className="w-[180px] h-[180px] rounded-full border-4 border-gray-100 animate-pulse" />
        ) : (
          <svg width={chartSize} height={chartSize} viewBox={`0 0 ${chartSize} ${chartSize}`}>
            {segments.map((seg, i) => {
              const startAngle = offset
              const endAngle = offset + seg.angle
              offset = endAngle
              return (
                <path
                  key={i}
                  d={describeArc(startAngle, endAngle, outerR, innerR)}
                  fill={seg.color}
                  className="transition-all duration-700 ease-out"
                />
              )
            })}
          </svg>
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[32px] font-bold text-gray-900 tracking-tight leading-none">{percentage}%</span>
        </div>
      </div>
      <span className="text-[13px] font-bold uppercase tracking-[0.08em] text-gray-900 mt-3">Progress Tracker</span>
    </Link>
  )
}

function MentorshipBanner() {
  const { user } = useAuth()
  const firstName = user?.full_name?.split(" ")[0] || "there"

  return (
    <div className="flex gap-3 items-stretch" data-testid="banner-mentorship">
      <div className="flex-1 min-w-0 space-y-3">
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, #0a1628 0%, #0f1f3d 40%, #132a4a 70%, #1a3355 100%)',
          }}
        >
          <svg className="absolute inset-0 w-full h-full opacity-[0.35] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <filter id="noiseFilter1">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter1)" />
          </svg>
          <div className="relative flex items-center gap-3 px-6 py-5 md:px-8 md:py-6">
            <span className="text-3xl md:text-4xl leading-none" role="img" aria-label="wave">👋</span>
            <div>
              <h2 className="text-lg md:text-xl font-bold tracking-tight text-white">
                Welcome, {firstName}
              </h2>
              <p className="text-white/50 text-sm font-medium mt-0.5">
                Let's build your business today
              </p>
            </div>
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, #0a1628 0%, #0f1f3d 40%, #132a4a 70%, #1a3355 100%)',
          }}
        >
          <svg className="absolute inset-0 w-full h-full opacity-[0.35] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <filter id="noiseFilter2">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter2)" />
          </svg>

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-[0.08]"
              style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }}
            />
            <div
              className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-[0.06]"
              style={{ background: 'radial-gradient(circle, #60a5fa 0%, transparent 70%)' }}
            />
          </div>

          <div className="relative flex items-center gap-5 p-6 md:p-6">
            <div className="shrink-0">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl bg-white">
                <img
                  src="/images/mentor-suprans.png"
                  alt="Mr. Suprans - Your Mentor"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <GraduationCap className="h-3.5 w-3.5 text-blue-300" />
                <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.1em] text-blue-300">Your Mentor</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-2.5">Mr. Suprans</h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {mentorAchievements.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500/20 shrink-0">
                      <Check className="h-2.5 w-2.5 text-emerald-400" />
                    </span>
                    <span className="text-[13px] text-white/70">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden md:flex flex-col gap-2 shrink-0 ml-auto">
              <a
                href="mailto:info@suprans.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-white text-slate-900 hover:bg-white/90 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shadow-md shadow-black/15"
                data-testid="button-email-mentor"
              >
                <SiGmail className="h-3.5 w-3.5 text-[#EA4335]" />
                Send Email
              </a>
              <a
                href="https://www.youtube.com/@suprans"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg border border-white/20 text-white hover:bg-white/10 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
                data-testid="button-watch-intro"
              >
                <Play className="h-3.5 w-3.5" />
                Watch Intro
              </a>
            </div>
          </div>

          <div className="flex md:hidden gap-2.5 px-6 pb-6">
            <a
              href="mailto:info@suprans.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-white text-slate-900 hover:bg-white/90 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shadow-lg shadow-black/20 flex-1"
              data-testid="button-email-mentor-mobile"
            >
              <SiGmail className="h-4 w-4 text-[#EA4335]" />
              Send Email
            </a>
            <a
              href="https://www.youtube.com/@suprans"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl border border-white/20 text-white hover:bg-white/10 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex-1"
              data-testid="button-watch-intro-mobile"
            >
              <Play className="h-4 w-4" />
              Watch Intro
            </a>
          </div>
        </div>
      </div>

      <div className="hidden lg:block w-[300px] shrink-0">
        <RoadmapProgressChart />
      </div>
    </div>
  )
}

function DashboardContent() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-6 px-12 md:px-20 lg:px-32 py-6 md:py-8">
        <MentorshipBanner />
        <MyBusinessSection />
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
