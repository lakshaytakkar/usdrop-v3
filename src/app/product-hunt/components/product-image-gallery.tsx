"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ZoomIn, Play, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductImageGalleryProps {
  images: string[]
  videos?: string[]
}

export function ProductImageGallery({ images, videos = [] }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const mainImageRef = useRef<HTMLDivElement>(null)

  // Ensure we have at least 5 items (images + videos) for the grid
  const allMedia = [...images, ...videos]
  const displayImages = images.length > 0 ? images : [images[0] || '/demo-products/Screenshot 2024-07-24 185228.png']
  const displayVideos = videos || []
  
  // Create grid items: main image + 4 thumbnails
  const gridItems = [
    displayImages[0],
    displayImages[1] || displayImages[0],
    displayImages[2] || displayImages[0],
    displayImages[3] || displayImages[0],
    displayImages[4] || displayImages[0],
  ].slice(0, 5)

  const isVideo = (index: number) => {
    return index < displayVideos.length && displayVideos[index]
  }

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current) return
    
    const rect = mainImageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setZoomPosition({ x, y })
  }

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index)
    setIsLoading(true)
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <>
      <div className="space-y-3 min-w-0 max-w-full">
        {/* Main Image - Shopify Style */}
        <Card 
          className="overflow-hidden p-0 group cursor-zoom-in relative min-w-0 max-w-full"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          onClick={() => openLightbox(selectedIndex)}
        >
          <div 
            ref={mainImageRef}
            className="relative aspect-square w-full bg-muted overflow-hidden min-w-0 max-w-full"
          >
            {isLoading && (
              <div className="absolute inset-0">
                <Skeleton className="w-full h-full animate-pulse" />
              </div>
            )}
            {isVideo(selectedIndex) && displayVideos[selectedIndex] ? (
              <video
                src={displayVideos[selectedIndex]}
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-300",
                  isLoading ? "opacity-0" : "opacity-100"
                )}
                controls
                onLoadedData={handleImageLoad}
                playsInline
              />
            ) : (
              <Image
                src={gridItems[selectedIndex] || gridItems[0]}
                alt={`Product view ${selectedIndex + 1}`}
                fill
                className={cn(
                  "object-cover transition-all duration-300",
                  isZoomed ? "scale-150" : "scale-100",
                  isLoading ? "opacity-0" : "opacity-100"
                )}
                style={{
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                }}
                onLoad={handleImageLoad}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
            
            {/* Zoom Indicator */}
            {!isVideo(selectedIndex) && (
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-sm rounded-full p-2">
                <ZoomIn className="h-5 w-5 text-white" />
              </div>
            )}

            {/* Video Play Indicator */}
            {isVideo(selectedIndex) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div className="rounded-full bg-white/90 p-4">
                  <Play className="h-8 w-8 text-primary fill-primary" />
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Thumbnail Grid - 4 Images */}
        <div className="grid grid-cols-4 gap-2 min-w-0 max-w-full">
          {gridItems.slice(1, 5).map((item, index) => {
            const actualIndex = index + 1
            const isVideoItem = isVideo(actualIndex)
            const isSelected = selectedIndex === actualIndex
            
            return (
              <button
                key={index}
                onClick={() => handleThumbnailClick(actualIndex)}
                className={cn(
                  "relative aspect-square rounded-md overflow-hidden border-2 transition-all duration-200 group",
                  isSelected
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent hover:border-muted-foreground/50"
                )}
              >
                {isVideoItem && displayVideos[actualIndex] ? (
                  <video
                    src={displayVideos[actualIndex]}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                ) : (
                  <Image
                    src={item}
                    alt={`Product thumbnail ${actualIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 12.5vw"
                  />
                )}
                
                {/* Video Indicator */}
                {isVideoItem && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors">
                    <Play className="h-4 w-4 text-white fill-white" />
                  </div>
                )}
                
                {/* Selected Overlay */}
                {isSelected && (
                  <div className="absolute inset-0 bg-primary/10" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-7xl w-full p-0 bg-black/95 border-none">
          <div className="relative w-full h-[90vh] flex items-center justify-center">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>
            
            {isVideo(lightboxIndex) && displayVideos[lightboxIndex] ? (
              <video
                src={displayVideos[lightboxIndex]}
                className="max-w-full max-h-full object-contain"
                controls
                autoPlay
              />
            ) : (
              <Image
                src={gridItems[lightboxIndex] || gridItems[0]}
                alt={`Product view ${lightboxIndex + 1}`}
                width={1200}
                height={1200}
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}























