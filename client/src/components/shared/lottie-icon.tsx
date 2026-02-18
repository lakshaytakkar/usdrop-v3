

import Lottie from "lottie-react"
import { cn } from "@/lib/utils"
import { useMemo } from "react"

interface LottieIconProps {
  animationData: any
  className?: string
  loop?: boolean
  autoplay?: boolean
}

// Violet color in RGBA format [R, G, B, A] normalized 0-1
// Using a vibrant violet: RGB(138, 43, 226) or similar
const VIOLET_COLOR = [138 / 255, 43 / 255, 226 / 255, 1]

// Recursively replace color values in Lottie animation data
function replaceColors(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(replaceColors)
  } else if (obj && typeof obj === "object") {
    const newObj: any = {}
    for (const key in obj) {
      // Replace stroke and colors
      if (key === "c" && Array.isArray(obj[key]) && obj[key].length >= 3) {
        // This is a color array [R, G, B, A]
        newObj[key] = VIOLET_COLOR
      } else {
        newObj[key] = replaceColors(obj[key])
      }
    }
    return newObj
  }
  return obj
}

export function LottieIcon({ 
  animationData, 
  className,
  loop = true,
  autoplay = true 
}: LottieIconProps) {
  // Modify animation data to use violet colors
  const violetAnimationData = useMemo(() => {
    if (!animationData) return animationData
    return replaceColors(JSON.parse(JSON.stringify(animationData)))
  }, [animationData])

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Lottie
        animationData={violetAnimationData}
        loop={loop}
        autoplay={autoplay}
        className="h-4 w-4"
      />
    </div>
  )
}

