"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { DURATION, EASING } from "@/lib/motion"
import Image from "next/image"

interface BannerCarouselProps {
  children: React.ReactNode | React.ReactNode[]
  autoRotateInterval?: number // in milliseconds, default 6000ms (6 seconds)
}

export function BannerCarousel({ children, autoRotateInterval = 6000 }: BannerCarouselProps) {
  const banners = Array.isArray(children) ? children : [children]
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextBanner = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }, [banners.length])

  // Auto-rotate banners (only if more than one banner)
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(nextBanner, autoRotateInterval)
      return () => clearInterval(interval)
    }
  }, [nextBanner, autoRotateInterval, banners.length])

  const goToBanner = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="relative w-full h-[210px] rounded-xl overflow-hidden">
      {/* Banner Container */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{
              duration: DURATION.slow,
              ease: EASING.easeOut,
            }}
            className="absolute inset-0 w-full h-full"
          >
            {banners[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Dots - only show if more than one banner */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {banners.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToBanner(index)}
              className={`h-2 rounded-full ${
                index === currentIndex
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to banner ${index + 1}`}
              initial={{ width: index === currentIndex ? 32 : 8 }}
              animate={{ width: index === currentIndex ? 32 : 8 }}
              transition={{
                duration: DURATION.fast,
                ease: EASING.easeOut,
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Christmas Collection Banner Component
export function ChristmasBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-red-600 to-orange-500 p-6 text-white h-full w-full">
      {/* Grainy texture layers */}
      <div
        className="absolute inset-0 opacity-[0.7]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter4'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter4)'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
      ></div>
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter5'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.0' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter5)'/%3E%3C/svg%3E")`,
          mixBlendMode: "multiply",
        }}
      ></div>
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter6'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter6)'/%3E%3C/svg%3E")`,
          mixBlendMode: "screen",
        }}
      ></div>
      {/* Right side image container */}
      <div className="absolute right-0 top-0 bottom-0 w-[50%] flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-end pr-4">
          {/* Christmas icons */}
          <div className="flex items-center gap-2">
            <div className="relative w-24 h-24 cursor-pointer">
              <Image
                src="/christmas-icons/Object 01.png"
                alt="Christmas icon 1"
                width={96}
                height={96}
                className="object-contain"
                decoding="async"
                style={{
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                }}
                loading="lazy"
                quality={85}
              />
            </div>
            <div className="relative w-24 h-24 cursor-pointer">
              <Image
                src="/christmas-icons/Object 02.png"
                alt="Christmas icon 2"
                width={96}
                height={96}
                className="object-contain"
                decoding="async"
                style={{
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                }}
                loading="lazy"
                quality={85}
              />
            </div>
            <div className="relative w-24 h-24 cursor-pointer">
              <Image
                src="/christmas-icons/Object 03.png"
                alt="Christmas icon 3"
                width={96}
                height={96}
                className="object-contain"
                decoding="async"
                style={{
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                }}
                loading="lazy"
                quality={85}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content on the left */}
      <div className="relative z-10 max-w-[48%] flex flex-col justify-center h-full">
        <h2 className="text-3xl font-bold mb-3 leading-tight">Christmas Collection</h2>
        <p className="text-white/90 mb-4 text-sm leading-relaxed">
          Create ultra-realistic avatar videos with a single image
        </p>
        <Button className="bg-black text-white hover:bg-black/80 rounded-lg px-5 py-2 font-medium transition-all w-fit flex items-center gap-2">
          <span>CREATE NOW</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}

