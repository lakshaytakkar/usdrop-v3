"use client"

import { motion, HTMLMotionProps, type TargetAndTransition } from "motion/react"
import { ReactNode, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { DURATION, EASING, SCALE } from "@/lib/motion"

interface MotionIconProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode
  hoverRotate?: number
  hoverScale?: number
  animation?: "none" | "rotate" | "scale" | "bounce" | "pulse"
  reducedMotion?: boolean
  className?: string
}

/**
 * MotionIcon - Icon wrapper with hover effects
 *
 * @param hoverRotate - Rotation angle on hover in degrees (default: 15)
 * @param hoverScale - Scale factor on hover (default: 1.1)
 * @param animation - Continuous animation: none, rotate, scale, bounce, or pulse
 */
export function MotionIcon({
  children,
  hoverRotate = 15,
  hoverScale = SCALE.normal,
  animation = "none",
  reducedMotion: reducedMotionProp,
  className,
  ...props
}: MotionIconProps) {
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

  const getAnimateProps = (): TargetAndTransition | undefined => {
    if (reducedMotion || animation === "none") {
      return undefined
    }

    switch (animation) {
      case "rotate":
        return {
          rotate: [0, 360],
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "linear" as const,
          },
        }
      case "scale":
        return {
          scale: [1, 1.2, 1],
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut" as const,
          },
        }
      case "bounce":
        return {
          y: [0, -10, 0],
          transition: {
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut" as const,
          },
        }
      case "pulse":
        return {
          scale: [1, 1.1, 1],
          transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut" as const,
          },
        }
      default:
        return undefined
    }
  }

  return (
    <motion.div
      animate={getAnimateProps()}
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}



