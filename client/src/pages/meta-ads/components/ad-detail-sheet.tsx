import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Eye,
  MessageCircle,
  Share2,
  ExternalLink,
  Download,
  Globe,
  Calendar,
  Play,
  Layers,
  MapPin,
  Languages,
  Tag,
  Activity,
  ThumbsUp,
} from "lucide-react"
import { MetaAd } from "../data/ads"

interface AdDetailSheetProps {
  ad: MetaAd | null
  open: boolean
  onClose: () => void
}

export function AdDetailSheet({ ad, open, onClose }: AdDetailSheetProps) {
  if (!ad) return null

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <img
              src={ad.advertiserLogo}
              alt={ad.advertiserName}
              className="w-10 h-10 rounded-full object-cover border border-gray-100"
            />
            <div>
              <SheetTitle className="text-left">{ad.advertiserName}</SheetTitle>
              <SheetDescription className="text-left">
                {ad.activeAdsCount} active ads / {ad.totalAds} total
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-5 mt-5">
          <div className="relative w-full rounded-xl overflow-hidden bg-gray-50" style={{ aspectRatio: '4/5' }}>
            <img
              src={ad.creative}
              alt={`Ad creative by ${ad.advertiserName}`}
              className="w-full h-full object-cover"
            />
            {ad.mediaType === "video" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <Play className="h-6 w-6 text-white ml-0.5" fill="white" />
                </div>
              </div>
            )}
            {ad.mediaType === "carousel" && (
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                <Layers className="h-3.5 w-3.5" />
                3+ slides
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="gap-1">
              <Activity className="h-3 w-3" />
              {ad.status === "active" ? "Active" : "Inactive"}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Calendar className="h-3 w-3" />
              {ad.daysActive}d running
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Globe className="h-3 w-3" />
              {ad.region}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Tag className="h-3 w-3" />
              {ad.category}
            </Badge>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Ad Details</h3>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  Date Range
                </div>
                <span className="text-sm font-medium text-gray-900">{ad.startDate} → {ad.endDate}</span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Languages className="h-4 w-4 text-gray-400" />
                  Language
                </div>
                <span className="text-sm font-medium text-gray-900">{ad.language}</span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  Country
                </div>
                <span className="text-sm font-medium text-gray-900">{ad.country}</span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Eye className="h-4 w-4 text-gray-400" />
                  Impression Level
                </div>
                <span className={`text-sm font-medium ${
                  ad.impressionLevel === "high" ? "text-emerald-600" :
                  ad.impressionLevel === "medium" ? "text-amber-600" :
                  "text-red-500"
                }`}>
                  {ad.impressionLevel.charAt(0).toUpperCase() + ad.impressionLevel.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Engagement</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <ThumbsUp className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{ad.likes}</p>
                <p className="text-[11px] text-gray-500">Likes</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <MessageCircle className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{ad.comments}</p>
                <p className="text-[11px] text-gray-500">Comments</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Share2 className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{ad.shares}</p>
                <p className="text-[11px] text-gray-500">Shares</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Ad Link</h3>
            <a
              href={ad.adLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 break-all"
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              {ad.adLink}
            </a>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <a
              href={`https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ALL&q=${encodeURIComponent(ad.advertiserName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button variant="outline" className="w-full cursor-pointer">
                <ExternalLink className="h-4 w-4 mr-2" />
                View in Ad Library
              </Button>
            </a>
            <a href={ad.creative} download className="flex-1">
              <Button variant="outline" className="w-full cursor-pointer">
                <Download className="h-4 w-4 mr-2" />
                Download Creative
              </Button>
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
