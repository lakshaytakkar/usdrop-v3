"use client"

import React from 'react';
import { Container, Section, Button } from './ui';
import { Package, Truck, CheckCircle, Smartphone, MapPin, Clock } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { MotionFadeIn } from '@/components/motion/MotionFadeIn';
import { MotionStagger } from '@/components/motion/MotionStagger';
import { MotionCard } from '@/components/motion/MotionCard';
import { MotionButton } from '@/components/motion/MotionButton';
import { MotionIcon } from '@/components/motion/MotionIcon';
import { DURATION, EASING } from '@/lib/motion';

export const AutomationFlow: React.FC = () => {
  return (
    <Section className="bg-white" id="fulfillment">
      <Container>
        <MotionFadeIn delay={0.1}>
          <div className="text-center mb-10 max-w-4xl mx-auto">
            <div className="text-xs font-bold text-green-600 uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
              <MotionIcon hoverRotate={15}>
                <MapPin className="w-3 h-3" />
              </MotionIcon>
              Warehouses in LA, NY, & Texas
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
              Ship from the USA. <br/>
              <span className="text-blue-600">Delivered in 2-5 Days.</span>
            </h2>
            <p className="text-base md:text-lg text-slate-600">
              Your customers hate waiting. Stop losing sales to AliExpress shipping times. We stock winning products in our US warehouses so you can offer Amazon-level speed.
            </p>
          </div>
        </MotionFadeIn>

        {/* Timeline Flow */}
        <div className="relative mb-12">
          {/* Connecting Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: DURATION.slow, delay: 0.3, ease: EASING.easeOut }}
            className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-100 z-0 origin-left"
          />
          
          <MotionStagger staggerDelay={0.15}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
              {/* Step 1 */}
              <MotionCard
                hoverLift={false}
                hoverShadow={false}
                delay={0}
                className="flex flex-col items-center text-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: DURATION.normal, delay: 0.2, ease: EASING.spring }}
                  className="w-24 h-24 bg-white rounded-full border-4 border-slate-50 shadow-lg flex items-center justify-center mb-6 relative"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, ease: EASING.spring }}
                    className="absolute top-0 right-0 bg-blue-600 rounded-full p-1 border-2 border-white z-10"
                  >
                    <CheckCircle className="w-3 h-3 text-white" />
                  </motion.div>
                  <div className="w-12 h-12 relative">
                    <Image src="/images/landing/automation-order.png" alt="Order Icon" fill className="object-contain opacity-80" />
                  </div>
                </motion.div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">1. Customer Orders</h3>
                <p className="text-sm text-slate-500 px-4">Order comes into your Shopify store. You do nothing.</p>
              </MotionCard>

              {/* Step 2 */}
              <MotionCard
                hoverLift={false}
                hoverShadow={false}
                delay={0.15}
                className="flex flex-col items-center text-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: DURATION.normal, delay: 0.3, ease: EASING.spring }}
                  className="w-24 h-24 bg-white rounded-full border-4 border-slate-50 shadow-lg flex items-center justify-center mb-6"
                >
                  <div className="w-12 h-12 relative">
                    <Image src="/images/landing/automation-pack.png" alt="Pack Icon" fill className="object-contain opacity-80" />
                  </div>
                </motion.div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">2. Auto-Fulfillment</h3>
                <p className="text-sm text-slate-500 px-4">USDrop automatically picks, packs, and ships the item from a US warehouse.</p>
              </MotionCard>

              {/* Step 3 */}
              <MotionCard
                hoverLift={false}
                hoverShadow={false}
                delay={0.3}
                className="flex flex-col items-center text-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: DURATION.normal, delay: 0.4, ease: EASING.spring }}
                  className="w-24 h-24 bg-white rounded-full border-4 border-slate-50 shadow-lg flex items-center justify-center mb-6"
                >
                  <div className="bg-blue-50 px-3 py-1 rounded text-xs font-mono font-bold text-blue-600 border border-blue-100">US...92</div>
                </motion.div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">3. Instant Tracking</h3>
                <p className="text-sm text-slate-500 px-4">Tracking number is synced to Shopify and emailed to your customer instantly.</p>
              </MotionCard>

              {/* Step 4 */}
              <MotionCard
                hoverLift={false}
                hoverShadow={false}
                delay={0.45}
                className="flex flex-col items-center text-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: DURATION.normal, delay: 0.5, ease: EASING.spring }}
                  className="w-24 h-24 bg-white rounded-full border-4 border-slate-50 shadow-lg flex items-center justify-center mb-6"
                >
                  <div className="w-12 h-12 relative">
                    <Image src="/images/landing/automation-customer.png" alt="Customer Icon" fill className="object-contain opacity-80" />
                  </div>
                </motion.div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">4. Fast Delivery</h3>
                <p className="text-sm text-slate-500 px-4">Customer receives the package in 2-5 days. No Chinese characters on the label.</p>
              </MotionCard>
            </div>
          </MotionStagger>
        </div>

        <MotionFadeIn delay={0.6}>
          <div className="text-center">
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: DURATION.fast, ease: EASING.easeOut }}
            >
              <Button size="lg" className="h-12 px-10 rounded-lg text-lg bg-blue-600 hover:bg-blue-700 font-bold shadow-xl shadow-blue-600/20">
                Check US Shipping Rates
              </Button>
            </motion.div>
          </div>
        </MotionFadeIn>

        {/* Feature Highlights */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="bg-slate-50 rounded-[2.5rem] p-6 md:p-8 border border-slate-200 hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                    <Package className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl md:text-2xl font-bold text-slate-900">1-Click Product Import</h3>
              </div>
              <p className="text-slate-600 mb-6 text-base">No manual uploads. USDrop pushes images, descriptions, and variant data to Shopify instantly.</p>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
                 <div className="w-16 h-16 bg-slate-100 rounded-lg shrink-0 overflow-hidden relative">
                    <Image src="/images/landing/automation-blender.png" alt="Product" fill className="object-cover" />
                 </div>
                 <div className="flex-1">
                    <div className="h-4 w-3/4 bg-slate-100 rounded mb-2" />
                    <div className="h-3 w-1/2 bg-slate-100 rounded" />
                 </div>
                 <Button size="sm" variant="outline" className="text-xs">Imported ✓</Button>
              </div>
           </div>

           <div className="bg-slate-50 rounded-[2.5rem] p-6 md:p-8 border border-slate-200 hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-green-600 shadow-sm">
                    <Clock className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl md:text-2xl font-bold text-slate-900">99.8% On-Time Delivery</h3>
              </div>
              <p className="text-slate-600 mb-6 text-base">We processed 2.1M+ packages last year. Our logistics network is battle-tested for Q4 scaling.</p>
              <div className="space-y-3">
                 {[1,2,3].map((i) => (
                    <div key={i} className="bg-white rounded-lg p-3 flex justify-between items-center border border-slate-100">
                       <div className="flex items-center gap-3">
                          <Truck className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-bold text-slate-700">Delivered</span>
                       </div>
                       <span className="text-xs font-mono text-slate-400">2 Days</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>

      </Container>
    </Section>
  );
};

