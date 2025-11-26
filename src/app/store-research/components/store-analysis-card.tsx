"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StoreResearchData } from "../data/store-research-data"

interface StoreAnalysisCardProps {
  data: StoreResearchData
}

export function StoreAnalysisCard({ data }: StoreAnalysisCardProps) {
  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US")
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Store Analysis</h3>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-1">Store URL</p>
          <p className="text-base font-medium">https://{data.storeUrl}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Popularity Rank</p>
            <p className="text-3xl font-bold">{formatNumber(data.popularityRank)}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Growth</p>
            <p
              className={`text-3xl font-bold ${
                data.growth >= 0 ? "text-emerald-600" : "text-destructive"
              }`}
            >
              {data.growth >= 0 ? "+" : ""}
              {data.growth}%
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Category</p>
            <div className="mt-1">
              <Badge>{data.category}</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

