"use client"

import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { EtherealBackground } from "./EtherealBackground"

export function FinalCTA() {
  return (
    <section className="py-16 lg:py-24 bg-[rgba(255,255,255,0.4)] relative overflow-hidden">
      <EtherealBackground />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <MotionFadeIn direction="up" distance={DISTANCE.lg} duration={DURATION.slow}>
          <div className="max-w-[886px] mx-auto text-center space-y-[12px]">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-black tracking-[-0.04em] leading-tight">
              Ready to Find Your First Winner?
            </h2>
            <p className="text-[16px] text-[#555555] leading-[22px] max-w-[580px] mx-auto">
              Join 10,000+ sellers who are launching profitable products faster with USDrop AI
            </p>
            <div className="flex flex-col sm:flex-row gap-[16px] justify-center">
              <Button
                asChild
                size="lg"
                className="h-[48px] px-8 rounded-[8px] font-medium text-[14.667px] text-white"
              >
                <Link href="/signup">Get Started Free</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-[48px] px-8 rounded-[8px] font-medium text-[14.667px] text-[#323140] border border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.2)] bg-white"
              >
                <Link href="/pricing">Watch Video</Link>
              </Button>
            </div>
            <p className="text-[16px] text-[#555555] leading-[22px]">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </MotionFadeIn>
      </div>
    </section>
  )
}


