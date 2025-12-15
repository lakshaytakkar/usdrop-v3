"use client"

import { motion, HTMLMotionProps } from "motion/react"
import { useRef, useState, useEffect } from "react"
import { useInView } from "motion/react"
import { cn } from "@/lib/utils"
import { DURATION, EASING } from "@/lib/motion"

interface MotionCounterProps extends Omit<HTMLMotionProps<"div">, "children"> {
  value: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  reducedMotion?: boolean
  className?: string
}

/**
 * MotionCounter - Animated number counter
 * 
 * @param value - Target number to count to
 * @param duration - Animation duration in seconds (default: 2)
 * @param decimals - Number of decimal places (default: 0)
 * @param prefix - Text before number (e.g., "$")
 * @param suffix - Text after number (e.g., "+")
 */
export function MotionCounter({
  value,
  duration = 2,
  decimals = 0,
  prefix = "",
  suffix = "",
  reducedMotion: reducedMotionProp,
  className,
  ...props
}: MotionCounterProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
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

  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (!isInView || reducedMotion) {
      setDisplayValue(value)
      return
    }

    let startTime: number | null = null
    const startValue = 0

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const elapsed = (currentTime - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)

      // Use cubic ease-out for smooth animation
      const easedProgress = 1 - Math.pow(1 - progress, 3)

      const currentValue = startValue + (value - startValue) * easedProgress
      setDisplayValue(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayValue(value)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, value, duration, reducedMotion])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      className={cn(className)}
      {...props}
    >
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </motion.div>
  )
}

