import { Link } from "wouter"
import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"
import { ArrowRight } from "lucide-react"

export function FinalCTA() {
  return (
    <section className="py-20 lg:py-32 px-4" data-testid="section-final-cta">
      <div className="max-w-4xl mx-auto">
        <MotionFadeIn direction="up" distance={DISTANCE.md} duration={DURATION.slow}>
          <div className="bg-[#323140] rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, #77C3FF 0%, transparent 50%), radial-gradient(circle at 80% 50%, #E8E0FF 0%, transparent 50%)`,
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat',
              }}
            />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-[42px] font-semibold text-white tracking-[-0.03em] leading-[1.15] mb-4">
                Start scaling your store today.
              </h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto text-[16px]">
                No credit card required. Free plan available.
              </p>
              <Link
                href="/signup"
                data-testid="link-cta-signup"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#323140] font-semibold px-8 py-4 rounded-xl text-base transition-colors shadow-lg"
              >
                Get Started Free
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </MotionFadeIn>
      </div>
    </section>
  )
}
