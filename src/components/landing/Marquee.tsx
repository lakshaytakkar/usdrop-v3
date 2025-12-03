"use client"

import React from 'react';

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
      <div className="text-center mb-8">
         <span className="text-base md:text-lg font-semibold text-slate-500 uppercase tracking-wider">Seamlessly connect with the platforms you already use</span>
      </div>

      <div className="relative overflow-hidden w-full">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
        
        <div className="flex space-x-32 animate-infinite-scroll w-max px-8 items-center">
          {[...brands, ...brands].map((brand, i) => (
            <div key={i} className="flex items-center justify-center">
              <img 
                src={brand.logo} 
                alt={brand.name}
                className="h-16 w-auto object-contain opacity-100 transition-opacity"
                style={{ maxWidth: '200px' }}
              />
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 50s linear infinite;
        }
      `}</style>
    </div>
  );
};
