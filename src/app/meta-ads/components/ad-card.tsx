"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MetaAd } from "../data/ads"

interface AdCardProps {
  ad: MetaAd
  onClick?: (ad: MetaAd) => void
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
})

export function AdCard({ ad, onClick }: AdCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "paused":
        return "secondary"
      case "ended":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Card className="flex h-full flex-col transition-transform hover:scale-[1.02]">
      <div className="relative w-full h-48 overflow-hidden rounded-t-xl">
        <Image
          src={ad.image}
          alt={ad.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={getStatusColor(ad.status) as any}>{ad.status}</Badge>
        </div>
      </div>
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-base font-semibold mb-1 line-clamp-1">{ad.title}</h3>
          <p className="text-sm text-muted-foreground">{ad.productName}</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline">{ad.platform}</Badge>
          <Badge variant="outline">{ad.adType}</Badge>
          <Badge variant="outline">{ad.category}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t">
          <div>
            <p className="text-xs text-muted-foreground mb-1">ROAS</p>
            <p className="text-lg font-bold text-emerald-600">{ad.roas.toFixed(2)}x</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">CTR</p>
            <p className="text-lg font-bold">{ad.ctr.toFixed(2)}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Spend</p>
            <p className="text-sm font-semibold">{currencyFormatter.format(ad.spend)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Revenue</p>
            <p className="text-sm font-semibold text-emerald-600">
              {currencyFormatter.format(ad.revenue)}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1 pt-2 border-t">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Engagement</span>
            <span className="font-medium">{numberFormatter.format(ad.engagement)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Impressions</span>
            <span className="font-medium">{numberFormatter.format(ad.impressions)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Clicks</span>
            <span className="font-medium">{numberFormatter.format(ad.clicks)}</span>
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full mt-auto" onClick={() => onClick?.(ad)}>
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}

