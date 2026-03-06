import { useState, useEffect, useCallback } from "react"
import { apiFetch } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { format, formatDistanceToNow, differenceInDays } from "date-fns"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Plus,
  Search,
  GripVertical,
  ChevronRight,
  Copy,
  MessageSquare,
  ExternalLink,
  Calendar,
  RefreshCw,
  FileText,
  Building2,
  CheckCircle2,
  Circle,
  Loader2,
} from "lucide-react"
import {
  PageShell,
  PageHeader,
  StatusBadge,
} from "@/components/admin-shared"
import { useRouter } from "@/hooks/use-router"
import { cn } from "@/lib/utils"

interface LLCUser {
  id: string
  full_name: string | null
  email: string
  avatar_url: string | null
  account_type: string | null
  phone_number: string | null
}

interface LLCApplication {
  id: string
  user_id: string
  llc_name: string
  state: string | null
  package_type: string | null
  amount_paid: number | null
  status: string
  admin_notes: string | null
  filed_at: string | null
  ein_at: string | null
  boi_at: string | null
  bank_at: string | null
  stripe_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
  user: LLCUser | null
}

interface LLCStats {
  total: number
  statusCounts: Record<string, number>
  pending: number
  filed: number
  ein_received: number
  boi_filed: number
  bank_opened: number
  stripe_connected: number
  complete: number
}

const STAGES = [
  { key: "pending", label: "Pending", dateField: null },
  { key: "filed", label: "Filed", dateField: "filed_at" },
  { key: "ein_received", label: "EIN Received", dateField: "ein_at" },
  { key: "boi_filed", label: "BOI Filed", dateField: "boi_at" },
  { key: "bank_opened", label: "Bank Opened", dateField: "bank_at" },
  { key: "stripe_connected", label: "Stripe Connected", dateField: "stripe_at" },
  { key: "complete", label: "Complete", dateField: "completed_at" },
] as const

const stageColors: Record<string, string> = {
  pending: "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800",
  filed: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
  ein_received: "bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800",
  boi_filed: "bg-violet-50 dark:bg-violet-950 border-violet-200 dark:border-violet-800",
  bank_opened: "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800",
  stripe_connected: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800",
  complete: "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800",
}

const stageHeaderColors: Record<string, string> = {
  pending: "text-slate-700 dark:text-slate-300",
  filed: "text-blue-700 dark:text-blue-300",
  ein_received: "text-indigo-700 dark:text-indigo-300",
  boi_filed: "text-violet-700 dark:text-violet-300",
  bank_opened: "text-amber-700 dark:text-amber-300",
  stripe_connected: "text-purple-700 dark:text-purple-300",
  complete: "text-emerald-700 dark:text-emerald-300",
}

const WHATSAPP_MESSAGES: Record<string, string> = {
  pending: "Hi {name}, your LLC application for {llc} has been received. We'll begin processing it shortly.",
  filed: "Hi {name}, great news! Your LLC ({llc}) has been officially filed. We're now waiting for the EIN from the IRS.",
  ein_received: "Hi {name}, your EIN has been received for {llc}! Next step: BOI filing.",
  boi_filed: "Hi {name}, the BOI report for {llc} has been filed. Next up: opening your business bank account.",
  bank_opened: "Hi {name}, your business bank account for {llc} is now open! We'll proceed with connecting Stripe.",
  stripe_connected: "Hi {name}, Stripe has been connected for {llc}! Almost there - just a final review remaining.",
  complete: "Hi {name}, congratulations! Your LLC ({llc}) setup is fully complete. You're all set to start selling!",
}

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming",
]

function getInitials(name: string | null) {
  if (!name) return "?"
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

function getDaysInStage(app: LLCApplication): number {
  const stageIndex = STAGES.findIndex((s) => s.key === app.status)
  if (stageIndex <= 0) return differenceInDays(new Date(), new Date(app.created_at))
  const prevStage = STAGES[stageIndex]
  const dateField = prevStage.dateField
  if (dateField && (app as any)[dateField]) {
    return differenceInDays(new Date(), new Date((app as any)[dateField]))
  }
  return differenceInDays(new Date(), new Date(app.updated_at))
}

function getCardColor(days: number): string {
  if (days <= 3) return "border-l-emerald-500"
  if (days <= 7) return "border-l-amber-500"
  return "border-l-red-500"
}

function KanbanCard({ app, onClick }: { app: LLCApplication; onClick: () => void }) {
  const days = getDaysInStage(app)
  const cardColor = getCardColor(days)

  return (
    <div
      className={cn(
        "rounded-md border border-l-4 bg-card p-3 cursor-pointer hover-elevate transition-colors",
        cardColor
      )}
      onClick={onClick}
      data-testid={`card-llc-${app.id}`}
    >
      <div className="flex items-start gap-2.5">
        <Avatar className="h-7 w-7 shrink-0">
          <AvatarImage src={app.user?.avatar_url || undefined} />
          <AvatarFallback className="text-[10px]">{getInitials(app.user?.full_name || null)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate" data-testid={`text-llc-name-${app.id}`}>
            {app.llc_name}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {app.user?.full_name || app.user?.email || "Unknown"}
          </p>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        {app.state && (
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            {app.state}
          </Badge>
        )}
        <span className={cn(
          "text-[10px] font-medium",
          days <= 3 ? "text-emerald-600 dark:text-emerald-400" : days <= 7 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
        )} data-testid={`text-days-${app.id}`}>
          {days}d
        </span>
      </div>
      {app.amount_paid && (
        <p className="mt-1.5 text-[10px] text-muted-foreground">
          ${app.amount_paid.toLocaleString()}
        </p>
      )}
    </div>
  )
}

export default function AdminLLCPage() {
  const { showError, showSuccess } = useToast()
  const router = useRouter()
  const [applications, setApplications] = useState<LLCApplication[]>([])
  const [stats, setStats] = useState<LLCStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [stageFilter, setStageFilter] = useState<string>("all")

  const [detailApp, setDetailApp] = useState<LLCApplication | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [editNotes, setEditNotes] = useState("")
  const [editDates, setEditDates] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [advancing, setAdvancing] = useState(false)

  const [newOpen, setNewOpen] = useState(false)
  const [newForm, setNewForm] = useState({
    user_id: "",
    llc_name: "",
    state: "",
    package_type: "",
    amount_paid: "",
    admin_notes: "",
  })
  const [userSearch, setUserSearch] = useState("")
  const [userResults, setUserResults] = useState<LLCUser[]>([])
  const [searchingUsers, setSearchingUsers] = useState(false)
  const [creating, setCreating] = useState(false)
  const [selectedUser, setSelectedUser] = useState<LLCUser | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (stageFilter && stageFilter !== "all") params.set("status", stageFilter)
      if (search) params.set("search", search)
      params.set("pageSize", "200")
      const qs = params.toString()

      const [appsRes, statsRes] = await Promise.all([
        apiFetch(`/api/admin/llc${qs ? `?${qs}` : ""}`),
        apiFetch("/api/admin/llc/stats"),
      ])

      if (!appsRes.ok) throw new Error("Failed to fetch LLC applications")
      if (!statsRes.ok) throw new Error("Failed to fetch LLC stats")

      const appsData = await appsRes.json()
      const statsData = await statsRes.json()

      setApplications(appsData.applications || [])
      setStats(statsData)
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to load LLC data")
    } finally {
      setLoading(false)
    }
  }, [stageFilter, search, showError])

  useEffect(() => { fetchData() }, [fetchData])

  const searchUsers = useCallback(async (q: string) => {
    if (q.length < 2) {
      setUserResults([])
      return
    }
    setSearchingUsers(true)
    try {
      const res = await apiFetch(`/api/admin/external-users?search=${encodeURIComponent(q)}&pageSize=10`)
      if (res.ok) {
        const data = await res.json()
        const users = (data.users || data || []).map((u: any) => ({
          id: u.id,
          full_name: u.full_name || u.name,
          email: u.email,
          avatar_url: u.avatar_url,
          account_type: u.account_type,
          phone_number: u.phone_number,
        }))
        setUserResults(users)
      }
    } catch {
      // silently fail search
    } finally {
      setSearchingUsers(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => searchUsers(userSearch), 300)
    return () => clearTimeout(timer)
  }, [userSearch, searchUsers])

  const openDetail = (app: LLCApplication) => {
    setDetailApp(app)
    setEditNotes(app.admin_notes || "")
    const dates: Record<string, string> = {}
    if (app.filed_at) dates.filed_at = app.filed_at.substring(0, 10)
    if (app.ein_at) dates.ein_at = app.ein_at.substring(0, 10)
    if (app.boi_at) dates.boi_at = app.boi_at.substring(0, 10)
    if (app.bank_at) dates.bank_at = app.bank_at.substring(0, 10)
    if (app.stripe_at) dates.stripe_at = app.stripe_at.substring(0, 10)
    if (app.completed_at) dates.completed_at = app.completed_at.substring(0, 10)
    setEditDates(dates)
    setDetailOpen(true)
  }

  const saveChanges = async () => {
    if (!detailApp) return
    setSaving(true)
    try {
      const body: Record<string, any> = { admin_notes: editNotes }
      for (const [key, val] of Object.entries(editDates)) {
        body[key] = val ? new Date(val).toISOString() : null
      }
      const res = await apiFetch(`/api/admin/llc/${detailApp.id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error("Failed to save changes")
      showSuccess("LLC application updated")
      setDetailOpen(false)
      fetchData()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  const advanceStage = async () => {
    if (!detailApp) return
    setAdvancing(true)
    try {
      const res = await apiFetch(`/api/admin/llc/${detailApp.id}/advance`, { method: "PATCH" })
      if (!res.ok) throw new Error("Failed to advance stage")
      const data = await res.json()
      showSuccess("Stage advanced successfully")
      setDetailApp(data.application)
      const dates: Record<string, string> = {}
      const a = data.application
      if (a.filed_at) dates.filed_at = a.filed_at.substring(0, 10)
      if (a.ein_at) dates.ein_at = a.ein_at.substring(0, 10)
      if (a.boi_at) dates.boi_at = a.boi_at.substring(0, 10)
      if (a.bank_at) dates.bank_at = a.bank_at.substring(0, 10)
      if (a.stripe_at) dates.stripe_at = a.stripe_at.substring(0, 10)
      if (a.completed_at) dates.completed_at = a.completed_at.substring(0, 10)
      setEditDates(dates)
      setEditNotes(a.admin_notes || "")
      fetchData()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to advance")
    } finally {
      setAdvancing(false)
    }
  }

  const copyWhatsApp = () => {
    if (!detailApp) return
    const template = WHATSAPP_MESSAGES[detailApp.status] || ""
    const message = template
      .replace("{name}", detailApp.user?.full_name || "there")
      .replace("{llc}", detailApp.llc_name)
    navigator.clipboard.writeText(message)
    showSuccess("WhatsApp message copied to clipboard")
  }

  const createApplication = async () => {
    if (!newForm.user_id || !newForm.llc_name) {
      showError("Please select a client and enter LLC name")
      return
    }
    setCreating(true)
    try {
      const res = await apiFetch("/api/admin/llc", {
        method: "POST",
        body: JSON.stringify(newForm),
      })
      if (!res.ok) throw new Error("Failed to create application")
      showSuccess("LLC application created")
      setNewOpen(false)
      setNewForm({ user_id: "", llc_name: "", state: "", package_type: "", amount_paid: "", admin_notes: "" })
      setSelectedUser(null)
      setUserSearch("")
      fetchData()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to create")
    } finally {
      setCreating(false)
    }
  }

  const appsByStage = STAGES.reduce<Record<string, LLCApplication[]>>((acc, stage) => {
    acc[stage.key] = applications.filter((a) => a.status === stage.key)
    return acc
  }, {})

  const currentStageIndex = detailApp ? STAGES.findIndex((s) => s.key === detailApp.status) : -1
  const canAdvance = currentStageIndex >= 0 && currentStageIndex < STAGES.length - 1

  return (
    <PageShell>
      <PageHeader
        title="LLC Tracker"
        subtitle="Track LLC application progress and milestones"
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={fetchData} disabled={loading} data-testid="button-refresh">
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
            <Button size="sm" onClick={() => setNewOpen(true)} data-testid="button-new-application">
              <Plus className="h-4 w-4 mr-1.5" />
              New Application
            </Button>
          </div>
        }
      />

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search LLC name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            size="sm"
            variant={stageFilter === "all" ? "default" : "outline"}
            onClick={() => setStageFilter("all")}
            data-testid="filter-all"
          >
            All {stats ? `(${stats.total})` : ""}
          </Button>
          {STAGES.map((stage) => (
            <Button
              key={stage.key}
              size="sm"
              variant={stageFilter === stage.key ? "default" : "outline"}
              onClick={() => setStageFilter(stage.key)}
              data-testid={`filter-${stage.key}`}
            >
              {stage.label}
              {stats && (
                <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5 py-0">
                  {(stats as any)[stage.key] || 0}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20" data-testid="loading-state">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-4" data-testid="kanban-board">
          {STAGES.map((stage) => {
            const stageApps = appsByStage[stage.key] || []
            const isFiltered = stageFilter !== "all" && stageFilter !== stage.key
            if (isFiltered) return null

            return (
              <div key={stage.key} className="flex-shrink-0 w-[240px]" data-testid={`column-${stage.key}`}>
                <div className={cn("rounded-lg border p-2.5", stageColors[stage.key])}>
                  <div className="flex items-center justify-between gap-2 mb-2.5 px-1">
                    <h3 className={cn("text-xs font-semibold", stageHeaderColors[stage.key])} data-testid={`text-stage-${stage.key}`}>
                      {stage.label}
                    </h3>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {stageApps.length}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-2 min-h-[100px]">
                    {stageApps.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-6">No applications</p>
                    ) : (
                      stageApps.map((app) => (
                        <KanbanCard key={app.id} app={app} onClick={() => openDetail(app)} />
                      ))
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" data-testid="dialog-llc-detail">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold font-heading" data-testid="text-detail-title">
              {detailApp?.llc_name || "LLC Application"}
            </DialogTitle>
            <DialogDescription className="sr-only">LLC application details and timeline</DialogDescription>
          </DialogHeader>

          {detailApp && (
            <div className="flex flex-col gap-5 py-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={detailApp.user?.avatar_url || undefined} />
                  <AvatarFallback>{getInitials(detailApp.user?.full_name || null)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium" data-testid="text-detail-user">
                    {detailApp.user?.full_name || "Unknown"}
                  </p>
                  <p className="text-xs text-muted-foreground">{detailApp.user?.email}</p>
                </div>
                <StatusBadge status={STAGES.find((s) => s.key === detailApp.status)?.label || detailApp.status} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {detailApp.state && (
                  <div>
                    <span className="text-xs text-muted-foreground">State</span>
                    <p className="font-medium">{detailApp.state}</p>
                  </div>
                )}
                {detailApp.package_type && (
                  <div>
                    <span className="text-xs text-muted-foreground">Package</span>
                    <p className="font-medium">{detailApp.package_type}</p>
                  </div>
                )}
                {detailApp.amount_paid != null && (
                  <div>
                    <span className="text-xs text-muted-foreground">Amount Paid</span>
                    <p className="font-medium">${detailApp.amount_paid.toLocaleString()}</p>
                  </div>
                )}
                <div>
                  <span className="text-xs text-muted-foreground">Created</span>
                  <p className="font-medium">{format(new Date(detailApp.created_at), "MMM d, yyyy")}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3">Timeline</h4>
                <div className="flex flex-col gap-2">
                  {STAGES.map((stage, idx) => {
                    const isCompleted = idx <= currentStageIndex
                    const isCurrent = idx === currentStageIndex
                    const dateField = stage.dateField
                    const dateValue = dateField ? editDates[dateField] || "" : ""

                    return (
                      <div
                        key={stage.key}
                        className={cn(
                          "flex items-center gap-3 py-1.5 px-2 rounded-md",
                          isCurrent && "bg-accent/50"
                        )}
                        data-testid={`timeline-${stage.key}`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                        ) : (
                          <Circle className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                        )}
                        <span className={cn(
                          "text-sm flex-1",
                          isCompleted ? "font-medium" : "text-muted-foreground"
                        )}>
                          {stage.label}
                        </span>
                        {dateField && (
                          <Input
                            type="date"
                            value={dateValue}
                            onChange={(e) => setEditDates((prev) => ({ ...prev, [dateField]: e.target.value }))}
                            className="w-[140px] h-7 text-xs"
                            data-testid={`input-date-${stage.key}`}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold">Admin Notes</Label>
                <Textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Add notes about this application..."
                  className="mt-1.5 resize-none text-sm"
                  rows={3}
                  data-testid="input-notes"
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <div className="flex items-center gap-2 flex-wrap flex-1">
              <Button size="sm" variant="outline" onClick={copyWhatsApp} data-testid="button-whatsapp">
                <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                WhatsApp Update
              </Button>
              {detailApp?.user_id && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/admin/users/${detailApp.user_id}`)}
                  data-testid="button-view-client"
                >
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  View Client
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {canAdvance && (
                <Button size="sm" variant="outline" onClick={advanceStage} disabled={advancing} data-testid="button-advance">
                  {advancing ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <ChevronRight className="h-3.5 w-3.5 mr-1.5" />}
                  Next Stage
                </Button>
              )}
              <Button size="sm" onClick={saveChanges} disabled={saving} data-testid="button-save">
                {saving ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <FileText className="h-3.5 w-3.5 mr-1.5" />}
                Save
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto" data-testid="dialog-new-application">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold font-heading">New LLC Application</DialogTitle>
            <DialogDescription className="sr-only">Create a new LLC application</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div>
              <Label className="text-sm">Client</Label>
              {selectedUser ? (
                <div className="mt-1.5 flex items-center gap-2 rounded-md border p-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={selectedUser.avatar_url || undefined} />
                    <AvatarFallback className="text-[10px]">{getInitials(selectedUser.full_name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{selectedUser.full_name || selectedUser.email}</p>
                    <p className="text-xs text-muted-foreground truncate">{selectedUser.email}</p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setSelectedUser(null)
                      setNewForm((f) => ({ ...f, user_id: "" }))
                    }}
                    data-testid="button-clear-user"
                  >
                    <span className="text-xs text-muted-foreground">x</span>
                  </Button>
                </div>
              ) : (
                <div className="mt-1.5">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Search clients by name or email..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="pl-9"
                      data-testid="input-user-search"
                    />
                  </div>
                  {searchingUsers && (
                    <div className="flex items-center gap-2 py-2 text-xs text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" /> Searching...
                    </div>
                  )}
                  {userResults.length > 0 && (
                    <div className="mt-1 rounded-md border max-h-[160px] overflow-y-auto">
                      {userResults.map((u) => (
                        <div
                          key={u.id}
                          className="flex items-center gap-2 p-2 hover-elevate cursor-pointer"
                          onClick={() => {
                            setSelectedUser(u)
                            setNewForm((f) => ({ ...f, user_id: u.id }))
                            setUserSearch("")
                            setUserResults([])
                          }}
                          data-testid={`user-result-${u.id}`}
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={u.avatar_url || undefined} />
                            <AvatarFallback className="text-[10px]">{getInitials(u.full_name)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-xs font-medium truncate">{u.full_name || u.email}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <Label className="text-sm">LLC Name</Label>
              <Input
                value={newForm.llc_name}
                onChange={(e) => setNewForm((f) => ({ ...f, llc_name: e.target.value }))}
                placeholder="e.g. My Business LLC"
                className="mt-1.5"
                data-testid="input-llc-name"
              />
            </div>

            <div>
              <Label className="text-sm">State</Label>
              <Select value={newForm.state} onValueChange={(v) => setNewForm((f) => ({ ...f, state: v }))}>
                <SelectTrigger className="mt-1.5" data-testid="select-state">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm">Package Type</Label>
              <Select value={newForm.package_type} onValueChange={(v) => setNewForm((f) => ({ ...f, package_type: v }))}>
                <SelectTrigger className="mt-1.5" data-testid="select-package">
                  <SelectValue placeholder="Select package" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm">Amount Paid ($)</Label>
              <Input
                type="number"
                value={newForm.amount_paid}
                onChange={(e) => setNewForm((f) => ({ ...f, amount_paid: e.target.value }))}
                placeholder="0.00"
                className="mt-1.5"
                data-testid="input-amount"
              />
            </div>

            <div>
              <Label className="text-sm">Notes</Label>
              <Textarea
                value={newForm.admin_notes}
                onChange={(e) => setNewForm((f) => ({ ...f, admin_notes: e.target.value }))}
                placeholder="Optional notes..."
                className="mt-1.5 resize-none text-sm"
                rows={2}
                data-testid="input-new-notes"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button size="sm" variant="outline" onClick={() => setNewOpen(false)} data-testid="button-cancel-new">
              Cancel
            </Button>
            <Button size="sm" onClick={createApplication} disabled={creating} data-testid="button-create">
              {creating ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Plus className="h-3.5 w-3.5 mr-1.5" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  )
}
