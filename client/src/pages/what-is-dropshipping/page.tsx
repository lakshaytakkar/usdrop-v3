import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"
import { Link } from "wouter"
import { ArrowRight, CheckCircle2, ShoppingCart, Store, Megaphone, Package, Truck } from "lucide-react"
import { Footer } from "@/pages/(marketing)/components/Footer"

const steps = [
  {
    number: "01",
    icon: ShoppingCart,
    title: "Find Products That Sell",
    description: "You don't need to guess. USDrop's AI scans what's already selling well online and shows you the best products to sell — with real profit numbers.",
    image: "/images/landing/dropship-find.png",
    bgColor: "#E8E0FF",
  },
  {
    number: "02",
    icon: Store,
    title: "Set Up Your Online Store",
    description: "You get a Shopify store. USDrop's AI writes product titles, descriptions, and sets prices for you. One click and your store is live.",
    image: "/images/landing/dropship-store.png",
    bgColor: "#D4EDFF",
  },
  {
    number: "03",
    icon: Megaphone,
    title: "Get the Word Out",
    description: "Create eye-catching ads for TikTok, Facebook, and Instagram. USDrop's AI generates professional photos and videos — no photography needed.",
    image: "/images/landing/dropship-promote.png",
    bgColor: "#D4F0E0",
  },
  {
    number: "04",
    icon: Package,
    title: "Orders Come In Automatically",
    description: "When a customer buys from your store, the order goes straight to our system. You don't touch inventory or pack anything.",
    image: "/images/landing/dropship-fulfill.png",
    bgColor: "#F8E2FE",
  },
  {
    number: "05",
    icon: Truck,
    title: "We Ship It, Customer Gets It",
    description: "We pick, pack, and ship from US warehouses. Your customer gets their order in 2-5 days with full tracking — and they think it came from your brand.",
    image: "/images/landing/dropship-deliver.png",
    bgColor: "#E8E0FF",
  },
]

const benefits = [
  "No inventory to buy upfront",
  "No warehouse or storage needed",
  "Work from anywhere with a laptop",
  "Start with almost zero money",
  "AI does the hard work for you",
  "Scale as big as you want",
]

export default function WhatIsDropshippingPage() {
  return (
    <div className="min-h-screen relative">
      <section className="pt-24 lg:pt-32 pb-16 lg:pb-24 relative overflow-hidden" style={{
        background: "radial-gradient(ellipse 85% 65% at 50% 0%, rgba(195,170,255,0.2) 0%, transparent 60%), radial-gradient(ellipse 60% 45% at 80% 30%, rgba(180,215,255,0.18) 0%, transparent 55%)"
      }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <MotionFadeIn direction="up" distance={DISTANCE.lg} duration={DURATION.slow}>
            <div className="max-w-[900px] mx-auto text-center mb-12">
              <div className="bg-[#323140] text-white text-[13px] font-medium px-4 py-2 rounded-[8px] w-fit mx-auto mb-6">
                Beginner's Guide
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-medium text-black tracking-[-0.04em] leading-tight mb-6">
                What is Dropshipping?
              </h1>
              <p className="text-[17px] text-[#555555] leading-[28px] max-w-[600px] mx-auto">
                It's a way to sell products online without ever holding inventory. You sell it, we ship it. Here's how it works.
              </p>
            </div>
          </MotionFadeIn>

          <MotionFadeIn direction="up" distance={DISTANCE.md} duration={DURATION.slow} delay={0.2}>
            <div className="max-w-[1000px] mx-auto rounded-[20px] overflow-hidden shadow-lg">
              <img
                src="/images/landing/dropship-hero.png"
                alt="Modern e-commerce dropshipping business workspace"
                className="w-full h-[240px] sm:h-[320px] lg:h-[400px] object-cover"
                loading="eager"
              />
            </div>
          </MotionFadeIn>
        </div>
      </section>

      <section className="py-16 lg:py-24 relative" style={{
        background: "radial-gradient(ellipse 75% 55% at 20% 30%, rgba(180,230,200,0.22) 0%, transparent 60%), radial-gradient(ellipse 55% 40% at 85% 65%, rgba(240,210,250,0.18) 0%, transparent 55%)"
      }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <MotionFadeIn direction="up" distance={DISTANCE.lg} duration={DURATION.slow}>
            <div className="max-w-[700px] mx-auto text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-black tracking-[-0.04em] leading-tight mb-4">
                How Dropshipping Works
              </h2>
              <p className="text-[16px] text-[#777777] leading-[26px]">
                Five simple steps from finding a product to getting paid
              </p>
            </div>
          </MotionFadeIn>

          <div className="max-w-[1100px] mx-auto flex flex-col gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isEven = index % 2 === 1
              return (
                <MotionFadeIn
                  key={step.number}
                  direction="up"
                  distance={DISTANCE.lg}
                  duration={DURATION.slow}
                  delay={index * 0.1}
                >
                  <div
                    className={`rounded-[20px] overflow-hidden flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
                    style={{ backgroundColor: step.bgColor }}
                    data-testid={`card-dropship-step-${step.number}`}
                  >
                    <div className="lg:w-[45%] h-[220px] sm:h-[260px] lg:h-auto relative">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="lg:w-[55%] p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#323140] flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-[13px] font-bold">{step.number}</span>
                        </div>
                        <Icon className="w-6 h-6 text-[#323140]" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-semibold text-black mb-3 tracking-[-0.02em]">
                        {step.title}
                      </h3>
                      <p className="text-[15px] sm:text-[16px] text-[#555555] leading-[26px]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </MotionFadeIn>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 relative" style={{
        background: "radial-gradient(ellipse 80% 60% at 60% 25%, rgba(220,210,255,0.22) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 20% 70%, rgba(180,215,255,0.18) 0%, transparent 55%)"
      }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <MotionFadeIn direction="up" distance={DISTANCE.lg} duration={DURATION.slow}>
            <div className="max-w-[900px] mx-auto bg-white rounded-[20px] p-8 sm:p-12 lg:p-16 border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="text-center mb-10">
                <div className="bg-[#323140] text-white text-[13px] font-medium px-4 py-2 rounded-[8px] w-fit mx-auto mb-6">
                  Why dropshipping?
                </div>
                <h2 className="text-3xl sm:text-4xl font-medium text-black tracking-[-0.04em] leading-tight">
                  Why People Love It
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[600px] mx-auto">
                {benefits.map((benefit, index) => (
                  <MotionFadeIn
                    key={index}
                    direction="up"
                    distance={DISTANCE.sm}
                    duration={DURATION.slow}
                    delay={index * 0.05}
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#2DA565] flex-shrink-0" />
                      <span className="text-[15px] text-[#333333] font-medium" data-testid={`text-benefit-${index}`}>{benefit}</span>
                    </div>
                  </MotionFadeIn>
                ))}
              </div>
            </div>
          </MotionFadeIn>
        </div>
      </section>

      <section className="py-16 lg:py-24 relative" style={{
        background: "radial-gradient(ellipse 70% 50% at 40% 40%, rgba(240,210,250,0.2) 0%, transparent 60%), radial-gradient(ellipse 50% 35% at 80% 20%, rgba(180,230,200,0.18) 0%, transparent 55%)"
      }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <MotionFadeIn direction="up" distance={DISTANCE.lg} duration={DURATION.slow}>
            <div
              className="max-w-[900px] mx-auto rounded-[20px] p-8 sm:p-12 lg:p-16 text-center"
              style={{
                background: "linear-gradient(135deg, rgba(200,180,255,0.25) 0%, rgba(180,210,255,0.25) 50%, rgba(200,180,255,0.2) 100%)",
              }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-black tracking-[-0.04em] leading-tight mb-4">
                Ready to Start Selling?
              </h2>
              <p className="text-[16px] text-[#555555] leading-[26px] max-w-[450px] mx-auto mb-8">
                Sign up free and let AI find your first winning product in minutes.
              </p>
              <Link href="/signup">
                <div
                  className="inline-flex items-center gap-2 bg-[#323140] text-white font-semibold text-[15px] px-8 py-3.5 rounded-[10px] hover:bg-[#323140]/90 transition-colors cursor-pointer"
                  data-testid="button-dropship-cta"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </MotionFadeIn>
        </div>
      </section>

      <Footer />
    </div>
  )
}
