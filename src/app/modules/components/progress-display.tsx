"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Clock, Award } from "lucide-react"
import { useOnboarding } from "@/contexts/onboarding-context"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export function ProgressDisplay() {
  const { 
    progressPercentage, 
    completedVideos, 
    totalVideos,
    completedModules,
    totalModules,
    isLoading 
  } = useOnboarding()

  if (isLoading) {
    return (
      <Card className="border-border/50 p-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </Card>
    )
  }

  const isComplete = progressPercentage === 100
  const remainingVideos = totalVideos - completedVideos
  const estimatedMinutesPerVideo = 5 // Average estimate
  const estimatedHoursRemaining = Math.round((remainingVideos * estimatedMinutesPerVideo) / 60 * 10) / 10

  return (
    <Card className="bg-white border border-[#e6e6e6] rounded-xl shadow-sm p-6 h-full">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg mb-1 text-foreground">Onboarding Progress</h3>
            <p className="text-sm text-muted-foreground">
              Complete your onboarding to unlock all features
            </p>
          </div>
          {isComplete && (
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-500" />
          )}
        </div>

        {/* Main Progress Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {completedVideos} of {totalVideos} videos completed
            </span>
            <span className="font-semibold text-foreground text-lg">
              {Math.round(progressPercentage)}%
            </span>
          </div>

          <Progress 
            value={progressPercentage} 
            className="h-2.5"
          />
        </div>

        {/* Module Breakdown */}
        {totalModules > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Modules Completed</span>
              <span className="font-medium text-foreground">
                {completedModules} of {totalModules}
              </span>
            </div>
            <div className="flex gap-1.5">
              {Array.from({ length: totalModules }).map((_, index) => {
                const isCompleted = index < completedModules
                return (
                  <div
                    key={index}
                    className="flex-1 h-2 rounded-full bg-muted overflow-hidden"
                  >
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        isCompleted ? "bg-primary" : "bg-muted"
                      )}
                      style={{ width: isCompleted ? "100%" : "0%" }}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Time Estimate */}
        {!isComplete && remainingVideos > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              Approximately {estimatedHoursRemaining} hours remaining
            </span>
          </div>
        )}

        {/* Completion Message */}
        {isComplete && (
          <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <Award className="h-5 w-5" />
              <span className="font-semibold text-sm">Congratulations! You've completed onboarding!</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

