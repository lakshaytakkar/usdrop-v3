import { apiFetch } from "@/lib/supabase"
import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "@/hooks/use-router"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { ArrowLeft, Mail, User } from "lucide-react"
import {
  PageShell,
  PageHeader,
  DetailSection,
  InfoRow,
  StatusBadge,
  SectionGrid,
  SectionCard,
} from "@/components/admin-shared"

interface Lead {
  id: string
  user_id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  plan_name: string
  account_type: string
  stage: string
  source: string
  priority: string
  notes: string | null
  last_contacted_at: string | null
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

function getInitials(name: string | null) {
  if (!name) return "?"
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  const id = params.id as string

  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState("")
  const [saving, setSaving] = useState(false)

  const fetchLead = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiFetch("/api/admin/leads")
      if (!response.ok) throw new Error("Failed to fetch leads")
      const data = await response.json()
      const found = (data.leads || []).find((l: Lead) => l.user_id === id)
      if (found) {
        setLead(found)
        setNotes(found.notes || "")
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to load lead")
    } finally {
      setLoading(false)
    }
  }, [id, showError])

  useEffect(() => { fetchLead() }, [fetchLead])

  const updateLead = useCallback(async (updates: Record<string, unknown>) => {
    setSaving(true)
    try {
      const response = await apiFetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: id, ...updates }),
      })
      if (!response.ok) throw new Error("Failed to update lead")
      showSuccess("Lead updated")
      fetchLead()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to update lead")
    } finally {
      setSaving(false)
    }
  }, [id, fetchLead, showSuccess, showError])

  if (loading) {
    return (
      <PageShell>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </PageShell>
    )
  }

  if (!lead) {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <User className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold mb-1" data-testid="text-not-found">Lead Not Found</h2>
          <p className="text-sm text-muted-foreground mb-4">The lead doesn&apos;t exist or has been removed.</p>
          <Button onClick={() => router.push("/admin/leads")} variant="outline" data-testid="button-return-leads">
            Return to Leads
          </Button>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin/leads")} data-testid="button-back">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Leads
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarImage src={lead.avatar_url || undefined} alt={lead.full_name || ""} />
          <AvatarFallback>{getInitials(lead.full_name)}</AvatarFallback>
        </Avatar>
        <div>
          <PageHeader title={lead.full_name || "Unknown"} subtitle={lead.email} />
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <StatusBadge status={lead.stage} />
        <StatusBadge status={lead.priority} />
        <StatusBadge status={lead.account_type} />
      </div>

      <SectionGrid>
        <div className="space-y-6">
          <DetailSection title="Contact Information">
            <InfoRow label="Email" value={lead.email} />
            <InfoRow label="Plan" value={lead.plan_name} />
            <InfoRow label="Source" value={lead.source} />
            <InfoRow label="Signed Up" value={lead.signup_date ? format(new Date(lead.signup_date), "MMM d, yyyy") : "N/A"} />
            <InfoRow label="Last Active" value={lead.last_active ? format(new Date(lead.last_active), "MMM d, yyyy") : "N/A"} />
            <InfoRow label="Last Contacted" value={lead.last_contacted_at ? format(new Date(lead.last_contacted_at), "MMM d, yyyy") : "Never"} />
          </DetailSection>

          <DetailSection title="Engagement Metrics">
            <InfoRow label="Engagement Score" value={lead.engagement_score} />
            <InfoRow label="Onboarding Progress" value={`${lead.onboarding_progress}%`} />
            <InfoRow label="Onboarding Completed" value={lead.onboarding_completed ? "Yes" : "No"} />
            <InfoRow label="Saved Products" value={lead.saved_products} />
            <InfoRow label="Shopify Connected" value={lead.has_shopify ? "Yes" : "No"} />
            <InfoRow label="Roadmap Progress" value={`${lead.roadmap_progress}%`} />
          </DetailSection>
        </div>

        <div className="space-y-6">
          <SectionCard title="Quick Actions">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              disabled={saving}
              onClick={() => updateLead({ last_contacted_at: new Date().toISOString() })}
              data-testid="button-mark-contacted"
            >
              <Mail className="w-4 h-4" />
              Mark as Contacted
            </Button>
          </SectionCard>

          <SectionCard title="Admin Notes">
            <div className="space-y-3">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this lead..."
                rows={6}
                className="resize-none"
                data-testid="input-notes"
              />
              <Button
                className="w-full"
                size="sm"
                disabled={saving || notes === (lead.notes || "")}
                onClick={() => updateLead({ notes })}
                data-testid="button-save-notes"
              >
                {saving ? "Saving..." : "Save Notes"}
              </Button>
            </div>
          </SectionCard>

          <SectionCard title="Activity Info">
            <div className="space-y-2">
              <InfoRow label="Subscription" value={lead.subscription_status || "None"} />
              <InfoRow label="Account Type">
                <StatusBadge status={lead.account_type} />
              </InfoRow>
            </div>
          </SectionCard>
        </div>
      </SectionGrid>
    </PageShell>
  )
}
