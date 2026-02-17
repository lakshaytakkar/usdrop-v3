"use client"

import React from 'react';
import { motion } from 'motion/react';
import { Container, Section, Button } from './ui';
import Image from 'next/image';
import { MotionFadeIn } from '@/components/motion/MotionFadeIn';
import { MotionStagger } from '@/components/motion/MotionStagger';
import { MotionCard } from '@/components/motion/MotionCard';
import { MotionImage } from '@/components/motion/MotionImage';
import { MotionButton } from '@/components/motion/MotionButton';
import { DURATION, EASING } from '@/lib/motion';

const articles = [
  {
    title: "7 Best TikTok Agency Ad Account Providers in 2025",
    date: "October 1, 2025",
    readTime: "9 min read time",
    author: "Adeel Q",
    image: "/images/landing/blog-tiktok.png"
  },
  {
    title: "8 High-Margin Products for Dropshipping",
    date: "June 28, 2025",
    readTime: "18 min read time",
    author: "Aaron M",
    image: "/images/landing/blog-electronics.png"
  },
  {
    title: "9 Best Dropshipping Niches for 2025",
    date: "June 28, 2025",
    readTime: "24 min read time",
    author: "Rebecca G",
    image: "/images/landing/blog-strategy.png"
  }
];

export const Blog: React.FC = () => {
  return (
    <Section className="bg-white pt-0 pb-16">
      <Container>
        <MotionFadeIn delay={0.1}>
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Browse our latest articles</h2>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: DURATION.fast, ease: EASING.easeOut }}
            >
              <Button variant="outline" size="sm" className="rounded-lg">View Blog</Button>
            </motion.div>
          </div>
        </MotionFadeIn>

        <MotionStagger staggerDelay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article, idx) => (
              <MotionCard
                key={idx}
                hoverLift={false}
                hoverShadow={false}
                delay={idx * 0.1}
                className="cursor-pointer"
              >
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 mb-4 border border-slate-200 relative">
                  <MotionImage
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                    hoverScale={1.05}
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-medium">
                  <span>{article.date}</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 hover:text-blue-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${idx}`} alt={article.author} className="w-full h-full" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{article.author}</span>
                </div>
              </MotionCard>
            ))}
          </div>
        </MotionStagger>
      </Container>
    </Section>
  );
};

