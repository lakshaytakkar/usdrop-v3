import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "@/hooks/use-router"
import { Button } from "@/components/ui/button"
import { Plus, Building, CheckCircle2, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  PageShell,
  PageHeader,
  StatCard,
  StatGrid,
  DataTable,
  StatusBadge,
  EmptyState,
  FormDialog,
  type Column,
  type RowAction,
} from "@/components/admin-shared"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SupplierRow {
  id: string
  name: string
  country: string
  category: string
  rating: number
  reviews: number
  verified: boolean
  leadTime: string
  minOrder: number
  description: string
  contactEmail?: string
  website?: string
  logo?: string
  specialties?: string[]
}

export default function AdminSuppliersPage() {
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  const [suppliers, setSuppliers] = useState<SupplierRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({ name: "", country: "", website: "", description: "" })

  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiFetch("/api/admin/suppliers")
      if (!response.ok) throw new Error("Failed to fetch suppliers")
      const data = await response.json()
      setSuppliers(data.suppliers || [])
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to load suppliers")
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => { fetchSuppliers() }, [fetchSuppliers])

  const handleDelete = useCallback(async (supplier: SupplierRow) => {
    try {
      const res = await apiFetch(`/api/admin/suppliers/${supplier.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      showSuccess(`Supplier "${supplier.name}" deleted`)
      fetchSuppliers()
    } catch {
      showError("Failed to delete supplier")
    }
  }, [fetchSuppliers, showSuccess, showError])

  const handleCreateSupplier = useCallback(async () => {
    try {
      setIsSubmitting(true)
      const res = await apiFetch("/api/admin/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error("Failed to create supplier")
      showSuccess("Supplier created successfully")
      setShowAddDialog(false)
      setFormData({ name: "", country: "", website: "", description: "" })
      fetchSuppliers()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to create supplier")
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, fetchSuppliers, showSuccess, showError])

  const verifiedCount = suppliers.filter(s => s.verified).length
  const avgRating = suppliers.length > 0
    ? (suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length).toFixed(1)
    : "0"

  const columns: Column<SupplierRow>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (s) => (
        <div className="flex items-center gap-3">
          {s.logo ? (
            <img src={s.logo} alt={s.name} className="w-8 h-8 rounded-md object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
              <Building className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          <span className="text-sm font-medium" data-testid={`text-name-${s.id}`}>{s.name}</span>
        </div>
      ),
    },
    { key: "country", header: "Country", sortable: true },
    {
      key: "rating",
      header: "Rating",
      sortable: true,
      render: (s) => (
        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-sm" data-testid={`text-rating-${s.id}`}>{s.rating.toFixed(1)}</span>
        </div>
      ),
    },
    {
      key: "verified",
      header: "Verified",
      render: (s) => <StatusBadge status={s.verified ? "Verified" : "Unverified"} />,
    },
    { key: "leadTime", header: "Shipping Time" },
  ]

  const rowActions: RowAction<SupplierRow>[] = [
    { label: "View Details", onClick: (s) => router.push(`/admin/suppliers/${s.id}`) },
    { label: "Edit", onClick: (s) => router.push(`/admin/suppliers/${s.id}`) },
    { label: "Delete", onClick: handleDelete, variant: "destructive", separator: true },
  ]

  return (
    <PageShell>
      <PageHeader
        title="Suppliers"
        subtitle="Manage product suppliers and verification status"
        actions={
          <Button size="sm" data-testid="button-add-supplier" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add Supplier
          </Button>
        }
      />

      <StatGrid>
        <StatCard label="Total Suppliers" value={suppliers.length} icon={Building} />
        <StatCard label="Verified" value={verifiedCount} icon={CheckCircle2} trend={`${suppliers.length > 0 ? Math.round((verifiedCount / suppliers.length) * 100) : 0}%`} />
        <StatCard label="Avg Rating" value={avgRating} icon={Star} />
      </StatGrid>

      {!loading && suppliers.length === 0 ? (
        <EmptyState
          title="No suppliers found"
          description="Add your first supplier to get started."
          actionLabel="Add Supplier"
          onAction={() => setShowAddDialog(true)}
        />
      ) : (
        <DataTable
          data={suppliers}
          columns={columns}
          rowActions={rowActions}
          searchPlaceholder="Search suppliers..."
          onRowClick={(s) => router.push(`/admin/suppliers/${s.id}`)}
          isLoading={loading}
          emptyTitle="No suppliers found"
          emptyDescription="Try adjusting your search."
        />
      )}

      <FormDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        title="Add Supplier"
        onSubmit={handleCreateSupplier}
        submitLabel="Create Supplier"
        isSubmitting={isSubmitting}
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="supplier-name">Name</Label>
          <Input
            id="supplier-name"
            data-testid="input-supplier-name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Supplier name"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="supplier-country">Country</Label>
          <Input
            id="supplier-country"
            data-testid="input-supplier-country"
            value={formData.country}
            onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
            placeholder="Country"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="supplier-website">Website</Label>
          <Input
            id="supplier-website"
            data-testid="input-supplier-website"
            value={formData.website}
            onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
            placeholder="https://example.com"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="supplier-description">Description</Label>
          <Input
            id="supplier-description"
            data-testid="input-supplier-description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Brief description"
          />
        </div>
      </FormDialog>
    </PageShell>
  )
}
