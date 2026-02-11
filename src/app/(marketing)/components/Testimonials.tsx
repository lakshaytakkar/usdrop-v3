"use client"

import { MotionFadeIn } from "@/components/motion/MotionFadeIn"
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
          <div className="text-center mb-12 max-w-[1200px] mx-auto">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-black tracking-[-0.04em] leading-tight mb-4">
              Trusted by 10,000+ Sellers
            </h2>
            <p className="text-[16px] text-[#555555] leading-[22px] max-w-[580px] mx-auto">
              See how USDrop AI is transforming dropshipping businesses worldwide
            </p>
          </div>
        </MotionFadeIn>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-[1200px] mx-auto">
          {testimonials.map((testimonial, index) => (
            <MotionFadeIn
              key={testimonial.name}
              direction="up"
              distance={DISTANCE.lg}
              delay={index * 0.1}
              duration={DURATION.slow}
            >
              <div className="p-8 bg-white/80 backdrop-blur-xl border border-white/60 rounded-[16px] shadow-[0_2px_20px_rgba(0,0,0,0.04)] h-full flex flex-col">
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-[18px] text-[#555555] mb-8 leading-[28px] flex-1">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-black text-[15px]">{testimonial.name}</div>
                    <div className="text-[14px] text-[#555555]">{testimonial.role}</div>
                  </div>
                </div>
                <div className="pt-5 border-t border-black/5">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100/50">
                    <span className="text-[15px] font-semibold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                      {testimonial.metric}
                    </span>
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
