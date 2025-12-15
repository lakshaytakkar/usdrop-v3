"use client"

import React from 'react';
import { motion } from 'motion/react';
import { MotionMarquee } from '@/components/motion/MotionMarquee';
import { MotionFadeIn } from '@/components/motion/MotionFadeIn';

const brands = [
  { name: "Shopify", logo: "/images/logos/shopify.svg" },
  { name: "Amazon", logo: "/images/logos/amazon.svg" },
  { name: "TikTok Shop", logo: "/images/logos/tiktok.svg" },
  { name: "Meta", logo: "/images/logos/meta.svg" },
  { name: "Google Shopping", logo: "/images/logos/google.svg" },
  { name: "Stripe", logo: "/images/logos/stripe.svg" }
];

export const Marquee: React.FC = () => {
  return (
    <div className="bg-white py-12 border-b border-slate-100">
      <MotionFadeIn delay={0.1}>
        <div className="text-center mb-8">
          <span className="text-base md:text-lg font-semibold text-slate-500 uppercase tracking-wider">
            Seamlessly connect with the platforms you already use
          </span>
        </div>
      </MotionFadeIn>

      <div className="relative overflow-hidden w-full">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
        
        <MotionMarquee speed={50} pauseOnHover>
          {brands.map((brand, i) => (
            <div key={i} className="flex items-center justify-center px-8">
              <motion.div
                whileHover={{ scale: 1.1, opacity: 0.8 }}
                transition={{ duration: 0.2 }}
                className="cursor-pointer"
              >
                <img 
                  src={brand.logo} 
                  alt={brand.name}
                  className="h-16 w-auto object-contain"
                  style={{ maxWidth: '200px' }}
                />
              </motion.div>
            </div>
          ))}
        </MotionMarquee>
      </div>
    </div>
  );
};
