import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"
import { Link } from "wouter"

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
            <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-semibold text-black tracking-[-0.03em] leading-[1.15] mb-4">
              Everything you need. One place.
            </h2>
            <p className="text-[16px] text-[#888] max-w-[480px] mx-auto">
              Six AI-powered tools that cover your entire dropshipping workflow.
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
                  className="rounded-[16px] overflow-hidden bg-[#FAFAFA] border border-black/[0.04] hover-elevate cursor-pointer h-full"
                  data-testid={`card-tool-${tool.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="h-[180px] overflow-hidden">
                    <img
                      src={tool.image}
                      alt={tool.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-[17px] font-semibold text-black mb-1.5 tracking-[-0.01em]">
                      {tool.title}
                    </h3>
                    <p className="text-[14px] text-[#888] leading-[20px]">
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
