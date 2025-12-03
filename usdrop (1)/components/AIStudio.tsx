import React from 'react';
import { Container, Section, Button, GeneratedImage } from './ui';
import { Feature } from '../types';
import { Camera, Layers, PenTool, Video, Aperture, BarChart, Sparkles } from 'lucide-react';

const features: Feature[] = [
  {
    title: "Image Studio",
    description: "Upload a raw phone photo and get professional studio shots in seconds.",
    prompt: "high end perfume bottle on water surface with ripples, luxury product photography, dramatic lighting, 8k",
    cta: "Generate Photos"
  },
  {
    title: "Model Studio",
    description: "Put your clothing on diverse AI models without hiring talent or booking studios.",
    prompt: "portrait of diverse fashion models wearing branded hoodies, urban street style, bright daylight, commercial fashion",
    cta: "Create Models"
  },
  {
    title: "Ad Studio",
    description: "Generate scroll-stopping video hooks and ad copy that converts.",
    prompt: "collage of colorful social media icons and marketing assets, 3d render style, vibrant",
    cta: "Write Ads"
  },
  {
    title: "Campaign Studio",
    description: "Launch multi-channel campaigns with cohesive visuals automatically.",
    prompt: "marketing strategy dashboard on a futuristic glass tablet, showing campaign growth",
    cta: "Launch Campaign"
  }
];

export const AIStudio: React.FC = () => {
  return (
    <Section id="ai-studio" className="bg-slate-900 relative overflow-hidden text-white">
        {/* Background Decorative */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-blue-600 rounded-full blur-[150px] pointer-events-none opacity-40" />
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 bg-indigo-600 rounded-full blur-[150px] pointer-events-none opacity-40" />

      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <span className="text-blue-400 font-bold tracking-wide uppercase text-xs bg-blue-900/50 border border-blue-500/30 px-3 py-1 rounded-full flex items-center justify-center gap-2 w-fit mx-auto">
             <Sparkles className="w-3 h-3" /> AI-Powered
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-6 mb-6 leading-tight">
            AI Studio: Your Entire Creative Team in One Click.
          </h2>
          <p className="text-slate-300 text-xl font-medium">
            Skip photoshoots, expensive agencies, and freelancers. Generate stunning assets for your store instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="group relative bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/20 hover:-translate-y-1 transition-all duration-300">
              <div className="h-48 w-full relative bg-slate-900">
                <GeneratedImage 
                  prompt={feature.prompt} 
                  className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
                  overlay={true}
                />
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur rounded-lg p-2 text-blue-400 border border-white/10 shadow-sm">
                   {idx === 0 && <Camera className="w-5 h-5" />}
                   {idx === 1 && <Aperture className="w-5 h-5" />}
                   {idx === 2 && <PenTool className="w-5 h-5" />}
                   {idx === 3 && <BarChart className="w-5 h-5" />}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm mb-6 min-h-[40px] leading-relaxed">{feature.description}</p>
                <div className="flex items-center text-blue-400 text-sm font-bold group-hover:text-blue-300 cursor-pointer">
                  {feature.cta} <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
           <Button size="lg" variant="white" className="h-14 px-10 font-bold text-slate-900">Open AI Studio Free</Button>
        </div>
      </Container>
    </Section>
  );
};