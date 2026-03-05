import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Plus, CreditCard, CheckCircle2, Eye, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
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

interface PlanRow {
  id: string
  name: string
  slug: string
  priceMonthly: number
  active: boolean
  popular: boolean
  isPublic: boolean
  features: string[]
  displayOrder: number
}

export default function AdminPlansPage() {
  const { showSuccess, showError } = useToast()
  const [plans, setPlans] = useState<PlanRow[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiFetch("/api/admin/plans")
      if (!response.ok) throw new Error("Failed to fetch plans")
      const data = await response.json()
      setPlans(data.map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        priceMonthly: p.priceMonthly,
        active: p.active,
        popular: p.popular,
        isPublic: p.isPublic,
        features: p.features || [],
        displayOrder: p.displayOrder,
      })))
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to load plans")
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => { fetchPlans() }, [fetchPlans])

  const handleToggleActive = useCallback(async (plan: PlanRow) => {
    try {
      const response = await apiFetch(`/api/admin/plans/${plan.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !plan.active }),
      })
      if (!response.ok) throw new Error("Failed to update plan")
      showSuccess(`Plan "${plan.name}" ${plan.active ? "deactivated" : "activated"}`)
      fetchPlans()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to update plan")
    }
  }, [fetchPlans, showSuccess, showError])

  const activePlans = plans.filter(p => p.active).length
  const publicPlans = plans.filter(p => p.isPublic).length

  const columns: Column<PlanRow>[] = [
    {
      key: "name",
      header: "Plan Name",
      sortable: true,
      render: (plan) => (
        <div>
          <span className="text-sm font-medium" data-testid={`text-name-${plan.id}`}>{plan.name}</span>
          <p className="text-xs text-muted-foreground">{plan.slug}</p>
        </div>
      ),
    },
    {
      key: "priceMonthly",
      header: "Price",
      sortable: true,
      render: (plan) => (
        <span className="text-sm font-medium" data-testid={`text-price-${plan.id}`}>
          {plan.priceMonthly === 0 ? "Free" : `$${plan.priceMonthly.toFixed(2)}/mo`}
        </span>
      ),
    },
    {
      key: "active",
      header: "Active",
      render: (plan) => <StatusBadge status={plan.active ? "Active" : "Inactive"} />,
    },
    {
      key: "popular",
      header: "Popular",
      render: (plan) => <StatusBadge status={plan.popular ? "Yes" : "No"} />,
    },
  ]

  const rowActions: RowAction<PlanRow>[] = [
    { label: "View Details", onClick: (plan) => window.location.href = `/admin/plans/${plan.id}` },
    { label: "Edit", onClick: (plan) => window.location.href = `/admin/plans/${plan.id}` },
    { label: "Toggle Active", onClick: handleToggleActive },
  ]

  return (
    <PageShell>
      <PageHeader
        title="Plans"
        subtitle="Manage subscription plans, pricing, and features"
        actions={
          <Button size="sm" data-testid="button-create-plan">
            <Plus className="h-4 w-4 mr-1.5" />
            Create Plan
          </Button>
        }
      />

      <StatGrid>
        <StatCard label="Total Plans" value={plans.length} icon={CreditCard} />
        <StatCard label="Active" value={activePlans} icon={CheckCircle2} trend={`${plans.length > 0 ? Math.round((activePlans / plans.length) * 100) : 0}%`} />
        <StatCard label="Inactive" value={plans.length - activePlans} icon={AlertCircle} />
        <StatCard label="Public" value={publicPlans} icon={Eye} />
      </StatGrid>

      {!loading && plans.length === 0 ? (
        <EmptyState
          title="No plans yet"
          description="Create your first subscription plan to get started."
          actionLabel="Create Plan"
          onAction={() => {}}
        />
      ) : (
        <DataTable
          data={plans}
          columns={columns}
          rowActions={rowActions}
          searchPlaceholder="Search plans..."
          isLoading={loading}
          emptyTitle="No plans found"
          emptyDescription="Try adjusting your search."
        />
      )}
    </PageShell>
  )
}
