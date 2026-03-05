import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "@/hooks/use-router"
import { Button } from "@/components/ui/button"
import { Plus, Folder, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Category } from "@/types/categories"
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

interface CategoryRow {
  id: string
  name: string
  slug: string
  image: string | null
  product_count: number
  trending: boolean
  created_at: string
}

export default function AdminCategoriesPage() {
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiFetch("/api/admin/categories?include_subcategories=true")
      if (!response.ok) throw new Error("Failed to fetch categories")
      const data = await response.json()
      const rows: CategoryRow[] = (data.categories || []).map((c: Category) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        image: c.image,
        product_count: c.product_count || 0,
        trending: c.trending || false,
        created_at: c.created_at,
      }))
      setCategories(rows)
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to load categories")
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => { fetchCategories() }, [fetchCategories])

  const handleDelete = useCallback(async (cat: CategoryRow) => {
    try {
      const response = await apiFetch(`/api/admin/categories/${cat.id}`, { method: "DELETE" })
      if (!response.ok) {
        const d = await response.json()
        throw new Error(d.error || "Failed to delete")
      }
      showSuccess(`Category "${cat.name}" deleted`)
      fetchCategories()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to delete category")
    }
  }, [fetchCategories, showSuccess, showError])

  const totalProducts = categories.reduce((sum, c) => sum + c.product_count, 0)
  const trendingCount = categories.filter(c => c.trending).length

  const columns: Column<CategoryRow>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (cat) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md overflow-hidden bg-muted shrink-0 flex items-center justify-center">
            {cat.image ? (
              <img src={cat.image} alt={cat.name} className="object-cover w-full h-full" />
            ) : (
              <Folder className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <span className="text-sm font-medium" data-testid={`text-name-${cat.id}`}>{cat.name}</span>
        </div>
      ),
    },
    { key: "slug", header: "Slug", sortable: true },
    {
      key: "product_count",
      header: "Products",
      sortable: true,
      render: (cat) => <span className="text-sm" data-testid={`text-products-${cat.id}`}>{cat.product_count}</span>,
    },
    {
      key: "trending",
      header: "Trending",
      render: (cat) => (
        <StatusBadge status={cat.trending ? "Trending" : "No"} data-testid={`badge-trending-${cat.id}`} />
      ),
    },
  ]

  const rowActions: RowAction<CategoryRow>[] = [
    { label: "View Details", onClick: (cat) => router.push(`/admin/categories/${cat.id}`) },
    { label: "Edit", onClick: (cat) => router.push(`/admin/categories/${cat.id}`) },
    { label: "Delete", onClick: handleDelete, variant: "destructive", separator: true },
  ]

  return (
    <PageShell>
      <PageHeader
        title="Categories"
        subtitle="Manage product categories"
        actions={
          <Button size="sm" data-testid="button-add-category">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Category
          </Button>
        }
      />

      <StatGrid>
        <StatCard label="Total Categories" value={categories.length} icon={Folder} />
        <StatCard label="Total Products" value={totalProducts} icon={Folder} />
        <StatCard label="Trending" value={trendingCount} icon={TrendingUp} trend={`${categories.length > 0 ? Math.round((trendingCount / categories.length) * 100) : 0}%`} />
      </StatGrid>

      {!loading && categories.length === 0 ? (
        <EmptyState
          title="No categories found"
          description="Create your first product category to get started."
          actionLabel="Add Category"
          onAction={() => {}}
        />
      ) : (
        <DataTable
          data={categories}
          columns={columns}
          rowActions={rowActions}
          searchPlaceholder="Search categories..."
          onRowClick={(cat) => router.push(`/admin/categories/${cat.id}`)}
          isLoading={loading}
          emptyTitle="No categories found"
          emptyDescription="Try adjusting your search."
        />
      )}
    </PageShell>
  )
}
