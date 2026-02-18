

import React from 'react';
import { Container, Section, Button } from './ui';
import { Feature } from '@/types/landing';
import { Camera, User, PenTool, Badge, Calculator, Sparkles } from 'lucide-react';

import { motion } from 'motion/react';
import { MotionFadeIn } from '@/components/motion/MotionFadeIn';
import { MotionStagger } from '@/components/motion/MotionStagger';
import { MotionCard } from '@/components/motion/MotionCard';
import { MotionImage } from '@/components/motion/MotionImage';
import { MotionButton } from '@/components/motion/MotionButton';
import { MotionIcon } from '@/components/motion/MotionIcon';
import { MotionBadge } from '@/components/motion/MotionBadge';
import { DURATION, EASING } from '@/lib/motion';

const features: Feature[] = [
  {
    title: "Image Studio",
    description: "Generate professional product listing images from simple photos.",
    image: "/images/landing/ai-image-studio.png",
    cta: "Generate Images"
  },
  {
    title: "Model Studio",
    description: "Create on-model fashion imagery without hiring talent.",
    image: "/images/landing/ai-model-studio.png",
    cta: "Create Models"
  },
  {
    title: "Ad Studio",
    description: "Generate compelling ad creatives with high-converting copy.",
    image: "/images/landing/ai-ad-studio.png",
    cta: "Create Ads"
  },
  {
    title: "Whitelabelling",
    description: "Create and design your brand logo with AI-powered tools.",
    image: "/images/landing/ai-studio-logo.png",
    cta: "Design Logo"
  },
  {
    title: "Profit Calculator",
    description: "Calculate dropshipping profits and margins instantly.",
    image: "/images/landing/ai-studio-calculator.png",
    cta: "Calculate Profit"
  }
];

export const AIStudio: React.FC = () => {
  const icons = [
    Camera,
    User,
    PenTool,
    Badge,
    Calculator
  ];

  return (
    <Section id="ai-studio" className="bg-white relative overflow-hidden">
      <Container>
        <MotionFadeIn delay={0.1}>
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-6">
            <MotionBadge animation="bounce" delay={0.2}>
              <span className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold tracking-wide uppercase text-xs px-4 py-1.5 rounded-md">
                <Sparkles className="w-3 h-3" /> AI-POWERED CREATIVE TOOLS
              </span>
            </MotionBadge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-6 mb-4 leading-tight">
              USDrop AI Studio
            </h2>
            <p className="text-slate-600 text-lg md:text-xl leading-relaxed">
              Stop spending thousands on photoshoots and designers. Our AI Studio suite gives you everything you need to launch products instantly.
            </p>
          </div>
        </MotionFadeIn>

        <MotionStagger staggerDelay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const IconComponent = icons[idx];
              
              return (
                <MotionCard
                  key={idx}
                  hoverLift={false}
                  hoverShadow={false}
                  delay={idx * 0.1}
                  className="relative bg-white border border-slate-200 rounded-xl overflow-hidden"
                >
                  <div className="h-56 w-full relative bg-slate-50">
                    {feature.image && (
                      <MotionImage
                        src={feature.image}
                        alt={feature.title}
                       
                        className="object-cover opacity-90"
                        hoverOpacity
                      />
                    )}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: DURATION.normal, delay: 0.3 + idx * 0.1, ease: EASING.spring }}
                      className="absolute top-4 left-4 bg-blue-600 rounded-full p-2.5 text-white shadow-md z-10"
                    >
                      <MotionIcon hoverRotate={15} hoverScale={1.1}>
                        <IconComponent className="w-5 h-5" />
                      </MotionIcon>
                    </motion.div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-slate-600 text-sm mb-6 min-h-[40px] leading-relaxed">{feature.description}</p>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="flex items-center text-blue-600 text-sm font-semibold hover:text-blue-700 cursor-pointer"
                    >
                      {feature.cta} <span className="ml-2">→</span>
                    </motion.div>
                  </div>
                </MotionCard>
              );
            })}
          </div>
        </MotionStagger>
        
        <MotionFadeIn delay={0.5}>
          <div className="mt-12 text-center">
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: DURATION.fast, ease: EASING.easeOut }}
            >
              <Button size="lg" variant="primary" className="h-14 px-12 font-bold text-white bg-slate-900 hover:bg-slate-800">
                Open USDrop AI Studio Free
              </Button>
            </motion.div>
          </div>
        </MotionFadeIn>
      </Container>
    </Section>
  );
};
