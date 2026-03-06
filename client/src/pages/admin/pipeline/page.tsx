import { useState, useEffect, useCallback } from "react"
import { apiFetch } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Users,
  Flame,
  TrendingUp,
  BarChart3,
  LayoutGrid,
  BookOpen,
  Clock,
  RefreshCw,
  Plus,
  Copy,
  Send,
  ChevronDown,
  Loader2,
} from "lucide-react"
import {
  PageShell,
  PageHeader,
  StatCard,
  StatGrid,
  DataTable,
  StatusBadge,
  type Column,
  type RowAction,
} from "@/components/admin-shared"
import { useRouter } from "@/hooks/use-router"
import { cn } from "@/lib/utils"

interface LeadProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  account_type: string | null
  created_at: string | null
  status: string | null
  phone_number?: string | null
}

interface RepProfile {
  id: string
  full_name: string | null
  email: string
  avatar_url: string | null
}

interface PipelineLead {
  user_id: string
  score: number
  engagement_level: string
  free_lessons_completed: number
  total_page_views: number
  last_activity_at: string | null
  auto_stage: string
  manual_stage_override: string | null
  assigned_rep_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
  effective_stage: string
  user: LeadProfile | null
  rep: RepProfile | null
}

interface PipelineStats {
  totalLeads: number
  hotLeads: number
  convertedLeads: number
  avgScore: number
  conversionRate: string
}


const STAGES = [
  { key: "new_lead", label: "New Lead" },
  { key: "engaged", label: "Engaged" },
  { key: "hot_lead", label: "Hot Lead" },
  { key: "call_booked", label: "Call Booked" },
  { key: "payment_sent", label: "Payment Sent" },
  { key: "converted", label: "Converted" },
  { key: "lost", label: "Lost" },
]

const stageColors: Record<string, string> = {
  new_lead: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800",
  engaged: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
  hot: "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800",
  hot_lead: "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800",
  call_booked: "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800",
  contacted: "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800",
  payment_sent: "bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800",
  converted: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
  lost: "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800",
}

const stageHeaderColors: Record<string, string> = {
  new_lead: "text-blue-700 dark:text-blue-300",
  engaged: "text-amber-700 dark:text-amber-300",
  hot: "text-red-700 dark:text-red-300",
  hot_lead: "text-red-700 dark:text-red-300",
  call_booked: "text-purple-700 dark:text-purple-300",
  contacted: "text-purple-700 dark:text-purple-300",
  payment_sent: "text-cyan-700 dark:text-cyan-300",
  converted: "text-emerald-700 dark:text-emerald-300",
  lost: "text-slate-700 dark:text-slate-300",
}

const stageBadgeColors: Record<string, string> = {
  new_lead: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  engaged: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  hot: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  hot_lead: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  call_booked: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  contacted: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  payment_sent: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
  converted: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  lost: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
}

function getInitials(name: string | null) {
  if (!name) return "?"
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

function ScoreBadge({ score }: { score: number }) {
  let variant: "success" | "warning" | "error" | "neutral" = "neutral"
  if (score >= 51) variant = "error"
  else if (score >= 21) variant = "warning"

  const colors = {
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    warning: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    error: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
    neutral: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  }

  return (
    <Badge variant="secondary" className={cn("border-0 text-xs font-semibold px-1.5 py-0", colors[variant])} data-testid="badge-score">
      {score}
    </Badge>
  )
}

export default function AdminPipelinePage() {
  const { showError, showSuccess } = useToast()
  const router = useRouter()
  const [leads, setLeads] = useState<PipelineLead[]>([])
  const [stats, setStats] = useState<PipelineStats>({ totalLeads: 0, hotLeads: 0, convertedLeads: 0, avgScore: 0, conversionRate: "0.0" })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"board" | "hot-leads">("board")
  const [stageFilter, setStageFilter] = useState<string>("all")
  const [repFilter, setRepFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [reps, setReps] = useState<RepProfile[]>([])

  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [paymentTitle, setPaymentTitle] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentDesc, setPaymentDesc] = useState("")
  const [paymentUrl, setPaymentUrl] = useState("")
  const [sendingPayment, setSendingPayment] = useState(false)

  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null)

  const [boardLoadMore, setBoardLoadMore] = useState<Record<string, number>>({})
  const BOARD_PAGE_SIZE = 10

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (stageFilter && stageFilter !== "all") params.set("stage", stageFilter)
      if (repFilter && repFilter !== "all") params.set("rep_id", repFilter)
      const qs = params.toString()

      const [leadsRes, statsRes] = await Promise.all([
        apiFetch(`/api/admin/pipeline${qs ? `?${qs}` : ""}`),
        apiFetch("/api/admin/pipeline/stats"),
      ])

      if (!leadsRes.ok) throw new Error("Failed to fetch pipeline")
      if (!statsRes.ok) throw new Error("Failed to fetch stats")

      const leadsData = await leadsRes.json()
      const statsData = await statsRes.json()

      setLeads(leadsData || [])
      setStats(statsData)

      const repSet = new Map<string, RepProfile>()
      for (const lead of leadsData || []) {
        if (lead.rep) {
          repSet.set(lead.rep.id, lead.rep)
        }
      }
      setReps(Array.from(repSet.values()))
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to load pipeline")
    } finally {
      setLoading(false)
    }
  }, [stageFilter, repFilter, showError])

  useEffect(() => { fetchData() }, [fetchData])

  const openLeadDetail = (userId: string) => {
    router.push(`/admin/pipeline/${userId}`)
  }

  const markAsCalled = async (userId: string) => {
    try {
      const res = await apiFetch(`/api/admin/pipeline/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ stage_override: "call_booked" }),
      })
      if (!res.ok) throw new Error("Failed to mark as called")
      showSuccess("Lead marked as contacted")
      fetchData()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to update lead")
    }
  }

  const markAsLost = async (userId: string) => {
    try {
      const res = await apiFetch(`/api/admin/pipeline/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ stage_override: "lost" }),
      })
      if (!res.ok) throw new Error("Failed to mark as lost")
      showSuccess("Lead marked as lost")
      fetchData()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to update lead")
    }
  }

  const recalculateScore = async (userId: string) => {
    try {
      const res = await apiFetch(`/api/admin/pipeline/${userId}/recalculate`, { method: "POST" })
      if (!res.ok) throw new Error("Failed to recalculate")
      showSuccess("Score recalculated")
      fetchData()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to recalculate score")
    }
  }

  const handleSendPaymentLink = async () => {
    if (!selectedLeadId || !paymentTitle || !paymentAmount) return
    setSendingPayment(true)
    try {
      const res = await apiFetch("/api/admin/payment-links", {
        method: "POST",
        body: JSON.stringify({
          lead_user_id: selectedLeadId,
          title: paymentTitle,
          amount: paymentAmount,
          description: paymentDesc,
          payment_url: paymentUrl,
        }),
      })
      if (!res.ok) throw new Error("Failed to create payment link")
      showSuccess("Payment link created")
      setPaymentDialogOpen(false)
      setPaymentTitle("")
      setPaymentAmount("")
      setPaymentDesc("")
      setPaymentUrl("")
      fetchData()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to create payment link")
    } finally {
      setSendingPayment(false)
    }
  }

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData("text/plain", leadId)
    setDraggedLeadId(leadId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async (e: React.DragEvent, targetStage: string) => {
    e.preventDefault()
    const leadId = e.dataTransfer.getData("text/plain")
    setDraggedLeadId(null)
    if (!leadId) return

    const lead = leads.find(l => l.user_id === leadId)
    if (!lead || lead.effective_stage === targetStage) return

    try {
      const res = await apiFetch(`/api/admin/pipeline/${leadId}`, {
        method: "PATCH",
        body: JSON.stringify({ stage_override: targetStage }),
      })
      if (!res.ok) throw new Error("Failed to move lead")
      showSuccess(`Lead moved to ${STAGES.find(s => s.key === targetStage)?.label || targetStage}`)
      fetchData()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to move lead")
    }
  }

  const filteredLeads = leads.filter((lead) => {
    if (dateFilter && dateFilter !== "all") {
      const createdAt = new Date(lead.created_at)
      const now = new Date()
      if (dateFilter === "7d") {
        if (now.getTime() - createdAt.getTime() > 7 * 24 * 60 * 60 * 1000) return false
      } else if (dateFilter === "30d") {
        if (now.getTime() - createdAt.getTime() > 30 * 24 * 60 * 60 * 1000) return false
      } else if (dateFilter === "90d") {
        if (now.getTime() - createdAt.getTime() > 90 * 24 * 60 * 60 * 1000) return false
      }
    }
    return true
  })

  const normalizeStage = (stage: string) => {
    if (stage === "hot") return "hot_lead"
    if (stage === "contacted") return "call_booked"
    if (stage === "qualified") return "payment_sent"
    return stage
  }

  const leadsByStage = STAGES.reduce<Record<string, PipelineLead[]>>((acc, stage) => {
    acc[stage.key] = filteredLeads.filter((l) => normalizeStage(l.effective_stage) === stage.key)
    return acc
  }, {})

  const hotLeads = filteredLeads.filter(l => l.engagement_level === "hot" || l.effective_stage === "hot" || l.effective_stage === "hot_lead")

  const hotLeadsColumns: Column<PipelineLead & { id: string }>[] = [
    {
      key: "full_name",
      header: "Name",
      sortable: true,
      render: (lead) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarImage src={lead.user?.avatar_url || undefined} />
              <AvatarFallback className="text-xs">{getInitials(lead.user?.full_name || null)}</AvatarFallback>
            </Avatar>
            <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-red-500 animate-pulse" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate" data-testid={`text-name-${lead.user_id}`}>{lead.user?.full_name || "Unknown"}</p>
            <p className="text-xs text-muted-foreground truncate">{lead.user?.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "score",
      header: "Score",
      sortable: true,
      render: (lead) => <ScoreBadge score={lead.score} />,
    },
    {
      key: "effective_stage",
      header: "Stage",
      render: (lead) => <StatusBadge status={STAGES.find(s => s.key === normalizeStage(lead.effective_stage))?.label || lead.effective_stage} />,
    },
    {
      key: "free_lessons_completed",
      header: "Lessons",
      sortable: true,
      render: (lead) => (
        <span className="text-sm text-muted-foreground" data-testid={`text-lessons-${lead.user_id}`}>
          {lead.free_lessons_completed}
        </span>
      ),
    },
    {
      key: "last_activity_at",
      header: "Last Activity",
      sortable: true,
      render: (lead) => (
        <span className="text-sm text-muted-foreground" data-testid={`text-activity-${lead.user_id}`}>
          {lead.last_activity_at ? formatDistanceToNow(new Date(lead.last_activity_at), { addSuffix: true }) : "\u2014"}
        </span>
      ),
    },
    {
      key: "assigned_rep_id",
      header: "Rep",
      render: (lead) => lead.rep ? (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={lead.rep.avatar_url || undefined} />
            <AvatarFallback className="text-[10px]">{getInitials(lead.rep.full_name)}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground truncate">{lead.rep.full_name}</span>
        </div>
      ) : <span className="text-xs text-muted-foreground">{"\u2014"}</span>,
    },
  ]

  const hotLeadsActions: RowAction<PipelineLead & { id: string }>[] = [
    { label: "View Details", onClick: (lead) => openLeadDetail(lead.user_id) },
    { label: "Send Payment Link", onClick: (lead) => { setSelectedLeadId(lead.user_id); setPaymentDialogOpen(true) } },
    { label: "Mark Called", onClick: (lead) => markAsCalled(lead.user_id) },
    { label: "View Profile", onClick: (lead) => router.push(`/admin/users/${lead.user_id}`) },
    { label: "Mark Lost", onClick: (lead) => markAsLost(lead.user_id), variant: "destructive", separator: true },
  ]

  const stageCounts = STAGES.map(stage => ({
    ...stage,
    count: filteredLeads.filter(l => normalizeStage(l.effective_stage) === stage.key).length,
  }))

  return (
    <PageShell>
      <PageHeader
        title="Sales Pipeline"
        subtitle="Track and manage leads through the sales funnel"
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-auto min-w-[110px] text-sm" data-testid="filter-date">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>

            {reps.length > 0 && (
              <Select value={repFilter} onValueChange={setRepFilter}>
                <SelectTrigger className="w-auto min-w-[130px] text-sm" data-testid="filter-rep">
                  <SelectValue placeholder="All Reps" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reps</SelectItem>
                  {reps.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.full_name || r.email}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button size="sm" variant="outline" onClick={fetchData} data-testid="button-refresh">
              <RefreshCw className="size-4 mr-1.5" />
              Refresh
            </Button>

            <Button size="sm" onClick={() => router.push("/admin/users")} data-testid="button-add-lead">
              <Plus className="size-4 mr-1.5" />
              Add Lead
            </Button>
          </div>
        }
      />

      <div className="flex items-center gap-2 flex-wrap" data-testid="stage-badges">
        {stageCounts.map((stage) => (
          <Badge
            key={stage.key}
            variant="secondary"
            className={cn(
              "border-0 text-xs font-medium px-2.5 py-1 cursor-pointer",
              stageFilter === stage.key ? stageBadgeColors[stage.key] : "bg-muted text-muted-foreground"
            )}
            onClick={() => setStageFilter(stageFilter === stage.key ? "all" : stage.key)}
            data-testid={`badge-stage-${stage.key}`}
          >
            {stage.label}: {stage.count}
          </Badge>
        ))}
      </div>

      <StatGrid>
        <StatCard label="Total Leads" value={stats.totalLeads} icon={Users} />
        <StatCard
          label="Hot Leads"
          value={stats.hotLeads}
          icon={Flame}
          iconBg="rgba(239, 68, 68, 0.1)"
          iconColor="#ef4444"
        />
        <StatCard
          label="Conversion Rate"
          value={`${stats.conversionRate}%`}
          icon={TrendingUp}
          iconBg="rgba(16, 185, 129, 0.1)"
          iconColor="#10b981"
        />
        <StatCard
          label="Avg Score"
          value={stats.avgScore}
          icon={BarChart3}
          iconBg="rgba(168, 85, 247, 0.1)"
          iconColor="#a855f7"
        />
      </StatGrid>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "board" | "hot-leads")}>
        <TabsList data-testid="pipeline-tabs">
          <TabsTrigger value="board" data-testid="tab-board">
            <LayoutGrid className="size-4 mr-1.5" />
            Kanban Board
          </TabsTrigger>
          <TabsTrigger value="hot-leads" data-testid="tab-hot-leads">
            <Flame className="size-4 mr-1.5" />
            Hot Leads ({hotLeads.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="mt-4">
          <div className="flex gap-3 overflow-x-auto pb-4" data-testid="pipeline-board">
            {STAGES.map((stage) => {
              const stageLeads = leadsByStage[stage.key] || []
              const visibleCount = boardLoadMore[stage.key] || BOARD_PAGE_SIZE
              const visibleLeads = stageLeads.slice(0, visibleCount)
              const hasMore = stageLeads.length > visibleCount

              return (
                <div
                  key={stage.key}
                  className={cn(
                    "flex flex-col min-w-[260px] w-[260px] rounded-xl border transition-colors",
                    stageColors[stage.key],
                    draggedLeadId && "border-dashed"
                  )}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage.key)}
                  data-testid={`column-${stage.key}`}
                >
                  <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-b border-inherit">
                    <h3 className={cn("text-xs font-semibold uppercase tracking-wider", stageHeaderColors[stage.key])} data-testid={`text-column-title-${stage.key}`}>
                      {stage.label}
                    </h3>
                    <Badge variant="secondary" className="border-0 text-xs font-semibold px-1.5 py-0" data-testid={`badge-count-${stage.key}`}>
                      {stageLeads.length}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-2 p-2 overflow-y-auto max-h-[calc(100vh-420px)]">
                    {loading ? (
                      Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="h-24 rounded-lg bg-background/50 animate-pulse" />
                      ))
                    ) : visibleLeads.length === 0 && stageLeads.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-6">No leads</p>
                    ) : (
                      <>
                        {visibleLeads.map((lead) => {
                          const isHot = lead.engagement_level === "hot" || lead.effective_stage === "hot" || lead.effective_stage === "hot_lead"
                          return (
                            <div
                              key={lead.user_id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, lead.user_id)}
                              className={cn(
                                "rounded-lg border bg-card p-3 cursor-pointer hover-elevate transition-all",
                                draggedLeadId === lead.user_id && "opacity-50",
                                isHot && "ring-2 ring-red-400/50 dark:ring-red-500/40"
                              )}
                              onClick={() => openLeadDetail(lead.user_id)}
                              data-testid={`card-lead-${lead.user_id}`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="relative shrink-0">
                                    <Avatar className="h-7 w-7">
                                      <AvatarImage src={lead.user?.avatar_url || undefined} />
                                      <AvatarFallback className="text-[10px]">{getInitials(lead.user?.full_name || null)}</AvatarFallback>
                                    </Avatar>
                                    {isHot && (
                                      <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">{lead.user?.full_name || "Unknown"}</p>
                                    <p className="text-[11px] text-muted-foreground truncate">{lead.user?.email}</p>
                                  </div>
                                </div>
                                <ScoreBadge score={lead.score} />
                              </div>
                              <div className="flex items-center justify-between gap-2 mt-2.5">
                                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <BookOpen className="size-3" />
                                    {lead.free_lessons_completed}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="size-3" />
                                    {lead.last_activity_at
                                      ? formatDistanceToNow(new Date(lead.last_activity_at), { addSuffix: true })
                                      : "Never"}
                                  </span>
                                </div>
                                {lead.rep && (
                                  <Avatar className="h-5 w-5">
                                    <AvatarImage src={lead.rep.avatar_url || undefined} />
                                    <AvatarFallback className="text-[8px]">{getInitials(lead.rep.full_name)}</AvatarFallback>
                                  </Avatar>
                                )}
                              </div>
                            </div>
                          )
                        })}
                        {hasMore && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="w-full text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              setBoardLoadMore(prev => ({
                                ...prev,
                                [stage.key]: (prev[stage.key] || BOARD_PAGE_SIZE) + BOARD_PAGE_SIZE,
                              }))
                            }}
                            data-testid={`button-load-more-${stage.key}`}
                          >
                            <ChevronDown className="size-3 mr-1" />
                            Load More ({stageLeads.length - visibleCount} remaining)
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="hot-leads" className="mt-4">
          <DataTable
            data={hotLeads.map((l) => ({ ...l, id: l.user_id }))}
            columns={hotLeadsColumns}
            rowActions={hotLeadsActions}
            searchPlaceholder="Search hot leads..."
            searchKey="full_name"
            onRowClick={(lead) => openLeadDetail(lead.user_id)}
            isLoading={loading}
            emptyTitle="No hot leads"
            emptyDescription="Hot leads will appear when users reach a high engagement score."
          />
        </TabsContent>
      </Tabs>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Send Payment Link</DialogTitle>
            <DialogDescription>Create a payment link for this lead</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div>
              <Label className="text-sm">Title</Label>
              <Input
                value={paymentTitle}
                onChange={(e) => setPaymentTitle(e.target.value)}
                placeholder="e.g. Premium Plan - Monthly"
                className="mt-1"
                data-testid="input-payment-title"
              />
            </div>
            <div>
              <Label className="text-sm">Amount (USD)</Label>
              <Input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="0.00"
                className="mt-1"
                data-testid="input-payment-amount"
              />
            </div>
            <div>
              <Label className="text-sm">Payment URL</Label>
              <Input
                value={paymentUrl}
                onChange={(e) => setPaymentUrl(e.target.value)}
                placeholder="https://..."
                className="mt-1"
                data-testid="input-payment-url"
              />
            </div>
            <div>
              <Label className="text-sm">Description (optional)</Label>
              <Textarea
                value={paymentDesc}
                onChange={(e) => setPaymentDesc(e.target.value)}
                placeholder="Additional details..."
                className="mt-1 resize-none"
                rows={2}
                data-testid="input-payment-description"
              />
            </div>
            {paymentTitle && paymentAmount && (
              <div className="rounded-md border bg-muted/30 p-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">WhatsApp Message Preview:</p>
                <p className="text-xs text-foreground">
                  Hi! Here is your payment link for "{paymentTitle}" (${paymentAmount}): {paymentUrl || "[link]"}
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="mt-2 text-xs"
                  onClick={() => {
                    const msg = `Hi! Here is your payment link for "${paymentTitle}" ($${paymentAmount}): ${paymentUrl || "[link]"}`
                    navigator.clipboard.writeText(msg)
                    showSuccess("Message copied!")
                  }}
                  data-testid="button-copy-payment-message"
                >
                  <Copy className="size-3 mr-1" />
                  Copy Message
                </Button>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPaymentDialogOpen(false)}
              data-testid="button-cancel-payment"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSendPaymentLink}
              disabled={sendingPayment || !paymentTitle || !paymentAmount}
              data-testid="button-submit-payment"
            >
              {sendingPayment ? <Loader2 className="size-4 mr-1.5 animate-spin" /> : <Send className="size-3 mr-1.5" />}
              Create Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  )
}
