import React from 'react';
import { Container, Section, Button } from './ui';
import { Eye, Zap } from 'lucide-react';


const productCategories = [
  "smart home gadget", "beauty serum", "fitness tracker", "pet accessory",
  "kitchen tool", "phone case", "jewelry", "fashion apparel"
];

export const FeatureRows: React.FC = () => {
  return (
    <div className="bg-white overflow-hidden" id="product-research">
      
      {/* Section 1: Spy Tools */}
      <Section>
        <Container>
          <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-24">
            
            {/* Text Left */}
            <div className="w-full md:w-1/2 space-y-8">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider">
                  <Eye className="w-3 h-3" /> Unfair Advantage
               </div>
               <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                 Spy on 8-Figure Stores in One Click.
               </h2>
               <p className="text-lg text-slate-500 leading-relaxed font-medium">
                 Don't guess what sells. See exactly what top dropshippers are running right now. Reveal their winning products, revenue estimates, and ad strategies instantly.
               </p>
               <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-700 font-medium">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">✓</div>
                    Real-time sales revenue estimates
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 font-medium">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">✓</div>
                    Download winning ads without watermarks
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 font-medium">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">✓</div>
                    Filter by 'Scaling' and 'Viral' status
                  </li>
               </ul>
               <Button size="lg" className="h-14 px-8 rounded-lg bg-blue-600 hover:bg-blue-700 font-bold shadow-xl shadow-blue-600/10">Start Spying for Free</Button>
            </div>

            {/* Image Right (Grid of products) */}
            <div className="w-full md:w-1/2">
               <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-3xl shadow-2xl border border-slate-100 transform rotate-1">
                  <div className="col-span-2 bg-slate-900 text-white p-4 rounded-xl flex justify-between items-center mb-2">
                     <span className="font-bold">Top Winners Today</span>
                     <span className="text-green-400 text-xs font-mono">LIVE UPDATES</span>
                  </div>
                  {productCategories.slice(0, 4).map((category, i) => (
                     <div key={i} className="aspect-square bg-slate-50 rounded-xl overflow-hidden relative group border border-slate-100">
                        <img 
                           src={`/images/landing/featurerows-product-${i+1}.png`}
                           alt={category}
                          
                           className="object-cover"
                        />
                        <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold text-slate-900 flex justify-between z-10">
                           <span>${(20 + i * 15).toFixed(2)}</span>
                           <span className="text-green-600">+{i + 2}00%</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

          </div>
        </Container>
      </Section>

      {/* Section 2: Ad Spend */}
      <Section className="pt-0">
        <Container>
          <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-24">
            
            {/* Image Left (Mobile UI) */}
            <div className="w-full md:w-1/2 order-2 md:order-1 relative">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/50 rounded-full blur-3xl -z-10" />
               <div className="relative h-[600px] w-full bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl flex items-center justify-center overflow-hidden p-8">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/30 to-slate-900 pointer-events-none" />
                  
                  <div className="relative w-full max-w-sm">
                     <div className="bg-slate-800 rounded-2xl p-4 mb-4 border border-slate-700">
                        <div className="flex items-center gap-3 mb-3">
                           <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-orange-400" />
                           <div>
                              <div className="h-2 w-24 bg-slate-600 rounded mb-1" />
                              <div className="h-2 w-16 bg-slate-700 rounded" />
                           </div>
                           <div className="ml-auto text-green-400 font-mono text-xs font-bold">ROAS 4.2x</div>
                        </div>
                        <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden relative">
                           <img src="/images/landing/featurerows-tiktok-ad.png" alt="Ad Creative" className="object-cover opacity-80" />
                        </div>
                     </div>
                     
                     <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 opacity-60 scale-95">
                         <div className="flex items-center gap-3 mb-3">
                           <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-400" />
                           <div className="flex-1">
                              <div className="h-2 w-full bg-slate-600 rounded" />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Text Right */}
            <div className="w-full md:w-1/2 order-1 md:order-2 space-y-8">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider">
                  <Zap className="w-3 h-3" /> Viral Trends
               </div>
               <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                 Find the Ads that are Printing Money.
               </h2>
               <p className="text-lg text-slate-500 leading-relaxed font-medium">
                 Analyze high performing Facebook & TikTok ads by ad spend to uncover proven strategies. Stop testing bad creatives—just use what works.
               </p>
               <Button size="lg" className="h-14 px-8 rounded-lg bg-blue-600 hover:bg-blue-700 font-bold">Find Winning Ads</Button>
            </div>

          </div>
        </Container>
      </Section>

    </div>
  );
};

