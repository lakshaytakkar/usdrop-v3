"use client"

import { Search, Zap, Truck } from 'lucide-react';

const features = [
  {
    icon: Search,
    title: "Product Discovery",
    description: "Find winning products before they go viral. Real-time intelligence from millions of data points.",
  },
  {
    icon: Zap,
    title: "AI Creative Studio",
    description: "Generate high-converting ads and product images instantly. No photographers or models needed.",
  },
  {
    icon: Truck,
    title: "Fast US Shipping",
    description: "5-8 day delivery via USPS. Automated fulfillment from verified suppliers.",
  },
];

export const Features2: React.FC = () => {
  return (
    <section id="features-2" className="py-24 features-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features-2 Wrapper */}
        <div className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center">
                {/* Icon */}
                <div className="w-44 h-44 bg-muted rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-16 h-16 text-primary" />
                </div>

                {/* Text */}
                <div className="text-center">
                  <h6 className="text-xl font-bold text-foreground mb-3">
                    {feature.title}
                  </h6>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};











