/**
 * Motion Primitives Animation Variants
 * Predefined animation variants for common patterns
 */

import { Variant, Variants } from "motion/react"
import { DURATION, DISTANCE, EASING, OPACITY, STAGGER } from "./constants"

// Base fade variants
export const fadeIn: Variant = {
  opacity: OPACITY.hidden,
}

export const fadeInVisible: Variant = {
  opacity: OPACITY.visible,
  transition: {
    duration: DURATION.normal,
    ease: EASING.easeOut,
  },
}

// Fade in with upward movement
export const fadeInUp: Variant = {
  opacity: OPACITY.hidden,
  y: DISTANCE.md,
}

export const fadeInUpVisible: Variant = {
  opacity: OPACITY.visible,
  y: 0,
  transition: {
    duration: DURATION.normal,
    ease: EASING.easeOutExpo,
  },
}

// Fade in with downward movement
export const fadeInDown: Variant = {
  opacity: OPACITY.hidden,
  y: -DISTANCE.md,
}

export const fadeInDownVisible: Variant = {
  opacity: OPACITY.visible,
  y: 0,
  transition: {
    duration: DURATION.normal,
    ease: EASING.easeOutExpo,
  },
}

// Slide in from left
export const slideInLeft: Variant = {
  opacity: OPACITY.hidden,
  x: -DISTANCE.lg,
}

export const slideInLeftVisible: Variant = {
  opacity: OPACITY.visible,
  x: 0,
  transition: {
    duration: DURATION.normal,
    ease: EASING.easeOutExpo,
  },
}

// Slide in from right
export const slideInRight: Variant = {
  opacity: OPACITY.hidden,
  x: DISTANCE.lg,
}

export const slideInRightVisible: Variant = {
  opacity: OPACITY.visible,
  x: 0,
  transition: {
    duration: DURATION.normal,
    ease: EASING.easeOutExpo,
  },
}

// Scale in
export const scaleIn: Variant = {
  opacity: OPACITY.hidden,
  scale: 0.95,
}

export const scaleInVisible: Variant = {
  opacity: OPACITY.visible,
  scale: 1,
  transition: {
    duration: DURATION.normal,
    ease: EASING.easeOutExpo,
  },
}

// Stagger container variant
export const staggerContainer: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
  },
  visible: {
    opacity: OPACITY.visible,
    transition: {
      staggerChildren: STAGGER.md,
      delayChildren: 0.1,
    },
  },
}

// Stagger item variant
export const staggerItem: Variants = {
  hidden: {
    opacity: OPACITY.hidden,
    y: DISTANCE.md,
  },
  visible: {
    opacity: OPACITY.visible,
    y: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASING.easeOutExpo,
    },
  },
}

// Hover variants for cards
export const cardHover: Variant = {
  y: -4,
  transition: {
    duration: DURATION.fast,
    ease: EASING.easeOut,
  },
}

export const cardRest: Variant = {
  y: 0,
  transition: {
    duration: DURATION.fast,
    ease: EASING.easeOut,
  },
}

// Image hover variants
export const imageHover: Variant = {
  scale: 1.05,
  transition: {
    duration: DURATION.normal,
    ease: EASING.easeOut,
  },
}

export const imageRest: Variant = {
  scale: 1,
  transition: {
    duration: DURATION.normal,
    ease: EASING.easeOut,
  },
}

// Icon hover variants
export const iconHover: Variant = {
  scale: 1.1,
  rotate: 5,
  transition: {
    duration: DURATION.fast,
    ease: EASING.springGentle,
  },
}

export const iconRest: Variant = {
  scale: 1,
  rotate: 0,
  transition: {
    duration: DURATION.fast,
    ease: EASING.easeOut,
  },
}



