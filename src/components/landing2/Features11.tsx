"use client"

import { Search, Trophy, Layers, RotateCcw, MousePointerClick, Database } from 'lucide-react';

const features = [
  {
    icon: Search,
    title: "Intuitive Dashboard",
    description: "Access all your tools in one place. Track products, manage orders, and analyze performance with ease.",
  },
  {
    icon: Trophy,
    title: "Winning Products",
    description: "Discover high-margin products before they go viral. Real-time data from top-performing stores.",
  },
  {
    icon: Layers,
    title: "AI Studio Tools",
    description: "Generate product images, ad copy, and marketing materials instantly with our AI-powered creative suite.",
  },
  {
    icon: RotateCcw,
    title: "Drag & Drop Editor",
    description: "Customize product listings and store designs with our intuitive visual editor. No coding required.",
  },
  {
    icon: MousePointerClick,
    title: "Simple Process",
    description: "From discovery to delivery, streamline your entire dropshipping workflow in one platform.",
  },
  {
    icon: Database,
    title: "Storage & Backup",
    description: "All your product data, images, and settings are securely stored and automatically backed up.",
  },
];

export const Features11: React.FC = () => {
  return (
    <section id="features-11" className="py-24 features-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Unlock Your Creativity
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to build and scale your dropshipping business.
          </p>
        </div>

        {/* Features-11 Wrapper */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-6">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
              </div>

              {/* Text */}
              <div>
                <h6 className="text-xl font-bold text-foreground mb-2">
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
    </section>
  );
};











