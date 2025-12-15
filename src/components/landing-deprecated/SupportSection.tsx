"use client"

import React from 'react';
import { Container, Section, Button } from './ui';
import { Headset, MessageSquare, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { MotionFadeIn } from '@/components/motion/MotionFadeIn';
import { MotionStagger } from '@/components/motion/MotionStagger';
import { MotionCard } from '@/components/motion/MotionCard';
import { MotionIcon } from '@/components/motion/MotionIcon';
import { MotionButton } from '@/components/motion/MotionButton';
import { DURATION, EASING } from '@/lib/motion';

export const SupportSection: React.FC = () => {
  return (
    <Section className="bg-white border-t border-slate-100">
      <Container>
        <div className="bg-slate-50 rounded-[3rem] p-6 md:p-10 border border-slate-200 overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            
            <MotionFadeIn direction="right" delay={0.2} className="w-full lg:w-1/2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                Receive support for your business growth
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Rely on exceptional help 24/7 by USDrop's in-house support team full of passionate e-commerce experts and long-time USDrop users.
              </p>
              
              <MotionStagger staggerDelay={0.1}>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                  {[
                    { icon: Headset, text: "24/7 Live Support" },
                    { icon: MessageSquare, text: "Quick Response Time" },
                    { icon: Clock, text: "Professional Team" }
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-3 text-sm font-bold text-slate-700"
                    >
                      <MotionIcon hoverRotate={15} hoverScale={1.1}>
                        <item.icon className="w-5 h-5 text-blue-600" />
                      </MotionIcon>
                      {item.text}
                    </motion.div>
                  ))}
                </div>
              </MotionStagger>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex gap-4 pt-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: DURATION.fast, ease: EASING.easeOut }}
                >
                  <Button className="h-12 px-8 font-bold">Get started for free</Button>
                </motion.div>
                <div className="flex items-center text-xs text-slate-500 font-medium px-4">
                  7-day free trial | Cancel anytime
                </div>
              </motion.div>
            </MotionFadeIn>

            <MotionFadeIn direction="left" delay={0.4} className="w-full lg:w-1/2 relative">
              <MotionCard
                hoverLift
                hoverShadow
                className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 max-w-md mx-auto relative z-10"
              >
                    <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                       <div className="w-12 h-12 rounded-full bg-blue-100 overflow-hidden relative">
                          <img src="https://i.pravatar.cc/100?img=32" alt="Support" className="w-full h-full object-cover" />
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                       </div>
                       <div>
                          <div className="font-bold text-slate-900">Kelly from USDrop</div>
                          <div className="text-xs text-slate-500">Replies instantly</div>
                       </div>
                    </div>
                    
                    <div className="space-y-4">
                       <div className="bg-slate-100 rounded-2xl rounded-tl-none p-4 text-sm text-slate-700">
                          Hi there! I'm Kelly, what do you need help with?
                       </div>
                       <div className="bg-blue-600 rounded-2xl rounded-tr-none p-4 text-sm text-white ml-auto max-w-[80%]">
                          Hi! Can you help with tracking my order?
                       </div>
                       <div className="bg-slate-100 rounded-2xl rounded-tl-none p-4 text-sm text-slate-700">
                          Sure! No problem. Send me the order number and I'll check immediately.
                       </div>
                    </div>
                    
                    <div className="mt-6 relative">
                       <div className="w-full h-10 bg-slate-50 rounded-full border border-slate-200 px-4 flex items-center text-slate-400 text-sm">
                          Enter message...
                       </div>
                </div>
              </MotionCard>
              
              {/* Decorative background shapes */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 0.9, 0.7],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-10 -right-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl"
              />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 0.9, 0.7],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
                className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-2xl"
              />
            </MotionFadeIn>

           </div>
        </div>
      </Container>
    </Section>
  );
};

