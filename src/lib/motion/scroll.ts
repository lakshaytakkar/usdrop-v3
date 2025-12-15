/**
 * Scroll-triggered animation utilities
 * Parallax calculations and scroll progress tracking
 */

import { useEffect, useState } from "react"

/**
 * Hook to track scroll progress (0 to 1)
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? scrollTop / docHeight : 0
      setProgress(Math.min(Math.max(progress, 0), 1))
    }

    updateProgress()
    window.addEventListener("scroll", updateProgress, { passive: true })
    return () => window.removeEventListener("scroll", updateProgress)
  }, [])

  return progress
}

/**
 * Hook to track scroll position
 */
export function useScrollPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updatePosition = () => {
      setPosition({
        x: window.scrollX,
        y: window.scrollY,
      })
    }

    updatePosition()
    window.addEventListener("scroll", updatePosition, { passive: true })
    return () => window.removeEventListener("scroll", updatePosition)
  }, [])

  return position
}

/**
 * Calculate parallax offset based on scroll position
 */
export function calculateParallax(
  scrollY: number,
  speed: number = 0.5,
  offset: number = 0
): number {
  return scrollY * speed + offset
}

/**
 * Debounce function for scroll events
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function for scroll events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}



