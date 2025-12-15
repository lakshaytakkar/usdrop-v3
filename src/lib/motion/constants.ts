/**
 * Motion Primitives Animation Constants
 * Standardized timing, easing, and distance values for consistent animations
 */

// Timing durations (in seconds)
export const DURATION = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.7,
} as const

// Standard animation distances (in pixels)
export const DISTANCE = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const

// Stagger delays (in seconds)
export const STAGGER = {
  sm: 0.05,
  md: 0.1,
  lg: 0.15,
  xl: 0.2,
} as const

// Easing functions
export const EASING = {
  // Standard easings
  linear: [0, 0, 1, 1] as const,
  easeIn: [0.4, 0, 1, 1] as const,
  easeOut: [0, 0, 0.2, 1] as const,
  easeInOut: [0.4, 0, 0.2, 1] as const,
  
  // Custom easings for polished feel
  easeOutExpo: [0.16, 1, 0.3, 1] as const,
  easeInOutCubic: [0.4, 0, 0.2, 1] as const,
  
  // Spring-like easings
  spring: [0.34, 1.56, 0.64, 1] as const,
  springGentle: [0.5, 1, 0.5, 1] as const,
} as const

// Scale values for hover effects
export const SCALE = {
  subtle: 1.02,
  normal: 1.05,
  prominent: 1.1,
} as const

// Opacity values
export const OPACITY = {
  hidden: 0,
  visible: 1,
  subtle: 0.5,
  medium: 0.7,
} as const

// Shadow values for hover effects
export const SHADOW = {
  none: '0 0 0 rgba(0, 0, 0, 0)',
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
} as const

// Context-based animation presets
export const PRESETS = {
  dashboard: {
    duration: DURATION.normal,
    easing: EASING.easeOut,
    distance: DISTANCE.sm,
  },
  landing: {
    duration: DURATION.slow,
    easing: EASING.easeOutExpo,
    distance: DISTANCE.md,
  },
  form: {
    duration: DURATION.fast,
    easing: EASING.easeOut,
    distance: DISTANCE.sm,
  },
  table: {
    duration: DURATION.fast,
    easing: EASING.easeOut,
    distance: DISTANCE.sm,
  },
} as const



