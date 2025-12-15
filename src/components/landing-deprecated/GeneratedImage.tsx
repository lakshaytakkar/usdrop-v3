"use client"

import { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { geminiService } from '@/lib/services/gemini-service';

interface GeneratedImageProps {
  prompt: string;
  className?: string;
  aspectRatio?: string; // "1:1" | "16:9" etc
  alt?: string;
  overlay?: boolean;
}

export const GeneratedImage: React.FC<GeneratedImageProps> = ({ 
  prompt, 
  className = "", 
  aspectRatio = "1:1", 
  alt = "Generated Content", 
  overlay = false 
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const hasLoaded = useRef(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasLoaded.current) {
          generateImage();
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
  }, []);

  const generateImage = async () => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    setLoading(true);

    try {
      // Add "photorealistic, high quality, commercial photography" to every prompt to maintain style
      const enhancedPrompt = `${prompt}, photorealistic, high quality, 4k, commercial style, sharp focus, bright lighting`;
      
      // Use the existing gemini service
      const imageDataUrl = await geminiService.generateStyledImage(
        enhancedPrompt,
        [],
        aspectRatio as '1:1' | '4:5' | '16:9' | '9:16'
      );
      
      setImageUrl(imageDataUrl);
    } catch (error) {
      console.error("Image gen failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={observerTarget} className={`relative overflow-hidden bg-slate-100 ${className}`}>
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={alt} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400">
           {loading ? <Loader2 className="w-6 h-6 text-primary animate-spin" /> : <div className="text-xs">Loading AI Image...</div>}
        </div>
      )}
      {overlay && <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />}
    </div>
  );
};

