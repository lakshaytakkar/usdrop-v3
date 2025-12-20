"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { 
  Area, 
  AreaChart, 
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
import { Clock, TrendingUp } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"

interface ActivityData {
  date: string
  hours: number
}

interface ActivityChartProps {
  data?: ActivityData[]
  isLoading?: boolean
}

// Generate sample data for the last 14 days if no data provided
function generateSampleData(): ActivityData[] {
  const data: ActivityData[] = []
  const today = new Date()
  
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
    
    // Generate random activity (0-3 hours)
    const hours = Math.random() * 3
    
    data.push({
      date: dayName,
      hours: Math.round(hours * 10) / 10
    })
  }
  
  return data
}

const chartConfig = {
  hours: {
    label: "Hours",
    color: "#0e66fe",
  },
} satisfies ChartConfig

export function ActivityChart({ data, isLoading }: ActivityChartProps) {
  const [chartData, setChartData] = useState<ActivityData[]>([])

  useEffect(() => {
    if (data && data.length > 0) {
      setChartData(data)
    } else {
      // Use sample data if no data provided
      setChartData(generateSampleData())
    }
  }, [data])

  if (isLoading) {
    return (
      <Card className="border-border/50 h-full">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[280px] w-full" />
        </CardContent>
      </Card>
    )
  }

  const totalHours = chartData.reduce((sum, item) => sum + item.hours, 0)
  const averageHours = totalHours / chartData.length
  const lastWeekHours = chartData.slice(0, 7).reduce((sum, item) => sum + item.hours, 0)
  const previousWeekHours = chartData.slice(7, 14).reduce((sum, item) => sum + item.hours, 0)
  const percentageChange = previousWeekHours > 0 
    ? ((lastWeekHours - previousWeekHours) / previousWeekHours) * 100 
    : 0

  return (
    <Card className="bg-white border border-[#e6e6e6] rounded-xl shadow-sm h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium text-[#1b1b1b] leading-[1.5]">
            Learning Hours
          </h3>
          <div className="flex items-center gap-4">
            <button className="h-8 px-3 py-2 rounded-lg border border-[#dfe1e7] bg-white shadow-sm flex items-center gap-2 text-xs font-medium text-[#0d0d12]">
              Last Month
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button className="size-8 rounded-lg border border-black/8 shadow-sm flex items-center justify-center bg-white hover:bg-gray-50">
              <svg className="size-4 text-[#1A1B25]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex items-end gap-2 mt-4">
          <p className="text-[32px] font-semibold text-[#080808] leading-[1.2]">
            {totalHours.toFixed(1)} Hours
          </p>
          <div className="flex items-center gap-2 pb-1">
            <div className="flex items-center gap-1">
              <TrendingUp className="size-3 text-[#07c433]" />
              <p className="text-sm font-medium text-[#07c433] leading-[1.2]">
                +{Math.abs(percentageChange).toFixed(1)}%
              </p>
            </div>
            <p className="text-xs text-[#111113] leading-[1.5]">
              than last month
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eceff3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs text-[#6f6f77] font-medium"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs text-[#6f6f77]"
              domain={[0, 'dataMax + 0.5']}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="hours"
              type="monotone"
              fill="#0e66fe"
              fillOpacity={0.1}
              stroke="#0e66fe"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

