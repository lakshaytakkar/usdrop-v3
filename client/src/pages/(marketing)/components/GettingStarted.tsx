import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"
import { Search, Zap, Rocket } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Find Winners",
    description: "AI scans trending products and shows profit margins instantly.",
    bgColor: "#F3F0FF",
  },
  {
    number: "02",
    icon: Zap,
    title: "Build Your Store",
    description: "One-click import to Shopify with AI-written listings.",
    bgColor: "#EEFBF3",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Sell & Scale",
    description: "Orders ship automatically. You focus on growing.",
    bgColor: "#FDF2FF",
  },
]

export function GettingStarted() {
  return (
    <section className="py-20 lg:py-32" data-testid="section-how-it-works">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <MotionFadeIn direction="up" distance={DISTANCE.md} duration={DURATION.slow}>
          <div className="text-center mb-16 lg:mb-20">
            <p className="text-[13px] font-semibold text-[#6366F1] uppercase tracking-[0.1em] mb-5">
              How it works
            </p>
            <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-semibold text-black tracking-[-0.03em] leading-[1.15]">
              Three steps. That's it.
            </h2>
          </div>
        </MotionFadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-[1000px] mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <MotionFadeIn
                key={step.number}
                direction="up"
                distance={DISTANCE.md}
                duration={DURATION.slow}
                delay={index * 0.1}
              >
                <div
                  className="rounded-[20px] p-8 lg:p-10 text-center h-full"
                  style={{ backgroundColor: step.bgColor }}
                  data-testid={`card-step-${step.number}`}
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white mb-6">
                    <Icon className="w-6 h-6 text-[#323140]" strokeWidth={1.5} />
                  </div>
                  <div className="text-[12px] font-bold text-[#999] uppercase tracking-[0.1em] mb-3">
                    Step {step.number}
                  </div>
                  <h3 className="text-[20px] font-semibold text-black mb-3 tracking-[-0.01em]">
                    {step.title}
                  </h3>
                  <p className="text-[14px] text-[#777] leading-[22px]">
                    {step.description}
                  </p>
                </div>
              </MotionFadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}
