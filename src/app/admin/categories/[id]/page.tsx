"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  ChevronLeft, 
  ChevronRight, 
  Edit, 
  MoreVertical,
  TrendingUp,
  Trash2,
  Copy,
  Package,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { ProductCategory } from "@/types/admin/categories"
import { Category } from "@/types/categories"
import Image from "next/image"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { useHasPermission } from "@/hooks/use-has-permission"

export default function CategoryDetailPage() {
  const router = useRouter()
  const params = useParams()
  const categoryId = params?.id as string
  const { showSuccess, showError } = useToast()

  // Permission checks
  const { hasPermission: canEdit } = useHasPermission("categories.edit")
  const { hasPermission: canDelete } = useHasPermission("categories.delete")

  const [category, setCategory] = useState<ProductCategory | null>(null)
  const [allCategories, setAllCategories] = useState<ProductCategory[]>([])
  const [loading, setLoading] = useState(true)

  // Transform API Category to ProductCategory
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
        
        // Fetch the specific category
        const categoryResponse = await fetch(`/api/admin/categories/${categoryId}`)
        if (!categoryResponse.ok) {
          throw new Error('Failed to fetch category')
        }
        const categoryData = await categoryResponse.json()
        const apiCategory: Category = categoryData.category
        setCategory(transformToProductCategory(apiCategory))
        
        // Fetch all categories for navigation
        const allCategoriesResponse = await fetch('/api/admin/categories?include_subcategories=true')
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

  // Find previous and next categories
  const { prevCategory, nextCategory } = useMemo(() => {
    if (!category) return { prevCategory: null, nextCategory: null }
    
    const currentIndex = allCategories.findIndex((c) => c.id === category.id)
    const prev = currentIndex > 0 ? allCategories[currentIndex - 1] : null
    const next = currentIndex < allCategories.length - 1 ? allCategories[currentIndex + 1] : null
    
    return { prevCategory: prev, nextCategory: next }
  }, [category, allCategories])

  // Get subcategories
  const subcategories = useMemo(() => {
    if (!category) return []
    return allCategories.filter((c) => c.parent_category_id === category.id)
  }, [category, allCategories])

  if (loading) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Loading category...</div>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Category not found</div>
        </div>
      </div>
    )
  }

  const handleEdit = () => {
    if (!canEdit) {
      showError("You don't have permission to edit categories")
      return
    }
    // TODO: Implement edit functionality
    showError("Edit functionality will be implemented")
  }

  const handleDelete = () => {
    if (!canDelete) {
      showError("You don't have permission to delete categories")
      return
    }
    // TODO: Implement delete with confirmation
    showError("Delete functionality will be implemented")
  }

  const handleToggleTrending = async () => {
    if (!canEdit) {
      showError("You don't have permission to edit categories")
      return
    }
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setCategory((prev) => prev ? { ...prev, trending: !prev.trending, updated_at: new Date().toISOString() } : null)
      showSuccess(`Category ${!category.trending ? "marked as trending" : "removed from trending"}`)
    } catch (err) {
      showError("Failed to update category")
    }
  }

  const handleDuplicate = () => {
    if (!canEdit) {
      showError("You don't have permission to create categories")
      return
    }
    // TODO: Implement duplicate
    showError("Duplicate functionality will be implemented")
  }

  const handleCopyCategoryId = async () => {
    try {
      await navigator.clipboard.writeText(category.id)
      showSuccess("Category ID copied to clipboard")
    } catch (err) {
      showError("Failed to copy Category ID")
    }
  }

  const handleCopySlug = async () => {
    try {
      await navigator.clipboard.writeText(category.slug)
      showSuccess("Slug copied to clipboard")
    } catch (err) {
      showError("Failed to copy slug")
    }
  }

  const handleViewProducts = () => {
    router.push(`/admin/products?category=${category.id}`)
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Topbar with Back Button, Breadcrumbs and Navigation */}
      <div className="flex items-center justify-between p-3 border-b flex-shrink-0">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/categories")}
            className="h-8 w-8 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/admin/categories" className="hover:text-foreground cursor-pointer">
              Categories
            </Link>
            <span>/</span>
            <span className="text-foreground">{category.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {prevCategory && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/admin/categories/${prevCategory.id}`)}
              className="h-8 w-8 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          {nextCategory && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/admin/categories/${nextCategory.id}`)}
              className="h-8 w-8 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* Category Header */}
        <Card className="mb-2">
          <CardHeader className="pb-2 px-4 pt-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
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
                <div>
                  <CardTitle className="text-lg mb-0.5">{category.name}</CardTitle>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant={category.trending ? "default" : "outline"} className="text-xs">
                      {category.trending ? (
                        <>
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </>
                      ) : (
                        "Not Trending"
                      )}
                    </Badge>
                    {category.parent_category && (
                      <Badge variant="secondary" className="text-xs">
                        Subcategory of {category.parent_category.name}
                      </Badge>
                    )}
                    {subcategories.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {subcategories.length} Subcategories
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              {/* Button Group with Edit and More Actions */}
              <div className="flex items-center gap-1.5">
                <Button onClick={handleEdit} className="cursor-pointer" size="sm" variant="outline" disabled={!canEdit}>
                  <Edit className="h-3.5 w-3.5 mr-1.5" />
                  Edit
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="cursor-pointer h-8 w-8">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={handleToggleTrending} className="cursor-pointer" disabled={!canEdit}>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      {category.trending ? "Remove from Trending" : "Mark as Trending"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleViewProducts} className="cursor-pointer">
                      <Package className="h-4 w-4 mr-2" />
                      View Products
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleCopyCategoryId} className="cursor-pointer">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Category ID
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleCopySlug} className="cursor-pointer">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Slug
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDuplicate} className="cursor-pointer" disabled={!canEdit}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate Category
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDelete} className="text-destructive cursor-pointer" disabled={!canDelete}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
          <TabsList>
            <TabsTrigger value="overview" className="cursor-pointer">Overview</TabsTrigger>
            <TabsTrigger value="products" className="cursor-pointer">
              Products
              {category.product_count > 0 && (
                <Badge variant="secondary" className="ml-2 h-4 min-w-4 px-1 text-xs">
                  {category.product_count}
                </Badge>
              )}
            </TabsTrigger>
            {subcategories.length > 0 && (
              <TabsTrigger value="subcategories" className="cursor-pointer">
                Subcategories
                <Badge variant="secondary" className="ml-2 h-4 min-w-4 px-1 text-xs">
                  {subcategories.length}
                </Badge>
              </TabsTrigger>
            )}
            <TabsTrigger value="statistics" className="cursor-pointer">Statistics</TabsTrigger>
            <TabsTrigger value="settings" className="cursor-pointer">Settings</TabsTrigger>
          </TabsList>
          <div className="flex-1 overflow-y-auto">
            <TabsContent value="overview" className="space-y-2 mt-0">
              <Card>
                <CardHeader className="pb-2 px-4 pt-4">
                  <CardTitle className="text-base">Category Information</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Category ID</p>
                      <p className="text-sm font-mono">{category.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Slug</p>
                      <p className="text-sm font-mono">{category.slug}</p>
                    </div>
                    {category.parent_category && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Parent Category</p>
                        <Button
                          variant="link"
                          className="h-auto p-0 text-sm"
                          onClick={() => router.push(`/admin/categories/${category.parent_category_id}`)}
                        >
                          {category.parent_category.name}
                        </Button>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Status</p>
                      <Badge variant={category.trending ? "default" : "outline"}>
                        {category.trending ? "Trending" : "Not Trending"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Created At</p>
                      <p className="text-sm">{format(new Date(category.created_at), "MMM dd, yyyy HH:mm")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Updated At</p>
                      <p className="text-sm">{format(new Date(category.updated_at), "MMM dd, yyyy HH:mm")}</p>
                    </div>
                  </div>
                  {category.description && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Description</p>
                      <p className="text-sm">{category.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="products" className="space-y-2 mt-0">
              <Card>
                <CardHeader className="pb-2 px-4 pt-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Products in Category</CardTitle>
                    <Button size="sm" variant="outline" onClick={handleViewProducts}>
                      <Package className="h-4 w-4 mr-2" />
                      View All Products
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground">
                    This category contains {category.product_count} product{category.product_count !== 1 ? "s" : ""}.
                  </p>
                  <Button
                    variant="link"
                    className="mt-2 p-0 h-auto"
                    onClick={handleViewProducts}
                  >
                    View products in this category →
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            {subcategories.length > 0 && (
              <TabsContent value="subcategories" className="space-y-2 mt-0">
                <Card>
                  <CardHeader className="pb-2 px-4 pt-4">
                    <CardTitle className="text-base">Subcategories</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="space-y-2">
                      {subcategories.map((subcategory) => (
                        <div
                          key={subcategory.id}
                          className="flex items-center justify-between p-2 border rounded-lg hover:bg-muted/50 cursor-pointer"
                          onClick={() => router.push(`/admin/categories/${subcategory.id}`)}
                        >
                          <div className="flex items-center gap-2">
                            {subcategory.image && (
                              <div className="relative w-8 h-8 rounded overflow-hidden bg-muted">
                                <Image
                                  src={subcategory.image}
                                  alt={subcategory.name}
                                  fill
                                  className="object-cover"
                                  sizes="32px"
                                />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium">{subcategory.name}</p>
                              <p className="text-xs text-muted-foreground">{subcategory.product_count} products</p>
                            </div>
                          </div>
                          <Badge variant={subcategory.trending ? "default" : "outline"}>
                            {subcategory.trending ? "Trending" : "Not Trending"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
            <TabsContent value="statistics" className="space-y-2 mt-0">
              <div className="grid grid-cols-2 gap-2">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Product Count</p>
                    <p className="text-2xl font-bold">{category.product_count}</p>
                  </CardContent>
                </Card>
                {category.avg_profit_margin !== null && (
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">Avg Profit Margin</p>
                      <p className="text-2xl font-bold text-emerald-600">
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
                        <p className="text-2xl font-bold">
                          {category.growth_percentage.toFixed(1)}%
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            <TabsContent value="settings" className="space-y-2 mt-0">
              <Card>
                <CardHeader className="pb-2 px-4 pt-4">
                  <CardTitle className="text-base">Category Settings</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Category settings and management options will be available here.
                  </p>
                  {/* TODO: Add category settings form */}
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

