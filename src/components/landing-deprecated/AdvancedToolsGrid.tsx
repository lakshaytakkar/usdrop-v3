"use client"

import React from 'react';
import { Container, Section, Button } from './ui';
import Image from 'next/image';
import { motion } from 'motion/react';
import { MotionFadeIn } from '@/components/motion/MotionFadeIn';
import { MotionStagger } from '@/components/motion/MotionStagger';
import { MotionCard } from '@/components/motion/MotionCard';
import { MotionImage } from '@/components/motion/MotionImage';
import { MotionButton } from '@/components/motion/MotionButton';
import { DURATION, EASING } from '@/lib/motion';

const tools = [
  {
    title: "Store Research: Analyze competitor stores",
    description: "Deep dive into any Shopify store. See their traffic, revenue estimates, top products, traffic sources, and growth trends. Learn their winning strategies.",
    cta: "Research stores",
    image: "/images/landing/tools-store-research.png"
  },
  {
    title: "Competitor Research: Find stores selling your products",
    description: "Find out who's selling the products you're interested in, how much they sell, where their traffic comes from, and learn their strategies.",
    cta: "Find viral products",
    image: "/images/landing/tools-competitor-research.png"
  },
  {
    title: "Email Automation: Convert more customers",
    description: "Automate abandoned cart emails, welcome sequences, and post-purchase follow-ups. Increase revenue with targeted email campaigns.",
    cta: "Set up automation",
    image: "/images/landing/tools-email-automation.png"
  },
  {
    title: "Saturation Indicator: Spot trending dropshipping products",
    description: "Identify the perfect balance between trending products and competition. Helps you discover profitable opportunities before markets become overcrowded.",
    cta: "Spot trending products",
    image: "/images/landing/tools-saturation.png"
  },
  {
    title: "Market Finder: See global demand for your products",
    description: "Target the right markets by tracking regional product interest. See which countries have the highest demand for your products.",
    cta: "Find products with demand",
    image: "/images/landing/tools-market-finder.png"
  },
  {
    title: "Seasonal Trend Tracker: A must-have research tool",
    description: "Discover what sells in every season. Track seasonal trends and peak buying periods to time your product launches perfectly.",
    cta: "Identify product trends",
    image: "/images/landing/tools-seasonal.png"
  },
  {
    title: "Profit Calculator: Forecast your dropshipping profits",
    description: "Identify winning products by calculating real profit potential. Test prices, costs, and margins instantly to find the most profitable opportunities.",
    cta: "Calculate your profit",
    image: "/images/landing/tools-profit-calc.png"
  },
  {
    title: "Emerging Store Discovery: Find fast-growing new stores",
    description: "There are many successful dropshipping stores, but new ones that make hundreds of thousands of USD the first month are rare.",
    cta: "Find emerging stores",
    image: "/images/landing/tools-emerging-stores.png"
  }
];

export const AdvancedToolsGrid: React.FC = () => {
  return (
    <Section className="bg-slate-50 border-t border-slate-200">
      <Container>
        <MotionFadeIn delay={0.1}>
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Advanced Research Suite</h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-base">Deep dive into data with our specialized tools designed for professional dropshippers.</p>
          </div>
        </MotionFadeIn>

        <MotionStagger staggerDelay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, idx) => (
              <MotionCard
                key={idx}
                hoverLift
                hoverShadow
                delay={idx * 0.1}
                className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col h-full"
              >
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 min-h-[56px]">{tool.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    {tool.description}
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: DURATION.fast, ease: EASING.easeOut }}
                  >
                    <Button variant="outline" size="sm" className="rounded-lg text-xs font-bold border-slate-200">
                      {tool.cta}
                    </Button>
                  </motion.div>
                </div>
                
                <div className="mt-auto aspect-[4/3] bg-slate-50 rounded-xl overflow-hidden border border-slate-100 shadow-inner relative">
                  <MotionImage
                    src={tool.image}
                    alt={tool.title}
                    fill
                    className="object-cover opacity-90"
                    hoverScale={1.05}
                  />
                </div>
              </MotionCard>
            ))}
          </div>
        </MotionStagger>
      </Container>
    </Section>
  );
};

