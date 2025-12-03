"use client"

import React, { useState, useEffect } from 'react';
import { Container, Section, GeneratedImage } from './ui';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Sarah Jenkins",
    niche: "Home Decor & Organization",
    quote: "I was stuck at $2k/month using AliExpress. Switched to USDrop and hit $45k in my first month because of the fast shipping. Customers actually leave 5-star reviews now.",
    prompt: "portrait of a successful young female entrepreneur, friendly smile, professional casual attire, bright modern home office background, high quality headshot"
  },
  {
    id: 2,
    name: "Marcus Thorne",
    niche: "Tech Accessories",
    quote: "The product discovery tool is unfair. It found a wireless charger winner for me 2 weeks before everyone else. I made six figures on that one product alone.",
    prompt: "portrait of a confident tech entrepreneur man, 30s, glasses, smart casual, modern tech startup office background, cinematic lighting"
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    niche: "Sustainable Fashion",
    quote: "Content was my biggest bottleneck. The AI Studio generates photos that look like I spent $5,000 on a photoshoot. It saves me huge amounts of time and money.",
    prompt: "portrait of a creative fashion business owner woman, artistic vibe, warm lighting, boutique studio background, professional photography"
  },
  {
    id: 4,
    name: "David Chen",
    niche: "Fitness Gear",
    quote: "USDrop's auto-fulfillment allows me to travel while my store runs on autopilot. The margins are significantly better than other US suppliers I've tried.",
    prompt: "portrait of a fit male entrepreneur, outdoor lifestyle setting, confident, natural lighting, high resolution headshot"
  }
];

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 8000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      setIsAnimating(false);
    }, 300); // Wait for fade out
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setIsAnimating(false);
    }, 300);
  };

  const current = testimonials[currentIndex];

  return (
    <Section className="bg-white border-t border-slate-100 overflow-hidden">
      <Container>
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Trusted by Top Sellers</h2>
          <p className="text-slate-600 text-base max-w-2xl mx-auto">
            Join thousands of entrepreneurs who are building their dream businesses with USDrop.
          </p>
        </div>

        <div className="max-w-5xl mx-auto relative">
          
          {/* Main Card */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl p-6 md:p-10 relative z-10 min-h-[400px] flex flex-col md:flex-row items-center gap-8 md:gap-12 transition-opacity duration-300"
               style={{ opacity: isAnimating ? 0 : 1 }}>
            
            {/* Image (Left) */}
            <div className="shrink-0 relative">
               <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-slate-50 shadow-2xl relative z-10">
                 <GeneratedImage 
                   prompt={current.prompt} 
                   className="w-full h-full object-cover"
                   alt={current.name}
                 />
               </div>
               {/* Decorative elements behind image */}
               <div className="absolute top-4 -right-4 w-full h-full rounded-full bg-blue-50 -z-10" />
               <div className="absolute -bottom-2 -left-2 bg-blue-600 text-white p-2 rounded-xl z-20 shadow-lg">
                 <Quote className="w-6 h-6 fill-current" />
               </div>
            </div>

            {/* Content (Right) */}
            <div className="flex-1 text-center md:text-left space-y-6">
               <div className="flex justify-center md:justify-start gap-1">
                 {[1,2,3,4,5].map(i => (
                   <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                 ))}
               </div>
               
               <blockquote className="text-xl md:text-2xl font-medium text-slate-900 leading-relaxed font-display">
                 "{current.quote}"
               </blockquote>
               
               <div>
                 <div className="font-bold text-lg text-slate-900">{current.name}</div>
                 <div className="text-blue-600 font-medium">{current.niche}</div>
               </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center gap-4 mt-8">
            <button 
              onClick={handlePrev}
              className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all hover:scale-110"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentIndex === idx ? 'bg-blue-600 w-8' : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
            <button 
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all hover:scale-110"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Background Blobs */}
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl -z-10" />
        </div>
      </Container>
    </Section>
  );
};

