import React from 'react';
import { Container, Section, Badge } from './ui';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

const tools = [
  {
    title: "Ad Library",
    description: "Discover millions of Facebook Ads and filter by ad spend, ad set count, reach, and other metrics.",
    badge: "HOT",
    badgeType: "hot",
    image: "/images/landing/tools-ad-library.png"
  },
  {
    title: "Product Library",
    description: "Browse the top TikTok Shop products ranked by sales revenue to discover winning products.",
    badge: "NEW",
    badgeType: "new",
    image: "/images/landing/tools-product-library.png"
  },
  {
    title: "Portfolio",
    description: "Receive up to 40 hand-picked curated products from our specialists every week.",
    badge: null,
    image: "/images/landing/tools-portfolio.png"
  },
  {
    title: "Competitor Research",
    description: "Make laser-targeted searches on millions of product listings to find out which stores sell.",
    badge: null,
    image: "/images/landing/tools-competitor.png"
  },
  {
    title: "Magic AI",
    description: "Effortlessly discover winning products, ads, and competitors with advanced AI-powered search.",
    badge: "BETA",
    badgeType: "new",
    image: "/images/landing/tools-magic-ai.png"
  },
  {
    title: "Chrome Extension",
    description: "Supercharge your product research with our Chrome Extension. Instantly analyze trends.",
    badge: null,
    image: "/images/landing/tools-chrome-extension.png"
  }
];

export const ToolsGrid: React.FC = () => {
  return (
    <Section className="bg-white pt-0">
      <Container>
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Dropship tools</h2>
          <p className="text-slate-500 text-lg">Super power your product research with our collection of tools</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
              
              {/* Tool Visual Area */}
              <div className="h-48 bg-slate-50 border-b border-slate-100 p-6 flex items-center justify-center relative overflow-hidden">
                 <div className="w-full h-full rounded-lg shadow-sm overflow-hidden bg-white relative z-10">
                    <Image 
                      src={tool.image} 
                      alt={tool.title}
                      fill
                      className="object-cover opacity-90"
                    />
                 </div>
                 {/* Background decoration */}
                 <div className="absolute inset-0 bg-blue-50/50" />
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-lg font-bold text-slate-900">{tool.title}</h3>
                  {tool.badge && (
                    <Badge variant={tool.badgeType as any}>{tool.badge}</Badge>
                  )}
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                  {tool.description}
                </p>
                <a href="#" className="inline-flex items-center text-blue-600 font-semibold text-sm hover:underline">
                  Explore Details <ChevronRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

