"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/topbar"
import { Button } from "@/components/ui/button"
import { Play, Coins } from "lucide-react"
import { ModelStudio } from "@/components/ai-tools/model-studio"
import { OnboardingProgressOverlay } from "@/components/onboarding/onboarding-progress-overlay"

export default function ModelStudioPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <div className="flex flex-1 flex-col gap-2 p-4 md:p-6 bg-gray-50/50 min-h-0 relative">
          {/* Banner with grainy gradient */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-pink-900 via-rose-950 to-pink-800 p-3 text-white h-[154px] flex-shrink-0">
            {/* Enhanced grainy texture layers */}
            <div 
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                opacity: 0.5,
                mixBlendMode: 'overlay'
              }}
            ></div>
            <div 
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.8' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise2)'/%3E%3C/svg%3E")`,
                opacity: 0.4,
                mixBlendMode: 'multiply'
              }}
            ></div>
            <div 
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise3'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='6' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise3)'/%3E%3C/svg%3E")`,
                opacity: 0.3,
                mixBlendMode: 'screen'
              }}
            ></div>
            <div 
              className="absolute inset-0 z-0"
              style={{
                background: `repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.08) 1px, rgba(0,0,0,0.08) 2px),
                              repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.04) 1px, rgba(255,255,255,0.04) 2px)`,
                opacity: 0.6
              }}
            ></div>

            {/* Content */}
            <div className="relative z-10 flex items-center gap-4 h-full">
              {/* 3D Thumbnail */}
              <img
                src="/3d-ecom-icons-blue/Shopping_Sale.png"
                alt="Model Studio"
                width={110}
                height={110}
                className="w-[5.5rem] h-[5.5rem] md:w-[6.6rem] md:h-[6.6rem] flex-shrink-0 object-contain"
              />

              <div className="flex-1 min-w-0">
                <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-2">USDrop Model Creator</h2>
                <p className="text-white/90 text-sm md:text-base leading-relaxed">
                  Generate professional model advertisements for your apparel products.
                </p>
              </div>

              {/* Credits pill and Tutorial button */}
              <div className="flex-shrink-0 flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white hover:border-white/50 backdrop-blur-sm cursor-pointer"
                >
                  <Coins className="h-3 w-3 mr-1 text-[#FFD700]" style={{ filter: 'drop-shadow(0 2px 4px rgba(255, 215, 0, 0.6))' }} />
                  <span className="text-xs">3 credits per image</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white hover:border-white/50 backdrop-blur-sm cursor-pointer"
                >
                  <Play className="h-3 w-3 mr-1" />
                  <span className="text-xs">Tutorial</span>
                </Button>
              </div>
            </div>
          </div>

          <ModelStudio />
          <OnboardingProgressOverlay pageName="Model Studio" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

