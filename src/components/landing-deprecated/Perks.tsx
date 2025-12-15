"use client"

import React from 'react';
import { Container, Section } from './ui';
import Image from 'next/image';
import { MotionFadeIn } from '@/components/motion/MotionFadeIn';
import { MotionStagger } from '@/components/motion/MotionStagger';
import { MotionCard } from '@/components/motion/MotionCard';
import { MotionImage } from '@/components/motion/MotionImage';

const perks = [
  {
    title: "Save time & money",
    description: "Remain informed about any product trends, market shifts, or potential opportunities that might help scale your business.",
    image: "/images/landing/perks-map.png"
  },
  {
    title: "Handsfree",
    description: "Receive algorithmically detected product drops on a weekly basis, straight to your USDrop portfolio.",
    image: "/images/landing/perks-calendar.png"
  },
  {
    title: "One sale, bill paid",
    description: "Roughly one sale is all you need to cover the cost of a subscription with us. On the other hand, one winner could do wonders.",
    image: "/images/landing/perks-receipt.png"
  }
];

export const Perks: React.FC = () => {
  return (
    <Section className="bg-white">
      <Container>
        <MotionFadeIn delay={0.1}>
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Perks of USDrop</h2>
            <p className="text-slate-500 mt-2 text-base">Built by sellers for sellers with the mission to help entrepreneurs start and grow successful businesses.</p>
          </div>
        </MotionFadeIn>

        <MotionStagger staggerDelay={0.15}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {perks.map((perk, idx) => (
              <MotionCard
                key={idx}
                hoverLift
                hoverShadow
                delay={idx * 0.1}
                className="bg-white border border-slate-200 rounded-3xl p-6"
              >
                <div className="aspect-square w-full mb-6 bg-slate-50 rounded-2xl overflow-hidden relative border border-slate-100">
                  <MotionImage
                    src={perk.image}
                    alt={perk.title}
                    fill
                    className="object-cover opacity-80"
                    hoverScale={1.05}
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{perk.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  {perk.description}
                </p>
              </MotionCard>
            ))}
          </div>
        </MotionStagger>
      </Container>
    </Section>
  );
};

