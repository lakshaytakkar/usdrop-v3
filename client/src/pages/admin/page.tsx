import { apiFetch } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  PageShell,
  HeroBanner,
  StatCard,
  StatGrid,
  SectionCard,
  SectionGrid,
} from "@/components/admin-shared";
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
  CreditCard,
  DollarSign,
  UserPlus,
  Shield,
  Activity,
  BookOpen,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface DashboardStats {
  totalExternalUsers: number;
  totalProducts: number;
  totalCourses: number;
  totalCompetitorStores: number;
  activeSubscriptionPlans: number;
  recentSignups: number;
  usersByAccountType: {
    free: number;
    pro: number;
  };
  totalLeads: number;
  totalSuppliers: number;
  totalShopifyStores: number;
}

interface ActivityItem {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  icon: React.ElementType;
  iconColor: string;
}

function generateRecentActivity(): ActivityItem[] {
  return [
    { id: "1", type: "signup", message: "New user signed up", timestamp: "2 minutes ago", icon: UserPlus, iconColor: "text-emerald-500" },
    { id: "2", type: "plan_change", message: "User upgraded to Pro plan", timestamp: "15 minutes ago", icon: TrendingUp, iconColor: "text-blue-500" },
    { id: "3", type: "signup", message: "New user signed up", timestamp: "32 minutes ago", icon: UserPlus, iconColor: "text-emerald-500" },
    { id: "4", type: "product_add", message: "New product added to catalog", timestamp: "1 hour ago", icon: Package, iconColor: "text-violet-500" },
    { id: "5", type: "plan_change", message: "User downgraded to Free plan", timestamp: "2 hours ago", icon: AlertCircle, iconColor: "text-amber-500" },
    { id: "6", type: "signup", message: "New user signed up", timestamp: "3 hours ago", icon: UserPlus, iconColor: "text-emerald-500" },
    { id: "7", type: "course_complete", message: "User completed a course module", timestamp: "4 hours ago", icon: GraduationCap, iconColor: "text-primary" },
    { id: "8", type: "login", message: "Admin login detected", timestamp: "5 hours ago", icon: Shield, iconColor: "text-muted-foreground" },
  ];
}

const quickActions = [
  { label: "Manage Clients", description: "View and manage all users", href: "/admin/external-users", icon: Users },
  { label: "Manage Products", description: "Add or edit products", href: "/admin/products", icon: Package },
  { label: "Manage Courses", description: "Course content & enrollment", href: "/admin/courses", icon: BookOpen },
  { label: "Manage Plans", description: "Subscription plans & pricing", href: "/admin/plans", icon: CreditCard },
  { label: "View Leads", description: "Sales pipeline & conversion", href: "/admin/leads", icon: Target },
  { label: "Team Members", description: "Internal user management", href: "/admin/internal-users", icon: Shield },
];

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchStats() {
    try {
      setLoading(true);
      const res = await apiFetch("/api/admin/dashboard");
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      const data = await res.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  const totalUsers = stats ? stats.usersByAccountType.free + stats.usersByAccountType.pro : 0;
  const conversionRate = stats && totalUsers > 0 ? ((stats.usersByAccountType.pro / totalUsers) * 100).toFixed(1) : "0.0";

  if (error) {
    return (
      <PageShell>
        <div className="rounded-lg border bg-background p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive" data-testid="text-error">{error}</p>
          </div>
          <Button variant="outline" size="sm" className="mt-4" onClick={fetchStats} data-testid="button-retry">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <HeroBanner
        eyebrow="Welcome back"
        headline="USDrop Admin"
        tagline="Manage your platform, users, and content from one place."
        color="hsl(223, 83%, 53%)"
        colorDark="hsl(223, 83%, 38%)"
        metrics={
          stats
            ? [
                { label: "Total Users", value: stats.totalExternalUsers.toLocaleString() },
                { label: "Pro Users", value: stats.usersByAccountType.pro.toLocaleString() },
                { label: "Conversion", value: `${conversionRate}%` },
              ]
            : undefined
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" data-testid="stat-grid-skeleton">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-background p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-7 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="size-10 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : stats ? (
        <StatGrid>
          <StatCard
            label="Total Users"
            value={stats.totalExternalUsers.toLocaleString()}
            trend={`+${stats.recentSignups} new this week`}
            icon={Users}
            iconBg="rgba(59, 130, 246, 0.1)"
            iconColor="#3b82f6"
          />
          <StatCard
            label="Active Subscriptions"
            value={stats.usersByAccountType.pro.toLocaleString()}
            trend={`${conversionRate}% conversion rate`}
            icon={CreditCard}
            iconBg="rgba(16, 185, 129, 0.1)"
            iconColor="#10b981"
          />
          <StatCard
            label="Products"
            value={stats.totalProducts.toLocaleString()}
            trend="in catalog"
            icon={Package}
            iconBg="rgba(139, 92, 246, 0.1)"
            iconColor="#8b5cf6"
          />
          <StatCard
            label="Courses"
            value={stats.totalCourses.toLocaleString()}
            trend={`${stats.totalSuppliers} suppliers`}
            icon={GraduationCap}
            iconBg="rgba(245, 158, 11, 0.1)"
            iconColor="#f59e0b"
          />
        </StatGrid>
      ) : null}

      <SectionGrid>
        {loading ? (
          <>
            <div className="rounded-lg border bg-background">
              <div className="flex items-center justify-between border-b px-5 py-3.5">
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="p-5 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="size-8 rounded-lg" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border bg-background">
              <div className="flex items-center justify-between border-b px-5 py-3.5">
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="p-5 space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-11 w-full rounded-md" />
                ))}
              </div>
            </div>
          </>
        ) : stats ? (
          <>
            <SectionCard
              title="Recent Activity"
              actions={
                <div className="flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Latest</span>
                </div>
              }
            >
              <div className="space-y-0" data-testid="section-activity-feed">
                {generateRecentActivity().map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start gap-3 py-2.5" data-testid={`activity-item-${activity.id}`}>
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted mt-0.5">
                        <Icon className={`size-4 ${activity.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            <SectionCard title="Platform Summary">
              <div className="space-y-1" data-testid="section-platform-summary">
                {[
                  { href: "/admin/products", icon: Package, label: "Products", count: stats.totalProducts },
                  { href: "/admin/courses", icon: GraduationCap, label: "Courses", count: stats.totalCourses },
                  { href: "/admin/competitor-stores", icon: Store, label: "Competitor Stores", count: stats.totalCompetitorStores },
                  { href: "/admin/suppliers", icon: Building, label: "Suppliers", count: stats.totalSuppliers },
                  { href: "/admin/shopify-stores", icon: ShoppingBag, label: "Shopify Stores", count: stats.totalShopifyStores },
                  { href: "/admin/leads", icon: Target, label: "Leads", count: stats.totalLeads },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center justify-between py-2.5 px-2 rounded-md hover-elevate transition-colors group cursor-pointer"
                      data-testid={`platform-item-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                          <Icon className="size-4 text-muted-foreground" />
                        </div>
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{item.count.toLocaleString()}</span>
                        <ArrowRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" style={{ visibility: "hidden" }} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </SectionCard>
          </>
        ) : null}
      </SectionGrid>

      {!loading && stats && (
        <SectionCard title="Quick Actions">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" data-testid="section-quick-actions">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-lg border hover-elevate transition-colors cursor-pointer"
                  data-testid={`quick-action-${action.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 border">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </SectionCard>
      )}

      {loading && (
        <div className="rounded-lg border bg-background">
          <div className="flex items-center justify-between border-b px-5 py-3.5">
            <Skeleton className="h-5 w-28" />
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
