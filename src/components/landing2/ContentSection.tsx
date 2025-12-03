"use client"

import Image from 'next/image';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContentSectionProps {
  id: string;
  title: string;
  description: string;
  image: string;
  imagePosition?: 'left' | 'right';
  videoUrl?: string;
  showVideoButton?: boolean;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  id,
  title,
  description,
  image,
  imagePosition = 'right',
  videoUrl,
  showVideoButton = false,
}) => {
  const isImageLeft = imagePosition === 'left';

  return (
    <section id={id} className="py-24 content-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col ${isImageLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}>
          {/* Image Block */}
          <div className="w-full md:w-1/2">
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <div className="aspect-video relative">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                />
                {showVideoButton && videoUrl && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <a 
                      href={videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-20 h-20 bg-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                    >
                      <Play className="w-8 h-8 text-primary-foreground ml-1" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Text Block */}
          <div className="w-full md:w-1/2">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                {title}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {description}
              </p>
              {!showVideoButton && (
                <Button className="mt-6 rounded-md font-semibold">
                  Learn More
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


