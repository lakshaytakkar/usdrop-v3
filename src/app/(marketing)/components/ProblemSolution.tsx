"use client"

import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"

export function ProblemSolution() {
  return (
    <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
      {/* Background gradient overlay matching Figma design */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20"></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <MotionFadeIn direction="up" distance={DISTANCE.lg} duration={DURATION.slow}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              The Old Way vs. USDrop Way
            </h2>
          </MotionFadeIn>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Old Way */}
            <MotionFadeIn direction="right" distance={DISTANCE.lg} delay={0.1} duration={DURATION.slow}>
              <div className="p-8 rounded-2xl bg-red-50 border-2 border-red-100">
                <div className="text-red-600 font-bold text-sm uppercase tracking-wider mb-4">
                  ❌ The Old Way
                </div>
                <ul className="space-y-3 text-left text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>5+ different tools to manage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Hours of manual research</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Expensive photoshoots</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Complex fulfillment setup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Weeks to launch</span>
                  </li>
                </ul>
              </div>
            </MotionFadeIn>

            {/* USDrop Way */}
            <MotionFadeIn direction="left" distance={DISTANCE.lg} delay={0.2} duration={DURATION.slow}>
              <div className="p-8 rounded-2xl bg-green-50 border-2 border-green-100">
                <div className="text-green-600 font-bold text-sm uppercase tracking-wider mb-4">
                  ✅ USDrop Way
                </div>
                <ul className="space-y-3 text-left text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>One unified platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>AI finds winners in seconds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>AI generates visuals instantly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Automated fulfillment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Launch in minutes</span>
                  </li>
                </ul>
              </div>
            </MotionFadeIn>
          </div>

          <MotionFadeIn direction="up" distance={DISTANCE.md} delay={0.3} duration={DURATION.slow}>
            <p className="text-lg text-slate-600 mt-8">
              <span className="font-bold text-slate-900">What took 5 tools and 5 hours</span> →{" "}
              <span className="font-bold text-primary">1 platform, 5 minutes</span>
            </p>
          </MotionFadeIn>
        </div>
      </div>
    </section>
  )
}


