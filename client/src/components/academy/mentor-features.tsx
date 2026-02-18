

import { CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  "7-Figure Store Scaling",
  "Advanced FB Ad Strategies",
  "Product Research Secrets",
  "Conversion Rate Optimization",
]

export function MentorFeatures({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-3", className)}>
      {features.map((feature, index) => (
        <div key={index} className="flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600 mt-0.5" />
          <span className="text-sm font-medium text-slate-700">{feature}</span>
        </div>
      ))}
    </div>
  )
}

