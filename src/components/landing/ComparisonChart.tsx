"use client"

import React, { useMemo } from 'react';
import { COMPETITORS, FEATURES } from './constants';
import { Check, X } from 'lucide-react';
import Image from 'next/image';

// Transform competitor data and calculate heights
const useChartData = () => {
  return useMemo(() => {
    const sorted = [...COMPETITORS].sort((a, b) => b.totalScore - a.totalScore);
    const maxScore = sorted[0].totalScore;
    
    return sorted.map((comp, index) => {
      // USDrop AI gets 100%, others get progressively smaller with basic differences
      let heightPercentage;
      if (index === 0) {
        heightPercentage = 100; // USDrop AI - largest
      } else if (index === 1) {
        heightPercentage = 70; // Second place
      } else if (index === 2) {
        heightPercentage = 65; // Third place
      } else if (index === 3) {
        heightPercentage = 60; // Fourth place
      } else {
        heightPercentage = 55; // Fifth place
      }
      
      return {
        id: comp.id,
        name: comp.name,
        role: comp.role,
        color: comp.color,
        gradientFrom: comp.gradientFrom,
        gradientTo: comp.gradientTo,
        pricing: comp.pricing,
        keyFeatures: comp.keyFeatures || [],
        features: comp.features,
        totalScore: comp.totalScore,
        heightPercentage: heightPercentage,
      };
    });
  }, []);
};

interface CompetitorBarProps {
  competitor: typeof COMPETITORS[0] & { heightPercentage: number };
  index: number;
  isWinner: boolean;
}

const CompetitorBar: React.FC<CompetitorBarProps> = ({ competitor, isWinner }) => {
  // Calculate actual height based on percentage of max height (600px)
  const maxBarHeight = 600;
  const actualHeight = (competitor.heightPercentage / 100) * maxBarHeight;
  const barHeight = `${actualHeight}px`;
  
  // Darker gradient colors
  const darkerGradientFrom = competitor.gradientFrom === '#8b5cf6' ? '#6d28d9' : 
                             competitor.gradientFrom === '#f97316' ? '#c2410c' :
                             competitor.gradientFrom === '#06b6d4' ? '#0e7490' :
                             competitor.gradientFrom === '#10b981' ? '#047857' :
                             '#6d28d9'; // Spocket now uses purple like USDrop AI
  
  const darkerGradientTo = competitor.gradientTo === '#7c3aed' ? '#5b21b6' :
                           competitor.gradientTo === '#ea580c' ? '#9a3412' :
                           competitor.gradientTo === '#0891b2' ? '#155e75' :
                           competitor.gradientTo === '#059669' ? '#065f46' :
                           '#5b21b6'; // Spocket now uses purple like USDrop AI
  
  return (
    <div className="flex-1 relative flex flex-col items-center mx-2">
      {/* Crown Icon (Winner Only) */}
      {isWinner && (
        <div className="absolute -top-16 z-10">
          <Image
            src="/3d-icons/crown.png"
            alt="Crown"
            width={64}
            height={64}
            className="animate-bounce drop-shadow-lg"
            style={{ animationDuration: '3s' }}
          />
        </div>
      )}
      
      {/* Platform Name in Pill - Outside/Above Bar */}
      <div className="mb-3">
        <div 
          className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 border border-white/30"
          style={{
            background: `linear-gradient(135deg, ${darkerGradientFrom}20 0%, ${darkerGradientTo}20 100%)`,
            borderColor: `${darkerGradientFrom}40`,
          }}
        >
          <div 
            className="text-lg font-bold drop-shadow-md text-center whitespace-nowrap"
            style={{ color: darkerGradientFrom }}
          >
            {competitor.name}
          </div>
        </div>
      </div>
      
      {/* Bar Container */}
      <div
        className="relative w-full rounded-t-2xl flex flex-col items-center justify-between shadow-lg"
        style={{
          height: barHeight,
          background: `linear-gradient(180deg, ${darkerGradientFrom} 0%, ${darkerGradientTo} 100%)`,
        }}
      >
        {/* #1 Badge (Winner Only) */}
        {isWinner && (
          <div className="absolute top-4 left-2 bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-lg px-2 py-1">
            <span className="text-white font-bold text-sm">#1</span>
          </div>
        )}
        
        {/* All Features List with Checkmarks/Crosses */}
        <div className="flex-1 flex flex-col justify-center gap-2.5 mt-6 mb-4 px-4 w-full">
          {FEATURES.map((feature) => {
            const hasFeature = competitor.features[feature] || false;
            return (
              <div key={feature} className="flex items-center gap-2">
                {hasFeature ? (
                  <Check className="w-4 h-4 text-white flex-shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-red-500 flex-shrink-0" />
                )}
                <span className={`text-sm text-white leading-tight ${!hasFeature ? 'opacity-60' : ''}`}>
                  {feature}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Pricing Below Bar - Colored */}
      <div className="mt-4">
        <div
          className="text-2xl font-black text-center"
          style={{
            color: darkerGradientFrom,
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
            letterSpacing: '0.05em',
          }}
        >
          {competitor.pricing}
        </div>
      </div>
    </div>
  );
};

export const ComparisonChart: React.FC = () => {
  const chartData = useChartData();
  
  return (
    <div className="w-full relative">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 39px, hsl(var(--border)) 39px, hsl(var(--border)) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 39px, hsl(var(--border)) 39px, hsl(var(--border)) 40px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Chart Container */}
      <div className="relative z-10">
        {/* Bars Container - With margins between bars */}
        <div className="flex items-end gap-0 h-[600px] justify-center">
          {chartData.map((competitor, index) => (
            <CompetitorBar
              key={competitor.id}
              competitor={competitor}
              index={index}
              isWinner={index === 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
