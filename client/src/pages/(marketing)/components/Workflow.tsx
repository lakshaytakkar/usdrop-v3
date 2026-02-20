import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"
import { Link } from "wouter"
import { Search, Paintbrush, Rocket } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Discover",
    description: "AI finds trending winners before they saturate the market.",
    bgColor: "#E8E0FF",
  },
  {
    number: "02",
    icon: Paintbrush,
    title: "Create",
    description: "Generate studio-quality photos and ad creatives in seconds.",
    bgColor: "#D4F0E0",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Launch & Fulfill",
    description: "One-click store setup. Automated fulfillment. Live in minutes.",
    bgColor: "#F8E2FE",
  },
]

export function Workflow() {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <MotionFadeIn direction="up" distance={DISTANCE.lg} duration={DURATION.slow}>
          <div className="mb-12">
            <div className="bg-[#323140] text-white text-[13px] font-medium px-4 py-2 rounded-[8px] w-fit mb-6">
              How it works
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-black tracking-[-0.04em] leading-tight">
                From Discovery to First Sale
              </h2>
              <p className="text-[16px] text-[#555555] leading-[22px] flex items-center">
                Research, create, and launch — all from one platform
              </p>
            </div>
          </div>
        </MotionFadeIn>

        <MotionFadeIn direction="up" distance={DISTANCE.lg} duration={DURATION.slow} delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12 lg:mb-20">
            <div className="rounded-[16px] p-8 lg:p-12" style={{ backgroundColor: "#EDEDED" }}>
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="bg-[#323140] text-white text-[11px] font-medium px-3 py-1.5 rounded-[6px] w-fit mb-6">
                    How it Works
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-black mb-4">
                    A Simple 3-Step Process
                  </h3>
                  <p className="text-[14px] sm:text-[16px] text-[#555555] leading-[22px]">
                    AI handles the heavy lifting — from research to fulfillment.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <Link href="/signup" className="flex-1 sm:flex-initial">
                    <div className="bg-white h-[44px] overflow-clip rounded-[8px] w-full sm:w-[156px] relative cursor-pointer">
                      <div 
                        className="absolute h-[44px] left-0 top-0 w-full cursor-pointer" 
                        style={{ backgroundImage: "linear-gradient(165.12deg, rgba(220, 143, 255, 1) 0%, rgba(119, 195, 255, 1) 30%, rgba(137, 244, 216, 1) 69.922%, rgba(156, 123, 255, 1) 100%), linear-gradient(180deg, rgba(255, 47, 47, 1) 0%, rgba(239, 123, 22, 1) 35.878%, rgba(138, 67, 225, 1) 69.922%, rgba(213, 17, 253, 1) 100%)" }} 
                      />
                      <div 
                        className="absolute h-[40px] left-1/2 rounded-[6px] top-1/2 translate-x-[-50%] translate-y-[-50%] w-[152px] cursor-pointer transition-opacity flex items-center justify-center" 
                        style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 180.19 44\" xmlns=\"http://www.w3.org/2000/svg\" preserveAspectRatio=\"none\"><rect x=\"0\" y=\"0\" height=\"100%\" width=\"100%\" fill=\"url(%23grad)\" opacity=\"0.24\"/><defs><radialGradient id=\"grad\" gradientUnits=\"userSpaceOnUse\" cx=\"0\" cy=\"0\" r=\"10\" gradientTransform=\"matrix(18.019 4.4 -8.9948 17.553 0 0)\"><stop stop-color=\"rgba(174,163,240,1)\" offset=\"0\"/><stop stop-color=\"rgba(131,122,180,1)\" offset=\"0.25\"/><stop stop-color=\"rgba(109,102,150,1)\" offset=\"0.375\"/><stop stop-color=\"rgba(87,82,120,1)\" offset=\"0.5\"/><stop stop-color=\"rgba(65,61,90,1)\" offset=\"0.625\"/><stop stop-color=\"rgba(44,41,60,1)\" offset=\"0.75\"/><stop stop-color=\"rgba(22,20,30,1)\" offset=\"0.875\"/><stop stop-color=\"rgba(11,10,15,1)\" offset=\"0.9375\"/><stop stop-color=\"rgba(5,5,8,1)\" offset=\"0.96875\"/><stop stop-color=\"rgba(0,0,0,1)\" offset=\"1\"/></radialGradient></defs></svg>'), linear-gradient(155.02deg, rgba(255, 255, 255, 0) 71.453%, rgba(255, 255, 255, 0.06) 97.88%), linear-gradient(180deg, rgba(21, 21, 21, 1) 0%, rgba(46, 45, 45, 1) 100%)" }}
                      >
                        <span className="text-[13px] text-white font-bold whitespace-nowrap">Start For Free</span>
                      </div>
                    </div>
                  </Link>
                  <Link href="/signup" className="flex-1 sm:flex-initial">
                    <button className="h-[44px] px-6 rounded-[8px] border-2 border-[#323140] text-[#323140] font-medium text-[13px] hover:bg-[#323140]/5 transition-colors w-full sm:w-auto" data-testid="button-book-demo">
                      Book a Demo
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="rounded-[16px] relative overflow-hidden min-h-[300px] sm:min-h-[350px]">
              <img
                src="/images/landing/workflow-hero.png"
                alt="Entrepreneur using USDrop AI platform on laptop"
                className="w-full h-full object-cover rounded-[16px]"
                loading="lazy"
              />
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-[8px] shadow-lg">
                <span className="text-[12px] font-medium text-[#323140]">
                  AI Processing Complete
                </span>
              </div>
            </div>
          </div>
        </MotionFadeIn>

        <MotionFadeIn direction="up" distance={DISTANCE.lg} duration={DURATION.slow} delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <div
                  key={step.number}
                  className="rounded-[16px] p-8 relative overflow-hidden"
                  style={{ backgroundColor: step.bgColor }}
                >
                  <div className="absolute top-6 left-6 w-10 h-10 rounded-full bg-[#323140] flex items-center justify-center">
                    <span className="text-white text-[13px] font-bold">{step.number}</span>
                  </div>
                  <div className="flex flex-col items-center text-center mt-12 mb-6">
                    <div className="mb-6 p-4 rounded-full" style={{ backgroundColor: "rgba(50, 49, 64, 0.1)" }}>
                      <Icon className="w-8 h-8 text-[#323140]" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-medium text-[#323140] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-[14px] text-[#555555] leading-[22px]">
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </MotionFadeIn>
      </div>
    </section>
  )
}
