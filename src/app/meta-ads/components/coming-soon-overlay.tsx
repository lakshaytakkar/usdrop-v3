"use client"

import { Sparkles } from "lucide-react"

export function ComingSoonOverlay() {
  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center">
      {/* Semi-transparent white overlay with backdrop blur */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-md" />
      
      {/* Main overlay content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-8 text-center">
        {/* Blue gradient card with message */}
        <div className="relative group w-full max-w-2xl">
          <div className="relative w-full rounded-xl text-sm font-medium text-white transition-all duration-300 flex items-center justify-center gap-4 px-10 py-8 overflow-hidden shadow-2xl">
            {/* Blue gradient background */}
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600"></span>
            <span className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 via-transparent to-transparent"></span>
            
            {/* Icon and Message text */}
            <div className="relative z-10 flex items-center gap-4">
              <Sparkles className="h-6 w-6 md:h-8 md:w-8 flex-shrink-0 animate-pulse" />
              <span className="font-semibold text-xl md:text-2xl tracking-wide">
                We are building something great
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

