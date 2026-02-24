
import { Suspense, useState } from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/auth-context"
import { useUserPlanContext } from "@/contexts/user-plan-context"
import {
  ChevronRight,
  PlayCircle,
  Play,
} from "lucide-react"
import { VideoTutorialModal } from "@/components/ui/video-tutorial-modal"

import { Link } from "wouter"

const howToCards = [
  {
    title: "Trending Products",
    description: "What products are making money right now?",
    href: "/product-hunt",
    thumbnail: "/thumbnails/trending-products.png",
    iconSrc: "/3d-ecom-icons-blue/Search_Product.png",
  },
  {
    title: "Competitors' List",
    description: "Which shops in my category are selling well?",
    href: "/competitor-stores",
    thumbnail: "/thumbnails/competitor-stores.png",
    iconSrc: "/3d-ecom-icons-blue/Competitor_Search.png",
  },
  {
    title: "Mentorship",
    description: "Learn from experts with step-by-step courses",
    href: "/mentorship",
    thumbnail: "/thumbnails/mentorship-learning.png",
    iconSrc: "/3d-ecom-icons-blue/Graduation_Book.png",
  },
  {
    title: "Marketing & Ads",
    description: "Browse winning ad creatives and strategies",
    href: "/meta-ads",
    thumbnail: "/thumbnails/marketing-ads.png",
    iconSrc: "/3d-ecom-icons-blue/Megaphone_Ads.png",
  },
  {
    title: "Private Suppliers",
    description: "Find reliable suppliers for your products",
    href: "/suppliers",
    thumbnail: "/thumbnails/suppliers-shipping.png",
    iconSrc: "/3d-ecom-icons-blue/Delivery_Truck.png",
  },
  {
    title: "AI Studio",
    description: "Create whitelabel images and branded content",
    href: "/studio/whitelabelling",
    thumbnail: "/thumbnails/ai-studio.png",
    iconSrc: "/3d-ecom-icons-blue/Paint_Palette.png",
  },
]

function WelcomeBanner() {
  const { user } = useAuth()
  const [videoModalOpen, setVideoModalOpen] = useState(false)

  const displayName = user?.full_name || user?.email?.split("@")[0] || "there"
  const firstName = displayName.split(" ")[0]

  return (
    <>
      <div
        className="relative overflow-hidden rounded-2xl p-6 md:p-8 text-white"
        style={{
          background: 'linear-gradient(135deg, #0f2b5e 0%, #0d3b8f 30%, #1a4faa 60%, #0d3b8f 80%, #0a2456 100%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-300/30 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-blue-400/20 rounded-full translate-y-1/3" />
        </div>

        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              <span className="text-4xl md:text-5xl mr-2 align-middle">👋</span> Welcome, {firstName}!
            </h1>
            <p className="text-blue-200/80 text-sm md:text-base mb-3">
              Your all-in-one dropshipping command center — research, launch & scale
            </p>
            <button
              onClick={() => setVideoModalOpen(true)}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-sm font-medium text-white transition-all cursor-pointer whitespace-nowrap backdrop-blur-sm"
              data-testid="button-welcome-video-tutorial"
            >
              <PlayCircle className="h-4 w-4" />
              <span>Video Tutorial</span>
            </button>
          </div>
          <div className="hidden md:block w-28 h-28 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg shrink-0">
            <img
              src="/images/mentor-portrait-2.png"
              alt="Your mentor"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <VideoTutorialModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        title="Welcome Video Tutorial"
      />
    </>
  )
}

const freeLearningVideos = [
  {
    title: "What is Dropshipping & How Does It Work?",
    duration: "8:24",
    thumbnail: "/thumbnails/trending-products.png",
  },
  {
    title: "Finding Your First Winning Product",
    duration: "12:15",
    thumbnail: "/thumbnails/competitor-stores.png",
  },
  {
    title: "Setting Up Your Shopify Store from Scratch",
    duration: "15:30",
    thumbnail: "/thumbnails/mentorship-learning.png",
  },
  {
    title: "Running Your First Facebook Ad",
    duration: "10:45",
    thumbnail: "/thumbnails/marketing-ads.png",
  },
  {
    title: "How to Price Products for Maximum Profit",
    duration: "6:52",
    thumbnail: "/thumbnails/suppliers-shipping.png",
  },
  {
    title: "Fulfilling Your First Order Step by Step",
    duration: "9:18",
    thumbnail: "/thumbnails/ai-studio.png",
  },
]

function FreeLearningSection() {
  return (
    <div>
      <h2 className="ds-section-title mb-4 flex items-center gap-2">
        <img src="/3d-ecom-icons-blue/Graduation_Book.png" alt="" width={24} height={24} className="w-6 h-6 object-contain" />
        Free Learning
      </h2>
      <div className="space-y-2.5">
        {freeLearningVideos.map((video, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 bg-gradient-to-br from-blue-50/40 to-white hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer group"
            data-testid={`card-free-video-${i}`}
          >
            <div className="relative w-28 h-[4.5rem] rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
                decoding="async"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                <div className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center">
                  <Play className="h-3.5 w-3.5 text-blue-600 ml-0.5" />
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="ds-card-title group-hover:text-blue-600 transition-colors line-clamp-1">{video.title}</h3>
              <p className="ds-caption mt-0.5">{video.duration}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}

function HowToUseSection() {
  return (
    <div>
      <h2 className="ds-section-title mb-4 flex items-center gap-2">
        <img src="/3d-ecom-icons-blue/Open_Board.png" alt="" width={24} height={24} className="w-6 h-6 object-contain" />
        How to use USDrop
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {howToCards.map((card) => (
          <Link key={card.href} href={card.href} className="block group" data-testid={`link-howto-${card.title.toLowerCase().replace(/\s/g, '-')}`}>
            <Card className="overflow-hidden rounded-xl hover:shadow-md transition-all cursor-pointer border-gray-100 hover:border-blue-200 bg-gradient-to-br from-blue-50/40 to-white">
              <div className="p-4 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1">
                    <h3 className="ds-card-title group-hover:text-blue-600 transition-colors">{card.title}</h3>
                    <ChevronRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-blue-500 transition-colors shrink-0" />
                  </div>
                  <p className="ds-caption leading-relaxed">{card.description}</p>
                </div>
                <div className="relative w-36 h-24 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                  <img
                    src={card.thumbnail}
                    alt={card.title}
                    className="w-full h-full object-cover"
                    decoding="async"
                  />
                  <img
                    src={card.iconSrc}
                    alt=""
                    className="absolute bottom-1 right-1 w-7 h-7 object-contain drop-shadow-sm"
                  />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

function DashboardContent() {
  return (
    <div className="relative flex flex-1 flex-col">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 35% at 50% 0%, rgba(195,170,255,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 60% 30% at 85% 8%, rgba(180,215,255,0.16) 0%, transparent 60%),
            radial-gradient(ellipse 70% 25% at 10% 18%, rgba(180,230,200,0.14) 0%, transparent 55%),
            radial-gradient(ellipse 80% 30% at 75% 28%, rgba(220,210,255,0.16) 0%, transparent 60%),
            radial-gradient(ellipse 65% 25% at 20% 38%, rgba(240,210,250,0.14) 0%, transparent 55%),
            radial-gradient(ellipse 75% 25% at 85% 48%, rgba(180,230,200,0.15) 0%, transparent 55%),
            radial-gradient(ellipse 70% 25% at 15% 58%, rgba(180,215,255,0.16) 0%, transparent 60%),
            radial-gradient(ellipse 80% 30% at 70% 68%, rgba(195,170,255,0.14) 0%, transparent 55%),
            radial-gradient(ellipse 65% 25% at 25% 78%, rgba(240,210,250,0.15) 0%, transparent 55%),
            radial-gradient(ellipse 75% 30% at 80% 88%, rgba(180,215,255,0.14) 0%, transparent 60%)
          `,
        }}
      />
      <div className="relative z-[1] flex flex-1 flex-col gap-6 px-12 md:px-20 lg:px-32 py-6 md:py-8">
        <WelcomeBanner />
        <FreeLearningSection />
        <HowToUseSection />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 flex-col gap-6 px-12 md:px-20 lg:px-32 py-6 md:py-8">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-white/60 bg-white/40 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-20 w-28 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  )
}
