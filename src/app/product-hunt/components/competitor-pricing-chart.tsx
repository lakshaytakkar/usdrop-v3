"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  ReferenceLine,
} from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ArrowDown, ArrowUp, Minus, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

interface Competitor {
  name: string
  price: number
  url?: string
}

interface CompetitorPricingChartProps {
  productPrice?: number
  competitors?: Competitor[]
  priceRange?: {
    min: number
    max: number
    avg: number
  }
}

const generateSampleData = (productPrice: number = 29.99) => ({
  competitors: [
    { name: "AliDirect", price: Math.round(productPrice * 0.82 * 100) / 100 },
    { name: "DropStore", price: Math.round(productPrice * 0.91 * 100) / 100 },
    { name: "ShopHub", price: Math.round(productPrice * 1.05 * 100) / 100 },
    { name: "TrendMart", price: Math.round(productPrice * 1.14 * 100) / 100 },
    { name: "GlobalShip", price: Math.round(productPrice * 0.97 * 100) / 100 },
  ],
  priceRange: {
    min: Math.round(productPrice * 0.82 * 100) / 100,
    max: Math.round(productPrice * 1.14 * 100) / 100,
    avg: Math.round(productPrice * 0.98 * 100) / 100,
  },
})

export function CompetitorPricingChart({
  productPrice = 29.99,
  competitors,
  priceRange,
}: CompetitorPricingChartProps) {
  const data = competitors && competitors.length > 0
    ? { competitors, priceRange: priceRange || { min: 0, max: 0, avg: 0 } }
    : generateSampleData(productPrice)

  const chartData = [
    ...data.competitors.map((c) => ({
      name: c.name.length > 10 ? c.name.substring(0, 9) + "…" : c.name,
      price: c.price,
      isYours: false,
    })),
    { name: "Your Price", price: productPrice, isYours: true },
  ].sort((a, b) => a.price - b.price)

  const chartConfig = {
    price: { label: "Price", color: "hsl(var(--muted-foreground))" },
  } satisfies ChartConfig

  const computedAvg = chartData.reduce((s, d) => s + d.price, 0) / (chartData.length || 1)
  const avgPrice = data.priceRange.avg > 0 ? data.priceRange.avg : (computedAvg > 0 ? computedAvg : productPrice)
  const priceDiff = avgPrice > 0 ? ((productPrice - avgPrice) / avgPrice) * 100 : 0
  const isBelow = priceDiff < -2
  const isAbove = priceDiff > 2
  const cheaperCount = data.competitors.filter((c) => c.price > productPrice).length
  const totalCompetitors = data.competitors.length

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Competitor Pricing</h3>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "text-xs gap-1",
            isBelow ? "text-emerald-600 border-emerald-200" : isAbove ? "text-amber-600 border-amber-200" : "text-muted-foreground"
          )}
        >
          {isBelow ? <ArrowDown className="h-3 w-3" /> : isAbove ? <ArrowUp className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
          {Math.abs(priceDiff).toFixed(1)}% {isBelow ? "below" : isAbove ? "above" : "at"} avg
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Cheaper than {cheaperCount} of {totalCompetitors} competitors · Range ${data.priceRange.min.toFixed(2)}–${data.priceRange.max.toFixed(2)}
      </p>

      <ChartContainer config={chartConfig} className="h-[220px] w-full">
        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-muted/50" />
          <YAxis
            dataKey="name"
            type="category"
            tickLine={false}
            axisLine={false}
            width={75}
            className="text-xs"
          />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${v}`}
            className="text-xs"
          />
          <ChartTooltip
            content={<ChartTooltipContent />}
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
          />
          <ReferenceLine x={avgPrice} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" strokeOpacity={0.5} />
          <Bar dataKey="price" radius={[0, 6, 6, 0]} barSize={20}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.isYours ? "hsl(221.2 83.2% 53.3%)" : "hsl(var(--muted-foreground)/0.2)"}
                stroke={entry.isYours ? "hsl(221.2 83.2% 53.3%)" : "transparent"}
                strokeWidth={entry.isYours ? 2 : 0}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>

      <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Lowest</p>
          <p className="text-sm font-semibold">${data.priceRange.min.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Average</p>
          <p className="text-sm font-semibold">${avgPrice.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Highest</p>
          <p className="text-sm font-semibold">${data.priceRange.max.toFixed(2)}</p>
        </div>
      </div>
    </Card>
  )
}
