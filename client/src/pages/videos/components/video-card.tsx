import { useRef, useState, useEffect, useCallback } from "react"
import { Play, Eye, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { ProductVideo } from "../data/videos"

interface VideoCardProps {
  video: ProductVideo
  isLocked?: boolean
  onLockedClick?: () => void
}

const SUPABASE_HOST = "wecbybtxmkdkvqqahyuu.supabase.co"

const GRADIENT_PALETTES = [
  ["#1a1a2e", "#16213e", "#0f3460"],
  ["#2d1b69", "#11052c", "#3d2c8d"],
  ["#1b2838", "#171a21", "#2a475e"],
  ["#0d1321", "#1d2d44", "#3e5c76"],
  ["#1a1423", "#2d1f3d", "#462255"],
  ["#0c1821", "#1b2a4a", "#324a5f"],
  ["#1c1427", "#2b1b3d", "#3c1f5c"],
  ["#0f1624", "#1a2744", "#253b5e"],
]

function getCardGradient(id: number): string {
  const palette = GRADIENT_PALETTES[id % GRADIENT_PALETTES.length]
  return `linear-gradient(135deg, ${palette[0]} 0%, ${palette[1]} 50%, ${palette[2]} 100%)`
}

function formatViews(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M"
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K"
  return n.toString()
}

function isSupabaseVideo(url: string): boolean {
  return url.includes(SUPABASE_HOST)
}

export function VideoCard({ video, isLocked, onLockedClick }: VideoCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false)

  const autoplay = isSupabaseVideo(video.videoUrl)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    if (autoplay) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting)
          if (!entry.isIntersecting && videoRef.current) {
            videoRef.current.pause()
          } else if (entry.isIntersecting && videoRef.current && videoRef.current.src) {
            videoRef.current.play().catch(() => {})
          }
        },
        { rootMargin: "50px", threshold: 0 }
      )
      observer.observe(el)
      return () => observer.disconnect()
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { rootMargin: "200px", threshold: 0 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [autoplay])

  useEffect(() => {
    if (video.thumbnailUrl && isVisible) {
      const img = new Image()
      img.onload = () => setThumbnailLoaded(true)
      img.src = video.thumbnailUrl
    }
  }, [video.thumbnailUrl, isVisible])

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.removeAttribute("src")
        videoRef.current.load()
      }
    }
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (isLocked || autoplay) return
    setIsHovering(true)
    setIsVideoReady(false)
  }, [isLocked, autoplay])

  const handleMouseLeave = useCallback(() => {
    if (autoplay) return
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.removeAttribute("src")
      videoRef.current.load()
    }
    setIsHovering(false)
    setIsVideoReady(false)
  }, [autoplay])

  const handleCanPlay = useCallback(() => {
    setIsVideoReady(true)
    videoRef.current?.play().catch(() => {})
  }, [])

  const handleClick = () => {
    if (isLocked && onLockedClick) {
      onLockedClick()
    }
  }

  const showVideo = autoplay
    ? isVisible && !isLocked
    : isHovering && isVisible && !isLocked
  const hasThumbnail = !!video.thumbnailUrl
  const gradientBg = getCardGradient(video.id)

  return (
    <div
      ref={containerRef}
      className="relative group rounded-xl overflow-hidden bg-neutral-900 cursor-pointer hover-elevate"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      data-testid={`card-video-${video.id}`}
    >
      <div className="aspect-[9/16] relative">
        {!isVisible ? (
          <div className="absolute inset-0 bg-neutral-800 animate-pulse" />
        ) : (
          <>
            {!autoplay && hasThumbnail && thumbnailLoaded ? (
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            ) : !autoplay ? (
              <div
                className="absolute inset-0"
                style={{ background: gradientBg }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 opacity-40">
                    <Play className="h-8 w-8 text-white" fill="white" />
                    <span className="text-white/60 text-[11px] font-medium tracking-wider uppercase">
                      {video.category}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            {autoplay && !isVideoReady && (
              <div
                className="absolute inset-0"
                style={{ background: gradientBg }}
              />
            )}

            {showVideo && (
              <video
                ref={videoRef}
                src={video.videoUrl}
                autoPlay={autoplay}
                muted
                loop
                playsInline
                preload={autoplay ? "auto" : "none"}
                onCanPlay={handleCanPlay}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  isVideoReady ? "opacity-100" : "opacity-0"
                }`}
                data-testid={`video-player-${video.id}`}
              />
            )}

            {showVideo && !isVideoReady && (
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <div className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                  <Loader2 className="h-5 w-5 text-white animate-spin" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
                  <div className="h-full bg-white/40 rounded-full animate-[videoBufferBar_1.5s_ease-in-out_infinite]" />
                </div>
              </div>
            )}
          </>
        )}

        {!autoplay && (
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 z-10 ${
              isHovering || !isVisible ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Play className="h-5 w-5 text-white ml-0.5" fill="white" />
            </div>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-16 pb-3 px-3 z-10">
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
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-20">
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
