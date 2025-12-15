"use client"

import { Card } from "@/components/ui/card"
import { 
  Line, 
  LineChart,
  CartesianGrid, 
  XAxis, 
  YAxis,
  Area,
  AreaChart,
} from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { TrendingUp } from "lucide-react"

interface SeasonalInterestChartProps {
  data?: Array<{ month: string; value: number }>
}

// Generate sample data if not provided
const generateSampleData = () => {
  const months = []
  const startDate = new Date(2022, 6) // July 2022
  const endDate = new Date(2025, 6) // July 2025
  
  for (let d = new Date(startDate); d <= endDate; d.setMonth(d.getMonth() + 1)) {
    const monthName = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    months.push({
      month: monthName,
      value: Math.floor(Math.random() * 100) + 20,
    })
  }
  
  return months
}

export function SeasonalInterestChart({ data }: SeasonalInterestChartProps) {
  const chartData = data && data.length > 0 ? data : generateSampleData()

  const chartConfig = {
    value: {
      label: "Interest",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  return (
    <Card className="p-6 min-w-0">
      <ChartContainer config={chartConfig} className="h-[250px] w-full">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            className="text-xs text-muted-foreground"
            interval={Math.max(0, Math.floor(chartData.length / 6) - 1)}
          />
          <YAxis 
            hide 
          />
          <ChartTooltip
            cursor={{ stroke: "var(--color-value)", strokeWidth: 2, strokeDasharray: "5 5" }}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--color-value)"
            strokeWidth={2}
            fill="url(#colorValue)"
            dot={false}
            activeDot={{ r: 5, fill: "var(--color-value)", strokeWidth: 2, stroke: "hsl(var(--background))" }}
          />
        </AreaChart>
      </ChartContainer>
    </Card>
  )
}

