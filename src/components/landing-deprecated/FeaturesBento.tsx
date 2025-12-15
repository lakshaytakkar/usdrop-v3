"use client"

import React from 'react';
import { Container, Section, Button } from './ui';
import { Search, Image as ImageIcon, Truck, TrendingUp, Globe, Award, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { MotionFadeIn } from '@/components/motion/MotionFadeIn';
import { MotionStagger } from '@/components/motion/MotionStagger';
import { MotionCard } from '@/components/motion/MotionCard';
import { MotionCounter } from '@/components/motion/MotionCounter';
import { MotionImage } from '@/components/motion/MotionImage';
import { MotionButton } from '@/components/motion/MotionButton';
import { MotionIcon } from '@/components/motion/MotionIcon';
import { DURATION, EASING } from '@/lib/motion';

export const FeaturesBento: React.FC = () => {
  return (
    <Section id="features" className="bg-slate-50 border-y border-slate-200">
      <Container>
        <MotionFadeIn delay={0.1}>
          <div className="text-center mb-10 max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Everything You Need to Dominate.
            </h2>
            <p className="text-slate-500 text-base leading-relaxed">
              Stop stitching together 5 different tools. We give you the complete stack to build a 7-figure dropshipping brand in the USA.
            </p>
          </div>
        </MotionFadeIn>

        {/* Massive Asymmetric Grid */}
        <MotionStagger staggerDelay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-[350px_250px_250px] gap-4">
            
            {/* 1. Product Discovery (Large Hero) */}
            <MotionCard
              hoverLift
              hoverShadow
              delay={0}
              className="md:col-span-2 md:row-span-2 bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: DURATION.normal, delay: 0.3 }}
                className="absolute top-10 right-10 z-10 p-4 bg-white rounded-2xl shadow-lg border border-slate-100 hidden md:block"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2">
                  <MotionIcon hoverRotate={15}>
                    <Search className="w-6 h-6" />
                  </MotionIcon>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  <MotionCounter value={50} suffix="M+" />
                </div>
                <div className="text-xs text-slate-500 font-bold uppercase">Products Scanned</div>
              </motion.div>
             
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">#1 Product Discovery Engine</h3>
                  <p className="text-slate-500 text-lg max-w-md">Spy on 8-figure stores. Find hidden winners before they go viral. Validated real-time data from TikTok & Meta.</p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: DURATION.fast, ease: EASING.easeOut }}
                >
                  <Button className="w-fit rounded-full px-8 h-12 font-bold bg-slate-900 text-white hover:bg-slate-800">
                    Start Spying
                  </Button>
                </motion.div>
              </div>

              <div className="absolute bottom-0 right-0 w-3/4 h-3/4 translate-x-12 translate-y-12">
                <div className="w-full h-full bg-slate-50 rounded-tl-[3rem] overflow-hidden border-t border-l border-slate-100 shadow-2xl relative">
                  <MotionImage
                    src="/images/landing/features-product-grid.png"
                    alt="Product Grid"
                    fill
                    className="object-cover opacity-90"
                    hoverScale={1.05}
                  />
                </div>
              </div>
            </MotionCard>

            {/* 2. AI Studio (Tall Vertical) */}
            <MotionCard
              hoverLift
              hoverShadow
              delay={0.1}
              className="md:col-span-1 md:row-span-2 bg-slate-900 rounded-[2.5rem] p-6 border border-slate-800 relative overflow-hidden"
            >
              <div className="absolute inset-0">
                <MotionImage
                  src="/images/landing/features-ai-model.png"
                  alt="AI Model"
                  fill
                  className="object-cover opacity-60"
                  hoverOpacity
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-end">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-white mb-4 border border-white/10"
                >
                  <ImageIcon className="w-5 h-5" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">AI Creative Studio</h3>
                <p className="text-slate-300 text-sm mb-6">Generate ads & photos instantly. No models needed.</p>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center text-white text-xs font-bold uppercase tracking-wider gap-2 cursor-pointer"
                >
                  Try Now <ArrowUpRight className="w-4 h-4" />
                </motion.div>
              </div>
            </MotionCard>

            {/* 3. Fast Shipping (Small Card) */}
            <MotionCard
              hoverLift
              hoverShadow
              delay={0.15}
              className="md:col-span-1 md:row-span-1 bg-blue-600 rounded-[2.5rem] p-6 text-white relative overflow-hidden cursor-pointer"
            >
              <motion.div
                whileHover={{ rotate: 0, scale: 1.1 }}
                className="absolute top-0 right-0 p-8 opacity-10"
                style={{ rotate: 12 }}
              >
                <Truck className="w-24 h-24" />
              </motion.div>
              <h3 className="text-xl font-bold mb-2 relative z-10">Fast US Shipping</h3>
              <p className="text-blue-100 text-sm mb-6 relative z-10">2-5 day delivery via USPS, UPS & FedEx.</p>
              <div className="flex -space-x-3 relative z-10">
                <motion.div
                  whileHover={{ scale: 1.1, y: -4 }}
                  className="w-10 h-10 rounded-full border-2 border-blue-500 bg-white flex items-center justify-center text-blue-600 font-bold text-xs"
                >
                  US
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1, y: -4 }}
                  className="w-10 h-10 rounded-full border-2 border-blue-500 bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs"
                >
                  CA
                </motion.div>
              </div>
            </MotionCard>

            {/* 4. Profit Calc (Small Card) */}
            <MotionCard
              hoverLift
              hoverShadow
              delay={0.2}
              className="md:col-span-1 md:row-span-1 bg-white rounded-[2.5rem] p-6 border border-slate-200"
            >
              <div className="flex justify-between items-start mb-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600"
                >
                  <TrendingUp className="w-6 h-6" />
                </motion.div>
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: DURATION.fast, delay: 0.5, ease: EASING.spring }}
                  className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full"
                >
                  +127% ROI
                </motion.span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Profit Calculator</h3>
              <p className="text-slate-500 text-xs mt-2">Know your margins before you sell.</p>
            </MotionCard>

          {/* 5. Academy (Wide) */}
          <div className="md:col-span-2 md:row-span-1 bg-slate-900 rounded-[2.5rem] p-6 flex items-center justify-between relative overflow-hidden">
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                   <Award className="w-4 h-4" /> Included Free
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Dropshipping Academy</h3>
                <p className="text-slate-400 text-sm">Master FB Ads & TikTok scaling with expert courses.</p>
             </div>
             <div className="absolute right-0 top-0 w-1/2 h-full mask-gradient-left relative">
                <Image src="/images/landing/features-academy.png" alt="Academy" fill className="object-cover opacity-50" />
             </div>
          </div>

          {/* 6. Global (Wide) */}
          <div className="md:col-span-2 md:row-span-1 bg-white border border-slate-200 rounded-[2.5rem] p-6 flex items-center justify-between relative overflow-hidden group hover:border-blue-300 transition-all">
             <div className="relative z-10 max-w-sm">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Sell Globally</h3>
                <p className="text-slate-500 text-sm mb-4">We handle VAT, customs, and currency automatically.</p>
                <Button variant="outline" size="sm" className="rounded-full text-xs font-bold">Explore Markets</Button>
             </div>
             <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <Globe className="w-16 h-16 text-blue-500" strokeWidth={1.5} />
             </div>
          </div>

        </div>
        </MotionStagger>
      </Container>
    </Section>
  );
};

