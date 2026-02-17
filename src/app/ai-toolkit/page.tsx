"use client"

import Image from "next/image"
import { ExternalLayout } from "@/components/layout/external-layout"
import { Card, CardContent } from "@/components/ui/card"
import { ProBadge } from "@/components/ui/pro-badge"
import { Button } from "@/components/ui/button"
import { Image as ImageIcon, Badge, Calculator, Sparkles, User, Play, Truck, PenTool, Share2, Mail, Shield, Receipt } from "lucide-react"
import Link from "next/link"

const studioTools = [
  {
    id: "model-studio",
    icon: User,
    title: "Model Studio",
    description: "AI product-on-model lifestyle shots",
    url: "/ai-toolkit/model-studio",
    isPro: true,
  },
  {
    id: "logo-studio",
    icon: Badge,
    title: "Whitelabelling",
    description: "Logo placement, branded packaging mockups",
    url: "/ai-toolkit/logo-studio",
    isPro: true,
  },
]

const toolkitTools = [
  {
    id: "description-generator",
    icon: PenTool,
    title: "Description Generator",
    description: "Product listing copy",
    url: "/ai-toolkit/description-generator",
    isPro: true,
  },
  {
    id: "email-templates",
    icon: Mail,
    title: "Email Templates",
    description: "Customer emails",
    url: "/ai-toolkit/email-templates",
    isPro: true,
  },
  {
    id: "policy-generator",
    icon: Shield,
    title: "Policy Generator",
    description: "Store policies",
    url: "/ai-toolkit/policy-generator",
    isPro: true,
  },
  {
    id: "invoice-generator",
    icon: Receipt,
    title: "Invoice Generator",
    description: "Business invoices",
    url: "/ai-toolkit/invoice-generator",
    isPro: true,
  },
  {
    id: "profit-calculator",
    icon: Calculator,
    title: "Profit Calculator",
    description: "Margin analysis",
    url: "/ai-toolkit/profit-calculator",
    isPro: true,
  },
]

export default function AIToolkitPage() {
  return (
    <ExternalLayout>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-gray-50/50">
          {/* Banner with grainy gradient */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary via-primary/90 to-purple-600 p-4 md:p-5 text-white h-[280px]">
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
              <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
                  <Image
                    src="/images/banner-thumbnails/ai-toolkit.png"
                    alt="AI Toolkit"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">USDrop AI Studio</h2>
                <p className="text-white/90 text-base md:text-lg leading-relaxed">
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

          {/* USDrop AI Studio Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-1">USDrop AI Studio</h3>
              <p className="text-sm text-muted-foreground">Visual and media tools for your dropshipping business</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {studioTools.map((tool) => (
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

          {/* USDrop AI Toolkit Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-1">USDrop AI Toolkit</h3>
              <p className="text-sm text-muted-foreground">Text and utility tools for your business operations</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {toolkitTools.map((tool) => (
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
        </div>
    </ExternalLayout>
  )
}

