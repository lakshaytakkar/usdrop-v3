

import { apiFetch } from '@/lib/supabase'
import { useState } from "react"
import { useRouter } from "@/hooks/use-router"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Star, 
  Eye,
  Flame,
  Lock,
  Bookmark,
  Check,
} from "lucide-react"
import { ButtonSpinner } from "@/components/ui/blue-spinner"
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts"
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps {
  product: {
    id: number | string
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
  isLocked?: boolean
  onLockedClick?: () => void
  isSaved?: boolean
}

export function ProductCard({ product, isLocked = false, onLockedClick, isSaved: initialSaved = false }: ProductCardProps) {
  const router = useRouter()
  const [imageError, setImageError] = useState(false)
  const [isSaved, setIsSaved] = useState(initialSaved)
  const [isSaving, setIsSaving] = useState(false)
  const { showSuccess, showError } = useToast()

  const handleSaveProduct = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isSaved || isSaving || isLocked) return

    setIsSaving(true)
    try {
      const response = await apiFetch("/api/picklist", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, source: 'product-hunt' }),
      })

      if (!response.ok) {
        if (response.status === 409) {
          setIsSaved(true)
          return
        }
        if (response.status === 401) {
          showError('Please sign in to save products')
          return
        }
        const data = await response.json()
        showError(data.error || 'Failed to save product')
        return
      }

      setIsSaved(true)
      showSuccess('Product saved')
      window.dispatchEvent(new CustomEvent("picklist-updated"))
    } catch {
      showError('Failed to save product')
    } finally {
      setIsSaving(false)
    }
  }

  const safeTrendData = Array.isArray(product.trendData) ? product.trendData : []

  const profitMargin = product.sellPrice > 0 
    ? ((product.profitPerOrder / product.sellPrice) * 100).toFixed(1)
    : "0.0"

  const trendDirection = safeTrendData.length >= 2
    ? safeTrendData[safeTrendData.length - 1] > safeTrendData[0] ? "up" : "down"
    : "neutral"

  const isTrending = product.trending

  return (
    <Card className="group overflow-hidden border-border/50 p-0">
      {/* Image Section */}
      <div 
        className="relative aspect-square overflow-hidden bg-muted cursor-pointer"
        onClick={() => {
          // Navigate to product details page
          window.location.href = `/product-hunt/${product.id}`
        }}
      >
        {imageError ? (
          <div className="h-full w-full flex items-center justify-center bg-muted">
            <img
              src="/demo-products/product-1.png"
              alt="Placeholder"
              width={300}
              height={300}
              className="object-cover opacity-30"
            />
          </div>
        ) : (
          <img
            src={product.image || "/demo-products/product-1.png"}
            alt={product.title}
            decoding="async"
            className={`w-full h-full object-cover transition-all duration-300 ${isLocked ? "blur-md" : ""}`}
            onError={() => setImageError(true)}
          />
        )}
        
        {isTrending && (
          <div className="absolute top-2 left-2 z-20">
            <div className="bg-orange-500/90 text-white border-0 text-xs px-2 py-1.5 rounded-md shadow-sm">
              <span className="inline-flex items-center gap-1 whitespace-nowrap">
                <Flame className="h-3 w-3" />
                <span>Trending</span>
              </span>
            </div>
          </div>
        )}

        <div className="absolute top-2 right-2 z-20">
          <div className="w-7 h-7 rounded-full bg-white/90 shadow-sm backdrop-blur-sm flex items-center justify-center overflow-hidden">
            <img
              src="/images/ui/united-states.png"
              alt="US"
              width={20}
              height={20}
              className="object-cover w-5 h-5 rounded-full"
            />
          </div>
        </div>

        {/* View Details Overlay on hover - Only show when not locked */}
        {!isLocked && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 z-30">
            <div className="flex items-center gap-2 text-white font-medium">
              <span className="font-mono uppercase tracking-wider">VIEW DETAILS</span>
              <Eye className="h-5 w-5" />
            </div>
          </div>
        )}
        
        {/* Locked Overlay - Only on Image */}
        {isLocked && (
          <div 
            className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80 z-20 flex items-center justify-center cursor-pointer transition-all duration-300 hover:from-black/50 hover:via-black/70 hover:to-black/90 group/lock"
            onClick={(e) => {
              e.stopPropagation()
              onLockedClick?.()
            }}
          >
            <div className="text-center space-y-3 transform transition-all duration-300 group-hover/lock:scale-105">
              {/* Enhanced Lock Icon */}
              <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl border-4 border-white/20 backdrop-blur-sm relative overflow-hidden">
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover/lock:translate-x-full transition-transform duration-700" />
                <Lock className="h-9 w-9 text-white relative z-10 drop-shadow-lg" strokeWidth={2.5} />
              </div>
              
              {/* Text */}
              <div className="space-y-1">
                <p className="text-white text-base font-bold drop-shadow-lg">Premium Content</p>
                <p className="text-white/90 text-sm font-medium drop-shadow">Click to Upgrade</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className={`px-2.5 pt-1 pb-2.5 space-y-2 relative ${isLocked ? "pointer-events-none" : ""}`}>
        <h3 className="ds-card-title line-clamp-2 min-h-[2.5rem] leading-tight">
          {product.title}
        </h3>
        <p className="text-[11px] text-muted-foreground capitalize -mt-1">{product.category || 'Uncategorized'}</p>

        {/* Mini Area Chart */}
        <div style={{ width: '100%', height: 52 }}>
          <ResponsiveContainer width="100%" height={52}>
            <AreaChart
              data={safeTrendData.map((value, i) => ({ i, v: value }))}
              margin={{ top: 4, right: 4, bottom: 4, left: 4 }}
            >
              <defs>
                <linearGradient id={`grad-${product.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={trendDirection === "up" ? "#22c55e" : "#ef4444"} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={trendDirection === "up" ? "#22c55e" : "#ef4444"} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8, padding: '4px 8px', border: '1px solid #e5e7eb' }}
                formatter={(value: number) => [`${value} orders`, '']}
                labelFormatter={() => ''}
              />
              <Area
                dataKey="v"
                type="monotone"
                fill={`url(#grad-${product.id})`}
                fillOpacity={1}
                stroke={trendDirection === "up" ? "#22c55e" : "#ef4444"}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-0.5">
            <p className="ds-overline">Buy Price</p>
            <p className="text-sm font-semibold text-foreground">${product.buyPrice.toFixed(2)}</p>
          </div>
          <div className="space-y-0.5">
            <p className="ds-overline">Sell Price</p>
            <p className="text-sm font-semibold text-primary">${product.sellPrice.toFixed(2)}</p>
          </div>
        </div>

        {/* Profit Section */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="space-y-0.5">
            <p className="ds-overline">Profit/Order</p>
            <p className="font-bold text-emerald-600 text-base">
              ${product.profitPerOrder.toFixed(2)}
            </p>
          </div>
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            {profitMargin}% margin
          </Badge>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="font-medium text-foreground">{product.rating}</span>
          <span>({product.reviews})</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          <Button
            variant="default"
            className="flex-1 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/product-hunt/${product.id}`)
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button
            variant={isSaved ? "default" : "outline"}
            size="icon"
            className={`h-9 w-9 shrink-0 cursor-pointer ${isSaved ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`}
            onClick={handleSaveProduct}
            disabled={isSaved || isSaving}
            title={isSaved ? "Saved" : "Save to My Products"}
          >
            {isSaving ? (
              <ButtonSpinner />
            ) : isSaved ? (
              <Check className="h-4 w-4" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Skeleton Overlay for Locked State */}
        {isLocked && (
          <div className="absolute inset-0 bg-background z-10 rounded-b-lg">
            <div className="p-2.5 space-y-2">
              {/* Title skeleton */}
              <div className="space-y-1.5 animate-pulse">
                <div className="h-3 bg-muted/80 rounded-md w-3/4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </div>
                <div className="h-3 bg-muted/80 rounded-md w-1/2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
              
              {/* Chart skeleton */}
              <div className="h-12 bg-muted/80 rounded-lg animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
              </div>
              
              {/* Pricing skeleton */}
              <div className="grid grid-cols-2 gap-2 animate-pulse">
                <div className="space-y-1">
                  <div className="h-2 bg-muted/80 rounded w-2/3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                  <div className="h-3 bg-muted/80 rounded-md w-1/2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="h-2 bg-muted/80 rounded w-2/3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                  <div className="h-3 bg-muted/80 rounded-md w-1/2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
              </div>
              
              {/* Profit skeleton */}
              <div className="flex items-center justify-between pt-2 border-t border-border/50 animate-pulse">
                <div className="space-y-1">
                  <div className="h-2 bg-muted/80 rounded w-16 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                  <div className="h-4 bg-muted/80 rounded-md w-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
                <div className="h-6 bg-muted/80 rounded-md w-20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
              
              {/* Rating skeleton */}
              <div className="flex items-center gap-1.5 animate-pulse">
                <div className="h-3 w-3 bg-muted/80 rounded relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </div>
                <div className="h-3 bg-muted/80 rounded w-16 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
              
              {/* Buttons skeleton */}
              <div className="flex gap-2 pt-1 animate-pulse">
                <div className="h-8 bg-muted/80 rounded-md flex-1 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </div>
                <div className="h-8 bg-muted/80 rounded-md flex-1 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

