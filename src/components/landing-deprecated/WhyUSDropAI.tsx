"use client"

import React from 'react';
import { Rocket } from 'lucide-react';
import { ComparisonChart } from './ComparisonChart';
import { motion } from 'motion/react';
import { MotionFadeIn } from '@/components/motion/MotionFadeIn';
import { MotionBadge } from '@/components/motion/MotionBadge';
import { MotionIcon } from '@/components/motion/MotionIcon';
import { DURATION, EASING } from '@/lib/motion';

export const WhyUSDropAI: React.FC = () => {
  return (
    <motion.section
      id="why-usdrop-ai"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: DURATION.normal }}
      className="py-24 bg-white relative"
      style={{
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0,0,0,0.03) 39px, rgba(0,0,0,0.03) 40px),
          repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(0,0,0,0.03) 39px, rgba(0,0,0,0.03) 40px)
        `,
        backgroundSize: '40px 40px',
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <MotionFadeIn delay={0.1}>
          <div className="text-center mb-16">
            {/* Badge */}
            <MotionBadge animation="bounce" delay={0.2}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 mb-0">
                <MotionIcon hoverRotate={15}>
                  <Rocket className="w-3.5 h-3.5 text-violet-600" />
                </MotionIcon>
                <span className="text-sm font-medium text-violet-600">
                  The #1 All-in-One Dropshipping Ecosystem
                </span>
              </div>
            </MotionBadge>
            
            {/* Main Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: DURATION.normal }}
              className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-[1.1] mb-0 mt-2 text-slate-900"
            >
              Stop Buying 5 Different Tools.
              <br />
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, ease: EASING.spring }}
                className="text-violet-600 font-semibold"
              >
                USdrop AI
              </motion.span> Does It All.
            </motion.h2>
            
            {/* Descriptive Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: DURATION.normal }}
              className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto mt-2"
            >
              We don&apos;t just find products. We build your store, price your items, and create your ads. See how our complete ecosystem dominates the competition.
            </motion.p>
          </div>
        </MotionFadeIn>

        {/* Chart Section */}
        <MotionFadeIn delay={0.6}>
          <div className="relative">
            <ComparisonChart />
          </div>
        </MotionFadeIn>
      </div>
    </motion.section>
  );
};

