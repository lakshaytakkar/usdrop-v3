"use client"

import { motion, HTMLMotionProps } from "motion/react"
import { useRef, ReactNode, useState, useEffect, HTMLAttributes } from "react"
import { useScrollPosition } from "@/lib/motion/scroll"
import { cn } from "@/lib/utils"

interface MotionParallaxProps extends Omit<HTMLMotionProps<"div">, "children" | "style"> {
  children: ReactNode
  speed?: number
  direction?: "up" | "down" | "left" | "right"
  reducedMotion?: boolean
  className?: string
  style?: React.CSSProperties
}

/**
 * MotionParallax - Parallax scroll effect component
 * 
 * @param speed - Parallax speed multiplier (default: 0.5)
 * @param direction - Parallax direction (default: "up")
 * @param reducedMotion - Respect prefers-reduced-motion (auto-detected if not provided)
 */
export function MotionParallax({
  children,
  speed = 0.5,
  direction = "up",
  reducedMotion: reducedMotionProp,
  className,
  style,
  ...props
}: MotionParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const scrollPosition = useScrollPosition()
  const [reducedMotion, setReducedMotion] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

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

  useEffect(() => {
    if (reducedMotion || !ref.current) return

    const element = ref.current
    const rect = element.getBoundingClientRect()
    const elementTop = rect.top + scrollPosition.y
    const elementCenter = elementTop + rect.height / 2
    const viewportCenter = scrollPosition.y + window.innerHeight / 2
    const distance = viewportCenter - elementCenter

    const parallaxOffset = distance * speed

    let x = 0
    let y = 0

    switch (direction) {
      case "up":
        y = -parallaxOffset
        break
      case "down":
        y = parallaxOffset
        break
      case "left":
        x = -parallaxOffset
        break
      case "right":
        x = parallaxOffset
        break
    }

    setOffset({ x, y })
  }, [scrollPosition, speed, direction, reducedMotion])

  if (reducedMotion) {
    return (
      <div ref={ref} className={cn(className)} style={style}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      animate={{
        x: offset.x,
        y: offset.y,
      }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 30,
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

