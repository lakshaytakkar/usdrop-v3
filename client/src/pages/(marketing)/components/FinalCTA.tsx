
import { Link } from "wouter"
import { Search, FileText, Wand2 } from "lucide-react"

import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"

export function FinalCTA() {
  return (
    <section className="w-full py-16 lg:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <MotionFadeIn direction="up" distance={DISTANCE.lg} duration={DURATION.slow}>
          <div
            className="rounded-[20px] py-16 lg:py-24 px-6 sm:px-10 lg:px-16 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(200,180,255,0.2) 0%, rgba(180,210,255,0.2) 50%, rgba(200,180,255,0.15) 100%)",
            }}
          >
            <div className="flex flex-col items-center text-center space-y-8 relative z-10">
              <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
                <div className="flex items-center justify-center w-14 h-14 rounded-md bg-[#323140] border border-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:shadow-[0_0_30px_rgba(34,211,238,0.25)] transition-shadow">
                  <Search className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center justify-center w-14 h-14 rounded-md bg-[#323140] border border-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:shadow-[0_0_30px_rgba(34,211,238,0.25)] transition-shadow">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center justify-center w-14 h-14 rounded-md bg-[#323140] border border-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:shadow-[0_0_30px_rgba(34,211,238,0.25)] transition-shadow">
                  <Wand2 className="w-7 h-7 text-white" />
                </div>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-black tracking-[-0.04em] leading-tight max-w-4xl">
                Unlock a Smarter, Easier Way to Scale Your Store
              </h2>

              <div className="bg-white h-[48px] overflow-clip rounded-[8px] w-[184.2px] relative">
                <Link href="/signup" className="block h-full w-full">
                  <div
                    className="absolute h-[48px] left-[-0.47px] top-0 w-[184.672px]"
                    style={{
                      backgroundImage:
                        "linear-gradient(165.12deg, rgba(220, 143, 255, 1) 0%, rgba(119, 195, 255, 1) 30%, rgba(137, 244, 216, 1) 69.922%, rgba(156, 123, 255, 1) 100%), linear-gradient(180deg, rgba(255, 47, 47, 1) 0%, rgba(239, 123, 22, 1) 35.878%, rgba(138, 67, 225, 1) 69.922%, rgba(213, 17, 253, 1) 100%)",
                    }}
                  />
                  <div
                    className="absolute h-[44px] left-1/2 rounded-[6px] top-1/2 translate-x-[-50%] translate-y-[-50%] w-[180.19px] cursor-pointer transition-opacity flex items-center justify-center"
                    style={{
                      backgroundImage:
                        "linear-gradient(155.02deg, rgba(255, 255, 255, 0) 71.453%, rgba(255, 255, 255, 0.06) 97.88%), linear-gradient(180deg, rgba(21, 21, 21, 1) 0%, rgba(46, 45, 45, 1) 100%)",
                    }}
                  >
                    <span className="text-[14.667px] text-white font-bold">Get Started Free</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </MotionFadeIn>
      </div>
    </section>
  )
}
