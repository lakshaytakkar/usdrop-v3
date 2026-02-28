import { useUserPlanContext } from "@/contexts/user-plan-context"
import { useAuth } from "@/contexts/auth-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { FrameworkBanner } from "@/components/framework-banner"
import {
  TrendingUp,
  Trophy,
  Grid3x3,
  Calendar,
  Store,
  BarChart3,
  Package,
  Building2,
  User,
  Badge,
  PenTool,
  Mail,
  Shield,
  Receipt,
  Calculator,
  Truck,
  GraduationCap,
  ShoppingBag,
  Bookmark,
  Map,
  FlaskConical,
  KeyRound,
  Crown,
  type LucideIcon,
} from "lucide-react"

interface ServiceItem {
  name: string
  description: string
  icon: LucideIcon
  enabled: boolean
}

function getServices(isPro: boolean): { category: string; services: ServiceItem[] }[] {
  return [
    {
      category: "My Mentorship",
      services: [
        { name: "My Products", description: "Save and organize products for quick access", icon: Bookmark, enabled: true },
        { name: "My Store", description: "Connect and manage your Shopify stores", icon: ShoppingBag, enabled: isPro },
        { name: "My Roadmap", description: "Track progress through your dropshipping journey", icon: Map, enabled: true },
        { name: "My Learning", description: "Access courses, tutorials, and training", icon: GraduationCap, enabled: true },
        { name: "My R&D", description: "Track daily work, learning, and research", icon: FlaskConical, enabled: true },
        { name: "My Profile", description: "Manage your personal and business information", icon: User, enabled: true },
        { name: "My Credentials", description: "Store service logins and API keys securely", icon: KeyRound, enabled: true },
      ],
    },
    {
      category: "Product Research",
      services: [
        { name: "Product Hunt", description: "Discover trending products with AI analysis", icon: TrendingUp, enabled: isPro },
        { name: "Winning Products", description: "Curated high-potential product database", icon: Trophy, enabled: isPro },
        { name: "Categories", description: "Browse products by category", icon: Grid3x3, enabled: isPro },
        { name: "Seasonal Collections", description: "Time-sensitive seasonal product picks", icon: Calendar, enabled: isPro },
        { name: "Competitor Stores", description: "Analyze competitor Shopify stores", icon: Store, enabled: isPro },
      ],
    },
    {
      category: "Marketing",
      services: [
        { name: "Meta Ads", description: "Browse and analyze Facebook & Instagram ads", icon: BarChart3, enabled: isPro },
      ],
    },
    {
      category: "AI Tools",
      services: [
        { name: "Model Studio", description: "AI-powered product photography", icon: User, enabled: isPro },
        { name: "Whitelabelling", description: "Brand products with your own labels", icon: Badge, enabled: isPro },
        { name: "Description Generator", description: "AI-written product descriptions", icon: PenTool, enabled: isPro },
        { name: "Email Templates", description: "Professional email templates for e-commerce", icon: Mail, enabled: isPro },
        { name: "Policy Generator", description: "Auto-generate store policies", icon: Shield, enabled: isPro },
        { name: "Invoice Generator", description: "Create professional invoices", icon: Receipt, enabled: isPro },
        { name: "Profit Calculator", description: "Calculate margins and profitability", icon: Calculator, enabled: isPro },
        { name: "Shipping Calculator", description: "Estimate shipping costs and delivery", icon: Truck, enabled: isPro },
      ],
    },
    {
      category: "Services",
      services: [
        { name: "Private Supplier", description: "Direct access to vetted US suppliers", icon: Package, enabled: true },
        { name: "LLC Formation", description: "US LLC formation for your business", icon: Building2, enabled: true },
        { name: "Shopify Integration", description: "Connect and manage your Shopify stores", icon: ShoppingBag, enabled: isPro },
      ],
    },
  ]
}

function AppleSwitch({ enabled }: { enabled: boolean }) {
  return (
    <div
      className={`relative inline-flex h-[31px] w-[51px] shrink-0 rounded-full transition-colors duration-200 ease-in-out ${
        enabled ? "bg-[#34C759]" : "bg-gray-300"
      }`}
      data-testid={`switch-${enabled ? "on" : "off"}`}
    >
      <span
        className={`pointer-events-none inline-block h-[27px] w-[27px] rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out mt-[2px] ${
          enabled ? "translate-x-[22px]" : "translate-x-[2px]"
        }`}
      />
    </div>
  )
}

export default function MyPlanPage() {
  const { isPro, isLoading: planLoading } = useUserPlanContext()
  const { loading: authLoading } = useAuth()

  const isLoading = planLoading || authLoading
  const serviceGroups = getServices(isPro)
  const totalServices = serviceGroups.reduce((sum, g) => sum + g.services.length, 0)
  const enabledServices = serviceGroups.reduce((sum, g) => sum + g.services.filter(s => s.enabled).length, 0)

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 px-12 md:px-20 lg:px-32 py-2">
        <Skeleton className="h-16 w-full rounded-md" />
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-6">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map(j => (
                  <div key={j} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div>
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-14 rounded-full" />
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 px-12 md:px-20 lg:px-32 py-2" data-testid="page-my-plan">
      <FrameworkBanner
        title="My Plan"
        description="View your active services and subscription features"
        iconSrc="/images/banners/3d-plan.png"
        tutorialVideoUrl=""
      />
      <div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
              isPro
                ? "bg-gradient-to-r from-amber-400 to-amber-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}>
              {isPro ? "Pro Plan" : "Free Plan"}
            </div>
            <span className="text-sm ds-text-muted">
              {enabledServices} of {totalServices} services active
            </span>
          </div>
          {!isPro && (
            <Button className="gap-2" data-testid="button-upgrade-plan">
              <Crown className="h-4 w-4" />
              Upgrade to Pro
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {serviceGroups.map((group) => (
            <Card key={group.category} className="overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="ds-card-title ds-text-heading">{group.category}</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {group.services.map((service) => {
                  const Icon = service.icon
                  return (
                    <div
                      key={service.name}
                      className={`flex items-center justify-between px-6 py-4 transition-colors ${
                        service.enabled ? "" : "opacity-60"
                      }`}
                      data-testid={`service-row-${service.name.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center justify-center h-10 w-10 rounded-xl ${
                          service.enabled
                            ? "bg-primary/10 text-primary"
                            : "bg-gray-100 text-gray-400"
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className={`text-[15px] font-medium ${
                            service.enabled ? "ds-text-heading" : "text-gray-400"
                          }`}>
                            {service.name}
                          </p>
                          <p className={`text-sm ${
                            service.enabled ? "ds-text-muted" : "text-gray-300"
                          }`}>
                            {service.description}
                          </p>
                        </div>
                      </div>
                      <AppleSwitch enabled={service.enabled} />
                    </div>
                  )
                })}
              </div>
            </Card>
          ))}
        </div>

        {!isPro && (
          <Card className="mt-6 p-6 md:p-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0" data-testid="section-upgrade-cta">
            <div className="text-center space-y-3">
              <h2 className="text-xl font-bold">Unlock All {totalServices} Services</h2>
              <p className="text-blue-100 max-w-lg mx-auto text-sm">
                Upgrade to Pro for full access to product research, AI tools, competitor analysis, and everything you need to scale your business.
              </p>
              <Button size="lg" variant="secondary" className="gap-2 mt-2" data-testid="button-upgrade-cta">
                <Crown className="h-4 w-4" />
                Upgrade to Pro
              </Button>
            </div>
          </Card>
        )}

        <div className="pb-6" />
      </div>
    </div>
  )
}
