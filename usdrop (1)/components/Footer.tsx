import React from 'react';
import { Container, Button } from './ui';
import { Package } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white">
      <Container>
        {/* Blue CTA Box */}
        <div className="bg-blue-600 rounded-3xl p-12 text-center text-white mb-20 relative overflow-hidden">
           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
           <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Try USDrop with a 7-day trial</h2>
              <p className="text-blue-100 text-lg">
                 Perfect for beginners looking to dive into dropshipping! Explore all our tools, with no commitment—cancel anytime.
              </p>
              
              <div className="flex items-center justify-center gap-6 text-sm font-medium text-blue-100 py-2">
                 <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-white rounded-full"/> Try today</span>
                 <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-white rounded-full"/> 100% risk-free</span>
                 <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-white rounded-full"/> Cancel anytime</span>
              </div>

              <div className="pt-2">
                 <Button variant="white" size="lg" className="rounded-lg h-12 px-10 text-slate-900">Try For Free</Button>
              </div>
           </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-16 border-b border-slate-100">
           <div className="col-span-2 md:col-span-1 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                 <div className="bg-blue-600 text-white p-1 rounded-md">
                    <Package size={16} />
                 </div>
                 <span className="text-lg font-bold text-slate-900">USDrop</span>
              </div>
              <p className="text-sm text-slate-500">Discover Products With Potential</p>
           </div>
           
           <div className="space-y-4">
              <h4 className="font-bold text-slate-900">Products</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                 <li><a href="#" className="hover:text-blue-600">Product Library</a></li>
                 <li><a href="#" className="hover:text-blue-600">Ad Library</a></li>
                 <li><a href="#" className="hover:text-blue-600">Portfolio</a></li>
                 <li><a href="#" className="hover:text-blue-600">Competitor Research</a></li>
                 <li><a href="#" className="hover:text-blue-600">Magic AI Search</a></li>
              </ul>
           </div>

           <div className="space-y-4">
              <h4 className="font-bold text-slate-900">Free Tools</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                 <li><a href="#" className="hover:text-blue-600">Interest Explorer</a></li>
                 <li><a href="#" className="hover:text-blue-600">Numbers Breakdown</a></li>
                 <li><a href="#" className="hover:text-blue-600">CPA Calculator</a></li>
                 <li><a href="#" className="hover:text-blue-600">ROAS Calculator</a></li>
              </ul>
           </div>

           <div className="space-y-4">
              <h4 className="font-bold text-slate-900">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                 <li><a href="#" className="hover:text-blue-600">Pricing</a></li>
                 <li><a href="#" className="hover:text-blue-600">About</a></li>
                 <li><a href="#" className="hover:text-blue-600">Contact</a></li>
              </ul>
           </div>

           <div className="space-y-4">
              <h4 className="font-bold text-slate-900">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                 <li><a href="#" className="hover:text-blue-600">Blog</a></li>
                 <li><a href="#" className="hover:text-blue-600">Community</a></li>
                 <li><a href="#" className="hover:text-blue-600">Dropship University</a></li>
                 <li><a href="#" className="hover:text-blue-600">FAQs</a></li>
              </ul>
           </div>
        </div>

        <div className="py-8 flex items-center justify-between text-xs text-slate-400 font-medium">
           <div className="flex gap-4">
              <span>United Arab Emirates</span>
           </div>
           <div className="flex gap-4">
              <span>EN</span>
              <span>DE</span>
              <span>ES</span>
              <span>FR</span>
           </div>
        </div>
      </Container>
    </footer>
  );
};