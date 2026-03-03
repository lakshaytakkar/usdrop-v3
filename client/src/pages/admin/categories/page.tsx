import { apiFetch } from '@/lib/supabase'
import { useState, useMemo, useEffect, useCallback } from "react"
import { useRouter } from "@/hooks/use-router"
import { SortingState, ColumnFiltersState } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Trash2, TrendingUp, Download, RefreshCw, Package, Folder, BarChart3, ChevronRight, ChevronDown, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Loader } from "@/components/ui/loader"
import { ProductCategory } from "@/types/admin/categories"
import { Category } from "@/types/categories"
import { useToast } from "@/hooks/use-toast"
import { useHasPermission } from "@/hooks/use-has-permission"
import { DataTable } from "@/components/data-table/data-table"
import { createCategoriesColumns } from "./components/categories-columns"
import {
  AdminPageHeader,
  AdminStatCards,
  AdminFilterBar,
  AdminActionBar,
  AdminEmptyState,
} from "@/components/admin"

export default function AdminCategoriesPage() {
  const router = useRouter()
  const { showSuccess, showError, showInfo } = useToast()

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
  const [statusTab, setStatusTab] = useState<string>("all")
  const [quickFilter, setQuickFilter] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<ProductCategory | null>(null)
  const [bulkActionLoading, setBulkActionLoading] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<string>("table")
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set())

  const parentCategories = useMemo(() => {
    return categories.filter((cat) => !cat.parent_category_id)
  }, [categories])

  const getStatusCount = useCallback((tab: string) => {
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

  const statCards = useMemo(() => {
    const totalProducts = categories.reduce((sum, c) => sum + (c.product_count || 0), 0)
    const avgProducts = categories.length > 0 ? Math.round(totalProducts / categories.length) : 0
    const trendingCount = categories.filter(c => c.trending).length
    return [
      {
        label: "Total Categories",
        value: categories.length,
        icon: Folder,
        description: "All product categories",
      },
      {
        label: "Total Products",
        value: totalProducts,
        icon: Package,
        description: "Products across all categories",
      },
      {
        label: "Trending",
        value: trendingCount,
        icon: TrendingUp,
        badge: trendingCount > 0 ? `${Math.round((trendingCount / Math.max(categories.length, 1)) * 100)}%` : undefined,
        badgeVariant: "success" as const,
        description: "Currently trending",
      },
      {
        label: "Avg Products/Category",
        value: avgProducts,
        icon: BarChart3,
        description: "Average products per category",
      },
    ]
  }, [categories])

  const filteredCategories = useMemo(() => {
    let filtered = categories.filter((category) => {
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

      if (dateRange.from || dateRange.to) {
        const categoryDate = new Date(category.created_at)
        if (dateRange.from && categoryDate < dateRange.from) return false
        if (dateRange.to) {
          const toDate = new Date(dateRange.to)
          toDate.setHours(23, 59, 59, 999)
          if (categoryDate > toDate) return false
        }
      }

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
        const parentId = category.parent_category_id || ""
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

      const response = await apiFetch("/api/admin/categories?include_subcategories=true")
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
    handleViewDetails(category)
  }, [handleViewDetails])

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
      const response = await apiFetch(`/api/admin/categories/${categoryToDelete.id}`, {
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
      const deletePromises = selectedCategories.map(category =>
        apiFetch(`/api/admin/categories/${category.id}`, { method: 'DELETE' })
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
    showInfo(`Duplicate functionality will be implemented. Category: ${category.name}`)
  }, [canCreate, showError, showInfo])

  const handleEdit = useCallback((category: ProductCategory) => {
    if (!canEdit) {
      showError("You don't have permission to edit categories")
      return
    }
    router.push(`/admin/categories/${category.id}`)
  }, [canEdit, router, showError])

  const handleAddCategory = useCallback(() => {
    if (!canCreate) {
      showError("You don't have permission to create categories")
      return
    }
    showInfo("Add category functionality will be implemented")
  }, [canCreate, showError, showInfo])

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

  const quickFilters = [
    { id: "trending", label: "Trending", count: categories.filter(c => c.trending).length },
    { id: "high_profit", label: "High Profit", count: categories.filter(c => c.avg_profit_margin !== null && c.avg_profit_margin > 40).length },
    { id: "high_growth", label: "High Growth", count: categories.filter(c => c.growth_percentage !== null && c.growth_percentage > 15).length },
    { id: "with_products", label: "With Products", count: categories.filter(c => c.product_count > 0).length },
    { id: "parent_categories", label: "Parent Only", count: categories.filter(c => !c.parent_category_id).length },
  ]

  const toggleParentExpand = useCallback((parentId: string) => {
    setExpandedParents(prev => {
      const next = new Set(prev)
      if (next.has(parentId)) {
        next.delete(parentId)
      } else {
        next.add(parentId)
      }
      return next
    })
  }, [])

  const treeData = useMemo(() => {
    const parents = filteredCategories.filter(c => !c.parent_category_id)
    const childMap = new Map<string, ProductCategory[]>()
    filteredCategories.forEach(c => {
      if (c.parent_category_id) {
        const existing = childMap.get(c.parent_category_id) || []
        existing.push(c)
        childMap.set(c.parent_category_id, existing)
      }
    })
    return { parents, childMap }
  }, [filteredCategories])

  const renderTreeView = useCallback(() => {
    const { parents, childMap } = treeData
    if (parents.length === 0) {
      return (
        <AdminEmptyState
          icon={Folder}
          title="No categories found"
          description="Try adjusting your search or filters"
        />
      )
    }
    return (
      <div className="space-y-1 p-4" data-testid="tree-view">
        {parents.map(parent => {
          const children = childMap.get(parent.id) || []
          const isExpanded = expandedParents.has(parent.id)
          return (
            <div key={parent.id}>
              <div
                className="flex items-center gap-2 p-2.5 rounded-md hover-elevate cursor-pointer border"
                onClick={() => handleViewDetails(parent)}
                data-testid={`tree-item-${parent.id}`}
              >
                {children.length > 0 ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleParentExpand(parent.id)
                    }}
                    data-testid={`expand-${parent.id}`}
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5" />
                    )}
                  </Button>
                ) : (
                  <div className="w-6 h-6 shrink-0" />
                )}
                <div className="relative w-8 h-8 rounded-md overflow-hidden bg-muted shrink-0">
                  {parent.image ? (
                    <img src={parent.image} alt={parent.name} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Folder className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{parent.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{parent.slug}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="secondary" className="text-xs">
                    {parent.product_count} products
                  </Badge>
                  {children.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {children.length} sub
                    </Badge>
                  )}
                  {parent.trending && (
                    <Badge variant="default" className="text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>
              </div>
              {isExpanded && children.length > 0 && (
                <div className="ml-8 mt-1 space-y-1 border-l pl-4">
                  {children.map(child => (
                    <div
                      key={child.id}
                      className="flex items-center gap-2 p-2 rounded-md hover-elevate cursor-pointer border"
                      onClick={() => handleViewDetails(child)}
                      data-testid={`tree-item-${child.id}`}
                    >
                      <div className="relative w-7 h-7 rounded-md overflow-hidden bg-muted shrink-0">
                        {child.image ? (
                          <img src={child.image} alt={child.name} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Folder className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{child.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{child.slug}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="secondary" className="text-xs">
                          {child.product_count} products
                        </Badge>
                        {child.trending && (
                          <Badge variant="default" className="text-xs">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }, [treeData, expandedParents, handleViewDetails, toggleParentExpand])

  const secondaryButtons = useMemo(() => {
    if (selectedCategories.length > 0) {
      return [
        {
          label: bulkActionLoading === "toggle-trending" ? "Updating..." : "Toggle Trending",
          icon: <TrendingUp className="h-4 w-4" />,
          onClick: handleBulkToggleTrending,
          variant: "outline" as const,
          disabled: !canEdit || bulkActionLoading !== null,
        },
        {
          label: "Export Selected",
          icon: <Download className="h-4 w-4" />,
          onClick: handleBulkExport,
          variant: "outline" as const,
        },
        {
          label: bulkActionLoading === "delete" ? "Deleting..." : "Delete Selected",
          icon: <Trash2 className="h-4 w-4" />,
          onClick: handleBulkDelete,
          variant: "destructive" as const,
          disabled: !canDelete || bulkActionLoading !== null,
        },
      ]
    }
    return []
  }, [selectedCategories, bulkActionLoading, canEdit, canDelete, handleBulkToggleTrending, handleBulkDelete, handleBulkExport])

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden p-6 gap-4" data-testid="admin-categories-page">
      <AdminPageHeader
        title="Categories"
        description="Organize products into categories and subcategories"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Categories" },
        ]}
        actions={[
          {
            label: "Refresh",
            icon: <RefreshCw className="h-4 w-4" />,
            onClick: fetchCategories,
            variant: "outline",
          },
          {
            label: "Add Category",
            icon: <Plus className="h-4 w-4" />,
            onClick: handleAddCategory,
            disabled: !canCreate,
          },
        ]}
      />

      <AdminStatCards
        stats={statCards}
        loading={initialLoading}
        columns={4}
      />

      {selectedCategories.length > 0 && (
        <AdminActionBar
          selectedCount={selectedCategories.length}
          onClearSelection={() => setSelectedCategories([])}
          actions={[
            {
              label: "Toggle Trending",
              icon: <TrendingUp className="h-4 w-4" />,
              onClick: handleBulkToggleTrending,
              disabled: !canEdit,
              loading: bulkActionLoading === "toggle-trending",
            },
            {
              label: "Export",
              icon: <Download className="h-4 w-4" />,
              onClick: handleBulkExport,
            },
            {
              label: "Delete",
              icon: <Trash2 className="h-4 w-4" />,
              onClick: handleBulkDelete,
              variant: "destructive",
              disabled: !canDelete,
              loading: bulkActionLoading === "delete",
            },
          ]}
        />
      )}

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCategories}
            className="mt-2 cursor-pointer"
            data-testid="button-retry"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      )}

      <AdminFilterBar
        search={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search categories by name or slug..."
        tabs={[
          { value: "all", label: "All", count: getStatusCount("all") },
          { value: "trending", label: "Trending", count: getStatusCount("trending") },
          { value: "high_profit", label: "High Profit", count: getStatusCount("high_profit") },
          { value: "high_growth", label: "High Growth", count: getStatusCount("high_growth") },
        ]}
        activeTab={statusTab}
        onTabChange={setStatusTab}
      >
        <div className="flex items-center gap-1 border rounded-md p-0.5" data-testid="view-toggle">
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => setViewMode("table")}
            data-testid="button-view-table"
          >
            Table
          </Button>
          <Button
            variant={viewMode === "tree" ? "default" : "ghost"}
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => setViewMode("tree")}
            data-testid="button-view-tree"
          >
            Tree
          </Button>
        </div>
      </AdminFilterBar>

      {initialLoading ? (
        <div className="flex items-center justify-center p-8 flex-1">
          <Loader size="lg" />
        </div>
      ) : categories.length === 0 && !error ? (
        <AdminEmptyState
          icon={Folder}
          title="No categories yet"
          description="Create your first category to organize products"
          actionLabel="Add Category"
          onAction={handleAddCategory}
        />
      ) : viewMode === "tree" ? (
        <div className="flex-1 overflow-y-auto border rounded-md min-h-0">
          {renderTreeView()}
        </div>
      ) : (
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
            onRowClick={handleViewDetails}
            onDateRangeChange={setDateRange}
            quickFilters={quickFilters}
            selectedQuickFilter={quickFilter}
            onQuickFilterChange={(filterId) => setQuickFilter(quickFilter === filterId ? null : filterId)}
            secondaryButtons={secondaryButtons}
          />
        </div>
      )}

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
              <p className="text-sm" data-testid="text-delete-category-name">
                <span className="font-medium">Category:</span> {categoryToDelete.name}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} data-testid="button-cancel-delete">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} data-testid="button-confirm-delete">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
