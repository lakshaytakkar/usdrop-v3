import React from 'react';
import { Container, Section, Button } from './ui';
import { Search, Image as ImageIcon, TrendingUp, Truck, Globe, Award, Zap } from 'lucide-react';
import Image from 'next/image';

export const ComprehensiveFeatures: React.FC = () => {
  return (
    <Section id="features" className="bg-white border-y border-slate-100">
      <Container>
        <div className="text-center mb-16 max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
            Everything You Need to Dominate
          </h2>
          <p className="text-slate-600 text-xl leading-relaxed">
            Stop stitching together 5 different tools. We give you the complete stack to build a 7-figure dropshipping brand in the USA.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 grid-rows-auto gap-6 h-auto">
          
          {/* Item 1: Product Discovery (Large) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 bg-slate-50 border border-slate-200 rounded-[2rem] overflow-hidden relative group hover:shadow-2xl transition-all duration-500 cursor-pointer">
             <div className="absolute inset-0">
                <Image 
                   src="/images/landing/comprehensive-products.png"
                   alt="Product Grid"
                   fill
                   className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90" />
             </div>
             <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full">
                <div className="flex justify-between items-end">
                   <div>
                      <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-600/30">
                         <Search className="w-7 h-7" />
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-3">#1 Product Discovery</h3>
                      <p className="text-slate-300 mb-8 max-w-md text-lg">Spy on 8-figure stores. Find hidden winners before they go viral. Validated real-time data.</p>
                      <Button variant="primary" className="bg-white text-slate-900 hover:bg-slate-100 border-none font-bold px-8">Find Winners</Button>
                   </div>
                </div>
             </div>
          </div>

          {/* Item 2: AI Studio (Tall) */}
          <div className="col-span-1 md:col-span-1 row-span-2 bg-white border border-slate-200 rounded-[2rem] p-6 flex flex-col justify-between hover:border-blue-300 hover:shadow-xl transition-all duration-300 group cursor-pointer">
             <div>
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 border border-indigo-100">
                   <ImageIcon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">AI Creative Studio</h3>
                <p className="text-slate-500">Generate high-converting ads and photos instantly. No photographers. No models.</p>
             </div>
             <div className="mt-6 aspect-[3/4] rounded-2xl overflow-hidden relative bg-slate-100 shadow-inner">
                <Image 
                   src="/images/landing/comprehensive-model.png"
                   alt="AI Model"
                   fill
                   className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold tracking-wide border border-slate-200 uppercase z-10">
                   AI Generated
                </div>
             </div>
          </div>

          {/* Item 3: Fast Shipping (Small) */}
          <div className="col-span-1 md:col-span-1 bg-blue-600 rounded-[2rem] p-8 flex flex-col justify-center relative overflow-hidden group cursor-pointer hover:bg-blue-700 transition-colors">
             <div className="absolute top-0 right-0 p-6 opacity-10 transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <Truck className="w-28 h-28 text-white" />
             </div>
             <h3 className="text-2xl font-bold text-white mb-1 relative z-10">Fast US Shipping</h3>
             <p className="text-blue-100 mb-6 relative z-10 font-medium">5-8 day delivery via USPS.</p>
             <div className="flex -space-x-2 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center text-xs font-bold text-blue-600">US</div>
                <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-blue-600 flex items-center justify-center text-xs font-bold text-blue-600">EU</div>
                <div className="w-10 h-10 rounded-full bg-blue-200 border-2 border-blue-600 flex items-center justify-center text-xs font-bold text-blue-600">CA</div>
             </div>
          </div>

          {/* Item 4: Analytics (Small) */}
          <div className="col-span-1 md:col-span-1 bg-white border border-slate-200 rounded-[2rem] p-8 hover:shadow-lg transition-all cursor-pointer group">
             <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center border border-green-100">
                   <TrendingUp className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">+127% ROI</span>
             </div>
             <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Profit Calculator</h3>
             <p className="text-slate-500 text-sm mt-2 font-medium">Know your real margins before you sell.</p>
          </div>

          {/* Item 5: Academy (Wide) */}
          <div className="col-span-1 md:col-span-2 bg-slate-900 rounded-[2rem] p-8 md:p-10 flex items-center justify-between relative overflow-hidden group cursor-pointer">
             <div className="relative z-10 max-w-sm">
                <div className="flex items-center gap-2 mb-4 text-blue-400 font-bold uppercase tracking-wider text-xs">
                   <Award className="w-4 h-4" />
                   <span>Included Free</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-3">Dropshipping Academy</h3>
                <p className="text-slate-400 mb-8">Master Facebook Ads, TikTok organic, and scaling strategies with our expert courses.</p>
                <Button variant="secondary" size="sm" className="bg-white/10 text-white hover:bg-white/20 border-white/10 backdrop-blur-md">Start Learning</Button>
             </div>
             <div className="absolute right-0 top-0 bottom-0 w-3/5 opacity-20 group-hover:opacity-30 transition-opacity mask-image-gradient relative">
                <Image 
                   src="/images/landing/comprehensive-academy.png"
                   alt="Academy"
                   fill
                   className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-slate-900" />
             </div>
          </div>
          
          {/* Item 6: Global (Wide) */}
          <div className="col-span-1 md:col-span-2 bg-white border border-slate-200 rounded-[2rem] p-8 md:p-10 relative overflow-hidden group hover:border-blue-300 transition-all cursor-pointer">
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
                <div className="flex-1">
                   <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                      <span className="text-amber-600 font-bold text-sm uppercase">Instant Expansion</span>
                   </div>
                   <h3 className="text-3xl font-bold text-slate-900 mb-3">Sell Globally</h3>
                   <p className="text-slate-600 mb-6 max-w-md">We handle VAT, customs, and currency conversion automatically. Expand to 50+ countries.</p>
                   <Button variant="outline" className="font-bold border-slate-300">Explore Markets</Button>
                </div>
                <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center text-blue-500 shrink-0 shadow-xl shadow-blue-100 group-hover:scale-110 transition-transform duration-500">
                   <Globe className="w-20 h-20 text-blue-600" strokeWidth={1.5} />
                </div>
             </div>
          </div>

        </div>

        <div className="mt-16 text-center">
           <Button size="lg" className="px-12 h-16 text-lg rounded-full shadow-lg shadow-blue-500/20 font-bold hover:scale-105 transition-transform">
              Get Started for Free
           </Button>
           <p className="mt-4 text-slate-500 text-sm font-medium">No credit card required. Cancel anytime.</p>
        </div>
      </Container>
    </Section>
  );
};

