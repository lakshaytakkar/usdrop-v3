import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "@/hooks/use-router"
import { Button } from "@/components/ui/button"
import { Plus, Store, CheckCircle2, TrendingUp, DollarSign, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { CompetitorStore as CompetitorStoreType } from "@/types/competitor-stores"
import {
  PageShell,
  PageHeader,
  StatCard,
  StatGrid,
  DataTable,
  StatusBadge,
  EmptyState,
  type Column,
  type RowAction,
} from "@/components/admin-shared"

interface StoreRow {
  id: string
  name: string
  url: string
  logo?: string
  category: string
  country?: string
  monthly_traffic: number
  monthly_revenue: number | null
  growth: number
  verified: boolean
  created_at: string
}

const numberFormatter = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 })
const currencyFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 })

export default function AdminCompetitorStoresPage() {
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  const [stores, setStores] = useState<StoreRow[]>([])
  const [loading, setLoading] = useState(true)

  const fetchStores = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiFetch("/api/admin/competitor-stores?pageSize=1000", { credentials: 'include' })
      if (!response.ok) throw new Error("Failed to fetch stores")
      const data = await response.json()
      const rows: StoreRow[] = (data.stores || []).map((s: CompetitorStoreType) => ({
        id: s.id,
        name: s.name,
        url: s.url,
        logo: s.logo || undefined,
        category: s.category?.name || "Uncategorized",
        country: s.country || undefined,
        monthly_traffic: s.monthly_traffic,
        monthly_revenue: s.monthly_revenue,
        growth: s.growth,
        verified: s.verified,
        created_at: s.created_at,
      }))
      setStores(rows)
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to load stores")
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => { fetchStores() }, [fetchStores])

  const handleDelete = useCallback(async (store: StoreRow) => {
    try {
      const response = await apiFetch(`/api/admin/competitor-stores/${store.id}`, { method: "DELETE", credentials: 'include' })
      if (!response.ok) throw new Error("Failed to delete store")
      showSuccess(`"${store.name}" deleted`)
      fetchStores()
    } catch { showError("Failed to delete store") }
  }, [fetchStores, showSuccess, showError])

  const verifiedCount = stores.filter(s => s.verified).length
  const avgTraffic = stores.length > 0 ? stores.reduce((sum, s) => sum + s.monthly_traffic, 0) / stores.length : 0
  const totalRevenue = stores.reduce((sum, s) => sum + (s.monthly_revenue || 0), 0)

  const columns: Column<StoreRow>[] = [
    {
      key: "name",
      header: "Store Name",
      sortable: true,
      render: (s) => (
        <div className="flex items-center gap-3">
          {s.logo ? (
            <img src={s.logo} alt={s.name} className="w-8 h-8 rounded-md object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
              <Store className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          <span className="text-sm font-medium" data-testid={`text-name-${s.id}`}>{s.name}</span>
        </div>
      ),
    },
    {
      key: "url",
      header: "URL",
      render: (s) => (
        <a href={s.url.startsWith("http") ? s.url : `https://${s.url}`} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:underline flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {s.url.replace(/^https?:\/\//, "").slice(0, 30)}
          <ExternalLink className="h-3 w-3" />
        </a>
      ),
    },
    { key: "category", header: "Category", sortable: true },
    {
      key: "verified",
      header: "Verified",
      render: (s) => <StatusBadge status={s.verified ? "Verified" : "Unverified"} />,
    },
  ]

  const rowActions: RowAction<StoreRow>[] = [
    { label: "View Details", onClick: (s) => router.push(`/admin/competitor-stores/${s.id}`) },
    { label: "Edit", onClick: (s) => router.push(`/admin/competitor-stores/${s.id}`) },
    { label: "Delete", onClick: handleDelete, variant: "destructive", separator: true },
  ]

  return (
    <PageShell>
      <PageHeader
        title="Competitor Stores"
        subtitle="Monitor and manage competitor stores"
        actions={
          <Button size="sm" data-testid="button-add-store">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Store
          </Button>
        }
      />

      <StatGrid>
        <StatCard label="Total Stores" value={stores.length} icon={Store} />
        <StatCard label="Verified" value={verifiedCount} icon={CheckCircle2} trend={`${stores.length > 0 ? Math.round((verifiedCount / stores.length) * 100) : 0}%`} />
        <StatCard label="Avg Traffic" value={numberFormatter.format(avgTraffic)} icon={TrendingUp} />
        <StatCard label="Total Revenue" value={currencyFormatter.format(totalRevenue)} icon={DollarSign} />
      </StatGrid>

      {!loading && stores.length === 0 ? (
        <EmptyState
          title="No stores found"
          description="Add your first competitor store to start tracking."
          actionLabel="Add Store"
          onAction={() => {}}
        />
      ) : (
        <DataTable
          data={stores}
          columns={columns}
          rowActions={rowActions}
          searchPlaceholder="Search stores..."
          onRowClick={(s) => router.push(`/admin/competitor-stores/${s.id}`)}
          isLoading={loading}
          emptyTitle="No stores found"
          emptyDescription="Try adjusting your search."
        />
      )}
    </PageShell>
  )
}
