import { Link } from "wouter"
import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"

export function FinalCTA() {
  return (
    <section className="py-20 lg:py-32" data-testid="section-final-cta">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <MotionFadeIn direction="up" distance={DISTANCE.md} duration={DURATION.slow}>
          <div className="text-center max-w-[640px] mx-auto">
            <h2 className="text-[32px] sm:text-[40px] lg:text-[52px] font-semibold text-black tracking-[-0.03em] leading-[1.12] mb-5">
              Start scaling your store today.
            </h2>
            <p className="text-[16px] text-[#888] mb-10">
              No credit card required. Free plan available.
            </p>

            <div className="bg-white h-[52px] overflow-clip rounded-[10px] w-[200px] relative mx-auto">
              <Link href="/signup" className="block h-full w-full" data-testid="link-cta-signup">
                <div
                  className="absolute h-[52px] left-[-0.47px] top-0 w-[201px]"
                  style={{
                    backgroundImage:
                      "linear-gradient(165.12deg, rgba(220, 143, 255, 1) 0%, rgba(119, 195, 255, 1) 30%, rgba(137, 244, 216, 1) 69.922%, rgba(156, 123, 255, 1) 100%)",
                  }}
                />
                <div
                  className="absolute h-[48px] left-1/2 rounded-[8px] top-1/2 translate-x-[-50%] translate-y-[-50%] w-[196px] cursor-pointer transition-opacity flex items-center justify-center"
                  style={{
                    backgroundImage:
                      "linear-gradient(155.02deg, rgba(255, 255, 255, 0) 71.453%, rgba(255, 255, 255, 0.06) 97.88%), linear-gradient(180deg, rgba(21, 21, 21, 1) 0%, rgba(46, 45, 45, 1) 100%)",
                  }}
                >
                  <span className="text-[15px] text-white font-bold">Get Started Free</span>
                </div>
              </Link>
            </div>
          </div>
        </MotionFadeIn>
      </div>
    </section>
  )
}
