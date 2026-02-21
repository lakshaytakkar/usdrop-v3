
import { Suspense } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BlueSpinner } from "@/components/ui/blue-spinner"
import { useAuth } from "@/contexts/auth-context"
import { useUserPlanContext } from "@/contexts/user-plan-context"
import {
  ChevronRight,
  Play,
} from "lucide-react"

import { Link } from "wouter"
import { cn } from "@/lib/utils"

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
  const { plan, isPro } = useUserPlanContext()

  const displayName = user?.full_name || user?.email?.split("@")[0] || "there"
  const firstName = displayName.split(" ")[0]

  return (
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
          <div className="flex items-center gap-2.5 mb-1">
            <img src="/3d-ecom-icons-blue/Wave_Hand.png" alt="" width={40} height={40} className="w-10 h-10 object-contain" />
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome, {firstName}!
            </h1>
          </div>
          <p className="text-blue-200/80 text-sm md:text-base mt-1">
            Your all-in-one dropshipping command center — research, launch & scale
          </p>
          <div className="flex items-center gap-3 mt-3">
            <Badge className={cn(
              "text-xs px-2.5 py-0.5 border-0",
              isPro ? "bg-amber-500 text-white" : "bg-white/20 text-white/90"
            )}>
              {plan || "Free"} Plan
            </Badge>
            <Link href="/mentorship" className="inline-flex items-center gap-1.5 text-sm text-blue-200/80 hover:text-white transition-colors font-medium">
              <Play className="h-3.5 w-3.5 fill-current" />
              Watch tutorial
            </Link>
          </div>
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
                    loading="lazy"
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

const quickLinks = [
  { title: "My Products", description: "Saved & bookmarked", href: "/my-products", iconSrc: "/3d-ecom-icons-blue/My_Products.png" },
  { title: "My Store", description: "Connected Shopify stores", href: "/my-store", iconSrc: "/3d-ecom-icons-blue/My_Store.png", isPro: true },
  { title: "My Roadmap", description: "Track your journey", href: "/my-roadmap", iconSrc: "/3d-ecom-icons-blue/Rocket_Launch.png" },
  { title: "Winning Products", description: "Curated top sellers", href: "/winning-products", iconSrc: "/3d-ecom-icons-blue/Trophy_Star.png" },
  { title: "Shipping Calculator", description: "Estimate costs", href: "/shipping-calculator", iconSrc: "/3d-ecom-icons-blue/Calculator_Ship.png" },
  { title: "Important Tools", description: "Invoices, policies & more", href: "/tools", iconSrc: "/3d-ecom-icons-blue/Toolbox_Wrench.png" },
]

function QuickLinksSection() {
  return (
    <div>
      <h2 className="ds-section-title mb-3 flex items-center gap-2">
        <img src="/3d-ecom-icons-blue/Category_Grid.png" alt="" width={24} height={24} className="w-6 h-6 object-contain" />
        Quick Access
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {quickLinks.map((item) => (
          <Link key={item.href} href={item.href} className="block group" data-testid={`link-quick-${item.title.toLowerCase().replace(/\s/g, '-')}`}>
            <Card className="p-3 hover:border-gray-200 transition-all cursor-pointer rounded-xl hover:shadow-sm border-gray-100 text-center">
              <img src={item.iconSrc} alt={item.title} width={32} height={32} decoding="async" className="w-8 h-8 object-contain mx-auto mb-1.5" />
              <h4 className="text-xs font-semibold text-gray-900 truncate">{item.title}</h4>
              <p className="text-[10px] text-gray-500 truncate mt-0.5">{item.description}</p>
              {item.isPro && (
                <Badge className="text-[8px] px-1 py-0 h-3 bg-amber-500 text-white border-0 leading-none mt-1 mx-auto">PRO</Badge>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

function DashboardContent() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 md:p-6 lg:p-8">
      <WelcomeBanner />
      <HowToUseSection />
      <QuickLinksSection />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 flex-col gap-5 p-4 md:p-6 lg:p-8">
          <div className="flex justify-center items-center" style={{ minHeight: "calc(100vh - 300px)" }}>
            <BlueSpinner size="lg" label="Loading dashboard..." />
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  )
}
