"use client"

import React from 'react';
import { Container, Button } from './ui';
import { Play, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { MotionFadeIn } from '@/components/motion/MotionFadeIn';
import { MotionParallax } from '@/components/motion/MotionParallax';
import { MotionButton } from '@/components/motion/MotionButton';
import { MotionIcon } from '@/components/motion/MotionIcon';
import { splitWords } from '@/lib/motion/text';
import { DURATION, EASING } from '@/lib/motion';

export const BlueCTA: React.FC = () => {
  const title = "Ready to Build Your 7-Figure Brand?";
  const titleWords = splitWords(title);

  return (
    <section className="py-16 bg-blue-600 relative overflow-hidden">
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Glow */}
      <MotionParallax speed={0.2} direction="up">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
      </MotionParallax>

      <Container className="relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          <MotionFadeIn direction="right" delay={0.2} className="w-full md:w-1/2 text-white space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] font-display">
              {titleWords.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: DURATION.normal, delay: 0.3 + i * 0.05 }}
                >
                  {word}{' '}
                </motion.span>
              ))}
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: DURATION.normal, delay: 0.6 }}
              className="text-blue-100 text-base md:text-lg max-w-lg leading-relaxed font-medium"
            >
              Join 8,000+ stores using USDrop to find winning products, create ads, and ship in 2-5 days from the USA.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: DURATION.normal, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: DURATION.fast, ease: EASING.easeOut }}
              >
                <Button variant="white" size="lg" className="rounded-lg h-12 px-10 text-lg font-bold shadow-xl shadow-blue-900/20">
                  Get Free Access Now
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: DURATION.normal, delay: 0.8 }}
              className="flex items-center gap-6 text-sm font-medium text-blue-100"
            >
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> No credit card required
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Cancel anytime
              </span>
            </motion.div>
          </MotionFadeIn>

          <MotionFadeIn direction="left" delay={0.4} className="w-full md:w-1/2">
            <motion.div
              initial={{ rotate: 2 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-blue-800 h-80 md:h-96"
            >
              <Image 
                src="/images/landing/cta-dashboard.png"
                alt="Dashboard Preview"
                fill
                className="object-cover opacity-80 mix-blend-overlay"
              />
              
              {/* Floating Video Player UI element */}
              <motion.div
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md rounded-full p-6 border border-white/30 cursor-pointer shadow-xl"
              >
                <MotionIcon hoverRotate={15}>
                  <Play className="w-10 h-10 text-white fill-white" />
                </MotionIcon>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur p-4 rounded-xl border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white overflow-hidden">
                    <img src="https://i.pravatar.cc/100?img=12" alt="User" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">"Changed my life in 3 months."</div>
                    <div className="text-blue-200 text-xs">Alex D. • Scaled to $50k/mo</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </MotionFadeIn>

        </div>
      </Container>
    </section>
  );
};

