import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"

const steps = [
  {
    step: "Step 1",
    title: "Sign up free — takes 30 seconds.",
    description: "No credit card. Just your email and a password.",
    image: "/images/landing/step-signup.png",
    accentColor: "#6B5CE7",
    accentBg: "#E8E0FF",
  },
  {
    step: "Step 2",
    title: "Find a winning product with AI.",
    description: "We scan what's trending and show you profit margins upfront.",
    image: "/images/landing/step-research.png",
    accentColor: "#2DA565",
    accentBg: "#D4F0E0",
  },
  {
    step: "Step 3",
    title: "Add it to your store in one click.",
    description: "AI writes the listing. Your Shopify store is ready instantly.",
    image: "/images/landing/step-store.png",
    accentColor: "#3B8AD9",
    accentBg: "#D4EDFF",
  },
  {
    step: "Step 4",
    title: "Start selling — we handle the rest.",
    description: "Orders ship automatically. You just watch your business grow.",
    image: "/images/landing/step-selling.png",
    accentColor: "#B44ED9",
    accentBg: "#F8E2FE",
  },
]

export function GettingStarted() {
  return (
    <section className="py-16 lg:py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <MotionFadeIn direction="up" distance={DISTANCE.lg} duration={DURATION.slow}>
          <div className="text-center mb-14">
            <div className="bg-[#323140] text-white text-[13px] font-medium px-4 py-2 rounded-[8px] w-fit mx-auto mb-6">
              Getting started
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-black tracking-[-0.04em] leading-tight">
              4 Steps to Your First Sale
            </h2>
          </div>
        </MotionFadeIn>

        <div className="max-w-[900px] mx-auto flex flex-col gap-5">
          {steps.map((step, index) => (
            <MotionFadeIn
              key={step.step}
              direction="up"
              distance={DISTANCE.md}
              duration={DURATION.slow}
              delay={index * 0.1}
            >
              <div
                className="bg-white rounded-[16px] p-5 sm:p-7 flex items-center gap-5 sm:gap-7 border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                data-testid={`card-step-${index + 1}`}
              >
                <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-[12px] overflow-hidden border-2" style={{ borderColor: step.accentBg }}>
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className="text-[13px] font-semibold mb-1 block"
                    style={{ color: step.accentColor }}
                  >
                    {step.step}
                  </span>
                  <h3 className="text-[17px] sm:text-[19px] font-semibold text-black leading-snug mb-1">
                    {step.title}
                  </h3>
                  <p className="text-[14px] text-[#777777] leading-[22px]">
                    {step.description}
                  </p>
                </div>
              </div>
            </MotionFadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
