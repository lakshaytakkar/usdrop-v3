

import * as React from "react"
import { cn } from "@/lib/utils"

interface SlideTextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  defaultText: string
  hoverText: string
}

const SlideTextButton = React.forwardRef<HTMLButtonElement, SlideTextButtonProps>(
  ({ className, icon, defaultText, hoverText, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group/button relative w-full h-10 rounded-md text-sm font-mono font-medium text-white transition-all duration-300 cursor-pointer flex items-center gap-2 px-3 overflow-hidden",
          className
        )}
        {...props}
      >
        {/* Gradient Background */}
        <span className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600"></span>
        <span className="absolute inset-0 rounded-md bg-gradient-to-b from-white/20 via-transparent to-transparent"></span>
        
        {/* Content */}
        <span className="relative flex items-center gap-2 z-10 w-full">
          <span className="flex-shrink-0">{icon}</span>
          <span className="relative flex-1 overflow-hidden">
            <div className="relative h-[1.2em]">
              <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover/button:-translate-y-full whitespace-nowrap">
                {defaultText.toUpperCase()}
              </span>
              <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out translate-y-full group-hover/button:translate-y-0 whitespace-nowrap">
                {hoverText.toUpperCase()}
              </span>
            </div>
          </span>
        </span>
      </button>
    )
  }
)

SlideTextButton.displayName = "SlideTextButton"

export { SlideTextButton }

