"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
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
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Plus, Trash2, CheckCircle2, Star, Copy, Edit, RefreshCw, Download, X, UserPlus, Search, Globe, ExternalLink, TrendingUp, DollarSign, ArrowUpRight, AlertCircle, Package, Check } from "lucide-react"
import { AdminCompetitorStoreCard } from "./components/admin-competitor-store-card"
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
import { CompetitorStore, sampleCompetitorStores } from "./data/stores"
import { QuickViewModal } from "@/components/ui/quick-view-modal"
import { DetailDrawer } from "@/components/ui/detail-drawer"
import { useToast } from "@/hooks/use-toast"
import { useHasPermission } from "@/hooks/use-has-permission"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatarUrl } from "@/lib/utils/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { sampleInternalUsers } from "@/app/admin/internal-users/data/users"
import Image from "next/image"

const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
})

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export default function AdminCompetitorStoresPage() {
  const router = useRouter()
  const { showSuccess, showError, showInfo } = useToast()
  
  // Permission checks
  const { hasPermission: canView } = useHasPermission("competitor_stores.view")
  const { hasPermission: canEdit } = useHasPermission("competitor_stores.edit")
  const { hasPermission: canCreate } = useHasPermission("competitor_stores.create")
  const { hasPermission: canDelete } = useHasPermission("competitor_stores.delete")
  const { hasPermission: canVerify } = useHasPermission("competitor_stores.verify")
  
  const [stores, setStores] = useState<CompetitorStore[]>(sampleCompetitorStores)
  const [selectedStores, setSelectedStores] = useState<CompetitorStore[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [statusTab, setStatusTab] = useState<"all" | "high_traffic" | "high_revenue" | "high_growth">("all")
  const [quickFilter, setQuickFilter] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false)
  const [selectedStore, setSelectedStore] = useState<CompetitorStore | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [storeToDelete, setStoreToDelete] = useState<CompetitorStore | null>(null)
  const [bulkActionLoading, setBulkActionLoading] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingStore, setEditingStore] = useState<CompetitorStore | null>(null)
  const [assigneeModalOpen, setAssigneeModalOpen] = useState(false)
  const [assignedOwner, setAssignedOwner] = useState<string | null>(null)
  const [assignedMembers, setAssignedMembers] = useState<string[]>([])
  const [memberSearch, setMemberSearch] = useState("")
  const [tempOwner, setTempOwner] = useState<string | null>(null)
  const [tempMembers, setTempMembers] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    category: "",
    country: "",
    monthly_traffic: 0,
    monthly_revenue: null as number | null,
    growth: 0,
    products_count: undefined as number | undefined,
    rating: undefined as number | undefined,
    verified: false,
    logo: "",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [formLoading, setFormLoading] = useState(false)

  const internalUsers = sampleInternalUsers

  const categories = useMemo(() => {
    const categorySet = new Set(stores.map((s) => s.category))
    return Array.from(categorySet)
  }, [stores])

  const countries = useMemo(() => {
    const countrySet = new Set(stores.map((s) => s.country).filter(Boolean))
    return Array.from(countrySet)
  }, [stores])

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
    showSuccess("Assignees updated successfully")
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
        return stores.length
      case "high_traffic":
        return stores.filter(s => s.monthly_traffic >= 100000).length
      case "high_revenue":
        return stores.filter(s => s.monthly_revenue !== null && s.monthly_revenue >= 400000).length
      case "high_growth":
        return stores.filter(s => s.growth >= 15).length
      default:
        return 0
    }
  }, [stores])

  // Quick filters
  const quickFilters = [
    { id: "high_traffic", label: "High Traffic", count: 0 },
    { id: "high_revenue", label: "High Revenue", count: 0 },
    { id: "high_growth", label: "High Growth", count: 0 },
    { id: "verified", label: "Verified", count: 0 },
  ]

  // Filter stores based on search, filters, status tab, date range, and quick filters
  const filteredStores = useMemo(() => {
    let result = stores

    // Status tab filter
    if (statusTab !== "all") {
      switch (statusTab) {
        case "high_traffic":
          result = result.filter(s => s.monthly_traffic >= 100000)
          break
        case "high_revenue":
          result = result.filter(s => s.monthly_revenue !== null && s.monthly_revenue >= 400000)
          break
        case "high_growth":
          result = result.filter(s => s.growth >= 15)
          break
      }
    }

    // Date range filter
    if (dateRange.from || dateRange.to) {
      result = result.filter((store) => {
        const storeDate = new Date(store.created_at)
        if (dateRange.from && storeDate < dateRange.from) return false
        if (dateRange.to) {
          const toDate = new Date(dateRange.to)
          toDate.setHours(23, 59, 59, 999)
          if (storeDate > toDate) return false
        }
        return true
      })
    }

    // Quick filter
    if (quickFilter) {
      switch (quickFilter) {
        case "high_traffic":
          result = result.filter(s => s.monthly_traffic >= 100000)
          break
        case "high_revenue":
          result = result.filter(s => s.monthly_revenue !== null && s.monthly_revenue >= 400000)
          break
        case "high_growth":
          result = result.filter(s => s.growth >= 15)
          break
        case "verified":
          result = result.filter(s => s.verified)
          break
      }
    }

    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      result = result.filter((store) =>
        store.name.toLowerCase().includes(searchLower) ||
        store.url.toLowerCase().includes(searchLower) ||
        store.category.toLowerCase().includes(searchLower) ||
        (store.country && store.country.toLowerCase().includes(searchLower))
      )
    }

    // Column filters
    columnFilters.forEach((filter) => {
      if (!filter.value) return
      
      const filterValues = Array.isArray(filter.value) ? filter.value : [filter.value]
      if (filterValues.length === 0) return

      if (filter.id === "category") {
        result = result.filter((store) => filterValues.includes(store.category))
      }
      
      if (filter.id === "country") {
        result = result.filter((store) => store.country && filterValues.includes(store.country))
      }

      if (filter.id === "verified") {
        const isVerified = filterValues.includes("verified")
        const isUnverified = filterValues.includes("unverified")
        if (isVerified) result = result.filter(s => s.verified)
        if (isUnverified) result = result.filter(s => !s.verified)
      }
    })

    return result
  }, [stores, searchQuery, columnFilters, statusTab, quickFilter, dateRange])

  // Apply sorting
  const sortedStores = useMemo(() => {
    if (!sorting || sorting.length === 0) {
      return filteredStores
    }

    const sorted = [...filteredStores]
    sorting.forEach((sort) => {
      const { id, desc } = sort
      sorted.sort((a, b) => {
        let aValue: any
        let bValue: any

        switch (id) {
          case "name":
            aValue = a.name.toLowerCase()
            bValue = b.name.toLowerCase()
            break
          case "url":
            aValue = a.url.toLowerCase()
            bValue = b.url.toLowerCase()
            break
          case "category":
            aValue = a.category.toLowerCase()
            bValue = b.category.toLowerCase()
            break
          case "monthly_traffic":
            aValue = a.monthly_traffic
            bValue = b.monthly_traffic
            break
          case "monthly_revenue":
            aValue = a.monthly_revenue || 0
            bValue = b.monthly_revenue || 0
            break
          case "growth":
            aValue = a.growth
            bValue = b.growth
            break
          case "country":
            aValue = (a.country || "").toLowerCase()
            bValue = (b.country || "").toLowerCase()
            break
          case "rating":
            aValue = a.rating || 0
            bValue = b.rating || 0
            break
          default:
            return 0
        }

        if (aValue < bValue) return desc ? 1 : -1
        if (aValue > bValue) return desc ? -1 : 1
        return 0
      })
    })

    return sorted
  }, [filteredStores, sorting])

  // Paginate sorted stores
  const paginatedStores = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return sortedStores.slice(start, end)
  }, [sortedStores, page, pageSize])

  useEffect(() => {
    setPageCount(Math.ceil(sortedStores.length / pageSize))
    setInitialLoading(false)
  }, [sortedStores.length, pageSize])

  const fetchStores = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      // TODO: Replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      setStores(sampleCompetitorStores)
    } catch (err) {
      console.error("Error fetching stores:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to load stores. Please try again."
      setError(errorMessage)
      showError(errorMessage)
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }, [showError])

  useEffect(() => {
    fetchStores()
  }, [fetchStores])

  const handleViewDetails = useCallback((store: CompetitorStore) => {
    router.push(`/admin/competitor-stores/${store.id}`)
  }, [router])

  const handleQuickView = useCallback((store: CompetitorStore) => {
    setSelectedStore(store)
    setQuickViewOpen(true)
  }, [])

  const handleDelete = useCallback((store: CompetitorStore) => {
    if (!canDelete) {
      showError("You don't have permission to delete stores")
      return
    }
    setStoreToDelete(store)
    setDeleteConfirmOpen(true)
  }, [canDelete, showError])

  const confirmDelete = async () => {
    if (!storeToDelete) return
    setBulkActionLoading("delete")
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setStores((prev) => prev.filter((s) => s.id !== storeToDelete.id))
      setSelectedStores((prev) => prev.filter((s) => s.id !== storeToDelete.id))
      setDeleteConfirmOpen(false)
      const deletedStoreName = storeToDelete.name
      setStoreToDelete(null)
      showSuccess(`Store "${deletedStoreName}" deleted successfully`)
      await fetchStores()
    } catch (err) {
      showError("Failed to delete store")
    } finally {
      setBulkActionLoading(null)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedStores.length === 0) return
    if (!canDelete) {
      showError("You don't have permission to delete stores")
      return
    }
    setBulkActionLoading("bulk-delete")
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const deletedCount = selectedStores.length
      setStores((prev) => prev.filter((s) => !selectedStores.some((ss) => ss.id === s.id)))
      setSelectedStores([])
      showSuccess(`${deletedCount} store(s) deleted successfully`)
      await fetchStores()
    } catch (err) {
      showError("Failed to delete stores")
    } finally {
      setBulkActionLoading(null)
    }
  }

  const handleBulkVerify = async () => {
    if (selectedStores.length === 0) return
    if (!canVerify) {
      showError("You don't have permission to verify stores")
      return
    }
    setBulkActionLoading("bulk-verify")
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setStores((prev) =>
        prev.map((s) =>
          selectedStores.some((ss) => ss.id === s.id)
            ? { ...s, verified: true }
            : s
        )
      )
      setSelectedStores([])
      showSuccess(`${selectedStores.length} store(s) verified successfully`)
      await fetchStores()
    } catch (err) {
      showError("Failed to verify stores")
    } finally {
      setBulkActionLoading(null)
    }
  }

  const handleBulkUnverify = async () => {
    if (selectedStores.length === 0) return
    if (!canVerify) {
      showError("You don't have permission to unverify stores")
      return
    }
    setBulkActionLoading("bulk-unverify")
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setStores((prev) =>
        prev.map((s) =>
          selectedStores.some((ss) => ss.id === s.id)
            ? { ...s, verified: false }
            : s
        )
      )
      setSelectedStores([])
      showSuccess(`${selectedStores.length} store(s) unverified successfully`)
      await fetchStores()
    } catch (err) {
      showError("Failed to unverify stores")
    } finally {
      setBulkActionLoading(null)
    }
  }

  const handleCopyStoreId = useCallback(async (store: CompetitorStore) => {
    try {
      await navigator.clipboard.writeText(store.id)
      showSuccess("Store ID copied to clipboard")
    } catch (err) {
      showError("Failed to copy Store ID")
    }
  }, [showSuccess, showError])

  const handleCopyUrl = useCallback(async (store: CompetitorStore) => {
    try {
      await navigator.clipboard.writeText(store.url)
      showSuccess("Store URL copied to clipboard")
    } catch (err) {
      showError("Failed to copy URL")
    }
  }, [showSuccess, showError])

  const handleToggleVerify = useCallback(async (store: CompetitorStore) => {
    if (!canVerify) {
      showError("You don't have permission to verify/unverify stores")
      return
    }
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setStores((prev) =>
        prev.map((s) =>
          s.id === store.id
            ? { ...s, verified: !s.verified }
            : s
        )
      )
      showSuccess(`Store ${!store.verified ? "verified" : "unverified"} successfully`)
      await fetchStores()
    } catch (err) {
      showError("Failed to update store")
    }
  }, [canVerify, showSuccess, showError, fetchStores])

  const handleVisitStore = useCallback((store: CompetitorStore) => {
    const url = store.url.startsWith("http") ? store.url : `https://${store.url}`
    window.open(url, "_blank", "noopener,noreferrer")
  }, [])

  const handleViewProducts = useCallback((store: CompetitorStore) => {
    router.push(`/admin/products?store=${store.id}`)
  }, [router])

  const handleEdit = useCallback((store: CompetitorStore) => {
    if (!canEdit) {
      showError("You don't have permission to edit stores")
      return
    }
    setEditingStore(store)
    setFormData({
      name: store.name,
      url: store.url,
      category: store.category,
      country: store.country || "",
      monthly_traffic: store.monthly_traffic,
      monthly_revenue: store.monthly_revenue,
      growth: store.growth,
      products_count: store.products_count,
      rating: store.rating,
      verified: store.verified,
      logo: store.logo || "",
    })
    setFormErrors({})
    setFormOpen(true)
  }, [canEdit, showError])

  const handleDuplicate = useCallback(async (store: CompetitorStore) => {
    if (!canCreate) {
      showError("You don't have permission to create stores")
      return
    }
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const duplicatedStore: CompetitorStore = {
        ...store,
        id: `cs_${Date.now()}`,
        name: `${store.name} (Copy)`,
        verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setStores((prev) => [...prev, duplicatedStore])
      showSuccess(`Store "${duplicatedStore.name}" duplicated successfully`)
      await fetchStores()
    } catch (err) {
      showError("Failed to duplicate store")
    }
  }, [canCreate, showSuccess, showError, fetchStores])

  const handleCreate = useCallback(() => {
    if (!canCreate) {
      showError("You don't have permission to create stores")
      return
    }
    setEditingStore(null)
    setFormData({
      name: "",
      url: "",
      category: "",
      country: "",
      monthly_traffic: 0,
      monthly_revenue: null,
      growth: 0,
      products_count: undefined,
      rating: undefined,
      verified: false,
      logo: "",
    })
    setFormErrors({})
    setFormOpen(true)
  }, [canCreate, showError])

  const handleFormSubmit = async () => {
    if (!canEdit && !canCreate) {
      showError("You don't have permission to create or edit stores")
      return
    }

    const errors: Record<string, string> = {}
    if (!formData.name.trim()) errors.name = "Name is required"
    if (!formData.url.trim()) errors.url = "URL is required"
    if (!formData.category.trim()) errors.category = "Category is required"

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setFormLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (editingStore) {
        setStores((prev) =>
          prev.map((s) =>
            s.id === editingStore.id
              ? {
                  ...s,
                  name: formData.name,
                  url: formData.url,
                  category: formData.category,
                  country: formData.country || undefined,
                  monthly_traffic: formData.monthly_traffic,
                  monthly_revenue: formData.monthly_revenue,
                  growth: formData.growth,
                  products_count: formData.products_count,
                  rating: formData.rating,
                  verified: formData.verified,
                  logo: formData.logo || undefined,
                  updated_at: new Date().toISOString(),
                }
              : s
          )
        )
      } else {
        const newStore: CompetitorStore = {
          id: `cs_${Date.now()}`,
          name: formData.name,
          url: formData.url,
          category: formData.category,
          country: formData.country || undefined,
          monthly_traffic: formData.monthly_traffic,
          monthly_revenue: formData.monthly_revenue,
          growth: formData.growth,
          products_count: formData.products_count,
          rating: formData.rating,
          verified: formData.verified,
          logo: formData.logo || undefined,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setStores((prev) => [...prev, newStore])
      }

      setFormOpen(false)
      setEditingStore(null)
      setFormErrors({})
      showSuccess(editingStore ? `Store "${formData.name}" updated successfully` : `Store "${formData.name}" created successfully`)
      await fetchStores()
    } catch (err) {
      console.error("Error saving store:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to save store. Please try again."
      setError(errorMessage)
      showError(errorMessage)
    } finally {
      setFormLoading(false)
    }
  }

  const handleBulkExport = useCallback(() => {
    if (selectedStores.length === 0) {
      showError("No stores selected for export")
      return
    }
    try {
      const csv = [
        ["Store ID", "Name", "URL", "Category", "Country", "Monthly Traffic", "Monthly Revenue", "Growth", "Products", "Rating", "Verified"],
        ...selectedStores.map((store) => [
          store.id,
          store.name,
          store.url,
          store.category,
          store.country || "",
          store.monthly_traffic.toString(),
          store.monthly_revenue?.toString() || "",
          store.growth.toFixed(1),
          store.products_count?.toString() || "",
          store.rating?.toFixed(1) || "",
          store.verified ? "Yes" : "No",
        ]),
      ]
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n")

      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `selected-stores-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
      showSuccess(`Exported ${selectedStores.length} store(s) to CSV`)
    } catch (err) {
      showError("Failed to export stores")
    }
  }, [selectedStores, showSuccess, showError])

  const handleRowClick = useCallback((store: CompetitorStore) => {
    setSelectedStore(store)
    setQuickViewOpen(true)
  }, [])


  const categoryOptions = categories
    .filter((cat): cat is string => !!cat)
    .map((cat) => ({
      label: cat,
      value: cat,
    }))

  const countryOptions = countries
    .filter((country): country is string => !!country)
    .map((country) => ({
      label: country,
      value: country,
    }))

  const filterConfig = [
    {
      columnId: "category",
      title: "Category",
      options: categoryOptions,
    },
    {
      columnId: "country",
      title: "Country",
      options: countryOptions,
    },
    {
      columnId: "verified",
      title: "Verification",
      options: [
        { label: "Verified", value: "verified" },
        { label: "Unverified", value: "unverified" },
      ],
    },
  ]

  const secondaryButtons = useMemo(() => {
    if (selectedStores.length > 0) {
      return [
        {
          label: bulkActionLoading === "bulk-verify" ? "Verifying..." : "Verify Selected",
          icon: bulkActionLoading === "bulk-verify" ? <Loader size="sm" className="mr-2" /> : <CheckCircle2 className="h-4 w-4" />,
          onClick: handleBulkVerify,
          variant: "outline" as const,
          disabled: !canVerify || bulkActionLoading !== null,
          tooltip: !canVerify ? "You don't have permission to verify stores" : undefined,
        },
        {
          label: bulkActionLoading === "bulk-unverify" ? "Unverifying..." : "Unverify Selected",
          icon: bulkActionLoading === "bulk-unverify" ? <Loader size="sm" className="mr-2" /> : <X className="h-4 w-4" />,
          onClick: handleBulkUnverify,
          variant: "outline" as const,
          disabled: !canVerify || bulkActionLoading !== null,
          tooltip: !canVerify ? "You don't have permission to unverify stores" : undefined,
        },
        {
          label: "Export Selected",
          icon: <Download className="h-4 w-4" />,
          onClick: handleBulkExport,
          variant: "outline" as const,
        },
        {
          label: bulkActionLoading === "bulk-delete" ? "Deleting..." : "Delete Selected",
          icon: bulkActionLoading === "bulk-delete" ? <Loader size="sm" className="mr-2" /> : <Trash2 className="h-4 w-4" />,
          onClick: handleBulkDelete,
          variant: "destructive" as const,
          disabled: !canDelete || bulkActionLoading !== null,
          tooltip: !canDelete ? "You don't have permission to delete stores" : undefined,
        },
        {
          label: "Clear Selection",
          onClick: () => setSelectedStores([]),
          variant: "ghost" as const,
        },
      ]
    } else {
      return [
        {
          label: "Create Store",
          icon: <Plus className="h-4 w-4" />,
          onClick: handleCreate,
          variant: "default" as const,
          disabled: !canCreate,
          tooltip: !canCreate ? "You don't have permission to create stores" : undefined,
        },
      ]
    }
  }, [selectedStores, bulkActionLoading, canEdit, canDelete, canVerify, canCreate, handleBulkVerify, handleBulkUnverify, handleBulkDelete, handleBulkExport, handleCreate])

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      <div className="bg-primary/85 text-primary-foreground rounded-md px-4 py-3 mb-3 flex-shrink-0 w-full">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-white">Competitor Stores</h1>
            <p className="text-xs text-white/90 mt-0.5">
              Manage competitor store data and analytics
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
          {assignedOwner || assignedMembers.length > 0 ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center -space-x-2">
                {assignedOwner && (() => {
                  const owner = internalUsers.find(u => u.id === assignedOwner)
                  return (
                    <Avatar className="h-8 w-8 border-2 border-white/20">
                      <AvatarImage src={getAvatarUrl(assignedOwner, owner?.email)} />
                      <AvatarFallback className="text-xs bg-white/20 text-white">
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
                  <div className="h-8 w-8 rounded-full border-2 border-white/20 bg-white/20 flex items-center justify-center">
                    <span className="text-xs font-medium text-white">+{assignedMembers.length - 3}</span>
                  </div>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleOpenAssigneeModal}
                className="whitespace-nowrap cursor-pointer bg-white/10 border-white/20 text-white hover:bg-white/20"
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
      </div>

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStores}
            className="mt-2 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      )}

      {initialLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Loading stores...</div>
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
                <TabsTrigger value="high_traffic" className="cursor-pointer">
                  High Traffic
                  <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5 text-xs">
                    {getStatusCount("high_traffic")}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="high_revenue" className="cursor-pointer">
                  High Revenue
                  <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5 text-xs">
                    {getStatusCount("high_revenue")}
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

          {/* Toolbar */}
          <div className="mb-4 flex items-center gap-1.5 flex-wrap">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <Input
                placeholder="Search stores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-full sm:w-[140px] flex-shrink-0 text-sm"
              />
              {quickFilters.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={quickFilter ? "default" : "outline"}
                      size="sm"
                      className="h-8 px-2"
                    >
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {quickFilters.map((filter) => (
                      <DropdownMenuItem
                        key={filter.id}
                        onClick={() => setQuickFilter(quickFilter === filter.id ? null : filter.id)}
                        className={cn(
                          "cursor-pointer",
                          quickFilter === filter.id && "bg-accent"
                        )}
                      >
                        <span>{filter.label}</span>
                        {quickFilter === filter.id && (
                          <Check className="h-4 w-4 ml-auto" />
                        )}
                      </DropdownMenuItem>
                    ))}
                    {quickFilter && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setQuickFilter(null)}
                          className="cursor-pointer"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Clear Filter
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {secondaryButtons.map((button, index) => (
                <Button
                  key={index}
                  variant={button.variant || "outline"}
                  size="sm"
                  onClick={button.onClick}
                  disabled={button.disabled}
                  className="h-8"
                >
                  {button.icon}
                  {button.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Grid View */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {initialLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader size="sm" />
                  <span>Loading stores...</span>
                </div>
              </div>
            ) : paginatedStores.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Package className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                <p className="text-sm text-muted-foreground">No stores found</p>
                <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {paginatedStores.map((store) => (
                  <AdminCompetitorStoreCard
                    key={store.id}
                    store={store}
                    onEdit={handleEdit}
                    onViewDetails={handleViewDetails}
                    onDelete={handleDelete}
                    onVerify={handleToggleVerify}
                    onDuplicate={handleDuplicate}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    canVerify={canVerify}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {!initialLoading && paginatedStores.length > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredStores.length)} of {filteredStores.length} stores
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <div className="text-sm text-muted-foreground">
                  Page {page} of {pageCount}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(pageCount, p + 1))}
                  disabled={page === pageCount}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Quick View Modal - Enhanced */}
      {selectedStore && (
        <Dialog 
          open={quickViewOpen} 
          onOpenChange={(open) => {
            setQuickViewOpen(open)
            if (!open) {
              setSelectedStore(null)
            }
          }}
        >
          <DialogContent className="max-w-xs p-4">
            <DialogHeader className="pb-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                  {selectedStore.logo ? (
                    <Image
                      src={selectedStore.logo}
                      alt={selectedStore.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <Globe className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <DialogTitle className="text-base truncate">{selectedStore.name}</DialogTitle>
                  <DialogDescription className="text-xs truncate">{selectedStore.url}</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-2 py-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">Category</span>
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  {selectedStore.category}
                </Badge>
              </div>
              {selectedStore.country && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">Country</span>
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    {selectedStore.country}
                  </Badge>
                </div>
              )}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">Monthly Traffic</span>
                <span className="text-xs font-medium">{numberFormatter.format(selectedStore.monthly_traffic)}</span>
              </div>
              {selectedStore.monthly_revenue && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">Monthly Revenue</span>
                  <span className="text-xs font-medium">{currencyFormatter.format(selectedStore.monthly_revenue)}</span>
                </div>
              )}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">Growth</span>
                <span className={`text-xs font-medium ${selectedStore.growth > 0 ? "text-emerald-600" : "text-destructive"}`}>
                  {selectedStore.growth > 0 ? "+" : ""}{selectedStore.growth.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">Status</span>
                <Badge variant={selectedStore.verified ? "default" : "outline"} className="text-xs px-2 py-0.5">
                  {selectedStore.verified ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verified
                    </>
                  ) : (
                    "Unverified"
                  )}
                </Badge>
              </div>
            </div>
            <DialogFooter className="pt-3 border-t mt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setQuickViewOpen(false)
                  handleViewDetails(selectedStore)
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
      {selectedStore && (
        <DetailDrawer
          open={detailDrawerOpen}
          onOpenChange={setDetailDrawerOpen}
          title={selectedStore.name}
          tabs={[
            {
              value: "overview",
              label: "Overview",
              content: (
                <div className="space-y-6">
                  {selectedStore.logo && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={selectedStore.logo}
                        alt={selectedStore.name}
                        fill
                        className="object-cover"
                        sizes="100%"
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">URL</p>
                      <a href={`https://${selectedStore.url}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        {selectedStore.url}
                      </a>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Category</p>
                      <Badge variant="outline">{selectedStore.category}</Badge>
                    </div>
                    {selectedStore.country && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Country</p>
                        <p className="text-sm font-mono">{selectedStore.country}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <Badge variant={selectedStore.verified ? "default" : "outline"}>
                        {selectedStore.verified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Monthly Traffic</p>
                      <p className="text-lg font-semibold">{numberFormatter.format(selectedStore.monthly_traffic)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Monthly Revenue</p>
                      <p className="text-lg font-semibold">
                        {selectedStore.monthly_revenue ? currencyFormatter.format(selectedStore.monthly_revenue) : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Growth</p>
                      <p className={`text-lg font-semibold ${selectedStore.growth > 0 ? "text-emerald-600" : "text-destructive"}`}>
                        {selectedStore.growth > 0 ? "+" : ""}{selectedStore.growth.toFixed(1)}%
                      </p>
                    </div>
                    {selectedStore.products_count !== undefined && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Products</p>
                        <p className="text-lg font-semibold">{selectedStore.products_count.toLocaleString()}</p>
                      </div>
                    )}
                    {selectedStore.rating !== undefined && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Rating</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-lg font-semibold">{selectedStore.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ),
            },
            {
              value: "metrics",
              label: "Metrics",
              content: (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Monthly Traffic</p>
                    <p className="text-2xl font-bold">{numberFormatter.format(selectedStore.monthly_traffic)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Monthly Revenue</p>
                    <p className="text-2xl font-bold">
                      {selectedStore.monthly_revenue ? currencyFormatter.format(selectedStore.monthly_revenue) : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Growth Percentage</p>
                    <p className={`text-2xl font-bold ${selectedStore.growth > 0 ? "text-emerald-600" : "text-destructive"}`}>
                      {selectedStore.growth > 0 ? "+" : ""}{selectedStore.growth.toFixed(1)}%
                    </p>
                  </div>
                  {selectedStore.products_count !== undefined && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Product Count</p>
                      <p className="text-2xl font-bold">{selectedStore.products_count.toLocaleString()}</p>
                    </div>
                  )}
                  {selectedStore.rating !== undefined && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Rating</p>
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-2xl font-bold">{selectedStore.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  )}
                </div>
              ),
            },
            {
              value: "products",
              label: "Products",
              content: (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">View products from this store</p>
                  <Button onClick={() => handleViewProducts(selectedStore)} variant="outline">
                    <Package className="h-4 w-4 mr-2" />
                    View Products
                  </Button>
                </div>
              ),
            },
          ]}
          headerActions={
            <Button variant="destructive" size="sm" onClick={() => handleDelete(selectedStore)}>
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
            <DialogTitle>Delete Store</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this competitor store? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {storeToDelete && (
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Store:</span> {storeToDelete.name}
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

      {/* Create/Edit Store Form Modal */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle>{editingStore ? "Edit Store" : "Create Store"}</DialogTitle>
            <DialogDescription>
              {editingStore
                ? "Update competitor store information and details."
                : "Create a new competitor store with all relevant information."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="store-name">Name *</Label>
              <Input
                id="store-name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value })
                  if (formErrors.name) setFormErrors({ ...formErrors, name: "" })
                }}
                placeholder="Enter store name"
                className={formErrors.name ? "border-destructive" : ""}
              />
              {formErrors.name && <p className="text-xs text-destructive">{formErrors.name}</p>}
            </div>

            {/* URL */}
            <div className="space-y-2">
              <Label htmlFor="store-url">URL *</Label>
              <Input
                id="store-url"
                value={formData.url}
                onChange={(e) => {
                  setFormData({ ...formData, url: e.target.value })
                  if (formErrors.url) setFormErrors({ ...formErrors, url: "" })
                }}
                placeholder="example.com"
                className={formErrors.url ? "border-destructive" : ""}
              />
              {formErrors.url && <p className="text-xs text-destructive">{formErrors.url}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="store-category">Category *</Label>
                <Input
                  id="store-category"
                  value={formData.category}
                  onChange={(e) => {
                    setFormData({ ...formData, category: e.target.value })
                    if (formErrors.category) setFormErrors({ ...formErrors, category: "" })
                  }}
                  placeholder="Enter category"
                  className={formErrors.category ? "border-destructive" : ""}
                />
                {formErrors.category && <p className="text-xs text-destructive">{formErrors.category}</p>}
              </div>

              {/* Country */}
              <div className="space-y-2">
                <Label htmlFor="store-country">Country</Label>
                <Input
                  id="store-country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="Enter country"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Monthly Traffic */}
              <div className="space-y-2">
                <Label htmlFor="store-traffic">Monthly Traffic</Label>
                <Input
                  id="store-traffic"
                  type="number"
                  min="0"
                  value={formData.monthly_traffic}
                  onChange={(e) => setFormData({ ...formData, monthly_traffic: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>

              {/* Monthly Revenue */}
              <div className="space-y-2">
                <Label htmlFor="store-revenue">Monthly Revenue ($)</Label>
                <Input
                  id="store-revenue"
                  type="number"
                  min="0"
                  value={formData.monthly_revenue || ""}
                  onChange={(e) => setFormData({ ...formData, monthly_revenue: e.target.value ? parseInt(e.target.value) : null })}
                  placeholder="0"
                />
              </div>

              {/* Growth */}
              <div className="space-y-2">
                <Label htmlFor="store-growth">Growth (%)</Label>
                <Input
                  id="store-growth"
                  type="number"
                  step="0.1"
                  value={formData.growth}
                  onChange={(e) => setFormData({ ...formData, growth: parseFloat(e.target.value) || 0 })}
                  placeholder="0.0"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Products Count */}
              <div className="space-y-2">
                <Label htmlFor="store-products">Products Count</Label>
                <Input
                  id="store-products"
                  type="number"
                  min="0"
                  value={formData.products_count || ""}
                  onChange={(e) => setFormData({ ...formData, products_count: e.target.value ? parseInt(e.target.value) : undefined })}
                  placeholder="0"
                />
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <Label htmlFor="store-rating">Rating</Label>
                <Input
                  id="store-rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating || ""}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value ? parseFloat(e.target.value) : undefined })}
                  placeholder="0.0"
                />
              </div>

              {/* Logo URL */}
              <div className="space-y-2">
                <Label htmlFor="store-logo">Logo URL</Label>
                <Input
                  id="store-logo"
                  type="url"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>

            {/* Verified */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="store-verified"
                checked={formData.verified}
                onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="store-verified" className="cursor-pointer">
                Verified Store
              </Label>
            </div>
          </div>
          <DialogFooter className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setFormOpen(false)
                setEditingStore(null)
                setFormErrors({})
              }}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleFormSubmit} disabled={formLoading} className="cursor-pointer">
              {formLoading ? (
                <>
                  <Loader size="sm" className="mr-2" />
                  {editingStore ? "Updating..." : "Creating..."}
                </>
              ) : (
                editingStore ? "Update" : "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
