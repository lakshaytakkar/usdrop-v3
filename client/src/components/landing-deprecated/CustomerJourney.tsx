

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

export const CustomerJourney: React.FC = () => {
  return (
    <Section className="bg-white border-y border-slate-200">
      <Container>
        <div className="text-center mb-8 max-w-2xl mx-auto">
          <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">
            What is Dropshipping?
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            The Dropshipper Journey
          </h2>
          <p className="text-slate-500 text-base">
            Start selling online without inventory. Here's how dropshipping works in 6 simple steps.
          </p>
        </div>

        {/* Horizontal Grid - All 6 Cards in One Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 max-w-7xl mx-auto">
          {dropshipperJourney.map((step, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-xl p-4"
            >
              {/* 3D Character Image */}
              <img
                src={step.image}
                alt={step.title}
                className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-3 object-contain"
              />

              {/* Step Number */}
              <div className="flex items-center justify-center gap-1.5 mb-3">
                <div className="w-6 h-6 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                  {index + 1}
                </div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-sm md:text-base font-bold text-slate-900 mb-3 leading-tight">
                  {step.title}
                </h3>
                <ul className="text-left space-y-2">
                  {step.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                      <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" strokeWidth={3} />
                      <span dangerouslySetInnerHTML={{ __html: bullet }} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};
