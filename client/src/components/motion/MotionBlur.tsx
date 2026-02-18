

import { motion, HTMLMotionProps } from "motion/react"
import { useRef, ReactNode, useState, useEffect } from "react"
import { useInView } from "motion/react"
import { cn } from "@/lib/utils"
import { DURATION, EASING, OPACITY } from "@/lib/motion"

interface MotionBlurProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode
  blurAmount?: number
  trigger?: "scroll" | "hover" | "always"
  reducedMotion?: boolean
  className?: string
}

/**
 * MotionBlur - Blur-in/blur-out effects
 * 
 * @param blurAmount - Blur amount in pixels (default: 10)
 * @param trigger - Animation trigger: scroll, hover, or always (default: "scroll")
 */
export function MotionBlur({
  children,
  blurAmount = 10,
  trigger = "scroll",
  reducedMotion: reducedMotionProp,
  className,
  ...props
}: MotionBlurProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

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

  const getBlurState = () => {
    if (reducedMotion) {
      return { filter: "blur(0px)", opacity: OPACITY.visible }
    }

    switch (trigger) {
      case "scroll":
        return isInView
          ? { filter: "blur(0px)", opacity: OPACITY.visible }
          : { filter: `blur(${blurAmount}px)`, opacity: OPACITY.hidden }
      case "hover":
        return isHovered
          ? { filter: "blur(0px)", opacity: OPACITY.visible }
          : { filter: `blur(${blurAmount}px)`, opacity: OPACITY.medium }
      case "always":
        return { filter: "blur(0px)", opacity: OPACITY.visible }
      default:
        return { filter: "blur(0px)", opacity: OPACITY.visible }
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={
        trigger === "scroll"
          ? { filter: `blur(${blurAmount}px)`, opacity: OPACITY.hidden }
          : undefined
      }
      animate={getBlurState()}
      onMouseEnter={() => trigger === "hover" && setIsHovered(true)}
      onMouseLeave={() => trigger === "hover" && setIsHovered(false)}
      transition={{
        duration: reducedMotion ? 0 : DURATION.normal,
        ease: EASING.easeOut,
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}



