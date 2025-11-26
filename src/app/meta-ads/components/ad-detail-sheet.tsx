"use client"

import Image from "next/image"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Eye, MousePointerClick, ExternalLink, Download } from "lucide-react"
import { MetaAd } from "../data/ads"

interface AdDetailSheetProps {
  ad: MetaAd | null
  open: boolean
  onClose: () => void
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

export function AdDetailSheet({ ad, open, onClose }: AdDetailSheetProps) {
  if (!ad) return null

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
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{ad.title}</SheetTitle>
          <SheetDescription>Detailed metrics and information about this ad</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Ad Image */}
          <div className="relative w-full h-64 rounded-lg overflow-hidden">
            <Image
              src={ad.image}
              alt={ad.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>

          {/* Product Info */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Product</p>
            <p className="text-lg font-semibold">{ad.productName}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{ad.platform}</Badge>
            <Badge variant="outline">{ad.adType}</Badge>
            <Badge variant="outline">{ad.category}</Badge>
            <Badge variant={getStatusColor(ad.status) as any}>{ad.status}</Badge>
          </div>

          {/* Top Metrics */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Top Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">ROAS</p>
                  <p className="text-2xl font-bold text-emerald-600">{ad.roas.toFixed(2)}x</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">CTR</p>
                  <p className="text-2xl font-bold">{ad.ctr.toFixed(2)}%</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                  <p className="text-xl font-bold text-emerald-600">
                    {currencyFormatter.format(ad.revenue)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Spend</p>
                  <p className="text-xl font-bold">{currencyFormatter.format(ad.spend)}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Engagement Metrics */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Engagement</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Engagement</span>
                </div>
                <span className="text-sm font-semibold">
                  {numberFormatter.format(ad.engagement)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Impressions</span>
                </div>
                <span className="text-sm font-semibold">
                  {numberFormatter.format(ad.impressions)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <MousePointerClick className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Clicks</span>
                </div>
                <span className="text-sm font-semibold">{numberFormatter.format(ad.clicks)}</span>
              </div>
            </div>
          </div>

          {/* Date */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Ad Date</p>
            <p className="text-sm font-medium">
              {new Date(ad.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <a
              href={`https://www.facebook.com/ads/library/?id=${ad.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button variant="outline" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                View in Library
              </Button>
            </a>
            <a href={ad.image} download className="flex-1">
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

