import React from 'react';
import { Container, Section, Button, GeneratedImage } from './ui';
import { Package, Truck, CheckCircle, Smartphone, MapPin, Clock } from 'lucide-react';

export const AutomationFlow: React.FC = () => {
  return (
    <Section className="bg-white" id="fulfillment">
      <Container>
        <div className="text-center mb-16 max-w-4xl mx-auto">
           <div className="text-xs font-bold text-green-600 uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
              <MapPin className="w-3 h-3" /> Warehouses in LA, NY, & Texas
           </div>
           <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
             Ship from the USA. <br/>
             <span className="text-blue-600">Delivered in 2-5 Days.</span>
           </h2>
           <p className="text-xl text-slate-600">
              Your customers hate waiting. Stop losing sales to AliExpress shipping times. We stock winning products in our US warehouses so you can offer Amazon-level speed.
           </p>
        </div>

        {/* Timeline Flow */}
        <div className="relative mb-20">
           {/* Connecting Line */}
           <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-100 z-0" />
           
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center group">
                 <div className="w-24 h-24 bg-white rounded-full border-4 border-slate-50 shadow-lg flex items-center justify-center mb-6 relative group-hover:border-blue-100 transition-colors">
                    <div className="absolute top-0 right-0 bg-blue-600 rounded-full p-1 border-2 border-white">
                       <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <GeneratedImage prompt="icon of a product being selected on a screen, minimalist vector" className="w-12 h-12 object-contain opacity-80" />
                 </div>
                 <h3 className="text-lg font-bold text-slate-900 mb-2">1. Customer Orders</h3>
                 <p className="text-sm text-slate-500 px-4">Order comes into your Shopify store. You do nothing.</p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center group">
                 <div className="w-24 h-24 bg-white rounded-full border-4 border-slate-50 shadow-lg flex items-center justify-center mb-6 group-hover:border-blue-100 transition-colors">
                    <GeneratedImage prompt="icon of a robot arm packing a box, minimalist vector" className="w-12 h-12 object-contain opacity-80" />
                 </div>
                 <h3 className="text-lg font-bold text-slate-900 mb-2">2. Auto-Fulfillment</h3>
                 <p className="text-sm text-slate-500 px-4">USDrop automatically picks, packs, and ships the item from a US warehouse.</p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center group">
                 <div className="w-24 h-24 bg-white rounded-full border-4 border-slate-50 shadow-lg flex items-center justify-center mb-6 group-hover:border-blue-100 transition-colors">
                    <div className="bg-blue-50 px-3 py-1 rounded text-xs font-mono font-bold text-blue-600 border border-blue-100">US...92</div>
                 </div>
                 <h3 className="text-lg font-bold text-slate-900 mb-2">3. Instant Tracking</h3>
                 <p className="text-sm text-slate-500 px-4">Tracking number is synced to Shopify and emailed to your customer instantly.</p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center group">
                 <div className="w-24 h-24 bg-white rounded-full border-4 border-slate-50 shadow-lg flex items-center justify-center mb-6 group-hover:border-blue-100 transition-colors">
                    <GeneratedImage prompt="icon of a happy customer holding a package, minimalist vector" className="w-12 h-12 object-contain opacity-80" />
                 </div>
                 <h3 className="text-lg font-bold text-slate-900 mb-2">4. Fast Delivery</h3>
                 <p className="text-sm text-slate-500 px-4">Customer receives the package in 2-5 days. No Chinese characters on the label.</p>
              </div>
           </div>
        </div>

        <div className="text-center">
           <Button size="lg" className="h-14 px-10 rounded-lg text-lg bg-blue-600 hover:bg-blue-700 font-bold shadow-xl shadow-blue-600/20">Check US Shipping Rates</Button>
        </div>

        {/* Feature Highlights */}
        <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-200 hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                    <Package className="w-6 h-6" />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-900">1-Click Product Import</h3>
              </div>
              <p className="text-slate-600 mb-8 text-lg">No manual uploads. USDrop pushes images, descriptions, and variant data to Shopify instantly.</p>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
                 <div className="w-16 h-16 bg-slate-100 rounded-lg shrink-0 overflow-hidden">
                    <GeneratedImage prompt="product photo of a smart portable blender" className="w-full h-full object-cover" />
                 </div>
                 <div className="flex-1">
                    <div className="h-4 w-3/4 bg-slate-100 rounded mb-2" />
                    <div className="h-3 w-1/2 bg-slate-100 rounded" />
                 </div>
                 <Button size="sm" variant="outline" className="text-xs">Imported ✓</Button>
              </div>
           </div>

           <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-200 hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-green-600 shadow-sm">
                    <Clock className="w-6 h-6" />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-900">99.8% On-Time Delivery</h3>
              </div>
              <p className="text-slate-600 mb-8 text-lg">We processed 2.1M+ packages last year. Our logistics network is battle-tested for Q4 scaling.</p>
              <div className="space-y-3">
                 {[1,2,3].map((i) => (
                    <div key={i} className="bg-white rounded-lg p-3 flex justify-between items-center border border-slate-100">
                       <div className="flex items-center gap-3">
                          <Truck className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-bold text-slate-700">Delivered</span>
                       </div>
                       <span className="text-xs font-mono text-slate-400">2 Days</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>

      </Container>
    </Section>
  );
};