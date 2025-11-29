"use client"

import Image from "next/image"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/topbar"
// import { ChristmasHeader } from "@/components/christmas-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight,
  Flame
} from "lucide-react"

export default function Home() {
  return (
    <>
      {/* <ChristmasHeader /> */}
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Topbar />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-gray-100/50">
          <main className="flex flex-1 flex-col gap-6">
            {/* Featured Tools Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              {/* Aurora Avatar Card */}
              <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-red-600 to-orange-500 p-6 text-white h-[210px]">
                {/* Grainy texture layers */}
                <div className="absolute inset-0 opacity-[0.7]" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter4'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter4)'/%3E%3C/svg%3E")`,
                  mixBlendMode: 'overlay'
                }}></div>
                <div className="absolute inset-0 opacity-[0.5]" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter5'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.0' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter5)'/%3E%3C/svg%3E")`,
                  mixBlendMode: 'multiply'
                }}></div>
                <div className="absolute inset-0 opacity-[0.4]" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter6'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter6)'/%3E%3C/svg%3E")`,
                  mixBlendMode: 'screen'
                }}></div>
                {/* Right side image container */}
                <div className="absolute right-0 top-0 bottom-0 w-[50%] flex items-center justify-center">
                  <div className="relative w-full h-full flex items-center justify-end pr-4">
                    {/* Christmas 3D icons */}
                    <div className="flex items-center gap-2">
                      <div className="relative w-24 h-24 transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-3 hover:rotate-[20deg] cursor-pointer">
                        <Image
                          src="/christmas 3d icons]/Object 25.png"
                          alt="Christmas icon 1"
                          fill
                          className="object-contain"
                          style={{
                            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                          }}
                        />
                      </div>
                      <div className="relative w-24 h-24 transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-3 hover:rotate-[20deg] cursor-pointer">
                        <Image
                          src="/christmas 3d icons]/Object 26.png"
                          alt="Christmas icon 2"
                          fill
                          className="object-contain"
                          style={{
                            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                          }}
                        />
                      </div>
                      <div className="relative w-24 h-24 transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-3 hover:rotate-[20deg] cursor-pointer">
                        <Image
                          src="/christmas 3d icons]/Object 27.png"
                          alt="Christmas icon 3"
                          fill
                          className="object-contain"
                          style={{
                            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content on the left */}
                <div className="relative z-10 max-w-[48%] flex flex-col justify-center h-full">
                  <h2 className="text-3xl font-bold mb-3 leading-tight">
                    Christmas Collection
                  </h2>
                  <p className="text-white/90 mb-4 text-sm leading-relaxed">
                    Create ultra-realistic avatar videos with a single image
                  </p>
                  <Button className="bg-black text-white hover:bg-black/80 rounded-lg px-5 py-2 font-medium transition-all w-fit flex items-center gap-2">
                    <span>CREATE NOW</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Product Discovery Card */}
              <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-blue-600 via-blue-500 to-purple-600 p-6 text-white h-[210px]">
                {/* Grainy texture - highly visible */}
                <div 
                  className="absolute inset-0 z-0"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    opacity: 0.25,
                    mixBlendMode: 'multiply'
                  }}
                ></div>
                <div 
                  className="absolute inset-0 z-0"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise2)'/%3E%3C/svg%3E")`,
                    opacity: 0.15,
                    mixBlendMode: 'overlay'
                  }}
                ></div>
                <div 
                  className="absolute inset-0 z-0"
                  style={{
                    background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px),
                                  repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px)`,
                    opacity: 0.4
                  }}
                ></div>
                {/* Right side image container - clean and contained */}
                <div className="absolute right-0 top-0 bottom-0 w-[42%] flex items-center justify-end pointer-events-none z-20">
                  {/* Gradient overlay for seamless blending on the left edge */}
                  <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-blue-600/90 via-blue-600/40 to-transparent pointer-events-none z-10"></div>
                  <div className="relative w-full h-[95%]">
                    <Image
                      src="/product-discovery-card-no-bg.png"
                      alt="People discovering products"
                      fill
                      className="object-contain object-right"
                      style={{
                        filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.25))',
                        transform: 'scale(1.05)'
                      }}
                      priority
                      sizes="42vw"
                    />
                  </div>
                </div>

                {/* Content on the left */}
                <div className="relative z-30 max-w-[45%] flex flex-col justify-center h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <h2 className="text-3xl font-bold leading-tight">Product Discovery</h2>
                    <Flame className="h-5 w-5 text-orange-400 shrink-0" />
                  </div>
                  <p className="text-white/90 mb-4 text-sm leading-relaxed">
                    Discover trending products and winning ads from top-performing stores
                  </p>
                  <Button className="bg-black text-white hover:bg-black/80 rounded-lg px-5 py-2 font-medium transition-all w-fit flex items-center gap-2">
                    <span>CREATE NOW</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* USDrop AI Studio Tools Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">USDrop AI Studio Tools</h3>
              <div className="grid gap-4 md:grid-cols-3">
                {/* Image Studio Card */}
                <div className="rounded-xl border bg-card p-6 hover:shadow-md transition-shadow">
                  <Image
                    src="/Right%20color/Camera%23camera,photo,picture,capture,media,image,snapshot,lens,device,photography,app,ui,icon,symbol,record.png"
                    alt="Image Studio"
                    width={64}
                    height={64}
                    className="object-contain mb-4"
                  />
                  <h4 className="font-semibold mb-2 text-lg">Image Studio</h4>
                  <p className="text-sm text-muted-foreground">
                    Generate multiple photorealistic views of your product from different angles
                  </p>
                </div>

                {/* Ad Studio Card */}
                <div className="rounded-xl border bg-card p-6 hover:shadow-md transition-shadow">
                  <div className="mb-4 flex items-center justify-between">
                    <Image
                      src="/Right%20color/Edit%23edit,pencil,write,modify,update,change,note,ui,icon,symbol,text,tool,adjust,input,create.png"
                      alt="Ad Studio"
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                        New
                      </Badge>
                      <Flame className="h-4 w-4 text-orange-500" />
                    </div>
                  </div>
                  <h4 className="font-semibold mb-2 text-lg">Ad Studio</h4>
                  <p className="text-sm text-muted-foreground">
                    Create compelling ad creatives with AI. Generate images, videos, and copy that convert
                  </p>
                </div>

                {/* Model Studio Card */}
                <div className="rounded-xl border bg-card p-6 hover:shadow-md transition-shadow">
                  <Image
                    src="/Right%20color/Camera%23camera,photo,picture,capture,media,image,snapshot,lens,device,photography,app,ui,icon,symbol,record.png"
                    alt="Model Studio"
                    width={64}
                    height={64}
                    className="object-contain mb-4"
                  />
                  <h4 className="font-semibold mb-2 text-lg">Model Studio</h4>
                  <p className="text-sm text-muted-foreground">
                    Generate professional model advertisements for your apparel products with AI-generated models
                  </p>
                </div>

                {/* Logo Studio Card */}
                <div className="rounded-xl border bg-card p-6 hover:shadow-md transition-shadow">
                  <div className="mb-4 flex items-center justify-between">
                    <Image
                      src="/Right%20color/Add%23add,plus,new,create,increase,ui,icon,symbol,button,insert,more,action,expand,positive,symbol.png"
                      alt="Logo Studio"
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-xs">
                        Nano
                      </Badge>
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-xs">
                        Banana
                      </Badge>
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-xs">
                        Pro
                      </Badge>
                      <Flame className="h-4 w-4 text-orange-500" />
                    </div>
                  </div>
                  <h4 className="font-semibold mb-2 text-lg">Logo Studio</h4>
                  <p className="text-sm text-muted-foreground">
                    Apply your logo to multiple images in bulk. Customize placement, size, and opacity
                  </p>
                </div>

                {/* Brand Studio Card */}
                <div className="rounded-xl border bg-card p-6 hover:shadow-md transition-shadow">
                  <Image
                    src="/Right%20color/Edit%23edit,pencil,write,modify,update,change,note,ui,icon,symbol,text,tool,adjust,input,create.png"
                    alt="Brand Studio"
                    width={64}
                    height={64}
                    className="object-contain mb-4"
                  />
                  <h4 className="font-semibold mb-2 text-lg">Brand Studio</h4>
                  <p className="text-sm text-muted-foreground">
                    Automatically place your brand logo on product images with customizable placement and size
                  </p>
                </div>

                {/* Campaign Studio Card */}
                <div className="rounded-xl border bg-card p-6 hover:shadow-md transition-shadow">
                  <Image
                    src="/Right%20color/Star%23star,favorite,rate,rating,like,highlight,ui,icon,symbol,award,mark,best,feature,badge,top.png"
                    alt="Campaign Studio"
                    width={64}
                    height={64}
                    className="object-contain mb-4"
                  />
                  <h4 className="font-semibold mb-2 text-lg">Campaign Studio</h4>
                  <p className="text-sm text-muted-foreground">
                    Strategize and plan your Meta advertising campaigns. Set budgets, define audiences, and track performance
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </>
  )
}
