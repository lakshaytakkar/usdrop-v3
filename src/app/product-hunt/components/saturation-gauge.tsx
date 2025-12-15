"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { RadialBar, RadialBarChart, Cell } from "recharts"

interface SaturationGaugeProps {
  storesSelling?: number
  competitionLevel?: "Low" | "Medium" | "High"
}

export function SaturationGauge({ storesSelling = 1, competitionLevel = "Low" }: SaturationGaugeProps) {
  // Calculate saturation percentage (1-100 scale)
  // Low: 0-33%, Medium: 34-66%, High: 67-100%
  const getSaturationPercentage = () => {
    if (competitionLevel === "Low") return 25
    if (competitionLevel === "Medium") return 60
    return 85
  }
  
  const saturationPercentage = getSaturationPercentage()
  
  // Determine color based on competition level
  const getColor = () => {
    switch (competitionLevel) {
      case "Low":
        return {
          text: "text-emerald-600",
          bg: "bg-emerald-600",
          border: "border-emerald-600",
          chart: "hsl(142.1 76.2% 36.3%)",
          bgLight: "bg-emerald-50 dark:bg-emerald-950/20"
        }
      case "Medium":
        return {
          text: "text-yellow-600",
          bg: "bg-yellow-600",
          border: "border-yellow-600",
          chart: "hsl(38.7 92% 50%)",
          bgLight: "bg-yellow-50 dark:bg-yellow-950/20"
        }
      case "High":
        return {
          text: "text-red-600",
          bg: "bg-red-600",
          border: "border-red-600",
          chart: "hsl(0 84.2% 60.2%)",
          bgLight: "bg-red-50 dark:bg-red-950/20"
        }
      default:
        return {
          text: "text-muted-foreground",
          bg: "bg-muted-foreground",
          border: "border-muted-foreground",
          chart: "hsl(var(--muted-foreground))",
          bgLight: "bg-muted"
        }
    }
  }

  const colors = getColor()
  
  // Chart data for RadialBar
  const chartData = [
    {
      name: 'saturation',
      value: saturationPercentage,
      fill: colors.chart
    },
    {
      name: 'remaining',
      value: 100 - saturationPercentage,
      fill: 'hsl(var(--muted))'
    }
  ]

  const chartConfig = {
    saturation: {
      label: "Saturation",
      color: colors.chart,
    },
  } satisfies ChartConfig

  return (
    <Card className="p-6 min-w-0">
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Radial Chart */}
        <div className="relative w-full max-w-[200px]">
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <RadialBarChart
              data={chartData}
              startAngle={90}
              endAngle={-270}
              innerRadius="60%"
              outerRadius="90%"
            >
              <RadialBar
                dataKey="value"
                cornerRadius={10}
                fill="var(--color-saturation)"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.fill}
                  />
                ))}
              </RadialBar>
              <ChartTooltip 
                content={<ChartTooltipContent hideLabel />}
                formatter={(value: number) => [`${value.toFixed(0)}%`, "Saturation"]}
              />
            </RadialBarChart>
          </ChartContainer>
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className={cn("text-3xl font-bold mb-1", colors.text)}>
                {storesSelling}
              </div>
              <div className="text-xs text-muted-foreground">Stores</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="text-center space-y-4 w-full">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Competition Level</div>
            <Badge 
              variant="outline" 
              className={cn(
                "px-4 py-1.5 text-sm font-medium border-2",
                colors.border,
                colors.text,
                colors.bgLight
              )}
            >
              {competitionLevel} Competition
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Saturation</span>
              <span>{saturationPercentage}%</span>
            </div>
            <Progress value={saturationPercentage} className="h-2" />
          </div>
        </div>
      </div>
    </Card>
  )
}
