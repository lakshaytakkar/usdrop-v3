

import React from 'react';
import { Container, Section } from './ui';
import { ArrowRight } from 'lucide-react';
import { MotionFadeIn } from '@/components/motion/MotionFadeIn';
import { MotionStagger } from '@/components/motion/MotionStagger';
import { MotionCard } from '@/components/motion/MotionCard';
import { MotionIcon } from '@/components/motion/MotionIcon';

interface ProblemSolution {
  problem: string;
  solution: string;
}

const problemsSolutions: ProblemSolution[] = [
  {
    problem: 'Slow 30-day shipping from China',
    solution: 'Fast 2-5 day delivery from US warehouses'
  },
  {
    problem: 'Manual work: photos, descriptions, ads',
    solution: 'AI automation: generate everything in seconds'
  },
  {
    problem: 'High costs and low margins',
    solution: 'Wholesale pricing with no minimum orders'
  },
  {
    problem: 'No support when things go wrong',
    solution: '24/7 US-based support team'
  }
];

export const ProblemSolution: React.FC = () => {
  return (
    <Section className="bg-white">
      <Container>
        <MotionFadeIn delay={0.1}>
          <div className="text-center mb-10 max-w-3xl mx-auto">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">
              The USDrop Difference
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Stop Struggling. Start Scaling.
            </h2>
            <p className="text-slate-500 text-base">
              We solved every problem that makes dropshipping hard.
            </p>
          </div>
        </MotionFadeIn>

        <MotionStagger staggerDelay={0.15}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {problemsSolutions.map((item, index) => (
              <MotionCard
                key={index}
                hoverLift
                hoverShadow
                delay={index * 0.1}
                className="bg-white border border-slate-200 rounded-2xl p-5"
              >
                <div className="flex items-start gap-4">
                  {/* Problem */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-slate-400">×</span>
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Problem</span>
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      {item.problem}
                    </p>
                  </div>

                  {/* Arrow */}
                  <MotionIcon hoverRotate={15} className="shrink-0 pt-6">
                    <ArrowRight className="w-5 h-5 text-blue-600" />
                  </MotionIcon>

                  {/* Solution */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-blue-600">✓</span>
                      </div>
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Solution</span>
                    </div>
                    <p className="text-sm text-slate-900 font-semibold leading-relaxed">
                      {item.solution}
                    </p>
                  </div>
                </div>
              </MotionCard>
            ))}
          </div>
        </MotionStagger>
      </Container>
    </Section>
  );
};
