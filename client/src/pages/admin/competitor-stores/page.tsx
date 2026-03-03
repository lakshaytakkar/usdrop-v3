import { apiFetch } from '@/lib/supabase'
import { useState, useMemo, useEffect, useCallback } from "react"
import { useRouter } from "@/hooks/use-router"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Plus, Trash2, MoreHorizontal, Eye, Store, Edit, Download,
  Search, Globe, ExternalLink, TrendingUp, DollarSign,
  Package, CheckCircle2, X, ArrowUpDown, ArrowUp, ArrowDown, RefreshCw,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useHasPermission } from "@/hooks/use-has-permission"
import { Loader } from "@/components/ui/loader"
import { CompetitorStore as CompetitorStoreType } from "@/types/competitor-stores"
import { Category } from "@/types/categories"
import { AdminStatCards } from "@/components/admin"

interface CompetitorStore {
  id: string
  name: string
  url: string
  logo?: string
  category: string
  country?: string
  monthly_traffic: number
  monthly_revenue: number | null
  growth: number
  products_count?: number
  rating?: number
  verified: boolean
  created_at: string
  updated_at: string
}

type SortField = "name" | "monthly_traffic" | "monthly_revenue" | "growth" | "products_count"
type SortOrder = "asc" | "desc"

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
  const { showSuccess, showError } = useToast()

  const { hasPermission: canEdit } = useHasPermission("competitor_stores.edit")
  const { hasPermission: canCreate } = useHasPermission("competitor_stores.create")
  const { hasPermission: canDelete } = useHasPermission("competitor_stores.delete")
  const { hasPermission: canVerify } = useHasPermission("competitor_stores.verify")

  const [stores, setStores] = useState<CompetitorStore[]>([])
  const [availableCategories, setAvailableCategories] = useState<Category[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [storeToDelete, setStoreToDelete] = useState<CompetitorStore | null>(null)
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editingStore, setEditingStore] = useState<CompetitorStore | null>(null)
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

  const fetchCategories = useCallback(async () => {
    try {
      const response = await apiFetch("/api/admin/categories", { credentials: 'include' })
      if (!response.ok) throw new Error("Failed to fetch categories")
      const data = await response.json()
      setAvailableCategories(data.categories || [])
    } catch (err) {
      console.error("Error fetching categories:", err)
    }
  }, [])

  const fetchStores = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiFetch("/api/admin/competitor-stores?pageSize=1000", {
        credentials: 'include'
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch stores")
      }
      const data = await response.json()
      const transformedStores: CompetitorStore[] = (data.stores || []).map((store: CompetitorStoreType) => ({
        id: store.id,
        name: store.name,
        url: store.url,
        logo: store.logo || undefined,
        category: store.category?.name || "Uncategorized",
        country: store.country || undefined,
        monthly_traffic: store.monthly_traffic,
        monthly_revenue: store.monthly_revenue,
        growth: store.growth,
        products_count: store.products_count || undefined,
        rating: store.rating || undefined,
        verified: store.verified,
        created_at: store.created_at,
        updated_at: store.updated_at,
      }))
      setStores(transformedStores)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load stores"
      showError(msg)
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => { fetchCategories() }, [fetchCategories])
  useEffect(() => { fetchStores() }, [fetchStores])
  useEffect(() => { setSelectedIds(new Set()) }, [searchQuery, categoryFilter, statusFilter])

  const filteredStores = useMemo(() => {
    let result = stores

    if (statusFilter === "verified") result = result.filter(s => s.verified)
    else if (statusFilter === "unverified") result = result.filter(s => !s.verified)
    else if (statusFilter === "high_traffic") result = result.filter(s => s.monthly_traffic >= 100000)
    else if (statusFilter === "high_revenue") result = result.filter(s => s.monthly_revenue !== null && s.monthly_revenue >= 400000)

    if (categoryFilter && categoryFilter !== "all") {
      result = result.filter(s => s.category === categoryFilter)
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.url.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        (s.country && s.country.toLowerCase().includes(q))
      )
    }

    result.sort((a, b) => {
      let aVal: any, bVal: any
      switch (sortField) {
        case "name": aVal = a.name.toLowerCase(); bVal = b.name.toLowerCase(); break
        case "monthly_traffic": aVal = a.monthly_traffic; bVal = b.monthly_traffic; break
        case "monthly_revenue": aVal = a.monthly_revenue || 0; bVal = b.monthly_revenue || 0; break
        case "growth": aVal = a.growth; bVal = b.growth; break
        case "products_count": aVal = a.products_count || 0; bVal = b.products_count || 0; break
        default: return 0
      }
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return result
  }, [stores, searchQuery, statusFilter, categoryFilter, sortField, sortOrder])

  const verifiedCount = stores.filter(s => s.verified).length
  const avgTraffic = stores.length > 0 ? stores.reduce((sum, s) => sum + s.monthly_traffic, 0) / stores.length : 0
  const totalRevenue = stores.reduce((sum, s) => sum + (s.monthly_revenue || 0), 0)

  const statCards = [
    { label: "Total Stores", value: stores.length, icon: Store, description: "All competitor stores tracked" },
    { label: "Verified", value: verifiedCount, icon: CheckCircle2, badge: `${stores.length > 0 ? ((verifiedCount / stores.length) * 100).toFixed(0) : 0}%`, badgeVariant: "success" as const, description: "Verified stores" },
    { label: "Avg Traffic", value: numberFormatter.format(avgTraffic), icon: TrendingUp, description: "Average monthly traffic" },
    { label: "Total Revenue", value: currencyFormatter.format(totalRevenue), icon: DollarSign, description: "Combined monthly revenue" },
  ]

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3.5 w-3.5 ml-1 opacity-40" />
    return sortOrder === "asc" ? <ArrowUp className="h-3.5 w-3.5 ml-1" /> : <ArrowDown className="h-3.5 w-3.5 ml-1" />
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredStores.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredStores.map(s => s.id)))
    }
  }

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  const handleDelete = (store: CompetitorStore) => {
    if (!canDelete) { showError("You don't have permission to delete stores"); return }
    setStoreToDelete(store)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!storeToDelete) return
    try {
      const response = await apiFetch(`/api/admin/competitor-stores/${storeToDelete.id}`, {
        method: "DELETE", credentials: 'include'
      })
      if (!response.ok) throw new Error("Failed to delete store")
      showSuccess(`"${storeToDelete.name}" deleted`)
      setDeleteConfirmOpen(false)
      setStoreToDelete(null)
      fetchStores()
    } catch { showError("Failed to delete store") }
  }

  const handleBulkDelete = async () => {
    if (!canDelete) { showError("You don't have permission to delete stores"); return }
    try {
      const promises = Array.from(selectedIds).map(id =>
        apiFetch(`/api/admin/competitor-stores/${id}`, { method: "DELETE", credentials: 'include' })
      )
      await Promise.allSettled(promises)
      showSuccess(`${selectedIds.size} store(s) deleted`)
      setSelectedIds(new Set())
      setBulkDeleteConfirmOpen(false)
      fetchStores()
    } catch { showError("Failed to delete stores") }
  }

  const handleToggleVerify = async (store: CompetitorStore) => {
    if (!canVerify) { showError("You don't have permission to verify stores"); return }
    try {
      const response = await apiFetch(`/api/admin/competitor-stores/${store.id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ verified: !store.verified })
      })
      if (!response.ok) throw new Error("Failed to update verification")
      showSuccess(`Store ${!store.verified ? "verified" : "unverified"} successfully`)
      fetchStores()
    } catch (err: any) { showError(err.message || "Failed to update store") }
  }

  const handleBulkVerify = async (verify: boolean) => {
    if (!canVerify) { showError("You don't have permission"); return }
    try {
      const promises = Array.from(selectedIds).map(id =>
        apiFetch(`/api/admin/competitor-stores/${id}/verify`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
          body: JSON.stringify({ verified: verify })
        })
      )
      await Promise.allSettled(promises)
      showSuccess(`${selectedIds.size} store(s) ${verify ? "verified" : "unverified"}`)
      setSelectedIds(new Set())
      fetchStores()
    } catch { showError("Failed to update stores") }
  }

  const handleCreate = () => {
    if (!canCreate) { showError("You don't have permission to create stores"); return }
    setEditingStore(null)
    setFormData({ name: "", url: "", category: "", country: "", monthly_traffic: 0, monthly_revenue: null, growth: 0, products_count: undefined, rating: undefined, verified: false, logo: "" })
    setFormErrors({})
    setFormOpen(true)
  }

  const handleEdit = (store: CompetitorStore) => {
    if (!canEdit) { showError("You don't have permission to edit stores"); return }
    setEditingStore(store)
    setFormData({
      name: store.name, url: store.url, category: store.category,
      country: store.country || "", monthly_traffic: store.monthly_traffic,
      monthly_revenue: store.monthly_revenue, growth: store.growth,
      products_count: store.products_count, rating: store.rating,
      verified: store.verified, logo: store.logo || "",
    })
    setFormErrors({})
    setFormOpen(true)
  }

  const handleFormSubmit = async () => {
    const errors: Record<string, string> = {}
    if (!formData.name.trim()) errors.name = "Name is required"
    if (!formData.url.trim()) errors.url = "URL is required"
    if (!formData.category.trim()) errors.category = "Category is required"
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return }

    setFormLoading(true)
    try {
      const category = availableCategories.find(c => c.name === formData.category)
      const payload = {
        name: formData.name.trim(), url: formData.url.trim(), logo: formData.logo || null,
        category_id: category?.id || null, country: formData.country || null,
        monthly_traffic: formData.monthly_traffic, monthly_revenue: formData.monthly_revenue,
        growth: formData.growth, products_count: formData.products_count || null,
        rating: formData.rating || null, verified: formData.verified,
      }
      const url = editingStore ? `/api/admin/competitor-stores/${editingStore.id}` : `/api/admin/competitor-stores`
      const response = await apiFetch(url, {
        method: editingStore ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(payload)
      })
      if (!response.ok) { const d = await response.json(); throw new Error(d.error || "Failed to save") }
      setFormOpen(false)
      showSuccess(editingStore ? `"${formData.name}" updated` : `"${formData.name}" created`)
      fetchStores()
    } catch (err: any) { showError(err.message || "Failed to save store") }
    finally { setFormLoading(false) }
  }

  const handleExport = () => {
    const exportStores = selectedIds.size > 0 ? filteredStores.filter(s => selectedIds.has(s.id)) : filteredStores
    const headers = ["Name", "URL", "Category", "Country", "Traffic", "Revenue", "Growth", "Products", "Verified"]
    const rows = exportStores.map(s => [
      s.name, s.url, s.category, s.country || "", s.monthly_traffic.toString(),
      s.monthly_revenue?.toString() || "", s.growth.toFixed(1),
      s.products_count?.toString() || "", s.verified ? "Yes" : "No",
    ])
    const csv = [headers.map(h => `"${h}"`).join(","), ...rows.map(r => r.map(c => `"${c}"`).join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = `competitor-stores-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    showSuccess(`Exported ${exportStores.length} store(s)`)
  }

  const categories = useMemo(() => {
    if (availableCategories.length > 0) return availableCategories.map(c => c.name)
    return Array.from(new Set(stores.map(s => s.category)))
  }, [stores, availableCategories])

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden" data-testid="admin-competitor-stores-page">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="text-xl font-semibold leading-[1.35] tracking-tight text-foreground" data-testid="page-title">Competitor Stores</h1>
          <p className="text-sm text-muted-foreground mt-1" data-testid="page-description">Monitor and manage competitor stores</p>
        </div>
      </div>

      <div className="mb-4">
        <AdminStatCards stats={statCards} loading={loading} />
      </div>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-8 text-sm"
            data-testid="search-input"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[140px] text-sm" data-testid="filter-status">
            <SelectValue placeholder="All Stores" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stores</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="unverified">Unverified</SelectItem>
            <SelectItem value="high_traffic">High Traffic</SelectItem>
            <SelectItem value="high_revenue">High Revenue</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="h-9 w-[160px] text-sm" data-testid="filter-category">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedIds.size > 0 && (
          <>
            <Button variant="outline" size="sm" className="h-9" onClick={() => handleBulkVerify(true)} disabled={!canVerify} data-testid="bulk-verify">
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              Verify ({selectedIds.size})
            </Button>
            <Button variant="outline" size="sm" className="h-9" onClick={() => handleBulkVerify(false)} disabled={!canVerify} data-testid="bulk-unverify">
              <X className="h-4 w-4 mr-1.5" />
              Unverify ({selectedIds.size})
            </Button>
            <Button variant="outline" size="sm" className="h-9" onClick={handleExport} data-testid="bulk-export">
              <Download className="h-4 w-4 mr-1.5" />
              Export ({selectedIds.size})
            </Button>
            <Button variant="destructive" size="sm" className="h-9" onClick={() => setBulkDeleteConfirmOpen(true)} disabled={!canDelete} data-testid="bulk-delete">
              <Trash2 className="h-4 w-4 mr-1.5" />
              Delete ({selectedIds.size})
            </Button>
          </>
        )}

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9" onClick={handleExport} data-testid="action-export">
            <Download className="h-4 w-4 mr-1.5" />
            Export
          </Button>
          <Button size="sm" className="h-9" disabled={!canCreate} onClick={handleCreate} data-testid="action-add-store">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Store
          </Button>
        </div>
      </div>

      <Card className="flex-1 overflow-hidden border rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="w-10 px-3 py-2.5">
                  <Checkbox
                    checked={filteredStores.length > 0 && selectedIds.size === filteredStores.length}
                    onCheckedChange={toggleSelectAll}
                    data-testid="select-all"
                  />
                </th>
                <th className="px-3 py-2.5 text-left">
                  <button className="flex items-center font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => handleSort("name")}>
                    Store Name
                    <SortIcon field="name" />
                  </button>
                </th>
                <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">URL</th>
                <th className="px-3 py-2.5 text-right">
                  <button className="flex items-center ml-auto font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => handleSort("monthly_revenue")}>
                    Revenue
                    <SortIcon field="monthly_revenue" />
                  </button>
                </th>
                <th className="px-3 py-2.5 text-right">
                  <button className="flex items-center ml-auto font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => handleSort("monthly_traffic")}>
                    Traffic
                    <SortIcon field="monthly_traffic" />
                  </button>
                </th>
                <th className="px-3 py-2.5 text-right">
                  <button className="flex items-center ml-auto font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => handleSort("products_count")}>
                    Products
                    <SortIcon field="products_count" />
                  </button>
                </th>
                <th className="px-3 py-2.5 text-center font-medium text-muted-foreground">Verified</th>
                <th className="w-12 px-3 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader size="sm" />
                      <span>Loading stores...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStores.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Store className="h-10 w-10 opacity-40" />
                      <p className="text-sm font-medium">No stores found</p>
                      <p className="text-xs">Try adjusting your search or filters, or add a new store.</p>
                      <Button size="sm" className="mt-2" disabled={!canCreate} onClick={handleCreate} data-testid="empty-add-store">
                        <Plus className="h-4 w-4 mr-1.5" />
                        Add Store
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStores.map(store => (
                  <tr key={store.id} className="border-b hover:bg-muted/30 transition-colors group" data-testid={`row-store-${store.id}`}>
                    <td className="px-3 py-2.5">
                      <Checkbox
                        checked={selectedIds.has(store.id)}
                        onCheckedChange={() => toggleSelect(store.id)}
                        data-testid={`select-store-${store.id}`}
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-md overflow-hidden bg-muted border flex-shrink-0 flex items-center justify-center">
                          {store.logo ? (
                            <img src={store.logo} alt={store.name} className="object-cover w-full h-full" />
                          ) : (
                            <Store className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <button
                            className="font-medium truncate max-w-[240px] text-left hover:text-primary hover:underline transition-colors cursor-pointer block"
                            onClick={() => router.push(`/admin/competitor-stores/${store.id}`)}
                            data-testid={`link-store-${store.id}`}
                          >
                            {store.name}
                          </button>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">{store.category}</Badge>
                            {store.country && <span className="text-[10px] text-muted-foreground">{store.country}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <a
                        href={store.url.startsWith("http") ? store.url : `https://${store.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground hover:underline flex items-center gap-1 max-w-[200px] truncate"
                        data-testid={`link-url-${store.id}`}
                      >
                        {store.url}
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </a>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums" data-testid={`text-revenue-${store.id}`}>
                      {store.monthly_revenue ? (
                        <span className="text-emerald-600 font-medium">{currencyFormatter.format(store.monthly_revenue)}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums" data-testid={`text-traffic-${store.id}`}>
                      {numberFormatter.format(store.monthly_traffic)}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums" data-testid={`text-products-${store.id}`}>
                      {store.products_count !== undefined ? numberFormatter.format(store.products_count) : "—"}
                    </td>
                    <td className="px-3 py-2.5 text-center" data-testid={`status-verified-${store.id}`}>
                      {store.verified ? (
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-muted-foreground">Unverified</Badge>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity" data-testid={`actions-store-${store.id}`}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem onClick={() => router.push(`/admin/competitor-stores/${store.id}`)} className="cursor-pointer" data-testid={`action-view-${store.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/admin/products?store=${store.id}`)} className="cursor-pointer" data-testid={`action-products-${store.id}`}>
                            <Package className="h-4 w-4 mr-2" />
                            View Products
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { const u = store.url.startsWith("http") ? store.url : `https://${store.url}`; window.open(u, "_blank", "noopener,noreferrer") }} className="cursor-pointer" data-testid={`action-visit-${store.id}`}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Visit Store
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {canEdit && (
                            <DropdownMenuItem onClick={() => handleEdit(store)} className="cursor-pointer" data-testid={`action-edit-${store.id}`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          {canVerify && (
                            <DropdownMenuItem onClick={() => handleToggleVerify(store)} className="cursor-pointer" data-testid={`action-verify-${store.id}`}>
                              {store.verified ? (
                                <><X className="h-4 w-4 mr-2" />Unverify</>
                              ) : (
                                <><CheckCircle2 className="h-4 w-4 mr-2" />Verify</>
                              )}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {canDelete && (
                            <DropdownMenuItem onClick={() => handleDelete(store)} className="text-destructive cursor-pointer" data-testid={`action-delete-${store.id}`}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
        <span>{filteredStores.length} store(s) {selectedIds.size > 0 && `· ${selectedIds.size} selected`}</span>
      </div>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Store</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{storeToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} data-testid="confirm-delete">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={bulkDeleteConfirmOpen} onOpenChange={setBulkDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {selectedIds.size} Store(s)</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedIds.size} store(s)? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleBulkDelete} data-testid="confirm-bulk-delete">Delete All</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingStore ? "Edit Store" : "Add Store"}</DialogTitle>
            <DialogDescription>
              {editingStore ? "Update competitor store details." : "Add a new competitor store to track."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="store-name">Name *</Label>
              <Input id="store-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Store name" data-testid="input-store-name" />
              {formErrors.name && <p className="text-xs text-destructive">{formErrors.name}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="store-url">URL *</Label>
              <Input id="store-url" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} placeholder="example.com" data-testid="input-store-url" />
              {formErrors.url && <p className="text-xs text-destructive">{formErrors.url}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="store-category">Category *</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger data-testid="select-store-category"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.category && <p className="text-xs text-destructive">{formErrors.category}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="store-country">Country</Label>
                <Input id="store-country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} placeholder="US" data-testid="input-store-country" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="store-traffic">Traffic</Label>
                <Input id="store-traffic" type="number" value={formData.monthly_traffic} onChange={(e) => setFormData({ ...formData, monthly_traffic: Number(e.target.value) })} data-testid="input-store-traffic" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="store-revenue">Revenue</Label>
                <Input id="store-revenue" type="number" value={formData.monthly_revenue ?? ""} onChange={(e) => setFormData({ ...formData, monthly_revenue: e.target.value ? Number(e.target.value) : null })} data-testid="input-store-revenue" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="store-growth">Growth %</Label>
                <Input id="store-growth" type="number" step="0.1" value={formData.growth} onChange={(e) => setFormData({ ...formData, growth: Number(e.target.value) })} data-testid="input-store-growth" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="store-logo">Logo URL</Label>
              <Input id="store-logo" value={formData.logo} onChange={(e) => setFormData({ ...formData, logo: e.target.value })} placeholder="https://..." data-testid="input-store-logo" />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="store-verified"
                checked={formData.verified}
                onCheckedChange={(checked) => setFormData({ ...formData, verified: !!checked })}
                data-testid="input-store-verified"
              />
              <Label htmlFor="store-verified" className="text-sm">Verified store</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)} disabled={formLoading}>Cancel</Button>
            <Button onClick={handleFormSubmit} disabled={formLoading} data-testid="button-submit-store">
              {formLoading ? <><Loader size="sm" className="mr-2" />Saving...</> : editingStore ? "Save Changes" : "Add Store"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
