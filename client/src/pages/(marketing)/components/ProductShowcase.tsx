import { useState, useEffect, useRef } from "react"
import { Product } from "@/types/products"
import { Link } from "wouter"
import { ArrowRight, ChevronLeft, ChevronRight, TrendingUp, DollarSign, Tag, Star } from "lucide-react"
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
  rating: number | null
  reviewsCount: number
  categoryName: string | null
  createdAt: string
}

function ProductCard({ product }: { product: ShowcaseProduct }) {
  return (
    <Card
      className="w-[260px] shrink-0 overflow-hidden hover:shadow-lg transition-shadow group border-gray-100"
      data-testid={`showcase-product-${product.id}`}
    >
      <div className="relative h-[200px] bg-gray-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.categoryName && (
          <Badge className="absolute top-2 left-2 text-[10px] bg-blue-600 text-white border-0">
            {product.categoryName}
          </Badge>
        )}
        <div className="absolute top-2 right-2 h-6 px-2 rounded-full bg-emerald-500 text-white text-[10px] font-semibold flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          Trending
        </div>
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
            <span className="font-semibold text-blue-600" data-testid={`text-price-${product.id}`}>{product.sellPrice}</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-500 flex items-center gap-1">
              <Tag className="h-3 w-3" />
              Buy Price:
            </span>
            <span className="font-medium text-gray-800">{product.buyPrice}</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-500 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Profit:
            </span>
            <span className="font-semibold text-emerald-600">{product.profit}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
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
    <Card className="w-[260px] shrink-0 overflow-hidden border-gray-100">
      <Skeleton className="h-[200px] w-full rounded-none" />
      <div className="p-3.5 space-y-2.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
        </div>
        <div className="pt-2 border-t border-gray-100">
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </Card>
  )
}

export function ProductShowcase() {
  const [products, setProducts] = useState<ShowcaseProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const params = new URLSearchParams({
          page: "1",
          pageSize: "8",
          sortBy: "created_at",
          sortOrder: "desc",
        })

        const response = await fetch(`/api/products?${params.toString()}`)
        if (!response.ok) throw new Error("Failed to fetch products")

        const data = await response.json()

        const mapped: ShowcaseProduct[] = data.products
          .filter((p: Product) => p.image && p.title)
          .slice(0, 8)
          .map((p: Product) => ({
            id: p.id,
            name: p.title,
            image: p.image,
            sellPrice: currencyFormatter.format(p.sell_price),
            buyPrice: currencyFormatter.format(p.buy_price),
            profit: currencyFormatter.format(p.profit_per_order),
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

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return
    const amount = 280
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    })
  }

  return (
    <section className="py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-16">
          <div className="lg:w-[340px] shrink-0 lg:sticky lg:top-32">
            <h2 className="text-3xl md:text-[38px] font-bold leading-[1.15] tracking-[-0.02em] text-gray-900 mb-4">
              Search through tens
              <br />
              of thousands of
              <br />
              <span className="text-blue-600">Trending Products</span>
            </h2>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-8 max-w-[320px]">
              Get inspiration from product listings, research your competitors or study the market of your next potentially winning product.
            </p>
            <Button size="lg" asChild>
              <Link href="/login" data-testid="button-showcase-cta">
                Start Searching
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <p className="text-[12px] text-gray-400 mt-4">
              Free plan available. No credit card required.
            </p>
          </div>

          <div className="flex-1 min-w-0 relative">
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none hidden lg:block" />
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mr-6 pr-6"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                : products.map((product) => (
                    <div key={product.id} style={{ scrollSnapAlign: "start" }}>
                      <ProductCard product={product} />
                    </div>
                  ))
              }
            </div>

            {!isLoading && products.length > 3 && (
              <div className="flex items-center gap-2 mt-4 justify-end pr-6">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full cursor-pointer"
                  onClick={() => scroll("left")}
                  data-testid="button-showcase-scroll-left"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full cursor-pointer"
                  onClick={() => scroll("right")}
                  data-testid="button-showcase-scroll-right"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
