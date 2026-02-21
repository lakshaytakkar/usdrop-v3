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

export function Loader({ className, size = "md" }: LoaderProps) {
  return (
    <Loader2
      className={cn("animate-spin text-blue-600", sizeClasses[size], className)}
      strokeWidth={2.5}
      aria-label="Loading"
    />
  )
}

interface PageLoaderProps {
  message?: string
  className?: string
}

export function PageLoader({ message = "Loading...", className }: PageLoaderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 gap-4", className)}>
      <Loader size="lg" />
      <p className="text-sm text-gray-500 font-medium">{message}</p>
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
      <Loader size={size} />
    </div>
  )
}
