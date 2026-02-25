import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"
import { Link } from "wouter"
import { ArrowRight } from "lucide-react"

const tools = [
  {
    title: "Product Research",
    description: "Find what sells before it trends.",
    image: "/images/landing/features-product-discovery.png",
    href: "/features/winning-products",
  },
  {
    title: "AI Ad Studio",
    description: "Generate scroll-stopping creatives.",
    image: "/images/landing/features-ai-studio.png",
    href: "/features/winning-ads",
  },
  {
    title: "Store Builder",
    description: "Launch your Shopify store in minutes.",
    image: "/images/landing/features-product-grid.png",
    href: "/features/dashboard",
  },
  {
    title: "Auto Fulfillment",
    description: "Orders ship without you lifting a finger.",
    image: "/images/landing/features-fulfillment.png",
    href: "/features/fulfilment",
  },
  {
    title: "Competitor Spy",
    description: "See exactly what's working for others.",
    image: "/images/landing/features-competitor-research.png",
    href: "/features/winning-stores",
  },
  {
    title: "Learning Hub",
    description: "Courses and mentorship to level up fast.",
    image: "/images/landing/features-academy.png",
    href: "/features/courses",
  },
]

export function BentoFeatures() {
  return (
    <section className="py-20 lg:py-32" data-testid="section-toolkit">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <MotionFadeIn direction="up" distance={DISTANCE.md} duration={DURATION.slow}>
          <div className="text-center mb-16 lg:mb-20">
            <p className="text-[13px] font-semibold text-[#6366F1] uppercase tracking-[0.1em] mb-5">
              Platform
            </p>
            <h2 className="text-[40px] sm:text-[52px] lg:text-[64px] font-bold text-black tracking-[-0.03em] leading-[1.1] mb-4">
              Your Toolkit. Built In.
            </h2>
            <p className="text-[17px] text-[#888] max-w-[480px] mx-auto">
              Six powerful tools, one platform.
            </p>
          </div>
        </MotionFadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 max-w-[1100px] mx-auto">
          {tools.map((tool, index) => (
            <MotionFadeIn
              key={tool.title}
              direction="up"
              distance={DISTANCE.md}
              duration={DURATION.slow}
              delay={index * 0.08}
            >
              <Link href={tool.href} data-testid={`link-tool-${tool.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <div
                  className="group relative rounded-[16px] overflow-hidden cursor-pointer h-full aspect-[16/10]"
                  data-testid={`card-tool-${tool.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <img
                    src={tool.image}
                    alt={tool.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    decoding="async"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/5 transition-opacity duration-300 group-hover:from-black/80 group-hover:via-black/50 group-hover:to-black/30" />

                  <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/25" />

                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[18px] sm:text-[20px] font-bold text-white tracking-[-0.01em] leading-tight">
                        {tool.title}
                      </h3>
                      <ArrowRight className="w-5 h-5 text-white transition-all duration-300 group-hover:text-[#6366F1] group-hover:translate-x-1" />
                    </div>
                    <p className="text-[13px] sm:text-[14px] text-white/75 leading-[20px]">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </Link>
            </MotionFadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
