"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Competitor {
  storeName: string
  monthlyRevenue: number
  monthlySales: number
  roi: number
  aliexpressOrders: number
  amazonPrice: number
}

interface CompetitionSectionProps {
  competitor?: Competitor
  productSpecs?: {
    dimensions?: string
    weight?: string
  }
}

const defaultCompetitor: Competitor = {
  storeName: "stylenconsole.com",
  monthlyRevenue: 14472,
  monthlySales: 180,
  roi: 137,
  aliexpressOrders: 2500,
  amazonPrice: 80.40,
}

export function CompetitionSection({ 
  competitor = defaultCompetitor,
  productSpecs
}: CompetitionSectionProps) {
  return (
    <Card className="p-6 min-w-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
        {/* Competitor Info */}
        <div>
          <h4 className="text-sm font-medium mb-3">Competitor</h4>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-md">
              <div className="font-semibold mb-3">{competitor.storeName}</div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Monthly Revenue</div>
                  <div className="font-semibold">${competitor.monthlyRevenue.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Monthly Sales</div>
                  <div className="font-semibold">{competitor.monthlySales}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">ROI</div>
                  <div className="font-semibold text-emerald-600">{competitor.roi}%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">AliExpress Orders</div>
                  <div className="font-semibold">+{competitor.aliexpressOrders.toLocaleString()}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-muted-foreground">Amazon Price</div>
                  <div className="font-semibold">${competitor.amazonPrice.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        <div>
          <h4 className="text-sm font-medium mb-3">Product Specifications</h4>
          <div className="space-y-2">
            {productSpecs?.dimensions && (
              <div className="flex justify-between p-3 bg-muted/50 rounded-md">
                <span className="text-sm text-muted-foreground">Product Dimensions</span>
                <span className="text-sm font-medium">{productSpecs.dimensions}</span>
              </div>
            )}
            {productSpecs?.weight && (
              <div className="flex justify-between p-3 bg-muted/50 rounded-md">
                <span className="text-sm text-muted-foreground">Item Weight</span>
                <span className="text-sm font-medium">{productSpecs.weight}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

