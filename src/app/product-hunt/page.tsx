"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Topbar } from "@/components/layout/topbar"
import { ProductCard } from "./components/product-card"
import { Loader2 } from "lucide-react"
import { Product } from "@/types/products"
import { Category } from "@/types/categories"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { useOnboarding } from "@/contexts/onboarding-context"
import { UpsellDialog } from "@/components/ui/upsell-dialog"
import { getTeaserLockState } from "@/hooks/use-teaser-lock"
import { SectionError } from "@/components/ui/section-error"
import { EmptyState } from "@/components/ui/empty-state"

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

export default function ProductHuntPage() {
  const PRODUCTS_PER_PAGE = 12
  
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [isUpsellOpen, setIsUpsellOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const categoriesRef = useRef<Category[]>([])
  const { isFree } = useOnboarding()

  categoriesRef.current = categories
  
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
        
        const response = await fetch(`/api/products?${params.toString()}`)
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
        const response = await fetch('/api/categories')
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
    return products.map((product) => ({
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
  }, [products])

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

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <div 
          ref={containerRef}
          className="flex flex-1 flex-col gap-4 p-4 md:p-6 overflow-y-auto relative"
        >
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-3 -mx-4 md:-mx-6 px-4 md:px-6 pt-2 border-b border-border/50">
            <div className="grid grid-cols-5 gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer border shadow-sm ${
                  selectedCategory === "all"
                    ? "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white border-blue-600 shadow-md hover:shadow-lg"
                    : "bg-card text-foreground hover:bg-accent border-border hover:border-accent-foreground/20 hover:shadow-md"
                }`}
              >
                <span className="truncate">All Products</span>
              </button>
              
              {categories
                .filter(cat => !cat.parent_category_id)
                .slice(0, 9)
                .map(category => {
                  const categorySlug = category.slug
                  const isSelected = selectedCategory === categorySlug
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(categorySlug)}
                      className={`flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer border shadow-sm ${
                        isSelected
                          ? "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white border-blue-600 shadow-md hover:shadow-lg"
                          : "bg-card text-foreground hover:bg-accent border-border hover:border-accent-foreground/20 hover:shadow-md"
                      }`}
                    >
                      {(category.thumbnail || category.image) ? (
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-border/50">
                          <Image
                            src={category.thumbnail || category.image || '/categories/other-thumbnail.png'}
                            alt={category.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 border border-border/50">
                          <span className="text-base font-medium text-muted-foreground">
                            {category.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="truncate capitalize flex-1 text-left">{category.name}</span>
                    </button>
                  )
                })}
            </div>
          </div>

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
          
          <div className="relative">
            {isLoading && products.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                  <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                          />
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <EmptyState
                    title="No products found in this category"
                    description="Try selecting a different category or refresh to load more options."
                    action={{
                      label: "Refresh products",
                      onClick: () => {
                        setPage(1)
                        setProducts([])
                        setError(null)
                        setIsLoading(true)
                      },
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Card key={index} className="overflow-hidden border-border/50 p-0 animate-pulse">
                    <Skeleton className="aspect-square w-full" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {isFree && hasMore && !isLoading && productCardData.length > 0 && (
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="text-center max-w-sm">
                <p className="text-sm text-muted-foreground mb-3">
                  Upgrade to Pro to browse unlimited products
                </p>
                <button
                  onClick={() => setIsUpsellOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-medium hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  Unlock All Products
                </button>
              </div>
            </div>
          )}

          {!hasMore && productCardData.length > 0 && (
            <div className="flex flex-col items-center py-8">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-border to-transparent mb-3" />
              <p className="text-sm text-muted-foreground">
                You&apos;ve seen all the products
              </p>
            </div>
          )}

          <UpsellDialog isOpen={isUpsellOpen} onClose={() => setIsUpsellOpen(false)} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
