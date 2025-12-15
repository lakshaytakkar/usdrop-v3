"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/topbar"
// import { ChristmasHeader } from "@/components/christmas-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { OnboardingModal } from "@/components/onboarding-modal"
import { Skeleton } from "@/components/ui/skeleton"
import Loader from "@/components/kokonutui/loader"
import { 
  ArrowRight,
  Flame
} from "lucide-react"
import { BannerCarousel, ChristmasBanner } from "@/components/banner-carousel"
import { MotionCard } from "@/components/motion/MotionCard"
import { MotionStagger } from "@/components/motion/MotionStagger"
import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { MotionImage } from "@/components/motion/MotionImage"
import { motion } from "motion/react"

function HomePageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check onboarding status
    const checkOnboardingStatus = async () => {
      try {
        // Add deliberate delay for enhanced UX (1-2 seconds)
        const [response] = await Promise.all([
          fetch("/api/auth/onboarding/status"),
          new Promise(resolve => setTimeout(resolve, 1500))
        ])
        
        const data = await response.json()
        
        if (response.ok) {
          setOnboardingCompleted(data.onboarding_completed || false)
          
          // Show onboarding modal if needed
          const needsOnboarding = searchParams.get("onboarding") === "true" || !data.onboarding_completed
          if (needsOnboarding) {
            setShowOnboarding(true)
            router.replace("/home", { scroll: false })
          }
        } else {
          // Default to showing onboarding if check fails
          setOnboardingCompleted(false)
          setShowOnboarding(true)
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error)
        setOnboardingCompleted(false)
        setShowOnboarding(true)
      } finally {
        setLoading(false)
      }
    }

    checkOnboardingStatus()
  }, [searchParams, router])

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    setOnboardingCompleted(true)
    // Redirect to my-dashboard after profile setup
    router.push("/my-dashboard")
  }

  // Show skeleton while loading or if onboarding is not completed
  const showSkeleton = loading || !onboardingCompleted

  return (
    <>
      <OnboardingModal open={showOnboarding} onComplete={handleOnboardingComplete} />
      {/* <ChristmasHeader /> */}
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Topbar />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-gray-100/50">
          {showSkeleton ? (
            loading ? (
              <div className="flex justify-center items-center" style={{ minHeight: 'calc(100vh - 300px)' }}>
                <Loader 
                  title="Preparing your workspace..." 
                  subtitle="Setting up your personalized dashboard"
                  size="md"
                />
              </div>
            ) : (
              <main className="flex flex-1 flex-col gap-6">
                {/* Featured Tools Skeleton */}
                <Skeleton className="h-[210px] w-full rounded-xl" />
                
                {/* Tools Section Skeleton */}
                <div>
                  <Skeleton className="h-7 w-48 mb-4" />
                  <div className="grid gap-4 md:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="rounded-xl border bg-card p-6">
                        <Skeleton className="h-16 w-16 mb-4 rounded-lg" />
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-5/6" />
                      </div>
                    ))}
                  </div>
                </div>
              </main>
            )
          ) : (
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
                    <MotionImage
                      src="/Right%20color/Camera%23camera,photo,picture,capture,media,image,snapshot,lens,device,photography,app,ui,icon,symbol,record.png"
                      alt="Image Studio"
                      width={64}
                      height={64}
                      className="object-contain mb-4"
                      containerClassName="w-16 h-16 mb-4"
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
                      <MotionImage
                        src="/Right%20color/Edit%23edit,pencil,write,modify,update,change,note,ui,icon,symbol,text,tool,adjust,input,create.png"
                        alt="Ad Studio"
                        width={64}
                        height={64}
                        className="object-contain"
                        containerClassName="w-16 h-16"
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
                    <MotionImage
                      src="/Right%20color/Camera%23camera,photo,picture,capture,media,image,snapshot,lens,device,photography,app,ui,icon,symbol,record.png"
                      alt="Model Studio"
                      width={64}
                      height={64}
                      className="object-contain mb-4"
                      containerClassName="w-16 h-16 mb-4"
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
                      <MotionImage
                        src="/Right%20color/Add%23add,plus,new,create,increase,ui,icon,symbol,button,insert,more,action,expand,positive,symbol.png"
                        alt="Whitelabelling"
                        width={64}
                        height={64}
                        className="object-contain"
                        containerClassName="w-16 h-16"
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
                    <MotionImage
                      src="/Right%20color/Edit%23edit,pencil,write,modify,update,change,note,ui,icon,symbol,text,tool,adjust,input,create.png"
                      alt="Brand Studio"
                      width={64}
                      height={64}
                      className="object-contain mb-4"
                      containerClassName="w-16 h-16 mb-4"
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
                    <MotionImage
                      src="/Right%20color/Star%23star,favorite,rate,rating,like,highlight,ui,icon,symbol,award,mark,best,feature,badge,top.png"
                      alt="Campaign Studio"
                      width={64}
                      height={64}
                      className="object-contain mb-4"
                      containerClassName="w-16 h-16 mb-4"
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
          )}
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

