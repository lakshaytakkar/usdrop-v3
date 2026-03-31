import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { Link } from "wouter"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { SectionError } from "@/components/ui/section-error"
import { EmptyState } from "@/components/ui/empty-state"
import { ChevronRight } from "lucide-react"
import { Product } from "@/types/products"
import { Area, AreaChart, ResponsiveContainer } from "recharts"

interface TrendingProduct {
  id: string
  title: string
  image: string
  trendData: number[]
}

function TrendingProductCard({ product }: { product: TrendingProduct }) {
  const [imageError, setImageError] = useState(false)

  const chartData = useMemo(() => {
    const data = Array.isArray(product.trendData) && product.trendData.length > 0
      ? product.trendData
      : Array.from({ length: 12 }, (_, i) => Math.floor(20 + Math.random() * 80))
    return data.map((v, i) => ({ i, v }))
  }, [product.trendData])

  return (
    <Card
      data-testid={`card-trending-${product.id}`}
      className="overflow-hidden border-border/40 p-0 bg-gray-50 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex flex-col">
        <div className="flex min-h-[180px]">
          <div className="w-[45%] bg-white flex items-center justify-center p-3 overflow-hidden">
            {product.image && !imageError ? (
              <img
                data-testid={`img-trending-${product.id}`}
                src={product.image}
                alt={product.title}
                className="max-w-full max-h-[160px] object-contain"
                loading="lazy"
                onError={() => setImageError(true)}
              />
            ) : (
              <div data-testid={`img-trending-fallback-${product.id}`} className="w-full h-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/25"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              </div>
            )}
          </div>

          <div className="w-[55%] flex flex-col">
            <h3
              data-testid={`text-trending-title-${product.id}`}
              className="font-semibold text-sm line-clamp-2 px-3 pt-3 pb-1 text-foreground leading-tight"
            >
              {product.title}
            </h3>
            <div className="flex-1 px-1 pb-1 min-h-[100px]">
              <ResponsiveContainer width="100%" height="100%" minHeight={80}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                  <defs>
                    <linearGradient id={`trending-grad-${product.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="v"
                    type="monotone"
                    fill={`url(#trending-grad-${product.id})`}
                    fillOpacity={1}
                    stroke="#3b82f6"
                    strokeWidth={1.5}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <Link
          href={`/products/product-hunt/${product.id}`}
          data-testid={`link-trending-details-${product.id}`}
          className="flex items-center justify-between px-4 py-2.5 bg-slate-700 text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <span className="text-sm font-medium">Show details</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </Card>
  )
}

function TrendingCardSkeleton() {
  return (
    <Card className="overflow-hidden p-0 bg-gray-50">
      <div className="flex min-h-[180px]">
        <div className="w-[45%] p-3">
          <Skeleton className="w-full h-full min-h-[140px] rounded" />
        </div>
        <div className="w-[55%] flex flex-col gap-2 p-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="flex-1 w-full rounded" />
        </div>
      </div>
      <Skeleton className="h-10 w-full rounded-none" />
    </Card>
  )
}

export default function TrendingProductsPage() {
  const [products, setProducts] = useState<TrendingProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)
  const pageSize = 6
  const observerRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef(false)
  const currentPageRef = useRef(1)

  const fetchTrending = useCallback(async (pageNum: number, append: boolean) => {
    if (loadingRef.current) return
    loadingRef.current = true

    try {
      if (append) {
        setIsLoadingMore(true)
        setLoadMoreError(null)
      } else {
        setIsLoading(true)
      }
      setError(null)

      const params = new URLSearchParams({
        is_trending: 'true',
        page: pageNum.toString(),
        pageSize: pageSize.toString(),
        sortBy: 'created_at',
        sortOrder: 'desc',
      })

      const response = await apiFetch(`/api/products?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch trending products')
      const data = await response.json()

      const mapped: TrendingProduct[] = (data.products || []).map((p: Product) => ({
        id: p.id,
        title: p.title,
        image: p.image,
        trendData: Array.isArray(p.trend_data) ? p.trend_data : [],
      }))

      const totalCount = data.total || 0
      setTotal(totalCount)

      if (append) {
        setProducts(prev => [...prev, ...mapped])
      } else {
        setProducts(mapped)
      }

      currentPageRef.current = pageNum
      const totalPages = Math.ceil(totalCount / pageSize)
      setHasMore(pageNum < totalPages)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load trending products'
      if (append) {
        setLoadMoreError(msg)
      } else {
        setError(msg)
      }
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
      loadingRef.current = false
    }
  }, [])

  useEffect(() => {
    fetchTrending(1, false)
  }, [fetchTrending])

  const loadNextPage = useCallback(() => {
    if (loadingRef.current || !hasMore) return
    const nextPage = currentPageRef.current + 1
    fetchTrending(nextPage, true)
  }, [hasMore, fetchTrending])

  useEffect(() => {
    if (!hasMore || isLoading || isLoadingMore || loadMoreError) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRef.current) {
          loadNextPage()
        }
      },
      { rootMargin: '200px' }
    )

    const el = observerRef.current
    if (el) observer.observe(el)

    return () => {
      if (el) observer.unobserve(el)
    }
  }, [hasMore, isLoading, isLoadingMore, loadMoreError, loadNextPage])

  if (error && products.length === 0) {
    return (
      <div className="flex flex-1 flex-col gap-2 px-12 md:px-20 lg:px-32 py-6 md:py-8">
        <SectionError description={error} onRetry={() => fetchTrending(1, false)} className="max-w-2xl" />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 px-12 md:px-20 lg:px-32 py-6 md:py-8 min-h-0">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <TrendingCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          title="No trending products"
          description="No products are currently marked as trending. Check back later."
        />
      ) : (
        <>
          {total > 0 && (
            <div className="flex items-center justify-between mb-1">
              <p data-testid="text-trending-count" className="text-sm text-muted-foreground">
                Showing {products.length} of {total} trending products
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {products.map((product) => (
              <TrendingProductCard key={product.id} product={product} />
            ))}
          </div>

          {isLoadingMore && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <TrendingCardSkeleton key={`loading-${i}`} />
              ))}
            </div>
          )}

          {loadMoreError && (
            <div className="flex flex-col items-center gap-2 py-6">
              <p data-testid="text-load-more-error" className="text-sm text-red-500">{loadMoreError}</p>
              <Button
                data-testid="button-retry-load-more"
                variant="outline"
                size="sm"
                onClick={loadNextPage}
              >
                Try again
              </Button>
            </div>
          )}

          {hasMore && !isLoadingMore && !loadMoreError && (
            <div ref={observerRef} className="h-10" />
          )}

          {!hasMore && products.length > 6 && (
            <p data-testid="text-trending-end" className="text-center text-sm text-muted-foreground py-6">
              You've seen all {total} trending products
            </p>
          )}
        </>
      )}
    </div>
  )
}
