"use client"

import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { MotionCard } from "@/components/motion/MotionCard"
import { DISTANCE, DURATION } from "@/lib/motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for testing the waters",
    features: [
      "10 product scans/month",
      "Basic AI Studio access",
      "Community support",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/mo",
    description: "For serious sellers",
    features: [
      "Unlimited product scans",
      "Full AI Studio suite",
      "Priority support",
      "Advanced analytics",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Scale",
    price: "$149",
    period: "/mo",
    description: "For scaling businesses",
    features: [
      "Everything in Pro",
      "Multi-store management",
      "White-label options",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export function PricingPreview() {
  return (
    <section className="py-20 lg:py-32 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <MotionFadeIn direction="up" distance={DISTANCE.lg} duration={DURATION.slow}>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Start free, upgrade as you grow. No hidden fees.
            </p>
          </div>
        </MotionFadeIn>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <MotionFadeIn
              key={plan.name}
              direction="up"
              distance={DISTANCE.lg}
              delay={index * 0.1}
              duration={DURATION.slow}
            >
              <MotionCard
                hoverLift={false}
                hoverShadow={false}
                hoverScale={1}
                className={`
                  p-8 rounded-2xl border-2 bg-white
                  ${plan.popular ? "border-primary shadow-xl" : "border-slate-200"}
                `}
              >
                {plan.popular && (
                  <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-slate-600 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  {plan.period && <span className="text-slate-600">{plan.period}</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="w-full font-mono text-sm uppercase tracking-wider"
                  variant={plan.popular ? "default" : "outline"}
                >
                  <Link href="/pricing">{plan.cta}</Link>
                </Button>
              </MotionCard>
            </MotionFadeIn>
          ))}
        </div>

        <MotionFadeIn direction="up" distance={DISTANCE.md} delay={0.3} duration={DURATION.slow}>
          <div className="text-center mt-12">
            <Link
              href="/pricing"
              className="text-sm font-medium text-primary hover:underline"
            >
              View full pricing details →
            </Link>
          </div>
        </MotionFadeIn>
      </div>
    </section>
  )
}

