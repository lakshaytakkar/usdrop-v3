

import { motion, HTMLMotionProps } from "motion/react"
import { ReactNode, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { DURATION, EASING, SCALE } from "@/lib/motion"

interface MotionButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode
  variant?: "default" | "glow" | "ripple" | "magnetic"
  reducedMotion?: boolean
  className?: string
}

/**
 * MotionButton - Enhanced button with multiple hover states
 * 
 * @param variant - Button animation variant: default, glow, ripple, or magnetic
 */
export function MotionButton({
  children,
  variant = "default",
  reducedMotion: reducedMotionProp,
  className,
  ...props
}: MotionButtonProps) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])

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

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (variant === "ripple" && !reducedMotion) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const newRipple = {
        x,
        y,
        id: Date.now(),
      }

      setRipples((prev) => [...prev, newRipple])

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
      }, 600)
    }

    props.onClick?.(e)
  }

  const getHoverProps = () => {
    if (reducedMotion) return {}

    switch (variant) {
      case "glow":
        return {
          scale: SCALE.normal,
          boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
        }
      case "ripple":
        return {
          scale: SCALE.normal,
        }
      case "magnetic":
        return {
          scale: SCALE.normal,
        }
      default:
        return {
          scale: SCALE.normal,
        }
    }
  }

  return (
    <motion.button
      whileHover={getHoverProps()}
      whileTap={reducedMotion ? {} : { scale: 0.95 }}
      transition={{
        duration: DURATION.fast,
        ease: EASING.easeOut,
      }}
      onClick={handleClick}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      {children}
      {variant === "ripple" &&
        !reducedMotion &&
        ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-white/30"
            initial={{
              x: ripple.x,
              y: ripple.y,
              width: 0,
              height: 0,
            }}
            animate={{
              width: 200,
              height: 200,
              x: ripple.x - 100,
              y: ripple.y - 100,
              opacity: [0.5, 0],
            }}
            transition={{
              duration: 0.6,
              ease: EASING.easeOut,
            }}
          />
        ))}
    </motion.button>
  )
}



