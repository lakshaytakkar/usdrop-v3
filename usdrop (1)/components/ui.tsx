import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Loader2, ImageOff } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- Request Queue for Rate Limiting ---
class RequestQueue {
  private queue: (() => Promise<void>)[] = [];
  private isProcessing = false;
  private delayMs = 1500; // Optimized delay

  add(request: () => Promise<void>) {
    this.queue.push(request);
    this.process();
  }

  private async process() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const request = this.queue.shift();
      if (request) {
        try {
          await request();
        } catch (error) {
          console.error("Queue request error:", error);
        }
        await new Promise(resolve => setTimeout(resolve, this.delayMs));
      }
    }
    this.isProcessing = false;
  }
}

export const genAIQueue = new RequestQueue();

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'accent' | 'white';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 border border-transparent",
    secondary: "bg-white text-slate-900 border border-slate-200 hover:border-blue-600 hover:text-blue-600 shadow-sm",
    ghost: "hover:bg-slate-100 text-slate-600 hover:text-slate-900",
    outline: "border border-slate-300 bg-transparent hover:border-slate-900 text-slate-900",
    accent: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-110",
    white: "bg-white text-blue-600 hover:bg-blue-50 border border-transparent font-bold"
  };

  const sizes = {
    sm: "h-8 px-4 text-xs rounded-full",
    md: "h-10 px-6 py-2 text-sm rounded-full",
    lg: "h-14 px-8 text-base rounded-lg"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Badge: React.FC<{ children: React.ReactNode, variant?: 'default' | 'outline' | 'hot' | 'new', className?: string }> = ({ children, variant = 'default', className = '' }) => {
  let variantStyles = "bg-slate-100 text-slate-700 border-slate-200";
  
  if (variant === 'hot') variantStyles = "bg-red-50 text-red-600 border-red-100 font-bold";
  if (variant === 'new') variantStyles = "bg-blue-50 text-blue-600 border-blue-100 font-bold";
  if (variant === 'outline') variantStyles = "bg-transparent border-slate-200 text-slate-600";

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] uppercase tracking-wider border ${variantStyles} ${className}`}>
      {children}
    </span>
  );
};

export const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

export const Section: React.FC<{ children: React.ReactNode; className?: string; id?: string }> = ({ children, className = "", id }) => (
  <section id={id} className={`py-24 ${className}`}>
    {children}
  </section>
);

interface AccordionItemProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ title, isOpen, onToggle, children }) => {
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left focus:outline-none group"
      >
        <span className={`text-base font-medium transition-colors ${isOpen ? 'text-blue-600' : 'text-slate-900 group-hover:text-blue-600'}`}>
          {title}
        </span>
        <ChevronDown 
          className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} 
        />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}
      >
        <div className="text-slate-600 leading-relaxed text-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

interface GeneratedImageProps {
  prompt: string;
  className?: string;
  alt?: string;
  overlay?: boolean;
}

export const GeneratedImage: React.FC<GeneratedImageProps> = ({ prompt, className = "", alt = "Generated Content", overlay = false }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const hasLoaded = useRef(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasLoaded.current && process.env.API_KEY) {
          hasLoaded.current = true;
          setLoading(true);
          
          genAIQueue.add(async () => {
             try {
               const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
               // Enforce a clean, SaaS style output
               const enhancedPrompt = `${prompt}, clean UI interface, white background, high resolution, minimalist, dribbble style, no text glitches, vector style graphics`;
               
               const response = await ai.models.generateContent({
                 model: 'gemini-2.5-flash-image',
                 contents: {
                   parts: [{ text: enhancedPrompt }]
                 }
               });
         
               let foundImage = false;
               if (response.candidates?.[0]?.content?.parts) {
                   for (const part of response.candidates[0].content.parts) {
                        if (part.inlineData) {
                            const base64EncodeString = part.inlineData.data;
                            setImageUrl(`data:image/png;base64,${base64EncodeString}`);
                            foundImage = true;
                            break;
                        }
                   }
               }
               
               if (!foundImage) {
                   console.warn("Generation returned text instead of image for prompt:", prompt);
                   // Set error but don't log a loud error trace
                   setError(true);
               }
               
             } catch (error) {
               console.error("Image gen failed for prompt:", prompt, error);
               setError(true);
             } finally {
               setLoading(false);
             }
          });
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [prompt]);

  return (
    <div ref={observerTarget} className={`relative overflow-hidden bg-slate-50 ${className}`}>
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={alt} 
          className="w-full h-full object-cover animate-in fade-in duration-700"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 text-slate-300">
           {loading ? (
             <Loader2 className="w-6 h-6 animate-spin text-blue-200" />
           ) : error ? (
             <div className="flex flex-col items-center gap-1 opacity-50">
                <ImageOff className="w-6 h-6 text-slate-300" />
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Failed</span>
             </div>
           ) : (
             <div className="w-full h-full bg-slate-100" />
           )}
        </div>
      )}
      {overlay && <div className="absolute inset-0 bg-black/5 pointer-events-none" />}
    </div>
  );
};