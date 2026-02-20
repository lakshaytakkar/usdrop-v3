

import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { MotionCard } from "@/components/motion/MotionCard"
import { DISTANCE, DURATION } from "@/lib/motion"
import { Button } from "@/components/ui/button"
import { Link } from "wouter"
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
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <MotionFadeIn direction="up" distance={DISTANCE.lg} duration={DURATION.slow}>
          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-black tracking-[-0.04em] leading-tight mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-[16px] text-[#555555] leading-[22px] max-w-[580px] mx-auto">
              Start free, upgrade as you grow. No hidden fees.
            </p>
          </div>
        </MotionFadeIn>

        <div className="grid md:grid-cols-3 gap-6 max-w-[1024px] mx-auto">
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
                  p-8 rounded-[16px] bg-white/80 backdrop-blur-xl border h-full
                  ${plan.popular
                    ? "border-transparent shadow-[0_2px_24px_rgba(0,0,0,0.06)] relative before:absolute before:inset-0 before:rounded-[16px] before:p-[1px] before:bg-gradient-to-b before:from-blue-400/40 before:via-purple-400/30 before:to-pink-400/20 before:-z-10 before:content-['']"
                    : "border-white/60 shadow-[0_2px_20px_rgba(0,0,0,0.04)]"
                  }
                `}
              >
                {plan.popular && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100/50 mb-4">
                    <span className="text-xs font-semibold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent uppercase tracking-wider">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-medium text-black tracking-[-0.04em] mb-2">{plan.name}</h3>
                <p className="text-[14px] text-[#555555] mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-medium text-black tracking-[-0.04em]">{plan.price}</span>
                  {plan.period && <span className="text-[#555555] text-[15px]">{plan.period}</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex-shrink-0 h-5 w-5 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center">
                        <Check className="h-3 w-3 text-blue-500" />
                      </div>
                      <span className="text-[14px] text-[#555555]">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className={`w-full h-[44px] rounded-[8px] font-medium text-[14px] ${
                    plan.popular
                      ? "bg-black hover:bg-black/90 text-white"
                      : "bg-white hover:bg-gray-50 text-black border border-black/10"
                  }`}
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
              className="text-[14px] font-medium text-[#555555] hover:text-black transition-colors"
            >
              View full pricing details →
            </Link>
          </div>
        </MotionFadeIn>
      </div>
    </section>
  )
}
