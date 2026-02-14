"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { EmailTemplates } from "@/components/ai-tools/email-templates"
import { OnboardingProgressOverlay } from "@/components/onboarding/onboarding-progress-overlay"
export default function EmailTemplatesPage() {
  const toolContent = (
    <>
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-900 via-emerald-950 to-teal-800 p-3 text-white h-[154px] flex-shrink-0">
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

        <div className="relative z-10 flex items-center gap-4 h-full">
          <img
            src="/3d-ecom-icons-blue/Click_On_Buy_Now.png"
            alt="Email Templates"
            width={110}
            height={110}
            className="w-[5.5rem] h-[5.5rem] md:w-[6.6rem] md:h-[6.6rem] flex-shrink-0 object-contain"
          />

          <div className="flex-1 min-w-0">
            <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-2">Email Templates</h2>
            <p className="text-white/90 text-sm md:text-base leading-relaxed">
              Generate professional customer email templates for order confirmations, shipping updates, and more.
            </p>
          </div>

          <div className="flex-shrink-0">
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

      <EmailTemplates />
    </>
  )

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <div className="flex flex-1 flex-col gap-2 p-4 md:p-6 bg-gray-50/50 min-h-0 relative">
          {toolContent}

          <OnboardingProgressOverlay pageName="Email Templates" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
