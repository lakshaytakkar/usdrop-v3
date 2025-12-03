import React, { useState, useRef, useEffect } from 'react';
import { Section, Container, genAIQueue } from './ui';
import { GoogleGenAI } from "@google/genai";
import { Loader2, ImageOff } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: "Start with any asset",
    description: "Upload flat-lays, mannequin shots, or raw product photos. Our AI instantly understands geometry, fabric, and form.",
    prompt: "High end commercial photography of a stylish beige trench coat hanging on a minimal rack, bright white studio lighting, 4k, neutral background"
  },
  {
    id: 2,
    title: "Add your model",
    description: "Choose from our diverse AI model agency or upload your own talent. We preserve facial identity with 100% fidelity.",
    prompt: "Photorealistic portrait of a young diverse fashion model looking confident, bright daylight studio, white background, 8k, extremely detailed skin texture"
  },
  {
    id: 3,
    title: "Direct the scene",
    description: "Act as Art Director. Control lighting, mood, and background props with simple text prompts or intuitive sliders.",
    prompt: "Wide shot of a professional photography studio with lights and cameras, bright atmosphere, behind the scenes, cinematic, white walls"
  },
  {
    id: 4,
    title: "Generate infinite variations",
    description: "Spin out full campaigns in seconds. Create social cuts, e-commerce sets, and seasonal lookbooks from a single setup.",
    prompt: "Collage of 4 fashion photos of the same model in different outfits and poses, editorial fashion magazine style, high quality, white borders"
  }
];

// Component to handle individual image generation using the shared queue
const AIImage = ({ prompt, isActive }: { prompt: string, isActive: boolean }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const hasLoaded = useRef(false);

  useEffect(() => {
    const generate = async () => {
      // Only generate if we haven't already and API key exists
      if (hasLoaded.current || !process.env.API_KEY) return;
      
      hasLoaded.current = true;
      setLoading(true);

      genAIQueue.add(async () => {
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
              parts: [{ text: prompt }]
            }
          });

          // Find image part
          for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
              const base64EncodeString = part.inlineData.data;
              setImageUrl(`data:image/png;base64,${base64EncodeString}`);
              break;
            }
          }
        } catch (error) {
          console.error("Image gen failed", error);
          setError(true);
        } finally {
          setLoading(false);
        }
      });
    };

    // Trigger generation on mount
    generate();
  }, [prompt]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }
  
  if (error) {
     return (
       <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-300">
          <ImageOff className="w-8 h-8 mb-2 opacity-50" />
       </div>
     )
  }

  if (!imageUrl) {
    // Fallback while pending in queue
    return <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs text-slate-400">Waiting for AI...</div>;
  }

  return (
    <img 
      src={imageUrl} 
      className={`w-full h-full object-cover transition-all duration-700 ${isActive ? 'scale-105 opacity-100' : 'scale-100 opacity-0 absolute inset-0'}`}
      alt="Generated Content"
    />
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
                      <div key={step.id} className={`absolute inset-0 transition-opacity duration-500 ${activeStep === step.id ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                        <AIImage prompt={step.prompt} isActive={activeStep === step.id} />
                      </div>
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
                   <AIImage prompt={step.prompt} isActive={true} />
                </div>
              </div>
            ))}
          </div>

        </div>
      </Container>
    </Section>
  );
};