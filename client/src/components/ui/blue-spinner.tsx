import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface BlueSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  label?: string
  className?: string
  fullPage?: boolean
}

const sizeMap = {
  xs: "h-3.5 w-3.5",
  sm: "h-5 w-5",
  md: "h-7 w-7",
  lg: "h-10 w-10",
  xl: "h-14 w-14",
}

export function BlueSpinner({ size = "md", label, className, fullPage }: BlueSpinnerProps) {
  const spinner = (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Loader2
        className={cn("animate-spin text-blue-600", sizeMap[size])}
        strokeWidth={2.5}
      />
      {label && (
        <p className="text-sm text-gray-500 font-medium">{label}</p>
      )}
    </div>
  )

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {spinner}
      </div>
    )
  }

  return spinner
}

export function FullPageSpinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <BlueSpinner size="lg" label={label} />
    </div>
  )
}

export function InlineBlueSpinner({ size = "sm", className }: { size?: "xs" | "sm" | "md"; className?: string }) {
  return (
    <Loader2 className={cn("animate-spin text-blue-600", sizeMap[size], className)} strokeWidth={2.5} />
  )
}

export function ButtonSpinner({ className }: { className?: string }) {
  return (
    <Loader2 className={cn("h-4 w-4 mr-2 animate-spin", className)} strokeWidth={2.5} />
  )
}
