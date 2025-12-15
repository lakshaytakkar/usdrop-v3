"use client"

import React from 'react';
import { Container } from './ui';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { MotionFadeIn } from '@/components/motion/MotionFadeIn';
import { DURATION } from '@/lib/motion';

// Image URLs from Figma
const imgGroup = "https://www.figma.com/api/mcp/asset/e9390897-0a45-4579-926b-4b6cb5e4ab45";
const imgGroup1 = "https://www.figma.com/api/mcp/asset/b06ee29c-0209-45db-a3c8-4e05bd276dfe";
const imgGroup2 = "https://www.figma.com/api/mcp/asset/48da1de5-4a82-4560-b1f0-2407db6710e9";
const imgGroup3 = "https://www.figma.com/api/mcp/asset/25446f02-59ef-4150-ad06-9f1484bc9dac";
const imgGroup4 = "https://www.figma.com/api/mcp/asset/93b40751-a8f3-4365-90db-6a30446bda3c";
const imgGroup5 = "https://www.figma.com/api/mcp/asset/3f0a74e6-71ef-415c-819b-8f592ef56907";
const imgGroup6 = "https://www.figma.com/api/mcp/asset/d02f10a0-d475-4593-8589-931f6c1aa6e4";
const imgGroup7 = "https://www.figma.com/api/mcp/asset/086830e4-831b-4957-b830-7185c10feaf7";
const imgGroup1707483144 = "https://www.figma.com/api/mcp/asset/c8ab182e-cac9-4107-8b6f-2dad2e622950";

export const GrowBusinessCTA: React.FC = () => {
  return (
    <Container className="py-16 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: DURATION.normal }}
        className="relative rounded-[24px] shadow-[0px_8px_18px_2px_rgba(0,0,0,0.08)] overflow-hidden w-full"
        style={{
          backgroundImage: "linear-gradient(180deg, rgba(191, 219, 254, 1) 0%, rgba(37, 99, 235, 1) 87.026%)"
        }}
      >
        {/* Decorative Background Images - Left Side */}
        <div className="absolute left-0 top-0 bottom-0 w-1/2 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute -left-[10%] -top-[25%] w-[353px] h-[353px]">
            <img alt="" className="w-full h-full object-contain" src={imgGroup} />
          </div>
          <div className="absolute left-[2%] top-[25%] w-[353px] h-[353px]">
            <img alt="" className="w-full h-full object-contain" src={imgGroup1} />
          </div>
          <div className="absolute left-[8%] top-[5%] w-[353px] h-[353px]">
            <img alt="" className="w-full h-full object-contain" src={imgGroup2} />
          </div>
        </div>

        {/* Decorative Background Images - Right Side */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute -right-[10%] -top-[25%] w-[353px] h-[353px] rotate-180 scale-y-[-1]">
            <img alt="" className="w-full h-full object-contain" src={imgGroup3} />
          </div>
          <div className="absolute right-[2%] top-[25%] w-[353px] h-[353px] rotate-180 scale-y-[-1]">
            <img alt="" className="w-full h-full object-contain" src={imgGroup4} />
          </div>
          <div className="absolute right-[8%] top-[5%] w-[353px] h-[353px] rotate-180 scale-y-[-1]">
            <img alt="" className="w-full h-full object-contain" src={imgGroup5} />
          </div>
        </div>

        {/* Centered Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[400px] md:min-h-[500px] px-6 py-12">
          {/* Icon/Logo */}
          <MotionFadeIn delay={0.2}>
            <div className="relative mb-8 w-20 h-20">
              {/* Try to use the masked icon from Figma */}
              <div className="relative w-full h-full">
                <div 
                  className="absolute inset-0"
                  style={{ 
                    maskImage: `url('${imgGroup6}')`,
                    WebkitMaskImage: `url('${imgGroup6}')`,
                    maskSize: 'contain',
                    WebkitMaskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskPosition: 'center'
                  }}
                >
                  <img alt="" className="w-full h-full object-contain" src={imgGroup7} />
                </div>
              </div>
              {/* Fallback icon container - shown if mask doesn't work */}
              <div className="absolute inset-0 w-20 h-20 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <div className="w-12 h-12 bg-white/30 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">S</span>
                </div>
              </div>
            </div>
          </MotionFadeIn>

          {/* Heading */}
          <MotionFadeIn delay={0.3}>
            <h2 className="text-3xl md:text-4xl lg:text-[36px] font-semibold text-center text-white mb-8 max-w-[494px] leading-tight px-4">
              Ready to Grow Your Business Smarter?
            </h2>
          </MotionFadeIn>

          {/* Button */}
          <MotionFadeIn delay={0.4}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative bg-white/16 backdrop-blur-sm h-[52px] px-4 pr-6 rounded-[54px] flex items-center justify-center gap-3 text-white font-medium text-lg hover:bg-white/20 transition-all shadow-lg cursor-pointer"
              style={{ textShadow: '0px 0.4px 0.3px rgba(0,0,0,0.08)' }}
            >
              <span className="tracking-[-0.18px]">Get CRM Access</span>
              <div className="w-5 h-5 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-white" />
              </div>
            </motion.button>
          </MotionFadeIn>
        </div>
      </motion.div>
    </Container>
  );
};

