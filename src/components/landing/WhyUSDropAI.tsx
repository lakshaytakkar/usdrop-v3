"use client"

import React from 'react';
import { Rocket } from 'lucide-react';
import { ComparisonChart } from './ComparisonChart';

export const WhyUSDropAI: React.FC = () => {
  return (
    <section 
      id="why-usdrop-ai" 
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
        <div className="text-center mb-2">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 mb-0">
            <Rocket className="w-3.5 h-3.5 text-violet-600" />
            <span className="text-sm font-medium text-violet-600">
              The #1 All-in-One Dropshipping Ecosystem
            </span>
          </div>
          
          {/* Main Headline */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-[1.1] mb-0 mt-1 text-slate-900">
            Stop Buying 5 Different Tools.
            <br />
            <span className="text-violet-600 font-semibold">USdrop AI</span> Does It All.
          </h2>
          
          {/* Descriptive Paragraph */}
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto mt-1 mb-0">
            We don&apos;t just find products. We build your store, price your items, and create your ads. See how our complete ecosystem dominates the competition.
          </p>
        </div>

        {/* Chart Section */}
        <div className="relative mt-2">
          <ComparisonChart />
        </div>
      </div>
    </section>
  );
};

