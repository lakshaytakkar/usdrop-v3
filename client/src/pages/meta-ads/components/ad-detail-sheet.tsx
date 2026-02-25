import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="relative bg-gray-50 md:rounded-l-lg overflow-hidden">
            <img
              src={ad.creative}
              alt={`Ad creative by ${ad.advertiserName}`}
              className="w-full h-full object-cover min-h-[300px] md:min-h-full"
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

          <div className="p-6 space-y-5 overflow-y-auto">
            <DialogHeader className="space-y-2">
              <div className="flex items-center gap-3">
                <img
                  src={ad.advertiserLogo}
                  alt={ad.advertiserName}
                  className="w-10 h-10 rounded-full object-cover border border-gray-100"
                />
                <div>
                  <DialogTitle className="text-left text-base">{ad.advertiserName}</DialogTitle>
                  <DialogDescription className="text-left text-xs">
                    {ad.activeAdsCount} active ads / {ad.totalAds} total
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className="gap-1 text-xs">
                <Activity className="h-3 w-3" />
                {ad.status === "active" ? "Active" : "Inactive"}
              </Badge>
              <Badge variant="outline" className="gap-1 text-xs">
                <Calendar className="h-3 w-3" />
                {ad.daysActive}d running
              </Badge>
              <Badge variant="outline" className="gap-1 text-xs">
                <Globe className="h-3 w-3" />
                {ad.region}
              </Badge>
              <Badge variant="outline" className="gap-1 text-xs">
                <Tag className="h-3 w-3" />
                {ad.category}
              </Badge>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Ad Details</h3>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between py-1.5 px-2.5 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    Date Range
                  </div>
                  <span className="text-xs font-medium text-gray-900">{ad.startDate} → {ad.endDate}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 px-2.5 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Languages className="h-3.5 w-3.5 text-gray-400" />
                    Language
                  </div>
                  <span className="text-xs font-medium text-gray-900">{ad.language}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 px-2.5 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                    Country
                  </div>
                  <span className="text-xs font-medium text-gray-900">{ad.country}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 px-2.5 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Eye className="h-3.5 w-3.5 text-gray-400" />
                    Impression Level
                  </div>
                  <span className={`text-xs font-medium ${
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
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Engagement</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2.5 bg-gray-50 rounded-lg">
                  <ThumbsUp className="h-3.5 w-3.5 text-blue-500 mx-auto mb-1" />
                  <p className="text-base font-bold text-gray-900">{ad.likes}</p>
                  <p className="text-[10px] text-gray-500">Likes</p>
                </div>
                <div className="text-center p-2.5 bg-gray-50 rounded-lg">
                  <MessageCircle className="h-3.5 w-3.5 text-blue-500 mx-auto mb-1" />
                  <p className="text-base font-bold text-gray-900">{ad.comments}</p>
                  <p className="text-[10px] text-gray-500">Comments</p>
                </div>
                <div className="text-center p-2.5 bg-gray-50 rounded-lg">
                  <Share2 className="h-3.5 w-3.5 text-blue-500 mx-auto mb-1" />
                  <p className="text-base font-bold text-gray-900">{ad.shares}</p>
                  <p className="text-[10px] text-gray-500">Shares</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Ad Link</h3>
              <a
                href={ad.adLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 break-all"
              >
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                {ad.adLink}
              </a>
            </div>

            <div className="flex gap-2 pt-3 border-t">
              <a
                href={`https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ALL&q=${encodeURIComponent(ad.advertiserName)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="outline" size="sm" className="w-full cursor-pointer text-xs">
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  View in Ad Library
                </Button>
              </a>
              <a href={ad.creative} download className="flex-1">
                <Button variant="outline" size="sm" className="w-full cursor-pointer text-xs">
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Download Creative
                </Button>
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
