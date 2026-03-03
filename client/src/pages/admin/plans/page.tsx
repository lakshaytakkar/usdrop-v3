import { apiFetch } from '@/lib/supabase'
import { useState, useMemo, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Trash2, Lock, Eye, Check, EyeOff, AlertCircle, X, Star, DollarSign, Calendar, Edit, RefreshCw, CreditCard, CheckCircle2, Copy } from "lucide-react"
import { DataTable } from "@/components/data-table/data-table"
import { createPlansColumns } from "./components/plans-columns"
import { SubscriptionPlan, PlanFormData } from "@/types/admin/plans"
import type { SortingState, ColumnFiltersState } from "@tanstack/react-table"
import { LargeModal } from "@/components/ui/large-modal"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Loader } from "@/components/ui/loader"
import { useToast } from "@/hooks/use-toast"
import { generateSlugFromName, validatePlanSlug } from "@/lib/utils/plan-helpers"
import {
  AdminPageHeader,
  AdminStatCards,
  AdminFilterBar,
  AdminActionBar,
  AdminEmptyState,
} from "@/components/admin"

const defaultFormData: PlanFormData = {
  name: "",
  slug: "",
  description: "",
  priceMonthly: 0,
  priceAnnual: undefined,
  priceYearly: undefined,
  features: [],
  popular: false,
  active: true,
  isPublic: true,
  displayOrder: 0,
  keyPointers: "",
  trialDays: 0,
}

export default function AdminPlansPage() {
  const { showSuccess, showError } = useToast()

  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [filters, setFilters] = useState<ColumnFiltersState>([])
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [selectedPlanForQuickView, setSelectedPlanForQuickView] = useState<SubscriptionPlan | null>(null)
  const [selectedPlans, setSelectedPlans] = useState<SubscriptionPlan[]>([])
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [formData, setFormData] = useState<PlanFormData>({ ...defaultFormData })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [formLoading, setFormLoading] = useState(false)

  const activePlans = useMemo(() => plans.filter(p => p.active), [plans])
  const inactivePlans = useMemo(() => plans.filter(p => !p.active), [plans])
  const publicPlans = useMemo(() => plans.filter(p => p.isPublic), [plans])

  const filteredPlans = useMemo(() => {
    let result = plans

    if (activeTab === "active") result = activePlans
    else if (activeTab === "inactive") result = inactivePlans
    else if (activeTab === "public") result = publicPlans

    if (search) {
      const s = search.toLowerCase()
      result = result.filter(
        (plan) =>
          plan.name.toLowerCase().includes(s) ||
          plan.slug.toLowerCase().includes(s) ||
          (plan.description && plan.description.toLowerCase().includes(s))
      )
    }

    filters.forEach((filter) => {
      if (filter.id === "active" && Array.isArray(filter.value) && filter.value.length > 0) {
        const isActive = filter.value.includes("active")
        const isInactive = filter.value.includes("inactive")
        result = result.filter((plan) => {
          if (isActive && !plan.active) return false
          if (isInactive && plan.active) return false
          return true
        })
      }
    })

    return result
  }, [plans, search, filters, activeTab, activePlans, inactivePlans, publicPlans])

  const paginatedPlans = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredPlans.slice(start, start + pageSize)
  }, [filteredPlans, page, pageSize])

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiFetch("/api/admin/plans")
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch plans")
      }
      const data = await response.json()
      const plansData: SubscriptionPlan[] = data.map((plan: any) => ({
        ...plan,
        createdAt: plan.createdAt ? new Date(plan.createdAt) : null,
        updatedAt: plan.updatedAt ? new Date(plan.updatedAt) : null,
      }))
      setPlans(plansData)
    } catch (err) {
      console.error("Error fetching plans:", err)
      showError(err instanceof Error ? err.message : "Failed to load plans.")
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }, [showError])

  useEffect(() => { fetchPlans() }, [fetchPlans])

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredPlans.length / pageSize))
    setPageCount(totalPages)
    if (page > totalPages && totalPages > 0) setPage(1)
  }, [filteredPlans.length, pageSize, page])

  const handleViewDetails = useCallback((plan: SubscriptionPlan) => {
    setSelectedPlanForQuickView(plan)
    setQuickViewOpen(true)
  }, [])

  const handleEdit = useCallback((plan: SubscriptionPlan) => {
    setEditingPlan(plan)
    setFormData({
      name: plan.name,
      slug: plan.slug,
      description: plan.description || "",
      priceMonthly: plan.priceMonthly,
      priceAnnual: plan.priceAnnual ?? undefined,
      priceYearly: plan.priceYearly ?? undefined,
      features: plan.features || [],
      popular: plan.popular,
      active: plan.active,
      isPublic: plan.isPublic,
      displayOrder: plan.displayOrder,
      keyPointers: plan.keyPointers || "",
      trialDays: plan.trialDays,
    })
    setFormErrors({})
    setFormOpen(true)
  }, [])

  const handleDuplicate = useCallback((plan: SubscriptionPlan) => {
    setEditingPlan(null)
    setFormData({
      name: `${plan.name} (Copy)`,
      slug: `${plan.slug}-copy`,
      description: plan.description || "",
      priceMonthly: plan.priceMonthly,
      priceAnnual: plan.priceAnnual ?? undefined,
      priceYearly: plan.priceYearly ?? undefined,
      features: [...(plan.features || [])],
      popular: false,
      active: false,
      isPublic: plan.isPublic,
      displayOrder: plan.displayOrder + 1,
      keyPointers: plan.keyPointers || "",
      trialDays: plan.trialDays,
    })
    setFormErrors({})
    setFormOpen(true)
  }, [])

  const handleDelete = useCallback((plan: SubscriptionPlan) => {
    setPlanToDelete(plan)
    setDeleteConfirmOpen(true)
  }, [])

  const handleToggleActive = useCallback(async (plan: SubscriptionPlan) => {
    setActionLoading(`toggle-active-${plan.id}`)
    try {
      const response = await apiFetch(`/api/admin/plans/${plan.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !plan.active }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update plan")
      }
      await fetchPlans()
      showSuccess(`Plan "${plan.name}" ${plan.active ? "deactivated" : "activated"}`)
    } catch (err) {
      console.error("Error toggling plan:", err)
      showError(err instanceof Error ? err.message : "Failed to update plan.")
    } finally {
      setActionLoading(null)
    }
  }, [fetchPlans, showError, showSuccess])

  const handleTogglePublic = useCallback(async (plan: SubscriptionPlan) => {
    setActionLoading(`toggle-public-${plan.id}`)
    try {
      const response = await apiFetch(`/api/admin/plans/${plan.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: !plan.isPublic }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update plan")
      }
      await fetchPlans()
      showSuccess(`Plan "${plan.name}" is now ${plan.isPublic ? "private" : "public"}`)
    } catch (err) {
      console.error("Error toggling plan visibility:", err)
      showError(err instanceof Error ? err.message : "Failed to update plan.")
    } finally {
      setActionLoading(null)
    }
  }, [fetchPlans, showError, showSuccess])

  const confirmDelete = async () => {
    if (!planToDelete) return
    setActionLoading("delete")
    try {
      const response = await apiFetch(`/api/admin/plans/${planToDelete.id}`, { method: "DELETE" })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete plan")
      }
      const result = await response.json()
      setDeleteConfirmOpen(false)
      setPlanToDelete(null)
      showSuccess(result.message || `Plan "${planToDelete.name}" deleted`)
      await fetchPlans()
    } catch (err) {
      console.error("Error deleting plan:", err)
      showError(err instanceof Error ? err.message : "Failed to delete plan.")
    } finally {
      setActionLoading(null)
    }
  }

  const handleFormSubmit = async (e?: React.FormEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation() }

    const errors: Record<string, string> = {}
    if (!formData.name?.trim()) errors.name = "Name is required"
    if (!formData.slug?.trim()) {
      errors.slug = "Slug is required"
    } else if (!validatePlanSlug(formData.slug)) {
      errors.slug = "Slug must be lowercase, alphanumeric, hyphens/underscores only"
    } else {
      const dup = plans.find(p => p.slug.toLowerCase() === formData.slug.toLowerCase() && p.id !== editingPlan?.id)
      if (dup) errors.slug = "This slug is already in use"
    }
    if (formData.priceMonthly === undefined || formData.priceMonthly < 0) errors.priceMonthly = "Monthly price must be 0 or greater"
    if (formData.priceAnnual !== undefined && formData.priceAnnual !== null && formData.priceAnnual < 0) errors.priceAnnual = "Annual price must be 0 or greater"
    if (formData.trialDays < 0) errors.trialDays = "Trial days must be 0 or greater"

    const validFeatures = (formData.features || []).filter(f => f?.trim())
    if (validFeatures.length === 0) errors.features = "At least one feature is required"

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setFormLoading(true)
    try {
      const finalSlug = formData.slug || generateSlugFromName(formData.name)
      const requestBody = {
        name: formData.name.trim(),
        slug: finalSlug,
        description: formData.description?.trim() || undefined,
        priceMonthly: Number(formData.priceMonthly),
        priceAnnual: formData.priceAnnual != null ? Number(formData.priceAnnual) : undefined,
        priceYearly: formData.priceYearly != null ? Number(formData.priceYearly) : undefined,
        features: validFeatures,
        popular: Boolean(formData.popular),
        active: Boolean(formData.active),
        isPublic: Boolean(formData.isPublic),
        displayOrder: Number(formData.displayOrder),
        keyPointers: formData.keyPointers?.trim() || undefined,
        trialDays: Number(formData.trialDays),
      }

      const response = editingPlan
        ? await apiFetch(`/api/admin/plans/${editingPlan.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) })
        : await apiFetch("/api/admin/plans", { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `Server error: ${response.status}` }))
        throw new Error(errorData.error || `Failed to save plan: ${response.status}`)
      }

      const planData = await response.json()
      setFormOpen(false)
      setEditingPlan(null)
      setFormData({ ...defaultFormData })
      setFormErrors({})
      await fetchPlans()
      showSuccess(editingPlan ? `Plan "${planData.name}" updated` : `Plan "${planData.name}" created`)
    } catch (err) {
      console.error("Error saving plan:", err)
      showError(err instanceof Error ? err.message : "Failed to save plan.")
    } finally {
      setFormLoading(false)
    }
  }

  const handleBulkAction = useCallback(async (action: "delete" | "activate" | "deactivate") => {
    setActionLoading(action)
    try {
      let successCount = 0
      let failedCount = 0
      for (const plan of selectedPlans) {
        try {
          const opts: RequestInit = action === "delete"
            ? { method: "DELETE" }
            : { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: action === "activate" }) }
          const response = await apiFetch(`/api/admin/plans/${plan.id}`, opts)
          if (!response.ok) throw new Error()
          successCount++
        } catch { failedCount++ }
      }
      if (failedCount > 0) showError(`${failedCount} plan(s) failed. ${successCount} succeeded.`)
      else showSuccess(`${successCount} plan(s) ${action === "delete" ? "deleted" : action === "activate" ? "activated" : "deactivated"}`)
      setSelectedPlans([])
      await fetchPlans()
    } catch (err) {
      showError(`Failed to ${action} plans.`)
    } finally {
      setActionLoading(null)
    }
  }, [selectedPlans, fetchPlans, showSuccess, showError])

  const columns = useMemo(
    () => createPlansColumns({
      onViewDetails: handleViewDetails,
      onEdit: handleEdit,
      onDelete: handleDelete,
      onToggleActive: handleToggleActive,
      onTogglePublic: handleTogglePublic,
      onNameClick: handleViewDetails,
    }),
    [handleViewDetails, handleEdit, handleDelete, handleToggleActive, handleTogglePublic]
  )

  const handlePaginationChange = useCallback((p: number, s: number) => {
    if (p !== page) setPage(p)
    if (s !== pageSize) { setPageSize(s); setPage(1) }
  }, [page, pageSize])

  const handleRowSelectionChange = useCallback((selectedRows: SubscriptionPlan[]) => {
    setSelectedPlans(selectedRows)
  }, [])

  useEffect(() => {
    if (formOpen && !editingPlan) {
      setFormData({ ...defaultFormData })
      setFormErrors({})
    }
  }, [formOpen, editingPlan])

  const statCards = useMemo(() => [
    { label: "Total Plans", value: plans.length, icon: CreditCard, description: "All subscription plans" },
    { label: "Active", value: activePlans.length, icon: CheckCircle2, badge: plans.length > 0 ? `${Math.round((activePlans.length / plans.length) * 100)}%` : "0%", badgeVariant: "success" as const, description: "Currently active" },
    { label: "Inactive", value: inactivePlans.length, icon: AlertCircle, description: "Deactivated plans" },
    { label: "Public", value: publicPlans.length, icon: Eye, description: "Visible to users" },
  ], [plans, activePlans, inactivePlans, publicPlans])

  const filterTabs = useMemo(() => [
    { value: "all", label: "All", count: plans.length },
    { value: "active", label: "Active", count: activePlans.length },
    { value: "inactive", label: "Inactive", count: inactivePlans.length },
    { value: "public", label: "Public", count: publicPlans.length },
  ], [plans, activePlans, inactivePlans, publicPlans])

  const toolbarButtons = useMemo(() => [
    {
      label: "Refresh",
      icon: <RefreshCw className="h-4 w-4" />,
      onClick: async () => { await fetchPlans(); showSuccess("Plans refreshed") },
      variant: "outline" as const,
    },
  ], [fetchPlans, showSuccess])

  const filterConfig = [
    {
      columnId: "active",
      title: "Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
  ]

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden gap-4" data-testid="admin-plans-page">
      <AdminPageHeader
        title="Plans"
        description="Manage subscription plans, pricing, and features"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Plans" },
        ]}
        actions={[
          {
            label: "Create Plan",
            icon: <Plus className="h-4 w-4" />,
            onClick: () => { setEditingPlan(null); setFormOpen(true) },
          },
        ]}
      />

      <AdminStatCards stats={statCards} loading={initialLoading} columns={4} />

      {selectedPlans.length > 0 && (
        <AdminActionBar
          selectedCount={selectedPlans.length}
          onClearSelection={() => setSelectedPlans([])}
          actions={[
            { label: "Delete", icon: <Trash2 className="h-4 w-4" />, onClick: () => handleBulkAction("delete"), variant: "destructive", loading: actionLoading === "delete" },
            { label: "Activate", icon: <Check className="h-4 w-4" />, onClick: () => handleBulkAction("activate"), loading: actionLoading === "activate" },
            { label: "Deactivate", icon: <Lock className="h-4 w-4" />, onClick: () => handleBulkAction("deactivate"), loading: actionLoading === "deactivate" },
          ]}
        />
      )}

      <AdminFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search plans by name, slug..."
        tabs={filterTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {initialLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader size="lg" />
        </div>
      ) : plans.length === 0 ? (
        <AdminEmptyState
          icon={CreditCard}
          title="No plans yet"
          description="Create your first subscription plan to get started."
          actionLabel="Create Plan"
          onAction={() => { setEditingPlan(null); setFormOpen(true) }}
        />
      ) : (
        <DataTable
          columns={columns}
          data={paginatedPlans}
          pageCount={Math.max(1, pageCount)}
          onPaginationChange={handlePaginationChange}
          onSortingChange={setSorting}
          onFilterChange={setFilters}
          onSearchChange={() => {}}
          loading={loading}
          filterConfig={filterConfig}
          page={page}
          pageSize={pageSize}
          enableRowSelection={true}
          onRowSelectionChange={handleRowSelectionChange}
          onRowClick={handleViewDetails}
          secondaryButtons={toolbarButtons}
        />
      )}

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="pb-4">
            <DialogTitle>Delete Plan</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this plan? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {planToDelete && (
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Plan:</span> {planToDelete.name}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Slug:</span> {planToDelete.slug}
              </p>
            </div>
          )}
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} disabled={actionLoading === "delete"} data-testid="button-cancel-delete">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={actionLoading === "delete"} data-testid="button-confirm-delete">
              {actionLoading === "delete" ? <><Loader size="sm" className="mr-2" />Deleting...</> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPlan ? "Edit Plan" : "Create Plan"}</DialogTitle>
            <DialogDescription>
              {editingPlan ? "Update plan information, pricing, and features." : "Create a new subscription plan with pricing and features."}
            </DialogDescription>
          </DialogHeader>
          <form id="plan-form" onSubmit={(e) => { e.preventDefault(); handleFormSubmit(e) }} className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="plan-name">Name *</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent><p>Enter the plan name as it should appear to users</p></TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="plan-name"
                data-testid="input-plan-name"
                value={formData.name}
                onChange={(e) => {
                  const newName = e.target.value
                  setFormData({ ...formData, name: newName, slug: formData.slug || generateSlugFromName(newName) })
                  if (formErrors.name) setFormErrors({ ...formErrors, name: "" })
                }}
                placeholder="Enter plan name"
                className={formErrors.name ? "border-destructive" : ""}
              />
              {formErrors.name && <p className="text-xs text-destructive">{formErrors.name}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="plan-slug">Slug *</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent><p>URL-friendly identifier (lowercase, alphanumeric, hyphens/underscores only)</p></TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="plan-slug"
                data-testid="input-plan-slug"
                value={formData.slug}
                onChange={(e) => {
                  const newSlug = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '')
                  setFormData({ ...formData, slug: newSlug })
                  if (formErrors.slug) setFormErrors({ ...formErrors, slug: "" })
                }}
                placeholder="plan-slug"
                className={formErrors.slug ? "border-destructive" : ""}
              />
              {formErrors.slug && <p className="text-xs text-destructive">{formErrors.slug}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan-description">Description</Label>
              <Textarea
                id="plan-description"
                data-testid="input-plan-description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter plan description"
                rows={3}
              />
            </div>

            <div className="space-y-4 border-t pt-4">
              <h3 className="text-sm font-semibold">Pricing</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price-monthly">Monthly Price *</Label>
                  <Input
                    id="price-monthly"
                    data-testid="input-price-monthly"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.priceMonthly}
                    onChange={(e) => {
                      setFormData({ ...formData, priceMonthly: parseFloat(e.target.value) || 0 })
                      if (formErrors.priceMonthly) setFormErrors({ ...formErrors, priceMonthly: "" })
                    }}
                    placeholder="0.00"
                    className={formErrors.priceMonthly ? "border-destructive" : ""}
                  />
                  {formErrors.priceMonthly && <p className="text-xs text-destructive">{formErrors.priceMonthly}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price-annual">Annual Price</Label>
                  <Input
                    id="price-annual"
                    data-testid="input-price-annual"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.priceAnnual || ""}
                    onChange={(e) => setFormData({ ...formData, priceAnnual: e.target.value ? parseFloat(e.target.value) : undefined })}
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price-yearly">Yearly Price</Label>
                  <Input
                    id="price-yearly"
                    data-testid="input-price-yearly"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.priceYearly || ""}
                    onChange={(e) => setFormData({ ...formData, priceYearly: e.target.value ? parseFloat(e.target.value) : undefined })}
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h3 className="text-sm font-semibold">Features *</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFormData({ ...formData, features: [...(formData.features || []), ""] })
                    if (formErrors.features) setFormErrors({ ...formErrors, features: "" })
                  }}
                  data-testid="button-add-feature"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </div>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...formData.features]
                        newFeatures[index] = e.target.value
                        setFormData({ ...formData, features: newFeatures })
                        if (formErrors.features) {
                          if (newFeatures.some(f => f?.trim())) setFormErrors({ ...formErrors, features: "" })
                        }
                      }}
                      placeholder={`Feature ${index + 1}`}
                      className={formErrors.features ? "border-destructive" : ""}
                      data-testid={`input-feature-${index}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newFeatures = formData.features.filter((_, i) => i !== index)
                        setFormData({ ...formData, features: newFeatures })
                      }}
                      data-testid={`button-remove-feature-${index}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {formData.features.length === 0 && (
                  <p className="text-sm text-muted-foreground">No features added. Click &quot;Add Feature&quot; to add one.</p>
                )}
                {formErrors.features && <p className="text-xs text-destructive mt-1">{formErrors.features}</p>}
              </div>
            </div>

            <div className="space-y-4 border-t pt-4">
              <h3 className="text-sm font-semibold">Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="display-order">Display Order</Label>
                  <Input
                    id="display-order"
                    data-testid="input-display-order"
                    type="number"
                    min="0"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trial-days">Trial Days</Label>
                  <Input
                    id="trial-days"
                    data-testid="input-trial-days"
                    type="number"
                    min="0"
                    value={formData.trialDays}
                    onChange={(e) => setFormData({ ...formData, trialDays: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="key-pointers">Key Pointers</Label>
                <Textarea
                  id="key-pointers"
                  data-testid="input-key-pointers"
                  value={formData.keyPointers || ""}
                  onChange={(e) => setFormData({ ...formData, keyPointers: e.target.value })}
                  placeholder="Enter key selling points (optional)"
                  rows={2}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="popular" checked={formData.popular} onCheckedChange={(checked) => setFormData({ ...formData, popular: checked === true })} data-testid="checkbox-popular" />
                  <Label htmlFor="popular" className="cursor-pointer">Mark as Popular</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="active" checked={formData.active} onCheckedChange={(checked) => setFormData({ ...formData, active: checked === true })} data-testid="checkbox-active" />
                  <Label htmlFor="active" className="cursor-pointer">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="is-public" checked={formData.isPublic} onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked === true })} data-testid="checkbox-public" />
                  <Label htmlFor="is-public" className="cursor-pointer">Public (visible to users)</Label>
                </div>
              </div>
            </div>
          </form>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => { setFormOpen(false); setEditingPlan(null); setFormErrors({}) }}
              disabled={formLoading}
              data-testid="button-cancel-form"
            >
              Cancel
            </Button>
            <Button type="submit" form="plan-form" disabled={formLoading} data-testid="button-submit-form">
              {formLoading ? <><Loader size="sm" className="mr-2" />{editingPlan ? "Updating..." : "Creating..."}</> : (editingPlan ? "Update" : "Create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedPlanForQuickView && (
        <LargeModal
          open={quickViewOpen}
          onOpenChange={(open) => { setQuickViewOpen(open); if (!open) setSelectedPlanForQuickView(null) }}
          title={selectedPlanForQuickView.name}
          footer={
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => { setQuickViewOpen(false); handleDuplicate(selectedPlanForQuickView) }} data-testid="button-duplicate-plan">
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </Button>
              <Button variant="outline" onClick={() => { setQuickViewOpen(false); handleEdit(selectedPlanForQuickView) }} data-testid="button-edit-plan">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" onClick={() => setQuickViewOpen(false)} data-testid="button-close-modal">
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-4 overflow-y-auto">
            <Card>
              <CardHeader className="pb-2 px-4 pt-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded-lg bg-primary/5 border flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                        <CardTitle className="text-lg mb-0">{selectedPlanForQuickView.name}</CardTitle>
                        {selectedPlanForQuickView.popular && (
                          <Badge variant="default" className="gap-1 text-xs">
                            <Star className="h-3 w-3" />
                            Popular
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge variant={selectedPlanForQuickView.active ? "default" : "secondary"} className="text-xs">
                          {selectedPlanForQuickView.active ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant={selectedPlanForQuickView.isPublic ? "outline" : "secondary"} className="text-xs">
                          {selectedPlanForQuickView.isPublic ? "Public" : "Private"}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-mono">{selectedPlanForQuickView.slug}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
                <TabsTrigger value="features" data-testid="tab-features">Features ({selectedPlanForQuickView.features?.length || 0})</TabsTrigger>
                <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-2 mt-4">
                <Card>
                  <CardHeader className="pb-2 px-4 pt-3">
                    <CardTitle className="text-sm font-semibold">Pricing Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0 px-4 pb-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Monthly Price</p>
                        <p className="text-sm font-medium" data-testid="text-monthly-price">
                          {selectedPlanForQuickView.priceMonthly === 0 ? "Free" : `$${selectedPlanForQuickView.priceMonthly.toFixed(2)}/month`}
                        </p>
                      </div>
                    </div>
                    {selectedPlanForQuickView.priceAnnual != null && selectedPlanForQuickView.priceAnnual > 0 && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Annual Price</p>
                          <p className="text-sm font-medium" data-testid="text-annual-price">${selectedPlanForQuickView.priceAnnual.toFixed(2)}/year</p>
                        </div>
                      </div>
                    )}
                    {selectedPlanForQuickView.trialDays > 0 && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Trial Period</p>
                          <p className="text-sm font-medium" data-testid="text-trial-days">{selectedPlanForQuickView.trialDays} days</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {selectedPlanForQuickView.description && (
                  <Card>
                    <CardHeader className="pb-2 px-4 pt-3">
                      <CardTitle className="text-sm font-semibold">Description</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 px-4 pb-3">
                      <p className="text-sm text-muted-foreground" data-testid="text-description">{selectedPlanForQuickView.description}</p>
                    </CardContent>
                  </Card>
                )}

                {selectedPlanForQuickView.keyPointers && (
                  <Card>
                    <CardHeader className="pb-2 px-4 pt-3">
                      <CardTitle className="text-sm font-semibold">Key Pointers</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 px-4 pb-3">
                      <p className="text-sm font-medium" data-testid="text-key-pointers">{selectedPlanForQuickView.keyPointers}</p>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader className="pb-2 px-4 pt-3">
                    <CardTitle className="text-sm font-semibold">Plan Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0 px-4 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Display Order</span>
                      <span className="text-sm font-medium">{selectedPlanForQuickView.displayOrder}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Status</span>
                      <Badge variant={selectedPlanForQuickView.active ? "default" : "secondary"} className="text-xs">
                        {selectedPlanForQuickView.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Visibility</span>
                      <Badge variant={selectedPlanForQuickView.isPublic ? "outline" : "secondary"} className="text-xs">
                        {selectedPlanForQuickView.isPublic ? "Public" : "Private"}
                      </Badge>
                    </div>
                    {selectedPlanForQuickView.createdAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Created</span>
                        <span className="text-sm font-medium">
                          {new Date(selectedPlanForQuickView.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                        </span>
                      </div>
                    )}
                    {selectedPlanForQuickView.updatedAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Last Updated</span>
                        <span className="text-sm font-medium">
                          {new Date(selectedPlanForQuickView.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="space-y-2 mt-4">
                <Card>
                  <CardHeader className="pb-2 px-4 pt-3">
                    <CardTitle className="text-sm font-semibold">Plan Features</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 px-4 pb-3">
                    {selectedPlanForQuickView.features && selectedPlanForQuickView.features.length > 0 ? (
                      <ul className="space-y-1.5">
                        {selectedPlanForQuickView.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm" data-testid={`text-feature-${index}`}>
                            <Check className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No features configured</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-2 mt-4">
                <Card>
                  <CardHeader className="pb-2 px-4 pt-3">
                    <CardTitle className="text-sm font-semibold">Plan Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0 px-4 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Popular</span>
                      <Badge variant={selectedPlanForQuickView.popular ? "default" : "secondary"} className="text-xs">
                        {selectedPlanForQuickView.popular ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active</span>
                      <Badge variant={selectedPlanForQuickView.active ? "default" : "secondary"} className="text-xs">
                        {selectedPlanForQuickView.active ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Public</span>
                      <Badge variant={selectedPlanForQuickView.isPublic ? "default" : "secondary"} className="text-xs">
                        {selectedPlanForQuickView.isPublic ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Display Order</span>
                      <span className="text-sm font-medium">{selectedPlanForQuickView.displayOrder}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Trial Days</span>
                      <span className="text-sm font-medium">{selectedPlanForQuickView.trialDays}</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </LargeModal>
      )}
    </div>
  )
}
