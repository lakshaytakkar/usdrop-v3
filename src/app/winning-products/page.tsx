"use client"

import { useState, useMemo } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/topbar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UpsellDialog } from "@/components/ui/upsell-dialog"
import { WinningProductCard } from "./components/product-card"
import { winningProducts, ProductCategory, WinningProduct } from "./data/products"
import { 
  Trophy, 
  TrendingUp, 
  DollarSign,
  Filter,
  Grid3x3,
  Home,
  Sparkles,
  Heart,
  Zap,
  Box,
  Baby,
  Dog,
  Leaf
} from "lucide-react"

const categories = [
  { id: "all" as ProductCategory, label: "All Products", icon: Grid3x3 },
  { id: "fashion" as ProductCategory, label: "Fashion", icon: Sparkles },
  { id: "home-decor" as ProductCategory, label: "Home Decor", icon: Home },
  { id: "beauty" as ProductCategory, label: "Beauty", icon: Heart },
  { id: "sports-fitness" as ProductCategory, label: "Sports & Fitness", icon: Zap },
  { id: "kitchen" as ProductCategory, label: "Kitchen", icon: Box },
  { id: "home-garden" as ProductCategory, label: "Home & Garden", icon: Leaf },
  { id: "gadgets" as ProductCategory, label: "Gadgets", icon: Zap },
  { id: "pets" as ProductCategory, label: "Pets", icon: Dog },
  { id: "mother-kids" as ProductCategory, label: "Mother & Kids", icon: Baby },
  { id: "other" as ProductCategory, label: "Other", icon: Box },
]

type SortOption = "newest" | "oldest" | "profit-high" | "profit-low" | "revenue-high" | "revenue-low"

const sortOptions = [
  { value: "newest" as SortOption, label: "Newest First" },
  { value: "oldest" as SortOption, label: "Oldest First" },
  { value: "profit-high" as SortOption, label: "Profit: High to Low" },
  { value: "profit-low" as SortOption, label: "Profit: Low to High" },
  { value: "revenue-high" as SortOption, label: "Revenue: High to Low" },
  { value: "revenue-low" as SortOption, label: "Revenue: Low to High" },
]

export default function WinningProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("all")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [isUpsellOpen, setIsUpsellOpen] = useState(false)

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...winningProducts]

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.foundDate).getTime() - new Date(a.foundDate).getTime()
        case "oldest":
          return new Date(a.foundDate).getTime() - new Date(b.foundDate).getTime()
        case "profit-high":
          return b.profitMargin - a.profitMargin
        case "profit-low":
          return a.profitMargin - b.profitMargin
        case "revenue-high":
          return b.potRevenue - a.potRevenue
        case "revenue-low":
          return a.potRevenue - b.potRevenue
        default:
          return 0
      }
    })

    return filtered
  }, [selectedCategory, sortBy])

  const stats = useMemo(() => {
    const avgProfit = winningProducts.reduce((sum, p) => sum + p.profitMargin, 0) / winningProducts.length
    const totalRevenue = winningProducts.reduce((sum, p) => sum + p.potRevenue, 0)
    const lockedCount = winningProducts.filter(p => p.isLocked).length
    
    return {
      total: winningProducts.length,
      avgProfit,
      totalRevenue,
      lockedCount
    }
  }, [])

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Topbar />
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-gray-50/50">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-8 w-8 text-primary" />
                <h1 className="text-3xl md:text-4xl font-bold">Winning Products</h1>
              </div>
              <p className="text-muted-foreground">
                Expert-curated products with high profit potential
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4 border-l-4 border-l-primary">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Products</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <Trophy className="h-8 w-8 text-primary/20" />
                </div>
              </Card>

              <Card className="p-4 border-l-4 border-l-emerald-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Profit</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      ${stats.avgProfit.toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-emerald-500/20" />
                </div>
              </Card>

              <Card className="p-4 border-l-4 border-l-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ${(stats.totalRevenue / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500/20" />
                </div>
              </Card>

              <Card className="p-4 border-l-4 border-l-amber-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Premium Content</p>
                    <p className="text-2xl font-bold text-amber-600">{stats.lockedCount}</p>
                  </div>
                  <Sparkles className="h-8 w-8 text-amber-500/20" />
                </div>
              </Card>
            </div>

            {/* Filters */}
            <Card className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:w-48">
                  <label className="text-sm font-medium mb-2 block">
                    Results
                  </label>
                  <div className="px-3 py-2 border rounded-lg bg-muted/50">
                    <p className="text-sm font-semibold">{filteredAndSortedProducts.length} products</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {category.label}
                  </Button>
                )
              })}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredAndSortedProducts.map((product) => (
                <WinningProductCard
                  key={product.id}
                  product={product}
                  onLockedClick={() => setIsUpsellOpen(true)}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredAndSortedProducts.length === 0 && (
              <Card className="p-12">
                <div className="text-center">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground">
                    Try selecting a different category or changing your filters.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>

      {/* Upsell Dialog */}
      <UpsellDialog 
        isOpen={isUpsellOpen} 
        onClose={() => setIsUpsellOpen(false)} 
      />
    </>
  )
}

