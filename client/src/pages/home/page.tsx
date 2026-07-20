import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/supabase"
import {
  ArrowRight,
  ChevronRight,
  Play,
  GraduationCap,
  Building2,
  ShoppingBag,
  FileText,
  Truck,
  BarChart3,
  Palette,
  Target,
  Compass,
  Sparkles,
  Crown,
} from "lucide-react"
import { SiGmail } from "react-icons/si"
import { useAuth } from "@/contexts/auth-context"
import { journeyStages } from "@/data/journey-stages"
import { Link } from "wouter"

/* ------------------------------------------------------------------ data */

function useRoadmap() {
  const { data, isLoading } = useQuery<{ statuses: Record<string, string> }>({
    queryKey: ["/api/roadmap-progress"],
    queryFn: () => apiFetch("/api/roadmap-progress", { credentials: "include" }).then((r) => r.json()),
  })
  const statuses = data?.statuses || {}
  const totalTasks = journeyStages.reduce((s, st) => s + st.tasks.length, 0)
  const completedTasks = Object.values(statuses).filter((s) => s === "completed").length
  const inProgressTasks = Object.values(statuses).filter((s) => s === "in_progress").length
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const idx = journeyStages.findIndex((st) => st.tasks.some((t) => statuses[t.id] !== "completed"))
  const currentStage = idx >= 0 ? journeyStages[idx] : journeyStages[journeyStages.length - 1]
  return { isLoading, totalTasks, completedTasks, inProgressTasks, percentage, currentStage }
}

function useCourses() {
  const { data, isLoading } = useQuery<{ courses: any[] }>({
    queryKey: ["/api/courses"],
    queryFn: () =>
      apiFetch("/api/courses?published=true&pageSize=20&sortBy=created_at&sortOrder=asc").then((r) => r.json()),
  })
  return { courses: data?.courses || [], isLoading }
}

function useStoreConnected() {
  const { data, isLoading } = useQuery<{ stores: any[] }>({
    queryKey: ["/api/shopify-stores"],
    queryFn: () => apiFetch("/api/shopify-stores").then((r) => (r.ok ? r.json() : { stores: [] })),
  })
  return { connected: (data?.stores || []).length > 0, isLoading }
}

function formatDuration(minutes: number | null): string {
  if (!minutes || minutes <= 0) return ""
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m} min`
}

/* --------------------------------------------------------------- atoms */

function ProgressRing({ percentage, size = 132, stroke = 11 }: { percentage: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (percentage / 100) * c
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-white/10" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke="url(#homeRingGrad)"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
        <defs>
          <linearGradient id="homeRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[30px] font-bold text-white leading-none tracking-tight">{percentage}%</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/45 mt-1">Complete</span>
      </div>
    </div>
  )
}

function SectionHeading({ iconSrc, title, action }: { iconSrc: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <h2 className="ds-section-title flex items-center gap-2">
        <img src={iconSrc} alt="" width={24} height={24} className="w-6 h-6 object-contain" />
        {title}
      </h2>
      {action}
    </div>
  )
}

/* --------------------------------------------------------------- hero */

function HeroHeader() {
  const { user } = useAuth()
  const firstName = user?.full_name?.split(" ")[0] || "there"
  const { percentage, completedTasks, totalTasks, currentStage, isLoading } = useRoadmap()

  return (
    <section
      className="relative overflow-hidden rounded-2xl"
      style={{ background: "linear-gradient(135deg, #0a1628 0%, #0f1f3d 40%, #132a4a 70%, #1a3355 100%)" }}
      data-testid="home-hero"
    >
      <svg className="absolute inset-0 w-full h-full opacity-[0.3] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <filter id="homeNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#homeNoise)" />
      </svg>
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-[0.1] pointer-events-none" style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }} />

      <div className="relative flex flex-col lg:flex-row lg:items-center gap-6 px-6 py-6 md:px-9 md:py-7">
        {/* greeting + CTAs */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-2xl leading-none" role="img" aria-label="wave">👋</span>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">Welcome back, {firstName}</h1>
          </div>
          <p className="text-white/55 text-sm font-medium">
            {isLoading
              ? "Loading your roadmap…"
              : percentage >= 100
              ? "You've completed every step of the framework. Time to scale."
              : (
                <>You're in <span className="text-white/85 font-semibold">Stage {currentStage.number} · {currentStage.title}</span>. Pick up where you left off.</>
              )}
          </p>

          <div className="flex flex-wrap items-center gap-2.5 mt-5">
            <Link
              href="/framework/my-roadmap"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-white text-slate-900 hover:bg-white/90 text-sm font-semibold transition-all shadow-lg shadow-black/20"
              data-testid="button-continue-roadmap"
            >
              <Target className="h-4 w-4 text-blue-600" />
              Continue your roadmap
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/framework/my-learning"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-xl border border-white/20 text-white hover:bg-white/10 text-sm font-semibold transition-all"
              data-testid="button-go-learning"
            >
              <GraduationCap className="h-4 w-4" />
              Keep learning
            </Link>
          </div>
        </div>

        {/* mentor — featured image, fills the center */}
        <div className="flex items-center gap-4 shrink-0 lg:px-6 lg:border-l lg:border-white/10">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl bg-white shrink-0">
            <img src="/images/mentor-suprans.png" alt="Mr. Suprans — Your Mentor" className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <GraduationCap className="h-3.5 w-3.5 text-blue-300" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-blue-300">Your Mentor</span>
            </div>
            <h3 className="text-base md:text-lg font-bold text-white leading-tight">Mr. Suprans</h3>
            <div className="flex items-center gap-2 mt-2">
              <a href="mailto:info@suprans.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white text-slate-900 hover:bg-white/90 text-xs font-semibold transition-all shadow-md shadow-black/15" data-testid="button-email-mentor">
                <SiGmail className="h-3.5 w-3.5 text-[#EA4335]" /> Email
              </a>
              <a href="https://www.youtube.com/@suprans" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-white/20 text-white hover:bg-white/10 text-xs font-semibold transition-all" data-testid="button-watch-intro">
                <Play className="h-3.5 w-3.5" /> Intro
              </a>
            </div>
          </div>
        </div>

        {/* progress ring */}
        <Link
          href="/framework/my-roadmap"
          className="shrink-0 flex items-center justify-center lg:pl-6 lg:border-l lg:border-white/10 group"
          data-testid="link-hero-progress"
        >
          {isLoading ? (
            <div className="w-[116px] h-[116px] rounded-full border-4 border-white/10 animate-pulse" />
          ) : (
            <div className="flex flex-col items-center">
              <ProgressRing percentage={percentage} size={116} />
              <span className="text-[12px] text-white/50 mt-2 group-hover:text-white/70 transition-colors">
                {completedTasks}/{totalTasks} steps done
              </span>
            </div>
          )}
        </Link>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- stats */

function StatCard({ icon: Icon, label, value, tone }: { icon: typeof Target; label: string; value: string; tone: string }) {
  return (
    <div className="flex items-center gap-3.5 rounded-xl bg-white border border-black/[0.06] px-5 py-4" data-testid={`home-stat-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className={`flex items-center justify-center w-10 h-10 rounded-[10px] shrink-0 ${tone}`}>
        <Icon className="h-[18px] w-[18px]" />
      </div>
      <div className="min-w-0">
        <div className="text-[18px] leading-none font-bold text-black truncate">{value}</div>
        <div className="text-[11.5px] text-[#999] mt-1">{label}</div>
      </div>
    </div>
  )
}

function StatsRow() {
  const { percentage, currentStage, isLoading: rLoading } = useRoadmap()
  const { courses, isLoading: cLoading } = useCourses()
  const { connected, isLoading: sLoading } = useStoreConnected()

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" data-testid="home-stats">
      <StatCard icon={Target} label="Roadmap complete" value={rLoading ? "—" : `${percentage}%`} tone="bg-blue-50 text-blue-600" />
      <StatCard icon={Compass} label="Current stage" value={rLoading ? "—" : `Stage ${currentStage.number}`} tone="bg-indigo-50 text-indigo-600" />
      <StatCard icon={GraduationCap} label="Courses available" value={cLoading ? "—" : String(courses.length)} tone="bg-violet-50 text-violet-600" />
      <StatCard icon={ShoppingBag} label="Shopify store" value={sLoading ? "—" : connected ? "Connected" : "Not yet"} tone="bg-emerald-50 text-emerald-600" />
    </div>
  )
}

/* --------------------------------------------------------------- business */

const businessQuickLinks = [
  { icon: Crown, label: "The Program", description: "Go from learning to a real US business", href: "/program", iconBg: "bg-amber-50", iconColor: "text-amber-600" },
  { icon: Sparkles, label: "Build My Store", description: "Done-for-you Shopify store", href: "/build-store", iconBg: "bg-indigo-50", iconColor: "text-indigo-600" },
  { icon: Building2, label: "My LLC", description: "US company formation", href: "/llc", iconBg: "bg-blue-50", iconColor: "text-blue-600" },
  { icon: ShoppingBag, label: "Store Suite", description: "Manage your Shopify store", href: "/store", iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
  { icon: FileText, label: "My Products", description: "Product list & research", href: "/framework/my-products", iconBg: "bg-violet-50", iconColor: "text-violet-600" },
  { icon: Truck, label: "Fulfillment", description: "China-warehouse fulfillment", href: "/fulfillment", iconBg: "bg-amber-50", iconColor: "text-amber-600" },
  { icon: BarChart3, label: "Hot Products", description: "Trending & bestsellers", href: "/products/trending", iconBg: "bg-rose-50", iconColor: "text-rose-600" },
  { icon: Palette, label: "AI Studio", description: "Whitelabelling & creatives", href: "/ai-studio/whitelabelling", iconBg: "bg-cyan-50", iconColor: "text-cyan-600" },
]

function MyBusinessSection() {
  return (
    <div>
      <SectionHeading iconSrc="/3d-ecom-icons-blue/Toolbox_Wrench.png" title="My Business" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {businessQuickLinks.map((item) => (
          <Link key={item.href} href={item.href} data-testid={`link-business-${item.label.toLowerCase().replace(/\s+/g, "-")}`}>
            <div className="group flex items-center gap-3.5 px-5 py-4 rounded-xl bg-white border border-black/[0.06] hover:border-black/[0.12] hover:shadow-sm transition-all cursor-pointer h-full">
              <div className={`flex items-center justify-center w-10 h-10 rounded-[10px] ${item.iconBg} flex-shrink-0`}>
                <item.icon className={`h-[18px] w-[18px] ${item.iconColor}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-black leading-tight">{item.label}</p>
                <p className="text-[11px] text-[#999] leading-tight mt-0.5 hidden md:block">{item.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

/* --------------------------------------------------------------- learning */

function FreeLearningSection() {
  const { courses, isLoading } = useCourses()

  if (isLoading) {
    return (
      <div>
        <SectionHeading iconSrc="/3d-ecom-icons-blue/Graduation_Book.png" title="Continue Learning" />
        <div className="space-y-2.5">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[4.5rem] w-full rounded-xl" />)}
        </div>
      </div>
    )
  }
  if (courses.length === 0) return null

  const previewCourses = courses.slice(0, 6)
  const hasMore = courses.length > 6

  return (
    <div>
      <SectionHeading
        iconSrc="/3d-ecom-icons-blue/Graduation_Book.png"
        title="Continue Learning"
        action={hasMore ? (
          <Link href="/framework/my-learning" className="inline-flex items-center gap-1 text-[13px] font-medium text-blue-600 hover:text-blue-700" data-testid="link-see-all-courses">
            See all {courses.length} <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        ) : undefined}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {previewCourses.map((course: any) => (
          <Link
            key={course.id}
            href={`/framework/my-learning/${course.id}`}
            className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer group"
            data-testid={`card-free-video-${course.id}`}
          >
            <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" decoding="async" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100" />
              )}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                <div className="h-7 w-7 rounded-full bg-white/90 flex items-center justify-center">
                  <Play className="h-3 w-3 text-blue-600 ml-0.5" />
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="ds-card-title group-hover:text-blue-600 transition-colors line-clamp-1">{course.title}</h3>
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
    </div>
  )
}

/* --------------------------------------------------------------- how to */

const howToCards = [
  { title: "Trending Products", subtitle: "Find today's hottest selling products.", href: "/products/product-hunt", thumbnail: "/thumbnails/trending-products.png" },
  { title: "Competitors' List", subtitle: "Spy on top stores and their best sellers.", href: "/products/competitor-stores", thumbnail: "/thumbnails/competitor-stores.png" },
  { title: "Mentorship", subtitle: "Learn step-by-step from expert mentors.", href: "/mentorship", thumbnail: "/thumbnails/mentorship-learning.png" },
  { title: "Marketing & Ads", subtitle: "Discover winning ad creatives and strategies.", href: "/ads/meta-ads", thumbnail: "/thumbnails/marketing-ads.png" },
  { title: "Private Suppliers", subtitle: "Connect with verified US suppliers.", href: "/private-supplier", thumbnail: "/thumbnails/suppliers-shipping.png" },
  { title: "AI Studio", subtitle: "Create branded content with AI tools.", href: "/ai-studio/whitelabelling", thumbnail: "/thumbnails/ai-studio.png" },
]

function HowToUseSection() {
  return (
    <div>
      <SectionHeading iconSrc="/3d-ecom-icons-blue/Open_Board.png" title="How to use USDrop" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
        {howToCards.map((card) => (
          <Link key={card.href} href={card.href} data-testid={`link-howto-${card.title.toLowerCase().replace(/\s/g, "-")}`}>
            <div className="group relative rounded-xl overflow-hidden cursor-pointer h-full aspect-[16/10] border border-black/[0.04]">
              <img src={card.thumbnail} alt={card.title} className="absolute inset-0 w-full h-full object-cover" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-[14px] font-semibold text-white leading-tight">{card.title}</h3>
                  <ArrowRight className="w-3.5 h-3.5 text-white/70 transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="text-[11.5px] text-white/65 leading-snug mt-0.5 line-clamp-1">{card.subtitle}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

/* --------------------------------------------------------------- page */

function DashboardContent() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-8 px-12 md:px-20 lg:px-32 py-3">
        <HeroHeader />
        <StatsRow />
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
        <div className="flex flex-1 flex-col gap-8 px-12 md:px-20 lg:px-32 py-3">
          <Skeleton className="h-44 w-full rounded-2xl" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[72px] w-full rounded-xl" />)}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-[72px] w-full rounded-xl" />)}
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  )
}
