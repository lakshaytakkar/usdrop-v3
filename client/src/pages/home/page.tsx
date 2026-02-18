

import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, Suspense } from "react"
import { ExternalLayout } from "@/components/layout/external-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { BlueSpinner } from "@/components/ui/blue-spinner"
import { OnboardingProgressOverlay } from "@/components/onboarding/onboarding-progress-overlay"
import { useAuth } from "@/contexts/auth-context"
import { useUserPlanContext } from "@/contexts/user-plan-context"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import {
  ChevronRight,
  Bookmark,
  ShoppingBag,
  Map,
  UserCircle,
  KeyRound,
  GraduationCap,
  Search,
  Trophy,
  Video,
  Wrench,
  Newspaper,
  Truck,
  Store,
  Palette,
  Calculator,
  Globe,
  User,
  Mail,
  Phone,
  Building2,
  BookOpen,
  Clock,
  Star,
  TrendingUp,
} from "lucide-react"

import { Link } from "wouter"
import { cn } from "@/lib/utils"
import { journeyStages } from "@/data/journey-stages"

interface CourseData {
  id: string
  title: string
  thumbnail: string | null
  category: string | null
  level: string | null
  lessons_count: number
  duration_minutes: number | null
  rating: number | null
}

interface UserDetails {
  full_name: string
  email: string
  contact_number: string
  website_name: string
  llc_name: string
  batch_id: string
}


function ProfileSummaryCard() {
  const { user } = useAuth()
  const { plan, isPro } = useUserPlanContext()
  const [details, setDetails] = useState<UserDetails | null>(null)

  useEffect(() => {
    apiFetch("/api/user-details")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setDetails({
            full_name: data.full_name || "",
            email: data.email || "",
            contact_number: data.contact_number || "",
            website_name: data.website_name || "",
            llc_name: data.llc_name || "",
            batch_id: data.batch_id || "",
          })
        }
      })
      .catch(() => {})
  }, [])

  const displayName = details?.full_name || user?.full_name || user?.email?.split("@")[0] || "User"
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)

  const infoItems = [
    { icon: Mail, value: user?.email },
    { icon: Phone, value: details?.contact_number },
    { icon: Globe, value: details?.website_name },
    { icon: Building2, value: details?.llc_name },
  ].filter((item) => item.value)

  return (
    <Card className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white overflow-hidden border-0">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h2 className="text-lg font-bold truncate">{displayName}</h2>
            <Badge className={cn("text-[10px] px-1.5 py-0 h-4 border-0 shrink-0", isPro ? "bg-amber-500 text-white" : "bg-white/20 text-white/80")}>
              {plan || "Free"}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/70">
            {infoItems.map((item, i) => (
              <span key={i} className="flex items-center gap-1">
                <item.icon className="h-3 w-3" />
                <span className="truncate max-w-[160px]">{item.value}</span>
              </span>
            ))}
          </div>
          {details?.batch_id && (
            <span className="text-[10px] text-white/50 mt-1 block">Batch: {details.batch_id}</span>
          )}
        </div>
        <Link href="/my-profile" className="shrink-0 text-white/60 hover:text-white transition-colors">
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>
    </Card>
  )
}

function QuickStatsRow() {
  const { stats, isLoading } = useDashboardStats()
  const [courseCount, setCourseCount] = useState(0)
  const [roadmapProgress, setRoadmapProgress] = useState({ completed: 0, total: 0 })

  useEffect(() => {
    apiFetch("/api/courses?published=true&pageSize=100")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setCourseCount(d.total || 0))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const total = journeyStages.reduce((sum, s) => sum + s.tasks.length, 0)
    apiFetch("/api/roadmap-progress", { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.statuses) {
          const completed = Object.values(data.statuses).filter((s) => s === "completed").length
          setRoadmapProgress({ completed, total })
        } else {
          setRoadmapProgress({ completed: 0, total })
        }
      })
      .catch(() => setRoadmapProgress({ completed: 0, total }))
  }, [])

  const statItems = [
    { label: "Products Saved", value: stats?.products?.inPicklist || 0, icon: Bookmark, link: "/my-products", color: "text-blue-600 bg-blue-50" },
    { label: "Connected Stores", value: stats?.stores?.connected || 0, icon: ShoppingBag, link: "/my-store", color: "text-emerald-600 bg-emerald-50" },
    { label: "Courses", value: courseCount, icon: GraduationCap, link: "/mentorship", color: "text-amber-600 bg-amber-50" },
    { label: "Roadmap", value: `${roadmapProgress.completed}/${roadmapProgress.total}`, icon: Map, link: "/my-roadmap", color: "text-purple-600 bg-purple-50" },
    { label: "Day Streak", value: stats?.activity?.streakDays || 0, icon: TrendingUp, color: "text-orange-600 bg-orange-50" },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-3">
            <Skeleton className="h-8 w-8 rounded-lg mb-2" />
            <Skeleton className="h-3 w-16 mb-1" />
            <Skeleton className="h-5 w-10" />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {statItems.map((item, i) => (
        <Link key={i} href={item.link || "#"} className="block">
          <Card className="p-3 hover:border-gray-300 transition-colors cursor-pointer group">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-2", item.color)}>
              <item.icon className="h-4 w-4" />
            </div>
            <p className="text-[11px] text-gray-500 mb-0.5">{item.label}</p>
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-gray-900">{item.value}</p>
              {item.link && <ChevronRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-gray-500 transition-colors" />}
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}

const frameworkCards = [
  {
    title: "My Products",
    description: "Your saved and bookmarked products from Product Hunt",
    icon: Bookmark,
    href: "/my-products",
    color: "text-blue-600 bg-blue-50 border-blue-100",
    iconSrc: "/3d-ecom-icons-blue/My_Products.png",
  },
  {
    title: "My Store",
    description: "Manage your connected Shopify stores",
    icon: ShoppingBag,
    href: "/my-store",
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    iconSrc: "/3d-ecom-icons-blue/My_Store.png",
    isPro: true,
  },
  {
    title: "My Roadmap",
    description: "Track your dropshipping journey progress",
    icon: Map,
    href: "/my-roadmap",
    color: "text-purple-600 bg-purple-50 border-purple-100",
    iconSrc: "/3d-ecom-icons-blue/Rocket_Launch.png",
  },
  {
    title: "My Profile",
    description: "Your business details and personal information",
    icon: UserCircle,
    href: "/my-profile",
    color: "text-gray-600 bg-gray-50 border-gray-100",
  },
  {
    title: "My Credentials",
    description: "Securely stored tool logins and API keys",
    icon: KeyRound,
    href: "/my-credentials",
    color: "text-rose-600 bg-rose-50 border-rose-100",
  },
]

function FrameworkCardsGrid() {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Your Framework</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {frameworkCards.map((card) => (
          <Link key={card.href} href={card.href} className="block group">
            <Card className="p-4 h-full hover:border-gray-300 transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                {card.iconSrc ? (
                  <img src={card.iconSrc} alt={card.title} width={40} height={40} decoding="async" className="w-10 h-10 object-contain shrink-0" />
                ) : (
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", card.color)}>
                    <card.icon className="h-5 w-5" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">{card.title}</h4>
                    {card.isPro && (
                      <Badge className="text-[9px] px-1 py-0 h-3.5 bg-amber-500 text-white border-0">PRO</Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{card.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

const exploreLinks = [
  { title: "Product Hunt", description: "Discover trending products", icon: Search, href: "/product-hunt", iconSrc: "/3d-ecom-icons-blue/Search_Product.png" },
  { title: "Winning Products", description: "Curated top sellers", icon: Trophy, href: "/winning-products", iconSrc: "/3d-ecom-icons-blue/Trophy_Star.png" },
  { title: "Mentorship", description: "Courses & learning", icon: GraduationCap, href: "/mentorship", iconSrc: "/3d-ecom-icons-blue/Graduation_Book.png" },
  { title: "Meta Ads", description: "Ad creatives library", icon: Video, href: "/meta-ads", iconSrc: "/3d-ecom-icons-blue/Megaphone_Ads.png" },
  { title: "Competitor Stores", description: "Analyze competitors", icon: Store, href: "/competitor-stores", iconSrc: "/3d-ecom-icons-blue/Competitor_Search.png" },
  { title: "Suppliers", description: "Private supplier network", icon: Truck, href: "/suppliers", iconSrc: "/3d-ecom-icons-blue/Delivery_Truck.png" },
  { title: "Studio", description: "Whitelabelling & models", icon: Palette, href: "/studio/whitelabelling", iconSrc: "/3d-ecom-icons-blue/Paint_Palette.png" },
  { title: "Tools", description: "Descriptions, invoices & more", icon: Wrench, href: "/tools", iconSrc: "/3d-ecom-icons-blue/Toolbox_Wrench.png" },
  { title: "Shipping Calculator", description: "Estimate shipping costs", icon: Calculator, href: "/shipping-calculator", iconSrc: "/3d-ecom-icons-blue/Calculator_Ship.png" },
  { title: "Blogs", description: "Articles & intelligence", icon: Newspaper, href: "/blogs", iconSrc: "/3d-ecom-icons-blue/Open_Board.png" },
]

function ExploreGrid() {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Explore & Tools</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {exploreLinks.map((item) => (
          <Link key={item.href} href={item.href} className="block group">
            <Card className="px-3 py-2.5 hover:border-gray-300 transition-colors cursor-pointer">
              <div className="flex items-center gap-2.5">
                <img src={item.iconSrc} alt={item.title} width={32} height={32} decoding="async" className="w-8 h-8 object-contain shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-semibold text-gray-900 truncate">{item.title}</h4>
                  <p className="text-[10px] text-gray-400 truncate">{item.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
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

function RecentCoursesCard() {
  const [courses, setCourses] = useState<CourseData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    apiFetch("/api/courses?published=true&pageSize=4&sortBy=created_at&sortOrder=desc")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) setCourses(d.courses || [])
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <Card className="p-4">
        <Skeleton className="h-4 w-32 mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3 p-2 rounded border">
              <Skeleton className="w-20 h-12 rounded flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  if (courses.length === 0) return null

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <img src="/3d-ecom-icons-blue/Course_Book.png" alt="Courses" width={28} height={28} decoding="async" className="w-7 h-7 object-contain" />
          <h3 className="text-sm font-semibold text-gray-900">Latest Courses</h3>
        </div>
        <Link href="/mentorship" className="text-xs text-indigo-600 hover:text-indigo-700 transition-colors">
          View all
        </Link>
      </div>
      <div className="space-y-1.5">
        {courses.map((course) => (
          <Link key={course.id} href={`/mentorship/${course.id}`} className="block group">
            <div className="flex items-center gap-3 p-2 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 transition-colors">
              <div className="relative w-20 h-12 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full"><BookOpen className="h-4 w-4 text-gray-300" /></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">{course.title}</h4>
                <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
                  {course.lessons_count > 0 && (
                    <span className="flex items-center gap-0.5"><BookOpen className="h-2.5 w-2.5" />{course.lessons_count} lessons</span>
                  )}
                  {course.duration_minutes && (
                    <span className="flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" />{formatDuration(course.duration_minutes)}</span>
                  )}
                  {course.rating && (
                    <span className="flex items-center gap-0.5"><Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />{course.rating.toFixed(1)}</span>
                  )}
                </div>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </Card>
  )
}

function RoadmapProgressCard() {
  const [progress, setProgress] = useState({ completed: 0, inProgress: 0, total: 0, percent: 0 })

  useEffect(() => {
    const total = journeyStages.reduce((sum, s) => sum + s.tasks.length, 0)
    apiFetch("/api/roadmap-progress", { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.statuses) {
          const statuses: Record<string, string> = data.statuses
          const completed = Object.values(statuses).filter((s) => s === "completed").length
          const inProgress = Object.values(statuses).filter((s) => s === "in_progress").length
          setProgress({ completed, inProgress, total, percent: total > 0 ? Math.round((completed / total) * 100) : 0 })
        }
      })
      .catch(() => {})
  }, [])

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <img src="/3d-ecom-icons-blue/Rocket_Launch.png" alt="Roadmap" width={28} height={28} decoding="async" className="w-7 h-7 object-contain" />
          <h3 className="text-sm font-semibold text-gray-900">Roadmap Progress</h3>
        </div>
        <Link href="/my-roadmap" className="text-xs text-indigo-600 hover:text-indigo-700 transition-colors">
          Open
        </Link>
      </div>
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500">{progress.completed} of {progress.total} tasks</span>
            <span className="text-xs font-bold text-gray-900">{progress.percent}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
        <div className="flex gap-3 text-[10px]">
          <span className="flex items-center gap-1 text-green-600">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            {progress.completed} Done
          </span>
          <span className="flex items-center gap-1 text-yellow-600">
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            {progress.inProgress} In Progress
          </span>
          <span className="flex items-center gap-1 text-gray-400">
            <span className="w-2 h-2 rounded-full bg-gray-300" />
            {progress.total - progress.completed - progress.inProgress} Pending
          </span>
        </div>
      </div>
    </Card>
  )
}

function DashboardContent() {
  return (
    <ExternalLayout>
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-gray-50/50">
        <ProfileSummaryCard />
        <QuickStatsRow />
        <FrameworkCardsGrid />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RecentCoursesCard />
          <RoadmapProgressCard />
        </div>
        <ExploreGrid />
        <OnboardingProgressOverlay pageName="Dashboard" />
      </div>
    </ExternalLayout>
  )
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <ExternalLayout>
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-gray-50/50">
            <div className="flex justify-center items-center" style={{ minHeight: "calc(100vh - 300px)" }}>
              <BlueSpinner size="lg" label="Loading dashboard..." />
            </div>
          </div>
        </ExternalLayout>
      }
    >
      <DashboardContent />
    </Suspense>
  )
}
