"use client"

import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"
import { Search, Sparkles, Rocket, Package } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Discover",
    description: "AI scans thousands of products to find winners before they saturate",
    icon: Search,
  },
  {
    number: "02",
    title: "Create",
    description: "AI generates studio-quality visuals, copy, and ads in seconds",
    icon: Sparkles,
  },
  {
    number: "03",
    title: "Launch",
    description: "Push products directly to your Shopify store with one click",
    icon: Rocket,
  },
  {
    number: "04",
    title: "Fulfill",
    description: "Automated order processing and tracking from verified suppliers",
    icon: Package,
  },
]

export function Workflow() {
  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <MotionFadeIn direction="up" distance={DISTANCE.lg} duration={DURATION.slow}>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              From Discovery to First Sale—in 4 Steps
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A streamlined workflow that takes you from product research to customer delivery
            </p>
          </div>
        </MotionFadeIn>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <MotionFadeIn
                key={step.number}
                direction="up"
                distance={DISTANCE.lg}
                delay={index * 0.1}
                duration={DURATION.slow}
              >
                <div className="relative">
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent -z-10" />
                  )}

                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary text-2xl font-bold mb-4">
                      {step.number}
                    </div>
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                      <step.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-600">{step.description}</p>
                  </div>
                </div>
              </MotionFadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}


