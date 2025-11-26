"use client"

import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoaderProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "spinner" | "dots" | "pulse"
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
}

export function Loader({ className, size = "md", variant = "spinner" }: LoaderProps) {
  if (variant === "spinner") {
    return (
      <Loader2
        className={cn("animate-spin text-primary", sizeClasses[size], className)}
        aria-label="Loading"
      />
    )
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center gap-1", className)} aria-label="Loading">
        <div
          className={cn(
            "rounded-full bg-primary animate-pulse",
            size === "sm" ? "h-1.5 w-1.5" : size === "md" ? "h-2 w-2" : "h-2.5 w-2.5"
          )}
          style={{ animationDelay: "0ms" }}
        />
        <div
          className={cn(
            "rounded-full bg-primary animate-pulse",
            size === "sm" ? "h-1.5 w-1.5" : size === "md" ? "h-2 w-2" : "h-2.5 w-2.5"
          )}
          style={{ animationDelay: "150ms" }}
        />
        <div
          className={cn(
            "rounded-full bg-primary animate-pulse",
            size === "sm" ? "h-1.5 w-1.5" : size === "md" ? "h-2 w-2" : "h-2.5 w-2.5"
          )}
          style={{ animationDelay: "300ms" }}
        />
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <div
        className={cn(
          "rounded-full bg-primary animate-pulse",
          sizeClasses[size],
          className
        )}
        aria-label="Loading"
      />
    )
  }

  return null
}

interface PageLoaderProps {
  message?: string
  className?: string
}

export function PageLoader({ message = "Loading...", className }: PageLoaderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 gap-4", className)}>
      <Loader size="lg" variant="spinner" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

interface InlineLoaderProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function InlineLoader({ className, size = "sm" }: InlineLoaderProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader size={size} variant="spinner" />
    </div>
  )
}

