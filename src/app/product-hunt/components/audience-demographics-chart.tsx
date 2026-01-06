"use client"

import { Card } from "@/components/ui/card"
import { 
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AudienceDemographicsChartProps {
  demographics?: {
    age: string
    gender: string
  }
  interests?: string[]
  suggestions?: string[]
}

// Generate sample data if not provided
const generateSampleData = () => {
  return {
    demographics: {
      age: "25-34",
      gender: "Unisex",
    },
    interests: [
      "Home & Garden",
      "Lifestyle",
      "Technology",
    ],
    suggestions: [
      "Target value-conscious consumers",
      "Focus on lifestyle enthusiasts",
    ],
  }
}

export function AudienceDemographicsChart({ 
  demographics,
  interests,
  suggestions
}: AudienceDemographicsChartProps) {
  const data = demographics 
    ? { demographics, interests: interests || [], suggestions: suggestions || [] }
    : generateSampleData()

  // Age distribution data
  const ageGroups = [
    { name: "18-24", value: 15, color: "hsl(var(--chart-1))" },
    { name: "25-34", value: 35, color: "hsl(var(--chart-2))" },
    { name: "35-44", value: 25, color: "hsl(var(--chart-3))" },
    { name: "45-54", value: 15, color: "hsl(var(--chart-4))" },
    { name: "55+", value: 10, color: "hsl(var(--chart-5))" },
  ]

  // Gender distribution
  const genderData = [
    { name: "Male", value: 40, color: "hsl(var(--chart-1))" },
    { name: "Female", value: 45, color: "hsl(var(--chart-2))" },
    { name: "Other", value: 15, color: "hsl(var(--chart-3))" },
  ]

  const chartConfig = {
    age: {
      label: "Age",
      color: "hsl(var(--chart-1))",
    },
    gender: {
      label: "Gender",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig

  return (
    <Card className="p-6 min-w-0">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Users className="h-4 w-4" />
            Target Audience Demographics
          </h4>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {data.demographics.age}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {data.demographics.gender}
            </Badge>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Age Distribution */}
          <div className="space-y-3">
            <h5 className="text-xs font-medium text-muted-foreground">Age Distribution</h5>
            <ChartContainer config={chartConfig} className="h-[180px] w-full">
              <PieChart>
                <Pie
                  data={ageGroups}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ageGroups.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </div>

          {/* Gender Distribution */}
          <div className="space-y-3">
            <h5 className="text-xs font-medium text-muted-foreground">Gender Distribution</h5>
            <ChartContainer config={chartConfig} className="h-[180px] w-full">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </div>
        </div>

        {/* Interests & Suggestions */}
        {data.interests.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <h5 className="text-xs font-medium text-muted-foreground">Top Interests</h5>
            <div className="flex flex-wrap gap-2">
              {data.interests.map((interest, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {data.suggestions.length > 0 && (
          <div className="space-y-2 pt-2">
            <h5 className="text-xs font-medium text-muted-foreground">Targeting Suggestions</h5>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              {data.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  )
}

