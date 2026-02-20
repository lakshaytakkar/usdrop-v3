import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"
import { UserPlus, Search, ShoppingBag, Rocket } from "lucide-react"

const steps = [
  {
    step: "Step 1",
    icon: UserPlus,
    title: "Sign up for free in seconds.",
    description:
      "No credit card needed. Enter your email, set a password, and you're in.",
    iconBg: "#E8E0FF",
    iconColor: "#6B5CE7",
  },
  {
    step: "Step 2",
    icon: Search,
    title: "Find your first winning product.",
    description:
      "Our AI scans trending products across marketplaces and shows you what's selling — with profit margins included.",
    iconBg: "#D4F0E0",
    iconColor: "#2DA565",
  },
  {
    step: "Step 3",
    icon: ShoppingBag,
    title: "Add it to your store with one click.",
    description:
      "AI writes the title, description, and sets the price. Your Shopify store is ready to sell instantly.",
    iconBg: "#D4EDFF",
    iconColor: "#3B8AD9",
  },
  {
    step: "Step 4",
    icon: Rocket,
    title: "Start selling — fulfillment is automatic.",
    description:
      "When a customer orders, we handle shipping and tracking. You focus on growing your business.",
    iconBg: "#F8E2FE",
    iconColor: "#B44ED9",
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
              4 Simple Steps to Your First Sale
            </h2>
          </div>
        </MotionFadeIn>

        <div className="max-w-[800px] mx-auto flex flex-col gap-5">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <MotionFadeIn
                key={step.step}
                direction="up"
                distance={DISTANCE.md}
                duration={DURATION.slow}
                delay={index * 0.1}
              >
                <div
                  className="bg-white rounded-[16px] p-7 sm:p-8 flex items-start gap-6 border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                  data-testid={`card-step-${index + 1}`}
                >
                  <div className="flex-1 min-w-0">
                    <span
                      className="text-[14px] font-semibold mb-2 block"
                      style={{ color: step.iconColor }}
                    >
                      {step.step}
                    </span>
                    <h3 className="text-[18px] sm:text-[20px] font-semibold text-black leading-snug mb-2">
                      {step.title}
                    </h3>
                    <p className="text-[15px] text-[#555555] leading-[24px]">
                      {step.description}
                    </p>
                  </div>
                  <div
                    className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center border-2 mt-1"
                    style={{
                      borderColor: step.iconColor,
                      color: step.iconColor,
                    }}
                  >
                    <Icon className="w-5 h-5" strokeWidth={1.8} />
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
