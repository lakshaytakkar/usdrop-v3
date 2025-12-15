"use client"

import React from 'react';
import { Container, Section } from './ui';
import { Quote, Star } from 'lucide-react';
import Image from 'next/image';
import { MotionCarousel } from '@/components/motion/MotionCarousel';
import { MotionFadeIn } from '@/components/motion/MotionFadeIn';
import { MotionCard } from '@/components/motion/MotionCard';
import { motion } from 'motion/react';

const testimonials = [
  {
    id: 1,
    name: "Sarah Jenkins",
    niche: "Home Decor & Organization",
    quote: "I was stuck at $2k/month using AliExpress. Switched to USDrop and hit $45k in my first month because of the fast shipping. Customers actually leave 5-star reviews now.",
    image: "/images/landing/testimonial-sarah.png"
  },
  {
    id: 2,
    name: "Marcus Thorne",
    niche: "Tech Accessories",
    quote: "The product discovery tool is unfair. It found a wireless charger winner for me 2 weeks before everyone else. I made six figures on that one product alone.",
    image: "/images/landing/testimonial-marcus.png"
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    niche: "Sustainable Fashion",
    quote: "Content was my biggest bottleneck. The AI Studio generates photos that look like I spent $5,000 on a photoshoot. It saves me huge amounts of time and money.",
    image: "/images/landing/testimonial-elena.png"
  },
  {
    id: 4,
    name: "David Chen",
    niche: "Fitness Gear",
    quote: "USDrop's auto-fulfillment allows me to travel while my store runs on autopilot. The margins are significantly better than other US suppliers I've tried.",
    image: "/images/landing/testimonial-david.png"
  }
];

export const Testimonials: React.FC = () => {

  return (
    <Section className="bg-white border-t border-slate-100 overflow-hidden">
      <Container>
        <MotionFadeIn delay={0.1}>
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Trusted by Top Sellers</h2>
            <p className="text-slate-600 text-base max-w-2xl mx-auto">
              Join thousands of entrepreneurs who are building their dream businesses with USDrop.
            </p>
          </div>
        </MotionFadeIn>

        <div className="max-w-5xl mx-auto relative">
          <MotionCarousel
            autoPlay
            autoPlayInterval={8000}
            pauseOnHover
            showDots
            showArrows={false}
            swipeable
          >
            {testimonials.map((testimonial, index) => (
              <MotionCard
                key={testimonial.id}
                hoverLift={false}
                className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl p-6 md:p-10 relative z-10 min-h-[400px] flex flex-col md:flex-row items-center gap-8 md:gap-12"
              >
                {/* Image (Left) */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="shrink-0 relative"
                >
                  <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-slate-50 shadow-2xl relative z-10">
                    <Image 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute top-4 -right-4 w-full h-full rounded-full bg-blue-50 -z-10" />
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="absolute -bottom-2 -left-2 bg-blue-600 text-white p-2 rounded-xl z-20 shadow-lg"
                  >
                    <Quote className="w-6 h-6 fill-current" />
                  </motion.div>
                </motion.div>

                {/* Content (Right) */}
                <div className="flex-1 text-center md:text-left space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center md:justify-start gap-1"
                  >
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ))}
                  </motion.div>
                  
                  <motion.blockquote
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-xl md:text-2xl font-medium text-slate-900 leading-relaxed font-display"
                  >
                    "{testimonial.quote}"
                  </motion.blockquote>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="font-bold text-lg text-slate-900">{testimonial.name}</div>
                    <div className="text-blue-600 font-medium">{testimonial.niche}</div>
                  </motion.div>
                </div>
              </MotionCard>
            ))}
          </MotionCarousel>

          {/* Background Blobs */}
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl -z-10" />
        </div>
      </Container>
    </Section>
  );
};

