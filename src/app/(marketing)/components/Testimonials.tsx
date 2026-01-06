"use client"

import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
import { MotionCard } from "@/components/motion/MotionCard"
import { DISTANCE, DURATION } from "@/lib/motion"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "E-commerce Founder",
    avatar: "https://avatar.iran.liara.run/public/10",
    content: "USDrop AI cut my product research time from 10 hours to 10 minutes. Found my first $10K winner in the first week.",
    metric: "$47K first month",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Dropshipping Expert",
    avatar: "https://avatar.iran.liara.run/public/20",
    content: "The AI Studio is incredible. No more expensive photoshoots—I generate all my product visuals in-house now.",
    metric: "3x faster launches",
    rating: 5,
  },
  {
    name: "Emily Johnson",
    role: "Store Owner",
    avatar: "https://avatar.iran.liara.run/public/30",
    content: "Fulfillment automation is a game-changer. Orders process automatically and customers get tracking instantly.",
    metric: "100% automation",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <MotionFadeIn direction="up" distance={DISTANCE.lg} duration={DURATION.slow}>
          <div className="text-center mb-12 max-w-[886px] mx-auto">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-black tracking-[-0.04em] leading-tight mb-4">
              Trusted by 10,000+ Sellers
            </h2>
            <p className="text-[16px] text-[#555555] leading-[22px] max-w-[580px] mx-auto">
              See how USDrop AI is transforming dropshipping businesses
            </p>
          </div>
        </MotionFadeIn>

        <div className="grid md:grid-cols-3 gap-4 lg:gap-5 max-w-[886px] mx-auto">
          {testimonials.map((testimonial, index) => (
            <MotionFadeIn
              key={testimonial.name}
              direction="up"
              distance={DISTANCE.lg}
              delay={index * 0.1}
              duration={DURATION.slow}
            >
              <MotionCard
                hoverLift={false}
                hoverShadow={false}
                hoverScale={1}
                className="p-8 bg-white rounded-[16px] border border-slate-200"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-[16px] text-[#555555] mb-6 leading-[22px]">{testimonial.content}</p>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-black">{testimonial.name}</div>
                    <div className="text-[16px] text-[#555555]">{testimonial.role}</div>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <div className="text-2xl font-medium bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">{testimonial.metric}</div>
                </div>
              </MotionCard>
            </MotionFadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}


