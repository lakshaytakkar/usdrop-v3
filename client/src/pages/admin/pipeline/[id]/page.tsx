import { useState, useEffect, useCallback } from "react"
import { useParams } from "wouter"
import { apiFetch } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "@/hooks/use-router"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  PageShell,
  PageHeader,
  SectionCard,
  InfoRow,
  StatusBadge,
} from "@/components/admin-shared"
import {
  ArrowLeft,
  Activity,
  CreditCard,
  Plus,
  Phone,
  ExternalLink,
  Copy,
  Send,
  FileText,
  Loader2,
  RefreshCw,
  MessageSquare,
  Save,
  Eye,
  Clock,
  GraduationCap,
  Globe,
  User,
  DollarSign,
  StickyNote,
  TrendingUp,
  ChevronRight,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"

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
  { key: "hot_lead", label: "Hot Lead" },
  { key: "call_booked", label: "Call Booked" },
  { key: "payment_sent", label: "Payment Sent" },
  { key: "converted", label: "Converted" },
  { key: "lost", label: "Lost" },
]

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

const engagementColors: Record<string, string> = {
  hot: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  warm: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  cold: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
}

function normalizeStage(stage: string) {
  if (stage === "hot") return "hot_lead"
  if (stage === "contacted") return "call_booked"
  if (stage === "qualified") return "payment_sent"
  return stage
}

function getInitials(name: string | null) {
  if (!name) return "?"
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

function ScoreRing({ score }: { score: number }) {
  const maxScore = 200
  const pct = Math.min(100, (score / maxScore) * 100)
  const color = score >= 51 ? "text-red-500" : score >= 21 ? "text-amber-500" : "text-blue-500"
  const r = 40
  const circumference = 2 * Math.PI * r

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/20" />
        <circle
          cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth="6"
          className={color}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (pct / 100) * circumference}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" data-testid="text-score-value">{score}</span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Score</span>
      </div>
    </div>
  )
}

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { showError, showSuccess } = useToast()

  const [data, setData] = useState<DrawerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  const [editStage, setEditStage] = useState("")
  const [editNotes, setEditNotes] = useState("")
  const [newNote, setNewNote] = useState("")
  const [saving, setSaving] = useState(false)

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [paymentTitle, setPaymentTitle] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentDesc, setPaymentDesc] = useState("")
  const [paymentUrl, setPaymentUrl] = useState("")
  const [sendingPayment, setSendingPayment] = useState(false)

  const fetchData = useCallback(async () => {
    if (!id) return
    try {
      setLoading(true)
      const res = await apiFetch(`/api/admin/pipeline/${id}/drawer`)
      if (!res.ok) throw new Error("Failed to load lead details")
      const json = await res.json()
      setData(json)
      setEditStage(normalizeStage(json.lead_score?.effective_stage || "new_lead"))
      setEditNotes(json.lead_score?.notes || "")
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to load lead")
    } finally {
      setLoading(false)
    }
  }, [id, showError])

  useEffect(() => { fetchData() }, [fetchData])

  const saveChanges = async () => {
    if (!id) return
    setSaving(true)
    try {
      const res = await apiFetch(`/api/admin/pipeline/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          stage_override: editStage,
          notes: editNotes,
        }),
      })
      if (!res.ok) throw new Error("Failed to update lead")
      showSuccess("Lead updated")
      fetchData()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to update")
    } finally {
      setSaving(false)
    }
  }

  const addNote = async () => {
    if (!id || !newNote.trim()) return
    try {
      const res = await apiFetch(`/api/admin/pipeline/${id}/notes`, {
        method: "POST",
        body: JSON.stringify({ note: newNote.trim() }),
      })
      if (!res.ok) throw new Error("Failed to add note")
      showSuccess("Note added")
      setNewNote("")
      fetchData()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to add note")
    }
  }

  const recalculateScore = async () => {
    if (!id) return
    try {
      const res = await apiFetch(`/api/admin/pipeline/${id}/recalculate`, { method: "POST" })
      if (!res.ok) throw new Error("Failed to recalculate")
      showSuccess("Score recalculated")
      fetchData()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to recalculate")
    }
  }

  const handleSendPaymentLink = async () => {
    if (!id || !paymentTitle || !paymentAmount) return
    setSendingPayment(true)
    try {
      const res = await apiFetch("/api/admin/payment-links", {
        method: "POST",
        body: JSON.stringify({
          lead_user_id: id,
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

  const copyWhatsAppMessage = () => {
    if (!data) return
    const name = data.profile.full_name || "there"
    const latestLink = data.payment_links.length > 0 ? data.payment_links[0] : null
    let message = `Hi ${name}! `
    if (latestLink) {
      message += `Here is your payment link for "${latestLink.title}" ($${latestLink.amount}): ${latestLink.payment_url || "[link]"}`
    } else {
      message += `I wanted to follow up on your interest in our services. Would you like to schedule a quick call?`
    }
    navigator.clipboard.writeText(message)
    showSuccess("WhatsApp message copied")
  }

  if (loading) {
    return (
      <PageShell>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      </PageShell>
    )
  }

  if (!data) {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <p className="text-muted-foreground">Lead not found</p>
          <Button variant="outline" size="sm" onClick={() => router.push("/admin/pipeline")}>
            <ArrowLeft className="size-4 mr-1.5" />
            Back to Pipeline
          </Button>
        </div>
      </PageShell>
    )
  }

  const stage = normalizeStage(data.lead_score?.effective_stage || "new_lead")
  const stageLabel = STAGES.find(s => s.key === stage)?.label || stage
  const engagement = data.lead_score?.engagement_level || "cold"

  const activityByType = data.recent_activity.reduce<Record<string, number>>((acc, a) => {
    acc[a.activity_type] = (acc[a.activity_type] || 0) + 1
    return acc
  }, {})

  return (
    <PageShell>
      <div className="flex items-center gap-3 mb-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/admin/pipeline")}
          data-testid="button-back-pipeline"
        >
          <ArrowLeft className="size-4 mr-1" />
          Pipeline
        </Button>
        <ChevronRight className="size-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{data.profile.full_name || data.profile.email}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={data.profile.avatar_url || undefined} />
                    <AvatarFallback className="text-lg">{getInitials(data.profile.full_name)}</AvatarFallback>
                  </Avatar>
                  {engagement === "hot" && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-card bg-red-500 animate-pulse" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold font-heading" data-testid="text-lead-name">
                    {data.profile.full_name || "Unknown"}
                  </h2>
                  <p className="text-sm text-muted-foreground" data-testid="text-lead-email">{data.profile.email}</p>
                  {data.profile.phone_number && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Phone className="size-3" />
                      {data.profile.phone_number}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className={cn("text-xs border-0", stageBadgeColors[stage])}>
                      {stageLabel}
                    </Badge>
                    <Badge variant="secondary" className={cn("text-xs border-0", engagementColors[engagement])}>
                      {engagement}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {data.profile.account_type || "free"}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyWhatsAppMessage}
                  data-testid="button-whatsapp"
                >
                  <Copy className="size-3 mr-1.5" />
                  WhatsApp
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/admin/users/${data.profile.id}`)}
                  data-testid="button-view-profile"
                >
                  <ExternalLink className="size-3 mr-1.5" />
                  Profile
                </Button>
              </div>
            </div>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
              <TabsTrigger value="activity" data-testid="tab-activity">Activity</TabsTrigger>
              <TabsTrigger value="payments" data-testid="tab-payments">Payments</TabsTrigger>
              <TabsTrigger value="notes" data-testid="tab-notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-5 mt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center">
                  <TrendingUp className="size-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-2xl font-bold" data-testid="text-stat-score">{data.lead_score?.score || 0}</p>
                  <p className="text-xs text-muted-foreground">Lead Score</p>
                </Card>
                <Card className="p-4 text-center">
                  <GraduationCap className="size-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-2xl font-bold" data-testid="text-stat-lessons">{data.activity_summary.lessons_completed}</p>
                  <p className="text-xs text-muted-foreground">Lessons</p>
                </Card>
                <Card className="p-4 text-center">
                  <Eye className="size-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-2xl font-bold" data-testid="text-stat-views">{data.activity_summary.page_views}</p>
                  <p className="text-xs text-muted-foreground">Page Views</p>
                </Card>
                <Card className="p-4 text-center">
                  <DollarSign className="size-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-2xl font-bold" data-testid="text-stat-payments">{data.payment_links.length}</p>
                  <p className="text-xs text-muted-foreground">Payment Links</p>
                </Card>
              </div>

              <SectionCard title="Lead Management" icon={<BarChart3 className="size-4" />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Stage</Label>
                    <Select value={editStage} onValueChange={setEditStage}>
                      <SelectTrigger className="mt-1" data-testid="select-stage">
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
                    <Label className="text-sm font-medium">Assigned Rep</Label>
                    <div className="mt-1 flex items-center gap-2 h-10 px-3 rounded-md border bg-muted/30">
                      {data.lead_score?.assigned_rep ? (
                        <>
                          <User className="size-3.5 text-muted-foreground" />
                          <span className="text-sm">{data.lead_score.assigned_rep.full_name || data.lead_score.assigned_rep.email}</span>
                        </>
                      ) : (
                        <span className="text-sm text-muted-foreground">Unassigned</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <Label className="text-sm font-medium">Internal Notes</Label>
                  <Textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Internal notes about this lead..."
                    className="mt-1 resize-none"
                    rows={3}
                    data-testid="textarea-internal-notes"
                  />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={saveChanges}
                    disabled={saving}
                    data-testid="button-save-changes"
                  >
                    {saving ? <Loader2 className="size-4 mr-1.5 animate-spin" /> : <Save className="size-3 mr-1.5" />}
                    Save Changes
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={recalculateScore}
                    data-testid="button-recalculate"
                  >
                    <RefreshCw className="size-3 mr-1.5" />
                    Recalculate Score
                  </Button>
                </div>
              </SectionCard>

              <SectionCard title="Profile Details" icon={<User className="size-4" />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
                  <InfoRow label="Account Type" value={data.profile.account_type || "free"} />
                  <InfoRow
                    label="Joined"
                    value={data.profile.created_at ? format(new Date(data.profile.created_at), "MMM d, yyyy") : "Unknown"}
                  />
                  <InfoRow label="Onboarding" value={data.profile.onboarding_completed ? "Completed" : "In Progress"} />
                  <InfoRow
                    label="Last Activity"
                    value={data.activity_summary.last_activity_at
                      ? format(new Date(data.activity_summary.last_activity_at), "MMM d, yyyy 'at' h:mm a")
                      : "None"
                    }
                  />
                  <InfoRow label="Auto Stage" value={STAGES.find(s => s.key === normalizeStage(data.lead_score?.auto_stage || ""))?.label || data.lead_score?.auto_stage || "N/A"} />
                  <InfoRow label="Engagement" value={engagement} />
                </div>
              </SectionCard>

              {Object.keys(activityByType).length > 0 && (
                <SectionCard title="Activity Breakdown" icon={<BarChart3 className="size-4" />}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(activityByType).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                      <div key={type} className="rounded-lg border p-3 text-center">
                        <p className="text-lg font-bold">{count}</p>
                        <p className="text-xs text-muted-foreground capitalize">{type.replace(/_/g, " ")}</p>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}
            </TabsContent>

            <TabsContent value="activity" className="space-y-4 mt-4">
              <SectionCard
                title="Recent Activity"
                icon={<Activity className="size-4" />}
                description={`${data.recent_activity.length} recent events`}
              >
                {data.recent_activity.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No activity recorded</p>
                ) : (
                  <div className="divide-y">
                    {data.recent_activity.map((a) => (
                      <div key={a.id} className="flex items-center justify-between gap-4 py-3" data-testid={`activity-row-${a.id}`}>
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            a.activity_type === "page_view" ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" :
                            a.activity_type === "lesson_complete" ? "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400" :
                            "bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400"
                          )}>
                            {a.activity_type === "page_view" ? <Eye className="size-3.5" /> :
                             a.activity_type === "lesson_complete" ? <GraduationCap className="size-3.5" /> :
                             <Activity className="size-3.5" />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{a.description || a.activity_type}</p>
                            {a.metadata?.page && (
                              <p className="text-xs text-muted-foreground truncate">{a.metadata.page}</p>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>
            </TabsContent>

            <TabsContent value="payments" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Payment Links</h3>
                <Button
                  size="sm"
                  onClick={() => setPaymentDialogOpen(true)}
                  data-testid="button-create-payment"
                >
                  <Plus className="size-3 mr-1.5" />
                  New Payment Link
                </Button>
              </div>

              {data.payment_links.length === 0 ? (
                <Card className="p-8 text-center">
                  <CreditCard className="size-8 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm font-medium">No payment links yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Create a payment link to send to this lead</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {data.payment_links.map((pl) => (
                    <Card key={pl.id} className="p-4" data-testid={`payment-card-${pl.id}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">{pl.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Created {format(new Date(pl.created_at), "MMM d, yyyy 'at' h:mm a")}
                            {pl.creator_name && ` by ${pl.creator_name}`}
                          </p>
                          {pl.payment_url && (
                            <a
                              href={pl.payment_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                            >
                              <Globe className="size-3" />
                              {pl.payment_url}
                            </a>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-lg font-bold">${pl.amount}</p>
                          <p className="text-xs text-muted-foreground">{pl.currency}</p>
                          <div className="mt-1">
                            <StatusBadge status={pl.status || "pending"} />
                          </div>
                        </div>
                      </div>
                      {pl.paid_at && (
                        <p className="text-xs text-emerald-600 mt-2">
                          Paid on {format(new Date(pl.paid_at), "MMM d, yyyy")}
                        </p>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="notes" className="space-y-4 mt-4">
              <SectionCard title="Admin Notes" icon={<StickyNote className="size-4" />}>
                <div className="flex gap-2">
                  <Textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note about this lead..."
                    className="resize-none flex-1"
                    rows={2}
                    data-testid="textarea-new-note"
                  />
                  <Button
                    size="sm"
                    onClick={addNote}
                    disabled={!newNote.trim()}
                    className="self-end"
                    data-testid="button-add-note"
                  >
                    <Plus className="size-3 mr-1" />
                    Add
                  </Button>
                </div>

                {data.notes.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6 mt-4">No notes yet</p>
                ) : (
                  <div className="divide-y mt-4">
                    {data.notes.map((n) => (
                      <div key={n.id} className="py-3" data-testid={`note-row-${n.id}`}>
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium">{n.admin_name}</p>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{n.note}</p>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex flex-col items-center">
              <ScoreRing score={data.lead_score?.score || 0} />
              <p className="text-sm font-medium mt-2">{stageLabel}</p>
              <p className="text-xs text-muted-foreground capitalize">{engagement} engagement</p>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Quick Info
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Joined</span>
                <span className="font-medium">
                  {data.profile.created_at ? format(new Date(data.profile.created_at), "MMM d, yyyy") : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last Seen</span>
                <span className="font-medium">
                  {data.activity_summary.last_activity_at
                    ? formatDistanceToNow(new Date(data.activity_summary.last_activity_at), { addSuffix: true })
                    : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Plan</span>
                <Badge variant="outline" className="text-xs">{data.profile.account_type || "free"}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium">{data.profile.phone_number || "—"}</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Quick Actions
            </h4>
            <div className="space-y-2">
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start"
                onClick={() => setPaymentDialogOpen(true)}
                data-testid="button-quick-payment"
              >
                <CreditCard className="size-3 mr-2" />
                Send Payment Link
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start"
                onClick={copyWhatsAppMessage}
                data-testid="button-quick-whatsapp"
              >
                <MessageSquare className="size-3 mr-2" />
                Copy WhatsApp Message
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start"
                onClick={recalculateScore}
                data-testid="button-quick-recalculate"
              >
                <RefreshCw className="size-3 mr-2" />
                Recalculate Score
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push(`/admin/users/${data.profile.id}`)}
                data-testid="button-quick-profile"
              >
                <ExternalLink className="size-3 mr-2" />
                View Full Profile
              </Button>
            </div>
          </Card>
        </div>
      </div>

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
                  data-testid="button-copy-payment-msg"
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
