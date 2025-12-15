"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ProductVideoGalleryProps {
  videos?: string[]
  className?: string
}

export function ProductVideoGallery({ videos = [], className }: ProductVideoGalleryProps) {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null)
  const [muted, setMuted] = useState(true)
  const [loadedVideos, setLoadedVideos] = useState<Set<number>>(new Set())
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  // Sample videos from assets if none provided
  const displayVideos = videos.length > 0 
    ? videos 
    : [
        '/videos/7556992074424372511.mp4',
        '/videos/7563181916459994399.mp4',
        '/videos/7564264190710418702.mp4',
        '/videos/7567204602899221815.mp4',
      ].filter(Boolean)

  useEffect(() => {
    // Pause all videos when a new one starts playing
    videoRefs.current.forEach((video, index) => {
      if (video && index !== playingIndex && !video.paused) {
        video.pause()
      }
    })
  }, [playingIndex])

  const handlePlay = (index: number) => {
    const video = videoRefs.current[index]
    if (!video) return

    if (playingIndex === index && !video.paused) {
      video.pause()
      setPlayingIndex(null)
    } else {
      setPlayingIndex(index)
      video.play().catch(() => {
        // Auto-play blocked
      })
    }
  }

  const handleVideoLoad = (index: number) => {
    setLoadedVideos(prev => new Set([...prev, index]))
  }

  const handleFullscreen = (index: number) => {
    const video = videoRefs.current[index]
    if (!video) return

    if (video.requestFullscreen) {
      video.requestFullscreen()
    } else if ((video as any).webkitRequestFullscreen) {
      (video as any).webkitRequestFullscreen()
    } else if ((video as any).mozRequestFullScreen) {
      (video as any).mozRequestFullScreen()
    }
  }

  if (displayVideos.length === 0) {
    return (
      <Card className={cn("p-6", className)}>
        <p className="text-sm text-muted-foreground text-center">
          No product videos available
        </p>
      </Card>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Product Videos</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMuted(!muted)}
          className="h-8"
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayVideos.map((videoSrc, index) => {
          const isPlaying = playingIndex === index
          const isLoaded = loadedVideos.has(index)

          return (
            <Card
              key={index}
              className="overflow-hidden p-0 group relative"
            >
              <div className="relative aspect-video bg-muted">
                {!isLoaded && (
                  <div className="absolute inset-0">
                    <Skeleton className="w-full h-full animate-pulse" />
                  </div>
                )}
                
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el
                  }}
                  src={videoSrc}
                  className={cn(
                    "w-full h-full object-cover transition-opacity duration-300",
                    isLoaded ? "opacity-100" : "opacity-0"
                  )}
                  muted={muted}
                  playsInline
                  loop
                  onLoadedData={() => handleVideoLoad(index)}
                  onEnded={() => setPlayingIndex(null)}
                />

                {/* Play/Pause Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-16 w-16 rounded-full bg-white/90 hover:bg-white text-primary"
                    onClick={() => handlePlay(index)}
                  >
                    {isPlaying ? (
                      <Pause className="h-8 w-8 fill-primary" />
                    ) : (
                      <Play className="h-8 w-8 fill-primary" />
                    )}
                  </Button>
                </div>

                {/* Fullscreen Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white h-8 w-8"
                  onClick={() => handleFullscreen(index)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>

                {/* Video Info Badge */}
                <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black/70 backdrop-blur-sm rounded px-2 py-1">
                    <p className="text-xs text-white">Video {index + 1}</p>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Single Video View (if only one video) */}
      {displayVideos.length === 1 && (
        <Card className="overflow-hidden p-0">
          <div className="relative aspect-video bg-muted">
            <video
              ref={(el) => {
                videoRefs.current[0] = el
              }}
              src={displayVideos[0]}
              className="w-full h-full object-cover"
              controls
              muted={muted}
              playsInline
              onLoadedData={() => handleVideoLoad(0)}
            />
          </div>
        </Card>
      )}
    </div>
  )
}

