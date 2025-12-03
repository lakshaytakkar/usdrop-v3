import React from 'react';
import { Container, Button, GeneratedImage } from './ui';
import { PlayCircle, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative pt-32 pb-24 bg-[#020617] overflow-hidden">
      
      {/* Dynamic Animated Background Layers */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
         {/* Deep Base Gradient */}
         <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-[#0B1121] to-[#020617] opacity-90" />
         
         {/* Animated Blobs */}
         <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-indigo-600/20 rounded-full blur-[100px] animate-blob mix-blend-screen" />
         <div className="absolute top-[10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-600/20 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-screen" />
         <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] bg-violet-600/20 rounded-full blur-[120px] animate-blob animation-delay-4000 mix-blend-screen" />
         
         {/* Grain/Noise Texture */}
         <div className="absolute inset-0 bg-noise opacity-[0.15] mix-blend-overlay" />
      </div>
      
      <Container className="relative z-10">
        <div className="text-center max-w-5xl mx-auto mb-16 space-y-8">
          
          {/* Badge - Dark Mode */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur border border-white/10 text-blue-300 text-sm font-bold shadow-lg animate-in fade-in zoom-in duration-500 hover:bg-white/10 transition-colors cursor-pointer">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span>New: AI Studio 2.0 Now Live</span>
            <ArrowRight className="w-3 h-3 ml-1" />
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white leading-[1.05] font-display drop-shadow-sm">
            The World’s #1 <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-indigo-400">Dropshipping Platform.</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
            Find winning products, generate AI creatives, and ship from the USA in 2-5 days. <span className="text-white font-bold">No inventory needed.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button size="lg" className="rounded-full h-16 px-10 text-lg bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] font-bold hover:scale-105 transition-transform ring-4 ring-blue-600/20 border-none">
              Get Free Access (No Credit Card)
            </Button>
            <Button variant="outline" size="lg" className="rounded-full h-16 px-8 text-lg flex items-center gap-2 bg-white/5 backdrop-blur hover:bg-white/10 text-white font-semibold border-white/10 hover:border-white/20">
              <PlayCircle className="w-5 h-5 text-slate-300" />
              Watch Demo
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-8 text-sm font-bold text-slate-400 pt-2">
             <span className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-blue-400" /> 14-Day Free Trial</span>
             <span className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-blue-400" /> Cancel Anytime</span>
          </div>

        </div>

        {/* Dashboard Preview - Live Interactive Feel */}
        <div className="relative mx-auto max-w-7xl mt-12 perspective-1000">
           <div className="rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/10 p-3 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] transform rotate-x-2 transition-transform duration-1000 hover:rotate-x-0 ring-1 ring-white/10">
              <div className="bg-slate-900 rounded-xl overflow-hidden border border-white/5 aspect-[16/9] relative group shadow-2xl">
                 <GeneratedImage 
                   prompt="dashboard ui of usdrop platform dark mode, showing neon blue revenue charts climbing, map of usa orders, sidebar with ai tools, clean modern interface, high resolution"
                   className="w-full h-full object-cover scale-100 group-hover:scale-[1.01] transition-transform duration-1000 opacity-90"
                   alt="USDrop Dashboard"
                 />
                 
                 {/* Live Elements Overlay */}
                 <div className="absolute top-8 left-8 bg-slate-900/90 backdrop-blur p-4 rounded-xl shadow-2xl border border-white/10 animate-in slide-in-from-left-4 duration-1000 hidden md:block ring-1 ring-white/5">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                          <Zap className="w-5 h-5 fill-current" />
                       </div>
                       <div>
                          <div className="text-xs text-slate-400 font-bold uppercase">Today's Profit</div>
                          <div className="text-xl font-bold text-white">$2,845.00</div>
                       </div>
                    </div>
                 </div>

                 <div className="absolute bottom-8 right-8 bg-slate-900/90 backdrop-blur p-4 rounded-xl shadow-2xl border border-white/10 animate-in slide-in-from-bottom-4 duration-1000 delay-200 hidden md:block ring-1 ring-white/5">
                    <div className="flex items-center gap-4">
                       <div className="flex -space-x-3">
                          {[1,2,3].map(i => (
                             <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-800 bg-slate-700" /> 
                          ))}
                       </div>
                       <div>
                          <div className="text-sm font-bold text-white">3 New Orders</div>
                          <div className="text-xs text-blue-400 font-medium">Just now • From USA</div>
                       </div>
                    </div>
                 </div>

              </div>
           </div>
           
           {/* Glow Effect Under Dashboard */}
           <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[60%] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />
        </div>

      </Container>
    </div>
  );
};