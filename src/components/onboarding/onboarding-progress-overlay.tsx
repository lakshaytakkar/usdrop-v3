"use client"

import { useRouter } from "next/navigation"
import { Lock, BookOpen, Sparkles } from "lucide-react"
import { useOnboarding } from "@/contexts/onboarding-context"

interface OnboardingProgressOverlayProps {
  pageName?: string
}

export function OnboardingProgressOverlay({
  pageName = "this section",
}: OnboardingProgressOverlayProps = {}) {
  const router = useRouter()
  const { isComplete, progressPercentage, completedVideos, totalVideos, isFree, isLoading } = useOnboarding()

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
    <>
      {/* Backdrop - covers entire content area */}
      <div
        className="absolute inset-0 z-[100] bg-white/90 backdrop-blur-sm"
      />

      {/* Overlay content - centered in the container */}
      <div
        className="absolute inset-0 z-[101] flex items-center justify-center"
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
    </>
  )
}
