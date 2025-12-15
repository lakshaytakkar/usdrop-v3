"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calculator, RotateCcw as RotateCcwIcon, TrendingUp, Download, Share2 } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  XAxis, 
  YAxis,
  ResponsiveContainer,
  Cell
} from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

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
  const [adSpend, setAdSpend] = useState(0)

  const productCost = fulfillment?.productCost || buyPrice
  const shippingCost = fulfillment?.shippingCost || 0
  const otherFees = 1.46

  const totalCost = productCost + shippingCost + otherFees + adSpend
  const netProfitPerSale = sellingPrice - totalCost
  const potentialProfit = netProfitPerSale * numberOfSales
  const profitMargin = sellingPrice > 0 ? ((netProfitPerSale / sellingPrice) * 100) : 0
  const pcRatio = productCost > 0 ? (sellingPrice / productCost) : 0
  const breakEvenROAS = sellingPrice > 0 ? (totalCost / sellingPrice) : 0
  const targetROAS = 3.0

  // Chart data for profit breakdown
  const profitChartData = useMemo(() => [
    { name: 'Cost', value: totalCost, type: 'cost' },
    { name: 'Profit', value: Math.max(0, netProfitPerSale), type: 'profit' },
  ], [totalCost, netProfitPerSale])

  // Sales projection data
  const salesProjectionData = useMemo(() => {
    const projections = []
    for (let i = 0; i <= 12; i++) {
      const sales = Math.floor((numberOfSales / 12) * i)
      projections.push({
        month: i,
        revenue: sales * sellingPrice,
        profit: sales * netProfitPerSale,
      })
    }
    return projections
  }, [numberOfSales, sellingPrice, netProfitPerSale])

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-1))",
    },
    profit: {
      label: "Profit",
      color: "hsl(var(--chart-2))",
    },
    cost: {
      label: "Cost",
      color: "hsl(var(--chart-4))",
    },
  } satisfies ChartConfig

  const handleReset = () => {
    setSellingPrice(sellPrice)
    setNumberOfSales(30426)
    setAdSpend(0)
  }

  const handleExport = () => {
    const data = {
      sellingPrice,
      numberOfSales,
      netProfitPerSale,
      potentialProfit,
      profitMargin,
      pcRatio,
      breakEvenROAS,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'profit-calculation.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const costBreakdown = [
    { label: 'Product Cost', value: productCost, color: 'hsl(var(--chart-4))' },
    { label: 'Shipping', value: shippingCost, color: 'hsl(var(--chart-5))' },
    { label: 'Fees', value: otherFees, color: 'hsl(var(--chart-3))' },
    { label: 'Ad Spend', value: adSpend, color: 'hsl(var(--chart-1))' },
  ]

  const totalCostValue = costBreakdown.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="p-6 min-w-0">
      <div className="flex items-center justify-end mb-8">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} className="h-8">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset} className="h-8">
            <RotateCcwIcon className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-w-0 w-full">
        {/* Left: Inputs */}
        <div className="space-y-6 min-w-0">
          <div>
            <div className="flex justify-between mb-2">
              <Label className="text-sm font-medium">Selling Price</Label>
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
            <div className="flex gap-2 mt-2">
              <Input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                className="h-8 text-sm"
                min={0}
                max={500}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <Label className="text-sm font-medium">Number of Sales</Label>
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
            <Input
              type="number"
              value={numberOfSales}
              onChange={(e) => setNumberOfSales(Math.max(0, parseInt(e.target.value) || 0))}
              className="h-8 text-sm mt-2"
              min={0}
              max={100000}
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <Label className="text-sm font-medium">Ad Spend per Sale</Label>
              <span className="text-sm font-semibold">${adSpend.toFixed(2)}</span>
            </div>
            <Slider
              value={[adSpend]}
              onValueChange={(value) => setAdSpend(value[0])}
              min={0}
              max={50}
              step={0.5}
              className="w-full"
            />
            <Input
              type="number"
              value={adSpend}
              onChange={(e) => setAdSpend(Math.max(0, parseFloat(e.target.value) || 0))}
              className="h-8 text-sm mt-2"
              min={0}
              max={50}
              step={0.5}
            />
          </div>

          {/* Cost Breakdown Visual */}
          <div className="space-y-3 pt-4 border-t">
            <h4 className="text-sm font-medium">Cost Breakdown</h4>
            {costBreakdown.map((item, index) => {
              const percentage = totalCostValue > 0 ? (item.value / totalCostValue) * 100 : 0
              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium">${item.value.toFixed(2)}</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: Results & Charts */}
        <div className="space-y-6 min-w-0">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-5 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
              <div className="text-xs text-muted-foreground mb-2">Net Profit/Sale</div>
              <div className="text-2xl font-bold text-emerald-600">
                ${netProfitPerSale.toFixed(2)}
              </div>
            </Card>
            <Card className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <div className="text-xs text-muted-foreground mb-2">Potential Profit</div>
              <div className="text-xl font-bold text-primary">
                ${potentialProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
            </Card>
          </div>

          {/* Profit Breakdown Chart */}
          <Card className="p-5 bg-muted/30">
            <h4 className="text-sm font-semibold mb-5">Profit vs Cost</h4>
            <ChartContainer config={chartConfig} className="h-[180px] w-full">
              <BarChart data={profitChartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                <XAxis 
                  dataKey="name" 
                  tickLine={false} 
                  axisLine={false}
                  className="text-xs text-muted-foreground"
                  tickMargin={8}
                />
                <YAxis hide />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, ""]}
                />
                <Bar 
                  dataKey="value" 
                  radius={[8, 8, 0, 0]}
                >
                  {profitChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.type === 'profit' ? 'var(--color-profit)' : 'var(--color-cost)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </Card>

          {/* Sales Projection Chart */}
          <Card className="p-5 bg-muted/30">
            <h4 className="text-sm font-semibold mb-5 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Sales Projection (12 months)
            </h4>
            <ChartContainer config={chartConfig} className="h-[180px] w-full">
              <BarChart data={salesProjectionData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                <XAxis 
                  dataKey="month" 
                  tickLine={false} 
                  axisLine={false}
                  className="text-xs text-muted-foreground"
                  tickMargin={8}
                  tickFormatter={(value) => `M${value}`}
                  interval={Math.max(0, Math.floor(salesProjectionData.length / 6) - 1)}
                />
                <YAxis hide />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [`$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, "Profit"]}
                />
                <Bar 
                  dataKey="profit" 
                  radius={[6, 6, 0, 0]}
                  fill="var(--color-profit)"
                />
              </BarChart>
            </ChartContainer>
          </Card>

          {/* Key Ratios */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t">
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="text-xs text-muted-foreground mb-2">Profit Margin</div>
              <div className={cn(
                "text-xl font-bold",
                profitMargin > 50 ? "text-emerald-600" : profitMargin > 30 ? "text-yellow-600" : "text-red-600"
              )}>
                {profitMargin.toFixed(1)}%
              </div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="text-xs text-muted-foreground mb-2">P/C Ratio</div>
              <div className="text-xl font-bold">{pcRatio.toFixed(2)}X</div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="text-xs text-muted-foreground mb-2">Break-Even ROAS</div>
              <div className="text-xl font-bold">{breakEvenROAS.toFixed(2)}</div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="text-xs text-muted-foreground mb-2">Target ROAS</div>
              <div className="text-xl font-bold">{targetROAS.toFixed(1)}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

