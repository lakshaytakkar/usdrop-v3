import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useCallback, useMemo } from "react"
import { Link } from "wouter"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { SectionError } from "@/components/ui/section-error"
import { EmptyState } from "@/components/ui/empty-state"
import { ChevronRight, Flame } from "lucide-react"
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
            {imageError ? (
              <div data-testid={`img-trending-fallback-${product.id}`} className="w-full h-full flex items-center justify-center text-muted-foreground">
                <Flame className="h-10 w-10" />
              </div>
            ) : (
              <img
                data-testid={`img-trending-${product.id}`}
                src={product.image || "/demo-products/product-1.png"}
                alt={product.title}
                className="max-w-full max-h-[160px] object-contain"
                loading="lazy"
                onError={() => setImageError(true)}
              />
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
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 20

  const fetchTrending = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const params = new URLSearchParams({
        is_trending: 'true',
        page: page.toString(),
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

      setProducts(mapped)
      setTotalPages(data.totalPages || Math.ceil((data.total || 0) / pageSize) || 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trending products')
    } finally {
      setIsLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchTrending()
  }, [fetchTrending])

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-2 px-12 md:px-20 lg:px-32 py-6 md:py-8">
        <SectionError description={error} onRetry={fetchTrending} className="max-w-2xl" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {products.map((product) => (
              <TrendingProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-4">
              <Button
                data-testid="button-trending-prev"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </Button>
              <span data-testid="text-trending-page" className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                data-testid="button-trending-next"
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
