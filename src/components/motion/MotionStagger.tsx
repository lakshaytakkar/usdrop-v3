"use client"

import { motion, HTMLMotionProps } from "motion/react"
import { useRef, ReactNode, useState, useEffect, Children, cloneElement, isValidElement } from "react"
import { useInView } from "motion/react"
import { cn } from "@/lib/utils"
import { DURATION, DISTANCE, EASING, OPACITY, STAGGER } from "@/lib/motion"

interface MotionStaggerProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode
  staggerDelay?: number
  once?: boolean
  reducedMotion?: boolean
  className?: string
}

/**
 * MotionStagger - Container for staggered animations
 * Automatically applies stagger animation to children
 * 
 * @param staggerDelay - Delay between each child animation (default: 0.1s)
 * @param once - Animate only once when entering viewport (default: true)
 * @param reducedMotion - Respect prefers-reduced-motion (auto-detected if not provided)
 */
export function MotionStagger({
  children,
  staggerDelay = STAGGER.md,
  once = true,
  reducedMotion: reducedMotionProp,
  className,
  ...props
}: MotionStaggerProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount: 0.1 })
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

  const containerVariants = {
    hidden: {
      opacity: reducedMotion ? OPACITY.visible : OPACITY.hidden,
    },
    visible: {
      opacity: OPACITY.visible,
      transition: {
        staggerChildren: reducedMotion ? 0 : staggerDelay,
        delayChildren: reducedMotion ? 0 : 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: reducedMotion ? OPACITY.visible : OPACITY.hidden,
      y: reducedMotion ? 0 : DISTANCE.md,
    },
    visible: {
      opacity: OPACITY.visible,
      y: 0,
      transition: {
        duration: reducedMotion ? 0 : DURATION.normal,
        ease: EASING.easeOutExpo,
      },
    },
  }

  // Process children to add motion variants
  const processedChildren = Children.map(children, (child, index) => {
    if (!isValidElement(child)) {
      return (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      )
    }

    // Check if it's already a motion component
    const childType = child.type as any
    const isMotionComponent =
      typeof childType === "function" &&
      (childType.displayName?.includes("motion") ||
        childType.name?.includes("motion") ||
        childType.__motionComponent)

    if (isMotionComponent) {
      return cloneElement(child, {
        key: child.key || index,
        variants: itemVariants,
      } as any)
    }

    // Wrap regular elements in motion.div
    return (
      <motion.div key={child.key || index} variants={itemVariants}>
        {child}
      </motion.div>
    )
  })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={cn(className)}
      {...props}
    >
      {processedChildren}
    </motion.div>
  )
}



