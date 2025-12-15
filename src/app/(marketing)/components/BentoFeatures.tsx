"use client"

import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { MotionCard } from "@/components/motion/MotionCard"
import { DISTANCE, DURATION } from "@/lib/motion"
import Link from "next/link"
import { ArrowRight, Search, Sparkles, Package } from "lucide-react"

const features = [
  {
    title: "AI Research",
    description: "Find Winners",
    icon: Search,
    bullets: [
      "Product Intelligence Scanner",
      "Competitor Store Analysis",
      "Trend Detection",
    ],
    href: "/research",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "AI Studio",
    description: "Create Content",
    icon: Sparkles,
    bullets: [
      "Apparel Studio (Virtual Try-On)",
      "Product Studio (Scene Generator)",
      "Ad Creator (Creative Generator)",
    ],
    href: "/studio",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "AI Fulfillment",
    description: "Ship Products",
    icon: Package,
    bullets: [
      "Verified Supplier Network",
      "Auto Order Processing",
      "Real-time Tracking",
    ],
    href: "/fulfillment",
    gradient: "from-green-500 to-emerald-500",
  },
]

export function BentoFeatures() {
  return (
    <section className="py-20 lg:py-32 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <MotionFadeIn direction="up" distance={DISTANCE.lg} duration={DURATION.slow}>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Three powerful modules working together to streamline your entire dropshipping workflow
            </p>
          </div>
        </MotionFadeIn>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <MotionFadeIn
              key={feature.title}
              direction="up"
              distance={DISTANCE.lg}
              delay={index * 0.1}
              duration={DURATION.slow}
            >
              <MotionCard
                hoverLift={false}
                hoverShadow={false}
                hoverScale={1}
                className="h-full p-8 bg-white rounded-2xl border border-slate-200"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 mb-6">{feature.description}</p>
                <ul className="space-y-2 mb-8">
                  {feature.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-primary mt-1">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={feature.href}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
                >
                  Learn More
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </MotionCard>
            </MotionFadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}


