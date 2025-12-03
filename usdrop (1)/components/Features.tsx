import React from 'react';
import { Section, Container } from './ui';
import { Search, PenTool, TrendingUp, DollarSign } from 'lucide-react';

const steps = [
  {
    title: "1. Discover",
    description: "Use our spy tools to find high-margin winning products before they go viral.",
    icon: Search
  },
  {
    title: "2. Create",
    description: "Generate high-converting images, videos, and ad copy instantly with AI Studio.",
    icon: PenTool
  },
  {
    title: "3. Launch",
    description: "Connect suppliers and push products to your Shopify store in one click.",
    icon: TrendingUp
  },
  {
    title: "4. Scale",
    description: "Automate fulfillment and use our analytics to scale your ads profitably.",
    icon: DollarSign
  }
];

export const Features: React.FC = () => {
  return (
    <Section className="bg-slate-50 border-t border-slate-200">
      <Container>
        <div className="mb-12 md:text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">The Dropshipping Lifecycle</h2>
          <p className="text-slate-600 text-lg">
            A proven path from zero to sales. We provide the tools for every stage of your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-200 -z-10" />

          {steps.map((step, idx) => (
            <div key={idx} className="relative bg-white md:bg-transparent p-6 md:p-0 rounded-xl border md:border-none border-slate-200 text-center">
              <div className="mx-auto w-12 h-12 bg-white rounded-full border-2 border-blue-600 flex items-center justify-center text-blue-600 font-bold mb-4 shadow-sm z-10 relative">
                 <step.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};