import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"
import { Link } from "wouter"
import { ArrowRight } from "lucide-react"

const steps = [
  {
    number: "01",
    badge: "Research",
    title: "Winning Products",
    description: "AI-powered product discovery that surfaces proven winners with real margin data",
    href: "/features/winning-products",
    cta: "Start Researching",
    image: "/images/landing/step-product-research.webp?v=2",
  },
  {
    number: "02",
    badge: "Create",
    title: "Ad Studio",
    description: "Generate scroll-stopping video and image ads in seconds, no design skills needed",
    href: "/features/winning-ads",
    cta: "Start Creating",
    image: "/images/landing/step-ad-studio.webp?v=2",
  },
  {
    number: "03",
    badge: "Launch",
    title: "Store Builder",
    description: "One-click import to Shopify with AI-written descriptions — ready to sell instantly",
    href: "/features/dashboard",
    cta: "Build Your Store",
    image: "/images/landing/step-store-builder.webp?v=2",
  },
  {
    number: "04",
    badge: "Scale",
    title: "Analytics & Insights",
    description: "Track what's working in real time and follow data-driven playbooks to scale",
    href: "/features/winning-stores",
    cta: "View Analytics",
    image: "/images/landing/step-analytics.webp?v=2",
  },
]

export function StepsSection() {
  return (
    <section className="py-20 lg:py-28" data-testid="section-steps">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <MotionFadeIn direction="up" distance={DISTANCE.md} duration={DURATION.slow}>
          <div className="text-center mb-14 lg:mb-20">
            <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] text-black tracking-[-1px] sm:tracking-[-1.5px] lg:tracking-[-2px] font-semibold leading-[1.15]">
              How it works
            </h2>
            <p className="mt-4 text-[16px] sm:text-[17px] text-[#666] max-w-lg mx-auto leading-relaxed">
              Everything you need to find, launch, and scale winning products
            </p>
          </div>
        </MotionFadeIn>

        <div className="space-y-6">
          {steps.map((step, index) => {
            const isReversed = index % 2 === 1
            return (
              <MotionFadeIn
                key={step.number}
                direction="up"
                distance={DISTANCE.sm}
                duration={DURATION.slow}
                delay={index * 0.05}
              >
                <div
                  className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 lg:gap-0 bg-[#FAFAFA] rounded-[20px] border border-black/[0.04] overflow-hidden`}
                  data-testid={`card-step-${step.number}`}
                >
                  <div className="w-full lg:w-[55%] flex-shrink-0">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover"
                      decoding="async"
                    />
                  </div>

                  <div className="w-full lg:w-[45%] px-8 pb-8 lg:px-12 lg:py-10">
                    <h3 className="text-[26px] sm:text-[30px] text-black tracking-[-0.5px] font-semibold leading-[1.2] mb-3">
                      {step.title}
                    </h3>

                    <p className="text-[15px] text-[#666] leading-[1.6] mb-6">
                      {step.description}
                    </p>

                    <Link
                      href={step.href}
                      className="inline-flex items-center gap-2 text-[13px] font-semibold text-black hover:text-[#6366F1] transition-colors cursor-pointer"
                      data-testid={`link-step-${step.number}`}
                    >
                      <span>{step.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </MotionFadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}
