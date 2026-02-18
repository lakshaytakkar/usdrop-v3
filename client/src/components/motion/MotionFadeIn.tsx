

import { motion, HTMLMotionProps } from "motion/react"
import { useRef, ReactNode, useState, useEffect } from "react"
import { useInView } from "motion/react"
import { cn } from "@/lib/utils"
import { DURATION, DISTANCE, EASING, OPACITY } from "@/lib/motion"

interface MotionFadeInProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode
  distance?: number
  duration?: number
  delay?: number
  once?: boolean
  direction?: "up" | "down" | "left" | "right" | "none"
  reducedMotion?: boolean
  className?: string
}

/**
 * MotionFadeIn - Scroll-triggered fade-in component
 * 
 * @param distance - Distance to animate from (default: 16px)
 * @param duration - Animation duration in seconds (default: 0.3s)
 * @param delay - Animation delay in seconds (default: 0)
 * @param once - Animate only once when entering viewport (default: true)
 * @param direction - Animation direction (default: "up")
 * @param reducedMotion - Respect prefers-reduced-motion (auto-detected if not provided)
 */
export function MotionFadeIn({
  children,
  distance = DISTANCE.md,
  duration = DURATION.normal,
  delay = 0,
  once = true,
  direction = "up",
  reducedMotion: reducedMotionProp,
  className,
  ...props
}: MotionFadeInProps) {
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

  const getInitialPosition = () => {
    if (reducedMotion || direction === "none") {
      return {}
    }

    const positions: Record<string, { x?: number; y?: number }> = {
      up: { y: distance },
      down: { y: -distance },
      left: { x: distance },
      right: { x: -distance },
    }

    return positions[direction] || {}
  }

  const initialProps = {
    opacity: reducedMotion ? OPACITY.visible : OPACITY.hidden,
    ...getInitialPosition(),
  }

  const animateProps = {
    opacity: OPACITY.visible,
    x: 0,
    y: 0,
    transition: {
      duration: reducedMotion ? 0 : duration,
      delay: reducedMotion ? 0 : delay,
      ease: EASING.easeOutExpo,
    },
  }

  return (
    <motion.div
      ref={ref}
      initial={initialProps}
      animate={isInView ? animateProps : initialProps}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}



