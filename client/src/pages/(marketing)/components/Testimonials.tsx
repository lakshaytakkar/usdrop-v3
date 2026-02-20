import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const testimonials = [
  {
    id: "sarah",
    name: "Sarah Chen",
    role: "E-commerce Founder",
    avatar: "/images/landing/avatar-sarah.png",
    content: "Found my first $10K winner in week one. Product research went from 10 hours to 10 minutes.",
  },
  {
    id: "marcus",
    name: "Marcus Rodriguez",
    role: "Dropshipping Expert",
    avatar: "/images/landing/avatar-marcus.png",
    content: "The AI Studio replaced expensive photoshoots entirely. I generate all my visuals in-house now.",
  },
  {
    id: "emily",
    name: "Emily Johnson",
    role: "Store Owner",
    avatar: "/images/landing/avatar-emily.png",
    content: "Orders process and ship automatically. Customers get tracking instantly. Total game-changer.",
  },
]

const metrics = [
  { value: "10X", label: "Revenue boost" },
  { value: "90%", label: "Time saved" },
  { value: "3X", label: "Faster launches" },
]

export function Testimonials() {
  return (
    <section className="py-20 lg:py-32" data-testid="section-testimonials">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <MotionFadeIn direction="up" distance={DISTANCE.md} duration={DURATION.slow}>
          <div className="text-center mb-16 lg:mb-20">
            <p className="text-[13px] font-semibold text-[#6366F1] uppercase tracking-[0.1em] mb-5">
              Results
            </p>
            <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-semibold text-black tracking-[-0.03em] leading-[1.15]">
              Real sellers. Real results.
            </h2>
          </div>
        </MotionFadeIn>

        <MotionFadeIn direction="up" distance={DISTANCE.md} duration={DURATION.slow} delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-[960px] mx-auto mb-16 lg:mb-20">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="text-center py-8 px-6 rounded-[20px] bg-[#F8F7FF]"
                data-testid={`metric-${metric.label}`}
              >
                <p className="text-[44px] sm:text-[52px] font-bold text-black tracking-[-0.03em] leading-none mb-2">
                  {metric.value}
                </p>
                <p className="text-[14px] text-[#888] font-medium">{metric.label}</p>
              </div>
            ))}
          </div>
        </MotionFadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-[960px] mx-auto">
          {testimonials.map((t, index) => (
            <MotionFadeIn
              key={t.id}
              direction="up"
              distance={DISTANCE.md}
              duration={DURATION.slow}
              delay={0.15 + index * 0.1}
            >
              <div
                className="p-7 bg-white rounded-[16px] border border-black/[0.05] h-full flex flex-col"
                data-testid={`card-testimonial-${t.id}`}
              >
                <p className="text-[15px] text-[#555] leading-[24px] flex-1 mb-6">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-5 border-t border-black/[0.05]">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={t.avatar} alt={t.name} />
                    <AvatarFallback>{t.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-black text-[14px]">{t.name}</div>
                    <div className="text-[12px] text-[#999]">{t.role}</div>
                  </div>
                </div>
              </div>
            </MotionFadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
