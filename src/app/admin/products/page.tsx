"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ColumnDef, SortingState, ColumnFiltersState } from "@tanstack/react-table"
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
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Plus, Lock, LockOpen, Trash2, MoreVertical, Eye, Star, DollarSign, TrendingUp, Package, Building, Copy, Edit, Download, RefreshCw, Calendar, ArrowUpRight, UserPlus, X, Search, Upload } from "lucide-react"
import Image from "next/image"
import { DataTable } from "@/components/data-table/data-table"
import { createHandPickedColumns } from "./components/hand-picked-columns"
import { createProductPicksColumns } from "./components/product-picks-columns"
import { HandPickedProduct, ProductPick } from "@/types/admin/products"
import { sampleHandPickedProducts, sampleProductPicks } from "./data/products"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { useHasPermission } from "@/hooks/use-has-permission"
import { Loader } from "@/components/ui/loader"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { sampleInternalUsers } from "@/app/admin/internal-users/data/users"
import { InternalUser } from "@/types/admin/users"
import { getAvatarUrl } from "@/lib/utils/avatar"

type ProductType = "hand-picked" | "product-picks"
type ProductUnion = HandPickedProduct | ProductPick

export default function AdminProductsPage() {
  const router = useRouter()
  const { showSuccess, showError, showInfo } = useToast()
  
  // Permission checks
  const { hasPermission: canView } = useHasPermission("products.view")
  const { hasPermission: canViewHandPicked } = useHasPermission("products.view_hand_picked")
  const { hasPermission: canViewProductPicks } = useHasPermission("products.view_product_picks")
  const { hasPermission: canEdit } = useHasPermission("products.edit")
  const { hasPermission: canCreate } = useHasPermission("products.create")
  const { hasPermission: canDelete } = useHasPermission("products.delete")
  const { hasPermission: canLockUnlock } = useHasPermission("products.lock_unlock")
  
  const [handPickedProducts, setHandPickedProducts] = useState<HandPickedProduct[]>(sampleHandPickedProducts)
  const [productPicks, setProductPicks] = useState<ProductPick[]>(sampleProductPicks)
  const [activeTab, setActiveTab] = useState<ProductType>("hand-picked")
  const [selectedProducts, setSelectedProducts] = useState<ProductUnion[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [statusTab, setStatusTab] = useState<"all" | "locked" | "unlocked" | "high_profit" | "high_revenue">("all")
  const [statusTabPicks, setStatusTabPicks] = useState<"all" | "high_profit" | "high_rated" | "with_supplier" | "recent">("all")
  const [quickFilter, setQuickFilter] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined })
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductUnion | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<ProductUnion | null>(null)
  const [bulkActionLoading, setBulkActionLoading] = useState<string | null>(null)
  const [assigneeModalOpen, setAssigneeModalOpen] = useState(false)
  const [assignedOwner, setAssignedOwner] = useState<string | null>(null)
  const [assignedMembers, setAssignedMembers] = useState<string[]>([])
  const [memberSearch, setMemberSearch] = useState("")
  const [tempOwner, setTempOwner] = useState<string | null>(null)
  const [tempMembers, setTempMembers] = useState<string[]>([])
  
  const internalUsers = sampleInternalUsers

  // Quick filters per product type
  const handPickedQuickFilters = [
    { id: "high_profit", label: "High Profit", icon: DollarSign },
    { id: "high_revenue", label: "High Revenue", icon: TrendingUp },
    { id: "locked", label: "Locked", icon: Lock },
    { id: "unlocked", label: "Unlocked", icon: LockOpen },
    { id: "recent", label: "Recent", icon: Calendar },
  ]

  const productPicksQuickFilters = [
    { id: "high_profit", label: "High Profit", icon: DollarSign },
    { id: "high_rated", label: "High Rated", icon: Star },
    { id: "with_supplier", label: "With Supplier", icon: Building },
    { id: "recent", label: "Recent", icon: Calendar },
    { id: "trending", label: "Trending", icon: TrendingUp },
  ]


  const categories = useMemo(() => {
    const products = activeTab === "hand-picked" ? handPickedProducts : productPicks
    const categorySet = new Set(products.map((p) => p.category))
    return Array.from(categorySet)
  }, [activeTab, handPickedProducts, productPicks])

  const filteredProducts = useMemo(() => {
    const products = activeTab === "hand-picked" ? handPickedProducts : productPicks

    let filtered = products.filter((product) => {
      // Status tab filter
      if (activeTab === "hand-picked") {
        const hp = product as HandPickedProduct
        if (statusTab !== "all") {
          switch (statusTab) {
            case "locked":
              if (!hp.is_locked) return false
              break
            case "unlocked":
              if (hp.is_locked) return false
              break
            case "high_profit":
              if (hp.profit_margin <= 40) return false
              break
            case "high_revenue":
              if (hp.pot_revenue <= 10000) return false
              break
          }
        }
      } else {
        const pp = product as ProductPick
        if (statusTabPicks !== "all") {
          switch (statusTabPicks) {
            case "high_profit":
              if (pp.profit_per_order <= 50) return false
              break
            case "high_rated":
              if (!pp.rating || pp.rating <= 4.0) return false
              break
            case "with_supplier":
              if (!pp.supplier) return false
              break
            case "recent":
              const weekAgo = new Date()
              weekAgo.setDate(weekAgo.getDate() - 7)
              if (new Date(pp.created_at) < weekAgo) return false
              break
          }
        }
      }

      // Date range filter
      if (dateRange.from || dateRange.to) {
        const productDate = new Date(activeTab === "hand-picked" ? (product as HandPickedProduct).found_date : product.created_at)
        if (dateRange.from && productDate < dateRange.from) return false
        if (dateRange.to) {
          const toDate = new Date(dateRange.to)
          toDate.setHours(23, 59, 59, 999)
          if (productDate > toDate) return false
        }
      }

      // Quick filter - support overlapping filters
      if (quickFilter) {
        if (activeTab === "hand-picked") {
          const hp = product as HandPickedProduct
          switch (quickFilter) {
            case "high_profit":
              if (hp.profit_margin <= 40) return false
              break
            case "high_revenue":
              if (hp.pot_revenue <= 10000) return false
              break
            case "locked":
              if (!hp.is_locked) return false
              break
            case "unlocked":
              if (hp.is_locked) return false
              break
            case "recent":
              const weekAgo = new Date()
              weekAgo.setDate(weekAgo.getDate() - 7)
              if (new Date(hp.found_date) < weekAgo) return false
              break
          }
        } else {
          const pp = product as ProductPick
          switch (quickFilter) {
            case "high_profit":
              if (pp.profit_per_order <= 50) return false
              break
            case "high_rated":
              if (!pp.rating || pp.rating <= 4.0) return false
              break
            case "with_supplier":
              if (!pp.supplier) return false
              break
            case "recent":
              const weekAgo = new Date()
              weekAgo.setDate(weekAgo.getDate() - 7)
              if (new Date(pp.created_at) < weekAgo) return false
              break
            case "trending":
              if (!pp.trend_data || pp.trend_data.length < 2) return false
              const isTrending = pp.trend_data[pp.trend_data.length - 1] > pp.trend_data[0]
              if (!isTrending) return false
              break
          }
        }
      }

      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase()
        const matchesSearch =
          product.title.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower) ||
          (activeTab === "hand-picked" && (product as HandPickedProduct).supplier_info?.name?.toLowerCase().includes(searchLower)) ||
          (activeTab === "product-picks" && (product as ProductPick).supplier?.name?.toLowerCase().includes(searchLower))
        if (!matchesSearch) return false
      }

      // Category filter from column filters
      const categoryFilter = columnFilters.find((f) => f.id === "category")
      if (categoryFilter && categoryFilter.value && Array.isArray(categoryFilter.value) && categoryFilter.value.length > 0) {
        if (!categoryFilter.value.includes(product.category)) return false
      }

      // Lock filter (only for hand-picked)
      if (activeTab === "hand-picked") {
        const lockFilter = columnFilters.find((f) => f.id === "is_locked")
        if (lockFilter && lockFilter.value && Array.isArray(lockFilter.value) && lockFilter.value.length > 0) {
          const hp = product as HandPickedProduct
          const isLocked = lockFilter.value.includes("locked")
          const isUnlocked = lockFilter.value.includes("unlocked")
          if (isLocked && !hp.is_locked) return false
          if (isUnlocked && hp.is_locked) return false
        }
      }

      return true
    })

    // Apply sorting
    if (sorting.length > 0) {
      const sort = sorting[0]
      filtered.sort((a, b) => {
        let aValue: any
        let bValue: any

        switch (sort.id) {
          case "title":
            aValue = a.title
            bValue = b.title
            break
          case "category":
            aValue = a.category
            bValue = b.category
            break
          case "profit_margin":
            aValue = (a as HandPickedProduct).profit_margin
            bValue = (b as HandPickedProduct).profit_margin
            break
          case "pot_revenue":
            aValue = (a as HandPickedProduct).pot_revenue
            bValue = (b as HandPickedProduct).pot_revenue
            break
          case "buy_price":
            aValue = (a as ProductPick).buy_price
            bValue = (b as ProductPick).buy_price
            break
          case "sell_price":
            aValue = (a as ProductPick).sell_price
            bValue = (b as ProductPick).sell_price
            break
          default:
            return 0
        }

        if (aValue < bValue) return sort.desc ? 1 : -1
        if (aValue > bValue) return sort.desc ? -1 : 1
        return 0
      })
    }

    return filtered
  }, [activeTab, handPickedProducts, productPicks, searchQuery, columnFilters, sorting, quickFilter, dateRange])

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return filteredProducts.slice(start, end)
  }, [filteredProducts, page, pageSize])

  useEffect(() => {
    setPageCount(Math.ceil(filteredProducts.length / pageSize))
    setInitialLoading(false)
  }, [filteredProducts.length, pageSize])

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      // TODO: Replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      setHandPickedProducts(sampleHandPickedProducts)
      setProductPicks(sampleProductPicks)
    } catch (err) {
      console.error("Error fetching products:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to load products. Please try again."
      setError(errorMessage)
      showError(errorMessage)
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }, [showError])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleViewDetails = useCallback((product: ProductUnion) => {
    router.push(`/admin/products/${product.id}?type=${activeTab}`)
  }, [router, activeTab])

  const handleQuickView = useCallback((product: ProductUnion) => {
    setSelectedProduct(product)
    setQuickViewOpen(true)
  }, [])

  const handleDelete = useCallback((product: ProductUnion) => {
    if (!canDelete) {
      showError("You don't have permission to delete products")
      return
    }
    setProductToDelete(product)
    setDeleteConfirmOpen(true)
  }, [canDelete, showError])

  const confirmDelete = async () => {
    if (!productToDelete) return
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      if (activeTab === "hand-picked") {
        setHandPickedProducts((prev) => prev.filter((p) => p.id !== productToDelete.id))
      } else {
        setProductPicks((prev) => prev.filter((p) => p.id !== productToDelete.id))
      }
      setSelectedProducts((prev) => prev.filter((p) => p.id !== productToDelete.id))
      setDeleteConfirmOpen(false)
      setProductToDelete(null)
      showSuccess(`Product "${productToDelete.title}" deleted successfully`)
      await fetchProducts()
    } catch (err) {
      showError("Failed to delete product")
    }
  }

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return
    if (!canDelete) {
      showError("You don't have permission to delete products")
      return
    }
    setBulkActionLoading("delete")
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const deletedCount = selectedProducts.length
      if (activeTab === "hand-picked") {
        setHandPickedProducts((prev) => prev.filter((p) => !selectedProducts.some((sp) => sp.id === p.id)))
      } else {
        setProductPicks((prev) => prev.filter((p) => !selectedProducts.some((sp) => sp.id === p.id)))
      }
      setSelectedProducts([])
      showSuccess(`${deletedCount} product(s) deleted successfully`)
      await fetchProducts()
    } catch (err) {
      showError("Failed to delete products")
    } finally {
      setBulkActionLoading(null)
    }
  }

  const handleBulkLock = async () => {
    if (selectedProducts.length === 0 || activeTab !== "hand-picked") return
    if (!canLockUnlock) {
      showError("You don't have permission to lock/unlock products")
      return
    }
    setBulkActionLoading("lock")
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setHandPickedProducts((prev) =>
        prev.map((p) =>
          selectedProducts.some((sp) => sp.id === p.id)
            ? { ...p, is_locked: true, updated_at: new Date().toISOString() }
            : p
        )
      )
      setSelectedProducts([])
      showSuccess(`${selectedProducts.length} product(s) locked successfully`)
      await fetchProducts()
    } catch (err) {
      showError("Failed to lock products")
    } finally {
      setBulkActionLoading(null)
    }
  }

  const handleBulkUnlock = async () => {
    if (selectedProducts.length === 0 || activeTab !== "hand-picked") return
    if (!canLockUnlock) {
      showError("You don't have permission to lock/unlock products")
      return
    }
    setBulkActionLoading("unlock")
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setHandPickedProducts((prev) =>
        prev.map((p) =>
          selectedProducts.some((sp) => sp.id === p.id)
            ? { ...p, is_locked: false, updated_at: new Date().toISOString() }
            : p
        )
      )
      setSelectedProducts([])
      showSuccess(`${selectedProducts.length} product(s) unlocked successfully`)
      await fetchProducts()
    } catch (err) {
      showError("Failed to unlock products")
    } finally {
      setBulkActionLoading(null)
    }
  }

  const handleToggleLock = useCallback(async (product: HandPickedProduct) => {
    if (!canLockUnlock) {
      showError("You don't have permission to lock/unlock products")
      return
    }
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setHandPickedProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? { ...p, is_locked: !p.is_locked, updated_at: new Date().toISOString() }
            : p
        )
      )
      showSuccess(`Product ${!product.is_locked ? "locked" : "unlocked"} successfully`)
      await fetchProducts()
    } catch (err) {
      showError("Failed to update product")
    }
  }, [canLockUnlock, showSuccess, showError, fetchProducts])

  const handleCopyProductId = useCallback(async (product: ProductUnion) => {
    try {
      await navigator.clipboard.writeText(product.id)
      showSuccess("Product ID copied to clipboard")
    } catch (err) {
      showError("Failed to copy Product ID")
    }
  }, [showSuccess, showError])

  const handleCopyTitle = useCallback(async (product: ProductUnion) => {
    try {
      await navigator.clipboard.writeText(product.title)
      showSuccess("Product title copied to clipboard")
    } catch (err) {
      showError("Failed to copy title")
    }
  }, [showSuccess, showError])

  const handleViewCategory = useCallback((product: ProductUnion) => {
    router.push(`/admin/categories?category=${product.category}`)
  }, [router])

  const handleViewSupplier = useCallback((product: ProductUnion) => {
    if (activeTab === "hand-picked") {
      const hp = product as HandPickedProduct
      if (hp.supplier_info) {
        // TODO: Navigate to supplier page
        showInfo(`Supplier navigation will be implemented. Supplier: ${hp.supplier_info.name}`)
      }
    } else {
      const pp = product as ProductPick
      if (pp.supplier_id) {
        router.push(`/admin/suppliers/${pp.supplier_id}`)
      }
    }
  }, [activeTab, router, showInfo])

  const handleViewTrendData = useCallback((product: ProductPick) => {
    // TODO: Show trend data modal or navigate to trend analysis
    showInfo(`Trend data visualization will be implemented. Product: ${product.title}`)
  }, [showInfo])

  const handleDuplicate = useCallback(async (product: ProductUnion) => {
    if (!canCreate) {
      showError("You don't have permission to create products")
      return
    }
    // TODO: Implement duplicate functionality
    showInfo(`Duplicate functionality will be implemented. Product: ${product.title}`)
  }, [canCreate, showError, showInfo])

  const handleEdit = useCallback((product: ProductUnion) => {
    if (!canEdit) {
      showError("You don't have permission to edit products")
      return
    }
    router.push(`/admin/products/${product.id}?type=${activeTab}`)
  }, [canEdit, router, activeTab, showError])

  const handleBulkExport = useCallback(() => {
    if (selectedProducts.length === 0) {
      showError("No products selected for export")
      return
    }
    try {
      const headers = activeTab === "hand-picked"
        ? ["Product ID", "Title", "Category", "Profit Margin", "Pot Revenue", "Lock Status", "Found Date"]
        : ["Product ID", "Title", "Category", "Buy Price", "Sell Price", "Profit per Order", "Rating", "Supplier"]
      
      const rows = selectedProducts.map((product) => {
        if (activeTab === "hand-picked") {
          const hp = product as HandPickedProduct
          return [
            hp.id,
            hp.title,
            hp.category,
            `${hp.profit_margin}%`,
            `$${hp.pot_revenue.toFixed(2)}`,
            hp.is_locked ? "Locked" : "Unlocked",
            new Date(hp.found_date).toLocaleString(),
          ]
        } else {
          const pp = product as ProductPick
          return [
            pp.id,
            pp.title,
            pp.category,
            `$${pp.buy_price.toFixed(2)}`,
            `$${pp.sell_price.toFixed(2)}`,
            `$${pp.profit_per_order.toFixed(2)}`,
            pp.rating?.toFixed(1) || "",
            pp.supplier?.name || "",
          ]
        }
      })

      const csv = [
        headers.map(h => `"${h}"`).join(","),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
      ].join("\n")

      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `selected-products-${activeTab}-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
      showSuccess(`Exported ${selectedProducts.length} product(s) to CSV`)
    } catch (err) {
      showError("Failed to export products")
    }
  }, [selectedProducts, activeTab, showSuccess, showError])

  const handleBulkUpload = useCallback(() => {
    // Create file input
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".csv,.xlsx,.xls"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        setBulkActionLoading("upload")
        // TODO: Implement actual bulk upload API call
        // For now, show a message
        console.log("Bulk upload file:", file.name)
        // Simulate processing
        await new Promise((resolve) => setTimeout(resolve, 1000))
        showInfo(`Bulk upload functionality will be implemented. File: ${file.name}`)
      } catch (err) {
        console.error("Error uploading file:", err)
        const errorMessage = err instanceof Error ? err.message : "Failed to upload file"
        showError(errorMessage)
      } finally {
        setBulkActionLoading(null)
      }
    }
    input.click()
  }, [showInfo, showError])

  const handleRowClick = useCallback((product: ProductUnion) => {
    setSelectedProduct(product)
    setQuickViewOpen(true)
  }, [])

  const handPickedColumns = useMemo(
    () =>
      createHandPickedColumns({
        onViewDetails: handleViewDetails,
        onQuickView: handleQuickView,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onCopyProductId: handleCopyProductId,
        onCopyTitle: handleCopyTitle,
        onToggleLock: handleToggleLock,
        onViewCategory: handleViewCategory,
        onViewSupplier: handleViewSupplier,
        onDuplicate: handleDuplicate,
        canEdit,
        canDelete,
        canLockUnlock,
      }),
    [
      handleViewDetails,
      handleQuickView,
      handleEdit,
      handleDelete,
      handleCopyProductId,
      handleCopyTitle,
      handleToggleLock,
      handleViewCategory,
      handleViewSupplier,
      handleDuplicate,
      canEdit,
      canDelete,
      canLockUnlock,
    ]
  )

  const productPicksColumns = useMemo(
    () =>
      createProductPicksColumns({
        onViewDetails: handleViewDetails,
        onQuickView: handleQuickView,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onCopyProductId: handleCopyProductId,
        onCopyTitle: handleCopyTitle,
        onViewCategory: handleViewCategory,
        onViewSupplier: handleViewSupplier,
        onViewTrendData: handleViewTrendData,
        onDuplicate: handleDuplicate,
        canEdit,
        canDelete,
      }),
    [
      handleViewDetails,
      handleQuickView,
      handleEdit,
      handleDelete,
      handleCopyProductId,
      handleCopyTitle,
      handleViewCategory,
      handleViewSupplier,
      handleViewTrendData,
      handleDuplicate,
      canEdit,
      canDelete,
    ]
  )

  const categoryOptions = categories.map((cat) => ({
    label: cat.replace(/-/g, " "),
    value: cat,
  }))

  const lockOptions = [
    { label: "Locked", value: "locked" },
    { label: "Unlocked", value: "unlocked" },
  ]

  // Memoize secondary buttons to avoid hook order issues
  const secondaryButtons = useMemo(() => {
    if (selectedProducts.length > 0) {
      const buttons = []
      if (activeTab === "hand-picked") {
        buttons.push(
          {
            label: bulkActionLoading === "lock" ? "Locking..." : "Lock Selected",
            icon: bulkActionLoading === "lock" ? <Loader size="sm" className="mr-2" /> : <Lock className="h-4 w-4" />,
            onClick: handleBulkLock,
            variant: "outline" as const,
            disabled: !canLockUnlock || bulkActionLoading !== null,
            tooltip: !canLockUnlock ? "You don't have permission to lock/unlock products" : undefined,
          },
          {
            label: bulkActionLoading === "unlock" ? "Unlocking..." : "Unlock Selected",
            icon: bulkActionLoading === "unlock" ? <Loader size="sm" className="mr-2" /> : <LockOpen className="h-4 w-4" />,
            onClick: handleBulkUnlock,
            variant: "outline" as const,
            disabled: !canLockUnlock || bulkActionLoading !== null,
            tooltip: !canLockUnlock ? "You don't have permission to lock/unlock products" : undefined,
          }
        )
      }
      buttons.push(
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
          tooltip: !canDelete ? "You don't have permission to delete products" : undefined,
        },
        {
          label: "Clear Selection",
          onClick: () => setSelectedProducts([]),
          variant: "ghost" as const,
        }
      )
      return buttons
    } else {
      return [
        {
          label: bulkActionLoading === "upload" ? "Uploading..." : "Bulk Upload",
          icon: bulkActionLoading === "upload" ? <Loader size="sm" className="mr-2" /> : <Upload className="h-4 w-4" />,
          onClick: handleBulkUpload,
          variant: "outline" as const,
          disabled: bulkActionLoading !== null,
        },
        {
          label: "Create Product",
          icon: <Plus className="h-4 w-4" />,
          onClick: () => {
            if (!canCreate) {
              showError("You don't have permission to create products")
              return
            }
            router.push(`/admin/products/new?type=${activeTab}`)
          },
          variant: "default" as const,
          disabled: !canCreate,
          tooltip: !canCreate ? "You don't have permission to create products" : undefined,
        },
      ]
    }
  }, [selectedProducts, bulkActionLoading, activeTab, canLockUnlock, canDelete, canCreate, handleBulkLock, handleBulkUnlock, handleBulkDelete, handleBulkExport, handleBulkUpload, showError, router, setSelectedProducts])

  const currentColumns = activeTab === "hand-picked" ? handPickedColumns : productPicksColumns
  const currentQuickFilters = activeTab === "hand-picked" ? handPickedQuickFilters : productPicksQuickFilters
  
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

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
      <div>
          <h1 className="text-lg font-semibold tracking-tight">Products</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage hand-picked products and product picks
          </p>
          </div>
        <div className="flex items-center gap-2">
          {assignedOwner || assignedMembers.length > 0 ? (
            <div className="flex items-center gap-2">
              {assignedOwner && (
                <Avatar className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={getAvatarUrl(assignedOwner, internalUsers.find(u => u.id === assignedOwner)?.email || "")} />
                  <AvatarFallback className="text-xs">
                    {internalUsers.find(u => u.id === assignedOwner)?.name.charAt(0) || "O"}
                  </AvatarFallback>
                </Avatar>
              )}
              {assignedMembers.slice(0, 3).map((memberId) => {
                const member = internalUsers.find(u => u.id === memberId)
                if (!member) return null
                return (
                  <Avatar key={memberId} className="h-8 w-8 border-2 border-background">
                    <AvatarImage src={getAvatarUrl(memberId, member.email)} />
                    <AvatarFallback className="text-xs">
                      {member.name.charAt(0) || "M"}
                    </AvatarFallback>
                  </Avatar>
                )
              })}
              {assignedMembers.length > 3 && (
                <div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center">
                  <span className="text-xs font-medium">+{assignedMembers.length - 3}</span>
                </div>
              )}
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

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchProducts}
            className="mt-2 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={(v) => {
        setActiveTab(v as ProductType)
        setQuickFilter(null)
        setSelectedProducts([])
      }} className="mt-0">
        <TabsList>
          <TabsTrigger value="hand-picked" className="cursor-pointer">
            Hand-picked Products
            <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5 text-xs">
              {handPickedProducts.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="product-picks" className="cursor-pointer">
            Product Picks
            <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5 text-xs">
              {productPicks.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-4">
          {initialLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-muted-foreground">Loading products...</div>
            </div>
          ) : (
            <>
              {/* DataTable */}
              <div className="flex-1 overflow-hidden min-h-0">
              <DataTable
                columns={currentColumns as ColumnDef<ProductUnion>[]}
                data={paginatedProducts as ProductUnion[]}
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
                searchPlaceholder="Search products..."
                page={page}
                pageSize={pageSize}
                enableRowSelection={true}
                onRowSelectionChange={setSelectedProducts}
              onRowClick={handleRowClick}
                  onDateRangeChange={setDateRange}
                  quickFilters={currentQuickFilters}
                  selectedQuickFilter={quickFilter}
                  onQuickFilterChange={(filterId) => setQuickFilter(quickFilter === filterId ? null : filterId)}
                filterConfig={[
                  {
                    columnId: "category",
                    title: "Category",
                    options: categoryOptions,
                  },
                  ...(activeTab === "hand-picked"
                    ? [
                        {
                          columnId: "is_locked",
                          title: "Lock Status",
                          options: lockOptions,
                        },
                      ]
                    : []),
                ]}
                  secondaryButtons={secondaryButtons}
              />
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick View Modal - Enhanced */}
      {selectedProduct && (
        <Dialog 
          open={quickViewOpen}
          onOpenChange={(open) => {
            setQuickViewOpen(open)
            if (!open) {
              setSelectedProduct(null)
            }
          }}
        >
          <DialogContent className="max-w-xs p-4">
            <DialogHeader className="pb-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                  {selectedProduct.image ? (
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.title}
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
                  <DialogTitle className="text-base truncate">{selectedProduct.title}</DialogTitle>
                  <DialogDescription className="text-xs truncate">
                    <Badge variant="outline" className="text-xs">
                      {selectedProduct.category.replace(/-/g, " ")}
                  </Badge>
                  </DialogDescription>
                </div>
                </div>
            </DialogHeader>
            <div className="space-y-2 py-2">
              {activeTab === "hand-picked" && (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Profit Margin</span>
                    <span className="text-xs font-medium text-emerald-600">
                      {(selectedProduct as HandPickedProduct).profit_margin}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Pot Revenue</span>
                    <span className="text-xs font-medium">
                      ${(selectedProduct as HandPickedProduct).pot_revenue.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Status</span>
                    <Badge variant={(selectedProduct as HandPickedProduct).is_locked ? "destructive" : "default"} className="text-xs px-2 py-0.5">
                      {(selectedProduct as HandPickedProduct).is_locked ? (
                        <>
                          <Lock className="h-3 w-3 mr-1" />
                          Locked
                        </>
                      ) : (
                        "Unlocked"
                      )}
                          </Badge>
                        </div>
                  {(selectedProduct as HandPickedProduct).supplier_info && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">Supplier</span>
                      <span className="text-xs font-medium truncate max-w-[120px]">
                        {(selectedProduct as HandPickedProduct).supplier_info?.name}
                      </span>
                        </div>
                  )}
                      </>
                    )}
                    {activeTab === "product-picks" && (
                      <>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Buy Price</span>
                    <span className="text-xs font-medium">
                            ${(selectedProduct as ProductPick).buy_price.toFixed(2)}
                    </span>
                        </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Sell Price</span>
                    <span className="text-xs font-medium">
                            ${(selectedProduct as ProductPick).sell_price.toFixed(2)}
                    </span>
                        </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Profit per Order</span>
                    <span className="text-xs font-medium text-emerald-600">
                            ${(selectedProduct as ProductPick).profit_per_order.toFixed(2)}
                    </span>
                        </div>
                      {(selectedProduct as ProductPick).rating && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">Rating</span>
                          <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">
                              {(selectedProduct as ProductPick).rating?.toFixed(1)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                          ({(selectedProduct as ProductPick).reviews_count})
                            </span>
                          </div>
                        </div>
                      )}
                  {(selectedProduct as ProductPick).supplier && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">Supplier</span>
                      <span className="text-xs font-medium truncate max-w-[120px]">
                        {(selectedProduct as ProductPick).supplier?.name}
                      </span>
                    </div>
                  )}
                    </>
                  )}
                </div>
            <DialogFooter className="pt-3 border-t mt-2">
                <Button
                  variant="outline"
                onClick={() => {
                  setQuickViewOpen(false)
                  handleViewDetails(selectedProduct)
                }}
                className="w-full text-sm h-8 cursor-pointer"
              >
                View More Details
                </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}


      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {productToDelete && (
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Product:</span> {productToDelete.title}
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
