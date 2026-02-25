import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"
import { Link } from "wouter"
import { ArrowRight } from "lucide-react"

const steps = [
  {
    number: "01",
    badge: "Research",
    title: "Find products that actually sell",
    href: "/features/winning-products",
    cta: "Start Researching",
    image: "/images/landing/step-product-research.webp?v=2",
    bullets: [
      "AI scans thousands of products daily to surface winners",
      "See real profit margins and competitor pricing instantly",
      "Spy on competitor bestsellers and trending niches",
    ],
  },
  {
    number: "02",
    badge: "Create",
    title: "Create ads that stop the scroll",
    href: "/features/winning-ads",
    cta: "Start Creating",
    image: "/images/landing/step-ad-studio.webp?v=2",
    bullets: [
      "Generate video and image ads in seconds with AI",
      "Choose your style — UGC, cinematic, or product-focused",
      "Batch create dozens of variations for split testing",
    ],
  },
  {
    number: "03",
    badge: "Launch",
    title: "Launch your store in minutes",
    href: "/features/dashboard",
    cta: "Build Your Store",
    image: "/images/landing/step-store-builder.webp?v=2",
    bullets: [
      "One-click import products directly to Shopify",
      "AI writes optimized product descriptions for you",
      "Professional storefront ready to sell from day one",
    ],
  },
  {
    number: "04",
    badge: "Scale",
    title: "See what's working and scale it",
    href: "/features/winning-stores",
    cta: "View Analytics",
    image: "/images/landing/step-analytics.webp?v=2",
    bullets: [
      "Track revenue and conversions in real time",
      "Find your next winning product with data-driven insights",
      "Follow proven scaling playbooks from top sellers",
    ],
  },
]

export function StepsSection() {
  return (
    <section className="py-24 lg:py-40" data-testid="section-steps">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <MotionFadeIn direction="up" distance={DISTANCE.md} duration={DURATION.slow}>
          <div className="text-center mb-20 lg:mb-28">
            <p className="text-[13px] font-semibold text-[#6366F1] uppercase tracking-[0.1em] mb-5">
              How It Works
            </p>
            <h2 className="text-[36px] sm:text-[48px] lg:text-[60px] text-black tracking-[-1.4px] sm:tracking-[-2px] lg:tracking-[-2.4px] font-medium leading-[1.2] sm:leading-[1.15]">
              Four Steps to Scale
            </h2>
          </div>
        </MotionFadeIn>

        <div className="max-w-[1100px] mx-auto space-y-28 lg:space-y-40">
          {steps.map((step, index) => {
            const isReversed = index % 2 === 1
            return (
              <MotionFadeIn
                key={step.number}
                direction="up"
                distance={DISTANCE.md}
                duration={DURATION.slow}
                delay={0.05}
              >
                <div
                  className={`flex flex-col gap-10 lg:gap-16 items-center ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
                  data-testid={`card-step-${step.number}`}
                >
                  <div className="w-full lg:w-[55%] flex-shrink-0">
                    <div className="rounded-[20px] overflow-hidden bg-[#F8F8FA] border border-black/[0.04] aspect-video">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-full object-cover"
                        decoding="async"
                      />
                    </div>
                  </div>

                  <div className="w-full lg:w-[45%]">
                    <p className="text-[12px] font-bold text-[#6366F1] uppercase tracking-[0.12em] mb-4">
                      Step {step.number} — {step.badge}
                    </p>

                    <h3 className="text-[32px] lg:text-[44px] text-black tracking-[-1px] lg:tracking-[-1.6px] font-medium leading-[1.15] mb-8">
                      {step.title}
                    </h3>

                    <ul className="space-y-3.5 mb-10">
                      {step.bullets.map((bullet, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-[15px] sm:text-[16px] text-[#555] leading-[1.5]"
                          data-testid={`bullet-step-${step.number}-${i}`}
                        >
                          <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#6366F1] flex-shrink-0" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={step.href}
                      className="inline-flex items-center gap-2 bg-black text-white text-[13px] font-bold uppercase tracking-[0.06em] px-5 py-3 rounded-[8px] hover-elevate cursor-pointer"
                      data-testid={`link-step-${step.number}`}
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>{step.cta}</span>
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
