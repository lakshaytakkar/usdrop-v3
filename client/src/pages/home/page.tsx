

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
  Mail,
  Phone,
  Globe,
  Building2,
  BookOpen,
  Clock,
  Star,
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
    <Card className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white overflow-hidden border-0 rounded-2xl" data-testid="card-profile-summary">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold shrink-0" data-testid="img-avatar">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-0.5">
            <h2 className="text-lg font-bold truncate" data-testid="text-username">{displayName}</h2>
            <Badge className={cn("text-[10px] px-2 py-0 border-0 shrink-0", isPro ? "bg-amber-500 text-white" : "bg-white/20 text-white/80")} data-testid="status-plan">
              {plan || "Free"}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/60">
            {infoItems.map((item, i) => (
              <span key={i} className="flex items-center gap-1">
                <item.icon className="h-3 w-3" />
                <span className="truncate max-w-[180px]">{item.value}</span>
              </span>
            ))}
          </div>
          {details?.batch_id && (
            <span className="text-[10px] text-white/40 mt-1 block">Batch: {details.batch_id}</span>
          )}
        </div>
        <Link href="/my-profile" className="shrink-0 text-white/40 hover:text-white transition-colors" data-testid="link-profile">
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>
    </Card>
  )
}

const statItems3D = [
  { label: "Products Saved", key: "products", iconSrc: "/3d-ecom-icons-blue/My_Products.png", link: "/my-products" },
  { label: "Connected Stores", key: "stores", iconSrc: "/3d-ecom-icons-blue/My_Store.png", link: "/my-store" },
  { label: "Courses", key: "courses", iconSrc: "/3d-ecom-icons-blue/Course_Book.png", link: "/mentorship" },
  { label: "Roadmap", key: "roadmap", iconSrc: "/3d-ecom-icons-blue/Rocket_Launch.png", link: "/my-roadmap" },
  { label: "Day Streak", key: "streak", iconSrc: "/3d-ecom-icons-blue/Trophy_Star.png", link: "#" },
]

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

  const getStatValue = (key: string) => {
    switch (key) {
      case "products": return stats?.products?.inPicklist || 0
      case "stores": return stats?.stores?.connected || 0
      case "courses": return courseCount
      case "roadmap": return `${roadmapProgress.completed}/${roadmapProgress.total}`
      case "streak": return stats?.activity?.streakDays || 0
      default: return 0
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-4 rounded-xl">
            <Skeleton className="h-8 w-8 rounded-lg mb-2" />
            <Skeleton className="h-3.5 w-16 mb-1.5" />
            <Skeleton className="h-6 w-10" />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {statItems3D.map((item, i) => (
        <Link key={i} href={item.link} className="block" data-testid={`link-stat-${item.label.toLowerCase().replace(/\s/g, '-')}`}>
          <Card className="p-4 hover:border-gray-200 transition-all cursor-pointer group rounded-xl hover:shadow-sm border-gray-100">
            <img src={item.iconSrc} alt={item.label} width={32} height={32} decoding="async" className="w-8 h-8 object-contain mb-2" />
            <p className="text-xs font-medium text-gray-400 mb-0.5">{item.label}</p>
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-gray-900" data-testid={`text-stat-${item.label.toLowerCase().replace(/\s/g, '-')}`}>{getStatValue(item.key)}</p>
              {item.link !== "#" && <ChevronRight className="h-3.5 w-3.5 text-gray-200 group-hover:text-gray-400 transition-colors" />}
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
    description: "Your saved and bookmarked products",
    href: "/my-products",
    iconSrc: "/3d-ecom-icons-blue/My_Products.png",
  },
  {
    title: "My Store",
    description: "Manage your connected Shopify stores",
    href: "/my-store",
    iconSrc: "/3d-ecom-icons-blue/My_Store.png",
    isPro: true,
  },
  {
    title: "My Roadmap",
    description: "Track your dropshipping journey",
    href: "/my-roadmap",
    iconSrc: "/3d-ecom-icons-blue/Rocket_Launch.png",
  },
  {
    title: "My Profile",
    description: "Business details and personal info",
    href: "/my-profile",
    iconSrc: "/3d-ecom-icons-blue/Shopping_Cart.png",
  },
  {
    title: "My Credentials",
    description: "Securely stored logins and API keys",
    href: "/my-credentials",
    iconSrc: "/3d-ecom-icons-blue/Toolbox_Wrench.png",
  },
]

function FrameworkCardsGrid() {
  return (
    <div>
      <h3 className="text-base font-bold text-gray-900 mb-3">Your Framework</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {frameworkCards.map((card) => (
          <Link key={card.href} href={card.href} className="block group" data-testid={`link-framework-${card.title.toLowerCase().replace(/\s/g, '-')}`}>
            <Card className="p-4 h-full hover:border-gray-200 transition-all cursor-pointer rounded-xl hover:shadow-sm border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{card.title}</h4>
                    <ChevronRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                    {card.isPro && (
                      <Badge className="text-[9px] px-1.5 py-0 h-3.5 bg-amber-500 text-white border-0 leading-none">PRO</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{card.description}</p>
                </div>
                <img src={card.iconSrc} alt={card.title} width={44} height={44} decoding="async" className="w-11 h-11 object-contain shrink-0 ml-3" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

const exploreLinks = [
  { title: "Product Hunt", description: "Discover trending products", href: "/product-hunt", iconSrc: "/3d-ecom-icons-blue/Search_Product.png" },
  { title: "Winning Products", description: "Curated top sellers", href: "/winning-products", iconSrc: "/3d-ecom-icons-blue/Trophy_Star.png" },
  { title: "Mentorship", description: "Courses & learning", href: "/mentorship", iconSrc: "/3d-ecom-icons-blue/Graduation_Book.png" },
  { title: "Meta Ads", description: "Ad creatives library", href: "/meta-ads", iconSrc: "/3d-ecom-icons-blue/Megaphone_Ads.png" },
  { title: "Competitor Stores", description: "Analyze competitors", href: "/competitor-stores", iconSrc: "/3d-ecom-icons-blue/Competitor_Search.png" },
  { title: "Suppliers", description: "Private supplier network", href: "/suppliers", iconSrc: "/3d-ecom-icons-blue/Delivery_Truck.png" },
  { title: "Studio", description: "Whitelabelling & models", href: "/studio/whitelabelling", iconSrc: "/3d-ecom-icons-blue/Paint_Palette.png" },
  { title: "Tools", description: "Descriptions, invoices & more", href: "/tools", iconSrc: "/3d-ecom-icons-blue/Toolbox_Wrench.png" },
  { title: "Shipping Calculator", description: "Estimate shipping costs", href: "/shipping-calculator", iconSrc: "/3d-ecom-icons-blue/Calculator_Ship.png" },
  { title: "Blogs", description: "Articles & intelligence", href: "/blogs", iconSrc: "/3d-ecom-icons-blue/Open_Board.png" },
]

function ExploreGrid() {
  return (
    <div>
      <h3 className="text-base font-bold text-gray-900 mb-3">Explore & Tools</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {exploreLinks.map((item) => (
          <Link key={item.href} href={item.href} className="block group" data-testid={`link-explore-${item.title.toLowerCase().replace(/\s/g, '-')}`}>
            <Card className="p-3 hover:border-gray-200 transition-all cursor-pointer rounded-xl hover:shadow-sm border-gray-100">
              <div className="flex items-center gap-2.5">
                <img src={item.iconSrc} alt={item.title} width={34} height={34} decoding="async" className="w-[34px] h-[34px] object-contain shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-[13px] font-semibold text-gray-900 truncate">{item.title}</h4>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">{item.description}</p>
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
      <Card className="p-5 rounded-xl border-gray-100">
        <Skeleton className="h-4 w-28 mb-3" />
        <div className="space-y-2.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3 p-2.5 rounded-lg border border-gray-50">
              <Skeleton className="w-20 h-12 rounded-lg flex-shrink-0" />
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
    <Card className="p-5 rounded-xl border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <img src="/3d-ecom-icons-blue/Course_Book.png" alt="Courses" width={28} height={28} decoding="async" className="w-7 h-7 object-contain" />
          <h3 className="text-sm font-bold text-gray-900">Latest Courses</h3>
        </div>
        <Link href="/mentorship" className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors" data-testid="link-view-all-courses">
          View all
        </Link>
      </div>
      <div className="space-y-2">
        {courses.map((course) => (
          <Link key={course.id} href={`/mentorship/${course.id}`} className="block group" data-testid={`link-course-${course.id}`}>
            <div className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-50 bg-white hover:bg-gray-50/50 transition-colors">
              <div className="relative w-20 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="object-cover w-full h-full" />
                ) : (
                  <div className="flex items-center justify-center h-full"><BookOpen className="h-4 w-4 text-gray-300" /></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[13px] font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{course.title}</h4>
                <div className="flex items-center gap-2.5 text-[11px] text-gray-400 mt-0.5">
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
              <ChevronRight className="h-3.5 w-3.5 text-gray-200 group-hover:text-gray-400 shrink-0 transition-colors" />
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
    <Card className="p-5 rounded-xl border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <img src="/3d-ecom-icons-blue/Rocket_Launch.png" alt="Roadmap" width={28} height={28} decoding="async" className="w-7 h-7 object-contain" />
          <h3 className="text-sm font-bold text-gray-900">Roadmap Progress</h3>
        </div>
        <Link href="/my-roadmap" className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors" data-testid="link-open-roadmap">
          Open
        </Link>
      </div>
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-400">{progress.completed} of {progress.total} tasks</span>
            <span className="text-xs font-bold text-gray-900">{progress.percent}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
        <div className="flex gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-green-600">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            {progress.completed} Done
          </span>
          <span className="flex items-center gap-1 text-yellow-600">
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            {progress.inProgress} In Progress
          </span>
          <span className="flex items-center gap-1 text-gray-400">
            <span className="w-2 h-2 rounded-full bg-gray-200" />
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
      <h3 className="text-base font-bold text-gray-900 mb-0.5">How to use USDrop</h3>
      <p className="text-xs text-gray-400 mb-4">Jump into the tools you need to grow your store</p>
      <Tabs defaultValue="research" className="w-full">
        <TabsList className="bg-gray-50 border border-gray-100 rounded-lg p-0.5 h-auto gap-0.5 mb-4">
          {Object.entries(tabSections).map(([key, section]) => (
            <TabsTrigger
              key={key}
              value={key}
              className="px-4 py-2 text-[13px] font-semibold rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-gray-400"
              data-testid={`tab-${key}`}
            >
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.entries(tabSections).map(([key, section]) => (
          <TabsContent key={key} value={key} className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {section.cards.map((card) => (
                <Link key={card.href} href={card.href} className="block group" data-testid={`link-quickaccess-${card.title.toLowerCase().replace(/\s/g, '-')}`}>
                  <Card className="p-4 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer bg-gradient-to-br from-blue-50/30 to-white border-blue-100/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{card.title}</h4>
                          <ChevronRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">{card.description}</p>
                      </div>
                      <div className="shrink-0 ml-3">
                        <img src={card.iconSrc} alt={card.title} width={40} height={40} decoding="async" className="w-10 h-10 object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
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
      <div className="flex flex-1 flex-col gap-5 p-4 md:p-6 lg:p-8 bg-gray-50/30">
        <ProfileSummaryCard />
        <QuickStatsRow />
        <FrameworkCardsGrid />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
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
          <div className="flex flex-1 flex-col gap-5 p-4 md:p-6 lg:p-8 bg-gray-50/30">
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
