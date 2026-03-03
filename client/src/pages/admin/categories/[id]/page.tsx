import { apiFetch } from '@/lib/supabase'
import { useState, useMemo, useEffect } from "react"
import { useRouter, useParams } from "@/hooks/use-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Edit,
  TrendingUp,
  Trash2,
  Copy,
  Package,
  Folder,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { ProductCategory } from "@/types/admin/categories"
import { Category } from "@/types/categories"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { useHasPermission } from "@/hooks/use-has-permission"
import { AdminDetailLayout } from "@/components/admin"

export default function CategoryDetailPage() {
  const router = useRouter()
  const params = useParams()
  const categoryId = params?.id as string
  const { showSuccess, showError } = useToast()

  const { hasPermission: canEdit } = useHasPermission("categories.edit")
  const { hasPermission: canDelete } = useHasPermission("categories.delete")

  const [category, setCategory] = useState<ProductCategory | null>(null)
  const [allCategories, setAllCategories] = useState<ProductCategory[]>([])
  const [loading, setLoading] = useState(true)

  const transformToProductCategory = (cat: Category): ProductCategory => {
    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image: cat.image,
      thumbnail: cat.thumbnail || null,
      parent_category_id: cat.parent_category_id,
      parent_category: cat.parent_category ? {
        id: cat.parent_category.id,
        name: cat.parent_category.name,
        slug: cat.parent_category.slug,
      } : undefined,
      trending: cat.trending || false,
      product_count: cat.product_count || 0,
      avg_profit_margin: cat.avg_profit_margin || null,
      growth_percentage: cat.growth_percentage || null,
      created_at: cat.created_at,
      updated_at: cat.updated_at,
    }
  }

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true)

        const categoryResponse = await apiFetch(`/api/admin/categories/${categoryId}`)
        if (!categoryResponse.ok) {
          throw new Error('Failed to fetch category')
        }
        const categoryData = await categoryResponse.json()
        const apiCategory: Category = categoryData.category
        setCategory(transformToProductCategory(apiCategory))

        const allCategoriesResponse = await apiFetch("/api/admin/categories?include_subcategories=true")
        if (allCategoriesResponse.ok) {
          const allCategoriesData = await allCategoriesResponse.json()
          const allCats: Category[] = allCategoriesData.categories || []
          setAllCategories(allCats.map(transformToProductCategory))
        }
      } catch (err) {
        console.error('Error fetching category:', err)
        showError('Failed to load category')
      } finally {
        setLoading(false)
      }
    }

    if (categoryId) {
      fetchCategory()
    }
  }, [categoryId, showError])

  const { prevCategory, nextCategory } = useMemo(() => {
    if (!category) return { prevCategory: null, nextCategory: null }

    const currentIndex = allCategories.findIndex((c) => c.id === category.id)
    const prev = currentIndex > 0 ? allCategories[currentIndex - 1] : null
    const next = currentIndex < allCategories.length - 1 ? allCategories[currentIndex + 1] : null

    return { prevCategory: prev, nextCategory: next }
  }, [category, allCategories])

  const subcategories = useMemo(() => {
    if (!category) return []
    return allCategories.filter((c) => c.parent_category_id === category.id)
  }, [category, allCategories])

  if (!category && !loading) {
    return (
      <div className="flex items-center justify-center p-8" data-testid="category-not-found">
        <div className="text-muted-foreground">Category not found</div>
      </div>
    )
  }

  const handleEdit = () => {
    if (!canEdit) {
      showError("You don't have permission to edit categories")
      return
    }
    showError("Edit functionality will be implemented")
  }

  const handleDelete = async () => {
    if (!canDelete) {
      showError("You don't have permission to delete categories")
      return
    }
    if (!category) return
    try {
      const response = await apiFetch(`/api/admin/categories/${category.id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete category')
      }
      showSuccess(`Category "${category.name}" deleted successfully`)
      router.push("/admin/categories")
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to delete category")
    }
  }

  const handleToggleTrending = async () => {
    if (!canEdit) {
      showError("You don't have permission to edit categories")
      return
    }
    if (!category) return
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setCategory((prev) => prev ? { ...prev, trending: !prev.trending, updated_at: new Date().toISOString() } : null)
      showSuccess(`Category ${!category.trending ? "marked as trending" : "removed from trending"}`)
    } catch (err) {
      showError("Failed to update category")
    }
  }

  const handleCopyCategoryId = async () => {
    if (!category) return
    try {
      await navigator.clipboard.writeText(category.id)
      showSuccess("Category ID copied to clipboard")
    } catch (err) {
      showError("Failed to copy Category ID")
    }
  }

  const handleCopySlug = async () => {
    if (!category) return
    try {
      await navigator.clipboard.writeText(category.slug)
      showSuccess("Slug copied to clipboard")
    } catch (err) {
      showError("Failed to copy slug")
    }
  }

  const handleViewProducts = () => {
    if (!category) return
    router.push(`/admin/products?category=${category.id}`)
  }

  const overviewTab = category ? (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" data-testid="tab-content-overview">
      <Card>
        <CardHeader className="pb-2 px-4 pt-4">
          <CardTitle className="text-base">Category Information</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Category ID</p>
              <p className="text-sm font-mono" data-testid="text-category-id">{category.id}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Slug</p>
              <p className="text-sm font-mono" data-testid="text-category-slug">{category.slug}</p>
            </div>
            {category.parent_category && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Parent Category</p>
                <Button
                  variant="link"
                  className="h-auto p-0 text-sm"
                  onClick={() => router.push(`/admin/categories/${category.parent_category_id}`)}
                  data-testid="link-parent-category"
                >
                  {category.parent_category.name}
                </Button>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <Badge variant={category.trending ? "default" : "outline"} data-testid="badge-trending-status">
                {category.trending ? "Trending" : "Not Trending"}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Created</p>
              <p className="text-sm" data-testid="text-created-date">{format(new Date(category.created_at), "MMM dd, yyyy HH:mm")}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Updated</p>
              <p className="text-sm" data-testid="text-updated-date">{format(new Date(category.updated_at), "MMM dd, yyyy HH:mm")}</p>
            </div>
          </div>
          {category.description && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Description</p>
              <p className="text-sm" data-testid="text-description">{category.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 px-4 pt-4">
          <CardTitle className="text-base">Image</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {category.image ? (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
              <img
                src={category.image}
                alt={category.name}
                className="object-cover w-full h-full"
                data-testid="img-category"
              />
            </div>
          ) : (
            <div className="w-full aspect-video rounded-lg bg-muted flex items-center justify-center">
              <Folder className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  ) : null

  const productsTab = category ? (
    <Card data-testid="tab-content-products">
      <CardHeader className="pb-2 px-4 pt-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">Products in Category</CardTitle>
          <Button size="sm" variant="outline" onClick={handleViewProducts} data-testid="button-view-all-products">
            <Package className="h-4 w-4 mr-2" />
            View All Products
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <p className="text-sm text-muted-foreground" data-testid="text-product-count">
          This category contains {category.product_count} product{category.product_count !== 1 ? "s" : ""}.
        </p>
        <Button
          variant="link"
          className="mt-2 p-0 h-auto"
          onClick={handleViewProducts}
          data-testid="link-view-products"
        >
          View products in this category
        </Button>
      </CardContent>
    </Card>
  ) : null

  const subcategoriesTab = (
    <Card data-testid="tab-content-subcategories">
      <CardHeader className="pb-2 px-4 pt-4">
        <CardTitle className="text-base">Subcategories</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {subcategories.length === 0 ? (
          <p className="text-sm text-muted-foreground">No subcategories found.</p>
        ) : (
          <div className="space-y-2">
            {subcategories.map((subcategory) => (
              <div
                key={subcategory.id}
                className="flex items-center justify-between gap-2 p-2.5 border rounded-md hover-elevate cursor-pointer"
                onClick={() => router.push(`/admin/categories/${subcategory.id}`)}
                data-testid={`subcategory-item-${subcategory.id}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="relative w-8 h-8 rounded-md overflow-hidden bg-muted shrink-0">
                    {subcategory.image ? (
                      <img src={subcategory.image} alt={subcategory.name} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Folder className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{subcategory.name}</p>
                    <p className="text-xs text-muted-foreground">{subcategory.product_count} products</p>
                  </div>
                </div>
                <Badge variant={subcategory.trending ? "default" : "outline"} className="shrink-0">
                  {subcategory.trending ? "Trending" : "Not Trending"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )

  const statisticsTab = category ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="tab-content-statistics">
      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Product Count</p>
          <p className="text-2xl font-bold" data-testid="stat-product-count">{category.product_count}</p>
        </CardContent>
      </Card>
      {category.avg_profit_margin !== null && (
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Avg Profit Margin</p>
            <p className="text-2xl font-bold text-emerald-600" data-testid="stat-profit-margin">
              {category.avg_profit_margin.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      )}
      {category.growth_percentage !== null && (
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Growth Percentage</p>
            <div className="flex items-center gap-2">
              {category.growth_percentage > 0 ? (
                <ArrowUpRight className="h-5 w-5 text-emerald-600" />
              ) : (
                <ArrowDownRight className="h-5 w-5 text-destructive" />
              )}
              <p className="text-2xl font-bold" data-testid="stat-growth">
                {category.growth_percentage.toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Subcategories</p>
          <p className="text-2xl font-bold" data-testid="stat-subcategories">{subcategories.length}</p>
        </CardContent>
      </Card>
    </div>
  ) : null

  const tabs = [
    { value: "overview", label: "Overview", content: overviewTab },
    { value: "products", label: "Products", count: category?.product_count || 0, content: productsTab },
    ...(subcategories.length > 0 ? [{ value: "subcategories", label: "Subcategories", count: subcategories.length, content: subcategoriesTab }] : []),
    { value: "statistics", label: "Statistics", content: statisticsTab },
  ]

  return (
    <div className="flex flex-col h-full overflow-y-auto" data-testid="category-detail-page">
      <AdminDetailLayout
        backHref="/admin/categories"
        backLabel="Categories"
        title={category?.name || ""}
        subtitle={category?.slug || ""}
        avatarUrl={category?.image || undefined}
        avatarFallback={category?.name?.slice(0, 2).toUpperCase()}
        loading={loading}
        badges={category ? [
          <Badge key="trending" variant={category.trending ? "default" : "outline"}>
            {category.trending ? (
              <>
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending
              </>
            ) : (
              "Not Trending"
            )}
          </Badge>,
          category.parent_category ? (
            <Badge key="parent" variant="secondary">
              Sub of {category.parent_category.name}
            </Badge>
          ) : null,
        ].filter(Boolean) as React.ReactNode[] : []}
        primaryActions={
          <Button onClick={handleEdit} size="sm" variant="outline" disabled={!canEdit} data-testid="button-edit">
            <Edit className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
        }
        actions={[
          {
            label: category?.trending ? "Remove from Trending" : "Mark as Trending",
            icon: <TrendingUp className="h-4 w-4" />,
            onClick: handleToggleTrending,
            disabled: !canEdit,
          },
          {
            label: "View Products",
            icon: <Package className="h-4 w-4" />,
            onClick: handleViewProducts,
          },
          {
            label: "Copy Category ID",
            icon: <Copy className="h-4 w-4" />,
            onClick: handleCopyCategoryId,
            separator: true,
          },
          {
            label: "Copy Slug",
            icon: <Copy className="h-4 w-4" />,
            onClick: handleCopySlug,
          },
          {
            label: "Delete",
            icon: <Trash2 className="h-4 w-4" />,
            onClick: handleDelete,
            variant: "destructive",
            disabled: !canDelete,
            separator: true,
          },
        ]}
        tabs={tabs}
        defaultTab="overview"
        onPrev={prevCategory ? () => router.push(`/admin/categories/${prevCategory.id}`) : undefined}
        onNext={nextCategory ? () => router.push(`/admin/categories/${nextCategory.id}`) : undefined}
        hasPrev={!!prevCategory}
        hasNext={!!nextCategory}
      />
    </div>
  )
}
