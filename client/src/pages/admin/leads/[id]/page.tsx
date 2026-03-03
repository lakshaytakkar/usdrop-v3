import { apiFetch } from "@/lib/supabase"
import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "@/hooks/use-router"
import { useToast } from "@/hooks/use-toast"
import { useHasPermission } from "@/hooks/use-has-permission"
import { AdminDetailLayout, AdminStatusBadge } from "@/components/admin"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
  Mail,
  User,
  Calendar,
  Clock,
  Activity,
  ShoppingBag,
  Map,
  BookOpen,
  Store,
  CheckCircle2,
  XCircle,
  Globe,
  Users,
  Megaphone,
  PenLine,
  ArrowRightLeft,
  Flag,
  StickyNote,
  UserCheck,
  Trash2,
  Eye,
  MessageSquare,
  CreditCard,
} from "lucide-react"

interface Lead {
  id: string
  user_id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  plan: string
  plan_name: string
  account_type: "free" | "pro"
  stage: "new_lead" | "engaged" | "pitched" | "converted" | "churned"
  source: "organic" | "referral" | "campaign" | "manual"
  priority: "low" | "medium" | "high"
  assigned_to: string | null
  notes: string | null
  last_contacted_at: string | null
  tags: string[]
  signup_date: string
  last_active: string
  onboarding_completed: boolean
  onboarding_progress: number
  saved_products: number
  has_shopify: boolean
  roadmap_progress: number
  engagement_score: number
  subscription_status: string | null
}

const STAGES: { key: Lead["stage"]; label: string }[] = [
  { key: "new_lead", label: "New Lead" },
  { key: "engaged", label: "Engaged" },
  { key: "pitched", label: "Pitched" },
  { key: "converted", label: "Converted" },
  { key: "churned", label: "Churned" },
]

const PRIORITIES: { key: Lead["priority"]; label: string; dotColor: string }[] = [
  { key: "low", label: "Low", dotColor: "bg-gray-400" },
  { key: "medium", label: "Medium", dotColor: "bg-amber-400" },
  { key: "high", label: "High", dotColor: "bg-red-500" },
]

const SOURCES: { key: Lead["source"]; label: string; icon: React.ElementType }[] = [
  { key: "organic", label: "Organic", icon: Globe },
  { key: "referral", label: "Referral", icon: Users },
  { key: "campaign", label: "Campaign", icon: Megaphone },
  { key: "manual", label: "Manual", icon: PenLine },
]

function getSourceLabel(source: Lead["source"]) {
  return SOURCES.find((s) => s.key === source)?.label || source
}

function OverviewTab({ lead, canEdit, saving, updateLead }: { lead: Lead; canEdit: boolean; saving: boolean; updateLead: (updates: Record<string, unknown>) => Promise<void> }) {
  const currentStageIndex = STAGES.findIndex((s) => s.key === lead.stage)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4" data-testid="text-contact-info-title">Contact Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary/5 border rounded-lg flex items-center justify-center">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground" data-testid="text-lead-email">{lead.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary/5 border rounded-lg flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Plan</p>
                <p className="text-sm font-medium text-foreground" data-testid="text-lead-plan">{lead.plan_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary/5 border rounded-lg flex items-center justify-center">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Signed Up</p>
                <p className="text-sm font-medium text-foreground" data-testid="text-lead-signup">
                  {lead.signup_date ? format(new Date(lead.signup_date), "MMM d, yyyy") : "—"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary/5 border rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Active</p>
                <p className="text-sm font-medium text-foreground" data-testid="text-lead-last-active">
                  {lead.last_active ? format(new Date(lead.last_active), "MMM d, yyyy") : "—"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary/5 border rounded-lg flex items-center justify-center">
                <Globe className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Source</p>
                <p className="text-sm font-medium text-foreground" data-testid="text-lead-source">{getSourceLabel(lead.source)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary/5 border rounded-lg flex items-center justify-center">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Contacted</p>
                <p className="text-sm font-medium text-foreground" data-testid="text-lead-last-contacted">
                  {lead.last_contacted_at ? format(new Date(lead.last_contacted_at), "MMM d, yyyy") : "Never"}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4" data-testid="text-engagement-title">Engagement Metrics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border rounded-md p-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                <Activity className="w-3.5 h-3.5" />
                Engagement Score
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${lead.engagement_score}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-foreground" data-testid="text-engagement-score">{lead.engagement_score}</span>
              </div>
            </div>

            <div className="border rounded-md p-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                <BookOpen className="w-3.5 h-3.5" />
                Onboarding Progress
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${lead.onboarding_progress}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-foreground" data-testid="text-onboarding-progress">{lead.onboarding_progress}%</span>
              </div>
            </div>

            <div className="border rounded-md p-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                <ShoppingBag className="w-3.5 h-3.5" />
                Saved Products
              </div>
              <p className="text-lg font-semibold text-foreground" data-testid="text-saved-products">{lead.saved_products}</p>
            </div>

            <div className="border rounded-md p-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                <Store className="w-3.5 h-3.5" />
                Shopify Connected
              </div>
              <div className="flex items-center gap-2" data-testid="text-shopify-status">
                {lead.has_shopify ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm font-semibold text-foreground">Yes</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm font-semibold text-muted-foreground">No</span>
                  </>
                )}
              </div>
            </div>

            <div className="border rounded-md p-4 sm:col-span-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                <Map className="w-3.5 h-3.5" />
                Roadmap Progress
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width: `${lead.roadmap_progress}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-foreground" data-testid="text-roadmap-progress">{lead.roadmap_progress}%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-semibold text-foreground mb-5" data-testid="text-stage-progression-title">Stage Progression</h3>
          <div className="flex items-center justify-between mb-6">
            {STAGES.map((stage, index) => {
              const isActive = index <= currentStageIndex
              const isCurrent = index === currentStageIndex
              return (
                <div key={stage.key} className="flex items-center flex-1 last:flex-initial">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-all",
                        isCurrent
                          ? "bg-primary border-primary text-primary-foreground"
                          : isActive
                          ? "bg-muted border-muted-foreground/30 text-foreground"
                          : "bg-card border-muted-foreground/20 text-muted-foreground"
                      )}
                      data-testid={`stage-dot-${stage.key}`}
                    >
                      {index + 1}
                    </div>
                    <span className={cn(
                      "text-xs mt-2 font-medium",
                      isCurrent ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {stage.label}
                    </span>
                  </div>
                  {index < STAGES.length - 1 && (
                    <div className={cn(
                      "flex-1 h-0.5 mx-2 rounded-full",
                      index < currentStageIndex ? "bg-primary/40" : "bg-muted"
                    )} />
                  )}
                </div>
              )
            })}
          </div>

          {canEdit && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Change Stage</p>
              <div className="flex items-center gap-2 flex-wrap">
                {STAGES.map((stage) => (
                  <Button
                    key={stage.key}
                    variant={lead.stage === stage.key ? "default" : "outline"}
                    size="sm"
                    disabled={saving || lead.stage === stage.key}
                    onClick={() => updateLead({ stage: stage.key })}
                    data-testid={`button-stage-${stage.key}`}
                  >
                    {stage.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              disabled={saving || !canEdit}
              onClick={() => updateLead({ last_contacted_at: new Date().toISOString() })}
              data-testid="button-mark-contacted"
            >
              <Mail className="w-4 h-4" />
              Mark as Contacted
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Priority</h3>
          <div className="flex items-center gap-2 flex-wrap">
            {PRIORITIES.map((p) => (
              <Button
                key={p.key}
                variant={lead.priority === p.key ? "default" : "outline"}
                size="sm"
                disabled={saving || !canEdit}
                onClick={() => updateLead({ priority: p.key })}
                data-testid={`button-priority-${p.key}`}
              >
                <span className={cn("w-2 h-2 rounded-full mr-1.5", lead.priority === p.key ? "bg-primary-foreground" : p.dotColor)} />
                {p.label}
              </Button>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Source</h3>
          <div className="flex items-center gap-2 flex-wrap">
            {SOURCES.map((s) => {
              const Icon = s.icon
              return (
                <Button
                  key={s.key}
                  variant={lead.source === s.key ? "default" : "outline"}
                  size="sm"
                  disabled={saving || !canEdit}
                  onClick={() => updateLead({ source: s.key })}
                  data-testid={`button-source-${s.key}`}
                >
                  <Icon className="w-3.5 h-3.5 mr-1.5" />
                  {s.label}
                </Button>
              )
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Activity Info</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subscription</span>
              <span className="font-medium text-foreground" data-testid="text-subscription-status">
                {lead.subscription_status || "None"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Account Type</span>
              <AdminStatusBadge status={lead.account_type} size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Onboarding</span>
              <span className="font-medium text-foreground" data-testid="text-onboarding-status">
                {lead.onboarding_completed ? "Completed" : "In Progress"}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

function TimelineTab({ lead, canEdit, saving, updateLead, notes, setNotes }: {
  lead: Lead
  canEdit: boolean
  saving: boolean
  updateLead: (updates: Record<string, unknown>) => Promise<void>
  notes: string
  setNotes: (v: string) => void
}) {
  const timelineEvents: { date: string; label: string; icon: React.ElementType; detail?: string }[] = []

  if (lead.signup_date) {
    timelineEvents.push({
      date: lead.signup_date,
      label: "Signed up",
      icon: User,
      detail: `Source: ${getSourceLabel(lead.source)}`,
    })
  }

  if (lead.onboarding_completed) {
    timelineEvents.push({
      date: lead.last_active || lead.signup_date,
      label: "Completed onboarding",
      icon: CheckCircle2,
    })
  }

  if (lead.has_shopify) {
    timelineEvents.push({
      date: lead.last_active || lead.signup_date,
      label: "Connected Shopify store",
      icon: Store,
    })
  }

  if (lead.last_contacted_at) {
    timelineEvents.push({
      date: lead.last_contacted_at,
      label: "Last contacted",
      icon: Mail,
    })
  }

  if (lead.stage !== "new_lead") {
    timelineEvents.push({
      date: lead.last_active || lead.signup_date,
      label: `Stage changed to ${STAGES.find((s) => s.key === lead.stage)?.label || lead.stage}`,
      icon: ArrowRightLeft,
    })
  }

  timelineEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-foreground mb-5" data-testid="text-timeline-title">Timeline</h3>
          {timelineEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No timeline events yet.</p>
          ) : (
            <div className="space-y-0">
              {timelineEvents.map((event, index) => {
                const Icon = event.icon
                return (
                  <div key={index} className="flex gap-4" data-testid={`timeline-event-${index}`}>
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/5 border flex items-center justify-center shrink-0">
                        <Icon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      {index < timelineEvents.length - 1 && (
                        <div className="w-px flex-1 bg-border my-1" />
                      )}
                    </div>
                    <div className={cn("pb-6", index === timelineEvents.length - 1 && "pb-0")}>
                      <p className="text-sm font-medium text-foreground">{event.label}</p>
                      {event.detail && (
                        <p className="text-xs text-muted-foreground mt-0.5">{event.detail}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(event.date), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4" data-testid="text-notes-title">Admin Notes</h3>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this lead..."
            rows={6}
            className="resize-none"
            disabled={!canEdit}
            data-testid="input-notes"
          />
          <Button
            className="mt-3 w-full"
            size="sm"
            disabled={saving || !canEdit || notes === (lead.notes || "")}
            onClick={() => updateLead({ notes })}
            data-testid="button-save-notes"
          >
            {saving ? "Saving..." : "Save Notes"}
          </Button>
        </Card>
      </div>
    </div>
  )
}

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  const { hasPermission: canEdit } = useHasPermission("leads.edit")

  const id = params.id as string

  const [lead, setLead] = useState<Lead | null>(null)
  const [allLeads, setAllLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [notes, setNotes] = useState("")
  const [saving, setSaving] = useState(false)

  const fetchLead = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiFetch("/api/admin/leads")
      if (!response.ok) throw new Error("Failed to fetch leads")
      const data = await response.json()
      const leads: Lead[] = data.leads || []
      setAllLeads(leads)
      const found = leads.find((l) => l.user_id === id)
      if (found) {
        setLead(found)
        setNotes(found.notes || "")
        setNotFound(false)
      } else {
        setNotFound(true)
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to load lead")
    } finally {
      setLoading(false)
    }
  }, [id, showError])

  useEffect(() => {
    fetchLead()
  }, [fetchLead])

  const updateLead = useCallback(async (updates: Record<string, unknown>) => {
    setSaving(true)
    try {
      const response = await apiFetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: id, ...updates }),
      })
      if (!response.ok) throw new Error("Failed to update lead")
      showSuccess("Lead updated successfully")
      await fetchLead()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to update lead")
    } finally {
      setSaving(false)
    }
  }, [id, fetchLead, showSuccess, showError])

  const currentIndex = allLeads.findIndex((l) => l.user_id === id)
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < allLeads.length - 1

  if (notFound && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center p-6">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-1" data-testid="text-not-found">Lead Not Found</h2>
        <p className="text-sm text-muted-foreground mb-4">The lead you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Button onClick={() => router.push("/admin/leads")} variant="outline" data-testid="button-return-leads">
          Return to Leads
        </Button>
      </div>
    )
  }

  const badges = lead ? [
    <AdminStatusBadge key="stage" status={lead.stage} dot />,
    <AdminStatusBadge key="priority" status={lead.priority} label={`${PRIORITIES.find(p => p.key === lead.priority)?.label || lead.priority} Priority`} />,
    <Badge key="source" variant="secondary" className="text-xs">
      {getSourceLabel(lead.source)}
    </Badge>,
  ] : []

  const actions = lead && canEdit ? [
    {
      label: "Change to New Lead",
      icon: <Flag className="w-4 h-4" />,
      onClick: () => updateLead({ stage: "new_lead" }),
      disabled: saving || lead.stage === "new_lead",
    },
    {
      label: "Change to Engaged",
      icon: <Activity className="w-4 h-4" />,
      onClick: () => updateLead({ stage: "engaged" }),
      disabled: saving || lead.stage === "engaged",
    },
    {
      label: "Change to Pitched",
      icon: <MessageSquare className="w-4 h-4" />,
      onClick: () => updateLead({ stage: "pitched" }),
      disabled: saving || lead.stage === "pitched",
    },
    {
      label: "Convert to Client",
      icon: <UserCheck className="w-4 h-4" />,
      onClick: () => updateLead({ stage: "converted" }),
      disabled: saving || lead.stage === "converted",
      separator: true,
    },
    {
      label: "Mark as Churned",
      icon: <XCircle className="w-4 h-4" />,
      onClick: () => updateLead({ stage: "churned" }),
      disabled: saving || lead.stage === "churned",
      variant: "destructive" as const,
    },
    {
      label: "View Full Profile",
      icon: <Eye className="w-4 h-4" />,
      onClick: () => router.push(`/admin/external-users/${lead.user_id}`),
      separator: true,
    },
    {
      label: "Mark as Contacted",
      icon: <Mail className="w-4 h-4" />,
      onClick: () => updateLead({ last_contacted_at: new Date().toISOString() }),
      disabled: saving,
    },
  ] : []

  const primaryActions = lead ? (
    <Button
      variant="outline"
      size="sm"
      onClick={() => router.push(`/admin/external-users/${lead.user_id}`)}
      data-testid="button-view-profile"
    >
      <Eye className="w-4 h-4 mr-1.5" />
      View Profile
    </Button>
  ) : undefined

  const tabs = lead ? [
    {
      value: "overview",
      label: "Overview",
      icon: <Eye className="w-4 h-4" />,
      content: (
        <OverviewTab
          lead={lead}
          canEdit={canEdit}
          saving={saving}
          updateLead={updateLead}
        />
      ),
    },
    {
      value: "timeline",
      label: "Timeline",
      icon: <Clock className="w-4 h-4" />,
      content: (
        <TimelineTab
          lead={lead}
          canEdit={canEdit}
          saving={saving}
          updateLead={updateLead}
          notes={notes}
          setNotes={setNotes}
        />
      ),
    },
  ] : []

  return (
    <AdminDetailLayout
      backHref="/admin/leads"
      backLabel="Back to Leads"
      title={lead?.full_name || "Unknown Lead"}
      subtitle={lead?.email}
      avatarUrl={lead?.avatar_url || undefined}
      badges={badges}
      actions={actions}
      primaryActions={primaryActions}
      tabs={tabs}
      defaultTab="overview"
      loading={loading}
      onPrev={hasPrev ? () => router.push(`/admin/leads/${allLeads[currentIndex - 1].user_id}`) : undefined}
      onNext={hasNext ? () => router.push(`/admin/leads/${allLeads[currentIndex + 1].user_id}`) : undefined}
      hasPrev={hasPrev}
      hasNext={hasNext}
    />
  )
}
