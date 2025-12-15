"use client"

import { motion, HTMLMotionProps } from "motion/react"
import { ReactNode, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { hoverCard, hoverRest, SCALE, DURATION, EASING } from "@/lib/motion"

interface MotionCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode
  hoverScale?: number
  hoverShadow?: boolean
  hoverLift?: boolean
  delay?: number
  reducedMotion?: boolean
  className?: string
}

/**
 * MotionCard - Standardized card component with hover effects
 * 
 * @param hoverScale - Scale factor on hover (default: 1.02)
 * @param hoverShadow - Enable shadow enhancement on hover (default: true)
 * @param hoverLift - Enable lift effect on hover (default: true)
 * @param delay - Animation delay in seconds (default: 0)
 * @param reducedMotion - Respect prefers-reduced-motion (auto-detected if not provided)
 */
export function MotionCard({
  children,
  hoverScale: scaleValue = SCALE.subtle,
  hoverShadow = true,
  hoverLift = true,
  delay = 0,
  reducedMotion: reducedMotionProp,
  className,
  ...props
}: MotionCardProps) {
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
        ...(hoverLift && { y: -4 }),
        ...(hoverShadow && {
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
        }),
        scale: scaleValue,
        transition: {
          duration: DURATION.fast,
          ease: EASING.easeOut,
        },
      }

  const restProps = reducedMotion
    ? {}
    : {
        y: 0,
        scale: 1,
        boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
        transition: {
          duration: DURATION.fast,
          ease: EASING.easeOut,
        },
      }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reducedMotion ? 0 : DURATION.normal,
        delay: reducedMotion ? 0 : delay,
        ease: EASING.easeOutExpo,
      }}
      whileHover={hoverProps}
      whileTap={reducedMotion ? {} : { scale: 0.98 }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}



