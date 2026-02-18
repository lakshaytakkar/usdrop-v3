

import { motion, HTMLMotionProps } from "motion/react"
import { useRef, ReactNode, useState, useEffect } from "react"
import { useInView } from "motion/react"
import { cn } from "@/lib/utils"
import { DURATION, DISTANCE, EASING, OPACITY } from "@/lib/motion"

type RevealStyle = "slide" | "fade" | "scale" | "clip" | "mask"

interface MotionRevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode
  revealStyle?: RevealStyle
  direction?: "up" | "down" | "left" | "right"
  delay?: number
  duration?: number
  once?: boolean
  reducedMotion?: boolean
  className?: string
}

/**
 * MotionReveal - Advanced reveal animations
 *
 * @param revealStyle - Reveal style: slide, fade, scale, clip, mask
 * @param direction - Animation direction (default: "up")
 * @param delay - Animation delay in seconds (default: 0)
 * @param duration - Animation duration in seconds (default: 0.5)
 * @param once - Animate only once (default: true)
 */
export function MotionReveal({
  children,
  revealStyle = "fade",
  direction = "up",
  delay = 0,
  duration = DURATION.slow,
  once = true,
  reducedMotion: reducedMotionProp,
  className,
  ...props
}: MotionRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount: 0.2 })
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
      return { opacity: OPACITY.visible }
    }

    const baseState: any = {}

    switch (revealStyle) {
      case "slide":
        if (direction === "up") baseState.y = DISTANCE.lg
        if (direction === "down") baseState.y = -DISTANCE.lg
        if (direction === "left") baseState.x = DISTANCE.lg
        if (direction === "right") baseState.x = -DISTANCE.lg
        baseState.opacity = OPACITY.hidden
        break
      case "fade":
        baseState.opacity = OPACITY.hidden
        break
      case "scale":
        baseState.opacity = OPACITY.hidden
        baseState.scale = 0.8
        break
      case "clip":
        baseState.clipPath = "inset(100% 0 0 0)"
        baseState.opacity = OPACITY.hidden
        break
      case "mask":
        baseState.maskImage = "linear-gradient(to bottom, transparent, transparent)"
        baseState.opacity = OPACITY.hidden
        break
    }

    return baseState
  }

  const getAnimateState = () => {
    if (reducedMotion) {
      return { opacity: OPACITY.visible }
    }

    const baseState: any = {
      opacity: OPACITY.visible,
      x: 0,
      y: 0,
      scale: 1,
    }

    switch (revealStyle) {
      case "clip":
        baseState.clipPath = "inset(0 0 0 0)"
        break
      case "mask":
        baseState.maskImage = "linear-gradient(to bottom, black, black)"
        break
    }

    return baseState
  }

  return (
    <motion.div
      ref={ref}
      initial={getInitialState()}
      animate={isInView ? getAnimateState() : getInitialState()}
      transition={{
        duration: reducedMotion ? 0 : duration,
        delay: reducedMotion ? 0 : delay,
        ease: EASING.easeOutExpo,
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}



