"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { SortingState, ColumnFiltersState } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Plus, Trash2, TrendingUp, Check, DollarSign, ArrowUpRight, ArrowDownRight, Package, Copy, Edit, RefreshCw, Download, Layers, X, UserPlus, Search, Folder, BarChart3 } from "lucide-react"
import { AdminCategoryCard } from "./components/admin-category-card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { Loader } from "@/components/ui/loader"
import { QuickViewModal } from "@/components/ui/quick-view-modal"
import { DetailDrawer } from "@/components/ui/detail-drawer"
import { ProductCategory } from "@/types/admin/categories"
import { Category } from "@/types/categories"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { useHasPermission } from "@/hooks/use-has-permission"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatarUrl } from "@/lib/utils/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { sampleInternalUsers } from "@/app/admin/internal-users/data/users"
import { InternalUser } from "@/types/admin/users"
import { DataTable } from "@/components/data-table/data-table"
import { createCategoriesColumns } from "./components/categories-columns"

export default function AdminCategoriesPage() {
  const router = useRouter()
  const { showSuccess, showError, showInfo } = useToast()
  
  // Permission checks
  const { hasPermission: canView } = useHasPermission("categories.view")
  const { hasPermission: canEdit } = useHasPermission("categories.edit")
  const { hasPermission: canCreate } = useHasPermission("categories.create")
  const { hasPermission: canDelete } = useHasPermission("categories.delete")
  
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [statusTab, setStatusTab] = useState<"all" | "trending" | "high_profit" | "high_growth">("all")
  const [quickFilter, setQuickFilter] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<ProductCategory | null>(null)
  const [bulkActionLoading, setBulkActionLoading] = useState<string | null>(null)
  const [assigneeModalOpen, setAssigneeModalOpen] = useState(false)
  const [assignedOwner, setAssignedOwner] = useState<string | null>(null)
  const [assignedMembers, setAssignedMembers] = useState<string[]>([])
  const [memberSearch, setMemberSearch] = useState("")
  const [tempOwner, setTempOwner] = useState<string | null>(null)
  const [tempMembers, setTempMembers] = useState<string[]>([])

  const internalUsers = sampleInternalUsers

  const parentCategories = useMemo(() => {
    return categories.filter((cat) => !cat.parent_category_id)
  }, [categories])

  // Quick filters (3-5 important ones)
  const quickFilters = [
    { id: "trending", label: "Trending", count: 0 },
    { id: "high_profit", label: "High Profit", count: 0 },
    { id: "high_growth", label: "High Growth", count: 0 },
    { id: "with_products", label: "With Products", count: 0 },
    { id: "parent_categories", label: "Parent Categories", count: 0 },
  ]

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

  // Get status counts for tabs
  const getStatusCount = useCallback((tab: typeof statusTab) => {
    switch (tab) {
      case "all":
        return categories.length
      case "trending":
        return categories.filter(c => c.trending).length
      case "high_profit":
        return categories.filter(c => c.avg_profit_margin !== null && c.avg_profit_margin > 40).length
      case "high_growth":
        return categories.filter(c => c.growth_percentage !== null && c.growth_percentage > 15).length
      default:
        return 0
    }
  }, [categories])

  const filteredCategories = useMemo(() => {
    let filtered = categories.filter((category) => {
      // Status tab filter
      if (statusTab !== "all") {
        switch (statusTab) {
          case "trending":
            if (!category.trending) return false
            break
          case "high_profit":
            if (category.avg_profit_margin === null || category.avg_profit_margin <= 40) return false
            break
          case "high_growth":
            if (category.growth_percentage === null || category.growth_percentage <= 15) return false
            break
        }
      }

      // Date range filter
      if (dateRange.from || dateRange.to) {
        const categoryDate = new Date(category.created_at)
        if (dateRange.from && categoryDate < dateRange.from) return false
        if (dateRange.to) {
          const toDate = new Date(dateRange.to)
          toDate.setHours(23, 59, 59, 999)
          if (categoryDate > toDate) return false
        }
      }

      // Quick filter - support overlapping filters
      if (quickFilter) {
        switch (quickFilter) {
          case "trending":
            if (!category.trending) return false
            break
          case "high_profit":
            if (category.avg_profit_margin === null || category.avg_profit_margin <= 40) return false
            break
          case "high_growth":
            if (category.growth_percentage === null || category.growth_percentage <= 15) return false
            break
          case "with_products":
            if (category.product_count === 0) return false
            break
          case "parent_categories":
            if (category.parent_category_id !== null) return false
            break
        }
      }

      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase()
        const matchesSearch =
          category.name.toLowerCase().includes(searchLower) ||
          category.slug.toLowerCase().includes(searchLower) ||
          (category.description && category.description.toLowerCase().includes(searchLower))
        if (!matchesSearch) return false
      }

      const parentFilter = columnFilters.find((f) => f.id === "parent_category")
      if (parentFilter && parentFilter.value && Array.isArray(parentFilter.value) && parentFilter.value.length > 0) {
        // Filter by parent category ID (filter values are category IDs)
        const parentId = category.parent_category_id || ""
        // Handle "None" case - empty string means no parent
        const filterValues = parentFilter.value.map((v: string) => v === "" ? null : v)
        if (!filterValues.includes(parentId)) return false
      }

      const trendingFilter = columnFilters.find((f) => f.id === "trending")
      if (trendingFilter && trendingFilter.value && Array.isArray(trendingFilter.value) && trendingFilter.value.length > 0) {
        const isTrending = trendingFilter.value.includes("trending")
        const isNotTrending = trendingFilter.value.includes("not-trending")
        if (isTrending && !category.trending) return false
        if (isNotTrending && category.trending) return false
      }

      return true
    })

    if (sorting.length > 0) {
      const sort = sorting[0]
      filtered.sort((a, b) => {
        let aValue: any = a[sort.id as keyof ProductCategory]
        let bValue: any = b[sort.id as keyof ProductCategory]
        if (aValue < bValue) return sort.desc ? 1 : -1
        if (aValue > bValue) return sort.desc ? -1 : 1
        return 0
      })
    }

    return filtered
  }, [categories, searchQuery, columnFilters, sorting, statusTab, quickFilter, dateRange])

  const paginatedCategories = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return filteredCategories.slice(start, end)
  }, [filteredCategories, page, pageSize])

  useEffect(() => {
    setPageCount(Math.ceil(filteredCategories.length / pageSize))
    setInitialLoading(false)
  }, [filteredCategories.length, pageSize])

  // Transform API Category to ProductCategory
  const transformToProductCategory = (category: Category): ProductCategory => {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image: category.image,
      thumbnail: category.thumbnail || null,
      parent_category_id: category.parent_category_id,
      parent_category: category.parent_category ? {
        id: category.parent_category.id,
        name: category.parent_category.name,
        slug: category.parent_category.slug,
      } : undefined,
      trending: category.trending || false,
      product_count: category.product_count || 0,
      avg_profit_margin: category.avg_profit_margin || null,
      growth_percentage: category.growth_percentage || null,
      created_at: category.created_at,
      updated_at: category.updated_at,
    }
  }

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/categories?include_subcategories=true')
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }
      
      const data = await response.json()
      const transformed = (data.categories || []).map(transformToProductCategory)
      setCategories(transformed)
    } catch (err) {
      console.error("Error fetching categories:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to load categories. Please try again."
      setError(errorMessage)
      showError(errorMessage)
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }, [showError])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleViewDetails = useCallback((category: ProductCategory) => {
    router.push(`/admin/categories/${category.id}`)
  }, [router])

  const handleQuickView = useCallback((category: ProductCategory) => {
    setSelectedCategory(category)
    setQuickViewOpen(true)
  }, [])

  const handleDelete = useCallback((category: ProductCategory) => {
    if (!canDelete) {
      showError("You don't have permission to delete categories")
      return
    }
    setCategoryToDelete(category)
    setDeleteConfirmOpen(true)
  }, [canDelete, showError])

  const confirmDelete = async () => {
    if (!categoryToDelete) return
    try {
      const response = await fetch(`/api/admin/categories/${categoryToDelete.id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete category')
      }
      
      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id))
      setSelectedCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id))
      setDeleteConfirmOpen(false)
      setCategoryToDelete(null)
      showSuccess(`Category "${categoryToDelete.name}" deleted successfully`)
      await fetchCategories()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to delete category")
    }
  }

  const handleBulkDelete = async () => {
    if (selectedCategories.length === 0) return
    if (!canDelete) {
      showError("You don't have permission to delete categories")
      return
    }
    setBulkActionLoading("delete")
    try {
      // Delete all selected categories
      const deletePromises = selectedCategories.map(category =>
        fetch(`/api/admin/categories/${category.id}`, { method: 'DELETE' })
      )
      const results = await Promise.allSettled(deletePromises)
      const failed = results.filter(r => r.status === 'rejected').length
      
      if (failed > 0) {
        showError(`Failed to delete ${failed} category(ies)`)
      }
      
      const deletedCount = selectedCategories.length - failed
      setCategories((prev) => prev.filter((c) => !selectedCategories.some((sc) => sc.id === c.id)))
      setSelectedCategories([])
      if (deletedCount > 0) {
        showSuccess(`${deletedCount} category(ies) deleted successfully`)
      }
      await fetchCategories()
    } catch (err) {
      showError("Failed to delete categories")
    } finally {
      setBulkActionLoading(null)
    }
  }

  const handleBulkToggleTrending = async () => {
    if (selectedCategories.length === 0) return
    if (!canEdit) {
      showError("You don't have permission to edit categories")
      return
    }
    setBulkActionLoading("toggle-trending")
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const newTrendingState = !selectedCategories[0]?.trending
      setCategories((prev) =>
        prev.map((c) =>
          selectedCategories.some((sc) => sc.id === c.id)
            ? { ...c, trending: newTrendingState, updated_at: new Date().toISOString() }
            : c
        )
      )
      setSelectedCategories([])
      showSuccess(`${selectedCategories.length} category(ies) ${newTrendingState ? "marked as trending" : "removed from trending"}`)
      await fetchCategories()
    } catch (err) {
      showError("Failed to update categories")
    } finally {
      setBulkActionLoading(null)
    }
  }

  const handleCopyCategoryId = useCallback(async (category: ProductCategory) => {
    try {
      await navigator.clipboard.writeText(category.id)
      showSuccess("Category ID copied to clipboard")
    } catch (err) {
      showError("Failed to copy Category ID")
    }
  }, [showSuccess, showError])

  const handleCopySlug = useCallback(async (category: ProductCategory) => {
    try {
      await navigator.clipboard.writeText(category.slug)
      showSuccess("Slug copied to clipboard")
    } catch (err) {
      showError("Failed to copy slug")
    }
  }, [showSuccess, showError])

  const handleToggleTrending = useCallback(async (category: ProductCategory) => {
    if (!canEdit) {
      showError("You don't have permission to edit categories")
      return
    }
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setCategories((prev) =>
        prev.map((c) =>
          c.id === category.id
            ? { ...c, trending: !c.trending, updated_at: new Date().toISOString() }
            : c
        )
      )
      showSuccess(`Category ${!category.trending ? "marked as trending" : "removed from trending"}`)
      await fetchCategories()
    } catch (err) {
      showError("Failed to update category")
    }
  }, [canEdit, showSuccess, showError, fetchCategories])

  const handleViewProducts = useCallback((category: ProductCategory) => {
    router.push(`/admin/products?category=${category.id}`)
  }, [router])

  const handleViewSubcategories = useCallback((category: ProductCategory) => {
    // Filter to show only subcategories of this category
    setColumnFilters((prev) => {
      const existing = prev.find((f) => f.id === "parent_category")
      if (existing) {
        return prev.map((f) =>
          f.id === "parent_category" ? { ...f, value: [category.id] } : f
        )
      }
      return [...prev, { id: "parent_category", value: [category.id] }]
    })
  }, [])

  const handleDuplicate = useCallback(async (category: ProductCategory) => {
    if (!canCreate) {
      showError("You don't have permission to create categories")
      return
    }
    // TODO: Implement duplicate functionality
    showInfo(`Duplicate functionality will be implemented. Category: ${category.name}`)
  }, [canCreate, showError, showInfo])

  const handleEdit = useCallback((category: ProductCategory) => {
    if (!canEdit) {
      showError("You don't have permission to edit categories")
      return
    }
    router.push(`/admin/categories/${category.id}`)
  }, [canEdit, router, showError])

  const handleBulkExport = useCallback(() => {
    if (selectedCategories.length === 0) {
      showError("No categories selected for export")
      return
    }
    try {
      const csv = [
        ["Category ID", "Name", "Slug", "Parent Category", "Products", "Avg Profit Margin", "Growth %", "Trending", "Created At"],
        ...selectedCategories.map((category) => [
          category.id,
          category.name,
          category.slug,
          category.parent_category?.name || "None",
          category.product_count.toString(),
          category.avg_profit_margin?.toFixed(1) || "",
          category.growth_percentage?.toFixed(1) || "",
          category.trending ? "Yes" : "No",
          new Date(category.created_at).toLocaleString(),
        ]),
      ]
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n")

      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `selected-categories-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
      showSuccess(`Exported ${selectedCategories.length} category(ies) to CSV`)
    } catch (err) {
      showError("Failed to export categories")
    }
  }, [selectedCategories, showSuccess, showError])

  const handleRowClick = useCallback((category: ProductCategory) => {
    setSelectedCategory(category)
    setQuickViewOpen(true)
  }, [])

  const columns = useMemo(() => {
    return createCategoriesColumns({
      onViewDetails: handleViewDetails,
      onQuickView: handleQuickView,
      onEdit: handleEdit,
      onDelete: handleDelete,
      onCopyCategoryId: handleCopyCategoryId,
      onCopySlug: handleCopySlug,
      onToggleTrending: handleToggleTrending,
      onViewProducts: handleViewProducts,
      onViewSubcategories: handleViewSubcategories,
      onDuplicate: handleDuplicate,
      canEdit,
      canDelete,
    })
  }, [
    handleViewDetails,
    handleQuickView,
    handleEdit,
    handleDelete,
    handleCopyCategoryId,
    handleCopySlug,
    handleToggleTrending,
    handleViewProducts,
    handleViewSubcategories,
    handleDuplicate,
    canEdit,
    canDelete,
  ])

  const parentOptions = parentCategories.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }))

  const trendingOptions = [
    { label: "Trending", value: "trending" },
    { label: "Not Trending", value: "not-trending" },
  ]

  const secondaryButtons = useMemo(() => {
    if (selectedCategories.length > 0) {
      return [
        {
          label: bulkActionLoading === "toggle-trending" ? "Updating..." : "Toggle Trending",
          icon: bulkActionLoading === "toggle-trending" ? <Loader size="sm" className="mr-2" /> : <TrendingUp className="h-4 w-4" />,
          onClick: handleBulkToggleTrending,
          variant: "outline" as const,
          disabled: !canEdit || bulkActionLoading !== null,
          tooltip: !canEdit ? "You don't have permission to edit categories" : undefined,
        },
        {
          label: "Export Selected",
          icon: <Download className="h-4 w-4" />,
          onClick: handleBulkExport,
          variant: "outline" as const,
        },
        {
          label: bulkActionLoading === "delete" ? "Deleting..." : "Delete Selected",
          icon: bulkActionLoading === "delete" ? <Loader size="sm" className="mr-2" /> : <Trash2 className="h-4 w-4" />,
          onClick: handleBulkDelete,
          variant: "destructive" as const,
          disabled: !canDelete || bulkActionLoading !== null,
          tooltip: !canDelete ? "You don't have permission to delete categories" : undefined,
        },
        {
          label: "Clear Selection",
          onClick: () => setSelectedCategories([]),
          variant: "ghost" as const,
                },
              ]
            } else {
              return []
            }
  }, [selectedCategories, bulkActionLoading, canEdit, canDelete, handleBulkToggleTrending, handleBulkDelete, handleBulkExport])

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="text-xl font-semibold leading-[1.35] tracking-tight text-foreground">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">Organize products into categories</p>
        </div>
      </div>

      {!initialLoading && categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-card border rounded-lg p-4 shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total Categories</span>
              <div className="w-9 h-9 rounded-lg border flex items-center justify-center">
                <Folder className="h-[18px] w-[18px] text-primary" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-semibold">{categories.length}</span>
            </div>
            <div className="mt-2">
              <span className="text-xs text-muted-foreground">All product categories</span>
            </div>
          </div>
          <div className="bg-card border rounded-lg p-4 shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total Products</span>
              <div className="w-9 h-9 rounded-lg border flex items-center justify-center">
                <Package className="h-[18px] w-[18px] text-primary" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-semibold">{categories.reduce((sum, c) => sum + (c.product_count || 0), 0)}</span>
            </div>
            <div className="mt-2">
              <span className="text-xs text-muted-foreground">Products across all categories</span>
            </div>
          </div>
          <div className="bg-card border rounded-lg p-4 shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Avg Products per Category</span>
              <div className="w-9 h-9 rounded-lg border flex items-center justify-center">
                <BarChart3 className="h-[18px] w-[18px] text-primary" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-semibold">{categories.length > 0 ? Math.round(categories.reduce((sum, c) => sum + (c.product_count || 0), 0) / categories.length) : 0}</span>
            </div>
            <div className="mt-2">
              <span className="text-xs text-muted-foreground">Average products per category</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCategories}
            className="mt-2 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      )}

      {initialLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Loading categories...</div>
        </div>
      ) : (
        <>
          {/* Status Tabs */}
          <div className="mb-3">
            <Tabs value={statusTab} onValueChange={(v) => setStatusTab(v as typeof statusTab)}>
              <TabsList className="h-9">
                <TabsTrigger value="all" className="cursor-pointer">
                  All
                  <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5 text-xs">
                    {getStatusCount("all")}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="trending" className="cursor-pointer">
                  Trending
                  <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5 text-xs">
                    {getStatusCount("trending")}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="high_profit" className="cursor-pointer">
                  High Profit
                  <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5 text-xs">
                    {getStatusCount("high_profit")}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="high_growth" className="cursor-pointer">
                  High Growth
                  <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5 text-xs">
                    {getStatusCount("high_growth")}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* DataTable */}
          <div className="flex-1 overflow-hidden min-h-0">
            <DataTable
              columns={columns}
              data={paginatedCategories}
              pageCount={pageCount}
              onPaginationChange={(p, s) => {
                setPage(p)
                setPageSize(s)
              }}
              onSortingChange={setSorting}
              onFilterChange={setColumnFilters}
              onSearchChange={setSearchQuery}
              loading={loading}
              initialLoading={initialLoading}
              filterConfig={[
                {
                  columnId: "parent_category",
                  title: "Parent Category",
                  options: [{ label: "None", value: "" }, ...parentOptions],
                },
                {
                  columnId: "trending",
                  title: "Trending Status",
                  options: trendingOptions,
                },
              ]}
              searchPlaceholder="Search categories..."
              page={page}
              pageSize={pageSize}
              enableRowSelection={true}
              onRowSelectionChange={setSelectedCategories}
              onRowClick={handleRowClick}
              onDateRangeChange={setDateRange}
              quickFilters={quickFilters}
              selectedQuickFilter={quickFilter}
              onQuickFilterChange={(filterId) => setQuickFilter(quickFilter === filterId ? null : filterId)}
              secondaryButtons={secondaryButtons}
            />
          </div>
        </>
      )}

      {/* Quick View Modal - Enhanced */}
      {selectedCategory && (
        <Dialog 
          open={quickViewOpen} 
          onOpenChange={(open) => {
            setQuickViewOpen(open)
            if (!open) {
              setSelectedCategory(null)
            }
          }}
        >
          <DialogContent className="max-w-xs p-4">
            <DialogHeader className="pb-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                  {selectedCategory.image ? (
                    <Image
                      src={selectedCategory.image}
                      alt={selectedCategory.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <DialogTitle className="text-base truncate">{selectedCategory.name}</DialogTitle>
                  <DialogDescription className="text-xs truncate">{selectedCategory.slug}</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-2 py-2">
              {selectedCategory.parent_category && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">Parent Category</span>
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    {selectedCategory.parent_category.name}
                  </Badge>
                </div>
              )}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">Products</span>
                <span className="text-xs font-medium">{selectedCategory.product_count}</span>
              </div>
              {selectedCategory.avg_profit_margin !== null && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">Avg Profit Margin</span>
                  <span className="text-xs font-medium text-emerald-600">
                    {selectedCategory.avg_profit_margin.toFixed(1)}%
                  </span>
                </div>
              )}
              {selectedCategory.growth_percentage !== null && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">Growth</span>
                  <div className="flex items-center gap-1">
                    {selectedCategory.growth_percentage > 0 ? (
                      <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-destructive" />
                    )}
                    <span className="text-xs font-medium">
                      {selectedCategory.growth_percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">Status</span>
                <Badge variant={selectedCategory.trending ? "default" : "outline"} className="text-xs px-2 py-0.5">
                  {selectedCategory.trending ? (
                    <>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </>
                  ) : (
                    "Not Trending"
                  )}
                </Badge>
              </div>
            </div>
            <DialogFooter className="pt-3 border-t mt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setQuickViewOpen(false)
                  handleViewDetails(selectedCategory)
                }}
                className="w-full text-sm h-8 cursor-pointer"
              >
                View More Details
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Detail Drawer */}
      {selectedCategory && (
        <DetailDrawer
          open={detailDrawerOpen}
          onOpenChange={setDetailDrawerOpen}
          title={selectedCategory.name}
          tabs={[
            {
              value: "overview",
              label: "Overview",
              content: (
                <div className="space-y-6">
                  {selectedCategory.image && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={selectedCategory.image}
                        alt={selectedCategory.name}
                        fill
                        className="object-cover"
                        sizes="100%"
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Slug</p>
                      <p className="text-sm font-mono">{selectedCategory.slug}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <Badge variant={selectedCategory.trending ? "default" : "outline"}>
                        {selectedCategory.trending ? "Trending" : "Not Trending"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Products</p>
                      <p className="text-lg font-semibold">{selectedCategory.product_count}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Avg Profit Margin</p>
                      <p className="text-lg font-semibold text-emerald-600">
                        {selectedCategory.avg_profit_margin ? `${selectedCategory.avg_profit_margin.toFixed(1)}%` : "—"}
                      </p>
                    </div>
                  </div>
                  {selectedCategory.description && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Description</p>
                      <p className="text-sm">{selectedCategory.description}</p>
                    </div>
                  )}
                </div>
              ),
            },
            {
              value: "stats",
              label: "Statistics",
              content: (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Product Count</p>
                    <p className="text-2xl font-bold">{selectedCategory.product_count}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Average Profit Margin</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {selectedCategory.avg_profit_margin ? `${selectedCategory.avg_profit_margin.toFixed(1)}%` : "—"}
                    </p>
                  </div>
                  {selectedCategory.growth_percentage !== null && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Growth Percentage</p>
                      <p className="text-2xl font-bold">{selectedCategory.growth_percentage.toFixed(1)}%</p>
                    </div>
                  )}
                </div>
              ),
            },
          ]}
          headerActions={
            <Button variant="destructive" size="sm" onClick={() => handleDelete(selectedCategory)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          }
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {categoryToDelete && (
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Category:</span> {categoryToDelete.name}
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
