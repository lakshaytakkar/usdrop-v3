"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Trash2, Lock, Eye, UserPlus, Check, EyeOff, AlertCircle, X, Search, Star, DollarSign, Calendar, Edit } from "lucide-react"
import { DataTable } from "@/components/data-table/data-table"
import { createPlansColumns } from "./components/plans-columns"
import { SubscriptionPlan } from "@/types/admin/plans"
import { samplePlans } from "./data/plans"
import type { SortingState, ColumnFiltersState } from "@tanstack/react-table"
import { LargeModal } from "@/components/ui/large-modal"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatarUrl } from "@/lib/utils/avatar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { sampleInternalUsers } from "@/app/admin/internal-users/data/users"
import { InternalUser } from "@/types/admin/users"
import { Loader } from "@/components/ui/loader"
import { useToast } from "@/hooks/use-toast"

export default function AdminPlansPage() {
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  
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
  const [selectedPlans, setSelectedPlans] = useState<SubscriptionPlan[]>([])
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [assigneeModalOpen, setAssigneeModalOpen] = useState(false)
  const [assignedOwner, setAssignedOwner] = useState<string | null>(null)
  const [assignedMembers, setAssignedMembers] = useState<string[]>([])
  const [memberSearch, setMemberSearch] = useState("")
  const [tempOwner, setTempOwner] = useState<string | null>(null)
  const [tempMembers, setTempMembers] = useState<string[]>([])

  const internalUsers = sampleInternalUsers

  // Filter members based on search
  const filteredMembers = useMemo(() => {
    if (!memberSearch) return internalUsers
    const searchLower = memberSearch.toLowerCase()
    return internalUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
    )
  }, [memberSearch, internalUsers])

  // Available members (excluding owner and already selected members)
  const availableMembers = useMemo(() => {
    return filteredMembers.filter(
      (user) => user.id !== tempOwner && !tempMembers.includes(user.id)
    )
  }, [filteredMembers, tempOwner, tempMembers])

  const handleOpenAssigneeModal = () => {
    setTempOwner(assignedOwner)
    setTempMembers([...assignedMembers])
    setMemberSearch("")
    setAssigneeModalOpen(true)
  }

  const handleSaveAssignees = () => {
    setAssignedOwner(tempOwner)
    setAssignedMembers(tempMembers)
    setAssigneeModalOpen(false)
  }

  const handleAddMember = (memberId: string) => {
    if (!tempMembers.includes(memberId)) {
      setTempMembers([...tempMembers, memberId])
    }
    setMemberSearch("")
  }

  const handleRemoveMember = (memberId: string) => {
    setTempMembers(tempMembers.filter(id => id !== memberId))
  }


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

  const handleViewDetails = useCallback((plan: SubscriptionPlan) => {
    setSelectedPlanForQuickView(plan)
    setQuickViewOpen(true)
  }, [])

  const handleRowClick = useCallback((plan: SubscriptionPlan) => {
    setSelectedPlanForQuickView(plan)
    setQuickViewOpen(true)
  }, [])

  const handleNameClick = useCallback((plan: SubscriptionPlan) => {
    setSelectedPlanForQuickView(plan)
    setQuickViewOpen(true)
  }, [])

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
    setActionLoading("delete")
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      const deletedPlanName = planToDelete.name
      setPlans(plans.filter((p) => p.id !== planToDelete.id))
      setDeleteConfirmOpen(false)
      setPlanToDelete(null)
      showSuccess(`Plan "${deletedPlanName}" has been deleted successfully`)
    } catch (err) {
      console.error("Error deleting plan:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to delete plan. Please try again."
      showError(errorMessage)
    } finally {
      setActionLoading(null)
    }
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
        onNameClick: handleNameClick,
      }),
    [handleViewDetails, handleNameClick]
  )

  const handlePaginationChange = useCallback((p: number, s: number) => {
    if (p !== page) setPage(p)
    if (s !== pageSize) {
      setPageSize(s)
      setPage(1)
    }
  }, [page, pageSize])

  const handleRowSelectionChange = useCallback((selectedRows: SubscriptionPlan[]) => {
    setSelectedPlans(selectedRows)
  }, [])

  // Prepare toolbar buttons based on selection
  const toolbarButtons = useMemo(() => {
    if (selectedPlans.length > 0) {
      return [
        {
          label: actionLoading === "delete" ? "Deleting..." : "Delete Selected",
          icon: actionLoading === "delete" ? <Loader size="sm" className="mr-2" /> : <Trash2 className="h-4 w-4" />,
          onClick: async () => {
            setActionLoading("delete")
            try {
              await new Promise((resolve) => setTimeout(resolve, 500))
              const selectedIds = selectedPlans.map((p) => p.id)
              const deletedCount = selectedPlans.length
              setPlans(plans.filter((p) => !selectedIds.includes(p.id)))
              setSelectedPlans([])
              showSuccess(`${deletedCount} plan(s) deleted successfully`)
            } catch (err) {
              console.error("Error deleting plans:", err)
              const errorMessage = err instanceof Error ? err.message : "Failed to delete plans. Please try again."
              showError(errorMessage)
            } finally {
              setActionLoading(null)
            }
          },
          variant: "outline" as const,
        },
        {
          label: "Clear Selection",
          onClick: () => setSelectedPlans([]),
          variant: "ghost" as const,
        },
      ]
    } else {
      return []
    }
  }, [selectedPlans, actionLoading, plans, showSuccess, showError])

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

  useEffect(() => {
    const totalPages = Math.ceil(filteredPlans.length / pageSize)
    const calculatedPageCount = totalPages > 0 ? totalPages : 1
    setPageCount(calculatedPageCount)
    if (page > calculatedPageCount && calculatedPageCount > 0) {
      setPage(1)
    }
  }, [filteredPlans.length, pageSize, page])

  useEffect(() => {
    setInitialLoading(false)
  }, [])

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Plans</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage subscription plans and their features. Configure pricing, permissions, and visibility.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {assignedOwner || assignedMembers.length > 0 ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center -space-x-2">
                {assignedOwner && (() => {
                  const owner = internalUsers.find(u => u.id === assignedOwner)
                  return (
                    <Avatar className="h-8 w-8 border-2 border-background">
                      <AvatarImage src={getAvatarUrl(assignedOwner, owner?.email)} />
                      <AvatarFallback className="text-xs">
                        {owner?.name.charAt(0) || "O"}
                      </AvatarFallback>
                    </Avatar>
                  )
                })()}
                {assignedMembers.slice(0, 3).map((memberId) => {
                  const member = internalUsers.find(u => u.id === memberId)
                  return (
                    <Avatar key={memberId} className="h-8 w-8 border-2 border-background">
                      <AvatarImage src={getAvatarUrl(memberId, member?.email)} />
                      <AvatarFallback className="text-xs">
                        {member?.name.charAt(0) || "M"}
                      </AvatarFallback>
                    </Avatar>
                  )
                })}
                {assignedMembers.length > 3 && (
                  <div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center">
                    <span className="text-xs font-medium">+{assignedMembers.length - 3}</span>
                  </div>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleOpenAssigneeModal}
                className="whitespace-nowrap cursor-pointer"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Assignee
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleOpenAssigneeModal}
              className="whitespace-nowrap cursor-pointer"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Assignee
            </Button>
          )}
        </div>
      </div>

      {selectedPlans.length > 0 && (
        <div className="mb-2">
          <span className="text-sm font-medium">
            {selectedPlans.length} plan{selectedPlans.length !== 1 ? "s" : ""} selected
          </span>
        </div>
      )}

      {initialLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Loading plans...</div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={paginatedPlans}
          pageCount={Math.max(1, pageCount)}
          onPaginationChange={handlePaginationChange}
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
          onRowSelectionChange={handleRowSelectionChange}
          onRowClick={handleRowClick}
          secondaryButtons={toolbarButtons}
        />
      )}

      {/* Delete Confirmation Dialog */}
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
              <p className="text-sm">
                <span className="font-medium">Slug:</span> {planToDelete.slug}
              </p>
            </div>
          )}
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} disabled={actionLoading === "delete"} className="cursor-pointer">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={actionLoading === "delete"} className="cursor-pointer">
              {actionLoading === "delete" ? (
                <>
                  <Loader size="sm" className="mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
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

      {/* Plan Details Large Modal */}
      {selectedPlanForQuickView && (
        <LargeModal
          open={quickViewOpen}
          onOpenChange={(open) => {
            setQuickViewOpen(open)
            if (!open) {
              setSelectedPlanForQuickView(null)
            }
          }}
          title={selectedPlanForQuickView.name}
          footer={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setQuickViewOpen(false)
                  handleEdit(selectedPlanForQuickView)
                }}
                className="cursor-pointer"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={() => setQuickViewOpen(false)}
                className="cursor-pointer"
              >
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Plan Header */}
            <Card>
              <CardHeader className="pb-2 px-4 pt-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
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

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview" className="cursor-pointer">Overview</TabsTrigger>
                <TabsTrigger value="features" className="cursor-pointer">Features</TabsTrigger>
                <TabsTrigger value="permissions" className="cursor-pointer">Permissions</TabsTrigger>
                <TabsTrigger value="settings" className="cursor-pointer">Settings</TabsTrigger>
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
                        <p className="text-sm font-medium">
                          {selectedPlanForQuickView.priceMonthly === 0
                            ? "Free"
                            : `$${selectedPlanForQuickView.priceMonthly.toFixed(2)}/month`}
                        </p>
                      </div>
                    </div>
                    {selectedPlanForQuickView.priceAnnual && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Annual Price</p>
                          <p className="text-sm font-medium">${selectedPlanForQuickView.priceAnnual.toFixed(2)}/year</p>
                        </div>
                      </div>
                    )}
                    {selectedPlanForQuickView.trialDays > 0 && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Trial Period</p>
                          <p className="text-sm font-medium">{selectedPlanForQuickView.trialDays} days</p>
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
                      <p className="text-sm text-muted-foreground">{selectedPlanForQuickView.description}</p>
                    </CardContent>
                  </Card>
                )}

                {selectedPlanForQuickView.keyPointers && (
                  <Card>
                    <CardHeader className="pb-2 px-4 pt-3">
                      <CardTitle className="text-sm font-semibold">Key Pointers</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 px-4 pb-3">
                      <p className="text-sm font-medium">{selectedPlanForQuickView.keyPointers}</p>
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
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Created At</p>
                          <p className="text-sm font-medium">
                            {new Date(selectedPlanForQuickView.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedPlanForQuickView.updatedAt && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Last Updated</p>
                          <p className="text-sm font-medium">
                            {new Date(selectedPlanForQuickView.updatedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
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
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
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

              <TabsContent value="permissions" className="space-y-2 mt-4">
                <Card>
                  <CardHeader className="pb-2 px-4 pt-3">
                    <CardTitle className="text-sm font-semibold">Plan Permissions</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 px-4 pb-3">
                    <p className="text-sm text-muted-foreground">
                      Permission configuration will be displayed here. To manage plan permissions, go to the Permissions page.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-2 mt-4">
                <Card>
                  <CardHeader className="pb-2 px-4 pt-3">
                    <CardTitle className="text-sm font-semibold">Plan Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 px-4 pb-3">
                    <p className="text-sm text-muted-foreground">
                      Settings and configuration options will be displayed here.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </LargeModal>
      )}

      {/* Add Assignee Modal */}
      <Dialog open={assigneeModalOpen} onOpenChange={setAssigneeModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Page Access Control</DialogTitle>
            <DialogDescription>
              Manage ownership and access for this page
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Owner Section */}
            <div className="space-y-2">
              <Label htmlFor="owner">Owner</Label>
              <Select value={tempOwner || ""} onValueChange={setTempOwner}>
                <SelectTrigger id="owner" className="w-full">
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                  {internalUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                The owner is responsible for maintaining this page
              </p>
            </div>

            {/* Members Section */}
            <div className="space-y-2">
              <Label htmlFor="members">Members</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-start"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    {memberSearch || "Search users to add..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <Command>
                    <CommandInput 
                      placeholder="Search users..." 
                      value={memberSearch}
                      onValueChange={setMemberSearch}
                    />
                    <CommandList>
                      <CommandEmpty>No users found.</CommandEmpty>
                      <CommandGroup>
                        {availableMembers.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={user.id}
                            onSelect={() => handleAddMember(user.id)}
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={getAvatarUrl(user.id, user.email)} />
                                <AvatarFallback className="text-xs">
                                  {user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              
              {/* Selected Members */}
              {tempMembers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tempMembers.map((memberId) => {
                    const member = internalUsers.find(u => u.id === memberId)
                    if (!member) return null
                    return (
                      <Badge key={memberId} variant="secondary" className="flex items-center gap-1">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={getAvatarUrl(memberId, member.email)} />
                          <AvatarFallback className="text-xs">
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {member.name}
                        <button
                          onClick={() => handleRemoveMember(memberId)}
                          className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssigneeModalOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button onClick={handleSaveAssignees} className="cursor-pointer">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
