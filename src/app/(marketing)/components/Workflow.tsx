"use client"

import Image from "next/image"
import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"

const steps = [
  {
    number: "01",
    title: "Discover",
    subtitle: "AI Scans Thousands of Products",
    description: "Our intelligence engine monitors trending products across TikTok Shop, Amazon, and Shopify to surface winners before they saturate.",
    image: "/images/landing/features-product-discovery.png",
    imagePosition: "left",
  },
  {
    number: "02",
    title: "Create",
    subtitle: "Generate Studio-Quality Visuals",
    description: "AI creates professional product photos, virtual model try-ons, and scroll-stopping ad creatives—no photoshoot needed.",
    image: "/images/landing/features-ai-studio.png",
    imagePosition: "right",
  },
  {
    number: "03",
    title: "Launch",
    subtitle: "Push to Your Store Instantly",
    description: "One-click export to Shopify with optimized titles, descriptions, and pricing. Your store is live in minutes, not weeks.",
    image: "/images/landing/features-competitor-research.png",
    imagePosition: "left",
  },
  {
    number: "04",
    title: "Fulfill",
    subtitle: "Automated Order Processing",
    description: "Connect with verified US suppliers. Orders process automatically, customers get real-time tracking updates.",
    image: "/images/landing/features-fulfillment.png",
    imagePosition: "right",
  },
]

export function Workflow() {
  return (
    <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <MotionFadeIn direction="up" distance={DISTANCE.lg} duration={DURATION.slow}>
          <div className="text-center mb-16 max-w-[886px] mx-auto">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-black tracking-[-0.04em] leading-tight mb-4">
              From Discovery to First Sale
            </h2>
            <p className="text-[16px] text-[#555555] leading-[22px] max-w-[580px] mx-auto">
              A streamlined workflow that takes you from product research to customer delivery
            </p>
          </div>
        </MotionFadeIn>

        <div className="max-w-[1200px] mx-auto">
          {steps.map((step, index) => (
            <MotionFadeIn
              key={step.number}
              direction="up"
              distance={DISTANCE.lg}
              delay={index * 0.1}
              duration={DURATION.slow}
            >
              <div className="mb-16 lg:mb-24">
                <div className={`flex flex-col ${step.imagePosition === "right" ? "lg:flex-row-reverse" : "lg:flex-row"} gap-8 lg:gap-12 items-center`}>
                  <div className="w-full lg:w-3/5">
                    <div className="relative w-full aspect-video lg:aspect-auto lg:h-[400px] rounded-[16px] overflow-hidden shadow-lg">
                      <Image
                        src={step.image}
                        alt={step.subtitle}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 60vw"
                      />
                    </div>
                  </div>

                  <div className="w-full lg:w-2/5 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 mb-4 w-fit">
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-sm font-medium text-gray-700">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-medium text-black tracking-[-0.04em] mb-3">
                      {step.subtitle}
                    </h3>
                    <p className="text-[16px] text-[#555555] leading-[26px]">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </MotionFadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
