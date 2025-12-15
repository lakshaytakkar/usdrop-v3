"use client"

import { motion } from "motion/react"
import { ReactNode, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface MotionMarqueeProps {
  children: ReactNode[]
  speed?: number
  direction?: "left" | "right"
  pauseOnHover?: boolean
  className?: string
  reducedMotion?: boolean
}

/**
 * MotionMarquee - Infinite scrolling marquee with Motion Primitives
 * 
 * @param speed - Animation speed in seconds (default: 50)
 * @param direction - Scroll direction (default: "left")
 * @param pauseOnHover - Pause animation on hover (default: true)
 */
export function MotionMarquee({
  children,
  speed = 50,
  direction = "left",
  pauseOnHover = true,
  className,
  reducedMotion: reducedMotionProp,
}: MotionMarqueeProps) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

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

  // Duplicate children for seamless loop
  const duplicatedChildren = [...children, ...children]

  const xValue = direction === "left" ? "-50%" : "50%"

  if (reducedMotion) {
    return (
      <div className={cn("flex overflow-hidden", className)}>
        <div className="flex space-x-8">
          {children.map((child, i) => (
            <div key={i}>{child}</div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn("relative overflow-hidden w-full", className)}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <motion.div
        className="flex space-x-8 w-max"
        animate={{
          x: isPaused ? undefined : [0, xValue],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {duplicatedChildren.map((child, i) => (
          <div key={i}>{child}</div>
        ))}
      </motion.div>
    </div>
  )
}



