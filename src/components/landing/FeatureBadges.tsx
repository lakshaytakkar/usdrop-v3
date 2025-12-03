"use client"

import React from 'react';
import { Container, Section } from './ui';

interface FeatureBadge {
  title: string;
  description: string;
  badge: string;
}

const features: FeatureBadge[] = [
  {
    title: 'AI-Powered',
    description: 'Everything automated with AI',
    badge: '/3d-badges/ai-badge.png'
  },
  {
    title: 'US Shipping',
    description: '2-5 day delivery guaranteed',
    badge: '/3d-badges/shipping-badge.png'
  },
  {
    title: 'Zero Inventory',
    description: 'No upfront costs or risk',
    badge: '/3d-badges/inventory-badge.png'
  },
  {
    title: '24/7 Support',
    description: 'US-based team always ready',
    badge: '/3d-badges/support-badge.png'
  },
  {
    title: 'Auto-Fulfillment',
    description: 'Hands-free order processing',
    badge: '/3d-badges/fulfillment-badge.png'
  },
  {
    title: 'Real-time Analytics',
    description: 'Track everything in real-time',
    badge: '/3d-badges/analytics-badge.png'
  }
];

export const FeatureBadges: React.FC = () => {
  return (
    <Section className="bg-slate-50 border-y border-slate-200">
      <Container>
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">
            Why USDrop
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Built for Serious Dropshippers
          </h2>
          <p className="text-slate-500 text-base">
            Every feature designed to help you scale faster and smarter.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-2xl p-5 text-center"
            >
              {/* Badge Placeholder - Will be replaced with actual badge image */}
              <div className="w-20 h-20 mx-auto mb-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center">
                <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">{index + 1}</span>
                </div>
              </div>
              
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                {feature.title}
              </h3>
              <p className="text-xs text-slate-500 leading-snug">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

