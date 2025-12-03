import React from 'react';
import { Container } from './ui';
import { ShieldCheck, Truck, Star, Award } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  return (
    <div className="bg-slate-900 py-4 border-y border-slate-800">
      <Container>
        <div className="flex flex-wrap items-center justify-center md:justify-between gap-6 text-slate-300 text-xs md:text-sm font-bold uppercase tracking-wider">
           <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-400" />
              <span>Verified US Suppliers</span>
           </div>
           <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-400" />
              <span>2-5 Day Shipping</span>
           </div>
           <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>#1 Rated Dropshipping App</span>
           </div>
           <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span>4.9/5 on Shopify App Store</span>
           </div>
        </div>
      </Container>
    </div>
  );
};