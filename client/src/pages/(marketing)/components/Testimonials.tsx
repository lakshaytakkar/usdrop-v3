import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { DISTANCE, DURATION } from "@/lib/motion"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const testimonials = [
  {
    id: "sarah",
    name: "Sarah Chen",
    role: "E-commerce Founder",
    avatar: "https://avatar.iran.liara.run/public/10",
    content: "USDrop cut my product research time from 10 hours to 10 minutes. Found my first $10K winner in the first week.",
  },
  {
    id: "marcus",
    name: "Marcus Rodriguez",
    role: "Dropshipping Expert",
    avatar: "https://avatar.iran.liara.run/public/20",
    content: "The AI Studio is incredible. No more expensive photoshoots — I generate all my product visuals in-house now.",
  },
  {
    id: "emily",
    name: "Emily Johnson",
    role: "Store Owner",
    avatar: "https://avatar.iran.liara.run/public/30",
    content: "Fulfillment automation is a game-changer. Orders process automatically and customers get tracking instantly.",
  },
  {
    id: "david",
    name: "David Park",
    role: "Serial Entrepreneur",
    avatar: "https://avatar.iran.liara.run/public/40",
    content: "With USDrop, we've streamlined our entire dropshipping operation, reducing time spent on administrative tasks.",
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
    label: "Increased Productivity",
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
      <div className="p-8 bg-white rounded-[12px] border border-black/5 h-full flex flex-col shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <p className="text-[16px] text-[#555555] mb-8 leading-[26px] flex-1">
          &ldquo;{testimonial.content}&rdquo;
        </p>
        <div className="flex items-center justify-between pt-6 border-t border-black/5">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
              <AvatarFallback>{testimonial.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-black text-[14px]">{testimonial.name}</div>
              <div className="text-[12px] text-[#999999]">{testimonial.role}</div>
            </div>
          </div>
          <div className="w-6 h-6 rounded-full bg-[#323140] flex items-center justify-center">
            <span className="text-[10px] text-white font-bold">X</span>
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
        className="p-8 rounded-[12px] h-full flex flex-col justify-between"
        style={{ backgroundColor: metric.bgColor }}
      >
        <div>
          <div className="text-5xl font-bold text-black mb-2">{metric.value}</div>
          <div className="text-[16px] text-[#555555] font-medium">{metric.label}</div>
        </div>
        <div className="mt-8 pt-6 border-t border-black/10">
          <div className="text-[14px] font-bold text-[#999999]">LOGO</div>
        </div>
      </div>
    </MotionFadeIn>
  )
}

export function Testimonials() {
  return (
    <section className="py-16 lg:py-24 bg-transparent relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <MotionFadeIn direction="up" distance={DISTANCE.lg} duration={DURATION.slow}>
          <div className="mb-16">
            {/* Badge */}
            <div className="bg-[#323140] text-white text-[13px] font-medium px-4 py-2 rounded-[8px] w-fit mb-8">
              What users say
            </div>

            {/* Heading and Description */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              <h2 className="text-5xl lg:text-6xl font-medium text-black tracking-[-0.02em] leading-tight flex-1">
                What Our Users<br />Are Saying
              </h2>
              <p className="text-[16px] text-[#666666] leading-[26px] max-w-[400px] lg:pt-2">
                See why sellers love the convenience and intelligence of our AI-powered platform
              </p>
            </div>
          </div>
        </MotionFadeIn>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-[1400px] mx-auto">
          {/* Row 1: Metric 1, Testimonial 1, Metric 2 */}
          <MetricCard metric={metrics[0]} delay={0} />
          <TestimonialCard testimonial={testimonials[0]} delay={0.1} />
          <MetricCard metric={metrics[1]} delay={0.2} />

          {/* Row 2: Testimonial 2 (spans 1.5 cols), Testimonial 3 (spans 1.5 cols) */}
          <div className="md:col-span-2">
            <TestimonialCard testimonial={testimonials[1]} delay={0.3} />
          </div>
          <div className="md:col-span-1">
            <TestimonialCard testimonial={testimonials[2]} delay={0.4} />
          </div>

          {/* Row 3: Testimonial 4, Metric 3, Metric 4 */}
          <TestimonialCard testimonial={testimonials[3]} delay={0.5} />
          <MetricCard metric={metrics[2]} delay={0.6} />
          <MetricCard metric={metrics[3]} delay={0.7} />
        </div>
      </div>
    </section>
  )
}
