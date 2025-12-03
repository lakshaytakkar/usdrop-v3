"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Check, Zap, Crown, Sparkles, TrendingUp, Target, FileText, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface UpsellDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function UpsellDialog({ isOpen, onClose }: UpsellDialogProps) {
  const router = useRouter()
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null)

  const handlePlanClick = (planSlug: string) => {
    if (expandedPlan === planSlug) {
      setExpandedPlan(null)
    } else {
      setExpandedPlan(planSlug)
    }
  }

  const handleNavigate = (planSlug: string) => {
    router.push(`/pricing/${planSlug}`)
    onClose()
  }

  const plans = [
    {
      slug: "starter",
      name: "Starter",
      icon: Zap,
      iconColor: "text-primary",
      price: "$29",
      tagline: "Perfect for beginners",
      description: "Get started with essential features to launch your dropshipping business",
      features: [
        "50 Products per month",
        "Basic Analytics",
        "Email Support",
        "7-day Free Trial"
      ],
      buttonText: "Get Started",
      buttonVariant: "outline" as const
    },
    {
      slug: "pro",
      name: "Pro",
      icon: Crown,
      iconColor: "text-primary",
      price: "$79",
      tagline: "For serious sellers",
      description: "Scale your business with advanced tools and priority support",
      features: [
        "Unlimited Products",
        "Advanced Analytics",
        "Priority Support",
        "Supplier Contacts",
        "Profit Calculator",
        "14-day Free Trial"
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      slug: "enterprise",
      name: "Enterprise",
      icon: Sparkles,
      iconColor: "text-primary",
      price: "$199",
      tagline: "For agencies & teams",
      description: "Complete solution with team collaboration and custom integrations",
      features: [
        "Everything in Pro",
        "Team Collaboration",
        "API Access",
        "Custom Integrations",
        "Dedicated Support",
        "30-day Free Trial"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0 w-[calc(100%-2rem)] sm:w-full">
        <div className="flex flex-col">
          {/* Hero Image Section */}
          <div className="relative w-full h-48 md:h-64 overflow-hidden rounded-t-lg">
            <Image
              src="/images/features/product-discovery-analytics.png"
              alt="USDrop Analytics Dashboard"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8 space-y-8">
            {/* Informational Card Section */}
            <Card className="p-6 bg-muted/50 border-2">
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold">Unlock Deep Insights</h2>
                <p className="text-muted-foreground text-base">
                  Gain the edge with real-time data & trend tracking.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Competitor Tracker & Insights</h3>
                      <p className="text-sm text-muted-foreground">
                        Monitor your competitors' ad strategies in real time.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Market Trend Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        Stay ahead with up-to-date industry and creative trends.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Smart Ads Report</h3>
                      <p className="text-sm text-muted-foreground">
                        Know your data and get actionable insights to improve creative performance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Pricing Plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const Icon = plan.icon
                const isExpanded = expandedPlan === plan.slug
                const isPopular = plan.popular

                return (
                  <Card
                    key={plan.slug}
                    className={cn(
                      "relative transition-all duration-300 overflow-hidden",
                      isPopular && "border-2 border-primary lg:scale-105",
                      !isPopular && "border-2 hover:border-primary/50",
                      isExpanded && "shadow-lg"
                    )}
                  >
                    {isPopular && (
                      <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs z-10">
                        Most Popular
                      </Badge>
                    )}

                    <div className="p-4 md:p-6 space-y-4">
                      {/* Plan Header */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className={cn("h-5 w-5", plan.iconColor)} />
                          <h3 className="text-xl font-bold">{plan.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{plan.tagline}</p>
                      </div>

                      {/* Price */}
                      <div className="py-4 border-y border-border">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold">{plan.price}</span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground">{plan.description}</p>

                      {/* Expanded Features */}
                      {isExpanded && (
                        <div className="space-y-3 pt-2 animate-in slide-in-from-top-2 duration-200">
                          <ul className="space-y-2">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="space-y-2 pt-2">
                        <Button
                          variant={isExpanded ? "outline" : plan.buttonVariant}
                          className={cn(
                            "w-full cursor-pointer",
                            !isExpanded && plan.buttonVariant === "default" && 
                            "bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground hover:from-primary/90 hover:via-primary/80 hover:to-primary/90"
                          )}
                          onClick={() => handleNavigate(plan.slug)}
                        >
                          {plan.buttonText}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-xs text-muted-foreground hover:text-foreground"
                          onClick={() => handlePlanClick(plan.slug)}
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="h-3 w-3 mr-1" />
                              Hide Details
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3 w-3 mr-1" />
                              View Details
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border">
              <p>All plans include a free trial. No credit card required.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

