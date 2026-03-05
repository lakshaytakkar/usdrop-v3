import { useState, useEffect, useCallback } from "react"
import { apiFetch } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { format, formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
  Users,
  Flame,
  TrendingUp,
  BarChart3,
  LayoutGrid,
  Table2,
  X,
  BookOpen,
  Clock,
  RefreshCw,
  CreditCard,
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
  { key: "new_lead", label: "New" },
  { key: "engaged", label: "Engaged" },
  { key: "hot", label: "Hot" },
  { key: "contacted", label: "Contacted" },
  { key: "converted", label: "Converted" },
  { key: "lost", label: "Lost" },
]

const stageColors: Record<string, string> = {
  new_lead: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
  engaged: "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800",
  hot: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800",
  contacted: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800",
  converted: "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800",
  lost: "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800",
}

const stageHeaderColors: Record<string, string> = {
  new_lead: "text-blue-700 dark:text-blue-300",
  engaged: "text-amber-700 dark:text-amber-300",
  hot: "text-red-700 dark:text-red-300",
  contacted: "text-purple-700 dark:text-purple-300",
  converted: "text-emerald-700 dark:text-emerald-300",
  lost: "text-slate-700 dark:text-slate-300",
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
  const [viewMode, setViewMode] = useState<"board" | "table">("board")
  const [stageFilter, setStageFilter] = useState<string>("all")
  const [repFilter, setRepFilter] = useState<string>("all")
  const [selectedLead, setSelectedLead] = useState<PipelineLead | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [editNotes, setEditNotes] = useState("")
  const [editStage, setEditStage] = useState("")
  const [editRepId, setEditRepId] = useState("")
  const [saving, setSaving] = useState(false)
  const [reps, setReps] = useState<RepProfile[]>([])

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

  const openDetail = (lead: PipelineLead) => {
    setSelectedLead(lead)
    setEditNotes(lead.notes || "")
    setEditStage(lead.manual_stage_override || lead.auto_stage)
    setEditRepId(lead.assigned_rep_id || "")
    setDetailOpen(true)
  }

  const saveLeadChanges = async () => {
    if (!selectedLead) return
    setSaving(true)
    try {
      const res = await apiFetch(`/api/admin/pipeline/${selectedLead.user_id}`, {
        method: "PATCH",
        body: JSON.stringify({
          stage_override: editStage,
          assigned_rep_id: editRepId || null,
          notes: editNotes,
        }),
      })
      if (!res.ok) throw new Error("Failed to update lead")
      showSuccess("Lead updated successfully")
      setDetailOpen(false)
      fetchData()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to update lead")
    } finally {
      setSaving(false)
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

  const filteredLeads = leads.filter((lead) => {
    if (stageFilter && stageFilter !== "all") {
      if (lead.effective_stage !== stageFilter) return false
    }
    if (repFilter && repFilter !== "all") {
      if (lead.assigned_rep_id !== repFilter) return false
    }
    return true
  })

  const leadsByStage = STAGES.reduce<Record<string, PipelineLead[]>>((acc, stage) => {
    acc[stage.key] = filteredLeads.filter((l) => l.effective_stage === stage.key)
    return acc
  }, {})

  const columns: Column<PipelineLead & { id: string }>[] = [
    {
      key: "full_name",
      header: "Name",
      sortable: true,
      render: (lead) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={lead.user?.avatar_url || undefined} />
            <AvatarFallback className="text-xs">{getInitials(lead.user?.full_name || null)}</AvatarFallback>
          </Avatar>
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
      key: "engagement_level",
      header: "Engagement",
      render: (lead) => <StatusBadge status={lead.engagement_level} />,
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

  const rowActions: RowAction<PipelineLead & { id: string }>[] = [
    { label: "View Details", onClick: (lead) => openDetail(lead) },
    { label: "Recalculate Score", onClick: (lead) => recalculateScore(lead.user_id) },
    { label: "View User Profile", onClick: (lead) => router.push(`/admin/external-users/${lead.user_id}`) },
  ]

  return (
    <PageShell>
      <PageHeader
        title="Sales Pipeline"
        subtitle="Track and manage leads through the sales funnel"
        actions={
          <div className="flex items-center gap-2">
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="h-8 w-auto min-w-[130px] text-sm" data-testid="filter-stage">
                <SelectValue placeholder="All Stages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {STAGES.map((s) => (
                  <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {reps.length > 0 && (
              <Select value={repFilter} onValueChange={setRepFilter}>
                <SelectTrigger className="h-8 w-auto min-w-[130px] text-sm" data-testid="filter-rep">
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

            <div className="flex items-center border rounded-md">
              <Button
                size="icon"
                variant={viewMode === "board" ? "default" : "ghost"}
                onClick={() => setViewMode("board")}
                data-testid="button-view-board"
              >
                <LayoutGrid className="size-4" />
              </Button>
              <Button
                size="icon"
                variant={viewMode === "table" ? "default" : "ghost"}
                onClick={() => setViewMode("table")}
                data-testid="button-view-table"
              >
                <Table2 className="size-4" />
              </Button>
            </div>
          </div>
        }
      />

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

      {viewMode === "board" ? (
        <div className="flex gap-4 overflow-x-auto pb-4" data-testid="pipeline-board">
          {STAGES.map((stage) => {
            const stageLeads = leadsByStage[stage.key] || []
            return (
              <div
                key={stage.key}
                className={cn("flex flex-col min-w-[280px] w-[280px] rounded-xl border", stageColors[stage.key])}
                data-testid={`column-${stage.key}`}
              >
                <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-inherit">
                  <h3 className={cn("text-sm font-semibold", stageHeaderColors[stage.key])} data-testid={`text-column-title-${stage.key}`}>
                    {stage.label}
                  </h3>
                  <Badge variant="secondary" className="border-0 text-xs font-semibold px-1.5 py-0" data-testid={`badge-count-${stage.key}`}>
                    {stageLeads.length}
                  </Badge>
                </div>
                <div className="flex flex-col gap-2 p-2 overflow-y-auto max-h-[calc(100vh-360px)]">
                  {loading ? (
                    Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="h-24 rounded-lg bg-background/50 animate-pulse" />
                    ))
                  ) : stageLeads.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-6">No leads</p>
                  ) : (
                    stageLeads.map((lead) => (
                      <div
                        key={lead.user_id}
                        className="rounded-lg border bg-card p-3 cursor-pointer hover-elevate transition-shadow"
                        onClick={() => openDetail(lead)}
                        data-testid={`card-lead-${lead.user_id}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <Avatar className="h-7 w-7 shrink-0">
                              <AvatarImage src={lead.user?.avatar_url || undefined} />
                              <AvatarFallback className="text-[10px]">{getInitials(lead.user?.full_name || null)}</AvatarFallback>
                            </Avatar>
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
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <DataTable
          data={filteredLeads.map((l) => ({ ...l, id: l.user_id }))}
          columns={columns}
          rowActions={rowActions}
          searchPlaceholder="Search leads..."
          searchKey="full_name"
          onRowClick={(lead) => openDetail(lead)}
          isLoading={loading}
          emptyTitle="No leads in pipeline"
          emptyDescription="Leads will appear as users engage with the platform."
        />
      )}

      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-lg font-heading">Lead Details</SheetTitle>
            <SheetDescription className="sr-only">View and edit lead information</SheetDescription>
          </SheetHeader>

          {selectedLead && (
            <div className="flex flex-col gap-5 pt-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedLead.user?.avatar_url || undefined} />
                  <AvatarFallback>{getInitials(selectedLead.user?.full_name || null)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-base font-semibold" data-testid="text-detail-name">{selectedLead.user?.full_name || "Unknown"}</p>
                  <p className="text-sm text-muted-foreground" data-testid="text-detail-email">{selectedLead.user?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Score</p>
                  <p className="text-xl font-bold mt-1" data-testid="text-detail-score">{selectedLead.score}</p>
                </div>
                <div className="rounded-lg border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Engagement</p>
                  <div className="mt-1">
                    <StatusBadge status={selectedLead.engagement_level} />
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Lessons</p>
                  <p className="text-xl font-bold mt-1" data-testid="text-detail-lessons">{selectedLead.free_lessons_completed}</p>
                </div>
                <div className="rounded-lg border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Page Views</p>
                  <p className="text-xl font-bold mt-1" data-testid="text-detail-views">{selectedLead.total_page_views}</p>
                </div>
              </div>

              <div className="rounded-lg border bg-card p-3">
                <p className="text-xs text-muted-foreground mb-1">Last Activity</p>
                <p className="text-sm" data-testid="text-detail-last-activity">
                  {selectedLead.last_activity_at
                    ? format(new Date(selectedLead.last_activity_at), "MMM d, yyyy 'at' h:mm a")
                    : "No activity recorded"}
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-sm">Stage Override</Label>
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

                <div>
                  <Label className="text-sm">Assigned Rep</Label>
                  <Select value={editRepId || "unassigned"} onValueChange={(v) => setEditRepId(v === "unassigned" ? "" : v)}>
                    <SelectTrigger className="mt-1" data-testid="select-rep">
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {reps.map((r) => (
                        <SelectItem key={r.id} value={r.id}>{r.full_name || r.email}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm">Notes</Label>
                  <Textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Add notes about this lead..."
                    className="mt-1 resize-none"
                    rows={3}
                    data-testid="textarea-notes"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button onClick={saveLeadChanges} disabled={saving} data-testid="button-save-lead">
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => recalculateScore(selectedLead.user_id)}
                    data-testid="button-recalculate"
                  >
                    <RefreshCw className="size-4 mr-2" />
                    Recalculate
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setDetailOpen(false)
                      router.push(`/admin/payment-links?user=${selectedLead.user_id}`)
                    }}
                    data-testid="button-create-payment-link"
                  >
                    <CreditCard className="size-4 mr-2" />
                    Payment Link
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </PageShell>
  )
}
