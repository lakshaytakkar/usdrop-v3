import React from 'react';
import { Container, Section, Button } from './ui';
import { Eye, TrendingUp, Lock, Target } from 'lucide-react';
import Image from 'next/image';

export const CompetitorIntelligence: React.FC = () => {
  return (
    <Section className="bg-slate-900 text-white overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           
           {/* Visual Content Left */}
           <div className="relative h-[550px] bg-slate-800 rounded-[2.5rem] border border-slate-700 shadow-2xl overflow-hidden group hover:border-blue-500/50 transition-colors">
              <Image 
                src="/images/landing/competitor-spy.png"
                alt="Competitor Spy Tool"
                fill
                className="object-cover opacity-80 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/90 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                    <span className="font-mono text-sm text-red-400 font-bold tracking-wider">LIVE TRACKING ACTIVE</span>
                 </div>
                 <div className="bg-slate-800/80 backdrop-blur border border-slate-700 p-6 rounded-2xl">
                    <div className="flex justify-between items-center mb-3">
                       <span className="text-sm text-slate-400 font-medium">Competitor Sales Today</span>
                       <span className="text-green-400 font-bold text-xl">+$12,450.00</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                       <div className="h-full w-3/4 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    </div>
                 </div>
              </div>
           </div>

           {/* Text Content Right */}
           <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold uppercase tracking-wider">
                 <Eye className="w-4 h-4" />
                 Unfair Advantage
              </div>
              
              <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                 Spy on <span className="text-blue-500">8-Figure</span> Stores.
              </h2>
              
              <p className="text-slate-400 text-xl leading-relaxed">
                 Don't guess what sells. See exactly what the top dropshippers are running. Reveal their winning products, ad strategies, and revenue in one click.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                 <div className="flex gap-4">
                    <div className="bg-slate-800 p-4 rounded-xl text-blue-400 h-fit border border-slate-700">
                       <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                       <h4 className="font-bold text-white text-lg mb-1">Revenue Reveal</h4>
                       <p className="text-slate-500 text-sm">See accurate daily and monthly sales estimates for any Shopify store.</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="bg-slate-800 p-4 rounded-xl text-blue-400 h-fit border border-slate-700">
                       <Target className="w-6 h-6" />
                    </div>
                    <div>
                       <h4 className="font-bold text-white text-lg mb-1">Ad Strategy</h4>
                       <p className="text-slate-500 text-sm">Download their exact Facebook & TikTok ads without watermarks.</p>
                    </div>
                 </div>
              </div>

              <div className="pt-8">
                 <Button variant="accent" size="lg" className="w-full sm:w-auto h-16 text-lg font-bold px-10 rounded-full">Start Spying for Free</Button>
                 <p className="mt-4 text-slate-500 text-sm">Limited time: Get 50 free searches when you join today.</p>
              </div>
           </div>

        </div>
      </Container>
    </Section>
  );
};
