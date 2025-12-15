"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  ShoppingCart, 
  Truck, 
  Package, 
  Calculator,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MapPin
} from "lucide-react"
import GradientButton from "@/components/kokonutui/gradient-button"
import { cn } from "@/lib/utils"

interface FulfillmentSectionProps {
  product?: {
    buy_price?: number
    sell_price?: number
    supplier?: {
      name?: string
      company_name?: string | null
      logo?: string | null
    }
  }
  onImportToShopify?: () => void
}

export function FulfillmentSection({ product, onImportToShopify }: FulfillmentSectionProps) {
  const [quantity, setQuantity] = useState(1)
  const [shippingCountry, setShippingCountry] = useState("US")
  const [calculatedShipping, setCalculatedShipping] = useState(0)

  const buyPrice = product?.buy_price || 15
  const baseShipping = 5.99
  const shippingCost = calculatedShipping || baseShipping
  const totalCost = (buyPrice * quantity) + shippingCost
  const profitPerUnit = (product?.sell_price || 40) - buyPrice - (shippingCost / quantity)

  const shippingOptions = [
    { name: "Standard Shipping", days: "8-10", cost: 5.99 },
    { name: "Express Shipping", days: "5-7", cost: 12.99 },
    { name: "Priority Shipping", days: "3-5", cost: 19.99 },
  ]

  const handleCalculateShipping = () => {
    // Simulate shipping calculation
    const countryMultipliers: Record<string, number> = {
      US: 1,
      UK: 1.5,
      CA: 1.3,
      AU: 1.8,
      DE: 1.4,
      FR: 1.4,
    }
    const multiplier = countryMultipliers[shippingCountry] || 1.5
    setCalculatedShipping(baseShipping * multiplier)
  }

  return (
    <div className="space-y-6 min-w-0">
      {/* Fulfillment by USDrop Card */}
      <Card className="p-6 border-2 border-primary/20 min-w-0">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Fulfillment by USDrop</h3>
              <Badge className="bg-primary/10 text-primary border-primary/20">
                Recommended
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              We handle sourcing, quality control, and shipping directly to your customers.
            </p>
          </div>
          <GradientButton
            variant="purple"
            onClick={onImportToShopify}
            className="shrink-0"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Import to Shopify
          </GradientButton>
        </div>

        {/* Cost Breakdown */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Quantity</Label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Shipping Country</Label>
              <select
                value={shippingCountry}
                onChange={(e) => {
                  setShippingCountry(e.target.value)
                  handleCalculateShipping()
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
              </select>
            </div>
          </div>

          {/* Shipping Options */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Shipping Options</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {shippingOptions.map((option, index) => (
                <Card
                  key={index}
                  className={cn(
                    "p-3 cursor-pointer transition-all border-2",
                    calculatedShipping === option.cost
                      ? "border-primary bg-primary/5"
                      : "border-transparent hover:border-muted-foreground/50"
                  )}
                  onClick={() => setCalculatedShipping(option.cost)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{option.name}</span>
                    {calculatedShipping === option.cost && (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{option.days} days</span>
                    <span className="font-semibold">${option.cost.toFixed(2)}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Cost Summary */}
          <Card className="p-4 bg-muted/50">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Product Cost ({quantity}x)</span>
                <span className="font-medium">${(buyPrice * quantity).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping Cost</span>
                <span className="font-medium">${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Processing Fee</span>
                <span className="font-medium">$1.46</span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="font-semibold">Total Cost</span>
                <span className="text-lg font-bold text-primary">
                  ${(totalCost + 1.46).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calculator className="h-3 w-3" />
                <span>Estimated profit per unit: ${profitPerUnit.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>
      </Card>

      {/* Supplier Information */}
      {product?.supplier && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Supplier Information</h3>
          </div>
          <div className="flex items-start gap-4">
            {product.supplier.logo && (
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                <img
                  src={product.supplier.logo}
                  alt={product.supplier.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 space-y-2">
              <div>
                <h4 className="font-semibold">{product.supplier.name}</h4>
                {product.supplier.company_name && (
                  <p className="text-sm text-muted-foreground">{product.supplier.company_name}</p>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Verified Supplier</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>China</span>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Button variant="outline" size="sm" className="h-8">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Supplier Profile
                </Button>
                <Button variant="outline" size="sm" className="h-8">
                  Compare Suppliers
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Fulfillment Benefits */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <h3 className="font-semibold mb-4">Why Choose USDrop Fulfillment?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
              title: "Quality Guaranteed",
              description: "All products are quality-checked before shipping"
            },
            {
              icon: <Truck className="h-5 w-5 text-primary" />,
              title: "Fast Shipping",
              description: "8-10 day delivery to most countries"
            },
            {
              icon: <Package className="h-5 w-5 text-accent" />,
              title: "Branded Packaging",
              description: "Custom packaging options available"
            },
          ].map((benefit, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">{benefit.icon}</div>
              <div>
                <h4 className="font-medium text-sm mb-1">{benefit.title}</h4>
                <p className="text-xs text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}




