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
import { Plus, Trash2, Lock, Eye, UserPlus, Check, EyeOff, AlertCircle, X, Search, Star, DollarSign, Calendar, Edit, RefreshCw, CreditCard, CheckCircle2 } from "lucide-react"
import { DataTable } from "@/components/data-table/data-table"
import { createPlansColumns } from "./components/plans-columns"
import { SubscriptionPlan, PlanFormData } from "@/types/admin/plans"
import type { SortingState, ColumnFiltersState } from "@tanstack/react-table"
import { LargeModal } from "@/components/ui/large-modal"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatarUrl } from "@/lib/utils/avatar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
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
import { Loader } from "@/components/ui/loader"
import { useToast } from "@/hooks/use-toast"
import { generateSlugFromName, validatePlanSlug } from "@/lib/utils/plan-helpers"

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
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [selectedPlanForQuickView, setSelectedPlanForQuickView] = useState<SubscriptionPlan | null>(null)
  const [selectedPlans, setSelectedPlans] = useState<SubscriptionPlan[]>([])
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [formData, setFormData] = useState<PlanFormData>({
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
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [formLoading, setFormLoading] = useState(false)
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

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true)
      
      const response = await fetch("/api/admin/plans")
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch plans")
      }
      
      const data = await response.json()
      
      // Map API response to SubscriptionPlan interface (convert date strings to Date objects)
      const plansData: SubscriptionPlan[] = data.map((plan: {
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
      }) => ({
        ...plan,
        createdAt: plan.createdAt ? new Date(plan.createdAt) : null,
        updatedAt: plan.updatedAt ? new Date(plan.updatedAt) : null,
      }))
      
      setPlans(plansData)
    } catch (err) {
      console.error("Error fetching plans:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to load plans. Please check your connection and try again."
      showError(errorMessage)
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }, [showError])

  // Fetch plans on mount
  useEffect(() => {
    fetchPlans()
  }, [fetchPlans])

  useEffect(() => {
    setPageCount(Math.ceil(filteredPlans.length / pageSize))
    // Reset to page 1 if current page is out of bounds
    if (page > Math.ceil(filteredPlans.length / pageSize) && filteredPlans.length > 0) {
      setPage(1)
    }
  }, [filteredPlans.length, pageSize, page])

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

  const handleFormSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    console.log("Form submit triggered", { editingPlan, formData })
    
    const errors: Record<string, string> = {}
    
    // Validate name
    if (!formData.name?.trim()) {
      errors.name = "Name is required"
    }
    
    // Validate slug
    if (!formData.slug?.trim()) {
      errors.slug = "Slug is required"
    } else if (!validatePlanSlug(formData.slug)) {
      errors.slug = "Slug must be lowercase, alphanumeric, and can only contain hyphens and underscores"
    } else {
      // Check for duplicate slug (excluding current plan if editing)
      const duplicatePlan = plans.find(
        (p) => p.slug.toLowerCase() === formData.slug.toLowerCase() && p.id !== editingPlan?.id
      )
      if (duplicatePlan) {
        errors.slug = "This slug is already in use"
      }
    }
    
    // Validate priceMonthly
    if (formData.priceMonthly === undefined || formData.priceMonthly === null || formData.priceMonthly < 0) {
      errors.priceMonthly = "Monthly price must be 0 or greater"
    }
    
    // Validate priceAnnual
    if (formData.priceAnnual !== undefined && formData.priceAnnual !== null && formData.priceAnnual < 0) {
      errors.priceAnnual = "Annual price must be 0 or greater"
    }
    
    // Validate priceYearly
    if (formData.priceYearly !== undefined && formData.priceYearly !== null && formData.priceYearly < 0) {
      errors.priceYearly = "Yearly price must be 0 or greater"
    }
    
    // Validate trialDays
    if (formData.trialDays < 0) {
      errors.trialDays = "Trial days must be 0 or greater"
    }
    
    // Validate displayOrder
    if (formData.displayOrder < 0) {
      errors.displayOrder = "Display order must be 0 or greater"
    }
    
    // Validate features (remove empty ones)
    const validFeatures = (formData.features || []).filter(f => f && typeof f === 'string' && f.trim().length > 0)
    if (validFeatures.length === 0) {
      errors.features = "At least one feature is required"
    }

    if (Object.keys(errors).length > 0) {
      console.log("Validation errors:", errors)
      setFormErrors(errors)
      // Scroll to first error field
      setTimeout(() => {
        const firstErrorKey = Object.keys(errors)[0]
        const errorElementId = 
          firstErrorKey === "name" ? "plan-name" :
          firstErrorKey === "slug" ? "plan-slug" :
          firstErrorKey === "description" ? "plan-description" :
          firstErrorKey === "priceMonthly" ? "price-monthly" :
          firstErrorKey === "priceAnnual" ? "price-annual" :
          firstErrorKey === "priceYearly" ? "price-yearly" :
          firstErrorKey === "features" ? "plan-form" :
          firstErrorKey === "displayOrder" ? "display-order" :
          firstErrorKey === "trialDays" ? "trial-days" :
          firstErrorKey === "keyPointers" ? "key-pointers" : null
        
        if (errorElementId) {
          const errorElement = document.getElementById(errorElementId)
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: "smooth", block: "center" })
            if (errorElement instanceof HTMLInputElement || errorElement instanceof HTMLTextAreaElement) {
              errorElement.focus()
            }
          }
        }
      }, 100)
      return
    }

    setFormLoading(true)
    try {
      let response: Response
      
      // Auto-generate slug if empty
      const finalSlug = formData.slug || generateSlugFromName(formData.name)
      
      // Filter out empty features
      const finalFeatures = (formData.features || []).filter(f => f && typeof f === 'string' && f.trim().length > 0)
      
      const requestBody = {
        name: formData.name.trim(),
        slug: finalSlug,
        description: formData.description?.trim() || undefined,
        priceMonthly: Number(formData.priceMonthly),
        priceAnnual: formData.priceAnnual !== undefined && formData.priceAnnual !== null ? Number(formData.priceAnnual) : undefined,
        priceYearly: formData.priceYearly !== undefined && formData.priceYearly !== null ? Number(formData.priceYearly) : undefined,
        features: finalFeatures,
        popular: Boolean(formData.popular),
        active: Boolean(formData.active),
        isPublic: Boolean(formData.isPublic),
        displayOrder: Number(formData.displayOrder),
        keyPointers: formData.keyPointers?.trim() || undefined,
        trialDays: Number(formData.trialDays),
      }
      
      console.log("Submitting plan:", { editingPlan: editingPlan?.id, requestBody })
      
      if (editingPlan) {
        response = await fetch(`/api/admin/plans/${editingPlan.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        })
      } else {
        response = await fetch('/api/admin/plans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        })
      }
      
      console.log("Response status:", response.status, response.statusText)
      
      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch (parseError) {
          const text = await response.text()
          throw new Error(`Server error: ${response.status} ${response.statusText}. ${text}`)
        }
        throw new Error(errorData.error || `Failed to save plan: ${response.status} ${response.statusText}`)
      }

      let planData
      try {
        planData = await response.json()
      } catch (parseError) {
        console.error("Failed to parse response:", parseError)
        throw new Error("Invalid response from server")
      }
      
      console.log("Plan saved successfully:", planData)
      
      setFormOpen(false)
      setEditingPlan(null)
      setFormData({
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
      })
      setFormErrors({})
      
      // Refresh data after create/update
      await fetchPlans()
      
      showSuccess(
        editingPlan
          ? `Plan "${planData.name}" has been updated successfully`
          : `Plan "${planData.name}" has been created successfully`
      )
    } catch (err) {
      console.error("Error saving plan:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to save plan. Please try again."
      showError(errorMessage)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = useCallback((plan: SubscriptionPlan) => {
    setPlanToDelete(plan)
    setDeleteConfirmOpen(true)
  }, [])

  const confirmDelete = async () => {
    if (!planToDelete) return
    setActionLoading("delete")
    try {
      const response = await fetch(`/api/admin/plans/${planToDelete.id}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete plan")
      }
      
      const result = await response.json()
      const deletedPlanName = planToDelete.name
      setDeleteConfirmOpen(false)
      setPlanToDelete(null)
      showSuccess(result.message || `Plan "${deletedPlanName}" has been deleted successfully`)
      // Refresh data after delete
      await fetchPlans()
    } catch (err) {
      console.error("Error deleting plan:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to delete plan. Please try again."
      showError(errorMessage)
    } finally {
      setActionLoading(null)
    }
  }

  const handleToggleActive = useCallback(async (plan: SubscriptionPlan) => {
    setActionLoading(`toggle-active-${plan.id}`)
    try {
      const response = await fetch(`/api/admin/plans/${plan.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !plan.active }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update plan")
      }
      
      // Refresh data after update
      await fetchPlans()
    } catch (err) {
      console.error("Error toggling plan active status:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to update plan. Please try again."
      showError(errorMessage)
    } finally {
      setActionLoading(null)
    }
  }, [fetchPlans, showError])

  const handleTogglePublic = useCallback(async (plan: SubscriptionPlan) => {
    setActionLoading(`toggle-public-${plan.id}`)
    try {
      const response = await fetch(`/api/admin/plans/${plan.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: !plan.isPublic }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update plan")
      }
      
      // Refresh data after update
      await fetchPlans()
    } catch (err) {
      console.error("Error toggling plan public status:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to update plan. Please try again."
      showError(errorMessage)
    } finally {
      setActionLoading(null)
    }
  }, [fetchPlans, showError])

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
    [handleViewDetails, handleEdit, handleDelete, handleToggleActive, handleTogglePublic, handleNameClick, fetchPlans, showError]
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
              // Delete plans sequentially to handle soft deletes properly
              let successCount = 0
              let failedCount = 0
              
              for (const plan of selectedPlans) {
                try {
                  const response = await fetch(`/api/admin/plans/${plan.id}`, { method: "DELETE" })
                  if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(errorData.error || `Failed to delete ${plan.name}`)
                  }
                  successCount++
                } catch (err) {
                  failedCount++
                  console.error(`Error deleting plan ${plan.name}:`, err)
                }
              }
              
              if (failedCount > 0) {
                showError(`${failedCount} plan(s) failed to delete. ${successCount} plan(s) deleted successfully.`)
              } else {
                showSuccess(`${successCount} plan(s) deleted successfully`)
              }
              
              setSelectedPlans([])
              // Refresh data after delete
              await fetchPlans()
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
          label: actionLoading === "activate" ? "Activating..." : "Activate Selected",
          icon: actionLoading === "activate" ? <Loader size="sm" className="mr-2" /> : <Check className="h-4 w-4" />,
          onClick: async () => {
            setActionLoading("activate")
            try {
              let successCount = 0
              let failedCount = 0
              
              for (const plan of selectedPlans) {
                try {
                  const response = await fetch(`/api/admin/plans/${plan.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ active: true }),
                  })
                  if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(errorData.error || `Failed to activate ${plan.name}`)
                  }
                  successCount++
                } catch (err) {
                  failedCount++
                  console.error(`Error activating plan ${plan.name}:`, err)
                }
              }
              
              if (failedCount > 0) {
                showError(`${failedCount} plan(s) failed to activate. ${successCount} plan(s) activated successfully.`)
              } else {
                showSuccess(`${successCount} plan(s) activated successfully`)
              }
              
              setSelectedPlans([])
              await fetchPlans()
            } catch (err) {
              console.error("Error activating plans:", err)
              showError("Failed to activate plans. Please try again.")
            } finally {
              setActionLoading(null)
            }
          },
          variant: "outline" as const,
        },
        {
          label: actionLoading === "deactivate" ? "Deactivating..." : "Deactivate Selected",
          icon: actionLoading === "deactivate" ? <Loader size="sm" className="mr-2" /> : <X className="h-4 w-4" />,
          onClick: async () => {
            setActionLoading("deactivate")
            try {
              let successCount = 0
              let failedCount = 0
              
              for (const plan of selectedPlans) {
                try {
                  const response = await fetch(`/api/admin/plans/${plan.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ active: false }),
                  })
                  if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(errorData.error || `Failed to deactivate ${plan.name}`)
                  }
                  successCount++
                } catch (err) {
                  failedCount++
                  console.error(`Error deactivating plan ${plan.name}:`, err)
                }
              }
              
              if (failedCount > 0) {
                showError(`${failedCount} plan(s) failed to deactivate. ${successCount} plan(s) deactivated successfully.`)
              } else {
                showSuccess(`${successCount} plan(s) deactivated successfully`)
              }
              
              setSelectedPlans([])
              await fetchPlans()
            } catch (err) {
              console.error("Error deactivating plans:", err)
              showError("Failed to deactivate plans. Please try again.")
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
      return [
        {
          label: "Refresh",
          icon: <RefreshCw className="h-4 w-4" />,
          onClick: async () => {
            await fetchPlans()
            showSuccess("Plans refreshed")
          },
          variant: "outline" as const,
        },
      ]
    }
  }, [selectedPlans, actionLoading, fetchPlans, showSuccess, showError])

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

  // Initialize form when opening for create
  useEffect(() => {
    if (formOpen && !editingPlan) {
      setFormData({
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
      })
      setFormErrors({})
    }
  }, [formOpen, editingPlan])

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="text-xl font-semibold leading-[1.35] tracking-tight text-foreground">Plans</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage subscription plans</p>
        </div>
      </div>

      {!initialLoading && plans.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-card border rounded-lg p-4 shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total Plans</span>
              <div className="w-9 h-9 rounded-lg border flex items-center justify-center">
                <CreditCard className="h-[18px] w-[18px] text-primary" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-semibold">{plans.length.toLocaleString()}</span>
            </div>
            <div className="mt-2">
              <span className="text-xs text-muted-foreground">All subscription plans</span>
            </div>
          </div>
          <div className="bg-card border rounded-lg p-4 shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Active</span>
              <div className="w-9 h-9 rounded-lg border flex items-center justify-center">
                <CheckCircle2 className="h-[18px] w-[18px] text-primary" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-semibold">{plans.filter(p => p.active).length.toLocaleString()}</span>
            </div>
            <div className="mt-2">
              <span className="text-xs text-muted-foreground">Currently active plans</span>
            </div>
          </div>
          <div className="bg-card border rounded-lg p-4 shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Inactive</span>
              <div className="w-9 h-9 rounded-lg border flex items-center justify-center">
                <AlertCircle className="h-[18px] w-[18px] text-primary" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-semibold">{plans.filter(p => !p.active).length.toLocaleString()}</span>
            </div>
            <div className="mt-2">
              <span className="text-xs text-muted-foreground">Inactive plans</span>
            </div>
          </div>
        </div>
      )}

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
          <form id="plan-form" onSubmit={(e) => { e.preventDefault(); handleFormSubmit(e); }} className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="plan-name">Name *</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enter the plan name as it should appear to users</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="plan-name"
                value={formData.name}
                onChange={(e) => {
                  const newName = e.target.value
                  setFormData({ 
                    ...formData, 
                    name: newName,
                    slug: formData.slug || generateSlugFromName(newName)
                  })
                  if (formErrors.name) setFormErrors({ ...formErrors, name: "" })
                }}
                placeholder="Enter plan name"
                className={formErrors.name ? "border-destructive" : ""}
              />
              {formErrors.name && <p className="text-xs text-destructive">{formErrors.name}</p>}
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="plan-slug">Slug *</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>URL-friendly identifier (lowercase, alphanumeric, hyphens/underscores only)</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="plan-slug"
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

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="plan-description">Description</Label>
              <Textarea
                id="plan-description"
                value={formData.description || ""}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value })
                  if (formErrors.description) setFormErrors({ ...formErrors, description: "" })
                }}
                placeholder="Enter plan description"
                rows={3}
                className={formErrors.description ? "border-destructive" : ""}
              />
              {formErrors.description && <p className="text-xs text-destructive">{formErrors.description}</p>}
            </div>

            {/* Pricing Section */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-sm font-semibold">Pricing</h3>
              
              <div className="grid grid-cols-3 gap-4">
                {/* Monthly Price */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="price-monthly">Monthly Price *</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Monthly subscription price in INR</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="price-monthly"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.priceMonthly}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0
                      setFormData({ ...formData, priceMonthly: value })
                      if (formErrors.priceMonthly) setFormErrors({ ...formErrors, priceMonthly: "" })
                    }}
                    onBlur={(e) => {
                      const value = parseFloat(e.target.value) || 0
                      if (value < 0) {
                        setFormErrors({ ...formErrors, priceMonthly: "Monthly price must be 0 or greater" })
                      }
                    }}
                    placeholder="0.00"
                    className={formErrors.priceMonthly ? "border-destructive" : ""}
                  />
                  {formErrors.priceMonthly && <p className="text-xs text-destructive">{formErrors.priceMonthly}</p>}
                </div>

                {/* Annual Price */}
                <div className="space-y-2">
                  <Label htmlFor="price-annual">Annual Price</Label>
                  <Input
                    id="price-annual"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.priceAnnual || ""}
                    onChange={(e) => {
                      const value = e.target.value ? parseFloat(e.target.value) : undefined
                      setFormData({ 
                        ...formData, 
                        priceAnnual: value
                      })
                      if (formErrors.priceAnnual) setFormErrors({ ...formErrors, priceAnnual: "" })
                    }}
                    onBlur={(e) => {
                      const value = e.target.value ? parseFloat(e.target.value) : undefined
                      if (value !== undefined && value < 0) {
                        setFormErrors({ ...formErrors, priceAnnual: "Annual price must be 0 or greater" })
                      }
                    }}
                    placeholder="Optional"
                  />
                  {formErrors.priceAnnual && <p className="text-xs text-destructive">{formErrors.priceAnnual}</p>}
                </div>

                {/* Yearly Price */}
                <div className="space-y-2">
                  <Label htmlFor="price-yearly">Yearly Price</Label>
                  <Input
                    id="price-yearly"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.priceYearly || ""}
                    onChange={(e) => {
                      const value = e.target.value ? parseFloat(e.target.value) : undefined
                      setFormData({ 
                        ...formData, 
                        priceYearly: value
                      })
                      if (formErrors.priceYearly) setFormErrors({ ...formErrors, priceYearly: "" })
                    }}
                    onBlur={(e) => {
                      const value = e.target.value ? parseFloat(e.target.value) : undefined
                      if (value !== undefined && value < 0) {
                        setFormErrors({ ...formErrors, priceYearly: "Yearly price must be 0 or greater" })
                      }
                    }}
                    placeholder="Optional"
                  />
                  {formErrors.priceYearly && <p className="text-xs text-destructive">{formErrors.priceYearly}</p>}
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-semibold">Features *</h3>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add at least one feature for this plan</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFormData({ ...formData, features: [...(formData.features || []), ""] })
                    if (formErrors.features) setFormErrors({ ...formErrors, features: "" })
                  }}
                  className="cursor-pointer"
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
                        // Clear error when user starts typing
                        if (formErrors.features) {
                          const validFeatures = newFeatures.filter(f => f && typeof f === 'string' && f.trim().length > 0)
                          if (validFeatures.length > 0) {
                            setFormErrors({ ...formErrors, features: "" })
                          }
                        }
                      }}
                      placeholder={`Feature ${index + 1}`}
                      className={formErrors.features ? "border-destructive" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newFeatures = formData.features.filter((_, i) => i !== index)
                        setFormData({ ...formData, features: newFeatures })
                        // Clear error if there are still valid features
                        if (formErrors.features) {
                          const validFeatures = newFeatures.filter(f => f && typeof f === 'string' && f.trim().length > 0)
                          if (validFeatures.length > 0) {
                            setFormErrors({ ...formErrors, features: "" })
                          }
                        }
                      }}
                      className="cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {formData.features.length === 0 && (
                  <p className="text-sm text-muted-foreground">No features added. Click &quot;Add Feature&quot; to add one.</p>
                )}
                {formErrors.features && (
                  <p className="text-xs text-destructive mt-1">{formErrors.features}</p>
                )}
              </div>
            </div>

            {/* Settings Section */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-sm font-semibold">Settings</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Display Order */}
                <div className="space-y-2">
                  <Label htmlFor="display-order">Display Order</Label>
                  <Input
                    id="display-order"
                    type="number"
                    min="0"
                    value={formData.displayOrder}
                    onChange={(e) => {
                      setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
                    }}
                    placeholder="0"
                  />
                </div>

                {/* Trial Days */}
                <div className="space-y-2">
                  <Label htmlFor="trial-days">Trial Days</Label>
                  <Input
                    id="trial-days"
                    type="number"
                    min="0"
                    value={formData.trialDays}
                    onChange={(e) => {
                      setFormData({ ...formData, trialDays: parseInt(e.target.value) || 0 })
                    }}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Key Pointers */}
              <div className="space-y-2">
                <Label htmlFor="key-pointers">Key Pointers</Label>
                <Textarea
                  id="key-pointers"
                  value={formData.keyPointers || ""}
                  onChange={(e) => {
                    setFormData({ ...formData, keyPointers: e.target.value })
                  }}
                  placeholder="Enter key selling points (optional)"
                  rows={2}
                />
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="popular"
                    checked={formData.popular}
                    onCheckedChange={(checked) => {
                      setFormData({ ...formData, popular: checked === true })
                    }}
                  />
                  <Label htmlFor="popular" className="cursor-pointer">
                    Mark as Popular
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => {
                      setFormData({ ...formData, active: checked === true })
                    }}
                  />
                  <Label htmlFor="active" className="cursor-pointer">
                    Active
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is-public"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => {
                      setFormData({ ...formData, isPublic: checked === true })
                    }}
                  />
                  <Label htmlFor="is-public" className="cursor-pointer">
                    Public (visible to users)
                  </Label>
                </div>
              </div>
            </div>
          </form>
          <DialogFooter>
            <Button 
              type="button"
              variant="outline" 
              onClick={() => {
                setFormOpen(false)
                setEditingPlan(null)
                setFormErrors({})
              }}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              form="plan-form"
              disabled={formLoading}
            >
              {formLoading ? (
                <>
                  <Loader size="sm" className="mr-2" />
                  {editingPlan ? "Updating..." : "Creating..."}
                </>
              ) : (
                editingPlan ? "Update" : "Create"
              )}
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
