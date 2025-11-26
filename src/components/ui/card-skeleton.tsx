"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CardSkeletonProps {
  showHeader?: boolean
  lines?: number
  className?: string
}

export function CardSkeleton({
  showHeader = true,
  lines = 3,
  className,
}: CardSkeletonProps) {
  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
      )}
      <CardContent className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            className={cn(
              "h-4",
              index === 0 ? "w-full" : index === 1 ? "w-5/6" : "w-4/6"
            )}
          />
        ))}
      </CardContent>
    </Card>
  )
}

interface AvatarSkeletonProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export function AvatarSkeleton({
  size = "md",
  showText = true,
  className,
}: AvatarSkeletonProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Skeleton className={cn("rounded-full", sizeClasses[size])} />
      {showText && (
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      )}
    </div>
  )
}

