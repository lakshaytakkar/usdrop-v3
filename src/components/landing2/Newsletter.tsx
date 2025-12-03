"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Handle newsletter subscription
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail('');
    }, 1000);
  };

  return (
    <section id="newsletter-1" className="py-16 newsletter-section bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Newsletter Text */}
          <div className="flex-1">
            <h4 className="text-3xl md:text-4xl font-bold text-foreground">
              Stay up to date with our news, ideas and updates
            </h4>
          </div>

          {/* Newsletter Form */}
          <div className="flex-1 w-full md:w-auto">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 h-12 px-4 rounded-md border-border bg-background"
                required
              />
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="h-12 px-8 rounded-md font-semibold whitespace-nowrap"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};


