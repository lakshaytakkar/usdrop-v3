"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Section, Container } from './ui';
import { Loader2, ImageOff } from 'lucide-react';
import Image from 'next/image';

const steps = [
  {
    id: 1,
    title: "Start with any asset",
    description: "Upload flat-lays, mannequin shots, or raw product photos. Our AI instantly understands geometry, fabric, and form.",
    image: "/images/landing/workflow-trench-coat.png"
  },
  {
    id: 2,
    title: "Add your model",
    description: "Choose from our diverse AI model agency or upload your own talent. We preserve facial identity with 100% fidelity.",
    image: "/images/landing/workflow-model.png"
  },
  {
    id: 3,
    title: "Direct the scene",
    description: "Act as Art Director. Control lighting, mood, and background props with simple text prompts or intuitive sliders.",
    image: "/images/landing/workflow-studio.png"
  },
  {
    id: 4,
    title: "Generate infinite variations",
    description: "Spin out full campaigns in seconds. Create social cuts, e-commerce sets, and seasonal lookbooks from a single setup.",
    image: "/images/landing/workflow-campaign.png"
  }
];

// Component to handle image display with transitions
const WorkflowImage = ({ image, isActive }: { image: string, isActive: boolean }) => {
  return (
    <div className={`absolute inset-0 transition-opacity duration-500 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
      <div className={`w-full h-full relative transition-transform duration-700 ${isActive ? 'scale-105' : 'scale-100'}`}>
        <Image 
          src={image} 
          alt="Workflow Step"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};

export const Workflow: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Simple scroll logic could go here
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Section id="how-it-works" className="bg-white">
      <Container>
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24" ref={sectionRef}>
          
          {/* Sticky Visual Side */}
          <div className="hidden lg:flex w-1/2 flex-col">
             <div className="sticky top-32">
                <div className="aspect-square w-full rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden relative shadow-2xl shadow-blue-900/5">
                   {/* Stack images on top of each other to allow crossfading */}
                   {steps.map((step) => (
                      <WorkflowImage key={step.id} image={step.image} isActive={activeStep === step.id} />
                   ))}
                   
                   <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-xs text-slate-900 border border-slate-200 z-20 shadow-sm font-medium">
                      Step {activeStep} • Generated with Nano Banana
                   </div>
                </div>
             </div>
          </div>

          {/* Scrolling Text Side */}
          <div className="w-full lg:w-1/2 flex flex-col gap-24 py-12">
            <div className="mb-8">
               <h2 className="text-3xl font-bold text-slate-900 mb-4">How it feels to use it.</h2>
               <p className="text-slate-600">A seamless workflow designed for creative control.</p>
            </div>

            {steps.map((step) => (
              <div 
                key={step.id} 
                className="group cursor-pointer min-h-[200px] flex flex-col justify-center"
                onMouseEnter={() => setActiveStep(step.id)}
              >
                <div className={`text-sm font-mono mb-4 transition-colors ${activeStep === step.id ? 'text-blue-600' : 'text-slate-400'}`}>
                  0{step.id}
                </div>
                <h3 className={`text-2xl font-semibold mb-3 transition-colors ${activeStep === step.id ? 'text-slate-900' : 'text-slate-400'}`}>
                  {step.title}
                </h3>
                <p className={`text-lg transition-colors leading-relaxed ${activeStep === step.id ? 'text-slate-700' : 'text-slate-400'}`}>
                  {step.description}
                </p>
                {/* Mobile Image View */}
                <div className="lg:hidden mt-4 aspect-video rounded-lg overflow-hidden border border-slate-200 relative shadow-sm">
                   <div className="w-full h-full relative">
                      <Image src={step.image} alt={step.title} fill className="object-cover" />
                   </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </Container>
    </Section>
  );
};

