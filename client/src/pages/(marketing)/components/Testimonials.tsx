import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const testimonials = [
  {
    id: "sarah",
    name: "Sarah Chen",
    role: "E-commerce Founder",
    avatar: "/images/landing/avatar-sarah.png",
    content: "USDrop cut my product research from 10 hours to 10 minutes. Found my first $10K winner in week one.",
  },
  {
    id: "marcus",
    name: "Marcus Rodriguez",
    role: "Dropshipping Expert",
    avatar: "/images/landing/avatar-marcus.png",
    content: "The AI Studio replaced expensive photoshoots. I generate all my product visuals in-house now.",
  },
  {
    id: "emily",
    name: "Emily Johnson",
    role: "Store Owner",
    avatar: "/images/landing/avatar-emily.png",
    content: "Orders process automatically and customers get tracking instantly. Total game-changer.",
  },
  {
    id: "david",
    name: "David Park",
    role: "Serial Entrepreneur",
    avatar: "/images/landing/avatar-david.png",
    content: "We've streamlined our entire operation. Less admin work, more time scaling.",
  },
]

const metrics = [
  {
    id: "metric-1",
    value: "10X",
    label: "Revenue Boost",
    bgColor: "#E8E0FF",
  },
  {
    id: "metric-2",
    value: "2X",
    label: "Faster Launches",
    bgColor: "#D4F0E0",
  },
  {
    id: "metric-3",
    value: "5X",
    label: "Team Growth",
    bgColor: "#D4F0E0",
  },
  {
    id: "metric-4",
    value: "3X",
    label: "More Productivity",
    bgColor: "#F8E2FE",
  },
]

interface TestimonialCardProps {
  testimonial: typeof testimonials[0]
  delay: number
}

interface MetricCardProps {
  metric: typeof metrics[0]
  delay: number
}

function TestimonialCard({ testimonial, delay }: TestimonialCardProps) {
  return (
    <MotionFadeIn
      key={testimonial.id}
      direction="up"
      distance={DISTANCE.lg}
      delay={delay}
      duration={DURATION.slow}
    >
      <div className="p-7 bg-white rounded-[12px] border border-black/5 h-full flex flex-col shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <p className="text-[15px] text-[#555555] mb-7 leading-[25px] flex-1">
          &ldquo;{testimonial.content}&rdquo;
        </p>
        <div className="flex items-center gap-3 pt-5 border-t border-black/5">
          <Avatar className="h-11 w-11 border-2 border-black/5">
            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
            <AvatarFallback>{testimonial.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-black text-[14px]">{testimonial.name}</div>
            <div className="text-[12px] text-[#999999]">{testimonial.role}</div>
          </div>
        </div>
      </div>
    </MotionFadeIn>
  )
}

function MetricCard({ metric, delay }: MetricCardProps) {
  return (
    <MotionFadeIn
      key={metric.id}
      direction="up"
      distance={DISTANCE.lg}
      delay={delay}
      duration={DURATION.slow}
    >
      <div
        className="p-8 rounded-[12px] h-full flex flex-col justify-center items-center text-center"
        style={{ backgroundColor: metric.bgColor }}
      >
        <div className="text-5xl font-bold text-black mb-2">{metric.value}</div>
        <div className="text-[15px] text-[#555555] font-medium">{metric.label}</div>
      </div>
    </MotionFadeIn>
  )
}

export function Testimonials() {
  return (
    <section className="py-16 lg:py-24 bg-transparent relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <MotionFadeIn direction="up" distance={DISTANCE.lg} duration={DURATION.slow}>
          <div className="mb-16">
            <div className="bg-[#323140] text-white text-[13px] font-medium px-4 py-2 rounded-[8px] w-fit mb-8">
              What users say
            </div>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              <h2 className="text-5xl lg:text-6xl font-medium text-black tracking-[-0.02em] leading-tight flex-1">
                Real Results From<br />Real Sellers
              </h2>
              <p className="text-[16px] text-[#666666] leading-[26px] max-w-[360px] lg:pt-2">
                Hear from sellers who scaled their stores with our AI-powered tools
              </p>
            </div>
          </div>
        </MotionFadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-[1400px] mx-auto">
          <MetricCard metric={metrics[0]} delay={0} />
          <TestimonialCard testimonial={testimonials[0]} delay={0.1} />
          <MetricCard metric={metrics[1]} delay={0.2} />

          <div className="md:col-span-2">
            <TestimonialCard testimonial={testimonials[1]} delay={0.3} />
          </div>
          <div className="md:col-span-1">
            <TestimonialCard testimonial={testimonials[2]} delay={0.4} />
          </div>

          <TestimonialCard testimonial={testimonials[3]} delay={0.5} />
          <MetricCard metric={metrics[2]} delay={0.6} />
          <MetricCard metric={metrics[3]} delay={0.7} />
        </div>
      </div>
    </section>
  )
}
