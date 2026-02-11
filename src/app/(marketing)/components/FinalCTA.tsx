"use client"

import Link from "next/link"
import Image from "next/image"
import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"
import { Button } from "@/components/ui/button"
import { EtherealBackground } from "./EtherealBackground"

export function FinalCTA() {
  return (
    <section className="py-16 lg:py-24 bg-[rgba(255,255,255,0.4)] relative overflow-hidden">
      <EtherealBackground />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <MotionFadeIn direction="up" distance={DISTANCE.lg} duration={DURATION.slow}>
              <div className="space-y-6">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-black tracking-[-0.04em] leading-tight">
                  Start Finding Winners Today
                </h2>
                <p className="text-[16px] text-[#555555] leading-[24px] max-w-[520px]">
                  Join 10,000+ sellers building profitable stores with AI-powered product research, creative tools, and automated fulfillment.
                </p>
                <div className="flex flex-col sm:flex-row gap-[16px]">
                  <div className="bg-white h-[48px] overflow-clip rounded-[8px] w-[184.2px] relative">
                    <Link href="/signup" className="block h-full w-full">
                      <div
                        className="absolute h-[48px] left-[-0.47px] top-0 w-[184.672px]"
                        style={{ backgroundImage: "linear-gradient(165.12deg, rgba(220, 143, 255, 1) 0%, rgba(119, 195, 255, 1) 30%, rgba(137, 244, 216, 1) 69.922%, rgba(156, 123, 255, 1) 100%), linear-gradient(180deg, rgba(255, 47, 47, 1) 0%, rgba(239, 123, 22, 1) 35.878%, rgba(138, 67, 225, 1) 69.922%, rgba(213, 17, 253, 1) 100%)" }}
                      />
                      <div
                        className="absolute h-[44px] left-1/2 rounded-[6px] top-1/2 translate-x-[-50%] translate-y-[-50%] w-[180.19px] cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center"
                        style={{ backgroundImage: "linear-gradient(155.02deg, rgba(255, 255, 255, 0) 71.453%, rgba(255, 255, 255, 0.06) 97.88%), linear-gradient(180deg, rgba(21, 21, 21, 1) 0%, rgba(46, 45, 45, 1) 100%)" }}
                      >
                        <span className="text-[14.667px] text-white font-bold">Get Started Free</span>
                      </div>
                    </Link>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="h-[48px] px-8 rounded-[8px] font-bold text-[14.667px] text-[#323140] border border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.2)] bg-white"
                  >
                    <Link href="/signup">Watch Demo</Link>
                  </Button>
                </div>
                <p className="text-[14px] text-[#555555] leading-[20px]">
                  No credit card required · 14-day free trial
                </p>
              </div>
            </MotionFadeIn>

            <MotionFadeIn direction="up" distance={DISTANCE.lg} delay={0.15} duration={DURATION.slow}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-100/40 via-purple-100/40 to-pink-100/40 rounded-[24px] blur-2xl" />
                <div className="relative rounded-[16px] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-white/60">
                  <Image
                    src="/images/landing/features-product-discovery.png"
                    alt="Product Discovery Dashboard"
                    width={600}
                    height={400}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </MotionFadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}
