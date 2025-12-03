"use client"

import { Button } from '@/components/ui/button';
import Image from 'next/image';

export const Banner: React.FC = () => {
  return (
    <section id="banner-13" className="py-24 banner-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-12 md:p-16">
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Banner Text */}
              <div className="flex-1 text-white">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Getting started with USDrop today!
                </h2>
                <p className="text-lg text-white/90 mb-8">
                  Join thousands of successful dropshippers who are building 7-figure brands with our platform.
                </p>
                <Button 
                  size="lg"
                  variant="secondary"
                  className="rounded-md font-semibold px-8"
                >
                  Get started - it's free
                </Button>
              </div>

              {/* Banner Image */}
              <div className="flex-1 text-center">
                <div className="relative w-full max-w-md mx-auto">
                  <div className="aspect-square relative">
                    <Image
                      src="/landing/dashboard-preview.png"
                      alt="USDrop Dashboard"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


