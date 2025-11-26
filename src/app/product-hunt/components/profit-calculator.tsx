"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, RotateCcw as RotateCcwIcon } from "lucide-react"
import { Slider } from "@/components/ui/slider"

interface ProfitCalculatorProps {
  buyPrice: number
  sellPrice: number
  fulfillment?: {
    productCost: number
    shippingCost: number
    totalPrice: number
  }
}

export function ProfitCalculator({ buyPrice, sellPrice, fulfillment }: ProfitCalculatorProps) {
  const [sellingPrice, setSellingPrice] = useState(sellPrice)
  const [numberOfSales, setNumberOfSales] = useState(30426)

  const productCost = fulfillment?.productCost || buyPrice
  const shippingCost = fulfillment?.shippingCost || 0
  const otherFees = 1.46
  const adSpend = 0

  const totalCost = productCost + shippingCost + otherFees + adSpend
  const netProfitPerSale = sellingPrice - totalCost
  const potentialProfit = netProfitPerSale * numberOfSales
  const profitMargin = sellingPrice > 0 ? ((netProfitPerSale / sellingPrice) * 100) : 0
  const pcRatio = productCost > 0 ? (sellingPrice / productCost) : 0
  const breakEvenROAS = sellingPrice > 0 ? (totalCost / sellingPrice) : 0

  const handleReset = () => {
    setSellingPrice(sellPrice)
    setNumberOfSales(30426)
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Estimated Profit Calculator</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Inputs */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Selling Price</label>
              <span className="text-sm font-semibold">${sellingPrice.toFixed(2)}</span>
            </div>
            <Slider
              value={[sellingPrice]}
              onValueChange={(value) => setSellingPrice(value[0])}
              min={0}
              max={500}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Number of Sales</label>
              <span className="text-sm font-semibold">{numberOfSales.toLocaleString()}</span>
            </div>
            <Slider
              value={[numberOfSales]}
              onValueChange={(value) => setNumberOfSales(value[0])}
              min={0}
              max={100000}
              step={100}
              className="w-full"
            />
          </div>

          <Button variant="outline" size="sm" onClick={handleReset} className="w-full">
            <RotateCcwIcon className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Right: Results */}
        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Net Profit per Sale</span>
              <span className="text-lg font-bold text-emerald-600">
                ${netProfitPerSale.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Potential Profit</span>
              <span className="text-xl font-bold text-emerald-600">
                ${potentialProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <h4 className="font-medium mb-2">Cost Breakdown</h4>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Product Cost:</span>
              <span>${productCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping Cost:</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Est. Other Fees:</span>
              <span>${otherFees.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ad Spend (AS):</span>
              <span>${adSpend.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t">
            <div>
              <div className="text-xs text-muted-foreground">Profit Margin</div>
              <div className="text-sm font-semibold">{profitMargin.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">P/C Ratio</div>
              <div className="text-sm font-semibold">{pcRatio.toFixed(2)}X</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Break-Even ROAS</div>
              <div className="text-sm font-semibold">{breakEvenROAS.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Target ROAS</div>
              <div className="text-sm font-semibold">-</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

