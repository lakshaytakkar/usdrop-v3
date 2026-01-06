"use client"

import { Card } from "@/components/ui/card"
import { 
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { TrendingUp } from "lucide-react"

interface MarketTrendChartProps {
  data?: Array<{ month: string; value: number; demand?: number }>
  seasonalDemand?: string
}

// Generate sample data if not provided
const generateSampleData = () => {
  const months = []
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - 11) // Last 12 months
  
  for (let i = 0; i < 12; i++) {
    const date = new Date(startDate)
    date.setMonth(date.getMonth() + i)
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    
    // Simulate seasonal trends
    const baseValue = 50
    const seasonalFactor = Math.sin((i / 12) * Math.PI * 2) * 20
    const randomVariation = (Math.random() - 0.5) * 10
    
    months.push({
      month: monthName,
      value: Math.max(20, baseValue + seasonalFactor + randomVariation),
      demand: Math.max(20, baseValue + seasonalFactor + randomVariation + 5),
    })
  }
  
  return months
}

export function MarketTrendChart({ data, seasonalDemand }: MarketTrendChartProps) {
  const chartData = data && data.length > 0 ? data : generateSampleData()

  const chartConfig = {
    value: {
      label: "Interest",
      color: "hsl(var(--chart-1))",
    },
    demand: {
      label: "Demand",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig

  // Calculate trend
  const firstValue = chartData[0]?.value || 0
  const lastValue = chartData[chartData.length - 1]?.value || 0
  const trend = lastValue > firstValue ? "up" : lastValue < firstValue ? "down" : "stable"
  const trendPercentage = firstValue > 0 
    ? Math.abs(((lastValue - firstValue) / firstValue) * 100).toFixed(1)
    : "0"

  return (
    <Card className="p-6 min-w-0">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Market Trend Analysis</h4>
            <div className="flex items-center gap-1.5 text-xs">
              {trend === "up" && <TrendingUp className="h-3 w-3 text-emerald-600" />}
              <span className={trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-600" : "text-muted-foreground"}>
                {trend === "up" ? `+${trendPercentage}%` : trend === "down" ? `-${trendPercentage}%` : "Stable"}
              </span>
            </div>
          </div>
          {seasonalDemand && (
            <p className="text-xs text-muted-foreground leading-relaxed">{seasonalDemand}</p>
          )}
        </div>

        {/* Chart */}
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              className="text-xs text-muted-foreground"
              tickMargin={12}
              interval={Math.max(0, Math.floor(chartData.length / 6) - 1)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              className="text-xs text-muted-foreground"
              tickMargin={8}
            />
            <ChartTooltip
              cursor={{ stroke: "var(--color-value)", strokeWidth: 2, strokeDasharray: "5 5" }}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--color-value)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, fill: "var(--color-value)", strokeWidth: 2, stroke: "hsl(var(--background))" }}
            />
            {chartData.some(d => d.demand !== undefined) && (
              <Line
                type="monotone"
                dataKey="demand"
                stroke="var(--color-demand)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 5, fill: "var(--color-demand)", strokeWidth: 2, stroke: "hsl(var(--background))" }}
              />
            )}
          </LineChart>
        </ChartContainer>
      </div>
    </Card>
  )
}

