"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

interface SeasonalBannerProps {
  name: string
  slug: string
  thumbnail: string
  dateRange: string
  marketingDateRange: string
  gradient: string
}

export function SeasonalBanner({
  name,
  slug,
  thumbnail,
  dateRange,
  marketingDateRange,
  gradient,
}: SeasonalBannerProps) {
  return (
    <div 
      className="overflow-hidden hover:shadow-xl transition-all duration-300 relative rounded-xl"
    >
      <div className={`relative bg-gradient-to-r ${gradient} rounded-xl`}>
        {/* Grainy texture overlay - more pronounced */}
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            mixBlendMode: "overlay"
          }}
        />

        {/* Content */}
        <div className="relative py-4 px-5 md:px-6">
          <div className="flex flex-col lg:flex-row gap-5 items-center">
            {/* Left Side - Thumbnail */}
            <div className="flex-shrink-0">
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-white/40 shadow-lg bg-white/10 backdrop-blur-sm">
                <Image
                  src={thumbnail}
                  alt={name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Middle - Collection Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-md mb-2">
                {name}
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-white/90 text-sm">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>Date Range: {dateRange}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>Marketing: {marketingDateRange}</span>
                </div>
              </div>
            </div>

            {/* Right Side - Browse Collection Button */}
            <div className="flex-shrink-0">
              <Link href={`/winning-products?category=${slug}`}>
                <Button 
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm font-semibold"
                >
                  Browse Collection
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

