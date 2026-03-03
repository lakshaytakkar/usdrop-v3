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
import { Plus, Trash2, CheckCircle2, Star, Download, X, RefreshCw, Building, Package, Globe } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader } from "@/components/ui/loader"
import { Supplier } from "@/pages/suppliers/data/suppliers"
import { useToast } from "@/hooks/use-toast"
import { useHasPermission } from "@/hooks/use-has-permission"
import { DataTable } from "@/components/data-table/data-table"
import { createSuppliersColumns } from "./components/suppliers-columns"
import { AdminSupplierCard } from "./components/admin-supplier-card"
import {
  AdminPageHeader,
  AdminStatCards,
  AdminFilterBar,
  AdminActionBar,
  AdminEmptyState,
} from "@/components/admin"

export default function AdminSuppliersPage() {
  const router = useRouter()
  const { showSuccess, showError } = useToast()

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
  const [statusTab, setStatusTab] = useState("all")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [view, setView] = useState("table")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null)
  const [bulkActionLoading, setBulkActionLoading] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
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

  const categories = useMemo(() => {
    const categorySet = new Set(suppliers.map((s) => s.category))
    return Array.from(categorySet)
  }, [suppliers])

  const countries = useMemo(() => {
    const countrySet = new Set(suppliers.map((s) => s.country))
    return Array.from(countrySet)
  }, [suppliers])

  const verifiedCount = useMemo(() => suppliers.filter(s => s.verified).length, [suppliers])
  const unverifiedCount = useMemo(() => suppliers.filter(s => !s.verified).length, [suppliers])
  const avgRating = useMemo(() => {
    if (suppliers.length === 0) return "0"
    return (suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length).toFixed(1)
  }, [suppliers])

  const filteredSuppliers = useMemo(() => {
    let result = suppliers

    if (statusTab === "verified") result = result.filter(s => s.verified)
    else if (statusTab === "unverified") result = result.filter(s => !s.verified)

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        (s.contactEmail && s.contactEmail.toLowerCase().includes(q)) ||
        (s.specialties && s.specialties.some(sp => sp.toLowerCase().includes(q)))
      )
    }

    columnFilters.forEach((filter) => {
      if (!filter.value) return
      const vals = Array.isArray(filter.value) ? filter.value : [filter.value]
      if (vals.length === 0) return
      if (filter.id === "category") result = result.filter((s) => vals.includes(s.category))
      if (filter.id === "country") result = result.filter((s) => vals.includes(s.country))
      if (filter.id === "verified") {
        if (vals.includes("verified")) result = result.filter(s => s.verified)
        if (vals.includes("unverified")) result = result.filter(s => !s.verified)
      }
    })

    return result
  }, [suppliers, searchQuery, columnFilters, statusTab])

  const sortedSuppliers = useMemo(() => {
    if (!sorting || sorting.length === 0) return filteredSuppliers
    const sorted = [...filteredSuppliers]
    sorting.forEach(({ id, desc }) => {
      sorted.sort((a, b) => {
        let aVal: any, bVal: any
        switch (id) {
          case "name": aVal = a.name.toLowerCase(); bVal = b.name.toLowerCase(); break
          case "country": aVal = a.country.toLowerCase(); bVal = b.country.toLowerCase(); break
          case "category": aVal = a.category.toLowerCase(); bVal = b.category.toLowerCase(); break
          case "rating": aVal = a.rating; bVal = b.rating; break
          case "verified": aVal = a.verified ? 1 : 0; bVal = b.verified ? 1 : 0; break
          default: return 0
        }
        if (aVal < bVal) return desc ? 1 : -1
        if (aVal > bVal) return desc ? -1 : 1
        return 0
      })
    })
    return sorted
  }, [filteredSuppliers, sorting])

  const pageCount = useMemo(() => Math.ceil(sortedSuppliers.length / pageSize), [sortedSuppliers.length, pageSize])

  const paginatedSuppliers = useMemo(() => {
    const start = (page - 1) * pageSize
    return sortedSuppliers.slice(start, start + pageSize)
  }, [sortedSuppliers, page, pageSize])

  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (statusTab === 'verified') params.set('verified', 'true')
      else if (statusTab === 'unverified') params.set('verified', 'false')
      const response = await apiFetch(`/api/admin/suppliers?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch suppliers')
      const data = await response.json()
      setSuppliers(data.suppliers || [])
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load suppliers."
      setError(msg)
      showError(msg)
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }, [showError, searchQuery, statusTab])

  useEffect(() => { fetchSuppliers() }, [fetchSuppliers])

  const handleViewDetails = useCallback((supplier: Supplier) => {
    router.push(`/admin/suppliers/${supplier.id}`)
  }, [router])

  const handleDelete = useCallback((supplier: Supplier) => {
    if (!canDelete) { showError("You don't have permission to delete suppliers"); return }
    setSupplierToDelete(supplier)
    setDeleteConfirmOpen(true)
  }, [canDelete, showError])

  const confirmDelete = async () => {
    if (!supplierToDelete) return
    setBulkActionLoading("delete")
    try {
      const res = await apiFetch(`/api/admin/suppliers/${supplierToDelete.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      setDeleteConfirmOpen(false)
      showSuccess(`Supplier "${supplierToDelete.name}" deleted successfully`)
      setSupplierToDelete(null)
      await fetchSuppliers()
    } catch {
      showError("Failed to delete supplier")
    } finally {
      setBulkActionLoading(null)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedSuppliers.length === 0 || !canDelete) return
    setBulkActionLoading("bulk-delete")
    try {
      const count = selectedSuppliers.length
      for (const s of selectedSuppliers) {
        await apiFetch(`/api/admin/suppliers/${s.id}`, { method: "DELETE" })
      }
      setSelectedSuppliers([])
      showSuccess(`${count} supplier(s) deleted successfully`)
      await fetchSuppliers()
    } catch {
      showError("Failed to delete suppliers")
    } finally {
      setBulkActionLoading(null)
    }
  }

  const handleBulkVerify = async () => {
    if (selectedSuppliers.length === 0 || !canVerify) return
    setBulkActionLoading("bulk-verify")
    try {
      for (const s of selectedSuppliers) {
        await apiFetch(`/api/admin/suppliers/${s.id}`, {
          method: "PATCH",
          body: JSON.stringify({ verified: true }),
        })
      }
      setSelectedSuppliers([])
      showSuccess(`${selectedSuppliers.length} supplier(s) verified`)
      await fetchSuppliers()
    } catch {
      showError("Failed to verify suppliers")
    } finally {
      setBulkActionLoading(null)
    }
  }

  const handleToggleVerify = useCallback(async (supplier: Supplier) => {
    if (!canVerify) { showError("You don't have permission to verify suppliers"); return }
    try {
      await apiFetch(`/api/admin/suppliers/${supplier.id}`, {
        method: "PATCH",
        body: JSON.stringify({ verified: !supplier.verified }),
      })
      showSuccess(`Supplier ${!supplier.verified ? "verified" : "unverified"} successfully`)
      await fetchSuppliers()
    } catch {
      showError("Failed to update supplier")
    }
  }, [canVerify, showSuccess, showError, fetchSuppliers])

  const handleCopySupplierId = useCallback(async (supplier: Supplier) => {
    try {
      await navigator.clipboard.writeText(supplier.id)
      showSuccess("Supplier ID copied to clipboard")
    } catch { showError("Failed to copy") }
  }, [showSuccess, showError])

  const handleCopyEmail = useCallback(async (supplier: Supplier) => {
    if (!supplier.contactEmail) { showError("No email available"); return }
    try {
      await navigator.clipboard.writeText(supplier.contactEmail)
      showSuccess("Email copied to clipboard")
    } catch { showError("Failed to copy") }
  }, [showSuccess, showError])

  const handleViewProducts = useCallback((supplier: Supplier) => {
    router.push(`/admin/products?supplier=${supplier.id}`)
  }, [router])

  const handleEdit = useCallback((supplier: Supplier) => {
    if (!canEdit) { showError("You don't have permission to edit suppliers"); return }
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

  const handleCreate = useCallback(() => {
    if (!canCreate) { showError("You don't have permission to create suppliers"); return }
    setEditingSupplier(null)
    setFormData({ name: "", country: "", category: "", rating: 0, reviews: 0, minOrder: 0, leadTime: "", verified: false, specialties: [], description: "", contactEmail: "", website: "", logo: "" })
    setFormErrors({})
    setSpecialtyInput("")
    setFormOpen(true)
  }, [canCreate, showError])

  const handleFormSubmit = async () => {
    const errors: Record<string, string> = {}
    if (!formData.name.trim()) errors.name = "Name is required"
    if (!formData.country.trim()) errors.country = "Country is required"
    if (!formData.category.trim()) errors.category = "Category is required"
    if (!formData.description.trim()) errors.description = "Description is required"
    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) errors.contactEmail = "Invalid email"
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) errors.website = "Invalid URL"
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return }

    setFormLoading(true)
    try {
      if (editingSupplier) {
        const res = await apiFetch(`/api/admin/suppliers/${editingSupplier.id}`, {
          method: "PATCH",
          body: JSON.stringify(formData),
        })
        if (!res.ok) throw new Error("Failed to update")
        showSuccess(`Supplier "${formData.name}" updated successfully`)
      } else {
        const res = await apiFetch(`/api/admin/suppliers`, {
          method: "POST",
          body: JSON.stringify(formData),
        })
        if (!res.ok) throw new Error("Failed to create")
        showSuccess(`Supplier "${formData.name}" created successfully`)
      }
      setFormOpen(false)
      setEditingSupplier(null)
      await fetchSuppliers()
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save supplier"
      showError(msg)
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
    const items = selectedSuppliers.length > 0 ? selectedSuppliers : sortedSuppliers
    if (items.length === 0) { showError("No suppliers to export"); return }
    try {
      const csv = [
        ["ID", "Name", "Country", "Category", "Rating", "Reviews", "Verified", "Email", "Website"],
        ...items.map((s) => [s.id, s.name, s.country, s.category, s.rating.toFixed(1), s.reviews.toString(), s.verified ? "Yes" : "No", s.contactEmail || "", s.website || ""]),
      ].map((row) => row.map((c) => `"${c}"`).join(",")).join("\n")
      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `suppliers-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
      showSuccess(`Exported ${items.length} supplier(s) to CSV`)
    } catch { showError("Failed to export") }
  }, [selectedSuppliers, sortedSuppliers, showSuccess, showError])

  const handleRowClick = useCallback((supplier: Supplier) => {
    handleViewDetails(supplier)
  }, [handleViewDetails])

  const columns = useMemo(() => createSuppliersColumns({
    onViewDetails: handleViewDetails,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onCopySupplierId: handleCopySupplierId,
    onCopyEmail: handleCopyEmail,
    onToggleVerify: handleToggleVerify,
    onViewProducts: handleViewProducts,
    canEdit,
    canDelete,
    canVerify,
  }), [handleViewDetails, handleEdit, handleDelete, handleCopySupplierId, handleCopyEmail, handleToggleVerify, handleViewProducts, canEdit, canDelete, canVerify])

  const filterConfig = useMemo(() => [
    { columnId: "category", title: "Category", options: categories.map(c => ({ label: c, value: c })) },
    { columnId: "verified", title: "Verification", options: [{ label: "Verified", value: "verified" }, { label: "Unverified", value: "unverified" }] },
    { columnId: "country", title: "Country", options: countries.map(c => ({ label: c, value: c })) },
  ], [categories, countries])

  const statCards = useMemo(() => [
    { label: "Total Suppliers", value: suppliers.length, icon: Building, description: "All registered suppliers" },
    { label: "Verified", value: verifiedCount, icon: CheckCircle2, badge: suppliers.length > 0 ? `${Math.round((verifiedCount / suppliers.length) * 100)}%` : "0%", badgeVariant: "success" as const, description: "Verified suppliers" },
    { label: "Unverified", value: unverifiedCount, icon: Package, badge: suppliers.length > 0 ? `${Math.round((unverifiedCount / suppliers.length) * 100)}%` : "0%", badgeVariant: "warning" as const, description: "Pending verification" },
    { label: "Avg Rating", value: avgRating, icon: Star, description: "Average supplier rating" },
  ], [suppliers.length, verifiedCount, unverifiedCount, avgRating])

  const statusTabs = useMemo(() => [
    { value: "all", label: "All", count: suppliers.length },
    { value: "verified", label: "Verified", count: verifiedCount },
    { value: "unverified", label: "Unverified", count: unverifiedCount },
  ], [suppliers.length, verifiedCount, unverifiedCount])

  const renderGridView = useCallback((_view: string, data: Supplier[]) => {
    if (data.length === 0) {
      return (
        <AdminEmptyState
          icon={Building}
          title="No suppliers found"
          description="Try adjusting your search or filters, or add a new supplier."
          actionLabel="Add Supplier"
          onAction={handleCreate}
        />
      )
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-1">
        {data.map((supplier) => (
          <AdminSupplierCard
            key={supplier.id}
            supplier={supplier}
            onEdit={handleEdit}
            onViewDetails={handleViewDetails}
            onDelete={handleDelete}
            onVerify={handleToggleVerify}
            canEdit={canEdit}
            canDelete={canDelete}
            canVerify={canVerify}
          />
        ))}
      </div>
    )
  }, [handleCreate, handleEdit, handleViewDetails, handleDelete, handleToggleVerify, canEdit, canDelete, canVerify])

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden gap-4" data-testid="admin-suppliers-page">
      <AdminPageHeader
        title="Suppliers"
        description="Manage product suppliers and verification status"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Suppliers" },
        ]}
        actions={[
          { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleBulkExport, variant: "outline" },
          { label: "Refresh", icon: <RefreshCw className="h-4 w-4" />, onClick: fetchSuppliers, variant: "outline" },
          { label: "Add Supplier", icon: <Plus className="h-4 w-4" />, onClick: handleCreate, disabled: !canCreate },
        ]}
      />

      <AdminStatCards stats={statCards} loading={initialLoading} columns={4} />

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchSuppliers} className="mt-2" data-testid="button-retry">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      )}

      <AdminActionBar
        selectedCount={selectedSuppliers.length}
        onClearSelection={() => setSelectedSuppliers([])}
        actions={[
          { label: "Verify", icon: <CheckCircle2 className="h-4 w-4" />, onClick: handleBulkVerify, disabled: !canVerify || bulkActionLoading !== null, loading: bulkActionLoading === "bulk-verify" },
          { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleBulkExport },
          { label: "Delete", icon: <Trash2 className="h-4 w-4" />, onClick: handleBulkDelete, variant: "destructive", disabled: !canDelete || bulkActionLoading !== null, loading: bulkActionLoading === "bulk-delete" },
        ]}
      />

      <AdminFilterBar
        search={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search suppliers..."
        tabs={statusTabs}
        activeTab={statusTab}
        onTabChange={setStatusTab}
      />

      <div className="flex-1 min-h-0 flex flex-col">
        <DataTable
          columns={columns}
          data={paginatedSuppliers}
          pageCount={pageCount}
          onPaginationChange={(p, ps) => { setPage(p); setPageSize(ps) }}
          onSortingChange={setSorting}
          onFilterChange={setColumnFilters}
          onSearchChange={setSearchQuery}
          loading={loading}
          initialLoading={initialLoading}
          view={view}
          onViewChange={setView}
          searchPlaceholder="Search suppliers..."
          filterConfig={filterConfig}
          page={page}
          pageSize={pageSize}
          enableRowSelection
          onRowSelectionChange={setSelectedSuppliers}
          onRowClick={handleRowClick}
          renderCustomView={renderGridView}
        />
      </div>

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
              <p className="text-sm" data-testid="text-delete-supplier-name">
                <span className="font-medium">Supplier:</span> {supplierToDelete.name}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} data-testid="button-cancel-delete">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={bulkActionLoading === "delete"} data-testid="button-confirm-delete">
              {bulkActionLoading === "delete" ? <Loader size="sm" className="mr-2" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle>{editingSupplier ? "Edit Supplier" : "Create Supplier"}</DialogTitle>
            <DialogDescription>
              {editingSupplier ? "Update supplier information and details." : "Create a new supplier with all relevant information."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="supplier-name">Name *</Label>
              <Input
                id="supplier-name"
                value={formData.name}
                onChange={(e) => { setFormData({ ...formData, name: e.target.value }); if (formErrors.name) setFormErrors({ ...formErrors, name: "" }) }}
                placeholder="Enter supplier name"
                className={formErrors.name ? "border-destructive" : ""}
                data-testid="input-supplier-name"
              />
              {formErrors.name && <p className="text-xs text-destructive">{formErrors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplier-country">Country *</Label>
                <Input
                  id="supplier-country"
                  value={formData.country}
                  onChange={(e) => { setFormData({ ...formData, country: e.target.value }); if (formErrors.country) setFormErrors({ ...formErrors, country: "" }) }}
                  placeholder="Enter country"
                  className={formErrors.country ? "border-destructive" : ""}
                  data-testid="input-supplier-country"
                />
                {formErrors.country && <p className="text-xs text-destructive">{formErrors.country}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier-category">Category *</Label>
                <Input
                  id="supplier-category"
                  value={formData.category}
                  onChange={(e) => { setFormData({ ...formData, category: e.target.value }); if (formErrors.category) setFormErrors({ ...formErrors, category: "" }) }}
                  placeholder="Enter category"
                  className={formErrors.category ? "border-destructive" : ""}
                  data-testid="input-supplier-category"
                />
                {formErrors.category && <p className="text-xs text-destructive">{formErrors.category}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier-description">Description *</Label>
              <textarea
                id="supplier-description"
                value={formData.description}
                onChange={(e) => { setFormData({ ...formData, description: e.target.value }); if (formErrors.description) setFormErrors({ ...formErrors, description: "" }) }}
                placeholder="Enter supplier description"
                className={`w-full px-3 py-2 border rounded-md min-h-[100px] bg-background text-foreground ${formErrors.description ? "border-destructive" : ""}`}
                data-testid="input-supplier-description"
              />
              {formErrors.description && <p className="text-xs text-destructive">{formErrors.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplier-rating">Rating</Label>
                <Input id="supplier-rating" type="number" min="0" max="5" step="0.1" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })} data-testid="input-supplier-rating" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier-reviews">Reviews</Label>
                <Input id="supplier-reviews" type="number" min="0" value={formData.reviews} onChange={(e) => setFormData({ ...formData, reviews: parseInt(e.target.value) || 0 })} data-testid="input-supplier-reviews" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplier-min-order">Min Order ($)</Label>
                <Input id="supplier-min-order" type="number" min="0" value={formData.minOrder} onChange={(e) => setFormData({ ...formData, minOrder: parseInt(e.target.value) || 0 })} data-testid="input-supplier-min-order" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier-lead-time">Lead Time</Label>
                <Input id="supplier-lead-time" value={formData.leadTime} onChange={(e) => setFormData({ ...formData, leadTime: e.target.value })} placeholder="e.g., 7-14 days" data-testid="input-supplier-lead-time" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier-email">Contact Email</Label>
              <Input
                id="supplier-email"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => { setFormData({ ...formData, contactEmail: e.target.value }); if (formErrors.contactEmail) setFormErrors({ ...formErrors, contactEmail: "" }) }}
                placeholder="contact@supplier.com"
                className={formErrors.contactEmail ? "border-destructive" : ""}
                data-testid="input-supplier-email"
              />
              {formErrors.contactEmail && <p className="text-xs text-destructive">{formErrors.contactEmail}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier-website">Website</Label>
              <Input
                id="supplier-website"
                type="url"
                value={formData.website}
                onChange={(e) => { setFormData({ ...formData, website: e.target.value }); if (formErrors.website) setFormErrors({ ...formErrors, website: "" }) }}
                placeholder="https://supplier.com"
                className={formErrors.website ? "border-destructive" : ""}
                data-testid="input-supplier-website"
              />
              {formErrors.website && <p className="text-xs text-destructive">{formErrors.website}</p>}
            </div>

            <div className="space-y-2">
              <Label>Specialties</Label>
              <div className="flex gap-2">
                <Input
                  value={specialtyInput}
                  onChange={(e) => setSpecialtyInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddSpecialty() } }}
                  placeholder="Add specialty"
                  data-testid="input-supplier-specialty"
                />
                <Button variant="outline" onClick={handleAddSpecialty} data-testid="button-add-specialty">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.specialties.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.specialties.map((s, i) => (
                    <Badge key={i} variant="secondary" className="gap-1">
                      {s}
                      <button onClick={() => handleRemoveSpecialty(s)} className="ml-1 rounded-full">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="supplier-verified"
                checked={formData.verified}
                onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
                data-testid="input-supplier-verified"
              />
              <Label htmlFor="supplier-verified">Mark as verified</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)} data-testid="button-cancel-form">Cancel</Button>
            <Button onClick={handleFormSubmit} disabled={formLoading} data-testid="button-submit-form">
              {formLoading && <Loader size="sm" className="mr-2" />}
              {editingSupplier ? "Save Changes" : "Create Supplier"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
