

import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"
import { EtherealBackground } from "./EtherealBackground"

export function ProblemSolution() {
  return (
    <section className="py-16 lg:py-24 bg-[rgba(255,255,255,0.4)] relative overflow-hidden">
      <EtherealBackground />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-[886px] mx-auto text-center space-y-8">
          <MotionFadeIn direction="up" distance={DISTANCE.lg} duration={DURATION.slow}>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-black tracking-[-0.04em] leading-tight">
              The Old Way vs. USDrop Way
            </h2>
          </MotionFadeIn>

          <div className="grid md:grid-cols-2 gap-4 lg:gap-5">
            {/* Old Way */}
            <MotionFadeIn direction="right" distance={DISTANCE.lg} delay={0.1} duration={DURATION.slow}>
              <div className="p-6 lg:p-7 rounded-[16px] bg-red-50 border border-red-100">
                <div className="text-red-600 font-medium text-[16px] uppercase tracking-wider mb-4">
                  ❌ The Old Way
                </div>
                <ul className="space-y-3 text-left text-[#555555]">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span className="text-[16px] leading-[22px]">5+ different tools to manage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span className="text-[16px] leading-[22px]">Hours of manual research</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span className="text-[16px] leading-[22px]">Expensive photoshoots</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span className="text-[16px] leading-[22px]">Complex fulfillment setup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span className="text-[16px] leading-[22px]">Weeks to launch</span>
                  </li>
                </ul>
              </div>
            </MotionFadeIn>

            {/* USDrop Way */}
            <MotionFadeIn direction="left" distance={DISTANCE.lg} delay={0.2} duration={DURATION.slow}>
              <div className="p-6 lg:p-7 rounded-[16px] bg-green-50 border border-green-100">
                <div className="text-green-600 font-medium text-[16px] uppercase tracking-wider mb-4">
                  ✅ USDrop Way
                </div>
                <ul className="space-y-3 text-left text-[#555555]">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-[16px] leading-[22px]">One unified platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-[16px] leading-[22px]">AI finds winners in seconds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-[16px] leading-[22px]">AI generates visuals instantly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-[16px] leading-[22px]">Automated fulfillment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-[16px] leading-[22px]">Launch in minutes</span>
                  </li>
                </ul>
              </div>
            </MotionFadeIn>
          </div>

          <MotionFadeIn direction="up" distance={DISTANCE.md} delay={0.3} duration={DURATION.slow}>
            <p className="text-[16px] text-[#555555] leading-[22px] mt-2">
              <span className="font-medium text-black">What took 5 tools and 5 hours</span> →{" "}
              <span className="font-medium bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">1 platform, 5 minutes</span>
            </p>
          </MotionFadeIn>
        </div>
      </div>
    </section>
  )
}


