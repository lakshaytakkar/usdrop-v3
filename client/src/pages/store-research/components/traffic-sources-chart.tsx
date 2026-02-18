

import { Card, CardContent } from "@/components/ui/card"
import { TrafficSource } from "../data/store-research-data"

interface TrafficSourcesChartProps {
  sources: TrafficSource[]
}

export function TrafficSourcesChart({ sources }: TrafficSourcesChartProps) {
  const getSourceLabel = (type: string) => {
    switch (type) {
      case "direct":
        return "Direct"
      case "search":
        return "Search"
      case "social":
        return "Social"
      case "referrals":
        return "Referrals"
      default:
        return type
    }
  }

  const getSourceColor = (type: string) => {
    switch (type) {
      case "direct":
        return "bg-primary"
      case "search":
        return "bg-blue-500"
      case "social":
        return "bg-purple-500"
      case "referrals":
        return "bg-orange-500"
      default:
        return "bg-muted"
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Traffic Sources</h3>

        <div className="space-y-3">
          {sources.map((source, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{getSourceLabel(source.type)}</span>
                <span className="text-sm font-semibold">
                  {source.percentage.toFixed(2)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getSourceColor(source.type)}`}
                  style={{ width: `${source.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

