"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { TrendingUp, Globe } from "lucide-react"

interface DemandChartsProps {
  seasonalData?: Array<{ month: string; value: number }>
  saturation?: {
    storesSelling: number
    competitionLevel: string
  }
  regionalInterest?: Record<string, number>
}

export function DemandCharts({ seasonalData, saturation, regionalInterest }: DemandChartsProps) {
  const chartData = seasonalData || []
  const chartConfig = {
    value: {
      label: "Interest",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  const competitionColor = saturation?.competitionLevel === "Low" 
    ? "text-emerald-600" 
    : saturation?.competitionLevel === "Medium"
    ? "text-yellow-600"
    : "text-red-600"

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Seasonal Interest Chart */}
      <Card className="p-4 lg:col-span-2">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Seasonal Interest</h3>
        </div>
        <ChartContainer config={chartConfig} className="h-[200px]">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="value"
              type="monotone"
              fill="var(--color-value)"
              fillOpacity={0.4}
              stroke="var(--color-value)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </Card>

      {/* Saturation Gauge */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Saturation</h3>
        <div className="space-y-4">
          <div className="relative">
            <div className="h-32 w-full flex items-end justify-center">
              {/* Simple gauge visualization */}
              <div className="w-full h-full flex flex-col justify-end">
                <div className="relative h-24 bg-muted rounded-t-full overflow-hidden">
                  <div 
                    className={`absolute bottom-0 left-0 right-0 ${
                      saturation?.storesSelling && saturation.storesSelling < 10
                        ? "bg-emerald-500"
                        : saturation?.storesSelling && saturation.storesSelling < 50
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ 
                      height: `${Math.min((saturation?.storesSelling || 0) * 2, 100)}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${competitionColor}`}>
              {saturation?.storesSelling || 0}
            </div>
            <div className="text-sm text-muted-foreground">
              Stores selling this product
            </div>
            <Badge variant="outline" className="mt-2">
              {saturation?.competitionLevel || "Unknown"} Competition
            </Badge>
          </div>
        </div>
      </Card>

      {/* Regional Interest */}
      {regionalInterest && (
        <Card className="p-4 lg:col-span-3">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Regional Interest</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(regionalInterest).map(([country, value]) => (
              <div key={country} className="text-center p-3 bg-muted/50 rounded-md">
                <div className="text-sm font-semibold">{country}</div>
                <div className="text-xs text-muted-foreground">{value}%</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}








