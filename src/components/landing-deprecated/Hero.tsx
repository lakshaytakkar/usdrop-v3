"use client"

import React, { useState } from 'react';
import { Container } from './ui';
import { Button } from '@/components/ui/button';
import { X, Check } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { MotionParallax } from '@/components/motion/MotionParallax';
import { MotionReveal } from '@/components/motion/MotionReveal';
import { MotionCounter } from '@/components/motion/MotionCounter';
import { MotionButton } from '@/components/motion/MotionButton';
import { splitWords } from '@/lib/motion/text';
import { DURATION, EASING } from '@/lib/motion';

// Shopify Icon Component
const ShopifyIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 256 292" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    preserveAspectRatio="xMidYMid"
  >
    <path d="M223.774 57.34c-.201-1.46-1.48-2.268-2.537-2.357-1.055-.088-23.383-1.743-23.383-1.743s-15.507-15.395-17.209-17.099c-1.703-1.703-5.029-1.185-6.32-.805-.19.056-3.388 1.043-8.678 2.68-5.18-14.906-14.322-28.604-30.405-28.604-.444 0-.901.018-1.358.044C129.31 3.407 123.644.779 118.75.779c-37.465 0-55.364 46.835-60.976 70.635-14.558 4.511-24.9 7.718-26.221 8.133-8.126 2.549-8.383 2.805-9.45 10.462C21.3 95.806.038 260.235.038 260.235l165.678 31.042 89.77-19.42S223.973 58.8 223.775 57.34zM156.49 40.848l-14.019 4.339c.005-.988.01-1.96.01-3.023 0-9.264-1.286-16.723-3.349-22.636 8.287 1.04 13.806 10.469 17.358 21.32zm-27.638-19.483c2.304 5.773 3.802 14.058 3.802 25.238 0 .572-.005 1.095-.01 1.624-9.117 2.824-19.024 5.89-28.953 8.966 5.575-21.516 16.025-31.908 25.161-35.828zm-11.131-10.537c1.617 0 3.246.549 4.805 1.622-12.007 5.65-24.877 19.88-30.312 48.297l-22.886 7.088C75.694 46.16 90.81 10.828 117.72 10.828z" fill="#95BF46"/>
    <path d="M221.237 54.983c-1.055-.088-23.383-1.743-23.383-1.743s-15.507-15.395-17.209-17.099c-.637-.634-1.496-.959-2.394-1.099l-12.527 256.233 89.762-19.418S223.972 58.8 223.774 57.34c-.201-1.46-1.48-2.268-2.537-2.357" fill="#5E8E3E"/>
    <path d="M135.242 104.585l-11.069 32.926s-9.698-5.176-21.586-5.176c-17.428 0-18.305 10.937-18.305 13.693 0 15.038 39.2 20.8 39.2 56.024 0 27.713-17.577 45.558-41.277 45.558-28.44 0-42.984-17.7-42.984-17.7l7.615-25.16s14.95 12.835 27.565 12.835c8.243 0 11.596-6.49 11.596-11.232 0-19.616-32.16-20.491-32.16-52.724 0-27.129 19.472-53.382 58.778-53.382 15.145 0 22.627 4.338 22.627 4.338" fill="#FFF"/>
  </svg>
);

// ProductSwipe card data - extracted from ProductSwipe component
const demoProducts = [
  { id: 1, name: "Levitating Moon Lamp", profit: "$45.00", image: "/images/landing/product-moon-lamp.png" },
  { id: 2, name: "Portable Neck Fan", profit: "$22.50", image: "/images/landing/product-neck-fan.png" },
  { id: 3, name: "Smart Galaxy Projector", profit: "$38.00", image: "/images/landing/product-galaxy-projector.png" },
];

export const Hero: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  const handleSwipe = (dir: 'left' | 'right') => {
    setDirection(dir);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % demoProducts.length);
      setDirection(null);
    }, 300);
  };

  const product = demoProducts[currentIndex];
  const heroTitle = "World's #1 All-in-One Dropshipping Platform";
  const titleWords = splitWords(heroTitle);

  return (
    <section className="relative h-[calc(100vh-5rem)] min-h-[600px] max-h-[850px] flex items-center bg-white text-slate-900 border-b border-slate-100 overflow-hidden pt-32">
      {/* Professional background texture */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle gradient overlay */}
        <MotionParallax speed={0.3} direction="up">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-white to-blue-50/30"></div>
        </MotionParallax>
        
        {/* Grid pattern - professional and subtle */}
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
        
        {/* Subtle noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />
        
        {/* Radial gradient accents */}
        <MotionParallax speed={0.2} direction="up">
          <div 
            className="absolute top-0 right-0 w-1/2 h-1/2 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at top right, rgba(59, 130, 246, 0.1), transparent 60%)'
            }}
          ></div>
        </MotionParallax>
        <MotionParallax speed={0.15} direction="down">
          <div 
            className="absolute bottom-0 left-0 w-1/3 h-1/3 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at bottom left, rgba(99, 102, 241, 0.08), transparent 60%)'
            }}
          ></div>
        </MotionParallax>
      </div>

      <Container className="w-full h-full relative z-10">
        <div className="h-full flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-8 relative">
          
          {/* Left Side: Text Content */}
          <MotionReveal revealStyle="fade" direction="right" delay={0.2} className="w-full lg:w-auto lg:max-w-2xl flex flex-col justify-center lg:pl-0 pt-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-medium tracking-tight leading-[1.1] mb-8 font-sans">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION.normal, delay: 0.3 }}
              >
                World&apos;s{' '}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: DURATION.normal, delay: 0.4, ease: EASING.spring }}
                className="font-medium"
              >
                #1
              </motion.span>
              <motion.span
                initial={{ opacity: 0, rotate: -180, scale: 0 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                transition={{ duration: DURATION.slow, delay: 0.5, ease: EASING.spring }}
                className="inline-block align-middle ml-1"
              >
                <Image
                  src="/3d-icons/crown.png"
                  alt="Crown"
                  width={64}
                  height={64}
                  decoding="async"
                  className="w-[0.9em] h-[0.9em] object-contain"
                />
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION.normal, delay: 0.6 }}
              >
                {' '}All-in-One
              </motion.span>
              <br/>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION.normal, delay: 0.7 }}
                className="relative inline-block"
              >
                <span className="dropshipping-gradient-text font-bold">Dropshipping</span>
                <span 
                  className="absolute inset-0 dropshipping-shine font-bold"
                  aria-hidden="true"
                >
                  Dropshipping
                </span>
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION.normal, delay: 0.8 }}
              >
                {' '}Platform
              </motion.span>
            </h1>
            
            {/* Meaningful metrics display - user-focused benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.normal, delay: 0.9 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 pt-6 border-t border-slate-200"
            >
              <div>
                <div className="text-lg font-semibold text-slate-900 mb-1">Product Research</div>
                <div className="text-sm text-slate-600 leading-relaxed">
                  <MotionCounter value={50} suffix="M+" /> products with real-time analytics
                </div>
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900 mb-1">US Fulfillment</div>
                <div className="text-sm text-slate-600 leading-relaxed">2-5 day shipping from US warehouses</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900 mb-1">AI Studio</div>
                <div className="text-sm text-slate-600 leading-relaxed">Create content and images with AI</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.normal, delay: 1 }}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: DURATION.fast, ease: EASING.easeOut }}
                >
                  <Button 
                    size="lg" 
                    className="h-12 px-10 text-base font-semibold w-fit"
                  >
                    Get Free Access
                  </Button>
                </motion.div>
                
                {/* Also launching on Shopify */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: DURATION.normal, delay: 1.1 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-sm text-slate-600">also launching on</span>
                  <motion.div
                    whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 rounded-lg shadow-sm hover:border-slate-400 w-fit cursor-pointer"
                  >
                    <ShopifyIcon className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-semibold text-slate-900">Shopify App Store</span>
                  </motion.div>
                </motion.div>
              </div>
              
              {/* No credit card required message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: DURATION.normal, delay: 1.2 }}
                className="flex items-center gap-2 text-sm text-slate-500"
              >
                <Check className="w-4 h-4 text-green-600" />
                <span>No credit card required • Start your dropshipping journey today</span>
              </motion.div>
            </motion.div>
          </MotionReveal>

          {/* Right Side: ProductSwipe Card */}
          <div className="shrink-0 flex justify-center items-center relative w-full lg:w-auto lg:pr-0 lg:ml-auto">
            {/* Handwritten Arrow with Text - Near Top Left of Card */}
            <div 
              className="absolute -top-2 left-[-146px] hidden lg:flex flex-col items-start gap-2 pointer-events-none z-30"
            >
              {/* Text - comes first, with line breaks after each word */}
              <div 
                className="text-blue-600 font-semibold uppercase italic leading-tight"
                style={{
                  fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
                  fontSize: '1rem',
                  transform: 'rotate(-1deg)',
                  textShadow: '0 1px 2px rgba(37, 99, 235, 0.15)',
                  letterSpacing: '2px'
                }}
              >
                FIND<br/>WINNING<br/>PRODUCTS
              </div>
              {/* Curvy Casual Arrow SVG - completely curved pointing to card, stopping before overlap */}
              <svg 
                width="75" 
                height="55" 
                viewBox="0 0 75 55" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0 ml-1"
              >
                {/* Completely curvy casual arrow path - organic hand-drawn style, stops before card */}
                <path 
                  d="M5 5 Q8 15, 6 25 Q4 35, 10 40 Q18 45, 28 44 Q38 43, 48 40 Q58 37, 65 34" 
                  stroke="#2563eb" 
                  strokeWidth="3.5" 
                  fill="none" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(37, 99, 235, 0.25))'
                  }}
                />
                {/* Proper arrowhead pointing right like > */}
                <polygon 
                  points="65,34 57,27 57,41 65,34" 
                  fill="#2563eb"
                  stroke="#2563eb"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            
            {/* Background Cards for stack effect */}
            <div className="relative">
              <div className="absolute top-2 left-0 w-[260px] h-[400px] md:w-[280px] md:h-[430px] bg-white border border-slate-200 rounded-2xl shadow-sm scale-95 opacity-50 z-0"></div>
              <div className="absolute top-1 left-0 w-[260px] h-[400px] md:w-[280px] md:h-[430px] bg-white border border-slate-200 rounded-2xl shadow-md scale-[0.98] opacity-80 z-10"></div>
              
              {/* Active Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={
                    direction === 'left'
                      ? { x: 0, rotate: 0, opacity: 1, scale: 1 }
                      : direction === 'right'
                      ? { x: 0, rotate: 0, opacity: 1, scale: 1 }
                      : { opacity: 0, y: 20, scale: 0.95 }
                  }
                  animate={{ x: 0, rotate: 0, opacity: 1, scale: 1 }}
                  exit={
                    direction === 'left'
                      ? { x: -80, rotate: -12, opacity: 0, scale: 0.9 }
                      : { x: 80, rotate: 12, opacity: 0, scale: 0.9 }
                  }
                  transition={{
                    duration: DURATION.normal,
                    ease: EASING.easeOut,
                  }}
                  className="relative w-[260px] h-[400px] md:w-[280px] md:h-[430px] bg-white rounded-2xl shadow-2xl border border-slate-100 z-20 overflow-hidden"
                >
                <div className="h-3/5 bg-slate-50 relative">
                  <div className="w-full h-full relative">
                    <Image 
                      src={product.image} 
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-green-600 border border-green-100 z-10">
                    Est. Profit: {product.profit}
                  </div>
                </div>
              <div className="h-2/5 p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{product.name}</h3>
                  <div className="flex gap-2 mb-3">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Trending</span>
                    <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">US Stock</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    onClick={() => handleSwipe('left')}
                    whileHover={{ scale: 1.05, borderColor: "#ef4444" }}
                    whileTap={{ scale: 0.95 }}
                    className="h-10 rounded-lg border-2 border-slate-200 text-slate-400 hover:border-red-500 hover:text-red-500 hover:bg-red-50 flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    onClick={() => handleSwipe('right')}
                    whileHover={{ scale: 1.05, backgroundColor: "#2563eb" }}
                    whileTap={{ scale: 0.95 }}
                    className="h-10 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 flex items-center justify-center"
                  >
                    <Check className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
                
              {/* Stamp Overlay */}
              <AnimatePresence>
                {direction === 'right' && (
                  <motion.div
                    initial={{ scale: 0, rotate: -12, opacity: 0 }}
                    animate={{ scale: 1, rotate: -12, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: DURATION.fast, ease: EASING.spring }}
                    className="absolute top-8 left-8 border-4 border-green-500 text-green-500 font-black text-2xl uppercase tracking-widest px-4 py-2 rounded -rotate-12 bg-white/50 backdrop-blur z-30"
                  >
                    IMPORTED
                  </motion.div>
                )}
                {direction === 'left' && (
                  <motion.div
                    initial={{ scale: 0, rotate: 12, opacity: 0 }}
                    animate={{ scale: 1, rotate: 12, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: DURATION.fast, ease: EASING.spring }}
                    className="absolute top-8 right-8 border-4 border-red-500 text-red-500 font-black text-2xl uppercase tracking-widest px-4 py-2 rounded rotate-12 bg-white/50 backdrop-blur z-30"
                  >
                    PASS
                  </motion.div>
                )}
              </AnimatePresence>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
};
