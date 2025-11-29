"use client"

import Image from "next/image"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/topbar"
import { Card, CardContent } from "@/components/ui/card"
import { ProBadge } from "@/components/ui/pro-badge"
import { Button } from "@/components/ui/button"
import { Wand2, Image as ImageIcon, Badge, Calculator, Presentation, Sparkles, User, Target, Play } from "lucide-react"
import Link from "next/link"

const tools = [
  {
    id: "image-studio",
    icon: ImageIcon,
    title: "Image Studio",
    description: "Generate professional product listing images",
    url: "/ai-toolkit/image-studio",
    isPro: true,
  },
  {
    id: "logo-studio",
    icon: Badge,
    title: "Logo Studio",
    description: "Create and design your brand logo",
    url: "/ai-toolkit/logo-studio",
    isPro: true,
  },
  {
    id: "profit-calculator",
    icon: Calculator,
    title: "Profit Calculator",
    description: "Calculate dropshipping profits and margins",
    url: "/ai-toolkit/profit-calculator",
    isPro: true,
  },
  {
    id: "campaign-studio",
    icon: Presentation,
    title: "Campaign Studio",
    description: "Plan and manage Meta advertising campaigns",
    url: "/ai-toolkit/campaign-studio",
    isPro: true,
  },
  {
    id: "ad-studio",
    icon: Sparkles,
    title: "Ad Studio",
    description: "Generate compelling ad creatives",
    url: "/ai-toolkit/ad-studio",
    isPro: true,
  },
  {
    id: "model-studio",
    icon: User,
    title: "Model Studio",
    description: "Create model ads for apparel products",
    url: "/ai-toolkit/model-studio",
    isPro: true,
  },
  {
    id: "brand-studio",
    icon: Badge,
    title: "Brand Studio",
    description: "Embed logos on product images",
    url: "/ai-toolkit/brand-studio",
    isPro: true,
  },
  {
    id: "audience-studio",
    icon: Target,
    title: "Audience Studio",
    description: "Plan and analyze target audiences",
    url: "/ai-toolkit/audience-studio",
    isPro: true,
  },
]

export default function AIToolkitPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-gray-50/50">
          {/* Banner with grainy gradient */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary via-primary/90 to-purple-600 p-4 md:p-5 text-white h-[140px]">
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
              {/* Mascot before text */}
              <div className="relative w-[120px] h-[110px] md:w-[140px] md:h-[130px] flex-shrink-0">
                <Image
                  src="/ai-studio-mascot.png"
                  alt="3D mascot with magic wand"
                  fill
                  className="object-contain"
                  style={{
                    filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.3))',
                  }}
                  priority
                />
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-2xl md:text-3xl font-bold mb-1.5 leading-tight">USDrop AI Studio</h2>
                <p className="text-white/85 text-xs md:text-sm leading-relaxed">
                  Professional AI-powered tools for your dropshipping business. From image generation to campaign planning, everything you need in one place.
                </p>
              </div>

              {/* Video Tutorial button in right corner */}
              <div className="flex-shrink-0">
                <Button 
                  variant="outline" 
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white hover:border-white/50 backdrop-blur-sm cursor-pointer"
                >
                  <Play className="h-4 w-4" />
                  Video Tutorial
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map((tool) => (
              <Link key={tool.id} href={tool.url}>
                <Card className="h-full transition-transform hover:scale-[1.02] cursor-pointer">
                  <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                    <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-2xl">
                      <tool.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{tool.title}</h3>
                      {tool.isPro && <ProBadge size="sm" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

