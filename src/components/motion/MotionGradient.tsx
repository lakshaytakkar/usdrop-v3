"use client"

import { motion, HTMLMotionProps } from "motion/react"
import { ReactNode, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface MotionGradientProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode
  colors?: string[]
  direction?: "horizontal" | "vertical" | "diagonal" | "radial"
  animate?: boolean
  speed?: number
  reducedMotion?: boolean
  className?: string
}

/**
 * MotionGradient - Animated gradient backgrounds
 * 
 * @param colors - Array of color strings (default: blue gradient)
 * @param direction - Gradient direction (default: "diagonal")
 * @param animate - Enable animation (default: true)
 * @param speed - Animation speed (default: 5)
 */
export function MotionGradient({
  children,
  colors = ["#3b82f6", "#8b5cf6", "#ec4899"],
  direction = "diagonal",
  animate = true,
  speed = 5,
  reducedMotion: reducedMotionProp,
  className,
  ...props
}: MotionGradientProps) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 })

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

  const getGradientStyle = () => {
    if (reducedMotion || !animate) {
      const gradientColors = colors.join(", ")
      return {
        background: `linear-gradient(${getDirectionAngle()}, ${gradientColors})`,
      }
    }

    const gradientColors = colors.join(", ")
    return {
      background: `linear-gradient(${getDirectionAngle()}, ${gradientColors})`,
      backgroundSize: "200% 200%",
      backgroundPosition: `${gradientPosition.x}% ${gradientPosition.y}%`,
    }
  }

  const getDirectionAngle = () => {
    switch (direction) {
      case "horizontal":
        return "90deg"
      case "vertical":
        return "180deg"
      case "diagonal":
        return "135deg"
      case "radial":
        return "circle"
      default:
        return "135deg"
    }
  }

  useEffect(() => {
    if (reducedMotion || !animate) return

    const interval = setInterval(() => {
      setGradientPosition((prev) => ({
        x: (prev.x + speed) % 100,
        y: (prev.y + speed) % 100,
      }))
    }, 50)

    return () => clearInterval(interval)
  }, [reducedMotion, animate, speed])

  return (
    <motion.div
      style={getGradientStyle()}
      animate={
        animate && !reducedMotion
          ? {
              backgroundPosition: [
                `${gradientPosition.x}% ${gradientPosition.y}%`,
                `${(gradientPosition.x + 50) % 100}% ${(gradientPosition.y + 50) % 100}%`,
                `${gradientPosition.x}% ${gradientPosition.y}%`,
              ],
            }
          : {}
      }
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "linear",
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}



