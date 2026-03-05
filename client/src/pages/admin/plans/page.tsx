import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  FormDialog,
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
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newName, setNewName] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newPrice, setNewPrice] = useState("")
  const [newFeatures, setNewFeatures] = useState("")

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

  const handleCreatePlan = useCallback(async () => {
    try {
      setIsSubmitting(true)
      const response = await apiFetch("/api/admin/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          description: newDescription,
          price: Number(newPrice),
          features: newFeatures.split(',').map(f => f.trim()).filter(Boolean),
        }),
      })
      if (!response.ok) throw new Error("Failed to create plan")
      showSuccess("Plan created successfully")
      setShowAddDialog(false)
      setNewName("")
      setNewDescription("")
      setNewPrice("")
      setNewFeatures("")
      fetchPlans()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to create plan")
    } finally {
      setIsSubmitting(false)
    }
  }, [newName, newDescription, newPrice, newFeatures, fetchPlans, showSuccess, showError])

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
          <Button size="sm" data-testid="button-create-plan" onClick={() => setShowAddDialog(true)}>
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
          onAction={() => setShowAddDialog(true)}
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

      <FormDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        title="Create Plan"
        onSubmit={handleCreatePlan}
        submitLabel="Create"
        isSubmitting={isSubmitting}
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="plan-name">Name</Label>
          <Input
            id="plan-name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Pro Plan"
            data-testid="input-plan-name"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="plan-description">Description</Label>
          <Input
            id="plan-description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Plan description"
            data-testid="input-plan-description"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="plan-price">Price</Label>
          <Input
            id="plan-price"
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            placeholder="0"
            data-testid="input-plan-price"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="plan-features">Features (comma-separated)</Label>
          <Input
            id="plan-features"
            value={newFeatures}
            onChange={(e) => setNewFeatures(e.target.value)}
            placeholder="Feature 1, Feature 2, Feature 3"
            data-testid="input-plan-features"
          />
        </div>
      </FormDialog>
    </PageShell>
  )
}
