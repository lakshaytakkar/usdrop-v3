"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp,
  DollarSign,
  Target,
  Zap,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PerformanceMetricsDashboardProps {
  profitMargin?: number
  roi?: number
  marketSaturation?: number
  socialProof?: {
    likes: number
    comments: number
    shares: number
    virality_score: number
  }
  productPrice?: number
  buyPrice?: number
}

// Generate sample data if not provided
const generateSampleData = (productPrice: number = 29.99, buyPrice: number = 10.00) => {
  const profitMargin = ((productPrice - buyPrice) / productPrice) * 100
  return {
    profitMargin: Math.round(profitMargin * 10) / 10,
    roi: Math.round((profitMargin * 1.5) * 10) / 10,
    marketSaturation: Math.floor(Math.random() * 40) + 30,
    socialProof: {
      likes: Math.floor(Math.random() * 5000) + 100,
      comments: Math.floor(Math.random() * 500) + 10,
      shares: Math.floor(Math.random() * 200) + 5,
      virality_score: Math.round((Math.random() * 0.4 + 0.3) * 100) / 100,
    }
  }
}

export function PerformanceMetricsDashboard({
  profitMargin,
  roi,
  marketSaturation,
  socialProof,
  productPrice = 29.99,
  buyPrice = 10.00,
}: PerformanceMetricsDashboardProps) {
  const data = profitMargin !== undefined && roi !== undefined && marketSaturation !== undefined && socialProof
    ? { profitMargin, roi, marketSaturation, socialProof }
    : generateSampleData(productPrice, buyPrice)

  const getSaturationColor = (value: number) => {
    if (value < 40) return "text-emerald-600"
    if (value < 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getSaturationBg = (value: number) => {
    if (value < 40) return "bg-emerald-600"
    if (value < 70) return "bg-yellow-600"
    return "bg-red-600"
  }

  const getViralityColor = (score: number) => {
    if (score >= 0.7) return "text-emerald-600"
    if (score >= 0.4) return "text-yellow-600"
    return "text-muted-foreground"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-w-0">
      {/* Profit Margin */}
      <Card className="p-4 min-w-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Profit Margin</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {data.profitMargin.toFixed(1)}%
            </Badge>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">{data.profitMargin.toFixed(1)}%</div>
            <Progress value={data.profitMargin} className="h-2" />
          </div>
        </div>
      </Card>

      {/* ROI Projection */}
      <Card className="p-4 min-w-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">ROI Projection</span>
            </div>
            <Badge variant="outline" className="text-xs text-emerald-600">
              {data.roi.toFixed(1)}%
            </Badge>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-emerald-600">{data.roi.toFixed(1)}%</div>
            <Progress value={Math.min(data.roi, 100)} className="h-2" />
          </div>
        </div>
      </Card>

      {/* Market Saturation */}
      <Card className="p-4 min-w-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Market Saturation</span>
            </div>
            <Badge variant="outline" className={cn("text-xs", getSaturationColor(data.marketSaturation))}>
              {data.marketSaturation}%
            </Badge>
          </div>
          <div className="space-y-1">
            <div className={cn("text-2xl font-bold", getSaturationColor(data.marketSaturation))}>
              {data.marketSaturation}%
            </div>
            <Progress 
              value={data.marketSaturation} 
              className="h-2"
            />
          </div>
        </div>
      </Card>

      {/* Social Proof Score */}
      <Card className="p-4 min-w-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Virality Score</span>
            </div>
            <Badge variant="outline" className={cn("text-xs", getViralityColor(data.socialProof.virality_score))}>
              {(data.socialProof.virality_score * 100).toFixed(0)}%
            </Badge>
          </div>
          <div className="space-y-1">
            <div className={cn("text-2xl font-bold", getViralityColor(data.socialProof.virality_score))}>
              {(data.socialProof.virality_score * 100).toFixed(0)}%
            </div>
            <Progress value={data.socialProof.virality_score * 100} className="h-2" />
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
            <span>{data.socialProof.likes.toLocaleString()} likes</span>
            <span>{data.socialProof.comments.toLocaleString()} comments</span>
            <span>{data.socialProof.shares.toLocaleString()} shares</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

