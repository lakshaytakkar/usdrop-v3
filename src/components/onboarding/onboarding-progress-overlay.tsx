"use client"

import { useRouter } from "next/navigation"
import { Lock, BookOpen, Sparkles } from "lucide-react"
import { useOnboarding } from "@/contexts/onboarding-context"
import { useEffect, useRef, useState } from "react"

interface OnboardingProgressOverlayProps {
  pageName?: string
  teaserHeight?: number | "auto"
  teaserSelector?: string
  transitionHeight?: number
}

export function OnboardingProgressOverlay({
  pageName = "this section",
  teaserHeight = 180,
  teaserSelector,
  transitionHeight = 100,
}: OnboardingProgressOverlayProps = {}) {
  const router = useRouter()
  const { isComplete, progressPercentage, completedVideos, totalVideos, isFree, isLoading } = useOnboarding()
  const [calculatedTeaserHeight, setCalculatedTeaserHeight] = useState<number>(
    typeof teaserHeight === "number" ? teaserHeight : 180
  )
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-detect teaser height if set to "auto"
  useEffect(() => {
    if (teaserHeight === "auto") {
      const detectTeaserHeight = () => {
        if (!containerRef.current) return

        const parent = containerRef.current.parentElement
        if (!parent) {
          setCalculatedTeaserHeight(180)
          return
        }

        if (teaserSelector) {
          // Use custom selector if provided
          const teaserElement = parent.querySelector(teaserSelector)
          if (teaserElement) {
            const rect = teaserElement.getBoundingClientRect()
            const parentRect = parent.getBoundingClientRect()
            const height = rect.height + (rect.top - parentRect.top) // Include offset from parent top
            setCalculatedTeaserHeight(Math.max(height, 100))
            return
          }
        }

        // Default detection: find first major section (banner/header)
        // Iterate through children to find banner-like elements
        const children = Array.from(parent.children) as HTMLElement[]
        
        for (const child of children) {
          // Skip the overlay component itself
          if (child === containerRef.current) continue
          
          const computedStyle = window.getComputedStyle(child)
          const rect = child.getBoundingClientRect()
          const parentRect = parent.getBoundingClientRect()
          const height = rect.height
          const topOffset = rect.top - parentRect.top
          
          // Check if it's a banner-like element
          // Criteria: reasonable height (100-400px), has gradient background, or specific classes
          const hasGradient = computedStyle.backgroundImage.includes("gradient") || 
                             computedStyle.backgroundImage.includes("url")
          const hasBannerClasses = child.classList.toString().includes("banner") ||
                                   child.classList.toString().includes("header")
          const hasSpecificHeight = computedStyle.height && 
                                   (computedStyle.height.includes("154px") || 
                                    computedStyle.height.includes("200px") ||
                                    computedStyle.height.includes("180px"))
          
          if (
            height > 100 &&
            height < 400 &&
            topOffset < 50 && // Should be near the top
            (hasGradient || hasBannerClasses || hasSpecificHeight)
          ) {
            // Include the height plus any gap/margin
            setCalculatedTeaserHeight(Math.max(height + topOffset + 16, 100))
            return
          }
        }

        // Fallback to default
        setCalculatedTeaserHeight(180)
      }

      // Initial detection after a small delay to ensure DOM is ready
      const timeoutId = setTimeout(detectTeaserHeight, 0)

      // Re-detect on resize
      const resizeObserver = new ResizeObserver(() => {
        detectTeaserHeight()
      })
      
      if (containerRef.current?.parentElement) {
        resizeObserver.observe(containerRef.current.parentElement)
      }

      return () => {
        clearTimeout(timeoutId)
        resizeObserver.disconnect()
      }
    }
  }, [teaserHeight, teaserSelector])

  // Use calculated or provided teaser height
  const finalTeaserHeight = typeof teaserHeight === "number" ? teaserHeight : calculatedTeaserHeight

  // Don't show overlay if still loading
  if (isLoading) {
    return null
  }

  // Don't show overlay if user is paid (they can access everything)
  if (!isFree) {
    return null
  }

  // If onboarding is complete, user can access - no overlay needed
  if (isComplete) {
    return null
  }

  // Show overlay if: user is free AND onboarding not complete

  return (
    <div ref={containerRef}>
      {/* Clear teaser area - no overlay (0 to teaserHeight) */}
      {/* This area is intentionally left empty so content shows through */}

      {/* Gradient transition layer - smooth fade from clear to blurred */}
      {/* This creates a gradient mask that transitions from transparent to opaque */}
      <div
        className="absolute left-0 right-0 z-[100] pointer-events-none backdrop-blur-sm"
        style={{
          top: `${finalTeaserHeight}px`,
          height: `${transitionHeight}px`,
          background: `linear-gradient(to bottom, 
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 30%,
            rgba(255, 255, 255, 0.6) 60%,
            rgba(255, 255, 255, 0.85) 85%,
            rgba(255, 255, 255, 0.9) 100%
          )`,
        }}
      />

      {/* Full blur overlay - covers content below teaser + transition */}
      <div
        className="absolute left-0 right-0 bottom-0 z-[100] bg-white/90 backdrop-blur-sm"
        style={{
          top: `${finalTeaserHeight + transitionHeight}px`,
        }}
      />

      {/* Overlay content - positioned at top of blurred area */}
      <div
        className="absolute left-0 right-0 bottom-0 z-[101] flex items-start justify-center pt-8"
        style={{
          top: `${finalTeaserHeight + transitionHeight}px`,
        }}
      >
        <div className="flex flex-col items-center gap-4 px-6 text-center max-w-sm">
          {/* Lock icon with golden glow */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center shadow-lg">
            <Lock className="h-7 w-7 text-white" />
          </div>

          {/* Message */}
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {pageName} is Locked
            </h3>
            <p className="text-sm text-gray-600">
              Complete your onboarding to unlock this feature
            </p>
          </div>

          {/* Progress indicator */}
          <div className="w-full bg-gray-100 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Progress</span>
              <span className="font-medium">{completedVideos}/{totalVideos} chapters</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-center text-sm font-semibold text-amber-600">
              {Math.round(progressPercentage)}% Complete
            </p>
          </div>

          {/* CTA Button - Golden */}
          <button
            onClick={() => router.push("/my-dashboard")}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-600 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Sparkles className="h-4 w-4" />
            <span>Continue Learning</span>
            <BookOpen className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
