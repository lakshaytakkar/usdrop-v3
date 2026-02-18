"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useHasPermission } from "@/hooks/use-has-permission"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  Mail,
  User,
  Calendar,
  Clock,
  Activity,
  ShoppingBag,
  Map,
  BookOpen,
  Zap,
  CheckCircle2,
  XCircle,
  Store,
  Globe,
  Users,
  Megaphone,
  PenLine,
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

const STAGES: { key: Lead["stage"]; label: string; badgeClass: string; dotColor: string; lineColor: string }[] = [
  { key: "new_lead", label: "New Lead", badgeClass: "bg-gray-100 text-gray-700 dark:bg-gray-700/20 dark:text-gray-300", dotColor: "bg-gray-400", lineColor: "bg-gray-300 dark:bg-gray-600" },
  { key: "engaged", label: "Engaged", badgeClass: "bg-[#eff6ff] text-[#1d4ed8] dark:bg-[#1d4ed8]/10 dark:text-[#60a5fa]", dotColor: "bg-[#1d4ed8]", lineColor: "bg-[#93c5fd] dark:bg-[#1d4ed8]/40" },
  { key: "pitched", label: "Pitched", badgeClass: "bg-[#fff8e6] text-[#d39c3d] dark:bg-[#d39c3d]/10 dark:text-[#ffbe4c]", dotColor: "bg-[#d39c3d]", lineColor: "bg-[#fcd34d] dark:bg-[#d39c3d]/40" },
  { key: "converted", label: "Converted", badgeClass: "bg-[#effefa] text-[#40c4aa] dark:bg-[#40c4aa]/10 dark:text-[#40c4aa]", dotColor: "bg-[#40c4aa]", lineColor: "bg-[#6ee7b7] dark:bg-[#40c4aa]/40" },
  { key: "churned", label: "Churned", badgeClass: "bg-[#fff0f3] text-[#df1c41] dark:bg-[#df1c41]/10 dark:text-[#df1c41]", dotColor: "bg-[#df1c41]", lineColor: "bg-[#fca5a5] dark:bg-[#df1c41]/40" },
]

const PRIORITIES: { key: Lead["priority"]; label: string; dotColor: string }[] = [
  { key: "low", label: "Low", dotColor: "bg-gray-400" },
  { key: "medium", label: "Medium", dotColor: "bg-amber-400" },
  { key: "high", label: "High", dotColor: "bg-red-500" },
]

const SOURCES: { key: Lead["source"]; label: string; icon: React.ReactNode }[] = [
  { key: "organic", label: "Organic", icon: <Globe className="w-3 h-3" /> },
  { key: "referral", label: "Referral", icon: <Users className="w-3 h-3" /> },
  { key: "campaign", label: "Campaign", icon: <Megaphone className="w-3 h-3" /> },
  { key: "manual", label: "Manual", icon: <PenLine className="w-3 h-3" /> },
]

function getStageBadge(stage: Lead["stage"]) {
  const s = STAGES.find((s) => s.key === stage)
  if (!s) return null
  return <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", s.badgeClass)}>{s.label}</span>
}

function getPriorityDot(priority: Lead["priority"]) {
  const p = PRIORITIES.find((p) => p.key === priority)
  if (!p) return null
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("w-2 h-2 rounded-full", p.dotColor)} />
      <span className="text-sm text-muted-foreground">{p.label}</span>
    </div>
  )
}

function getSourceBadge(source: Lead["source"]) {
  const s = SOURCES.find((s) => s.key === source)
  if (!s) return null
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
      {s.icon} {s.label}
    </span>
  )
}

function getInitials(name: string | null) {
  if (!name) return "?"
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  const { hasPermission: canEdit } = useHasPermission("leads.edit")

  const id = params.id as string

  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [notes, setNotes] = useState("")
  const [saving, setSaving] = useState(false)

  const fetchLead = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/leads")
      if (!response.ok) throw new Error("Failed to fetch leads")
      const data = await response.json()
      const allLeads: Lead[] = data.leads || []
      const found = allLeads.find((l) => l.user_id === id)
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
      const response = await fetch("/api/admin/leads", {
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border rounded-lg shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-56" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-card border rounded-lg shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none p-6 space-y-4">
              <Skeleton className="h-5 w-40" />
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={cn("border rounded-lg p-4 space-y-3", i === 5 && "col-span-2")}>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border rounded-lg shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none p-6 space-y-4">
              <Skeleton className="h-5 w-36" />
              <div className="flex items-center gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    {i < 5 && <Skeleton className="h-1 w-12" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border rounded-lg shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none p-6 space-y-4">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (notFound || !lead) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.push("/admin/leads")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Leads
        </button>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-1">Lead Not Found</h2>
          <p className="text-sm text-muted-foreground mb-4">The lead you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Button onClick={() => router.push("/admin/leads")} variant="outline">
            Return to Leads
          </Button>
        </div>
      </div>
    )
  }

  const currentStageIndex = STAGES.findIndex((s) => s.key === lead.stage)

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => router.push("/admin/leads")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Leads
        </button>
        <h1 className="text-xl font-semibold leading-[1.35] tracking-tight text-foreground">
          {lead.full_name || "Unknown Lead"}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">{lead.email}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border rounded-lg shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none p-6">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-lg font-medium text-muted-foreground shrink-0 overflow-hidden">
                {lead.avatar_url ? (
                  <img src={lead.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  getInitials(lead.full_name)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-foreground">{lead.full_name || "Unknown"}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{lead.email}</p>
                <div className="flex items-center gap-2 flex-wrap mt-3">
                  <Badge variant={lead.account_type === "pro" ? "default" : "secondary"} className="text-xs">
                    {lead.plan_name}
                  </Badge>
                  {getStageBadge(lead.stage)}
                  {getPriorityDot(lead.priority)}
                </div>
                <div className="flex items-center gap-3 flex-wrap mt-3 text-xs text-muted-foreground">
                  {getSourceBadge(lead.source)}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Signed up {lead.signup_date ? format(new Date(lead.signup_date), "MMM d, yyyy") : "—"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Active {lead.last_active ? format(new Date(lead.last_active), "MMM d, yyyy") : "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-lg shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Engagement Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
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
                  <span className="text-sm font-semibold text-foreground">{lead.engagement_score}</span>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                  <BookOpen className="w-3.5 h-3.5" />
                  Onboarding Progress
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#40c4aa] rounded-full transition-all"
                      style={{ width: `${lead.onboarding_progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{lead.onboarding_progress}%</span>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Saved Products
                </div>
                <p className="text-lg font-semibold text-foreground">{lead.saved_products}</p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                  <Store className="w-3.5 h-3.5" />
                  Shopify Connected
                </div>
                <div className="flex items-center gap-2">
                  {lead.has_shopify ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-[#40c4aa]" />
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

              <div className="border rounded-lg p-4 col-span-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                  <Map className="w-3.5 h-3.5" />
                  Roadmap Progress
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1d4ed8] rounded-full transition-all"
                      style={{ width: `${lead.roadmap_progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{lead.roadmap_progress}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-lg shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none p-6">
            <h3 className="text-sm font-semibold text-foreground mb-5">Stage Progression</h3>
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
                            ? cn(stage.dotColor, "border-transparent text-white")
                            : isActive
                            ? "bg-muted border-muted-foreground/30 text-foreground"
                            : "bg-card border-muted-foreground/20 text-muted-foreground"
                        )}
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
                        index < currentStageIndex ? stage.lineColor : "bg-muted"
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
                    <button
                      key={stage.key}
                      disabled={saving || lead.stage === stage.key}
                      onClick={() => updateLead({ stage: stage.key })}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium border transition-all disabled:opacity-50",
                        lead.stage === stage.key
                          ? "bg-primary text-white border-primary"
                          : "bg-card border hover:bg-muted/50 text-foreground"
                      )}
                    >
                      {stage.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border rounded-lg shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                disabled={saving || !canEdit}
                onClick={() => updateLead({ last_contacted_at: new Date().toISOString() })}
              >
                <Mail className="w-4 h-4" />
                Mark as Contacted
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => router.push(`/admin/external-users/${lead.user_id}`)}
              >
                <User className="w-4 h-4" />
                View Full Profile
              </Button>
            </div>

            <div className="mt-5">
              <p className="text-xs text-muted-foreground mb-2">Priority</p>
              <div className="flex items-center gap-2">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.key}
                    disabled={saving || !canEdit}
                    onClick={() => updateLead({ priority: p.key })}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all disabled:opacity-50",
                      lead.priority === p.key
                        ? "bg-primary text-white border-primary"
                        : "bg-card border hover:bg-muted/50 text-foreground"
                    )}
                  >
                    <span className={cn("w-2 h-2 rounded-full", lead.priority === p.key ? "bg-white" : p.dotColor)} />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs text-muted-foreground mb-2">Source</p>
              <div className="flex items-center gap-2 flex-wrap">
                {SOURCES.map((s) => (
                  <button
                    key={s.key}
                    disabled={saving || !canEdit}
                    onClick={() => updateLead({ source: s.key })}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all disabled:opacity-50",
                      lead.source === s.key
                        ? "bg-primary text-white border-primary"
                        : "bg-card border hover:bg-muted/50 text-foreground"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-lg shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Notes</h3>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this lead..."
              rows={4}
              className="resize-none"
              disabled={!canEdit}
            />
            <Button
              className="mt-3 w-full"
              size="sm"
              disabled={saving || !canEdit || notes === (lead.notes || "")}
              onClick={() => updateLead({ notes })}
            >
              {saving ? "Saving..." : "Save Notes"}
            </Button>
          </div>

          <div className="bg-card border rounded-lg shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Activity Info</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Signup Date</p>
                  <p className="text-sm font-medium text-foreground">
                    {lead.signup_date ? format(new Date(lead.signup_date), "MMM d, yyyy") : "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Active</p>
                  <p className="text-sm font-medium text-foreground">
                    {lead.last_active ? format(new Date(lead.last_active), "MMM d, yyyy") : "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Contacted</p>
                  <p className="text-sm font-medium text-foreground">
                    {lead.last_contacted_at ? format(new Date(lead.last_contacted_at), "MMM d, yyyy") : "Never"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Subscription Status</p>
                  <p className="text-sm font-medium text-foreground capitalize">
                    {lead.subscription_status || "None"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
