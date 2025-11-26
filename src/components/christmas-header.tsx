"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useEffect } from "react"

export function ChristmasHeader() {
  // Select a few 3D icons to display (you can change these)
  const iconPaths = [
    "/christmas 3d icons]/Object 01.png",
    "/christmas 3d icons]/Object 05.png",
    "/christmas 3d icons]/Object 10.png",
  ]

  useEffect(() => {
    // Set CSS variable for header height
    document.documentElement.style.setProperty('--christmas-header-height', '44px')
  }, [])

  return (
    <div 
      className="sticky top-0 z-[60] w-full overflow-hidden bg-gradient-to-br from-red-400 via-red-500 to-red-600 border-b border-red-300/50"
      style={{ 
        height: 'var(--christmas-header-height, 44px)'
      } as React.CSSProperties}
    >
      {/* Grainy texture layers */}
      <div 
        className="absolute inset-0 opacity-[0.7]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter1'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter1)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay'
        }}
      />
      <div 
        className="absolute inset-0 opacity-[0.5]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.0' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter2)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'multiply'
        }}
      />
      <div 
        className="absolute inset-0 opacity-[0.4]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter3'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter3)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'screen'
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center gap-2 px-4 py-2 md:px-6 md:py-2 md:gap-3">
        {/* Text with icons interspersed */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
          <span className="text-sm font-bold text-white md:text-base lg:text-lg">
            Christmas
          </span>
          
          {/* First 3D Icon */}
          <div 
            className="relative h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8"
            style={{
              transform: 'rotate(-15deg)',
              transformOrigin: 'center center'
            }}
          >
            <Image
              src={iconPaths[0]}
              alt="Christmas icon 1"
              fill
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>

          <span className="text-sm font-bold text-white md:text-base lg:text-lg">
            Collection
          </span>

          {/* Second 3D Icon */}
          <div 
            className="relative h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8"
            style={{
              transform: 'rotate(20deg)',
              transformOrigin: 'center center'
            }}
          >
            <Image
              src={iconPaths[1]}
              alt="Christmas icon 2"
              fill
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>

          <span className="text-sm font-bold text-white md:text-base lg:text-lg">
            is
          </span>

          {/* Third 3D Icon */}
          <div 
            className="relative h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8"
            style={{
              transform: 'rotate(-10deg)',
              transformOrigin: 'center center'
            }}
          >
            <Image
              src={iconPaths[2]}
              alt="Christmas icon 3"
              fill
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>

          {/* Highlighted LIVE text */}
          <span className="relative inline-block">
            <span 
              className="absolute -inset-0.5 bg-yellow-400/30 blur-sm"
              style={{
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}
            />
            <span className="relative text-sm font-bold text-yellow-300 md:text-base lg:text-lg drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]">
              LIVE
            </span>
          </span>
        </div>

        {/* Button */}
        <Button 
          className="bg-white text-red-900 hover:bg-white/90 rounded-md px-3 py-1 md:px-4 md:py-1.5 font-bold text-xs md:text-sm transition-all shadow-lg hover:shadow-xl flex items-center gap-1 md:gap-1.5 whitespace-nowrap ml-2 md:ml-3"
          onClick={() => {
            // Add your action here
            console.log('Christmas Collection clicked!')
          }}
        >
          <span>SHOP NOW</span>
          <ArrowRight className="h-3 w-3 md:h-3.5 md:w-3.5" />
        </Button>
      </div>
    </div>
  )
}

