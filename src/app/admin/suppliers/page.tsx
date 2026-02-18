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
import { Plus, Trash2, CheckCircle2, Star, Copy, Edit, RefreshCw, Download, X, UserPlus, Search, Mail, Globe, Package, Check, AlertCircle, Building } from "lucide-react"
import { AdminSupplierCard } from "./components/admin-supplier-card"
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
import { Supplier } from "@/app/suppliers/data/suppliers"
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

export default function AdminSuppliersPage() {
  const router = useRouter()
  const { showSuccess, showError, showInfo } = useToast()
  
  // Permission checks
  const { hasPermission: canView } = useHasPermission("suppliers.view")
  const { hasPermission: canEdit } = useHasPermission("suppliers.edit")
  const { hasPermission: canCreate } = useHasPermission("suppliers.create")
  const { hasPermission: canDelete } = useHasPermission("suppliers.delete")
  const { hasPermission: canVerify } = useHasPermission("suppliers.verify")
  
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [selectedSuppliers, setSelectedSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [statusTab, setStatusTab] = useState<"all" | "verified" | "unverified">("all")
  const [quickFilter, setQuickFilter] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null)
  const [bulkActionLoading, setBulkActionLoading] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [assigneeModalOpen, setAssigneeModalOpen] = useState(false)
  const [assignedOwner, setAssignedOwner] = useState<string | null>(null)
  const [assignedMembers, setAssignedMembers] = useState<string[]>([])
  const [memberSearch, setMemberSearch] = useState("")
  const [tempOwner, setTempOwner] = useState<string | null>(null)
  const [tempMembers, setTempMembers] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    category: "",
    rating: 0,
    reviews: 0,
    minOrder: 0,
    leadTime: "",
    verified: false,
    specialties: [] as string[],
    description: "",
    contactEmail: "",
    website: "",
    logo: "",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [formLoading, setFormLoading] = useState(false)
  const [specialtyInput, setSpecialtyInput] = useState("")

  const internalUsers = sampleInternalUsers

  const categories = useMemo(() => {
    const categorySet = new Set(suppliers.map((s) => s.category))
    return Array.from(categorySet)
  }, [suppliers])

  const countries = useMemo(() => {
    const countrySet = new Set(suppliers.map((s) => s.country))
    return Array.from(countrySet)
  }, [suppliers])

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
        return suppliers.length
      case "verified":
        return suppliers.filter(s => s.verified).length
      case "unverified":
        return suppliers.filter(s => !s.verified).length
      default:
        return 0
    }
  }, [suppliers])

  // Quick filters
  const quickFilters = [
    { id: "verified", label: "Verified", count: 0 },
    { id: "high_rating", label: "High Rating", count: 0 },
    { id: "unverified", label: "Unverified", count: 0 },
  ]

  // Filter suppliers based on search, filters, status tab, date range, and quick filters
  const filteredSuppliers = useMemo(() => {
    let result = suppliers

    // Status tab filter
    if (statusTab !== "all") {
      switch (statusTab) {
        case "verified":
          result = result.filter(s => s.verified)
          break
        case "unverified":
          result = result.filter(s => !s.verified)
          break
      }
    }

    // Date range filter (using created_at if available, otherwise skip)
    if (dateRange.from || dateRange.to) {
      // Note: current Supplier type doesn't have created_at, so this is a placeholder
      // In production, you'd filter by actual created_at dates
    }

    // Quick filter
    if (quickFilter) {
      switch (quickFilter) {
        case "verified":
          result = result.filter(s => s.verified)
          break
        case "high_rating":
          result = result.filter(s => s.rating >= 4.5)
          break
        case "unverified":
          result = result.filter(s => !s.verified)
          break
      }
    }

    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      result = result.filter((supplier) =>
        supplier.name.toLowerCase().includes(searchLower) ||
        supplier.description.toLowerCase().includes(searchLower) ||
        supplier.country.toLowerCase().includes(searchLower) ||
        supplier.category.toLowerCase().includes(searchLower) ||
        (supplier.contactEmail && supplier.contactEmail.toLowerCase().includes(searchLower)) ||
        (supplier.specialties && supplier.specialties.some(s => s.toLowerCase().includes(searchLower)))
      )
    }

    // Column filters
    columnFilters.forEach((filter) => {
      if (!filter.value) return
      
      const filterValues = Array.isArray(filter.value) ? filter.value : [filter.value]
      if (filterValues.length === 0) return

      if (filter.id === "category") {
        result = result.filter((supplier) => filterValues.includes(supplier.category))
      }
      
      if (filter.id === "verified") {
        const isVerified = filterValues.includes("verified")
        const isUnverified = filterValues.includes("unverified")
        if (isVerified) result = result.filter(s => s.verified)
        if (isUnverified) result = result.filter(s => !s.verified)
      }

      if (filter.id === "country") {
        result = result.filter((supplier) => filterValues.includes(supplier.country))
      }
    })

    return result
  }, [suppliers, searchQuery, columnFilters, statusTab, quickFilter, dateRange])

  // Apply sorting
  const sortedSuppliers = useMemo(() => {
    if (!sorting || sorting.length === 0) {
      return filteredSuppliers
    }

    const sorted = [...filteredSuppliers]
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
          case "country":
            aValue = a.country.toLowerCase()
            bValue = b.country.toLowerCase()
            break
          case "category":
            aValue = a.category.toLowerCase()
            bValue = b.category.toLowerCase()
            break
          case "rating":
            aValue = a.rating
            bValue = b.rating
            break
          case "verified":
            aValue = a.verified ? 1 : 0
            bValue = b.verified ? 1 : 0
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
  }, [filteredSuppliers, sorting])

  // Paginate sorted suppliers
  const paginatedSuppliers = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return sortedSuppliers.slice(start, end)
  }, [sortedSuppliers, page, pageSize])

  useEffect(() => {
    setPageCount(Math.ceil(sortedSuppliers.length / pageSize))
    setInitialLoading(false)
  }, [sortedSuppliers.length, pageSize])

  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (statusTab === 'verified') params.set('verified', 'true')
      else if (statusTab === 'unverified') params.set('verified', 'false')
      const response = await fetch(`/api/admin/suppliers?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch suppliers')
      const data = await response.json()
      setSuppliers(data.suppliers || [])
    } catch (err) {
      console.error("Error fetching suppliers:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to load suppliers. Please try again."
      setError(errorMessage)
      showError(errorMessage)
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }, [showError, searchQuery, statusTab])

  useEffect(() => {
    fetchSuppliers()
  }, [fetchSuppliers])

  const handleViewDetails = useCallback((supplier: Supplier) => {
    router.push(`/admin/suppliers/${supplier.id}`)
  }, [router])

  const handleQuickView = useCallback((supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setQuickViewOpen(true)
  }, [])

  const handleDelete = useCallback((supplier: Supplier) => {
    if (!canDelete) {
      showError("You don't have permission to delete suppliers")
      return
    }
    setSupplierToDelete(supplier)
    setDeleteConfirmOpen(true)
  }, [canDelete, showError])

  const confirmDelete = async () => {
    if (!supplierToDelete) return
    setBulkActionLoading("delete")
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuppliers((prev) => prev.filter((s) => s.id !== supplierToDelete.id))
      setSelectedSuppliers((prev) => prev.filter((s) => s.id !== supplierToDelete.id))
      setDeleteConfirmOpen(false)
      const deletedSupplierName = supplierToDelete.name
      setSupplierToDelete(null)
      showSuccess(`Supplier "${deletedSupplierName}" deleted successfully`)
      await fetchSuppliers()
    } catch (err) {
      showError("Failed to delete supplier")
    } finally {
      setBulkActionLoading(null)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedSuppliers.length === 0) return
    if (!canDelete) {
      showError("You don't have permission to delete suppliers")
      return
    }
    setBulkActionLoading("bulk-delete")
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const deletedCount = selectedSuppliers.length
      setSuppliers((prev) => prev.filter((s) => !selectedSuppliers.some((ss) => ss.id === s.id)))
      setSelectedSuppliers([])
      showSuccess(`${deletedCount} supplier(s) deleted successfully`)
      await fetchSuppliers()
    } catch (err) {
      showError("Failed to delete suppliers")
    } finally {
      setBulkActionLoading(null)
    }
  }

  const handleBulkVerify = async () => {
    if (selectedSuppliers.length === 0) return
    if (!canVerify) {
      showError("You don't have permission to verify suppliers")
      return
    }
    setBulkActionLoading("bulk-verify")
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuppliers((prev) =>
        prev.map((s) =>
          selectedSuppliers.some((ss) => ss.id === s.id)
            ? { ...s, verified: true }
            : s
        )
      )
      setSelectedSuppliers([])
      showSuccess(`${selectedSuppliers.length} supplier(s) verified successfully`)
      await fetchSuppliers()
    } catch (err) {
      showError("Failed to verify suppliers")
    } finally {
      setBulkActionLoading(null)
    }
  }

  const handleBulkUnverify = async () => {
    if (selectedSuppliers.length === 0) return
    if (!canVerify) {
      showError("You don't have permission to unverify suppliers")
      return
    }
    setBulkActionLoading("bulk-unverify")
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuppliers((prev) =>
        prev.map((s) =>
          selectedSuppliers.some((ss) => ss.id === s.id)
            ? { ...s, verified: false }
            : s
        )
      )
      setSelectedSuppliers([])
      showSuccess(`${selectedSuppliers.length} supplier(s) unverified successfully`)
      await fetchSuppliers()
    } catch (err) {
      showError("Failed to unverify suppliers")
    } finally {
      setBulkActionLoading(null)
    }
  }

  const handleCopySupplierId = useCallback(async (supplier: Supplier) => {
    try {
      await navigator.clipboard.writeText(supplier.id)
      showSuccess("Supplier ID copied to clipboard")
    } catch (err) {
      showError("Failed to copy Supplier ID")
    }
  }, [showSuccess, showError])

  const handleCopyEmail = useCallback(async (supplier: Supplier) => {
    if (!supplier.contactEmail) {
      showError("No email address available")
      return
    }
    try {
      await navigator.clipboard.writeText(supplier.contactEmail)
      showSuccess("Email copied to clipboard")
    } catch (err) {
      showError("Failed to copy email")
    }
  }, [showSuccess, showError])

  const handleToggleVerify = useCallback(async (supplier: Supplier) => {
    if (!canVerify) {
      showError("You don't have permission to verify/unverify suppliers")
      return
    }
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === supplier.id
            ? { ...s, verified: !s.verified }
            : s
        )
      )
      showSuccess(`Supplier ${!supplier.verified ? "verified" : "unverified"} successfully`)
      await fetchSuppliers()
    } catch (err) {
      showError("Failed to update supplier")
    }
  }, [canVerify, showSuccess, showError, fetchSuppliers])

  const handleViewProducts = useCallback((supplier: Supplier) => {
    router.push(`/admin/products?supplier=${supplier.id}`)
  }, [router])

  const handleEdit = useCallback((supplier: Supplier) => {
    if (!canEdit) {
      showError("You don't have permission to edit suppliers")
      return
    }
    setEditingSupplier(supplier)
    setFormData({
      name: supplier.name,
      country: supplier.country,
      category: supplier.category,
      rating: supplier.rating,
      reviews: supplier.reviews,
      minOrder: supplier.minOrder,
      leadTime: supplier.leadTime,
      verified: supplier.verified,
      specialties: supplier.specialties || [],
      description: supplier.description,
      contactEmail: supplier.contactEmail || "",
      website: supplier.website || "",
      logo: supplier.logo || "",
    })
    setFormErrors({})
    setFormOpen(true)
  }, [canEdit, showError])

  const handleDuplicate = useCallback(async (supplier: Supplier) => {
    if (!canCreate) {
      showError("You don't have permission to create suppliers")
      return
    }
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const duplicatedSupplier: Supplier = {
        ...supplier,
        id: `supplier_${Date.now()}`,
        name: `${supplier.name} (Copy)`,
        verified: false,
      }
      setSuppliers((prev) => [...prev, duplicatedSupplier])
      showSuccess(`Supplier "${duplicatedSupplier.name}" duplicated successfully`)
      await fetchSuppliers()
    } catch (err) {
      showError("Failed to duplicate supplier")
    }
  }, [canCreate, showSuccess, showError, fetchSuppliers])

  const handleCreate = useCallback(() => {
    if (!canCreate) {
      showError("You don't have permission to create suppliers")
      return
    }
    setEditingSupplier(null)
    setFormData({
      name: "",
      country: "",
      category: "",
      rating: 0,
      reviews: 0,
      minOrder: 0,
      leadTime: "",
      verified: false,
      specialties: [],
      description: "",
      contactEmail: "",
      website: "",
      logo: "",
    })
    setFormErrors({})
    setSpecialtyInput("")
    setFormOpen(true)
  }, [canCreate, showError])

  const handleFormSubmit = async () => {
    if (!canEdit && !canCreate) {
      showError("You don't have permission to create or edit suppliers")
      return
    }

    const errors: Record<string, string> = {}
    if (!formData.name.trim()) errors.name = "Name is required"
    if (!formData.country.trim()) errors.country = "Country is required"
    if (!formData.category.trim()) errors.category = "Category is required"
    if (!formData.description.trim()) errors.description = "Description is required"
    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      errors.contactEmail = "Invalid email format"
    }
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      errors.website = "Invalid website URL"
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setFormLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (editingSupplier) {
        setSuppliers((prev) =>
          prev.map((s) =>
            s.id === editingSupplier.id
              ? {
                  ...s,
                  name: formData.name,
                  country: formData.country,
                  category: formData.category,
                  rating: formData.rating,
                  reviews: formData.reviews,
                  minOrder: formData.minOrder,
                  leadTime: formData.leadTime,
                  verified: formData.verified,
                  specialties: formData.specialties,
                  description: formData.description,
                  contactEmail: formData.contactEmail || '',
                  website: formData.website || undefined,
                  logo: formData.logo || undefined,
                }
              : s
          )
        )
      } else {
        const newSupplier: Supplier = {
          id: `sup-${Date.now()}`,
          name: formData.name,
          country: formData.country,
          category: formData.category,
          rating: formData.rating,
          reviews: formData.reviews,
          minOrder: formData.minOrder,
          leadTime: formData.leadTime,
          verified: formData.verified,
          specialties: formData.specialties,
          description: formData.description,
          contactEmail: formData.contactEmail || undefined,
          website: formData.website || undefined,
          logo: formData.logo || undefined,
        }
        setSuppliers((prev) => [...prev, newSupplier])
      }

      setFormOpen(false)
      setEditingSupplier(null)
      setFormErrors({})
      showSuccess(editingSupplier ? `Supplier "${formData.name}" updated successfully` : `Supplier "${formData.name}" created successfully`)
      await fetchSuppliers()
    } catch (err) {
      console.error("Error saving supplier:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to save supplier. Please try again."
      setError(errorMessage)
      showError(errorMessage)
    } finally {
      setFormLoading(false)
    }
  }

  const handleAddSpecialty = () => {
    if (specialtyInput.trim() && !formData.specialties.includes(specialtyInput.trim())) {
      setFormData({ ...formData, specialties: [...formData.specialties, specialtyInput.trim()] })
      setSpecialtyInput("")
    }
  }

  const handleRemoveSpecialty = (specialty: string) => {
    setFormData({ ...formData, specialties: formData.specialties.filter(s => s !== specialty) })
  }

  const handleBulkExport = useCallback(() => {
    if (selectedSuppliers.length === 0) {
      showError("No suppliers selected for export")
      return
    }
    try {
      const csv = [
        ["Supplier ID", "Name", "Country", "Category", "Rating", "Reviews", "Verified", "Contact Email", "Website"],
        ...selectedSuppliers.map((supplier) => [
          supplier.id,
          supplier.name,
          supplier.country,
          supplier.category,
          supplier.rating.toFixed(1),
          supplier.reviews.toString(),
          supplier.verified ? "Yes" : "No",
          supplier.contactEmail || "",
          supplier.website || "",
        ]),
      ]
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n")

      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `selected-suppliers-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
      showSuccess(`Exported ${selectedSuppliers.length} supplier(s) to CSV`)
    } catch (err) {
      showError("Failed to export suppliers")
    }
  }, [selectedSuppliers, showSuccess, showError])

  const handleRowClick = useCallback((supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setQuickViewOpen(true)
  }, [])


  const categoryOptions = categories.map((cat) => ({
    label: cat,
    value: cat,
  }))

  const countryOptions = countries.map((country) => ({
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
      columnId: "verified",
      title: "Verification",
      options: [
        { label: "Verified", value: "verified" },
        { label: "Unverified", value: "unverified" },
      ],
    },
    {
      columnId: "country",
      title: "Country",
      options: countryOptions,
    },
  ]

  const secondaryButtons = useMemo(() => {
    if (selectedSuppliers.length > 0) {
      return [
        {
          label: bulkActionLoading === "bulk-verify" ? "Verifying..." : "Verify Selected",
          icon: bulkActionLoading === "bulk-verify" ? <Loader size="sm" className="mr-2" /> : <CheckCircle2 className="h-4 w-4" />,
          onClick: handleBulkVerify,
          variant: "outline" as const,
          disabled: !canVerify || bulkActionLoading !== null,
          tooltip: !canVerify ? "You don't have permission to verify suppliers" : undefined,
        },
        {
          label: bulkActionLoading === "bulk-unverify" ? "Unverifying..." : "Unverify Selected",
          icon: bulkActionLoading === "bulk-unverify" ? <Loader size="sm" className="mr-2" /> : <X className="h-4 w-4" />,
          onClick: handleBulkUnverify,
          variant: "outline" as const,
          disabled: !canVerify || bulkActionLoading !== null,
          tooltip: !canVerify ? "You don't have permission to unverify suppliers" : undefined,
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
          tooltip: !canDelete ? "You don't have permission to delete suppliers" : undefined,
        },
        {
          label: "Clear Selection",
          onClick: () => setSelectedSuppliers([]),
          variant: "ghost" as const,
        },
      ]
    } else {
              return [
                {
                  label: "Create Supplier",
                  icon: <Plus className="h-4 w-4" />,
                  onClick: handleCreate,
                  variant: "default" as const,
                  disabled: !canCreate,
                  tooltip: !canCreate ? "You don't have permission to create suppliers" : undefined,
                },
              ]
            }
          }, [selectedSuppliers, bulkActionLoading, canEdit, canDelete, canVerify, canCreate, handleBulkVerify, handleBulkUnverify, handleBulkDelete, handleBulkExport, handleCreate])

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      <div className="bg-primary/85 text-primary-foreground rounded-md px-4 py-3 mb-3 flex-shrink-0 w-full">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-white">Suppliers</h1>
            <p className="text-xs text-white/90 mt-0.5">
              Manage suppliers and vendor information
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
                      <Avatar key={memberId} className="h-8 w-8 border-2 border-white/20">
                        <AvatarImage src={getAvatarUrl(memberId, member?.email)} />
                        <AvatarFallback className="text-xs bg-white/20 text-white">
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
                className="whitespace-nowrap cursor-pointer bg-white/10 border-white/20 text-white hover:bg-white/20"
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
            onClick={fetchSuppliers}
            className="mt-2 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      )}

      {initialLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Loading suppliers...</div>
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
                <TabsTrigger value="verified" className="cursor-pointer">
                  Verified
                  <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5 text-xs">
                    {getStatusCount("verified")}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="unverified" className="cursor-pointer">
                  Unverified
                  <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5 text-xs">
                    {getStatusCount("unverified")}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Toolbar */}
          <div className="mb-4 flex items-center gap-1.5 flex-wrap">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <Input
                placeholder="Search suppliers..."
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
                  <span>Loading suppliers...</span>
                </div>
              </div>
            ) : paginatedSuppliers.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Building className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                <p className="text-sm text-muted-foreground">No suppliers found</p>
                <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {paginatedSuppliers.map((supplier) => (
                  <AdminSupplierCard
                    key={supplier.id}
                    supplier={supplier}
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
          {!initialLoading && paginatedSuppliers.length > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredSuppliers.length)} of {filteredSuppliers.length} suppliers
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
      {selectedSupplier && (
        <Dialog 
          open={quickViewOpen} 
          onOpenChange={(open) => {
            setQuickViewOpen(open)
            if (!open) {
              setSelectedSupplier(null)
            }
          }}
        >
          <DialogContent className="max-w-xs p-4">
            <DialogHeader className="pb-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                  {selectedSupplier.logo ? (
                    <Image
                      src={selectedSupplier.logo}
                      alt={selectedSupplier.name}
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
                  <DialogTitle className="text-base truncate">{selectedSupplier.name}</DialogTitle>
                  <DialogDescription className="text-xs truncate">{selectedSupplier.category}</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-2 py-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">Country</span>
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  {selectedSupplier.country}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{selectedSupplier.rating.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">({selectedSupplier.reviews})</span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">Status</span>
                <Badge variant={selectedSupplier.verified ? "default" : "outline"} className="text-xs px-2 py-0.5">
                  {selectedSupplier.verified ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verified
                    </>
                  ) : (
                    "Unverified"
                  )}
                </Badge>
              </div>
              {selectedSupplier.contactEmail && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">Email</span>
                  <span className="text-xs font-medium truncate">{selectedSupplier.contactEmail}</span>
                </div>
              )}
            </div>
            <DialogFooter className="pt-3 border-t mt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setQuickViewOpen(false)
                  handleViewDetails(selectedSupplier)
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
      {selectedSupplier && (
        <DetailDrawer
          open={detailDrawerOpen}
          onOpenChange={setDetailDrawerOpen}
          title={selectedSupplier.name}
          tabs={[
            {
              value: "overview",
              label: "Overview",
              content: (
                <div className="space-y-6">
                  {selectedSupplier.logo && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={selectedSupplier.logo}
                        alt={selectedSupplier.name}
                        fill
                        className="object-cover"
                        sizes="100%"
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Country</p>
                      <p className="text-sm font-mono">{selectedSupplier.country}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Category</p>
                      <Badge variant="outline">{selectedSupplier.category}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Rating</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-lg font-semibold">{selectedSupplier.rating.toFixed(1)}</span>
                        <span className="text-sm text-muted-foreground">({selectedSupplier.reviews} reviews)</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <Badge variant={selectedSupplier.verified ? "default" : "outline"}>
                        {selectedSupplier.verified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Min Order</p>
                      <p className="text-lg font-semibold">${selectedSupplier.minOrder}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Lead Time</p>
                      <p className="text-lg font-semibold">{selectedSupplier.leadTime}</p>
                    </div>
                  </div>
                  {selectedSupplier.description && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Description</p>
                      <p className="text-sm">{selectedSupplier.description}</p>
                    </div>
                  )}
                  {selectedSupplier.specialties && selectedSupplier.specialties.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Specialties</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedSupplier.specialties.map((specialty, idx) => (
                          <Badge key={idx} variant="secondary">{specialty}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedSupplier.contactEmail && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Contact Email</p>
                      <p className="text-sm font-mono">{selectedSupplier.contactEmail}</p>
                    </div>
                  )}
                  {selectedSupplier.website && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Website</p>
                      <a href={selectedSupplier.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        {selectedSupplier.website}
                      </a>
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
                  <p className="text-sm text-muted-foreground">View products from this supplier</p>
                  <Button onClick={() => handleViewProducts(selectedSupplier)} variant="outline">
                    <Package className="h-4 w-4 mr-2" />
                    View Products
                  </Button>
                </div>
              ),
            },
          ]}
          headerActions={
            <Button variant="destructive" size="sm" onClick={() => handleDelete(selectedSupplier)}>
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
            <DialogTitle>Delete Supplier</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this supplier? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {supplierToDelete && (
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Supplier:</span> {supplierToDelete.name}
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

      {/* Create/Edit Supplier Form Modal */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle>{editingSupplier ? "Edit Supplier" : "Create Supplier"}</DialogTitle>
            <DialogDescription>
              {editingSupplier
                ? "Update supplier information and details."
                : "Create a new supplier with all relevant information."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="supplier-name">Name *</Label>
              <Input
                id="supplier-name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value })
                  if (formErrors.name) setFormErrors({ ...formErrors, name: "" })
                }}
                placeholder="Enter supplier name"
                className={formErrors.name ? "border-destructive" : ""}
              />
              {formErrors.name && <p className="text-xs text-destructive">{formErrors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Country */}
              <div className="space-y-2">
                <Label htmlFor="supplier-country">Country *</Label>
                <Input
                  id="supplier-country"
                  value={formData.country}
                  onChange={(e) => {
                    setFormData({ ...formData, country: e.target.value })
                    if (formErrors.country) setFormErrors({ ...formErrors, country: "" })
                  }}
                  placeholder="Enter country"
                  className={formErrors.country ? "border-destructive" : ""}
                />
                {formErrors.country && <p className="text-xs text-destructive">{formErrors.country}</p>}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="supplier-category">Category *</Label>
                <Input
                  id="supplier-category"
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
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="supplier-description">Description *</Label>
                <textarea
                id="supplier-description"
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value })
                  if (formErrors.description) setFormErrors({ ...formErrors, description: "" })
                }}
                placeholder="Enter supplier description"
                className={`w-full px-3 py-2 border rounded-md min-h-[100px] ${formErrors.description ? "border-destructive" : ""}`}
              />
              {formErrors.description && <p className="text-xs text-destructive">{formErrors.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Rating */}
              <div className="space-y-2">
                <Label htmlFor="supplier-rating">Rating</Label>
                <Input
                  id="supplier-rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                  placeholder="0.0"
                />
              </div>

              {/* Reviews */}
              <div className="space-y-2">
                <Label htmlFor="supplier-reviews">Reviews</Label>
                <Input
                  id="supplier-reviews"
                  type="number"
                  min="0"
                  value={formData.reviews}
                  onChange={(e) => setFormData({ ...formData, reviews: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Min Order */}
              <div className="space-y-2">
                <Label htmlFor="supplier-min-order">Min Order ($)</Label>
                <Input
                  id="supplier-min-order"
                  type="number"
                  min="0"
                  value={formData.minOrder}
                  onChange={(e) => setFormData({ ...formData, minOrder: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>

              {/* Lead Time */}
              <div className="space-y-2">
                <Label htmlFor="supplier-lead-time">Lead Time</Label>
                <Input
                  id="supplier-lead-time"
                  value={formData.leadTime}
                  onChange={(e) => setFormData({ ...formData, leadTime: e.target.value })}
                  placeholder="e.g., 7-14 days"
                />
              </div>
            </div>

            {/* Contact Email */}
            <div className="space-y-2">
              <Label htmlFor="supplier-email">Contact Email</Label>
              <Input
                id="supplier-email"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => {
                  setFormData({ ...formData, contactEmail: e.target.value })
                  if (formErrors.contactEmail) setFormErrors({ ...formErrors, contactEmail: "" })
                }}
                placeholder="contact@supplier.com"
                className={formErrors.contactEmail ? "border-destructive" : ""}
              />
              {formErrors.contactEmail && <p className="text-xs text-destructive">{formErrors.contactEmail}</p>}
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="supplier-website">Website</Label>
              <Input
                id="supplier-website"
                type="url"
                value={formData.website}
                onChange={(e) => {
                  setFormData({ ...formData, website: e.target.value })
                  if (formErrors.website) setFormErrors({ ...formErrors, website: "" })
                }}
                placeholder="https://supplier.com"
                className={formErrors.website ? "border-destructive" : ""}
              />
              {formErrors.website && <p className="text-xs text-destructive">{formErrors.website}</p>}
            </div>

            {/* Logo URL */}
            <div className="space-y-2">
              <Label htmlFor="supplier-logo">Logo URL</Label>
              <Input
                id="supplier-logo"
                type="url"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                placeholder="https://supplier.com/logo.png"
              />
            </div>

            {/* Specialties */}
            <div className="space-y-2">
              <Label htmlFor="supplier-specialties">Specialties</Label>
              <div className="flex gap-2">
                <Input
                  id="supplier-specialties"
                  value={specialtyInput}
                  onChange={(e) => setSpecialtyInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddSpecialty()
                    }
                  }}
                  placeholder="Add specialty"
                />
                <Button type="button" variant="outline" onClick={handleAddSpecialty}>
                  Add
                </Button>
              </div>
              {formData.specialties.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.specialties.map((specialty, idx) => (
                    <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                      {specialty}
                      <button
                        onClick={() => handleRemoveSpecialty(specialty)}
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Verified */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="supplier-verified"
                checked={formData.verified}
                onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="supplier-verified" className="cursor-pointer">
                Verified Supplier
              </Label>
            </div>
          </div>
          <DialogFooter className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setFormOpen(false)
                setEditingSupplier(null)
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
                  {editingSupplier ? "Updating..." : "Creating..."}
                </>
              ) : (
                editingSupplier ? "Update" : "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
