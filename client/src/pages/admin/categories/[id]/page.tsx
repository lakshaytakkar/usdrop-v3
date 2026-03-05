import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "@/hooks/use-router"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Trash2, TrendingUp, Folder, Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Category } from "@/types/categories"
import { format } from "date-fns"
import {
  PageShell,
  PageHeader,
  DetailSection,
  InfoRow,
  StatusBadge,
  SectionGrid,
  SectionCard,
} from "@/components/admin-shared"

interface CategoryDetail {
  id: string
  name: string
  slug: string
  description: string
  image: string | null
  parent_category_id: string | null
  parent_category?: { id: string; name: string; slug: string } | null
  trending: boolean
  product_count: number
  avg_profit_margin: number | null
  growth_percentage: number | null
  created_at: string
  updated_at: string
}

export default function CategoryDetailPage() {
  const router = useRouter()
  const params = useParams()
  const categoryId = params?.id as string
  const { showSuccess, showError } = useToast()

  const [category, setCategory] = useState<CategoryDetail | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchCategory = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiFetch(`/api/admin/categories/${categoryId}`)
      if (!response.ok) throw new Error("Failed to fetch category")
      const data = await response.json()
      const c: Category = data.category
      setCategory({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description || "",
        image: c.image,
        parent_category_id: c.parent_category_id,
        parent_category: c.parent_category ? { id: c.parent_category.id, name: c.parent_category.name, slug: c.parent_category.slug } : null,
        trending: c.trending || false,
        product_count: c.product_count || 0,
        avg_profit_margin: c.avg_profit_margin || null,
        growth_percentage: c.growth_percentage || null,
        created_at: c.created_at,
        updated_at: c.updated_at,
      })
    } catch (err) {
      showError("Failed to load category")
    } finally {
      setLoading(false)
    }
  }, [categoryId, showError])

  useEffect(() => { fetchCategory() }, [fetchCategory])

  const handleDelete = async () => {
    if (!category) return
    try {
      const response = await apiFetch(`/api/admin/categories/${category.id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete")
      showSuccess(`Category "${category.name}" deleted`)
      router.push("/admin/categories")
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to delete category")
    }
  }

  if (loading) {
    return (
      <PageShell>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </PageShell>
    )
  }

  if (!category) {
    return (
      <PageShell>
        <div className="text-center py-12" data-testid="category-not-found">
          <p className="text-muted-foreground">Category not found</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/admin/categories")} data-testid="button-back">
            Back to Categories
          </Button>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin/categories")} data-testid="button-back">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Categories
        </Button>
      </div>

      <PageHeader
        title={category.name}
        subtitle={category.slug}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" data-testid="button-edit">
              <Edit className="h-4 w-4 mr-1.5" />
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete} data-testid="button-delete">
              <Trash2 className="h-4 w-4 mr-1.5" />
              Delete
            </Button>
          </div>
        }
      />

      <SectionGrid>
        <DetailSection title="Category Information">
          <InfoRow label="ID" value={category.id} />
          <InfoRow label="Slug" value={category.slug} />
          <InfoRow label="Trending">
            <StatusBadge status={category.trending ? "Trending" : "Not Trending"} />
          </InfoRow>
          {category.parent_category && (
            <InfoRow label="Parent Category">
              <Button variant="link" className="h-auto p-0 text-sm" onClick={() => router.push(`/admin/categories/${category.parent_category!.id}`)} data-testid="link-parent-category">
                {category.parent_category.name}
              </Button>
            </InfoRow>
          )}
          <InfoRow label="Product Count" value={category.product_count} />
          <InfoRow label="Created" value={format(new Date(category.created_at), "MMM dd, yyyy HH:mm")} />
          <InfoRow label="Updated" value={format(new Date(category.updated_at), "MMM dd, yyyy HH:mm")} />
        </DetailSection>

        <div className="space-y-6">
          {category.description && (
            <SectionCard title="Description">
              <p className="text-sm text-muted-foreground" data-testid="text-description">{category.description}</p>
            </SectionCard>
          )}

          <SectionCard title="Image">
            {category.image ? (
              <div className="w-full aspect-video rounded-lg overflow-hidden bg-muted">
                <img src={category.image} alt={category.name} className="object-cover w-full h-full" data-testid="img-category" />
              </div>
            ) : (
              <div className="w-full aspect-video rounded-lg bg-muted flex items-center justify-center">
                <Folder className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </SectionCard>

          {(category.avg_profit_margin !== null || category.growth_percentage !== null) && (
            <SectionCard title="Statistics">
              <div className="space-y-2">
                {category.avg_profit_margin !== null && (
                  <InfoRow label="Avg Profit Margin" value={`${category.avg_profit_margin.toFixed(1)}%`} />
                )}
                {category.growth_percentage !== null && (
                  <InfoRow label="Growth" value={`${category.growth_percentage.toFixed(1)}%`} />
                )}
              </div>
            </SectionCard>
          )}
        </div>
      </SectionGrid>
    </PageShell>
  )
}
