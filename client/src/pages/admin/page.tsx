import { apiFetch } from '@/lib/supabase'
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Link } from "wouter"
import { AdminPageHeader, AdminStatCards } from "@/components/admin"
import {
  Users,
  Package,
  GraduationCap,
  Store,
  TrendingUp,
  Target,
  Building,
  ShoppingBag,
  ArrowRight,
  Download,
  CreditCard,
  DollarSign,
  UserPlus,
  Settings,
  BarChart3,
  BookOpen,
  Truck,
  Shield,
  Clock,
  Activity,
  UserCheck,
  AlertCircle,
  RefreshCw,
} from "lucide-react"

interface DashboardStats {
  totalExternalUsers: number
  totalProducts: number
  totalCourses: number
  totalCompetitorStores: number
  activeSubscriptionPlans: number
  recentSignups: number
  usersByAccountType: {
    free: number
    pro: number
  }
  totalLeads: number
  totalSuppliers: number
  totalShopifyStores: number
}

interface ActivityItem {
  id: string
  type: "signup" | "plan_change" | "suspension" | "login" | "product_add" | "course_complete"
  message: string
  timestamp: string
  icon: React.ElementType
  iconColor: string
}

function generateRecentActivity(stats: DashboardStats): ActivityItem[] {
  const activities: ActivityItem[] = [
    {
      id: "1",
      type: "signup",
      message: "New user signed up",
      timestamp: "2 minutes ago",
      icon: UserPlus,
      iconColor: "text-emerald-500",
    },
    {
      id: "2",
      type: "plan_change",
      message: "User upgraded to Pro plan",
      timestamp: "15 minutes ago",
      icon: TrendingUp,
      iconColor: "text-blue-500",
    },
    {
      id: "3",
      type: "signup",
      message: "New user signed up",
      timestamp: "32 minutes ago",
      icon: UserPlus,
      iconColor: "text-emerald-500",
    },
    {
      id: "4",
      type: "product_add",
      message: "New product added to catalog",
      timestamp: "1 hour ago",
      icon: Package,
      iconColor: "text-violet-500",
    },
    {
      id: "5",
      type: "plan_change",
      message: "User downgraded to Free plan",
      timestamp: "2 hours ago",
      icon: AlertCircle,
      iconColor: "text-amber-500",
    },
    {
      id: "6",
      type: "signup",
      message: "New user signed up",
      timestamp: "3 hours ago",
      icon: UserPlus,
      iconColor: "text-emerald-500",
    },
    {
      id: "7",
      type: "course_complete",
      message: "User completed a course module",
      timestamp: "4 hours ago",
      icon: GraduationCap,
      iconColor: "text-primary",
    },
    {
      id: "8",
      type: "login",
      message: "Admin login detected",
      timestamp: "5 hours ago",
      icon: Shield,
      iconColor: "text-muted-foreground",
    },
    {
      id: "9",
      type: "signup",
      message: "New user signed up",
      timestamp: "6 hours ago",
      icon: UserPlus,
      iconColor: "text-emerald-500",
    },
    {
      id: "10",
      type: "plan_change",
      message: "User upgraded to Pro plan",
      timestamp: "8 hours ago",
      icon: TrendingUp,
      iconColor: "text-blue-500",
    },
  ]
  return activities
}

const quickActions = [
  {
    label: "Manage Clients",
    description: "View and manage all users",
    href: "/admin/external-users",
    icon: Users,
  },
  {
    label: "Manage Products",
    description: "Add or edit products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Manage Courses",
    description: "Course content & enrollment",
    href: "/admin/courses",
    icon: BookOpen,
  },
  {
    label: "Manage Plans",
    description: "Subscription plans & pricing",
    href: "/admin/plans",
    icon: CreditCard,
  },
  {
    label: "View Leads",
    description: "Sales pipeline & conversion",
    href: "/admin/leads",
    icon: Target,
  },
  {
    label: "Team Members",
    description: "Internal user management",
    href: "/admin/internal-users",
    icon: Shield,
  },
]

function PlatformItem({
  href,
  icon: Icon,
  label,
  count,
}: {
  href: string
  icon: React.ElementType
  label: string
  count: number
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between py-2.5 px-2 rounded-md hover-elevate transition-colors group cursor-pointer"
      data-testid={`platform-item-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{count.toLocaleString()}</span>
        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" style={{ visibility: "hidden" }} />
      </div>
    </Link>
  )
}

function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="space-y-0">
      {activities.map((activity) => {
        const Icon = activity.icon
        return (
          <div
            key={activity.id}
            className="flex items-start gap-3 py-2.5 px-2"
            data-testid={`activity-item-${activity.id}`}
          >
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon className={`w-4 h-4 ${activity.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{activity.message}</p>
              <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function QuickActionsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {quickActions.map((action) => {
        const Icon = action.icon
        return (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center gap-3 p-3 rounded-lg border bg-card hover-elevate transition-colors cursor-pointer"
            data-testid={`quick-action-${action.label.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <div className="w-10 h-10 rounded-lg bg-primary/5 border flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium">{action.label}</p>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchStats() {
    try {
      setLoading(true)
      const res = await apiFetch("/api/admin/dashboard")
      if (!res.ok) throw new Error("Failed to fetch dashboard stats")
      const data = await res.json()
      setStats(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const totalUsers = stats ? stats.usersByAccountType.free + stats.usersByAccountType.pro : 0
  const conversionRate = stats && totalUsers > 0 ? ((stats.usersByAccountType.pro / totalUsers) * 100).toFixed(1) : "0.0"
  const proPercent = stats && totalUsers > 0 ? Math.round((stats.usersByAccountType.pro / totalUsers) * 100) : 0
  const freePercent = totalUsers > 0 ? 100 - proPercent : 0

  const statCards = stats
    ? [
        {
          label: "Total Users",
          value: stats.totalExternalUsers,
          icon: Users,
          badge: `+${stats.recentSignups}`,
          badgeVariant: "success" as const,
          description: "new this week",
          onClick: () => { window.location.href = "/admin/external-users" },
        },
        {
          label: "Active Subscriptions",
          value: stats.usersByAccountType.pro,
          icon: CreditCard,
          badge: `${conversionRate}%`,
          badgeVariant: "info" as const,
          description: "conversion rate",
          onClick: () => { window.location.href = "/admin/plans" },
        },
        {
          label: "Revenue (MRR)",
          value: `$${(stats.usersByAccountType.pro * 49).toLocaleString()}`,
          icon: DollarSign,
          badge: `${stats.usersByAccountType.pro} pro`,
          badgeVariant: "success" as const,
          description: "estimated monthly",
        },
        {
          label: "New Leads",
          value: stats.totalLeads,
          icon: Target,
          description: "in sales pipeline",
          onClick: () => { window.location.href = "/admin/leads" },
        },
      ]
    : []

  const recentActivities = stats ? generateRecentActivity(stats) : []

  if (error) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <AdminPageHeader
          title="Dashboard"
          description="Platform overview and key metrics"
        />
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive" data-testid="text-error">{error}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={fetchStats}
              data-testid="button-retry"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <AdminPageHeader
        title="Dashboard"
        description="Platform overview and key metrics"
        actions={[
          {
            label: "Refresh",
            icon: <RefreshCw className="h-4 w-4" />,
            onClick: fetchStats,
            variant: "outline",
          },
          {
            label: "Export",
            icon: <Download className="h-4 w-4" />,
            onClick: () => {},
            variant: "outline",
          },
        ]}
      />

      <AdminStatCards stats={statCards} loading={loading} columns={4} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {loading ? (
          <>
            <div className="lg:col-span-2 bg-card border rounded-lg">
              <div className="p-4 pb-3 border-b">
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="p-4 space-y-4">
                <Skeleton className="h-3 w-full rounded-full" />
                <div className="flex justify-between gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="bg-card border rounded-lg">
              <div className="p-4 pb-3 border-b">
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="p-4 space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-11 w-full rounded-md" />
                ))}
              </div>
            </div>
          </>
        ) : stats ? (
          <>
            <Card className="lg:col-span-2" data-testid="card-user-breakdown">
              <CardHeader className="pb-3 flex flex-row items-center justify-between gap-2">
                <CardTitle className="text-base font-semibold">User Breakdown</CardTitle>
                <Link href="/admin/external-users">
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" data-testid="link-view-all-users">
                    View All
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
                    {freePercent > 0 && (
                      <div
                        className="bg-gray-400 dark:bg-gray-500 transition-all duration-500"
                        style={{ width: `${freePercent}%` }}
                      />
                    )}
                    {proPercent > 0 && (
                      <div
                        className="bg-primary transition-all duration-500"
                        style={{ width: `${proPercent}%` }}
                      />
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-2.5 w-2.5 rounded-full bg-gray-400 dark:bg-gray-500" />
                      <span className="text-muted-foreground text-sm font-medium">Free</span>
                      <span className="font-semibold text-foreground" data-testid="text-free-count">
                        {stats.usersByAccountType.free.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary" />
                      <span className="text-muted-foreground text-sm font-medium">Pro</span>
                      <span className="font-semibold text-foreground" data-testid="text-pro-count">
                        {stats.usersByAccountType.pro.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground text-sm font-medium">Conversion rate</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs" data-testid="text-conversion-rate">
                          {conversionRate}%
                        </Badge>
                        <span className="text-sm font-semibold text-foreground">Pro</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-platform-summary">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Platform Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <PlatformItem href="/admin/courses" icon={GraduationCap} label="Courses" count={stats.totalCourses} />
                  <PlatformItem href="/admin/competitor-stores" icon={Store} label="Competitor Stores" count={stats.totalCompetitorStores} />
                  <PlatformItem href="/admin/suppliers" icon={Building} label="Suppliers" count={stats.totalSuppliers} />
                  <PlatformItem href="/admin/shopify-stores" icon={ShoppingBag} label="Shopify Stores" count={stats.totalShopifyStores} />
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>

      {!loading && stats && (
        <>
          <Card data-testid="card-recent-activity">
            <CardHeader className="pb-3 flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-base font-semibold">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  Recent Activity
                </div>
              </CardTitle>
              <Badge variant="secondary" className="text-xs" data-testid="text-activity-count">
                Last 10
              </Badge>
            </CardHeader>
            <CardContent>
              <ActivityFeed activities={recentActivities} />
            </CardContent>
          </Card>

          <div>
            <h2 className="text-base font-semibold mb-3" data-testid="text-quick-actions-title">Quick Actions</h2>
            <QuickActionsGrid />
          </div>
        </>
      )}

      {loading && (
        <>
          <Card>
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div>
            <Skeleton className="h-5 w-28 mb-3" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
