"use client"

import { Wrench } from "lucide-react"

export function ComingSoonOverlay() {
  return (
    <div className="absolute inset-0 z-[100] flex items-start justify-center" style={{ paddingTop: '2in' }}>
      {/* Semi-transparent white overlay with backdrop blur */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
      
      {/* Main overlay content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-8 text-center">
        {/* Blue gradient button/card with message - matching credits button style */}
        <div className="relative group w-full max-w-lg">
          <div
            className="relative w-full rounded-lg text-sm font-medium text-white transition-all duration-300 flex items-center justify-center gap-3 px-8 py-5 overflow-hidden shadow-lg"
            style={{ transform: 'scale(0.7) rotate(-10deg)' }}
          >
            {/* Blue gradient background - matching credits button */}
            <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600"></span>
            <span className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/20 via-transparent to-transparent"></span>
            
            {/* Icon and Message text */}
            <div className="relative z-10 flex items-center gap-3">
              <Wrench className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0" />
              <span className="font-mono text-base md:text-lg uppercase tracking-wider font-semibold whitespace-nowrap">
                WE'RE BUILDING SOMETHING AMAZING
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}




