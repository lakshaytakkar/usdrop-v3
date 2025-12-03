"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Hero: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Handle form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail('');
    }, 1000);
  };

  return (
    <section id="hero-17" className="relative bg-gradient-to-b from-primary/10 via-background to-background pt-32 pb-20 min-h-[90vh] flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Text - Centered */}
        <div className="flex justify-center">
          <div className="w-full max-w-4xl mx-auto text-center">
            <div className="space-y-8">
              {/* Title */}
              <h2 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                The World's #1 All-in-One<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">
                  Dropshipping Platform
                </span>
              </h2>

              {/* Text */}
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                From winning product research to automated USA delivery. Build a 7-figure brand without ever touching a single product.
              </p>

              {/* Hero Quick Form */}
              <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-12">
                <div className="flex flex-col sm:flex-row gap-3 shadow-lg rounded-md overflow-hidden bg-background p-1">
                  <Input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="flex-1 h-12 px-4 rounded-md border-0 bg-transparent focus-visible:ring-0"
                    required
                  />
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="h-12 px-8 rounded-md font-semibold whitespace-nowrap"
                  >
                    {isSubmitting ? 'Starting...' : 'Start free trial'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  By submitting this form, you accept our Terms of Service and Privacy Policy
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

