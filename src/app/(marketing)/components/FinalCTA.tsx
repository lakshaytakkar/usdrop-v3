"use client"

import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function FinalCTA() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <MotionFadeIn direction="up" distance={DISTANCE.lg} duration={DURATION.slow}>
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
              Ready to Find Your First Winner?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Join 10,000+ sellers who are launching profitable products faster with USDrop AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="font-mono text-sm uppercase tracking-wider rounded-full px-8 py-6 h-auto"
              >
                <Link href="/signup">START FREE TRIAL</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="font-mono text-sm uppercase tracking-wider rounded-full px-8 py-6 h-auto border-slate-200 text-slate-700 hover:bg-white"
              >
                <Link href="/pricing">VIEW PRICING</Link>
              </Button>
            </div>
            <p className="text-sm text-slate-500">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </MotionFadeIn>
      </div>
    </section>
  )
}


