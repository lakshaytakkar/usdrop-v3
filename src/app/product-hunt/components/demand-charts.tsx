"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  Line, 
  LineChart,
  Pie, 
  PieChart, 
  Cell,
  CartesianGrid, 
  XAxis, 
  YAxis,
  Legend,
  ResponsiveContainer
} from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { TrendingUp, Globe, DollarSign, BarChart3, Target } from "lucide-react"

interface DemandChartsProps {
  seasonalData?: Array<{ month: string; value: number }>
  saturation?: {
    storesSelling: number
    competitionLevel: string
  }
  regionalInterest?: Record<string, number>
  product?: {
    buy_price?: number
    sell_price?: number
    profit_per_order?: number
    metadata?: {
      profit_margin?: number | null
      pot_revenue?: number | null
    }
  }
}

// Generate sample data if not provided
const generateSampleData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months.map((month, index) => ({
    month,
    revenue: Math.floor(Math.random() * 50000) + 20000,
    demand: Math.floor(Math.random() * 100) + 50,
    profit: Math.floor(Math.random() * 30000) + 10000,
  }))
}

const generateRegionalData = () => {
  return [
    { country: 'US', value: 45, interest: 85 },
    { country: 'UK', value: 18, interest: 72 },
    { country: 'CA', value: 12, interest: 68 },
    { country: 'AU', value: 10, interest: 65 },
    { country: 'DE', value: 8, interest: 58 },
    { country: 'FR', value: 7, interest: 55 },
  ]
}

const generateCompetitionData = () => {
  return [
    { name: 'Low Competition', value: 35, color: 'hsl(142.1 76.2% 36.3%)' },
    { name: 'Medium Competition', value: 45, color: 'hsl(38.7 92% 50%)' },
    { name: 'High Competition', value: 20, color: 'hsl(0 84.2% 60.2%)' },
  ]
}

export function DemandCharts({ seasonalData, saturation, regionalInterest, product }: DemandChartsProps) {
  // Use provided data or generate samples
  const chartData = seasonalData?.map((item, index) => ({
    month: item.month,
    value: item.value,
    revenue: Math.floor(item.value * 500) + 20000,
    profit: Math.floor(item.value * 300) + 10000,
  })) || generateSampleData()

  const regionalData = regionalInterest 
    ? Object.entries(regionalInterest).map(([country, value]) => ({
        country,
        value: Number(value),
        interest: Number(value) * 1.5,
      }))
    : generateRegionalData()

  const competitionData = generateCompetitionData()

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-1))",
    },
    profit: {
      label: "Profit",
      color: "hsl(var(--chart-2))",
    },
    demand: {
      label: "Demand",
      color: "hsl(var(--chart-3))",
    },
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

  // Profit margin data
  const profitMarginData = [
    { name: 'Product Cost', value: product?.buy_price || 15, color: 'hsl(var(--chart-4))' },
    { name: 'Profit', value: product?.profit_per_order || 25, color: 'hsl(var(--chart-2))' },
    { name: 'Fees', value: 5, color: 'hsl(var(--chart-5))' },
  ]

  return (
    <div className="space-y-6">
      {/* Revenue Trend & Profit Margin Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Trend Chart */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Revenue Trend</h3>
          </div>
          <ChartContainer config={chartConfig} className="h-[250px]">
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
                dataKey="revenue"
                type="monotone"
                fill="var(--color-revenue)"
                fillOpacity={0.4}
                stroke="var(--color-revenue)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </Card>

        {/* Profit Margin Breakdown */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Profit Margin Breakdown</h3>
          </div>
          <ChartContainer config={chartConfig} className="h-[250px]">
            <BarChart
              data={profitMarginData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Bar
                dataKey="value"
                radius={[8, 8, 0, 0]}
                fill="var(--color-profit)"
              />
            </BarChart>
          </ChartContainer>
          <div className="mt-4 space-y-2">
            {profitMarginData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-semibold">${item.value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Seasonal Demand & Competition Analysis Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Seasonal Demand Line Chart */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Seasonal Demand</h3>
          </div>
          <ChartContainer config={chartConfig} className="h-[250px]">
            <LineChart
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
              <Line
                dataKey="demand"
                type="monotone"
                stroke="var(--color-demand)"
                strokeWidth={3}
                dot={{ fill: "var(--color-demand)", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        </Card>

        {/* Competition Analysis Pie Chart */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Competition Analysis</h3>
          </div>
          <ChartContainer config={chartConfig} className="h-[250px]">
            <PieChart>
              <Pie
                data={competitionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {competitionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
          <div className="mt-4 text-center">
            <div className={`text-2xl font-bold ${competitionColor}`}>
              {saturation?.storesSelling || 23}
            </div>
            <div className="text-sm text-muted-foreground">
              Stores selling this product
            </div>
            <Badge variant="outline" className="mt-2">
              {saturation?.competitionLevel || "Medium"} Competition
            </Badge>
          </div>
        </Card>
      </div>

      {/* Regional Interest Bar Chart */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Regional Interest</h3>
        </div>
        <ChartContainer config={chartConfig} className="h-[250px]">
          <BarChart
            data={regionalData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="country"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Bar
              dataKey="interest"
              radius={[8, 8, 0, 0]}
              fill="var(--color-value)"
            />
          </BarChart>
        </ChartContainer>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {regionalData.map((item, index) => (
            <div key={index} className="text-center p-3 bg-muted/50 rounded-md">
              <div className="text-sm font-semibold">{item.country}</div>
              <div className="text-xs text-muted-foreground">{item.interest}%</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}























