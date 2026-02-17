/**
 * Motion Primitives Hover Effect Utilities
 * Standardized hover effect functions for consistent interactions
 */

import { DURATION, EASING, SCALE, DISTANCE } from "./constants"

/**
 * Hover lift effect - subtle translateY on hover
 */
export const hoverLift = (distance: number = -4) => ({
  transition: {
    duration: DURATION.fast,
    ease: EASING.easeOut,
  },
})

/**
 * Hover scale effect - scale transform
 */
export const hoverScale = (scale: number = SCALE.normal) => ({
  transition: {
    duration: DURATION.fast,
    ease: EASING.easeOut,
  },
})

/**
 * Hover glow effect - shadow/glow animation
 */
export const hoverGlow = (shadow: string = "0 10px 25px rgba(0, 0, 0, 0.15)") => ({
  transition: {
    duration: DURATION.fast,
    ease: EASING.easeOut,
  },
})

/**
 * Combined hover effects for cards
 */
export const hoverCard = {
  transition: {
    duration: DURATION.fast,
    ease: EASING.easeOut,
  },
}

/**
 * Combined hover effects for images
 */
export const hoverImage = {
  transition: {
    duration: DURATION.normal,
    ease: EASING.easeOut,
  },
}

/**
 * Hover effect for icons - rotation and scale
 */
export const hoverIcon = (rotate: number = 5) => ({
  transition: {
    duration: DURATION.fast,
    ease: EASING.springGentle,
  },
})

/**
 * Hover border effect - border color/width animation
 */
export const hoverBorder = (color: string = "rgba(59, 130, 246, 0.5)") => ({
  borderColor: color,
  transition: {
    duration: DURATION.fast,
    ease: EASING.easeOut,
  },
})

/**
 * Rest state for hover effects
 */
export const hoverRest = {
  transition: {
    duration: DURATION.fast,
    ease: EASING.easeOut,
  },
}



