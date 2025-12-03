import React from 'react';
import { Container, Section, Button, GeneratedImage } from './ui';
import { Feature } from '@/types/landing';
import { Camera, User, PenTool, BarChart, Badge, Calculator, Sparkles } from 'lucide-react';

const features: Feature[] = [
  {
    title: "Image Studio",
    description: "Generate professional product listing images from simple photos.",
    prompt: "professional product photography setup on white background, two large softbox lights on stands, camera on tripod, white pedestal with product, studio lighting",
    cta: "Generate Images"
  },
  {
    title: "Model Studio",
    description: "Create on-model fashion imagery without hiring talent.",
    prompt: "four diverse fashion models standing in a row, wearing light colored flowing garments, bright minimalist studio setting with large windows, commercial fashion photography",
    cta: "Create Models"
  },
  {
    title: "Ad Studio",
    description: "Generate compelling ad creatives with high-converting copy.",
    prompt: "vibrant abstract illustration with large thumbs-up icon, colorful social media icons and marketing elements arranged in dynamic circular pattern, modern marketing design",
    cta: "Create Ads"
  },
  {
    title: "Campaign Studio",
    description: "Plan and manage multi-channel campaigns automatically.",
    prompt: "white tablet showing marketing dashboard with bar charts, pie charts, and line graphs on light wooden desk, coffee mug and plant nearby, analytics interface",
    cta: "Launch Campaign"
  },
  {
    title: "Whitelabelling",
    description: "Create and design your brand logo with AI-powered tools.",
    prompt: "modern logo design workspace, vector graphics, brand identity elements, minimalist design tools, professional branding studio",
    cta: "Design Logo"
  },
  {
    title: "Profit Calculator",
    description: "Calculate dropshipping profits and margins instantly.",
    prompt: "financial calculator interface, profit margin charts, revenue calculations, business analytics dashboard, modern calculator design",
    cta: "Calculate Profit"
  }
];

export const AIStudio: React.FC = () => {
  return (
    <Section id="ai-studio" className="bg-white relative overflow-hidden">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-6">
          <span className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold tracking-wide uppercase text-xs px-4 py-1.5 rounded-md">
            <Sparkles className="w-3 h-3" /> AI-POWERED CREATIVE TOOLS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-6 mb-4 leading-tight">
            USDrop AI Studio
          </h2>
          <p className="text-slate-600 text-lg md:text-xl leading-relaxed">
            Stop spending thousands on photoshoots and designers. Our AI Studio suite gives you everything you need to launch products instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const icons = [
              <Camera className="w-5 h-5" />,
              <User className="w-5 h-5" />,
              <PenTool className="w-5 h-5" />,
              <BarChart className="w-5 h-5" />,
              <Badge className="w-5 h-5" />,
              <Calculator className="w-5 h-5" />
            ];
            
            return (
              <div key={idx} className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-500 hover:shadow-lg transition-all duration-300">
                <div className="h-56 w-full relative bg-slate-50">
                  <GeneratedImage 
                    prompt={feature.prompt} 
                    className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
                    overlay={false}
                  />
                  <div className="absolute top-4 left-4 bg-blue-600 rounded-full p-2.5 text-white shadow-md">
                    {icons[idx]}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm mb-6 min-h-[40px] leading-relaxed">{feature.description}</p>
                  <div className="flex items-center text-blue-600 text-sm font-semibold group-hover:text-blue-700 cursor-pointer">
                    {feature.cta} <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-12 text-center">
          <Button size="lg" variant="primary" className="h-14 px-12 font-bold text-white bg-slate-900 hover:bg-slate-800">
            Open USDrop AI Studio Free
          </Button>
        </div>
      </Container>
    </Section>
  );
};
