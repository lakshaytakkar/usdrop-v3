
import { apiFetch } from '@/lib/supabase'
import { useMemo, useEffect, useState } from "react"
import { useOnboarding } from "@/contexts/onboarding-context"
import { Category } from "@/types/categories"
import { AlertCircle, ArrowRight, TrendingUp, Package } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { UpsellDialog } from "@/components/ui/upsell-dialog"
import { getTeaserLockState } from "@/hooks/use-teaser-lock"
import { LockOverlay } from "@/components/ui/lock-overlay"
import { Link } from "wouter"

function CategoriesPageContent() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpsellOpen, setIsUpsellOpen] = useState(false)
  const { isFree } = useOnboarding()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await apiFetch("/api/categories")
        if (!response.ok) throw new Error('Failed to fetch categories')
        const data = await response.json()
        setCategories(data.categories || [])
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError(err instanceof Error ? err.message : 'Failed to load categories')
        setIsLoading(false)
      }
    }
    fetchCategories()
  }, [])

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => (b.growth_percentage || 0) - (a.growth_percentage || 0))
  }, [categories])

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 px-12 md:px-20 lg:px-32 py-6 md:py-8 relative">

        {error && (
          <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-white border border-black/[0.06] p-4">
                <Skeleton className="h-12 w-12 rounded-lg mb-3" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sortedCategories.map((category, index) => {
              const { isLocked } = getTeaserLockState(index, isFree, {
                freeVisibleCount: 4,
                strategy: "first-n-items"
              })
              const productCount = category.product_count || 0
              const growth = category.growth_percentage || 0
              const slug = category.slug || category.name.toLowerCase().replace(/\s+/g, '-')

              return (
                <Link
                  key={category.id}
                  href={isLocked ? "#" : `/products/product-hunt?category=${slug}`}
                  onClick={(e) => {
                    if (isLocked) {
                      e.preventDefault()
                      setIsUpsellOpen(true)
                    }
                  }}
                  data-testid={`link-category-${slug}`}
                >
                  <div className="group relative rounded-xl bg-white border border-black/[0.06] p-4 hover:border-black/[0.12] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all cursor-pointer h-full flex flex-col">
                    {isLocked && <LockOverlay onClick={() => setIsUpsellOpen(true)} />}

                    <div className="h-11 w-11 rounded-lg bg-[#F5F5F7] flex items-center justify-center mb-3 overflow-hidden">
                      {category.image ? (
                        <img
                          src={category.thumbnail || category.image}
                          alt=""
                          className="h-full w-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="h-5 w-5 text-[#999]" />
                      )}
                    </div>

                    <h3 className="text-[15px] font-semibold text-black leading-tight mb-1">
                      {category.name}
                    </h3>

                    <p className="text-[12px] text-[#888] leading-[1.4] line-clamp-2 mb-3 flex-1">
                      {category.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-black/[0.04]">
                      <div className="flex items-center gap-3">
                        <span className="text-[12px] text-[#888]">
                          <span className="font-medium text-black">{productCount}</span> products
                        </span>
                        {growth > 0 && (
                          <span className="inline-flex items-center gap-0.5 text-[12px] text-green-600 font-medium">
                            <TrendingUp className="h-3 w-3" />
                            +{growth.toFixed(0)}%
                          </span>
                        )}
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-[#ccc] group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      <UpsellDialog
        isOpen={isUpsellOpen}
        onClose={() => setIsUpsellOpen(false)}
      />
    </>
  )
}

export default function CategoriesPage() {
  return <CategoriesPageContent />
}
