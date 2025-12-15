"use client"

import { motion, AnimatePresence } from "motion/react"
import { ReactNode, useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { DURATION, EASING } from "@/lib/motion"

interface MotionCarouselProps {
  children: ReactNode[]
  autoPlay?: boolean
  autoPlayInterval?: number
  pauseOnHover?: boolean
  showDots?: boolean
  showArrows?: boolean
  swipeable?: boolean
  className?: string
  reducedMotion?: boolean
}

/**
 * MotionCarousel - Advanced carousel with smooth transitions
 * 
 * @param autoPlay - Enable auto-play (default: false)
 * @param autoPlayInterval - Auto-play interval in ms (default: 5000)
 * @param pauseOnHover - Pause on hover (default: true)
 * @param showDots - Show navigation dots (default: true)
 * @param showArrows - Show navigation arrows (default: false)
 * @param swipeable - Enable swipe gestures (default: true)
 */
export function MotionCarousel({
  children,
  autoPlay = false,
  autoPlayInterval = 5000,
  pauseOnHover = true,
  showDots = true,
  showArrows = false,
  swipeable = true,
  className,
  reducedMotion: reducedMotionProp,
}: MotionCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [dragStart, setDragStart] = useState(0)

  useEffect(() => {
    if (reducedMotionProp !== undefined) {
      setReducedMotion(reducedMotionProp)
      return
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [reducedMotionProp])

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % children.length)
  }, [children.length])

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + children.length) % children.length)
  }, [children.length])

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  useEffect(() => {
    if (!autoPlay || isPaused || reducedMotion) return

    const interval = setInterval(next, autoPlayInterval)
    return () => clearInterval(interval)
  }, [autoPlay, isPaused, autoPlayInterval, next, reducedMotion])

  const handleDragStart = (event: any, info: any) => {
    setDragStart(info.point.x)
  }

  const handleDragEnd = (event: any, info: any) => {
    if (!swipeable) return

    const diff = dragStart - info.point.x
    const threshold = 50

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        next()
      } else {
        prev()
      }
    }
  }

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{
              duration: reducedMotion ? 0 : DURATION.normal,
              ease: EASING.easeOut,
            }}
            drag={swipeable ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className="w-full"
          >
            {children[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {showArrows && children.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur rounded-full p-2 shadow-lg hover:bg-white transition-colors"
            aria-label="Previous"
          >
            ←
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur rounded-full p-2 shadow-lg hover:bg-white transition-colors"
            aria-label="Next"
          >
            →
          </button>
        </>
      )}

      {showDots && children.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {children.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goTo(index)}
              className={cn(
                "h-2 rounded-full transition-colors",
                index === currentIndex ? "bg-blue-600 w-8" : "bg-gray-300 w-2"
              )}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}



