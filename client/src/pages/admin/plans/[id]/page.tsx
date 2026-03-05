import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "@/hooks/use-router"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Trash2, Check, DollarSign, Calendar, Users, Star, Eye, EyeOff, Lock, Unlock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  PageShell,
  PageHeader,
  DetailSection,
  InfoRow,
  StatusBadge,
  SectionGrid,
  SectionCard,
} from "@/components/admin-shared"

interface Plan {
  id: string
  name: string
  slug: string
  description: string | null
  priceMonthly: number
  priceAnnual: number | null
  priceYearly: number | null
  features: string[]
  popular: boolean
  active: boolean
  isPublic: boolean
  displayOrder: number
  keyPointers: string | null
  trialDays: number
  createdAt: string | null
  updatedAt: string | null
}

export default function PlanDetailPage() {
  const router = useRouter()
  const params = useParams()
  const planId = params?.id as string
  const { showSuccess, showError } = useToast()

  const [plan, setPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchPlan = useCallback(async () => {
    if (!planId) return
    try {
      setLoading(true)
      const response = await apiFetch(`/api/admin/plans/${planId}`)
      if (!response.ok) {
        if (response.status === 404) { setPlan(null); return }
        throw new Error("Failed to fetch plan")
      }
      const data = await response.json()
      setPlan(data)
    } catch (err) {
      showError("Failed to load plan")
      setPlan(null)
    } finally {
      setLoading(false)
    }
  }, [planId, showError])

  useEffect(() => { fetchPlan() }, [fetchPlan])

  const handleToggleActive = async () => {
    if (!plan) return
    try {
      const response = await apiFetch(`/api/admin/plans/${plan.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !plan.active }),
      })
      if (!response.ok) throw new Error("Failed to update plan")
      showSuccess(`Plan ${plan.active ? "deactivated" : "activated"}`)
      fetchPlan()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to update plan")
    }
  }

  const handleDelete = async () => {
    if (!plan) return
    try {
      const response = await apiFetch(`/api/admin/plans/${plan.id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete plan")
      showSuccess(`Plan "${plan.name}" deleted`)
      router.push("/admin/plans")
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to delete plan")
    }
  }

  const formatPrice = (price: number) => price === 0 ? "Free" : `$${price.toFixed(2)}`
  const formatDate = (date: string | null) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

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

  if (!plan) {
    return (
      <PageShell>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Plan not found</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/admin/plans")} data-testid="button-back">
            Back to Plans
          </Button>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin/plans")} data-testid="button-back">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Plans
        </Button>
      </div>

      <PageHeader
        title={plan.name}
        subtitle={plan.slug}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleToggleActive} data-testid="button-toggle-active">
              {plan.active ? <Lock className="h-4 w-4 mr-1.5" /> : <Unlock className="h-4 w-4 mr-1.5" />}
              {plan.active ? "Deactivate" : "Activate"}
            </Button>
            <Button variant="outline" size="sm" data-testid="button-edit">
              <Edit className="h-4 w-4 mr-1.5" />
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete} data-testid="button-delete">
              <Trash2 className="h-4 w-4 mr-1.5" />
              Delete
            </Button>
          </div>
        }
      />

      <div className="flex items-center gap-2 flex-wrap">
        <StatusBadge status={plan.active ? "Active" : "Inactive"} />
        <StatusBadge status={plan.isPublic ? "Public" : "Private"} variant={plan.isPublic ? "info" : "neutral"} />
        {plan.popular && <StatusBadge status="Popular" variant="success" />}
      </div>

      <SectionGrid>
        <div className="space-y-6">
          <DetailSection title="Pricing">
            <InfoRow label="Monthly Price" value={formatPrice(plan.priceMonthly)} />
            {plan.priceAnnual != null && <InfoRow label="Annual Price" value={`$${plan.priceAnnual.toFixed(2)}/year`} />}
            {plan.priceYearly != null && <InfoRow label="Yearly Price" value={`$${plan.priceYearly.toFixed(2)}/year`} />}
            {plan.trialDays > 0 && <InfoRow label="Trial Days" value={plan.trialDays} />}
          </DetailSection>

          <SectionCard title={`Features (${plan.features?.length || 0})`}>
            {plan.features && plan.features.length > 0 ? (
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-sm" data-testid={`text-feature-${index}`}>
                    <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No features configured</p>
            )}
          </SectionCard>

          {plan.description && (
            <SectionCard title="Description">
              <p className="text-sm text-muted-foreground" data-testid="text-description">{plan.description}</p>
            </SectionCard>
          )}
        </div>

        <div className="space-y-6">
          <DetailSection title="Plan Details">
            <InfoRow label="Slug" value={plan.slug} />
            <InfoRow label="Display Order" value={plan.displayOrder} />
            <InfoRow label="Status">
              <StatusBadge status={plan.active ? "Active" : "Inactive"} />
            </InfoRow>
            <InfoRow label="Visibility">
              <StatusBadge status={plan.isPublic ? "Public" : "Private"} variant={plan.isPublic ? "info" : "neutral"} />
            </InfoRow>
            <InfoRow label="Created" value={formatDate(plan.createdAt)} />
            <InfoRow label="Updated" value={formatDate(plan.updatedAt)} />
          </DetailSection>

          {plan.keyPointers && (
            <SectionCard title="Key Pointers">
              <p className="text-sm" data-testid="text-key-pointers">{plan.keyPointers}</p>
            </SectionCard>
          )}
        </div>
      </SectionGrid>
    </PageShell>
  )
}
