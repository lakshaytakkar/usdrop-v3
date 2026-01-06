"use client"

import React from 'react';
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

export function LogoMarquee() {
  return (
    <div className="bg-[rgba(255,255,255,0.4)] backdrop-blur-sm py-8 border-b border-[rgba(0,0,0,0.05)] relative overflow-hidden">
      <MotionFadeIn delay={0.1}>
        <div className="text-center mb-8 max-w-[886px] mx-auto px-4">
          <span className="text-[16px] font-medium text-[#555555] uppercase tracking-wider leading-[22px]">
            Seamlessly connect with the platforms you already use
          </span>
        </div>
      </MotionFadeIn>

      <div className="relative overflow-hidden w-full">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[rgba(255,255,255,0.4)] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[rgba(255,255,255,0.4)] to-transparent z-10 pointer-events-none" />
        
        <MotionMarquee speed={50} pauseOnHover={false}>
          {brands.map((brand, i) => (
            <div key={i} className="flex items-center justify-center px-8">
              <img 
                src={brand.logo} 
                alt={brand.name}
                className="h-16 w-auto object-contain"
                style={{ maxWidth: '200px' }}
              />
            </div>
          ))}
        </MotionMarquee>
      </div>
    </div>
  );
}


