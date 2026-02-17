"use client"

import React from 'react';
import { Container, Section, Button } from './ui';
import Image from 'next/image';
import { motion } from 'motion/react';
import { MotionFadeIn } from '@/components/motion/MotionFadeIn';
import { MotionCard } from '@/components/motion/MotionCard';
import { MotionImage } from '@/components/motion/MotionImage';
import { MotionButton } from '@/components/motion/MotionButton';
import { DURATION, EASING } from '@/lib/motion';

export const DeepDiveFeatures: React.FC = () => {
  return (
    <div className="bg-white space-y-12 py-12" id="product-research">
      
      {/* Feature 1: Store Explorer */}
      <Section className="py-0">
        <Container>
          <MotionFadeIn delay={0.1}>
            <div className="text-center mb-10">
              <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Next-Gen Product Research</div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Discover how USDrop empowers sellers</h2>
            </div>
          </MotionFadeIn>

          <MotionCard
            hoverLift={false}
            className="bg-slate-50 border border-slate-200 rounded-[3rem] p-6 md:p-10 flex flex-col lg:flex-row gap-8 items-center overflow-hidden"
          >
            <MotionFadeIn direction="right" delay={0.2} className="w-full lg:w-1/2 space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900">Store Explorer: More than just a sales tracker</h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Browse millions of live Shopify stores, check their traffic and sales, discover which of their products make up most of their revenue, where their customers come from, and much more.
              </p>
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: DURATION.fast, ease: EASING.easeOut }}
              >
                <Button variant="outline" className="bg-white border-slate-300 h-12 px-8 font-semibold">
                  Explore winning stores
                </Button>
              </motion.div>
            </MotionFadeIn>
            <MotionFadeIn direction="left" delay={0.3} className="w-full lg:w-1/2 relative">
              <motion.div
                initial={{ rotate: 2 }}
                className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-2"
              >
                <div className="aspect-[16/10] bg-slate-50 rounded-xl overflow-hidden relative">
                  <MotionImage
                    src="/images/landing/deepdive-store-analytics.png"
                    alt="Store Explorer"
                    fill
                    className="object-cover"
                    hoverScale={1.05}
                  />
                </div>
              </motion.div>
            </MotionFadeIn>
          </MotionCard>
        </Container>
      </Section>

      {/* Feature 2: Global Bestsellers */}
      <Section className="py-0">
        <Container>
          <MotionCard
            hoverLift={false}
            className="bg-slate-900 text-white rounded-[3rem] p-6 md:p-10 flex flex-col lg:flex-row-reverse gap-8 items-center overflow-hidden relative"
          >
            {/* Abstract bg */}
            <motion.div
              animate={{
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent pointer-events-none"
            />

            <MotionFadeIn direction="left" delay={0.2} className="w-full lg:w-1/2 space-y-6 relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold text-white">Global Bestsellers: See what the world is buying</h3>
              <p className="text-base text-slate-300 leading-relaxed">
                Spotting trends is one thing. Seeing which products drive the most revenue across every Shopify store worldwide? That's what makes USDrop a complete game changer.
              </p>
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: DURATION.fast, ease: EASING.easeOut }}
              >
                <Button variant="primary" className="bg-blue-600 border-none text-white h-12 px-8 font-semibold hover:bg-blue-500">
                  Find winning products
                </Button>
              </motion.div>
            </MotionFadeIn>
            
            <MotionFadeIn direction="right" delay={0.3} className="w-full lg:w-1/2 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: DURATION.normal, delay: 0.4 }}
                  className="bg-white rounded-2xl p-4 shadow-lg"
                >
                  <div className="aspect-square bg-slate-100 rounded-lg mb-3 overflow-hidden relative">
                    <MotionImage
                      src="/images/landing/deepdive-galaxy-projector.png"
                      alt="Galaxy Projector"
                      fill
                      className="object-cover"
                      hoverScale={1.05}
                    />
                  </div>
                  <div className="h-2 w-2/3 bg-slate-200 rounded mb-2"></div>
                  <div className="h-2 w-1/2 bg-green-100 rounded"></div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: DURATION.normal, delay: 0.5 }}
                  className="bg-white rounded-2xl p-4 shadow-lg"
                >
                  <div className="aspect-square bg-slate-100 rounded-lg mb-3 overflow-hidden relative">
                    <MotionImage
                      src="/images/landing/deepdive-shiba-toy.png"
                      alt="Shiba Toy"
                      fill
                      className="object-cover"
                      hoverScale={1.05}
                    />
                  </div>
                  <div className="h-2 w-2/3 bg-slate-200 rounded mb-2"></div>
                  <div className="h-2 w-1/2 bg-blue-100 rounded"></div>
                </motion.div>
              </div>
            </MotionFadeIn>
          </MotionCard>
        </Container>
      </Section>

    </div>
  );
};

