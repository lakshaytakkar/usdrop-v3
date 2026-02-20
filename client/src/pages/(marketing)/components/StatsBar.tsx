import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"

const stats = [
  { value: "$2M+", label: "Revenue generated" },
  { value: "10K+", label: "Active sellers" },
  { value: "70%", label: "Faster research" },
  { value: "50K+", label: "Products found" },
]

export function StatsBar() {
  return (
    <section className="py-20 lg:py-28" data-testid="section-stats">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <MotionFadeIn direction="up" distance={DISTANCE.md} duration={DURATION.slow}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 max-w-[900px] mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center" data-testid={`stat-${stat.label}`}>
                <p className="text-[40px] sm:text-[48px] lg:text-[56px] font-bold text-black tracking-[-0.03em] leading-none mb-2">
                  {stat.value}
                </p>
                <p className="text-[14px] sm:text-[15px] text-[#888888] font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </MotionFadeIn>
      </div>
    </section>
  )
}
