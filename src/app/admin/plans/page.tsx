"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Trash2, Lock, Eye } from "lucide-react"
import { DataTable } from "@/components/data-table/data-table"
import { createPlansColumns } from "./components/plans-columns"
import { SubscriptionPlan } from "@/types/admin/plans"
import { samplePlans } from "./data/plans"
import type { SortingState, ColumnFiltersState } from "@tanstack/react-table"
import { QuickViewModal } from "@/components/ui/quick-view-modal"

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(samplePlans)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [filters, setFilters] = useState<ColumnFiltersState>([])
  const [search, setSearch] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [selectedPlanForQuickView, setSelectedPlanForQuickView] = useState<SubscriptionPlan | null>(null)

  // Filter plans based on search and filters
  const filteredPlans = useMemo(() => {
    let result = plans

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (plan) =>
          plan.name.toLowerCase().includes(searchLower) ||
          plan.slug.toLowerCase().includes(searchLower) ||
          (plan.description && plan.description.toLowerCase().includes(searchLower))
      )
    }

    // Apply column filters
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
      if (filter.id === "isPublic" && Array.isArray(filter.value) && filter.value.length > 0) {
        const isPublic = filter.value.includes("public")
        const isPrivate = filter.value.includes("private")
        result = result.filter((plan) => {
          if (isPublic && !plan.isPublic) return false
          if (isPrivate && plan.isPublic) return false
          return true
        })
      }
    })

    return result
  }, [plans, search, filters])

  // Paginate filtered plans
  const paginatedPlans = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return filteredPlans.slice(start, end)
  }, [filteredPlans, page, pageSize])

  useEffect(() => {
    setPageCount(Math.ceil(filteredPlans.length / pageSize))
    setInitialLoading(false)
  }, [filteredPlans.length, pageSize])

  const handleViewDetails = (plan: SubscriptionPlan) => {
    setSelectedPlanForQuickView(plan)
    setQuickViewOpen(true)
  }

  const handleRowClick = (plan: SubscriptionPlan) => {
    setSelectedPlanForQuickView(plan)
    setQuickViewOpen(true)
  }

  const handleEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan)
    setFormOpen(true)
  }

  const handleDelete = (plan: SubscriptionPlan) => {
    setPlanToDelete(plan)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!planToDelete) return
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    setPlans(plans.filter((p) => p.id !== planToDelete.id))
    setDeleteConfirmOpen(false)
    setPlanToDelete(null)
  }

  const handleToggleActive = async (plan: SubscriptionPlan) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    setPlans(plans.map((p) => (p.id === plan.id ? { ...p, active: !p.active } : p)))
  }

  const handleTogglePublic = async (plan: SubscriptionPlan) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    setPlans(plans.map((p) => (p.id === plan.id ? { ...p, isPublic: !p.isPublic } : p)))
  }

  const columns = useMemo(
    () =>
      createPlansColumns({
        onViewDetails: handleViewDetails,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onToggleActive: handleToggleActive,
        onTogglePublic: handleTogglePublic,
      }),
    []
  )

  const filterConfig = [
      {
      columnId: "active",
      title: "Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
    {
      columnId: "isPublic",
      title: "Visibility",
      options: [
        { label: "Public", value: "public" },
        { label: "Private", value: "private" },
      ],
    },
  ]

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
      <div>
          <h1 className="text-lg font-semibold tracking-tight">Plans Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage subscription plans and their features. Configure pricing, permissions, and visibility.
          </p>
          </div>
        <Button onClick={() => {
          setEditingPlan(null)
          setFormOpen(true)
        }}>
            <Plus className="h-4 w-4 mr-2" />
            Create Plan
          </Button>
      </div>

      {initialLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Loading plans...</div>
              </div>
      ) : (
        <DataTable
          columns={columns}
          data={paginatedPlans}
          pageCount={pageCount}
          onPaginationChange={(p, s) => {
            setPage(p)
            setPageSize(s)
          }}
          onSortingChange={setSorting}
          onFilterChange={setFilters}
          onSearchChange={setSearch}
          loading={loading}
          initialLoading={initialLoading}
          filterConfig={filterConfig}
          searchPlaceholder="Search plans..."
          page={page}
          pageSize={pageSize}
          onAdd={() => {
            setEditingPlan(null)
            setFormOpen(true)
          }}
          addButtonText="Create Plan"
          addButtonIcon={<Plus className="h-4 w-4" />}
          enableRowSelection={true}
          onRowSelectionChange={(selectedRows) => {
            // Handle bulk actions if needed
            console.log("Selected rows:", selectedRows)
          }}
          onRowClick={handleRowClick}
            />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
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
              <p className="text-sm">
                <span className="font-medium">Slug:</span> {planToDelete.slug}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Plan Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPlan ? "Edit Plan" : "Create Plan"}</DialogTitle>
            <DialogDescription>
              {editingPlan
                ? "Update plan information, pricing, and features."
                : "Create a new subscription plan with pricing and features."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Plan form implementation would go here (name, slug, description, pricing, features, status, visibility fields).
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setFormOpen(false)
              setEditingPlan(null)
            }}>
              Cancel
            </Button>
            <Button onClick={() => {
              // TODO: Handle form submission
              setFormOpen(false)
              setEditingPlan(null)
            }}>
              {editingPlan ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick View Modal */}
      {selectedPlanForQuickView && (
        <QuickViewModal
          open={quickViewOpen}
          onOpenChange={setQuickViewOpen}
          title={selectedPlanForQuickView.name}
        >
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Slug</p>
              <p className="text-sm font-medium font-mono">{selectedPlanForQuickView.slug}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Pricing</p>
              <p className="text-sm font-medium">
                {selectedPlanForQuickView.priceMonthly === 0
                  ? "Free"
                  : `$${selectedPlanForQuickView.priceMonthly.toFixed(2)}/mo`}
                {selectedPlanForQuickView.priceAnnual && (
                  <span className="text-xs text-muted-foreground ml-2">
                    (${selectedPlanForQuickView.priceAnnual.toFixed(2)}/yr)
                  </span>
                )}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <p className="text-sm font-medium capitalize">
                {selectedPlanForQuickView.active ? "Active" : "Inactive"} /{" "}
                {selectedPlanForQuickView.isPublic ? "Public" : "Private"}
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  setQuickViewOpen(false)
                  handleEdit(selectedPlanForQuickView)
                }}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  setQuickViewOpen(false)
                  handleViewDetails(selectedPlanForQuickView)
                }}
              >
                View Details
              </Button>
            </div>
          </div>
        </QuickViewModal>
      )}
    </div>
  )
}
