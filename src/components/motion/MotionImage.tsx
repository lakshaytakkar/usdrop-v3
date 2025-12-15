"use client"

import { motion, HTMLMotionProps } from "motion/react"
import Image, { ImageProps } from "next/image"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { hoverImage, hoverRest, SCALE, DURATION, EASING } from "@/lib/motion"

interface MotionImageProps extends Omit<ImageProps, "onMouseEnter" | "onMouseLeave"> {
  hoverScale?: number
  hoverOpacity?: boolean
  reducedMotion?: boolean
  className?: string
  containerClassName?: string
}

/**
 * MotionImage - Image wrapper with hover scale/opacity effects
 * 
 * @param hoverScale - Scale factor on hover (default: 1.05)
 * @param hoverOpacity - Enable opacity change on hover (default: false)
 * @param reducedMotion - Respect prefers-reduced-motion (auto-detected if not provided)
 */
export function MotionImage({
  hoverScale: scaleValue = SCALE.normal,
  hoverOpacity = false,
  reducedMotion: reducedMotionProp,
  className,
  containerClassName,
  ...imageProps
}: MotionImageProps) {
  const [reducedMotion, setReducedMotion] = useState(false)

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

  const hoverProps = reducedMotion
    ? {}
    : {
        scale: scaleValue,
        ...(hoverOpacity && { opacity: 0.9 }),
        transition: {
          duration: DURATION.normal,
          ease: EASING.easeOut,
        },
      }

  const restProps = reducedMotion
    ? {}
    : {
        scale: 1,
        opacity: 1,
        transition: {
          duration: DURATION.normal,
          ease: EASING.easeOut,
        },
      }

  return (
    <motion.div
      className={cn("relative overflow-hidden", containerClassName)}
      whileHover={hoverProps}
      initial={restProps}
      animate={restProps}
    >
      <Image
        className={cn(className)}
        {...imageProps}
      />
    </motion.div>
  )
}



