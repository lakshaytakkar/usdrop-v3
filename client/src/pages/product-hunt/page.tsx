

import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { ProductCard } from "./components/product-card"
import { Loader2, ChevronDown, ChevronRight, RotateCcw, Filter } from "lucide-react"
import { Product } from "@/types/products"
import { Category } from "@/types/categories"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { useOnboarding } from "@/contexts/onboarding-context"
import { UpsellDialog } from "@/components/ui/upsell-dialog"
import { getTeaserLockState } from "@/hooks/use-teaser-lock"
import { SectionError } from "@/components/ui/section-error"
import { EmptyState } from "@/components/ui/empty-state"
import { cn } from "@/lib/utils"

type ProductCardData = {
  id: string
  image: string
  title: string
  buyPrice: number
  sellPrice: number
  profitPerOrder: number
  trendData: number[]
  category: string
  rating: number
  reviews: number
  trending?: boolean
}

type SortOption = "newest" | "price-low" | "price-high" | "profit" | "rating"

function FilterSidebar({
  sortBy,
  setSortBy,
  priceRange,
  setPriceRange,
  onReset,
}: {
  sortBy: SortOption
  setSortBy: (sort: SortOption) => void
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
  onReset: () => void
}) {
  const [sortOpen, setSortOpen] = useState(true)
  const [priceOpen, setPriceOpen] = useState(false)

  return (
    <aside className="w-[220px] shrink-0 hidden lg:block">
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/60 shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-4 sticky top-0">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
          <Filter className="h-4 w-4" />
          Filters
        </div>

        <div className="space-y-4">
          <div>
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center justify-between w-full text-sm font-medium text-gray-800 py-1.5 cursor-pointer"
            >
              <span>Sort By</span>
              {sortOpen ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
            </button>
            {sortOpen && (
              <div className="mt-2 space-y-1">
                {[
                  { value: "newest" as SortOption, label: "Newest First" },
                  { value: "price-low" as SortOption, label: "Price: Low to High" },
                  { value: "price-high" as SortOption, label: "Price: High to Low" },
                  { value: "profit" as SortOption, label: "Highest Profit" },
                  { value: "rating" as SortOption, label: "Best Rating" },
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={cn(
                      "flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm transition-colors cursor-pointer",
                      sortBy === option.value
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <div className={cn(
                      "w-3 h-3 rounded-full border-2 flex-shrink-0",
                      sortBy === option.value
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    )} />
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-3">
            <button
              onClick={() => setPriceOpen(!priceOpen)}
              className="flex items-center justify-between w-full text-sm font-medium text-gray-800 py-1.5 cursor-pointer"
            >
              <span>Price Range</span>
              {priceOpen ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
            </button>
            {priceOpen && (
              <div className="mt-2 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">Min ($)</label>
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="0"
                      min={0}
                    />
                  </div>
                  <span className="text-gray-400 mt-5">-</span>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">Max ($)</label>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="999"
                      min={0}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={onReset}
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </div>
      </div>
    </aside>
  )
}

export default function ProductHuntPage() {
  const PRODUCTS_PER_PAGE = 12
  
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 999])
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [isUpsellOpen, setIsUpsellOpen] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [savedProductIds, setSavedProductIds] = useState<Set<string>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const categoriesRef = useRef<Category[]>([])
  const { isFree } = useOnboarding()

  categoriesRef.current = categories

  const parentCategories = categories.filter(cat => !cat.parent_category_id)

  useEffect(() => {
    const fetchSavedProducts = async () => {
      try {
        const res = await apiFetch("/api/picklist", { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          const ids = new Set<string>((data.items || []).map((item: any) => item.productId))
          setSavedProductIds(ids)
        }
      } catch {}
    }
    fetchSavedProducts()

    const handlePicklistUpdate = () => fetchSavedProducts()
    window.addEventListener('picklist-updated', handlePicklistUpdate)
    return () => window.removeEventListener('picklist-updated', handlePicklistUpdate)
  }, [])
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (page === 1) setIsLoading(true)
        setError(null)
        
        const params = new URLSearchParams({
          source_type: 'scraped',
          page: page.toString(),
          pageSize: PRODUCTS_PER_PAGE.toString(),
          sortBy: 'created_at',
          sortOrder: 'desc',
        })
        
        if (selectedCategory !== "all") {
          const category = categoriesRef.current.find(c => c.slug === selectedCategory || c.name.toLowerCase() === selectedCategory.toLowerCase())
          if (category) {
            params.append('category_id', category.id)
          }
        }
        
        const response = await apiFetch(`/api/products?${params.toString()}`)
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const data = await response.json()
        
        if (page === 1) {
          setProducts(data.products || [])
        } else {
          setProducts(prev => [...prev, ...(data.products || [])])
        }
        
        setHasMore(data.page < data.totalPages)
        setIsLoading(false)
        setIsLoadingMore(false)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err instanceof Error ? err.message : 'Failed to load products')
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    }
    
    fetchProducts()
  }, [page, selectedCategory])
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiFetch("/api/categories")
        if (response.ok) {
          const data = await response.json()
          setCategories(data.categories || [])
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
    }
    
    fetchCategories()
  }, [])
  
  useEffect(() => {
    setPage(1)
    setProducts([])
    if (containerRef.current) {
      containerRef.current.scrollTop = 0
    }
  }, [selectedCategory])
  
  const productCardData: ProductCardData[] = useMemo(() => {
    let filtered = products.map((product) => ({
      id: product.id,
      image: product.image,
      title: product.title,
      buyPrice: product.buy_price,
      sellPrice: product.sell_price,
      profitPerOrder: product.profit_per_order,
      trendData: Array.isArray(product.trend_data) ? product.trend_data : [],
      category: product.category?.name || product.category?.slug || 'uncategorized',
      rating: product.rating || 0,
      reviews: product.reviews_count || 0,
      trending: Array.isArray(product.trend_data) && product.trend_data.length > 1 
        ? product.trend_data[product.trend_data.length - 1] > product.trend_data[0]
        : false,
    }))

    if (priceRange[0] > 0 || priceRange[1] < 999) {
      filtered = filtered.filter(p => p.sellPrice >= priceRange[0] && p.sellPrice <= priceRange[1])
    }

    if (sortBy !== "newest") {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "price-low": return a.sellPrice - b.sellPrice
          case "price-high": return b.sellPrice - a.sellPrice
          case "profit": return b.profitPerOrder - a.profitPerOrder
          case "rating": return b.rating - a.rating
          default: return 0
        }
      })
    }

    return filtered
  }, [products, sortBy, priceRange])

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore || isFree) return
    setIsLoadingMore(true)
    setPage(prev => prev + 1)
  }, [isLoadingMore, hasMore, isFree])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && hasMore && !isLoadingMore && !isLoading && !isFree) {
          loadMore()
        }
      },
      {
        root: containerRef.current,
        rootMargin: '200px',
        threshold: 0,
      }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, isLoadingMore, isLoading, isFree, loadMore])

  const handleResetFilters = () => {
    setSelectedCategory("all")
    setSortBy("newest")
    setPriceRange([0, 999])
  }

  return (
    <>
      <div
        className="flex flex-1 h-[calc(100vh-110px)] overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #e8f4fd 0%, #dbeef9 20%, #c8e6f5 40%, #b8ddf0 60%, #d4ecf7 80%, #eaf5fc 100%)',
        }}
      >
        <div className="flex flex-1 gap-4 p-4 md:p-5 overflow-hidden">
          <FilterSidebar
            sortBy={sortBy}
            setSortBy={setSortBy}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            onReset={handleResetFilters}
          />

          <div
            ref={containerRef}
            className="flex-1 flex flex-col gap-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/60 shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-4 md:p-5 overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold text-gray-900" data-testid="text-page-title">Product Hunt</h1>
              <button
                data-testid="button-mobile-filters"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2" data-testid="category-pills">
              <button
                data-testid="button-category-all"
                onClick={() => setSelectedCategory("all")}
                className={cn(
                  "px-3.5 py-2 rounded-full text-[13px] font-medium transition-all cursor-pointer border",
                  selectedCategory === "all"
                    ? "bg-blue-500 text-white border-blue-500 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                )}
              >
                All Categories
              </button>
              {parentCategories.map(cat => (
                <button
                  key={cat.id}
                  data-testid={`button-category-${cat.slug}`}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium transition-all cursor-pointer border",
                    selectedCategory === cat.slug
                      ? "bg-blue-500 text-white border-blue-500 shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                  )}
                >
                  {(cat.thumbnail || cat.image) && (
                    <img
                      src={cat.thumbnail || cat.image || ''}
                      alt={cat.name}
                      className="w-4 h-4 rounded-sm object-cover"
                    />
                  )}
                  <span className="capitalize">{cat.name}</span>
                </button>
              ))}
            </div>

            {showMobileFilters && (
              <div className="lg:hidden bg-gray-50 rounded-lg border border-gray-200 p-4">
                <div className="space-y-3">
                  <span className="text-sm font-medium text-gray-700 block mb-2">Sort & Filter</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { value: "newest" as SortOption, label: "Newest" },
                      { value: "price-low" as SortOption, label: "Price: Low" },
                      { value: "price-high" as SortOption, label: "Price: High" },
                      { value: "profit" as SortOption, label: "Profit" },
                      { value: "rating" as SortOption, label: "Rating" },
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer",
                          sortBy === option.value
                            ? "bg-blue-100 text-blue-700"
                            : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <SectionError
                className="max-w-2xl mx-auto"
                description={error}
                onRetry={() => {
                  setError(null)
                  setPage(1)
                  setProducts([])
                  setIsLoading(true)
                  setIsLoadingMore(false)
                  setHasMore(true)
                }}
              />
            )}
            
            <div className="relative flex-1">
              {isLoading && products.length === 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <Card key={index} className="overflow-hidden border-border/50 p-0">
                      <Skeleton className="aspect-square w-full" />
                      <div className="p-4 space-y-3">
                        <Skeleton className="h-5 w-3/4" />
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-16 w-full" />
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-12" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <>
                  {productCardData.length > 0 ? (
                    <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                      {productCardData.map((product, index) => {
                        const { isLocked } = getTeaserLockState(index, isFree, { 
                          freeVisibleCount: 6,
                          strategy: "first-n-items"
                        })
                        
                        return (
                          <div key={product.id}>
                            <ProductCard 
                              product={product} 
                              isLocked={isLocked}
                              onLockedClick={() => setIsUpsellOpen(true)}
                              isSaved={savedProductIds.has(String(product.id))}
                            />
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <EmptyState
                      title="No products found"
                      description="Try adjusting your filters or category selection."
                      action={{
                        label: "Reset filters",
                        onClick: handleResetFilters,
                      }}
                    />
                  )}
                </>
              )}
            </div>

            <div ref={sentinelRef} className="w-full py-2" />

            {isLoadingMore && (
              <div className="flex flex-col items-center gap-3 py-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  <span className="text-sm font-medium">Loading more products...</span>
                </div>
              </div>
            )}

            {!hasMore && productCardData.length > 0 && (
              <div className="flex flex-col items-center py-6">
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-3" />
                <p className="text-sm text-muted-foreground">
                  You&apos;ve seen all the products
                </p>
              </div>
            )}

            <UpsellDialog isOpen={isUpsellOpen} onClose={() => setIsUpsellOpen(false)} />
          </div>
        </div>
      </div>
    </>
  )
}
