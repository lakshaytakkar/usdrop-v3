

import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, Suspense } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { BlueSpinner } from "@/components/ui/blue-spinner"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
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
    { icon: Mail, label: "Email", value: user?.email },
    { icon: Phone, label: "Phone", value: details?.contact_number },
    { icon: Globe, label: "Website", value: details?.website_name },
    { icon: Building2, label: "LLC", value: details?.llc_name },
  ].filter((item) => item.value)

  return (
    <Card className="p-6 md:p-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white overflow-hidden border-0 rounded-2xl" data-testid="card-profile-summary">
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 flex items-center justify-center text-2xl md:text-3xl font-bold shrink-0" data-testid="img-avatar">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl md:text-2xl font-bold truncate" data-testid="text-username">{displayName}</h2>
            <Badge className={cn("text-xs px-2.5 py-0.5 border-0 shrink-0", isPro ? "bg-amber-500 text-white" : "bg-white/20 text-white/80")} data-testid="status-plan">
              {plan || "Free"}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-white/70 mt-1">
            {infoItems.map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <item.icon className="h-3.5 w-3.5" />
                <span className="truncate max-w-[200px]">{item.value}</span>
              </span>
            ))}
          </div>
          {details?.batch_id && (
            <span className="text-xs text-white/50 mt-2 block">Batch: {details.batch_id}</span>
          )}
        </div>
        <Link href="/my-profile" className="shrink-0 text-white/60 hover:text-white transition-colors" data-testid="link-profile">
          <ChevronRight className="h-6 w-6" />
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-5 rounded-xl">
            <Skeleton className="h-10 w-10 rounded-xl mb-3" />
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-7 w-14" />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {statItems.map((item, i) => (
        <Link key={i} href={item.link || "#"} className="block" data-testid={`link-stat-${item.label.toLowerCase().replace(/\s/g, '-')}`}>
          <Card className="p-5 hover:border-gray-300 transition-all cursor-pointer group rounded-xl hover:shadow-sm">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", item.color)}>
              <item.icon className="h-5 w-5" />
            </div>
            <p className="text-sm text-gray-500 mb-1">{item.label}</p>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-gray-900" data-testid={`text-stat-${item.label.toLowerCase().replace(/\s/g, '-')}`}>{item.value}</p>
              {item.link && <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition-colors" />}
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
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Framework</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {frameworkCards.map((card) => (
          <Link key={card.href} href={card.href} className="block group" data-testid={`link-framework-${card.title.toLowerCase().replace(/\s/g, '-')}`}>
            <Card className="p-5 h-full hover:border-gray-300 transition-all cursor-pointer rounded-xl hover:shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h4 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{card.title}</h4>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    {card.isPro && (
                      <Badge className="text-[10px] px-1.5 py-0 h-4 bg-amber-500 text-white border-0">PRO</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{card.description}</p>
                </div>
                <div className="shrink-0 ml-4">
                  {card.iconSrc ? (
                    <img src={card.iconSrc} alt={card.title} width={52} height={52} decoding="async" className="w-13 h-13 object-contain" />
                  ) : (
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", card.color)}>
                      <card.icon className="h-6 w-6" />
                    </div>
                  )}
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
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Explore & Tools</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {exploreLinks.map((item) => (
          <Link key={item.href} href={item.href} className="block group" data-testid={`link-explore-${item.title.toLowerCase().replace(/\s/g, '-')}`}>
            <Card className="p-4 hover:border-gray-300 transition-all cursor-pointer rounded-xl hover:shadow-sm">
              <div className="flex items-center gap-3">
                <img src={item.iconSrc} alt={item.title} width={40} height={40} decoding="async" className="w-10 h-10 object-contain shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">{item.title}</h4>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{item.description}</p>
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
      <Card className="p-6 rounded-xl">
        <Skeleton className="h-5 w-36 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-3 rounded-lg border">
              <Skeleton className="w-24 h-14 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3.5 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  if (courses.length === 0) return null

  return (
    <Card className="p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src="/3d-ecom-icons-blue/Course_Book.png" alt="Courses" width={32} height={32} decoding="async" className="w-8 h-8 object-contain" />
          <h3 className="text-base font-semibold text-gray-900">Latest Courses</h3>
        </div>
        <Link href="/mentorship" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors" data-testid="link-view-all-courses">
          View all
        </Link>
      </div>
      <div className="space-y-2.5">
        {courses.map((course) => (
          <Link key={course.id} href={`/mentorship/${course.id}`} className="block group" data-testid={`link-course-${course.id}`}>
            <div className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 transition-colors">
              <div className="relative w-24 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="object-cover w-full h-full" />
                ) : (
                  <div className="flex items-center justify-center h-full"><BookOpen className="h-5 w-5 text-gray-300" /></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">{course.title}</h4>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  {course.lessons_count > 0 && (
                    <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{course.lessons_count} lessons</span>
                  )}
                  {course.duration_minutes && (
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDuration(course.duration_minutes)}</span>
                  )}
                  {course.rating && (
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />{course.rating.toFixed(1)}</span>
                  )}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" />
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
    <Card className="p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src="/3d-ecom-icons-blue/Rocket_Launch.png" alt="Roadmap" width={32} height={32} decoding="async" className="w-8 h-8 object-contain" />
          <h3 className="text-base font-semibold text-gray-900">Roadmap Progress</h3>
        </div>
        <Link href="/my-roadmap" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors" data-testid="link-open-roadmap">
          Open
        </Link>
      </div>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">{progress.completed} of {progress.total} tasks</span>
            <span className="text-sm font-bold text-gray-900">{progress.percent}%</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
        <div className="flex gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-green-600">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            {progress.completed} Done
          </span>
          <span className="flex items-center gap-1.5 text-yellow-600">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            {progress.inProgress} In Progress
          </span>
          <span className="flex items-center gap-1.5 text-gray-400">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
            {progress.total - progress.completed - progress.inProgress} Pending
          </span>
        </div>
      </div>
    </Card>
  )
}

const tabSections = {
  research: {
    label: "Product Research",
    cards: [
      { title: "Trending Products", description: "What products are making money right now?", href: "/product-hunt", iconSrc: "/3d-ecom-icons-blue/Search_Product.png" },
      { title: "Winning Products", description: "Curated list of top-performing products", href: "/winning-products", iconSrc: "/3d-ecom-icons-blue/Trophy_Star.png" },
      { title: "Competitor Stores", description: "Which shops in my category are selling well?", href: "/competitor-stores", iconSrc: "/3d-ecom-icons-blue/Competitor_Search.png" },
    ],
  },
  marketing: {
    label: "Marketing & Ads",
    cards: [
      { title: "Meta Ads Library", description: "Browse winning ad creatives and strategies", href: "/meta-ads", iconSrc: "/3d-ecom-icons-blue/Megaphone_Ads.png" },
      { title: "AI Studio", description: "Create whitelabel images and branded content", href: "/studio/whitelabelling", iconSrc: "/3d-ecom-icons-blue/Paint_Palette.png" },
      { title: "Model Studio", description: "Generate product images with AI models", href: "/studio/model-studio", iconSrc: "/3d-ecom-icons-blue/Paint_Palette.png" },
    ],
  },
  fulfilment: {
    label: "Fulfilment & Tools",
    cards: [
      { title: "Private Suppliers", description: "Find reliable suppliers for your products", href: "/suppliers", iconSrc: "/3d-ecom-icons-blue/Delivery_Truck.png" },
      { title: "Shipping Calculator", description: "Estimate shipping costs for any product", href: "/shipping-calculator", iconSrc: "/3d-ecom-icons-blue/Calculator_Ship.png" },
      { title: "Important Tools", description: "Descriptions, invoices, policies & more", href: "/tools", iconSrc: "/3d-ecom-icons-blue/Toolbox_Wrench.png" },
    ],
  },
}

function QuickAccessSection() {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">How to use USDrop</h3>
      <p className="text-sm text-gray-500 mb-5">Jump into the tools you need to grow your store</p>
      <Tabs defaultValue="research" className="w-full">
        <TabsList className="bg-white border border-gray-200 rounded-xl p-1 h-auto gap-1 mb-5">
          {Object.entries(tabSections).map(([key, section]) => (
            <TabsTrigger
              key={key}
              value={key}
              className="px-5 py-2.5 text-sm font-medium rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:shadow-none text-gray-500"
              data-testid={`tab-${key}`}
            >
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.entries(tabSections).map(([key, section]) => (
          <TabsContent key={key} value={key} className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.cards.map((card) => (
                <Link key={card.href} href={card.href} className="block group" data-testid={`link-quickaccess-${card.title.toLowerCase().replace(/\s/g, '-')}`}>
                  <Card className="p-5 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer bg-gradient-to-br from-blue-50/30 to-white border-blue-100/60">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <h4 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{card.title}</h4>
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed">{card.description}</p>
                      </div>
                      <div className="shrink-0 ml-4">
                        <img src={card.iconSrc} alt={card.title} width={48} height={48} decoding="async" className="w-12 h-12 object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function DashboardContent() {
  return (
    <>
      <div className="flex flex-1 flex-col gap-6 md:gap-8 p-5 md:p-8 lg:p-10 bg-gray-50/50">
        <ProfileSummaryCard />
        <QuickStatsRow />
        <FrameworkCardsGrid />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RecentCoursesCard />
          <RoadmapProgressCard />
        </div>
        <QuickAccessSection />
        <ExploreGrid />
      </div>
    </>
  )
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <>
          <div className="flex flex-1 flex-col gap-6 p-5 md:p-8 lg:p-10 bg-gray-50/50">
            <div className="flex justify-center items-center" style={{ minHeight: "calc(100vh - 300px)" }}>
              <BlueSpinner size="lg" label="Loading dashboard..." />
            </div>
          </div>
        </>
      }
    >
      <DashboardContent />
    </Suspense>
  )
}
