"use client"

import React from 'react';
import { Container, Section } from './ui';
import { Check } from 'lucide-react';

interface DropshipperStep {
  title: string;
  bullets: string[];
  image: string;
}

const dropshipperJourney: DropshipperStep[] = [
  {
    title: 'Find Products',
    bullets: [
      '<strong>USDrop AI Research</strong> analyzes millions of products from top stores',
      '<strong>USDrop AI Stores</strong> lets you spy on 8-figure competitors',
      'Real-time sales data validates demand before you invest'
    ],
    image: '/3d-characters/shopping.png'
  },
  {
    title: 'Setup Store',
    bullets: [
      '<strong>USDrop AI Studio</strong> generates product listings and descriptions',
      'Professional creatives created in seconds',
      'One-click import to Shopify, no photography needed'
    ],
    image: '/3d-characters/manage-online-store.png'
  },
  {
    title: 'Promote',
    bullets: [
      '<strong>USDrop AI Studio</strong> creates high-converting ad creatives',
      'Generate on-model shots, lifestyle photos, and video ads',
      'Launch campaigns on Facebook, TikTok, and Google faster'
    ],
    image: '/3d-characters/promote-product.png'
  },
  {
    title: 'Orders',
    bullets: [
      'Orders automatically sync to USDrop from your store',
      'You never touch inventory or handle shipping',
      'Real-time order processing and tracking'
    ],
    image: '/3d-characters/product-checkout.png'
  },
  {
    title: 'Fulfillment',
    bullets: [
      '<strong>USDrop AI Fulfillment</strong> picks, packs, and ships automatically',
      'Ships from US warehouses (LA, NY, Texas)',
      'Tracking numbers sync to Shopify instantly, 2-5 day delivery'
    ],
    image: '/3d-characters/handling-bags.png'
  },
  {
    title: 'Delivered',
    bullets: [
      'Fast 2-5 day delivery via USPS, UPS, and FedEx',
      'No Chinese labels, no 30-day waits',
      'Happy customers mean repeat sales and higher lifetime value'
    ],
    image: '/3d-characters/received-package.png'
  }
];

export const DropshippingTimeline: React.FC = () => {
  return (
    <Section className="bg-white py-16 md:py-24">
      <Container>
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">
            The Complete Process
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            What is Dropshipping?
          </h1>
          <p className="text-slate-500 text-lg">
            Start selling online without inventory. Here's how dropshipping works in 6 simple steps, powered by USDrop.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative max-w-6xl mx-auto">
          {/* Vertical Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2"></div>

          {/* Timeline Items */}
          <div className="space-y-12 md:space-y-16">
            {dropshipperJourney.map((step, index) => {
              const isEven = index % 2 === 0;
              const isLeft = isEven;
              
              return (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row items-center gap-6 md:gap-8 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Step Number Badge - Center on Mobile, Side on Desktop */}
                  <div className="relative z-10 shrink-0">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-600 border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-xl md:text-2xl">
                      {index + 1}
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className={`flex-1 w-full md:w-5/12 ${isLeft ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow">
                      {/* 3D Character Image */}
                      <div className={`flex ${isLeft ? 'md:justify-end' : 'md:justify-start'} mb-4`}>
                        <img
                          src={step.image}
                          alt={step.title}
                          className="w-32 h-32 md:w-40 md:h-40 object-contain"
                        />
                      </div>

                      {/* Title */}
                      <h3 className={`text-2xl md:text-3xl font-bold text-slate-900 mb-4 ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                        Step {index + 1}: {step.title}
                      </h3>

                      {/* Bullets */}
                      <ul className={`space-y-3 ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                        {step.bullets.map((bullet, bulletIndex) => (
                          <li 
                            key={bulletIndex} 
                            className={`flex items-start gap-3 text-sm md:text-base text-slate-600 leading-relaxed ${
                              isLeft ? 'md:flex-row-reverse' : ''
                            }`}
                          >
                            <Check className={`w-5 h-5 text-green-600 shrink-0 mt-0.5 ${isLeft ? 'md:order-2' : ''}`} strokeWidth={3} />
                            <span 
                              className={isLeft ? 'md:text-right' : ''}
                              dangerouslySetInnerHTML={{ __html: bullet }} 
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block w-5/12"></div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
};

