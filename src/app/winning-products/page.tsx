"use client"

import { useState, useMemo } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/topbar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UpsellDialog } from "@/components/ui/upsell-dialog"
import { WinningProductsTable } from "./components/winning-products-table"
import { QuickFilters, QuickFilterType } from "./components/quick-filters"
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
  Leaf,
  Search,
  Play
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
  const [searchQuery, setSearchQuery] = useState("")
  const [quickFilter, setQuickFilter] = useState<QuickFilterType>(null)

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...winningProducts]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      )
    }

    // Quick filter
    if (quickFilter) {
      switch (quickFilter) {
        case "top-new":
          // Products found within last 14 days
          const twoWeeksAgo = new Date()
          twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
          filtered = filtered.filter(p => 
            new Date(p.foundDate) >= twoWeeksAgo
          )
          break
        case "high-potential":
          // High profit margin (>45%) or high revenue (>100k)
          filtered = filtered.filter(p => 
            p.profitMargin > 45 || p.potRevenue > 100000
          )
          break
        case "sales-grow":
          // High growth rate (>100%)
          filtered = filtered.filter(p => 
            p.revenueGrowthRate > 100
          )
          break
      }
    }

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
  }, [selectedCategory, sortBy, searchQuery, quickFilter])

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
          <div className="flex flex-1 flex-col gap-2 p-4 md:p-6 bg-gray-50/50 min-h-0">
            {/* Premium Banner with grainy gradient */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-yellow-900 via-amber-950 to-yellow-800 p-3 text-white h-[77px] flex-shrink-0">
              {/* Enhanced grainy texture layers */}
              <div 
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                  opacity: 0.5,
                  mixBlendMode: 'overlay'
                }}
              ></div>
              <div 
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.8' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise2)'/%3E%3C/svg%3E")`,
                  opacity: 0.4,
                  mixBlendMode: 'multiply'
                }}
              ></div>
              <div 
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise3'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='6' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise3)'/%3E%3C/svg%3E")`,
                  opacity: 0.3,
                  mixBlendMode: 'screen'
                }}
              ></div>
              <div 
                className="absolute inset-0 z-0"
                style={{
                  background: `repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.08) 1px, rgba(0,0,0,0.08) 2px),
                                repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.04) 1px, rgba(255,255,255,0.04) 2px)`,
                  opacity: 0.6
                }}
              ></div>

              {/* Content */}
              <div className="relative z-10 flex items-center gap-3 h-full">
                {/* Icon/Mascot */}
                <div className="relative w-[60px] h-[60px] flex-shrink-0 bg-transparent flex items-center justify-center">
                  <Trophy 
                    className="h-12 w-12 text-white"
                    style={{
                      filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.3))',
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-lg md:text-xl font-bold leading-tight">USDrop Winning Products</h2>
                  <p className="text-white/85 text-xs leading-tight mt-0.5">
                    Expert-curated products with high profit potential to boost your dropshipping success.
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white hover:border-white/50 backdrop-blur-sm cursor-pointer"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    <span className="text-xs">Tutorial</span>
                  </Button>
                </div>
              </div>
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

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full max-w-md"
              />
            </div>

            {/* Quick Filters */}
            <QuickFilters
              selectedFilter={quickFilter}
              onFilterChange={setQuickFilter}
            />

            {/* Filters and Sort */}
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
                    className={`flex items-center gap-2 cursor-pointer ${
                      selectedCategory === category.id 
                        ? "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white hover:from-blue-700 hover:via-blue-600 hover:to-blue-700" 
                        : ""
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {category.label}
                  </Button>
                )
              })}
            </div>

            {/* Products Table */}
            <WinningProductsTable
              products={filteredAndSortedProducts}
              onProductClick={(product) => {
                // Handle product click - could navigate to detail page
                console.log("View product:", product.id)
              }}
              onLockedClick={() => setIsUpsellOpen(true)}
            />
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

