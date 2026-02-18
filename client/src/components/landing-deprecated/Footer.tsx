

import React from 'react';
import { Container, Button } from './ui';
import { Package } from 'lucide-react';
import { motion } from 'motion/react';
import { MotionFadeIn } from '@/components/motion/MotionFadeIn';
import { MotionStagger } from '@/components/motion/MotionStagger';
import { MotionButton } from '@/components/motion/MotionButton';
import { MotionIcon } from '@/components/motion/MotionIcon';
import { DURATION, EASING } from '@/lib/motion';

export const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: DURATION.normal, ease: EASING.easeOut }}
      className="bg-white"
    >
      <Container>
        {/* Blue CTA Box */}
        <MotionFadeIn delay={0.1}>
          <div className="bg-blue-600 rounded-3xl p-8 md:p-10 text-center text-white mb-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-2xl md:text-3xl font-bold"
              >
                Try USDrop with a 7-day trial
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-blue-100 text-base"
              >
                Perfect for beginners looking to dive into dropshipping! Explore all our tools, with no commitment—cancel anytime.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center gap-6 text-sm font-medium text-blue-100 py-2"
              >
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-white rounded-full"/> Try today</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-white rounded-full"/> 100% risk-free</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-white rounded-full"/> Cancel anytime</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="pt-2"
              >
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: DURATION.fast, ease: EASING.easeOut }}
                >
                  <Button variant="white" size="lg" className="rounded-lg h-12 px-10 text-slate-900">
                    Try For Free
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </MotionFadeIn>

        {/* Links */}
        <MotionStagger staggerDelay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 pb-10 border-b border-slate-100">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="col-span-2 md:col-span-1 space-y-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="bg-blue-600 text-white p-1 rounded-md"
                >
                  <Package size={16} />
                </motion.div>
                <span className="text-lg font-bold text-slate-900">USDrop</span>
              </div>
              <p className="text-sm text-slate-500">Discover Products With Potential</p>
            </motion.div>
            
            {[
              {
                title: "Products",
                links: ["Product Library", "Ad Library", "Portfolio", "Competitor Research", "Magic AI Search"]
              },
              {
                title: "Free Tools",
                links: ["Interest Explorer", "Numbers Breakdown", "CPA Calculator", "ROAS Calculator"]
              },
              {
                title: "Company",
                links: ["Pricing", "About", "Contact"]
              },
              {
                title: "Resources",
                links: ["Blog", "Community", "Dropship University", "FAQs"]
              }
            ].map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: sectionIndex * 0.1 }}
                className="space-y-4"
              >
                <h4 className="font-bold text-slate-900">{section.title}</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <motion.a
                        href="#"
                        whileHover={{ x: 4, color: "#2563eb" }}
                        className="inline-block"
                      >
                        {link}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </MotionStagger>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="py-6 flex items-center justify-between text-xs text-slate-400 font-medium"
        >
          <div className="flex gap-4">
            <span>United Arab Emirates</span>
          </div>
          <div className="flex gap-4">
            {["EN", "DE", "ES", "FR"].map((lang, i) => (
              <motion.span
                key={lang}
                whileHover={{ scale: 1.1, color: "#2563eb" }}
                className="cursor-pointer"
              >
                {lang}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </Container>
    </motion.footer>
  );
};
