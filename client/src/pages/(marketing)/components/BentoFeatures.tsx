import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"
import { TrendingUp, Search, Zap, PackageCheck } from "lucide-react"

const features = [
  {
    id: 1,
    title: "AI Product Research",
    description: "Our AI scans thousands of products across marketplaces to identify trending winners with profit potential.",
    icon: TrendingUp,
  },
  {
    id: 2,
    title: "Smart Supplier Matching",
    description: "Instantly find verified US suppliers with the best prices, fastest shipping, and highest reliability scores.",
    icon: Search,
  },
  {
    id: 3,
    title: "Instant Store Setup",
    description: "One-click import to your Shopify store with AI-optimized titles, descriptions, and pricing.",
    icon: Zap,
  },
  {
    id: 4,
    title: "Auto Fulfillment",
    description: "Orders process automatically. Customers get real-time tracking. You focus on growing.",
    icon: PackageCheck,
  },
]

const tagCloudLabels = [
  "Product Research",
  "AI Studio",
  "Supplier Matching",
  "Ad Creative",
  "Store Builder",
  "Auto Fulfill",
  "Analytics",
]

function TagCloud() {
  return (
    <div className="relative h-full min-h-[500px] flex items-center justify-center">
      <div className="absolute inset-0 bg-[rgba(241,211,255,0.3)] border-2 border-[rgba(255,255,255,0.6)] rounded-[24px]" />
      <div className="relative z-10 w-full h-full flex items-center justify-center p-8">
        <div className="relative w-full h-full max-w-sm">
          {tagCloudLabels.map((label, index) => {
            const angle = (index / tagCloudLabels.length) * 360
            const distance = 40 + (index % 3) * 20
            const x = Math.cos((angle * Math.PI) / 180) * distance
            const y = Math.sin((angle * Math.PI) / 180) * distance
            const rotation = (angle + 180) % 360 - 180

            return (
              <div
                key={index}
                className="absolute"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                }}
              >
                <div className="bg-white text-[#323140] text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap shadow-sm">
                  {label}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

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
                  Everything You Need in One Platform
                </h2>
              </div>
              <div className="flex-1 flex items-start pt-2">
                <p className="text-[16px] text-[#555555] leading-[22px]">
                  Three powerful AI modules working together to streamline your entire dropshipping workflow
                </p>
              </div>
            </div>
          </div>
        </MotionFadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left side: Feature cards grid */}
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
                    <div className="h-full bg-white rounded-[12px] border border-[rgba(0,0,0,0.06)] p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col">
                      <div className="mb-4">
                        <IconComponent className="w-8 h-8 text-[#323140]" />
                      </div>
                      <h3 className="text-lg font-medium text-black tracking-[-0.02em] mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-[16px] text-[#555555] leading-[22px]">
                        {feature.description}
                      </p>
                    </div>
                  </MotionFadeIn>
                )
              })}
            </div>
          </MotionFadeIn>

          {/* Right side: Tag cloud */}
          <MotionFadeIn direction="right" distance={DISTANCE.lg} duration={DURATION.slow}>
            <TagCloud />
          </MotionFadeIn>
        </div>
      </div>
    </section>
  )
}
