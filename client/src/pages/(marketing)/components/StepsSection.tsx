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
    image: "/images/landing/step-product-research.png",
    subFeatures: [
      { label: "AI scans thousands of products daily", icon: "/3d-ecom-icons-blue/Search_Product.png" },
      { label: "See real profit margins instantly", icon: "/3d-ecom-icons-blue/Dollar_Tag.png" },
      { label: "Spy on competitor bestsellers", icon: "/3d-ecom-icons-blue/Competitor_Search.png" },
    ],
  },
  {
    number: "02",
    badge: "Create",
    title: "Create ads that stop the scroll",
    href: "/features/winning-ads",
    cta: "Start Creating",
    image: "/images/landing/step-ad-studio.png",
    subFeatures: [
      { label: "Generate video & image ads in seconds", icon: "/3d-ecom-icons-blue/Megaphone_Ads.png" },
      { label: "Pick your style: UGC or cinematic", icon: "/3d-ecom-icons-blue/Paint_Palette.png" },
      { label: "Batch create dozens of variations", icon: "/3d-ecom-icons-blue/Webinar_Video.png" },
    ],
  },
  {
    number: "03",
    badge: "Launch",
    title: "Launch your store in minutes",
    href: "/features/dashboard",
    cta: "Build Your Store",
    image: "/images/landing/step-store-builder.png",
    subFeatures: [
      { label: "One-click import products to Shopify", icon: "/3d-ecom-icons-blue/My_Store.png" },
      { label: "AI writes your product descriptions", icon: "/3d-ecom-icons-blue/Shopping_Cart.png" },
      { label: "Professional storefront ready to sell", icon: "/3d-ecom-icons-blue/Click_On_Buy_Now.png" },
    ],
  },
  {
    number: "04",
    badge: "Fulfill",
    title: "We ship it straight from our warehouse",
    href: "/features/fulfilment",
    cta: "Automate Shipping",
    image: "/images/landing/step-fulfillment.png",
    subFeatures: [
      { label: "Orders process and ship automatically", icon: "/3d-ecom-icons-blue/Delivery_Truck.png" },
      { label: "Customers get tracking instantly", icon: "/3d-ecom-icons-blue/Calculator_Ship.png" },
      { label: "No inventory risk, ever", icon: "/3d-ecom-icons-blue/Bill.png" },
    ],
  },
  {
    number: "05",
    badge: "Scale",
    title: "See what's working and scale it",
    href: "/features/winning-stores",
    cta: "View Analytics",
    image: "/images/landing/step-analytics.png",
    subFeatures: [
      { label: "Track revenue and conversions live", icon: "/3d-ecom-icons-blue/Open_Board.png" },
      { label: "Find your next winning product", icon: "/3d-ecom-icons-blue/Trophy_Star.png" },
      { label: "Data-driven scaling playbooks", icon: "/3d-ecom-icons-blue/Category_Grid.png" },
    ],
  },
  {
    number: "06",
    badge: "Learn",
    title: "Learn from experts who've done it",
    href: "/features/courses",
    cta: "Start Learning",
    image: "/images/landing/step-learning.png",
    subFeatures: [
      { label: "Step-by-step video courses", icon: "/3d-ecom-icons-blue/Course_Book.png" },
      { label: "Live mentorship from top sellers", icon: "/3d-ecom-icons-blue/Graduation_Book.png" },
      { label: "Community of 10K+ dropshippers", icon: "/3d-ecom-icons-blue/Rocket_Launch.png" },
    ],
  },
]

export function StepsSection() {
  return (
    <section className="py-20 lg:py-32" data-testid="section-steps">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <MotionFadeIn direction="up" distance={DISTANCE.md} duration={DURATION.slow}>
          <div className="text-center mb-20 lg:mb-28">
            <p className="text-[13px] font-semibold text-[#6366F1] uppercase tracking-[0.1em] mb-5">
              How It Works
            </p>
            <h2 className="text-[36px] sm:text-[48px] lg:text-[60px] text-black tracking-[-1.4px] sm:tracking-[-2px] lg:tracking-[-2.4px] font-medium leading-[1.2] sm:leading-[1.15]">
              The 6-Step Formula
            </h2>
          </div>
        </MotionFadeIn>

        <div className="max-w-[1100px] mx-auto space-y-20 lg:space-y-32">
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
                    <div className="rounded-[20px] overflow-hidden bg-[#F8F8FA] border border-black/[0.04] aspect-[4/3]">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  <div className="w-full lg:w-[45%]">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#6366F1] uppercase tracking-[0.1em] bg-[#6366F1]/[0.08] px-3.5 py-1.5 rounded-full">
                        <span className="opacity-60">Step {step.number}</span>
                        <span className="w-px h-3 bg-[#6366F1]/20" />
                        <span>{step.badge}</span>
                      </span>
                    </div>

                    <h3 className="text-[28px] sm:text-[32px] lg:text-[36px] text-black tracking-[-1px] sm:tracking-[-1.4px] font-medium leading-[1.2] mb-8">
                      {step.title}
                    </h3>

                    <div className="space-y-4 mb-8">
                      {step.subFeatures.map((sub) => (
                        <div
                          key={sub.label}
                          className="flex items-center gap-4"
                          data-testid={`sub-feature-${sub.label.toLowerCase().replace(/\s+/g, '-').slice(0, 30)}`}
                        >
                          <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                            <img
                              src={sub.icon}
                              alt=""
                              className="w-12 h-12 object-contain"
                              loading="lazy"
                            />
                          </div>
                          <p className="text-[15px] sm:text-[16px] text-[#555] leading-[22px]">
                            {sub.label}
                          </p>
                        </div>
                      ))}
                    </div>

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
