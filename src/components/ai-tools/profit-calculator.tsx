"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator, DollarSign, Percent, Truck, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

export function ProfitCalculator() {
  const [cost, setCost] = useState("")
  const [price, setPrice] = useState("")
  const [shipping, setShipping] = useState("")
  const [fee, setFee] = useState("")

  const calculateProfit = () => {
    const costNum = parseFloat(cost) || 0
    const priceNum = parseFloat(price) || 0
    const shippingNum = parseFloat(shipping) || 0
    const feePercent = parseFloat(fee) || 0

    const grossProfit = priceNum - costNum - shippingNum
    const platformFee = (priceNum * feePercent) / 100
    const netProfit = grossProfit - platformFee
    const margin = priceNum > 0 ? ((netProfit / priceNum) * 100) : 0

    return {
      grossProfit: grossProfit.toFixed(2),
      netProfit: netProfit.toFixed(2),
      margin: margin.toFixed(1),
      platformFee: platformFee.toFixed(2)
    }
  }

  const profit = calculateProfit()
  const hasValues = cost || price || shipping || fee

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Card className="bg-card border-border transition-all duration-200 ease-in-out hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calculator className="h-5 w-5 text-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Profit Calculator</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="cost" className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-foreground" />
                  Product Cost ($)
                </Label>
                <Input
                  id="cost"
                  type="number"
                  placeholder="0.00"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="w-full bg-background border-border text-foreground focus-visible:border-ring"
                />
              </div>

              <div>
                <Label htmlFor="price" className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-foreground" />
                  Selling Price ($)
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-background border-border text-foreground focus-visible:border-ring"
                />
              </div>

              <div>
                <Label htmlFor="shipping" className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-foreground" />
                  Shipping Cost ($)
                </Label>
                <Input
                  id="shipping"
                  type="number"
                  placeholder="0.00"
                  value={shipping}
                  onChange={(e) => setShipping(e.target.value)}
                  className="w-full bg-background border-border text-foreground focus-visible:border-ring"
                />
              </div>

              <div>
                <Label htmlFor="fee" className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Percent className="h-4 w-4 text-foreground" />
                  Platform Fee (%)
                </Label>
                <Input
                  id="fee"
                  type="number"
                  placeholder="0"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  className="w-full bg-background border-border text-foreground focus-visible:border-ring"
                />
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-foreground" />
                <h4 className="text-sm font-semibold text-foreground">Profit Analysis</h4>
              </div>

              <div className={cn(
                "p-4 rounded-lg border transition-all duration-200",
                hasValues 
                  ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900" 
                  : "bg-muted/50 border-border"
              )}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Gross Profit:</span>
                    <span className={cn(
                      "text-base font-semibold",
                      hasValues ? "text-emerald-700 dark:text-emerald-400" : "text-foreground"
                    )}>
                      ${profit.grossProfit}
                    </span>
                  </div>

                  {parseFloat(fee) > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Platform Fee:</span>
                      <span className="text-sm font-medium text-foreground">
                        ${profit.platformFee}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground">Net Profit:</span>
                      <span className={cn(
                        "text-xl font-bold",
                        hasValues ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
                      )}>
                        ${profit.netProfit}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Profit Margin:</span>
                      <span className={cn(
                        "text-lg font-semibold",
                        hasValues ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
                      )}>
                        {profit.margin}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Metrics */}
              {hasValues && (
                <div className="pt-4 border-t border-border">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-md bg-muted/30 border border-border">
                      <div className="text-xs text-muted-foreground mb-1">ROI</div>
                      <div className="text-sm font-semibold text-foreground">
                        {parseFloat(cost) > 0 
                          ? (((parseFloat(profit.netProfit) / parseFloat(cost)) * 100).toFixed(1))
                          : "0.0"
                        }%
                      </div>
                    </div>
                    <div className="p-3 rounded-md bg-muted/30 border border-border">
                      <div className="text-xs text-muted-foreground mb-1">Markup</div>
                      <div className="text-sm font-semibold text-foreground">
                        {parseFloat(cost) > 0
                          ? ((parseFloat(price) / parseFloat(cost)).toFixed(2))
                          : "0.00"
                        }x
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}









