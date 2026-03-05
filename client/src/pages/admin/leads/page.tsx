import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "@/hooks/use-router"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Target, TrendingUp, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import {
  PageShell,
  PageHeader,
  StatCard,
  StatGrid,
  DataTable,
  StatusBadge,
  EmptyState,
  type Column,
  type RowAction,
} from "@/components/admin-shared"

interface Lead {
  id: string
  user_id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  stage: string
  source: string
  priority: string
  engagement_score: number
  signup_date: string
  last_active: string
}

interface LeadStats {
  total: number
  conversionRate: number
  avgEngagement: number
}

function getInitials(name: string | null) {
  if (!name) return "?"
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

export default function AdminLeadsPage() {
  const router = useRouter()
  const { showError } = useToast()
  const [leads, setLeads] = useState<Lead[]>([])
  const [stats, setStats] = useState<LeadStats>({ total: 0, conversionRate: 0, avgEngagement: 0 })
  const [loading, setLoading] = useState(true)

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiFetch("/api/admin/leads")
      if (!response.ok) throw new Error("Failed to fetch leads")
      const data = await response.json()
      setLeads(data.leads || [])
      setStats(data.stats || { total: 0, conversionRate: 0, avgEngagement: 0 })
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to load leads")
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  const newThisWeek = leads.filter(l => {
    const d = new Date(l.signup_date)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    return d >= weekAgo
  }).length

  const columns: Column<Lead>[] = [
    {
      key: "full_name",
      header: "Name",
      sortable: true,
      render: (lead) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={lead.avatar_url || undefined} alt={lead.full_name || ""} />
            <AvatarFallback className="text-xs">{getInitials(lead.full_name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate" data-testid={`text-name-${lead.user_id}`}>{lead.full_name || "Unknown"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (lead) => <span className="text-sm text-muted-foreground" data-testid={`text-email-${lead.user_id}`}>{lead.email}</span>,
    },
    {
      key: "stage",
      header: "Status",
      render: (lead) => <StatusBadge status={lead.stage} />,
    },
    {
      key: "signup_date",
      header: "Created",
      sortable: true,
      render: (lead) => (
        <span className="text-sm text-muted-foreground" data-testid={`text-signup-${lead.user_id}`}>
          {lead.signup_date ? format(new Date(lead.signup_date), "MMM d, yyyy") : "\u2014"}
        </span>
      ),
    },
  ]

  const rowActions: RowAction<Lead>[] = [
    { label: "View Details", onClick: (lead) => router.push(`/admin/leads/${lead.user_id}`) },
    { label: "Delete", onClick: () => {}, variant: "destructive", separator: true },
  ]

  return (
    <PageShell>
      <PageHeader title="Leads & Sales" subtitle="Track client journey from signup to conversion" />

      <StatGrid>
        <StatCard label="Total Leads" value={stats.total} icon={Users} />
        <StatCard label="New This Week" value={newThisWeek} icon={Sparkles} />
        <StatCard label="Conversion Rate" value={`${stats.conversionRate}%`} icon={Target} />
        <StatCard label="Avg Engagement" value={`${stats.avgEngagement}%`} icon={TrendingUp} />
      </StatGrid>

      {!loading && leads.length === 0 ? (
        <EmptyState
          title="No leads found"
          description="Leads will appear here as users sign up."
        />
      ) : (
        <DataTable
          data={leads.map(l => ({ ...l, id: l.user_id }))}
          columns={columns}
          rowActions={rowActions}
          searchPlaceholder="Search by name or email..."
          onRowClick={(lead) => router.push(`/admin/leads/${lead.user_id}`)}
          isLoading={loading}
          emptyTitle="No leads match your filters"
          emptyDescription="Try adjusting your search."
        />
      )}
    </PageShell>
  )
}
