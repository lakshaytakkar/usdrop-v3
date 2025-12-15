import React from 'react';
import { Container, Section, Button } from './ui';
import { Clock, TrendingUp, Zap, ShieldCheck, Check } from 'lucide-react';

const benefits = [
  {
    icon: Clock,
    title: "Launch in Minutes",
    description: "Forget 4-week development cycles. Import products, generate AI content, and push to Shopify in 5 minutes.",
    bullets: ["1-Click Shopify Import", "Automated Store Setup", "Instant AI Descriptions"]
  },
  {
    icon: TrendingUp,
    title: "Maximize Profits",
    description: "Our suppliers offer the lowest base costs in the industry. Keep more profit in your pocket on every sale.",
    bullets: ["Wholesale Pricing", "No MoQ (Minimum Orders)", "Bulk Discounts"]
  },
  {
    icon: Zap,
    title: "Automated Scaling",
    description: "From 10 to 10,000 orders a day. Our systems auto-fulfill everything so you can focus on ads.",
    bullets: ["Auto-Tracking Sync", "Real-Time Inventory", "Custom Packaging"]
  },
  {
    icon: ShieldCheck,
    title: "US-Based Support",
    description: "We are a USA company with 24/7 support. We resolve supplier issues instantly so you don't have to.",
    bullets: ["Live Chat 24/7", "Dedicated Success Manager", "Dispute Resolution"]
  }
];

export const WhyChoose: React.FC = () => {
  return (
    <Section className="bg-white">
      <Container>
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Built for High-Volume Dropshippers</h2>
          <p className="text-slate-600 text-xl">
             We built USDrop because other platforms were too slow, too expensive, and had terrible shipping times. We fixed all of that.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="flex flex-col md:flex-row gap-8 p-8 md:p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 shadow-sm hover:shadow-xl hover:bg-white hover:border-blue-100 transition-all duration-300">
              <div className="shrink-0">
                <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <benefit.icon className="w-8 h-8" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{benefit.title}</h3>
                <p className="text-slate-600 mb-8 text-lg leading-relaxed">{benefit.description}</p>
                <ul className="space-y-4">
                  {benefit.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-center text-sm font-bold text-slate-700">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 mr-3 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      </div>
                      {bullet}
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
