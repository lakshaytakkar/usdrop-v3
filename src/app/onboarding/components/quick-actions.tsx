"use client"

import { CardContent, CardHeader } from "@/components/ui/card"
import { MotionCard } from "@/components/motion/MotionCard"
import { 
  Package, 
  Store, 
  GraduationCap, 
  TrendingUp,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import { useOnboarding } from "@/contexts/onboarding-context"
import { cn } from "@/lib/utils"

interface QuickAction {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  color: string
}

export function QuickActions() {
  const { totalVideos, completedVideos } = useOnboarding()
  const hasIncompleteVideos = completedVideos < totalVideos

  const actions: QuickAction[] = [
    {
      title: "Add Product to My Products",
      description: "Save products for later review",
      icon: Package,
      href: "/my-products",
      color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "Connect Shopify Store",
      description: "Link your store to start selling",
      icon: Store,
      href: "/my-shopify-stores",
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
    },
    {
      title: hasIncompleteVideos ? "Continue Learning" : "Explore Courses",
      description: hasIncompleteVideos 
        ? "Complete your onboarding course"
        : "Discover new courses",
      icon: GraduationCap,
      href: hasIncompleteVideos ? "/onboarding" : "/academy",
      color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20"
    },
    {
      title: "Explore Products",
      description: "Browse winning products",
      icon: TrendingUp,
      href: "/winning-products",
      color: "text-pink-600 bg-pink-50 dark:bg-pink-900/20"
    }
  ]

  return (
    <MotionCard 
      className="rounded-xl border bg-card h-full"
      hoverLift={true}
      hoverShadow={true}
    >
      <CardHeader>
        <h3 className="font-semibold text-lg">Quick Actions</h3>
        <p className="text-sm text-muted-foreground">
          Get started with these common tasks
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <Link key={index} href={action.href} className="block group">
                <div className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors h-full">
                  <div className={cn("p-2 rounded-lg shrink-0", action.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium text-sm truncate">{action.title}</div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {action.description}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </MotionCard>
  )
}

