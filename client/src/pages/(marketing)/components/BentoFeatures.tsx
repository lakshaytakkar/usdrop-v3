import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"
import { TrendingUp, Search, Zap, PackageCheck } from "lucide-react"

const features = [
  {
    id: 1,
    title: "AI Product Research",
    description: "Find trending winners with profit margins — before your competitors do.",
    icon: TrendingUp,
  },
  {
    id: 2,
    title: "Smart Supplier Matching",
    description: "Verified US suppliers with the best prices and fastest shipping.",
    icon: Search,
  },
  {
    id: 3,
    title: "Instant Store Setup",
    description: "One-click import to Shopify with AI-optimized listings and pricing.",
    icon: Zap,
  },
  {
    id: 4,
    title: "Auto Fulfillment",
    description: "Orders process and ship automatically. You focus on growing.",
    icon: PackageCheck,
  },
]

export function BentoFeatures() {
  return (
    <section className="relative py-16 lg:py-24 overflow-hidden bg-transparent">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <MotionFadeIn direction="up" distance={DISTANCE.lg} duration={DURATION.slow}>
          <div className="mb-12 lg:mb-16">
            <div className="bg-[#323140] text-white text-[13px] font-medium px-4 py-2 rounded-[8px] w-fit mb-6">
              Features
            </div>
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              <div className="flex-1">
                <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-medium text-black tracking-[-0.04em] leading-tight">
                  Everything You Need, One Platform
                </h2>
              </div>
              <div className="flex-1 flex items-start pt-2">
                <p className="text-[16px] text-[#555555] leading-[22px]">
                  Three AI modules working together to power your entire dropshipping workflow
                </p>
              </div>
            </div>
          </div>
        </MotionFadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <MotionFadeIn direction="left" distance={DISTANCE.lg} duration={DURATION.slow}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <MotionFadeIn
                    key={feature.id}
                    direction="up"
                    distance={DISTANCE.md}
                    delay={index * 0.1}
                    duration={DURATION.slow}
                  >
                    <div className="h-full bg-white rounded-[12px] border border-[rgba(0,0,0,0.06)] p-6 hover-elevate transition-shadow duration-300 flex flex-col" data-testid={`card-feature-${feature.id}`}>
                      <div className="mb-4">
                        <IconComponent className="w-8 h-8 text-[#323140]" />
                      </div>
                      <h3 className="text-lg font-medium text-black tracking-[-0.02em] mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-[14px] text-[#777777] leading-[21px]">
                        {feature.description}
                      </p>
                    </div>
                  </MotionFadeIn>
                )
              })}
            </div>
          </MotionFadeIn>

          <MotionFadeIn direction="right" distance={DISTANCE.lg} duration={DURATION.slow}>
            <div className="relative h-full min-h-[400px] rounded-[24px] overflow-hidden">
              <img
                src="/images/landing/features-hero.png"
                alt="E-commerce workspace with laptop, products, and shipping supplies"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </MotionFadeIn>
        </div>
      </div>
    </section>
  )
}
