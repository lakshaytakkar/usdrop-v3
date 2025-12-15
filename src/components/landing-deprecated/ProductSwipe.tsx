"use client"

import React, { useState } from 'react';
import { Container, Section, Button } from './ui';
import { X, Check, RefreshCw, Zap } from 'lucide-react';
import Image from 'next/image';

const demoProducts = [
  { id: 1, name: "Levitating Moon Lamp", profit: "$45.00", image: "/images/landing/product-moon-lamp.png" },
  { id: 2, name: "Portable Neck Fan", profit: "$22.50", image: "/images/landing/product-neck-fan.png" },
  { id: 3, name: "Smart Galaxy Projector", profit: "$38.00", image: "/images/landing/product-galaxy-projector.png" },
];

export const ProductSwipe: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  const handleSwipe = (dir: 'left' | 'right') => {
    setDirection(dir);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % demoProducts.length);
      setDirection(null);
    }, 300);
  };

  const product = demoProducts[currentIndex];

  return (
    <Section className="bg-white overflow-hidden">
      <Container>
        <div className="flex flex-col lg:flex-row items-center gap-8">
           
           <div className="w-full lg:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider border border-indigo-100">
                 <Zap className="w-3 h-3" /> Interactive Demo
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                 Find a Winner in <br/><span className="text-blue-600">3 Seconds Flat.</span>
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                 Our "Tinder-style" product discovery tool learns what you like. Swipe right to import a winning product directly to your store. Try it yourself.
              </p>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500"><X className="w-4 h-4" /></div> Pass
                 </div>
                 <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500"><Check className="w-4 h-4" /></div> Import
                 </div>
              </div>
           </div>

           <div className="w-full lg:w-1/2 flex justify-center perspective-1000 relative">
              {/* Background Cards for stack effect */}
              <div className="absolute top-4 w-[340px] h-[500px] bg-white border border-slate-200 rounded-3xl shadow-sm scale-95 opacity-50 z-0"></div>
              <div className="absolute top-2 w-[340px] h-[500px] bg-white border border-slate-200 rounded-3xl shadow-md scale-[0.98] opacity-80 z-10"></div>
              
              {/* Active Card */}
              <div 
                 className={`relative w-[340px] h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-100 z-20 overflow-hidden transition-all duration-300 ${
                    direction === 'left' ? '-translate-x-24 -rotate-12 opacity-0' : 
                    direction === 'right' ? 'translate-x-24 rotate-12 opacity-0' : ''
                 }`}
              >
                 <div className="h-3/5 bg-slate-50 relative">
                    <div className="w-full h-full relative">
                       <Image 
                          src={product.image} 
                          alt={product.name}
                          fill
                          className="object-cover"
                       />
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-green-600 border border-green-100 z-10">
                       Est. Profit: {product.profit}
                    </div>
                 </div>
                 <div className="h-2/5 p-6 flex flex-col justify-between">
                    <div>
                       <h3 className="text-xl font-bold text-slate-900 mb-1">{product.name}</h3>
                       <div className="flex gap-2 mb-4">
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Trending</span>
                          <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">US Stock</span>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <button 
                          onClick={() => handleSwipe('left')}
                          className="h-12 rounded-xl border-2 border-slate-200 text-slate-400 hover:border-red-500 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all"
                       >
                          <X className="w-6 h-6" />
                       </button>
                       <button 
                          onClick={() => handleSwipe('right')}
                          className="h-12 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 flex items-center justify-center transition-all"
                       >
                          <Check className="w-6 h-6" />
                       </button>
                    </div>
                 </div>
                 
                 {/* Stamp Overlay */}
                 {direction === 'right' && (
                    <div className="absolute top-8 left-8 border-4 border-green-500 text-green-500 font-black text-2xl uppercase tracking-widest px-4 py-2 rounded -rotate-12 bg-white/50 backdrop-blur">
                       IMPORTED
                    </div>
                 )}
                 {direction === 'left' && (
                    <div className="absolute top-8 right-8 border-4 border-red-500 text-red-500 font-black text-2xl uppercase tracking-widest px-4 py-2 rounded rotate-12 bg-white/50 backdrop-blur">
                       PASS
                    </div>
                 )}
              </div>
           </div>

        </div>
      </Container>
    </Section>
  );
};

