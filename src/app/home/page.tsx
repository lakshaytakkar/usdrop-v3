"use client"

import { Suspense } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/topbar"
import { Badge } from "@/components/ui/badge"
import Loader from "@/components/kokonutui/loader"
import { Flame } from "lucide-react"
import { BannerCarousel, ChristmasBanner } from "@/components/banner-carousel"
import { MotionCard } from "@/components/motion/MotionCard"
import { MotionStagger } from "@/components/motion/MotionStagger"
import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { motion } from "motion/react"

function HomePageContent() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Topbar />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-gray-100/50">
            <main className="flex flex-1 flex-col gap-6">
            {/* Auto-rotating Banner Carousel - Full Width */}
            <MotionFadeIn direction="none" delay={0.1}>
              <BannerCarousel autoRotateInterval={6000}>
                <ChristmasBanner />
              </BannerCarousel>
            </MotionFadeIn>

            {/* USDrop AI Studio Tools Section */}
            <div>
              <MotionFadeIn delay={0.2}>
                <h3 className="text-xl font-semibold mb-4 text-foreground">USDrop AI Studio Tools</h3>
              </MotionFadeIn>
              <MotionStagger staggerDelay={0.1}>
                <div className="grid gap-4 md:grid-cols-3">
                  {/* Image Studio Card */}
                  <MotionCard
                    className="rounded-xl border bg-card p-6 cursor-pointer"
                    hoverLift
                    hoverShadow
                    delay={0}
                  >
                    <img
                      src="/3d-icons/Item 01.png"
                      alt="Image Studio"
                      width={64}
                      height={64}
                      className="object-contain mb-4 w-16 h-16"
                    />
                    <h4 className="font-semibold mb-2 text-lg">Image Studio</h4>
                    <p className="text-sm text-muted-foreground">
                      Generate multiple photorealistic views of your product from different angles
                    </p>
                  </MotionCard>

                  {/* Ad Studio Card */}
                  <MotionCard
                    className="rounded-xl border bg-card p-6 cursor-pointer"
                    hoverLift
                    hoverShadow
                    delay={0.05}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <img
                        src="/3d-icons/Item 15.png"
                        alt="Ad Studio"
                        width={64}
                        height={64}
                        className="object-contain w-16 h-16"
                      />
                      <motion.div
                        className="flex items-center gap-1"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                      >
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                          New
                        </Badge>
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                          <Flame className="h-4 w-4 text-orange-500" />
                        </motion.div>
                      </motion.div>
                    </div>
                    <h4 className="font-semibold mb-2 text-lg">Ad Studio</h4>
                    <p className="text-sm text-muted-foreground">
                      Create compelling ad creatives with AI. Generate images, videos, and copy that convert
                    </p>
                  </MotionCard>

                  {/* Model Studio Card */}
                  <MotionCard
                    className="rounded-xl border bg-card p-6 cursor-pointer"
                    hoverLift
                    hoverShadow
                    delay={0.1}
                  >
                    <img
                      src="/3d-icons/Item 28.png"
                      alt="Model Studio"
                      width={64}
                      height={64}
                      className="object-contain mb-4 w-16 h-16"
                    />
                    <h4 className="font-semibold mb-2 text-lg">Model Studio</h4>
                    <p className="text-sm text-muted-foreground">
                      Generate professional model advertisements for your apparel products with AI-generated models
                    </p>
                  </MotionCard>

                  {/* Whitelabelling Card */}
                  <MotionCard
                    className="rounded-xl border bg-card p-6 cursor-pointer"
                    hoverLift
                    hoverShadow
                    delay={0.15}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <img
                        src="/3d-icons/Item 12.png"
                        alt="Whitelabelling"
                        width={64}
                        height={64}
                        className="object-contain w-16 h-16"
                      />
                      <motion.div
                        className="flex items-center gap-1"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                      >
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-xs">
                          Nano
                        </Badge>
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-xs">
                          Banana
                        </Badge>
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-xs">
                          Pro
                        </Badge>
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                          <Flame className="h-4 w-4 text-orange-500" />
                        </motion.div>
                      </motion.div>
                    </div>
                    <h4 className="font-semibold mb-2 text-lg">Whitelabelling</h4>
                    <p className="text-sm text-muted-foreground">
                      Apply your logo to multiple images in bulk. Customize placement, size, and opacity
                    </p>
                  </MotionCard>

                  {/* Brand Studio Card */}
                  <MotionCard
                    className="rounded-xl border bg-card p-6 cursor-pointer"
                    hoverLift
                    hoverShadow
                    delay={0.2}
                  >
                    <img
                      src="/3d-icons/Item 23.png"
                      alt="Brand Studio"
                      width={64}
                      height={64}
                      className="object-contain mb-4 w-16 h-16"
                    />
                    <h4 className="font-semibold mb-2 text-lg">Brand Studio</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically place your brand logo on product images with customizable placement and size
                    </p>
                  </MotionCard>

                  {/* Campaign Studio Card */}
                  <MotionCard
                    className="rounded-xl border bg-card p-6 cursor-pointer"
                    hoverLift
                    hoverShadow
                    delay={0.25}
                  >
                    <img
                      src="/3d-icons/Item 35.png"
                      alt="Campaign Studio"
                      width={64}
                      height={64}
                      className="object-contain mb-4 w-16 h-16"
                    />
                    <h4 className="font-semibold mb-2 text-lg">Campaign Studio</h4>
                    <p className="text-sm text-muted-foreground">
                      Strategize and plan your Meta advertising campaigns. Set budgets, define audiences, and track performance
                    </p>
                  </MotionCard>
                </div>
              </MotionStagger>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Topbar />
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-gray-100/50">
            <div className="flex justify-center items-center" style={{ minHeight: 'calc(100vh - 300px)' }}>
              <Loader
                title="Loading..."
                subtitle="Please wait"
                size="md"
              />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    }>
      <HomePageContent />
    </Suspense>
  )
}

