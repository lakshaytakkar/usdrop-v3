
import { Suspense, useState } from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useUserPlanContext } from "@/contexts/user-plan-context"
import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/supabase"
import {
  ChevronRight,
  Play,
  Mail,
  Users,
} from "lucide-react"

import { Link } from "wouter"

const howToCards = [
  {
    title: "Trending Products",
    points: ["Hot Sellers", "Daily Updated"],
    href: "/product-hunt",
    thumbnail: "/thumbnails/trending-products.png",
    iconSrc: "/3d-ecom-icons-blue/Search_Product.png",
  },
  {
    title: "Competitors' List",
    points: ["Top Stores", "Sales Data"],
    href: "/competitor-stores",
    thumbnail: "/thumbnails/competitor-stores.png",
    iconSrc: "/3d-ecom-icons-blue/Competitor_Search.png",
  },
  {
    title: "Mentorship",
    points: ["Expert Courses", "Step-by-Step"],
    href: "/mentorship",
    thumbnail: "/thumbnails/mentorship-learning.png",
    iconSrc: "/3d-ecom-icons-blue/Graduation_Book.png",
  },
  {
    title: "Marketing & Ads",
    points: ["Winning Ads", "Strategies"],
    href: "/meta-ads",
    thumbnail: "/thumbnails/marketing-ads.png",
    iconSrc: "/3d-ecom-icons-blue/Megaphone_Ads.png",
  },
  {
    title: "Private Suppliers",
    points: ["Verified", "Fast Shipping"],
    href: "/suppliers",
    thumbnail: "/thumbnails/suppliers-shipping.png",
    iconSrc: "/3d-ecom-icons-blue/Delivery_Truck.png",
  },
  {
    title: "AI Studio",
    points: ["Whitelabel", "Branded Content"],
    href: "/studio/whitelabelling",
    thumbnail: "/thumbnails/ai-studio.png",
    iconSrc: "/3d-ecom-icons-blue/Paint_Palette.png",
  },
]


function formatDuration(minutes: number | null): string {
  if (!minutes || minutes <= 0) return ""
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h > 0) return `${h}h ${m}m`
  return `${m} min`
}

function FreeLearningSection() {
  const { data, isLoading } = useQuery<{ courses: any[] }>({
    queryKey: ['/api/courses'],
    queryFn: () => apiFetch('/api/courses?published=true&pageSize=20&sortBy=created_at&sortOrder=asc').then(r => r.json()),
  })

  const courses = data?.courses || []

  if (isLoading) {
    return (
      <div>
        <h2 className="ds-section-title mb-4 flex items-center gap-2">
          <img src="/3d-ecom-icons-blue/Graduation_Book.png" alt="" width={24} height={24} className="w-6 h-6 object-contain" />
          Free Learning
        </h2>
        <div className="space-y-2.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[4.5rem] w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (courses.length === 0) return null

  return (
    <div>
      <h2 className="ds-section-title mb-4 flex items-center gap-2">
        <img src="/3d-ecom-icons-blue/Graduation_Book.png" alt="" width={24} height={24} className="w-6 h-6 object-contain" />
        Free Learning
      </h2>
      <div className="space-y-2.5">
        {courses.map((course: any) => (
          <Link
            key={course.id}
            href={`/framework/my-learning/${course.id}`}
            className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 bg-gradient-to-br from-blue-50/40 to-white hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer group"
            data-testid={`card-free-video-${course.id}`}
          >
            <div className="relative w-28 h-[4.5rem] rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  decoding="async"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100" />
              )}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                <div className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center">
                  <Play className="h-3.5 w-3.5 text-blue-600 ml-0.5" />
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="ds-card-title group-hover:text-blue-600 transition-colors line-clamp-1" data-testid={`text-course-title-${course.id}`}>{course.title}</h3>
              <p className="ds-caption mt-0.5">
                {course.lessons_count ? `${course.lessons_count} modules` : ""}
                {course.lessons_count && course.duration_minutes ? " · " : ""}
                {formatDuration(course.duration_minutes)}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
          </Link>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {howToCards.map((card) => (
          <Link key={card.href} href={card.href} className="block group" data-testid={`link-howto-${card.title.toLowerCase().replace(/\s/g, '-')}`}>
            <Card className="overflow-hidden rounded-xl hover:shadow-md transition-all cursor-pointer border-gray-100 hover:border-blue-200 bg-gradient-to-br from-blue-50/40 to-white">
              <div className="relative w-full h-36 overflow-hidden bg-gray-100">
                <img
                  src={card.thumbnail}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  decoding="async"
                />
                <img
                  src={card.iconSrc}
                  alt=""
                  className="absolute bottom-2 right-2 w-8 h-8 object-contain drop-shadow-md"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <h3 className="text-[16px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{card.title}</h3>
                  <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors shrink-0" />
                </div>
                <div className="flex items-center gap-3">
                  {card.points.map((point) => (
                    <span key={point} className="inline-flex items-center gap-1 text-[13px] text-gray-600">
                      <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      {point}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

function MentorshipBanner() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl text-white"
      style={{
        background: 'linear-gradient(135deg, #0b1a3d 0%, #102a5c 25%, #1a3a6e 50%, #0f2952 75%, #0a1d45 100%)',
      }}
      data-testid="banner-mentorship"
    >
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-600 via-red-500 to-red-600 opacity-80" />
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-600 via-red-500 to-red-600 opacity-80" />

        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="stripeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0.04" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="800" height="8" fill="url(#stripeGrad)" />
          <rect x="0" y="28" width="800" height="8" fill="url(#stripeGrad)" />
          <rect x="0" y="56" width="800" height="8" fill="url(#stripeGrad)" />
          <rect x="0" y="84" width="800" height="8" fill="url(#stripeGrad)" />
          <rect x="0" y="112" width="800" height="8" fill="url(#stripeGrad)" />
          <rect x="0" y="140" width="800" height="8" fill="url(#stripeGrad)" />
          <rect x="0" y="168" width="800" height="8" fill="url(#stripeGrad)" />
          <rect x="0" y="196" width="800" height="8" fill="url(#stripeGrad)" />
        </svg>

        <svg className="absolute top-2 left-2 opacity-[0.12]" width="80" height="60" viewBox="0 0 80 60">
          {[0,1,2,3,4].map(row => (
            [0,1,2,3,4,5].map(col => (
              <polygon key={`${row}-${col}`} points={`${col*14+7},${row*12+6} ${col*14+8.5},${row*12+10} ${col*14+12.5},${row*12+10} ${col*14+9.2},${row*12+12.5} ${col*14+10.3},${row*12+16.5} ${col*14+7},${row*12+14} ${col*14+3.7},${row*12+16.5} ${col*14+4.8},${row*12+12.5} ${col*14+1.5},${row*12+10} ${col*14+5.5},${row*12+10}`} fill="white" />
            ))
          ))}
        </svg>
      </div>

      <div className="absolute right-4 top-2 bottom-2 hidden md:flex items-end gap-3 opacity-[0.18]">
        <img src="/images/banner/statue-liberty.png" alt="" className="h-28 object-contain drop-shadow-lg" />
        <img src="/images/banner/shopping-cart.png" alt="" className="h-16 object-contain drop-shadow-lg self-end mb-1" />
      </div>
      <div className="absolute right-48 top-3 hidden lg:block opacity-[0.15]">
        <img src="/images/banner/dollar-coins.png" alt="" className="h-12 object-contain drop-shadow-lg" />
      </div>
      <div className="absolute right-32 bottom-2 hidden lg:block opacity-[0.15]">
        <img src="/images/banner/us-trophy.png" alt="" className="h-14 object-contain drop-shadow-lg" />
      </div>

      <div className="relative flex items-center gap-5 md:gap-8 p-5 md:p-7">
        <div className="shrink-0">
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-xl overflow-hidden border-2 border-white/20 shadow-xl ring-2 ring-red-400/30 ring-offset-2 ring-offset-transparent">
            <img
              src="/images/suprans profile.jpg"
              alt="Mr. Suprans - Your Mentor"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-3.5 w-3.5 text-red-300/80" />
            <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.12em] text-red-300/80">Your Mentor</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-0.5">MY MENTOR</h2>
          <p className="text-blue-100/70 text-sm md:text-base font-medium">Mr. Suprans</p>
          <p className="text-blue-200/50 text-xs mt-1 hidden md:block">USA Dropshipping Mentorship Framework</p>
        </div>

        <div className="shrink-0 flex flex-col items-end gap-2">
          <a
            href="mailto:info@suprans.in"
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-blue-500/20 hover:bg-blue-500/35 border border-blue-400/30 text-sm font-medium text-white transition-all cursor-pointer whitespace-nowrap backdrop-blur-sm"
            data-testid="button-email-mentor"
          >
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Send Email to Mentor</span>
            <span className="sm:hidden">Email</span>
          </a>
          <span className="text-[10px] text-blue-300/40 hidden md:block">info@suprans.in</span>
        </div>
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
        <MentorshipBanner />
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
