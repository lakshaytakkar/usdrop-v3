


import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"
import { EtherealBackground } from "./EtherealBackground"

const features = [
  {
    id: 1,
    title: "AI Product Research",
    subtitle: "Find Winners Before They Trend",
    description: "AI scans thousands of products across marketplaces to identify trending winners with profit potential.",
    image: "/images/landing/features-product-discovery.png",
    span: "md:col-span-2",
    rowSpan: "md:row-span-1",
  },
  {
    id: 2,
    title: "AI Creative Studio",
    subtitle: "Studio-Quality Content in Seconds",
    description: "Generate professional product photos, model try-ons, and ad creatives without expensive photoshoots.",
    image: "/images/landing/features-ai-studio.png",
    span: "md:col-span-1",
    rowSpan: "md:row-span-1",
  },
  {
    id: 3,
    title: "Smart Fulfillment",
    subtitle: "Automated From Order to Doorstep",
    description: "Connect with verified US suppliers, auto-process orders, and provide real-time tracking.",
    image: "/images/landing/features-fulfillment.png",
    span: "md:col-span-1",
    rowSpan: "md:row-span-1",
  },
]

export function BentoFeatures() {
  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[rgba(255,255,255,0.4)] backdrop-blur-[1px]" />
      
      <EtherealBackground />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <MotionFadeIn direction="up" distance={DISTANCE.lg} duration={DURATION.slow}>
          <div className="text-center mb-16 max-w-[886px] mx-auto">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-black tracking-[-0.04em] leading-tight mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-[16px] text-[#555555] leading-[22px] max-w-[580px] mx-auto">
              Three powerful AI modules working together to streamline your entire dropshipping workflow
            </p>
          </div>
        </MotionFadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1200px] mx-auto">
          {features.map((feature, index) => (
            <MotionFadeIn
              key={feature.id}
              direction="up"
              distance={DISTANCE.lg}
              delay={index * 0.1}
              duration={DURATION.slow}
              className={`${feature.span}`}
            >
              {index === 0 ? (
                <div className="h-full bg-[rgba(255,255,255,0.6)] backdrop-blur-xl rounded-[16px] border border-[rgba(255,255,255,0.7)] overflow-hidden hover:bg-[rgba(255,255,255,0.7)] transition-all duration-300 flex flex-col md:flex-row">
                  <div className="p-6 lg:p-8 flex-1 flex flex-col justify-center">
                    <h3 className="text-2xl lg:text-3xl font-medium text-black tracking-[-0.04em] mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-lg lg:text-xl font-medium text-black tracking-[-0.04em] mb-4">
                      {feature.subtitle}
                    </p>
                    <p className="text-[16px] text-[#555555] leading-[22px]">
                      {feature.description}
                    </p>
                  </div>
                  <div className="relative w-full md:w-1/2 h-64 md:h-auto md:min-h-[320px] flex-shrink-0">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              ) : (
                <div className="h-full bg-[rgba(255,255,255,0.6)] backdrop-blur-xl rounded-[16px] border border-[rgba(255,255,255,0.7)] overflow-hidden hover:bg-[rgba(255,255,255,0.7)] transition-all duration-300 flex flex-col">
                  <div className="relative w-full h-56 md:h-64 flex-shrink-0">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-6 lg:p-7 flex flex-col flex-1">
                    <h3 className="text-xl lg:text-2xl font-medium text-black tracking-[-0.04em] mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-lg font-medium text-black tracking-[-0.04em] mb-3">
                      {feature.subtitle}
                    </p>
                    <p className="text-[16px] text-[#555555] leading-[22px]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              )}
            </MotionFadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
