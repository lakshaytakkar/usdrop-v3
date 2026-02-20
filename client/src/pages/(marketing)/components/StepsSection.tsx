import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"
import { Link } from "wouter"
import { Search, Palette, ShoppingBag, Truck, BarChart3, GraduationCap } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Find Winning Products",
    description: "AI-powered research that surfaces trending products with real profit margins before they go viral.",
    icon: Search,
    color: "#6366F1",
    bgColor: "#F3F0FF",
    href: "/features/winning-products",
    subFeatures: [
      { label: "Trend Scanner", description: "Real-time viral product detection" },
      { label: "Profit Calculator", description: "Instant margin analysis" },
      { label: "Competitor Intel", description: "See what top stores sell" },
    ],
  },
  {
    number: "02",
    title: "Create Scroll-Stopping Ads",
    description: "Generate professional ad creatives, videos, and copy with AI — no design skills needed.",
    icon: Palette,
    color: "#EC4899",
    bgColor: "#FDF2FF",
    href: "/features/winning-ads",
    subFeatures: [
      { label: "AI Ad Generator", description: "Images & videos in seconds" },
      { label: "Copywriting AI", description: "High-converting ad copy" },
      { label: "Template Library", description: "Proven ad frameworks" },
    ],
  },
  {
    number: "03",
    title: "Build Your Store",
    description: "Launch a professional Shopify store with AI-written product listings in minutes, not weeks.",
    icon: ShoppingBag,
    color: "#10B981",
    bgColor: "#EEFBF3",
    href: "/features/dashboard",
    subFeatures: [
      { label: "One-Click Import", description: "Products to Shopify instantly" },
      { label: "AI Descriptions", description: "SEO-optimized listings" },
      { label: "Store Templates", description: "Ready-to-sell designs" },
    ],
  },
  {
    number: "04",
    title: "Automate Fulfillment",
    description: "Orders process and ship automatically. Customers get tracking. You focus on growing.",
    icon: Truck,
    color: "#F59E0B",
    bgColor: "#FFFBEB",
    href: "/features/fulfilment",
    subFeatures: [
      { label: "Auto Processing", description: "Zero manual order handling" },
      { label: "Tracking Updates", description: "Customers stay informed" },
      { label: "Supplier Network", description: "Vetted global suppliers" },
    ],
  },
  {
    number: "05",
    title: "Analyze & Scale",
    description: "Track performance, spy on competitors, and find your next winning product to scale revenue.",
    icon: BarChart3,
    color: "#3B82F6",
    bgColor: "#EFF6FF",
    href: "/features/winning-stores",
    subFeatures: [
      { label: "Store Analytics", description: "Revenue & conversion data" },
      { label: "Competitor Spy", description: "See top stores' strategies" },
      { label: "Scaling Playbooks", description: "Proven growth frameworks" },
    ],
  },
  {
    number: "06",
    title: "Learn & Master",
    description: "Courses, mentorship, and community to take you from beginner to profitable seller.",
    icon: GraduationCap,
    color: "#8B5CF6",
    bgColor: "#F5F3FF",
    href: "/features/courses",
    subFeatures: [
      { label: "Video Courses", description: "Step-by-step training" },
      { label: "Live Mentorship", description: "Expert guidance" },
      { label: "Community", description: "Connect with sellers" },
    ],
  },
]

export function StepsSection() {
  return (
    <section className="py-20 lg:py-32" data-testid="section-steps">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <MotionFadeIn direction="up" distance={DISTANCE.md} duration={DURATION.slow}>
          <div className="text-center mb-16 lg:mb-24">
            <p className="text-[13px] font-semibold text-[#6366F1] uppercase tracking-[0.1em] mb-5">
              Your Roadmap
            </p>
            <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-semibold text-black tracking-[-0.03em] leading-[1.15] mb-4">
              Six steps to a profitable store.
            </h2>
            <p className="text-[16px] text-[#888] max-w-[500px] mx-auto">
              Each step is powered by AI tools that handle the hard work for you.
            </p>
          </div>
        </MotionFadeIn>

        <div className="max-w-[1000px] mx-auto space-y-6 lg:space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isEven = index % 2 === 1
            return (
              <MotionFadeIn
                key={step.number}
                direction="up"
                distance={DISTANCE.md}
                duration={DURATION.slow}
                delay={index * 0.06}
              >
                <Link
                  href={step.href}
                  data-testid={`link-step-${step.number}`}
                >
                  <div
                    className="rounded-[24px] p-8 lg:p-10 hover-elevate cursor-pointer transition-all duration-300"
                    style={{ backgroundColor: step.bgColor }}
                    data-testid={`card-step-${step.number}`}
                  >
                    <div className={`flex flex-col lg:flex-row items-start gap-6 lg:gap-10 ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                      <div className="flex-shrink-0">
                        <div
                          className="w-16 h-16 rounded-[16px] flex items-center justify-center"
                          style={{ backgroundColor: `${step.color}15` }}
                        >
                          <Icon className="w-7 h-7" style={{ color: step.color }} strokeWidth={1.8} />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <span
                            className="text-[12px] font-bold uppercase tracking-[0.12em] px-3 py-1 rounded-full"
                            style={{ backgroundColor: `${step.color}15`, color: step.color }}
                          >
                            Step {step.number}
                          </span>
                        </div>

                        <h3 className="text-[22px] lg:text-[26px] font-semibold text-black tracking-[-0.02em] mb-2">
                          {step.title}
                        </h3>
                        <p className="text-[15px] text-[#666] leading-[24px] mb-6 max-w-[500px]">
                          {step.description}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {step.subFeatures.map((sub) => (
                            <div
                              key={sub.label}
                              className="bg-white/70 rounded-[12px] px-4 py-3"
                              data-testid={`sub-feature-${sub.label.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              <p className="text-[13px] font-semibold text-black mb-0.5">{sub.label}</p>
                              <p className="text-[12px] text-[#888]">{sub.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </MotionFadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}
