"use client"

import { Card } from "@/components/ui/card"
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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

// Generate sample data if not provided
const generateSampleData = (productPrice: number = 29.99) => {
  return {
    competitors: [
      { name: "Competitor A", price: productPrice * 0.9 },
      { name: "Competitor B", price: productPrice * 1.1 },
      { name: "Competitor C", price: productPrice * 0.95 },
      { name: "Competitor D", price: productPrice * 1.05 },
    ],
    priceRange: {
      min: productPrice * 0.85,
      max: productPrice * 1.15,
      avg: productPrice * 1.0,
    }
  }
}

export function CompetitorPricingChart({ 
  productPrice = 29.99,
  competitors,
  priceRange
}: CompetitorPricingChartProps) {
  const data = competitors && competitors.length > 0 
    ? { competitors, priceRange: priceRange || { min: 0, max: 0, avg: 0 } }
    : generateSampleData(productPrice)

  // Prepare chart data
  const chartData = [
    ...data.competitors.map(c => ({
      name: c.name.length > 12 ? c.name.substring(0, 10) + "..." : c.name,
      price: c.price,
      isProduct: false,
    })),
    {
      name: "This Product",
      price: productPrice,
      isProduct: true,
    }
  ].sort((a, b) => a.price - b.price)

  const chartConfig = {
    price: {
      label: "Price",
      color: "hsl(var(--chart-1))",
    },
    product: {
      label: "Your Product",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig

  const priceComparison = productPrice < data.priceRange.avg ? "lower" : productPrice > data.priceRange.avg ? "higher" : "similar"

  return (
    <Card className="p-6 min-w-0">
      <div className="space-y-6">
        {/* Header with price range info */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Competitor Pricing Analysis</h4>
          {data.priceRange && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Range: ${data.priceRange.min.toFixed(2)} - ${data.priceRange.max.toFixed(2)}</span>
              <span>Avg: ${data.priceRange.avg.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Chart */}
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              className="text-xs text-muted-foreground"
              tickMargin={8}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              className="text-xs text-muted-foreground"
              tickMargin={8}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
            />
            <Bar
              dataKey="price"
              radius={[8, 8, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isProduct ? "var(--color-product)" : "var(--color-price)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>

        {/* Price comparison badge */}
        <div className="flex items-center justify-center gap-2">
          <Badge variant="outline" className="gap-1.5">
            {priceComparison === "lower" && <TrendingDown className="h-3 w-3 text-emerald-600" />}
            {priceComparison === "higher" && <TrendingUp className="h-3 w-3 text-orange-600" />}
            {priceComparison === "similar" && <Minus className="h-3 w-3 text-muted-foreground" />}
            <span className="text-xs">
              Your price is {priceComparison} than average
            </span>
          </Badge>
        </div>
      </div>
    </Card>
  )
}

