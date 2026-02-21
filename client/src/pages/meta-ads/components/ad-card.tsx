import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MetaAd } from "../data/ads"
import { Bookmark, MoreVertical, Play, Eye, ThumbsUp, MessageCircle, Share2, ExternalLink, Image, Film, Layers } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdCardProps {
  ad: MetaAd
  onClick?: (ad: MetaAd) => void
}

export function AdCard({ ad, onClick }: AdCardProps) {
  const getImpressionColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-emerald-600 bg-emerald-50"
      case "medium":
        return "text-amber-600 bg-amber-50"
      case "low":
        return "text-red-500 bg-red-50"
      default:
        return "text-gray-500 bg-gray-50"
    }
  }

  const getMediaIcon = () => {
    switch (ad.mediaType) {
      case "video":
        return <Film className="h-3 w-3" />
      case "carousel":
        return <Layers className="h-3 w-3" />
      default:
        return <Image className="h-3 w-3" />
    }
  }

  return (
    <Card
      className="overflow-hidden cursor-pointer hover-elevate"
      onClick={() => onClick?.(ad)}
      data-testid={`card-ad-${ad.id}`}
    >
      <div className="p-3.5 pb-2">
        <div className="flex items-start gap-2.5">
          <img
            src={ad.advertiserLogo}
            alt={ad.advertiserName}
            className="w-9 h-9 rounded-full object-cover border border-gray-100 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1">
              <div className="min-w-0">
                <h3 className="text-[13px] font-semibold text-gray-900 truncate leading-tight" data-testid={`text-advertiser-${ad.id}`}>
                  {ad.advertiserName}
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {ad.activeAdsCount} active ads / {ad.totalAds}
                </p>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  className="p-1 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={(e) => { e.stopPropagation() }}
                  data-testid={`button-bookmark-${ad.id}`}
                >
                  <Bookmark className="h-3.5 w-3.5 text-gray-400" />
                </button>
                <button
                  className="p-1 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={(e) => { e.stopPropagation() }}
                  data-testid={`button-more-${ad.id}`}
                >
                  <MoreVertical className="h-3.5 w-3.5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2.5 flex-wrap">
          <span className="inline-flex items-center text-[10px] font-medium text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />
            {ad.daysActive}d Active
          </span>
          <span className="text-[10px] text-gray-400">
            {ad.startDate} → {ad.endDate}
          </span>
        </div>

        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
            ● {ad.region}
          </span>
          {ad.likes > 0 && (
            <span className="inline-flex items-center gap-0.5 text-[10px] text-gray-500">
              <Eye className="h-2.5 w-2.5" /> {ad.likes}
            </span>
          )}
          {ad.comments > 0 && (
            <span className="inline-flex items-center gap-0.5 text-[10px] text-gray-500">
              <MessageCircle className="h-2.5 w-2.5" /> {ad.comments}
            </span>
          )}
          <span className={cn(
            "inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded ml-auto",
            getImpressionColor(ad.impressionLevel)
          )}>
            {ad.impressionLevel === "low" ? "Low impr." : ad.impressionLevel === "medium" ? "Med impr." : "High impr."}
          </span>
          {ad.shares > 0 && (
            <span className="inline-flex items-center gap-0.5 text-[10px] text-gray-500">
              <Share2 className="h-2.5 w-2.5" /> {ad.shares}
            </span>
          )}
        </div>
      </div>

      <div className="relative mx-3 rounded-lg overflow-hidden bg-gray-50" style={{ aspectRatio: '4/5' }}>
        <img
          src={ad.creative}
          alt={`Ad creative by ${ad.advertiserName}`}
          className="w-full h-full object-cover"
          decoding="async"
        />
        {ad.mediaType === "video" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <Play className="h-5 w-5 text-white ml-0.5" fill="white" />
            </div>
          </div>
        )}
        {ad.mediaType === "carousel" && (
          <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
            <Layers className="h-3 w-3" />
            3+
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 text-gray-700 font-medium">
          {getMediaIcon()}
          {ad.mediaType.charAt(0).toUpperCase() + ad.mediaType.slice(1)}
        </div>
      </div>

      <div className="p-3.5 pt-2.5">
        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-2.5">
          <ExternalLink className="h-3 w-3 shrink-0" />
          <span className="truncate">{ad.adLink}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-[12px] font-medium rounded-lg border-gray-200 hover:bg-gray-50 cursor-pointer"
            onClick={(e) => { e.stopPropagation(); onClick?.(ad) }}
            data-testid={`button-analysis-${ad.id}`}
          >
            <span className="mr-1.5 inline-block w-4 h-4 bg-gradient-to-r from-blue-600 to-blue-400 rounded" />
            Ad analysis
          </Button>
          <button
            className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={(e) => { e.stopPropagation() }}
            data-testid={`button-save-${ad.id}`}
          >
            <Bookmark className="h-3.5 w-3.5 text-gray-500" />
          </button>
          <button
            className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={(e) => { e.stopPropagation() }}
          >
            <MoreVertical className="h-3.5 w-3.5 text-gray-500" />
          </button>
        </div>
      </div>
    </Card>
  )
}
