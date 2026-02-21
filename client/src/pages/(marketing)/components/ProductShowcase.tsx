import { useState, useEffect } from "react"
import { Product } from "@/types/products"
import { Link } from "wouter"
import { ArrowRight, TrendingUp, DollarSign, Tag, Star } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

interface ShowcaseProduct {
  id: string
  name: string
  image: string
  sellPrice: string
  buyPrice: string
  profit: string
  profitRaw: number
  rating: number | null
  reviewsCount: number
  categoryName: string | null
  createdAt: string
}

function ProductCard({ product }: { product: ShowcaseProduct }) {
  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow group border-gray-100"
      data-testid={`showcase-product-${product.id}`}
    >
      <div className="relative h-[180px] bg-gray-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          decoding="async"
        />
        {product.categoryName && (
          <Badge className="absolute top-2 left-2 text-[10px] bg-blue-600 text-white border-0">
            {product.categoryName}
          </Badge>
        )}
      </div>

      <div className="p-3.5 space-y-2.5">
        <h4 className="text-[13px] font-semibold text-gray-900 leading-snug line-clamp-2 min-h-[36px]" data-testid={`text-product-name-${product.id}`}>
          {product.name}
        </h4>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-500 flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Sell Price:
            </span>
            <span className="font-semibold text-gray-800" data-testid={`text-price-${product.id}`}>{product.sellPrice}</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-500 flex items-center gap-1">
              <Tag className="h-3 w-3" />
              Cost:
            </span>
            <span className="font-medium text-gray-600">{product.buyPrice}</span>
          </div>
        </div>

        <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 flex items-center justify-between">
          <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" />
            Profit Per Order
          </span>
          <span className="text-sm font-bold text-emerald-600" data-testid={`text-profit-${product.id}`}>{product.profit}</span>
        </div>

        <div className="flex items-center justify-between">
          {product.rating !== null ? (
            <span className="text-[10px] text-amber-600 flex items-center gap-0.5 font-medium">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {product.rating.toFixed(1)} ({product.reviewsCount})
            </span>
          ) : (
            <span className="text-[10px] text-gray-400">{product.reviewsCount} reviews</span>
          )}
          <span className="text-[10px] text-gray-400" data-testid={`text-date-${product.id}`}>{product.createdAt}</span>
        </div>
      </div>
    </Card>
  )
}

function SkeletonCard() {
  return (
    <Card className="overflow-hidden border-gray-100">
      <Skeleton className="h-[180px] w-full rounded-none" />
      <div className="p-3.5 space-y-2.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </Card>
  )
}

export function ProductShowcase() {
  const [products, setProducts] = useState<ShowcaseProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const params = new URLSearchParams({
          page: "1",
          pageSize: "6",
          sortBy: "created_at",
          sortOrder: "desc",
        })

        const response = await fetch(`/api/products?${params.toString()}`)
        if (!response.ok) throw new Error("Failed to fetch products")

        const data = await response.json()

        const mapped: ShowcaseProduct[] = data.products
          .filter((p: Product) => p.image && p.title)
          .slice(0, 6)
          .map((p: Product) => ({
            id: p.id,
            name: p.title,
            image: p.image,
            sellPrice: currencyFormatter.format(p.sell_price),
            buyPrice: currencyFormatter.format(p.buy_price),
            profit: currencyFormatter.format(p.profit_per_order),
            profitRaw: p.profit_per_order,
            rating: p.rating,
            reviewsCount: p.reviews_count || 0,
            categoryName: p.category?.name || null,
            createdAt: new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          }))

        setProducts(mapped)
      } catch (err) {
        console.error("Error fetching showcase products:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-[42px] font-bold leading-[1.15] tracking-[-0.02em] text-gray-900 mb-4">
            Explore Real Products with
            <br />
            <span className="text-blue-600">Built-in Profit Margins</span>
          </h2>
          <p className="text-[16px] text-gray-500 leading-relaxed max-w-[560px] mx-auto">
            Every listing shows you exactly what you'll earn per sale. No guessing, no spreadsheets — just clear profit data to make smarter decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
          }
        </div>

        <div className="text-center mt-10">
          <Button size="lg" asChild>
            <Link href="/login" data-testid="button-showcase-cta">
              Browse All Products
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          <p className="text-[12px] text-gray-400 mt-3">
            800+ products updated daily. Free to explore.
          </p>
        </div>
      </div>
    </section>
  )
}
