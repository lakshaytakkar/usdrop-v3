import { apiFetch } from "@/lib/supabase";
import { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PageShell,
  PageHeader,
  StatCard,
  StatGrid,
  SectionCard,
  SectionGrid,
} from "@/components/admin-shared";
import {
  Users,
  Flame,
  UserCheck,
  Ticket,
  RefreshCw,
  Clock,
  ArrowRight,
  Eye,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";

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
  hotLeads: number;
  openTickets: number;
  activeClients: number;
  stalledClients: number;
  llcBreakdown: Record<string, number>;
  llcTotal: number;
  recentActivity: Array<{
    id: string;
    user_id: string;
    activity_type: string;
    created_at: string;
    metadata?: Record<string, unknown>;
  }>;
}

interface PipelineStats {
  new_lead: number;
  engaged: number;
  pitched: number;
  converted: number;
  churned: number;
  avgEngagement: number;
  conversionRate: number;
}

interface StalledClient {
  id: string;
  batch_id: string;
  user_id: string;
  current_week: number;
  status: string;
  updated_at: string;
  days_since_update: number;
  user?: {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
    account_type: string;
    phone_number?: string;
  };
  batch?: {
    id: string;
    name: string;
    status: string;
  };
}

const PIPELINE_STAGES = [
  { key: "new_lead", label: "New Lead", color: "#6366f1" },
  { key: "engaged", label: "Engaged", color: "#3b82f6" },
  { key: "pitched", label: "Pitched", color: "#f59e0b" },
  { key: "converted", label: "Converted", color: "#10b981" },
  { key: "churned", label: "Churned", color: "#ef4444" },
];

const LLC_COLORS: Record<string, string> = {
  pending: "#6366f1",
  filing: "#3b82f6",
  ein_processing: "#8b5cf6",
  ein_received: "#f59e0b",
  boi_processing: "#f97316",
  bank_pending: "#ec4899",
  stripe_pending: "#14b8a6",
  complete: "#10b981",
  cancelled: "#ef4444",
};

const LLC_LABELS: Record<string, string> = {
  pending: "Pending",
  filing: "Filing",
  ein_processing: "EIN Processing",
  ein_received: "EIN Received",
  boi_processing: "BOI Processing",
  bank_pending: "Bank Pending",
  stripe_pending: "Stripe Pending",
  complete: "Complete",
  cancelled: "Cancelled",
};

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function formatActivityType(type: string): string {
  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pipelineStats, setPipelineStats] = useState<PipelineStats | null>(null);
  const [stalledClients, setStalledClients] = useState<StalledClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [, navigate] = useLocation();

  const fetchAll = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const [dashRes, stalledRes] = await Promise.all([
        apiFetch("/api/admin/dashboard"),
        apiFetch("/api/admin/clients/stalled"),
      ]);

      if (!dashRes.ok) throw new Error("Failed to fetch dashboard stats");

      const dashData = await dashRes.json();
      setStats(dashData);

      if (stalledRes.ok) {
        const stalledData = await stalledRes.json();
        setStalledClients(stalledData.clients || []);
      }

      if (dashData.totalLeads > 0) {
        const leadRes = await apiFetch("/api/admin/leads");
        if (leadRes.ok) {
          const leadData = await leadRes.json();
          if (leadData.stats) {
            setPipelineStats(leadData.stats);
          }
        }
      }

      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchAll(true);
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  if (error && !stats) {
    return (
      <PageShell>
        <div className="rounded-lg border bg-background p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive" data-testid="text-error">{error}</p>
          </div>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => fetchAll()} data-testid="button-retry">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </PageShell>
    );
  }

  const pipelineChartData = pipelineStats
    ? PIPELINE_STAGES.map((s) => ({
        name: s.label,
        value: pipelineStats[s.key as keyof PipelineStats] as number || 0,
        color: s.color,
      }))
    : [];

  const llcChartData = stats
    ? Object.entries(stats.llcBreakdown).map(([status, count]) => ({
        name: LLC_LABELS[status] || status,
        value: count,
        color: LLC_COLORS[status] || "#94a3b8",
        stage: status,
      }))
    : [];

  return (
    <PageShell>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your platform metrics and activity"
        actions={
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-muted-foreground" data-testid="text-last-updated">
                <Clock className="inline-block mr-1 h-3 w-3" />
                Updated {formatTimeAgo(lastUpdated.toISOString())}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchAll(true)}
              disabled={refreshing}
              data-testid="button-refresh"
            >
              <RefreshCw className={`mr-2 h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
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
            label="Free Users"
            value={stats.usersByAccountType.free.toLocaleString()}
            trend={`${stats.totalExternalUsers.toLocaleString()} total users`}
            icon={Users}
            iconBg="rgba(59, 130, 246, 0.1)"
            iconColor="#3b82f6"
          />
          <StatCard
            label="Hot Leads"
            value={stats.hotLeads.toLocaleString()}
            trend={`${stats.totalLeads.toLocaleString()} total leads`}
            icon={Flame}
            iconBg="rgba(239, 68, 68, 0.1)"
            iconColor="#ef4444"
          />
          <StatCard
            label="Active Clients"
            value={stats.activeClients.toLocaleString()}
            trend={`${stats.stalledClients} stalled`}
            icon={UserCheck}
            iconBg="rgba(16, 185, 129, 0.1)"
            iconColor="#10b981"
          />
          <StatCard
            label="Open Tickets"
            value={stats.openTickets.toLocaleString()}
            trend="open & in progress"
            icon={Ticket}
            iconBg="rgba(245, 158, 11, 0.1)"
            iconColor="#f59e0b"
          />
        </StatGrid>
      ) : null}

      <SectionGrid>
        {loading ? (
          <>
            <div className="rounded-lg border bg-background p-5">
              <Skeleton className="h-5 w-40 mb-4" />
              <Skeleton className="h-64 w-full rounded" />
            </div>
            <div className="rounded-lg border bg-background p-5">
              <Skeleton className="h-5 w-40 mb-4" />
              <Skeleton className="h-64 w-full rounded" />
            </div>
          </>
        ) : (
          <>
            <SectionCard title="Pipeline Funnel">
              {pipelineChartData.length > 0 ? (
                <div className="h-64" data-testid="chart-pipeline-funnel">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pipelineChartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={90}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid hsl(var(--border))",
                          backgroundColor: "hsl(var(--popover))",
                          color: "hsl(var(--popover-foreground))",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {pipelineChartData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <p className="text-sm text-muted-foreground" data-testid="text-no-pipeline-data">No pipeline data available</p>
                </div>
              )}
            </SectionCard>

            <SectionCard title="LLC Status Breakdown">
              {llcChartData.length > 0 ? (
                <div className="h-64 flex items-center" data-testid="chart-llc-breakdown">
                  <div className="w-1/2 h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={llcChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          dataKey="value"
                          onClick={(entry) => {
                            if (entry?.stage) {
                              navigate(`/admin/llc?stage=${entry.stage}`);
                            }
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {llcChartData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid hsl(var(--border))",
                            backgroundColor: "hsl(var(--popover))",
                            color: "hsl(var(--popover-foreground))",
                            fontSize: "12px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-1/2 space-y-1.5 pl-2">
                    {llcChartData.map((item) => (
                      <Link
                        key={item.stage}
                        href={`/admin/llc?stage=${item.stage}`}
                        className="flex items-center justify-between py-1 px-2 rounded-md hover-elevate cursor-pointer"
                        data-testid={`llc-legend-${item.stage}`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-xs">{item.name}</span>
                        </div>
                        <span className="text-xs font-semibold">{item.value}</span>
                      </Link>
                    ))}
                    <div className="flex items-center justify-between pt-1.5 mt-1.5 border-t px-2">
                      <span className="text-xs font-medium text-muted-foreground">Total</span>
                      <span className="text-xs font-bold">{stats?.llcTotal ?? 0}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <p className="text-sm text-muted-foreground" data-testid="text-no-llc-data">No LLC applications yet</p>
                </div>
              )}
            </SectionCard>
          </>
        )}
      </SectionGrid>

      <SectionGrid>
        {loading ? (
          <>
            <div className="rounded-lg border bg-background p-5">
              <Skeleton className="h-5 w-40 mb-4" />
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded mb-2" />
              ))}
            </div>
            <div className="rounded-lg border bg-background p-5">
              <Skeleton className="h-5 w-40 mb-4" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded mb-2" />
              ))}
            </div>
          </>
        ) : (
          <>
            <SectionCard
              title="Stalled Clients"
              actions={
                stalledClients.length > 0 ? (
                  <Badge variant="secondary" className="text-xs">
                    {stalledClients.length}
                  </Badge>
                ) : null
              }
            >
              {stalledClients.length > 0 ? (
                <div className="space-y-0" data-testid="section-stalled-clients">
                  {stalledClients.slice(0, 5).map((client) => (
                    <div
                      key={client.id}
                      className="flex items-center justify-between gap-3 py-2.5"
                      data-testid={`stalled-client-${client.id}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950">
                          <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {client.user?.full_name || client.user?.email || "Unknown"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {client.batch?.name || "No batch"} &middot; Week {client.current_week} &middot;{" "}
                            <span className="text-amber-600 dark:text-amber-400 font-medium">
                              {client.days_since_update}d inactive
                            </span>
                          </p>
                        </div>
                      </div>
                      <Link href={`/admin/users/${client.user_id}`}>
                        <Button variant="ghost" size="sm" data-testid={`button-view-client-${client.id}`}>
                          <Eye className="mr-1.5 h-3.5 w-3.5" />
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                  {stalledClients.length > 5 && (
                    <Link href="/admin/clients" className="block">
                      <Button variant="ghost" size="sm" className="w-full mt-2" data-testid="button-view-all-stalled">
                        View all {stalledClients.length} stalled clients
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <UserCheck className="h-8 w-8 text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground" data-testid="text-no-stalled">All clients are on track</p>
                </div>
              )}
            </SectionCard>

            <SectionCard
              title="Recent Activity"
              actions={
                <span className="text-xs text-muted-foreground">Auto-refreshes</span>
              }
            >
              {stats && stats.recentActivity.length > 0 ? (
                <div className="space-y-0" data-testid="section-activity-feed">
                  {stats.recentActivity.slice(0, 8).map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 py-2.5"
                      data-testid={`activity-item-${activity.id}`}
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted mt-0.5">
                        <Clock className="size-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {formatActivityType(activity.activity_type)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatTimeAgo(activity.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Clock className="h-8 w-8 text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground" data-testid="text-no-activity">No recent activity</p>
                </div>
              )}
            </SectionCard>
          </>
        )}
      </SectionGrid>
    </PageShell>
  );
}
