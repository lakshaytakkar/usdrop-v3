"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, AlertCircle, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"
import CardFlip from "@/components/kokonutui/card-flip"

interface AIInsight {
  type: "opportunity" | "warning" | "trend" | "tip"
  title: string
  description: string
  metric?: string
  icon?: React.ReactNode
}

interface AIInsightsProps {
  product?: {
    profit_margin?: number
    trend_data?: number[]
    metadata?: {
      profit_margin?: number | null
      pot_revenue?: number | null
      items_sold?: number | null
    }
  }
}

export function AIInsights({ product }: AIInsightsProps) {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null)

  // Generate insights based on product data
  const generateInsights = (): AIInsight[] => {
    const insights: AIInsight[] = []
    const profitMargin = product?.metadata?.profit_margin || product?.profit_margin || 0
    const trendData = product?.trend_data || []
    const potRevenue = product?.metadata?.pot_revenue || 0
    const itemsSold = product?.metadata?.items_sold || 0

    // Insight 1: Profit Opportunity
    if (profitMargin > 50) {
      insights.push({
        type: "opportunity",
        title: "High Profit Opportunity",
        description: `This product has a ${profitMargin.toFixed(1)}% profit margin, indicating strong potential for profitability.`,
        metric: `${profitMargin.toFixed(1)}% margin`,
        icon: <TrendingUp className="h-5 w-5" />
      })
    } else if (profitMargin < 30) {
      insights.push({
        type: "warning",
        title: "Low Profit Margin",
        description: `With a ${profitMargin.toFixed(1)}% margin, consider optimizing pricing or finding alternative suppliers.`,
        metric: `${profitMargin.toFixed(1)}% margin`,
        icon: <AlertCircle className="h-5 w-5" />
      })
    }

    // Insight 2: Demand Trend
    if (trendData.length > 1) {
      const recentTrend = trendData.slice(-3)
      const avgRecent = recentTrend.reduce((a, b) => a + b, 0) / recentTrend.length
      const avgPrevious = trendData.slice(0, 3).reduce((a, b) => a + b, 0) / 3
      const trendChange = ((avgRecent - avgPrevious) / avgPrevious) * 100

      if (trendChange > 20) {
        insights.push({
          type: "trend",
          title: "Rising Demand Detected",
          description: `Demand has increased by ${Math.abs(trendChange).toFixed(0)}% recently. This could be a trending product.`,
          metric: `+${Math.abs(trendChange).toFixed(0)}%`,
          icon: <TrendingUp className="h-5 w-5" />
        })
      } else if (trendChange < -20) {
        insights.push({
          type: "warning",
          title: "Declining Interest",
          description: `Demand has decreased by ${Math.abs(trendChange).toFixed(0)}%. Consider seasonal factors or market saturation.`,
          metric: `${trendChange.toFixed(0)}%`,
          icon: <AlertCircle className="h-5 w-5" />
        })
      }
    }

    // Insight 3: Revenue Potential
    if (potRevenue > 100000) {
      insights.push({
        type: "opportunity",
        title: "High Revenue Potential",
        description: `Estimated potential revenue of $${(potRevenue / 1000).toFixed(0)}K suggests strong market demand.`,
        metric: `$${(potRevenue / 1000).toFixed(0)}K`,
        icon: <Lightbulb className="h-5 w-5" />
      })
    }

    // Fallback insights if no data
    if (insights.length === 0) {
      insights.push({
        type: "tip",
        title: "Product Analysis Available",
        description: "USDrop AI is analyzing this product. Check back soon for personalized insights and recommendations.",
        icon: <Sparkles className="h-5 w-5" />
      })
    }

    // Return max 2 insights
    return insights.slice(0, 2)
  }

  const insights = generateInsights()

  if (insights.length === 0) return null

  const getTypeStyles = (type: AIInsight["type"]) => {
    switch (type) {
      case "opportunity":
        return {
          gradient: "from-emerald-500/20 via-emerald-500/10 to-transparent",
          border: "border-emerald-500/30",
          text: "text-emerald-600 dark:text-emerald-400",
          badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
        }
      case "warning":
        return {
          gradient: "from-orange-500/20 via-orange-500/10 to-transparent",
          border: "border-orange-500/30",
          text: "text-orange-600 dark:text-orange-400",
          badge: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20"
        }
      case "trend":
        return {
          gradient: "from-primary/20 via-primary/10 to-transparent",
          border: "border-primary/30",
          text: "text-primary",
          badge: "bg-primary/10 text-primary border-primary/20"
        }
      default:
        return {
          gradient: "from-accent/20 via-accent/10 to-transparent",
          border: "border-accent/30",
          text: "text-accent",
          badge: "bg-accent/10 text-accent border-accent/20"
        }
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {insights.map((insight, index) => {
        const styles = getTypeStyles(insight.type)
        
        return (
          <div
            key={index}
            className="relative group"
            onMouseEnter={() => setFlippedIndex(index)}
            onMouseLeave={() => setFlippedIndex(null)}
          >
            <Card
              className={cn(
                "relative overflow-hidden border-2 transition-all duration-300 h-full",
                "hover:shadow-lg hover:shadow-primary/10",
                styles.border
              )}
            >
              {/* Gradient Background */}
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-50",
                  styles.gradient
                )}
              />

              {/* Content */}
              <div className="relative p-5 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className={cn("p-2 rounded-lg bg-background/50", styles.text)}>
                      {insight.icon || <Sparkles className="h-4 w-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn("text-xs", styles.badge)}>
                          USDrop AI
                        </Badge>
                        {insight.metric && (
                          <span className={cn("text-sm font-semibold", styles.text)}>
                            {insight.metric}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-sm mt-1">{insight.title}</h3>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight.description}
                </p>

                {/* Animated Sparkle Effect */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles className={cn("h-4 w-4 animate-pulse", styles.text)} />
                </div>
              </div>
            </Card>
          </div>
        )
      })}
    </div>
  )
}




