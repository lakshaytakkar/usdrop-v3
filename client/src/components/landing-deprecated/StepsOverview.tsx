

import React from 'react';
import { Container, Section } from './ui';
import { Search, PenTool, TrendingUp } from 'lucide-react';

import { motion } from 'motion/react';
import { MotionFadeIn } from '@/components/motion/MotionFadeIn';
import { MotionStagger } from '@/components/motion/MotionStagger';
import { MotionCard } from '@/components/motion/MotionCard';
import { MotionIcon } from '@/components/motion/MotionIcon';
import { MotionImage } from '@/components/motion/MotionImage';
import { DURATION, EASING } from '@/lib/motion';

export const StepsOverview: React.FC = () => {
  return (
    <Section className="bg-white pt-12 pb-8">
      <Container>
        <MotionFadeIn delay={0.1}>
          <div className="text-center mb-10">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">The Dropshipping Lifecycle</div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">From Idea to 7-Figure Store</h2>
            <p className="text-slate-500 mt-4 text-base max-w-2xl mx-auto">
              Stop stitching together 5 different tools. We give you the complete path from zero to sales in one platform.
            </p>
          </div>
        </MotionFadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          
          {/* Connector Line (Desktop) */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: DURATION.slow, delay: 0.5, ease: EASING.easeOut }}
            className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-100 z-0 border-t border-dashed border-slate-300 origin-left"
          />

          {/* Step 1 */}
          <MotionCard
            hoverLift
            hoverShadow
            delay={0.2}
            className="relative z-10 bg-white border border-slate-200 rounded-3xl p-6 h-full flex flex-col"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: DURATION.normal, delay: 0.3, ease: EASING.spring }}
              className="w-14 h-14 bg-white border-2 border-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm"
            >
              <MotionIcon hoverRotate={15} hoverScale={1.1}>
                <Search className="w-7 h-7" />
              </MotionIcon>
            </motion.div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">1. Discover</h3>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Spy on 8-figure stores to find high-margin winners before they go viral. Validate demand with real-time sales data.
            </p>
            <div className="mt-auto aspect-[4/3] rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 relative">
              <MotionImage
                src="/images/landing/steps-discovery.png"
                alt="Discovery Dashboard"
               
                className="object-cover"
              />
            </div>
          </MotionCard>

          {/* Step 2 */}
          <MotionCard
            hoverLift
            hoverShadow
            delay={0.4}
            className="relative z-10 mt-0 md:mt-12 bg-white border border-slate-200 rounded-3xl p-6 h-full flex flex-col"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: DURATION.normal, delay: 0.5, ease: EASING.spring }}
              className="w-14 h-14 bg-white border-2 border-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm"
            >
              <MotionIcon hoverRotate={15} hoverScale={1.1}>
                <PenTool className="w-7 h-7" />
              </MotionIcon>
            </motion.div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">2. Create</h3>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Replace photographers with AI. Generate professional product photos, on-model shots, and ad creatives in seconds.
            </p>
            <div className="mt-auto aspect-[4/3] rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 relative">
              <MotionImage
                src="/images/landing/steps-create.png"
                alt="AI Studio Interface"
               
                className="object-cover"
              />
            </div>
          </MotionCard>

          {/* Step 3 */}
          <MotionCard
            hoverLift
            hoverShadow
            delay={0.6}
            className="relative z-10 mt-0 md:mt-0 bg-white border border-slate-200 rounded-3xl p-6 h-full flex flex-col"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: DURATION.normal, delay: 0.7, ease: EASING.spring }}
              className="w-14 h-14 bg-white border-2 border-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm"
            >
              <MotionIcon hoverRotate={15} hoverScale={1.1}>
                <TrendingUp className="w-7 h-7" />
              </MotionIcon>
            </motion.div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">3. Scale</h3>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Import to Shopify in 1-click. We handle US fulfillment and tracking automatically so you can focus on ads.
            </p>
            <div className="mt-auto aspect-[4/3] rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 relative">
              <MotionImage
                src="/images/landing/steps-scale.png"
                alt="Scaling Dashboard"
               
                className="object-cover"
              />
            </div>
          </MotionCard>

        </div>
      </Container>
    </Section>
  );
};

