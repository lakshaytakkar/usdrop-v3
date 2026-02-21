
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, Package, Clock, DollarSign } from "lucide-react"

interface FulfillmentCardProps {
  fulfillment: {
    total_price?: number | string | null
    product_cost?: number | string | null
    shipping_cost?: number | string | null
    shipping_days?: string | null
  }
  demandSaturation?: {
    stores_selling_count?: number | null
    saturation_level?: string | null
    monthly_searches?: number | null
    competition_score?: number | null
  } | null
}

function safeNum(val: number | string | null | undefined): number | null {
  if (val === null || val === undefined) return null
  if (typeof val === "number") return isNaN(val) ? null : val
  const parsed = parseFloat(String(val).replace(/[^0-9.-]/g, ""))
  return isNaN(parsed) ? null : parsed
}

function formatPrice(val: number | string | null | undefined): string {
  const n = safeNum(val)
  return n !== null ? `$${n.toFixed(2)}` : "N/A"
}

export function FulfillmentCard({ fulfillment, demandSaturation }: FulfillmentCardProps) {
  const productCost = safeNum(fulfillment.product_cost)
  const shippingCost = safeNum(fulfillment.shipping_cost)
  const totalPrice = safeNum(fulfillment.total_price)
  const shippingDays = fulfillment.shipping_days || "N/A"

  if (productCost === null && shippingCost === null && totalPrice === null && shippingDays === "N/A") {
    return null
  }

  const storesCount = safeNum(demandSaturation?.stores_selling_count)
  const saturationLevel = storesCount !== null
    ? storesCount === 0
      ? "Low"
      : storesCount <= 5
        ? "Medium"
        : "High"
    : demandSaturation?.saturation_level || null

  const saturationColor = saturationLevel === "Low"
    ? "text-emerald-600 border-emerald-200 bg-emerald-50"
    : saturationLevel === "Medium"
      ? "text-amber-600 border-amber-200 bg-amber-50"
      : saturationLevel === "High"
        ? "text-red-600 border-red-200 bg-red-50"
        : ""

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
      <Card className="p-4 lg:h-full">
        <div className="flex items-center gap-2 mb-3">
          <Truck className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Fulfillment & Shipping</h3>
        </div>

        <div className="space-y-3">
          {productCost !== null && (
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-2">
                <Package className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Product Cost</span>
              </div>
              <span className="text-sm font-semibold">{formatPrice(productCost)}</span>
            </div>
          )}

          {shippingCost !== null && (
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-2">
                <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Shipping Cost</span>
              </div>
              <span className="text-sm font-semibold">{formatPrice(shippingCost)}</span>
            </div>
          )}

          {shippingDays !== "N/A" && (
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Delivery Time</span>
              </div>
              <span className="text-sm font-semibold">{shippingDays}</span>
            </div>
          )}

          {totalPrice !== null && (
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm font-medium">Total Landed Cost</span>
              </div>
              <span className="text-sm font-bold text-primary">{formatPrice(totalPrice)}</span>
            </div>
          )}
        </div>
      </Card>

      {demandSaturation && storesCount !== null && (
        <Card className="p-4 lg:h-full">
          <div className="flex items-center gap-2 mb-3">
            <Package className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Market Saturation</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Stores Selling</span>
              <span className="text-sm font-semibold">{storesCount}</span>
            </div>

            {saturationLevel && (
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Competition Level</span>
                <Badge variant="outline" className={saturationColor}>
                  {saturationLevel}
                </Badge>
              </div>
            )}

            {demandSaturation.monthly_searches !== undefined && demandSaturation.monthly_searches !== null && demandSaturation.monthly_searches > 0 && (
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Monthly Searches</span>
                <span className="text-sm font-semibold">{demandSaturation.monthly_searches.toLocaleString()}</span>
              </div>
            )}

            {demandSaturation.competition_score !== undefined && demandSaturation.competition_score !== null && demandSaturation.competition_score > 0 && (
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Competition Score</span>
                <span className="text-sm font-semibold">{demandSaturation.competition_score}/100</span>
              </div>
            )}

            {storesCount === 0 && (
              <p className="text-xs text-muted-foreground">
                No other stores detected selling this product — low competition opportunity.
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
