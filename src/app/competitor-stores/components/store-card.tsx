"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  DollarSign,
  Users,
  Package,
  Star,
  CheckCircle2,
  ExternalLink,
  BarChart3
} from "lucide-react"
// Using local interface matching the UI format
interface CompetitorStore {
  id: number | string
  name: string
  url: string
  logo?: string
  category: string
  monthlyRevenue: number
  monthlyTraffic: number
  growth: number
  country: string
  products: number
  rating: number
  verified: boolean
}

interface StoreCardProps {
  store: CompetitorStore
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(num)
}

export function StoreCard({ store }: StoreCardProps) {
  return (
    <Card className="group overflow-hidden p-5">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="relative h-12 w-12 flex-shrink-0 border-2 border-border rounded-full overflow-hidden bg-background">
          <Image
            src="/shopify_glyph.svg"
            alt="Shopify"
            fill
            sizes="48px"
            className="object-contain p-2"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-base truncate">{store.name}</h3>
            {store.verified && (
              <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
            <ExternalLink className="h-3 w-3" />
            {store.url}
          </p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="secondary" className="text-xs">
          {store.category}
        </Badge>
        <Badge variant="outline" className="text-xs">
          {store.country}
        </Badge>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <DollarSign className="h-3 w-3" />
            <span>Monthly Revenue</span>
          </div>
          <p className="text-lg font-bold text-emerald-600">
            {formatCurrency(store.monthlyRevenue)}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>Monthly Traffic</span>
          </div>
          <p className="text-lg font-bold">
            {formatNumber(store.monthlyTraffic)}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            <span>Growth</span>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-base font-semibold text-emerald-600">
              +{store.growth.toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Package className="h-3 w-3" />
            <span>Products</span>
          </div>
          <p className="text-base font-semibold">
            {formatNumber(store.products)}
          </p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1.5 mb-4">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-semibold">{store.rating}</span>
        <span className="text-sm text-muted-foreground">rating</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 h-9 text-xs"
        >
          <BarChart3 className="h-3.5 w-3.5 mr-1" />
          Research
        </Button>
        <Button 
          size="sm" 
          className="flex-1 h-9 text-xs"
        >
          <ExternalLink className="h-3.5 w-3.5 mr-1" />
          View Details
        </Button>
      </div>
    </Card>
  )
}

