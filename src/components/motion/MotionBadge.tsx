"use client"

import { motion, HTMLMotionProps } from "motion/react"
import { useRef, ReactNode, useState, useEffect } from "react"
import { useInView } from "motion/react"
import { cn } from "@/lib/utils"
import { DURATION, EASING, OPACITY } from "@/lib/motion"

type BadgeAnimation = "fade" | "bounce" | "pulse" | "scale"

interface MotionBadgeProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode
  animation?: BadgeAnimation
  delay?: number
  reducedMotion?: boolean
  className?: string
}

/**
 * MotionBadge - Animated badges with entrance effects
 * 
 * @param animation - Entrance animation: fade, bounce, pulse, or scale (default: "fade")
 * @param delay - Animation delay in seconds (default: 0)
 */
export function MotionBadge({
  children,
  animation = "fade",
  delay = 0,
  reducedMotion: reducedMotionProp,
  className,
  ...props
}: MotionBadgeProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
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

  const getInitialState = () => {
    if (reducedMotion) {
      return { opacity: OPACITY.visible, scale: 1 }
    }

    switch (animation) {
      case "fade":
        return { opacity: OPACITY.hidden }
      case "bounce":
        return { opacity: OPACITY.hidden, y: -20, scale: 0.8 }
      case "pulse":
        return { opacity: OPACITY.hidden, scale: 0.8 }
      case "scale":
        return { opacity: OPACITY.hidden, scale: 0 }
      default:
        return { opacity: OPACITY.hidden }
    }
  }

  const getAnimateState = () => {
    if (reducedMotion) {
      return { opacity: OPACITY.visible, scale: 1 }
    }

    const baseState: any = {
      opacity: OPACITY.visible,
      scale: 1,
      y: 0,
    }

    if (animation === "pulse") {
      return {
        ...baseState,
        scale: [1, 1.1, 1],
      }
    }

    return baseState
  }

  return (
    <motion.div
      ref={ref}
      initial={getInitialState()}
      animate={isInView ? getAnimateState() : getInitialState()}
      transition={{
        duration: reducedMotion ? 0 : DURATION.normal,
        delay: reducedMotion ? 0 : delay,
        ease: animation === "bounce" ? EASING.spring : EASING.easeOut,
        ...(animation === "pulse" && {
          repeat: Infinity,
          repeatDelay: 2,
        }),
      }}
      whileHover={
        reducedMotion
          ? {}
          : {
              scale: 1.1,
              transition: { duration: DURATION.fast },
            }
      }
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

