import { useRef, useState } from "react"
import { Play, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { ProductVideo } from "../data/videos"

interface VideoCardProps {
  video: ProductVideo
  isLocked?: boolean
  onLockedClick?: () => void
}

function formatViews(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M"
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K"
  return n.toString()
}

export function VideoCard({ video, isLocked, onLockedClick }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseEnter = () => {
    setIsHovering(true)
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  const handleClick = () => {
    if (isLocked && onLockedClick) {
      onLockedClick()
    }
  }

  return (
    <div
      className="relative group rounded-xl overflow-hidden bg-black cursor-pointer hover-elevate"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      data-testid={`card-video-${video.id}`}
    >
      <div className="aspect-[9/16] relative">
        <video
          ref={videoRef}
          src={video.videoUrl}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          data-testid={`video-player-${video.id}`}
        />

        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovering ? "opacity-0" : "opacity-100"}`}
        >
          <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Play className="h-5 w-5 text-white ml-0.5" fill="white" />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-16 pb-3 px-3">
          <Badge
            className="mb-1.5 text-[10px] font-medium bg-white/15 text-white border-0 backdrop-blur-sm px-2 py-0.5"
            data-testid={`badge-video-category-${video.id}`}
          >
            {video.category}
          </Badge>
          <h3
            className="text-white text-[13px] font-semibold leading-tight line-clamp-2"
            data-testid={`text-video-title-${video.id}`}
          >
            {video.title}
          </h3>
          <div className="flex items-center gap-1 mt-1.5 text-white/60">
            <Eye className="h-3 w-3" />
            <span className="text-[11px]" data-testid={`text-video-views-${video.id}`}>
              {formatViews(video.views)}
            </span>
          </div>
        </div>

        {isLocked && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <span className="text-white/80 text-xs font-medium">Unlock with Pro</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
