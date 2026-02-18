

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Area, 
  AreaChart, 
  Bar,
  BarChart,
  CartesianGrid, 
  XAxis, 
  YAxis,
} from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { TrendingUp, TrendingDown, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface MarketAnalyticsChartProps {
  trendData?: number[]
  sellPrice?: number
  profitPerOrder?: number
  seasonalDemand?: string
}

function generateMonthLabels(count: number): string[] {
  const months: string[] = []
  const now = new Date()
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }))
  }
  return months
}

export function MarketAnalyticsChart({
  trendData,
  sellPrice = 29.99,
  profitPerOrder = 15,
  seasonalDemand,
}: MarketAnalyticsChartProps) {
  const safeTrend = Array.isArray(trendData) && trendData.length > 0 ? trendData : [45, 52, 49, 62, 58, 71, 65, 78, 72, 85, 80, 92]
  const monthLabels = generateMonthLabels(safeTrend.length)

  const interestData = safeTrend.map((value, i) => ({
    month: monthLabels[i] || `M${i + 1}`,
    interest: value,
    demand: Math.max(10, value + Math.floor(Math.random() * 15) - 7),
  }))

  const revenueData = safeTrend.map((value, i) => {
    const estimatedOrders = Math.floor((value / 100) * 120) + 10
    return {
      month: monthLabels[i] || `M${i + 1}`,
      revenue: Math.round(estimatedOrders * sellPrice),
      profit: Math.round(estimatedOrders * profitPerOrder),
    }
  })

  const firstVal = safeTrend[0]
  const lastVal = safeTrend[safeTrend.length - 1]
  const trendChange = firstVal > 0 ? ((lastVal - firstVal) / firstVal) * 100 : 0
  const isTrendUp = trendChange > 0

  const peakMonth = interestData.reduce((max, item) => item.interest > max.interest ? item : max, interestData[0])

  const interestConfig = {
    interest: { label: "Search Interest", color: "hsl(221.2 83.2% 53.3%)" },
    demand: { label: "Demand Score", color: "hsl(142.1 76.2% 36.3%)" },
  } satisfies ChartConfig

  const revenueConfig = {
    revenue: { label: "Est. Revenue", color: "hsl(221.2 83.2% 53.3%)" },
    profit: { label: "Est. Profit", color: "hsl(142.1 76.2% 36.3%)" },
  } satisfies ChartConfig

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="p-5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Search Interest Over Time</h3>
          </div>
          <Badge variant="outline" className={cn("text-xs gap-1", isTrendUp ? "text-emerald-600 border-emerald-200" : "text-red-600 border-red-200")}>
            {isTrendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {isTrendUp ? "+" : ""}{trendChange.toFixed(1)}%
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          {seasonalDemand || `Peak interest in ${peakMonth.month} · ${safeTrend.length} months tracked`}
        </p>
        <ChartContainer config={interestConfig} className="h-[240px] w-full">
          <AreaChart data={interestData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="interestGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-interest)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--color-interest)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-demand)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="var(--color-demand)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/50" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
              interval={Math.max(0, Math.floor(interestData.length / 6) - 1)}
            />
            <YAxis hide />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="interest"
              stroke="var(--color-interest)"
              strokeWidth={2}
              fill="url(#interestGrad)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: "hsl(var(--background))" }}
            />
            <Area
              type="monotone"
              dataKey="demand"
              stroke="var(--color-demand)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fill="url(#demandGrad)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: "hsl(var(--background))" }}
            />
          </AreaChart>
        </ChartContainer>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t">
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">Search Interest</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 opacity-60" />
            <span className="text-muted-foreground">Demand Score</span>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Revenue Potential</h3>
          </div>
          <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200">
            ${Math.round(revenueData.reduce((sum, d) => sum + d.profit, 0) / revenueData.length).toLocaleString()}/mo avg
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Estimated revenue and profit based on market demand
        </p>
        <ChartContainer config={revenueConfig} className="h-[240px] w-full">
          <BarChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/50" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
              interval={Math.max(0, Math.floor(revenueData.length / 6) - 1)}
            />
            <YAxis hide />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
            />
            <Bar dataKey="revenue" radius={[4, 4, 0, 0]} fill="var(--color-revenue)" opacity={0.3} />
            <Bar dataKey="profit" radius={[4, 4, 0, 0]} fill="var(--color-profit)" />
          </BarChart>
        </ChartContainer>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t">
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 opacity-30" />
            <span className="text-muted-foreground">Revenue</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">Profit</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
