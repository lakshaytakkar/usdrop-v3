import React from 'react';
import { Container, Section, GeneratedImage } from './ui';
import { Search, PenTool, TrendingUp } from 'lucide-react';

export const StepsOverview: React.FC = () => {
  return (
    <Section className="bg-white pt-24 pb-12">
      <Container>
        <div className="text-center mb-16">
          <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">The Dropshipping Lifecycle</div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900">From Idea to 7-Figure Store</h2>
          <p className="text-slate-500 mt-4 text-lg max-w-2xl mx-auto">
            Stop stitching together 5 different tools. We give you the complete path from zero to sales in one platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-100 z-0 border-t border-dashed border-slate-300" />

          {/* Step 1 */}
          <div className="group relative z-10">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
              <div className="w-14 h-14 bg-white border-2 border-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">1. Discover</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Spy on 8-figure stores to find high-margin winners before they go viral. Validate demand with real-time sales data.
              </p>
              <div className="mt-auto aspect-[4/3] rounded-2xl bg-slate-50 overflow-hidden border border-slate-100">
                <GeneratedImage 
                   prompt="dashboard showing winning product cards with fire icons and profit margins, clean white ui"
                   className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="group relative z-10 mt-0 md:mt-12">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
              <div className="w-14 h-14 bg-white border-2 border-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <PenTool className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">2. Create</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Replace photographers with AI. Generate professional product photos, on-model shots, and ad creatives in seconds.
              </p>
              <div className="mt-auto aspect-[4/3] rounded-2xl bg-slate-50 overflow-hidden border border-slate-100">
                <GeneratedImage 
                   prompt="ai image generator interface showing a generated fashion model wearing a product, creative studio ui"
                   className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="group relative z-10 mt-0 md:mt-0">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
              <div className="w-14 h-14 bg-white border-2 border-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-green-600 group-hover:text-white transition-colors">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">3. Scale</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Import to Shopify in 1-click. We handle US fulfillment and tracking automatically so you can focus on ads.
              </p>
              <div className="mt-auto aspect-[4/3] rounded-2xl bg-slate-50 overflow-hidden border border-slate-100">
                <GeneratedImage 
                   prompt="growth chart showing revenue scaling up, green arrows, minimal business analytics"
                   className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

        </div>
      </Container>
    </Section>
  );
};