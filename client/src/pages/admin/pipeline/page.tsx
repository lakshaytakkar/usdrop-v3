import { useState, useEffect, useCallback, useRef } from "react"
import { apiFetch } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { format, formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
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
  Table2,
  BookOpen,
  Clock,
  RefreshCw,
  CreditCard,
  Plus,
  Phone,
  PhoneOff,
  UserX,
  ExternalLink,
  Copy,
  Send,
  MessageSquare,
  ChevronDown,
  DollarSign,
  Activity,
  FileText,
  GripVertical,
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

interface DrawerData {
  profile: {
    id: string
    full_name: string | null
    email: string
    avatar_url: string | null
    account_type: string | null
    phone_number: string | null
    onboarding_completed: boolean | null
    onboarding_progress: any
    created_at: string | null
  }
  lead_score: {
    score: number
    engagement_level: string
    auto_stage: string
    manual_stage_override: string | null
    effective_stage: string
    assigned_rep: { id: string; full_name: string | null; email: string } | null
    notes: string | null
    last_activity_at: string | null
  } | null
  activity_summary: {
    total_activities: number
    last_activity_at: string | null
    page_views: number
    lessons_completed: number
  }
  recent_activity: { id: string; activity_type: string; description: string; metadata: any; created_at: string }[]
  payment_links: { id: string; title: string; amount: number; currency: string; status: string; payment_url: string; paid_at: string | null; created_at: string; creator_name: string | null }[]
  notes: { id: string; note: string; admin_name: string; created_at: string }[]
}

const STAGES = [
  { key: "new_lead", label: "New Lead" },
  { key: "engaged", label: "Engaged" },
  { key: "hot", label: "Hot" },
  { key: "contacted", label: "Contacted" },
  { key: "qualified", label: "Qualified" },
  { key: "converted", label: "Converted" },
  { key: "lost", label: "Lost" },
]

const stageColors: Record<string, string> = {
  new_lead: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800",
  engaged: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
  hot: "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800",
  contacted: "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800",
  qualified: "bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800",
  converted: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
  lost: "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800",
}

const stageHeaderColors: Record<string, string> = {
  new_lead: "text-blue-700 dark:text-blue-300",
  engaged: "text-amber-700 dark:text-amber-300",
  hot: "text-red-700 dark:text-red-300",
  contacted: "text-purple-700 dark:text-purple-300",
  qualified: "text-cyan-700 dark:text-cyan-300",
  converted: "text-emerald-700 dark:text-emerald-300",
  lost: "text-slate-700 dark:text-slate-300",
}

const stageBadgeColors: Record<string, string> = {
  new_lead: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  engaged: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  hot: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  contacted: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  qualified: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
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

  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const [drawerData, setDrawerData] = useState<DrawerData | null>(null)
  const [drawerLoading, setDrawerLoading] = useState(false)
  const [editStage, setEditStage] = useState("")
  const [editNotes, setEditNotes] = useState("")
  const [saving, setSaving] = useState(false)

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

  const openDrawer = async (userId: string) => {
    setSelectedLeadId(userId)
    setDetailOpen(true)
    setDrawerLoading(true)
    try {
      const res = await apiFetch(`/api/admin/pipeline/${userId}/drawer`)
      if (!res.ok) throw new Error("Failed to load lead details")
      const data = await res.json()
      setDrawerData(data)
      setEditStage(data.lead_score?.effective_stage || "new_lead")
      setEditNotes(data.lead_score?.notes || "")
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to load lead details")
    } finally {
      setDrawerLoading(false)
    }
  }

  const saveLeadChanges = async () => {
    if (!selectedLeadId) return
    setSaving(true)
    try {
      const res = await apiFetch(`/api/admin/pipeline/${selectedLeadId}`, {
        method: "PATCH",
        body: JSON.stringify({
          stage_override: editStage,
          notes: editNotes,
        }),
      })
      if (!res.ok) throw new Error("Failed to update lead")
      showSuccess("Lead updated successfully")
      fetchData()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to update lead")
    } finally {
      setSaving(false)
    }
  }

  const markAsCalled = async (userId: string) => {
    try {
      const res = await apiFetch(`/api/admin/pipeline/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ stage_override: "contacted" }),
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
      if (selectedLeadId) openDrawer(selectedLeadId)
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to create payment link")
    } finally {
      setSendingPayment(false)
    }
  }

  const copyWhatsAppMessage = (lead: DrawerData) => {
    const name = lead.profile.full_name || "there"
    const phone = lead.profile.phone_number || ""
    const latestLink = lead.payment_links.length > 0 ? lead.payment_links[0] : null
    let message = `Hi ${name}! `
    if (latestLink) {
      message += `Here is your payment link for "${latestLink.title}" ($${latestLink.amount}): ${latestLink.payment_url || "[link]"}`
    } else {
      message += `I wanted to follow up on your interest in our services. Would you like to schedule a quick call?`
    }
    navigator.clipboard.writeText(message)
    showSuccess("WhatsApp message copied to clipboard")
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

  const leadsByStage = STAGES.reduce<Record<string, PipelineLead[]>>((acc, stage) => {
    acc[stage.key] = filteredLeads.filter((l) => l.effective_stage === stage.key)
    return acc
  }, {})

  const hotLeads = filteredLeads.filter(l => l.engagement_level === "hot" || l.effective_stage === "hot")

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
      render: (lead) => <StatusBadge status={STAGES.find(s => s.key === lead.effective_stage)?.label || lead.effective_stage} />,
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
    { label: "View Details", onClick: (lead) => openDrawer(lead.user_id) },
    { label: "Send Payment Link", onClick: (lead) => { setSelectedLeadId(lead.user_id); setPaymentDialogOpen(true) } },
    { label: "Mark Called", onClick: (lead) => markAsCalled(lead.user_id) },
    { label: "View Profile", onClick: (lead) => router.push(`/admin/users/${lead.user_id}`) },
    { label: "Mark Lost", onClick: (lead) => markAsLost(lead.user_id), variant: "destructive", separator: true },
  ]

  const stageCounts = STAGES.map(stage => ({
    ...stage,
    count: filteredLeads.filter(l => l.effective_stage === stage.key).length,
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
                          const isHot = lead.engagement_level === "hot" || lead.effective_stage === "hot"
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
                              onClick={() => openDrawer(lead.user_id)}
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
            onRowClick={(lead) => openDrawer(lead.user_id)}
            isLoading={loading}
            emptyTitle="No hot leads"
            emptyDescription="Hot leads will appear when users reach a high engagement score."
          />
        </TabsContent>
      </Tabs>

      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-lg font-heading">Lead Details</SheetTitle>
            <SheetDescription className="sr-only">View and edit lead information</SheetDescription>
          </SheetHeader>

          {drawerLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading lead data...</p>
            </div>
          ) : drawerData ? (
            <div className="flex flex-col gap-5 pt-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={drawerData.profile.avatar_url || undefined} />
                      <AvatarFallback>{getInitials(drawerData.profile.full_name)}</AvatarFallback>
                    </Avatar>
                    {drawerData.lead_score?.engagement_level === "hot" && (
                      <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-red-500 animate-pulse" />
                    )}
                  </div>
                  <div>
                    <p className="text-base font-semibold" data-testid="text-detail-name">{drawerData.profile.full_name || "Unknown"}</p>
                    <p className="text-sm text-muted-foreground" data-testid="text-detail-email">{drawerData.profile.email}</p>
                    {drawerData.profile.phone_number && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Phone className="size-3" />
                        {drawerData.profile.phone_number}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => router.push(`/admin/users/${drawerData.profile.id}`)}
                  data-testid="button-view-full-profile"
                >
                  <ExternalLink className="size-4" />
                </Button>
              </div>

              <div>
                <Label className="text-sm font-medium">Stage</Label>
                <Select value={editStage} onValueChange={setEditStage}>
                  <SelectTrigger className="mt-1" data-testid="select-stage-override">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGES.map((s) => (
                      <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-lg border bg-card p-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  <Activity className="size-3 inline mr-1.5" />
                  Activity Summary
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Score</p>
                    <p className="text-xl font-bold mt-0.5" data-testid="text-detail-score">{drawerData.lead_score?.score || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Engagement</p>
                    <div className="mt-1">
                      <StatusBadge status={drawerData.lead_score?.engagement_level || "cold"} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Lessons</p>
                    <p className="text-xl font-bold mt-0.5" data-testid="text-detail-lessons">{drawerData.activity_summary.lessons_completed}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Page Views</p>
                    <p className="text-xl font-bold mt-0.5" data-testid="text-detail-views">{drawerData.activity_summary.page_views}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-muted-foreground">Last Activity</p>
                  <p className="text-sm mt-0.5" data-testid="text-detail-last-activity">
                    {drawerData.activity_summary.last_activity_at
                      ? format(new Date(drawerData.activity_summary.last_activity_at), "MMM d, yyyy 'at' h:mm a")
                      : "No activity recorded"}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <CreditCard className="size-3 inline mr-1.5" />
                    Payment Links
                  </h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPaymentDialogOpen(true)}
                    data-testid="button-send-payment-link"
                  >
                    <Plus className="size-3 mr-1" />
                    Send Link
                  </Button>
                </div>
                {drawerData.payment_links.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No payment links sent yet</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {drawerData.payment_links.map((pl) => (
                      <div key={pl.id} className="flex items-center justify-between gap-2 p-2 rounded-md border bg-background" data-testid={`payment-link-${pl.id}`}>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{pl.title}</p>
                          <p className="text-xs text-muted-foreground">
                            ${pl.amount} {pl.currency} &middot; {format(new Date(pl.created_at), "MMM d")}
                          </p>
                        </div>
                        <StatusBadge status={pl.status || "pending"} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-lg border bg-card p-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  <FileText className="size-3 inline mr-1.5" />
                  Notes
                </h4>
                <Textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Add notes about this lead..."
                  className="resize-none border-0 bg-transparent text-sm focus-visible:ring-0"
                  rows={3}
                  data-testid="textarea-notes"
                />
                {drawerData.notes.length > 0 && (
                  <div className="mt-3 pt-3 border-t flex flex-col gap-2">
                    {drawerData.notes.map((n) => (
                      <div key={n.id} className="text-xs" data-testid={`note-${n.id}`}>
                        <span className="font-medium">{n.admin_name}</span>
                        <span className="text-muted-foreground"> &middot; {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</span>
                        <p className="text-muted-foreground mt-0.5">{n.note}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-lg border bg-card p-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  <Phone className="size-3 inline mr-1.5" />
                  Recent Activity
                </h4>
                {drawerData.recent_activity.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No recent activity</p>
                ) : (
                  <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                    {drawerData.recent_activity.slice(0, 10).map((a) => (
                      <div key={a.id} className="flex items-center justify-between gap-2 py-1" data-testid={`activity-${a.id}`}>
                        <p className="text-xs truncate">{a.description}</p>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2 pb-4">
                <Button
                  size="sm"
                  onClick={saveLeadChanges}
                  disabled={saving}
                  data-testid="button-save-changes"
                >
                  {saving ? <Loader2 className="size-4 mr-1.5 animate-spin" /> : null}
                  Save Changes
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => selectedLeadId && recalculateScore(selectedLeadId)}
                  data-testid="button-recalculate"
                >
                  <RefreshCw className="size-3 mr-1.5" />
                  Recalculate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => drawerData && copyWhatsAppMessage(drawerData)}
                  data-testid="button-copy-whatsapp"
                >
                  <Copy className="size-3 mr-1.5" />
                  WhatsApp
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-sm text-muted-foreground">No data available</p>
            </div>
          )}
        </SheetContent>
      </Sheet>

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
