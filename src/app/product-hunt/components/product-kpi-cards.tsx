"use client"

import { Card } from "@/components/ui/card"
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  BarChart3,
  Shield,
  Percent,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductKPICardsProps {
  buyPrice: number
  sellPrice: number
  profitPerOrder: number
  trendData?: number[]
  competitionLevel?: "Low" | "Medium" | "High"
  rating?: number
  reviewsCount?: number
}

export function ProductKPICards({
  buyPrice,
  sellPrice,
  profitPerOrder,
  trendData,
  competitionLevel = "Medium",
  rating,
  reviewsCount,
}: ProductKPICardsProps) {
  const profitMargin = sellPrice > 0 ? ((sellPrice - buyPrice) / sellPrice) * 100 : 0
  const trendAvg = trendData && trendData.length > 0 ? trendData.reduce((a, b) => a + b, 0) / trendData.length : 50
  const estimatedMonthlyOrders = Math.max(20, Math.round((trendAvg / 100) * 120) + 15)
  const estimatedMonthlyRevenue = Math.round(estimatedMonthlyOrders * profitPerOrder)

  const trendChange = trendData && trendData.length > 1
    ? ((trendData[trendData.length - 1] - trendData[0]) / (trendData[0] || 1)) * 100
    : 0
  const isTrendUp = trendChange > 0

  const competitionConfig = {
    Low: { color: "text-emerald-600", bg: "bg-emerald-50", score: "Low Risk" },
    Medium: { color: "text-amber-600", bg: "bg-amber-50", score: "Moderate" },
    High: { color: "text-red-600", bg: "bg-red-50", score: "High Risk" },
  }

  const comp = competitionConfig[competitionLevel]

  const kpis = [
    {
      label: "Profit Margin",
      value: `${profitMargin.toFixed(1)}%`,
      subtext: `$${profitPerOrder.toFixed(2)} per sale`,
      icon: Percent,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      trend: profitMargin > 30 ? "Good" : profitMargin > 15 ? "Fair" : "Low",
      trendColor: profitMargin > 30 ? "text-emerald-600" : profitMargin > 15 ? "text-amber-600" : "text-red-600",
    },
    {
      label: "Est. Monthly Profit",
      value: `$${estimatedMonthlyRevenue.toLocaleString()}`,
      subtext: `~${estimatedMonthlyOrders} orders/mo`,
      icon: DollarSign,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      trend: estimatedMonthlyRevenue > 2000 ? "Strong" : "Growing",
      trendColor: estimatedMonthlyRevenue > 2000 ? "text-emerald-600" : "text-amber-600",
    },
    {
      label: "Competition",
      value: comp.score,
      subtext: `${competitionLevel} saturation`,
      icon: Shield,
      iconBg: comp.bg,
      iconColor: comp.color,
      trend: competitionLevel === "Low" ? "Opportunity" : competitionLevel === "Medium" ? "Competitive" : "Saturated",
      trendColor: comp.color,
    },
    {
      label: "Market Trend",
      value: `${isTrendUp ? "+" : ""}${trendChange.toFixed(1)}%`,
      subtext: trendData ? `${trendData.length} months tracked` : "No data",
      icon: isTrendUp ? TrendingUp : TrendingDown,
      iconBg: isTrendUp ? "bg-emerald-50" : "bg-red-50",
      iconColor: isTrendUp ? "text-emerald-600" : "text-red-600",
      trend: isTrendUp ? "Rising" : "Declining",
      trendColor: isTrendUp ? "text-emerald-600" : "text-red-600",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {kpis.map((kpi, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className={cn("p-2 rounded-lg", kpi.iconBg)}>
              <kpi.icon className={cn("h-4 w-4", kpi.iconColor)} />
            </div>
            <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", kpi.trendColor, 
              kpi.trendColor.includes("emerald") ? "bg-emerald-50" : 
              kpi.trendColor.includes("amber") ? "bg-amber-50" : "bg-red-50"
            )}>
              {kpi.trend}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">{kpi.label}</p>
            <p className="text-xl font-bold tracking-tight">{kpi.value}</p>
            <p className="text-xs text-muted-foreground">{kpi.subtext}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
