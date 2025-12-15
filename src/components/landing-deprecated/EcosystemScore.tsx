"use client"

import React from 'react';
import { TOTAL_ECOSYSTEM_SCORE } from './constants';
import { Trophy, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const EcosystemScore: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm">
            <Trophy className="w-3.5 h-3.5 text-primary" />
            <span>Efficiency Score</span>
        </h3>
        <div className="space-y-2">
            {TOTAL_ECOSYSTEM_SCORE.map((item, index) => {
                const isWinner = index === 0;
                return (
                <div key={item.name} className="relative group">
                    <div className="flex justify-between items-center mb-0.5">
                        <span className={`text-[10px] font-medium ${isWinner ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {index + 1}. {item.name}
                        </span>
                        <span className={`font-mono text-[10px] font-bold ${isWinner ? 'text-primary' : 'text-muted-foreground'}`}>
                            {item.value}/100
                        </span>
                    </div>
                    
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${isWinner ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                        style={{ width: `${item.value}%` }}
                    />
                    </div>
                </div>
                );
            })}
        </div>
      </div>
      
      <div className="pt-3 border-t border-border">
        <h4 className="font-semibold text-foreground mb-2 text-xs">The Ecosystem Advantage</h4>
        <ul className="space-y-1">
            {[
                "5x more data points",
                "Automated store build",
                "Real-time profit tracking",
                "AI Video Ad Generator"
            ].map((point, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[10px] text-muted-foreground">
                    <Check className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                    <span>{point}</span>
                </li>
            ))}
        </ul>
      </div>
      
      <Button className="w-full py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group">
        Start Winning Now
        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
};

