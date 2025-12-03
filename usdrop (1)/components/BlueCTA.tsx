import React from 'react';
import { Container, Button, GeneratedImage } from './ui';
import { Play, CheckCircle } from 'lucide-react';

export const BlueCTA: React.FC = () => {
  return (
    <section className="py-24 bg-blue-600 relative overflow-hidden">
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />

      <Container className="relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-16">
          
          <div className="w-full md:w-1/2 text-white space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold leading-[1.1] font-display">
              Ready to Build Your 7-Figure Brand?
            </h2>
            <p className="text-blue-100 text-xl max-w-lg leading-relaxed font-medium">
              Join 8,000+ stores using USDrop to find winning products, create ads, and ship in 2-5 days from the USA.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
               <Button variant="white" size="lg" className="rounded-lg h-16 px-10 text-lg font-bold shadow-xl shadow-blue-900/20">
                 Get Free Access Now
               </Button>
            </div>
            
            <div className="flex items-center gap-6 text-sm font-medium text-blue-100">
               <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> No credit card required</span>
               <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Cancel anytime</span>
            </div>
          </div>

          <div className="w-full md:w-1/2">
             <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-blue-800 h-80 md:h-96 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <GeneratedImage 
                   prompt="dashboard view of ecommerce sales skyrocketing on a laptop screen, celebratory confetti, dark blue theme"
                   className="w-full h-full object-cover opacity-80 mix-blend-overlay"
                />
                
                {/* Floating Video Player UI element */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md rounded-full p-6 border border-white/30 cursor-pointer hover:scale-110 hover:bg-white/30 transition-all shadow-xl">
                   <Play className="w-10 h-10 text-white fill-white" />
                </div>
                
                <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur p-4 rounded-xl border border-white/10">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white overflow-hidden">
                         <img src="https://i.pravatar.cc/100?img=12" alt="User" />
                      </div>
                      <div>
                         <div className="text-white font-bold text-sm">"Changed my life in 3 months."</div>
                         <div className="text-blue-200 text-xs">Alex D. • Scaled to $50k/mo</div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </Container>
    </section>
  );
};